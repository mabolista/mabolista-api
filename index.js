const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./route/index');

const app = express();

dotenv.config();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({
    message: 'Mabolista simple route'
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.use(router);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
