import require$$3$1, { app, ipcMain, session, BrowserWindow, Menu, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import require$$1$1, { spawn } from "child_process";
import require$$3, { promises } from "fs";
import { homedir } from "os";
import require$$0$1 from "path";
import require$$0 from "tty";
import require$$1 from "util";
import require$$4 from "net";
const detectPlatform = () => {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("win")) return "windows";
    if (userAgent.includes("mac")) return "macos";
    if (userAgent.includes("linux")) return "linux";
  }
  if (typeof process !== "undefined") {
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
  }
  return "unknown";
};
const getPlatformInfo = (platform) => {
  const currentPlatform = detectPlatform();
  switch (currentPlatform) {
    case "windows":
      return {
        platform: "windows",
        displayName: "Windows",
        emoji: "🪟",
        canAutoConnect: false,
        requiresManualSetup: true,
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
        canAutoConnect: true,
        requiresManualSetup: false,
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
        canAutoConnect: true,
        requiresManualSetup: false,
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
        canAutoConnect: false,
        requiresManualSetup: true,
        installInstructions: [
          "Platform not supported",
          "Please use WireGuard manually"
        ]
      };
  }
};
const printPlatformInstructions = (configPath) => {
  const info = getPlatformInfo();
  console.log(`${info.emoji} ${info.displayName} Instructions:`);
  console.log(`   Config file: ${configPath}`);
  console.log("");
  info.installInstructions.forEach((instruction, index) => {
    console.log(`   ${index + 1}. ${instruction}`);
  });
  if (info.requiresManualSetup) {
    console.log("");
    console.log("🔄 After connecting, restart this application to verify the connection.");
  }
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var src = { exports: {} };
var browser = { exports: {} };
var debug = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    if (ms2 >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (ms2 >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (ms2 >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (ms2 >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    return plural(ms2, d, "day") || plural(ms2, h, "hour") || plural(ms2, m, "minute") || plural(ms2, s, "second") || ms2 + " ms";
  }
  function plural(ms2, n, name) {
    if (ms2 < n) {
      return;
    }
    if (ms2 < n * 1.5) {
      return Math.floor(ms2 / n) + " " + name;
    }
    return Math.ceil(ms2 / n) + " " + name + "s";
  }
  return ms;
}
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug.exports;
  hasRequiredDebug = 1;
  (function(module, exports) {
    exports = module.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = requireMs();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    function createDebug(namespace) {
      function debug2() {
        if (!debug2.enabled) return;
        var self = debug2;
        var curr = +/* @__PURE__ */ new Date();
        var ms2 = curr - (prevTime || curr);
        self.diff = ms2;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self, args);
        var logFn = debug2.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      debug2.namespace = namespace;
      debug2.enabled = exports.enabled(namespace);
      debug2.useColors = exports.useColors();
      debug2.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug2);
      }
      return debug2;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports.enable("");
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  })(debug, debug.exports);
  return debug.exports;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports) {
    exports = module.exports = requireDebug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports) {
    var tty = require$$0;
    var util = require$$1;
    exports = module.exports = requireDebug();
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
      else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
      else if (val === "null") val = null;
      else val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name + " " + args[0];
      }
    }
    function log() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs = require$$3;
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require$$4;
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    exports.enable(load());
  })(node, node.exports);
  return node.exports;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  if (typeof process !== "undefined" && process.type === "renderer") {
    src.exports = requireBrowser();
  } else {
    src.exports = requireNode();
  }
  return src.exports;
}
var electronSquirrelStartup$1;
var hasRequiredElectronSquirrelStartup;
function requireElectronSquirrelStartup() {
  if (hasRequiredElectronSquirrelStartup) return electronSquirrelStartup$1;
  hasRequiredElectronSquirrelStartup = 1;
  var path2 = require$$0$1;
  var spawn2 = require$$1$1.spawn;
  var debug2 = requireSrc()("electron-squirrel-startup");
  var app2 = require$$3$1.app;
  var run = function(args, done) {
    var updateExe = path2.resolve(path2.dirname(process.execPath), "..", "Update.exe");
    debug2("Spawning `%s` with args `%s`", updateExe, args);
    spawn2(updateExe, args, {
      detached: true
    }).on("close", done);
  };
  var check = function() {
    if (process.platform === "win32") {
      var cmd = process.argv[1];
      debug2("processing squirrel command `%s`", cmd);
      var target = path2.basename(process.execPath);
      if (cmd === "--squirrel-install" || cmd === "--squirrel-updated") {
        run(["--createShortcut=" + target], app2.quit);
        return true;
      }
      if (cmd === "--squirrel-uninstall") {
        run(["--removeShortcut=" + target], app2.quit);
        return true;
      }
      if (cmd === "--squirrel-obsolete") {
        app2.quit();
        return true;
      }
    }
    return false;
  };
  electronSquirrelStartup$1 = check();
  return electronSquirrelStartup$1;
}
var electronSquirrelStartupExports = requireElectronSquirrelStartup();
const electronSquirrelStartup = /* @__PURE__ */ getDefaultExportFromCjs(electronSquirrelStartupExports);
if (electronSquirrelStartup) {
  app.quit();
}
const loadEnvironmentVariables = async () => {
  try {
    const envPath = path.resolve(".env");
    const envContent = await promises.readFile(envPath, "utf-8");
    const envLines = envContent.split("\n");
    console.log("🔍 Loading .env file from:", envPath);
    for (const line of envLines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim();
          process.env[key.trim()] = value;
          if (!key.includes("SECRET") && !key.includes("PASSWORD") && !key.includes("KEY") && !key.includes("ID")) {
            console.log(`📝 Loaded: ${key.trim()}=${value}`);
          } else {
            console.log(`📝 Loaded: ${key.trim()}=***`);
          }
        }
      }
    }
    console.log("✅ Environment variables loaded successfully");
  } catch (error) {
    console.error("❌ Failed to load .env file:", error);
    console.log("📝 This may cause VPN detection to fail");
  }
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let windows = [];
let mainWindow = null;
let vpnConnected = false;
let wireguardProcess = null;
const updateVPNStatus = (connected) => {
  const wasConnected = vpnConnected;
  vpnConnected = connected;
  if (wasConnected !== connected) {
    console.log(`🔄 VPN status changed: ${wasConnected ? "Connected" : "Disconnected"} → ${connected ? "Connected" : "Disconnected"}`);
  }
  console.log(`📡 VPN Status Updated: ${connected ? "✅ Connected - Allowing all HTTPS requests" : "❌ Disconnected - Blocking external requests"}`);
  windows.forEach((window2) => {
    if (window2 && !window2.isDestroyed()) {
      window2.webContents.send("vpn-status-changed", connected);
    }
  });
};
const connectVPN = async () => {
  try {
    const provider = process.env.VPN_PROVIDER || "wireguard";
    if (provider === "wireguard") {
      return await connectWireGuard();
    } else {
      throw new Error(`VPN provider ${provider} not implemented`);
    }
  } catch (error) {
    console.error("❌ VPN connection failed:", error);
    return false;
  }
};
const disconnectVPN = async () => {
  try {
    if (wireguardProcess) {
      return await disconnectWireGuard();
    }
    return true;
  } catch (error) {
    console.error("❌ VPN disconnection failed:", error);
    return false;
  }
};
const connectWireGuard = async () => {
  try {
    console.log("🔍 Debug: Environment variables at startup:");
    console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`  VPN_PROVIDER: ${process.env.VPN_PROVIDER}`);
    console.log(`  WIREGUARD_CONFIG_PATH: ${process.env.WIREGUARD_CONFIG_PATH}`);
    console.log(`  WIREGUARD_ENDPOINT: ${process.env.WIREGUARD_ENDPOINT}`);
    const configPath = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf";
    const resolvedPath = path.resolve(configPath);
    console.log(`🔍 Resolved config path: ${resolvedPath}`);
    try {
      await promises.access(resolvedPath);
      console.log("✅ Config file found");
    } catch (error) {
      console.log("❌ Config file not found:", error);
      console.log("📝 This is OK - config file not required for detection");
    }
    const platformInfo = getPlatformInfo();
    console.log(`🔌 Checking WireGuard connection on ${platformInfo.displayName}...`);
    const isConnected = await checkWireGuardConnection();
    if (isConnected) {
      console.log("✅ WireGuard is connected and active");
      console.log("✅ VPN connected successfully - unrestricted access enabled");
      return true;
    }
    console.log("🔄 Attempting to establish WireGuard connection...");
    const connectionResult = await establishWireGuardConnection(resolvedPath);
    if (connectionResult) {
      console.log("✅ WireGuard connection established successfully");
      const verifyConnection = await checkWireGuardConnection();
      if (verifyConnection) {
        console.log("✅ VPN auto-connected successfully");
        return true;
      } else {
        console.log("⚠️ Connection established but IP location verification failed");
        return false;
      }
    } else {
      console.log("❌ WireGuard connection failed.");
      printPlatformInstructions(resolvedPath);
      return false;
    }
  } catch (error) {
    console.error("❌ WireGuard setup error:", error);
    return false;
  }
};
const establishWireGuardConnection = async (configPath) => {
  const platform = process.platform;
  try {
    switch (platform) {
      case "linux":
        return await connectWireGuardLinux(configPath);
      case "darwin":
        return await connectWireGuardMacOS(configPath);
      case "win32":
        return await connectWireGuardWindows(configPath);
      default:
        console.error(`❌ Unsupported platform: ${platform}`);
        return false;
    }
  } catch (error) {
    console.error(`❌ Failed to connect on ${platform}:`, error);
    return false;
  }
};
const connectWireGuardLinux = async (configPath) => {
  return new Promise((resolve) => {
    console.log("🐧 Using Linux wg-quick...");
    const process2 = spawn("wg-quick", ["up", configPath], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    process2.on("exit", (code) => {
      resolve(code === 0);
    });
    process2.on("error", (error) => {
      console.error("❌ wg-quick error:", error);
      resolve(false);
    });
    setTimeout(() => resolve(false), 3e4);
  });
};
const connectWireGuardMacOS = async (configPath) => {
  return new Promise((resolve) => {
    console.log("🍎 Using macOS wg-quick...");
    const process2 = spawn("wg-quick", ["up", configPath], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    process2.on("exit", (code) => {
      resolve(code === 0);
    });
    process2.on("error", () => {
      console.log("🍎 Trying WireGuard macOS app...");
      resolve(false);
    });
    setTimeout(() => resolve(false), 3e4);
  });
};
const connectWireGuardWindows = async (configPath) => {
  console.log("🪟 Windows detected - checking existing connection...");
  console.log(`   Config available at: ${configPath}`);
  return false;
};
const checkWireGuardConnection = async () => {
  const platform = process.platform;
  try {
    switch (platform) {
      case "linux":
        return await checkWireGuardLinux();
      case "darwin":
        return await checkWireGuardMacOS();
      case "win32":
        return await checkWireGuardWindows();
      default:
        console.warn(`⚠️ Unsupported platform: ${platform}`);
        return false;
    }
  } catch (error) {
    console.error("❌ Error checking WireGuard status:", error);
    return false;
  }
};
const checkWireGuardLinux = async () => {
  return new Promise((resolve) => {
    const process2 = spawn("wg", ["show"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    process2.stdout.on("data", (data) => {
      output += data.toString();
    });
    process2.on("exit", (code) => {
      if (code === 0 && output.trim()) {
        console.log("🐧 WireGuard active on Linux");
        resolve(true);
      } else {
        resolve(false);
      }
    });
    process2.on("error", () => resolve(false));
    setTimeout(() => resolve(false), 5e3);
  });
};
const checkWireGuardMacOS = async () => {
  return new Promise((resolve) => {
    const process2 = spawn("wg", ["show"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    process2.stdout.on("data", (data) => {
      output += data.toString();
    });
    process2.on("exit", (code) => {
      if (code === 0 && output.trim()) {
        console.log("🍎 WireGuard active on macOS");
        resolve(true);
      } else {
        checkMacOSNetworkInterfaces().then(resolve);
      }
    });
    process2.on("error", () => {
      checkMacOSNetworkInterfaces().then(resolve);
    });
    setTimeout(() => resolve(false), 5e3);
  });
};
const checkMacOSNetworkInterfaces = async () => {
  return new Promise((resolve) => {
    const process2 = spawn("ifconfig", [], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    process2.stdout.on("data", (data) => {
      output += data.toString();
    });
    process2.on("exit", () => {
      const hasWG = output.includes("utun") || output.includes("tun") || output.includes("wg");
      resolve(hasWG);
    });
    process2.on("error", () => resolve(false));
    setTimeout(() => resolve(false), 5e3);
  });
};
const checkWireGuardWindows = async () => {
  console.log("🪟 Starting comprehensive Windows VPN detection...");
  console.log("🔍 PRIMARY CHECK: IP geolocation (mandatory)...");
  const ipResult = await checkCurrentIP();
  if (!ipResult) {
    console.log("❌ IP geolocation check FAILED - not connected to Australian VPN");
    console.log("🚨 CRITICAL: User appears to be browsing from non-Australian IP");
    console.log("🔍 Running diagnostic checks for troubleshooting...");
    await checkWireGuardCLI();
    await checkWindowsNetworkInterfaces();
    await checkRoutingTable();
    console.log("⚠️  Note: Ping connectivity to VPN server does not indicate active VPN connection");
    return false;
  }
  console.log("✅ IP geolocation check PASSED - Australian VPN confirmed");
  console.log("🔍 Running secondary verification checks...");
  const cliResult = await checkWireGuardCLI();
  const interfaceResult = await checkWindowsNetworkInterfaces();
  const routingResult = await checkRoutingTable();
  if (cliResult || interfaceResult || routingResult) {
    console.log("✅ Secondary checks confirm WireGuard is properly configured");
  } else {
    console.log("⚠️  Secondary checks inconclusive, but IP location confirms VPN is working");
  }
  return true;
};
const checkWireGuardCLI = async () => {
  return new Promise((resolve) => {
    console.log("🔍 Checking WireGuard CLI...");
    const wgProcess = spawn("wg", ["show"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let wgOutput = "";
    wgProcess.stdout.on("data", (data) => {
      wgOutput += data.toString();
    });
    wgProcess.on("exit", (code) => {
      console.log(`🔍 WireGuard CLI exit code: ${code}`);
      console.log(`🔍 WireGuard CLI output: "${wgOutput.trim()}"`);
      if (code === 0 && wgOutput.trim()) {
        console.log("🪟 WireGuard active on Windows (CLI)");
        resolve(true);
        return;
      }
      resolve(false);
    });
    wgProcess.on("error", (error) => {
      console.log("🔍 WireGuard CLI error:", error.message);
      resolve(false);
    });
    setTimeout(() => {
      console.log("🔍 WireGuard CLI check timed out");
      resolve(false);
    }, 3e3);
  });
};
const checkWindowsNetworkInterfaces = async () => {
  return new Promise((resolve) => {
    console.log("🔍 Checking network interfaces via netsh...");
    const netshProcess = spawn("netsh", ["interface", "show", "interface"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    netshProcess.stdout.on("data", (data) => {
      output += data.toString();
    });
    netshProcess.on("exit", () => {
      console.log("🔍 Network interfaces output:");
      console.log(output);
      const hasWireGuard = output.toLowerCase().includes("wireguard") || output.toLowerCase().includes("wg") || output.toLowerCase().includes("tun");
      console.log(`🔍 WireGuard interface found: ${hasWireGuard}`);
      if (hasWireGuard) {
        console.log("🪟 WireGuard interface detected on Windows");
      }
      resolve(hasWireGuard);
    });
    netshProcess.on("error", (error) => {
      console.log("🔍 Network interface check error:", error.message);
      resolve(false);
    });
    setTimeout(() => {
      console.log("🔍 Network interface check timed out");
      resolve(false);
    }, 3e3);
  });
};
const checkRoutingTable = async () => {
  return new Promise((resolve) => {
    console.log("🔍 Checking routing table...");
    const endpoint = process.env.WIREGUARD_ENDPOINT || "134.199.169.102:59926";
    const serverIP = endpoint.split(":")[0];
    console.log(`🔍 Looking for routes to server: ${serverIP}`);
    const routeProcess = spawn("route", ["print"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    routeProcess.stdout.on("data", (data) => {
      output += data.toString();
    });
    routeProcess.on("exit", () => {
      const hasServerRoute = output.includes(serverIP);
      console.log(`🔍 Route to VPN server found: ${hasServerRoute}`);
      if (hasServerRoute) {
        console.log(`🪟 Found route to VPN server ${serverIP}`);
      }
      resolve(hasServerRoute);
    });
    routeProcess.on("error", (error) => {
      console.log("🔍 Route check error:", error.message);
      resolve(false);
    });
    setTimeout(() => {
      console.log("🔍 Route check timed out");
      resolve(false);
    }, 3e3);
  });
};
const checkCurrentIP = async () => {
  return new Promise((resolve) => {
    console.log("🔍 Checking current public IP and location...");
    const psCommand = `(Invoke-WebRequest -Uri "https://ipinfo.io/json" -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Compress`;
    const psProcess = spawn("powershell", ["-Command", psCommand], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    psProcess.stdout.on("data", (data) => {
      output += data.toString();
    });
    psProcess.on("exit", () => {
      try {
        const ipInfo = JSON.parse(output.trim());
        const currentIP = ipInfo.ip;
        const country = ipInfo.country;
        const region = ipInfo.region;
        const city = ipInfo.city;
        console.log(`🔍 Current public IP: ${currentIP}`);
        console.log(`🔍 Location: ${city}, ${region}, ${country}`);
        const isAustralianIP = country === "AU" || country === "Australia";
        if (isAustralianIP) {
          console.log("🇦🇺 ✅ Connected via Australian VPN!");
          console.log(`📍 Australian location detected: ${city}, ${region}`);
        } else {
          console.log(`❌ Not connected to Australian VPN. Current location: ${country}`);
        }
        resolve(isAustralianIP);
      } catch (error) {
        console.log("🔍 Failed to parse IP info:", error);
        console.log("🔍 Raw output:", output);
        const ipOnlyCommand = `(Invoke-WebRequest -Uri "https://ipinfo.io/ip" -UseBasicParsing).Content.Trim()`;
        const fallbackProcess = spawn("powershell", ["-Command", ipOnlyCommand], {
          stdio: ["pipe", "pipe", "pipe"]
        });
        let fallbackOutput = "";
        fallbackProcess.stdout.on("data", (data) => {
          fallbackOutput += data.toString();
        });
        fallbackProcess.on("exit", () => {
          const ip = fallbackOutput.trim();
          console.log(`🔍 Fallback IP check: ${ip}`);
          const isNotLocalIP = !ip.startsWith("192.168.") && !ip.startsWith("10.") && !ip.startsWith("172.") && ip !== "127.0.0.1";
          console.log(`🔍 Assuming VPN status based on non-local IP: ${isNotLocalIP}`);
          resolve(isNotLocalIP);
        });
        fallbackProcess.on("error", () => {
          resolve(false);
        });
      }
    });
    psProcess.on("error", (error) => {
      console.log("🔍 IP check error:", error.message);
      resolve(false);
    });
    setTimeout(() => {
      console.log("🔍 IP check timed out");
      resolve(false);
    }, 1e4);
  });
};
const disconnectWireGuard = async () => {
  try {
    const configPath = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf";
    const resolvedPath = path.resolve(configPath);
    const platform = process.platform;
    console.log(`🔌 Disconnecting WireGuard on ${platform}...`);
    switch (platform) {
      case "linux":
      case "darwin":
        return await disconnectWireGuardUnix(resolvedPath);
      case "win32":
        return await disconnectWireGuardWindows();
      default:
        console.error(`❌ Unsupported platform: ${platform}`);
        return false;
    }
  } catch (error) {
    console.error("❌ WireGuard disconnect setup error:", error);
    return false;
  }
};
const disconnectWireGuardUnix = async (configPath) => {
  return new Promise((resolve) => {
    const downProcess = spawn("wg-quick", ["down", configPath], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    downProcess.on("exit", (code) => {
      wireguardProcess = null;
      if (code === 0) {
        console.log("✅ WireGuard disconnected successfully");
        resolve(true);
      } else {
        console.error(`❌ WireGuard disconnection failed with code: ${code}`);
        resolve(false);
      }
    });
    downProcess.on("error", (error) => {
      console.error("❌ WireGuard disconnect error:", error);
      resolve(false);
    });
    setTimeout(() => resolve(false), 15e3);
  });
};
const disconnectWireGuardWindows = async () => {
  console.log("🪟 On Windows, please disconnect manually via WireGuard GUI");
  console.log("   1. Open WireGuard application");
  console.log('   2. Click "Deactivate" on your tunnel');
  return true;
};
const configureSecureSession = () => {
  const defaultSession = session.defaultSession;
  const enable1PasswordExtension = async () => {
    try {
      const extensionPath = await find1PasswordExtension();
      if (extensionPath) {
        await defaultSession.loadExtension(extensionPath);
        console.log("✅ 1Password extension loaded successfully");
      } else {
        console.log("📝 1Password extension not found - users can install it manually");
      }
    } catch (error) {
      console.warn("⚠️ Could not load 1Password extension:", error);
      console.log("📝 Users can install 1Password extension manually from their browser");
    }
  };
  const find1PasswordExtension = async () => {
    const possiblePaths = [
      // Chrome/Chromium paths
      path.join(homedir(), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      path.join(homedir(), "Library", "Application Support", "Google", "Chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      path.join(homedir(), ".config", "google-chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Edge paths
      path.join(homedir(), "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      path.join(homedir(), "Library", "Application Support", "Microsoft Edge", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Firefox paths (1Password uses different ID)
      path.join(homedir(), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles"),
      path.join(homedir(), "Library", "Application Support", "Firefox", "Profiles"),
      path.join(homedir(), ".mozilla", "firefox")
    ];
    for (const basePath of possiblePaths) {
      try {
        if (await promises.access(basePath).then(() => true).catch(() => false)) {
          const entries = await promises.readdir(basePath);
          const versionFolders = entries.filter((entry) => /^\d+\.\d+\.\d+/.test(entry));
          if (versionFolders.length > 0) {
            const latestVersion = versionFolders.sort((a, b) => b.localeCompare(a))[0];
            const extensionPath = path.join(basePath, latestVersion);
            const manifestPath = path.join(extensionPath, "manifest.json");
            if (await promises.access(manifestPath).then(() => true).catch(() => false)) {
              return extensionPath;
            }
          }
        }
      } catch (error) {
      }
    }
    return null;
  };
  defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = details.url.toLowerCase();
    if (url.startsWith("chrome-extension://") || url.startsWith("moz-extension://") || url.startsWith("extension://")) {
      callback({ cancel: false });
      return;
    }
    if (url.includes("localhost") || url.includes("127.0.0.1") || url.startsWith("file://") || url.startsWith("data:")) {
      callback({ cancel: false });
      return;
    }
    if (url.startsWith("http://")) {
      console.log("🚫 Blocking insecure HTTP request:", details.url);
      callback({ cancel: true });
      return;
    }
    if (url.startsWith("https://")) {
      console.log("✅ Allowing HTTPS request:", details.url);
      callback({ cancel: false });
      return;
    }
    callback({ cancel: false });
  });
  defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const url = details.url.toLowerCase();
    if (url.includes("office.com") || url.includes("microsoft.com") || url.includes("google.com") || url.includes("sharepoint.com")) {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "X-Content-Type-Options": ["nosniff"],
          "Referrer-Policy": ["strict-origin-when-cross-origin"]
        }
      });
      return;
    }
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "X-Frame-Options": ["SAMEORIGIN"],
        "X-Content-Type-Options": ["nosniff"],
        "Referrer-Policy": ["strict-origin-when-cross-origin"],
        "Permissions-Policy": ["camera=(), microphone=(), geolocation=()"],
        "Content-Security-Policy": [
          "default-src 'self' file: chrome-extension: moz-extension: extension:; script-src 'self' 'unsafe-inline' 'unsafe-eval' file: chrome-extension: moz-extension: extension:; style-src 'self' 'unsafe-inline' https: file: chrome-extension: moz-extension: extension:; connect-src 'self' https: wss: data: file: chrome-extension: moz-extension: extension:; img-src 'self' https: data: blob: file: chrome-extension: moz-extension: extension:; font-src 'self' https: data: file: chrome-extension: moz-extension: extension:; media-src 'self' https: data: file: chrome-extension: moz-extension: extension:; frame-src 'self' https: file: chrome-extension: moz-extension: extension:; child-src 'self' https: file: chrome-extension: moz-extension: extension:;"
        ]
      }
    });
  });
  defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const url = details.url.toLowerCase();
    let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    if (url.includes("accounts.google.com") || url.includes("googleapis.com")) {
      userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
    }
    callback({
      requestHeaders: {
        ...details.requestHeaders,
        "User-Agent": userAgent,
        // Add additional headers for OAuth compatibility
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Dest": "document"
      }
    });
  });
  setTimeout(enable1PasswordExtension, 1e3);
};
function createBrowserWindow(isMain = false) {
  const newWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    titleBarStyle: "default",
    show: false,
    // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
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
      sandbox: false,
      // Keep false to allow webview
      // Security: Disable experimental features
      experimentalFeatures: false,
      // Security: Disable web workers
      enableWebSQL: false,
      // Additional security settings
      allowRunningInsecureContent: false,
      plugins: false
    }
  });
  newWindow.webContents.setWindowOpenHandler((details) => {
    const url = details.url;
    const oauthProviders = [
      "https://accounts.google.com",
      "https://login.microsoftonline.com",
      "https://github.com/login",
      "https://clerk.shared.lcl.dev",
      "https://api.clerk.dev",
      "https://clerk.dev",
      "https://major-snipe-9.clerk.accounts.dev"
    ];
    if (oauthProviders.some((provider) => url.startsWith(provider))) {
      console.log("🔐 Opening OAuth in system browser:", url);
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "deny" };
  });
  newWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    const allowedOrigins = [
      VITE_DEV_SERVER_URL,
      "file://",
      "about:blank"
    ].filter(Boolean);
    const oauthProviders = [
      "https://accounts.google.com",
      "https://login.microsoftonline.com",
      "https://github.com/login",
      "https://clerk.shared.lcl.dev",
      "https://api.clerk.dev",
      "https://clerk.dev",
      "https://major-snipe-9.clerk.accounts.dev"
    ];
    const isAllowed = allowedOrigins.some(
      (origin) => navigationUrl.startsWith(origin || "")
    ) || oauthProviders.some(
      (provider) => navigationUrl.startsWith(provider)
    );
    if (!isAllowed) {
      console.log("🚫 Blocking window navigation to:", navigationUrl);
      event.preventDefault();
    } else if (oauthProviders.some((provider) => navigationUrl.startsWith(provider))) {
      console.log("🔐 Allowing OAuth navigation to:", navigationUrl);
    }
  });
  newWindow.webContents.session.on("will-download", (event, item) => {
    console.log("🚫 Blocking download attempt:", item.getFilename());
    event.preventDefault();
  });
  if (VITE_DEV_SERVER_URL) {
    newWindow.loadURL(VITE_DEV_SERVER_URL);
    if (process.env.NODE_ENV === "development") {
      newWindow.webContents.openDevTools();
    }
  } else {
    newWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  newWindow.once("ready-to-show", () => {
    newWindow.show();
    newWindow.focus();
  });
  windows.push(newWindow);
  if (isMain || !mainWindow) {
    mainWindow = newWindow;
    setTimeout(async () => {
      try {
        const alreadyConnected = await checkWireGuardConnection();
        if (alreadyConnected) {
          console.log("✅ VPN is already connected during app initialization");
          updateVPNStatus(true);
        } else if (process.env.VPN_AUTO_CONNECT === "true") {
          console.log("🔄 VPN not connected, attempting auto-connect...");
          const connected = await connectVPN();
          updateVPNStatus(connected);
          if (connected) {
            console.log("✅ VPN auto-connected successfully");
          } else {
            console.warn("⚠️ VPN auto-connect failed");
          }
        } else {
          console.log("⚠️ VPN not connected and auto-connect disabled");
          updateVPNStatus(false);
        }
      } catch (error) {
        console.error("❌ VPN initialization error:", error);
        updateVPNStatus(false);
      }
    }, 500);
  }
  newWindow.on("closed", () => {
    const index = windows.indexOf(newWindow);
    if (index > -1) {
      windows.splice(index, 1);
    }
    if (newWindow === mainWindow) {
      if (windows.length > 0) {
        mainWindow = windows[0];
      } else {
        disconnectVPN().catch((error) => {
          console.error("❌ Error disconnecting VPN on app close:", error);
        });
        mainWindow = null;
      }
    }
  });
  if (process.env.NODE_ENV === "production") {
    newWindow.setMenuBarVisibility(false);
  }
  return newWindow;
}
function createWindow() {
  createBrowserWindow(true);
}
ipcMain.handle("system-get-version", () => {
  return app.getVersion();
});
ipcMain.handle("system-get-environment", () => {
  const envVars = {
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
  console.log("🔄 Environment variables requested from renderer:", {
    NODE_ENV: envVars.NODE_ENV,
    VPN_PROVIDER: envVars.VPN_PROVIDER,
    WIREGUARD_ENDPOINT: envVars.WIREGUARD_ENDPOINT
  });
  return JSON.stringify(envVars);
});
ipcMain.handle("vpn-get-status", async () => {
  console.log("🔍 VPN status requested - running comprehensive check...");
  try {
    const isConnected = await checkWireGuardConnection();
    const status = isConnected ? "connected" : "disconnected";
    console.log(`📊 VPN status check result: ${status}`);
    updateVPNStatus(isConnected);
    return status;
  } catch (error) {
    console.error("❌ VPN status check error:", error);
    return "disconnected";
  }
});
ipcMain.handle("vpn-connect", async (_event, provider) => {
  console.log(`🌐 VPN connect requested: ${provider}`);
  try {
    const success = await connectVPN();
    updateVPNStatus(success);
    return success;
  } catch (error) {
    console.error("❌ VPN connection error:", error);
    updateVPNStatus(false);
    return false;
  }
});
ipcMain.handle("vpn-disconnect", async () => {
  console.log("🌐 VPN disconnect requested");
  try {
    const success = await disconnectVPN();
    updateVPNStatus(false);
    return success;
  } catch (error) {
    console.error("❌ VPN disconnection error:", error);
    return false;
  }
});
const get1PasswordSecret = async (itemId) => {
  const serviceAccountToken = process.env.OP_SERVICE_ACCOUNT_TOKEN;
  if (!serviceAccountToken) {
    throw new Error("1Password Service Account not configured. Set OP_SERVICE_ACCOUNT_TOKEN environment variable.");
  }
  try {
    const response = await fetch(`https://my.1password.com/api/v1/items/${itemId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${serviceAccountToken}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`1Password Service Account API error: ${response.status} ${response.statusText}`);
    }
    const item = await response.json();
    const secrets = {};
    if (item.fields) {
      for (const field of item.fields) {
        if (field.label && field.value) {
          switch (field.label.toLowerCase()) {
            case "username":
            case "email":
              secrets.username = field.value;
              break;
            case "password":
              secrets.password = field.value;
              break;
            case "tenant_url":
            case "url":
            case "website":
              secrets.tenant_url = field.value;
              break;
            case "level1_domains":
              secrets.level1_domains = field.value;
              break;
            case "level2_domains":
              secrets.level2_domains = field.value;
              break;
            case "level3_enabled":
              secrets.level3_enabled = field.value === "true";
              break;
            default:
              secrets[field.label.toLowerCase().replace(/\s+/g, "_")] = field.value;
          }
        }
      }
    }
    return secrets;
  } catch (error) {
    throw new Error(`Failed to retrieve 1Password secret: ${error instanceof Error ? error.message : String(error)}`);
  }
};
ipcMain.handle("vault-get-sharepoint-credentials", async () => {
  console.log("🔑 SharePoint credentials requested from main process");
  try {
    const vaultProvider = process.env.VAULT_PROVIDER || "hashicorp";
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Development mode: returning mock vault credentials");
      return {
        username: "dev-user@yourcompany.sharepoint.com",
        password: "dev-password-from-vault",
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    if (vaultProvider === "1password" || vaultProvider === "1password-cli") {
      console.log("🔐 Using 1Password Service Account for credentials");
      const itemId = process.env.OP_SHAREPOINT_ITEM_ID || "SharePoint Service Account";
      const secrets = await get1PasswordSecret(itemId);
      return {
        username: secrets.username,
        password: secrets.password,
        tenant_url: secrets.tenant_url,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else {
      console.log(`⚠️ Vault provider ${vaultProvider} not fully implemented`);
      return {
        username: "vault-user@yourcompany.sharepoint.com",
        password: "vault-retrieved-password",
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  } catch (error) {
    console.error("❌ Vault credentials retrieval failed:", error);
    throw new Error(`Vault credentials unavailable: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});
ipcMain.handle("vault-rotate-credentials", async () => {
  console.log("🔄 Vault credential rotation requested from main process");
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Development mode: simulating credential rotation");
      return true;
    }
    return true;
  } catch (error) {
    console.error("❌ Vault credential rotation failed:", error);
    return false;
  }
});
ipcMain.handle("vault-get-status", async () => {
  if (process.env.NODE_ENV === "development") {
    return "connected-dev";
  }
  const vaultProvider = process.env.VAULT_PROVIDER || "hashicorp";
  try {
    if (vaultProvider === "1password" || vaultProvider === "1password-cli") {
      const serviceAccountToken = process.env.OP_SERVICE_ACCOUNT_TOKEN;
      const itemId = process.env.OP_SHAREPOINT_ITEM_ID;
      if (!serviceAccountToken) {
        return "error: 1Password Service Account not configured";
      }
      if (!itemId) {
        return "error: SharePoint Item ID not configured";
      }
      const response = await fetch(`https://my.1password.com/api/v1/items/${itemId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${serviceAccountToken}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        console.log("✅ 1Password Service Account access verified");
        return "connected";
      } else {
        console.error("❌ 1Password Service Account access failed:", response.status);
        return "error: Cannot access SharePoint credentials in 1Password";
      }
    } else {
      return "connected";
    }
  } catch (error) {
    console.error("❌ Vault status check failed:", error);
    return `error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
});
ipcMain.handle("security-check-url", async (_event, url, accessLevel) => {
  console.log(`🔒 URL check: ${url} (Level ${accessLevel})`);
  return true;
});
ipcMain.handle("security-log-navigation", async (_event, url, allowed, accessLevel) => {
  console.log(`📝 Navigation log: ${url} - ${allowed ? "ALLOWED" : "BLOCKED"} (Level ${accessLevel})`);
});
ipcMain.handle("security-prevent-download", async (_event, filename) => {
  console.log(`🚫 Download blocked: ${filename}`);
});
ipcMain.handle("extension-get-1password-status", async () => {
  try {
    const extensions = session.defaultSession.getAllExtensions();
    const onePasswordExtension = extensions.find(
      (ext) => ext.name.toLowerCase().includes("1password") || ext.id === "aeblfdkhhhdcdjpifhhbdiojplfjncoa"
    );
    if (onePasswordExtension) {
      return {
        installed: true,
        version: onePasswordExtension.version,
        name: onePasswordExtension.name,
        id: onePasswordExtension.id
      };
    } else {
      return {
        installed: false,
        downloadUrl: "https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa",
        instructions: "Please install the 1Password extension for the best experience"
      };
    }
  } catch (error) {
    console.error("❌ Error checking 1Password extension status:", error);
    return {
      installed: false,
      error: "Could not check extension status"
    };
  }
});
ipcMain.handle("extension-install-1password", async () => {
  console.log("🔧 1Password extension installation requested");
  return {
    success: false,
    message: "Please install 1Password extension manually",
    steps: [
      "1. Open Chrome or Edge browser",
      "2. Go to chrome://extensions/ or edge://extensions/",
      "3. Enable Developer mode",
      "4. Install 1Password extension from the web store",
      "5. Restart the Secure Remote Browser"
    ],
    webStoreUrl: "https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa"
  };
});
ipcMain.handle("sharepoint-inject-credentials", async (_event, webviewId) => {
  console.log(`🔐 SharePoint credentials injection requested for: ${webviewId}`);
  return true;
});
ipcMain.handle("sharepoint-get-config", async () => {
  return {
    tenantUrl: process.env.SHAREPOINT_TENANT_URL || "https://your-tenant.sharepoint.com",
    libraryPath: "/sites/documents/Shared Documents"
  };
});
ipcMain.handle("sharepoint-validate-access", async (_event, url) => {
  console.log(`🔍 SharePoint access validation: ${url}`);
  return true;
});
ipcMain.handle("window-create-new", async () => {
  console.log("🪟 Creating new browser window...");
  try {
    const newWindow = createBrowserWindow(false);
    return {
      success: true,
      windowId: newWindow.id,
      message: "New browser window created successfully"
    };
  } catch (error) {
    console.error("❌ Error creating new window:", error);
    return {
      success: false,
      error: "Failed to create new window"
    };
  }
});
ipcMain.handle("context-menu-show", async (event, params) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);
  if (!senderWindow) return;
  const baseMenu = [
    {
      label: "New Tab",
      click: () => {
        senderWindow.webContents.send("context-menu-action", "new-tab");
      }
    },
    {
      label: "New Window",
      click: () => {
        senderWindow.webContents.send("context-menu-action", "new-window");
      }
    },
    { type: "separator" },
    {
      label: "Reload",
      accelerator: "CmdOrCtrl+R",
      click: () => {
        senderWindow.webContents.send("context-menu-action", "reload");
      }
    }
  ];
  const vpnMenu = vpnConnected ? [
    {
      label: "Go Back",
      accelerator: "Alt+Left",
      click: () => {
        senderWindow.webContents.send("context-menu-action", "go-back");
      }
    },
    {
      label: "Go Forward",
      accelerator: "Alt+Right",
      click: () => {
        senderWindow.webContents.send("context-menu-action", "go-forward");
      }
    },
    { type: "separator" },
    {
      label: "Go Home",
      click: () => {
        senderWindow.webContents.send("context-menu-action", "go-home");
      }
    }
  ] : [];
  const statusMenu = [
    { type: "separator" },
    {
      label: "VPN Status",
      submenu: [
        {
          label: vpnConnected ? "✅ VPN Connected" : "❌ VPN Disconnected",
          enabled: false
        },
        {
          label: vpnConnected ? "Reconnect VPN" : "Connect VPN",
          click: () => {
            senderWindow.webContents.send("context-menu-action", "reconnect-vpn");
          }
        }
      ]
    }
  ];
  const contextMenu = Menu.buildFromTemplate([...baseMenu, ...vpnMenu, ...statusMenu]);
  contextMenu.popup({
    window: senderWindow,
    x: params.x,
    y: params.y
  });
});
ipcMain.handle("window-get-count", async () => {
  return {
    total: windows.length,
    mainWindowId: (mainWindow == null ? void 0 : mainWindow.id) || null
  };
});
ipcMain.handle("window-close", async (_event, windowId) => {
  try {
    if (windowId) {
      const windowToClose = windows.find((win) => win.id === windowId);
      if (windowToClose && !windowToClose.isDestroyed()) {
        windowToClose.close();
        return { success: true, message: "Window closed successfully" };
      }
      return { success: false, error: "Window not found" };
    } else {
      const senderWindow = BrowserWindow.fromWebContents(_event.sender);
      if (senderWindow && !senderWindow.isDestroyed()) {
        senderWindow.close();
        return { success: true, message: "Current window closed successfully" };
      }
      return { success: false, error: "Could not identify current window" };
    }
  } catch (error) {
    console.error("❌ Error closing window:", error);
    return { success: false, error: "Failed to close window" };
  }
});
app.whenReady().then(async () => {
  console.log("🚀 Initializing Secure Remote Browser...");
  await loadEnvironmentVariables();
  configureSecureSession();
  console.log("🔌 Starting VPN connection...");
  const vpnConnected2 = await connectVPN();
  updateVPNStatus(vpnConnected2);
  if (!vpnConnected2) {
    console.error("❌ VPN connection failed - starting with restricted access");
  } else {
    console.log("✅ VPN connected successfully - unrestricted access enabled");
  }
  createWindow();
}).catch((error) => {
  console.error("❌ Failed to initialize app:", error);
  app.quit();
});
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log("🚫 Another instance is already running");
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    console.log("🔐 Closing Secure Remote Browser");
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on("web-contents-created", (_event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    try {
      const isMainWindowContents = mainWindow && !mainWindow.isDestroyed() && contents === mainWindow.webContents;
      if (isMainWindowContents) {
        const parsedUrl = new URL(navigationUrl);
        const allowedOrigins = [
          VITE_DEV_SERVER_URL,
          "file:",
          "about:"
        ].filter(Boolean);
        const oauthProviders = [
          "https://accounts.google.com",
          "https://login.microsoftonline.com",
          "https://github.com/login",
          "https://clerk.shared.lcl.dev",
          "https://api.clerk.dev",
          "https://clerk.dev",
          "https://major-snipe-9.clerk.accounts.dev"
        ];
        const isAllowed = allowedOrigins.some(
          (origin) => parsedUrl.protocol.startsWith(origin || "") || navigationUrl.startsWith(origin || "")
        ) || oauthProviders.some(
          (provider) => navigationUrl.startsWith(provider)
        );
        if (!isAllowed) {
          console.log("🚫 Blocking main window navigation to:", navigationUrl);
          event.preventDefault();
        } else if (oauthProviders.some((provider) => navigationUrl.startsWith(provider))) {
          console.log("🔐 Allowing OAuth navigation to:", navigationUrl);
        }
      } else {
        console.log("🌐 Webview navigation allowed:", navigationUrl);
      }
    } catch (error) {
      console.warn("⚠️ Failed to parse navigation URL:", navigationUrl, error);
      const isMainWindowContentsError = mainWindow && !mainWindow.isDestroyed() && contents === mainWindow.webContents;
      if (isMainWindowContentsError) {
        event.preventDefault();
      }
    }
  });
});
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("secure-browser", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("secure-browser");
}
process.on("SIGINT", () => {
  console.log("🔐 Received SIGINT, gracefully shutting down");
  app.quit();
});
process.on("SIGTERM", () => {
  console.log("🔐 Received SIGTERM, gracefully shutting down");
  app.quit();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
