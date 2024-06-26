'use client';

import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { AddMemberModal } from '../components/AddMemberModal';

const addMember = () => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Members', href: '/members' },
    { label: 'Add Member' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div className="container  max-w-6xl rounded-xl bg-white p-4 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Create New Member</h1>
        <AddMemberModal/>
      </div>
    </>
  );
};

export default addMember;
