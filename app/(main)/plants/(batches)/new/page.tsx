// page.tsx

import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Metadata } from 'next';
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
      <Breadcrumbs items={breadcrumbs} />
      <div className="container  max-w-6xl rounded-xl bg-white p-4 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Create New Batch</h1>
        <CreateBatchForm />
      </div>
    </>
  );
};

export default CreateBatchPage;
