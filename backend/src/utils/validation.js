const Joi = require("joi");

const userSchemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      "string.alphanum": "Username must contain only alphanumeric characters",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "any.required": "Password is required",
      }),
  }),

  login: Joi.object({
    username: Joi.string().required().messages({
      "any.required": "Username or email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  update: Joi.object({
    bio: Joi.string().max(500).optional().messages({
      "string.max": "Bio cannot exceed 500 characters",
    }),
    avatar: Joi.string().uri().optional().messages({
      "string.uri": "Avatar must be a valid URL",
    }),
  }),
};

const questionSchemas = {
  create: Joi.object({
    title: Joi.string().min(10).max(300).required().messages({
      "string.min": "Question title must be at least 10 characters long",
      "string.max": "Question title cannot exceed 300 characters",
      "any.required": "Question title is required",
    }),
    description: Joi.string().min(20).required().messages({
      "string.min": "Question description must be at least 20 characters long",
      "any.required": "Question description is required",
    }),
    tags: Joi.array()
      .items(Joi.string().min(2).max(30))
      .max(5)
      .optional()
      .messages({
        "array.max": "Cannot add more than 5 tags",
        "string.min": "Tag must be at least 2 characters long",
        "string.max": "Tag cannot exceed 30 characters",
      }),
  }),

  update: Joi.object({
    title: Joi.string().min(10).max(300).optional().messages({
      "string.min": "Question title must be at least 10 characters long",
      "string.max": "Question title cannot exceed 300 characters",
    }),
    description: Joi.string().min(20).optional().messages({
      "string.min": "Question description must be at least 20 characters long",
    }),
    tags: Joi.array()
      .items(Joi.string().min(2).max(30))
      .max(5)
      .optional()
      .messages({
        "array.max": "Cannot add more than 5 tags",
        "string.min": "Tag must be at least 2 characters long",
        "string.max": "Tag cannot exceed 30 characters",
      }),
  }),
};

const answerSchemas = {
  create: Joi.object({
    content: Joi.string().min(10).required().messages({
      "string.min": "Answer content must be at least 10 characters long",
      "any.required": "Answer content is required",
    }),
  }),

  update: Joi.object({
    content: Joi.string().min(10).required().messages({
      "string.min": "Answer content must be at least 10 characters long",
      "any.required": "Answer content is required",
    }),
  }),
};

const voteSchemas = {
  create: Joi.object({
    voteType: Joi.string().valid("upvote", "downvote").required().messages({
      "any.only": 'Vote type must be either "upvote" or "downvote"',
      "any.required": "Vote type is required",
    }),
  }),
};

const tagSchemas = {
  create: Joi.object({
    name: Joi.string().alphanum().min(2).max(30).required().messages({
      "string.alphanum": "Tag name must contain only alphanumeric characters",
      "string.min": "Tag name must be at least 2 characters long",
      "string.max": "Tag name cannot exceed 30 characters",
      "any.required": "Tag name is required",
    }),
    description: Joi.string().max(500).optional().messages({
      "string.max": "Tag description cannot exceed 500 characters",
    }),
  }),
};

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  sort: Joi.string()
    .valid("newest", "oldest", "votes", "views", "answers")
    .default("newest")
    .messages({
      "any.only": "Sort must be one of: newest, oldest, votes, views, answers",
    }),
});

const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).optional().messages({
    "string.min": "Search query must be at least 1 character long",
    "string.max": "Search query cannot exceed 100 characters",
  }),
  tag: Joi.string().min(2).max(30).optional().messages({
    "string.min": "Tag must be at least 2 characters long",
    "string.max": "Tag cannot exceed 30 characters",
  }),
  author: Joi.string().optional(),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        messages: errorMessages,
      });
    }

    req.body = value;
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Invalid query parameters",
        messages: errorMessages,
      });
    }

    req.query = value;
    next();
  };
};

const sanitizeHtml = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
};

module.exports = {
  userSchemas,
  questionSchemas,
  answerSchemas,
  voteSchemas,
  tagSchemas,
  paginationSchema,
  searchSchema,
  validate,
  validateQuery,
  sanitizeHtml,
};
