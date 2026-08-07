import jwt from "jsonwebtoken";

export const verifyDealer = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    if (decoded.role !== "dealer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Dealer credentials required"
      });
    }

    req.dealer = decoded;
    next();
  } catch (error) {
    console.error("Dealer Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
