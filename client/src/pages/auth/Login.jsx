import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { login } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate('/');
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <LogIn className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
            Join the community
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-shadow hover:border-slate-400"
                  placeholder="you@campus.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-shadow hover:border-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
