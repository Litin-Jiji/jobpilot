export interface ScoreIndicatorProps {
  score: number | null | undefined;
  label?: string;
  variant?: 'ring' | 'bar' | 'compact';
  suffix?: string;
  size?: 'sm' | 'md';
}

function getScoreTheme(score: number | null | undefined) {
  if (score == null) {
    return {
      text: 'text-text-muted',
      bg: 'bg-bg-elevated',
      border: 'border-border-default',
      ringColor: '#969696',
      barColor: 'bg-text-muted/40',
      label: 'N/A',
      category: 'Unscored',
    };
  }

  if (score >= 90) {
    return {
      text: 'text-success',
      bg: 'bg-success-muted',
      border: 'border-success/20',
      ringColor: '#16A34A',
      barColor: 'bg-success',
      label: 'Strong',
      category: '90+',
    };
  }

  if (score >= 75) {
    return {
      text: 'text-primary',
      bg: 'bg-primary-subtle',
      border: 'border-primary/20',
      ringColor: '#5B5FEF',
      barColor: 'bg-primary',
      label: 'Good',
      category: '75-89',
    };
  }

  if (score >= 60) {
    return {
      text: 'text-warning',
      bg: 'bg-warning-muted',
      border: 'border-warning/25',
      ringColor: '#D97706',
      barColor: 'bg-warning',
      label: 'Moderate',
      category: '60-74',
    };
  }

  return {
    text: 'text-error',
    bg: 'bg-error-muted',
    border: 'border-error/20',
    ringColor: '#DC2626',
    barColor: 'bg-error',
    label: 'Low',
    category: '<60',
  };
}

export function ScoreIndicator({
  score,
  label,
  variant = 'compact',
  suffix = '',
  size = 'md',
}: ScoreIndicatorProps) {
  const theme = getScoreTheme(score);
  const displayScore = score != null ? Math.round(score) : '—';
  const percentage = score != null ? Math.min(Math.max(score, 0), 100) : 0;

  if (variant === 'bar') {
    return (
      <div className="flex flex-col gap-1 w-full min-w-[90px]">
        <div className="flex items-center justify-between text-[11px]">
          {label && <span className="text-text-muted font-medium uppercase tracking-wider">{label}</span>}
          <span className={`font-semibold tabular-nums ${theme.text}`}>
            {displayScore}{suffix}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-bg-elevated overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${theme.barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'ring') {
    const radius = size === 'sm' ? 12 : 15;
    const strokeWidth = size === 'sm' ? 2.5 : 3;
    const sizePx = size === 'sm' ? 32 : 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="inline-flex items-center gap-2">
        <div className="relative inline-flex items-center justify-center" style={{ width: sizePx, height: sizePx }}>
          <svg className="transform -rotate-90" width={sizePx} height={sizePx}>
            <circle
              cx={sizePx / 2}
              cy={sizePx / 2}
              r={radius}
              stroke="var(--color-border-default)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={sizePx / 2}
              cy={sizePx / 2}
              r={radius}
              stroke={theme.ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <span
            className={`absolute font-bold tabular-nums ${theme.text} ${
              size === 'sm' ? 'text-[10px]' : 'text-[12px]'
            }`}
          >
            {displayScore}
          </span>
        </div>
        {label && (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
              {label}
            </span>
            <span className="text-[11px] font-medium text-text-secondary">
              {theme.label}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default compact pill indicator
  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border
        ${theme.bg} ${theme.border}
        transition-colors
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${theme.barColor}`} />
      <span className={`font-bold tabular-nums text-[13px] leading-none ${theme.text}`}>
        {displayScore}{suffix}
      </span>
      {label && (
        <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider leading-none">
          {label}
        </span>
      )}
    </div>
  );
}
