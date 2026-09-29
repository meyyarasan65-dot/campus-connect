 import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllClubs, createClub } from '../../api/clubs.api';
import { Users, Shield, X, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FileUpload } from '../../components/FileUpload';
import { Can } from '../../components/Can';
import { PERMISSIONS } from '../../constants/roles';

export const ClubList = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: clubs, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: getAllClubs,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', logoUrl: '' });

  const createMutation = useMutation({
    mutationFn: createClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', category: '', logoUrl: '' });
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to create club. Make sure description is at least 10 characters.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.category) delete payload.category;
    if (!payload.logoUrl) delete payload.logoUrl;
    createMutation.mutate(payload);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Loading clubs...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campus Clubs</h1>
            <p className="mt-2 text-slate-600">Discover and join communities that match your interests.</p>
          </div>
          <Can permission={PERMISSIONS.CLUBS_CREATE}>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
              Create Club
            </button>
          </Can>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs?.map((club) => (
            <div key={club._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
              <div className="h-32 bg-slate-100 relative">
                {club.logoUrl ? (
                  <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"></div>
                )}
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 rounded-md shadow-sm">
                    {club.category || 'General'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {club.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {club.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium text-slate-600">
                    <Users className="w-4 h-4 mr-1.5 text-slate-400" />
                    {club.members?.length || 0}
                  </div>
                  <Link to={`/clubs/${club._id}`} className="text-sm font-semibold text-brand-600 hover:text-brand-500">
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {clubs?.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No clubs found</h3>
              <p className="text-sm text-slate-500 mt-1">Be the first to start a community!</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Club</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Club Name</label>
                <input required minLength={2} type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. Technical, Cultural" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (min 10 chars)</label>
                <textarea required minLength={10} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-3 py-2" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Club Banner/Logo</label>
                {formData.logoUrl ? (
                  <div className="relative h-24 rounded-lg overflow-hidden border">
                    <img src={formData.logoUrl} alt="Uploaded logo" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, logoUrl: ''})} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X className="w-4 h-4"/></button>
                  </div>
                ) : (
                  <FileUpload onUploadSuccess={(url) => setFormData({...formData, logoUrl: url})} label="Upload Club Banner" accept="image/*" />
                )}
              </div>
              <button type="submit" disabled={createMutation.isPending} className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 mt-2">
                {createMutation.isPending ? 'Creating...' : 'Create Club'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
