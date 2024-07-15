'use client';

import { SessionProvider } from 'next-auth/react';
import { Container } from '@/components/generic/Container';
import { auth } from '@/auth';
import SaleForm from './components/SaleForm';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createContext, useEffect, useState } from 'react';
import { UserSchema } from '@/modules/members/data-access/schema';
import { useAction } from 'next-safe-action/hooks';
import { fetchMembersUseCase } from '@/modules/members/use-cases';
import { fetchStrainsUseCase } from '@/modules/plants/use-cases';
import {
  StrainProps,
  getStrainsSchema,
} from '@/modules/plants/data-access/schema';

export const NewSaleContext = createContext<{
  members: UserSchema[];
  strains: StrainProps[];
  isFetching: boolean;
}>({ members: [], strains: [], isFetching: true });

export default function NewSalePage() {
  // ------ States ------
  const [members, setMembers] = useState<UserSchema[]>([]);
  const [strains, setStrains] = useState<StrainProps[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // ------ Use cases -----
  const fetchMembers = useAction(fetchMembersUseCase, {
    onSuccess: (data) => {
      // Sort members by full name
      data.members.sort((a, b) => {
        return a.fullName.localeCompare(b.fullName);
      });
      setMembers((prev) => data.members);
    },
  });

  const fetchStrains = useAction(fetchStrainsUseCase, {
    onSuccess: (data) => {
      const parsedStrains: StrainProps[] = [];
      data.strains.forEach((strain) => {
        const parse = getStrainsSchema.safeParse(strain);
        if (parse.success) parsedStrains.push(parse.data);
        else console.error('Error parsing strain: ', parse.error.errors);
      });
      console.log('parsedStrains', parsedStrains);
      setStrains(() => parsedStrains);
    },
  });

  // ------ Effects -----

  // Fetch necessary data
  useEffect(() => {
    fetchMembers.execute({});
    fetchStrains.execute({});
  }, []);

  // When all is fetched, set fetching to false
  useEffect(() => {
    if (members && strains) setIsFetching(() => false);
  }, [members, strains]);

  const metadata: Metadata = {
    title: 'Create New Sale',
    description:
      'Fill in the details to create a new sale. Start by adding items to the sale.',
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales', href: '/sales' },
    { label: 'Create New Sale' },
  ];

  return (
    <SessionProvider>
      <NewSaleContext.Provider value={{ members, strains, isFetching }}>
        <Breadcrumbs items={breadcrumbs} />
        <Container className="space-y-4">
          <Card>
            <CardHeader className="px-7">
              <CardTitle>
                {metadata.title
                  ? metadata.title.toString()
                  : 'Error getting title'}
              </CardTitle>
              <CardDescription>
                {metadata.description
                  ? metadata.description.toString()
                  : 'Error getting description'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SaleForm />
            </CardContent>
          </Card>
        </Container>
      </NewSaleContext.Provider>
    </SessionProvider>
  );
}
