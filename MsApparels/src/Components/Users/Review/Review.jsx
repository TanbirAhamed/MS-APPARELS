import React from 'react';
import { FaStar, FaWhatsapp } from 'react-icons/fa';

const Review = () => {
  const reviews = [
    {
      rating: 5,
      date: '2023-03-10',
      comment:
        'This product exceeded my expectations. The quality is exceptional, and the customer service was incredibly helpful. Highly recommend!',
      name: 'Michal',
      initials: 'MI',
      location: 'Los Angeles, CA',
    },
    {
      rating: 5,
      date: '2023-02-20',
      comment:
        'I am very happy with my purchase! The delivery was quick, and the product works exactly as described. Definitely worth the price.',
      name: 'Sarah K.',
      initials: 'SK',
      location: 'New York, NY',
    },
    {
      rating: 5,
      date: '2023-01-15',
      comment:
        'Amazing experience! The product is high-quality and durable. I will definitely be buying again. Customer support is also fantastic.',
      name: 'Daniel R.',
      initials: 'DR',
      location: 'Chicago, IL',
    },
    {
      rating: 5,
      date: '2023-03-05',
      comment:
        'The product is great! It’s everything I expected, and I love the customer service. Would recommend it to all my friends.',
      name: 'Emily W.',
      initials: 'EW',
      location: 'San Francisco, CA',
    },
  ];

  return (
    <div className="relative container mx-auto py-10 px-4">
      {/* Review Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`flex flex-col p-6 bg-white rounded-2xl shadow-lg w-full ${
              index === 3 ? 'md:col-start-2 md:col-span-1' : '' // Position the 4th card in the middle of the bottom row
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">Verified Purchase</span>
              <span className="text-gray-500 text-sm">{review.date}</span>
            </div>
            <div className="flex mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 text-sm mb-4 text-start">{review.comment}</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-semibold">{review.initials}</span>
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{review.name}</p>
                <p className="text-gray-500 text-sm">{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Icon */}
      <div className="fixed bottom-6 right-6 z-10">
        <a
          href="https://api.whatsapp.com/send/?phone=17867637398&text=Hello,%20I%20have%20a%20question!&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <FaWhatsapp className="w-6 h-6 text-white" />
        </a>
      </div>
    </div>
  );
};

export default Review;