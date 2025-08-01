import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  History,
  Search,
  MoreVertical,
  Trash2,
  ExternalLink,
  Globe,
  Clock,
  Star,
  Filter,
  Bookmark
} from 'lucide-react';
import { HistoryService, HistoryEntry } from '@/services/historyService';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (url: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load history when modal opens
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  // Filter history when search query or time filter changes
  useEffect(() => {
    filterHistory();
  }, [history, searchTerm, filterType]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const historyData = await HistoryService.getCombinedHistory(200);
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = async () => {
    try {
      let filtered = history;

      // Apply time filter
      if (filterType !== 'all') {
        const cutoffDate = getCutoffDate(filterType);
        filtered = filtered.filter(entry => 
          new Date(entry.lastVisit) >= cutoffDate
        );
      }

      // Apply search filter
      if (searchTerm.trim()) {
        if (searchTerm.trim().length > 0) {
          const searchResults = await HistoryService.searchHistory(searchTerm.trim());
          filtered = searchResults;
        }
      }

      setFilteredHistory(filtered);
    } catch (error) {
      console.error('Failed to filter history:', error);
      setFilteredHistory(history);
    }
  };

  const getCutoffDate = (timeRange: string): Date => {
    const now = new Date();
    switch (timeRange) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  };

  const handleNavigate = (url: string) => {
    onNavigate(url);
    onClose();
  };

  const handleDeleteEntry = async (entry: HistoryEntry) => {
    // Remove from state immediately
    setHistory(prev => prev.filter(h => h.url !== entry.url));
    setFilteredHistory(prev => prev.filter(h => h.url !== entry.url));
    
    // TODO: Implement actual deletion from database/localStorage
    // console.log('Delete entry:', entry.url);
  };

  const handleClearHistory = async (timeRange: 'hour' | 'day' | 'week' | 'month' | 'all') => {
    try {
      await HistoryService.clearHistory(timeRange);
      loadHistory(); // Reload after clearing
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const groupHistoryByDate = (entries: HistoryEntry[]) => {
    const groups: { [key: string]: HistoryEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.lastVisit);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(entry);
    });
    
    return groups;
  };

  const historyGroups = groupHistoryByDate(filteredHistory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <History className="w-6 h-6 text-blue-600" />
            Browsing History
          </DialogTitle>
        </DialogHeader>

        {/* Search and Controls */}
        <div className="flex items-center gap-4 py-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {filterType === 'all' ? 'All time' : 
                 filterType === 'today' ? 'Today' :
                 filterType === 'week' ? 'This week' :
                 filterType === 'month' ? 'This month' : 'All time'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('today')}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('week')}>
                This week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('month')}>
                This month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleClearHistory('hour')}>
                Last hour
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClearHistory('day')}>
                Last 24 hours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClearHistory('week')}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClearHistory('month')}>
                Last 4 weeks
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleClearHistory('all')}
                className="text-red-600"
              >
                All history
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading history...</span>
            </div>
          ) : Object.keys(historyGroups).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No history found</p>
              <p className="text-sm">
                {searchTerm ? 'Try a different search term' : 'Your browsing history will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(historyGroups).map(([groupName, entries]) => (
                <div key={groupName}>
                  <h3 className="font-semibold text-slate-700 mb-3 sticky top-0 bg-white py-2 border-b">
                    {groupName} ({entries.length})
                  </h3>
                  <div className="space-y-2">
                    {entries.map((entry, index) => (
                      <div
                        key={`${entry.url}-${index}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 group transition-colors"
                      >
                        {/* Favicon */}
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                          {entry.faviconUrl ? (
                            <img 
                              src={entry.faviconUrl} 
                              alt="" 
                              className="w-6 h-6 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Globe className="w-4 h-4 text-slate-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 
                              className="font-medium text-slate-900 truncate cursor-pointer hover:text-blue-600"
                              onClick={() => handleNavigate(entry.url)}
                            >
                              {entry.pageTitle || 'Untitled'}
                            </h4>
                            {entry.isBookmarked && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span 
                              className="truncate cursor-pointer hover:text-blue-600"
                              onClick={() => handleNavigate(entry.url)}
                            >
                              {entry.url}
                            </span>
                            <span className="flex items-center gap-1 flex-shrink-0">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(entry.lastVisit)}
                            </span>
                            {entry.visitCount > 1 && (
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                {entry.visitCount} visits
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleNavigate(entry.url)}
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => handleNavigate(entry.url)}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bookmark className="w-4 h-4 mr-2" />
                                Bookmark
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteEntry(entry)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal; 