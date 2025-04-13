import React, { useState } from 'react';
import { IoMenu, IoClose } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa"; // Added FaTachometerAlt and FaSignOutAlt
import { LuLogIn } from "react-icons/lu";
import { motion } from "framer-motion";

const MobMenu = ({ Menus, userRole, setUserRole, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button className='z-[999] relative text-2xl' onClick={toggleDrawer}>
                {isOpen ? <IoClose /> : <IoMenu />}
            </button>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isOpen ? "0%" : "-100%" }}
                className='fixed left-0 right-0 top-16 overflow-x-auto h-full bg-[#18181A] backdrop-blur text-white p-6'
            >
                <ul>
                    {Menus?.map(({ name }, i) => (
                        <li key={name}>
                            <NavLink
                                to={`/${name.toLowerCase().replace(" ", "-")}`}
                                className={({ isActive }) =>
                                    `flex justify-between p-3 hover:bg-white/5 rounded-md cursor-pointer relative ${isActive ? 'bg-white/5' : ''
                                    }`
                                }
                                onClick={toggleDrawer}
                            >
                                {name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                {/* Admin/Moderator Actions Section */}
                <div className="mt-5">
                    <h1 className="text-sm font-semibold">ACCOUNT</h1>
                    <ul className="mt-1">
                        {userRole === 'admin' || userRole === 'moderator' ? (
                            <>
                                {/* Dashboard Button */}
                                <li>
                                    <NavLink
                                        to="/dashboard"
                                        className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-md cursor-pointer"
                                        onClick={toggleDrawer}
                                    >
                                        <FaTachometerAlt className="w-5 h-5" />
                                        <span>Dashboard</span>
                                    </NavLink>
                                </li>
                                {/* Logout Button */}
                                <li>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleDrawer();
                                        }}
                                        className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-md cursor-pointer w-full text-left"
                                    >
                                        <FaSignOutAlt className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            /* Login Button (shown when not logged in as admin/moderator) */
                            <li>
                                <NavLink
                                    to="/login"
                                    className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-md cursor-pointer"
                                    onClick={toggleDrawer}
                                >
                                    <LuLogIn className="w-5 h-5" />
                                    <span>Admin</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
                {/* Social Links Section */}
                <div className='mt-5'>
                    <h1 className="text-sm font-semibold">FIND WITH ME</h1>
                    <div className='flex gap-2 items-center text-2xl mt-5'>
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
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MobMenu;