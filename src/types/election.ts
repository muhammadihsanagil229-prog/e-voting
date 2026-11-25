export type PaslonId = '01' | '02' | '03' | '04';

export type DashboardId =
  | 'beranda'
  | 'kandidat'
  | 'visi-misi'
  | 'bilik-suara'
  | 'quick-count'
  | 'kelola-paslon';

export interface CandidatePair {
  id: PaslonId;
  badge: string;
  title: string;
  shortName: string;
  classes: string;
  tagline: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  vision: string;
  missions: string[];
}

export type VoteCounts = Record<PaslonId, number>;

export interface ActivityItem {
  id: string;
  className: string;
  timeAgo: string;
  timestamp: number;
}

export interface VoteReceipt {
  receiptCode: string;
  nisn: string;
  className: string;
  paslonId: PaslonId;
  castAt: string;
}

export interface VoterProfile {
  nisn: string;
  className: string;
  verified: boolean;
}
