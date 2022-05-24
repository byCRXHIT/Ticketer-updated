const { join } = require('path');

const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('In working');
});

router.get('/ticket/:guild/:channel', (req, res) => {
  const { password } = req.query;
  const { guild, channel } = req.params;

  if (password == String(guild).substring(0, guild.length / 2) + String(channel).substring(channel.length / 2, channel.length)) {
    res.sendFile(join(__dirname, `../cdn/tickets/${guild}/${channel}.html`));
  } else res.send('Wrong password');
});

module.exports = router;
