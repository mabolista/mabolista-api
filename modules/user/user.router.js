const express = require('express');
const {
  getAllUser,
  register,
  editUser,
  getUserById,
  login
} = require('./user.controller');
const {
  registerValidation,
  editUserValidation,
  loginValidation
} = require('../../middleware/validations/userValidation');
const { authenticated } = require('../../middleware/auth/authorization');
const {
  maxPageSizeValidation
} = require('../../middleware/pagination/paginationValidation');

const router = express.Router();

router.get('/users', maxPageSizeValidation, getAllUser);
router.get('/users/:id', getUserById);
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.put('/users/:id', authenticated, editUserValidation, editUser);

module.exports = router;
