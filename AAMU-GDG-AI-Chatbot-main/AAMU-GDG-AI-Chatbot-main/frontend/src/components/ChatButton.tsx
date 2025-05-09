import { MessageSquare, Bot } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { motion } from 'framer-motion';

const ChatButton = () => {
  const { toggleChat, isOpen } = useChat();

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleChat}
      className={`fixed bottom-6 right-6 z-20 p-4 rounded-full shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-label="Open chat assistant"
    >
      <div className="relative">
        <MessageSquare size={24} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
        >
          <Bot size={10} className="text-primary-600" />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default ChatButton;