const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No user data found" });
      }

      const userRole = req.user.role;

      if (!userRole) {
        return res.status(400).json({ message: "User role not found" });
      }

      const isAllowed = allowedRoles.includes(userRole);

      if (!isAllowed) {
        return res.status(403).json({
          message: `Access denied: Role '${userRole}' is not allowed`,
        });
      }

      next();
    } catch (err) {
      console.error("Role check failed:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = roleCheck;
