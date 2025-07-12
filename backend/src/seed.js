require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("./models/User");
const Question = require("./models/Question");
const Answer = require("./models/Answer");
const Tag = require("./models/Tag");
const Vote = require("./models/Vote");

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    await Tag.deleteMany({});
    await Vote.deleteMany({});
    console.log("Existing data cleared!");

    // Create sample users
    console.log("Creating sample users...");
    const users = [
      {
        username: "admin",
        email: "admin@stackit.com",
        password: "Admin123!",
        role: "admin",
        bio: "System administrator and moderator",
        reputation: 1000,
        avatar: "https://via.placeholder.com/150/007bff/ffffff?text=A",
      },
      {
        username: "alice",
        email: "alice@example.com",
        password: "Alice123!",
        role: "user",
        bio: "Full-stack developer passionate about JavaScript and Node.js",
        reputation: 850,
        avatar: "https://via.placeholder.com/150/28a745/ffffff?text=A",
      },
      {
        username: "bob",
        email: "bob@example.com",
        password: "Bob123!",
        role: "user",
        bio: "Backend developer specializing in MongoDB and Express.js",
        reputation: 720,
        avatar: "https://via.placeholder.com/150/dc3545/ffffff?text=B",
      },
      {
        username: "charlie",
        email: "charlie@example.com",
        password: "Charlie123!",
        role: "user",
        bio: "Frontend developer with expertise in React and TypeScript",
        reputation: 650,
        avatar: "https://via.placeholder.com/150/ffc107/000000?text=C",
      },
      {
        username: "diana",
        email: "diana@example.com",
        password: "Diana123!",
        role: "user",
        bio: "DevOps engineer and cloud architecture enthusiast",
        reputation: 580,
        avatar: "https://via.placeholder.com/150/6f42c1/ffffff?text=D",
      },
      {
        username: "emma",
        email: "emma@example.com",
        password: "Emma123!",
        role: "user",
        bio: "Junior developer learning the ropes of web development",
        reputation: 120,
        avatar: "https://via.placeholder.com/150/17a2b8/ffffff?text=E",
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      // Hash the password manually since the virtual field isn't working as expected
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        username: userData.username,
        email: userData.email,
        hashedPassword: hashedPassword,
        role: userData.role,
        bio: userData.bio,
        reputation: userData.reputation,
        avatar: userData.avatar,
      });

      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create sample tags
    console.log("Creating sample tags...");
    const tags = [
      {
        name: "javascript",
        description: "Programming language for web development",
      },
      {
        name: "nodejs",
        description: "JavaScript runtime for server-side development",
      },
      {
        name: "mongodb",
        description: "NoSQL database for modern applications",
      },
      { name: "express", description: "Web application framework for Node.js" },
      {
        name: "react",
        description: "JavaScript library for building user interfaces",
      },
      { name: "typescript", description: "Typed superset of JavaScript" },
      {
        name: "docker",
        description: "Containerization platform for applications",
      },
      { name: "aws", description: "Cloud computing platform by Amazon" },
      {
        name: "git",
        description: "Version control system for tracking changes",
      },
      { name: "api", description: "Application Programming Interface" },
    ];

    const createdTags = [];
    for (const tagData of tags) {
      const tag = new Tag({
        ...tagData,
        createdBy: createdUsers[0]._id, // Admin creates all tags
      });
      await tag.save();
      createdTags.push(tag);
      console.log(`Created tag: ${tag.name}`);
    }

    // Create sample questions
    console.log("Creating sample questions...");
    const questions = [
      {
        title: "How to implement JWT authentication in Express.js?",
        description:
          "I'm building a REST API with Express.js and need to implement JWT authentication. What's the best way to handle token generation, validation, and middleware setup? I want to ensure security best practices are followed.",
        tags: ["javascript", "nodejs", "express", "api"],
        author: createdUsers[1]._id, // Alice
        authorUsername: createdUsers[1].username,
        views: 245,
        voteCount: 12,
        upvotes: 15,
        downvotes: 3,
      },
      {
        title: "MongoDB aggregation pipeline for complex queries",
        description:
          "I need to create a complex aggregation pipeline in MongoDB to calculate user statistics. The query should group users by role, calculate average reputation, and find the most active users. Can someone help with the pipeline structure?",
        tags: ["mongodb", "javascript", "api"],
        author: createdUsers[2]._id, // Bob
        authorUsername: createdUsers[2].username,
        views: 189,
        voteCount: 8,
        upvotes: 10,
        downvotes: 2,
      },
      {
        title: "React hooks vs class components: When to use which?",
        description:
          "I'm learning React and confused about when to use hooks vs class components. What are the performance implications and best practices for choosing between them? Are there any scenarios where class components are still preferred?",
        tags: ["react", "javascript", "typescript"],
        author: createdUsers[3]._id, // Charlie
        authorUsername: createdUsers[3].username,
        views: 567,
        voteCount: 25,
        upvotes: 30,
        downvotes: 5,
      },
      {
        title: "Docker containerization for Node.js applications",
        description:
          "I want to containerize my Node.js application using Docker. What's the best approach for creating a production-ready Dockerfile? How should I handle environment variables, dependencies, and multi-stage builds?",
        tags: ["docker", "nodejs", "javascript"],
        author: createdUsers[4]._id, // Diana
        authorUsername: createdUsers[4].username,
        views: 134,
        voteCount: 6,
        upvotes: 8,
        downvotes: 2,
      },
      {
        title: "AWS Lambda deployment with serverless framework",
        description:
          "I'm trying to deploy a Node.js function to AWS Lambda using the serverless framework. What's the proper configuration for environment variables, IAM roles, and API Gateway integration? Any tips for debugging deployment issues?",
        tags: ["aws", "nodejs", "api"],
        author: createdUsers[4]._id, // Diana
        authorUsername: createdUsers[4].username,
        views: 98,
        voteCount: 4,
        upvotes: 6,
        downvotes: 2,
      },
      {
        title: "Git workflow for team collaboration",
        description:
          "Our team is struggling with Git workflow. We need a clear strategy for feature branches, pull requests, and code reviews. What's the best practice for managing conflicts and maintaining a clean commit history?",
        tags: ["git"],
        author: createdUsers[5]._id, // Emma
        authorUsername: createdUsers[5].username,
        views: 312,
        voteCount: 15,
        upvotes: 18,
        downvotes: 3,
      },
      {
        title: "TypeScript configuration for Express.js projects",
        description:
          "I'm setting up TypeScript in my Express.js project. What's the recommended tsconfig.json configuration? How should I structure type definitions for routes, middleware, and database models?",
        tags: ["typescript", "express", "nodejs"],
        author: createdUsers[1]._id, // Alice
        authorUsername: createdUsers[1].username,
        views: 203,
        voteCount: 9,
        upvotes: 12,
        downvotes: 3,
      },
      {
        title: "MongoDB indexing strategies for performance",
        description:
          "My MongoDB queries are running slowly. What indexing strategies should I use for different query patterns? How do I analyze query performance and create compound indexes effectively?",
        tags: ["mongodb", "api"],
        author: createdUsers[2]._id, // Bob
        authorUsername: createdUsers[2].username,
        views: 156,
        voteCount: 7,
        upvotes: 9,
        downvotes: 2,
      },
    ];

    const createdQuestions = [];
    for (const questionData of questions) {
      const question = new Question(questionData);
      await question.save();
      createdQuestions.push(question);
      console.log(`Created question: ${question.title.substring(0, 50)}...`);
    }

    // Create sample answers
    console.log("Creating sample answers...");
    const answers = [
      {
        question: createdQuestions[0]._id, // JWT authentication question
        content:
          "For JWT authentication in Express.js, I recommend using the `jsonwebtoken` library. Here's a complete implementation:\n\n1. Install dependencies: `npm install jsonwebtoken bcryptjs`\n2. Create middleware for token verification\n3. Use environment variables for JWT_SECRET\n4. Implement refresh tokens for better security\n\nThis approach follows security best practices and is production-ready.",
        author: createdUsers[2]._id, // Bob
        authorUsername: createdUsers[2].username,
        voteCount: 8,
        upvotes: 10,
        downvotes: 2,
      },
      {
        question: createdQuestions[0]._id, // JWT authentication question
        content:
          "I'd also suggest using `express-rate-limit` to prevent brute force attacks and implementing proper error handling for expired tokens. Don't forget to set appropriate token expiration times based on your security requirements.",
        author: createdUsers[4]._id, // Diana
        authorUsername: createdUsers[4].username,
        voteCount: 5,
        upvotes: 6,
        downvotes: 1,
      },
      {
        question: createdQuestions[1]._id, // MongoDB aggregation question
        content:
          'Here\'s a MongoDB aggregation pipeline for your user statistics:\n\n```javascript\nconst pipeline = [\n  { $group: {\n    _id: "$role",\n    avgReputation: { $avg: "$reputation" },\n    userCount: { $sum: 1 },\n    totalReputation: { $sum: "$reputation" }\n  }},\n  { $sort: { avgReputation: -1 }}\n];\n```\n\nThis will give you exactly what you need with good performance.',
        author: createdUsers[1]._id, // Alice
        authorUsername: createdUsers[1].username,
        voteCount: 12,
        upvotes: 15,
        downvotes: 3,
        isAccepted: true,
      },
      {
        question: createdQuestions[2]._id, // React hooks question
        content:
          'React hooks are generally preferred for new code because they:\n\n- Reduce code complexity\n- Avoid "this" binding issues\n- Enable better code reuse\n- Improve performance with React.memo\n\nUse class components only when you need specific lifecycle methods that don\'t have hook equivalents.',
        author: createdUsers[3]._id, // Charlie
        authorUsername: createdUsers[3].username,
        voteCount: 18,
        upvotes: 22,
        downvotes: 4,
      },
      {
        question: createdQuestions[3]._id, // Docker question
        content:
          'Here\'s a production-ready Dockerfile for Node.js:\n\n```dockerfile\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\nFROM node:18-alpine\nWORKDIR /app\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n```\n\nUse multi-stage builds and Alpine Linux for smaller images.',
        author: createdUsers[4]._id, // Diana
        authorUsername: createdUsers[4].username,
        voteCount: 10,
        upvotes: 12,
        downvotes: 2,
      },
      {
        question: createdQuestions[5]._id, // Git workflow question
        content:
          "I recommend the Git Flow workflow:\n\n1. `main` branch for production code\n2. `develop` branch for integration\n3. Feature branches: `feature/feature-name`\n4. Release branches: `release/version`\n5. Hotfix branches: `hotfix/issue`\n\nUse pull requests for code reviews and squash commits for clean history.",
        author: createdUsers[0]._id, // Admin
        authorUsername: createdUsers[0].username,
        voteCount: 20,
        upvotes: 25,
        downvotes: 5,
      },
      {
        question: createdQuestions[6]._id, // TypeScript question
        content:
          'For Express.js with TypeScript, use this tsconfig.json:\n\n```json\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true,\n    "forceConsistentCasingInFileNames": true\n  }\n}\n```\n\nCreate interfaces for your models and use type guards for validation.',
        author: createdUsers[3]._id, // Charlie
        authorUsername: createdUsers[3].username,
        voteCount: 7,
        upvotes: 9,
        downvotes: 2,
      },
    ];

    const createdAnswers = [];
    for (const answerData of answers) {
      const answer = new Answer(answerData);
      await answer.save();
      createdAnswers.push(answer);
      console.log(`Created answer for question: ${answerData.question}`);
    }

    // Create sample votes
    console.log("Creating sample votes...");
    const votes = [
      // Votes for answers
      {
        user: createdUsers[1]._id,
        answer: createdAnswers[0]._id,
        question: createdQuestions[0]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[3]._id,
        answer: createdAnswers[0]._id,
        question: createdQuestions[0]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[4]._id,
        answer: createdAnswers[0]._id,
        question: createdQuestions[0]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[5]._id,
        answer: createdAnswers[0]._id,
        question: createdQuestions[0]._id,
        voteType: "downvote",
      },

      {
        user: createdUsers[2]._id,
        answer: createdAnswers[1]._id,
        question: createdQuestions[0]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[3]._id,
        answer: createdAnswers[1]._id,
        question: createdQuestions[0]._id,
        voteType: "upvote",
      },

      {
        user: createdUsers[0]._id,
        answer: createdAnswers[2]._id,
        question: createdQuestions[1]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[2]._id,
        answer: createdAnswers[2]._id,
        question: createdQuestions[1]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[4]._id,
        answer: createdAnswers[2]._id,
        question: createdQuestions[1]._id,
        voteType: "upvote",
      },

      {
        user: createdUsers[1]._id,
        answer: createdAnswers[3]._id,
        question: createdQuestions[2]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[2]._id,
        answer: createdAnswers[3]._id,
        question: createdQuestions[2]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[5]._id,
        answer: createdAnswers[3]._id,
        question: createdQuestions[2]._id,
        voteType: "downvote",
      },

      {
        user: createdUsers[1]._id,
        answer: createdAnswers[4]._id,
        question: createdQuestions[3]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[3]._id,
        answer: createdAnswers[4]._id,
        question: createdQuestions[3]._id,
        voteType: "upvote",
      },

      {
        user: createdUsers[1]._id,
        answer: createdAnswers[5]._id,
        question: createdQuestions[5]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[2]._id,
        answer: createdAnswers[5]._id,
        question: createdQuestions[5]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[3]._id,
        answer: createdAnswers[5]._id,
        question: createdQuestions[5]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[4]._id,
        answer: createdAnswers[5]._id,
        question: createdQuestions[5]._id,
        voteType: "upvote",
      },

      {
        user: createdUsers[2]._id,
        answer: createdAnswers[6]._id,
        question: createdQuestions[6]._id,
        voteType: "upvote",
      },
      {
        user: createdUsers[4]._id,
        answer: createdAnswers[6]._id,
        question: createdQuestions[6]._id,
        voteType: "upvote",
      },
    ];

    for (const voteData of votes) {
      const vote = new Vote(voteData);
      await vote.save();
    }
    console.log(`Created ${votes.length} votes`);

    // Update question and answer vote counts
    console.log("Updating vote counts...");
    for (const question of createdQuestions) {
      await question.updateVoteCount();
    }

    for (const answer of createdAnswers) {
      await answer.updateVoteCount();
    }

    // Update tag question counts
    console.log("Updating tag question counts...");
    await Tag.updateAllQuestionCounts();

    console.log("\n✅ Seed data created successfully!");
    console.log("\n📊 Summary:");
    console.log(`- ${createdUsers.length} users created`);
    console.log(`- ${createdTags.length} tags created`);
    console.log(`- ${createdQuestions.length} questions created`);
    console.log(`- ${createdAnswers.length} answers created`);
    console.log(`- ${votes.length} votes created`);

    console.log("\n🔑 Test Accounts:");
    console.log("Admin: admin@stackit.com / Admin123!");
    console.log("User 1: alice@example.com / Alice123!");
    console.log("User 2: bob@example.com / Bob123!");
    console.log("User 3: charlie@example.com / Charlie123!");
    console.log("User 4: diana@example.com / Diana123!");
    console.log("User 5: emma@example.com / Emma123!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seed();
