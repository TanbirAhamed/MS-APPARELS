import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'; 
import img from '../../../assets/Images/Untitled.jpg';

const AboutUs = () => {
    const stats = [
        { value: '3.5', label: 'Years Experience' },
        { value: '23', label: 'Project Challenge' },
        { value: '200+', label: 'Positive Reviews' },
        { value: '10K', label: 'Trusted Client' },
    ];

    return (
        <div className="container mx-auto py-10 px-4 mt-20">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left Column: Text and Social Icons */}
                <div className="flex-1">
                    <h3 className="text-orange-500 font-semibold text-sm sm:text-base mb-2">
                        HOW IT STARTED
                    </h3>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
                        About Ms Apparels
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                        At Ms Apparels, we specialize in high-quality custom sportswear designed for performance, style, and durability. From soccer to baseball, basketball to cricket, we provide premium jerseys, shorts, polos, and team apparel tailored to your needs.
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                        With a focus on innovation and precision, we ensure every design meets professional standards, using sublimation printing and cut-and-sew production. Whether you’re a team, club, or organization, Ms Apparels is here to bring your vision to life.
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base font-semibold mb-6">
                        Gear up. Stand out. Play with pride.
                    </p>
                    {/* Social Media Icons */}
                    <div className="flex gap-4">
                        <a
                            href="https://www.facebook.com/people/MS-Apparels/61574932028343/?mibextid=wwXIfr&rdid=HJmDEJYIxyMkahQQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DW6Ss5i7A%2F%3Fmibextid%3DwwXIfr"
                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                        >
                            <FaFacebookF className="w-5 h-5 text-[#1877F2]" />
                        </a>
                        <a
                            href="https://www.instagram.com/accounts/login/?hl=en"
                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                        >
                            <FaInstagram className="w-5 h-5 text-[#E1306C]" />
                        </a>
                        <a
                            href="https://api.whatsapp.com/send/?phone=17867637398&text&type=phone_number&app_absent=0"
                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                        >
                            <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
                        </a>
                    </div>
                </div>
                {/* Right Column: Image and Statistics Cards */}
                <div className="flex-1 flex flex-col">
                    <div className="card bg-base-100 shadow-sm">
                        <img
                            src={img}
                            alt="img"
                            className='p-3'
                        />
                    </div>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
                            >
                                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                                    {stat.value}
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base text-center">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;