import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Globe, 
  User, 
  Settings, 
  LogOut, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Monitor,
  FileText
} from "lucide-react";

interface User {
  id?: number;
  name: string;
  email: string;
  accessLevel: 1 | 2 | 3;
  avatar?: string;
  canEditAccessLevel?: boolean;
}

interface DashboardProps {
  user: User;
  vpnStatus: "connected" | "connecting" | "disconnected" | "failed";
  onLogout: () => void;
  onAccessLevelChange?: (level: 1 | 2 | 3) => void;
  children: React.ReactNode;
}

const ACCESS_LEVEL_CONFIG = {
  1: { 
    label: "SharePoint Only", 
    color: "bg-red-500", 
    description: "Restricted to SharePoint domains" 
  },
  2: { 
    label: "Controlled", 
    color: "bg-yellow-500", 
    description: "SharePoint + Whitelisted domains" 
  },
  3: { 
    label: "Full Access", 
    color: "bg-green-500", 
    description: "Unrestricted browsing (VPN-secured)" 
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  vpnStatus, 
  onLogout, 
  onAccessLevelChange,
  children 
}) => {
  const [connectionProgress] = useState(vpnStatus === "connecting" ? 75 : 100);
  const accessConfig = ACCESS_LEVEL_CONFIG[user.accessLevel];

  const getVPNStatusIcon = () => {
    switch (vpnStatus) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "connecting":
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500 animate-bounce" />;
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getVPNStatusText = () => {
    switch (vpnStatus) {
      case "connected":
        return "Connected (Australia)";
      case "connecting":
        return "Connecting...";
      case "failed":
        return "Connection Failed";
      case "disconnected":
        return "Disconnected";
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-white flex flex-col m-0 p-0 overflow-hidden">
      {/* Header - Fixed */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        {/* Left Side - Logo and Title */}
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-blue-500" />
          <h1 className="text-lg font-semibold">Aussie Vault Browser</h1>
          
          {/* Access Level Badge with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Badge variant="secondary" className="flex items-center space-x-1 cursor-pointer hover:bg-gray-200 bg-white text-gray-900 border border-gray-300 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${accessConfig.color}`} />
                  <span className="font-medium">Level {user.accessLevel}</span>
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border-gray-300 shadow-lg z-50" align="start">
              <div className="px-3 py-3">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {user.canEditAccessLevel !== false ? 'Change Access Level' : 'Access Level (Read Only)'}
                </p>
                <p className="text-xs text-gray-600 mb-3">Current: {accessConfig.description}</p>
                
                {user.canEditAccessLevel === false && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <p className="text-xs text-amber-700">
                      Access level editing is restricted by your administrator
                    </p>
                  </div>
                )}
                
                {[1, 2, 3].map((level) => {
                  const levelConfig = ACCESS_LEVEL_CONFIG[level as 1 | 2 | 3];
                  const isCurrentLevel = user.accessLevel === level;
                  const canEdit = user.canEditAccessLevel !== false; // Default to true if undefined
                  
                  return (
                    <DropdownMenuItem
                      key={level}
                      className={`text-gray-900 mb-1 rounded-md px-2 py-2 ${
                        isCurrentLevel ? 'bg-blue-50 border border-blue-200' : ''
                      } ${
                        canEdit ? 'hover:bg-gray-100 focus:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-60'
                      }`}
                      onClick={() => canEdit && onAccessLevelChange?.(level as 1 | 2 | 3)}
                      disabled={!canEdit}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`w-3 h-3 rounded-full ${levelConfig.color}`} />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Level {level}</div>
                          <div className="text-xs text-gray-600">{levelConfig.description}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {isCurrentLevel && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {!canEdit && !isCurrentLevel && (
                            <Lock className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side - VPN Status and User Menu */}
        <div className="flex items-center space-x-4">
          {/* VPN Status */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-700 rounded-lg">
            <Globe className="h-4 w-4" />
            {getVPNStatusIcon()}
            <span className="text-sm">{getVPNStatusText()}</span>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-600">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                className="text-red-400 focus:bg-slate-700 focus:text-red-300"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Status Bar - Fixed */}
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span className="text-slate-300">Secure Session Active</span>
            </div>
            <Separator orientation="vertical" className="h-4 bg-slate-600" />
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-blue-500" />
              <span className="text-slate-300">{accessConfig.description}</span>
            </div>
          </div>
          
          {vpnStatus === "connecting" && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Establishing VPN...</span>
              <Progress value={connectionProgress} className="w-24 h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Only This Should Scroll */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Footer Status - Fixed */}
      <footer className="bg-slate-800 border-t border-slate-700 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span>Session: {new Date().toLocaleTimeString()}</span>
            <Separator orientation="vertical" className="h-3 bg-slate-600" />
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>SharePoint Ready</span>
            </div>
          </div>
          <div>
            Enterprise Security v2.1.0
          </div>
        </div>
      </footer>
    </div>
  );
}; 