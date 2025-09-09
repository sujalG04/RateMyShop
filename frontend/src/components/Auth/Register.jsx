import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEyeOff } from "react-icons/fi"; 
const Register = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return false;
    }
    
    if (formData.address.length > 400) {
      setError('Address must not exceed 400 characters');
      return false;
    }
    
    if (formData.password.length < 8 || formData.password.length > 16) {
      setError('Password must be between 8 and 16 characters');
      return false;
    }
    
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError('Password must contain at least 1 uppercase letter');
      return false;
    }
    
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      setError('Password must contain at least 1 special character');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await register(formData);
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-md w-full space-y-8">
    //     <div>
    //       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
    //         Create your account
    //       </h2>
    //       <p className="mt-2 text-center text-sm text-gray-600">
    //         Or{' '}
    //         <button
    //           onClick={onToggleMode}
    //           className="font-medium text-blue-600 hover:text-blue-500"
    //         >
    //           sign in to existing account
    //         </button>
    //       </p>
    //     </div>
    //     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    //       {error && (
    //         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
    //           {error}
    //         </div>
    //       )}
          
    //       <div className="space-y-4">
    //         <div>
    //           <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    //             Full Name (20-60 characters)
    //           </label>
    //           <input
    //             id="name"
    //             name="name"
    //             type="text"
    //             required
    //             value={formData.name}
    //             onChange={handleChange}
    //             className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
    //             placeholder="Enter your full name"
    //           />
    //           <p className="text-xs text-gray-500 mt-1">
    //             {formData.name.length}/60 characters
    //           </p>
    //         </div>
            
    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    //             Email address
    //           </label>
    //           <input
    //             id="email"
    //             name="email"
    //             type="email"
    //             required
    //             value={formData.email}
    //             onChange={handleChange}
    //             className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
    //             placeholder="Enter your email"
    //           />
    //         </div>
            
    //         <div>
    //           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    //             Password (8-16 chars, 1 uppercase, 1 special char)
    //           </label>
    //           <input
    //             id="password"
    //             name="password"
    //             type="password"
    //             required
    //             value={formData.password}
    //             onChange={handleChange}
    //             className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
    //             placeholder="Enter your password"
    //           />
    //         </div>
            
    //         <div>
    //           <label htmlFor="address" className="block text-sm font-medium text-gray-700">
    //             Address (max 400 characters)
    //           </label>
    //           <textarea
    //             id="address"
    //             name="address"
    //             rows={3}
    //             value={formData.address}
    //             onChange={handleChange}
    //             className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
    //             placeholder="Enter your address"
    //           />
    //           <p className="text-xs text-gray-500 mt-1">
    //             {formData.address.length}/400 characters
    //           </p>
    //         </div>
    //       </div>

    //       <div>
    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    //         >
    //           {loading ? 'Creating account...' : 'Create account'}
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>

     
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
  <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
    <div className="text-center">
      <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
        Create your account
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Or{" "}
        <button
          onClick={onToggleMode}
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
        >
          sign in to existing account
        </button>
      </p>
    </div>

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm shadow-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name (20-60 characters)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your full name"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.name.length}/60 characters
          </p>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password (8-16 chars, 1 uppercase, 1 special char)
          </label>

          {/* added start  */}
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
              {/* added end */}

        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address (max 400 characters)
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your address"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.address.length}/400 characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>
    </form>
  </div>
</div>



  );
};

export default Register;