import { useState } from 'react';
import type {
  TailoredResume,
  ResumeExperience,
  ResumeProject,
  ResumeEducation,
} from '../../types/resumeBuilder';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';

interface ResumePaperProps {
  resume: TailoredResume;
  onChange: (updated: TailoredResume) => void;
  targetJobTitle?: string;
}

export function ResumePaper({
  resume,
  onChange,
  targetJobTitle,
}: ResumePaperProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Helper updates
  const updateSummary = (val: string) => {
    onChange({ ...resume, professional_summary: val });
  };

  const updateSkills = (skills: string[]) => {
    onChange({ ...resume, skills });
  };

  const updateExperience = (experience: ResumeExperience[]) => {
    onChange({ ...resume, experience });
  };

  const updateProjects = (projects: ResumeProject[]) => {
    onChange({ ...resume, projects });
  };

  const updateEducation = (education: ResumeEducation[]) => {
    onChange({ ...resume, education });
  };

  const updateCertifications = (certifications: string[]) => {
    onChange({ ...resume, certifications });
  };

  return (
    <div
      className="
        relative w-full max-w-[820px] mx-auto bg-white text-gray-900
        shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]
        border border-[#E5E3DE] rounded-sm
        p-8 sm:p-12 md:p-14
        transition-all duration-200 font-sans leading-relaxed
      "
      style={{ minHeight: '1050px' }}
    >
      {/* ─── 1. Header (Name, Title, Subtitle) ─── */}
      <header className="text-center pb-6 mb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-gray-900 mb-1 font-serif">
          {resume.name || 'Candidate Name'}
        </h1>

        <p className="text-[13px] sm:text-[14px] font-semibold text-primary uppercase tracking-widest mb-1.5">
          {targetJobTitle || 'AI Engineer & Software Specialist'}
        </p>
      </header>

      {/* ─── 2. Professional Summary ─── */}
      <section id="summary" className="mb-7 scroll-mt-6 group/section">
        <div className="flex items-center justify-between pb-1 mb-2 border-b border-gray-300">
          <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 font-serif">
            Professional Summary
          </h2>
          <button
            onClick={() =>
              setEditingSection(editingSection === 'summary' ? null : 'summary')
            }
            className="opacity-0 group-hover/section:opacity-100 text-[11px] font-medium text-primary hover:underline flex items-center gap-1 transition-opacity cursor-pointer border-0 bg-transparent"
          >
            {editingSection === 'summary' ? (
              <>
                <Check className="w-3 h-3 text-success" />
                <span>Done</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        {editingSection === 'summary' ? (
          <textarea
            value={resume.professional_summary}
            onChange={(e) => updateSummary(e.target.value)}
            rows={4}
            className="w-full p-2.5 text-[13.5px] leading-relaxed border border-primary/40 rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-[inherit]"
          />
        ) : (
          <p className="text-[13px] sm:text-[13.5px] text-gray-700 leading-relaxed text-justify">
            {resume.professional_summary ||
              'Add your tailored professional career summary here.'}
          </p>
        )}
      </section>

      {/* ─── 3. Skills ─── */}
      <section id="skills" className="mb-7 scroll-mt-6 group/section">
        <div className="flex items-center justify-between pb-1 mb-2.5 border-b border-gray-300">
          <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 font-serif">
            Technical & Core Skills
          </h2>
          <button
            onClick={() =>
              setEditingSection(editingSection === 'skills' ? null : 'skills')
            }
            className="opacity-0 group-hover/section:opacity-100 text-[11px] font-medium text-primary hover:underline flex items-center gap-1 transition-opacity cursor-pointer border-0 bg-transparent"
          >
            {editingSection === 'skills' ? (
              <>
                <Check className="w-3 h-3 text-success" />
                <span>Done</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        {editingSection === 'skills' ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={resume.skills.join(', ')}
              onChange={(e) =>
                updateSkills(
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              rows={2}
              placeholder="Comma separated skills (e.g. Python, FastAPI, Docker)"
              className="w-full p-2.5 text-[13px] border border-primary/40 rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-[inherit]"
            />
            <span className="text-[11px] text-gray-500">
              Separate skills with commas.
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-[13px] text-gray-800">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 font-medium"
              >
                <span>{skill}</span>
                {index < resume.skills.length - 1 && (
                  <span className="text-gray-400 font-normal">•</span>
                )}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ─── 4. Experience ─── */}
      <section id="experience" className="mb-7 scroll-mt-6 group/section">
        <div className="flex items-center justify-between pb-1 mb-3 border-b border-gray-300">
          <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 font-serif">
            Professional Experience
          </h2>
          <button
            onClick={() =>
              setEditingSection(
                editingSection === 'experience' ? null : 'experience',
              )
            }
            className="opacity-0 group-hover/section:opacity-100 text-[11px] font-medium text-primary hover:underline flex items-center gap-1 transition-opacity cursor-pointer border-0 bg-transparent"
          >
            {editingSection === 'experience' ? (
              <>
                <Check className="w-3 h-3 text-success" />
                <span>Done</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {resume.experience.map((exp, expIdx) => (
            <div key={expIdx} className="flex flex-col gap-1.5">
              {/* Role & Company Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[13.5px]">
                <div className="font-bold text-gray-900">
                  <span>{exp.role}</span>
                  <span className="text-gray-400 font-normal mx-1.5">|</span>
                  <span className="font-semibold text-gray-700">
                    {exp.company}
                  </span>
                </div>
                {exp.duration && (
                  <span className="text-[12px] font-medium text-gray-500 italic">
                    {exp.duration}
                  </span>
                )}
              </div>

              {/* Bullets */}
              <ul className="list-disc list-outside pl-4 space-y-1 text-[13px] text-gray-700 leading-relaxed">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>
                    {editingSection === 'experience' ? (
                      <div className="flex items-start gap-1 my-1">
                        <textarea
                          value={bullet}
                          onChange={(e) => {
                            const newExp = [...resume.experience];
                            newExp[expIdx].bullets[bIdx] = e.target.value;
                            updateExperience(newExp);
                          }}
                          rows={2}
                          className="flex-1 p-1.5 text-[12.5px] border border-gray-300 rounded focus:outline-none focus:border-primary font-[inherit]"
                        />
                        <button
                          onClick={() => {
                            const newExp = [...resume.experience];
                            newExp[expIdx].bullets.splice(bIdx, 1);
                            updateExperience(newExp);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 border-0 bg-transparent cursor-pointer"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span>{bullet}</span>
                    )}
                  </li>
                ))}
              </ul>

              {editingSection === 'experience' && (
                <button
                  onClick={() => {
                    const newExp = [...resume.experience];
                    newExp[expIdx].bullets.push('New impactful contribution');
                    updateExperience(newExp);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline self-start mt-1 border-0 bg-transparent cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add bullet</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. Projects ─── */}
      {resume.projects && resume.projects.length > 0 && (
        <section id="projects" className="mb-7 scroll-mt-6 group/section">
          <div className="flex items-center justify-between pb-1 mb-3 border-b border-gray-300">
            <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 font-serif">
              Key Projects
            </h2>
            <button
              onClick={() =>
                setEditingSection(
                  editingSection === 'projects' ? null : 'projects',
                )
              }
              className="opacity-0 group-hover/section:opacity-100 text-[11px] font-medium text-primary hover:underline flex items-center gap-1 transition-opacity cursor-pointer border-0 bg-transparent"
            >
              {editingSection === 'projects' ? (
                <>
                  <Check className="w-3 h-3 text-success" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {resume.projects.map((proj, pIdx) => (
              <div key={pIdx} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-[13.5px] text-gray-900">
                    {proj.name}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[11.5px] font-mono text-gray-600">
                      {proj.technologies.join(' · ')}
                    </span>
                  )}
                </div>

                {editingSection === 'projects' ? (
                  <textarea
                    value={proj.description}
                    onChange={(e) => {
                      const newProj = [...resume.projects];
                      newProj[pIdx].description = e.target.value;
                      updateProjects(newProj);
                    }}
                    rows={2}
                    className="w-full p-2 text-[12.5px] border border-gray-300 rounded focus:outline-none focus:border-primary font-[inherit]"
                  />
                ) : (
                  <p className="text-[13px] text-gray-700 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 6. Education ─── */}
      {resume.education && resume.education.length > 0 && (
        <section id="education" className="mb-7 scroll-mt-6 group/section">
          <div className="flex items-center justify-between pb-1 mb-3 border-b border-gray-300">
            <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 font-serif">
              Education
            </h2>
            <button
              onClick={() =>
                setEditingSection(
                  editingSection === 'education' ? null : 'education',
                )
              }
              className="opacity-0 group-hover/section:opacity-100 text-[11px] font-medium text-primary hover:underline flex items-center gap-1 transition-opacity cursor-pointer border-0 bg-transparent"
            >
              {editingSection === 'education' ? (
                <>
                  <Check className="w-3 h-3 text-success" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {resume.education.map((edu, eduIdx) => (
              <div
                key={eduIdx}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[13px]"
              >
                {editingSection === 'education' ? (
                  <div className="flex flex-wrap gap-2 w-full p-2 bg-gray-50 rounded border border-gray-200 my-1">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[eduIdx].degree = e.target.value;
                        updateEducation(newEdu);
                      }}
                      placeholder="Degree"
                      className="p-1 text-[12px] border border-gray-300 rounded flex-1 min-w-[120px]"
                    />
                    <input
                      type="text"
                      value={edu.field || ''}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[eduIdx].field = e.target.value;
                        updateEducation(newEdu);
                      }}
                      placeholder="Field of Study"
                      className="p-1 text-[12px] border border-gray-300 rounded flex-1 min-w-[120px]"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[eduIdx].institution = e.target.value;
                        updateEducation(newEdu);
                      }}
                      placeholder="Institution"
                      className="p-1 text-[12px] border border-gray-300 rounded flex-1 min-w-[140px]"
                    />
                    <input
                      type="text"
                      value={edu.duration || ''}
                      onChange={(e) => {
                        const newEdu = [...resume.education];
                        newEdu[eduIdx].duration = e.target.value;
                        updateEducation(newEdu);
                      }}
                      placeholder="Duration"
                      className="p-1 text-[12px] border border-gray-300 rounded w-28"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-bold text-gray-900">{edu.degree}</span>
                      {edu.field && (
                        <span className="text-gray-700"> in {edu.field}</span>
                      )}
                      <span className="text-gray-400 mx-1.5">•</span>
                      <span className="text-gray-700 font-medium">
                        {edu.institution}
                      </span>
                    </div>
                    {edu.duration && (
                      <span className="text-[12px] text-gray-500 italic">
                        {edu.duration}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 7. Certifications ─── */}
      {resume.certifications && resume.certifications.length > 0 && (
        <section id="certifications" className="scroll-mt-6 group/section">
          <div className="flex items-center justify-between pb-1 mb-2.5 border-b border-gray-300">
            <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 font-serif">
              Certifications & Credentials
            </h2>
            <button
              onClick={() =>
                setEditingSection(
                  editingSection === 'certifications' ? null : 'certifications',
                )
              }
              className="opacity-0 group-hover/section:opacity-100 text-[11px] font-medium text-primary hover:underline flex items-center gap-1 transition-opacity cursor-pointer border-0 bg-transparent"
            >
              {editingSection === 'certifications' ? (
                <>
                  <Check className="w-3 h-3 text-success" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          {editingSection === 'certifications' ? (
            <textarea
              value={resume.certifications.join('\n')}
              onChange={(e) =>
                updateCertifications(
                  e.target.value.split('\n').map((c) => c.trim()).filter(Boolean),
                )
              }
              rows={3}
              placeholder="One certification per line"
              className="w-full p-2.5 text-[12.5px] border border-primary/40 rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-[inherit]"
            />
          ) : (
            <ul className="list-disc list-outside pl-4 space-y-1 text-[13px] text-gray-700">
              {resume.certifications.map((cert, cIdx) => (
                <li key={cIdx}>{cert}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
