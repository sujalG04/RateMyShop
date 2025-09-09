import { useState, useEffect } from 'react';
import apiClient from '../../utils/api';

const StoreDashboard = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeRatings, setStoreRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMyStores();
      setStores(data);
      if (data.length > 0) {
        setSelectedStore(data[0]);
        fetchStoreRatings(data[0].id);
      }
    } catch (error) {
      setError('Failed to fetch your stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreRatings = async (storeId) => {
    try {
      setRatingsLoading(true);
      const data = await apiClient.getStoreRatings(storeId);
      setStoreRatings(data);
    } catch (error) {
      setError('Failed to fetch store ratings');
    } finally {
      setRatingsLoading(false);
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    fetchStoreRatings(store.id);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
      });
      alert('Password updated successfully!');
    } catch (error) {
      setError(error.message || 'Failed to update password');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your stores and view customer ratings</p>
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
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="New Password (8-16 chars, 1 uppercase, 1 special)"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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

      {stores.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
          <p className="text-gray-600">Contact an administrator to have stores assigned to your account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Your Stores</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                    className={`w-full px-6 py-4 text-left hover:bg-gray-50 ${
                      selectedStore?.id === store.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{store.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          {renderStars(Math.round(parseFloat(store.average_rating)))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {parseFloat(store.average_rating).toFixed(1)} ({store.total_ratings})
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Store Details and Ratings */}
          <div className="lg:col-span-2">
            {selectedStore && (
              <div className="space-y-6">
                {/* Store Info */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedStore.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{selectedStore.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Average Rating</p>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(Math.round(parseFloat(selectedStore.average_rating)))}
                        </div>
                        <span className="text-sm text-gray-900">
                          {parseFloat(selectedStore.average_rating).toFixed(1)} ({selectedStore.total_ratings} ratings)
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{selectedStore.address}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Ratings */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Customer Ratings</h3>
                  </div>
                  <div className="p-6">
                    {ratingsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : storeRatings.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No ratings yet</p>
                    ) : (
                      <div className="space-y-4">
                        {storeRatings.map((rating, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{rating.user_name}</p>
                                <p className="text-xs text-gray-500">{rating.user_email}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center">
                                  {renderStars(rating.rating)}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(rating.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;