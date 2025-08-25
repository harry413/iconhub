import jwt from "jsonwebtoken";

// ✅ Used to generate a token for a user after login/signup
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Used inside middleware to pull token from request
const extractToken = (req) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const tokenFromCookie = req.cookies?.token;
  const tokenFromBody = req.body?.token;
  const tokenFromQuery = req.query?.token;

  return tokenFromHeader || tokenFromCookie || tokenFromBody || tokenFromQuery;
};

// ✅ Middleware for protected routes
export const authenticate = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required",
      code: "MISSING_TOKEN",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ✅ Middleware for optional auth
export const optionalAuthenticate = (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }

  next();
};

// ✅ Middleware for admin-only routes
export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
