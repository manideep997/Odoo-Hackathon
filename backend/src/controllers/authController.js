const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const { userSchemas, validate } = require("../utils/validation");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findByUsernameOrEmail(username);
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        message: "Username or email is already registered",
      });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: user.toPublicJSON(),
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: "Duplicate field",
        message: `${field} is already taken`,
      });
    }

    res.status(500).json({
      error: "Registration failed",
      message: "An error occurred while registering the user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsernameOrEmail(username);
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Invalid username or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Invalid username or password",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        error: "Account suspended",
        message: "Your account has been suspended. Please contact support.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user: user.toPublicJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      message: "An error occurred while logging in",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      error: "Profile retrieval failed",
      message: "An error occurred while retrieving your profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const user = req.user;

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      error: "Profile update failed",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid password",
        message: "The current password you entered is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      error: "Password change failed",
      message: "An error occurred while changing your password",
    });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-hashedPassword");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The requested user does not exist",
      });
    }

    res.json({
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("User lookup error:", error);
    res.status(500).json({
      error: "User lookup failed",
      message: "An error occurred while looking up the user",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      message: "An error occurred while logging out",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUserByUsername,
  logout,
};
