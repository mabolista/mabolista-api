const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http');
const router = require('../route/index');
const apiDocumentation = require('../apidocs.json');
const allowCors = require('../shared-v1/utils/handleCors');
const {
  maxPageSizeValidation
} = require('../middleware/pagination/paginationValidation');
const { getAllEvent } = require('../modules/event/event.controller');

const app = express();

app.use(cors());

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

app.get('/api/events', maxPageSizeValidation, allowCors(getAllEvent));

// app.use('/api', allowCors(router));

const server = createServer(app);

module.exports = server;
