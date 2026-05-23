const { ROLES } = require('../config/constants');

/**
 * Role-based authorization middleware factory.
 * Accepts one or more roles and denies access if user role doesn't match.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

// Convenience exports
const adminOnly = authorize(ROLES.ADMIN);
const anyRole = authorize(ROLES.ADMIN, ROLES.GENERAL_USER);

module.exports = { authorize, adminOnly, anyRole };
