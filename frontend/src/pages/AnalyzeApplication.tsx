import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowLeft, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ResumeUploader } from '../components/analysis/ResumeUploader'
import { JobDescriptionInput } from '../components/analysis/JobDescriptionInput'
import { AgentPipeline } from '../components/analysis/AgentPipeline'
import { AnalysisResults } from '../components/results/AnalysisResults'
import { analyzeApplication } from '../api/applications'
import type { AnalysisResponse } from '../types/application'

type ViewState = 'input' | 'processing' | 'results' | 'error'

export default function AnalyzeApplication() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [viewState, setViewState] = useState<ViewState>('input')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isApiComplete, setIsApiComplete] = useState(false)
  const [completedTime, setCompletedTime] = useState<string>('')

  const canSubmit = resumeFile && jobDescription.trim().length > 20

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile || !jobDescription.trim()) return

    setViewState('processing')
    setIsApiComplete(false)
    setError(null)

    try {
      const result = await analyzeApplication(resumeFile, jobDescription)

      if (result.status === 'error') {
        throw new Error('Analysis returned an error. Please check your resume and job description and try again.')
      }

      setAnalysisResult(result)
      setIsApiComplete(true)
      const now = new Date()
      setCompletedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

      // Smooth transition after agents indicate completion
      setTimeout(() => {
        setViewState('results')
      }, 1200)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'We encountered an issue during analysis. Please verify your files and try again.',
      )
      setViewState('error')
    }
  }, [resumeFile, jobDescription])

  const handleReset = () => {
    setResumeFile(null)
    setJobDescription('')
    setViewState('input')
    setAnalysisResult(null)
    setError(null)
    setIsApiComplete(false)
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <AnimatePresence mode="wait">
        {/* ─── 1. Input State ─── */}
        {viewState === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-8"
          >
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-[12px] font-medium mb-3 border border-primary/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multi-Agent Workspace</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 tracking-tight">
                Analyze Application
              </h1>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                Upload your resume and paste the target job description to run an in-depth compatibility and ATS analysis.
              </p>
            </div>

            {/* Two-Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Left Panel: Resume Dropzone */}
              <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <ResumeUploader
                  file={resumeFile}
                  onFileSelect={setResumeFile}
                />
              </div>

              {/* Right Panel: Job Description Input */}
              <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xs flex flex-col">
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </div>
            </div>

            {/* Main Action CTA */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={handleAnalyze}
                disabled={!canSubmit}
                className={`
                  group relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl
                  text-[15px] font-semibold border-0 cursor-pointer
                  transition-all duration-200
                  ${canSubmit
                    ? 'bg-primary text-white hover:bg-primary-hover shadow-[0_1px_3px_rgba(91,95,239,0.2),0_4px_12px_rgba(91,95,239,0.12)] hover:shadow-[0_1px_3px_rgba(91,95,239,0.3),0_6px_16px_rgba(91,95,239,0.18)]'
                    : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                  }
                `}
              >
                <Sparkles className={`w-4 h-4 ${canSubmit ? 'text-white/90' : ''}`} />
                <span>Analyze Application</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${canSubmit ? 'group-hover:translate-x-0.5' : ''}`} />
              </button>

              {!canSubmit && (
                <p className="text-[12px] text-text-muted">
                  {!resumeFile ? 'Upload a PDF resume' : 'Paste job description (at least 20 characters)'} to start analysis
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── 2. Processing State ─── */}
        {viewState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="py-12"
          >
            <AgentPipeline
              isProcessing={true}
              isComplete={isApiComplete}
            />
          </motion.div>
        )}

        {/* ─── 3. Results State ─── */}
        {viewState === 'results' && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Top Navigation / Breadcrumb */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-border-default">
              <button
                onClick={handleReset}
                className="
                  inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
                  text-[13px] font-medium text-text-secondary
                  hover:text-text-primary hover:bg-bg-surface hover:border-border-hover
                  transition-all duration-150 border border-border-default bg-bg-surface cursor-pointer
                "
              >
                <ArrowLeft className="w-4 h-4" />
                <span>New Analysis</span>
              </button>

              <Link
                to="/applications"
                className="
                  inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary
                  hover:text-primary transition-colors no-underline
                "
              >
                <span>View All Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <AnalysisResults data={analysisResult} completedAt={completedTime} />
          </motion.div>
        )}

        {/* ─── 4. Error State ─── */}
        {viewState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="py-16 max-w-md mx-auto flex flex-col items-center text-center bg-bg-surface border border-border-default rounded-2xl p-8 shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-error-muted text-error flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Analysis Failed
            </h2>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
              {error || 'We could not analyze this application. Please check your resume and job description and try again.'}
            </p>
            <button
              onClick={handleReset}
              className="
                inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                text-[14px] font-semibold text-white
                bg-primary hover:bg-primary-hover
                transition-colors border-0 cursor-pointer shadow-xs
              "
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
