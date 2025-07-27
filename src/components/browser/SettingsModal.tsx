import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState({
    defaultSearchEngine: 'google',
    homepage: 'https://www.google.com',
    autoFillPasswords: true,
    blockAds: false,
    enableJavaScript: true,
    allowCookies: true,
    clearHistoryOnExit: false,
    enableVPN: true,
    downloadLocation: '~/Downloads',
    defaultZoom: 100,
    enableNotifications: true,
    darkMode: false,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement actual settings save to local storage or config
    console.log('Saving settings:', settings);
    onClose();
  };

  const handleReset = () => {
    setSettings({
      defaultSearchEngine: 'google',
      homepage: 'https://www.google.com',
      autoFillPasswords: true,
      blockAds: false,
      enableJavaScript: true,
      allowCookies: true,
      clearHistoryOnExit: false,
      enableVPN: true,
      downloadLocation: '~/Downloads',
      defaultZoom: 100,
      enableNotifications: true,
      darkMode: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-gradient-to-br from-slate-50 to-white border-0 shadow-2xl p-0 m-4 rounded-xl">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-6 border-b border-slate-200 bg-white/95 backdrop-blur-sm flex-shrink-0 shadow-sm rounded-t-xl">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <div className="p-2 bg-blue-100 rounded-xl">
              <span className="text-2xl">⚙️</span>
            </div>
            Browser Settings
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-base mt-2">
            Customize your browsing experience, privacy settings, and security preferences
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-8">
            {/* General Settings */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="searchEngine" className="text-sm font-medium text-slate-700">
                      Default Search Engine
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between px-4 h-12 text-left font-normal border-slate-300 hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            {settings.defaultSearchEngine === 'google' && (
                              <>
                                <span>🔍</span>
                                <span>Google</span>
                              </>
                            )}
                            {settings.defaultSearchEngine === 'bing' && (
                              <>
                                <span>🔍</span>
                                <span>Bing</span>
                              </>
                            )}
                            {settings.defaultSearchEngine === 'duckduckgo' && (
                              <>
                                <span>🦆</span>
                                <span>DuckDuckGo</span>
                              </>
                            )}
                            {settings.defaultSearchEngine === 'yahoo' && (
                              <>
                                <span>🔍</span>
                                <span>Yahoo</span>
                              </>
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full min-w-[240px] max-w-xs">
                        <DropdownMenuItem 
                          onClick={() => handleSettingChange('defaultSearchEngine', 'google')}
                          className={`flex items-center gap-2 cursor-pointer ${
                            settings.defaultSearchEngine === 'google' ? 'bg-blue-50 text-blue-900' : ''
                          }`}
                        >
                          <span>🔍</span>
                          <span>Google</span>
                          {settings.defaultSearchEngine === 'google' && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleSettingChange('defaultSearchEngine', 'bing')}
                          className={`flex items-center gap-2 cursor-pointer ${
                            settings.defaultSearchEngine === 'bing' ? 'bg-blue-50 text-blue-900' : ''
                          }`}
                        >
                          <span>🔍</span>
                          <span>Bing</span>
                          {settings.defaultSearchEngine === 'bing' && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleSettingChange('defaultSearchEngine', 'duckduckgo')}
                          className={`flex items-center gap-2 cursor-pointer ${
                            settings.defaultSearchEngine === 'duckduckgo' ? 'bg-blue-50 text-blue-900' : ''
                          }`}
                        >
                          <span>🦆</span>
                          <span>DuckDuckGo</span>
                          {settings.defaultSearchEngine === 'duckduckgo' && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleSettingChange('defaultSearchEngine', 'yahoo')}
                          className={`flex items-center gap-2 cursor-pointer ${
                            settings.defaultSearchEngine === 'yahoo' ? 'bg-blue-50 text-blue-900' : ''
                          }`}
                        >
                          <span>🔍</span>
                          <span>Yahoo</span>
                          {settings.defaultSearchEngine === 'yahoo' && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="homepage" className="text-sm font-medium text-slate-700">
                      Homepage URL
                    </Label>
                    <Input
                      id="homepage"
                      value={settings.homepage}
                      onChange={(e) => handleSettingChange('homepage', e.target.value)}
                      placeholder="https://example.com"
                      className="h-12 px-4 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="downloadLocation" className="text-sm font-medium text-slate-700">
                    Download Location
                  </Label>
                  <Input
                    id="downloadLocation"
                    value={settings.downloadLocation}
                    onChange={(e) => handleSettingChange('downloadLocation', e.target.value)}
                    placeholder="~/Downloads"
                    className="h-12 px-4 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl shadow-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <span className="text-sm">🔐</span>
                      </div>
                      <div>
                        <Label className="font-medium text-slate-800">Auto-fill Passwords</Label>
                        <p className="text-sm text-slate-600">Enable secure password auto-fill</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoFillPasswords}
                        onChange={(e) => handleSettingChange('autoFillPasswords', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-xl">
                        <span className="text-sm">🚫</span>
                      </div>
                      <div>
                        <Label className="font-medium text-slate-800">Block Advertisements</Label>
                        <p className="text-sm text-slate-600">Block ads and trackers</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.blockAds}
                        onChange={(e) => handleSettingChange('blockAds', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <span className="text-sm">⚡</span>
                      </div>
                      <div>
                        <Label className="font-medium text-slate-800">Enable JavaScript</Label>
                        <p className="text-sm text-slate-600">Allow websites to run JavaScript</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableJavaScript}
                        onChange={(e) => handleSettingChange('enableJavaScript', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <span className="text-sm">🍪</span>
                      </div>
                      <div>
                        <Label className="font-medium text-slate-800">Allow Cookies</Label>
                        <p className="text-sm text-slate-600">Accept cookies from websites</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowCookies}
                        onChange={(e) => handleSettingChange('allowCookies', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-xl">
                      <span className="text-sm">🗑️</span>
                    </div>
                    <div>
                      <Label className="font-medium text-slate-800">Clear History on Exit</Label>
                      <p className="text-sm text-slate-600">Automatically clear browsing history when closing</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.clearHistoryOnExit}
                      onChange={(e) => handleSettingChange('clearHistoryOnExit', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Appearance & Behavior */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Appearance & Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="defaultZoom" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      Default Zoom Level (%)
                    </Label>
                    <div className="relative">
                      <Input
                        id="defaultZoom"
                        type="number"
                        value={settings.defaultZoom}
                        onChange={(e) => handleSettingChange('defaultZoom', parseInt(e.target.value))}
                        min="25"
                        max="500"
                        className="h-12 px-4 pr-8 border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-xl shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-xl">
                        <span className="text-sm">🌙</span>
                      </div>
                      <div>
                        <Label className="font-medium text-slate-800">Dark Mode</Label>
                        <p className="text-sm text-slate-600">Use dark theme</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <span className="text-sm">🔔</span>
                    </div>
                    <div>
                      <Label className="font-medium text-slate-800">Enable Notifications</Label>
                      <p className="text-sm text-slate-600">Allow websites to show notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* VPN Settings */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  VPN Settings
                  <Badge 
                    variant={settings.enableVPN ? "default" : "secondary"}
                    className={`ml-2 px-3 py-1 text-xs font-medium ${
                      settings.enableVPN 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {settings.enableVPN ? "🟢 Enabled" : "🔴 Disabled"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <span className="text-sm">🛡️</span>
                    </div>
                    <div>
                      <Label className="font-medium text-slate-800">Enable VPN Protection</Label>
                      <p className="text-sm text-slate-600">Route traffic through VPN for security</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableVPN}
                      onChange={(e) => handleSettingChange('enableVPN', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                {settings.enableVPN && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-xl">
                        <span className="text-lg">🔒</span>
                      </div>
                      <div>
                        <p className="font-medium text-emerald-800">VPN Connection Active</p>
                        <p className="text-sm text-emerald-700">
                          Your browsing is protected and anonymous through our secure VPN network.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {!settings.enableVPN && (
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-xl">
                        <span className="text-lg">⚠️</span>
                      </div>
                      <div>
                        <p className="font-medium text-amber-800">VPN Protection Disabled</p>
                        <p className="text-sm text-amber-700">
                          Your internet traffic is not protected. Enable VPN for enhanced security.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-6 border-t border-slate-200 bg-white/95 backdrop-blur-sm flex-shrink-0 shadow-lg rounded-b-xl">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="h-12 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium rounded-xl"
            >
              <span className="mr-2">🔄</span>
              Reset to Defaults
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="h-12 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium rounded-xl"
              >
                <span className="mr-2">💾</span>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
