'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  PackageCheck,
  Plus,
  Trash2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { siteConfig } from '@/config/site'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { UserSchema } from '@/modules/members/data-access/schema'
import { fetchMembersUseCase } from '@/modules/members/use-cases'
import { StrainProps } from '@/modules/plants/data-access/schema'
import { fetchStrainsUseCase } from '@/modules/plants/use-cases'
import {
  CreateSaleWithItemsInput,
  createSaleWithItemsInputSchema,
  paymentMethods,
} from '@/modules/sales/data-access/schema'
import {
  checkIfMemberIsAllowedForStrainUseCase,
  createSaleUseCase,
  fetchMembersStrainAmountUseCase,
} from '@/modules/sales/use-cases'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'

export interface SaleFormProps {
  session: Session | null
}

export default function SaleForm({ session }: SaleFormProps) {
  const t = useTranslations('Sales')
  const tGeneral = useTranslations('General')
  const [members, setMembers] = useState<UserSchema[]>([])
  const [strains, setStrains] = useState<StrainProps[]>([])
  const [open, setOpen] = useState(false)
  const [totalWeight, setTotalWeight] = useState(0)
  const [memberMonthlyPurchase, setMemberMonthlyPurchase] = useState(0)
  const [isMemberAllowedForStrain, setIsMemberAllowedForStrain] = useState(true)

  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<CreateSaleWithItemsInput>({
    resolver: zodResolver(createSaleWithItemsInputSchema),
    defaultValues: {
      totalPrice: 0,
      salesById: session?.user.id ?? '',
      paidVia: undefined,
      memberId: '',
      items: [],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const createSaleAction = useAction(createSaleUseCase, {
    onSuccess: ({ data }) => {
      console.log('success data', data)
      toast({
        title: t('messages.success.title'),
        duration: 1000,
        description: t('messages.success.description'),
      })
      setTimeout(() => {
        router.push(
          `${siteConfig.links.sales.detail.replace(':id', data?.success as any)}`,
        )
      }, 2000)
    },
    onError: ({ error }) => {
      console.log('error data', error.serverError)

      toast({
        title: t('messages.error.title'),
        duration: 10000,
        variant: 'destructive',
        description: error.serverError,
      })
    },
  })

  const fetchMemberPurchasesForCurrentMonth = useAction(
    fetchMembersStrainAmountUseCase,
    {
      onSuccess: ({ data }) => {
        setMemberMonthlyPurchase(data?.success || 0)
      },
      onError: ({ error }) => {
        logger.error('Error fetching member purchases:', error)
        toast({
          title: t('messages.error.title'),
          duration: 10000,
          variant: 'destructive',
          description: error.serverError,
        })
      },
    },
  )

  const checkIfMemberIsAllowedForStrain = useAction(
    checkIfMemberIsAllowedForStrainUseCase,
    {
      onSuccess: ({ data }) => {
        setIsMemberAllowedForStrain(data?.success)
      },
      onError: ({ error }) => {
        logger.error(
          error,
          'Error happened while checking if member is allowed for strain:',
        )
        toast({
          title: t('messages.error.title'),
          duration: 10000,
          variant: 'destructive',
          description: error.serverError,
        })
      },
    },
  )

  const fetchMembers = useAction(fetchMembersUseCase, {
    onSuccess: ({ data }) => {
      const sortedMembers = [...data?.success].sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        ),
      )
      setMembers(sortedMembers)
    },
    onError: ({ error }) => {
      logger.error('Error fetching members:', error)
      toast({
        title: t('messages.error.title'),
        duration: 10000,
        variant: 'destructive',
        description: error.serverError,
      })
    },
  })

  const fetchStrains = useAction(fetchStrainsUseCase, {
    onSuccess: ({ data }) => {
      //@ts-ignore
      setStrains(data?.success ?? [])
    },
    onError: ({ error }) => {
      logger.error('Error fetching strains:', error)
      toast({
        title: t('messages.error.title'),
        duration: 10000,
        variant: 'destructive',
        description: error.serverError,
      })
    },
  })

  useEffect(() => {
    fetchMembers.execute({})
    fetchStrains.execute({})
  }, [])

  useEffect(() => {
    const totalPrice = fields.reduce(
      (sum, item) => sum + (item.price || 0) * (item.amount || 0),
      0,
    )
    form.setValue('totalPrice', totalPrice)
    const weight = fields.reduce((sum, item) => sum + (item.amount || 0), 0)
    setTotalWeight(weight)

    if (weight > 30) {
      form.setError('root', {
        type: 'manual',
        message: t('alerts.weightLimit.exceeded', { total: weight.toFixed(2) }),
      })
    } else {
      form.clearErrors('root')
    }

    const salesById = form.getValues('salesById')
    const memberId = form.getValues('memberId')
    if (salesById && memberId && salesById === memberId) {
      form.setError('memberId', {
        type: 'manual',
        message: t('alerts.selfSale'),
      })
    } else {
      form.clearErrors('memberId')
    }
  }, [fields, form, t])

  const handleMemberChange = (memberId: string) => {
    form.setValue('memberId', memberId)
    fetchMemberPurchasesForCurrentMonth.execute({
      memberId,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    })
  }

  const handleStrainChange = (index: number, strainId: number) => {
    const selectedStrain = strains.find((strain) => strain.id === strainId)
    if (selectedStrain) {
      update(index, {
        strainId,
        amount: form.getValues(`items.${index}.amount`) || 0,
        price: selectedStrain.currentPricePerGram || 0,
      })
      const memberId = form.getValues('memberId')
      if (memberId) {
        checkIfMemberIsAllowedForStrain.execute({ memberId, strainId })
      }
    }
  }

  const handleWeightChange = (index: number, weight: number) => {
    const currentItem = form.getValues(`items.${index}`)
    const totalPrice = weight * (currentItem.price || 0)
    update(index, {
      ...currentItem,
      amount: weight,
      //@ts-ignore
      totalPrice: totalPrice,
    })
  }

  const onSubmit = (data: CreateSaleWithItemsInput) => {
    createSaleAction.execute(data)
  }

  const remainingAllowance = 50 - memberMonthlyPurchase
  const isOverLimit = memberMonthlyPurchase + totalWeight > 50

  if (!session) {
    return <>{t('noSession')}</>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('selectMember')}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem className="flex-col">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? members.find(
                                (member) => member.id === field.value,
                              )?.firstName +
                              ' ' +
                              members.find(
                                (member) => member.id === field.value,
                              )?.lastName
                            : t('selectMemberPlaceholder')}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command
                        className="flex w-[500px]"
                        filter={(value, search) => {
                          const member = members.find((m) => m.id === value)
                          if (!member) {
                            return 0
                          }
                          const memberName =
                            `${member.firstName} ${member.lastName}`.toLowerCase()
                          return memberName.includes(search.toLowerCase())
                            ? 1
                            : 0
                        }}
                      >
                        <CommandInput placeholder={t('searchMember')} />
                        <CommandList>
                          <CommandEmpty>{t('noMemberFound')}</CommandEmpty>
                          <CommandGroup>
                            {members.map((member) => (
                              <CommandItem
                                key={member.id}
                                value={member.id}
                                onSelect={() => {
                                  handleMemberChange(member.id)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    member.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {member.firstName} {member.lastName} (
                                {new Date(member.birthday).toLocaleDateString(
                                  'de-DE',
                                )}
                                )
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {form.watch('memberId') && (
          <Alert variant={isOverLimit ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isOverLimit
                ? t('alerts.monthlyLimit.exceeded', {
                    total: (memberMonthlyPurchase + totalWeight).toFixed(2),
                  })
                : t('alerts.monthlyLimit.remaining', {
                    current: memberMonthlyPurchase,
                    remaining: remainingAllowance.toFixed(2),
                  })}
            </AlertDescription>
          </Alert>
        )}
        {form.formState.errors.memberId && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {form.formState.errors.memberId.message}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('selectStrains')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 items-end gap-4 md:grid-cols-7"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.strainId`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>{t('strain')}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(parseInt(value))
                            handleStrainChange(index, parseInt(value))
                          }}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t('selectStrainPlaceholder')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {strains.map((strain) => (
                              <SelectItem
                                key={strain.id}
                                value={strain.id.toString()}
                              >
                                {strain.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>{t('available')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={
                          strains.find((s) => s.id === field.strainId)
                            ?.amountAvailable || 0
                        }
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name={`items.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('weight')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value)
                              field.onChange(value)
                              handleWeightChange(index, value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pricePerGram')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value =
                                e.target.value === ''
                                  ? 0
                                  : parseFloat(e.target.value)
                              field.onChange(value)
                              handleWeightChange(
                                index,
                                form.getValues(`items.${index}.amount`),
                              )
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>{t('totalPrice')}</FormLabel>
                    <FormControl>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        {(
                          (form.getValues(`items.${index}.amount`) || 0) *
                          (form.getValues(`items.${index}.price`) || 0)
                        ).toFixed(2)}
                        €
                      </div>
                    </FormControl>
                  </FormItem>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-10 w-10 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ strainId: 0, amount: 0, price: 0 })}
              >
                <Plus className="mr-2 h-4 w-4" /> {t('addItem')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {!isMemberAllowedForStrain && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t('alerts.ageRestriction')}</AlertDescription>
          </Alert>
        )}

        {form.formState.isDirty && totalWeight > 0 && (
          <Alert variant={totalWeight > 30 ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {totalWeight > 30
                ? t('alerts.weightLimit.exceeded', {
                    total: totalWeight.toFixed(2),
                  })
                : t('alerts.weightLimit.current', {
                    total: totalWeight.toFixed(2),
                  })}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('paymentDetails.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="paidVia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('paymentDetails.method')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('paymentDetails.selectMethod')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(paymentMethods.enumValues).map(
                          (method) => (
                            <SelectItem key={method} value={method}>
                              {t(`paymentDetails.methods.${method}`)}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('paymentDetails.totalPrice')}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={
              totalWeight > 30 || isOverLimit || !form.formState.isDirty
            }
          >
            <PackageCheck className="mr-2 h-4 w-4" /> {t('createSale')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
