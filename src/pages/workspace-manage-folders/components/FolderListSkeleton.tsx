function FolderListSkeleton({ view }: { view: "grid" | "list" }) {
  const items = Array.from({ length: 8 });

  if (view === "grid") {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((_, i) => (
          <div key={i} className="border rounded-xl px-4 py-5 bg-muted/20 animate-pulse flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted"></div>

              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted/70 rounded w-1/2"></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 opacity-40">
              <div className="w-8 h-8 bg-muted rounded"></div>
              <div className="w-8 h-8 bg-muted rounded"></div>
              <div className="w-8 h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="mt-6 space-y-2">
      {items.map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border rounded-lg px-4 py-3.5 bg-muted/20 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="h-5 w-10 bg-muted rounded"></div>
          </div>

          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-8 bg-muted rounded"></div>
            <div className="w-8 h-8 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FolderListSkeleton;
