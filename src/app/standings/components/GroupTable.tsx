'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { standings, getTeamById } from '@/data/leagueData';

const groups = ['A', 'B', 'C', 'D'];

const ROW_HEIGHT = 48; // px per standings row
const OVERSCAN = 2;

function useVirtualRows<T>(items: T[], rowHeight: number, containerHeight: number, overscan = OVERSCAN) {
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

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount);
  const totalHeight = items.length * rowHeight;

  return { scrollRef, startIndex, endIndex, totalHeight };
}

function FullGroupTable({ group }: { group: string }) {
  const data = standings[group];
  // For small datasets (≤ 20 rows), render all rows directly without virtual scroll overhead
  const VIRTUAL_THRESHOLD = 20;
  const shouldVirtualize = data.length > VIRTUAL_THRESHOLD;

  // Always call hooks unconditionally
  const containerHeight = data.length * ROW_HEIGHT;
  const { scrollRef, startIndex, endIndex, totalHeight } = useVirtualRows(data, ROW_HEIGHT, containerHeight);

  const renderRow = (s: typeof data[0], i: number) => {
    const team = getTeamById(s.teamId);
    if (!team) return null;
    const qualified = i < 2;
    return (
      <div
        key={s.teamId}
        className={`grid grid-cols-[20px_minmax(120px,2fr)_22px_22px_22px_22px_26px_30px_30px] gap-x-1 px-4 border-b border-border/30 last:border-0 transition-colors hover:bg-muted/30 items-center ${
          qualified ? 'border-l-2 border-l-accent' : 'border-l-2 border-l-transparent'
        }`}
        style={{ height: ROW_HEIGHT }}
      >
        <span className={`text-[12px] font-black ${qualified ? 'text-accent' : 'text-muted-foreground'}`}>{i + 1}</span>
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <div
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: team.colors.primary }}
          ></div>
          <Link href={`/team/${team.id}`} className="text-[13px] font-bold text-foreground hover:text-accent transition-colors truncate">
            {team.name}
          </Link>
        </div>
        <span className="text-[12px] font-bold text-muted-foreground text-center">{s.played}</span>
        <span className="text-[12px] font-bold text-muted-foreground text-center">{s.won}</span>
        <span className="text-[12px] font-bold text-muted-foreground text-center">{s.drawn}</span>
        <span className="text-[12px] font-bold text-muted-foreground text-center">{s.lost}</span>
        <span className="text-[12px] font-bold text-muted-foreground text-center">{s.gf}</span>
        <span className={`text-[12px] font-bold text-center ${s.gd > 0 ? 'text-green-400' : s.gd < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
          {s.gd > 0 ? `+${s.gd}` : s.gd}
        </span>
        <span className={`text-[14px] font-black text-right ${qualified ? 'text-accent' : 'text-foreground'}`}>
          {s.points}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden card-glow">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-primary/40">
        <span className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent text-[13px] font-black border border-accent/20">
          {group}
        </span>
        <span className="text-[12px] font-black uppercase tracking-widest text-foreground">Grup {group}</span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[20px_minmax(120px,2fr)_22px_22px_22px_22px_26px_30px_30px] gap-x-1 px-4 py-3 border-b border-border/50">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">#</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Tim</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 text-center">M</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 text-center">W</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 text-center">D</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 text-center">L</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 text-center">GF</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 text-center">GD</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-accent/70 text-right font-black">Pts</span>
      </div>

      {/* Virtualized rows for large datasets, direct render for small */}
      {shouldVirtualize ? (
        <div
          ref={scrollRef}
          style={{ height: Math.min(containerHeight, 400), overflowY: 'auto' }}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            {data.slice(startIndex, endIndex + 1).map((s, idx) =>
              <div
                key={s.teamId}
                style={{ position: 'absolute', top: (startIndex + idx) * ROW_HEIGHT, left: 0, right: 0 }}
              >
                {renderRow(s, startIndex + idx)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {data.map((s, i) => renderRow(s, i))}
        </div>
      )}
    </div>
  );
}

export default function GroupTable() {
  const [activeGroup, setActiveGroup] = useState<string>('all');

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveGroup('all')}
          className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
            activeGroup === 'all' ? 'group-tab-active' : 'group-tab-inactive hover:text-foreground'
          }`}
        >
          Semua Grup
        </button>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
              activeGroup === g ? 'group-tab-active' : 'group-tab-inactive hover:text-foreground'
            }`}
          >
            Grup {g}
          </button>
        ))}
      </div>

      {/* Tables */}
      {activeGroup === 'all' ? (
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((g) => (
            <FullGroupTable key={g} group={g} />
          ))}
        </div>
      ) : (
        <FullGroupTable group={activeGroup} />
      )}
    </div>
  );
}