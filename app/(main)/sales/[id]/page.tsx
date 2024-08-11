'use client';

import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserSchema } from '@/modules/members/data-access/schema';
import { fetchMembersUseCase } from '@/modules/members/use-cases';
import {
  StrainProps,
  getStrainsSchema,
} from '@/modules/plants/data-access/schema';
import { fetchStrainsUseCase } from '@/modules/plants/use-cases';
import { getSaleById } from '@/modules/sales/data-access';
import { Sale } from '@/modules/sales/data-access/schema';
import { UUID } from 'crypto';
import { Metadata } from 'next';
import { useAction } from 'next-safe-action/hooks';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SaleGeneralInfo } from './components/SaleGeneralInfo';

const SaleDetailPage = () => {
  const params = useParams<{ id: string }>();

  const metadata: Metadata = {
    title: 'Sale #' + params.id,
    description: 'Details of the sale.',
  };

  const [members, setMembers] = useState<UserSchema[]>([]);
  const [strains, setStrains] = useState<StrainProps[]>([]);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales', href: '/sales' },
    { label: 'Sale details' },
  ];

  const fetchMembers = useAction(fetchMembersUseCase, {
    onSuccess: (data) => {
      // Sort members by full name
      data.members.sort((a, b) => {
        const aFullName = a.firstName + ' ' + a.lastName;
        const bFullName = b.firstName + ' ' + b.lastName;
        return aFullName.localeCompare(bFullName);
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

  const getMemberById = (id: UUID) => {
    const member = members.find((member) => member.id == id);
    return member;
  };

  const [sale, setSale] = useState<Sale>({
    sale: {
      totalPrice: 0,
      paidVia: 'CASH',
      memberId: '',
      salesById: '',
    },
    items: [],
  });

  useEffect(() => {
    const fetchSale = async () => {
      console.log('fetch member with id ', params.id);
      const sale = await getSaleById(Number(params.id)); // TODO: transform into action
      return sale;
    };

    fetchSale().then((result) => {
      setSale(result);
      console.log('sale', result);
    });

    fetchMembers.execute({});
    fetchStrains.execute({});
  }, []);

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <Container>
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
            <div className="mb-2 flex justify-center">
              <SaleGeneralInfo plants={strains} sale={sale} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 md:gap-4">
              <div>
                <Label>Member</Label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        getMemberById(sale.sale.memberId as UUID)?.fullName
                      }
                    />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
              </div>
              <div>
                <Label>Paid Via</Label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder={sale.sale.paidVia} />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price</Label>
                <Input disabled value={sale.sale.totalPrice} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default SaleDetailPage;
