import { motion } from 'framer-motion'
import type { AnalysisResponse } from '../../types/application'
import { AgentActivityPanel } from './AgentActivityPanel'
import { DecisionSummary } from './DecisionSummary'
import { SkillChips } from './SkillChips'
import { ExperienceEducation } from './ExperienceEducation'
import { StrengthsWeaknesses } from './StrengthsWeaknesses'
import { Recommendations } from './Recommendations'
import { ResumeOptimization } from './ResumeOptimization'
import { FinalActionArea } from './FinalActionArea'
import { Briefcase, Building2, MapPin } from 'lucide-react'

interface AnalysisResultsProps {
  data: AnalysisResponse
  completedAt?: string
  resumeId?: number
  jobId?: number
}

export function AnalysisResults({
  data,
  completedAt,
  resumeId,
  jobId,
}: AnalysisResultsProps) {
  const { candidate_profile, job_profile, match_analysis, optimization } = data

  const matchingCount = match_analysis.matching_skills?.length || 0
  const missingCount = match_analysis.missing_skills?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 pb-12"
    >
      {/* ─── 1. Role Header ─── */}
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-primary uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>AI analysis completed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          {job_profile.job_title || 'Role Analysis'}
        </h1>
        <div className="flex items-center gap-4 text-[14px] text-text-secondary flex-wrap">
          {job_profile.company && (
            <span className="flex items-center gap-1.5 font-medium text-text-primary">
              <Building2 className="w-4 h-4 text-text-muted" />
              {job_profile.company}
            </span>
          )}
          {job_profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-text-muted" />
              {job_profile.location}
            </span>
          )}
          {job_profile.employment_type && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-text-muted" />
              {job_profile.employment_type}
            </span>
          )}
          {candidate_profile?.name && (
            <span className="text-text-muted">
              · Candidate: <strong className="text-text-secondary font-medium">{candidate_profile.name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* ─── 2. Multi-Agent Activity Panel ─── */}
      <AgentActivityPanel completedAt={completedAt} />

      {/* ─── 3. Decision Summary & Verdict (Should I apply?) ─── */}
      <DecisionSummary
        atsScore={match_analysis.ats_score || 0}
        overallMatchScore={match_analysis.overall_match_score || 0}
        matchingCount={matchingCount}
        missingCount={missingCount}
        summaryText={match_analysis.summary}
      />

      {/* ─── 4. Skills Alignment & Gap Analysis (Matching vs Missing) ─── */}
      <SkillChips
        matchingSkills={match_analysis.matching_skills || []}
        missingSkills={match_analysis.missing_skills || []}
      />

      {/* ─── 5. Experience & Education Match ─── */}
      <ExperienceEducation
        experienceMatch={match_analysis.experience_match || ''}
        educationMatch={match_analysis.education_match || ''}
      />

      {/* ─── 6. Strengths & Areas for Improvement ─── */}
      <StrengthsWeaknesses
        strengths={match_analysis.strengths || []}
        weaknesses={match_analysis.weaknesses || []}
      />

      {/* ─── 7. Strategic Recommendations ─── */}
      {match_analysis.recommendations && match_analysis.recommendations.length > 0 && (
        <Recommendations recommendations={match_analysis.recommendations} />
      )}

      {/* ─── 8. Targeted Resume Optimization ─── */}
      <ResumeOptimization optimization={optimization} />

      {/* ─── 9. Final Action Area ─── */}
      <FinalActionArea
        atsScore={match_analysis.ats_score || 0}
        overallMatchScore={match_analysis.overall_match_score || 0}
        jobTitle={job_profile.job_title || 'this role'}
        company={job_profile.company}
        resumeId={resumeId}
        jobId={jobId}
      />
    </motion.div>
  )
}
