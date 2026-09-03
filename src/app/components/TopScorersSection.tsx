import React from 'react';

import AppImage from '@/components/ui/AppImage';
import { topScorers } from '@/data/leagueData';

export default function TopScorersSection() {
  const maxGoals = topScorers?.[0]?.goals ?? 1;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-1">
            <span className="section-num">04/</span>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">
              Top<br />
              <span className="text-gradient-gold">Pencetak Gol</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Pemain dengan gol terbanyak di fase grup. Siapa yang akan terus mencetak gol di 16 besar?
            </p>
            {/* Featured top scorer */}
            <div className="bg-card border border-accent/20 rounded-2xl p-8 card-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-2xl rounded-full"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Pencetak Gol Terbanyak</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent/30 flex-shrink-0">
                    <AppImage
                      src="https://img.rocket.new/generatedImages/rocket_gen_img_15195245a-1766470957200.png"
                      alt="Hendra Wijaya PSM Makassar top scorer portrait"
                      width={56}
                      height={56}
                      className="object-cover w-full h-full" />
                    
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-foreground">Hendra Wijaya</p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">PSM Makassar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-gradient-gold">11</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gol</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {topScorers?.map((scorer, index) =>
            <div key={scorer?.playerId} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/30 transition-colors group">
                <span className={`text-[13px] font-black w-6 text-center ${index === 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-foreground truncate">{scorer?.playerName}</p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{scorer?.teamName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                    className="stat-bar-fill"
                    style={{ width: `${scorer?.goals / maxGoals * 100}%` }}>
                  </div>
                  </div>
                  <span className={`text-[15px] font-black w-8 text-right ${index === 0 ? 'text-accent' : 'text-foreground'}`}>
                    {scorer?.goals}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}