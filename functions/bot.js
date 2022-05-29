/* Import Modules */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function createTranscript(id, ticket) {
  let t = ticket;
  t.members.sort();
  fetch('http://localhost:7080/api/ticket/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guild: id,
      ticket,
    }),
  });
}

module.exports = {
  createTranscript,
};
