import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  contextInfo?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  description,
  badge,
  actions,
  contextInfo,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-[#5F6368] mb-2 font-medium">
          {breadcrumbs.map((bc, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {bc.onClick ? (
                  <button
                    type="button"
                    onClick={bc.onClick}
                    className="hover:text-[#17181A] transition-colors focus:outline-none"
                  >
                    {bc.label}
                  </button>
                ) : (
                  <span className={isLast ? 'text-[#17181A] font-semibold' : ''}>{bc.label}</span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-[#8A8F98] shrink-0" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Title Row & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-[#17181A] font-sans">
              {title}
            </h1>
            {badge}
          </div>
          {contextInfo && <div className="mt-1.5">{contextInfo}</div>}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0 mt-1 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
