import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Bookmark, ArrowUpRight, Check } from 'lucide-react'
import { useState } from 'react'

interface FinalActionAreaProps {
  atsScore: number
  overallMatchScore: number
  jobTitle: string
  company?: string
  applicationUrl?: string
  resumeId?: number
  jobId?: number
}

export function FinalActionArea({
  atsScore,
  overallMatchScore,
  jobTitle,
  company,
  applicationUrl,
  resumeId,
  jobId,
}: FinalActionAreaProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleScrollToOptimization = () => {
    window.scrollTo({
      top: document.body.scrollHeight / 2,
      behavior: 'smooth',
    })
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl p-8 shadow-xs text-center flex flex-col items-center gap-5">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-[12px] font-semibold border border-primary/10">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Next Steps</span>
      </div>

      <div className="max-w-md">
        <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
          Ready to apply?
        </h3>
        <p className="text-[14px] text-text-secondary leading-relaxed">
          Your resume demonstrates a <strong className="text-text-primary font-semibold">{Math.round(atsScore)}% ATS compatibility</strong> and <strong className="text-text-primary font-semibold">{Math.round(overallMatchScore)}% role match</strong> for {jobTitle}{company ? ` at ${company}` : ''}.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
        {resumeId && jobId && (
          <Link
            to={`/resume-builder/${resumeId}/${jobId}`}
            className="
              inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
              text-[14px] font-semibold text-white no-underline
              bg-primary hover:bg-primary-hover
              shadow-[0_1px_3px_rgba(91,95,239,0.2),0_4px_12px_rgba(91,95,239,0.12)]
              hover:shadow-[0_1px_3px_rgba(91,95,239,0.3),0_6px_16px_rgba(91,95,239,0.18)]
              transition-all duration-200
            "
          >
            <Sparkles className="w-4 h-4 text-white/90" />
            <span>Build Tailored Resume</span>
          </Link>
        )}

        <button
          onClick={handleScrollToOptimization}
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            text-[13px] font-medium text-text-secondary
            bg-bg-surface border border-border-default hover:border-border-hover hover:text-text-primary
            transition-all duration-200 cursor-pointer
          "
        >
          <span>Review Optimization</span>
        </button>

        {applicationUrl ? (
          <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              text-[13px] font-medium text-text-secondary no-underline
              bg-bg-surface border border-border-default hover:border-border-hover hover:text-text-primary
              transition-all duration-200
            "
          >
            Apply to Job
            <ArrowUpRight className="w-4 h-4" />
          </a>
        ) : (
          <Link
            to="/analyze"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              text-[13px] font-medium text-text-secondary no-underline
              bg-bg-surface border border-border-default hover:border-border-hover hover:text-text-primary
              transition-all duration-200
            "
          >
            Analyze Another Job
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        <button
          onClick={handleSave}
          className="
            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
            text-[13px] font-medium text-text-muted hover:text-text-secondary
            hover:bg-bg-hover transition-colors border-0 bg-transparent cursor-pointer
          "
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-success" />
              <span className="text-success font-medium">Saved in History</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Saved in Database</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
