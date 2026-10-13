import React from 'react';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Lock,
  FileCheck,
  HelpCircle,
} from 'lucide-react';

export type StatusType =
  | 'Approved'
  | 'Pending'
  | 'Submitted'
  | 'Under Review'
  | 'Draft'
  | 'Sent Back'
  | 'Returned'
  | 'Locked'
  | 'Error'
  | 'Failed'
  | 'Flagged'
  | 'Rejected'
  | 'Default'
  | 'Initiated'
  | 'Active'
  | 'Ready'
  | 'Ready for review'
  | 'In Progress'
  | 'Resolved'
  | 'Open'
  | 'Answered'
  | 'Closed'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  customLabel?: string;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  customLabel,
  className = '',
}) => {
  const normStatus = (status || '').toLowerCase().trim();

  let colorClasses = 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]';
  let IconComponent: React.ElementType = FileCheck;

  if (
    normStatus === 'approved' ||
    normStatus === 'published' ||
    normStatus === 'verified' ||
    normStatus === 'active' ||
    normStatus === 'ready' ||
    normStatus === 'ready for review' ||
    normStatus === 'resolved' ||
    normStatus === 'closed'
  ) {
    colorClasses = 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
    IconComponent = CheckCircle2;
  } else if (
    normStatus === 'pending' ||
    normStatus === 'submitted' ||
    normStatus === 'under review' ||
    normStatus === 'in review' ||
    normStatus === 'in progress' ||
    normStatus === 'initiated'
  ) {
    colorClasses = 'bg-[#EDF2FA] text-[#01153C] border-[#DCE5F5]';
    IconComponent = Clock;
  } else if (
    normStatus === 'returned' ||
    normStatus === 'sent back' ||
    normStatus === 'warning' ||
    normStatus === 'failed' ||
    normStatus === 'needs review' ||
    normStatus === 'correction'
  ) {
    colorClasses = 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]';
    IconComponent = RotateCcw;
  } else if (
    normStatus === 'flagged' ||
    normStatus === 'rejected' ||
    normStatus === 'error' ||
    normStatus === 'critical' ||
    normStatus === 'urgent' ||
    normStatus === 'action required'
  ) {
    colorClasses = 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
    IconComponent = AlertCircle;
  } else if (normStatus === 'locked') {
    colorClasses = 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]';
    IconComponent = Lock;
  } else if (normStatus === 'default' || normStatus === 'info') {
    colorClasses = 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]';
    IconComponent = HelpCircle;
  }

  const heightClass = size === 'sm' ? 'h-5 px-1.5 text-[11px]' : 'h-6 px-2 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const labelText = customLabel || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium border select-none whitespace-nowrap ${heightClass} ${colorClasses} ${className}`}
      role="status"
    >
      <IconComponent className={`${iconSize} shrink-0`} aria-hidden="true" />
      <span>{labelText}</span>
    </span>
  );
};
