// set port, listen for requests
require('dotenv').config();
const server = require('./api/index');

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
