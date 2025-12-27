'use client';

import {
  AlertTriangle,
  BarChart2,
  BrainCircuit,
  Compass,
  GitGraph,
  Home,
  Landmark,
  Map,
  MoveRight,
  Sparkles,
  Target,
  Users,
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
    icon: <Home />,
  },
  {
    href: '/explore',
    label: 'Explore Tools',
    icon: <Compass />,
  },
];

const primaryTools = [
    {
    href: '/career-planner',
    label: 'AI Career Planner',
    icon: <BrainCircuit />,
  },
  {
    href: '/city-intelligence',
    label: 'City Intelligence',
    icon: <Map />,
  },
  {
    href: '/migration-assistant',
    label: 'Migration Assistant',
    icon: <MoveRight />,
  },
    {
    href: '/skill-extractor',
    label: 'Skill Extractor',
    icon: <Sparkles />,
  },
]

const advancedTools = [
    {
    href: '/migration-simulator',
    label: 'Migration Simulator',
    icon: <Users />,
  },
    {
    href: '/skill-graph',
    label: 'Skill Graph',
    icon: <GitGraph />,
  },
     {
    href: '/policy-advisor',
    label: 'Policy Advisor',
    icon: <Landmark />,
  },
     {
    href: '/workforce-twin',
    label: 'Workforce Twin',
    icon: <Users />,
  },
]

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
      <SidebarMenuItem>
        <span className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">Tools</span>
      </SidebarMenuItem>
      {primaryTools.map((item) => (
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
       <SidebarMenuItem>
        <span className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">Advanced AI</span>
      </SidebarMenuItem>
       {advancedTools.map((item) => (
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
