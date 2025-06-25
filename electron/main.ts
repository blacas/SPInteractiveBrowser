import { app, BrowserWindow, session } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null = null
let vpnConnected = false

// VPN status tracking
const updateVPNStatus = (connected: boolean): void => {
  vpnConnected = connected
  if (win) {
    win.webContents.send('vpn-status-changed', connected)
  }
}

// Security: Configure session for secure browsing
const configureSecureSession = (): void => {
  const defaultSession = session.defaultSession

  // Block insecure content
  defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = details.url.toLowerCase()
    
    // Allow only HTTPS connections (except for local development)
    if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      console.log('🚫 Blocking insecure HTTP request:', details.url)
      callback({ cancel: true })
      return
    }

    // Block if VPN is not connected (fail-closed behavior for app traffic)
    if (!vpnConnected && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      console.log('🚫 Blocking request - VPN not connected:', details.url)
      callback({ cancel: true })
      return
    }

    callback({ cancel: false })
  })

  // Set security headers
  defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'X-Frame-Options': ['DENY'],
        'X-Content-Type-Options': ['nosniff'],
        'Referrer-Policy': ['strict-origin-when-cross-origin'],
        'Permissions-Policy': ['camera=(), microphone=(), geolocation=()'],
        'Content-Security-Policy': ['default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\';']
      }
    })
  })

  // Configure user agent for SharePoint compatibility
  defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ 
      requestHeaders: {
        ...details.requestHeaders,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
  })
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
    titleBarStyle: 'default',
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      
      // Security: Enable webview for controlled browsing
      webviewTag: true,
      
      // Security: Disable node integration
      nodeIntegration: false,
      
      // Security: Enable context isolation
      contextIsolation: true,
      
      // Security: Enable web security
      webSecurity: true,
      
      // Security: Disable node integration in workers
      nodeIntegrationInWorker: false,
      
      // Security: Disable node integration in subframes  
      nodeIntegrationInSubFrames: false,
      
      // Security: Enable sandbox mode
      sandbox: false, // Keep false to allow webview
      
      // Security: Disable experimental features
      experimentalFeatures: false,
      
      // Security: Disable web workers
      enableWebSQL: false,
      
      // Additional security settings
      allowRunningInsecureContent: false,
      plugins: false
    },
  })

  // Security: Prevent new window creation
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })

  // Security: Handle navigation attempts in main window
  win.webContents.on('will-navigate', (event, navigationUrl) => {
    // Only allow navigation within the app
    const allowedOrigins = [
      VITE_DEV_SERVER_URL,
      'file://',
      'about:blank'
    ].filter(Boolean)
    
    const isAllowed = allowedOrigins.some(origin => 
      navigationUrl.startsWith(origin || '')
    )
    
    if (!isAllowed) {
      console.log('🚫 Blocking main window navigation to:', navigationUrl)
      event.preventDefault()
    }
  })

  // Security: Prevent downloads (files should not touch local machine)
  win.webContents.session.on('will-download', (event, item) => {
    console.log('🚫 Blocking download attempt:', item.getFilename())
    event.preventDefault()
  })

  // Load the app
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open DevTools only in development
    if (process.env.NODE_ENV === 'development') {
      win.webContents.openDevTools()
    }
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Show window when ready
  win.once('ready-to-show', () => {
    if (win) {
      win.show()
      win.focus()
    }
  })

  // Handle VPN connection simulation (replace with actual VPN integration)
  const vpnSimulationTimer = setTimeout(() => {
    updateVPNStatus(true)
    console.log('🌐 VPN simulation: Connected to Australian endpoint')
  }, 3000)

  // Clear timer if window is closed early
  win.on('closed', () => {
    clearTimeout(vpnSimulationTimer)
    win = null
  })

  // Production: Disable menu bar
  if (process.env.NODE_ENV === 'production') {
    win.setMenuBarVisibility(false)
  }
}

// Initialize security configuration
app.whenReady().then(() => {
  console.log('🚀 Initializing Secure Remote Browser...')
  configureSecureSession()
  createWindow()
}).catch((error) => {
  console.error('❌ Failed to initialize app:', error)
  app.quit()
})

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  console.log('🚫 Another instance is already running')
  app.quit()
} else {
  app.on('second-instance', () => {
    // Focus existing window if someone tries to run another instance
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('🔐 Closing Secure Remote Browser')
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Security: Prevent navigation to external websites in main window
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl)
      
      // Allow navigation within the app only
      const allowedOrigins = [
        VITE_DEV_SERVER_URL,
        'file:',
        'about:'
      ].filter(Boolean)
      
      const isAllowed = allowedOrigins.some(origin => 
        parsedUrl.protocol.startsWith(origin || '') || 
        navigationUrl.startsWith(origin || '')
      )
      
      if (!isAllowed) {
        console.log('🚫 Blocking web contents navigation to:', navigationUrl)
        event.preventDefault()
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse navigation URL:', navigationUrl, error)
      event.preventDefault()
    }
  })
})

// Handle app protocol (for production)
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('secure-browser', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('secure-browser')
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🔐 Received SIGINT, gracefully shutting down')
  app.quit()
})

process.on('SIGTERM', () => {
  console.log('🔐 Received SIGTERM, gracefully shutting down')
  app.quit()
})
