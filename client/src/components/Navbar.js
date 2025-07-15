import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Navbar() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        console.log('Verifying token:', token ? 'Token exists' : 'No token');
        const response = await axios.get('http://localhost:4000/verify-token', {
          headers: {
            'x-access-token': token,
          },
        });

        if (response.status === 200) {
          console.log('Token verification successful');
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        setError('Authentication failed. Please log in again.');
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

    // Add event listener for token changes
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        verifyUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 shadow-lg border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white text-2xl font-semibold hover:text-gray-300">Photo Album</Link>
          </div>
        <div className="flex items-center gap-6 text-lg font-semibold">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/my-side" className="text-gray-300 hover:text-white transition-colors">My Side</Link>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link>
                  <button
                    onClick={logout}
                className="px-4 py-2 text-white hover:text-red-500 "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>
    </nav>
  );
}
