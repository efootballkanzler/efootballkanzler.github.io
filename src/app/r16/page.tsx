'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { matches, getTeamById, Match } from '@/data/leagueData';

interface BracketMatchCardProps {
  match: Match;
  index: number;
}

function BracketMatchCard({ match, index }: BracketMatchCardProps) {
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  const homeWin = isCompleted && match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore;
  const awayWin = isCompleted && match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore;

  return (
    <div className="relative group">
      {/* Match number badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <span className="bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
          M{index + 1}
        </span>
      </div>

      <div className={`bg-card border rounded-xl overflow-hidden transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-lg group-hover:shadow-accent/10 ${
        isLive ? 'border-red-500/50' : 'border-border'
      }`}>
        {/* Header bar */}
        <div className={`px-3 py-1.5 flex items-center justify-between ${
          isLive ? 'bg-red-500/10' : 'bg-card/80'
        }`}>
          {isLive && (
            <span className="text-[8px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              Live
            </span>
          )}
          {!isLive && (
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
              {match.date.split('-').reverse().join('/')}
            </span>
          )}
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
            {match.time}
          </span>
        </div>

        {/* Teams */}
        <div className="px-3 py-2 space-y-1.5">
          {/* Home */}
          <div className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-colors ${
            homeWin ? 'bg-accent/10' : 'bg-transparent'
          }`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {homeWin && <span className="w-1 h-4 rounded-full bg-accent flex-shrink-0"></span>}
              <span className={`text-[11px] font-black truncate ${homeWin ? 'text-accent' : 'text-foreground'}`}>
                {home?.shortName}
              </span>
            </div>
            <span className={`text-base font-black w-5 text-center flex-shrink-0 ${
              homeWin ? 'text-accent' : match.homeScore !== null ? 'text-foreground' : 'text-muted-foreground/30'
            }`}>
              {match.homeScore !== null ? match.homeScore : '-'}
            </span>
          </div>

          <div className="h-px bg-border/50 mx-2"></div>

          {/* Away */}
          <div className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-colors ${
            awayWin ? 'bg-accent/10' : 'bg-transparent'
          }`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {awayWin && <span className="w-1 h-4 rounded-full bg-accent flex-shrink-0"></span>}
              <span className={`text-[11px] font-black truncate ${awayWin ? 'text-accent' : 'text-foreground'}`}>
                {away?.shortName}
              </span>
            </div>
            <span className={`text-base font-black w-5 text-center flex-shrink-0 ${
              awayWin ? 'text-accent' : match.awayScore !== null ? 'text-foreground' : 'text-muted-foreground/30'
            }`}>
              {match.awayScore !== null ? match.awayScore : '-'}
            </span>
          </div>
        </div>

        {/* Venue */}
        <div className="px-3 pb-2">
          <p className="text-[8px] text-muted-foreground/50 font-medium truncate">{match.venue}</p>
        </div>
      </div>
    </div>
  );
}

function ConnectorLine({ direction }: { direction: 'top' | 'bottom' }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className={`w-full border-r-2 border-dashed border-accent/20 ${
        direction === 'top' ? 'h-1/2 self-end' : 'h-1/2 self-start'
      }`}></div>
    </div>
  );
}

