import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { User, UserRole } from '../../../types';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  MapPin,
  Check,
  X,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

export const Screen08_UsersRoles: React.FC = () => {
  const { users, inviteUser, sites, navigateToScreen } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('DATA_ENTRY');
  const [siteScope, setSiteScope] = useState<string>('all');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !email) return;

    inviteUser({
      name: userName,
      email,
      role,
      siteScope: siteScope === 'all' ? ['all'] : [siteScope],
    });

    setIsDrawerOpen(false);
    setUserName('');
    setEmail('');
  };

  const permissionsMatrix = [
    {
      action: 'Configure organisation profile & boundaries',
      admin: true,
      dataEntry: false,
      reviewer: false,
      verifier: false,
    },
    {
      action: 'Create & lock reporting periods',
      admin: true,
      dataEntry: false,
      reviewer: false,
      verifier: false,
    },
    {
      action: 'Add sites & configure emission sources',
      admin: true,
      dataEntry: false,
      reviewer: false,
      verifier: false,
    },
    {
      action: 'Manual data entry & CSV bulk upload',
      admin: true,
      dataEntry: true,
      reviewer: false,
      verifier: false,
    },
    {
      action: 'Electricity bill upload & OCR verification',
      admin: true,
      dataEntry: true,
      reviewer: false,
      verifier: false,
    },
    {
      action: 'Review, approve, or send back submissions',
      admin: true,
      dataEntry: false,
      reviewer: true,
      verifier: false,
    },
    {
      action: 'Execute calculation runs & generate reports',
      admin: true,
      dataEntry: false,
      reviewer: true,
      verifier: false,
    },
    {
      action: 'Trace line items to source documents',
      admin: true,
      dataEntry: false,
      reviewer: true,
      verifier: true,
    },
    {
      action: 'Raise line-item audit queries & verify evidence',
      admin: false,
      dataEntry: false,
      reviewer: false,
      verifier: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Flow Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#5E6672] mb-1">
            <span>Administration</span>
            <span>•</span>
            <span className="text-[#174A8B] font-medium">Users & Roles</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Users & Roles</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Manage enterprise team access, assign specific roles, and constrain site scopes.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="mt-3 sm:mt-0 px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">Name</th>
                <th className="py-2.5 px-4 font-medium">Email Address</th>
                <th className="py-2.5 px-4 font-medium">Platform Role</th>
                <th className="py-2.5 px-4 font-medium">Site Scope</th>
                <th className="py-2.5 px-4 font-medium">Account Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {users.map((user) => {
                const siteScopeLabel = user.siteScope.includes('all')
                  ? 'All Sites (Organisation-wide)'
                  : sites.find((s) => s.id === user.siteScope[0])?.name || user.siteScope[0];

                return (
                  <tr key={user.id} className="hover:bg-[#F8F9FB] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#E9ECEF] border border-[#D9DDE3] flex items-center justify-center font-medium text-xs text-[#171A1F]">
                          {user.avatarInitials}
                        </div>
                        <span className="font-medium text-[#171A1F]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#5E6672]">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#171A1F] text-[11px] font-medium border border-[#D9DDE3]">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5E6672]">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#858C96]" />
                        <span>{siteScopeLabel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          user.status === 'Active'
                            ? 'bg-[#EAF2FB] text-[#174A8B]'
                            : user.status === 'Invited'
                            ? 'bg-[#FEF0EF] text-[#B42318]'
                            : 'bg-[#F1F3F5] text-[#5E6672]'
                        }`}
                      >
                        {user.status === 'Active' ? '● Active' : '○ Invited'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-[11px] text-[#2166B1] hover:underline">
                        Edit Access
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-medium text-[#171A1F]">Role Permission Matrix</h2>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Clear separation of duties across Data Entry, Reviewer Approvers, and external Verifiers.
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-[#5E6672]">
            Four-Eye Principle Enforced
          </span>
        </div>

        <div className="overflow-x-auto border border-[#D9DDE3] rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">Capability / Function</th>
                <th className="py-2.5 px-3 font-medium text-center">Tenant Admin</th>
                <th className="py-2.5 px-3 font-medium text-center">Data Entry</th>
                <th className="py-2.5 px-3 font-medium text-center">Reviewer / Approver</th>
                <th className="py-2.5 px-3 font-medium text-center">Verifier / VVB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8F9FB]">
                  <td className="py-2.5 px-4 text-[#171A1F]">{row.action}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? (
                      <Check className="w-4 h-4 text-[#174A8B] mx-auto" />
                    ) : (
                      <span className="text-[#858C96]">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.dataEntry ? (
                      <Check className="w-4 h-4 text-[#174A8B] mx-auto" />
                    ) : (
                      <span className="text-[#858C96]">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.reviewer ? (
                      <Check className="w-4 h-4 text-[#174A8B] mx-auto" />
                    ) : (
                      <span className="text-[#858C96]">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.verifier ? (
                      <Check className="w-4 h-4 text-[#174A8B] mx-auto" />
                    ) : (
                      <span className="text-[#858C96]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion of Flow A Onboarding */}
      <div className="p-4 bg-[#EAF2FB] border border-[#2166B1]/20 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-medium text-[#174A8B]">Onboarding Complete</span>
          <p className="text-[#5E6672] mt-0.5 text-[11px]">
            The organisation boundary, sites, reporting periods, emission factors, and user roles are configured. You are now ready to begin Activity Data Ingestion.
          </p>
        </div>
        <button
          onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
          className="px-4 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white font-medium rounded-md transition-colors flex items-center space-x-1.5 shrink-0 shadow-sm"
        >
          <span>Open Activity Data Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Invite User Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#D9DDE3] animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between bg-[#F8F9FB]">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-sm font-medium text-[#171A1F]">Invite Team Member</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#858C96] hover:text-[#171A1F] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Full Name <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Work Email <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
                >
                  <option value="DATA_ENTRY">Data Entry (Enters/imports activity data)</option>
                  <option value="REVIEWER">Reviewer / Approver (Verifies & approves)</option>
                  <option value="VERIFIER">Verifier / VVB (Independent auditor)</option>
                  <option value="TENANT_ADMIN">Tenant Admin (Full administrative controls)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">Facility Scope</label>
                <select
                  value={siteScope}
                  onChange={(e) => setSiteScope(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
                >
                  <option value="all">All Sites (Organisation-wide)</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-[#F1F3F5] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#5E6672]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
