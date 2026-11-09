// ==UserScript==
// @name       				OCS 网课助手
// @version    				4.15.3-ai.16
// @description				OCS(online-course-script) 网课助手，官网 https://docs.ocsjs.com ，专注于帮助大学生从网课中释放出来 让自己的时间把握在自己的手中，拥有人性化的操作页面，流畅的步骤提示，支持  【超星学习通】 【知到智慧树】 【职教云】 【智慧职教】 【中国大学MOOC】 【雨课堂】 等网课的学习，作业。具体的功能请查看脚本悬浮窗中的教程页面。
// @author     				enncy
// @license    				MIT
// @match      				*://*.zhihuishu.com/*
// @match      				*://*.hike-teaching-center.polymas.com/*
// @match      				*://*.chaoxing.com/*
// @match      				*://*.edu.cn/*
// @match      				*://*.org.cn/*
// @match      				*://*.xueyinonline.com/*
// @match      				*://*.hnsyu.net/*
// @match      				*://*.qutjxjy.cn/*
// @match      				*://*.ynny.cn/*
// @match      				*://*.hnvist.cn/*
// @match      				*://*.fjlecb.cn/*
// @match      				*://*.gdhkmooc.com/*
// @match      				*://*.cugbonline.cn/*
// @match      				*://*.zjelib.cn/*
// @match      				*://*.cqrspx.cn/*
// @match      				*://*.neauce.com/*
// @match      				*://*.zhihui-yun.com/*
// @match      				*://*.cqie.cn/*
// @match      				*://*.ccqmxx.com/*
// @match      				*://*.jxgmxy.com/*
// @match      				*://*.jnzyjsxy.cn/*
// @match      				*://*.sslibrary.com/*
// @match      				*://*.xuexi365.com/*
// @match      				*://*.icve.com.cn/*
// @match      				*://*.ai.icve.com.cn/*
// @match      				*://*.course.icve.com.cn/*
// @match      				*://*.courshare.cn/*
// @match      				*://*.webtrn.cn/*
// @match      				*://*.zjy2.icve.com.cn/*
// @match      				*://*.zyk.icve.com.cn/*
// @match      				*://*.icourse163.org/*
// @match      				*://*.yuketang.cn/*
// @grant      				GM_info
// @grant      				GM_getTab
// @grant      				GM_saveTab
// @grant      				GM_setValue
// @grant      				GM_getValue
// @grant      				unsafeWindow
// @grant      				GM_listValues
// @grant      				GM_deleteValue
// @grant      				GM_notification
// @grant      				GM_xmlhttpRequest
// @grant      				GM_getResourceText
// @grant      				GM_addValueChangeListener
// @grant      				GM_removeValueChangeListener
// @grant      				GM_registerMenuCommand
// @run-at     				document-start
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjM2NmYxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYTg1NWY3Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNMTIgMjRjNy0zIDEzLTMgMjAgMXYyNWMtNy00LTEzLTQtMjAtMXoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii45NSIvPjxwYXRoIGQ9Ik01MiAyNGMtNy0zLTEzLTMtMjAgMXYyNWM3LTQgMTMtNCAyMC0xeiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjc1Ii8+PHBhdGggZD0iTTQ0IDdsMi4yIDUuOEw1MiAxNWwtNS44IDIuMkw0NCAyM2wtMi4yLTUuOEwzNiAxNWw1LjgtMi4yeiIgZmlsbD0iI2ZkZTY4YSIvPjwvc3ZnPg==
// @connect    				*
// ==/UserScript==

// ==================== 原生集合保护（ai.13） ====================
// 部分网课页面（如超星旧版页面）会用自定义实现覆盖全局 Map / Set，
// 导致脚本及脚本管理器内部出现 “r.set is not a function”。
// 这里在页面脚本执行前锁定原生构造函数，并为 GM API 调用期间临时恢复原生实现。
var __ocsNative = (function () {
	const ok = (C, m) => typeof C === 'function' && C.prototype && typeof C.prototype[m] === 'function';
	let M = globalThis.Map, S = globalThis.Set, W = globalThis.WeakMap;
	if (!ok(M, 'set') || !ok(S, 'add') || !ok(W, 'set')) {
		try {
			const f = document.createElement('iframe');
			f.style.display = 'none';
			(document.documentElement || document.body).appendChild(f);
			const cw = f.contentWindow;
			if (!ok(M, 'set')) M = cw.Map;
			if (!ok(S, 'add')) S = cw.Set;
			if (!ok(W, 'set')) W = cw.WeakMap;
			f.remove();
		} catch (e) {}
	}
	return { Map: M, Set: S, WeakMap: W };
})();
// eslint-disable-next-line no-shadow-restricted-names, no-redeclare
var Map = __ocsNative.Map, Set = __ocsNative.Set, WeakMap = __ocsNative.WeakMap;
var OCS_BRAND_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjM2NmYxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYTg1NWY3Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNMTIgMjRjNy0zIDEzLTMgMjAgMXYyNWMtNy00LTEzLTQtMjAtMXoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii45NSIvPjxwYXRoIGQ9Ik01MiAyNGMtNy0zLTEzLTMtMjAgMXYyNWM3LTQgMTMtNCAyMC0xeiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjc1Ii8+PHBhdGggZD0iTTQ0IDdsMi4yIDUuOEw1MiAxNWwtNS44IDIuMkw0NCAyM2wtMi4yLTUuOEwzNiAxNWw1LjgtMi4yeiIgZmlsbD0iI2ZkZTY4YSIvPjwvc3ZnPg==';
function __ocsWithNative(fn) {
	if (typeof fn !== 'function' || fn.__ocsWrapped) return fn;
	const wrapped = function () {
		const targets = [];
		try { targets.push(globalThis); } catch (e) {}
		try { if (typeof unsafeWindow !== 'undefined' && targets.indexOf(unsafeWindow) === -1) targets.push(unsafeWindow); } catch (e) {}
		try { if (typeof window !== 'undefined' && targets.indexOf(window) === -1) targets.push(window); } catch (e) {}
		const restore = [];
		for (const t of targets) {
			for (const [k, m] of [['Map', 'set'], ['Set', 'add'], ['WeakMap', 'set']]) {
				try {
					const C = t[k];
					if (!(typeof C === 'function' && C.prototype && typeof C.prototype[m] === 'function')) {
						restore.push([t, k, C]);
						t[k] = __ocsNative[k];
					}
				} catch (e) {}
			}
		}
		try {
			return fn.apply(this, arguments);
		} finally {
			for (const [t, k, C] of restore) try { t[k] = C; } catch (e) {}
		}
	};
	wrapped.__ocsWrapped = true;
	return wrapped;
}

// ==================== 环境兼容层（ai.12） ====================
// 必须位于打包代码之前：打包模块在加载时就会读取 GM 存储与 unsafeWindow。
// 仅在脚本管理器确实缺少某个 API 时补齐；Tampermonkey / ScriptCat / Violentmonkey 下不会生效。
var __OCS_MISSING_GM__ = (function () {
	const missing = [];
	const g = globalThis;
	const has = {
		GM_info: typeof GM_info !== 'undefined',
		GM_getTab: typeof GM_getTab !== 'undefined',
		GM_saveTab: typeof GM_saveTab !== 'undefined',
		GM_setValue: typeof GM_setValue !== 'undefined',
		GM_getValue: typeof GM_getValue !== 'undefined',
		unsafeWindow: typeof unsafeWindow !== 'undefined',
		GM_listValues: typeof GM_listValues !== 'undefined',
		GM_deleteValue: typeof GM_deleteValue !== 'undefined',
		GM_notification: typeof GM_notification !== 'undefined',
		GM_xmlhttpRequest: typeof GM_xmlhttpRequest !== 'undefined',
		GM_getResourceText: typeof GM_getResourceText !== 'undefined',
		GM_addValueChangeListener: typeof GM_addValueChangeListener !== 'undefined',
		GM_removeValueChangeListener: typeof GM_removeValueChangeListener !== 'undefined',
		GM_registerMenuCommand: typeof GM_registerMenuCommand !== 'undefined'
	};
	const PREFIX = 'ocs-gm:';
	let ls = null;
	try {
		ls = g.localStorage;
		ls.setItem(PREFIX + '__probe', '1');
		ls.removeItem(PREFIX + '__probe');
	} catch (e) {
		ls = null;
	}
	const memory = new Map();
	const read = (k) => {
		const raw = ls ? ls.getItem(PREFIX + k) : memory.has(k) ? memory.get(k) : null;
		if (raw == null) return undefined;
		try {
			return JSON.parse(raw);
		} catch (e) {
			return undefined;
		}
	};
	const listeners = new Map();
	let listenerId = 0;
	const emit = (k, oldV, newV, remote) => {
		for (const [, l] of listeners) if (l.key === k) try { l.cb(k, oldV, newV, remote); } catch (e) {}
	};
	if (ls) {
		g.addEventListener('storage', (e) => {
			if (!e.key || e.key.indexOf(PREFIX) !== 0) return;
			const k = e.key.slice(PREFIX.length);
			const parse = (v) => { try { return v == null ? undefined : JSON.parse(v); } catch (x) { return undefined; } };
			emit(k, parse(e.oldValue), parse(e.newValue), true);
		});
	}
	const tabStore = Object.create(null);
	const shims = {
		GM_info: { script: { name: 'OCS 网课助手', version: 'unknown', namespace: '' }, scriptHandler: 'unknown', version: 'unknown' },
		unsafeWindow: g,
		GM_getTab(cb) { setTimeout(() => { try { cb && cb(Object.assign({}, tabStore)); } catch (e) {} }); },
		GM_saveTab(tab, cb) {
			Object.keys(tab || {}).forEach((k) => (tabStore[k] = tab[k]));
			try { cb && cb(); } catch (e) {}
		},
		GM_getValue(k, d) { const v = read(k); return v === undefined ? d : v; },
		GM_setValue(k, v) {
			const old = read(k);
			const raw = JSON.stringify(v);
			if (ls) { try { ls.setItem(PREFIX + k, raw); } catch (e) { memory.set(k, raw); } } else memory.set(k, raw);
			emit(k, old, v, false);
		},
		GM_deleteValue(k) {
			const old = read(k);
			if (ls) ls.removeItem(PREFIX + k);
			memory.delete(k);
			emit(k, old, undefined, false);
		},
		GM_listValues() {
			const keys = new Set(memory.keys());
			if (ls) for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.indexOf(PREFIX) === 0) keys.add(k.slice(PREFIX.length)); }
			return Array.from(keys);
		},
		GM_addValueChangeListener(key, cb) { const id = ++listenerId; listeners.set(id, { key, cb }); return id; },
		GM_removeValueChangeListener(id) { listeners.delete(id); },
		GM_notification(opts) {
			try {
				const o = typeof opts === 'string' ? { text: opts } : opts || {};
				if (g.Notification && g.Notification.permission === 'granted') new g.Notification(o.title || 'OCS', { body: o.text || '' });
			} catch (e) {}
		},
		GM_registerMenuCommand() { return 0; },
		GM_getResourceText() { return ''; },
		// 降级为 fetch：受 CORS 限制，但比直接报错可用（例如本地 llama.cpp 开启 --cors 时）
		GM_xmlhttpRequest(o) {
			o = o || {};
			const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
			let done = false;
			const timer = o.timeout ? setTimeout(() => { if (!done) { done = true; ctrl && ctrl.abort(); o.ontimeout && o.ontimeout({}); } }, o.timeout) : 0;
			fetch(o.url, { method: o.method || 'GET', headers: o.headers || {}, body: o.data, signal: ctrl ? ctrl.signal : undefined })
				.then(async (res) => {
					const text = await res.text();
					if (done) return;
					done = true;
					clearTimeout(timer);
					let response = text;
					if (o.responseType === 'json') { try { response = JSON.parse(text); } catch (e) { response = null; } }
					const headers = [];
					res.headers.forEach((v, k) => headers.push(k + ': ' + v));
					o.onload && o.onload({ status: res.status, statusText: res.statusText, responseText: text, response, responseHeaders: headers.join('\r\n'), finalUrl: res.url });
				})
				.catch((err) => {
					if (done) return;
					done = true;
					clearTimeout(timer);
					o.onerror && o.onerror({ status: 0, responseText: '', error: String((err && err.message) || err) });
				});
			return { abort() { if (!done) { done = true; clearTimeout(timer); ctrl && ctrl.abort(); o.onabort && o.onabort({}); } } };
		}
	};
	for (const name in has) {
		if (has[name]) continue;
		missing.push(name);
		try { g[name] = shims[name]; } catch (e) {}
	}
	return missing;
})();
// 为 GM API 包上原生集合保护（参数/上下文绑定可写时生效）
try { if (typeof GM_setValue === 'function') GM_setValue = __ocsWithNative(GM_setValue); } catch (e) {}
try { if (typeof GM_getValue === 'function') GM_getValue = __ocsWithNative(GM_getValue); } catch (e) {}
try { if (typeof GM_deleteValue === 'function') GM_deleteValue = __ocsWithNative(GM_deleteValue); } catch (e) {}
try { if (typeof GM_listValues === 'function') GM_listValues = __ocsWithNative(GM_listValues); } catch (e) {}
try { if (typeof GM_getTab === 'function') GM_getTab = __ocsWithNative(GM_getTab); } catch (e) {}
try { if (typeof GM_saveTab === 'function') GM_saveTab = __ocsWithNative(GM_saveTab); } catch (e) {}
try { if (typeof GM_addValueChangeListener === 'function') GM_addValueChangeListener = __ocsWithNative(GM_addValueChangeListener); } catch (e) {}
try { if (typeof GM_removeValueChangeListener === 'function') GM_removeValueChangeListener = __ocsWithNative(GM_removeValueChangeListener); } catch (e) {}
try { if (typeof GM_xmlhttpRequest === 'function') GM_xmlhttpRequest = __ocsWithNative(GM_xmlhttpRequest); } catch (e) {}
try { if (typeof GM_notification === 'function') GM_notification = __ocsWithNative(GM_notification); } catch (e) {}


(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.OCS = {}));
})(this, function(exports2) {
  "use strict";
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function isObject$2(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$2;
  var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$1;
  var freeGlobal = _freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root$2 = freeGlobal || freeSelf || Function("return this")();
  var _root = root$2;
  var root$1 = _root;
  var now$1 = function() {
    return root$1.Date.now();
  };
  var now_1 = now$1;
  var reWhitespace = /\s/;
  function trimmedEndIndex$1(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var _trimmedEndIndex = trimmedEndIndex$1;
  var trimmedEndIndex = _trimmedEndIndex;
  var reTrimStart = /^\s+/;
  function baseTrim$1(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  var _baseTrim = baseTrim$1;
  var root = _root;
  var Symbol$3 = root.Symbol;
  var _Symbol = Symbol$3;
  var Symbol$2 = _Symbol;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var _getRawTag = getRawTag$1;
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }
  var _objectToString = objectToString$1;
  var Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag$1(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  var _baseGetTag = baseGetTag$1;
  function isObjectLike$1(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$1;
  var baseGetTag = _baseGetTag, isObjectLike = isObjectLike_1;
  var symbolTag = "[object Symbol]";
  function isSymbol$1(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  var isSymbol_1 = isSymbol$1;
  var baseTrim = _baseTrim, isObject$1 = isObject_1, isSymbol = isSymbol_1;
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber$1(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject$1(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$1(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_1 = toNumber$1;
  var isObject = isObject_1, now = now_1, toNumber = toNumber_1;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var debounce_1$1 = debounce;
  const $ = {
    uuid() {
      return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    },
    random(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    },
    async sleep(period) {
      return new Promise((resolve) => {
        setTimeout(resolve, period);
      });
    },
    isInBrowser() {
      return typeof window !== "undefined" && typeof window.document !== "undefined";
    },
    elementToRawObject(el) {
      return {
        innerText: el == null ? void 0 : el.innerText,
        innerHTML: el == null ? void 0 : el.innerHTML,
        textContent: el == null ? void 0 : el.textContent
      };
    },
    onresize(el, handler) {
      const resize = debounce_1$1(() => {
        if (el.parentNode === null) {
          window.removeEventListener("resize", resize);
        } else {
          handler(el);
        }
      }, 200);
      resize();
      window.addEventListener("resize", resize);
    },
    isInTopWindow() {
      return self === top;
    },
    createCenteredPopupWindow(url, winName, opts) {
      const { width, height, scrollbars, resizable } = opts;
      const LeftPosition = screen.width ? (screen.width - width) / 2 : 0;
      const TopPosition = screen.height ? (screen.height - height) / 2 : 0;
      const settings = "height=" + height + ",width=" + width + ",top=" + TopPosition + ",left=" + LeftPosition + ",scrollbars=" + (scrollbars ? "yes" : "no") + ",resizable=" + (resizable ? "yes" : "no");
      return window.open(url, winName, settings);
    },
    transition: async (el, properties, duration_ms, val, options) => {
      return new Promise((resolve) => {
        const original_val = Reflect.get(el.style, properties) || "";
        el.style.transition = `${String(properties)} ${duration_ms}s ${(options == null ? void 0 : options.timing_function) || "ease-in-out"}`;
        Reflect.set(el.style, properties, val);
        el.addEventListener("transitionend", function handler() {
          el.removeEventListener("transitionend", handler);
          setTimeout(() => {
            Reflect.set(el.style, properties, original_val);
            setTimeout(() => {
              el.style.transition = "";
            }, duration_ms * 1e3);
          }, ((options == null ? void 0 : options.reset_ms) || 0) * 1e3);
          resolve();
        });
      });
    }
  };
  const $string = {
    humpToTarget(value, target) {
      return value.replace(/([A-Z])/g, target + "$1").toLowerCase().split(target).slice(1).join(target);
    }
  };
  class StringUtils {
    constructor(_text) {
      this._text = _text;
    }
    static nowrap(str, replace_str) {
      return (str == null ? void 0 : str.replace(/\n/g, replace_str)) || "";
    }
    nowrap(replace_str) {
      this._text = StringUtils.nowrap(this._text, replace_str);
      return this;
    }
    static nospace(str) {
      return (str == null ? void 0 : str.replace(/ +/g, " ")) || "";
    }
    nospace() {
      this._text = StringUtils.nospace(this._text);
      return this;
    }
    static noSpecialChar(str) {
      return (str == null ? void 0 : str.replace(/[^\w\s]/gi, "")) || "";
    }
    noSpecialChar() {
      this._text = StringUtils.noSpecialChar(this._text);
      return this;
    }
    static max(str, len) {
      return str.length > len ? str.substring(0, len) + "..." : str;
    }
    max(len) {
      this._text = StringUtils.max(this._text, len);
      return this;
    }
    static hide(str, start2, end, replacer = "*") {
      return str.substring(0, start2) + str.substring(start2, end).replace(/./g, replacer) + str.substring(end);
    }
    hide(start2, end, replacer = "*") {
      this._text = StringUtils.hide(this._text, start2, end, replacer);
      return this;
    }
    static of(text) {
      return new StringUtils(text);
    }
    toString() {
      return this._text;
    }
  }
  const $const = {
    TAB_UID: "_uid_",
    TAB_URLS: "_urls_",
    TAB_CURRENT_PANEL_NAME: "_current_panel_name_"
  };
  function domSearch(wrapper, root2 = window.document) {
    const obj = /* @__PURE__ */ Object.create({});
    Reflect.ownKeys(wrapper).forEach((key) => {
      const item = wrapper[key.toString()];
      Reflect.set(
        obj,
        key,
        typeof item === "string" ? root2.querySelector(item) : typeof item === "function" ? item(root2) : item.map((fun) => fun(root2))
      );
    });
    return obj;
  }
  function domSearchAll(wrapper, root2 = window.document) {
    const obj = /* @__PURE__ */ Object.create({});
    Reflect.ownKeys(wrapper).forEach((key) => {
      const item = wrapper[key.toString()];
      Reflect.set(
        obj,
        key,
        typeof item === "string" ? Array.from(root2.querySelectorAll(item)) : typeof item === "function" ? item(root2).filter(Boolean) : item.map((fun) => fun(root2))
      );
    });
    return obj;
  }
  var src = {
    compareTwoStrings,
    findBestMatch
  };
  function compareTwoStrings(first, second) {
    first = first.replace(/\s+/g, "");
    second = second.replace(/\s+/g, "");
    if (first === second)
      return 1;
    if (first.length < 2 || second.length < 2)
      return 0;
    let firstBigrams = /* @__PURE__ */ new Map();
    for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
      firstBigrams.set(bigram, count);
    }
    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
      if (count > 0) {
        firstBigrams.set(bigram, count - 1);
        intersectionSize++;
      }
    }
    return 2 * intersectionSize / (first.length + second.length - 2);
  }
  function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings))
      throw new Error("Bad arguments: First argument should be a string, second should be an array of strings");
    const ratings = [];
    let bestMatchIndex = 0;
    for (let i = 0; i < targetStrings.length; i++) {
      const currentTargetString = targetStrings[i];
      const currentRating = compareTwoStrings(mainString, currentTargetString);
      ratings.push({ target: currentTargetString, rating: currentRating });
      if (currentRating > ratings[bestMatchIndex].rating) {
        bestMatchIndex = i;
      }
    }
    const bestMatch = ratings[bestMatchIndex];
    return { ratings, bestMatch, bestMatchIndex };
  }
  function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== "string")
      return false;
    if (!Array.isArray(targetStrings))
      return false;
    if (!targetStrings.length)
      return false;
    if (targetStrings.find(function(s) {
      return typeof s !== "string";
    }))
      return false;
    return true;
  }
  function clearString(str, ...exclude) {
    exclude.push(...["①②③④⑤⑥⑦⑧⑨"]);
    return str.trim().toLocaleLowerCase().replace(RegExp(`[^\\u2E80-\\u9FFFA-Za-z0-9${exclude.join("")}]*`, "g"), "");
  }
  function normalizeString(str) {
    return clearString(
      str.replace(/[，。！？；：""''、（）【】《》\s]/g, "").replace(/[,.\-!?;:'"()[\]<>]/g, "").replace(/[ａ-ｚＡ-Ｚ０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 65248)).replace(/％/g, "%")
    );
  }
  function answerNormalizedMatch(answers, options) {
    const _answers = answers.map(removeRedundant).map(normalizeString);
    const _options = options.map(removeRedundant).map(normalizeString);
    return _answers.length !== 0 ? _options.map((opt, i) => {
      let level = 0;
      if (opt) {
        for (const ans of _answers) {
          if (ans === opt) {
            level = 2;
            break;
          } else if (ans.includes(opt)) {
            level = 1;
          }
        }
      }
      return { opt, original: options[i], level };
    }).filter(({ level }) => level > 0).sort((a, b) => b.level - a.level).map(({ original }) => original) : [];
  }
  function answerSimilar(answers, options) {
    const _answers = answers.map(removeRedundant).map((a) => clearString(a));
    const _options = options.map(removeRedundant).map((o) => clearString(o));
    const similar = _answers.length !== 0 ? _options.map((option) => {
      if (option.trim() === "") {
        return { rating: 0, target: "" };
      }
      return src.findBestMatch(option, _answers).bestMatch;
    }) : _options.map(() => ({ rating: 0, target: "" }));
    return similar;
  }
  function answerSimilarWithGap(answers, options) {
    var _a, _b;
    const _answers = answers.map(removeRedundant).map((a) => clearString(a));
    const _options = options.map(removeRedundant).map((o) => clearString(o));
    if (_answers.length === 0) {
      return _options.map(() => ({ rating: 0, target: "", gap: 0 }));
    }
    const ratings = _options.map((option) => {
      if (option.trim() === "") {
        return { rating: 0, target: "" };
      }
      return src.findBestMatch(option, _answers).bestMatch;
    });
    const sortedRatings = [...ratings].sort((a, b) => b.rating - a.rating);
    const maxRating = (_b = (_a = sortedRatings[0]) == null ? void 0 : _a.rating) != null ? _b : 0;
    let secondRating = 0;
    for (let i = 1; i < sortedRatings.length; i++) {
      if (sortedRatings[i].rating < maxRating) {
        secondRating = sortedRatings[i].rating;
        break;
      }
    }
    return ratings.map((r) => ({
      ...r,
      gap: r.rating === maxRating ? maxRating - secondRating : 0
    }));
  }
  function answerExactMatch(answers, options) {
    const _answers = answers.map(removeRedundant);
    const _options = options.map(removeRedundant);
    const result = _answers.length !== 0 ? _options.filter((option) => {
      return _answers.find((answer) => answer.trim() === option.trim());
    }) : [];
    return result;
  }
  function removeRedundant(str) {
    return (str == null ? void 0 : str.trim().replace(/^[A-Z]{1}[^A-Za-z0-9⺀-鿿]+([A-Za-z0-9⺀-鿿]+)/, "$1").replace(/^[A-Z]{1}([⺀-鿿][A-Za-z0-9⺀-鿿]*)/, "$1")) || "";
  }
  function request(url, opts) {
    return new Promise((resolve, reject) => {
      try {
        const { responseType = "json", method = "get", type = "fetch", data = {}, headers = {} } = opts || {};
        const env = $.isInBrowser() ? "browser" : "node";
        if (type === "GM_xmlhttpRequest" && env === "browser") {
          if (typeof GM_xmlhttpRequest !== "undefined") {
            const contentType = headers["Content-Type"] || headers["content-type"];
            const requestData = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(data).toString() : Object.keys(data).length ? JSON.stringify(data) : void 0;
            GM_xmlhttpRequest({
              url,
              method: method.toUpperCase(),
              data: requestData,
              headers: Object.keys(headers).length ? headers : void 0,
              responseType: responseType === "json" ? "json" : void 0,
              onload: (response) => {
                if (response.status === 200) {
                  if (responseType === "json") {
                    try {
                      resolve(JSON.parse(response.responseText));
                    } catch (error) {
                      reject(error);
                    }
                  } else {
                    resolve(response.responseText || "");
                  }
                } else {
                  reject(response.responseText);
                }
              },
              onerror: (err) => {
                console.error("GM_xmlhttpRequest error", err);
                reject(err);
              }
            });
          } else {
            reject(new Error("GM_xmlhttpRequest is not defined"));
          }
        } else {
          const fet = env === "node" ? require("node-fetch").default : fetch;
          fet(url, { body: method === "post" ? JSON.stringify(data) : void 0, method, headers }).then((response) => {
            if (responseType === "json") {
              response.json().then(resolve).catch(reject);
            } else {
              response.text().then(resolve).catch(reject);
            }
          }).catch((error) => {
            reject(new Error(error));
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  var lib = {};
  var start$1 = {};
  var customWindow = {};
  var interfaces = {};
  var common$1 = {};
  var events = { exports: {} };
  var R = typeof Reflect === "object" ? Reflect : null;
  var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };
  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target);
    };
  }
  function ProcessEmitWarning(warning) {
    if (console && console.warn)
      console.warn(warning);
  }
  var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
    return value !== value;
  };
  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  events.exports = EventEmitter;
  events.exports.once = once;
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.prototype._events = void 0;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = void 0;
  var defaultMaxListeners = 10;
  function checkListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
  }
  Object.defineProperty(EventEmitter, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
      }
      defaultMaxListeners = arg;
    }
  });
  EventEmitter.init = function() {
    if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || void 0;
  };
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
    }
    this._maxListeners = n;
    return this;
  };
  function _getMaxListeners(that) {
    if (that._maxListeners === void 0)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }
  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
  };
  EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++)
      args.push(arguments[i]);
    var doError = type === "error";
    var events2 = this._events;
    if (events2 !== void 0)
      doError = doError && events2.error === void 0;
    else if (!doError)
      return false;
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        throw er;
      }
      var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
      err.context = er;
      throw err;
    }
    var handler = events2[type];
    if (handler === void 0)
      return false;
    if (typeof handler === "function") {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }
    return true;
  };
  function _addListener(target, type, listener, prepend) {
    var m;
    var events2;
    var existing;
    checkListener(listener);
    events2 = target._events;
    if (events2 === void 0) {
      events2 = target._events = /* @__PURE__ */ Object.create(null);
      target._eventsCount = 0;
    } else {
      if (events2.newListener !== void 0) {
        target.emit(
          "newListener",
          type,
          listener.listener ? listener.listener : listener
        );
        events2 = target._events;
      }
      existing = events2[type];
    }
    if (existing === void 0) {
      existing = events2[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === "function") {
        existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }
    return target;
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };
  function onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0)
        return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
  function _onceWrap(target, type, listener) {
    var state2 = { fired: false, wrapFn: void 0, target, type, listener };
    var wrapped = onceWrapper.bind(state2);
    wrapped.listener = listener;
    state2.wrapFn = wrapped;
    return wrapped;
  }
  EventEmitter.prototype.once = function once2(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    checkListener(listener);
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events2, position, i, originalListener;
    checkListener(listener);
    events2 = this._events;
    if (events2 === void 0)
      return this;
    list = events2[type];
    if (list === void 0)
      return this;
    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else {
        delete events2[type];
        if (events2.removeListener)
          this.emit("removeListener", type, list.listener || listener);
      }
    } else if (typeof list !== "function") {
      position = -1;
      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }
      if (position < 0)
        return this;
      if (position === 0)
        list.shift();
      else {
        spliceOne(list, position);
      }
      if (list.length === 1)
        events2[type] = list[0];
      if (events2.removeListener !== void 0)
        this.emit("removeListener", type, originalListener || listener);
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events2, i;
    events2 = this._events;
    if (events2 === void 0)
      return this;
    if (events2.removeListener === void 0) {
      if (arguments.length === 0) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      } else if (events2[type] !== void 0) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else
          delete events2[type];
      }
      return this;
    }
    if (arguments.length === 0) {
      var keys = Object.keys(events2);
      var key;
      for (i = 0; i < keys.length; ++i) {
        key = keys[i];
        if (key === "removeListener")
          continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners("removeListener");
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
      return this;
    }
    listeners = events2[type];
    if (typeof listeners === "function") {
      this.removeListener(type, listeners);
    } else if (listeners !== void 0) {
      for (i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(type, listeners[i]);
      }
    }
    return this;
  };
  function _listeners(target, type, unwrap) {
    var events2 = target._events;
    if (events2 === void 0)
      return [];
    var evlistener = events2[type];
    if (evlistener === void 0)
      return [];
    if (typeof evlistener === "function")
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }
  EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };
  EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };
  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };
  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events2 = this._events;
    if (events2 !== void 0) {
      var evlistener = events2[type];
      if (typeof evlistener === "function") {
        return 1;
      } else if (evlistener !== void 0) {
        return evlistener.length;
      }
    }
    return 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };
  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }
  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
      list[index] = list[index + 1];
    list.pop();
  }
  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }
  function once(emitter, name) {
    return new Promise(function(resolve, reject) {
      function errorListener(err) {
        emitter.removeListener(name, resolver);
        reject(err);
      }
      function resolver() {
        if (typeof emitter.removeListener === "function") {
          emitter.removeListener("error", errorListener);
        }
        resolve([].slice.call(arguments));
      }
      eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
      if (name !== "error") {
        addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
      }
    });
  }
  function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === "function") {
      eventTargetAgnosticAddListener(emitter, "error", handler, flags);
    }
  }
  function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
      if (flags.once) {
        emitter.once(name, listener);
      } else {
        emitter.on(name, listener);
      }
    } else if (typeof emitter.addEventListener === "function") {
      emitter.addEventListener(name, function wrapListener(arg) {
        if (flags.once) {
          emitter.removeEventListener(name, wrapListener);
        }
        listener(arg);
      });
    } else {
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    }
  }
  var __importDefault$2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(common$1, "__esModule", { value: true });
  common$1.CommonEventEmitter = void 0;
  const events_1$1 = __importDefault$2(events.exports);
  class CommonEventEmitter extends events_1$1.default {
    on(eventName, listener) {
      return super.on(eventName.toString(), listener);
    }
    once(eventName, listener) {
      return super.once(eventName.toString(), listener);
    }
    emit(eventName, ...args) {
      return super.emit(eventName.toString(), ...args);
    }
    off(eventName, listener) {
      return super.off(eventName.toString(), listener);
    }
  }
  common$1.CommonEventEmitter = CommonEventEmitter;
  var config$1 = {};
  Object.defineProperty(config$1, "__esModule", { value: true });
  var cors = {};
  var utils = {};
  var common = {};
  var store = {};
  var store_provider = {};
  var _const = {};
  Object.defineProperty(_const, "__esModule", { value: true });
  _const.$const = void 0;
  _const.$const = {
    TAB_UID: "_uid_",
    TAB_URLS: "_urls_",
    TAB_CURRENT_PANEL_NAME: "_current_panel_name_"
  };
  var __awaiter$3 = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(store_provider, "__esModule", { value: true });
  store_provider.GMStoreProvider = store_provider.MemoryStoreProvider = store_provider.LocalStoreChangeEvent = void 0;
  const const_1$1 = _const;
  class LocalStoreChangeEvent extends Event {
    constructor() {
      super(...arguments);
      this.key = "";
    }
  }
  store_provider.LocalStoreChangeEvent = LocalStoreChangeEvent;
  class MemoryStoreProvider {
    get(key, defaultValue) {
      var _a;
      return (_a = Reflect.get(MemoryStoreProvider._source.store, key)) !== null && _a !== void 0 ? _a : defaultValue;
    }
    set(key, value) {
      var _a;
      const pre = Reflect.get(MemoryStoreProvider._source.store, key);
      Reflect.set(MemoryStoreProvider._source.store, key, value);
      (_a = MemoryStoreProvider.storeListeners.get(key)) === null || _a === void 0 ? void 0 : _a.forEach((lis) => lis(value, pre));
    }
    delete(key) {
      Reflect.deleteProperty(MemoryStoreProvider._source.store, key);
    }
    list() {
      return Object.keys(MemoryStoreProvider._source.store);
    }
    getTab(key) {
      return __awaiter$3(this, void 0, void 0, function* () {
        return Reflect.get(MemoryStoreProvider._source.tab, key);
      });
    }
    setTab(key, value) {
      var _a;
      return __awaiter$3(this, void 0, void 0, function* () {
        Reflect.set(MemoryStoreProvider._source.tab, key, value);
        (_a = MemoryStoreProvider.tabListeners.get(key)) === null || _a === void 0 ? void 0 : _a.forEach((lis) => lis(value, this.getTab(key)));
      });
    }
    addChangeListener(key, listener) {
      const listeners = MemoryStoreProvider.storeListeners.get(key) || [];
      listeners.push(listener);
      MemoryStoreProvider.storeListeners.set(key, listeners);
    }
    removeChangeListener(listener) {
      MemoryStoreProvider.tabListeners.forEach((lis, key) => {
        const index = lis.findIndex((l) => l === listener);
        if (index !== -1) {
          lis.splice(index, 1);
          MemoryStoreProvider.tabListeners.set(key, lis);
        }
      });
    }
    addTabChangeListener(key, listener) {
      const listeners = MemoryStoreProvider.tabListeners.get(key) || [];
      listeners.push(listener);
      MemoryStoreProvider.tabListeners.set(key, listeners);
    }
    removeTabChangeListener(key, listener) {
      const listeners = MemoryStoreProvider.tabListeners.get(key) || [];
      const index = listeners.findIndex((l) => l === listener);
      if (index !== -1) {
        listeners.splice(index, 1);
        MemoryStoreProvider.tabListeners.set(key, listeners);
      }
    }
  }
  MemoryStoreProvider._source = { store: {}, tab: {} };
  MemoryStoreProvider.storeListeners = /* @__PURE__ */ new Map();
  MemoryStoreProvider.tabListeners = /* @__PURE__ */ new Map();
  store_provider.MemoryStoreProvider = MemoryStoreProvider;
  class GMStoreProvider {
    constructor() {
      if (self === top && typeof globalThis.GM_listValues !== "undefined") {
        for (const val of GM_listValues()) {
          if (val.startsWith("_tab_change_")) {
            GM_deleteValue(val);
          }
        }
      }
    }
    getTabChangeHandleKey(tabUid, key) {
      return `_tab_change_${tabUid}_${key}`;
    }
    get(key, defaultValue) {
      return GM_getValue(key, defaultValue);
    }
    set(key, value) {
      let pre;
      if (GMStoreProvider.localListeners.size) {
        try { pre = GM_getValue(key); } catch {}
      }
      GM_setValue(key, value);
      const listeners = GMStoreProvider.localListeners;
      if (listeners.size) {
        for (const [, item] of listeners) {
          if (item.key === key) {
            try { item.listener(value, pre, false); } catch (e) { console.error(e); }
          }
        }
      }
    }
    delete(key) {
      GM_deleteValue(key);
    }
    list() {
      return GM_listValues();
    }
    getTab(key) {
      return new Promise((resolve, reject) => {
        GM_getTab((tab = {}) => resolve(Reflect.get(tab, key)));
      });
    }
    setTab(key, value) {
      return new Promise((resolve, reject) => {
        GM_getTab((tab = {}) => {
          Reflect.set(tab, key, value);
          GM_saveTab(tab);
          this.set(this.getTabChangeHandleKey(Reflect.get(tab, const_1$1.$const.TAB_UID), key), value);
          resolve();
        });
      });
    }
    addChangeListener(key, listener) {
      try {
        return GM_addValueChangeListener(key, (_, pre, curr, remote) => {
          listener(curr, pre, remote);
        });
      } catch (e) {
        // 脚本管理器的监听实现不可用时，降级为本页内监听（跨标签页同步失效，但不影响使用）
        console.warn("[OCS] GM_addValueChangeListener 不可用，已降级为本页监听：", e);
        const id = "ocs-local-" + ++GMStoreProvider.localListenerId;
        GMStoreProvider.localListeners.set(id, { key, listener });
        return id;
      }
    }
    removeChangeListener(listenerId) {
      if (typeof listenerId === "string" && GMStoreProvider.localListeners.has(listenerId)) {
        GMStoreProvider.localListeners.delete(listenerId);
        return;
      }
      if (typeof listenerId === "number") {
        try { GM_removeValueChangeListener(listenerId); } catch {}
      }
    }
    addTabChangeListener(key, listener) {
      return __awaiter$3(this, void 0, void 0, function* () {
        const uid = yield this.getTab(const_1$1.$const.TAB_UID);
        return this.addChangeListener(this.getTabChangeHandleKey(uid, key), (curr, pre) => {
          listener(curr, pre);
        });
      });
    }
    removeTabChangeListener(key, listener) {
      return this.removeChangeListener(listener);
    }
  }
  GMStoreProvider.localListeners = /* @__PURE__ */ new Map();
  GMStoreProvider.localListenerId = 0;
  store_provider.GMStoreProvider = GMStoreProvider;
  (function(exports3) {
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.$store = exports3.MemoryStoreProvider = exports3.GMStoreProvider = void 0;
    const store_provider_1 = store_provider;
    var store_provider_2 = store_provider;
    Object.defineProperty(exports3, "GMStoreProvider", { enumerable: true, get: function() {
      return store_provider_2.GMStoreProvider;
    } });
    Object.defineProperty(exports3, "MemoryStoreProvider", { enumerable: true, get: function() {
      return store_provider_2.MemoryStoreProvider;
    } });
    exports3.$store = typeof globalThis.unsafeWindow === "undefined" ? new store_provider_1.MemoryStoreProvider() : new store_provider_1.GMStoreProvider();
  })(store);
  (function(exports3) {
    var __awaiter2 = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __rest2 = commonjsGlobal && commonjsGlobal.__rest || function(s, e) {
      var t2 = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t2[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t2[p[i]] = s[p[i]];
        }
      return t2;
    };
    var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.resolveCustomElementName = exports3.$ = void 0;
    const debounce_12 = __importDefault2(debounce_1$1);
    const store_12 = store;
    exports3.$ = {
      createConfigProxy(script2) {
        var _a, _b;
        const proxy = new Proxy(script2.cfg, {
          set(target, propertyKey, value) {
            const key = exports3.$.namespaceKey(script2.namespace, propertyKey);
            store_12.$store.set(key, value);
            return Reflect.set(target, propertyKey, value);
          },
          get(target, propertyKey) {
            const value = store_12.$store.get(exports3.$.namespaceKey(script2.namespace, propertyKey));
            Reflect.set(target, propertyKey, value);
            return value;
          }
        });
        for (const key in script2.configs) {
          if (Object.prototype.hasOwnProperty.call(script2.configs, key)) {
            const element = Reflect.get(script2.configs, key);
            Reflect.set(proxy, key, store_12.$store.get(exports3.$.namespaceKey(script2.namespace, key), element.defaultValue));
          }
        }
        if (script2.namespace) {
          proxy.notes = (_b = (_a = script2.configs) === null || _a === void 0 ? void 0 : _a.notes) === null || _b === void 0 ? void 0 : _b.defaultValue;
        }
        return proxy;
      },
      getAllRawConfigs(scripts) {
        const object = {};
        for (const script2 of scripts) {
          for (const key in script2.configs) {
            if (Object.prototype.hasOwnProperty.call(script2.configs, key)) {
              const _a = script2.configs[key], element = __rest2(_a, ["label"]);
              Reflect.set(object, exports3.$.namespaceKey(script2.namespace, key), Object.assign({ label: exports3.$.namespaceKey(script2.namespace, key) }, element));
            }
          }
        }
        return object;
      },
      getMatchedScripts(projects, urls) {
        const scripts = [];
        for (const project2 of projects) {
          for (const key in project2.scripts) {
            if (Object.prototype.hasOwnProperty.call(project2.scripts, key)) {
              const script2 = project2.scripts[key];
              const script_matches_urls = script2.matches.map((u) => Array.isArray(u) ? u[1] : u);
              const script_excludes_urls = (script2.excludes || []).map((u) => Array.isArray(u) ? u[1] : u);
              if (project2.domains === void 0 || project2.domains.length === 0 || project2.domains.some((d) => urls.some((url) => new URL(url).origin.includes(d)))) {
                if (script_excludes_urls.some((u) => urls.some((url) => RegExp(u).test(url)))) {
                  continue;
                }
                if (script_matches_urls.some((u) => urls.some((url) => RegExp(u).test(url)))) {
                  scripts.push(script2);
                }
              }
            }
          }
        }
        return scripts;
      },
      namespaceKey(namespace, key) {
        return namespace ? namespace + "." + key.toString() : key.toString();
      },
      uuid() {
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
      },
      random(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
      },
      sleep(period) {
        return __awaiter2(this, void 0, void 0, function* () {
          return new Promise((resolve) => {
            setTimeout(resolve, period);
          });
        });
      },
      isInBrowser() {
        return typeof window !== "undefined" && typeof window.document !== "undefined";
      },
      onresize(el, handler) {
        const resize = (0, debounce_12.default)(() => {
          if (el.parentNode === null) {
            window.removeEventListener("resize", resize);
          } else {
            handler(el);
          }
        }, 200);
        resize();
        window.addEventListener("resize", resize);
      },
      loadCustomElements(elements2) {
        for (const element of elements2) {
          const name = resolveCustomElementName(element, "-");
          if (customElements.get(name) === void 0) {
            customElements.define(name, element);
          }
        }
      },
      isInTopWindow() {
        return self === top;
      },
      createCenteredPopupWindow(url, winName, opts) {
        const { width, height, scrollbars, resizable } = opts;
        const LeftPosition = screen.width ? (screen.width - width) / 2 : 0;
        const TopPosition = screen.height ? (screen.height - height) / 2 : 0;
        const settings = "height=" + height + ",width=" + width + ",top=" + TopPosition + ",left=" + LeftPosition + ",scrollbars=" + (scrollbars ? "yes" : "no") + ",resizable=" + (resizable ? "yes" : "no");
        return window.open(url, winName, settings);
      },
      waitForElement(selector, opts) {
        return this.waitFor(() => {
          return typeof selector === "function" ? selector() : document.querySelector(selector);
        }, opts);
      },
      waitFor(predicate, opts) {
        return new Promise((resolve, reject) => {
          let timeout;
          const interval = setInterval(() => {
            const result = predicate();
            if (result) {
              clearInterval(interval);
              timeout && clearTimeout(timeout);
              resolve(result);
            }
          }, (opts === null || opts === void 0 ? void 0 : opts.check_period_ms) || 1e3);
          if (opts === null || opts === void 0 ? void 0 : opts.timeout_seconds) {
            timeout = setTimeout(() => {
              clearInterval(interval);
              resolve(void 0);
            }, ((opts === null || opts === void 0 ? void 0 : opts.timeout_seconds) || 10) * 1e3);
          }
        });
      }
    };
    function resolveCustomElementName(el, target) {
      return el.name.replace(/([A-Z])/g, target + "$1").toLowerCase().split(target).slice(1).join(target);
    }
    exports3.resolveCustomElementName = resolveCustomElementName;
  })(common);
  var ui = {};
  var dom = {};
  Object.defineProperty(dom, "__esModule", { value: true });
  dom.enableElementTouchDraggable = dom.enableElementDraggable = dom.$$el = dom.$el = dom.h = void 0;
  const common_1$5 = common;
  function h(element, attrsOrChildren, childrenOrHandler) {
    let name = "";
    if (typeof element === "function") {
      name = (0, common_1$5.resolveCustomElementName)(element, "-");
    } else {
      name = element;
    }
    const el = document.createElement(name);
    if (attrsOrChildren) {
      if (Array.isArray(attrsOrChildren)) {
        for (const child of attrsOrChildren) {
          if (typeof child === "function") {
            el.append(document.createElement(child.name));
          } else {
            el.append(child);
          }
        }
      } else if (typeof attrsOrChildren === "string") {
        el.append(attrsOrChildren);
      } else {
        const attrs = attrsOrChildren;
        for (const key in attrs) {
          if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            if (key === "style") {
              Object.assign(el.style, attrs[key]);
            } else {
              const value = attrs[key];
              Reflect.set(el, key, value);
            }
          }
        }
      }
    }
    if (childrenOrHandler) {
      if (typeof childrenOrHandler === "function") {
        childrenOrHandler.call(el, el);
      } else if (Array.isArray(childrenOrHandler)) {
        for (const child of childrenOrHandler) {
          if (typeof child === "function") {
            el.append(document.createElement(child.name));
          } else {
            el.append(child);
          }
        }
      } else if (typeof childrenOrHandler === "string") {
        el.append(childrenOrHandler);
      }
    }
    return el;
  }
  dom.h = h;
  function $el(selector, root2 = window.document) {
    const el = root2.querySelector(selector);
    return el === null ? void 0 : el;
  }
  dom.$el = $el;
  function $$el(selector, root2 = window.document) {
    return Array.from(root2.querySelectorAll(selector));
  }
  dom.$$el = $$el;
  function enableElementDraggable(header2, target, ondrag) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    header2.addEventListener("mousedown", dragMouseDown);
    function dragMouseDown(e) {
      e = e || window.event;
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }
    function elementDrag(e) {
      e.stopPropagation();
      e = e || window.event;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      target.style.top = Math.max(target.offsetTop - pos2, 10) + "px";
      target.style.left = target.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
      ondrag === null || ondrag === void 0 ? void 0 : ondrag();
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }
  }
  dom.enableElementDraggable = enableElementDraggable;
  function enableElementTouchDraggable(header2, target, ondrag) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    header2.addEventListener("touchstart", dragTouchStart);
    function dragTouchStart(e) {
      e = e || window.event;
      const touch = e.touches[0];
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      document.addEventListener("touchend", closeDragElement);
      document.addEventListener("touchmove", elementDrag);
    }
    function elementDrag(e) {
      e.stopPropagation();
      e = e || window.event;
      const touch = e.touches[0];
      pos1 = pos3 - touch.clientX;
      pos2 = pos4 - touch.clientY;
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      target.style.top = Math.max(target.offsetTop - pos2, 10) + "px";
      target.style.left = target.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
      ondrag === null || ondrag === void 0 ? void 0 : ondrag();
      document.removeEventListener("touchend", closeDragElement);
      document.removeEventListener("touchmove", elementDrag);
    }
  }
  dom.enableElementTouchDraggable = enableElementTouchDraggable;
  var elements$1 = {};
  Object.defineProperty(elements$1, "__esModule", { value: true });
  elements$1.$elements = void 0;
  elements$1.$elements = {
    tooltipContainer: void 0,
    root: void 0,
    currentScriptPanel: void 0,
    wrapper: void 0
  };
  var tampermonkey = {};
  (function(exports3) {
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.$gm = void 0;
    exports3.$gm = {
      unsafeWindow: typeof globalThis.unsafeWindow === "undefined" ? globalThis.window : globalThis.unsafeWindow,
      isInGMContext() {
        return typeof GM_info !== "undefined";
      },
      getInfos() {
        return typeof GM_info === "undefined" ? void 0 : GM_info;
      },
      getTab(callback) {
        return typeof GM_getTab === "undefined" ? void 0 : GM_getTab(callback);
      },
      notification(content, options) {
        var _a;
        const { onclick, ondone, important, duration = 30, silent = true, extraTitle = "" } = options || {};
        const { icon, name } = ((_a = exports3.$gm.getInfos()) === null || _a === void 0 ? void 0 : _a.script) || {};
        GM_notification({
          title: name + (extraTitle ? "-" + extraTitle : ""),
          text: content,
          image: icon || "",
          highlight: important,
          onclick,
          ondone,
          silent,
          timeout: duration * 1e3
        });
      },
      getMetadataFromScriptHead(key) {
        var _a, _b;
        const metadataString = (_a = this.getInfos()) === null || _a === void 0 ? void 0 : _a.scriptMetaStr;
        if (!metadataString) {
          return [];
        } else {
          const metadata = ((_b = metadataString.match(/\/\/\s+==UserScript==([\s\S]+)\/\/\s+==\/UserScript==/)) === null || _b === void 0 ? void 0 : _b[1]) || "";
          const metadataList = (metadata.match(/\/\/\s+@(.+?)\s+(.*?)(?:\n|$)/g) || []).map((line) => {
            const words = line.match(/[\S]+/g) || [];
            return {
              key: (words[1] || "").replace("@", ""),
              value: words.slice(2).join(" ")
            };
          });
          return metadataList.filter((l) => l.key === key).map((l) => l.value);
        }
      }
    };
  })(tampermonkey);
  Object.defineProperty(ui, "__esModule", { value: true });
  ui.$ui = void 0;
  const common_1$4 = common;
  const dom_1$6 = dom;
  const elements_1$2 = elements$1;
  const tampermonkey_1$1 = tampermonkey;
  ui.$ui = {
    tooltip(target) {
      target.setAttribute("data-title", target.title);
      if (tampermonkey_1$1.$gm.isInGMContext()) {
        target.removeAttribute("title");
      }
      const onMouseMove = (e) => {
        if (elements_1$2.$elements.tooltipContainer && elements_1$2.$elements.tooltipContainer.style.display !== "none") {
          elements_1$2.$elements.tooltipContainer.style.top = e.y + "px";
          elements_1$2.$elements.tooltipContainer.style.left = e.x + "px";
        }
      };
      const onTouchMove = (e) => {
        if (elements_1$2.$elements.tooltipContainer && elements_1$2.$elements.tooltipContainer.style.display !== "none") {
          const touch = e.touches[0];
          elements_1$2.$elements.tooltipContainer.style.top = touch.clientY + "px";
          elements_1$2.$elements.tooltipContainer.style.left = touch.clientX + "px";
        }
      };
      const showTitle = (e) => {
        const dataTitle = target.getAttribute("data-title");
        if (elements_1$2.$elements.tooltipContainer) {
          if (dataTitle) {
            elements_1$2.$elements.tooltipContainer.innerHTML = dataTitle.split("\n").join("<br>") || "";
            if (e instanceof MouseEvent) {
              elements_1$2.$elements.tooltipContainer.style.top = e.y + "px";
              elements_1$2.$elements.tooltipContainer.style.left = e.x + "px";
            } else if (e instanceof TouchEvent) {
              const touch = e.touches[0];
              elements_1$2.$elements.tooltipContainer.style.top = touch.clientY + "px";
              elements_1$2.$elements.tooltipContainer.style.left = touch.clientX + "px";
            }
            elements_1$2.$elements.tooltipContainer.style.display = "block";
          } else {
            elements_1$2.$elements.tooltipContainer.style.display = "none";
          }
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
      };
      const hideTitle = () => {
        if (elements_1$2.$elements.tooltipContainer) {
          elements_1$2.$elements.tooltipContainer.style.display = "none";
        }
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
      };
      hideTitle();
      target.addEventListener("mouseenter", showTitle);
      target.addEventListener("click", showTitle);
      target.addEventListener("mouseleave", hideTitle);
      target.addEventListener("touchstart", showTitle);
      target.addEventListener("touchend", hideTitle);
      target.addEventListener("touchcancel", hideTitle);
      target.addEventListener("blur", hideTitle);
      return target;
    },
    scriptPanel(script2, store2, opts) {
      var _a, _b;
      const scriptPanel = (0, dom_1$6.h)("script-panel-element", { name: script2.name });
      script2.onConfigChange("notes", (pre, curr) => {
        scriptPanel.notesContainer.innerHTML = script2.cfg.notes || "";
      });
      script2.panel = scriptPanel;
      scriptPanel.notesContainer.innerHTML = ((_b = (_a = script2.configs) === null || _a === void 0 ? void 0 : _a.notes) === null || _b === void 0 ? void 0 : _b.defaultValue) || "";
      let configs = /* @__PURE__ */ Object.create({});
      const elList = [];
      for (const key in script2.configs) {
        if (Object.prototype.hasOwnProperty.call(script2.configs, key)) {
          const cfg = script2.configs[key];
          if (cfg.separator) {
            elList.push(this.configsArea(this.configs(script2.namespace, store2, configs || {}, opts === null || opts === void 0 ? void 0 : opts.onload)));
            elList.push((0, dom_1$6.h)("div", { className: "separator", style: { margin: "0px 8px" } }, cfg.separator));
            configs = /* @__PURE__ */ Object.create({});
          }
          configs[key] = cfg;
        }
      }
      if (Object.keys(configs).length > 0) {
        elList.push(this.configsArea(this.configs(script2.namespace, store2, configs || {}, opts === null || opts === void 0 ? void 0 : opts.onload)));
      }
      scriptPanel.configsContainer.replaceChildren(...elList);
      return scriptPanel;
    },
    configsArea(configElements) {
      const configsContainer = (0, dom_1$6.h)("div", { className: "configs card" });
      const configsBody = (0, dom_1$6.h)("div", { className: "configs-body" });
      configsBody.append(...Object.entries(configElements).map(([key, el]) => el));
      configsContainer.append(configsBody);
      return configsContainer;
    },
    configs(namespace, store2, configs, onload) {
      const elements2 = /* @__PURE__ */ Object.create({});
      for (const key in configs) {
        if (Object.prototype.hasOwnProperty.call(configs, key)) {
          const config2 = configs[key];
          if (config2.label !== void 0) {
            const element = (0, dom_1$6.h)("config-element", {
              key: common_1$4.$.namespaceKey(namespace, key),
              tag: config2.tag,
              sync: config2.sync,
              attrs: config2.attrs,
              _onload: function(el) {
                var _a;
                (_a = config2.onload) === null || _a === void 0 ? void 0 : _a.call(this, el);
                onload === null || onload === void 0 ? void 0 : onload(el);
              },
              defaultValue: config2.defaultValue,
              options: config2.options,
              showIf: config2.showIf,
              elementClassName: config2.elementClassName,
              labelClassName: config2.labelClassName,
              providerClassName: config2.providerClassName,
              enableForAttribute: config2.enableForAttribute
            });
            element.store = store2;
            element.label.textContent = config2.label;
            elements2[key] = element;
          }
        }
      }
      return elements2;
    },
    notes(lines, tag = "ul") {
      return (0, dom_1$6.h)(tag, lines.map((line) => (0, dom_1$6.h)("li", Array.isArray(line) ? line.map((node) => typeof node === "string" ? (0, dom_1$6.h)("div", { innerHTML: node }) : node) : [typeof line === "string" ? (0, dom_1$6.h)("div", { innerHTML: line }) : line])));
    },
    copy(name, value) {
      return (0, dom_1$6.h)("span", "📄" + name, (btn) => {
        btn.className = "copy";
        btn.addEventListener("click", () => {
          btn.innerText = "已复制√";
          navigator.clipboard.writeText(value);
          setTimeout(() => {
            btn.innerText = "📄" + name;
          }, 500);
        });
      });
    },
    preventText(opts) {
      const { name, delay = 3, autoRemove = true, ondefault, onprevent } = opts;
      const span = (0, dom_1$6.h)("span", name);
      span.style.textDecoration = "underline";
      span.style.cursor = "pointer";
      span.onclick = () => {
        clearTimeout(id);
        if (autoRemove) {
          span.remove();
        }
        onprevent === null || onprevent === void 0 ? void 0 : onprevent(span);
      };
      const id = setTimeout(() => {
        if (autoRemove) {
          span.remove();
        }
        ondefault(span);
      }, delay * 1e3);
      return span;
    },
    space(children, options) {
      return (0, dom_1$6.h)("div", { className: "space" }, (div) => {
        var _a, _b, _c;
        for (let index = 0; index < children.length; index++) {
          const child = (0, dom_1$6.h)("span", { className: "space-item" }, [children[index]]);
          child.style.display = "inline-block";
          const x = (_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 12;
          const y = (_b = options === null || options === void 0 ? void 0 : options.y) !== null && _b !== void 0 ? _b : 0;
          if (index > 0) {
            child.style.marginLeft = x / 2 + "px";
            child.style.marginRight = x / 2 + "px";
            child.style.marginTop = y / 2 + "px";
            child.style.marginBottom = y / 2 + "px";
          } else {
            child.style.marginRight = x / 2 + "px";
            child.style.marginBottom = y / 2 + "px";
          }
          div.append(child);
          if (index !== children.length - 1) {
            div.append((0, dom_1$6.h)("span", [(_c = options === null || options === void 0 ? void 0 : options.separator) !== null && _c !== void 0 ? _c : " "]));
          }
        }
      });
    },
    button(text, attrs, handler) {
      return (0, dom_1$6.h)("input", Object.assign({ type: "button" }, attrs), function(btn) {
        btn.value = text || "";
        btn.classList.add("base-style-button");
        handler === null || handler === void 0 ? void 0 : handler.apply(this, [btn]);
      });
    }
  };
  (function(exports3) {
    var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports4) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports4, p))
          __createBinding(exports4, m, p);
    };
    Object.defineProperty(exports3, "__esModule", { value: true });
    __exportStar(common, exports3);
    __exportStar(ui, exports3);
    __exportStar(dom, exports3);
    __exportStar(elements$1, exports3);
    __exportStar(tampermonkey, exports3);
    __exportStar(store, exports3);
    __exportStar(_const, exports3);
  })(utils);
  (function(exports3) {
    var __awaiter2 = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.cors = exports3.CorsEventEmitter = void 0;
    const utils_12 = utils;
    const common_12 = common;
    const const_12 = _const;
    const store_12 = store;
    class CorsEventEmitter {
      constructor() {
        this.eventMap = /* @__PURE__ */ new Map();
      }
      eventKey(name) {
        return "cors.events." + name;
      }
      tempKey(...args) {
        return ["_temp_", ...args].join(".");
      }
      keyOfReturn(id) {
        return this.tempKey("event", id, "return");
      }
      keyOfArguments(id) {
        return this.tempKey("event", id, "arguments");
      }
      keyOfState(id) {
        return this.tempKey("event", id, "state");
      }
      emit(name, args = [], callback) {
        store_12.$store.getTab(const_12.$const.TAB_UID).then((uid) => {
          const id = common_12.$.uuid().replace(/-/g, "");
          const key = uid + "." + this.eventKey(name);
          store_12.$store.set(this.keyOfState(id), 0);
          store_12.$store.set(this.keyOfArguments(id), args);
          setTimeout(() => {
            const listenerId = store_12.$store.addChangeListener(this.keyOfState(id), () => {
              store_12.$store.removeChangeListener(listenerId);
              callback === null || callback === void 0 ? void 0 : callback(store_12.$store.get(this.keyOfReturn(id)));
              store_12.$store.delete(this.keyOfState(id));
              store_12.$store.delete(this.keyOfReturn(id));
              store_12.$store.delete(this.keyOfArguments(id));
            }) || 0;
            store_12.$store.set(key, (store_12.$store.get(key) ? String(store_12.$store.get(key)).split(",") : []).concat(id).join(","));
          }, 100);
        }).catch(console.error);
      }
      on(name, handler) {
        return new Promise((resolve) => {
          store_12.$store.getTab(const_12.$const.TAB_UID).then((uid) => {
            const key = uid + "." + this.eventKey(name);
            const originId = this.eventMap.get(key);
            if (originId) {
              resolve(originId);
            } else {
              const id = store_12.$store.addChangeListener(key, (curr, pre, remote) => __awaiter2(this, void 0, void 0, function* () {
                if (remote) {
                  if (curr === void 0) {
                    return;
                  }
                  const list = String(curr).split(",");
                  const id2 = list.pop();
                  if (id2) {
                    store_12.$store.set(this.keyOfReturn(id2), yield handler(store_12.$store.get(this.keyOfArguments(id2))));
                    setTimeout(() => {
                      store_12.$store.set(this.keyOfState(id2), 1);
                      store_12.$store.set(key, list.join(","));
                    }, 100);
                  }
                }
              })) || 0;
              this.eventMap.set(key, id);
              resolve(id);
            }
          }).catch(console.error);
        });
      }
      off(name) {
        const key = this.eventKey(name);
        const originId = this.eventMap.get(key);
        if (originId) {
          this.eventMap.delete(key);
          store_12.$store.removeChangeListener(originId);
        }
      }
      defineTopFunction(func) {
        if (utils_12.$gm.isInGMContext() === false) {
          return () => {
          };
        }
        const event_name = "_top_function_." + getFuncId(func);
        if (self === top) {
          exports3.cors.on(event_name, (args) => __awaiter2(this, void 0, void 0, function* () {
            return yield func(...args);
          }));
        }
        return (...args) => __awaiter2(this, void 0, void 0, function* () {
          if (self === top) {
            return yield func(...args);
          }
          const res = yield new Promise((resolve, reject) => {
            try {
              exports3.cors.emit(event_name, args, (val) => {
                resolve(val);
              });
            } catch (e) {
              reject(e);
            }
          });
          return res;
        });
      }
    }
    exports3.CorsEventEmitter = CorsEventEmitter;
    if (typeof GM_listValues !== "undefined" && self === top) {
      window.onload = () => {
        store_12.$store.list().forEach((key) => {
          if (/_temp_.event.[0-9a-z]{32}.(state|return|arguments)/.test(key)) {
            store_12.$store.delete(key);
          }
          if (/_top_function_.*/.test(key)) {
            store_12.$store.delete(key);
          }
          if (/[0-9a-z]{32}.cors.events/.test(key)) {
            store_12.$store.delete(key);
          }
        });
      };
    }
    exports3.cors = new CorsEventEmitter();
    function getFuncId(fn) {
      if (typeof fn !== "function") {
        throw new Error("first argument in defineTopFunction() is not Function!");
      }
      const str = fn.toString();
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(36).padStart(16, "0").slice(-16);
    }
  })(cors);
  var project = {};
  Object.defineProperty(project, "__esModule", { value: true });
  project.Project = void 0;
  class Project {
    constructor({ name, domains, scripts }) {
      this.name = name;
      this.domains = domains;
      for (const key in scripts) {
        if (Object.prototype.hasOwnProperty.call(scripts, key)) {
          const element = scripts[key];
          element.projectName = name;
        }
      }
      this.scripts = scripts;
    }
    static create(opts) {
      return new Project(opts);
    }
  }
  project.Project = Project;
  var script = {};
  var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(script, "__esModule", { value: true });
  script.Script = script.BaseScript = void 0;
  const common_1$3 = common;
  const store_1$1 = store;
  const common_2 = common$1;
  const events_1 = __importDefault$1(events.exports);
  class BaseScript extends common_2.CommonEventEmitter {
  }
  script.BaseScript = BaseScript;
  class Script extends BaseScript {
    get configs() {
      if (!this._resolvedConfigs) {
        this._resolvedConfigs = typeof this._configs === "function" ? this._configs() : this._configs;
      }
      return this._resolvedConfigs;
    }
    set configs(c) {
      this._configs = c;
    }
    constructor({ name, namespace, matches: matches2, excludes, configs, hideInPanel, onstart, onactive, oncomplete, onbeforeunload, onrender, onhistorychange, onhistorychanged, methods, priority }) {
      super();
      this.excludes = [];
      this.cfg = {};
      this.methods = /* @__PURE__ */ Object.create({});
      this.event = new events_1.default();
      this.name = name;
      this.namespace = namespace;
      this.matches = matches2;
      this.excludes = excludes;
      this._configs = configs;
      this.hideInPanel = hideInPanel;
      this.onstart = this.errorHandler(onstart);
      this.onactive = this.errorHandler(onactive);
      this.oncomplete = this.errorHandler(oncomplete);
      this.onbeforeunload = this.errorHandler(onbeforeunload);
      this.onrender = this.errorHandler(onrender);
      this.onhistorychange = this.errorHandler(onhistorychange);
      this.onhistorychanged = this.errorHandler(onhistorychanged);
      this.methods = (methods === null || methods === void 0 ? void 0 : methods.bind(this)()) || /* @__PURE__ */ Object.create({});
      this.priority = priority !== null && priority !== void 0 ? priority : 0;
      if (this.methods) {
        for (const key in methods) {
          if (Reflect.has(this.methods, key) && typeof this.methods[key] !== "function") {
            Reflect.set(this.methods, key, this.errorHandler(this.methods[key]));
          }
        }
      }
    }
    onConfigChange(key, handler) {
      const _key = common_1$3.$.namespaceKey(this.namespace, key.toString());
      return store_1$1.$store.addChangeListener(_key, (curr, pre, remote) => {
        handler(curr, pre, !!remote);
      });
    }
    offConfigChange(listener) {
      store_1$1.$store.removeChangeListener(listener);
    }
    fullName() {
      return this.projectName ? `${this.projectName}-${this.name}` : this.name;
    }
    errorHandler(func) {
      return (...args) => {
        try {
          return func === null || func === void 0 ? void 0 : func.apply(this, args);
        } catch (err) {
          console.error("[OCS] " + this.name + " 出错：", err);
          if (err instanceof Error) {
            this.emit("scripterror", err.message + (err.stack ? "（" + String(err.stack).split("\n").slice(1, 3).map((l) => l.trim()).join(" ← ") + "）" : ""));
          } else {
            this.emit("scripterror", String(err));
          }
        }
      };
    }
  }
  script.Script = Script;
  (function(exports3) {
    var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports4) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports4, p))
          __createBinding(exports4, m, p);
    };
    Object.defineProperty(exports3, "__esModule", { value: true });
    __exportStar(common$1, exports3);
    __exportStar(config$1, exports3);
    __exportStar(cors, exports3);
    __exportStar(project, exports3);
    __exportStar(script, exports3);
    __exportStar(store_provider, exports3);
  })(interfaces);
  var elements = {};
  var config = {};
  var _interface = {};
  Object.defineProperty(_interface, "__esModule", { value: true });
  _interface.IElement = void 0;
  class IElement extends HTMLElement {
    connectedCallback() {
    }
    disconnectedCallback() {
    }
    adoptedCallback() {
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
  }
  _interface.IElement = IElement;
  Object.defineProperty(config, "__esModule", { value: true });
  config.ConfigElement = void 0;
  const ui_1$1 = ui;
  const dom_1$5 = dom;
  const interface_1$6 = _interface;
  class ConfigElement extends interface_1$6.IElement {
    constructor(store2) {
      super();
      this.label = (0, dom_1$5.h)("label");
      this.wrapper = (0, dom_1$5.h)("div", { className: "config-wrapper" });
      this.key = "";
      this.store = store2;
    }
    get value() {
      return this.store.get(this.key, this.defaultValue);
    }
    set value(value) {
      this.provider.value = value;
      this.store.set(this.key, value);
    }
    connectedCallback() {
      var _a, _b, _c;
      switch (this.tag) {
        case "select": {
          this.provider = (0, dom_1$5.h)("select");
          const value = this.store.get(this.key, this.defaultValue);
          for (const item of this.options || []) {
            const option = ui_1$1.$ui.tooltip((0, dom_1$5.h)("option"));
            if (Array.isArray(item)) {
              option.value = item[0];
              option.textContent = (_a = item[1]) !== null && _a !== void 0 ? _a : item[0];
              if (item[2]) {
                option.title = item[2];
              }
              if (String(item[0]) === String(value)) {
                option.selected = true;
                option.toggleAttribute("selected");
              }
              this.provider.add(option);
            } else {
              option.value = item.value;
              option.textContent = (_b = item.label) !== null && _b !== void 0 ? _b : item.value;
              if (item.title) {
                option.title = item.title;
              }
              if (String(item.value) === String(value)) {
                option.selected = true;
                option.toggleAttribute("selected");
              }
              this.provider.add(option);
            }
          }
          this.provider.onchange = () => {
            this.store.set(this.key, this.provider.value);
          };
          break;
        }
        case "textarea": {
          this.provider = (0, dom_1$5.h)("textarea");
          this.provider.value = this.store.get(this.key, this.defaultValue);
          this.provider.onchange = () => {
            this.store.set(this.key, this.provider.value);
          };
          break;
        }
        default: {
          this.provider = (0, dom_1$5.h)("input");
          if (["checkbox", "radio"].some((t2) => {
            var _a2;
            return t2 === ((_a2 = this.attrs) === null || _a2 === void 0 ? void 0 : _a2.type);
          })) {
            this.provider.checked = this.store.get(this.key, this.defaultValue);
            const provider = this.provider;
            provider.onchange = () => {
              this.store.set(this.key, provider.checked);
            };
          } else {
            this.provider.value = this.store.get(this.key, this.defaultValue);
            this.provider.setAttribute("value", this.provider.value);
            this.provider.onchange = () => {
              const { min, max, type } = this.attrs || {};
              if (type === "number") {
                if (this.provider.value.trim() === "") {
                  this.provider.value = this.defaultValue;
                  this.store.set(this.key, this.defaultValue);
                  return;
                }
                const val = parseFloat(this.provider.value);
                const _min = min ? parseFloat(min) : void 0;
                const _max = max ? parseFloat(max) : void 0;
                if (_min && val < _min) {
                  this.provider.value = _min.toString();
                  this.store.set(this.key, parseFloat(this.provider.value));
                } else if (_max && val > _max) {
                  this.provider.value = _max.toString();
                  this.store.set(this.key, parseFloat(this.provider.value));
                } else {
                  this.store.set(this.key, val);
                }
              } else {
                this.store.set(this.key, this.provider.value);
              }
            };
          }
          break;
        }
      }
      if (this.enableForAttribute) {
        this.provider.setAttribute("id", this.key);
        this.label.setAttribute("for", this.key);
      }
      if (this.labelClassName) {
        this.label.className = this.labelClassName;
      }
      if (this.providerClassName) {
        this.provider.className = this.providerClassName;
      }
      if (this.elementClassName) {
        this.className = this.elementClassName;
      }
      this.wrapper.replaceChildren(this.provider);
      this.append(this.label, this.wrapper);
      for (const key in this.attrs) {
        if (key === "style") {
          Object.assign(this.provider.style, this.attrs[key]);
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(this.attrs, key)) {
          Reflect.set(this.provider, key, Reflect.get(this.attrs, key));
        }
      }
      if (this.sync) {
        this.store.addChangeListener(this.key, (curr) => {
          this.provider.value = curr;
        });
      }
      ui_1$1.$ui.tooltip(this.provider);
      if (this.showIf) {
        let show_if = false;
        if (Array.isArray(this.showIf)) {
          if (typeof this.showIf[0] !== "string") {
            throw new Error("EUS Config.showIf first element must be a string");
          }
          const val = this.store.get(this.showIf[0], false) || false;
          const res = this.showIf[1].call(null, val, val, this.store);
          show_if = Boolean(res);
        } else {
          show_if = this.store.get(this.showIf, false) || false;
        }
        if (show_if) {
          this.style.display = "";
        } else {
          this.style.display = "none";
        }
        if (Array.isArray(this.showIf)) {
          if (typeof this.showIf[1] !== "function") {
            throw new Error("EUS Config.showIf second element must be a function");
          }
          this.store.addChangeListener(this.showIf[0], (curr, pre) => {
            if (this.isConnected) {
              if (this.showIf && Array.isArray(this.showIf)) {
                const res = this.showIf[1].call(null, curr, pre, this.store);
                if (res) {
                  this.style.display = "";
                } else {
                  this.style.display = "none";
                }
              }
            }
          });
        } else {
          this.store.addChangeListener(this.showIf, (curr) => {
            if (this.isConnected) {
              const res = Boolean(curr);
              if (res) {
                this.style.display = "";
              } else {
                this.style.display = "none";
              }
            }
          });
        }
      }
      (_c = this._onload) === null || _c === void 0 ? void 0 : _c.call(this.provider, this);
    }
  }
  config.ConfigElement = ConfigElement;
  var container = {};
  Object.defineProperty(container, "__esModule", { value: true });
  container.ContainerElement = void 0;
  const common_1$2 = common;
  const ui_1 = ui;
  const dom_1$4 = dom;
  const interface_1$5 = _interface;
  class ContainerElement extends interface_1$5.IElement {
    constructor() {
      super(...arguments);
      this.header = ui_1.$ui.tooltip((0, dom_1$4.h)("header-element", { title: "菜单栏-可拖动区域" }));
      this.body = (0, dom_1$4.h)("div", { className: "body", clientHeight: window.innerHeight / 2 });
      this.footer = (0, dom_1$4.h)("div", { className: "footer" });
    }
    connectedCallback() {
      this.append(this.header, this.body, this.footer);
      common_1$2.$.onresize(this, (cont) => {
        cont.body.style.maxHeight = window.innerHeight - this.header.clientHeight - 100 + "px";
        cont.body.style.maxWidth = window.innerWidth - 50 + "px";
      });
    }
  }
  container.ContainerElement = ContainerElement;
  var dropdown = {};
  Object.defineProperty(dropdown, "__esModule", { value: true });
  dropdown.DropdownElement = void 0;
  const interface_1$4 = _interface;
  const dom_1$3 = dom;
  class DropdownElement extends interface_1$4.IElement {
    constructor() {
      super(...arguments);
      this.triggerElement = (0, dom_1$3.h)("button");
      this.content = (0, dom_1$3.h)("div", { className: "dropdown-content" });
      this.trigger = "hover";
    }
    connectedCallback() {
      this.append(this.triggerElement, this.content);
      this.classList.add("dropdown");
      if (this.trigger === "click") {
        this.triggerElement.onclick = () => {
          this.content.classList.toggle("show");
        };
      } else {
        this.triggerElement.onmouseover = () => {
          this.content.classList.add("show");
        };
        this.triggerElement.onmouseout = () => {
          this.content.classList.remove("show");
        };
        this.content.onmouseover = () => {
          this.content.classList.add("show");
        };
        this.content.onmouseout = () => {
          this.content.classList.remove("show");
        };
      }
      this.content.onclick = () => {
        this.content.classList.remove("show");
      };
    }
  }
  dropdown.DropdownElement = DropdownElement;
  var header = {};
  Object.defineProperty(header, "__esModule", { value: true });
  header.HeaderElement = void 0;
  const interface_1$3 = _interface;
  class HeaderElement extends interface_1$3.IElement {
    connectedCallback() {
      this.append(this.visualSwitcher || "");
    }
  }
  header.HeaderElement = HeaderElement;
  var message = {};
  Object.defineProperty(message, "__esModule", { value: true });
  message.MessageElement = void 0;
  const dom_1$2 = dom;
  const interface_1$2 = _interface;
  class MessageElement extends interface_1$2.IElement {
    constructor() {
      super(...arguments);
      this.closer = (0, dom_1$2.h)("span", { className: "message-closer" }, "x");
      this.contentContainer = (0, dom_1$2.h)("span", { className: "message-content-container" });
      this.type = "info";
      this.content = "";
      this.closeable = true;
    }
    connectedCallback() {
      var _a;
      this.classList.add(this.type);
      if (typeof this.content === "string") {
        this.contentContainer.innerHTML = this.content;
      } else {
        this.contentContainer.append(this.content);
      }
      this.duration = Math.max((_a = this.duration) !== null && _a !== void 0 ? _a : 5, 0);
      this.append(this.contentContainer);
      if (this.closeable) {
        this.append(this.closer);
        this.closer.addEventListener("click", () => {
          var _a2;
          (_a2 = this.onClose) === null || _a2 === void 0 ? void 0 : _a2.call(this);
          this.remove();
        });
      }
      if (this.duration) {
        setTimeout(() => {
          var _a2;
          (_a2 = this.onClose) === null || _a2 === void 0 ? void 0 : _a2.call(this);
          this.remove();
        }, this.duration * 1e3);
      }
    }
  }
  message.MessageElement = MessageElement;
  var modal$1 = {};
  var __awaiter$2 = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(modal$1, "__esModule", { value: true });
  modal$1.ModalElement = void 0;
  const common_1$1 = common;
  const dom_1$1 = dom;
  const tampermonkey_1 = tampermonkey;
  const interface_1$1 = _interface;
  class ModalElement extends interface_1$1.IElement {
    constructor() {
      super(...arguments);
      this._title = (0, dom_1$1.h)("div", { className: "modal-title" });
      this.body = (0, dom_1$1.h)("div", { className: "modal-body" });
      this.footerContainer = (0, dom_1$1.h)("div", { className: "modal-footer" });
      this.modalInput = (0, dom_1$1.h)("input", { className: "modal-input" });
      this.modalInputType = "input";
      this.type = "alert";
      this.content = "";
      this.inputDefaultValue = "";
      this.placeholder = "";
      this.modalStyle = {};
    }
    connectedCallback() {
      var _a;
      this.classList.add(this.type);
      Object.assign(this.style, this.modalStyle || {});
      const profile = (0, dom_1$1.h)("div", {
        innerText: this.profile || "弹窗来自: OCS " + (((_a = tampermonkey_1.$gm.getInfos()) === null || _a === void 0 ? void 0 : _a.script.version) || ""),
        className: "modal-profile"
      });
      this._title.innerText = this.title;
      this.body.append(typeof this.content === "string" ? (0, dom_1$1.h)("div", { innerHTML: this.content }) : this.content);
      if (this.modalInputType === "textarea") {
        this.modalInput = (0, dom_1$1.h)("textarea", { className: "modal-input", style: { height: "100px" } });
      }
      this.modalInput.placeholder = this.placeholder || "";
      this.modalInput.value = this.inputDefaultValue || "";
      this.append(profile, this._title, this.body, this.footerContainer);
      this.style.width = (this.width || 400) + "px";
      if (this.footer === void 0) {
        this.footerContainer.append(this.modalInput);
        if (this.cancelButton === void 0) {
          this.cancelButton = (0, dom_1$1.h)("button", { className: "modal-cancel-button" });
          this.cancelButton.innerText = this.cancelButtonText || "取消";
          this.cancelButton.onclick = () => {
            var _a2, _b;
            (_a2 = this.onCancel) === null || _a2 === void 0 ? void 0 : _a2.call(this);
            (_b = this.onClose) === null || _b === void 0 ? void 0 : _b.call(this);
            this.remove();
          };
        }
        if (this.confirmButton === void 0) {
          this.confirmButton = (0, dom_1$1.h)("button", { className: "modal-confirm-button" });
          this.confirmButton.innerText = this.confirmButtonText || "确定";
          this.confirmButton.onclick = () => __awaiter$2(this, void 0, void 0, function* () {
            var _b, _c;
            if ((yield (_b = this.onConfirm) === null || _b === void 0 ? void 0 : _b.call(this, this.modalInput.value)) !== false) {
              this.remove();
              (_c = this.onClose) === null || _c === void 0 ? void 0 : _c.call(this, this.modalInput.value);
            }
          });
        }
        this.cancelButton && this.footerContainer.append(this.cancelButton);
        this.confirmButton && this.footerContainer.append(this.confirmButton);
        if (this.type === "simple") {
          this.footerContainer.remove();
        } else if (this.type === "prompt") {
          this.modalInput.focus();
        }
      } else {
        this.footerContainer.append(this.footer);
      }
      common_1$1.$.onresize(this.body, (modal2) => {
        this.body.style.maxHeight = window.innerHeight - 100 + "px";
        this.body.style.maxWidth = window.innerWidth - 50 + "px";
      });
    }
  }
  modal$1.ModalElement = ModalElement;
  var script_panel = {};
  Object.defineProperty(script_panel, "__esModule", { value: true });
  script_panel.ScriptPanelElement = void 0;
  const dom_1 = dom;
  const interface_1 = _interface;
  class ScriptPanelElement extends interface_1.IElement {
    constructor() {
      super(...arguments);
      this.separator = (0, dom_1.h)("div", { className: "separator" });
      this.notesContainer = (0, dom_1.h)("div", { className: "notes card" });
      this.configsContainer = (0, dom_1.h)("div", { className: "configs-container card" });
      this.body = (0, dom_1.h)("div", { className: "script-panel-body" });
      this.lockWrapper = (0, dom_1.h)("div", { className: "lock-wrapper" });
    }
    connectedCallback() {
      this.separator.innerText = this.name || "";
      this.append(this.separator);
      this.append(this.notesContainer);
      this.append(this.configsContainer);
      this.append(this.body);
    }
  }
  script_panel.ScriptPanelElement = ScriptPanelElement;
  (function(exports3) {
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.definedCustomElements = exports3.ScriptPanelElement = exports3.ModalElement = exports3.MessageElement = exports3.HeaderElement = exports3.ContainerElement = exports3.ConfigElement = void 0;
    const config_1 = config;
    const container_1 = container;
    const dropdown_1 = dropdown;
    const header_1 = header;
    const message_1 = message;
    const modal_1 = modal$1;
    const script_panel_1 = script_panel;
    var config_2 = config;
    Object.defineProperty(exports3, "ConfigElement", { enumerable: true, get: function() {
      return config_2.ConfigElement;
    } });
    var container_2 = container;
    Object.defineProperty(exports3, "ContainerElement", { enumerable: true, get: function() {
      return container_2.ContainerElement;
    } });
    var header_2 = header;
    Object.defineProperty(exports3, "HeaderElement", { enumerable: true, get: function() {
      return header_2.HeaderElement;
    } });
    var message_2 = message;
    Object.defineProperty(exports3, "MessageElement", { enumerable: true, get: function() {
      return message_2.MessageElement;
    } });
    var modal_2 = modal$1;
    Object.defineProperty(exports3, "ModalElement", { enumerable: true, get: function() {
      return modal_2.ModalElement;
    } });
    var script_panel_2 = script_panel;
    Object.defineProperty(exports3, "ScriptPanelElement", { enumerable: true, get: function() {
      return script_panel_2.ScriptPanelElement;
    } });
    exports3.definedCustomElements = [
      config_1.ConfigElement,
      container_1.ContainerElement,
      header_1.HeaderElement,
      modal_1.ModalElement,
      message_1.MessageElement,
      script_panel_1.ScriptPanelElement,
      dropdown_1.DropdownElement
    ];
  })(elements);
  var __awaiter$1 = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __rest = commonjsGlobal && commonjsGlobal.__rest || function(s, e) {
    var t2 = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t2[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t2[p[i]] = s[p[i]];
      }
    return t2;
  };
  Object.defineProperty(customWindow, "__esModule", { value: true });
  customWindow.modal = customWindow.CustomWindow = void 0;
  const _1 = interfaces;
  const elements_1$1 = elements;
  const utils_1 = utils;
  const start_1 = start$1;
  const minimizeSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>';
  const expandSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/></svg>';
  class CustomWindow {
    constructor(projects, inputStoreProvider, config2) {
      this.messageContainer = (0, utils_1.h)("div", { className: "message-container" });
      this.extraMenuBar = (0, utils_1.h)("div", { className: "extra-menu-bar" });
      this.defaults = {
        urls: (urls) => urls && urls.length ? urls : [location.href],
        panelName: (name) => name || this.config.render.defaultPanelName || ""
      };
      this.projects = projects;
      this.inputStoreProvider = inputStoreProvider;
      this.config = config2;
      handleLowLevelBrowser();
      utils_1.$.loadCustomElements(elements_1$1.definedCustomElements);
      this.wrapper = (0, utils_1.h)("div");
      utils_1.$elements.tooltipContainer = (0, utils_1.h)("div", { className: "tooltip-container" });
      utils_1.$elements.wrapper = this.wrapper;
      this.root = this.wrapper.attachShadow({ mode: "closed" });
      utils_1.$elements.root = this.root;
      this.container = (0, utils_1.h)("container-element");
      this.root.append(this.container);
      const styles = config2.render.styles.map((s) => (0, utils_1.h)("style", s));
      this.container.append(...styles, this.messageContainer);
      const handlePosition = () => {
        const pos = config2.store.getPosition();
        if (pos.x > document.documentElement.clientWidth || pos.x < 0) {
          config2.store.setPosition(10, 10);
        }
        if (pos.y > document.documentElement.clientHeight || pos.y < 0) {
          config2.store.setPosition(10, 10);
        }
        this.container.style.left = pos.x + "px";
        this.container.style.top = pos.y + "px";
        const positionHandler = () => {
          config2.store.setPosition(this.container.offsetLeft, this.container.offsetTop);
        };
        (0, utils_1.enableElementDraggable)(this.container.header, this.container, positionHandler);
        (0, utils_1.enableElementTouchDraggable)(this.container.header, this.container, positionHandler);
      };
      const handleVisible = () => {
        window.addEventListener("click", (e) => {
          if (e.detail === Math.max(config2.render.switchPoint, 3)) {
            this.container.style.top = e.y + "px";
            this.container.style.left = e.x + "px";
            config2.store.setPosition(e.x, e.y);
            this.setVisual("normal");
          }
        });
      };
      const initCorsModalSystem = () => {
        _1.cors.on("modal", (args) => __awaiter$1(this, void 0, void 0, function* () {
          const [type, _attrs] = args || [];
          return new Promise((resolve, reject) => {
            const attrs = _attrs;
            attrs.onCancel = () => resolve("");
            attrs.onConfirm = resolve;
            attrs.onClose = resolve;
            modal(type, attrs);
          });
        }));
      };
      const initCorsMessageSystem = () => {
        _1.cors.on("message", (args) => __awaiter$1(this, void 0, void 0, function* () {
          const [type, attrs] = args || [];
          console.log("message", type, attrs);
          this.message(type, attrs);
        }));
      };
      window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === config2.render.switchKey) {
          e.stopPropagation();
          e.preventDefault();
          this.setVisual(config2.store.getVisual() === "hidden" ? "normal" : "hidden");
        }
      }, { capture: true });
      handleVisible();
      this.setVisual(config2.store.getVisual());
      (() => __awaiter$1(this, void 0, void 0, function* () {
        const urls = yield config2.store.getRenderURLs();
        const currentPanelName = yield config2.store.getCurrentPanelName();
        yield this.rerender(this.defaults.urls(urls), this.defaults.panelName(currentPanelName));
      }))();
      initCorsModalSystem();
      initCorsMessageSystem();
      handlePosition();
      this.setFontSize(config2.render.fontsize);
    }
    rerender(urls, currentPanelName) {
      return __awaiter$1(this, void 0, void 0, function* () {
        this.initHeader(urls, currentPanelName);
        yield this.renderBody(currentPanelName);
      });
    }
    initHeader(urls, currentPanelName) {
      const profile = utils_1.$ui.tooltip((0, utils_1.h)("div", { className: "profile", title: "菜单栏（可拖动区域）" }));
      {
        const [brandName, brandVersion] = String(this.config.render.title || "无标题").split("|");
        const brand = document.createElement("span");
        brand.className = "ocs-brand";
        const logo2 = document.createElement("img");
        logo2.className = "ocs-brand-logo";
        logo2.alt = "";
        logo2.draggable = false;
        logo2.src = OCS_BRAND_LOGO;
        const nameEl = document.createElement("span");
        nameEl.className = "ocs-brand-name";
        nameEl.textContent = brandName;
        brand.append(logo2, nameEl);
        if (brandVersion) {
          const ver = document.createElement("span");
          ver.className = "ocs-brand-version";
          ver.textContent = brandVersion;
          brand.append(ver);
        }
        profile.append(brand);
      }
      const scriptDropdowns = [];
      for (const project2 of this.projects) {
        const dropdown2 = (0, utils_1.h)("dropdown-element");
        let selected = false;
        const options = [];
        const scripts = utils_1.$.getMatchedScripts([project2], urls).filter((s) => !s.hideInPanel);
        if (scripts.length) {
          for (const key in project2.scripts) {
            if (Object.prototype.hasOwnProperty.call(project2.scripts, key)) {
              const script2 = project2.scripts[key];
              if (!script2.hideInPanel) {
                const optionSelected = isCurrentPanel(project2.name, script2, currentPanelName);
                const option = (0, utils_1.h)("div", { className: "dropdown-option" }, script2.name);
                if (optionSelected) {
                  option.classList.add("active");
                }
                if (selected !== true && optionSelected) {
                  selected = true;
                }
                option.onclick = () => __awaiter$1(this, void 0, void 0, function* () {
                  yield this.config.store.setCurrentPanelName(project2.name + "-" + script2.name);
                });
                options.push(option);
              }
            }
          }
          if (selected) {
            dropdown2.classList.add("active");
          }
          dropdown2.triggerElement = (0, utils_1.h)("div", { className: "dropdown-trigger-element" }, project2.name);
          dropdown2.triggerElement.style.padding = "0px 8px";
          dropdown2.content.append(...options);
          scriptDropdowns.push(dropdown2);
        }
      }
      const isMinimize = () => this.config.store.getVisual() === "minimize";
      const visualSwitcher = utils_1.$ui.tooltip((0, utils_1.h)("div", {
        className: "switch ",
        title: isMinimize() ? "点击展开窗口" : "点击最小化窗口",
        innerHTML: isMinimize() ? expandSvg : minimizeSvg,
        onclick: () => {
          this.setVisual(isMinimize() ? "normal" : "minimize");
          visualSwitcher.title = isMinimize() ? "点击展开窗口" : "点击最小化窗口";
          visualSwitcher.innerHTML = isMinimize() ? expandSvg : minimizeSvg;
        }
      }));
      this.container.header.visualSwitcher = visualSwitcher;
      this.container.header.replaceChildren();
      this.container.header.append((0, utils_1.h)("div", { style: { width: "100%" } }, [
        (0, utils_1.h)("div", { style: { display: "flex", width: "100%" } }, [
          profile,
          ...scriptDropdowns,
          this.container.header.visualSwitcher || ""
        ]),
        (0, utils_1.h)("div", { style: { display: "flex", width: "100%" } }, [this.extraMenuBar])
      ]));
    }
    renderBody(currentPanelName) {
      var _a;
      return __awaiter$1(this, void 0, void 0, function* () {
        for (const project2 of this.projects) {
          for (const key in project2.scripts) {
            if (Object.prototype.hasOwnProperty.call(project2.scripts, key)) {
              const script2 = project2.scripts[key];
              if (isCurrentPanel(project2.name, script2, currentPanelName)) {
                const panel = utils_1.$ui.scriptPanel(script2, this.inputStoreProvider);
                script2.projectName = project2.name;
                script2.panel = panel;
                script2.header = this.container.header;
                utils_1.$elements.currentScriptPanel = panel;
                this.container.body.replaceChildren(panel);
                (_a = script2.onrender) === null || _a === void 0 ? void 0 : _a.call(script2, { panel, header: this.container.header });
                script2.emit("render", { panel, header: this.container.header });
              }
            }
          }
        }
      });
    }
    setFontSize(fontsize) {
      this.container.style.font = `${fontsize}px  Menlo, Monaco, Consolas, 'Courier New', monospace`;
    }
    setVisual(value) {
      this.container.className = "";
      if (value === "minimize") {
        this.container.classList.add("minimize");
      } else if (value === "hidden") {
        this.container.classList.add("hidden");
      } else {
        this.container.classList.add("normal");
      }
      this.config.store.setVisual(value);
    }
    changeRenderURLs(urls) {
      return __awaiter$1(this, void 0, void 0, function* () {
        const currentPanelName = yield this.config.store.getCurrentPanelName();
        yield this.rerender(this.defaults.urls(urls), this.defaults.panelName(currentPanelName));
      });
    }
    changePanel(currentPanelName) {
      return __awaiter$1(this, void 0, void 0, function* () {
        const urls = (yield this.config.store.getRenderURLs()) || [location.href];
        yield this.rerender(this.defaults.urls(urls), this.defaults.panelName(currentPanelName));
      });
    }
    pin(script2) {
      return __awaiter$1(this, void 0, void 0, function* () {
        if (script2.projectName) {
          yield this.config.store.setCurrentPanelName(`${script2.projectName}-${script2.name}`);
        } else if (script2.namespace) {
          yield this.config.store.setCurrentPanelName(script2.namespace);
        } else {
          console.warn("[ERROR]", `${script2.name} 无法置顶， projectName 与 namespace 都为 undefined`);
        }
      });
    }
    minimize() {
      this.setVisual("minimize");
    }
    normal() {
      this.setVisual("normal");
    }
    hidden() {
      this.setVisual("hidden");
    }
    message(type, attrs) {
      if (typeof attrs === "string") {
        attrs = { content: attrs };
      }
      const message2 = (0, utils_1.h)("message-element", Object.assign({ type }, attrs));
      this.messageContainer.append(message2);
      return message2;
    }
    menu(label, config2) {
      return __awaiter$1(this, void 0, void 0, function* () {
        this.extraMenuBar.style.display = "flex";
        const btn = (0, utils_1.h)("button", label);
        btn.addEventListener("click", () => {
          if (config2.scriptPanelLink) {
            this.pin(config2.scriptPanelLink).then(() => {
              this.normal();
            }).catch(console.error);
          }
        });
        if (config2.scriptPanelLink) {
          const full_name = (config2.scriptPanelLink.projectName ? config2.scriptPanelLink.projectName + " -> " : "") + config2.scriptPanelLink.name;
          btn.title = "快捷跳转：" + full_name;
          btn.setAttribute("data-name", (config2.scriptPanelLink.projectName + "-" + config2.scriptPanelLink.name).replace(/\s/g, "_"));
          btn.classList.add("script-panel-link");
        }
        this.extraMenuBar.append(utils_1.$ui.tooltip(btn));
        const name = yield utils_1.$store.getTab(utils_1.$const.TAB_CURRENT_PANEL_NAME);
        if (config2.scriptPanelLink) {
          if (isCurrentPanel(config2.scriptPanelLink.projectName, config2.scriptPanelLink, name)) {
            this.extraMenuBar.querySelectorAll(".script-panel-link").forEach((el) => el.classList.remove("active"));
            btn.classList.add("active");
          }
        }
        return btn;
      });
    }
    mount(parent) {
      const anchor = parent.children.length ? parent.children[utils_1.$.random(0, parent.children.length - 1)] : null;
      if (anchor) anchor.after(this.wrapper);
      else parent.append(this.wrapper);
    }
  }
  customWindow.CustomWindow = CustomWindow;
  function isCurrentPanel(projectName, script2, currentPanelName) {
    return projectName + "-" + script2.name === currentPanelName || script2.namespace === currentPanelName;
  }
  function handleLowLevelBrowser() {
    if (typeof Element.prototype.replaceChildren === "undefined") {
      Element.prototype.replaceChildren = function(...nodes) {
        this.innerHTML = "";
        for (const node of nodes) {
          this.append(node);
        }
      };
    }
  }
  function modal(type, attrs, parent = (start_1.$win === null || start_1.$win === void 0 ? void 0 : start_1.$win.container) || utils_1.$elements.root || document.body) {
    const { maskCloseable = true, onConfirm, onCancel, onClose, notification: notify, notificationOptions, duration } = attrs, _attrs = __rest(attrs, ["maskCloseable", "onConfirm", "onCancel", "onClose", "notification", "notificationOptions", "duration"]);
    if (notify) {
      utils_1.$gm.notification(typeof _attrs.content === "string" ? _attrs.content : _attrs.content.textContent || "", notificationOptions);
    }
    const wrapper = (0, utils_1.h)("div", { className: "modal-wrapper" }, (wrapper2) => {
      const modal2 = (0, utils_1.h)("modal-element", Object.assign({
        onConfirm(val) {
          return __awaiter$1(this, void 0, void 0, function* () {
            const isClose = yield onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm.apply(modal2, [val]);
            if (isClose !== false) {
              wrapper2.remove();
            }
            return isClose;
          });
        },
        onCancel() {
          onCancel === null || onCancel === void 0 ? void 0 : onCancel.apply(modal2);
          wrapper2.remove();
        },
        onClose(val) {
          onClose === null || onClose === void 0 ? void 0 : onClose.apply(modal2, [val]);
          wrapper2.remove();
        },
        type
      }, _attrs));
      wrapper2.append(modal2);
      modal2.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      if (maskCloseable) {
        wrapper2.addEventListener("click", () => {
          onClose === null || onClose === void 0 ? void 0 : onClose.apply(modal2);
          wrapper2.remove();
        });
      }
    });
    if (duration) {
      setTimeout(() => {
        wrapper.remove();
      }, duration * 1e3);
    }
    parent.append(wrapper);
    return wrapper;
  }
  customWindow.modal = modal;
  var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(start$1, "__esModule", { value: true });
  start$1.addFunctionEventListener = start$1.start = start$1.$win = void 0;
  const custom_window_1 = customWindow;
  const common_1 = common;
  const const_1 = _const;
  const elements_1 = elements$1;
  const store_1 = store;
  const debounce_1 = __importDefault(debounce_1$1);
  let mounted = false;
  function start(startConfig) {
    return __awaiter(this, void 0, void 0, function* () {
      startConfig.projects = startConfig.projects.map((p) => {
        for (const key in p.scripts) {
          if (Object.prototype.hasOwnProperty.call(p.scripts, key)) {
            p.scripts[key].cfg = common_1.$.createConfigProxy(p.scripts[key]);
          }
        }
        return p;
      });
      const scripts = common_1.$.getMatchedScripts(startConfig.projects, [location.href]).sort((a, b) => b.priority - a.priority);
      scripts.forEach((script2) => {
        var _a;
        script2.startConfig = startConfig;
        try {
          script2.emit("start", startConfig);
          (_a = script2.onstart) === null || _a === void 0 ? void 0 : _a.call(script2, startConfig);
        } catch (e) {
          console.error("[OCS] 脚本启动异常（已跳过，不影响悬浮窗）:", script2.name, e);
        }
      });
      const uid = yield store_1.$store.getTab(const_1.$const.TAB_UID);
      if (uid === void 0) {
        yield store_1.$store.setTab(const_1.$const.TAB_UID, common_1.$.uuid());
      }
      const urls = yield store_1.$store.getTab(const_1.$const.TAB_URLS);
      yield store_1.$store.setTab(const_1.$const.TAB_URLS, Array.from(new Set((urls || []).concat(location.href))));
      const safeMount = (cfg) => {
        try {
          const p = mount(cfg);
          if (p && typeof p.catch === "function") p.catch((e) => console.error("[OCS] 面板挂载失败:", e));
        } catch (e) {
          console.error("[OCS] 面板挂载异常:", e);
        }
      };
      const safeCall = (script2, hook, eventName) => {
        var _a, _b;
        try {
          if (eventName) script2.emit(eventName, startConfig);
          (_b = script2[hook]) === null || _b === void 0 ? void 0 : _b.call(script2, startConfig);
        } catch (e) {
          console.error("[OCS] 脚本生命周期异常（已跳过）:", script2.name, hook, e);
        }
      };
      let active = false;
      if (document.readyState === "interactive") {
        active = true;
        safeMount(startConfig);
        scripts.forEach((script2) => safeCall(script2, "onactive"));
      } else if (document.readyState === "complete") {
        safeMount(startConfig);
        scripts.forEach((script2) => safeCall(script2, "onactive"));
        scripts.forEach((script2) => safeCall(script2, "oncomplete"));
      }
      document.addEventListener("readystatechange", () => {
        safeMount(startConfig);
        if (document.readyState === "interactive" && active === false) {
          scripts.forEach((script2) => safeCall(script2, "onactive", "active"));
        }
        if (document.readyState === "complete") {
          scripts.forEach((script2) => safeCall(script2, "oncomplete", "complete"));
        }
      });
      window.addEventListener("hashchange", () => {
        scripts.forEach((script2) => {
          var _a;
          script2.emit("hashchange", startConfig);
          (_a = script2.onhashchange) === null || _a === void 0 ? void 0 : _a.call(script2, startConfig);
        });
      });
      history.pushState = addFunctionEventListener(history, "pushState");
      history.replaceState = addFunctionEventListener(history, "replaceState");
      window.addEventListener("pushState", () => {
        scripts.forEach((script2) => {
          var _a;
          script2.emit("historychange", "push", startConfig);
          (_a = script2.onhistorychange) === null || _a === void 0 ? void 0 : _a.call(script2, "push", startConfig);
        });
        const new_scripts = common_1.$.getMatchedScripts(startConfig.projects, [location.href]).sort((a, b) => b.priority - a.priority);
        new_scripts.forEach((ns) => {
          var _a;
          ns.emit("historychanged", "pushed", startConfig);
          (_a = ns.onhistorychanged) === null || _a === void 0 ? void 0 : _a.call(ns, "pushed", startConfig);
        });
      });
      window.addEventListener("replaceState", () => {
        scripts.forEach((script2) => {
          var _a;
          script2.emit("historychange", "replace", startConfig);
          (_a = script2.onhistorychange) === null || _a === void 0 ? void 0 : _a.call(script2, "replace", startConfig);
        });
        const new_scripts = common_1.$.getMatchedScripts(startConfig.projects, [location.href]).sort((a, b) => b.priority - a.priority);
        new_scripts.forEach((ns) => {
          var _a;
          ns.emit("historychanged", "replaced", startConfig);
          (_a = ns.onhistorychanged) === null || _a === void 0 ? void 0 : _a.call(ns, "replaced", startConfig);
        });
      });
      window.addEventListener("beforeunload", (e) => {
        var _a;
        let prevent;
        for (const script2 of scripts) {
          script2.emit("beforeunload");
          if ((_a = script2.onbeforeunload) === null || _a === void 0 ? void 0 : _a.call(script2, startConfig)) {
            prevent = true;
          }
        }
        if (prevent) {
          e.preventDefault();
          e.returnValue = true;
          return true;
        }
      });
    });
  }
  start$1.start = start;
  function addFunctionEventListener(obj, type) {
    const origin = obj[type];
    return function(...args) {
      const res = origin.apply(this, args);
      const e = new Event(type.toString());
      e.arguments = args;
      window.dispatchEvent(e);
      return res;
    };
  }
  start$1.addFunctionEventListener = addFunctionEventListener;
  function mount(startConfig) {
    return __awaiter(this, void 0, void 0, function* () {
      if (mounted === true) {
        return;
      }
      mounted = true;
      if (startConfig === void 0 || startConfig.renderConfig === void 0) {
        console.warn("the script will not have ui because the renderConfig is not defined.");
        return;
      }
      if (self === top) {
        const { projects, renderConfig } = startConfig;
        if (typeof renderConfig.renderScript === "undefined") {
          console.warn("the script will not have ui because the RenderScript is not defined.");
          return;
        }
        const scripts = common_1.$.getMatchedScripts(projects, [location.href]).filter((s) => !!s.hideInPanel === false);
        if (scripts.length <= 0) {
          return;
        }
        const RenderScript2 = renderConfig.renderScript;
        const win = new custom_window_1.CustomWindow(startConfig.projects, store_1.$store, {
          render: {
            title: renderConfig.title,
            styles: renderConfig.styles,
            defaultPanelName: renderConfig.defaultPanelName,
            fontsize: RenderScript2.cfg.fontsize,
            switchPoint: RenderScript2.cfg.switchPoint,
            switchKey: "o"
          },
          store: {
            getPosition: () => {
              return { x: RenderScript2.cfg.x, y: RenderScript2.cfg.y };
            },
            setPosition: (x, y) => {
              RenderScript2.cfg.x = x;
              RenderScript2.cfg.y = y;
            },
            getVisual: () => {
              return RenderScript2.cfg.visual;
            },
            setVisual: (size) => {
              RenderScript2.cfg.visual = size;
            },
            getRenderURLs() {
              return __awaiter(this, void 0, void 0, function* () {
                return yield store_1.$store.getTab(const_1.$const.TAB_URLS);
              });
            },
            setRenderURLs(urls) {
              return __awaiter(this, void 0, void 0, function* () {
                return yield store_1.$store.setTab(const_1.$const.TAB_URLS, urls);
              });
            },
            getCurrentPanelName() {
              return __awaiter(this, void 0, void 0, function* () {
                return yield store_1.$store.getTab(const_1.$const.TAB_CURRENT_PANEL_NAME);
              });
            },
            setCurrentPanelName(name) {
              return __awaiter(this, void 0, void 0, function* () {
                return yield store_1.$store.setTab(const_1.$const.TAB_CURRENT_PANEL_NAME, name);
              });
            }
          }
        });
        RenderScript2.onConfigChange("fontsize", (fs) => {
          win.setFontSize(fs);
        });
        store_1.$store.addTabChangeListener(const_1.$const.TAB_URLS, (0, debounce_1.default)((curr, pre) => {
          if (JSON.stringify(curr) === JSON.stringify(pre)) {
            return;
          }
          win.changeRenderURLs(curr);
        }, 2e3));
        store_1.$store.addTabChangeListener(const_1.$const.TAB_CURRENT_PANEL_NAME, (curr, pre) => {
          if (curr === pre) {
            return;
          }
          win.changePanel(curr);
          updateMenusState(win, curr);
        });
        win.mount(startConfig.mountElement || document.body);
        elements_1.$elements.tooltipContainer && win.container.append(elements_1.$elements.tooltipContainer);
        start$1.$win = win;
      }
    });
  }
  function updateMenusState(win, name) {
    var _a;
    win.root.querySelectorAll(".extra-menu-bar .script-panel-link").forEach((el) => el.classList.remove("active"));
    (_a = win.root.querySelector('.extra-menu-bar [data-name="' + name.replace(/\s/g, "_") + '"]')) === null || _a === void 0 ? void 0 : _a.classList.add("active");
  }
  var render = {};
  (function(exports3) {
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.$menu = exports3.$message = exports3.$modal = exports3.createRenderScript = void 0;
    const script_1 = script;
    const ui_12 = ui;
    const dom_12 = dom;
    const custom_window_12 = customWindow;
    const start_12 = start$1;
    const interfaces_1 = interfaces;
    const createRenderScript = (config2) => new script_1.Script({
      name: (config2 === null || config2 === void 0 ? void 0 : config2.name) || "窗口设置",
      matches: (config2 === null || config2 === void 0 ? void 0 : config2.matches) || [["所有", /.*/]],
      namespace: "render.panel",
      configs: {
        notes: {
          defaultValue: ui_12.$ui.notes([
            [
              "如果需要隐藏整个窗口，可以点击下方隐藏按钮，",
              "隐藏后可以快速三击屏幕中的任意地方",
              "来重新在鼠标位置显示窗口。"
            ],
            "窗口连续点击显示的次数可以自定义，默认为三次",
            ["窗口快捷键列表：", "ctrl + o : 隐藏/打开 面板"]
          ]).outerHTML
        },
        x: { defaultValue: window.innerWidth * 0.1 },
        y: { defaultValue: window.innerWidth * 0.1 },
        visual: { defaultValue: "normal" },
        firstCloseAlert: {
          defaultValue: true
        },
        fontsize: {
          label: "字体大小（像素）",
          attrs: { type: "number", min: 12, max: 24, step: 1 },
          defaultValue: 14
        },
        switchPoint: {
          label: "窗口显示连点（次数）",
          attrs: {
            type: "number",
            min: 3,
            max: 10,
            step: 1,
            title: "设置当连续点击屏幕 N 次时，可以进行面板的 隐藏/显示 切换，默认连续点击屏幕三下"
          },
          defaultValue: 3
        }
      },
      methods() {
        return {
          pin: (script2) => start_12.$win === null || start_12.$win === void 0 ? void 0 : start_12.$win.pin(script2),
          minimize: () => start_12.$win === null || start_12.$win === void 0 ? void 0 : start_12.$win.minimize(),
          setPosition: (x, y) => {
            if (start_12.$win) {
              start_12.$win.config.store.setPosition(x, y);
              start_12.$win.container.style.left = x + "px";
              start_12.$win.container.style.top = y + "px";
            }
          },
          normal: () => {
            start_12.$win === null || start_12.$win === void 0 ? void 0 : start_12.$win.normal();
          }
        };
      },
      onrender({ panel }) {
        const closeBtn = (0, dom_12.h)("button", { className: "base-style-button" }, "隐藏窗口");
        closeBtn.onclick = () => {
          if (this.cfg.firstCloseAlert) {
            exports3.$modal.confirm({
              content: ui_12.$ui.notes([
                "隐藏脚本页面后，快速点击页面三下（可以在悬浮窗设置中调整次数）即可重新显示脚本。如果三下无效，可以尝试删除脚本重新安装。",
                "请确认是否关闭。（此后不再显示此弹窗）"
              ]),
              onConfirm: () => {
                start_12.$win === null || start_12.$win === void 0 ? void 0 : start_12.$win.hidden();
                this.cfg.firstCloseAlert = false;
              }
            });
          } else {
            start_12.$win === null || start_12.$win === void 0 ? void 0 : start_12.$win.hidden();
          }
        };
        panel.body.replaceChildren((0, dom_12.h)("hr"), closeBtn);
      }
    });
    exports3.createRenderScript = createRenderScript;
    function _modal(type, attrs, parent) {
      if (self === top) {
        return (0, custom_window_12.modal)(type, attrs, parent);
      } else {
        interfaces_1.cors.emit("modal", [type, attrs], (args) => {
          var _a, _b, _c;
          if (args) {
            (_a = attrs.onConfirm) === null || _a === void 0 ? void 0 : _a.call(attrs, args);
          } else {
            (_b = attrs.onCancel) === null || _b === void 0 ? void 0 : _b.call(attrs);
          }
          (_c = attrs.onClose) === null || _c === void 0 ? void 0 : _c.call(attrs, args);
        });
      }
    }
    exports3.$modal = {
      confirm: (attrs, parent) => _modal("confirm", attrs, parent),
      alert: (attrs, parent) => _modal("alert", attrs, parent),
      prompt: (attrs, parent) => _modal("prompt", attrs, parent),
      simple: (attrs, parent) => _modal("simple", attrs, parent)
    };
    function _message(type, attrs) {
      if (self === top) {
        return start_12.$win === null || start_12.$win === void 0 ? void 0 : start_12.$win.message(type, attrs);
      } else {
        if (typeof attrs === "string") {
          attrs = { content: attrs };
        } else if (typeof attrs.content !== "string") {
          attrs.content = attrs.content.innerHTML;
        }
        interfaces_1.cors.emit("message", [type, attrs]);
      }
    }
    exports3.$message = {
      info: (attrs) => _message("info", attrs),
      success: (attrs) => _message("success", attrs),
      warn: (attrs) => _message("warn", attrs),
      error: (attrs) => _message("error", attrs)
    };
    function $menu(label, config2) {
      if (self !== top) {
        return;
      }
      return start_12.$win === null || start_12.$win === void 0 ? void 0 : start_12.$win.menu(label, config2);
    }
    exports3.$menu = $menu;
  })(render);
  (function(exports3) {
    var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports4) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports4, p))
          __createBinding(exports4, m, p);
    };
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.start = void 0;
    var start_12 = start$1;
    Object.defineProperty(exports3, "start", { enumerable: true, get: function() {
      return start_12.start;
    } });
    __exportStar(utils, exports3);
    __exportStar(render, exports3);
    __exportStar(elements, exports3);
    __exportStar(interfaces, exports3);
  })(lib);
  const ListOfActions = [
    "click",
    "check",
    "dblclick",
    "bringToFront",
    "dragAndDrop",
    "fill",
    "focus",
    "hover",
    "screenshot",
    "selectOption",
    "setInputFiles",
    "tap",
    "press",
    "reload",
    "waitForRequest",
    "waitForResponse",
    "waitForSelector",
    "keyboard.type",
    "keyboard.press",
    "mouse.wheel",
    "mouse.click",
    "mouse.dblclick",
    "mouse.down",
    "mouse.up",
    "mouse.move"
  ];
  const mouseIdleRequireActions = [
    "click",
    "dblclick",
    "dragAndDrop",
    "fill",
    "hover",
    "tap",
    "press",
    "keyboard.type",
    "keyboard.press",
    "mouse.wheel",
    "mouse.click",
    "mouse.dblclick",
    "mouse.down",
    "mouse.up",
    "mouse.move"
  ];
  class RemotePlaywright {
    static async getRemotePage(show_debug_cursor, logger) {
      if (this.currentPage) {
        return this.currentPage;
      }
      if (!this.authToken) {
        try {
          this.authToken = await request("http://localhost:15319/get-actions-key", {
            type: "GM_xmlhttpRequest",
            method: "get",
            responseType: "text"
          });
          this.currentPage = this.createRemotePage(this.authToken, { show_debug_cursor, logger });
          return this.currentPage;
        } catch (e) {
          console.log(e);
          return void 0;
        }
      } else {
        this.currentPage = this.createRemotePage(this.authToken, { show_debug_cursor, logger });
        return this.currentPage;
      }
    }
    static createRemotePage(authToken, configs) {
      const page = /* @__PURE__ */ Object.create({});
      configs = configs || {};
      configs.logger = configs.logger || console.debug;
      for (const property of ListOfActions) {
        Reflect.set(page, property, async (...args) => {
          var _a, _b, _c;
          let data;
          if (mouseIdleRequireActions.includes(property)) {
            await waitForMouseIdle();
          }
          if (property === "click") {
            if (args[0] instanceof Element) {
              const el = args[0];
              const options = args[1] || {};
              await scrollToElement(el);
              await $.sleep(500);
              const rect = el.getBoundingClientRect();
              const elFromPoint = (_a = lib.$elements.root) == null ? void 0 : _a.elementFromPoint(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
              );
              if (elFromPoint && lib.$elements.root && lib.$elements.root.contains(elFromPoint)) {
                const panel = lib.$elements.root.querySelector("container-element");
                if (panel) {
                  lib.$message.info({ content: "检测到脚本阻挡点击位置，已自动移开", duration: 2 });
                  await $.transition(panel, "left", 0.1, rect.left + rect.width / 2 + 100 + "px", { reset_ms: 1 });
                }
              }
              if (configs == null ? void 0 : configs.show_debug_cursor) {
                showMousePointer(el);
              }
              data = {
                page: window.location.href,
                property: "mouse.click",
                args: [
                  rect.left + rect.width / 2,
                  rect.top + rect.height / 2,
                  {
                    button: options.button,
                    clickCount: options.clickCount,
                    delay: options.delay
                  }
                ]
              };
            } else if (typeof args[0] === "string") {
              const el = document.querySelector(args[0]);
              if (el) {
                await scrollToElement(el);
                if (configs == null ? void 0 : configs.show_debug_cursor) {
                  showMousePointer(el);
                }
              }
            }
          }
          if (!data) {
            data = { page: window.location.href, property, args };
          }
          (_b = configs == null ? void 0 : configs.logger) == null ? void 0 : _b.call(configs, "[RP]: ", JSON.stringify(data));
          try {
            const res = await request("/ocs-script-actions", {
              type: "fetch",
              method: "post",
              responseType: ["waitForRequest", "waitForResponse", "reload"].includes(property) ? "json" : "text",
              headers: {
                "auth-token": authToken
              },
              data
            });
            return res;
          } catch (e) {
            (_c = configs == null ? void 0 : configs.logger) == null ? void 0 : _c.call(configs, "[RP-ERROR]: ", JSON.stringify(data));
            return void 0;
          }
        });
      }
      console.log(page);
      return page;
    }
  }
  RemotePlaywright.authToken = "";
  RemotePlaywright.currentPage = void 0;
  function scrollToElement(el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    return $.sleep(200);
  }
  function showMousePointer(el) {
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const div = document.createElement("div");
      div.textContent = "";
      div.style.position = "fixed";
      div.style.zIndex = "99999";
      div.style.width = "20px";
      div.style.height = "20px";
      div.style.border = "2px solid red";
      div.style.borderRadius = "50%";
      div.style.left = rect.left + rect.width / 2 - 11 + "px";
      div.style.top = rect.top + rect.height / 2 - 11 + "px";
      document.body.append(div);
      setTimeout(() => {
        div.remove();
      }, 500);
    }, 100);
  }
  function waitForMouseIdle(timeout = 200) {
    return new Promise((resolve) => {
      let timer;
      const default_timer = setTimeout(() => {
        window.removeEventListener("mousemove", onMouseMove);
        resolve();
      }, timeout);
      function onMouseMove() {
        clearTimeout(default_timer);
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          window.removeEventListener("mousemove", onMouseMove);
          resolve();
        }, timeout);
      }
      window.addEventListener("mousemove", onMouseMove);
    });
  }
  function defaultWorkTypeResolver(ctx) {
    function count(selector) {
      let c = 0;
      for (const option of ctx.elements.options || []) {
        if (option && (option.matches && option.matches(selector) || option.querySelector && option.querySelector(selector))) {
          c++;
        }
      }
      return c;
    }
    return count('[type="checkbox"],[role="checkbox"]') >= 1 ? "multiple" : count('[type="radio"],[role="radio"]') === 2 ? "judgement" : count('[type="radio"],[role="radio"]') >= 1 ? "single" : count('textarea,input[type="text"],[contenteditable="true"]') >= 1 ? "completion" : void 0;
  }
  function isPlainAnswer(answer) {
    answer = answer.trim();
    if (answer.length > 8 || !/[A-Z]/.test(answer)) {
      return false;
    }
    const counter = {};
    let min = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer.charCodeAt(i) < min) {
        return false;
      }
      min = answer.charCodeAt(i);
      counter[min] = (counter[min] || 0) + 1;
    }
    for (const key in counter) {
      if (counter[key] !== 1) {
        return false;
      }
    }
    return true;
  }
  function resolvePlainAnswer(answer) {
    const resolve = answer.trim().replace(/[,，.。．、 #]/g, "").trim();
    if (isPlainAnswer(resolve)) {
      return resolve;
    }
  }
  function isProgramAnswer(answer) {
    const code = (answer != null ? answer : "").trim();
    if (!code)
      return false;
    if (!/[;|；]/.test(code))
      return false;
    let score = 0;
    const strong = [
      /#include\s*[<"]/,
      /#define\s+\w/,
      /#!\//,
      /\b(?:int|void|float|double|char|long|short)\s+main\s*\(/,
      /\bfunction\s+\w+\s*\(/,
      /\bdef\s+\w+\s*\(/,
      /\bpublic\s+(?:class|static|void|int|float|double|String|final)\b/,
      /\bprivate\s+(?:class|static|void|int|float|double|String|final)\b/,
      /\bprotected\s+(?:class|static|void|int|float|double|String|final)\b/,
      /\bprintf\s*\(/,
      /\bscanf\s*\(/,
      /\bcout\s*<</,
      /\bcin\s*>>/,
      /System\.out\./,
      /console\.log\s*\(/,
      /\bpackage\s+[\w.]+\s*;/,
      /\bimport\s+[\w.*]+\s*;/,
      /\bclass\s+\w+\s*\{/,
      /\bstruct\s+\w+\s*\{/
    ];
    for (const re2 of strong)
      if (re2.test(code))
        score += 2;
    const medium = [
      /=>/,
      /->/,
      /::/,
      /\+\+/,
      /--/,
      /[+\-*/%]=/,
      /\bnew\s+\w+\s*\(/,
      /\bfor\s*\(/,
      /\bwhile\s*\(/,
      /\bif\s*\(/,
      /\bswitch\s*\(/,
      /\btypedef\s+/,
      /\b(?:int|float|double|char|void|bool|boolean|long|short|String|auto|const|let|var)\s+\w+/,
      /\bsizeof\s*\(/,
      /\bmalloc\s*\(/,
      /\bfree\s*\(/,
      /\bcout\b/,
      /\bcin\b/
    ];
    for (const re2 of medium)
      if (re2.test(code))
        score += 1;
    if (/\{/.test(code) && /\}/.test(code))
      score += 1;
    if (/;/.test(code))
      score += 1;
    return score >= 2;
  }
  function splitAnswer(answer, separators = ["===", "#", "---", "###", "|", ";", "；"]) {
    answer = answer.trim();
    if (answer.length === 0) {
      return [];
    }
    separators = separators.length === 0 ? ["===", "#", "---", "###", "|", ";", "；"] : separators;
    separators = separators.filter((el) => el.trim().length > 0);
    if (isProgramAnswer(answer)) {
      separators = separators.filter((el) => el !== ";" && el !== "|" && el !== "；");
    }
    try {
      const json = JSON.parse(answer);
      if (Array.isArray(json)) {
        return json.map(String).map((el) => el.trim()).filter((el) => el.length > 0);
      }
    } catch {
      for (const sep of separators) {
        if (answer.split(sep).length > 1) {
          return answer.split(sep).map((el) => el.trim()).filter((el) => el.length > 0);
        }
      }
    }
    return [answer];
  }
  function resolveSingle(answers, options, separators) {
    const allAnswer = answers.map((a) => splitAnswer(a, separators)).flat();
    const optionStrings = options.map(removeRedundant);
    const normalizedResult = answerNormalizedMatch(allAnswer, optionStrings);
    if (normalizedResult.length) {
      const index = optionStrings.findIndex((opt) => opt === normalizedResult[0]);
      if (index !== -1) {
        return { finish: true, option: options[index], optionIndex: index };
      }
    }
    const ratings = answerSimilar(allAnswer, optionStrings);
    let bestIndex = -1;
    let bestRating = 0;
    ratings.forEach((r, i) => {
      if (r.rating > bestRating) {
        bestRating = r.rating;
        bestIndex = i;
      }
    });
    if (bestIndex !== -1 && bestRating > 0.6) {
      return {
        finish: true,
        option: options[bestIndex],
        optionIndex: bestIndex,
        ratings: ratings.map((r) => r.rating)
      };
    }
    for (const answer of allAnswer) {
      const ans = resolvePlainAnswer(StringUtils.nowrap(answer, "").trim());
      if (ans && ans.length === 1) {
        const index = ans.charCodeAt(0) - 65;
        if (optionStrings[index] !== void 0) {
          return { finish: true, option: options[index], optionIndex: index };
        }
      }
    }
    if (allAnswer.length > 1) {
      const merged = allAnswer.join("");
      const r = resolveSingle([merged], options, separators);
      if (r.finish) {
        return r;
      }
    }
    return { finish: false, allAnswer, options: optionStrings };
  }
  function resolveMultiple(resultAnswers, options, separators) {
    const optionStrings = options.map(removeRedundant);
    const groups = [];
    for (let i = 0; i < resultAnswers.length; i++) {
      const answers = splitAnswer(resultAnswers[i].trim(), separators);
      const normalizedGroup = {
        options: [],
        answers: [],
        ratings: [],
        similarSum: 0,
        similarCount: 0
      };
      const normalizedOptions = answerNormalizedMatch(answers, optionStrings);
      for (const opt of normalizedOptions) {
        const idx = optionStrings.indexOf(opt);
        if (idx !== -1) {
          const matchedAns = answers.find((a) => {
            const na2 = normalizeString(removeRedundant(a));
            const no2 = normalizeString(removeRedundant(opt));
            return na2 === no2 || na2.includes(no2);
          });
          if (!matchedAns)
            continue;
          normalizedGroup.options.push(options[idx]);
          normalizedGroup.answers.push(matchedAns);
          const na = normalizeString(removeRedundant(matchedAns));
          const no = normalizeString(removeRedundant(opt));
          const rating = na === no ? 1 : 0.8;
          normalizedGroup.ratings.push(rating);
          normalizedGroup.similarSum += rating;
          normalizedGroup.similarCount += 1;
        }
      }
      const normalizedDisambiguated = disambiguateSimilarOptions(normalizedGroup.options, normalizedGroup.ratings);
      const normalizedKeptIndices = normalizedDisambiguated.map((opt) => normalizedGroup.options.indexOf(opt));
      normalizedGroup.options = normalizedDisambiguated;
      normalizedGroup.answers = normalizedKeptIndices.map((idx) => normalizedGroup.answers[idx]);
      normalizedGroup.ratings = normalizedKeptIndices.map((idx) => normalizedGroup.ratings[idx]);
      normalizedGroup.similarCount = normalizedGroup.options.length;
      normalizedGroup.similarSum = normalizedGroup.ratings.reduce((a, b) => a + b, 0);
      const ratingGroup = { options: [], answers: [], ratings: [], similarSum: 0, similarCount: 0 };
      const ratings = answerSimilarWithGap(answers, optionStrings);
      for (let j = 0; j < ratings.length; j++) {
        if (ratings[j].rating > 0.6) {
          ratingGroup.options.push(options[j]);
          ratingGroup.answers.push(ratings[j].target);
          ratingGroup.ratings.push(ratings[j].rating);
          ratingGroup.similarSum += ratings[j].rating;
          ratingGroup.similarCount += 1;
        }
      }
      const disambiguated = disambiguateSimilarOptions(ratingGroup.options, ratingGroup.ratings);
      const keptIndices = disambiguated.map((opt) => ratingGroup.options.indexOf(opt));
      ratingGroup.options = disambiguated;
      ratingGroup.answers = keptIndices.map((idx) => ratingGroup.answers[idx]);
      ratingGroup.ratings = keptIndices.map((idx) => ratingGroup.ratings[idx]);
      ratingGroup.similarCount = ratingGroup.options.length;
      ratingGroup.similarSum = ratingGroup.ratings.reduce((a, b) => a + b, 0);
      const best = [normalizedGroup, ratingGroup].sort(
        (a, b) => b.similarCount * 100 + b.similarSum - a.similarCount * 100 - a.similarSum
      )[0];
      groups[i] = best;
    }
    const sorted = groups.filter((g) => g.similarCount !== 0).sort((a, b) => {
      const bsc = b.similarCount * 100;
      const asc = a.similarCount * 100;
      return bsc + b.similarSum - asc - a.similarSum;
    });
    if (sorted[0]) {
      return { finish: true, options: sorted[0].options, groups: sorted };
    }
    const plainOptions = [];
    const plainOptionIndexes = [];
    for (const answer of resultAnswers) {
      const ans = StringUtils.nowrap(answer, "").trim();
      if (resolvePlainAnswer(ans)) {
        for (const char of ans) {
          const index = char.charCodeAt(0) - 65;
          if (options[index] !== void 0) {
            plainOptions.push(options[index]);
            plainOptionIndexes.push(index);
          }
        }
      }
    }
    if (plainOptions.length) {
      return { finish: true, plainOptions: [...new Set(plainOptions)], plainOptionIndexes: [...new Set(plainOptionIndexes)] };
    }
    return { finish: false };
  }
  function disambiguateSimilarOptions(options, ratings, threshold = 0.6) {
    if (options.length <= 1)
      return options;
    const normalized = options.map((o) => normalizeString(removeRedundant(o)));
    const eliminated = /* @__PURE__ */ new Set();
    for (let i = 0; i < options.length; i++) {
      if (eliminated.has(i))
        continue;
      for (let j = i + 1; j < options.length; j++) {
        if (eliminated.has(j))
          continue;
        const pairwise = src.findBestMatch(normalized[i], [normalized[j]]).bestMatch.rating;
        if (pairwise > threshold) {
          if (ratings[i] >= ratings[j]) {
            eliminated.add(j);
          } else {
            eliminated.add(i);
            break;
          }
        }
      }
    }
    return options.filter((_, i) => !eliminated.has(i));
  }
  const CORRECT_WORDS = ["是", "对", "正确", "确定", "√", "对的", "是的", "正确的", "true", "True", "T", "yes", "1"];
  const INCORRECT_WORDS = [
    "非",
    "否",
    "错",
    "错误",
    "×",
    "X",
    "错的",
    "不对",
    "不正确的",
    "不正确",
    "不是",
    "不是的",
    "false",
    "False",
    "F",
    "no",
    "0"
  ];
  function resolveJudgement(answerGroups, options) {
    for (const answers of answerGroups) {
      const answerShowCorrect = answers.find((a) => matches(a, CORRECT_WORDS));
      const answerShowIncorrect = answers.find((a) => matches(a, INCORRECT_WORDS));
      if (answerShowCorrect || answerShowIncorrect) {
        for (const option of options) {
          const textShowCorrect = matches(option, CORRECT_WORDS);
          const textShowIncorrect = matches(option, INCORRECT_WORDS);
          if (answerShowCorrect && textShowCorrect) {
            return { finish: true, option };
          }
          if (answerShowIncorrect && textShowIncorrect) {
            return { finish: true, option };
          }
        }
        return { finish: false };
      }
    }
    return { finish: false };
  }
  function matches(target, words) {
    return words.some(
      (word) => clearString(removeRedundant(word), "√", "×") === clearString(removeRedundant(target), "√", "×")
    );
  }
  function isJudgementOptions(options) {
    if (options.length !== 2)
      return false;
    const hasCorrect = options.some((opt) => matches(opt, CORRECT_WORDS));
    const hasIncorrect = options.some((opt) => matches(opt, INCORRECT_WORDS));
    return hasCorrect && hasIncorrect;
  }
  function resolveCompletion(answerGroups, blankCount, separators) {
    for (const answers of answerGroups) {
      let ans = answers.filter((a) => a);
      if (ans.length === 1) {
        ans = splitAnswer(ans[0], separators);
      }
      if (ans.length !== 0 && (ans.length === blankCount || blankCount === 1)) {
        if (ans.length === blankCount) {
          return { finish: true, answers: ans };
        } else if (blankCount === 1) {
          return { finish: true, answers: [ans.join(" ")] };
        }
      }
    }
    return { finish: false };
  }
  function createDefaultQuestionResolver(ctx) {
    const aiResult = (infos) => infos.map((info) => info.results || []).flat().find((result) => result.extra_data && result.extra_data.ai);
    return {
      async single(infos, options, handler) {
        const optionTexts = options.map((o) => o.innerText);
        const generated = aiResult(infos);
        if (generated) {
          const letter = String(generated.answer || "").trim();
          const index = letter.length === 1 ? letter.charCodeAt(0) - 65 : -1;
          if (!/^[A-Z]$/.test(letter) || index < 0 || index >= options.length) return { finish: false };
          await handler("single", optionTexts[index], options[index], ctx);
          return { finish: true, option: optionTexts[index], optionIndex: index };
        }
        if (isJudgementOptions(optionTexts.map((o) => o.trim()))) {
          const answerGroups = infos.map((info) => info.results.map((res) => res.answer));
          const result2 = resolveJudgement(answerGroups, optionTexts);
          if (result2.finish && result2.option !== void 0) {
            const index = optionTexts.indexOf(result2.option);
            const opt = index !== -1 ? options[index] : options[0];
            await handler("judgement", result2.option, opt, ctx);
          }
          return result2;
        }
        const answers = infos.map((info) => info.results.map((res) => res.answer)).flat();
        const result = resolveSingle(answers, optionTexts, ctx.answerSeparators);
        if (result.finish && result.option !== void 0) {
          const index = Number.isInteger(result.optionIndex) ? result.optionIndex : optionTexts.indexOf(result.option);
          if (index === -1 || !options[index]) throw new Error("单选答案无法唯一对应到页面选项");
          const opt = options[index];
          await handler("single", result.option, opt, ctx);
        }
        return result;
      },
      async multiple(infos, options, handler) {
        var _a;
        const resultAnswers = infos.map((info) => info.results.map((res) => res.answer)).flat();
        const optionTexts = options.map((o) => o.innerText);
        const generated = aiResult(infos);
        if (generated) {
          const letters = String(generated.answer || "").trim();
          const indexes = [...letters].map((letter) => letter.charCodeAt(0) - 65);
          if (!/^[A-Z]+$/.test(letters) || new Set(indexes).size !== indexes.length || indexes.some((index) => index < 0 || index >= options.length)) return { finish: false };
          for (const index of indexes) await handler("multiple", optionTexts[index], options[index], ctx);
          return { finish: true, plainOptions: indexes.map((index) => optionTexts[index]), plainOptionIndexes: indexes };
        }
        const result = resolveMultiple(resultAnswers, optionTexts, ctx.answerSeparators);
        if (result.finish && Array.isArray(result.plainOptionIndexes) && result.plainOptionIndexes.length) {
          for (const index of result.plainOptionIndexes) {
            if (!options[index]) throw new Error("多选答案索引超出页面选项范围");
            await handler("multiple", optionTexts[index], options[index], ctx);
          }
          return result;
        }
        const resolvedOptions = result.finish ? (_a = result.options) != null ? _a : result.plainOptions : void 0;
        if (result.finish && resolvedOptions) {
          for (const resolvedOption of resolvedOptions) {
            const isElement = typeof Element !== "undefined" && resolvedOption instanceof Element;
            const index = isElement ? options.indexOf(resolvedOption) : optionTexts.indexOf(resolvedOption);
            if (index === -1) throw new Error("多选答案无法唯一对应到页面选项");
            const opt = options[index];
            await handler("multiple", optionTexts[index], opt, ctx);
          }
        }
        return result;
      },
      async judgement(infos, options, handler) {
        const answerGroups = infos.map((info) => info.results.map((res) => res.answer));
        const optionTexts = options.map((o) => o.innerText);
        const generated = aiResult(infos);
        if (generated) {
          const answer = String(generated.answer || "").trim();
          let index = /^[A-Z]$/.test(answer) ? answer.charCodeAt(0) - 65 : -1;
          if (index === -1) {
            const words = matches(answer, CORRECT_WORDS) ? CORRECT_WORDS : matches(answer, INCORRECT_WORDS) ? INCORRECT_WORDS : [];
            const candidates = optionTexts.map((text2, optionIndex) => [text2.replace(/^\s*[A-Z][.、:：)）]\s*/i, "").trim(), optionIndex]).filter(([text2]) => matches(text2, words));
            if (candidates.length === 1) index = candidates[0][1];
          }
          if (index < 0 || index >= options.length) return { finish: false };
          await handler("judgement", optionTexts[index], options[index], ctx);
          return { finish: true, option: optionTexts[index], optionIndex: index };
        }
        const result = resolveJudgement(answerGroups, optionTexts);
        if (result.finish && result.option !== void 0) {
          const index = optionTexts.indexOf(result.option);
          const opt = index !== -1 ? options[index] : options[0];
          await handler("judgement", result.option, opt, ctx);
        }
        return result;
      },
      async completion(infos, options, handler) {
        const answerGroups = infos.map((info) => info.results.map((res) => res.answer));
        const result = resolveCompletion(answerGroups, options.length, ctx.answerSeparators);
        if (result.finish && result.answers) {
          for (let i = 0; i < result.answers.length; i++) {
            await handler("completion", result.answers[i], options[i], ctx);
          }
        }
        return result;
      }
    };
  }
  const AI_SECRET_KEY = "ocs-ai-secret-v1";
  const AI_LEGACY_CONFIG_KEY = "ocs-ai-config-v1";
  const AI_CACHE_LIMIT = 200;
  const AI_PROVIDERS = {
    deepseek: { name: "DeepSeek", endpoint: "https://api.deepseek.com/chat/completions", model: "deepseek-v4-flash", needsKey: true },
    openai: { name: "OpenAI", endpoint: "https://api.openai.com/v1/chat/completions", model: "gpt-5", needsKey: true },
    qwen: { name: "Qwen / DashScope", endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", model: "qwen-plus", needsKey: true },
    llama: { name: "本地 llama.cpp", endpoint: "http://127.0.0.1:8080/v1", model: "", needsKey: false },
    custom: { name: "自定义 OpenAI-compatible", endpoint: "", model: "", needsKey: false }
  };
  const DEFAULT_AI_SYSTEM_PROMPT = "你是一台在线课程考试自动答题器，唯一任务是输出题目的标准答案，不做辅导、不写讲解。\n【输出铁律】1. 只输出一个 JSON 对象且只含 answer 字段，禁止 markdown、代码块、注释、寒暄、复述题目，禁止 confidence、explanation、解析、思路等任何多余字段或文字；2. JSON 必须合法：使用双引号、无尾逗号，答案文本内的换行写成 \\n；3. 严格按用户消息给出的题型范式输出，字段、类型、数量不得更改。\n【题型规则】单选题 answer 为单个选项字母（如 \"A\"），只能从给定选项中选择，不得自创选项；多选题 answer 为字母数组（如 [\"A\",\"C\"]），不漏选、不多选；判断题 answer 为 \"正确\" 或 \"错误\"；填空题 answer 为字符串数组，元素个数必须与题目中 ____ 空位数量完全相等，并按从左到右、从上到下顺序一一对应，每个元素只写真正填入该空格的核心词、术语、数字或短语，题干空位前后已经印出的字一律不重复（例：大数据主要来自____世界和____世界，应答 [\"物理\",\"数字\"]，不得答 [\"物理世界\",\"数字世界\"]），一个元素只对应一个空，禁止在一个元素里用顿号或分号罗列多个空，禁止空字符串、null 或缺项；简答与阅读题把完整作答写入 answer 字符串，紧扣教材标准表述、分点作答（点间用 \\n）、控制在 400 字以内，直接给结论要点，不要开场白和总结语；连线题 answer 数组顺序与题目待连线项一致。\n【作答标准】以主流教材的规范术语和定论为准，答案准确、简短、可直接誊抄，数字、英文大小写与单位严格规范；题目信息不足或不确定时，仍给出最可能的标准答案，绝不留空或回答“不知道”；各题相互独立，不引用其他题目，不输出题目以外的任何内容。";
  const aiAnswerCache = new Map();
  const aiInflight = new Map();
  const aiStats = { answered: 0, cacheHits: 0, failed: 0, tokens: 0 };
  const aiStatsElements = /* @__PURE__ */ new Set();
  const aiActiveRequests = new Set();
  const aiRuntimeStatusElements = /* @__PURE__ */ new Set();
  let aiRuntimeStatus = "待命";
  let aiFatalState = { signature: "", message: "" };
  function classifyAIRuntimeStatus(text2) {
    if (/失败|错误|停止|404|鉴权|不可用|跳过|不完整/.test(text2)) return "error";
    if (/正在|重试|扩容|纠正|测试中|检索/.test(text2)) return "busy";
    if (/已获得|命中|成功|已恢复|连通/.test(text2)) return "ok";
    return "idle";
  }
  function setAIRuntimeStatus(status) {
    aiRuntimeStatus = String(status || "待命");
    const state = classifyAIRuntimeStatus(aiRuntimeStatus);
    for (const element of Array.from(aiRuntimeStatusElements)) {
      if (!element.isConnected) aiRuntimeStatusElements.delete(element);
      else {
        element.value = aiRuntimeStatus;
        element.setAttribute("data-ai-state", state);
        element.title = aiRuntimeStatus;
      }
    }
  }
  function formatAIStats() {
    return "已答 " + aiStats.answered + " 题 · 缓存命中 " + aiStats.cacheHits + " · 失败 " + aiStats.failed + (aiStats.tokens ? " · 约 " + aiStats.tokens + " tokens" : "");
  }
  function bumpAIStats(field, amount = 1) {
    aiStats[field] = (aiStats[field] || 0) + amount;
    const text2 = formatAIStats();
    for (const element of Array.from(aiStatsElements)) {
      if (!element.isConnected) aiStatsElements.delete(element);
      else element.value = text2;
    }
  }
  function applyOCSTheme(theme) {
    const host = lib.$elements.wrapper;
    if (!host) return false;
    const value = ["light", "dark"].includes(String(theme)) ? String(theme) : "auto";
    if (value === "auto") host.removeAttribute("data-ocs-theme");
    else host.setAttribute("data-ocs-theme", value);
    return true;
  }
  function initOCSTheme() {
    const read = () => {
      try { return GM_getValue("common.settings.uiTheme", "auto"); } catch { return "auto"; }
    };
    let tries = 0;
    const timer = setInterval(() => {
      if (applyOCSTheme(read()) || ++tries > 60) clearInterval(timer);
    }, 250);
    try {
      GM_addValueChangeListener("common.settings.uiTheme", (_k, _o, value) => applyOCSTheme(value));
    } catch {}
  }
  // 在关闭的 Shadow DOM 内按 id 查找设置项（document.getElementById 查不到面板内元素）
  function ocsPanelById(id) {
    const root2 = lib.$elements.root;
    return root2 && typeof root2.getElementById === "function" && root2.getElementById(id) || document.getElementById(id);
  }
  // 同名定时器只保留一个，防止 SPA 页面重复初始化时叠加
  const ocsNamedIntervals = new Map();
  function ocsSingletonInterval(name, handler, ms) {
    const previous = ocsNamedIntervals.get(name);
    if (previous) clearInterval(previous);
    const id = setInterval(handler, ms);
    ocsNamedIntervals.set(name, id);
    return id;
  }
  // ==================== AI 持久化答案缓存（IndexedDB，按域名隔离） ====================
  const AI_PCACHE_DB = "ocs-ai-answer-cache";
  const AI_PCACHE_LIMIT = 3000;
  const AI_PCACHE_TTL = 30 * 24 * 3600 * 1e3;
  let aiPCacheDbPromise = null;
  function aiPCacheDb() {
    if (aiPCacheDbPromise) return aiPCacheDbPromise;
    aiPCacheDbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") return reject(new Error("IndexedDB 不可用"));
      const request2 = indexedDB.open(AI_PCACHE_DB, 1);
      request2.onupgradeneeded = () => {
        const db = request2.result;
        if (!db.objectStoreNames.contains("answers")) db.createObjectStore("answers", { keyPath: "k" }).createIndex("t", "t");
      };
      request2.onsuccess = () => resolve(request2.result);
      request2.onerror = () => reject(request2.error);
    }).catch((error) => { aiPCacheDbPromise = null; throw error; });
    return aiPCacheDbPromise;
  }
  async function aiPCacheKey(raw) {
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
      return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch { return raw; }
  }
  async function aiPCacheGet(raw) {
    try {
      const db = await aiPCacheDb();
      const k = await aiPCacheKey(raw);
      const row = await new Promise((resolve, reject) => {
        const req = db.transaction("answers", "readonly").objectStore("answers").get(k);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      if (!row || Date.now() - row.t > AI_PCACHE_TTL) return void 0;
      return row.v;
    } catch { return void 0; }
  }
  let aiPCacheWrites = 0;
  async function aiPCacheSet(raw, value) {
    try {
      const db = await aiPCacheDb();
      const k = await aiPCacheKey(raw);
      const tx = db.transaction("answers", "readwrite");
      const store2 = tx.objectStore("answers");
      store2.put({ k, v: value, t: Date.now() });
      if (++aiPCacheWrites % 50 === 0) {
        const countReq = store2.count();
        countReq.onsuccess = () => {
          let excess = countReq.result - AI_PCACHE_LIMIT;
          if (excess <= 0) return;
          store2.index("t").openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor || excess-- <= 0) return;
            cursor.delete();
            cursor.continue();
          };
        };
      }
    } catch {}
  }
  async function aiPCacheClear() {
    aiAnswerCache.clear();
    const db = await aiPCacheDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("answers", "readwrite");
      tx.objectStore("answers").clear();
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }
  function readLegacyAIConfig() {
    try { return JSON.parse(GM_getValue(AI_LEGACY_CONFIG_KEY, "{}") || "{}"); } catch { return {}; }
  }
  const legacyAIConfig = readLegacyAIConfig();
  function getAISecret() {
    return String(GM_getValue(AI_SECRET_KEY, "") || "");
  }
  function setAISecret(value) {
    const secret = String(value || "").trim();
    if (secret) GM_setValue(AI_SECRET_KEY, secret);
    else GM_deleteValue(AI_SECRET_KEY);
    if (GM_getValue(AI_LEGACY_CONFIG_KEY, void 0) !== void 0) GM_deleteValue(AI_LEGACY_CONFIG_KEY);
    aiFatalState = { signature: "", message: "" };
    aiAnswerCache.clear();
  }
  function redactAISecret(value) {
    let text2 = String(value == null ? "" : value);
    for (const secret of [getAISecret(), String(legacyAIConfig.apiKey || "")].filter(Boolean)) {
      text2 = text2.split(secret).join("[已遮罩]");
    }
    return text2.replace(/Bearer\s+[A-Za-z0-9._~+\/-]{8,}/gi, "Bearer [已遮罩]");
  }
  function redactAILogValue(value) {
    if (value == null) return value;
    if (typeof value === "string") return redactAISecret(value);
    try { return JSON.parse(redactAISecret(JSON.stringify(value))); } catch { return "[无法安全记录]"; }
  }
  function isRemovedConfigKey(key) {
    const settingsPrefix = "common.settings.";
    return [
      settingsPrefix + "answerer" + "Wrappers", settingsPrefix + "disabledAnswerer" + "WrapperNames",
      settingsPrefix + "answerer" + "WrappersButton", settingsPrefix + "enableQuestion" + "Caches",
      settingsPrefix + "answerWrapper" + "HandlerTimeout", "common.apps.localQuestion" + "Caches"
    ].includes(String(key));
  }
  function isExcludedFromSettingsTransfer(key) {
    return key === AI_SECRET_KEY || key === AI_LEGACY_CONFIG_KEY || key === "render.console.logs" || isRemovedConfigKey(key);
  }
  function migrateLegacyAIStorage() {
    if (GM_getValue(AI_LEGACY_CONFIG_KEY, void 0) !== void 0) {
      const mappings = {
        provider: "aiProvider", endpoint: "aiEndpoint", model: "aiModel",
        temperature: "aiTemperature", maxTokens: "aiMaxTokens", systemPrompt: "aiSystemPrompt"
      };
      for (const source of Object.keys(mappings)) {
        const target = "common.settings." + mappings[source];
        if (legacyAIConfig[source] !== void 0 && GM_getValue(target, void 0) === void 0) GM_setValue(target, legacyAIConfig[source]);
      }
      if (!GM_getValue(AI_SECRET_KEY, "") && legacyAIConfig.apiKey) GM_setValue(AI_SECRET_KEY, legacyAIConfig.apiKey);
      GM_deleteValue(AI_LEGACY_CONFIG_KEY);
    }
    for (const key of GM_listValues()) if (isRemovedConfigKey(key)) GM_deleteValue(key);
    const oldUploadMode = GM_getValue("common.settings.upload", void 0);
    if (oldUploadMode !== void 0 && !Number.isFinite(Number(oldUploadMode))) GM_deleteValue("common.settings.upload");
  }
  function resolveAIRequestEndpoint(provider, endpoint) {
    const raw = String(endpoint || "").trim();
    if (provider !== "llama") return raw;
    try {
      const url = new URL(raw);
      if (["/", "/v1", "/v1/"].includes(url.pathname)) {
        url.pathname = "/v1/chat/completions";
        return url.href;
      }
    } catch {}
    return raw;
  }
  function getAISettings() {
    const config = CommonProject.scripts.settings.cfg;
    const provider = String(config.aiProvider || "deepseek");
    const profile = AI_PROVIDERS[provider] || AI_PROVIDERS.custom;
    const local = provider === "llama";
    const localMaxTokens = Number(config.aiLocalMaxTokens);
    const timeout = Number(local ? config.aiLocalTimeout : config.aiTimeout);
    const retries = Number(local ? config.aiLocalRetries : config.aiRetries);
    return {
      provider, providerName: profile.name,
      endpoint: resolveAIRequestEndpoint(provider, config.aiEndpoint != null ? config.aiEndpoint : profile.endpoint || ""),
      model: String(config.aiModel != null ? config.aiModel : profile.model || "").trim(),
      apiKey: getAISecret(),
      temperature: Number(config.aiTemperature != null ? config.aiTemperature : 0.1),
      maxTokens: local ? Math.max(64, Math.min(4096, Number.isFinite(localMaxTokens) && localMaxTokens > 0 ? localMaxTokens : 256)) : Math.max(256, Math.min(16384, Number.isFinite(Number(config.aiMaxTokens)) && Number(config.aiMaxTokens) > 0 ? Number(config.aiMaxTokens) : 4096)),
      timeout: Math.max(local ? 30 : 10, Math.min(local ? 1800 : 300, Number.isFinite(timeout) && timeout > 0 ? timeout : local ? 300 : 90)),
      retries: Math.max(0, Math.min(2, Math.floor(Number.isFinite(retries) ? retries : local ? 0 : 2))),
      visionMode: String(config.aiVisionMode || "auto"),
      persistentCache: config.aiPersistentCache !== false,
      kbEnabled: Boolean(config.aiKbEnabled),
      kbTopK: Math.max(1, Math.min(15, Number.isFinite(Number(config.aiKbTopK)) && Number(config.aiKbTopK) > 0 ? Number(config.aiKbTopK) : 5)),
      kbContextChars: Math.max(500, Math.min(12000, Number.isFinite(Number(config.aiKbContextChars)) && Number(config.aiKbContextChars) > 0 ? Number(config.aiKbContextChars) : 3000)),
      kbApiBase: String(config.aiKbApiBase || "").trim(),
      kbApiKey: String(config.aiKbApiKey || "").trim(),
      kbLibs: parseKbLibIds(config.aiKbLibs),
      systemPrompt: String(config.aiSystemPrompt || DEFAULT_AI_SYSTEM_PROMPT)
    };
  }
  function getAIConfigError() {
    const config = getAISettings();
    const profile = AI_PROVIDERS[config.provider] || AI_PROVIDERS.custom;
    if (!config.endpoint) return "请先配置 AI Endpoint";
    try {
      const url = new URL(config.endpoint);
      if (!["http:", "https:"].includes(url.protocol)) return "AI Endpoint 只允许 HTTP 或 HTTPS";
    } catch { return "AI Endpoint 格式不正确"; }
    if (!config.model) return "请先配置 AI 模型名称";
    if (profile.needsKey && !config.apiKey) return "请先配置 AI API Key";
    return "";
  }
  function displayAIEndpointPath(endpoint) {
    try {
      const url = new URL(endpoint);
      return url.origin + url.pathname;
    } catch { return "[地址无效]"; }
  }
  function abortAllAIRequests() {
    for (const request2 of Array.from(aiActiveRequests)) {
      try { request2.abort(); } catch {}
    }
    aiActiveRequests.clear();
    setAIRuntimeStatus("已停止未完成的 AI 请求");
  }
  function collectQuestionImages(root2) {
    if (!root2 || typeof root2.querySelectorAll !== "function") return [];
    const images = [];
    const seen = new Set();
    for (const img of Array.from(root2.querySelectorAll("img"))) {
      const width = Number(img.naturalWidth || img.width || 0);
      const height = Number(img.naturalHeight || img.height || 0);
      if (width > 0 && height > 0 && width <= 32 && height <= 32) continue;
      for (const value of [img.getAttribute("data-src"), img.currentSrc, img.getAttribute("src"), img.src].map((item) => String(item || "").trim())) {
        if (!value || /(avatar|logo|loading|icon)[./_-]/i.test(value)) continue;
        try {
          const url = new URL(value, location.href);
          if (!["http:", "https:", "data:"].includes(url.protocol) || seen.has(url.href)) continue;
          seen.add(url.href);
          images.push(url.href);
        } catch {}
      }
    }
    return images.slice(0, 8);
  }
  function modelSupportsVision(config) {
    if (config.visionMode === "enabled") return true;
    if (config.visionMode === "disabled") return false;
    const model = config.model.toLowerCase();
    if (config.provider === "openai") return /^(gpt-[45]|o[1-9]|chatgpt)/.test(model);
    if (config.provider === "deepseek") return /vision/.test(model);
    if (config.provider === "qwen") return /(^|[-_])(vl|omni)([-_]|$)/.test(model);
    return false;
  }
  function normalizeAIOptions(options) {
    const source = Array.isArray(options) ? options : String(options || "").split("\n");
    return source.map((item) => String(item || "").trim()).filter(Boolean);
  }
  function answerValueToLetter(value, options) {
    const raw = String(value || "").replace(/[Ａ-Ｚａ-ｚ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 65248)).trim();
    const compact = raw.toUpperCase().replace(/[\s,，.。．、#;；|/]+/g, "");
    if (/^[A-Z]+$/.test(compact)) return compact;
    const normalized = clearString(removeRedundant(raw));
    const indexes = options.map((option, index) => [option, index]).filter(
      ([option]) => clearString(removeRedundant(option.replace(/^\s*[A-Z][.、:：)）]\s*/i, ""))) === normalized
    ).map(([, index]) => index);
    return indexes.length === 1 ? String.fromCharCode(65 + indexes[0]) : "";
  }
  function aiSoftError(message, soft) {
    const error = new Error(message);
    error.soft = soft;
    return error;
  }
  function flattenAIAnswerValues(value, out = []) {
    if (value == null) return out;
    if (Array.isArray(value)) {
      for (const item of value) flattenAIAnswerValues(item, out);
      return out;
    }
    if (typeof value === "object") {
      const nested = value.answer !== void 0 ? value.answer : value.text !== void 0 ? value.text : value.content !== void 0 ? value.content : value.value;
      if (nested !== void 0) return flattenAIAnswerValues(nested, out);
      return out;
    }
    out.push(value);
    return out;
  }
  function stripFillItemNumbering(text) {
    return String(text == null ? "" : text)
      .replace(/^\s*(?:第\s*[0-9一二三四五六七八九十]+\s*空|（\s*\d+\s*）|\(\s*\d+\s*\)|[0-9]+|[①-⑳])\s*[\.、．:：)）\-]?\s*/, "")
      .trim();
  }
  function splitFillBlankAnswers(raw, expected = 0) {
    let text = String(raw == null ? "" : raw).trim();
    if (!text) return [];
    try {
      const parsedJson = JSON.parse(text);
      if (Array.isArray(parsedJson)) return parsedJson.map((item) => stripFillItemNumbering(String(item == null ? "" : item).trim())).filter(Boolean);
    } catch {}
    text = text.replace(/^[\s\S]{0,40}?(?:参考答案|标准答案|答案)\s*[:：]\s*/, "").trim();
    const numbered = text.match(/(?:^|\n)\s*(?:第\s*[0-9一二三四五六七八九十]+\s*空|[（(]\s*\d+\s*[)）]|[0-9]+|[①-⑳])\s*[\.、．:：)）]?\s*([^\n]+)/g);
    let parts;
    if (numbered && numbered.length >= 2) {
      parts = numbered.map((line) => line.replace(/^\s*(?:第\s*[0-9一二三四五六七八九十]+\s*空|[（(]\s*\d+\s*[)）]|[0-9]+|[①-⑳])\s*[\.、．:：)）]?\s*/, "").trim());
    } else {
      parts = text.split(/\s*[、；;｜|]\s*|\s*#{1,3}\s*|\s*={3,}\s*|\s*-{3,}\s*|\s*\n+\s*/);
      if (expected > 1 && parts.length < expected) {
        const byComma = text.split(/\s*，\s*/);
        if (byComma.length === expected) parts = byComma;
      }
      if (expected > 1 && parts.length < expected) {
        const bySpace = text.split(/\s{2,}|\t+/);
        if (bySpace.length === expected) parts = bySpace;
      }
    }
    return parts.map((item) => stripFillItemNumbering(String(item || "").trim())).filter(Boolean);
  }
  function trimBlankAnswerAffixes(answer, title, blankIndex) {
    const original = String(answer == null ? "" : answer).trim();
    let text = original;
    const segments = String(title || "").split(/_{2,}/);
    if (segments.length >= blankIndex + 2) {
      const after = segments[blankIndex + 1] || "";
      const suffixMatch = after.match(/^[一-龥A-Za-z0-9]{2,4}?(?=[和与及或，。、；;,\s:：）)]|$)/);
      if (suffixMatch && suffixMatch[0].length >= 2 && text.length > suffixMatch[0].length && text.endsWith(suffixMatch[0])) {
        text = text.slice(0, -suffixMatch[0].length).trim();
      }
    }
    text = text.replace(/^(?:来自|是指|是|为|有|指|即|包括|包含|分为|属于|简称|全称)\s*/, "").trim();
    return text || original;
  }
  function normalizeAIResult(parsed, env) {
    const type = String(env.type || "unknown");
    const options = normalizeAIOptions(env.options);
    let answer = parsed && parsed.answer !== void 0 ? parsed.answer : parsed && parsed.answers;
    if (["completion", "fill", "fill-blank", "line", "reader"].includes(type)) {
      let cleaned = flattenAIAnswerValues(answer)
        .map((item) => String(item == null ? "" : item).trim())
        .filter((item) => item && !/^(null|undefined|none|n\/a|无答案|未作答|不知道)$/i.test(item))
        .map(stripFillItemNumbering)
        .filter(Boolean);
      if (!cleaned.length) throw aiSoftError("模型没有返回有效填空答案", "empty");
      const optionCount = Array.isArray(env.options) ? env.options.length : 0;
      const expected = Number(env.blankCount || (type === "completion" ? optionCount : 0) || 0);
      if (type === "completion" && expected <= 1) {
        answer = cleaned.join("\n");
      } else if (expected > 0 && ["completion", "fill-blank", "fill"].includes(type)) {
        if (cleaned.length === 1 && expected > 1) cleaned = splitFillBlankAnswers(cleaned[0], expected);
        if (cleaned.length > expected) {
          cleaned = cleaned.slice(0, expected - 1).concat([cleaned.slice(expected - 1).join("、")]);
        }
        if (cleaned.length < expected) {
          const countError = aiSoftError("模型返回的填空答案数量（" + cleaned.length + "）与页面空格数量（" + expected + "）不一致", "count");
          countError.got = cleaned.length;
          countError.expected = expected;
          throw countError;
        }
        cleaned = cleaned.map((item, index) => trimBlankAnswerAffixes(item, env.title, index));
        answer = cleaned.join("#");
      } else {
        answer = cleaned.join("#");
      }
    } else if (type === "single" || type === "multiple") {
      if (!options.length || options.length > 26) throw new Error("选择题选项数量无法安全映射为字母");
      const values = (Array.isArray(answer) ? answer : [answer]).map((value) => answerValueToLetter(value, options));
      if (values.some((value) => !value)) throw new Error("模型答案未能唯一对应到页面选项");
      const letters = values.join("");
      if (![...letters].every((letter) => /^[A-Z]$/.test(letter) && letter.charCodeAt(0) - 65 < options.length)) throw new Error("模型返回非法或越界的选项字母");
      const unique = Array.from(new Set(letters.split(""))).sort();
      if (type === "single" && unique.length !== 1) throw new Error("单选答案必须且只能对应一个有效选项");
      if (type === "multiple" && !unique.length) throw new Error("多选答案没有对应到有效选项");
      answer = unique.join("");
    } else if (type === "judgement") {
      if (typeof answer === "boolean") answer = answer ? "正确" : "错误";
      else {
        const letter = answerValueToLetter(answer, options);
        if (letter.length === 1 && letter.charCodeAt(0) - 65 < options.length) answer = letter;
        else {
          const normalized = String(answer || "").trim();
          if (!CORRECT_WORDS.concat(INCORRECT_WORDS).some((word) => matches(normalized, [word]))) throw new Error("判断题答案必须为正确、错误或有效选项");
          answer = normalized;
        }
      }
    } else {
      throw new Error("无法安全识别题型，当前题目不发送 AI 答案");
    }
    const value = Number(parsed && parsed.confidence);
    return {
      answer: String(answer),
      confidence: Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : void 0,
      explanation: String(parsed && parsed.explanation || "").trim()
    };
  }
  function buildAIQuestionPrompt(env) {
    const names = { single: "单选题", multiple: "多选题", judgement: "判断题", completion: "填空/简答题", fill: "填空题", "fill-blank": "填空题", line: "连线题", reader: "阅读/简答题" };
    const type = String(env.type || "unknown");
    const options = normalizeAIOptions(env.options);
    const optionText = options.map((option, index) => String.fromCharCode(65 + index) + ". " + option).join("\n");
    const blankCount = Number(env.blankCount || 0);
    const lines = [
      "请直接给出下面学习题的答案，不要解释、不要分析、不要复述题目。",
      "题型：" + (names[type] || type || "未知"),
      "题目：" + String(env.title || "").trim()
    ];
    if (blankCount > 0) lines.push("填空数量：" + blankCount + "（题目中的 ____ 表示一个空位，空位从左到右、从上到下的顺序即答案顺序）");
    lines.push(optionText ? "选项：\n" + optionText : "无选项，请直接给出答案。");
    lines.push("");
    lines.push("严格只输出一个 JSON 对象，且只包含 answer 字段：禁止 markdown 代码块（```）、注释、confidence、explanation、解析以及 JSON 以外的任何文字；字符串内换行写成 \\n。");
    if (type === "single") {
      lines.push('格式：{"answer":"A"}');
      lines.push("answer 只能是一个选项字母。");
    } else if (type === "multiple") {
      lines.push('格式：{"answer":["A","C"]}');
      lines.push("answer 为所有正确选项字母组成的数组。");
    } else if (type === "judgement") {
      lines.push('格式：{"answer":"正确"}');
      lines.push("answer 只能填 “正确” 或 “错误”（或该选项对应的字母）。");
    } else if (type === "fill-blank" || type === "fill") {
      if (blankCount > 0) {
        lines.push('格式：{"answer":' + JSON.stringify(Array.from({ length: blankCount }, (_, index) => "第" + (index + 1) + "空答案")) + "}");
        lines.push("answer 必须是字符串数组，长度必须恰好为 " + blankCount + "，与空位一一对应；");
      } else {
        lines.push('格式：{"answer":["第1空答案","第2空答案"]}');
        lines.push("answer 为字符串数组，每个空位一个元素，顺序与空位一致；");
      }
      lines.push("每个元素只填要誊进空格中的核心词（简短的教材术语、数字或短语）；题干空格前后已经印出的字词绝不能重复。例如“大数据主要来自____世界和____世界”，answer 应为 [\"物理\",\"数字\"]，而不是 [\"物理世界\",\"数字世界\"]；");
      lines.push("一个数组元素只对应一个空，不要在一个元素里用顿号或分号枚举多个空；即使不确定也必须给出最可能的答案，禁止空字符串、null 或漏项。");
    } else if (type === "completion") {
      if (blankCount > 1) {
        lines.push('格式：{"answer":' + JSON.stringify(Array.from({ length: blankCount }, (_, index) => "第" + (index + 1) + "空答案")) + "}");
        lines.push("answer 数组长度必须恰好为 " + blankCount + "，每空只填核心词，题干已有的字词不要重复，禁止空项。");
      } else {
        lines.push('格式：{"answer":"完整作答文本，分点时用\\n换行"}');
        lines.push("这是简答题：把完整作答直接写入 answer，紧扣教材、分点作答、控制在 400 字以内，不要写解析和客套话。");
      }
    } else if (type === "reader") {
      lines.push('格式：{"answer":"完整作答文本，分点时用\\n换行"}');
      lines.push("紧扣题目与材料作答，分点简明，不要写解析。");
    } else if (type === "line") {
      lines.push('格式：{"answer":["第1项对应答案","第2项对应答案"]}');
      lines.push("answer 数组顺序与题目待连线项的顺序保持一致。");
    } else {
      lines.push('格式：{"answer":"A"}');
    }
    return lines.join("\n");
  }
  function extractBalancedJsonSlices(text) {
    const source = String(text || "");
    const slices = [];
    const closing = { "{": "}", "[": "]" };
    const quotes = ['"', "'", "“", "”", "‘", "’"];
    for (let i = 0; i < source.length; i++) {
      const open = source[i];
      if (open !== "{" && open !== "[") continue;
      const stack = [closing[open]];
      let inString = false, quoteChar = "", escaped = false;
      for (let j = i + 1; j < source.length; j++) {
        const c = source[j];
        if (inString) {
          if (escaped) { escaped = false; continue; }
          if (c === "\\") { escaped = true; continue; }
          if (c === quoteChar) inString = false;
          continue;
        }
        if (quotes.includes(c)) { inString = true; quoteChar = c; continue; }
        if (c === "{" || c === "[") stack.push(closing[c]);
        else if (c === "}" || c === "]") {
          if (c === stack[stack.length - 1]) {
            stack.pop();
            if (!stack.length) {
              slices.push(source.slice(i, j + 1));
              i = j;
              break;
            }
          }
        }
      }
    }
    return slices;
  }
  function repairJsonCandidate(input) {
    const source = String(input || "");
    let out = "";
    let inString = false, quoteChar = "", escaped = false;
    for (let k = 0; k < source.length; k++) {
      const c = source[k];
      if (inString) {
        if (escaped) { out += c; escaped = false; continue; }
        if (c === "\\") { out += c; escaped = true; continue; }
        if (c === quoteChar) { out += '"'; inString = false; continue; }
        if (c === '"') { out += '\\"'; continue; }
        if (c === "\n") { out += "\\n"; continue; }
        if (c === "\r") { out += "\\r"; continue; }
        if (c === "\t") { out += "\\t"; continue; }
        out += c;
        continue;
      }
      if (['"', "'", "“", "”", "‘", "’"].includes(c)) { inString = true; quoteChar = c; out += '"'; continue; }
      out += c;
    }
    return out.replace(/([{,]\s*)([A-Za-z_$][\w$\-.]*)(\s*):/g, '$1"$2"$3').replace(/,\s*([}\]])/g, "$1");
  }
  function closeTruncatedJson(input) {
    let s = String(input || "");
    const startMatch = s.match(/[\[{]/);
    if (!startMatch) return s;
    s = s.slice(startMatch.index);
    s = s.replace(/,\s*(?:"(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|[\w$一-龥]+)\s*:\s*$/, "");
    const stack = [];
    let inString = false, quoteChar = "", escaped = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inString) {
        if (escaped) { escaped = false; continue; }
        if (c === "\\") { escaped = true; continue; }
        if (c === quoteChar) inString = false;
        continue;
      }
      if (['"', "'", "“", "”", "‘", "’"].includes(c)) { inString = true; quoteChar = c; continue; }
      if (c === "{" || c === "[") stack.push(c === "{" ? "}" : "]");
      else if (c === "}" || c === "]") {
        const expected = c === "}" ? "}" : "]";
        if (stack[stack.length - 1] === expected) stack.pop();
      }
    }
    if (inString) s += '"';
    s = s.replace(/,\s*$/, "");
    while (stack.length) s += stack.pop();
    return s;
  }
  function unquoteJsonishString(value) {
    let text = String(value == null ? "" : value).trim();
    if (!text) return "";
    if (/^["'“‘]/.test(text)) text = text.slice(1);
    if (/["'”’]$/.test(text)) text = text.slice(0, -1);
    return text.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\(["'\\/])/g, "$1");
  }
  function salvageAnswerFields(text, env) {
    const source = String(text || "");
    const keyMatch = source.match(/["']?\s*(answers?|ans|答案)\s*["']?\s*[:：]/);
    if (!keyMatch) return null;
    const after = source.slice(keyMatch.index + keyMatch[0].length);
    let answer;
    if (after.trim().startsWith("[")) {
      const closeIndex = after.indexOf("]");
      const fragment = closeIndex >= 0 ? after.slice(1, closeIndex) : after.slice(1);
      const quoted = Array.from(fragment.matchAll(/["'“‘]([^"'“”‘’\\]*(?:\\.[^"'“”‘’\\]*)*)["'”’]?/g)).map((match) => unquoteJsonishString(match[0])).filter((item) => item.trim() !== "");
      if (quoted.length) {
        answer = quoted;
      } else {
        const bare = fragment.split(",").map((item) => item.trim()).filter(Boolean).filter((item) => /^(true|false|null|-?\d+(?:\.\d+)?|[A-Za-z0-9_+\-./]+)$/.test(item));
        if (bare.length) answer = bare.map((item) => /^-?\d/.test(item) ? Number(item) : item);
      }
    } else {
      const stringMatch = after.match(/^\s*("(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|“[^”\n]*”?)/);
      if (stringMatch) {
        answer = unquoteJsonishString(stringMatch[0]);
      } else {
        const bareMatch = after.match(/^\s*(true|false|null|-?\d+(?:\.\d+)?|[A-Za-z][A-Za-z0-9_\s.]{0,40}?)(?=\s*[,}\]]|\s*\n|$)/);
        if (bareMatch) answer = /^-?\d/.test(bareMatch[1]) ? Number(bareMatch[1]) : bareMatch[1].trim();
      }
    }
    if (answer === void 0) return null;
    const result = { answer };
    const confidenceMatch = source.match(/"?\s*confidence\s*"?\s*[:：]\s*([0-9]+(?:\.[0-9]+)?)/);
    if (confidenceMatch) result.confidence = Number(confidenceMatch[1]);
    const explanationMatch = source.match(/"?\s*explanation\s*"?\s*[:：]\s*("(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|“[^”\n]*”?)/);
    if (explanationMatch) result.explanation = unquoteJsonishString(explanationMatch[1]);
    return result;
  }
  function salvagePlainTextAnswer(raw, env) {
    const type = String((env && env.type) || "");
    let text = String(raw || "").replace(/```[a-zA-Z]*|```/g, "").trim();
    if (!text) return null;
    const lead = text.match(/^\s*(?:【?参考答案】?|标准答案|答案|Answer)\s*[:：]\s*/i);
    if (lead) text = text.slice(lead[0].length).trim();
    if (["single", "multiple", "judgement"].includes(type)) {
      if (/^\s*(正确|对的?|√|true|yes)\b/i.test(text)) return { answer: "正确" };
      if (/^\s*(错误|错的?|×|false|no)\b/i.test(text)) return { answer: "错误" };
      let letterMatch = text.match(/(?:答案|选择|选|answer)\s*[:：]?\s*([A-Z](?:\s*[,，、;；/\s]\s*[A-Z])*)/i);
      if (!letterMatch) letterMatch = text.match(/^\s*([A-Z](?:\s*[,，、;；/]\s*[A-Z])*)\s*(?:\n|$)/);
      if (letterMatch) {
        const letters = letterMatch[1].toUpperCase().match(/[A-Z]/g);
        if (letters && letters.length) return { answer: letters.join("") };
      }
      if (type === "judgement") {
        const wordMatch = text.match(/正确|错误/);
        if (wordMatch) return { answer: wordMatch[0] };
      }
      return null;
    }
    const expected = Number((env && env.blankCount) || 0) || (type === "completion" && Array.isArray(env && env.options) ? env.options.length : 0);
    if (["fill-blank", "fill", "line"].includes(type) || (type === "completion" && expected > 1)) {
      const parts = splitFillBlankAnswers(text, expected);
      if (parts.length) return { answer: parts };
      return null;
    }
    return { answer: text };
  }
  function parseAIResponse(raw, env) {
    const fence = String.fromCharCode(96).repeat(3);
    let text2 = String(raw || "").replace(new RegExp(fence + "[a-zA-Z]*", "g"), "").replace(new RegExp(fence, "g"), "").trim();
    if (!text2) throw aiSoftError("模型没有返回内容", "empty");
    const tryParse = (candidate) => { try { return JSON.parse(candidate); } catch { return void 0; } };
    let parsed = tryParse(text2);
    if (parsed !== void 0) return parsed;
    const slices = extractBalancedJsonSlices(text2).sort((a, b) => b.length - a.length);
    for (const slice of slices) {
      parsed = tryParse(slice) || tryParse(repairJsonCandidate(slice));
      if (parsed !== void 0) return parsed;
    }
    const closed = closeTruncatedJson(text2);
    if (closed && closed !== text2) {
      parsed = tryParse(closed) || tryParse(repairJsonCandidate(closed));
      if (parsed !== void 0) return parsed;
      for (const slice of extractBalancedJsonSlices(closed).sort((a, b) => b.length - a.length)) {
        parsed = tryParse(slice) || tryParse(repairJsonCandidate(slice));
        if (parsed !== void 0) return parsed;
      }
    }
    const fieldSalvage = salvageAnswerFields(text2, env);
    if (fieldSalvage) return fieldSalvage;
    const plainSalvage = salvagePlainTextAnswer(text2, env);
    if (plainSalvage) return plainSalvage;
    throw aiSoftError("模型返回的 JSON 格式无效", "json");
  }
  function aiRequest(url, body, headers, timeoutSeconds, method = "POST") {
    return new Promise((resolve, reject) => {
      let finished = false;
      let requestHandle;
      let cancellation;
      let retryAfterSeconds = 0;
      const cleanup = () => cancellation && aiActiveRequests.delete(cancellation);
      const fail = (message, status = 0, retriable = false) => {
        if (finished) return;
        finished = true;
        cleanup();
        const error = new Error(redactAISecret(message));
        error.status = status;
        error.retriable = retriable;
        if (retryAfterSeconds) error.retryAfter = retryAfterSeconds;
        reject(error);
      };
      requestHandle = GM_xmlhttpRequest({
        url, method, headers, data: body === void 0 ? void 0 : JSON.stringify(body), responseType: "json",
        timeout: Math.max(10, timeoutSeconds) * 1e3,
        onload(response) {
          if (finished) return;
          let data = response.response;
          if (!data && response.responseText) {
            try { data = JSON.parse(response.responseText); } catch { data = response.responseText; }
          }
          if (response.status >= 200 && response.status < 300) {
            finished = true;
            cleanup();
            resolve(data);
            return;
          }
          const apiMessage = data && typeof data === "object" ? data.error && data.error.message || data.message : response.responseText;
          const retryAfterMatch = /(?:^|\n)\s*retry-after\s*:\s*([^\r\n]+)/i.exec(String(response.responseHeaders || ""));
          if (retryAfterMatch) {
            const value = retryAfterMatch[1].trim();
            const seconds = /^\d+(\.\d+)?$/.test(value) ? Number(value) : (Date.parse(value) - Date.now()) / 1e3;
            if (Number.isFinite(seconds) && seconds > 0) retryAfterSeconds = Math.min(60, seconds);
          }
          fail("HTTP " + response.status + (apiMessage ? "：" + String(apiMessage).slice(0, 300) : ""), response.status, response.status === 408 || response.status === 429 || response.status >= 500);
        },
        onerror() { fail("AI 网络请求失败", 0, true); },
        ontimeout() { fail("AI 请求超时", 408, true); },
        onabort() { fail("AI 请求已取消", 0, false); }
      });
      if (requestHandle && typeof requestHandle.abort === "function") {
        cancellation = { abort() {
          try { requestHandle.abort(); } finally { fail("AI 请求已取消", 0, false); }
        } };
        if (!finished) aiActiveRequests.add(cancellation);
      }
    });
  }
  function providerThinkingConfig(config) {
    const model = String(config.model || "").toLowerCase();
    if (config.provider === "deepseek" && /v4|flash/.test(model)) return { key: "thinking", value: { type: "disabled" } };
    if (config.provider === "qwen" && /qwen3/.test(model)) return { key: "enable_thinking", value: false };
    return null;
  }
  function extractMessageText(choice, data) {
    const message = choice && choice.message || {};
    let raw = message.content;
    if (raw == null) raw = choice && choice.text != null ? choice.text : data && data.output_text;
    if (Array.isArray(raw)) {
      raw = raw.map((part) => typeof part === "string" ? part : part && (part.text || part.content) || "").join("\n");
    }
    return String(raw == null ? "" : raw);
  }
  function appendPayloadInstruction(payload, instruction) {
    const message = payload.messages && payload.messages[payload.messages.length - 1];
    if (!message) return;
    const suffix = "\n【补充要求·必须遵守】" + instruction;
    if (typeof message.content === "string") {
      message.content = message.content + suffix;
    } else if (Array.isArray(message.content)) {
      const textPart = message.content.find((part) => part && part.type === "text");
      if (textPart) textPart.text = textPart.text + suffix;
    }
  }
  function growPayloadTokens(payload, minimum) {
    const current = Number(payload.max_tokens) || 1200;
    const grown = Math.max(current * 2, Number(minimum) || 0);
    payload.max_tokens = Math.max(256, Math.min(16384, Math.floor(grown)));
  }
  function matchUnsupportedParam(error, payload) {
    const message = String((error && error.message) || "").toLowerCase();
    const candidates = ["response_format", "thinking", "enable_thinking", "reasoning_effort", "temperature"];
    for (const param of candidates) {
      if (payload[param] === void 0) continue;
      const pattern = param === "enable_thinking" ? /enable[ _]?thinking/ : new RegExp(param.replace(/_/g, "[ _]?"), "i");
      if (pattern.test(message) && /unknown|unsupported|unrecognized|not\s*support|invalid|illegal|不支持|无法识别|未识别|非法|无效|参数/.test(message)) return param;
    }
    if (payload.response_format && /json_object|response[ _]?format|json\s*mode/i.test(message) && /not\s*support|unsupported|invalid|不支持|非法|无效/.test(message)) return "response_format";
    return null;
  }
  function makeAIInfo(config, env, result, error) {
    let homepage = "#";
    try { homepage = new URL(config.endpoint).origin; } catch {}
    return {
      url: config.endpoint, name: "AI · " + config.providerName, homepage,
      results: result ? [{ question: String(env.title || ""), answer: result.answer, extra_data: {
        ai: true, confidence: result.confidence, explanation: result.explanation, model: config.model
      } }] : [],
      response: void 0, data: void 0, error: error ? redactAISecret(error.message || error) : void 0
    };
  }
  // ==================== AI 知识库（API 接入，ai.16） ====================
  // 知识库改为自建后端服务：脚本只通过 API 拉取库列表与检索结果，不再本地解析/存储资料。
  // UI 可勾选哪些后端库参与答题（参照腾讯 ima 的知识库选择器）。
  // 接口约定见仓库 README：GET {base}/api/kb/libs 、POST {base}/api/kb/search
  const kbStatusElements = /* @__PURE__ */ new Set();
  let kbLibsCache = null;
  function parseKbLibIds(raw) {
    try {
      const parsed = JSON.parse(String(raw || "[]"));
      return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  function kbApiBase(settings) {
    return String((settings && settings.kbApiBase) || "").trim().replace(/\/+$/, "");
  }
  function kbApiRequest(settings, path, method, body) {
    const base = kbApiBase(settings);
    if (!base) return Promise.reject(new Error("未配置知识库 API 地址"));
    return new Promise((resolve, reject) => {
      const headers = { "Content-Type": "application/json" };
      if (settings.kbApiKey) headers.Authorization = "Bearer " + settings.kbApiKey;
      GM_xmlhttpRequest({
        url: base + path,
        method,
        headers,
        data: body === void 0 ? void 0 : JSON.stringify(body),
        responseType: "json",
        timeout: 3e4,
        onload(response) {
          if (response.status >= 200 && response.status < 300) {
            let data = response.response;
            if (data == null) {
              try { data = JSON.parse(response.responseText); } catch { data = {}; }
            }
            resolve(data);
          } else {
            reject(new Error("知识库 API 返回 HTTP " + response.status));
          }
        },
        onerror() { reject(new Error("知识库 API 网络请求失败，请确认后端服务已启动")); },
        ontimeout() { reject(new Error("知识库 API 请求超时")); }
      });
    });
  }
  async function kbListLibs(settings, force) {
    const base = kbApiBase(settings);
    if (!force && kbLibsCache && kbLibsCache.base === base) return kbLibsCache.libs;
    const data = await kbApiRequest(settings, "/api/kb/libs", "GET");
    const libs = Array.isArray(data && data.libs)
      ? data.libs.map((item) => ({
          id: String(item && item.id || ""),
          name: String((item && item.name) || (item && item.id) || "未命名库"),
          count: Number(item && item.count) || 0
        })).filter((item) => item.id)
      : [];
    kbLibsCache = { base, libs };
    return libs;
  }
  async function kbSearchRemote(settings, query, topK) {
    const data = await kbApiRequest(settings, "/api/kb/search", "POST", {
      libs: settings.kbLibs,
      query,
      topK
    });
    return Array.isArray(data && data.chunks) ? data.chunks : [];
  }
  function kbFormatContext(chunks, maxChars) {
    const blocks = [];
    let used = 0;
    chunks.forEach((chunk, index) => {
      let body = String((chunk && chunk.text) || "").trim();
      if (!body) return;
      const budget = Math.max(120, maxChars - used - 80);
      if (body.length > budget) body = body.slice(0, budget) + "……";
      const title = String((chunk && (chunk.title || chunk.libName)) || "知识库资料").replace(/\.[^.]+$/, "");
      const block = "【资料" + (index + 1) + "｜" + title + "】\n" + body;
      if (used && used + block.length > maxChars) return;
      blocks.push(block);
      used += block.length + 2;
    });
    if (!blocks.length) return "";
    return "以下是从知识库检索到的、与本题最相关的资料。请优先严格依据这些资料作答；资料确实没有覆盖时再使用通用知识。答案中不要出现“资料”“检索”“根据知识库”等字样，不要解释检索过程。\n\n" + blocks.join("\n\n") + "\n\n====================\n请严格按照前述 JSON 格式回答下面的题目：";
  }
  async function kbBuildQuestionContext(env, settings) {
    if (!settings.kbEnabled) return "";
    if (!kbApiBase(settings) || !settings.kbLibs.length) return "";
    const queryParts = [String(env.title || ""), String(env.title || "")];
    for (const option of normalizeAIOptions(env.options || [])) queryParts.push(String(option || ""));
    let chunks;
    try {
      chunks = await kbSearchRemote(settings, queryParts.join("\n"), Math.max(1, settings.kbTopK));
    } catch {
      return "";
    }
    if (!chunks.length) return "";
    return kbFormatContext(chunks, Math.max(500, Number(settings.kbContextChars) || 3000));
  }
  async function kbRefreshStatus() {
    const settings = getAISettings();
    let text;
    if (!settings.kbEnabled) text = "未启用";
    else if (!kbApiBase(settings)) text = "未配置知识库 API 地址";
    else if (!settings.kbLibs.length) text = "未选择知识库";
    else {
      try {
        const libs = await kbListLibs(settings, false);
        const names = libs.filter((item) => settings.kbLibs.includes(item.id)).map((item) => item.name);
        text = "已连接 · " + (names.length ? names.join("、") : settings.kbLibs.length + " 个库");
      } catch (error) {
        text = "连接失败：" + String((error && error.message) || error);
      }
    }
    for (const element of kbStatusElements) {
      try { element.value = text; } catch {}
    }
    return text;
  }
  function openKBManager() {
    const initial = new Set(getAISettings().kbLibs);
    const selected = new Set(initial);
    const statusEl = lib.h("div", { className: "secondary", style: { margin: "8px 0", minHeight: "18px" } }, "");
    const listEl = lib.h("div", {
      style: { maxHeight: "320px", overflowY: "auto", border: "1px solid var(--ocs-divider)", borderRadius: "8px" }
    });
    const renderLibs = (libs) => {
      listEl.innerHTML = "";
      if (!libs.length) {
        listEl.append(lib.h("div", { className: "secondary", style: { padding: "14px", textAlign: "center", color: "var(--ocs-text-3)" } }, "后端暂无知识库"));
        return;
      }
      for (const item of libs) {
        const checkbox = lib.h("input", { type: "checkbox", checked: selected.has(item.id) });
        checkbox.onchange = () => {
          if (checkbox.checked) selected.add(item.id);
          else selected.delete(item.id);
        };
        listEl.append(lib.h("label", {
          style: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderBottom: "1px solid var(--ocs-divider)", cursor: "pointer" }
        }, [
          checkbox,
          lib.h("div", { style: { flex: "1", minWidth: "0" } }, [
            lib.h("div", { style: { fontWeight: "600", color: "var(--ocs-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, item.name),
            lib.h("div", { className: "secondary", style: { fontSize: "12px" } }, item.count + " 篇资料")
          ])
        ]));
      }
    };
    const load = async (force) => {
      statusEl.textContent = "正在加载后端知识库列表…";
      try {
        const libs = await kbListLibs(getAISettings(), force);
        renderLibs(libs);
        statusEl.textContent = libs.length ? "共 " + libs.length + " 个知识库，勾选参与答题的库后保存" : "后端暂无知识库";
      } catch (error) {
        listEl.innerHTML = "";
        statusEl.textContent = "加载失败：" + String((error && error.message) || error);
      }
    };
    const toolbar = lib.h("div", { style: { display: "flex", gap: "8px", margin: "8px 0" } }, [
      lib.h("input", { type: "button", className: "base-style-button-secondary", value: "刷新列表", onclick: () => void load(true) }),
      lib.h("input", { type: "button", className: "base-style-button-secondary", value: "全选", onclick: () => { for (const input of listEl.querySelectorAll("input[type=checkbox]")) { input.checked = true; input.onchange && input.onchange(); } } }),
      lib.h("input", { type: "button", className: "base-style-button-secondary", value: "清空", onclick: () => { for (const input of listEl.querySelectorAll("input[type=checkbox]")) { input.checked = false; input.onchange && input.onchange(); } } })
    ]);
    lib.$modal.confirm({
      title: "选择知识库（后端）",
      width: 520,
      content: lib.h("div", { style: { width: "100%" } }, [
        lib.h("div", { className: "secondary", style: { lineHeight: "1.6" } }, "列表来自知识库后端 GET /api/kb/libs。勾选的库会在答题时参与检索（POST /api/kb/search），未勾选的库不会被查询。"),
        toolbar,
        statusEl,
        listEl
      ]),
      confirmButtonText: "保存",
      onConfirm() {
        CommonProject.scripts.settings.cfg.aiKbLibs = JSON.stringify(Array.from(selected));
        lib.$message.success("已保存知识库选择（" + selected.size + " 个）");
        void kbRefreshStatus();
      }
    });
    void load(true);
  }
  async function aiAnswerHandler(env, options = {}) {
    const config = getAISettings();
    if (!["single", "multiple", "judgement", "completion", "fill", "fill-blank", "line", "reader"].includes(String(env.type || ""))) {
      return [makeAIInfo(config, env, void 0, new Error("无法安全识别题型，当前题目已跳过"))];
    }
    const signature = [config.provider, config.endpoint, config.model, Boolean(config.apiKey)].join("|");
    if (aiFatalState.signature !== signature) aiFatalState = { signature, message: "" };
    const configError = getAIConfigError();
    if (configError) {
      setAIRuntimeStatus("配置不完整");
      return [makeAIInfo(config, env, void 0, new Error(configError))];
    }
    if (aiFatalState.message) {
      setAIRuntimeStatus("鉴权失败，已停止后续请求");
      return [makeAIInfo(config, env, void 0, new Error(aiFatalState.message))];
    }
    const images = Array.from(new Set((env.images || []).map(String).filter(Boolean))).slice(0, 8);
    if (images.length && !modelSupportsVision(config)) {
      setAIRuntimeStatus("图片题已跳过：模型不支持图片");
      return [makeAIInfo(config, env, void 0, new Error("当前模型未声明图片理解能力，此图片题已跳过"))];
    }
    let kbContext = "";
    try {
      kbContext = await kbBuildQuestionContext(env, config);
      if (kbContext) setAIRuntimeStatus("知识库已命中相关资料，正在请求 " + config.model);
    } catch (kbError) {
      kbContext = "";
      setAIRuntimeStatus("知识库检索失败，已直接请求模型");
    }
    const cacheKey = JSON.stringify([config.provider, config.endpoint, config.model, config.systemPrompt, env.type, env.title, normalizeAIOptions(env.options), Number(env.blankCount || 0), images, kbContext]);
    if (!options.skipCache && aiAnswerCache.has(cacheKey)) {
      setAIRuntimeStatus("命中本页 AI 缓存");
      bumpAIStats("cacheHits");
      return [makeAIInfo(config, env, aiAnswerCache.get(cacheKey))];
    }
    if (!options.skipCache && aiInflight.has(cacheKey)) {
      setAIRuntimeStatus("相同题目正在请求，等待复用结果");
      const shared = await aiInflight.get(cacheKey);
      return shared.map((info) => ({ ...info, results: info.results.map((item) => ({ ...item })) }));
    }
    if (options.skipCache) return aiAnswerRequest(config, env, images, kbContext, cacheKey, signature);
    const running = (async () => {
      if (config.persistentCache) {
        const stored = await aiPCacheGet(cacheKey);
        if (stored && stored.answer !== void 0) {
          aiAnswerCache.set(cacheKey, stored);
          setAIRuntimeStatus("命中本地 AI 缓存");
          bumpAIStats("cacheHits");
          return [makeAIInfo(config, env, stored)];
        }
      }
      return aiAnswerRequest(config, env, images, kbContext, cacheKey, signature);
    })();
    aiInflight.set(cacheKey, running);
    try {
      return await running;
    } finally {
      aiInflight.delete(cacheKey);
    }
  }
  async function aiAnswerRequest(config, env, images, kbContext, cacheKey, signature) {
    const prompt2 = buildAIQuestionPrompt(env);
    const finalPrompt = kbContext ? kbContext + "\n" + prompt2 : prompt2;
    const userContent = images.length ? [{ type: "text", text: finalPrompt }, ...images.map((url) => ({ type: "image_url", image_url: { url } }))] : finalPrompt;
    const payload = {
      model: config.model,
      messages: [{ role: "system", content: config.systemPrompt }, { role: "user", content: userContent }],
      temperature: Number.isFinite(config.temperature) ? config.temperature : 0.1,
      max_tokens: Number.isFinite(config.maxTokens) ? config.maxTokens : 4096,
      stream: false
    };
    const thinkingConfig = providerThinkingConfig(config);
    if (thinkingConfig) payload[thinkingConfig.key] = thinkingConfig.value;
    if (!["llama", "custom"].includes(config.provider)) payload.response_format = { type: "json_object" };
    const headers = { "Content-Type": "application/json" };
    if (config.apiKey) headers.Authorization = "Bearer " + config.apiKey;
    let lastError;
    let networkAttempt = 0;
    let corrective = 0;
    const maxCorrective = 2;
    const strippedParams = /* @__PURE__ */ new Set();
    while (true) {
      try {
        setAIRuntimeStatus("正在请求 " + config.model + (networkAttempt || corrective ? "（第 " + (networkAttempt + corrective + 1) + " 次）" : ""));
        const data = await aiRequest(config.endpoint, payload, headers, config.timeout);
        const choice = data && data.choices && data.choices[0];
        const message = choice && choice.message || {};
        const raw = extractMessageText(choice, data);
        const finishReason = String(choice && choice.finish_reason || data && data.finish_reason || "").toLowerCase();
        const reasoningText = String(message.reasoning_content || choice && choice.reasoning_content || data && data.reasoning_content || "");
        if (!raw.trim()) {
          if (reasoningText || finishReason === "length") {
            throw Object.assign(aiSoftError("模型思考占用了全部 Token 预算、未给出答案，已自动扩容并重试", "truncated"), { finishReason });
          }
          throw aiSoftError("模型没有返回内容", "empty");
        }
        const result = normalizeAIResult(parseAIResponse(raw, env), env);
        if (finishReason === "length" && ["completion", "reader"].includes(String(env.type || ""))) {
          throw Object.assign(aiSoftError("简答答案在完成前被 Token 上限截断，已自动扩容并重试", "truncated"), { finishReason });
        }
        aiAnswerCache.set(cacheKey, result);
        if (aiAnswerCache.size > AI_CACHE_LIMIT) aiAnswerCache.delete(aiAnswerCache.keys().next().value);
        if (config.persistentCache) void aiPCacheSet(cacheKey, result);
        const usage = data && data.usage;
        if (usage && Number(usage.total_tokens)) bumpAIStats("tokens", Number(usage.total_tokens));
        bumpAIStats("answered");
        setAIRuntimeStatus("已获得有效答案");
        return [makeAIInfo(config, env, result)];
      } catch (error) {
        lastError = error;
        if ([401, 403].includes(error.status)) {
          aiFatalState = { signature, message: config.provider === "llama"
            ? "本地 llama.cpp 返回 HTTP " + error.status + "，服务已要求鉴权；请在脚本的 API Key 设置中填写本地服务密钥。"
            : "AI 鉴权失败，请检查 API Key" };
          setAIRuntimeStatus("鉴权失败，已停止后续请求");
          break;
        }
        if (error.status >= 400 && error.status < 500 && ![408, 429].includes(error.status)) {
          const imageRejected = images.length && /image|vision|multimodal|图片|图像/i.test(String(error.message || ""));
          const unsupported = imageRejected ? null : matchUnsupportedParam(error, payload);
          if (unsupported && !strippedParams.has(unsupported) && corrective < maxCorrective) {
            strippedParams.add(unsupported);
            corrective++;
            delete payload[unsupported];
            setAIRuntimeStatus("接口不兼容参数 " + unsupported + "，已自动移除并重试");
            continue;
          }
          if (!imageRejected) {
            const message2 = error.status === 404
              ? "AI Endpoint 返回 HTTP 404，请核对接口路径或网关配置。当前请求路径：" + displayAIEndpointPath(config.endpoint)
              : "AI 接口参数错误，已停止后续请求：" + redactAISecret(error.message || error);
            aiFatalState = { signature, message: message2 };
            lastError = new Error(message2);
            setAIRuntimeStatus(error.status === 404 ? "Endpoint 返回 404，已停止请求" : "参数错误，已停止后续请求");
          }
          break;
        }
        if (error.soft && corrective < maxCorrective) {
          corrective++;
          if (error.soft === "truncated") {
            growPayloadTokens(payload, 4096);
            if (!strippedParams.has("thinking") && !strippedParams.has("enable_thinking")) {
              const fallbackThinking = providerThinkingConfig(config);
              if (fallbackThinking) payload[fallbackThinking.key] = fallbackThinking.value;
            }
            appendPayloadInstruction(payload, "上次输出被 Token 上限截断。只输出 answer 字段，不要 confidence、explanation 或任何解析，优先保证 answer 完整；简答题分点作答、控制在 400 字以内，不要复述题目。");
            setAIRuntimeStatus("输出被截断，正在扩容重试");
          } else if (error.soft === "empty") {
            growPayloadTokens(payload, 4096);
            const fallbackThinking2 = providerThinkingConfig(config);
            if (fallbackThinking2 && !strippedParams.has(fallbackThinking2.key)) payload[fallbackThinking2.key] = fallbackThinking2.value;
            appendPayloadInstruction(payload, "你上次没有给出答案。请立即按前述格式输出 JSON 对象，JSON 之外不要输出任何文字，不要输出思考过程。");
            setAIRuntimeStatus("模型空返回，正在自动重试");
          } else if (error.soft === "count") {
            growPayloadTokens(payload, 2048);
            appendPayloadInstruction(payload, "本题恰好有 " + error.expected + " 个空位，你上次只返回了 " + error.got + " 个答案。answer 必须是长度恰好为 " + error.expected + " 的字符串数组，逐项对应，不得缺失、合并或多给。");
            setAIRuntimeStatus("填空数量不符，正在纠正重试");
          } else {
            growPayloadTokens(payload, 4096);
            appendPayloadInstruction(payload, "你上次的输出不是合法 JSON。请只输出一个结构完整的 JSON 对象：不要 markdown 代码块、不要注释、不要 JSON 以外的文字，字符串内换行写成 \\n。");
            setAIRuntimeStatus("JSON 格式异常，正在纠正重试");
          }
          continue;
        }
        if (error.retriable && networkAttempt < Math.max(0, config.retries)) {
          networkAttempt++;
          const backoff = error.retryAfter ? error.retryAfter * 1e3 : Math.pow(2, networkAttempt - 1) * 1e3 + Math.floor(Math.random() * 600);
          setAIRuntimeStatus("请求失败，" + Math.ceil(backoff / 1e3) + " 秒后退避重试");
          await $.sleep(backoff);
          continue;
        }
        break;
      }
    }
    setAIRuntimeStatus("请求失败：" + String(lastError && lastError.message || "未知错误").slice(0, 80));
    bumpAIStats("failed");
    return [makeAIInfo(config, env, void 0, lastError || new Error("AI 请求失败"))];
  }
  async function testAIConnection() {
    const config = getAISettings();
    if (config.provider === "llama") {
      const configError = getAIConfigError();
      if (configError) throw new Error(configError);
      const origin = new URL(config.endpoint).origin;
      const headers = config.apiKey ? { Authorization: "Bearer " + config.apiKey } : {};
      const health = await aiRequest(origin + "/health", void 0, headers, 10, "GET");
      if (!health || health.status !== "ok") throw new Error("llama.cpp 服务尚未准备好，请检查 /health。");
      const localRequest = async (...args) => {
        try { return await aiRequest(...args); }
        catch (error) {
          if ([401, 403].includes(error.status)) throw new Error("本地 llama.cpp 要求鉴权：请在脚本 API Key 设置中填写服务密钥，然后重新测试。");
          throw error;
        }
      };
      const models = await localRequest(origin + "/v1/models", void 0, headers, 10, "GET");
      const availableModels = Array.isArray(models && models.data) ? models.data.map((item) => item.id).filter(Boolean) : [];
      if (availableModels.length && !availableModels.includes(config.model)) {
        throw new Error("当前模型名称未出现在 llama.cpp /v1/models：" + config.model + "；可用模型：" + availableModels.join("、"));
      }
      const slots = await aiRequest(origin + "/slots", void 0, headers, 10, "GET").catch(() => null);
      if (Array.isArray(slots) && slots.length && slots.every((slot) => slot.is_processing === true)) {
        throw new Error("llama.cpp 所有 slot 均在处理请求，请等待当前任务结束或关闭其他客户端后再测试。");
      }
      const data = await localRequest(config.endpoint, {
        model: config.model,
        messages: [{ role: "user", content: "Reply OK." }],
        max_tokens: 1,
        stream: false
      }, { "Content-Type": "application/json", ...headers }, 30);
      if (!data || !Array.isArray(data.choices) || !data.choices[0]) throw new Error("llama.cpp 聊天接口未返回标准 choices 响应。");
      return { name: "AI · 本地 llama.cpp", results: [{ answer: "接口连通" }], connectionOnly: true };
    }
    const infos = await aiAnswerHandler({ type: "single", title: "测试连接：请选择字母 A。", options: ["A. A", "B. B"], images: [] }, { skipCache: true });
    const info = infos[0];
    if (!info || info.error || !info.results.length) throw new Error(info && info.error || "模型未返回可用答案");
    return info;
  }
  function isQuestionOptionSelected(option) {
    if (!option) return false;
    const input = option.matches && option.matches('input[type="radio"],input[type="checkbox"]') ? option : option.querySelector && option.querySelector('input[type="radio"],input[type="checkbox"]');
    if (input && input.checked === true) return true;
    if (option.getAttribute && ["true", "checked"].includes(String(option.getAttribute("aria-checked")))) return true;
    const selectedSelector = [
      ".is-checked", ".checked", ".selected", ".is-selected", ".active", ".on", ".cur", ".bg-mainBg",
      ".ivu-radio-checked", ".ivu-checkbox-checked", ".el-radio__input.is-checked", ".el-checkbox__input.is-checked",
      ".checkbox_on", ".checkedIcon", "[class*=check_answer]",
      '[aria-checked="true"]', '[data-checked="true"]'
    ].join(",");
    if (option.matches && option.matches(selectedSelector)) return true;
    if (option.querySelector && option.querySelector(selectedSelector)) return true;
    return Boolean(option.parentElement && option.parentElement.querySelector('[class*=check_answer]'));
  }
  function readQuestionInput(option) {
    if (!option) return void 0;
    const control = option.matches && option.matches('textarea,input[type="text"],input:not([type]),[contenteditable="true"]') ? option : option.querySelector && option.querySelector('textarea,input[type="text"],input:not([type]),[contenteditable="true"]');
    if (control) return control.matches('[contenteditable="true"]') ? control.textContent || "" : control.value || "";
    const rich = option.matches && option.matches(".vditor-reset,.real-editor") ? option : option.querySelector && option.querySelector(".vditor-reset,.real-editor");
    if (rich && !rich.classList.contains("real-editor")) return rich.innerText || rich.textContent || "";
    const iframe = option.querySelector && option.querySelector("iframe");
    if (iframe) {
      try { return iframe.contentDocument && iframe.contentDocument.body ? iframe.contentDocument.body.innerText || iframe.contentDocument.body.textContent || "" : ""; } catch {}
    }
    try {
      if (option.ckeditorInstance && option.ckeditorInstance.data && typeof option.ckeditorInstance.data.get === "function") return option.ckeditorInstance.data.get();
    } catch {}
    return void 0;
  }
  function dispatchAnswerInput(control) {
    if (!control || typeof control.dispatchEvent !== "function") return;
    const EventCtor = control.ownerDocument && control.ownerDocument.defaultView && control.ownerDocument.defaultView.Event || Event;
    control.dispatchEvent(new EventCtor("input", { bubbles: true }));
    control.dispatchEvent(new EventCtor("change", { bubbles: true }));
  }
  function verifyQuestionWritten(ctx, result) {
    if (!result || result.finish !== true || !ctx || !ctx.root) return false;
    const options = ctx.elements && ctx.elements.options || [];
    if (Number.isInteger(result.optionIndex)) return Boolean(options[result.optionIndex] && isQuestionOptionSelected(options[result.optionIndex]));
    if (Array.isArray(result.plainOptionIndexes) && result.plainOptionIndexes.length) {
      return result.plainOptionIndexes.every((index) => options[index] && isQuestionOptionSelected(options[index]));
    }
    const expectedChoice = [];
    if (result.option !== void 0) expectedChoice.push(result.option);
    if (Array.isArray(result.options)) expectedChoice.push(...result.options);
    if (Array.isArray(result.plainOptions)) expectedChoice.push(...result.plainOptions);
    if (expectedChoice.length) {
      return expectedChoice.every((expected) => {
        if (typeof Element !== "undefined" && expected instanceof Element) return isQuestionOptionSelected(expected);
        const matches2 = options.filter((option) => (option.innerText || option.textContent || "").trim() === String(expected).trim());
        return matches2.length === 1 && isQuestionOptionSelected(matches2[0]);
      });
    }
    if (Array.isArray(result.answers) && result.answers.length) {
      if (options.length < result.answers.length) return false;
      return result.answers.every((answer, index) => {
        const current = readQuestionInput(options[index]);
        return current !== void 0 && String(current).trim() === String(answer).trim();
      });
    }
    const choiceControls = Array.from(ctx.root.querySelectorAll('input[type="radio"],input[type="checkbox"],[role="radio"],[role="checkbox"]'));
    if (choiceControls.length) return choiceControls.some(isQuestionOptionSelected);
    const inputControls = Array.from(ctx.root.querySelectorAll('textarea,input[type="text"],input:not([type]),[contenteditable="true"]'));
    if (inputControls.length) return inputControls.every((control) => String(readQuestionInput(control) || "").trim() !== "");
    const selects = Array.from(ctx.root.querySelectorAll("select"));
    return selects.length > 0 && selects.every((select) => String(select.value || select.querySelector("option[selected]") && select.querySelector("option[selected]").value || "").trim() !== "");
  }
  class OCSWorker extends lib.CommonEventEmitter {
    constructor(opts) {
      super();
      this.isRunning = false;
      this.isClose = false;
      this.isStop = false;
      this.totalQuestionCount = 0;
      this.opts = opts;
      this.once("close", () => {
        this.isClose = true;
        abortAllAIRequests();
      });
      this.on("stop", () => {
        this.isStop = true;
        abortAllAIRequests();
        setAIRuntimeStatus("已暂停");
      });
      this.on("continuate", () => {
        this.isStop = false;
        setAIRuntimeStatus("继续运行");
      });
    }
    async doWork(options) {
      var _a, _b, _c, _d;
      this.emit("start");
      this.isRunning = true;
      if (!this.verificationWatcher) {
        const clearVerificationWatcher = () => {
          clearInterval(this.verificationWatcher);
          this.verificationWatcher = 0;
        };
        this.once("close", clearVerificationWatcher);
        this.once("done", clearVerificationWatcher);
        this.verificationWatcher = setInterval(async () => {
          if (!this.verificationHandling && findHumanVerification(document)) {
            this.verificationHandling = true;
            try { await waitForHumanVerification(this, document); } finally { this.verificationHandling = false; }
          }
        }, 1e3);
      }
      const questionRoots = typeof this.opts.root === "string" ? Array.from(document.querySelectorAll(this.opts.root)) : this.opts.root;
      if (!this.submissionSessionKey) {
        const assignment = document.querySelector('[data-assignment-id],[data-homework-id],[data-exam-id],[data-work-id]');
        const assignmentId = assignment && ["data-assignment-id", "data-homework-id", "data-exam-id", "data-work-id"].map((name) => assignment.getAttribute(name)).find(Boolean);
        const firstQuestion = questionRoots[0];
        const questionId = firstQuestion && (firstQuestion.getAttribute("data-question-id") || firstQuestion.id || (firstQuestion.innerText || firstQuestion.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80));
        this.submissionSessionKey = [location.pathname, location.search, location.hash, assignmentId || "", questionId || ""].join("|");
      }
      this.totalQuestionCount += questionRoots.length;
      if (options == null ? void 0 : options.enable_debug) {
        console.debug("开始答题", this);
        console.debug("题目数量: ", questionRoots.length);
        console.debug("父节点列表: ", questionRoots);
      }
      const results = [];
      if (questionRoots.length === 0) {
        this.isRunning = false;
        this.emit("done");
        throw new Error("未找到任何题目，答题结束。");
      }
      for (const questionRoot of questionRoots) {
        const ctx = {
          searchInfos: [],
          root: questionRoot,
          elements: domSearchAll(this.opts.elements, questionRoot),
          type: void 0,
          answerSeparators: this.opts.answerSeparators
        };
        await ((_b = (_a = this.opts).onElementSearched) == null ? void 0 : _b.call(_a, ctx.elements, questionRoot));
        ctx.elements.title = (_c = ctx.elements.title) == null ? void 0 : _c.filter(Boolean);
        ctx.elements.options = (_d = ctx.elements.options) == null ? void 0 : _d.filter(Boolean);
        if (typeof this.opts.work === "object") {
          ctx.type = this.opts.work.type === void 0 ? defaultWorkTypeResolver(ctx) : typeof this.opts.work.type === "string" ? this.opts.work.type : this.opts.work.type(ctx);
        }
        results.push({
          requested: false,
          resolved: false,
          ctx
        });
      }
      if (options == null ? void 0 : options.enable_debug) {
        console.debug("上下文已初始化: ", results);
      }
      const requestThread = async (index) => {
        var _a2, _b2, _c2;
        let error;
        const result = results[index];
        const ctx = result.ctx || {};
        if (this.isClose === true) {
          this.isRunning = false;
          return;
        }
        if (this.isStop) {
          await waitForContinuate(() => this.isStop && !this.isClose);
        }
        ctx.searchInfos = [];
        if (options == null ? void 0 : options.enable_debug) {
          console.groupEnd();
          console.group(
            "开始请求 AI: ",
            (_a2 = ctx.elements.title) == null ? void 0 : _a2.map((t2) => t2 == null ? void 0 : t2.innerText).filter(Boolean).join(", ").slice(0, 20)
          );
          console.log("ctx", result.ctx);
        }
        try {
          while (this.isClose === false) {
            ctx.searchInfos = await this.opts.answerer(ctx.elements, ctx) || [];
            const cancelledByPause = this.isStop && ctx.searchInfos.some((info) => /请求已取消/.test(String(info.error || "")));
            if (!cancelledByPause) break;
          await waitForContinuate(() => this.isStop && !this.isClose);
          }
          ctx.searchInfos.forEach((info) => {
            info.results = info.results.map((ans) => {
              ans.answer = ans.answer ? ans.answer.trim() : "";
              return ans;
            });
          });
        } catch (err) {
          error = String(err);
        }
        result.ctx = ctx;
        result.requested = true;
        result.error = error;
        if (options == null ? void 0 : options.enable_debug) {
          console.log("AI 答题结果: ", ctx.searchInfos);
        }
        await ((_c2 = (_b2 = this.opts).onResultsUpdate) == null ? void 0 : _c2.call(_b2, results[index], index, results));
      };
      const waitForRequested = async (result) => {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (this.isClose) {
              clearInterval(interval);
              clearTimeout(timeout);
              resolve();
              return;
            }
            if ((result == null ? void 0 : result.requested) === true) {
              clearInterval(interval);
              clearTimeout(timeout);
              resolve();
            }
          }, 200);
          const timeout = setTimeout(() => {
            clearInterval(interval);
            reject(new Error("答题超时！"));
          }, (getAISettings().timeout * (getAISettings().retries + 1) + 20) * 1e3);
        });
      };
      const resolverThread = async () => {
        var _a2, _b2, _c2, _d2;
        for (let index = 0; index < results.length; index++) {
          const result = results[index];
          let error;
          let res;
          if (this.isClose === true) {
            this.isRunning = false;
            return;
          }
          try {
            if (this.isStop) {
          await waitForContinuate(() => this.isStop && !this.isClose);
            }
            await waitForRequested(result);
          } catch (err) {
          }
          if (this.isClose) return;
          try {
            if (result.ctx && result.ctx.searchInfos.length !== 0) {
              if (typeof this.opts.work === "object") {
                if (result.ctx.elements.options) {
                  if (result.ctx.type) {
                    const resolver = createDefaultQuestionResolver(result.ctx)[result.ctx.type];
                    const handler = this.opts.work.handler;
                    res = await resolver(result.ctx.searchInfos, result.ctx.elements.options, handler);
                  } else {
                    error = "题目类型解析失败, 请自行提供解析器, 或者忽略此题。";
                  }
                } else {
                  error = "elements.options 为空 ! 使用默认处理器, 必须提供题目选项的选择器。";
                }
            } else {
              const work2 = this.opts.work;
              res = await work2(result.ctx);
            }
            if (res && res.finish === true) {
              await $.sleep(80);
              res.domVerified = verifyQuestionWritten(result.ctx, res);
              if (!res.domVerified) {
                res.finish = false;
                error = "答案已匹配，但未能验证其已写入页面；该题不计入提交完成率。";
              }
            }
            } else {
              const aiError = result.ctx && result.ctx.searchInfos.find((info) => info.error);
              error = aiError && aiError.error || "AI 未返回可用答案，请查看模型配置或忽略此题。";
            }
          } catch (err) {
            error = (err == null ? void 0 : err.message) || err;
          }
          result.error = error;
          result.result = res || { finish: false };
          result.resolved = true;
          if (options == null ? void 0 : options.enable_debug) {
            console.log(
              "答题完成: ",
              (_b2 = (_a2 = result.ctx) == null ? void 0 : _a2.elements.title) == null ? void 0 : _b2.map((t2) => t2 == null ? void 0 : t2.innerText).join(", ").slice(0, 20),
              result
            );
          }
          await ((_d2 = (_c2 = this.opts).onResultsUpdate) == null ? void 0 : _d2.call(_c2, result, index, results));
        }
      };
      const requestThreadHandler = async () => {
        const locks = [];
        const waitForLock = () => {
          return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (locks.length > 0) {
                const lock = locks.shift();
                if (lock) {
                  resolve(lock);
                  clearInterval(interval);
                  clearTimeout(timeout);
                }
              }
            }, 100);
            const timeout = setTimeout(() => {
              clearInterval(interval);
              reject(new Error("获取线程锁超时！"));
            }, 3 * 60 * 1e3);
          });
        };
        const requestThreads = [];
        for (let index = 0; index < results.length; index++) {
          requestThreads.push(() => requestThread(index));
        }
        for (let index = 0; index < (this.opts.thread || 1); index++) {
          locks.push(index + 1);
        }
        let requestFinished = 0;
        const promises = [];
        for (let index = 0; index < (this.opts.thread || 1); index++) {
          promises.push(async () => {
            try {
              while (requestFinished < results.length && requestThreads.length > 0 && this.isClose === false) {
                const thread = requestThreads.shift();
                if (thread) {
                  const lock = await waitForLock();
                  await thread();
                  requestFinished++;
                  locks.push(lock);
                }
              }
            } catch (err) {
              console.error(err);
            }
          });
        }
        await Promise.all(promises.map((f) => f()));
      };
      await Promise.all([resolverThread(), requestThreadHandler()]);
      this.isRunning = false;
      return results;
    }
    uploadHandler(options) {
      var _a;
      const { results, type, callback } = options;
      if (type !== "nomove") {
        let finished = 0;
        for (const result of results) {
          if ((_a = result.result) == null ? void 0 : _a.finish) {
            finished++;
          }
        }
        const rate = results.length === 0 ? 0 : finished / results.length * 100;
        if (type === "force") {
          return callback(rate, true);
        } else {
          return callback(rate, type === "save" ? false : rate >= parseFloat(type.toString()));
        }
      }
    }
  }
  class CustomOCSWorker extends lib.CommonEventEmitter {
    constructor(opts) {
      super();
      this.isRunning = false;
      this.isClose = false;
      this.isStop = false;
      this.opts = opts;
    }
    async doWork(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      this.emit("start");
      this.isRunning = true;
      this.once("close", () => {
        this.isClose = true;
      });
      this.on("stop", () => {
        this.isStop = true;
      });
      this.on("continuate", () => {
        this.isStop = false;
      });
      const questions = await ((_b = (_a = this.opts).questions) == null ? void 0 : _b.call(_a));
      if (options == null ? void 0 : options.enable_debug) {
        console.debug("开始答题", this);
        console.debug("题目数量: ", this.opts.questions.length);
      }
      const results = [];
      for (let index = 0; index < questions.length; index++) {
        if (this.isClose === true) {
          this.isRunning = false;
          return;
        }
        if (this.isStop) {
          await waitForContinuate(() => this.isStop && !this.isClose);
        }
        const question = questions[index];
        results[index] = {
          question: question.text,
          requested: false,
          resolved: false,
          searchInfos: [],
          type: question.type,
          finish: false,
          error: ""
        };
        try {
          const infos = await this.opts.answerer(question.text);
          results[index].searchInfos = infos.map((i) => ({
            name: i.name,
            homepage: i.homepage,
            results: i.results.map((r) => [r.question, r.answer, r.extra_data || {}]),
            error: i.error
          }));
          results[index].requested = true;
          (_d = (_c = this.opts).onResultsUpdate) == null ? void 0 : _d.call(_c, results[index], index, results);
          try {
            const resolved = await this.opts.resolver(infos);
            results[index].finish = resolved.finish;
            results[index].error = resolved.error;
            results[index].resolved = true;
          } catch (err) {
            results[index].finish = false;
            results[index].error = err instanceof Error ? err.message : String(err);
            results[index].resolved = true;
          }
          (_f = (_e = this.opts).onResultsUpdate) == null ? void 0 : _f.call(_e, results[index], index, results);
        } catch (err) {
          results[index].requested = true;
          results[index].resolved = false;
          results[index].finish = true;
          results[index].error = err instanceof Error ? err.message : String(err);
          (_h = (_g = this.opts).onResultsUpdate) == null ? void 0 : _h.call(_g, results[index], index, results);
        }
        await lib.$.sleep(this.opts.period);
      }
    }
  }
  async function waitForContinuate(isStopping) {
    if (isStopping()) {
      await new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (isStopping() === false) {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });
    }
  }
  const RenderScript = lib.createRenderScript({
    name: "🖼️ 窗口设置"
  });
  const transformImgLinkOfQuestion = (question) => {
    const dom2 = new DOMParser().parseFromString(question, "text/html");
    for (const img of Array.from(dom2.querySelectorAll("img"))) {
      img.replaceWith(img.src);
    }
    return dom2.documentElement.innerHTML.replace(/https?:\/\/.+?\.(png|jpg|jpeg|gif)/g, (img) => {
      return `<img src="${img}" />`;
    });
  };
  class SearchInfosElement extends HTMLElement {
    constructor() {
      super(...arguments);
      this.infos = [];
      this.question = "";
    }
    connectedCallback() {
      const question = transformImgLinkOfQuestion(this.question || "无");
      const type_text = {
        single: "单选题",
        multiple: "多选题",
        judgement: "判断题",
        completion: "填空题"
      };
      const type_label = this.type ? Reflect.get(type_text, this.type) : "";
      this.append(
        lib.h(
          "div",
          [
            ...type_label ? [lib.h("span", { className: "search-result-question-type" }, type_label)] : [],
            lib.h("div", { className: "title-content" }, [
              ...question.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => lib.h("div", { innerHTML: l }))
            ]),
            createQuestionTitleExtra(this.question)
          ],
          (div) => {
            div.className = "search-info-title";
          }
        )
      );
      this.append(
        ...this.infos.map((info) => {
          return lib.h("details", { open: true, className: "search-info-details" }, [
            lib.h("summary", [lib.h("a", { href: info.homepage, innerText: info.name, target: "_blank" })]),
            ...(info.error ? [lib.h("span", { className: "error" }, [info.error || "网络错误或者未知错误"])] : []).concat([
              ...info.results.map((ans) => {
                const title = transformImgLinkOfQuestion(ans[0] || this.question || "无");
                const answer = transformImgLinkOfQuestion(ans[1] || "无");
                const extra_data = JSON.parse(JSON.stringify(ans[2] || {}));
                if (extra_data.ai) {
                  extra_data.tags = extra_data.tags || [];
                  extra_data.tags.push({
                    text: "AI",
                    title: "此答案由 AI 生成，仅供参考",
                    color: "blue"
                  });
                }
                return lib.h("div", { className: "search-result" }, [
                  lib.h("div", { className: "question" }, [lib.h("span", { innerHTML: title })]),
                  lib.h("div", { className: "answer" }, [
                    lib.h("span", "答案："),
                    ...extra_data.tags ? extra_data.tags.map(
                      (tag) => lib.$ui.tooltip(
                        lib.h("span", {
                          className: "search-result-answer-tag " + tag.color,
                          innerHTML: tag.text,
                          title: tag.title,
                          dataset: { title: tag.title }
                        })
                      )
                    ) : [],
                    ...splitAnswer(answer).map((a) => lib.h("code", extra_data.ai ? { innerText: a } : { innerHTML: a }))
                  ]),
                  ...extra_data.model ? [lib.h("div", { className: "secondary" }, "模型：" + extra_data.model)] : [],
                  ...extra_data.confidence !== void 0 ? [lib.h("div", { className: "secondary" }, "置信度：" + Math.round(extra_data.confidence * 100) + "%")] : [],
                  ...extra_data.explanation ? [lib.h("div", { className: "secondary", style: { marginTop: "4px", whiteSpace: "pre-wrap" } }, "解析：" + extra_data.explanation)] : []
                ]);
              })
            ])
          ]);
        })
      );
      $.onresize(this, (sr) => {
        sr.style.maxHeight = window.innerHeight / 2 + "px";
      });
    }
  }
  const $render = {
    moveToEdge(x = 80, y = 100) {
      CommonProject.scripts.render.methods.minimize();
      CommonProject.scripts.render.methods.setPosition(x, y);
    }
  };
  const state$7 = {
    console: {
      listenerIds: {
        logs: 0
      }
    }
  };
  const BackgroundProject = lib.Project.create({
    name: "后台",
    domains: [],
    scripts: {
      elementRegister: new lib.Script({
        name: "🔗 元素注册",
        hideInPanel: true,
        matches: [["所有页面", /.*/]],
        onstart() {
          lib.$.loadCustomElements([SearchInfosElement]);
        }
      }),
      console: new lib.Script({
        name: "📄 日志输出",
        matches: [["所有", /.*/]],
        namespace: "render.console",
        configs: {
          logs: {
            defaultValue: []
          }
        },
        onrender({ panel }) {
          const getTypeDesc = (type) => type === "info" ? "信息" : type === "error" ? "错误" : type === "warn" ? "警告" : type === "debug" ? "调试" : "日志";
          const createLog = (log) => {
            const date = new Date(log.time);
            const item = lib.h(
              "div",
              {
                title: "双击复制日志信息",
                className: "item"
              },
              [
                lib.h(
                  "span",
                  { className: "time" },
                  `${date.getHours().toFixed(0).padStart(2, "0")}:${date.getMinutes().toFixed(0).padStart(2, "0")} `
                ),
                lib.h("span", { className: log.type }, `[${getTypeDesc(log.type)}]`),
                lib.h("span", ":" + log.content)
              ]
            );
            item.addEventListener("dblclick", () => {
              navigator.clipboard.writeText(
                Object.keys(log).map((k) => `${k}: ${log[k]}`).join("\n")
              );
            });
            return item;
          };
          const showLogs = () => {
            const div2 = lib.h("div", { className: "card console" });
            const logs2 = this.cfg.logs.map((log) => createLog(log));
            if (logs2.length) {
              div2.replaceChildren(...logs2);
            } else {
              div2.replaceChildren(
                lib.h("div", "暂无任何日志", (div3) => {
                  div3.style.textAlign = "center";
                })
              );
            }
            return { div: div2, logs: logs2 };
          };
          const isScrollBottom = (div2) => {
            const { scrollHeight, scrollTop, clientHeight } = div2;
            return scrollTop + clientHeight + 50 > scrollHeight;
          };
          const { div, logs } = showLogs();
          this.offConfigChange(state$7.console.listenerIds.logs);
          state$7.console.listenerIds.logs = this.onConfigChange("logs", (logs2) => {
            const log = createLog(logs2[logs2.length - 1]);
            div.append(log);
            setTimeout(() => {
              if (isScrollBottom(div)) {
                log.scrollIntoView();
              }
            }, 10);
          });
          const show = () => {
            panel.body.replaceChildren(div);
            setTimeout(() => {
              var _a;
              (_a = logs[logs.length - 1]) == null ? void 0 : _a.scrollIntoView();
            }, 10);
          };
          show();
        }
      }),
      dev: new lib.Script({
        name: "🛠️ 开发者调试",
        namespace: "background.dev",
        matches: [["所有页面", /./]],
        configs: {
          notes: {
            defaultValue: "开发人员调试用。<br>注入OCS_CONTEXT全局变量。用户可忽略此页面。"
          },
          show_debug_cursor: {
            defaultValue: true,
            label: "软件辅助点击时显示鼠标位置",
            attrs: { type: "checkbox" }
          },
          enable_answerer_debug: {
            defaultValue: true,
            label: "开启答题日志输出",
            attrs: { type: "checkbox" }
          }
        },
        methods() {
          return {
            getRemotePlaywrightCurrentPage: () => {
              return RemotePlaywright.getRemotePage(this.cfg.show_debug_cursor, console.debug);
            }
          };
        },
        onrender({ panel }) {
          const injectBtn = lib.h("button", { className: "base-style-button" }, "点击注入全局变量");
          injectBtn.addEventListener("click", () => {
            lib.$gm.unsafeWindow.OCS_CONTEXT = self;
          });
          const showTabDataBtn = lib.h("button", { className: "base-style-button" }, "显示Tab存储");
          lib.$gm.getTab((tab) => {
            const els = [];
            for (const key in tab) {
              if (Object.prototype.hasOwnProperty.call(tab, key)) {
                els.push(lib.h("div", [lib.h("b", key + " : "), lib.h("code", JSON.stringify(tab[key]))]));
              }
            }
            showTabDataBtn.addEventListener("click", () => {
              lib.$modal.simple({
                content: lib.h("div", els),
                width: window.document.documentElement.clientWidth / 2
              });
            });
          });
          panel.body.replaceChildren(lib.h("div", { className: "card" }, [lib.h("hr"), injectBtn, showTabDataBtn]));
        }
      }),
      errorHandle: new lib.Script({
        name: "全局错误捕获",
        matches: [["", /.*/]],
        hideInPanel: true,
        onstart() {
          const projects = definedProjects();
          for (const project2 of projects) {
            for (const key in project2.scripts) {
              if (Object.prototype.hasOwnProperty.call(project2.scripts, key)) {
                const script2 = project2.scripts[key];
                script2.on("scripterror", (err) => {
                  const msg2 = `[${project2.name} - ${script2.name}] : ${err}`;
                  console.error(msg2);
                  $console.error(msg2);
                });
              }
            }
          }
        }
      }),
      requestList: new lib.Script({
        name: "📄 请求记录",
        matches: [["", /.*/]],
        priority: 99,
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "开发人员请求调试记录页面，小白勿入，最多只记录最近的100个请求数据",
              "可打开F12控制台查看请求日志，或者下方的请求列表"
            ]).outerHTML
          },
          enable: {
            label: "开启请求记录",
            attrs: { type: "checkbox" },
            defaultValue: false
          },
          methodFilter: {
            label: "方法过滤",
            tag: "select",
            attrs: { placeholder: "选择选项" },
            options: [["none", "无"], ["GET"], ["POST"], ["OPTIONS"], ["HEAD"]],
            defaultValue: "none"
          },
          typeFilter: {
            label: "类型过滤",
            tag: "select",
            attrs: { placeholder: "选择选项" },
            options: [
              ["none", "无"],
              ["gmxhr", "油猴API请求（gmxhr）"],
              ["fetch", "普通请求（fetch）"]
            ],
            defaultValue: "none"
          },
          searchValue: {
            label: "内容搜索",
            attrs: { placeholder: "搜索 URL/请求体/响应" },
            defaultValue: ""
          },
          list: {
            defaultValue: []
          }
        },
        methods() {
          const render2 = (list) => {
            var _a, _b;
            (_a = this.panel) == null ? void 0 : _a.body.replaceChildren();
            (_b = this.panel) == null ? void 0 : _b.body.append(
              lib.h("div", { className: "card" }, [
                lib.h("div", { style: { padding: "8px 0px", textAlign: "end" } }, [
                  lib.h(
                    "button",
                    {
                      className: "base-style-button-secondary",
                      style: { marginRight: "12px" },
                      innerText: "🗑️清空记录"
                    },
                    (btn) => {
                      btn.onclick = () => {
                        this.cfg.list = [];
                        render2(this.cfg.list);
                      };
                    }
                  ),
                  lib.h("button", { className: "base-style-button", innerText: "🔍执行搜索" }, (btn) => {
                    btn.onclick = () => {
                      if (this.cfg.methodFilter === "none" && this.cfg.typeFilter === "none" && this.cfg.searchValue === "") {
                        render2(this.cfg.list);
                      } else {
                        const list2 = this.cfg.list.filter((item) => {
                          if (this.cfg.methodFilter !== "none" && item.method.toLowerCase() !== this.cfg.methodFilter.toLowerCase()) {
                            return false;
                          }
                          return true;
                        }).filter((item) => {
                          if (this.cfg.typeFilter !== "none" && item.type !== this.cfg.typeFilter) {
                            return false;
                          }
                          return true;
                        }).filter((item) => {
                          var _a2, _b2;
                          if (this.cfg.searchValue && item.url.includes(this.cfg.searchValue) || ((_a2 = item.data) == null ? void 0 : _a2.includes(this.cfg.searchValue)) || ((_b2 = item.response) == null ? void 0 : _b2.includes(this.cfg.searchValue))) {
                            return true;
                          }
                          return false;
                        });
                        render2(list2);
                      }
                    };
                  })
                ]),
                lib.h(
                  "div",
                  { style: { backgroundColor: "#292929", overflow: "auto", maxHeight: window.innerHeight / 2 + "px" } },
                  [
                    ...list.length === 0 ? [lib.h("div", { style: { color: "white", textAlign: "center" } }, "暂无数据")] : [],
                    ...list.map(
                      (item) => lib.h(
                        "div",
                        {
                          title: Object.entries(item).map(
                            ([key, val]) => key === "time" ? `${key} : ${new Date(val).toLocaleString().replace(/\//g, "-")}` : `${key} : ${val}`
                          ).join("\n"),
                          style: {
                            maxWidth: "800px",
                            padding: "4px 0px",
                            margin: "4px 0px",
                            textWrap: "nowrap"
                          }
                        },
                        [
                          lib.h("div", [
                            lib.h("span", { style: { marginRight: "8px" } }, new Date(item.time).toLocaleTimeString()),
                            lib.h(
                              "span",
                              {
                                style: {
                                  backgroundColor: "#2196f3a3",
                                  color: "#ececec",
                                  marginRight: "8px",
                                  padding: "0px 2px"
                                }
                              },
                              item.method
                            ),
                            lib.h(
                              "span",
                              { style: { color: item.response ? "#4eb74e" : "#eb6262", marginRight: "8px" } },
                              "●"
                            ),
                            lib.h(
                              "div",
                              { style: { display: "inline-block", color: "#ececec" } },
                              item.url ? item.url.length > 100 ? item.url.slice(0, 100) + "..." : item.url : "-"
                            )
                          ]),
                          lib.h(
                            "div",
                            { style: { overflow: "hidden", fontSize: "12px", color: "#8f8f8f" } },
                            item.data ? "data: " + item.data : ""
                          ),
                          lib.h(
                            "div",
                            { style: { overflow: "hidden", fontSize: "12px", color: "#8f8f8f" } },
                            item.response ? "resp: " + item.response : item.error ? "err : " + item.error : ""
                          )
                        ]
                      )
                    )
                  ]
                )
              ])
            );
          };
          return {
            render: render2
          };
        },
        onrender() {
          this.methods.render((this.cfg.list || []).map(redactAILogValue));
        },
        onstart() {
          if (lib.$gm.isInGMContext() === false) {
            return;
          }
          this.cfg.list = (this.cfg.list || []).map(redactAILogValue);
          const gmRequest = GM_xmlhttpRequest;
          const originalFetch = fetch;
          const getId = () => Math.random().toString(16).slice(2);
          const addRecord = (item) => {
            this.cfg.list = [item, ...this.cfg.list];
            if (this.cfg.list.length > 100) {
              this.cfg.list = this.cfg.list.slice(0, 100);
            }
          };
          const setItem = (id, response, error) => {
            const list = JSON.parse(JSON.stringify(this.cfg.list));
            const index = list.findIndex((item) => item.id === id);
            if (index !== -1) {
              list[index].response = redactAILogValue(response);
              list[index].error = redactAILogValue(error);
            }
            this.cfg.list = list;
          };
          GM_xmlhttpRequest = (details) => {
            if (this.cfg.enable) {
              const id = getId();
              const data = {
                id,
                url: redactAILogValue(details.url),
                method: details.method || "unknown",
                type: "gmxhr",
                data: redactAILogValue(details.data),
                headers: redactAILogValue(details.headers),
                response: "",
                error: "",
                time: Date.now()
              };
              addRecord(data);
              const onload = details.onload;
              const onerror = details.onerror;
              details.onload = function(response) {
                setItem(id, response.responseText, "");
                data.response = redactAILogValue(details.responseType === "json" ? response.response : response.responseText);
                console.log("%c [请求成功]", "color: green; font-weight: bold", data.url, data);
                onload == null ? void 0 : onload.apply(this, [response]);
              };
              details.onerror = function(response) {
                setItem(id, "", response.error);
                data.error = redactAILogValue(response.error);
                console.log("%c [请求失败]", "color: red; font-weight: bold", data.url, data);
                onerror == null ? void 0 : onerror.apply(this, [response]);
              };
            }
            return gmRequest.apply(this, [details]);
          };
          fetch = (input, init) => {
            if (this.cfg.enable) {
              const id = getId();
              const data = {
                id,
                url: redactAILogValue(typeof input === "string" ? input : input instanceof URL ? input.href : input.url),
                method: (init == null ? void 0 : init.method) || "unknown",
                type: "fetch",
                data: redactAILogValue(init == null ? void 0 : init.body),
                headers: redactAILogValue(init == null ? void 0 : init.headers),
                response: "",
                error: "",
                time: Date.now()
              };
              addRecord(data);
              const res = originalFetch.apply(this, [input, init]);
              res.then((result) => {
                return result.clone().text();
              }).then((result) => {
                setItem(id, result, "");
                data.response = redactAILogValue(result);
                console.log("%c [请求成功]", "color: green; font-weight: bold", data.url, data);
              });
              res.catch((err) => {
                setItem(id, "", String(err));
                data.error = redactAILogValue(String(err));
                console.log("%c [请求失败]", "color: red; font-weight: bold", data.url, data);
              });
              return res;
            } else {
              return originalFetch.apply(this, [input, init]);
            }
          };
        }
      }),
      environmentDetect: new lib.Script({
        name: "🤖 环境检测",
        matches: [["所有页面", /.*/]],
        hideInPanel: true,
        oncomplete() {
          if (self !== top)
            return;
          const matches2 = [
            CXProject.scripts.studyDispatcher.matches,
            ZHSProject.scripts["gxk-study"].matches,
            ZHSProject.scripts.hike.matches,
            ZHSProject.scripts["smart-study"].matches,
            ZHSProject.scripts["wisdom-study"].matches,
            ZHSProject.scripts["xnk-study"].matches,
            ICourseProject.scripts.study.matches,
            IcveMoocProject.scripts.study.matches,
            ZJYProject.scripts.study.matches
          ].flat().map((m) => Array.isArray(m) ? m[1] : m);
          const url = window.location.href;
          const match = matches2.some((regex) => {
            return typeof regex === "string" ? url.includes(regex) : regex.test(url);
          });
          if (!match) {
            return;
          }
          let messageElement;
          visibleDetect();
          function visibleDetect() {
            setTimeout(() => {
              if (!(messageElement == null ? void 0 : messageElement.isConnected))
                messageElement = void 0;
              if (document.visibilityState === "hidden" && !messageElement) {
                messageElement = lib.$message.warn({
                  content: "⚠️检测到浏览器最小化/切屏，脚本可能无法正常运行，请保持网课页面在前台！（如果您正在全屏游戏中可以忽略此警告）",
                  duration: 0
                });
              }
              visibleDetect();
            }, 1e3);
          }
        }
      }),
      menus: new lib.Script({
        name: "📁 菜单管理",
        hideInPanel: true,
        matches: [["所有页面", /.*/]],
        async onactive() {
          const currentStudyScript = [
            [CXProject.scripts.studyDispatcher, CXProject.scripts.study],
            CXProject.scripts.work,
            CXProject.scripts.autoRead,
            ZHSProject.scripts["gxk-study"],
            ZHSProject.scripts["xnk-study"],
            ZHSProject.scripts.hike,
            ZHSProject.scripts["smart-study"],
            ZHSProject.scripts["wisdom-study"],
            ZHSProject.scripts["xnk-study"],
            ZHSProject.scripts["gxk-work"],
            ZHSProject.scripts["xnk-work"],
            ZHSProject.scripts["hike-work"],
            ZHSProject.scripts["smart-work"],
            ZHSProject.scripts["smart-exam"],
            ZHSProject.scripts["xnk-work"],
            [ICourseProject.scripts.dispatcher, ICourseProject.scripts.study],
            ICourseProject.scripts.work,
            [ZJYProject.scripts.dispatcher, ZJYProject.scripts.study],
            ZJYProject.scripts.work,
            IcveMoocProject.scripts.study,
            IcveMoocProject.scripts.work,
            YKTProject.scripts.ai,
            YKTProject.scripts.v2_study
          ].map((m) => {
            const url = window.location.href;
            const data = {
              matches: Array.isArray(m) ? m[0].matches : m.matches,
              target: Array.isArray(m) ? m[1] : m
            };
            if (data.matches.some((regexp) => {
              const r = Array.isArray(regexp) ? regexp[1] : regexp;
              return typeof r === "string" ? url.includes(r) : r.test(url);
            })) {
              return data.target;
            }
            return void 0;
          }).find((m) => m !== void 0);
          await lib.$menu("🏠", { scriptPanelLink: CommonProject.scripts.guide });
          if (currentStudyScript)
            await lib.$menu("🖥️", { scriptPanelLink: currentStudyScript });
          await lib.$menu("🔎", { scriptPanelLink: CommonProject.scripts.workResults });
          await lib.$menu("⚙️", { scriptPanelLink: CommonProject.scripts.settings });
          await lib.$menu("📄", { scriptPanelLink: BackgroundProject.scripts.console });
        }
      })
    }
  });
  const $console = new Proxy({}, {
    get(target, key) {
      return (...msg2) => {
        var _a;
        let logs = BackgroundProject.scripts.console.cfg.logs;
        if (logs.length > 50) {
          logs = logs.slice(-50);
        }
        const stack_str = Error().stack || "";
        const stacks = (_a = stack_str.replace("Error", "").match(/at (.*) \(.+:\/\/.+:(.+):(.+)\)/g)) == null ? void 0 : _a.map((s) => {
          const match = s.match(/at (.*) \(.+:\/\/.+:(.+):(.+)\)/) || [];
          return [match[1], match[2], match[3]];
        });
        logs = logs.concat({
          type: key.toString(),
          content: msg2.join(" "),
          time: Date.now(),
          stack: JSON.stringify([stack_str.split("\n")[0], ...stacks || []])
        });
        BackgroundProject.scripts.console.cfg.logs = logs;
      };
    }
  });
  let globalControlPanel = null;
  const submissionAttempts = /* @__PURE__ */ new Set();
  function assessmentSubmissionKey(worker, suffix = "default") {
    return [location.origin, worker && worker.submissionSessionKey || [location.pathname, location.search, location.hash].join("|"), suffix].join("|");
  }
  function isVisibleAction(element) {
    if (!element || !element.isConnected || element.disabled || element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true" || element.classList.contains("is-disabled") || element.classList.contains("disabled")) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && style.pointerEvents !== "none" && Number(style.opacity || 1) !== 0 && rect.width > 0 && rect.height > 0;
  }
  function actionText(element) {
    return String(element.value || element.innerText || element.textContent || "").replace(/\s+/g, "").replace(/[：:]/g, "").trim();
  }
  function findSafeActions(doc, labels, scope) {
    const root2 = scope || doc;
    const accepted = new Set(labels.map((label) => label.replace(/\s+/g, "")));
    return Array.from(root2.querySelectorAll('button,input[type="submit"],input[type="button"],a[role="button"],.el-button,.ant-btn,.ivu-btn')).filter(
      (element) => isVisibleAction(element) && accepted.has(actionText(element))
    );
  }
  function findPlatformSubmitActions(doc) {
    const host = location.hostname;
    let selectors = [];
    if (/zhihuishu|study\.hike/.test(host)) selectors = [".submit-btn", ".btn-submit", ".answer-submit", ".exam-submit", ".submitAnswer"];
    else if (/chaoxing/.test(host)) selectors = ["#submitTest", ".submitBtn", ".btnSubmit", ".submit-btn"];
    else if (/icve|zjy2/.test(host)) selectors = [".submit_btn", ".submitBtn", ".btn-submit", ".submit-button"];
    else if (/icourse163/.test(host)) selectors = [".j-submit", ".submitBtn", ".btn-submit"];
    else if (/yuketang/.test(host)) selectors = [".submit-btn", ".submit-button", "button[class*=submit]"];
    if (!selectors.length) return [];
    const labels = new Set(["提交", "提交作业", "提交试卷", "交卷"]);
    return Array.from(new Set(selectors.map((selector) => Array.from(doc.querySelectorAll(selector))).flat())).filter(
      (element) => isVisibleAction(element) && labels.has(actionText(element))
    );
  }
  function findHumanVerification(doc = document) {
    const selector = [
      ".yidun_popup", "[class*=captcha]", "[id*=captcha]", "[class*=face-recognition]", "[class*=faceRecognition]",
      "[class*=risk-control]", "[class*=security-verify]", "[class*=verify-dialog]"
    ].join(",");
    const direct = Array.from(doc.querySelectorAll(selector)).find((element) => {
      if (!isVisibleAction(element)) return false;
      const name = String(element.className || "") + " " + String(element.id || "");
      if (/badge|placeholder|hidden|container/i.test(name) && !/popup|dialog|modal/i.test(name)) return false;
      if (element.matches('.yidun_popup,[class*=face-recognition],[class*=faceRecognition],[class*=risk-control],[class*=security-verify]')) return true;
      const text2 = element.innerText || element.textContent || "";
      return /验证码|人脸识别|安全验证|风险验证|滑块验证|请完成验证/.test(text2) || Boolean(element.closest('[role="dialog"],.el-dialog,.ant-modal,.ivu-modal,.layui-layer'));
    });
    if (direct) return direct;
    return Array.from(doc.querySelectorAll('[role="dialog"],.el-dialog,.ant-modal,.ivu-modal,.layui-layer')).find((element) => {
      if (!isVisibleAction(element)) return false;
      return /验证码|人脸识别|安全验证|风险验证|滑块验证/.test(element.innerText || element.textContent || "");
    });
  }
  async function waitForHumanVerification(worker, doc = document) {
    if (!findHumanVerification(doc)) return;
    const wasStopped = Boolean(worker == null ? void 0 : worker.isStop);
    const autoResume = !wasStopped || Boolean(worker && worker.verificationStop);
    if (worker && autoResume) worker.verificationStop = true;
    if (!wasStopped) worker == null ? void 0 : worker.emit("stop");
    const message2 = "检测到验证码、人脸识别或风控验证，自动答题已暂停；完成验证后将自动继续。";
    lib.$message.warn({ content: message2, duration: 0 });
    CommonProject.scripts.settings.methods.notificationBySetting(message2, { extraTitle: "需要人工验证", duration: 60 });
    while (findHumanVerification(doc)) {
      if (worker == null ? void 0 : worker.isClose) return;
      await $.sleep(1e3);
    }
    if (autoResume) {
      if (worker) worker.verificationStop = false;
      worker == null ? void 0 : worker.emit("continuate");
      lib.$message.success("验证已完成，自动流程继续运行。");
    }
  }
  async function clickSafeAction(element, remotePage) {
    if (remotePage) await remotePage.click(element);
    else element.click();
  }
  async function waitForWorkerReady(worker) {
    if (!worker) return true;
    await waitForContinuate(() => worker.isStop && !worker.isClose);
    return !worker.isStop && !worker.isClose;
  }
  async function withOrdinaryNativeConfirmation(worker, doc, action) {
    const targets = Array.from(new Set([doc && doc.defaultView, typeof unsafeWindow !== "undefined" ? unsafeWindow : void 0].filter(Boolean)));
    const restores = [];
    let confirmed = false;
    for (const target of targets) {
      try {
        const original = target.confirm;
        if (typeof original !== "function") continue;
        target.confirm = function(message2) {
          const text2 = String(message2 || "");
          if (/验证码|人脸识别|风控|安全验证|风险验证/.test(text2)) {
            if (worker) {
              worker.nativeConfirmationBlocked = true;
              worker.verificationStop = true;
            }
            worker == null ? void 0 : worker.emit("stop");
            lib.$message.warn({ content: "检测到人工验证提示，自动提交已暂停。", duration: 0 });
            CommonProject.scripts.settings.methods.notificationBySetting("检测到人工验证提示，请在页面完成验证。", { extraTitle: "需要人工验证" });
            return false;
          }
          if (!confirmed && /提交|交卷|是否保存并提交/.test(text2)) {
            confirmed = true;
            return true;
          }
          return original.call(this, message2);
        };
        restores.push(() => target.confirm = original);
      } catch {}
    }
    try { return await action(); }
    finally { for (const restore of restores.reverse()) try { restore(); } catch {} }
  }
  async function completeOrdinaryConfirmation(worker, doc = document, remotePage) {
    await $.sleep(600);
    await waitForHumanVerification(worker, doc);
    const dialogs = Array.from(doc.querySelectorAll('[role="dialog"],.el-message-box,.el-dialog,.ant-modal,.ivu-modal,.layui-layer')).filter(isVisibleAction);
    const candidates = Array.from(new Set(dialogs.map((dialog) => findSafeActions(doc, ["确定", "确认", "确认提交", "继续提交", "确定交卷"], dialog)).flat()));
    if (candidates.length === 1) {
      await withOrdinaryNativeConfirmation(worker, doc, () => clickSafeAction(candidates[0], remotePage));
      if (worker && worker.nativeConfirmationBlocked) return false;
      await $.sleep(500);
      await waitForHumanVerification(worker, doc);
      return true;
    }
    if (candidates.length > 1) {
      lib.$message.error({ content: "检测到多个提交确认按钮，已停止自动确认以避免误操作。", duration: 0 });
      return false;
    }
    return true;
  }
  async function safeGenericSubmit(worker, options = {}) {
    const doc = options.document || document;
    const key = assessmentSubmissionKey(worker, options.key || "default");
    if (submissionAttempts.has(key)) {
      lib.$message.warn({ content: "本次作业已尝试提交，为避免重复提交不会再次点击。", duration: 0 });
      return false;
    }
    await waitForHumanVerification(worker, doc);
    if (!await waitForWorkerReady(worker)) return false;
    const platformCandidates = findPlatformSubmitActions(doc);
    const candidates = Array.from(new Set([...platformCandidates, ...findSafeActions(doc, ["提交", "提交作业", "提交试卷", "交卷"])]));
    if (candidates.length !== 1) {
      await safeGenericSave(doc);
      worker == null ? void 0 : worker.emit("stop");
      setAIRuntimeStatus(candidates.length ? "提交控件存在歧义，已暂停" : "未找到提交控件，已暂停");
      lib.$message.error({ content: candidates.length ? "检测到多个提交控件，已暂停以避免误提交。" : "未找到唯一且明确的提交控件，答案已保留在页面。", duration: 0 });
      return false;
    }
    submissionAttempts.add(key);
    if (worker) worker.nativeConfirmationBlocked = false;
    await withOrdinaryNativeConfirmation(worker, doc, () => clickSafeAction(candidates[0], options.remotePage));
    if (worker && worker.nativeConfirmationBlocked) return false;
    return await completeOrdinaryConfirmation(worker, doc, options.remotePage);
  }
  async function safeGenericSave(doc = document) {
    const candidates = findSafeActions(doc, ["保存", "暂存", "保存答案"]);
    if (candidates.length === 1) {
      candidates[0].click();
      return true;
    }
    return false;
  }
  function flattenWorkResults(value, target = []) {
    for (const item of value || []) {
      if (Array.isArray(item)) flattenWorkResults(item, target);
      else if (item) target.push(item);
    }
    return target;
  }
  function failedResultSummary(list) {
    return list.map((result, index) => {
      if (result.finish === true || result.result && result.result.finish === true) return "";
      const ctx = result.ctx || {};
      const title = String(result.question || (ctx.elements && ctx.elements.title || []).map((element) => element.innerText || element.textContent || "").join(" ") || "第 " + (index + 1) + " 题").replace(/\s+/g, " ").trim().slice(0, 36);
      const aiError = (ctx.searchInfos || []).find((info) => info.error);
      const reason = String(result.error || aiError && aiError.error || "未返回有效答案或未能验证页面写入").replace(/\s+/g, " ").slice(0, 80);
      return title + "（" + reason + "）";
    }).filter(Boolean);
  }
  async function autoSubmitAssessment(worker, results, options = {}) {
    const list = flattenWorkResults(results);
    const finished = list.filter((result) => result.finish === true || result.result && result.result.finish === true).length;
    const rate = list.length ? finished / list.length * 100 : 0;
    const threshold = Number(CommonProject.scripts.settings.cfg.upload || 100);
    if (worker == null ? void 0 : worker.isClose) return { rate, submitted: false };
    if (rate + 1e-8 < threshold) {
      const saved = options.save ? await options.save() !== false : await safeGenericSave(options.document || document);
      const failures = failedResultSummary(list);
      const failureText = failures.length ? " 未答题：" + failures.slice(0, 8).join("；") + (failures.length > 8 ? "；另有 " + (failures.length - 8) + " 题，详见 AI 答题结果。" : "") : "";
      const content = "自动答题完成率 " + rate.toFixed(2) + "% ，未达到 " + threshold + "% 提交阈值；" + (saved ? "已自动保存答案并停止提交。" : "未找到唯一安全的保存控件，答案保留在页面，请手动保存。") + failureText;
      lib.$message.warn({ content, duration: 0 });
      CommonProject.scripts.settings.methods.notificationBySetting(content, { extraTitle: "未自动提交" });
      worker == null ? void 0 : worker.emit("stop");
      setAIRuntimeStatus("完成率未达阈值，未提交");
      return { rate, submitted: false };
    }
    const delay = Number(options.delay != null ? options.delay : CommonProject.scripts.settings.cfg.stopSecondWhenFinish || 3);
    setAIRuntimeStatus("达到提交阈值，等待 " + delay + " 秒");
    lib.$message.success({ content: "完成率 " + rate.toFixed(2) + "% ，" + delay + " 秒后自动提交。", duration: delay });
    await $.sleep(Math.max(0, delay) * 1e3);
    if (worker == null ? void 0 : worker.isClose) return { rate, submitted: false };
    await waitForHumanVerification(worker, options.document || document);
    if (!await waitForWorkerReady(worker)) return { rate, submitted: false };
    let submitted;
    if (options.submit) {
      const key = assessmentSubmissionKey(worker, options.key || "platform");
      if (submissionAttempts.has(key)) return { rate, submitted: false };
      submissionAttempts.add(key);
      if (worker) worker.nativeConfirmationBlocked = false;
      submitted = await withOrdinaryNativeConfirmation(worker, options.document || document, options.submit);
      if (worker && worker.nativeConfirmationBlocked) submitted = false;
      if (submitted !== false) submitted = await completeOrdinaryConfirmation(worker, options.document || document, options.remotePage);
    } else {
      submitted = await safeGenericSubmit(worker, options);
    }
    const content = submitted === false ? "自动提交未完成，请根据页面提示处理。" : "已完成自动提交。";
    setAIRuntimeStatus(submitted === false ? "自动提交未完成" : "自动提交完成");
    lib.$message[submitted === false ? "warn" : "success"]({ content, duration: submitted === false ? 0 : 10 });
    CommonProject.scripts.settings.methods.notificationBySetting(content, { extraTitle: "自动答题" });
    return { rate, submitted: submitted !== false };
  }
  function commonWork(script2, options) {
    CommonProject.scripts.render.methods.pin(script2);
    let worker;
    let startBtnPressed = false;
    let checkFailed = false;
    let running = false;
    const createWorkControlPanel = () => {
      const { controlBtn, restartBtn, startBtn } = createWorkerControl({
        workerProvider: () => worker,
        onStart: async () => {
          startBtnPressed = true;
          if (checkMessage instanceof lib.MessageElement) {
            checkMessage.remove();
          }
          await closeAIConfigWarning();
          start2();
        },
        onRestart: async () => {
          var _a;
          worker == null ? void 0 : worker.emit("close");
          await ((_a = options.onRestart) == null ? void 0 : _a.call(options));
          start2();
        }
      });
      startBtn.style.flex = "1";
      startBtn.style.padding = "4px";
      restartBtn.style.flex = "1";
      restartBtn.style.padding = "4px";
      controlBtn.style.flex = "1";
      controlBtn.style.padding = "4px";
      const container2 = lib.h(
        "div",
        { style: { marginTop: "12px", display: "flex" } },
        running ? [controlBtn, restartBtn] : [startBtn]
      );
      globalControlPanel = container2;
      return { container: container2, startBtn, restartBtn, controlBtn };
    };
    const workResultPanel = () => CommonProject.scripts.workResults.methods.createWorkResultsPanel();
    const sync_script = [script2];
    if (options.enable_control_panel) {
      sync_script.push(CommonProject.scripts.workResults);
    }
    for (const script22 of sync_script) {
      script22.on("render", () => {
        var _a, _b;
        let gotoSettingsBtnContainer = "";
        if (checkFailed) {
          const gotoSettingsBtn = lib.$ui.button("👉 前往配置 AI 模型", {
            className: "base-style-button",
            style: { flex: "1", padding: "4px" }
          });
          gotoSettingsBtn.style.flex = "1";
          gotoSettingsBtn.style.padding = "4px";
          gotoSettingsBtn.onclick = () => {
            CommonProject.scripts.render.methods.pin(CommonProject.scripts.settings);
          };
          gotoSettingsBtnContainer = lib.h("div", { style: { display: "flex" } }, [gotoSettingsBtn]);
        }
        (_b = (_a = script22.panel) == null ? void 0 : _a.body) == null ? void 0 : _b.replaceChildren(
          lib.h("div", { style: { marginTop: "12px" } }, [
            gotoSettingsBtnContainer,
            ...options.enable_control_panel ? [globalControlPanel || createWorkControlPanel().container] : [],
            workResultPanel()
          ])
        );
      });
    }
    const workOptions = CommonProject.scripts.settings.methods.getWorkOptions();
    let checkMessage = workPreCheckMessage({
      onrun: () => startBtnPressed === false && start2(),
      onclose: (_, closedMsg) => checkMessage = closedMsg,
      onNoAIConfig: () => {
        checkFailed = true;
      },
      ...workOptions,
      start_delay_seconds: options.start_delay_seconds
    });
    const start2 = async () => {
      var _a, _b, _c, _d;
      await ((_a = options.beforeRunning) == null ? void 0 : _a.call(options));
      running = true;
      worker = options.workerProvider(workOptions);
      if (worker) {
        (_b = options.onWorkerCreated) == null ? void 0 : _b.call(options, worker);
      }
      const { container: container2, controlBtn } = createWorkControlPanel();
      (_d = (_c = script2.panel) == null ? void 0 : _c.body) == null ? void 0 : _d.replaceChildren(container2, workResultPanel());
      worker == null ? void 0 : worker.once("done", () => {
        running = false;
        globalControlPanel = null;
        controlBtn.disabled = true;
      });
    };
  }
  function createWorkerControl(options) {
    let stop = false;
    let stopMessage;
    const startBtn = lib.$ui.button("▶️开始答题");
    const restartBtn = lib.$ui.button("🔃重新答题");
    const controlBtn = lib.$ui.button("⏸暂停");
    startBtn.onclick = () => {
      startBtn.remove();
      options.onStart();
    };
    restartBtn.onclick = () => {
      stopMessage == null ? void 0 : stopMessage.remove();
      options.onRestart();
    };
    controlBtn.onclick = () => {
      var _a;
      stop = !stop;
      const worker = options.workerProvider();
      (_a = worker == null ? void 0 : worker.emit) == null ? void 0 : _a.call(worker, stop ? "stop" : "continuate");
      controlBtn.value = stop ? "▶️继续" : "⏸️暂停";
      if (stop) {
        stopMessage = lib.$message.warn({ duration: 0, content: "暂停中..." });
      } else {
        stopMessage == null ? void 0 : stopMessage.remove();
      }
    };
    return { startBtn, restartBtn, controlBtn };
  }
  function optimizationElementWithImage(root2, clone_node = false) {
    const clone = clone_node ? root2.cloneNode(true) : root2;
    for (const img of Array.from(clone.querySelectorAll("img"))) {
      if (Array.from(img.parentElement.querySelectorAll("span")).some(
        (e) => {
          var _a;
          return e.style.fontSize === "0px" && ((_a = e.textContent) == null ? void 0 : _a.includes(img.src));
        }
      )) {
        continue;
      }
      const src2 = document.createElement("span");
      src2.innerText = img.src;
      src2.style.fontSize = "0px";
      img.after(src2);
    }
    return clone;
  }
  function createUnVisibleTextOfImage(img) {
    const src2 = document.createElement("span");
    src2.innerText = img.src;
    src2.style.fontSize = "0px";
    img.after(src2);
  }
  function simplifyWorkResult(results, titleTransform) {
    var _a, _b, _c, _d, _e, _f;
    const res = [];
    let i = 0;
    for (const wr of results) {
      const ques = (titleTransform == null ? void 0 : titleTransform(((_a = wr.ctx) == null ? void 0 : _a.elements.title) || [], i)) || ((_c = (_b = wr.ctx) == null ? void 0 : _b.elements.title) == null ? void 0 : _c.map((e) => e == null ? void 0 : e.innerText.trim()).filter(Boolean).join("<br>")) || "";
      res.push({
        requested: wr.requested,
        resolved: wr.resolved,
        error: wr.error,
        type: (_d = wr.ctx) == null ? void 0 : _d.type,
        question: ques,
        finish: (_e = wr.result) == null ? void 0 : _e.finish,
        searchInfos: ((_f = wr.ctx) == null ? void 0 : _f.searchInfos.map((sr) => ({
          error: sr.error,
          name: sr.name,
          homepage: sr.homepage,
          results: sr.results.map((ans) => [ans.question, ans.answer, ans.extra_data || {}])
        }))) || []
      });
      i++;
    }
    return res;
  }
  function removeRedundantWords(str, words) {
    for (const word of words.map((w) => w.trim())) {
      str = str.replace(word, "");
    }
    return str;
  }
  let aiConfigUnsetMessage;
  const aiConfigWarning = lib.cors.defineTopFunction((duration) => {
    const setting = lib.h("button", { className: "base-style-button-secondary" }, "通用-全局设置");
    setting.onclick = () => {
      CommonProject.scripts.render.methods.pin(CommonProject.scripts.settings);
      setTimeout(() => {
        var _a, _b;
        (_b = (_a = lib.$elements.root) == null ? void 0 : _a.querySelector('[data-ocs-role="ai-api-key"]')) == null ? void 0 : _b.click();
      }, 500);
    };
    aiConfigUnsetMessage == null ? void 0 : aiConfigUnsetMessage.remove();
    aiConfigUnsetMessage = lib.$message.warn({
      content: lib.h("span", {}, [getAIConfigError() || "AI 配置不完整", "，无法自动答题，请切换到 ", setting, " 页面完成配置。"]),
      duration
    });
  });
  const closeAIConfigWarning = lib.cors.defineTopFunction(() => {
    aiConfigUnsetMessage == null ? void 0 : aiConfigUnsetMessage.remove();
    aiConfigUnsetMessage = void 0;
  });
  function workPreCheckMessage(options) {
    var _a;
    const { onrun, onNoAIConfig, onclose, ...opts } = options;
    if (getAIConfigError()) {
      onNoAIConfig == null ? void 0 : onNoAIConfig(opts);
      return aiConfigWarning(0);
    } else {
      options.start_delay_seconds = (_a = options.start_delay_seconds) != null ? _a : 5;
      return lib.$message.info({
        duration: options.start_delay_seconds,
        content: lib.h("span", [
          `${options.start_delay_seconds}秒后自动答题，`,
          lib.$ui.preventText({
            name: "点击取消",
            delay: options.start_delay_seconds,
            ondefault: (span) => {
              onrun(opts);
            },
            onprevent(span) {
              const closedMessage = lib.$message.warn({
                content: "已关闭此次的自动答题，请手动开启或者忽略此警告。",
                duration: 0
              });
              if (closedMessage) {
                onclose == null ? void 0 : onclose(opts, closedMessage);
              }
            }
          })
        ])
      });
    }
  }
  function createRangeTooltip(input, defaultValue, transform) {
    input.addEventListener("change", () => {
      input.setAttribute("data-title", transform(input.value || input.getAttribute("value") || defaultValue));
    });
    input.setAttribute("data-title", transform(input.value || input.getAttribute("value") || defaultValue));
  }
  async function playMedia(playFunction) {
    const tryPlayMedia = () => {
      return new Promise((resolve, reject) => {
        try {
          const playRes = playFunction();
          if (playRes) {
            playRes.then(resolve).catch(reject);
          } else {
            resolve();
          }
        } catch (err) {
          reject(err);
        }
      });
    };
    try {
      await tryPlayMedia();
      return true;
    } catch (err) {
      console.error(err);
      if (String(err).includes(`failed because the user didn't interact with the document first`)) {
        lib.$modal.alert({
          content: "播放音视频失败，由于浏览器的用户隐私保护措施，如果要播放带有音量的视频，或者某些无法自动播放音视频的网站，您必须先点击一次页面上的任意位置脚本才能进行音视频的播放，后续无需重新点击。",
          onClose: async () => {
            await tryPlayMedia();
          }
        });
        return true;
      } else if (String(err).includes("The element has no supported sources")) {
        $console.error("当前视频无法播放。");
      } else {
        $console.error("播放视频时发生未知错误：" + String(err));
      }
      return false;
    }
  }
  function enableCopy(elements2) {
    function hackSelect(target) {
      if (target) {
        const _original_select = target.onselectstart;
        const _original_oncopy = target.oncopy;
        const _original_onpaste = target.onpaste;
        const _original_onkeydown = target.onkeydown;
        target.onselectstart = (e) => {
          _original_select == null ? void 0 : _original_select.apply(target, [e]);
          e.stopPropagation();
          e.returnValue = true;
          return true;
        };
        target.oncopy = (e) => {
          _original_oncopy == null ? void 0 : _original_oncopy.apply(target, [e]);
          e.stopPropagation();
          e.returnValue = true;
          return true;
        };
        target.onpaste = (e) => {
          _original_onpaste == null ? void 0 : _original_onpaste.apply(target, [e]);
          e.stopPropagation();
          e.returnValue = true;
          return true;
        };
        target.onkeydown = (e) => {
          _original_onkeydown == null ? void 0 : _original_onkeydown.apply(target, [e]);
          e.stopPropagation();
          e.returnValue = true;
          return true;
        };
      }
    }
    for (const el of elements2) {
      hackSelect(el);
    }
  }
  let popupWin;
  window.addEventListener("beforeunload", () => {
    popupWin == null ? void 0 : popupWin.close();
  });
  function createQuestionTitleExtra(question) {
    const space = lib.$ui.space(
      [
        lib.$ui.copy("复制", question),
        lib.h("span", { className: "question-title-extra-btn", innerText: "🌏百度一下" }, (btn) => {
          btn.onclick = () => {
            popupWin == null ? void 0 : popupWin.close();
            popupWin = $.createCenteredPopupWindow(`https://www.baidu.com/s?wd=${question}`, "百度搜索", {
              width: 1e3,
              height: 800,
              resizable: true,
              scrollbars: true
            });
          };
        })
      ],
      { x: 4 }
    );
    space.style.marginTop = "6px";
    space.style.textAlign = "right";
    return lib.h("div", { style: { textAlign: "right" } }, [space]);
  }
  function msg(type, attrs) {
    lib.$message[type](attrs);
    if (type === "success") {
      type = "info";
    }
    let content = "";
    if (typeof attrs === "string") {
      content = attrs;
    } else {
      if (attrs.content instanceof HTMLElement) {
        content = attrs.content.innerText;
      } else if (typeof attrs.content === "string") {
        content = attrs.content.toString();
      }
    }
    $console[type](content);
  }
  const $msg = {
    info: (attrs) => msg("info", attrs),
    warn: (attrs) => msg("warn", attrs),
    error: (attrs) => msg("error", attrs),
    success: (attrs) => msg("success", attrs)
  };
  const playbackRate = {
    label: "视频倍速",
    tag: "select",
    options: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 6, 8, 16].map((rate) => [rate.toString(), rate + " x"]),
    defaultValue: "1"
  };
  const volume = {
    label: "音量调节",
    attrs: { type: "range", step: "0.05", min: "0", max: "1" },
    defaultValue: 0,
    onload() {
      createRangeTooltip(this, "0", (val) => `${parseFloat(val) * 100}%`);
    }
  };
  const restudy = {
    label: "复习模式",
    attrs: { title: "已经完成的视频继续学习", type: "checkbox" },
    defaultValue: false
  };
  const definition = {
    label: "清晰度",
    tag: "select",
    defaultValue: "line1bq",
    options: [
      ["line1bq", "流畅"],
      ["line1gq", "高清"]
    ]
  };
  const workNotes = {
    defaultValue: lib.$ui.notes([
      "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
      "进入作业或考试页面后，将在 5 秒倒计时结束后自动开始答题。",
      "⚠️禁止同时开多个作业/考试页面。"
    ]).outerHTML
  };
  const dropdownStyle = {
    labelClassName: "checkbox-label",
    providerClassName: "checkbox-input",
    enableForAttribute: true,
    onload(el) {
      const checked = this.checked;
      el.classList.toggle("checked", checked);
      this.addEventListener("change", () => {
        el.classList.toggle("checked", this.checked);
      });
    }
  };
  const TAB_WORK_RESULTS_KEY = "common.work-results.results";
  const state$6 = {
    workResult: {
      questionPositionSyncHandler: {
        cx: (index) => {
          var _a;
          const el = (_a = document.querySelectorAll('[id*="sigleQuestionDiv"], .questionLi')) == null ? void 0 : _a.item(index);
          if (el) {
            window.scrollTo({
              top: el.getBoundingClientRect().top + window.pageYOffset - 50,
              behavior: "smooth"
            });
          }
        },
        "zhs-gxk": (index) => {
          var _a;
          (_a = document.querySelectorAll(".answerCard_list ul li").item(index)) == null ? void 0 : _a.click();
        },
        "zhs-xnk": (index) => {
          var _a;
          (_a = document.querySelectorAll(".jobclassallnumber-div li[questionid]").item(index)) == null ? void 0 : _a.click();
        },
        "zhs-smart": (index) => {
          var _a;
          (_a = document.querySelectorAll('[role="treeitem"] .font-sec-style-node').item(index)) == null ? void 0 : _a.click();
        },
        "zhs-fusion": (index) => {
          var _a;
          (_a = document.querySelectorAll(".right-box .list .item").item(index)) == null ? void 0 : _a.click();
        },
        "zhs-hike": (index) => {
          var _a;
          (_a = document.querySelectorAll(".q_main_right .card_ul .card_li").item(index)) == null ? void 0 : _a.click();
        },
        icve: (index) => {
          var _a;
          (_a = document.querySelectorAll(`.sheet_nums [id*="sheetSeq"]`).item(index)) == null ? void 0 : _a.click();
        },
        zjy: (index) => {
          var _a;
          (_a = document.querySelectorAll(".subjectDet").item(index)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "center" });
        },
        icourse: (index) => {
          var _a;
          (_a = document.querySelectorAll(".u-questionItem,[class*=questionBody]").item(index)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };
  const CommonProject = lib.Project.create({
    name: "通用",
    domains: [],
    scripts: {
      guide: new lib.Script({
        name: "🏠 使用教程",
        matches: [["所有页面", /.*/]],
        namespace: "common.guide",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "打开任意网课平台，进入视频、作业页面等待脚本运行，",
              "⚠️ 禁止与其他脚本一起使用（不兼容），也不能开多个相同脚本",
              "⚠️ 禁止最小化浏览器、切屏，否则可能导致脚本无法运行！"
            ]).outerHTML
          }
        },
        onrender({ panel }) {
          // 已移除「兼容的网课平台」「快捷访问」两块卡片
          panel.body.replaceChildren();
        }
      }),
      settings: new lib.Script({
        name: "⚙️ 全局设置",
        matches: [["所有页面", /.*/]],
        namespace: "common.settings",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "✨鼠标移动到按钮或者输入框，可以看到提示！",
              "请先设置 AI 模型、Endpoint 和所需的 API Key。",
              "进入章节测试、作业或考试页面后会自动答题，并在达到阈值时自动提交。"
            ]).outerHTML
          },
          uiTheme: {
            separator: "界面",
            label: "主题",
            tag: "select",
            defaultValue: "auto",
            options: [
              ["auto", "跟随系统"],
              ["light", "浅色"],
              ["dark", "深色"]
            ],
            attrs: { title: "悬浮窗配色。跟随系统时会随操作系统的深色模式自动切换。" },
            onload() {
              const original = this.onchange;
              this.onchange = () => {
                original == null ? void 0 : original();
                applyOCSTheme(this.value);
              };
            }
          },
          aiProvider: {
            separator: "AI 自动答题设置",
            label: "模型提供商",
            tag: "select",
            defaultValue: legacyAIConfig.provider || "deepseek",
            options: Object.entries(AI_PROVIDERS).map(([value, item]) => [value, item.name]),
            attrs: { title: "云端 API 可能计费；本地 llama.cpp 默认可不设 Key，但服务启用鉴权时必须填写其密钥。" },
            onload() {
              const original = this.onchange;
              this.onchange = () => {
                original == null ? void 0 : original();
                const profile = AI_PROVIDERS[this.value] || AI_PROVIDERS.custom;
                CommonProject.scripts.settings.cfg.aiEndpoint = profile.endpoint;
                CommonProject.scripts.settings.cfg.aiModel = profile.model;
                const endpoint = ocsPanelById("common.settings.aiEndpoint");
                const model = ocsPanelById("common.settings.aiModel");
                if (endpoint) endpoint.value = profile.endpoint;
                if (model) model.value = profile.model;
                aiFatalState = { signature: "", message: "" };
              };
            }
          },
          aiEndpoint: {
            label: "Endpoint",
            defaultValue: legacyAIConfig.endpoint || AI_PROVIDERS.deepseek.endpoint,
            enableForAttribute: true,
            attrs: { title: "llama.cpp 可填写基础地址 http://127.0.0.1:8080/v1，其他提供商填写完整 Chat Completions 地址。", placeholder: "http://127.0.0.1:8080/v1 或 https://.../chat/completions" }
          },
          aiModel: {
            label: "模型名称",
            defaultValue: legacyAIConfig.model || AI_PROVIDERS.deepseek.model,
            enableForAttribute: true,
            attrs: { title: "使用接口实际支持的模型 ID", placeholder: "模型 ID" }
          },
          aiResetEndpointButton: {
            label: "恢复默认接口",
            defaultValue: "恢复当前提供商默认 Endpoint / 模型",
            attrs: { type: "button", title: "404 时可恢复所选提供商的官方兼容接口；自定义提供商没有默认地址。" },
            onload() {
              this.onclick = () => {
                const provider = String(CommonProject.scripts.settings.cfg.aiProvider || "deepseek");
                const profile = AI_PROVIDERS[provider];
                if (!profile || !profile.endpoint) {
                  lib.$message.warn({ content: "自定义提供商没有默认地址，请填写完整的 Chat Completions Endpoint。", duration: 0 });
                  return;
                }
                CommonProject.scripts.settings.cfg.aiEndpoint = profile.endpoint;
                if (profile.model) CommonProject.scripts.settings.cfg.aiModel = profile.model;
                const endpointInput = ocsPanelById("common.settings.aiEndpoint");
                const modelInput = ocsPanelById("common.settings.aiModel");
                if (endpointInput) endpointInput.value = profile.endpoint;
                if (modelInput && profile.model) modelInput.value = profile.model;
                aiFatalState = { signature: "", message: "" };
                aiAnswerCache.clear();
                setAIRuntimeStatus("已恢复 " + profile.name + " 默认接口，请重新连接测试");
                lib.$message.success("已恢复 " + profile.name + " 默认 Endpoint" + (profile.model ? " 与模型" : "") + "，请重新测试 AI 接口。");
              };
            }
          },
          aiApiKeyButton: {
            label: "API Key",
            defaultValue: "设置 / 更新 API Key",
            attrs: { type: "button", title: "密钥单独保存在用户脚本存储中，不会进入日志或设置导出。" },
            onload() {
              const button = this;
              button.setAttribute("data-ocs-role", "ai-api-key");
              const refresh = () => button.value = getAISecret() ? "已保存（点击更新）" : "设置 / 更新 API Key";
              refresh();
              button.onclick = () => {
                const input = lib.h("input", {
                  type: "password",
                  value: getAISecret(),
                  placeholder: "云端 API Key；本地服务启用鉴权时填写服务密钥",
                  className: "ai-secret-input",
                  autocomplete: "off",
                  spellcheck: false,
                  style: {
                    display: "block", width: "100%", boxSizing: "border-box",
                    padding: "8px 10px", border: "1px solid var(--ocs-border)", borderRadius: "6px",
                    backgroundColor: "var(--ocs-input-bg)", color: "var(--ocs-text)", outline: "none", fontFamily: "var(--ocs-font-mono)"
                  }
                });
                const toggle = lib.h("button", { className: "base-style-button-secondary", style: { marginTop: "8px" } }, "显示 / 隐藏");
                toggle.onclick = () => input.type = input.type === "password" ? "text" : "password";
                lib.$modal.confirm({
                  title: "AI API Key",
                  width: 520,
                  content: lib.h("div", [
                    input,
                    toggle,
                    lib.h("div", { className: "secondary", style: { marginTop: "8px" } }, "密钥仅发送到当前配置的 Endpoint；本地 llama.cpp 启用鉴权时也需填写。留空保存将删除密钥。")
                  ]),
                  confirmButtonText: "保存",
                  onConfirm() {
                    setAISecret(input.value);
                    refresh();
                    lib.$message.success("API Key 已更新");
                  }
                });
              };
            }
          },
          aiRuntimeStatus: {
            label: "运行状态",
            defaultValue: "待命",
            attrs: { type: "text", readonly: true, title: "仅显示当前页面状态，不会写入日志或导出密钥。" },
            onload() {
              aiRuntimeStatusElements.add(this);
              this.classList.add("ocs-ai-status");
              setAIRuntimeStatus(aiRuntimeStatus);
            }
          },
          aiStatsView: {
            label: "本页统计",
            defaultValue: "",
            attrs: { type: "text", readonly: true, title: "仅统计当前页面，刷新后清零。Token 数取自接口返回的 usage 字段。" },
            onload() {
              this.value = formatAIStats();
              aiStatsElements.add(this);
            }
          },
          aiTestButton: {
            label: "连接测试",
            defaultValue: "测试 AI 接口",
            attrs: { type: "button" },
            onload() {
              const button = this;
              button.onclick = async () => {
                button.disabled = true;
                button.value = "测试中...";
                try {
                  const info = await testAIConnection();
                  button.value = "连接成功";
                  lib.$message.success(info.connectionOnly ? "本地 llama.cpp 聊天接口已连通；答题质量请以实际题目结果为准。" : "AI 接口连接成功：" + info.name);
                } catch (error) {
                  button.value = "测试失败";
                  lib.$message.error({ content: String(error.message || error), duration: 0 });
                } finally {
                  setTimeout(() => {
                    button.disabled = false;
                    button.value = "测试 AI 接口";
                  }, 2e3);
                }
              };
            }
          },
          aiPersistentCache: {
            label: "本地答案缓存",
            defaultValue: true,
            attrs: { type: "checkbox", title: "把 AI 成功返回的答案缓存在本机浏览器（IndexedDB，按网课平台域名隔离，30 天过期），相同题目再次出现时直接复用，节省 Token 和时间。答案有误时可点下方按钮清空。" }
          },
          aiClearCacheButton: {
            label: "缓存管理",
            defaultValue: "清空 AI 答案缓存",
            attrs: { type: "button", title: "清空本页内存缓存与本地持久化缓存。" },
            onload() {
              this.onclick = async () => {
                try {
                  await aiPCacheClear();
                  lib.$message.success("AI 答案缓存已清空");
                } catch (error) {
                  aiAnswerCache.clear();
                  lib.$message.warn("本地缓存不可用，已清空本页内存缓存");
                }
              };
            }
          },
          aiVisionMode: {
            label: "图片题",
            tag: "select",
            defaultValue: "auto",
            options: [
              ["auto", "自动识别模型能力"],
              ["enabled", "强制发送图片"],
              ["disabled", "不发送图片"]
            ],
            attrs: { title: "自动模式只向已识别为多模态的模型发送图片；不支持图片时该题会标记为未完成。" }
          },
          aiTemperature: {
            label: "Temperature",
            defaultValue: legacyAIConfig.temperature != null ? legacyAIConfig.temperature : 0.1,
            attrs: { type: "number", min: 0, max: 2, step: 0.1 }
          },
          aiMaxTokens: {
            label: "最大输出 Token",
            defaultValue: legacyAIConfig.maxTokens || 4096,
            attrs: { type: "number", min: 256, max: 16384, step: 128, title: "推理模型（如 deepseek-v4-flash 默认开启思考）的思考过程也占用该额度，过小会导致填空题空返回、简答题 JSON 被截断；建议不低于 4096。" }
          },
          aiTimeout: {
            label: "请求超时（秒）",
            defaultValue: 90,
            attrs: { type: "number", min: 10, max: 300, step: 1 }
          },
          aiRetries: {
            label: "失败重试（次）",
            defaultValue: 2,
            attrs: { type: "number", min: 0, max: 2, step: 1, title: "最多重试两次；仅重试超时、网络错误、429 和 5xx。" }
          },
          aiLocalTimeout: {
            separator: "本地 llama.cpp 请求设置",
            label: "本地请求超时（秒）",
            defaultValue: 300,
            attrs: { type: "number", min: 30, max: 1800, step: 10, title: "仅用于 llama.cpp；本地模型生成较慢时可调高。" }
          },
          aiLocalMaxTokens: {
            label: "本地最大输出 Token",
            defaultValue: 256,
            attrs: { type: "number", min: 64, max: 4096, step: 64, title: "仅用于 llama.cpp；题目答案通常较短，过大可能导致长时间占用 slot。" }
          },
          aiLocalRetries: {
            label: "本地失败重试（次）",
            defaultValue: 0,
            attrs: { type: "number", min: 0, max: 2, step: 1, title: "仅用于 llama.cpp；默认不在超时后重复占用本地 slot。" }
          },
          aiSystemPrompt: {
            label: "系统提示词",
            tag: "textarea",
            defaultValue: legacyAIConfig.systemPrompt || DEFAULT_AI_SYSTEM_PROMPT,
            attrs: { style: { minWidth: "240px", minHeight: "90px" } }
          },
          aiKbEnabled: {
            separator: "知识库答题（API 接入）",
            label: "启用知识库",
            defaultValue: false,
            attrs: { type: "checkbox", title: "开启后，每道题先调用自建知识库后端检索相关片段，再连同片段交给 AI 作答。资料在后端存储与解析，脚本本地不留存。" }
          },
          aiKbApiBase: {
            label: "知识库 API 地址",
            defaultValue: "",
            attrs: { type: "text", placeholder: "http://127.0.0.1:8000", title: "自建知识库服务地址，需实现 GET /api/kb/libs 与 POST /api/kb/search，接口约定见仓库 README。" }
          },
          aiKbApiKey: {
            label: "知识库 API Key",
            defaultValue: "",
            attrs: { type: "password", title: "可选。填写后以 Bearer Token 随知识库请求发送。" }
          },
          aiKbTopK: {
            label: "知识库检索片段数",
            defaultValue: 5,
            attrs: { type: "number", min: 1, max: 15, step: 1, title: "每题注入多少段最相关资料。资料越多覆盖越全，但更耗 Token，建议 3-8。" }
          },
          aiKbContextChars: {
            label: "资料字数上限",
            defaultValue: 3000,
            attrs: { type: "number", min: 500, max: 12000, step: 100, title: "单次随题目发送给 AI 的知识库资料总字数上限，按模型上下文窗口调整。" }
          },
          aiKbButton: {
            label: "知识库选择",
            defaultValue: "选择参与答题的后端知识库",
            attrs: { type: "button" },
            onload() {
              this.onclick = () => openKBManager();
            }
          },
          aiKbStatus: {
            label: "知识库状态",
            defaultValue: "未启用",
            attrs: { type: "text", readonly: true, title: "显示知识库后端连接情况与当前勾选的库。" },
            onload() {
              kbStatusElements.add(this);
              void kbRefreshStatus();
            }
          },
          upload: {
            label: "自动提交阈值",
            tag: "select",
            defaultValue: 100,
            options: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rate) => [
              rate,
              "完成 " + rate + "% 后自动提交",
              "只统计已成功写入页面的答案；低于阈值时保存并停止。"
            ]),
            attrs: { title: "默认 100%。验证码、人脸识别或风控出现时会暂停，完成验证后自动继续。" }
          },
          thread: {
            label: "线程数量（个）",
            attrs: {
              type: "number",
              min: 1,
              step: 1,
              max: 3,
              title: "同一时间工作的 AI 请求数量。并发过高可能触发模型接口限流。"
            },
            defaultValue: 1
          },
          "work-when-no-job": {
            defaultValue: false,
            label: "(仅超星)强制答题",
            attrs: {
              type: "checkbox",
              title: "当章节测试左上角并没有黄色任务点的时候依然进行答题（没有任务点说明此作业可能不计入总成绩，如果老师要求则可以开启）"
            }
          },
          "randomWork-choice": {
            defaultValue: false,
            label: "(仅超星)随机选择",
            attrs: { type: "checkbox", title: "AI 未返回有效答案时随机选择一个选项，仅支持超星章节测试；随机答案不计入自动提交完成率。" }
          },
          "randomWork-complete": {
            defaultValue: false,
            label: "(仅超星)随机填空",
            attrs: { type: "checkbox", title: "AI 未返回有效答案时随机填写文案，仅支持超星章节测试；随机答案不计入自动提交完成率。" }
          },
          "randomWork-completeTexts-textarea": {
            defaultValue: ["不会", "不知道", "不清楚", "不懂", "不会写"].join("\n"),
            label: "(仅超星)随机填空文案",
            tag: "textarea",
            showIf: "common.settings.randomWork-complete",
            attrs: { title: "每行一个，随机填入", style: { minWidth: "200px", minHeight: "50px" } },
            onload(el) {
              el.addEventListener("change", () => {
                if (String(el.value).trim() === "") {
                  el.value = el.defaultValue;
                }
              });
            }
          },
          advancedSettings: {
            ...dropdownStyle,
            defaultValue: false,
            label: "高级设置",
            attrs: { type: "checkbox", title: "请谨慎使用高级设置，可能会影响答题效果，小白在未理解的情况下谨慎调整。" }
          },
          stopSecondWhenFinish: {
            showIf: "common.settings.advancedSettings",
            elementClassName: "config-details",
            label: "答题结束后暂停（秒）",
            attrs: {
              type: "number",
              min: 3,
              step: 1,
              max: 9999,
              title: "自动答题脚本结束后暂停的时间（方便查看和检查）。"
            },
            defaultValue: 3
          },
          period: {
            showIf: "common.settings.advancedSettings",
            elementClassName: "config-details",
            label: "答题间隔（秒）",
            attrs: {
              type: "number",
              min: 1,
              step: 1,
              max: 60,
              title: "每道题请求 AI 前的间隔，不建议过低，以免触发接口限流。"
            },
            defaultValue: 3
          },
          answerSeparators: {
            showIf: "common.settings.advancedSettings",
            elementClassName: "config-details",
            label: "答案分隔符",
            attrs: {
              title: "分隔答案的符号，例如：答案1#答案2#答案3，分隔符为 #， 使用英文逗号进行隔开 : ',' "
            },
            defaultValue: ["===", "#", "---", "###", "|", ";", "；"].join(","),
            onload(el) {
              el.addEventListener("change", () => {
                if (String(el.value).trim() === "") {
                  el.value = el.defaultValue;
                }
              });
            }
          },
          redundanceWordsText: {
            showIf: "common.settings.advancedSettings",
            elementClassName: "config-details",
            defaultValue: [
              "单选题(必考)",
              "填空题(必考)",
              "多选题(必考)",
              "(单选题)",
              "(多选题)",
              "(判断题)",
              "(填空题)",
              "【单选题】",
              "【多选题】",
              "【填空题】",
              "【判断题】",
              "【單選题】",
              "【多選题】",
              "【判斷题】",
              "【Single Choice】",
              "【Multiple Choice】",
              "【single choice】",
              "【multiple choice】",
              "【True or False】"
            ].join("\n"),
            label: "题目冗余字段自动删除",
            tag: "textarea",
            attrs: {
              title: "向 AI 发送题目之前自动删除多余文字，每行一个。",
              style: { minWidth: "200px", minHeight: "50px" }
            },
            onload(el) {
              el.addEventListener("change", () => {
                if (String(el.value).trim() === "") {
                  el.value = el.defaultValue;
                }
              });
            }
          },
          notification: {
            separator: "其他设置",
            label: "系统通知",
            attrs: {
              title: "允许脚本发送系统通知，只有重要事情发生时会发送系统通知，尽量避免用户受到骚扰（在电脑屏幕右侧显示通知弹窗，例如脚本执行完毕，图形验证码，版本更新等通知）。"
            },
            tag: "select",
            defaultValue: "only-notify",
            options: [
              ["only-notify", "只显示右下角通知"],
              ["notify-and-voice", "通知以及提示音（叮的一声）"],
              ["all", "通知，提示音，以及任务栏闪烁提示"],
              ["no-notify", "关闭系统通知"]
            ]
          },
          notificationWebhooks: {
            label: "通知回调",
            attrs: {
              title: "发送系统通知时发送回调请求，用于专业开发人员对接其他通知系统。（每行填写一个URL，顺序发送GET请求，${message} 为消息占位符，可用于消息变量替换）"
            },
            tag: "textarea",
            defaultValue: ""
          }
        },
        methods() {
          return {
            getWorkOptions: () => JSON.parse(JSON.stringify(this.cfg)),
            notificationBySetting: (content, opts) => {
              var _a;
              if (this.cfg.notification !== "no-notify") {
                lib.$gm.notification(content, {
                  extraTitle: opts == null ? void 0 : opts.extraTitle,
                  duration: (_a = opts == null ? void 0 : opts.duration) != null ? _a : 30,
                  important: this.cfg.notification === "all",
                  silent: this.cfg.notification === "only-notify"
                });
                const message2 = ((opts == null ? void 0 : opts.extraTitle) ? (opts == null ? void 0 : opts.extraTitle) + "：" : "") + content;
                const webhooks = this.cfg.notificationWebhooks.split("\n").map((i) => i.trim()).filter(Boolean);
                for (const webhook of webhooks) {
                  let resolved_webhook = webhook;
                  resolved_webhook = webhook.replace("${message}", encodeURIComponent(message2));
                  request(resolved_webhook, {
                    method: "get",
                    type: "GM_xmlhttpRequest"
                  }).then((result) => {
                    console.debug("通知回调成功", { webhook: resolved_webhook, result });
                  }).catch((err) => {
                    console.debug("通知回调失败", { webhook: resolved_webhook, err });
                  });
                }
              }
            }
          };
        },
        oncomplete() {
          try {
            migrateLegacyAIStorage();
          } catch (error) {
            console.error("[OCS] 旧版 AI 配置迁移失败（已跳过）：", error);
          }
          const resetAIState = () => {
            aiFatalState = { signature: "", message: "" };
            aiAnswerCache.clear();
          };
          ["aiProvider", "aiEndpoint", "aiModel", "aiTemperature", "aiMaxTokens", "aiTimeout", "aiRetries", "aiVisionMode", "aiSystemPrompt"].forEach(
            (key) => {
              try {
                this.onConfigChange(key, resetAIState);
              } catch (error) {
                console.error("[OCS] 配置监听注册失败：", key, error);
              }
            }
          );
        }
      }),
      workResults: new lib.Script({
        name: "🤖 AI 答题结果",
        matches: [["所有页面", /.*/]],
        namespace: "common.work-results",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["点击题目序号，查看 AI 答题结果", "未完成的题目会显示模型错误或 DOM 写入失败原因"]).outerHTML
          },
          type: {
            label: "显示类型",
            tag: "select",
            options: [
              ["numbers", "序号列表"],
              ["questions", "题目列表"]
            ],
            attrs: {
              title: "使用题目列表可能会造成页面卡顿。"
            },
            defaultValue: "numbers"
          },
          totalQuestionCount: {
            defaultValue: 0
          },
          requestedCount: {
            defaultValue: 0
          },
          resolvedCount: {
            defaultValue: 0
          },
          currentResultIndex: {
            defaultValue: 0
          },
          questionPositionSyncHandlerType: {
            defaultValue: void 0
          }
        },
        methods() {
          return {
            updateWorkStateByResults: (results) => {
              this.cfg.totalQuestionCount = results.length;
              this.cfg.requestedCount = results.filter((result) => result.requested).length;
              this.cfg.resolvedCount = results.filter((result) => result.result && result.result.finish === true).length;
            },
            updateWorkState: (state2) => {
              this.cfg.totalQuestionCount = state2.totalQuestionCount;
              this.cfg.requestedCount = state2.requestedCount;
              this.cfg.resolvedCount = state2.resolvedCount;
            },
            refreshState: () => {
              this.cfg.totalQuestionCount = 0;
              this.cfg.requestedCount = 0;
              this.cfg.resolvedCount = 0;
            },
            clearResults: () => {
              return lib.$store.setTab(TAB_WORK_RESULTS_KEY, []);
            },
            getResults() {
              return lib.$store.getTab(TAB_WORK_RESULTS_KEY) || void 0;
            },
            setResults(results) {
              return lib.$store.setTab(TAB_WORK_RESULTS_KEY, results);
            },
            async appendResults(results) {
              const data = await lib.$store.getTab(TAB_WORK_RESULTS_KEY) || [];
              data.push(...results);
              return lib.$store.setTab(TAB_WORK_RESULTS_KEY, data);
            },
            init(opts) {
              CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = opts == null ? void 0 : opts.questionPositionSyncHandlerType;
              CommonProject.scripts.workResults.methods.refreshState();
              CommonProject.scripts.workResults.methods.clearResults();
            },
            createWorkResultsPanel: (mount2) => {
              const container2 = mount2 || lib.h("div");
              container2.style.width = "400px";
              let scrollPercent = 0;
              const list = lib.h("div", { className: "work-result-list" });
              let mouseoverIndex = -1;
              list.onscroll = () => {
                scrollPercent = list.scrollTop / list.scrollHeight;
              };
              const setNumStyle = (result, num, index) => {
                var _a;
                if (result.requested) {
                  num.classList.add("requested");
                }
                if (index === this.cfg.currentResultIndex) {
                  num.classList.add("active");
                }
                if (result.finish) {
                  num.classList.add("finish");
                } else {
                  if (result.requested && result.resolved && (((_a = result.error) == null ? void 0 : _a.trim().length) !== 0 || result.searchInfos.length === 0 || result.finish === false)) {
                    num.classList.add("error");
                  }
                }
              };
              const render2 = debounce_1$1(async () => {
                const results = await CommonProject.scripts.workResults.methods.getResults();
                if (results == null ? void 0 : results.length) {
                  if (results[this.cfg.currentResultIndex] === void 0) {
                    this.cfg.currentResultIndex = 0;
                  }
                  if (this.cfg.type === "numbers") {
                    const resultContainer = lib.h("div", { className: "work-result-container" });
                    list.style.marginBottom = "12px";
                    list.style.overflow = "auto";
                    list.style.maxHeight = "300px";
                    const nums = results.map((result, index) => {
                      return lib.h("span", { className: "search-infos-num", innerText: (index + 1).toString() }, (num) => {
                        setNumStyle(result, num, index);
                        num.onclick = () => {
                          var _a, _b;
                          for (const n of nums) {
                            n.classList.remove("active");
                          }
                          num.classList.add("active");
                          this.cfg.currentResultIndex = index;
                          resultContainer.replaceChildren(createResult(result));
                          if (this.cfg.questionPositionSyncHandlerType) {
                            (_b = (_a = state$6.workResult.questionPositionSyncHandler)[this.cfg.questionPositionSyncHandlerType]) == null ? void 0 : _b.call(
                              _a,
                              index
                            );
                          }
                        };
                      });
                    });
                    list.replaceChildren(...nums);
                    resultContainer.replaceChildren(createResult(results[this.cfg.currentResultIndex]));
                    container2.replaceChildren(list, resultContainer);
                  } else {
                    list.style.overflow = "auto";
                    list.style.maxHeight = window.innerHeight / 2 + "px";
                    const resultContainer = lib.h("div", { className: "work-result-question-container" });
                    const nums = [];
                    const questions = results.map((result, index) => {
                      const num = lib.h(
                        "span",
                        {
                          className: "search-infos-num",
                          innerHTML: (index + 1).toString()
                        },
                        (num2) => {
                          num2.style.marginRight = "12px";
                          num2.style.display = "inline-block";
                          setNumStyle(result, num2, index);
                        }
                      );
                      nums.push(num);
                      return lib.h(
                        "div",
                        [num, result.question],
                        (question) => {
                          question.onmouseover = () => {
                            mouseoverIndex = index;
                            resultContainer.replaceChildren(createResult(result));
                          };
                          question.onmouseleave = () => {
                            mouseoverIndex = -1;
                            resultContainer.replaceChildren(createResult(results[this.cfg.currentResultIndex]));
                          };
                          question.onclick = () => {
                            var _a, _b;
                            for (const n of nums) {
                              n.classList.remove("active");
                            }
                            for (const q of questions) {
                              q.classList.remove("active");
                            }
                            nums[index].classList.add("active");
                            question.classList.add("active");
                            this.cfg.currentResultIndex = index;
                            resultContainer.replaceChildren(createResult(result));
                            if (this.cfg.questionPositionSyncHandlerType) {
                              (_b = (_a = state$6.workResult.questionPositionSyncHandler)[this.cfg.questionPositionSyncHandlerType]) == null ? void 0 : _b.call(
                                _a,
                                index
                              );
                            }
                          };
                        }
                      );
                    });
                    list.replaceChildren(...questions);
                    if (mouseoverIndex === -1) {
                      resultContainer.replaceChildren(createResult(results[this.cfg.currentResultIndex]));
                    } else {
                      resultContainer.replaceChildren(createResult(results[mouseoverIndex]));
                    }
                    container2.replaceChildren(
                      lib.h("div", [list, lib.h("div", {}, [resultContainer])], (div) => {
                        div.style.display = "flex";
                      })
                    );
                  }
                } else {
                  container2.replaceChildren(
                    lib.h("div", { className: "alert-info-wrapper" }, [
                      lib.h("div", "暂无 AI 答题结果~", (div) => {
                        div.style.marginTop = "12px";
                        div.className = "result-info no-answer";
                      })
                    ])
                  );
                }
                list.scrollTo({
                  top: scrollPercent * list.scrollHeight,
                  behavior: "auto"
                });
                const tip = lib.h("div", [
                  lib.h("div", { className: "search-infos-num" }, "1"),
                  " 表示等待处理中",
                  lib.h("br"),
                  lib.h("div", { className: "search-infos-num requested" }, "1"),
                  " 表示已完成搜索 ",
                  lib.h("br"),
                  lib.h("div", { className: "search-infos-num finish" }, "1"),
                  " 表示已搜索已答题 "
                ]);
                container2.prepend(
                  lib.h("hr"),
                  lib.h(
                    "div",
                    [
                      lib.$ui.space(
                        [
                          lib.h("span", `已请求: ${this.cfg.requestedCount}/${this.cfg.totalQuestionCount}`),
                          lib.h("span", `已完成: ${this.cfg.resolvedCount}/${this.cfg.totalQuestionCount}`),
                          lib.h("a", "提示", (btn) => {
                            btn.style.cursor = "pointer";
                            btn.onclick = () => {
                              lib.$modal.confirm({ content: tip, footer: void 0 });
                            };
                          }),
                          lib.$ui.tooltip(
                            lib.h("a", "清空结果", (btn) => {
                              btn.title = "清空当前页面显示的 AI 答题结果";
                              btn.style.cursor = "pointer";
                              btn.onclick = () => {
                                var _a, _b, _c, _d;
                                this.methods.clearResults();
                                const { panel, header: header2 } = CXProject.scripts.work;
                                if (panel && header2) {
                                  (_b = (_a = CXProject.scripts.work).onrender) == null ? void 0 : _b.call(_a, { panel, header: header2 });
                                  (_d = (_c = CommonProject.scripts.workResults).onrender) == null ? void 0 : _d.call(_c, { panel, header: header2 });
                                }
                              };
                            })
                          )
                        ],
                        { separator: "|" }
                      )
                    ],
                    (div) => {
                      div.style.textAlign = "center";
                      div.style.fontSize = "12px";
                    }
                  )
                );
              }, 100);
              const createResult = (result) => {
                if (result) {
                  return lib.h("div", [
                    createSearchResultAlertElement(result),
                    lib.h(SearchInfosElement, {
                      infos: result.searchInfos,
                      question: result.question,
                      type: result.type
                    })
                  ]);
                } else {
                  return lib.h("div", "undefined");
                }
              };
              render2();
              this.onConfigChange("type", render2);
              this.onConfigChange("requestedCount", render2);
              this.onConfigChange("resolvedCount", render2);
              lib.$store.addChangeListener(TAB_WORK_RESULTS_KEY, render2);
              return container2;
            }
          };
        },
        onrender({ panel }) {
          panel.body.replaceChildren(this.methods.createWorkResultsPanel());
        }
      }),
      render: RenderScript,
      hack: new lib.Script({
        name: "页面复制粘贴限制解除",
        matches: [["所有页面", /.*/]],
        hideInPanel: true,
        onactive() {
          enableCopy([document, document.body]);
        },
        oncomplete() {
          enableCopy([document, document.body]);
          insertCopyableStyle();
          setTimeout(() => {
            enableCopy([document, document.body]);
            insertCopyableStyle();
          }, 3e3);
        }
      }),
      disableDialog: new lib.Script({
        name: "禁止弹窗",
        matches: [["所有页面", /.*/]],
        hideInPanel: true,
        priority: 1,
        onstart() {
          function disableDialog(msg2) {
            lib.$modal.alert({
              profile: "弹窗来自：" + location.origin,
              content: msg2
            });
          }
          try {
            lib.$gm.unsafeWindow.alert = disableDialog;
            window.alert = disableDialog;
          } catch (e) {
            console.error(e);
          }
        }
      }),
      apps: new lib.Script({
        name: "📱 拓展应用",
        matches: [["", /.*/]],
        namespace: "common.apps",
        configs: {
          notes: { defaultValue: "设置导入、导出。" }
        },
        methods() {
          return {
            resolveAIAnswer: async (_, answerer) => answerer(),
            recordAIResult: () => void 0
          };
        },
        onrender({ panel }) {
          const btnStyle = {
            padding: "6px 12px",
            margin: "4px",
            marginBottom: "8px",
            boxShadow: "0px 0px 4px #bebebe",
            borderRadius: "8px",
            cursor: "pointer"
          };
          const exportSetting = lib.$ui.tooltip(
            lib.h(
              "div",
              {
                innerText: "📤 导出设置",
                style: btnStyle,
                title: "导出全部非敏感设置；AI API Key 不会被导出。（文件后缀名：.ocssetting）"
              },
              (btn) => {
                btn.onclick = () => {
                  const setting = Object.create({});
                  for (const key of lib.$store.list()) {
                    if (isExcludedFromSettingsTransfer(key)) continue;
                    const val = lib.$store.get(key);
                    if (val !== void 0) Reflect.set(setting, key, val);
                  }
                  const blob = new Blob([JSON.stringify(setting, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = lib.h("a", { href: url, download: "ocs-setting-export.ocssetting" });
                  a.click();
                  URL.revokeObjectURL(url);
                };
              }
            )
          );
          const importSetting = lib.$ui.tooltip(
            lib.h(
              "div",
              {
                innerText: "📥 导入设置",
                style: btnStyle,
                title: "导入非敏感设置并覆盖当前设置；不会导入 API Key 或已移除的旧配置。"
              },
              (btn) => {
                btn.onclick = () => {
                  const input = lib.h("input", { type: "file", accept: ".ocssetting,application/json" });
                  input.onchange = async () => {
                    const file = input.files && input.files[0];
                    if (!file) return;
                    try {
                      const obj = JSON.parse(await file.text());
                      if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new Error("设置文件格式无效");
                      for (const key of Object.keys(obj)) {
                        if (isExcludedFromSettingsTransfer(key)) continue;
                        lib.$store.set(key, obj[key]);
                      }
                      lib.$message.success({ content: "设置导入成功，页面即将刷新。", duration: 3 });
                      setTimeout(() => location.reload(), 3e3);
                    } catch (error) {
                      lib.$message.error({ content: "设置导入失败：" + String(error.message || error), duration: 0 });
                    }
                  };
                  input.click();
                };
              }
            )
          );
          [exportSetting, importSetting].forEach((btn) => {
            btn.onmouseover = () => btn.style.boxShadow = "0px 0px 4px #0099ff9c";
            btn.onmouseout = () => btn.style.boxShadow = "0px 0px 4px #bebebe";
          });
          panel.body.replaceChildren(lib.h("div", [exportSetting, importSetting]));
        }
      })
    }
  });
  function insertCopyableStyle() {
    const style = document.createElement("style");
    style.innerHTML = `
		html * {
		  -webkit-user-select: text !important;
		  -khtml-user-select: text !important;
		  -moz-user-select: text !important;
		  -ms-user-select: text !important;
		  user-select: text !important;
		}`;
    document.head.append(style);
  }
  function createSearchResultAlertElement(result) {
    var _a;
    let info = null;
    let err = result.error || ((_a = result.searchInfos.find((i) => i.error)) == null ? void 0 : _a.error);
    if (result.requested === false && result.resolved === false) {
      info = lib.h("div", { className: "result-info unresolved" }, "等待 AI 响应中... 🔍");
    } else if (err) {
      info = lib.h("div", { className: "result-info error" }, "❌ " + err);
    } else if (result.searchInfos.length === 0) {
      info = lib.h("div", { className: "result-info no-answer" }, "❌ AI 未返回可用答案");
    } else {
      info = result.finish ? null : result.resolved === false ? lib.h("div", { className: "result-info unresolved" }, "等待按顺序填写答案... ⏱️") : lib.h("div", { className: "result-info error" }, "❌ 此题未完成，模型答案或页面控件未能安全匹配。");
    }
    return lib.h("div", { className: "alert-info-wrapper" }, [info != null ? info : lib.h("div")]);
  }
  async function waitForMedia(options) {
    var _a;
    const timeoutMs = (_a = options == null ? void 0 : options.timeout) != null ? _a : 3 * 60 * 1e3;
    const res = await new Promise((resolve, reject) => {
      let timeoutId;
      const interval = setInterval(() => {
        const video = ((options == null ? void 0 : options.root) || document).querySelector(
          `${(options == null ? void 0 : options.videoSelector) || "video"},${(options == null ? void 0 : options.audioSelector) || "audio"}`
        );
        if (video && (!(options == null ? void 0 : options.filter) || options.filter(video))) {
          clearInterval(interval);
          if (timeoutId !== void 0) {
            clearTimeout(timeoutId);
          }
          resolve(video);
        }
      }, 200);
      timeoutId = setTimeout(() => {
        clearInterval(interval);
        reject(new Error("视频/音频未找到，或者加载超时。"));
      }, timeoutMs);
    });
    return res;
  }
  function waitForElement(selector, opts) {
    return waitFor(() => {
      return typeof selector === "function" ? selector() : document.querySelector(selector);
    }, opts);
  }
  function waitFor(predicate, opts) {
    return new Promise((resolve, reject) => {
      let timeout;
      const interval = setInterval(() => {
        const result = predicate();
        if (result) {
          clearInterval(interval);
          timeout && clearTimeout(timeout);
          resolve(result);
        }
      }, (opts == null ? void 0 : opts.check_period_ms) || 1e3);
      if (opts == null ? void 0 : opts.timeout_seconds) {
        timeout = setTimeout(() => {
          clearInterval(interval);
          resolve(void 0);
        }, ((opts == null ? void 0 : opts.timeout_seconds) || 10) * 1e3);
      }
    });
  }
  const $playwright = {
    showError: () => {
      const href = "https://docs.ocsjs.com/docs/script-helper";
      const errorEl = lib.h("div", [
        "当前页面需要下载OCS桌面端，并在桌面端中新建浏览器，在新建的浏览器中才能进行正常刷课，点击链接查看详情 => ",
        lib.h("a", { href, target: "_blank" }, href)
      ]);
      lib.$modal.alert({
        maskCloseable: false,
        title: "⛔ 错误",
        confirmButtonText: "查看详情",
        content: errorEl.cloneNode(true),
        onConfirm() {
          window.open(href, "_blank");
        }
      });
      lib.$message.error({ content: errorEl.cloneNode(true), duration: 0 });
    }
  };
  const state$5 = {
    study: {
      stop: false,
      currentMedia: void 0,
      stopInterval: 0,
      stopMessage: void 0
    }
  };
  const remote_not_required_pages = [
    "fusioncourseh5.zhihuishu.com",
    "studywisdomh5.zhihuishu.com",
    "wisdom-mooc.zhihuishu.com"
  ];
  const gxk_read_notes = [
    "⚠️ 如果未开始答题，请尝试刷新页面。",
    "⚠️ 禁止同时打开多个作业/考试页面。",
    ["⚠️ 答题中请勿进行任何操作，如需暂停答题", "请等待全部题目搜索完成并执行自动保存功能后才能操作。"],
    ["⚠️ 暂停后手动操作请确保每个题目都点击下一题", "进行答案保存（不然不会保存，提交没分）"]
  ];
  class StudyVideoH5 {
    constructor() {
      this.remotePage = void 0;
    }
    async init() {
      this.remotePage = await BackgroundProject.scripts.dev.methods.getRemotePlaywrightCurrentPage();
      if (!this.remotePage) {
        throw $playwright.showError();
      }
    }
    getCourseName() {
      var _a;
      return ((_a = lib.$el(".source-name")) == null ? void 0 : _a.textContent) || "无名称";
    }
    getChapterName(root2) {
      var _a;
      return ((_a = root2.querySelector(".catalogue_title")) == null ? void 0 : _a.textContent) || "未知章节";
    }
    getNext(opts) {
      let videoItems = Array.from(document.querySelectorAll(".clearfix.video"));
      if (!opts.restudy) {
        videoItems = videoItems.filter((el) => el.querySelector(".time_icofinish") === null);
      }
      for (let i = 0; i < videoItems.length; i++) {
        const item = videoItems[i];
        if (item.classList.contains("current_play")) {
          return videoItems[i + (opts.next ? 1 : 0)];
        }
      }
      return videoItems[0];
    }
    async switchPlaybackRate(rate) {
      var _a;
      const controlsBar = lib.$el(".controlsBar");
      const sl = lib.$el(".speedList");
      if (controlsBar && sl) {
        controlsBar.style.display = "block";
        sl.style.display = "block";
        const rate_parsed = parseFloat(String(rate));
        const selector = `.speedList [rate="${rate_parsed === 1 ? "1.0" : rate}"],.speedList [rate="${rate_parsed === 1 ? "1" : rate}"]`;
        if (this.remotePage) {
          await this.remotePage.click(selector);
        } else {
          (_a = document.querySelector(selector)) == null ? void 0 : _a.click();
        }
      }
    }
    async switchLine(definition2) {
      const controlsBar = lib.$el(".controlsBar");
      const dl = lib.$el(".definiLines");
      if (controlsBar && dl) {
        controlsBar.style.display = "block";
        dl.style.display = "block";
        const selector = `.definiLines .${definition2}:not(.active)`;
        const el = document.querySelector(selector);
        if (el) {
          if (this.remotePage) {
            await this.remotePage.click(selector);
          } else {
            el.click();
          }
        }
      }
    }
    hasJob() {
      var _a;
      return ((_a = lib.$$el(".clearfix.video")) == null ? void 0 : _a.length) > 0;
    }
    hideDialog() {
      lib.$$el(".el-dialog__wrapper").forEach((dialog) => {
        dialog.remove();
      });
    }
    async handleTestDialog() {
      var _a, _b;
      const items = lib.$$el("#playTopic-dialog .el-pager .number");
      if (items.length) {
        for (const item of items) {
          if (item.classList.contains("active") === false) {
            item.click();
            await lib.$.sleep(500);
          }
          const options = lib.$$el("#playTopic-dialog ul .topic-item");
          if (options.length !== 0) {
            await waitForCaptcha();
            $render.moveToEdge();
            const random = Math.floor(Math.random() * options.length);
            await lib.$.sleep(1e3);
            const btn_selector = `#playTopic-dialog .topic .radio ul > li:nth-child(${random + 1})`;
            if (this.remotePage) {
              await this.remotePage.click(btn_selector);
            } else {
              (_a = lib.$el(btn_selector)) == null ? void 0 : _a.click();
            }
            await lib.$.sleep(1e3);
          }
        }
        await lib.$.sleep(1e3);
        const close_btn_selector = "#playTopic-dialog .close-btn,#playTopic-dialog .btn";
        if (this.remotePage) {
          await this.remotePage.click(close_btn_selector);
        } else {
          (_b = lib.$el(close_btn_selector)) == null ? void 0 : _b.click();
        }
      }
      await lib.$.sleep(3e3);
      await this.handleTestDialog();
    }
  }
  class FusionCourseH5 extends StudyVideoH5 {
    getCourseName() {
      return "智慧课程-AI";
    }
    getChapterName(root2) {
      const is_resource_box_mode = !!document.querySelector(".resource-box");
      if (is_resource_box_mode) {
        const card_name = root2.querySelector(".file-name");
        if (card_name) {
          return card_name.textContent || "未知章节";
        }
      }
      return super.getChapterName(root2);
    }
    getNext(opts) {
      const is_resource_box_mode = !!document.querySelector(".resource-box");
      if (is_resource_box_mode) {
        const getNextCard = () => {
          const cards = Array.from(document.querySelectorAll(".resources-item"));
          let target_el;
          let start2 = false;
          for (let index = 0; index < cards.length; index++) {
            const card = cards[index];
            if (start2) {
              if (opts.restudy) {
                target_el = card;
                break;
              } else {
                if (card.querySelector(".isFinish")) {
                  continue;
                }
                target_el = card;
                break;
              }
            }
            if (card.className.includes("active")) {
              start2 = true;
            }
          }
          return target_el;
        };
        const next_card = getNextCard();
        if (next_card) {
          return next_card;
        }
      }
      let videoItems = Array.from(document.querySelectorAll(".clearfix.video")).filter((el) => {
        if (is_resource_box_mode) {
          return !!el.querySelector(".resource-box");
        }
        return true;
      });
      console.log(videoItems);
      if (!opts.restudy) {
        if (is_resource_box_mode) {
          videoItems = videoItems.filter((el) => {
            var _a;
            const text = ((_a = el.querySelector(".resource-text")) == null ? void 0 : _a.textContent) || "";
            const [progress, total] = text.replace("必学", "").trim().split("/").map((s) => parseInt(s));
            return progress < total;
          });
        } else {
          videoItems = videoItems.filter((el) => {
            const num_el = el.querySelector(".progress-num");
            return num_el === null || num_el.textContent !== "100%";
          });
        }
      }
      for (let i = 0; i < videoItems.length; i++) {
        const item = videoItems[i];
        if (is_resource_box_mode) {
          if (item.classList.contains("activeNode")) {
            return videoItems[i + (opts.next ? 1 : 0)];
          }
        } else {
          if (item.classList.contains("current_play")) {
            return videoItems[i + (opts.next ? 1 : 0)];
          }
        }
      }
      return videoItems[0];
    }
  }
  class StudyPlusH5 extends StudyVideoH5 {
    getCourseName() {
      var _a, _b, _c;
      return ((_c = (_b = (_a = lib.$el(".top-back-box > span:nth-child(2)")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.match(/课程名称：(.+)/)) == null ? void 0 : _c[1]) || "无名称";
    }
    getChapterName(item) {
      var _a;
      return ((_a = item.parentElement) == null ? void 0 : _a.textContent) || "未知章节";
    }
    hasJob() {
      var _a;
      return ((_a = lib.$$el(".child-main")) == null ? void 0 : _a.length) > 0;
    }
    getNext(opts) {
      let videoItems = Array.from(document.querySelectorAll(".child-main")).filter(
        (el) => {
          var _a;
          return (_a = el.parentElement) == null ? void 0 : _a.querySelector(".child-time");
        }
      );
      console.log(videoItems);
      if (!opts.restudy) {
        videoItems = videoItems.filter((el) => {
          var _a;
          if ((_a = el.parentElement) == null ? void 0 : _a.querySelector(".finish-icon")) {
            return false;
          }
          return true;
        });
      }
      for (let i = 0; i < videoItems.length; i++) {
        const item = videoItems[i];
        if (item.classList.contains("current")) {
          return videoItems[i + (opts.next ? 1 : 0)];
        }
      }
      return videoItems[0];
    }
    hideDialog() {
      lib.$$el(".el-overlay,.el-dialog").forEach((dialog) => {
        dialog.style.display = "none";
      });
    }
    async handleTestDialog(remotePage) {
      const question_box = lib.$el(".ai-test-question-wrapper");
      const done = lib.$el(".ai-test-question-wrapper .done");
      if (question_box) {
        lib.$message.info("正在关闭弹窗测验...");
        const close_btn = lib.$el(".close-box", question_box);
        if (done) {
          if (close_btn) {
            if (remotePage) {
              await remotePage.click(close_btn);
            } else {
              close_btn.click();
            }
          }
        } else {
          const options = lib.$$el(".options .option", question_box);
          if (options.length !== 0) {
            await waitForCaptcha();
            $render.moveToEdge();
            const random = Math.floor(Math.random() * options.length);
            await lib.$.sleep(1e3);
            if (remotePage) {
              await remotePage.click(options[random]);
            } else {
              options[random].click();
            }
            await lib.$.sleep(1e3);
          }
          await lib.$.sleep(1e3);
          const submit_btn = lib.$el(".submit-btn .submits");
          if (submit_btn) {
            if (remotePage) {
              await remotePage.click(submit_btn);
            } else {
              submit_btn.click();
            }
          }
          await lib.$.sleep(1e3);
          if (close_btn) {
            if (remotePage) {
              await remotePage.click(close_btn);
            } else {
              close_btn.click();
            }
          }
        }
      }
      await lib.$.sleep(3e3);
      await this.handleTestDialog(remotePage);
    }
  }
  class WishdomH5 extends StudyVideoH5 {
    getCourseName() {
      var _a, _b, _c;
      return ((_c = (_b = (_a = lib.$el(".course-name")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.match(/课程名称：(.+)/)) == null ? void 0 : _c[1]) || "无名称";
    }
    getChapterName(item) {
      return item.textContent || "未知章节";
    }
    hasJob() {
      var _a;
      return ((_a = lib.$$el(".chapter-content .chapter-content-second")) == null ? void 0 : _a.length) > 0;
    }
    getNext(opts) {
      let jobs = Array.from(document.querySelectorAll(".chapter-content .chapter-item"));
      jobs = jobs.map((el) => {
        const children = el.querySelectorAll(".chapter-content-second");
        if (children.length > 0) {
          return Array.from(children);
        } else {
          return [el];
        }
      }).flat();
      console.log(jobs);
      if (!opts.restudy) {
        jobs = jobs.filter((el) => {
          if (el.querySelector(".finish-icon")) {
            return false;
          }
          return true;
        });
      }
      for (let i = 0; i < jobs.length; i++) {
        const item = jobs[i];
        if (item.classList.contains("current")) {
          return jobs[i + (opts.next ? 1 : 0)];
        }
      }
      return jobs[0];
    }
    hideDialog() {
      lib.$$el(".el-overlay,.el-dialog").forEach((dialog) => {
        dialog.style.display = "none";
      });
    }
    async handleTestDialog(remotePage) {
      const question_box = lib.$el(".ai-class-exercise-dialog");
      if (question_box) {
        const options = lib.$$el(".ques-list .item .option");
        lib.$message.info("正在关闭弹窗测验...");
        if (options.length !== 0) {
          await waitForCaptcha();
          CommonProject.scripts.render.methods.minimize();
          CommonProject.scripts.render.methods.setPosition(100, 200);
          const random = Math.floor(Math.random() * options.length);
          await lib.$.sleep(1e3);
          if (remotePage) {
            await remotePage.click(options[random]);
          } else {
            options[random].click();
          }
          await lib.$.sleep(1e3);
        }
        await lib.$.sleep(1e3);
        const submit_btn = lib.$el(".ai-class-exercise-dialog .el-dialog__footer .el-button.btn");
        if (submit_btn) {
          if (remotePage) {
            await remotePage.hover(".ai-class-exercise-dialog .el-dialog__footer .el-button.btn");
            await remotePage.click(".ai-class-exercise-dialog .el-dialog__footer .el-button.btn");
          } else {
            submit_btn.click();
          }
        }
        const close_btn = lib.$el(".ai-class-exercise-dialog .header-icon");
        if (close_btn) {
          if (remotePage) {
            await remotePage.hover(".ai-class-exercise-dialog .header-icon");
            await remotePage.click(".ai-class-exercise-dialog .header-icon");
          } else {
            close_btn.click();
          }
        }
        lib.$message.info("弹窗测验已关闭");
      }
      await lib.$.sleep(3e3);
      await this.handleTestDialog(remotePage);
    }
  }
  class Hike extends StudyVideoH5 {
    getCourseName() {
      return "无名称";
    }
    getChapterName(item) {
      return item.textContent || "未知章节";
    }
    hasJob() {
      var _a;
      return ((_a = document.querySelectorAll(".source-icon")) == null ? void 0 : _a.length) > 0;
    }
    getNext(opts) {
      let jobs = Array.from(document.querySelectorAll(".source-icon")).map(
        (el) => {
          var _a;
          return (_a = el.parentElement) == null ? void 0 : _a.parentElement;
        }
      );
      console.log(jobs);
      if (!opts.restudy) {
        jobs = jobs.filter((el) => {
          if (el.querySelector("i.select")) {
            return false;
          }
          return true;
        });
      }
      for (let i = 0; i < jobs.length; i++) {
        const item = jobs[i];
        if (item.querySelector(".active-file")) {
          return jobs[i + (opts.next ? 1 : 0)];
        }
      }
      return jobs[0];
    }
    hideDialog() {
      lib.$$el(".el-overlay,.el-dialog").forEach((dialog) => {
        dialog.style.display = "none";
      });
    }
  }
  class HikeV2 extends StudyVideoH5 {
    getCourseName() {
      var _a;
      return ((_a = document.querySelector(".header-title-wrap")) == null ? void 0 : _a.textContent) || "无名称";
    }
    getChapterName() {
      var _a;
      return ((_a = document.querySelector(".el-tree-node.is-current .file-name")) == null ? void 0 : _a.textContent) || "未知章节";
    }
    hasJob() {
      var _a;
      return ((_a = document.querySelectorAll(".el-tree-node")) == null ? void 0 : _a.length) > 0;
    }
    getNext(opts) {
      let jobs = Array.from(document.querySelectorAll(".el-tree-node")).filter(
        (e) => {
          var _a;
          return ((_a = e.querySelector(".el-tree-node__children")) == null ? void 0 : _a.children.length) === 0;
        }
      );
      console.log(jobs);
      if (!opts.restudy) {
        jobs = jobs.filter((el) => {
          if (el.querySelector("label.success")) {
            return false;
          }
          return true;
        });
      }
      for (let i = 0; i < jobs.length; i++) {
        const item = jobs[i];
        if (item.classList.contains(".is-current")) {
          return jobs[i + (opts.next ? 1 : 0)];
        }
      }
      return jobs[0];
    }
    hideDialog() {
      lib.$$el(".el-overlay,.el-dialog").forEach((dialog) => {
        dialog.style.display = "none";
      });
    }
  }
  const ZHSProject = lib.Project.create({
    name: "知到智慧树",
    domains: [
      "zhihuishu.com",
      "hike-teaching-center.polymas.com"
    ],
    scripts: {
      guide: new lib.Script({
        name: "💡 使用提示",
        matches: [
          ["学习首页", "https://onlineweb.zhihuishu.com/onlinestuh5"],
          ["首页", "https://www.zhihuishu.com/"]
        ],
        namespace: "zhs.guide",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "请手动进入视频、作业、考试页面，脚本会自动运行。",
              "兴趣课会自动下一个，所以不提供脚本。"
            ]).outerHTML
          }
        },
        oncomplete() {
          CommonProject.scripts.render.methods.pin(this);
        }
      }),
      "gxk-study": new lib.Script({
        name: "🖥️ 共享课-学习脚本",
        matches: [
          ["共享课学习页面", "studyvideoh5.zhihuishu.com"],
          ["新共享课学习页面", "studyplush5.zhihuishu.com"],
          ["新版AI课页面", "fusioncourseh5.zhihuishu.com/stuStudy"],
          ["2025-9月新智慧共享课学习页面", "studywisdomh5.zhihuishu.com/study/index"]
        ],
        namespace: "zhs.gxk.study",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "章节测试请大家观看完视频后手动打开。",
              [
                "请大家仔细打开视频上方的”学前必读“，查看成绩分布。",
                "如果 “平时成绩-学习习惯成绩” 占比多的话，就需要规律学习。",
                "每天定时半小时可获得一分习惯分。",
                "如果不想要习惯分可忽略。"
              ],
              "请使用时关闭卡巴斯基软件，否则会被检测出异常脚本。",
              "不要最小化浏览器，可能导致脚本暂停。",
              "运行中请将浏览器缩放调整至适合的大小，避免元素遮挡，无法点击",
              "例如：调整缩放到 50%，然后刷新页面即可"
            ]).outerHTML
          },
          studyRecord: {
            defaultValue: [],
            extra: {
              appConfigSync: false
            }
          },
          stopTime: {
            label: "定时停止",
            tag: "select",
            attrs: { title: "到时间后自动暂停脚本" },
            defaultValue: "0",
            options: [
              ["0", "关闭"],
              ["0.5", "半小时后"],
              ["1", "一小时后"],
              ["2", "两小时后"]
            ]
          },
          restudy,
          reloadWhenError: {
            label: "黑屏自动刷新",
            attrs: { title: "视频黑屏或者检测不到视频时自动刷新页面", type: "checkbox" },
            defaultValue: true
          },
          volume,
          definition,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            attrs: { title: "目前智慧树倍速最高只能1.5x，超出有封号风险" },
            defaultValue: 1,
            options: [
              ["1", "1 x"],
              ["1.25", "1.25 x"],
              ["1.5", "1.5 x"]
            ]
          }
        },
        methods() {
          return {
            increaseStudyTime: (courseName, val) => {
              const records = this.cfg.studyRecord;
              const record = records.find(
                (r) => new Date(r.date).toLocaleDateString() === new Date().toLocaleDateString()
              );
              let courses = [];
              if (record) {
                courses = record.courses;
              } else {
                records.push({ date: Date.now(), courses });
              }
              const course = courses.find((c) => c.name === courseName);
              if (course) {
                course.time = course.time + val;
                if (typeof course.time === "string") {
                  course.time = parseFloat(course.time);
                }
              } else {
                courses.push({ name: courseName, time: 0 });
              }
              this.cfg.studyRecord = records;
            }
          };
        },
        onrender({ panel }) {
          panel.body.replaceChildren(
            lib.h("hr"),
            lib.$ui.button("⏰检测是否需要规律学习", {}, (btn) => {
              btn.style.marginRight = "12px";
              btn.onclick = () => {
                var _a;
                const href = ((_a = document.querySelector("[href*=stuLearnReportNew]")) == null ? void 0 : _a.getAttribute("href")) || "";
                if (href) {
                  lib.$modal.alert({
                    title: "规律学习检测",
                    content: `自动检测功能已失效，<a href="${href}"> -> 点击此处 <- </a> 前往成绩分析页面，点击 <b>“学习习惯”</b> 即可查看习惯分详情。`
                  });
                } else {
                  lib.$modal.alert({
                    title: "提示",
                    content: "自动检测功能已失效，请自行前往成绩分析页面，点击学习习惯即可查看习惯分详情。"
                  });
                }
              };
            }),
            lib.$ui.button("📘查看学习记录", {}, (btn) => {
              btn.onclick = () => {
                lib.$modal.alert({
                  title: "学习记录",
                  content: lib.$ui.notes(
                    this.cfg.studyRecord.map((r) => {
                      const date = new Date(r.date);
                      return [
                        `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
                        lib.$ui.notes(r.courses.map((course) => `${course.name} - ${optimizeSecond(course.time)}`))
                      ];
                    })
                  )
                });
              };
            })
          );
        },
        onactive() {
          this.cfg.stopTime = "0";
          if (this.cfg.playbackRate) {
            this.cfg.playbackRate = parseFloat(this.cfg.playbackRate.toString());
          }
        },
        async oncomplete() {
          CommonProject.scripts.render.methods.pin(this);
          const type = location.href.includes("fusioncourseh5") ? "AI课程" : location.href.includes("studyplush5") ? "新共享课" : location.href.includes("studywisdomh5") ? "新智慧共享课" : "共享课";
          const ProcessorConstructor = location.href.includes("fusioncourseh5") ? FusionCourseH5 : location.href.includes("studyplush5") || location.href.includes("studywisdomh5") ? StudyPlusH5 : StudyVideoH5;
          const processor = new ProcessorConstructor();
          setTimeout(() => {
            if (processor.hasJob() === false) {
              finishAlert();
            }
          }, 10 * 1e3);
          const waitForVideoJob = () => {
            return new Promise((resolve, reject) => {
              if (processor.hasJob()) {
                resolve();
              } else {
                setTimeout(() => {
                  resolve(waitForVideoJob());
                }, 200);
              }
            });
          };
          await waitForVideoJob();
          await processor.init();
          this.onConfigChange("stopTime", (stopTime) => {
            if (stopTime === "0") {
              lib.$message.info({ content: "定时停止已关闭" });
            } else {
              autoStop(stopTime);
            }
          });
          this.onConfigChange("volume", (curr) => {
            state$5.study.currentMedia && (state$5.study.currentMedia.volume = curr);
          });
          this.onConfigChange("playbackRate", (curr) => {
            if (typeof curr === "string") {
              this.cfg.playbackRate = parseFloat(curr);
            }
            processor.switchPlaybackRate(curr);
          });
          this.onConfigChange("definition", (curr) => {
            processor.switchLine(curr);
          });
          const recordStudyTimeLoop = () => {
            this.methods.increaseStudyTime(processor.getCourseName(), this.cfg.playbackRate);
            setTimeout(recordStudyTimeLoop, 1e3);
          };
          closeDialogRead();
          recordStudyTimeLoop();
          autoStop(this.cfg.stopTime);
          processor.hideDialog();
          processor.handleTestDialog(processor.remotePage);
          ocsSingletonInterval("zhs.study.cleanup", async () => {
            lib.$$el(".v-modal,.mask").forEach((modal2) => {
              modal2.remove();
            });
            fixProcessBar();
          }, 3e3);
          lib.$message.info({ content: "3秒后开始学习", duration: 3 });
          const remotePage = processor.remotePage;
          const study2 = async (opts) => {
            if (state$5.study.stop === false) {
              const item = processor.getNext({ next: opts.next, restudy: this.cfg.restudy });
              if (item) {
                const msg2 = "即将学习：" + processor.getChapterName(item);
                lib.$message.info({ content: msg2 });
                $console.log(msg2);
                await lib.$.sleep(3e3);
                $render.moveToEdge();
                if (remotePage) {
                  if (type === "新共享课") {
                    await remotePage.click(".title-box");
                    await lib.$.sleep(200);
                  }
                  await remotePage.click(item);
                  await lib.$.sleep(1e3);
                  await remotePage.click(item);
                  await lib.$.sleep(1e3);
                } else {
                  item.click();
                }
                if (type === "AI课程" && document.querySelector(".preview-warp .doc-box,.preview-warp .ppt-box")) {
                  lib.$message.info({ content: "检测到PPT资源，即将跳过..." });
                  await lib.$.sleep(2e3);
                  study2({ next: true });
                  return;
                }
                watch(
                  processor,
                  {
                    reloadWhenError: this.cfg.reloadWhenError,
                    volume: this.cfg.volume,
                    playbackRate: this.cfg.playbackRate,
                    definition: this.cfg.definition
                  },
                  {
                    reload() {
                      if (type === "共享课") {
                        study2({ next: false });
                      } else {
                        location.reload();
                      }
                    },
                    onended({ next: next2 }) {
                      study2({ next: next2 });
                    }
                  }
                );
              } else {
                finishAlert();
              }
            } else {
              const msg2 = "检测到当前视频全部播放完毕，如果还有未完成的视频请刷新重试，或者打开复习模式。";
              lib.$message.warn({ content: msg2 });
              CommonProject.scripts.settings.methods.notificationBySetting(msg2, {
                duration: 0,
                extraTitle: "知道智慧树学习脚本"
              });
            }
          };
          study2({ next: false });
        }
      }),
      "gxk-work": new lib.Script({
        name: "✍️ 共享课-作业考试脚本",
        matches: [
          ["共享课作业页面", "zhihuishu.com/stuExamWeb.html#/webExamList/dohomework"],
          ["共享课考试页面", "zhihuishu.com/stuExamWeb.html#/webExamList/doexamination"],
          ["作业考试列表", "zhihuishu.com/stuExamWeb.html#/webExamList\\?"]
        ],
        namespace: "zhs.gxk.work",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
              "AI 将直接给出答案并由脚本自动填写。",
              ...gxk_read_notes
            ]).outerHTML
          },
          workDelay: {
            label: "作业答题开始时间延迟（秒）",
            defaultValue: 5,
            attrs: { type: "number", min: 1, step: 1, max: 10 }
          },
          readNotes: {
            defaultValue: false
          }
        },
        methods() {
          async function getWorkInfo(remotePage) {
            const isExam2 = location.href.includes("doexamination");
            let url = "";
            if (isExam2) {
              url = "/taurusExam/gateway/t/v1/student/doExam";
            } else {
              url = "/studentExam/gateway/t/v1/student/doHomework";
            }
            return JSON.parse((await remotePage.waitForResponse(url)).body);
          }
          return {
            getWorkInfo,
            work: async () => {
              const remotePage = await BackgroundProject.scripts.dev.methods.getRemotePlaywrightCurrentPage();
              if (!remotePage) {
                return $playwright.showError();
              }
              const isExam2 = location.href.includes("doexamination");
              const isWork2 = location.href.includes("dohomework");
              if (isExam2 || isWork2) {
                const workInfo = await getWorkInfo(remotePage);
                $render.moveToEdge();
                CommonProject.scripts.render.methods.normal();
                CommonProject.scripts.render.methods.pin(this);
                if (this.cfg.readNotes === false) {
                  const notes = lib.$ui.notes(gxk_read_notes).outerHTML;
                  const start2 = await new Promise((resolve, reject) => {
                    lib.$modal.confirm({
                      title: isExam2 ? "脚本考前须知" : "脚本作业须知",
                      content: notes,
                      confirmButtonText: "我已知晓，开始自动答题",
                      cancelButtonText: "取消答题",
                      maskCloseable: false,
                      onConfirm: () => {
                        this.cfg.readNotes = true;
                        resolve(true);
                      },
                      onCancel() {
                        resolve(false);
                      }
                    });
                  });
                  if (!start2) {
                    lib.$message.info({ content: "已取消答题，如需答题请刷新页面重新开始。" });
                    return;
                  }
                }
                setTimeout(() => {
                  var _a;
                  lib.$message.info({ content: `开始${isExam2 ? "考试" : "作业"}` });
                  commonWork(this, {
                    workerProvider: (opts) => gxkWorkAndExam(workInfo, opts),
                    start_delay_seconds: (_a = this.cfg.workDelay) != null ? _a : 5
                  });
                }, 1e3);
              } else {
                lib.$message.info({ content: "📢 请手动进入作业/考试，如果未开始答题，请尝试刷新页面。", duration: 0 });
                CommonProject.scripts.render.methods.pin(this);
              }
            }
          };
        },
        async onactive() {
          this.methods.work();
          this.on("historychange", () => {
            this.methods.work();
          });
        }
      }),
      "smart-study": new lib.Script({
        name: "🖥️ 新形态课程-学习脚本",
        matches: [
          ["新形态课程学习页面", "smartcoursestudent.zhihuishu.com/learnPage"],
          ["新形态课程新域名学习页面", "ai-smart-course-student-pro.zhihuishu.com/learnPage"],
          ["新形态课程首页", "smartcoursestudent.zhihuishu.com/singleCourse"],
          ["新形态课程新域名课程首页", "ai-smart-course-student-pro.zhihuishu.com/singleCourse"]
        ],
        namespace: "zhs.smart.study",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "掌握度和作业请视频看完后自行手动进入",
              "不要最小化浏览器/关闭电脑屏幕，可能导致脚本暂停。",
              "任意选择一个章节，脚本会自动往下学“必学”课程。",
              "运行中请将浏览器缩放调整至适合的大小，避免元素遮挡，无法点击",
              "例如：调整缩放到 50%，然后刷新页面即可"
            ]).outerHTML
          },
          switchMode: {
            label: "跳转模式",
            tag: "select",
            defaultValue: "job",
            options: [
              ["job", "只跳转必学章节", "章节后面有必学，并且必学数量未完成的章节，如果全部完成将停止学习"],
              ["all", "顺序跳转"]
            ]
          },
          restudy,
          volume,
          definition,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            defaultValue: 1,
            attrs: { title: "目前智慧树倍速最高只能1.5x，超出有封号风险" },
            options: [
              ["1", "1 x"],
              ["1.25", "1.25 x"],
              ["1.5", "1.5 x"]
            ]
          }
        },
        oncomplete() {
          this.methods.start();
        },
        onhistorychange(type, ...args) {
          if (type === "push") {
            this.methods.start();
          }
        },
        methods() {
          return {
            start: async () => {
              if (location.href.includes("singleCourse")) {
                lib.$message.info({ content: "请点击任意章节开始进行自动学习", duration: 60 });
                return;
              }
              CommonProject.scripts.render.methods.pin(this);
              const processor = new StudyVideoH5();
              const getInfos = () => Array.from(document.querySelectorAll(".section-item-collapse-info"));
              const getChapterName = () => {
                var _a, _b;
                return (((_a = document.querySelector(".point-title-text")) == null ? void 0 : _a.textContent) || "未知章节") + "-" + (((_b = document.querySelector('[class*="card-container"].active .video-title')) == null ? void 0 : _b.textContent) || "未知小节");
              };
              const include_jobs = ["video", "book", "other", "text"];
              const getNextJob = () => {
                var _a, _b;
                const cards = Array.from(document.querySelectorAll('[class*="card-container"]'));
                if (cards.some((card) => card.classList.contains("active")) === false) {
                  return cards[0];
                }
                let target_el;
                const start_index = cards.findIndex((c) => c.classList.contains("active")) || 0;
                for (let index = start_index + 1; index < cards.length; index++) {
                  const card = cards[index];
                  if (this.cfg.restudy) {
                    target_el = card;
                    break;
                  } else {
                    if ((_b = (_a = card.querySelector(".finished-icon")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.includes("已完成")) {
                      continue;
                    }
                    target_el = card;
                    break;
                  }
                }
                return target_el;
              };
              const getNext = () => {
                var _a, _b;
                const infos = getInfos();
                const works = [];
                for (let index = 0; index < infos.length; index++) {
                  const info = infos[index];
                  const text = ((_a = info.querySelector(".collapse-info-progress .progress-text")) == null ? void 0 : _a.textContent) || "";
                  if (this.cfg.switchMode === "all") {
                    works.push({
                      info,
                      progress: 0,
                      total: 1
                    });
                  } else {
                    const [progress, total] = text.replace("必学", "").trim().split("/").map((s) => parseInt(s));
                    if (progress < total) {
                      works.push({ progress, total, info });
                    }
                  }
                }
                let start2 = false;
                for (let index = 0; index < works.length; index++) {
                  const work2 = works[index];
                  if (start2) {
                    if (work2.progress < work2.total) {
                      return works[index].info;
                    }
                  }
                  if (work2.info.classList.contains("active")) {
                    if (this.cfg.switchMode === "all") {
                      return works[index + 1].info;
                    } else {
                      start2 = true;
                    }
                  }
                }
                return (_b = works[0]) == null ? void 0 : _b.info;
              };
              this.onConfigChange("volume", (curr) => {
                state$5.study.currentMedia && (state$5.study.currentMedia.volume = curr);
              });
              this.onConfigChange("playbackRate", (curr) => {
                if (typeof curr === "string") {
                  this.cfg.playbackRate = parseFloat(curr);
                }
                processor.switchPlaybackRate(curr);
              });
              this.onConfigChange("definition", (curr) => {
                processor.switchLine(curr);
              });
              const doWork = async () => {
                await lib.$.sleep(5 * 1e3);
                const next2 = async () => {
                  const nextJob = getNextJob();
                  if (nextJob) {
                    const nextJobTitle = nextJob.querySelector(".common-text");
                    if (include_jobs.some((job) => {
                      var _a;
                      return (_a = nextJob.querySelector(".icon-box")) == null ? void 0 : _a.classList.contains(job);
                    })) {
                      nextJobTitle.click();
                      await doWork();
                    } else {
                      document.querySelectorAll('[class*="card-container"].active').forEach((el) => el.classList.remove("active"));
                      nextJob == null ? void 0 : nextJob.classList.add("active");
                      await lib.$.sleep(1e3);
                      const _open = lib.$gm.unsafeWindow.open;
                      lib.$gm.unsafeWindow.open = () => null;
                      nextJobTitle.click();
                      const msg2 = "链接任务完成，即将自动下一节！";
                      lib.$message.info(msg2);
                      setTimeout(async () => {
                        lib.$gm.unsafeWindow.open = _open;
                        await next2();
                      }, 3e3);
                    }
                    return;
                  }
                  const nextEl = getNext();
                  if (nextEl) {
                    nextEl.click();
                  } else {
                    finishAlert();
                  }
                };
                try {
                  const wrapper = document.querySelector(".video-player-wrapper");
                  if (!wrapper || wrapper.style.display === "none") {
                    throw new Error("视频加载失败");
                  }
                  await waitForMedia({
                    timeout: 5 * 1e3,
                    filter: (m) => m.src.length !== 0
                  });
                } catch {
                  const msg2 = "未找到学习视频，即将自动下一节！";
                  lib.$message.error(msg2);
                  $console.error(msg2);
                  await lib.$.sleep(3e3);
                  await next2();
                  return;
                }
                const set = async () => {
                  try {
                    await processor.switchLine(this.cfg.definition || "line1bq");
                    await lib.$.sleep(1e3);
                    await processor.switchPlaybackRate(this.cfg.playbackRate);
                    await lib.$.sleep(1e3);
                    const media = await waitForMedia({ timeout: 5 * 1e3, filter: (m) => m.src.length !== 0 });
                    await lib.$.sleep(1e3);
                    state$5.study.currentMedia = media;
                    if (media) {
                      media.currentTime = 1;
                      media.volume = this.cfg.volume;
                    }
                    return state$5.study.currentMedia;
                  } catch (e) {
                    $console.log("视频加载失败，请尝试刷新页面！：" + e);
                    lib.$message.error({ content: "视频加载失败，请尝试刷新页面！：" + e, duration: 0 });
                  }
                };
                const video = await set();
                if (!video) {
                  return;
                }
                playMedia(() => video == null ? void 0 : video.play()).then(() => {
                  const cn = getChapterName();
                  lib.$message.info({ content: "正在学习：" + cn });
                  $console.log("正在学习：" + cn);
                });
                video.onpause = async () => {
                  if (!(video == null ? void 0 : video.ended) && state$5.study.stop === false) {
                    await lib.$.sleep(1e3);
                    video == null ? void 0 : video.play();
                  }
                };
                video.onended = async () => {
                  lib.$message.info({ content: "即将自动跳转下一节" });
                  await lib.$.sleep(3e3);
                  await next2();
                };
              };
              doWork();
            }
          };
        }
      }),
      "smart-work": new lib.Script({
        name: "✍️ 新形态课程-作业/考试/掌握度脚本",
        matches: [
          ["新形态课程作业页面", "smartcourseexam.zhihuishu.com/ReviewExam"],
          ["新形态课程-掌握提升页面", "studentexamcomh5.zhihuishu.com/studentReviewTestOrExam"],
          ["新形态课程-AI助教掌握度", "fusioncourseh5.zhihuishu.com/exam"],
          ["新形态课程-新AI助教掌握度", "studywisdomh5.zhihuishu.com/exam"],
          ["新形态课程-新AI学伴掌握度", "wisdom-mooc.zhihuishu.com/exam"]
        ],
        namespace: "zhs.smart.work",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
              "AI 将直接给出答案并由脚本自动填写。",
              "⚠️ 如果没开始答题，请尝试刷新页面。",
              "⚠️ 禁止一次性打开多个作业/考试页面。",
              ...remote_not_required_pages.some((domain2) => location.href.includes(domain2)) ? [] : ["⚠️ 答题中请勿进行任何操作，如需暂停答题", "请等待全部题目搜索完成并执行自动保存功能后才能操作。"]
            ]).outerHTML
          },
          workDelay: {
            label: "作业答题开始时间延迟（秒）",
            defaultValue: 5,
            attrs: { type: "number", min: 1, step: 1, max: 10 }
          }
        },
        methods() {
          return {
            start: async () => {
              var _a;
              CommonProject.scripts.render.methods.pin(this);
              let remotePage;
              const remote_not_required = remote_not_required_pages.some((domain2) => location.href.includes(domain2));
              remote_not_required ? await waitForElement(".exam-item") : await waitForElement(".questionContent");
              if (remote_not_required)
                ;
              else {
                remotePage = await BackgroundProject.scripts.dev.methods.getRemotePlaywrightCurrentPage();
                if (!remotePage) {
                  return $playwright.showError();
                }
                $render.moveToEdge();
                lib.$message.warn({ content: "答题完毕之前请勿操作页面！", duration: 0 });
              }
              commonWork(this, {
                workerProvider: (opts) => {
                  if (remote_not_required) {
                    return fusioncourseWork(remotePage, opts);
                  } else {
                    return smartWork(remotePage, opts);
                  }
                },
                start_delay_seconds: (_a = this.cfg.workDelay) != null ? _a : 5
              });
            }
          };
        },
        oncomplete() {
          this.methods.start();
        },
        onhistorychanged(type, ...args) {
          if (type === "pushed") {
            this.methods.start();
          }
        }
      }),
      "smart-exam": new lib.Script({
        name: "✍️ 新形态课程-考试脚本",
        matches: [["新形态课程-考试界面", "examloop.zhihuishu.com/exam"]],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
              "AI 将直接给出答案并由脚本自动填写。",
              "⚠️ 如果没开始答题，请尝试刷新页面。",
              "⚠️ 禁止一次性打开多个作业/考试页面。"
            ]).outerHTML
          }
        },
        methods() {
          return {
            start: async () => {
              CommonProject.scripts.render.methods.pin(this);
              await waitForElement(".question-area-content");
              if (document.querySelector('[mode="REVIEW_MODE"]')) {
                lib.$message.info("当前试卷状态已完成、脚本将停止运行。");
                return;
              }
              commonWork(this, {
                workerProvider: (opts) => {
                  return smartExam(void 0, opts);
                }
              });
            }
          };
        },
        oncomplete() {
          this.methods.start();
        }
      }),
      "xnk-study": new lib.Script({
        name: "🖥️ 校内课（翻转课）-学习脚本",
        matches: [["校内课学习页面", "zhihuishu.com/aidedteaching/sourceLearning"]],
        namespace: "zhs.xnk.study",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["章节测试请大家观看完视频后手动打开。", "此课程不能使用倍速。"]).outerHTML
          },
          restudy,
          volume
        },
        oncomplete() {
          CommonProject.scripts.render.methods.pin(this);
          const finish = () => {
            lib.$modal.alert({
              content: "检测到当前视频全部播放完毕，如果还有未完成的视频请刷新重试，或者打开复习模式。"
            });
            CommonProject.scripts.settings.methods.notificationBySetting(
              "检测到当前视频全部播放完毕，如果还有未完成的视频请刷新重试，或者打开复习模式。",
              { duration: 0, extraTitle: "知道智慧树学习脚本" }
            );
          };
          this.onConfigChange("volume", (curr) => {
            state$5.study.currentMedia && (state$5.study.currentMedia.volume = curr);
          });
          const nextElement = () => {
            const list = document.querySelectorAll(".file-item");
            let passActive = false;
            for (let index = 0; index < list.length; index++) {
              const item = list[index];
              const finish2 = !!item.querySelector(".icon-finish");
              const needsStudy = !finish2 || finish2 && this.cfg.restudy;
              if (item.classList.contains("active")) {
                if (needsStudy) {
                  return list[index + 1];
                } else {
                  passActive = true;
                }
              }
              if (passActive && needsStudy) {
                return item;
              }
            }
          };
          const interval = setInterval(async () => {
            var _a, _b;
            const next2 = nextElement();
            if (next2) {
              clearInterval(interval);
              if (document.querySelector("#mediaPlayer")) {
                (_a = document.querySelector(".file-item.active")) == null ? void 0 : _a.scrollIntoView();
                const name = ((_b = next2.querySelector("#sourceTit")) == null ? void 0 : _b.textContent) || "未知视频";
                lib.$message.info("正在学习：" + name);
                watchXnk({ volume: this.cfg.volume }, () => {
                  lib.$message.info("视频完成播放，正在自动跳转下一节！");
                  setTimeout(() => {
                    const next22 = nextElement();
                    if (next22)
                      next22.click();
                  }, 3e3);
                });
              } else {
                setTimeout(() => {
                  const msg2 = "未找到学习视频，即将自动下一节！";
                  lib.$message.warn(msg2);
                  $console.warn(msg2);
                  const next22 = nextElement();
                  if (next22)
                    next22.click();
                }, 3e3);
              }
            }
          }, 1e3);
          setTimeout(() => {
            if (!nextElement()) {
              finish();
              clearInterval(interval);
            }
          }, 10 * 1e3);
        }
      }),
      "xnk-work": new lib.Script({
        name: "✍️ 校内课-作业考试脚本",
        matches: [
          ["校内课作业页面", "zhihuishu.com/atHomeworkExam/stu/homeworkQ/exerciseList"],
          ["校内课考试页面", "zhihuishu.com/atHomeworkExam/stu/examQ/examexercise"]
        ],
        namespace: "zhs.xnk.work",
        configs: { notes: workNotes },
        onhistorychanged(type) {
          var _a;
          if (type === "pushed") {
            (_a = this.oncomplete) == null ? void 0 : _a.call(this);
          }
        },
        async oncomplete() {
          commonWork(this, {
            workerProvider: xnkWork
          });
        }
      }),
      "wisdom-study": new lib.Script({
        name: "🖥️ 新智慧学习-学习脚本",
        matches: [
          ["2025-12月新智慧学习页面", "wisdom-mooc.zhihuishu.com/study/index"],
          ["学习提示", "wisdom-mooc.zhihuishu.com/study/analysis"]
        ],
        namespace: "zhs.wisdom.study",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "掌握度和作业请视频看完后自行手动进入",
              "不要最小化浏览器/关闭电脑屏幕，可能导致脚本暂停。",
              "请使用时关闭卡巴斯基软件，否则会被检测出异常脚本。",
              "运行中请将浏览器缩放调整至适合的大小，避免元素遮挡，无法点击",
              "例如：调整缩放到 50%，然后刷新页面即可"
            ]).outerHTML
          },
          restudy,
          skipStudyTimeWarnDialog: {
            label: "忽略习惯分弹窗",
            attrs: {
              title: "如果课程有习惯分需要自行控制学习时长，如果忽略习惯分提示，则可能没有习惯分。",
              type: "checkbox"
            },
            defaultValue: false
          },
          reloadWhenError: {
            label: "视频黑屏时自动刷新",
            attrs: { type: "checkbox", title: "当视频出现加载失败，或者黑屏等异常时，自动刷新页面3次尝试修复" },
            defaultValue: true
          },
          volume,
          definition,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            defaultValue: 1,
            attrs: { title: "目前智慧树倍速最高只能1.5x，超出有封号风险" },
            options: [
              ["1", "1 x"],
              ["1.25", "1.25 x"],
              ["1.5", "1.5 x"]
            ]
          }
        },
        async oncomplete() {
          if (location.href.includes("https://wisdom-mooc.zhihuishu.com/study/analysis")) {
            return lib.$message.info({ content: "请手动进入掌握度进行自动答题。", duration: 10 });
          }
          CommonProject.scripts.render.methods.pin(this);
          const processor = new WishdomH5();
          this.onConfigChange("volume", (curr) => {
            state$5.study.currentMedia && (state$5.study.currentMedia.volume = curr);
          });
          this.onConfigChange("playbackRate", async (curr) => {
            if (typeof curr === "string") {
              this.cfg.playbackRate = parseFloat(curr);
            }
            fixProcessBar();
            processor.switchPlaybackRate(curr);
          });
          this.onConfigChange("definition", async (curr) => {
            fixProcessBar();
            processor.switchLine(curr);
          });
          const next2 = async () => {
            var _a;
            const hidden = lib.$el(".chapter-wrapper.hidden");
            if (hidden) {
              if (processor.remotePage) {
                await processor.remotePage.click(".collapse-box");
              } else {
                await hidden.click();
              }
            }
            document.querySelectorAll(".el-collapse-item__wrap").forEach((e) => e.style.display = "");
            await lib.$.sleep(200);
            const nextJob = processor.getNext({ next: true, restudy: this.cfg.restudy });
            if (nextJob) {
              if (!this.cfg.skipStudyTimeWarnDialog && hasStudyTimeWarnDialog()) {
                lib.$message.warn({
                  content: "检测到习惯分弹窗，当天学习时间已满，如需继续学习，请手动关闭后，刷新页面重新运行脚本！（如想强制学习请前往脚本设置忽略弹窗）",
                  duration: 0
                });
                return;
              } else {
                await closeStudyTimeWarnDialog();
              }
              await waitForMasteryLevelDialogClose();
              await ((_a = processor.remotePage) == null ? void 0 : _a.click(nextJob));
              nextJob.scrollIntoView({ behavior: "smooth", block: "center" });
              doWork();
            } else {
              finishAlert();
            }
          };
          const closeMasteryLevelDialog = () => {
            return new Promise((resolve, reject) => {
              const check = () => {
                var _a;
                if (document.querySelector(".masterylevel-body")) {
                  (_a = processor.remotePage) == null ? void 0 : _a.click(".header-box .close-box");
                  lib.$message.info("掌握度页面已关闭，即将继续学习！");
                }
                setTimeout(check, 3e3);
              };
              check();
            });
          };
          const hasStudyTimeWarnDialog = () => {
            return !!Array.from(document.querySelectorAll(".el-overlay .content")).find(
              (el) => {
                var _a;
                return (_a = el.textContent) == null ? void 0 : _a.includes("保持良好的学习习惯");
              }
            );
          };
          const closeStudyTimeWarnDialog = () => {
            return new Promise((resolve, reject) => {
              const interval = setInterval(() => {
                var _a;
                const dialog = Array.from(document.querySelectorAll(".el-overlay")).find(
                  (el) => {
                    var _a2;
                    return (_a2 = el.textContent) == null ? void 0 : _a2.includes("保持良好的学习习惯");
                  }
                );
                if (dialog) {
                  const btn = dialog.querySelector(".el-dialog__header img");
                  if (btn)
                    (_a = processor.remotePage) == null ? void 0 : _a.click(btn);
                  clearInterval(interval);
                  resolve();
                }
              }, 1e3);
              setTimeout(() => {
                clearInterval(interval);
                resolve();
              }, 3 * 1e3);
            });
          };
          const waitForMasteryLevelDialogClose = async () => {
            return new Promise((resolve, reject) => {
              const check = () => {
                if (!document.querySelector(".masterylevel-body")) {
                  resolve();
                } else {
                  setTimeout(check, 200);
                }
              };
              check();
            });
          };
          const waitForLoad2 = () => {
            return new Promise((resolve, reject) => {
              const check = () => {
                if (document.querySelector(".video-play")) {
                  resolve();
                } else {
                  setTimeout(check, 3e3);
                }
              };
              check();
            });
          };
          await waitForLoad2();
          await lib.$.sleep(3e3);
          closeMasteryLevelDialog();
          processor.hideDialog();
          await processor.init();
          processor.handleTestDialog(processor.remotePage);
          ocsSingletonInterval("study.fixProcessBar.a", () => {
            fixProcessBar();
          }, 1e3);
          lib.$message.success({ content: "即将开始自动学习！" });
          const reload = async (e) => {
            $console.error(e);
            if (this.cfg.reloadWhenError) {
              const msg2 = "视频加载失败，即将刷新页面。";
              const reload_count = await lib.$store.getTab("reload-count");
              if (reload_count && reload_count > 3) {
                const msg22 = "视频加载失败/黑屏导致重新加载页面次数超过3次，请尝试关闭页面重新打开，或者检查网络连接！";
                await lib.$store.setTab("reload-count", 0);
                lib.$message.error({ content: msg22, duration: 0 });
                $console.log(msg22);
                CommonProject.scripts.settings.methods.notificationBySetting(msg22, {
                  duration: 0,
                  extraTitle: "知道智慧树学习脚本"
                });
                return;
              }
              await lib.$store.setTab("reload-count", (reload_count != null ? reload_count : 0) + 1);
              lib.$message.error(msg2);
              $console.log(msg2);
              setTimeout(() => {
                location.reload();
              }, 3e3);
            } else {
              const msg2 = "视频加载失败，即将跳过。";
              lib.$message.error(msg2);
              $console.log(msg2);
              next2();
            }
          };
          const doWork = async () => {
            await waitForCaptcha();
            const set = async () => {
              try {
                await lib.$.sleep(1e3);
                await processor.switchLine(this.cfg.definition || "line1bq");
                await lib.$.sleep(1e3);
                await processor.switchPlaybackRate(this.cfg.playbackRate);
                await lib.$.sleep(1e3);
                const media = await waitForMedia({ timeout: 5 * 1e3, filter: (m) => m.src.length !== 0 });
                await lib.$.sleep(1e3);
                state$5.study.currentMedia = media;
                if (media) {
                  media.currentTime = 1;
                  media.volume = this.cfg.volume;
                }
                return state$5.study.currentMedia;
              } catch (e) {
                reload(e);
              }
            };
            try {
              const media = await waitForMedia({
                timeout: 10 * 1e3,
                filter: (m) => m.src.length !== 0
              });
              media.pause();
              fixProcessBar();
            } catch (e) {
              reload(e);
              return;
            }
            await waitForCaptcha();
            const video = await set();
            if (!video) {
              return;
            }
            const videoCheckInterval = setInterval(async () => {
              if (!(video == null ? void 0 : video.isConnected)) {
                clearInterval(videoCheckInterval);
                lib.$message.info({ content: "检测到视频切换中..." });
                doWork();
              }
            }, 3e3);
            lib.$message.info("开始播放");
            playMedia(() => video == null ? void 0 : video.play()).then(() => {
              const current = document.querySelector(
                ".chapter-item.current , .chapter-content-second.current"
              );
              const cn = current ? processor.getChapterName(current) : "未知章节";
              lib.$message.info({ content: "正在学习：" + cn });
              $console.log("正在学习：" + cn);
            });
            video.onpause = async () => {
              if (!(video == null ? void 0 : video.isConnected))
                return;
              if (!(video == null ? void 0 : video.ended) && state$5.study.stop === false) {
                await lib.$.sleep(1e3);
                video == null ? void 0 : video.play();
              }
            };
            video.onended = async () => {
              if (!(video == null ? void 0 : video.isConnected))
                return;
              lib.$message.info("即将自动跳转下一节");
              $console.info("即将自动跳转下一节");
              clearInterval(videoCheckInterval);
              await lib.$.sleep(3e3);
              await next2();
            };
          };
          doWork();
        }
      }),
      hike: new lib.Script({
        name: "🖥️ 教学空间-AI智慧课程-学习脚本",
        matches: [
          ["学习首页", "hike-teaching-center.polymas.com/stu-hike/agent-course-hike/ai-course-center"],
          ["学习页面", "tools-hike/studentStudyResource"]
        ],
        namespace: "zhs.hike.study",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["请手动进入视频、作业、考试页面，脚本会自动运行。"]).outerHTML
          },
          restudy,
          reloadWhenError: {
            label: "视频黑屏时自动刷新",
            attrs: { type: "checkbox", title: "当视频出现加载失败，或者黑屏等异常时，自动刷新页面3次尝试修复" },
            defaultValue: true
          },
          volume,
          definition,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            defaultValue: 1,
            attrs: { title: "目前智慧树倍速最高只能1.5x，超出有封号风险" },
            options: [
              ["1", "1 x"],
              ["1.25", "1.25 x"],
              ["1.5", "1.5 x"]
            ]
          }
        },
        async oncomplete(...args) {
          CommonProject.scripts.render.methods.pin(this);
          if (location.href.includes("stu-hike/agent-course-hike/ai-course-center")) {
            lib.$message.info({ content: "请手动进入视频、作业、考试页面，脚本会自动运行。", duration: 60 });
            return;
          }
          const processor = new Hike();
          this.onConfigChange("volume", (curr) => {
            state$5.study.currentMedia && (state$5.study.currentMedia.volume = curr);
          });
          this.onConfigChange("playbackRate", async (curr) => {
            if (typeof curr === "string") {
              this.cfg.playbackRate = parseFloat(curr);
            }
            fixProcessBar();
            processor.switchPlaybackRate(curr);
          });
          this.onConfigChange("definition", async (curr) => {
            fixProcessBar();
            processor.switchLine(curr);
          });
          const getChapterName = () => {
            var _a, _b;
            return ((_b = (_a = document.querySelector(".active-file")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || "未知章节";
          };
          const next2 = async () => {
            const nextJob = processor.getNext({ next: true, restudy: this.cfg.restudy });
            if (nextJob) {
              nextJob.click();
              await lib.$.sleep(3e3);
              doWork();
            } else {
              finishAlert();
            }
          };
          const waitForLoad2 = () => {
            return new Promise((resolve, reject) => {
              const check = () => {
                if (processor.hasJob()) {
                  resolve();
                } else {
                  setTimeout(check, 1e3);
                }
              };
              check();
            });
          };
          await waitForLoad2();
          await lib.$.sleep(3e3);
          ocsSingletonInterval("study.fixProcessBar.b", () => {
            fixProcessBar();
          }, 1e3);
          lib.$message.success({ content: "即将开始自动学习！" });
          const reload = async (e) => {
            $console.error(e);
            if (this.cfg.reloadWhenError) {
              const msg2 = "视频加载失败，即将刷新页面。";
              const reload_count = await lib.$store.getTab("reload-count");
              if (reload_count && reload_count > 3) {
                const msg22 = "视频加载失败/黑屏导致重新加载页面次数超过3次，请尝试关闭页面重新打开，或者检查网络连接！";
                await lib.$store.setTab("reload-count", 0);
                lib.$message.error({ content: msg22, duration: 0 });
                $console.log(msg22);
                CommonProject.scripts.settings.methods.notificationBySetting(msg22, {
                  duration: 0,
                  extraTitle: "知道智慧树学习脚本"
                });
                return;
              }
              await lib.$store.setTab("reload-count", (reload_count != null ? reload_count : 0) + 1);
              lib.$message.error(msg2);
              $console.log(msg2);
              setTimeout(() => {
                location.reload();
              }, 3e3);
            } else {
              const msg2 = "视频加载失败，即将跳过。";
              lib.$message.error(msg2);
              $console.log(msg2);
              next2();
            }
          };
          const doWork = async () => {
            var _a, _b, _c;
            await waitForCaptcha();
            if (!((_c = (_b = (_a = document.querySelector(".active-file")) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.querySelector(".icon-movie"))) {
              lib.$message.warn("当前章节不支持学习，即将跳转下一节");
              await lib.$.sleep(3e3);
              await next2();
              return;
            }
            const set = async () => {
              try {
                await processor.switchLine(this.cfg.definition || "line1bq");
                await lib.$.sleep(1e3);
                await processor.switchPlaybackRate(this.cfg.playbackRate);
                await lib.$.sleep(1e3);
                const media = await waitForMedia({ timeout: 5 * 1e3, filter: (m) => m.src.length !== 0 });
                await lib.$.sleep(1e3);
                state$5.study.currentMedia = media;
                if (media) {
                  media.currentTime = 1;
                  media.volume = this.cfg.volume;
                }
                return state$5.study.currentMedia;
              } catch (e) {
                reload(e);
              }
            };
            lib.$message.info("开始播放");
            try {
              const media = await waitForMedia({
                timeout: 10 * 1e3,
                filter: (m) => m.src.length !== 0
              });
              media.pause();
              fixProcessBar();
            } catch (e) {
              reload(e);
              return;
            }
            await waitForCaptcha();
            const video = await set();
            if (!video) {
              return;
            }
            const videoCheckInterval = setInterval(async () => {
              if (!(video == null ? void 0 : video.isConnected)) {
                clearInterval(videoCheckInterval);
                lib.$message.info({ content: "检测到视频切换中..." });
                doWork();
              }
            }, 3e3);
            playMedia(() => video == null ? void 0 : video.play()).then(() => {
              const cn = getChapterName();
              lib.$message.info({ content: "正在学习：" + cn });
              $console.log("正在学习：" + cn);
            });
            video.onpause = async () => {
              if (!(video == null ? void 0 : video.isConnected))
                return;
              if (!(video == null ? void 0 : video.ended) && state$5.study.stop === false) {
                await lib.$.sleep(1e3);
                video == null ? void 0 : video.play();
              }
            };
            video.onended = async () => {
              if (!(video == null ? void 0 : video.isConnected))
                return;
              lib.$message.info("即将自动跳转下一节");
              $console.info("即将自动跳转下一节");
              clearInterval(videoCheckInterval);
              await lib.$.sleep(3e3);
              await next2();
            };
          };
          doWork();
        }
      }),
      hike_v2: new lib.Script({
        name: "🖥️ 教学空间-AI智慧课程-学习脚本",
        matches: [
          ["学习首页", /polymas.com\/stu-hike\/agent-course-full\/.*\/stu\/(course-home|study)/],
          ["学习页面", "/stu/study/resource-detail"]
        ],
        namespace: "zhs.hike_v2.study",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["请手动进入视频、作业、考试页面，脚本会自动运行。"]).outerHTML
          },
          restudy,
          reloadWhenError: {
            label: "视频黑屏时自动刷新",
            attrs: { type: "checkbox", title: "当视频出现加载失败，或者黑屏等异常时，自动刷新页面3次尝试修复" },
            defaultValue: true
          },
          volume
        },
        oncomplete(...args) {
          var _a;
          (_a = this.onhistorychange) == null ? void 0 : _a.call(this, "push", ...args);
        },
        async onhistorychange(type) {
          if (type !== "push") {
            return;
          }
          if (!location.href.includes("stu/study/resource-detail")) {
            lib.$message.info({ content: "请手动进入视频、作业、考试页面，脚本会自动运行。", duration: 60 });
            return;
          }
          const processor = new HikeV2();
          this.onConfigChange("volume", (curr) => {
            state$5.study.currentMedia && (state$5.study.currentMedia.volume = curr);
          });
          const next2 = async () => {
            var _a;
            (_a = document.querySelector(".drawer-panel")) == null ? void 0 : _a.classList.add("active");
            const nextJob = processor.getNext({ next: true, restudy: this.cfg.restudy });
            if (nextJob) {
              nextJob.scrollIntoView({ behavior: "smooth", block: "center" });
              await lib.$.sleep(200);
              nextJob.click();
              await lib.$.sleep(3e3);
              doJob();
            } else {
              finishAlert();
            }
          };
          const waitForLoad2 = () => {
            return new Promise((resolve, reject) => {
              const check = () => {
                if (processor.hasJob()) {
                  resolve();
                } else {
                  setTimeout(check, 1e3);
                }
              };
              check();
            });
          };
          await waitForLoad2();
          await lib.$.sleep(3e3);
          lib.$message.success({ content: "即将开始自动学习！" });
          const reload = async (e) => {
            $console.error(e);
            if (this.cfg.reloadWhenError) {
              const msg2 = "视频加载失败，即将刷新页面。";
              const reload_count = await lib.$store.getTab("reload-count");
              if (reload_count && reload_count > 3) {
                const msg22 = "视频加载失败/黑屏导致重新加载页面次数超过3次，请尝试关闭页面重新打开，或者检查网络连接！";
                await lib.$store.setTab("reload-count", 0);
                lib.$message.error({ content: msg22, duration: 0 });
                $console.log(msg22);
                CommonProject.scripts.settings.methods.notificationBySetting(msg22, {
                  duration: 0,
                  extraTitle: "知道智慧树学习脚本"
                });
                return;
              }
              await lib.$store.setTab("reload-count", (reload_count != null ? reload_count : 0) + 1);
              lib.$message.error(msg2);
              $console.log(msg2);
              setTimeout(() => {
                location.reload();
              }, 3e3);
            } else {
              const msg2 = "视频加载失败，即将跳过。";
              lib.$message.error(msg2);
              $console.log(msg2);
              next2();
            }
          };
          const doJob = async () => {
            await waitForCaptcha();
            if (!document.querySelector(".video-js")) {
              lib.$message.warn("当前章节不支持学习，即将跳转下一节");
              await lib.$.sleep(3e3);
              await next2();
              return;
            }
            const set = async () => {
              try {
                await lib.$.sleep(1e3);
                const media = await waitForMedia({ timeout: 5 * 1e3, filter: (m) => m.src.length !== 0 });
                await lib.$.sleep(1e3);
                state$5.study.currentMedia = media;
                if (media) {
                  media.currentTime = 1;
                  media.volume = this.cfg.volume;
                }
                return state$5.study.currentMedia;
              } catch (e) {
                reload(e);
              }
            };
            lib.$message.info("开始播放");
            await waitForCaptcha();
            const video = await set();
            if (!video) {
              return;
            }
            const video_src = video.src;
            const videoCheckInterval = setInterval(async () => {
              if (!(video == null ? void 0 : video.isConnected) || video.src !== video_src) {
                clearInterval(videoCheckInterval);
                lib.$message.info({ content: "检测到视频切换中..." });
                doJob();
              }
            }, 3e3);
            playMedia(() => video == null ? void 0 : video.play()).then(() => {
              const cn = processor.getChapterName();
              lib.$message.info({ content: "正在学习：" + cn });
              $console.log("正在学习：" + cn);
            });
            video.onpause = async () => {
              if (!(video == null ? void 0 : video.isConnected))
                return;
              if (!(video == null ? void 0 : video.ended) && state$5.study.stop === false) {
                await lib.$.sleep(1e3);
                video == null ? void 0 : video.play();
              }
            };
            video.onended = async () => {
              if (!(video == null ? void 0 : video.isConnected))
                return;
              lib.$message.info("即将自动跳转下一节");
              $console.info("即将自动跳转下一节");
              clearInterval(videoCheckInterval);
              await lib.$.sleep(3e3);
              await next2();
            };
          };
          doJob();
        }
      }),
      "hike-work": new lib.Script({
        matches: [["AI教学中心-作业任务页面", "/stu-hike/stuHomeworkDo"]],
        name: "✍️ 教学空间-AI智慧课程-作业考试脚本",
        namespace: "zhs.hike.work",
        configs: {
          notes: workNotes,
          workDelay: {
            label: "作业答题开始时间延迟（秒）",
            defaultValue: 5,
            attrs: { type: "number", min: 1, step: 1, max: 10 }
          }
        },
        async oncomplete() {
          var _a;
          CommonProject.scripts.render.methods.pin(this);
          await waitForElement(".q_main");
          commonWork(this, {
            workerProvider: (opts) => {
              return hikeWork(void 0, opts);
            },
            start_delay_seconds: (_a = this.cfg.workDelay) != null ? _a : 5
          });
        }
      }),
      "hike-homework": new lib.Script({
        matches: [
          ["AI教学中心-题目作业", "/stu/answer-homework"],
          ["AI教学中心-作业任务页面", "/stu-exam/answer-exam"]
        ],
        name: "✍️ 教学空间-AI智慧课程-题目作业脚本",
        namespace: "zhs.hike.homework",
        configs: {
          notes: workNotes,
          workDelay: {
            label: "作业答题开始时间延迟（秒）",
            defaultValue: 5,
            attrs: { type: "number", min: 1, step: 1, max: 10 }
          }
        },
        async oncomplete() {
          var _a;
          CommonProject.scripts.render.methods.pin(this);
          await waitForElement(".question-item");
          commonWork(this, {
            workerProvider: (opts) => {
              return hikeHomework(void 0, opts);
            },
            start_delay_seconds: (_a = this.cfg.workDelay) != null ? _a : 5
          });
        }
      })
    }
  });
  async function watch(processor, options, actions) {
    const reload = async (e) => {
      $console.error(e);
      if (options.reloadWhenError) {
        const msg2 = "视频加载失败，即将刷新页面。";
        const reload_count = await lib.$store.getTab("reload-count");
        if (reload_count && reload_count > 3) {
          const msg22 = "视频加载失败导致重新加载页面次数超过3次，请尝试关闭页面重新打开，或者检查网络连接！";
          await lib.$store.setTab("reload-count", 0);
          lib.$message.error({ content: msg22, duration: 0 });
          $console.log(msg22);
          CommonProject.scripts.settings.methods.notificationBySetting(msg22, {
            duration: 0,
            extraTitle: "知道智慧树学习脚本"
          });
          return;
        }
        await lib.$store.setTab("reload-count", (reload_count != null ? reload_count : 0) + 1);
        lib.$message.error(msg2);
        $console.log(msg2);
        setTimeout(() => {
          actions.reload();
        }, 5e3);
      } else {
        const msg2 = "视频加载失败，即将跳过。";
        lib.$message.error(msg2);
        $console.log(msg2);
        actions.onended({ next: true });
      }
    };
    const set = async () => {
      try {
        await lib.$.sleep(1e3);
        fixProcessBar();
        await processor.switchLine(options.definition || "line1bq");
        await lib.$.sleep(1e3);
        fixProcessBar();
        await processor.switchPlaybackRate(options.playbackRate);
        await lib.$.sleep(1e3);
        const media = await waitForMedia({ timeout: 10 * 1e3 });
        await lib.$.sleep(1e3);
        state$5.study.currentMedia = media;
        if (media) {
          media.currentTime = 1;
          media.volume = options.volume;
        }
        return state$5.study.currentMedia;
      } catch (e) {
        return await reload(e);
      }
    };
    lib.$message.info("开始播放");
    try {
      const media = await waitForMedia({ timeout: 10 * 1e3 });
      media.volume = options.volume;
      media.pause();
      fixProcessBar();
    } catch (e) {
      return await reload(e);
    }
    await lib.$.sleep(1e3);
    const video = await set();
    if (!video) {
      return await reload("视频加载失败");
    }
    const videoCheckInterval = setInterval(async () => {
      if ((video == null ? void 0 : video.isConnected) === false) {
        clearInterval(videoCheckInterval);
        lib.$message.info({ content: "检测到视频切换中..." });
        actions.onended({ next: false });
      }
    }, 3e3);
    playMedia(() => video == null ? void 0 : video.play());
    video.onpause = async () => {
      if (!(video == null ? void 0 : video.ended) && state$5.study.stop === false) {
        await waitForCaptcha();
        await lib.$.sleep(1e3);
        video == null ? void 0 : video.play();
      }
    };
    video.onended = () => {
      clearInterval(videoCheckInterval);
      actions.onended({ next: true });
    };
  }
  async function watchXnk(options, onended) {
    const media = await waitForMedia();
    media.volume = options.volume;
    media.currentTime = 1;
    state$5.study.currentMedia = media;
    playMedia(() => media == null ? void 0 : media.play());
    media.onpause = async () => {
      if (!(media == null ? void 0 : media.ended)) {
        await lib.$.sleep(1e3);
        media == null ? void 0 : media.play();
      }
    };
    media.onended = () => {
      onended();
    };
  }
  function checkForCaptcha(update) {
    let modal2;
    let notified = false;
    return setInterval(() => {
      if (lib.$el(".yidun_popup")) {
        update(true);
        if (modal2 === void 0) {
          modal2 = lib.$modal.alert({ content: "当前检测到验证码，请输入后方可继续运行。" });
        }
        if (!notified) {
          notified = true;
          CommonProject.scripts.settings.methods.notificationBySetting(
            "智慧树脚本：当前检测到验证码，请输入后方可继续运行。",
            { duration: 0 }
          );
        }
      } else {
        if (modal2) {
          update(false);
          modal2.remove();
          modal2 = void 0;
        }
      }
    }, 1e3);
  }
  function waitForCaptcha() {
    const popup = getPopupCaptcha();
    if (popup) {
      const message2 = lib.$message.warn({ content: "当前检测到验证码，请输入后方可继续运行。", duration: 0 });
      CommonProject.scripts.settings.methods.notificationBySetting(
        "智慧树脚本：当前检测到验证码，请输入后方可继续运行。",
        { duration: 0 }
      );
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          const popup2 = getPopupCaptcha();
          if (popup2 === null) {
            message2 == null ? void 0 : message2.remove();
            clearInterval(interval);
            resolve();
          }
        }, 1e3);
      });
    }
  }
  function getPopupCaptcha() {
    return document.querySelector(".yidun_popup");
  }
  function gxkWorkAndExam(workInfo, { period, thread, stopSecondWhenFinish, redundanceWordsText, answerSeparators }) {
    var _a, _b, _c;
    CommonProject.scripts.workResults.methods.init({
      questionPositionSyncHandlerType: "zhs-gxk"
    });
    const allExamParts = ((_c = ((_b = (_a = workInfo == null ? void 0 : workInfo.rt) == null ? void 0 : _a.examBase) == null ? void 0 : _b.workExamParts) || []) == null ? void 0 : _c.map((p) => p.questionDtos).flat()) || [];
    const titleTransform = (_, index) => {
      var _a2;
      const div = lib.h("div");
      div.innerHTML = ((_a2 = allExamParts[index]) == null ? void 0 : _a2.name) || "题目读取失败";
      return removeRedundantWords(
        optimizationElementWithImage(div, true).innerText || "",
        redundanceWordsText.split("\n")
      );
    };
    let request_index = 0;
    const worker = new OCSWorker({
      root: ".examPaper_subject",
      elements: {
        title: ".subject_describe > div,.smallStem_describe > div:nth-child(2)",
        options: (root2) => lib.$$el(".subject_node .nodeLab", root2).map((t2) => {
          for (const img of Array.from(t2.querySelectorAll(".node_detail img"))) {
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            createUnVisibleTextOfImage(img);
          }
          return t2;
        })
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(void 0, request_index++);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await lib.$.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type(ctx) {
          var _a2, _b2, _c2, _d;
          const type = (_d = (_c2 = (_b2 = (_a2 = ctx.elements.title[0].parentElement) == null ? void 0 : _a2.parentElement) == null ? void 0 : _b2.querySelector(".subject_type")) == null ? void 0 : _c2.textContent) == null ? void 0 : _d.trim();
          if (type == null ? void 0 : type.includes("单选题")) {
            return "single";
          } else if (type == null ? void 0 : type.includes("多选题")) {
            return "multiple";
          } else if (type == null ? void 0 : type.includes("判断题")) {
            return "judgement";
          } else if (type == null ? void 0 : type.includes("填空题")) {
            return "completion";
          } else {
            return void 0;
          }
        },
        async handler(type, answer, option) {
          var _a2;
          if (type === "judgement" || type === "single" || type === "multiple") {
            if (!((_a2 = option.querySelector("input")) == null ? void 0 : _a2.checked)) {
              option.click();
              await lib.$.sleep(200);
            }
          } else if (type === "completion" && answer.trim()) {
            const text = option.querySelector("textarea");
            if (text) {
              text.value = answer;
              dispatchAnswerInput(text);
              await lib.$.sleep(200);
            }
          }
        }
      },
      onResultsUpdate(curr, index, res) {
        var _a2, _b2;
        CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, titleTransform));
        if ((_a2 = curr.result) == null ? void 0 : _a2.finish) {
          const title = (_b2 = allExamParts[index]) == null ? void 0 : _b2.name;
          if (title) {
            CommonProject.scripts.apps.methods.recordAIResult(
              simplifyWorkResult([curr], (_, __) => title)
            );
          }
        }
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
      }
    });
    checkForCaptcha((hasCaptcha) => {
      if (hasCaptcha) {
        worker.emit("stop");
      } else {
        worker.emit("continuate");
      }
    });
    worker.doWork().then(async (res) => {
      var _a2;
      if (worker.isClose === true) {
        return;
      }
      lib.$message.success({ content: `答题完成，将等待 ${stopSecondWhenFinish} 秒后进行保存或提交。` });
      await lib.$.sleep(stopSecondWhenFinish * 1e3);
      if (worker.isClose === true) {
        return;
      }
      for (let index = 0; index < worker.totalQuestionCount; index++) {
        if (worker.isClose === true) {
          return;
        }
        const modal2 = lib.$modal.alert({
          title: "⚠️提示",
          content: `正在自动保存题目中，不然填写的答案将无效，<br>当前进度 ${index}/${worker.totalQuestionCount}<br>保存完毕前请勿操作...`,
          confirmButton: null,
          maskCloseable: false
        });
        await waitForCaptcha();
        await lib.$.sleep(2e3);
        (_a2 = document.querySelectorAll(".answerCard_list ul li").item(index)) == null ? void 0 : _a2.click();
        await lib.$.sleep(200);
        const next2 = lib.$el("div.examPaper_box > div.switch-btn-box > button:nth-child(2)");
        if (next2) {
          next2.click();
        } else {
          $console.error("未找到下一页按钮。");
        }
        modal2 == null ? void 0 : modal2.remove();
      }
      await autoSubmitAssessment(worker, res, { delay: 0 });
      worker.emit("done");
    }).catch((err) => {
      lib.$message.error({ content: "答题程序发生错误 : " + err.message, duration: 0 });
    });
    return worker;
  }
  function xnkWork({ period, thread, answerSeparators }) {
    lib.$message.info({ content: "开始作业" });
    CommonProject.scripts.workResults.methods.init();
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => t2 ? optimizationElementWithImage(t2).innerText : "").join(",");
    };
    const workResults = [];
    let totalQuestionCount = 0;
    let requestedCount = 0;
    let resolvedCount = 0;
    const worker = new OCSWorker({
      root: "div:has(> .questionContent)",
      elements: {
        title: ".questionContent",
        options: ".optionUl label",
        questionTit: ".questionTit"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await lib.$.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        async handler(type, answer, option, ctx) {
          var _a;
          if (type === "judgement" || type === "single" || type === "multiple") {
            if (((_a = option.querySelector("input")) == null ? void 0 : _a.checked) === false) {
              option.click();
              await lib.$.sleep(200);
            }
          } else if (type === "completion" && answer.trim()) {
            const text = option.querySelector("textarea");
            if (text) {
              text.value = answer;
              dispatchAnswerInput(text);
              await lib.$.sleep(200);
            }
          }
        }
      },
      onResultsUpdate(current, _, res) {
        var _a;
        if (current.result) {
          workResults.push(...simplifyWorkResult([current], titleTransform));
          CommonProject.scripts.workResults.methods.setResults(workResults);
          totalQuestionCount++;
          requestedCount++;
          if (current.result.finish === true) resolvedCount++;
        }
        if ((_a = current.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(
            simplifyWorkResult([current], titleTransform)
          );
        }
        CommonProject.scripts.workResults.methods.updateWorkState({
          totalQuestionCount,
          requestedCount,
          resolvedCount
        });
      }
    });
    const getBtn = () => document.querySelector("span.Topicswitchingbtn:nth-child(2)");
    let next2 = getBtn();
    (async () => {
      const allResults = [];
      while (worker.isClose === false) {
        allResults.push(await worker.doWork());
        await lib.$.sleep(1e3);
        next2 = getBtn();
        if (!next2 || !isVisibleAction(next2)) break;
        next2.click();
        await lib.$.sleep(1e3);
      }
      await autoSubmitAssessment(worker, allResults);
      worker.emit("done");
      CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "zhs-xnk";
    })();
    return worker;
  }
  function smartWork(remotePage, { period, thread, answerSeparators }) {
    lib.$message.info({ content: "开始作业" });
    lib.$message.warn({
      content: "⚠️ 答题中请勿进行任何操作，如需暂停答题，请等待全部题目搜索完成并执行自动保存功能后才能操作。",
      duration: 0,
      closeable: false
    });
    CommonProject.scripts.workResults.methods.init();
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => t2 ? optimizationElementWithImage(t2).innerText : "").join(",");
    };
    const workResults = [];
    let totalQuestionCount = 0;
    let requestedCount = 0;
    let resolvedCount = 0;
    const worker = new OCSWorker({
      root: ".questionContent",
      elements: {
        title: ".questionName .centent-pre",
        options: ".radio-view li.clearfix, .checkbox-views label.el-checkbox, .fillAnswer"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await lib.$.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type(ctx) {
          var _a, _b, _c;
          const type = (_c = (_b = (_a = ctx.elements.title[0]) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.querySelector(".letterSortNum")) == null ? void 0 : _c.textContent;
          if (type == null ? void 0 : type.includes("单选题")) {
            return "single";
          } else if (type == null ? void 0 : type.includes("多选题")) {
            return "multiple";
          } else if (type == null ? void 0 : type.includes("判断题")) {
            return "judgement";
          } else if (type == null ? void 0 : type.includes("填空")) {
            return "completion";
          } else {
            return void 0;
          }
        },
        async handler(type, answer, option, ctx) {
          if (type === "judgement" || type === "single" || type === "multiple") {
            const opt = option.querySelector(
              ".el-checkbox__input:not(.is-checked),i.iconfont:not(.checkedIcon)"
            );
            if (opt) {
              if (remotePage) {
                await remotePage.click(opt);
              } else {
                opt.click();
              }
              await lib.$.sleep(200);
            }
          } else if (type === "completion") {
            const opt = option.querySelector("input");
            if (opt && answer.trim()) {
              if (remotePage) {
                await remotePage.click(opt);
                opt.value = "";
                await remotePage["keyboard.type"](answer, { delay: Math.floor(Math.random() * 100) });
              } else {
                opt.value = answer;
                dispatchAnswerInput(opt);
              }
              await lib.$.sleep(200);
            }
          }
        }
      },
      onResultsUpdate(current, _, res) {
        var _a;
        if (current.result) {
          workResults.push(...simplifyWorkResult([current], titleTransform));
          CommonProject.scripts.workResults.methods.setResults(workResults);
          totalQuestionCount++;
          requestedCount++;
          if (current.result.finish === true) resolvedCount++;
        }
        if ((_a = current.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(
            simplifyWorkResult([current], titleTransform)
          );
        }
        CommonProject.scripts.workResults.methods.updateWorkState({
          totalQuestionCount,
          requestedCount,
          resolvedCount
        });
      }
    });
    const getNextBtn = () => document.querySelector(".next-topic.next-t");
    let next2 = null;
    (async () => {
      const first = document.querySelector('[role="treeitem"] .font-sec-style-node');
      if (first) {
        if (remotePage)
          await remotePage.click(first);
        else
          first.click();
        await lib.$.sleep(3e3);
      }
      let count = 0;
      const allResults = [];
      while (worker.isClose === false) {
        allResults.push(await worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }));
        next2 = getNextBtn();
        if (!next2) {
          break;
        }
        await lib.$.sleep(1e3);
        if (remotePage)
          await remotePage.click(next2);
        else
          next2.click();
        await lib.$.sleep(1e3);
        count++;
      }
      await autoSubmitAssessment(worker, allResults);
      worker.emit("done");
      CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "zhs-smart";
    })();
    return worker;
  }
  function smartExam(remotePage, { period, thread, answerSeparators }) {
    lib.$message.info({ content: "开始作业" });
    lib.$message.warn({
      content: "⚠️ 答题中请勿进行任何操作，如需暂停答题，请等待全部题目搜索完成并执行自动保存功能后才能操作。",
      duration: 0,
      closeable: false
    });
    CommonProject.scripts.workResults.methods.init();
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => t2 ? optimizationElementWithImage(t2).innerText : "").join(",");
    };
    const workResults = [];
    let totalQuestionCount = 0;
    let requestedCount = 0;
    let resolvedCount = 0;
    const worker = new OCSWorker({
      root: ".question-area-content",
      elements: {
        type: "div.flex.items-center.mb-\\[16px\\]",
        title: "div.flex-1 .mb-\\[32px\\] .text-mainText.font-medium",
        options: "label.user-select.group,div.real-editor"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await lib.$.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type(ctx) {
          const type = ctx.elements.type[0].textContent;
          if (type == null ? void 0 : type.includes("单选")) {
            return "single";
          } else if (type == null ? void 0 : type.includes("多选题")) {
            return "multiple";
          } else if (type == null ? void 0 : type.includes("判断")) {
            return "judgement";
          } else if ((type == null ? void 0 : type.includes("填空")) || (type == null ? void 0 : type.includes("问答"))) {
            return "completion";
          } else {
            return void 0;
          }
        },
        async handler(type, answer, option, ctx) {
          if (type === "judgement" || type === "single" || type === "multiple") {
            if (option.querySelector("div.bg-mainBg") === null) {
              if (remotePage) {
                await remotePage.click(option);
              } else {
                option.click();
              }
              await lib.$.sleep(200);
            }
          } else if (type === "completion") {
            if (option.classList.contains("real-editor")) {
              option.ckeditorInstance.data.set(answer);
            } else {
              const input = option.querySelector("input");
              if (input) {
                input.value = answer;
                Reflect.set(input, "composition", true);
                input.dispatchEvent(new Event("input", { bubbles: true }));
              }
            }
            await lib.$.sleep(200);
          }
        }
      },
      onResultsUpdate(current, _, res) {
        var _a;
        if (current.result) {
          workResults.push(...simplifyWorkResult([current], titleTransform));
          CommonProject.scripts.workResults.methods.setResults(workResults);
          totalQuestionCount++;
          requestedCount++;
          if (current.result.finish === true) resolvedCount++;
        }
        if ((_a = current.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(
            simplifyWorkResult([current], titleTransform)
          );
        }
        CommonProject.scripts.workResults.methods.updateWorkState({
          totalQuestionCount,
          requestedCount,
          resolvedCount
        });
      }
    });
    const getNextBtn = () => Array.from(document.querySelectorAll("button")).find(
      (btn) => {
        var _a;
        return (_a = btn.textContent) == null ? void 0 : _a.includes("下一题");
      }
    );
    let next2 = null;
    (async () => {
      const first = document.querySelector(".grid.grid-cols-7 > button");
      if (first) {
        if (remotePage)
          await remotePage.click(first);
        else
          first.click();
        await lib.$.sleep(3e3);
      }
      let count = 0;
      const allResults = [];
      while (worker.isClose === false) {
        allResults.push(await worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }));
        next2 = getNextBtn();
        if (!next2) {
          break;
        }
        await lib.$.sleep(1e3);
        if (remotePage)
          await remotePage.click(next2);
        else
          next2.click();
        await lib.$.sleep(1e3);
        count++;
      }
      await autoSubmitAssessment(worker, allResults);
      worker.emit("done");
      CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "zhs-smart";
    })();
    return worker;
  }
  function fusioncourseWork(remotePage, { period, thread, answerSeparators }) {
    lib.$message.info({ content: "开始作业" });
    CommonProject.scripts.workResults.methods.init({
      questionPositionSyncHandlerType: "zhs-fusion"
    });
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => t2 ? optimizationElementWithImage(t2).innerText : "").join(",");
    };
    const worker = new OCSWorker({
      root: ".exam-item",
      elements: {
        type: ".quest-type",
        title: ".quest-title .option-name",
        options: "label"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await lib.$.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type(ctx) {
          const type = ctx.elements.type[0].textContent;
          if (type == null ? void 0 : type.includes("单选题")) {
            return "single";
          } else if (type == null ? void 0 : type.includes("多选题")) {
            return "multiple";
          } else if (type == null ? void 0 : type.includes("判断题")) {
            return "judgement";
          } else if (type == null ? void 0 : type.includes("填空题")) {
            return "completion";
          } else {
            return void 0;
          }
        },
        async handler(type, answer, option, ctx) {
          if (type === "judgement" || type === "single" || type === "multiple") {
            const opt = option.querySelector(
              ".el-checkbox__input:not(.is-checked),.el-radio__input:not(.is-checked)"
            );
            if (opt) {
              if (remotePage) {
                await remotePage.click(opt);
              } else {
                opt.click();
              }
              await lib.$.sleep(200);
            }
          }
        }
      },
      onResultsUpdate(current, _, res) {
        var _a;
        if (current.result) {
          CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, titleTransform));
        }
        if ((_a = current.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(
            simplifyWorkResult([current], titleTransform)
          );
        }
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
      }
    });
    worker.doWork().then(async (res) => {
      if (worker.isClose === true) {
        return;
      }
      if (worker.isClose === true) {
        return;
      }
      await autoSubmitAssessment(worker, res);
      worker.emit("done");
    }).catch((err) => {
      lib.$message.error({ content: "答题程序发生错误 : " + err.message, duration: 0 });
    });
    return worker;
  }
  function hikeWork(remotePage, { period, thread, answerSeparators }) {
    lib.$message.info({ content: "开始作业" });
    CommonProject.scripts.workResults.methods.init({
      questionPositionSyncHandlerType: "zhs-hike"
    });
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => t2 ? optimizationElementWithImage(t2).innerText : "").join(",");
    };
    const worker = new OCSWorker({
      root: ".q_main",
      elements: {
        type: ".question_score",
        title: ".question-topic",
        options: "label"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await lib.$.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type(ctx) {
          const type = ctx.elements.type[0].textContent;
          if (type == null ? void 0 : type.includes("单选题")) {
            return "single";
          } else if (type == null ? void 0 : type.includes("多选题")) {
            return "multiple";
          } else if (type == null ? void 0 : type.includes("判断题")) {
            return "judgement";
          } else if (type == null ? void 0 : type.includes("填空题")) {
            return "completion";
          } else {
            return void 0;
          }
        },
        async handler(type, answer, option, ctx) {
          if (type === "judgement" || type === "single" || type === "multiple") {
            const opt = option.querySelector(
              ".el-checkbox__input:not(.is-checked),.el-radio__input:not(.is-checked)"
            );
            if (opt) {
              if (remotePage) {
                await remotePage.click(opt);
              } else {
                opt.click();
              }
              await lib.$.sleep(200);
            }
          }
        }
      },
      onResultsUpdate(current, _, res) {
        var _a;
        if (current.result) {
          CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, titleTransform));
        }
        if ((_a = current.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(
            simplifyWorkResult([current], titleTransform)
          );
        }
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
      }
    });
    const getNextBtn = () => document.querySelector(".check_btn:not(.is-disabled)");
    let next2 = getNextBtn();
    let count = 0;
    (async () => {
      const first = document.querySelector(".card_ul .card_li");
      if (first) {
        if (remotePage)
          await remotePage.click(first);
        else
          first.click();
        await lib.$.sleep(3e3);
      }
      const allResults = [];
      while (worker.isClose === false) {
        allResults.push(await worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }));
        next2 = getNextBtn();
        if (next2 && isVisibleAction(next2)) {
          await lib.$.sleep(1e3);
          if (remotePage)
            await remotePage.click(next2);
          else
            next2.click();
          await lib.$.sleep(1e3);
          count++;
        } else break;
      }
      await autoSubmitAssessment(worker, allResults);
      worker.emit("done");
      CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "zhs-hike";
    })();
    return worker;
  }
  function hikeHomework(remotePage, { period, thread, answerSeparators }) {
    lib.$message.info({ content: "开始作业" });
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => t2 ? optimizationElementWithImage(t2).innerText : "").join(",");
    };
    const worker = new OCSWorker({
      root: ".question-item",
      elements: {
        type: ".title-box,.combination-title",
        title: ".qeustion-content , .combination-content ",
        options: ".option-item, .vditor-content"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await lib.$.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type(ctx) {
          const type = ctx.elements.type[0].textContent;
          if (type == null ? void 0 : type.includes("单选")) {
            return "single";
          } else if (type == null ? void 0 : type.includes("多选")) {
            return "multiple";
          } else if (type == null ? void 0 : type.includes("判断")) {
            return "judgement";
          } else if (type == null ? void 0 : type.includes("问答")) {
            return "completion";
          } else {
            return void 0;
          }
        },
        async handler(type, answer, option, ctx) {
          if (type === "judgement" || type === "single" || type === "multiple") {
            if (remotePage) {
              await remotePage.click(option);
            } else {
              option.click();
            }
            await lib.$.sleep(200);
          } else if (type === "completion") {
            const textarea = option.querySelector(".vditor-reset");
            if (textarea) {
              const paragraph = document.createElement("p");
              paragraph.setAttribute("data-block", "0");
              paragraph.textContent = answer.trim();
              textarea.replaceChildren(paragraph);
              dispatchAnswerInput(textarea);
            }
          }
        }
      },
      onResultsUpdate(current, _, res) {
        var _a;
        if (current.result) {
          CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, titleTransform));
        }
        if ((_a = current.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(
            simplifyWorkResult([current], titleTransform)
          );
        }
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
      }
    });
    worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }).then(async (results) => {
      await autoSubmitAssessment(worker, results);
      worker.emit("done");
      CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "zhs-hike";
    });
    return worker;
  }
  function optimizeSecond(second) {
    if (second > 3600) {
      return `${Math.floor(second / 3600)}小时${Math.floor(second % 3600 / 60)}分钟`;
    } else if (second > 60) {
      return `${Math.floor(second / 60)}分钟${second % 60}秒`;
    } else {
      return `${second}秒`;
    }
  }
  function autoStop(stopTime) {
    var _a, _b;
    clearInterval(state$5.study.stopInterval);
    (_a = state$5.study.stopMessage) == null ? void 0 : _a.remove();
    if (stopTime !== "0") {
      let stopCount = parseFloat(stopTime) * 60 * 60;
      state$5.study.stopInterval = setInterval(() => {
        var _a2;
        if (stopCount > 0) {
          if (getPopupCaptcha() === null) {
            stopCount--;
          }
        } else {
          clearInterval(state$5.study.stopInterval);
          state$5.study.stop = true;
          (_a2 = lib.$el("video")) == null ? void 0 : _a2.pause();
          lib.$modal.alert({ content: "脚本暂停，已获得今日平时分，如需继续观看，请刷新页面。" });
        }
      }, 1e3);
      const val = ((_b = ZHSProject.scripts["gxk-study"].configs.stopTime.options.find((t2) => t2[0] === stopTime)) == null ? void 0 : _b[0]) || "0";
      const date = new Date();
      date.setMinutes(date.getMinutes() + parseFloat(val) * 60);
      state$5.study.stopMessage = lib.$message.info({
        duration: 0,
        content: `在 ${date.toLocaleTimeString()} 脚本将自动暂停`
      });
    }
  }
  function fixProcessBar() {
    const bar = document.querySelector(".controlsBar");
    if (bar) {
      bar.style.display = "block";
      bar.style.zIndex = "2";
      bar.style.overflow = "";
    }
  }
  function closeDialogRead() {
    const div = document.querySelector(".dialog-read");
    if (div) {
      div.style.display = "none";
    }
  }
  function finishAlert() {
    lib.$modal.alert({
      content: "检测到当前视频全部播放完毕，如果还有未完成的视频请刷新重试，或者打开复习模式。"
    });
  }
  var md5$1 = { exports: {} };
  var crypt = { exports: {} };
  (function() {
    var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt$1 = {
      rotl: function(n, b) {
        return n << b | n >>> 32 - b;
      },
      rotr: function(n, b) {
        return n << 32 - b | n >>> b;
      },
      endian: function(n) {
        if (n.constructor == Number) {
          return crypt$1.rotl(n, 8) & 16711935 | crypt$1.rotl(n, 24) & 4278255360;
        }
        for (var i = 0; i < n.length; i++)
          n[i] = crypt$1.endian(n[i]);
        return n;
      },
      randomBytes: function(n) {
        for (var bytes = []; n > 0; n--)
          bytes.push(Math.floor(Math.random() * 256));
        return bytes;
      },
      bytesToWords: function(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
          words[b >>> 5] |= bytes[i] << 24 - b % 32;
        return words;
      },
      wordsToBytes: function(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
          bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
        return bytes;
      },
      bytesToHex: function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 15).toString(16));
        }
        return hex.join("");
      },
      hexToBytes: function(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
      },
      bytesToBase64: function(bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          for (var j = 0; j < 4; j++)
            if (i * 8 + j * 6 <= bytes.length * 8)
              base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
            else
              base64.push("=");
        }
        return base64.join("");
      },
      base64ToBytes: function(base64) {
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
          if (imod4 == 0)
            continue;
          bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
        }
        return bytes;
      }
    };
    crypt.exports = crypt$1;
  })();
  var charenc = {
    utf8: {
      stringToBytes: function(str) {
        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },
      bytesToString: function(bytes) {
        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
      }
    },
    bin: {
      stringToBytes: function(str) {
        for (var bytes = [], i = 0; i < str.length; i++)
          bytes.push(str.charCodeAt(i) & 255);
        return bytes;
      },
      bytesToString: function(bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
          str.push(String.fromCharCode(bytes[i]));
        return str.join("");
      }
    }
  };
  var charenc_1 = charenc;
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  var isBuffer_1 = function(obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
  };
  function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
  }
  function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
  }
  (function() {
    var crypt$1 = crypt.exports, utf8 = charenc_1.utf8, isBuffer2 = isBuffer_1, bin = charenc_1.bin, md52 = function(message2, options) {
      if (message2.constructor == String)
        if (options && options.encoding === "binary")
          message2 = bin.stringToBytes(message2);
        else
          message2 = utf8.stringToBytes(message2);
      else if (isBuffer2(message2))
        message2 = Array.prototype.slice.call(message2, 0);
      else if (!Array.isArray(message2) && message2.constructor !== Uint8Array)
        message2 = message2.toString();
      var m = crypt$1.bytesToWords(message2), l = message2.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
      for (var i = 0; i < m.length; i++) {
        m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
      }
      m[l >>> 5] |= 128 << l % 32;
      m[(l + 64 >>> 9 << 4) + 14] = l;
      var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
      for (var i = 0; i < m.length; i += 16) {
        var aa = a, bb = b, cc = c, dd = d;
        a = FF(a, b, c, d, m[i + 0], 7, -680876936);
        d = FF(d, a, b, c, m[i + 1], 12, -389564586);
        c = FF(c, d, a, b, m[i + 2], 17, 606105819);
        b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
        a = FF(a, b, c, d, m[i + 4], 7, -176418897);
        d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
        c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
        b = FF(b, c, d, a, m[i + 7], 22, -45705983);
        a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
        d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
        c = FF(c, d, a, b, m[i + 10], 17, -42063);
        b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
        a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
        d = FF(d, a, b, c, m[i + 13], 12, -40341101);
        c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
        b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
        a = GG(a, b, c, d, m[i + 1], 5, -165796510);
        d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
        c = GG(c, d, a, b, m[i + 11], 14, 643717713);
        b = GG(b, c, d, a, m[i + 0], 20, -373897302);
        a = GG(a, b, c, d, m[i + 5], 5, -701558691);
        d = GG(d, a, b, c, m[i + 10], 9, 38016083);
        c = GG(c, d, a, b, m[i + 15], 14, -660478335);
        b = GG(b, c, d, a, m[i + 4], 20, -405537848);
        a = GG(a, b, c, d, m[i + 9], 5, 568446438);
        d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
        c = GG(c, d, a, b, m[i + 3], 14, -187363961);
        b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
        a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
        d = GG(d, a, b, c, m[i + 2], 9, -51403784);
        c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
        b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
        a = HH(a, b, c, d, m[i + 5], 4, -378558);
        d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
        c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
        b = HH(b, c, d, a, m[i + 14], 23, -35309556);
        a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
        d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
        c = HH(c, d, a, b, m[i + 7], 16, -155497632);
        b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
        a = HH(a, b, c, d, m[i + 13], 4, 681279174);
        d = HH(d, a, b, c, m[i + 0], 11, -358537222);
        c = HH(c, d, a, b, m[i + 3], 16, -722521979);
        b = HH(b, c, d, a, m[i + 6], 23, 76029189);
        a = HH(a, b, c, d, m[i + 9], 4, -640364487);
        d = HH(d, a, b, c, m[i + 12], 11, -421815835);
        c = HH(c, d, a, b, m[i + 15], 16, 530742520);
        b = HH(b, c, d, a, m[i + 2], 23, -995338651);
        a = II(a, b, c, d, m[i + 0], 6, -198630844);
        d = II(d, a, b, c, m[i + 7], 10, 1126891415);
        c = II(c, d, a, b, m[i + 14], 15, -1416354905);
        b = II(b, c, d, a, m[i + 5], 21, -57434055);
        a = II(a, b, c, d, m[i + 12], 6, 1700485571);
        d = II(d, a, b, c, m[i + 3], 10, -1894986606);
        c = II(c, d, a, b, m[i + 10], 15, -1051523);
        b = II(b, c, d, a, m[i + 1], 21, -2054922799);
        a = II(a, b, c, d, m[i + 8], 6, 1873313359);
        d = II(d, a, b, c, m[i + 15], 10, -30611744);
        c = II(c, d, a, b, m[i + 6], 15, -1560198380);
        b = II(b, c, d, a, m[i + 13], 21, 1309151649);
        a = II(a, b, c, d, m[i + 4], 6, -145523070);
        d = II(d, a, b, c, m[i + 11], 10, -1120210379);
        c = II(c, d, a, b, m[i + 2], 15, 718787259);
        b = II(b, c, d, a, m[i + 9], 21, -343485551);
        a = a + aa >>> 0;
        b = b + bb >>> 0;
        c = c + cc >>> 0;
        d = d + dd >>> 0;
      }
      return crypt$1.endian([a, b, c, d]);
    };
    md52._ff = function(a, b, c, d, x, s, t2) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._gg = function(a, b, c, d, x, s, t2) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._hh = function(a, b, c, d, x, s, t2) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._ii = function(a, b, c, d, x, s, t2) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._blocksize = 16;
    md52._digestsize = 16;
    md5$1.exports = function(message2, options) {
      if (message2 === void 0 || message2 === null)
        throw new Error("Illegal argument " + message2);
      var digestbytes = crypt$1.wordsToBytes(md52(message2, options));
      return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt$1.bytesToHex(digestbytes);
    };
  })();
  var md5 = md5$1.exports;
  var Typr = {};
  Typr.parse = function(buff) {
    var bin = Typr._bin;
    var data = new Uint8Array(buff);
    var offset = 0;
    bin.readFixed(data, offset);
    offset += 4;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var tags = ["cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG "];
    var obj = { _data: data };
    var tabs = {};
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      var length = bin.readUint(data, offset);
      offset += 4;
      tabs[tag] = { offset: toffset, length };
    }
    for (var i = 0; i < tags.length; i++) {
      var t2 = tags[i];
      if (tabs[t2])
        obj[t2.trim()] = Typr[t2.trim()].parse(data, tabs[t2].offset, tabs[t2].length, obj);
    }
    return obj;
  };
  Typr._tabOffset = function(data, tab) {
    var bin = Typr._bin;
    var numTables = bin.readUshort(data, 4);
    var offset = 12;
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      if (tag == tab)
        return toffset;
    }
    return 0;
  };
  Typr._bin = { readFixed: function(data, o) {
    return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
  }, readF2dot14: function(data, o) {
    var num = Typr._bin.readShort(data, o);
    return num / 16384;
  }, readInt: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p + 3];
    a[1] = buff[p + 2];
    a[2] = buff[p + 1];
    a[3] = buff[p];
    return Typr._bin.t.int32[0];
  }, readInt8: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p];
    return Typr._bin.t.int8[0];
  }, readShort: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[1] = buff[p];
    a[0] = buff[p + 1];
    return Typr._bin.t.int16[0];
  }, readUshort: function(buff, p) {
    return buff[p] << 8 | buff[p + 1];
  }, readUshorts: function(buff, p, len) {
    var arr = [];
    for (var i = 0; i < len; i++)
      arr.push(Typr._bin.readUshort(buff, p + i * 2));
    return arr;
  }, readUint: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[3] = buff[p];
    a[2] = buff[p + 1];
    a[1] = buff[p + 2];
    a[0] = buff[p + 3];
    return Typr._bin.t.uint32[0];
  }, readUint64: function(buff, p) {
    return Typr._bin.readUint(buff, p) * (4294967295 + 1) + Typr._bin.readUint(buff, p + 4);
  }, readASCII: function(buff, p, l) {
    var s = "";
    for (var i = 0; i < l; i++)
      s += String.fromCharCode(buff[p + i]);
    return s;
  }, readUnicode: function(buff, p, l) {
    var s = "";
    for (var i = 0; i < l; i++) {
      var c = buff[p++] << 8 | buff[p++];
      s += String.fromCharCode(c);
    }
    return s;
  }, _tdec: window["TextDecoder"] ? new window["TextDecoder"]() : null, readUTF8: function(buff, p, l) {
    var tdec = Typr._bin._tdec;
    if (tdec && p == 0 && l == buff.length)
      return tdec["decode"](buff);
    return Typr._bin.readASCII(buff, p, l);
  }, readBytes: function(buff, p, l) {
    var arr = [];
    for (var i = 0; i < l; i++)
      arr.push(buff[p + i]);
    return arr;
  }, readASCIIArray: function(buff, p, l) {
    var s = [];
    for (var i = 0; i < l; i++)
      s.push(String.fromCharCode(buff[p + i]));
    return s;
  } };
  Typr._bin.t = { buff: new ArrayBuffer(8) };
  Typr._bin.t.int8 = new Int8Array(Typr._bin.t.buff);
  Typr._bin.t.uint8 = new Uint8Array(Typr._bin.t.buff);
  Typr._bin.t.int16 = new Int16Array(Typr._bin.t.buff);
  Typr._bin.t.uint16 = new Uint16Array(Typr._bin.t.buff);
  Typr._bin.t.int32 = new Int32Array(Typr._bin.t.buff);
  Typr._bin.t.uint32 = new Uint32Array(Typr._bin.t.buff);
  Typr._lctf = {};
  Typr._lctf.parse = function(data, offset, length, font, subt) {
    var bin = Typr._bin;
    var obj = {};
    var offset0 = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var offScriptList = bin.readUshort(data, offset);
    offset += 2;
    var offFeatureList = bin.readUshort(data, offset);
    offset += 2;
    var offLookupList = bin.readUshort(data, offset);
    offset += 2;
    obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
    obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList);
    obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt);
    return obj;
  };
  Typr._lctf.readLookupList = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
      obj.push(lut);
    }
    return obj;
  };
  Typr._lctf.readLookupTable = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = { tabs: [] };
    obj.ltype = bin.readUshort(data, offset);
    offset += 2;
    obj.flag = bin.readUshort(data, offset);
    offset += 2;
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var tab = subt(data, obj.ltype, offset0 + noff);
      obj.tabs.push(tab);
    }
    return obj;
  };
  Typr._lctf.numOfOnes = function(n) {
    var num = 0;
    for (var i = 0; i < 32; i++)
      if ((n >>> i & 1) != 0)
        num++;
    return num;
  };
  Typr._lctf.readClassDef = function(data, offset) {
    var bin = Typr._bin;
    var obj = [];
    var format = bin.readUshort(data, offset);
    offset += 2;
    if (format == 1) {
      var startGlyph = bin.readUshort(data, offset);
      offset += 2;
      var glyphCount = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < glyphCount; i++) {
        obj.push(startGlyph + i);
        obj.push(startGlyph + i);
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    if (format == 2) {
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    return obj;
  };
  Typr._lctf.getInterval = function(tab, val) {
    for (var i = 0; i < tab.length; i += 3) {
      var start2 = tab[i], end = tab[i + 1];
      tab[i + 2];
      if (start2 <= val && val <= end)
        return i;
    }
    return -1;
  };
  Typr._lctf.readValueRecord = function(data, offset, valFmt) {
    var bin = Typr._bin;
    var arr = [];
    arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 1 ? 2 : 0;
    arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 2 ? 2 : 0;
    arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 4 ? 2 : 0;
    arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 8 ? 2 : 0;
    return arr;
  };
  Typr._lctf.readCoverage = function(data, offset) {
    var bin = Typr._bin;
    var cvg = {};
    cvg.fmt = bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    if (cvg.fmt == 1)
      cvg.tab = bin.readUshorts(data, offset, count);
    if (cvg.fmt == 2)
      cvg.tab = bin.readUshorts(data, offset, count * 3);
    return cvg;
  };
  Typr._lctf.coverageIndex = function(cvg, val) {
    var tab = cvg.tab;
    if (cvg.fmt == 1)
      return tab.indexOf(val);
    if (cvg.fmt == 2) {
      var ind = Typr._lctf.getInterval(tab, val);
      if (ind != -1)
        return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
  };
  Typr._lctf.readFeatureList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj.push({ tag: tag.trim(), tab: Typr._lctf.readFeatureTable(data, offset0 + noff) });
    }
    return obj;
  };
  Typr._lctf.readFeatureTable = function(data, offset) {
    var bin = Typr._bin;
    bin.readUshort(data, offset);
    offset += 2;
    var lookupCount = bin.readUshort(data, offset);
    offset += 2;
    var indices = [];
    for (var i = 0; i < lookupCount; i++)
      indices.push(bin.readUshort(data, offset + 2 * i));
    return indices;
  };
  Typr._lctf.readScriptList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
    }
    return obj;
  };
  Typr._lctf.readScriptTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var defLangSysOff = bin.readUshort(data, offset);
    offset += 2;
    obj.default = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
    var langSysCount = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var langSysOff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
  };
  Typr._lctf.readLangSysTable = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    obj.reqFeature = bin.readUshort(data, offset);
    offset += 2;
    var featureCount = bin.readUshort(data, offset);
    offset += 2;
    obj.features = bin.readUshorts(data, offset, featureCount);
    return obj;
  };
  Typr.CFF = {};
  Typr.CFF.parse = function(data, offset, length) {
    var bin = Typr._bin;
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    var ninds = [];
    offset = Typr.CFF.readIndex(data, offset, ninds);
    var names = [];
    for (var i = 0; i < ninds.length - 1; i++)
      names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    offset += ninds[ninds.length - 1];
    var tdinds = [];
    offset = Typr.CFF.readIndex(data, offset, tdinds);
    var topDicts = [];
    for (var i = 0; i < tdinds.length - 1; i++)
      topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    offset += tdinds[tdinds.length - 1];
    var topdict = topDicts[0];
    var sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var strings = [];
    for (var i = 0; i < sinds.length - 1; i++)
      strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    offset += sinds[sinds.length - 1];
    Typr.CFF.readSubrs(data, offset, topdict);
    if (topdict.CharStrings) {
      offset = topdict.CharStrings;
      var sinds = [];
      offset = Typr.CFF.readIndex(data, offset, sinds);
      var cstr = [];
      for (var i = 0; i < sinds.length - 1; i++)
        cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
      topdict.CharStrings = cstr;
    }
    if (topdict.Encoding)
      topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
    if (topdict.charset)
      topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
    if (topdict.Private) {
      offset = topdict.Private[1];
      topdict.Private = Typr.CFF.readDict(data, offset, offset + topdict.Private[0]);
      if (topdict.Private.Subrs)
        Typr.CFF.readSubrs(data, offset + topdict.Private.Subrs, topdict.Private);
    }
    var obj = {};
    for (var p in topdict) {
      if (["FamilyName", "FullName", "Notice", "version", "Copyright"].indexOf(p) != -1)
        obj[p] = strings[topdict[p] - 426 + 35];
      else
        obj[p] = topdict[p];
    }
    return obj;
  };
  Typr.CFF.readSubrs = function(data, offset, obj) {
    var bin = Typr._bin;
    var gsubinds = [];
    offset = Typr.CFF.readIndex(data, offset, gsubinds);
    var bias, nSubrs = gsubinds.length;
    if (nSubrs < 1240)
      bias = 107;
    else if (nSubrs < 33900)
      bias = 1131;
    else
      bias = 32768;
    obj.Bias = bias;
    obj.Subrs = [];
    for (var i = 0; i < gsubinds.length - 1; i++)
      obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  };
  Typr.CFF.tableSE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0];
  Typr.CFF.glyphByUnicode = function(cff, code) {
    for (var i = 0; i < cff.charset.length; i++)
      if (cff.charset[i] == code)
        return i;
    return -1;
  };
  Typr.CFF.glyphBySE = function(cff, charcode) {
    if (charcode < 0 || charcode > 255)
      return -1;
    return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
  };
  Typr.CFF.readEncoding = function(data, offset, num) {
    Typr._bin;
    var array = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      var nCodes = data[offset];
      offset++;
      for (var i = 0; i < nCodes; i++)
        array.push(data[offset + i]);
    } else
      throw "error: unknown encoding format: " + format;
    return array;
  };
  Typr.CFF.readCharset = function(data, offset, num) {
    var bin = Typr._bin;
    var charset = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      for (var i = 0; i < num; i++) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        charset.push(first);
      }
    } else if (format == 1 || format == 2) {
      while (charset.length < num) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        var nLeft = 0;
        if (format == 1) {
          nLeft = data[offset];
          offset++;
        } else {
          nLeft = bin.readUshort(data, offset);
          offset += 2;
        }
        for (var i = 0; i <= nLeft; i++) {
          charset.push(first);
          first++;
        }
      }
    } else
      throw "error: format: " + format;
    return charset;
  };
  Typr.CFF.readIndex = function(data, offset, inds) {
    var bin = Typr._bin;
    var count = bin.readUshort(data, offset);
    offset += 2;
    var offsize = data[offset];
    offset++;
    if (offsize == 1)
      for (var i = 0; i < count + 1; i++)
        inds.push(data[offset + i]);
    else if (offsize == 2)
      for (var i = 0; i < count + 1; i++)
        inds.push(bin.readUshort(data, offset + i * 2));
    else if (offsize == 3)
      for (var i = 0; i < count + 1; i++)
        inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
    else if (count != 0)
      throw "unsupported offset size: " + offsize + ", count: " + count;
    offset += (count + 1) * offsize;
    return offset - 1;
  };
  Typr.CFF.getCharString = function(data, offset, o) {
    var bin = Typr._bin;
    var b0 = data[offset], b1 = data[offset + 1];
    data[offset + 2];
    data[offset + 3];
    data[offset + 4];
    var vs = 1;
    var op = null, val = null;
    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }
    if (b0 == 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }
    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }
    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }
    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }
    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }
    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }
    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }
    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
    }
    o.val = val != null ? val : "o" + op;
    o.size = vs;
  };
  Typr.CFF.readCharString = function(data, offset, length) {
    var end = offset + length;
    var bin = Typr._bin;
    var arr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var op = null, val = null;
      if (b0 <= 20) {
        op = b0;
        vs = 1;
      }
      if (b0 == 12) {
        op = b0 * 100 + b1;
        vs = 2;
      }
      if (b0 == 19 || b0 == 20) {
        op = b0;
        vs = 2;
      }
      if (21 <= b0 && b0 <= 27) {
        op = b0;
        vs = 1;
      }
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (29 <= b0 && b0 <= 31) {
        op = b0;
        vs = 1;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
      }
      arr.push(val != null ? val : "o" + op);
      offset += vs;
    }
    return arr;
  };
  Typr.CFF.readDict = function(data, offset, end) {
    var bin = Typr._bin;
    var dict = {};
    var carr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var key = null, val = null;
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (b0 == 29) {
        val = bin.readInt(data, offset + 1);
        vs = 5;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
        throw "unknown number";
      }
      if (b0 == 30) {
        var nibs = [];
        vs = 1;
        while (true) {
          var b = data[offset + vs];
          vs++;
          var nib0 = b >> 4, nib1 = b & 15;
          if (nib0 != 15)
            nibs.push(nib0);
          if (nib1 != 15)
            nibs.push(nib1);
          if (nib1 == 15)
            break;
        }
        var s = "";
        var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];
        for (var i = 0; i < nibs.length; i++)
          s += chars[nibs[i]];
        val = parseFloat(s);
      }
      if (b0 <= 21) {
        var keys = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"];
        key = keys[b0];
        vs = 1;
        if (b0 == 12) {
          var keys = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"];
          key = keys[b1];
          vs = 2;
        }
      }
      if (key != null) {
        dict[key] = carr.length == 1 ? carr[0] : carr;
        carr = [];
      } else
        carr.push(val);
      offset += vs;
    }
    return dict;
  };
  Typr.cmap = {};
  Typr.cmap.parse = function(data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUint(data, offset);
      offset += 4;
      var id = "p" + platformID + "e" + encodingID;
      var tind = offs.indexOf(noffset);
      if (tind == -1) {
        tind = obj.tables.length;
        var subt;
        offs.push(noffset);
        var format = bin.readUshort(data, noffset);
        if (format == 0)
          subt = Typr.cmap.parse0(data, noffset);
        else if (format == 4)
          subt = Typr.cmap.parse4(data, noffset);
        else if (format == 6)
          subt = Typr.cmap.parse6(data, noffset);
        else if (format == 12)
          subt = Typr.cmap.parse12(data, noffset);
        else
          console.log("unknown format: " + format, platformID, encodingID, noffset);
        obj.tables.push(subt);
      }
      if (obj[id] != null)
        throw "multiple tables for one platform+encoding";
      obj[id] = tind;
    }
    return obj;
  };
  Typr.cmap.parse0 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var len = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.map = [];
    for (var i = 0; i < len - 6; i++)
      obj.map.push(data[offset + i]);
    return obj;
  };
  Typr.cmap.parse4 = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = bin.readUshort(data, offset);
    offset += 2;
    obj.entrySelector = bin.readUshort(data, offset);
    offset += 2;
    obj.rangeShift = bin.readUshort(data, offset);
    offset += 2;
    obj.endCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    obj.startCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.idDelta = [];
    for (var i = 0; i < segCount; i++) {
      obj.idDelta.push(bin.readShort(data, offset));
      offset += 2;
    }
    obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.glyphIdArray = [];
    while (offset < offset0 + length) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse6 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.firstCode = bin.readUshort(data, offset);
    offset += 2;
    var entryCount = bin.readUshort(data, offset);
    offset += 2;
    obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse12 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    offset += 2;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    var nGroups = bin.readUint(data, offset);
    offset += 4;
    obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
      var off = offset + i * 12;
      var startCharCode = bin.readUint(data, off + 0);
      var endCharCode = bin.readUint(data, off + 4);
      var startGlyphID = bin.readUint(data, off + 8);
      obj.groups.push([startCharCode, endCharCode, startGlyphID]);
    }
    return obj;
  };
  Typr.glyf = {};
  Typr.glyf.parse = function(data, offset, length, font) {
    var obj = [];
    for (var g = 0; g < font.maxp.numGlyphs; g++)
      obj.push(null);
    return obj;
  };
  Typr.glyf._parseGlyf = function(font, g) {
    var bin = Typr._bin;
    var data = font._data;
    var offset = Typr._tabOffset(data, "glyf") + font.loca[g];
    if (font.loca[g] == font.loca[g + 1])
      return null;
    var gl = {};
    gl.noc = bin.readShort(data, offset);
    offset += 2;
    gl.xMin = bin.readShort(data, offset);
    offset += 2;
    gl.yMin = bin.readShort(data, offset);
    offset += 2;
    gl.xMax = bin.readShort(data, offset);
    offset += 2;
    gl.yMax = bin.readShort(data, offset);
    offset += 2;
    if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax)
      return null;
    if (gl.noc > 0) {
      gl.endPts = [];
      for (var i = 0; i < gl.noc; i++) {
        gl.endPts.push(bin.readUshort(data, offset));
        offset += 2;
      }
      var instructionLength = bin.readUshort(data, offset);
      offset += 2;
      if (data.length - offset < instructionLength)
        return null;
      gl.instructions = bin.readBytes(data, offset, instructionLength);
      offset += instructionLength;
      var crdnum = gl.endPts[gl.noc - 1] + 1;
      gl.flags = [];
      for (var i = 0; i < crdnum; i++) {
        var flag = data[offset];
        offset++;
        gl.flags.push(flag);
        if ((flag & 8) != 0) {
          var rep = data[offset];
          offset++;
          for (var j = 0; j < rep; j++) {
            gl.flags.push(flag);
            i++;
          }
        }
      }
      gl.xs = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
        if (i8) {
          gl.xs.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.xs.push(0);
          else {
            gl.xs.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      gl.ys = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
        if (i8) {
          gl.ys.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.ys.push(0);
          else {
            gl.ys.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      var x = 0, y = 0;
      for (var i = 0; i < crdnum; i++) {
        x += gl.xs[i];
        y += gl.ys[i];
        gl.xs[i] = x;
        gl.ys[i] = y;
      }
    } else {
      var ARG_1_AND_2_ARE_WORDS = 1 << 0;
      var ARGS_ARE_XY_VALUES = 1 << 1;
      var WE_HAVE_A_SCALE = 1 << 3;
      var MORE_COMPONENTS = 1 << 5;
      var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
      var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
      var WE_HAVE_INSTRUCTIONS = 1 << 8;
      gl.parts = [];
      var flags;
      do {
        flags = bin.readUshort(data, offset);
        offset += 2;
        var part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
        gl.parts.push(part);
        part.glyphIndex = bin.readUshort(data, offset);
        offset += 2;
        if (flags & ARG_1_AND_2_ARE_WORDS) {
          var arg1 = bin.readShort(data, offset);
          offset += 2;
          var arg2 = bin.readShort(data, offset);
          offset += 2;
        } else {
          var arg1 = bin.readInt8(data, offset);
          offset++;
          var arg2 = bin.readInt8(data, offset);
          offset++;
        }
        if (flags & ARGS_ARE_XY_VALUES) {
          part.m.tx = arg1;
          part.m.ty = arg2;
        } else {
          part.p1 = arg1;
          part.p2 = arg2;
        }
        if (flags & WE_HAVE_A_SCALE) {
          part.m.a = part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.b = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.c = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        }
      } while (flags & MORE_COMPONENTS);
      if (flags & WE_HAVE_INSTRUCTIONS) {
        var numInstr = bin.readUshort(data, offset);
        offset += 2;
        gl.instr = [];
        for (var i = 0; i < numInstr; i++) {
          gl.instr.push(data[offset]);
          offset++;
        }
      }
    }
    return gl;
  };
  Typr.GPOS = {};
  Typr.GPOS.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
  };
  Typr.GPOS.subt = function(data, ltype, offset) {
    if (ltype != 2)
      return null;
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.format = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    tab.valFmt1 = bin.readUshort(data, offset);
    offset += 2;
    tab.valFmt2 = bin.readUshort(data, offset);
    offset += 2;
    var ones1 = Typr._lctf.numOfOnes(tab.valFmt1);
    var ones2 = Typr._lctf.numOfOnes(tab.valFmt2);
    if (tab.format == 1) {
      tab.pairsets = [];
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        var psoff = bin.readUshort(data, offset);
        offset += 2;
        psoff += offset0;
        var pvcount = bin.readUshort(data, psoff);
        psoff += 2;
        var arr = [];
        for (var j = 0; j < pvcount; j++) {
          var gid2 = bin.readUshort(data, psoff);
          psoff += 2;
          var value1, value2;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt1);
            psoff += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt2);
            psoff += ones2 * 2;
          }
          arr.push({ gid2, val1: value1, val2: value2 });
        }
        tab.pairsets.push(arr);
      }
    }
    if (tab.format == 2) {
      var classDef1 = bin.readUshort(data, offset);
      offset += 2;
      var classDef2 = bin.readUshort(data, offset);
      offset += 2;
      var class1Count = bin.readUshort(data, offset);
      offset += 2;
      var class2Count = bin.readUshort(data, offset);
      offset += 2;
      tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
      tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
      tab.matrix = [];
      for (var i = 0; i < class1Count; i++) {
        var row = [];
        for (var j = 0; j < class2Count; j++) {
          var value1 = null, value2 = null;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, offset, tab.valFmt1);
            offset += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, offset, tab.valFmt2);
            offset += ones2 * 2;
          }
          row.push({ val1: value1, val2: value2 });
        }
        tab.matrix.push(row);
      }
    }
    return tab;
  };
  Typr.GSUB = {};
  Typr.GSUB.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
  };
  Typr.GSUB.subt = function(data, ltype, offset) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    if (ltype != 1 && ltype != 4 && ltype != 5)
      return null;
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    if (ltype == 1) {
      if (tab.fmt == 1) {
        tab.delta = bin.readShort(data, offset);
        offset += 2;
      } else if (tab.fmt == 2) {
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.newg = bin.readUshorts(data, offset, cnt);
        offset += tab.newg.length * 2;
      }
    } else if (ltype == 4) {
      tab.vals = [];
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < cnt; i++) {
        var loff = bin.readUshort(data, offset);
        offset += 2;
        tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
      }
    } else if (ltype == 5) {
      if (tab.fmt == 2) {
        var cDefOffset = bin.readUshort(data, offset);
        offset += 2;
        tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
        tab.scset = [];
        var subClassSetCount = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < subClassSetCount; i++) {
          var scsOff = bin.readUshort(data, offset);
          offset += 2;
          tab.scset.push(scsOff == 0 ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      } else
        console.log("unknown table format", tab.fmt);
    }
    return tab;
  };
  Typr.GSUB.readSubClassSet = function(data, offset) {
    var rUs = Typr._bin.readUshort, offset0 = offset, lset = [];
    var cnt = rUs(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = rUs(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readSubClassRule = function(data, offset) {
    var rUs = Typr._bin.readUshort, rule = {};
    var gcount = rUs(data, offset);
    offset += 2;
    var scount = rUs(data, offset);
    offset += 2;
    rule.input = [];
    for (var i = 0; i < gcount - 1; i++) {
      rule.input.push(rUs(data, offset));
      offset += 2;
    }
    rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount);
    return rule;
  };
  Typr.GSUB.readSubstLookupRecords = function(data, offset, cnt) {
    var rUs = Typr._bin.readUshort;
    var out = [];
    for (var i = 0; i < cnt; i++) {
      out.push(rUs(data, offset), rUs(data, offset + 2));
      offset += 4;
    }
    return out;
  };
  Typr.GSUB.readChainSubClassSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readChainSubClassRule = function(data, offset) {
    var bin = Typr._bin, rule = {};
    var pps = ["backtrack", "input", "lookahead"];
    for (var pi = 0; pi < pps.length; pi++) {
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      if (pi == 1)
        cnt--;
      rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
      offset += rule[pps[pi]].length * 2;
    }
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    rule.subst = bin.readUshorts(data, offset, cnt * 2);
    offset += rule.subst.length * 2;
    return rule;
  };
  Typr.GSUB.readLigatureSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var lcnt = bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < lcnt; j++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readLigature = function(data, offset) {
    var bin = Typr._bin, lig = { chain: [] };
    lig.nglyph = bin.readUshort(data, offset);
    offset += 2;
    var ccnt = bin.readUshort(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++) {
      lig.chain.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return lig;
  };
  Typr.head = {};
  Typr.head.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.fontRevision = bin.readFixed(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    obj.flags = bin.readUshort(data, offset);
    offset += 2;
    obj.unitsPerEm = bin.readUshort(data, offset);
    offset += 2;
    obj.created = bin.readUint64(data, offset);
    offset += 8;
    obj.modified = bin.readUint64(data, offset);
    offset += 8;
    obj.xMin = bin.readShort(data, offset);
    offset += 2;
    obj.yMin = bin.readShort(data, offset);
    offset += 2;
    obj.xMax = bin.readShort(data, offset);
    offset += 2;
    obj.yMax = bin.readShort(data, offset);
    offset += 2;
    obj.macStyle = bin.readUshort(data, offset);
    offset += 2;
    obj.lowestRecPPEM = bin.readUshort(data, offset);
    offset += 2;
    obj.fontDirectionHint = bin.readShort(data, offset);
    offset += 2;
    obj.indexToLocFormat = bin.readShort(data, offset);
    offset += 2;
    obj.glyphDataFormat = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hhea = {};
  Typr.hhea.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.ascender = bin.readShort(data, offset);
    offset += 2;
    obj.descender = bin.readShort(data, offset);
    offset += 2;
    obj.lineGap = bin.readShort(data, offset);
    offset += 2;
    obj.advanceWidthMax = bin.readUshort(data, offset);
    offset += 2;
    obj.minLeftSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.minRightSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.xMaxExtent = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRise = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRun = bin.readShort(data, offset);
    offset += 2;
    obj.caretOffset = bin.readShort(data, offset);
    offset += 2;
    offset += 4 * 2;
    obj.metricDataFormat = bin.readShort(data, offset);
    offset += 2;
    obj.numberOfHMetrics = bin.readUshort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hmtx = {};
  Typr.hmtx.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    var aw = 0, lsb = 0;
    for (var i = 0; i < font.maxp.numGlyphs; i++) {
      if (i < font.hhea.numberOfHMetrics) {
        aw = bin.readUshort(data, offset);
        offset += 2;
        lsb = bin.readShort(data, offset);
        offset += 2;
      }
      obj.aWidth.push(aw);
      obj.lsBearing.push(lsb);
    }
    return obj;
  };
  Typr.kern = {};
  Typr.kern.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var version = bin.readUshort(data, offset);
    offset += 2;
    if (version == 1)
      return Typr.kern.parseV1(data, offset - 2, length, font);
    var nTables = bin.readUshort(data, offset);
    offset += 2;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.parseV1 = function(data, offset, length, font) {
    var bin = Typr._bin;
    bin.readFixed(data, offset);
    offset += 4;
    var nTables = bin.readUint(data, offset);
    offset += 4;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      bin.readUint(data, offset);
      offset += 4;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.readFormat0 = function(data, offset, map) {
    var bin = Typr._bin;
    var pleft = -1;
    var nPairs = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < nPairs; j++) {
      var left = bin.readUshort(data, offset);
      offset += 2;
      var right = bin.readUshort(data, offset);
      offset += 2;
      var value = bin.readShort(data, offset);
      offset += 2;
      if (left != pleft) {
        map.glyph1.push(left);
        map.rval.push({ glyph2: [], vals: [] });
      }
      var rval = map.rval[map.rval.length - 1];
      rval.glyph2.push(right);
      rval.vals.push(value);
      pleft = left;
    }
    return offset;
  };
  Typr.loca = {};
  Typr.loca.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = [];
    var ver = font.head.indexToLocFormat;
    var len = font.maxp.numGlyphs + 1;
    if (ver == 0)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    if (ver == 1)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUint(data, offset + (i << 2)));
    return obj;
  };
  Typr.maxp = {};
  Typr.maxp.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    var ver = bin.readUint(data, offset);
    offset += 4;
    obj.numGlyphs = bin.readUshort(data, offset);
    offset += 2;
    if (ver == 65536) {
      obj.maxPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositePoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositeContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxZones = bin.readUshort(data, offset);
      offset += 2;
      obj.maxTwilightPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStorage = bin.readUshort(data, offset);
      offset += 2;
      obj.maxFunctionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxInstructionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStackElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxSizeOfInstructions = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentDepth = bin.readUshort(data, offset);
      offset += 2;
    }
    return obj;
  };
  Typr.name = {};
  Typr.name.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var offset0 = offset;
    for (var i = 0; i < count; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var languageID = bin.readUshort(data, offset);
      offset += 2;
      var nameID = bin.readUshort(data, offset);
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUshort(data, offset);
      offset += 2;
      var plat = "p" + platformID;
      if (obj[plat] == null)
        obj[plat] = {};
      var names = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"];
      var cname = names[nameID];
      var soff = offset0 + count * 12 + noffset;
      var str;
      if (platformID == 0)
        str = bin.readUnicode(data, soff, length / 2);
      else if (platformID == 3 && encodingID == 0)
        str = bin.readUnicode(data, soff, length / 2);
      else if (encodingID == 0)
        str = bin.readASCII(data, soff, length);
      else if (encodingID == 1)
        str = bin.readUnicode(data, soff, length / 2);
      else if (encodingID == 3)
        str = bin.readUnicode(data, soff, length / 2);
      else if (platformID == 1) {
        str = bin.readASCII(data, soff, length);
        console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
      } else
        throw "unknown encoding " + encodingID + ", platformID: " + platformID;
      obj[plat][cname] = str;
      obj[plat]._lang = languageID;
    }
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 1033)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 3084)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null)
        return obj[p];
    var tname;
    for (var p in obj) {
      tname = p;
      break;
    }
    console.log("returning name table with languageID " + obj[tname]._lang);
    return obj[tname];
  };
  Typr["OS/2"] = {};
  Typr["OS/2"].parse = function(data, offset, length) {
    var bin = Typr._bin;
    var ver = bin.readUshort(data, offset);
    offset += 2;
    var obj = {};
    if (ver == 0)
      Typr["OS/2"].version0(data, offset, obj);
    else if (ver == 1)
      Typr["OS/2"].version1(data, offset, obj);
    else if (ver == 2 || ver == 3 || ver == 4)
      Typr["OS/2"].version2(data, offset, obj);
    else if (ver == 5)
      Typr["OS/2"].version5(data, offset, obj);
    else
      throw "unknown OS/2 table version: " + ver;
    return obj;
  };
  Typr["OS/2"].version0 = function(data, offset, obj) {
    var bin = Typr._bin;
    obj.xAvgCharWidth = bin.readShort(data, offset);
    offset += 2;
    obj.usWeightClass = bin.readUshort(data, offset);
    offset += 2;
    obj.usWidthClass = bin.readUshort(data, offset);
    offset += 2;
    obj.fsType = bin.readUshort(data, offset);
    offset += 2;
    obj.ySubscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutSize = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutPosition = bin.readShort(data, offset);
    offset += 2;
    obj.sFamilyClass = bin.readShort(data, offset);
    offset += 2;
    obj.panose = bin.readBytes(data, offset, 10);
    offset += 10;
    obj.ulUnicodeRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange2 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange3 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange4 = bin.readUint(data, offset);
    offset += 4;
    obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)];
    offset += 4;
    obj.fsSelection = bin.readUshort(data, offset);
    offset += 2;
    obj.usFirstCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.usLastCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.sTypoAscender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoDescender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoLineGap = bin.readShort(data, offset);
    offset += 2;
    obj.usWinAscent = bin.readUshort(data, offset);
    offset += 2;
    obj.usWinDescent = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version1 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version0(data, offset, obj);
    obj.ulCodePageRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulCodePageRange2 = bin.readUint(data, offset);
    offset += 4;
    return offset;
  };
  Typr["OS/2"].version2 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version1(data, offset, obj);
    obj.sxHeight = bin.readShort(data, offset);
    offset += 2;
    obj.sCapHeight = bin.readShort(data, offset);
    offset += 2;
    obj.usDefault = bin.readUshort(data, offset);
    offset += 2;
    obj.usBreak = bin.readUshort(data, offset);
    offset += 2;
    obj.usMaxContext = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version5 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version2(data, offset, obj);
    obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr.post = {};
  Typr.post.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    obj.version = bin.readFixed(data, offset);
    offset += 4;
    obj.italicAngle = bin.readFixed(data, offset);
    offset += 4;
    obj.underlinePosition = bin.readShort(data, offset);
    offset += 2;
    obj.underlineThickness = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.SVG = {};
  Typr.SVG.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = { entries: [] };
    var offset0 = offset;
    bin.readUshort(data, offset);
    offset += 2;
    var svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    var numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
      var startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      var svgDocLength = bin.readUint(data, offset);
      offset += 4;
      var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
      var svg = bin.readUTF8(sbuf, 0, sbuf.length);
      for (var f = startGlyphID; f <= endGlyphID; f++) {
        obj.entries[f] = svg;
      }
    }
    return obj;
  };
  Typr.SVG.toPath = function(str) {
    var pth = { cmds: [], crds: [] };
    if (str == null)
      return pth;
    var prsr = new DOMParser();
    var doc = prsr["parseFromString"](str, "image/svg+xml");
    var svg = doc.firstChild;
    while (svg.tagName != "svg")
      svg = svg.nextSibling;
    var vb = svg.getAttribute("viewBox");
    if (vb)
      vb = vb.trim().split(" ").map(parseFloat);
    else
      vb = [0, 0, 1e3, 1e3];
    Typr.SVG._toPath(svg.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
      var x = pth.crds[i], y = pth.crds[i + 1];
      x -= vb[0];
      y -= vb[1];
      y = -y;
      pth.crds[i] = x;
      pth.crds[i + 1] = y;
    }
    return pth;
  };
  Typr.SVG._toPath = function(nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
      var nd = nds[ni], tn = nd.tagName;
      var cfl = nd.getAttribute("fill");
      if (cfl == null)
        cfl = fill;
      if (tn == "g")
        Typr.SVG._toPath(nd.children, pth, cfl);
      else if (tn == "path") {
        pth.cmds.push(cfl ? cfl : "#000000");
        var d = nd.getAttribute("d");
        var toks = Typr.SVG._tokens(d);
        Typr.SVG._toksToPath(toks, pth);
        pth.cmds.push("X");
      } else if (tn == "defs")
        ;
      else
        console.log(tn, nd);
    }
  };
  Typr.SVG._tokens = function(d) {
    var ts = [], off = 0, rn = false, cn = "";
    while (off < d.length) {
      var cc = d.charCodeAt(off), ch = d.charAt(off);
      off++;
      var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";
      if (rn) {
        if (ch == "-") {
          ts.push(parseFloat(cn));
          cn = ch;
        } else if (isNum)
          cn += ch;
        else {
          ts.push(parseFloat(cn));
          if (ch != "," && ch != " ")
            ts.push(ch);
          rn = false;
        }
      } else {
        if (isNum) {
          cn = ch;
          rn = true;
        } else if (ch != "," && ch != " ")
          ts.push(ch);
      }
    }
    if (rn)
      ts.push(parseFloat(cn));
    return ts;
  };
  Typr.SVG._toksToPath = function(ts, pth) {
    var i = 0, x = 0, y = 0, ox = 0, oy = 0;
    var pc = { M: 2, L: 2, H: 1, V: 1, S: 4, C: 6 };
    var cmds = pth.cmds, crds = pth.crds;
    while (i < ts.length) {
      var cmd = ts[i];
      i++;
      if (cmd == "z") {
        cmds.push("Z");
        x = ox;
        y = oy;
      } else {
        var cmu = cmd.toUpperCase();
        var ps = pc[cmu], reps = Typr.SVG._reps(ts, i, ps);
        for (var j = 0; j < reps; j++) {
          var xi = 0, yi = 0;
          if (cmd != cmu) {
            xi = x;
            yi = y;
          }
          if (cmu == "M") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("M");
            crds.push(x, y);
            ox = x;
            oy = y;
          } else if (cmu == "L") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "H") {
            x = xi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "V") {
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "C") {
            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else if (cmu == "S") {
            var co = Math.max(crds.length - 4, 0);
            var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
            var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else
            console.log("Unknown SVG command " + cmd);
        }
      }
    }
  };
  Typr.SVG._reps = function(ts, off, ps) {
    var i = off;
    while (i < ts.length) {
      if (typeof ts[i] == "string")
        break;
      i += ps;
    }
    return (i - off) / ps;
  };
  if (Typr == null)
    Typr = {};
  if (Typr.U == null)
    Typr.U = {};
  Typr.U.codeToGlyph = function(font, code) {
    var cmap = font.cmap;
    var tind = -1;
    if (cmap.p0e4 != null)
      tind = cmap.p0e4;
    else if (cmap.p3e1 != null)
      tind = cmap.p3e1;
    else if (cmap.p1e0 != null)
      tind = cmap.p1e0;
    if (tind == -1)
      throw "no familiar platform and encoding!";
    var tab = cmap.tables[tind];
    if (tab.format == 0) {
      if (code >= tab.map.length)
        return 0;
      return tab.map[code];
    } else if (tab.format == 4) {
      var sind = -1;
      for (var i = 0; i < tab.endCount.length; i++)
        if (code <= tab.endCount[i]) {
          sind = i;
          break;
        }
      if (sind == -1)
        return 0;
      if (tab.startCount[sind] > code)
        return 0;
      var gli = 0;
      if (tab.idRangeOffset[sind] != 0)
        gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
      else
        gli = code + tab.idDelta[sind];
      return gli & 65535;
    } else if (tab.format == 12) {
      if (code > tab.groups[tab.groups.length - 1][1])
        return 0;
      for (var i = 0; i < tab.groups.length; i++) {
        var grp = tab.groups[i];
        if (grp[0] <= code && code <= grp[1])
          return grp[2] + (code - grp[0]);
      }
      return 0;
    } else
      throw "unknown cmap table format " + tab.format;
  };
  Typr.U.glyphToPath = function(font, gid) {
    var path = { cmds: [], crds: [] };
    if (font.SVG && font.SVG.entries[gid]) {
      var p = font.SVG.entries[gid];
      if (p == null)
        return path;
      if (typeof p == "string") {
        p = Typr.SVG.toPath(p);
        font.SVG.entries[gid] = p;
      }
      return p;
    } else if (font.CFF) {
      var state2 = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0, open: false };
      Typr.U._drawCFF(font.CFF.CharStrings[gid], state2, font.CFF, path);
    } else if (font.glyf) {
      Typr.U._drawGlyf(gid, font, path);
    }
    return path;
  };
  Typr.U._drawGlyf = function(gid, font, path) {
    var gl = font.glyf[gid];
    if (gl == null)
      gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
    if (gl != null) {
      if (gl.noc > -1)
        Typr.U._simpleGlyph(gl, path);
      else
        Typr.U._compoGlyph(gl, font, path);
    }
  };
  Typr.U._simpleGlyph = function(gl, p) {
    for (var c = 0; c < gl.noc; c++) {
      var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
      var il = gl.endPts[c];
      for (var i = i0; i <= il; i++) {
        var pr = i == i0 ? il : i - 1;
        var nx = i == il ? i0 : i + 1;
        var onCurve = gl.flags[i] & 1;
        var prOnCurve = gl.flags[pr] & 1;
        var nxOnCurve = gl.flags[nx] & 1;
        var x = gl.xs[i], y = gl.ys[i];
        if (i == i0) {
          if (onCurve) {
            if (prOnCurve)
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            else {
              Typr.U.P.moveTo(p, x, y);
              continue;
            }
          } else {
            if (prOnCurve)
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            else
              Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
          }
        }
        if (onCurve) {
          if (prOnCurve)
            Typr.U.P.lineTo(p, x, y);
        } else {
          if (nxOnCurve)
            Typr.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]);
          else
            Typr.U.P.qcurveTo(p, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
        }
      }
      Typr.U.P.closePath(p);
    }
  };
  Typr.U._compoGlyph = function(gl, font, p) {
    for (var j = 0; j < gl.parts.length; j++) {
      var path = { cmds: [], crds: [] };
      var prt = gl.parts[j];
      Typr.U._drawGlyf(prt.glyphIndex, font, path);
      var m = prt.m;
      for (var i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y = path.crds[i + 1];
        p.crds.push(x * m.a + y * m.b + m.tx);
        p.crds.push(x * m.c + y * m.d + m.ty);
      }
      for (var i = 0; i < path.cmds.length; i++)
        p.cmds.push(path.cmds[i]);
    }
  };
  Typr.U._getGlyphClass = function(g, cd) {
    var intr = Typr._lctf.getInterval(cd, g);
    return intr == -1 ? 0 : cd[intr + 2];
  };
  Typr.U.getPairAdjustment = function(font, g1, g2) {
    if (font.GPOS) {
      var ltab = null;
      for (var i = 0; i < font.GPOS.featureList.length; i++) {
        var fl = font.GPOS.featureList[i];
        if (fl.tag == "kern") {
          for (var j = 0; j < fl.tab.length; j++)
            if (font.GPOS.lookupList[fl.tab[j]].ltype == 2)
              ltab = font.GPOS.lookupList[fl.tab[j]];
        }
      }
      if (ltab) {
        for (var i = 0; i < ltab.tabs.length; i++) {
          var tab = ltab.tabs[i];
          var ind = Typr._lctf.coverageIndex(tab.coverage, g1);
          if (ind == -1)
            continue;
          var adj;
          if (tab.format == 1) {
            var right = tab.pairsets[ind];
            for (var j = 0; j < right.length; j++)
              if (right[j].gid2 == g2)
                adj = right[j];
            if (adj == null)
              continue;
          } else if (tab.format == 2) {
            var c1 = Typr.U._getGlyphClass(g1, tab.classDef1);
            var c2 = Typr.U._getGlyphClass(g2, tab.classDef2);
            var adj = tab.matrix[c1][c2];
          }
          return adj.val1[2];
        }
      }
    }
    if (font.kern) {
      var ind1 = font.kern.glyph1.indexOf(g1);
      if (ind1 != -1) {
        var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
        if (ind2 != -1)
          return font.kern.rval[ind1].vals[ind2];
      }
    }
    return 0;
  };
  Typr.U.stringToGlyphs = function(font, str) {
    var gls = [];
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc > 65535)
        i++;
      gls.push(Typr.U.codeToGlyph(font, cc));
    }
    var gsub = font["GSUB"];
    if (gsub == null)
      return gls;
    var llist = gsub.lookupList, flist = gsub.featureList;
    var wsep = '\n	" ,.:;!?()  ،';
    var R2 = "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬";
    var L = "ꡲ્૗";
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
      var srgt = ci == gls.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
      if (!slft && R2.indexOf(str[ci - 1]) != -1)
        slft = true;
      if (!srgt && R2.indexOf(str[ci]) != -1)
        srgt = true;
      if (!srgt && L.indexOf(str[ci + 1]) != -1)
        srgt = true;
      if (!slft && L.indexOf(str[ci]) != -1)
        slft = true;
      var feat = null;
      if (slft)
        feat = srgt ? "isol" : "init";
      else
        feat = srgt ? "fina" : "medi";
      for (var fi = 0; fi < flist.length; fi++) {
        if (flist[fi].tag != feat)
          continue;
        for (var ti = 0; ti < flist[fi].tab.length; ti++) {
          var tab = llist[flist[fi].tab[ti]];
          if (tab.ltype != 1)
            continue;
          Typr.U._applyType1(gls, ci, tab);
        }
      }
    }
    var cligs = ["rlig", "liga", "mset"];
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var rlim = Math.min(3, gls.length - ci - 1);
      for (var fi = 0; fi < flist.length; fi++) {
        var fl = flist[fi];
        if (cligs.indexOf(fl.tag) == -1)
          continue;
        for (var ti = 0; ti < fl.tab.length; ti++) {
          var tab = llist[fl.tab[ti]];
          for (var j = 0; j < tab.tabs.length; j++) {
            if (tab.tabs[j] == null)
              continue;
            var ind = Typr._lctf.coverageIndex(tab.tabs[j].coverage, gl);
            if (ind == -1)
              continue;
            if (tab.ltype == 4) {
              var vals = tab.tabs[j].vals[ind];
              for (var k = 0; k < vals.length; k++) {
                var lig = vals[k], rl = lig.chain.length;
                if (rl > rlim)
                  continue;
                var good = true;
                for (var l = 0; l < rl; l++)
                  if (lig.chain[l] != gls[ci + (1 + l)])
                    good = false;
                if (!good)
                  continue;
                gls[ci] = lig.nglyph;
                for (var l = 0; l < rl; l++)
                  gls[ci + l + 1] = -1;
              }
            } else if (tab.ltype == 5) {
              var ltab = tab.tabs[j];
              if (ltab.fmt != 2)
                continue;
              var cind = Typr._lctf.getInterval(ltab.cDef, gl);
              var cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
              for (var i = 0; i < scs.length; i++) {
                var sc = scs[i], inp = sc.input;
                if (inp.length > rlim)
                  continue;
                var good = true;
                for (var l = 0; l < inp.length; l++) {
                  var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
                  if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
                    good = false;
                    break;
                  }
                }
                if (!good)
                  continue;
                var lrs = sc.substLookupRecords;
                for (var k = 0; k < lrs.length; k += 2) {
                  lrs[k];
                  lrs[k + 1];
                }
              }
            }
          }
        }
      }
    }
    return gls;
  };
  Typr.U._applyType1 = function(gls, ci, tab) {
    var gl = gls[ci];
    for (var j = 0; j < tab.tabs.length; j++) {
      var ttab = tab.tabs[j];
      var ind = Typr._lctf.coverageIndex(ttab.coverage, gl);
      if (ind == -1)
        continue;
      if (ttab.fmt == 1)
        gls[ci] = gls[ci] + ttab.delta;
      else
        gls[ci] = ttab.newg[ind];
    }
  };
  Typr.U.glyphsToPath = function(font, gls, clr) {
    var tpath = { cmds: [], crds: [] };
    var x = 0;
    for (var i = 0; i < gls.length; i++) {
      var gid = gls[i];
      if (gid == -1)
        continue;
      var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
      var path = Typr.U.glyphToPath(font, gid);
      for (var j = 0; j < path.crds.length; j += 2) {
        tpath.crds.push(path.crds[j] + x);
        tpath.crds.push(path.crds[j + 1]);
      }
      if (clr)
        tpath.cmds.push(clr);
      for (var j = 0; j < path.cmds.length; j++)
        tpath.cmds.push(path.cmds[j]);
      if (clr)
        tpath.cmds.push("X");
      x += font.hmtx.aWidth[gid];
      if (i < gls.length - 1)
        x += Typr.U.getPairAdjustment(font, gid, gid2);
    }
    return tpath;
  };
  Typr.U.pathToSVG = function(path, prec) {
    if (prec == null)
      prec = 5;
    var out = [], co = 0, lmap = { M: 2, L: 2, Q: 4, C: 6 };
    for (var i = 0; i < path.cmds.length; i++) {
      var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
      out.push(cmd);
      while (co < cn) {
        var c = path.crds[co++];
        out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
      }
    }
    return out.join("");
  };
  Typr.U.pathToContext = function(path, ctx) {
    var c = 0, crds = path.crds;
    for (var j = 0; j < path.cmds.length; j++) {
      var cmd = path.cmds[j];
      if (cmd == "M") {
        ctx.moveTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "L") {
        ctx.lineTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "C") {
        ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
        c += 6;
      } else if (cmd == "Q") {
        ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
        c += 4;
      } else if (cmd.charAt(0) == "#") {
        ctx.beginPath();
        ctx.fillStyle = cmd;
      } else if (cmd == "Z") {
        ctx.closePath();
      } else if (cmd == "X") {
        ctx.fill();
      }
    }
  };
  Typr.U.P = {};
  Typr.U.P.moveTo = function(p, x, y) {
    p.cmds.push("M");
    p.crds.push(x, y);
  };
  Typr.U.P.lineTo = function(p, x, y) {
    p.cmds.push("L");
    p.crds.push(x, y);
  };
  Typr.U.P.curveTo = function(p, a, b, c, d, e, f) {
    p.cmds.push("C");
    p.crds.push(a, b, c, d, e, f);
  };
  Typr.U.P.qcurveTo = function(p, a, b, c, d) {
    p.cmds.push("Q");
    p.crds.push(a, b, c, d);
  };
  Typr.U.P.closePath = function(p) {
    p.cmds.push("Z");
  };
  Typr.U._drawCFF = function(cmds, state2, font, p) {
    var stack = state2.stack;
    var nStems = state2.nStems, haveWidth = state2.haveWidth, width = state2.width, open = state2.open;
    var i = 0;
    var x = state2.x, y = state2.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
    var o = { val: 0, size: 0 };
    while (i < cmds.length) {
      Typr.CFF.getCharString(cmds, i, o);
      var v = o.val;
      i += o.size;
      if (v == "o1" || v == "o18") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o3" || v == "o23") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o4") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        if (open)
          Typr.U.P.closePath(p);
        y += stack.pop();
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o5") {
        while (stack.length > 0) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o6" || v == "o7") {
        var count = stack.length;
        var isX = v == "o6";
        for (var j = 0; j < count; j++) {
          var sval = stack.shift();
          if (isX)
            x += sval;
          else
            y += sval;
          isX = !isX;
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o8" || v == "o24") {
        var count = stack.length;
        var index = 0;
        while (index + 6 <= count) {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 6;
        }
        if (v == "o24") {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o11")
        break;
      else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
        if (v == "o1234") {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = y;
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1235") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          y = c4y + stack.shift();
          stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1236") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1237") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
            x = c4x + stack.shift();
          } else {
            y = c4y + stack.shift();
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
      } else if (v == "o14") {
        if (stack.length > 0 && !haveWidth) {
          width = stack.shift() + font.nominalWidthX;
          haveWidth = true;
        }
        if (stack.length == 4) {
          var adx = stack.shift();
          var ady = stack.shift();
          var bchar = stack.shift();
          var achar = stack.shift();
          var bind = Typr.CFF.glyphBySE(font, bchar);
          var aind = Typr.CFF.glyphBySE(font, achar);
          Typr.U._drawCFF(font.CharStrings[bind], state2, font, p);
          state2.x = adx;
          state2.y = ady;
          Typr.U._drawCFF(font.CharStrings[aind], state2, font, p);
        }
        if (open) {
          Typr.U.P.closePath(p);
          open = false;
        }
      } else if (v == "o19" || v == "o20") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
        i += nStems + 7 >> 3;
      } else if (v == "o21") {
        if (stack.length > 2 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        y += stack.pop();
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o22") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o25") {
        while (stack.length > 6) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
      } else if (v == "o26") {
        if (stack.length % 2) {
          x += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x;
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x;
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o27") {
        if (stack.length % 2) {
          y += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y;
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o10" || v == "o29") {
        var obj = v == "o10" ? font.Private : font;
        if (stack.length == 0) {
          console.log("error: empty stack");
        } else {
          var ind = stack.pop();
          var subr = obj.Subrs[ind + obj.Bias];
          state2.x = x;
          state2.y = y;
          state2.nStems = nStems;
          state2.haveWidth = haveWidth;
          state2.width = width;
          state2.open = open;
          Typr.U._drawCFF(subr, state2, font, p);
          x = state2.x;
          y = state2.y;
          nStems = state2.nStems;
          haveWidth = state2.haveWidth;
          width = state2.width;
          open = state2.open;
        }
      } else if (v == "o30" || v == "o31") {
        var count, count1 = stack.length;
        var index = 0;
        var alternate = v == "o31";
        count = count1 & ~2;
        index += count1 - count;
        while (index < count) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            if (count - index == 5) {
              x = c2x + stack.shift();
              index++;
            } else
              x = c2x;
            alternate = false;
          } else {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            if (count - index == 5) {
              y = c2y + stack.shift();
              index++;
            } else
              y = c2y;
            alternate = true;
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 4;
        }
      } else if ((v + "").charAt(0) == "o") {
        console.log("Unknown operation: " + v, cmds);
        throw v;
      } else
        stack.push(v);
    }
    state2.x = x;
    state2.y = y;
    state2.nStems = nStems;
    state2.haveWidth = haveWidth;
    state2.width = width;
    state2.open = open;
  };
  var typr_js = Typr;
  let top$1 = globalThis.top;
  try {
    top$1.typrMapping = top$1.typrMapping || void 0;
    top$1.jobs = top$1.jobs || [];
    top$1.currentMedia = top$1.currentMedia || void 0;
  } catch {
  }
  const state$4 = {
    study: {
      videojs: /* @__PURE__ */ Object.create({}),
      hacked: false,
      playbackRateWarningListenerId: 0
    }
  };
  const CXProject = lib.Project.create({
    name: "超星学习通",
    domains: [
      "chaoxing.com",
      "edu.cn",
      "org.cn",
      "xueyinonline.com",
      "hnsyu.net",
      "qutjxjy.cn",
      "ynny.cn",
      "hnvist.cn",
      "fjlecb.cn",
      "gdhkmooc.com",
      "cugbonline.cn",
      "zjelib.cn",
      "cqrspx.cn",
      "neauce.com",
      "zhihui-yun.com",
      "cqie.cn",
      "ccqmxx.com",
      "jxgmxy.com",
      "jnzyjsxy.cn",
      "sslibrary.com",
      "xuexi365.com"
    ],
    scripts: {
      env: new lib.Script({
        name: "环境准备脚本",
        matches: [["所有页面", /.*/]],
        hideInPanel: true,
        onstart() {
          try {
            let _self = self;
            let _try_count = 10;
            while (_self.parent !== void 0 && _try_count > 0) {
              if (_self.location.href.includes("/mycourse/studentstudy")) {
                top$1 = _self;
                console.log("[ocsjs] top change to " + top$1.location.href);
                break;
              } else {
                _try_count--;
                _self = _self.parent;
              }
            }
          } catch (e) {
            console.warn("[ocsjs] fail of find top");
            console.warn(e);
            top$1 = globalThis.top;
          }
        }
      }),
      guide: new lib.Script({
        name: "💡 使用提示",
        matches: [
          ["首页", "https://www.chaoxing.com"],
          ["旧版个人首页", "chaoxing.com/space/index"],
          ["新版个人首页", "chaoxing.com/base"],
          ["学习页面", "chaoxing.com/mycourse"],
          ["新版学习页面", "chaoxing.com/mooc2-ans/mycourse"]
        ],
        namespace: "cx.guide",
        configs: {
          notes: {
            defaultValue: `请手动进入视频、作业、考试页面，脚本会自动运行。`
          }
        },
        oncomplete() {
          if (["mycourse/studentstudy"].some((path) => location.href.includes(path))) {
            lib.$message.success("已进入学习页面，请等待自动运行...");
            return;
          }
          lib.$message.info("请手动进入视频、作业、考试页面，脚本会自动运行。");
        }
      }),
      study: new lib.Script({
        name: "🖥️ 课程学习",
        namespace: "cx.new.study",
        matches: [
          ["任务点页面", "/knowledge/cards"],
          ["阅读任务点", "/readsvr/book/mooc"]
        ],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              ["任务点不是顺序执行，如果某一个任务没有动", "请查看是否有其他任务正在学习，耐心等待即可。"],
              "闯关模式若 AI 未完成题目，需要手动完成后才能解锁章节。",
              "请勿凌晨刷课，部分学校课程可能会清空进度。",
              ["⚠️目前超星倍速风控严重，如果高倍速", "完成后被清空还原，请调到1-2倍速学习！"]
            ]).outerHTML
          },
          playbackRate,
          volume,
          videoQuizStrategy: {
            label: "视频内题目",
            tag: "select",
            options: [
              ["random", "随机答题"],
              ["ignore", "忽略"]
            ],
            attrs: {
              title: "视频有时在学习过程中会弹出题目，这个好像并不计算在分数内，所以可以忽略，视频可以正常观看，这里提供几个方法处理题目"
            },
            defaultValue: "random"
          },
          mode: {
            label: "跳转模式",
            tag: "select",
            options: [
              ["next", "完成后跳转下一节", "完成小节后，自动点击下一节按钮"],
              ["job", "完成后跳转未完成任务点", "如果未找到任务点，则会直接结束脚本运行，目前处于试验阶段。"],
              ["manually", "完成后暂停，等待手动跳转", "适用于自己手动运行"]
            ],
            defaultValue: "next"
          },
          autoJumpToUnFinishJob: {
            label: "自动切换未完成章节",
            attrs: { type: "checkbox", title: "在自动学习前寻找未完成章节并跳转（积分课、智慧课程：推荐关闭）" },
            defaultValue: true
          },
          restudy: {
            label: "复习模式",
            attrs: { title: "已经完成的视频继续学习", type: "checkbox" },
            defaultValue: false
          },
          forceLearn: {
            label: "强制学习",
            attrs: {
              title: "视频一般分为：非任务点、任务点、和已完成任务点，当遇到“非任务点”时需要开启此选项才会进行学习",
              type: "checkbox"
            },
            defaultValue: false
          },
          backToFirstWhenFinish: {
            label: "完成全部后重新学习",
            attrs: {
              type: "checkbox",
              title: "当章节已经学习完成至最后一章时，跳转到第一个章节重新开始学习。"
            },
            defaultValue: false
          },
          showTextareaWhenEdit: {
            label: "编辑时显示自定义编辑框",
            attrs: {
              type: "checkbox",
              title: "超星默认禁止在编辑框中复制粘贴，开启此选项可以在文本框编辑时生成一个自定义编辑框进行编辑，脚本会将内容同步到编辑框中。"
            },
            defaultValue: true
          },
          notifyWhenHasFaceRecognition: {
            label: "出现人脸识别时通知我",
            attrs: {
              type: "checkbox"
            },
            defaultValue: true
          },
          enables: {
            ...dropdownStyle,
            label: "高级设置",
            attrs: { type: "checkbox" },
            defaultValue: false
          },
          enableMedia: {
            elementClassName: "config-details",
            showIf: "cx.new.study.enables",
            label: "视频/音频自动播放",
            attrs: { type: "checkbox", title: "开启：音频和视频的自动播放" },
            defaultValue: true
          },
          enablePPT: {
            elementClassName: "config-details",
            showIf: "cx.new.study.enables",
            label: "PPT/书籍自动完成",
            attrs: { type: "checkbox", title: "开启：PPT/书籍自动翻阅" },
            defaultValue: true
          },
          enableChapterTest: {
            elementClassName: "config-details",
            showIf: "cx.new.study.enables",
            label: "章节测试自动答题",
            attrs: { type: "checkbox", title: "开启：章节测试自动答题" },
            defaultValue: true
          },
          enableHyperlink: {
            elementClassName: "config-details",
            showIf: "cx.new.study.enables",
            label: "链接任务自动完成",
            attrs: { type: "checkbox", title: "开启：链接任务自动完成" },
            defaultValue: true
          }
        },
        onrender({ panel }) {
          if (getAIConfigError()) aiConfigWarning(10);
          this.offConfigChange(state$4.study.playbackRateWarningListenerId);
          state$4.study.playbackRateWarningListenerId = this.onConfigChange("playbackRate", (playbackRate2) => {
            if (playbackRate2 > 2) {
              lib.$modal.alert({
                title: "⚠️高倍速警告",
                content: lib.$ui.notes([
                  "⚠️高倍速可能导致学习记录清空/回退",
                  "⚠️超星后台可以看到学习时长，请谨慎设置",
                  "⚠️如已清空/回退，请降低倍速至1-2倍"
                ]),
                maskCloseable: false,
                confirmButtonText: "我已知晓风险"
              });
            }
          }) || 0;
        },
        async onactive() {
          if (/\/readsvr\/book\/mooc/.test(location.href)) {
            if (document.querySelector("#reader")) {
              require(["reader"], (_reader) => {
                waitForElement(".readerPager").then(() => {
                  setTimeout(async () => {
                    var _a;
                    const jumper = document.querySelector("#pagejump");
                    if ((_reader == null ? void 0 : _reader.goPage) && jumper) {
                      const timing = parseInt(((_a = new URL(location.href).searchParams.get("timing")) == null ? void 0 : _a.toString()) || "60") + 3;
                      console.log(timing);
                      await $.sleep(timing * 1e3);
                      jumper.value = "5";
                      jumper.dispatchEvent(new Event("change"));
                      console.log("已跳转正文页");
                      await $.sleep(timing * 1e3);
                      jumper.value = "7";
                      jumper.dispatchEvent(new Event("change"));
                      console.log("已跳转封底页");
                      await $.sleep(timing * 1e3);
                      Array.from(document.querySelectorAll(".readerPager")).filter((el) => el.style.zIndex === "101")[0].click();
                      console.log("阅读完成");
                    }
                  }, 3e3);
                });
              });
            } else {
              $console.log("正在完成书籍/PPT...");
              setTimeout(() => {
                // readweb / epage 是页面全局变量，沙箱内需通过 unsafeWindow 访问
                const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
                if (pageWindow.readweb && typeof pageWindow.readweb.goto === "function") pageWindow.readweb.goto(pageWindow.epage);
                else $console.warn("未找到书籍阅读器 readweb，跳过翻页");
              }, 5e3);
            }
            return;
          }
          if (/\/knowledge\/cards/.test(location.href)) {
            const updateMediaState = () => {
              if (top$1.currentMedia) {
                top$1.currentMedia.playbackRate = parseFloat(this.cfg.playbackRate.toString());
                top$1.currentMedia.volume = this.cfg.volume;
              }
            };
            this.onConfigChange("playbackRate", updateMediaState);
            this.onConfigChange("volume", updateMediaState);
            await study({
              ...this.cfg,
              playbackRate: parseFloat(this.cfg.playbackRate.toString()),
              workOptions: CommonProject.scripts.settings.methods.getWorkOptions()
            });
          }
        }
      }),
      work: new lib.Script({
        name: "✍️ 作业考试脚本",
        matches: [
          ["作业页面", "/mooc2/work/dowork"],
          ["考试整卷预览页面", "/mooc2/exam/preview"]
        ],
        namespace: "cx.new.work",
        configs: { notes: workNotes },
        async oncomplete() {
          const isExam2 = /\/exam\/preview/.test(location.href);
          commonWork(this, {
            workerProvider: (opts) => workOrExam$1(isExam2 ? "exam" : "work", { ...opts, preview_mode: true }),
            enable_control_panel: true
          });
        }
      }),
      autoRead: new lib.Script({
        name: "🖥️ 自动阅读",
        matches: [
          ["阅读页面", "/ztnodedetailcontroller/visitnodedetail"],
          ["课程目录", /chaoxing.com\/course\/\d+\.html/],
          ["课程目录", /chaoxing.com\/mooc-ans\/course\/\d+\.html/],
          ["积分课阅读课程目录", "/mooc-ans/zt/portal"]
        ],
        namespace: "cx.new.auto-read",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["点击任意章节开始自动阅读", "阅读任务次日才会统计阅读时长"]).outerHTML
          },
          restartAfterFinish: {
            label: "无限阅读",
            attrs: { type: "checkbox", title: "阅读完成最后一章后从头第一章继续阅读" },
            defaultValue: false
          }
        },
        oncomplete() {
          CommonProject.scripts.render.methods.pin(this);
          lib.$message.info("请手动点击任意章节开始自动阅读");
          if (location.href.includes("/ztnodedetailcontroller/visitnodedetail") === false) {
            startAtFirst();
            return;
          }
          let top2 = 0;
          const interval = setInterval(() => {
            top2 += (document.documentElement.scrollHeight - window.innerHeight) / 60;
            window.scrollTo({
              behavior: "smooth",
              top: top2
            });
          }, 1e3);
          setTimeout(() => {
            clearInterval(interval);
            const next2 = lib.$el(".nodeItem.r i");
            if (next2) {
              next2.click();
            } else {
              if (this.cfg.restartAfterFinish) {
                setTimeout(() => startAtFirst(), 3e3);
                lib.$message.info({ content: "即将重新从头开始阅读", duration: 10 });
                $console.log("即将重新从头开始阅读");
              } else {
                lib.$message.success({ content: "阅读任务已完成", duration: 0 });
                $console.log("未检测到下一页");
              }
            }
          }, (60 + 3) * 1e3);
          function startAtFirst() {
            const texts = lib.$$el(".course_section .chapterText");
            if (texts.length) {
              texts[0].click();
            }
          }
        }
      }),
      pageRedirect: new lib.Script({
        name: "章节页面自动切换脚本",
        matches: [["课程任务页面", "pageHeader=0"]],
        hideInPanel: true,
        async oncomplete() {
          if (top$1 === window) {
            const a = document.querySelector('a[title="章节"]');
            if (a) {
              await $.sleep(1e3);
              a.click();
              lib.$message.info({
                content: "已经为您自动切换到章节列表页面，手动进入任意章节即可开始自动学习！"
              });
            }
          }
        }
      }),
      versionRedirect: new lib.Script({
        name: "版本切换脚本",
        matches: [
          ["", "mooc2=0"],
          ["", "mycourse/studentcourse"],
          ["", "work/getAllWork"],
          ["", "work/doHomeWorkNew"],
          ["", "exam/test\\?"]
        ],
        hideInPanel: true,
        async oncomplete() {
          if (top$1 === window) {
            lib.$message.warn({
              content: "OCS网课助手不支持旧版超星, 即将切换到超星新版, 如有其他第三方插件请关闭, 可能有兼容问题导致频繁切换。",
              duration: 0
            });
            await $.sleep(2e3);
            await waitForFaceRecognition();
            const experience = document.querySelector(".experience");
            if (experience) {
              experience.click();
            } else {
              const newUrl = new URL(window.location.href);
              if (window.location.href.includes("mooc-ans/mycourse/studentstudy")) {
                newUrl.pathname = "/mycourse/studentstudy";
              }
              const params = newUrl.searchParams;
              let changed = false;
              if (params.get("mooc2") !== "1") {
                params.set("mooc2", "1");
                changed = true;
              }
              if (params.get("newMooc") !== "true") {
                params.set("newMooc", "true");
                changed = true;
              }
              if (changed)
                window.location.replace(newUrl);
            }
          }
        }
      }),
      examRedirect: new lib.Script({
        name: "考试整卷预览脚本",
        matches: [
          ["新版考试页面", "exam-ans/exam/test/reVersionTestStartNew"],
          ["新版考试页面2", "mooc-ans/exam/test/reVersionTestStartNew"]
        ],
        hideInPanel: true,
        oncomplete() {
          var _a, _b;
          if ((_b = (_a = lib.$gm.unsafeWindow.document.querySelector(".mark_info")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.includes("不允许整卷预览")) {
            lib.$message.warn({
              content: lib.$ui.notes([
                "由于当前考试禁止整卷预览，各题为独立新页面，只能一个个答题",
                "在考完前禁止手动切换题目，否则会导致重复答题！",
                "完成后或者开考前请手动清空 AI 答题结果！",
                "想调整速度请更改通用-全局设置-高级设置-AI 请求间隔。"
              ]),
              duration: 0
            });
            const isExam2 = /\/exam\/test/.test(location.href);
            const workOptions = CommonProject.scripts.settings.methods.getWorkOptions();
            commonWork(CXProject.scripts.work, {
              start_delay_seconds: 5,
              enable_control_panel: true,
              workerProvider: (opts) => workOrExam$1(isExam2 ? "exam" : "work", { ...opts, preview_mode: false, thread: 1 })
            });
            return;
          }
          lib.$message.info({ content: "即将跳转到整卷预览页面进行考试。" });
          setTimeout(() => lib.$gm.unsafeWindow.topreview(), 3e3);
        }
      }),
      rateHack: new lib.Script({
        name: "屏蔽倍速限制",
        hideInPanel: true,
        matches: [["", "/ananas/modules/video/"]],
        onstart() {
          rateHack();
        }
      }),
      copyHack: new lib.Script({
        name: "屏蔽复制粘贴限制",
        hideInPanel: true,
        matches: [["所有页面", /.*/]],
        methods() {
          return {
            hackEditorPaste() {
              var _a, _b;
              try {
                const instants = ((_b = (_a = lib.$gm.unsafeWindow) == null ? void 0 : _a.UE) == null ? void 0 : _b.instants) || [];
                for (const key in instants) {
                  const ue = instants[key];
                  if (ue == null ? void 0 : ue.textarea) {
                    ue.body.addEventListener("click", async () => {
                      if (CXProject.scripts.study.cfg.showTextareaWhenEdit) {
                        const defaultText = lib.h("span", { innerHTML: ue.textarea.value }).textContent;
                        lib.$modal.prompt({
                          content: "请在此文本框进行编辑，防止超星无法复制粘贴。(如需关闭请前往设置: 课程学习-编辑时显示自定义编辑框)",
                          width: 800,
                          inputDefaultValue: defaultText || "",
                          modalInputType: "textarea",
                          onConfirm: (val = "") => {
                            ue.setContent(
                              val.split("\n").map((line) => `<p>${line}</p>`).join("")
                            );
                          }
                        });
                      }
                    });
                    if (lib.$gm.unsafeWindow.editorPaste) {
                      ue.removeListener("beforepaste", lib.$gm.unsafeWindow.editorPaste);
                    }
                    if (lib.$gm.unsafeWindow.myEditor_paste) {
                      ue.removeListener("beforepaste", lib.$gm.unsafeWindow.myEditor_paste);
                    }
                  }
                }
              } catch {
              }
            }
          };
        },
        oncomplete() {
          const hackInterval = setInterval(() => {
            if (typeof lib.$gm.unsafeWindow.UE !== "undefined") {
              clearInterval(hackInterval);
              this.methods.hackEditorPaste();
              console.log("已解除输入框无法复制粘贴限制");
            }
          }, 500);
        }
      }),
      studyDispatcher: new lib.Script({
        name: "课程学习调度器",
        matches: [["课程学习页面", "/mycourse/studentstudy"]],
        namespace: "cx.new.study-dispatcher",
        hideInPanel: true,
        async oncomplete() {
          CommonProject.scripts.render.methods.pin(CXProject.scripts.study);
          let chapters = await CXAnalyses.waitForChapterInfos();
          const params = new URLSearchParams(window.location.href);
          const mooc = params.get("mooc2");
          if (mooc === null) {
            params.set("mooc2", "1");
            window.location.replace(decodeURIComponent(params.toString()));
            return;
          }
          if (CXProject.scripts.study.cfg.autoJumpToUnFinishJob) {
            chapters = chapters.filter((chapter) => chapter.unFinishCount !== 0);
            if (chapters.length === 0) {
              lib.$message.warn({ content: "页面任务点数量为空! 请刷新重试!" });
            } else {
              const params2 = new URLSearchParams(window.location.href);
              const courseId = params2.get("courseId");
              const classId = params2.get("clazzid");
              if (lib.$$el(`.posCatalog_active[id="cur${chapters[0].chapterId}"]`).length === 0) {
                lib.$gm.unsafeWindow.getTeacherAjax(courseId, classId, chapters[0].chapterId);
              }
              await $.sleep(1e3);
            }
          }
          await $.sleep(1e3);
          CXAnalyses.scrollToActiveChapter();
        }
      }),
      cxSecretFontRecognize: new lib.Script({
        name: "繁体字识别",
        hideInPanel: true,
        matches: [
          ["题目页面", "work/doHomeWorkNew"],
          ["考试整卷预览", "/mooc2/exam/preview"],
          ["作业", "/mooc2/work/dowork"]
        ],
        async oncomplete() {
          await mappingRecognize();
        }
      }),
      jfkGuide: new lib.Script({
        name: "💡 积分课使用提示",
        matches: [["积分课页面", "/plaza"]],
        namespace: "cx.jfk.guide",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "积分课请进入课程后，开启复习模式，并且关闭自动下一章",
              "课程完成后请手动切换，如果由脚本进行自动跳转会出现乱跳转的可能。"
            ]).outerHTML
          }
        },
        oncomplete(...args) {
          CommonProject.scripts.render.methods.pin(this);
        }
      })
    }
  });
  function workOrExam$1(type = "work", {
    period,
    thread,
    redundanceWordsText,
    answerSeparators,
    preview_mode
  }) {
    lib.$message.info(`开始${type === "work" ? "作业" : "考试"}`);
    if (preview_mode) {
      CommonProject.scripts.workResults.methods.init({
        questionPositionSyncHandlerType: "cx"
      });
    }
    const workOrExamQuestionTitleTransform = (titles) => {
      const is_multiple_question = titles.length > 1;
      const optimizationTitle = titles.map((el, i) => {
        var _a, _b;
        if (el) {
          const titleCloneEl = el.cloneNode(true);
          const childNodes = titleCloneEl.childNodes;
          if (i === 0) {
            (_a = childNodes[0]) == null ? void 0 : _a.remove();
            (_b = childNodes[0]) == null ? void 0 : _b.remove();
          }
          return optimizationElementWithImage(titleCloneEl, true).innerText;
        }
        return "";
      }).join("\n");
      return removeRedundantWords(
        StringUtils.of(optimizationTitle).nowrap(is_multiple_question ? "\n" : " ").nospace().toString().trim(),
        redundanceWordsText.split("\n")
      );
    };
    const worker = new OCSWorker({
      root: ".questionLi",
      elements: {
        title: (root2) => lib.$$el(
          !preview_mode ? [".splitS-left .mark_name", ".line_wid_half.fl,.line_wid_half.fr"].join(",") : [
            ":scope > h3",
            ":scope > div:not(.stem_answer,.mark_answer)",
            ":scope > p",
            ".line_wid_half.fl,.line_wid_half.fr"
          ].join(","),
          root2
        ).filter((e) => {
          var _a;
          return !!((_a = e.textContent) == null ? void 0 : _a.trim());
        }),
        options: ".answerBg .answer_p, .textDIV, .eidtDiv",
        type: type === "exam" ? 'input[name^="type"]' : 'input[id^="answertype"]',
        lineAnswerInput: ".line_answer input[name^=answer]",
        lineSelectBox: ".line_answer_ct .selectBox ",
        reading: ".reading_answer",
        filling: ".filling_answer"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        if (elements2.title) {
          const title = workOrExamQuestionTitleTransform(elements2.title);
          if (title) {
            const typeInput = elements2.type[0];
            const type2 = (typeInput ? getQuestionType(parseInt(typeInput.value)) : void 0) || "unknown";
            return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
              await $.sleep((period != null ? period : 3) * 1e3);
              return aiAnswerHandler({
                type: type2,
                title,
                options: ctx.elements.options.map((o) => optimizationElementWithImage(o, true).innerText || ""),
                images: collectQuestionImages(ctx.root)
              });
            });
          } else {
            throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
          }
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: async (ctx) => {
        var _a, _b;
        const { elements: elements2, searchInfos } = ctx;
        const type2 = getQuestionType(
          parseInt(((_a = elements2.type.find((t2) => {
            var _a2;
            return (_a2 = t2.getAttribute("name")) == null ? void 0 : _a2.match(/type\d+/);
          })) == null ? void 0 : _a.getAttribute("value")) || "-1")
        );
        if (type2 && (type2 === "completion" || type2 === "multiple" || type2 === "judgement" || type2 === "single")) {
          const resolver = createDefaultQuestionResolver(ctx)[type2];
          return await resolver(
            searchInfos,
            elements2.options.map((option) => optimizationElementWithImage(option)),
            async (type3, answer, option) => {
              var _a2, _b2, _c;
              if (type3 === "judgement" || type3 === "single" || type3 === "multiple") {
                if ((option == null ? void 0 : option.parentElement) && lib.$$el('[class*="check_answer"]', option.parentElement).length === 0) {
                  option.click();
                  await $.sleep(500);
                }
              } else if (type3 === "completion" && answer.trim()) {
                const text = option == null ? void 0 : option.querySelector("textarea");
                const textareaFrame = option == null ? void 0 : option.querySelector("iframe");
                if (text) {
                  text.value = answer;
                  dispatchAnswerInput(text);
                }
                if (textareaFrame == null ? void 0 : textareaFrame.contentDocument) {
                  textareaFrame.contentDocument.body.textContent = answer;
                  dispatchAnswerInput(textareaFrame.contentDocument.body);
                }
                if ((_a2 = option == null ? void 0 : option.parentElement) == null ? void 0 : _a2.parentElement) {
                  (_c = lib.$el("[onclick*=saveQuestion]", (_b2 = option == null ? void 0 : option.parentElement) == null ? void 0 : _b2.parentElement)) == null ? void 0 : _c.click();
                  await $.sleep(500);
                }
              }
            }
          );
        } else if (type2 && type2 === "line") {
          for (const answers of searchInfos.map((info) => info.results.map((res) => res.answer))) {
            let ans = answers;
            if (ans.length === 1) {
              ans = splitAnswer(ans[0]);
            }
            if (ans.filter(Boolean).length !== 0 && elements2.lineAnswerInput && ans.filter(Boolean).length === elements2.lineSelectBox.length) {
              for (let index = 0; index < elements2.lineSelectBox.length; index++) {
                const box = elements2.lineSelectBox[index];
                if (ans[index]) {
                  (_b = lib.$el(`li[data=${ans[index]}] a`, box)) == null ? void 0 : _b.click();
                  await $.sleep(200);
                }
              }
              return { finish: true };
            }
          }
          return { finish: false };
        } else if (type2 && type2 === "fill") {
          return readerAndFillHandle(searchInfos, elements2.filling);
        } else if (type2 && type2 === "reader") {
          return readerAndFillHandle(searchInfos, elements2.reading);
        }
        return { finish: false };
      },
      async onResultsUpdate(current, _, res) {
        var _a, _b;
        if (!preview_mode) {
          if ((_a = current.result) == null ? void 0 : _a.finish) {
            await CommonProject.scripts.workResults.methods.appendResults(
              simplifyWorkResult(res, workOrExamQuestionTitleTransform)
            );
            CommonProject.scripts.apps.methods.recordAIResult(
              simplifyWorkResult([current], workOrExamQuestionTitleTransform)
            );
          }
          return;
        }
        CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, workOrExamQuestionTitleTransform));
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
        if ((_b = current.result) == null ? void 0 : _b.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(
            simplifyWorkResult([current], workOrExamQuestionTitleTransform)
          );
        }
      }
    });
    if (preview_mode) {
      worker.doWork().then(async (results) => {
        await autoSubmitAssessment(worker, results);
        worker.emit("done");
      }).catch((err) => {
        console.error(err);
        lib.$message.error("答题程序发生错误 : " + err.message);
      });
    } else {
      const getNextBtn = () => document.querySelector('[onclick="getTheNextQuestion(1)"]');
      let next2 = getNextBtn();
      (async () => {
        const allResults = [];
        while (worker.isClose === false) {
          allResults.push(await worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }));
          lib.$message.info({ content: "已完成，即将下一题", duration: 0 });
          await $.sleep(3e3);
          next2 = getNextBtn();
          if (!next2 || !isVisibleAction(next2)) break;
          next2.click();
          await $.sleep(1e3);
        }
        await autoSubmitAssessment(worker, allResults);
        worker.emit("done");
        CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "cx";
      })();
    }
    return worker;
  }
  async function mappingRecognize(doc = document) {
    var _a, _b;
    let typrMapping = /* @__PURE__ */ Object.create({});
    try {
      top$1.typrMapping = top$1.typrMapping || await loadTyprMapping();
      typrMapping = top$1.typrMapping;
    } catch {
      typrMapping = await loadTyprMapping();
    }
    const fontFaceEl = Array.from(doc.head.querySelectorAll("style")).find(
      (style) => {
        var _a2;
        return (_a2 = style.textContent) == null ? void 0 : _a2.includes("font-cxsecret");
      }
    );
    const base64ToUint8Array = (base64) => {
      const data = window.atob(base64);
      const buffer = new Uint8Array(data.length);
      for (let i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
      }
      return buffer;
    };
    const fontMap = typrMapping;
    if (fontFaceEl && Object.keys(fontMap).length > 0) {
      const font = (_b = (_a = fontFaceEl.textContent) == null ? void 0 : _a.match(/base64,([\w\W]+?)'/)) == null ? void 0 : _b[1];
      if (font) {
        $console.log("正在识别繁体字");
        const code = typr_js.parse(base64ToUint8Array(font));
        const match = {};
        for (let i = 19968; i < 40870; i++) {
          const Glyph = typr_js.U.codeToGlyph(code, i);
          if (!Glyph)
            continue;
          const path = typr_js.U.glyphToPath(code, Glyph);
          const hex = md5(JSON.stringify(path)).slice(24);
          match[i.toString()] = fontMap[hex];
        }
        const fonts = CXAnalyses.getSecretFont(doc);
        fonts.forEach((el, index) => {
          let html = el.innerHTML;
          for (const key in match) {
            const word = String.fromCharCode(parseInt(key));
            const value = String.fromCharCode(match[key]);
            if (word === value) {
              continue;
            }
            while (html.indexOf(word) !== -1) {
              html = html.replace(word, value);
            }
          }
          el.innerHTML = html;
          el.classList.remove("font-cxsecret");
        });
        $console.log("识别繁体字完成。");
      } else {
        $console.log("未检测到繁体字。");
      }
    }
  }
  async function loadTyprMapping() {
    try {
      $console.log("正在加载繁体字库。");
      return await request("https://cdn.ocsjs.com/resources/font/table.json", {
        type: "GM_xmlhttpRequest",
        method: "get",
        responseType: "json"
      });
    } catch (err) {
      $console.error("载繁体字库加载失败，请刷新页面重试：", String(err));
    }
  }
  const CXAnalyses = {
    isInSpecialMode() {
      return Array.from((top$1 == null ? void 0 : top$1.document.querySelectorAll(".catalog_points_sa,.catalog_points_er")) || []).length !== 0;
    },
    async isStuckInBreakingMode() {
      if (this.isInSpecialMode()) {
        const chapter = top$1 == null ? void 0 : top$1.document.querySelector(".posCatalog_active");
        if (chapter) {
          const id = chapter.getAttribute("id");
          if (id) {
            const counter = await lib.$store.getTab("chapter_counter") || /* @__PURE__ */ Object.create({});
            let count = Reflect.get(counter, id);
            count = count ? count + 1 : 1;
            Reflect.set(counter, id, count);
            let res = false;
            if (count >= 3) {
              Reflect.set(counter, id, 1);
              res = true;
            }
            await lib.$store.setTab("chapter_counter", counter);
            return res;
          }
        }
      }
      return false;
    },
    isInFinalTab() {
      const tabs = Array.from((top$1 == null ? void 0 : top$1.document.querySelectorAll(".prev_ul li")) || []);
      if (tabs.length === 0) {
        return true;
      }
      return tabs[tabs.length - 1].classList.contains("active");
    },
    isInFinalChapter() {
      var _a;
      return (_a = Array.from((top$1 == null ? void 0 : top$1.document.querySelectorAll(".posCatalog_select")) || []).pop()) == null ? void 0 : _a.classList.contains("posCatalog_active");
    },
    isFinishedAllChapters() {
      return this.getChapterInfos().every((chapter) => chapter.unFinishCount === 0);
    },
    getChapterInfos() {
      return Array.from((top$1 == null ? void 0 : top$1.document.querySelectorAll('[onclick^="getTeacherAjax"]')) || []).map((el) => {
        var _a, _b, _c;
        return {
          element: el,
          chapterId: (_b = (_a = el.getAttribute("onclick")) == null ? void 0 : _a.match(/\('(.*)','(.*)','(.*)'\)/)) == null ? void 0 : _b[3],
          unFinishCount: parseInt(((_c = el.parentElement.querySelector(".jobUnfinishCount")) == null ? void 0 : _c.value) || "0")
        };
      });
    },
    scrollToActiveChapter() {
      const activeChapter = top$1 == null ? void 0 : top$1.document.querySelector(".posCatalog_active");
      if (activeChapter) {
        activeChapter.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    waitForChapterInfos(timeout = 10) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          const res = this.getChapterInfos();
          if (res.length > 0) {
            clearInterval(interval);
            clearInterval(to);
            resolve(res);
          }
        }, 1e3);
        const to = setTimeout(() => {
          clearInterval(interval);
          resolve([]);
        }, timeout * 1e3);
      });
    },
    getSecretFont(doc = document) {
      return Array.from(doc.querySelectorAll(".font-cxsecret")).map((font) => {
        const after = font.querySelector(".after");
        return after === null ? font : after;
      });
    },
    isCurrentChapterFinished() {
      const job = top$1 == null ? void 0 : top$1.document.querySelector(".posCatalog_active");
      if (job) {
        if (job.querySelector(".icon_Completed") !== null) {
          return true;
        }
      }
      return false;
    }
  };
  function rateHack() {
    state$4.study.hacked = false;
    let dragCount = 0;
    try {
      hack();
      window.document.addEventListener("readystatechange", hack);
      window.addEventListener("load", hack);
    } catch (e) {
      console.error(e);
    }
    function hack() {
      const videojs = lib.$gm.unsafeWindow.videojs;
      const Ext = lib.$gm.unsafeWindow.Ext;
      if (typeof videojs !== "undefined" && typeof Ext !== "undefined") {
        if (state$4.study.hacked) {
          return;
        }
        state$4.study.hacked = true;
        const _origin = videojs.getPlugin("seekBarControl");
        const plugin = videojs.extend(videojs.getPlugin("plugin"), {
          constructor: function(videoExt, data) {
            const _sendLog = data.sendLog;
            data.sendLog = (...args) => {
              var _a;
              if (args[1] === "drag") {
                dragCount++;
                if (dragCount > 100) {
                  dragCount = 0;
                  (_a = lib.$el("video")) == null ? void 0 : _a.pause();
                }
              } else {
                _sendLog.apply(data, args);
              }
            };
            _origin.apply(_origin.prototype, [videoExt, data]);
          }
        });
        videojs.registerPlugin("seekBarControl", plugin);
        Ext.define("ans.VideoJs", {
          override: "ans.VideoJs",
          constructor: function(data) {
            this.addEvents(["seekstart"]);
            this.mixins.observable.constructor.call(this, data);
            const vjs = videojs(data.videojs, this.params2VideoOpt(data.params), function() {
            });
            Ext.fly(data.videojs).on("contextmenu", function(f) {
              f.preventDefault();
            });
            Ext.fly(data.videojs).on("keydown", function(f) {
              if (f.keyCode === 32 || f.keyCode === 37 || f.keyCode === 39 || f.keyCode === 107) {
                f.preventDefault();
              }
            });
            if (vjs.videoJsResolutionSwitcher) {
              vjs.on("resolutionchange", function() {
                const cr = vjs.currentResolution();
                const re2 = cr.sources ? cr.sources[0].res : false;
                Ext.setCookie("resolution", re2);
              });
            }
            if (vjs.videoJsPlayLine) {
              vjs.on("playlinechange", function() {
                const cp = vjs.currentPlayline();
                Ext.setCookie("net", cp.net);
              });
            }
          }
        });
      }
    }
  }
  async function study(opts) {
    var _a;
    await $.sleep(3e3);
    const searchedJobs = [];
    let searching = true;
    let attachmentCount = ((_a = lib.$gm.unsafeWindow.attachments) == null ? void 0 : _a.length) || 0;
    const wait_timeout = 3 + attachmentCount * 2;
    setTimeout(() => {
      searching = false;
    }, Math.min(wait_timeout, 10) * 1e3);
    const runJobs = async () => {
      const job = searchJob(opts, searchedJobs);
      if (job && job.func) {
        try {
          await job.func();
        } catch (e) {
          $console.error("未知错误", e);
        }
        await $.sleep(1e3);
        await runJobs();
      } else if (attachmentCount > 0) {
        attachmentCount--;
        await $.sleep(1e3);
        await runJobs();
      } else if (searching) {
        await $.sleep(1e3);
        await runJobs();
      }
    };
    await runJobs();
    top$1._preChapterId = "";
    const next2 = async () => {
      if (CXAnalyses.isInFinalTab()) {
        if (await CXAnalyses.isStuckInBreakingMode()) {
          return lib.$modal.alert({
            content: "检测到当前课程为闯关模式（有小旗帜图标）, 但是已经重复进入多次，应该是章节测试没有完成，或者其他情况导致，请手动完成章节测试，然后手动点击下一章。"
          });
        }
      }
      if (CXAnalyses.isInFinalChapter()) {
        let content = "";
        if (opts.backToFirstWhenFinish) {
          content = "已经抵达最后一个章节，10秒后返回第一个章节重新开始。";
          setTimeout(() => {
            var _a2;
            (_a2 = top$1 == null ? void 0 : top$1.document.querySelector(".posCatalog_name")) == null ? void 0 : _a2.click();
          }, 10 * 1e3);
          lib.$message.info({ content, duration: 30 });
        } else {
          if (CXAnalyses.isFinishedAllChapters()) {
            content = "全部任务点已完成！";
          } else {
            content = "已经抵达最后一个章节！但仍然有任务点未完成，请手动切换至未完成的章节。";
          }
          lib.$modal.alert({ content });
        }
        CommonProject.scripts.settings.methods.notificationBySetting(content, {
          duration: 0,
          extraTitle: "超星学习通学习脚本"
        });
        return;
      }
      if (CXProject.scripts.study.cfg.mode === "job") {
        if (CXAnalyses.isInFinalTab()) {
          const elements2 = CXAnalyses.getChapterInfos().filter((el) => {
            var _a2;
            return el.unFinishCount > 0 || ((_a2 = el.element.parentElement) == null ? void 0 : _a2.classList.contains("posCatalog_active"));
          }).map((el) => el.element.parentElement);
          if (elements2.length === 0) {
            const content = "全部任务点已完成！";
            lib.$modal.alert({ content });
            CommonProject.scripts.settings.methods.notificationBySetting(content, {
              duration: 0,
              extraTitle: "超星学习通学习脚本"
            });
            return;
          }
          let nextChapter = elements2[0];
          const currentIndex = elements2.findIndex((el) => el.classList.contains("posCatalog_active"));
          if (currentIndex !== -1 && currentIndex + 1 < elements2.length) {
            nextChapter = elements2[currentIndex + 1];
            CXAnalyses.scrollToActiveChapter();
            setTimeout(() => {
              var _a2;
              (_a2 = nextChapter.querySelector(".posCatalog_name")) == null ? void 0 : _a2.click();
            }, 1e3);
          }
        }
      } else if (CXProject.scripts.study.cfg.mode === "next") {
        const curCourseId = lib.$el("#curCourseId", top$1 == null ? void 0 : top$1.document);
        const curChapterId = lib.$el("#curChapterId", top$1 == null ? void 0 : top$1.document);
        const curClazzId = lib.$el("#curClazzId", top$1 == null ? void 0 : top$1.document);
        const count = lib.$$el("#prev_tab .prev_ul li", top$1 == null ? void 0 : top$1.document);
        if (curChapterId && curCourseId && curClazzId) {
          top$1._preChapterId = curChapterId.value;
          CXAnalyses.scrollToActiveChapter();
          await $.sleep(200);
          top$1 == null ? void 0 : top$1.PCount.next(count.length.toString(), curChapterId.value, curCourseId.value, curClazzId.value, "");
        } else {
          $console.warn("参数错误，无法跳转下一章，请尝试手动切换。");
        }
      } else {
        $console.warn("未知的跳转模式，请联系作者反馈");
      }
    };
    if (CXProject.scripts.study.cfg.mode !== "manually") {
      const msg2 = "页面任务点已完成，即将跳转。";
      lib.$message.success({ content: msg2 });
      $console.info(msg2);
      await $.sleep(5e3);
      next2();
    } else {
      const msg2 = "页面任务点已完成，自动跳转已关闭，请手动跳转。";
      lib.$message.warn({ content: msg2, duration: 0 });
      $console.warn(msg2);
    }
  }
  function searchIFrame(root2) {
    var _a, _b;
    let list = Array.from(root2.querySelectorAll("iframe"));
    const result = [];
    while (list.length) {
      const frame = list.shift();
      try {
        if (frame && ((_a = frame == null ? void 0 : frame.contentWindow) == null ? void 0 : _a.document)) {
          result.push(frame);
          const frames = (_b = frame == null ? void 0 : frame.contentWindow) == null ? void 0 : _b.document.querySelectorAll("iframe");
          list = list.concat(Array.from(frames || []));
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    return result;
  }
  function searchJob(opts, searchedJobs) {
    const knowCardWin = lib.$gm.unsafeWindow;
    const searchJobElement = (root2) => {
      return domSearch(
        {
          videojs: "#video,#audio",
          chapterTest: ".TiMu",
          read: "#img.imglook",
          pptWithAudio: ".swiper-container",
          hyperlink: "#hyperlink",
          timereader: 'iframe[name="bookifame"][src*="timing"]'
        },
        root2.contentWindow.document
      );
    };
    const search = (root2) => {
      var _a, _b, _c, _d;
      const win = root2.contentWindow;
      const { videojs, read, chapterTest, hyperlink, pptWithAudio, timereader } = searchJobElement(root2);
      if (win && (videojs || read || chapterTest || hyperlink || pptWithAudio || timereader)) {
        const frame_data_str = ((_a = win.frameElement) == null ? void 0 : _a.getAttribute("data")) || ((_d = (_c = (_b = win.frameElement) == null ? void 0 : _b.contentWindow) == null ? void 0 : _c.parent.frameElement) == null ? void 0 : _d.getAttribute("data")) || "{}";
        const frame_data = JSON.parse(frame_data_str);
        const target_jobid = frame_data.jobid || frame_data._jobid;
        if (!target_jobid) {
          return;
        }
        const attachment = knowCardWin.attachments.find((attachment2) => {
          const attachment_jobid = attachment2.jobid || attachment2.property._jobid;
          if (!attachment_jobid) {
            return false;
          }
          return String(attachment_jobid) === String(target_jobid);
        });
        if (attachment && searchedJobs.find((job2) => job2.mid === attachment.property.mid) === void 0) {
          const { name, title, bookname, author } = attachment.property;
          const jobName = name || title || (bookname ? bookname + author : void 0) || "未知任务";
          const work_type = attachment.job ? "job" : attachment.isPassed ? "finished" : "not-job";
          let func;
          if (videojs) {
            if (!CXProject.scripts.study.cfg.enableMedia) {
              const msg2 = `音视频自动学习功能已被关闭（在上方菜单栏，超星学习通-课程学习中开启）。${jobName} 即将跳过`;
              lib.$message.warn({ content: msg2, duration: 10 });
              $console.warn(msg2);
            } else {
              if (work_type === "job" || work_type === "finished" && opts.restudy || work_type === "not-job" && opts.forceLearn) {
                func = () => {
                  const msg2 = `即将${work_type === "finished" && opts.restudy ? "重新" : work_type === "not-job" && opts.forceLearn ? "强制" : ""}播放 : ` + jobName;
                  lib.$message.info({ content: msg2 });
                  $console.log(msg2);
                  return JobRunner.media(opts, win.document);
                };
              }
            }
          } else if (chapterTest) {
            if (!CXProject.scripts.study.cfg.enableChapterTest) {
              const msg2 = `章节测试自动答题功能已被关闭（在上方菜单栏，超星学习通-课程学习中开启）。${jobName} 即将跳过`;
              lib.$message.warn({ content: msg2, duration: 10 });
              $console.warn(msg2);
            } else {
              const status = win.document.querySelector(".testTit_status");
              if (status == null ? void 0 : status.classList.contains("testTit_status_complete")) {
                const msg2 = `章节测试已完成 : ` + jobName;
                lib.$message.success({ content: msg2 });
                $console.log(msg2);
              } else {
                if (work_type === "job" || work_type === "not-job" && CommonProject.scripts.settings.cfg["work-when-no-job"]) {
                  if (getAIConfigError()) {
                    aiConfigWarning(0);
                  } else {
                    func = () => {
                      const msg2 = `开始答题 : ` + jobName;
                      lib.$message.info({ content: msg2 });
                      $console.log(msg2);
                      return JobRunner.chapter(root2, opts.workOptions);
                    };
                  }
                }
                if (work_type === "not-job" && CommonProject.scripts.settings.cfg["work-when-no-job"] === false) {
                  const msg2 = `当前作业 ${jobName} 不是任务点，但待完成，如需开启自动答题请前往：通用-全局设置，开启强制答题。`;
                  lib.$message.warn({ content: msg2 });
                  $console.warn(msg2);
                }
              }
            }
          } else if (read || pptWithAudio || timereader) {
            if (!CXProject.scripts.study.cfg.enablePPT) {
              const msg2 = `PPT/书籍阅读功能已被关闭（在上方菜单栏，超星学习通-课程学习中开启）。${jobName} 即将跳过`;
              lib.$message.warn({ content: msg2, duration: 10 });
              $console.warn(msg2);
            } else {
              if (attachment.job) {
                func = () => {
                  const msg2 = `正在学习 : ` + jobName;
                  lib.$message.info({ content: msg2 });
                  $console.log(msg2);
                  if (read) {
                    return JobRunner.read(win);
                  } else if (timereader) {
                    return JobRunner.timereader(timereader);
                  } else {
                    return JobRunner.readPPTWithAudio(win);
                  }
                };
              }
            }
          } else if (hyperlink) {
            if (!CXProject.scripts.study.cfg.enableHyperlink) {
              const msg2 = `链接任务点已被关闭（在上方菜单栏，超星学习通-课程学习中开启）。${jobName} 即将跳过`;
              lib.$message.warn({ content: msg2, duration: 10 });
              $console.warn(msg2);
            } else {
              if (attachment.job) {
                func = () => {
                  const msg2 = `正在完成链接阅读任务 : ` + jobName;
                  lib.$message.info({ content: msg2 });
                  $console.log(msg2);
                  return JobRunner.hyperlink(hyperlink);
                };
              }
            }
          }
          const job2 = {
            mid: attachment.property.mid,
            attachment,
            func
          };
          searchedJobs.push(job2);
          return job2;
        }
      }
    };
    let job;
    for (const iframe of searchIFrame(knowCardWin.document)) {
      job = search(iframe);
      if (job) {
        return job;
      }
    }
    return job;
  }
  function fixedVideoProgress() {
    if (state$4.study.videojs) {
      const { bar } = domSearch({ bar: ".vjs-control-bar" }, state$4.study.videojs);
      if (bar) {
        bar.style.opacity = "1";
      }
    }
  }
  const JobRunner = {
    async media(setting, doc) {
      const { playbackRate: playbackRate2 = 1, volume: volume2 = 0 } = setting;
      const media = await waitForMedia({ root: doc });
      const { videojs } = domSearch({ videojs: "#video,#audio" }, doc);
      if (!videojs || !media) {
        $console.error("视频检测不到，请尝试刷新或者手动切换下一章。");
        return;
      }
      state$4.study.videojs = videojs;
      top$1.currentMedia = media;
      fixedVideoProgress();
      if (setting.videoQuizStrategy === "random") {
        const loop = async () => {
          var _a;
          const submitBtn = () => doc.querySelector("#videoquiz-submit");
          if (submitBtn()) {
            const list = Array.from(doc.querySelectorAll(".ans-videoquiz-opt label"));
            const answer = list[Math.floor(Math.random() * list.length)];
            answer == null ? void 0 : answer.click();
            (_a = submitBtn()) == null ? void 0 : _a.click();
            await $.sleep(3e3);
            const container2 = doc.querySelector("#video .ans-videoquiz");
            const components = Array.from(doc.querySelectorAll(".x-component-default"));
            if (container2) {
              container2.remove();
            }
            if (components.length) {
              for (const com of components) {
                com.style.display = "none";
              }
            }
          }
          await $.sleep(3e3);
          await loop();
        };
        loop();
      }
      return new Promise((resolve, reject) => {
        const reloadInterval = setInterval(() => {
          const errorDiv = doc.querySelector(".vjs-modal-dialog-content");
          if (["视频文件损坏", "网络错误导致视频下载中途失败", "视频因格式不支持", "网络的问题无法加载"].some(
            (s) => errorDiv == null ? void 0 : errorDiv.innerText.includes(s)
          )) {
            $console.error("检测到视频加载失败，即将跳过视频。");
            lib.$message.error("检测到视频加载失败，即将跳过视频。");
            setTimeout(resolve, 3e3);
          }
        }, 3e3);
        const playFunction = async () => {
          if (hasFaceRecognition())
            await waitForFaceRecognition();
          if (hasNewFaceRecognition())
            await waitForNewFaceRecognition();
          if (media.ended === false) {
            await $.sleep(1e3);
            media.play();
            media.playbackRate = playbackRate2;
          }
        };
        media.addEventListener("pause", playFunction);
        media.addEventListener("ended", () => {
          media.removeEventListener("pause", playFunction);
          $console.log("视频播放完毕");
          clearInterval(reloadInterval);
          resolve();
        });
        $console.log("视频开始播放");
        media.volume = volume2;
        media.currentTime = 0;
        setTimeout(() => {
          playMedia(() => media.play()).then(() => {
            media.playbackRate = playbackRate2;
          }).catch(reject);
        }, 200);
      });
    },
    async read(win) {
      const finishJob = win.finishJob;
      if (finishJob)
        finishJob();
      await $.sleep(3e3);
    },
    async timereader(iframe) {
      var _a, _b;
      const src2 = ((_a = iframe.getAttribute("src")) == null ? void 0 : _a.toString()) || "";
      const timing = src2 ? parseInt(((_b = new URL(src2).searchParams.get("timing")) == null ? void 0 : _b.toString()) || "60") : 60;
      lib.$message.info({
        content: `正在学习长时阅读任务，请稍等，不要切换..（预计${(timing + 3) * 3}秒）`,
        duration: (timing + 3) * 3
      });
      await $.sleep((timing + 3) * 3 * 1e3);
      lib.$message.success("长时阅读任务完成！");
      await $.sleep(5e3);
    },
    async chapter(frame, {
      period,
      upload,
      thread,
      stopSecondWhenFinish,
      redundanceWordsText,
      answerSeparators
    }) {
      if (getAIConfigError()) return aiConfigWarning(0);
      $console.info("开始章节测试");
      const visual_state = CommonProject.scripts.render.cfg.visual;
      const frameWindow = frame.contentWindow;
      const { TiMu } = domSearchAll({ TiMu: ".TiMu" }, frameWindow.document);
      CORSUtils.panelNormal();
      CommonProject.scripts.workResults.methods.init();
      CORSUtils.pinWorkPanel();
      const chapterTestTaskQuestionTitleTransform = (titles) => {
        const removed = removeRedundantWords(
          titles.map((t2) => t2 ? optimizationElementWithImage(t2, true).innerText : "").join(","),
          redundanceWordsText.split("\n")
        );
        return removed.trim().replace(/^\d+[。、.]/, "").replace(/（\d+\.\d+分）/, "").replace(/\(..题, \d+?分\)/, "").replace(/\(..题, \d+\.\d+分\)/, "").replace(/[[(【（](..题|名词解释|完形填空|阅读理解)[\])】）]/, "").trim();
      };
      const worker = new OCSWorker({
        root: TiMu,
        elements: {
          title: [
            (root2) => lib.$el(".Zy_TItle .clearfix", root2),
            (root2) => lib.$el(".firstUlList", root2),
            (root2) => lib.$el(".secondUlList", root2)
          ],
          options: "ul li .after,ul li textarea,ul textarea,ul li label:not(.before)",
          type: 'input[id^="answertype"]',
          lineSelectBox: ".thirdUlList .dept_select"
        },
        thread: thread != null ? thread : 1,
        answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
        answerer: (elements2, ctx) => {
          const title = chapterTestTaskQuestionTitleTransform(elements2.title);
          if (title) {
            const typeInput = elements2.type[0];
            const type = (typeInput ? getQuestionType(parseInt(typeInput.value)) : void 0) || "unknown";
            return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
              await $.sleep((period != null ? period : 3) * 1e3);
              return aiAnswerHandler({
                type,
                title,
                options: ctx.elements.options.map((o) => optimizationElementWithImage(o, true).innerText || ""),
                images: collectQuestionImages(ctx.root)
              });
            });
          } else {
            throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
          }
        },
        work: async (ctx) => {
          var _a;
          const { elements: elements2, searchInfos } = ctx;
          const typeInput = elements2.type[0];
          const type = typeInput ? getQuestionType(parseInt(typeInput.value)) : void 0;
          if (type && (type === "completion" || type === "multiple" || type === "judgement" || type === "single")) {
            const resolver = createDefaultQuestionResolver(ctx)[type];
            const handler = (type2, answer, option, ctx2) => {
              var _a2, _b, _c, _d, _e, _f, _g;
              if (type2 === "judgement" || type2 === "single" || type2 === "multiple") {
                const checked = ((_b = (_a2 = option == null ? void 0 : option.parentElement) == null ? void 0 : _a2.querySelector("label input")) == null ? void 0 : _b.getAttribute("checked")) === "checked" || ((_c = option == null ? void 0 : option.parentElement) == null ? void 0 : _c.getAttribute("aria-checked")) === "true";
                if (checked)
                  ;
                else {
                  option == null ? void 0 : option.click();
                }
              } else if (type2 === "completion" && answer.trim()) {
                const text = (_d = option == null ? void 0 : option.parentElement) == null ? void 0 : _d.querySelector("textarea");
                const textareaFrame = (_e = option == null ? void 0 : option.parentElement) == null ? void 0 : _e.querySelector("iframe");
                if (text) {
                  text.value = answer;
                  dispatchAnswerInput(text);
                }
                if (textareaFrame == null ? void 0 : textareaFrame.contentDocument) {
                  textareaFrame.contentDocument.body.textContent = answer;
                  dispatchAnswerInput(textareaFrame.contentDocument.body);
                }
                if ((_f = option == null ? void 0 : option.parentElement) == null ? void 0 : _f.parentElement) {
                  (_g = lib.$el("[onclick*=saveQuestion]", option.parentElement.parentElement)) == null ? void 0 : _g.click();
                }
              }
            };
            return await resolver(
              searchInfos,
              elements2.options.map((option) => optimizationElementWithImage(option)),
              handler
            );
          } else if (type && type === "line") {
            const select = (el, opt_val) => {
              const selected = el.querySelector(`option[selected]`);
              const opt = el.querySelector(`option[value="${opt_val}"]`);
              selected == null ? void 0 : selected.removeAttribute("selected");
              if (opt) {
                opt.setAttribute("selected", "");
              }
            };
            for (const answers of searchInfos.map((info) => info.results.map((res) => res.answer))) {
              for (const ans of answers) {
                const splited_ans = splitAnswer(ans);
                if (splited_ans.length !== 0 && elements2.lineSelectBox.length === splited_ans.length) {
                  for (let index = 0; index < elements2.lineSelectBox.length; index++) {
                    const box = elements2.lineSelectBox[index];
                    if (splited_ans[index]) {
                      select(box, splited_ans[index]);
                      const text = (_a = box.parentElement) == null ? void 0 : _a.querySelector(".chosen-single span");
                      if (text)
                        text.textContent = splited_ans[index];
                      await $.sleep(200);
                    }
                  }
                  return { finish: true };
                }
              }
            }
            return { finish: false };
          }
          return { finish: false };
        },
        async onResultsUpdate(curr, _, res) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          CommonProject.scripts.workResults.methods.setResults(
            simplifyWorkResult(res, chapterTestTaskQuestionTitleTransform)
          );
          if ((_a = curr.result) == null ? void 0 : _a.finish) {
            CommonProject.scripts.apps.methods.recordAIResult(
              simplifyWorkResult([curr], chapterTestTaskQuestionTitleTransform)
            );
          }
          CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
          if (((_b = curr.result) == null ? void 0 : _b.finish) === false && curr.resolved === true) {
            const options = ((_d = (_c = curr.ctx) == null ? void 0 : _c.elements) == null ? void 0 : _d.options) || [];
            const typeInput = (_f = (_e = curr.ctx) == null ? void 0 : _e.elements) == null ? void 0 : _f.type[0];
            const type = typeInput ? getQuestionType(parseInt(typeInput.value)) : void 0;
            const commonSetting = CommonProject.scripts.settings.cfg;
            if (commonSetting["randomWork-choice"] && (type === "judgement" || type === "single" || type === "multiple")) {
              $console.log("正在随机作答");
              const option = options[Math.floor(Math.random() * options.length)];
              (_h = (_g = option == null ? void 0 : option.parentElement) == null ? void 0 : _g.querySelector("a,label")) == null ? void 0 : _h.click();
            } else if (commonSetting["randomWork-complete"] && type === "completion") {
              $console.log("正在随机作答");
              for (const option of options) {
                const textarea = (_i = option == null ? void 0 : option.parentElement) == null ? void 0 : _i.querySelector("textarea");
                const completeTexts = commonSetting["randomWork-completeTexts-textarea"].split("\n").filter(Boolean);
                const text = completeTexts[Math.floor(Math.random() * completeTexts.length)];
                const textareaFrame = (_j = option == null ? void 0 : option.parentElement) == null ? void 0 : _j.querySelector("iframe");
                if (text) {
                  if (textarea) {
                    textarea.value = text;
                  }
                  if (textareaFrame == null ? void 0 : textareaFrame.contentDocument) {
                    textareaFrame.contentDocument.body.innerHTML = text;
                  }
                } else {
                  $console.error("请设置随机填空的文案");
                }
                await $.sleep(500);
              }
            }
          }
        },
        async onElementSearched(elements2) {
          const typeInput = elements2.type[0];
          const type = typeInput ? getQuestionType(parseInt(typeInput.value)) : void 0;
          if (type === "judgement") {
            elements2.options.forEach((option) => {
              var _a;
              const opt = ((_a = option == null ? void 0 : option.textContent) == null ? void 0 : _a.trim()) || "";
              if (opt.includes("对") || opt.includes("错"))
                ;
              else if (opt === "True") {
                option.textContent = "√";
              } else if (opt === "False") {
                option.textContent = "x";
              } else if (opt === "對") {
                option.textContent = "√";
              } else if (opt === "錯") {
                option.textContent = "x";
              } else {
                const ri = option.querySelector(".ri");
                const span = document.createElement("span");
                span.innerText = ri ? "√" : "×";
                option.appendChild(span);
              }
            });
          }
        }
      });
      const results = await worker.doWork();
      const msg2 = `答题完成，将等待 ${stopSecondWhenFinish} 秒后进行保存或提交。`;
      $console.info(msg2);
      lib.$message.info({ content: msg2, duration: stopSecondWhenFinish });
      await $.sleep(stopSecondWhenFinish * 1e3);
      await worker.uploadHandler({
        type: upload,
        results,
        async callback(finishedRate, uploadable) {
          const msg22 = `完成率 ${finishedRate.toFixed(2)}% :  ${uploadable ? "3秒后将自动提交" : "3秒后将自动保存"} `;
          $console.info(msg22);
          lib.$message.success({ content: msg22, duration: 3 });
          await $.sleep(3e3);
          if (uploadable) {
            const submitKey = assessmentSubmissionKey(worker, "chaoxing-chapter");
            if (submissionAttempts.has(submitKey)) {
              lib.$message.warn({ content: "本次章节测试已尝试提交，不会重复操作。", duration: 0 });
              return;
            }
            await waitForHumanVerification(worker, frameWindow.document);
            if (!await waitForWorkerReady(worker)) return;
            if (typeof frameWindow.btnBlueSubmit !== "function" || typeof frameWindow.submitCheckTimes !== "function") {
              if (typeof frameWindow.noSubmit === "function") frameWindow.noSubmit();
              worker.emit("stop");
              lib.$message.error({ content: "未找到超星章节测试提交接口，答案已保存并停止提交。", duration: 0 });
              return;
            }
            submissionAttempts.add(submitKey);
            frameWindow.btnBlueSubmit();
            await $.sleep(3e3);
            await waitForHumanVerification(worker, frameWindow.document);
            frameWindow.submitCheckTimes();
            top$1.$("#workpop").hide();
          } else {
            frameWindow.alert = () => {
            };
            const saved = typeof frameWindow.noSubmit === "function" ? (frameWindow.noSubmit(), true) : await safeGenericSave(frameWindow.document);
            worker.emit("stop");
            const failures = failedResultSummary(results);
            lib.$message.warn({ content: "未达到提交阈值；" + (saved ? "已保存答案。" : "请手动保存页面答案。") + (failures.length ? " 未答题：" + failures.slice(0, 8).join("；") : ""), duration: 0 });
          }
        }
      });
      if (visual_state === "minimize" && CommonProject.scripts.render.cfg.visual !== "minimize") {
        CORSUtils.panelMinimize();
      }
      worker.emit("done");
    },
    async readPPTWithAudio(win) {
      var _a;
      win.document.querySelectorAll("audio").forEach((audio) => {
        audio.addEventListener("play", () => {
          audio.muted = true;
        });
      });
      const len = win.document.querySelectorAll(".swiper-container .swiper-slide").length;
      for (let index = 0; index < len; index++) {
        (_a = win.swiperNext) == null ? void 0 : _a.call(win);
        await $.sleep(1e3);
      }
      await $.sleep(3e3);
    },
    async hyperlink(a) {
      const _click = a.onclick;
      a.onclick = () => false;
      a.click();
      a.onclick = _click;
      await $.sleep(3e3);
    }
  };
  function getQuestionType(val) {
    return val === 0 ? "single" : val === 1 ? "multiple" : val === 3 ? "judgement" : [2, 4, 5, 6, 7, 8, 9, 10].some((t2) => t2 === val) ? "completion" : val === 11 ? "line" : val === 14 ? "fill" : val === 15 ? "reader" : void 0;
  }
  async function readerAndFillHandle(searchInfos, list) {
    var _a;
    for (const answers of searchInfos.map((info) => info.results.map((res) => res.answer))) {
      let ans = answers;
      if (ans.length === 1) {
        ans = splitAnswer(ans[0]);
      }
      if (ans.filter(Boolean).length !== 0 && list.length !== 0) {
        for (let index = 0; index < ans.length; index++) {
          const item = list[index];
          if (item) {
            (_a = lib.$el(`span.saveSingleSelect[data="${ans[index]}"]`, item)) == null ? void 0 : _a.click();
            await $.sleep(200);
          }
        }
        return { finish: true };
      }
    }
    return { finish: false };
  }
  function hasFaceRecognition() {
    const faces = lib.$$el("#fcqrimg", top$1 == null ? void 0 : top$1.document);
    let active = false;
    for (const face of faces) {
      const src2 = face.getAttribute("src");
      if (src2) {
        active = true;
        break;
      }
    }
    return active;
  }
  function hasNewFaceRecognition() {
    const faces = lib.$$el(".chapterVideoFaceMaskDiv", top$1 == null ? void 0 : top$1.document);
    let active = false;
    for (const face of faces) {
      if (face.style.display !== "none") {
        active = true;
        break;
      }
    }
    return active;
  }
  function waitForNewFaceRecognition() {
    let notified = false;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const active = hasNewFaceRecognition();
        if (active) {
          if (!notified) {
            notified = true;
            const msg2 = "检测到人脸识别，请手动进行识别后脚本才会继续运行。";
            if (CXProject.scripts.study.cfg.notifyWhenHasFaceRecognition) {
              CommonProject.scripts.settings.methods.notificationBySetting(msg2, { duration: 0 });
            }
            lib.$message.warn({ content: msg2, duration: 0 });
            $console.warn(msg2);
          }
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 3e3);
    });
  }
  function waitForFaceRecognition() {
    let notified = false;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const active = hasFaceRecognition();
        if (active) {
          if (!notified) {
            notified = true;
            const msg2 = "检测到人脸识别，请手动进行识别后脚本才会继续运行。";
            if (CXProject.scripts.study.cfg.notifyWhenHasFaceRecognition) {
              CommonProject.scripts.settings.methods.notificationBySetting(msg2, { duration: 0 });
            }
            lib.$message.warn({ content: msg2, duration: 0 });
            $console.warn(msg2);
          }
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 3e3);
    });
  }
  const CORSUtils = {
    pinWorkPanel: lib.cors.defineTopFunction(() => {
      CommonProject.scripts.render.methods.pin(CommonProject.scripts.workResults);
    }),
    panelNormal: lib.cors.defineTopFunction(() => {
      CommonProject.scripts.render.methods.normal();
    }),
    panelMinimize: lib.cors.defineTopFunction(() => {
      CommonProject.scripts.render.methods.minimize();
    })
  };
  const state$3 = {
    study: {
      currentMedia: void 0,
      currentStudyLockId: 0,
      playbackRateWarningListenerId: 0,
      courseLengthListenerId: 0
    }
  };
  const $msg_and_log$1 = (type, msg2) => {
    lib.$message[type](msg2);
    $console[type](msg2);
  };
  const _StudyLock = class {
    constructor() {
      _StudyLock.auto_inc++;
      this.id = _StudyLock.auto_inc;
      state$3.study.currentStudyLockId = this.id;
    }
    canStudy() {
      return this.id === state$3.study.currentStudyLockId;
    }
    static getLock() {
      return new _StudyLock();
    }
  };
  let StudyLock = _StudyLock;
  StudyLock.auto_inc = 0;
  const IcveMoocProject = lib.Project.create({
    name: "智慧职教",
    domains: [
      "icve.com.cn",
      "ai.icve.com.cn",
      "course.icve.com.cn",
      "courshare.cn",
      "webtrn.cn"
    ],
    scripts: {
      guide: new lib.Script({
        name: "💡 使用提示",
        matches: [
          ["个人首页", "icve.com.cn/studycenter"],
          ["学习页面", "icve.com.cn/study/directory"],
          ["MOOC学院-个人首页", "user.icve.com.cn"],
          ["MOOC学院-首页", "mooc.icve.com.cn"]
        ],
        namespace: "icve.guide",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["请点击任意课程进入", "进入课程后点击任意章节进入，即可自动学习"]).outerHTML
          }
        },
        oncomplete() {
          CommonProject.scripts.render.methods.pin(this);
        }
      }),
      studyCenter: new lib.Script({
        name: "🖥️ 智慧职教-学习中心",
        namespace: "icve.study.center",
        matches: [
          ["学习中心页面", "/study/directory/dir_course.html"],
          ["课程列表", "icve.com.cn/study/directory/directory_list.html"]
        ],
        configs: {
          playbackRate,
          volume,
          currentCourseUrlList: {
            defaultValue: []
          }
        },
        async oncomplete() {
          if (location.href.includes("icve.com.cn/study/directory/directory_list.html")) {
            await waitForElement(".h_cells a");
            this.cfg.currentCourseUrlList = Array.from(document.querySelectorAll(".h_cells a")).map(
              (a) => a.href
            );
            return;
          }
          if (this.cfg.currentCourseUrlList.length === 0) {
            try {
              const url = "https://www.icve.com.cn/study/directory/directory_list.html?courseId=" + new URL(location.href).searchParams.get("courseId");
              const res = await fetch(url).then((res2) => res2.text());
              const doc = new DOMParser().parseFromString(res, "text/html");
              this.cfg.currentCourseUrlList = Array.from(doc.querySelectorAll(".h_cells a")).map(
                (a) => a.href
              );
            } catch (e) {
              console.error(e);
              lib.$message.error("课程列表获取失败，请刷新页面重试。");
              return;
            }
          }
          CommonProject.scripts.render.methods.pin(this);
          this.onConfigChange("playbackRate", (playbackRate2) => {
            state$3.study.currentMedia && (state$3.study.currentMedia.playbackRate = parseFloat(playbackRate2.toString()));
          });
          this.onConfigChange("volume", (v) => state$3.study.currentMedia && (state$3.study.currentMedia.volume = v));
          const study2 = async () => {
            var _a;
            const res = await Promise.race([waitForElement("video, audio"), waitForElement(".docBox")]);
            if (res) {
              const jobName = ((_a = document.querySelector(".tabsel.seled")) == null ? void 0 : _a.getAttribute("title")) || "-";
              lib.$message.info("开始任务：" + jobName);
              $console.log(`任务 ${jobName} 开始。`);
              if (document.querySelector("video, audio")) {
                const media = await waitForMedia();
                state$3.study.currentMedia = media;
                media.volume = this.cfg.volume;
                await new Promise((resolve, reject) => {
                  try {
                    console.log(document.hasFocus());
                    window.focus();
                    lib.$gm.unsafeWindow.jwplayer().onComplete(async () => {
                      $console.log("视频/音频播放完成。");
                      await $.sleep(3e3);
                      resolve();
                    });
                    const play = () => {
                      lib.$gm.unsafeWindow.jwplayer().play();
                      lib.$gm.unsafeWindow.jwplayer().play();
                      media.playbackRate = parseFloat(this.cfg.playbackRate.toString());
                    };
                    media.addEventListener("pause", async () => {
                      if (!media.ended) {
                        await $.sleep(1e3);
                        playMedia(play);
                      }
                    });
                    playMedia(play);
                  } catch (err) {
                    reject(err);
                  }
                });
              }
              lib.$message.success(`任务 ${jobName} 完成，三秒后下一章`);
              $console.log(`任务 ${jobName} 完成，三秒后下一章`);
            } else {
              $console.error(`不支持的任务页面，请跟作者进行反馈。三秒后下一章`);
            }
            await $.sleep(3e3);
            next2();
          };
          const next2 = () => {
            for (let index = 0; index < this.cfg.currentCourseUrlList.length; index++) {
              const url = this.cfg.currentCourseUrlList[index];
              const nextUrl = this.cfg.currentCourseUrlList[index + 1];
              if (new URL(url).hash === new URL(location.href).hash) {
                if (!nextUrl) {
                  lib.$modal.alert({ content: "全部任务已完成" });
                  CommonProject.scripts.settings.methods.notificationBySetting("全部任务点已完成！", {
                    duration: 0,
                    extraTitle: "智慧职教学习脚本"
                  });
                  return;
                } else {
                  window.location.href = this.cfg.currentCourseUrlList[index + 1];
                }
              }
            }
          };
          study2();
        }
      }),
      study: new lib.Script({
        name: "🖥️ MOOC学院-课程学习",
        namespace: "icve.study.main",
        matches: [["课程学习页面", "/learnspace/learn/learn/templateeight/index.action"]],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "如果视频无法播放，可以手动点击其他任务跳过视频。",
              "经过测试视频倍速最多二倍，否则会判定无效。",
              "手动进入作业页面才能使用自动答题。"
            ]).outerHTML
          },
          playbackRate,
          volume,
          restudy,
          showScrollBar: {
            label: "显示右侧滚动条",
            attrs: { type: "checkbox" },
            defaultValue: true
          },
          expandAll: {
            label: "展开所有章节",
            attrs: { type: "checkbox" },
            defaultValue: true
          },
          switchPeriod: {
            label: "下一章节切换间隔（秒）",
            defaultValue: 10,
            attrs: {
              type: "number",
              min: 0,
              max: 999,
              step: 1
            }
          }
        },
        onrender() {
          this.offConfigChange(state$3.study.playbackRateWarningListenerId);
          state$3.study.playbackRateWarningListenerId = this.onConfigChange("playbackRate", (playbackRate2) => {
            if (playbackRate2 > 4) {
              lib.$modal.alert({
                title: "⚠️高倍速警告",
                content: lib.$ui.notes(["高倍速可能导致视频无法完成！"])
              });
            }
          }) || 0;
        },
        async oncomplete() {
          var _a;
          CommonProject.scripts.render.methods.pin(this);
          await $.sleep(3e3);
          this.onConfigChange("volume", (v) => state$3.study.currentMedia && (state$3.study.currentMedia.volume = v));
          this.onConfigChange(
            "playbackRate",
            (r) => state$3.study.currentMedia && (state$3.study.currentMedia.playbackRate = parseFloat(r.toString()))
          );
          const mainContentWin = (_a = lib.$el("#mainContent")) == null ? void 0 : _a.contentWindow;
          if (mainContentWin) {
            lib.$modal.confirm({
              content: lib.h("div", [
                "是否开始自动学习当前章节？",
                lib.h("br"),
                "你也可以选择任意的章节进行点击，脚本会自动学习，并一直往下寻找章节。"
              ]),
              cancelButtonText: "我想手动选择章节",
              confirmButtonText: "开始学习",
              async onConfirm() {
                study2(StudyLock.getLock());
                scrollToJob();
              }
            });
          }
          if (this.cfg.showScrollBar) {
            const bar = lib.$el(".dumascroll_area", mainContentWin.document);
            bar && (bar.style.overflow = "auto");
          }
          if (this.cfg.expandAll) {
            lib.$$el(".s_sectionlist,.s_sectionwrap", mainContentWin.document).forEach((el) => el.style.display = "block");
          }
          for (const job of lib.$$el(".s_point[itemtype]", mainContentWin.document)) {
            job.addEventListener("click", (e) => {
              const lock = StudyLock.getLock();
              if (e.isTrusted) {
                if (job.getAttribute("itemtype") === "exam") {
                  return lib.$message.info({
                    duration: 60,
                    content: "检测到您手动选择了作业/考试章节，将不会自动跳转，请完成后手动选择其他章节，脚本会自动学习。"
                  });
                } else {
                  lib.$message.info("检测到章节切换，即将自动学习...");
                }
              }
              setTimeout(() => {
                study2(lock);
              }, 3e3);
            });
          }
          const scrollToJob = () => {
            var _a2;
            return (_a2 = lib.$el(".s_pointerct", mainContentWin.document)) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth", block: "center" });
          };
          const study2 = async (studyLock) => {
            var _a2;
            const iframe = lib.$el("iframe", mainContentWin.document);
            const win = iframe == null ? void 0 : iframe.contentWindow;
            if (win) {
              const doc = win.document;
              if (iframe.src.includes("content_video.action") || iframe.src.includes("content_audio.action")) {
                $console.log("视频/音频播放中...");
                try {
                  const media = await waitForMedia({ root: doc });
                  state$3.study.currentMedia = media;
                  media.playbackRate = parseFloat(this.cfg.playbackRate.toString());
                  media.volume = this.cfg.volume;
                  media.currentTime = 0;
                  await new Promise((resolve, reject) => {
                    try {
                      win.jwplayer().onComplete(async () => {
                        $console.log("视频/音频播放完成。");
                        await $.sleep(3e3);
                        resolve();
                      });
                      media.addEventListener("pause", async () => {
                        if (!media.ended) {
                          await Promise.race([
                            waitForPopupQuestion(doc),
                            handleContinueDialog()
                          ]);
                          await $.sleep(1e3);
                          playMedia(() => media.play());
                        }
                      });
                      playMedia(() => media.play());
                    } catch (err) {
                      reject(err);
                    }
                  });
                } catch (err) {
                  lib.$message.error(String(err));
                }
              } else if (iframe.src.includes("content_doc.action")) {
                await $.sleep(5e3);
              }
            }
            $console.log(this.cfg.switchPeriod + " 秒后切换下一章节。");
            await $.sleep(this.cfg.switchPeriod * 1e3);
            if (studyLock.canStudy()) {
              let nextEl;
              let isBellowCurrentJob = false;
              const jobs = lib.$$el(".s_point[itemtype]", mainContentWin.document);
              for (let index = 0; index < jobs.length; index++) {
                const job = jobs[index];
                if (job.classList.contains("s_pointerct")) {
                  isBellowCurrentJob = true;
                } else if (isBellowCurrentJob) {
                  if (job.querySelector(".done_icon_show") === null || this.cfg.restudy) {
                    $console.log("下一章：", job.title || ((_a2 = lib.$el(".s_pointti", job)) == null ? void 0 : _a2.title) || "未知");
                    nextEl = job;
                    break;
                  }
                }
              }
              if (nextEl) {
                nextEl.click();
                scrollToJob();
              } else {
                lib.$modal.alert({ content: "全部任务已完成" });
                CommonProject.scripts.settings.methods.notificationBySetting("全部任务点已完成！", {
                  duration: 0,
                  extraTitle: "智慧职教学习脚本"
                });
              }
            }
          };
        }
      }),
      work: new lib.Script({
        name: "✍️ 作业考试脚本",
        matches: [["作业考试页面", "/exam"]],
        namespace: "icve.work",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
              "AI 将直接给出答案并由脚本自动填写。",
              "请手动进入作业考试页面才能使用自动答题。"
            ]).outerHTML
          }
        },
        async oncomplete() {
          lib.$message.warn({ content: "自动答题时请勿切换题目，否则可能导致重复请求或脚本卡住。", duration: 0 });
          const resetToBegin = () => {
            var _a;
            (_a = document.querySelectorAll(`.sheet_nums [id*="sheetSeq"]`).item(0)) == null ? void 0 : _a.click();
          };
          commonWork(this, {
            workerProvider: work,
            beforeRunning: async () => {
              resetToBegin();
              await $.sleep(1e3);
            },
            onRestart: () => resetToBegin()
          });
        }
      }),
      workDispatcher: new lib.Script({
        name: "作业调度脚本",
        matches: [
          ["作业进入页面", "/platformwebapi/student/exam/"],
          ["确认作业页面", "/student/exam/studentExam_studentInfo.action"]
        ],
        hideInPanel: true,
        oncomplete() {
          if (/\/platformwebapi\/student\/exam/.test(window.location.href)) {
            lib.cors.on("icve-work-start", () => {
              setTimeout(() => {
                lib.$gm.unsafeWindow.openExamInfo();
              }, 3e3);
            });
          }
          if (/\/student\/exam\/studentExam_studentInfo.action/.test(window.location.href)) {
            setTimeout(() => {
              lib.$gm.unsafeWindow.enterExamPage();
            }, 3e3);
          }
        }
      }),
      "ai-study": new lib.Script({
        name: "🖥️ AI课程",
        namespace: "icve.ai.study",
        matches: [
          ["课程页面", "ai.icve.com.cn/app/coursedetails-excellent"],
          ["学习页面", "ai.icve.com.cn/excellent-study"]
        ],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              [
                "如果脚本卡死或者您不想学习，",
                "可以点击其他任意章节继续进行学习。",
                "PPT请勿加快点击，否则可能无法记录学习进度。"
              ]
            ]).outerHTML
          },
          volume,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            options: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 6, 8, 16].map((rate) => [
              rate.toString(),
              rate + " x"
            ]),
            defaultValue: "1"
          },
          autoOpenAllChapter: {
            label: "自动打开全部章节",
            attrs: {
              title: "如果没有打开全部章节，那么当任务点达到当前章节最后一个时将无法跳转到其他章节列表！",
              type: "checkbox"
            },
            defaultValue: true
          },
          restudy
        },
        onhistorychange(type) {
          if (type !== "replace") {
            return;
          }
          if (location.href.includes("kcnr")) {
            location.reload();
          }
        },
        async oncomplete(type) {
          CommonProject.scripts.render.methods.pin(this);
          this.onConfigChange("volume", (val) => {
            if (state$3.study.currentMedia) {
              state$3.study.currentMedia.volume = parseFloat(val.toString());
            }
          });
          this.onConfigChange("playbackRate", (val) => {
            if (state$3.study.currentMedia) {
              state$3.study.currentMedia.playbackRate = parseFloat(val.toString());
            }
          });
          const waitForLoad2 = () => {
            return new Promise((resolve) => {
              const check = () => {
                if (document.querySelector(".contentBox")) {
                  resolve();
                } else {
                  setTimeout(check, 100);
                }
              };
              check();
            });
          };
          const closeStudyContinueDialog = () => {
            return new Promise((resolve) => {
              let stop = false;
              const check = () => {
                var _a, _b;
                if (document.querySelector(".el-message-box__wrapper")) {
                  (_a = lib.$el(".el-message-box__wrapper")) == null ? void 0 : _a.remove();
                  (_b = lib.$el(".v-modal")) == null ? void 0 : _b.remove();
                  resolve();
                } else {
                  !stop && setTimeout(check, 100);
                }
              };
              check();
              setTimeout(() => {
                stop = true;
                resolve();
              }, 3 * 1e3);
            });
          };
          await waitForLoad2();
          await closeStudyContinueDialog();
          await waitForLoad2();
          await $.sleep(3e3);
          $msg_and_log$1("info", "即将打开全部章节列表，请稍等");
          const openAllChapter = async () => {
            var _a;
            const model = lib.$modal.simple({
              maskCloseable: false,
              footer: void 0,
              content: "正在展开全部章节列表，请耐心等待不要操作..."
            });
            const titles = Array.from(document.querySelectorAll(".one-title")).filter(
              (el) => !el.querySelector(".zhankai")
            );
            const waitForChapterOpen = (title) => {
              return new Promise((resolve) => {
                let stop = false;
                const check = () => {
                  var _a2;
                  const parent = (_a2 = title.parentElement) == null ? void 0 : _a2.parentElement;
                  const content = parent == null ? void 0 : parent.querySelector(".panel-content");
                  if ((content == null ? void 0 : content.style.display) !== "none" && ((content == null ? void 0 : content.querySelectorAll(".node").length) || 0) > 0) {
                    resolve();
                  } else {
                    !stop && setTimeout(check, 100);
                  }
                };
                check();
                setTimeout(() => {
                  stop = true;
                  resolve();
                }, 10 * 1e3);
              });
            };
            for (const title of titles) {
              try {
                (_a = title.querySelector(".jiantou")) == null ? void 0 : _a.click();
                title.focus();
                title.scrollIntoView({ behavior: "smooth", block: "center" });
                await waitForChapterOpen(title);
                await $.sleep(1e3);
              } catch (e) {
                $console.error("打开章节失败", e);
              }
            }
            model == null ? void 0 : model.remove();
          };
          if (this.cfg.autoOpenAllChapter)
            await openAllChapter();
          let study_id = "";
          document.querySelectorAll(".node").forEach((el) => {
            el.addEventListener("click", () => {
              study2(study_id = Math.random().toString(36).substr(2, 9));
            });
          });
          const study2 = async (id) => {
            var _a;
            $msg_and_log$1("info", "即将开始学习：" + (((_a = lib.$el(".contentBox")) == null ? void 0 : _a.__vue__.nrdata.name) || "未知任务点"));
            await $.sleep(3e3);
            await (async () => {
              var _a2;
              const active = document.querySelector(".panelList .node.active");
              active == null ? void 0 : active.focus();
              active == null ? void 0 : active.scrollIntoView({ behavior: "smooth", block: "center" });
              if ((active == null ? void 0 : active.querySelector(".wc")) && !this.cfg.restudy) {
                return $msg_and_log$1("info", "当前任务已完成，即将跳过");
              }
              const vue = (_a2 = lib.$el(".FilePreview")) == null ? void 0 : _a2.__vue__;
              const img = lib.$el(".ql-editor");
              const work2 = lib.$el(".shiti");
              if (work2) {
                return $msg_and_log$1("warn", "检测到当前为作业任务，请完成课程后手动进入自动答题。");
              } else if (img) {
                return $msg_and_log$1("warn", "检测到当前为图片任务，即将跳过");
              } else {
                if (!vue) {
                  return lib.$message.error({ content: "获取课程数据失败，或者未知任务点，即将跳过" });
                }
                const watchOffice = async () => {
                  const total = vue.photoList.length;
                  for (let index = 0; index < total + 1; index++) {
                    if (id !== study_id)
                      return;
                    vue.next();
                    await $.sleep(3e3);
                  }
                };
                lib.$message.info("开始学习");
                if (["video", "audio"].includes(vue.curType)) {
                  await closeStudyContinueDialog();
                  await watchMedia$2();
                } else if (["office", "ppt"].includes(vue.curType)) {
                  await watchOffice();
                  if (id !== study_id)
                    return;
                  await $.sleep(1e3);
                } else {
                  $msg_and_log$1("warn", "未知的任务点，即将跳过");
                }
              }
            })();
            if (id !== study_id)
              return;
            const next2 = getNext();
            if (!next2) {
              return $msg_and_log$1("warn", "没有找到下一章节！");
            }
            $msg_and_log$1("info", "即将进入下一章节");
            await $.sleep(3e3);
            if (id !== study_id)
              return;
            next2.click();
          };
          const getNext = () => {
            const list = Array.from(document.querySelectorAll(".panelList .node"));
            for (let index = 0; index < list.length; index++) {
              const element = list[index];
              if (element.classList.contains("active")) {
                return list[index + 1];
              }
            }
          };
          study2(study_id);
        }
      }),
      "ai-work": new lib.Script({
        name: "✍️ AI作业",
        namespace: "icve.ai.work",
        matches: [["作业页面", "ai.icve.com.cn/preview-exam"]],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
              "AI 将直接给出答案并由脚本自动填写。",
              "请手动进入作业考试页面才能使用自动答题。",
              "自动答题时请勿切换题目，否则可能导致重复请求或脚本卡住！"
            ]).outerHTML
          }
        },
        oncomplete() {
          lib.$message.warn({ content: "自动答题时请勿切换题目，否则可能导致重复请求或脚本卡住。", duration: 0 });
          const resetToBegin = () => {
            var _a;
            (_a = document.querySelectorAll(`.list-box span`).item(0)) == null ? void 0 : _a.click();
          };
          commonWork(this, {
            workerProvider: aiWork,
            beforeRunning: async () => {
              resetToBegin();
              await $.sleep(1e3);
            },
            onRestart: () => resetToBegin()
          });
        }
      })
    }
  });
  async function watchMedia$2() {
    const media = await waitForMedia();
    media.volume = parseFloat(IcveMoocProject.scripts["ai-study"].cfg.volume.toString());
    media.playbackRate = parseFloat(IcveMoocProject.scripts["ai-study"].cfg.playbackRate.toString());
    state$3.study.currentMedia = media;
    const success = await playMedia(() => media.play());
    if (!success) {
      return;
    }
    return new Promise((resolve, reject) => {
      media.addEventListener("ended", () => {
        resolve();
      });
      media.addEventListener("pause", () => {
        setTimeout(() => {
          if (media.ended) {
            resolve();
          } else if (media.paused) {
            media.play();
            media.volume = parseFloat(IcveMoocProject.scripts["ai-study"].cfg.volume.toString());
            media.playbackRate = parseFloat(IcveMoocProject.scripts["ai-study"].cfg.playbackRate.toString());
          }
        }, 1e3);
      });
    });
  }
  function work({ period, thread, answerSeparators }) {
    lib.$message.info("开始作业");
    CommonProject.scripts.workResults.methods.init();
    console.log({ period, thread });
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => {
        var _a, _b;
        if (t2) {
          const title = t2.cloneNode(true);
          (_a = title.querySelector('[name*="questionIndex"]')) == null ? void 0 : _a.remove();
          (_b = title.querySelector(".q_score")) == null ? void 0 : _b.remove();
          title.querySelectorAll(".fillblank_input, input[type='text'], input:not([type])").forEach((blank) => {
            const marker = blank.ownerDocument.createElement("span");
            marker.textContent = "____";
            blank.replaceWith(marker);
          });
          return title.innerText.trim().replace(/^、/, "") || "";
        }
        return "";
      }).join(",");
    };
    const workResults = [];
    let totalQuestionCount = 0;
    let requestedCount = 0;
    let resolvedCount = 0;
    function getType(options) {
      const radio_len = options.map((o) => o.querySelector('[type="radio"]')).reduce((a, b) => {
        return a + (b ? 1 : 0);
      }, 0);
      return radio_len > 0 ? radio_len === 2 ? "judgement" : "single" : options.some((o) => o.querySelector('[type="checkbox"]')) ? "multiple" : options.some((o) => o.querySelector("textarea")) ? "completion" : options.some((o) => o.querySelector(".fillblank_input input")) ? "fill-blank" : void 0;
    }
    const worker = new OCSWorker({
      root: ".q_content",
      elements: {
        title: '.divQuestionTitle, [name="fillblankTitle"]',
        options: ".questionOptions .q_option, .questionOptions.divTextarea, .answerOption"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await $.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: getType(ctx.elements.options) || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              blankCount: ctx.root.querySelectorAll(".fillblank_input input").length,
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      async work(ctx) {
        const options = ctx.elements.options;
        const type = getType(options);
        if (!type) {
          throw new Error("无法获取题目类型！");
        }
        if (type === "fill-blank") {
          const inputs = Array.from(ctx.root.querySelectorAll(".fillblank_input input"));
          for (const searchInfo of ctx.searchInfos) {
            for (const result of searchInfo.results) {
              const answers = splitAnswer(result.answer);
              if (!answers.length || !inputs.length) continue;
              const count = Math.min(answers.length, inputs.length);
              for (let index = 0; index < count; index++) {
                inputs[index].value = answers[index];
                dispatchAnswerInput(inputs[index]);
              }
              if (answers.length >= inputs.length) return { finish: true };
            }
          }
        } else {
          const resolver = createDefaultQuestionResolver(ctx)[type];
          const res = await resolver(ctx.searchInfos, ctx.elements.options, (type2, answer, option) => {
            var _a, _b;
            if (type2 === "judgement" || type2 === "single" || type2 === "multiple") {
              if (option.querySelector(".checkbox_on") === null) {
                (_a = lib.$el("div", option)) == null ? void 0 : _a.click();
              }
            } else if (type2 === "completion" && answer.trim()) {
              const text = option.querySelector("textarea");
              const textIframe = option.querySelector('iframe[id*="ueditor"]');
              if (text) {
                text.value = answer;
                dispatchAnswerInput(text);
              }
              if (textIframe) {
                const view = (_b = textIframe.contentWindow) == null ? void 0 : _b.document.querySelector("body.view > p");
                if (view) {
                  view.innerText = answer;
                  dispatchAnswerInput(view);
                }
              }
            }
          });
          return res;
        }
        return { finish: false };
      },
      onElementSearched(elements2, root2) {
        console.log("elements", elements2);
      },
      onResultsUpdate(currentResult) {
        var _a;
        if (currentResult.resolved) {
          workResults.push(...simplifyWorkResult([currentResult], titleTransform));
          CommonProject.scripts.workResults.methods.setResults(workResults);
          totalQuestionCount++;
          requestedCount++;
          if (currentResult.result && currentResult.result.finish === true) resolvedCount++;
          if ((_a = currentResult.result) == null ? void 0 : _a.finish) {
            CommonProject.scripts.apps.methods.recordAIResult(
              simplifyWorkResult([currentResult], titleTransform)
            );
          }
          CommonProject.scripts.workResults.methods.updateWorkState({
            totalQuestionCount,
            requestedCount,
            resolvedCount
          });
        }
      }
    });
    const getNextBtn = () => document.querySelector(".paging_next");
    let next2 = getNextBtn();
    (async () => {
      const allResults = [];
      while (worker.isClose === false) {
        allResults.push(await worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }));
        await $.sleep(1e3);
        next2 = getNextBtn();
        if (!next2 || !isVisibleAction(next2)) {
          break;
        } else {
          next2.click();
          await $.sleep(1e3);
        }
      }
      await autoSubmitAssessment(worker, allResults);
      worker.emit("done");
      CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "icve";
    })();
    return worker;
  }
  function aiWork({ period, thread, answerSeparators }) {
    lib.$message.info("开始作业");
    CommonProject.scripts.workResults.methods.init();
    console.log({ period, thread });
    const titleTransform = (titles) => {
      return titles.filter((t2) => (t2 == null ? void 0 : t2.innerText) || (t2 == null ? void 0 : t2.querySelector("img"))).map((t2) => {
        if (t2) {
          const el = optimizationElementWithImage(t2, true);
          return (el.textContent || "").replace(/\s+/g, " ").trim() || "";
        }
        return "";
      }).join(",");
    };
    const workResults = [];
    let totalQuestionCount = 0;
    let requestedCount = 0;
    let resolvedCount = 0;
    function getType(options) {
      const radio_len = options.map((o) => o.querySelector('[type="radio"]')).reduce((a, b) => {
        return a + (b ? 1 : 0);
      }, 0);
      return radio_len > 0 ? radio_len === 2 ? "judgement" : "single" : options.some((o) => o.querySelector('[type="checkbox"]')) ? "multiple" : options.some((o) => o.querySelector("textarea")) || options.some((o) => o.classList.contains("ivu-input")) ? "completion" : options.some((o) => o.querySelector(".fillblank_input input")) ? "fill-blank" : void 0;
    }
    const worker = new OCSWorker({
      root: ".content-item",
      elements: {
        title: ".questions-content [class*=title-content]",
        options: "label[class*=group-item],.ivu-input-wrapper input"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await $.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: getType(ctx.elements.options) || "unknown",
              title,
              options: ctx.elements.options.map((o) => optimizationElementWithImage(o, true).innerText || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type: (ctx) => {
          return getType(ctx.elements.options);
        },
        async handler(type, answer, option, ctx) {
          if (type === "judgement" || type === "single" || type === "multiple") {
            if (option.querySelector(".ivu-radio-checked") === null) {
              option == null ? void 0 : option.click();
            }
          } else if (type === "completion" && answer.trim()) {
            if (option.tagName === "INPUT") {
              option.focus();
              await $.sleep(100);
              option.value = answer.trim();
              await $.sleep(100);
              option.dispatchEvent(new Event("input", { bubbles: true }));
              await $.sleep(100);
              option.blur();
              await $.sleep(100);
            }
          }
        }
      },
      onElementSearched(elements2, root2) {
        var _a;
        console.log("elements", elements2);
        (_a = elements2.options) == null ? void 0 : _a.forEach((option) => optimizationElementWithImage(option));
      },
      onResultsUpdate(currentResult) {
        var _a;
        if (currentResult.resolved) {
          workResults.push(...simplifyWorkResult([currentResult], titleTransform));
          CommonProject.scripts.workResults.methods.setResults(workResults);
          totalQuestionCount++;
          requestedCount++;
          if (currentResult.result && currentResult.result.finish === true) resolvedCount++;
          if ((_a = currentResult.result) == null ? void 0 : _a.finish) {
            CommonProject.scripts.apps.methods.recordAIResult(
              simplifyWorkResult([currentResult], titleTransform)
            );
          }
          CommonProject.scripts.workResults.methods.updateWorkState({
            totalQuestionCount,
            requestedCount,
            resolvedCount
          });
        }
      }
    });
    const getNextBtn = () => document.querySelector("div.center_btn > button:nth-child(2)");
    let next2 = getNextBtn();
    (async () => {
      const allResults = [];
      while (worker.isClose === false) {
        allResults.push(await worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }));
        await $.sleep(1e3);
        next2 = getNextBtn();
        if (!next2 || !isVisibleAction(next2)) {
          break;
        } else {
          next2.click();
          await $.sleep(1e3);
        }
      }
      await autoSubmitAssessment(worker, allResults);
      worker.emit("done");
      CommonProject.scripts.workResults.cfg.questionPositionSyncHandlerType = "icve";
    })();
    return worker;
  }
  function waitForPopupQuestion(dom2) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        var _a, _b;
        const el = lib.$el(".popup-test", dom2);
        if (el) {
          clearInterval(interval);
          const right_answer = ((_a = lib.$el("#right_answer", el)) == null ? void 0 : _a.value) || "A";
          for (const answer of right_answer.split("")) {
            const item = lib.$el(`li.test-item-cell[curval="${answer}"]`, el);
            item == null ? void 0 : item.click();
          }
          (_b = lib.$el('[name="save_btn"]', el)) == null ? void 0 : _b.click();
          setTimeout(() => {
            var _a2;
            (_a2 = lib.$el('[name="continue_btn"]', el)) == null ? void 0 : _a2.click();
            resolve();
          }, 3e3);
        }
      }, 1e3);
      setTimeout(() => {
        clearInterval(interval);
        resolve();
        console.log("未找到弹窗，继续执行");
      }, 60 * 1e3);
    });
  }
  function handleContinueDialog() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const el = document.querySelector(".layui-layer-btn0");
        if (el) {
          el.click();
          setTimeout(() => {
            clearInterval(interval);
            resolve();
          }, 1e3);
        }
      }, 3e3);
      setTimeout(() => {
        clearInterval(interval);
        resolve();
        console.log("未找到弹窗，继续执行");
      }, 60 * 1e3);
    });
  }
  const state$2 = {
    studying: false,
    studyingId: "",
    media: null
  };
  const work_pages = [
    ["资源库keep作业页面", "study/spockeepTest"],
    ["资源库job作业页面", "study/spocjobTest"],
    ["资源库考试", "study/spoctest"],
    ["课堂测试作业界面", "study/courseteaching/test/homeWork"],
    ["作业页面", "icve-study/coursePreview/jobTes"],
    ["考试页面", "icve-study/coursePreview/test"],
    ["考试页面", "icve-study/test"],
    ["资源库测验页面", "icve-study/coursePreview/keepTest"]
  ];
  const isWork = () => {
    return window.location.href.includes("icve-study/coursePreview/jobTes") || window.location.href.includes("icve-study/coursePreview/keepTest") || window.location.href.includes("study/spockeepTest") || window.location.href.includes("study/spocjobTest") || window.location.href.includes("study/courseteaching/test/homeWork");
  };
  const isExam = () => {
    return window.location.href.includes("icve-study/coursePreview/test") || window.location.href.includes("icve-study/test") || window.location.href.includes("study/spoctest");
  };
  const ZJYProject = lib.Project.create({
    name: "职教云",
    domains: ["icve.com.cn", "zjy2.icve.com.cn", "zyk.icve.com.cn"],
    scripts: {
      guide: new lib.Script({
        name: "🖥️ 使用提示",
        matches: [
          ["学习页面", "zjy2.icve.com.cn/study"],
          ["资源库", "zyk.icve.com.cn/icve-study/"]
        ],
        namespace: "zjy.study.guide",
        configs: {
          notes: {
            defaultValue: "请点击任意章节，进入学习。"
          }
        }
      }),
      v2: new lib.Script({
        name: "旧版切换器",
        matches: [["新版智慧职教", "zjy2.icve.com.cn/study/v2/"]],
        hideInPanel: true,
        oncomplete() {
          $msg.info("脚本只支持旧版职教云，即将跳转到旧版职教云页面...");
          lib.$modal.alert({
            title: "提示",
            content: "脚本只支持旧版职教云，即将跳转到<b>旧版</b>职教云页面...",
            maskCloseable: false
          });
          setTimeout(() => {
            location.href = "/study/index";
          }, 5e3);
        }
      }),
      dispatcher: new lib.Script({
        name: "调度器",
        matches: [
          ["学习页面", "zjy2.icve.com.cn/study"],
          ["资源库", "zyk.icve.com.cn/icve-study/"],
          ["内容资源页面", "zjy2.icve.com.cn/study/studentFast/classroomNow"],
          ["在线课堂学习页面", "zjy2.icve.com.cn/study/studentFast/courseware"],
          ["课堂作业测试界面", "zjy2.icve.com.cn/study/courseteaching/test/homeWork"]
        ],
        hideInPanel: true,
        methods() {
          return {
            dispatch: async () => {
              var _a, _b, _c;
              if (["zjy2.icve.com.cn/study/studentFast/classroomNow"].some((i) => window.location.href.includes(i))) {
                await waitForElement(".classroom_activities .active_list");
                const courseData = getCourseDataInClassroomNowPage();
                console.log(courseData);
                const courseId = ((_c = (_b = (_a = document.querySelector(".teacherLayout")) == null ? void 0 : _a.__vue__) == null ? void 0 : _b.courseInfo) == null ? void 0 : _c.id) || "";
                if (!courseData || !courseId) {
                  return;
                }
                ZJYProject.scripts.study.cfg.currentCourseId = courseId;
                ZJYProject.scripts.study.cfg.courseList = courseData;
                lib.$message.success("课程数据获取成功，请点击课程章节开始学习");
              } else if ([
                "zyk.icve.com.cn/icve-study/coursePreview/courseware",
                "zjy2.icve.com.cn/study/coursePreview/spoccourseIndex/courseware",
                "zjy2.icve.com.cn/study/studentFast/courseware"
              ].some((i) => window.location.href.includes(i))) {
                const isClassroomNowStudy = location.href.includes("zjy2.icve.com.cn/study/studentFast/courseware");
                ZJYProject.scripts.study.methods.main(isClassroomNowStudy ? "classroomNow" : "normal");
              } else if (work_pages.map(([_, p]) => p).some((i) => window.location.href.includes(i))) {
                ZJYProject.scripts.work.methods.main();
              }
            }
          };
        },
        onhistorychange(type) {
          if (type === "push") {
            this.methods.dispatch();
          }
        },
        oncomplete() {
          this.methods.dispatch();
        }
      }),
      study: new lib.Script({
        matches: [
          ["学习页面", "zjy2.icve.com.cn/study/coursePreview/spoccourseIndex/courseware"],
          ["在线课堂学习页面", "zjy2.icve.com.cn/studentFast/courseware"],
          ["资源库学习页面", "zyk.icve.com.cn/icve-study/coursePreview/courseware"]
        ],
        name: "✍️ 课程学习",
        namespace: "zjy.study.main",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              ["如果脚本卡死或者您不想学习，", "可以点击其他任意章节继续进行学习。"],
              "提示：职教云无法使用倍速。"
            ]).outerHTML
          },
          volume,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            options: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 6, 8].map((rate) => [
              rate.toString(),
              rate + " x"
            ]),
            defaultValue: "1"
          },
          pptReadPeriod: {
            label: "PPT 阅读每页停留时间（秒）",
            defaultValue: 1,
            attrs: { type: "number", min: 1, step: 1, max: 10 }
          },
          currentCourseId: {
            defaultValue: ""
          },
          courseList: {
            defaultValue: []
          }
        },
        methods() {
          return {
            main: async (type) => {
              var _a;
              const id = new URL(window.location.href).searchParams.get(type === "classroomNow" ? "activityId" : "id");
              if (!id) {
                return;
              }
              if (state$2.studying && id === state$2.studyingId) {
                return;
              }
              state$2.studyingId = id;
              state$2.studying = true;
              CommonProject.scripts.render.methods.pin(this);
              this.onConfigChange("volume", (val) => {
                if (state$2.media) {
                  state$2.media.volume = parseFloat(val.toString());
                }
              });
              this.onConfigChange("playbackRate", (val) => {
                if (state$2.media) {
                  state$2.media.playbackRate = parseFloat(val.toString());
                }
              });
              await waitForLoad();
              setTimeout(() => {
                var _a2, _b;
                (_a2 = lib.$el(".el-message-box__wrapper")) == null ? void 0 : _a2.remove();
                (_b = lib.$el(".v-modal")) == null ? void 0 : _b.remove();
              }, 3e3);
              await waitForLoad();
              if (type === "normal") {
                const courseId = getUniqueCourseId();
                if (!courseId) {
                  lib.$message.error({ content: "获取课程数据失败，请手动刷新页面" });
                  return;
                }
                const not_same_class = !ZJYProject.scripts.study.cfg.currentCourseId || ZJYProject.scripts.study.cfg.currentCourseId !== courseId;
                if (not_same_class || !ZJYProject.scripts.study.cfg.courseList || ZJYProject.scripts.study.cfg.courseList.length === 0) {
                  const courseData = await getCourseData();
                  if (!courseData) {
                    return;
                  }
                  ZJYProject.scripts.study.cfg.currentCourseId = courseId;
                  ZJYProject.scripts.study.cfg.courseList = courseData;
                }
              }
              const courseInfo = ZJYProject.scripts.study.cfg.courseList.find((i) => i.id === id);
              if (!courseInfo) {
                const btn = lib.h("button", { className: "base-style-button" }, "修复数据");
                btn.onclick = async () => {
                  const courseId = getUniqueCourseId();
                  if (!courseId) {
                    lib.$message.error({ content: "获取课程数据失败！" });
                    return;
                  }
                  const courseData = await getCourseData();
                  if (!courseData) {
                    return;
                  }
                  ZJYProject.scripts.study.cfg.currentCourseId = courseId;
                  ZJYProject.scripts.study.cfg.courseList = courseData;
                  lib.$modal.simple({
                    title: "提示",
                    content: "数据已修复完毕，请刷新页面重新尝试运行。"
                  });
                };
                const err = "获取课程信息失败，请手动刷新页面，或者尝试修复数据：";
                lib.$message.error({ content: lib.h("span", [err, btn]), duration: 0 });
                $console.error(err);
                return;
              }
              const vue = getVueBindElement();
              const courseType = vue.curType === "video" ? "video" : (courseInfo == null ? void 0 : courseInfo.fileType) || "";
              const started_url = window.location.href;
              let msg2 = "开始学习：" + courseType + "-" + courseInfo.name;
              lib.$message.success(msg2);
              $console.info(msg2);
              if (["ppt", "doc", "pptx", "docx", "pdf", "txt", "ppt文档", "xls", "xlsx"].some((i) => courseType === i)) {
                await watchFile(this.cfg.pptReadPeriod);
              } else if (["video", "audio", "mp4", "mp3", "flv", "wav", "视频"].some((i) => courseType === i)) {
                const text = ((_a = lib.$el(".guide")) == null ? void 0 : _a.textContent) || "";
                msg2 = `任务点 ${courseInfo.name}，不支持播放。`;
                if (text.includes("很抱歉，您的浏览器不支持播放此类文件") || text.includes("此视频暂无法播放")) {
                  msg2 = `任务点 ${courseInfo.name}，不支持播放。`;
                  lib.$message.error(msg2);
                  $console.error(msg2);
                } else {
                  await watchMedia$1();
                }
              } else if (["png", "jpg", "图片"].some((i) => courseType === i)) {
                msg2 = `已查看图片任务点 ${courseInfo.name}，即将跳过。`;
                lib.$message.info(msg2);
                $console.info(msg2);
              } else {
                msg2 = `未知的任务点 ${courseInfo.name}，类型 ${courseType}，请跟作者进行反馈。`;
                lib.$message.error(msg2);
                $console.error(msg2);
              }
              if (started_url === window.location.href) {
                msg2 = "任务点结束，五秒后下一章";
                lib.$message.warn("如果职教云一直卡在显示：“资源类型无法学习，请核对数据！” 请手动切换下一章。");
                lib.$message.info(msg2);
                $console.info(msg2);
                await $.sleep(5e3);
                await next(type);
              }
            }
          };
        }
      }),
      work: new lib.Script({
        matches: work_pages,
        name: "✍️ 作业考试脚本",
        namespace: "zjy.work.main",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
              "AI 将直接给出答案并由脚本自动填写。",
              "请手动进入作业考试页面才能使用自动答题。"
            ]).outerHTML
          }
        },
        methods() {
          return {
            main: async () => {
              if (isWork() || isExam()) {
                await waitForQuestions();
                commonWork(this, {
                  workerProvider: (opt) => workOrExam(isWork() ? "work" : "exam", opt)
                });
              }
            }
          };
        }
      })
    }
  });
  async function watchMedia$1() {
    const media = await waitForMedia();
    media.volume = parseFloat(ZJYProject.scripts.study.cfg.volume.toString());
    media.playbackRate = parseFloat(ZJYProject.scripts.study.cfg.playbackRate.toString());
    state$2.media = media;
    const success = await playMedia(() => media.play());
    if (!success) {
      return;
    }
    return new Promise((resolve, reject) => {
      media.addEventListener("ended", () => {
        resolve();
      });
      media.addEventListener("pause", () => {
        setTimeout(() => {
          if (media.ended) {
            resolve();
          } else if (media.paused) {
            media.play();
            media.volume = parseFloat(ZJYProject.scripts.study.cfg.volume.toString());
            media.playbackRate = parseFloat(ZJYProject.scripts.study.cfg.playbackRate.toString());
          }
        }, 1e3);
      });
    });
  }
  async function watchFile(pptReadPeriod) {
    var _a, _b;
    const vue = getPPTVueBindElement();
    if (!vue) {
      return;
    }
    while (true) {
      const [current, total] = ((_b = (_a = document.querySelector(".preview .page")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim().replace("上一页", "").replace("下一页", "").split("/").map((i) => parseInt(i.trim()))) || [];
      if (!current || !total) {
        break;
      }
      if (current >= total) {
        break;
      }
      try {
        vue.next && vue.next();
      } catch {
      }
      try {
        vue.skip && vue.skip();
      } catch {
      }
      await $.sleep(pptReadPeriod * 1e3);
    }
  }
  function getUniqueCourseId() {
    var _a, _b, _c, _d;
    return ((_d = (_c = (_b = (_a = document.querySelector(".coursePreviewIndex")) == null ? void 0 : _a.__vue__) == null ? void 0 : _b.list) == null ? void 0 : _c[0]) == null ? void 0 : _d.courseId) || "";
  }
  function isZyk() {
    return location.href.includes("zyk.icve.com.cn");
  }
  function getVueBindElement() {
    var _a, _b;
    return ((_a = lib.$el(".guide")) == null ? void 0 : _a.__vue__) || ((_b = lib.$el(".teach")) == null ? void 0 : _b.__vue__);
  }
  function getPPTVueBindElement() {
    var _a, _b, _c;
    return ((_a = lib.$el(".FilePreview")) == null ? void 0 : _a.__vue__) || ((_b = lib.$el(".guide")) == null ? void 0 : _b.__vue__) || ((_c = lib.$el(".teach")) == null ? void 0 : _c.__vue__);
  }
  async function next(type) {
    var _a;
    const field = type === "classroomNow" ? "activityId" : "id";
    const id = new URL(window.location.href).searchParams.get(field);
    let nextObject;
    const data = ZJYProject.scripts.study.cfg.courseList;
    const start_index = data.findIndex((i) => i.id === id);
    for (let index = start_index + 1; index < data.length; index++) {
      const item = data[index];
      if (["测验", "讨论"].some((i) => item.fileType === i)) {
        continue;
      }
      nextObject = item;
      break;
    }
    if (id && nextObject) {
      const vue = getVueBindElement();
      if (((_a = vue == null ? void 0 : vue.nextObj) == null ? void 0 : _a.id) && nextObject.id === vue.nextObj.id) {
        vue.preNext(vue.nextObj);
        return;
      }
      await $.sleep(3e3);
      const url = new URL(window.location.href);
      if (nextObject.courseDesignId) {
        url.searchParams.set("courseDesignId", nextObject.courseDesignId);
      }
      url.searchParams.set(field, nextObject.id);
      window.location.replace(url.href);
    } else {
      lib.$message.success({
        duration: 0,
        content: "全部任务已完成。"
      });
      $console.info("全部任务已完成。");
      CommonProject.scripts.settings.methods.notificationBySetting("全部任务点已完成！", {
        duration: 0,
        extraTitle: "职教云学习脚本"
      });
      state$2.studying = false;
    }
  }
  function getCourseDataInClassroomNowPage() {
    var _a, _b, _c;
    const list = ((_b = (_a = document.querySelector(".classroom_activities")) == null ? void 0 : _a.__vue__) == null ? void 0 : _b.activeList) || [];
    const data = [];
    const temp = JSON.parse(JSON.stringify(list));
    while (temp.length > 0) {
      const item = temp.shift();
      if (((_c = item == null ? void 0 : item.children) == null ? void 0 : _c.length) > 0) {
        temp.unshift(...item.children);
      } else {
        data.push({
          name: item.title,
          id: item.activityId,
          fileType: item.fileType,
          courseDesignId: item.courseDesignId,
          levelName: item.levelName || ""
        });
      }
    }
    return data;
  }
  async function getCourseData() {
    var _a;
    const getDataList = () => {
      var _a2, _b, _c;
      const list = ((_b = (_a2 = document.querySelector(".coursePreviewIndex")) == null ? void 0 : _a2.__vue__) == null ? void 0 : _b.list) || [];
      const data = [];
      const temp = JSON.parse(JSON.stringify(list));
      while (temp.length > 0) {
        const item = temp.shift();
        if (((_c = item == null ? void 0 : item.children) == null ? void 0 : _c.length) > 0) {
          temp.unshift(...item.children);
        } else {
          data.push({
            name: item.name,
            id: item.id,
            fileType: item.fileType,
            levelName: item.levelName || "",
            courseDesignId: item.courseDesignId || ""
          });
        }
      }
      return data;
    };
    if (isZyk() === false) {
      const progress = lib.h("div");
      const modal_content = lib.h("div", [
        lib.h("div", { className: "notes card" }, [
          lib.$ui.notes([
            "职教云由于大章节之间无自动下一节按钮，需要在课程开始前",
            "由程序读取全部章节数据，这样才能自动运行",
            "数据只需读取一遍即可，后续无需重新读取"
          ])
        ]),
        progress
      ]);
      let force_pause = false;
      const modal2 = lib.$modal.confirm({
        content: modal_content,
        maskCloseable: false,
        title: "正在获取课程数据中，请勿操作...",
        confirmButton: null,
        cancelButtonText: "强制暂停",
        onCancel() {
          force_pause = true;
        }
      });
      const kejianListEl = document.querySelector(".kejianList");
      if (!kejianListEl) {
        lib.$message.error({ content: "获取课程数据失败，请手动刷新页面" });
        return void 0;
      }
      if (kejianListEl.style.display === "none") {
        (_a = Array.from(document.querySelectorAll(".courseBtn div.customBtn")).find((el) => {
          var _a2;
          return (_a2 = el.textContent) == null ? void 0 : _a2.includes("课件目录");
        })) == null ? void 0 : _a.click();
        await $.sleep(1e3);
      }
      const folders = [];
      while (true) {
        const itemsElList = Array.from(document.querySelectorAll(".items"));
        const unsaved = itemsElList.find((item) => folders.includes(item) === false);
        if (!unsaved) {
          break;
        }
        const list = getDataList();
        const course_info = list.find(
          (item) => {
            var _a2;
            return `${item.levelName || ""}${item.name}`.replace(/\s/g, "") === (((_a2 = unsaved.textContent) == null ? void 0 : _a2.trim().replace(/\s/g, "")) || "");
          }
        );
        if (!course_info || ["父节点", "子节点"].includes(course_info.fileType) === false) {
          folders.push(unsaved);
          continue;
        }
        if (force_pause) {
          const err = "已强制暂停，请手动刷新页面后才能重新运行";
          lib.$message.error({ content: err, duration: 0 });
          lib.$modal.alert({ content: err });
          return void 0;
        }
        folders.push(unsaved);
        if (modal2) {
          progress.innerHTML = "<br><b>当前已获取 " + document.querySelectorAll(".fIteml,.iChild").length + " 个小节</b>";
        }
        unsaved.click();
        await $.sleep(1e3);
      }
      modal2 == null ? void 0 : modal2.remove();
    }
    return getDataList();
  }
  function waitForLoad() {
    return waitForElement(() => getVueBindElement());
  }
  async function waitForQuestions() {
    return waitForElement(
      [
        ".subjectList",
        ".subjectListTest"
      ].join(",")
    );
  }
  function workOrExam(type, { period, thread, answerSeparators }) {
    lib.$message.info({ content: "开始作业" });
    CommonProject.scripts.workResults.methods.init({
      questionPositionSyncHandlerType: "zjy"
    });
    const titleTransform = (titles) => {
      return titles.filter((t2) => t2 == null ? void 0 : t2.innerText).map((t2) => t2 == null ? void 0 : t2.innerText).join(",");
    };
    const worker = new OCSWorker({
      root: ".subjectDet",
      elements: {
        title: type === "work" ? "h2,h3,h4,h5,h6" : ".titleTest span:not(.xvhao)",
        options: ".optionList div , .tkInput .el-input, .tkInput .el-textarea"
      },
      thread: thread != null ? thread : 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await $.sleep((period != null ? period : 3) * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => o.innerText || o.textContent || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        type(ctx) {
          const options = ctx.elements.options;
          const radio_len = options.map((o) => o.querySelector('[type="radio"]')).reduce((a, b) => {
            return a + (b ? 1 : 0);
          }, 0);
          return radio_len > 0 ? radio_len === 2 ? "judgement" : "single" : options.some((o) => o.querySelector('[type="checkbox"]')) ? "multiple" : options.some((o) => o.querySelector('[type="text"]')) || options.some((o) => o.querySelector("textarea")) ? "completion" : void 0;
        },
        handler(type2, answer, option, ctx) {
          var _a, _b;
          if (type2 === "judgement" || type2 === "single" || type2 === "multiple") {
            if (((_a = option.querySelector("input")) == null ? void 0 : _a.checked) !== true) {
              (_b = option.querySelector("label")) == null ? void 0 : _b.click();
            }
          } else if (type2 === "completion" && answer.trim()) {
            const text = option.querySelector('input[type="text"]');
            const textarea = option.querySelector("textarea");
            if (text) {
              text.value = answer;
              text.dispatchEvent(new Event("input", { bubbles: true }));
            } else if (textarea) {
              textarea.value = answer;
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
        }
      },
      onResultsUpdate(curr, _, res) {
        var _a;
        CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, titleTransform));
        if ((_a = curr.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(simplifyWorkResult([curr], titleTransform));
        }
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
      }
    });
    worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }).then(async (results) => {
      await autoSubmitAssessment(worker, results);
      worker.emit("done");
    }).catch((err) => {
      lib.$message.error({ content: `作业/考试失败: ${err}`, duration: 0 });
    });
    return worker;
  }
  const $msg_and_log = (type, msg2) => {
    lib.$message[type](msg2);
    $console[type](msg2);
  };
  const state$1 = {
    currentMedia: void 0,
    currentUrlHash: "",
    currentRunningScriptName: "",
    current_job_id: ""
  };
  const ICourseProject = lib.Project.create({
    name: "中国大学MOOC",
    domains: ["icourse163.org"],
    scripts: {
      dispatcher: new lib.Script({
        name: "调度器",
        hideInPanel: true,
        matches: [["所有页面", "icourse163.org"]],
        oncomplete() {
          ocsSingletonInterval("icourse.dispatcher", () => {
            var _a, _b;
            const hash = new URL(window.location.href).hash;
            if (state$1.currentUrlHash !== hash) {
              state$1.currentRunningScriptName = "";
            }
            state$1.currentUrlHash = hash;
            for (const key in ICourseProject.scripts) {
              if (Object.prototype.hasOwnProperty.call(ICourseProject.scripts, key)) {
                const script2 = ICourseProject.scripts[key];
                const runAtHash = Array.isArray(script2.cfg.runAtHash) ? script2.cfg.runAtHash : [script2.cfg.runAtHash];
                if (runAtHash.length && runAtHash.some((h2) => state$1.currentUrlHash.includes(h2))) {
                  if (state$1.currentRunningScriptName !== script2.name) {
                    state$1.currentRunningScriptName = script2.name;
                    state$1.current_job_id = Math.random().toString(16).slice(2);
                    (_b = (_a = script2.methods) == null ? void 0 : _a.main) == null ? void 0 : _b.call(_a, {
                      canRun: () => {
                        return state$1.currentUrlHash && runAtHash.some((h2) => state$1.currentUrlHash.includes(h2));
                      },
                      job_id: state$1.current_job_id
                    });
                  }
                  break;
                }
              }
            }
          }, 1e3);
        }
      }),
      guide: new lib.Script({
        name: "💡 使用提示",
        matches: [["", "icourse163.org"]],
        namespace: "icourse.guide-v1",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["手动进入任意课程里的课件/作业，即可开始自动学习"]).outerHTML
          },
          runAtHash: {
            defaultValue: ["/home/course"]
          }
        },
        methods() {
          return {
            main: async () => {
              console.log(state$1, this.cfg.runAtHash);
              CommonProject.scripts.render.methods.pin(this);
            }
          };
        }
      }),
      study: new lib.Script({
        name: "🖥️ 学习脚本",
        namespace: "icourse.study-v1",
        matches: [
          ["MOOC作业页面", "icourse163.org/learn"],
          ["SPOC作业页面", "icourse163.org/spoc/learn"]
        ],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "请勿在使用过程中最小化浏览器",
              "自动讨论默认关闭，如需开启请在下方设置中设置",
              "作业请完成课程后手动进入"
            ]).outerHTML
          },
          runAtHash: {
            defaultValue: "/learn/content?type=detail"
          },
          playbackRate,
          volume,
          readSpeed: {
            label: "PPT翻阅速度（秒）",
            attrs: { type: "number", step: "1", min: "1", max: "10" },
            defaultValue: 1
          },
          discussionStrategy: {
            label: "讨论自动回复方式",
            tag: "select",
            defaultValue: "not-reply",
            options: [
              ["not-reply", "不讨论回复"],
              ["max-show-up", "获取出现最多的评论进行回复"],
              ["max-fav", "获取最多点赞的评论进行回复"],
              ["use-newest", "获取最新的评论进行回复"]
            ]
          },
          enableChapterTest: {
            label: "随堂测验自动答题",
            attrs: {
              type: "checkbox",
              title: "是否开启随堂测验自动答题，默认关闭，测试时只需点击即可完成测验，但这里保留选项防止需要开启。"
            },
            defaultValue: false
          }
        },
        oncomplete() {
          this.onConfigChange("playbackRate", (playbackRate2) => {
            state$1.currentMedia && (state$1.currentMedia.playbackRate = parseFloat(playbackRate2.toString()));
          });
          this.onConfigChange("volume", (v) => state$1.currentMedia && (state$1.currentMedia.volume = v));
        },
        methods() {
          return {
            main: async ({ canRun, job_id }) => {
              CommonProject.scripts.render.methods.pin(this);
              const remotePage = await BackgroundProject.scripts.dev.methods.getRemotePlaywrightCurrentPage();
              if (!remotePage) {
                return $playwright.showError();
              }
              $render.moveToEdge();
              const handleVideoTest = async () => {
                if (!canRun() || job_id !== state$1.current_job_id)
                  return;
                setTimeout(async () => {
                  const question = document.querySelector(".u-questionItem");
                  const media = document.querySelector("video,audio");
                  if (question && media) {
                    $msg_and_log("info", "检测到视频弹窗测验，开始答题");
                    await new Promise((resolve) => {
                      ICourseProject.scripts.work.methods.start("chapter-test", canRun, (worker) => {
                        console.log("worker", worker);
                        worker.once("done", resolve);
                        worker.once("close", resolve);
                        worker.once("stop", resolve);
                      });
                    });
                    await $.sleep(1e3);
                    await remotePage.click(".j-unitctBox .u-btn-default.j-continue");
                    $msg_and_log("info", "测验完成");
                  }
                  handleVideoTest();
                }, 3e3);
              };
              handleVideoTest();
              const study2 = async () => {
                var _a, _b;
                const lessonName = (_a = document.querySelector(".j-lesson .j-up")) == null ? void 0 : _a.textContent;
                const currentUnitItem = document.querySelector(".j-unitslist  li.current");
                const unitName = (_b = currentUnitItem == null ? void 0 : currentUnitItem.querySelector(".unit-name")) == null ? void 0 : _b.textContent;
                $msg_and_log("info", `正在学习：${lessonName || ""} - ${unitName || ""}`);
                const isJob = (iconName) => currentUnitItem == null ? void 0 : currentUnitItem.querySelector(`[class*=${iconName}]`);
                let hasJob = true;
                if (isJob("u-icon-video")) {
                  await waitForElement("video, audio");
                  await watchMedia(this.cfg.playbackRate, this.cfg.volume);
                  $msg_and_log("info", "视频学习完成");
                } else if (isJob("u-icon-doc")) {
                  await waitForElement(".ux-pdf-reader");
                  await readPPT(remotePage, this.cfg.readSpeed);
                  $msg_and_log("info", "PPT完成");
                } else if (isJob("u-icon-discuss")) {
                  await waitForElement(".j-reply-all");
                  await discussion(remotePage, this.cfg.discussionStrategy);
                  $msg_and_log("info", "讨论完成");
                } else if (isJob("u-icon-test")) {
                  const replay = await waitForElement(".j-replay");
                  if ((replay == null ? void 0 : replay.style.display) === "none") {
                    if (this.cfg.enableChapterTest) {
                      await new Promise((resolve) => {
                        ICourseProject.scripts.work.methods.start("chapter-test", canRun, (worker) => {
                          console.log("worker", worker);
                          worker.once("done", resolve);
                          worker.once("close", resolve);
                          worker.once("stop", resolve);
                        });
                      });
                      $msg_and_log("info", "测验完成");
                    } else {
                      $msg_and_log(
                        "warn",
                        "随堂测验自动答题功能已关闭（上方菜单栏-中国大学MOOC-学习脚本中开启），即将跳过。"
                      );
                    }
                  } else {
                    $msg_and_log("info", "随堂测验已完成，即将跳过。");
                  }
                } else if (isJob("u-icon-text")) {
                  const key = "text-job-reload";
                  if (await lib.$store.getTab(key) === "1") {
                    lib.$store.setTab(key, "0");
                    $msg_and_log("info", "文档已完成，即将跳过。");
                  } else {
                    lib.$store.setTab(key, "1");
                    $msg_and_log("info", "文档无需处理，将在刷新完成后跳过。");
                    await $.sleep(3e3);
                    window.location.reload();
                    return;
                  }
                } else {
                  hasJob = false;
                }
                await $.sleep(3e3);
                if (canRun()) {
                  if (hasJob) {
                    $msg_and_log("info", "准备跳转下一章");
                  } else {
                    $msg_and_log("warn", "未找到学习内容，或者此章节不支持自动学习！即将跳过本章节");
                  }
                  await gotoNextJob();
                }
              };
              study2();
              async function gotoNextJob() {
                const list = await next2();
                for (const item of list) {
                  const el = typeof item === "function" ? item() : item;
                  if (el) {
                    await (remotePage == null ? void 0 : remotePage.click(el));
                  }
                }
                if (list.length === 0) {
                  lib.$message.success({ content: "所有章节学习完成！", duration: 0 });
                  $console.info("所有章节学习完成！");
                  CommonProject.scripts.settings.methods.notificationBySetting("所有章节学习完成！", {
                    duration: 0,
                    extraTitle: "中国大学MOOC学习脚本"
                  });
                }
              }
              async function next2() {
                var _a;
                const nextEl = (_a = document.querySelector(".unitslist .current")) == null ? void 0 : _a.nextElementSibling;
                if (nextEl) {
                  return [nextEl.querySelector(".unit-name")];
                }
                const getName = (node) => {
                  var _a2;
                  return (_a2 = node == null ? void 0 : node.textContent) == null ? void 0 : _a2.replace(/\s/g, "");
                };
                const lessonName = getName(document.querySelector(".j-lesson .j-up"));
                if (!lessonName) {
                  throw Error("无法读取章节名!");
                }
                const lessonList = Array.from(document.querySelectorAll(".j-lesson .j-list .list"));
                let nextLesson = void 0;
                for (const item of lessonList) {
                  const itemName = getName(item);
                  if (itemName === lessonName) {
                    if (item.nextElementSibling) {
                      nextLesson = item.nextElementSibling;
                      break;
                    }
                  }
                }
                if (nextLesson) {
                  return [
                    document.querySelector(".j-lesson"),
                    nextLesson
                  ];
                }
                const chapterName = getName(document.querySelector(".j-chapter .j-up"));
                if (!chapterName) {
                  throw Error("无法读取单元名!");
                }
                const chapterList = Array.from(document.querySelectorAll(".j-chapter .j-list .list"));
                let nextChapter = void 0;
                for (const item of chapterList) {
                  const itemName = getName(item);
                  if (itemName === chapterName) {
                    if (item.nextElementSibling) {
                      nextChapter = item.nextElementSibling;
                      break;
                    }
                  }
                }
                if (nextChapter) {
                  return [
                    () => document.querySelector(".j-chapter"),
                    () => nextChapter,
                    () => document.querySelector(".j-lesson"),
                    () => document.querySelectorAll(".j-lesson .j-list .list")[0]
                  ];
                } else {
                  return [];
                }
              }
            }
          };
        }
      }),
      work: new lib.Script({
        name: "✍️ 作业考试脚本",
        namespace: "icourse.work-v2",
        matches: [
          ["MOOC作业页面", "icourse163.org/learn"],
          ["SPOC作业页面", "icourse163.org/spoc/learn"],
          ["考试页面", "icourse163.org/mooc/main/newExam"]
        ],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "自动答题前请在 “通用-全局设置” 中完成 AI 模型配置。",
              "⚠️禁止同时开多个作业/考试页面。",
              [
                "⚠️由于 MOOC 限制，答题与 AI 请求速度会默认调慢",
                " 防止出现网络并发，导致无法选上选项的问题。",
                " 答题和模型响应较慢属于正常情况。"
              ]
            ]).outerHTML
          },
          runAtHash: {
            defaultValue: ["/learn/quiz", "/learn/examObject"]
          }
        },
        methods() {
          const start2 = async (type, canRun, onWorkerCreated) => {
            const remotePage = await BackgroundProject.scripts.dev.methods.getRemotePlaywrightCurrentPage();
            if (!remotePage) {
              return $playwright.showError();
            }
            await waitForQuestion();
            CommonProject.scripts.render.methods.pin(this);
            CommonProject.scripts.render.methods.normal();
            $msg_and_log("info", "开始答题");
            CommonProject.scripts.render.methods.pin(this);
            commonWork(this, {
              workerProvider: (opts) => {
                const worker = workAndExam(remotePage, type, opts);
                worker.once("close", () => {
                  clearInterval(interval);
                });
                const interval = setInterval(() => {
                  if (canRun() === false) {
                    $msg_and_log("warn", "检测到页面切换，无法继续答题，将关闭自动答题。");
                    clearInterval(interval);
                    worker.emit("close");
                  }
                }, 1e3);
                return worker;
              },
              onWorkerCreated,
              enable_control_panel: true,
              start_delay_seconds: 5
            });
          };
          return {
            main: async ({ canRun }) => {
              if (location.hash.includes("learn/quizscore")) {
                lib.$message.success("当前作业已完成，自动答题关闭。");
                return;
              }
              return start2("work", canRun);
            },
            start: start2
          };
        },
        oncomplete() {
          if (location.href.includes("/learn/examObject") && !location.href.includes("learn/examObjectScore") || location.href.includes("/mooc/main/newExam")) {
            this.methods.start("exam", () => true);
          }
        }
      }),
      passportRedirect: new lib.Script({
        name: "登录重定向修复",
        matches: [["登录重定向", "passport/logingate/changeCookie.htm"]],
        configs: {
          notes: {
            defaultValue: lib.$ui.notes(["检测到页面重定向到空白页面", "程序将会自动修复"]).outerHTML
          }
        },
        hideInPanel: true,
        oncomplete(...args) {
          CommonProject.scripts.render.methods.pin(this);
          lib.$message.info("检测到中国大学MOOC空白页面，即将重定向修复...");
          setTimeout(() => {
            location.href = "https://www.icourse163.org/";
          }, 3e3);
        }
      })
    }
  });
  function waitForQuestion() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (document.querySelector(".u-questionItem,[class*=questionBody]")) {
          clearInterval(interval);
          resolve();
        }
      }, 1e3);
    });
  }
  function workAndExam(rp, type, { redundanceWordsText, upload, stopSecondWhenFinish, answerSeparators }) {
    CommonProject.scripts.workResults.methods.init({
      questionPositionSyncHandlerType: "icourse"
    });
    const titleTransform = (titles) => {
      return removeRedundantWords(
        titles.filter((t2) => (t2 == null ? void 0 : t2.innerText) || (t2 == null ? void 0 : t2.querySelector("img"))).map((t2) => {
          if (t2) {
            const el = optimizationElementWithImage(t2, true);
            return (el.textContent || "").replace(/\s+/g, " ").trim() || "";
          }
          return "";
        }).filter((t2) => t2.trim() !== "").join(",").replace(/[\u200A-\u200F]/g, ""),
        redundanceWordsText.split("\n")
      );
    };
    const work_type = type;
    const worker = new OCSWorker({
      root: type === "exam" ? "[class*=questionBody]" : ".u-questionItem",
      elements: {
        title: type === "exam" ? "[class*=questionInfo]" : ".j-title .j-richTxt",
        options: type === "exam" ? "[class*=index-module__optionBody]" : ".choices li,.inputArea"
      },
      thread: 1,
      answerSeparators: answerSeparators.split(",").map((s) => s.trim()),
      answerer: (elements2, ctx) => {
        const title = titleTransform(elements2.title);
        if (title) {
          return CommonProject.scripts.apps.methods.resolveAIAnswer(title, async () => {
            await $.sleep(5 * 1e3);
            return aiAnswerHandler({
              type: ctx.type || "unknown",
              title,
              options: ctx.elements.options.map((o) => optimizationElementWithImage(o, true).innerText || ""),
              images: collectQuestionImages(ctx.root)
            });
          });
        } else {
          throw new Error("题目为空，请查看题目是否为空，或者忽略此题");
        }
      },
      work: {
        async handler(type2, answer, option) {
          var _a;
          if (type2 === "judgement" || type2 === "single" || type2 === "multiple") {
            if (work_type === "exam") {
              const input2 = option.querySelector("input");
              if (input2 && !(input2 == null ? void 0 : input2.checked)) {
                return await networkIdleRequire(rp, async () => {
                  await $.sleep(1e3);
                  return input2.click();
                });
              }
            }
            const text = option.querySelector(".f-richEditorText");
            const input = option.querySelector("input");
            if (input && !(input == null ? void 0 : input.checked) && text) {
              await networkIdleRequire(rp, async () => {
                await $.sleep(1e3);
                await rp.click(text);
              });
            }
          } else if (type2 === "completion" && answer.trim()) {
            const textarea = option.querySelector("textarea");
            const id = ((_a = textarea == null ? void 0 : textarea.getAttribute("id")) == null ? void 0 : _a.toString()) || "";
            if (id && (textarea == null ? void 0 : textarea.value.trim()) !== answer.trim()) {
              await networkIdleRequire(rp, async () => {
                await $.sleep(1e3);
                await rp.click("#" + id);
                await rp.fill("#" + id, answer.trim());
              });
            }
          }
        }
      },
      onElementSearched(elements2, root2) {
        elements2.options.forEach((el) => {
          optimizationElementWithImage(el);
          const correct = el.querySelector(".u-icon-correct");
          const wrong = el.querySelector(".u-icon-wrong");
          if (correct) {
            correct.replaceWith("对");
          }
          if (wrong) {
            wrong.replaceWith("错");
          }
        });
      },
      onResultsUpdate(curr, _, res) {
        var _a;
        CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, titleTransform));
        if ((_a = curr.result) == null ? void 0 : _a.finish) {
          CommonProject.scripts.apps.methods.recordAIResult(simplifyWorkResult([curr], titleTransform));
        }
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
      }
    });
    worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }).then(async (results) => {
      if (worker.isClose) {
        return;
      }
      if (type === "chapter-test") {
        $msg_and_log("info", `答题完成，将等待 ${stopSecondWhenFinish} 秒后进行保存或提交。`);
        await $.sleep(stopSecondWhenFinish * 1e3);
        if (worker.isClose) {
          return;
        }
        await worker.uploadHandler({
          type: upload,
          results,
          async callback(finishedRate, uploadable) {
            const content = `完成率 ${finishedRate.toFixed(2)}% :  ${uploadable ? "3秒后将自动提交" : "未达到阈值，将尝试保存并停留页面"} `;
            $console.info(content);
            lib.$message.success({ content, duration: type === "chapter-test" ? 10 : 0 });
            await $.sleep(3e3);
            if (worker.isClose) {
              return;
            }
            if (uploadable) {
              CommonProject.scripts.render.methods.minimize();
              CommonProject.scripts.render.methods.setPosition(100, 200);
              const submitKey = assessmentSubmissionKey(worker, "icourse-chapter");
              if (submissionAttempts.has(submitKey)) {
                lib.$message.warn({ content: "本次章节测试已尝试提交，不会重复操作。", duration: 0 });
                return;
              }
              await waitForHumanVerification(worker, document);
              if (!await waitForWorkerReady(worker)) return;
              const submitCandidates = Array.from(document.querySelectorAll(".j-submit")).filter(isVisibleAction);
              const sumbit = submitCandidates.length === 1 ? submitCandidates[0] : null;
              if (sumbit && ["提交", "提交作业", "提交试卷", "交卷"].includes(actionText(sumbit))) {
                submissionAttempts.add(submitKey);
                await withOrdinaryNativeConfirmation(worker, document, () => rp.click(sumbit));
                if (worker.nativeConfirmationBlocked) {
                  worker.emit("stop");
                  $msg_and_log("warn", "检测到人工验证提示，已暂停章节测试提交；请在页面完成验证。");
                  return;
                }
                if (!await completeOrdinaryConfirmation(worker, document, rp)) {
                  worker.emit("stop");
                  $msg_and_log("warn", "章节测试确认步骤未能安全完成，已停止后续提交操作。");
                }
              } else {
                await safeGenericSave(document);
                worker.emit("stop");
                $msg_and_log("warn", "没有找到唯一可见的提交按钮，答案已保留并停止提交。");
              }
            } else {
              const saved = await safeGenericSave(document);
              worker.emit("stop");
              const failures = failedResultSummary(results);
              lib.$message.warn({ content: "未达到提交阈值；" + (saved ? "已保存答案。" : "请手动保存页面答案。") + (failures.length ? " 未答题：" + failures.slice(0, 8).join("；") : ""), duration: 0 });
            }
          }
        });
      } else {
        await autoSubmitAssessment(worker, results, { delay: 0 });
      }
      worker.emit("done");
    }).catch((err) => {
      lib.$message.error({ content: "答题程序发生错误 : " + err.message, duration: 0 });
    });
    return worker;
  }
  async function watchMedia(playbackRate2, volume2) {
    return new Promise((resolve, reject) => {
      waitForMedia().then((video) => {
        video.playbackRate = playbackRate2;
        video.volume = volume2;
        state$1.currentMedia = video;
        playMedia(() => video == null ? void 0 : video.play());
        video.onpause = async () => {
          if (!(video == null ? void 0 : video.ended)) {
            video == null ? void 0 : video.play();
          }
        };
        video.onended = () => {
          resolve();
        };
      }).catch(reject);
    });
  }
  async function readPPT(remotePage, readSpeed) {
    var _a, _b, _c, _d;
    const reader = document.querySelector(".ux-pdf-reader");
    if (reader) {
      const total = parseInt(
        ((_c = (_b = (_a = document.querySelector(".ux-h5pdfreader_container_footer_pages_total")) == null ? void 0 : _a.childNodes[1]) == null ? void 0 : _b.textContent) == null ? void 0 : _c.replace(/\s/, "")) || "0"
      );
      const start2 = parseInt(
        ((_d = document.querySelector(".ux-h5pdfreader_container_footer_pages_in")) == null ? void 0 : _d.value) || "1"
      );
      for (let index = start2; index < total + 1; index++) {
        const next2 = document.querySelector(".ux-h5pdfreader_container_footer_pages_next");
        if (next2) {
          await remotePage.click(next2);
        } else {
          $msg_and_log("error", "未找到PPT的下一页按钮！");
        }
        await $.sleep(readSpeed * 1e3);
      }
    }
  }
  async function discussion(remotePage, discussionStrategy) {
    var _a, _b, _c, _d, _e;
    if (discussionStrategy === "not-reply") {
      return $msg_and_log("warn", "讨论自动回复功能已关闭（上方菜单栏-中国大学MOOC-学习脚本中开启）。");
    }
    let res = "";
    if (discussionStrategy === "max-show-up") {
      const list = Array.from(document.querySelectorAll(".j-reply-all .f-pr .j-content"));
      const mapping = /* @__PURE__ */ new Map();
      for (const item of list) {
        mapping.set(item.textContent, (mapping.get(item.textContent) || 0) + 1);
      }
      const content = (_b = (_a = [...mapping.entries()].sort((a, b) => b[1] - a[1])) == null ? void 0 : _a[0]) == null ? void 0 : _b[0];
      if (!content) {
        $msg_and_log("error", "读取出现最多评论失败！");
      }
      res = content;
    } else if (discussionStrategy === "max-fav") {
      const list = Array.from(document.querySelectorAll(".j-reply-all .f-pr"));
      let max = 0;
      let maxEl = void 0;
      for (const item of list) {
        const num = parseInt(((_c = item.querySelector(".bar .num")) == null ? void 0 : _c.textContent) || "0");
        if (num > max) {
          max = num;
          maxEl = item;
        }
      }
      const content = ((_d = maxEl == null ? void 0 : maxEl.querySelector(".j-content")) == null ? void 0 : _d.textContent) || "";
      if (!content) {
        $msg_and_log("error", "读取最多点赞评论失败！");
      }
      res = content;
    } else if (discussionStrategy === "use-newest") {
      const content = ((_e = document.querySelector(".j-reply-all .f-pr .first .j-content")) == null ? void 0 : _e.textContent) || "";
      if (!content) {
        $msg_and_log("error", "读取最新评论失败！");
      }
      res = content;
    }
    const p = document.querySelector(".j-reply-add div.ql-editor.ql-blank p");
    if (p) {
      p.innerText = res;
      await $.sleep(1e3);
      const submit = document.querySelector(".j-reply-add .editbtn");
      if (submit) {
        await remotePage.click(submit);
        lib.$message.info("提交回复成功！");
      } else {
        $msg_and_log("error", "获取提交按钮失败！");
      }
      await $.sleep(2e3);
    } else {
      $msg_and_log("error", "获取评论输入框失败！");
    }
  }
  async function networkIdleRequire(rp, cb) {
    await cb();
    const modal2 = await waitFor(() => document.querySelector(".ux-modal_content_content"), {
      check_period_ms: 200,
      timeout_seconds: 1
    });
    if (modal2) {
      const msg2 = lib.$message.warn("答题速度过快导致并发限制、3秒后再继续答题。");
      await rp.click(".ux-modal-btn");
      await $.sleep(3e3);
      await cb();
      msg2 == null ? void 0 : msg2.remove();
    }
  }
  const state = {
    study: {
      currentMedia: void 0
    }
  };
  const changeCurrentLeafJobName = lib.cors.defineTopFunction((name) => {
    var _a;
    (_a = lib.$elements.currentScriptPanel) == null ? void 0 : _a.body.replaceChildren(
      lib.h("div", { className: "card", style: { marginTop: "12px" } }, ["当前正在学习：" + name])
    );
  });
  function collectYuketangQuestionRoots(scope = document) {
    const selectors = [
      ".problem-common", ".problem-item", ".question-item", "[data-question-id]"
    ];
    const controls = 'input[type="radio"],input[type="checkbox"],textarea,input[type="text"],[contenteditable="true"],[role="radio"],[role="checkbox"]';
    const candidates = Array.from(new Set(selectors.map((selector) => Array.from(scope.querySelectorAll(selector))).flat())).filter(
      (element) => element.querySelector(controls) && element.querySelectorAll(".problem-title,.question-title,.problem-stem,.question-stem,[class*=problem-title],[class*=question-title]").length <= 1
    );
    return candidates.filter((element) => !candidates.some((other) => other !== element && element.contains(other)));
  }
  function yuketangCanonicalOptions(root2) {
    const choices = Array.from(root2.querySelectorAll('input[type="radio"],input[type="checkbox"],[role="radio"],[role="checkbox"]')).map(
      (control) => control.closest("label,.option-item,[class*=option-item]") || control
    );
    const blanks = Array.from(root2.querySelectorAll('textarea,input[type="text"],[contenteditable="true"]'));
    return Array.from(new Set([...choices, ...blanks]));
  }
  function yuketangQuestionType(ctx) {
    const controls = ctx.elements.options || [];
    const find = (element, selector) => element.matches(selector) ? element : element.querySelector(selector);
    const radios = controls.filter((element) => find(element, 'input[type="radio"],[role="radio"]'));
    const checks = controls.filter((element) => find(element, 'input[type="checkbox"],[role="checkbox"]'));
    const blanks = controls.filter((element) => find(element, 'textarea,input[type="text"],[contenteditable="true"]'));
    if ([radios.length > 0, checks.length > 0, blanks.length > 0].filter(Boolean).length !== 1) return void 0;
    if (checks.length) return "multiple";
    if (radios.length) return radios.length === 2 ? "judgement" : "single";
    if (blanks.length) return "completion";
    return void 0;
  }
  function yuketangQuestionTitle(elements2, root2) {
    const direct = (elements2.title || []).map((element) => (element.innerText || element.textContent || "").trim()).filter(Boolean).join(" ");
    if (direct) return direct;
    const clone = root2.cloneNode(true);
    clone.querySelectorAll('label,.option-item,[class*=option-item],textarea,input,[contenteditable="true"],button').forEach((element) => element.remove());
    return (clone.innerText || clone.textContent || "").replace(/\s+/g, " ").trim();
  }
  function setYuketangInputValue(control, value) {
    if (control.matches('[contenteditable="true"]')) {
      control.textContent = value;
    } else {
      const proto = control.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value");
      if (setter && setter.set) setter.set.call(control, value);
      else control.value = value;
    }
    control.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: value }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
    control.dispatchEvent(new Event("blur", { bubbles: true }));
  }
  function createYuketangAIWorker(scope = document) {
    const roots = collectYuketangQuestionRoots(scope);
    const worker = new OCSWorker({
      root: roots,
      elements: {
        title: ".problem-title,.question-title,.problem-stem,.question-stem,.stem,[class*=problem-title],[class*=question-title],[class*=problem-stem]",
        options: 'label:has(input[type="radio"]),label:has(input[type="checkbox"]),.option-item,[class*=option-item],[role="radio"],[role="checkbox"],textarea,input[type="text"],[contenteditable="true"]'
      },
      thread: getAISettings().provider === "llama" ? 1 : Math.max(1, Number(CommonProject.scripts.settings.cfg.thread || 1)),
      answerSeparators: String(CommonProject.scripts.settings.cfg.answerSeparators || "#").split(",").map((item) => item.trim()).filter(Boolean),
      onElementSearched(elements2, root2) {
        elements2.options = yuketangCanonicalOptions(root2);
      },
      answerer: async (elements2, ctx) => {
        const title = yuketangQuestionTitle(elements2, ctx.root);
        if (!title) throw new Error("未能安全识别雨课堂题干");
        await $.sleep(Math.max(0, Number(CommonProject.scripts.settings.cfg.period || 0)) * 1e3);
        return aiAnswerHandler({
          type: ctx.type || "unknown",
          title,
          options: ctx.elements.options.map((option) => (option.innerText || option.textContent || "").trim()),
          images: collectQuestionImages(ctx.root)
        });
      },
      work: {
        type: yuketangQuestionType,
        async handler(type, answer, option) {
          if (["single", "multiple", "judgement"].includes(type)) {
            const control = option.matches('input,[role="radio"],[role="checkbox"]') ? option : option.querySelector('input[type="radio"],input[type="checkbox"],[role="radio"],[role="checkbox"]');
            const selected = () => control ? control.checked === true || control.getAttribute("aria-checked") === "true" : /(^|\s)(is-checked|checked|selected|active)(\s|$)/.test(option.className || "");
            if (!selected()) {
              (control && control.closest("label") || option).click();
              await $.sleep(250);
            }
            if (!selected()) throw new Error("雨课堂选项点击后未能验证选中状态");
          } else if (type === "completion") {
            const control = option.matches('textarea,input[type="text"],[contenteditable="true"]') ? option : option.querySelector('textarea,input[type="text"],[contenteditable="true"]');
            if (!control) throw new Error("未找到雨课堂填空输入框");
            setYuketangInputValue(control, answer);
            await $.sleep(150);
            const current = control.matches('[contenteditable="true"]') ? control.textContent : control.value;
            if (String(current || "").trim() !== String(answer).trim()) throw new Error("雨课堂答案未能写入输入框");
          }
        }
      },
      onResultsUpdate(_, __, results) {
        CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(results, (titles, index) => yuketangQuestionTitle({ title: titles }, results[index].ctx.root)));
        CommonProject.scripts.workResults.methods.updateWorkStateByResults(results);
      }
    });
    return worker;
  }
  async function runYuketangAIWork(scope = document) {
    const worker = createYuketangAIWorker(scope);
    const results = await worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug });
    const submission = await autoSubmitAssessment(worker, results, { document: scope.ownerDocument || document, key: "yuketang" });
    worker.emit("done");
    return { results, submission };
  }
  const YKTProject = lib.Project.create({
    name: "雨课堂",
    domains: ["yuketang.cn"],
    scripts: {
      guide: new lib.Script({
        name: "🖥️ 使用提示",
        matches: [
          ["雨课堂课程列表", "/v2/web/index"],
          ["学习内容界面", "/v2/web/studentLog"],
          ["长江雨课堂手机版主页", "/m/v2/course/normalcourse/logs"]
        ],
        namespace: "yuketang.study.guide",
        configs: {
          notes: {
            defaultValue: "请点击课程里面任意章节，进入学习。"
          }
        },
        oncomplete(...args) {
          if (location.href.includes("/m/v2/course/normalcourse/logs")) {
            lib.$message.info("请点击任意视频，进入自动学习。");
          }
        }
      }),
      global: new lib.Script({
        name: "全局脚本",
        matches: [["全部界面", /.*/]],
        hideInPanel: true,
        onstart(...args) {
          const _removeChild = Element.prototype.removeChild;
          Element.prototype.removeChild = function(e) {
            if (e.nodeName === "DIV") {
              if (lib.$elements.wrapper && e === lib.$elements.wrapper) {
                lib.$elements.wrapper.removeAttribute("style");
                return e;
              }
            }
            _removeChild.call(this, e);
            return e;
          };
        }
      }),
      v2_study: new lib.Script({
        name: "📚 课程学习",
        matches: [
          ["课程学习界面", "/v2/web/studentLog"],
          ["课程列表", /pro\/lms\/.*\/.*\/studycontent/],
          ["视频界面", "v2/web/xcloud/video-student"],
          ["视频讨论界面", /v2\/web\/lms\/.*\/forum/]
        ],
        namespace: "yuketang.study.v2",
        configs: {
          notes: {
            defaultValue: lib.$ui.notes([
              "请点击任意小节，脚本会自动运行，并自动下一节。",
              "修改音量、倍速后请刷新页面使设置生效。",
              "⚠️ 章节测试自动答题还在开发中，请耐心等待",
              "章节测试会使用已配置的 AI 模型自动作答并按阈值提交。"
            ]).outerHTML
          },
          currentLeafIndex: {
            defaultValue: -1
          },
          currentStudyUrl: {
            defaultValue: ""
          },
          goNext: {
            defaultValue: false
          },
          auto: {
            label: "自动学习",
            attrs: { type: "checkbox", title: "自动寻找未完成章节、或者自动下一节学习" },
            defaultValue: false
          },
          restudy,
          volume,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            defaultValue: 1,
            options: [
              ["1", "1 x"],
              ["1.25", "1.25 x"],
              ["1.5", "1.5 x"],
              ["2", "2.0 x"]
            ]
          },
          discussMode: {
            label: "讨论任务模式",
            tag: "select",
            defaultValue: "random",
            options: [
              ["random", "随机评论"],
              ["first", "截取第一条评论"],
              ["none", "不进行评论"]
            ]
          }
        },
        onhistorychange(type, ...args) {
          var _a;
          if (type === "push") {
            (_a = this.oncomplete) == null ? void 0 : _a.call(this);
          }
        },
        async oncomplete() {
          CommonProject.scripts.render.methods.pin(this);
          if (document.location.pathname.includes("/v2/web/studentLog")) {
            const tab = await waitForElement("#tab-content");
            tab == null ? void 0 : tab.click();
            return;
          }
          if (document.location.pathname.includes("v2/web/xcloud/video-student")) {
            try {
              await waitForElement(
                [
                  "#video-box",
                  ".digital-human-video-element-selector"
                ].join(",")
              );
              await lib.$.sleep(2e3);
              await v2_watch({
                volume: this.cfg.volume,
                playbackRate: this.cfg.playbackRate
              });
              this.cfg.goNext = true;
              lib.$message.info("视频学习完成，即将自动进入下一节");
              setTimeout(() => {
                location.href = this.cfg.currentStudyUrl;
              }, 3e3);
            } catch (e) {
              $msg.error({ content: String(e), duration: 0 });
            }
            return;
          }
          if (/v2\/web\/lms\/.*\/forum/.test(document.location.pathname)) {
            const new_discuss_list = await waitForElement(".new_discuss_list");
            const textarea = await waitForElement("textarea.el-textarea__inner");
            if (!new_discuss_list || !textarea) {
              lib.$message.error("讨论区元素加载失败，请刷新界面重试。");
              return;
            }
            const discusses = Array.from(new_discuss_list.querySelectorAll(".cont_detail")).map((el) => el.textContent || "").filter((text) => text.trim() !== "");
            console.log(discusses);
            if (this.cfg.discussMode === "random") {
              const random_discuss = discusses[Math.floor(Math.random() * discusses.length)];
              textarea.value = random_discuss;
            } else if (this.cfg.discussMode === "first") {
              textarea.value = discusses[0] || "";
            } else {
              lib.$message.info("已设置为不进行评论，跳过评论步骤。");
              return;
            }
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            const submit_btn = await waitForElement("button.submitComment");
            submit_btn == null ? void 0 : submit_btn.click();
            this.cfg.goNext = true;
            lib.$message.success("评论提交成功，即将自动进入下一节");
            setTimeout(() => {
              location.href = this.cfg.currentStudyUrl;
            }, 3e3);
            return;
          }
          await waitForElement(".chapter-list");
          await lib.$.sleep(2e3);
          const vue_data = document.querySelector(".study-content__container").__vue__;
          const chapter_list = JSON.parse(JSON.stringify(vue_data.chapter_list || []));
          const leaf_schedules = vue_data.leaf_schedules || [];
          const leaf_list = [];
          while (chapter_list.length > 0) {
            const chapter = chapter_list.shift();
            if (!chapter)
              break;
            while (chapter.section_leaf_list.length > 0) {
              const leaf = chapter.section_leaf_list.shift();
              if (!leaf)
                break;
              if (leaf.leaf_list) {
                leaf_list.push(...leaf.leaf_list);
              } else {
                leaf_list.push(leaf);
              }
            }
          }
          const getJobName = (leaf) => {
            var _a;
            return ((_a = leaf.querySelector(".leaf-title")) == null ? void 0 : _a.textContent) || "未知章节";
          };
          const leafs = Array.from(document.querySelectorAll(".leaf-detail"));
          for (let index = 0; index < leafs.length; index++) {
            const leaf = leafs[index];
            leaf.addEventListener("click", () => {
              this.cfg.goNext = false;
              this.cfg.currentLeafIndex = index;
              this.cfg.currentStudyUrl = (top == null ? void 0 : top.document.location.href) || "";
              const name = getJobName(leaf);
              changeCurrentLeafJobName(name);
              $console.log("正在学习：" + name);
            });
          }
          const currentLeaf = leafs[this.cfg.currentLeafIndex];
          if (currentLeaf) {
            currentLeaf.scrollIntoView({ behavior: "smooth", block: "center" });
            changeCurrentLeafJobName(getJobName(currentLeaf));
          }
          const isLeafFinished = (leaf_index) => {
            var _a;
            const leaf_id = (_a = leaf_list[leaf_index]) == null ? void 0 : _a.id;
            if (!leaf_id)
              return false;
            const schedule = leaf_schedules[leaf_id];
            return schedule === 1;
          };
          const getNext = () => {
            let index = this.cfg.currentLeafIndex;
            while (index + 1 < leafs.length) {
              index++;
              if (["shipin", "taolun1"].some(
                (name) => {
                  var _a;
                  return (_a = leafs[index]) == null ? void 0 : _a.querySelector(`.iconfont.icon--${name}`);
                }
              ) && !isLeafFinished(index)) {
                break;
              }
            }
            return leafs[index];
          };
          if (this.cfg.auto) {
            const next2 = getNext();
            if (!next2) {
              return lib.$modal.alert({
                content: "检测到当前课程全部完成，如果还有未完成的视频请刷新重试，或者打开复习模式。"
              });
            }
            if (this.cfg.goNext) {
              const timeout = setTimeout(() => {
                next2.click();
                modal2 == null ? void 0 : modal2.remove();
              }, 5e3);
              const modal2 = lib.$modal.confirm({
                content: "5秒后即将自动继续学习：" + getJobName(next2),
                cancelButtonText: "取消自动学习",
                duration: 5,
                onCancel() {
                  clearTimeout(timeout);
                  lib.$message.warn({ content: "已取消自动进入下一节，后续请手动操作进入。", duration: 0 });
                }
              });
            }
          }
        }
      }),
      ai: new lib.Script({
        name: "🤖 AI学伴",
        matches: [
          ["AI学伴课程界面", "/ai-workspace/lms-graph"],
          ["AI学伴课程界面手机版", "/ai-workspace/lms-graph-mobile"]
        ],
        namespace: "yuketang.study.ai",
        configs: {
          notes: {
            defaultValue: "请点击任意章节，进入学习。"
          },
          restudy,
          reloadWhenError: {
            label: "黑屏自动刷新",
            attrs: { title: "视频黑屏或者检测不到视频时自动刷新页面", type: "checkbox" },
            defaultValue: true
          },
          volume,
          playbackRate: {
            label: "视频倍速",
            tag: "select",
            defaultValue: 1,
            options: [
              ["1", "1 x"],
              ["1.25", "1.25 x"],
              ["1.5", "1.5 x"],
              ["2.0", "2.0 x"]
            ]
          }
        },
        async oncomplete() {
          if (location.href.includes("ai-workspace/lms-graph-mobile")) {
            await lib.$message.warn("即将切换到电脑版AI课程...");
            await lib.$.sleep(3e3);
            location.href = location.href.replace("lms-graph-mobile", "lms-graph");
            return;
          }
          await lib.$.sleep(3e3);
          CommonProject.scripts.render.methods.pin(this);
          this.onConfigChange("volume", (curr) => {
            state.study.currentMedia && (state.study.currentMedia.volume = curr);
          });
          this.onConfigChange("playbackRate", (curr) => {
            state.study.currentMedia && (state.study.currentMedia.playbackRate = curr);
          });
          const max_level = 5;
          for (let i = 0; i < max_level; i++) {
            document.querySelectorAll(".expand-icon:not(.is-expanded )").forEach((el) => el.click());
            await lib.$.sleep(100);
          }
          const getJobs = () => Array.from(document.querySelectorAll("div.leaf-item"));
          const getJobName = () => {
            var _a;
            return ((_a = document.querySelector(".leaf-item.is-active .leaf-item-title")) == null ? void 0 : _a.textContent) || "未知任务点";
          };
          const getNextJob = () => {
            let jobs = getJobs();
            const active_index = jobs.findIndex((job) => job.classList.contains("is-active"));
            if (!this.cfg.restudy) {
              jobs = jobs.splice(active_index);
              jobs = jobs.filter((el) => !el.querySelector(".icon-yuanquangou"));
              jobs = jobs.filter((el) => {
                var _a;
                return !(((_a = el.querySelector(".leaf-item-tag")) == null ? void 0 : _a.textContent) || "").includes("自测");
              });
            }
            const new_active_index = jobs.findIndex((job) => job.classList.contains("is-active"));
            return jobs[new_active_index + 1];
          };
          try {
            $msg.info("等待任务加载中...");
            await waitForElement(".detail-container", {
              timeout_seconds: 10 * 1e3
            });
            $msg.info("即将开始自动学习");
          } catch (e) {
            lib.$message.error("元素加载失败，请刷新界面重试。");
          }
          const study2 = async () => {
            try {
              if (lib.$el(".detail-container video")) {
                $msg.info("即将开始视频学习：" + getJobName());
                await ai_watch({
                  volume: this.cfg.volume,
                  playbackRate: this.cfg.playbackRate
                });
                $msg.success("视频学习完成");
                await lib.$.sleep(3e3);
              }
              if (lib.$el(".detail-container .problem-common")) {
                $msg.info("5秒后使用 AI 自动完成自测：" + getJobName());
                await lib.$.sleep(5e3);
                const completed = await runYuketangAIWork(lib.$el(".detail-container"));
                if (!completed.submission.submitted) return;
              }
            } catch (e) {
              if (lib.$el(".detail-container .problem-common")) {
                lib.$message.error({ content: `自测控件无法安全识别，已停留当前页面：${e}`, duration: 0 });
                return;
              }
              lib.$message.error(`当前任务点无法完成，即将跳转下一节（${e}）`);
            }
            const next2 = getNextJob();
            if (!next2) {
              return lib.$modal.alert({
                content: "检测到当前视频全部播放完毕，如果还有未完成的视频请刷新重试，或者打开复习模式。"
              });
            }
            next2.click();
            await lib.$.sleep(200);
            next2.scrollIntoView({ behavior: "smooth", block: "center" });
            await lib.$.sleep(3e3);
            study2();
          };
          study2();
        }
      }),
      work: new lib.Script({
        name: "✍️ AI 自动答题",
        matches: [
          ["AI伴学自测界面", "/v2/web/iframe-self-test"],
          ["V2学习内容-作业界面", "/v2/web/cloud/student/exercise"]
        ],
        namespace: "yuketang.work.ai",
        configs: { notes: workNotes },
        async oncomplete() {
          await lib.$.sleep(1e3);
          CommonProject.scripts.workResults.methods.init();
          commonWork(this, {
            enable_control_panel: true,
            start_delay_seconds: 4,
            workerProvider: () => {
              const worker = createYuketangAIWorker(document);
              worker.doWork({ enable_debug: BackgroundProject.scripts.dev.cfg.enable_answerer_debug }).then(async (results) => {
                await autoSubmitAssessment(worker, results, { key: "yuketang" });
                worker.emit("done");
              }).catch((error) => {
                lib.$message.error({ content: "雨课堂自动答题失败：" + String(error.message || error), duration: 0 });
                worker.emit("done");
              });
              return worker;
            }
          });
        }
      }),
      "font-decrypt": new lib.Script({
        name: "🔤 字体解密",
        matches: [
          ["AI伴学自测界面", "/v2/web/iframe-self-test"],
          ["V2学习内容-作业界面", "/v2/web/cloud/student/exercise"]
        ],
        async oncomplete() {
          var _a;
          const mapping = await loadFontMapping();
          console.log(mapping);
          const els = Array.from(document.querySelectorAll(".xuetangx-com-encrypted-font"));
          for (const el of els) {
            for (const _char in mapping) {
              if ((_a = el.textContent) == null ? void 0 : _a.includes(_char)) {
                el.textContent = el.textContent.replace(new RegExp(_char, "g"), mapping[_char]);
              }
            }
          }
          console.log("字体替换完成");
        }
      })
    }
  });
  async function loadFontMapping() {
    try {
      $msg.info("正在解析字体");
      return await request("https://cdn.ocsjs.com/resources/font/yuketang_font_map.json", {
        type: "GM_xmlhttpRequest",
        method: "get",
        responseType: "json"
      });
    } catch (err) {
      $msg.error("载繁体字库加载失败，请刷新页面重试：" + String(err));
    }
  }
  async function ai_watch(options) {
    const set = async () => {
      await lib.$.sleep(1e3);
      const media = await waitForElement(".detail-container video", {
        timeout_seconds: 10 * 1e3
      });
      console.log("media", media);
      await lib.$.sleep(1e3);
      state.study.currentMedia = media;
      if (media) {
        media.currentTime = 1;
        media.volume = options.volume;
        media.playbackRate = options.playbackRate;
      }
      return state.study.currentMedia;
    };
    lib.$message.info("开始播放");
    const video = await set();
    if (!video) {
      throw new Error("video not found!");
    }
    return new Promise((resolve, reject) => {
      const videoCheckInterval = setInterval(async () => {
        if ((video == null ? void 0 : video.isConnected) === false) {
          clearInterval(videoCheckInterval);
          lib.$message.info({ content: "检测到视频切换中..." });
          resolve();
        }
      }, 3e3);
      playMedia(() => video == null ? void 0 : video.play());
      video.onpause = async () => {
        if (!(video == null ? void 0 : video.ended)) {
          await lib.$.sleep(1e3);
          video == null ? void 0 : video.play();
        }
      };
      video.onended = () => {
        clearInterval(videoCheckInterval);
        resolve();
      };
    });
  }
  async function v2_watch(options) {
    const set = async () => {
      await lib.$.sleep(1e3);
      const is_digital_human_video = !!document.querySelector(".digital-human-video-element-selector");
      if (is_digital_human_video) {
        throw new Error("AI学伴视频请在学习内容中进入，不要在成绩单里进入。");
      } else {
        const video_vue_data = document.querySelector(".xtplayer").__vue__;
        video_vue_data.player.options.speed.value = parseFloat(options.playbackRate.toString());
        video_vue_data.player.options.volume.value = options.volume;
        video_vue_data.player.init();
      }
      const media = await waitForElement("video", {
        timeout_seconds: 10 * 1e3
      });
      console.log("media", media);
      await lib.$.sleep(1e3);
      state.study.currentMedia = media;
      media.currentTime = 1;
      return state.study.currentMedia;
    };
    lib.$message.info("开始播放");
    const video = await set();
    if (!video) {
      throw new Error("video not found!");
    }
    return new Promise((resolve, reject) => {
      playMedia(() => video == null ? void 0 : video.play());
      video.onpause = async () => {
        if (!(video == null ? void 0 : video.ended)) {
          await lib.$.sleep(1e3);
          video == null ? void 0 : video.play();
        }
      };
      video.onended = () => {
        resolve();
      };
    });
  }
  function definedProjects() {
    return [
      ZHSProject,
      CXProject,
      IcveMoocProject,
      ZJYProject,
      ICourseProject,
      YKTProject,
      CommonProject,
      BackgroundProject
    ];
  }
  exports2.$ = $;
  exports2.$const = $const;
  exports2.$elements = lib.$elements;
  exports2.$message = lib.$message;
  exports2.initOCSTheme = initOCSTheme;
  exports2.$store = lib.$store;
  exports2.$string = $string;
  exports2.BackgroundProject = BackgroundProject;
  exports2.CXProject = CXProject;
  exports2.CommonProject = CommonProject;
  exports2.CustomOCSWorker = CustomOCSWorker;
  exports2.ICourseProject = ICourseProject;
  exports2.IcveMoocProject = IcveMoocProject;
  exports2.OCSWorker = OCSWorker;
  exports2.RemotePlaywright = RemotePlaywright;
  exports2.RenderScript = RenderScript;
  exports2.StringUtils = StringUtils;
  exports2.YKTProject = YKTProject;
  exports2.ZHSProject = ZHSProject;
  exports2.ZJYProject = ZJYProject;
  exports2.answerExactMatch = answerExactMatch;
  exports2.answerNormalizedMatch = answerNormalizedMatch;
  exports2.answerSimilar = answerSimilar;
  exports2.answerSimilarWithGap = answerSimilarWithGap;
  exports2.clearString = clearString;
  exports2.createDefaultQuestionResolver = createDefaultQuestionResolver;
  exports2.aiAnswerHandler = aiAnswerHandler;
  exports2.defaultWorkTypeResolver = defaultWorkTypeResolver;
  exports2.definedProjects = definedProjects;
  exports2.domSearch = domSearch;
  exports2.domSearchAll = domSearchAll;
  exports2.isPlainAnswer = isPlainAnswer;
  exports2.isProgramAnswer = isProgramAnswer;
  exports2.normalizeString = normalizeString;
  exports2.removeRedundant = removeRedundant;
  exports2.request = request;
  exports2.resolvePlainAnswer = resolvePlainAnswer;
  exports2.splitAnswer = splitAnswer;
  exports2.start = lib.start;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});


const STYLE = `/* ==================== 设计令牌（ai.12） ====================
 * 所有颜色、圆角、阴影统一走 CSS 变量；深色模式只需覆盖变量。
 * 主题：跟随系统 / 浅色 / 深色，由 :host 的 data-ocs-theme 属性控制。 */
:host {
	--ocs-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif;
	--ocs-font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	--ocs-primary: #2563eb;
	--ocs-primary-light: #60a5fa;
	--ocs-primary-soft: #2563eb14;
	--ocs-ring: #2563eb40;
	--ocs-danger: #dc2626;
	--ocs-danger-text: #b91c1c;
	--ocs-danger-soft: #fef2f2;
	--ocs-success: #16a34a;
	--ocs-success-text: #15803d;
	--ocs-success-soft: #f0fdf4;
	--ocs-warn: #d97706;
	--ocs-warn-text: #92400e;
	--ocs-warn-soft: #fffbeb;
	--ocs-info-soft: #eff6ff;
	--ocs-info-text: #1d4ed8;
	--ocs-bg: #f8fafc;
	--ocs-surface: #ffffff;
	--ocs-surface-2: #f1f5f9;
	--ocs-input-bg: #f1f5f9;
	--ocs-input-hover: #e8edf4;
	--ocs-disabled-bg: #f1f5f9;
	--ocs-switch-off: #cbd5e1;
	--ocs-border: #e2e8f0;
	--ocs-border-strong: #cbd5e1;
	--ocs-divider: #e2e8f0;
	--ocs-text: #1e293b;
	--ocs-text-2: #475569;
	--ocs-text-3: #94a3b8;
	--ocs-shadow-color: #0f172a26;
	--ocs-radius-sm: 6px;
	--ocs-radius: 10px;
	--ocs-radius-lg: 14px;
	--ocs-z: 2147483000;
	color-scheme: light;
}
:host([data-ocs-theme='dark']) {
	--ocs-primary: #60a5fa;
	--ocs-primary-light: #93c5fd;
	--ocs-primary-soft: #60a5fa1f;
	--ocs-ring: #60a5fa55;
	--ocs-danger: #f87171;
	--ocs-danger-text: #fca5a5;
	--ocs-danger-soft: #f8717122;
	--ocs-success: #4ade80;
	--ocs-success-text: #86efac;
	--ocs-success-soft: #4ade801f;
	--ocs-warn: #fbbf24;
	--ocs-warn-text: #fcd34d;
	--ocs-warn-soft: #fbbf241f;
	--ocs-info-soft: #60a5fa1f;
	--ocs-info-text: #93c5fd;
	--ocs-bg: #0b1220;
	--ocs-surface: #111827;
	--ocs-surface-2: #1f2937;
	--ocs-input-bg: #1f2937;
	--ocs-input-hover: #273244;
	--ocs-disabled-bg: #1f2937;
	--ocs-switch-off: #374151;
	--ocs-border: #2b3646;
	--ocs-border-strong: #3b4657;
	--ocs-divider: #2b3646;
	--ocs-text: #e5e7eb;
	--ocs-text-2: #9ca3af;
	--ocs-text-3: #6b7280;
	--ocs-shadow-color: #00000080;
	color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
	:host(:not([data-ocs-theme='light'])) {
		--ocs-primary: #60a5fa;
		--ocs-primary-light: #93c5fd;
		--ocs-primary-soft: #60a5fa1f;
		--ocs-ring: #60a5fa55;
		--ocs-danger: #f87171;
		--ocs-danger-text: #fca5a5;
		--ocs-danger-soft: #f8717122;
		--ocs-success: #4ade80;
		--ocs-success-text: #86efac;
		--ocs-success-soft: #4ade801f;
		--ocs-warn: #fbbf24;
		--ocs-warn-text: #fcd34d;
		--ocs-warn-soft: #fbbf241f;
		--ocs-info-soft: #60a5fa1f;
		--ocs-info-text: #93c5fd;
		--ocs-bg: #0b1220;
		--ocs-surface: #111827;
		--ocs-surface-2: #1f2937;
		--ocs-input-bg: #1f2937;
		--ocs-input-hover: #273244;
		--ocs-disabled-bg: #1f2937;
		--ocs-switch-off: #374151;
		--ocs-border: #2b3646;
		--ocs-border-strong: #3b4657;
		--ocs-divider: #2b3646;
		--ocs-text: #e5e7eb;
		--ocs-text-2: #9ca3af;
		--ocs-text-3: #6b7280;
		--ocs-shadow-color: #00000080;
		color-scheme: dark;
	}
}

/** 默认字体 */
/** 输入框默认边距 */
ul,
ol {
	line-height: 26px;
	padding-left: 22px;
	margin: 0px;
}
a {
	color: var(--ocs-primary);
}
hr {
	border-style: solid;
	border-color: var(--ocs-divider);
	border-width: 0px;
	border-bottom: 1px solid var(--ocs-divider);
	margin-block-start: 1em;
	margin-block-end: 1em;
}
.base-style-active-form-control {
	border: 1px solid transparent;
}
.base-style-active-form-control:focus {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
}
.base-style-active-form-control:focus:not([type='checkbox'], [type='radio']) {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
	background-color: var(--ocs-surface) !important;
}
.base-style-active-form-control:hover {
	background-color: var(--ocs-input-hover);
}
.base-style-input {
	outline: none;
	border: 1px solid transparent;
	padding: 2px 8px;
	margin: 0px;
	background-color: var(--ocs-input-bg);
	border-radius: 2px;
	color: var(--ocs-text);
}
.base-style-input::placeholder {
	color: var(--ocs-text-3);
}
.base-style-switch {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	width: fit-content;
	min-width: 48px;
	height: 20px;
	border-radius: 100px;
	display: flex;
	align-items: center;
	padding: 2px 4px;
	transition: all 0.2s ease-in-out;
	width: auto;
	background: var(--ocs-switch-off);
}
.base-style-switch:checked {
	background: var(--ocs-primary);
}
.base-style-switch:disabled {
	background-color: var(--ocs-disabled-bg);
}
.base-style-switch:checked::before {
	transform: translate(24px, 0px);
}
.base-style-switch::before {
	background-color: #fff;
	border-radius: 9px;
	box-shadow: 0 2px 4px var(--ocs-shadow-color);
	width: 14px;
	height: 14px;
	content: '';
}
.base-style-button {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	border-radius: 4px;
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-primary);
	color: var(--ocs-primary);
	cursor: pointer !important;
	margin-bottom: 4px;
}
.base-style-button:active {
	box-shadow: 0px 0px 8px var(--ocs-ring);
}
.base-style-button + .base-style-button {
	margin-left: 12px;
}
.base-style-button:hover {
	background-color: var(--ocs-primary-soft);
}
.base-style-button.danger:hover {
	background-color: var(--ocs-danger-soft);
}
.base-style-button:disabled {
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	color: var(--ocs-text-3);
	cursor: not-allowed;
}
.base-style-button.danger {
	color: var(--ocs-danger);
	border-color: var(--ocs-danger);
}
.base-style-button:disabled:active {
	box-shadow: none;
}
.base-style-button-secondary {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	border-radius: 4px;
	border: 1px solid var(--ocs-primary);
	color: var(--ocs-primary);
	cursor: pointer !important;
	margin-bottom: 4px;
	color: var(--ocs-text-2);
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
}
.base-style-button-secondary:active {
	box-shadow: 0px 0px 8px var(--ocs-ring);
}
.base-style-button-secondary + .base-style-button-secondary {
	margin-left: 12px;
}
.base-style-button-secondary:hover {
	background-color: var(--ocs-primary-soft);
}
.base-style-button-secondary.danger:hover {
	background-color: var(--ocs-danger-soft);
}
.base-style-button-secondary:disabled {
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	color: var(--ocs-text-3);
	cursor: not-allowed;
}
.base-style-button-secondary.danger {
	color: var(--ocs-danger);
	border-color: var(--ocs-danger);
}
.base-style-button-secondary:disabled:active {
	box-shadow: none;
}
container-element.hidden {
	display: none;
}
container-element.minimize {
	min-width: unset;
}
container-element {
	position: fixed;
	top: 10%;
	left: 10%;
	z-index: 99999;
	text-align: left;
	min-width: 300px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: var(--ocs-text);
	box-shadow: 0 0 24px -12px var(--ocs-shadow-color);
	border-radius: 8px;
	letter-spacing: 0.5px;
	border: 1px solid var(--ocs-border);
}
header-element {
	display: flex;
	align-items: center;
	background-color: var(--ocs-surface);
	border-radius: 8px 8px 0px 0px;
	user-select: none;
	padding: 4px;
	padding-bottom: 0px;
}
header-element .extra-menu-bar {
	width: 100%;
	padding: 4px;
	padding-bottom: 0px;
	margin-top: 4px;
	border-top: 1px solid var(--ocs-border);
	/** 默认隐藏，一直到需要激活的时候再更改 */
	display: none;
}
header-element .extra-menu-bar .script-panel-link {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	border-radius: 4px;
	border: 1px solid var(--ocs-primary);
	color: var(--ocs-primary);
	cursor: pointer !important;
	margin-bottom: 4px;
	color: var(--ocs-text-2);
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	padding-bottom: 2px;
	margin-bottom: 0px;
}
header-element .extra-menu-bar .script-panel-link:active {
	box-shadow: 0px 0px 8px var(--ocs-ring);
}
header-element .extra-menu-bar .script-panel-link + header-element .extra-menu-bar .script-panel-link {
	margin-left: 12px;
}
header-element .extra-menu-bar .script-panel-link:hover {
	background-color: var(--ocs-primary-soft);
}
header-element .extra-menu-bar .script-panel-link.danger:hover {
	background-color: var(--ocs-danger-soft);
}
header-element .extra-menu-bar .script-panel-link:disabled {
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	color: var(--ocs-text-3);
	cursor: not-allowed;
}
header-element .extra-menu-bar .script-panel-link.danger {
	color: var(--ocs-danger);
	border-color: var(--ocs-danger);
}
header-element .extra-menu-bar .script-panel-link:disabled:active {
	box-shadow: none;
}
header-element .extra-menu-bar .script-panel-link.active {
	background-color: var(--ocs-primary-soft);
	border-color: var(--ocs-primary);
	color: var(--ocs-primary);
}
header-element .extra-menu-bar .script-panel-link + .script-panel-link {
	margin-left: 4px;
}
header-element .profile {
	flex: 1;
	cursor: move;
}
header-element .switch:hover,
header-element .dropdown:hover {
	background-color: var(--ocs-surface-2);
}
header-element .close:hover {
	background-color: var(--ocs-danger-soft);
}
header-element .switch,
header-element .close {
	cursor: pointer;
}
header-element .dropdown {
	line-height: 24px;
	text-decoration: underline;
}
header-element .switch,
header-element .close,
header-element .profile {
	display: inline-flex;
	align-items: center;
	padding: 0px 8px;
}
.logo {
	width: 18px;
	height: 18px;
	cursor: pointer;
}
.project-selector {
	display: flex;
	align-items: center;
}
.project-selector select {
	background: transparent;
	border-radius: 4px;
	border: 1px solid var(--ocs-divider);
	padding: 4px;
}
.project-selector.expand-all {
	display: none;
}
.body {
	overflow: auto;
	width: auto;
	height: 100%;
}
script-panel-element {
	display: block;
	background-color: var(--ocs-surface);
	border-radius: 0px 0px 8px 8px;
	padding: 0px 8px 12px 8px;
	overflow: auto;
}
script-panel-element .script-panel-body {
	padding: 0px 8px;
}
script-panel-element + script-panel-element {
	margin-top: 12px;
}
.card + .card {
	margin-top: 12px;
}
.card {
	background-color: var(--ocs-surface);
	border-radius: 2px;
	padding: 0px 8px;
}
.notes {
	background: color-mix(in srgb, var(--ocs-primary) 6%, transparent);
	border-left: 4px solid color-mix(in srgb, var(--ocs-primary) 45%, transparent);
	width: -webkit-fill-available;
	margin: 0px 8px;
	line-height: 26px;
	letter-spacing: 1px;
}
.secondary {
	font-size: 12px;
	color: var(--ocs-text-2);
}
.tooltip-container {
	z-index: 99999999999999;
	margin: 12px 0px 0px 12px;
	padding: 4px;
	color: var(--ocs-text);
	background: var(--ocs-surface-2);
	box-shadow: 0px 0px 4px var(--ocs-shadow-color);
	position: fixed;
	white-space: normal;
	max-width: 200px;
	height: auto;
	border-radius: 2px;
	line-height: 18px;
}
.configs-container.lock {
	filter: blur(1px);
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
}
.configs-container .lock-wrapper {
	cursor: not-allowed !important;
	border-radius: 4px;
	position: absolute;
	left: 0px;
	z-index: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
.configs-container .lock-message {
	background-color: color-mix(in srgb, var(--ocs-surface) 60%, transparent);
	border-radius: 4px;
	box-shadow: 0px 0px 12px var(--ocs-shadow-color);
	padding: 2px;
}
.configs {
	display: table;
	background: transparent;
	width: -webkit-fill-available;
}
.configs .configs-body {
	display: table-row-group;
}
.configs .configs-body config-element + config-element label {
	padding-top: 4px;
}
.configs .configs-body config-element + config-element .config-wrapper {
	padding-top: 4px;
}
.configs .configs-body config-element {
	width: 100%;
	display: table-row;
	line-height: 26px;
}
.configs .configs-body config-element label {
	white-space: nowrap;
	color: var(--ocs-text);
	display: table-cell;
	padding-right: 12px;
	text-align: left;
	vertical-align: top;
	margin-right: 12px;
}
.configs .configs-body config-element .config-wrapper {
	display: table-cell;
	vertical-align: middle;
	/** check box 的样式 */
}
.configs .configs-body config-element .config-wrapper select {
	outline: none;
	border: none;
	border: 1px solid var(--ocs-border);
	border-radius: 4px;
	padding: 2px 8px;
	border: 1px solid transparent;
}
.configs .configs-body config-element .config-wrapper select:focus {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
}
.configs .configs-body config-element .config-wrapper select:focus:not([type='checkbox'], [type='radio']) {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
	background-color: var(--ocs-surface) !important;
}
.configs .configs-body config-element .config-wrapper select:hover {
	background-color: var(--ocs-input-hover);
}
.configs .configs-body config-element .config-wrapper textarea {
	padding: 2px 8px;
	outline: none;
	border: none;
	border: 1px solid transparent;
}
.configs .configs-body config-element .config-wrapper textarea:focus {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
}
.configs .configs-body config-element .config-wrapper textarea:focus:not([type='checkbox'], [type='radio']) {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
	background-color: var(--ocs-surface) !important;
}
.configs .configs-body config-element .config-wrapper textarea:hover {
	background-color: var(--ocs-input-hover);
}
.configs .configs-body config-element .config-wrapper input:not([type='button']) {
	outline: none;
	padding: 2px 8px;
	margin: 0px;
	background-color: var(--ocs-input-bg);
	border-radius: 2px;
	color: var(--ocs-text);
	border: 1px solid transparent;
}
.configs .configs-body config-element .config-wrapper input:not([type='button'])::placeholder {
	color: var(--ocs-text-3);
}
.configs .configs-body config-element .config-wrapper input:not([type='button']):focus {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
}
.configs
	.configs-body
	config-element
	.config-wrapper
	input:not([type='button']):focus:not([type='checkbox'], [type='radio']) {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
	background-color: var(--ocs-surface) !important;
}
.configs .configs-body config-element .config-wrapper input:not([type='button']):hover {
	background-color: var(--ocs-input-hover);
}
.configs .configs-body config-element .config-wrapper input[type='range'] {
	padding: 0px;
}
.configs .configs-body config-element .config-wrapper input[type='button'] {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	border-radius: 4px;
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-primary);
	color: var(--ocs-primary);
	cursor: pointer !important;
	margin-bottom: 4px;
}
.configs .configs-body config-element .config-wrapper input[type='button']:active {
	box-shadow: 0px 0px 8px var(--ocs-ring);
}
.configs
	.configs-body
	config-element
	.config-wrapper
	input[type='button']
	+ .configs
	.configs-body
	config-element
	.config-wrapper
	input[type='button'] {
	margin-left: 12px;
}
.configs .configs-body config-element .config-wrapper input[type='button']:hover {
	background-color: var(--ocs-primary-soft);
}
.configs .configs-body config-element .config-wrapper input[type='button'].danger:hover {
	background-color: var(--ocs-danger-soft);
}
.configs .configs-body config-element .config-wrapper input[type='button']:disabled {
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	color: var(--ocs-text-3);
	cursor: not-allowed;
}
.configs .configs-body config-element .config-wrapper input[type='button'].danger {
	color: var(--ocs-danger);
	border-color: var(--ocs-danger);
}
.configs .configs-body config-element .config-wrapper input[type='button']:disabled:active {
	box-shadow: none;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox'] {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	width: fit-content;
	min-width: 48px;
	height: 20px;
	border-radius: 100px;
	display: flex;
	align-items: center;
	padding: 2px 4px;
	transition: all 0.2s ease-in-out;
	width: auto;
	background: var(--ocs-switch-off);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:checked {
	background: var(--ocs-primary);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:disabled {
	background-color: var(--ocs-disabled-bg);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:checked::before {
	transform: translate(24px, 0px);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']::before {
	background-color: #fff;
	border-radius: 9px;
	box-shadow: 0 2px 4px var(--ocs-shadow-color);
	width: 14px;
	height: 14px;
	content: '';
}
.configs .configs-body config-element .config-wrapper input:not([type='checkbox'], [type='radio']),
.configs .configs-body config-element .config-wrapper textarea,
.configs .configs-body config-element .config-wrapper select {
	width: -webkit-fill-available;
	font-size: inherit;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox'],
.configs .configs-body config-element .config-wrapper input[type='radio'],
.configs .configs-body config-element .config-wrapper input[type='range'] {
	accent-color: var(--ocs-primary);
}
.configs .configs-body config-element .config-wrapper > *:not(.tooltip) {
	background-color: var(--ocs-input-bg);
	border-radius: 2px;
	color: var(--ocs-text);
	float: right;
}
.configs .configs-body config-element .config-wrapper > *:disabled {
	cursor: not-allowed;
	background-color: var(--ocs-disabled-bg);
}
.message-container {
	margin-bottom: 4px;
	position: absolute;
	bottom: 100%;
	left: 50%;
	width: 100%;
	transform: translate(-50%, 0px);
	min-width: 300px;
}
.message-container message-element {
	display: flex;
	border-radius: 4px;
	padding: 4px 12px;
	margin-bottom: 4px;
}
.message-container message-element .message-content-container {
	margin-right: 8px;
	flex: auto;
}
.message-container message-element .message-text {
	letter-spacing: 1px;
	font-weight: bold;
}
.message-container message-element .message-closer {
	width: 18px;
	min-width: 18px;
	cursor: pointer;
	background-color: color-mix(in srgb, var(--ocs-surface) 70%, transparent);
	color: var(--ocs-text-3);
	border-radius: 100%;
	text-align: center;
	height: 18px;
	vertical-align: middle;
	font-size: 12px;
}
.message-container message-element.error {
	background-color: var(--ocs-danger-soft);
	color: var(--ocs-danger-text);
	border: 1px solid var(--ocs-danger);
}
.message-container message-element.info {
	background-color: var(--ocs-info-soft);
	color: var(--ocs-info-text);
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 40%, transparent);
}
.message-container message-element.success {
	background-color: var(--ocs-success-soft);
	color: var(--ocs-success-text);
	border: 1px solid color-mix(in srgb, var(--ocs-success) 50%, transparent);
}
.message-container message-element.warn {
	background-color: var(--ocs-warn-soft);
	color: var(--ocs-warn-text);
	border: 1px solid color-mix(in srgb, var(--ocs-warn) 70%, transparent);
}
modal-element {
	position: absolute;
	top: 50%;
	left: 50%;
	background-color: var(--ocs-surface);
	border-radius: 4px;
	box-shadow: 0px 0px 24px -12px var(--ocs-shadow-color);
	border: 1px solid var(--ocs-border);
	height: fit-content;
	transform: translate(-50%, -50%);
	padding: 12px 18px 18px 18px;
	font-family: var(--ocs-font);
	z-index: 99999999999;
	line-height: 24px;
}
modal-element .modal-profile {
	zoom: 0.9;
	color: var(--ocs-text-3);
	user-select: none;
	margin-bottom: 4px;
}
modal-element .modal-title {
	font-size: 18px;
	font-weight: bold;
	user-select: none;
}
modal-element .modal-body {
	margin: 12px 0px;
	overflow: auto;
}
modal-element .modal-footer {
	display: flex;
	white-space: nowrap;
	justify-content: end;
	align-items: end;
}
modal-element .modal-footer > * + * {
	margin-left: 12px;
}
modal-element .modal-input {
	outline: none;
	padding: 2px 8px;
	margin: 0px;
	background-color: var(--ocs-input-bg);
	border-radius: 2px;
	color: var(--ocs-text);
	border: 1px solid transparent;
	width: -webkit-fill-available;
}
modal-element .modal-input::placeholder {
	color: var(--ocs-text-3);
}
modal-element .modal-input:focus {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
}
modal-element .modal-input:focus:not([type='checkbox'], [type='radio']) {
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 56%, transparent);
	box-shadow: 0px 0px 4px var(--ocs-ring);
	background-color: var(--ocs-surface) !important;
}
modal-element .modal-input:hover {
	background-color: var(--ocs-input-hover);
}
modal-element .modal-cancel-button {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	border-radius: 4px;
	border: 1px solid var(--ocs-primary);
	color: var(--ocs-primary);
	cursor: pointer !important;
	margin-bottom: 4px;
	color: var(--ocs-text-2);
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
}
modal-element .modal-cancel-button:active {
	box-shadow: 0px 0px 8px var(--ocs-ring);
}
modal-element .modal-cancel-button + modal-element .modal-cancel-button {
	margin-left: 12px;
}
modal-element .modal-cancel-button:hover {
	background-color: var(--ocs-primary-soft);
}
modal-element .modal-cancel-button.danger:hover {
	background-color: var(--ocs-danger-soft);
}
modal-element .modal-cancel-button:disabled {
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	color: var(--ocs-text-3);
	cursor: not-allowed;
}
modal-element .modal-cancel-button.danger {
	color: var(--ocs-danger);
	border-color: var(--ocs-danger);
}
modal-element .modal-cancel-button:disabled:active {
	box-shadow: none;
}
modal-element .modal-confirm-button {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	border-radius: 4px;
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-primary);
	color: var(--ocs-primary);
	cursor: pointer !important;
	margin-bottom: 4px;
}
modal-element .modal-confirm-button:active {
	box-shadow: 0px 0px 8px var(--ocs-ring);
}
modal-element .modal-confirm-button + modal-element .modal-confirm-button {
	margin-left: 12px;
}
modal-element .modal-confirm-button:hover {
	background-color: var(--ocs-primary-soft);
}
modal-element .modal-confirm-button.danger:hover {
	background-color: var(--ocs-danger-soft);
}
modal-element .modal-confirm-button:disabled {
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	color: var(--ocs-text-3);
	cursor: not-allowed;
}
modal-element .modal-confirm-button.danger {
	color: var(--ocs-danger);
	border-color: var(--ocs-danger);
}
modal-element .modal-confirm-button:disabled:active {
	box-shadow: none;
}
modal-element.alert .modal-input,
modal-element.alert .modal-cancel-button {
	display: none;
}
modal-element.alert .modal-confirm-button {
	margin: 0;
}
modal-element.prompt .modal-input,
modal-element.prompt .modal-cancel-button,
modal-element.prompt .modal-confirm-button {
	display: block;
}
modal-element.confirm .modal-input {
	display: none;
}
.modal-wrapper {
	width: 100%;
	height: 100%;
	z-index: 9999;
	position: fixed;
	top: 0px;
	left: 0px;
	z-index: 9999999;
	background-color: rgba(0, 0, 0, 0.265);
	color: var(--ocs-text);
	font: 14px var(--ocs-font);
}
.pointer {
	cursor: pointer;
}
.separator {
	display: flex;
	align-items: center;
	text-align: center;
	padding: 4px 0px 8px 0px;
}
.separator::before,
.separator::after {
	content: '';
	flex: 1;
	border-bottom: 1px solid var(--ocs-divider);
}
.separator:not(:empty)::before {
	margin-right: 0.25em;
}
.separator:not(:empty)::after {
	margin-left: 0.25em;
}
container-element.minimize .body,
container-element.minimize header-element .dropdown,
container-element.minimize .footer {
	display: none;
}
container-element.minimize header-element {
	padding: 8px;
	border-radius: 8px;
	box-shadow: 0px 0px 24px -12px var(--ocs-shadow-color);
}
.user-guide > li {
	padding: 4px 0px;
}
.search-infos-num {
	width: 26px;
	margin: 2px;
	height: 20px;
	border-radius: 4px;
	display: inline-block;
	background-color: var(--ocs-surface);
	text-align: center;
	cursor: pointer;
	border: 1px solid var(--ocs-border-strong);
}
.search-infos-num.requested {
	border: 1px solid var(--ocs-primary-light);
	color: var(--ocs-primary-light);
}
.search-infos-num.active {
	background-color: var(--ocs-primary) !important;
	color: white;
}
.search-infos-num.error {
	border: 1px solid var(--ocs-danger);
	background-color: var(--ocs-danger);
	color: white;
}
.search-infos-num.finish {
	background-color: var(--ocs-primary-light);
	border: 1px solid var(--ocs-primary-light);
	color: white;
}
search-infos-element {
	display: block;
	overflow: auto;
}
search-infos-element .search-result {
	margin-bottom: 12px;
	padding-left: 12px;
}
search-infos-element .search-result .question {
	font-weight: bold;
	max-height: 200px;
	overflow: auto;
}
search-infos-element .search-result .answer {
	color: var(--ocs-text-2);
}
search-infos-element .search-result .answer code {
	border-bottom: 1px solid var(--ocs-border);
	padding: 2px 0px;
	border-radius: 2px;
	margin: 4px;
	line-height: 22px;
}
search-infos-element .search-result .answer code + code {
	margin-left: 4px;
}
search-infos-element .search-result .search-result-answer-tag {
	padding: 2px 6px;
	border-radius: 2px;
	font-size: 12px;
	cursor: pointer;
	margin-right: 6px;
}
search-infos-element .search-result .search-result-answer-tag + .search-result-answer-tag {
	margin-left: 4px;
}
search-infos-element .search-result .search-result-answer-tag.blue {
	background-color: var(--ocs-primary-soft);
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 40%, transparent);
	color: var(--ocs-primary);
}
search-infos-element .search-result .search-result-answer-tag.green {
	background-color: var(--ocs-success-soft);
	border: 1px solid color-mix(in srgb, var(--ocs-success) 45%, transparent);
	color: var(--ocs-success);
}
search-infos-element .search-result .search-result-answer-tag.gray {
	background-color: var(--ocs-surface-2);
	border: 1px solid var(--ocs-border);
	color: var(--ocs-text-2);
}
search-infos-element .search-result .search-result-answer-tag.red {
	background-color: var(--ocs-danger-soft);
	border: 1px solid color-mix(in srgb, var(--ocs-danger) 45%, transparent);
	color: var(--ocs-danger);
}
search-infos-element .search-result .search-result-answer-tag.yellow {
	background-color: var(--ocs-warn-soft);
	border: 1px solid color-mix(in srgb, var(--ocs-warn) 45%, transparent);
	color: var(--ocs-warn);
}
search-infos-element .search-result-question-type {
	background-color: var(--ocs-primary-soft);
	border: 1px solid color-mix(in srgb, var(--ocs-primary) 40%, transparent);
	color: var(--ocs-primary);
	margin-right: 8px;
	padding: 0px 4px;
	border-radius: 4px;
}
search-infos-element .error {
	color: var(--ocs-danger);
	display: inline-block;
	padding-left: 12px;
}
.copy,
.question-title-extra-btn {
	margin-left: 4px;
	padding: 2px 4px;
	border-radius: 2px;
	box-shadow: 0 0 4px var(--ocs-shadow-color);
	cursor: pointer !important;
	font-weight: normal;
	font-size: 12px;
}
.work-result-question-container {
	position: absolute;
	width: 400px;
	left: -100%;
	top: 0px;
	background: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	border-radius: 4px;
	box-shadow: 0px 0px 12px var(--ocs-shadow-color);
	padding: 12px;
}
.work-result-question-container .close-search-result {
	font-size: 12px;
	margin-left: 8px;
	text-decoration: underline;
	color: var(--ocs-text-2);
	cursor: pointer;
}
.work-result-list {
	max-height: 400px;
	overflow: auto;
	margin: 12px 0px;
	padding: 6px;
	border: 1px solid var(--ocs-border);
	border-radius: 4px;
}
.search-info-title {
	border: 1px solid var(--ocs-border);
	border-radius: 4px;
	padding: 8px 12px;
	margin-bottom: 12px;
	line-height: 20px;
	overflow: auto;
}
.search-info-title .title-content {
	max-height: 200px;
	overflow: auto;
}
.search-info-details {
	margin-left: 4px;
}
.console {
	max-height: 300px;
	max-width: 400px;
	overflow: auto;
	background-color: #292929;
	padding: 12px 6px;
	color: #ececec;
	font-size: 12px;
}
.console .item {
	padding: 3px 0px;
	border-radius: 2px;
}
.console .item .time {
	color: #757575;
}
.console .item .info {
	background-color: #2196f3a3;
}
.console .item .warn {
	background-color: #ffc107db;
}
.console .item .error {
	background-color: #f36c71cc;
}
.console .item .debug,
.console .item .log {
	background-color: #9e9e9ec4;
}
.console *::selection {
	background-color: #ffffff6b;
}
.markdown {
	max-width: 400px;
	max-height: 50vh;
	overflow: auto;
}
.markdown code {
	padding: 2px 4px;
	background-color: var(--ocs-surface-2);
	border-radius: 6px;
	font-size: 12px;
}
.markdown blockquote {
	padding: 4px 4px 4px 12px;
	margin: 0px;
	color: var(--ocs-text-3);
	border-left: var(--ocs-border-strong) 2px solid;
}
.markdown blockquote p {
	margin: 0px;
}
.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6,
.markdown p {
	margin: 8px 0px;
}
.dropdown {
	position: relative;
	display: inline-block;
}
.dropdown.active .dropdown-trigger-element {
	color: var(--ocs-primary);
}
.dropdown-trigger-element {
	cursor: pointer;
}
.dropdown-content {
	display: none;
	position: absolute;
	background-color: var(--ocs-surface);
	overflow: auto;
	box-shadow: 0px 8px 16px 0px var(--ocs-shadow-color);
	z-index: 1;
	border-radius: 4px;
	padding: 8px 12px;
	min-width: 120px;
}
.dropdown-content.show {
	display: block;
}
.dropdown-content {
	cursor: pointer;
	z-index: 999;
}
.dropdown-content .dropdown-option {
	padding-left: 4px;
	white-space: nowrap;
}
.dropdown-content .dropdown-option:hover {
	background-color: var(--ocs-surface-2);
}
.dropdown-content .dropdown-option.active {
	background-color: var(--ocs-primary-soft);
	color: var(--ocs-primary);
}
.space {
	display: inline-flex;
}
.config-details {
	animation: fade-in 0.5s;
}
.config-details label {
	padding-left: 12px;
}
.alert-info-wrapper {
	margin-bottom: 8px;
}
.alert-info-wrapper .result-info {
	padding: 12px;
	text-align: center;
	border-radius: 6px;
}
.alert-info-wrapper .unresolved {
	color: var(--ocs-text-3);
	background-color: var(--ocs-surface-2);
}
.alert-info-wrapper .no-answer {
	color: var(--ocs-text-3);
	background-color: var(--ocs-surface-2);
}
.alert-info-wrapper .error {
	color: var(--ocs-danger);
	background-color: var(--ocs-danger-soft);
}
message-element {
	animation: show 0.5s;
}
script-panel-element > div,
script-panel-link,
container-element,
modal-element {
	animation: fade-in 0.3s;
}
@keyframes show {
	0% {
		transform: translateY(20px);
		opacity: 0;
	}
	100% {
		transform: translateY(0);
		opacity: 1;
	}
}
@keyframes fade-in {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes fade-out {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
.checkbox-label {
	display: inline-block !important;
	position: relative;
	cursor: pointer;
	font-size: 16px;
	color: var(--ocs-text);
}
/* 隐藏原始复选框 */
.checkbox-input {
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
}
/* 自定义按钮样式 */
.checkbox-label::after {
	content: '';
	display: inline-block;
	border-radius: 50%;
	transition: all 0.1s ease;
	position: relative;
	margin-left: 4px;
	vertical-align: middle;
}
/* 向下箭头（未选中状态） */
.checkbox-label::before {
	content: '';
	position: absolute;
	width: 0;
	height: 0;
	right: 8px;
	transition: all 0.1s ease;
	z-index: 2;
}
/* 向上箭头（选中状态） */
.checked .checkbox-label::before {
	content: '';
}


/* ==================== 视觉细化（ai.12，覆盖上方旧样式） ==================== */
container-element {
	font-family: var(--ocs-font);
	font-size: 14px;
	line-height: 1.55;
	letter-spacing: 0.2px;
	color: var(--ocs-text);
	background: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	border-radius: var(--ocs-radius-lg);
	box-shadow: 0 12px 32px -12px var(--ocs-shadow-color), 0 2px 6px -2px var(--ocs-shadow-color);
	z-index: var(--ocs-z);
	max-width: calc(100vw - 16px);
}
header-element {
	background: var(--ocs-surface);
	border-radius: var(--ocs-radius-lg) var(--ocs-radius-lg) 0 0;
	padding: 6px 6px 0 6px;
}
header-element .switch,
header-element .close {
	border-radius: var(--ocs-radius-sm);
	min-height: 28px;
	transition: background-color 0.15s ease;
}
header-element .switch svg,
header-element .close svg {
	fill: currentColor;
}
header-element .dropdown {
	text-decoration: none;
	border-radius: var(--ocs-radius-sm);
}
header-element .extra-menu-bar {
	border-top-color: var(--ocs-divider);
	gap: 4px;
	flex-wrap: wrap;
}
header-element .extra-menu-bar .script-panel-link {
	border-radius: 999px;
	padding: 2px 12px;
	transition: all 0.15s ease;
}
container-element.minimize header-element {
	border-radius: var(--ocs-radius-lg);
	box-shadow: 0 8px 24px -10px var(--ocs-shadow-color);
}
script-panel-element {
	background: var(--ocs-surface);
	border-radius: 0 0 var(--ocs-radius-lg) var(--ocs-radius-lg);
}
.card {
	background: transparent;
	border-radius: var(--ocs-radius);
}
.notes {
	border-left-width: 3px;
	border-radius: 0 var(--ocs-radius-sm) var(--ocs-radius-sm) 0;
	padding: 6px 10px;
	color: var(--ocs-text-2);
	line-height: 1.7;
	letter-spacing: 0.2px;
}
.secondary {
	color: var(--ocs-text-2);
}
.separator {
	color: var(--ocs-text-2);
	font-size: 12px;
	font-weight: 600;
	letter-spacing: 1px;
	padding: 12px 0 6px 0;
}

/* 表单控件 */
.base-style-input,
.configs .configs-body config-element .config-wrapper input:not([type='button']),
.configs .configs-body config-element .config-wrapper select,
.configs .configs-body config-element .config-wrapper textarea,
modal-element .modal-input {
	border-radius: var(--ocs-radius-sm);
	padding: 4px 10px;
	color: var(--ocs-text);
	background-color: var(--ocs-input-bg);
	transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.configs .configs-body config-element .config-wrapper > *:not(.tooltip) {
	color: var(--ocs-text);
	border-radius: var(--ocs-radius-sm);
}
.configs .configs-body config-element .config-wrapper input:not([type='button']):focus,
.configs .configs-body config-element .config-wrapper select:focus,
.configs .configs-body config-element .config-wrapper textarea:focus,
.base-style-active-form-control:focus,
modal-element .modal-input:focus {
	border-color: var(--ocs-primary) !important;
	box-shadow: 0 0 0 3px var(--ocs-ring) !important;
	background-color: var(--ocs-surface) !important;
}
.configs .configs-body config-element label {
	color: var(--ocs-text-2);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox'],
.base-style-switch {
	min-width: 40px;
	height: 22px;
	padding: 3px;
	border-radius: 999px;
	cursor: pointer;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']::before,
.base-style-switch::before {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	transition: transform 0.2s ease;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:checked::before,
.base-style-switch:checked::before {
	transform: translate(18px, 0);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox'],
.configs .configs-body config-element .config-wrapper input[type='radio'],
.configs .configs-body config-element .config-wrapper input[type='range'] {
	accent-color: var(--ocs-primary);
}

/* 按钮 */
.base-style-button,
.base-style-button-secondary,
.configs .configs-body config-element .config-wrapper input[type='button'],
modal-element .modal-confirm-button,
modal-element .modal-cancel-button {
	border-radius: var(--ocs-radius-sm);
	padding: 4px 14px;
	font: inherit;
	font-size: 13px;
	line-height: 1.5;
	transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.base-style-button-secondary,
modal-element .modal-cancel-button {
	color: var(--ocs-text-2);
	background-color: var(--ocs-surface);
	border-color: var(--ocs-border);
}
.base-style-button-secondary:hover,
modal-element .modal-cancel-button:hover {
	color: var(--ocs-primary);
	border-color: var(--ocs-primary);
}
modal-element .modal-confirm-button {
	color: #fff;
	background-color: var(--ocs-primary);
	border-color: var(--ocs-primary);
}
modal-element .modal-confirm-button:hover {
	filter: brightness(1.08);
	background-color: var(--ocs-primary);
}
.base-style-button:active,
.base-style-button-secondary:active,
.configs .configs-body config-element .config-wrapper input[type='button']:active,
modal-element .modal-confirm-button:active,
modal-element .modal-cancel-button:active {
	box-shadow: 0 0 0 3px var(--ocs-ring);
}
.base-style-button:disabled,
.base-style-button-secondary:disabled,
.configs .configs-body config-element .config-wrapper input[type='button']:disabled {
	background-color: var(--ocs-disabled-bg);
	border-color: var(--ocs-border);
	color: var(--ocs-text-3);
}
.base-style-button + .base-style-button,
.base-style-button-secondary + .base-style-button-secondary {
	margin-left: 8px;
}
:focus-visible {
	outline: 2px solid var(--ocs-primary);
	outline-offset: 1px;
}

/* AI 运行状态胶囊 */
.ocs-ai-status {
	font-weight: 600;
	border-radius: 999px !important;
	padding-left: 24px !important;
	background-repeat: no-repeat !important;
	background-position: 10px center !important;
	background-size: 8px 8px !important;
	text-overflow: ellipsis;
	cursor: default;
}
.ocs-ai-status[data-ai-state='idle'] {
	color: var(--ocs-text-2) !important;
	background-image: radial-gradient(circle, var(--ocs-text-3) 60%, transparent 62%) !important;
}
.ocs-ai-status[data-ai-state='busy'] {
	color: var(--ocs-primary) !important;
	background-color: var(--ocs-primary-soft) !important;
	background-image: radial-gradient(circle, var(--ocs-primary) 60%, transparent 62%) !important;
	animation: ocs-pulse 1.2s ease-in-out infinite;
}
.ocs-ai-status[data-ai-state='ok'] {
	color: var(--ocs-success-text) !important;
	background-color: var(--ocs-success-soft) !important;
	background-image: radial-gradient(circle, var(--ocs-success) 60%, transparent 62%) !important;
}
.ocs-ai-status[data-ai-state='error'] {
	color: var(--ocs-danger-text) !important;
	background-color: var(--ocs-danger-soft) !important;
	background-image: radial-gradient(circle, var(--ocs-danger) 60%, transparent 62%) !important;
}
@keyframes ocs-pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.65; }
}

/* 消息条 */
.message-container message-element {
	border-radius: var(--ocs-radius);
	padding: 8px 12px;
	box-shadow: 0 6px 18px -10px var(--ocs-shadow-color);
	backdrop-filter: blur(6px);
}
.message-container message-element .message-text {
	font-weight: 600;
	letter-spacing: 0.3px;
}

/* 弹窗 */
.modal-wrapper {
	z-index: calc(var(--ocs-z) + 10);
	background-color: rgba(15, 23, 42, 0.38);
	backdrop-filter: blur(2px);
	color: var(--ocs-text);
}
modal-element {
	font-family: var(--ocs-font);
	background-color: var(--ocs-surface);
	color: var(--ocs-text);
	border: 1px solid var(--ocs-border);
	border-radius: var(--ocs-radius-lg);
	box-shadow: 0 24px 48px -16px var(--ocs-shadow-color);
	padding: 16px 20px 18px 20px;
	max-width: calc(100vw - 32px);
	max-height: calc(100vh - 32px);
	overflow: auto;
	box-sizing: border-box;
}
modal-element .modal-profile {
	color: var(--ocs-text-3);
}
modal-element .modal-title {
	font-size: 16px;
	font-weight: 700;
	color: var(--ocs-text);
}
modal-element .modal-footer > * + * {
	margin-left: 8px;
}

/* 提示气泡 */
.tooltip-container {
	z-index: calc(var(--ocs-z) + 20);
	color: var(--ocs-surface);
	background: var(--ocs-text);
	box-shadow: 0 6px 16px -6px var(--ocs-shadow-color);
	border-radius: var(--ocs-radius-sm);
	padding: 6px 10px;
	font-size: 12px;
	max-width: 260px;
}

/* 下拉菜单 */
.dropdown-content {
	background-color: var(--ocs-surface);
	border: 1px solid var(--ocs-border);
	border-radius: var(--ocs-radius);
	box-shadow: 0 12px 28px -12px var(--ocs-shadow-color);
	padding: 6px;
	z-index: calc(var(--ocs-z) + 5);
}
.dropdown-content .dropdown-option {
	padding: 4px 8px;
	border-radius: var(--ocs-radius-sm);
}

/* 搜题结果 / 题号 */
.search-infos-num {
	border-radius: var(--ocs-radius-sm);
	background-color: var(--ocs-surface);
	transition: all 0.15s ease;
}
.search-infos-num.active {
	background-color: var(--ocs-primary) !important;
	border-color: var(--ocs-primary);
	color: #fff;
}
.search-infos-num.finish {
	background-color: var(--ocs-success);
	border-color: var(--ocs-success);
	color: #fff;
}
.search-infos-num.error {
	background-color: var(--ocs-danger);
	border-color: var(--ocs-danger);
	color: #fff;
}
search-infos-element .search-result .search-result-answer-tag,
search-infos-element .search-result-question-type {
	border-radius: 999px;
	padding: 1px 8px;
}
.work-result-question-container {
	width: min(400px, calc(100vw - 32px));
	background: var(--ocs-surface);
	border-radius: var(--ocs-radius);
	box-shadow: 0 12px 28px -12px var(--ocs-shadow-color);
}
.work-result-list,
.search-info-title {
	border-radius: var(--ocs-radius);
}
.console {
	max-width: min(400px, calc(100vw - 32px));
	border-radius: var(--ocs-radius);
	font-family: var(--ocs-font-mono);
}
.markdown {
	max-width: min(400px, calc(100vw - 32px));
}
.markdown code {
	background-color: var(--ocs-surface-2);
	font-family: var(--ocs-font-mono);
}
.alert-info-wrapper .unresolved,
.alert-info-wrapper .no-answer {
	color: var(--ocs-text-3);
	background-color: var(--ocs-surface-2);
}

/* 折叠箭头：SVG 风格 chevron 替代 emoji */
.checkbox-label {
	color: var(--ocs-text);
	font-size: 14px;
	font-weight: 600;
	padding-right: 22px;
}
.checkbox-label::before {
	width: 7px;
	height: 7px;
	top: 50%;
	right: 6px;
	border-right: 2px solid var(--ocs-text-2);
	border-bottom: 2px solid var(--ocs-text-2);
	transform: translateY(-70%) rotate(45deg);
	transition: transform 0.2s ease;
}
.checked .checkbox-label::before {
	transform: translateY(-30%) rotate(-135deg);
}

/* 滚动条 */
.body,
script-panel-element,
.work-result-list,
.markdown,
.console,
modal-element {
	scrollbar-width: thin;
	scrollbar-color: var(--ocs-border-strong) transparent;
}
.body::-webkit-scrollbar,
script-panel-element::-webkit-scrollbar,
.work-result-list::-webkit-scrollbar,
.markdown::-webkit-scrollbar,
modal-element::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}
.body::-webkit-scrollbar-thumb,
script-panel-element::-webkit-scrollbar-thumb,
.work-result-list::-webkit-scrollbar-thumb,
.markdown::-webkit-scrollbar-thumb,
modal-element::-webkit-scrollbar-thumb {
	background: var(--ocs-border-strong);
	border-radius: 999px;
}

/* 知识库管理（原内联样式改为类） */
.ocs-kb-list {
	margin-top: 8px;
	max-height: 280px;
	overflow-y: auto;
	border: 1px solid var(--ocs-border);
	border-radius: var(--ocs-radius);
	background: var(--ocs-surface-2);
}
.ocs-kb-drop {
	margin-top: 10px;
	padding: 18px 14px;
	border: 1.5px dashed var(--ocs-border-strong);
	border-radius: var(--ocs-radius);
	text-align: center;
	color: var(--ocs-text-2);
	background: var(--ocs-surface-2);
	cursor: pointer;
	transition: border-color 0.15s ease, background-color 0.15s ease;
}
.ocs-kb-drop.dragover,
.ocs-kb-drop:hover {
	border-color: var(--ocs-primary);
	background: var(--ocs-primary-soft);
	color: var(--ocs-primary);
}

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
@media (max-width: 480px) {
	container-element {
		min-width: 0;
		width: calc(100vw - 16px);
	}
	.message-container {
		min-width: 0;
	}
}

/* ==================== 品牌主题「灵课 AI」（ai.13） ==================== */
:host {
	--ocs-primary: #4f46e5;
	--ocs-primary-light: #818cf8;
	--ocs-primary-soft: #4f46e514;
	--ocs-ring: #6366f140;
	--ocs-brand-from: #6366f1;
	--ocs-brand-to: #a855f7;
	--ocs-brand-gradient: linear-gradient(135deg, var(--ocs-brand-from), var(--ocs-brand-to));
	--ocs-info-soft: #eef2ff;
	--ocs-info-text: #4338ca;
}
:host([data-ocs-theme='dark']) {
	--ocs-primary: #818cf8;
	--ocs-primary-light: #a5b4fc;
	--ocs-primary-soft: #818cf822;
	--ocs-ring: #818cf855;
	--ocs-brand-from: #818cf8;
	--ocs-brand-to: #c084fc;
	--ocs-info-soft: #818cf81f;
	--ocs-info-text: #c7d2fe;
}
@media (prefers-color-scheme: dark) {
	:host(:not([data-ocs-theme='light'])) {
		--ocs-primary: #818cf8;
		--ocs-primary-light: #a5b4fc;
		--ocs-primary-soft: #818cf822;
		--ocs-ring: #818cf855;
		--ocs-brand-from: #818cf8;
		--ocs-brand-to: #c084fc;
		--ocs-info-soft: #818cf81f;
		--ocs-info-text: #c7d2fe;
	}
}
container-element {
	overflow: hidden;
}
container-element::before {
	content: '';
	position: absolute;
	inset: 0 0 auto 0;
	height: 3px;
	background: var(--ocs-brand-gradient);
	z-index: 1;
	pointer-events: none;
}
header-element {
	padding-top: 8px;
}
header-element .profile {
	padding: 0 6px;
}
.ocs-brand {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	user-select: none;
}
.ocs-brand-logo {
	width: 22px;
	height: 22px;
	border-radius: 6px;
	flex: none;
	box-shadow: 0 2px 6px -2px var(--ocs-brand-from);
	pointer-events: none;
}
.ocs-brand-name {
	font-weight: 700;
	font-size: 14px;
	letter-spacing: 0.5px;
	background: var(--ocs-brand-gradient);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	white-space: nowrap;
}
.ocs-brand-version {
	font-size: 11px;
	font-weight: 600;
	color: var(--ocs-text-3);
	background: var(--ocs-surface-2);
	border: 1px solid var(--ocs-border);
	border-radius: 999px;
	padding: 0 7px;
	line-height: 17px;
	white-space: nowrap;
}
container-element.minimize .ocs-brand-version {
	display: none;
}
container-element.minimize::before {
	display: none;
}
container-element.minimize {
	border-radius: 999px;
}
container-element.minimize header-element {
	border-radius: 999px;
	padding: 6px 8px;
	box-shadow: none;
}
header-element .extra-menu-bar .script-panel-link.active {
	color: #fff;
	border-color: transparent;
	background: var(--ocs-brand-gradient);
	box-shadow: 0 4px 10px -6px var(--ocs-brand-from);
}
header-element .extra-menu-bar .script-panel-link:not(.active):hover {
	color: var(--ocs-primary);
	border-color: var(--ocs-primary);
	background-color: var(--ocs-primary-soft);
}
.dropdown.active .dropdown-trigger-element {
	color: var(--ocs-primary);
	font-weight: 600;
}
modal-element .modal-confirm-button,
.base-style-button {
	color: #fff;
	border-color: transparent;
	background: var(--ocs-brand-gradient);
	box-shadow: 0 4px 12px -6px var(--ocs-brand-from);
}
modal-element .modal-confirm-button:hover,
.base-style-button:hover {
	background: var(--ocs-brand-gradient);
	filter: brightness(1.08);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:checked,
.base-style-switch:checked {
	background: var(--ocs-brand-gradient);
}
.notes {
	background: var(--ocs-primary-soft);
	border-left-color: var(--ocs-primary-light);
}
.separator {
	color: var(--ocs-primary);
}
.separator::before,
.separator::after {
	border-bottom-color: var(--ocs-divider);
}
.search-infos-num.active {
	background: var(--ocs-brand-gradient) !important;
	border-color: transparent;
}
`;

/* eslint-disable no-undef */
/// <reference path="./global.d.ts" />

// 环境检测：缺失列表由文件顶部的兼容层在补齐前记录，仅告警、不阻塞
(function () {
	const critical = (typeof __OCS_MISSING_GM__ !== 'undefined' ? __OCS_MISSING_GM__ : []).filter(
		(api) => !['GM_registerMenuCommand', 'GM_getResourceText', 'GM_notification', 'GM_info'].includes(api)
	);
	if (!critical.length) return;
	const msg = '当前脚本管理器缺少 ' + critical.join('、') + '，已降级运行（存储改用 localStorage，网络请求改用 fetch，可能受跨域限制）。建议使用 Tampermonkey 或 ScriptCat。';
	console.warn('[OCS] ' + msg);
	setTimeout(() => {
		try {
			OCS.$message.warn({ content: msg, duration: 0 });
		} catch (e) {}
	}, 3000);
})();

const { start, definedProjects, CommonProject, RenderScript } = OCS;

const infos = GM_info;

(function () {
	'use strict';

	const projects = definedProjects();

	// 运行脚本
	start({
		projects: projects,
		renderConfig: {
			renderScript: RenderScript,
			styles: [STYLE],
			defaultPanelName: CommonProject.scripts.guide.namespace,
			// 品牌名称：可改成你喜欢的名字，“|” 后为版本标签
			title: `灵课 AI|v${infos.script.version}`
		}
	});

	// 应用界面主题（跟随系统 / 浅色 / 深色）
	try {
		OCS.initOCSTheme();
	} catch (e) {}
})();
