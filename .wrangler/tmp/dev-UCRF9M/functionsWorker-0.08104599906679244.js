var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-vb0umd/functionsWorker-0.08104599906679244.mjs
import { Writable } from "node:stream";
import { EventEmitter } from "node:events";
import libDefault from "crypto";
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn, res, err) => /* @__PURE__ */ __name(function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
}, "__init"), "__esm");
var __commonJS = /* @__PURE__ */ __name((cb, mod) => /* @__PURE__ */ __name(function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
}, "__require"), "__commonJS");
var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
}, "__copyProps");
var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
)), "__toESM");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");
var init_utils = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name2(createNotImplementedError, "createNotImplementedError");
    __name2(notImplemented, "notImplemented");
    __name2(notImplementedClass, "notImplementedClass");
  }
});
var _timeOrigin;
var _performanceNow;
var nodeTiming;
var PerformanceEntry;
var PerformanceMark;
var PerformanceMeasure;
var PerformanceResourceTiming;
var PerformanceObserverEntryList;
var Performance;
var PerformanceObserver;
var performance;
var init_performance = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      static {
        __name2(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark2");
      }
      static {
        __name2(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      static {
        __name2(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      static {
        __name2(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      static {
        __name2(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      static {
        __name2(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw /* @__PURE__ */ createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw /* @__PURE__ */ createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw /* @__PURE__ */ createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw /* @__PURE__ */ createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      static {
        __name2(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw /* @__PURE__ */ createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});
var init_perf_hooks = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});
var init_performance2 = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    if (!("__unenv__" in performance)) {
      const proto = Performance.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== "constructor" && !(key in performance)) {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc) {
            Object.defineProperty(performance, key, desc);
          }
        }
      }
    }
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});
var noop_default;
var init_noop = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});
var _console;
var _ignoreErrors;
var _stderr;
var _stdout;
var log;
var info;
var trace;
var debug;
var table;
var error;
var warn;
var createTask;
var clear;
var count;
var countReset;
var dir;
var dirxml;
var group;
var groupEnd;
var groupCollapsed;
var profile;
var profileEnd;
var time;
var timeEnd;
var timeLog;
var timeStamp;
var Console;
var _times;
var _stdoutErrorHandler;
var _stderrErrorHandler;
var init_console = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});
var workerdConsole;
var assert;
var clear2;
var context;
var count2;
var countReset2;
var createTask2;
var debug2;
var dir2;
var dirxml2;
var error2;
var group2;
var groupCollapsed2;
var groupEnd2;
var info2;
var log2;
var profile2;
var profileEnd2;
var table2;
var time2;
var timeEnd2;
var timeLog2;
var timeStamp2;
var trace2;
var warn2;
var console_default;
var init_console2 = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});
var hrtime;
var init_hrtime = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint"), "bigint") });
  }
});
var ReadStream;
var init_read_stream = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      static {
        __name2(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});
var WriteStream;
var init_write_stream = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      static {
        __name2(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});
var init_tty = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});
var NODE_VERSION;
var init_node_version = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});
var Process;
var init_process = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "_Process");
      }
      static {
        __name2(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw /* @__PURE__ */ createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw /* @__PURE__ */ createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw /* @__PURE__ */ createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw /* @__PURE__ */ createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw /* @__PURE__ */ createNotImplementedError("process.kill");
      }
      abort() {
        throw /* @__PURE__ */ createNotImplementedError("process.abort");
      }
      dlopen() {
        throw /* @__PURE__ */ createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw /* @__PURE__ */ createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw /* @__PURE__ */ createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw /* @__PURE__ */ createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw /* @__PURE__ */ createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw /* @__PURE__ */ createNotImplementedError("process.openStdin");
      }
      assert() {
        throw /* @__PURE__ */ createNotImplementedError("process.assert");
      }
      binding() {
        throw /* @__PURE__ */ createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});
