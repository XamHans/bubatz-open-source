// page.tsx

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import CreateBatchForm from '../../components/CreateBatchForm';

export const metadata: Metadata = {
  title: 'Create a new batch',
  description: 'Create a new batch of plants',
};

const CreateBatchPage = () => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'Create New Batch' },
  ];
  return (
    <>
      <Link href={siteConfig.links.plants.index}>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <div className="container  max-w-6xl rounded-xl bg-white p-4 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Create New Batch</h1>
        <CreateBatchForm />
      </div>
    </>
  );
};

export default CreateBatchPage;
