const express = require('express');
const {
  userAdminAuthenticated,
  authenticated
} = require('../../../middleware/auth/authorization');
const {
  maxPageSizeValidation
} = require('../../../middleware/pagination/paginationValidation');
const {
  getAllEvent,
  addNewEvent,
  editEvent,
  removeEvent,
  userJoinToEvent,
  userLeftEvent,
  userJoinToEventByAdmin,
  userLeftEventByAdmin
} = require('../controllers/event.controller');
const { getEventById } = require('../controllers/event.controller');
const { upload } = require('../../../middleware/file/multer');
const {
  createEventValidation,
  editEventValidation
} = require('../../../middleware/validations/eventValidation');

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
router.post(
  '/admin/event/join-event',
  userAdminAuthenticated,
  userJoinToEventByAdmin
);
router.delete(
  '/admin/event/left-event',
  userAdminAuthenticated,
  userLeftEventByAdmin
);
// End of Internal API Side Router

// Start of Public API Side Router
router.get('/events', maxPageSizeValidation, getAllEvent);
router.get('/events/:id', getEventById);
router.post('/events/join-event', authenticated, userJoinToEvent);
router.delete('/events/left-event', authenticated, userLeftEvent);
// End of Public API Side Router

module.exports = router;
