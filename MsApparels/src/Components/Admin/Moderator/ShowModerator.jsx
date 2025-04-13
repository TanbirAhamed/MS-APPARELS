import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { updateProfile, deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.config';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'; 

const ShowModerator = () => {
  const [moderators, setModerators] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState(''); 
  const [updatePassword, setUpdatePassword] = useState('');
  const [updateRole, setUpdateRole] = useState('');
  const [updateImage, setUpdateImage] = useState(''); 

  // Fetch all moderators from the database
  const fetchModerators = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/moderators');
      if (!response.ok) {
        throw new Error('Failed to fetch moderators');
      }
      const data = await response.json();
      setModerators(data);
    } catch (err) {
      setError(`Error fetching moderators: ${err.message}`);
      toast.error(`Error fetching moderators: ${err.message}`, {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerators();
  }, []);

  // Open the update modal
  const handleUpdateClick = (moderator) => {
    setSelectedModerator(moderator);
    setUpdateName(moderator.displayName);
    setUpdateEmail(moderator.email); 
    setUpdatePassword('');
    setUpdateRole(moderator.role);
    setUpdateImage(moderator.image || ''); 
  };

  // Handle image upload and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdateImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle update submission
  const handleUpdateModerator = async (e) => {
    e.preventDefault();

    try {
      // Update MongoDB record
      const updatedModerator = {
        uid: selectedModerator.uid,
        displayName: updateName,
        email: updateEmail, 
        role: updateRole,
        image: updateImage || selectedModerator.image, 
      };

      const response = await fetch(`http://localhost:5000/api/moderators/${selectedModerator._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModerator),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`Failed to parse response as JSON: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile');
      }

      // Update Firebase Authentication (only for the current user)
      const user = auth.currentUser;
      if (user && user.uid === selectedModerator.uid) {
  
        await updateProfile(user, { displayName: updateName });

        if (updateEmail && updateEmail !== selectedModerator.email) {
          await updateEmail(user, updateEmail);
        }

        if (updatePassword) {
          await updatePassword(user, updatePassword);
        }
      }

      // Update local state
      setModerators((prev) =>
        prev.map((mod) =>
          mod._id === selectedModerator._id
            ? { ...mod, displayName: updateName, email: updateEmail, role: updateRole, image: updateImage || mod.image }
            : mod
        )
      );

      toast.success('Profile updated successfully!', {
        duration: 4000,
        position: 'top-center',
      });
      setTimeout(() => setSelectedModerator(null), 2000);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign back in to update your email or password.', {
          duration: 4000,
          position: 'top-center',
        });
      } else {
        toast.error(`Error updating profile: ${error.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  // Handle delete
  const handleDeleteModerator = async (moderator) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete the user from Firebase Authentication (only for the current user)
          const user = auth.currentUser;
          if (user && user.uid === moderator.uid) {
            try {
              await deleteUser(user);
            } catch (firebaseError) {
              if (firebaseError.code === 'auth/requires-recent-login') {
                throw new Error('Please sign out and sign back in to delete your account.');
              }
              throw firebaseError;
            }
          }

          // Delete the moderator from MongoDB
          const response = await fetch(`http://localhost:5000/api/moderators/${moderator._id}`, {
            method: 'DELETE',
          });

          const responseText = await response.text();
          let responseData;
          try {
            responseData = JSON.parse(responseText);
          } catch (jsonError) {
            throw new Error(`Failed to parse response as JSON: ${responseText}`);
          }

          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to delete moderator from database');
          }

          // Update local state
          setModerators((prev) => prev.filter((mod) => mod._id !== moderator._id));
          // Show success message with SweetAlert2
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } catch (error) {
          toast.error(`Error deleting account: ${error.message}`, {
            duration: 4000,
            position: 'top-right',
          });
        }
      }
    });
  };

  // Handle password reset email
  const handleSendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!', {
        duration: 4000,
        position: 'top-center',
      });
    } catch (error) {
      toast.error(`Error sending password reset email: ${error.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Moderators</h2>
      {loading && <p>Loading moderators...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading && moderators.length === 0 && !error && <p>No moderators found.</p>}
      {!loading && moderators.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {moderators.map((moderator) => (
            <div
              key={moderator._id}
              className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              {/* Moderator Image */}
              <div className="h-48 w-full flex items-center justify-center bg-gray-100">
                {moderator.image ? (
                  <img
                    src={moderator.image}
                    alt={moderator.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="text-gray-400">[No Image]</p>
                )}
              </div>

              {/* Moderator Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{moderator.displayName}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Email:</span> {moderator.email}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Role:</span> {moderator.role.charAt(0).toUpperCase() + moderator.role.slice(1)}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(moderator.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleUpdateClick(moderator)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit Moderator"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteModerator(moderator)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete Moderator"
                  >
                    <FaTrash size={20} />
                  </button>
                  <button
                    onClick={() => handleSendPasswordReset(moderator.email)}
                    className="text-green-500 hover:text-green-700 text-sm"
                    aria-label="Send Password Reset Email"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {selectedModerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg mx-auto my-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Update Moderator</h3>
            <form onSubmit={handleUpdateModerator} className="space-y-4">
              <div>
                <label htmlFor="updateName" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="updateName"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter moderator's name"
                  required
                />
              </div>
              <div>
                <label htmlFor="updateEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="updateEmail"
                  value={updateEmail}
                  onChange={(e) => setUpdateEmail(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter moderator's email"
                  required
                />
              </div>
              <div>
                <label htmlFor="updatePassword" className="block text-sm font-medium text-gray-700">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  id="updatePassword"
                  value={updatePassword}
                  onChange={(e) => setUpdatePassword(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label htmlFor="updateRole" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="updateRole"
                  value={updateRole}
                  onChange={(e) => setUpdateRole(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="updateImage" className="block text-sm font-medium text-gray-700">
                  Change Image (optional)
                </label>
                <input
                  type="file"
                  id="updateImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Preview the current or updated image */}
                {updateImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Image Preview:</p>
                    <img
                      src={updateImage}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-md mt-1"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedModerator(null)}
                  className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Update
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

export default ShowModerator;