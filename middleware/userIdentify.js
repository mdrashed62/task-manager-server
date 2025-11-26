
import jwt from "jsonwebtoken";
import { User } from "../models/user.js"; 

const isVerified = async (req, res, next) => {  
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    console.log("Token received:", token ? "Yes" : "No");
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not Authenticated",
      });
    }
    
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decode || !decode.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    const user = await User.findById(decode.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.userId = decode.userId;
    console.log("User verified:", req.userId); 
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token Expired",
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

export default isVerified;