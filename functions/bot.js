/* Import Modules */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function createTranscript(id, ticket) {
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
