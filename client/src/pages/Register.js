import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import passwordValidator from 'password-validator';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    const passwordSchema = new passwordValidator();
    passwordSchema
      .is().min(8)                                    // Minimum length 8
      .is().max(100)                                  // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(1)                                // Must have at least 1 digit
      .has().not().spaces()                           // Should not have spaces
      .is().not().oneOf(['Passw0rd', 'Password123', 'password123', '12345678']); // Blacklist common weak passwords

    const isValid = passwordSchema.validate(password);
    if (!isValid) {
      setPasswordError("Password must be 8-100 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.");
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    // Get current form data values
    const currentData = { ...formData };

    // Client-side validation
    if (!currentData.email || !currentData.email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    if (!currentData.password || !currentData.password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (!currentData.fullName || !currentData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!currentData.confirmPassword || !currentData.confirmPassword.trim()) {
      setError('Please confirm your password');
      return;
    }

    // Get trimmed values for validation
    const trimmedFullName = currentData.fullName.trim();
    const trimmedPassword = currentData.password.trim();

    if (trimmedFullName.length < 3) {
      setError('Full Name must be at least 3 characters long');
      return;
    }

    if (trimmedPassword !== currentData.confirmPassword.trim()) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(trimmedPassword)) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/register', {
        email: currentData.email.trim(),
        password: currentData.password.trim(),
        fullName: currentData.fullName.trim()
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setSuccess('Registration successful! You will be redirected to the homepage.');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else if (response.data.error) {
        setError(response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate password on change
    if (name === 'password') {
      validatePassword(value);
    }
  };

  return (
    <main className="flex flex-col gap-6 px-4 md:py6 py-11 md:w-full md:h-[52rem] relative   items-center justify-center bg-gradient-to-br from-amber-500 to-blue-900 text-white p-8 shadow-lg border border-gray-800 overflow-hidden">
      <img
        src="https://guidetolofoten.com/wp-content/uploads/2024/03/4.jpg"
        alt=""
        className="absolute inset-0 object-cover mix-blend-overlay md:w-full md:h-full w-full h-full md:rounded-lg rounded-lg shadow-lg"
      />

      {success && (
        <div className="bg-green-900/50 p-4 rounded-lg mb-4">
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {passwordError && (
        <div className="bg-red-900/50 p-4 rounded-lg mb-4">
          <p className="text-red-300 text-sm">{passwordError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 border px-6 py-8 rounded-lg shadow-md bg-black/60 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-4">Register</h1>
        <p className="text-center text-gray-300 mb-6">Please fill in the form below to create a new account.</p>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleFormChange}
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
            value={formData.password}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="text-center text-sm text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
            Login here
          </a>
        </div>
      </form>
    </main>
  );
}