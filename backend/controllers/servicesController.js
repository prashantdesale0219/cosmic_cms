import {
  ServiceHero,
  MainService,
  AdditionalService,
  ProcessStep,
  ServiceCta,
  SavingsCalculator
} from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// SERVICE HERO CONTROLLERS
export const getServiceHero = catchAsync(async (req, res, next) => {
  let serviceHero = await ServiceHero.findOne({ isActive: true });
  
  if (!serviceHero) {
    // Create default service hero if none exists
    serviceHero = await ServiceHero.create({
      title: 'Services',
      subtitle: 'Solar-Powered Lighting Systems Projects',
      videoUrl: '/servicesvideo.mp4',
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Services',
      isActive: true
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      serviceHero
    }
  });
});

export const createServiceHero = catchAsync(async (req, res, next) => {
  const newServiceHero = await ServiceHero.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      serviceHero: newServiceHero
    }
  });
});

export const updateServiceHero = catchAsync(async (req, res, next) => {
  const serviceHero = await ServiceHero.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!serviceHero) {
    return next(new AppError('No service hero found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      serviceHero
    }
  });
});

// MAIN SERVICE CONTROLLERS
export const getAllMainServices = catchAsync(async (req, res, next) => {
  let mainServices = await MainService.find().sort({ order: 1 });
  
  // Create default main services if none exist
  if (mainServices.length === 0) {
    const defaultServices = [
      {
        title: 'Solar Panel Installation',
        description: 'Professional installation of high-quality solar panels for residential and commercial properties.',
        icon: 'solar-panel',
        features: ['High efficiency panels', '25-year warranty', 'Professional installation'],
        order: 1,
        isActive: true
      },
      {
        title: 'Solar System Design',
        description: 'Custom solar system design tailored to your energy needs and property specifications.',
        icon: 'design',
        features: ['Custom design', 'Energy analysis', '3D modeling'],
        order: 2,
        isActive: true
      },
      {
        title: 'Maintenance & Support',
        description: 'Comprehensive maintenance and support services to keep your solar system running efficiently.',
        icon: 'maintenance',
        features: ['Regular maintenance', '24/7 support', 'Performance monitoring'],
        order: 3,
        isActive: true
      }
    ];
    
    await MainService.insertMany(defaultServices);
    mainServices = await MainService.find().sort({ order: 1 });
  }
  
  res.status(200).json({
    status: 'success',
    results: mainServices.length,
    data: {
      mainServices
    }
  });
});

export const getMainService = catchAsync(async (req, res, next) => {
  const mainService = await MainService.findById(req.params.id);
  
  if (!mainService) {
    return next(new AppError('No main service found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      mainService
    }
  });
});

export const createMainService = catchAsync(async (req, res, next) => {
  const newMainService = await MainService.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      mainService: newMainService
    }
  });
});

export const updateMainService = catchAsync(async (req, res, next) => {
  const mainService = await MainService.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!mainService) {
    return next(new AppError('No main service found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      mainService
    }
  });
});

