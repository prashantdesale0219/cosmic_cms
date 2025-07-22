import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../services/api'

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Static product data
  const staticProducts = [
    {
      _id: 'sp001',
      title: 'Premium Solar Panel 450W',
      image: '/solar-panels.jpg',
      hoverImage: '/solar1_hover.png',
      category: 'Solar Panels',
      newPrice: 25000,
      oldPrice: 30000,
      rating: 4.8
    },
    {
      _id: 'sp002',
      title: 'Monocrystalline Solar Panel 550W',
      image: '/solar1.png',
      hoverImage: '/solar-panels.jpg',
      category: 'Solar Panels',
      newPrice: 32000,
      oldPrice: 35000,
      rating: 4.9
    },
    {
      _id: 'inv001',
      title: 'Solar Inverter 5kW',
      image: '/solar_design.png',
      category: 'Inverters',
      newPrice: 45000,
      oldPrice: 50000,
      rating: 4.7
    },
    {
      _id: 'bat001',
      title: 'Lithium Battery 10kWh',
      image: '/installation.jpg',
      category: 'Batteries',
      newPrice: 75000,
      oldPrice: 85000,
      rating: 4.6
    },
    {
      _id: 'acc001',
      title: 'Solar Panel Mounting Kit',
      image: '/site-assessment.jpg',
      category: 'Accessories',
      newPrice: 8000,
      oldPrice: 10000,
      rating: 4.5
    },
    {
      _id: 'acc002',
      title: 'Solar Charge Controller 60A',
      image: '/quality-assurance.jpg',
      category: 'Accessories',
      newPrice: 12000,
      oldPrice: 15000,
      rating: 4.4
    }
  ];
  
  useEffect(() => {
    // Set static products instead of fetching from API
    setProducts(staticProducts);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center">No products available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/products/product-detail/${product._id}`}>
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.hoverImage && (
                    <img 
                      src={product.hoverImage} 
                      alt={`${product.title} hover`} 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      {product.newPrice && (
                        <span className="text-accent-600 font-bold">₹{product.newPrice.toLocaleString()}</span>
                      )}
                      {product.oldPrice && product.newPrice && product.oldPrice > product.newPrice && (
                        <span className="text-gray-400 line-through ml-2">₹{product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <span className="bg-accent-100 text-accent-800 text-xs px-2 py-1 rounded">{product.category}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
