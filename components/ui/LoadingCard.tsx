export default function LoadingCard() {
  return (
    <div className="bg-bg-secondary border border-border rounded-2xl p-6 animate-pulse">
      {/* Number placeholder */}
      <div className="flex justify-end mb-4">
        <div className="h-4 w-12 bg-border rounded"></div>
      </div>

      {/* Image placeholder */}
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        <div className="w-32 h-32 bg-border rounded-full"></div>
      </div>

      {/* Name placeholder */}
      <div className="h-6 w-3/4 bg-border rounded mb-3"></div>

      {/* Types placeholder */}
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-border rounded-full"></div>
        <div className="h-6 w-16 bg-border rounded-full"></div>
      </div>
    </div>
  );
}
