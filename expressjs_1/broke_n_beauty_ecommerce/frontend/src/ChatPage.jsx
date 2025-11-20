import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import Navbar from './components/Navbar';

const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

export default function ChatPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // State management
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [connectionError, setConnectionError] = useState(null);
  
  // Refs
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Available rooms
  const ROOMS = [
    { value: 'general', label: '💬 General Chat' },
    { value: 'support', label: '🎧 Support' }
  ];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // WebSocket connection
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setConnectionError('No authentication token found. Please log in again.');
      return;
    }

    const connectWebSocket = () => {
      const wsUrl = `${WS_BASE}/chat/ws/${selectedRoom}?token=${encodeURIComponent(token)}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        
        // Add system message
        setMessages(prev => [...prev, {
          type: 'system',
          content: '✅ Connected to chat!',
          timestamp: new Date().toISOString()
        }]);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data);

        switch(data.type) {
          case 'message':
            setMessages(prev => [...prev, {
              type: 'message',
              id: data.data.id,
              username: data.data.username,
              content: data.data.message,
              timestamp: data.data.created_at,
              userId: data.data.user_id
            }]);
            break;
          
          case 'user_joined':
            setMessages(prev => [...prev, {
              type: 'system',
              content: `${data.data.username} joined the chat`,
              timestamp: data.data.timestamp
            }]);
            break;
          
          case 'user_left':
            setMessages(prev => [...prev, {
              type: 'system',
              content: `${data.data.username} left the chat`,
              timestamp: data.data.timestamp
            }]);
            break;
          
          case 'typing':
            setTypingUsers(prev => {
              const updated = new Set(prev);
              if (data.data.is_typing) {
                updated.add(data.data.username);
              } else {
                updated.delete(data.data.username);
              }
              return updated;
            });
            break;
          
          case 'delete':
            // Remove deleted message from UI
            setMessages(prev => prev.filter(msg => msg.id !== data.data.message_id));
            // Add system message about deletion
            setMessages(prev => [...prev, {
              type: 'system',
              content: `Message deleted by ${data.data.deleted_by}`,
              timestamp: data.data.timestamp
            }]);
            break;
          
          case 'error':
            setMessages(prev => [...prev, {
              type: 'error',
              content: data.data.message,
              timestamp: new Date().toISOString()
            }]);
            break;
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error occurred');
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        
        if (event.code === 1008) {
          setConnectionError(event.reason || 'Authentication failed');
        } else {
          setMessages(prev => [...prev, {
            type: 'system',
            content: 'Disconnected from chat',
            timestamp: new Date().toISOString()
          }]);
        }
      };
    };

    connectWebSocket();

    // Cleanup on unmount or room change
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, selectedRoom, navigate]);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/history?room=${selectedRoom}&limit=50`);
        if (res.ok) {
          const history = await res.json();
          setMessages(history.map(msg => ({
            type: 'message',
            id: msg.id,
            username: msg.username,
            content: msg.message,
            timestamp: msg.created_at,
            userId: msg.user_id
          })));
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, [selectedRoom]);

  // Send message
  const sendMessage = () => {
    const trimmedMessage = messageInput.trim();
    
    if (!trimmedMessage) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Not connected to chat');
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'message',
      content: trimmedMessage
    }));

    setMessageInput('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    wsRef.current.send(JSON.stringify({
      type: 'typing',
      is_typing: false
    }));
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Send typing indicator
    wsRef.current.send(JSON.stringify({
      type: 'typing',
      is_typing: true
    }));

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'typing',
          is_typing: false
        }));
      }
    }, 2000);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Delete message (admin only)
  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.detail || 'Failed to delete message');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete message');
    }
  };

  // Check if user is admin
  const isAdmin = user && user.role === 'superuser';

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Live Chat</CardTitle>
                <CardDescription>
                  Chat with other users in real-time
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Room Selector */}
            <div className="mb-4 flex gap-2">
              {ROOMS.map(room => (
                <Button
                  key={room.value}
                  variant={selectedRoom === room.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (selectedRoom !== room.value) {
                      setMessages([]);
                      setSelectedRoom(room.value);
                    }
                  }}
                  disabled={!isConnected && selectedRoom === room.value}
                >
                  {room.label}
                </Button>
              ))}
            </div>

            {/* Connection Error */}
            {connectionError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                ⚠️ {connectionError}
              </div>
            )}

            {/* Messages Area */}
            <div className="bg-muted/30 rounded-lg p-4 h-[500px] overflow-y-auto mb-4 space-y-3">
              {messages.map((msg, index) => (
                <div key={msg.id || index}>
                  {msg.type === 'system' || msg.type === 'error' ? (
                    <div className={`text-center text-sm italic ${
                      msg.type === 'error' ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'} group`}>
                      <div className={`max-w-[70%] rounded-lg p-3 relative ${
                        msg.userId === user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {msg.username}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${
                              msg.userId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  if (confirm('Delete this message?')) {
                                    deleteMessage(msg.id);
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                                title="Delete message (Admin only)"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm break-words">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUsers.size > 0 && (
              <div className="text-sm text-muted-foreground italic mb-2 px-2">
                {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
              </div>
            )}

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
                maxLength={500}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!isConnected || !messageInput.trim()}
              >
                Send
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 px-2">
              {messageInput.length}/500 characters
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}