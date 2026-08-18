import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { getApplication } from '../api/applications'
import type { AnalysisResponse } from '../types/application'
import { AnalysisResults } from '../components/results/AnalysisResults'

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [resumeId, setResumeId] = useState<number | undefined>()
  const [jobId, setJobId] = useState<number | undefined>()

  useEffect(() => {
    if (!id) return

    getApplication(Number(id))
      .then((res) => {
        if (res.application.feedback) {
          setResumeId(res.application.resume_id)
          setJobId(res.application.job_id)
          setData({
            status: res.status,
            candidate_profile: res.application.feedback.candidate_profile,
            job_profile: res.application.feedback.job_profile,
            match_analysis: res.application.feedback.match_analysis,
            optimization: res.application.feedback.optimization,
          })
        } else {
          setError('No analysis record exists for this application.')
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : 'Failed to retrieve application details.',
        )
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      {/* Back Link */}
      <div className="pb-6 mb-6 border-b border-border-default flex items-center justify-between">
        <Link
          to="/applications"
          className="
            inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
            text-[13px] font-medium text-text-secondary no-underline
            hover:text-text-primary hover:bg-bg-surface hover:border-border-hover
            transition-all duration-150 border border-border-default bg-bg-surface
          "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Applications</span>
        </Link>

        <span className="text-[12px] font-medium text-text-muted">
          Record #{id}
        </span>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="flex flex-col gap-6">
          <div className="h-10 w-72 rounded-xl bg-bg-surface border border-border-default animate-pulse" />
          <div className="h-28 rounded-2xl bg-bg-surface border border-border-default animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 rounded-2xl bg-bg-surface border border-border-default animate-pulse" />
            <div className="h-32 rounded-2xl bg-bg-surface border border-border-default animate-pulse" />
          </div>
          <div className="h-48 rounded-2xl bg-bg-surface border border-border-default animate-pulse" />
        </div>
      )}

      {/* Error View */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center py-16 max-w-md mx-auto bg-bg-surface border border-border-default rounded-2xl p-8 shadow-xs"
        >
          <div className="w-12 h-12 rounded-2xl bg-error-muted text-error flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Unable to Load Application
          </h2>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
            {error}
          </p>
          <Link
            to="/applications"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              text-[14px] font-semibold text-white no-underline
              bg-primary hover:bg-primary-hover transition-colors shadow-xs
            "
          >
            Back to Applications
          </Link>
        </motion.div>
      )}

      {/* Complete Results View */}
      {data && !loading && (
        <AnalysisResults data={data} resumeId={resumeId} jobId={jobId} />
      )}
    </div>
  )
}
