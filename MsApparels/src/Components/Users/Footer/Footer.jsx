import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; 
import logo from "../../../assets/Images/logo.jpg"
import payment from "../../../assets/Images/payment.png"

const Footer = () => {
  return (
    <footer className="bg-[#1A2A44] text-white py-10 mt-5">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-lg font-bold mb-4">JOIN OUR NEWSLETTER</h2>
        <div className="flex justify-center items-center mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-amber-50 px-4 py-2 w-full max-w-xs rounded-l-md border-none focus:outline-none text-black"
          />
          <button className="bg-red-600 px-4 py-2 rounded-r-md hover:bg-red-700">
            Subscribe
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-8">
          To get the latest news from us please subscribe your email.
        </p>
      </div>

      {/* Links Section */}
      <div className="border-t border-gray-600 container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 pt-10">
        {/* Custom Links */}
        <nav>
          <h6 className="text-lg font-bold mb-4">CUSTOM LINKS</h6>
          <a className="block text-gray-400 hover:text-white mb-2">Delivery</a>
          <a className="block text-gray-400 hover:text-white mb-2">Legal Notice</a>
          <a className="block text-gray-400 hover:text-white mb-2">About us</a>
          <a className="block text-gray-400 hover:text-white mb-2">Secure payment</a>
          <a className="block text-gray-400 hover:text-white mb-2">Contact us</a>
          <a className="block text-gray-400 hover:text-white mb-2">Sitemap</a>
        </nav>

        {/* Products */}
        <nav>
          <h6 className="text-lg font-bold mb-4">PRODUCTS</h6>
          <a className="block text-gray-400 hover:text-white mb-2">Personal info</a>
          <a className="block text-gray-400 hover:text-white mb-2">Orders</a>
          <a className="block text-gray-400 hover:text-white mb-2">Credit slips</a>
          <a className="block text-gray-400 hover:text-white mb-2">Addresses</a>
          <a className="block text-gray-400 hover:text-white mb-2">Stores</a>
          <a className="block text-gray-400 hover:text-white mb-2">FAQ</a>
        </nav>

        {/* Our Company */}
        <nav>
          <h6 className="text-lg font-bold mb-4">OUR COMPANY</h6>
          <a className="block text-gray-400 hover:text-white mb-2">Delivery</a>
          <a className="block text-gray-400 hover:text-white mb-2">Legal Notice</a>
          <a className="block text-gray-400 hover:text-white mb-2">About us</a>
          <a className="block text-gray-400 hover:text-white mb-2">Secure payment</a>
          <a className="block text-gray-400 hover:text-white mb-2">Contact us</a>
          <a className="block text-gray-400 hover:text-white mb-2">Sitemap</a>
        </nav>

        {/* Your Account */}
        <nav>
          <h6 className="text-lg font-bold mb-4">YOUR ACCOUNT</h6>
          <a className="block text-gray-400 hover:text-white mb-2">Personal info</a>
          <a className="block text-gray-400 hover:text-white mb-2">Orders</a>
          <a className="block text-gray-400 hover:text-white mb-2">Credit slips</a>
          <a className="block text-gray-400 hover:text-white mb-2">Addresses</a>
          <a className="block text-gray-400 hover:text-white mb-2">Stores</a>
          <a className="block text-gray-400 hover:text-white mb-2">FAQ</a>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-4 border-t border-gray-600 pt-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Address */}
          <div className="flex items-center gap-4">
            <img
              src={logo} 
              alt="logo"
              className="w-24 h-auto"
            />
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" />
              <p className="text-gray-400">
                ADDRESS: Miami Lakes, FL, United States, Florida
              </p>
            </div>
          </div>

          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-400" />
              <p className="text-gray-400">EMAIL: Msapparels1117@gmail.com</p>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-400" />
              <p className="text-gray-400">PHONE: +1 (786) 763-7398</p>
            </div>
          </div>
        </div>

        {/* Payment Icons and Links */}
        <div className="border-t border-gray-600 flex flex-col md:flex-col justify-center items-center mt-5 gap-4 pt-10">
          <div className="flex gap-4">
            <img src={payment} alt="Visa" className="h-6" />
            
          </div>
          <div className="text-gray-400 text-sm text-center">
            <a className="hover:text-white mx-1">Delivery</a> ||
            <a className="hover:text-white mx-1">Legal Notice</a> ||
            <a className="hover:text-white mx-1">About us</a> ||
            <a className="hover:text-white mx-1">Secure payment</a> ||
            <a className="hover:text-white mx-1">Contact us</a> ||
            <a className="hover:text-white mx-1">Sitemap</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-4">
          Copyright © 99MsApparels ALL Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;