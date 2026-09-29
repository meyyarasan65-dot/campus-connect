import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { register } from '../../api/auth.api';

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || 'Registration failed.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
            Sign in instead
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
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium">
                Registration successful! Redirecting to login...
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">First name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-shadow hover:border-slate-400"
                    placeholder="Jane"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Last name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-shadow hover:border-slate-400"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-shadow hover:border-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
