import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import RequestQuoteModal from '../../components/RequestQuoteModal';

export const products = [
  {
    title: 'Portable Solar Charger',
    oldPrice: '₹1,800.00',
    newPrice: '₹1,750.00',
    status: ['Sold', 'New'],
    image: '/solar1.png',
    hoverImage: '/solar1_hover.png',
    rating: 5,
  },
  {
    title: 'Camping Energy Storage',
    oldPrice: '₹5,500.00',
    newPrice: '₹5,000.00',
    status: ['Sale', 'New'],
    image: 'https://image.made-in-china.com/202f0j00UbDlwNkqAcYI/800000mAh-Camping-Energy-Storage-2400W-1500W-Lithium-Battery-Home-Energy-Storage-Power-Supply-Outdoor-Portable-Power-Station.webp',
    hoverImage: 'https://s.alicdn.com/@sc04/kf/Hed8911dfbcf04e4aac427ded1d15870aG.jpg_720x720q50.jpg',
    rating: 5,
  },
  {
    title: 'Solar Powered Flashlight',
    oldPrice: '₹2,970.00',
    newPrice: '₹2,940.00',
    status: ['Sale', 'New'],
    image: '/assets/solar3.png',
    hoverImage: '/assets/solar3_hover.png',
    rating: 5,
  },
];

const SolarPanel = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const handleProductClick = (index) => {
    navigate(`/products/product-detail/${index}`);
  };
  
  const handleRequestQuote = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  

  
  return (
    <>
      <div className="bg-white px-6 py-4">
        <p className="text-sm text-gray-700 mb-4">Showing all {products.length} results</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative bg-[#f2f9f4] p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.15)] transition-all flex flex-col justify-between h-full overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(index)}
            >
              {/* Wishlist icon */}
              <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white rounded-full p-1 shadow-md hover:scale-110 transition">
                  <HeartIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>

              {/* Tag badges */}
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

              {/* Image with hover swap */}
              <div className="relative h-[400px] w-full">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />
                <img
                  src={product.hoverImage}
                  alt={`${product.title} hover`}
                  className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
                <button 
                  className="absolute inset-x-5 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-sm py-2 rounded-lg w-[calc(100%-2.5rem)] mx-auto z-20"
                  onClick={(e) => handleRequestQuote(e, product)}
                >
                  Request To Quote
                </button>
              </div>

              {/* Content */}
              <div className="mt-4 text-center">
                <h3 className="text-base font-semibold mb-1">{product.title}</h3>
                <p className="text-sm line-through text-gray-400">{product.oldPrice}</p>
                <p className="text-lg font-bold">{product.newPrice}</p>
                <div className="text-yellow-500 mt-1">{'★'.repeat(product.rating)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quote Request Modal */}
      <RequestQuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productName={selectedProduct?.title} 
      />
    </>
  );
};

export default SolarPanel;
