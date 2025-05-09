import React, { createContext, useContext, useState } from 'react';

type MessageType = 'bot' | 'user';

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (text: string, type: MessageType) => void;
  clearMessages: () => void;
  isOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hi there! I'm your Course Registration Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const addMessage = (text: string, type: MessageType) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // If it's a user message, simulate a bot response after a delay
    if (type === 'user') {
      // Process user message to provide more contextual responses
      const userMessage = text.toLowerCase();
      
      setTimeout(() => {
        let botResponse = "";
        
        // Check for keywords in user message to provide more relevant responses
        if (userMessage.includes('registration') || userMessage.includes('register')) {
          botResponse = "Registration for Fall 2025 begins on April 1st for seniors and April 3rd for juniors. You'll need to meet with your advisor before registering. Have you scheduled an appointment yet?";
        } else if (userMessage.includes('advisor') || userMessage.includes('counselor')) {
          botResponse = "You can schedule an advisor meeting through the student portal. Most advisors have office hours Monday through Friday. Would you like me to help you find your advisor's contact information?";
        } else if (userMessage.includes('course') || userMessage.includes('class')) {
          botResponse = "The course catalog for next semester is now available online. You can register for up to 18 credit hours without special permission from your department chair. Is there a specific course you're interested in?";
        } else if (userMessage.includes('deadline') || userMessage.includes('due date')) {
          botResponse = "Important deadlines: Course registration ends on May 15th, and tuition payment is due by June 1st. Late registration fees apply after these dates.";
        } else if (userMessage.includes('help') || userMessage.includes('assist')) {
          botResponse = "I can help you with course registration, finding advisor information, checking deadlines, and exploring available courses. What specific information do you need?";
        } else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
          botResponse = "Hello! I'm here to help with your course registration. What would you like to know?";
        } else if (userMessage.includes('thank')) {
          botResponse = "You're welcome! Is there anything else I can help you with?";
        } else {
          // Default responses for other queries
          const defaultResponses = [
            "I can help you with course registration. What specific information do you need?",
            "Registration for Fall 2025 begins on April 1st for seniors and April 3rd for juniors.",
            "You'll need to meet with your advisor before registering. Have you scheduled an appointment yet?",
            "The course catalog for next semester is now available online. Would you like me to send you the link?",
            "You can register for up to 18 credit hours without special permission from your department chair.",
            "Is there a specific course you're interested in? I can help you find information about prerequisites and availability.",
            "Have you checked your degree audit recently? It's a good idea to review it before registration.",
            "Remember to check for any holds on your account before attempting to register.",
            "Would you like to see a list of recommended courses for your major?",
            "I can help you find information about course schedules and room assignments."
          ];
          
          botResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        addMessage(botResponse, 'bot');
      }, 1000);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        text: "Hi there! I'm your Course Registration Assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, isOpen, toggleChat, openChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};