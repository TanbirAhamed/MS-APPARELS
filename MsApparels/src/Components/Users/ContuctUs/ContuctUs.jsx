import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast'; // Import React Hot Toast

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
        form.current,
        {
          publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS Public Key
        }
      )
      .then(
        () => {
          toast.success('Message sent successfully!', {
            duration: 4000,
            position: 'top-center',
          });
          form.current.reset(); // Reset the form after successful submission
        },
        (error) => {
          toast.error('Failed to send message. Please try again.', {
            duration: 4000,
            position: 'top-center',
          });
        }
      );
  };

  return (
    <div className="container mx-auto py-10 px-4 mt-20">
      {/* Add Toaster component to display toasts */}
      <Toaster />
      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Left Column: Text and Contact Details */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
            Let’s Collaborate
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            At Ms Apparels, we’re passionate about bringing you the best in high-performance sportswear. Whether you’re hitting the gym, running the track, or training hard, our gear is designed to move with you. We believe in the power of sport to transform lives, and we’re here to help you stay at the top of your game. Have questions or need assistance? Reach out to us – our team is ready to help you gear up for your next adventure.
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-black font-semibold text-sm sm:text-base">Phone:</p>
              <p className="text-gray-600 text-sm sm:text-base">+1 (786) 763-7398</p>
            </div>
            <div>
              <p className="text-black font-semibold text-sm sm:text-base">Email:</p>
              <p className="text-gray-600 text-sm sm:text-base">Msapparels1117@gmail.com</p>
            </div>
            <div>
              <p className="text-black font-semibold text-sm sm:text-base">Location:</p>
              <p className="text-gray-600 text-sm sm:text-base">
                Miami Lakes, FL, United States, Florida
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="flex-1 w-full">
          <div className="bg-slate-300/20 p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-black mb-4">
              Say hello
            </h2>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Name"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="user_email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="user_phone"
                  placeholder="Phone number"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md text-sm sm:text-base font-semibold hover:bg-gray-800 transition-colors"
              >
                Send Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;