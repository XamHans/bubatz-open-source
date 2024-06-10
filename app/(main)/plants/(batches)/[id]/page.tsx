import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const BatchDetailPage = async () => {
  return (
    <div className="flex min-h-screen w-full flex-col py-12">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className=" grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          {/* Crew name + category */}
          <div className="flex items-center gap-4">
            <Link href={`/`}>
              {' '}
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Batch 00-1
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              active
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Link href="#">
                {' '}
                <Button size="sm">See Repo</Button>
              </Link>
            </div>
          </div>

          {/* Main area with two sides, each contain cards */}
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            {/* Card on Left side   */}
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Crew Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6"></div>
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Install</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex p-1"></div>
                </CardContent>
              </Card>

              {/* Input & Output Section */}
              <Card x-chunk="dashboard-08-chunk-2">
                <CardHeader>
                  <CardTitle>Input & Output </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="font-semibold">Input</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cards on Right Side */}
            <div className="grid auto-rows-max items-start gap-2 lg:gap-8">
              {/* Creators Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-10 flex w-full flex-row items-center justify-center">
                    {/* <AnimatedTooltip items={people} /> */}
                  </div>
                </CardContent>
              </Card>

              {/* Tools used Card */}
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Tools used</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8"></CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BatchDetailPage;
