import { r as __toESM, t as __commonJSMin } from "./chunk-B-1-B7_t.js";
import { t as require_react } from "./react.js";
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
/**
* @license React
* use-sync-external-store-shim.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		function is(x, y) {
			return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
		}
		function useSyncExternalStore$2(subscribe, getSnapshot) {
			didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
			var value = getSnapshot();
			if (!didWarnUncachedGetSnapshot) {
				var cachedValue = getSnapshot();
				objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
			}
			cachedValue = useState({ inst: {
				value,
				getSnapshot
			} });
			var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
			useLayoutEffect(function() {
				inst.value = value;
				inst.getSnapshot = getSnapshot;
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			}, [
				subscribe,
				value,
				getSnapshot
			]);
			useEffect(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				return subscribe(function() {
					checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				});
			}, [subscribe]);
			useDebugValue(value);
			return value;
		}
		function checkIfSnapshotChanged(inst) {
			var latestGetSnapshot = inst.getSnapshot;
			inst = inst.value;
			try {
				var nextValue = latestGetSnapshot();
				return !objectIs(inst, nextValue);
			} catch (error) {
				return !0;
			}
		}
		function useSyncExternalStore$1(subscribe, getSnapshot) {
			return getSnapshot();
		}
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var React = require_react(), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
		exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
}));
//#endregion
//#region node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_development();
}));
//#endregion
//#region node_modules/wouter/src/use-sync-external-store.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_shim = require_shim();
//#endregion
//#region node_modules/wouter/src/react-deps.js
var useBuiltinInsertionEffect = import_react.useInsertionEffect;
var useIsomorphicLayoutEffect = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined") ? import_react.useLayoutEffect : import_react.useEffect;
var useInsertionEffect = useBuiltinInsertionEffect || useIsomorphicLayoutEffect;
var useEvent = (fn) => {
	const ref = import_react.useRef([fn, (...args) => ref[0](...args)]).current;
	useInsertionEffect(() => {
		ref[0] = fn;
	});
	return ref[1];
};
//#endregion
//#region node_modules/wouter/src/use-browser-location.js
/**
* History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
*/
var eventPopstate = "popstate";
var eventPushState = "pushState";
var eventReplaceState = "replaceState";
var events = [
	eventPopstate,
	eventPushState,
	eventReplaceState,
	"hashchange"
];
var subscribeToLocationUpdates = (callback) => {
	for (const event of events) addEventListener(event, callback);
	return () => {
		for (const event of events) removeEventListener(event, callback);
	};
};
var useLocationProperty = (fn, ssrFn) => (0, import_shim.useSyncExternalStore)(subscribeToLocationUpdates, fn, ssrFn);
var currentSearch = () => location.search;
var useSearch = ({ ssrSearch } = {}) => useLocationProperty(currentSearch, ssrSearch != null ? () => ssrSearch : currentSearch);
var currentPathname = () => location.pathname;
var usePathname = ({ ssrPath } = {}) => useLocationProperty(currentPathname, ssrPath != null ? () => ssrPath : currentPathname);
var currentHistoryState = () => history.state;
var useHistoryState = () => useLocationProperty(currentHistoryState, () => null);
var navigate = (to, { replace = false, state = null } = {}) => history[replace ? eventReplaceState : eventPushState](state, "", to);
var useBrowserLocation = (opts = {}) => [usePathname(opts), navigate];
var patchKey = Symbol.for("wouter_v3");
if (typeof history !== "undefined" && typeof window[patchKey] === "undefined") {
	for (const type of [eventPushState, eventReplaceState]) {
		const original = history[type];
		history[type] = function() {
			const result = original.apply(this, arguments);
			const event = new Event(type);
			event.arguments = arguments;
			dispatchEvent(event);
			return result;
		};
	}
	Object.defineProperty(window, patchKey, { value: true });
}
//#endregion
export { usePathname as a, useEvent as c, useLocationProperty as i, useIsomorphicLayoutEffect as l, useBrowserLocation as n, useSearch as o, useHistoryState as r, import_react as s, navigate as t };

//# sourceMappingURL=use-browser-location-Ca5SOgfI.js.map