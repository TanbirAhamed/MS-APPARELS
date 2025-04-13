import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import imageCompression from 'browser-image-compression'; // Import image compression library

const AddProducts = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        toast.error('Image size must be less than 2MB', {
          duration: 4000,
          position: 'top-center',
        });
        return;
      }

      try {
        // Compress the image
        const options = {
          maxSizeMB: 1, 
          maxWidthOrHeight: 1024, 
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // Convert the compressed image to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.onerror = () => {
          setError('Failed to read image file');
          toast.error('Failed to read image file', {
            duration: 4000,
            position: 'top-center',
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setError('Failed to compress image');
        toast.error('Failed to compress image', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !image || !price || !oldPrice) {
      setError('All fields are required');
      toast.error('All fields are required', {
        duration: 4000,
        position: 'top-center',
      });
      setLoading(false);
      return;
    }

    if (isNaN(price) || isNaN(oldPrice) || Number(price) <= 0 || Number(oldPrice) <= 0) {
      setError('Price and old price must be positive numbers');
      toast.error('Price and old price must be positive numbers', {
        duration: 4000,
        position: 'top-center',
      });
      setLoading(false);
      return;
    }

    const productData = {
      name,
      image, 
      price: Number(price),
      oldPrice: Number(oldPrice),
    };

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      // Log the raw response for debugging
      const responseText = await response.text();

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`Failed to parse response as JSON: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to add product (HTTP ${response.status})`);
      }

      toast.success('Product added successfully!', {
        duration: 4000,
        position: 'top-center',
      });

      setName('');
      setImage(null);
      setPrice('');
      setOldPrice('');
      document.getElementById('imageInput').value = '';
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(`Error adding product: ${error.message}`);
      toast.error(`Error adding product: ${error.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          {image && (
            <div className="mt-2">
              <img src={image} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
            step="0.01"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700">
            Old Price
          </label>
          <input
            type="number"
            id="oldPrice"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter old price"
            step="0.01"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default AddProducts;