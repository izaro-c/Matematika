import { c as useEvent, l as useIsomorphicLayoutEffect, n as useBrowserLocation, o as useSearch$1, s as import_react } from "./use-browser-location-Ca5SOgfI.js";
//#region node_modules/regexparam/dist/index.mjs
/**
* @param {string|RegExp} input The route pattern
* @param {boolean} [loose] Allow open-ended matching. Ignored with `RegExp` input.
*/
function parse(input, loose) {
	if (input instanceof RegExp) return {
		keys: false,
		pattern: input
	};
	var c, o, tmp, ext, keys = [], pattern = "", arr = input.split("/");
	arr[0] || arr.shift();
	while (tmp = arr.shift()) {
		c = tmp[0];
		if (c === "*") {
			keys.push(c);
			pattern += tmp[1] === "?" ? "(?:/(.*))?" : "/(.*)";
		} else if (c === ":") {
			o = tmp.indexOf("?", 1);
			ext = tmp.indexOf(".", 1);
			keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length));
			pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
			if (!!~ext) pattern += (!!~o ? "?" : "") + "\\" + tmp.substring(ext);
		} else pattern += "/" + tmp;
	}
	return {
		keys,
		pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i")
	};
}
//#endregion
//#region node_modules/wouter/src/paths.js
var _relativePath = (base, path) => !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || "/" : "~" + path;
/**
* When basepath is `undefined` or '/' it is ignored (we assume it's empty string)
*/
var baseDefaults = (base = "") => base === "/" ? "" : base;
var absolutePath = (to, base) => to[0] === "~" ? to.slice(1) : baseDefaults(base) + to;
var relativePath = (base = "", path) => _relativePath(unescape(baseDefaults(base)), unescape(path));
var stripQm = (str) => str[0] === "?" ? str.slice(1) : str;
var unescape = (str) => {
	try {
		return decodeURI(str);
	} catch (_e) {
		return str;
	}
};
var sanitizeSearch = (search) => unescape(stripQm(search));
//#endregion
//#region node_modules/wouter/src/index.js
var defaultRouter = {
	hook: useBrowserLocation,
	searchHook: useSearch$1,
	parser: parse,
	base: "",
	ssrPath: void 0,
	ssrSearch: void 0,
	ssrContext: void 0,
	hrefs: (x) => x,
	aroundNav: (n, t, o) => n(t, o)
};
var RouterCtx = (0, import_react.createContext)(defaultRouter);
var useRouter = () => (0, import_react.useContext)(RouterCtx);
/**
* Parameters context. Used by `useParams()` to get the
* matched params from the innermost `Route` component.
*/
var Params0 = {}, ParamsCtx = (0, import_react.createContext)(Params0);
var useParams = () => (0, import_react.useContext)(ParamsCtx);
var useLocationFromRouter = (router) => {
	const [location, navigate] = router.hook(router);
	return [relativePath(router.base, location), useEvent((to, opts) => router.aroundNav(navigate, absolutePath(to, router.base), opts))];
};
var useLocation = () => useLocationFromRouter(useRouter());
var useSearch = () => {
	const router = useRouter();
	return sanitizeSearch(router.searchHook(router));
};
var matchRoute = (parser, route, path, loose) => {
	const { pattern, keys } = route instanceof RegExp ? {
		keys: false,
		pattern: route
	} : parser(route || "*", loose);
	const result = pattern.exec(path) || [];
	const [$base, ...matches] = result;
	return $base !== void 0 ? [
		true,
		(() => {
			const groups = keys !== false ? Object.fromEntries(keys.map((key, i) => [key, matches[i]])) : result.groups;
			let obj = { ...matches };
			groups && Object.assign(obj, groups);
			return obj;
		})(),
		...loose ? [$base] : []
	] : [false, null];
};
var useRoute = (pattern) => matchRoute(useRouter().parser, pattern, useLocation()[0]);
var Router = ({ children, ...props }) => {
	const parent_ = useRouter();
	const parent = props.hook ? defaultRouter : parent_;
	let value = parent;
	const [path, search = props.ssrSearch ?? ""] = props.ssrPath?.split("?") ?? [];
	if (path) props.ssrSearch = search, props.ssrPath = path;
	props.hrefs = props.hrefs ?? props.hook?.hrefs;
	props.searchHook = props.searchHook ?? props.hook?.searchHook;
	let ref = (0, import_react.useRef)({}), prev = ref.current, next = prev;
	for (let k in parent) {
		const option = k === "base" ? parent[k] + (props[k] ?? "") : props[k] ?? parent[k];
		if (prev === next && option !== next[k]) ref.current = next = { ...next };
		next[k] = option;
		if (option !== parent[k] || option !== value[k]) value = next;
	}
	return (0, import_react.createElement)(RouterCtx.Provider, {
		value,
		children
	});
};
var h_route = ({ children, component }, params) => {
	if (component) return (0, import_react.createElement)(component, { params });
	return typeof children === "function" ? children(params) : children;
};
var useCachedParams = (value) => {
	let prev = (0, import_react.useRef)(Params0);
	const curr = prev.current;
	return prev.current = Object.keys(value).length !== Object.keys(curr).length || Object.entries(value).some(([k, v]) => v !== curr[k]) ? value : curr;
};
function useSearchParams() {
	const [location, navigate] = useLocation();
	const search = useSearch();
	const searchParams = (0, import_react.useMemo)(() => new URLSearchParams(search), [search]);
	let tempSearchParams = searchParams;
	return [searchParams, useEvent((nextInit, options) => {
		tempSearchParams = new URLSearchParams(typeof nextInit === "function" ? nextInit(tempSearchParams) : nextInit);
		navigate(location + (tempSearchParams.size ? "?" + tempSearchParams : ""), options);
	})];
}
var Route = ({ path, nest, match, ...renderProps }) => {
	const router = useRouter();
	const [location] = useLocationFromRouter(router);
	const [matches, routeParams, base] = match ?? matchRoute(router.parser, path, location, nest);
	const params = useCachedParams({
		...useParams(),
		...routeParams
	});
	if (!matches) return null;
	const children = base ? (0, import_react.createElement)(Router, { base }, h_route(renderProps, params)) : h_route(renderProps, params);
	return (0, import_react.createElement)(ParamsCtx.Provider, {
		value: params,
		children
	});
};
var Link = (0, import_react.forwardRef)((props, ref) => {
	const router = useRouter();
	const [currentPath, navigate] = useLocationFromRouter(router);
	const { to = "", href: targetPath = to, onClick: _onClick, asChild, children, className: cls, replace, state, transition, ...restProps } = props;
	const onClick = useEvent((event) => {
		if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return;
		_onClick?.(event);
		if (!event.defaultPrevented) {
			event.preventDefault();
			navigate(targetPath, props);
		}
	});
	const href = router.hrefs(targetPath[0] === "~" ? targetPath.slice(1) : router.base + targetPath, router);
	return asChild && (0, import_react.isValidElement)(children) ? (0, import_react.cloneElement)(children, {
		onClick,
		href
	}) : (0, import_react.createElement)("a", {
		...restProps,
		onClick,
		href,
		className: cls?.call ? cls(currentPath === targetPath) : cls,
		children,
		ref
	});
});
var flattenChildren = (children) => Array.isArray(children) ? children.flatMap((c) => flattenChildren(c && c.type === import_react.Fragment ? c.props.children : c)) : [children];
var Switch = ({ children, location }) => {
	const router = useRouter();
	const [originalLocation] = useLocationFromRouter(router);
	for (const element of flattenChildren(children)) {
		let match = 0;
		if ((0, import_react.isValidElement)(element) && (match = matchRoute(router.parser, element.props.path, location || originalLocation, element.props.nest))[0]) return (0, import_react.cloneElement)(element, { match });
	}
	return null;
};
var Redirect = (props) => {
	const { to, href = to } = props;
	const router = useRouter();
	const [, navigate] = useLocationFromRouter(router);
	const redirect = useEvent(() => navigate(to || href, props));
	const { ssrContext } = router;
	useIsomorphicLayoutEffect(() => {
		redirect();
	}, []);
	if (ssrContext) ssrContext.redirectTo = to;
	return null;
};
//#endregion
export { Link, Redirect, Route, Router, Switch, matchRoute, useLocation, useParams, useRoute, useRouter, useSearch, useSearchParams };

//# sourceMappingURL=wouter.js.map