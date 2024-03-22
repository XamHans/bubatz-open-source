"use client";

import { ClubMemberStatus } from "@/business-logic/club/types";
import { GetMemberDetailQueryData, getMemberDetail } from "@/business-logic/members/actions";
import { colorForClubMemberStatus } from "@/business-logic/members/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { t } from "i18next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const MemberGeneralInfo = () => {
    const params = useParams<{ id: string; }>()
    const [member, setMember] = useState<GetMemberDetailQueryData | undefined>(undefined);

    useEffect(() => {
        const fetchMember = async () => {
            console.log('fetch member with id ', params.id)
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
                    Edit
                </CardHeader>

                <CardContent>
                    <div className="flex gap-x-6 items-center ">
                        <div className="flex flex-col flex-wrap px-2 justify-center items-center md:w-1/2">
                            <Avatar className="w-32 h-32 ">
                                {/* <AvatarImage src={member.avatar_url} /> */}
                                <AvatarFallback>
                                    {" "}
                                    {member.firstName?.charAt(0)} {member.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className=" text-gray-500 dark:text-gray-400 gap-y-3 flex-col md:w-1/2 flex-wrap ">
                            <div className="grid gap-1 mt-2 ">
                                <h3 className="sm:text-xl md:text-2xl items-start  font-bold text-gray-900 dark:text-white pb-2">
                                    {member.firstName} {member.lastName}
                                </h3>

                                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    {/* <HiFlag className="mt-px h-5 w-5" /> */}
                                    <div className="space-y-1">
                                        <Badge
                                            variant="default"
                                            className={`${colorForClubMemberStatus.get(
                                                member.status as ClubMemberStatus
                                            )}`}
                                        >
                                            {t(`MEMBER.STATUS_OPTIONS.${member.status}`)}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    {/* <HiLocationMarker className="mt-px h-5 w-5" /> */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{member.street}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {member.zip}, {member.city}
                                        </p>
                                    </div>
                                </div>
                                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    {/* <HiMail className="mt-px h-5 w-5" /> */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{member.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}

export { MemberGeneralInfo };
