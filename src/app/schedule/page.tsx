import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchFilter from '@/app/schedule/components/MatchFilter';
import BracketDraw from '@/app/schedule/components/BracketDraw';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jadwal & Hasil — Kanzler eFootball League',
  description: 'Jadwal lengkap dan hasil pertandingan Kanzler eFootball League, termasuk fase grup dan 16 besar.',
};

export default function SchedulePage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-primary border border-border p-10 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/4 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-accent mb-3 block">
                Musim 2026 — Semua Pertandingan
              </span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
                Jadwal &<br />
                <span className="text-gradient-gold">Hasil Laga</span>
              </h1>
              <p className="text-muted-foreground text-base mt-4 max-w-md leading-relaxed">
                Seluruh jadwal dan hasil pertandingan fase grup dan 16 besar. Filter berdasarkan status atau babak.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main: Match list */}
            <div className="lg:col-span-8">
              <MatchFilter />
            </div>

            {/* Sidebar: Bracket */}
            <div className="lg:col-span-4">
              <BracketDraw />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}