'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { matches, getTeamById } from '@/data/leagueData';

type FilterType = 'all' | 'upcoming' | 'completed' | 'r16' | 'group';

// Virtual list item types
type DateHeaderItem = { type: 'date-header'; date: string; count: number };
type MatchRowItem = { type: 'match'; matchId: string; isLastInGroup: boolean };
type ListItem = DateHeaderItem | MatchRowItem;

// Heights for each item type (px)
const DATE_HEADER_HEIGHT = 44;
const MATCH_ROW_HEIGHT = 160; // approximate card height
const MATCH_ROW_GAP = 16;
const OVERSCAN = 3;

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

  // Compute cumulative offsets
  const offsets: number[] = [];
  let cumulative = 0;
  for (const item of items) {
    offsets.push(cumulative);
    cumulative += getHeight(item);
  }
  const totalHeight = cumulative;

  // Find visible range
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

function MatchCard({ matchId }: { matchId: string }) {
  const match = matches.find((m) => m.id === matchId);
  if (!match) return null;
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden match-card-hover relative">
      {match.status === 'upcoming' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl"></div>
      )}
      {match.status === 'completed' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500/40 rounded-l-2xl"></div>
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
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
          match.status === 'completed'
            ? 'bg-green-500/10 text-green-400'
            : match.status === 'upcoming' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'
        }`}>
          {match.status === 'completed' ? 'Selesai' : match.status === 'upcoming' ? 'Akan Datang' : 'Live'}
        </span>
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
    </div>
  );
}

export default function MatchFilter() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'upcoming', label: 'Akan Datang' },
    { key: 'completed', label: 'Selesai' },
    { key: 'r16', label: '16 Besar' },
    { key: 'group', label: 'Fase Grup' },
  ];

  const filtered = matches.filter((m) => {
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
    if (item.type === 'date-header') return DATE_HEADER_HEIGHT + 16; // header + spacing
    return MATCH_ROW_HEIGHT + MATCH_ROW_GAP;
  };

  // Use a fixed container height for virtualization; expand for small lists
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
    // match item
    return (
      <div
        key={`match-${item.matchId}`}
        style={{ position: 'absolute', top, left: 0, right: 0, height: MATCH_ROW_HEIGHT, marginBottom: MATCH_ROW_GAP }}
      >
        <MatchCard matchId={item.matchId} />
      </div>
    );
  };

  return (
    <div className="space-y-8">
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
        /* For small datasets, render normally without virtual scroll */
        <div style={{ position: 'relative', height: totalContentHeight }}>
          {listItems.map((item, idx) =>
            renderItem(item, offsets[idx])
          )}
        </div>
      )}
    </div>
  );
}