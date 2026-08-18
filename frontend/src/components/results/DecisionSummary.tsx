import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ScoreRing } from './ScoreRing'

interface DecisionSummaryProps {
  atsScore: number
  overallMatchScore: number
  matchingCount: number
  missingCount: number
  summaryText?: string
}

export function DecisionSummary({
  atsScore,
  overallMatchScore,
  matchingCount,
  missingCount,
  summaryText,
}: DecisionSummaryProps) {
  // Determine verdict based on scores
  const isStrong = overallMatchScore >= 75 && atsScore >= 75
  const isModerate = overallMatchScore >= 60 || atsScore >= 60

  const verdictTitle = isStrong
    ? 'Strong candidate for this role.'
    : isModerate
      ? 'Viable candidate with targeted improvements needed.'
      : 'Significant alignment gaps identified for this role.'

  const verdictSubtitle = `${matchingCount} requirement${matchingCount === 1 ? '' : 's'} matched · ${missingCount} gap${missingCount === 1 ? '' : 's'} identified`

  return (
    <div className="flex flex-col gap-4">
      {/* Top Verdict Banner */}
      <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isStrong ? 'bg-success-muted text-success' : isModerate ? 'bg-warning-muted text-warning' : 'bg-error-muted text-error'
          }`}>
            {isStrong ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                JobPilot Verdict
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              {verdictTitle}
            </h3>
            <p className="text-[13px] text-text-secondary mt-0.5">
              {verdictSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto pt-2 md:pt-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium ${
            isStrong ? 'bg-success-muted text-success' : isModerate ? 'bg-warning-muted text-warning' : 'bg-error-muted text-error'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isStrong ? 'bg-success' : isModerate ? 'bg-warning' : 'bg-error'}`} />
            {isStrong ? 'Recommended to Apply' : isModerate ? 'Optimize Before Applying' : 'High Competition Gap'}
          </span>
        </div>
      </div>

      {/* Two Score Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreRing
          score={Math.round(atsScore)}
          label="ATS Compatibility Score"
          verdictLabel={atsScore >= 85 ? 'Excellent ATS Fit' : atsScore >= 70 ? 'Good ATS Fit' : 'ATS Needs Work'}
          delay={100}
        />
        <ScoreRing
          score={Math.round(overallMatchScore)}
          label="Overall Role Match"
          suffix="%"
          verdictLabel={overallMatchScore >= 80 ? 'Strong Match' : overallMatchScore >= 60 ? 'Moderate Match' : 'Low Match'}
          delay={250}
        />
      </div>

      {/* Editorial Summary if provided */}
      {summaryText && (
        <div className="bg-bg-surface border border-border-default rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-2">
            Executive Summary
          </span>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            {summaryText}
          </p>
        </div>
      )}
    </div>
  )
}
