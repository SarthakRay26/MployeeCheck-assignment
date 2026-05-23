/**
 * Artificial delay middleware.
 * Reads `delay` query parameter (in ms) and adds a setTimeout-based delay
 * to simulate slow network conditions for frontend async state testing.
 *
 * Usage: GET /api/records?delay=3000
 */
const delay = (req, res, next) => {
  const delayMs = parseInt(req.query.delay, 10);

  if (delayMs && delayMs > 0) {
    // Cap at 10 seconds to prevent abuse
    const cappedDelay = Math.min(delayMs, 10000);
    return setTimeout(next, cappedDelay);
  }

  next();
};

module.exports = delay;
