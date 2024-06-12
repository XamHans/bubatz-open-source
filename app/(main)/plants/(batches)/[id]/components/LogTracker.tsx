'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  return (
    <ol className="relative border-l border-gray-200 p-6 dark:border-gray-700">
      <li className="mb-10 ml-6">
        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center   ">
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
      <li className="mb-10 ml-6">
        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
          <Avatar>
            <AvatarImage
              src="/docs/images/people/profile-picture-5.jpg"
              alt="Thomas Lean image"
            />
            <AvatarFallback>TL</AvatarFallback>
          </Avatar>
        </span>
        <Card className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700">
          <div className="mb-3 items-center justify-between sm:flex">
            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
              2 hours ago
            </time>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
              Thomas Lean commented on{' '}
              <a
                href="#"
                className="font-semibold text-gray-900 hover:underline dark:text-white"
              >
                Flowbite Pro
              </a>
            </div>
          </div>
          <CardContent className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs font-normal italic text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-300">
            Hi ya'll! I wanted to share a webinar zeroheight is having regarding
            how to best measure your design system! This is the second session
            of our new webinar series on #DesignSystems discussions where we'll
            be speaking about Measurement.
          </CardContent>
        </Card>
      </li>
      <li className="ml-6">
        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
          <Avatar>
            <AvatarImage
              src="/docs/images/people/profile-picture-1.jpg"
              alt="Jese Leos image"
            />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
        </span>
        <Card className="items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex">
          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
            1 day ago
          </time>
          <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
            Jese Leos has changed{' '}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
            >
              Pricing page
            </a>{' '}
            task status to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              Finished
            </span>
          </div>
        </Card>
      </li>
    </ol>
  );
};

export { LogTracker };
