// ─── Candidate Profile (from resume analysis) ───

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  duration: string;
}

export interface ProjectItem {
  name: string;
  technologies: string[];
  description: string[];
}

export interface CandidateProfile {
  name: string;
  professional_summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  languages: string[];
}

// ─── Job Profile (from JD analysis) ───

export interface JobProfile {
  job_title: string;
  company: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_required: string;
  responsibilities: string[];
  education_requirements: string[];
  location: string;
  employment_type: string;
}

// ─── Match Analysis ───

export interface MatchAnalysis {
  overall_match_score: number;
  ats_score: number;
  matching_skills: string[];
  missing_skills: string[];
  experience_match: string;
  education_match: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

// ─── Resume Optimization ───

export interface OptimizedBullet {
  original: string;
  optimized: string;
  reason: string;
}

export interface ResumeOptimization {
  optimized_summary: string;
  optimized_bullets: OptimizedBullet[];
  keywords_to_emphasize: string[];
  skills_to_highlight: string[];
  recommendations: string[];
  ats_improvements: string[];
}

// ─── API Responses ───

export interface AnalysisResponse {
  status: string;
  candidate_profile: CandidateProfile;
  job_profile: JobProfile;
  match_analysis: MatchAnalysis;
  optimization: ResumeOptimization;
}

export interface ApplicationSummary {
  id: number;
  resume_id: number;
  job_id: number;
  score: number | null;
  feedback: {
    candidate_profile: CandidateProfile;
    job_profile: JobProfile;
    match_analysis: MatchAnalysis;
    optimization: ResumeOptimization;
  } | null;
}

export interface ApplicationDetailResponse {
  status: string;
  application: ApplicationSummary;
}

export interface ApplicationsListResponse {
  status: string;
  count: number;
  applications: ApplicationSummary[];
}
