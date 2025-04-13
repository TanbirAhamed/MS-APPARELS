import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from '../../Firebase/firebase.config';
import { useAuth } from '../../../AuthContext';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { setUserRole } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await fetch(`http://localhost:5000/api/user/role?uid=${user.uid}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("You Don't Have Access");
      }

      const data = await response.json();
      const role = data.role;

      setUserRole(role);

      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-white p-6 lg:p-12">
        <div className="w-full max-w-md bg-white shadow-2xl mt-10 rounded-2xl p-6">
          <h1 className="text-4xl text-center font-bold text-black mb-6">Sign in</h1>
          <p className="text-center text-gray-500 mb-6">or use your account</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-200 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="email"
                required
                ref={emailRef}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full p-3 text-black bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <div className="text-right">
              <a href="#" className="text-sm text-black hover:underline">
                Forget your password?
              </a>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-orange-500 text-black font-semibold rounded-full transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
              }`}
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;