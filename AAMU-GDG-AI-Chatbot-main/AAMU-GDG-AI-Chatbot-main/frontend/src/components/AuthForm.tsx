import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

export const AuthForm: React.FC = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode]   = useState<'signin'|'signup'>('signin');
  const [email, setEmail] = useState('');
  const [pwd,   setPwd]   = useState('');
  const [err,   setErr]   = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setIsLoading(true);
    try {
      if (mode === 'signin') await signIn(email, pwd);
      else                   await signUp(email, pwd);
    } catch (error: any) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErr(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Welcome Back
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            required
          />
        </div>
        {err && <p className="text-red-500 text-sm">{err}</p>}
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5" />
          Sign in with Google
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : null}
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
        {mode === 'signin'
          ? <>Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-600 hover:underline">Sign Up</button></>
          : <>Already have one? <button onClick={() => setMode('signin')} className="text-blue-600 hover:underline">Sign In</button></>
        }
      </p>
    </div>
  );
};
