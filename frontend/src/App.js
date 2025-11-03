import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setActiveTab('users');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  // Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
      setActiveTab('categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

  // Fetch Requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      setRequests(response.data);
      setActiveTab('requests');
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏢 GOEM Portal - Database Viewer</h1>
        
        <div className="button-section">
          <button onClick={fetchUsers} disabled={loading}>
            {loading && activeTab === 'users' ? 'Loading...' : 'Fetch Users'}
          </button>
          <button onClick={fetchCategories} disabled={loading}>
            {loading && activeTab === 'categories' ? 'Loading...' : 'Fetch Categories'}
          </button>
          <button onClick={fetchRequests} disabled={loading}>
            {loading && activeTab === 'requests' ? 'Loading...' : 'Fetch Requests'}
          </button>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && users.length > 0 && (
          <div className="data-section">
            <h2>👥 Users ({users.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Module</th>
                  <th>GOEM Name</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.requester_name}</td>
                    <td>{user.email}</td>
                    <td>{user.category}</td>
                    <td>{user.module || 'N/A'}</td>
                    <td>{user.goem_name || 'N/A'}</td>
                    <td>{user.active ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Categories Table */}
        {activeTab === 'categories' && categories.length > 0 && (
          <div className="data-section">
            <h2>📁 Categories ({categories.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Module</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>{cat.module}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Requests Table */}
        {activeTab === 'requests' && requests.length > 0 && (
          <div className="data-section">
            <h2>📋 Recent Requests ({requests.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Request No</th>
                  <th>Raised By</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>GOEM</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.request_id}>
                    <td>{req.request_no}</td>
                    <td>{req.request_raise_by}</td>
                    <td>{req.request_raise_name}</td>
                    <td><span className={`status ${req.request_status.toLowerCase()}`}>{req.request_status}</span></td>
                    <td>{req.category}</td>
                    <td>{req.short_description}</td>
                    <td>{req.goem_name || 'N/A'}</td>
                    <td>{new Date(req.request_raise_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
