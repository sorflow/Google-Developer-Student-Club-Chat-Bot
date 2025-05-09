import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  GraduationCap,
  BookOpen, 
  Clock, 
  Award,
  AlertCircle,
  Upload,
  User,
  BookMarked
} from 'lucide-react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import Login from '../components/Login';
import { pdfParserService } from '../services/pdfParser';

interface CourseProgress {
  courseName: string;
  progress: number;
  grade?: string;
}

interface DashboardStats {
  totalCredits: number;
  gpa: number;
  completedCourses: number;
  ongoingCourses: number;
  major: string;
  studentName: string;
  studentId: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCredits: 0,
    gpa: 0,
    completedCourses: 0,
    ongoingCourses: 0,
    major: '',
    studentName: '',
    studentId: ''
  });
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    setUploadingPdf(true);
    setError(null);

    try {
      const parsedData = await pdfParserService.uploadAndParsePdf(file);
      
      // Update stats with parsed data
      setStats({
        totalCredits: parsedData.totalCredits,
        gpa: parsedData.gpa,
        completedCourses: parsedData.completedCourses.length,
        ongoingCourses: parsedData.ongoingCourses.length,
        major: parsedData.major,
        studentName: parsedData.studentName,
        studentId: parsedData.studentId
      });

      // Update course progress
      const progress: CourseProgress[] = [
        ...parsedData.completedCourses.map(course => {
          const [courseCode, grade] = course.split(' (');
          return {
            courseName: courseCode,
            progress: 100,
            grade: grade ? grade.replace(')', '') : 'Completed'
          };
        }),
        ...parsedData.ongoingCourses.map(course => ({
          courseName: course,
          progress: 50
        }))
      ];

      setCourseProgress(progress);
      setUploadingPdf(false);
    } catch (err) {
      console.error('Error parsing PDF:', err);
      setError('Failed to parse DegreeWorks PDF. Please try again.');
      setUploadingPdf(false);
    }
  };

  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Student Information */}
      {stats.studentName && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <User className="text-primary-600 dark:text-primary-400" size={24} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{stats.studentName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BookMarked className="text-primary-600 dark:text-primary-400" size={24} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Major</p>
                <p className="font-medium text-gray-900 dark:text-white">{stats.major}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="text-primary-600 dark:text-primary-400" size={24} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student ID</p>
                <p className="font-medium text-gray-900 dark:text-white">{stats.studentId}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Academic Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your academic progress and achievements
            </p>
          </div>

          {/* PDF Upload Button */}
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="hidden"
              id="pdf-upload"
              disabled={uploadingPdf}
            />
            <label
              htmlFor="pdf-upload"
              className={`flex items-center px-4 py-2 rounded-xl ${
                uploadingPdf
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
              } text-white transition-colors duration-200`}
            >
              <Upload size={20} className="mr-2" />
              {uploadingPdf ? 'Processing...' : 'Upload DegreeWorks PDF'}
            </label>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: GraduationCap, label: 'Total Credits', value: stats.totalCredits },
          { icon: Award, label: 'Current GPA', value: stats.gpa.toFixed(2) },
          { icon: BookOpen, label: 'Completed Courses', value: stats.completedCourses },
          { icon: Clock, label: 'Ongoing Courses', value: stats.ongoingCourses }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="text-primary-600 dark:text-primary-400" size={24} />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Course Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Course Progress
          </h2>
          <BarChart className="text-primary-600 dark:text-primary-400" size={24} />
        </div>

        {courseProgress.length > 0 ? (
          <div className="space-y-6">
            {courseProgress.map((course, index) => (
              <motion.div
                key={course.courseName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {course.courseName}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.grade || `In Progress`}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Upload your DegreeWorks PDF to view course progress
          </p>
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800"
        >
          <div className="flex items-start">
            <AlertCircle className="text-red-600 dark:text-red-500 mt-0.5 mr-2" size={18} />
            <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard; 