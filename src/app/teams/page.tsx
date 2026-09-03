import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { teams, standings } from '@/data/leagueData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Tim — Kanzler eFootball League',
  description: 'Lihat profil lengkap semua tim peserta Kanzler eFootball League.',
};

export default function TeamsPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-primary border border-border p-10 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-accent mb-3 block">
                Musim 2026 — Semua Tim
              </span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
                Profil<br />
                <span className="text-gradient-gold">Tim</span>
              </h1>
              <p className="text-muted-foreground text-base mt-4 max-w-md leading-relaxed">
                Semua tim peserta Kanzler eFootball League. Klik tim untuk melihat profil lengkap dan skuad pemain.
              </p>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {teams?.map((team) => {
              const groupStandings = standings?.[team?.group];
              const teamStat = groupStandings?.find((s) => s?.teamId === team?.id);
              const rank = groupStandings?.findIndex((s) => s?.teamId === team?.id) + 1;
              const qualified = rank <= 2;

              return (
                <Link
                  key={team?.id}
                  href={`/team/${team?.id}`}
                  className="bg-card border border-border rounded-xl p-5 hover:border-accent/40 hover:bg-card/80 transition-all block group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-[12px] font-black shadow-lg"
                      style={{ backgroundColor: team?.colors?.primary }}
                    >
                      {team?.shortName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground truncate group-hover:text-accent transition-colors">{team?.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{team?.city} · Grup {team?.group}</p>
                    </div>
                    {qualified && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20 flex-shrink-0">
                        Lolos
                      </span>
                    )}
                  </div>
                  {teamStat && (
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
                      <div className="text-center">
                        <p className="text-[15px] font-black text-foreground">{teamStat?.points}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Pts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[15px] font-black text-foreground">{teamStat?.won}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Menang</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[15px] font-black text-foreground">{teamStat?.gf}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Gol</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-[15px] font-black ${(teamStat?.gd ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(teamStat?.gd ?? 0) > 0 ? `+${teamStat?.gd}` : teamStat?.gd}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">GD</p>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
