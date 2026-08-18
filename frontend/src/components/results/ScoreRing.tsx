import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScoreRingProps {
  score: number
  label: string
  verdictLabel?: string
  maxScore?: number
  suffix?: string
  delay?: number
}

export function ScoreRing({
  score,
  label,
  verdictLabel,
  maxScore = 100,
  suffix = '',
  delay = 0,
}: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100))
  const radius = 46
  const strokeWidth = 5
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage >= 80) return { stroke: '#16A34A', text: 'text-success', bg: 'bg-success-muted', label: 'Strong Fit' }
    if (percentage >= 60) return { stroke: '#D97706', text: 'text-warning', bg: 'bg-warning-muted', label: 'Moderate Fit' }
    return { stroke: '#DC2626', text: 'text-error', bg: 'bg-error-muted', label: 'Low Match' }
  }

  const color = getColor()
  const displayVerdict = verdictLabel || (percentage >= 85 ? 'Excellent' : percentage >= 75 ? 'Strong Match' : percentage >= 60 ? 'Good Potential' : 'Needs Optimization')

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000
      const start = performance.now()

      const animate = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setAnimatedScore(Math.round(eased * score))

        if (progress < 1) requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }, [score, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay / 1000 }}
      className="flex items-center gap-5 p-5 rounded-2xl bg-bg-surface border border-border-default shadow-xs"
    >
      <div className="relative w-[88px] h-[88px] flex-shrink-0">
        <svg viewBox="0 0 104 104" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="52"
            cy="52"
            r={radius}
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx="52"
            cy="52"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1.0,
              delay: delay / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-text-primary tabular-nums tracking-tight">
            {animatedScore}
            <span className="text-base font-semibold">{suffix}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </span>
        <span className={`text-[15px] font-semibold ${color.text} truncate`}>
          {displayVerdict}
        </span>
        <p className="text-[12px] text-text-secondary leading-snug">
          {percentage >= 80 ? 'Well aligned with role requirements' : percentage >= 60 ? 'Core requirements partially met' : 'Significant gaps in required skills'}
        </p>
      </div>
    </motion.div>
  )
}
