import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  trend?: string;
  accentColor?: 'indigo' | 'green' | 'amber' | 'neutral';
}

export function MetricCard({
  label,
  value,
  subtext,
  icon,
  accentColor = 'indigo',
}: MetricCardProps) {
  const accentClasses = {
    indigo: {
      iconBg: 'bg-primary-subtle border-primary/10 text-primary',
      border: 'hover:border-primary/20',
    },
    green: {
      iconBg: 'bg-success-muted border-success/15 text-success',
      border: 'hover:border-success/20',
    },
    amber: {
      iconBg: 'bg-warning-muted border-warning/20 text-warning',
      border: 'hover:border-warning/20',
    },
    neutral: {
      iconBg: 'bg-bg-elevated border-border-default text-text-secondary',
      border: 'hover:border-border-hover',
    },
  }[accentColor];

  return (
    <div
      className={`
        relative p-5 rounded-2xl bg-bg-surface border border-border-default
        ${accentClasses.border}
        transition-all duration-200 shadow-2xs hover:shadow-xs
        flex flex-col justify-between min-h-[120px]
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">
          {label}
        </span>
        <div
          className={`
            w-8 h-8 rounded-xl border flex items-center justify-center
            ${accentClasses.iconBg} transition-transform
          `}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary tabular-nums">
          {value}
        </span>
      </div>

      {subtext && (
        <p className="text-[12px] text-text-secondary mt-1 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-bg-surface border border-border-default min-h-[120px] flex flex-col justify-between animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-bg-elevated rounded-md" />
        <div className="w-8 h-8 rounded-xl bg-bg-elevated" />
      </div>
      <div className="h-8 w-16 bg-bg-elevated rounded-lg my-2" />
      <div className="h-3 w-32 bg-bg-elevated rounded-md" />
    </div>
  );
}
