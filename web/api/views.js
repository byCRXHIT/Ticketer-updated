const { join } = require('path');
const { Permissions } = require('discord.js');

const Guild = require('../../db/models/guild');

module.exports = (app, client) => {
  app.get('/', (req, res) => {
    let user = false;
    if (req.session.passport) user = req.session.passport.user;
    res.render(join(__dirname, '../views/index.ejs'), {
      user,
    });
  });

  app.get('/dashboard', async (req, res) => {
    if (!req.session.passport) return res.redirect('/api/login');

    let guilds = [];

    await req.session.passport.user.guilds.forEach(async (guild) => {
      let joined = false;
      if(client.guilds.cache.get(guild.id)) joined = true;

      let permissions;

      try {
        permissions = new Permissions(guild.permissions_new);
        if(!permissions.has(Permissions.FLAGS.MANAGED)) return;
      } catch (e) {
        return
      }
      
      await guilds.push({
        id: guild.id,
        name: guild.name,
        icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`,
        joined,
      });
    })

    await res.render(join(__dirname, '../views/dashboard.ejs'), {
      user: req.session.passport.user,
      guilds,
    });
  });

  app.get('/dashboard/:id', async (req, res) => {
    if (!req.session.passport) return res.redirect('/api/login');
    if (!req.params.id) return res.redirect('/dashboard');

    let guild;
    try {
      guild = await client.guilds.fetch(req.params.id);
    } catch(e) {
      return res.redirect('/dashboard')
    }

    if(!guild) return res.redirect('/dashboard')

    Guild.findOne({ id: req.params.id }).then(async (dbGuild) => {
      if (!dbGuild || !guild) return res.redirect('/dashboard');

      await res.render(join(__dirname, '../views/server.ejs'), {
        user: req.session.passport.user,
        guild,
        db: dbGuild
      });
    })
  })

  app.get('/dashboard/:id/tickets', async (req, res) => {
    if (!req.session.passport) return res.redirect('/api/login');
    if (!req.params.id) return res.redirect('/dashboard');

    let guild = await client.guilds.fetch(req.params.id);
    Guild.findOne({ id: req.params.id }).then(async (dbGuild) => {
      if (!dbGuild || !guild) return res.redirect('/dashboard');

      let tickets = [];

      await dbGuild.tickets.forEach(async (ticket) => {
        ticket.authorUser = await client.users.fetch(ticket.creator);
        ticket.authorUser = ticket.authorUser.tag;
        if(ticket.claimed !== 'none') ticket.staffUser = await client.users.fetch(ticket.claimed);
        if(ticket.claimed == 'none') ticket.staffUser = 'none';
        if(ticket.staffUser !== 'none') ticket.staffUser = ticket.staffUser.tag;
        
        await tickets.push(ticket)
      })

      setTimeout(() => {
        res.render(join(__dirname, '../views/tickets.ejs'), {
          user: req.session.passport.user,
          guild,
          db: dbGuild,
          tickets
        });
      }, 400)
    })
  })

  app.get('/dashboard/:id/settings', async (req, res) => {
    if (!req.session.passport) return res.redirect('/api/login');
    if (!req.params.id) return res.redirect('/dashboard');

    let guild = await client.guilds.fetch(req.params.id);
    Guild.findOne({ id: req.params.id }).then(async (dbGuild) => {
      if (!dbGuild || !guild) return res.redirect('/dashboard');

      let categorys = [];
      let channels = [];

      await guild.channels.cache.filter(ch => ch.type === 'GUILD_CATEGORY').forEach(async (category) => {
        await categorys.push({ name: category.name, id: category.id })
      })

      await guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').forEach(async (channel) => {
        await channels.push({ name: channel.name, id: channel.id })
      })

      setTimeout(async() => {
        await res.render(join(__dirname, '../views/settings.ejs'), {
          user: req.session.passport.user,
          guild,
          db: dbGuild,
          categorys,
          channels
        });
      }, 200)
    })
  })
  
  app.get('/ticket/:guild/:channel', (req, res) => {
    const { password } = req.query;
    const { guild, channel } = req.params;
  
    if (password == String(guild).substring(0, guild.length / 2) + String(channel).substring(channel.length / 2, channel.length)) {
      res.sendFile(join(__dirname, `../cdn/tickets/${guild}/${channel}.html`));
    } else res.send('Wrong password');
  });

  return app
}
