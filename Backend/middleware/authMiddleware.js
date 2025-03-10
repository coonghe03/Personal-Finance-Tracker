import jwt from 'jsonwebtoken';

// Admin Authentication Middleware
const authAdmin = async (req, res, next) => {
  try {
    // Extract token from the custom 'atoken' header
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please login again!" });
    }

    // Decode and verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken);  // Inspect token content

    // Check if the role is 'admin'
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized. You are not an admin!" });
    }

    // Proceed to next middleware or route handler if authorized
    next();
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong, please try again later!" });
  }
};

export default authAdmin;