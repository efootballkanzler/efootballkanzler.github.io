'use client';

export interface LeagueGroupConfig {
  groupNames: string[];       // e.g. ['A', 'B', 'C', 'D']
  teamsAdvancePerGroup: number; // e.g. 2
}

const DEFAULT_CONFIG: LeagueGroupConfig = {
  groupNames: ['A', 'B', 'C', 'D'],
  teamsAdvancePerGroup: 2,
};

/**
 * Reads group structure config from localStorage (set by admin panel).
 * Falls back to defaults if not set or invalid.
 */
export function getLeagueGroupConfig(): LeagueGroupConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem('admin_league_config');
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);

    const rawNames: string = parsed.groupNames || 'A, B, C, D';
    const groupNames = rawNames
      .split(',')
      .map((g: string) => g.trim())
      .filter(Boolean);

    const teamsAdvancePerGroup = Math.max(1, parseInt(parsed.teamsAdvancePerGroup, 10) || 2);

    return {
      groupNames: groupNames.length > 0 ? groupNames : DEFAULT_CONFIG.groupNames,
      teamsAdvancePerGroup,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export { DEFAULT_CONFIG };
