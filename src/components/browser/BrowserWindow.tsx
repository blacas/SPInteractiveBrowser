import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Plus, 
  X, 
  Shield,
  AlertTriangle,
  Lock,
  Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVPN } from '@/hooks/useVPN';
import { injectSharePointCredentials } from '@/services/vaultService';
import SearchBar from './SearchBar';
import VPNConnectionError from '@/components/ui/vpn-connection-error';

interface Tab {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
}

const BrowserWindow: React.FC = () => {
  const { user } = useAuth();
  const { vpnStatus, allowBrowsing, connection, connectVPN, checkVPNStatus, isConnecting, isCheckingStatus, lastError } = useVPN();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: getDefaultUrl(user?.accessLevel || 1), isLoading: false }
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [urlInput, setUrlInput] = useState(getDefaultUrl(user?.accessLevel || 1));
  const webviewRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Get default URL based on access level (SharePoint-focused)
  function getDefaultUrl(accessLevel: number): string {
    switch (accessLevel) {
      case 3: return 'https://www.office.com'; // Full access starts at Office
      case 2: return 'https://www.office.com'; // Manager level
      default: return 'https://www.office.com'; // All levels start with SharePoint/Office
    }
  }

  // Access level configurations
  const getAccessLevelConfig = () => {
    const level = user?.accessLevel || 1;
    switch (level) {
      case 3:
        return {
          name: 'Full Access',
          allowedDomains: ['*'], // All domains
          variant: 'default' as const
        };
      case 2:
        return {
          name: 'Manager',
          allowedDomains: [
            'sharepoint.com',
            'office.com',
            'microsoft.com',
            'wikipedia.org',
            'github.com',
            'stackoverflow.com'
          ],
          variant: 'secondary' as const
        };
      default:
        return {
          name: 'Restricted',
          allowedDomains: ['sharepoint.com', 'office.com'],
          variant: 'outline' as const
        };
    }
  };

  const isUrlAllowed = (url: string): boolean => {
    const config = getAccessLevelConfig();
    if (config.allowedDomains.includes('*')) return true;
    
    try {
      // Ensure URL has protocol
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
      }
      
      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname.replace('www.', '');
      
      console.log('Checking URL:', fullUrl);
      console.log('Extracted domain:', domain);
      console.log('Allowed domains:', config.allowedDomains);
      
      const isAllowed = config.allowedDomains.some(allowed => {
        const match = domain === allowed || domain.endsWith('.' + allowed);
        console.log(`Checking ${domain} against ${allowed}: ${match}`);
        return match;
      });
      
      console.log('Final result:', isAllowed);
      return isAllowed;
    } catch (error) {
      console.error('URL parsing error:', error);
      return false;
    }
  };

  const getHomeUrl = (): string => {
    const level = user?.accessLevel || 1;
    switch (level) {
      case 3: return 'https://www.google.com';
      case 2: return 'https://github.com';
      default: return 'https://www.office.com';
    }
  };

  const handleUrlSubmit = () => {
    // Block navigation if VPN is not connected (fail-closed behavior)
    if (!allowBrowsing) {
      alert(`VPN connection required. Browser access is blocked until Australian VPN connection is established. Status: ${vpnStatus}`);
      return;
    }

    if (!isUrlAllowed(urlInput)) {
      alert(`Access denied. Your access level (${getAccessLevelConfig().name}) does not permit accessing this URL.`);
      return;
    }

    const webview = webviewRefs.current[activeTab] as HTMLElement & { 
      src: string;
    };
    
    if (webview) {
      // Update tab state
      setTabs(tabs.map(tab => 
        tab.id === activeTab 
          ? { ...tab, url: urlInput, isLoading: true, title: 'Loading...' }
          : tab
      ));
      
      // Navigate webview
      webview.src = urlInput;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
  };

  const goBack = () => {
    const webview = webviewRefs.current[activeTab] as HTMLElement & { 
      canGoBack(): boolean;
      goBack(): void;
    };
    if (webview && webview.canGoBack()) {
      webview.goBack();
    }
  };

  const goForward = () => {
    const webview = webviewRefs.current[activeTab] as HTMLElement & { 
      canGoForward(): boolean;
      goForward(): void;
    };
    if (webview && webview.canGoForward()) {
      webview.goForward();
    }
  };

  const reload = () => {
    const webview = webviewRefs.current[activeTab] as HTMLElement & { 
      reload(): void;
    };
    if (webview) {
      webview.reload();
    }
  };

  const goHome = () => {
    const homeUrl = getHomeUrl();
    setUrlInput(homeUrl);
    const webview = webviewRefs.current[activeTab] as HTMLElement & { 
      src: string;
    };
    if (webview) {
      setTabs(tabs.map(tab => 
        tab.id === activeTab 
          ? { ...tab, url: homeUrl, isLoading: true, title: 'Loading...' }
          : tab
      ));
      webview.src = homeUrl;
    }
  };

  const createNewTab = () => {
    const newTabId = Date.now().toString();
    const homeUrl = getHomeUrl();
    const newTab: Tab = {
      id: newTabId,
      title: 'New Tab',
      url: homeUrl,
      isLoading: false
    };
    
    setTabs([...tabs, newTab]);
    setActiveTab(newTabId);
    setUrlInput(homeUrl);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
      setUrlInput(newTabs[0].url);
    }
  };

  // Webview event handlers
  // Auto-inject SharePoint credentials when navigating to SharePoint
  useEffect(() => {
    const webview = webviewRefs.current[activeTab];
    if (webview) {
      const handleNavigation = async (event: Event & { url?: string }) => {
        const url = event.url || webview.getAttribute('src') || '';
        
        // Check if navigating to SharePoint/Office365
        if (url.includes('sharepoint.com') || url.includes('login.microsoftonline.com') || url.includes('office.com')) {
          console.log('SharePoint detected - preparing credential injection');
          
          // Wait for page load, then inject credentials
          setTimeout(async () => {
            try {
              await injectSharePointCredentials(webview);
              console.log('SharePoint credentials injected successfully');
            } catch (error) {
              console.error('Failed to inject SharePoint credentials:', error);
            }
          }, 2000);
        }
      };

      webview.addEventListener('did-navigate', handleNavigation);
      webview.addEventListener('did-navigate-in-page', handleNavigation);
      
      return () => {
        webview.removeEventListener('did-navigate', handleNavigation);
        webview.removeEventListener('did-navigate-in-page', handleNavigation);
      };
    }
  }, [activeTab]);

  const setupWebviewEvents = (webview: HTMLElement, tabId: string) => {
    type WebviewEvent = Event & { url: string; title?: string };
    
    webview.addEventListener('did-start-loading', () => {
      setTabs(tabs => tabs.map(tab => 
        tab.id === tabId ? { ...tab, isLoading: true } : tab
      ));
    });

    webview.addEventListener('did-stop-loading', () => {
      setTabs(tabs => tabs.map(tab => 
        tab.id === tabId ? { ...tab, isLoading: false } : tab
      ));
    });

    webview.addEventListener('page-title-updated', (event: Event) => {
      const webviewEvent = event as WebviewEvent;
      setTabs(tabs => tabs.map(tab => 
        tab.id === tabId ? { ...tab, title: webviewEvent.title || 'Untitled' } : tab
      ));
    });

    webview.addEventListener('did-navigate', (event: Event) => {
      const webviewEvent = event as WebviewEvent;
      if (tabId === activeTab) {
        setUrlInput(webviewEvent.url);
      }
      setTabs(tabs => tabs.map(tab => 
        tab.id === tabId ? { ...tab, url: webviewEvent.url } : tab
      ));
    });

    webview.addEventListener('did-navigate-in-page', (event: Event) => {
      const webviewEvent = event as WebviewEvent;
      if (tabId === activeTab) {
        setUrlInput(webviewEvent.url);
      }
      setTabs(tabs => tabs.map(tab => 
        tab.id === tabId ? { ...tab, url: webviewEvent.url } : tab
      ));
    });
  };

  const config = getAccessLevelConfig();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Browser Controls - Fixed/Sticky */}
      <div className="flex items-center gap-3 p-3 border-b bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-0.5 bg-slate-700/50 rounded-lg p-1">
          <Button 
            variant="ghost" 
            onClick={goBack}
            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-200 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={goForward}
            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-200 rounded-md"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={reload}
            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-200 rounded-md"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={goHome}
            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-200 rounded-md"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
        
        <SearchBar
          value={urlInput}
          onChange={handleUrlChange}
          onSubmit={handleUrlSubmit}
          placeholder="Enter URL or search..."
        />

        <div className="flex items-center gap-2">
          {/* VPN Status Indicator */}
          <Badge 
            variant={vpnStatus === 'connected' ? 'default' : vpnStatus === 'connecting' ? 'secondary' : 'destructive'}
            className={`px-3 py-1.5 text-xs font-medium h-8 flex items-center gap-1.5 ${
              vpnStatus === 'connected' ? 'bg-green-600 text-white border-green-500' : 
              vpnStatus === 'connecting' ? 'bg-yellow-600 text-white border-yellow-500 animate-pulse' :
              'bg-red-600 text-white border-red-500 animate-pulse'
            }`}
          >
            <Globe className="h-3 w-3" />
            VPN: {connection.location}
            {vpnStatus === 'connected' && connection.ipAddress && ` (${connection.ipAddress})`}
          </Badge>

          {/* Access Level Badge */}
          <Badge 
            variant={config.variant}
            className="px-3 py-1.5 text-xs font-medium bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600 transition-colors h-8 flex items-center"
          >
            <Shield className="h-3 w-3 mr-1" />
            {config.name}
          </Badge>

          {/* SharePoint Vault Auth Indicator */}
          {(urlInput.includes('sharepoint.com') || urlInput.includes('office.com') || urlInput.includes('login.microsoftonline.com')) && (
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white border-blue-500 h-8 text-xs font-medium">
              <Lock className="h-3 w-3" />
              Vault Auth
            </Badge>
          )}

          {/* URL Blocked Indicator */}
          {!isUrlAllowed(urlInput) && (
            <Badge variant="destructive" className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white border-red-500 animate-pulse h-8 text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              Blocked
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs - Fixed/Sticky */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center border-b bg-gradient-to-r from-slate-100 to-slate-200 shadow-sm flex-shrink-0">
          <TabsList className="h-12 bg-transparent border-0 gap-1 p-1">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center">
                <TabsTrigger 
                  value={tab.id} 
                  className="flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 border-transparent text-slate-600 hover:text-slate-800 hover:bg-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-blue-500 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <span className="max-w-32 truncate font-medium">
                    {tab.isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : tab.title}
                  </span>
                  {tabs.length > 1 && (
                    <span
                      className="h-5 w-5 flex items-center justify-center hover:bg-red-100 hover:text-red-600 rounded-full transition-all duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={createNewTab} 
            className="ml-3 mr-2 h-8 w-8 p-0 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Content - Scrollable Area */}
        <div className="flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="h-full m-0 data-[state=active]:block">
              {!allowBrowsing ? (
                /* Show VPN Connection Error when VPN is not connected */
                <VPNConnectionError
                  onRetry={connectVPN}
                  onCheckStatus={checkVPNStatus}
                  isRetrying={isConnecting}
                  isChecking={isCheckingStatus}
                  errorDetails={lastError || `WireGuard endpoint: ${connection.endpoint}`}
                />
              ) : !isUrlAllowed(tab.url) ? (
                /* Show URL restriction error for blocked domains */
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center max-w-md">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
                    <p className="text-gray-600 mb-4">
                      Your access level ({config.name}) does not permit accessing this URL.
                    </p>
                    <div className="text-sm text-gray-500">
                      <p className="mb-2">Allowed domains for your level:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {config.allowedDomains.map((domain, index) => (
                          <li key={index}>{domain}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                /* Show webview when VPN is connected and URL is allowed */
                <webview
                  ref={(ref: HTMLElement | null) => {
                    if (ref) {
                      webviewRefs.current[tab.id] = ref;
                      setupWebviewEvents(ref, tab.id);
                    }
                  }}
                  src={tab.url}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    border: 'none'
                  }}
                  partition="persist:main"
                  allowpopups={true}
                  webpreferences="javascript=yes,plugins=yes,webSecurity=yes"
                  useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                />
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default BrowserWindow; 