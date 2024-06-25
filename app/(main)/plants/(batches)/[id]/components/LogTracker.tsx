'use client';

import { GenericModal } from '@/components/generic/GenericModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  CreatePlantInput,
  createPlantInputSchema,
} from '@/modules/plants/data-access/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from 'postcss';
import { useState } from 'react';
import { Button } from 'react-day-picker';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

const logSchema = z.object({
  memberId: z.string(),
  plantId: z.string(),
  batchId: z.string(),
  action: z.string(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long'),
});

const exampleLogs = [
  {
    id: '1',
    memberId: 'member123',
    plantId: 'plant123',
    batchId: 'batch1',
    action: 'Watered',
    description: 'Watered the plants thoroughly.',
    timestamp: new Date(),
  },
  {
    id: '2',
    memberId: 'member124',
    plantId: 'plant124',
    batchId: 'batch2',
    action: 'Fertilized',
    description: 'Applied fertilizer to the plants.',
    timestamp: new Date(),
  },
];

const LogTracker: React.FC = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<CreatePlantInput>({
    resolver: zodResolver(createPlantInputSchema),
  });

  const onSubmit = (data: CreatePlantInput) => {
    console.log('Create Plant ', data);
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logbook</CardTitle>
        <CardDescription>Keep track of changes to plants</CardDescription>
      </CardHeader>
      <CardContent className="mx-4">
        <ol className="relative">
          <li className="mb-10 ml-6">
            <span className="absolute -left-3 mt-3 flex h-6 w-6 items-center justify-center   ">
              <Avatar className="">
                <AvatarImage
                  src="/docs/images/people/profile-picture-3.jpg"
                  alt="Bonnie image"
                />
                <AvatarFallback>BN</AvatarFallback>
              </Avatar>
            </span>
            <Card className="items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex">
              <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                just now
              </time>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                Bonnie moved{' '}
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
                >
                  Jese Leos
                </a>{' '}
                to
                <Badge className="ml-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-normal text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                  Funny Group
                </Badge>
              </div>
            </Card>
          </li>
        </ol>
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <GenericModal
          headerTitle="Add New Entry"
          description="Fill out the details below to add a new plant to the batch."
          open={open}
          setOpen={setOpen}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-2 sm:grid-cols-2 md:gap-4"
            >
              <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>{t('MEMBER.FIRST_NAME')}</FormLabel> */}
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Give the plant a name if you like"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>{t('MEMBER.LAST_NAME')}</FormLabel> */}
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the position of the plant inside of the batch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </GenericModal>
      </CardFooter>
    </Card>
  );
};

export { LogTracker };
