interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'chart';
  className?: string;
}

export default function LoadingSkeleton({ type = 'card', className = "" }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="text-right">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return null;
}
