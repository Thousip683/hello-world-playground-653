import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  UserCog,
  Building2,
  Lock,
  Bell,
} from 'lucide-react';

interface ProfileDropdownProps {
  type?: 'citizen' | 'admin';
}

export const ProfileDropdown = ({ type = 'citizen' }: ProfileDropdownProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/auth">Login</Link>
        </Button>
        <Button asChild variant="default" size="sm">
          <Link to="/auth">Register</Link>
        </Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    if (type === 'admin') {
      navigate('/admin/login');
    } else {
      navigate('/');
    }
  };

  const getInitials = (email: string) => {
    const name = user.user_metadata?.full_name || email;
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserName = () => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  const getUserRole = () => {
    if (type === 'admin') {
      return user.user_metadata?.department || 'Admin';
    }
    return 'Citizen';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-border/50">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={getUserName()} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user.email || '')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-3">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={getUserName()} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.email || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{getUserName()}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {getUserRole()}
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        {type === 'admin' ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin/departments" className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Manage Departments</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notification Settings</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem asChild>
          <Link to="/help" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};