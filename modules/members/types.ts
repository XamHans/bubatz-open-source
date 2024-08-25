export enum ClubMemberStatus {
  REQUEST = 'REQUEST',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXITED = 'EXITED',
}

export enum ClubMemberRoles {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',

}


export const colorForClubMemberStatus = new Map<ClubMemberStatus, string>([
  [ClubMemberStatus.ACTIVE, 'lime-300'],
  [ClubMemberStatus.REQUEST, 'amber-300'],
  [ClubMemberStatus.EXITED, 'slate-600'],
  [ClubMemberStatus.PAUSED, 'teal-500'],
]);
