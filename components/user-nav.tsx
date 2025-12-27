import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

export function UserNav() {
  return (
    <div className="group-data-[collapsible=icon]:hidden flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="@user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Guest User</span>
        <span className="text-xs text-muted-foreground">guest@example.com</span>
      </div>
    </div>
  );
}
