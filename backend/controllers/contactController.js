import { Contact, User } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

/**
 * @desc    Create a new contact submission
 * @route   POST /api/contacts
 * @access  Public
 */
export const createContact = async (req, res) => {
  try {
    // Add IP address if available
    if (req.ip) {
      req.body.ipAddress = req.ip;
    }

    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all contact submissions with filtering, sorting, etc.
 * @route   GET /api/contacts
 * @access  Private/Admin
 */
export const getContacts = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Contact.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const contacts = await features.query.populate('assignedTo', 'name email');

    // Get total count for pagination
    const totalCount = await Contact.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: contacts.length,
      totalCount,
      pagination: features.pagination,
      data: contacts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get contacts by status
 * @route   GET /api/contacts/status/:status
 * @access  Private/Admin
 */
export const getContactsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ['new', 'in-progress', 'completed', 'spam'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const features = new APIFeatures(
      Contact.find({ status }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const contacts = await features.query.populate('assignedTo', 'name email');

    // Get total count for pagination
    const totalCount = await Contact.countDocuments({ status, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: contacts.length,
      totalCount,
      pagination: features.pagination,
      data: contacts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get unread contacts
 * @route   GET /api/contacts/unread
 * @access  Private/Admin
 */
export const getUnreadContacts = async (req, res) => {
  try {
    const features = new APIFeatures(
      Contact.find({ isRead: false }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const contacts = await features.query.populate('assignedTo', 'name email');

    // Get total count for pagination
    const totalCount = await Contact.countDocuments({ isRead: false, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: contacts.length,
      totalCount,
      pagination: features.pagination,
      data: contacts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get contacts assigned to a specific user
 * @route   GET /api/contacts/assigned/:userId
 * @access  Private
 */
export const getAssignedContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if the requesting user is the assigned user or an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these contacts'
      });
    }

    const features = new APIFeatures(
      Contact.find({ assignedTo: userId }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const contacts = await features.query;

    // Get total count for pagination
    const totalCount = await Contact.countDocuments({ assignedTo: userId, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: contacts.length,
      totalCount,
      pagination: features.pagination,
      data: contacts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single contact by ID
 * @route   GET /api/contacts/:id
 * @access  Private/Admin
 */
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a contact
 * @route   PUT /api/contacts/:id
 * @access  Private/Admin
 */
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Mark contact as read
 * @route   PUT /api/contacts/:id/read
 * @access  Private/Admin
 */
export const markContactAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Assign contact to user
 * @route   PUT /api/contacts/:id/assign/:userId
 * @access  Private/Admin
 */
export const assignContact = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update contact status
 * @route   PUT /api/contacts/:id/status
 * @access  Private/Admin
 */
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'in-progress', 'completed', 'spam'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Add notes to contact
 * @route   PUT /api/contacts/:id/notes
 * @access  Private/Admin
 */
export const addContactNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Notes are required'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a contact
 * @route   DELETE /api/contacts/:id
 * @access  Private/Admin
 */
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get contact statistics
 * @route   GET /api/contacts-stats
 * @access  Private/Admin
 */
export const getContactStats = async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ isRead: false });
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in-progress' });
    const completedContacts = await Contact.countDocuments({ status: 'completed' });
    const spamContacts = await Contact.countDocuments({ status: 'spam' });

    // Get contacts by source
    const sourceStats = await Contact.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get contacts by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const contactsByDate = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalContacts,
        unreadContacts,
        statusCounts: {
          new: newContacts,
          inProgress: inProgressContacts,
          completed: completedContacts,
          spam: spamContacts
        },
        sourceStats,
        contactsByDate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard-stats
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts from various collections
    // For now, we'll just use contact stats as a placeholder
    const totalContacts = await Contact.countDocuments();
    
    // Get user count if admin
    let userCount = 0;
    if (req.user.role === 'admin') {
      userCount = await User.countDocuments();
    }

    // Return dashboard stats
    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: userCount,
          posts: totalContacts, // Placeholder - replace with actual blog post count
          products: totalContacts, // Placeholder - replace with actual product count
          projects: totalContacts, // Placeholder - replace with actual project count
          media: totalContacts, // Placeholder - replace with actual media count
          testimonials: totalContacts, // Placeholder - replace with actual testimonial count
          team: totalContacts, // Placeholder - replace with actual team member count
          faqs: totalContacts, // Placeholder - replace with actual FAQ count
          categories: totalContacts, // Placeholder - replace with actual category count
          tags: totalContacts, // Placeholder - replace with actual tag count
          contacts: totalContacts
        },
        recentActivities: [] // Placeholder for recent activities
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};