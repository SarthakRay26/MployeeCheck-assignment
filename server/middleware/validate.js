const { validationResult } = require('express-validator');

/**
 * Validation middleware that checks express-validator results.
 * Returns 422 with structured error messages if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
