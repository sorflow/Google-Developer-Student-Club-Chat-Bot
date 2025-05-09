import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User as UserIcon, Clock, Trash2 } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

const ChatModal = () => {
  const { messages, addMessage, clearMessages, isOpen, toggleChat } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addMessage(inputValue, 'user');
      setInputValue('');
      setIsTyping(true);
      
      // Simulate typing delay before bot response
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }
  };

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const modalVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const typingVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl h-[600px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                  <Bot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Course Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">University Registration Helper</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearMessages}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                  aria-label="Clear chat"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {msg.type === 'bot' && (
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                        <Bot className="text-white" size={16} />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.type === 'user'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm md:text-base">{msg.text}</p>
                    <div
                      className={`text-xs mt-1 flex items-center ${
                        msg.type === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Clock size={12} className="mr-1" />
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                  {msg.type === 'user' && (
                    <div className="flex-shrink-0 ml-2 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                        <UserIcon className="text-gray-600 dark:text-gray-300" size={16} />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    variants={typingVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex justify-start"
                  >
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                        <Bot className="text-white" size={16} />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
                />
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  disabled={!inputValue.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Try asking about registration deadlines, required courses, or advisor meetings
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;