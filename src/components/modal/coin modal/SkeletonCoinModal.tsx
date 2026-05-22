export const SkeletonCoinModal = () => {
  return (
    <div data-testid="modalSkeleton" className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-28 bg-white/5 rounded-lg"></div>
        <div className="h-6 w-20 bg-white/5 rounded-lg"></div>
      </div>
      <div className="relative h-48 w-full bg-linear-to-r from-white/5 via-white/10 to-white/5 rounded-xl overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/10 transform -translate-y-1/2"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="h-12 bg-white/5 rounded-xl"></div>
        <div className="h-12 bg-white/5 rounded-xl"></div>
        <div className="h-12 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
};
