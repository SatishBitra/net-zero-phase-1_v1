import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export interface KpiCardProps {
  label?: string;
  title?: string;
  value: string | number;
  subtext?: string;
  subtitle?: string;
  trend?: string | {
    value: string;
    isPositive?: boolean;
  };
  change?: string;
  statusDot?: 'success' | 'warning' | 'error' | 'brand' | 'neutral';
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  title,
  value,
  subtext,
  subtitle,
  trend,
  change,
  icon,
  badge,
  className = '',
  onClick,
}) => {
  const displayLabel = label || title || '';
  const displaySubtext = subtext || subtitle || '';

  const renderTrendIndicator = () => {
    if (change) {
      const isPositive = change.startsWith('+') || change.includes('up');
      const isNegative = change.startsWith('-') || change.includes('down');
      const isLink = change.includes('→');

      if (isLink) {
        return (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#01153C] group-hover:underline">
            <span>{change}</span>
          </span>
        );
      }

      return (
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold ${
            isPositive
              ? 'text-[#166534] bg-[#F0FDF4]'
              : isNegative
              ? 'text-[#991B1B] bg-[#FEF2F2]'
              : 'text-[#475467] bg-[#F9FAFB]'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : isNegative ? (
            <TrendingDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : null}
          <span>{change}</span>
        </span>
      );
    }

    if (typeof trend === 'object' && trend !== null) {
      return (
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold ${
            trend.isPositive ? 'text-[#166534] bg-[#F0FDF4]' : 'text-[#991B1B] bg-[#FEF2F2]'
          }`}
        >
          {trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>{trend.value}</span>
        </span>
      );
    }

    if (typeof trend === 'string') {
      if (trend === 'up') {
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] bg-[#F0FDF4] px-1.5 py-0.5 rounded">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Positive</span>
          </span>
        );
      }
      if (trend === 'down') {
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#991B1B] bg-[#FEF2F2] px-1.5 py-0.5 rounded">
            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Variance</span>
          </span>
        );
      }
    }

    return null;
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`group bg-white border border-[#D0D5DD] rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full transition-all duration-150 hover:border-[#01153C]/40 focus-visible:ring-2 focus-visible:ring-[#01153C] focus-visible:outline-none ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Top Header: Label & Icon/Badge */}
      <div className="flex items-center justify-between gap-2.5 mb-2">
        <span className="text-xs font-semibold text-[#475467] uppercase tracking-wider font-sans truncate">
          {displayLabel}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {icon && (
            <div className="w-7 h-7 rounded-md bg-[#F8F9FA] border border-[#E4E7EC] flex items-center justify-center text-[#344054] group-hover:text-[#01153C] transition-colors">
              {icon}
            </div>
          )}
          {onClick && !icon && !badge && (
            <div className="w-7 h-7 rounded-md bg-[#F8F9FA] border border-[#E4E7EC] flex items-center justify-center text-[#475467] group-hover:text-[#01153C] transition-colors">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Middle: Prominent Value */}
      <div className="my-auto py-1.5">
        <div className="text-2xl font-bold text-[#101828] font-sans tracking-tight leading-none">
          {value}
        </div>
      </div>

      {/* Bottom: Subtext & Trend Alignment */}
      {(displaySubtext || trend || change) && (
        <div className="flex items-center justify-between text-xs text-[#475467] mt-2.5 pt-2.5 border-t border-[#F2F4F7] gap-2">
          <span className="truncate text-xs font-sans text-[#475467]" title={displaySubtext}>
            {displaySubtext}
          </span>
          <div className="shrink-0">{renderTrendIndicator()}</div>
        </div>
      )}
    </div>
  );
};
