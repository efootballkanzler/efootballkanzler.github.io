'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GroupTable from '@/app/standings/components/GroupTable';
import { getLeagueGroupConfig } from '@/lib/leagueConfig';

export default function StandingsPage() {
  const [teamsAdvance, setTeamsAdvance] = useState(2);
  const [totalTeams, setTotalTeams] = useState(16);

  useEffect(() => {
    const cfg = getLeagueGroupConfig();
    setTeamsAdvance(cfg?.teamsAdvancePerGroup);
    setTotalTeams(cfg?.totalTeams);
  }, []);

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
                Musim 2026 — Fase Grup Selesai
              </span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
                Klasemen<br />
                <span className="text-gradient-gold">Liga</span>
              </h1>
              <p className="text-muted-foreground text-base mt-4 max-w-md leading-relaxed">
                Top {teamsAdvance} dari setiap grup otomatis lolos ke fase knock out. Total {totalTeams} tim berpartisipasi di fase grup.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <GroupTable />
        </div>
      </main>
      <Footer />
    </>
  );
}