export const deleteMainService = catchAsync(async (req, res, next) => {
  const mainService = await MainService.findByIdAndDelete(req.params.id);
  
  if (!mainService) {
    return next(new AppError('No main service found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// ADDITIONAL SERVICE CONTROLLERS
export const getAllAdditionalServices = catchAsync(async (req, res, next) => {
  let additionalServices = await AdditionalService.find().sort({ order: 1 });
  
  // Create default additional services if none exist
  if (additionalServices.length === 0) {
    const defaultAdditionalServices = [
      {
        title: 'Energy Storage Solutions',
        description: 'Battery storage systems to store excess solar energy for use during peak hours.',
        icon: 'battery',
        order: 1,
        isActive: true
      },
      {
        title: 'Smart Home Integration',
        description: 'Integrate your solar system with smart home technology for optimal energy management.',
        icon: 'smart-home',
        order: 2,
        isActive: true
      },
      {
        title: 'Energy Monitoring',
        description: 'Real-time monitoring of your solar system performance and energy consumption.',
        icon: 'monitoring',
        order: 3,
        isActive: true
      }
    ];
    
    await AdditionalService.insertMany(defaultAdditionalServices);
    additionalServices = await AdditionalService.find().sort({ order: 1 });
  }
  
  res.status(200).json({
    status: 'success',
    results: additionalServices.length,
    data: {
      additionalServices
    }
  });
});

export const getAdditionalService = catchAsync(async (req, res, next) => {
  const additionalService = await AdditionalService.findById(req.params.id);
  
  if (!additionalService) {
    return next(new AppError('No additional service found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      additionalService
    }
  });
});

export const createAdditionalService = catchAsync(async (req, res, next) => {
  const newAdditionalService = await AdditionalService.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      additionalService: newAdditionalService
    }
  });
});

export const updateAdditionalService = catchAsync(async (req, res, next) => {
  const additionalService = await AdditionalService.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!additionalService) {
    return next(new AppError('No additional service found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      additionalService
    }
  });
});

export const deleteAdditionalService = catchAsync(async (req, res, next) => {
  const additionalService = await AdditionalService.findByIdAndDelete(req.params.id);
  
  if (!additionalService) {
    return next(new AppError('No additional service found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// PROCESS STEP CONTROLLERS
export const getAllProcessSteps = catchAsync(async (req, res, next) => {
  let processSteps = await ProcessStep.find().sort({ order: 1 });
  
  // Create default process steps if none exist
  if (processSteps.length === 0) {
    const defaultProcessSteps = [
      {
        title: 'Site Assessment',
        description: 'Our experts visit your property to assess solar potential and energy requirements.',
        icon: 'assessment',
        order: 1,
        isActive: true
      },
      {
        title: 'Custom Design',
        description: 'We create a customized solar system design based on your specific needs and roof layout.',
        icon: 'design',
        order: 2,
        isActive: true
      },
      {
        title: 'Installation',
        description: 'Professional installation of your solar system by certified technicians.',
        icon: 'installation',
        order: 3,
        isActive: true
      },
      {
        title: 'Activation & Monitoring',
        description: 'System activation and ongoing monitoring to ensure optimal performance.',
        icon: 'monitoring',
        order: 4,
        isActive: true
      }
    ];
    
    await ProcessStep.insertMany(defaultProcessSteps);
    processSteps = await ProcessStep.find().sort({ order: 1 });
  }
  
  res.status(200).json({
    status: 'success',
    results: processSteps.length,
    data: {
      processSteps
    }
  });
});

export const getProcessStep = catchAsync(async (req, res, next) => {
  const processStep = await ProcessStep.findById(req.params.id);
  
  if (!processStep) {
    return next(new AppError('No process step found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      processStep
    }
  });
});

export const createProcessStep = catchAsync(async (req, res, next) => {
  const newProcessStep = await ProcessStep.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      processStep: newProcessStep
    }
  });
});

export const updateProcessStep = catchAsync(async (req, res, next) => {
  const processStep = await ProcessStep.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!processStep) {
    return next(new AppError('No process step found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      processStep
    }
  });
});

export const deleteProcessStep = catchAsync(async (req, res, next) => {
  const processStep = await ProcessStep.findByIdAndDelete(req.params.id);
  
  if (!processStep) {
    return next(new AppError('No process step found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// SERVICE CTA CONTROLLERS
export const getServiceCta = catchAsync(async (req, res, next) => {
  let serviceCta = await ServiceCta.findOne({ isActive: true });
  
  if (!serviceCta) {
    // Create default service CTA if none exists
    serviceCta = await ServiceCta.create({
      title: 'Ready to Transform Your Energy Future?',
      benefits: [
        { text: 'Reduce your electricity bills by up to 90%' },
        { text: 'Increase your property value' },
        { text: 'Contribute to a cleaner environment' },
        { text: '25-year warranty on solar panels' }
      ],
      ctaButtonText: 'Get Started Today',
      ctaButtonLink: '/contact',
      secondaryButtonText: 'Request Free Quote',
      secondaryButtonLink: '/quote',
      isActive: true
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      serviceCta
    }
  });
});

export const createServiceCta = catchAsync(async (req, res, next) => {
  const newServiceCta = await ServiceCta.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      serviceCta: newServiceCta
    }
  });
});

export const updateServiceCta = catchAsync(async (req, res, next) => {
  const serviceCta = await ServiceCta.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!serviceCta) {
    return next(new AppError('No service CTA found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      serviceCta
    }
  });
});

// SAVINGS CALCULATOR CONTROLLERS
export const getSavingsCalculator = catchAsync(async (req, res, next) => {
  let savingsCalculator = await SavingsCalculator.findOne({ isActive: true });
  
  if (!savingsCalculator) {
    // Create default savings calculator if none exists
    savingsCalculator = await SavingsCalculator.create({
      title: 'Calculate Your Savings',
      description: 'Find out how much you can save by switching to solar energy.',
      monthlyBillLabel: 'Monthly Electricity Bill',
      sunlightHoursLabel: 'Daily Sunlight Hours',
      roofSizeLabel: 'Roof Size (sq ft)',
      calculateButtonText: 'Calculate Savings',
      isActive: true
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      savingsCalculator
    }
  });
});

export const createSavingsCalculator = catchAsync(async (req, res, next) => {
  const newSavingsCalculator = await SavingsCalculator.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      savingsCalculator: newSavingsCalculator
    }
  });
});

export const updateSavingsCalculator = catchAsync(async (req, res, next) => {
  const savingsCalculator = await SavingsCalculator.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!savingsCalculator) {
    return next(new AppError('No savings calculator found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      savingsCalculator
    }
  });
});

// Get all services data for frontend
export const getAllServicesData = catchAsync(async (req, res, next) => {
  const serviceHero = await ServiceHero.findOne({ isActive: true });
  const mainServices = await MainService.find({ isActive: true }).sort({ order: 1 });
  const additionalServices = await AdditionalService.find({ isActive: true }).sort({ order: 1 });
  const processSteps = await ProcessStep.find({ isActive: true }).sort({ order: 1 });
  const serviceCta = await ServiceCta.findOne({ isActive: true });
  const savingsCalculator = await SavingsCalculator.findOne({ isActive: true });
  
  res.status(200).json({
    status: 'success',
    data: {
      serviceHero,
      mainServices,
      additionalServices,
      processSteps,
      serviceCta,
      savingsCalculator
    }
  });
});