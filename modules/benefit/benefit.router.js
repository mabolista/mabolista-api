const express = require('express');

const {
  maxPageSizeValidation
} = require('../../middleware/pagination/paginationValidation');
const { upload } = require('../../middleware/file/multer');
const {
  getAllBenefit,
  getBenefitById,
  addBenefit,
  editBenefit,
  removeBenefit
} = require('./benefits.controller');
const {
  userAdminAuthenticated
} = require('../../middleware/auth/authorization');
const {
  createBenefitValidation,
  editBenefitValidation
} = require('../../middleware/validations/benefitValidation');
const { getJoinEventBenefit } = require('./benefits.controller');

const router = express.Router();

router.get('/admin/joineb', getJoinEventBenefit);
router.get(
  '/admin/benefits',
  userAdminAuthenticated,
  maxPageSizeValidation,
  getAllBenefit
);
router.get('/admin/benefits/:id', userAdminAuthenticated, getBenefitById);
router.post(
  '/admin/benefits',
  userAdminAuthenticated,
  upload.single('image'),
  createBenefitValidation,
  addBenefit
);
router.put(
  '/admin/benefits/:id',
  userAdminAuthenticated,
  upload.single('image'),
  editBenefitValidation,
  editBenefit
);
router.delete('/admin/benefits/:id', userAdminAuthenticated, removeBenefit);

module.exports = router;
