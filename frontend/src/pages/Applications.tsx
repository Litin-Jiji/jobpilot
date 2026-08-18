import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Sparkles,
  Target,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  RotateCcw,
  LayoutList,
  LayoutGrid,
  FileText,
  X,
} from 'lucide-react';
import { getApplications } from '../api/applications';
import type { ApplicationSummary } from '../types/application';
import {
  ApplicationCard,
  ApplicationRowSkeleton,
} from '../components/applications/ApplicationCard';
import {
  MetricCard,
  MetricCardSkeleton,
} from '../components/applications/MetricCard';

type ScoreFilterType = 'all' | 'strong' | 'good' | 'moderate' | 'low';
type StatusFilterType = 'all' | 'Analyzed' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
type SortType = 'newest' | 'oldest' | 'highest-ats' | 'highest-match';

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [viewMode, setViewMode] = useState<'row' | 'card'>('row');

  const fetchApplicationsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplications();
      setApplications(res.applications || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while retrieving your applications.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicationsData();
  }, [fetchApplicationsData]);

  // ─── Dynamic Summary Metrics Calculation ───
  const metrics = useMemo(() => {
    const total = applications.length;

    let totalAts = 0;
    let atsCount = 0;
    let totalMatch = 0;
    let matchCount = 0;
    let strongMatches = 0;

    applications.forEach((app) => {
      const feedback = app.feedback;
      const atsScore =
        feedback?.match_analysis?.ats_score != null
          ? Number(feedback.match_analysis.ats_score)
          : app.score != null
          ? Number(app.score)
          : null;

      const matchScore =
        feedback?.match_analysis?.overall_match_score != null
          ? Number(feedback.match_analysis.overall_match_score)
          : null;

      if (atsScore != null && !isNaN(atsScore)) {
        totalAts += atsScore;
        atsCount++;
      }

      if (matchScore != null && !isNaN(matchScore)) {
        totalMatch += matchScore;
        matchCount++;
      }

      // Strong matches: overall match score >= 90 or ats >= 90
      const highestScore = Math.max(atsScore ?? 0, matchScore ?? 0);
      if (highestScore >= 90) {
        strongMatches++;
      }
    });

    const avgAts = atsCount > 0 ? Math.round(totalAts / atsCount) : 0;
    const avgMatch = matchCount > 0 ? Math.round(totalMatch / matchCount) : 0;

    return {
      total,
      avgAts: atsCount > 0 ? avgAts : '—',
      avgMatch: matchCount > 0 ? `${avgMatch}%` : '—',
      strongMatches,
    };
  }, [applications]);

  // ─── Filter & Search & Sort Logic ───
  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const feedback = app.feedback;
        const jobTitle = feedback?.job_profile?.job_title || '';
        const company = feedback?.job_profile?.company || '';
        const location = feedback?.job_profile?.location || '';

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matches =
            jobTitle.toLowerCase().includes(q) ||
            company.toLowerCase().includes(q) ||
            location.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          // Defaults to "Analyzed" for now
          const appStatus = 'Analyzed';
          if (appStatus !== statusFilter) return false;
        }

        // Score filter
        const atsScore =
          feedback?.match_analysis?.ats_score != null
            ? Number(feedback.match_analysis.ats_score)
            : app.score != null
            ? Number(app.score)
            : null;
        const matchScore =
          feedback?.match_analysis?.overall_match_score != null
            ? Number(feedback.match_analysis.overall_match_score)
            : null;

        const effectiveScore = matchScore ?? atsScore ?? 0;

        if (scoreFilter === 'strong') {
          if (effectiveScore < 90) return false;
        } else if (scoreFilter === 'good') {
          if (effectiveScore < 75 || effectiveScore >= 90) return false;
        } else if (scoreFilter === 'moderate') {
          if (effectiveScore < 60 || effectiveScore >= 75) return false;
        } else if (scoreFilter === 'low') {
          if (effectiveScore >= 60) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const getScores = (item: ApplicationSummary) => {
          const ats =
            item.feedback?.match_analysis?.ats_score != null
              ? Number(item.feedback.match_analysis.ats_score)
              : item.score != null
              ? Number(item.score)
              : 0;
          const match =
            item.feedback?.match_analysis?.overall_match_score != null
              ? Number(item.feedback.match_analysis.overall_match_score)
              : 0;
          return { ats, match };
        };

        if (sortBy === 'highest-ats') {
          return getScores(b).ats - getScores(a).ats;
        }
        if (sortBy === 'highest-match') {
          return getScores(b).match - getScores(a).match;
        }
        if (sortBy === 'oldest') {
          return a.id - b.id;
        }
        // Default: 'newest'
        return b.id - a.id;
      });
  }, [applications, search, scoreFilter, statusFilter, sortBy]);

  const hasActiveFilters =
    search.trim() !== '' || scoreFilter !== 'all' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearch('');
    setScoreFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      {/* ─── Top Header Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-[12px] font-semibold mb-2 border border-primary/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Applications Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Applications
          </h1>
          <p className="text-[14px] text-text-secondary mt-1 max-w-xl">
            Track, analyze, and improve every job application with JobPilot AI.
          </p>
        </div>

        <Link
          to="/analyze"
          className="
            inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
            text-[14px] font-semibold text-white no-underline
            bg-primary hover:bg-primary-hover
            shadow-[0_1px_3px_rgba(91,95,239,0.2),0_4px_12px_rgba(91,95,239,0.12)]
            hover:shadow-[0_1px_3px_rgba(91,95,239,0.3),0_6px_16px_rgba(91,95,239,0.18)]
            transition-all duration-150 self-start sm:self-auto cursor-pointer
          "
        >
          <Plus className="w-4 h-4" />
          <span>+ Analyze Job</span>
        </Link>
      </motion.div>

      {/* ─── Error State ─── */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 mb-8 rounded-2xl bg-bg-surface border border-error/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-error-muted text-error flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">
                Unable to load applications
              </h2>
              <p className="text-[13px] text-text-secondary mt-0.5">
                Something went wrong while retrieving your applications.
              </p>
            </div>
          </div>
          <button
            onClick={fetchApplicationsData}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-xl
              text-[13px] font-semibold text-text-primary bg-bg-elevated hover:bg-bg-hover
              border border-border-default transition-colors cursor-pointer
            "
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </motion.div>
      )}

      {/* ─── Summary Metrics ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
      >
        {loading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              label="Total Applications"
              value={metrics.total}
              subtext="Saved intelligence records"
              icon={<Layers className="w-4 h-4" />}
              accentColor="indigo"
            />
            <MetricCard
              label="Average ATS Score"
              value={metrics.avgAts}
              subtext="Optimization baseline"
              icon={<Target className="w-4 h-4" />}
              accentColor="green"
            />
            <MetricCard
              label="Average Match"
              value={metrics.avgMatch}
              subtext="Job fit alignment"
              icon={<Award className="w-4 h-4" />}
              accentColor="indigo"
            />
            <MetricCard
              label="Strong Matches"
              value={metrics.strongMatches}
              subtext="90%+ fit candidates"
              icon={<CheckCircle2 className="w-4 h-4" />}
              accentColor="green"
            />
          </>
        )}
      </motion.div>

      {/* ─── Filter & Search Control Center ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col gap-3.5 mb-6"
      >
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications by role, company, location..."
              className="
                w-full pl-10 pr-10 py-2.5 rounded-xl
                bg-bg-surface border border-border-default
                text-[14px] text-text-primary placeholder:text-text-muted
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                transition-all font-[inherit] shadow-2xs
              "
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="
                  w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl
                  bg-bg-surface border border-border-default
                  text-[13px] font-medium text-text-primary
                  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                  transition-all font-[inherit] cursor-pointer shadow-2xs appearance-none
                "
                aria-label="Sort applications"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest-ats">Highest ATS Score</option>
                <option value="highest-match">Highest Match Score</option>
              </select>
            </div>

            {/* Layout Toggle (Desktop) */}
            <div className="hidden md:flex items-center p-1 bg-bg-surface border border-border-default rounded-xl shadow-2xs">
              <button
                onClick={() => setViewMode('row')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'row'
                    ? 'bg-bg-elevated text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
                title="List View"
                aria-label="List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-bg-elevated text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap text-[13px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-text-muted text-[12px] font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              <span>Score:</span>
            </span>

            {[
              { id: 'all', label: 'All Scores' },
              { id: 'strong', label: '90+ Strong' },
              { id: 'good', label: '75–89 Good' },
              { id: 'moderate', label: '60–74 Moderate' },
              { id: 'low', label: 'Below 60 Low' },
            ].map((pill) => {
              const active = scoreFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setScoreFilter(pill.id as ScoreFilterType)}
                  className={`
                    px-3 py-1 rounded-lg font-medium text-[12px] transition-all cursor-pointer border
                    ${
                      active
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'bg-bg-surface text-text-secondary border-border-default hover:border-border-hover hover:text-text-primary'
                    }
                  `}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Status Filter Dropdown / Count */}
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-[12px] font-medium hidden sm:inline">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
              className="
                px-3 py-1 rounded-lg bg-bg-surface border border-border-default
                text-[12px] font-medium text-text-secondary cursor-pointer
                focus:outline-none focus:border-primary
              "
              aria-label="Filter by application status"
            >
              <option value="all">All Statuses</option>
              <option value="Analyzed">Analyzed</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="
                  inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                  text-[11px] font-semibold text-primary bg-primary-subtle hover:bg-primary/10
                  transition-colors cursor-pointer border border-primary/20
                "
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Applications List / Grid Display ─── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <ApplicationRowSkeleton />
          <ApplicationRowSkeleton />
          <ApplicationRowSkeleton />
          <ApplicationRowSkeleton />
        </div>
      ) : filteredAndSortedApplications.length > 0 ? (
        <div
          className={
            viewMode === 'card'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <ApplicationCard application={app} viewMode={viewMode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : applications.length === 0 ? (
        /* ─── Global Empty State ─── */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="
            flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center
            bg-bg-surface border border-border-default rounded-3xl shadow-2xs
          "
        >
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-subtle border border-primary/15 text-primary mb-5">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-2">
            No applications yet
          </h2>
          <p className="text-[14px] sm:text-[15px] text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
            Upload a resume and analyze your first job opportunity with JobPilot AI.
          </p>
          <Link
            to="/analyze"
            className="
              inline-flex items-center gap-2.5 px-6 py-3 rounded-xl
              text-[14px] font-semibold text-white no-underline
              bg-primary hover:bg-primary-hover
              shadow-[0_1px_3px_rgba(91,95,239,0.2),0_4px_12px_rgba(91,95,239,0.12)]
              hover:shadow-[0_1px_3px_rgba(91,95,239,0.3),0_6px_16px_rgba(91,95,239,0.18)]
              transition-all duration-150 cursor-pointer
            "
          >
            <Sparkles className="w-4 h-4 text-white/90" />
            <span>Analyze a Job</span>
          </Link>
        </motion.div>
      ) : (
        /* ─── Filter / Search Empty State ─── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            flex flex-col items-center justify-center py-16 px-6 text-center
            bg-bg-surface border border-border-default rounded-2xl shadow-2xs
          "
        >
          <div className="w-12 h-12 rounded-2xl bg-bg-elevated border border-border-default flex items-center justify-center text-text-muted mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">
            No matching applications found
          </h3>
          <p className="text-[14px] text-text-secondary max-w-sm mb-6">
            We couldn&apos;t find any applications matching your active search and filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="
              inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
              text-[13px] font-semibold text-text-primary bg-bg-elevated hover:bg-bg-hover
              border border-border-default transition-colors cursor-pointer
            "
          >
            <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
            <span>Clear Filters</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
