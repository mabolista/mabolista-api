const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http');
const swaggerJsDoc = require('swagger-jsdoc');
const router = require('../route/index');
const apiDocumentation = require('../apidocs.json');

const CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

const app = express();

const options = {
  definition: {
    apiDocumentation
  },
  apis: ['src/**/*.js']
};
const specs = swaggerJsDoc(options);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { customCssUrl: CSS_URL })
);

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

app.use('/api', router);

const server = createServer(app);

module.exports = server;
