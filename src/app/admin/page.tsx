'use client';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

import { teams as initialTeams, matches as initialMatches, standings as initialStandings, Team, Match } from '@/data/leagueData';
import { dispatchLeagueConfigUpdate } from '@/lib/leagueConfig';

const GROUPS = ['A', 'B', 'C', 'D'];

const DEFAULT_LOGO = 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop&crop=center';

type MatchStatus = 'upcoming' | 'live' | 'completed' | 'postponed';

interface MatchFormData {
  id: string;
  homeScore: string;
  awayScore: string;
  status: MatchStatus;
  homeGoalScorers: string;
  awayGoalScorers: string;
}

interface TeamFormData {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  city: string;
  group: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

interface Fixture {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  group: string;
  matchDay: number;
  stage: string;
}

interface FixtureFormData {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  group: string;
  matchDay: string;
  stage: string;
}

const emptyForm = (): TeamFormData => ({
  id: '',
  name: '',
  shortName: '',
  abbreviation: '',
  city: '',
  group: 'A',
  logo: DEFAULT_LOGO,
  primaryColor: '#003366',
  secondaryColor: '#FFFFFF',
});

const emptyFixtureForm = (group: string): FixtureFormData => ({
  id: '',
  homeTeamId: '',
  awayTeamId: '',
  date: '',
  time: '15:30',
  venue: '',
  group,
  matchDay: '1',
  stage: 'group',
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 20);
}

const STATUS_LABELS: Record<MatchStatus, string> = {
  upcoming: 'Akan Datang',
  live: 'Berlangsung',
  completed: 'Selesai',
  postponed: 'Ditunda',
};

const STATUS_COLORS: Record<MatchStatus, string> = {
  upcoming: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  live: 'text-green-400 bg-green-400/10 border-green-400/30',
  completed: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
  postponed: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
};

const STAGE_LABELS: Record<string, string> = {
  group: 'Fase Grup',
  r16: 'Knock Out',
  qf: 'Perempat Final',
  sf: 'Semi Final',
  final: 'Final',
};

const STAGE_OPTIONS = [
  { value: 'group', label: 'Fase Grup' },
  { value: 'r16', label: 'Knock Out' },
  { value: 'qf', label: 'Perempat Final' },
  { value: 'sf', label: 'Semi Final' },
  { value: 'final', label: 'Final' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'teams' | 'matches' | 'fixtures' | 'config'>('dashboard');

  // --- Teams state ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>('A');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamFormData>(emptyForm());
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // --- Reset competition state ---
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);
  const [resetAllStep, setResetAllStep] = useState(0);

  // --- Matches state ---
  const [matches, setMatches] = useState<(Match & { homeGoalScorers?: string; awayGoalScorers?: string })[]>([]);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [matchForm, setMatchForm] = useState<MatchFormData | null>(null);
  const [matchSaved, setMatchSaved] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('group');

  // --- Fixtures state ---
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [activeFixtureGroup, setActiveFixtureGroup] = useState<string>('A');
  const [showFixtureForm, setShowFixtureForm] = useState(false);
  const [editingFixtureId, setEditingFixtureId] = useState<string | null>(null);
  const [fixtureForm, setFixtureForm] = useState<FixtureFormData>(emptyFixtureForm('A'));
  const [fixtureSaved, setFixtureSaved] = useState(false);
  const [deleteFixtureConfirm, setDeleteFixtureConfirm] = useState<string | null>(null);

  // --- League Config state ---
  interface LeagueConfig {
    leagueName: string;
    season: string;
    organizer: string;
    description: string;
    // Tournament rules
    pointsWin: string;
    pointsDraw: string;
    pointsLoss: string;
    teamsAdvancePerGroup: string;
    tiebreaker: string;
    // Group structure
    numberOfGroups: string;
    teamsPerGroup: string;
    groupNames: string;
    // Match regulations
    matchDuration: string;
    extraTime: string;
    penaltyShootout: string;
    maxSubstitutions: string;
    venue: string;
    additionalRules: string;
  }

  const defaultConfig: LeagueConfig = {
    leagueName: 'Kanzler eFootball League',
    season: '2026',
    organizer: 'Kanzler Organization',
    description: 'Kompetisi eFootball bergengsi yang mempertemukan tim-tim terbaik.',
    pointsWin: '3',
    pointsDraw: '1',
    pointsLoss: '0',
    teamsAdvancePerGroup: '2',
    tiebreaker: 'Selisih gol, gol terbanyak, head-to-head',
    numberOfGroups: '4',
    teamsPerGroup: '4',
    groupNames: 'A, B, C, D',
    matchDuration: '90',
    extraTime: 'Ya (2x15 menit)',
    penaltyShootout: 'Ya (jika imbang setelah extra time)',
    maxSubstitutions: '5',
    venue: 'Virtual Stadium',
    additionalRules: '',
  };

  const [leagueConfig, setLeagueConfig] = useState<LeagueConfig>(defaultConfig);
  const [configSaved, setConfigSaved] = useState(false);
  const [configDirty, setConfigDirty] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_league_config');
    if (stored) {
      try { setLeagueConfig({ ...defaultConfig, ...JSON.parse(stored) }); } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleConfigChange(field: keyof LeagueConfig, value: string) {
    setLeagueConfig(prev => ({ ...prev, [field]: value }));
    setConfigDirty(true);
  }

  function handleConfigSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem('admin_league_config', JSON.stringify(leagueConfig));
    dispatchLeagueConfigUpdate();
    setConfigSaved(true);
    setConfigDirty(false);
    setTimeout(() => setConfigSaved(false), 2500);
  }

  function handleConfigReset() {
    setLeagueConfig(defaultConfig);
    localStorage.removeItem('admin_league_config');
    dispatchLeagueConfigUpdate();
    setConfigDirty(false);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  }

  // --- Login state ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('admin_teams');
    if (stored) {
      try { setTeams(JSON.parse(stored)); } catch { setTeams(initialTeams); }
    } else {
      setTeams(initialTeams);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('admin_matches');
    if (stored) {
      try { setMatches(JSON.parse(stored)); } catch { setMatches(initialMatches); }
    } else {
      setMatches(initialMatches);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('admin_fixtures');
    if (stored) {
      try { setFixtures(JSON.parse(stored)); } catch { setFixtures([]); }
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const validUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (loginUsername === validUser && loginPassword === validPass) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Username atau password salah.');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Masuk untuk mengelola data liga</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Masukkan username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Masukkan password"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Teams helpers ---
  const persistTeams = (updated: Team[]) => {
    setTeams(updated);
    localStorage.setItem('admin_teams', JSON.stringify(updated));
  };

  const groupTeams = teams.filter(t => t.group === activeGroup);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm(), group: activeGroup });
    setShowForm(true);
  };

  const openEdit = (team: Team) => {
    setEditingId(team.id);
    setForm({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      abbreviation: (team as Team & { abbreviation?: string }).abbreviation || team.shortName,
      city: team.city,
      group: team.group,
      logo: team.logo,
      primaryColor: team.colors.primary,
      secondaryColor: team.colors.secondary,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || slugify(form.name) || `team-${Date.now()}`;
    const teamData: Team & { abbreviation?: string } = {
      id,
      name: form.name.trim(),
      shortName: form.shortName.trim().toUpperCase().slice(0, 4),
      abbreviation: form.abbreviation.trim().toUpperCase().slice(0, 5) || form.shortName.trim().toUpperCase().slice(0, 4),
      logo: form.logo.trim() || DEFAULT_LOGO,
      city: form.city.trim(),
      group: form.group,
      colors: { primary: form.primaryColor, secondary: form.secondaryColor },
      players: editingId ? (teams.find(t => t.id === editingId)?.players ?? []) : [],
    };

    let updated: Team[];
    if (editingId) {
      updated = teams.map(t => (t.id === editingId ? teamData : t));
    } else {
      updated = [...teams, teamData];
    }
    persistTeams(updated);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id: string) => {
    let updated = teams.filter(t => t.id !== id);
    persistTeams(updated);
    setDeleteConfirm(null);
  };

  const handleReset = () => {
    persistTeams(initialTeams);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // --- Match helpers ---
  const persistMatches = (updated: (Match & { homeGoalScorers?: string; awayGoalScorers?: string })[]) => {
    setMatches(updated);
    localStorage.setItem('admin_matches', JSON.stringify(updated));
  };

  const getTeamName = (id: string) => {
    const t = teams.find(t => t.id === id) || initialTeams.find(t => t.id === id);
    return t ? t.shortName : id.toUpperCase();
  };

  const getTeamFullName = (id: string) => {
    const t = teams.find(t => t.id === id) || initialTeams.find(t => t.id === id);
    return t ? t.name : id;
  };

  const openEditMatch = (match: Match & { homeGoalScorers?: string; awayGoalScorers?: string }) => {
    setEditingMatchId(match.id);
    setMatchForm({
      id: match.id,
      homeScore: match.homeScore !== null ? String(match.homeScore) : '',
      awayScore: match.awayScore !== null ? String(match.awayScore) : '',
      status: (match.status as MatchStatus) || 'upcoming',
      homeGoalScorers: match.homeGoalScorers || '',
      awayGoalScorers: match.awayGoalScorers || '',
    });
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchForm) return;

    let updated = matches.map(m => {
      if (m.id !== matchForm.id) return m;
      return {
        ...m,
        homeScore: matchForm.homeScore !== '' ? parseInt(matchForm.homeScore, 10) : null,
        awayScore: matchForm.awayScore !== '' ? parseInt(matchForm.awayScore, 10) : null,
        status: matchForm.status,
        homeGoalScorers: matchForm.homeGoalScorers,
        awayGoalScorers: matchForm.awayGoalScorers,
      };
    });

    persistMatches(updated);
    setEditingMatchId(null);
    setMatchForm(null);
    setMatchSaved(true);
    setTimeout(() => setMatchSaved(false), 2500);
  };

  const handleResetMatches = () => {
    persistMatches(initialMatches);
    setMatchSaved(true);
    setTimeout(() => setMatchSaved(false), 2500);
  };

  const stages = Array.from(new Set(matches.map(m => m.stage)));
  const stageMatches = matches.filter(m => m.stage === activeStage);

  // --- Fixture helpers ---
  const persistFixtures = (updated: Fixture[]) => {
    setFixtures(updated);
    localStorage.setItem('admin_fixtures', JSON.stringify(updated));
  };

  const groupFixtures = fixtures
    .filter(f => f.group === activeFixtureGroup)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

  const openAddFixture = () => {
    setEditingFixtureId(null);
    setFixtureForm(emptyFixtureForm(activeFixtureGroup));
    setShowFixtureForm(true);
  };

  const openEditFixture = (fixture: Fixture) => {
    setEditingFixtureId(fixture.id);
    setFixtureForm({
      id: fixture.id,
      homeTeamId: fixture.homeTeamId,
      awayTeamId: fixture.awayTeamId,
      date: fixture.date,
      time: fixture.time,
      venue: fixture.venue,
      group: fixture.group,
      matchDay: String(fixture.matchDay),
      stage: fixture.stage,
    });
    setShowFixtureForm(true);
  };

  const handleFixtureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fixtureForm.homeTeamId || !fixtureForm.awayTeamId) return;
    if (fixtureForm.homeTeamId === fixtureForm.awayTeamId) return;

    const id = editingFixtureId || `fix-${Date.now()}`;
    const fixtureData: Fixture = {
      id,
      homeTeamId: fixtureForm.homeTeamId,
      awayTeamId: fixtureForm.awayTeamId,
      date: fixtureForm.date,
      time: fixtureForm.time,
      venue: fixtureForm.venue.trim(),
      group: fixtureForm.group,
      matchDay: parseInt(fixtureForm.matchDay, 10) || 1,
      stage: fixtureForm.stage,
    };

    let updated: Fixture[];
    if (editingFixtureId) {
      updated = fixtures.map(f => (f.id === editingFixtureId ? fixtureData : f));
    } else {
      updated = [...fixtures, fixtureData];
    }
    persistFixtures(updated);
    setShowFixtureForm(false);
    setEditingFixtureId(null);
    setFixtureForm(emptyFixtureForm(activeFixtureGroup));
    setFixtureSaved(true);
    setTimeout(() => setFixtureSaved(false), 2500);
  };

  const handleDeleteFixture = (id: string) => {
    persistFixtures(fixtures.filter(f => f.id !== id));
    setDeleteFixtureConfirm(null);
  };

  const teamsInGroup = (group: string) =>
    teams.filter(t => t.group === group).concat(
      initialTeams.filter(t => t.group === group && !teams.find(tt => tt.id === t.id))
    );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const anySaved = saved || matchSaved || fixtureSaved;

  function handleResetAll() {
    localStorage.removeItem('admin_teams');
    localStorage.removeItem('admin_matches');
    localStorage.removeItem('admin_fixtures');
    setTeams(initialTeams);
    const clearedMatches = initialMatches.map(m => ({
      ...m,
      homeScore: null,
      awayScore: null,
      status: 'upcoming' as const,
      homeGoalScorers: '',
      awayGoalScorers: '',
    }));
    setMatches(clearedMatches);
    setFixtures([]);
    setShowResetAllConfirm(false);
    setResetAllStep(0);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // --- Dashboard stats ---
  const totalTeams = (parseInt(leagueConfig.numberOfGroups) || 0) * (parseInt(leagueConfig.teamsPerGroup) || 0) || teams.length;
  const totalFixtures = fixtures.length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const scoresUpdatedToday = matches.filter(
    m => m.status === 'completed' || m.status === 'live'
  ).length;

  // --- Dashboard chart data ---
  const completedMatches = matches.filter(m => m.homeScore !== null && m.awayScore !== null);
  const totalGoals = completedMatches.reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const avgGoalsPerMatch = completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(2) : '0.00';

  // Most active group by goals
  const goalsByGroup: Record<string, number> = {};
  completedMatches.forEach(m => {
    const grp = m.group || 'KO';
    goalsByGroup[grp] = (goalsByGroup[grp] || 0) + (m.homeScore ?? 0) + (m.awayScore ?? 0);
  });
  const mostActiveGroup = Object.entries(goalsByGroup).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const mostActiveGroupGoals = Object.entries(goalsByGroup).sort((a, b) => b[1] - a[1])[0]?.[1] || 0;

  // Win/loss distribution per team (top 8 by played)
  const allStandingsFlat = Object.values(initialStandings).flat();
  const winLossData = allStandingsFlat
    .sort((a, b) => b.played - a.played)
    .slice(0, 8)
    .map(s => {
      const team = teams.find(t => t.id === s.teamId) || initialTeams.find(t => t.id === s.teamId);
      return {
        name: team?.shortName || s.teamId,
        Menang: s.won,
        Seri: s.drawn,
        Kalah: s.lost,
      };
    });

  // Team strength ranking by points (top 8)
  const strengthData = allStandingsFlat
    .sort((a, b) => b.points - a.points || b.gd - a.gd)
    .slice(0, 8)
    .map(s => {
      const team = teams.find(t => t.id === s.teamId) || initialTeams.find(t => t.id === s.teamId);
      return {
        name: team?.shortName || s.teamId,
        Poin: s.points,
        GolDicetak: s.gf,
      };
    })
    .reverse();

  // Goal trends by match day (group stage only)
  const matchDayGoals: Record<number, number> = {};
  completedMatches
    .filter(m => m.stage === 'group')
    .forEach(m => {
      const day = m.matchDay;
      matchDayGoals[day] = (matchDayGoals[day] || 0) + (m.homeScore ?? 0) + (m.awayScore ?? 0);
    });
  const goalTrendData = Object.entries(matchDayGoals)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([day, goals]) => ({ name: `MD ${day}`, Gol: goals }));

  return (
    <div className="min-h-screen bg-[#071428] text-foreground">
      {/* Reset All Confirmation Modal */}
      {showResetAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0D2137] border border-red-500/40 rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Reset Kompetisi</h2>
                <p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            {resetAllStep === 0 && (
              <>
                <p className="text-sm text-gray-300 mb-2">
                  Ini akan menghapus <strong className="text-white">semua data kompetisi</strong>:
                </p>
                <ul className="text-sm text-gray-400 space-y-1 mb-5 ml-4 list-disc">
                  <li>Semua data tim (dikembalikan ke data awal)</li>
                  <li>Semua skor & hasil pertandingan (direset)</li>
                  <li>Semua fixture yang dibuat (dihapus)</li>
                </ul>
                <p className="text-sm text-red-400 font-semibold mb-5">
                  Apakah Anda yakin ingin memulai kompetisi dari awal?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowResetAllConfirm(false); setResetAllStep(0); }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setResetAllStep(1)}
                    className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2.5 rounded-xl border border-red-500/40 transition-colors text-sm"
                  >
                    Lanjutkan →
                  </button>
                </div>
              </>
            )}

