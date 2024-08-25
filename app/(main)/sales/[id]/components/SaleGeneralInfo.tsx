import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import {
  HiCalendar,
  HiCash,
  HiCurrencyDollar,
  HiScale,
  HiShieldCheck,
  HiUser,
} from 'react-icons/hi';

interface SaleGeneralInfoProps {
  sale: any;
}

const SaleGeneralInfo: React.FC<SaleGeneralInfoProps> = ({ sale }) => {
  console.log('sale in SaleGeneralInfo', sale.buyer);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sale #{sale.id}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <InfoItem
          icon={HiUser}
          primary="Member"
          secondary={`${sale.buyer.fullName}`}
        />
        <InfoItem
          icon={HiUser}
          primary="Sold By"
          secondary={`${sale.seller.fullName} `}
        />
        <InfoItem
          icon={HiCalendar}
          primary="Sale Date"
          secondary={formatDate(sale.createdAt)}
        />
        <InfoItem
          icon={HiCurrencyDollar}
          primary="Total Price"
          secondary={`€${sale.totalPrice.toFixed(2)}`}
        />
        <InfoItem
          icon={HiScale}
          primary="Total Amount"
          secondary={`${sale.totalAmount.toFixed(2)}g`}
        />
        <InfoItem
          icon={HiCash}
          primary="Payment Method"
          secondary={sale.paidVia}
        />
        <InfoItem
          icon={HiShieldCheck}
          primary="Sale ID"
          secondary={sale.id.toString()}
        />
      </CardContent>
    </Card>
  );
};

interface InfoItemProps {
  icon: React.ElementType;
  primary: string;
  secondary?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon: Icon,
  primary,
  secondary,
}) => (
  <div className="flex items-center space-x-3 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
    <Icon className="h-5 w-5 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium">{primary}</p>
      {secondary && (
        <p className="text-sm text-muted-foreground">{secondary}</p>
      )}
    </div>
  </div>
);

export default SaleGeneralInfo;
