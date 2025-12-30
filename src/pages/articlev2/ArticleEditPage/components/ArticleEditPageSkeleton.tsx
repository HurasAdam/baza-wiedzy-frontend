import { Card, CardContent, CardHeader } from "../../../../components/ui/card";

export const ArticleEditPageSkeleton = () => {
  return (
    <div className="px-4 py-4 space-y-6">
      {/* ===== HEADER ===== */}
      <header className="flex items-center gap-4 border-b border-border pb-4">
        <SkeletonBox className="w-16 h-16 rounded-lg" />

        <div className="space-y-2 flex-1">
          <SkeletonBox className="h-5 w-[280px]" />
          <SkeletonBox className="h-4 w-[420px]" />
        </div>
      </header>

      {/* ===== BANNER ===== */}
      <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-5 py-4">
        <div className="flex items-start gap-4 flex-1">
          <SkeletonBox className="w-9 h-9 rounded-md" />

          <div className="space-y-2 w-full">
            <SkeletonBox className="h-4 w-[220px]" />
            <SkeletonBox className="h-3 w-full max-w-[520px]" />
            <SkeletonBox className="h-3 w-[460px]" />
          </div>
        </div>

        <div className="flex gap-2">
          <SkeletonBox className="h-9 w-20" />
          <SkeletonBox className="h-9 w-24" />
        </div>
      </div>

      {/* ===== FORM GRID ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-20 gap-8">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-12 flex flex-col gap-6">
          {/* Title */}
          <Card className="p-6">
            <CardHeader>
              <SkeletonBox className="h-5 w-[200px]" />
            </CardHeader>
            <CardContent>
              <SkeletonBox className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Employee description */}
          <Card className="p-6">
            <CardHeader>
              <SkeletonBox className="h-5 w-[260px]" />
            </CardHeader>
            <CardContent>
              <SkeletonBox className="h-[175px] w-full" />
            </CardContent>
          </Card>

          {/* Response variant */}
          <Card className="p-6 space-y-4">
            <CardHeader>
              <SkeletonBox className="h-5 w-[180px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <SkeletonBox className="h-10 w-full" />
              <SkeletonBox className="h-[200px] w-full" />
            </CardContent>
          </Card>

          <SkeletonBox className="h-9 w-[200px]" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Product */}
          <Card className="p-6">
            <CardHeader>
              <SkeletonBox className="h-5 w-[120px]" />
            </CardHeader>
            <CardContent>
              <SkeletonBox className="h-10 w-full" />
              <SkeletonBox className="h-3 w-[90%] mt-3" />
            </CardContent>
          </Card>

          {/* Category */}
          <Card className="p-6">
            <CardHeader>
              <SkeletonBox className="h-5 w-[140px]" />
            </CardHeader>
            <CardContent>
              <SkeletonBox className="h-10 w-full" />
              <SkeletonBox className="h-3 w-[85%] mt-3" />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <CardHeader>
              <SkeletonBox className="h-5 w-[100px]" />
            </CardHeader>
            <CardContent>
              <SkeletonBox className="h-12 w-full" />
              <SkeletonBox className="h-3 w-[80%] mt-3" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted/70 ${className}`} />
);
