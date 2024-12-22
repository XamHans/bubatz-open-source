import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import React from 'react'

interface SaleItemsCardsProps {
  items: any[]
}

const SaleItemsCards: React.FC<SaleItemsCardsProps> = ({ items }) => {
  const t = useTranslations('Sales')

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="w-full overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow bg-secondary p-4 md:w-1/3">
                <h3 className="text-lg font-semibold">{item.strainName}</h3>
                <Badge variant="outline" className="mt-2">
                  {t('saleItems.strainId', { id: item.strainId })}
                </Badge>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('saleItems.thc')}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs font-extrabold text-black"
                    >
                      {item.thc}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('saleItems.cbd')}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs font-extrabold text-black"
                    >
                      {item.cbd}%
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-grow flex-col justify-between p-4 md:w-2/3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('saleItems.amount')}
                    </p>
                    <p className="text-lg font-medium">
                      {t('saleItems.amountValue', {
                        amount: item.amount.toFixed(2),
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('saleItems.pricePerGram')}
                    </p>
                    <p className="text-lg font-medium">
                      {t('saleItems.priceValue', {
                        price: item.price.toFixed(2),
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('saleItems.totalPrice')}
                  </span>
                  <span className="text-xl font-bold">
                    {t('saleItems.totalPriceValue', {
                      price: (item.amount * item.price).toFixed(2),
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SaleItemsCards
