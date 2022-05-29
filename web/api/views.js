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

    let guild = client.guilds.cache.get(req.params.id);
    Guild.findOne({ id: req.params.id }).then(async (dbGuild) => {
      if (!dbGuild || !guild) return res.redirect('/dashboard');

      await res.render(join(__dirname, '../views/server.ejs'), {
        user: req.session.passport.user,
        guild: dbGuild,
        db: dbGuild
      });
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
