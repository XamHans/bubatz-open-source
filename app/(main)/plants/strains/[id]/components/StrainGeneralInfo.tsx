import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import {
  HiCurrencyDollar,
  HiEmojiHappy,
  HiOutlineMoon,
  HiShieldCheck,
  HiShoppingCart,
} from 'react-icons/hi';

interface StrainGeneralInfoProps {
  strain: any;
}

const StrainGeneralInfo: React.FC<StrainGeneralInfoProps> = ({ strain }) => {
  console.log('strain in info card ', strain);
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{strain.name}</CardTitle>
        <CardDescription>{strain.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <InfoItem
          icon={HiEmojiHappy}
          primary="THC"
          secondary={`${strain.thc} %`}
        />{' '}
        <InfoItem
          icon={HiOutlineMoon}
          primary="CBD"
          secondary={`${strain.cbd} %`}
        />
        <InfoItem
          icon={HiCurrencyDollar}
          primary="Price"
          secondary={`€${strain.currentPricePerGram}`}
        />
        <InfoItem
          icon={HiShoppingCart}
          primary="Current Amount available"
          secondary={`${strain.amountAvailable}g`}
        />
        <InfoItem
          icon={HiShieldCheck}
          primary="strain ID"
          secondary={strain.id.toString()}
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

export default StrainGeneralInfo;
