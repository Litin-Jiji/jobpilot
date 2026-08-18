import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Clock,
  Building2,
  AlertTriangle,
  RotateCcw,
  Activity,
  Zap,
} from 'lucide-react';
import { getApplications } from '../api/applications';
import type { ApplicationSummary } from '../types/application';
import { ScoreIndicator } from '../components/applications/ScoreIndicator';

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplications();
      setApplications(res.applications || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load dashboard intelligence data.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Greeting helper
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // ─── 1. Real KPI Overview Calculations ───
  const kpis = useMemo(() => {
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

  // ─── 2. Deterministic AI Insight Generator (from real DB data) ───
  const aiInsight = useMemo(() => {
    if (applications.length === 0) {
      return {
        text: 'Upload your resume and analyze job descriptions to generate AI-powered skill alignment diagnostics, ATS optimization strategies, and fit scoring.',
        badge: 'Ready for analysis',
        topAppId: null,
      };
    }

    let highestApp: ApplicationSummary | null = null;
    let highestScore = -1;
    const skillFrequency: Record<string, number> = {};

    applications.forEach((app) => {
      const match = app.feedback?.match_analysis?.overall_match_score ?? 0;
      if (match > highestScore) {
        highestScore = match;
        highestApp = app;
      }

      const matchingSkills = app.feedback?.match_analysis?.matching_skills || [];
      matchingSkills.forEach((s) => {
        const key = s.trim();
        skillFrequency[key] = (skillFrequency[key] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([skill]) => skill);

    const topJobTitle = highestApp
      ? (highestApp as ApplicationSummary).feedback?.job_profile?.job_title || 'AI Engineer'
      : 'target';

    if (topSkills.length > 0) {
      return {
        text: `Your strongest opportunities are ${topJobTitle} roles where your experience with ${topSkills.join(', ')} aligns closely with the requirements.`,
        badge: `${highestScore > 0 ? `${Math.round(highestScore)}% highest compatibility` : 'Calculated fit'}`,
        topAppId: highestApp ? (highestApp as ApplicationSummary).id : null,
      };
    }

    return {
      text: `Your profile has been evaluated across ${applications.length} applications. Review recommendations to optimize keyword density and tailored bullet points.`,
      badge: `${applications.length} evaluated roles`,
      topAppId: applications[0]?.id || null,
    };
  }, [applications]);

  // ─── 3. Top Opportunities (Top 3 by Match Score) ───
  const topOpportunities = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const matchA = a.feedback?.match_analysis?.overall_match_score ?? a.score ?? 0;
        const matchB = b.feedback?.match_analysis?.overall_match_score ?? b.score ?? 0;
        return matchB - matchA;
      })
      .slice(0, 3);
  }, [applications]);

  // ─── 4. Recent Activity (Chronological latest 4-5) ───
  const recentActivity = useMemo(() => {
    return [...applications]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }, [applications]);

  // ─── 5. Chart Time-Series Data (Chronological order) ───
  const chartData = useMemo(() => {
    const chronological = [...applications].sort((a, b) => a.id - b.id);
    return chronological.map((app, index) => {
      const ats =
        app.feedback?.match_analysis?.ats_score != null
          ? Math.round(app.feedback.match_analysis.ats_score)
          : app.score != null
          ? Math.round(app.score)
          : 0;
      const match =
        app.feedback?.match_analysis?.overall_match_score != null
          ? Math.round(app.feedback.match_analysis.overall_match_score)
          : ats;
      const title = app.feedback?.job_profile?.job_title || `App #${app.id}`;
      return {
        id: app.id,
        index: index + 1,
        title,
        ats,
        match,
      };
    });
  }, [applications]);

  // SVG Chart Geometry calculations
  const svgChart = useMemo(() => {
    if (chartData.length === 0) return null;

    const width = 460;
    const height = 150;
    const paddingLeft = 32;
    const paddingRight = 20;
    const paddingTop = 15;
    const paddingBottom = 25;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const points = chartData.map((d, i) => {
      const x =
        chartData.length > 1
          ? paddingLeft + (i / (chartData.length - 1)) * plotWidth
          : paddingLeft + plotWidth / 2;
      const yAts = paddingTop + (1 - d.ats / 100) * plotHeight;
      const yMatch = paddingTop + (1 - d.match / 100) * plotHeight;
      return { x, yAts, yMatch, data: d };
    });

    const atsPath = points.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.yAts.toFixed(1)}`,
      '',
    );
    const matchPath = points.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.yMatch.toFixed(1)}`,
      '',
    );

    const atsArea =
      points.length > 1
        ? `${atsPath} L ${points[points.length - 1].x.toFixed(1)},${(paddingTop + plotHeight).toFixed(1)} L ${points[0].x.toFixed(1)},${(paddingTop + plotHeight).toFixed(1)} Z`
        : '';
    const matchArea =
      points.length > 1
        ? `${matchPath} L ${points[points.length - 1].x.toFixed(1)},${(paddingTop + plotHeight).toFixed(1)} L ${points[0].x.toFixed(1)},${(paddingTop + plotHeight).toFixed(1)} Z`
        : '';

    return {
      width,
      height,
      points,
      atsPath,
      matchPath,
      atsArea,
      matchArea,
      paddingLeft,
      paddingTop,
      plotHeight,
      plotWidth,
    };
  }, [chartData]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      {/* ─── 1. Welcome Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {greeting}, Litin
          </h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Your AI-powered job search command center.
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

      {/* ─── Error Alert ─── */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 rounded-2xl bg-bg-surface border border-error/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-error-muted text-error flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-text-primary">
                Unable to load dashboard data
              </h2>
              <p className="text-[12px] text-text-secondary">
                Something went wrong while retrieving your application records.
              </p>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-[12px] font-semibold text-text-primary bg-bg-elevated hover:bg-bg-hover
              border border-border-default transition-colors cursor-pointer
            "
          >
            <RotateCcw className="w-3 h-3" />
            <span>Try again</span>
          </button>
        </motion.div>
      )}

      {/* ─── 2. KPI Overview (Simpler, compact cards) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
      >
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-bg-surface border border-border-default min-h-[96px] flex flex-col justify-between animate-pulse"
            >
              <div className="h-3 w-20 bg-bg-elevated rounded-md" />
              <div className="h-7 w-14 bg-bg-elevated rounded-lg my-1" />
              <div className="h-2.5 w-24 bg-bg-elevated rounded-md" />
            </div>
          ))
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-bg-surface border border-border-default hover:border-border-hover transition-colors shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Total Applications
                </span>
                <Layers className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight tabular-nums my-0.5">
                {kpis.total}
              </div>
              <span className="text-[11px] text-text-secondary">
                Analyzed so far
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface border border-border-default hover:border-border-hover transition-colors shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Average ATS Score
                </span>
                <Target className="w-3.5 h-3.5 text-success" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight tabular-nums my-0.5">
                {kpis.avgAts}
              </div>
              <span className="text-[11px] text-text-secondary">
                Across all applications
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface border border-border-default hover:border-border-hover transition-colors shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Average Match
                </span>
                <Award className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight tabular-nums my-0.5">
                {kpis.avgMatch}
              </div>
              <span className="text-[11px] text-text-secondary">
                Overall role compatibility
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface border border-border-default hover:border-border-hover transition-colors shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Strong Matches
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight tabular-nums my-0.5">
                {kpis.strongMatches}
              </div>
              <span className="text-[11px] text-text-secondary">
                90%+ match
              </span>
            </div>
          </>
        )}
      </motion.div>

      {/* ─── 3. JobPilot Insight (Prominent AI intelligence card) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="
          p-5 sm:p-6 mb-8 rounded-2xl bg-bg-surface border border-border-default
          relative overflow-hidden shadow-2xs hover:border-primary/20 transition-all duration-200
        "
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-subtle border border-primary/15 flex items-center justify-center text-primary">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[13px] font-bold tracking-tight text-text-primary">
              ✦ JobPilot Insight
            </span>
          </div>

          <span className="text-[11px] font-semibold text-primary bg-primary-subtle px-2.5 py-0.5 rounded-full self-start sm:self-auto border border-primary/10">
            {aiInsight.badge}
          </span>
        </div>

        <p className="text-[14px] text-text-secondary leading-relaxed max-w-3xl">
          {aiInsight.text}
        </p>

        {aiInsight.topAppId && (
          <div className="mt-3.5 pt-3 border-t border-border-subtle flex items-center justify-between">
            <span className="text-[12px] text-text-muted">
              Synthesized from active candidate skill graph & analysis evaluations
            </span>
            <Link
              to={`/applications/${aiInsight.topAppId}`}
              className="text-[12px] font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 no-underline transition-colors"
            >
              <span>Explore top match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </motion.div>

      {/* ─── 4. Performance Analytics (2-Column Grid: Left Chart, Right Pipeline) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8"
      >
        {/* LEFT: Application Performance Trend (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-bg-surface border border-border-default shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[14px] font-bold text-text-primary flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Application Performance</span>
              </h2>
              <p className="text-[12px] text-text-secondary">
                Quality progression across evaluated applications
              </p>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-medium text-text-secondary">Match</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="font-medium text-text-secondary">ATS</span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative w-full h-[160px] flex items-center justify-center my-2">
            {loading ? (
              <div className="w-full h-full bg-bg-elevated rounded-xl animate-pulse" />
            ) : svgChart && svgChart.points.length > 0 ? (
              <div className="w-full h-full relative">
                <svg
                  viewBox={`0 0 ${svgChart.width} ${svgChart.height}`}
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="matchGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5B5FEF" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#5B5FEF" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[100, 75, 50, 25, 0].map((val) => {
                    const y =
                      svgChart.paddingTop +
                      (1 - val / 100) * svgChart.plotHeight;
                    return (
                      <g key={val}>
                        <line
                          x1={svgChart.paddingLeft}
                          y1={y}
                          x2={svgChart.width - 20}
                          y2={y}
                          stroke="var(--color-border-default)"
                          strokeDasharray={val === 0 || val === 100 ? undefined : '3 3'}
                          strokeWidth="1"
                        />
                        <text
                          x={svgChart.paddingLeft - 6}
                          y={y + 3}
                          textAnchor="end"
                          fontSize="9"
                          fill="var(--color-text-muted)"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Areas */}
                  {svgChart.matchArea && (
                    <path d={svgChart.matchArea} fill="url(#matchGradient)" />
                  )}
                  {svgChart.atsArea && (
                    <path d={svgChart.atsArea} fill="url(#atsGradient)" />
                  )}

                  {/* Lines */}
                  {svgChart.matchPath && (
                    <path
                      d={svgChart.matchPath}
                      fill="none"
                      stroke="#5B5FEF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {svgChart.atsPath && (
                    <path
                      d={svgChart.atsPath}
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Interactive Points */}
                  {svgChart.points.map((p, i) => (
                    <g
                      key={p.data.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                      onClick={() => navigate(`/applications/${p.data.id}`)}
                    >
                      <circle
                        cx={p.x}
                        cy={p.yMatch}
                        r={hoveredPointIndex === i ? 5 : 3.5}
                        fill="#5B5FEF"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                      <circle
                        cx={p.x}
                        cy={p.yAts}
                        r={hoveredPointIndex === i ? 5 : 3}
                        fill="#16A34A"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        className="transition-all duration-150"
                      />
                      {/* X label */}
                      <text
                        x={p.x}
                        y={svgChart.height - 6}
                        textAnchor="middle"
                        fontSize="9"
                        fill={hoveredPointIndex === i ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
                        fontWeight={hoveredPointIndex === i ? 'bold' : 'normal'}
                      >
                        #{p.data.id}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Hover Tooltip Popup */}
                {hoveredPointIndex !== null && svgChart.points[hoveredPointIndex] && (
                  <div
                    className="
                      absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full
                      bg-text-primary text-text-inverse text-[11px] rounded-lg px-2.5 py-1.5
                      pointer-events-none shadow-md z-10 whitespace-nowrap
                    "
                  >
                    <p className="font-semibold text-white truncate max-w-[180px]">
                      {svgChart.points[hoveredPointIndex].data.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/80">
                      <span>Match: {svgChart.points[hoveredPointIndex].data.match}%</span>
                      <span>•</span>
                      <span>ATS: {svgChart.points[hoveredPointIndex].data.ats}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Activity className="w-6 h-6 text-text-muted mx-auto mb-1.5" />
                <p className="text-[12px] text-text-muted">
                  Perform analyses to visualize your score progression
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Application Pipeline (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-bg-surface border border-border-default shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[14px] font-bold text-text-primary flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" />
                <span>Application Pipeline</span>
              </h2>
              <p className="text-[12px] text-text-secondary">
                Lifecycle funnel stages
              </p>
            </div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-bg-elevated px-2 py-0.5 rounded-md">
              Lifecycle
            </span>
          </div>

          <div className="space-y-2.5 my-auto">
            {/* Stage: Analyzed (Active) */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary-subtle border border-primary/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[13px] font-semibold text-text-primary">
                  Analyzed
                </span>
              </div>
              <span className="text-[13px] font-bold text-primary tabular-nums">
                {applications.length}
              </span>
            </div>

            {/* Stage: Applied */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                <span className="text-[13px] font-medium text-text-muted">
                  Applied
                </span>
              </div>
              <span className="text-[13px] font-medium text-text-muted tabular-nums">
                —
              </span>
            </div>

            {/* Stage: Interview */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                <span className="text-[13px] font-medium text-text-muted">
                  Interview
                </span>
              </div>
              <span className="text-[13px] font-medium text-text-muted tabular-nums">
                —
              </span>
            </div>

            {/* Stage: Offer */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                <span className="text-[13px] font-medium text-text-muted">
                  Offer
                </span>
              </div>
              <span className="text-[13px] font-medium text-text-muted tabular-nums">
                —
              </span>
            </div>

            {/* Stage: Rejected */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                <span className="text-[13px] font-medium text-text-muted">
                  Rejected
                </span>
              </div>
              <span className="text-[13px] font-medium text-text-muted tabular-nums">
                —
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle text-right">
            <span className="text-[11px] text-text-muted italic">
              Application tracking coming soon
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── 5. Bottom Split: Top Opportunities & Recent Activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Top Opportunities (Compact Ranked Rows, 7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="lg:col-span-7 p-5 rounded-2xl bg-bg-surface border border-border-default shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[15px] font-bold text-text-primary flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary" />
                <span>Top Opportunities</span>
              </h2>
              <Link
                to="/applications"
                className="text-[12px] font-semibold text-primary hover:text-primary-hover no-underline inline-flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-[12px] text-text-secondary mb-4">
              Roles where JobPilot sees your strongest fit.
            </p>

            {loading ? (
              <div className="space-y-2.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-bg-elevated animate-pulse h-16"
                  />
                ))}
              </div>
            ) : topOpportunities.length > 0 ? (
              <div className="space-y-2">
                {topOpportunities.map((app, index) => {
                  const jobProfile = app.feedback?.job_profile;
                  const matchAnalysis = app.feedback?.match_analysis;
                  const title = jobProfile?.job_title || `Role #${app.id}`;
                  const company = jobProfile?.company || 'Company not specified';
                  const location = jobProfile?.location || 'Remote / Flexible';
                  const employmentType = jobProfile?.employment_type || 'Full Time';
                  const matchScore = matchAnalysis?.overall_match_score != null
                    ? Math.round(matchAnalysis.overall_match_score)
                    : null;
                  const atsScore = matchAnalysis?.ats_score != null
                    ? Math.round(matchAnalysis.ats_score)
                    : app.score != null
                    ? Math.round(app.score)
                    : null;

                  return (
                    <Link
                      key={app.id}
                      to={`/applications/${app.id}`}
                      className="
                        group flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl
                        bg-bg-primary hover:bg-bg-elevated border border-border-default
                        hover:border-border-hover transition-all duration-150 no-underline
                      "
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-primary-subtle text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          #{index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                            {title}
                          </h3>
                          <div className="flex items-center gap-2 text-[12px] text-text-secondary mt-0.5 truncate">
                            <span className="font-medium text-text-primary/80 truncate">
                              {company}
                            </span>
                            <span className="text-text-muted">•</span>
                            <span className="text-text-muted truncate">
                              {location} · {employmentType}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {matchScore != null && (
                          <ScoreIndicator score={matchScore} label="Match" suffix="%" size="sm" />
                        )}
                        <ScoreIndicator score={atsScore} label="ATS" size="sm" />
                        <div className="w-7 h-7 rounded-lg bg-bg-surface flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-primary-subtle transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-bg-elevated/40 rounded-xl border border-dashed border-border-default">
                <p className="text-[13px] text-text-muted">
                  No analyzed opportunities yet.
                </p>
                <Link
                  to="/analyze"
                  className="mt-2 text-[12px] font-semibold text-primary hover:underline inline-block"
                >
                  Analyze your first job →
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT: Recent Activity Timeline (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="lg:col-span-5 p-5 rounded-2xl bg-bg-surface border border-border-default shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[15px] font-bold text-text-primary flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>Recent Activity</span>
              </h2>
              <Link
                to="/applications"
                className="text-[12px] font-semibold text-primary hover:text-primary-hover no-underline inline-flex items-center gap-1 transition-colors"
              >
                <span>History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-[12px] text-text-secondary mb-4">
              Latest evaluations logged in your intelligence vault
            </p>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-bg-elevated rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="relative pl-3 border-l-2 border-border-subtle space-y-4">
                {recentActivity.map((app) => {
                  const jobProfile = app.feedback?.job_profile;
                  const matchAnalysis = app.feedback?.match_analysis;
                  const title = jobProfile?.job_title || `Analysis #${app.id}`;
                  const company = jobProfile?.company || 'Opportunity';
                  const ats = matchAnalysis?.ats_score != null
                    ? Math.round(matchAnalysis.ats_score)
                    : app.score != null
                    ? Math.round(app.score)
                    : '—';
                  const match = matchAnalysis?.overall_match_score != null
                    ? `${Math.round(matchAnalysis.overall_match_score)}%`
                    : '—';

                  return (
                    <Link
                      key={app.id}
                      to={`/applications/${app.id}`}
                      className="group relative block text-left no-underline"
                    >
                      {/* Timeline Dot */}
                      <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-bg-surface group-hover:scale-125 transition-transform" />

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                          Record #{app.id}
                        </span>
                        <span className="text-[11px] font-medium text-text-secondary">
                          ATS <strong className="text-text-primary font-semibold">{ats}</strong> · Match <strong className="text-text-primary font-semibold">{match}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-primary group-hover:text-primary transition-colors mt-0.5 truncate">
                        <span className="truncate">{title}</span>
                        <span className="text-text-muted font-normal">•</span>
                        <span className="text-text-secondary font-normal text-[12px] truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-text-muted flex-shrink-0" />
                          {company}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-bg-elevated/40 rounded-xl border border-dashed border-border-default">
                <p className="text-[13px] text-text-muted">
                  No activity recorded yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
