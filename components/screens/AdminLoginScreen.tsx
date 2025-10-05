
import React, { useState } from 'react';
import { adminLogin } from '../../services/mockApi';
import { TicketIcon } from '../icons';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
}

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const { success } = await adminLogin(password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
                <TicketIcon className="h-10 w-10 text-brand-primary" />
                <h1 className="text-3xl font-bold text-gray-800">Lagos <span className="text-brand-primary">Ride</span></h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Admin Panel</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password-admin" className="sr-only">Password</label>
              <input
                id="password-admin"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
           {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign In'}
            </button>
          </div>
          <p className="text-center text-xs text-gray-500">Hint: use password `admin123`</p>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginScreen;
