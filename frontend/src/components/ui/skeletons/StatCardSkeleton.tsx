const StatCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-base-300 w-12 h-12" />
        <div className="space-y-2 w-full">
          <div className="h-4 bg-base-300 rounded w-2/3" />
          <div className="h-6 bg-base-300 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;
