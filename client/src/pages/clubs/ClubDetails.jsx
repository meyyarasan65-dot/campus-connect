import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getClubById, joinClub, leaveClub } from '../../api/clubs.api';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, Users, ShieldCheck, Mail, Calendar, LogOut, UserPlus } from 'lucide-react';
import { ROLES } from '../../constants/roles';

export const ClubDetails = () => {
  const { clubId } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: club, isLoading } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => getClubById(clubId),
  });

  const joinMutation = useMutation({
    mutationFn: joinClub,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['club', clubId] }),
  });

  const leaveMutation = useMutation({
    mutationFn: leaveClub,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['club', clubId] }),
  });

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Loading club details...</div>;
  }

  if (!club) {
    return <div className="min-h-screen bg-slate-50 p-8 text-center text-red-500">Club not found.</div>;
  }

  // Check if current user is member or admin
  const isMember = club.members?.some(m => m.user._id === user._id);
  const isAdmin = club.admins?.some(a => a._id === user._id);
  const canJoin = !isMember && !isAdmin && user.role === ROLES.STUDENT;
  const canLeave = isMember && !isAdmin;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <Link to="/clubs" className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-500 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clubs
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="h-48 sm:h-64 bg-slate-200 relative">
            {club.logoUrl ? (
              <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700"></div>
            )}
            <div className="absolute bottom-4 left-6">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-bold text-slate-800 rounded-full shadow-sm">
                {club.category || 'General'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{club.name}</h1>
                <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl text-lg">
                  {club.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 min-w-[140px]">
                {canJoin && (
                  <button 
                    onClick={() => joinMutation.mutate(clubId)}
                    disabled={joinMutation.isPending}
                    className="flex items-center justify-center px-4 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Club
                  </button>
                )}
                {canLeave && (
                  <button 
                    onClick={() => leaveMutation.mutate(clubId)}
                    disabled={leaveMutation.isPending}
                    className="flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors disabled:opacity-70"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Club
                  </button>
                )}
                {isAdmin && (
                  <div className="flex items-center justify-center px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl">
                    <ShieldCheck className="w-4 h-4 mr-2 text-brand-600" />
                    You are Admin
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
              {/* Admins Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
                  <ShieldCheck className="w-5 h-5 mr-2 text-brand-500" />
                  Club Admins
                </h3>
                <div className="space-y-3">
                  {club.admins?.map(admin => (
                    <div key={admin._id} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg mr-4">
                        {admin.firstName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{admin.firstName} {admin.lastName}</p>
                        <p className="text-sm text-slate-500 flex items-center mt-0.5">
                          <Mail className="w-3 h-3 mr-1" />
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members Stats Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Membership
                </h3>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-blue-900 font-medium">Total Members</p>
                    <p className="text-4xl font-extrabold text-blue-600 mt-1">{club.members?.length || 0}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
                
                {isMember && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start">
                    <div className="bg-emerald-100 p-1 rounded-full mr-3 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-emerald-900 font-semibold text-sm">Active Member</p>
                      <p className="text-emerald-700 text-xs mt-1">You are currently a member of this club.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
