const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
      if (!token) {
        return res.status(401).json({ 
          error: 'Access token required',
          message: 'Please provide a valid authentication token' 
        });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'User not found' 
        });
      }
  
      if (user.isBanned) {
        return res.status(403).json({ 
          error: 'User banned',
          message: 'Your account has been suspended' 
        });
      }
  
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Token is not valid' 
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          message: 'Token has expired' 
        });
      }
      
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        error: 'Authentication error',
        message: 'Internal server error' 
      });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'Please log in to access this resource' 
        });
      }
  
      const userRole = req.user.role;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: 'You do not have permission to access this resource' 
        });
      }
  
      next();
    };
};

const requireAdmin = requireRole('admin');
const requireUser = requireRole(['user', 'admin']);

const requireOwnership = (resourceModel, resourceIdField = 'id') => {
    return async (req, res, next) => {
        try {
            const resourceIdField = req.params[resourceIdField];
            const resource = await resourceModel.findById(resourceIdField);

            if (!resource) {
                return res.status(404).json({
                    error: 'Resource not found',
                    message: 'The requested resource was not found.'
                });
            }

            const isOwner = resource.author && resource.author.toString() === req.user._id.toString();
            const isAdmin = req.user.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'You are not authorized to access this resource.'
                });
            }
            
            req.resource = resource;
            next();
        } catch (error) {
            console.error('Ownership check error:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'An error occurred while checking ownership.'
            });
        }
    };
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);
        
            if (user && !user.isBanned) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};

const generateToken = (userId) => {
    return jwt.sign(
        {userId},
        JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || '24h'}
    );
};

module.exports = {
    authenticateToken,
    requireRole,
    requireAdmin,
    requireUser,
    requireOwnership,
    optionalAuth,
    generateToken
};