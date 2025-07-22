import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, X, Shield, AlertCircle } from 'lucide-react';

interface DownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for blocked downloads
const blockedDownloads = [
  {
    id: '1',
    filename: 'document.pdf',
    url: 'https://example.com/document.pdf',
    size: '2.3 MB',
    blockedAt: new Date('2024-01-15T10:30:00'),
    reason: 'Security policy - downloads are disabled'
  },
  {
    id: '2',
    filename: 'image.jpg',
    url: 'https://example.com/image.jpg',
    size: '1.1 MB',
    blockedAt: new Date('2024-01-15T09:15:00'),
    reason: 'Security policy - downloads are disabled'
  }
];

const DownloadsModal: React.FC<DownloadsModalProps> = ({ isOpen, onClose }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <DialogTitle>Downloads</DialogTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* Security Notice */}
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">Security Notice</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Downloads are disabled for security purposes. Files should be accessed directly through the browser or saved to SharePoint.
            </p>
          </div>

          {/* Downloads List */}
          <div className="space-y-3">
            {blockedDownloads.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Download className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No download attempts yet</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Recent Download Attempts</h3>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {blockedDownloads.length} blocked
                  </Badge>
                </div>
                
                {blockedDownloads.map((download) => (
                  <div key={download.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Download className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-sm text-slate-700 truncate">
                            {download.filename}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            Blocked
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-slate-500 truncate mb-1">
                          {download.url}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{download.size}</span>
                          <span>{formatTime(download.blockedAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{download.reason}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Downloads are blocked for security compliance
            </p>
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadsModal; 