import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '../../Firebase/firebase.config'; 
import { FaBars, FaTachometerAlt, FaArrowRight, FaTimes, FaUsers, FaBox, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModeratorOpen, setIsModeratorOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, setUserRole } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleModeratorDropdown = () => {
    setIsModeratorOpen((prev) => !prev);
  };

  const toggleProductsDropdown = () => {
    setIsProductsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      navigate('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    const isModeratorRoute = path.startsWith('/dashboard/moderator');
    const isProductsRoute = path.startsWith('/dashboard/products');

    setIsModeratorOpen(isModeratorRoute);
    setIsProductsOpen(isProductsRoute);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Only set sidebar state if device type changes (mobile <-> desktop)
      if (mobile !== isMobile) {
        setIsSidebarOpen(!mobile); 
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="text-gray-700 hover:text-gray-900 focus:outline-none mr-4 md:mr-6"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            aria-expanded={isSidebarOpen}
          >
            <FaBars className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-blue-600">MS APPARELS</h1>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Go to Home Page Button */}
          <NavLink
            to="/"
            className="flex items-center bg-gray-200 gap-2 border-1 font-semi-bold p-1.5 rounded-xl text-gray-600 hover:text-blue-700"
            aria-label="Go to Home Page"
          >
            <FaHome className="w-5 h-5" /> Home
          </NavLink>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center bg-gray-200 gap-2 border-1 font-semi-bold p-1.5 rounded-xl text-gray-600 hover:text-red-700"
            aria-label="Logout"
          >
            <FaSignOutAlt className="w-5 h-5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Container (Sidebar + Main Content) */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed left-0 md:mt-3.5 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } top-0 h-screen md:top-16 md:h-[calc(100vh-4rem)] md:static md:w-64 md:pt-0 ${!isSidebarOpen && 'md:hidden'}`}
        >
          <div className="p-4 mt-2 flex items-center justify-end md:hidden">
            {isMobile && (
              <button
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
                onClick={closeSidebar}
                aria-label="Close Sidebar"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {/* Dashboard NavLink */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                      isActive ? 'bg-blue-100' : ''
                    }`
                  }
                  onClick={() => isMobile && closeSidebar()}
                >
                  <FaTachometerAlt className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">Dashboard</span>
                </NavLink>
              </li>

              {/* Moderator Dropdown - Only visible to admins */}
              {userRole === 'admin' && (
                <li>
                  <button
                    onClick={toggleModeratorDropdown}
                    className={`flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                      location.pathname.startsWith('/dashboard/moderator') ? 'bg-blue-100' : ''
                    }`}
                  >
                    <FaUsers className="w-5 h-5 mr-3" />
                    <span className="flex-1 text-left">Moderator</span>
                    <FaArrowRight
                      className={`w-3 h-3 transform transition-transform ${
                        isModeratorOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isModeratorOpen && (
                    <ul className="pl-8 space-y-1">
                      <NavLink
                        to="/dashboard/moderator/add"
                        className={({ isActive }) =>
                          `flex items-center p-2 mt-1 text-gray-700 hover:bg-gray-100 rounded-md ${
                            isActive ? 'bg-blue-100' : ''
                          }`
                        }
                        onClick={() => isMobile && closeSidebar()}
                      >
                        Add Moderator
                      </NavLink>
                      <NavLink
                        to="/dashboard/moderator/show"
                        className={({ isActive }) =>
                          `flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                            isActive ? 'bg-blue-100' : ''
                          }`
                        }
                        onClick={() => isMobile && closeSidebar()}
                      >
                        Show Moderator
                      </NavLink>
                    </ul>
                  )}
                </li>
              )}

              {/* Products Dropdown */}
              <li>
                <button
                  onClick={toggleProductsDropdown}
                  className={`flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                    location.pathname.startsWith('/dashboard/products') ? 'bg-blue-100' : ''
                  }`}
                >
                  <FaBox className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">Products</span>
                  <FaArrowRight
                    className={`w-3 h-3 transform transition-transform ${
                      isProductsOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {isProductsOpen && (
                  <ul className="pl-8 space-y-1">
                    <NavLink
                      to="/dashboard/products/add"
                      className={({ isActive }) =>
                        `flex items-center p-2 mt-1 text-gray-700 hover:bg-gray-100 rounded-md ${
                          isActive ? 'bg-blue-100' : ''
                        }`
                      }
                      onClick={() => isMobile && closeSidebar()}
                    >
                      Add Products
                    </NavLink>
                    <NavLink
                      to="/dashboard/products/show"
                      className={({ isActive }) =>
                        `flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                          isActive ? 'bg-blue-100' : ''
                        }`
                      }
                      onClick={() => isMobile && closeSidebar()}
                    >
                      Show Products
                    </NavLink>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Backdrop for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
            !isMobile && isSidebarOpen ? 'md:ml-0' : 'md:ml-0'
          }`}
        >
          <main className="p-4 overflow-y-auto flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;