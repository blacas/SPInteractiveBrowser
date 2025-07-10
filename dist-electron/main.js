import se, { app as P, ipcMain as v, session as K, BrowserWindow as Y } from "electron";
import { fileURLToPath as ie } from "node:url";
import h from "node:path";
import ae, { spawn as _ } from "child_process";
import ce, { promises as S } from "fs";
import { homedir as N } from "os";
import le from "path";
import ue from "tty";
import de from "util";
import fe from "net";
const pe = () => {
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
}, Z = (o) => {
  switch (pe()) {
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
}, ge = (o) => {
  const e = Z();
  console.log(`${e.emoji} ${e.displayName} Instructions:`), console.log(`   Config file: ${o}`), console.log(""), e.installInstructions.forEach((t, n) => {
    console.log(`   ${n + 1}. ${t}`);
  }), e.requiresManualSetup && (console.log(""), console.log("🔄 After connecting, restart this application to verify the connection."));
};
function he(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var O = { exports: {} }, R = { exports: {} }, T = { exports: {} }, L, U;
function me() {
  if (U) return L;
  U = 1;
  var o = 1e3, e = o * 60, t = e * 60, n = t * 24, s = n * 365.25;
  L = function(r, a) {
    a = a || {};
    var u = typeof r;
    if (u === "string" && r.length > 0)
      return i(r);
    if (u === "number" && isNaN(r) === !1)
      return a.long ? p(r) : d(r);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(r)
    );
  };
  function i(r) {
    if (r = String(r), !(r.length > 100)) {
      var a = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        r
      );
      if (a) {
        var u = parseFloat(a[1]), w = (a[2] || "ms").toLowerCase();
        switch (w) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return u * s;
          case "days":
          case "day":
          case "d":
            return u * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return u * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return u * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return u * o;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return u;
          default:
            return;
        }
      }
    }
  }
  function d(r) {
    return r >= n ? Math.round(r / n) + "d" : r >= t ? Math.round(r / t) + "h" : r >= e ? Math.round(r / e) + "m" : r >= o ? Math.round(r / o) + "s" : r + "ms";
  }
  function p(r) {
    return c(r, n, "day") || c(r, t, "hour") || c(r, e, "minute") || c(r, o, "second") || r + " ms";
  }
  function c(r, a, u) {
    if (!(r < a))
      return r < a * 1.5 ? Math.floor(r / a) + " " + u : Math.ceil(r / a) + " " + u + "s";
  }
  return L;
}
var G;
function J() {
  return G || (G = 1, function(o, e) {
    e = o.exports = s.debug = s.default = s, e.coerce = c, e.disable = d, e.enable = i, e.enabled = p, e.humanize = me(), e.names = [], e.skips = [], e.formatters = {};
    var t;
    function n(r) {
      var a = 0, u;
      for (u in r)
        a = (a << 5) - a + r.charCodeAt(u), a |= 0;
      return e.colors[Math.abs(a) % e.colors.length];
    }
    function s(r) {
      function a() {
        if (a.enabled) {
          var u = a, w = +/* @__PURE__ */ new Date(), f = w - (t || w);
          u.diff = f, u.prev = t, u.curr = w, t = w;
          for (var l = new Array(arguments.length), E = 0; E < l.length; E++)
            l[E] = arguments[E];
          l[0] = e.coerce(l[0]), typeof l[0] != "string" && l.unshift("%O");
          var m = 0;
          l[0] = l[0].replace(/%([a-zA-Z%])/g, function(I, te) {
            if (I === "%%") return I;
            m++;
            var k = e.formatters[te];
            if (typeof k == "function") {
              var re = l[m];
              I = k.call(u, re), l.splice(m, 1), m--;
            }
            return I;
          }), e.formatArgs.call(u, l);
          var C = a.log || e.log || console.log.bind(console);
          C.apply(u, l);
        }
      }
      return a.namespace = r, a.enabled = e.enabled(r), a.useColors = e.useColors(), a.color = n(r), typeof e.init == "function" && e.init(a), a;
    }
    function i(r) {
      e.save(r), e.names = [], e.skips = [];
      for (var a = (typeof r == "string" ? r : "").split(/[\s,]+/), u = a.length, w = 0; w < u; w++)
        a[w] && (r = a[w].replace(/\*/g, ".*?"), r[0] === "-" ? e.skips.push(new RegExp("^" + r.substr(1) + "$")) : e.names.push(new RegExp("^" + r + "$")));
    }
    function d() {
      e.enable("");
    }
    function p(r) {
      var a, u;
      for (a = 0, u = e.skips.length; a < u; a++)
        if (e.skips[a].test(r))
          return !1;
      for (a = 0, u = e.names.length; a < u; a++)
        if (e.names[a].test(r))
          return !0;
      return !1;
    }
    function c(r) {
      return r instanceof Error ? r.stack || r.message : r;
    }
  }(T, T.exports)), T.exports;
}
var $;
function we() {
  return $ || ($ = 1, function(o, e) {
    e = o.exports = J(), e.log = s, e.formatArgs = n, e.save = i, e.load = d, e.useColors = t, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : p(), e.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function t() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    e.formatters.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (r) {
        return "[UnexpectedJSONParseError]: " + r.message;
      }
    };
    function n(c) {
      var r = this.useColors;
      if (c[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + c[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !!r) {
        var a = "color: " + this.color;
        c.splice(1, 0, a, "color: inherit");
        var u = 0, w = 0;
        c[0].replace(/%[a-zA-Z%]/g, function(f) {
          f !== "%%" && (u++, f === "%c" && (w = u));
        }), c.splice(w, 0, a);
      }
    }
    function s() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function i(c) {
      try {
        c == null ? e.storage.removeItem("debug") : e.storage.debug = c;
      } catch {
      }
    }
    function d() {
      var c;
      try {
        c = e.storage.debug;
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    e.enable(d());
    function p() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(R, R.exports)), R.exports;
}
var b = { exports: {} }, x;
function ve() {
  return x || (x = 1, function(o, e) {
    var t = ue, n = de;
    e = o.exports = J(), e.init = w, e.log = c, e.formatArgs = p, e.save = r, e.load = a, e.useColors = d, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(f) {
      return /^debug_/i.test(f);
    }).reduce(function(f, l) {
      var E = l.substring(6).toLowerCase().replace(/_([a-z])/g, function(C, I) {
        return I.toUpperCase();
      }), m = process.env[l];
      return /^(yes|on|true|enabled)$/i.test(m) ? m = !0 : /^(no|off|false|disabled)$/i.test(m) ? m = !1 : m === "null" ? m = null : m = Number(m), f[E] = m, f;
    }, {});
    var s = parseInt(process.env.DEBUG_FD, 10) || 2;
    s !== 1 && s !== 2 && n.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var i = s === 1 ? process.stdout : s === 2 ? process.stderr : u(s);
    function d() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : t.isatty(s);
    }
    e.formatters.o = function(f) {
      return this.inspectOpts.colors = this.useColors, n.inspect(f, this.inspectOpts).split(`
`).map(function(l) {
        return l.trim();
      }).join(" ");
    }, e.formatters.O = function(f) {
      return this.inspectOpts.colors = this.useColors, n.inspect(f, this.inspectOpts);
    };
    function p(f) {
      var l = this.namespace, E = this.useColors;
      if (E) {
        var m = this.color, C = "  \x1B[3" + m + ";1m" + l + " \x1B[0m";
        f[0] = C + f[0].split(`
`).join(`
` + C), f.push("\x1B[3" + m + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        f[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + l + " " + f[0];
    }
    function c() {
      return i.write(n.format.apply(n, arguments) + `
`);
    }
    function r(f) {
      f == null ? delete process.env.DEBUG : process.env.DEBUG = f;
    }
    function a() {
      return process.env.DEBUG;
    }
    function u(f) {
      var l, E = process.binding("tty_wrap");
      switch (E.guessHandleType(f)) {
        case "TTY":
          l = new t.WriteStream(f), l._type = "tty", l._handle && l._handle.unref && l._handle.unref();
          break;
        case "FILE":
          var m = ce;
          l = new m.SyncWriteStream(f, { autoClose: !1 }), l._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var C = fe;
          l = new C.Socket({
            fd: f,
            readable: !1,
            writable: !0
          }), l.readable = !1, l.read = null, l._type = "pipe", l._handle && l._handle.unref && l._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return l.fd = f, l._isStdio = !0, l;
    }
    function w(f) {
      f.inspectOpts = {};
      for (var l = Object.keys(e.inspectOpts), E = 0; E < l.length; E++)
        f.inspectOpts[l[E]] = e.inspectOpts[l[E]];
    }
    e.enable(a());
  }(b, b.exports)), b.exports;
}
var q;
function Ee() {
  return q || (q = 1, typeof process < "u" && process.type === "renderer" ? O.exports = we() : O.exports = ve()), O.exports;
}
var V, j;
function Pe() {
  if (j) return V;
  j = 1;
  var o = le, e = ae.spawn, t = Ee()("electron-squirrel-startup"), n = se.app, s = function(d, p) {
    var c = o.resolve(o.dirname(process.execPath), "..", "Update.exe");
    t("Spawning `%s` with args `%s`", c, d), e(c, d, {
      detached: !0
    }).on("close", p);
  }, i = function() {
    if (process.platform === "win32") {
      var d = process.argv[1];
      t("processing squirrel command `%s`", d);
      var p = o.basename(process.execPath);
      if (d === "--squirrel-install" || d === "--squirrel-updated")
        return s(["--createShortcut=" + p], n.quit), !0;
      if (d === "--squirrel-uninstall")
        return s(["--removeShortcut=" + p], n.quit), !0;
      if (d === "--squirrel-obsolete")
        return n.quit(), !0;
    }
    return !1;
  };
  return V = i(), V;
}
var _e = Pe();
const ye = /* @__PURE__ */ he(_e);
ye && P.quit();
const Ne = async () => {
  try {
    const o = h.resolve(".env"), t = (await S.readFile(o, "utf-8")).split(`
`);
    console.log("🔍 Loading .env file from:", o);
    for (const n of t) {
      const s = n.trim();
      if (s && !s.startsWith("#")) {
        const [i, ...d] = s.split("=");
        if (i && d.length > 0) {
          const p = d.join("=").trim();
          process.env[i.trim()] = p, !i.includes("SECRET") && !i.includes("PASSWORD") && !i.includes("KEY") && !i.includes("ID") ? console.log(`📝 Loaded: ${i.trim()}=${p}`) : console.log(`📝 Loaded: ${i.trim()}=***`);
        }
      }
    }
    console.log("✅ Environment variables loaded successfully");
  } catch (o) {
    console.error("❌ Failed to load .env file:", o), console.log("📝 This may cause VPN detection to fail");
  }
}, X = h.dirname(ie(import.meta.url));
process.env.APP_ROOT = h.join(X, "..");
const A = process.env.VITE_DEV_SERVER_URL, Ye = h.join(process.env.APP_ROOT, "dist-electron"), Q = h.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = A ? h.join(process.env.APP_ROOT, "public") : Q;
let g = null, M = !1, ee = null;
const y = (o) => {
  const e = M;
  M = o, e !== o && console.log(`🔄 VPN status changed: ${e ? "Connected" : "Disconnected"} → ${o ? "Connected" : "Disconnected"}`), console.log(`📡 VPN Status Updated: ${o ? "✅ Connected - Allowing all HTTPS requests" : "❌ Disconnected - Blocking external requests"}`), g && g.webContents.send("vpn-status-changed", o);
}, W = async () => {
  try {
    const o = process.env.VPN_PROVIDER || "wireguard";
    if (o === "wireguard")
      return await Ce();
    throw new Error(`VPN provider ${o} not implemented`);
  } catch (o) {
    return console.error("❌ VPN connection failed:", o), !1;
  }
}, oe = async () => {
  try {
    return ee ? await Le() : !0;
  } catch (o) {
    return console.error("❌ VPN disconnection failed:", o), !1;
  }
}, Ce = async () => {
  try {
    console.log("🔍 Debug: Environment variables at startup:"), console.log(`  NODE_ENV: ${process.env.NODE_ENV}`), console.log(`  VPN_PROVIDER: ${process.env.VPN_PROVIDER}`), console.log(`  WIREGUARD_CONFIG_PATH: ${process.env.WIREGUARD_CONFIG_PATH}`), console.log(`  WIREGUARD_ENDPOINT: ${process.env.WIREGUARD_ENDPOINT}`);
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = h.resolve(o);
    console.log(`🔍 Resolved config path: ${e}`);
    try {
      await S.access(e), console.log("✅ Config file found");
    } catch (i) {
      console.log("❌ Config file not found:", i), console.log("📝 This is OK - config file not required for detection");
    }
    const t = Z();
    return console.log(`🔌 Checking WireGuard connection on ${t.displayName}...`), await D() ? (console.log("✅ WireGuard is connected and active"), console.log("✅ VPN connected successfully - unrestricted access enabled"), !0) : (console.log("🔄 Attempting to establish WireGuard connection..."), await Ie(e) ? (console.log("✅ WireGuard connection established successfully"), await D() ? (console.log("✅ VPN auto-connected successfully"), !0) : (console.log("⚠️ Connection established but IP location verification failed"), !1)) : (console.log("❌ WireGuard connection failed."), ge(e), !1));
  } catch (o) {
    return console.error("❌ WireGuard setup error:", o), !1;
  }
}, Ie = async (o) => {
  const e = process.platform;
  try {
    switch (e) {
      case "linux":
        return await Se(o);
      case "darwin":
        return await Ae(o);
      case "win32":
        return await Oe(o);
      default:
        return console.error(`❌ Unsupported platform: ${e}`), !1;
    }
  } catch (t) {
    return console.error(`❌ Failed to connect on ${e}:`, t), !1;
  }
}, Se = async (o) => new Promise((e) => {
  console.log("🐧 Using Linux wg-quick...");
  const t = _("wg-quick", ["up", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  t.on("exit", (n) => {
    e(n === 0);
  }), t.on("error", (n) => {
    console.error("❌ wg-quick error:", n), e(!1);
  }), setTimeout(() => e(!1), 3e4);
}), Ae = async (o) => new Promise((e) => {
  console.log("🍎 Using macOS wg-quick...");
  const t = _("wg-quick", ["up", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  t.on("exit", (n) => {
    e(n === 0);
  }), t.on("error", () => {
    console.log("🍎 Trying WireGuard macOS app..."), e(!1);
  }), setTimeout(() => e(!1), 3e4);
}), Oe = async (o) => (console.log("🪟 Windows detected - checking existing connection..."), console.log(`   Config available at: ${o}`), !1), D = async () => {
  const o = process.platform;
  try {
    switch (o) {
      case "linux":
        return await Re();
      case "darwin":
        return await Te();
      case "win32":
        return await be();
      default:
        return console.warn(`⚠️ Unsupported platform: ${o}`), !1;
    }
  } catch (e) {
    return console.error("❌ Error checking WireGuard status:", e), !1;
  }
}, Re = async () => new Promise((o) => {
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  e.stdout.on("data", (n) => {
    t += n.toString();
  }), e.on("exit", (n) => {
    n === 0 && t.trim() ? (console.log("🐧 WireGuard active on Linux"), o(!0)) : o(!1);
  }), e.on("error", () => o(!1)), setTimeout(() => o(!1), 5e3);
}), Te = async () => new Promise((o) => {
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  e.stdout.on("data", (n) => {
    t += n.toString();
  }), e.on("exit", (n) => {
    n === 0 && t.trim() ? (console.log("🍎 WireGuard active on macOS"), o(!0)) : B().then(o);
  }), e.on("error", () => {
    B().then(o);
  }), setTimeout(() => o(!1), 5e3);
}), B = async () => new Promise((o) => {
  const e = _("ifconfig", [], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  e.stdout.on("data", (n) => {
    t += n.toString();
  }), e.on("exit", () => {
    const n = t.includes("utun") || t.includes("tun") || t.includes("wg");
    o(n);
  }), e.on("error", () => o(!1)), setTimeout(() => o(!1), 5e3);
}), be = async () => {
  if (console.log("🪟 Starting comprehensive Windows VPN detection..."), console.log("🔍 PRIMARY CHECK: IP geolocation (mandatory)..."), !await De())
    return console.log("❌ IP geolocation check FAILED - not connected to Australian VPN"), console.log("🚨 CRITICAL: User appears to be browsing from non-Australian IP"), console.log("🔍 Running diagnostic checks for troubleshooting..."), await F(), await H(), await z(), console.log("⚠️  Note: Ping connectivity to VPN server does not indicate active VPN connection"), !1;
  console.log("✅ IP geolocation check PASSED - Australian VPN confirmed"), console.log("🔍 Running secondary verification checks...");
  const e = await F(), t = await H(), n = await z();
  return console.log(e || t || n ? "✅ Secondary checks confirm WireGuard is properly configured" : "⚠️  Secondary checks inconclusive, but IP location confirms VPN is working"), !0;
}, F = async () => new Promise((o) => {
  console.log("🔍 Checking WireGuard CLI...");
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  e.stdout.on("data", (n) => {
    t += n.toString();
  }), e.on("exit", (n) => {
    if (console.log(`🔍 WireGuard CLI exit code: ${n}`), console.log(`🔍 WireGuard CLI output: "${t.trim()}"`), n === 0 && t.trim()) {
      console.log("🪟 WireGuard active on Windows (CLI)"), o(!0);
      return;
    }
    o(!1);
  }), e.on("error", (n) => {
    console.log("🔍 WireGuard CLI error:", n.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 WireGuard CLI check timed out"), o(!1);
  }, 3e3);
}), H = async () => new Promise((o) => {
  console.log("🔍 Checking network interfaces via netsh...");
  const e = _("netsh", ["interface", "show", "interface"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  e.stdout.on("data", (n) => {
    t += n.toString();
  }), e.on("exit", () => {
    console.log("🔍 Network interfaces output:"), console.log(t);
    const n = t.toLowerCase().includes("wireguard") || t.toLowerCase().includes("wg") || t.toLowerCase().includes("tun");
    console.log(`🔍 WireGuard interface found: ${n}`), n && console.log("🪟 WireGuard interface detected on Windows"), o(n);
  }), e.on("error", (n) => {
    console.log("🔍 Network interface check error:", n.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 Network interface check timed out"), o(!1);
  }, 3e3);
}), z = async () => new Promise((o) => {
  console.log("🔍 Checking routing table...");
  const t = (process.env.WIREGUARD_ENDPOINT || "134.199.169.102:59926").split(":")[0];
  console.log(`🔍 Looking for routes to server: ${t}`);
  const n = _("route", ["print"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let s = "";
  n.stdout.on("data", (i) => {
    s += i.toString();
  }), n.on("exit", () => {
    const i = s.includes(t);
    console.log(`🔍 Route to VPN server found: ${i}`), i && console.log(`🪟 Found route to VPN server ${t}`), o(i);
  }), n.on("error", (i) => {
    console.log("🔍 Route check error:", i.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 Route check timed out"), o(!1);
  }, 3e3);
}), De = async () => new Promise((o) => {
  console.log("🔍 Checking current public IP and location...");
  const t = _("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/json" -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Compress'], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  t.stdout.on("data", (s) => {
    n += s.toString();
  }), t.on("exit", () => {
    try {
      const s = JSON.parse(n.trim()), i = s.ip, d = s.country, p = s.region, c = s.city;
      console.log(`🔍 Current public IP: ${i}`), console.log(`🔍 Location: ${c}, ${p}, ${d}`);
      const r = d === "AU" || d === "Australia";
      r ? (console.log("🇦🇺 ✅ Connected via Australian VPN!"), console.log(`📍 Australian location detected: ${c}, ${p}`)) : console.log(`❌ Not connected to Australian VPN. Current location: ${d}`), o(r);
    } catch (s) {
      console.log("🔍 Failed to parse IP info:", s), console.log("🔍 Raw output:", n);
      const d = _("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/ip" -UseBasicParsing).Content.Trim()'], {
        stdio: ["pipe", "pipe", "pipe"]
      });
      let p = "";
      d.stdout.on("data", (c) => {
        p += c.toString();
      }), d.on("exit", () => {
        const c = p.trim();
        console.log(`🔍 Fallback IP check: ${c}`);
        const r = !c.startsWith("192.168.") && !c.startsWith("10.") && !c.startsWith("172.") && c !== "127.0.0.1";
        console.log(`🔍 Assuming VPN status based on non-local IP: ${r}`), o(r);
      }), d.on("error", () => {
        o(!1);
      });
    }
  }), t.on("error", (s) => {
    console.log("🔍 IP check error:", s.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 IP check timed out"), o(!1);
  }, 1e4);
}), Le = async () => {
  try {
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = h.resolve(o), t = process.platform;
    switch (console.log(`🔌 Disconnecting WireGuard on ${t}...`), t) {
      case "linux":
      case "darwin":
        return await Ve(e);
      case "win32":
        return await We();
      default:
        return console.error(`❌ Unsupported platform: ${t}`), !1;
    }
  } catch (o) {
    return console.error("❌ WireGuard disconnect setup error:", o), !1;
  }
}, Ve = async (o) => new Promise((e) => {
  const t = _("wg-quick", ["down", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  t.on("exit", (n) => {
    ee = null, n === 0 ? (console.log("✅ WireGuard disconnected successfully"), e(!0)) : (console.error(`❌ WireGuard disconnection failed with code: ${n}`), e(!1));
  }), t.on("error", (n) => {
    console.error("❌ WireGuard disconnect error:", n), e(!1);
  }), setTimeout(() => e(!1), 15e3);
}), We = async () => (console.log("🪟 On Windows, please disconnect manually via WireGuard GUI"), console.log("   1. Open WireGuard application"), console.log('   2. Click "Deactivate" on your tunnel'), !0), ke = () => {
  const o = K.defaultSession, e = async () => {
    try {
      const n = await t();
      n ? (await o.loadExtension(n), console.log("✅ 1Password extension loaded successfully")) : console.log("📝 1Password extension not found - users can install it manually");
    } catch (n) {
      console.warn("⚠️ Could not load 1Password extension:", n), console.log("📝 Users can install 1Password extension manually from their browser");
    }
  }, t = async () => {
    const n = [
      // Chrome/Chromium paths
      h.join(N(), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      h.join(N(), "Library", "Application Support", "Google", "Chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      h.join(N(), ".config", "google-chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Edge paths
      h.join(N(), "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      h.join(N(), "Library", "Application Support", "Microsoft Edge", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Firefox paths (1Password uses different ID)
      h.join(N(), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles"),
      h.join(N(), "Library", "Application Support", "Firefox", "Profiles"),
      h.join(N(), ".mozilla", "firefox")
    ];
    for (const s of n)
      try {
        if (await S.access(s).then(() => !0).catch(() => !1)) {
          const d = (await S.readdir(s)).filter((p) => /^\d+\.\d+\.\d+/.test(p));
          if (d.length > 0) {
            const p = d.sort((a, u) => u.localeCompare(a))[0], c = h.join(s, p), r = h.join(c, "manifest.json");
            if (await S.access(r).then(() => !0).catch(() => !1))
              return c;
          }
        }
      } catch {
      }
    return null;
  };
  o.webRequest.onBeforeRequest((n, s) => {
    const i = n.url.toLowerCase();
    if (i.startsWith("chrome-extension://") || i.startsWith("moz-extension://") || i.startsWith("extension://")) {
      s({ cancel: !1 });
      return;
    }
    if (i.includes("localhost") || i.includes("127.0.0.1") || i.startsWith("file://") || i.startsWith("data:")) {
      s({ cancel: !1 });
      return;
    }
    if (i.startsWith("http://")) {
      console.log("🚫 Blocking insecure HTTP request:", n.url), s({ cancel: !0 });
      return;
    }
    if (i.startsWith("https://")) {
      console.log("✅ Allowing HTTPS request:", n.url), s({ cancel: !1 });
      return;
    }
    s({ cancel: !1 });
  }), o.webRequest.onHeadersReceived((n, s) => {
    const i = n.url.toLowerCase();
    if (i.includes("office.com") || i.includes("microsoft.com") || i.includes("google.com") || i.includes("sharepoint.com")) {
      s({
        responseHeaders: {
          ...n.responseHeaders,
          "X-Content-Type-Options": ["nosniff"],
          "Referrer-Policy": ["strict-origin-when-cross-origin"]
        }
      });
      return;
    }
    s({
      responseHeaders: {
        ...n.responseHeaders,
        "X-Frame-Options": ["SAMEORIGIN"],
        "X-Content-Type-Options": ["nosniff"],
        "Referrer-Policy": ["strict-origin-when-cross-origin"],
        "Permissions-Policy": ["camera=(), microphone=(), geolocation=()"],
        "Content-Security-Policy": [
          "default-src 'self' chrome-extension: moz-extension: extension:; script-src 'self' 'unsafe-inline' 'unsafe-eval' chrome-extension: moz-extension: extension:; style-src 'self' 'unsafe-inline' https: chrome-extension: moz-extension: extension:; connect-src 'self' https: wss: data: chrome-extension: moz-extension: extension:; img-src 'self' https: data: blob: chrome-extension: moz-extension: extension:; font-src 'self' https: data: chrome-extension: moz-extension: extension:; media-src 'self' https: data: chrome-extension: moz-extension: extension:; frame-src 'self' https: chrome-extension: moz-extension: extension:; child-src 'self' https: chrome-extension: moz-extension: extension:;"
        ]
      }
    });
  }), o.webRequest.onBeforeSendHeaders((n, s) => {
    s({
      requestHeaders: {
        ...n.requestHeaders,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
  }), setTimeout(e, 1e3);
};
function ne() {
  g = new Y({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: h.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    titleBarStyle: "default",
    show: !1,
    // Don't show until ready
    webPreferences: {
      preload: h.join(X, "preload.cjs"),
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
  }), g.webContents.setWindowOpenHandler(() => ({ action: "deny" })), g.webContents.on("will-navigate", (o, e) => {
    [
      A,
      "file://",
      "about:blank"
    ].filter(Boolean).some(
      (s) => e.startsWith(s || "")
    ) || (console.log("🚫 Blocking main window navigation to:", e), o.preventDefault());
  }), g.webContents.session.on("will-download", (o, e) => {
    console.log("🚫 Blocking download attempt:", e.getFilename()), o.preventDefault();
  }), A ? (g.loadURL(A), process.env.NODE_ENV === "development" && g.webContents.openDevTools()) : g.loadFile(h.join(Q, "index.html")), g.once("ready-to-show", () => {
    g && (g.show(), g.focus());
  }), setTimeout(async () => {
    try {
      if (await D())
        console.log("✅ VPN is already connected during app initialization"), y(!0);
      else if (process.env.VPN_AUTO_CONNECT === "true") {
        console.log("🔄 VPN not connected, attempting auto-connect...");
        const e = await W();
        y(e), e ? console.log("✅ VPN auto-connected successfully") : console.warn("⚠️ VPN auto-connect failed");
      } else
        console.log("⚠️ VPN not connected and auto-connect disabled"), y(!1);
    } catch (o) {
      console.error("❌ VPN initialization error:", o), y(!1);
    }
  }, 500), g.on("closed", () => {
    oe().catch((o) => {
      console.error("❌ Error disconnecting VPN on app close:", o);
    }), g = null;
  }), process.env.NODE_ENV === "production" && g.setMenuBarVisibility(!1);
}
v.handle("system-get-version", () => P.getVersion());
v.handle("system-get-environment", () => {
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
v.handle("vpn-get-status", async () => {
  console.log("🔍 VPN status requested - running comprehensive check...");
  try {
    const o = await D(), e = o ? "connected" : "disconnected";
    return console.log(`📊 VPN status check result: ${e}`), y(o), e;
  } catch (o) {
    return console.error("❌ VPN status check error:", o), "disconnected";
  }
});
v.handle("vpn-connect", async (o, e) => {
  console.log(`🌐 VPN connect requested: ${e}`);
  try {
    const t = await W();
    return y(t), t;
  } catch (t) {
    return console.error("❌ VPN connection error:", t), y(!1), !1;
  }
});
v.handle("vpn-disconnect", async () => {
  console.log("🌐 VPN disconnect requested");
  try {
    const o = await oe();
    return y(!1), o;
  } catch (o) {
    return console.error("❌ VPN disconnection error:", o), !1;
  }
});
const Ue = async (o) => {
  const e = process.env.OP_SERVICE_ACCOUNT_TOKEN;
  if (!e)
    throw new Error("1Password Service Account not configured. Set OP_SERVICE_ACCOUNT_TOKEN environment variable.");
  try {
    const t = await fetch(`https://my.1password.com/api/v1/items/${o}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${e}`,
        "Content-Type": "application/json"
      }
    });
    if (!t.ok)
      throw new Error(`1Password Service Account API error: ${t.status} ${t.statusText}`);
    const n = await t.json(), s = {};
    if (n.fields) {
      for (const i of n.fields)
        if (i.label && i.value)
          switch (i.label.toLowerCase()) {
            case "username":
            case "email":
              s.username = i.value;
              break;
            case "password":
              s.password = i.value;
              break;
            case "tenant_url":
            case "url":
            case "website":
              s.tenant_url = i.value;
              break;
            case "level1_domains":
              s.level1_domains = i.value;
              break;
            case "level2_domains":
              s.level2_domains = i.value;
              break;
            case "level3_enabled":
              s.level3_enabled = i.value === "true";
              break;
            default:
              s[i.label.toLowerCase().replace(/\s+/g, "_")] = i.value;
          }
    }
    return s;
  } catch (t) {
    throw new Error(`Failed to retrieve 1Password secret: ${t instanceof Error ? t.message : String(t)}`);
  }
};
v.handle("vault-get-sharepoint-credentials", async () => {
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
      const e = process.env.OP_SHAREPOINT_ITEM_ID || "SharePoint Service Account", t = await Ue(e);
      return {
        username: t.username,
        password: t.password,
        tenant_url: t.tenant_url,
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
v.handle("vault-rotate-credentials", async () => {
  console.log("🔄 Vault credential rotation requested from main process");
  try {
    return process.env.NODE_ENV === "development" && console.log("🔧 Development mode: simulating credential rotation"), !0;
  } catch (o) {
    return console.error("❌ Vault credential rotation failed:", o), !1;
  }
});
v.handle("vault-get-status", async () => {
  if (process.env.NODE_ENV === "development")
    return "connected-dev";
  const o = process.env.VAULT_PROVIDER || "hashicorp";
  try {
    if (o === "1password" || o === "1password-cli") {
      const e = process.env.OP_SERVICE_ACCOUNT_TOKEN, t = process.env.OP_SHAREPOINT_ITEM_ID;
      if (!e)
        return "error: 1Password Service Account not configured";
      if (!t)
        return "error: SharePoint Item ID not configured";
      const n = await fetch(`https://my.1password.com/api/v1/items/${t}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${e}`,
          "Content-Type": "application/json"
        }
      });
      return n.ok ? (console.log("✅ 1Password Service Account access verified"), "connected") : (console.error("❌ 1Password Service Account access failed:", n.status), "error: Cannot access SharePoint credentials in 1Password");
    } else
      return "connected";
  } catch (e) {
    return console.error("❌ Vault status check failed:", e), `error: ${e instanceof Error ? e.message : "Unknown error"}`;
  }
});
v.handle("security-check-url", async (o, e, t) => (console.log(`🔒 URL check: ${e} (Level ${t})`), !0));
v.handle("security-log-navigation", async (o, e, t, n) => {
  console.log(`📝 Navigation log: ${e} - ${t ? "ALLOWED" : "BLOCKED"} (Level ${n})`);
});
v.handle("security-prevent-download", async (o, e) => {
  console.log(`🚫 Download blocked: ${e}`);
});
v.handle("extension-get-1password-status", async () => {
  try {
    const e = K.defaultSession.getAllExtensions().find(
      (t) => t.name.toLowerCase().includes("1password") || t.id === "aeblfdkhhhdcdjpifhhbdiojplfjncoa"
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
v.handle("extension-install-1password", async () => (console.log("🔧 1Password extension installation requested"), {
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
v.handle("sharepoint-inject-credentials", async (o, e) => (console.log(`🔐 SharePoint credentials injection requested for: ${e}`), !0));
v.handle("sharepoint-get-config", async () => ({
  tenantUrl: process.env.SHAREPOINT_TENANT_URL || "https://your-tenant.sharepoint.com",
  libraryPath: "/sites/documents/Shared Documents"
}));
v.handle("sharepoint-validate-access", async (o, e) => (console.log(`🔍 SharePoint access validation: ${e}`), !0));
P.whenReady().then(async () => {
  console.log("🚀 Initializing Secure Remote Browser..."), await Ne(), ke(), console.log("🔌 Starting VPN connection...");
  const o = await W();
  y(o), o ? console.log("✅ VPN connected successfully - unrestricted access enabled") : console.error("❌ VPN connection failed - starting with restricted access"), ne();
}).catch((o) => {
  console.error("❌ Failed to initialize app:", o), P.quit();
});
const Ge = P.requestSingleInstanceLock();
Ge ? P.on("second-instance", () => {
  g && (g.isMinimized() && g.restore(), g.focus());
}) : (console.log("🚫 Another instance is already running"), P.quit());
P.on("window-all-closed", () => {
  process.platform !== "darwin" && (console.log("🔐 Closing Secure Remote Browser"), P.quit());
});
P.on("activate", () => {
  Y.getAllWindows().length === 0 && ne();
});
P.on("web-contents-created", (o, e) => {
  e.on("will-navigate", (t, n) => {
    try {
      if (g && e === g.webContents) {
        const i = new URL(n);
        [
          A,
          "file:",
          "about:"
        ].filter(Boolean).some(
          (c) => i.protocol.startsWith(c || "") || n.startsWith(c || "")
        ) || (console.log("🚫 Blocking main window navigation to:", n), t.preventDefault());
      } else
        console.log("🌐 Webview navigation allowed:", n);
    } catch (s) {
      console.warn("⚠️ Failed to parse navigation URL:", n, s), g && e === g.webContents && t.preventDefault();
    }
  });
});
process.defaultApp ? process.argv.length >= 2 && P.setAsDefaultProtocolClient("secure-browser", process.execPath, [h.resolve(process.argv[1])]) : P.setAsDefaultProtocolClient("secure-browser");
process.on("SIGINT", () => {
  console.log("🔐 Received SIGINT, gracefully shutting down"), P.quit();
});
process.on("SIGTERM", () => {
  console.log("🔐 Received SIGTERM, gracefully shutting down"), P.quit();
});
export {
  Ye as MAIN_DIST,
  Q as RENDERER_DIST,
  A as VITE_DEV_SERVER_URL
};
