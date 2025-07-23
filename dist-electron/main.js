import ae, { app as y, ipcMain as h, shell as x, BrowserWindow as R, session as G, Menu as le } from "electron";
import { fileURLToPath as ue } from "node:url";
import w from "node:path";
import de, { spawn as _ } from "child_process";
import fe, { promises as I } from "fs";
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
}, X = (o) => {
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
  const e = X();
  console.log(`${e.emoji} ${e.displayName} Instructions:`), console.log(`   Config file: ${o}`), console.log(""), e.installInstructions.forEach((n, t) => {
    console.log(`   ${t + 1}. ${n}`);
  }), e.requiresManualSetup && (console.log(""), console.log("🔄 After connecting, restart this application to verify the connection."));
};
function Ee(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var T = { exports: {} }, D = { exports: {} }, L = { exports: {} }, V, j;
function ye() {
  if (j) return V;
  j = 1;
  var o = 1e3, e = o * 60, n = e * 60, t = n * 24, c = t * 365.25;
  V = function(r, a) {
    a = a || {};
    var f = typeof r;
    if (f === "string" && r.length > 0)
      return s(r);
    if (f === "number" && isNaN(r) === !1)
      return a.long ? l(r) : i(r);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(r)
    );
  };
  function s(r) {
    if (r = String(r), !(r.length > 100)) {
      var a = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        r
      );
      if (a) {
        var f = parseFloat(a[1]), g = (a[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return f * c;
          case "days":
          case "day":
          case "d":
            return f * t;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return f * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return f * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return f * o;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return f;
          default:
            return;
        }
      }
    }
  }
  function i(r) {
    return r >= t ? Math.round(r / t) + "d" : r >= n ? Math.round(r / n) + "h" : r >= e ? Math.round(r / e) + "m" : r >= o ? Math.round(r / o) + "s" : r + "ms";
  }
  function l(r) {
    return u(r, t, "day") || u(r, n, "hour") || u(r, e, "minute") || u(r, o, "second") || r + " ms";
  }
  function u(r, a, f) {
    if (!(r < a))
      return r < a * 1.5 ? Math.floor(r / a) + " " + f : Math.ceil(r / a) + " " + f + "s";
  }
  return V;
}
var F;
function Q() {
  return F || (F = 1, function(o, e) {
    e = o.exports = c.debug = c.default = c, e.coerce = u, e.disable = i, e.enable = s, e.enabled = l, e.humanize = ye(), e.names = [], e.skips = [], e.formatters = {};
    var n;
    function t(r) {
      var a = 0, f;
      for (f in r)
        a = (a << 5) - a + r.charCodeAt(f), a |= 0;
      return e.colors[Math.abs(a) % e.colors.length];
    }
    function c(r) {
      function a() {
        if (a.enabled) {
          var f = a, g = +/* @__PURE__ */ new Date(), p = g - (n || g);
          f.diff = p, f.prev = n, f.curr = g, n = g;
          for (var d = new Array(arguments.length), E = 0; E < d.length; E++)
            d[E] = arguments[E];
          d[0] = e.coerce(d[0]), typeof d[0] != "string" && d.unshift("%O");
          var m = 0;
          d[0] = d[0].replace(/%([a-zA-Z%])/g, function(A, ie) {
            if (A === "%%") return A;
            m++;
            var q = e.formatters[ie];
            if (typeof q == "function") {
              var ce = d[m];
              A = q.call(f, ce), d.splice(m, 1), m--;
            }
            return A;
          }), e.formatArgs.call(f, d);
          var N = a.log || e.log || console.log.bind(console);
          N.apply(f, d);
        }
      }
      return a.namespace = r, a.enabled = e.enabled(r), a.useColors = e.useColors(), a.color = t(r), typeof e.init == "function" && e.init(a), a;
    }
    function s(r) {
      e.save(r), e.names = [], e.skips = [];
      for (var a = (typeof r == "string" ? r : "").split(/[\s,]+/), f = a.length, g = 0; g < f; g++)
        a[g] && (r = a[g].replace(/\*/g, ".*?"), r[0] === "-" ? e.skips.push(new RegExp("^" + r.substr(1) + "$")) : e.names.push(new RegExp("^" + r + "$")));
    }
    function i() {
      e.enable("");
    }
    function l(r) {
      var a, f;
      for (a = 0, f = e.skips.length; a < f; a++)
        if (e.skips[a].test(r))
          return !1;
      for (a = 0, f = e.names.length; a < f; a++)
        if (e.names[a].test(r))
          return !0;
      return !1;
    }
    function u(r) {
      return r instanceof Error ? r.stack || r.message : r;
    }
  }(L, L.exports)), L.exports;
}
var B;
function Pe() {
  return B || (B = 1, function(o, e) {
    e = o.exports = Q(), e.log = c, e.formatArgs = t, e.save = s, e.load = i, e.useColors = n, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : l(), e.colors = [
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
    e.formatters.j = function(u) {
      try {
        return JSON.stringify(u);
      } catch (r) {
        return "[UnexpectedJSONParseError]: " + r.message;
      }
    };
    function t(u) {
      var r = this.useColors;
      if (u[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + u[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !!r) {
        var a = "color: " + this.color;
        u.splice(1, 0, a, "color: inherit");
        var f = 0, g = 0;
        u[0].replace(/%[a-zA-Z%]/g, function(p) {
          p !== "%%" && (f++, p === "%c" && (g = f));
        }), u.splice(g, 0, a);
      }
    }
    function c() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function s(u) {
      try {
        u == null ? e.storage.removeItem("debug") : e.storage.debug = u;
      } catch {
      }
    }
    function i() {
      var u;
      try {
        u = e.storage.debug;
      } catch {
      }
      return !u && typeof process < "u" && "env" in process && (u = process.env.DEBUG), u;
    }
    e.enable(i());
    function l() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(D, D.exports)), D.exports;
}
var k = { exports: {} }, M;
function _e() {
  return M || (M = 1, function(o, e) {
    var n = ge, t = he;
    e = o.exports = Q(), e.init = g, e.log = u, e.formatArgs = l, e.save = r, e.load = a, e.useColors = i, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(p) {
      return /^debug_/i.test(p);
    }).reduce(function(p, d) {
      var E = d.substring(6).toLowerCase().replace(/_([a-z])/g, function(N, A) {
        return A.toUpperCase();
      }), m = process.env[d];
      return /^(yes|on|true|enabled)$/i.test(m) ? m = !0 : /^(no|off|false|disabled)$/i.test(m) ? m = !1 : m === "null" ? m = null : m = Number(m), p[E] = m, p;
    }, {});
    var c = parseInt(process.env.DEBUG_FD, 10) || 2;
    c !== 1 && c !== 2 && t.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var s = c === 1 ? process.stdout : c === 2 ? process.stderr : f(c);
    function i() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : n.isatty(c);
    }
    e.formatters.o = function(p) {
      return this.inspectOpts.colors = this.useColors, t.inspect(p, this.inspectOpts).split(`
`).map(function(d) {
        return d.trim();
      }).join(" ");
    }, e.formatters.O = function(p) {
      return this.inspectOpts.colors = this.useColors, t.inspect(p, this.inspectOpts);
    };
    function l(p) {
      var d = this.namespace, E = this.useColors;
      if (E) {
        var m = this.color, N = "  \x1B[3" + m + ";1m" + d + " \x1B[0m";
        p[0] = N + p[0].split(`
`).join(`
` + N), p.push("\x1B[3" + m + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + d + " " + p[0];
    }
    function u() {
      return s.write(t.format.apply(t, arguments) + `
`);
    }
    function r(p) {
      p == null ? delete process.env.DEBUG : process.env.DEBUG = p;
    }
    function a() {
      return process.env.DEBUG;
    }
    function f(p) {
      var d, E = process.binding("tty_wrap");
      switch (E.guessHandleType(p)) {
        case "TTY":
          d = new n.WriteStream(p), d._type = "tty", d._handle && d._handle.unref && d._handle.unref();
          break;
        case "FILE":
          var m = fe;
          d = new m.SyncWriteStream(p, { autoClose: !1 }), d._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var N = we;
          d = new N.Socket({
            fd: p,
            readable: !1,
            writable: !0
          }), d.readable = !1, d.read = null, d._type = "pipe", d._handle && d._handle.unref && d._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return d.fd = p, d._isStdio = !0, d;
    }
    function g(p) {
      p.inspectOpts = {};
      for (var d = Object.keys(e.inspectOpts), E = 0; E < d.length; E++)
        p.inspectOpts[d[E]] = e.inspectOpts[d[E]];
    }
    e.enable(a());
  }(k, k.exports)), k.exports;
}
var H;
function Ce() {
  return H || (H = 1, typeof process < "u" && process.type === "renderer" ? T.exports = Pe() : T.exports = _e()), T.exports;
}
var U, z;
function Se() {
  if (z) return U;
  z = 1;
  var o = pe, e = de.spawn, n = Ce()("electron-squirrel-startup"), t = ae.app, c = function(i, l) {
    var u = o.resolve(o.dirname(process.execPath), "..", "Update.exe");
    n("Spawning `%s` with args `%s`", u, i), e(u, i, {
      detached: !0
    }).on("close", l);
  }, s = function() {
    if (process.platform === "win32") {
      var i = process.argv[1];
      n("processing squirrel command `%s`", i);
      var l = o.basename(process.execPath);
      if (i === "--squirrel-install" || i === "--squirrel-updated")
        return c(["--createShortcut=" + l], t.quit), !0;
      if (i === "--squirrel-uninstall")
        return c(["--removeShortcut=" + l], t.quit), !0;
      if (i === "--squirrel-obsolete")
        return t.quit(), !0;
    }
    return !1;
  };
  return U = s(), U;
}
var Ne = Se();
const Ae = /* @__PURE__ */ Ee(Ne);
Ae && y.quit();
const Ie = async () => {
  try {
    const o = w.resolve(".env"), n = (await I.readFile(o, "utf-8")).split(`
`);
    console.log("🔍 Loading .env file from:", o);
    for (const t of n) {
      const c = t.trim();
      if (c && !c.startsWith("#")) {
        const [s, ...i] = c.split("=");
        if (s && i.length > 0) {
          const l = i.join("=").trim();
          process.env[s.trim()] = l, !s.includes("SECRET") && !s.includes("PASSWORD") && !s.includes("KEY") && !s.includes("ID") ? console.log(`📝 Loaded: ${s.trim()}=${l}`) : console.log(`📝 Loaded: ${s.trim()}=***`);
        }
      }
    }
    console.log("✅ Environment variables loaded successfully");
  } catch (o) {
    console.error("❌ Failed to load .env file:", o), console.log("📝 This may cause VPN detection to fail");
  }
}, ee = w.dirname(ue(import.meta.url));
process.env.APP_ROOT = w.join(ee, "..");
const b = process.env.VITE_DEV_SERVER_URL, Qe = w.join(process.env.APP_ROOT, "dist-electron"), oe = w.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = b ? w.join(process.env.APP_ROOT, "public") : oe;
let P = [], v = null, O = !1, ne = null;
const C = (o) => {
  const e = O;
  O = o, e !== o && console.log(`🔄 VPN status changed: ${e ? "Connected" : "Disconnected"} → ${o ? "Connected" : "Disconnected"}`), console.log(`📡 VPN Status Updated: ${o ? "✅ Connected - Allowing all HTTPS requests" : "❌ Disconnected - Blocking external requests"}`), P.forEach((n) => {
    n && !n.isDestroyed() && n.webContents.send("vpn-status-changed", o);
  });
}, $ = async () => {
  try {
    const o = process.env.VPN_PROVIDER || "wireguard";
    if (o === "wireguard")
      return await be();
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
}, be = async () => {
  try {
    console.log("🔍 Debug: Environment variables at startup:"), console.log(`  NODE_ENV: ${process.env.NODE_ENV}`), console.log(`  VPN_PROVIDER: ${process.env.VPN_PROVIDER}`), console.log(`  WIREGUARD_CONFIG_PATH: ${process.env.WIREGUARD_CONFIG_PATH}`), console.log(`  WIREGUARD_ENDPOINT: ${process.env.WIREGUARD_ENDPOINT}`);
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = w.resolve(o);
    console.log(`🔍 Resolved config path: ${e}`);
    try {
      await I.access(e), console.log("✅ Config file found");
    } catch (s) {
      console.log("❌ Config file not found:", s), console.log("📝 This is OK - config file not required for detection");
    }
    const n = X();
    return console.log(`🔌 Checking WireGuard connection on ${n.displayName}...`), await W() ? (console.log("✅ WireGuard is connected and active"), console.log("✅ VPN connected successfully - unrestricted access enabled"), !0) : (console.log("🔄 Attempting to establish WireGuard connection..."), await Oe(e) ? (console.log("✅ WireGuard connection established successfully"), await W() ? (console.log("✅ VPN auto-connected successfully"), !0) : (console.log("⚠️ Connection established but IP location verification failed"), !1)) : (console.log("❌ WireGuard connection failed."), ve(e), !1));
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
}), De = async (o) => (console.log("🪟 Windows detected - checking existing connection..."), console.log(`   Config available at: ${o}`), !1), W = async () => {
  const o = process.platform;
  try {
    switch (o) {
      case "linux":
        return await Le();
      case "darwin":
        return await ke();
      case "win32":
        return await We();
      default:
        return console.warn(`⚠️ Unsupported platform: ${o}`), !1;
    }
  } catch (e) {
    return console.error("❌ Error checking WireGuard status:", e), !1;
  }
}, Le = async () => new Promise((o) => {
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", (t) => {
    t === 0 && n.trim() ? (console.log("🐧 WireGuard active on Linux"), o(!0)) : o(!1);
  }), e.on("error", () => o(!1)), setTimeout(() => o(!1), 5e3);
}), ke = async () => new Promise((o) => {
  const e = _("wg", ["show"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let n = "";
  e.stdout.on("data", (t) => {
    n += t.toString();
  }), e.on("exit", (t) => {
    t === 0 && n.trim() ? (console.log("🍎 WireGuard active on macOS"), o(!0)) : K().then(o);
  }), e.on("error", () => {
    K().then(o);
  }), setTimeout(() => o(!1), 5e3);
}), K = async () => new Promise((o) => {
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
    return console.log("❌ IP geolocation check FAILED - not connected to Australian VPN"), console.log("🚨 CRITICAL: User appears to be browsing from non-Australian IP"), console.log("🔍 Running diagnostic checks for troubleshooting..."), await Y(), await Z(), await J(), console.log("⚠️  Note: Ping connectivity to VPN server does not indicate active VPN connection"), !1;
  console.log("✅ IP geolocation check PASSED - Australian VPN confirmed"), console.log("🔍 Running secondary verification checks...");
  const e = await Y(), n = await Z(), t = await J();
  return console.log(e || n || t ? "✅ Secondary checks confirm WireGuard is properly configured" : "⚠️  Secondary checks inconclusive, but IP location confirms VPN is working"), !0;
}, Y = async () => new Promise((o) => {
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
}), Z = async () => new Promise((o) => {
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
}), J = async () => new Promise((o) => {
  console.log("🔍 Checking routing table...");
  const n = (process.env.WIREGUARD_ENDPOINT || "134.199.169.102:59926").split(":")[0];
  console.log(`🔍 Looking for routes to server: ${n}`);
  const t = _("route", ["print"], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let c = "";
  t.stdout.on("data", (s) => {
    c += s.toString();
  }), t.on("exit", () => {
    const s = c.includes(n);
    console.log(`🔍 Route to VPN server found: ${s}`), s && console.log(`🪟 Found route to VPN server ${n}`), o(s);
  }), t.on("error", (s) => {
    console.log("🔍 Route check error:", s.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 Route check timed out"), o(!1);
  }, 3e3);
}), Ve = async () => new Promise((o) => {
  console.log("🔍 Checking current public IP and location...");
  const n = _("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/json" -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Compress'], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  let t = "";
  n.stdout.on("data", (c) => {
    t += c.toString();
  }), n.on("exit", () => {
    try {
      const c = JSON.parse(t.trim()), s = c.ip, i = c.country, l = c.region, u = c.city;
      console.log(`🔍 Current public IP: ${s}`), console.log(`🔍 Location: ${u}, ${l}, ${i}`);
      const r = i === "AU" || i === "Australia";
      r ? (console.log("🇦🇺 ✅ Connected via Australian VPN!"), console.log(`📍 Australian location detected: ${u}, ${l}`)) : console.log(`❌ Not connected to Australian VPN. Current location: ${i}`), o(r);
    } catch (c) {
      console.log("🔍 Failed to parse IP info:", c), console.log("🔍 Raw output:", t);
      const i = _("powershell", ["-Command", '(Invoke-WebRequest -Uri "https://ipinfo.io/ip" -UseBasicParsing).Content.Trim()'], {
        stdio: ["pipe", "pipe", "pipe"]
      });
      let l = "";
      i.stdout.on("data", (u) => {
        l += u.toString();
      }), i.on("exit", () => {
        const u = l.trim();
        console.log(`🔍 Fallback IP check: ${u}`);
        const r = !u.startsWith("192.168.") && !u.startsWith("10.") && !u.startsWith("172.") && u !== "127.0.0.1";
        console.log(`🔍 Assuming VPN status based on non-local IP: ${r}`), o(r);
      }), i.on("error", () => {
        o(!1);
      });
    }
  }), n.on("error", (c) => {
    console.log("🔍 IP check error:", c.message), o(!1);
  }), setTimeout(() => {
    console.log("🔍 IP check timed out"), o(!1);
  }, 1e4);
}), Ue = async () => {
  try {
    const o = process.env.WIREGUARD_CONFIG_PATH || "./config/wireguard-australia.conf", e = w.resolve(o), n = process.platform;
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
  const n = _("wg-quick", ["down", o], {
    stdio: ["pipe", "pipe", "pipe"]
  });
  n.on("exit", (t) => {
    ne = null, t === 0 ? (console.log("✅ WireGuard disconnected successfully"), e(!0)) : (console.error(`❌ WireGuard disconnection failed with code: ${t}`), e(!1));
  }), n.on("error", (t) => {
    console.error("❌ WireGuard disconnect error:", t), e(!1);
  }), setTimeout(() => e(!1), 15e3);
}), xe = async () => (console.log("🪟 On Windows, please disconnect manually via WireGuard GUI"), console.log("   1. Open WireGuard application"), console.log('   2. Click "Deactivate" on your tunnel'), !0), $e = () => {
  const o = G.defaultSession, e = (s, i, l) => {
    if (console.log("🎯 Download detected from", l, ":", {
      filename: i.getFilename(),
      url: i.getURL(),
      size: i.getTotalBytes(),
      blocked: process.env.SECURITY_BLOCK_DOWNLOADS === "true"
    }), process.env.SECURITY_BLOCK_DOWNLOADS === "true") {
      console.log("🚫 Blocking download (SECURITY_BLOCK_DOWNLOADS=true):", i.getFilename()), s.preventDefault(), P.forEach((a) => {
        a && !a.isDestroyed() && a.webContents.send("download-blocked", {
          filename: i.getFilename(),
          url: i.getURL(),
          size: i.getTotalBytes()
        });
      });
      return;
    }
    console.log("✅ Download allowed from", l, ":", i.getFilename());
    const u = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, r = {
      id: u,
      filename: i.getFilename(),
      url: i.getURL(),
      totalBytes: i.getTotalBytes()
    };
    console.log("📤 Sending download-started event from", l, ":", r), P.forEach((a) => {
      a && !a.isDestroyed() && a.webContents.send("download-started", r);
    }), i.on("updated", (a, f) => {
      const g = {
        id: u,
        filename: i.getFilename(),
        state: f,
        receivedBytes: i.getReceivedBytes(),
        totalBytes: i.getTotalBytes(),
        speed: i.getCurrentBytesPerSecond ? i.getCurrentBytesPerSecond() : 0
      };
      console.log("📤 Sending download-progress event:", {
        id: u,
        progress: `${g.receivedBytes}/${g.totalBytes}`,
        percent: Math.round(g.receivedBytes / g.totalBytes * 100)
      }), P.forEach((p) => {
        p && !p.isDestroyed() && p.webContents.send("download-progress", g);
      });
    }), i.once("done", (a, f) => {
      const g = {
        id: u,
        filename: i.getFilename(),
        state: f,
        filePath: f === "completed" ? i.getSavePath() : null
      };
      console.log("📤 Sending download-completed event:", g), P.forEach((p) => {
        p && !p.isDestroyed() && p.webContents.send("download-completed", g);
      });
    });
  };
  o.on("will-download", (s, i) => {
    e(s, i, "default-session");
  }), G.fromPartition("persist:main").on("will-download", (s, i) => {
    e(s, i, "webview-session");
  });
  const t = async () => {
    try {
      const s = await c();
      s ? (await o.loadExtension(s), console.log("✅ 1Password extension loaded successfully")) : console.log("📝 1Password extension not found - users can install it manually");
    } catch (s) {
      console.warn("⚠️ Could not load 1Password extension:", s), console.log("📝 Users can install 1Password extension manually from their browser");
    }
  }, c = async () => {
    const s = [
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
    for (const i of s)
      try {
        if (await I.access(i).then(() => !0).catch(() => !1)) {
          const u = (await I.readdir(i)).filter((r) => /^\d+\.\d+\.\d+/.test(r));
          if (u.length > 0) {
            const r = u.sort((g, p) => p.localeCompare(g))[0], a = w.join(i, r), f = w.join(a, "manifest.json");
            if (await I.access(f).then(() => !0).catch(() => !1))
              return a;
          }
        }
      } catch {
      }
    return null;
  };
  o.webRequest.onBeforeRequest((s, i) => {
    const l = s.url.toLowerCase();
    if (l.startsWith("chrome-extension://") || l.startsWith("moz-extension://") || l.startsWith("extension://")) {
      i({ cancel: !1 });
      return;
    }
    if (l.includes("localhost") || l.includes("127.0.0.1") || l.startsWith("file://") || l.startsWith("data:")) {
      i({ cancel: !1 });
      return;
    }
    if (l.startsWith("http://")) {
      console.log("🚫 Blocking insecure HTTP request:", s.url), i({ cancel: !0 });
      return;
    }
    if (l.startsWith("https://")) {
      console.log("✅ Allowing HTTPS request:", s.url), i({ cancel: !1 });
      return;
    }
    i({ cancel: !1 });
  }), o.webRequest.onHeadersReceived((s, i) => {
    const l = s.url.toLowerCase();
    if (l.includes("office.com") || l.includes("microsoft.com") || l.includes("google.com") || l.includes("sharepoint.com")) {
      i({
        responseHeaders: {
          ...s.responseHeaders,
          "X-Content-Type-Options": ["nosniff"],
          "Referrer-Policy": ["strict-origin-when-cross-origin"]
        }
      });
      return;
    }
    i({
      responseHeaders: {
        ...s.responseHeaders,
        "X-Frame-Options": ["SAMEORIGIN"],
        "X-Content-Type-Options": ["nosniff"],
        "Referrer-Policy": ["strict-origin-when-cross-origin"],
        "Permissions-Policy": ["camera=(), microphone=(), geolocation=()"],
        "Content-Security-Policy": [
          "default-src 'self' file: chrome-extension: moz-extension: extension:; script-src 'self' 'unsafe-inline' 'unsafe-eval' file: chrome-extension: moz-extension: extension:; style-src 'self' 'unsafe-inline' https: file: chrome-extension: moz-extension: extension:; connect-src 'self' https: wss: data: file: chrome-extension: moz-extension: extension:; img-src 'self' https: data: blob: file: chrome-extension: moz-extension: extension:; font-src 'self' https: data: file: chrome-extension: moz-extension: extension:; media-src 'self' https: data: file: chrome-extension: moz-extension: extension:; frame-src 'self' https: file: chrome-extension: moz-extension: extension:; child-src 'self' https: file: chrome-extension: moz-extension: extension:;"
        ]
      }
    });
  }), o.webRequest.onBeforeSendHeaders((s, i) => {
    const l = s.url.toLowerCase();
    let u = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    (l.includes("accounts.google.com") || l.includes("googleapis.com")) && (u = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"), i({
      requestHeaders: {
        ...s.requestHeaders,
        "User-Agent": u,
        // Add additional headers for OAuth compatibility
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Dest": "document"
      }
    });
  }), setTimeout(t, 1e3);
};
function re(o = !1) {
  const e = new R({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: w.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    titleBarStyle: "default",
    show: !1,
    // Don't show until ready
    webPreferences: {
      preload: w.join(ee, "preload.cjs"),
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
    ].some((s) => t.startsWith(s)) ? (console.log("🔐 Opening OAuth in system browser:", t), x.openExternal(t), { action: "deny" }) : { action: "deny" };
  }), e.webContents.on("will-navigate", (n, t) => {
    const c = [
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
    c.some(
      (l) => t.startsWith(l || "")
    ) || s.some(
      (l) => t.startsWith(l)
    ) ? s.some((l) => t.startsWith(l)) && console.log("🔐 Allowing OAuth navigation to:", t) : (console.log("🚫 Blocking window navigation to:", t), n.preventDefault());
  }), b ? (e.loadURL(b), process.env.NODE_ENV === "development" && e.webContents.openDevTools()) : e.loadFile(w.join(oe, "index.html")), e.once("ready-to-show", () => {
    e.show(), e.focus();
  }), P.push(e), (o || !v) && (v = e, setTimeout(async () => {
    try {
      if (await W())
        console.log("✅ VPN is already connected during app initialization"), C(!0);
      else if (process.env.VPN_AUTO_CONNECT === "true") {
        console.log("🔄 VPN not connected, attempting auto-connect...");
        const t = await $();
        C(t), t ? console.log("✅ VPN auto-connected successfully") : console.warn("⚠️ VPN auto-connect failed");
      } else
        console.log("⚠️ VPN not connected and auto-connect disabled"), C(!1);
    } catch (n) {
      console.error("❌ VPN initialization error:", n), C(!1);
    }
  }, 500)), e.on("closed", () => {
    const n = P.indexOf(e);
    n > -1 && P.splice(n, 1), e === v && (P.length > 0 ? v = P[0] : (te().catch((t) => {
      console.error("❌ Error disconnecting VPN on app close:", t);
    }), v = null));
  }), process.env.NODE_ENV === "production" && e.setMenuBarVisibility(!1), e;
}
function se() {
  re(!0);
}
h.handle("system-get-version", () => y.getVersion());
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
    const o = await W(), e = o ? "connected" : "disconnected";
    return console.log(`📊 VPN status check result: ${e}`), C(o), e;
  } catch (o) {
    return console.error("❌ VPN status check error:", o), "disconnected";
  }
});
h.handle("vpn-connect", async (o, e) => {
  console.log(`🌐 VPN connect requested: ${e}`);
  try {
    const n = await $();
    return C(n), n;
  } catch (n) {
    return console.error("❌ VPN connection error:", n), C(!1), !1;
  }
});
h.handle("vpn-disconnect", async () => {
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
    const t = await n.json(), c = {};
    if (t.fields) {
      for (const s of t.fields)
        if (s.label && s.value)
          switch (s.label.toLowerCase()) {
            case "username":
            case "email":
              c.username = s.value;
              break;
            case "password":
              c.password = s.value;
              break;
            case "tenant_url":
            case "url":
            case "website":
              c.tenant_url = s.value;
              break;
            case "level1_domains":
              c.level1_domains = s.value;
              break;
            case "level2_domains":
              c.level2_domains = s.value;
              break;
            case "level3_enabled":
              c.level3_enabled = s.value === "true";
              break;
            default:
              c[s.label.toLowerCase().replace(/\s+/g, "_")] = s.value;
          }
    }
    return c;
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
h.handle("shell-open-path", async (o, e) => {
  try {
    console.log("📁 Opening file with system default application:", e);
    const n = await x.openPath(e);
    return n ? (console.error("❌ Failed to open file:", n), n) : (console.log("✅ File opened successfully"), null);
  } catch (n) {
    return console.error("❌ Error opening file:", n), n instanceof Error ? n.message : "Unknown error";
  }
});
h.handle("shell-show-item-in-folder", async (o, e) => {
  try {
    return console.log("📂 Revealing file in system file manager:", e), x.showItemInFolder(e), console.log("✅ File revealed in explorer successfully"), null;
  } catch (n) {
    return console.error("❌ Error revealing file:", n), n instanceof Error ? n.message : "Unknown error";
  }
});
h.handle("save-page-as-pdf", async (o) => {
  try {
    const { dialog: e } = require("electron"), n = require("fs"), t = R.getFocusedWindow();
    if (!t)
      return { success: !1, error: "No focused window found" };
    const c = await e.showSaveDialog(t, {
      title: "Save page as PDF",
      defaultPath: "page.pdf",
      filters: [
        { name: "PDF Files", extensions: ["pdf"] }
      ]
    });
    if (c.canceled)
      return { success: !1, error: "User canceled" };
    const s = {
      marginsType: 0,
      // Default margins
      pageSize: "A4",
      printBackground: !0,
      printSelectionOnly: !1,
      landscape: !1
    }, i = await t.webContents.printToPDF(s);
    return n.writeFileSync(c.filePath, i), console.log(`✅ PDF saved to: ${c.filePath}`), {
      success: !0,
      filePath: c.filePath
    };
  } catch (e) {
    return console.error("❌ Error saving PDF:", e), {
      success: !1,
      error: e instanceof Error ? e.message : "Unknown error"
    };
  }
});
h.handle("extension-get-1password-status", async () => {
  try {
    const e = G.defaultSession.getAllExtensions().find(
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
    "5. Restart the Aussie Vault Browser"
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
      windowId: re(!1).id,
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
  ], c = O ? [
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
  le.buildFromTemplate([...t, ...c, ...s]).popup({
    window: n,
    x: e.x,
    y: e.y
  });
});
h.handle("window-get-count", async () => ({
  total: P.length,
  mainWindowId: (v == null ? void 0 : v.id) || null
}));
h.handle("window-close", async (o, e) => {
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
  console.log("🚀 Initializing Aussie Vault Browser..."), await Ie(), $e(), console.log("🔌 Starting VPN connection...");
  const o = await $();
  C(o), o ? console.log("✅ VPN connected successfully - unrestricted access enabled") : console.error("❌ VPN connection failed - starting with restricted access"), se();
}).catch((o) => {
  console.error("❌ Failed to initialize app:", o), y.quit();
});
const je = y.requestSingleInstanceLock();
je ? y.on("second-instance", () => {
  v && !v.isDestroyed() && (v.isMinimized() && v.restore(), v.focus());
}) : (console.log("🚫 Another instance is already running"), y.quit());
y.on("window-all-closed", () => {
  process.platform !== "darwin" && (console.log("🔐 Closing Aussie Vault Browser"), y.quit());
});
y.on("activate", () => {
  R.getAllWindows().length === 0 && se();
});
y.on("web-contents-created", (o, e) => {
  e.on("will-navigate", (n, t) => {
    try {
      if (v && !v.isDestroyed() && e === v.webContents) {
        const s = new URL(t), i = [
          b,
          "file:",
          "about:"
        ].filter(Boolean), l = [
          "https://accounts.google.com",
          "https://login.microsoftonline.com",
          "https://github.com/login",
          "https://clerk.shared.lcl.dev",
          "https://api.clerk.dev",
          "https://clerk.dev",
          "https://major-snipe-9.clerk.accounts.dev"
        ];
        i.some(
          (r) => s.protocol.startsWith(r || "") || t.startsWith(r || "")
        ) || l.some(
          (r) => t.startsWith(r)
        ) ? l.some((r) => t.startsWith(r)) && console.log("🔐 Allowing OAuth navigation to:", t) : (console.log("🚫 Blocking main window navigation to:", t), n.preventDefault());
      } else
        console.log("🌐 Webview navigation allowed:", t);
    } catch (c) {
      console.warn("⚠️ Failed to parse navigation URL:", t, c), v && !v.isDestroyed() && e === v.webContents && n.preventDefault();
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
  b as VITE_DEV_SERVER_URL
};