export default function R16Page() {
  const r16Matches = matches.filter((m) => m.stage === 'r16');
  const [view, setView] = useState<'bracket' | 'list'>('bracket');

  // Split into two halves for bracket display
  const topHalf = r16Matches.slice(0, 4);
  const bottomHalf = r16Matches.slice(4, 8);

  const completedCount = r16Matches.filter(m => m.status === 'completed').length;
  const upcomingCount = r16Matches.filter(m => m.status === 'upcoming').length;
  const liveCount = r16Matches.filter(m => m.status === 'live').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Page Header */}
        <div className="max-w-[1400px] mx-auto px-6 mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Beranda
                </Link>
                <span className="text-muted-foreground/30 text-[10px]">/</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">16 Besar</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-foreground">
                Fase <span className="text-gradient-gold">16 Besar</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-md">
                Babak gugur — 16 tim terbaik dari fase grup bertarung menuju perempat final.
              </p>
            </div>

            {/* Stats + View Toggle */}
            <div className="flex flex-col items-end gap-4">
              {/* Stats pills */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{completedCount} Selesai</span>
                </div>
                {liveCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{liveCount} Live</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{upcomingCount} Akan Datang</span>
                </div>
              </div>

              {/* View toggle */}
              <div className="flex items-center bg-card border border-border rounded-full p-1 gap-1">
                <button
                  onClick={() => setView('bracket')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    view === 'bracket' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Bracket
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    view === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BRACKET VIEW — Landscape horizontal layout */}
        {view === 'bracket' && (
          <div className="max-w-[1400px] mx-auto px-6">
            {/* Bracket container — horizontal scroll on small screens */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[900px]">

                {/* Section label */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3">Babak 16 Besar → Perempat Final</span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                {/* Main bracket: R16 (8 matches) → QF placeholder (4 slots) → SF placeholder (2 slots) → Final placeholder */}
                <div className="flex items-stretch gap-0">

                  {/* ── Column 1: R16 Top Half (matches 1-4) ── */}
                  <div className="flex flex-col gap-3 w-[200px] flex-shrink-0">
                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 text-center mb-1">16 Besar</div>
                    {topHalf.map((match, i) => (
                      <div key={match.id} className="flex-1 flex flex-col justify-center" style={{ minHeight: '110px' }}>
                        <BracketMatchCard match={match} index={i} />
                      </div>
                    ))}
                  </div>

                  {/* Connector: R16 top → QF */}
                  <div className="flex flex-col w-10 flex-shrink-0">
                    <div className="flex-1"></div>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 flex items-center" style={{ minHeight: '110px' }}>
                        <div className="w-full h-px border-t-2 border-dashed border-accent/20"></div>
                      </div>
                    ))}
                    <div className="flex-1"></div>
                  </div>

                  {/* ── Column 2: QF Top Half (4 slots) ── */}
                  <div className="flex flex-col gap-3 w-[180px] flex-shrink-0 justify-around">
                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 text-center mb-1">Perempat Final</div>
                    {[0, 1].map((i) => (
                      <div key={i} className="flex-1 flex flex-col justify-center" style={{ minHeight: '220px' }}>
                        <QFPlaceholder label={`QF ${i + 1}`} />
                      </div>
                    ))}
                  </div>

                  {/* Connector: QF → SF */}
                  <div className="flex flex-col w-10 flex-shrink-0 justify-around">
                    {[0, 1].map((i) => (
                      <div key={i} className="flex-1 flex items-center" style={{ minHeight: '220px' }}>
                        <div className="w-full h-px border-t-2 border-dashed border-accent/20"></div>
                      </div>
                    ))}
                  </div>

                  {/* ── Column 3: SF Top (1 slot) ── */}
                  <div className="flex flex-col w-[160px] flex-shrink-0 justify-center">
                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 text-center mb-3">Semi Final</div>
                    <SFPlaceholder label="SF 1" />
                  </div>

                  {/* Connector: SF → Final */}
                  <div className="flex flex-col w-10 flex-shrink-0 justify-center">
                    <div className="w-full h-px border-t-2 border-dashed border-accent/30"></div>
                  </div>

                  {/* ── Column 4: Final ── */}
                  <div className="flex flex-col w-[160px] flex-shrink-0 justify-center">
                    <div className="text-[9px] font-black uppercase tracking-widest text-accent/70 text-center mb-3">Final</div>
                    <FinalPlaceholder />
                  </div>

                  {/* Connector: SF → Final (bottom) */}
                  <div className="flex flex-col w-10 flex-shrink-0 justify-center">
                    <div className="w-full h-px border-t-2 border-dashed border-accent/30"></div>
                  </div>

                  {/* ── Column 3b: SF Bottom (1 slot) ── */}
                  <div className="flex flex-col w-[160px] flex-shrink-0 justify-center">
                    <SFPlaceholder label="SF 2" />
                  </div>

                  {/* Connector: QF → SF (bottom) */}
                  <div className="flex flex-col w-10 flex-shrink-0 justify-around">
                    {[0, 1].map((i) => (
                      <div key={i} className="flex-1 flex items-center" style={{ minHeight: '220px' }}>
                        <div className="w-full h-px border-t-2 border-dashed border-accent/20"></div>
                      </div>
                    ))}
                  </div>

                  {/* ── Column 2b: QF Bottom Half (2 slots) ── */}
                  <div className="flex flex-col gap-3 w-[180px] flex-shrink-0 justify-around">
                    {[2, 3].map((i) => (
                      <div key={i} className="flex-1 flex flex-col justify-center" style={{ minHeight: '220px' }}>
                        <QFPlaceholder label={`QF ${i + 1}`} />
                      </div>
                    ))}
                  </div>

                  {/* Connector: R16 bottom → QF */}
                  <div className="flex flex-col w-10 flex-shrink-0">
                    <div className="flex-1"></div>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 flex items-center" style={{ minHeight: '110px' }}>
                        <div className="w-full h-px border-t-2 border-dashed border-accent/20"></div>
                      </div>
                    ))}
                    <div className="flex-1"></div>
                  </div>

                  {/* ── Column 1b: R16 Bottom Half (matches 5-8) ── */}
                  <div className="flex flex-col gap-3 w-[200px] flex-shrink-0">
                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 text-center mb-1">16 Besar</div>
                    {bottomHalf.map((match, i) => (
                      <div key={match.id} className="flex-1 flex flex-col justify-center" style={{ minHeight: '110px' }}>
                        <BracketMatchCard match={match} index={i + 4} />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {r16Matches.map((match, i) => (
                <BracketMatchCard key={match.id} match={match} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Next Round Info */}
        <div className="max-w-[1400px] mx-auto px-6 mt-12">
          <div className="bg-card/50 border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Babak Selanjutnya</p>
                <p className="text-3xl font-black uppercase tracking-tight text-foreground/30">Perempat Final</p>
                <p className="text-[11px] text-muted-foreground/60">
                  {completedCount < 8
                    ? `Menunggu ${8 - completedCount} pertandingan lagi`
                    : 'Semua pertandingan selesai — bracket perempat final siap!'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-4xl font-black text-foreground/20">{completedCount}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Selesai</div>
                </div>
                <div className="text-2xl font-black text-muted-foreground/20">/</div>
                <div className="text-center">
                  <div className="text-4xl font-black text-accent/40">8</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function QFPlaceholder({ label }: { label: string }) {
  return (
    <div className="bg-card/30 border border-dashed border-border/50 rounded-xl p-3 space-y-2">
      <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">{label}</div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-2 py-1.5 bg-background/30 rounded-lg">
          <div className="h-2 w-16 bg-muted-foreground/10 rounded"></div>
          <div className="h-4 w-4 bg-muted-foreground/10 rounded"></div>
        </div>
        <div className="h-px bg-border/30 mx-2"></div>
        <div className="flex items-center justify-between px-2 py-1.5 bg-background/30 rounded-lg">
          <div className="h-2 w-14 bg-muted-foreground/10 rounded"></div>
          <div className="h-4 w-4 bg-muted-foreground/10 rounded"></div>
        </div>
      </div>
      <p className="text-[8px] text-center text-muted-foreground/30 font-medium">TBD</p>
    </div>
  );
}

function SFPlaceholder({ label }: { label: string }) {
  return (
    <div className="bg-card/20 border border-dashed border-accent/20 rounded-xl p-3 space-y-2">
      <div className="text-[8px] font-black uppercase tracking-widest text-accent/40 text-center">{label}</div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-2 py-1.5 bg-background/20 rounded-lg">
          <div className="h-2 w-12 bg-accent/10 rounded"></div>
          <div className="h-4 w-4 bg-accent/10 rounded"></div>
        </div>
        <div className="h-px bg-accent/10 mx-2"></div>
        <div className="flex items-center justify-between px-2 py-1.5 bg-background/20 rounded-lg">
          <div className="h-2 w-10 bg-accent/10 rounded"></div>
          <div className="h-4 w-4 bg-accent/10 rounded"></div>
        </div>
      </div>
      <p className="text-[8px] text-center text-accent/30 font-medium">TBD</p>
    </div>
  );
}

function FinalPlaceholder() {
  return (
    <div className="bg-gradient-to-b from-accent/10 to-accent/5 border border-accent/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <div className="text-[9px] font-black uppercase tracking-widest text-accent text-center mb-3">🏆 Final</div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-2 py-2 bg-background/30 rounded-lg">
            <div className="h-2 w-14 bg-accent/20 rounded"></div>
            <div className="h-4 w-4 bg-accent/20 rounded"></div>
          </div>
          <div className="h-px bg-accent/20 mx-2"></div>
          <div className="flex items-center justify-between px-2 py-2 bg-background/30 rounded-lg">
            <div className="h-2 w-12 bg-accent/20 rounded"></div>
            <div className="h-4 w-4 bg-accent/20 rounded"></div>
          </div>
        </div>
        <p className="text-[8px] text-center text-accent/50 font-black uppercase tracking-widest mt-2">TBD</p>
      </div>
    </div>
  );
}
