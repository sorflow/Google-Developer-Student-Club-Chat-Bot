import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle2, Edit2, X, GraduationCap, Book, Calendar, FileText, AlertCircle } from 'lucide-react';
import { profileApi, UserProfile } from '../profileApi';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Login from '../components/Login';

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    classification: '',
    coursesTaken: [],
    major: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [newCourse, setNewCourse] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadProfile();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await profileApi.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      }
    } catch (err) {
      setError('Failed to load profile. Please try again later.');
      console.error('Error loading profile:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCourse = () => {
    if (newCourse.trim() && !profile.coursesTaken.includes(newCourse.trim())) {
      setProfile(prev => ({
        ...prev,
        coursesTaken: [...prev.coursesTaken, newCourse.trim()]
      }));
      setNewCourse('');
    }
  };

  const handleRemoveCourse = (course: string) => {
    setProfile(prev => ({
      ...prev,
      coursesTaken: prev.coursesTaken.filter(c => c !== course)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileApi.saveProfile(profile);
      setIsEditing(false);
      setIsSaved(true);
      setError(null);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again later.');
      console.error('Error saving profile:', err);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        const fileName = await profileApi.uploadDegreeWorks(file);
        setPdfFile(file);
        setPdfFileName(fileName);
        setProfile(prev => ({
          ...prev,
          degreeWorksPdf: fileName
        }));
        setError(null);
      } catch (err) {
        setError('Failed to upload PDF. Please try again later.');
        console.error('Error uploading PDF:', err);
      }
    }
  };

  if (!user) {
    return <Login onLoginSuccess={() => loadProfile()} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your academic information and preferences
            </p>
          </div>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Edit2 size={18} className="mr-2" />
              Edit Profile
            </motion.button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          // Edit Form with enhanced styling
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Edit Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update your academic information to get better assistance
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <GraduationCap className="mr-2" size={20} />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Major
                    </label>
                    <input
                      type="text"
                      name="major"
                      value={profile.major}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Classification
                    </label>
                    <select
                      name="classification"
                      value={profile.classification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select classification</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expected Graduation
                    </label>
                    <input
                      type="month"
                      name="expectedGraduation"
                      value={profile.expectedGraduation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <Book className="mr-2" size={20} />
                    Academic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Courses Taken
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newCourse}
                          onChange={(e) => setNewCourse(e.target.value)}
                          placeholder="Enter course code"
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={handleAddCourse}
                          className="px-4 py-2 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 p-2 min-h-[100px] max-h-[200px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                        {profile.coursesTaken.map((course, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-lg flex items-center group"
                          >
                            {course}
                            <button
                              onClick={() => handleRemoveCourse(course)}
                              className="ml-2 text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      DegreeWorks PDF (Optional)
                    </label>
                    <div className="mt-1 flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfUpload}
                          className="hidden"
                          id="degreeWorks"
                        />
                        <label
                          htmlFor="degreeWorks"
                          className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors flex items-center"
                        >
                          <FileText className="mr-2" size={18} />
                          Upload DegreeWorks PDF
                        </label>
                        {pdfFileName && (
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <CheckCircle2 className="mr-1" size={16} />
                            {pdfFileName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start">
                      <AlertCircle className="text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" size={18} />
                      <p className="text-sm text-yellow-600 dark:text-yellow-500">
                        Your academic information helps us provide personalized course recommendations and registration guidance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          // Profile View with enhanced styling
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Main Profile Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <GraduationCap className="mr-2" size={24} />
                    Academic Profile
                  </h2>
                  
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                      <p className="mt-2 text-lg text-gray-900 dark:text-white">
                        {profile.firstName} {profile.lastName}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Major</h3>
                      <p className="mt-2 text-lg text-gray-900 dark:text-white">
                        {profile.major || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Classification</h3>
                      <p className="mt-2 text-lg text-gray-900 dark:text-white">
                        {profile.classification || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Graduation</h3>
                      <p className="mt-2 text-lg text-gray-900 dark:text-white">
                        {profile.expectedGraduation ? new Date(profile.expectedGraduation).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Book className="mr-2" size={24} />
                    Courses Taken
                  </h2>
                  
                  <div className="mt-6">
                    {profile.coursesTaken.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.coursesTaken.map((course, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-lg"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No courses added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Academic Status Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Calendar className="mr-2" size={20} />
                    Academic Status
                  </h2>
                  
                  <div className="mt-4 space-y-4">
                    {profile.degreeWorksPdf && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">DegreeWorks</h3>
                        <div className="mt-1 flex items-center text-primary-600 dark:text-primary-400">
                          <FileText size={16} className="mr-1" />
                          <span>{profile.degreeWorksPdf}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center"
          >
            <AlertCircle size={20} className="mr-2" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center"
          >
            <CheckCircle2 size={20} className="mr-2" />
            <span>Profile updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;