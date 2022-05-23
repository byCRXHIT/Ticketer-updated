const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guildSchema = new Schema({
  id: { type: String, unique: true },
  badges: { type: Array, default: [] },
  tickets: { type: Array, default: [] },
  options: {
    type: Array,
    default: [{
      label: 'No reason provided',
      description: 'This guild has not been set up yet. Please contact an administrator of this guild.',
      value: '0',
    }],
  },
  settings: {
    staff: {
      role: { type: String, default: 'none' },
      members: { type: Array, default: [] },
    },
    transcript: {
      type: { type: String, default: 'simple' },
      enabled: { type: Boolean, default: false },
    },
  },
  log: { type: Array, default: [] },
  nameprefix: { type: String, default: 'ticket-{id}' },
  ticketid: { type: Number, default: 1 },
}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;
