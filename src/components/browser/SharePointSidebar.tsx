import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronRight,
  Home,
  Search,
  MoreVertical,
  Download,
  FolderOpen,
  File,
  Loader2,
  RefreshCw,
  ArrowLeft,
  GripVertical,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  sharepointService,
  SharePointFile,
  SharePointSite,
  SharePointDrive,
  BreadcrumbItem,
} from "../../services/sharepointService";
import { SharePointDiagnostics } from "./SharePointDiagnostics";
import { cn } from "../../lib/utils";

interface SharePointSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (file: SharePointFile) => void;
  className?: string;
}

interface DragPreviewData {
  file: SharePointFile;
  blob: Blob | null;
  isReady: boolean;
}

export const SharePointSidebar: React.FC<SharePointSidebarProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSites] = useState<SharePointSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<SharePointSite | null>(null);
  const [selectedDrive, setSelectedDrive] = useState<SharePointDrive | null>(
    null
  );
  const [files, setFiles] = useState<SharePointFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { id: null, name: "Root" },
  ]);
  const [dragPreviews, setDragPreviews] = useState<
    Map<string, DragPreviewData>
  >(new Map());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  // Track dragging state for visual feedback
  const [, setIsDragging] = useState(false);
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);

  // Resizable panel state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // Load saved width from localStorage or use default
    const savedWidth = localStorage.getItem("sharepoint-sidebar-width");
    return savedWidth ? parseInt(savedWidth, 10) : 500;
  });
  const [isResizing, setIsResizing] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Initialize SharePoint service and visual feedback elements
  useEffect(() => {
    const initializeService = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        if (!sharepointService.isServiceInitialized()) {
          await sharepointService.initialize();
        }
        await loadSites();
      } catch (err) {
        console.error("Failed to initialize SharePoint service:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize SharePoint service"
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Add drag overlay and hint elements if they don't exist
    if (isOpen) {
      if (!document.querySelector('.drag-overlay')) {
        const dragOverlay = document.createElement('div');
        dragOverlay.className = 'drag-overlay';
        document.body.appendChild(dragOverlay);
      }

      if (!document.querySelector('.drag-hint')) {
        const dragHint = document.createElement('div');
        dragHint.className = 'drag-hint';
        dragHint.textContent = '📁 Dragging file... Drop it on the upload area or file input!';
        document.body.appendChild(dragHint);
      }
    }

    initializeService();

    // Cleanup function
    return () => {
      if (!isOpen) {
        const dragOverlay = document.querySelector('.drag-overlay');
        const dragHint = document.querySelector('.drag-hint');
        if (dragOverlay) dragOverlay.remove();
        if (dragHint) dragHint.remove();
      }
    };
  }, [isOpen]);

  // Focus search input when sidebar opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Handle resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;

      const rect = sidebarRef.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;

      // Min width: 300px, Max width: 80% of window width
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.8;
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);

      setSidebarWidth(clampedWidth);
      // Save to localStorage for persistence
      localStorage.setItem("sharepoint-sidebar-width", clampedWidth.toString());
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const loadSites = async () => {
    try {
      const sitesData = await sharepointService.getSites();
      setSites(sitesData);

      // Auto-select the first site if available
      if (sitesData.length > 0) {
        const firstSite = sitesData[0];
        setSelectedSite(firstSite);

        // Auto-select the first drive if available
        if (firstSite.drives && firstSite.drives.length > 0) {
          const firstDrive = firstSite.drives[0];
          setSelectedDrive(firstDrive);
          await loadFiles(firstSite.id, firstDrive.id);
        }
      }
    } catch (err) {
      console.error("Failed to load sites:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load SharePoint sites"
      );
    }
  };

  const loadFiles = async (
    siteId: string,
    driveId: string,
    folderId?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const filesData = await sharepointService.getFiles(
        siteId,
        driveId,
        folderId
      );
      setFiles(filesData);
    } catch (err) {
      console.error("Failed to load files:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderClick = async (folder: SharePointFile) => {
    if (!selectedSite || !selectedDrive) return;

    // Update breadcrumb
    const newBreadcrumb = [...breadcrumb, { id: folder.id, name: folder.name }];
    setBreadcrumb(newBreadcrumb);

    await loadFiles(selectedSite.id, selectedDrive.id, folder.id);
  };

  const handleBreadcrumbClick = async (index: number) => {
    if (!selectedSite || !selectedDrive) return;

    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);

    const folderId = newBreadcrumb[newBreadcrumb.length - 1].id;
    await loadFiles(selectedSite.id, selectedDrive.id, folderId || undefined);
  };

  const handleRefresh = async () => {
    if (!selectedSite || !selectedDrive) return;

    setIsRefreshing(true);
    const currentFolderId = breadcrumb[breadcrumb.length - 1].id;
    await loadFiles(
      selectedSite.id,
      selectedDrive.id,
      currentFolderId || undefined
    );
    setIsRefreshing(false);
  };

  // Helper function to determine MIME type from file extension
  const getMimeTypeFromExtension = useCallback((filename: string): string => {
    const ext = filename.toLowerCase().split(".").pop();
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      txt: "text/plain",
      csv: "text/csv",
      json: "application/json",
      xml: "application/xml",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      svg: "image/svg+xml",
      mp4: "video/mp4",
      mp3: "audio/mpeg",
      zip: "application/zip",
      rar: "application/x-rar-compressed",
      "7z": "application/x-7z-compressed",
    };
    return mimeTypes[ext || ""] || "application/octet-stream";
  }, []);

  // Create drag preview element (like Windows Explorer)
  const createDragPreview = useCallback((fileName: string, isFolder: boolean = false) => {
    // Remove any existing drag preview
    const existingPreview = document.querySelector(".drag-preview");
    if (existingPreview) {
      existingPreview.remove();
    }

    // Create new drag preview
    const dragPreview = document.createElement("div");
    dragPreview.className = `drag-preview ${isFolder ? "folder" : ""}`;
    dragPreview.textContent = fileName;

    // Add to body (positioned off-screen initially)
    document.body.appendChild(dragPreview);

    return dragPreview;
  }, []);

  // Pre-load file for drag operations with visual feedback
  const preloadFileForDrag = useCallback(
    async (file: SharePointFile) => {
      if (file.isFolder || !file.downloadUrl) {
        return;
      }

      // Check if already cached and ready
      const existing = dragPreviews.get(file.id);
      if (existing?.isReady && existing.blob) {
        return;
      }

      // Check if we're already preparing this file
      if (existing && !existing.isReady && existing.blob === null) {
        return; // Already in progress
      }

      console.log(`🔄 Pre-loading ${file.name} for drag...`);

      try {
        // Set loading state
        setDragPreviews(prev => new Map(prev.set(file.id, {
                file,
                blob: null,
                isReady: false,
        })));

        // Download file EXACTLY like working interactive-browser
        console.log(`⏳ Pre-loading ${file.name} for drag...`);
        const response = await fetch(file.downloadUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || getMimeTypeFromExtension(file.name);
        
        const blob = new Blob([arrayBuffer], { type: contentType });
        
        console.log(`✅ File ${file.name} pre-loaded (${(arrayBuffer.byteLength / 1024).toFixed(1)}KB)`);

        // Update with ready state
        setDragPreviews(prev => new Map(prev.set(file.id, {
                file,
                blob,
                isReady: true,
        })));
        
      } catch (error) {
        console.log(`Failed to pre-load ${file.name}:`, error);
        
        // Set error state
        setDragPreviews(prev => new Map(prev.set(file.id, {
                file,
                blob: null,
                isReady: false,
        })));
      }
    },
    [dragPreviews, getMimeTypeFromExtension]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, file: SharePointFile) => {
      console.log(`🚀 Starting drag for: ${file.name}`);
      
      // Skip folders for file upload
      if (file.isFolder) {
        console.log("❌ Folder drag not supported for file uploads");
        e.preventDefault();
        return;
      }

      // Add visual feedback
      setIsDragging(true);
      setDraggedFileId(file.id);
      
      // Show drag overlay and hint
      const dragOverlay = document.querySelector('.drag-overlay');
      const dragHint = document.querySelector('.drag-hint');
      if (dragOverlay) dragOverlay.classList.add('active');
      if (dragHint) dragHint.classList.add('show');

      // Create and set drag preview
      const dragPreview = createDragPreview(file.name, file.isFolder);
      e.dataTransfer.setDragImage(dragPreview, 20, 20);

      // Get cached file data
      const cachedData = dragPreviews.get(file.id);

            // If we have cached file data, use it (EXACT SAME AS INTERACTIVE-BROWSER)
      if (cachedData?.isReady && cachedData.blob) {
        console.log(`📁 Using cached file data for ${file.name}`);
        try {
          // Create File object EXACTLY like working interactive-browser
          const contentType = cachedData.blob.type;
          console.log(`🔥 Creating File object: ${file.name} (${cachedData.blob.size} bytes)`);
          
          const fileObject = new (globalThis as any).File([cachedData.blob], file.name, { 
            type: contentType
          });
          
          // CRITICAL: Verify the file object has content
          if (fileObject.size === 0) {
            throw new Error(`File object has zero size! Blob size: ${cachedData.blob.size}`);
          }
          
          console.log(`🎯 File object validation passed:`, {
            fileSize: fileObject.size,
            blobSize: cachedData.blob.size,
            sizesMatch: fileObject.size === cachedData.blob.size
          });
          
          // CRITICAL: For same-window drag (sidebar->webview), use native drag
          console.log(`🔧 SAME-WINDOW DRAG: Setting up native drag for ${file.name}`);
          
          // Prevent default web drag (doesn't work cross-context)
          e.preventDefault();
          
          // Create temp file and use native OS drag
          if (window.secureBrowser?.sharepoint?.prepareTempFile) {
            console.log(`📁 Converting to temp file for native drag...`);
            
            cachedData.blob.arrayBuffer().then(arrayBuffer => {
              return window.secureBrowser.sharepoint.prepareTempFile({
                data: arrayBuffer,
                filename: file.name
              });
            }).then(result => {
              if (result.success && result.path) {
                console.log(`✅ Temp file created: ${result.path}`);
                
                // Start native OS drag that works cross-context
                if (window.secureBrowser?.sharepoint?.startDrag) {
                  window.secureBrowser.sharepoint.startDrag(result.path);
                  console.log(`🚀 Native OS drag started for ${file.name}`);
                } else {
                  console.error(`❌ startDrag not available`);
                }
              } else {
                console.error(`❌ Failed to create temp file:`, result.error);
              }
            }).catch(error => {
              console.error(`❌ Native drag setup failed:`, error);
            });
          } else {
            console.error(`❌ prepareTempFile not available`);
            console.log(`📎 Fallback: trying web drag anyway...`);
            e.dataTransfer.items.add(fileObject);
            e.dataTransfer.effectAllowed = "copy";
          }
        } catch (error) {
          console.error(`❌ Error adding file to drag:`, error);
          // Fallback to URL
          handleFallbackDrag(e, file);
        }
      } else {
        console.log(`⚠️ No cached data, using URL fallback for ${file.name}`);
        handleFallbackDrag(e, file);
      }

      // Clean up drag preview
        setTimeout(() => {
        if (dragPreview && dragPreview.parentNode) {
          dragPreview.remove();
        }
      }, 100);
    },
    [dragPreviews, createDragPreview, getMimeTypeFromExtension]
  );

    // Helper function for fallback drag handling (SAME AS INTERACTIVE-BROWSER)
  const handleFallbackDrag = (e: React.DragEvent, file: SharePointFile) => {
    console.log(`📎 Using URL-based drag fallback for ${file.name}`);
    const mimeType = getMimeTypeFromExtension(file.name);

    try {
      // Use same fallback pattern as working version
      e.dataTransfer.setData("text/plain", file.name);
      if (file.downloadUrl) {
        e.dataTransfer.setData("text/uri-list", file.downloadUrl);
        e.dataTransfer.setData("DownloadURL", `${mimeType}:${file.name}:${file.downloadUrl}`);
      }
      e.dataTransfer.effectAllowed = "copy";
      console.log(`📎 Fallback URL-based drag configured for: ${file.name}`);
    } catch (error) {
      console.error(`❌ Error in fallback drag setup:`, error);
      e.dataTransfer.setData("text/plain", file.name);
    }
  };



    const handleDragEnd = useCallback(
    (e: React.DragEvent, file: SharePointFile) => {
      console.log(`🏁 Drag ended for: ${file.name}, dropEffect: ${e.dataTransfer.dropEffect}`);
      console.log(`🔍 Final drag state:`, {
        dropEffect: e.dataTransfer.dropEffect,
        effectAllowed: e.dataTransfer.effectAllowed,
        items: e.dataTransfer.items.length,
        files: e.dataTransfer.files.length,
        types: Array.from(e.dataTransfer.types)
      });
      
      // Remove visual feedback
      setIsDragging(false);
      setDraggedFileId(null);
      
      const dragOverlay = document.querySelector('.drag-overlay');
      const dragHint = document.querySelector('.drag-hint');
      if (dragOverlay) dragOverlay.classList.remove('active');
      if (dragHint) dragHint.classList.remove('show');

      // Clean up any remaining drag preview
      const dragPreview = document.querySelector(".drag-preview");
      if (dragPreview) {
        dragPreview.remove();
      }

      // Check if drop was successful
      if (e.dataTransfer.dropEffect === "copy" || e.dataTransfer.dropEffect === "move") {
        console.log(`✅ File ${file.name} dropped successfully!`);
        
        // Add success visual feedback
        setTimeout(() => {
          const fileElement = document.querySelector(`[data-file-id="${file.id}"]`);
          if (fileElement) {
            fileElement.classList.add("drop-success");
            setTimeout(() => fileElement.classList.remove("drop-success"), 400);
          }
        }, 50);
        
      } else if (e.dataTransfer.dropEffect === "none") {
        console.log(`❌ File ${file.name} drag was cancelled or failed`);
        console.log(`💡 This usually means the drop target doesn't accept files or there's a data format issue`);
      }
    },
    []
  );

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderFileItem = (file: SharePointFile) => {
    const dragData = dragPreviews.get(file.id);
    const isPreloading = dragData && !dragData.isReady;
    const isReady = dragData?.isReady ?? false;
    const isDownloading = downloadingFiles.has(file.id);

    return (
      <div
        key={file.id}
        data-file-id={file.id}
        data-folder={file.isFolder}
        data-filename={file.name}
        className={cn(
          "sharepoint-file-item file-row group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
          file.isFolder && "hover:bg-blue-50 dark:hover:bg-blue-900/20",
          draggedFileId === file.id && "dragging",
          isReady && !file.isFolder && "border-green-200 dark:border-green-800"
        )}
        style={{ cursor: file.isFolder ? "pointer" : "grab" }}
        draggable={!file.isFolder}
        onMouseEnter={() => !file.isFolder && preloadFileForDrag(file)}
        onDragStart={(e) => handleDragStart(e, file)}
        onDragEnd={(e) => handleDragEnd(e, file)}
        onClick={() => {
          if (file.isFolder) {
            handleFolderClick(file);
          } else {
            onFileSelect?.(file);
          }
        }}
      >
        <div className="flex-shrink-0 text-2xl">
          {sharepointService.getFileIcon(file)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {file.name}
              {!file.isFolder && (
                <span className={cn(
                  "drag-indicator text-xs ml-2",
                  isPreloading && "preparing",
                  isReady && "ready",
                  !isPreloading && !isReady && ""
                )}>
                  {isPreloading ? "⏳ Preparing..." : 
                   isReady ? "🚀 Ready to drag!" : 
                   "✋ Drag me"}
                </span>
              )}
            </span>
            {file.isFolder && (
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {file.isFolder
                ? "Folder"
                : sharepointService.formatFileSize(file.size)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {sharepointService.formatDate(file.lastModified)}
            </span>
          </div>
        </div>

        {!file.isFolder && (
          <div className="flex-shrink-0 flex items-center gap-2">
            {isPreloading && (
              <div className="flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  Loading...
                </span>
              </div>
            )}
            {isReady && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                title={`File cached (${
                  dragPreviews.get(file.id)?.blob?.size || 0
                } bytes) - Ready to drag with content`}
              >
                Ready
              </Badge>
            )}
            {!isPreloading && !isReady && (
              <Badge
                variant="outline"
                className="text-xs text-gray-500 dark:text-gray-400"
                title="Hover to preload file content for dragging"
              >
                Hover to Load
              </Badge>
            )}

            {/* Download Button - Always visible for files */}
            <Button
              variant="ghost"
              size="sm"
              onClick={async (e) => {
                e.stopPropagation();
                console.log(`🚀 Download button clicked for: ${file.name}`);
                console.log(`📥 Download URL: ${file.downloadUrl}`);

                if (!file.downloadUrl) {
                  console.error(
                    "❌ No download URL available for file:",
                    file.name
                  );
                  alert("Download URL not available for this file");
                  return;
                }

                // Set downloading state
                setDownloadingFiles((prev) => new Set(prev.add(file.id)));

                try {
                  // Method 1: Try direct download with anchor element
                  console.log("🔗 Attempting direct download...");
                  const link = document.createElement("a");
                  link.href = file.downloadUrl;
                  link.download = file.name;
                  link.style.display = "none";
                  link.setAttribute("target", "_blank");

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  console.log(`✅ Download initiated for: ${file.name}`);

                  // Remove downloading state after a delay
                  setTimeout(() => {
                    setDownloadingFiles((prev) => {
                      const next = new Set(prev);
                      next.delete(file.id);
                      return next;
                    });
                  }, 3000);
                } catch (error) {
                  console.error("❌ Download failed, trying fallback:", error);

                  // Remove downloading state
                  setDownloadingFiles((prev) => {
                    const next = new Set(prev);
                    next.delete(file.id);
                    return next;
                  });

                  // Fallback: Open in new tab
                  try {
                    window.open(file.downloadUrl, "_blank");
                    console.log("🔄 Opened download URL in new tab");
                  } catch (fallbackError) {
                    console.error("❌ Fallback also failed:", fallbackError);
                    alert(
                      `Failed to download ${file.name}. Please try opening the file in SharePoint.`
                    );
                  }
                }
              }}
              className={`h-8 w-8 p-0 transition-all hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 hover:scale-110 ${
                isDownloading ? "animate-pulse" : ""
              }`}
              title="Download file"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (file.webUrl) {
                      window.open(file.webUrl, "_blank");
                    }
                  }}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Open in SharePoint
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Global resize cursor overlay when resizing */}
      {isResizing && (
        <div
          className="fixed inset-0 z-40 cursor-ew-resize"
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
        />
      )}

      <div className="fixed inset-y-0 right-0 z-50 flex">
        {/* Resize Handle */}
        <div
          ref={resizeHandleRef}
          className={cn(
            "w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-ew-resize transition-colors duration-200 flex items-center justify-center group",
            isResizing && "bg-blue-500 dark:bg-blue-400"
          )}
          onMouseDown={handleResizeStart}
          title="Drag to resize sidebar"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <GripVertical className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={cn(
            "h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-300 ease-out border-l border-gray-200 dark:border-gray-700",
            isOpen ? "translate-x-0" : "translate-x-full",
            className
          )}
          style={{
            width: `${sidebarWidth}px`,
            minWidth: "300px",
            maxWidth: "80vw",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-3">
              {showDiagnostics && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDiagnostics(false)}
                  className="text-white hover:bg-white/20 mr-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <File className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold">
                  {showDiagnostics
                    ? "SharePoint Diagnostics"
                    : "SharePoint Files"}
                </h2>
                <p className="text-sm text-blue-100">
                  {showDiagnostics
                    ? "Connection troubleshooting"
                    : selectedSite?.name || "No site selected"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!showDiagnostics && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing || !selectedSite || !selectedDrive}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw
                    className={cn("w-4 h-4", isRefreshing && "animate-spin")}
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
                title="Close sidebar"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          {!showDiagnostics && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 text-black"
                />
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          {!showDiagnostics && breadcrumb.length > 1 && (
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-1 text-sm">
                <Home
                  className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleBreadcrumbClick(0)}
                />
                {breadcrumb.slice(1).map((item, index) => (
                  <React.Fragment key={item.id || index}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span
                      className={cn(
                        "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                        index === breadcrumb.length - 2
                          ? "text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                      onClick={() => handleBreadcrumbClick(index + 1)}
                    >
                      {item.name}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {showDiagnostics ? (
              <SharePointDiagnostics />
            ) : isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading SharePoint files...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4">
                <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <div className="text-center">
                    <div className="text-red-600 dark:text-red-400 mb-2">
                      ❌
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                      Connection Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      {error}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setError(null);
                          loadSites();
                        }}
                        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowDiagnostics(true)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                      >
                        Run Diagnostics
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm
                      ? "No files match your search"
                      : "This folder is empty"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredFiles.map(renderFileItem)}
              </div>
            )}
          </div>

          {/* Footer */}
          {!showDiagnostics && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>{filteredFiles.length} items</span>
                  <span className="text-xs opacity-50">
                    {sidebarWidth}px wide
                  </span>
                  {/* Debug info */}
                  <span className="text-xs opacity-75">
                    Cached: {Array.from(dragPreviews.values()).filter(p => p.isReady).length} files
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  >
                    Drag & Drop Ready
                  </Badge>
                  <span className="text-xs">
                    Drag handle to resize • Hover files to preload • Drag to
                    browser
                  </span>
                  {/* Test drop zone */}
                  <div
                    className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded border-2 border-dashed border-yellow-300 dark:border-yellow-700"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '#fef3c7';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '';
                      
                      console.log('🎯 DROP EVENT RECEIVED!');
                      console.log('📦 DataTransfer types:', e.dataTransfer.types);
                      console.log('📄 Files count:', e.dataTransfer.files.length);
                      
                      let dropReport = `=== DROP ANALYSIS ===\n`;
                      dropReport += `Types: ${e.dataTransfer.types.join(', ')}\n`;
                      dropReport += `Files: ${e.dataTransfer.files.length}\n\n`;
                      
                      // Log all available data
                      for (const type of e.dataTransfer.types) {
                        try {
                          const data = e.dataTransfer.getData(type);
                          console.log(`📊 Data[${type}]:`, data);
                          dropReport += `${type}: ${data ? data.substring(0, 100) + (data.length > 100 ? '...' : '') : 'empty'}\n`;
                        } catch (err) {
                          console.log(`❌ Could not get data for type ${type}:`, err);
                          dropReport += `${type}: ERROR - ${err}\n`;
                        }
                      }
                      
                      // Check files in detail
                      if (e.dataTransfer.files.length > 0) {
                        Array.from(e.dataTransfer.files).forEach((file, index) => {
                          console.log(`📁 File ${index}:`, {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            lastModified: file.lastModified
                          });
                          
                          dropReport += `\nFile ${index + 1}:\n`;
                          dropReport += `  Name: ${file.name}\n`;
                          dropReport += `  Size: ${file.size} bytes\n`;
                          dropReport += `  Type: ${file.type}\n`;
                          dropReport += `  Last Modified: ${new Date(file.lastModified).toISOString()}\n`;
                          
                          // Try to read a small portion of the file to verify content
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              const arrayBuffer = event.target.result as ArrayBuffer;
                              console.log(`✅ File content verified for ${file.name}: ${arrayBuffer.byteLength} bytes`);
                              
                              // Show first few bytes as hex for verification
                              const uint8Array = new Uint8Array(arrayBuffer.slice(0, 16));
                              const hexString = Array.from(uint8Array)
                                .map(b => b.toString(16).padStart(2, '0'))
                                .join(' ');
                              console.log(`🔍 First 16 bytes (hex): ${hexString}`);
                            }
                          };
                          reader.onerror = (error) => {
                            console.error(`❌ Failed to read file ${file.name}:`, error);
                          };
                          reader.readAsArrayBuffer(file.slice(0, 1024)); // Read first 1KB for verification
                        });
                        
                        alert(`✅ Successfully received ${e.dataTransfer.files.length} file(s)!\n\n${dropReport}\n\nCheck console for detailed analysis.`);
                      } else {
                        alert(`⚠️ Drop received but no files detected.\n\n${dropReport}\n\nThis suggests the drag source is providing URLs or other data formats instead of actual File objects.`);
                      }
                    }}
                    title="Test drop zone - drag files here to test"
                  >
                    Test Drop Zone
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
