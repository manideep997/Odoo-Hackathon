# StackIt Backend - Node.js + Express + MongoDB

A complete Q&A platform backend built with Node.js, Express, and MongoDB for the Odoo Hackathon project.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Questions & Answers**: Full CRUD operations with rich text support
- **Voting System**: Upvote/downvote answers with reputation tracking
- **Tagging System**: Categorize questions with tags
- **Notifications**: Real-time notifications for mentions, answers, and votes
- **Search & Filtering**: Advanced search with pagination and sorting

### User Roles
- **Guest**: View questions and answers
- **User**: Register, post questions/answers, vote, manage profile
- **Admin**: Moderate content, manage users, view analytics

### Admin Features
- Content moderation (approve/reject questions and answers)
- User management (ban/unban, role management)
- Analytics and reporting
- Tag management

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   ├── Vote.js
│   │   ├── Notification.js
│   │   └── Tag.js
│   ├── controllers/      # Route handlers
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   ├── voteController.js
│   │   ├── tagController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── routes/          # Express routes
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── answers.js
│   │   ├── votes.js
│   │   ├── tags.js
│   │   ├── notifications.js
│   │   └── admin.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js
│   ├── utils/           # Utility functions
│   │   ├── validation.js
│   │   └── notificationService.js
│   └── server.js        # Main application file
├── package.json
├── env.example
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env` file

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stackit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Question Endpoints

#### Get Questions
```http
GET /api/questions?page=1&limit=20&sort=newest&tag=javascript&q=search
```

#### Create Question
```http
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How to implement authentication in Node.js?",
  "description": "I'm building a web app and need help with JWT authentication...",
  "tags": ["nodejs", "authentication", "jwt"]
}
```

#### Get Single Question
```http
GET /api/questions/:id
```

### Answer Endpoints

#### Get Answers for Question
```http
GET /api/answers/question/:questionId?sort=votes&limit=10
```

#### Create Answer
```http
POST /api/answers/question/:questionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Here's how you can implement JWT authentication..."
}
```

### Vote Endpoints

#### Vote on Answer
```http
POST /api/votes/answer/:answerId
Authorization: Bearer <token>
Content-Type: application/json

{
  "voteType": "upvote"
}
```

### Tag Endpoints

#### Get Popular Tags
```http
GET /api/tags/popular?limit=20
```

#### Search Tags
```http
GET /api/tags/search?q=javascript&limit=10
```

### Notification Endpoints

#### Get Notifications
```http
GET /api/notifications?page=1&limit=20
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Questions (Admin)
```http
GET /api/admin/questions?page=1&limit=20
Authorization: Bearer <token>
```

#### Approve Question
```http
PUT /api/admin/questions/:id/approve
Authorization: Bearer <token>
```

#### Ban User
```http
PUT /api/admin/users/:id/ban
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Violation of community guidelines"
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt with configurable rounds
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Joi schema validation for all inputs
- **HTML Sanitization**: Basic XSS protection
- **Helmet**: Security headers middleware
- **Role-based Access Control**: Granular permissions

## 🗄️ Database Schema

### User Model
- `username`: Unique username
- `email`: Unique email address
- `hashedPassword`: BCrypt hashed password
- `role`: User role (guest, user, admin)
- `isBanned`: Account suspension status
- `reputation`: User reputation score
- `avatar`: Profile picture URL
- `bio`: User biography

### Question Model
- `title`: Question title
- `description`: Rich text content
- `author`: Reference to User
- `tags`: Array of tag names
- `views`: View count
- `voteCount`: Net vote count
- `answerCount`: Number of answers
- `isApproved`: Moderation status
- `isClosed`: Question closure status

### Answer Model
- `question`: Reference to Question
- `content`: Rich text content
- `author`: Reference to User
- `isApproved`: Moderation status
- `isAccepted`: Best answer status
- `voteCount`: Net vote count

### Vote Model
- `user`: Reference to User
- `answer`: Reference to Answer
- `question`: Reference to Question
- `voteType`: upvote or downvote

### Notification Model
- `user`: Reference to User
- `type`: Notification type
- `message`: Notification message
- `relatedQuestion`: Optional question reference
- `relatedAnswer`: Optional answer reference
- `fromUser`: User who triggered notification
- `isRead`: Read status

### Tag Model
- `name`: Tag name (unique)
- `description`: Tag description
- `questionCount`: Number of questions with this tag
- `isActive`: Tag status

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Performance Features

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data loading
- **Compression**: Gzip compression for responses
- **Caching**: Ready for Redis integration
- **Connection Pooling**: MongoDB connection optimization

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB URI
   - Set up proper CORS origins

2. **Security**
   - Enable HTTPS
   - Configure rate limiting
   - Set up monitoring and logging
   - Regular security updates

3. **Performance**
   - Enable compression
   - Set up CDN for static assets
   - Configure caching strategies
   - Monitor database performance

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Migration from Python

This Node.js backend is a complete rewrite of the original Python FastAPI backend, maintaining all functionality while providing:

- Better performance with Node.js
- Improved developer experience
- Enhanced security features
- Better error handling
- Comprehensive validation
- Production-ready configuration 