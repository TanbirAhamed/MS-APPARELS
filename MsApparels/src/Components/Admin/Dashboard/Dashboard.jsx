import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { sendPasswordResetEmail, deleteUser, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.config';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'; 

const Dashboard = () => {
  const [moderator, setModerator] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const [updateImage, setUpdateImage] = useState(''); 

  // Fetch the logged-in moderator
  useEffect(() => {
    const fetchModerator = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Please sign in to view your profile.');
          setLoading(false);
          return;
        }

        // Fetch the moderator record from MongoDB using the user's UID
        const response = await fetch(`http://localhost:5000/api/moderators?uid=${user.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch moderator');
        }
        const data = await response.json();
        if (data.length === 0) {
          setError('Moderator profile not found in the database.');
        } else {
          setModerator(data[0]); 
        }
      } catch (err) {
        setError(`Error fetching moderator: ${err.message}`);
        toast.error(`Error fetching moderator: ${err.message}`, {
          duration: 4000,
          position: 'top-right',
        });
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchModerator();
      } else {
        setError('Please sign in to view your profile.');
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  // Open the update modal
  const handleUpdateClick = (moderator) => {
    setSelectedModerator(moderator);
    setUpdateName(moderator.displayName);
    setUpdateEmail(moderator.email);
    setUpdatePassword('');
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
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in.');
      }

      // Update Firebase Authentication
      await updateProfile(user, { displayName: updateName });

      if (updateEmail && updateEmail !== selectedModerator.email) {
        await updateEmail(user, updateEmail);
      }

      if (updatePassword) {
        await updatePassword(user, updatePassword);
      }

      // Update MongoDB record
      const updatedModerator = {
        uid: selectedModerator.uid,
        displayName: updateName,
        email: updateEmail || selectedModerator.email,
        role: selectedModerator.role, 
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

      // Update local state
      setModerator({ ...moderator, displayName: updateName, email: updateEmail || selectedModerator.email, image: updateImage || selectedModerator.image });

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
  const handleDeleteModerator = async () => {

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
          const user = auth.currentUser;
          if (!user) {
            throw new Error('No user is currently signed in.');
          }

          // Delete the user from Firebase Authentication
          try {
            await deleteUser(user);
          } catch (firebaseError) {
            if (firebaseError.code === 'auth/requires-recent-login') {
              throw new Error('Please sign out and sign back in to delete your account.');
            }
            throw firebaseError;
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

          setModerator(null); 
          // Show success message with SweetAlert2
          Swal.fire({
            title: "Deleted!",
            text: "Your account has been deleted.",
            icon: "success"
          });
        } catch (error) {
          toast.error(`Error deleting account: ${error.message}`, {
            duration: 4000,
            position: 'top-center',
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
    <div className="flex items-center justify-center p-4">
      {/* Moderator Section */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-lg font-semibold text-black mb-6 text-center">My Profile</h2>
        {loading && <p className="text-center">Loading profile...</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {!loading && !moderator && !error && <p className="text-center">No profile found. Please sign in.</p>}
        {!loading && moderator && (
          <div className="flex flex-col items-center gap-6">
            {/* Moderator Image */}
            <div className="w-48">
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-center h-48">
                {moderator.image ? (
                  <img src={moderator.image} alt={moderator.displayName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <p className="text-gray-400">[Image Placeholder]</p>
                )}
              </div>
            </div>

            {/* Moderator Details */}
            <div className="w-full">
              <h3 className="text-xl font-bold mb-4 text-center">Profile Details</h3>
              <div className="space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Name</span>
                  <span className="text-gray-800">{moderator.displayName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Email</span>
                  <span className="text-gray-800">{moderator.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Role</span>
                  <span className="text-gray-800 capitalize">{moderator.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Created</span>
                  <span className="text-gray-800">
                    {new Date(moderator.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Actions</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateClick(moderator)}
                      className="p-2 bg-green-200 rounded-full hover:bg-green-300"
                      title="Edit"
                    >
                      <FaEdit className="text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteModerator()}
                      className="p-2 bg-red-200 rounded-full hover:bg-red-300"
                      title="Delete"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                    <button
                      onClick={() => handleSendPasswordReset(moderator.email)}
                      className="p-2 bg-blue-200 rounded-full hover:bg-blue-300"
                      title="Reset Password"
                    >
                      <span className="text-blue-600 text-xs">Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedModerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg mx-auto my-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Update Profile</h3>
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
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
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
                  <div className="mt-2 flex justify-center">
                    <div>
                      <p className="text-sm text-gray-600 text-center">Image Preview:</p>
                      <img
                        src={updateImage}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded-md mt-1"
                      />
                    </div>
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

export default Dashboard;