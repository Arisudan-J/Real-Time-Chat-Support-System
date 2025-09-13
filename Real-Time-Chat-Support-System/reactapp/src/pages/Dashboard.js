import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI, agentAPI } from '../utils/api';
import FloatingChatButton from '../components/FloatingChatButton';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentStatus, setAgentStatus] = useState('OFFLINE');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
      return;
    }
    loadSessions();
    if (user?.role === 'AGENT') {
      setAgentStatus('AVAILABLE');
    }
  }, [user, navigate]);

  const loadSessions = async () => {
    try {
      const response = await chatAPI.getSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await chatAPI.createSession({ customerId: user.id });
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const updateAgentStatus = async (status) => {
    try {
      await agentAPI.updateStatus(status);
      setAgentStatus(status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      try {
        await chatAPI.deleteSession(sessionId);
        loadSessions();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ChatSupport</h1>
                <p className="text-sm text-gray-300">Welcome, {user?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'AGENT' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Status:</span>
                  <select
                    value={agentStatus}
                    onChange={(e) => updateAgentStatus(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="AVAILABLE" className="bg-gray-800">Available</option>
                    <option value="BUSY" className="bg-gray-800">Busy</option>
                    <option value="OFFLINE" className="bg-gray-800">Offline</option>
                  </select>
                </div>
              )}
              
              <button
                onClick={logout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Chat Sessions</h2>
                {user?.role === 'CUSTOMER' && (
                  <button
                    onClick={createNewChat}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>New Chat</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No chat sessions yet</p>
                  {user?.role === 'CUSTOMER' && (
                    <p className="text-gray-500 mt-2">Start a new conversation to get help</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div 
                          onClick={() => navigate(`/chat/${session.id}`)}
                          className="flex-1 cursor-pointer"
                        >
                          <h3 className="font-semibold text-white mb-1">
                            Session #{session.id}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Status: <span className={`font-medium ${
                              session.status === 'ACTIVE' ? 'text-green-400' : 
                              session.status === 'WAITING' ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                              {session.status}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                session.status === 'ACTIVE' ? 'bg-green-400' : 
                                session.status === 'WAITING' ? 'bg-yellow-400' : 'bg-gray-400'
                              }`}></div>
                              <span className="text-xs text-gray-400">
                                {session.status === 'ACTIVE' ? 'Active' : 
                                 session.status === 'WAITING' ? 'Waiting' : 'Closed'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Sessions</span>
                  <span className="text-white font-semibold">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Chats</span>
                  <span className="text-green-400 font-semibold">
                    {sessions.filter(s => s.status === 'ACTIVE').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Role</span>
                  <span className="text-blue-400 font-semibold capitalize">
                    {user?.role?.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                {user?.role === 'CUSTOMER' 
                  ? 'Start a new chat session to get instant support from our team.'
                  : 'Manage your availability status and respond to customer inquiries.'
                }
              </p>
              <div className="flex items-center text-blue-400 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn more
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Chat Button for Customers */}
      {user?.role === 'CUSTOMER' && (
        <FloatingChatButton onClick={createNewChat} />
      )}
    </div>
  );
};

export default Dashboard;