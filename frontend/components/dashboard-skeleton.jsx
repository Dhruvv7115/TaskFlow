
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-20" />
              </CardTitle>
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-3 w-24 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-3 w-full" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-6 w-8 mx-auto mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-6 w-8 mx-auto mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-6 w-8 mx-auto mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Tasks */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Tip */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
