export type ApplicationStatus =
  | 'Analyzed'
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

interface StatusBadgeProps {
  status?: ApplicationStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    label: string;
  }
> = {
  Analyzed: {
    bg: 'bg-primary-subtle',
    text: 'text-primary',
    border: 'border-primary/20',
    dot: 'bg-primary',
    label: 'Analyzed',
  },
  Applied: {
    bg: 'bg-bg-elevated',
    text: 'text-text-secondary',
    border: 'border-border-default',
    dot: 'bg-text-secondary',
    label: 'Applied',
  },
  Interview: {
    bg: 'bg-warning-muted',
    text: 'text-warning',
    border: 'border-warning/30',
    dot: 'bg-warning',
    label: 'Interview',
  },
  Offer: {
    bg: 'bg-success-muted',
    text: 'text-success',
    border: 'border-success/25',
    dot: 'bg-success',
    label: 'Offer',
  },
  Rejected: {
    bg: 'bg-error-muted',
    text: 'text-error',
    border: 'border-error/25',
    dot: 'bg-error',
    label: 'Rejected',
  },
};

export function StatusBadge({ status = 'Analyzed', size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Analyzed;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.bg} ${config.text} ${config.border}
        ${size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-[12px]'}
        transition-colors
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
