import React from 'react';

type SkeletonType = 'table' | 'simple' | 'page';

interface SkeletonLoaderProps {
  type?: SkeletonType;
  rows?: number;
  columns?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'table',
  rows = 5,
  columns = 4,
}) => {
  if (type === 'simple') {
    return <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>;
  }

  if (type === 'page') {
    return (
      <div className="animate-pulse">
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-9 w-9 rounded-full bg-gray-200"></div>
          <div className="h-4 w-48 rounded bg-gray-200"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="w-full overflow-hidden rounded-lg bg-white shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-gray-100 p-4 md:w-1/3">
                      <div className="h-6 w-3/4 rounded bg-gray-200"></div>
                      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-grow flex-col justify-between p-4 md:w-2/3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                          <div className="mt-2 h-6 w-3/4 rounded bg-gray-200"></div>
                        </div>
                        <div>
                          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                          <div className="mt-2 h-6 w-3/4 rounded bg-gray-200"></div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                        <div className="h-6 w-1/4 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="w-full rounded-lg bg-white p-6 shadow">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-200"></div>
                <div className="mx-auto mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
                <div className="mx-auto mb-6 h-4 w-1/2 rounded bg-gray-200"></div>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="mb-4 flex items-center">
                    <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                    <div className="ml-3 h-4 flex-grow rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default table skeleton
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-8 w-full rounded bg-gray-200"></div>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="mb-4 flex space-x-4">
          {[...Array(columns)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 flex-1 rounded bg-gray-200"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
