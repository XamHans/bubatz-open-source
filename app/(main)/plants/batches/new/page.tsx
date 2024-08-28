// page.tsx

import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import CreateBatchForm from '../../components/CreateBatchForm';

export const metadata: Metadata = {
  title: 'Create a new batch',
  description:
    'A batch is a group of plants that share the same characteristics. Create a new batch to start tracking your plants.',
};

const CreateBatchPage = () => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'Create New Batch' },
  ];
  return (
    <>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/members">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>{metadata.title?.toString()}</CardTitle>
            <CardDescription>
              {metadata.description?.toString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-transparent">
            <CreateBatchForm />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CreateBatchPage;
