import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!');
    }
    console.warn('⚠️ WARNING: JWT_SECRET is not set in environment. Using fallback development secret.');
    return 'dev_only_jwt_secret_do_not_use_in_production_2026';
  }
  return secret;
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please login.' });
  }

  jwt.verify(token, getJwtSecret(), (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token. Please login again.' });
    }
    req.user = user;
    next();
  });
}

export function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Administrative privileges required.' });
  }
  next();
}

export { getJwtSecret };
