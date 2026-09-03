'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  teams,
  standings,
  matches,
  getTeamById,
  type Team,
  type Player,
} from '@/data/leagueData';

const positionOrder: Record<string, number> = { GK: 0, CB: 1, LB: 2, RB: 3, CDM: 4, CM: 5, CAM: 6, LW: 7, RW: 8, ST: 9 };
const positionColor: Record<string, string> = {
  GK: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  CB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  RB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CDM: 'bg-green-500/20 text-green-400 border-green-500/30',
  CM: 'bg-green-500/20 text-green-400 border-green-500/30',
  CAM: 'bg-green-500/20 text-green-400 border-green-500/30',
  LW: 'bg-red-500/20 text-red-400 border-red-500/30',
  RW: 'bg-red-500/20 text-red-400 border-red-500/30',
  ST: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-primary border border-border rounded-2xl p-5 flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-3xl font-black text-foreground leading-none">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

export default function TeamPage() {
  const params = useParams();
  const teamId = params?.id as string;
  const team = getTeamById(teamId);
  const [activeTab, setActiveTab] = useState<'roster' | 'matches' | 'stats' | 'h2h' | 'lineup'>('roster');

  if (!team) {
    return (
      <>
        <Header />
        <main className="pt-40 pb-24 min-h-screen flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-lg">Tim tidak ditemukan.</p>
          <Link href="/standings" className="mt-6 text-accent font-bold hover:underline">← Kembali ke Klasemen</Link>
        </main>
        <Footer />
      </>
    );
  }

  const groupStandings = standings[team.group] ?? [];
  const teamStanding = groupStandings.find(s => s.teamId === team.id);
  const groupRank = groupStandings.findIndex(s => s.teamId === team.id) + 1;

  // Head-to-head matches involving this team
  const teamMatches = matches.filter(
    m => m.homeTeamId === team.id || m.awayTeamId === team.id
  );

  // Compute H2H records vs each opponent
  const h2hMap: Record<string, { opponent: Team; w: number; d: number; l: number; gf: number; ga: number }> = {};
  teamMatches.forEach(m => {
    if (m.homeScore === null || m.awayScore === null) return;
    const isHome = m.homeTeamId === team.id;
    const oppId = isHome ? m.awayTeamId : m.homeTeamId;
    const opp = getTeamById(oppId);
    if (!opp) return;
    const gf = isHome ? m.homeScore : m.awayScore;
    const ga = isHome ? m.awayScore : m.homeScore;
    if (!h2hMap[oppId]) h2hMap[oppId] = { opponent: opp, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
    h2hMap[oppId].gf += gf;
    h2hMap[oppId].ga += ga;
    if (gf > ga) h2hMap[oppId].w++;
    else if (gf === ga) h2hMap[oppId].d++;
    else h2hMap[oppId].l++;
  });
  const h2hList = Object.values(h2hMap);

  // Sorted roster
  const sortedPlayers = [...(team.players ?? [])].sort(
    (a, b) => (positionOrder[a.position] ?? 99) - (positionOrder[b.position] ?? 99)
  );

  // Group performance: all group teams standings
  const groupTeams = groupStandings.map(s => ({
    ...s,
    team: getTeamById(s.teamId),
  }));

  const tabs = [
    { key: 'roster', label: 'Skuad' },
    { key: 'matches', label: 'Pertandingan' },
    { key: 'stats', label: 'Statistik' },
    { key: 'h2h', label: 'Head-to-Head' },
    { key: 'lineup', label: 'Lineup' },
  ] as const;

  return (
    <>
      <Header />
      <main className="pt-28 pb-24">
        {/* Hero Banner */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div
            className="relative overflow-hidden rounded-3xl border border-border p-8 md:p-12"
            style={{ background: `linear-gradient(135deg, ${team.colors.primary}22 0%, #0a0a0f 60%, ${team.colors.secondary}11 100%)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: team.colors.primary }} />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              {/* Color badge */}
              <div
                className="w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-2xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary === '#FFFFFF' ? team.colors.primary + '99' : team.colors.secondary})` }}
              >
                {team.shortName}
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-1 block">
                  Grup {team.group} · {team.city}
                </span>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-none mb-3">
                  {team.name}
                </h1>
                <div className="flex flex-wrap gap-3 mt-2">
                  {teamStanding && (
                    <>
                      <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                        #{groupRank} Grup {team.group}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-foreground/70 text-xs font-bold">
                        {teamStanding.points} Poin
                      </span>
                      <span className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-foreground/70 text-xs font-bold">
                        {teamStanding.played} Pertandingan
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Link
                href="/standings"
                className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-4 py-2"
              >
                ← Klasemen
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex gap-1 bg-primary border border-border rounded-2xl p-1 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.key
                    ? 'bg-accent text-accent-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* ── ROSTER TAB ── */}
          {activeTab === 'roster' && (
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">
                Skuad Pemain <span className="text-muted-foreground font-normal text-base">({sortedPlayers.length} pemain)</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedPlayers.map((player: Player) => (
                  <div key={player.id} className="bg-primary border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-accent/40 transition-colors">
                    <div className="relative shrink-0">
                      <img
                        src={player.photo}
                        alt={`Foto pemain ${player.name}`}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-black text-foreground">
                        {player.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{player.name}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${positionColor[player.position] ?? 'bg-foreground/5 text-foreground/60 border-border'}`}>
                        {player.position}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-black text-accent">{player.goals}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Gol</p>
                    </div>
                  </div>
                ))}
                {sortedPlayers.length === 0 && (
                  <p className="text-muted-foreground col-span-3 py-8 text-center">Data skuad belum tersedia.</p>
                )}
              </div>
            </div>
          )}

          {/* ── MATCHES TAB ── */}
          {activeTab === 'matches' && (
            <div className="space-y-10">
              {/* Recent Results */}
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">
                  Hasil Terkini
                  <span className="text-muted-foreground font-normal text-base ml-2">
                    ({teamMatches.filter(m => m.status === 'completed').length} pertandingan)
                  </span>
                </h2>
                {teamMatches.filter(m => m.status === 'completed').length === 0 ? (
                  <p className="text-muted-foreground text-sm">Belum ada pertandingan selesai.</p>
                ) : (
                  <div className="space-y-3">
                    {teamMatches
                      .filter(m => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(m => {
                        const isHome = m.homeTeamId === team.id;
                        const opp = getTeamById(isHome ? m.awayTeamId : m.homeTeamId);
                        const myScore = isHome ? m.homeScore! : m.awayScore!;
                        const oppScore = isHome ? m.awayScore! : m.homeScore!;
                        const result = myScore > oppScore ? 'W' : myScore === oppScore ? 'D' : 'L';
                        const resultColor =
                          result === 'W' ?'text-green-400 bg-green-500/10 border-green-500/20'
                            : result === 'D' ?'text-amber-400 bg-amber-500/10 border-amber-500/20' :'text-red-400 bg-red-500/10 border-red-500/20';
                        return (
                          <div key={m.id} className="bg-primary border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-accent/30 transition-colors">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border shrink-0 ${resultColor}`}>
                              {result}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white shrink-0"
                                  style={{ background: opp?.colors.primary ?? '#666' }}
                                >
                                  {opp?.shortName}
                                </div>
                                <p className="text-sm font-bold text-foreground truncate">
                                  {isHome ? 'vs' : '@'} {opp?.name ?? 'Unknown'}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {m.date} · {m.venue}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-2xl font-black text-foreground leading-none">
                                {myScore}
                                <span className="text-muted-foreground mx-1">–</span>
                                {oppScore}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
                                {m.stage === 'group' ? `Grup ${m.group}` : m.stage === 'r16' ? '16 Besar' : m.stage === 'qf' ? 'Perempat Final' : m.stage === 'sf' ? 'Semi Final' : 'Final'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Upcoming Fixtures */}
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">
                  Jadwal Mendatang
                  <span className="text-muted-foreground font-normal text-base ml-2">
                    ({teamMatches.filter(m => m.status === 'upcoming').length} pertandingan)
                  </span>
                </h2>
                {teamMatches.filter(m => m.status === 'upcoming').length === 0 ? (
                  <p className="text-muted-foreground text-sm">Tidak ada jadwal mendatang.</p>
                ) : (
                  <div className="space-y-3">
                    {teamMatches
                      .filter(m => m.status === 'upcoming')
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(m => {
                        const isHome = m.homeTeamId === team.id;
                        const opp = getTeamById(isHome ? m.awayTeamId : m.homeTeamId);
                        return (
                          <div key={m.id} className="bg-primary border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-accent/30 transition-colors">
                            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white shrink-0"
                                  style={{ background: opp?.colors.primary ?? '#666' }}
                                >
                                  {opp?.shortName}
                                </div>
                                <p className="text-sm font-bold text-foreground truncate">
                                  {isHome ? 'vs' : '@'} {opp?.name ?? 'Unknown'}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {m.date} · {m.time} · {m.venue}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-wide">
                                {m.stage === 'group' ? `Grup ${m.group}` : m.stage === 'r16' ? '16 Besar' : m.stage === 'qf' ? 'Perempat Final' : m.stage === 'sf' ? 'Semi Final' : 'Final'}
                              </span>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {isHome ? 'Kandang' : 'Tandang'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STATS TAB ── */}
          {activeTab === 'stats' && (
            <div className="space-y-10">
              {/* Season Stats */}
              {teamStanding ? (
                <>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Statistik Musim</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      <StatCard label="Poin" value={teamStanding.points} sub="Total poin" />
                      <StatCard label="Main" value={teamStanding.played} sub="Pertandingan" />
                      <StatCard label="Menang" value={teamStanding.won} sub="Kemenangan" />
                      <StatCard label="Seri" value={teamStanding.drawn} sub="Hasil seri" />
                      <StatCard label="Kalah" value={teamStanding.lost} sub="Kekalahan" />
                      <StatCard label="Gol Masuk" value={teamStanding.gf} sub="Gol dicetak" />
                      <StatCard label="Gol Kemasukan" value={teamStanding.ga} sub="Gol kebobolan" />
                      <StatCard label="Selisih Gol" value={teamStanding.gd > 0 ? `+${teamStanding.gd}` : teamStanding.gd} sub="Goal difference" />
                    </div>
                  </div>

                  {/* Win rate bar */}
                  <div className="bg-primary border border-border rounded-2xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Performa Keseluruhan</h3>
                    <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-3">
                      {teamStanding.won > 0 && (
                        <div
                          className="bg-green-500 transition-all"
                          style={{ width: `${(teamStanding.won / teamStanding.played) * 100}%` }}
                          title={`Menang: ${teamStanding.won}`}
                        />
                      )}
                      {teamStanding.drawn > 0 && (
                        <div
                          className="bg-amber-500 transition-all"
                          style={{ width: `${(teamStanding.drawn / teamStanding.played) * 100}%` }}
                          title={`Seri: ${teamStanding.drawn}`}
                        />
                      )}
                      {teamStanding.lost > 0 && (
                        <div
                          className="bg-red-500 transition-all"
                          style={{ width: `${(teamStanding.lost / teamStanding.played) * 100}%` }}
                          title={`Kalah: ${teamStanding.lost}`}
                        />
                      )}
                    </div>
                    <div className="flex gap-6 text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Menang ({teamStanding.won})</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Seri ({teamStanding.drawn})</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Kalah ({teamStanding.lost})</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Data statistik tidak tersedia.</p>
              )}

              {/* Top scorers from this team */}
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Top Pencetak Gol Tim</h3>
                <div className="space-y-3">
                  {sortedPlayers.filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals).map((player, i) => (
                    <div key={player.id} className="bg-primary border border-border rounded-xl p-4 flex items-center gap-4">
                      <span className="text-muted-foreground font-black text-sm w-5 text-center">{i + 1}</span>
                      <img src={player.photo} alt={`Foto ${player.name}`} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-foreground">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.position} · #{player.number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-accent">{player.goals}</p>
                        <p className="text-[10px] text-muted-foreground">Gol</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-foreground/60">{player.assists}</p>
                        <p className="text-[10px] text-muted-foreground">Assist</p>
                      </div>
                    </div>
                  ))}
                  {sortedPlayers.filter(p => p.goals > 0).length === 0 && (
                    <p className="text-muted-foreground text-sm">Belum ada data gol.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── HEAD-TO-HEAD TAB ── */}
          {activeTab === 'h2h' && (
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Rekam Head-to-Head</h2>
              {h2hList.length === 0 ? (
                <p className="text-muted-foreground">Belum ada data pertandingan selesai.</p>
              ) : (
                <div className="space-y-4">
                  {h2hList.map(({ opponent, w, d, l, gf, ga }) => {
                    const total = w + d + l;
                    return (
                      <div key={opponent.id} className="bg-primary border border-border rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white"
                              style={{ background: opponent.colors.primary }}
                            >
                              {opponent.shortName}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{opponent.name}</p>
                              <p className="text-xs text-muted-foreground">Grup {opponent.group} · {total} pertandingan</p>
                            </div>
                          </div>
                          <div className="flex gap-4 text-center">
                            <div>
                              <p className="text-xl font-black text-green-400">{w}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">M</p>
                            </div>
                            <div>
                              <p className="text-xl font-black text-amber-400">{d}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">S</p>
                            </div>
                            <div>
                              <p className="text-xl font-black text-red-400">{l}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">K</p>
                            </div>
                            <div>
                              <p className="text-xl font-black text-foreground">{gf}–{ga}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">Gol</p>
                            </div>
                          </div>
                        </div>
                        {total > 0 && (
                          <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
                            {w > 0 && <div className="bg-green-500" style={{ width: `${(w / total) * 100}%` }} />}
                            {d > 0 && <div className="bg-amber-500" style={{ width: `${(d / total) * 100}%` }} />}
                            {l > 0 && <div className="bg-red-500" style={{ width: `${(l / total) * 100}%` }} />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Match history */}
              <h3 className="text-lg font-black uppercase tracking-tight text-foreground mt-10 mb-4">Riwayat Pertandingan</h3>
              <div className="space-y-3">
                {teamMatches.filter(m => m.homeScore !== null).map(m => {
                  const isHome = m.homeTeamId === team.id;
                  const opp = getTeamById(isHome ? m.awayTeamId : m.homeTeamId);
                  const myScore = isHome ? m.homeScore! : m.awayScore!;
                  const oppScore = isHome ? m.awayScore! : m.homeScore!;
                  const result = myScore > oppScore ? 'W' : myScore === oppScore ? 'D' : 'L';
                  const resultColor = result === 'W' ? 'text-green-400 bg-green-500/10 border-green-500/20' : result === 'D' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
                  return (
                    <div key={m.id} className="bg-primary border border-border rounded-xl p-4 flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${resultColor}`}>{result}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">
                          {isHome ? 'vs' : '@'} {opp?.name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">{m.date} · {m.venue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-foreground">{myScore}–{oppScore}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{m.stage === 'group' ? `Grup ${m.group}` : '16 Besar'}</p>
                      </div>
                    </div>
                  );
                })}
                {teamMatches.filter(m => m.homeScore !== null).length === 0 && (
                  <p className="text-muted-foreground text-sm">Belum ada pertandingan selesai.</p>
                )}
              </div>
            </div>
          )}

          {/* ── LINEUP TAB ── */}
          {activeTab === 'lineup' && (
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Pitch visualization */}
              <div className="lg:col-span-3">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Susunan Pemain</h2>
                <div
                  className="relative rounded-2xl overflow-hidden border border-border"
                  style={{ background: 'linear-gradient(180deg, #1a4a1a 0%, #1e5c1e 50%, #1a4a1a 100%)', minHeight: 480 }}
                >
                  {/* Pitch markings */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-px" />
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border border-white/20 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-white/30 -translate-x-1/2 translate-y-1" />
                    <div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-white/30 -translate-x-1/2 -translate-y-1" />
                    {/* Goal boxes */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 border-b border-x border-white/20" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 border-t border-x border-white/20" />
                  </div>

                  {/* Players by position group */}
                  <div className="relative z-10 flex flex-col justify-between h-full py-6 px-4" style={{ minHeight: 480 }}>
                    {/* GK */}
                    <div className="flex justify-center gap-4">
                      {sortedPlayers.filter(p => p.position === 'GK').map(p => (
                        <PlayerDot key={p.id} player={p} teamColor={team.colors.primary} />
                      ))}
                    </div>
                    {/* Defenders */}
                    <div className="flex justify-center gap-4">
                      {sortedPlayers.filter(p => ['CB', 'LB', 'RB'].includes(p.position)).map(p => (
                        <PlayerDot key={p.id} player={p} teamColor={team.colors.primary} />
                      ))}
                    </div>
                    {/* Midfielders */}
                    <div className="flex justify-center gap-4">
                      {sortedPlayers.filter(p => ['CDM', 'CM', 'CAM'].includes(p.position)).map(p => (
                        <PlayerDot key={p.id} player={p} teamColor={team.colors.primary} />
                      ))}
                    </div>
                    {/* Forwards */}
                    <div className="flex justify-center gap-4">
                      {sortedPlayers.filter(p => ['LW', 'RW', 'ST'].includes(p.position)).map(p => (
                        <PlayerDot key={p.id} player={p} teamColor={team.colors.primary} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Player list */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Daftar Pemain</h3>
                <div className="space-y-2">
                  {sortedPlayers.map(player => (
                    <div key={player.id} className="bg-primary border border-border rounded-xl p-3 flex items-center gap-3">
                      <span className="w-7 text-center text-xs font-black text-muted-foreground">{player.number}</span>
                      <img src={player.photo} alt={`Foto ${player.name}`} className="w-9 h-9 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.age} thn</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${positionColor[player.position] ?? 'bg-foreground/5 text-foreground/60 border-border'}`}>
                        {player.position}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Group performance */}
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mt-8 mb-4">Performa Grup {team.group}</h3>
                <div className="space-y-2">
                  {groupTeams.map(({ team: gt, points, won, drawn, lost, played }, idx) => (
                    <div
                      key={gt?.id}
                      className={`flex items-center gap-3 rounded-xl p-3 border transition-colors ${
                        gt?.id === team.id ? 'border-accent/40 bg-accent/5' : 'border-border bg-primary'
                      }`}
                    >
                      <span className={`w-5 text-center text-xs font-black ${idx === 0 ? 'text-accent' : 'text-muted-foreground'}`}>{idx + 1}</span>
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0"
                        style={{ background: gt?.colors.primary ?? '#666' }}
                      >
                        {gt?.shortName}
                      </div>
                      <Link href={`/team/${gt?.id}`} className="flex-1 text-sm font-bold text-foreground hover:text-accent transition-colors truncate">
                        {gt?.name}
                      </Link>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{played}M</span>
                        <span className="text-green-400">{won}W</span>
                        <span className="text-amber-400">{drawn}D</span>
                        <span className="text-red-400">{lost}L</span>
                        <span className="font-black text-foreground">{points}P</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function PlayerDot({ player, teamColor }: { player: Player; teamColor: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center text-xs font-black text-white shadow-lg"
        style={{ background: teamColor }}
        title={player.name}
      >
        {player.number}
      </div>
      <span className="text-[9px] font-bold text-white/80 max-w-[56px] text-center leading-tight truncate">{player.name.split(' ')[0]}</span>
    </div>
  );
}
