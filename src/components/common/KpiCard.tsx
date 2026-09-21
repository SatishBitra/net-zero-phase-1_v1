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
  statusDot,
  icon,
  badge,
  className = '',
  onClick,
}) => {
  const displayLabel = label || title || '';
  const displaySubtext = subtext || subtitle || '';

  const renderTrendBadge = () => {
    if (change) {
      const isPositive = change.startsWith('+') || change.includes('up');
      const isNegative = change.startsWith('-') || change.includes('down');
      const isLink = change.includes('→');

      if (isLink) {
        return (
          <span className="inline-flex items-center space-x-0.5 text-[11px] font-semibold text-[#01153C] group-hover:underline">
            <span>{change}</span>
          </span>
        );
      }

      return (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            isPositive
              ? 'bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20'
              : isNegative
              ? 'bg-[#ED2024]/10 text-[#ED2024] border border-[#ED2024]/20'
              : 'bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : isNegative ? (
            <TrendingDown className="w-3 h-3" />
          ) : null}
          <span>{change}</span>
        </span>
      );
    }

    if (typeof trend === 'object' && trend !== null) {
      return (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            trend.isPositive
              ? 'bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20'
              : 'bg-[#ED2024]/10 text-[#ED2024] border border-[#ED2024]/20'
          }`}
        >
          {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend.value}</span>
        </span>
      );
    }

    if (typeof trend === 'string') {
      if (trend === 'up') {
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20">
            <TrendingUp className="w-3 h-3" />
            <span>Good</span>
          </span>
        );
      }
      if (trend === 'down') {
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ED2024]/10 text-[#ED2024] border border-[#ED2024]/20">
            <TrendingDown className="w-3 h-3" />
            <span>Flagged</span>
          </span>
        );
      }
    }

    return null;
  };

  const renderStatusDot = () => {
    if (!statusDot) return null;
    const dotColors = {
      success: 'bg-[#0F9D58]',
      warning: 'bg-[#F59E0B]',
      error: 'bg-[#ED2024]',
      brand: 'bg-[#01153C]',
      neutral: 'bg-[#8A8F98]',
    };

    return (
      <span className="flex items-center space-x-1.5">
        <span className={`w-2 h-2 rounded-full ${dotColors[statusDot]} animate-pulse`} />
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`group bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full transition-all duration-150 hover:border-[#D5D8DD] hover:shadow-xs ${
        onClick ? 'cursor-pointer hover:border-[#01153C]/40 hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Top Header: Label & Icon/Badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2 min-w-0">
          {renderStatusDot()}
          <span className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans truncate">
            {displayLabel}
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {badge}
          {icon && (
            <div className="w-8 h-8 rounded-full bg-[#FAFAFB] border border-[#E5E7EB] flex items-center justify-center text-[#5F6368] group-hover:text-[#01153C] group-hover:border-[#01153C]/20 transition-all">
              {icon}
            </div>
          )}
          {onClick && !icon && !badge && (
            <div className="w-8 h-8 rounded-full bg-[#FAFAFB] border border-[#E5E7EB] flex items-center justify-center text-[#8A8F98] group-hover:text-[#01153C] group-hover:border-[#01153C]/20 transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Middle: Prominent Value */}
      <div className="my-auto py-2">
        <div className="text-2xl sm:text-3xl font-bold text-[#17181A] font-sans tracking-tight leading-none">
          {value}
        </div>
      </div>

      {/* Bottom: Subtext & Trend Alignment with Space-Between */}
      {(displaySubtext || trend || change) && (
        <div className="flex items-center justify-between text-xs text-[#5F6368] mt-3 pt-3 border-t border-[#F1F3F5] gap-2">
          <span className="truncate text-[#5F6368] text-xs font-sans" title={displaySubtext}>
            {displaySubtext}
          </span>
          <div className="shrink-0">{renderTrendBadge()}</div>
        </div>
      )}
    </div>
  );
};

