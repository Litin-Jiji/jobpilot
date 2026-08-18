import type {
  AnalysisResponse,
  ApplicationDetailResponse,
  ApplicationsListResponse,
} from '../types/application';
import type { ResumeBuilderResponse } from '../types/resumeBuilder';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:8000`;
  }
  return 'http://127.0.0.1:8000';
};

const API_BASE = getApiBaseUrl();

/**
 * POST /api/applications/analyze-pdf
 * Uploads a resume PDF and job description for AI analysis.
 */
export async function analyzeApplication(
  resumeFile: File,
  jobDescription: string,
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_description', jobDescription);

  const response = await fetch(`${API_BASE}/api/applications/analyze-pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Analysis failed (${response.status}): ${errorBody}`,
    );
  }

  return response.json();
}

/**
 * GET /api/applications/
 * Retrieves all saved application analyses.
 */
export async function getApplications(): Promise<ApplicationsListResponse> {
  const response = await fetch(`${API_BASE}/api/applications/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch applications (${response.status})`);
  }

  return response.json();
}

/**
 * GET /api/applications/{id}
 * Retrieves a single application analysis by ID.
 */
export async function getApplication(
  id: number,
): Promise<ApplicationDetailResponse> {
  const response = await fetch(`${API_BASE}/api/applications/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Application not found');
    }
    throw new Error(`Failed to fetch application (${response.status})`);
  }

  return response.json();
}

/**
 * POST /api/resume-builder/generate?resume_id={resumeId}&job_id={jobId}
 * Generates an ATS-tailored resume based on existing analysis records.
 */
export async function generateTailoredResume(
  resumeId: number | string,
  jobId: number | string,
): Promise<ResumeBuilderResponse> {
  const rId = Number(resumeId);
  const jId = Number(jobId);

  if (isNaN(rId) || isNaN(jId)) {
    throw new Error(`Invalid parameters: resume_id=${resumeId}, job_id=${jobId}`);
  }

  const url = `${API_BASE}/api/resume-builder/generate?resume_id=${rId}&job_id=${jId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to generate tailored resume (${response.status}): ${errorBody}`,
    );
  }

  return response.json();
}

/**
 * POST /api/resume-builder/save
 * Persists the tailored resume in the database.
 */
export async function saveTailoredResume(
  request: import('../types/resumeBuilder').SaveResumeRequest,
): Promise<import('../types/resumeBuilder').SaveResumeResponse> {
  const url = `${API_BASE}/api/resume-builder/save`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to save tailored resume (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/**
 * GET /api/resume-builder/saved?resume_id={resumeId}&job_id={jobId}
 * Retrieves previously saved tailored resume.
 */
export async function getSavedTailoredResume(
  resumeId: number | string,
  jobId: number | string,
): Promise<{ status: string; saved_resume: import('../types/resumeBuilder').SavedTailoredResume | null }> {
  const url = `${API_BASE}/api/resume-builder/saved?resume_id=${resumeId}&job_id=${jobId}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get saved resume (${response.status})`);
  }

  return response.json();
}
