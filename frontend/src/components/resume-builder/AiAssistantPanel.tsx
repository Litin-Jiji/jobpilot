import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  X,
  CheckCheck,
  Info,
  ArrowDown,
} from 'lucide-react';
import type { ResumeChange } from '../../types/resumeBuilder';

interface AiAssistantPanelProps {
  atsScore: number | null | undefined;
  changes: ResumeChange[];
  appliedIndices: Set<number>;
  dismissedIndices: Set<number>;
  onApplySuggestion: (change: ResumeChange, index: number) => void;
  onDismissSuggestion: (index: number) => void;
  onApplyAllSuggestions: () => void;
}

export function AiAssistantPanel({
  atsScore,
  changes,
  appliedIndices,
  dismissedIndices,
  onApplySuggestion,
  onDismissSuggestion,
  onApplyAllSuggestions,
}: AiAssistantPanelProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'applied'>('all');

  const getScoreTheme = (score: number | null | undefined) => {
    if (score == null) {
      return {
        text: 'text-text-muted',
        bg: 'bg-bg-elevated',
        border: 'border-border-default',
        label: 'Unscored',
      };
    }
    if (score >= 90) {
      return {
        text: 'text-success',
        bg: 'bg-success-muted',
        border: 'border-success/20',
        label: 'Excellent match',
      };
    }
    if (score >= 75) {
      return {
        text: 'text-primary',
        bg: 'bg-primary-subtle',
        border: 'border-primary/20',
        label: 'Good match',
      };
    }
    if (score >= 60) {
      return {
        text: 'text-warning',
        bg: 'bg-warning-muted',
        border: 'border-warning/20',
        label: 'Moderate match',
      };
    }
    return {
      text: 'text-error',
      bg: 'bg-error-muted',
      border: 'border-error/20',
      label: 'Needs optimization',
    };
  };

  const scoreTheme = getScoreTheme(atsScore);

  const pendingCount = changes.filter(
    (_, i) => !appliedIndices.has(i) && !dismissedIndices.has(i),
  ).length;

  const filteredChanges = changes.map((change, index) => ({ change, index })).filter(({ index }) => {
    const isApplied = appliedIndices.has(index);
    const isDismissed = dismissedIndices.has(index);
    if (filter === 'pending') return !isApplied && !isDismissed;
    if (filter === 'applied') return isApplied;
    return !isDismissed; // 'all' shows pending & applied, hides dismissed
  });

  return (
    <div className="w-full flex flex-col gap-5">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-text-primary leading-tight">
              ✦ JobPilot AI
            </h3>
            <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
              Tailoring your resume for this role
            </p>
          </div>
        </div>
      </div>

      {/* ─── ATS Score Card ─── */}
      <div
        className={`
          p-4 rounded-2xl border ${scoreTheme.bg} ${scoreTheme.border}
          flex items-center justify-between shadow-2xs transition-colors
        `}
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Tailored ATS Fit
          </span>
          <p className="text-[12px] font-semibold text-text-primary mt-0.5">
            {scoreTheme.label}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`text-3xl font-extrabold tabular-nums tracking-tight ${scoreTheme.text}`}
          >
            {atsScore != null ? Math.round(atsScore) : '—'}
          </span>
          <span className="text-[11px] font-medium text-text-muted block -mt-1">
            / 100
          </span>
        </div>
      </div>

      {/* ─── Suggestions Section ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-text-primary">
              AI Modifications
            </span>
            <span className="text-[10px] font-semibold bg-bg-elevated text-text-muted px-1.5 py-0.2 rounded-md">
              {changes.length}
            </span>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={onApplyAllSuggestions}
              className="
                inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                text-[11px] font-semibold text-primary bg-primary-subtle hover:bg-primary/15
                border border-primary/20 transition-all cursor-pointer shadow-2xs
              "
            >
              <CheckCheck className="w-3 h-3" />
              <span>Apply all ({pendingCount})</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        {changes.length > 0 && (
          <div className="flex items-center gap-1 p-0.5 bg-bg-elevated/70 rounded-lg text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 rounded-md font-medium transition-colors cursor-pointer text-center ${
                filter === 'all'
                  ? 'bg-bg-surface text-text-primary shadow-2xs font-semibold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              All ({changes.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 py-1 rounded-md font-medium transition-colors cursor-pointer text-center ${
                filter === 'pending'
                  ? 'bg-bg-surface text-text-primary shadow-2xs font-semibold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('applied')}
              className={`flex-1 py-1 rounded-md font-medium transition-colors cursor-pointer text-center ${
                filter === 'applied'
                  ? 'bg-bg-surface text-text-primary shadow-2xs font-semibold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Applied ({appliedIndices.size})
            </button>
          </div>
        )}

        {/* Suggestions List */}
        <div className="flex flex-col gap-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-0.5">
          <AnimatePresence mode="popLayout">
            {filteredChanges.length > 0 ? (
              filteredChanges.map(({ change, index }) => {
                const isApplied = appliedIndices.has(index);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`
                      p-3.5 rounded-xl border text-[13px] flex flex-col gap-2.5 transition-all
                      ${
                        isApplied
                          ? 'bg-success-muted/30 border-success/20'
                          : 'bg-bg-surface border-border-default shadow-2xs hover:border-border-hover'
                      }
                    `}
                  >
                    {/* Header: Section & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-elevated px-2 py-0.5 rounded-md">
                        {change.section || 'General'}
                      </span>

                      {isApplied ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-muted px-2 py-0.5 rounded-full border border-success/20">
                          <Check className="w-3 h-3" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onDismissSuggestion(index)}
                            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer border-0 bg-transparent"
                            title="Dismiss suggestion"
                            aria-label="Dismiss suggestion"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onApplySuggestion(change, index)}
                            className="
                              inline-flex items-center gap-1 px-2.5 py-1 rounded-md
                              text-[11px] font-semibold text-white bg-primary hover:bg-primary-hover
                              transition-colors cursor-pointer shadow-2xs border-0
                            "
                          >
                            <Check className="w-3 h-3" />
                            <span>Apply</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Original vs Optimized */}
                    <div className="space-y-1.5 text-[12px]">
                      {change.original && (
                        <div className="p-2 rounded-lg bg-bg-elevated/50 text-text-muted leading-relaxed line-through decoration-text-muted/60">
                          {change.original}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider pl-1">
                        <ArrowDown className="w-2.5 h-2.5" />
                        <span>JobPilot Suggestion</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-primary-subtle/50 text-text-primary font-medium leading-relaxed border border-primary/10">
                        {change.optimized}
                      </div>
                    </div>

                    {/* Reason */}
                    {change.reason && (
                      <div className="flex items-start gap-1.5 text-[11px] text-text-secondary italic pt-1 border-t border-border-subtle/50">
                        <Info className="w-3 h-3 text-text-muted flex-shrink-0 mt-0.5" />
                        <span>{change.reason}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-bg-elevated/40 rounded-xl border border-dashed border-border-default">
                <p className="text-[12px] text-text-muted">
                  {filter === 'applied'
                    ? 'No suggestions applied yet.'
                    : 'All suggestions have been addressed.'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
