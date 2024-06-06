import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';
import SalesList from './components/SalesList';

export default function SalesPage() {
  return (
    <Container>
      <Hero title="Sales" description="Manage your sales" />
      <SalesList />
    </Container>
  );
}
