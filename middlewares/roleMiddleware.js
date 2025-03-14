const roleMiddleware =
  (...allowedRoles) =>
  (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
  };

module.exports = roleMiddleware;