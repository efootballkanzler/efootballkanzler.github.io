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
    id: 'persija', name: 'Player 1', shortName: 'P1', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop&crop=center',
    city: 'Jakarta', group: 'A', colors: { primary: '#E8282B', secondary: '#FFFFFF' },
    players: [
      { id: 'p1', name: 'Reza Firmansyah', number: 1, position: 'GK', age: 28, goals: 0, assists: 0, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=200&h=200&fit=crop' },
      { id: 'p2', name: 'Bima Sakti', number: 5, position: 'CB', age: 25, goals: 2, assists: 1, photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=200&h=200&fit=crop' },
      { id: 'p3', name: 'Ardiansyah Putra', number: 10, position: 'CAM', age: 23, goals: 7, assists: 4, photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=200&h=200&fit=crop' },
      { id: 'p4', name: 'Wahyu Gunawan', number: 9, position: 'ST', age: 26, goals: 9, assists: 2, photo: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persib', name: 'Player 2', shortName: 'P2', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Bandung', group: 'A', colors: { primary: '#0066CC', secondary: '#FFFFFF' },
    players: [
      { id: 'p5', name: 'Dedi Kusuma', number: 1, position: 'GK', age: 30, goals: 0, assists: 0, photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?w=200&h=200&fit=crop' },
      { id: 'p6', name: 'Hendri Mulyadi', number: 7, position: 'LW', age: 24, goals: 5, assists: 6, photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=200&h=200&fit=crop' },
      { id: 'p7', name: 'Fajri Santoso', number: 11, position: 'ST', age: 22, goals: 8, assists: 3, photo: 'https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persis', name: 'Player 3', shortName: 'P3', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Solo', group: 'A', colors: { primary: '#CC0000', secondary: '#000000' },
    players: [
      { id: 'p8', name: 'Galih Pratama', number: 9, position: 'ST', age: 27, goals: 6, assists: 1, photo: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'psis', name: 'Player 4', shortName: 'P4', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Semarang', group: 'A', colors: { primary: '#0055AA', secondary: '#FFFFFF' },
    players: [
      { id: 'p9', name: 'Taufik Hidayat', number: 8, position: 'CM', age: 26, goals: 3, assists: 5, photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  // Group B
  {
    id: 'arema', name: 'Player 5', shortName: 'P5', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Malang', group: 'B', colors: { primary: '#003366', secondary: '#FFFFFF' },
    players: [
      { id: 'p10', name: 'Rizky Pratama', number: 10, position: 'CAM', age: 24, goals: 10, assists: 5, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persebaya', name: 'Player 6', shortName: 'P6', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Surabaya', group: 'B', colors: { primary: '#009900', secondary: '#FFFFFF' },
    players: [
      { id: 'p11', name: 'Irfan Maulana', number: 7, position: 'RW', age: 23, goals: 8, assists: 4, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'psbk', name: 'Player 7', shortName: 'P7', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Blitar', group: 'B', colors: { primary: '#CC6600', secondary: '#FFFFFF' },
    players: [
      { id: 'p12', name: 'Dani Setiawan', number: 11, position: 'LW', age: 25, goals: 4, assists: 2, photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'psim', name: 'Player 8', shortName: 'P8', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Yogyakarta', group: 'B', colors: { primary: '#990000', secondary: '#FFCC00' },
    players: [
      { id: 'p13', name: 'Bagas Nugroho', number: 6, position: 'CM', age: 22, goals: 2, assists: 3, photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  // Group C
  {
    id: 'psm', name: 'Player 9', shortName: 'P9', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Makassar', group: 'C', colors: { primary: '#CC0000', secondary: '#FFFFFF' },
    players: [
      { id: 'p14', name: 'Hendra Wijaya', number: 9, position: 'ST', age: 27, goals: 11, assists: 2, photo: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persipura', name: 'Player 10', shortName: 'P10', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Jayapura', group: 'C', colors: { primary: '#000000', secondary: '#FFCC00' },
    players: [
      { id: 'p15', name: 'Yohanes Rumbiak', number: 10, position: 'CAM', age: 24, goals: 7, assists: 6, photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'sriwijaya', name: 'Player 11', shortName: 'P11', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Palembang', group: 'C', colors: { primary: '#CC0000', secondary: '#FFCC00' },
    players: [
      { id: 'p16', name: 'Ahmad Fauzi', number: 8, position: 'CM', age: 26, goals: 4, assists: 3, photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'borneo', name: 'Player 12', shortName: 'P12', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Samarinda', group: 'C', colors: { primary: '#FF6600', secondary: '#000000' },
    players: [
      { id: 'p17', name: 'Kevin Sitorus', number: 7, position: 'RW', age: 23, goals: 5, assists: 4, photo: 'https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  // Group D
  {
    id: 'bali', name: 'Player 13', shortName: 'P13', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Bali', group: 'D', colors: { primary: '#FF0000', secondary: '#FFCC00' },
    players: [
      { id: 'p18', name: 'Made Suardana', number: 10, position: 'CAM', age: 25, goals: 9, assists: 7, photo: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'madura', name: 'Player 14', shortName: 'P14', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Pamekasan', group: 'D', colors: { primary: '#CC0000', secondary: '#FFFFFF' },
    players: [
      { id: 'p19', name: 'Syamsul Bahri', number: 9, position: 'ST', age: 28, goals: 8, assists: 1, photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'persela', name: 'Player 15', shortName: 'P15', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Lamongan', group: 'D', colors: { primary: '#003399', secondary: '#FFFFFF' },
    players: [
      { id: 'p20', name: 'Eko Prasetyo', number: 11, position: 'LW', age: 24, goals: 5, assists: 3, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=200&h=200&fit=crop' },
    ]
  },
  {
    id: 'pss', name: 'Player 16', shortName: 'P16', logo: 'https://images.unsplash.com/photo-1614632537190-23e4e2f61f63?w=80&h=80&fit=crop',
    city: 'Sleman', group: 'D', colors: { primary: '#009900', secondary: '#FFFFFF' },
    players: [
      { id: 'p21', name: 'Nur Hidayat', number: 8, position: 'CM', age: 26, goals: 3, assists: 5, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=200&h=200&fit=crop' },
    ]
  },
];

export const standings: Record<string, Standing[]> = {
  A: [
    { teamId: 'persija', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'persib', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'persis', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'psis', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  B: [
    { teamId: 'arema', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'persebaya', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'psbk', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'psim', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  C: [
    { teamId: 'psm', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'persipura', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'sriwijaya', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'borneo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  D: [
    { teamId: 'bali', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'madura', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'persela', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { teamId: 'pss', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
};

export const matches: Match[] = [];

export const topScorers = [
  { playerId: 'p14', playerName: 'Hendra Wijaya', teamId: 'psm', teamName: 'Player 9', goals: 0 },
  { playerId: 'p10', playerName: 'Rizky Pratama', teamId: 'arema', teamName: 'Player 5', goals: 0 },
  { playerId: 'p4', playerName: 'Wahyu Gunawan', teamId: 'persija', teamName: 'Player 1', goals: 0 },
  { playerId: 'p18', playerName: 'Made Suardana', teamId: 'bali', teamName: 'Player 13', goals: 0 },
  { playerId: 'p7', playerName: 'Fajri Santoso', teamId: 'persib', teamName: 'Player 2', goals: 0 },
  { playerId: 'p11', playerName: 'Irfan Maulana', teamId: 'persebaya', teamName: 'Player 6', goals: 0 },
];

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}