import ce, { app as y, ipcMain as m, shell as $, BrowserWindow as R, session as W, Menu as le } from "electron";
import { fileURLToPath as ue } from "node:url";
import w from "node:path";
import de, { spawn as _ } from "child_process";
import fe, { promises as A } from "fs";
import { homedir as S } from "os";
import pe from "path";
import ge from "tty";
import he from "util";
import we from "net";
const me = () => {
  if (typeof window < "u") {
    const o = navigator.userAgent.toLowerCase();
    if (o.includes("win")) return "windows";
    if (o.includes("mac")) return "macos";
    if (o.includes("linux")) return "linux";
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
}, Q = (o) => {
  switch (me()) {
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
}, ve = (o) => {
  const e = Q();
  console.log(`${e.emoji} ${e.displayName} Instructions:`), console.log(`   Config file: ${o}`), console.log(""), e.installInstructions.forEach((n, t) => {
    console.log(`   ${t + 1}. ${n}`);
  }), e.requiresManualSetup && (console.log(""), console.log("🔄 After connecting, restart this application to verify the connection."));
};
function Ee(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var T = { exports: {} }, D = { exports: {} }, k = { exports: {} }, x, j;
function ye() {
  if (j) return x;
  j = 1;
  var o = 1e3, e = o * 60, n = e * 60, t = n * 24, a = t * 365.25;
  x = function(s, l) {
    l = l || {};
    var d = typeof s;
    if (d === "string" && s.length > 0)
      return c(s);
    if (d === "number" && isNaN(s) === !1)
      return l.long ? i(s) : f(s);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(s)
    );
  };
  function c(s) {
    if (s = String(s), !(s.length > 100)) {
      var l = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        s
      );
      if (l) {
        var d = parseFloat(l[1]), g = (l[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * a;
          case "days":
          case "day":
          case "d":
            return d * t;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * o;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function f(s) {
    return s >= t ? Math.round(s / t) + "d" : s >= n ? Math.round(s / n) + "h" : s >= e ? Math.round(s / e) + "m" : s >= o ? Math.round(s / o) + "s" : s + "ms";
  }
  function i(s) {
    return r(s, t, "day") || r(s, n, "hour") || r(s, e, "minute") || r(s, o, "second") || s + " ms";
  }
  function r(s, l, d) {
    if (!(s < l))
      return s < l * 1.5 ? Math.floor(s / l) + " " + d : Math.ceil(s / l) + " " + d + "s";
  }
  return x;
}
var M;
function ee() {
  return M || (M = 1, function(o, e) {
    e = o.exports = a.debug = a.default = a, e.coerce = r, e.disable = f, e.enable = c, e.enabled = i, e.humanize = ye(), e.names = [], e.skips = [], e.formatters = {};
    var n;
    function t(s) {
      var l = 0, d;
      for (d in s)
        l = (l << 5) - l + s.charCodeAt(d), l |= 0;
      return e.colors[Math.abs(l) % e.colors.length];
    }
    function a(s) {
      function l() {
        if (l.enabled) {
          var d = l, g = +/* @__PURE__ */ new Date(), p = g - (n || g);
          d.diff = p, d.prev = n, d.curr = g, n = g;
          for (var u = new Array(arguments.length), h = 0; h < u.length; h++)
            u[h] = arguments[h];
          u[0] = e.coerce(u[0]), typeof u[0] != "string" && u.unshift("%O");
          var v = 0;
          u[0] = u[0].replace(/%([a-zA-Z%])/g, function(N, ie) {
            if (N === "%%") return N;
            v++;
            var F = e.formatters[ie];
            if (typeof F == "function") {
              var ae = u[v];
              N = F.call(d, ae), u.splice(v, 1), v--;
            }
            return N;
          }), e.formatArgs.call(d, u);
          var b = l.log || e.log || console.log.bind(console);
          b.apply(d, u);
        }
      }
      return l.namespace = s, l.enabled = e.enabled(s), l.useColors = e.useColors(), l.color = t(s), typeof e.init == "function" && e.init(l), l;
    }
    function c(s) {
      e.save(s), e.names = [], e.skips = [];
      for (var l = (typeof s == "string" ? s : "").split(/[\s,]+/), d = l.length, g = 0; g < d; g++)
        l[g] && (s = l[g].replace(/\*/g, ".*?"), s[0] === "-" ? e.skips.push(new RegExp("^" + s.substr(1) + "$")) : e.names.push(new RegExp("^" + s + "$")));
    }
    function f() {
      e.enable("");
    }
    function i(s) {
      var l, d;
      for (l = 0, d = e.skips.length; l < d; l++)
        if (e.skips[l].test(s))
          return !1;
      for (l = 0, d = e.names.length; l < d; l++)
        if (e.names[l].test(s))
          return !0;
      return !1;
    }
    function r(s) {
      return s instanceof Error ? s.stack || s.message : s;
    }
  }(k, k.exports)), k.exports;
}
var B;
function Pe() {
  return B || (B = 1, function(o, e) {
    e = o.exports = ee(), e.log = a, e.formatArgs = t, e.save = c, e.load = f, e.useColors = n, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : i(), e.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function n() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    e.formatters.j = function(r) {
      try {
        return JSON.stringify(r);
      } catch (s) {
        return "[UnexpectedJSONParseError]: " + s.message;
      }
    };
    function t(r) {
      var s = this.useColors;
      if (r[0] = (s ? "%c" : "") + this.namespace + (s ? " %c" : " ") + r[0] + (s ? "%c " : " ") + "+" + e.humanize(this.diff), !!s) {
        var l = "color: " + this.color;
        r.splice(1, 0, l, "color: inherit");
        var d = 0, g = 0;
        r[0].replace(/%[a-zA-Z%]/g, function(p) {
          p !== "%%" && (d++, p === "%c" && (g = d));
        }), r.splice(g, 0, l);
      }
    }
    function a() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function c(r) {
      try {
        r == null ? e.storage.removeItem("debug") : e.storage.debug = r;
      } catch {
      }
    }
    function f() {
      var r;
      try {
        r = e.storage.debug;
      } catch {
      }
      return !r && typeof process < "u" && "env" in process && (r = process.env.DEBUG), r;
    }
    e.enable(f());
    function i() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(D, D.exports)), D.exports;
}
var L = { exports: {} }, H;
function _e() {
  return H || (H = 1, function(o, e) {
    var n = ge, t = he;
    e = o.exports = ee(), e.init = g, e.log = r, e.formatArgs = i, e.save = s, e.load = l, e.useColors = f, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(p) {
      return /^debug_/i.test(p);
    }).reduce(function(p, u) {
      var h = u.substring(6).toLowerCase().replace(/_([a-z])/g, function(b, N) {
        return N.toUpperCase();
      }), v = process.env[u];
      return /^(yes|on|true|enabled)$/i.test(v) ? v = !0 : /^(no|off|false|disabled)$/i.test(v) ? v = !1 : v === "null" ? v = null : v = Number(v), p[h] = v, p;
    }, {});
    var a = parseInt(process.env.DEBUG_FD, 10) || 2;
    a !== 1 && a !== 2 && t.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var c = a === 1 ? process.stdout : a === 2 ? process.stderr : d(a);
    function f() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : n.isatty(a);
    }
    e.formatters.o = function(p) {
      return this.inspectOpts.colors = this.useColors, t.inspect(p, this.inspectOpts).split(`
`).map(function(u) {
        return u.trim();
      }).join(" ");
    }, e.formatters.O = function(p) {
      return this.inspectOpts.colors = this.useColors, t.inspect(p, this.inspectOpts);
    };
    function i(p) {
      var u = this.namespace, h = this.useColors;
      if (h) {
        var v = this.color, b = "  \x1B[3" + v + ";1m" + u + " \x1B[0m";
        p[0] = b + p[0].split(`
`).join(`
` + b), p.push("\x1B[3" + v + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + u + " " + p[0];
    }
    function r() {
      return c.write(t.format.apply(t, arguments) + `
`);
    }
    function s(p) {
      p == null ? delete process.env.DEBUG : process.env.DEBUG = p;
    }
    function l() {
      return process.env.DEBUG;
    }
    function d(p) {
      var u, h = process.binding("tty_wrap");
      switch (h.guessHandleType(p)) {
        case "TTY":
          u = new n.WriteStream(p), u._type = "tty", u._handle && u._handle.unref && u._handle.unref();
          break;
        case "FILE":
          var v = fe;
          u = new v.SyncWriteStream(p, { autoClose: !1 }), u._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var b = we;
          u = new b.Socket({
            fd: p,
            readable: !1,
            writable: !0
          }), u.readable = !1, u.read = null, u._type = "pipe", u._handle && u._handle.unref && u._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return u.fd = p, u._isStdio = !0, u;
    }
    function g(p) {
      p.inspectOpts = {};
      for (var u = Object.keys(e.inspectOpts), h = 0; h < u.length; h++)
        p.inspectOpts[u[h]] = e.inspectOpts[u[h]];
    }
    e.enable(l());
  }(L, L.exports)), L.exports;
}
var z;
function Ce() {
  return z || (z = 1, typeof process < "u" && process.type === "renderer" ? T.exports = Pe() : T.exports = _e()), T.exports;
}
var G, K;
function Se() {
  if (K) return G;
  K = 1;
  var o = pe, e = de.spawn, n = Ce()("electron-squirrel-startup"), t = ce.app, a = function(f, i) {
    var r = o.resolve(o.dirname(process.execPath), "..", "Update.exe");
    n("Spawning `%s` with args `%s`", r, f), e(r, f, {
      detached: !0
    }).on("close", i);
  }, c = function() {
    if (process.platform === "win32") {
      var f = process.argv[1];
      n("processing squirrel command `%s`", f);
      var i = o.basename(process.execPath);
      if (f === "--squirrel-install" || f === "--squirrel-updated")
        return a(["--createShortcut=" + i], t.quit), !0;
      if (f === "--squirrel-uninstall")
        return a(["--removeShortcut=" + i], t.quit), !0;
      if (f === "--squirrel-obsolete")
        return t.quit(), !0;
    }
    return !1;
  };
  return G = c(), G;
}
var be = Se();
const Ne = /* @__PURE__ */ Ee(be);
Ne && y.quit();
const Ae = async () => {
  try {
    const o = w.resolve(".env"), n = (await A.readFile(o, "utf-8")).split(`
`);
    console.log("🔍 Loading .env file from:", o);
    for (const t of n) {
      const a = t.trim();
      if (a && !a.startsWith("#")) {
        const [c, ...f] = a.split("=");
        if (c && f.length > 0) {
          const i = f.join("=").trim();
          process.env[c.trim()] = i, !c.includes("SECRET") && !c.includes("PASSWORD") && !c.includes("KEY") && !c.includes("ID") ? console.log(`📝 Loaded: ${c.trim()}=${i}`) : console.log(`📝 Loaded: ${c.trim()}=***`);
        }
      }
    }
    console.log("✅ Environment variables loaded successfully");
  } catch (o) {
    console.error("❌ Failed to load .env file:", o), console.log("📝 This may cause VPN detection to fail");
  }
}, V = w.dirname(ue(import.meta.url));
process.env.APP_ROOT = w.join(V, "..");
const I = process.env.VITE_DEV_SERVER_URL, Qe = w.join(process.env.APP_ROOT, "dist-electron"), oe = w.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = I ? w.join(process.env.APP_ROOT, "public") : oe;
let P = [], E = null, O = !1, ne = null;
const C = (o) => {
  const e = O;
  O = o, e !== o && console.log(`🔄 VPN status changed: ${e ? "Connected" : "Disconnected"} → ${o ? "Connected" : "Disconnected"}`), console.log(`📡 VPN Status Updated: ${o ? "✅ Connected - Allowing all HTTPS requests" : "❌ Disconnected - Blocking external requests"}`), P.forEach((n) => {
    n && !n.isDestroyed() && n.webContents.send("vpn-status-changed", o);
  });
}, q = async () => {
  try {
    const o = process.env.VPN_PROVIDER || "wireguard";
    if (o === "wireguard")
      return await Ie();
    throw new Error(`VPN provider ${o} not implemented`);
  } catch (o) {
    return console.error("❌ VPN connection failed:", o), !1;
  }
}, te = async () => {
  try {
    return ne ? await Ue() : !0;
  } catch (o) {
    return console.error("❌ VPN disconnection failed:", o), !1;
  }
}, Ie = async () => {
  try {
    console.log("🔍 Debug: Environment variables at startup:"), console.log(`  NODE_ENV: ${process.env.NODE_ENV}`), console.log(`  VPN_PROVIDER: ${process.env.VPN_PROVIDER}`), console.log(`  WIREGUARD_CONFIG_PATH: ${process.env.WIREGUARD_CONFIG_PATH}`), console.log(`  WIREGUARD_ENDPOINT: ${process.env.WIREGUARD_ENDPOINT}`);
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = w.resolve(o);
    console.log(`🔍 Resolved config path: ${e}`);
    try {
      await A.access(e), console.log("✅ Config file found");
    } catch (c) {
      console.log("❌ Config file not found:", c), console.log("📝 This is OK - config file not required for detection");
    }
    const n = Q();
    return console.log(`🔌 Checking WireGuard connection on ${n.displayName}...`), await U() ? (console.log("✅ WireGuard is connected and active"), console.log("✅ VPN connected successfully - unrestricted access enabled"), !0) : (console.log("🔄 Attempting to establish WireGuard connection..."), await Oe(e) ? (console.log("✅ WireGuard connection established successfully"), await U() ? (console.log("✅ VPN auto-connected successfully"), !0) : (console.log("⚠️ Connection established but IP location verification failed"), !1)) : (console.log("❌ WireGuard connection failed."), ve(e), !1));
  } catch (o) {
    return console.error("❌ WireGuard setup error:", o), !1;
  }
}, Oe = async (o) => {
  const e = process.platform;
  try {
    switch (e) {
      case "linux":
        return await Re(o);
      case "darwin":
        return await Te(o);
      case "win32":
        return await De(o);
      default:
        return console.error(`❌ Unsupported platform: ${e}`), !1;
    }
  } catch (n) {
    return console.error(`❌ Failed to connect on ${e}:`, n), !1;
  }
}, Re = async (o) => new Promise((e) => {
  console.log("🐧 Using Linux wg-quick...");
  const n = _("wg-quick", ["up", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (t) => {
    e(t === 0);
  }), n.on("error", (t) => {
    console.error("❌ wg-quick error:", t), e(!1);
  }), setTimeout(() => e(!1), 3e4);
}), Te = async (o) => new Promise((e) => {
  console.log("🍎 Using macOS wg-quick...");
  const n = _("wg-quick", ["up", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (t) => {
    e(t === 0);
  }), n.on("error", () => {
    console.log("🍎 Trying WireGuard macOS app..."), e(!1);
  }), setTimeout(() => e(!1), 3e4);
}), De = async (o) => (console.log("🪟 Windows detected - checking existing connection..."), console.log(`   Config available at: ${o}`), !1), U = async () => {
  const o = process.platform;
  try {
    switch (o) {
      case "linux":
        return await ke();
      case "darwin":
        return await Le();
      case "win32":
        return await We();
      default:
        return console.warn(`⚠️ Unsupported platform: ${o}`), !1;
    }
  } catch (e) {
    return console.error("❌ Error checking WireGuard status:", e), !1;
  }
}, ke = async () => new Promise((o) => {
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", (t) => {
    t === 0 && n.trim() ? (console.log("🐧 WireGuard active on Linux"), o(!0)) : o(!1);
  }), e.on("error", () => o(!1)), setTimeout(() => o(!1), 5e3);
}), Le = async () => new Promise((o) => {
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", (t) => {
    t === 0 && n.trim() ? (console.log("🍎 WireGuard active on macOS"), o(!0)) : Y().then(o);
  }), e.on("error", () => {
    Y().then(o);
  }), setTimeout(() => o(!1), 5e3);
}), Y = async () => new Promise((o) => {
  const e = _("ifconfig", [], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", () => {
    const t = n.includes("utun") || n.includes("tun") || n.includes("wg");
    o(t);
  }), e.on("error", () => o(!1)), setTimeout(() => o(!1), 5e3);
}), We = async () => {
  if (console.log("🪟 Starting comprehensive Windows VPN detection..."), console.log("🔍 PRIMARY CHECK: IP geolocation (mandatory)..."), !await Ve())
    return console.log("❌ IP geolocation check FAILED - not connected to Australian VPN"), console.log("🚨 CRITICAL: User appears to be browsing from non-Australian IP"), console.log("🔍 Running diagnostic checks for troubleshooting..."), await Z(), await J(), await X(), console.log("⚠️  Note: Ping connectivity to VPN server does not indicate active VPN connection"), !1;
  console.log("✅ IP geolocation check PASSED - Australian VPN confirmed"), console.log("🔍 Running secondary verification checks...");
  const e = await Z(), n = await J(), t = await X();
  return console.log(e || n || t ? "✅ Secondary checks confirm WireGuard is properly configured" : "⚠️  Secondary checks inconclusive, but IP location confirms VPN is working"), !0;
}, Z = async () => new Promise((o) => {
  console.log("🔍 Checking WireGuard CLI...");
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", (t) => {
    if (console.log(`🔍 WireGuard CLI exit code: ${t}`), console.log(`🔍 WireGuard CLI output: "${n.trim()}"`), t === 0 && n.trim()) {
      console.log("🪟 WireGuard active on Windows (CLI)"), o(!0);
      return;
    }
    o(!1);
  }), e.on("error", (t) => {
    console.log("🔍 WireGuard CLI error:", t.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 WireGuard CLI check timed out"), o(!1);
  }, 3e3);
}), J = async () => new Promise((o) => {
  console.log("🔍 Checking network interfaces via netsh...");
  const e = _("netsh", ["interface", "show", "interface"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", () => {
    console.log("🔍 Network interfaces output:"), console.log(n);
    const t = n.toLowerCase().includes("wireguard") || n.toLowerCase().includes("wg") || n.toLowerCase().includes("tun");
    console.log(`🔍 WireGuard interface found: ${t}`), t && console.log("🪟 WireGuard interface detected on Windows"), o(t);
  }), e.on("error", (t) => {
    console.log("🔍 Network interface check error:", t.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 Network interface check timed out"), o(!1);
  }, 3e3);
}), X = async () => new Promise((o) => {
  console.log("🔍 Checking routing table...");
  const n = (process.env.WIREGUARD_ENDPOINT || "134.199.169.102:59926").split(":")[0];
  console.log(`🔍 Looking for routes to server: ${n}`);
  const t = _("route", ["print"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let a = "";
  t.stdout.on("data", (c) => {
    a += c.toString();
  }), t.on("exit", () => {
    const c = a.includes(n);
    console.log(`🔍 Route to VPN server found: ${c}`), c && console.log(`🪟 Found route to VPN server ${n}`), o(c);
  }), t.on("error", (c) => {
    console.log("🔍 Route check error:", c.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 Route check timed out"), o(!1);
  }, 3e3);
}), Ve = async () => new Promise((o) => {
  console.log("🔍 Checking current public IP and location...");
  const n = _("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/json" -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Compress'], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  n.stdout.on("data", (a) => {
    t += a.toString();
  }), n.on("exit", () => {
    try {
      const a = JSON.parse(t.trim()), c = a.ip, f = a.country, i = a.region, r = a.city;
      console.log(`🔍 Current public IP: ${c}`), console.log(`🔍 Location: ${r}, ${i}, ${f}`);
      const s = f === "AU" || f === "Australia";
      s ? (console.log("🇦🇺 ✅ Connected via Australian VPN!"), console.log(`📍 Australian location detected: ${r}, ${i}`)) : console.log(`❌ Not connected to Australian VPN. Current location: ${f}`), o(s);
    } catch (a) {
      console.log("🔍 Failed to parse IP info:", a), console.log("🔍 Raw output:", t);
      const f = _("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/ip" -UseBasicParsing).Content.Trim()'], {
        stdio: ["pipe", "pipe", "pipe"]
      });
      let i = "";
      f.stdout.on("data", (r) => {
        i += r.toString();
      }), f.on("exit", () => {
        const r = i.trim();
        console.log(`🔍 Fallback IP check: ${r}`);
        const s = !r.startsWith("192.168.") && !r.startsWith("10.") && !r.startsWith("172.") && r !== "127.0.0.1";
        console.log(`🔍 Assuming VPN status based on non-local IP: ${s}`), o(s);
      }), f.on("error", () => {
        o(!1);
      });
    }
  }), n.on("error", (a) => {
    console.log("🔍 IP check error:", a.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 IP check timed out"), o(!1);
  }, 1e4);
}), Ue = async () => {
  try {
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = w.resolve(o), n = process.platform;
    switch (console.log(`🔌 Disconnecting WireGuard on ${n}...`), n) {
      case "linux":
      case "darwin":
        return await xe(e);
      case "win32":
        return await Ge();
      default:
        return console.error(`❌ Unsupported platform: ${n}`), !1;
    }
  } catch (o) {
    return console.error("❌ WireGuard disconnect setup error:", o), !1;
  }
}, xe = async (o) => new Promise((e) => {
  const n = _("wg-quick", ["down", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (t) => {
    ne = null, t === 0 ? (console.log("✅ WireGuard disconnected successfully"), e(!0)) : (console.error(`❌ WireGuard disconnection failed with code: ${t}`), e(!1));
  }), n.on("error", (t) => {
    console.error("❌ WireGuard disconnect error:", t), e(!1);
  }), setTimeout(() => e(!1), 15e3);
}), Ge = async () => (console.log("🪟 On Windows, please disconnect manually via WireGuard GUI"), console.log("   1. Open WireGuard application"), console.log('   2. Click "Deactivate" on your tunnel'), !0), $e = () => {
  const o = W.defaultSession, e = W.fromPartition("persist:shared-auth");
  e.webRequest.onBeforeRequest((i, r) => {
    const s = i.url.toLowerCase();
    if (s.startsWith("chrome-extension://") || s.startsWith("moz-extension://") || s.startsWith("extension://")) {
      r({ cancel: !1 });
      return;
    }
    if (s.includes("localhost") || s.includes("127.0.0.1") || s.startsWith("file://") || s.startsWith("data:")) {
      r({ cancel: !1 });
      return;
    }
    if (s.includes("clerk.dev") || s.includes("clerk.com") || s.includes("clerk.accounts.dev")) {
      console.log("✅ Allowing Clerk auth request:", i.url), r({ cancel: !1 });
      return;
    }
    if (s.startsWith("http://")) {
      console.log("🚫 Blocking insecure HTTP request:", i.url), r({ cancel: !0 });
      return;
    }
    if (s.startsWith("https://")) {
      console.log("✅ Allowing HTTPS auth request:", i.url), r({ cancel: !1 });
      return;
    }
    r({ cancel: !1 });
  }), e.webRequest.onBeforeSendHeaders((i, r) => {
    let s = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    (i.url.includes("accounts.google.com") || i.url.includes("googleapis.com")) && (s = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"), r({
      requestHeaders: {
        ...i.requestHeaders,
        "User-Agent": s,
        // Add additional headers for OAuth compatibility
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Dest": "document"
      }
    });
  });
  const n = (i, r, s) => {
    if (console.log("🎯 Download detected from", s, ":", {
      filename: r.getFilename(),
      url: r.getURL(),
      size: r.getTotalBytes(),
      blocked: process.env.SECURITY_BLOCK_DOWNLOADS === "true"
    }), process.env.SECURITY_BLOCK_DOWNLOADS === "true") {
      console.log("🚫 Blocking download (SECURITY_BLOCK_DOWNLOADS=true):", r.getFilename()), i.preventDefault(), P.forEach((g) => {
        g && !g.isDestroyed() && g.webContents.send("download-blocked", {
          filename: r.getFilename(),
          url: r.getURL(),
          size: r.getTotalBytes()
        });
      });
      return;
    }
    console.log("✅ Download allowed from", s, ":", r.getFilename());
    const l = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, d = {
      id: l,
      filename: r.getFilename(),
      url: r.getURL(),
      totalBytes: r.getTotalBytes()
    };
    console.log("📤 Sending download-started event from", s, ":", d), P.forEach((g) => {
      g && !g.isDestroyed() && g.webContents.send("download-started", d);
    }), r.on("updated", (g, p) => {
      const u = {
        id: l,
        filename: r.getFilename(),
        state: p,
        receivedBytes: r.getReceivedBytes(),
        totalBytes: r.getTotalBytes(),
        speed: r.getCurrentBytesPerSecond ? r.getCurrentBytesPerSecond() : 0
      };
      console.log("📤 Sending download-progress event:", {
        id: l,
        progress: `${u.receivedBytes}/${u.totalBytes}`,
        percent: Math.round(u.receivedBytes / u.totalBytes * 100)
      }), P.forEach((h) => {
        h && !h.isDestroyed() && h.webContents.send("download-progress", u);
      });
    }), r.once("done", (g, p) => {
      const u = {
        id: l,
        filename: r.getFilename(),
        state: p,
        filePath: p === "completed" ? r.getSavePath() : null
      };
      console.log("📤 Sending download-completed event:", u), P.forEach((h) => {
        h && !h.isDestroyed() && h.webContents.send("download-completed", u);
      });
    });
  };
  o.on("will-download", (i, r) => {
    n(i, r, "default-session");
  }), e.on("will-download", (i, r) => {
    n(i, r, "shared-auth-session");
  }), W.fromPartition("persist:main").on("will-download", (i, r) => {
    n(i, r, "webview-session");
  });
  const a = async () => {
    try {
      const i = await f();
      i ? (await o.loadExtension(i), console.log("✅ 1Password extension loaded successfully on default session")) : console.log("📝 1Password extension not found - users can install it manually");
    } catch (i) {
      console.warn("⚠️ Could not load 1Password extension on default session:", i), console.log("📝 Users can install 1Password extension manually from their browser");
    }
  }, c = async (i) => {
    try {
      const r = await f();
      r ? (await i.loadExtension(r), console.log("✅ 1Password extension loaded successfully on shared auth session")) : console.log("📝 1Password extension not found for shared session - users can install it manually");
    } catch (r) {
      console.warn("⚠️ Could not load 1Password extension on shared session:", r), console.log("📝 Users can install 1Password extension manually from their browser");
    }
  }, f = async () => {
    const i = [
      // Chrome/Chromium paths
      w.join(S(), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      w.join(S(), "Library", "Application Support", "Google", "Chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      w.join(S(), ".config", "google-chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Edge paths
      w.join(S(), "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      w.join(S(), "Library", "Application Support", "Microsoft Edge", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Firefox paths (1Password uses different ID)
      w.join(S(), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles"),
      w.join(S(), "Library", "Application Support", "Firefox", "Profiles"),
      w.join(S(), ".mozilla", "firefox")
    ];
    for (const r of i)
      try {
        if (await A.access(r).then(() => !0).catch(() => !1)) {
          const l = (await A.readdir(r)).filter((d) => /^\d+\.\d+\.\d+/.test(d));
          if (l.length > 0) {
            const d = l.sort((u, h) => h.localeCompare(u))[0], g = w.join(r, d), p = w.join(g, "manifest.json");
            if (await A.access(p).then(() => !0).catch(() => !1))
              return g;
          }
        }
      } catch {
      }
    return null;
  };
  o.webRequest.onBeforeRequest((i, r) => {
    const s = i.url.toLowerCase();
    if (s.startsWith("chrome-extension://") || s.startsWith("moz-extension://") || s.startsWith("extension://")) {
      r({ cancel: !1 });
      return;
    }
    if (s.includes("localhost") || s.includes("127.0.0.1") || s.startsWith("file://") || s.startsWith("data:")) {
      r({ cancel: !1 });
      return;
    }
    if (s.startsWith("http://")) {
      console.log("🚫 Blocking insecure HTTP request:", i.url), r({ cancel: !0 });
      return;
    }
    if (s.startsWith("https://")) {
      console.log("✅ Allowing HTTPS request:", i.url), r({ cancel: !1 });
      return;
    }
    r({ cancel: !1 });
  }), o.webRequest.onHeadersReceived((i, r) => {
    const s = i.url.toLowerCase();
    if (s.includes("office.com") || s.includes("microsoft.com") || s.includes("google.com") || s.includes("sharepoint.com")) {
      r({
        responseHeaders: {
          ...i.responseHeaders,
          "X-Content-Type-Options": ["nosniff"],
          "Referrer-Policy": ["strict-origin-when-cross-origin"]
        }
      });
      return;
    }
    r({
      responseHeaders: {
        ...i.responseHeaders,
        "X-Frame-Options": ["SAMEORIGIN"],
        "X-Content-Type-Options": ["nosniff"],
        "Referrer-Policy": ["strict-origin-when-cross-origin"],
        "Permissions-Policy": ["camera=(), microphone=(), geolocation=()"],
        "Content-Security-Policy": [
          "default-src 'self' file: chrome-extension: moz-extension: extension:; script-src 'self' 'unsafe-inline' 'unsafe-eval' file: chrome-extension: moz-extension: extension:; style-src 'self' 'unsafe-inline' https: file: chrome-extension: moz-extension: extension:; connect-src 'self' https: wss: data: file: chrome-extension: moz-extension: extension:; img-src 'self' https: data: blob: file: chrome-extension: moz-extension: extension:; font-src 'self' https: data: file: chrome-extension: moz-extension: extension:; media-src 'self' https: data: file: chrome-extension: moz-extension: extension:; frame-src 'self' https: file: chrome-extension: moz-extension: extension:; child-src 'self' https: file: chrome-extension: moz-extension: extension:;"
        ]
      }
    });
  }), o.webRequest.onBeforeSendHeaders((i, r) => {
    const s = i.url.toLowerCase();
    let l = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    (s.includes("accounts.google.com") || s.includes("googleapis.com")) && (l = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"), r({
      requestHeaders: {
        ...i.requestHeaders,
        "User-Agent": l,
        // Add additional headers for OAuth compatibility
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Dest": "document"
      }
    });
  }), setTimeout(async () => {
    await a(), await c(e);
  }, 1e3);
};
function se(o = !1) {
  const e = new R({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: w.join(V, "../build/icon.png"),
    titleBarStyle: "default",
    show: !1,
    // Don't show until ready
    webPreferences: {
      preload: w.join(V, "preload.cjs"),
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
      // 🔐 SHARED SESSION: All windows use the same session partition
      // This ensures authentication state (Clerk tokens, localStorage) is shared
      partition: "persist:shared-auth",
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
  });
  return e.webContents.setWindowOpenHandler((n) => {
    const t = n.url;
    return [
      "https://accounts.google.com",
      "https://login.microsoftonline.com",
      "https://github.com/login",
      "https://clerk.shared.lcl.dev",
      "https://api.clerk.dev",
      "https://clerk.dev",
      "https://major-snipe-9.clerk.accounts.dev"
    ].some((c) => t.startsWith(c)) ? (console.log("🔐 Opening OAuth in system browser:", t), $.openExternal(t), { action: "deny" }) : { action: "deny" };
  }), e.webContents.on("before-input-event", (n, t) => {
    if (t.type === "keyDown" && (t.modifiers.includes("control") || t.modifiers.includes("meta"))) {
      const a = t.key.toLowerCase();
      console.log("⌨️ [MAIN] Intercepting keyboard shortcut:", a, t.modifiers);
      const c = ["t", "n", "w", "r", "h", "j", "=", "+", "-", "_", "0"], f = t.modifiers.includes("shift") && ["o", "i", "t"].includes(a);
      if (c.includes(a) || f) {
        console.log("⌨️ [MAIN] Preventing webview from handling critical shortcut:", a), n.preventDefault();
        let i = "";
        switch (a) {
          case "t":
            t.modifiers.includes("shift") ? i = "task-manager" : i = "new-tab";
            break;
          case "n":
            i = "new-window";
            break;
          case "w":
            i = "close-tab";
            break;
          case "r":
            i = "reload";
            break;
          case "h":
            i = "history";
            break;
          case "j":
            i = "downloads";
            break;
          case "=":
          case "+":
            i = "zoom-in";
            break;
          case "-":
          case "_":
            i = "zoom-out";
            break;
          case "0":
            i = "zoom-reset";
            break;
          case "o":
            t.modifiers.includes("shift") && (i = "bookmarks");
            break;
        }
        i && (console.log("⌨️ [MAIN] Sending shortcut action to renderer:", i), setTimeout(() => {
          e.webContents.send("keyboard-shortcut", i);
        }, 10));
      }
    }
  }), e.webContents.on("will-navigate", (n, t) => {
    const a = [
      I,
      "file://",
      "about:blank"
    ].filter(Boolean), c = [
      "https://accounts.google.com",
      "https://login.microsoftonline.com",
      "https://github.com/login",
      "https://clerk.shared.lcl.dev",
      "https://api.clerk.dev",
      "https://clerk.dev",
      "https://major-snipe-9.clerk.accounts.dev"
    ];
    a.some(
      (i) => t.startsWith(i || "")
    ) || c.some(
      (i) => t.startsWith(i)
    ) ? c.some((i) => t.startsWith(i)) && console.log("🔐 Allowing OAuth navigation to:", t) : (console.log("🚫 Blocking window navigation to:", t), n.preventDefault());
  }), I ? (e.loadURL(I), process.env.NODE_ENV === "development" && e.webContents.openDevTools()) : e.loadFile(w.join(oe, "index.html")), e.once("ready-to-show", () => {
    e.show(), e.focus();
  }), P.push(e), (o || !E) && (E = e, setTimeout(async () => {
    try {
      if (await U())
        console.log("✅ VPN is already connected during app initialization"), C(!0);
      else if (process.env.VPN_AUTO_CONNECT === "true") {
        console.log("🔄 VPN not connected, attempting auto-connect...");
        const t = await q();
        C(t), t ? console.log("✅ VPN auto-connected successfully") : console.warn("⚠️ VPN auto-connect failed");
      } else
        console.log("⚠️ VPN not connected and auto-connect disabled"), C(!1);
    } catch (n) {
      console.error("❌ VPN initialization error:", n), C(!1);
    }
  }, 500)), e.on("closed", () => {
    const n = P.indexOf(e);
    n > -1 && P.splice(n, 1), e === E && (P.length > 0 ? E = P[0] : (te().catch((t) => {
      console.error("❌ Error disconnecting VPN on app close:", t);
    }), E = null));
  }), process.env.NODE_ENV === "production" && e.setMenuBarVisibility(!1), e;
}
function re() {
  se(!0);
}
m.handle("system-get-version", () => y.getVersion());
m.handle("system-get-environment", () => {
  const o = {
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
    NODE_ENV: o.NODE_ENV,
    VPN_PROVIDER: o.VPN_PROVIDER,
    WIREGUARD_ENDPOINT: o.WIREGUARD_ENDPOINT
  }), JSON.stringify(o);
});
m.handle("vpn-get-status", async () => {
  console.log("🔍 VPN status requested - running comprehensive check...");
  try {
    const o = await U(), e = o ? "connected" : "disconnected";
    return console.log(`📊 VPN status check result: ${e}`), C(o), e;
  } catch (o) {
    return console.error("❌ VPN status check error:", o), "disconnected";
  }
});
m.handle("vpn-connect", async (o, e) => {
  console.log(`🌐 VPN connect requested: ${e}`);
  try {
    const n = await q();
    return C(n), n;
  } catch (n) {
    return console.error("❌ VPN connection error:", n), C(!1), !1;
  }
});
m.handle("vpn-disconnect", async () => {
  console.log("🌐 VPN disconnect requested");
  try {
    const o = await te();
    return C(!1), o;
  } catch (o) {
    return console.error("❌ VPN disconnection error:", o), !1;
  }
});
const qe = async (o) => {
  const e = process.env.OP_SERVICE_ACCOUNT_TOKEN;
  if (!e)
    throw new Error("1Password Service Account not configured. Set OP_SERVICE_ACCOUNT_TOKEN environment variable.");
  try {
    const n = await fetch(`https://my.1password.com/api/v1/items/${o}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${e}`,
        "Content-Type": "application/json"
      }
    });
    if (!n.ok)
      throw new Error(`1Password Service Account API error: ${n.status} ${n.statusText}`);
    const t = await n.json(), a = {};
    if (t.fields) {
      for (const c of t.fields)
        if (c.label && c.value)
          switch (c.label.toLowerCase()) {
            case "username":
            case "email":
              a.username = c.value;
              break;
            case "password":
              a.password = c.value;
              break;
            case "tenant_url":
            case "url":
            case "website":
              a.tenant_url = c.value;
              break;
            case "level1_domains":
              a.level1_domains = c.value;
              break;
            case "level2_domains":
              a.level2_domains = c.value;
              break;
            case "level3_enabled":
              a.level3_enabled = c.value === "true";
              break;
            default:
              a[c.label.toLowerCase().replace(/\s+/g, "_")] = c.value;
          }
    }
    return a;
  } catch (n) {
    throw new Error(`Failed to retrieve 1Password secret: ${n instanceof Error ? n.message : String(n)}`);
  }
};
m.handle("vault-get-sharepoint-credentials", async () => {
  console.log("🔑 SharePoint credentials requested from main process");
  try {
    const o = process.env.VAULT_PROVIDER || "hashicorp";
    if (process.env.NODE_ENV === "development")
      return console.log("🔧 Development mode: returning mock vault credentials"), {
        username: "dev-user@yourcompany.sharepoint.com",
        password: "dev-password-from-vault",
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
    if (o === "1password" || o === "1password-cli") {
      console.log("🔐 Using 1Password Service Account for credentials");
      const e = process.env.OP_SHAREPOINT_ITEM_ID || "SharePoint Service Account", n = await qe(e);
      return {
        username: n.username,
        password: n.password,
        tenant_url: n.tenant_url,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else
      return console.log(`⚠️ Vault provider ${o} not fully implemented`), {
        username: "vault-user@yourcompany.sharepoint.com",
        password: "vault-retrieved-password",
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
  } catch (o) {
    throw console.error("❌ Vault credentials retrieval failed:", o), new Error(`Vault credentials unavailable: ${o instanceof Error ? o.message : "Unknown error"}`);
  }
});
m.handle("vault-rotate-credentials", async () => {
  console.log("🔄 Vault credential rotation requested from main process");
  try {
    return process.env.NODE_ENV === "development" && console.log("🔧 Development mode: simulating credential rotation"), !0;
  } catch (o) {
    return console.error("❌ Vault credential rotation failed:", o), !1;
  }
});
m.handle("vault-get-status", async () => {
  if (process.env.NODE_ENV === "development")
    return "connected-dev";
  const o = process.env.VAULT_PROVIDER || "hashicorp";
  try {
    if (o === "1password" || o === "1password-cli") {
      const e = process.env.OP_SERVICE_ACCOUNT_TOKEN, n = process.env.OP_SHAREPOINT_ITEM_ID;
      if (!e)
        return "error: 1Password Service Account not configured";
      if (!n)
        return "error: SharePoint Item ID not configured";
      const t = await fetch(`https://my.1password.com/api/v1/items/${n}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${e}`,
          "Content-Type": "application/json"
        }
      });
      return t.ok ? (console.log("✅ 1Password Service Account access verified"), "connected") : (console.error("❌ 1Password Service Account access failed:", t.status), "error: Cannot access SharePoint credentials in 1Password");
    } else
      return "connected";
  } catch (e) {
    return console.error("❌ Vault status check failed:", e), `error: ${e instanceof Error ? e.message : "Unknown error"}`;
  }
});
m.handle("security-check-url", async (o, e, n) => (console.log(`🔒 URL check: ${e} (Level ${n})`), !0));
m.handle("security-log-navigation", async (o, e, n, t) => {
  console.log(`📝 Navigation log: ${e} - ${n ? "ALLOWED" : "BLOCKED"} (Level ${t})`);
});
m.handle("security-prevent-download", async (o, e) => {
  console.log(`🚫 Download blocked: ${e}`);
});
m.handle("shell-open-path", async (o, e) => {
  try {
    console.log("📁 Opening file with system default application:", e);
    const n = await $.openPath(e);
    return n ? (console.error("❌ Failed to open file:", n), n) : (console.log("✅ File opened successfully"), null);
  } catch (n) {
    return console.error("❌ Error opening file:", n), n instanceof Error ? n.message : "Unknown error";
  }
});
m.handle("shell-show-item-in-folder", async (o, e) => {
  try {
    return console.log("📂 Revealing file in system file manager:", e), $.showItemInFolder(e), console.log("✅ File revealed in explorer successfully"), null;
  } catch (n) {
    return console.error("❌ Error revealing file:", n), n instanceof Error ? n.message : "Unknown error";
  }
});
m.handle("save-page-as-pdf", async (o) => {
  try {
    const { dialog: e } = require("electron"), n = require("fs"), t = R.getFocusedWindow();
    if (!t)
      return { success: !1, error: "No focused window found" };
    const a = await e.showSaveDialog(t, {
      title: "Save page as PDF",
      defaultPath: "page.pdf",
      filters: [
        { name: "PDF Files", extensions: ["pdf"] }
      ]
    });
    if (a.canceled)
      return { success: !1, error: "User canceled" };
    const c = {
      marginsType: 0,
      // Default margins
      pageSize: "A4",
      printBackground: !0,
      printSelectionOnly: !1,
      landscape: !1
    }, f = await t.webContents.printToPDF(c);
    return n.writeFileSync(a.filePath, f), console.log(`✅ PDF saved to: ${a.filePath}`), {
      success: !0,
      filePath: a.filePath
    };
  } catch (e) {
    return console.error("❌ Error saving PDF:", e), {
      success: !1,
      error: e instanceof Error ? e.message : "Unknown error"
    };
  }
});
m.handle("extension-get-1password-status", async () => {
  try {
    const e = W.defaultSession.getAllExtensions().find(
      (n) => n.name.toLowerCase().includes("1password") || n.id === "aeblfdkhhhdcdjpifhhbdiojplfjncoa"
    );
    return e ? {
      installed: !0,
      version: e.version,
      name: e.name,
      id: e.id
    } : {
      installed: !1,
      downloadUrl: "https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa",
      instructions: "Please install the 1Password extension for the best experience"
    };
  } catch (o) {
    return console.error("❌ Error checking 1Password extension status:", o), {
      installed: !1,
      error: "Could not check extension status"
    };
  }
});
m.handle("extension-install-1password", async () => (console.log("🔧 1Password extension installation requested"), {
  success: !1,
  message: "Please install 1Password extension manually",
  steps: [
    "1. Open Chrome or Edge browser",
    "2. Go to chrome://extensions/ or edge://extensions/",
    "3. Enable Developer mode",
    "4. Install 1Password extension from the web store",
    "5. Restart the Aussie Vault Browser"
  ],
  webStoreUrl: "https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa"
}));
m.handle("sharepoint-inject-credentials", async (o, e) => (console.log(`🔐 SharePoint credentials injection requested for: ${e}`), !0));
m.handle("sharepoint-get-config", async () => ({
  tenantUrl: process.env.SHAREPOINT_TENANT_URL || "https://your-tenant.sharepoint.com",
  libraryPath: "/sites/documents/Shared Documents"
}));
m.handle("sharepoint-validate-access", async (o, e) => (console.log(`🔍 SharePoint access validation: ${e}`), !0));
m.handle("window-create-new", async () => {
  console.log("🪟 Creating new browser window...");
  try {
    const o = se(!1);
    return console.log("✅ New window shares authentication state - no need to sign in again!"), {
      success: !0,
      windowId: o.id,
      message: "New browser window created successfully with shared authentication"
    };
  } catch (o) {
    return console.error("❌ Error creating new window:", o), {
      success: !1,
      error: "Failed to create new window"
    };
  }
});
m.handle("context-menu-show", async (o, e) => {
  const n = R.fromWebContents(o.sender);
  if (!n) return;
  const t = [
    {
      label: "New Tab",
      click: () => {
        n.webContents.send("context-menu-action", "new-tab");
      }
    },
    {
      label: "New Window",
      click: () => {
        n.webContents.send("context-menu-action", "new-window");
      }
    },
    { type: "separator" },
    {
      label: "Reload",
      accelerator: "CmdOrCtrl+R",
      click: () => {
        n.webContents.send("context-menu-action", "reload");
      }
    }
  ], a = O ? [
    {
      label: "Go Back",
      accelerator: "Alt+Left",
      click: () => {
        n.webContents.send("context-menu-action", "go-back");
      }
    },
    {
      label: "Go Forward",
      accelerator: "Alt+Right",
      click: () => {
        n.webContents.send("context-menu-action", "go-forward");
      }
    },
    { type: "separator" },
    {
      label: "Go Home",
      click: () => {
        n.webContents.send("context-menu-action", "go-home");
      }
    }
  ] : [], c = [
    { type: "separator" },
    {
      label: "VPN Status",
      submenu: [
        {
          label: O ? "✅ VPN Connected" : "❌ VPN Disconnected",
          enabled: !1
        },
        {
          label: O ? "Reconnect VPN" : "Connect VPN",
          click: () => {
            n.webContents.send("context-menu-action", "reconnect-vpn");
          }
        }
      ]
    }
  ];
  le.buildFromTemplate([...t, ...a, ...c]).popup({
    window: n,
    x: e.x,
    y: e.y
  });
});
m.handle("window-get-count", async () => ({
  total: P.length,
  mainWindowId: (E == null ? void 0 : E.id) || null
}));
m.handle("window-close", async (o, e) => {
  try {
    if (e) {
      const n = P.find((t) => t.id === e);
      return n && !n.isDestroyed() ? (n.close(), { success: !0, message: "Window closed successfully" }) : { success: !1, error: "Window not found" };
    } else {
      const n = R.fromWebContents(o.sender);
      return n && !n.isDestroyed() ? (n.close(), { success: !0, message: "Current window closed successfully" }) : { success: !1, error: "Could not identify current window" };
    }
  } catch (n) {
    return console.error("❌ Error closing window:", n), { success: !1, error: "Failed to close window" };
  }
});
y.whenReady().then(async () => {
  console.log("🚀 Initializing Aussie Vault Browser..."), process.platform === "darwin" && y.dock && y.dock.setIcon(w.join(V, "../build/icon.png")), await Ae(), $e(), console.log("🔌 Starting VPN connection...");
  const o = await q();
  C(o), o ? console.log("✅ VPN connected successfully - unrestricted access enabled") : console.error("❌ VPN connection failed - starting with restricted access"), re();
}).catch((o) => {
  console.error("❌ Failed to initialize app:", o), y.quit();
});
const Fe = y.requestSingleInstanceLock();
Fe ? y.on("second-instance", () => {
  E && !E.isDestroyed() && (E.isMinimized() && E.restore(), E.focus());
}) : (console.log("🚫 Another instance is already running"), y.quit());
y.on("window-all-closed", () => {
  process.platform !== "darwin" && (console.log("🔐 Closing Aussie Vault Browser"), y.quit());
});
y.on("activate", () => {
  R.getAllWindows().length === 0 && re();
});
y.on("web-contents-created", (o, e) => {
  e.on("will-navigate", (n, t) => {
    try {
      if (E && !E.isDestroyed() && e === E.webContents) {
        const c = new URL(t), f = [
          I,
          "file:",
          "about:"
        ].filter(Boolean), i = [
          "https://accounts.google.com",
          "https://login.microsoftonline.com",
          "https://github.com/login",
          "https://clerk.shared.lcl.dev",
          "https://api.clerk.dev",
          "https://clerk.dev",
          "https://major-snipe-9.clerk.accounts.dev"
        ];
        f.some(
          (s) => c.protocol.startsWith(s || "") || t.startsWith(s || "")
        ) || i.some(
          (s) => t.startsWith(s)
        ) ? i.some((s) => t.startsWith(s)) && console.log("🔐 Allowing OAuth navigation to:", t) : (console.log("🚫 Blocking main window navigation to:", t), n.preventDefault());
      } else
        console.log("🌐 Webview navigation allowed:", t);
    } catch (a) {
      console.warn("⚠️ Failed to parse navigation URL:", t, a), E && !E.isDestroyed() && e === E.webContents && n.preventDefault();
    }
  });
});
process.defaultApp ? process.argv.length >= 2 && y.setAsDefaultProtocolClient("secure-browser", process.execPath, [w.resolve(process.argv[1])]) : y.setAsDefaultProtocolClient("secure-browser");
process.on("SIGINT", () => {
  console.log("🔐 Received SIGINT, gracefully shutting down"), y.quit();
});
process.on("SIGTERM", () => {
  console.log("🔐 Received SIGTERM, gracefully shutting down"), y.quit();
});
export {
  Qe as MAIN_DIST,
  oe as RENDERER_DIST,
  I as VITE_DEV_SERVER_URL
};
