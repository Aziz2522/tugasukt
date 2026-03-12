// middlewares/isAdmin.js
// Role-based access guard. Must be used AFTER verifyToken middleware.
// Only allows requests where req.user.role === 'admin'.

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  next();
};

module.exports = isAdmin;
