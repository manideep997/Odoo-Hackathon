const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken, requireUser } = require("../middleware/auth");
const { userSchemas, validate } = require("../utils/validation");

router.post(
  "/register",
  validate(userSchemas.register),
  authController.register
);
router.post("/login", validate(userSchemas.login), authController.login);
router.get("/users/:username", authController.getUserByUsername);

router.get("/me", authenticateToken, authController.getProfile);
router.put(
  "/me",
  authenticateToken,
  requireUser,
  validate(userSchemas.update),
  authController.updateProfile
);
router.post(
  "/change-password",
  authenticateToken,
  requireUser,
  authController.changePassword
);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
