const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const Guild = require('../../db/models/guild');

module.exports = (app, client) => {
  var scopes = ['identify', 'guilds'];

  passport.use(new DiscordStrategy({
    clientID: client.user.id,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://ticketer.developersdungeon.xyz/api/callback',
    scope: scopes
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  app.get('/api', (req, res) => {
    res.send('Api online');
  });
  
  app.get('/api/login', passport.authenticate('discord'));

  app.get('/api/callback', passport.authenticate('discord', {
    failureRedirect: '/',
    session: true,
  }), async (req, res) => {
    await res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
  })
  
  app.post('/api/ticket/create', (req, res) => {
    const { guild, ticket } = req.body;
  
    let members = '';
    ticket.members.forEach((member) => {
      members += `<div class="user"><div class="img"></div><a class="name">${member.name}</a></div>`;
    });
  
    let messages = '';
    ticket.messages.forEach((message) => {
      const date = new Date(message.timestamp);
      messages += `<div class="message"><div class="user"><div class="img"></div><a>${message.name} (${date.getMonth()}.${date.getDate()}.${date.getFullYear()}, ${date.getMilliseconds()}:${date.getMinutes()}:${date.getHours()})</a></div><a class="value">${message.message}</a></div>`;
    });
  
    const file = `
      <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Transcript - Ticket ${ticket.id}</title>
          </head>
          <body>
              <nav>
                  <a class="logo">Ticketer</a>
                  <p>Ticket ${ticket.id}</p>
              </nav>
              <div class="content">
                  <div class="messages">
                      ${messages}
                      ${ticket.state == 'closed' ? '<div class="message"><div class="user"><div class="img"></div><a>System</a></div><a class="value">This ticket has been closed.</a></div>' : ''}
                  </div>
                  <div class="users">
                      <div class="list">
                          <div class="head">
                              <p>Members</p>
                              <p>${ticket.members.length}</p>
                          </div>
                          ${members}
                      </div>
                  </div>
              </div>
              <style>@import url(https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap);body{padding:0;margin:0;top:0;left:0;overflow:hidden;font-family:Poppins,sans-serif;font-size:14px;background-color:#111}nav{padding:10px 20px;width:100vw;user-select:none;display:flex;flex-direction:row;align-items:flex-end}nav a{color:#fff;font-weight:600;font-size:1.6rem}nav p{color:#bcbcbc;font-weight:500;font-size:1.2rem;padding:0;margin:0 15px 2px}.content{display:flex;flex-direction:row;color:#fff;height:100%;width:100%}.content .users{height:100%;width:20%;display:flex;flex-direction:row;justify-content:center}.content .list{background-color:#181818;height:85%;width:300px;border-radius:9px;padding:10px}.content .list .head{color:#fff;display:flex;flex-direction:row;align-items:flex-end;justify-content:space-between;margin-bottom:10px}.content .list .head p{margin:0;font-size:1.1rem}.content .list .head p:nth-child(1){margin:0;font-size:1.25rem;font-weight:500}.content .list .head p:nth-child(2){color:#979797}.content .list .user{display:flex;flex-direction:row;align-items:center;padding:0;margin:12px 0}.content .list .user .img{width:34px;height:34px;background-color:#464646;border-radius:100%}.content .list .user{margin-left:10px;font-size:1.15rem}.content .list .user .name{margin-left:10px;font-size:1.15rem}.content .messages{height:90%;width:80%;padding:10px 20px;overflow-y:scroll}.content .messages::-webkit-scrollbar{width:8px;background-color:#000;position:absolute;border-radius:10px}.content .messages::-webkit-scrollbar-thumb{background:#2361ff;border-radius:10px}.content .messages::-webkit-scrollbar-thumb:hover{background:#2150c9}.content .messages .message{background-color:#181818;border-radius:9px;max-width:90%;padding:10px}.content .messages .message:not(:first-child){margin-top:10px}.content .messages .message .user{display:flex;flex-direction:row;align-items:center;margin-bottom:10px}.content .messages .message .user .img{width:32px;height:32px;border-radius:100%;background-color:#6a6a6a}.content .messages .message .user a{margin-left:10px;font-size:1rem;font-weight:500}.content .messages .message .value{overflow-wrap:break-word}</style>
          </body>
      </html>
    `;
  
    if (!existsSync(join(__dirname, `../cdn/tickets/${guild}/`))) {
      mkdirSync(join(__dirname, `../cdn/tickets/${guild}/`), { recursive: true });
    }
  
    writeFileSync(
      join(__dirname, `../cdn/tickets/${guild}/${ticket.channel}.html`),
      file,
      { overwrite: true },
    );
  
    res.json({ saved: true });
  });

  app.post('/api/setting/name', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if(!value || !guildId || !userId) return res.json({ saved: false })

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if(!dbGuild || !guild) return res.json({ saved: false });
      if(!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.nameprefix = value;
      dbGuild.save();

      res.json({ saved: true })
    });
  })

  app.post('/api/setting/channel', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if(!value || !guildId || !userId) return res.json({ saved: false })

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if(!dbGuild || !guild) return res.json({ saved: false });
      if(!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      try {
        const channel = await guild.channels.fetch(dbGuild.settings.channel);
        if(channel) {
          const msg = await channel.messages.fetch(dbGuild.settings.message);
          msg.delete();
        }
      } catch(e) {}

      dbGuild.settings.channel = value;
      dbGuild.save();

      res.json({ saved: true })

      const createEmbed = new MessageEmbed()
      .setTitle('> Ticket')
      .setDescription(dbGuild.settings.messages.create.replaceAll('\\n', '\n'))
      .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL({ dynamic: true }) });

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('ticket-create')
            .setDisabled(false)
            .setEmoji('🎫')
            .setStyle('SUCCESS'),
      );

      try {
        const message = await client.channels.cache.get(value).send({ embeds: [createEmbed], components: [row] });
        dbGuild.settings.message = message.id;
        dbGuild.save();
      } catch(e) {
        return
      }
    });
  })

  app.post('/api/setting/category', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if(!value || !guildId || !userId) return res.json({ saved: false })

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if(!dbGuild || !guild) return res.json({ saved: false });
      if(!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.category = value;
      dbGuild.save();

      res.json({ saved: true })
    });
  })

  app.post('/api/setting/maxtickets', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if(!value || !guildId || !userId || Number(value) < 1 || Number(value) > 10) return res.json({ saved: false })

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if(!dbGuild || !guild) return res.json({ saved: false });
      if(!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.maxtickets = String(value);
      dbGuild.save();

      res.json({ saved: true })
    });
  })

  app.post('/api/setting/message', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if(!value || !guildId || !userId || Number(value) < 1 || Number(value) > 10) return res.json({ saved: false })

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if(!dbGuild || !guild) return res.json({ saved: false });
      if(!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.messages.create = String(value);
      dbGuild.save();

      res.json({ saved: true })
    });
  })

  return app;
}