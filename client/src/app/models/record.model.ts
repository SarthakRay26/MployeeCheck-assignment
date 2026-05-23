export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export type VerificationType =
  | 'Employment History'
  | 'Education Verification'
  | 'Criminal Background'
  | 'Reference Check'
  | 'Identity Verification'
  | 'Address Verification'
  | 'Credit Check'
  | 'Drug Screening'
  | 'Professional License'
  | 'Social Media Screening';

export type AccessLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'Confidential';

export interface VerificationRecord {
  _id: string;
  employeeName: string;
  company: string;
  verificationType: VerificationType;
  status: VerificationStatus;
  submittedDate: string;
  accessLevel: AccessLevel;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  byCompany: Array<{ _id: string; count: number }>;
  byType: Array<{ _id: string; count: number }>;
  recentActivity: VerificationRecord[];
}
