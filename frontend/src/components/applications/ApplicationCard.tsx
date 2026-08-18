import { Link } from 'react-router-dom';
import type { ApplicationSummary } from '../../types/application';
import { ScoreIndicator } from './ScoreIndicator';
import { StatusBadge } from './StatusBadge';
import {
  MapPin,
  Briefcase,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface ApplicationCardProps {
  application: ApplicationSummary;
  viewMode?: 'card' | 'row';
}

export function ApplicationCard({
  application,
  viewMode = 'card',
}: ApplicationCardProps) {
  const feedback = application.feedback;
  const jobProfile = feedback?.job_profile;
  const matchAnalysis = feedback?.match_analysis;

  const jobTitle = jobProfile?.job_title || 'Untitled Role';
  const company = jobProfile?.company || 'Company not specified';
  const location = jobProfile?.location || 'Remote / Flexible';
  const employmentType = jobProfile?.employment_type || 'Full Time';

  const atsScore =
    matchAnalysis?.ats_score != null
      ? Math.round(matchAnalysis.ats_score)
      : application.score != null
      ? Math.round(application.score)
      : null;

  const matchScore =
    matchAnalysis?.overall_match_score != null
      ? Math.round(matchAnalysis.overall_match_score)
      : null;

  // Single full-width row mode (for table-like views)
  if (viewMode === 'row') {
    return (
      <Link
        to={`/applications/${application.id}`}
        className="
          group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl
          bg-bg-surface border border-border-default
          hover:border-border-hover hover:shadow-xs hover:-translate-y-0.5
          transition-all duration-200 no-underline shadow-2xs
        "
      >
        {/* Role & Company Information */}
        <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-primary-subtle border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-semibold text-text-primary group-hover:text-primary transition-colors truncate max-w-full">
                {jobTitle}
              </h3>
              <span className="md:hidden">
                <StatusBadge status="Analyzed" size="sm" />
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[13px] text-text-secondary mt-0.5 flex-wrap">
              <span className="font-medium text-text-primary/90 truncate max-w-[200px]">
                {company}
              </span>
              <span className="text-text-muted hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-text-muted whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{location}</span>
              </div>
              <span className="text-text-muted hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-text-muted whitespace-nowrap">
                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{employmentType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scores, Status, and Arrow */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border-subtle">
          <div className="flex items-center gap-2">
            <ScoreIndicator score={atsScore} label="ATS" />
            {matchScore != null && (
              <ScoreIndicator score={matchScore} label="Match" suffix="%" />
            )}
          </div>

          <div className="hidden md:block">
            <StatusBadge status="Analyzed" size="sm" />
          </div>

          <div className="w-8 h-8 rounded-xl bg-bg-elevated flex items-center justify-center text-text-muted group-hover:bg-primary-subtle group-hover:text-primary transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    );
  }

  // Standard structured card layout (Dashboard & Grid views)
  return (
    <Link
      to={`/applications/${application.id}`}
      className="
        group flex flex-col justify-between p-5 rounded-2xl
        bg-bg-surface border border-border-default
        hover:border-border-hover hover:-translate-y-0.5 hover:shadow-xs
        transition-all duration-200 no-underline shadow-2xs h-full min-h-[165px]
      "
    >
      <div>
        {/* ─── 1. Card Header: Icon + Title/Company + Arrow ─── */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-primary-subtle border border-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className="text-[15px] font-semibold text-text-primary group-hover:text-primary transition-colors truncate leading-snug"
                title={jobTitle}
              >
                {jobTitle}
              </h3>
              <p
                className="text-[13px] text-text-secondary mt-0.5 truncate leading-tight font-normal"
                title={company}
              >
                {company}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-bg-elevated border border-border-default flex items-center justify-center text-text-muted group-hover:bg-primary-subtle group-hover:text-primary group-hover:border-primary/20 transition-all duration-200 flex-shrink-0">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </div>

        {/* ─── 2. Card Metadata: Location & Employment Type ─── */}
        <div className="flex items-center gap-2 text-[12px] text-text-muted flex-wrap mb-4">
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap bg-bg-elevated px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            <span className="truncate max-w-[140px] text-text-secondary">{location}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap bg-bg-elevated px-2.5 py-1 rounded-lg">
            <Briefcase className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            <span className="truncate max-w-[140px] text-text-secondary">{employmentType}</span>
          </div>
        </div>
      </div>

      {/* ─── 3. Card Footer: Scores & Status ─── */}
      <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ScoreIndicator score={atsScore} label="ATS" />
          {matchScore != null && (
            <ScoreIndicator score={matchScore} label="Match" suffix="%" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="Analyzed" size="sm" />
        </div>
      </div>
    </Link>
  );
}

export function ApplicationCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex flex-col justify-between h-full min-h-[165px] animate-pulse">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-bg-elevated flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-4 bg-bg-elevated rounded-md w-3/4" />
              <div className="h-3 bg-bg-elevated rounded-md w-1/2" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-bg-elevated flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-24 bg-bg-elevated rounded-lg" />
          <div className="h-6 w-28 bg-bg-elevated rounded-lg" />
        </div>
      </div>

      <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 bg-bg-elevated rounded-lg" />
          <div className="h-6 w-20 bg-bg-elevated rounded-lg" />
        </div>
        <div className="h-5 w-18 bg-bg-elevated rounded-full" />
      </div>
    </div>
  );
}

export function ApplicationRowSkeleton() {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-bg-elevated flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1 max-w-sm">
          <div className="h-4 bg-bg-elevated rounded-md w-3/4" />
          <div className="h-3 bg-bg-elevated rounded-md w-1/2" />
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="h-7 w-20 bg-bg-elevated rounded-lg" />
        <div className="h-7 w-20 bg-bg-elevated rounded-lg hidden sm:block" />
        <div className="h-6 w-18 bg-bg-elevated rounded-full hidden md:block" />
        <div className="w-8 h-8 rounded-xl bg-bg-elevated" />
      </div>
    </div>
  );
}
