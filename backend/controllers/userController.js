import { User } from '../models/index.js';
import { generateToken, APIFeatures } from '../utils/index.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// @desc    Get registration page or form data with dynamic JWT token
// @route   GET /api/users/register
// @access  Public
export const getRegisterPage = async (req, res) => {
  try {
    // Generate a temporary user ID for token generation
    const tempUserId = new mongoose.Types.ObjectId();
    
    // Generate a real JWT token
    const token = generateToken(tempUserId);
    
    // Get current timestamp for real-time data
    const timestamp = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      message: 'Real-time registration data with JWT',
      timestamp: timestamp,
      token: token,
      data: {
        formFields: [
          { name: 'username', type: 'text', required: true },
          { name: 'email', type: 'email', required: true },
          { name: 'password', type: 'password', required: true },
          { name: 'confirmPassword', type: 'password', required: true }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'editor'
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check MongoDB connection status
    const isDbConnected = mongoose.connection.readyState === 1;
    
    if (!isDbConnected) {
      console.warn('Database connection issue during login attempt');
      
      // Check if this is a test/demo account that we can authenticate without DB
      if (email === 'admin@example.com' && password === 'admin123') {
        // Allow demo login when database is down
        console.log('Using fallback authentication for demo account');
        
        // Generate a temporary user ID for token
        const tempUserId = new mongoose.Types.ObjectId();
        
        return res.json({
          success: true,
          data: {
            _id: tempUserId,
            username: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            token: generateToken(tempUserId),
            isOfflineMode: true
          },
          message: 'Logged in with limited functionality due to database connection issues'
        });
      }
    }

    // Normal authentication flow when database is connected
    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save().catch(err => {
      console.warn('Failed to update last login time:', err.message);
      // Continue despite this error
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'An error occurred during login'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(User.find().select('-password'), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const users = await features.query;

    // Get total count for pagination
    const totalUsers = await User.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: users.length,
      total: totalUsers,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalUsers / features.pagination.limit)
      },
      data: users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    await user.remove();

    res.json({
      success: true,
      message: 'User removed'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email address'
      });
    }

    // Since we're removing email verification, we'll just return a success message
    // without actually sending an email
    res.json({
      success: true,
      message: 'Password reset functionality is disabled. Please contact admin.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // Since we're removing email verification, we'll just return a success message
    res.json({
      success: true,
      message: 'Password reset functionality is disabled. Please contact admin.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify email (placeholder - email verification removed)
// @route   GET /api/users/verify/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    // Since we're removing email verification, we'll just return a success message
    res.json({
      success: true,
      message: 'Email verification has been disabled.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Resend verification email (placeholder - email verification removed)
// @route   POST /api/users/resend-verification
// @access  Private
export const resendVerificationEmail = async (req, res) => {
  try {
    // Since we're removing email verification, we'll just return a success message
    res.json({
      success: true,
      message: 'Email verification has been disabled.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};