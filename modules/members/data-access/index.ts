"use server";

import { db } from "@/lib/db/db";
import getLogger from "@/lib/logger";
import { AddMemberInput, members } from "./schema";
const logger = getLogger();
/**
 * Here is an example CRUD methods for the members table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */
 export const getMembers = async () => {
    const allMembers = await db.select().from(members);
    console.log('allmembers', allMembers)
    return allMembers;
}

export const createMember = async (input: AddMemberInput) => {
    logger.debug('Creating new member', input);
    const newMemberId = await db.insert(members).values(input).returning({ insertedId: members.id });
    return newMemberId;
}