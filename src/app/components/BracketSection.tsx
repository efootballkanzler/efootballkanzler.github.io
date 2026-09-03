import React from 'react';
import Link from 'next/link';
import { matches, getTeamById } from '@/data/leagueData';

function BracketMatch({ matchId }: { matchId: string }) {
  const match = matches.find((m) => m.id === matchId);
  if (!match) return null;
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden card-glow match-card-hover w-full">
      <div className={`flex items-center justify-between px-4 py-3 border-b border-border/50 ${
        match.status === 'live' ? 'bg-red-500/10' : ''
      }`}>
        {match.status === 'live' && (
          <span className="text-[9px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 live-badge"></span>
            Live
          </span>
        )}
        {match.status === 'upcoming' && (
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            {match.date.split('-').reverse().join('/')}
          </span>
        )}
        {match.status === 'completed' && (
          <span className="text-[9px] font-black uppercase tracking-widest text-accent">Selesai</span>
        )}
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">16 Besar</span>
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-bold text-foreground flex-1 truncate">{home?.shortName}</span>
          {match.homeScore !== null ? (
            <span className="text-lg font-black text-foreground w-6 text-center">{match.homeScore}</span>
          ) : (
            <span className="text-[11px] font-black text-muted-foreground/40 w-6 text-center">-</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-bold text-foreground flex-1 truncate">{away?.shortName}</span>
          {match.awayScore !== null ? (
            <span className="text-lg font-black text-foreground w-6 text-center">{match.awayScore}</span>
          ) : (
            <span className="text-[11px] font-black text-muted-foreground/40 w-6 text-center">-</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BracketSection() {
  const r16Matches = matches.filter((m) => m.stage === 'r16');

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/3 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <span className="section-num">02/</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">
              Fase<br />
              <span className="text-gradient-gold">16 Besar</span>
            </h2>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
              Babak gugur dimulai. 16 tim terbaik bertarung menuju puncak.
            </p>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 text-accent text-[12px] font-black uppercase tracking-widest hover:gap-4 transition-all"
            >
              Lihat Semua Jadwal
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        {/* Bracket Grid: 2 cols of 4 matches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {r16Matches.map((m) => (
            <BracketMatch key={m.id} matchId={m.id} />
          ))}
        </div>

        {/* Next Round Placeholder */}
        <div className="mt-12 bg-card/50 border border-border rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
          <div className="relative z-10 space-y-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Babak Selanjutnya</p>
            <p className="text-2xl font-black uppercase tracking-tight text-foreground/30">Perempat Final</p>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Menunggu hasil 16 besar</p>
          </div>
        </div>
      </div>
    </section>
  );
}