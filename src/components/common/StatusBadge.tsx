import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Lock,
  FileCheck,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
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
  showDot = true,
  className = '',
}) => {
  const normStatus = (status || '').toLowerCase().trim();

  let bgClass = 'bg-[#F1F3F5] text-[#59616B] border-[#E7E9EC]';
  let dotColor = '#858C96';
  let IconComponent: React.ElementType | null = null;

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
    bgClass = 'bg-[#EEF9F1] text-[#26783B] border-[#DDF3E3]';
    dotColor = '#43A65C';
    IconComponent = CheckCircle2;
  } else if (
    normStatus === 'pending' ||
    normStatus === 'submitted' ||
    normStatus === 'under review' ||
    normStatus === 'in review' ||
    normStatus === 'in progress'
  ) {
    bgClass = 'bg-[#F6F0FF] text-[#8145C5] border-[#EBDDFF]';
    dotColor = '#8145C5';
    IconComponent = Clock;
  } else if (normStatus === 'initiated') {
    bgClass = 'bg-[#F0EEFF] text-[#5144C9] border-[#D8D3FF]';
    dotColor = '#6254E8';
    IconComponent = Sparkles;
  } else if (
    normStatus === 'returned' ||
    normStatus === 'sent back' ||
    normStatus === 'warning' ||
    normStatus === 'failed' ||
    normStatus === 'needs review' ||
    normStatus === 'correction'
  ) {
    bgClass = 'bg-[#FFF8E8] text-[#956817] border-[#FFF0C7]';
    dotColor = '#D79A24';
    IconComponent = RotateCcw;
  } else if (
    normStatus === 'flagged' ||
    normStatus === 'rejected' ||
    normStatus === 'error'
  ) {
    bgClass = 'bg-[#FFF1F1] text-[#B83C3C] border-[#FFE0E0]';
    dotColor = '#D95353';
    IconComponent = AlertCircle;
  } else if (normStatus === 'default' || normStatus === 'info') {
    bgClass = 'bg-[#EEF5FF] text-[#2D61AC] border-[#DFECFF]';
    dotColor = '#4C83D6';
    IconComponent = HelpCircle;
  } else if (normStatus === 'locked') {
    bgClass = 'bg-[#F1F3F5] text-[#59616B] border-[#E5E7EB]';
    dotColor = '#858C96';
    IconComponent = Lock;
  } else {
    // Default neutral (Draft, etc.)
    bgClass = 'bg-[#F1F3F5] text-[#59616B] border-[#E5E7EB]';
    dotColor = '#858C96';
    IconComponent = FileCheck;
  }

  const heightClass = size === 'sm' ? 'h-6 px-2 text-[11px]' : 'h-7 px-2.5 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full font-semibold border font-sans select-none tracking-tight whitespace-nowrap ${heightClass} ${bgClass} ${className}`}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      <span>{customLabel || status}</span>
    </span>
  );
};
