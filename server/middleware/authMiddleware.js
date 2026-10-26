import jwt from 'jsonwebtoken';

// Strict auth: only requests carrying a valid JWT are allowed through.
// There is no guest fallback - every service requires a signed-in user.
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Please sign in to use this service.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_job_assistant_2026');
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Please sign in again.' });
  }
};
