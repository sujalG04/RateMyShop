import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'System Administrator';
      case 'store_owner':
        return 'Store Owner';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left - Brand */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              RateMyShop
            </h1>
          </div>

          {/* Right - User + Logout */}
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-700 text-right">
                <span className="font-medium block sm:inline">{user.name}</span>
                <span className="ml-0 sm:ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] sm:text-xs inline-block mt-1 sm:mt-0">
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>


  );
};

export default Navbar;