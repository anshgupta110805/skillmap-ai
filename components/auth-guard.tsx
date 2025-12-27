'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if we're on auth pages
    if (!isAuthenticated && !pathname.startsWith('/auth')) {
      router.push('/auth');
    }
  }, [isAuthenticated, router, pathname]);

  // If not authenticated and not on auth pages, don't render children
  if (!isAuthenticated && !pathname.startsWith('/auth')) {
    return null;
  }

  return <>{children}</>;
}