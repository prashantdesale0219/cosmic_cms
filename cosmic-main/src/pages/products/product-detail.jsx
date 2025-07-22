import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Heart, Share2, Facebook, Twitter, Linkedin, Star, Info, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import RequestQuoteModal from '../../components/RequestQuoteModal';
import { productService } from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Default reviews in case product doesn't have any
  const defaultReviews = [
    { user: 'Rahul M.', rating: 5, comment: 'Excellent product! Works great even in challenging conditions.' },
    { user: 'Priya S.', rating: 4, comment: 'Good quality and performance. Very satisfied with my purchase.' },
    { user: 'Amit K.', rating: 5, comment: 'This has been a great addition to my home. Highly recommended!' }
  ];
  
  // Default features in case product doesn't have any
  const defaultFeatures = [
    'High-quality materials',
    'Energy efficient design',
    'Easy installation',
    'Durable construction',
    'Eco-friendly solution'
  ];

  // Static product data
  const staticProducts = [
    {
      _id: 'sp001',
      title: 'Premium Solar Panel 450W',
      image: '/solar-panels.jpg',
      hoverImage: '/solar1_hover.png',
      category: 'Solar Panels',
      newPrice: '₹25,000',
      oldPrice: '₹30,000',
      rating: 4.8,
      description: 'High-efficiency monocrystalline solar panel with 450W output. Perfect for residential installations with limited roof space. These panels offer excellent performance even in low-light conditions.',
      specifications: {
        brand: 'Cosmic Solar',
        model: 'CS-450M',
        warranty: '25 Years',
        efficiency: '21.5%',
        dimensions: '1700 x 1000 x 35 mm',
        weight: '19.5 kg',
        cellType: 'Monocrystalline',
        powerOutput: '450W',
        operatingTemperature: '-40°C to +85°C',
        description: 'High-efficiency monocrystalline solar panel with 450W output. Perfect for residential installations with limited roof space. These panels offer excellent performance even in low-light conditions.',
        features: [
          'High conversion efficiency of 21.5%',
          'Anti-reflective, high transmission glass',
          'Excellent performance in low-light environments',
          'Robust aluminum frame for extended outdoor use',
          'PID resistant and salt mist corrosion resistant',
          'Certified to withstand high wind loads and snow loads'
        ],
        reviews: defaultReviews
      }
    },
    {
      _id: 'sp002',
      title: 'Monocrystalline Solar Panel 550W',
      image: '/solar1.png',
      hoverImage: '/solar-panels.jpg',
      category: 'Solar Panels',
      newPrice: '₹32,000',
      oldPrice: '₹35,000',
      rating: 4.9,
      description: 'Ultra-high efficiency 550W solar panel with advanced cell technology. Ideal for maximizing energy production in limited spaces.',
      specifications: {
        brand: 'Cosmic Solar',
        model: 'CS-550M-Pro',
        warranty: '30 Years',
        efficiency: '22.8%',
        dimensions: '2000 x 1050 x 35 mm',
        weight: '22 kg',
        cellType: 'Monocrystalline PERC',
        powerOutput: '550W',
        operatingTemperature: '-40°C to +85°C',
        description: 'Ultra-high efficiency 550W solar panel with advanced cell technology. Ideal for maximizing energy production in limited spaces.',
        features: [
          'Industry-leading efficiency of 22.8%',
          'PERC cell technology for superior performance',
          'Excellent low-light performance',
          'Enhanced durability with reinforced frame design',
          'Anti-PID technology',
          'Certified for harsh environmental conditions'
        ],
        reviews: defaultReviews
      }
    },
    {
      _id: 'inv001',
      title: 'Solar Inverter 5kW',
      image: '/solar_design.png',
      category: 'Inverters',
      newPrice: '₹45,000',
      oldPrice: '₹50,000',
      rating: 4.7,
      description: 'High-efficiency 5kW solar inverter with smart monitoring capabilities. Compatible with both on-grid and hybrid solar systems.',
      specifications: {
        brand: 'Cosmic Power',
        model: 'CP-5000H',
        warranty: '10 Years',
        efficiency: '98.2%',
        dimensions: '450 x 380 x 150 mm',
        weight: '18 kg',
        type: 'Hybrid',
        capacity: '5kW',
        mpptChannels: '2',
        description: 'High-efficiency 5kW solar inverter with smart monitoring capabilities. Compatible with both on-grid and hybrid solar systems.',
        features: [
          'Dual MPPT channels for optimal energy harvest',
          'Wi-Fi monitoring with smartphone app',
          'Compatible with lithium and lead-acid batteries',
          'IP65 rated for outdoor installation',
          'Integrated anti-islanding protection',
          'Low voltage ride through capability'
        ],
        reviews: defaultReviews
      }
    },
    {
      _id: 'bat001',
      title: 'Lithium Battery 10kWh',
      image: '/installation.jpg',
      category: 'Batteries',
      newPrice: '₹75,000',
      oldPrice: '₹85,000',
      rating: 4.6,
      description: 'High-capacity 10kWh lithium iron phosphate battery for solar energy storage. Long cycle life and excellent safety features.',
      specifications: {
        brand: 'Cosmic Energy',
        model: 'CE-10000L',
        warranty: '10 Years',
        capacity: '10kWh',
        dimensions: '600 x 450 x 200 mm',
        weight: '85 kg',
        chemistry: 'LiFePO4',
        cycles: '6000+ cycles',
        depthOfDischarge: '95%',
        description: 'High-capacity 10kWh lithium iron phosphate battery for solar energy storage. Long cycle life and excellent safety features.',
        features: [
          'Safe and stable LiFePO4 chemistry',
          'Built-in BMS (Battery Management System)',
          'Modular design for easy expansion',
          'Wall-mountable slim design',
          'CAN bus communication for inverter compatibility',
          'Temperature controlled operation'
        ],
        reviews: defaultReviews
      }
    },
    {
      _id: 'acc001',
      title: 'Solar Panel Mounting Kit',
      image: '/site-assessment.jpg',
      category: 'Accessories',
      newPrice: '₹8,000',
      oldPrice: '₹10,000',
      rating: 4.5,
      description: 'Complete mounting solution for residential rooftop solar installations. Includes all necessary hardware for secure panel mounting.',
      specifications: {
        brand: 'Cosmic Mount',
        model: 'CM-RTS10',
        warranty: '15 Years',
        material: 'Anodized Aluminum',
        compatibility: 'All standard solar panels',
        maxWindLoad: '180 km/h',
        description: 'Complete mounting solution for residential rooftop solar installations. Includes all necessary hardware for secure panel mounting.',
        features: [
          'Pre-assembled components for quick installation',
          'Adjustable tilt angles from 10° to 30°',
          'Corrosion-resistant anodized aluminum',
          'Includes grounding components',
          'Universal clamps fit most panel frames',
          'Engineered for high wind and snow loads'
        ],
        reviews: defaultReviews
      }
    },
    {
      _id: 'acc002',
      title: 'Solar Charge Controller 60A',
      image: '/quality-assurance.jpg',
      category: 'Accessories',
      newPrice: '₹12,000',
      oldPrice: '₹15,000',
      rating: 4.4,
      description: 'Advanced MPPT solar charge controller with 60A capacity. Maximizes charging efficiency for off-grid solar systems.',
      specifications: {
        brand: 'Cosmic Control',
        model: 'CC-60MPPT',
        warranty: '5 Years',
        type: 'MPPT',
        current: '60A',
        voltage: '12V/24V/48V Auto',
        maxPVInput: '150V',
        description: 'Advanced MPPT solar charge controller with 60A capacity. Maximizes charging efficiency for off-grid solar systems.',
        features: [
          'Advanced MPPT tracking algorithm',
          'LCD display with system information',
          'Multiple battery chemistry support',
          'Programmable charging parameters',
          'Built-in temperature compensation',
          'RS485 communication port for monitoring'
        ],
        reviews: defaultReviews
      }
    }
  ];

  // Create a reference to productSpecs for use in the component
  const productSpecs = product?.specifications || {};

  useEffect(() => {
    // Find the product by ID from static data
    const findProduct = () => {
      setLoading(true);
      const foundProduct = staticProducts.find(p => p._id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Set related products (products in the same category)
        const related = staticProducts.filter(p => 
          p.category === foundProduct.category && p._id !== foundProduct._id
        ).slice(0, 4); // Limit to 4 related products
        
        setRelatedProducts(related);
      }
      
      setLoading(false);
    };
    
    if (id) {
      findProduct();
    }
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products/solar-panels" className="flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  // Use product data from API
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.hoverImage].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/products/solar-panels" className="text-gray-500 hover:text-primary">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[400px] border border-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.title} 
                  className="w-full h-full object-contain"
                />
                
                {/* Status badges */}
                {product.status && product.status.length > 0 && (
                  <div className="absolute top-3 left-3 space-y-1 z-10">
                    {product.status.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs font-semibold px-2 py-1 rounded-md inline-block ${
                          tag === 'Sale'
                            ? 'bg-lime-200 text-black'
                            : tag === 'Sold'
                            ? 'bg-red-700 text-white'
                            : 'bg-black text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden ${selectedImage === index ? 'border-primary' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`${product.title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>
              
              {/* Ratings */}
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < product.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {productSpecs.reviews ? `(${productSpecs.reviews.length} reviews)` : `(${product.rating} rating)`}
                </span>
              </div>
              
              {/* Price */}
              <div className="space-y-1">
                {product.oldPrice && (
                  <p className="text-sm line-through text-gray-400">{product.oldPrice}</p>
                )}
                <p className="text-2xl font-bold text-gray-900">{product.newPrice}</p>
                {product.oldPrice && (
                  <p className="text-sm font-medium text-green-600">
                    Save {(() => {
                      const oldPrice = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
                      const newPrice = parseFloat(product.newPrice.replace(/[^0-9.]/g, ''));
                      const discount = oldPrice - newPrice;
                      const discountPercentage = Math.round((discount / oldPrice) * 100);
                      return `₹${discount.toFixed(2)} (${discountPercentage}%)`;
                    })()}
                  </p>
                )}
              </div>
              
              {/* Short Description */}
              <p className="text-gray-600">
                {productSpecs.description ? productSpecs.description.substring(0, 150) + '...' : 'A high-quality solar product designed for efficiency and durability.'}
              </p>
              
              {/* Key Features */}
              {productSpecs.features && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Key Features:</h3>
                  <ul className="space-y-1">
                    {productSpecs.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="pt-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-l-md border border-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-r-md border border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <FileText size={18} className="mr-2" />
                  Request To Quote
                </button>
                <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300">
                  <Heart size={18} className="mr-2" />
                  Add to Wishlist
                </button>
              </div>
              
              {/* Additional Info */}
              <div className="pt-4 space-y-3 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield size={16} className="mr-2 text-primary" />
                  <span>Warranty: {productSpecs.warranty || '1 Year Manufacturer Warranty'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck size={16} className="mr-2 text-primary" />
                  <span>Free shipping on orders over ₹1000</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RefreshCw size={16} className="mr-2 text-primary" />
                  <span>30-day easy returns</span>
                </div>
              </div>
              
              {/* Social Share */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-3">Share:</span>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-[#3b5998] transition-colors">
                      <Facebook size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-[#1da1f2] transition-colors">
                      <Twitter size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-[#0077b5] transition-colors">
                      <Linkedin size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-gray-100 mt-8">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'specifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Reviews {productSpecs.reviews && `(${productSpecs.reviews.length})`}
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="mb-4">{productSpecs.description || 'Product description not available.'}</p>
                  
                  {productSpecs.features && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <ul className="space-y-2">
                        {productSpecs.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  <div className="mt-6 bg-[#f2f9f4] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Why Choose Solar Energy?</h3>
                    <p className="mb-3">Solar energy is a clean, renewable resource that can help reduce your carbon footprint and save on electricity bills. Our solar products are designed to harness this abundant energy source efficiently and reliably.</p>
                    <p>By investing in solar technology, you're not just purchasing a product – you're making a commitment to sustainable living and energy independence.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(productSpecs)
                      .filter(([key]) => !['description', 'features', 'images', 'reviews'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="flex border-b border-gray-100 py-2">
                          <span className="w-1/2 font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <span className="w-1/2 text-gray-600">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-300">
                      Write a Review
                    </button>
                  </div>
                  
                  {productSpecs.reviews && productSpecs.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {productSpecs.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.user}</h4>
                              <div className="flex text-yellow-400 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">Verified Purchase</span>
                          </div>
                          <p className="text-gray-600 mt-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <div
                key={relatedProduct._id}
                className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full overflow-hidden"
                onClick={() => navigate(`/products/product-detail/${relatedProduct._id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* Wishlist icon */}
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white rounded-full p-1 shadow-md hover:scale-110 transition">
                    <Heart className="h-5 w-5 text-red-500" />
                  </button>
                </div>

                {/* Tag badges */}
                {relatedProduct.status && relatedProduct.status.length > 0 && (
                  <div className="absolute top-3 left-3 space-y-1 z-10">
                    {relatedProduct.status.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs font-semibold px-2 py-1 rounded-md inline-block ${
                          tag === 'Sale'
                            ? 'bg-lime-200 text-black'
                            : tag === 'Sold'
                            ? 'bg-red-700 text-white'
                            : 'bg-black text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-[200px] w-full mb-4">
                  <img
                    src={relatedProduct.image || '/placeholder-product.png'}
                    alt={relatedProduct.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-base font-semibold mb-1">{relatedProduct.title}</h3>
                  {relatedProduct.oldPrice && (
                    <p className="text-sm line-through text-gray-400">₹{relatedProduct.oldPrice}</p>
                  )}
                  <p className="text-lg font-bold">₹{relatedProduct.price}</p>
                  <div className="flex justify-center text-yellow-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < (relatedProduct.rating || 5) ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">No related products found.</p>
          </div>
        )}
      </div>
    <RequestQuoteModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      productName={product?.title} 
    />
    </div>
  );
};

export default ProductDetail;