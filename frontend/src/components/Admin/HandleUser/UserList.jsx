import { useState, useEffect } from "react";
import apiClient from "../../../utils/api";
import UserFilters from "./UserFilters";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getUsers(filters);
      setUsers(data);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };


  // new add
   const fetchStores = async () => {
    try {
      const data = await apiClient.getStores();
      setStores(data);
    } catch {
      console.error("Failed to fetch stores");
    }
  };


  // end add

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSort = (field) =>
    setFilters({
      ...filters,
      sort: field,
      order: filters.sort === field && filters.order === "asc" ? "desc" : "asc",
    });

  const handleCreateUser = async (newUser) => {
    try {
      await apiClient.createUser(newUser);
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      setError(error.message || "Failed to create user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <UserFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Create User Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Users</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateForm && (
        <UserForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <UserTable
          users={users}
          stores={stores}
          filters={filters}
          loading={loading}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default UserList;
