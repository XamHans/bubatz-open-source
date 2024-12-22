import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MemberProps } from '@/modules/members/data-access/schema'
import { useTranslations } from 'next-intl'
import React from 'react'
import {
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiShieldCheck,
  HiUser,
} from 'react-icons/hi'

interface MemberGeneralInfoProps {
  member: MemberProps
}

const MemberGeneralInfo: React.FC<MemberGeneralInfoProps> = ({ member }) => {
  const t = useTranslations('General')

  const formatDate = (date: string | undefined) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  const calculateAge = (birthday: string | undefined) => {
    if (!birthday) return ''
    const ageDifMs = Date.now() - new Date(birthday).getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const calculateMembershipDuration = (createdAt: string | undefined) => {
    if (!createdAt) return ''
    const diffMs = Date.now() - new Date(createdAt).getTime()
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
    )

    if (years > 0) {
      return `${years} ${years > 1 ? 'Jahre' : 'Jahr'}${
        months > 0 ? ` ${months} ${months > 1 ? 'Monate' : 'Monat'}` : ''
      }`
    } else {
      return `${months} ${months > 1 ? 'Monate' : 'Monat'}`
    }
  }

  const hasName = member.firstName && member.lastName

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Avatar className="mx-auto mb-4 h-24 w-24">
          <AvatarFallback className="text-2xl">
            {hasName ? (
              <>
                {member.firstName?.charAt(0)}
                {member.lastName?.charAt(0)}
              </>
            ) : (
              <HiUser className="h-12 w-12" />
            )}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-bold">
          {hasName
            ? `${member.firstName} ${member.lastName}`
            : 'Neues Mitglied'}
        </CardTitle>
        <div className="mt-2 flex justify-center gap-2 font-extrabold text-black">
          {member.status && (
            <Badge variant="secondary">
              {t(`form.status.${member.status}`)}
            </Badge>
          )}

          {member?.role == 'ADMIN' && (
            <Badge variant="default">{t('form.options.role.admin')}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {member.email && <InfoItem icon={HiMail} primary={member.email} />}
        {(member.street || member.zip || member.city) && (
          <InfoItem
            icon={HiLocationMarker}
            primary={member.street || 'Adresse nicht angegeben'}
            secondary={
              member.zip && member.city
                ? `${member.zip}, ${member.city}`
                : undefined
            }
          />
        )}
        {member.phone && <InfoItem icon={HiPhone} primary={member.phone} />}
        {member.birthday && (
          <InfoItem
            icon={HiCalendar}
            primary={t('form.labels.birthday')}
            secondary={`${formatDate(member.birthday)} (Alter: ${calculateAge(member.birthday)})`}
          />
        )}
        {member.createdAt && (
          <InfoItem
            icon={HiClock}
            primary="Mitglied seit"
            secondary={`${formatDate(member.createdAt)} (${calculateMembershipDuration(member.createdAt)})`}
          />
        )}
        {member.id && (
          <InfoItem
            icon={HiShieldCheck}
            primary="Mitgliedsnummer"
            secondary={member.id}
          />
        )}
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
