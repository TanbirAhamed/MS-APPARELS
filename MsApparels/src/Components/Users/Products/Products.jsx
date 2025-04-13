import React, { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        setProducts(data);
      } catch (err) {
        setError(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle the "Order Now" button click
  const handleOrderNow = (productName) => {
    // Encode the product name for the URL
    const encodedProductName = encodeURIComponent(productName || 'Unnamed Product');
    // Construct the WhatsApp URL
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=7867637398&text=Hi%2C+I%27m+interested+in+the+product+${encodedProductName}&type=phone_number&app_absent=0`;
    // Redirect to the WhatsApp URL
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center">No products found.</p>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="grid px-5 sm:px-0 grid-cols-1 sm:grid-cols-2 md:px-0 md:grid-cols-3 lg:px-0 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id} 
              className="card bg-stone-200 shadow-xl w-full group relative"
            >
              <figure className="px-6 pt-6">
                <img
                  src={product.image}
                  alt={product.name || 'Product'}
                  className="rounded-xl h-full w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{product.name || 'Unnamed Product'}</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-500 line-through">
                    {product.oldPrice != null ? `$${product.oldPrice.toFixed(2)}` : 'N/A'}
                  </p>
                  <p className="text-black text-xl font-bold">
                    {product.price != null ? `$${product.price.toFixed(2)}` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Hover Elements: Icons on the right */}
              <div className="absolute top-1/3 right-4 transform -translate-y-1/2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
                <button
                  className="bg-white border-1 rounded-full p-2 shadow-md hover:bg-gray-100 icon transition-all duration-300 delay-[200ms] group-hover:translate-x-0 translate-x-5 opacity-0 cursor-pointer group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </button>
                <button
                  className="bg-white cursor-pointer border-1 rounded-full p-2 shadow-md hover:bg-gray-100 icon transition-all duration-300 delay-[400ms] group-hover:translate-x-0 translate-x-5 opacity-0 group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  className="bg-white cursor-pointer border-1 rounded-full p-2 shadow-md hover:bg-gray-100 icon transition-all duration-300 delay-[600ms] group-hover:translate-x-0 translate-x-5 opacity-0 group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Order Now button: Always visible on mobile, hover on larger screens */}
              <div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:delay-0 md:group-hover:translate-y-0 md:translate-y-5">
                <button
                  onClick={() => handleOrderNow(product.name)}
                  className="bg-gray-800 text-white px-4 cursor-pointer py-2 rounded-md hover:bg-gray-900"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;