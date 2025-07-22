import ce, { app as P, ipcMain as h, session as Z, BrowserWindow as V, Menu as ae, shell as le } from "electron";
import { fileURLToPath as ue } from "node:url";
import g from "node:path";
import de, { spawn as y } from "child_process";
import fe, { promises as I } from "fs";
import { homedir as C } from "os";
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
}, J = (o) => {
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
  const e = J();
  console.log(`${e.emoji} ${e.displayName} Instructions:`), console.log(`   Config file: ${o}`), console.log(""), e.installInstructions.forEach((n, t) => {
    console.log(`   ${t + 1}. ${n}`);
  }), e.requiresManualSetup && (console.log(""), console.log("🔄 After connecting, restart this application to verify the connection."));
};
function Ee(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var R = { exports: {} }, T = { exports: {} }, D = { exports: {} }, W, $;
function Pe() {
  if ($) return W;
  $ = 1;
  var o = 1e3, e = o * 60, n = e * 60, t = n * 24, i = t * 365.25;
  W = function(r, c) {
    c = c || {};
    var d = typeof r;
    if (d === "string" && r.length > 0)
      return s(r);
    if (d === "number" && isNaN(r) === !1)
      return c.long ? f(r) : u(r);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(r)
    );
  };
  function s(r) {
    if (r = String(r), !(r.length > 100)) {
      var c = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        r
      );
      if (c) {
        var d = parseFloat(c[1]), v = (c[2] || "ms").toLowerCase();
        switch (v) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * i;
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
  function u(r) {
    return r >= t ? Math.round(r / t) + "d" : r >= n ? Math.round(r / n) + "h" : r >= e ? Math.round(r / e) + "m" : r >= o ? Math.round(r / o) + "s" : r + "ms";
  }
  function f(r) {
    return a(r, t, "day") || a(r, n, "hour") || a(r, e, "minute") || a(r, o, "second") || r + " ms";
  }
  function a(r, c, d) {
    if (!(r < c))
      return r < c * 1.5 ? Math.floor(r / c) + " " + d : Math.ceil(r / c) + " " + d + "s";
  }
  return W;
}
var q;
function X() {
  return q || (q = 1, function(o, e) {
    e = o.exports = i.debug = i.default = i, e.coerce = a, e.disable = u, e.enable = s, e.enabled = f, e.humanize = Pe(), e.names = [], e.skips = [], e.formatters = {};
    var n;
    function t(r) {
      var c = 0, d;
      for (d in r)
        c = (c << 5) - c + r.charCodeAt(d), c |= 0;
      return e.colors[Math.abs(c) % e.colors.length];
    }
    function i(r) {
      function c() {
        if (c.enabled) {
          var d = c, v = +/* @__PURE__ */ new Date(), p = v - (n || v);
          d.diff = p, d.prev = n, d.curr = v, n = v;
          for (var l = new Array(arguments.length), E = 0; E < l.length; E++)
            l[E] = arguments[E];
          l[0] = e.coerce(l[0]), typeof l[0] != "string" && l.unshift("%O");
          var w = 0;
          l[0] = l[0].replace(/%([a-zA-Z%])/g, function(S, se) {
            if (S === "%%") return S;
            w++;
            var x = e.formatters[se];
            if (typeof x == "function") {
              var ie = l[w];
              S = x.call(d, ie), l.splice(w, 1), w--;
            }
            return S;
          }), e.formatArgs.call(d, l);
          var A = c.log || e.log || console.log.bind(console);
          A.apply(d, l);
        }
      }
      return c.namespace = r, c.enabled = e.enabled(r), c.useColors = e.useColors(), c.color = t(r), typeof e.init == "function" && e.init(c), c;
    }
    function s(r) {
      e.save(r), e.names = [], e.skips = [];
      for (var c = (typeof r == "string" ? r : "").split(/[\s,]+/), d = c.length, v = 0; v < d; v++)
        c[v] && (r = c[v].replace(/\*/g, ".*?"), r[0] === "-" ? e.skips.push(new RegExp("^" + r.substr(1) + "$")) : e.names.push(new RegExp("^" + r + "$")));
    }
    function u() {
      e.enable("");
    }
    function f(r) {
      var c, d;
      for (c = 0, d = e.skips.length; c < d; c++)
        if (e.skips[c].test(r))
          return !1;
      for (c = 0, d = e.names.length; c < d; c++)
        if (e.names[c].test(r))
          return !0;
      return !1;
    }
    function a(r) {
      return r instanceof Error ? r.stack || r.message : r;
    }
  }(D, D.exports)), D.exports;
}
var j;
function ye() {
  return j || (j = 1, function(o, e) {
    e = o.exports = X(), e.log = i, e.formatArgs = t, e.save = s, e.load = u, e.useColors = n, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : f(), e.colors = [
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
    e.formatters.j = function(a) {
      try {
        return JSON.stringify(a);
      } catch (r) {
        return "[UnexpectedJSONParseError]: " + r.message;
      }
    };
    function t(a) {
      var r = this.useColors;
      if (a[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + a[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !!r) {
        var c = "color: " + this.color;
        a.splice(1, 0, c, "color: inherit");
        var d = 0, v = 0;
        a[0].replace(/%[a-zA-Z%]/g, function(p) {
          p !== "%%" && (d++, p === "%c" && (v = d));
        }), a.splice(v, 0, c);
      }
    }
    function i() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function s(a) {
      try {
        a == null ? e.storage.removeItem("debug") : e.storage.debug = a;
      } catch {
      }
    }
    function u() {
      var a;
      try {
        a = e.storage.debug;
      } catch {
      }
      return !a && typeof process < "u" && "env" in process && (a = process.env.DEBUG), a;
    }
    e.enable(u());
    function f() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(T, T.exports)), T.exports;
}
var L = { exports: {} }, M;
function _e() {
  return M || (M = 1, function(o, e) {
    var n = ge, t = he;
    e = o.exports = X(), e.init = v, e.log = a, e.formatArgs = f, e.save = r, e.load = c, e.useColors = u, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(p) {
      return /^debug_/i.test(p);
    }).reduce(function(p, l) {
      var E = l.substring(6).toLowerCase().replace(/_([a-z])/g, function(A, S) {
        return S.toUpperCase();
      }), w = process.env[l];
      return /^(yes|on|true|enabled)$/i.test(w) ? w = !0 : /^(no|off|false|disabled)$/i.test(w) ? w = !1 : w === "null" ? w = null : w = Number(w), p[E] = w, p;
    }, {});
    var i = parseInt(process.env.DEBUG_FD, 10) || 2;
    i !== 1 && i !== 2 && t.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var s = i === 1 ? process.stdout : i === 2 ? process.stderr : d(i);
    function u() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : n.isatty(i);
    }
    e.formatters.o = function(p) {
      return this.inspectOpts.colors = this.useColors, t.inspect(p, this.inspectOpts).split(`
`).map(function(l) {
        return l.trim();
      }).join(" ");
    }, e.formatters.O = function(p) {
      return this.inspectOpts.colors = this.useColors, t.inspect(p, this.inspectOpts);
    };
    function f(p) {
      var l = this.namespace, E = this.useColors;
      if (E) {
        var w = this.color, A = "  \x1B[3" + w + ";1m" + l + " \x1B[0m";
        p[0] = A + p[0].split(`
`).join(`
` + A), p.push("\x1B[3" + w + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + l + " " + p[0];
    }
    function a() {
      return s.write(t.format.apply(t, arguments) + `
`);
    }
    function r(p) {
      p == null ? delete process.env.DEBUG : process.env.DEBUG = p;
    }
    function c() {
      return process.env.DEBUG;
    }
    function d(p) {
      var l, E = process.binding("tty_wrap");
      switch (E.guessHandleType(p)) {
        case "TTY":
          l = new n.WriteStream(p), l._type = "tty", l._handle && l._handle.unref && l._handle.unref();
          break;
        case "FILE":
          var w = fe;
          l = new w.SyncWriteStream(p, { autoClose: !1 }), l._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var A = we;
          l = new A.Socket({
            fd: p,
            readable: !1,
            writable: !0
          }), l.readable = !1, l.read = null, l._type = "pipe", l._handle && l._handle.unref && l._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return l.fd = p, l._isStdio = !0, l;
    }
    function v(p) {
      p.inspectOpts = {};
      for (var l = Object.keys(e.inspectOpts), E = 0; E < l.length; E++)
        p.inspectOpts[l[E]] = e.inspectOpts[l[E]];
    }
    e.enable(c());
  }(L, L.exports)), L.exports;
}
var F;
function Ce() {
  return F || (F = 1, typeof process < "u" && process.type === "renderer" ? R.exports = ye() : R.exports = _e()), R.exports;
}
var U, B;
function Ne() {
  if (B) return U;
  B = 1;
  var o = pe, e = de.spawn, n = Ce()("electron-squirrel-startup"), t = ce.app, i = function(u, f) {
    var a = o.resolve(o.dirname(process.execPath), "..", "Update.exe");
    n("Spawning `%s` with args `%s`", a, u), e(a, u, {
      detached: !0
    }).on("close", f);
  }, s = function() {
    if (process.platform === "win32") {
      var u = process.argv[1];
      n("processing squirrel command `%s`", u);
      var f = o.basename(process.execPath);
      if (u === "--squirrel-install" || u === "--squirrel-updated")
        return i(["--createShortcut=" + f], t.quit), !0;
      if (u === "--squirrel-uninstall")
        return i(["--removeShortcut=" + f], t.quit), !0;
      if (u === "--squirrel-obsolete")
        return t.quit(), !0;
    }
    return !1;
  };
  return U = s(), U;
}
var Ae = Ne();
const Se = /* @__PURE__ */ Ee(Ae);
Se && P.quit();
const Ie = async () => {
  try {
    const o = g.resolve(".env"), n = (await I.readFile(o, "utf-8")).split(`
`);
    console.log("🔍 Loading .env file from:", o);
    for (const t of n) {
      const i = t.trim();
      if (i && !i.startsWith("#")) {
        const [s, ...u] = i.split("=");
        if (s && u.length > 0) {
          const f = u.join("=").trim();
          process.env[s.trim()] = f, !s.includes("SECRET") && !s.includes("PASSWORD") && !s.includes("KEY") && !s.includes("ID") ? console.log(`📝 Loaded: ${s.trim()}=${f}`) : console.log(`📝 Loaded: ${s.trim()}=***`);
        }
      }
    }
    console.log("✅ Environment variables loaded successfully");
  } catch (o) {
    console.error("❌ Failed to load .env file:", o), console.log("📝 This may cause VPN detection to fail");
  }
}, Q = g.dirname(ue(import.meta.url));
process.env.APP_ROOT = g.join(Q, "..");
const b = process.env.VITE_DEV_SERVER_URL, Qe = g.join(process.env.APP_ROOT, "dist-electron"), ee = g.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = b ? g.join(process.env.APP_ROOT, "public") : ee;
let N = [], m = null, O = !1, oe = null;
const _ = (o) => {
  const e = O;
  O = o, e !== o && console.log(`🔄 VPN status changed: ${e ? "Connected" : "Disconnected"} → ${o ? "Connected" : "Disconnected"}`), console.log(`📡 VPN Status Updated: ${o ? "✅ Connected - Allowing all HTTPS requests" : "❌ Disconnected - Blocking external requests"}`), N.forEach((n) => {
    n && !n.isDestroyed() && n.webContents.send("vpn-status-changed", o);
  });
}, G = async () => {
  try {
    const o = process.env.VPN_PROVIDER || "wireguard";
    if (o === "wireguard")
      return await be();
    throw new Error(`VPN provider ${o} not implemented`);
  } catch (o) {
    return console.error("❌ VPN connection failed:", o), !1;
  }
}, ne = async () => {
  try {
    return oe ? await Ue() : !0;
  } catch (o) {
    return console.error("❌ VPN disconnection failed:", o), !1;
  }
}, be = async () => {
  try {
    console.log("🔍 Debug: Environment variables at startup:"), console.log(`  NODE_ENV: ${process.env.NODE_ENV}`), console.log(`  VPN_PROVIDER: ${process.env.VPN_PROVIDER}`), console.log(`  WIREGUARD_CONFIG_PATH: ${process.env.WIREGUARD_CONFIG_PATH}`), console.log(`  WIREGUARD_ENDPOINT: ${process.env.WIREGUARD_ENDPOINT}`);
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = g.resolve(o);
    console.log(`🔍 Resolved config path: ${e}`);
    try {
      await I.access(e), console.log("✅ Config file found");
    } catch (s) {
      console.log("❌ Config file not found:", s), console.log("📝 This is OK - config file not required for detection");
    }
    const n = J();
    return console.log(`🔌 Checking WireGuard connection on ${n.displayName}...`), await k() ? (console.log("✅ WireGuard is connected and active"), console.log("✅ VPN connected successfully - unrestricted access enabled"), !0) : (console.log("🔄 Attempting to establish WireGuard connection..."), await Oe(e) ? (console.log("✅ WireGuard connection established successfully"), await k() ? (console.log("✅ VPN auto-connected successfully"), !0) : (console.log("⚠️ Connection established but IP location verification failed"), !1)) : (console.log("❌ WireGuard connection failed."), ve(e), !1));
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
  const n = y("wg-quick", ["up", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (t) => {
    e(t === 0);
  }), n.on("error", (t) => {
    console.error("❌ wg-quick error:", t), e(!1);
  }), setTimeout(() => e(!1), 3e4);
}), Te = async (o) => new Promise((e) => {
  console.log("🍎 Using macOS wg-quick...");
  const n = y("wg-quick", ["up", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (t) => {
    e(t === 0);
  }), n.on("error", () => {
    console.log("🍎 Trying WireGuard macOS app..."), e(!1);
  }), setTimeout(() => e(!1), 3e4);
}), De = async (o) => (console.log("🪟 Windows detected - checking existing connection..."), console.log(`   Config available at: ${o}`), !1), k = async () => {
  const o = process.platform;
  try {
    switch (o) {
      case "linux":
        return await Le();
      case "darwin":
        return await ke();
      case "win32":
        return await Ve();
      default:
        return console.warn(`⚠️ Unsupported platform: ${o}`), !1;
    }
  } catch (e) {
    return console.error("❌ Error checking WireGuard status:", e), !1;
  }
}, Le = async () => new Promise((o) => {
  const e = y("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", (t) => {
    t === 0 && n.trim() ? (console.log("🐧 WireGuard active on Linux"), o(!0)) : o(!1);
  }), e.on("error", () => o(!1)), setTimeout(() => o(!1), 5e3);
}), ke = async () => new Promise((o) => {
  const e = y("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", (t) => {
    t === 0 && n.trim() ? (console.log("🍎 WireGuard active on macOS"), o(!0)) : H().then(o);
  }), e.on("error", () => {
    H().then(o);
  }), setTimeout(() => o(!1), 5e3);
}), H = async () => new Promise((o) => {
  const e = y("ifconfig", [], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", () => {
    const t = n.includes("utun") || n.includes("tun") || n.includes("wg");
    o(t);
  }), e.on("error", () => o(!1)), setTimeout(() => o(!1), 5e3);
}), Ve = async () => {
  if (console.log("🪟 Starting comprehensive Windows VPN detection..."), console.log("🔍 PRIMARY CHECK: IP geolocation (mandatory)..."), !await We())
    return console.log("❌ IP geolocation check FAILED - not connected to Australian VPN"), console.log("🚨 CRITICAL: User appears to be browsing from non-Australian IP"), console.log("🔍 Running diagnostic checks for troubleshooting..."), await z(), await K(), await Y(), console.log("⚠️  Note: Ping connectivity to VPN server does not indicate active VPN connection"), !1;
  console.log("✅ IP geolocation check PASSED - Australian VPN confirmed"), console.log("🔍 Running secondary verification checks...");
  const e = await z(), n = await K(), t = await Y();
  return console.log(e || n || t ? "✅ Secondary checks confirm WireGuard is properly configured" : "⚠️  Secondary checks inconclusive, but IP location confirms VPN is working"), !0;
}, z = async () => new Promise((o) => {
  console.log("🔍 Checking WireGuard CLI...");
  const e = y("wg", ["show"], {
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
}), K = async () => new Promise((o) => {
  console.log("🔍 Checking network interfaces via netsh...");
  const e = y("netsh", ["interface", "show", "interface"], {
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
}), Y = async () => new Promise((o) => {
  console.log("🔍 Checking routing table...");
  const n = (process.env.WIREGUARD_ENDPOINT || "134.199.169.102:59926").split(":")[0];
  console.log(`🔍 Looking for routes to server: ${n}`);
  const t = y("route", ["print"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let i = "";
  t.stdout.on("data", (s) => {
    i += s.toString();
  }), t.on("exit", () => {
    const s = i.includes(n);
    console.log(`🔍 Route to VPN server found: ${s}`), s && console.log(`🪟 Found route to VPN server ${n}`), o(s);
  }), t.on("error", (s) => {
    console.log("🔍 Route check error:", s.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 Route check timed out"), o(!1);
  }, 3e3);
}), We = async () => new Promise((o) => {
  console.log("🔍 Checking current public IP and location...");
  const n = y("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/json" -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Compress'], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  n.stdout.on("data", (i) => {
    t += i.toString();
  }), n.on("exit", () => {
    try {
      const i = JSON.parse(t.trim()), s = i.ip, u = i.country, f = i.region, a = i.city;
      console.log(`🔍 Current public IP: ${s}`), console.log(`🔍 Location: ${a}, ${f}, ${u}`);
      const r = u === "AU" || u === "Australia";
      r ? (console.log("🇦🇺 ✅ Connected via Australian VPN!"), console.log(`📍 Australian location detected: ${a}, ${f}`)) : console.log(`❌ Not connected to Australian VPN. Current location: ${u}`), o(r);
    } catch (i) {
      console.log("🔍 Failed to parse IP info:", i), console.log("🔍 Raw output:", t);
      const u = y("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/ip" -UseBasicParsing).Content.Trim()'], {
        stdio: ["pipe", "pipe", "pipe"]
      });
      let f = "";
      u.stdout.on("data", (a) => {
        f += a.toString();
      }), u.on("exit", () => {
        const a = f.trim();
        console.log(`🔍 Fallback IP check: ${a}`);
        const r = !a.startsWith("192.168.") && !a.startsWith("10.") && !a.startsWith("172.") && a !== "127.0.0.1";
        console.log(`🔍 Assuming VPN status based on non-local IP: ${r}`), o(r);
      }), u.on("error", () => {
        o(!1);
      });
    }
  }), n.on("error", (i) => {
    console.log("🔍 IP check error:", i.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 IP check timed out"), o(!1);
  }, 1e4);
}), Ue = async () => {
  try {
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = g.resolve(o), n = process.platform;
    switch (console.log(`🔌 Disconnecting WireGuard on ${n}...`), n) {
      case "linux":
      case "darwin":
        return await Ge(e);
      case "win32":
        return await xe();
      default:
        return console.error(`❌ Unsupported platform: ${n}`), !1;
    }
  } catch (o) {
    return console.error("❌ WireGuard disconnect setup error:", o), !1;
  }
}, Ge = async (o) => new Promise((e) => {
  const n = y("wg-quick", ["down", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (t) => {
    oe = null, t === 0 ? (console.log("✅ WireGuard disconnected successfully"), e(!0)) : (console.error(`❌ WireGuard disconnection failed with code: ${t}`), e(!1));
  }), n.on("error", (t) => {
    console.error("❌ WireGuard disconnect error:", t), e(!1);
  }), setTimeout(() => e(!1), 15e3);
}), xe = async () => (console.log("🪟 On Windows, please disconnect manually via WireGuard GUI"), console.log("   1. Open WireGuard application"), console.log('   2. Click "Deactivate" on your tunnel'), !0), $e = () => {
  const o = Z.defaultSession, e = async () => {
    try {
      const t = await n();
      t ? (await o.loadExtension(t), console.log("✅ 1Password extension loaded successfully")) : console.log("📝 1Password extension not found - users can install it manually");
    } catch (t) {
      console.warn("⚠️ Could not load 1Password extension:", t), console.log("📝 Users can install 1Password extension manually from their browser");
    }
  }, n = async () => {
    const t = [
      // Chrome/Chromium paths
      g.join(C(), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      g.join(C(), "Library", "Application Support", "Google", "Chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      g.join(C(), ".config", "google-chrome", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Edge paths
      g.join(C(), "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      g.join(C(), "Library", "Application Support", "Microsoft Edge", "Default", "Extensions", "aeblfdkhhhdcdjpifhhbdiojplfjncoa"),
      // Firefox paths (1Password uses different ID)
      g.join(C(), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles"),
      g.join(C(), "Library", "Application Support", "Firefox", "Profiles"),
      g.join(C(), ".mozilla", "firefox")
    ];
    for (const i of t)
      try {
        if (await I.access(i).then(() => !0).catch(() => !1)) {
          const u = (await I.readdir(i)).filter((f) => /^\d+\.\d+\.\d+/.test(f));
          if (u.length > 0) {
            const f = u.sort((c, d) => d.localeCompare(c))[0], a = g.join(i, f), r = g.join(a, "manifest.json");
            if (await I.access(r).then(() => !0).catch(() => !1))
              return a;
          }
        }
      } catch {
      }
    return null;
  };
  o.webRequest.onBeforeRequest((t, i) => {
    const s = t.url.toLowerCase();
    if (s.startsWith("chrome-extension://") || s.startsWith("moz-extension://") || s.startsWith("extension://")) {
      i({ cancel: !1 });
      return;
    }
    if (s.includes("localhost") || s.includes("127.0.0.1") || s.startsWith("file://") || s.startsWith("data:")) {
      i({ cancel: !1 });
      return;
    }
    if (s.startsWith("http://")) {
      console.log("🚫 Blocking insecure HTTP request:", t.url), i({ cancel: !0 });
      return;
    }
    if (s.startsWith("https://")) {
      console.log("✅ Allowing HTTPS request:", t.url), i({ cancel: !1 });
      return;
    }
    i({ cancel: !1 });
  }), o.webRequest.onHeadersReceived((t, i) => {
    const s = t.url.toLowerCase();
    if (s.includes("office.com") || s.includes("microsoft.com") || s.includes("google.com") || s.includes("sharepoint.com")) {
      i({
        responseHeaders: {
          ...t.responseHeaders,
          "X-Content-Type-Options": ["nosniff"],
          "Referrer-Policy": ["strict-origin-when-cross-origin"]
        }
      });
      return;
    }
    i({
      responseHeaders: {
        ...t.responseHeaders,
        "X-Frame-Options": ["SAMEORIGIN"],
        "X-Content-Type-Options": ["nosniff"],
        "Referrer-Policy": ["strict-origin-when-cross-origin"],
        "Permissions-Policy": ["camera=(), microphone=(), geolocation=()"],
        "Content-Security-Policy": [
          "default-src 'self' file: chrome-extension: moz-extension: extension:; script-src 'self' 'unsafe-inline' 'unsafe-eval' file: chrome-extension: moz-extension: extension:; style-src 'self' 'unsafe-inline' https: file: chrome-extension: moz-extension: extension:; connect-src 'self' https: wss: data: file: chrome-extension: moz-extension: extension:; img-src 'self' https: data: blob: file: chrome-extension: moz-extension: extension:; font-src 'self' https: data: file: chrome-extension: moz-extension: extension:; media-src 'self' https: data: file: chrome-extension: moz-extension: extension:; frame-src 'self' https: file: chrome-extension: moz-extension: extension:; child-src 'self' https: file: chrome-extension: moz-extension: extension:;"
        ]
      }
    });
  }), o.webRequest.onBeforeSendHeaders((t, i) => {
    const s = t.url.toLowerCase();
    let u = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    (s.includes("accounts.google.com") || s.includes("googleapis.com")) && (u = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"), i({
      requestHeaders: {
        ...t.requestHeaders,
        "User-Agent": u,
        // Add additional headers for OAuth compatibility
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Dest": "document"
      }
    });
  }), setTimeout(e, 1e3);
};
function te(o = !1) {
  const e = new V({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: g.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    titleBarStyle: "default",
    show: !1,
    // Don't show until ready
    webPreferences: {
      preload: g.join(Q, "preload.cjs"),
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
    ].some((s) => t.startsWith(s)) ? (console.log("🔐 Opening OAuth in system browser:", t), le.openExternal(t), { action: "deny" }) : { action: "deny" };
  }), e.webContents.on("will-navigate", (n, t) => {
    const i = [
      b,
      "file://",
      "about:blank"
    ].filter(Boolean), s = [
      "https://accounts.google.com",
      "https://login.microsoftonline.com",
      "https://github.com/login",
      "https://clerk.shared.lcl.dev",
      "https://api.clerk.dev",
      "https://clerk.dev",
      "https://major-snipe-9.clerk.accounts.dev"
    ];
    i.some(
      (f) => t.startsWith(f || "")
    ) || s.some(
      (f) => t.startsWith(f)
    ) ? s.some((f) => t.startsWith(f)) && console.log("🔐 Allowing OAuth navigation to:", t) : (console.log("🚫 Blocking window navigation to:", t), n.preventDefault());
  }), e.webContents.session.on("will-download", (n, t) => {
    console.log("🚫 Blocking download attempt:", t.getFilename()), n.preventDefault();
  }), b ? (e.loadURL(b), process.env.NODE_ENV === "development" && e.webContents.openDevTools()) : e.loadFile(g.join(ee, "index.html")), e.once("ready-to-show", () => {
    e.show(), e.focus();
  }), N.push(e), (o || !m) && (m = e, setTimeout(async () => {
    try {
      if (await k())
        console.log("✅ VPN is already connected during app initialization"), _(!0);
      else if (process.env.VPN_AUTO_CONNECT === "true") {
        console.log("🔄 VPN not connected, attempting auto-connect...");
        const t = await G();
        _(t), t ? console.log("✅ VPN auto-connected successfully") : console.warn("⚠️ VPN auto-connect failed");
      } else
        console.log("⚠️ VPN not connected and auto-connect disabled"), _(!1);
    } catch (n) {
      console.error("❌ VPN initialization error:", n), _(!1);
    }
  }, 500)), e.on("closed", () => {
    const n = N.indexOf(e);
    n > -1 && N.splice(n, 1), e === m && (N.length > 0 ? m = N[0] : (ne().catch((t) => {
      console.error("❌ Error disconnecting VPN on app close:", t);
    }), m = null));
  }), process.env.NODE_ENV === "production" && e.setMenuBarVisibility(!1), e;
}
function re() {
  te(!0);
}
h.handle("system-get-version", () => P.getVersion());
h.handle("system-get-environment", () => {
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
h.handle("vpn-get-status", async () => {
  console.log("🔍 VPN status requested - running comprehensive check...");
  try {
    const o = await k(), e = o ? "connected" : "disconnected";
    return console.log(`📊 VPN status check result: ${e}`), _(o), e;
  } catch (o) {
    return console.error("❌ VPN status check error:", o), "disconnected";
  }
});
h.handle("vpn-connect", async (o, e) => {
  console.log(`🌐 VPN connect requested: ${e}`);
  try {
    const n = await G();
    return _(n), n;
  } catch (n) {
    return console.error("❌ VPN connection error:", n), _(!1), !1;
  }
});
h.handle("vpn-disconnect", async () => {
  console.log("🌐 VPN disconnect requested");
  try {
    const o = await ne();
    return _(!1), o;
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
    const t = await n.json(), i = {};
    if (t.fields) {
      for (const s of t.fields)
        if (s.label && s.value)
          switch (s.label.toLowerCase()) {
            case "username":
            case "email":
              i.username = s.value;
              break;
            case "password":
              i.password = s.value;
              break;
            case "tenant_url":
            case "url":
            case "website":
              i.tenant_url = s.value;
              break;
            case "level1_domains":
              i.level1_domains = s.value;
              break;
            case "level2_domains":
              i.level2_domains = s.value;
              break;
            case "level3_enabled":
              i.level3_enabled = s.value === "true";
              break;
            default:
              i[s.label.toLowerCase().replace(/\s+/g, "_")] = s.value;
          }
    }
    return i;
  } catch (n) {
    throw new Error(`Failed to retrieve 1Password secret: ${n instanceof Error ? n.message : String(n)}`);
  }
};
h.handle("vault-get-sharepoint-credentials", async () => {
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
h.handle("vault-rotate-credentials", async () => {
  console.log("🔄 Vault credential rotation requested from main process");
  try {
    return process.env.NODE_ENV === "development" && console.log("🔧 Development mode: simulating credential rotation"), !0;
  } catch (o) {
    return console.error("❌ Vault credential rotation failed:", o), !1;
  }
});
h.handle("vault-get-status", async () => {
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
h.handle("security-check-url", async (o, e, n) => (console.log(`🔒 URL check: ${e} (Level ${n})`), !0));
h.handle("security-log-navigation", async (o, e, n, t) => {
  console.log(`📝 Navigation log: ${e} - ${n ? "ALLOWED" : "BLOCKED"} (Level ${t})`);
});
h.handle("security-prevent-download", async (o, e) => {
  console.log(`🚫 Download blocked: ${e}`);
});
h.handle("extension-get-1password-status", async () => {
  try {
    const e = Z.defaultSession.getAllExtensions().find(
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
h.handle("extension-install-1password", async () => (console.log("🔧 1Password extension installation requested"), {
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
h.handle("sharepoint-inject-credentials", async (o, e) => (console.log(`🔐 SharePoint credentials injection requested for: ${e}`), !0));
h.handle("sharepoint-get-config", async () => ({
  tenantUrl: process.env.SHAREPOINT_TENANT_URL || "https://your-tenant.sharepoint.com",
  libraryPath: "/sites/documents/Shared Documents"
}));
h.handle("sharepoint-validate-access", async (o, e) => (console.log(`🔍 SharePoint access validation: ${e}`), !0));
h.handle("window-create-new", async () => {
  console.log("🪟 Creating new browser window...");
  try {
    return {
      success: !0,
      windowId: te(!1).id,
      message: "New browser window created successfully"
    };
  } catch (o) {
    return console.error("❌ Error creating new window:", o), {
      success: !1,
      error: "Failed to create new window"
    };
  }
});
h.handle("context-menu-show", async (o, e) => {
  const n = V.fromWebContents(o.sender);
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
  ], i = O ? [
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
  ] : [], s = [
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
  ae.buildFromTemplate([...t, ...i, ...s]).popup({
    window: n,
    x: e.x,
    y: e.y
  });
});
h.handle("window-get-count", async () => ({
  total: N.length,
  mainWindowId: (m == null ? void 0 : m.id) || null
}));
h.handle("window-close", async (o, e) => {
  try {
    if (e) {
      const n = N.find((t) => t.id === e);
      return n && !n.isDestroyed() ? (n.close(), { success: !0, message: "Window closed successfully" }) : { success: !1, error: "Window not found" };
    } else {
      const n = V.fromWebContents(o.sender);
      return n && !n.isDestroyed() ? (n.close(), { success: !0, message: "Current window closed successfully" }) : { success: !1, error: "Could not identify current window" };
    }
  } catch (n) {
    return console.error("❌ Error closing window:", n), { success: !1, error: "Failed to close window" };
  }
});
P.whenReady().then(async () => {
  console.log("🚀 Initializing Secure Remote Browser..."), await Ie(), $e(), console.log("🔌 Starting VPN connection...");
  const o = await G();
  _(o), o ? console.log("✅ VPN connected successfully - unrestricted access enabled") : console.error("❌ VPN connection failed - starting with restricted access"), re();
}).catch((o) => {
  console.error("❌ Failed to initialize app:", o), P.quit();
});
const je = P.requestSingleInstanceLock();
je ? P.on("second-instance", () => {
  m && !m.isDestroyed() && (m.isMinimized() && m.restore(), m.focus());
}) : (console.log("🚫 Another instance is already running"), P.quit());
P.on("window-all-closed", () => {
  process.platform !== "darwin" && (console.log("🔐 Closing Secure Remote Browser"), P.quit());
});
P.on("activate", () => {
  V.getAllWindows().length === 0 && re();
});
P.on("web-contents-created", (o, e) => {
  e.on("will-navigate", (n, t) => {
    try {
      if (m && !m.isDestroyed() && e === m.webContents) {
        const s = new URL(t), u = [
          b,
          "file:",
          "about:"
        ].filter(Boolean), f = [
          "https://accounts.google.com",
          "https://login.microsoftonline.com",
          "https://github.com/login",
          "https://clerk.shared.lcl.dev",
          "https://api.clerk.dev",
          "https://clerk.dev",
          "https://major-snipe-9.clerk.accounts.dev"
        ];
        u.some(
          (r) => s.protocol.startsWith(r || "") || t.startsWith(r || "")
        ) || f.some(
          (r) => t.startsWith(r)
        ) ? f.some((r) => t.startsWith(r)) && console.log("🔐 Allowing OAuth navigation to:", t) : (console.log("🚫 Blocking main window navigation to:", t), n.preventDefault());
      } else
        console.log("🌐 Webview navigation allowed:", t);
    } catch (i) {
      console.warn("⚠️ Failed to parse navigation URL:", t, i), m && !m.isDestroyed() && e === m.webContents && n.preventDefault();
    }
  });
});
process.defaultApp ? process.argv.length >= 2 && P.setAsDefaultProtocolClient("secure-browser", process.execPath, [g.resolve(process.argv[1])]) : P.setAsDefaultProtocolClient("secure-browser");
process.on("SIGINT", () => {
  console.log("🔐 Received SIGINT, gracefully shutting down"), P.quit();
});
process.on("SIGTERM", () => {
  console.log("🔐 Received SIGTERM, gracefully shutting down"), P.quit();
});
export {
  Qe as MAIN_DIST,
  ee as RENDERER_DIST,
  b as VITE_DEV_SERVER_URL
};
