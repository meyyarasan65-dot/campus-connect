import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { Users, Calendar, Bell, Trophy, PieChart, Shield, MessageSquare } from 'lucide-react';
import { ROLES } from '../../constants/roles';

export const Dashboard = () => {
  const user = useAuthStore((s) => s.user);

  const getRoleWidgets = () => {
    switch (user?.role) {
      case ROLES.STUDENT:
        return [
          { title: 'Discover Clubs', icon: Users, desc: 'Find communities that match your interests', to: '/clubs', color: 'bg-blue-50 text-blue-600 border-blue-200' },
          { title: 'Upcoming Events', icon: Calendar, desc: 'Check out the events happening around campus', to: '/events', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
          { title: 'My Points', icon: Trophy, desc: 'Scan QRs and check your activity points', to: '/points', color: 'bg-amber-50 text-amber-600 border-amber-200' },
          { title: 'Forums', icon: MessageSquare, desc: 'Ask questions and discuss with peers', to: '/forums', color: 'bg-purple-50 text-purple-600 border-purple-200' },
        ];
      case ROLES.CLUB_ADMIN:
        return [
          { title: 'Manage Clubs', icon: Users, desc: 'View and edit your clubs', to: '/clubs', color: 'bg-brand-50 text-brand-600 border-brand-200' },
          { title: 'Post Announcement', icon: Bell, desc: 'Reach out to your club members', to: '/announcements', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
          { title: 'Club Analytics', icon: PieChart, desc: 'View engagement metrics', to: '/analytics', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        ];
      case ROLES.FACULTY:
        return [
          { title: 'Organize Events', icon: Calendar, desc: 'Create and manage department events', to: '/events', color: 'bg-amber-50 text-amber-600 border-amber-200' },
          { title: 'Issue Points', icon: Trophy, desc: 'Generate attendance QR codes', to: '/points', color: 'bg-purple-50 text-purple-600 border-purple-200' },
          { title: 'Department Analytics', icon: PieChart, desc: 'View student engagement', to: '/analytics', color: 'bg-brand-50 text-brand-600 border-brand-200' },
        ];
      case ROLES.ALUMNI:
        return [
          { title: 'Mentor Forums', icon: MessageSquare, desc: 'Answer questions and guide students', to: '/forums', color: 'bg-purple-50 text-purple-600 border-purple-200' },
          { title: 'Campus Events', icon: Calendar, desc: 'Join alumni-open events', to: '/events', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        ];
      case ROLES.SYSTEM_ADMIN:
        return [
          { title: 'Global Analytics', icon: PieChart, desc: 'View campus-wide engagement data', to: '/analytics', color: 'bg-blue-50 text-blue-600 border-blue-200' },
          { title: 'User Management', icon: Shield, desc: 'Manage roles and accounts', to: '/profile', color: 'bg-red-50 text-red-600 border-red-200' },
          { title: 'Platform Moderation', icon: MessageSquare, desc: 'Moderate forums and content', to: '/forums', color: 'bg-slate-50 text-slate-600 border-slate-200' },
        ];
      default:
        return [];
    }
  };

  const widgets = getRoleWidgets();

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-brand-600 rounded-3xl p-8 sm:p-12 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-brand-100 text-lg max-w-xl">
              You are logged in as a <span className="font-bold text-white capitalize">{user?.role}</span>. 
              Here is your quick launch pad for Campus Connect.
            </p>
          </div>
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 right-20 -mb-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map((widget, i) => (
            <Link 
              key={i} 
              to={widget.to}
              className={`block rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-md ${widget.color}`}
            >
              <div className="bg-white/80 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm backdrop-blur-sm">
                <widget.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{widget.title}</h3>
              <p className="opacity-90 text-sm font-medium">{widget.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
