const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http');
const router = require('../route/index');
const apiDocumentation = require('../apidocs.json');

const app = express();

const corsOptions = {
  origin: '*',
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

dotenv.config();

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

app.use('/api', router);

const server = createServer(app);

module.exports = server;
