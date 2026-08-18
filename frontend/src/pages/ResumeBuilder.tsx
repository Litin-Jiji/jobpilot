import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Download,
  FileText,
  Bookmark,
  Building2,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  X,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  generateTailoredResume,
  saveTailoredResume,
  getSavedTailoredResume,
} from '../api/resumeBuilder';
import { getApplications } from '../api/applications';
import type {
  TailoredResume,
  ResumeChange,
  ResumeBuilderResult,
} from '../types/resumeBuilder';
import type { ApplicationSummary } from '../types/application';
import { SectionNav, type ResumeSectionId } from '../components/resume-builder/SectionNav';
import { ResumePaper } from '../components/resume-builder/ResumePaper';
import { AiAssistantPanel } from '../components/resume-builder/AiAssistantPanel';
import { GenerationLoader } from '../components/resume-builder/GenerationLoader';
import { exportResumeToPdf } from '../utils/pdfExport';

export default function ResumeBuilder() {
  const { resumeId, jobId } = useParams<{
    resumeId?: string;
    jobId?: string;
  }>();
  const navigate = useNavigate();

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeBuilderResult | null>(null);
  const [resumeData, setResumeData] = useState<TailoredResume | null>(null);
  const [appliedIndices, setAppliedIndices] = useState<Set<number>>(new Set());
  const [dismissedIndices, setDismissedIndices] = useState<Set<number>>(new Set());

  // Refs for request deduplication & unmount protection
  const inFlightRef = useRef(false);
  const requestedPairRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Application details
  const [targetRoleTitle, setTargetRoleTitle] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [allApplications, setAllApplications] = useState<ApplicationSummary[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Active section & mobile drawer
  const [activeSection, setActiveSection] = useState<ResumeSectionId>('summary');
  const [mobileAiDrawerOpen, setMobileAiDrawerOpen] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setToast(null);
      }
    }, 3200);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // ─── Fetch / Generate Tailored Resume (with Guard) ───
  const fetchBuilderData = useCallback(async (rId: number, jId: number, force = false) => {
    const requestKey = `${rId}-${jId}`;

    // Request guard: prevent concurrent execution or duplicate fetch for same pair
    if (inFlightRef.current) {
      return;
    }
    if (!force && requestedPairRef.current === requestKey) {
      return;
    }

    inFlightRef.current = true;
    requestedPairRef.current = requestKey;
    setIsGenerating(true);
    setError(null);

    try {
      // Check if a saved tailored resume already exists in the database first
      const savedRes = await getSavedTailoredResume(rId, jId).catch(() => null);
      if (savedRes?.status === 'success' && savedRes.saved_resume) {
        if (isMountedRef.current) {
          setResumeData(savedRes.saved_resume.resume_data);
          setIsSaved(true);
        }
      }

      const response = await generateTailoredResume(rId, jId);
      if (isMountedRef.current) {
        if (response && response.result) {
          const generatedResume = response.result.resume;
          setResult(response.result);
          // If we haven't loaded a previously saved resume, populate generated resume
          setResumeData((prev) => prev || generatedResume);
        } else {
          throw new Error('Invalid response structure received from Resume Builder API.');
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        // Reset requested key so user can retry on error
        requestedPairRef.current = null;
        console.error('Resume Builder Error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Could not build your tailored resume. Please try again.',
        );
      }
    } finally {
      inFlightRef.current = false;
      if (isMountedRef.current) {
        setIsGenerating(false);
      }
    }
  }, []);

  // On Mount or params change
  useEffect(() => {
    if (resumeId && jobId) {
      const rId = Number(resumeId);
      const jId = Number(jobId);
      if (!isNaN(rId) && !isNaN(jId)) {
        fetchBuilderData(rId, jId);

        // Fetch application details to get target role title & company
        getApplications().then((res) => {
          if (!isMountedRef.current) return;
          const matchingApp = res.applications.find(
            (a) => a.resume_id === rId && a.job_id === jId,
          );
          if (matchingApp?.feedback?.job_profile) {
            setTargetRoleTitle(matchingApp.feedback.job_profile.job_title || '');
            setTargetCompany(matchingApp.feedback.job_profile.company || '');
          }
        }).catch(() => {});
      }
    } else {
      // No params: load available applications for selection
      setLoadingApps(true);
      getApplications()
        .then((res) => {
          if (isMountedRef.current) {
            setAllApplications(res.applications || []);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMountedRef.current) {
            setLoadingApps(false);
          }
        });
    }
  }, [resumeId, jobId, fetchBuilderData]);

  // ─── Save Resume Handler ───
  const handleSave = async () => {
    if (isSaving || isSaved || !resumeData || !resumeId || !jobId) return;

    const rId = Number(resumeId);
    const jId = Number(jobId);
    if (isNaN(rId) || isNaN(jId)) return;

    setIsSaving(true);
    try {
      await saveTailoredResume({
        resume_id: rId,
        job_id: jId,
        resume_data: resumeData,
        target_job_title: targetRoleTitle,
        target_company: targetCompany,
        title: `Tailored Resume for ${targetRoleTitle || 'Job'}`,
      });

      if (isMountedRef.current) {
        setIsSaved(true);
        showToast('Resume saved successfully', 'success');
      }
    } catch (err) {
      console.error('Save resume error:', err);
      if (isMountedRef.current) {
        showToast("Couldn't save resume. Try again.", 'error');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  // ─── Export PDF Handler ───
  const handleExportPdf = async () => {
    if (isExporting || !resumeData) return;

    setIsExporting(true);
    try {
      await exportResumeToPdf(resumeData, targetRoleTitle);
      if (isMountedRef.current) {
        showToast('PDF downloaded successfully', 'success');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      if (isMountedRef.current) {
        showToast("Couldn't generate PDF. Try again.", 'error');
      }
    } finally {
      if (isMountedRef.current) {
        setIsExporting(false);
      }
    }
  };

  // ─── Suggestion Handlers ───
  const handleApplySuggestion = (change: ResumeChange, index: number) => {
    if (!resumeData) return;

    const updated = { ...resumeData };
    const sec = change.section.toLowerCase();

    if (sec.includes('summary')) {
      updated.professional_summary = change.optimized;
    } else if (sec.includes('experience') || sec.includes('bullet') || sec.includes('work')) {
      // Find matching bullet or append
      let replaced = false;
      updated.experience = updated.experience.map((exp) => {
        const bullets = exp.bullets.map((b) => {
          if (change.original && (b.includes(change.original) || change.original.includes(b))) {
            replaced = true;
            return change.optimized;
          }
          return b;
        });
        return { ...exp, bullets };
      });

      if (!replaced && updated.experience.length > 0) {
        updated.experience[0].bullets[0] = change.optimized;
      }
    } else if (sec.includes('skill')) {
      // Add or update skills
      const newSkills = change.optimized
        .split(/[,•|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const combined = Array.from(new Set([...updated.skills, ...newSkills]));
      updated.skills = combined;
    } else if (sec.includes('project')) {
      if (updated.projects.length > 0) {
        updated.projects[0].description = change.optimized;
      }
    }

    setResumeData(updated);
    setIsSaved(false);
    setAppliedIndices((prev) => new Set([...prev, index]));
  };

  const handleDismissSuggestion = (index: number) => {
    setDismissedIndices((prev) => new Set([...prev, index]));
  };

  const handleApplyAllSuggestions = () => {
    if (!result || !resumeData) return;

    result.changes.forEach((change, i) => {
      if (!appliedIndices.has(i) && !dismissedIndices.has(i)) {
        handleApplySuggestion(change, i);
      }
    });
  };

  const handleScrollToSection = (sectionId: ResumeSectionId) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Section Counts
  const sectionCounts = useMemo(() => {
    if (!resumeData) return undefined;
    return {
      skills: resumeData.skills.length,
      experience: resumeData.experience.length,
      projects: resumeData.projects?.length || 0,
      education: resumeData.education?.length || 0,
      certifications: resumeData.certifications?.length || 0,
    };
  }, [resumeData]);

  // ─── 1. Empty State (No resumeId/jobId passed) ───
  if (!resumeId || !jobId) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-12">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-primary uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Resume Builder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">
          Choose a job opportunity to tailor your resume
        </h1>
        <p className="text-[14px] text-text-secondary mb-8">
          JobPilot will analyze your factual experience and rebuild your resume tailored to the target role.
        </p>

        {loadingApps ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-bg-surface border border-border-default rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : allApplications.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-bold text-text-muted uppercase tracking-wider mb-1">
              Select an analyzed application
            </h2>
            {allApplications.map((app) => {
              const jobTitle = app.feedback?.job_profile?.job_title || 'Untitled Role';
              const company = app.feedback?.job_profile?.company || 'Opportunity';
              const ats = app.feedback?.match_analysis?.ats_score ?? app.score;

              return (
                <button
                  key={app.id}
                  onClick={() => navigate(`/resume-builder/${app.resume_id}/${app.job_id}`)}
                  className="
                    group flex items-center justify-between p-4 sm:p-5 rounded-2xl
                    bg-bg-surface border border-border-default hover:border-primary/30 hover:shadow-xs
                    transition-all duration-150 text-left cursor-pointer w-full
                  "
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                        {jobTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-[13px] text-text-secondary mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-text-muted" />
                        <span>{company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {ats != null && (
                      <span className="text-[12px] font-semibold px-2.5 py-1 rounded-lg bg-bg-elevated text-text-secondary">
                        ATS {Math.round(ats)}
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-xl bg-bg-elevated flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-bg-surface border border-border-default rounded-3xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-subtle text-primary flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">
              No analyzed jobs found
            </h3>
            <p className="text-[14px] text-text-secondary max-w-sm mx-auto mb-6">
              Start by uploading your resume and analyzing your first job description.
            </p>
            <Link
              to="/analyze"
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                text-[14px] font-semibold text-white no-underline
                bg-primary hover:bg-primary-hover transition-colors shadow-2xs
              "
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze a Job</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // ─── 2. Generation / Loading State ───
  if (isGenerating) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-20 flex items-center justify-center min-h-[70vh]">
        <GenerationLoader />
      </div>
    );
  }

  // ─── 3. Error State ───
  if (error && !isGenerating) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-error-muted text-error flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Couldn't build your tailored resume
        </h2>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
          {error}
        </p>
        <button
          disabled={isGenerating}
          onClick={() => {
            if (!isGenerating && resumeId && jobId) {
              fetchBuilderData(Number(resumeId), Number(jobId), true);
            }
          }}
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            text-[14px] font-semibold text-white bg-primary hover:bg-primary-hover
            transition-colors shadow-2xs cursor-pointer border-0
            ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          <RotateCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Building Resume...' : 'Try Again'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-bg-primary">
      {/* ─── Top Workspace Bar ─── */}
      <header className="sticky top-14 z-40 bg-bg-surface/90 backdrop-blur-md border-b border-border-default px-4 sm:px-8 py-3">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4">
          {/* Back & Document Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors border-0 bg-transparent cursor-pointer flex-shrink-0"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px] font-bold text-text-primary tracking-tight truncate">
                  JobPilot Resume Builder
                </span>
                {targetRoleTitle && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-subtle px-2 py-0.5 rounded-md border border-primary/10 truncate max-w-[240px]">
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{targetRoleTitle}{targetCompany ? ` · ${targetCompany}` : ''}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile AI drawer toggle */}
            <button
              onClick={() => setMobileAiDrawerOpen(!mobileAiDrawerOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-primary bg-primary-subtle border border-primary/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            {/* Save Button */}
            <button
              disabled={isSaving || isSaved}
              onClick={handleSave}
              title={isSaved ? "Resume saved in database" : "Save tailored resume"}
              className={`
                inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                text-[13px] font-semibold transition-all duration-150 border cursor-pointer
                ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                    : isSaving
                    ? 'bg-bg-elevated text-text-muted border-border-default opacity-80 cursor-wait'
                    : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-elevated border-border-default shadow-2xs'
                }
              `}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-text-muted" />
                  <span>Save</span>
                </>
              )}
            </button>

            {/* Export PDF */}
            <button
              disabled={isExporting}
              onClick={handleExportPdf}
              title="Download tailored resume as A4 PDF"
              className={`
                inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                text-[13px] font-semibold transition-all duration-150 border cursor-pointer
                ${
                  isExporting
                    ? 'bg-primary/80 text-white border-transparent cursor-wait'
                    : 'bg-primary text-white hover:bg-primary-hover border-transparent shadow-xs'
                }
              `}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span className="hidden sm:inline">Generating PDF...</span>
                  <span className="sm:hidden">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main 3-Pane Workspace ─── */}
      <main className="flex-1 mx-auto max-w-[1440px] w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ─── LEFT PANEL (~220px / 2 cols on wide screens) ─── */}
          <div className="hidden lg:block lg:col-span-2 sticky top-32 p-4 rounded-2xl bg-bg-surface border border-border-default shadow-2xs">
            <SectionNav
              activeSection={activeSection}
              onSelectSection={handleScrollToSection}
              counts={sectionCounts}
            />
          </div>

          {/* ─── CENTER PREVIEW (Flexible / 7 cols) ─── */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {resumeData && (
              <ResumePaper
                resume={resumeData}
                onChange={(updated) => {
                  setResumeData(updated);
                  setIsSaved(false);
                }}
                targetJobTitle={targetRoleTitle}
              />
            )}
          </div>

          {/* ─── RIGHT PANEL (320px / 3 cols) ─── */}
          <div className="hidden lg:block lg:col-span-3 sticky top-32 p-5 rounded-2xl bg-bg-surface border border-border-default shadow-2xs">
            <AiAssistantPanel
              atsScore={result?.ats_score}
              changes={result?.changes || []}
              appliedIndices={appliedIndices}
              dismissedIndices={dismissedIndices}
              onApplySuggestion={handleApplySuggestion}
              onDismissSuggestion={handleDismissSuggestion}
              onApplyAllSuggestions={handleApplyAllSuggestions}
            />
          </div>
        </div>
      </main>

      {/* ─── Floating Toast Notification ─── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gray-900 text-white shadow-xl border border-white/10 text-[13px] font-medium transition-all duration-200">
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ─── Mobile / Tablet AI Assistant Drawer ─── */}
      {mobileAiDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm h-full bg-bg-surface p-5 overflow-y-auto flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <span className="text-[14px] font-bold text-text-primary">
                JobPilot AI Assistant
              </span>
              <button
                onClick={() => setMobileAiDrawerOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AiAssistantPanel
              atsScore={result?.ats_score}
              changes={result?.changes || []}
              appliedIndices={appliedIndices}
              dismissedIndices={dismissedIndices}
              onApplySuggestion={handleApplySuggestion}
              onDismissSuggestion={handleDismissSuggestion}
              onApplyAllSuggestions={handleApplyAllSuggestions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
