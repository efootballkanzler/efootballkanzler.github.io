import React from 'react';
import Link from 'next/link';
import { matches, getTeamById } from '@/data/leagueData';

export default function RecentMatches() {
  const recentCompleted = matches?.filter((m) => m?.status === 'completed')?.slice(-4)?.reverse();

  const upcomingMatches = matches?.filter((m) => m?.status === 'upcoming')?.slice(0, 4);

  return (
    <section className="py-24 bg-primary/30 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <span className="section-num">03/</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">
              Pertandingan<br />
              <span className="text-gradient-gold">Terkini</span>
            </h2>
          </div>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 text-accent text-[12px] font-black uppercase tracking-widest hover:gap-4 transition-all"
          >
            Jadwal Lengkap
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Results */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
              Hasil Terakhir
            </h3>
            {recentCompleted?.map((match) => {
              const home = getTeamById(match?.homeTeamId);
              const away = getTeamById(match?.awayTeamId);
              return (
                <div key={match?.id} className="bg-card border border-border rounded-2xl p-5 match-card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {match?.stage === 'group' ? `Grup ${match?.group} — MD ${match?.matchDay}` : 'Knock Out'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Selesai</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-1 text-sm font-bold text-foreground text-right">{home?.shortName}</span>
                    <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
                      <span className="text-xl font-black text-foreground">{match?.homeScore}</span>
                      <span className="text-muted-foreground font-black">—</span>
                      <span className="text-xl font-black text-foreground">{match?.awayScore}</span>
                    </div>
                    <span className="flex-1 text-sm font-bold text-foreground">{away?.shortName}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 text-center mt-3 font-medium">
                    {match?.venue}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Upcoming */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
              Jadwal Mendatang
            </h3>
            {upcomingMatches?.map((match) => {
              const home = getTeamById(match?.homeTeamId);
              const away = getTeamById(match?.awayTeamId);
              return (
                <div key={match?.id} className="bg-card border border-border rounded-2xl p-5 match-card-hover relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-2xl"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {match?.date?.split('-')?.reverse()?.join('/')} — {match?.time}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent/70">
                      {match?.stage === 'r16' ? 'Knock Out' : `Grup ${match?.group}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-1 text-sm font-bold text-foreground text-right">{home?.shortName}</span>
                    <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-xl px-4 py-2">
                      <span className="text-[12px] font-black text-accent">VS</span>
                    </div>
                    <span className="flex-1 text-sm font-bold text-foreground">{away?.shortName}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 text-center mt-3 font-medium">
                    {match?.venue}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}