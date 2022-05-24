const { join } = require('path');

const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('In working');
});

router.get('/ticket/:guild/:channel', (req, res) => {
  const { password, user } = req.query;
  const { guild, channel } = req.params;

  res.sendFile(join(__dirname, `../cdn/tickets/${guild}/${channel}.html`));
});

module.exports = router;
