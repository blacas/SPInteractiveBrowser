import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, BookOpen } from 'lucide-react';
import { BookmarksService } from '@/services/bookmarksService';
import BookmarksModal from './BookmarksModal';

interface BookmarkButtonProps {
  url: string;
  title: string;
  userId: number;
  accessLevel: number;
  className?: string;
  onNavigate?: (url: string) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  url,
  title,
  userId,
  accessLevel,
  className = "",
  onNavigate
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const bookmarksService = BookmarksService.getInstance();

  // Check if current URL is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (url && userId) {
        const bookmarked = await bookmarksService.isBookmarked(url, userId);
        setIsBookmarked(bookmarked);
      }
    };
    
    checkBookmarkStatus();
  }, [url, userId]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // console.log('🔄 Toggle bookmark clicked:', { url, title, userId, accessLevel });
    
    if (!url || !userId) {
      console.warn('⚠️ Missing required data for bookmark:', { url, userId });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await bookmarksService.toggleBookmark(
        url, 
        title || url, 
        userId, 
        accessLevel
      );
      
      if (success) {
        const newBookmarkState = !isBookmarked;
        setIsBookmarked(newBookmarkState);
        
        // Show toast notification
        if (newBookmarkState) {
          // console.log('✅ Page bookmarked successfully');
          // You could add a toast notification here
        } else {
          // console.log('✅ Bookmark removed successfully');
          // You could add a toast notification here
        }
      } else {
        // console.error('❌ Failed to toggle bookmark');
      }
    } catch (error) {
      // console.error('❌ Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowBookmarks = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBookmarksModal(true);
  };

  // Don't show bookmark button for empty or invalid URLs
  if (!url || url === 'about:blank' || url.startsWith('chrome://') || url.startsWith('electron://')) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Bookmark Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleBookmark}
          disabled={isLoading}
          className={`h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-200 rounded-md ${className}`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Star 
            className={`h-4 w-4 transition-all duration-200 ${
              isBookmarked 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-slate-300 hover:text-yellow-400'
            } ${isLoading ? 'animate-pulse' : ''}`} 
          />
        </Button>

        {/* Show Bookmarks Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowBookmarks}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-200 rounded-md"
          title="Show all bookmarks"
        >
          <BookOpen className="h-4 w-4" />
        </Button>
      </div>

      {/* Bookmarks Modal */}
      {onNavigate && (
        <BookmarksModal
          isOpen={showBookmarksModal}
          onClose={() => setShowBookmarksModal(false)}
          onNavigate={onNavigate}
          userId={userId}
        />
      )}
    </>
  );
};

export default BookmarkButton;
