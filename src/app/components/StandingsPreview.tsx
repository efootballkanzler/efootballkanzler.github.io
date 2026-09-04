import React from 'react';
import Link from 'next/link';
import { standings, getTeamById } from '@/data/leagueData';

function GroupMiniTable({ group, label }: { group: string; label: string }) {
  const groupStandings = standings[group];
  const top2 = groupStandings.slice(0, 2);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 card-glow">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-[11px] font-black">
            {label}
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Grup {label}
          </span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">Lolos ↑</span>
      </div>

      <div className="space-y-2">
        {groupStandings.map((s, i) => {
          const team = getTeamById(s.teamId);
          if (!team) return null;
          const qualified = i < 2;
          return (
            <div
              key={s.teamId}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                qualified ? 'bg-accent/5 border border-accent/10' : 'border border-transparent'
              }`}
            >
              <span className={`text-[11px] font-black w-4 ${qualified ? 'text-accent' : 'text-muted-foreground'}`}>
                {i + 1}
              </span>
              <span className="flex-1 text-[13px] font-bold text-foreground truncate">
                {team.shortName}
              </span>
              <span className="text-[11px] font-black text-muted-foreground w-6 text-center">{s.played}</span>
              <span className="text-[11px] font-black text-muted-foreground w-6 text-center">{s.won}</span>
              <span className={`text-[13px] font-black w-6 text-right ${qualified ? 'text-accent' : 'text-foreground'}`}>
                {s.points}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mt-3 px-3">
        <span className="w-4"></span>
        <span className="flex-1">Tim</span>
        <span className="w-6 text-center">M</span>
        <span className="w-6 text-center">M</span>
        <span className="w-6 text-right">Pts</span>
      </div>
    </div>
  );
}

export default function StandingsPreview() {
  return (
    <section className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <span className="section-num">01/</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">
              Klasemen<br />
              <span className="text-gradient-gold">Grup</span>
            </h2>
          </div>
          <div className="space-y-3 max-w-xs">
            <p className="text-muted-foreground text-base leading-relaxed">
              Top 2 dari setiap grup melaju ke fase knock out. 8 tim terbaik runner-up juga bisa lolos.
            </p>
            <Link
              href="/standings"
              className="inline-flex items-center gap-2 text-accent text-[12px] font-black uppercase tracking-widest hover:gap-4 transition-all"
            >
              Lihat Semua Klasemen
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GroupMiniTable group="A" label="A" />
          <GroupMiniTable group="B" label="B" />
          <GroupMiniTable group="C" label="C" />
          <GroupMiniTable group="D" label="D" />
        </div>
      </div>
    </section>
  );
}