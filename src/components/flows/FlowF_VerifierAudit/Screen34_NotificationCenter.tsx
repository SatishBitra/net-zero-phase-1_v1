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
  Database,
  ArrowRight,
  Clock,
  Filter,
  Inbox,
  Circle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

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
          <div className="w-8 h-8 rounded-full bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0 border border-[#85B7EB]/40">
            <HelpCircle className="w-4 h-4" />
          </div>
        );
      case 'approval':
        return (
          <div className="w-8 h-8 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center justify-center shrink-0 border border-[#027A48]/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'import_failure':
        return (
          <div className="w-8 h-8 rounded-full bg-[#FEF0EF] text-[#B42318] flex items-center justify-center shrink-0 border border-[#FDA29B]/40">
            <AlertOctagon className="w-4 h-4" />
          </div>
        );
      case 'import_success':
        return (
          <div className="w-8 h-8 rounded-full bg-[#F8F9FB] text-[#171A1F] flex items-center justify-center shrink-0 border border-[#D9DDE3]">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        );
      case 'period_lock':
        return (
          <div className="w-8 h-8 rounded-full bg-[#F8F9FB] text-[#5E6672] flex items-center justify-center shrink-0 border border-[#D9DDE3]">
            <Lock className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-[#F1F3F5] text-[#5E6672] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div id="screen-34-notification-center" className="max-w-5xl mx-auto space-y-6">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DDE3] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-[#171A1F]">Notification Center</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#174A8B] text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Central inbox for verification inquiries, approvals, import failures, and system events.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={markAllNotificationsAsRead}
            disabled={unreadCount === 0}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              unreadCount > 0
                ? 'bg-white border-[#D9DDE3] text-[#171A1F] hover:bg-[#F8F9FB] shadow-xs'
                : 'bg-[#F8F9FB] border-transparent text-[#858C96] cursor-not-allowed'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (PRD Section 4: Filter tabs) */}
      <div className="flex items-center space-x-2 border-b border-[#D9DDE3] pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-[#171A1F] text-white'
              : 'text-[#5E6672] hover:text-[#171A1F] hover:bg-[#F1F3F5]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'unread'
              ? 'bg-[#171A1F] text-white'
              : 'text-[#5E6672] hover:text-[#171A1F] hover:bg-[#F1F3F5]'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('queries')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'queries'
              ? 'bg-[#171A1F] text-white'
              : 'text-[#5E6672] hover:text-[#171A1F] hover:bg-[#F1F3F5]'
          }`}
        >
          Verifier Queries
        </button>
        <button
          onClick={() => setActiveFilter('approvals')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'approvals'
              ? 'bg-[#171A1F] text-white'
              : 'text-[#5E6672] hover:text-[#171A1F] hover:bg-[#F1F3F5]'
          }`}
        >
          Approvals
        </button>
        <button
          onClick={() => setActiveFilter('imports')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'imports'
              ? 'bg-[#171A1F] text-white'
              : 'text-[#5E6672] hover:text-[#171A1F] hover:bg-[#F1F3F5]'
          }`}
        >
          Imports & Jobs
        </button>
      </div>

      {/* Notification List (PRD Section 4 & 5) */}
      {filteredNotifications.length === 0 ? (
        /* Empty State per PRD Section 6 */
        <div id="notifications-empty-state" className="bg-white border border-[#D9DDE3] rounded-lg p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F1F3F5] text-[#858C96] flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#171A1F]">No notifications</h3>
            <p className="text-xs text-[#5E6672] max-w-sm mx-auto">
              You are all caught up. New workflow and verification alerts will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D9DDE3] rounded-lg divide-y divide-[#F1F3F5] shadow-xs overflow-hidden">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 flex items-start justify-between gap-3 text-xs transition-colors cursor-pointer group ${
                !item.isRead ? 'bg-[#F8F9FB] hover:bg-[#F1F3F5]/80' : 'bg-white hover:bg-[#F8F9FB]'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {getNotificationIcon(item.type)}

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs ${
                        !item.isRead ? 'font-semibold text-[#171A1F]' : 'font-medium text-[#5E6672]'
                      } group-hover:text-[#174A8B] transition-colors`}
                    >
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#2166B1] shrink-0"
                        title="Unread notification"
                      />
                    )}
                  </div>

                  {item.description && (
                    <p className="text-[11px] text-[#5E6672] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.entityRef && (
                    <div className="text-[11px] font-mono text-[#858C96] pt-0.5">
                      Target: {item.entityRef}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 text-right">
                <span className="text-[11px] text-[#858C96] whitespace-nowrap flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.relativeTime || item.timestamp}</span>
                </span>
                <span className="text-[#858C96] group-hover:text-[#171A1F] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Note */}
      <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded-md text-[11px] text-[#5E6672] flex items-center justify-between">
        <span>Notifications are retained for 90 days in accordance with organizational assurance policy.</span>
        <button
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-[#174A8B] hover:underline font-medium"
        >
          Audit Trail Viewer →
        </button>
      </div>
    </div>
  );
};
