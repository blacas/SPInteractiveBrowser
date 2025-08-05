import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Download, 
  Cloud, 
  HardDrive, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';

interface DownloadChoiceData {
  id: string;
  filename: string;
  url: string;
  totalBytes: number;
  sessionName: string;
}

interface MetaStorageStatus {
  connected: boolean;
  accountName: string | null;
  storageQuota: {
    used: number;
    total: number;
  } | null;
}

interface DownloadChoiceDialogProps {
  downloadData: DownloadChoiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onChoiceSelected: (downloadId: string, choice: 'local' | 'meta') => void;
}

export const DownloadChoiceDialog: React.FC<DownloadChoiceDialogProps> = ({
  downloadData,
  isOpen,
  onClose,
  onChoiceSelected
}) => {
  const [metaStorageStatus, setMetaStorageStatus] = useState<MetaStorageStatus | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showMetaAuth, setShowMetaAuth] = useState(false);

  useEffect(() => {
    if (isOpen && downloadData) {
      checkMetaStorageStatus();
    }
  }, [isOpen, downloadData]);

  const checkMetaStorageStatus = async () => {
    try {
      const status = await window.electronAPI.metaStorage.getStatus();
      setMetaStorageStatus(status);
    } catch (error) {
      console.error('Failed to check Meta storage status:', error);
      setMetaStorageStatus({
        connected: false,
        accountName: null,
        storageQuota: null
      });
    }
  };

  const handleConnectMeta = async () => {
    setConnecting(true);
    try {
      // In a real implementation, you would redirect to Meta OAuth
      // For now, simulate connection with a fake token
      const fakeToken = 'simulated_meta_access_token';
      const result = await window.electronAPI.metaStorage.connect(fakeToken);
      
      if (result.success) {
        setMetaStorageStatus({
          connected: true,
          accountName: result.accountName,
          storageQuota: result.storageQuota
        });
        setShowMetaAuth(false);
      }
    } catch (error) {
      console.error('Failed to connect to Meta storage:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleLocalDownload = () => {
    if (downloadData) {
      onChoiceSelected(downloadData.id, 'local');
      onClose();
    }
  };

  const handleMetaUpload = () => {
    if (downloadData) {
      if (metaStorageStatus?.connected) {
        onChoiceSelected(downloadData.id, 'meta');
        onClose();
      } else {
        setShowMetaAuth(true);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageUsagePercent = () => {
    if (!metaStorageStatus?.storageQuota) return 0;
    return (metaStorageStatus.storageQuota.used / metaStorageStatus.storageQuota.total) * 100;
  };

  if (!downloadData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Choose Download Method
          </DialogTitle>
          <DialogDescription>
            Where would you like to save this file?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Information */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium truncate">{downloadData.filename}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Size: {formatFileSize(downloadData.totalBytes)}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              From: {downloadData.url}
            </div>
          </div>

          {!showMetaAuth ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local Download Option */}
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <HardDrive className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Local Download</h3>
                    <p className="text-sm text-muted-foreground">Save to your computer</p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Instant access</li>
                  <li>• Works offline</li>
                  <li>• Uses local storage</li>
                </ul>
                <Button 
                  onClick={handleLocalDownload} 
                  className="w-full"
                  variant="outline"
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  Download Locally
                </Button>
              </div>

              {/* Meta Storage Option */}
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Cloud className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-medium">Meta Storage</h3>
                    <p className="text-sm text-muted-foreground">Save to Meta cloud</p>
                  </div>
                </div>

                {metaStorageStatus?.connected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{metaStorageStatus.accountName}</span>
                    </div>
                    
                    {metaStorageStatus.storageQuota && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Storage used</span>
                          <span>
                            {formatFileSize(metaStorageStatus.storageQuota.used)} / {formatFileSize(metaStorageStatus.storageQuota.total)}
                          </span>
                        </div>
                        <Progress value={getStorageUsagePercent()} className="h-2" />
                      </div>
                    )}

                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>• Access anywhere</li>
                      <li>• Automatic sync</li>
                      <li>• Share with others</li>
                    </ul>

                    <Button 
                      onClick={handleMetaUpload} 
                      className="w-full"
                      variant="default"
                    >
                      <Cloud className="h-4 w-4 mr-2" />
                      Upload to Meta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Not connected</span>
                    </div>
                    
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>• Access anywhere</li>
                      <li>• Automatic sync</li>
                      <li>• Share with others</li>
                    </ul>

                    <Button 
                      onClick={handleMetaUpload} 
                      className="w-full"
                      variant="outline"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Connect & Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Meta Authentication Flow */
            <div className="space-y-4">
              <div className="text-center">
                <Cloud className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Connect to Meta Storage</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Meta account to save files to Meta cloud storage
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Benefits of Meta Storage:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Access files from any device</li>
                  <li>• Automatic synchronization</li>
                  <li>• Share files with friends and colleagues</li>
                  <li>• Integrated with Meta ecosystem</li>
                  <li>• Secure cloud storage</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowMetaAuth(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleConnectMeta} 
                  disabled={connecting}
                  className="flex-1"
                >
                  {connecting ? 'Connecting...' : 'Connect Meta Account'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Auto-download locally in 30 seconds
          </div>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};