import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, secondaryAuth } from '../../Firebase/firebase.config'; // Import secondaryAuth
import toast, { Toaster } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const AddModerator = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('moderator');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' }); // State for validation errors

  useEffect(() => {
    if (success) {
      toast.success(success, {
        duration: 4000,
        position: 'top-center',
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-center',
      });
    }
  }, [error]);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    return '';
  };

  // Handle image upload and compression
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
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
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

  const handleAddModerator = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({ email: '', password: '' }); // Reset validation errors
    setLoading(true);

    // Validate email and password
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setValidationErrors({ email: emailError, password: passwordError });
      if (emailError) {
        toast.error(emailError, {
          duration: 4000,
          position: 'top-center',
        });
      }
      if (passwordError) {
        toast.error(passwordError, {
          duration: 4000,
          position: 'top-center',
        });
      }
      setLoading(false);
      return; // Stop submission if validation fails
    }

    try {
      // Ensure the admin is signed in on the primary auth instance
      const adminUser = auth.currentUser;
      if (!adminUser) {
        throw new Error('Admin must be signed in to add a moderator');
      }

      // Create the user with email and password using the secondary auth instance
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;

      // Update the user's display name in Firebase
      await updateProfile(user, { displayName: name });

      // Store the moderator in MongoDB via the backend API
      const moderatorData = {
        uid: user.uid,
        displayName: name,
        email: user.email,
        role,
        image,
      };
      console.log('Sending moderator data:', moderatorData);

      const response = await fetch('http://localhost:5000/api/moderators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moderatorData),
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`Failed to parse response as JSON: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to store moderator in database');
      }

      setSuccess('Moderator added successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setRole('moderator');
      setImage(null);

      // The admin remains signed in on the primary auth instance (auth)
      console.log('Admin still signed in:', auth.currentUser);
    } catch (error) {
      console.error('Error in handleAddModerator:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(error.message || 'Failed to add moderator');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Moderator</h2>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <form onSubmit={handleAddModerator} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter moderator's name"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter moderator's email"
              required
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter moderator's password"
              required
              disabled={loading}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
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
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-500 text-white font-semibold rounded-md transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Adding...' : 'Add Moderator'}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default AddModerator;