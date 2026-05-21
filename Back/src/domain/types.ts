// Domain Types - Entités métier

export interface Player {
  id_player: number;
  surname: string;
  name: string;
  mail: string;
  phone: string | null;
  status: 'Actif' | 'Inactif';
  created_at?: string;
  updated_at?: string;
}

export interface Coach {
  id_coach: number;
  surname: string;
  name: string;
  mail: string;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id_match: number;
  date: string;
  hour: string;
  opponent: string;
  location: 'Home' | 'Outside';
  type: 'Championship' | 'Friendly' | 'Cup';
  id_team: number;
  id_coach?: number | null;
  score_home: number;
  score_outside: number;
  status?: 'Scheduled' | 'InProgress' | 'Finished';
  created_at?: string;
  updated_at?: string;
}

export interface Training {
  id_training: number;
  date: string;
  hour: string;
  location: string;
  type: string;
  id_team: number;
  id_coach?: number | null;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Cotisation {
  id_cotisation: number;
  amount: number;
  date_payment: string | null;
  id_player: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  created_at?: string;
  updated_at?: string;
}

export interface Convocation {
  id_convocation: number;
  id_player: number;
  id_match?: number | null;
  id_training?: number | null;
  status: 'Confirmed' | 'Refused' | 'Pending';
  created_at?: string;
  updated_at?: string;
}
