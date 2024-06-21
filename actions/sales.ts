'use server';

import configuration from '@/app/configuration';
import { redirect } from 'next/navigation';

export async function backToSalesPage() {
  redirect(configuration.paths.sales.all);
}
