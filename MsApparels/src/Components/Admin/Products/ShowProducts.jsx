import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import imageCompression from 'browser-image-compression'; 
import Swal from 'sweetalert2'; 

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the product being edited
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    price: '',
    oldPrice: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

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
        setFilteredProducts(data); // Initially, all products are displayed
        if (data.length === 0) {
          setError('No products found in the database.');
        }
      } catch (err) {
        setError(`Error fetching products: ${err.message}`);
        toast.error(`Error fetching products: ${err.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredProducts(products); 
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      if (filtered.length === 0) {
        setError('No products match your search.');
      } else {
        setError('');
      }
    }
  };

  // Handle delete product
  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return; 

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || 'Failed to delete product');
      }
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      // Show SweetAlert2 success dialog
      await Swal.fire({
        title: "Deleted!",
        text: "Your product has been deleted.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      toast.error(`Error deleting product: ${err.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  // Open the modal and prefill the form with the selected product's data
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      image: product.image,
      price: product.price.toString(),
      oldPrice: product.oldPrice.toString(),
    });
    setIsModalOpen(true);
  };

  // Handle image change in the modal form
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('Image size must be less than 2MB');
        toast.error('Image size must be less than 2MB', {
          duration: 4000,
          position: 'top-center',
        });
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, image: reader.result });
        };
        reader.onerror = () => {
          setFormError('Failed to read image file');
          toast.error('Failed to read image file', {
            duration: 4000,
            position: 'top-center',
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setFormError('Failed to compress image');
        toast.error('Failed to compress image', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  // Handle form submission to update the product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    if (!formData.name || !formData.image || !formData.price || !formData.oldPrice) {
      setFormError('All fields are required');
      toast.error('All fields are required', {
        duration: 4000,
        position: 'top-center',
      });
      setFormLoading(false);
      return;
    }

    if (isNaN(formData.price) || isNaN(formData.oldPrice) || Number(formData.price) <= 0 || Number(formData.oldPrice) <= 0) {
      setFormError('Price and old price must be positive numbers');
      toast.error('Price and old price must be positive numbers', {
        duration: 4000,
        position: 'top-center',
      });
      setFormLoading(false);
      return;
    }

    const updatedProduct = {
      name: formData.name,
      image: formData.image,
      price: Number(formData.price),
      oldPrice: Number(formData.oldPrice),
    };

    try {
      const response = await fetch(`http://localhost:5000/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`Failed to parse response as JSON: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to update product (HTTP ${response.status})`);
      }

      // Update the product in the local state
      const updatedProducts = products.map((product) =>
        product._id === selectedProduct._id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(
        updatedProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      toast.success('Product updated successfully!', {
        duration: 4000,
        position: 'top-center',
      });

      setIsModalOpen(false);
      setSelectedProduct(null);
      setFormData({ name: '', image: null, price: '', oldPrice: '' });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setFormError(`Error updating product: ${error.message}`);
      toast.error(`Error updating product: ${error.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Products</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">UID</th>
                <th className="p-3 text-left">PRODUCT</th>
                <th className="p-3 text-left">OLD PRICE</th>
                <th className="p-3 text-left">NEW PRICE</th>
                <th className="p-3 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{`#${index + 1}`}</td>
                  <td className="p-3 flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                    </div>
                  </td>
                  <td className="p-3">${product.oldPrice}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-green-200 rounded-full hover:bg-green-300"
                      title="Edit"
                    >
                      <FaEdit className="text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-red-200 rounded-full hover:bg-red-300"
                      title="Delete"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for editing product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg mx-auto my-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  disabled={formLoading}
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
                  disabled={formLoading}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  New Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                  step="0.01"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700">
                  Old Price
                </label>
                <input
                  type="number"
                  id="oldPrice"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter old price"
                  step="0.01"
                  disabled={formLoading}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={formLoading}
                >
                  {formLoading ? 'Updating Product...' : 'Update Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={formLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default ShowProducts;