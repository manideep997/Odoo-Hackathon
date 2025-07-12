const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answerController");
const {
  authenticateToken,
  requireUser,
  requireOwnership,
} = require("../middleware/auth");
const {
  validate,
  answerSchemas,
  paginationSchema,
} = require("../utils/validation");
const Answer = require("../models/Answer");

// Get answers for a question
router.get("/question/:questionId", answerController.getAnswersByQuestion);

// Create new answer for a question
router.post(
  "/question/:questionId",
  authenticateToken,
  requireUser,
  validate(answerSchemas.create),
  answerController.createAnswer
);

// Update answer
router.put(
  "/:id",
  authenticateToken,
  requireUser,
  requireOwnership(Answer),
  validate(answerSchemas.update),
  answerController.updateAnswer
);

// Delete answer
router.delete(
  "/:id",
  authenticateToken,
  requireUser,
  requireOwnership(Answer),
  answerController.deleteAnswer
);

// Accept/unaccept answer
router.post(
  "/:id/accept",
  authenticateToken,
  requireUser,
  answerController.acceptAnswer
);
router.delete(
  "/:id/accept",
  authenticateToken,
  requireUser,
  answerController.unacceptAnswer
);

module.exports = router;
