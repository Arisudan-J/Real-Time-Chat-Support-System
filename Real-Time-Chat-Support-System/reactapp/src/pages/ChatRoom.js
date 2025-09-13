import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../utils/api';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatRoom = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    loadMessages();
    connectWebSocket();
    return () => {
      if (stompClient.current && connected) {
        stompClient.current.disconnect();
      }
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getMessages(sessionId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const connectWebSocket = () => {
    try {
      const socket = new SockJS('http://localhost:8080/ws');
      stompClient.current = Stomp.over(socket);
      
      // Disable debug logging
      stompClient.current.debug = () => {};
      
      stompClient.current.connect({}, 
        () => {
          console.log('WebSocket connected');
          setConnected(true);
          
          // Subscribe to messages
          stompClient.current.subscribe(`/topic/chat/${sessionId}`, (message) => {
            try {
              const chatMessage = JSON.parse(message.body);
              console.log('Received message via WebSocket:', chatMessage);
              setMessages(prev => {
                // Avoid duplicates
                const exists = prev.find(m => m.id === chatMessage.id);
                if (!exists) {
                  return [...prev, chatMessage];
                }
                return prev;
              });
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
          
          // Subscribe to typing indicators
          stompClient.current.subscribe(`/topic/typing/${sessionId}`, (message) => {
            try {
              const typingData = JSON.parse(message.body);
              if (typingData.userId !== user.id) {
                setOtherUserTyping(typingData.typing);
              }
            } catch (error) {
              console.error('Error parsing typing data:', error);
            }
          });
        },
        (error) => {
          console.error('WebSocket connection error:', error);
          setConnected(false);
        }
      );
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnected(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sessionId: parseInt(sessionId),
      senderId: user.id,
      content: newMessage,
      messageType: 'TEXT'
    };

    try {
      // Send via REST API only - WebSocket will broadcast the saved message
      await chatAPI.sendMessage(messageData);
      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = () => {
    if (!typing && stompClient.current && stompClient.current.connected) {
      setTyping(true);
      try {
        stompClient.current.send(`/app/typing/${sessionId}`, {}, JSON.stringify({
          userId: user.id,
          typing: true
        }));
      } catch (error) {
        console.warn('Failed to send typing indicator:', error);
      }
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (typing) {
      setTyping(false);
      if (stompClient.current && stompClient.current.connected) {
        try {
          stompClient.current.send(`/app/typing/${sessionId}`, {}, JSON.stringify({
            userId: user.id,
            typing: false
          }));
        } catch (error) {
          console.warn('Failed to send typing indicator:', error);
        }
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Chat Session #{sessionId}</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-gray-300">
                  {connected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
                </span>
                {!connected && (
                  <button 
                    onClick={connectWebSocket}
                    className="text-xs bg-blue-500 px-2 py-1 rounded text-white hover:bg-blue-600"
                  >
                    Reconnect
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm text-gray-300">{user?.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-400 text-lg">No messages yet</p>
              <p className="text-gray-500 mt-2">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === user.id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  user={user}
                />
              );
            })}
            
            {otherUserTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white/10 backdrop-blur-lg border-t border-white/20 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-12"
              disabled={!connected}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !connected}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;