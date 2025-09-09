import React, { useState } from "react";

const UserForm = ({ onClose, onSubmit }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [mistake, setMistake] = useState("");

  const validateForm = () => {
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      setMistake("Name must be between 20 and 60 characters");
      return false;
    }
    if (newUser.address.length > 400) {
      setMistake("Address must not exceed 400 characters");
      return false;
    }
    if (newUser.password.length < 8 || newUser.password.length > 16) {
      setMistake("Password must be between 8 and 16 characters");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(newUser.password)) {
      setMistake("Password must contain at least 1 uppercase letter");
      return false;
    }
    if (!/(?=.*[!@#$%^&*(),.?\":{}|<>])/.test(newUser.password)) {
      setMistake("Password must contain at least 1 special character");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
    setMistake("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(newUser);
    setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Create New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mistake && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-2 rounded-md">
              {mistake}
            </div>
          )}
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleChange}
            placeholder="Full Name (20-60 chars)"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            placeholder="Password (8-16 chars, 1 uppercase, 1 special)"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <textarea
            name="address"
            value={newUser.address}
            onChange={handleChange}
            placeholder="Address (max 400 chars)"
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
