'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LeagueConfig {
  leagueName: string;
  season: string;
  organizer: string;
  description: string;
  pointsWin: string;
  pointsDraw: string;
  pointsLoss: string;
  teamsAdvancePerGroup: string;
  tiebreaker: string;
  numberOfGroups: string;
  teamsPerGroup: string;
  groupNames: string;
  matchDuration: string;
  extraTime: string;
  penaltyShootout: string;
  maxSubstitutions: string;
  venue: string;
  additionalRules: string;
}

const defaultConfig: LeagueConfig = {
  leagueName: 'Kanzler eFootball League',
  season: '2026',
  organizer: 'Kanzler Organization',
  description: 'Kompetisi eFootball bergengsi yang mempertemukan tim-tim terbaik.',
  pointsWin: '3',
  pointsDraw: '1',
  pointsLoss: '0',
  teamsAdvancePerGroup: '2',
  tiebreaker: 'Selisih gol, gol terbanyak, head-to-head',
  numberOfGroups: '4',
  teamsPerGroup: '4',
  groupNames: 'A, B, C, D',
  matchDuration: '90',
  extraTime: 'Ya (2x15 menit)',
  penaltyShootout: 'Ya (jika imbang setelah extra time)',
  maxSubstitutions: '5',
  venue: 'Virtual Stadium',
  additionalRules: '',
};

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <h2 className="text-base font-black uppercase tracking-widest text-foreground">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-0">
      <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-[13px] font-semibold text-foreground text-right">{value || '—'}</span>
    </div>
  );
}

export default function KetentuanPage() {
  const [config, setConfig] = useState<LeagueConfig>(defaultConfig);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('admin_league_config');
      if (stored) {
        setConfig({ ...defaultConfig, ...JSON.parse(stored) });
      }
    } catch {
      // use default
    }
  }, []);

  if (!mounted) return null;

  const groups = config.groupNames
    ? config.groupNames.split(',').map(g => g.trim()).filter(Boolean)
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-foreground">Ketentuan</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <p className="text-[11px] font-black uppercase tracking-widest text-accent mb-3">Regulasi Resmi</p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-4">
              Ketentuan Liga
            </h1>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
              {config.description}
            </p>
          </div>

          {/* League identity badge */}
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-4 py-1.5 bg-accent/10 border border-accent/30 text-accent text-[11px] font-black uppercase tracking-widest rounded-full">
              {config.leagueName}
            </span>
            <span className="px-4 py-1.5 bg-border/50 text-muted-foreground text-[11px] font-black uppercase tracking-widest rounded-full">
              Musim {config.season}
            </span>
            <span className="px-4 py-1.5 bg-border/50 text-muted-foreground text-[11px] font-black uppercase tracking-widest rounded-full">
              {config.organizer}
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Informasi Liga */}
            <SectionCard title="Informasi Liga" icon="🏆">
              <InfoRow label="Nama Liga" value={config.leagueName} />
              <InfoRow label="Musim" value={config.season} />
              <InfoRow label="Penyelenggara" value={config.organizer} />
              <InfoRow label="Venue" value={config.venue} />
            </SectionCard>

            {/* Peraturan Turnamen */}
            <SectionCard title="Peraturan Turnamen" icon="📋">
              <InfoRow label="Poin Menang" value={`${config.pointsWin} poin`} />
              <InfoRow label="Poin Seri" value={`${config.pointsDraw} poin`} />
              <InfoRow label="Poin Kalah" value={`${config.pointsLoss} poin`} />
              <InfoRow label="Tim Lolos per Grup" value={`${config.teamsAdvancePerGroup} tim`} />
              <InfoRow label="Aturan Tiebreaker" value={config.tiebreaker} />
            </SectionCard>

            {/* Struktur Grup */}
            <SectionCard title="Struktur Grup" icon="🗂️">
              <InfoRow label="Jumlah Grup" value={`${config.numberOfGroups} grup`} />
              <InfoRow label="Tim per Grup" value={`${config.teamsPerGroup} tim`} />
              <div className="py-3 border-b border-border/50 last:border-0">
                <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Daftar Grup</span>
                {groups.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {groups.map(g => (
                      <span key={g} className="px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-[11px] font-black uppercase tracking-widest rounded-full">
                        Grup {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[13px] font-semibold text-foreground">—</span>
                )}
              </div>
            </SectionCard>

            {/* Regulasi Pertandingan */}
            <SectionCard title="Regulasi Pertandingan" icon="⚽">
              <InfoRow label="Durasi Pertandingan" value={`${config.matchDuration} menit`} />
              <InfoRow label="Extra Time" value={config.extraTime} />
              <InfoRow label="Adu Penalti" value={config.penaltyShootout} />
              <InfoRow label="Maks. Pergantian Pemain" value={`${config.maxSubstitutions} kali`} />
              {config.additionalRules && (
                <div className="pt-3">
                  <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Aturan Tambahan</span>
                  <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">{config.additionalRules}</p>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Footer note */}
          <p className="mt-10 text-center text-[12px] text-muted-foreground">
            Ketentuan ini ditetapkan oleh <span className="text-foreground font-semibold">{config.organizer}</span> dan berlaku sepanjang musim {config.season}.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
