'use client';

import {lazy, Suspense, useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {MountedContainer} from "@/components/mounted-container";
import {ModeToggle} from "@/components/theme-toggle";
import Link from 'next/link';
import {
  IconBell,
  IconChecklist,
  IconChevronDown,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconSettings,
  IconSparkles,
  IconUser
} from '@tabler/icons-react';

const DashboardLayoutSkeleton = lazy(() => import('@/components/dashboard-layout-skeleton'));

export default function DashboardLayout({children}) {
  const router = useRouter();
  const pathname = usePathname();
  const {isAuthenticated, loading, logout, user} = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    {name: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard},
    {name: 'Tasks', href: '/dashboard/tasks', icon: IconChecklist},
    {name: 'Profile', href: '/dashboard/profile', icon: IconUser},
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
            >
              <Button
                variant={active ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  active ? 'bg-sidebar-accent hover:bg-accent text-sidebar-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="mr-3 h-4 w-4"/>
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs border">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<DashboardLayoutSkeleton/>}>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <header
          className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            {/* Mobile menu button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                >
                  <IconMenu2 className="h-5 w-5"/>
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 text-sidebar-foreground">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent/>
              </SheetContent>
            </Sheet>

            {/* Desktop logo */}
            <div className="hidden lg:flex items-center gap-2">
              <IconSparkles className="w-6 h-6 text-primary"/>
              <span className="text-xl font-semibold">TaskFlow</span>
            </div>

            {/* Right side items */}
            <div className="flex flex-1 items-center justify-end gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <IconBell className="h-5 w-5"/>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"/>
              </Button>

              <MountedContainer>
                <ModeToggle/>
              </MountedContainer>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block font-medium">
                                            {user?.name}
                                        </span>
                    <IconChevronDown className="h-4 w-4 text-muted-foreground"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground shadow-md">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <IconUser className="mr-2 h-4 w-4"/>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <IconSettings className="mr-2 h-4 w-4"/>
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <IconLogout className="mr-2 h-4 w-4"/>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Desktop Sidebar */}
          <aside
            className="hidden lg:flex w-64 flex-col fixed left-0 top-16 bottom-0 border-r bg-sidebar text-sidebar-foreground shadow-lg">
            <SidebarContent/>
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:pl-64">
            <div className="container py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}