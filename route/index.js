const express = require('express');
const userRouter = require('../modules/user/user.router');
const userAdminRouter = require('../modules/employee/employee.router');
const benefitRouter = require('../modules/benefit/benefit.router');
const eventRouter = require('../modules/event/event.router');

const router = express.Router();

router.use(userRouter);
router.use(userAdminRouter);
router.use(benefitRouter);
router.use(eventRouter);

module.exports = router;
