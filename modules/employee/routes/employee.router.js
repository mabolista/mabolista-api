const express = require('express');
const {
  currentUserAdminValidation,
  userAdminRegisterValidation,
  userAdminLoginValidation
} = require('../../../middleware/validations/userAdminValidation');
const {
  userAdminAuthenticated
} = require('../../../middleware/auth/authorization');
const EmployeeController = require('../controllers/employee.controller');

const router = express.Router();

router.post(
  '/admin/register',
  userAdminRegisterValidation,
  EmployeeController.userAdminRegister
);
router.post(
  '/admin/login',
  userAdminLoginValidation,
  EmployeeController.userAdminLogin
);
router.get(
  '/admin/detail/:id',
  userAdminAuthenticated,
  currentUserAdminValidation,
  EmployeeController.getUserAdminById
);

module.exports = router;
