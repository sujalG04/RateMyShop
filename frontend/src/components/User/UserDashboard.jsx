import { useState, useEffect } from 'react';
import apiClient from '../../utils/api';
import StoreRating from './StoreRating';
import { FiEye, FiEyeOff } from "react-icons/fi"; 
const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // added 
  const [updatePassworderror , SetUpdatePasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // useEffect(() => {
  //   const userData = localStorage.getItem('user');
  // console.log("user :  " ,userData);
    
  // }, [])
  


  const [searchFilters, setSearchFilters] = useState({
    name: '',
    address: '',
    sort: 'name',
    order: 'asc',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentEmail: '',
    newPassword: '',
  });

  useEffect(() => {
    fetchStores();
  }, [searchFilters]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStores(searchFilters);
      setStores(data);
    } catch (error) {
      setError('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSort = (field) => {
    setSearchFilters({
      ...searchFilters,
      sort: field,
      order: searchFilters.sort === field && searchFilters.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.updatePassword(passwordData.currentEmail, passwordData.newPassword);
      setShowPasswordForm(false);
      setPasswordData({
        currentEmail: '',
        newPassword: '',
      });
      SetUpdatePasswordError('');
      alert('Password updated successfully!');
    } catch (error) {
      SetUpdatePasswordError(error.message || 'Failed to update password');
    }
  };

  const handleRatingUpdate = () => {
    fetchStores(); // Refresh stores to show updated ratings
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Directory</h1>
            <p className="text-gray-600 mt-2">Browse and rate stores</p>
          </div>
          <button
            onClick={() => setShowPasswordForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Update Password
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

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

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Search Stores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Search by store name"
            value={searchFilters.name}
            onChange={handleSearchChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Search by address"
            value={searchFilters.address}
            onChange={handleSearchChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-3 bg-gray-50 flex items-center space-x-4">
              <button
                onClick={() => handleSort('name')}
                className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
              >
                Name {searchFilters.sort === 'name' && (searchFilters.order === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('address')}
                className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
              >
                Address {searchFilters.sort === 'address' && (searchFilters.order === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('average_rating')}
                className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
              >
                Rating {searchFilters.sort === 'average_rating' && (searchFilters.order === 'asc' ? '↑' : '↓')}
              </button>
            </div>
            {stores.map((store) => (
              <div key={store.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex mr-2">
                        {renderStars(parseFloat(store.average_rating))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({parseFloat(store.average_rating).toFixed(1)}) • {store.total_ratings} ratings
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <StoreRating
                      storeId={store.id}
                      currentRating={store.user_rating}
                      onRatingUpdate={handleRatingUpdate}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;