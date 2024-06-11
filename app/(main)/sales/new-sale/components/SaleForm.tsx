'use client';

import { useEffect, useState } from 'react';
import SaleItem from './types';
import SaleItemsTable from './SaleItemsTable';
import CreateSaleItemModal from './CreateSaleItemModal';
import { CreateSaleInput } from '@/modules/sales/data-access/schema';
import { useSession } from 'next-auth/react';

export default function SaleForm() {
  const session = useSession();

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [plants, setPlants] = useState<{ name: string; price: number }[]>([]);
  const [sale, setSale] = useState<CreateSaleInput>({
    totalPrice: 0,
    paidVia: 'CASH',
    userId: '',
    salesById: session.data?.user.id ?? '',
  });

  const addItemToSale = (sale: SaleItem) => {
    setSaleItems((prev) => [...prev, sale]);
  };

  const deleteItemFromSale = (item: SaleItem) => {
    setSaleItems((prev) => prev.filter((i) => i !== item));
  };

  // Calculate the total price of the sale, whenever the sale items change
  useEffect(() => {
    console.log('saleItems', saleItems);
    // TODO: Implement the logic to calculate the total price of the sale
    setSale((prev) => ({
      ...prev,
      totalPrice: saleItems.reduce(
        (totalPrice, item) => totalPrice + item.totalPrice,
        0,
      ),
    }));
  }, [saleItems]);

  useEffect(() => {
    setPlants([
      { name: 'Ganza', price: 14 },
      { name: 'Placa', price: 22 },
    ]);
  }, []);

  return (
    <>
      <CreateSaleItemModal plants={plants} addItem={addItemToSale} />
      {saleItems.length > 0 ? (
        <>
          <SaleItemsTable
            saleItems={saleItems}
            deleteItem={deleteItemFromSale}
          />
          Total Price: {sale.totalPrice}
        </>
      ) : (
        <div>There are no items in the sale. Start by adding an item.</div>
      )}
    </>
  );
}
