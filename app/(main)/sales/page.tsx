import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';
import SalesList from './components/SalesList';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import configuration from '@/app/configuration';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import { UserSchema } from '@/modules/members/data-access/schema';
import { useEffect, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { fetchMembersUseCase } from '@/modules/members/use-cases';

export default function SalesPage() {
  const metadata: Metadata = {
    title: 'Manage Sales',
    description: 'Add a new sale or see the details of an existing one.',
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
            <div className="grid grid-cols-2">
              <div>
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
              </div>
              <div className="flex justify-end">
                <Link href={configuration.paths.sales.new}>
                  <Button size="sm" className="h-8 w-32 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Sale
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SalesList />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
