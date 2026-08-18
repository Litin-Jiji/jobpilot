import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function GenerationLoader() {
  const [currentStep, setCurrentStep] = useState(2); // 0-indexed: 2 is "Tailoring your resume"

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 1500);
    const timer2 = setTimeout(() => setCurrentStep(3), 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { label: 'Resume analyzed & experience parsed' },
    { label: 'Job requirements & skill matrix aligned' },
    { label: 'Tailoring bullet points & professional summary' },
    { label: 'Final ATS optimization & keyword calibration' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="
        flex flex-col items-center justify-center p-8 sm:p-12 max-w-lg mx-auto
        bg-bg-surface border border-border-default rounded-3xl shadow-xs text-center
      "
    >
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-subtle border border-primary/20 text-primary mb-6">
        <Sparkles className="w-8 h-8 animate-pulse" />
        <div className="absolute -inset-1 rounded-2xl border border-primary/20 animate-ping opacity-25" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-2">
        Building your tailored resume
      </h2>
      <p className="text-[14px] text-text-secondary max-w-sm mb-8 leading-relaxed">
        JobPilot AI is aligning your factual career experience directly with the target job requirements.
      </p>

      {/* Steps List */}
      <div className="w-full max-w-sm flex flex-col gap-3 text-left">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                ${
                  isCurrent
                    ? 'bg-primary-subtle/60 border-primary/30 text-text-primary shadow-2xs'
                    : isDone
                    ? 'bg-bg-elevated/40 border-border-subtle text-text-secondary'
                    : 'bg-transparent border-transparent text-text-muted opacity-60'
                }
              `}
            >
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-[12px] flex-shrink-0 transition-colors
                  ${
                    isDone
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-bg-elevated text-text-muted border border-border-default'
                  }
                `}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <span
                className={`text-[13px] ${
                  isCurrent ? 'font-semibold text-text-primary' : 'font-normal'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
