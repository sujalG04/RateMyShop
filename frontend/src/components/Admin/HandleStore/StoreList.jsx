import { useState, useEffect } from "react";
import apiClient from "../../../utils/api";
import StoreFilters from "./StoreFilters";
import StoreTable from "./StoreTable";
import StoreFormModal from "./StoreFormModal";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    sort: "name",
    order: "asc",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  useEffect(() => {
    fetchStores();
    fetchStoreOwners();
  }, [filters]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStores(filters);
      setStores(data);
    } catch (error) {
      setError("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreOwners = async () => {
    try {
      const data = await apiClient.getUsers({ role: "store_owner" });
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch store owners");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSort = (field) => {
    setFilters({
      ...filters,
      sort: field,
      order: filters.sort === field && filters.order === "asc" ? "desc" : "asc",
    });
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await apiClient.createStore(newStore);
      setShowCreateForm(false);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      fetchStores();
    } catch (error) {
      setError(error.message || "Failed to create store");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <StoreFilters filters={filters} onChange={handleFilterChange} />

      {/* Create Store Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Stores</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add New Store
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Create Store Modal */}
      {showCreateForm && (
        <StoreFormModal
          users={users}
          newStore={newStore}
          setNewStore={setNewStore}
          onSubmit={handleCreateStore}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Stores Table */}
      <StoreTable
        stores={stores}
        filters={filters}
        onSort={handleSort}
        loading={loading}
      />
    </div>
  );
};

export default StoreList;
