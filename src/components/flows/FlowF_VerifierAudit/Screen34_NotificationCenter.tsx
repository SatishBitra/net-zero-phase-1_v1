import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { SystemNotification, NotificationType } from '../../../types';
import {
  Bell,
  CheckCheck,
  HelpCircle,
  CheckCircle2,
  AlertOctagon,
  FileSpreadsheet,
  Lock,
  ArrowRight,
  Clock,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen34_NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateToScreen,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'queries' | 'approvals' | 'imports'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'unread') return !n.isRead;
      if (activeFilter === 'queries') return n.type === 'verifier_query';
      if (activeFilter === 'approvals') return n.type === 'approval';
      if (activeFilter === 'imports') return n.type === 'import_failure' || n.type === 'import_success';
      return true;
    });
  }, [notifications, activeFilter]);

  const handleNotificationClick = (item: SystemNotification) => {
    markNotificationAsRead(item.id);
    if (item.targetScreen) {
      navigateToScreen(item.targetScreen, item.targetFlow);
      showToast('Navigated from Notification', `Opening context for: ${item.title}`);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'verifier_query':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#6254E8]/10 text-[#6254E8] flex items-center justify-center shrink-0 border border-[#6254E8]/20">
            <HelpCircle className="w-4 h-4" />
          </div>
        );
      case 'approval':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#ECFDF3] text-[#027A48] flex items-center justify-center shrink-0 border border-[#027A48]/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'import_failure':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#FEF3F2] text-[#B42318] flex items-center justify-center shrink-0 border border-[#FDA29B]/40">
            <AlertOctagon className="w-4 h-4" />
          </div>
        );
      case 'import_success':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#FAFAFB] text-[#17181A] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        );
      case 'period_lock':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#FAFAFB] text-[#5F6368] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
            <Lock className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#F4F5F6] text-[#5F6368] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div id="screen-34-notification-center" className="max-w-5xl mx-auto space-y-6">
      {/* Header & Meta */}
      <PageHeader
        breadcrumbs={[
          { label: 'Overview', onClick: () => navigateToScreen('10_activity_dashboard') },
          { label: 'Notification Center' },
        ]}
        title="Notification Center"
        description="Central inbox for verification inquiries, approvals, import failures, and system events."
        badge={
          unreadCount > 0 ? (
            <StatusBadge status="Under Review" customLabel={`${unreadCount} unread`} size="sm" />
          ) : undefined
        }
        actions={
          <button
            onClick={markAllNotificationsAsRead}
            disabled={unreadCount === 0}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#5F6368]" />
            <span>Mark all as read</span>
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E5E7EB] pb-3 text-xs overflow-x-auto font-sans">
        {[
          { key: 'all', label: `All (${notifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'queries', label: 'Verifier Queries' },
          { key: 'approvals', label: 'Approvals' },
          { key: 'imports', label: 'Imports & Jobs' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeFilter === tab.key
                ? 'bg-[#6254E8] text-white shadow-2xs'
                : 'bg-white border border-[#E5E7EB] text-[#5F6368] hover:text-[#17181A] hover:bg-[#FAFAFB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        /* Empty State */
        <div id="notifications-empty-state" className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#F4F5F6] text-[#8A8F98] flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#17181A] font-sans">No notifications</h3>
            <p className="text-xs text-[#5F6368] max-w-sm mx-auto font-data">
              You are all caught up. New workflow and verification alerts will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl divide-y divide-[#F1F3F5] shadow-2xs overflow-hidden">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 flex items-start justify-between gap-3 text-xs transition-colors cursor-pointer group ${
                !item.isRead ? 'bg-[#6254E8]/5 hover:bg-[#6254E8]/10' : 'bg-white hover:bg-[#FAFAFB]'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {getNotificationIcon(item.type)}

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs ${
                        !item.isRead ? 'font-semibold text-[#17181A]' : 'font-medium text-[#5F6368]'
                      } group-hover:text-[#6254E8] transition-colors font-sans`}
                    >
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#6254E8] shrink-0"
                        title="Unread notification"
                      />
                    )}
                  </div>

                  {item.description && (
                    <p className="text-[11px] text-[#5F6368] line-clamp-2 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  )}

                  {item.entityRef && (
                    <div className="text-[11px] activity-id text-[#8A8F98] pt-0.5 font-medium">
                      Target: {item.entityRef}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 text-right">
                <span className="text-[11px] text-[#8A8F98] whitespace-nowrap flex items-center space-x-1 font-data">
                  <Clock className="w-3 h-3" />
                  <span>{item.relativeTime || item.timestamp}</span>
                </span>
                <span className="text-[#8A8F98] group-hover:text-[#17181A] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Note */}
      <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl text-[11px] text-[#5F6368] flex items-center justify-between font-data shadow-2xs">
        <span>Notifications are retained for 90 days in accordance with organizational assurance policy.</span>
        <button
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-[#6254E8] hover:underline font-semibold font-sans"
        >
          Audit Trail Viewer →
        </button>
      </div>
    </div>
  );
};
