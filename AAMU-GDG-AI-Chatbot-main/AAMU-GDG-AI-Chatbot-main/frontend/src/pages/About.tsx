import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Google Developers Group AAMU AI Team
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-xl text-gray-600 dark:text-gray-300 mb-8"
        >
      
        </motion.p>
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400"
        >
          <MapPin size={16} className="mr-1" />
          <span>Alabama A&M University, Normal, AL</span>
        </motion.div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Our Mission
        </motion.h2>
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          Google Developer Group (GDG) are community groups for college and university students interested in Google developer technologies. Students from all undergraduate or graduate programs with an interest in growing as a developer are welcome. By joining a GDSC, students grow their knowledge in a peer-to-peer learning environment and build solutions for local businesses and their community. 
          At the Alabama A&M University Chapter, we are looking forward to having you as a member, the wonderful contributions you will make, amazing experiences you will have, and the wonderful technology you will develop.
          Kindly reach out to us and join our community through the icons provided on this page, fill out our registration form so we can know about and we look forward to having you!
          Kindly reach out to us and join our community through the icons provided on this page, fill out our registration form so we can know about and we look forward to having you!
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mt-4">
            Through projects like the Course Registration Assistant, we aim to simplify administrative processes 
            and help students navigate university systems with greater ease and confidence.
          </p>
        </motion.div>
      </motion.section>

      {/* Join Us Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-2xl p-8 text-center max-w-4xl mx-auto"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold mb-4"
        >
          Join Our Community
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-primary-100 mb-6 max-w-2xl mx-auto"
        >
          Interested in technology, design, or making an impact on campus? Join the Google Developers Group AAMU Tech Team 
          and work on exciting projects with fellow students!
        </motion.p>
        <motion.a
          variants={itemVariants}
          href="https://gdg.community.dev/accounts/social/signup/?next=/gdg-on-campus-alabama-am-university-huntsville-united-states/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-white text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-colors"
        >
          Apply to Join
        </motion.a>
      </motion.section>
    </div>
  );
};

export default About;