import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Cloud, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Unlink,
  ExternalLink,
  HardDrive,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface MetaStorageStatus {
  connected: boolean;
  accountName: string | null;
  storageQuota: {
    used: number;
    total: number;
  } | null;
}

export const MetaStorageSettings: React.FC = () => {
  const [storageStatus, setStorageStatus] = useState<MetaStorageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    loadStorageStatus();
  }, []);

  const loadStorageStatus = async () => {
    try {
      setLoading(true);
      if (!window.electronAPI?.metaStorage?.getStatus) {
        throw new Error('Electron API not available');
      }
      const status = await window.electronAPI.metaStorage.getStatus();
      setStorageStatus(status);
    } catch (error) {
      console.error('Failed to load Meta storage status:', error);
      toast.error('Failed to load Meta storage status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      toast.error('Please enter a valid access token');
      return;
    }

    try {
      setConnecting(true);
      if (!window.electronAPI?.metaStorage?.connect) {
        throw new Error('Electron API not available');
      }
      const result = await window.electronAPI.metaStorage.connect(accessToken);
      
      if (result.success) {
        setStorageStatus({
          connected: true,
          accountName: result.accountName || 'Meta User',
          storageQuota: result.storageQuota || null
        });
        setAccessToken('');
        toast.success('Successfully connected to Meta storage!');
      } else {
        toast.error('Failed to connect to Meta storage');
      }
    } catch (error) {
      console.error('Meta storage connection failed:', error);
      toast.error('Connection failed. Please check your access token.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      if (!window.electronAPI?.metaStorage?.disconnect) {
        throw new Error('Electron API not available');
      }
      const result = await window.electronAPI.metaStorage.disconnect();
      
      if (result.success) {
        setStorageStatus({
          connected: false,
          accountName: null,
          storageQuota: null
        });
        toast.success('Disconnected from Meta storage');
      } else {
        toast.error('Failed to disconnect from Meta storage');
      }
    } catch (error) {
      console.error('Meta storage disconnection failed:', error);
      toast.error('Disconnection failed');
    } finally {
      setDisconnecting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageUsagePercent = () => {
    if (!storageStatus?.storageQuota) return 0;
    return (storageStatus.storageQuota.used / storageStatus.storageQuota.total) * 100;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Meta Storage
          </CardTitle>
          <CardDescription>
            Loading Meta storage settings...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Meta Storage
        </CardTitle>
        <CardDescription>
          Connect your Meta account to save downloads to the cloud
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {storageStatus?.connected ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-orange-500" />
            )}
            <div>
              <h3 className="font-medium">
                {storageStatus?.connected ? 'Connected' : 'Not Connected'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {storageStatus?.connected 
                  ? `Connected as ${storageStatus.accountName}`
                  : 'Connect your Meta account to enable cloud storage'
                }
              </p>
            </div>
          </div>
          <Badge variant={storageStatus?.connected ? 'default' : 'secondary'}>
            {storageStatus?.connected ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {storageStatus?.connected ? (
          /* Connected State */
          <div className="space-y-4">
            {/* Storage Usage */}
            {storageStatus.storageQuota && (
              <div className="space-y-3">
                <h4 className="font-medium">Storage Usage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used Storage</span>
                    <span>
                      {formatFileSize(storageStatus.storageQuota.used)} / {formatFileSize(storageStatus.storageQuota.total)}
                    </span>
                  </div>
                  <Progress value={getStorageUsagePercent()} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {(100 - getStorageUsagePercent()).toFixed(1)}% available
                  </p>
                </div>
              </div>
            )}

            {/* Download Preferences */}
            <div className="space-y-3">
              <h4 className="font-medium">Download Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Local Downloads</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Files saved to your computer for instant access
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Meta Storage</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Files uploaded to Meta cloud for anywhere access
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                You'll be prompted to choose the download method for each file.
              </p>
            </div>

            {/* Account Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.open('https://www.meta.com/storage', '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Meta Storage
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex-1"
              >
                {disconnecting ? (
                  'Disconnecting...'
                ) : (
                  <>
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Disconnected State */
          <div className="space-y-4">
            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium">Benefits of Meta Storage</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Cloud className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Access Anywhere</span>
                    <p className="text-xs text-muted-foreground">Access your files from any device</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Upload className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Auto Sync</span>
                    <p className="text-xs text-muted-foreground">Automatic synchronization across devices</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="h-4 w-4 text-purple-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Easy Sharing</span>
                    <p className="text-xs text-muted-foreground">Share files with friends and colleagues</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Secure Storage</span>
                    <p className="text-xs text-muted-foreground">Enterprise-grade security and encryption</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Form */}
            <div className="space-y-3">
              <h4 className="font-medium">Connect Your Account</h4>
              <div className="space-y-2">
                <Label htmlFor="access-token">Meta Access Token</Label>
                <Input
                  id="access-token"
                  type="password"
                  placeholder="Enter your Meta access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can get your access token from the Meta Developer Console.{' '}
                  <button 
                    onClick={() => window.open('https://developers.facebook.com/tools/explorer', '_blank')}
                    className="text-blue-500 hover:underline"
                  >
                    Get token here
                  </button>
                </p>
              </div>
              <Button 
                onClick={handleConnect} 
                disabled={connecting || !accessToken.trim()}
                className="w-full"
              >
                {connecting ? (
                  'Connecting...'
                ) : (
                  <>
                    <Cloud className="h-4 w-4 mr-2" />
                    Connect Meta Account
                  </>
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> This is a demo implementation. In a production environment, 
                you would use Meta's official OAuth flow for secure authentication.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};