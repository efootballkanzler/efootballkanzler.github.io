'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { matches as initialMatches, getTeamById, Match } from '@/data/leagueData';

type FilterType = 'all' | 'upcoming' | 'completed' | 'r16' | 'group';

// Virtual list item types
type DateHeaderItem = { type: 'date-header'; date: string; count: number };
type MatchRowItem = { type: 'match'; matchId: string; isLastInGroup: boolean };
type ListItem = DateHeaderItem | MatchRowItem;

// Heights for each item type (px)
const DATE_HEADER_HEIGHT = 44;
const MATCH_ROW_HEIGHT = 160;
const MATCH_ROW_HEIGHT_EDITING = 320;
const MATCH_ROW_GAP = 16;
const OVERSCAN = 3;

type MatchWithExtras = Match & { homeGoalScorers?: string; awayGoalScorers?: string };

type MatchStatus = 'upcoming' | 'live' | 'completed';

interface InlineEditState {
  homeScore: string;
  awayScore: string;
  status: MatchStatus;
}

function useVirtualItems(items: ListItem[], getHeight: (item: ListItem) => number, containerHeight: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const offsets: number[] = [];
  let cumulative = 0;
  for (const item of items) {
    offsets.push(cumulative);
    cumulative += getHeight(item);
  }
  const totalHeight = cumulative;

  let startIndex = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (offsets[i] + getHeight(items[i]) > scrollTop - OVERSCAN * MATCH_ROW_HEIGHT) {
      startIndex = Math.max(0, i - OVERSCAN);
      break;
    }
  }
  let endIndex = items.length - 1;
  for (let i = startIndex; i < items.length; i++) {
    if (offsets[i] > scrollTop + containerHeight + OVERSCAN * MATCH_ROW_HEIGHT) {
      endIndex = i;
      break;
    }
  }

  return { scrollRef, startIndex, endIndex, totalHeight, offsets };
}

