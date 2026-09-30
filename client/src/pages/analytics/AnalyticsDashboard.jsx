import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/analytics.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Calendar, Trophy, TrendingUp, Medal } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 flex flex-col items-center">
          <Activity className="w-8 h-8 animate-spin mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500">
        <p>Failed to load analytics data.</p>
      </div>
    );
  }

  const { overview, trends, leaderboard } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-brand-600" /> Platform Analytics
          </h1>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{overview.totalUsers}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Clubs</p>
              <p className="text-3xl font-bold text-slate-900">{overview.totalClubs}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Events Hosted</p>
              <p className="text-3xl font-bold text-slate-900">{overview.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Engagement Trends (Last 6 Months)</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="pointsAwarded" name="Points Awarded" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="events" name="Events Held" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard Widget */}
          <div className="bg-gradient-to-b from-brand-600 to-brand-800 rounded-2xl shadow-lg p-1 overflow-hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-xl h-full p-6 text-white">
              <h2 className="text-lg font-bold flex items-center mb-6">
                <Medal className="w-5 h-5 mr-2 text-yellow-300" /> Student Leaderboard
              </h2>
              
              <div className="space-y-4">
                {leaderboard.length > 0 ? (
                  leaderboard.map((student, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-white/10 text-white'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-brand-200">{student.points} pts</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-brand-200 text-sm italic">No data available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
