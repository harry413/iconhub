import jwt from "jsonwebtoken";

export const generateToken = (req) => {
  // Check all possible locations
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const tokenFromHeader = authHeader?.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;
  
  const tokenFromCookie = req.cookies?.token;
  const tokenFromBody = req.body?.token;
  const tokenFromQuery = req.query?.token;


  return tokenFromHeader || tokenFromCookie || tokenFromBody || tokenFromQuery;
};

export const authenticate = (req, res, next) => {
  // Get token from header
    const token = getToken(req);
    
  if (!token) {
    return res.status(401).json({ 
        success: false,
        message: 'Authorization token required',
        code: 'MISSING_TOKEN'
      });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const optionalAuthenticate = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    try {
      // Verify token if present
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token is invalid but we still proceed (optional auth)
      console.error('Invalid token:', err.message);
    }
  }

  next();
};

export const adminOnly = (req, res, next) => {
  // This assumes you have an 'isAdmin' field in your User model
  // You would need to implement this logic based on your user model
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};