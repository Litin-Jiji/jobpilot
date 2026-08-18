import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Check } from 'lucide-react'

interface StrengthsWeaknessesProps {
  strengths: string[]
  weaknesses: string[]
}

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
}: StrengthsWeaknessesProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border-subtle">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">
            Candidate Profile Assessment
          </h3>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Key competitive strengths and areas to clarify or address
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-success-muted flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            </div>
            <h4 className="text-[14px] font-semibold text-text-primary">
              Demonstrated Strengths
            </h4>
            <span className="text-[12px] text-text-muted font-medium">
              ({strengths.length})
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {strengths.map((strength, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 text-[14px] text-text-secondary leading-[1.6] p-2.5 rounded-xl bg-bg-elevated/40"
              >
                <div className="w-4 h-4 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-2.5 h-2.5 text-success" />
                </div>
                <span>{strength}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weaknesses / Improvement Areas */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-warning-muted flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            </div>
            <h4 className="text-[14px] font-semibold text-text-primary">
              Areas for Improvement
            </h4>
            <span className="text-[12px] text-text-muted font-medium">
              ({weaknesses.length})
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {weaknesses.length > 0 ? (
              weaknesses.map((weakness, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 text-[14px] text-text-secondary leading-[1.6] p-2.5 rounded-xl bg-bg-elevated/40"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0 mt-2.5 ml-1 mr-0.5" />
                  <span>{weakness}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-[13px] text-text-muted italic p-3">
                No major application weaknesses identified.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
