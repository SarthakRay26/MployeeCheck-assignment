const express = require('express');
const { body } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');
const validate = require('../middleware/validate');
const delay = require('../middleware/delay');

const router = express.Router();

// All user routes require authentication + admin role
router.use(authenticate, adminOnly);

router.get('/', delay, getUsers);

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('role').optional().isIn(['Admin', 'General User']).withMessage('Invalid role'),
  ],
  validate,
  createUser
);

router.put(
  '/:id',
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
    body('role').optional().isIn(['Admin', 'General User']).withMessage('Invalid role'),
  ],
  validate,
  updateUser
);

router.delete('/:id', deleteUser);

module.exports = router;
