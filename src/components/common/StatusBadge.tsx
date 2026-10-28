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

  let colorClasses = 'bg-[#F0F2F7] text-[#42485A] border-[#E2E5EF]';
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
    colorClasses = 'bg-[#E8F7EF] text-[#16845B] border-[#16845B]/25';
    IconComponent = CheckCircle2;
  } else if (
    normStatus === 'pending' ||
    normStatus === 'submitted' ||
    normStatus === 'under review' ||
    normStatus === 'in review' ||
    normStatus === 'in progress' ||
    normStatus === 'initiated'
  ) {
    colorClasses = 'bg-[#F2F0FF] text-[#5141FF] border-[#5141FF]/25';
    IconComponent = Clock;
  } else if (
    normStatus === 'returned' ||
    normStatus === 'sent back' ||
    normStatus === 'warning' ||
    normStatus === 'failed' ||
    normStatus === 'needs review' ||
    normStatus === 'correction'
  ) {
    colorClasses = 'bg-[#FFF5D9] text-[#946200] border-[#946200]/25';
    IconComponent = RotateCcw;
  } else if (
    normStatus === 'flagged' ||
    normStatus === 'rejected' ||
    normStatus === 'error' ||
    normStatus === 'critical' ||
    normStatus === 'urgent' ||
    normStatus === 'action required'
  ) {
    colorClasses = 'bg-[#FFF0F1] text-[#C52238] border-[#C52238]/25';
    IconComponent = AlertCircle;
  } else if (normStatus === 'locked') {
    colorClasses = 'bg-[#F0F2F7] text-[#42485A] border-[#E2E5EF]';
    IconComponent = Lock;
  } else if (normStatus === 'default' || normStatus === 'info') {
    colorClasses = 'bg-[#EBF2FF] text-[#2859C5] border-[#2859C5]/25';
    IconComponent = HelpCircle;
  }

  const heightClass = size === 'sm' ? 'h-5 px-2 text-[11px]' : 'h-6 px-2.5 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const labelText = customLabel || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border select-none whitespace-nowrap ${heightClass} ${colorClasses} ${className}`}
      role="status"
    >
      <IconComponent className={`${iconSize} shrink-0`} aria-hidden="true" />
      <span>{labelText}</span>
    </span>
  );
};
