import {
  FileText,
  Wrench,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
} from 'lucide-react';

export type ResumeSectionId =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications';

interface SectionNavProps {
  activeSection: ResumeSectionId;
  onSelectSection: (sectionId: ResumeSectionId) => void;
  counts?: {
    skills?: number;
    experience?: number;
    projects?: number;
    education?: number;
    certifications?: number;
  };
}

export function SectionNav({
  activeSection,
  onSelectSection,
  counts,
}: SectionNavProps) {
  const sections: {
    id: ResumeSectionId;
    label: string;
    icon: typeof FileText;
    count?: number;
  }[] = [
    {
      id: 'summary',
      label: 'Summary',
      icon: FileText,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Wrench,
      count: counts?.skills,
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      count: counts?.experience,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderGit2,
      count: counts?.projects,
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      count: counts?.education,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: Award,
      count: counts?.certifications,
    },
  ];

  return (
    <aside className="w-full flex flex-col gap-1">
      <div className="px-3 pb-2 mb-1 flex items-center justify-between border-b border-border-subtle">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
          Resume Sections
        </span>
        <span className="text-[10px] text-text-muted font-medium bg-bg-elevated px-1.5 py-0.5 rounded">
          {sections.length}
        </span>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Resume sections">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`
                group flex items-center justify-between w-full px-3 py-2 rounded-xl text-left
                text-[13px] font-medium transition-all duration-150 cursor-pointer border
                ${
                  isActive
                    ? 'bg-bg-surface text-primary border-primary/20 shadow-2xs font-semibold'
                    : 'bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-surface/80'
                }
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                />
                <span className="truncate">{section.label}</span>
              </div>

              {section.count !== undefined && section.count > 0 && (
                <span
                  className={`
                    text-[11px] font-mono px-1.5 py-0.2 rounded-md
                    ${
                      isActive
                        ? 'bg-primary-subtle text-primary font-bold'
                        : 'bg-bg-elevated text-text-muted group-hover:text-text-secondary'
                    }
                  `}
                >
                  {section.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
