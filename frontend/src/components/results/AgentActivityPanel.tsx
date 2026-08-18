import { Sparkles, Check, Brain, Search, GitCompare, Wand2 } from 'lucide-react'

interface AgentActivityPanelProps {
  completedAt?: string
}

const completedAgents = [
  {
    name: 'Resume Analyst',
    action: 'Resume parsed & structured',
    icon: Brain,
  },
  {
    name: 'Job Intelligence',
    action: 'Job requirements extracted',
    icon: Search,
  },
  {
    name: 'Match Analyst',
    action: 'Skills & experience compared',
    icon: GitCompare,
  },
  {
    name: 'Resume Optimizer',
    action: 'Resume improvements generated',
    icon: Wand2,
  },
]

export function AgentActivityPanel({ completedAt }: AgentActivityPanelProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-[13px] font-semibold text-text-primary">
            JobPilot Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[12px] font-medium text-text-secondary">
            {completedAt ? `Analysis complete · ${completedAt}` : 'Analysis complete'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {completedAgents.map((agent) => {
          const Icon = agent.icon
          return (
            <div
              key={agent.name}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-bg-elevated/50 border border-border-subtle"
            >
              <div className="w-6 h-6 rounded-md bg-success-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-success" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3 text-text-muted" />
                  <p className="text-[12px] font-semibold text-text-primary truncate">
                    {agent.name}
                  </p>
                </div>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                  {agent.action}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
