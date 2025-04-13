import React from 'react';
import Banner from '../Banner/Banner';
import Products from '../Products/Products';
import h1 from '../../../assets/Images/h1.png';
import h2 from '../../../assets/Images/Whatspp (1).png';
import h3 from '../../../assets/Images/Whatspp (3).png';
import { FaShippingFast, FaShieldAlt, FaStar } from 'react-icons/fa'; 
import Review from '../Review/Review';
import { motion } from 'framer-motion'; 

const Home = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Browse Our Products',
      description: 'Explore our wide range of products to find what suits your needs.',
      image: h1,
    },
    {
      step: 'Step 2',
      title: 'Contact Us on WhatsApp',
      description: 'Reach out to us via WhatsApp for quick inquiries or assistance.',
      image: h2,
    },
    {
      step: 'Step 3',
      title: 'Place Your Order',
      description: 'Finalize your order and enjoy a seamless checkout process.',
      image: h3,
    },
  ];

  const whyChooseUs = [
    {
      icon: <FaShippingFast className="w-8 h-8 text-gray-600" />,
      title: 'FAST SHIPPING',
      description:
        'Get your products delivered quickly with our reliable and speedy shipping service. We ensure that your items are dispatched promptly to meet your expectations and arrive on time.',
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-white" />,
      title: 'WARRANTY PROTECTION',
      description:
        'Enjoy peace of mind with our comprehensive warranty protection. We cover your purchases with a guarantee to provide repair or replacements if necessary, ensuring long-term satisfaction.',
      isBlue: true,
    },
    {
      icon: <FaStar className="w-8 h-8 text-gray-600" />,
      title: 'PREMIUM MERERIALS',
      description:
        'Our products are made from high-quality materials designed for durability and comfort. We use only the finest fabrics and components to ensure top-notch performance and longevity.',
    },
  ];

  // Define Framer Motion variants (already defined for "WHY CHOOSE US")
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="mt-16">
      <Banner />
      <div className="text-center py-10">
        <h1 className="font-bold text-2xl md:text-3xl text-blue-900">
          "Steps to Complete Your Order"
        </h1>
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="flex flex-col items-center w-full max-w-xs"
            >
              <div className="text-blue-900 font-semibold mt-2">{step.step}</div>
              <div className="flex items-center justify-center border bg-white rounded-t-xl rounded-br-xl shadow-lg p-4 w-35 h-35">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="font-bold text-lg text-blue-900 mt-1">{step.title}</h2>
              <p className="text-gray-600 text-sm text-center mt-1">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center py-10">
        <h1 className="font-bold text-2xl md:text-3xl text-blue-900">
          "Featured collection"
        </h1>
        <p className="font-bold md:text-xl text-gray-600 text-sm">
          we have your accasion covered
        </p>
        <Products />
      </div>

      {/* "WHY CHOOSE US" Section */}
      <div className="text-center py-8 sm:py-10">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-blue-900">
          "WHY CHOOSE US"
        </h1>
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-black mt-2">
          Why Ms Apparels is The Right Choice for You ?
        </h1>
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-10 md:gap-10 mt-6 sm:mt-8 px-2 sm:px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`flex flex-col items-center w-full p-4 sm:p-6 rounded-3xl shadow-lg ${
                item.isBlue
                  ? 'bg-[#1A2A44] text-white max-w-[18rem] sm:max-w-[20rem] md:max-w-md translate-y-0 md:translate-y-5'
                  : 'bg-white text-black max-w-[16rem] sm:max-w-xs md:max-w-sm'
              }`}
            >
              <div className="mb-3 sm:mb-4">{item.icon}</div>
              <h2 className="font-bold text-base sm:text-lg mb-2">{item.title}</h2>
              <p className={`text-xs sm:text-sm text-center ${item.isBlue ? 'text-gray-200' : 'text-gray-600'}`}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* "What clients say about us" */}
      <div className="text-center py-8 sm:py-10">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-blue-900">
        "What clients say about us"
        </h1>
        <Review />
      </div>
    </div>
  );
};

export default Home;