import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberProps } from '@/modules/members/types';
import React from 'react';
import {
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiShieldCheck,
} from 'react-icons/hi';

interface MemberGeneralInfoProps {
  member: MemberProps;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

const MemberGeneralInfo: React.FC<MemberGeneralInfoProps> = ({ member }) => {
  const calculateAge = (birthday: Date) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const calculateMembershipDuration = (createdAt: Date) => {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
    );

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  };

  return (
    <Card className="w-full">
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
          <Badge variant="secondary">{member.status}</Badge>
          {member.isAdmin && <Badge variant="default">Admin</Badge>}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <InfoItem
          icon={HiLocationMarker}
          primary={member.street}
          secondary={`${member.zip}, ${member.city}`}
        />
        {member.email && <InfoItem icon={HiMail} primary={member.email} />}
        {member.phone && <InfoItem icon={HiPhone} primary={member.phone} />}
        <InfoItem
          icon={HiCalendar}
          primary="Birthday"
          secondary={`${formatDate(member.birthday)} (Age: ${calculateAge(member.birthday)})`}
        />
        <InfoItem
          icon={HiClock}
          primary="Member Since"
          secondary={`${formatDate(member.createdAt)} (${calculateMembershipDuration(member.createdAt)})`}
        />
        <InfoItem
          icon={HiShieldCheck}
          primary="Member ID"
          secondary={member.id}
        />
      </CardContent>
    </Card>
  );
};

interface InfoItemProps {
  icon: React.ElementType;
  primary: string;
  secondary?: string;
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
);

export default MemberGeneralInfo;
