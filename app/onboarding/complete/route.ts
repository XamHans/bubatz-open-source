// Use clear and concise comments to describe the functionality and purpose of the code.
// This improves readability and maintainability by providing context to developers.

import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Logger } from 'pino';
import getLogger from '~/core/logger';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { createDeveloperData } from '~/lib/developers/database/mutations';
import { createOrganization } from '~/lib/organizations/database/mutations';
import { createUserData } from '~/lib/user/database/mutations';
import requireSession from '~/lib/user/require-session';

export const POST = async (req: NextRequest) => {
  const logger = getLogger();
  const client = getSupabaseRouteHandlerClient();
  const session = await requireSession(client);
  const userId = session.user.id;
  const payload = await req.json();

  try {
    const createUserResult = await createUserProfile(client, userId, payload, logger);
    await handleUserTypeSpecificActions(createUserResult, payload, userId, client, logger);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(
      {
        error,
      },
      `[Onboarding] Could not onboard error ${(error as any).message}`,
    );
    return NextResponse.json({ success: false, error: (error as any).message });
  }
};

async function createUserProfile(client: SupabaseClient, userId: string, payload: { profile: { firstName: any; lastName: any; userType: any; }; }, logger: Logger) {
  try {
    const createUserResult = await createUserData(client, {
      id: userId,
      firstName: payload?.profile.firstName,
      lastName: payload?.profile.lastName,
      userType: payload?.profile.userType,
    });
    logger.info('createUserResult ', createUserResult);

    if (createUserResult.error) {
    throw new Error((createUserResult.error as any).message);
    }

    return createUserResult;
  } catch (error) {
    throw new Error((error as any)?.message ?? 'Could not create profile while onboarding');
  }
}

async function handleUserTypeSpecificActions(createUserResult: any, payload: any, userId: any, client: any, logger: any) {
  if (createUserResult.error) {
    throw new Error(createUserResult.error ?? 'Could not create profile while onboarding');
  }

  if (payload?.profile.userType === 'organization') {
    await createOrganizationProfile(payload, userId, client, logger);
  } else {
    await createDeveloperProfile(payload, userId, client, logger);
  }
}


async function createOrganizationProfile(payload: any, userId: string, client: any, logger: any) {
  const { data, error } = await createOrganization(client, {
    ...payload.organization,
    userId: userId
  });

  if (error) {
    throw error;

  }
}


async function createDeveloperProfile(payload: { developer: { title: string; description: string; experience: string; languages: { value: string; label: string; }[]; techStack: { value: string; label: string; }[]; workOnCommission: boolean; confirmDataAndAge: boolean; country?: any; availability?: any; employmentType?: any; onlinePresence?: { website?: string | undefined; linkedin?: string | undefined; github?: string | undefined; scheduling?: string | undefined; } | undefined; } & { id: string | number; }; }, userId: any, client: SupabaseClient<any, "public", any>, logger: any) {
  const { id, ...developerData } = payload.developer;
   const createDeveloperResult = await createDeveloperData(client, {
     id: userId,
     ...developerData,
   });

  if (createDeveloperResult.error) {
    // ingore
    //@ts-ignore
    throw new Error(createDeveloperResult.error);
  }
}
