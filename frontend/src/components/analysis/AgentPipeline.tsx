import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Circle, Brain, Search, GitCompare, Wand2, Sparkles } from 'lucide-react'

type AgentStatus = 'waiting' | 'active' | 'completed'

interface Agent {
  id: string
  name: string
  description: string
  activeDescription: string
  icon: React.ElementType
}

const agents: Agent[] = [
  {
    id: 'resume',
    name: 'Resume Analyst',
    description: 'Resume parsed and structured',
    activeDescription: 'Extracting candidate profile & skills',
    icon: Brain,
  },
  {
    id: 'job',
    name: 'Job Intelligence Agent',
    description: 'Job requirements extracted',
    activeDescription: 'Parsing role requirements & criteria',
    icon: Search,
  },
  {
    id: 'match',
    name: 'Match Analyst',
    description: 'Skills and experience compared',
    activeDescription: 'Evaluating match scores & skill gaps',
    icon: GitCompare,
  },
  {
    id: 'optimize',
    name: 'Resume Optimizer',
    description: 'Resume improvements generated',
    activeDescription: 'Generating targeted bullet optimizations',
    icon: Wand2,
  },
]

const AGENT_DURATION = 2800

interface AgentPipelineProps {
  isProcessing: boolean
  isComplete: boolean
}

export function AgentPipeline({ isProcessing, isComplete }: AgentPipelineProps) {
  const [agentStates, setAgentStates] = useState<Record<string, AgentStatus>>(
    () => Object.fromEntries(agents.map((a) => [a.id, 'waiting' as AgentStatus])),
  )

  useEffect(() => {
    if (!isProcessing) {
      setAgentStates(Object.fromEntries(agents.map((a) => [a.id, 'waiting'])))
      return
    }

    const timeouts: ReturnType<typeof setTimeout>[] = []

    agents.forEach((agent, index) => {
      timeouts.push(
        setTimeout(() => {
          setAgentStates((prev) => ({ ...prev, [agent.id]: 'active' }))
        }, index * AGENT_DURATION),
      )

      if (index < agents.length - 1) {
        timeouts.push(
          setTimeout(() => {
            setAgentStates((prev) => ({ ...prev, [agent.id]: 'completed' }))
          }, (index + 1) * AGENT_DURATION),
        )
      }
    })

    return () => timeouts.forEach(clearTimeout)
  }, [isProcessing])

  useEffect(() => {
    if (isComplete) {
      setAgentStates(Object.fromEntries(agents.map((a) => [a.id, 'completed'])))
    }
  }, [isComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center max-w-lg mx-auto w-full"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-[12px] font-medium mb-3 border border-primary/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JobPilot Intelligence</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
          {isComplete ? 'Analysis Complete' : 'Analyzing Application'}
        </h2>
        <p className="text-[14px] text-text-secondary">
          {isComplete
            ? 'All specialized agents completed their tasks successfully.'
            : 'Coordinating 4 specialized AI agents to evaluate candidate fit.'}
        </p>
      </div>

      <div className="w-full bg-bg-surface border border-border-default rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col gap-1">
          {agents.map((agent, index) => {
            const status = agentStates[agent.id]
            const Icon = agent.icon
            return (
              <div key={agent.id}>
                <div
                  className={`
                    flex items-center gap-3.5 px-4 py-3.5 rounded-xl
                    transition-all duration-200
                    ${status === 'active' ? 'bg-primary-subtle border border-primary/15' : ''}
                    ${status === 'completed' ? 'bg-bg-elevated/60' : ''}
                  `}
                >
                  {/* Status Indicator */}
                  <div className="relative flex-shrink-0">
                    {status === 'completed' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        className="w-7 h-7 rounded-lg bg-success-muted flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-success" />
                      </motion.div>
                    )}
                    {status === 'active' && (
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      </div>
                    )}
                    {status === 'waiting' && (
                      <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center">
                        <Circle className="w-3 h-3 text-text-muted" />
                      </div>
                    )}
                  </div>

                  {/* Agent Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          status === 'completed'
                            ? 'text-success'
                            : status === 'active'
                              ? 'text-primary'
                              : 'text-text-muted'
                        }`}
                      />
                      <span
                        className={`text-[13px] font-semibold ${
                          status === 'completed'
                            ? 'text-text-primary'
                            : status === 'active'
                              ? 'text-primary'
                              : 'text-text-muted'
                        }`}
                      >
                        {agent.name}
                      </span>
                    </div>
                    <p
                      className={`text-[12px] mt-0.5 ml-6 ${
                        status === 'active'
                          ? 'text-text-secondary font-medium'
                          : 'text-text-muted'
                      }`}
                    >
                      {status === 'completed'
                        ? agent.description
                        : status === 'active'
                          ? agent.activeDescription
                          : 'Waiting...'}
                    </p>
                  </div>
                </div>

                {index < agents.length - 1 && (
                  <div className="ml-[29px] h-2.5 flex justify-start">
                    <div
                      className={`w-px transition-colors duration-300 ${
                        agentStates[agents[index + 1].id] !== 'waiting'
                          ? 'bg-border-hover'
                          : 'bg-border-subtle'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