            {resetAllStep === 1 && (
              <>
                <p className="text-sm text-gray-300 mb-5">
                  Konfirmasi terakhir: ketuk <strong className="text-red-400">"Reset Sekarang"</strong> untuk menghapus semua data dan memulai kompetisi baru.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowResetAllConfirm(false); setResetAllStep(0); }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleResetAll}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    🗑 Reset Sekarang
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-[#0A1929] border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-xs mt-0.5">Kelola data liga &amp; kompetisi</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(anySaved || configSaved) && (
              <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Tersimpan
              </span>
            )}
            {activeTab === 'teams' && (
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground border border-border/40 hover:border-border px-3 py-1.5 rounded-lg transition-all"
              >
                Reset Tim
              </button>
            )}
            {activeTab === 'matches' && (
              <button
                onClick={handleResetMatches}
                className="text-xs text-muted-foreground hover:text-foreground border border-border/40 hover:border-border px-3 py-1.5 rounded-lg transition-all"
              >
                Reset Skor
              </button>
            )}
            <button
              onClick={() => { setShowResetAllConfirm(true); setResetAllStep(0); }}
              className="text-xs text-red-400 hover:text-red-300 border border-red-500/40 hover:border-red-400 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all font-semibold"
            >
              ⚠ Reset Kompetisi
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 border border-red-400/40 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#0A1929] border-b border-white/10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
          {([
            { key: 'dashboard', label: 'Dashboard' },
            { key: 'teams', label: 'Tim' },
            { key: 'fixtures', label: 'Fixture' },
            { key: 'matches', label: 'Skor' },
            { key: 'config', label: 'Konfigurasi' },
          ] as { key: typeof activeTab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-400' :'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Total Tim */}
          <button
            onClick={() => setActiveTab('teams')}
            className="group bg-[#0D2137] border border-border/40 hover:border-accent/50 rounded-2xl p-5 text-left transition-all hover:bg-accent/5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <svg className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent/60 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-3xl font-black text-foreground tabular-nums">{totalTeams}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Tim</div>
            <div className="text-xs text-accent/70 mt-2 font-medium group-hover:text-accent transition-colors">Kelola Tim →</div>
          </button>

          {/* Fixture Dibuat */}
          <button
            onClick={() => setActiveTab('fixtures')}
            className="group bg-[#0D2137] border border-border/40 hover:border-accent/50 rounded-2xl p-5 text-left transition-all hover:bg-accent/5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <svg className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent/60 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-3xl font-black text-foreground tabular-nums">{totalFixtures}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Fixture Dibuat</div>
            <div className="text-xs text-accent/70 mt-2 font-medium group-hover:text-accent transition-colors">Kelola Fixture →</div>
          </button>

          {/* Skor Diperbarui */}
          <button
            onClick={() => setActiveTab('matches')}
            className="group bg-[#0D2137] border border-border/40 hover:border-accent/50 rounded-2xl p-5 text-left transition-all hover:bg-accent/5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <svg className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent/60 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-3xl font-black text-foreground tabular-nums">{scoresUpdatedToday}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Skor Diperbarui</div>
            <div className="text-xs text-accent/70 mt-2 font-medium group-hover:text-accent transition-colors">Kelola Skor →</div>
          </button>

          {/* Quick Actions */}
          <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Aksi Cepat</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('teams'); openAdd(); }}
                className="w-full text-left text-xs font-bold text-foreground/80 hover:text-foreground bg-white/5 hover:bg-accent/10 border border-border/20 hover:border-accent/30 px-3 py-2 rounded-lg transition-all"
              >
                + Tambah Tim
              </button>
              <button
                onClick={() => { setActiveTab('fixtures'); openAddFixture(); }}
                className="w-full text-left text-xs font-bold text-foreground/80 hover:text-foreground bg-white/5 hover:bg-accent/10 border border-border/20 hover:border-accent/30 px-3 py-2 rounded-lg transition-all"
              >
                + Buat Fixture
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className="w-full text-left text-xs font-bold text-foreground/80 hover:text-foreground bg-white/5 hover:bg-accent/10 border border-border/20 hover:border-accent/30 px-3 py-2 rounded-lg transition-all"
              >
                ✎ Update Skor
              </button>
            </div>
          </div>
        </div>

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Indikator Kinerja Utama</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Pertandingan Selesai */}
                <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-black text-white tabular-nums">{completedMatches.length}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Pertandingan Selesai</div>
                </div>

                {/* Total Gol */}
                <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-black text-white tabular-nums">{totalGoals}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Gol</div>
                </div>

                {/* Rata-rata Gol per Pertandingan */}
                <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-black text-white tabular-nums">{avgGoalsPerMatch}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Rata-rata Gol/Match</div>
                </div>

                {/* Grup Paling Aktif */}
                <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-black text-white tabular-nums">Grup {mostActiveGroup}</div>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Grup Paling Aktif</div>
                  <div className="text-xs text-purple-400 mt-1">{mostActiveGroupGoals} gol total</div>
                </div>
              </div>
            </div>

            {/* Charts Row 1: Win/Loss Distribution + Goal Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Win/Loss Distribution */}
              <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-1">Distribusi Menang / Seri / Kalah</h3>
                <p className="text-xs text-muted-foreground mb-5">8 tim dengan pertandingan terbanyak</p>
                {winLossData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={winLossData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0a1929', border: '1px solid #1e3a5f', borderRadius: 8, color: '#fff', fontSize: 12 }}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                      <Bar dataKey="Menang" fill="#22c55e" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Seri" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Kalah" fill="#ef4444" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">Belum ada data pertandingan</div>
                )}
              </div>

              {/* Goal Trends */}
              <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-1">Tren Gol per Match Day</h3>
                <p className="text-xs text-muted-foreground mb-5">Total gol di setiap match day fase grup</p>
                {goalTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={goalTrendData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0a1929', border: '1px solid #1e3a5f', borderRadius: 8, color: '#fff', fontSize: 12 }}
                        cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                      <Line
                        type="monotone"
                        dataKey="Gol"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">Belum ada data gol</div>
                )}
              </div>
            </div>

            {/* Team Strength Ranking */}
            <div className="bg-[#0D2137] border border-border/40 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-1">Ranking Kekuatan Tim</h3>
              <p className="text-xs text-muted-foreground mb-5">Berdasarkan poin & gol dicetak (top 8)</p>
              {strengthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={strengthData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={36} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0a1929', border: '1px solid #1e3a5f', borderRadius: 8, color: '#fff', fontSize: 12 }}
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Bar dataKey="Poin" fill="#6366f1" radius={[0, 3, 3, 0]} />
                    <Bar dataKey="GolDicetak" fill="#0ea5e9" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">Belum ada data klasemen</div>
              )}
            </div>
          </div>
        )}

        {/* ===== TEAMS TAB ===== */}
        {activeTab === 'teams' && (
          <>
            <div className="mb-6 bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 text-sm text-accent/90">
              <strong>Catatan:</strong> Perubahan disimpan di browser (localStorage). Data ini digunakan untuk tampilan di halaman Klasemen dan Tim.
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {GROUPS.map(g => (
                <button
                  key={g}
                  onClick={() => { setActiveGroup(g); setShowForm(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
                    activeGroup === g
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-[#0D2137] text-muted-foreground hover:text-foreground border border-border/40'
                  }`}
                >
                  Grup {g}
                </button>
              ))}
            </div>

            <div className="bg-[#0D2137] rounded-2xl border border-border/40 overflow-hidden mb-4">
              <div className="px-4 sm:px-5 py-4 border-b border-border/30 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  {groupTeams.length} Tim · Grup {activeGroup}
                </span>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 bg-accent text-accent-foreground px-3 sm:px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all flex-shrink-0"
                >
                  <span className="text-base leading-none">+</span> Tambah Tim
                </button>
              </div>

              {groupTeams.length === 0 ? (
                <div className="px-5 py-12 text-center text-muted-foreground text-sm">
                  Belum ada tim di Grup {activeGroup}. Klik "Tambah Tim" untuk menambahkan.
                </div>
              ) : (
                <div className="divide-y divide-border/20">
                  {groupTeams.map(team => (
                    <div key={team.id} className="flex items-center gap-3 px-4 sm:px-5 py-4 hover:bg-white/5 transition-colors">
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 border border-white/10"
                        style={{ backgroundColor: team.colors.primary }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground text-sm truncate">{team.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded mr-2">{team.shortName}</span>
                          {team.city}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEdit(team)}
                          className="text-xs font-bold text-accent hover:text-accent/80 border border-accent/30 hover:border-accent/60 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        {deleteConfirm === team.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(team.id)}
                              className="text-xs font-bold text-red-400 border border-red-400/40 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-all"
                            >
                              Hapus?
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs text-muted-foreground border border-border/40 px-2 py-1.5 rounded-lg hover:text-foreground transition-all"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(team.id)}
                            className="text-xs font-bold text-muted-foreground hover:text-red-400 border border-border/40 hover:border-red-400/40 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showForm && (
              <div className="bg-[#0D2137] rounded-2xl border border-accent/30 overflow-hidden">
                <div className="px-4 sm:px-5 py-4 border-b border-border/30 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest text-accent">
                    {editingId ? 'Edit Tim' : 'Tambah Tim Baru'}
                  </h2>
                  <button
                    onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="text-muted-foreground hover:text-foreground text-xl leading-none transition-colors"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-4 sm:px-5 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Nama Tim <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="cth. Persija Jakarta"
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Nama Pendek (maks 4 huruf) <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={4}
                      value={form.shortName}
                      onChange={e => setForm(f => ({ ...f, shortName: e.target.value.toUpperCase() }))}
                      placeholder="cth. PJK"
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Singkatan Resmi (maks 5 huruf) <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={5}
                      value={form.abbreviation}
                      onChange={e => setForm(f => ({ ...f, abbreviation: e.target.value.toUpperCase() }))}
                      placeholder="cth. PRSJ"
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                    />
                    <p className="text-xs text-muted-foreground/60 mt-1">Singkatan resmi yang tampil di papan skor & klasemen</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Kota <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="cth. Jakarta"
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Grup <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.group}
                      onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
                    >
                      {GROUPS.map(g => (
                        <option key={g} value={g}>Grup {g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Warna Utama
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.primaryColor}
                        onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg border border-border/50 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.primaryColor}
                        onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                        className="flex-1 bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-3 py-2.5 text-sm font-mono text-foreground outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Warna Sekunder
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.secondaryColor}
                        onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg border border-border/50 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.secondaryColor}
                        onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                        className="flex-1 bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-3 py-2.5 text-sm font-mono text-foreground outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Logo Upload Section */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Logo Tim
                    </label>
                    <div className="flex items-start gap-4">
                      {/* Logo Preview */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-border/40 bg-[#071428] overflow-hidden flex items-center justify-center">
                        {form.logo ? (
                          <img
                            src={form.logo}
                            alt="Preview logo tim"
                            className="w-full h-full object-contain p-1"
                            onError={e => { (e.target as HTMLImageElement).src = DEFAULT_LOGO; }}
                          />
                        ) : (
                          <svg className="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      {/* Upload Controls */}
                      <div className="flex-1 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60 text-accent text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all w-full justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                alert('Ukuran file maksimal 2MB');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = ev => {
                                const result = ev.target?.result as string;
                                setForm(f => ({ ...f, logo: result }));
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        <p className="text-xs text-muted-foreground/60">PNG, JPG, SVG · Maks 2MB</p>
                        <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/40 pl-3">atau URL:</span>
                          <input
                            type="text"
                            value={form.logo.startsWith('data:') ? '' : form.logo}
                            onChange={e => setForm(f => ({ ...f, logo: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg pl-16 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-colors"
                          />
                        </div>
                        {form.logo && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, logo: DEFAULT_LOGO }))}
                            className="text-xs text-muted-foreground/60 hover:text-red-400 transition-colors"
                          >
                            × Hapus logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-4 bg-[#071428] rounded-xl px-4 py-3 border border-border/30">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                      {form.logo ? (
                        <img
                          src={form.logo}
                          alt="Preview logo"
                          className="w-full h-full object-contain p-1"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full" style={{ backgroundColor: form.primaryColor }} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{form.name || 'Nama Tim'}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded">{form.shortName || 'XXX'}</span>
                        {form.abbreviation && form.abbreviation !== form.shortName && (
                          <span className="font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded border border-accent/20">{form.abbreviation}</span>
                        )}
                        <span>{form.city || 'Kota'} · Grup {form.group}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-4 h-4 rounded-sm border border-white/20 inline-block" style={{ backgroundColor: form.primaryColor }} title="Warna Utama" />
                        <span className="w-4 h-4 rounded-sm border border-white/20 inline-block" style={{ backgroundColor: form.secondaryColor }} title="Warna Sekunder" />
                        <span className="text-xs text-muted-foreground/60">{form.primaryColor} / {form.secondaryColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditingId(null); }}
                      className="px-4 sm:px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border/40 rounded-lg hover:text-foreground hover:border-border transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 sm:px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all"
                    >
                      {editingId ? 'Simpan' : 'Tambah Tim'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* ===== MATCHES TAB ===== */}
        {activeTab === 'matches' && (
          <>
            <div className="mb-6 bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 text-sm text-accent/90">
              <strong>Catatan:</strong> Input skor live, gol, dan status pertandingan per fixture. Perubahan disimpan di browser (localStorage).
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {stages.map(stage => (
                <button
                  key={stage}
                  onClick={() => { setActiveStage(stage); setEditingMatchId(null); setMatchForm(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
                    activeStage === stage
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-[#0D2137] text-muted-foreground hover:text-foreground border border-border/40'
                  }`}
                >
                  {STAGE_LABELS[stage] || stage}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {stageMatches.map(match => {
                const isEditing = editingMatchId === match.id;
                const status = (match.status as MatchStatus) || 'upcoming';

                return (
                  <div
                    key={match.id}
                    className={`bg-[#0D2137] rounded-2xl border overflow-hidden transition-all ${
                      isEditing ? 'border-accent/50' : 'border-border/40'
                    }`}
                  >
                    <div className="px-4 sm:px-5 py-4 flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Score row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-foreground truncate max-w-[100px] sm:max-w-none">{getTeamFullName(match.homeTeamId)}</span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-base sm:text-lg font-black text-foreground font-mono w-5 sm:w-6 text-center">
                              {match.homeScore !== null ? match.homeScore : '—'}
                            </span>
                            <span className="text-muted-foreground text-sm">:</span>
                            <span className="text-base sm:text-lg font-black text-foreground font-mono w-5 sm:w-6 text-center">
                              {match.awayScore !== null ? match.awayScore : '—'}
                            </span>
                          </div>
                          <span className="text-sm font-black text-foreground truncate max-w-[100px] sm:max-w-none">{getTeamFullName(match.awayTeamId)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
                            {status === 'live' && <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" />}
                            {STATUS_LABELS[status]}
                          </span>
                          <span className="text-xs text-muted-foreground">{match.date} · {match.time}</span>
                          {match.group && (
                            <span className="text-xs text-muted-foreground">· Grup {match.group}</span>
                          )}
                        </div>
                        {((match as any).homeGoalScorers || (match as any).awayGoalScorers) && (
                          <div className="mt-1.5 flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-muted-foreground">
                            {(match as any).homeGoalScorers && (
                              <span>⚽ {getTeamName(match.homeTeamId)}: {(match as any).homeGoalScorers}</span>
                            )}
                            {(match as any).awayGoalScorers && (
                              <span>⚽ {getTeamName(match.awayTeamId)}: {(match as any).awayGoalScorers}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingMatchId(null);
                            setMatchForm(null);
                          } else {
                            openEditMatch(match);
                          }
                        }}
                        className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          isEditing
                            ? 'text-muted-foreground border-border/40 hover:text-foreground'
                            : 'text-accent border-accent/30 hover:border-accent/60'
                        }`}
                      >
                        {isEditing ? 'Tutup' : 'Edit'}
                      </button>
                    </div>

                    {isEditing && matchForm && (
                      <form
                        onSubmit={handleMatchSubmit}
                        className="px-4 sm:px-5 pb-5 pt-1 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                            Status Pertandingan
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(STATUS_LABELS) as MatchStatus[]).map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setMatchForm(f => f ? { ...f, status: s } : f)}
                                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                  matchForm.status === s
                                    ? STATUS_COLORS[s] + 'font-black' :'text-muted-foreground border-border/40 hover:text-foreground'
                                }`}
                              >
                                {s === 'live' && matchForm.status === s && (
                                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
                                )}
                                {STATUS_LABELS[s]}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Skor {getTeamName(match.homeTeamId)} (Tuan Rumah)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="99"
                            value={matchForm.homeScore}
                            onChange={e => setMatchForm(f => f ? { ...f, homeScore: e.target.value } : f)}
                            placeholder="—"
                            className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Skor {getTeamName(match.awayTeamId)} (Tamu)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="99"
                            value={matchForm.awayScore}
                            onChange={e => setMatchForm(f => f ? { ...f, awayScore: e.target.value } : f)}
                            placeholder="—"
                            className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Pencetak Gol {getTeamName(match.homeTeamId)}
                          </label>
                          <input
                            type="text"
                            value={matchForm.homeGoalScorers}
                            onChange={e => setMatchForm(f => f ? { ...f, homeGoalScorers: e.target.value } : f)}
                            placeholder="cth. Wahyu 23', Bima 67'"
                            className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Pencetak Gol {getTeamName(match.awayTeamId)}
                          </label>
                          <input
                            type="text"
                            value={matchForm.awayGoalScorers}
                            onChange={e => setMatchForm(f => f ? { ...f, awayGoalScorers: e.target.value } : f)}
                            placeholder="cth. Irfan 45', Dani 88'"
                            className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2 text-xs text-muted-foreground bg-[#071428] rounded-lg px-4 py-2.5 border border-border/30">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {match.venue}
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => { setEditingMatchId(null); setMatchForm(null); }}
                            className="px-4 sm:px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border/40 rounded-lg hover:text-foreground hover:border-border transition-all"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 sm:px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all"
                          >
                            Simpan Skor
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ===== FIXTURES TAB ===== */}
        {activeTab === 'fixtures' && (
          <>
            <div className="mb-6 bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 text-sm text-accent/90">
              <strong>Catatan:</strong> Buat dan atur fixture mendatang per grup. Setiap fixture mencakup tanggal, waktu, tim, dan venue. Disimpan di browser (localStorage).
            </div>

            {/* Group Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {GROUPS.map(g => (
                <button
                  key={g}
                  onClick={() => {
                    setActiveFixtureGroup(g);
                    setShowFixtureForm(false);
                    setEditingFixtureId(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
                    activeFixtureGroup === g
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-[#0D2137] text-muted-foreground hover:text-foreground border border-border/40'
                  }`}
                >
                  Grup {g}
                </button>
              ))}
            </div>

            {/* Fixture List */}
            <div className="bg-[#0D2137] rounded-2xl border border-border/40 overflow-hidden mb-4">
              <div className="px-4 sm:px-5 py-4 border-b border-border/30 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  {groupFixtures.length} Fixture · Grup {activeFixtureGroup}
                </span>
                <button
                  onClick={openAddFixture}
                  className="flex items-center gap-2 bg-accent text-accent-foreground px-3 sm:px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all flex-shrink-0"
                >
                  <span className="text-base leading-none">+</span> Tambah Fixture
                </button>
              </div>

              {groupFixtures.length === 0 ? (
                <div className="px-5 py-12 text-center text-muted-foreground text-sm">
                  Belum ada fixture di Grup {activeFixtureGroup}. Klik "Tambah Fixture" untuk menambahkan.
                </div>
              ) : (
                <div className="divide-y divide-border/20">
                  {groupFixtures.map(fixture => (
                    <div key={fixture.id} className="px-4 sm:px-5 py-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Date/Time block */}
                        <div className="flex-shrink-0 bg-[#071428] rounded-xl px-2.5 sm:px-3 py-2 text-center min-w-[56px] sm:min-w-[64px] border border-border/30">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {fixture.date ? formatDate(fixture.date).split('/').slice(0, 2).join('/') : '—'}
                          </div>
                          <div className="text-sm font-black text-foreground font-mono mt-0.5">{fixture.time || '—'}</div>
                        </div>

                        {/* Match info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-foreground">{getTeamFullName(fixture.homeTeamId)}</span>
                            <span className="text-xs font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded">VS</span>
                            <span className="text-sm font-black text-foreground">{getTeamFullName(fixture.awayTeamId)}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {fixture.venue || '—'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              MD {fixture.matchDay} · {STAGE_LABELS[fixture.stage] || fixture.stage}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => openEditFixture(fixture)}
                            className="text-xs font-bold text-accent hover:text-accent/80 border border-accent/30 hover:border-accent/60 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          {deleteFixtureConfirm === fixture.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteFixture(fixture.id)}
                                className="text-xs font-bold text-red-400 border border-red-400/40 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-all"
                              >
                                Hapus?
                              </button>
                              <button
                                onClick={() => setDeleteFixtureConfirm(null)}
                                className="text-xs text-muted-foreground border border-border/40 px-2 py-1.5 rounded-lg hover:text-foreground transition-all"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteFixtureConfirm(fixture.id)}
                              className="text-xs font-bold text-muted-foreground hover:text-red-400 border border-border/40 hover:border-red-400/40 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add / Edit Fixture Form */}
            {showFixtureForm && (
              <div className="bg-[#0D2137] rounded-2xl border border-accent/30 overflow-hidden">
                <div className="px-4 sm:px-5 py-4 border-b border-border/30 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest text-accent">
                    {editingFixtureId ? 'Edit Fixture' : 'Tambah Fixture Baru'}
                  </h2>
                  <button
                    onClick={() => { setShowFixtureForm(false); setEditingFixtureId(null); }}
                    className="text-muted-foreground hover:text-foreground text-xl leading-none transition-colors"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleFixtureSubmit} className="px-4 sm:px-5 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Home Team */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Tim Tuan Rumah <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={fixtureForm.homeTeamId}
                      onChange={e => setFixtureForm(f => ({ ...f, homeTeamId: e.target.value }))}
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
                    >
                      <option value="">— Pilih Tim —</option>
                      {teamsInGroup(activeFixtureGroup).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Away Team */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Tim Tamu <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={fixtureForm.awayTeamId}
                      onChange={e => setFixtureForm(f => ({ ...f, awayTeamId: e.target.value }))}
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
                    >
                      <option value="">— Pilih Tim —</option>
                      {teamsInGroup(activeFixtureGroup)
                        .filter(t => t.id !== fixtureForm.homeTeamId)
                        .map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Tanggal <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={fixtureForm.date}
                      onChange={e => setFixtureForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Waktu (WIB) <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="time"
                      value={fixtureForm.time}
                      onChange={e => setFixtureForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
                    />
                  </div>

                  {/* Venue */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Venue / Stadion <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={fixtureForm.venue}
                      onChange={e => setFixtureForm(f => ({ ...f, venue: e.target.value }))}
                      placeholder="cth. Stadion GBK, Jakarta"
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
                    />
                  </div>

                  {/* Match Day */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Match Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={fixtureForm.matchDay}
                      onChange={e => setFixtureForm(f => ({ ...f, matchDay: e.target.value }))}
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm font-mono text-foreground outline-none transition-colors"
                    />
                  </div>

                  {/* Stage */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Babak / Stage
                    </label>
                    <select
                      value={fixtureForm.stage}
                      onChange={e => setFixtureForm(f => ({ ...f, stage: e.target.value }))}
                      className="w-full bg-[#071428] border border-border/50 focus:border-accent rounded-lg px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
                    >
                      {STAGE_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preview */}
                  {fixtureForm.homeTeamId && fixtureForm.awayTeamId && (
                    <div className="sm:col-span-2 bg-[#071428] rounded-xl px-4 py-3 border border-border/30">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Preview Fixture</div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-black text-foreground">{getTeamFullName(fixtureForm.homeTeamId)}</span>
                        <span className="text-xs font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded">VS</span>
                        <span className="text-sm font-black text-foreground">{getTeamFullName(fixtureForm.awayTeamId)}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                        {fixtureForm.date && <span>📅 {formatDate(fixtureForm.date)}</span>}
                        {fixtureForm.time && <span>🕐 {fixtureForm.time} WIB</span>}
                        {fixtureForm.venue && <span>📍 {fixtureForm.venue}</span>}
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowFixtureForm(false); setEditingFixtureId(null); }}
                      className="px-4 sm:px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border/40 rounded-lg hover:text-foreground hover:border-border transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 sm:px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all"
                    >
                      {editingFixtureId ? 'Simpan' : 'Tambah Fixture'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* ===== CONFIG TAB ===== */}
        {activeTab === 'config' && (
          <form onSubmit={handleConfigSave} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">Konfigurasi Liga</h2>
                <p className="text-gray-400 text-sm mt-0.5">Atur nama liga, peraturan turnamen, struktur grup, dan regulasi pertandingan</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {configDirty && (
                  <span className="text-yellow-400 text-xs font-medium">Belum disimpan</span>
                )}
                <button
                  type="button"
                  onClick={handleConfigReset}
                  className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
                >
                  Reset Default
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </div>

            {/* Section 1: Informasi Liga */}
            <div className="bg-[#0D2137] border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Informasi Liga</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Nama Liga <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={leagueConfig.leagueName}
                    onChange={e => handleConfigChange('leagueName', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Nama liga"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Musim / Season</label>
                  <input
                    type="text"
                    value={leagueConfig.season}
                    onChange={e => handleConfigChange('season', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Penyelenggara</label>
                  <input
                    type="text"
                    value={leagueConfig.organizer}
                    onChange={e => handleConfigChange('organizer', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Nama penyelenggara"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={leagueConfig.description}
                    onChange={e => handleConfigChange('description', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Deskripsi kompetisi"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Peraturan Turnamen */}
            <div className="bg-[#0D2137] border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Peraturan Turnamen</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Poin Menang</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={leagueConfig.pointsWin}
                    onChange={e => handleConfigChange('pointsWin', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Poin Seri</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={leagueConfig.pointsDraw}
                    onChange={e => handleConfigChange('pointsDraw', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Poin Kalah</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={leagueConfig.pointsLoss}
                    onChange={e => handleConfigChange('pointsLoss', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Tim Lolos per Grup
                    <span className="ml-1.5 text-blue-400 text-[10px] font-semibold">(↔ klasemen)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={leagueConfig.teamsAdvancePerGroup}
                    onChange={e => handleConfigChange('teamsAdvancePerGroup', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Aturan Tiebreaker</label>
                  <input
                    type="text"
                    value={leagueConfig.tiebreaker}
                    onChange={e => handleConfigChange('tiebreaker', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Selisih gol, gol terbanyak, head-to-head"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Struktur Grup */}
            <div className="bg-[#0D2137] border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Struktur Grup</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Jumlah Grup</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={leagueConfig.numberOfGroups}
                    onChange={e => handleConfigChange('numberOfGroups', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Tim per Grup</label>
                  <input
                    type="number"
                    min="2"
                    max="16"
                    value={leagueConfig.teamsPerGroup}
                    onChange={e => handleConfigChange('teamsPerGroup', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Nama Grup (pisah koma)</label>
                  <input
                    type="text"
                    value={leagueConfig.groupNames}
                    onChange={e => handleConfigChange('groupNames', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="A, B, C, D"
                  />
                </div>
              </div>
              {/* Total Teams Calculation */}
              <div className="mt-4 flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs text-green-300 leading-relaxed">
                  <span className="font-semibold">Total Tim: </span>
                  <span className="text-green-400 font-black text-sm">
                    {(parseInt(leagueConfig.numberOfGroups) || 0) * (parseInt(leagueConfig.teamsPerGroup) || 0)}
                  </span>
                  <span className="text-gray-400 ml-1">
                    ({leagueConfig.numberOfGroups || 0} grup × {leagueConfig.teamsPerGroup || 0} tim per grup)
                  </span>
                </p>
              </div>
              {/* Group preview */}
              {leagueConfig.groupNames && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {leagueConfig.groupNames.split(',').map(g => g.trim()).filter(Boolean).map(g => (
                    <span key={g} className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold rounded-full">
                      Grup {g}
                    </span>
                  ))}
                </div>
              )}
              {/* Live impact notice */}
              <div className="mt-4 flex items-start gap-2.5 bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-300 leading-relaxed">
                  <span className="font-semibold">Sinkron otomatis:</span> Setelah disimpan, jumlah grup, nama grup, dan jumlah tim lolos per grup akan langsung tercermin di{' '}
                  <span className="font-semibold">tabel klasemen beranda</span> dan{' '}
                  <span className="font-semibold">halaman klasemen</span> — termasuk sorotan tim yang lolos.
                </p>
              </div>
            </div>

            {/* Section 4: Regulasi Pertandingan */}
            <div className="bg-[#0D2137] border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Regulasi Pertandingan</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Durasi Pertandingan (menit)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={leagueConfig.matchDuration}
                    onChange={e => handleConfigChange('matchDuration', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Maks. Pergantian Pemain</label>
                  <input
                    type="number"
                    min="1"
                    max="11"
                    value={leagueConfig.maxSubstitutions}
                    onChange={e => handleConfigChange('maxSubstitutions', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Extra Time</label>
                  <input
                    type="text"
                    value={leagueConfig.extraTime}
                    onChange={e => handleConfigChange('extraTime', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Ya (2x15 menit)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Adu Penalti</label>
                  <input
                    type="text"
                    value={leagueConfig.penaltyShootout}
                    onChange={e => handleConfigChange('penaltyShootout', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Ya (jika imbang setelah extra time)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Venue Default</label>
                  <input
                    type="text"
                    value={leagueConfig.venue}
                    onChange={e => handleConfigChange('venue', e.target.value)}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Nama stadion / venue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Peraturan Tambahan</label>
                  <textarea
                    value={leagueConfig.additionalRules}
                    onChange={e => handleConfigChange('additionalRules', e.target.value)}
                    rows={3}
                    className="w-full bg-[#071428] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Aturan khusus lainnya..."
                  />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-[#0D2137] border border-blue-500/20 rounded-xl p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ringkasan Konfigurasi Aktif
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Nama Liga', value: leagueConfig.leagueName },
                  { label: 'Musim', value: leagueConfig.season },
                  { label: 'Jumlah Grup', value: leagueConfig.numberOfGroups },
                  { label: 'Tim per Grup', value: leagueConfig.teamsPerGroup },
                  { label: 'Poin Menang', value: leagueConfig.pointsWin },
                  { label: 'Tim Lolos', value: `${leagueConfig.teamsAdvancePerGroup} per grup` },
                  { label: 'Durasi Match', value: `${leagueConfig.matchDuration} menit` },
                  { label: 'Maks. Subs', value: leagueConfig.maxSubstitutions },
                ].map(item => (
                  <div key={item.label} className="bg-[#071428] rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                    <p className="text-white text-sm font-semibold truncate">{item.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Save button bottom */}
            <div className="flex flex-wrap justify-end gap-3 pb-4">
              <button
                type="button"
                onClick={handleConfigReset}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
              >
                Reset ke Default
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
