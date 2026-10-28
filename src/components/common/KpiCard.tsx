import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export interface KpiCardProps {
  label?: string;
  title?: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  subtitle?: string;
  trend?: string | {
    value: string;
    isPositive?: boolean;
    comparison?: string;
  };
  change?: string;
  statusDot?: 'success' | 'warning' | 'error' | 'brand' | 'neutral';
  icon?: React.ReactNode;
  iconVariant?: 'purple' | 'coral' | 'blue' | 'emerald';
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  title,
  value,
  unit,
  subtext,
  subtitle,
  trend,
  change,
  icon,
  iconVariant = 'purple',
  badge,
  className = '',
  onClick,
}) => {
  const displayLabel = label || title || '';
  const displaySubtext = subtext || subtitle || '';

  const getSquircleStyle = () => {
    switch (iconVariant) {
      case 'coral':
        return 'icon-squircle-coral text-[#FB3256]';
      case 'blue':
        return 'icon-squircle-blue text-[#168FE5]';
      case 'emerald':
        return 'icon-squircle-emerald text-[#16845B]';
      case 'purple':
      default:
        return 'icon-squircle-purple text-[#5141FF]';
    }
  };

  const renderTrendIndicator = () => {
    if (change) {
      const isPositive = change.startsWith('+') || change.includes('up');
      const isNegative = change.startsWith('-') || change.includes('down');
      const isLink = change.includes('→');

      if (isLink) {
        return (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#5141FF] group-hover:underline">
            <span>{change}</span>
          </span>
        );
      }

      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            isPositive
              ? 'text-[#16845B] bg-[#E8F7EF] border border-[#16845B]/20'
              : isNegative
              ? 'text-[#C52238] bg-[#FFF0F1] border border-[#C52238]/20'
              : 'text-[#62697C] bg-[#F0F2F7]'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 shrink-0" aria-hidden="true" />
          ) : isNegative ? (
            <TrendingDown className="w-3 h-3 shrink-0" aria-hidden="true" />
          ) : null}
          <span>{change}</span>
        </span>
      );
    }

    if (typeof trend === 'object' && trend !== null) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              trend.isPositive
                ? 'text-[#16845B] bg-[#E8F7EF] border border-[#16845B]/20'
                : 'text-[#C52238] bg-[#FFF0F1] border border-[#C52238]/20'
            }`}
          >
            {trend.isPositive ? (
              <TrendingDown className="w-3 h-3 shrink-0" aria-hidden="true" />
            ) : (
              <TrendingUp className="w-3 h-3 shrink-0" aria-hidden="true" />
            )}
            <span>{trend.value}</span>
          </span>
          {trend.comparison && (
            <span className="text-[11px] text-[#858CA0] truncate">{trend.comparison}</span>
          )}
        </div>
      );
    }

    if (typeof trend === 'string') {
      if (trend === 'up') {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16845B] bg-[#E8F7EF] px-2 py-0.5 rounded-full border border-[#16845B]/20">
            <TrendingUp className="w-3 h-3" aria-hidden="true" />
            <span>Positive</span>
          </span>
        );
      }
      if (trend === 'down') {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C52238] bg-[#FFF0F1] px-2 py-0.5 rounded-full border border-[#C52238]/20">
            <TrendingDown className="w-3 h-3" aria-hidden="true" />
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
      className={`group glass-card p-4 sm:p-5 flex flex-col justify-between h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5141FF]/30 focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top Header: Label & Squircle Icon */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-[#62697C] uppercase tracking-wider font-sans truncate">
          {displayLabel}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {icon && (
            <div className={`w-9 h-9 ${getSquircleStyle()} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}>
              {icon}
            </div>
          )}
          {onClick && !icon && !badge && (
            <div className="w-8 h-8 rounded-xl bg-white/80 border border-[#E2E5EF] flex items-center justify-center text-[#858CA0] group-hover:text-[#5141FF] group-hover:border-[#5141FF]/30 transition-all">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Middle: Prominent Value with Unit */}
      <div className="my-auto py-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold text-[#181B27] font-sans tracking-tight leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-xs sm:text-sm font-semibold text-[#858CA0] font-mono">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom: Subtext & Trend Alignment */}
      {(displaySubtext || trend || change) && (
        <div className="flex items-center justify-between text-xs text-[#62697C] mt-2.5 pt-2.5 border-t border-[#E2E5EF]/60 gap-2">
          {displaySubtext && (
            <span className="truncate text-xs text-[#858CA0]" title={displaySubtext}>
              {displaySubtext}
            </span>
          )}
          <div className="shrink-0 ml-auto">{renderTrendIndicator()}</div>
        </div>
      )}
    </div>
  );
};
