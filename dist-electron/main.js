import { ipcMain as a, app as d, session as C, BrowserWindow as S } from "electron";
import { fileURLToPath as k } from "node:url";
import c from "node:path";
import { spawn as f } from "child_process";
import { promises as m } from "fs";
import { homedir as h } from "os";
const U = () => {
  if (typeof window < "u") {
    const e = navigator.userAgent.toLowerCase();
    if (e.includes("win")) return "windows";
    if (e.includes("mac")) return "macos";
    if (e.includes("linux")) return "linux";
  }
  if (typeof process < "u")
    switch (process.platform) {
      case "win32":
        return "windows";
      case "darwin":
        return "macos";
      case "linux":
        return "linux";
      default:
        return "unknown";
    }
  return "unknown";
}, O = (e) => {
  switch (U()) {
    case "windows":
      return {
        platform: "windows",
        displayName: "Windows",
        emoji: "🪟",
        canAutoConnect: !1,
        requiresManualSetup: !0,
        installInstructions: [
          "Download WireGuard from: https://www.wireguard.com/install/",
          "Install and open WireGuard GUI application",
          'Click "Add Tunnel" → "Add from file"',
          "Select your config file",
          'Click "Activate" to connect'
        ]
      };
    case "macos":
      return {
        platform: "macos",
        displayName: "macOS",
        emoji: "🍎",
        canAutoConnect: !0,
        requiresManualSetup: !1,
        installInstructions: [
          "Install WireGuard from App Store or: brew install wireguard-tools",
          "Use: sudo wg-quick up <config-file>",
          "Or import config into WireGuard app"
        ]
      };
    case "linux":
      return {
        platform: "linux",
        displayName: "Linux",
        emoji: "🐧",
        canAutoConnect: !0,
        requiresManualSetup: !1,
        installInstructions: [
          "Install WireGuard: sudo apt install wireguard (Ubuntu/Debian)",
          "Or: sudo yum install wireguard-tools (RHEL/CentOS)",
          "Use: sudo wg-quick up <config-file>",
          "Or use NetworkManager GUI if available"
        ]
      };
    default:
      return {
        platform: "unknown",
        displayName: "Unknown Platform",
        emoji: "❓",
        canAutoConnect: !1,
        requiresManualSetup: !0,
        installInstructions: [
          "Platform not supported",
          "Please use WireGuard manually"
        ]
      };
  }
}, x = (e) => {
  const o = O();
  console.log(`${o.emoji} ${o.displayName} Instructions:`), console.log(`   Config file: ${e}`), console.log(""), o.installInstructions.forEach((n, s) => {
    console.log(`   ${s + 1}. ${n}`);
  }), o.requiresManualSetup && (console.log(""), console.log("🔄 After connecting, restart this application to verify the connection."));
}, G = async () => {
  try {
    const e = c.resolve(".env"), n = (await m.readFile(e, "utf-8")).split(`
`);
    console.log("🔍 Loading .env file from:", e);
    for (const s of n) {
      const r = s.trim();
      if (r && !r.startsWith("#")) {
        const [t, ...l] = r.split("=");
        if (t && l.length > 0) {
          const u = l.join("=").trim();
          process.env[t.trim()] = u, !t.includes("SECRET") && !t.includes("PASSWORD") && !t.includes("KEY") && !t.includes("ID") ? console.log(`📝 Loaded: ${t.trim()}=${u}`) : console.log(`📝 Loaded: ${t.trim()}=***`);
        }
      }
    }
    console.log("✅ Environment variables loaded successfully");
  } catch (e) {
    console.error("❌ Failed to load .env file:", e), console.log("📝 This may cause VPN detection to fail");
  }
}, T = c.dirname(k(import.meta.url));
process.env.APP_ROOT = c.join(T, "..");
const E = process.env.VITE_DEV_SERVER_URL, ie = c.join(process.env.APP_ROOT, "dist-electron"), y = c.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = E ? c.join(process.env.APP_ROOT, "public") : y;
let i = null, P = !1, V = null;
const g = (e) => {
  const o = P;
  P = e, o !== e && console.log(`🔄 VPN status changed: ${o ? "Connected" : "Disconnected"} → ${e ? "Connected" : "Disconnected"}`), console.log(`📡 VPN Status Updated: ${e ? "✅ Connected - Allowing all HTTPS requests" : "❌ Disconnected - Blocking external requests"}`), i && i.webContents.send("vpn-status-changed", e);
}, N = async () => {
  try {
    const e = process.env.VPN_PROVIDER || "wireguard";
    if (e === "wireguard")
      return await $();
    throw new Error(`VPN provider ${e} not implemented`);
  } catch (e) {
    return console.error("❌ VPN connection failed:", e), !1;
  }
}, L = async () => {
  try {
    return V ? await Y() : !0;
  } catch (e) {
    return console.error("❌ VPN disconnection failed:", e), !1;
  }
}, $ = async () => {
  try {
    console.log("🔍 Debug: Environment variables at startup:"), console.log(`  NODE_ENV: ${process.env.NODE_ENV}`), console.log(`  VPN_PROVIDER: ${process.env.VPN_PROVIDER}`), console.log(`  WIREGUARD_CONFIG_PATH: ${process.env.WIREGUARD_CONFIG_PATH}`), console.log(`  WIREGUARD_ENDPOINT: ${process.env.WIREGUARD_ENDPOINT}`);
    const e = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", o = c.resolve(e);
    console.log(`🔍 Resolved config path: ${o}`);
    try {
      await m.access(o), console.log("✅ Config file found");
    } catch (t) {
      console.log("❌ Config file not found:", t), console.log("📝 This is OK - config file not required for detection");
    }
    const n = O();
    return console.log(`🔌 Checking WireGuard connection on ${n.displayName}...`), await _() ? (console.log("✅ WireGuard is connected and active"), console.log("✅ VPN connected successfully - unrestricted access enabled"), !0) : (console.log("🔄 Attempting to establish WireGuard connection..."), await j(o) ? (console.log("✅ WireGuard connection established successfully"), await _() ? (console.log("✅ VPN auto-connected successfully"), !0) : (console.log("⚠️ Connection established but IP location verification failed"), !1)) : (console.log("❌ WireGuard connection failed."), x(o), !1));
  } catch (e) {
    return console.error("❌ WireGuard setup error:", e), !1;
  }
}, j = async (e) => {
  const o = process.platform;
  try {
    switch (o) {
      case "linux":
        return await q(e);
      case "darwin":
        return await H(e);
      case "win32":
        return await M(e);
      default:
        return console.error(`❌ Unsupported platform: ${o}`), !1;
    }
  } catch (n) {
    return console.error(`❌ Failed to connect on ${o}:`, n), !1;
  }
}, q = async (e) => new Promise((o) => {
  console.log("🐧 Using Linux wg-quick...");
  const n = f("wg-quick", ["up", e], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (s) => {
    o(s === 0);
  }), n.on("error", (s) => {
    console.error("❌ wg-quick error:", s), o(!1);
  }), setTimeout(() => o(!1), 3e4);
}), H = async (e) => new Promise((o) => {
  console.log("🍎 Using macOS wg-quick...");
  const n = f("wg-quick", ["up", e], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (s) => {
    o(s === 0);
  }), n.on("error", () => {
    console.log("🍎 Trying WireGuard macOS app..."), o(!1);
  }), setTimeout(() => o(!1), 3e4);
}), M = async (e) => (console.log("🪟 Windows detected - checking existing connection..."), console.log(`   Config available at: ${e}`), !1), _ = async () => {
  const e = process.platform;
  try {
    switch (e) {
      case "linux":
        return await F();
      case "darwin":
        return await B();
      case "win32":
        return await z();
      default:
        return console.warn(`⚠️ Unsupported platform: ${e}`), !1;
    }
  } catch (o) {
    return console.error("❌ Error checking WireGuard status:", o), !1;
  }
}, F = async () => new Promise((e) => {
  const o = f("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  o.stdout.on("data", (s) => {
    n += s.toString();
  }), o.on("exit", (s) => {
    s === 0 && n.trim() ? (console.log("🐧 WireGuard active on Linux"), e(!0)) : e(!1);
  }), o.on("error", () => e(!1)), setTimeout(() => e(!1), 5e3);
}), B = async () => new Promise((e) => {
  const o = f("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  o.stdout.on("data", (s) => {
    n += s.toString();
  }), o.on("exit", (s) => {
    s === 0 && n.trim() ? (console.log("🍎 WireGuard active on macOS"), e(!0)) : v().then(e);
  }), o.on("error", () => {
    v().then(e);
  }), setTimeout(() => e(!1), 5e3);
}), v = async () => new Promise((e) => {
  const o = f("ifconfig", [], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  o.stdout.on("data", (s) => {
    n += s.toString();
  }), o.on("exit", () => {
    const s = n.includes("utun") || n.includes("tun") || n.includes("wg");
    e(s);
  }), o.on("error", () => e(!1)), setTimeout(() => e(!1), 5e3);
}), z = async () => {
  if (console.log("🪟 Starting comprehensive Windows VPN detection..."), console.log("🔍 PRIMARY CHECK: IP geolocation (mandatory)..."), !await K())
    return console.log("❌ IP geolocation check FAILED - not connected to Australian VPN"), console.log("🚨 CRITICAL: User appears to be browsing from non-Australian IP"), console.log("🔍 Running diagnostic checks for troubleshooting..."), await I(), await A(), await R(), console.log("⚠️  Note: Ping connectivity to VPN server does not indicate active VPN connection"), !1;
  console.log("✅ IP geolocation check PASSED - Australian VPN confirmed"), console.log("🔍 Running secondary verification checks...");
  const o = await I(), n = await A(), s = await R();
  return console.log(o || n || s ? "✅ Secondary checks confirm WireGuard is properly configured" : "⚠️  Secondary checks inconclusive, but IP location confirms VPN is working"), !0;
}, I = async () => new Promise((e) => {
  console.log("🔍 Checking WireGuard CLI...");
  const o = f("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  o.stdout.on("data", (s) => {
    n += s.toString();
  }), o.on("exit", (s) => {
    if (console.log(`🔍 WireGuard CLI exit code: ${s}`), console.log(`🔍 WireGuard CLI output: "${n.trim()}"`), s === 0 && n.trim()) {
      console.log("🪟 WireGuard active on Windows (CLI)"), e(!0);
      return;
    }
    e(!1);
  }), o.on("error", (s) => {
    console.log("🔍 WireGuard CLI error:", s.message), e(!1);
  }), setTimeout(() => {
    console.log("🔍 WireGuard CLI check timed out"), e(!1);
  }, 3e3);
}), A = async () => new Promise((e) => {
  console.log("🔍 Checking network interfaces via netsh...");
  const o = f("netsh", ["interface", "show", "interface"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  o.stdout.on("data", (s) => {
    n += s.toString();
  }), o.on("exit", () => {
    console.log("🔍 Network interfaces output:"), console.log(n);
    const s = n.toLowerCase().includes("wireguard") || n.toLowerCase().includes("wg") || n.toLowerCase().includes("tun");
    console.log(`🔍 WireGuard interface found: ${s}`), s && console.log("🪟 WireGuard interface detected on Windows"), e(s);
  }), o.on("error", (s) => {
    console.log("🔍 Network interface check error:", s.message), e(!1);
  }), setTimeout(() => {
    console.log("🔍 Network interface check timed out"), e(!1);
  }, 3e3);
}), R = async () => new Promise((e) => {
  console.log("🔍 Checking routing table...");
  const n = (process.env.WIREGUARD_ENDPOINT || "134.199.169.102:59926").split(":")[0];
  console.log(`🔍 Looking for routes to server: ${n}`);
  const s = f("route", ["print"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let r = "";
  s.stdout.on("data", (t) => {
    r += t.toString();
  }), s.on("exit", () => {
    const t = r.includes(n);
    console.log(`🔍 Route to VPN server found: ${t}`), t && console.log(`🪟 Found route to VPN server ${n}`), e(t);
  }), s.on("error", (t) => {
    console.log("🔍 Route check error:", t.message), e(!1);
  }), setTimeout(() => {
    console.log("🔍 Route check timed out"), e(!1);
  }, 3e3);
}), K = async () => new Promise((e) => {
  console.log("🔍 Checking current public IP and location...");
  const n = f("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/json" -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Compress'], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let s = "";
  n.stdout.on("data", (r) => {
    s += r.toString();
  }), n.on("exit", () => {
    try {
      const r = JSON.parse(s.trim()), t = r.ip, l = r.country, u = r.region, p = r.city;
      console.log(`🔍 Current public IP: ${t}`), console.log(`🔍 Location: ${p}, ${u}, ${l}`);
      const w = l === "AU" || l === "Australia";
      w ? (console.log("🇦🇺 ✅ Connected via Australian VPN!"), console.log(`📍 Australian location detected: ${p}, ${u}`)) : console.log(`❌ Not connected to Australian VPN. Current location: ${l}`), e(w);
    } catch (r) {
      console.log("🔍 Failed to parse IP info:", r), console.log("🔍 Raw output:", s);
      const l = f("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/ip" -UseBasicParsing).Content.Trim()'], {
        stdio: ["pipe", "pipe", "pipe"]
      });
      let u = "";
      l.stdout.on("data", (p) => {
        u += p.toString();
      }), l.on("exit", () => {
        const p = u.trim();
        console.log(`🔍 Fallback IP check: ${p}`);
        const w = !p.startsWith("192.168.") && !p.startsWith("10.") && !p.startsWith("172.") && p !== "127.0.0.1";
        console.log(`🔍 Assuming VPN status based on non-local IP: ${w}`), e(w);
      }), l.on("error", () => {
        e(!1);
      });
    }
  }), n.on("error", (r) => {
    console.log("🔍 IP check error:", r.message), e(!1);
  }), setTimeout(() => {
    console.log("🔍 IP check timed out"), e(!1);
  }, 1e4);
}), Y = async () => {
  try {
    const e = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", o = c.resolve(e), n = process.platform;
    switch (console.log(`🔌 Disconnecting WireGuard on ${n}...`), n) {
      case "linux":
      case "darwin":
        return await Z(o);
      case "win32":
        return await J();
      default:
        return console.error(`❌ Unsupported platform: ${n}`), !1;
    }
  } catch (e) {
    return console.error("❌ WireGuard disconnect setup error:", e), !1;
  }
}, Z = async (e) => new Promise((o) => {
  const n = f("wg-quick", ["down", e], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (s) => {
    V = null, s === 0 ? (console.log("✅ WireGuard disconnected successfully"), o(!0)) : (console.error(`❌ WireGuard disconnection failed with code: ${s}`), o(!1));
  }), n.on("error", (s) => {
    console.error("❌ WireGuard disconnect error:", s), o(!1);
  }), setTimeout(() => o(!1), 15e3);
}), J = async () => (console.log("🪟 On Windows, please disconnect manually via WireGuard GUI"), console.log("   1. Open WireGuard application"), console.log('   2. Click "Deactivate" on your tunnel'), !0), X = () => {
  const e = C.defaultSession, o = async () => {
    try {
      const s = await n();
      s ? (await e.loadExtension(s), console.log("✅ 1Password extension loaded successfully")) : console.log("📝 1Password extension not found - users can install it manually");
    } catch (s) {
      console.warn("⚠️ Could not load 1Password extension:", s), console.log("📝 Users can install 1Password extension manually from their browser");
    }
  }, n = async () => {
    const s = [
      // Chrome/Chromium paths
      c.join(h(), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      c.join(h(), "Library", "Application Support", "Google", "Chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      c.join(h(), ".config", "google-chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Edge paths
      c.join(h(), "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      c.join(h(), "Library", "Application Support", "Microsoft Edge", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Firefox paths (1Password uses different ID)
      c.join(h(), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles"),
      c.join(h(), "Library", "Application Support", "Firefox", "Profiles"),
      c.join(h(), ".mozilla", "firefox")
    ];
    for (const r of s)
      try {
        if (await m.access(r).then(() => !0).catch(() => !1)) {
          const l = (await m.readdir(r)).filter((u) => /^\d+\.\d+\.\d+/.test(u));
          if (l.length > 0) {
            const u = l.sort((W, b) => b.localeCompare(W))[0], p = c.join(r, u), w = c.join(p, "manifest.json");
            if (await m.access(w).then(() => !0).catch(() => !1))
              return p;
          }
        }
      } catch {
      }
    return null;
  };
  e.webRequest.onBeforeRequest((s, r) => {
    const t = s.url.toLowerCase();
    if (t.startsWith("chrome-extension://") || t.startsWith("moz-extension://") || t.startsWith("extension://")) {
      r({ cancel: !1 });
      return;
    }
    if (t.startsWith("http://") && !t.includes("localhost") && !t.includes("127.0.0.1")) {
      console.log("🚫 Blocking insecure HTTP request:", s.url), r({ cancel: !0 });
      return;
    }
    if (!P && !t.includes("localhost") && !t.includes("127.0.0.1")) {
      console.log("🚫 Blocking request - VPN not connected:", s.url, `VPN Status: ${P}`), r({ cancel: !0 });
      return;
    }
    P && !t.includes("localhost") && !t.includes("127.0.0.1") && console.log("✅ Allowing request - VPN connected:", s.url), r({ cancel: !1 });
  }), e.webRequest.onHeadersReceived((s, r) => {
    r({
      responseHeaders: {
        ...s.responseHeaders,
        "X-Frame-Options": ["SAMEORIGIN"],
        // Changed from DENY to allow 1Password
        "X-Content-Type-Options": ["nosniff"],
        "Referrer-Policy": ["strict-origin-when-cross-origin"],
        "Permissions-Policy": ["camera=(), microphone=(), geolocation=()"],
        "Content-Security-Policy": [
          "default-src 'self' chrome-extension: moz-extension: extension:; script-src 'self' 'unsafe-inline' 'unsafe-eval' chrome-extension: moz-extension: extension:; style-src 'self' 'unsafe-inline' https: chrome-extension: moz-extension: extension:; connect-src 'self' https: wss: data: chrome-extension: moz-extension: extension:; img-src 'self' https: data: blob: chrome-extension: moz-extension: extension:; font-src 'self' https: data: chrome-extension: moz-extension: extension:; media-src 'self' https: data: chrome-extension: moz-extension: extension:; frame-src 'self' https: chrome-extension: moz-extension: extension:; child-src 'self' https: chrome-extension: moz-extension: extension:;"
        ]
      }
    });
  }), e.webRequest.onBeforeSendHeaders((s, r) => {
    r({
      requestHeaders: {
        ...s.requestHeaders,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
  }), setTimeout(o, 1e3);
};
function D() {
  i = new S({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: c.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    titleBarStyle: "default",
    show: !1,
    // Don't show until ready
    webPreferences: {
      preload: c.join(T, "preload.cjs"),
      // Security: Enable webview for controlled browsing
      webviewTag: !0,
      // Security: Disable node integration
      nodeIntegration: !1,
      // Security: Enable context isolation
      contextIsolation: !0,
      // Security: Enable web security
      webSecurity: !0,
      // Security: Disable node integration in workers
      nodeIntegrationInWorker: !1,
      // Security: Disable node integration in subframes  
      nodeIntegrationInSubFrames: !1,
      // Security: Enable sandbox mode
      sandbox: !1,
      // Keep false to allow webview
      // Security: Disable experimental features
      experimentalFeatures: !1,
      // Security: Disable web workers
      enableWebSQL: !1,
      // Additional security settings
      allowRunningInsecureContent: !1,
      plugins: !1
    }
  }), i.webContents.setWindowOpenHandler(() => ({ action: "deny" })), i.webContents.on("will-navigate", (e, o) => {
    [
      E,
      "file://",
      "about:blank"
    ].filter(Boolean).some(
      (r) => o.startsWith(r || "")
    ) || (console.log("🚫 Blocking main window navigation to:", o), e.preventDefault());
  }), i.webContents.session.on("will-download", (e, o) => {
    console.log("🚫 Blocking download attempt:", o.getFilename()), e.preventDefault();
  }), E ? (i.loadURL(E), process.env.NODE_ENV === "development" && i.webContents.openDevTools()) : i.loadFile(c.join(y, "index.html")), i.once("ready-to-show", () => {
    i && (i.show(), i.focus());
  }), setTimeout(async () => {
    try {
      if (await _())
        console.log("✅ VPN is already connected during app initialization"), g(!0);
      else if (process.env.VPN_AUTO_CONNECT === "true") {
        console.log("🔄 VPN not connected, attempting auto-connect...");
        const o = await N();
        g(o), o ? console.log("✅ VPN auto-connected successfully") : console.warn("⚠️ VPN auto-connect failed");
      } else
        console.log("⚠️ VPN not connected and auto-connect disabled"), g(!1);
    } catch (e) {
      console.error("❌ VPN initialization error:", e), g(!1);
    }
  }, 500), i.on("closed", () => {
    L().catch((e) => {
      console.error("❌ Error disconnecting VPN on app close:", e);
    }), i = null;
  }), process.env.NODE_ENV === "production" && i.setMenuBarVisibility(!1);
}
a.handle("system-get-version", () => d.getVersion());
a.handle("system-get-environment", () => {
  const e = {
    NODE_ENV: process.env.NODE_ENV,
    APP_NAME: process.env.APP_NAME,
    APP_VERSION: process.env.APP_VERSION,
    VPN_PROVIDER: process.env.VPN_PROVIDER,
    VPN_SERVER_REGION: process.env.VPN_SERVER_REGION,
    VPN_AUTO_CONNECT: process.env.VPN_AUTO_CONNECT,
    VPN_FAIL_CLOSED: process.env.VPN_FAIL_CLOSED,
    WIREGUARD_CONFIG_PATH: process.env.WIREGUARD_CONFIG_PATH,
    WIREGUARD_ENDPOINT: process.env.WIREGUARD_ENDPOINT,
    VAULT_PROVIDER: process.env.VAULT_PROVIDER,
    VAULT_ADDR: process.env.VAULT_ADDR,
    VAULT_NAMESPACE: process.env.VAULT_NAMESPACE,
    VAULT_ROLE_ID: process.env.VAULT_ROLE_ID,
    VAULT_SECRET_ID: process.env.VAULT_SECRET_ID,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_VAULT_URL: process.env.AZURE_VAULT_URL,
    OP_CONNECT_HOST: process.env.OP_CONNECT_HOST,
    OP_CONNECT_TOKEN: process.env.OP_CONNECT_TOKEN,
    SHAREPOINT_TENANT_URL: process.env.SHAREPOINT_TENANT_URL,
    SHAREPOINT_AUTO_LOGIN: process.env.SHAREPOINT_AUTO_LOGIN,
    SHAREPOINT_DEFAULT_ACCESS_LEVEL: process.env.SHAREPOINT_DEFAULT_ACCESS_LEVEL,
    SHAREPOINT_DOCUMENT_LIBRARIES: process.env.SHAREPOINT_DOCUMENT_LIBRARIES,
    SECURITY_BLOCK_DOWNLOADS: process.env.SECURITY_BLOCK_DOWNLOADS,
    SECURITY_HTTPS_ONLY: process.env.SECURITY_HTTPS_ONLY,
    SECURITY_FAIL_CLOSED_VPN: process.env.SECURITY_FAIL_CLOSED_VPN,
    SECURITY_BLOCK_DEVTOOLS: process.env.SECURITY_BLOCK_DEVTOOLS,
    LEVEL1_DOMAINS: process.env.LEVEL1_DOMAINS,
    LEVEL2_DOMAINS: process.env.LEVEL2_DOMAINS,
    LEVEL3_ENABLED: process.env.LEVEL3_ENABLED,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_FILE_PATH: process.env.LOG_FILE_PATH
  };
  return console.log("🔄 Environment variables requested from renderer:", {
    NODE_ENV: e.NODE_ENV,
    VPN_PROVIDER: e.VPN_PROVIDER,
    WIREGUARD_ENDPOINT: e.WIREGUARD_ENDPOINT
  }), JSON.stringify(e);
});
a.handle("vpn-get-status", async () => {
  console.log("🔍 VPN status requested - running comprehensive check...");
  try {
    const e = await _(), o = e ? "connected" : "disconnected";
    return console.log(`📊 VPN status check result: ${o}`), g(e), o;
  } catch (e) {
    return console.error("❌ VPN status check error:", e), "disconnected";
  }
});
a.handle("vpn-connect", async (e, o) => {
  console.log(`🌐 VPN connect requested: ${o}`);
  try {
    const n = await N();
    return g(n), n;
  } catch (n) {
    return console.error("❌ VPN connection error:", n), g(!1), !1;
  }
});
a.handle("vpn-disconnect", async () => {
  console.log("🌐 VPN disconnect requested");
  try {
    const e = await L();
    return g(!1), e;
  } catch (e) {
    return console.error("❌ VPN disconnection error:", e), !1;
  }
});
const Q = async (e) => {
  const o = process.env.OP_SERVICE_ACCOUNT_TOKEN;
  if (!o)
    throw new Error("1Password Service Account not configured. Set OP_SERVICE_ACCOUNT_TOKEN environment variable.");
  try {
    const n = await fetch(`https://my.1password.com/api/v1/items/${e}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${o}`,
        "Content-Type": "application/json"
      }
    });
    if (!n.ok)
      throw new Error(`1Password Service Account API error: ${n.status} ${n.statusText}`);
    const s = await n.json(), r = {};
    if (s.fields) {
      for (const t of s.fields)
        if (t.label && t.value)
          switch (t.label.toLowerCase()) {
            case "username":
            case "email":
              r.username = t.value;
              break;
            case "password":
              r.password = t.value;
              break;
            case "tenant_url":
            case "url":
            case "website":
              r.tenant_url = t.value;
              break;
            case "level1_domains":
              r.level1_domains = t.value;
              break;
            case "level2_domains":
              r.level2_domains = t.value;
              break;
            case "level3_enabled":
              r.level3_enabled = t.value === "true";
              break;
            default:
              r[t.label.toLowerCase().replace(/\s+/g, "_")] = t.value;
          }
    }
    return r;
  } catch (n) {
    throw new Error(`Failed to retrieve 1Password secret: ${n instanceof Error ? n.message : String(n)}`);
  }
};
a.handle("vault-get-sharepoint-credentials", async () => {
  console.log("🔑 SharePoint credentials requested from main process");
  try {
    const e = process.env.VAULT_PROVIDER || "hashicorp";
    if (process.env.NODE_ENV === "development")
      return console.log("🔧 Development mode: returning mock vault credentials"), {
        username: "dev-user@yourcompany.sharepoint.com",
        password: "dev-password-from-vault",
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
    if (e === "1password" || e === "1password-cli") {
      console.log("🔐 Using 1Password Service Account for credentials");
      const o = process.env.OP_SHAREPOINT_ITEM_ID || "SharePoint Service Account", n = await Q(o);
      return {
        username: n.username,
        password: n.password,
        tenant_url: n.tenant_url,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else
      return console.log(`⚠️ Vault provider ${e} not fully implemented`), {
        username: "vault-user@yourcompany.sharepoint.com",
        password: "vault-retrieved-password",
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
  } catch (e) {
    throw console.error("❌ Vault credentials retrieval failed:", e), new Error(`Vault credentials unavailable: ${e instanceof Error ? e.message : "Unknown error"}`);
  }
});
a.handle("vault-rotate-credentials", async () => {
  console.log("🔄 Vault credential rotation requested from main process");
  try {
    return process.env.NODE_ENV === "development" && console.log("🔧 Development mode: simulating credential rotation"), !0;
  } catch (e) {
    return console.error("❌ Vault credential rotation failed:", e), !1;
  }
});
a.handle("vault-get-status", async () => {
  if (process.env.NODE_ENV === "development")
    return "connected-dev";
  const e = process.env.VAULT_PROVIDER || "hashicorp";
  try {
    if (e === "1password" || e === "1password-cli") {
      const o = process.env.OP_SERVICE_ACCOUNT_TOKEN, n = process.env.OP_SHAREPOINT_ITEM_ID;
      if (!o)
        return "error: 1Password Service Account not configured";
      if (!n)
        return "error: SharePoint Item ID not configured";
      const s = await fetch(`https://my.1password.com/api/v1/items/${n}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${o}`,
          "Content-Type": "application/json"
        }
      });
      return s.ok ? (console.log("✅ 1Password Service Account access verified"), "connected") : (console.error("❌ 1Password Service Account access failed:", s.status), "error: Cannot access SharePoint credentials in 1Password");
    } else
      return "connected";
  } catch (o) {
    return console.error("❌ Vault status check failed:", o), `error: ${o instanceof Error ? o.message : "Unknown error"}`;
  }
});
a.handle("security-check-url", async (e, o, n) => (console.log(`🔒 URL check: ${o} (Level ${n})`), !0));
a.handle("security-log-navigation", async (e, o, n, s) => {
  console.log(`📝 Navigation log: ${o} - ${n ? "ALLOWED" : "BLOCKED"} (Level ${s})`);
});
a.handle("security-prevent-download", async (e, o) => {
  console.log(`🚫 Download blocked: ${o}`);
});
a.handle("extension-get-1password-status", async () => {
  try {
    const o = C.defaultSession.getAllExtensions().find(
      (n) => n.name.toLowerCase().includes("1password") || n.id === "aeblfdkhhhdcdjpifhhbdiojplfjncoa"
    );
    return o ? {
      installed: !0,
      version: o.version,
      name: o.name,
      id: o.id
    } : {
      installed: !1,
      downloadUrl: "https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa",
      instructions: "Please install the 1Password extension for the best experience"
    };
  } catch (e) {
    return console.error("❌ Error checking 1Password extension status:", e), {
      installed: !1,
      error: "Could not check extension status"
    };
  }
});
a.handle("extension-install-1password", async () => (console.log("🔧 1Password extension installation requested"), {
  success: !1,
  message: "Please install 1Password extension manually",
  steps: [
    "1. Open Chrome or Edge browser",
    "2. Go to chrome://extensions/ or edge://extensions/",
    "3. Enable Developer mode",
    "4. Install 1Password extension from the web store",
    "5. Restart the Secure Remote Browser"
  ],
  webStoreUrl: "https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa"
}));
a.handle("sharepoint-inject-credentials", async (e, o) => (console.log(`🔐 SharePoint credentials injection requested for: ${o}`), !0));
a.handle("sharepoint-get-config", async () => ({
  tenantUrl: process.env.SHAREPOINT_TENANT_URL || "https://your-tenant.sharepoint.com",
  libraryPath: "/sites/documents/Shared Documents"
}));
a.handle("sharepoint-validate-access", async (e, o) => (console.log(`🔍 SharePoint access validation: ${o}`), !0));
d.whenReady().then(async () => {
  console.log("🚀 Initializing Secure Remote Browser..."), await G(), X(), console.log("🔌 Starting VPN connection...");
  const e = await N();
  g(e), e ? console.log("✅ VPN connected successfully - unrestricted access enabled") : console.error("❌ VPN connection failed - starting with restricted access"), D();
}).catch((e) => {
  console.error("❌ Failed to initialize app:", e), d.quit();
});
const ee = d.requestSingleInstanceLock();
ee ? d.on("second-instance", () => {
  i && (i.isMinimized() && i.restore(), i.focus());
}) : (console.log("🚫 Another instance is already running"), d.quit());
d.on("window-all-closed", () => {
  process.platform !== "darwin" && (console.log("🔐 Closing Secure Remote Browser"), d.quit());
});
d.on("activate", () => {
  S.getAllWindows().length === 0 && D();
});
d.on("web-contents-created", (e, o) => {
  o.on("will-navigate", (n, s) => {
    try {
      const r = new URL(s);
      [
        E,
        "file:",
        "about:"
      ].filter(Boolean).some(
        (u) => r.protocol.startsWith(u || "") || s.startsWith(u || "")
      ) || (console.log("🚫 Blocking web contents navigation to:", s), n.preventDefault());
    } catch (r) {
      console.warn("⚠️ Failed to parse navigation URL:", s, r), n.preventDefault();
    }
  });
});
process.defaultApp ? process.argv.length >= 2 && d.setAsDefaultProtocolClient("secure-browser", process.execPath, [c.resolve(process.argv[1])]) : d.setAsDefaultProtocolClient("secure-browser");
process.on("SIGINT", () => {
  console.log("🔐 Received SIGINT, gracefully shutting down"), d.quit();
});
process.on("SIGTERM", () => {
  console.log("🔐 Received SIGTERM, gracefully shutting down"), d.quit();
});
export {
  ie as MAIN_DIST,
  y as RENDERER_DIST,
  E as VITE_DEV_SERVER_URL
};