var globalProcess;
var getBuiltinModule;
var workerdProcess;
var unenvProcess;
var exit;
var features;
var platform;
var _channel;
var _debugEnd;
var _debugProcess;
var _disconnect;
var _events;
var _eventsCount;
var _exiting;
var _fatalException;
var _getActiveHandles;
var _getActiveRequests;
var _handleQueue;
var _kill;
var _linkedBinding;
var _maxListeners;
var _pendingMessage;
var _preload_modules;
var _rawDebug;
var _send;
var _startProfilerIdleNotifier;
var _stopProfilerIdleNotifier;
var _tickCallback;
var abort;
var addListener;
var allowedNodeEnvironmentFlags;
var arch;
var argv;
var argv0;
var assert2;
var availableMemory;
var binding;
var channel;
var chdir;
var config;
var connected;
var constrainedMemory;
var cpuUsage;
var cwd;
var debugPort;
var disconnect;
var dlopen;
var domain;
var emit;
var emitWarning;
var env;
var eventNames;
var execArgv;
var execPath;
var exitCode;
var finalization;
var getActiveResourcesInfo;
var getegid;
var geteuid;
var getgid;
var getgroups;
var getMaxListeners;
var getuid;
var hasUncaughtExceptionCaptureCallback;
var hrtime3;
var initgroups;
var kill;
var listenerCount;
var listeners;
var loadEnvFile;
var mainModule;
var memoryUsage;
var moduleLoadList;
var nextTick;
var off;
var on;
var once;
var openStdin;
var permission;
var pid;
var ppid;
var prependListener;
var prependOnceListener;
var rawListeners;
var reallyExit;
var ref;
var release;
var removeAllListeners;
var removeListener;
var report;
var resourceUsage;
var send;
var setegid;
var seteuid;
var setgid;
var setgroups;
var setMaxListeners;
var setSourceMapsEnabled;
var setuid;
var setUncaughtExceptionCaptureCallback;
var sourceMapsEnabled;
var stderr;
var stdin;
var stdout;
var throwDeprecation;
var title;
var traceDeprecation;
var umask;
var unref;
var uptime;
var version;
var versions;
var _process;
var process_default;
var init_process2 = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});
var require_cloudflare = __commonJS({
  "../backend/lib/cloudflare.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function espelharAmbiente(env2) {
      if (!env2 || typeof process === "undefined" || !process.env) return;
      for (const chave of Object.keys(env2)) {
        const valor = env2[chave];
        if (typeof valor === "string") process.env[chave] = valor;
      }
    }
    __name(espelharAmbiente, "espelharAmbiente");
    __name2(espelharAmbiente, "espelharAmbiente");
    async function montarRequisicao(request) {
      const url = new URL(request.url);
      const cabecalhos = {};
      for (const [nome, valor] of request.headers) cabecalhos[nome.toLowerCase()] = valor;
      let corpo = null;
      if (request.method !== "GET" && request.method !== "HEAD") {
        const texto = await request.text();
        if (texto) {
          try {
            corpo = JSON.parse(texto);
          } catch {
            corpo = texto;
          }
        }
      }
      return {
        method: request.method,
        // As rotas usam req.url com caminho + query, como no Node.
        url: url.pathname + url.search,
        headers: cabecalhos,
        body: corpo,
        socket: {
          // A Cloudflare entrega o IP real neste cabeçalho.
          remoteAddress: cabecalhos["cf-connecting-ip"] || cabecalhos["x-forwarded-for"] || "desconhecido"
        }
      };
    }
    __name(montarRequisicao, "montarRequisicao");
    __name2(montarRequisicao, "montarRequisicao");
    function montarResposta() {
      const estado = { status: 200, cabecalhos: new Headers(), corpo: null, terminou: false };
      const res = {
        get headersSent() {
          return estado.terminou;
        },
        setHeader(nome, valor) {
          estado.cabecalhos.set(nome, valor);
          return res;
        },
        status(codigo) {
          estado.status = codigo;
          return res;
        },
        send(corpo) {
          estado.corpo = corpo == null ? null : typeof corpo === "string" ? corpo : JSON.stringify(corpo);
          estado.terminou = true;
          return res;
        },
        json(corpo) {
          estado.cabecalhos.set("Content-Type", "application/json; charset=utf-8");
          return res.send(JSON.stringify(corpo));
        },
        end() {
          estado.terminou = true;
          return res;
        }
      };
      return { res, estado };
    }
    __name(montarResposta, "montarResposta");
    __name2(montarResposta, "montarResposta");
    function paraCloudflare(rota7) {
      return async ({ request, env: env2 }) => {
        espelharAmbiente(env2);
        const req = await montarRequisicao(request);
        const { res, estado } = montarResposta();
        try {
          await rota7(req, res);
        } catch (e) {
          console.error("[cloudflare] rota falhou:", e);
          if (!estado.terminou) {
            estado.status = 500;
            estado.cabecalhos.set("Content-Type", "application/json; charset=utf-8");
            estado.corpo = JSON.stringify({
              ok: false,
              erro: "Alguma coisa falhou do nosso lado. Tente de novo em instantes."
            });
          }
        }
        return new Response(estado.corpo, { status: estado.status, headers: estado.cabecalhos });
      };
    }
    __name(paraCloudflare, "paraCloudflare");
    __name2(paraCloudflare, "paraCloudflare");
    module.exports = { paraCloudflare, espelharAmbiente };
  }
});
var require_http = __commonJS({
  "../backend/lib/http.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function origensPermitidas() {
      const lista = [
        process.env.SITE_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        // Desenvolvimento local.
        "http://localhost:3000",
        "http://localhost:4321",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4321"
      ].filter(Boolean);
      return [...new Set(lista.map((u) => u.replace(/\/$/, "")))];
    }
    __name(origensPermitidas, "origensPermitidas");
    __name2(origensPermitidas, "origensPermitidas");
    function aplicarCabecalhos(req, res) {
      const origem = (req.headers.origin || "").replace(/\/$/, "");
      if (origem && origensPermitidas().includes(origem)) {
        res.setHeader("Access-Control-Allow-Origin", origem);
        res.setHeader("Vary", "Origin");
      }
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Referrer-Policy", "no-referrer");
      res.setHeader("Cache-Control", "no-store");
    }
    __name(aplicarCabecalhos, "aplicarCabecalhos");
    __name2(aplicarCabecalhos, "aplicarCabecalhos");
    function json(res, status, corpo) {
      res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
      res.send(JSON.stringify(corpo));
    }
    __name(json, "json");
    __name2(json, "json");
    function erro(res, status, mensagem, campos) {
      json(res, status, { ok: false, erro: mensagem, campos: campos || void 0 });
    }
    __name(erro, "erro");
    __name2(erro, "erro");
    async function lerCorpo(req) {
      if (req.body && typeof req.body === "object") return req.body;
      if (typeof req.body === "string" && req.body) {
        try {
          return JSON.parse(req.body);
        } catch {
          return null;
        }
      }
      const pedacos = [];
      let tamanho = 0;
      for await (const pedaco of req) {
        tamanho += pedaco.length;
        if (tamanho > 64 * 1024) throw new Error("corpo grande demais");
        pedacos.push(pedaco);
      }
      if (!pedacos.length) return null;
      try {
        return JSON.parse(Buffer.concat(pedacos).toString("utf8"));
      } catch {
        return null;
      }
    }
    __name(lerCorpo, "lerCorpo");
    __name2(lerCorpo, "lerCorpo");
    function ipDoPedido(req) {
      const encaminhado = req.headers["x-forwarded-for"];
      if (typeof encaminhado === "string" && encaminhado) return encaminhado.split(",")[0].trim();
      return req.socket?.remoteAddress || "desconhecido";
    }
    __name(ipDoPedido, "ipDoPedido");
    __name2(ipDoPedido, "ipDoPedido");
    function rota7(metodosAceitos, handler) {
      return async (req, res) => {
        aplicarCabecalhos(req, res);
        if (req.method === "OPTIONS") return res.status(204).end();
        if (!metodosAceitos.includes(req.method)) {
          return erro(res, 405, `M\xE9todo ${req.method} n\xE3o \xE9 aceito aqui.`);
        }
        try {
          await handler(req, res);
        } catch (e) {
          console.error("[begonia] falha n\xE3o tratada:", e);
          if (!res.headersSent) {
            erro(res, 500, "Alguma coisa falhou do nosso lado. Tente de novo em instantes.");
          }
        }
      };
    }
    __name(rota7, "rota7");
    __name2(rota7, "rota");
    module.exports = { rota: rota7, json, erro, lerCorpo, ipDoPedido, origensPermitidas };
  }
});
var require_crypto = __commonJS({
  "node-built-in-modules:crypto"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault;
  }
});
var require_dados = __commonJS({
  "../frontend/js/dados.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ATELIE = {
      nome: "Beg\xF4nia Ateli\xEA",
      // Formato internacional, só dígitos: 55 + DDD + número.
      // CONFERIR: o número informado foi +55 45 9852-4129, que dá 8 dígitos
      // depois do DDD. Celular no Brasil tem 9 — provavelmente falta um dígito
      // e o certo é 45 99852-4129 (ou seja, "5545998524129"). Enquanto isso não
      // for confirmado, todo botão de WhatsApp do site aponta para o número
      // abaixo, do jeito que veio.
      whatsapp: "554598524129",
      instagram: "https://www.instagram.com/begonia.ateliee/",
      // TROCAR: ainda são exemplos.
      email: "contato@begoniaatelie.com.br",
      cidade: "S\xE3o Paulo, SP",
      horario: "Segunda a sexta, das 9h \xE0s 18h"
    };
    function linkWhatsApp(mensagem) {
      return `https://wa.me/${ATELIE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
    }
    __name(linkWhatsApp, "linkWhatsApp");
    __name2(linkWhatsApp, "linkWhatsApp");
    function formatarPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
      });
    }
    __name(formatarPreco, "formatarPreco");
    __name2(formatarPreco, "formatarPreco");
    var CATEGORIAS = [
      { id: "decoracao", nome: "Decora\xE7\xE3o" },
      { id: "mesa", nome: "Mesa posta" },
      { id: "acessorios", nome: "Acess\xF3rios" }
    ];
    var PRODUTOS = [
      /* ---------------------------------------------------------------- MESA */
      {
        slug: "sousplat-trancado",
        nome: "Sousplat Tran\xE7ado",
        preco: 45,
        precoPorQuantidade: { 1: 45, 2: 88, 4: 170, 6: 245 },
        categoria: "mesa",
        disponibilidade: "encomenda",
        destaque: true,
        tags: [],
        fotos: [
          "sousplat-verde-salvia-01-conjunto.jpeg",
          "sousplat-verde-salvia-02-com-porta-copos.jpeg",
          "sousplat-verde-salvia-03-detalhe.jpeg",
          "sousplat-verde-salvia-04-avulso.jpeg"
        ],
        alt: "Sousplat de croch\xEA em verde s\xE1lvia com borda tran\xE7ada em relevo, ao lado de porta-copos do mesmo fio.",
        resumo: "Borda tran\xE7ada em relevo, 37 cm. Escolha a cor da sua mesa.",
        descricao: "A borda tran\xE7ada \xE9 feita depois do disco pronto, ponto a ponto, e \xE9 o que d\xE1 o relevo que aparece na foto. Combina com o porta-copos do mesmo fio, que \xE9 vendido \xE0 parte.",
        materiais: ["Fio de algod\xE3o", "Borda tran\xE7ada em relevo", "Cor \xE0 sua escolha"],
        medidas: "Aproximadamente 37 cm de di\xE2metro.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal", "N\xE3o usar alvejante"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "porta-copos-trancado",
        nome: "Porta-copos Tran\xE7ado",
        preco: 16,
        precoPorQuantidade: { 1: 16, 2: 30, 4: 60 },
        categoria: "mesa",
        disponibilidade: "encomenda",
        destaque: false,
        tags: [],
        fotos: ["sousplat-verde-salvia-02-com-porta-copos.jpeg", "sousplat-verde-salvia-01-conjunto.jpeg"],
        alt: "Porta-copos de croch\xEA em verde s\xE1lvia com borda tran\xE7ada, sobre mesa clara.",
        resumo: "O par do Sousplat Tran\xE7ado, no mesmo fio e na mesma borda.",
        descricao: "Feito para acompanhar o Sousplat Tran\xE7ado. Pode ser pedido junto ou sozinho, na mesma cor ou em outra.",
        materiais: ["Fio de algod\xE3o", "Borda tran\xE7ada em relevo", "Cor \xE0 sua escolha"],
        medidas: "Aproximadamente 11 cm de di\xE2metro.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "sousplat-jade",
        nome: "Sousplat Jade",
        preco: 40,
        precoPorQuantidade: { 1: 40, 2: 75, 4: 140, 6: 205 },
        categoria: "mesa",
        disponibilidade: "encomenda",
        destaque: true,
        tags: [],
        fotos: [
          "sousplat-verde-militar-dourado-01-jogo.jpeg",
          "sousplat-verde-militar-dourado-02-leque.jpeg",
          "sousplat-verde-militar-dourado-03-detalhe.jpeg",
          "sousplat-verde-militar-dourado-04-detalhe.jpeg"
        ],
        alt: "Jogo de sousplats de croch\xEA em verde militar com acabamento em fio dourado, sobre toalha branca.",
        resumo: "Desenho vazado com acabamento em fio met\xE1lico, 37 cm.",
        descricao: "O miolo \xE9 vazado em desenho de leque, e a borda leva um fio met\xE1lico que pega a luz da mesa. Escolha a cor do corpo e a do acabamento.",
        materiais: ["Fio de algod\xE3o", "Acabamento em fio met\xE1lico", "Cor \xE0 sua escolha"],
        medidas: "Aproximadamente 37 cm de di\xE2metro.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal", "N\xE3o usar alvejante"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "sousplat-tradicional",
        nome: "Sousplat Tradicional",
        preco: 25,
        precoPorQuantidade: { 1: 25, 2: 45, 4: 95, 6: 140 },
        categoria: "mesa",
        disponibilidade: "encomenda",
        destaque: true,
        tags: [],
        fotos: [
          "sousplat-rosa-01-conjunto.jpeg",
          "sousplat-rosa-02-conjunto.jpeg",
          "sousplat-rosa-03-detalhe-ponto.jpeg",
          "sousplat-rosa-04-par.jpeg",
          "sousplat-cru-borda-terracota-01.jpeg",
          "sousplat-cru-borda-terracota-02.jpeg"
        ],
        alt: "Sousplats de croch\xEA em rosa antigo com borda ondulada, empilhados sobre toalha branca.",
        resumo: "Ponto leque com borda ondulada, 37 cm. A cor \xE9 voc\xEA quem escolhe.",
        descricao: "O modelo mais pedido da casa e o mais leve de compor: ponto leque aberto, borda ondulada, e uma cor s\xF3. Tamb\xE9m sai com a borda em contraste, como na foto em cru com terracota.",
        materiais: ["Fio de algod\xE3o", "Ponto leque com borda ondulada", "Cor \xE0 sua escolha"],
        medidas: "Aproximadamente 37 cm de di\xE2metro.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal", "N\xE3o usar alvejante"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "sousplat-estrela",
        nome: "Sousplat Estrela",
        preco: 40,
        precoPorQuantidade: { 1: 40, 2: 75, 4: 140, 6: 205 },
        categoria: "mesa",
        disponibilidade: "encomenda",
        destaque: false,
        tags: [],
        fotos: [
          "sousplat-terracota-cru-01.jpeg",
          "sousplat-terracota-cru-02-detalhe.jpeg",
          "sousplat-terracota-cru-03-detalhe.jpeg"
        ],
        alt: "Sousplat de croch\xEA em terracota com desenho de estrela e borda em bolinhas cruas.",
        resumo: "Desenho de estrela em duas cores, com borda em bolinhas.",
        descricao: "Duas cores que se cruzam num desenho de estrela, com a borda em bolinhas fechando a pe\xE7a. \xC9 o modelo que mais chama aten\xE7\xE3o na mesa posta.",
        materiais: ["Fio de algod\xE3o", "Duas cores \xE0 sua escolha", "Borda em bolinhas"],
        medidas: "Aproximadamente 37 cm de di\xE2metro.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal", "N\xE3o usar alvejante"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      /* ----------------------------------------------------------- DECORAÇÃO */
      {
        slug: "capa-almofada",
        nome: "Capa de Almofada",
        preco: 75,
        categoria: "decoracao",
        disponibilidade: "encomenda",
        destaque: true,
        tags: [],
        fotos: ["almofada-granny-square-01-no-sofa.jpeg", "almofada-granny-square-02.jpeg"],
        alt: "Capa de almofada de croch\xEA em granny square com terracota, rosa, verde e cru, sobre sof\xE1 cinza.",
        resumo: "Granny square 40 \xD7 40 cm. S\xF3 a capa, na cor que voc\xEA quiser.",
        descricao: "Quadrado cl\xE1ssico do croch\xEA, feito de dentro para fora numa pe\xE7a s\xF3. Vai s\xF3 a capa: o enchimento \xE9 o que voc\xEA j\xE1 tem em casa, no tamanho padr\xE3o de 40 \xD7 40.",
        materiais: ["Fio de algod\xE3o", "Granny square em pe\xE7a \xFAnica", "Cores \xE0 sua escolha"],
        medidas: "40 \xD7 40 cm. Enchimento n\xE3o incluso.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal", "N\xE3o torcer"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "porta-retrato-coracao",
        nome: "Porta-retrato Polaroid Cora\xE7\xE3o",
        preco: 39.9,
        categoria: "decoracao",
        disponibilidade: "encomenda",
        destaque: true,
        tags: [],
        fotos: ["porta-retrato-macrame-01-na-parede.jpeg"],
        alt: "Porta-retrato de macram\xEA em corda crua pendurado na parede, segurando duas fotos polaroid.",
        resumo: "Macram\xEA de 60 cm que segura duas polaroids.",
        descricao: "Os n\xF3s de cora\xE7\xE3o no topo e no p\xE9 emolduram duas fotos polaroid, sem cola e sem prego na foto \u2014 ela entra e sai quando voc\xEA quiser trocar.",
        materiais: ["Fio de macram\xEA", "N\xF3s de cora\xE7\xE3o", "Franja no acabamento"],
        medidas: "60 cm de comprimento. Cabem 2 fotos polaroid de 8 \xD7 10 cm.",
        cuidados: ["Espanar com pincel macio", "Manter longe de umidade", "N\xE3o lavar"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "porta-retrato-simples",
        nome: "Porta-retrato Polaroid Simples",
        preco: 11.9,
        categoria: "decoracao",
        disponibilidade: "encomenda",
        destaque: false,
        tags: [],
        fotos: [
          "porta-retrato-macrame-02-avulso.jpeg",
          "porta-retrato-macrame-03-avulso.jpeg",
          "porta-retrato-macrame-04-avulso.jpeg"
        ],
        alt: "Porta-retrato pequeno de macram\xEA com argola de madeira, segurando uma foto polaroid.",
        resumo: "Argola de madeira e macram\xEA, para uma polaroid.",
        descricao: "A vers\xE3o pequena, de pendurar em qualquer canto. A argola de madeira faz o topo e a franja fecha embaixo.",
        materiais: ["Fio de macram\xEA", "Argola de madeira", "Franja no acabamento"],
        medidas: "27 cm da argola at\xE9 a ponta. Cabe 1 foto polaroid de 8 \xD7 10 cm.",
        cuidados: ["Espanar com pincel macio", "Manter longe de umidade", "N\xE3o lavar"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "cata-vento",
        nome: "Cata-vento de Croch\xEA",
        preco: 34.9,
        categoria: "decoracao",
        disponibilidade: "encomenda",
        destaque: false,
        tags: [],
        fotos: ["mobile-espiral-01-ambiente.jpeg"],
        alt: "Cata-vento de croch\xEA em espiral pendurado perto da janela, girando com a luz do fim da tarde.",
        resumo: "Espiral que gira com o vento, tamanho G.",
        descricao: "Pendura perto de uma janela e ele roda sozinho com a corrente de ar. A espiral \xE9 fechada com um pingente na ponta.",
        materiais: ["Fio de algod\xE3o", "Espiral em ponto cont\xEDnuo", "Pingente no acabamento"],
        medidas: "Tamanho G.",
        cuidados: ["Espanar com pincel macio", "N\xE3o lavar"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "painel-macrame",
        nome: "Painel de Macram\xEA",
        preco: 0,
        categoria: "decoracao",
        disponibilidade: "encomenda",
        destaque: false,
        tags: [],
        fotos: ["painel-macrame-verde-01-na-parede.jpeg"],
        alt: "Painel de macram\xEA em verde s\xE1lvia com n\xF3s geom\xE9tricos e franja, pendurado em bast\xE3o de madeira.",
        resumo: "N\xF3s geom\xE9tricos em bast\xE3o de madeira, 20 \xD7 55 cm.",
        descricao: "Pe\xE7a de parede feita \xE0 m\xE3o, com os n\xF3s desenhando um losango no meio e a franja fechando embaixo.",
        materiais: ["Fio de macram\xEA", "Bast\xE3o de madeira", "Franja no acabamento"],
        medidas: "20 \xD7 55 cm.",
        cuidados: ["Espanar com pincel macio", "Manter longe de umidade", "N\xE3o lavar"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "tapete",
        nome: "Tapete de Croch\xEA",
        preco: 0,
        categoria: "decoracao",
        disponibilidade: "pronta",
        destaque: false,
        tags: [],
        fotos: [],
        alt: "Tapete de croch\xEA retangular, 70 por 50 cent\xEDmetros.",
        resumo: "70 \xD7 50 cm, pronta entrega.",
        descricao: "Combina com qualquer ambiente. Escolha a cor que mais te agrada.",
        materiais: ["Fio de malha"],
        medidas: "70 \xD7 50 cm.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal"],
        prazo: "Envio em at\xE9 2 dias \xFAteis"
      },
      /* ---------------------------------------------------------- ACESSÓRIOS */
      {
        slug: "touca",
        nome: "Touca de Croch\xEA",
        preco: 75,
        precoPorQuantidade: { 1: 75, 2: 140 },
        categoria: "acessorios",
        disponibilidade: "encomenda",
        destaque: true,
        tags: [],
        fotos: ["gorro-02-rosa-na-modelo.jpeg", "gorro-01-preto-e-branco.jpeg"],
        alt: "Touca de croch\xEA em rosa antigo, vestida, com canelado na barra.",
        resumo: "L\xE3 100% acr\xEDlica, canelado na barra. Qualquer tamanho.",
        descricao: "Touca de inverno em l\xE3 acr\xEDlica, com canelado na barra que segura na cabe\xE7a sem apertar. Serve em qualquer tamanho \u2014 \xE9 s\xF3 dizer o seu.",
        materiais: ["L\xE3 100% acr\xEDlica", "Canelado na barra", "Cor \xE0 sua escolha"],
        medidas: "Qualquer tamanho, feita sob medida.",
        cuidados: ["Lavar \xE0 m\xE3o em \xE1gua fria", "Secar na horizontal", "N\xE3o usar secadora"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "bolsa-jasmin",
        nome: "Bolsa Jasmin",
        preco: 0,
        categoria: "acessorios",
        disponibilidade: "encomenda",
        destaque: true,
        tags: [],
        fotos: [
          "bolsa-listrada-01-inteira.jpeg",
          "bolsa-listrada-02-inteira.jpeg",
          "bolsa-listrada-03-alca.jpeg",
          "bolsa-listrada-04-alca.jpeg",
          "bolsa-listrada-05-detalhe.jpeg",
          "bolsa-listrada-06-detalhe.jpeg"
        ],
        alt: "Bolsa de croch\xEA listrada em cru, verde \xE1gua, p\xEAssego e terracota, com al\xE7a longa.",
        resumo: "Listras em quatro cores, al\xE7a longa, 30 \xD7 32 cm.",
        descricao: "Listras que mudam de cor a cada carreira, com al\xE7a longa de ombro. O ponto \xE9 aberto, ent\xE3o ela cede um pouco e acomoda o que entra.",
        materiais: ["Fio de algod\xE3o", "Ponto aberto", "Al\xE7a longa de ombro"],
        medidas: "30 \xD7 32 cm.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal", "N\xE3o torcer"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      },
      {
        slug: "necessaire",
        nome: "Necessaire de Croch\xEA",
        preco: 0,
        categoria: "acessorios",
        disponibilidade: "encomenda",
        destaque: false,
        tags: [],
        fotos: [
          "necessaire-crua-01-fechada.jpeg",
          "necessaire-crua-02-aberta.jpeg",
          "necessaire-crua-03-medidas.jpeg"
        ],
        alt: "Necessaire de croch\xEA em fio cru com z\xEDper, segurada na m\xE3o.",
        resumo: "20 \xD7 10 cm, com z\xEDper. Sem forro.",
        descricao: "Do tamanho de caber na bolsa e levar maquiagem ou item de higiene. Z\xEDper costurado \xE0 m\xE3o, sem forro \u2014 o croch\xEA \xE9 firme o bastante para segurar sozinho.",
        materiais: ["Fio de algod\xE3o", "Z\xEDper costurado \xE0 m\xE3o", "Sem forro"],
        medidas: "20 \xD7 10 cm.",
        cuidados: ["Lavar \xE0 m\xE3o", "Secar na horizontal"],
        prazo: "Produ\xE7\xE3o sob encomenda"
      }
    ];
    var TAGS = {
      novo: { texto: "Novo", classe: "tag-novo" },
      ultimas: { texto: "\xDAltimas pe\xE7as", classe: "tag-ultimas" },
      "mais-vendido": { texto: "Mais vendido", classe: "tag-ultimas" },
      pronta: { texto: "Pronta entrega", classe: "tag-pronta" },
      encomenda: { texto: "Sob encomenda", classe: "tag-encomenda" }
    };
    var CARTELA = [
      { nome: "Terracota", cor: "#c0573e" },
      { nome: "Oliva Seca", cor: "#596338" },
      { nome: "Mostarda", cor: "#f7bc60" },
      { nome: "Cru / Natural", cor: "#e3e2e0" },
      { nome: "Avel\xE3", cor: "#8a726c" },
      { nome: "Rosa Seco", cor: "#dcae96" },
      { nome: "Carv\xE3o", cor: "#2f312f" }
    ];
    function produtoPorSlug(slug) {
      return PRODUTOS.find((p) => p.slug === slug) || null;
    }
    __name(produtoPorSlug, "produtoPorSlug");
    __name2(produtoPorSlug, "produtoPorSlug");
    function caminhoImagem(produto, indice = 0) {
      const fotos = produto.fotos || [];
      if (!fotos.length) return "assets/fotos/sem-foto.svg";
      return `assets/fotos/${fotos[Math.min(indice, fotos.length - 1)]}`;
    }
    __name(caminhoImagem, "caminhoImagem");
    __name2(caminhoImagem, "caminhoImagem");
    function precoPara(produto, quantidade = 1) {
      const tabela = produto.precoPorQuantidade;
      const n = Math.max(1, Math.floor(Number(quantidade) || 1));
      if (!tabela) return arredondar(produto.preco * n);
      const degraus = Object.keys(tabela).map(Number).sort((a, b) => b - a);
      let restante = n;
      let total = 0;
      for (const degrau of degraus) {
        while (restante >= degrau) {
          total += tabela[degrau];
          restante -= degrau;
        }
      }
      total += restante * (tabela[1] != null ? tabela[1] : produto.preco);
      return arredondar(total);
    }
    __name(precoPara, "precoPara");
    __name2(precoPara, "precoPara");
    var ENVIO = {
      // Regra da dona: frete grátis a partir de R$ 120, sem restrição de região.
      gratisAcimaDe: 120,
      regioesComFreteGratis: ["norte", "nordeste", "centro-oeste", "sudeste", "sul"],
      // Valor fixo por região. Trocar por cálculo dos Correios é uma mudança
      // isolada: só esta tabela e a função fretePara() precisam mudar.
      tabela: {
        sudeste: 24.9,
        sul: 29.9,
        "centro-oeste": 34.9,
        nordeste: 39.9,
        norte: 44.9
      }
    };
    var UF_POR_REGIAO = {
      norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
      nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
      "centro-oeste": ["DF", "GO", "MT", "MS"],
      sudeste: ["ES", "MG", "RJ", "SP"],
      sul: ["PR", "RS", "SC"]
    };
    var UFS = Object.values(UF_POR_REGIAO).flat().sort();
    function regiaoPorUF(uf) {
      const alvo = String(uf || "").trim().toUpperCase();
      return Object.keys(UF_POR_REGIAO).find((r) => UF_POR_REGIAO[r].includes(alvo)) || null;
    }
    __name(regiaoPorUF, "regiaoPorUF");
    __name2(regiaoPorUF, "regiaoPorUF");
    function fretePara(uf, subtotalSemDesconto) {
      const regiao = regiaoPorUF(uf);
      if (!regiao) return null;
      if (ENVIO.regioesComFreteGratis.includes(regiao) && subtotalSemDesconto >= ENVIO.gratisAcimaDe) return 0;
      return ENVIO.tabela[regiao];
    }
    __name(fretePara, "fretePara");
    __name2(fretePara, "fretePara");
    var PAGAMENTO = {
      metodos: [
        { id: "pix", nome: "Pix", descricao: "Aprova\xE7\xE3o na hora. QR code ou copia-e-cola." },
        { id: "cartao", nome: "Cart\xE3o de cr\xE9dito", descricao: "Em at\xE9 6\xD7 sem juros, no ambiente do Mercado Pago." },
        { id: "debito", nome: "Cart\xE3o de d\xE9bito", descricao: "D\xE9bito \xE0 vista, no ambiente do Mercado Pago." }
      ],
      maxParcelas: 6,
      // Teto por item, para evitar pedido acidental de 30 peças feitas à mão.
      maxQuantidadePorPeca: 5
    };
    function podeComprarOnline(produto) {
      return Number(produto.preco) > 0;
    }
    __name(podeComprarOnline, "podeComprarOnline");
    __name2(podeComprarOnline, "podeComprarOnline");
    function precisaEscolherCor(produto) {
      return produto.personalizavel !== false;
    }
    __name(precisaEscolherCor, "precisaEscolherCor");
    __name2(precisaEscolherCor, "precisaEscolherCor");
    var DESCONTOS = {
      primeiraCompra: {
        ativo: true,
        percentual: 10,
        rotulo: "Primeira compra",
        // Só é oferecido quando dá para verificar de verdade, ou seja, quando o
        // histórico de pedidos está configurado. Sem isso, todo mundo seria
        // "primeira compra" para sempre — e a promoção nunca terminaria.
        exigeHistorico: true
      },
      pix: {
        ativo: true,
        percentual: 5,
        rotulo: "Desconto no Pix"
      },
      // true  = os dois somam (10% + 5% = 15%)
      // false = vale só o maior dos dois
      acumulam: true
    };
    var arredondar = /* @__PURE__ */ __name2((valor) => Math.round(valor * 100) / 100, "arredondar");
    function calcularDescontos({ subtotal, metodo, primeiraCompra }) {
      const candidatos = [];
      if (DESCONTOS.primeiraCompra.ativo && primeiraCompra) {
        candidatos.push({
          id: "primeira-compra",
          rotulo: DESCONTOS.primeiraCompra.rotulo,
          percentual: DESCONTOS.primeiraCompra.percentual
        });
      }
      if (DESCONTOS.pix.ativo && metodo === "pix") {
        candidatos.push({
          id: "pix",
          rotulo: DESCONTOS.pix.rotulo,
          percentual: DESCONTOS.pix.percentual
        });
      }
      if (!candidatos.length) return [];
      const escolhidos = DESCONTOS.acumulam ? candidatos : [candidatos.reduce((a, b) => b.percentual > a.percentual ? b : a)];
      return escolhidos.map((d) => ({
        ...d,
        valor: arredondar(subtotal * d.percentual / 100)
      }));
    }
    __name(calcularDescontos, "calcularDescontos");
    __name2(calcularDescontos, "calcularDescontos");
    if (typeof module !== "undefined" && module.exports) {
      module.exports = {
        ATELIE,
        CATEGORIAS,
        PRODUTOS,
        TAGS,
        CARTELA,
        ENVIO,
        UF_POR_REGIAO,
        UFS,
        PAGAMENTO,
        DESCONTOS,
        calcularDescontos,
        linkWhatsApp,
        formatarPreco,
        produtoPorSlug,
        caminhoImagem,
        precoPara,
        regiaoPorUF,
        fretePara,
        podeComprarOnline,
        precisaEscolherCor
      };
    }
  }
});
var require_pedido = __commonJS({
  "../backend/lib/pedido.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var crypto = require_crypto();
    var { PRODUTOS, PAGAMENTO, ENVIO, fretePara, regiaoPorUF, calcularDescontos, precoPara, podeComprarOnline } = require_dados();
    var emCentavos = /* @__PURE__ */ __name2((reais) => Math.round(Number(reais) * 100), "emCentavos");
    var emReais = /* @__PURE__ */ __name2((centavos) => Math.round(centavos) / 100, "emReais");
    function novaReferencia() {
      const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const bytes = crypto.randomBytes(8);
      let sufixo = "";
      for (const b of bytes) sufixo += alfabeto[b % alfabeto.length];
      return `BA-${sufixo}`;
    }
    __name(novaReferencia, "novaReferencia");
    __name2(novaReferencia, "novaReferencia");
    function agruparItens(itens) {
      const mapa = /* @__PURE__ */ new Map();
      for (const item of itens) {
        const chave = `${item.slug}|${item.cor || ""}`;
        const atual = mapa.get(chave) || { slug: item.slug, cor: item.cor || null, quantidade: 0 };
        atual.quantidade += item.quantidade;
        mapa.set(chave, atual);
      }
      return [...mapa.values()].map((i) => ({
        ...i,
        quantidade: Math.min(i.quantidade, PAGAMENTO.maxQuantidadePorPeca)
      }));
    }
    __name(agruparItens, "agruparItens");
    __name2(agruparItens, "agruparItens");
    function montarPedido(itensPedidos, uf, opcoes = {}) {
      const campos = {};
      const itens = [];
      let subtotalCent = 0;
      for (const pedido of agruparItens(itensPedidos)) {
        const produto = PRODUTOS.find((p) => p.slug === pedido.slug);
        if (!produto) {
          campos.itens = "Uma das pe\xE7as saiu do cat\xE1logo. Atualize a p\xE1gina e tente de novo.";
          continue;
        }
        if (!podeComprarOnline(produto)) {
          campos.itens = `"${produto.nome}" ainda n\xE3o tem pre\xE7o no site. Fale com a gente pelo WhatsApp.`;
          continue;
        }
        const totalLinhaCent = emCentavos(precoPara(produto, pedido.quantidade));
        const unitarioCent = Math.round(totalLinhaCent / pedido.quantidade);
        subtotalCent += totalLinhaCent;
        itens.push({
          slug: produto.slug,
          nome: produto.nome,
          cor: pedido.cor || null,
          quantidade: pedido.quantidade,
          precoUnitario: emReais(unitarioCent),
          precoTotal: emReais(totalLinhaCent),
          img: produto.img
        });
      }
      if (!itens.length && !campos.itens) campos.itens = "Sua sacola est\xE1 vazia.";
      if (Object.keys(campos).length) return { campos, pedido: null };
      const subtotal = emReais(subtotalCent);
      const frete = fretePara(uf, subtotal);
      if (frete === null) {
        return { campos: { estado: "N\xE3o entregamos para esse estado. Fale com a gente." }, pedido: null };
      }
      const descontos = calcularDescontos({
        subtotal,
        metodo: opcoes.metodo,
        primeiraCompra: opcoes.primeiraCompra === true
      });
      const descontoCent = descontos.reduce((soma, d) => soma + emCentavos(d.valor), 0);
      const freteCent = emCentavos(frete);
      const totalCent = Math.max(emCentavos(1), subtotalCent - descontoCent + freteCent);
      return {
        campos: {},
        pedido: {
          itens,
          subtotal,
          descontos,
          descontoTotal: emReais(descontoCent),
          frete,
          total: emReais(totalCent),
          totalCentavos: totalCent,
          regiao: regiaoPorUF(uf),
          freteGratis: freteCent === 0,
          faltaParaFreteGratis: freteCent === 0 ? 0 : emReais(Math.max(0, emCentavos(ENVIO.gratisAcimaDe) - subtotalCent))
        }
      };
    }
    __name(montarPedido, "montarPedido");
    __name2(montarPedido, "montarPedido");
    function itensParaCobranca(pedido) {
      const subtotalCent = emCentavos(pedido.subtotal);
      const descontoCent = emCentavos(pedido.descontoTotal || 0);
      const alvoCent = subtotalCent - descontoCent;
      const linhas = pedido.itens.map((i) => ({
        slug: i.slug,
        nome: i.nome,
        quantidade: i.quantidade,
        totalCent: emCentavos(i.precoTotal)
      }));
      if (descontoCent > 0 && subtotalCent > 0) {
        let distribuido = 0;
        linhas.forEach((linha, indice) => {
          if (indice === linhas.length - 1) {
            linha.totalCent = alvoCent - distribuido;
          } else {
            linha.totalCent = Math.round(linha.totalCent * alvoCent / subtotalCent);
            distribuido += linha.totalCent;
          }
        });
      }
      return linhas.map((linha) => ({
        slug: linha.slug,
        nome: linha.nome,
        quantidade: linha.quantidade,
        // Preço unitário já com o desconto embutido.
        unitarioCent: Math.round(linha.totalCent / linha.quantidade),
        totalCent: linha.totalCent
      }));
    }
    __name(itensParaCobranca, "itensParaCobranca");
    __name2(itensParaCobranca, "itensParaCobranca");
    module.exports = { montarPedido, novaReferencia, emCentavos, emReais, itensParaCobranca };
  }
});
var require_mercadopago = __commonJS({
  "../backend/gateways/mercadopago.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var crypto = require_crypto();
    var { itensParaCobranca } = require_pedido();
    var BASE = "https://api.mercadopago.com";
    var capacidades = {
      rotulo: "Mercado Pago",
      metodos: ["pix", "cartao", "debito"],
      escolhaNoGateway: false,
      // a pessoa escolhe a forma no nosso site
      pixInline: true,
      // devolvemos QR code para desenhar na nossa página
      exigeCpf: true,
      // o Mercado Pago exige CPF para emitir o Pix
      assinaWebhook: true
    };
    function extrairNotificacao({ corpo, query }) {
      const tipo = corpo && (corpo.type || corpo.topic) || query.get("type") || query.get("topic");
      const id = corpo && corpo.data && corpo.data.id || query.get("data.id") || query.get("id");
      return {
        // O Mercado Pago manda vários tópicos (merchant_order, plan...).
        ehPagamento: tipo === "payment" && Boolean(id),
        idRecurso: id ? String(id) : null,
        motivo: `tipo:${tipo || "desconhecido"}`
      };
    }
    __name(extrairNotificacao, "extrairNotificacao");
    __name2(extrairNotificacao, "extrairNotificacao");
    function token() {
      const t = process.env.MP_ACCESS_TOKEN;
      if (!t) throw new Error("MP_ACCESS_TOKEN n\xE3o est\xE1 definido nas vari\xE1veis de ambiente.");
      return t;
    }
    __name(token, "token");
    __name2(token, "token");
    async function chamar(caminho, { metodo = "GET", corpo, idempotencia } = {}) {
      const cabecalhos = {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json"
      };
      if (idempotencia) cabecalhos["X-Idempotency-Key"] = idempotencia;
      const resposta = await fetch(`${BASE}${caminho}`, {
        method: metodo,
        headers: cabecalhos,
        body: corpo ? JSON.stringify(corpo) : void 0
      });
      const texto = await resposta.text();
      let dados = null;
      try {
        dados = texto ? JSON.parse(texto) : null;
      } catch {
        dados = { bruto: texto };
      }
      if (!resposta.ok) {
        console.error("[mercadopago] %s %s -> %s %s", metodo, caminho, resposta.status, texto.slice(0, 500));
        const e = new Error(dados && dados.message || `Mercado Pago respondeu ${resposta.status}`);
        e.status = resposta.status;
        e.detalhes = dados;
        throw e;
      }
      return dados;
    }
    __name(chamar, "chamar");
    __name2(chamar, "chamar");
    function traduzirStatus(status) {
      switch (status) {
        case "approved":
          return "aprovado";
        case "pending":
        case "in_process":
        case "authorized":
          return "pendente";
        case "rejected":
        case "cancelled":
        case "refunded":
        case "charged_back":
          return "recusado";
        default:
          return "pendente";
      }
    }
    __name(traduzirStatus, "traduzirStatus");
    __name2(traduzirStatus, "traduzirStatus");
    async function criarPagamentoCartao({ referencia, pedido, cliente, metodo, urlSite }) {
      const tiposExcluidos = metodo === "debito" ? [{ id: "ticket" }, { id: "bank_transfer" }, { id: "atm" }, { id: "credit_card" }] : [{ id: "ticket" }, { id: "bank_transfer" }, { id: "atm" }, { id: "debit_card" }];
      const partesNome = cliente.nome.split(" ");
      const primeiroNome = partesNome[0];
      const sobrenome = partesNome.slice(1).join(" ") || primeiroNome;
      const itens = itensParaCobranca(pedido).map((i) => ({
        id: i.slug,
        title: i.nome,
        quantity: i.quantidade,
        unit_price: i.unitarioCent / 100,
        currency_id: "BRL"
      }));
      if (pedido.frete > 0) {
        itens.push({ id: "frete", title: "Frete", quantity: 1, unit_price: pedido.frete, currency_id: "BRL" });
      }
      const preferencia = await chamar("/checkout/preferences", {
        metodo: "POST",
        idempotencia: `pref-${referencia}`,
        corpo: {
          items: itens,
          external_reference: referencia,
          statement_descriptor: "BEGONIA ATELIE",
          payer: {
            name: primeiroNome,
            surname: sobrenome,
            email: cliente.email,
            ...cliente.cpf ? { identification: { type: "CPF", number: cliente.cpf } } : {}
          },
          payment_methods: {
            excluded_payment_types: tiposExcluidos,
            installments: metodo === "debito" ? 1 : Number(process.env.MP_MAX_PARCELAS || 6)
          },
          back_urls: {
            success: `${urlSite}/pedido.html?ref=${referencia}`,
            pending: `${urlSite}/pedido.html?ref=${referencia}`,
            failure: `${urlSite}/pedido.html?ref=${referencia}`
          },
          auto_return: "approved",
          notification_url: `${urlSite}/api/webhook`
        }
      });
      return {
        tipo: "redirecionamento",
        idGateway: String(preferencia.id),
        // sandbox_init_point é o ambiente de teste; init_point é o de verdade.
        url: process.env.MP_MODO === "teste" && preferencia.sandbox_init_point ? preferencia.sandbox_init_point : preferencia.init_point
      };
    }
    __name(criarPagamentoCartao, "criarPagamentoCartao");
    __name2(criarPagamentoCartao, "criarPagamentoCartao");
    async function criarPagamentoPix({ referencia, pedido, cliente, urlSite }) {
      const partesNome = cliente.nome.split(" ");
      const primeiroNome = partesNome[0];
      const sobrenome = partesNome.slice(1).join(" ") || primeiroNome;
      const minutos = Number(process.env.PIX_EXPIRA_MINUTOS || 30);
      const expiraEm = new Date(Date.now() + minutos * 60 * 1e3);
      const pagamento = await chamar("/v1/payments", {
        metodo: "POST",
        idempotencia: `pix-${referencia}`,
        corpo: {
          transaction_amount: pedido.total,
          payment_method_id: "pix",
          description: `Beg\xF4nia Ateli\xEA \u2014 pedido ${referencia}`,
          external_reference: referencia,
          notification_url: `${urlSite}/api/webhook`,
          date_of_expiration: expiraEm.toISOString().replace("Z", "-00:00"),
          payer: {
            email: cliente.email,
            first_name: primeiroNome,
            last_name: sobrenome,
            identification: { type: "CPF", number: cliente.cpf }
          }
        }
      });
      const dados = pagamento && pagamento.point_of_interaction && pagamento.point_of_interaction.transaction_data || {};
      return {
        tipo: "pix",
        idGateway: String(pagamento.id),
        status: traduzirStatus(pagamento.status),
        qrCodeTexto: dados.qr_code || null,
        // copia-e-cola
        qrCodeImagem: dados.qr_code_base64 || null,
        // PNG em base64
        expiraEm: pagamento.date_of_expiration || expiraEm.toISOString()
      };
    }
    __name(criarPagamentoPix, "criarPagamentoPix");
    __name2(criarPagamentoPix, "criarPagamentoPix");
    async function consultarPagamento(idPagamento) {
      const p = await chamar(`/v1/payments/${encodeURIComponent(idPagamento)}`);
      return {
        idGateway: String(p.id),
        referencia: p.external_reference || null,
        status: traduzirStatus(p.status),
        statusOriginal: p.status,
        detalheStatus: p.status_detail || null,
        valor: p.transaction_amount,
        metodo: p.payment_method_id,
        tipoMetodo: p.payment_type_id,
        pagoEm: p.date_approved || null,
        // Os últimos 4 dígitos vêm do MP só para o comprovante. Nunca o número inteiro.
        cartaoFinal: p.card && p.card.last_four_digits || null
      };
    }
    __name(consultarPagamento, "consultarPagamento");
    __name2(consultarPagamento, "consultarPagamento");
    function validarWebhook({ cabecalhos, idRecurso }) {
      const segredo = process.env.MP_WEBHOOK_SECRET;
      if (!segredo) {
        console.warn("[mercadopago] MP_WEBHOOK_SECRET ausente: assinatura do webhook N\xC3O verificada.");
        return { valido: false, motivo: "segredo-ausente" };
      }
      const assinatura = cabecalhos["x-signature"];
      const idRequisicao = cabecalhos["x-request-id"];
      if (!assinatura || !idRequisicao) return { valido: false, motivo: "cabecalhos-ausentes" };
      const partes = {};
      String(assinatura).split(",").forEach((pedaco) => {
        const igual = pedaco.indexOf("=");
        if (igual < 0) return;
        partes[pedaco.slice(0, igual).trim()] = pedaco.slice(igual + 1).trim();
      });
      if (!partes.ts || !partes.v1) return { valido: false, motivo: "assinatura-malformada" };
      const id = String(idRecurso).toLowerCase();
      const manifesto = `id:${id};request-id:${idRequisicao};ts:${partes.ts};`;
      const esperado = crypto.createHmac("sha256", segredo).update(manifesto).digest("hex");
      const a = Buffer.from(esperado, "utf8");
      const b = Buffer.from(partes.v1, "utf8");
      const confere = a.length === b.length && crypto.timingSafeEqual(a, b);
      if (!confere) return { valido: false, motivo: "assinatura-nao-confere" };
      const idadeSegundos = Math.abs(Date.now() / 1e3 - Number(partes.ts));
      if (Number.isFinite(idadeSegundos) && idadeSegundos > 600) {
        return { valido: false, motivo: "assinatura-expirada" };
      }
      return { valido: true };
    }
    __name(validarWebhook, "validarWebhook");
    __name2(validarWebhook, "validarWebhook");
    module.exports = {
      nome: "mercadopago",
      capacidades,
      extrairNotificacao,
      criarPagamentoCartao,
      criarPagamentoPix,
      consultarPagamento,
      validarWebhook,
      traduzirStatus
    };
  }
});
var require_infinitepay = __commonJS({
  "../backend/gateways/infinitepay.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { itensParaCobranca } = require_pedido();
    var BASE = "https://api.checkout.infinitepay.io";
    var capacidades = {
      rotulo: "InfinitePay",
      metodos: ["pix", "cartao"],
      // sem débito
      escolhaNoGateway: true,
      // o cliente escolhe Pix ou cartão na página deles
      pixInline: false,
      // não devolvemos QR para desenhar
      exigeCpf: false,
      // a InfinitePay coleta o que precisa
      assinaWebhook: false
      // ver o bloco abaixo
    };
    function extrairNotificacao({ corpo }) {
      const orderNsu = corpo && corpo.order_nsu;
      const transactionNsu = corpo && corpo.transaction_nsu;
      return {
        ehPagamento: Boolean(orderNsu && transactionNsu),
        idRecurso: orderNsu ? String(orderNsu) : null,
        motivo: "webhook-sem-order_nsu-ou-transaction_nsu"
      };
    }
    __name(extrairNotificacao, "extrairNotificacao");
    __name2(extrairNotificacao, "extrairNotificacao");
    function handle() {
      const h = process.env.INFINITEPAY_HANDLE;
      if (!h) throw new Error("INFINITEPAY_HANDLE n\xE3o est\xE1 definido nas vari\xE1veis de ambiente.");
      return h.replace(/^\$/, "");
    }
    __name(handle, "handle");
    __name2(handle, "handle");
    async function chamar(caminho, corpo) {
      const resposta = await fetch(`${BASE}${caminho}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
      });
      const texto = await resposta.text();
      let dados = null;
      try {
        dados = texto ? JSON.parse(texto) : null;
      } catch {
        dados = { bruto: texto };
      }
      if (!resposta.ok) {
        console.error("[infinitepay] POST %s -> %s %s", caminho, resposta.status, texto.slice(0, 500));
        if (dados && dados.error === "external_checkout_not_enabled") {
          console.error(
            "[infinitepay] ATEN\xC7\xC3O: o Checkout Integrado n\xE3o est\xE1 habilitado na conta %s. Ligue em https://app.infinitepay.io/external-checkout#configuracoes \u2014 at\xE9 l\xE1 nenhuma cobran\xE7a pode ser criada.",
            process.env.INFINITEPAY_HANDLE
          );
        }
        const e = new Error(dados && (dados.message || dados.error) || `InfinitePay respondeu ${resposta.status}`);
        e.codigo = dados && dados.error;
        e.status = resposta.status;
        e.detalhes = dados;
        throw e;
      }
      return dados;
    }
    __name(chamar, "chamar");
    __name2(chamar, "chamar");
    var emCentavos = /* @__PURE__ */ __name2((reais) => Math.round(Number(reais) * 100), "emCentavos");
    var emReais = /* @__PURE__ */ __name2((centavos) => Math.round(Number(centavos)) / 100, "emReais");
    function montarId({ slug, transactionNsu, orderNsu }) {
      return [slug || "", transactionNsu || "", orderNsu || ""].join("|");
    }
    __name(montarId, "montarId");
    __name2(montarId, "montarId");
    function lerId(id) {
      const [slug, transactionNsu, orderNsu] = String(id).split("|");
      return { slug: slug || null, transactionNsu: transactionNsu || null, orderNsu: orderNsu || null };
    }
    __name(lerId, "lerId");
    __name2(lerId, "lerId");
    function slugDaUrl(url) {
      try {
        const partes = new URL(url).pathname.split("/").filter(Boolean);
        return partes.length >= 2 ? partes[partes.length - 1] : null;
      } catch {
        return null;
      }
    }
    __name(slugDaUrl, "slugDaUrl");
    __name2(slugDaUrl, "slugDaUrl");
    async function criarPagamentoUnico({ referencia, pedido, cliente, entrega, urlSite }) {
      const itens = itensParaCobranca(pedido).map((i) => ({
        quantity: i.quantidade,
        price: i.unitarioCent,
        // centavos
        description: i.nome
      }));
      if (pedido.frete > 0) {
        itens.push({ quantity: 1, price: emCentavos(pedido.frete), description: "Frete" });
      }
      const resposta = await chamar("/links", {
        handle: handle(),
        // order_nsu é a NOSSA referência. Ela é aleatória e não adivinhável, e
        // é por ela que o webhook é amarrado a um pedido real.
        order_nsu: referencia,
        redirect_url: `${urlSite}/pedido.html?ref=${referencia}`,
        webhook_url: `${urlSite}/api/webhook`,
        items: itens,
        customer: {
          name: cliente.nome,
          email: cliente.email,
          phone_number: cliente.whatsapp
        },
        // Endereço é campo opcional na API deles, mas gateway usa endereço para
        // antifraude — mandar aumenta a chance de o cartão passar.
        ...entrega ? {
          address: {
            postal_code: entrega.cep,
            street: entrega.rua,
            number: entrega.numero,
            complement: entrega.complemento || void 0,
            neighborhood: entrega.bairro,
            city: entrega.cidade,
            state: entrega.estado
          }
        } : {}
      });
      const url = resposta && resposta.url;
      if (!url) {
        throw new Error("InfinitePay n\xE3o devolveu a URL do checkout.");
      }
      return {
        tipo: "redirecionamento",
        idGateway: montarId({ slug: slugDaUrl(url), orderNsu: referencia }),
        url
      };
    }
    __name(criarPagamentoUnico, "criarPagamentoUnico");
    __name2(criarPagamentoUnico, "criarPagamentoUnico");
    var criarPagamentoPix = criarPagamentoUnico;
    var criarPagamentoCartao = criarPagamentoUnico;
    async function consultarPagamento(idPagamento) {
      const { slug, transactionNsu, orderNsu } = lerId(idPagamento);
      if (!transactionNsu) {
        return {
          idGateway: String(idPagamento),
          referencia: orderNsu,
          status: "pendente",
          statusOriginal: "sem_transacao",
          detalheStatus: "aguardando o pagamento na p\xE1gina da InfinitePay",
          valor: null,
          metodo: null,
          tipoMetodo: null,
          pagoEm: null,
          cartaoFinal: null
        };
      }
      const dados = await chamar("/payment_check", {
        handle: handle(),
        order_nsu: orderNsu,
        transaction_nsu: transactionNsu,
        slug
      });
      const pago = Boolean(dados && dados.success && dados.paid);
      return {
        idGateway: String(idPagamento),
        referencia: orderNsu,
        status: pago ? "aprovado" : "pendente",
        statusOriginal: pago ? "paid" : "unpaid",
        detalheStatus: null,
        // A InfinitePay responde em centavos. `amount` é o valor do pedido;
        // `paid_amount` inclui o juro de parcelamento pago pelo comprador, então
        // é `amount` que tem de bater com o nosso total.
        valor: dados && dados.amount != null ? emReais(dados.amount) : null,
        metodo: dados && dados.capture_method || null,
        tipoMetodo: dados && dados.capture_method || null,
        parcelas: dados && dados.installments || null,
        pagoEm: pago ? (/* @__PURE__ */ new Date()).toISOString() : null,
        cartaoFinal: null
      };
    }
    __name(consultarPagamento, "consultarPagamento");
    __name2(consultarPagamento, "consultarPagamento");
    function validarWebhook({ corpo }) {
      const orderNsu = corpo && corpo.order_nsu;
      const transactionNsu = corpo && corpo.transaction_nsu;
      if (!orderNsu || !transactionNsu) {
        return { valido: false, motivo: "webhook-sem-identificadores" };
      }
      if (!/^BA-[A-Z2-9]{8}$/.test(String(orderNsu))) {
        return { valido: false, motivo: "order_nsu-fora-do-formato" };
      }
      return {
        valido: true,
        // Devolve o id composto para o webhook conseguir consultar a transação.
        idGateway: montarId({
          slug: corpo.invoice_slug,
          transactionNsu,
          orderNsu
        })
      };
    }
    __name(validarWebhook, "validarWebhook");
    __name2(validarWebhook, "validarWebhook");
    function traduzirStatus(status) {
      return status === "paid" ? "aprovado" : status === "refused" ? "recusado" : "pendente";
    }
    __name(traduzirStatus, "traduzirStatus");
    __name2(traduzirStatus, "traduzirStatus");
    module.exports = {
      nome: "infinitepay",
      capacidades,
      extrairNotificacao,
      criarPagamentoUnico,
      criarPagamentoCartao,
      criarPagamentoPix,
      consultarPagamento,
      validarWebhook,
      traduzirStatus
    };
  }
});
var require_simulado = __commonJS({
  "../backend/gateways/simulado.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ATRASO_SEGUNDOS = Number(process.env.SIMULADO_ATRASO_SEGUNDOS || 12);
    var imitandoInfinitePay = process.env.SIMULADO_IMITA === "infinitepay";
    var capacidades = {
      // Em teste, usa o nome do gateway imitado: a tela fica igual à de produção.
      rotulo: imitandoInfinitePay ? "InfinitePay" : "Mercado Pago",
      // A InfinitePay não tem débito no checkout online; o Mercado Pago tem.
      metodos: imitandoInfinitePay ? ["pix", "cartao"] : ["pix", "cartao", "debito"],
      escolhaNoGateway: process.env.SIMULADO_IMITA === "infinitepay",
      pixInline: process.env.SIMULADO_IMITA !== "infinitepay",
      exigeCpf: process.env.SIMULADO_IMITA !== "infinitepay",
      assinaWebhook: false
    };
    function extrairNotificacao({ corpo, query }) {
      const tipo = corpo && corpo.type || query.get("type");
      const id = corpo && corpo.data && corpo.data.id || query.get("data.id");
      return {
        ehPagamento: tipo === "payment" && Boolean(id),
        idRecurso: id ? String(id) : null,
        motivo: `tipo:${tipo || "desconhecido"}`
      };
    }
    __name(extrairNotificacao, "extrairNotificacao");
    __name2(extrairNotificacao, "extrairNotificacao");
    function exigirDesenvolvimento() {
      const ehProducao = process.env.VERCEL_ENV === "production" || false;
      if (ehProducao && process.env.SIMULADO_EU_SEI_O_QUE_ESTOU_FAZENDO !== "sim") {
        throw new Error(
          "GATEWAY=simulado est\xE1 ativo em produ\xE7\xE3o. Nenhum pagamento seria cobrado de verdade. Troque para GATEWAY=mercadopago e configure MP_ACCESS_TOKEN."
        );
      }
    }
    __name(exigirDesenvolvimento, "exigirDesenvolvimento");
    __name2(exigirDesenvolvimento, "exigirDesenvolvimento");
    function montarId(referencia) {
      return `SIM-${Date.now()}-${referencia}`;
    }
    __name(montarId, "montarId");
    __name2(montarId, "montarId");
    function lerId(id) {
      const partes = String(id).split("-");
      if (partes[0] !== "SIM" || partes.length < 4) return null;
      return {
        criadoEm: Number(partes[1]),
        referencia: partes.slice(2).join("-")
      };
    }
    __name(lerId, "lerId");
    __name2(lerId, "lerId");
    function traduzirStatus(status) {
      return status === "approved" ? "aprovado" : status === "rejected" ? "recusado" : "pendente";
    }
    __name(traduzirStatus, "traduzirStatus");
    __name2(traduzirStatus, "traduzirStatus");
    var decisoes = globalThis.__begoniaDecisoesSimuladas || (globalThis.__begoniaDecisoesSimuladas = /* @__PURE__ */ new Map());
    function registrarDecisao(idGateway, decisao) {
      exigirDesenvolvimento();
      decisoes.set(String(idGateway), decisao === "recusar" ? "rejected" : "approved");
      console.log("[simulado] pagamento %s marcado como %s", idGateway, decisao);
    }
    __name(registrarDecisao, "registrarDecisao");
    __name2(registrarDecisao, "registrarDecisao");
    function paraTelaDePagamento({ referencia, pedido, metodo, urlSite }) {
      const idGateway = montarId(referencia);
      console.log("[simulado] pagamento %s criado para o pedido %s (%s)", idGateway, referencia, pedido.total);
      const parametros = new URLSearchParams({
        ref: referencia,
        id: idGateway,
        total: String(pedido.total),
        metodo: metodo || "checkout"
      });
      return {
        tipo: "redirecionamento",
        idGateway,
        url: `${urlSite}/pagamento-simulado.html?${parametros}`,
        simulado: true
      };
    }
    __name(paraTelaDePagamento, "paraTelaDePagamento");
    __name2(paraTelaDePagamento, "paraTelaDePagamento");
    async function criarPagamentoPix(args) {
      exigirDesenvolvimento();
      return paraTelaDePagamento({ ...args, metodo: "pix" });
    }
    __name(criarPagamentoPix, "criarPagamentoPix");
    __name2(criarPagamentoPix, "criarPagamentoPix");
    async function criarPagamentoCartao(args) {
      exigirDesenvolvimento();
      return paraTelaDePagamento(args);
    }
    __name(criarPagamentoCartao, "criarPagamentoCartao");
    __name2(criarPagamentoCartao, "criarPagamentoCartao");
    async function consultarPagamento(idPagamento) {
      exigirDesenvolvimento();
      const dados = lerId(idPagamento);
      if (!dados) throw new Error(`Identificador simulado inv\xE1lido: ${idPagamento}`);
      const bruto = decisoes.get(String(idPagamento)) || "pending";
      const passou = bruto === "approved";
      return {
        idGateway: String(idPagamento),
        referencia: dados.referencia,
        status: traduzirStatus(bruto),
        statusOriginal: bruto,
        detalheStatus: bruto === "approved" ? "accredited" : bruto === "rejected" ? "cc_rejected_other_reason" : "pending_waiting_payment",
        // O valor real vem do nosso próprio registro do pedido; devolvemos null
        // para a conferência de valor do webhook não reprovar a simulação.
        valor: null,
        metodo: "simulado",
        tipoMetodo: "simulado",
        pagoEm: passou ? (/* @__PURE__ */ new Date()).toISOString() : null,
        cartaoFinal: null,
        simulado: true
      };
    }
    __name(consultarPagamento, "consultarPagamento");
    __name2(consultarPagamento, "consultarPagamento");
    function validarWebhook({ cabecalhos, idRecurso }) {
      exigirDesenvolvimento();
      if (cabecalhos["x-simulado"] === String(idRecurso)) return { valido: true };
      return { valido: false, motivo: "nao-veio-do-simulador" };
    }
    __name(validarWebhook, "validarWebhook");
    __name2(validarWebhook, "validarWebhook");
    module.exports = {
      nome: "simulado",
      capacidades,
      registrarDecisao,
      extrairNotificacao,
      criarPagamentoUnico: /* @__PURE__ */ __name2((args) => module.exports.criarPagamentoCartao(args), "criarPagamentoUnico"),
      criarPagamentoCartao,
      criarPagamentoPix,
      consultarPagamento,
      validarWebhook,
      traduzirStatus
    };
  }
});
var require_gateway = __commonJS({
  "../backend/lib/gateway.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var implementacoes = {
      mercadopago: /* @__PURE__ */ __name2(() => require_mercadopago(), "mercadopago"),
      infinitepay: /* @__PURE__ */ __name2(() => require_infinitepay(), "infinitepay"),
      // Só para desenvolvimento: aprova sozinho, não cobra ninguém.
      // O próprio arquivo se recusa a rodar em produção.
      simulado: /* @__PURE__ */ __name2(() => require_simulado(), "simulado")
    };
    function gateway() {
      const escolhido = process.env.GATEWAY || "mercadopago";
      const carregar = implementacoes[escolhido];
      if (!carregar) {
        throw new Error(
          `Gateway "${escolhido}" n\xE3o existe. Op\xE7\xF5es: ${Object.keys(implementacoes).join(", ")}`
        );
      }
      return carregar();
    }
    __name(gateway, "gateway");
    __name2(gateway, "gateway");
    module.exports = { gateway };
  }
});
var require_config = __commonJS({
  "../backend/rotas/config.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { rota: rota7, json } = require_http();
    var { gateway } = require_gateway();
    var { ENVIO, PAGAMENTO, UFS, DESCONTOS } = require_dados();
    function pagamentoConfigurado(escolhido) {
      if (escolhido === "simulado") return true;
      if (escolhido === "infinitepay") return Boolean(process.env.INFINITEPAY_HANDLE);
      return Boolean(process.env.MP_ACCESS_TOKEN);
    }
    __name(pagamentoConfigurado, "pagamentoConfigurado");
    __name2(pagamentoConfigurado, "pagamentoConfigurado");
    module.exports = rota7(["GET"], async (req, res) => {
      const escolhido = process.env.GATEWAY || "mercadopago";
      let capacidades = null;
      try {
        capacidades = gateway().capacidades || null;
      } catch (e) {
        console.error("[config] gateway n\xE3o carregou:", e.message);
      }
      const metodosAtivos = capacidades ? PAGAMENTO.metodos.filter((m) => capacidades.metodos.includes(m.id)) : PAGAMENTO.metodos;
      json(res, 200, {
        ok: true,
        publicKey: process.env.MP_PUBLIC_KEY || null,
        modo: process.env.MP_MODO === "teste" ? "teste" : "producao",
        // Quando falta configuração, o front avisa em vez de deixar o cliente
        // preencher tudo e falhar no último passo.
        pagamentoDisponivel: Boolean(capacidades) && pagamentoConfigurado(escolhido),
        // O front mostra um aviso na tela quando o gateway é o simulado, para
        // ninguém achar que fez uma compra de verdade.
        simulado: escolhido === "simulado",
        gateway: escolhido,
        capacidades,
        // Percentual do desconto no Pix, para a tela poder etiquetar a opção.
        // null quando o desconto está desligado.
        descontoPix: DESCONTOS.pix.ativo ? DESCONTOS.pix.percentual : null,
        descontoPrimeiraCompra: DESCONTOS.primeiraCompra.ativo ? DESCONTOS.primeiraCompra.percentual : null,
        freteGratisAcimaDe: ENVIO.gratisAcimaDe,
        metodos: metodosAtivos,
        maxParcelas: Number(process.env.MP_MAX_PARCELAS || PAGAMENTO.maxParcelas),
        maxQuantidadePorPeca: PAGAMENTO.maxQuantidadePorPeca,
        envio: {
          gratisAcimaDe: ENVIO.gratisAcimaDe,
          regioesComFreteGratis: ENVIO.regioesComFreteGratis,
          tabela: ENVIO.tabela
        },
        ufs: UFS
      });
    });
  }
});
var import_cloudflare;
var import_config;
var onRequest;
var init_config = __esm({
  "api/config.js"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_cloudflare = __toESM(require_cloudflare());
    import_config = __toESM(require_config());
    onRequest = import_cloudflare.default.paraCloudflare(import_config.default);
  }
});
var require_validacao = __commonJS({
  "../backend/lib/validacao.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { UFS, CARTELA } = require_dados();
    function limpar(valor, limite = 200) {
      return String(valor == null ? "" : valor).replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, limite);
    }
    __name(limpar, "limpar");
    __name2(limpar, "limpar");
    function limparTexto(valor, limite = 500) {
      return String(valor == null ? "" : valor).replace(/\r/g, "").replace(/[\x00-\x09\x0b-\x1f\x7f]/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, limite);
    }
    __name(limparTexto, "limparTexto");
    __name2(limparTexto, "limparTexto");
    var soDigitos = /* @__PURE__ */ __name2((valor) => String(valor || "").replace(/\D/g, ""), "soDigitos");
    function emailValido(email) {
      return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) && email.length <= 120;
    }
    __name(emailValido, "emailValido");
    __name2(emailValido, "emailValido");
    function normalizarWhatsApp(bruto) {
      let d = soDigitos(bruto);
      if (d.length === 10 || d.length === 11) d = "55" + d;
      if (d.length === 12 || d.length === 13) {
        return d.startsWith("55") ? d : null;
      }
      return null;
    }
    __name(normalizarWhatsApp, "normalizarWhatsApp");
    __name2(normalizarWhatsApp, "normalizarWhatsApp");
    function cpfValido(bruto) {
      const d = soDigitos(bruto);
      if (d.length !== 11) return false;
      if (/^(\d)\1{10}$/.test(d)) return false;
      const digito = /* @__PURE__ */ __name2((fatia, pesoInicial) => {
        let soma = 0;
        for (let i = 0; i < fatia.length; i++) soma += Number(fatia[i]) * (pesoInicial - i);
        const resto = soma * 10 % 11;
        return resto === 10 ? 0 : resto;
      }, "digito");
      return digito(d.slice(0, 9), 10) === Number(d[9]) && digito(d.slice(0, 10), 11) === Number(d[10]);
    }
    __name(cpfValido, "cpfValido");
    __name2(cpfValido, "cpfValido");
    function validarCliente(bruto, { exigirCpf }) {
      const dados = bruto && typeof bruto === "object" ? bruto : {};
      const campos = {};
      const nome = limpar(dados.nome, 80);
      if (nome.length < 3) campos.nome = "Escreva seu nome completo.";
      else if (!/\s/.test(nome)) campos.nome = "Falta o sobrenome \u2014 a transportadora precisa dele.";
      const email = limpar(dados.email, 120).toLowerCase();
      if (!emailValido(email)) campos.email = "Confira o e-mail. \xC9 por ele que o comprovante chega.";
      const whatsapp = normalizarWhatsApp(dados.whatsapp);
      if (!whatsapp) campos.whatsapp = "Informe o WhatsApp com DDD, ex.: (11) 98888-7777.";
      const cpf = soDigitos(dados.cpf);
      if (exigirCpf && !cpfValido(cpf)) campos.cpf = "CPF inv\xE1lido. O Pix n\xE3o \xE9 emitido sem ele.";
      else if (!exigirCpf && cpf && !cpfValido(cpf)) campos.cpf = "CPF inv\xE1lido.";
      return { campos, cliente: { nome, email, whatsapp, cpf: cpf || null } };
    }
    __name(validarCliente, "validarCliente");
    __name2(validarCliente, "validarCliente");
    function validarEntrega(bruto) {
      const dados = bruto && typeof bruto === "object" ? bruto : {};
      const campos = {};
      const cep = soDigitos(dados.cep);
      if (cep.length !== 8) campos.cep = "CEP deve ter 8 d\xEDgitos.";
      const rua = limpar(dados.rua, 120);
      if (rua.length < 3) campos.rua = "Informe a rua.";
      const numero = limpar(dados.numero, 12);
      if (!numero) campos.numero = "Informe o n\xFAmero, ou escreva S/N.";
      const bairro = limpar(dados.bairro, 80);
      if (bairro.length < 2) campos.bairro = "Informe o bairro.";
      const cidade = limpar(dados.cidade, 80);
      if (cidade.length < 2) campos.cidade = "Informe a cidade.";
      const estado = limpar(dados.estado, 2).toUpperCase();
      if (!UFS.includes(estado)) campos.estado = "Selecione o estado.";
      return {
        campos,
        entrega: { cep, rua, numero, complemento: limpar(dados.complemento, 80), bairro, cidade, estado }
      };
    }
    __name(validarEntrega, "validarEntrega");
    __name2(validarEntrega, "validarEntrega");
    function validarItens(bruto, maxQuantidade) {
      const campos = {};
      if (!Array.isArray(bruto) || bruto.length === 0) {
        campos.itens = "Sua sacola est\xE1 vazia.";
        return { campos, itens: [] };
      }
      if (bruto.length > 20) {
        campos.itens = "Muitas pe\xE7as de uma vez. Fale com a gente pelo WhatsApp.";
        return { campos, itens: [] };
      }
      const itens = [];
      for (const linha of bruto) {
        const slug = limpar(linha && linha.slug, 60).toLowerCase();
        if (!/^[a-z0-9-]+$/.test(slug)) {
          campos.itens = "Alguma pe\xE7a da sacola n\xE3o foi reconhecida.";
          break;
        }
        let quantidade = Number(linha && linha.quantidade);
        if (!Number.isInteger(quantidade) || quantidade < 1) quantidade = 1;
        if (quantidade > maxQuantidade) quantidade = maxQuantidade;
        const cor = limpar(linha && linha.cor, 40);
        const corValida = CARTELA.some((c) => c.nome === cor) ? cor : null;
        itens.push({ slug, quantidade, cor: corValida });
      }
      return { campos, itens };
    }
    __name(validarItens, "validarItens");
    __name2(validarItens, "validarItens");
    function metodoValido(metodo) {
      return ["pix", "cartao", "debito", "checkout"].includes(metodo);
    }
    __name(metodoValido, "metodoValido");
    __name2(metodoValido, "metodoValido");
    module.exports = {
      limpar,
      limparTexto,
      soDigitos,
      emailValido,
      normalizarWhatsApp,
      cpfValido,
      validarCliente,
      validarEntrega,
      validarItens,
      metodoValido
    };
  }
});
var require_armazenamento = __commonJS({
  "../backend/lib/armazenamento.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var crypto = require_crypto();
    var URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    var TOKEN_REDIS = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    var configurado = Boolean(URL_REDIS && TOKEN_REDIS);
    var DIAS_RETENCAO = Number(process.env.RETENCAO_PEDIDOS_DIAS || 180);
    var SEGUNDOS_RETENCAO = DIAS_RETENCAO * 24 * 60 * 60;
    var memoria = globalThis.__begoniaMemoria || (globalThis.__begoniaMemoria = /* @__PURE__ */ new Map());
    async function comando(...args) {
      if (!configurado) return null;
      const resposta = await fetch(URL_REDIS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN_REDIS}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
      });
      if (!resposta.ok) {
        console.error("[armazenamento] Redis respondeu %s", resposta.status);
        return null;
      }
      const dados = await resposta.json();
      return dados ? dados.result : null;
    }
    __name(comando, "comando");
    __name2(comando, "comando");
    function avisarSeSemRedis(operacao) {
      if (!configurado) {
        console.warn(
          "[armazenamento] Redis n\xE3o configurado (%s foi para a mem\xF3ria). Defina KV_REST_API_URL e KV_REST_API_TOKEN para ter hist\xF3rico de verdade.",
          operacao
        );
      }
    }
    __name(avisarSeSemRedis, "avisarSeSemRedis");
    __name2(avisarSeSemRedis, "avisarSeSemRedis");
    function chavePedido(referencia) {
      return `begonia:pedido:${referencia}`;
    }
    __name(chavePedido, "chavePedido");
    __name2(chavePedido, "chavePedido");
    async function salvarPedido(referencia, dados) {
      const registro = JSON.stringify({ ...dados, atualizadoEm: (/* @__PURE__ */ new Date()).toISOString() });
      avisarSeSemRedis("salvarPedido");
      if (!configurado) {
        memoria.set(chavePedido(referencia), registro);
        return true;
      }
      await comando("SET", chavePedido(referencia), registro, "EX", SEGUNDOS_RETENCAO);
      await comando("ZADD", "begonia:pedidos", Date.now(), referencia);
      return true;
    }
    __name(salvarPedido, "salvarPedido");
    __name2(salvarPedido, "salvarPedido");
    async function lerPedido(referencia) {
      const bruto = configurado ? await comando("GET", chavePedido(referencia)) : memoria.get(chavePedido(referencia));
      if (!bruto) return null;
      try {
        return typeof bruto === "string" ? JSON.parse(bruto) : bruto;
      } catch {
        return null;
      }
    }
    __name(lerPedido, "lerPedido");
    __name2(lerPedido, "lerPedido");
    async function atualizarPedido(referencia, mudancas) {
      const atual = await lerPedido(referencia) || {};
      return salvarPedido(referencia, { ...atual, ...mudancas });
    }
    __name(atualizarPedido, "atualizarPedido");
    __name2(atualizarPedido, "atualizarPedido");
    async function reservarNotificacao(referencia) {
      const chave = `begonia:notificado:${referencia}`;
      if (!configurado) {
        avisarSeSemRedis("reservarNotificacao");
        if (memoria.has(chave)) return false;
        memoria.set(chave, "1");
        return true;
      }
      const resultado = await comando("SET", chave, (/* @__PURE__ */ new Date()).toISOString(), "NX", "EX", SEGUNDOS_RETENCAO);
      return resultado === "OK";
    }
    __name(reservarNotificacao, "reservarNotificacao");
    __name2(reservarNotificacao, "reservarNotificacao");
    async function liberarNotificacao(referencia) {
      const chave = `begonia:notificado:${referencia}`;
      if (!configurado) {
        memoria.delete(chave);
        return;
      }
      await comando("DEL", chave);
    }
    __name(liberarNotificacao, "liberarNotificacao");
    __name2(liberarNotificacao, "liberarNotificacao");
    function chaveCliente(email) {
      const normalizado = String(email || "").trim().toLowerCase();
      return crypto.createHash("sha256").update(normalizado).digest("hex").slice(0, 32);
    }
    __name(chaveCliente, "chaveCliente");
    __name2(chaveCliente, "chaveCliente");
    var historicoEmMemoria = process.env.HISTORICO_EM_MEMORIA === "true";
    var chaveClientes = "begonia:clientes";
    async function jaComprou(email) {
      if (!configurado) {
        if (!historicoEmMemoria) return null;
        const lista = memoria.get(chaveClientes) || /* @__PURE__ */ new Set();
        return lista.has(chaveCliente(email));
      }
      const resultado = await comando("SISMEMBER", chaveClientes, chaveCliente(email));
      return Number(resultado) === 1;
    }
    __name(jaComprou, "jaComprou");
    __name2(jaComprou, "jaComprou");
    async function registrarCliente(email) {
      if (!configurado) {
        if (!historicoEmMemoria) return false;
        const lista = memoria.get(chaveClientes) || /* @__PURE__ */ new Set();
        lista.add(chaveCliente(email));
        memoria.set(chaveClientes, lista);
        return true;
      }
      await comando("SADD", chaveClientes, chaveCliente(email));
      return true;
    }
    __name(registrarCliente, "registrarCliente");
    __name2(registrarCliente, "registrarCliente");
    async function dentroDoLimite(chaveBruta, limite, janelaSegundos) {
      const chave = `begonia:taxa:${chaveBruta}`;
      if (!configurado) {
        const agora = Date.now();
        const registro = memoria.get(chave) || { contagem: 0, expira: agora + janelaSegundos * 1e3 };
        if (agora > registro.expira) {
          registro.contagem = 0;
          registro.expira = agora + janelaSegundos * 1e3;
        }
        registro.contagem += 1;
        memoria.set(chave, registro);
        return registro.contagem <= limite;
      }
      const contagem = await comando("INCR", chave);
      if (contagem === 1) await comando("EXPIRE", chave, janelaSegundos);
      return Number(contagem) <= limite;
    }
    __name(dentroDoLimite, "dentroDoLimite");
    __name2(dentroDoLimite, "dentroDoLimite");
    module.exports = {
      configurado,
      salvarPedido,
      lerPedido,
      atualizarPedido,
      reservarNotificacao,
      liberarNotificacao,
      jaComprou,
      registrarCliente,
      dentroDoLimite
    };
  }
});
var require_criar_pagamento = __commonJS({
  "../backend/rotas/criar-pagamento.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { rota: rota7, json, erro, lerCorpo, ipDoPedido } = require_http();
    var { validarCliente, validarEntrega, validarItens, limparTexto, metodoValido } = require_validacao();
    var { montarPedido, novaReferencia } = require_pedido();
    var { gateway } = require_gateway();
    var armazenamento = require_armazenamento();
    var { PAGAMENTO, DESCONTOS } = require_dados();
    function urlDoSite(req) {
      if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const protocolo = req.headers["x-forwarded-proto"] || "https";
      return `${protocolo}://${host}`;
    }
    __name(urlDoSite, "urlDoSite");
    __name2(urlDoSite, "urlDoSite");
    function pagamentoConfigurado() {
      const escolhido = process.env.GATEWAY || "mercadopago";
      if (escolhido === "simulado") return true;
      if (escolhido === "infinitepay") return Boolean(process.env.INFINITEPAY_HANDLE);
      return Boolean(process.env.MP_ACCESS_TOKEN);
    }
    __name(pagamentoConfigurado, "pagamentoConfigurado");
    __name2(pagamentoConfigurado, "pagamentoConfigurado");
    module.exports = rota7(["POST"], async (req, res) => {
      if (!pagamentoConfigurado()) {
        return erro(res, 503, "O pagamento online ainda n\xE3o est\xE1 configurado. Fale com a gente pelo WhatsApp.");
      }
      const liberado = await armazenamento.dentroDoLimite(`pagar:${ipDoPedido(req)}`, 10, 600);
      if (!liberado) {
        return erro(res, 429, "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.");
      }
      let corpo;
      try {
        corpo = await lerCorpo(req);
      } catch {
        return erro(res, 413, "Pedido grande demais.");
      }
      if (!corpo) return erro(res, 400, "N\xE3o entendemos o pedido enviado.");
      const metodo = String(corpo.metodo || "");
      if (!metodoValido(metodo)) return erro(res, 400, "Escolha uma forma de pagamento.");
      const g = gateway();
      const capacidades = g.capacidades || {};
      const exigirCpf = Boolean(capacidades.exigeCpf) && metodo === "pix";
      const { campos: camposCliente, cliente } = validarCliente(corpo.cliente, { exigirCpf });
      const { campos: camposEntrega, entrega } = validarEntrega(corpo.entrega);
      const { campos: camposItens, itens } = validarItens(corpo.itens, PAGAMENTO.maxQuantidadePorPeca);
      const camposComErro = { ...camposCliente, ...camposEntrega, ...camposItens };
      if (Object.keys(camposComErro).length) {
        return erro(res, 422, "Confira os campos destacados.", camposComErro);
      }
      let primeiraCompra = false;
      if (DESCONTOS.primeiraCompra.ativo) {
        const comprou = await armazenamento.jaComprou(cliente.email);
        primeiraCompra = comprou === false;
      }
      const { campos: camposPedido, pedido } = montarPedido(itens, entrega.estado, {
        metodo,
        primeiraCompra
      });
      if (Object.keys(camposPedido).length) {
        return erro(res, 422, camposPedido.itens || camposPedido.estado || "N\xE3o foi poss\xEDvel montar o pedido.", camposPedido);
      }
      const observacoes = limparTexto(corpo.observacoes, 500);
      const referencia = novaReferencia();
      const urlSite = urlDoSite(req);
      const registro = {
        referencia,
        criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
        status: "pendente",
        pedido,
        cliente: { nome: cliente.nome, email: cliente.email, whatsapp: cliente.whatsapp },
        entrega,
        observacoes,
        pagamento: {
          metodo,
          idGateway: null,
          pagoEm: null,
          // Guardamos o que a pessoa DECLAROU. Se o gateway avisar depois que ela
          // pagou de outro jeito, dá para comparar — ver api/webhook.js.
          metodoDeclarado: metodo
        }
      };
      await armazenamento.salvarPedido(referencia, registro);
      let resultado;
      try {
        if (capacidades.escolhaNoGateway && g.criarPagamentoUnico) {
          resultado = await g.criarPagamentoUnico({ referencia, pedido, cliente, entrega, urlSite });
        } else if (metodo === "pix") {
          resultado = await g.criarPagamentoPix({ referencia, pedido, cliente, urlSite });
        } else {
          resultado = await g.criarPagamentoCartao({ referencia, pedido, cliente, metodo, urlSite });
        }
      } catch (e) {
        console.error("[criar-pagamento] gateway falhou no pedido %s:", referencia, e.message);
        await armazenamento.atualizarPedido(referencia, { status: "falhou", erroGateway: e.message });
        return erro(
          res,
          502,
          "O pagamento n\xE3o p\xF4de ser aberto agora. Tente outra forma de pagamento ou fale com a gente pelo WhatsApp."
        );
      }
      await armazenamento.atualizarPedido(referencia, {
        pagamento: { ...registro.pagamento, idGateway: resultado.idGateway }
      });
      json(res, 200, {
        ok: true,
        referencia,
        metodo,
        tipo: resultado.tipo,
        total: pedido.total,
        subtotal: pedido.subtotal,
        frete: pedido.frete,
        descontos: pedido.descontos,
        descontoTotal: pedido.descontoTotal,
        itens: pedido.itens.map((i) => ({ nome: i.nome, quantidade: i.quantidade, precoTotal: i.precoTotal })),
        // Cartão: para onde mandar o cliente. Pix: o que desenhar na tela.
        url: resultado.url || null,
        qrCodeTexto: resultado.qrCodeTexto || null,
        qrCodeImagem: resultado.qrCodeImagem || null,
        expiraEm: resultado.expiraEm || null
      });
    });
  }
});
var import_cloudflare2;
var import_criar_pagamento;
var onRequest2;
var init_criar_pagamento = __esm({
  "api/criar-pagamento.js"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_cloudflare2 = __toESM(require_cloudflare());
    import_criar_pagamento = __toESM(require_criar_pagamento());
    onRequest2 = import_cloudflare2.default.paraCloudflare(import_criar_pagamento.default);
  }
});
var require_orcamento = __commonJS({
  "../backend/rotas/orcamento.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { rota: rota7, json, erro, lerCorpo, ipDoPedido } = require_http();
    var { validarItens, limpar, emailValido, metodoValido } = require_validacao();
    var { montarPedido } = require_pedido();
    var armazenamento = require_armazenamento();
    var { PAGAMENTO, DESCONTOS, UFS } = require_dados();
    module.exports = rota7(["POST"], async (req, res) => {
      const liberado = await armazenamento.dentroDoLimite(`orcamento:${ipDoPedido(req)}`, 240, 600);
      if (!liberado) return erro(res, 429, "Muitas consultas seguidas. Espere um pouco.");
      let corpo;
      try {
        corpo = await lerCorpo(req);
      } catch {
        return erro(res, 413, "Pedido grande demais.");
      }
      if (!corpo) return erro(res, 400, "N\xE3o entendemos o pedido enviado.");
      const { campos, itens } = validarItens(corpo.itens, PAGAMENTO.maxQuantidadePorPeca);
      if (Object.keys(campos).length) return erro(res, 422, campos.itens, campos);
      const estado = limpar(corpo.estado, 2).toUpperCase();
      const metodo = metodoValido(corpo.metodo) ? corpo.metodo : null;
      const email = limpar(corpo.email, 120).toLowerCase();
      let primeiraCompra = false;
      if (DESCONTOS.primeiraCompra.ativo && emailValido(email)) {
        const comprou = await armazenamento.jaComprou(email);
        primeiraCompra = comprou === false;
      }
      if (!UFS.includes(estado)) {
        const parcial = montarPedido(itens, "SP", { metodo, primeiraCompra });
        if (!parcial.pedido) return erro(res, 422, parcial.campos.itens || "N\xE3o foi poss\xEDvel calcular.", parcial.campos);
        return json(res, 200, {
          ok: true,
          subtotal: parcial.pedido.subtotal,
          descontos: parcial.pedido.descontos,
          descontoTotal: parcial.pedido.descontoTotal,
          frete: null,
          // aguardando o CEP
          freteGratis: null,
          total: null,
          primeiraCompra
        });
      }
      const { campos: camposPedido, pedido } = montarPedido(itens, estado, { metodo, primeiraCompra });
      if (Object.keys(camposPedido).length) {
        return erro(res, 422, camposPedido.itens || camposPedido.estado || "N\xE3o foi poss\xEDvel calcular.", camposPedido);
      }
      json(res, 200, {
        ok: true,
        subtotal: pedido.subtotal,
        descontos: pedido.descontos,
        descontoTotal: pedido.descontoTotal,
        frete: pedido.frete,
        freteGratis: pedido.freteGratis,
        faltaParaFreteGratis: pedido.faltaParaFreteGratis,
        total: pedido.total,
        primeiraCompra
      });
    });
  }
});
var import_cloudflare3;
var import_orcamento;
var onRequest3;
var init_orcamento = __esm({
  "api/orcamento.js"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_cloudflare3 = __toESM(require_cloudflare());
    import_orcamento = __toESM(require_orcamento());
    onRequest3 = import_cloudflare3.default.paraCloudflare(import_orcamento.default);
  }
});
var require_simulado_pagar = __commonJS({
  "../backend/rotas/simulado-pagar.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { rota: rota7, json, erro, lerCorpo } = require_http();
    var { gateway } = require_gateway();
    var armazenamento = require_armazenamento();
    function urlDoSite(req) {
      if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const protocolo = req.headers["x-forwarded-proto"] || "http";
      return `${protocolo}://${host}`;
    }
    __name(urlDoSite, "urlDoSite");
    __name2(urlDoSite, "urlDoSite");
    module.exports = rota7(["POST"], async (req, res) => {
      if ((process.env.GATEWAY || "") !== "simulado") {
        return erro(res, 404, "Esta rota s\xF3 existe com o gateway simulado.");
      }
      const corpo = await lerCorpo(req);
      const id = corpo && corpo.id;
      const decisao = corpo && corpo.decisao;
      if (!id || !["aprovar", "recusar"].includes(decisao)) {
        return erro(res, 400, "Informe o id do pagamento e a decis\xE3o (aprovar ou recusar).");
      }
      const g = gateway();
      g.registrarDecisao(id, decisao);
      await armazenamento.salvarPedido(`simulado:${id}`, { decisao, em: (/* @__PURE__ */ new Date()).toISOString() });
      const urlSite = urlDoSite(req);
      let webhook = null;
      try {
        const resposta = await fetch(`${urlSite}/api/webhook`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-simulado": String(id) },
          body: JSON.stringify({ type: "payment", data: { id } })
        });
        webhook = resposta.status;
      } catch (e) {
        console.error("[simulado-pagar] webhook n\xE3o respondeu:", e.message);
      }
      json(res, 200, { ok: true, decisao, webhook });
    });
  }
});
var import_cloudflare4;
var import_simulado_pagar;
var onRequest4;
var init_simulado_pagar = __esm({
  "api/simulado-pagar.js"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_cloudflare4 = __toESM(require_cloudflare());
    import_simulado_pagar = __toESM(require_simulado_pagar());
    onRequest4 = import_cloudflare4.default.paraCloudflare(import_simulado_pagar.default);
  }
});
var require_status_pagamento = __commonJS({
  "../backend/rotas/status-pagamento.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { rota: rota7, json, erro, ipDoPedido } = require_http();
    var { gateway } = require_gateway();
    var armazenamento = require_armazenamento();
    module.exports = rota7(["GET"], async (req, res) => {
      const url = new URL(req.url, "http://interno");
      const referencia = String(url.searchParams.get("ref") || "").trim().toUpperCase();
      if (!/^BA-[A-Z2-9]{8}$/.test(referencia)) {
        return erro(res, 400, "Refer\xEAncia de pedido inv\xE1lida.");
      }
      const liberado = await armazenamento.dentroDoLimite(`status:${ipDoPedido(req)}`, 120, 600);
      if (!liberado) return erro(res, 429, "Muitas consultas seguidas. Espere um pouco.");
      const registro = await armazenamento.lerPedido(referencia);
      if (!registro) {
        return erro(res, 404, "Pedido n\xE3o encontrado. Se voc\xEA acabou de pagar, aguarde alguns segundos.");
      }
      let status = registro.status;
      if (status === "pendente" && registro.pagamento && registro.pagamento.idGateway) {
        try {
          const g = gateway();
          const atual = await g.consultarPagamento(registro.pagamento.idGateway);
          if (atual.status !== status) {
            status = atual.status;
            await armazenamento.atualizarPedido(referencia, {
              status,
              pagamento: { ...registro.pagamento, pagoEm: atual.pagoEm }
            });
          }
        } catch (e) {
          console.error("[status-pagamento] consulta ao gateway falhou (%s):", referencia, e.message);
        }
      }
      json(res, 200, {
        ok: true,
        referencia,
        status,
        // pendente | aprovado | recusado | falhou
        metodo: registro.pagamento ? registro.pagamento.metodo : null,
        total: registro.pedido ? registro.pedido.total : null,
        frete: registro.pedido ? registro.pedido.frete : null,
        subtotal: registro.pedido ? registro.pedido.subtotal : null,
        itens: registro.pedido ? registro.pedido.itens.map((i) => ({ nome: i.nome, quantidade: i.quantidade, precoTotal: i.precoTotal })) : [],
        // Primeiro nome só para a tela dizer "Obrigada, Ana" sem expor o resto.
        primeiroNome: registro.cliente ? String(registro.cliente.nome).split(" ")[0] : null
      });
    });
  }
});
var import_cloudflare5;
var import_status_pagamento;
var onRequest5;
var init_status_pagamento = __esm({
  "api/status-pagamento.js"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_cloudflare5 = __toESM(require_cloudflare());
    import_status_pagamento = __toESM(require_status_pagamento());
    onRequest5 = import_cloudflare5.default.paraCloudflare(import_status_pagamento.default);
  }
});
var require_notificacao = __commonJS({
  "../backend/lib/notificacao.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { ATELIE, formatarPreco, linkWhatsApp } = require_dados();
    function esc(valor) {
      return String(valor == null ? "" : valor).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    __name(esc, "esc");
    __name2(esc, "esc");
    function telefoneLegivel(numero) {
      const d = String(numero || "");
      if (d.length === 13) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
      if (d.length === 12) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 8)}-${d.slice(8)}`;
      return d;
    }
    __name(telefoneLegivel, "telefoneLegivel");
    __name2(telefoneLegivel, "telefoneLegivel");
    function cepLegivel(cep) {
      const d = String(cep || "");
      return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    }
    __name(cepLegivel, "cepLegivel");
    __name2(cepLegivel, "cepLegivel");
    var NOME_METODO = {
      pix: "Pix",
      cartao: "Cart\xE3o de cr\xE9dito",
      debito: "Cart\xE3o de d\xE9bito",
      checkout: "escolhida na p\xE1gina do provedor"
    };
    async function enviarEmail({ para, assunto, html, responderPara }) {
      const chave = process.env.RESEND_API_KEY;
      const remetente = process.env.EMAIL_REMETENTE;
      if (!chave || !remetente) {
        console.warn("[notificacao] RESEND_API_KEY ou EMAIL_REMETENTE ausente: e-mail n\xE3o enviado para %s", para);
        return { enviado: false, motivo: "configuracao-ausente" };
      }
      const resposta = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${chave}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: remetente,
          to: [para],
          subject: assunto,
          html,
          ...responderPara ? { reply_to: responderPara } : {}
        })
      });
      if (!resposta.ok) {
        const texto = await resposta.text();
        console.error("[notificacao] Resend respondeu %s: %s", resposta.status, texto.slice(0, 400));
        return { enviado: false, motivo: `resend-${resposta.status}` };
      }
      return { enviado: true };
    }
    __name(enviarEmail, "enviarEmail");
    __name2(enviarEmail, "enviarEmail");
    var COR = {
      fundo: "#faf9f6",
      cartao: "#ffffff",
      primaria: "#a03f28",
      texto: "#1a1c1a",
      suave: "#56423d",
      linha: "#ddc0ba",
      oliva: "#596338"
    };
    function moldura(titulo, miolo) {
      return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:24px;background:${COR.fundo};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${COR.texto}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:${COR.cartao};border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(93,64,55,.08)">
    <tr><td style="padding:28px 28px 8px">
      <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${COR.oliva}">Beg\xF4nia Ateli\xEA</p>
      <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:24px;font-weight:600;color:${COR.primaria}">${esc(titulo)}</h1>
    </td></tr>
    <tr><td style="padding:16px 28px 28px">${miolo}</td></tr>
  </table>
  <p style="max-width:600px;margin:16px auto 0;font-size:12px;color:${COR.suave};text-align:center">
    Enviado automaticamente pelo site do ${esc(ATELIE.nome)}.
  </p>
</body></html>`;
    }
    __name(moldura, "moldura");
    __name2(moldura, "moldura");
    function tabelaItens(pedido) {
      const linhas = pedido.itens.map(
        (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${COR.linha}66">
          <strong style="font-weight:600">${esc(i.nome)}</strong><br>
          <span style="font-size:13px;color:${COR.suave}">
            ${i.quantidade} \xD7 ${esc(formatarPreco(i.precoUnitario))}${i.cor ? " &middot; <strong>" + esc(i.cor) + "</strong>" : ""}
          </span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid ${COR.linha}66;text-align:right;white-space:nowrap">
          ${esc(formatarPreco(i.precoTotal))}
        </td>
      </tr>`
      ).join("");
      return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
    ${linhas}
    <tr>
      <td style="padding:10px 0 0;color:${COR.suave}">Subtotal</td>
      <td style="padding:10px 0 0;text-align:right">${esc(formatarPreco(pedido.subtotal))}</td>
    </tr>
    ${(pedido.descontos || []).map(
        (d) => `
    <tr>
      <td style="padding:4px 0;color:${COR.oliva}">${esc(d.rotulo)} (${d.percentual}%)</td>
      <td style="padding:4px 0;text-align:right;color:${COR.oliva}">\u2212 ${esc(formatarPreco(d.valor))}</td>
    </tr>`
      ).join("")}
    <tr>
      <td style="padding:4px 0;color:${COR.suave}">Frete</td>
      <td style="padding:4px 0;text-align:right">${pedido.frete === 0 ? "Gr\xE1tis" : esc(formatarPreco(pedido.frete))}</td>
    </tr>
    <tr>
      <td style="padding:12px 0 0;border-top:2px solid ${COR.linha};font-weight:700">Total pago</td>
      <td style="padding:12px 0 0;border-top:2px solid ${COR.linha};text-align:right;font-weight:700;color:${COR.primaria};font-size:18px">
        ${esc(formatarPreco(pedido.total))}
      </td>
    </tr>
  </table>`;
    }
    __name(tabelaItens, "tabelaItens");
    __name2(tabelaItens, "tabelaItens");
    function blocoDados(titulo, pares) {
      const linhas = pares.filter(([, valor]) => valor).map(
        ([rotulo, valor]) => `
      <tr>
        <td style="padding:3px 12px 3px 0;color:${COR.suave};white-space:nowrap;vertical-align:top">${esc(rotulo)}</td>
        <td style="padding:3px 0">${esc(valor)}</td>
      </tr>`
      ).join("");
      return `
  <h2 style="margin:28px 0 10px;font-family:Georgia,serif;font-size:17px;font-weight:600;color:${COR.texto}">${esc(titulo)}</h2>
  <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;width:100%">${linhas}</table>`;
    }
    __name(blocoDados, "blocoDados");
    __name2(blocoDados, "blocoDados");
    function emailParaDona(registro) {
      const { referencia, pedido, cliente, entrega, pagamento, observacoes } = registro;
      const enderecoLinha = [
        `${entrega.rua}, ${entrega.numero}`,
        entrega.complemento,
        entrega.bairro,
        `${entrega.cidade} / ${entrega.estado}`,
        `CEP ${cepLegivel(entrega.cep)}`
      ].filter(Boolean).join(" \u2014 ");
      const msgCliente = `Oi, ${cliente.nome.split(" ")[0]}! Aqui \xE9 do Beg\xF4nia Ateli\xEA. Recebemos seu pagamento do pedido ${referencia} e j\xE1 estamos preparando tudo. Assim que postar, te mando o c\xF3digo de rastreio por aqui.`;
      const linkFalarComCliente = `https://wa.me/${cliente.whatsapp}?text=${encodeURIComponent(msgCliente)}`;
      const miolo = `
    <p style="margin:0 0 4px;font-size:15px;color:${COR.suave}">
      Pagamento aprovado. Pedido <strong style="color:${COR.texto}">${esc(referencia)}</strong>.
    </p>
    ${tabelaItens(pedido)}
    ${blocoDados("Cliente", [
        ["Nome", cliente.nome],
        ["WhatsApp", telefoneLegivel(cliente.whatsapp)],
        ["E-mail", cliente.email]
      ])}
    ${blocoDados("Entrega", [["Endere\xE7o", enderecoLinha]])}
    ${pagamento.metodoDivergente ? `<p style="margin:24px 0 0;padding:14px 16px;background:#ffdad6;border-radius:10px;font-size:14px;color:#93000a">
             <strong>Confira a forma de pagamento.</strong> No site a pessoa escolheu
             ${esc(NOME_METODO[pagamento.metodoDeclarado] || pagamento.metodoDeclarado)} e ganhou o desconto
             correspondente, mas o pagamento chegou como
             ${esc(NOME_METODO[pagamento.metodoRealizado] || pagamento.metodoRealizado)}.
           </p>` : ""}
    ${blocoDados("Pagamento", [
        ["Forma", NOME_METODO[pagamento.metodoRealizado || pagamento.metodo] || pagamento.metodo],
        ["Status", "Aprovado"],
        ["ID no Mercado Pago", pagamento.idGateway],
        ["Pago em", pagamento.pagoEm ? new Date(pagamento.pagoEm).toLocaleString("pt-BR") : ""]
      ])}
    ${observacoes ? `<h2 style="margin:28px 0 10px;font-family:Georgia,serif;font-size:17px;font-weight:600">Observa\xE7\xF5es do cliente</h2>
           <p style="margin:0;padding:12px 14px;background:${COR.fundo};border-radius:10px;font-size:14px;white-space:pre-wrap">${esc(observacoes)}</p>` : ""}
    <p style="margin:28px 0 0">
      <a href="${esc(linkFalarComCliente)}"
         style="display:inline-block;padding:14px 26px;background:${COR.primaria};color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">
        Falar com ${esc(cliente.nome.split(" ")[0])} no WhatsApp
      </a>
    </p>
    <p style="margin:20px 0 0;font-size:12px;color:${COR.suave}">
      O CPF do cliente n\xE3o \xE9 guardado por aqui \u2014 ele est\xE1 no painel do Mercado Pago,
      no pagamento ${esc(pagamento.idGateway)}.
    </p>`;
      return {
        // Assunto sem sinal de menor/maior: cabeçalho de e-mail não é lugar de markup.
        assunto: `Pedido pago ${referencia} \u2014 ${formatarPreco(pedido.total)} \u2014 ${cliente.nome.replace(/[<>]/g, "")}`,
        html: moldura("Chegou um pedido pago", miolo)
      };
    }
    __name(emailParaDona, "emailParaDona");
    __name2(emailParaDona, "emailParaDona");
    function emailParaCliente(registro) {
      const { referencia, pedido, cliente, entrega } = registro;
      const miolo = `
    <p style="margin:0 0 16px;font-size:15px;color:${COR.suave}">
      Oi, ${esc(cliente.nome.split(" ")[0])}. Seu pagamento foi aprovado e seu pedido
      <strong style="color:${COR.texto}">${esc(referencia)}</strong> j\xE1 entrou na nossa fila.
      Assim que ele for postado, mandamos o c\xF3digo de rastreio no seu WhatsApp.
    </p>
    ${tabelaItens(pedido)}
    ${blocoDados("Vai para", [
        [
          "Endere\xE7o",
          `${entrega.rua}, ${entrega.numero}${entrega.complemento ? " \u2014 " + entrega.complemento : ""} \u2014 ${entrega.bairro} \u2014 ${entrega.cidade}/${entrega.estado} \u2014 CEP ${cepLegivel(entrega.cep)}`
        ]
      ])}
    <p style="margin:28px 0 0;font-size:14px;color:${COR.suave}">
      Qualquer d\xFAvida \xE9 s\xF3 responder este e-mail ou chamar no WhatsApp
      <a href="${esc(linkWhatsApp(`Ol\xE1! \xC9 sobre o pedido ${referencia}.`))}" style="color:${COR.primaria}">${esc(telefoneLegivel(ATELIE.whatsapp))}</a>.
    </p>`;
      return {
        assunto: `Recebemos seu pagamento \u2014 pedido ${referencia}`,
        html: moldura("Pagamento confirmado", miolo)
      };
    }
    __name(emailParaCliente, "emailParaCliente");
    __name2(emailParaCliente, "emailParaCliente");
    async function avisarPedidoPago(registro) {
      const paraDona = process.env.EMAIL_DONA;
      const resultados = { dona: null, cliente: null };
      if (!paraDona) {
        console.warn("[notificacao] EMAIL_DONA ausente: ningu\xE9m foi avisado do pedido %s", registro.referencia);
        resultados.dona = { enviado: false, motivo: "email-dona-ausente" };
      } else {
        const { assunto, html } = emailParaDona(registro);
        resultados.dona = await enviarEmail({
          para: paraDona,
          assunto,
          html,
          // Responder o e-mail cai direto na caixa do cliente.
          responderPara: registro.cliente.email
        });
      }
      if (process.env.ENVIAR_RECIBO_CLIENTE !== "false") {
        const { assunto, html } = emailParaCliente(registro);
        resultados.cliente = await enviarEmail({
          para: registro.cliente.email,
          assunto,
          html,
          responderPara: paraDona || void 0
        });
      }
      return resultados;
    }
    __name(avisarPedidoPago, "avisarPedidoPago");
    __name2(avisarPedidoPago, "avisarPedidoPago");
    module.exports = { avisarPedidoPago, emailParaDona, emailParaCliente, enviarEmail, esc };
  }
});
var require_webhook = __commonJS({
  "../backend/rotas/webhook.js"(exports, module) {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { rota: rota7, json, lerCorpo } = require_http();
    var { gateway } = require_gateway();
    var armazenamento = require_armazenamento();
    var { avisarPedidoPago } = require_notificacao();
    module.exports = rota7(["POST"], async (req, res) => {
      let corpo = null;
      try {
        corpo = await lerCorpo(req);
      } catch {
        return json(res, 200, { ok: true, ignorado: "corpo-invalido" });
      }
      const url = new URL(req.url, "http://interno");
      const g = gateway();
      const notificacao = g.extrairNotificacao({ corpo, query: url.searchParams });
      if (!notificacao.ehPagamento) {
        return json(res, 200, { ok: true, ignorado: notificacao.motivo || "nao-e-pagamento" });
      }
      const idPagamento = notificacao.idRecurso;
      const assinatura = g.validarWebhook({ cabecalhos: req.headers, corpo, idRecurso: idPagamento });
      if (!assinatura.valido) {
        console.warn("[webhook] notifica\xE7\xE3o descartada (%s) para o pagamento %s", assinatura.motivo, idPagamento);
        return json(res, 401, { ok: false, erro: "assinatura-invalida" });
      }
      const idParaConsulta = assinatura.idGateway || idPagamento;
      let pagamento;
      try {
        pagamento = await g.consultarPagamento(idParaConsulta);
      } catch (e) {
        console.error("[webhook] n\xE3o consegui consultar o pagamento %s:", idPagamento, e.message);
        return json(res, 500, { ok: false, erro: "consulta-falhou" });
      }
      const referencia = pagamento.referencia;
      if (!referencia) {
        return json(res, 200, { ok: true, ignorado: "sem-referencia" });
      }
      const registro = await armazenamento.lerPedido(referencia);
      if (!registro) {
        console.warn("[webhook] pagamento %s aponta para o pedido %s, que n\xE3o est\xE1 no hist\xF3rico", idPagamento, referencia);
        return json(res, 200, { ok: true, ignorado: "pedido-desconhecido" });
      }
      const totalEsperado = registro.pedido ? Number(registro.pedido.total) : null;
      const valorInformado = pagamento.valor !== null && pagamento.valor !== void 0;
      const valorPago = Number(pagamento.valor);
      const bate = !valorInformado || totalEsperado !== null && Math.abs(totalEsperado - valorPago) < 0.01;
      if (pagamento.status === "aprovado" && !bate) {
        console.error(
          "[webhook] valor divergente no pedido %s: esperado %s, pago %s",
          referencia,
          totalEsperado,
          valorPago
        );
        await armazenamento.atualizarPedido(referencia, { status: "conferir", valorPago });
        return json(res, 200, { ok: true, ignorado: "valor-divergente" });
      }
      await armazenamento.atualizarPedido(referencia, {
        status: pagamento.status,
        pagamento: {
          ...registro.pagamento || {},
          idGateway: pagamento.idGateway,
          pagoEm: pagamento.pagoEm,
          statusOriginal: pagamento.statusOriginal
          // Bandeira e últimos dígitos ficam no Mercado Pago, não aqui.
        }
      });
      if (pagamento.status !== "aprovado") {
        return json(res, 200, { ok: true, status: pagamento.status });
      }
      if (registro.cliente && registro.cliente.email) {
        await armazenamento.registrarCliente(registro.cliente.email);
      }
      const declarado = registro.pagamento && registro.pagamento.metodoDeclarado;
      const realizado = pagamento.metodo === "pix" ? "pix" : pagamento.metodo ? "cartao" : null;
      const metodoDivergente = Boolean(declarado && realizado) && declarado !== "checkout" && declarado !== realizado;
      if (metodoDivergente) {
        console.warn(
          "[webhook] pedido %s: declarou %s e pagou %s",
          referencia,
          declarado,
          realizado
        );
      }
      const primeiraVez = await armazenamento.reservarNotificacao(referencia);
      if (!primeiraVez) {
        return json(res, 200, { ok: true, status: "aprovado", notificacao: "ja-enviada" });
      }
      try {
        const resultado = await avisarPedidoPago({
          ...registro,
          status: "aprovado",
          pagamento: {
            ...registro.pagamento || {},
            idGateway: pagamento.idGateway,
            pagoEm: pagamento.pagoEm,
            metodoRealizado: realizado,
            metodoDivergente
          }
        });
        if (!resultado.dona || !resultado.dona.enviado) {
          await armazenamento.liberarNotificacao(referencia);
          console.error("[webhook] aviso \xE0 dona n\xE3o saiu no pedido %s: %s", referencia, resultado.dona && resultado.dona.motivo);
        }
      } catch (e) {
        await armazenamento.liberarNotificacao(referencia);
        console.error("[webhook] falha ao avisar do pedido %s:", referencia, e.message);
      }
      return json(res, 200, { ok: true, status: "aprovado" });
    });
  }
});
var import_cloudflare6;
var import_webhook;
var onRequest6;
var init_webhook = __esm({
  "api/webhook.js"() {
    init_functionsRoutes_0_2508912819379314();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_cloudflare6 = __toESM(require_cloudflare());
    import_webhook = __toESM(require_webhook());
    onRequest6 = import_cloudflare6.default.paraCloudflare(import_webhook.default);
  }
});
var routes;
var init_functionsRoutes_0_2508912819379314 = __esm({
  "../.wrangler/tmp/pages-vb0umd/functionsRoutes-0.2508912819379314.mjs"() {
    init_config();
    init_criar_pagamento();
    init_orcamento();
    init_simulado_pagar();
    init_status_pagamento();
    init_webhook();
    routes = [
      {
        routePath: "/api/config",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest]
      },
      {
        routePath: "/api/criar-pagamento",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest2]
      },
      {
        routePath: "/api/orcamento",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest3]
      },
      {
        routePath: "/api/simulado-pagar",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest4]
      },
      {
        routePath: "/api/status-pagamento",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest5]
      },
      {
        routePath: "/api/webhook",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest6]
      }
    ];
  }
});
init_functionsRoutes_0_2508912819379314();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_functionsRoutes_0_2508912819379314();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_functionsRoutes_0_2508912819379314();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_functionsRoutes_0_2508912819379314();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
init_functionsRoutes_0_2508912819379314();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name2(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
init_functionsRoutes_0_2508912819379314();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    const body = JSON.stringify(error3);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
init_functionsRoutes_0_2508912819379314();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError2(e);
    const body = JSON.stringify(error3);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-ucKVC3/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env2, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-ucKVC3/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.08104599906679244.js.map
