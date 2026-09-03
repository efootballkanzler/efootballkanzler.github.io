import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GroupTable from '@/app/standings/components/GroupTable';
import TeamProfilesGrid from '@/app/standings/components/TeamProfilesGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Klasemen Grup — Kanzler eFootball League',
  description: 'Lihat klasemen lengkap semua grup Kanzler eFootball League: poin, menang, kalah, dan selisih gol setiap tim.',
};

export default function StandingsPage() {
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
                Top 2 dari setiap grup otomatis lolos ke 16 besar. Gunakan filter untuk melihat klasemen per grup.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main: Group Tables */}
            <div className="lg:col-span-8">
              <GroupTable />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <TeamProfilesGrid />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}