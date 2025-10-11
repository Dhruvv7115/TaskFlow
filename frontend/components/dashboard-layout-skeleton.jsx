
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
          {/* Mobile menu button */}
          <Skeleton className="h-9 w-9 lg:hidden" />

          {/* Desktop logo */}
          <div className="hidden lg:flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Right side items */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-20 hidden sm:inline-block" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-16 bottom-0 border-r bg-sidebar text-sidebar-foreground shadow-lg">
          <div className="flex flex-col h-full">
            <div className="flex-1 px-4 py-6 space-y-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="container py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex flex-row items-center justify-between pb-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                    <div>
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-3 w-24 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
