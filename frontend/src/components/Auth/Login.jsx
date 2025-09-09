import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/api';
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import { Button } from '@mui/material';
const Login = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

   // added 
   const [updatePassworderror , SetUpdatePasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);  
 const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentEmail: '',
    newPassword: '',
  });
 const handlePasswordUpdate = async (e) => {
     e.preventDefault();
     try {
       await apiClient.resetPassword(passwordData.currentEmail, passwordData.newPassword);
       setShowPasswordForm(false);
       setPasswordData({
         currentEmail: '',
         newPassword: '',
       });
       SetUpdatePasswordError('');
       alert('Password updated successfully!');
     } catch (error) {
      window.location.reload();
       SetUpdatePasswordError(error.message || 'Failed to update password');
     }
   };
// end

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Card */}
      <div className="relative max-w-md w-full backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl p-8 space-y-8 animate-fade-in">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
            Welcome Back 👋
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <button
              onClick={onToggleMode}
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // toggle type
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm transition-all pr-10" // extra padding for icon
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
             
            </div>
   
            {/* added */}
            
             {/* 👇 Forgot password button */}
              <div className="mt-2 text-right">
                <Button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </Button>
              </div>
           {/* end */}
       </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
          
           {/* added */}
            {/* Password Update Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Password</h3>
            {/* added */}
            {updatePassworderror && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {updatePassworderror}
        </div>
      )}
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type='email'
                placeholder="Current Email"
                value={passwordData.currentEmail}
                onChange={(e) => setPasswordData({ ...passwordData, currentEmail: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className='relative'>
              <input
                type={showPassword ? "text" : "password"} // toggle type
                placeholder="New Password (8-16 chars, 1 uppercase, 1 special)"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
         {/* end */}



      </div>
    </div>
  );
};

export default Login;
