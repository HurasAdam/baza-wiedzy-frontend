export const ArticleMainPageSkeleton = () => {
  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-0 animate-pulse">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
        <div className="flex items-center gap-4">
          {/* Back button */}
          <div className="w-16 h-16 rounded-lg bg-muted/40" />

          <div className="space-y-3">
            <div className="h-6 w-[420px] bg-muted/40 rounded" />
            <div className="h-4 w-[260px] bg-muted/30 rounded" />
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-60 bg-muted/30 rounded-lg" />
          <div className="h-9 w-9 bg-muted/30 rounded-md" />
        </div>
      </div>

      {/* ================= CONTENT GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pb-10">
        {/* ---------- LEFT COLUMN ---------- */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Employee notes */}
          <div className="border border-border rounded-lg bg-card/70 p-6 space-y-4">
            <div className="h-5 w-64 bg-muted/40 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/20 rounded" />
              <div className="h-4 w-[92%] bg-muted/20 rounded" />
              <div className="h-4 w-[88%] bg-muted/20 rounded" />
              <div className="h-4 w-[75%] bg-muted/20 rounded" />
            </div>
          </div>

          {/* Response variants */}
          <div className="border border-border rounded-lg bg-card/70 p-6 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <div className="h-8 w-28 bg-muted/30 rounded-md" />
              <div className="h-8 w-28 bg-muted/20 rounded-md" />
            </div>

            {/* Header + copy */}
            <div className="flex justify-between items-center">
              <div className="h-4 w-40 bg-muted/30 rounded" />
              <div className="h-8 w-8 bg-muted/30 rounded-md" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/20 rounded" />
              <div className="h-4 w-[96%] bg-muted/20 rounded" />
              <div className="h-4 w-[90%] bg-muted/20 rounded" />
              <div className="h-4 w-[85%] bg-muted/20 rounded" />
            </div>
          </div>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div className="flex flex-col gap-6">
          {/* Metadata */}
          <div className="border border-border rounded-lg bg-card/70 p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/30 rounded-md" />
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-muted/30 rounded" />
                  <div className="h-4 w-40 bg-muted/40 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* User actions */}
          <div className="border border-border rounded-lg bg-card/70 p-6 space-y-3">
            <div className="h-4 w-32 bg-muted/40 rounded mb-2" />
            <div className="h-9 w-full bg-muted/30 rounded-md" />
            <div className="h-9 w-full bg-muted/30 rounded-md" />
            <div className="h-9 w-full bg-muted/30 rounded-md" />
            <div className="h-9 w-full bg-muted/30 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
