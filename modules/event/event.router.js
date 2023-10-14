const express = require('express');
const {
  userAdminAuthenticated,
  authenticated
} = require('../../middleware/auth/authorization');
const {
  maxPageSizeValidation
} = require('../../middleware/pagination/paginationValidation');
const {
  getAllEvent,
  addNewEvent,
  editEvent,
  removeEvent
} = require('./event.controller');
const { getEventById } = require('./event.controller');
const { upload } = require('../../middleware/file/multer');
const {
  createEventValidation,
  editEventValidation
} = require('../../middleware/validations/eventValidation');

const router = express.Router();

// Start of Internal API Side Router
router.get(
  '/admin/events',
  userAdminAuthenticated,
  maxPageSizeValidation,
  getAllEvent
);
router.get('/admin/events/:id', userAdminAuthenticated, getEventById);
router.post(
  '/admin/events',
  userAdminAuthenticated,
  upload.single('image'),
  createEventValidation,
  addNewEvent
);
router.put(
  '/admin/events/:id',
  userAdminAuthenticated,
  upload.single('image'),
  editEventValidation,
  editEvent
);
router.delete('/admin/events/:id', userAdminAuthenticated, removeEvent);
// End of Internal API Side Router

// Start of Public API Side Router
router.get('/events', authenticated, maxPageSizeValidation, getAllEvent);
router.get('/events/:id', authenticated, getEventById);
// End of Public API Side Router

module.exports = router;
