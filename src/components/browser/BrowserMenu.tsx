import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  History,
  Download,
  Bookmark,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  User,
  Shield,
  Zap,
  Globe,
  RefreshCw,
  Archive
} from 'lucide-react';

interface BrowserMenuProps {
  user?: any;
  onHistoryClick: () => void;
  onDownloadsClick: () => void;
  onBookmarksClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
  className?: string;
}

const BrowserMenu: React.FC<BrowserMenuProps> = ({
  user,
  onHistoryClick,
  onDownloadsClick,
  onBookmarksClick,
  onSettingsClick,
  onLogout,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-all duration-200 ${className}`}
          aria-label="Browser menu"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-white border border-slate-200 shadow-lg rounded-lg p-2"
        sideOffset={8}
      >
        {/* User Info */}
        <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2 text-slate-700 border-b border-slate-100 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email || 'user@domain.com'}</div>
          </div>
          <div className="text-xs bg-slate-100 px-2 py-1 rounded">
            Level {user?.accessLevel || 1}
          </div>
        </DropdownMenuLabel>

        {/* New Tab / Window */}
        <DropdownMenuItem 
          onClick={() => handleMenuClick(() => window.location.reload())}
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New tab</span>
          <DropdownMenuShortcut>Ctrl+T</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleMenuClick(() => console.log('New window'))}
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span>New window</span>
          <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* History */}
        <DropdownMenuItem 
          onClick={() => handleMenuClick(onHistoryClick)}
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
        >
          <History className="w-4 h-4" />
          <span>History</span>
          <DropdownMenuShortcut>Ctrl+H</DropdownMenuShortcut>
        </DropdownMenuItem>

        {/* Downloads */}
        <DropdownMenuItem 
          onClick={() => handleMenuClick(onDownloadsClick)}
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Downloads</span>
          <DropdownMenuShortcut>Ctrl+J</DropdownMenuShortcut>
        </DropdownMenuItem>

        {/* Bookmarks */}
        <DropdownMenuItem 
          onClick={() => handleMenuClick(onBookmarksClick)}
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks</span>
          <DropdownMenuShortcut>Ctrl+Shift+O</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Zoom Controls */}
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(() => console.log('Zoom in'))}
        >
          <Zap className="w-4 h-4" />
          <span>Zoom</span>
          <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
            <span>100%</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* More Tools */}
        <DropdownMenuLabel className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
          More tools
        </DropdownMenuLabel>

        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(() => console.log('Task manager'))}
        >
          <Archive className="w-4 h-4" />
          <span>Task manager</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(() => console.log('Developer tools'))}
        >
          <Settings className="w-4 h-4" />
          <span>Developer tools</span>
          <DropdownMenuShortcut>F12</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Settings */}
        <DropdownMenuItem 
          onClick={() => handleMenuClick(onSettingsClick)}
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {/* Help */}
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(() => console.log('Help'))}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Security & Account */}
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(() => console.log('Security'))}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Privacy</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleMenuClick(onLogout)}
          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* About */}
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(() => console.log('About'))}
        >
          <Info className="w-4 h-4" />
          <span>About Secure Browser</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BrowserMenu; 