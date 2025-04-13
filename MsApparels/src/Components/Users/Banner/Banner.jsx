import React from 'react';
import banner from '../../../assets/Images/Banner.jpeg';
import { motion } from 'framer-motion'; // Import Framer Motion

const Banner = () => {
  // Function to handle the "Order Now" button click
  const handleOrderNow = () => {
    // Construct the WhatsApp URL
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=17867637398&text&type=phone_number&app_absent=0`;
    // Redirect to the WhatsApp URL
    window.open(whatsappUrl, '_blank');
  };

  // Define Framer Motion variants for the container
  const containerVariants = {
    hidden: { x: -100, opacity: 0 }, // Start off-screen to the left (x: -100) and invisible
    visible: {
      x: 0, 
      opacity: 1, 
      transition: {
        duration: .5, 
        ease: 'easeOut', 
      },
    },
  };

  return (
    <div
      className="relative w-full h-[80vh] overflow-hidden"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: '',
      }}
    >
      <div className="absolute bottom-0 left-0 p-6 text-neutral-content">
        <motion.div
          className="md:px-15 px-10 10 mb-10 font-semibold"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="md:mb-4 mb-1 text-5xl sm:text-4xl md:text-8xl font-bold">
            Sale
          </h1>
          <p className="mb-1 text-xl sm:text-base md:text-5xl">Ms Apparels:</p>
          <p className="mb-4 text-xl sm:text-base md:text-5xl">Where Champions Unite</p>
          <button onClick={() => handleOrderNow()} className="btn btn-primary btn-sm sm:btn-lg">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;