// middlewares/verifyToken.js
// Protects routes by verifying the JWT sent in the Authorization header.
// On success, attaches the decoded user payload { id, username, role }
// to req.user so downstream controllers can use it.

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Expect: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
