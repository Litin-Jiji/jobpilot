import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, ArrowDown, Tag, Star, Sparkles, ShieldAlert } from 'lucide-react'
import type { ResumeOptimization as ResumeOptimizationType } from '../../types/application'

interface ResumeOptimizationProps {
  optimization: ResumeOptimizationType
}

export function ResumeOptimization({ optimization }: ResumeOptimizationProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedSummary, setCopiedSummary] = useState(false)

  const handleCopy = async (text: string, index?: number) => {
    await navigator.clipboard.writeText(text)
    if (index !== undefined) {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } else {
      setCopiedSummary(true)
      setTimeout(() => setCopiedSummary(false), 2000)
    }
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Resume Optimization
            </h3>
            <p className="text-[13px] text-text-secondary">
              AI-tailored enhancements aligned with this specific job's keywords and scoring criteria
            </p>
          </div>
        </div>
      </div>

      {/* Optimized Summary */}
      {optimization.optimized_summary && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Optimized Summary
            </span>
            <button
              onClick={() => handleCopy(optimization.optimized_summary)}
              className="
                inline-flex items-center gap-1.5 px-3 py-1 rounded-lg
                text-[12px] font-medium text-text-secondary
                hover:text-text-primary hover:bg-bg-hover
                transition-all duration-150 border border-border-default bg-bg-surface cursor-pointer
              "
              aria-label="Copy optimized summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-success" />
                  <span className="text-success font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 rounded-xl bg-bg-elevated/60 border border-border-subtle text-[14px] text-text-primary leading-relaxed font-normal">
            {optimization.optimized_summary}
          </div>
        </motion.div>
      )}

      {/* Optimized Experience Bullets */}
      {optimization.optimized_bullets && optimization.optimized_bullets.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Optimized Experience Bullets ({optimization.optimized_bullets.length})
            </span>
            <span className="text-[12px] text-text-muted">
              Quantified & ATS-aligned impact
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {optimization.optimized_bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border-default bg-bg-surface overflow-hidden shadow-2xs"
              >
                {/* Original Bullet */}
                <div className="p-4 bg-bg-elevated/40 border-b border-border-subtle">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Original
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    {bullet.original}
                  </p>
                </div>

                {/* Arrow Transition */}
                <div className="px-4 py-1.5 bg-bg-surface flex items-center justify-between text-text-muted">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                    <ArrowDown className="w-3 h-3" />
                    <span>Enhanced Version</span>
                  </div>
                  <button
                    onClick={() => handleCopy(bullet.optimized, i)}
                    className="
                      inline-flex items-center gap-1 px-2.5 py-1 rounded-md
                      text-[11px] font-medium text-text-secondary hover:text-text-primary
                      hover:bg-bg-hover transition-colors border-0 bg-transparent cursor-pointer
                    "
                    aria-label={`Copy bullet ${i + 1}`}
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check className="w-3 h-3 text-success" />
                        <span className="text-success font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Optimized Bullet */}
                <div className="p-4 bg-primary-subtle/40 border-t border-primary/10">
                  <p className="text-[14px] text-text-primary font-medium leading-relaxed">
                    {bullet.optimized}
                  </p>

                  {bullet.reason && (
                    <div className="mt-2.5 pt-2 border-t border-primary/10 flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[12px] text-text-secondary leading-normal italic">
                        {bullet.reason}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords & Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Keywords to Emphasize */}
        {optimization.keywords_to_emphasize && optimization.keywords_to_emphasize.length > 0 && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-bg-elevated/40 border border-border-subtle">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <h5 className="text-[13px] font-semibold text-text-primary">
                Keywords to Emphasize
              </h5>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {optimization.keywords_to_emphasize.map((kw) => (
                <span
                  key={kw}
                  className="
                    px-2.5 py-1 rounded-md text-[12px] font-medium
                    bg-primary-subtle text-primary
                    border border-primary/15
                  "
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills to Highlight */}
        {optimization.skills_to_highlight && optimization.skills_to_highlight.length > 0 && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-bg-elevated/40 border border-border-subtle">
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-success" />
              <h5 className="text-[13px] font-semibold text-text-primary">
                Skills to Highlight
              </h5>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {optimization.skills_to_highlight.map((skill) => (
                <span
                  key={skill}
                  className="
                    px-2.5 py-1 rounded-md text-[12px] font-medium
                    bg-success-muted text-success
                    border border-success/15
                  "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trust & Integrity Notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-bg-elevated/50 border border-border-subtle text-[12px] text-text-muted">
        <ShieldAlert className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-text-secondary font-medium">JobPilot Integrity Standard:</strong> Recommendations and keywords are suggested based on role fit. Only include skills and projects you have genuine experience with.
        </p>
      </div>
    </div>
  )
}
