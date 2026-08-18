import { motion } from 'framer-motion'
import { Check, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react'

interface SkillChipsProps {
  matchingSkills: string[]
  missingSkills: string[]
}

export function SkillChips({ matchingSkills, missingSkills }: SkillChipsProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border-subtle">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">
            Skills Alignment & Gap Analysis
          </h3>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Verification of required technologies extracted from your resume vs job description
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-success-muted flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <h4 className="text-[13px] font-semibold text-text-primary">
                Matching Skills
              </h4>
              <span className="text-[12px] text-text-muted font-medium">
                ({matchingSkills.length})
              </span>
            </div>
            <span className="text-[11px] font-medium text-success flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Supported by resume
            </span>
          </div>

          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {matchingSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-[12px] font-medium
                    bg-success-muted text-success
                    border border-success/15
                  "
                >
                  <Check className="w-3 h-3 opacity-70" />
                  {skill}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-text-muted italic py-2">
              No matching skills identified.
            </p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-warning-muted flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-warning" />
              </div>
              <h4 className="text-[13px] font-semibold text-text-primary">
                Missing / Unverified Skills
              </h4>
              <span className="text-[12px] text-text-muted font-medium">
                ({missingSkills.length})
              </span>
            </div>
            <span className="text-[11px] font-medium text-warning flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Not found in resume
            </span>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {missingSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-[12px] font-medium
                    bg-warning-muted text-warning
                    border border-warning/20
                  "
                >
                  <AlertTriangle className="w-3 h-3 opacity-70" />
                  {skill}
                </motion.span>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-success-muted/50 border border-success/15 text-[13px] text-success font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              You cover all specified skill requirements.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
