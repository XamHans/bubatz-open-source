'use server';

import { siteConfig } from '@/config/site';
import { redirect } from 'next/navigation';

export async function backToSalesPage() {
  redirect(siteConfig.links.sales.index);
}