function MatchCard({
  matchId,
  isAdmin,
  allMatches,
  onMatchUpdate,
}: {
  matchId: string;
  isAdmin: boolean;
  allMatches: MatchWithExtras[];
  onMatchUpdate: (updated: MatchWithExtras[]) => void;
}) {
  const match = allMatches.find((m) => m.id === matchId);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editState, setEditState] = useState<InlineEditState>({
    homeScore: '',
    awayScore: '',
    status: 'upcoming',
  });

  if (!match) return null;
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  const openEdit = () => {
    setEditState({
      homeScore: match.homeScore !== null ? String(match.homeScore) : '',
      awayScore: match.awayScore !== null ? String(match.awayScore) : '',
      status: (match.status as MatchStatus) || 'upcoming',
    });
    setIsEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = () => {
    const homeScore = editState.homeScore !== '' ? parseInt(editState.homeScore, 10) : null;
    const awayScore = editState.awayScore !== '' ? parseInt(editState.awayScore, 10) : null;
    const updated = allMatches.map((m) =>
      m.id === matchId
        ? { ...m, homeScore, awayScore, status: editState.status }
        : m
    );
    onMatchUpdate(updated);
    setSaved(true);
    setTimeout(() => {
      setIsEditing(false);
      setSaved(false);
    }, 900);
  };

  const statusOptions: { value: MatchStatus; label: string }[] = [
    { value: 'upcoming', label: 'Akan Datang' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Selesai' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden match-card-hover relative">
      {match.status === 'upcoming' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl"></div>
      )}
      {match.status === 'completed' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500/40 rounded-l-2xl"></div>
      )}
      {match.status === 'live' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-2xl"></div>
      )}

      {/* Match Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-primary/30">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {match.stage === 'r16' ? '16 Besar' : `Grup ${match.group}`}
          </span>
          {match.status === 'live' && (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 live-badge"></span>
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
            match.status === 'completed'
              ? 'bg-green-500/10 text-green-400'
              : match.status === 'upcoming' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'
          }`}>
            {match.status === 'completed' ? 'Selesai' : match.status === 'upcoming' ? 'Akan Datang' : 'Live'}
          </span>
          {isAdmin && !isEditing && (
            <button
              onClick={openEdit}
              title="Edit skor"
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          {isAdmin && isEditing && (
            <button
              onClick={cancelEdit}
              title="Batal"
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Match Body */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right">
            <p className="text-[15px] font-bold text-foreground">{home?.shortName}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{home?.city}</p>
          </div>

          {match.status === 'completed' ? (
            <div className="flex items-center gap-2 bg-muted rounded-2xl px-5 py-3 flex-shrink-0">
              <span className="text-2xl font-black text-foreground">{match.homeScore}</span>
              <span className="text-muted-foreground font-black text-lg">—</span>
              <span className="text-2xl font-black text-foreground">{match.awayScore}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 bg-accent/10 border border-accent/20 rounded-2xl px-5 py-3 flex-shrink-0">
              <span className="text-[13px] font-black text-accent">{match.time}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {match.date.split('-').reverse().join('/')}
              </span>
            </div>
          )}

          <div className="flex-1 text-left">
            <p className="text-[15px] font-bold text-foreground">{away?.shortName}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{away?.city}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="text-[11px] text-muted-foreground/60 font-medium truncate">{match.venue}</span>
        </div>
      </div>

      {/* Inline Edit Panel */}
      {isAdmin && isEditing && (
        <div className="px-6 pb-5 border-t border-border/50 bg-primary/20">
          <div className="pt-4 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-accent">Edit Skor & Status</p>

            {/* Score inputs */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">
                  {home?.shortName}
                </label>
                <input
                  type="number"
                  min="0"
                  value={editState.homeScore}
                  onChange={(e) => setEditState((s) => ({ ...s, homeScore: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-center text-xl font-black text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex-shrink-0 pt-5">
                <span className="text-muted-foreground font-black text-lg">—</span>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">
                  {away?.shortName}
                </label>
                <input
                  type="number"
                  min="0"
                  value={editState.awayScore}
                  onChange={(e) => setEditState((s) => ({ ...s, awayScore: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-center text-xl font-black text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Status selector */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">
                Status
              </label>
              <div className="flex gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setEditState((s) => ({ ...s, status: opt.value }))}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      editState.status === opt.value
                        ? opt.value === 'completed'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : opt.value === 'live' ?'bg-red-500/20 text-red-400 border border-red-500/30' :'bg-accent/20 text-accent border border-accent/30' :'bg-muted text-muted-foreground border border-border hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={saveEdit}
              disabled={saved}
              className={`w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                saved
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' :'bg-accent text-primary hover:bg-accent/90'
              }`}
            >
              {saved ? '✓ Tersimpan' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchFilter() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [allMatches, setAllMatches] = useState<MatchWithExtras[]>([]);

  useEffect(() => {
    // Check admin auth
    const auth = sessionStorage.getItem('admin_auth');
    setIsAdmin(auth === 'true');

    // Load matches from localStorage (admin-saved) or fallback to initial
    const stored = localStorage.getItem('admin_matches');
    if (stored) {
      try { setAllMatches(JSON.parse(stored)); } catch { setAllMatches(initialMatches); }
    } else {
      setAllMatches(initialMatches);
    }
  }, []);

  const handleMatchUpdate = useCallback((updated: MatchWithExtras[]) => {
    setAllMatches(updated);
    localStorage.setItem('admin_matches', JSON.stringify(updated));
  }, []);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'upcoming', label: 'Akan Datang' },
    { key: 'completed', label: 'Selesai' },
    { key: 'r16', label: '16 Besar' },
    { key: 'group', label: 'Fase Grup' },
  ];

  const filtered = allMatches.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return m.status === 'upcoming';
    if (filter === 'completed') return m.status === 'completed';
    if (filter === 'r16') return m.stage === 'r16';
    if (filter === 'group') return m.stage === 'group';
    return true;
  });

  // Group by date
  const byDate = filtered.reduce<Record<string, typeof filtered>>((acc, m) => {
    const key = m.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort();

  // Build flat virtual list items
  const listItems: ListItem[] = [];
  for (const date of sortedDates) {
    listItems.push({ type: 'date-header', date, count: byDate[date].length });
    const dateMatches = byDate[date];
    dateMatches.forEach((m, idx) => {
      listItems.push({ type: 'match', matchId: m.id, isLastInGroup: idx === dateMatches.length - 1 });
    });
  }

  const getItemHeight = (item: ListItem): number => {
    if (item.type === 'date-header') return DATE_HEADER_HEIGHT + 16;
    return MATCH_ROW_HEIGHT + MATCH_ROW_GAP;
  };

  const CONTAINER_HEIGHT = 700;
  const totalContentHeight = listItems.reduce((sum, item) => sum + getItemHeight(item), 0);
  const shouldVirtualize = listItems.length > 15;

  const { scrollRef, startIndex, endIndex, totalHeight, offsets } = useVirtualItems(
    listItems,
    getItemHeight,
    CONTAINER_HEIGHT
  );

  if (sortedDates.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                filter === f.key ? 'group-tab-active' : 'group-tab-inactive hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <p className="text-foreground font-black uppercase tracking-widest text-sm">Belum Tersedia</p>
          <p className="text-muted-foreground text-[12px] font-medium text-center max-w-xs">Jadwal pertandingan belum tersedia. Admin akan mengatur jadwal segera.</p>
        </div>
      </div>
    );
  }

  const renderItem = (item: ListItem, top: number) => {
    if (item.type === 'date-header') {
      return (
        <div
          key={`header-${item.date}`}
          style={{ position: 'absolute', top, left: 0, right: 0, height: DATE_HEADER_HEIGHT + 16, display: 'flex', alignItems: 'center', paddingBottom: 16 }}
        >
          <div className="flex items-center gap-4 w-full">
            <span className="text-[11px] font-black uppercase tracking-widest text-accent">
              {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
              {item.count} Pertandingan
            </span>
          </div>
        </div>
      );
    }
    return (
      <div
        key={`match-${item.matchId}`}
        style={{ position: 'absolute', top, left: 0, right: 0, minHeight: MATCH_ROW_HEIGHT, marginBottom: MATCH_ROW_GAP }}
      >
        <MatchCard
          matchId={item.matchId}
          isAdmin={isAdmin}
          allMatches={allMatches}
          onMatchUpdate={handleMatchUpdate}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Admin indicator */}
      {isAdmin && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent flex-shrink-0">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Mode Admin — Klik ikon edit pada kartu untuk mengubah skor</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
              filter === f.key ? 'group-tab-active' : 'group-tab-inactive hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Virtualized match list */}
      {shouldVirtualize ? (
        <div
          ref={scrollRef}
          style={{ height: CONTAINER_HEIGHT, overflowY: 'auto', position: 'relative' }}
          className="pr-1"
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            {listItems.slice(startIndex, endIndex + 1).map((item, idx) =>
              renderItem(item, offsets[startIndex + idx])
            )}
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', height: totalContentHeight }}>
          {listItems.map((item, idx) =>
            renderItem(item, offsets[idx])
          )}
        </div>
      )}
    </div>
  );
}