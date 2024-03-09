const express = require('express');

const {
  maxPageSizeValidation
} = require('../../../middleware/pagination/paginationValidation');
const { upload } = require('../../../middleware/file/multer');
const {
  userAdminAuthenticated
} = require('../../../middleware/auth/authorization');
const {
  createBenefitValidation,
  editBenefitValidation
} = require('../../../middleware/validations/benefitValidation');
const BenefitsController = require('../controllers/benefits.controller');

const router = express.Router();

router.get(
  '/admin/benefits',
  userAdminAuthenticated,
  maxPageSizeValidation,
  BenefitsController.getAllBenefit
);
router.get(
  '/admin/benefits/:id',
  userAdminAuthenticated,
  BenefitsController.getBenefitById
);
router.post(
  '/admin/benefits',
  userAdminAuthenticated,
  upload.single('image'),
  createBenefitValidation,
  BenefitsController.addBenefit
);
router.put(
  '/admin/benefits/:id',
  userAdminAuthenticated,
  upload.single('image'),
  editBenefitValidation,
  BenefitsController.editBenefit
);
router.delete(
  '/admin/benefits/:id',
  userAdminAuthenticated,
  BenefitsController.removeBenefit
);

module.exports = router;
