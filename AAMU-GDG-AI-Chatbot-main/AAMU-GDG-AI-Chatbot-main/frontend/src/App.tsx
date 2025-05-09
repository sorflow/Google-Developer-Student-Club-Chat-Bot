// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout            from './components/Layout';
import Home              from './pages/Home';
import About             from './pages/About';
import Profile           from './pages/Profile';
import Dashboard         from './pages/Dashboard';
import { AuthForm }      from './components/AuthForm';
import { ChatProvider }  from './contexts/ChatContext';
import { AuthProvider, useAuth }  from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
