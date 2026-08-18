import { motion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'

interface ExperienceEducationProps {
  experienceMatch: string
  educationMatch: string
}

export function ExperienceEducation({
  experienceMatch,
  educationMatch,
}: ExperienceEducationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Experience Match */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-bg-surface border border-border-default shadow-xs flex flex-col gap-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center text-primary">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-text-primary">
              Experience Match
            </h4>
            <span className="text-[11px] font-medium text-text-muted">
              Role seniority & domain relevance
            </span>
          </div>
        </div>
        <p className="text-[14px] text-text-secondary leading-relaxed pt-1">
          {experienceMatch || 'Experience evaluation details not available.'}
        </p>
      </motion.div>

      {/* Education Match */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-2xl bg-bg-surface border border-border-default shadow-xs flex flex-col gap-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center text-primary">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-text-primary">
              Education Match
            </h4>
            <span className="text-[11px] font-medium text-text-muted">
              Academic background & degree alignment
            </span>
          </div>
        </div>
        <p className="text-[14px] text-text-secondary leading-relaxed pt-1">
          {educationMatch || 'Education evaluation details not available.'}
        </p>
      </motion.div>
    </div>
  )
}
