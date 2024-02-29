const express = require('express');
const userRouter = require('../modules/user/routes/user.router');
const userAdminRouter = require('../modules/employee/routes/employee.router');
const benefitRouter = require('../modules/benefit/routes/benefit.router');
const eventRouter = require('../modules/event/routes/event.router');

const router = express.Router();

router.use(userRouter);
router.use(userAdminRouter);
router.use(benefitRouter);
router.use(eventRouter);

module.exports = router;
