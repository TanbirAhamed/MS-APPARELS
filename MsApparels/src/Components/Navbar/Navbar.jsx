import React, { useState, useEffect, useRef } from 'react'; // Added useEffect and useRef
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSignOutAlt, FaTachometerAlt, FaChevronDown } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";
import logo from "../../assets/Images/logo.jpg";
import { Menus } from '../Utils/Utils';
import DesktopMenu from './Both/DesktopMenu';
import MobMenu from './Both/MobMenu';
import { useAuth } from '../../AuthContext';
import { auth } from '../Firebase/firebase.config';

const Navbar = () => {
    const { userRole, setUserRole } = useAuth(); // Get userRole and setUserRole from AuthContext
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown toggle
    const dropdownRef = useRef(null); // Ref for the dropdown container

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUserRole(null); // Clear the user role
            navigate('/login'); // Navigate to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Add event listener when dropdown is open
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]); // Re-run effect when isDropdownOpen changes

    return (
        <div>
            <header
                className={'text-white lg:h-18 h-16 text-[15px] fixed inset-0 flex items-center justify-center z-30 transition-all duration-75 bg-neutral-800'}
            >
                <nav className="px-3.5 flex justify-between w-full max-w-7xl mx-auto mt-1 lg:mt-0">
                    <div className="z-[999] relative">
                        <NavLink
                            to="/"
                            className="text-lg gap-2 font-bold rounded-full flex items-center justify-center"
                        >
                            <div className="lg:w-18 lg:h-18 w-15 h-15">
                                <img
                                    alt="logo"
                                    src={logo}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span>MS APPARELS</span>
                        </NavLink>
                    </div>
                    <ul className="lg:flex items-center hidden gap-x-1">
                        {Menus.map((menu) => (
                            <DesktopMenu menu={menu} key={menu.name} />
                        ))}
                    </ul>
                    <div className="flex items-center gap-x-5">
                        {/* Social media links and dropdown */}
                        <ul className="hidden lg:flex gap-2 items-center text-2xl cursor-pointer">
                            <a
                                href="https://www.facebook.com/people/MS-Apparels/61574932028343/?mibextid=wwXIfr&rdid=HJmDEJYIxyMkahQQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DW6Ss5i7A%2F%3Fmibextid%3DwwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative p-2 bg-neutral-800 rounded-full text-white hover:text-white transition-colors duration-300 overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-[#FF014F] rounded-full transform scale-0 group-hover:scale-100 origin-center transition-transform duration-200 ease-out z-0"></span>
                                <FaFacebook className="relative z-20" />
                            </a>
                            <a
                                href="https://x.com/?lang=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative p-2 bg-neutral-800 rounded-full text-white hover:text-white transition-colors duration-300 overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-[#FF014F] rounded-full transform scale-0 group-hover:scale-100 origin-center transition-transform duration-200 ease-out z-0"></span>
                                <FaTwitter className="relative z-20" />
                            </a>
                            <a
                                href="https://www.instagram.com/accounts/login/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative p-2 bg-neutral-800 rounded-full text-white hover:text-white transition-colors duration-300 overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-[#FF014F] rounded-full transform scale-0 group-hover:scale-100 origin-center transition-transform duration-200 ease-out z-0"></span>
                                <FaInstagram className="relative z-20" />
                            </a>
                            <a
                                href="https://www.youtube.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative p-2 bg-neutral-800 rounded-full text-white hover:text-white transition-colors duration-300 overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-[#FF014F] rounded-full transform scale-0 group-hover:scale-100 origin-center transition-transform duration-200 ease-out z-0"></span>
                                <FaYoutube className="relative z-20" />
                            </a>

                            {/* Dropdown for Admin/Moderator Actions */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="relative p-2 px-4 py-1 flex z-10 items-center gap-2 bg-neutral-800 rounded-full text-white hover:text-white transition-colors duration-300 overflow-hidden group"
                                >
                                    <span className="absolute inset-0 bg-[#FF014F] rounded-full transform scale-0 group-hover:scale-100 origin-center transition-transform duration-200 ease-out z-0"></span>
                                    <p className="z-20">{userRole === 'admin' || userRole === 'moderator' ? 'Account' : 'Admin'}</p>
                                    <FaChevronDown className={`relative mt-2 z-20 w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg z-50">
                                        <div className="py-1">
                                            {userRole === 'admin' || userRole === 'moderator' ? (
                                                <>
                                                    {/* Dashboard Button */}
                                                    <NavLink
                                                        to="/dashboard"
                                                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#FF014F] transition-colors duration-200"
                                                        onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                                                    >
                                                        <FaTachometerAlt className="w-5 h-5" />
                                                        <span>Dashboard</span>
                                                    </NavLink>
                                                    {/* Logout Button */}
                                                    <button
                                                        onClick={() => {
                                                            handleLogout();
                                                            setIsDropdownOpen(false); // Close dropdown on click
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#FF014F] transition-colors duration-200 w-full text-left"
                                                    >
                                                        <FaSignOutAlt className="w-5 h-5" />
                                                        <span>Logout</span>
                                                    </button>
                                                </>
                                            ) : (
                                                /* Login Button (shown when not logged in as admin/moderator) */
                                                <NavLink
                                                    to="/login"
                                                    className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#FF014F] transition-colors duration-200"
                                                    onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                                                >
                                                    <LuLogIn className="w-5 h-5" />
                                                    <span>Admin</span>
                                                </NavLink>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ul>
                        <div className="lg:hidden">
                            <MobMenu
                                Menus={Menus}
                                userRole={userRole}
                                setUserRole={setUserRole}
                                handleLogout={handleLogout}
                            />
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Navbar;