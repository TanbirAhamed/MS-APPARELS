import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // For toggle icons

const Faq = () => {
    const faqs = [
        {
            question: 'How do I place an order?',
            answer:
                'You can browse our collection, select your preferred sportswear, customize it if needed, and place an order through our website.',
        },
        {
            question: 'Can I customize my jerseys and apparel?',
            answer:
                'Yes! We offer full customization, including team logos, player names, numbers, and colors.',
        },
        {
            question: 'Is there a minimum order quantity (MOQ)?',
            answer:
                'Our MOQ depends on the product type. Please check the product page or contact us for details.',
        },
        {
            question: 'Do you offer international shipping?',
            answer:
                'Yes, we ship worldwide. Shipping costs and delivery times vary based on location.',
        },
        {
            question: 'How long does it take to receive my order?',
            answer: 'Standard orders take 7-8 days for production and 2 days for delivery, depending on your location.',
        },
        {
            question: 'Can I return or exchange a customized product?',
            answer: 'Since customized items are made to order, we do not accept returns unless there is a defect or error on our part.',
        },
        {
            question: 'What if I receive a damaged or incorrect item?',
            answer: 'Please contact us within 2-3 days of receiving your order, and we will assist you in resolving the issue.',
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept credit/debit cards, PayPal, and other secure payment gateways.',
        },
        {
            question: 'Do you offer bulk order discounts?',
            answer: 'Yes! Contact us for special pricing on team and bulk orders.',
        },
        {
            question: 'Are there any ongoing promotions or discounts?',
            answer: 'Check our website or subscribe to our newsletter for the latest deals and offers.',
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto py-10 px-4 mt-20">
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center mb-8">
                Frequently Asked Questions
            </h1>

            {/* FAQ Items */}
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-gray-500/10 rounded-lg shadow-md overflow-hidden"
                    >
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer"
                            onClick={() => toggleFaq(index)}
                        >
                            <h2 className="text-base sm:text-lg font-semibold text-black">
                                {faq.question}
                            </h2>
                            <div className="transition-transform duration-300 ease-in-out">
                                {openIndex === index ? (
                                    <FaChevronUp className="w-5 h-5 text-gray-500 rotate-0" />
                                ) : (
                                    <FaChevronDown className="w-5 h-5 text-gray-500 rotate-0" />
                                )}
                            </div>
                        </div>
                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index
                                    ? 'max-h-40 opacity-100'
                                    : 'max-h-0 opacity-0'
                                }`}
                        >
                            {faq.answer && (
                                <div className="p-4 pt-0">
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faq;