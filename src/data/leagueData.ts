export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  city: string;
  group: string;
  colors: { primary: string; secondary: string };
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  age: number;
  goals: number;
  assists: number;
  photo: string;
}

export interface Standing {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  venue: string;
  matchDay: number;
  stage: 'group' | 'r16' | 'qf' | 'sf' | 'final';
  group?: string;
  status: 'upcoming' | 'live' | 'completed';
}

export const teams: Team[] = [
  // Group A
  {
    id: 'persija', name: 'Persija Jakarta', shortName: 'PJK', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop&crop=center',
    city: 'Jakarta', group: 'A', colors: { primary: '#E8282B', secondary: '#FFFFFF' },
    players: [
      { id: 'p1', name: 'Reza Firmansyah', number: 1, position: 'GK', age: 28, goals: 0, assists: 0, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=200&h=200&fit=crop' },
      { id: 'p2', name: 'Bima Sakti', number: 5, position: 'CB', age: 25, goals: 2, assists: 1, photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=200&h=200&fit=crop' },
      { id: 'p3', name: 'Ardiansyah Putra', number: 10, position: 'CAM', age: 23, goals: 7, assists: 4, photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=200&h=200&fit=crop' },
      { id: 'p4', name: 'Wahyu Gunawan', number: 9, position: 'ST', age: 26, goals: 9, assists: 2, photo: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persib', name: 'Persib Bandung', shortName: 'PBD', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Bandung', group: 'A', colors: { primary: '#0066CC', secondary: '#FFFFFF' },
    players: [
      { id: 'p5', name: 'Dedi Kusuma', number: 1, position: 'GK', age: 30, goals: 0, assists: 0, photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?w=200&h=200&fit=crop' },
      { id: 'p6', name: 'Hendri Mulyadi', number: 7, position: 'LW', age: 24, goals: 5, assists: 6, photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=200&h=200&fit=crop' },
      { id: 'p7', name: 'Fajri Santoso', number: 11, position: 'ST', age: 22, goals: 8, assists: 3, photo: 'https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persis', name: 'Persis Solo', shortName: 'PSO', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Solo', group: 'A', colors: { primary: '#CC0000', secondary: '#000000' },
    players: [
      { id: 'p8', name: 'Galih Pratama', number: 9, position: 'ST', age: 27, goals: 6, assists: 1, photo: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'psis', name: 'PSIS Semarang', shortName: 'PSM', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Semarang', group: 'A', colors: { primary: '#0055AA', secondary: '#FFFFFF' },
    players: [
      { id: 'p9', name: 'Taufik Hidayat', number: 8, position: 'CM', age: 26, goals: 3, assists: 5, photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  // Group B
  {
    id: 'arema', name: 'Arema FC', shortName: 'ARM', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Malang', group: 'B', colors: { primary: '#003366', secondary: '#FFFFFF' },
    players: [
      { id: 'p10', name: 'Rizky Pratama', number: 10, position: 'CAM', age: 24, goals: 10, assists: 5, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persebaya', name: 'Persebaya Surabaya', shortName: 'PSB', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Surabaya', group: 'B', colors: { primary: '#009900', secondary: '#FFFFFF' },
    players: [
      { id: 'p11', name: 'Irfan Maulana', number: 7, position: 'RW', age: 23, goals: 8, assists: 4, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'psbk', name: 'PSBK Blitar', shortName: 'BLT', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Blitar', group: 'B', colors: { primary: '#CC6600', secondary: '#FFFFFF' },
    players: [
      { id: 'p12', name: 'Dani Setiawan', number: 11, position: 'LW', age: 25, goals: 4, assists: 2, photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'psim', name: 'PSIM Yogyakarta', shortName: 'PSY', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Yogyakarta', group: 'B', colors: { primary: '#990000', secondary: '#FFCC00' },
    players: [
      { id: 'p13', name: 'Bagas Nugroho', number: 6, position: 'CM', age: 22, goals: 2, assists: 3, photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  // Group C
  {
    id: 'psm', name: 'PSM Makassar', shortName: 'PSM', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Makassar', group: 'C', colors: { primary: '#CC0000', secondary: '#FFFFFF' },
    players: [
      { id: 'p14', name: 'Hendra Wijaya', number: 9, position: 'ST', age: 27, goals: 11, assists: 2, photo: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persipura', name: 'Persipura Jayapura', shortName: 'PPJ', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Jayapura', group: 'C', colors: { primary: '#000000', secondary: '#FFCC00' },
    players: [
      { id: 'p15', name: 'Yohanes Rumbiak', number: 10, position: 'CAM', age: 24, goals: 7, assists: 6, photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'sriwijaya', name: 'Sriwijaya FC', shortName: 'SWJ', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Palembang', group: 'C', colors: { primary: '#CC0000', secondary: '#FFCC00' },
    players: [
      { id: 'p16', name: 'Ahmad Fauzi', number: 8, position: 'CM', age: 26, goals: 4, assists: 3, photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'borneo', name: 'Borneo FC', shortName: 'BFC', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Samarinda', group: 'C', colors: { primary: '#FF6600', secondary: '#000000' },
    players: [
      { id: 'p17', name: 'Kevin Sitorus', number: 7, position: 'RW', age: 23, goals: 5, assists: 4, photo: 'https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  // Group D
  {
    id: 'bali', name: 'Bali United', shortName: 'BLU', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Bali', group: 'D', colors: { primary: '#FF0000', secondary: '#FFCC00' },
    players: [
      { id: 'p18', name: 'Made Suardana', number: 10, position: 'CAM', age: 25, goals: 9, assists: 7, photo: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'madura', name: 'Madura United', shortName: 'MDR', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Pamekasan', group: 'D', colors: { primary: '#CC0000', secondary: '#FFFFFF' },
    players: [
      { id: 'p19', name: 'Syamsul Bahri', number: 9, position: 'ST', age: 28, goals: 8, assists: 1, photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persela', name: 'Persela Lamongan', shortName: 'PLM', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Lamongan', group: 'D', colors: { primary: '#003399', secondary: '#FFFFFF' },
    players: [
      { id: 'p20', name: 'Eko Prasetyo', number: 11, position: 'LW', age: 24, goals: 5, assists: 3, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'pss', name: 'PSS Sleman', shortName: 'PSS', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Sleman', group: 'D', colors: { primary: '#009900', secondary: '#FFFFFF' },
    players: [
      { id: 'p21', name: 'Nur Hidayat', number: 8, position: 'CM', age: 26, goals: 3, assists: 5, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=200&h=200&fit=crop' },
    ]
  },
];

export const standings: Record<string, Standing[]> = {
  A: [
    { teamId: 'persija', played: 6, won: 5, drawn: 0, lost: 1, gf: 14, ga: 5, gd: 9, points: 15 },
    { teamId: 'persib', played: 6, won: 4, drawn: 1, lost: 1, gf: 11, ga: 6, gd: 5, points: 13 },
    { teamId: 'persis', played: 6, won: 2, drawn: 1, lost: 3, gf: 7, ga: 9, gd: -2, points: 7 },
    { teamId: 'psis', played: 6, won: 0, drawn: 0, lost: 6, gf: 2, ga: 14, gd: -12, points: 0 },
  ],
  B: [
    { teamId: 'arema', played: 6, won: 4, drawn: 2, lost: 0, gf: 13, ga: 4, gd: 9, points: 14 },
    { teamId: 'persebaya', played: 6, won: 4, drawn: 0, lost: 2, gf: 12, ga: 7, gd: 5, points: 12 },
    { teamId: 'psbk', played: 6, won: 1, drawn: 2, lost: 3, gf: 5, ga: 10, gd: -5, points: 5 },
    { teamId: 'psim', played: 6, won: 0, drawn: 2, lost: 4, gf: 3, ga: 12, gd: -9, points: 2 },
  ],
  C: [
    { teamId: 'psm', played: 6, won: 5, drawn: 1, lost: 0, gf: 16, ga: 3, gd: 13, points: 16 },
    { teamId: 'persipura', played: 6, won: 3, drawn: 2, lost: 1, gf: 10, ga: 6, gd: 4, points: 11 },
    { teamId: 'sriwijaya', played: 6, won: 2, drawn: 0, lost: 4, gf: 6, ga: 11, gd: -5, points: 6 },
    { teamId: 'borneo', played: 6, won: 0, drawn: 1, lost: 5, gf: 3, ga: 15, gd: -12, points: 1 },
  ],
  D: [
    { teamId: 'bali', played: 6, won: 4, drawn: 2, lost: 0, gf: 15, ga: 5, gd: 10, points: 14 },
    { teamId: 'madura', played: 6, won: 3, drawn: 1, lost: 2, gf: 10, ga: 8, gd: 2, points: 10 },
    { teamId: 'persela', played: 6, won: 2, drawn: 0, lost: 4, gf: 6, ga: 12, gd: -6, points: 6 },
    { teamId: 'pss', played: 6, won: 0, drawn: 1, lost: 5, gf: 2, ga: 8, gd: -6, points: 1 },
  ],
};

export const matches: Match[] = [
  // Group Stage
  { id: 'm1', homeTeamId: 'persija', awayTeamId: 'persib', homeScore: 2, awayScore: 1, date: '2026-08-01', time: '15:30', venue: 'Stadion GBK, Jakarta', matchDay: 1, stage: 'group', group: 'A', status: 'completed' },
  { id: 'm2', homeTeamId: 'persis', awayTeamId: 'psis', homeScore: 1, awayScore: 0, date: '2026-08-01', time: '18:00', venue: 'Stadion Manahan, Solo', matchDay: 1, stage: 'group', group: 'A', status: 'completed' },
  { id: 'm3', homeTeamId: 'arema', awayTeamId: 'persebaya', homeScore: 2, awayScore: 2, date: '2026-08-02', time: '15:30', venue: 'Stadion Kanjuruhan, Malang', matchDay: 1, stage: 'group', group: 'B', status: 'completed' },
  { id: 'm4', homeTeamId: 'psm', awayTeamId: 'persipura', homeScore: 3, awayScore: 1, date: '2026-08-02', time: '18:00', venue: 'Stadion Mattoangin, Makassar', matchDay: 1, stage: 'group', group: 'C', status: 'completed' },
  { id: 'm5', homeTeamId: 'bali', awayTeamId: 'madura', homeScore: 2, awayScore: 0, date: '2026-08-03', time: '15:30', venue: 'Stadion Kapten I Wayan Dipta, Bali', matchDay: 1, stage: 'group', group: 'D', status: 'completed' },
  { id: 'm6', homeTeamId: 'persija', awayTeamId: 'persis', homeScore: 3, awayScore: 0, date: '2026-08-08', time: '15:30', venue: 'Stadion GBK, Jakarta', matchDay: 2, stage: 'group', group: 'A', status: 'completed' },
  { id: 'm7', homeTeamId: 'persib', awayTeamId: 'psis', homeScore: 3, awayScore: 0, date: '2026-08-08', time: '18:00', venue: 'Stadion GBLA, Bandung', matchDay: 2, stage: 'group', group: 'A', status: 'completed' },
  { id: 'm8', homeTeamId: 'arema', awayTeamId: 'psim', homeScore: 3, awayScore: 0, date: '2026-08-09', time: '15:30', venue: 'Stadion Kanjuruhan, Malang', matchDay: 2, stage: 'group', group: 'B', status: 'completed' },
  { id: 'm9', homeTeamId: 'persebaya', awayTeamId: 'psbk', homeScore: 2, awayScore: 1, date: '2026-08-09', time: '18:00', venue: 'Stadion GBT, Surabaya', matchDay: 2, stage: 'group', group: 'B', status: 'completed' },
  { id: 'm10', homeTeamId: 'psm', awayTeamId: 'sriwijaya', homeScore: 2, awayScore: 0, date: '2026-08-10', time: '15:30', venue: 'Stadion Mattoangin, Makassar', matchDay: 2, stage: 'group', group: 'C', status: 'completed' },
  // 16 Besar
  { id: 'r1', homeTeamId: 'persija', awayTeamId: 'madura', homeScore: 2, awayScore: 0, date: '2026-09-06', time: '15:30', venue: 'Stadion GBK, Jakarta', matchDay: 1, stage: 'r16', status: 'upcoming' },
  { id: 'r2', homeTeamId: 'arema', awayTeamId: 'persipura', homeScore: null, awayScore: null, date: '2026-09-06', time: '18:00', venue: 'Stadion Kanjuruhan, Malang', matchDay: 1, stage: 'r16', status: 'upcoming' },
  { id: 'r3', homeTeamId: 'psm', awayTeamId: 'persib', homeScore: null, awayScore: null, date: '2026-09-07', time: '15:30', venue: 'Stadion Mattoangin, Makassar', matchDay: 1, stage: 'r16', status: 'upcoming' },
  { id: 'r4', homeTeamId: 'bali', awayTeamId: 'persebaya', homeScore: null, awayScore: null, date: '2026-09-07', time: '18:00', venue: 'Stadion Kapten I Wayan Dipta, Bali', matchDay: 1, stage: 'r16', status: 'upcoming' },
  { id: 'r5', homeTeamId: 'persis', awayTeamId: 'borneo', homeScore: null, awayScore: null, date: '2026-09-08', time: '15:30', venue: 'Stadion Manahan, Solo', matchDay: 1, stage: 'r16', status: 'upcoming' },
  { id: 'r6', homeTeamId: 'sriwijaya', awayTeamId: 'psbk', homeScore: null, awayScore: null, date: '2026-09-08', time: '18:00', venue: 'Stadion Jakabaring, Palembang', matchDay: 1, stage: 'r16', status: 'upcoming' },
  { id: 'r7', homeTeamId: 'persela', awayTeamId: 'psim', homeScore: null, awayScore: null, date: '2026-09-09', time: '15:30', venue: 'Stadion Surajaya, Lamongan', matchDay: 1, stage: 'r16', status: 'upcoming' },
  { id: 'r8', homeTeamId: 'psis', awayTeamId: 'pss', homeScore: null, awayScore: null, date: '2026-09-09', time: '18:00', venue: 'Stadion Citarum, Semarang', matchDay: 1, stage: 'r16', status: 'upcoming' },
];

export const topScorers = [
  { playerId: 'p14', playerName: 'Hendra Wijaya', teamId: 'psm', teamName: 'PSM Makassar', goals: 11 },
  { playerId: 'p10', playerName: 'Rizky Pratama', teamId: 'arema', teamName: 'Arema FC', goals: 10 },
  { playerId: 'p4', playerName: 'Wahyu Gunawan', teamId: 'persija', teamName: 'Persija Jakarta', goals: 9 },
  { playerId: 'p18', playerName: 'Made Suardana', teamId: 'bali', teamName: 'Bali United', goals: 9 },
  { playerId: 'p7', playerName: 'Fajri Santoso', teamId: 'persib', teamName: 'Persib Bandung', goals: 8 },
  { playerId: 'p11', playerName: 'Irfan Maulana', teamId: 'persebaya', teamName: 'Persebaya Surabaya', goals: 8 },
];

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}