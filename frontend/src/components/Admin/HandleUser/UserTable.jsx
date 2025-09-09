const UserTable = ({ users,stores , filters, loading, onSort }) => {

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "store_owner":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStoreForOwner = (email) => {
     if (!stores.length) return null; // stores not loaded yet
   return stores.find((store) =>{ 
    //console.log("store email ",store.email)
    return store.email === email});
    
    
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 👇 define readable column labels
  const columns = [
    { field: "name", label: "Name" },
    { field: "email", label: "Email" },
    { field: "role", label: "Role" },
    { field: "created_at", label: "Created At" },
  ];

  return (
    <div className="w-full">
      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(({ field, label }) => (
                <th
                  key={field}
                  onClick={() => onSort(field)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {label}{" "}
                  {filters.sort === field &&
                    (filters.order === "asc" ? "↑" : "↓")}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) =>{ 
            
          const store = user.role === "store_owner" ? getStoreForOwner(user.email) : null;
             //console.log("userRole",user.role , user.email);
            // console.log("userstore" , store);
              return(
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name}{store && (
                      <span className="text-yellow-500 text-xs px-2">
                        ⭐ {parseFloat(store.average_rating)?.toFixed(1) || "N/A"}
                      </span>
                    )}

                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {user.address}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="sm:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">{user.name}</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                  user.role
                )}`}
              >
                {user.role.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500 truncate">{user.address}</p>
            <p className="text-xs text-gray-400">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
``

