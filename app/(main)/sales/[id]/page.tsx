import { Container } from '@/components/generic/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SaleGeneralInfo } from './components/SaleGeneralInfo';

const SaleDetailPage = () => {
  return (
    <Container>
      <div className="h-full w-full flex-1 flex-col space-y-12 md:flex ">
        <section>
          <SaleGeneralInfo
            plants={[
              { id: 8, name: 'Ganza', price: 14 },
              { id: 9, name: 'Placa', price: 22 },
            ]}
          />
        </section>
      </div>
    </Container>
  );
};

export default SaleDetailPage;
