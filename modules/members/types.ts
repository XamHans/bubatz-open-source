export enum ClubMemberStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  REQUEST = 'REQUEST',
  PAUSED = 'PAUSED',
  EXITED = 'EXITED',
}

export interface MemberProps {
  id: string;
  avatar_url?: string | '';
  firstName: string;
  lastName: string;
  status: ClubMemberStatus | string;
  street: string;
  zip: string;
  city: string;
  birthday: Date;
  email?: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: Date;
}

// export type UpdateMemberInput = Omit<MemberProps, 'is_admin'>;

export const colorForClubMemberStatus = new Map<ClubMemberStatus, string>([
  [ClubMemberStatus.ACTIVE, 'lime-300'],
  [ClubMemberStatus.REQUEST, 'amber-300'],
  [ClubMemberStatus.EXITED, 'slate-600'],
  [ClubMemberStatus.PAUSED, 'teal-500'],
]);
