import { Faq } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private/Admin
export const createFaq = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;

    // Check if FAQ with the same question already exists
    const faqExists = await Faq.findOne({ question });

    if (faqExists) {
      return res.status(400).json({
        success: false,
        message: 'A FAQ with this question already exists'
      });
    }

    // Create new FAQ
    const faq = await Faq.create({
      question,
      answer,
      category: category || 'general',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Bulk create FAQs
// @route   POST /api/faqs/bulk
// @access  Private/Admin
export const bulkCreateFaqs = async (req, res) => {
  try {
    const { faqs } = req.body;
    if (!Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'faqs array is required in request body',
      });
    }
    // Filter out duplicates by question
    const existingQuestions = await Faq.find({ question: { $in: faqs.map(f => f.question) } }).distinct('question');
    const newFaqs = faqs.filter(f => !existingQuestions.includes(f.question));
    if (newFaqs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new FAQs to insert (all questions already exist)',
        inserted: 0,
        skipped: faqs.length,
      });
    }
    const inserted = await Faq.insertMany(newFaqs.map(f => ({
      question: f.question,
      answer: f.answer,
      category: f.category || 'general',
      order: f.order || 0,
      isActive: f.isActive !== undefined ? f.isActive : true
    })), { ordered: false });
    res.status(201).json({
      success: true,
      message: 'Bulk FAQ insert complete',
      inserted: inserted.length,
      skipped: faqs.length - inserted.length,
      insertedFaqs: inserted
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
export const getFaqs = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(Faq.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const faqs = await features.query;

    // Get total count for pagination
    const totalFaqs = await Faq.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: faqs.length,
      total: totalFaqs,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalFaqs / features.pagination.limit)
      },
      data: faqs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get FAQs by category
// @route   GET /api/faqs/category/:category
// @access  Public
export const getFaqsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const faqs = await Faq.find({ 
      category, 
      isActive: true 
    }).sort('order');

    res.json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active FAQs
// @route   GET /api/faqs/active
// @access  Public
export const getActiveFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort('order');

    res.json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get FAQ by ID
// @route   GET /api/faqs/:id
// @access  Public
export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
export const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Check if updating question and if it already exists
    if (req.body.question && req.body.question !== faq.question) {
      const questionExists = await Faq.findOne({ question: req.body.question });
      if (questionExists) {
        return res.status(400).json({
          success: false,
          message: 'A FAQ with this question already exists'
        });
      }
    }

    // Update fields
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedFaq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Using findByIdAndDelete instead of deprecated remove() method
    await Faq.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'FAQ removed'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update FAQ order
// @route   PUT /api/faqs/reorder
// @access  Private/Admin
export const reorderFaqs = async (req, res) => {
  try {
    const { faqs } = req.body;

    if (!faqs || !Array.isArray(faqs)) {
      return res.status(400).json({
        success: false,
        message: 'FAQs array is required'
      });
    }

    // Update order for each FAQ
    const updatePromises = faqs.map(faq => {
      return Faq.findByIdAndUpdate(
        faq.id,
        { order: faq.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get updated FAQs
    const updatedFaqs = await Faq.find().sort('order');

    res.json({
      success: true,
      message: 'FAQs reordered successfully',
      data: updatedFaqs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};