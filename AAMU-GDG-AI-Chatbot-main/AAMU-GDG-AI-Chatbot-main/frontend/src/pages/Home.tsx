import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import FaqAccordion from '../components/FaqAccordion';
import { useChat } from '../contexts/ChatContext';

const faqItems = [
  {
    question: 'What are the steps for course registration?',
    answer: 'To register for courses, first meet with your academic advisor to discuss your course selections. Once approved, log in to the student portal during your registration time window, search for courses, add them to your cart, and complete registration. Be sure to pay any outstanding fees to secure your spot in the courses.'
  },
  {
    question: 'Who should I contact if I have issues with registration?',
    answer: 'For technical issues, contact the IT Help Desk at helpdesk@aamu.edu or (256)372-4357. For registration holds, contact the Registrar\'s Office. For course selection questions, reach out to your academic advisor. For financial holds, contact Student Accounts.'
  },
  {
    question: 'Can I register for classes outside my major?',
    answer: 'Yes, you can register for classes outside your major as long as you meet any prerequisites and the course is open to students from other majors. Some courses may require department approval or have space reserved for majors first.'
  },
  {
    question: 'How many credit hours can I take per semester?',
    answer: 'Undergraduate students can register for 12-18 credit hours as a standard load. To take more than 18 credits, you need approval from your department chair or dean. The minimum for full-time status is 12 credit hours.'
  },
];

const Home = () => {
  const { openChat } = useChat();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 rounded-3xl transform -rotate-1"></div>
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl transform rotate-1 opacity-50"></div>
          
          {/* Content Container */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            {/* Glass-like overlay */}
            <div className="absolute inset-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm"></div>
            
            {/* Content */}
            <div className="relative p-8 sm:p-12">
              {/* Hero Section */}
              <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="py-12 text-center"
              >
                <motion.div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent dark:from-primary-400/10 dark:via-primary-400/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                ></motion.div>
                
                <motion.h1 
                  variants={itemVariants}
                  className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400"
                >
                  Your Course Registration Assistant
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
                >
                  Get instant answers to your course registration questions and streamline your academic planning process.
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="relative z-10"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur opacity-30 group-hover:opacity-40 transition duration-1000 -z-10"></div>
                  
                  <button
                    onClick={openChat}
                    className="relative px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl shadow-lg font-medium text-lg flex items-center justify-center mx-auto transition-all duration-300 hover:shadow-2xl hover:scale-105 transform cursor-pointer"
                  >
                    <MessageSquare className="mr-2" size={20} />
                    Start Chat With Our Assistant
                  </button>
                </motion.div>
              </motion.section>

              {/* Divider */}
              <div className="my-16 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

              {/* FAQ Section */}
              <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="py-8"
              >
                <motion.h2 
                  variants={itemVariants}
                  className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400"
                >
                  Frequently Asked Questions
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-center text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
                >
                  Find answers to common questions about the course registration process.
                </motion.p>
                
                <motion.div 
                  variants={itemVariants}
                  className="relative"
                >
                  <FaqAccordion faqs={faqItems} />
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl -z-10 blur-lg opacity-50"></div>
                </motion.div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;