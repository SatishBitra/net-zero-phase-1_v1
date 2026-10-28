import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserRole } from '../../../types';
import {
  UserPlus,
  MapPin,
  Check,
  X,
  ArrowRight,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen08_UsersRoles: React.FC = () => {
  const { users, inviteUser, sites, navigateToScreen, showToast, currentRole, currentUser } = useApp();
  const canInvite = currentRole === 'TENANT_ADMIN';

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('DATA_ENTRY');
  const [siteScope, setSiteScope] = useState<string>('all');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canInvite) {
      showToast('Unauthorized', 'Only Tenant Administrators can invite users.', 'error');
      return;
    }
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
    <div id="screen-08-users-roles" className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Users & Roles' },
        ]}
        title="Users & Roles"
        actions={
          canInvite ? (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="enterprise-btn-primary h-9 px-3.5 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite User</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-[#5F6368] font-data bg-[#FAFAFB] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
              <Lock className="w-3.5 h-3.5 text-[#8A8F98]" />
              <span>User directory managed by Tenant Admin</span>
            </div>
          )
        }
      />

      {/* Users Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Name</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Email Address</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Platform Role</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Site Scope</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Account Status</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {users.map((user) => {
                const siteScopeLabel = user.siteScope.includes('all')
                  ? 'All Sites (Organisation-wide)'
                  : sites.find((s) => s.id === user.siteScope[0])?.name || user.siteScope[0];

                return (
                  <tr key={user.id} className="hover:bg-[#FAFAFB] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#5141FF]/10 border border-[#5141FF]/20 flex items-center justify-center font-bold text-xs text-[#181B27]">
                          {user.avatarInitials}
                        </div>
                        <span className="font-semibold text-[#17181A]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-data text-[#5F6368]">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAFAFB] text-[#17181A] text-[11px] font-semibold border border-[#E5E7EB]">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5F6368]">
                      <div className="flex items-center space-x-1 font-data">
                        <MapPin className="w-3.5 h-3.5 text-[#8A8F98]" />
                        <span>{siteScopeLabel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={user.status === 'Active' ? 'Approved' : 'Under Review'}
                        customLabel={user.status}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-[11px] text-[#5141FF] hover:underline font-semibold">
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
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#17181A]">Role Permission Matrix</h2>
          <span className="text-[11px] px-2.5 py-1 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB] text-[#5F6368] font-data">
            Four-Eye Principle Enforced
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Capability / Function</th>
                <th scope="col" className="py-2.5 px-3 font-semibold text-[#17181A] text-center">Tenant Admin</th>
                <th scope="col" className="py-2.5 px-3 font-semibold text-[#17181A] text-center">Data Entry</th>
                <th scope="col" className="py-2.5 px-3 font-semibold text-[#17181A] text-center">Reviewer / Approver</th>
                <th scope="col" className="py-2.5 px-3 font-semibold text-[#17181A] text-center">Verifier / VVB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAFAFB]">
                  <td className="py-2.5 px-4 text-[#17181A]">{row.action}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? (
                      <Check className="w-4 h-4 text-[#181B27] mx-auto" />
                    ) : (
                      <span className="text-[#8A8F98]">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.dataEntry ? (
                      <Check className="w-4 h-4 text-[#181B27] mx-auto" />
                    ) : (
                      <span className="text-[#8A8F98]">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.reviewer ? (
                      <Check className="w-4 h-4 text-[#181B27] mx-auto" />
                    ) : (
                      <span className="text-[#8A8F98]">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.verifier ? (
                      <Check className="w-4 h-4 text-[#181B27] mx-auto" />
                    ) : (
                      <span className="text-[#8A8F98]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion of Flow A Onboarding */}
      <div className="p-4 bg-[#5141FF]/5 border border-[#5141FF]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
        <div>
          <span className="font-bold text-[#181B27]">Onboarding Complete</span>
          <p className="text-[#5F6368] mt-0.5 text-[11px] font-data">
            The organisation boundary, sites, reporting periods, emission factors, and user roles are configured. You are now ready to begin Activity Data Ingestion.
          </p>
        </div>
        <button
          onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
          className="enterprise-btn-primary h-9 px-4 text-xs font-semibold shadow-xs flex items-center space-x-1.5 shrink-0"
        >
          <span>Open Activity Data Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Invite User Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] font-sans animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F4F5F6]">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-[#181B27]" />
                <h3 className="text-sm font-semibold text-[#17181A]">Invite Team Member</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#8A8F98] hover:text-[#17181A] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Full Name <span className="text-[#FB3256]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Work Email <span className="text-[#FB3256]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
                >
                  <option value="DATA_ENTRY">Data Entry (Enters/imports activity data)</option>
                  <option value="REVIEWER">Reviewer / Approver (Verifies & approves)</option>
                  <option value="VERIFIER">Verifier / VVB (Independent auditor)</option>
                  <option value="TENANT_ADMIN">Tenant Admin (Full administrative controls)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">Facility Scope</label>
                <select
                  value={siteScope}
                  onChange={(e) => setSiteScope(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
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
                  className="enterprise-btn-secondary h-9 px-3 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="enterprise-btn-primary h-9 px-4 text-xs font-semibold shadow-xs"
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
