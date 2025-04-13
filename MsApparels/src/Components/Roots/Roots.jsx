import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Home from '../Users/Home/Home';
import ContactUs from '../Users/ContuctUs/ContuctUs';
import Footer from '../Users/Footer/Footer';
import AboutUs from '../Users/AboutUs/AboutUs';
import Faq from '../Users/Faq/Faq';
import Login from '../Admin/Page/login';
import AdminRoutes from './AdminRoutes';
import { AuthProvider } from '../../AuthContext';


// Wrapper component for user routes to include Navbar and Footer
const UserRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/About" element={<AboutUs />} />
        <Route path="/FAQ" element={<Faq />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
};

const Root = () => {
  return (
    <AuthProvider>
      <Router className="scroll-smooth">
        <Routes>
          {/* User-facing routes with Navbar and Footer */}
          <Route path="/*" element={<UserRoutes />} />
          {/* Admin routes without Navbar and Footer */}
          <Route path="/dashboard/*" element={<AdminRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default Root;