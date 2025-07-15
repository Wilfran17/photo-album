// Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value
    };

    try {
      const response = await axios.post('http://localhost:4000/login', formData);
      
      if (response.data.token) {
        setSuccess('Login successful! Redirecting to homepage...');
        setTimeout(() => {
          localStorage.setItem('token', response.data.token);
          navigate('/', { replace: true });
        }, 1500);
      } else {
        setError(response.data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-6 md:px-4 md:py-14 py-15 relative mb-0 md:h-[47rem] h-[46rem] md:w-[90rem] w-full md:items-center md:justify-center bg-gradient-to-br from-teal-500 to-blue-900 text-white p-8 shadow-lg border rounded-xl border-gray-800 overflow-hidden ">
      <img
        src="https://media.audleytravel.com/-/media/images/home/north-asia-and-russia/japan/activities/tokyo-gettyimages-1131743616-1000x3000.jpg?q=79&w=1920&h=685"
        alt=""
        className="absolute inset-0 object-cover mix-blend-overlay md:h-[47rem] h-[46rem] md:w-[90rem]"
      />

      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 p-4 rounded-lg mb-4">
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 border px-6 py-8 rounded-lg shadow-md bg-black/60 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-gray-300">
            <p>Don't have an account?{' '}
              <a href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                Register here
              </a>
            </p>
            <p className="mt-2">Forgot your password?{' '}
              <a href="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300">
                Reset it here
              </a>
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
