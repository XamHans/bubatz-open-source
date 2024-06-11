'use client';

import {
  ClubMemberStatus,
  colorForClubMemberStatus,
} from '@/modules/members/types';
import {
  GetMemberDetailQueryData,
  getMemberDetail,
} from '@/modules/members/data-access/index';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { t } from 'i18next';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EditMemberModal } from './EditMemberModal';

const MemberGeneralInfo = () => {
  const params = useParams<{ id: string }>();
  const [member, setMember] = useState<GetMemberDetailQueryData | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchMember = async () => {
      console.log('fetch member with id ', params.id);
      const member = await getMemberDetail(params.id);
      setMember(member);
    };

    fetchMember();
  }, []);

  if (!member) return null;

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader className="text-end">
          <EditMemberModal member={member} />
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-x-6 ">
            <div className="flex flex-col flex-wrap items-center justify-center px-2 md:w-1/2">
              <Avatar className="h-32 w-32 ">
                {/* <AvatarImage src={member.avatar_url} /> */}
                <AvatarFallback>
                  {' '}
                  {member.firstName?.charAt(0)} {member.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className=" flex-col flex-wrap gap-y-3 text-gray-500 dark:text-gray-400 md:w-1/2 ">
              <div className="mt-2 grid gap-1 ">
                <h3 className="items-start pb-2 font-bold  text-gray-900 dark:text-white sm:text-xl md:text-2xl">
                  {member.firstName} {member.lastName}
                </h3>

                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  {/* <HiFlag className="mt-px h-5 w-5" /> */}
                  <div className="space-y-1">
                    <Badge
                      variant="default"
                      className={`${colorForClubMemberStatus.get(
                        member.status as ClubMemberStatus,
                      )}`}
                    >
                      {/* {t(`MEMBER.STATUS_OPTIONS.${member.status}`)} */}
                      {member.status}
                    </Badge>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  {/* <HiLocationMarker className="mt-px h-5 w-5" /> */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {member.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.zip}, {member.city}
                    </p>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  {/* <HiMail className="mt-px h-5 w-5" /> */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {member.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { MemberGeneralInfo };
