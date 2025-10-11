import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export function TasksSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-24"/>
          <Skeleton className="h-4 w-48 mt-1"/>
        </div>
        <Skeleton className="h-12 w-32"/>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg"/>
                <div>
                  <Skeleton className="h-6 w-12"/>
                  <Skeleton className="h-3 w-16 mt-1"/>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5"/>
              <Skeleton className="h-6 w-20"/>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Skeleton className="h-10 w-full"/>
            </div>
            <Skeleton className="h-10 w-full"/>
            <Skeleton className="h-10 w-full"/>
            <Skeleton className="h-10 w-full"/>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48"/>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8"/>
          <Skeleton className="h-8 w-8"/>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="group">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-6 w-3/4"/>
                  <Skeleton className="h-4 w-full mt-2"/>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Skeleton className="h-5 w-20"/>
                  <Skeleton className="h-5 w-16"/>
                </div>
                <Skeleton className="h-px w-full"/>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Skeleton className="h-3 w-4"/>
                  <Skeleton className="h-3 w-24 ml-1"/>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
