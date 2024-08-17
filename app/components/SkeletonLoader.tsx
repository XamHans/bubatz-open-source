import React from 'react';

type SkeletonType = 'table' | 'simple';

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
