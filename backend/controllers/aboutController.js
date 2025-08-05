import AboutHero from '../models/AboutHero.js';
import AboutUs from '../models/AboutUs.js';
import WhoWeAre from '../models/WhoWeAre.js';
import OurExpertise from '../models/OurExpertise.js';
import WhyChooseCosmic from '../models/WhyChooseCosmic.js';
import VisionMissionValues from '../models/VisionMissionValues.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// About Hero Controllers
export const getAboutHero = catchAsync(async (req, res, next) => {
  const aboutHero = await AboutHero.findOne({ isActive: true });
  
  if (!aboutHero) {
    return next(new AppError('About hero section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      aboutHero
    }
  });
});

export const createAboutHero = catchAsync(async (req, res, next) => {
  const aboutHero = await AboutHero.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      aboutHero
    }
  });
});

export const updateAboutHero = catchAsync(async (req, res, next) => {
  const aboutHero = await AboutHero.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!aboutHero) {
    return next(new AppError('About hero section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      aboutHero
    }
  });
});

// About Us Controllers
export const getAboutUs = catchAsync(async (req, res, next) => {
  const aboutUs = await AboutUs.findOne({ isActive: true });
  
  if (!aboutUs) {
    return next(new AppError('About us section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      aboutUs
    }
  });
});

export const createAboutUs = catchAsync(async (req, res, next) => {
  const aboutUs = await AboutUs.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      aboutUs
    }
  });
});

export const updateAboutUs = catchAsync(async (req, res, next) => {
  const aboutUs = await AboutUs.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!aboutUs) {
    return next(new AppError('About us section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      aboutUs
    }
  });
});

// Who We Are Controllers
export const getWhoWeAre = catchAsync(async (req, res, next) => {
  const whoWeAre = await WhoWeAre.findOne({ isActive: true });
  
  if (!whoWeAre) {
    return next(new AppError('Who we are section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      whoWeAre
    }
  });
});

export const createWhoWeAre = catchAsync(async (req, res, next) => {
  const whoWeAre = await WhoWeAre.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      whoWeAre
    }
  });
});

export const updateWhoWeAre = catchAsync(async (req, res, next) => {
  const whoWeAre = await WhoWeAre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!whoWeAre) {
    return next(new AppError('Who we are section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      whoWeAre
    }
  });
});

// Our Expertise Controllers
export const getOurExpertise = catchAsync(async (req, res, next) => {
  const ourExpertise = await OurExpertise.findOne({ isActive: true });
  
  if (!ourExpertise) {
    return next(new AppError('Our expertise section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ourExpertise
    }
  });
});

export const createOurExpertise = catchAsync(async (req, res, next) => {
  const ourExpertise = await OurExpertise.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      ourExpertise
    }
  });
});

export const updateOurExpertise = catchAsync(async (req, res, next) => {
  const ourExpertise = await OurExpertise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!ourExpertise) {
    return next(new AppError('Our expertise section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ourExpertise
    }
  });
});

// Add Industry to Our Expertise
export const addIndustry = catchAsync(async (req, res, next) => {
  const ourExpertise = await OurExpertise.findById(req.params.id);
  
  if (!ourExpertise) {
    return next(new AppError('Our expertise section not found', 404));
  }

  ourExpertise.industries.push(req.body);
  await ourExpertise.save();

  res.status(200).json({
    status: 'success',
    data: {
      ourExpertise
    }
  });
});

// Update Industry
export const updateIndustry = catchAsync(async (req, res, next) => {
  const ourExpertise = await OurExpertise.findById(req.params.id);
  
  if (!ourExpertise) {
    return next(new AppError('Our expertise section not found', 404));
  }

  const industry = ourExpertise.industries.id(req.params.industryId);
  if (!industry) {
    return next(new AppError('Industry not found', 404));
  }

  Object.assign(industry, req.body);
  await ourExpertise.save();

  res.status(200).json({
    status: 'success',
    data: {
      ourExpertise
    }
  });
});

// Delete Industry
export const deleteIndustry = catchAsync(async (req, res, next) => {
  const ourExpertise = await OurExpertise.findById(req.params.id);
  
  if (!ourExpertise) {
    return next(new AppError('Our expertise section not found', 404));
  }

  ourExpertise.industries.id(req.params.industryId).remove();
  await ourExpertise.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Why Choose Cosmic Controllers
export const getWhyChooseCosmic = catchAsync(async (req, res, next) => {
  const whyChooseCosmic = await WhyChooseCosmic.findOne({ isActive: true });
  
  if (!whyChooseCosmic) {
    return next(new AppError('Why choose cosmic section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      whyChooseCosmic
    }
  });
});

export const createWhyChooseCosmic = catchAsync(async (req, res, next) => {
  const whyChooseCosmic = await WhyChooseCosmic.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      whyChooseCosmic
    }
  });
});

export const updateWhyChooseCosmic = catchAsync(async (req, res, next) => {
  const whyChooseCosmic = await WhyChooseCosmic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!whyChooseCosmic) {
    return next(new AppError('Why choose cosmic section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      whyChooseCosmic
    }
  });
});

// Vision Mission Values Controllers
export const getVisionMissionValues = catchAsync(async (req, res, next) => {
  const visionMissionValues = await VisionMissionValues.findOne({ isActive: true });
  
  if (!visionMissionValues) {
    return next(new AppError('Vision mission values section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      visionMissionValues
    }
  });
});

export const createVisionMissionValues = catchAsync(async (req, res, next) => {
  const visionMissionValues = await VisionMissionValues.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      visionMissionValues
    }
  });
});

export const updateVisionMissionValues = catchAsync(async (req, res, next) => {
  const visionMissionValues = await VisionMissionValues.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!visionMissionValues) {
    return next(new AppError('Vision mission values section not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      visionMissionValues
    }
  });
});

// Get All About Data
export const getAllAboutData = catchAsync(async (req, res, next) => {
  const [aboutHero, aboutUs, whoWeAre, ourExpertise, whyChooseCosmic, visionMissionValues] = await Promise.all([
    AboutHero.findOne({ isActive: true }),
    AboutUs.findOne({ isActive: true }),
    WhoWeAre.findOne({ isActive: true }),
    OurExpertise.findOne({ isActive: true }),
    WhyChooseCosmic.findOne({ isActive: true }),
    VisionMissionValues.findOne({ isActive: true })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      aboutHero,
      aboutUs,
      whoWeAre,
      ourExpertise,
      whyChooseCosmic,
      visionMissionValues
    }
  });
});