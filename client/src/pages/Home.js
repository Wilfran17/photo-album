import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CardGrid from '../components/CardGrid';

export default function Home() {
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

        const response = await axios.get('http://localhost:4000/verify-token', {
          headers: {
            'x-access-token': token,
          },
        });

        if (response.status === 200) {
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
  }, []);


    return (
      <main className="bg-black text-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-800 w-full max-w-full md:w-[80rem] h-auto md:h-[40rem] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-6 md:mb-2">
          <h1 className="text-3xl sm:text-4xl font-semibold">Save Yours Memories</h1>
    
          {loading && <p className="text-gray-500">Checking login status...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
    
          <div className="flex flex-col sm:flex-row md:mt-4 gap-4 justify-center items-center">
            {isLoggedIn ? (
              <>
                <p className="font-semibold text-center">View and add photos here!</p>
                <Link
                  to="/my-side"
                  className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white rounded-md"
                >
                  My Side
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-md hover:bg-blue-600 glow-button"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-900 to-purple-700 text-white rounded-md hover:bg-green-600 glow-button"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
    
        {/* Her setter du inn kortkomponenten */}
        <CardGrid />
      </main>
    );
}
