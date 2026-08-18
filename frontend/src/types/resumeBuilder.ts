export interface ResumeExperience {
  company: string;
  role: string;
  duration?: string;
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field?: string;
  duration?: string;
}

export interface TailoredResume {
  name: string;
  professional_summary: string;
  skills: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: string[];
}

export interface ResumeChange {
  section: string;
  original: string;
  optimized: string;
  reason: string;
}

export interface ResumeBuilderResult {
  resume: TailoredResume;
  ats_score: number | null;
  changes: ResumeChange[];
}

export interface ResumeBuilderResponse {
  status: string;
  resume_id: number;
  job_id: number;
  result: ResumeBuilderResult;
}

export interface SavedTailoredResume {
  resume_id: number;
  job_id: number;
  resume_data: TailoredResume;
  target_job_title?: string;
  target_company?: string;
  title?: string;
  saved_at: string;
}

export interface SaveResumeRequest {
  resume_id: number;
  job_id: number;
  resume_data: TailoredResume;
  target_job_title?: string;
  target_company?: string;
  title?: string;
}

export interface SaveResumeResponse {
  status: string;
  message: string;
  saved_resume: SavedTailoredResume;
}
