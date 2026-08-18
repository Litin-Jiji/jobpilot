import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

interface RecommendationsProps {
  recommendations: string[]
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations.length) return null

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-subtle flex items-center justify-center text-primary">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-text-primary">
              How to improve this application
            </h3>
            <p className="text-[12px] text-text-secondary mt-0.5">
              Actionable strategic steps to maximize interview conversion
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="
              flex items-start gap-4 p-4 rounded-xl
              bg-bg-elevated/50 border border-border-subtle hover:border-border-default
              transition-colors duration-150
            "
          >
            <span className="
              flex-shrink-0 w-7 h-7 rounded-lg
              bg-primary-subtle text-primary border border-primary/10
              flex items-center justify-center
              text-[12px] font-bold tabular-nums
            ">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[14px] text-text-primary font-medium leading-relaxed">
                {rec}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
