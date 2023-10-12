const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./modules/user/user.router');
const userAdminRouter = require('./modules/employee/employee.router');
const benefitRouter = require('./modules/benefit/benefit.router');
const eventAdminRouter = require('./modules/event/event.router');

const app = express();

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:8080'
};

app.use(cors(corsOptions));

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

app.use(userRouter);
app.use(userAdminRouter);
app.use(benefitRouter);
app.use(eventAdminRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
});
