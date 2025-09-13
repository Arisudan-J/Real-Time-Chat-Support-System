import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [agentForm, setAgentForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [usersRes, sessionsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/chat-sessions')
      ]);
      setUsers(usersRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    if (!userId || !users.length) return 'Unknown';
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  const viewChatMessages = async (sessionId) => {
    try {
      const response = await api.get(`/chat-messages/${sessionId}`);
      const messages = response.data || [];
      
      if (messages.length === 0) {
        alert(`No messages found for Session #${sessionId}`);
        return;
      }
      
      // Create a simple modal to show messages
      const messageList = messages.map(msg => {
        const senderName = getUserName(msg.senderId);
        const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Unknown time';
        return `${senderName}: ${msg.content || 'No content'} (${timestamp})`;
      }).join('\n\n');
      
      alert(`Chat Messages for Session #${sessionId}:\n\n${messageList}`);
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      alert('Failed to load chat messages. Please try again.');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        loadData();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const deleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      try {
        await api.delete(`/chat-sessions/${sessionId}`);
        loadData();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const createAgent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/create-agent', { ...agentForm, role: 'AGENT' });
      setAgentForm({ username: '', email: '', password: '' });
      setShowCreateAgent(false);
      loadData();
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-300">Manage users and chat sessions</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Management */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Users Management</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCreateAgent(true)}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg transition-colors"
                >
                  Create Agent
                </button>
                <button
                  onClick={loadData}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{user.username}</h3>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-red-500/20 text-red-300' :
                          user.role === 'AGENT' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'ONLINE' ? 'bg-green-500/20 text-green-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                    
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Sessions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Chat Sessions</h2>
            
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">Session #{session.id}</h3>
                      <p className="text-gray-300 text-sm">
                        Customer: {session.customerId ? getUserName(session.customerId) : 'N/A'}
                      </p>
                      <p className="text-gray-300 text-sm">
                        Agent: {session.agentId ? getUserName(session.agentId) : 'Unassigned'}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {session.createdAt ? new Date(session.createdAt).toLocaleString() : 'Unknown date'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewChatMessages(session.id)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded text-xs transition-colors"
                      >
                        View Chat
                      </button>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Delete
                      </button>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        session.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' :
                        session.status === 'WAITING' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-400">{users.length}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Customers</h3>
            <p className="text-3xl font-bold text-green-400">
              {users.filter(u => u.role === 'CUSTOMER').length}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Agents</h3>
            <p className="text-3xl font-bold text-purple-400">
              {users.filter(u => u.role === 'AGENT').length}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {sessions.filter(s => s.status === 'ACTIVE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Create New Agent</h3>
            <form onSubmit={createAgent} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={agentForm.username}
                onChange={(e) => setAgentForm({...agentForm, username: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={agentForm.email}
                onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={agentForm.password}
                onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 rounded-lg transition-colors"
                >
                  Create Agent
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateAgent(false)}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;