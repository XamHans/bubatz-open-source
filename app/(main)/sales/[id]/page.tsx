'use client';

import { Container } from '@/components/generic/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SaleGeneralInfo } from './components/SaleGeneralInfo';
import { Sale } from '@/modules/sales/data-access/schema';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSaleById } from '@/modules/sales/data-access';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GenericSelect from '@/components/generic/GenericSelect';
import { UUID } from 'crypto';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SaleDetailPage = () => {
  const params = useParams<{ id: string }>();

  const metadata: Metadata = {
    title: 'Sale #' + params.id,
    description: 'Details of the sale.',
  };

  const [members, setMembers] = useState<{ id: UUID; name: string }[]>([
    { id: '0d40439d-224d-42d3-96fb-b07e66c6ac78' as UUID, name: 'goncalo' },
    { id: '196eeab1-3369-4563-b8df-2a88cc720e03' as UUID, name: 'andre' },
    { id: '20eaf542-cb38-4ce3-9907-1e9fffee4ec5' as UUID, name: 'johannes' },
  ]); // TODO: Fetch specific member of the sale

  const [plants, setPlants] = useState<
    { id: number; name: string; price: number }[]
  >([
    { id: 8, name: 'Ganza', price: 14 },
    { id: 9, name: 'Placa', price: 22 },
  ]);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales', href: '/sales' },
    { label: 'Sale details' },
  ];

  const getMemberById = (id: UUID) => {
    return members.find((member) => member.id === id)?.name;
  };

  const [sale, setSale] = useState<Sale>({
    sale: {
      totalPrice: 0,
      paidVia: 'CASH',
      userId: '',
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
            <SaleGeneralInfo plants={plants} sale={sale} />
            <Select disabled>
              <SelectTrigger>
                <SelectValue
                  placeholder={getMemberById(sale.sale.userId as UUID)}
                />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder={sale.sale.paidVia} />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Label>Price</Label>
            <Input disabled value={sale.sale.totalPrice} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default SaleDetailPage;
