import React from 'react';
import Link from 'next/link';
import { teams, standings } from '@/data/leagueData';

export default function TeamProfilesGrid() {
  return (
    <div className="space-y-6">
      <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground">Profil Tim</h3>
      <div className="grid grid-cols-1 gap-4">
        {teams?.slice(0, 8)?.map((team) => {
          const groupStandings = standings?.[team?.group];
          const teamStat = groupStandings?.find((s) => s?.teamId === team?.id);
          const rank = groupStandings?.findIndex((s) => s?.teamId === team?.id) + 1;
          const qualified = rank <= 2;

          return (
            <Link key={team?.id} href={`/team/${team?.id}`} className="bg-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors block">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] font-black"
                  style={{ backgroundColor: team?.colors?.primary }}
                >
                  {team?.shortName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-foreground truncate">{team?.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{team?.city} · Grup {team?.group}</p>
                </div>
                {qualified && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20">
                    Lolos
                  </span>
                )}
              </div>
              {teamStat && (
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <p className="text-[14px] font-black text-foreground">{teamStat?.points}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Pts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-black text-foreground">{teamStat?.won}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Menang</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-black text-foreground">{teamStat?.gf}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Gol</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-[14px] font-black ${teamStat?.gd >= 0 ? 'text-green-400' : 'text-red-400'}`}>{teamStat?.gd > 0 ? `+${teamStat?.gd}` : teamStat?.gd}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">GD</p>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}