import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import JWT from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All feilds are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({
        success: false,
        message: "This email is already registered",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      password: hashedPass,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isPassMatched = await bcrypt.compare(password, user.password);
    if (!isPassMatched) {
      return res.status(403).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = await JWT.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome back ${user.fullName}`,
        user: userWithoutPassword,
        token: token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      })
      .json({
        success: true,
        message: "User logout succesfully.",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
