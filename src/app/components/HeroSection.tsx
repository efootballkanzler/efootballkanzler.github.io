'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { getLeagueGroupConfig, LEAGUE_CONFIG_EVENT } from '@/lib/leagueConfig';

export default function HeroSection() {
  const [totalTeams, setTotalTeams] = useState(16);
  const [numberOfGroups, setNumberOfGroups] = useState(4);

  useEffect(() => {
    const cfg = getLeagueGroupConfig();
    setTotalTeams(cfg.totalTeams);
    setNumberOfGroups(cfg.numberOfGroups);

    const refresh = () => {
      const updated = getLeagueGroupConfig();
      setTotalTeams(updated.totalTeams);
      setNumberOfGroups(updated.numberOfGroups);
    };

    window.addEventListener(LEAGUE_CONFIG_EVENT, refresh);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'admin_league_config') refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(LEAGUE_CONFIG_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-end pb-20 overflow-hidden noise-overlay">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_1a6ebf3a6-1772368608123.png"
          alt="Football stadium at night with floodlights illuminating the green pitch, dark atmospheric stands, dramatic shadows"
          fill
          priority
          quality={60}
          className="object-cover"
          sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 100vw" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"></div>
      </div>

      {/* Monolith Ghost Text */}
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
        <span className="monolith-ghost select-none">KANZLER</span>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="max-w-3xl space-y-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-accent live-badge inline-block"></span>
              Musim 2026
            </span>
            <span className="text-muted-foreground text-[11px] font-black uppercase tracking-widest">
              Fase Knock Out Dimulai
            </span>
          </div>

          <h1 className="hero-title font-extrabold text-foreground uppercase leading-none">
            Kanzler<br />
            <span className="text-gradient-gold">eFootball</span><br />
            League
          </h1>

          <p className="text-lg text-foreground/60 max-w-md leading-relaxed font-medium">
            Klasemen grup, bracket fase knock out, jadwal lengkap, dan profil tim — semua dalam satu tempat.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Link
              href="/standings"
              className="bg-accent text-accent-foreground px-8 py-3.5 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-accent/90 transition-all accent-glow flex items-center gap-2">
              
              Lihat Klasemen
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link
              href="/schedule"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-foreground px-8 py-3.5 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
              
              Jadwal Pertandingan
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 pt-6 border-t border-border/50">
            <div>
              <p className="text-3xl font-black text-foreground">{totalTeams}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Total Tim</p>
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">{numberOfGroups}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Grup Aktif</p>
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">0</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Pertandingan Dimainkan</p>
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">0</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Total Gol</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}