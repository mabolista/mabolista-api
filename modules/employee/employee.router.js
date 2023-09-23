const express = require('express');
const {
  userAdminRegister,
  getUserAdminById,
  userAdminLogin
} = require('./employee.controller');
const {
  currentUserAdminValidation,
  userAdminRegisterValidation,
  userAdminLoginValidation
} = require('../../middleware/validations/userAdminValidation');
const {
  userAdminAuthenticated
} = require('../../middleware/auth/authorization');

const router = express.Router();

router.post('/admin/register', userAdminRegisterValidation, userAdminRegister);
router.post('/admin/login', userAdminLoginValidation, userAdminLogin);
router.get(
  '/admin/users/:id',
  userAdminAuthenticated,
  currentUserAdminValidation,
  getUserAdminById
);

module.exports = router;
