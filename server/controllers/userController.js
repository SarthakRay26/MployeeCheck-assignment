const User = require('../models/User');
const { PAGINATION } = require('../config/constants');

/**
 * GET /api/users
 * List all users with pagination (Admin only).
 */
const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Create a new user (Admin only).
 */
const createUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const user = await User.create({ email, password, name, role });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update a user (Admin only).
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // If password is provided, let the pre-save hook handle hashing
    if (updates.password) {
      const user = await User.findById(id).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }
      Object.assign(user, updates);
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    }

    // For non-password updates, use findByIdAndUpdate
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user (Admin only).
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
