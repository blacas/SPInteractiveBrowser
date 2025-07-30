import React, { useState, useEffect } from 'react';
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
  Archive,
  File
} from 'lucide-react';

interface BrowserMenuProps {
  user?: any;
  onHistoryClick: () => void;
  onDownloadsClick: () => void;
  onBookmarksClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
  onNewTabClick: () => void;
  onNewWindowClick: () => void;
  onTaskManagerClick: () => void;
  onDebugAuthClick: () => void;
  onSharePointClick?: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  className?: string;
}

const BrowserMenu: React.FC<BrowserMenuProps> = ({
  user,
  onHistoryClick,
  onDownloadsClick,
  onBookmarksClick,
  onSettingsClick,
  onLogout,
  onNewTabClick,
  onNewWindowClick,
  onTaskManagerClick,
  onDebugAuthClick,
  onSharePointClick,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Simple webview click detection that doesn't interfere with dropdown behavior
  useEffect(() => {
    const handleWebviewClick = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      // Check if click is on webview or inside webview
      const target = event.target as HTMLElement;
      
      // Multiple ways to detect webview/content area clicks
      const isWebview = target.tagName === 'WEBVIEW';
      const isInWebviewContainer = target.closest('webview') !== null;
      const isInTabsContent = target.closest('[role="tabpanel"]') !== null;
      const isInBrowserContent = target.closest('.browser-window-container') !== null && 
                                !target.closest('.dropdown-menu') && 
                                !target.closest('button') &&
                                !target.closest('[role="toolbar"]');
      
      // Check for common browser content selectors
      const isInContentArea = target.closest('[class*="TabsContent"]') ||
                             target.closest('[data-state="active"]') ||
                             target.closest('[class*="webview"]') ||
                             target.closest('[id*="webview"]');
      
      if ((isWebview || isInWebviewContainer || isInTabsContent || isInBrowserContent || isInContentArea) && isOpen) {
        console.log('🖱️ Browser content area clicked, closing menu');
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Listen for direct webview clicks
      const webviews = document.querySelectorAll('webview');
      webviews.forEach(webview => {
        webview.addEventListener('click', handleWebviewClick);
        webview.addEventListener('mousedown', handleWebviewClick);
      });

      // Also listen for document clicks to catch webview area clicks
      document.addEventListener('click', handleDocumentClick, true);
      
      // Listen for focus events on webviews
      document.addEventListener('focusin', (event) => {
        if (event.target && (event.target as HTMLElement).tagName === 'WEBVIEW' && isOpen) {
          setIsOpen(false);
        }
      });
    }

    return () => {
      const webviews = document.querySelectorAll('webview');
      webviews.forEach(webview => {
        webview.removeEventListener('click', handleWebviewClick);
        webview.removeEventListener('mousedown', handleWebviewClick);
      });
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isOpen]);

  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleZoomClick = (action: () => void, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('🔍 [MENU] Zoom control clicked, calling action function');
    action();
    console.log('🔍 [MENU] Zoom action function completed');
    // Keep the menu open by preventing the dropdown from closing
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
        className="w-72 bg-white border border-slate-200 shadow-lg rounded-lg p-2"
        sideOffset={8}
        onInteractOutside={(event) => {
          // Close menu when clicking outside, including on webviews
          const target = event.target as HTMLElement;
          if (target.tagName === 'WEBVIEW' || target.closest('webview')) {
            setIsOpen(false);
          }
        }}
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
          onClick={() => handleMenuClick(onNewTabClick)}
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New tab</span>
          <DropdownMenuShortcut>Ctrl+T</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleMenuClick(onNewWindowClick)}
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

        {/* SharePoint Files */}
        {onSharePointClick && (
          <DropdownMenuItem 
            onClick={() => handleMenuClick(onSharePointClick)}
            className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-blue-50 rounded-md cursor-pointer"
          >
            <File className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">SharePoint Files</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Zoom Controls */}
        <DropdownMenuLabel className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
          Zoom Controls
        </DropdownMenuLabel>
        
        <div className="px-3 py-2 space-y-3">
          {/* Zoom Level Display and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700 font-medium">Zoom</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1">
              <button
                onClick={(e) => {
                  handleZoomClick(onZoomOut, e);
                }}
                disabled={zoomLevel <= 25}
                className="w-8 h-8 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg font-medium"
                title="Zoom out (5% steps)"
              >
                −
              </button>
              <span className="text-sm text-slate-700 w-16 text-center font-mono font-medium bg-white rounded px-2 py-1">
                {zoomLevel}%
              </span>
              <button
                onClick={(e) => {
                  handleZoomClick(onZoomIn, e);
                }}
                disabled={zoomLevel >= 300}
                className="w-8 h-8 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg font-medium"
                title="Zoom in (5% steps)"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Reset Button - Separate Row */}
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                handleZoomClick(onZoomReset, e);
              }}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium border border-blue-200"
              title="Reset zoom to 100%"
            >
              Reset to 100%
            </button>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* More Tools */}
        <DropdownMenuLabel className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
          More tools
        </DropdownMenuLabel>

        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(onTaskManagerClick)}
        >
          <Archive className="w-4 h-4" />
          <span>Task manager</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
          onClick={() => handleMenuClick(onDebugAuthClick)}
        >
          <Settings className="w-4 h-4" />
          <span>Debug Auth State</span>
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