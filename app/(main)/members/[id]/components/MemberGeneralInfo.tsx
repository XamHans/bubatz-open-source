import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MemberProps } from '@/modules/members/types'
import { useTranslations } from 'next-intl'
import React from 'react'
import {
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiShieldCheck,
} from 'react-icons/hi'

interface MemberGeneralInfoProps {
  member: MemberProps
}

const MemberGeneralInfo: React.FC<MemberGeneralInfoProps> = ({ member }) => {
  const t = useTranslations('MemberGeneralInfo')

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  const calculateAge = (birthday: Date) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const calculateMembershipDuration = (createdAt: Date) => {
    const diffMs = Date.now() - new Date(createdAt).getTime()
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
    )

    if (years > 0) {
      return `${years} ${t(`duration.${years > 1 ? 'years' : 'year'}`)}${
        months > 0
          ? ` ${months} ${t(`duration.${months > 1 ? 'months' : 'month'}`)}`
          : ''
      }`
    } else {
      return `${months} ${t(`duration.${months > 1 ? 'months' : 'month'}`)}`
    }
  }

  const hasAdditionalInfo = member.firstName && member.lastName

  return (
    <Card className="w-full">
      {hasAdditionalInfo && (
        <CardHeader className="text-center">
          <Avatar className="mx-auto mb-4 h-24 w-24">
            {member.avatar_url ? (
              <AvatarImage
                src={member.avatar_url}
                alt={`${member.firstName} ${member.lastName}`}
              />
            ) : (
              <AvatarFallback className="text-2xl">
                {member.firstName.charAt(0)}
                {member.lastName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <CardTitle className="text-2xl font-bold">
            {member.firstName} {member.lastName}
          </CardTitle>
          <div className="mt-2 flex justify-center gap-2">
            {member.status && (
              <Badge variant="secondary">{t(`status.${member.status}`)}</Badge>
            )}
            {member.isAdmin && <Badge variant="default">{t('admin')}</Badge>}
          </div>
        </CardHeader>
      )}
      <CardContent className="grid gap-4">
        {hasAdditionalInfo && (
          <>
            <InfoItem
              icon={HiLocationMarker}
              primary={member.street}
              secondary={`${member.zip}, ${member.city}`}
            />
            {member.phone && <InfoItem icon={HiPhone} primary={member.phone} />}
            <InfoItem
              icon={HiCalendar}
              primary={t('birthday')}
              secondary={`${formatDate(member.birthday)} (${t('age')}: ${calculateAge(
                member.birthday,
              )})`}
            />
            <InfoItem
              icon={HiClock}
              primary={t('memberSince')}
              secondary={`${formatDate(
                member.createdAt,
              )} (${calculateMembershipDuration(member.createdAt)})`}
            />
            <InfoItem
              icon={HiShieldCheck}
              primary={t('memberId')}
              secondary={member.id}
            />
          </>
        )}
        {member.email && <InfoItem icon={HiMail} primary={member.email} />}
      </CardContent>
    </Card>
  )
}

interface InfoItemProps {
  icon: React.ElementType
  primary: string
  secondary?: string
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon: Icon,
  primary,
  secondary,
}) => (
  <div className="flex items-center space-x-3 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
    <Icon className="h-5 w-5 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium">{primary}</p>
      {secondary && (
        <p className="text-sm text-muted-foreground">{secondary}</p>
      )}
    </div>
  </div>
)

export default MemberGeneralInfo
