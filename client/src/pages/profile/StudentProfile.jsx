import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile } from '../../api/users.api';
import { useAuthStore } from '../../store/authStore';
import { UserCircle, BookOpen, GraduationCap, Trophy, Save, X, Briefcase } from 'lucide-react';
import { FileUpload } from '../../components/FileUpload';
import { UserManagementTab } from './UserManagementTab';
import { ROLES } from '../../constants/roles';

export const StudentProfile = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ department: '', batchYear: '', studentId: '', skills: '' });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setIsEditing(false);
    }
  });

  const handleEditClick = () => {
    setFormData({
      department: profile?.department || '',
      batchYear: profile?.batchYear || '',
      studentId: profile?.studentId || '',
      skills: profile?.skills?.join(', ') || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      department: formData.department,
      batchYear: parseInt(formData.batchYear) || undefined,
      studentId: formData.studentId,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  const handleAvatarUpload = (url) => {
    updateMutation.mutate({ avatarUrl: url });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-16 w-16"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-600"></div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 flex justify-between items-end mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md overflow-hidden relative group">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-20 h-20 text-slate-400" />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold mb-1">Update Avatar</span>
                    <div className="scale-75">
                      <FileUpload onUploadSuccess={handleAvatarUpload} label="" accept="image/*" />
                    </div>
                  </div>
                )}
              </div>
              
              {!isEditing ? (
                <button onClick={handleEditClick} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 transition-colors flex items-center">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={updateMutation.isPending} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center shadow-sm">
                    {updateMutation.isPending ? 'Saving...' : <><Save className="w-4 h-4 mr-1" /> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h1>
              {!isEditing ? (
                <p className="text-slate-500 font-medium">
                  {profile?.department || 'Department not specified'} • Class of {profile?.batchYear || 'YYYY'}
                </p>
              ) : (
                <div className="flex space-x-2 mt-2">
                  <input type="text" placeholder="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="border rounded px-2 py-1 text-sm" />
                  <input type="number" placeholder="Batch Year" value={formData.batchYear} onChange={e => setFormData({...formData, batchYear: e.target.value})} className="border rounded px-2 py-1 text-sm w-24" />
                </div>
              )}
            </div>

            {/* Dynamic Profile Fields based on role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-slate-100 pt-8">
              
              {profile?.profileType === 'Alumni' && (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Graduation Year</h3>
                      {!isEditing ? (
                        <p className="text-sm text-slate-500 mt-1">{profile?.graduationYear}</p>
                      ) : (
                        <input type="number" value={formData.graduationYear || profile?.graduationYear || ''} onChange={e => setFormData({...formData, graduationYear: e.target.value})} className="border rounded px-2 py-1 text-sm mt-1 w-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Current Company</h3>
                      {!isEditing ? (
                        <p className="text-sm text-slate-500 mt-1">{profile?.currentCompany || 'Not set'}</p>
                      ) : (
                        <input type="text" value={formData.currentCompany || profile?.currentCompany || ''} onChange={e => setFormData({...formData, currentCompany: e.target.value})} className="border rounded px-2 py-1 text-sm mt-1 w-full" />
                      )}
                    </div>
                  </div>
                </>
              )}

              {profile?.profileType === 'Student' && (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Student ID</h3>
                      {!isEditing ? (
                        <p className="text-sm text-slate-500 mt-1">{profile?.studentId || 'Not set'}</p>
                      ) : (
                        <input type="text" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="border rounded px-2 py-1 text-sm mt-1 w-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Activity Points</h3>
                      <p className="text-sm text-slate-500 mt-1">{profile?.totalActivityPoints || 0} points</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Role</h3>
                  <p className="text-sm text-slate-500 mt-1 capitalize">{user?.role}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Activity Points</h3>
                  <p className="text-sm text-slate-500 mt-1">{profile?.totalActivityPoints} points</p>
                </div>
              </div>
            </div>

            {profile?.profileType === 'Student' && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Skills</h3>
                {!isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.length > 0 ? (
                      profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                    )}
                  </div>
                ) : (
                  <input type="text" placeholder="React, Node.js, Design..." value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="border rounded px-3 py-2 text-sm w-full" />
                )}
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Upload Documents / Resume</h3>
              <FileUpload 
                onUploadSuccess={(url) => console.log('File uploaded:', url)} 
                label="Click to upload a document (PDF, JPG, PNG)" 
              />
            </div>

          </div>
        </div>

        {/* System Admin Panel */}
        {user?.role === ROLES.SYSTEM_ADMIN && (
          <UserManagementTab />
        )}

      </div>
    </div>
  );
};
