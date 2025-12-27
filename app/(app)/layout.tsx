import { Logo } from '@/components/logo';
import { Nav } from '@/components/nav';
import AuthGuard from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarTriggerIcon,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Separator } from '@/components/ui/separator';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="size-9" asChild>
                <a href="/">
                  <Logo className="size-full" />
                </a>
              </Button>
              <h1 className="text-xl font-bold font-headline text-foreground group-data-[collapsible=icon]:hidden">
                SkillMapper AI
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Nav />
          </SidebarContent>
          <SidebarFooter>
            <Separator className="my-1 bg-sidebar-border" />
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
            <div className="flex items-center gap-2">
              <a href="/">
                <Logo className="size-7" />
              </a>
              <h1 className="font-headline text-xl font-bold">SkillMapper AI</h1>
            </div>
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <SidebarTriggerIcon />
              </Button>
            </SidebarTrigger>
          </header>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

    