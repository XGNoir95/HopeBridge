import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      messageId: 1,
      text: "Hello! I'm HopeBridge Bot, here to help you navigate our disaster management system. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  // Close chatbot when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load chat history when component mounts or user changes
  useEffect(() => {
    if (isOpen) {
      const userId = localStorage.getItem('user_id');
      
      // Check if user has changed
      if (userId !== currentUserId) {
        // Reset messages to default when user changes
        setMessages([
          {
            messageId: 1,
            text: "Hello! I'm HopeBridge Bot, here to help you navigate our disaster management system. How can I assist you today?",
            isBot: true,
            timestamp: new Date()
          }
        ]);
        
        setCurrentUserId(userId);
      }
      
      loadChatHistory();
    }
  }, [isOpen, currentUserId]);

  // Listen for auth changes (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      const userId = localStorage.getItem('user_id');
      
      // If user changed, reset chat
      if (userId !== currentUserId) {
        setMessages([
          {
            messageId: 1,
            text: "Hello! I'm HopeBridge Bot, here to help you navigate our disaster management system. How can I assist you today?",
            isBot: true,
            timestamp: new Date()
          }
        ]);
        setCurrentUserId(userId);
        
        // If chat is open, load new user's history
        if (isOpen) {
          loadChatHistory();
        }
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [currentUserId, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      if (!token || !userId || userId === 'null' || userId === null) {
        return;
      }

      const response = await fetch('http://localhost:8000/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.messages && data.messages.length > 0) {
          const chatHistory = data.messages.slice(-10).map(msg => ([
            {
              messageId: `${msg.messageId}_user`,
              text: msg.message,
              isBot: false,
              timestamp: new Date(msg.created_at)
            },
            {
              messageId: `${msg.messageId}_bot`,
              text: msg.response,
              isBot: true,
              timestamp: new Date(msg.created_at)
            }
          ])).flat();

          // Replace messages instead of appending to avoid duplicates
          setMessages(prev => [
            {
              messageId: 1,
              text: "Hello! I'm HopeBridge Bot, here to help you navigate our disaster management system. How can I assist you today?",
              isBot: true,
              timestamp: new Date()
            },
            ...chatHistory
          ]);
        }
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) {
      return;
    }

    const userMessage = {
      messageId: `temp_${Date.now()}`,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      const requestPayload = {
        message: currentMessage
      };

      if (token && userId && userId !== 'null' && userId !== null) {
        requestPayload.user_id = userId;
      }

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'X-User-ID': (token && userId && userId !== 'null' && userId !== null) ? userId : '',
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const botMessage = {
          messageId: `${data.data.messageId}_bot`,
          text: data.bot_response.text,
          isBot: true,
          timestamp: new Date(),
          link: data.bot_response.link,
          linkText: data.bot_response.linkText
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      const errorMessage = {
        messageId: `error_${Date.now()}`,
        text: `I'm having trouble connecting. Please try again.`,
        isBot: true,
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLinkClick = (link) => {
    window.location.href = link;
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#311B08] hover:bg-amber-800 text-amber-500 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group"
          >
            <MessageCircle size={28} />
            <div className="absolute -top-2 -right-2 bg-amber-500 text-[#311B08] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
              ?
            </div>
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(false)}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[480px] h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-gray-300 z-[9998] flex flex-col overflow-hidden transition-all duration-300">
          {/* Chat Header */}
          <div className="bg-[#311B08] text-amber-500 p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-full relative">
              <Bot size={20} className="text-[#311B08]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg">HopeBridge Bot</h3>
              <p className="text-amber-300 text-sm">Always here to help</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.messageId}
                className={`flex items-start gap-3 ${
                  message.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.isBot && (
                  <div className="p-2 bg-[#311B08] rounded-full flex-shrink-0 shadow-sm">
                    <Bot size={16} className="text-amber-500" />
                  </div>
                )}

                <div className={`max-w-[75%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      message.isBot
                        ? message.isError
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-white text-gray-800 border-2 border-gray-200'
                        : 'bg-[#311B08] text-amber-500 border-2 border-amber-500'
                    }`}
                  >
                    <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                    
                    {/* Link Button */}
                    {message.link && message.linkText && (
                      <button
                        onClick={() => handleLinkClick(message.link)}
                        className="mt-3 bg-amber-500 text-[#311B08] px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors duration-200 shadow-sm"
                      >
                        {message.linkText} →
                      </button>
                    )}
                  </div>
                  
                  <p className={`text-xs text-gray-500 mt-1 font-medium ${
                    message.isBot ? 'text-left' : 'text-right'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {!message.isBot && (
                  <div className="p-2 bg-amber-500 rounded-full flex-shrink-0 order-2 shadow-sm">
                    <User size={16} className="text-[#311B08]" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#311B08] rounded-full shadow-sm">
                  <Bot size={16} className="text-amber-500" />
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-[#311B08] rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-[#311B08] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-[#311B08] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-4 border-t-2 border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about disaster management..."
                className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none font-medium"
                disabled={isLoading}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-[#311B08] text-amber-500 p-3 rounded-xl hover:bg-amber-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by HopeBridge AI • {500 - inputMessage.length} chars left
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
