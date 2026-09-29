import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RouteGuard } from './routes/RouteGuard';
import { getMe, getCsrfToken } from './api/auth.api';
import { useAuthStore } from './store/authStore';

import { StudentProfile } from './pages/profile/StudentProfile';
import { ClubList } from './pages/clubs/ClubList';
import { AnnouncementsFeed } from './pages/content/AnnouncementsFeed';
import { EventsDiscovery } from './pages/content/EventsDiscovery';
import { ForumList } from './pages/forums/ForumList';
import { ThreadView } from './pages/forums/ThreadView';
import { PointsWallet } from './pages/points/PointsWallet';
import { AnalyticsDashboard } from './pages/analytics/AnalyticsDashboard';
import { Dashboard } from './pages/dashboard/Dashboard';

import { useState } from 'react';
import { Menu, X, LogOut, Home, User, Users, Bell, Calendar, MessageSquare, Trophy, PieChart } from 'lucide-react';

import { usePermission } from './hooks/usePermission';
import { PERMISSIONS } from './constants/roles';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.clearAuth);
  const { hasPermission } = usePermission();

  const navLinks = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/clubs', icon: Users, label: 'Clubs' },
    { to: '/announcements', icon: Bell, label: 'Announcements' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/forums', icon: MessageSquare, label: 'Forums' },
    { to: '/points', icon: Trophy, label: 'Points' },
  ];

  if (hasPermission(PERMISSIONS.ANALYTICS_READ)) {
    navLinks.push({ to: '/analytics', icon: PieChart, label: 'Analytics' });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-brand-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 font-bold text-xl tracking-tight">
              Campus Connect
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-1 overflow-x-auto items-center">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors flex items-center">
                  <link.icon className="w-4 h-4 mr-1.5" />
                  {link.label}
                </Link>
              ))}
              <button onClick={logout} className="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors flex items-center border border-brand-500">
                <LogOut className="w-4 h-4 mr-1.5" /> Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md hover:bg-brand-700 focus:outline-none">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden bg-brand-700 px-2 pt-2 pb-3 space-y-1 shadow-inner">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-800 flex items-center"
              >
                <link.icon className="w-5 h-5 mr-3 opacity-75" />
                {link.label}
              </Link>
            ))}
            <button 
              onClick={logout} 
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-brand-800 flex items-center text-red-200 mt-2 border-t border-brand-600 pt-3"
            >
              <LogOut className="w-5 h-5 mr-3 opacity-75" /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

function App() {
  const { setAuth, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await getCsrfToken(); // fetch initial CSRF token
        const { user } = await getMe();
        // Access token is usually grabbed by silent refresh if missing, but getMe forces a check.
        // For simplicity in init, if getMe succeeds, we assume we're authenticated.
        setAuth(user, null); // Token is handled by interceptors normally
      } catch (err) {
        // Not authenticated
      } finally {
        setInitialized(true);
      }
    };
    initAuth();
  }, [setAuth, setInitialized]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/profile" element={<Layout><StudentProfile /></Layout>} />
          <Route path="/clubs" element={<Layout><ClubList /></Layout>} />
          <Route path="/announcements" element={<Layout><AnnouncementsFeed /></Layout>} />
          <Route path="/events" element={<Layout><EventsDiscovery /></Layout>} />
          <Route path="/forums" element={<Layout><ForumList /></Layout>} />
          <Route path="/forums/:threadId" element={<Layout><ThreadView /></Layout>} />
          <Route path="/points" element={<Layout><PointsWallet /></Layout>} />
          <Route path="/analytics" element={<RouteGuard permission={PERMISSIONS.ANALYTICS_READ}><Layout><AnalyticsDashboard /></Layout></RouteGuard>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
