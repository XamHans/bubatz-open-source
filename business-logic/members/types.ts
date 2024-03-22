
export enum ClubMemberStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    REQUEST = "REQUEST",
    PAUSED = "PAUSED",
    EXITED = "EXITED",
  }
  
export interface MemberProps {
    id?: string;
    avatar_url: string | "";
    first_name: string;
    last_name: string;
    member_status: ClubMemberStatus | string;
    street: string;
    zip: string;
    city: string;
    birthday: Date;
    email?: string;
    phone?: string;
    is_admin: boolean;

  }


  export const colorForClubMemberStatus = new Map<ClubMemberStatus, string>([
    [ClubMemberStatus.ACTIVE, "bg-green-400"],
    [ClubMemberStatus.REQUEST, "bg-yellow-400"],
    [ClubMemberStatus.PENDING, "bg-orange-400"],
    [ClubMemberStatus.EXITED, "bg-gray-400"],
    [ClubMemberStatus.PAUSED, "bg-gray-200"],
  ])


