import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bug,
  Key,
  Database,
  RefreshCw,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface DebugAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthDebugInfo {
  localStorageKeys: string[];
  clerkTokens: {
    clerk_db_jwt: boolean;
    clerk_client_jwt: boolean;
    clerk_session: boolean;
    clerk_user: boolean;
  };
  sessionStorageKeys: string[];
  cookieCount: number;
  userAgent: string;
  origin: string;
  timestamp: string;
}

const DebugAuthModal: React.FC<DebugAuthModalProps> = ({ isOpen, onClose }) => {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const collectDebugInfo = (): AuthDebugInfo => {
    const localStorageKeys = Object.keys(localStorage);
    const sessionStorageKeys = Object.keys(sessionStorage);
    
    return {
      localStorageKeys,
      clerkTokens: {
        clerk_db_jwt: !!localStorage.getItem('__clerk_db_jwt'),
        clerk_client_jwt: !!localStorage.getItem('__clerk_client_jwt'),
        clerk_session: !!localStorage.getItem('__clerk_session'),
        clerk_user: !!localStorage.getItem('__clerk_user')
      },
      sessionStorageKeys,
      cookieCount: document.cookie.split(';').length,
      userAgent: navigator.userAgent,
      origin: window.location.origin,
      timestamp: new Date().toISOString()
    };
  };

  const refreshDebugInfo = async () => {
    setIsRefreshing(true);
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setDebugInfo(collectDebugInfo());
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isOpen) {
      refreshDebugInfo();
    }
  }, [isOpen]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const copyAllDebugInfo = () => {
    if (!debugInfo) return;
    
    const debugText = `
Aussie Vault Browser - Authentication Debug Report
Generated: ${debugInfo.timestamp}
Origin: ${debugInfo.origin}

=== CLERK AUTHENTICATION TOKENS ===
• __clerk_db_jwt: ${debugInfo.clerkTokens.clerk_db_jwt ? '✅ Present' : '❌ Missing'}
• __clerk_client_jwt: ${debugInfo.clerkTokens.clerk_client_jwt ? '✅ Present' : '❌ Missing'}
• __clerk_session: ${debugInfo.clerkTokens.clerk_session ? '✅ Present' : '❌ Missing'}
• __clerk_user: ${debugInfo.clerkTokens.clerk_user ? '✅ Present' : '❌ Missing'}

=== LOCAL STORAGE (${debugInfo.localStorageKeys.length} keys) ===
${debugInfo.localStorageKeys.map(key => `• ${key}`).join('\n')}

=== SESSION STORAGE (${debugInfo.sessionStorageKeys.length} keys) ===
${debugInfo.sessionStorageKeys.map(key => `• ${key}`).join('\n')}

=== BROWSER INFO ===
• Cookies: ${debugInfo.cookieCount} found
• User Agent: ${debugInfo.userAgent}
    `.trim();

    copyToClipboard(debugText, 'Full Debug Report');
  };

  const getTokenStatus = (hasToken: boolean) => {
    if (hasToken) {
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Present
      </Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
      <XCircle className="w-3 h-3" />
      Missing
    </Badge>;
  };

  const getAuthHealthStatus = () => {
    if (!debugInfo) return null;
    
    const { clerkTokens } = debugInfo;
    const tokenCount = Object.values(clerkTokens).filter(Boolean).length;
    
    if (tokenCount >= 2) {
      return {
        status: 'healthy',
        message: 'Authentication tokens are present',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />
      };
    } else if (tokenCount >= 1) {
      return {
        status: 'warning',
        message: 'Some authentication tokens are missing',
        icon: <AlertCircle className="w-5 h-5 text-yellow-600" />
      };
    } else {
      return {
        status: 'error',
        message: 'No authentication tokens found',
        icon: <XCircle className="w-5 h-5 text-red-600" />
      };
    }
  };

  const authHealth = getAuthHealthStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Authentication Debug Information
          </DialogTitle>
          <DialogDescription>
            Diagnostic information for authentication state and session sharing
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {debugInfo ? (
            <div className="h-full overflow-auto space-y-4">
              {/* Authentication Health Status */}
              {authHealth && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    {authHealth.icon}
                    <div>
                      <h3 className="font-medium text-gray-900">Authentication Status</h3>
                      <p className="text-sm text-gray-600">{authHealth.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Clerk Tokens */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Clerk Authentication Tokens</h3>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(
                      JSON.stringify(debugInfo.clerkTokens, null, 2),
                      'Clerk Tokens'
                    )}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    {copiedText === 'Clerk Tokens' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(debugInfo.clerkTokens).map(([key, hasToken]) => (
                    <div key={key} className="flex items-center justify-between py-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {key}
                      </code>
                      {getTokenStatus(hasToken)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Storage */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-gray-900">
                      Local Storage ({debugInfo.localStorageKeys.length} keys)
                    </h3>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(
                      debugInfo.localStorageKeys.join('\n'),
                      'Local Storage Keys'
                    )}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    {copiedText === 'Local Storage Keys' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="max-h-32 overflow-auto">
                  {debugInfo.localStorageKeys.length > 0 ? (
                    <div className="space-y-1">
                      {debugInfo.localStorageKeys.map((key, index) => (
                        <div key={index} className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded">
                          {key}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No local storage keys found</p>
                  )}
                </div>
              </div>

              {/* Session Storage */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-orange-600" />
                    <h3 className="font-medium text-gray-900">
                      Session Storage ({debugInfo.sessionStorageKeys.length} keys)
                    </h3>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(
                      debugInfo.sessionStorageKeys.join('\n'),
                      'Session Storage Keys'
                    )}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    {copiedText === 'Session Storage Keys' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="max-h-32 overflow-auto">
                  {debugInfo.sessionStorageKeys.length > 0 ? (
                    <div className="space-y-1">
                      {debugInfo.sessionStorageKeys.map((key, index) => (
                        <div key={index} className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded">
                          {key}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No session storage keys found</p>
                  )}
                </div>
              </div>

              {/* Browser Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Browser Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Origin:</span>
                    <span className="ml-2 font-mono text-gray-600">{debugInfo.origin}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Cookies:</span>
                    <span className="ml-2 text-gray-600">{debugInfo.cookieCount} found</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Generated:</span>
                    <span className="ml-2 text-gray-600">{new Date(debugInfo.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading debug information...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            onClick={refreshDebugInfo}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={copyAllDebugInfo}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copiedText === 'Full Debug Report' ? 'Copied!' : 'Copy All'}
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebugAuthModal;
