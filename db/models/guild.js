const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guildSchema = new Schema({
  id: { type: String, unique: true },
  badges: { type: Array, default: [] },
  tickets: { type: Array, default: [] },
  staff: { type: Array, default: [] },
  staff_role: { type: String, default: 'none' },
  options: {
    type: Array,
    default: [{
      label: 'No reason provided',
      description: 'This guild has not been set up yet. Please contact an administrator of this guild.',
      value: '0',
    }],
  },
  log: { type: Array, default: [] },
  setuped: { type: Boolean, default: false },
  nameprefix: { type: String, default: 'ticket-{id}' },
  ticketid: { type: Number, default: 1 },
}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;
