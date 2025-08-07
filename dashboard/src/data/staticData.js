// Static fallback data for when server is offline
// This data will be used when the backend server is not available

export const staticHeroSlides = [
  {
    _id: 'static-hero-1',
    title: 'Solar Energy Solutions',
    subtitle: 'Powering a Sustainable Future',
    description: 'Leading provider of innovative solar energy solutions for residential and commercial needs.',
    image: '/solar1.png',
    buttonText: 'Learn More',
    buttonLink: '/about',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-hero-2',
    title: 'Clean Energy Revolution',
    subtitle: 'Join the Green Movement',
    description: 'Transform your energy consumption with our cutting-edge solar technology.',
    image: '/solar-panels.jpg',
    buttonText: 'Get Started',
    buttonLink: '/contact',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticTeamMembers = [
  {
    _id: 'static-team-1',
    name: 'John Doe',
    position: 'CEO & Founder',
    department: 'Executive',
    bio: 'Leading the company with vision and innovation in renewable energy sector.',
    image: '/team-placeholder.jpg',
    email: 'john@cosmic.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-team-2',
    name: 'Jane Smith',
    position: 'CTO',
    department: 'Technology',
    bio: 'Driving technological innovation and development in solar solutions.',
    image: '/team-placeholder.jpg',
    email: 'jane@cosmic.com',
    linkedin: 'https://linkedin.com/in/janesmith',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticProducts = [
  {
    _id: 'static-product-1',
    name: 'Residential Solar Panel System',
    description: 'Complete solar panel system for residential use with high efficiency and durability.',
    price: 50000,
    category: 'Residential',
    specifications: {
      power: '5kW',
      efficiency: '22%',
      warranty: '25 years'
    },
    images: ['/solar1.png'],
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-product-2',
    name: 'Commercial Solar Solution',
    description: 'Large-scale solar solution for commercial and industrial applications.',
    price: 500000,
    category: 'Commercial',
    specifications: {
      power: '100kW',
      efficiency: '24%',
      warranty: '25 years'
    },
    images: ['/solar-panels.jpg'],
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticProjects = [
  {
    _id: 'static-project-1',
    title: 'Green Valley Residential Complex',
    description: 'Complete solar installation for 200+ residential units.',
    location: 'Mumbai, Maharashtra',
    capacity: '2MW',
    status: 'Completed',
    completionDate: '2024-01-15',
    images: ['/project-placeholder.jpg'],
    client: 'Green Valley Developers',
    category: 'Residential',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-project-2',
    title: 'Industrial Solar Farm',
    description: 'Large-scale solar farm for industrial energy needs.',
    location: 'Gujarat',
    capacity: '50MW',
    status: 'In Progress',
    completionDate: '2024-06-30',
    images: ['/project-placeholder.jpg'],
    client: 'Industrial Corp',
    category: 'Industrial',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticBlogPosts = [
  {
    _id: 'static-blog-1',
    title: 'The Future of Solar Energy in India',
    content: 'Solar energy is revolutionizing the way we think about power generation in India...',
    excerpt: 'Exploring the potential and growth of solar energy sector in India.',
    author: 'Cosmic Team',
    category: 'Technology',
    tags: ['solar', 'renewable', 'india'],
    featuredImage: '/blog-placeholder.jpg',
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-blog-2',
    title: 'Benefits of Switching to Solar Power',
    content: 'Switching to solar power offers numerous benefits for both homeowners and businesses...',
    excerpt: 'Discover the environmental and economic benefits of solar power.',
    author: 'Cosmic Team',
    category: 'Benefits',
    tags: ['benefits', 'solar', 'savings'],
    featuredImage: '/blog-placeholder.jpg',
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticFaqs = [
  {
    _id: 'static-faq-1',
    question: 'How long do solar panels last?',
    answer: 'Solar panels typically last 25-30 years with proper maintenance and come with manufacturer warranties.',
    category: 'General',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-faq-2',
    question: 'What is the payback period for solar installation?',
    answer: 'The payback period typically ranges from 3-7 years depending on your location, energy usage, and available incentives.',
    category: 'Financial',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticTestimonials = [
  {
    _id: 'static-testimonial-1',
    name: 'Rajesh Kumar',
    position: 'Homeowner',
    company: 'Mumbai',
    content: 'Cosmic Solar provided excellent service and quality installation. Our electricity bills have reduced by 80%.',
    rating: 5,
    image: '/testimonial-placeholder.jpg',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-testimonial-2',
    name: 'Priya Sharma',
    position: 'Business Owner',
    company: 'Delhi',
    content: 'The team was professional and the installation was completed on time. Highly recommended!',
    rating: 5,
    image: '/testimonial-placeholder.jpg',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticCategories = [
  {
    _id: 'static-category-1',
    name: 'Residential',
    description: 'Solar solutions for homes and residential complexes',
    slug: 'residential',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-category-2',
    name: 'Commercial',
    description: 'Solar solutions for businesses and commercial establishments',
    slug: 'commercial',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-category-3',
    name: 'Industrial',
    description: 'Large-scale solar solutions for industrial applications',
    slug: 'industrial',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const staticTags = [
  {
    _id: 'static-tag-1',
    name: 'Solar Energy',
    slug: 'solar-energy',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-tag-2',
    name: 'Renewable Energy',
    slug: 'renewable-energy',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'static-tag-3',
    name: 'Sustainability',
    slug: 'sustainability',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to create paginated response structure
export const createPaginatedResponse = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedData,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasNext: endIndex < data.length,
      hasPrev: page > 1
    },
    isOfflineData: true // Flag to indicate this is static data
  };
};

// Helper function to simulate API response structure
export const createApiResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    isOfflineData: true
  };
};