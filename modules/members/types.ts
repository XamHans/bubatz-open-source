import { IUserTypes } from '@/types/user'

export enum ClubMemberStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    REQUEST = 'REQUEST',
    PAUSED = 'PAUSED',
    EXITED = 'EXITED',
}

export interface MemberProps {
    id: string
    avatar_url?: string | ''
    firstName: string
    lastName: string
    status: ClubMemberStatus | string
    street: string
    zip: string
    city: string
    birthday: Date
    email?: string
    phone?: string
    is_admin: boolean
}

export interface ClientProps {
    id: string
    role: IUserTypes
    name: string | null
    surname: string | null
    username: string | null
    email: string
    emailVerified: Date | null
    emailVerificationToken: string | null
    passwordHash: string | null
    resetPasswordToken: string | null
    resetPasswordTokenExpiry: Date | null
    image: string | null
    createdAt: Date | null
}

export type UpdateMemberInput = Omit<MemberProps, 'is_admin'>

export const colorForClubMemberStatus = new Map<ClubMemberStatus, string>([
    [ClubMemberStatus.ACTIVE, 'bg-green-400'],
    [ClubMemberStatus.REQUEST, 'bg-yellow-400'],
    [ClubMemberStatus.PENDING, 'bg-orange-400'],
    [ClubMemberStatus.EXITED, 'bg-gray-400'],
    [ClubMemberStatus.PAUSED, 'bg-gray-200'],
])
