import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Star, 
  Search, 
  Folder, 
  Trash2, 
  ExternalLink, 
  Calendar,
  Tag,
  BookOpen
} from 'lucide-react';
import { BookmarksService, Bookmark } from '@/services/bookmarksService';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (url: string) => void;
  userId: number;
}

const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  userId
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const bookmarksService = BookmarksService.getInstance();

  // Load bookmarks when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      loadBookmarks();
      loadFolders();
    }
  }, [isOpen, userId]);

  // Filter bookmarks when search term or folder changes
  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchTerm, selectedFolder]);

  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      const userBookmarks = await bookmarksService.getUserBookmarks(userId);
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const userFolders = await bookmarksService.getUserFolders(userId);
      setFolders(userFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const filterBookmarks = () => {
    let filtered = bookmarks;

    // Filter by folder
    if (selectedFolder !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.folder_name === selectedFolder);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bookmark.description && bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBookmarks(filtered);
  };

  const handleDeleteBookmark = async (bookmark: Bookmark) => {
    if (!confirm(`Are you sure you want to delete the bookmark "${bookmark.title}"?`)) {
      return;
    }

    try {
      const success = await bookmarksService.removeBookmark(bookmark.url, userId);
      if (success) {
        await loadBookmarks();
        // console.log('✅ Bookmark deleted successfully');
      } else {
        // console.error('❌ Failed to delete bookmark');
      }
    } catch (error) {
      // console.error('Error deleting bookmark:', error);
    }
  };

  const handleNavigate = (url: string) => {
    onNavigate(url);
    onClose();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const getFaviconUrl = (bookmark: Bookmark) => {
    if (bookmark.favicon_url) {
      return bookmark.favicon_url;
    }
    
    try {
      const url = new URL(bookmark.url);
      return `${url.protocol}//${url.hostname}/favicon.ico`;
    } catch {
      return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            My Bookmarks
            <Badge variant="secondary" className="ml-2">
              {filteredBookmarks.length} items
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter Controls */}
        <div className="flex gap-4 mb-4 flex-shrink-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Folders</option>
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Star className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {searchTerm || selectedFolder !== 'all' ? 'No matching bookmarks found' : 'No bookmarks yet'}
              </p>
              <p className="text-sm">
                {searchTerm || selectedFolder !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'Start bookmarking pages by clicking the star icon in the address bar'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Favicon */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {getFaviconUrl(bookmark) ? (
                      <img
                        src={getFaviconUrl(bookmark)!}
                        alt=""
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Star className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Bookmark Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleNavigate(bookmark.url)}
                          title={bookmark.title}
                        >
                          {bookmark.title}
                        </h3>
                        <p 
                          className="text-sm text-gray-500 truncate cursor-pointer hover:text-blue-500 transition-colors"
                          onClick={() => handleNavigate(bookmark.url)}
                          title={bookmark.url}
                        >
                          {bookmark.url}
                        </p>
                        {bookmark.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {bookmark.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNavigate(bookmark.url)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Open bookmark"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBookmark(bookmark)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete bookmark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mt-2">
                      {bookmark.folder_name && (
                        <div className="flex items-center gap-1">
                          <Folder className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{bookmark.folder_name}</span>
                        </div>
                      )}
                      
                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3 text-gray-400" />
                          <div className="flex gap-1">
                            {bookmark.tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {bookmark.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{bookmark.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {bookmark.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDate(bookmark.created_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
          <p className="text-sm text-gray-500">
            Total: {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
            {filteredBookmarks.length !== bookmarks.length && (
              <span> • Showing: {filteredBookmarks.length}</span>
            )}
          </p>
          
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarksModal;
