import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download as DownloadIcon, AlertCircle, X, Eye, ExternalLink, FolderOpen } from 'lucide-react';

// Add custom CSS for animations
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { 
      transform: translateX(-100%);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% { 
      transform: translateX(100%);
      opacity: 0;
    }
  }
  .animate-shimmer {
    animation: shimmer 1.5s ease-in-out infinite;
  }
  
  @keyframes progressPulse {
    0%, 100% { 
      box-shadow: 0 0 16px rgba(59, 130, 246, 0.6), inset 0 1px 0 rgba(255,255,255,0.3);
    }
    50% { 
      box-shadow: 0 0 24px rgba(139, 92, 246, 0.8), inset 0 1px 0 rgba(255,255,255,0.4);
    }
  }
  .animate-progress-pulse {
    animation: progressPulse 2s ease-in-out infinite;
  }
`;

interface DownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadItem[];
  onCancelDownload: (id: string) => void;
  onViewFile: (filePath: string, filename: string) => void;
  onRevealInExplorer: (filePath: string, filename: string) => void;
  onClearDownloads: () => void;
}

interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  totalBytes: number;
  downloadedBytes: number;
  status: 'downloading' | 'completed' | 'cancelled' | 'blocked';
  startTime: Date;
  endTime?: Date;
  speed?: number;
  progress: number;
  filePath?: string;
}

const DownloadsModal: React.FC<DownloadsModalProps> = ({ isOpen, onClose, downloads, onCancelDownload, onViewFile, onRevealInExplorer, onClearDownloads }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s';
  };

  const getStatusColor = (status: DownloadItem['status']) => {
    switch (status) {
      case 'downloading': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-gray-600';
      case 'blocked': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (download: DownloadItem) => {
    switch (download.status) {
      case 'downloading': 
        return `${download.progress}% - ${download.speed ? formatSpeed(download.speed) : 'Calculating...'}`;
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'blocked': return 'Blocked by security policy';
      default: return 'Unknown';
    }
  };

  return (
    <>
      <style>{shimmerKeyframes}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-white border-slate-200/60 shadow-2xl">
          <DialogHeader className="pb-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <DownloadIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold text-slate-800">Downloads</DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">Manage your downloaded files</p>
              </div>
            </div>
          </DialogHeader>

        <div className="flex-1 overflow-auto px-1">
          {/* Downloads List */}
          <div className="space-y-4">
            {downloads.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-4 shadow-sm">
                  <DownloadIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-2">No downloads yet</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Downloads will appear here when you start downloading files from websites
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-800">Recent Downloads</h3>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                      downloads.filter(d => d.status === 'downloading').length > 0
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {downloads.filter(d => d.status === 'downloading').length} active
                    </div>
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {downloads.filter(d => d.status === 'completed').length} completed
                    </div>
                  </div>
                </div>
                
                {downloads.map((download) => (
                  <div key={download.id} className="group relative bg-white border border-slate-200/60 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-slate-300/80 backdrop-blur-sm hover:scale-[1.02]">
                    {/* Status Glow Effect */}
                    {download.status === 'downloading' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none animate-pulse"></div>
                    )}
                    {download.status === 'completed' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/3 to-emerald-500/3 rounded-xl pointer-events-none"></div>
                    )}
                    
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                            download.status === 'downloading' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                            download.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                            download.status === 'blocked' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                            'bg-gradient-to-br from-slate-400 to-slate-500'
                          } shadow-lg`}>
                            <DownloadIcon className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-slate-800 truncate group-hover:text-slate-900 transition-colors">
                                {download.filename}
                              </h4>
                              <div className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                                download.status === 'downloading' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse' :
                                download.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                                download.status === 'blocked' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
                                'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                              }`}>
                                {download.status === 'downloading' ? 'Downloading' :
                                 download.status === 'completed' ? 'Completed' :
                                 download.status === 'cancelled' ? 'Cancelled' :
                                 download.status === 'blocked' ? 'Blocked' : 'Unknown'}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 truncate leading-relaxed">
                              {download.url}
                            </p>
                          </div>
                        </div>
                        
                        {/* Enhanced Progress Bar - Only for downloading */}
                        {download.status === 'downloading' && (
                          <div className="space-y-3">
                            {/* MASSIVE Progress Bar Container - Super Prominent */}
                            <div className="relative w-full h-10 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl overflow-hidden shadow-inner border-2 border-slate-300/90 ring-1 ring-slate-200/50">
                              {/* Background pattern */}
                              <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100"></div>
                              
                                                              {/* Progress fill with enhanced gradient and animation */}
                                <div 
                                  className="relative h-full bg-gradient-to-r from-blue-500 via-purple-500 via-blue-600 to-purple-600 rounded-xl transition-all duration-700 ease-out animate-progress-pulse"
                                  style={{ 
                                    width: `${download.progress}%`,
                                    minWidth: download.progress > 0 ? '24px' : '0px'
                                  }}
                                >
                                                                  {/* Enhanced shimmer effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-xl"></div>
                                  
                                  {/* Inner highlight */}
                                  <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-white/35 to-white/20 rounded-t-xl"></div>
                              </div>
                              
                              {/* Enhanced progress glow effect */}
                              {download.progress > 0 && (
                                <div 
                                  className="absolute top-0 h-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-xl blur-md opacity-40 transition-all duration-700"
                                  style={{ width: `${download.progress}%` }}
                                ></div>
                              )}
                              
                              {/* Progress indicator line */}
                              {download.progress > 0 && (
                                <div 
                                  className="absolute top-0 w-2 h-full bg-white/95 rounded-full shadow-lg transition-all duration-700"
                                  style={{ left: `${download.progress}%`, transform: 'translateX(-50%)' }}
                                ></div>
                              )}
                            </div>
                            
                                                         {/* Enhanced Progress Stats with larger, more visible text */}
                             <div className="bg-gradient-to-r from-slate-50/80 to-white/80 rounded-lg p-3 border border-slate-200/40">
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                   {/* Large Progress Percentage */}
                                   <div className="flex items-center gap-2">
                                     <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm">
                                       <span className="text-sm font-bold text-white">
                                         {Math.round(download.progress)}%
                                       </span>
                                     </div>
                                     <div className="flex flex-col">
                                       <span className="text-sm font-semibold text-slate-800">
                                         {download.progress.toFixed(1)}%
                                       </span>
                                       <span className="text-xs text-slate-500">
                                         Complete
                                       </span>
                                     </div>
                                   </div>
                                   
                                   {/* File Size Info */}
                                   <div className="flex flex-col">
                                     <span className="text-sm font-medium text-slate-700">
                                       {formatFileSize(download.downloadedBytes)} / {formatFileSize(download.totalBytes)}
                                     </span>
                                     <span className="text-xs text-slate-500">
                                       Downloaded
                                     </span>
                                   </div>
                                   
                                   {/* Speed Info */}
                                   {download.speed && (
                                     <div className="flex flex-col">
                                       <span className="text-sm font-semibold text-blue-600">
                                         {formatSpeed(download.speed)}
                                       </span>
                                       <span className="text-xs text-slate-500">
                                         Speed
                                       </span>
                                     </div>
                                   )}
                                 </div>
                                 
                                 {/* Time Info */}
                                 <div className="text-right">
                                   <span className="text-sm text-slate-600 font-medium">
                                     {formatTime(download.startTime)}
                                   </span>
                                   <div className="text-xs text-slate-500">
                                     Started
                                   </div>
                                 </div>
                               </div>
                             </div>
                          </div>
                        )}
                        
                        {/* Completed/Other Status Info */}
                        {download.status !== 'downloading' && (
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <span className="font-medium text-slate-700">
                                {formatFileSize(download.totalBytes)}
                              </span>
                              <div className={`flex items-center gap-1.5 ${getStatusColor(download.status)}`}>
                                {download.status === 'completed' && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                                )}
                                {download.status === 'blocked' && (
                                  <AlertCircle className="w-3 h-3" />
                                )}
                                {download.status === 'cancelled' && (
                                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                )}
                                <span className="font-medium">{getStatusText(download)}</span>
                              </div>
                            </div>
                            <span className="text-slate-400">
                              {formatTime(download.startTime)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="relative flex items-center gap-2 ml-4">
                        {download.status === 'downloading' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onCancelDownload(download.id)}
                            title="Cancel download"
                            className="group/btn relative h-8 w-8 p-0 rounded-lg border border-red-200/60 hover:border-red-300 bg-white hover:bg-gradient-to-br from-red-50 to-pink-50 text-red-500 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <X className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                          </Button>
                        )}
                        
                        {download.status === 'completed' && download.filePath && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => onViewFile(download.filePath!, download.filename)}
                              title="Open file"
                              className="group/btn relative px-3 py-1.5 h-8 rounded-lg border border-blue-200/60 hover:border-blue-300 bg-white hover:bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 hover:text-blue-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                            >
                              <Eye className="w-3 h-3 mr-1.5 transition-transform group-hover/btn:scale-110" />
                              <span className="text-xs">View</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => onRevealInExplorer(download.filePath!, download.filename)}
                              title="Show in folder"
                              className="group/btn relative px-3 py-1.5 h-8 rounded-lg border border-emerald-200/60 hover:border-emerald-300 bg-white hover:bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600 hover:text-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                            >
                              <FolderOpen className="w-3 h-3 mr-1.5 transition-transform group-hover/btn:scale-110" />
                              <span className="text-xs">Show</span>
                            </Button>
                          </>
                        )}
                        
                        {download.status === 'completed' && !download.filePath && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              disabled
                              title="File location not available"
                              className="relative px-3 py-1.5 h-8 rounded-lg border border-slate-200/60 bg-slate-50 text-slate-400 shadow-sm opacity-60"
                            >
                              <ExternalLink className="w-3 h-3 mr-1.5" />
                              <span className="text-xs">View</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              disabled
                              title="File location not available"
                              className="relative px-3 py-1.5 h-8 rounded-lg border border-slate-200/60 bg-slate-50 text-slate-400 shadow-sm opacity-60"
                            >
                              <FolderOpen className="w-3 h-3 mr-1.5" />
                              <span className="text-xs">Show</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-600 font-medium">
                {downloads.filter(d => d.status === 'downloading').length > 0 
                  ? `${downloads.filter(d => d.status === 'downloading').length} download(s) in progress`
                  : downloads.length > 0 ? 'All downloads completed' : 'Ready for downloads'}
              </p>
              {downloads.length > 0 && (
                <Button 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all download history? This action cannot be undone.')) {
                      onClearDownloads();
                    }
                  }} 
                  variant="ghost" 
                  size="sm"
                  className="px-3 py-1.5 h-8 rounded-lg border border-red-200/60 hover:border-red-300 bg-white hover:bg-gradient-to-br from-red-50 to-pink-50 text-red-600 hover:text-red-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  title="Clear all downloads"
                >
                  Clear All
                </Button>
              )}
            </div>
            <Button 
              onClick={onClose} 
              className="px-4 py-2 h-9 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-none shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default DownloadsModal; 