'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  teams,
  standings,
  matches,
  getTeamById,
  type Team,
  type Standing,
} from '@/data/leagueData';

interface Props {
  team: Team;
}

function getStanding(teamId: string): Standing | undefined {
  for (const group of Object.values(standings)) {
    const s = group.find(s => s.teamId === teamId);
    if (s) return s;
  }
  return undefined;
}

function StatBar({
  labelA,
  labelB,
  valueA,
  valueB,
  colorA,
  colorB,
}: {
  labelA: string;
  labelB: string;
  valueA: number;
  valueB: number;
  colorA: string;
  colorB: string;
}) {
  const total = valueA + valueB;
  const pctA = total === 0 ? 50 : Math.round((valueA / total) * 100);
  const pctB = 100 - pctA;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-black">
        <span className="text-foreground">{valueA}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{labelA}</span>
        <span className="text-foreground">{valueB}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        <div
          className="rounded-l-full transition-all duration-700"
          style={{ width: `${pctA}%`, background: colorA }}
        />
        <div
          className="rounded-r-full transition-all duration-700"
          style={{ width: `${pctB}%`, background: colorB }}
        />
      </div>
    </div>
  );
}

function MiniResultBadge({ result }: { result: 'W' | 'D' | 'L' }) {
  const cls =
    result === 'W' ?'bg-green-500/20 text-green-400 border-green-500/30'
      : result === 'D' ?'bg-amber-500/20 text-amber-400 border-amber-500/30' :'bg-red-500/20 text-red-400 border-red-500/30';
  return (
    <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black border ${cls}`}>
      {result}
    </span>
  );
}

export default function TeamCompareView({ team }: Props) {
  const otherTeams = teams.filter(t => t.id !== team.id);
  const [selectedId, setSelectedId] = useState<string>(otherTeams[0]?.id ?? '');
  const opponent = getTeamById(selectedId);

  const standingA = getStanding(team.id);
  const standingB = opponent ? getStanding(opponent.id) : undefined;

  // All completed matches
  const completedMatches = matches.filter(
    m => m.homeScore !== null && m.awayScore !== null && m.status === 'completed'
  );

  // Direct H2H matches between team A and team B
  const h2hMatches = completedMatches.filter(
    m =>
      (m.homeTeamId === team.id && m.awayTeamId === selectedId) ||
      (m.homeTeamId === selectedId && m.awayTeamId === team.id)
  );

  let h2hA = { w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  h2hMatches.forEach(m => {
    const isHome = m.homeTeamId === team.id;
    let gf = isHome ? m.homeScore! : m.awayScore!;
    let ga = isHome ? m.awayScore! : m.homeScore!;
    h2hA.gf += gf;
    h2hA.ga += ga;
    if (gf > ga) h2hA.w++;
    else if (gf === ga) h2hA.d++;
    else h2hA.l++;
  });
  const h2hB = { w: h2hA.l, d: h2hA.d, l: h2hA.w, gf: h2hA.ga, ga: h2hA.gf };

  // Shared opponents: teams both A and B have played against (excluding each other)
  const opponentsA = new Set(
    completedMatches
      .filter(m => m.homeTeamId === team.id || m.awayTeamId === team.id)
      .map(m => (m.homeTeamId === team.id ? m.awayTeamId : m.homeTeamId))
      .filter(id => id !== selectedId)
  );
  const opponentsB = new Set(
    completedMatches
      .filter(m => m.homeTeamId === selectedId || m.awayTeamId === selectedId)
      .map(m => (m.homeTeamId === selectedId ? m.awayTeamId : m.homeTeamId))
      .filter(id => id !== team.id)
  );
  const sharedOpponentIds = [...opponentsA].filter(id => opponentsB.has(id));

  // For each shared opponent, compute results for both teams
  const sharedOpponents = sharedOpponentIds.map(oppId => {
    const opp = getTeamById(oppId);
    const calcRecord = (teamId: string) => {
      const ms = completedMatches.filter(
        m =>
          (m.homeTeamId === teamId && m.awayTeamId === oppId) ||
          (m.homeTeamId === oppId && m.awayTeamId === teamId)
      );
      let w = 0, d = 0, l = 0, gf = 0, ga = 0;
      ms.forEach(m => {
        const isHome = m.homeTeamId === teamId;
        const myGf = isHome ? m.homeScore! : m.awayScore!;
        const myGa = isHome ? m.awayScore! : m.homeScore!;
        gf += myGf; ga += myGa;
        if (myGf > myGa) w++;
        else if (myGf === myGa) d++;
        else l++;
      });
      return { w, d, l, gf, ga };
    };
    return { opp, recA: calcRecord(team.id), recB: calcRecord(selectedId) };
  });

  // Performance trend: last 5 matches for each team
  const getForm = (teamId: string) => {
    return completedMatches
      .filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(m => {
        const isHome = m.homeTeamId === teamId;
        let gf = isHome ? m.homeScore! : m.awayScore!;
        let ga = isHome ? m.awayScore! : m.homeScore!;
        const result: 'W' | 'D' | 'L' = gf > ga ? 'W' : gf === ga ? 'D' : 'L';
        const opp = getTeamById(isHome ? m.awayTeamId : m.homeTeamId);
        return { result, gf, ga, opp, date: m.date };
      });
  };

  const formA = getForm(team.id);
  const formB = opponent ? getForm(opponent.id) : [];

  // Points per game trend (last 5 matches)
  const ptsA = formA.map(f => (f.result === 'W' ? 3 : f.result === 'D' ? 1 : 0));
  const ptsB = formB.map(f => (f.result === 'W' ? 3 : f.result === 'D' ? 1 : 0));

  const noData =
    !standingA && !standingB && h2hMatches.length === 0 && sharedOpponents.length === 0;

  return (
    <div className="space-y-8">
      {/* Team Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Team A badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary === '#FFFFFF' ? team.colors.primary + '99' : team.colors.secondary})` }}
          >
            {team.shortName}
          </div>
          <div>
            <p className="font-black text-foreground text-sm">{team.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Tim Ini</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs font-black uppercase tracking-widest">
          <div className="w-8 h-px bg-border" />
          VS
          <div className="w-8 h-px bg-border" />
        </div>

        {/* Team B selector */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {opponent && (
            <div className="text-right">
              <p className="font-black text-foreground text-sm">{opponent.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Lawan</p>
            </div>
          )}
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="bg-primary border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-accent/50 cursor-pointer"
          >
            {teams
              .filter(t => t.id !== team.id)
              .map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} (Grup {t.group})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* ── SECTION 1: Head-to-Head Record ── */}
      <div className="bg-primary border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Head-to-Head Record
          </h3>
        </div>
        <div className="p-6">
          {h2hMatches.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Belum ada pertandingan langsung antara kedua tim.
            </p>
          ) : (
            <>
              {/* Score summary */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  <p className="text-5xl font-black text-green-400">{h2hA.w}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Menang</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-3xl font-black text-amber-400">{h2hA.d}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Seri</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-5xl font-black text-red-400">{h2hB.w}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Menang</p>
                </div>
              </div>

              {/* Win bar */}
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
                {h2hA.w > 0 && (
                  <div
                    className="rounded-l-full"
                    style={{
                      width: `${(h2hA.w / (h2hA.w + h2hA.d + h2hA.l)) * 100}%`,
                      background: team.colors.primary,
                    }}
                  />
                )}
                {h2hA.d > 0 && (
                  <div
                    className="bg-amber-500"
                    style={{ width: `${(h2hA.d / (h2hA.w + h2hA.d + h2hA.l)) * 100}%` }}
                  />
                )}
                {h2hA.l > 0 && (
                  <div
                    className="rounded-r-full"
                    style={{
                      width: `${(h2hA.l / (h2hA.w + h2hA.d + h2hA.l)) * 100}%`,
                      background: opponent?.colors.primary ?? '#666',
                    }}
                  />
                )}
              </div>

              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
                <span style={{ color: team.colors.primary }}>{team.shortName}</span>
                <span>{h2hMatches.length} Pertandingan</span>
                <span style={{ color: opponent?.colors.primary }}>{opponent?.shortName}</span>
              </div>

              {/* Goals comparison */}
              <div className="space-y-3">
                <StatBar
                  labelA="Gol Dicetak"
                  labelB=""
                  valueA={h2hA.gf}
                  valueB={h2hB.gf}
                  colorA={team.colors.primary}
                  colorB={opponent?.colors.primary ?? '#666'}
                />
              </div>

              {/* Match list */}
              <div className="mt-6 space-y-2">
                {h2hMatches
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(m => {
                    const isHome = m.homeTeamId === team.id;
                    const myScore = isHome ? m.homeScore! : m.awayScore!;
                    const oppScore = isHome ? m.awayScore! : m.homeScore!;
                    const result: 'W' | 'D' | 'L' =
                      myScore > oppScore ? 'W' : myScore === oppScore ? 'D' : 'L';
                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 bg-background/40 rounded-xl px-4 py-3"
                      >
                        <MiniResultBadge result={result} />
                        <div className="flex-1 text-xs text-muted-foreground">{m.date} · {m.venue}</div>
                        <div className="text-sm font-black text-foreground">
                          {isHome ? team.shortName : opponent?.shortName}{' '}
                          <span className="text-accent">{myScore}–{oppScore}</span>{' '}
                          {isHome ? opponent?.shortName : team.shortName}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── SECTION 2: Season Stats Side-by-Side ── */}
      {(standingA || standingB) && (
        <div className="bg-primary border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Perbandingan Statistik Musim
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Team headers */}
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: team.colors.primary }}
                >
                  {team.shortName}
                </div>
                <span className="text-xs font-black text-foreground">{team.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-foreground">{opponent?.name}</span>
                {opponent && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                    style={{ background: opponent.colors.primary }}
                  >
                    {opponent.shortName}
                  </div>
                )}
              </div>
            </div>

            <StatBar
              labelA="Poin"
              labelB=""
              valueA={standingA?.points ?? 0}
              valueB={standingB?.points ?? 0}
              colorA={team.colors.primary}
              colorB={opponent?.colors.primary ?? '#666'}
            />
            <StatBar
              labelA="Menang"
              labelB=""
              valueA={standingA?.won ?? 0}
              valueB={standingB?.won ?? 0}
              colorA={team.colors.primary}
              colorB={opponent?.colors.primary ?? '#666'}
            />
            <StatBar
              labelA="Gol Dicetak"
              labelB=""
              valueA={standingA?.gf ?? 0}
              valueB={standingB?.gf ?? 0}
              colorA={team.colors.primary}
              colorB={opponent?.colors.primary ?? '#666'}
            />
            <StatBar
              labelA="Gol Kebobolan"
              labelB=""
              valueA={standingA?.ga ?? 0}
              valueB={standingB?.ga ?? 0}
              colorA={team.colors.primary}
              colorB={opponent?.colors.primary ?? '#666'}
            />
            <StatBar
              labelA="Pertandingan"
              labelB=""
              valueA={standingA?.played ?? 0}
              valueB={standingB?.played ?? 0}
              colorA={team.colors.primary}
              colorB={opponent?.colors.primary ?? '#666'}
            />
          </div>
        </div>
      )}

      {/* ── SECTION 3: Shared Opponents ── */}
      <div className="bg-primary border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Lawan yang Sama
          </h3>
        </div>
        <div className="p-6">
          {sharedOpponents.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Belum ada lawan yang sama antara kedua tim.
            </p>
          ) : (
            <div className="space-y-3">
              {sharedOpponents.map(({ opp, recA, recB }) => {
                if (!opp) return null;
                const resultLabel = (r: { w: number; d: number; l: number; gf: number; ga: number }) =>
                  `${r.w}M ${r.d}S ${r.l}K · ${r.gf}–${r.ga}`;
                const dominantA = recA.w > recB.w ? 'A' : recB.w > recA.w ? 'B' : 'even';
                return (
                  <div
                    key={opp.id}
                    className="grid grid-cols-3 items-center gap-3 bg-background/40 rounded-xl px-4 py-3"
                  >
                    {/* Team A record */}
                    <div className="text-left">
                      <p
                        className={`text-xs font-black ${dominantA === 'A' ? 'text-green-400' : dominantA === 'B' ? 'text-red-400' : 'text-amber-400'}`}
                      >
                        {resultLabel(recA)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{team.shortName}</p>
                    </div>

                    {/* Opponent badge */}
                    <div className="flex flex-col items-center gap-1">
                      <Link href={`/team/${opp.id}`}>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white hover:scale-110 transition-transform"
                          style={{ background: opp.colors.primary }}
                        >
                          {opp.shortName}
                        </div>
                      </Link>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center leading-tight">
                        {opp.name}
                      </p>
                    </div>

                    {/* Team B record */}
                    <div className="text-right">
                      <p
                        className={`text-xs font-black ${dominantA === 'B' ? 'text-green-400' : dominantA === 'A' ? 'text-red-400' : 'text-amber-400'}`}
                      >
                        {resultLabel(recB)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{opponent?.shortName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 4: Performance Trend (Last 5) ── */}
      <div className="bg-primary border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Tren Performa (5 Pertandingan Terakhir)
          </h3>
        </div>
        <div className="p-6">
          {formA.length === 0 && formB.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Belum ada data pertandingan untuk menampilkan tren.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Team A form */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-black text-white"
                    style={{ background: team.colors.primary }}
                  >
                    {team.shortName}
                  </div>
                  <p className="text-xs font-black text-foreground">{team.name}</p>
                </div>
                {formA.length === 0 ? (
                  <p className="text-muted-foreground text-xs">Belum ada data.</p>
                ) : (
                  <>
                    <div className="flex gap-1.5 mb-4">
                      {formA.map((f, i) => (
                        <MiniResultBadge key={i} result={f.result} />
                      ))}
                    </div>
                    {/* Mini bar chart */}
                    <div className="flex items-end gap-1.5 h-16">
                      {ptsA.map((pts, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t transition-all duration-500"
                            style={{
                              height: `${pts === 3 ? 100 : pts === 1 ? 55 : 20}%`,
                              background:
                                pts === 3
                                  ? '#22c55e'
                                  : pts === 1
                                  ? '#f59e0b' :'#ef4444',
                              opacity: 0.85,
                            }}
                          />
                          <span className="text-[9px] font-black text-muted-foreground">{pts}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
                      <span>
                        Pts:{' '}
                        <span className="font-black text-foreground">
                          {ptsA.reduce((a, b) => a + b, 0)}
                        </span>
                        /15
                      </span>
                      <span>
                        Avg:{' '}
                        <span className="font-black text-foreground">
                          {ptsA.length > 0
                            ? (ptsA.reduce((a, b) => a + b, 0) / ptsA.length).toFixed(1)
                            : '0.0'}
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Team B form */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {opponent && (
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-black text-white"
                      style={{ background: opponent.colors.primary }}
                    >
                      {opponent.shortName}
                    </div>
                  )}
                  <p className="text-xs font-black text-foreground">{opponent?.name}</p>
                </div>
                {formB.length === 0 ? (
                  <p className="text-muted-foreground text-xs">Belum ada data.</p>
                ) : (
                  <>
                    <div className="flex gap-1.5 mb-4">
                      {formB.map((f, i) => (
                        <MiniResultBadge key={i} result={f.result} />
                      ))}
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                      {ptsB.map((pts, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t transition-all duration-500"
                            style={{
                              height: `${pts === 3 ? 100 : pts === 1 ? 55 : 20}%`,
                              background:
                                pts === 3
                                  ? '#22c55e'
                                  : pts === 1
                                  ? '#f59e0b' :'#ef4444',
                              opacity: 0.85,
                            }}
                          />
                          <span className="text-[9px] font-black text-muted-foreground">{pts}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
                      <span>
                        Pts:{' '}
                        <span className="font-black text-foreground">
                          {ptsB.reduce((a, b) => a + b, 0)}
                        </span>
                        /15
                      </span>
                      <span>
                        Avg:{' '}
                        <span className="font-black text-foreground">
                          {ptsB.length > 0
                            ? (ptsB.reduce((a, b) => a + b, 0) / ptsB.length).toFixed(1)
                            : '0.0'}
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
