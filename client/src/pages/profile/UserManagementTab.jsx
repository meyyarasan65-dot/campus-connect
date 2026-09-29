import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserRole } from '../../api/users.api';
import { Shield, Search, UserCog } from 'lucide-react';
import { ROLES } from '../../constants/roles';

export const UserManagementTab = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsersList'],
    queryFn: getAllUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      alert('User role updated successfully');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  });

  const filteredUsers = users?.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-brand-600" />
          User Management
        </h2>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center">Loading users...</td></tr>
            ) : filteredUsers?.length > 0 ? (
              filteredUsers.map(u => (
                <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-3 font-bold">
                      {u.firstName[0]}
                    </div>
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'SystemAdmin' ? 'bg-red-100 text-red-700' :
                      u.role === 'Faculty' ? 'bg-blue-100 text-blue-700' :
                      u.role === 'ClubAdmin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'Alumni' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role}
                      onChange={(e) => roleMutation.mutate({ userId: u._id, role: e.target.value })}
                      disabled={roleMutation.isPending}
                      className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2"
                    >
                      {Object.values(ROLES).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
