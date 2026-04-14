'use client';

import {
  LayoutDashboard,
  Zap,
  Route,
  Ship,
  Map,
  GraduationCap,
  Eye,
  FileText,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
  },
  {
    href: '/skills',
    label: 'Skills Intelligence',
    icon: <Zap />,
  },
  {
    href: '/career-routes',
    label: 'Career Routes',
    icon: <Route />,
  },
  {
    href: '/migration',
    label: 'Migration Simulator',
    icon: <Ship />,
  },
  {
    href: '/city-intelligence',
    label: 'City Intelligence',
    icon: <Map />,
  },
  {
    href: '/learning-path',
    label: 'Learning Path',
    icon: <GraduationCap />,
  },
  {
    href: '/watchlist',
    label: 'Watchlist',
    icon: <Eye />,
  },
  {
    href: '/report',
    label: 'Career DNA Report',
    icon: <FileText />,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: <Settings />,
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
