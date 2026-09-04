var Qn = Object.defineProperty;
var Us = (s) => {
  throw TypeError(s);
};
var ea = (s, e, t) => e in s ? Qn(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var A = (s, e, t) => ea(s, typeof e != "symbol" ? e + "" : e, t), cs = (s, e, t) => e.has(s) || Us("Cannot " + t);
var h = (s, e, t) => (cs(s, e, "read from private field"), t ? t.call(s) : e.get(s)), R = (s, e, t) => e.has(s) ? Us("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), b = (s, e, t, n) => (cs(s, e, "write to private field"), n ? n.call(s, t) : e.set(s, t), t), C = (s, e, t) => (cs(s, e, "access private method"), t);
var Ds = (s, e, t, n) => ({
  set _(a) {
    b(s, e, a, t);
  },
  get _() {
    return h(s, e, n);
  }
});
var Ps = (s, e, t) => (n, a) => {
  let r = -1;
  return i(0);
  async function i(o) {
    if (o <= r)
      throw new Error("next() called multiple times");
    r = o;
    let c, d = !1, l;
    if (s[o] ? (l = s[o][0][0], n.req.routeIndex = o) : l = o === s.length && a || void 0, l)
      try {
        c = await l(n, () => i(o + 1));
      } catch (u) {
        if (u instanceof Error && e)
          n.error = u, c = await e(u, n), d = !0;
        else
          throw u;
      }
    else
      n.finalized === !1 && t && (c = await t(n));
    return c && (n.finalized === !1 || d) && (n.res = c), n;
  }
}, ta = /* @__PURE__ */ Symbol(), sa = (s, e) => new Response(s, {
  headers: {
    // Normalize the media type (case-insensitive) while keeping parameters like the boundary
    "Content-Type": e.replace(/^[^;]+/, (n) => n.toLowerCase())
  }
}).formData(), Jt = (s) => "headers" in s, na = async (s, e = /* @__PURE__ */ Object.create(null)) => {
  const { all: t = !1, dot: n = !1 } = e, r = (Jt(s) ? s.headers : s.raw.headers).get("Content-Type"), i = r == null ? void 0 : r.split(";")[0].trim().toLowerCase();
  return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? aa(s, { all: t, dot: n }) : {};
};
async function aa(s, e) {
  if (!Jt(s) && s.bodyCache.formData)
    return Ls(
      await s.bodyCache.formData,
      e
    );
  const t = Jt(s) ? s.headers : s.raw.headers, n = await s.arrayBuffer(), a = sa(n, t.get("Content-Type") || "");
  Jt(s) || (s.bodyCache.formData = a);
  const r = await a;
  return r ? Ls(r, e) : {};
}
function Ls(s, e) {
  const t = /* @__PURE__ */ Object.create(null);
  return s.forEach((n, a) => {
    e.all || a.endsWith("[]") ? ra(t, a, n) : t[a] = n;
  }), e.dot && Object.entries(t).forEach(([n, a]) => {
    n.includes(".") && (ia(t, n, a), delete t[n]);
  }), t;
}
var ra = (s, e, t) => {
  s[e] !== void 0 ? Array.isArray(s[e]) ? s[e].push(t) : s[e] = [s[e], t] : e.endsWith("[]") ? s[e] = [t] : s[e] = t;
}, ia = (s, e, t) => {
  if (/(?:^|\.)__proto__\./.test(e))
    return;
  let n = s;
  const a = e.split(".");
  a.forEach((r, i) => {
    i === a.length - 1 ? n[r] = t : ((!n[r] || typeof n[r] != "object" || Array.isArray(n[r]) || n[r] instanceof File) && (n[r] = /* @__PURE__ */ Object.create(null)), n = n[r]);
  });
}, vn = (s) => {
  const e = s.split("/");
  return e[0] === "" && e.shift(), e;
}, oa = (s) => {
  const { groups: e, path: t } = ca(s), n = vn(t);
  return da(n, e);
}, ca = (s) => {
  const e = [];
  return s = s.replace(/\{[^}]+\}/g, (t, n) => {
    const a = `@${n}`;
    return e.push([a, t]), a;
  }), { groups: e, path: s };
}, da = (s, e) => {
  for (let t = e.length - 1; t >= 0; t--) {
    const [n] = e[t];
    for (let a = s.length - 1; a >= 0; a--)
      if (s[a].includes(n)) {
        s[a] = s[a].replace(n, e[t][1]);
        break;
      }
  }
  return s;
}, Ft = {}, la = (s, e) => {
  if (s === "*")
    return "*";
  const t = s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (t) {
    const n = `${s}#${e}`;
    return Ft[n] || (t[2] ? Ft[n] = e && e[0] !== ":" && e[0] !== "*" ? [n, t[1], new RegExp(`^${t[2]}(?=/${e})`)] : [s, t[1], new RegExp(`^${t[2]}$`)] : Ft[n] = [s, t[1], !0]), Ft[n];
  }
  return null;
}, Ss = (s, e) => {
  try {
    return e(s);
  } catch {
    return s.replace(/(?:%[0-9A-Fa-f]{2})+/g, (t) => {
      try {
        return e(t);
      } catch {
        return t;
      }
    });
  }
}, ua = (s) => Ss(s, decodeURI), wn = (s) => {
  const e = s.url, t = e.indexOf("/", e.indexOf(":") + 4);
  let n = t;
  for (; n < e.length; n++) {
    const a = e.charCodeAt(n);
    if (a === 37) {
      const r = e.indexOf("?", n), i = e.indexOf("#", n), o = r === -1 ? i === -1 ? void 0 : i : i === -1 ? r : Math.min(r, i), c = e.slice(t, o);
      return ua(c.includes("%25") ? c.replace(/%25/g, "%2525") : c);
    } else if (a === 63 || a === 35)
      break;
  }
  return e.slice(t, n);
}, ha = (s) => {
  const e = wn(s);
  return e.length > 1 && e.at(-1) === "/" ? e.slice(0, -1) : e;
}, Pe = (s, e, ...t) => (t.length && (e = Pe(e, ...t)), `${(s == null ? void 0 : s[0]) === "/" ? "" : "/"}${s}${e === "/" ? "" : `${(s == null ? void 0 : s.at(-1)) === "/" ? "" : "/"}${(e == null ? void 0 : e[0]) === "/" ? e.slice(1) : e}`}`), In = (s) => {
  if (s.charCodeAt(s.length - 1) !== 63 || !s.includes(":"))
    return null;
  const e = s.split("/"), t = [];
  let n = "";
  return e.forEach((a) => {
    if (a !== "" && !/\:/.test(a))
      n += "/" + a;
    else if (/\:/.test(a))
      if (/\?/.test(a)) {
        t.length === 0 && n === "" ? t.push("/") : t.push(n);
        const r = a.replace("?", "");
        n += "/" + r, t.push(n);
      } else
        n += "/" + a;
  }), t.filter((a, r, i) => i.indexOf(a) === r);
}, ds = (s) => /[%+]/.test(s) ? (s.indexOf("+") !== -1 && (s = s.replace(/\+/g, " ")), s.indexOf("%") !== -1 ? Ss(s, En) : s) : s, An = (s, e, t) => {
  let n;
  if (!t && e && !/[%+]/.test(e)) {
    let i = s.indexOf("?", 8);
    if (i === -1)
      return;
    for (s.startsWith(e, i + 1) || (i = s.indexOf(`&${e}`, i + 1)); i !== -1; ) {
      const o = s.charCodeAt(i + e.length + 1);
      if (o === 61) {
        const c = i + e.length + 2, d = s.indexOf("&", c);
        return ds(s.slice(c, d === -1 ? void 0 : d));
      } else if (o == 38 || isNaN(o))
        return "";
      i = s.indexOf(`&${e}`, i + 1);
    }
    if (n = /[%+]/.test(s), !n)
      return;
  }
  const a = {};
  n ?? (n = /[%+]/.test(s));
  let r = s.indexOf("?", 8);
  for (; r !== -1; ) {
    const i = s.indexOf("&", r + 1);
    let o = s.indexOf("=", r);
    o > i && i !== -1 && (o = -1);
    let c = s.slice(
      r + 1,
      o === -1 ? i === -1 ? void 0 : i : o
    );
    if (n && (c = ds(c)), r = i, c === "")
      continue;
    let d;
    o === -1 ? d = "" : (d = s.slice(o + 1, i === -1 ? void 0 : i), n && (d = ds(d))), t ? (a[c] && Array.isArray(a[c]) || (a[c] = []), a[c].push(d)) : a[c] ?? (a[c] = d);
  }
  return e ? a[e] : a;
}, fa = An, ma = (s, e) => An(s, e, !0), En = decodeURIComponent, Bs = (s) => Ss(s, En), rt, X, we, bn, Tn, _s, me, fn, pa = (fn = class {
  constructor(s, e = "/", t = [[]]) {
    R(this, we);
    /**
     * `.raw` can get the raw Request object.
     *
     * @see {@link https://hono.dev/docs/api/request#raw}
     *
     * @example
     * ```ts
     * // For Cloudflare Workers
     * app.post('/', async (c) => {
     *   const metadata = c.req.raw.cf?.hostMetadata?
     *   ...
     * })
     * ```
     */
    A(this, "raw");
    R(this, rt);
    // Short name of validatedData
    R(this, X);
    A(this, "routeIndex", 0);
    /**
     * `.path` can get the pathname of the request.
     *
     * @see {@link https://hono.dev/docs/api/request#path}
     *
     * @example
     * ```ts
     * app.get('/about/me', (c) => {
     *   const pathname = c.req.path // `/about/me`
     * })
     * ```
     */
    A(this, "path");
    A(this, "bodyCache", {});
    R(this, me, (s) => {
      const { bodyCache: e, raw: t } = this, n = e[s];
      if (n)
        return n;
      const a = Object.keys(e)[0];
      return a ? e[a].then((r) => (a === "json" && (r = JSON.stringify(r)), new Response(r)[s]())) : e[s] = t[s]();
    });
    this.raw = s, this.path = e, b(this, X, t), b(this, rt, {});
  }
  param(s) {
    return s ? C(this, we, bn).call(this, s) : C(this, we, Tn).call(this);
  }
  query(s) {
    return fa(this.url, s);
  }
  queries(s) {
    return ma(this.url, s);
  }
  header(s) {
    if (s)
      return this.raw.headers.get(s) ?? void 0;
    const e = {};
    return this.raw.headers.forEach((t, n) => {
      e[n] = t;
    }), e;
  }
  async parseBody(s) {
    return na(this, s);
  }
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return h(this, me).call(this, "text").then((s) => JSON.parse(s));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return h(this, me).call(this, "text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return h(this, me).call(this, "arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return h(this, me).call(this, "arrayBuffer").then((s) => new Uint8Array(s));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return h(this, me).call(this, "blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return h(this, me).call(this, "formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(s, e) {
    h(this, rt)[s] = e;
  }
  valid(s) {
    return h(this, rt)[s];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [ta]() {
    return h(this, X);
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return h(this, X)[0].map(([[, s]]) => s);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return h(this, X)[0].map(([[, s]]) => s)[this.routeIndex].path;
  }
}, rt = new WeakMap(), X = new WeakMap(), we = new WeakSet(), bn = function(s) {
  const e = h(this, X)[0][this.routeIndex][1][s], t = C(this, we, _s).call(this, e);
  return t && /\%/.test(t) ? Bs(t) : t;
}, Tn = function() {
  const s = {}, e = Object.keys(h(this, X)[0][this.routeIndex][1]);
  for (const t of e) {
    const n = C(this, we, _s).call(this, h(this, X)[0][this.routeIndex][1][t]);
    n !== void 0 && (s[t] = /\%/.test(n) ? Bs(n) : n);
  }
  return s;
}, _s = function(s) {
  return h(this, X)[1] ? h(this, X)[1][s] : s;
}, me = new WeakMap(), fn), ga = {
  Stringify: 1
}, xn = async (s, e, t, n, a) => {
  typeof s == "object" && !(s instanceof String) && (s instanceof Promise || (s = s.toString()), s instanceof Promise && (s = await s));
  const r = s.callbacks;
  return r != null && r.length ? (a ? a[0] += s : a = [s], Promise.all(r.map((o) => o({ phase: e, buffer: a, context: n }))).then(
    (o) => Promise.all(
      o.filter(Boolean).map((c) => xn(c, e, !1, n, a))
    ).then(() => a[0])
  )) : Promise.resolve(s);
}, ya = "text/plain; charset=UTF-8", ls = (s, e) => ({
  "Content-Type": s,
  ...e
}), Et = (s, e) => new Response(s, e), Ct, Ut, pe, it, ge, J, Dt, ot, ct, je, Pt, Lt, xe, st, mn, _a = (mn = class {
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(s, e) {
    R(this, xe);
    R(this, Ct);
    R(this, Ut);
    /**
     * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
     *
     * @see {@link https://hono.dev/docs/api/context#env}
     *
     * @example
     * ```ts
     * // Environment object for Cloudflare Workers
     * app.get('*', async c => {
     *   const counter = c.env.COUNTER
     * })
     * ```
     */
    A(this, "env", {});
    R(this, pe);
    A(this, "finalized", !1);
    /**
     * `.error` can get the error object from the middleware if the Handler throws an error.
     *
     * @see {@link https://hono.dev/docs/api/context#error}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   await next()
     *   if (c.error) {
     *     // do something...
     *   }
     * })
     * ```
     */
    A(this, "error");
    R(this, it);
    R(this, ge);
    R(this, J);
    R(this, Dt);
    R(this, ot);
    R(this, ct);
    R(this, je);
    R(this, Pt);
    R(this, Lt);
    /**
     * `.render()` can create a response within a layout.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   return c.render('Hello!')
     * })
     * ```
     */
    A(this, "render", (...s) => (h(this, ot) ?? b(this, ot, (e) => this.html(e)), h(this, ot).call(this, ...s)));
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    A(this, "setLayout", (s) => b(this, Dt, s));
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    A(this, "getLayout", () => h(this, Dt));
    /**
     * `.setRenderer()` can set the layout in the custom middleware.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```tsx
     * app.use('*', async (c, next) => {
     *   c.setRenderer((content) => {
     *     return c.html(
     *       <html>
     *         <body>
     *           <p>{content}</p>
     *         </body>
     *       </html>
     *     )
     *   })
     *   await next()
     * })
     * ```
     */
    A(this, "setRenderer", (s) => {
      b(this, ot, s);
    });
    /**
     * `.header()` can set headers.
     *
     * @see {@link https://hono.dev/docs/api/context#header}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    A(this, "header", (s, e, t) => {
      this.finalized && b(this, J, Et(h(this, J).body, h(this, J)));
      const n = h(this, J) ? h(this, J).headers : h(this, je) ?? b(this, je, new Headers());
      e === void 0 ? n.delete(s) : t != null && t.append ? n.append(s, e) : n.set(s, e);
    });
    A(this, "status", (s) => {
      b(this, it, s);
    });
    /**
     * `.set()` can set the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   c.set('message', 'Hono is hot!!')
     *   await next()
     * })
     * ```
     */
    A(this, "set", (s, e) => {
      h(this, pe) ?? b(this, pe, /* @__PURE__ */ new Map()), h(this, pe).set(s, e);
    });
    /**
     * `.get()` can use the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   const message = c.get('message')
     *   return c.text(`The message is "${message}"`)
     * })
     * ```
     */
    A(this, "get", (s) => h(this, pe) ? h(this, pe).get(s) : void 0);
    A(this, "newResponse", (...s) => C(this, xe, st).call(this, ...s));
    /**
     * `.body()` can return the HTTP response.
     * You can set headers with `.header()` and set HTTP status code with `.status`.
     * This can also be set in `.text()`, `.json()` and so on.
     *
     * @see {@link https://hono.dev/docs/api/context#body}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *   // Set HTTP status code
     *   c.status(201)
     *
     *   // Return the response body
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    A(this, "body", (s, e, t) => C(this, xe, st).call(this, s, e, t));
    /**
     * `.text()` can render text as `Content-Type:text/plain`.
     *
     * @see {@link https://hono.dev/docs/api/context#text}
     *
     * @example
     * ```ts
     * app.get('/say', (c) => {
     *   return c.text('Hello!')
     * })
     * ```
     */
    A(this, "text", (s, e, t) => !h(this, je) && !h(this, it) && !e && !t && !this.finalized ? new Response(s) : C(this, xe, st).call(this, s, e, ls(ya, t)));
    /**
     * `.json()` can render JSON as `Content-Type:application/json`.
     *
     * @see {@link https://hono.dev/docs/api/context#json}
     *
     * @example
     * ```ts
     * app.get('/api', (c) => {
     *   return c.json({ message: 'Hello!' })
     * })
     * ```
     */
    A(this, "json", (s, e, t) => C(this, xe, st).call(this, JSON.stringify(s), e, ls("application/json", t)));
    A(this, "html", (s, e, t) => {
      const n = (a) => C(this, xe, st).call(this, a, e, ls("text/html; charset=UTF-8", t));
      return typeof s == "object" ? xn(s, ga.Stringify, !1, {}).then(n) : n(s);
    });
    /**
     * `.redirect()` can Redirect, default status code is 302.
     *
     * @see {@link https://hono.dev/docs/api/context#redirect}
     *
     * @example
     * ```ts
     * app.get('/redirect', (c) => {
     *   return c.redirect('/')
     * })
     * app.get('/redirect-permanently', (c) => {
     *   return c.redirect('/', 301)
     * })
     * ```
     */
    A(this, "redirect", (s, e) => {
      const t = String(s);
      return this.header(
        "Location",
        // Multibyes should be encoded
        // eslint-disable-next-line no-control-regex
        /[^\x00-\xFF]/.test(t) ? encodeURI(t) : t
      ), this.newResponse(null, e ?? 302);
    });
    /**
     * `.notFound()` can return the Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/context#notfound}
     *
     * @example
     * ```ts
     * app.get('/notfound', (c) => {
     *   return c.notFound()
     * })
     * ```
     */
    A(this, "notFound", () => (h(this, ct) ?? b(this, ct, () => Et()), h(this, ct).call(this, this)));
    b(this, Ct, s), e && (b(this, ge, e.executionCtx), this.env = e.env, b(this, ct, e.notFoundHandler), b(this, Lt, e.path), b(this, Pt, e.matchResult));
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    return h(this, Ut) ?? b(this, Ut, new pa(h(this, Ct), h(this, Lt), h(this, Pt))), h(this, Ut);
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (h(this, ge) && "respondWith" in h(this, ge))
      return h(this, ge);
    throw Error("This context has no FetchEvent");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (h(this, ge))
      return h(this, ge);
    throw Error("This context has no ExecutionContext");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return h(this, J) || b(this, J, Et(null, {
      headers: h(this, je) ?? b(this, je, new Headers())
    }));
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(s) {
    if (h(this, J) && s) {
      s = Et(s.body, s);
      for (const [e, t] of h(this, J).headers.entries())
        if (e !== "content-type")
          if (e === "set-cookie") {
            const n = h(this, J).headers.getSetCookie();
            s.headers.delete("set-cookie");
            for (const a of n)
              s.headers.append("set-cookie", a);
          } else
            s.headers.set(e, t);
    }
    b(this, J, s), this.finalized = !0;
  }
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    return h(this, pe) ? Object.fromEntries(h(this, pe)) : {};
  }
}, Ct = new WeakMap(), Ut = new WeakMap(), pe = new WeakMap(), it = new WeakMap(), ge = new WeakMap(), J = new WeakMap(), Dt = new WeakMap(), ot = new WeakMap(), ct = new WeakMap(), je = new WeakMap(), Pt = new WeakMap(), Lt = new WeakMap(), xe = new WeakSet(), st = function(s, e, t) {
  const n = h(this, J) ? new Headers(h(this, J).headers) : h(this, je) ?? new Headers();
  if (typeof e == "object" && "headers" in e) {
    const r = e.headers instanceof Headers ? e.headers : new Headers(e.headers);
    for (const [i, o] of r)
      i.toLowerCase() === "set-cookie" ? n.append(i, o) : n.set(i, o);
  }
  if (t)
    for (const [r, i] of Object.entries(t))
      if (typeof i == "string")
        n.set(r, i);
      else {
        n.delete(r);
        for (const o of i)
          n.append(r, o);
      }
  const a = typeof e == "number" ? e : (e == null ? void 0 : e.status) ?? h(this, it);
  return Et(s, { status: a, headers: n });
}, mn), q = "ALL", va = "all", wa = ["get", "post", "put", "delete", "options", "patch"], Sn = "Can not add a route since the matcher is already built.", Nn = class extends Error {
}, Ia = "__COMPOSED_HANDLER", Aa = (s) => s.text("404 Not Found", 404), js = (s, e) => {
  if ("getResponse" in s) {
    const t = s.getResponse();
    return e.newResponse(t.body, t);
  }
  return console.error(s), e.text("Internal Server Error", 500);
}, te, V, Rn, se, Le, Gt, Kt, dt, Ea = (dt = class {
  constructor(e = {}) {
    R(this, V);
    A(this, "get");
    A(this, "post");
    A(this, "put");
    A(this, "delete");
    A(this, "options");
    A(this, "patch");
    A(this, "all");
    A(this, "on");
    A(this, "use");
    /*
      This class is like an abstract class and does not have a router.
      To use it, inherit the class and implement router in the constructor.
    */
    A(this, "router");
    A(this, "getPath");
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    A(this, "_basePath", "/");
    R(this, te, "/");
    A(this, "routes", []);
    R(this, se, Aa);
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    A(this, "errorHandler", js);
    /**
     * `.onError()` handles an error and returns a customized Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#error-handling}
     *
     * @param {ErrorHandler} handler - request Handler for error
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.onError((err, c) => {
     *   console.error(`${err}`)
     *   return c.text('Custom Error Message', 500)
     * })
     * ```
     */
    A(this, "onError", (e) => (this.errorHandler = e, this));
    /**
     * `.notFound()` allows you to customize a Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#not-found}
     *
     * @param {NotFoundHandler} handler - request handler for not-found
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.notFound((c) => {
     *   return c.text('Custom 404 Message', 404)
     * })
     * ```
     */
    A(this, "notFound", (e) => (b(this, se, e), this));
    /**
     * `.fetch()` will be entry point of your app.
     *
     * @see {@link https://hono.dev/docs/api/hono#fetch}
     *
     * @param {Request} request - request Object of request
     * @param {Env} Env - env Object
     * @param {ExecutionContext} - context of execution
     * @returns {Response | Promise<Response>} response of request
     *
     */
    A(this, "fetch", (e, ...t) => C(this, V, Kt).call(this, e, t[1], t[0], e.method));
    /**
     * `.request()` is a useful method for testing.
     * You can pass a URL or pathname to send a GET request.
     * app will return a Response object.
     * ```ts
     * test('GET /hello is ok', async () => {
     *   const res = await app.request('/hello')
     *   expect(res.status).toBe(200)
     * })
     * ```
     * @see https://hono.dev/docs/api/hono#request
     */
    A(this, "request", (e, t, n, a) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, a) : (e = e.toString(), this.fetch(
      new Request(
        /^https?:\/\//.test(e) ? e : `http://localhost${Pe("/", e)}`,
        t
      ),
      n,
      a
    )));
    /**
     * `.fire()` automatically adds a global fetch event listener.
     * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
     * @deprecated
     * Use `fire` from `hono/service-worker` instead.
     * ```ts
     * import { Hono } from 'hono'
     * import { fire } from 'hono/service-worker'
     *
     * const app = new Hono()
     * // ...
     * fire(app)
     * ```
     * @see https://hono.dev/docs/api/hono#fire
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
     * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
     */
    A(this, "fire", () => {
      addEventListener("fetch", (e) => {
        e.respondWith(C(this, V, Kt).call(this, e.request, e, void 0, e.request.method));
      });
    });
    [...wa, va].forEach((r) => {
      this[r] = (i, ...o) => (typeof i == "string" ? b(this, te, i) : C(this, V, Le).call(this, r, h(this, te), i), o.forEach((c) => {
        C(this, V, Le).call(this, r, h(this, te), c);
      }), this);
    }), this.on = (r, i, ...o) => {
      for (const c of [i].flat()) {
        b(this, te, c);
        for (const d of [r].flat())
          o.map((l) => {
            C(this, V, Le).call(this, d.toUpperCase(), h(this, te), l);
          });
      }
      return this;
    }, this.use = (r, ...i) => (typeof r == "string" ? b(this, te, r) : (b(this, te, "*"), i.unshift(r)), i.forEach((o) => {
      C(this, V, Le).call(this, q, h(this, te), o);
    }), this);
    const { strict: n, ...a } = e;
    Object.assign(this, a), this.getPath = n ?? !0 ? e.getPath ?? wn : ha;
  }
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(e, t) {
    const n = this.basePath(e);
    return t.routes.map((a) => {
      var i;
      let r;
      t.errorHandler === js ? r = a.handler : (r = async (o, c) => (await Ps([], t.errorHandler)(o, () => a.handler(o, c))).res, r[Ia] = a.handler), C(i = n, V, Le).call(i, a.method, a.path, r, a.basePath);
    }), this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(e) {
    const t = C(this, V, Rn).call(this);
    return t._basePath = Pe(this._basePath, e), t;
  }
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(e, t, n) {
    let a, r;
    n && (typeof n == "function" ? r = n : (r = n.optionHandler, n.replaceRequest === !1 ? a = (c) => c : a = n.replaceRequest));
    const i = r ? (c) => {
      const d = r(c);
      return Array.isArray(d) ? d : [d];
    } : (c) => {
      let d;
      try {
        d = c.executionCtx;
      } catch {
      }
      return [c.env, d];
    };
    a || (a = (() => {
      const c = Pe(this._basePath, e), d = c === "/" ? 0 : c.length;
      return (l) => {
        const u = new URL(l.url);
        return u.pathname = this.getPath(l).slice(d) || "/", new Request(u, l);
      };
    })());
    const o = async (c, d) => {
      const l = await t(a(c.req.raw), ...i(c));
      if (l)
        return l;
      await d();
    };
    return C(this, V, Le).call(this, q, Pe(e, "*"), o), this;
  }
}, te = new WeakMap(), V = new WeakSet(), Rn = function() {
  const e = new dt({
    router: this.router,
    getPath: this.getPath
  });
  return e.errorHandler = this.errorHandler, b(e, se, h(this, se)), e.routes = this.routes, e;
}, se = new WeakMap(), Le = function(e, t, n, a) {
  e = e.toUpperCase(), t = Pe(this._basePath, t);
  const r = {
    basePath: a !== void 0 ? Pe(this._basePath, a) : this._basePath,
    path: t,
    method: e,
    handler: n
  };
  this.router.add(e, t, [n, r]), this.routes.push(r);
}, Gt = function(e, t) {
  if (e instanceof Error)
    return this.errorHandler(e, t);
  throw e;
}, Kt = function(e, t, n, a) {
  if (a === "HEAD")
    return (async () => new Response(null, await C(this, V, Kt).call(this, e, t, n, "GET")))();
  const r = this.getPath(e, { env: n }), i = this.router.match(a, r), o = new _a(e, {
    path: r,
    matchResult: i,
    env: n,
    executionCtx: t,
    notFoundHandler: h(this, se)
  });
  if (i[0].length === 1) {
    let d;
    try {
      d = i[0][0][0][0](o, async () => {
        o.res = await h(this, se).call(this, o);
      });
    } catch (l) {
      return C(this, V, Gt).call(this, l, o);
    }
    return d instanceof Promise ? d.then(
      (l) => l || (o.finalized ? o.res : h(this, se).call(this, o))
    ).catch((l) => C(this, V, Gt).call(this, l, o)) : d ?? h(this, se).call(this, o);
  }
  const c = Ps(i[0], this.errorHandler, h(this, se));
  return (async () => {
    try {
      const d = await c(o);
      if (!d.finalized)
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      return d.res;
    } catch (d) {
      return C(this, V, Gt).call(this, d, o);
    }
  })();
}, dt), kn = [];
function ba(s, e) {
  const t = this.buildAllMatchers(), n = (a, r) => {
    const i = t[a] || t[q], o = i[2][r];
    if (o)
      return o;
    const c = r.match(i[0]);
    if (!c)
      return [[], kn];
    const d = c.indexOf("", 1);
    return [i[1][d], c];
  };
  return this.match = n, n(s, e);
}
var Xt = "[^/]+", Rt = ".*", kt = "(?:|/.*)", nt = /* @__PURE__ */ Symbol(), Ta = new Set(".\\+*[^]$()");
function xa(s, e) {
  return s.length === 1 ? e.length === 1 ? s < e ? -1 : 1 : -1 : e.length === 1 || s === Rt || s === kt ? 1 : e === Rt || e === kt ? -1 : s === Xt ? 1 : e === Xt ? -1 : s.length === e.length ? s < e ? -1 : 1 : e.length - s.length;
}
var $e, Fe, ne, He, Sa = (He = class {
  constructor() {
    R(this, $e);
    R(this, Fe);
    R(this, ne, /* @__PURE__ */ Object.create(null));
  }
  insert(e, t, n, a, r) {
    if (e.length === 0) {
      if (h(this, $e) !== void 0)
        throw nt;
      if (r)
        return;
      b(this, $e, t);
      return;
    }
    const [i, ...o] = e, c = i === "*" ? o.length === 0 ? ["", "", Rt] : ["", "", Xt] : i === "/*" ? ["", "", kt] : i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let d;
    if (c) {
      const l = c[1];
      let u = c[2] || Xt;
      if (l && c[2] && (u === ".*" || (u = u.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(u))))
        throw nt;
      if (d = h(this, ne)[u], !d) {
        if (Object.keys(h(this, ne)).some(
          (p) => p !== Rt && p !== kt
        ))
          throw nt;
        if (r)
          return;
        d = h(this, ne)[u] = new He(), l !== "" && b(d, Fe, a.varIndex++);
      }
      !r && l !== "" && n.push([l, h(d, Fe)]);
    } else if (d = h(this, ne)[i], !d) {
      if (Object.keys(h(this, ne)).some(
        (l) => l.length > 1 && l !== Rt && l !== kt
      ))
        throw nt;
      if (r)
        return;
      d = h(this, ne)[i] = new He();
    }
    d.insert(o, t, n, a, r);
  }
  buildRegExpStr() {
    const t = Object.keys(h(this, ne)).sort(xa).map((n) => {
      const a = h(this, ne)[n];
      return (typeof h(a, Fe) == "number" ? `(${n})@${h(a, Fe)}` : Ta.has(n) ? `\\${n}` : n) + a.buildRegExpStr();
    });
    return typeof h(this, $e) == "number" && t.unshift(`#${h(this, $e)}`), t.length === 0 ? "" : t.length === 1 ? t[0] : "(?:" + t.join("|") + ")";
  }
}, $e = new WeakMap(), Fe = new WeakMap(), ne = new WeakMap(), He), rs, Bt, pn, Na = (pn = class {
  constructor() {
    R(this, rs, { varIndex: 0 });
    R(this, Bt, new Sa());
  }
  insert(s, e, t) {
    const n = [], a = [];
    for (let i = 0; ; ) {
      let o = !1;
      if (s = s.replace(/\{[^}]+\}/g, (c) => {
        const d = `@\\${i}`;
        return a[i] = [d, c], i++, o = !0, d;
      }), !o)
        break;
    }
    const r = s.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = a.length - 1; i >= 0; i--) {
      const [o] = a[i];
      for (let c = r.length - 1; c >= 0; c--)
        if (r[c].indexOf(o) !== -1) {
          r[c] = r[c].replace(o, a[i][1]);
          break;
        }
    }
    return h(this, Bt).insert(r, e, n, h(this, rs), t), n;
  }
  buildRegExp() {
    let s = h(this, Bt).buildRegExpStr();
    if (s === "")
      return [/^$/, [], []];
    let e = 0;
    const t = [], n = [];
    return s = s.replace(/#(\d+)|@(\d+)|\.\*\$/g, (a, r, i) => r !== void 0 ? (t[++e] = Number(r), "$()") : (i !== void 0 && (n[Number(i)] = ++e), "")), [new RegExp(`^${s}`), t, n];
  }
}, rs = new WeakMap(), Bt = new WeakMap(), pn), Ra = [/^$/, [], /* @__PURE__ */ Object.create(null)], Yt = /* @__PURE__ */ Object.create(null);
function On(s) {
  return Yt[s] ?? (Yt[s] = new RegExp(
    s === "*" ? "" : `^${s.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (e, t) => t ? `\\${t}` : "(?:|/.*)"
    )}$`
  ));
}
function ka() {
  Yt = /* @__PURE__ */ Object.create(null);
}
function Oa(s) {
  var d;
  const e = new Na(), t = [];
  if (s.length === 0)
    return Ra;
  const n = s.map(
    (l) => [!/\*|\/:/.test(l[0]), ...l]
  ).sort(
    ([l, u], [p, w]) => l ? 1 : p ? -1 : u.length - w.length
  ), a = /* @__PURE__ */ Object.create(null);
  for (let l = 0, u = -1, p = n.length; l < p; l++) {
    const [w, D, j] = n[l];
    w ? a[D] = [j.map(([B]) => [B, /* @__PURE__ */ Object.create(null)]), kn] : u++;
    let U;
    try {
      U = e.insert(D, u, w);
    } catch (B) {
      throw B === nt ? new Nn(D) : B;
    }
    w || (t[u] = j.map(([B, P]) => {
      const F = /* @__PURE__ */ Object.create(null);
      for (P -= 1; P >= 0; P--) {
        const [Ae, H] = U[P];
        F[Ae] = H;
      }
      return [B, F];
    }));
  }
  const [r, i, o] = e.buildRegExp();
  for (let l = 0, u = t.length; l < u; l++)
    for (let p = 0, w = t[l].length; p < w; p++) {
      const D = (d = t[l][p]) == null ? void 0 : d[1];
      if (!D)
        continue;
      const j = Object.keys(D);
      for (let U = 0, B = j.length; U < B; U++)
        D[j[U]] = o[D[j[U]]];
    }
  const c = [];
  for (const l in i)
    c[l] = t[i[l]];
  return [r, c, a];
}
function Ye(s, e) {
  if (s) {
    for (const t of Object.keys(s).sort((n, a) => a.length - n.length))
      if (On(t).test(e))
        return [...s[t]];
  }
}
var Se, Ne, is, Mn, gn, Ma = (gn = class {
  constructor() {
    R(this, is);
    A(this, "name", "RegExpRouter");
    R(this, Se);
    R(this, Ne);
    A(this, "match", ba);
    b(this, Se, { [q]: /* @__PURE__ */ Object.create(null) }), b(this, Ne, { [q]: /* @__PURE__ */ Object.create(null) });
  }
  add(s, e, t) {
    var o;
    const n = h(this, Se), a = h(this, Ne);
    if (!n || !a)
      throw new Error(Sn);
    n[s] || [n, a].forEach((c) => {
      c[s] = /* @__PURE__ */ Object.create(null), Object.keys(c[q]).forEach((d) => {
        c[s][d] = [...c[q][d]];
      });
    }), e === "/*" && (e = "*");
    const r = (e.match(/\/:/g) || []).length;
    if (/\*$/.test(e)) {
      const c = On(e);
      s === q ? Object.keys(n).forEach((d) => {
        var l;
        (l = n[d])[e] || (l[e] = Ye(n[d], e) || Ye(n[q], e) || []);
      }) : (o = n[s])[e] || (o[e] = Ye(n[s], e) || Ye(n[q], e) || []), Object.keys(n).forEach((d) => {
        (s === q || s === d) && Object.keys(n[d]).forEach((l) => {
          c.test(l) && n[d][l].push([t, r]);
        });
      }), Object.keys(a).forEach((d) => {
        (s === q || s === d) && Object.keys(a[d]).forEach(
          (l) => c.test(l) && a[d][l].push([t, r])
        );
      });
      return;
    }
    const i = In(e) || [e];
    for (let c = 0, d = i.length; c < d; c++) {
      const l = i[c];
      Object.keys(a).forEach((u) => {
        var p;
        (s === q || s === u) && ((p = a[u])[l] || (p[l] = [
          ...Ye(n[u], l) || Ye(n[q], l) || []
        ]), a[u][l].push([t, r - d + c + 1]));
      });
    }
  }
  buildAllMatchers() {
    const s = /* @__PURE__ */ Object.create(null);
    return Object.keys(h(this, Ne)).concat(Object.keys(h(this, Se))).forEach((e) => {
      s[e] || (s[e] = C(this, is, Mn).call(this, e));
    }), b(this, Se, b(this, Ne, void 0)), ka(), s;
  }
}, Se = new WeakMap(), Ne = new WeakMap(), is = new WeakSet(), Mn = function(s) {
  const e = [];
  let t = s === q;
  return [h(this, Se), h(this, Ne)].forEach((n) => {
    const a = n[s] ? Object.keys(n[s]).map((r) => [r, n[s][r]]) : [];
    a.length !== 0 ? (t || (t = !0), e.push(...a)) : s !== q && e.push(
      ...Object.keys(n[q]).map((r) => [r, n[q][r]])
    );
  }), t ? Oa(e) : null;
}, gn), Re, ye, yn, Ca = (yn = class {
  constructor(s) {
    A(this, "name", "SmartRouter");
    R(this, Re, []);
    R(this, ye, []);
    b(this, Re, s.routers);
  }
  add(s, e, t) {
    if (!h(this, ye))
      throw new Error(Sn);
    h(this, ye).push([s, e, t]);
  }
  match(s, e) {
    if (!h(this, ye))
      throw new Error("Fatal error");
    const t = h(this, Re), n = h(this, ye), a = t.length;
    let r = 0, i;
    for (; r < a; r++) {
      const o = t[r];
      try {
        for (let c = 0, d = n.length; c < d; c++)
          o.add(...n[c]);
        i = o.match(s, e);
      } catch (c) {
        if (c instanceof Nn)
          continue;
        throw c;
      }
      this.match = o.match.bind(o), b(this, Re, [o]), b(this, ye, void 0);
      break;
    }
    if (r === a)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, i;
  }
  get activeRouter() {
    if (h(this, ye) || h(this, Re).length !== 1)
      throw new Error("No active router has been determined yet.");
    return h(this, Re)[0];
  }
}, Re = new WeakMap(), ye = new WeakMap(), yn), bt = /* @__PURE__ */ Object.create(null), Ua = (s) => {
  for (const e in s)
    return !0;
  return !1;
}, ke, Z, qe, lt, z, re, be, ut, Da = (ut = class {
  constructor(e, t, n) {
    R(this, re);
    R(this, ke);
    R(this, Z);
    R(this, qe);
    R(this, lt, 0);
    R(this, z, bt);
    if (b(this, Z, n || /* @__PURE__ */ Object.create(null)), b(this, ke, []), e && t) {
      const a = /* @__PURE__ */ Object.create(null);
      a[e] = { handler: t, possibleKeys: [], score: 0 }, b(this, ke, [a]);
    }
    b(this, qe, []);
  }
  insert(e, t, n) {
    b(this, lt, ++Ds(this, lt)._);
    let a = this;
    const r = oa(t), i = [];
    for (let o = 0, c = r.length; o < c; o++) {
      const d = r[o], l = r[o + 1], u = la(d, l), p = Array.isArray(u) ? u[0] : d;
      if (p in h(a, Z)) {
        a = h(a, Z)[p], u && i.push(u[1]);
        continue;
      }
      h(a, Z)[p] = new ut(), u && (h(a, qe).push(u), i.push(u[1])), a = h(a, Z)[p];
    }
    return h(a, ke).push({
      [e]: {
        handler: n,
        possibleKeys: i.filter((o, c, d) => d.indexOf(o) === c),
        score: h(this, lt)
      }
    }), a;
  }
  search(e, t) {
    var l;
    const n = [];
    b(this, z, bt);
    let r = [this];
    const i = vn(t), o = [], c = i.length;
    let d = null;
    for (let u = 0; u < c; u++) {
      const p = i[u], w = u === c - 1, D = [];
      for (let U = 0, B = r.length; U < B; U++) {
        const P = r[U], F = h(P, Z)[p];
        F && (b(F, z, h(P, z)), w ? (h(F, Z)["*"] && C(this, re, be).call(this, n, h(F, Z)["*"], e, h(P, z)), C(this, re, be).call(this, n, F, e, h(P, z))) : D.push(F));
        for (let Ae = 0, H = h(P, qe).length; Ae < H; Ae++) {
          const Ms = h(P, qe)[Ae], he = h(P, z) === bt ? {} : { ...h(P, z) };
          if (Ms === "*") {
            const Ue = h(P, Z)["*"];
            Ue && (C(this, re, be).call(this, n, Ue, e, h(P, z)), b(Ue, z, he), D.push(Ue));
            continue;
          }
          const [Xn, Cs, It] = Ms;
          if (!p && !(It instanceof RegExp))
            continue;
          const ee = h(P, Z)[Xn];
          if (It instanceof RegExp) {
            if (d === null) {
              d = new Array(c);
              let Ke = t[0] === "/" ? 1 : 0;
              for (let At = 0; At < c; At++)
                d[At] = Ke, Ke += i[At].length + 1;
            }
            const Ue = t.substring(d[u]), $t = It.exec(Ue);
            if ($t) {
              if (he[Cs] = $t[0], C(this, re, be).call(this, n, ee, e, h(P, z), he), $t[0].length === Ue.length && h(ee, Z)["*"] && C(this, re, be).call(this, n, h(ee, Z)["*"], e, h(P, z), he), Ua(h(ee, Z))) {
                b(ee, z, he);
                const Ke = ((l = $t[0].match(/\//)) == null ? void 0 : l.length) ?? 0;
                (o[Ke] || (o[Ke] = [])).push(ee);
              }
              continue;
            }
          }
          (It === !0 || It.test(p)) && (he[Cs] = p, w ? (C(this, re, be).call(this, n, ee, e, he, h(P, z)), h(ee, Z)["*"] && C(this, re, be).call(this, n, h(ee, Z)["*"], e, he, h(P, z))) : (b(ee, z, he), D.push(ee)));
        }
      }
      const j = o.shift();
      r = j ? D.concat(j) : D;
    }
    return n.length > 1 && n.sort((u, p) => u.score - p.score), [n.map(({ handler: u, params: p }) => [u, p])];
  }
}, ke = new WeakMap(), Z = new WeakMap(), qe = new WeakMap(), lt = new WeakMap(), z = new WeakMap(), re = new WeakSet(), be = function(e, t, n, a, r) {
  for (let i = 0, o = h(t, ke).length; i < o; i++) {
    const c = h(t, ke)[i], d = c[n] || c[q], l = {};
    if (d !== void 0 && (d.params = /* @__PURE__ */ Object.create(null), e.push(d), a !== bt || r && r !== bt))
      for (let u = 0, p = d.possibleKeys.length; u < p; u++) {
        const w = d.possibleKeys[u], D = l[d.score];
        d.params[w] = r != null && r[w] && !D ? r[w] : a[w] ?? (r == null ? void 0 : r[w]), l[d.score] = !0;
      }
  }
}, ut), Ve, _n, Pa = (_n = class {
  constructor() {
    A(this, "name", "TrieRouter");
    R(this, Ve);
    b(this, Ve, new Da());
  }
  add(s, e, t) {
    const n = In(e);
    if (n) {
      for (let a = 0, r = n.length; a < r; a++)
        h(this, Ve).insert(s, n[a], t);
      return;
    }
    h(this, Ve).insert(s, e, t);
  }
  match(s, e) {
    return h(this, Ve).search(s, e);
  }
}, Ve = new WeakMap(), _n), le = class extends Ea {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(s = {}) {
    super(s), this.router = s.router ?? new Ca({
      routers: [new Ma(), new Pa()]
    });
  }
}, La = (s) => {
  const e = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...s
  }, t = /* @__PURE__ */ ((a) => typeof a == "string" ? a === "*" ? () => a : (r) => a === r ? r : null : typeof a == "function" ? a : (r) => a.includes(r) ? r : null)(e.origin), n = ((a) => typeof a == "function" ? a : Array.isArray(a) ? () => a : () => [])(e.allowMethods);
  return async function(r, i) {
    var d;
    function o(l, u) {
      r.res.headers.set(l, u);
    }
    const c = await t(r.req.header("origin") || "", r);
    if (c && o("Access-Control-Allow-Origin", c), e.credentials && o("Access-Control-Allow-Credentials", "true"), (d = e.exposeHeaders) != null && d.length && o("Access-Control-Expose-Headers", e.exposeHeaders.join(",")), r.req.method === "OPTIONS") {
      e.origin !== "*" && o("Vary", "Origin"), e.maxAge != null && o("Access-Control-Max-Age", e.maxAge.toString());
      const l = await n(r.req.header("origin") || "", r);
      l.length && o("Access-Control-Allow-Methods", l.join(","));
      let u = e.allowHeaders;
      if (!(u != null && u.length)) {
        const p = r.req.header("Access-Control-Request-Headers");
        p && (u = p.split(/\s*,\s*/));
      }
      return u != null && u.length && (o("Access-Control-Allow-Headers", u.join(",")), r.res.headers.append("Vary", "Access-Control-Request-Headers")), r.res.headers.delete("Content-Length"), r.res.headers.delete("Content-Type"), new Response(null, {
        headers: r.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await i(), e.origin !== "*" && r.header("Vary", "Origin", { append: !0 });
  };
}, M;
(function(s) {
  s.assertEqual = (a) => {
  };
  function e(a) {
  }
  s.assertIs = e;
  function t(a) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (a) => {
    const r = {};
    for (const i of a)
      r[i] = i;
    return r;
  }, s.getValidEnumValues = (a) => {
    const r = s.objectKeys(a).filter((o) => typeof a[a[o]] != "number"), i = {};
    for (const o of r)
      i[o] = a[o];
    return s.objectValues(i);
  }, s.objectValues = (a) => s.objectKeys(a).map(function(r) {
    return a[r];
  }), s.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    const r = [];
    for (const i in a)
      Object.prototype.hasOwnProperty.call(a, i) && r.push(i);
    return r;
  }, s.find = (a, r) => {
    for (const i of a)
      if (r(i))
        return i;
  }, s.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && Number.isFinite(a) && Math.floor(a) === a;
  function n(a, r = " | ") {
    return a.map((i) => typeof i == "string" ? `'${i}'` : i).join(r);
  }
  s.joinValues = n, s.jsonStringifyReplacer = (a, r) => typeof r == "bigint" ? r.toString() : r;
})(M || (M = {}));
var $s;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})($s || ($s = {}));
const _ = M.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), Te = (s) => {
  switch (typeof s) {
    case "undefined":
      return _.undefined;
    case "string":
      return _.string;
    case "number":
      return Number.isNaN(s) ? _.nan : _.number;
    case "boolean":
      return _.boolean;
    case "function":
      return _.function;
    case "bigint":
      return _.bigint;
    case "symbol":
      return _.symbol;
    case "object":
      return Array.isArray(s) ? _.array : s === null ? _.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? _.promise : typeof Map < "u" && s instanceof Map ? _.map : typeof Set < "u" && s instanceof Set ? _.set : typeof Date < "u" && s instanceof Date ? _.date : _.object;
    default:
      return _.unknown;
  }
}, m = M.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class ce extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(r) {
      return r.message;
    }, n = { _errors: [] }, a = (r) => {
      for (const i of r.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(a);
        else if (i.code === "invalid_return_type")
          a(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          a(i.argumentsError);
        else if (i.path.length === 0)
          n._errors.push(t(i));
        else {
          let o = n, c = 0;
          for (; c < i.path.length; ) {
            const d = i.path[c];
            c === i.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(i))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return a(this), n;
  }
  static assert(e) {
    if (!(e instanceof ce))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, M.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const a of this.issues)
      if (a.path.length > 0) {
        const r = a.path[0];
        t[r] = t[r] || [], t[r].push(e(a));
      } else
        n.push(e(a));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
ce.create = (s) => new ce(s);
const vs = (s, e) => {
  let t;
  switch (s.code) {
    case m.invalid_type:
      s.received === _.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case m.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, M.jsonStringifyReplacer)}`;
      break;
    case m.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${M.joinValues(s.keys, ", ")}`;
      break;
    case m.invalid_union:
      t = "Invalid input";
      break;
    case m.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${M.joinValues(s.options)}`;
      break;
    case m.invalid_enum_value:
      t = `Invalid enum value. Expected ${M.joinValues(s.options)}, received '${s.received}'`;
      break;
    case m.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case m.invalid_return_type:
      t = "Invalid function return type";
      break;
    case m.invalid_date:
      t = "Invalid date";
      break;
    case m.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : M.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case m.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case m.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case m.custom:
      t = "Invalid input";
      break;
    case m.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case m.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case m.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, M.assertNever(s);
  }
  return { message: t };
};
let Ba = vs;
function ja() {
  return Ba;
}
const $a = (s) => {
  const { data: e, path: t, errorMaps: n, issueData: a } = s, r = [...t, ...a.path || []], i = {
    ...a,
    path: r
  };
  if (a.message !== void 0)
    return {
      ...a,
      path: r,
      message: a.message
    };
  let o = "";
  const c = n.filter((d) => !!d).slice().reverse();
  for (const d of c)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...a,
    path: r,
    message: o
  };
};
function y(s, e) {
  const t = ja(), n = $a({
    issueData: e,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === vs ? void 0 : vs
      // then global default map
    ].filter((a) => !!a)
  });
  s.common.issues.push(n);
}
class G {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const a of t) {
      if (a.status === "aborted")
        return x;
      a.status === "dirty" && e.dirty(), n.push(a.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const a of t) {
      const r = await a.key, i = await a.value;
      n.push({
        key: r,
        value: i
      });
    }
    return G.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const a of t) {
      const { key: r, value: i } = a;
      if (r.status === "aborted" || i.status === "aborted")
        return x;
      r.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), r.value !== "__proto__" && (typeof i.value < "u" || a.alwaysSet) && (n[r.value] = i.value);
    }
    return { status: e.value, value: n };
  }
}
const x = Object.freeze({
  status: "aborted"
}), Nt = (s) => ({ status: "dirty", value: s }), Q = (s) => ({ status: "valid", value: s }), Fs = (s) => s.status === "aborted", qs = (s) => s.status === "dirty", ht = (s) => s.status === "valid", Qt = (s) => typeof Promise < "u" && s instanceof Promise;
var v;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(v || (v = {}));
class de {
  constructor(e, t, n, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Vs = (s, e) => {
  if (ht(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new ce(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function N(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: a } = s;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: (i, o) => {
    const { message: c } = s;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? n ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: a };
}
class k {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Te(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: Te(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new G(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Te(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Qt(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    const n = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Te(e)
    }, a = this._parseSync({ data: e, path: n.path, parent: n });
    return Vs(n, a);
  }
  "~validate"(e) {
    var n, a;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Te(e)
    };
    if (!this["~standard"].async)
      try {
        const r = this._parseSync({ data: e, path: [], parent: t });
        return ht(r) ? {
          value: r.value
        } : {
          issues: t.common.issues
        };
      } catch (r) {
        (a = (n = r == null ? void 0 : r.message) == null ? void 0 : n.toLowerCase()) != null && a.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((r) => ht(r) ? {
      value: r.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Te(e)
    }, a = this._parse({ data: e, path: n.path, parent: n }), r = await (Qt(a) ? a : Promise.resolve(a));
    return Vs(n, r);
  }
  refine(e, t) {
    const n = (a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t;
    return this._refinement((a, r) => {
      const i = e(a), o = () => r.addIssue({
        code: m.custom,
        ...n(a)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, a) => e(n) ? !0 : (a.addIssue(typeof t == "function" ? t(n, a) : t), !1));
  }
  _refinement(e) {
    return new pt({
      schema: this,
      typeName: T.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return Oe.create(this, this._def);
  }
  nullable() {
    return gt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return oe.create(this);
  }
  promise() {
    return as.create(this, this._def);
  }
  or(e) {
    return ts.create([this, e], this._def);
  }
  and(e) {
    return ss.create(this, e, this._def);
  }
  transform(e) {
    return new pt({
      ...N(this._def),
      schema: this,
      typeName: T.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Es({
      ...N(this._def),
      innerType: this,
      defaultValue: t,
      typeName: T.ZodDefault
    });
  }
  brand() {
    return new dr({
      typeName: T.ZodBranded,
      type: this,
      ...N(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new bs({
      ...N(this._def),
      innerType: this,
      catchValue: t,
      typeName: T.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Ns.create(this, e);
  }
  readonly() {
    return Ts.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Fa = /^c[^\s-]{8,}$/i, qa = /^[0-9a-z]+$/, Va = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Wa = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Ha = /^[a-z0-9_-]{21}$/i, Za = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, za = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ja = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Ga = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let us;
const Ka = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Ya = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Xa = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Qa = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, er = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, tr = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Cn = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", sr = new RegExp(`^${Cn}$`);
function Un(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function nr(s) {
  return new RegExp(`^${Un(s)}$`);
}
function ar(s) {
  let e = `${Cn}T${Un(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function rr(s, e) {
  return !!((e === "v4" || !e) && Ka.test(s) || (e === "v6" || !e) && Xa.test(s));
}
function ir(s, e) {
  if (!Za.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(n));
    return !(typeof a != "object" || a === null || "typ" in a && (a == null ? void 0 : a.typ) !== "JWT" || !a.alg || e && a.alg !== e);
  } catch {
    return !1;
  }
}
function or(s, e) {
  return !!((e === "v4" || !e) && Ya.test(s) || (e === "v6" || !e) && Qa.test(s));
}
class ve extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== _.string) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: m.invalid_type,
        expected: _.string,
        received: r.parsedType
      }), x;
    }
    const n = new G();
    let a;
    for (const r of this._def.checks)
      if (r.kind === "min")
        e.data.length < r.value && (a = this._getOrReturnCtx(e, a), y(a, {
          code: m.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "max")
        e.data.length > r.value && (a = this._getOrReturnCtx(e, a), y(a, {
          code: m.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "length") {
        const i = e.data.length > r.value, o = e.data.length < r.value;
        (i || o) && (a = this._getOrReturnCtx(e, a), i ? y(a, {
          code: m.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }) : o && y(a, {
          code: m.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }), n.dirty());
      } else if (r.kind === "email")
        Ja.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "email",
          code: m.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "emoji")
        us || (us = new RegExp(Ga, "u")), us.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "emoji",
          code: m.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "uuid")
        Wa.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "uuid",
          code: m.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "nanoid")
        Ha.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "nanoid",
          code: m.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid")
        Fa.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "cuid",
          code: m.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid2")
        qa.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "cuid2",
          code: m.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "ulid")
        Va.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "ulid",
          code: m.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "url")
        try {
          new URL(e.data);
        } catch {
          a = this._getOrReturnCtx(e, a), y(a, {
            validation: "url",
            code: m.invalid_string,
            message: r.message
          }), n.dirty();
        }
      else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "regex",
        code: m.invalid_string,
        message: r.message
      }), n.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.invalid_string,
        validation: { includes: r.value, position: r.position },
        message: r.message
      }), n.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.invalid_string,
        validation: { startsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.invalid_string,
        validation: { endsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "datetime" ? ar(r).test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.invalid_string,
        validation: "datetime",
        message: r.message
      }), n.dirty()) : r.kind === "date" ? sr.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.invalid_string,
        validation: "date",
        message: r.message
      }), n.dirty()) : r.kind === "time" ? nr(r).test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.invalid_string,
        validation: "time",
        message: r.message
      }), n.dirty()) : r.kind === "duration" ? za.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "duration",
        code: m.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "ip" ? rr(e.data, r.version) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "ip",
        code: m.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "jwt" ? ir(e.data, r.alg) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "jwt",
        code: m.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "cidr" ? or(e.data, r.version) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "cidr",
        code: m.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64" ? er.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "base64",
        code: m.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64url" ? tr.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "base64url",
        code: m.invalid_string,
        message: r.message
      }), n.dirty()) : M.assertNever(r);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((a) => e.test(a), {
      validation: t,
      code: m.invalid_string,
      ...v.errToObj(n)
    });
  }
  _addCheck(e) {
    return new ve({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...v.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...v.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...v.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...v.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...v.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...v.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...v.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...v.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...v.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...v.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...v.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...v.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...v.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ...v.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...v.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...v.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...v.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...v.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...v.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...v.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...v.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...v.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...v.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, v.errToObj(e));
  }
  trim() {
    return new ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
ve.create = (s) => new ve({
  checks: [],
  typeName: T.ZodString,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...N(s)
});
function cr(s, e) {
  const t = (s.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, a = t > n ? t : n, r = Number.parseInt(s.toFixed(a).replace(".", "")), i = Number.parseInt(e.toFixed(a).replace(".", ""));
  return r % i / 10 ** a;
}
class ft extends k {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== _.number) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: m.invalid_type,
        expected: _.number,
        received: r.parsedType
      }), x;
    }
    let n;
    const a = new G();
    for (const r of this._def.checks)
      r.kind === "int" ? M.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.invalid_type,
        expected: "integer",
        received: "float",
        message: r.message
      }), a.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.too_small,
        minimum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.too_big,
        maximum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? cr(e.data, r.value) !== 0 && (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.not_finite,
        message: r.message
      }), a.dirty()) : M.assertNever(r);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, v.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, v.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, v.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, v.toString(t));
  }
  setLimit(e, t, n, a) {
    return new ft({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: v.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ft({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: v.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: v.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: v.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: v.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: v.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: v.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: v.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: v.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: v.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && M.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
ft.create = (s) => new ft({
  checks: [],
  typeName: T.ZodNumber,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...N(s)
});
class Ot extends k {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== _.bigint)
      return this._getInvalidInput(e);
    let n;
    const a = new G();
    for (const r of this._def.checks)
      r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.too_small,
        type: "bigint",
        minimum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.too_big,
        type: "bigint",
        maximum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), y(n, {
        code: m.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : M.assertNever(r);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return y(t, {
      code: m.invalid_type,
      expected: _.bigint,
      received: t.parsedType
    }), x;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, v.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, v.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, v.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, v.toString(t));
  }
  setLimit(e, t, n, a) {
    return new Ot({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: v.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Ot({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: v.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: v.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: v.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: v.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: v.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Ot.create = (s) => new Ot({
  checks: [],
  typeName: T.ZodBigInt,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...N(s)
});
class ws extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== _.boolean) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: m.invalid_type,
        expected: _.boolean,
        received: n.parsedType
      }), x;
    }
    return Q(e.data);
  }
}
ws.create = (s) => new ws({
  typeName: T.ZodBoolean,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...N(s)
});
class es extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== _.date) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: m.invalid_type,
        expected: _.date,
        received: r.parsedType
      }), x;
    }
    if (Number.isNaN(e.data.getTime())) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: m.invalid_date
      }), x;
    }
    const n = new G();
    let a;
    for (const r of this._def.checks)
      r.kind === "min" ? e.data.getTime() < r.value && (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.too_small,
        message: r.message,
        inclusive: !0,
        exact: !1,
        minimum: r.value,
        type: "date"
      }), n.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (a = this._getOrReturnCtx(e, a), y(a, {
        code: m.too_big,
        message: r.message,
        inclusive: !0,
        exact: !1,
        maximum: r.value,
        type: "date"
      }), n.dirty()) : M.assertNever(r);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new es({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: v.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: v.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
es.create = (s) => new es({
  checks: [],
  coerce: (s == null ? void 0 : s.coerce) || !1,
  typeName: T.ZodDate,
  ...N(s)
});
class Ws extends k {
  _parse(e) {
    if (this._getType(e) !== _.symbol) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: m.invalid_type,
        expected: _.symbol,
        received: n.parsedType
      }), x;
    }
    return Q(e.data);
  }
}
Ws.create = (s) => new Ws({
  typeName: T.ZodSymbol,
  ...N(s)
});
class Hs extends k {
  _parse(e) {
    if (this._getType(e) !== _.undefined) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: m.invalid_type,
        expected: _.undefined,
        received: n.parsedType
      }), x;
    }
    return Q(e.data);
  }
}
Hs.create = (s) => new Hs({
  typeName: T.ZodUndefined,
  ...N(s)
});
class Zs extends k {
  _parse(e) {
    if (this._getType(e) !== _.null) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: m.invalid_type,
        expected: _.null,
        received: n.parsedType
      }), x;
    }
    return Q(e.data);
  }
}
Zs.create = (s) => new Zs({
  typeName: T.ZodNull,
  ...N(s)
});
class zs extends k {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Q(e.data);
  }
}
zs.create = (s) => new zs({
  typeName: T.ZodAny,
  ...N(s)
});
class Is extends k {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Q(e.data);
  }
}
Is.create = (s) => new Is({
  typeName: T.ZodUnknown,
  ...N(s)
});
class Me extends k {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return y(t, {
      code: m.invalid_type,
      expected: _.never,
      received: t.parsedType
    }), x;
  }
}
Me.create = (s) => new Me({
  typeName: T.ZodNever,
  ...N(s)
});
class Js extends k {
  _parse(e) {
    if (this._getType(e) !== _.undefined) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: m.invalid_type,
        expected: _.void,
        received: n.parsedType
      }), x;
    }
    return Q(e.data);
  }
}
Js.create = (s) => new Js({
  typeName: T.ZodVoid,
  ...N(s)
});
class oe extends k {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== _.array)
      return y(t, {
        code: m.invalid_type,
        expected: _.array,
        received: t.parsedType
      }), x;
    if (a.exactLength !== null) {
      const i = t.data.length > a.exactLength.value, o = t.data.length < a.exactLength.value;
      (i || o) && (y(t, {
        code: i ? m.too_big : m.too_small,
        minimum: o ? a.exactLength.value : void 0,
        maximum: i ? a.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: a.exactLength.message
      }), n.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (y(t, {
      code: m.too_small,
      minimum: a.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.minLength.message
    }), n.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (y(t, {
      code: m.too_big,
      maximum: a.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => a.type._parseAsync(new de(t, i, t.path, o)))).then((i) => G.mergeArray(n, i));
    const r = [...t.data].map((i, o) => a.type._parseSync(new de(t, i, t.path, o)));
    return G.mergeArray(n, r);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new oe({
      ...this._def,
      minLength: { value: e, message: v.toString(t) }
    });
  }
  max(e, t) {
    return new oe({
      ...this._def,
      maxLength: { value: e, message: v.toString(t) }
    });
  }
  length(e, t) {
    return new oe({
      ...this._def,
      exactLength: { value: e, message: v.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
oe.create = (s, e) => new oe({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: T.ZodArray,
  ...N(e)
});
function at(s) {
  if (s instanceof $) {
    const e = {};
    for (const t in s.shape) {
      const n = s.shape[t];
      e[t] = Oe.create(at(n));
    }
    return new $({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof oe ? new oe({
    ...s._def,
    type: at(s.element)
  }) : s instanceof Oe ? Oe.create(at(s.unwrap())) : s instanceof gt ? gt.create(at(s.unwrap())) : s instanceof Ze ? Ze.create(s.items.map((e) => at(e))) : s;
}
class $ extends k {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = M.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== _.object) {
      const d = this._getOrReturnCtx(e);
      return y(d, {
        code: m.invalid_type,
        expected: _.object,
        received: d.parsedType
      }), x;
    }
    const { status: n, ctx: a } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof Me && this._def.unknownKeys === "strip"))
      for (const d in a.data)
        i.includes(d) || o.push(d);
    const c = [];
    for (const d of i) {
      const l = r[d], u = a.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: l._parse(new de(a, u, a.path, d)),
        alwaysSet: d in a.data
      });
    }
    if (this._def.catchall instanceof Me) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: a.data[l] }
          });
      else if (d === "strict")
        o.length > 0 && (y(a, {
          code: m.unrecognized_keys,
          keys: o
        }), n.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const l of o) {
        const u = a.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: d._parse(
            new de(a, u, a.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in a.data
        });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const l of c) {
        const u = await l.key, p = await l.value;
        d.push({
          key: u,
          value: p,
          alwaysSet: l.alwaysSet
        });
      }
      return d;
    }).then((d) => G.mergeObjectSync(n, d)) : G.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return v.errToObj, new $({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var r, i;
          const a = ((i = (r = this._def).errorMap) == null ? void 0 : i.call(r, t, n).message) ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: v.errToObj(e).message ?? a
          } : {
            message: a
          };
        }
      } : {}
    });
  }
  strip() {
    return new $({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new $({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new $({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new $({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: T.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new $({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of M.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new $({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of M.objectKeys(this.shape))
      e[n] || (t[n] = this.shape[n]);
    return new $({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return at(this);
  }
  partial(e) {
    const t = {};
    for (const n of M.objectKeys(this.shape)) {
      const a = this.shape[n];
      e && !e[n] ? t[n] = a : t[n] = a.optional();
    }
    return new $({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const n of M.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let r = this.shape[n];
        for (; r instanceof Oe; )
          r = r._def.innerType;
        t[n] = r;
      }
    return new $({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Dn(M.objectKeys(this.shape));
  }
}
$.create = (s, e) => new $({
  shape: () => s,
  unknownKeys: "strip",
  catchall: Me.create(),
  typeName: T.ZodObject,
  ...N(e)
});
$.strictCreate = (s, e) => new $({
  shape: () => s,
  unknownKeys: "strict",
  catchall: Me.create(),
  typeName: T.ZodObject,
  ...N(e)
});
$.lazycreate = (s, e) => new $({
  shape: s,
  unknownKeys: "strip",
  catchall: Me.create(),
  typeName: T.ZodObject,
  ...N(e)
});
class ts extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function a(r) {
      for (const o of r)
        if (o.result.status === "valid")
          return o.result;
      for (const o of r)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = r.map((o) => new ce(o.ctx.common.issues));
      return y(t, {
        code: m.invalid_union,
        unionErrors: i
      }), x;
    }
    if (t.common.async)
      return Promise.all(n.map(async (r) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await r._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(a);
    {
      let r;
      const i = [];
      for (const c of n) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = c._parseSync({
          data: t.data,
          path: t.path,
          parent: d
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !r && (r = { result: l, ctx: d }), d.common.issues.length && i.push(d.common.issues);
      }
      if (r)
        return t.common.issues.push(...r.ctx.common.issues), r.result;
      const o = i.map((c) => new ce(c));
      return y(t, {
        code: m.invalid_union,
        unionErrors: o
      }), x;
    }
  }
  get options() {
    return this._def.options;
  }
}
ts.create = (s, e) => new ts({
  options: s,
  typeName: T.ZodUnion,
  ...N(e)
});
function As(s, e) {
  const t = Te(s), n = Te(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === _.object && n === _.object) {
    const a = M.objectKeys(e), r = M.objectKeys(s).filter((o) => a.indexOf(o) !== -1), i = { ...s, ...e };
    for (const o of r) {
      const c = As(s[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === _.array && n === _.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const a = [];
    for (let r = 0; r < s.length; r++) {
      const i = s[r], o = e[r], c = As(i, o);
      if (!c.valid)
        return { valid: !1 };
      a.push(c.data);
    }
    return { valid: !0, data: a };
  } else return t === _.date && n === _.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class ss extends k {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), a = (r, i) => {
      if (Fs(r) || Fs(i))
        return x;
      const o = As(r.value, i.value);
      return o.valid ? ((qs(r) || qs(i)) && t.dirty(), { status: t.value, value: o.data }) : (y(n, {
        code: m.invalid_intersection_types
      }), x);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([r, i]) => a(r, i)) : a(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
ss.create = (s, e, t) => new ss({
  left: s,
  right: e,
  typeName: T.ZodIntersection,
  ...N(t)
});
class Ze extends k {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== _.array)
      return y(n, {
        code: m.invalid_type,
        expected: _.array,
        received: n.parsedType
      }), x;
    if (n.data.length < this._def.items.length)
      return y(n, {
        code: m.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), x;
    !this._def.rest && n.data.length > this._def.items.length && (y(n, {
      code: m.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const r = [...n.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new de(n, i, n.path, o)) : null;
    }).filter((i) => !!i);
    return n.common.async ? Promise.all(r).then((i) => G.mergeArray(t, i)) : G.mergeArray(t, r);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Ze({
      ...this._def,
      rest: e
    });
  }
}
Ze.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Ze({
    items: s,
    typeName: T.ZodTuple,
    rest: null,
    ...N(e)
  });
};
class ns extends k {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== _.object)
      return y(n, {
        code: m.invalid_type,
        expected: _.object,
        received: n.parsedType
      }), x;
    const a = [], r = this._def.keyType, i = this._def.valueType;
    for (const o in n.data)
      a.push({
        key: r._parse(new de(n, o, n.path, o)),
        value: i._parse(new de(n, n.data[o], n.path, o)),
        alwaysSet: o in n.data
      });
    return n.common.async ? G.mergeObjectAsync(t, a) : G.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof k ? new ns({
      keyType: e,
      valueType: t,
      typeName: T.ZodRecord,
      ...N(n)
    }) : new ns({
      keyType: ve.create(),
      valueType: e,
      typeName: T.ZodRecord,
      ...N(t)
    });
  }
}
class Gs extends k {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== _.map)
      return y(n, {
        code: m.invalid_type,
        expected: _.map,
        received: n.parsedType
      }), x;
    const a = this._def.keyType, r = this._def.valueType, i = [...n.data.entries()].map(([o, c], d) => ({
      key: a._parse(new de(n, o, n.path, [d, "key"])),
      value: r._parse(new de(n, c, n.path, [d, "value"]))
    }));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const d = await c.key, l = await c.value;
          if (d.status === "aborted" || l.status === "aborted")
            return x;
          (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const d = c.key, l = c.value;
        if (d.status === "aborted" || l.status === "aborted")
          return x;
        (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Gs.create = (s, e, t) => new Gs({
  valueType: e,
  keyType: s,
  typeName: T.ZodMap,
  ...N(t)
});
class Mt extends k {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== _.set)
      return y(n, {
        code: m.invalid_type,
        expected: _.set,
        received: n.parsedType
      }), x;
    const a = this._def;
    a.minSize !== null && n.data.size < a.minSize.value && (y(n, {
      code: m.too_small,
      minimum: a.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.minSize.message
    }), t.dirty()), a.maxSize !== null && n.data.size > a.maxSize.value && (y(n, {
      code: m.too_big,
      maximum: a.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.maxSize.message
    }), t.dirty());
    const r = this._def.valueType;
    function i(c) {
      const d = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return x;
        l.status === "dirty" && t.dirty(), d.add(l.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...n.data.values()].map((c, d) => r._parse(new de(n, c, n.path, d)));
    return n.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new Mt({
      ...this._def,
      minSize: { value: e, message: v.toString(t) }
    });
  }
  max(e, t) {
    return new Mt({
      ...this._def,
      maxSize: { value: e, message: v.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Mt.create = (s, e) => new Mt({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: T.ZodSet,
  ...N(e)
});
class Ks extends k {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Ks.create = (s, e) => new Ks({
  getter: s,
  typeName: T.ZodLazy,
  ...N(e)
});
class Ys extends k {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return y(t, {
        received: t.data,
        code: m.invalid_literal,
        expected: this._def.value
      }), x;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Ys.create = (s, e) => new Ys({
  value: s,
  typeName: T.ZodLiteral,
  ...N(e)
});
function Dn(s, e) {
  return new mt({
    values: s,
    typeName: T.ZodEnum,
    ...N(e)
  });
}
class mt extends k {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return y(t, {
        expected: M.joinValues(n),
        received: t.parsedType,
        code: m.invalid_type
      }), x;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return y(t, {
        received: t.data,
        code: m.invalid_enum_value,
        options: n
      }), x;
    }
    return Q(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return mt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return mt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
mt.create = Dn;
class Xs extends k {
  _parse(e) {
    const t = M.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== _.string && n.parsedType !== _.number) {
      const a = M.objectValues(t);
      return y(n, {
        expected: M.joinValues(a),
        received: n.parsedType,
        code: m.invalid_type
      }), x;
    }
    if (this._cache || (this._cache = new Set(M.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const a = M.objectValues(t);
      return y(n, {
        received: n.data,
        code: m.invalid_enum_value,
        options: a
      }), x;
    }
    return Q(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Xs.create = (s, e) => new Xs({
  values: s,
  typeName: T.ZodNativeEnum,
  ...N(e)
});
class as extends k {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== _.promise && t.common.async === !1)
      return y(t, {
        code: m.invalid_type,
        expected: _.promise,
        received: t.parsedType
      }), x;
    const n = t.parsedType === _.promise ? t.data : Promise.resolve(t.data);
    return Q(n.then((a) => this._def.type.parseAsync(a, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
as.create = (s, e) => new as({
  type: s,
  typeName: T.ZodPromise,
  ...N(e)
});
class pt extends k {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === T.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), a = this._def.effect || null, r = {
      addIssue: (i) => {
        y(n, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (r.addIssue = r.addIssue.bind(r), a.type === "preprocess") {
      const i = a.transform(n.data, r);
      if (n.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return x;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: n.path,
            parent: n
          });
          return c.status === "aborted" ? x : c.status === "dirty" || t.value === "dirty" ? Nt(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return x;
        const o = this._def.schema._parseSync({
          data: i,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? x : o.status === "dirty" || t.value === "dirty" ? Nt(o.value) : o;
      }
    }
    if (a.type === "refinement") {
      const i = (o) => {
        const c = a.refinement(o, r);
        if (n.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? x : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => o.status === "aborted" ? x : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (a.type === "transform")
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!ht(i))
          return x;
        const o = a.transform(i.value, r);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((i) => ht(i) ? Promise.resolve(a.transform(i.value, r)).then((o) => ({
          status: t.value,
          value: o
        })) : x);
    M.assertNever(a);
  }
}
pt.create = (s, e, t) => new pt({
  schema: s,
  typeName: T.ZodEffects,
  effect: e,
  ...N(t)
});
pt.createWithPreprocess = (s, e, t) => new pt({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: T.ZodEffects,
  ...N(t)
});
class Oe extends k {
  _parse(e) {
    return this._getType(e) === _.undefined ? Q(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Oe.create = (s, e) => new Oe({
  innerType: s,
  typeName: T.ZodOptional,
  ...N(e)
});
class gt extends k {
  _parse(e) {
    return this._getType(e) === _.null ? Q(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
gt.create = (s, e) => new gt({
  innerType: s,
  typeName: T.ZodNullable,
  ...N(e)
});
class Es extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === _.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Es.create = (s, e) => new Es({
  innerType: s,
  typeName: T.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...N(e)
});
class bs extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, a = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return Qt(a) ? a.then((r) => ({
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new ce(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new ce(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
bs.create = (s, e) => new bs({
  innerType: s,
  typeName: T.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...N(e)
});
class Qs extends k {
  _parse(e) {
    if (this._getType(e) !== _.nan) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: m.invalid_type,
        expected: _.nan,
        received: n.parsedType
      }), x;
    }
    return { status: "valid", value: e.data };
  }
}
Qs.create = (s) => new Qs({
  typeName: T.ZodNaN,
  ...N(s)
});
class dr extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Ns extends k {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const r = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return r.status === "aborted" ? x : r.status === "dirty" ? (t.dirty(), Nt(r.value)) : this._def.out._parseAsync({
          data: r.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const a = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return a.status === "aborted" ? x : a.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: a.value
      }) : this._def.out._parseSync({
        data: a.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new Ns({
      in: e,
      out: t,
      typeName: T.ZodPipeline
    });
  }
}
class Ts extends k {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (a) => (ht(a) && (a.value = Object.freeze(a.value)), a);
    return Qt(t) ? t.then((a) => n(a)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Ts.create = (s, e) => new Ts({
  innerType: s,
  typeName: T.ZodReadonly,
  ...N(e)
});
var T;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(T || (T = {}));
const g = ve.create, ie = ft.create, Y = ws.create, Pn = Is.create;
Me.create;
const Rs = oe.create, O = $.create;
ts.create;
ss.create;
Ze.create;
const Ln = ns.create, yt = mt.create;
as.create;
Oe.create;
gt.create;
class f extends Error {
  constructor(e, t, n = 400, a) {
    super(t), this.code = e, this.status = n, this.details = a;
  }
}
function lr(s) {
  return s instanceof f;
}
function hs(s, e, t = {}) {
  const n = JSON.stringify({
    level: s,
    event: e,
    ...t
  });
  if (s === "error") {
    console.error(n);
    return;
  }
  if (s === "warn") {
    console.warn(n);
    return;
  }
  console.log(n);
}
const We = {
  info: (s, e) => hs("info", s, e),
  warn: (s, e) => hs("warn", s, e),
  error: (s, e) => hs("error", s, e)
};
function ur() {
  return async (s, e) => {
    try {
      await e();
    } catch (t) {
      return Bn(t, s);
    }
  };
}
function Bn(s, e) {
  const t = e.get("requestId");
  return lr(s) ? (We.warn("app_error", { requestId: t, code: s.code, message: s.message }), e.json({ error: { code: s.code, message: s.message, details: s.details } }, s.status)) : s instanceof ce ? (We.warn("validation_error", { requestId: t, issues: s.issues }), e.json(
    { error: { code: "VALIDATION_ERROR", message: "Invalid request", details: s.flatten() } },
    400
  )) : (We.error("unhandled_error", {
    requestId: t,
    message: s instanceof Error ? s.message : String(s)
  }), e.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, 500));
}
function W(s) {
  const e = new Uint8Array(16);
  crypto.getRandomValues(e);
  const t = Array.from(e, (n) => n.toString(16).padStart(2, "0")).join("");
  return `${s}_${t}`;
}
function hr() {
  return async (s, e) => {
    const t = s.req.header("x-request-id") || W("req");
    s.set("requestId", t), s.header("x-request-id", t), await e();
  };
}
class fr {
  constructor(e) {
    this.adapters = e;
  }
  get(e) {
    const t = this.adapters.find((n) => n.type === e);
    if (!t)
      throw new f("CHANNEL_NOT_SUPPORTED", `Unsupported channel: ${e}`, 400);
    return t;
  }
}
async function en(s) {
  const e = new TextEncoder().encode(s), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t), (n) => n.toString(16).padStart(2, "0")).join("");
}
async function tn(s, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return Array.from(new Uint8Array(n), (a) => a.toString(16).padStart(2, "0")).join("");
}
async function ze(s, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return ae(new Uint8Array(n));
}
function _t(s, e) {
  if (s.length !== e.length) return !1;
  let t = 0;
  for (let n = 0; n < s.length; n += 1)
    t |= s.charCodeAt(n) ^ e.charCodeAt(n);
  return t === 0;
}
function ae(s) {
  const e = typeof s == "string" ? new TextEncoder().encode(s) : s;
  let t = "";
  for (const n of e) t += String.fromCharCode(n);
  return btoa(t).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
function ks(s) {
  return new TextDecoder().decode(jn(s));
}
function jn(s) {
  const e = s.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(s.length / 4) * 4, "="), t = atob(e), n = new Uint8Array(t.length);
  for (let a = 0; a < t.length; a += 1)
    n[a] = t.charCodeAt(a);
  return n;
}
async function $n(s, e = crypto.getRandomValues(new Uint8Array(16))) {
  const n = await crypto.subtle.importKey("raw", new TextEncoder().encode(s), "PBKDF2", !1, ["deriveBits"]), a = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: e, iterations: 1e5, hash: "SHA-256" },
    n,
    256
  );
  return `pbkdf2_sha256$100000$${ae(e)}$${ae(new Uint8Array(a))}`;
}
async function xs(s, e) {
  if (!e) return !1;
  const [t, n, a, r] = e.split("$");
  if (t !== "pbkdf2_sha256" || !n || !a || !r) return !1;
  const i = Number(n);
  if (!Number.isInteger(i) || i < 1e4) return !1;
  const o = await crypto.subtle.importKey("raw", new TextEncoder().encode(s), "PBKDF2", !1, ["deriveBits"]), c = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: jn(a), iterations: i, hash: "SHA-256" },
    o,
    256
  );
  return _t(ae(new Uint8Array(c)), r);
}
function S() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
const mr = O({
  event_id: g().optional(),
  event_type: g().default("message.created"),
  contact: O({
    external_id: g().optional(),
    name: g().optional(),
    avatar_url: g().optional()
  }).optional(),
  message: O({
    external_id: g().optional(),
    type: yt(["text", "image", "file", "audio", "video", "event"]).default("text"),
    text: g().optional(),
    attachments: Rs(Ln(Pn())).default([])
  }),
  timestamp: g().optional()
});
class pr {
  constructor() {
    A(this, "type", "custom_webhook");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const n = e.headers.get("x-supportly-signature");
    if (!n)
      throw new f("SIGNATURE_INVALID", "Missing webhook signature", 401);
    const a = await e.text(), r = await tn(t.webhookSecretCiphertext, a);
    if (!_t(n, r))
      throw new f("SIGNATURE_INVALID", "Invalid webhook signature", 401);
  }
  async parseInbound(e, t) {
    var i, o, c, d, l;
    const n = mr.parse(await e.json()), a = ((i = n.contact) == null ? void 0 : i.external_id) ?? n.event_id ?? await en(JSON.stringify(n)), r = ((o = n.contact) == null ? void 0 : o.external_id) ?? `anonymous:${await en(`${t.id}:${a}`)}`;
    return [
      {
        externalMessageId: n.message.external_id ?? n.event_id,
        externalContactId: r,
        externalThreadId: a,
        contactName: (c = n.contact) == null ? void 0 : c.name,
        contactAvatarUrl: (d = n.contact) == null ? void 0 : d.avatar_url,
        isAnonymous: !((l = n.contact) != null && l.external_id),
        messageType: n.message.type,
        content: n.message.text,
        attachments: n.message.attachments.map((u) => ({
          type: typeof u.type == "string" ? u.type : "file",
          url: typeof u.url == "string" ? u.url : void 0,
          fileId: typeof u.file_id == "string" ? u.file_id : void 0,
          mimeType: typeof u.mime_type == "string" ? u.mime_type : void 0,
          fileName: typeof u.file_name == "string" ? u.file_name : void 0,
          size: typeof u.size == "number" ? u.size : void 0
        })),
        rawPayload: n,
        receivedAt: n.timestamp ?? S()
      }
    ];
  }
  async sendMessage(e, t) {
    if (!e.outboundUrl)
      return { externalMessageId: t.messageId };
    const n = {
      event_type: "message.send",
      conversation_id: t.conversationId,
      message_id: t.messageId,
      message: {
        type: t.messageType,
        text: t.content,
        attachments: t.attachments ?? []
      }
    }, a = JSON.stringify(n), r = new Headers({ "content-type": "application/json" });
    e.webhookSecretCiphertext && r.set("x-supportly-signature", await tn(e.webhookSecretCiphertext, a));
    const i = await fetch(e.outboundUrl, {
      method: "POST",
      headers: r,
      body: a
    });
    if (!i.ok)
      throw new f("MESSAGE_SEND_FAILED", `Outbound webhook failed: ${i.status}`, 502);
    return { externalMessageId: t.messageId };
  }
}
class gr {
  constructor() {
    A(this, "type", "forum");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, t) {
    return { externalMessageId: t.messageId };
  }
}
const Fn = O({
  id: ie(),
  is_bot: Y().optional(),
  first_name: g().optional(),
  last_name: g().optional(),
  username: g().optional()
}), yr = O({
  id: ie(),
  type: g(),
  first_name: g().optional(),
  last_name: g().optional(),
  username: g().optional(),
  title: g().optional()
}), _r = O({
  message_id: ie(),
  date: ie(),
  chat: yr,
  from: Fn.optional(),
  text: g().optional()
}), vr = O({
  update_id: ie(),
  message: _r.optional()
}), wr = O({
  ok: Y(),
  result: O({
    message_id: ie()
  }).optional(),
  description: g().optional()
}), Ir = O({
  ok: Y(),
  result: Y().optional(),
  description: g().optional()
}), Ar = O({
  ok: Y(),
  result: Fn.extend({
    can_join_groups: Y().optional(),
    can_read_all_group_messages: Y().optional(),
    supports_inline_queries: Y().optional()
  }).optional(),
  description: g().optional()
}), Er = O({
  ok: Y(),
  result: O({
    url: g(),
    has_custom_certificate: Y().optional(),
    pending_update_count: ie(),
    ip_address: g().optional(),
    last_error_date: ie().optional(),
    last_error_message: g().optional(),
    last_synchronization_error_date: ie().optional(),
    max_connections: ie().optional(),
    allowed_updates: Rs(g()).optional()
  }).optional(),
  description: g().optional()
});
class qn {
  constructor() {
    A(this, "type", "telegram");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const n = e.headers.get("x-telegram-bot-api-secret-token");
    if (!n || !_t(n, t.webhookSecretCiphertext))
      throw new f("SIGNATURE_INVALID", "Invalid Telegram webhook secret", 401);
  }
  async parseInbound(e) {
    var a;
    const t = vr.parse(await e.json()), n = t.message;
    return !((a = n == null ? void 0 : n.text) != null && a.trim()) || !n.from ? [] : [
      {
        externalMessageId: String(t.update_id),
        externalContactId: String(n.from.id),
        externalThreadId: String(n.chat.id),
        contactName: sn(n.from) ?? sn(n.chat),
        isAnonymous: !1,
        messageType: "text",
        content: n.text,
        attachments: [],
        rawPayload: t,
        receivedAt: new Date(n.date * 1e3).toISOString()
      }
    ];
  }
  async sendMessage(e, t) {
    if (t.messageType !== "text")
      throw new f("MESSAGE_TYPE_NOT_SUPPORTED", "Telegram media outbound is not supported yet", 400);
    const n = e.credentialCiphertext;
    if (!n)
      throw new f("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    const a = await fetch(`https://api.telegram.org/bot${n}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: t.externalThreadId,
        text: t.content ?? ""
      })
    }), r = wr.parse(await a.json().catch(() => ({ ok: !1 })));
    if (!a.ok || !r.ok || !r.result)
      throw new f(
        "MESSAGE_SEND_FAILED",
        `Telegram sendMessage failed: ${a.status}${r.description ? ` ${r.description}` : ""}`,
        502
      );
    return { externalMessageId: String(r.result.message_id) };
  }
  async setWebhook(e, t) {
    const n = Ir.parse(
      await this.callTelegram(e, "setWebhook", {
        url: t.webhookUrl,
        secret_token: e.webhookSecretCiphertext || void 0,
        allowed_updates: ["message"],
        drop_pending_updates: t.dropPendingUpdates ?? !1
      })
    );
    if (!n.ok || !n.result)
      throw new f("TELEGRAM_SET_WEBHOOK_FAILED", n.description ?? "Telegram setWebhook failed", 502);
    return {
      ok: !0,
      description: n.description,
      webhookUrl: t.webhookUrl,
      webhookInfo: await this.getWebhookInfo(e)
    };
  }
  async testConnection(e, t) {
    const n = await this.getMe(e), a = await this.getWebhookInfo(e);
    return {
      bot: n,
      webhookInfo: a,
      webhookUrlMatches: t ? a.url === t : !!a.url,
      expectedWebhookUrl: t
    };
  }
  async getMe(e) {
    const t = Ar.parse(await this.callTelegram(e, "getMe"));
    if (!t.ok || !t.result)
      throw new f("TELEGRAM_GET_ME_FAILED", t.description ?? "Telegram getMe failed", 502);
    return {
      id: t.result.id,
      isBot: t.result.is_bot,
      firstName: t.result.first_name,
      username: t.result.username
    };
  }
  async getWebhookInfo(e) {
    const t = Er.parse(await this.callTelegram(e, "getWebhookInfo"));
    if (!t.ok || !t.result)
      throw new f("TELEGRAM_GET_WEBHOOK_INFO_FAILED", t.description ?? "Telegram getWebhookInfo failed", 502);
    return {
      url: t.result.url,
      pendingUpdateCount: t.result.pending_update_count,
      lastErrorDate: t.result.last_error_date,
      lastErrorMessage: t.result.last_error_message,
      allowedUpdates: t.result.allowed_updates
    };
  }
  async callTelegram(e, t, n) {
    const a = e.credentialCiphertext;
    if (!a)
      throw new f("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    const r = await fetch(`https://api.telegram.org/bot${a}/${t}`, {
      method: n ? "POST" : "GET",
      headers: n ? { "content-type": "application/json" } : void 0,
      body: n ? JSON.stringify(n) : void 0
    }), i = await r.json().catch(() => ({ ok: !1 }));
    if (!r.ok) {
      const o = typeof i == "object" && i && "description" in i ? String(i.description) : `HTTP ${r.status}`;
      throw new f("TELEGRAM_API_FAILED", `Telegram ${t} failed: ${o}`, 502);
    }
    return i;
  }
}
function sn(s) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ").trim() || s.username || s.title || void 0;
}
class br {
  constructor() {
    A(this, "type", "web_chat");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, t) {
    return { externalMessageId: t.messageId };
  }
}
class Tr {
  constructor(e, t) {
    this.search = e, this.instanceName = t;
  }
  async uploadDocument(e) {
    return this.search.items.upload(e.path, e.content, {
      metadata: e.metadata
    });
  }
  async uploadDocumentAndPoll(e) {
    return this.search.items.uploadAndPoll(e.path, e.content, {
      metadata: e.metadata,
      timeoutMs: 3e4
    });
  }
  async deleteDocument(e) {
    await this.search.items.delete(e);
  }
  async listDocuments() {
    const e = [];
    let n = 1;
    for (; ; ) {
      const a = await this.search.items.list({
        page: n,
        per_page: 50,
        sort_by: "modified_at"
      }), r = a.result ?? [];
      e.push(...r);
      const i = a.result_info, o = (i == null ? void 0 : i.total_count) ?? e.length, c = (i == null ? void 0 : i.page) ?? n, d = (i == null ? void 0 : i.per_page) ?? 50;
      if (e.length >= o || r.length === 0 || (n = c + 1, n > Math.ceil(o / d) + 1)) break;
    }
    return e;
  }
  async searchKnowledge(e) {
    return ((await this.search.search({
      messages: [{ role: "user", content: e }],
      ai_search_options: {
        retrieval: {
          retrieval_type: "vector",
          max_num_results: 5,
          match_threshold: 0.35
        }
      }
    })).chunks ?? []).map((n) => {
      var a, r, i, o, c;
      return {
        id: n.id,
        title: String(((r = (a = n.item) == null ? void 0 : a.metadata) == null ? void 0 : r.filename) ?? ((i = n.item) == null ? void 0 : i.key) ?? "Knowledge"),
        path: ((o = n.item) == null ? void 0 : o.key) ?? "",
        score: n.score ?? 0,
        text: n.text ?? "",
        metadata: ((c = n.item) == null ? void 0 : c.metadata) ?? {}
      };
    });
  }
}
const xr = "@cf/meta/llama-3.1-8b-instruct", Sr = "kb/", Nr = 4 * 1024 * 1024, Rr = "media/", kr = 10 * 1024 * 1024, Or = 50 * 1024 * 1024;
class Mr {
  constructor(e, t) {
    this.ai = e, this.env = t;
  }
  async generateKnowledgeReply(e) {
    const t = this.env.DEFAULT_AI_MODEL || xr, n = Date.now(), a = Cr(e.question, e.references), r = await this.ai.run(t, { prompt: a });
    return {
      text: Ur(r),
      metadata: {
        model: t,
        latencyMs: Date.now() - n,
        referencesCount: e.references.length
      }
    };
  }
}
function Cr(s, e) {
  const t = e.map((n, a) => `Source ${a + 1}: ${n.title}
${n.text}`).join(`

`);
  return [
    "You are a customer support assistant.",
    "Answer the customer only using the knowledge context.",
    "If the answer is not in the context, say you are not sure and ask a human agent to help.",
    "",
    `Question: ${s}`,
    "",
    `Knowledge context:
${t}`
  ].join(`
`);
}
function Ur(s) {
  if (typeof s == "string") return s;
  if (s && typeof s == "object") {
    const e = s;
    if (typeof e.response == "string") return e.response;
    if (typeof e.result == "string") return e.result;
    if (typeof e.text == "string") return e.text;
  }
  return "抱歉，我暂时无法根据知识库生成回答。";
}
class Dr {
  constructor(e, t, n) {
    this.aiSearch = e, this.workersAi = t, this.messages = n;
  }
  async maybeCreateReply(e) {
    var a;
    if (e.handoffStatus === "agent" || !((a = e.messageContent) != null && a.trim())) return null;
    const t = await this.aiSearch.searchKnowledge(e.messageContent);
    if (t.length === 0) return null;
    const n = await this.workersAi.generateKnowledgeReply({
      question: e.messageContent,
      references: t
    });
    return this.messages.createOutbound({
      conversationId: e.conversationId,
      channelAccountId: e.channelAccountId,
      senderType: "ai",
      content: n.text,
      status: "sending",
      aiMetadata: n.metadata,
      aiReferences: t.map((r) => ({
        id: r.id,
        title: r.title,
        path: r.path,
        score: r.score
      }))
    });
  }
}
function nn(s) {
  return {
    id: s.id,
    channelType: s.channel_type,
    displayName: s.display_name,
    externalAccountId: s.external_account_id,
    credentialCiphertext: s.credential_ciphertext,
    webhookSecretCiphertext: s.webhook_secret_ciphertext,
    outboundUrl: s.outbound_url,
    status: s.status,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class Pr {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        ORDER BY created_at DESC
        `
    ).all()).results.map(nn);
  }
  async findById(e) {
    const t = await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        WHERE id = ?
        LIMIT 1
        `
    ).bind(e).first();
    return t ? nn(t) : null;
  }
  async create(e) {
    const t = W("ch"), n = S();
    await this.db.prepare(
      `
        INSERT INTO channel_accounts (
          id,
          channel_type,
          display_name,
          external_account_id,
          credential_ciphertext,
          webhook_secret_ciphertext,
          outbound_url,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
        `
    ).bind(
      t,
      e.channelType,
      e.displayName,
      e.externalAccountId ?? null,
      e.credentialCiphertext ?? null,
      e.webhookSecretCiphertext ?? null,
      e.outboundUrl ?? null,
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created channel account not found");
    return a;
  }
}
class Lr {
  constructor(e, t) {
    this.channels = e, this.adapters = t;
  }
  listAccounts() {
    return this.channels.list();
  }
  createAccount(e) {
    return this.adapters.get(e.channelType), this.channels.create(e);
  }
  async getAccount(e) {
    const t = await this.channels.findById(e);
    if (!t)
      throw new f("CHANNEL_NOT_FOUND", "Channel account not found", 404);
    return t;
  }
  getAdapter(e) {
    return this.adapters.get(e.channelType);
  }
}
function Ee(s) {
  return {
    id: s.id,
    channelAccountId: s.channel_account_id,
    externalContactId: s.external_contact_id,
    externalThreadId: s.external_thread_id,
    contactName: s.contact_name,
    contactAvatarUrl: s.contact_avatar_url,
    isAnonymous: s.is_anonymous === 1,
    status: s.status,
    handoffStatus: s.handoff_status,
    assigneeAdminUserId: s.assignee_admin_user_id,
    lastMessageId: s.last_message_id,
    lastMessageAt: s.last_message_at,
    unreadCount: s.unread_count,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    resolvedAt: s.resolved_at
  };
}
class Br {
  constructor(e) {
    this.db = e;
  }
  async listOpen(e = 50) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE status = 'open'
        ORDER BY last_message_at DESC
        LIMIT ?
        `
    ).bind(e).all()).results.map(Ee);
  }
  async listResolved(e = 50) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE status = 'resolved'
        ORDER BY resolved_at DESC
        LIMIT ?
        `
    ).bind(e).all()).results.map(Ee);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM conversations WHERE id = ? LIMIT 1").bind(e).first();
    return t ? Ee(t) : null;
  }
  async findByExternalThread(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
          AND external_thread_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? Ee(n) : null;
  }
  async findLatestByExternalContact(e, t) {
    const n = await this.db.prepare(
      "SELECT * FROM conversations WHERE channel_account_id = ? AND external_contact_id = ? ORDER BY last_message_at DESC LIMIT 1"
    ).bind(e, t).first();
    return n ? Ee(n) : null;
  }
  async create(e) {
    const t = W("conv"), n = S();
    await this.db.prepare(
      `
        INSERT INTO conversations (
          id,
          channel_account_id,
          external_contact_id,
          external_thread_id,
          contact_name,
          contact_avatar_url,
          is_anonymous,
          status,
          handoff_status,
          unread_count,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'open', 'bot', 0, ?, ?)
        `
    ).bind(
      t,
      e.channelAccountId,
      e.externalContactId,
      e.externalThreadId,
      e.contactName ?? null,
      e.contactAvatarUrl ?? null,
      e.isAnonymous ? 1 : 0,
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created conversation not found");
    return a;
  }
  async findOrCreateByExternalThread(e) {
    return await this.findByExternalThread(e.channelAccountId, e.externalThreadId) ?? this.create(e);
  }
  async touchAfterInbound(e, t, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            unread_count = unread_count + 1,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, n, n, e).run();
  }
  async touchAfterOutbound(e, t, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, n, n, e).run();
  }
  async markRead(e) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET unread_count = 0,
            updated_at = ?
        WHERE id = ?
          AND unread_count > 0
        `
    ).bind(S(), e).run();
  }
  async setHandoffStatus(e, t) {
    await this.db.prepare("UPDATE conversations SET handoff_status = ?, updated_at = ? WHERE id = ?").bind(t, S(), e).run();
  }
  async resolve(e) {
    const t = S();
    await this.db.prepare("UPDATE conversations SET status = 'resolved', resolved_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async reopen(e) {
    await this.db.prepare("UPDATE conversations SET status = 'open', resolved_at = NULL, updated_at = ? WHERE id = ?").bind(S(), e).run();
  }
  async listByChannel(e, t = 50, n = 0) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
        ORDER BY last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, t, n).all()).results.map(Ee);
  }
  async listByExternalContact(e, t) {
    let n = "SELECT c.* FROM conversations c";
    const a = [];
    return t && (n += " INNER JOIN channel_accounts ca ON ca.id = c.channel_account_id AND ca.channel_type = ?", a.push(t)), n += " WHERE c.external_contact_id = ? ORDER BY c.last_message_at DESC", a.push(e), (await this.db.prepare(n).bind(...a).all()).results.map(Ee);
  }
  async countByChannel(e) {
    const t = await this.db.prepare("SELECT COUNT(*) as cnt FROM conversations WHERE channel_account_id = ?").bind(e).first();
    return (t == null ? void 0 : t.cnt) ?? 0;
  }
  async listByChannelWithFirstMessage(e, t = 50, n = 0) {
    return (await this.db.prepare(
      `
        SELECT c.*, m.raw_payload_json AS first_message_raw_payload
        FROM conversations c
        LEFT JOIN messages m ON m.id = (
          SELECT id FROM messages
          WHERE conversation_id = c.id
          ORDER BY created_at ASC
          LIMIT 1
        )
        WHERE c.channel_account_id = ?
        ORDER BY c.last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, t, n).all()).results.map((r) => ({
      ...Ee(r),
      firstMessageRawPayload: r.first_message_raw_payload
    }));
  }
}
class jr {
  constructor(e, t, n) {
    this.conversations = e, this.messages = t, this.ai = n;
  }
  listOpenConversations() {
    return this.conversations.listOpen();
  }
  listResolvedConversations() {
    return this.conversations.listResolved();
  }
  async getConversation(e) {
    const t = await this.conversations.findById(e);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return t;
  }
  async receiveInboundMessage(e, t = {}) {
    if (e.inbound.externalMessageId) {
      const o = await this.messages.findByExternalMessageId(
        e.channelAccount.id,
        e.inbound.externalMessageId
      );
      if (o)
        return {
          conversationId: o.conversationId,
          inboundMessage: o,
          aiMessage: null,
          duplicate: !0
        };
    }
    const n = await this.conversations.findOrCreateByExternalThread({
      channelAccountId: e.channelAccount.id,
      externalContactId: e.inbound.externalContactId,
      externalThreadId: e.inbound.externalThreadId,
      contactName: e.inbound.contactName,
      contactAvatarUrl: e.inbound.contactAvatarUrl,
      isAnonymous: e.inbound.isAnonymous
    });
    n.status === "resolved" && await this.conversations.reopen(n.id);
    const a = await this.messages.createInbound({
      id: e.messageId,
      conversationId: n.id,
      channelAccountId: e.channelAccount.id,
      inbound: e.inbound
    }), r = a.message;
    if (!a.created)
      return {
        conversationId: r.conversationId,
        inboundMessage: r,
        aiMessage: null,
        duplicate: !0
      };
    if (await this.conversations.touchAfterInbound(n.id, r.id, r.createdAt), t.createAiReply === !1)
      return {
        conversationId: n.id,
        inboundMessage: r,
        aiMessage: null,
        duplicate: !1
      };
    const i = await this.createAiReply({
      conversationId: n.id,
      channelAccountId: e.channelAccount.id,
      messageContent: r.content,
      handoffStatus: n.handoffStatus
    });
    return {
      conversationId: n.id,
      inboundMessage: r,
      aiMessage: i,
      duplicate: !1
    };
  }
  async createAiReply(e) {
    const t = await this.ai.maybeCreateReply(e);
    return t && await this.conversations.touchAfterOutbound(e.conversationId, t.id, t.createdAt), t;
  }
  async setHandoff(e, t) {
    return await this.getConversation(e), await this.conversations.setHandoffStatus(e, t), this.getConversation(e);
  }
  async resolve(e) {
    return await this.getConversation(e), await this.conversations.resolve(e), this.getConversation(e);
  }
}
function Tt(s) {
  return {
    id: s.id,
    conversationId: s.conversation_id,
    channelAccountId: s.channel_account_id,
    externalMessageId: s.external_message_id,
    direction: s.direction,
    senderType: s.sender_type,
    senderAdminUserId: s.sender_admin_user_id,
    clientMessageId: s.client_message_id,
    messageType: s.message_type,
    content: s.content,
    attachmentsJson: s.attachments_json,
    rawPayloadJson: s.raw_payload_json,
    aiMetadataJson: s.ai_metadata_json,
    aiReferencesJson: s.ai_references_json,
    status: s.status,
    errorMessage: s.error_message,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
function Os(s) {
  if (!s) return [];
  try {
    const e = JSON.parse(s);
    return Array.isArray(e) ? e.filter($r) : [];
  } catch {
    return [];
  }
}
function $r(s) {
  if (!s || typeof s != "object") return !1;
  const e = s;
  return e.type !== "image" && e.type !== "file" && e.type !== "audio" && e.type !== "video" ? !1 : Xe(e.url) && Xe(e.fileId) && Xe(e.r2Key) && Xe(e.mimeType) && Xe(e.fileName) && qt(e.size) && qt(e.width) && qt(e.height) && qt(e.durationMs) && Xe(e.thumbnailR2Key);
}
function Xe(s) {
  return s === void 0 || typeof s == "string";
}
function qt(s) {
  return s === void 0 || typeof s == "number";
}
function fs(s, e, t, n) {
  const a = fe(s.rawPayloadJson);
  return {
    id: s.id,
    conversationId: s.conversationId,
    direction: s.direction,
    senderType: s.senderType,
    messageType: s.messageType,
    content: s.content,
    attachments: Os(s.attachmentsJson),
    status: s.status,
    createdAt: s.createdAt,
    contactName: e,
    externalContactId: t,
    avatarUrl: n ?? null,
    likeCount: a.likeCount,
    likedBy: a.likedBy,
    quotedMessageId: a.quotedMessageId
  };
}
function fe(s) {
  if (!s)
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null, visibility: "public", forumDeleted: !1, forumDeletedBy: null, forumDeletedAt: null, forumEditedAt: null, forumTopicTitle: null };
  try {
    const e = JSON.parse(s);
    return {
      likeCount: typeof e.forumLikes == "number" ? e.forumLikes : 0,
      likedBy: Array.isArray(e.forumLikedBy) ? e.forumLikedBy : [],
      tags: Array.isArray(e.forumTags) ? e.forumTags : [],
      category: typeof e.forumCategory == "string" ? e.forumCategory : "综合讨论",
      isPinned: e.forumPinned === !0,
      isFeatured: e.forumFeatured === !0,
      quotedMessageId: typeof e.quotedMessageId == "string" ? e.quotedMessageId : null,
      visibility: e.forumVisibility === "login_required" ? "login_required" : "public",
      forumDeleted: e.forumDeleted === !0,
      forumDeletedBy: typeof e.forumDeletedBy == "string" ? e.forumDeletedBy : null,
      forumDeletedAt: typeof e.forumDeletedAt == "string" ? e.forumDeletedAt : null,
      forumEditedAt: typeof e.forumEditedAt == "string" ? e.forumEditedAt : null,
      forumTopicTitle: typeof e.forumTopicTitle == "string" ? e.forumTopicTitle : null
    };
  } catch {
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null, visibility: "public", forumDeleted: !1, forumDeletedBy: null, forumDeletedAt: null, forumEditedAt: null, forumTopicTitle: null };
  }
}
function xt(s) {
  var e;
  if (!s) return null;
  try {
    const t = JSON.parse(s);
    return typeof ((e = t == null ? void 0 : t.settings) == null ? void 0 : e.avatar_url) == "string" ? t.settings.avatar_url : null;
  } catch {
    return null;
  }
}
const an = 30 * 24 * 60 * 60;
class Fr {
  constructor(e, t, n, a, r, i, o, c, d, l) {
    this.channels = e, this.conversations = t, this.messages = n, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.endUserAuth = c, this.auth = d, this.tokenSecret = l;
  }
  async listTopics(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = e.limit ?? 50, a = e.offset ?? 0, [r, i] = await Promise.all([
      this.conversations.listByChannelWithFirstMessage(t.id, n, a),
      this.conversations.countByChannel(t.id)
    ]), o = [...new Set(r.map((u) => u.externalContactId).filter(Boolean))], c = await this.endUsers.findByIds(o), d = /* @__PURE__ */ new Map();
    for (const u of c)
      d.set(u.id, xt(u.rawPayloadJson));
    let l = r.map((u) => {
      const p = Vt(u.firstMessageRawPayload), w = fe(u.firstMessageRawPayload);
      return {
        id: u.id,
        conversationId: u.id,
        title: p,
        authorName: u.contactName ?? "匿名用户",
        authorId: u.externalContactId ?? "",
        avatarUrl: d.get(u.externalContactId ?? "") ?? null,
        category: w.category ?? "综合讨论",
        messageCount: u.unreadCount,
        lastReplyAt: u.lastMessageAt ?? u.createdAt,
        createdAt: u.createdAt,
        tags: w.tags,
        isPinned: w.isPinned,
        isFeatured: w.isFeatured,
        likeCount: w.likeCount,
        likedBy: w.likedBy,
        visibility: w.visibility,
        isDeleted: w.forumDeleted,
        editedAt: w.forumEditedAt
      };
    });
    if (e.search) {
      const u = e.search.toLowerCase();
      l = l.filter(
        (p) => p.title.toLowerCase().includes(u) || p.authorName.toLowerCase().includes(u) || p.tags.some((w) => w.toLowerCase().includes(u))
      );
    }
    return e.tag && (l = l.filter((u) => u.tags.includes(e.tag))), e.category && (l = l.filter((u) => u.category === e.category)), e.sortBy === "replies" ? l.sort((u, p) => p.messageCount - u.messageCount) : e.sortBy === "hot" ? l.sort((u, p) => p.likeCount - u.likeCount || p.messageCount - u.messageCount) : l.sort((u, p) => u.isPinned !== p.isPinned ? u.isPinned ? -1 : 1 : new Date(p.lastReplyAt).getTime() - new Date(u.lastReplyAt).getTime()), { topics: l, total: i };
  }
  async createTopic(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = ms(e.visitorId), a = `forum:${n}:${W("forum_topic")}`, { contactName: r, externalContactId: i, isAnonymous: o } = await this.resolveEndUserIdentity(
      n,
      e.endUserToken
    );
    let c = null;
    if (!o && i)
      try {
        const u = await this.endUsers.findById(i);
        u && (c = xt(u.rawPayloadJson));
      } catch {
      }
    const d = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: t,
        inbound: {
          externalMessageId: a,
          externalContactId: i,
          externalThreadId: i,
          contactName: r,
          isAnonymous: o,
          messageType: "text",
          content: `**${e.title}**

${e.content.trim()}`,
          attachments: [],
          rawPayload: {
            source: "forum",
            forumTopicTitle: e.title,
            forumCategory: e.category ?? "综合讨论",
            forumTags: e.tags ?? [],
            forumLikes: 0,
            forumLikedBy: [],
            forumPinned: !1,
            forumFeatured: !1,
            forumVisibility: e.visibility ?? "public",
            pageUrl: e.pageUrl,
            pageTitle: e.pageTitle
          },
          receivedAt: S()
        }
      },
      { createAiReply: !1 }
    ), l = await this.signForumToken({
      version: 1,
      channelAccountId: t.id,
      visitorId: i,
      conversationId: d.conversationId,
      contactName: r,
      isAnonymous: o,
      exp: Math.floor(Date.now() / 1e3) + an
    });
    return {
      conversationId: d.conversationId,
      channelAccountId: t.id,
      visitorId: i,
      visitorToken: l,
      expiresAt: new Date(Date.now() + an * 1e3).toISOString(),
      message: fs(d.inboundMessage, r, i, c)
    };
  }
  async sendReply(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = ms(e.visitorId), r = `forum:${a}:${W("forum_reply")}`, { contactName: i, externalContactId: o, isAnonymous: c } = await this.resolveEndUserIdentity(
      a,
      e.endUserToken
    );
    let d = null;
    if (!c && o)
      try {
        const p = await this.endUsers.findById(o);
        p && (d = xt(p.rawPayloadJson));
      } catch {
      }
    let l = e.content.trim();
    if (e.quotedMessageId) {
      const p = await this.messages.findById(e.quotedMessageId);
      if (p && p.conversationId === e.conversationId) {
        const w = t.contactName && t.contactName !== "匿名用户" ? t.contactName : `用户${(t.externalContactId ?? "").slice(-5)}`, j = (p.content ?? "").substring(0, 500).split(`
`);
        let U = j.length;
        for (let H = 0; H < j.length; H++)
          if (/^> @.+ 说：$/.test(j[H].trim())) {
            U = H;
            break;
          }
        const B = j.slice(0, U), P = j.slice(U), F = [];
        if (!fe(p.rawPayloadJson).quotedMessageId && B.length > 0) {
          const H = B[0].trim();
          H.startsWith("**") && H.endsWith("**") && (B.shift(), B.length > 0 && B[0].trim() === "" && B.shift());
        }
        F.push(l), F.push("");
        for (const H of B) F.push(H.trim() === "" ? ">" : `> ${H}`);
        F.push(`> @${w} 说：`);
        for (const H of P) F.push(`> ${H}`);
        l = F.join(`
`);
      }
    }
    const u = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
        inbound: {
          externalMessageId: r,
          externalContactId: o,
          externalThreadId: t.externalThreadId ?? o,
          contactName: i,
          isAnonymous: c,
          messageType: "text",
          content: l,
          attachments: [],
          rawPayload: {
            source: "forum",
            forumLikes: 0,
            forumLikedBy: [],
            pageUrl: e.pageUrl,
            pageTitle: e.pageTitle,
            quotedMessageId: e.quotedMessageId || null
          },
          receivedAt: S()
        }
      },
      { createAiReply: !1 }
    );
    return u.duplicate || await this.realtime.notifyMessageCreated({
      conversation: t,
      message: u.inboundMessage
    }), {
      conversationId: u.conversationId,
      message: fs(u.inboundMessage, i, o, d),
      duplicate: u.duplicate
    };
  }
  async listMessages(e) {
    const t = await this.conversations.findById(e.conversationId), n = (t == null ? void 0 : t.contactName) ?? "论坛用户", a = (t == null ? void 0 : t.externalContactId) ?? "anonymous";
    let r = null;
    if (a && a !== "anonymous")
      try {
        const u = await this.endUsers.findById(a);
        u && (r = xt(u.rawPayloadJson));
      } catch {
      }
    const i = await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ), o = i.length > 0 ? Vt(i[0].rawPayloadJson) : void 0, c = i.length > 0 ? fe(i[0].rawPayloadJson).visibility : void 0, d = i.length > 0 ? fe(i[0].rawPayloadJson).forumDeleted : !1, l = (t == null ? void 0 : t.externalContactId) ?? "";
    return {
      messages: i.map((u) => {
        let p = u.content;
        return p && (p = p.replace(/^\*\*.+?\*\*\n\n/, "")), fs({ ...u, content: p }, n, a, r);
      }),
      topicTitle: o,
      topicVisibility: c,
      isDeleted: d,
      topicAuthorId: l
    };
  }
  async likeTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = ms(e.visitorId), r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    const i = fe(r.rawPayloadJson), o = i.likedBy.includes(a);
    let c, d;
    return o ? (c = Math.max(0, i.likeCount - 1), d = i.likedBy.filter((l) => l !== a)) : (c = i.likeCount + 1, d = [...i.likedBy, a]), await this.updateMessageRawPayload(r.id, r.rawPayloadJson, {
      forumLikes: c,
      forumLikedBy: d
    }), { likeCount: c, liked: !o, likedBy: d };
  }
  async togglePin(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumPinned: e.pin
    }), { isPinned: e.pin };
  }
  async toggleFeatured(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumFeatured: e.feature
    }), { isFeatured: e.feature };
  }
  async deleteTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    if (fe(a.rawPayloadJson), e.userRole !== "admin") {
      if (e.userRole !== "mediator") throw new f("FORBIDDEN", "You do not have permission to delete this topic", 403);
    }
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumDeleted: !0,
      forumDeletedBy: e.userId,
      forumDeletedAt: S()
    }), { success: !0 };
  }
  async updateTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    const r = fe(a.rawPayloadJson);
    if (r.forumDeleted)
      throw new f("TOPIC_DELETED", "Cannot edit a deleted topic", 400);
    if (e.userRole !== "admin") {
      if (e.userRole === "mediator")
        throw new f("FORBIDDEN", "Mediators cannot edit topics", 403);
      if (t.externalContactId !== e.userId)
        throw new f("FORBIDDEN", "You can only edit your own topics", 403);
    }
    const i = {};
    if (e.title !== void 0 && (i.forumTopicTitle = e.title), e.content !== void 0) {
      const o = e.title ? `**${e.title}**

${e.content.trim()}` : `**${r.forumTopicTitle || "无标题"}**

${e.content.trim()}`;
      await this.messages.updateContent(a.id, o), i.forumEditedAt = S();
    } else if (e.title !== void 0) {
      const o = a.content || "", c = o.indexOf(`

`), d = c >= 0 ? o.slice(c + 2) : o, l = `**${e.title}**

${d}`;
      await this.messages.updateContent(a.id, l), i.forumEditedAt = S();
    }
    return Object.keys(i).length > 0 && await this.updateMessageRawPayload(a.id, a.rawPayloadJson, i), { success: !0 };
  }
  async getUserProfile(e) {
    var d;
    const t = await this.conversations.listByExternalContact(e, "forum");
    if (t.length === 0) return null;
    const n = t[0].isAnonymous, a = t[0].contactName ?? "匿名用户";
    let r = 0, i = 0, o = null;
    if (!n)
      try {
        const l = await this.endUsers.findById(e);
        if (l != null && l.rawPayloadJson) {
          const u = JSON.parse(l.rawPayloadJson);
          typeof ((d = u == null ? void 0 : u.settings) == null ? void 0 : d.avatar_url) == "string" && (o = u.settings.avatar_url);
        }
      } catch {
      }
    const c = [];
    for (const l of t) {
      const u = await this.getFirstMessage(l.id), p = fe((u == null ? void 0 : u.rawPayloadJson) ?? null);
      r += p.likeCount, i += Math.max(0, l.unreadCount - 1), u && c.push({
        id: l.id,
        conversationId: l.id,
        title: Vt(u.rawPayloadJson),
        authorName: l.contactName ?? "匿名用户",
        authorId: l.externalContactId ?? "",
        category: p.category,
        messageCount: l.unreadCount,
        lastReplyAt: l.lastMessageAt ?? l.createdAt,
        createdAt: l.createdAt,
        tags: p.tags,
        isPinned: p.isPinned,
        isFeatured: p.isFeatured,
        likeCount: p.likeCount,
        likedBy: p.likedBy,
        visibility: p.visibility,
        isDeleted: p.forumDeleted,
        editedAt: p.forumEditedAt
      });
    }
    return {
      externalContactId: e,
      displayName: a,
      isAnonymous: n,
      topicCount: t.length,
      replyCount: i,
      totalLikesReceived: r,
      joinedAt: t[t.length - 1].createdAt,
      avatarUrl: o,
      recentTopics: c.sort(
        (l, u) => new Date(u.lastReplyAt).getTime() - new Date(l.lastReplyAt).getTime()
      )
    };
  }
  async getUserNotifications(e) {
    const t = await this.conversations.listByExternalContact(e, "forum"), n = [];
    for (const a of t) {
      const r = await this.getFirstMessage(a.id), i = Vt((r == null ? void 0 : r.rawPayloadJson) ?? null), o = Math.max(0, a.unreadCount - 1);
      n.push({
        topicId: a.id,
        topicTitle: i,
        replyCount: o,
        lastReplyAt: a.lastMessageAt ?? a.createdAt,
        lastReplyAuthor: a.contactName ?? "匿名用户",
        hasNewReplies: o > 0
      });
    }
    return n;
  }
  // ===== PM (Private Message) 方法 =====
  async createPMConversation(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = await this.endUsers.findById(e.currentUserId), a = await this.endUsers.findById(e.targetUserId);
    if (!n || !a)
      throw new f("USER_NOT_FOUND", "User not found", 404);
    const r = [e.currentUserId, e.targetUserId].sort(), i = `pm:${r[0]}::${r[1]}`, o = await this.conversations.findByExternalThread(t.id, i);
    return o ? { conversationId: o.id, isNew: !1 } : { conversationId: (await this.conversations.create({
      channelAccountId: t.id,
      externalContactId: e.currentUserId,
      externalThreadId: i,
      contactName: a.displayName || a.username,
      isAnonymous: !1
    })).id, isNew: !0 };
  }
  async listPMConversations(e) {
    const n = (await this.conversations.listByChannel(e.channelAccountId)).filter((r) => {
      var i;
      return (i = r.externalThreadId) == null ? void 0 : i.startsWith("pm:");
    }), a = [];
    for (const r of n) {
      const i = (r.externalThreadId ?? "").replace("pm:", "").split("::");
      if (!i.includes(e.currentUserId)) continue;
      const o = i.find((l) => l !== e.currentUserId) || "", c = await this.endUsers.findById(o);
      let d = null;
      if (r.lastMessageId) {
        const l = await this.messages.findById(r.lastMessageId);
        l && (d = l.content ? l.content.substring(0, 100) : "[媒体消息]");
      }
      a.push({
        id: r.id,
        contactName: (c == null ? void 0 : c.displayName) || (c == null ? void 0 : c.username) || "未知用户",
        contactId: o,
        lastMessage: d,
        lastMessageAt: r.lastMessageAt,
        isOnline: !1,
        unreadCount: r.unreadCount,
        avatarUrl: xt((c == null ? void 0 : c.rawPayloadJson) ?? null)
      });
    }
    return a.sort((r, i) => r.lastMessageAt ? i.lastMessageAt ? new Date(i.lastMessageAt).getTime() - new Date(r.lastMessageAt).getTime() : -1 : 1), a;
  }
  async sendPMMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.endUsers.findById(e.senderUserId);
    if (!a)
      throw new f("USER_NOT_FOUND", "Sender not found", 404);
    const r = `pm:${a.id}:${W("pm_msg")}`, i = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
        inbound: {
          externalMessageId: r,
          externalContactId: a.id,
          externalThreadId: t.externalThreadId,
          contactName: a.displayName || a.username,
          isAnonymous: !1,
          messageType: "text",
          content: e.content.trim(),
          attachments: [],
          rawPayload: {
            source: "pm"
          },
          receivedAt: S()
        }
      },
      { createAiReply: !1 }
    );
    if (!i.duplicate) {
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: i.inboundMessage
      });
      const c = (t.externalThreadId ?? "").replace("pm:", "").split("::").find((d) => d !== e.senderUserId);
      c && await this.realtime.notifyEndUserMessage(c, {
        type: "pm_message.new",
        conversationId: t.id,
        message: {
          id: i.inboundMessage.id,
          content: i.inboundMessage.content,
          createdAt: i.inboundMessage.createdAt,
          senderId: e.senderUserId
        }
      });
    }
    return { message: i.inboundMessage };
  }
  async sendPMMediaMessage(e) {
    var l;
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.endUsers.findById(e.senderUserId);
    if (!a)
      throw new f("USER_NOT_FOUND", "Sender not found", 404);
    const r = e.clientMessageId ? `pm:${a.id}:${e.clientMessageId}` : `pm:${a.id}:${W("pm_msg")}`, i = await this.messages.findByExternalMessageId(n.id, r);
    if (i)
      return { message: i };
    const o = W("msg"), c = await this.media.storeUpload({
      conversationId: t.id,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
        inbound: {
          externalMessageId: r,
          externalContactId: a.id,
          externalThreadId: t.externalThreadId,
          contactName: a.displayName || a.username,
          isAnonymous: !1,
          messageType: c.messageType,
          content: ((l = e.content) == null ? void 0 : l.trim()) || "",
          attachments: [c.attachment],
          rawPayload: {
            source: "pm"
          },
          receivedAt: S()
        },
        messageId: o
      },
      { createAiReply: !1 }
    );
    if (!d.duplicate) {
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: d.inboundMessage
      });
      const p = (t.externalThreadId ?? "").replace("pm:", "").split("::").find((w) => w !== e.senderUserId);
      p && await this.realtime.notifyEndUserMessage(p, {
        type: "pm_message.new",
        conversationId: t.id,
        message: {
          id: d.inboundMessage.id,
          content: d.inboundMessage.content,
          createdAt: d.inboundMessage.createdAt,
          senderId: e.senderUserId
        }
      });
    }
    return { message: d.inboundMessage };
  }
  async listPMMessages(e) {
    if (!await this.conversations.findById(e.conversationId))
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return { messages: await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ) };
  }
  async requireConversationAccess(e, t) {
    const n = await this.conversations.findById(e);
    if (!n)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const a = await this.channels.getAccount(n.channelAccountId);
    return this.assertForumChannel(a), {
      conversationId: n.id,
      visitorId: n.externalContactId ?? "anonymous"
    };
  }
  async resolveEndUserIdentity(e, t) {
    if (t) {
      const n = await this.endUserAuth.tryGetEndUser(`Bearer ${t}`);
      if (n)
        return {
          contactName: n.displayName || n.username,
          externalContactId: n.id,
          isAnonymous: !1
        };
      const a = await this.auth.tryGetAdminUser(`Bearer ${t}`);
      if (a)
        return {
          contactName: a.name || "Default Admin",
          externalContactId: "admin_1",
          isAnonymous: !1
        };
    }
    return {
      contactName: "论坛用户",
      externalContactId: e,
      isAnonymous: !0
    };
  }
  assertForumChannel(e) {
    if (e.channelType !== "forum")
      throw new f("CHANNEL_NOT_FORUM", "Channel is not a forum channel", 400);
  }
  async getFirstMessage(e) {
    return this.messages.listByConversation(e, 1).then((t) => t[0] ?? null);
  }
  async updateMessageRawPayload(e, t, n) {
    let a = {};
    if (t)
      try {
        a = JSON.parse(t);
      } catch {
      }
    const r = { ...a, ...n };
    await this.messages.updateRawPayload(e, JSON.stringify(r));
  }
  async signForumToken(e) {
    const t = ae(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = ae(JSON.stringify(e)), a = await ze(`${t}.${n}`, this.tokenSecret);
    return `${t}.${n}.${a}`;
  }
}
function ms(s) {
  const e = s.trim();
  return e ? e.length > 128 ? e.slice(0, 128) : e : "anonymous";
}
function Vt(s) {
  if (!s) return "无标题";
  try {
    const e = JSON.parse(s);
    if (e.forumTopicTitle && typeof e.forumTopicTitle == "string")
      return e.forumTopicTitle.trim();
  } catch {
  }
  return "无标题";
}
function ps(s) {
  return {
    id: s.id,
    title: s.title,
    sourceType: s.source_type,
    aiSearchInstanceId: s.ai_search_instance_id,
    aiSearchItemId: s.ai_search_item_id,
    aiSearchPath: s.ai_search_path,
    status: s.status,
    fileName: s.file_name,
    fileSize: s.file_size,
    mimeType: s.mime_type,
    checksum: s.checksum,
    metadataJson: s.metadata_json,
    errorMessage: s.error_message,
    createdByAdminUserId: s.created_by_admin_user_id,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    indexedAt: s.indexed_at,
    deletedAt: s.deleted_at
  };
}
class qr {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE deleted_at IS NULL
        ORDER BY updated_at DESC
        `
    ).all()).results.map(ps);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM kb_documents WHERE id = ? AND deleted_at IS NULL LIMIT 1").bind(e).first();
    return t ? ps(t) : null;
  }
  async findByAiSearchItem(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE ai_search_instance_id = ?
          AND ai_search_item_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? ps(n) : null;
  }
  async create(e) {
    const t = W("kb"), n = S();
    await this.db.prepare(
      `
        INSERT INTO kb_documents (
          id,
          title,
          source_type,
          ai_search_instance_id,
          ai_search_item_id,
          ai_search_path,
          status,
          file_name,
          file_size,
          mime_type,
          checksum,
          metadata_json,
          created_by_admin_user_id,
          created_at,
          updated_at,
          indexed_at
        )
        VALUES (?, ?, 'upload', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      t,
      e.title,
      e.aiSearchInstanceId,
      e.aiSearchItemId ?? null,
      e.aiSearchPath,
      e.status ?? "processing",
      e.fileName ?? null,
      e.fileSize ?? 0,
      e.mimeType ?? null,
      e.checksum ?? null,
      e.metadataJson ?? "{}",
      e.createdByAdminUserId ?? null,
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created knowledge document not found");
    return a;
  }
  async markDeleted(e) {
    const t = S();
    await this.db.prepare("UPDATE kb_documents SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async upsertFromAiSearchItem(e) {
    const t = await this.findByAiSearchItem(e.aiSearchInstanceId, e.aiSearchItemId), n = S();
    if (t) {
      await this.db.prepare(
        `
          UPDATE kb_documents
          SET title = ?,
              source_type = 'upload',
              ai_search_path = ?,
              status = ?,
              file_name = ?,
              file_size = ?,
              mime_type = ?,
              metadata_json = ?,
              error_message = ?,
              updated_at = ?,
              indexed_at = ?,
              deleted_at = NULL
          WHERE id = ?
          `
      ).bind(
        e.title,
        e.aiSearchPath,
        e.status,
        e.fileName ?? null,
        e.fileSize ?? 0,
        e.mimeType ?? null,
        e.metadataJson ?? "{}",
        e.errorMessage ?? null,
        n,
        e.indexedAt ?? (e.status === "indexed" ? t.indexedAt ?? n : t.indexedAt),
        t.id
      ).run();
      const i = await this.findById(t.id);
      if (!i) throw new Error("Updated knowledge document not found");
      return { document: i, action: "updated" };
    }
    const a = W("kb");
    await this.db.prepare(
      `
        INSERT INTO kb_documents (
          id,
          title,
          source_type,
          ai_search_instance_id,
          ai_search_item_id,
          ai_search_path,
          status,
          file_name,
          file_size,
          mime_type,
          metadata_json,
          error_message,
          created_at,
          updated_at,
          indexed_at
        )
        VALUES (?, ?, 'upload', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      a,
      e.title,
      e.aiSearchInstanceId,
      e.aiSearchItemId,
      e.aiSearchPath,
      e.status,
      e.fileName ?? null,
      e.fileSize ?? 0,
      e.mimeType ?? null,
      e.metadataJson ?? "{}",
      e.errorMessage ?? null,
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const r = await this.findById(a);
    if (!r) throw new Error("Created knowledge document not found");
    return { document: r, action: "created" };
  }
}
function Be(s) {
  return JSON.stringify(s ?? null);
}
class Vr {
  constructor(e, t) {
    this.knowledge = e, this.aiSearch = t;
  }
  listDocuments() {
    return this.knowledge.list();
  }
  async uploadDocument(e) {
    if (e.file.size > Nr)
      throw new f("KNOWLEDGE_FILE_TOO_LARGE", "Knowledge file is larger than 4MB", 400);
    const t = W("kb"), n = e.file.name.replace(/[^\w.\-]+/g, "_"), a = `${Sr}${t}/${n}`, r = await Hr(e.file), i = await this.uploadToAiSearch(a, r), o = await this.knowledge.create({
      title: e.title || e.file.name,
      aiSearchInstanceId: this.aiSearch.instanceName,
      aiSearchItemId: i.id,
      aiSearchPath: i.key || a,
      status: gs(i.status),
      fileName: e.file.name,
      fileSize: e.file.size,
      mimeType: e.file.type || void 0,
      metadataJson: Be({ filename: e.file.name, source: "upload" }),
      indexedAt: gs(i.status) === "indexed" ? i.last_seen_at ?? i.created_at : void 0,
      createdByAdminUserId: e.createdByAdminUserId
    });
    try {
      return await this.syncFromAiSearch(), await this.knowledge.findById(o.id) ?? o;
    } catch {
      return o;
    }
  }
  async uploadToAiSearch(e, t) {
    try {
      return await this.aiSearch.uploadDocument({ path: e, content: t });
    } catch (n) {
      throw new f(
        "KNOWLEDGE_UPLOAD_FAILED",
        `AI Search upload failed: ${n instanceof Error ? n.message : String(n)}`,
        502
      );
    }
  }
  async deleteDocument(e) {
    const t = await this.knowledge.findById(e);
    if (!t)
      throw new f("KNOWLEDGE_DOCUMENT_NOT_FOUND", "Knowledge document not found", 404);
    t.aiSearchItemId && await this.aiSearch.deleteDocument(t.aiSearchItemId), await this.knowledge.markDeleted(e);
  }
  async syncFromAiSearch() {
    const e = await this.aiSearch.listDocuments(), t = {
      instanceName: this.aiSearch.instanceName,
      scanned: e.length,
      created: 0,
      updated: 0,
      failed: 0
    };
    for (const n of e)
      try {
        const a = gs(n.status), r = n.metadata ?? {}, i = Wt(r.filename) ?? Wr(n.key), o = await this.knowledge.upsertFromAiSearchItem({
          title: Wt(r.title) ?? i ?? n.key,
          aiSearchInstanceId: this.aiSearch.instanceName,
          aiSearchItemId: n.id,
          aiSearchPath: n.key,
          status: a,
          fileName: i,
          fileSize: n.file_size ?? 0,
          mimeType: Wt(r.mime_type) ?? Wt(r.content_type),
          metadataJson: Be({
            ...r,
            ai_search_source_id: n.source_id,
            ai_search_status: n.status,
            chunks_count: n.chunks_count,
            created_at: n.created_at,
            last_seen_at: n.last_seen_at
          }),
          errorMessage: a === "failed" ? `AI Search item status: ${n.status ?? "unknown"}` : void 0,
          indexedAt: a === "indexed" ? n.last_seen_at ?? n.created_at : void 0
        });
        o.action === "created" && (t.created += 1), o.action === "updated" && (t.updated += 1);
      } catch {
        t.failed += 1;
      }
    return t;
  }
}
function gs(s) {
  switch (s) {
    case "completed":
      return "indexed";
    case "error":
    case "skipped":
      return "failed";
    case "queued":
    case "running":
    case "outdated":
    default:
      return "processing";
  }
}
function Wt(s) {
  return typeof s == "string" && s.trim() ? s : void 0;
}
function Wr(s) {
  return s.split("/").filter(Boolean).at(-1) ?? s;
}
async function Hr(s) {
  return Zr(s) ? s.text() : s.arrayBuffer();
}
function Zr(s) {
  const e = s.name.toLowerCase(), t = s.type.toLowerCase();
  return t.startsWith("text/") || t === "application/json" || t === "application/xml" || t === "application/x-yaml" || e.endsWith(".md") || e.endsWith(".mdx") || e.endsWith(".txt") || e.endsWith(".html") || e.endsWith(".htm") || e.endsWith(".json") || e.endsWith(".csv") || e.endsWith(".yaml") || e.endsWith(".yml");
}
const rn = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]), on = /* @__PURE__ */ new Set(["video/mp4", "video/webm", "video/quicktime"]);
class zr {
  constructor(e, t) {
    this.bucket = e, this.messages = t;
  }
  async storeUpload(e) {
    var l;
    const t = this.requireBucket(), n = ((l = e.fileName) == null ? void 0 : l.trim()) || e.file.name || "upload", a = Jr(e.mimeType || e.file.type, n), r = Gr(a), i = r === "image" ? kr : Or;
    if (e.file.size > i)
      throw new f(
        "MEDIA_FILE_TOO_LARGE",
        `${r === "image" ? "Image" : "Video"} file is too large`,
        400,
        { maxBytes: i }
      );
    const o = W("att"), c = Vn(n || o), d = `${Rr}${e.conversationId}/${e.messageId}/${o}/${c}`;
    return await t.put(d, e.file.stream(), {
      httpMetadata: {
        contentType: a,
        contentDisposition: cn(n || c)
      },
      customMetadata: {
        conversationId: e.conversationId,
        messageId: e.messageId,
        attachmentId: o,
        fileName: n || c
      }
    }), {
      messageType: r,
      attachment: {
        type: r,
        r2Key: d,
        fileName: n || c,
        mimeType: a,
        size: e.file.size
      }
    };
  }
  async getMessageAttachmentResponse(e) {
    const t = await this.messages.findById(e.messageId);
    if (!t || t.conversationId !== e.conversationId)
      throw new f("MESSAGE_NOT_FOUND", "Message not found", 404);
    const n = Os(t.attachmentsJson)[e.attachmentIndex];
    if (!n)
      throw new f("ATTACHMENT_NOT_FOUND", "Attachment not found", 404);
    if (!n.r2Key) {
      if (n.url) return Response.redirect(n.url, 302);
      throw new f("ATTACHMENT_NOT_FOUND", "Attachment is not stored in Supportly", 404);
    }
    const a = this.requireBucket(), r = e.request.headers.get("range"), i = await a.get(
      n.r2Key,
      r ? { range: e.request.headers } : void 0
    );
    if (!i)
      throw new f("ATTACHMENT_NOT_FOUND", "Attachment file not found", 404);
    const o = new Headers();
    if (i.writeHttpMetadata(o), o.set("etag", i.httpEtag), o.set("accept-ranges", "bytes"), o.set("cache-control", "private, max-age=300"), o.set("content-type", n.mimeType || o.get("content-type") || "application/octet-stream"), n.fileName && !o.has("content-disposition") && o.set("content-disposition", cn(n.fileName)), i.range) {
      const c = Yr(i.range, i.size);
      return o.set("content-range", `bytes ${c.start}-${c.end}/${i.size}`), o.set("content-length", String(c.length)), new Response(i.body, { status: 206, headers: o });
    }
    return o.set("content-length", String(i.size)), new Response(i.body, { headers: o });
  }
  requireBucket() {
    if (!this.bucket)
      throw new f("MEDIA_STORAGE_NOT_CONFIGURED", "Media storage is not configured", 500);
    return this.bucket;
  }
}
function Jr(s, e) {
  const t = s.trim().toLowerCase();
  if (t && t !== "application/octet-stream")
    return t;
  const n = Kr(e);
  if (!n)
    throw new f("MEDIA_MIME_TYPE_REQUIRED", "Media file type is required", 400);
  return n;
}
function Gr(s) {
  if (rn.has(s)) return "image";
  if (on.has(s)) return "video";
  throw new f("MEDIA_TYPE_NOT_SUPPORTED", "Only image and video files are supported", 400, {
    allowedMimeTypes: [...rn, ...on]
  });
}
function Vn(s) {
  return s.trim().replace(/[^\w.\-]+/g, "_").replace(/^_+|_+$/g, "") || "upload";
}
function Kr(s) {
  const e = s.toLowerCase();
  if (e.endsWith(".jpg") || e.endsWith(".jpeg")) return "image/jpeg";
  if (e.endsWith(".png")) return "image/png";
  if (e.endsWith(".gif")) return "image/gif";
  if (e.endsWith(".webp")) return "image/webp";
  if (e.endsWith(".mp4")) return "video/mp4";
  if (e.endsWith(".webm")) return "video/webm";
  if (e.endsWith(".mov") || e.endsWith(".qt")) return "video/quicktime";
}
function cn(s) {
  return `inline; filename="${Vn(s).replace(/["\\]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(s)}`;
}
function Yr(s, e) {
  const t = s;
  if (typeof t.offset == "number" && typeof t.length == "number") {
    const r = t.offset, i = Math.min(e - 1, t.offset + t.length - 1);
    return { start: r, end: i, length: i - r + 1 };
  }
  if (typeof t.offset == "number" && typeof t.end == "number") {
    const r = t.offset, i = Math.min(e - 1, t.end);
    return { start: r, end: i, length: i - r + 1 };
  }
  const n = Math.min(e, t.suffix ?? e);
  return { start: Math.max(0, e - n), end: e - 1, length: n };
}
class Xr {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM messages WHERE id = ? LIMIT 1").bind(e).first();
    return t ? Tt(t) : null;
  }
  async findByExternalMessageId(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE channel_account_id = ?
          AND external_message_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? Tt(n) : null;
  }
  async findByClientMessageId(e) {
    const t = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
          AND sender_type = ?
          AND (
            (? IS NULL AND sender_admin_user_id IS NULL)
            OR sender_admin_user_id = ?
          )
          AND client_message_id = ?
        LIMIT 1
        `
    ).bind(
      e.conversationId,
      e.senderType,
      e.senderAdminUserId ?? null,
      e.senderAdminUserId ?? null,
      e.clientMessageId
    ).first();
    return t ? Tt(t) : null;
  }
  async listByConversation(e, t = 100) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        LIMIT ?
        `
    ).bind(e, t).all()).results.map(Tt);
  }
  async listByConversationAfter(e, t, n = 100) {
    if (!t)
      return this.listByConversation(e, n);
    const a = await this.findById(t);
    return !a || a.conversationId !== e ? [] : (await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
          AND (
            created_at > ?
            OR (created_at = ? AND id > ?)
          )
        ORDER BY created_at ASC, id ASC
        LIMIT ?
        `
    ).bind(e, a.createdAt, a.createdAt, a.id, n).all()).results.map(Tt);
  }
  async createInbound(e) {
    const t = e.id ?? W("msg"), n = e.inbound.receivedAt || S();
    await this.db.prepare(
      `
        INSERT OR IGNORE INTO messages (
          id,
          conversation_id,
          channel_account_id,
          external_message_id,
          direction,
          sender_type,
          message_type,
          content,
          attachments_json,
          raw_payload_json,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, 'inbound', 'customer', ?, ?, ?, ?, 'received', ?, ?)
        `
    ).bind(
      t,
      e.conversationId,
      e.channelAccountId,
      e.inbound.externalMessageId ?? null,
      e.inbound.messageType,
      e.inbound.content ?? null,
      Be(e.inbound.attachments),
      Be(e.inbound.rawPayload),
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (a) return { message: a, created: !0 };
    if (e.inbound.externalMessageId) {
      const r = await this.findByExternalMessageId(e.channelAccountId, e.inbound.externalMessageId);
      if (r) return { message: r, created: !1 };
    }
    throw new Error("Created inbound message not found");
  }
  async createOutbound(e) {
    const t = e.id ?? W("msg"), n = S();
    await this.db.prepare(
      `
        INSERT INTO messages (
          id,
          conversation_id,
          channel_account_id,
          direction,
          sender_type,
          sender_admin_user_id,
          client_message_id,
          message_type,
          content,
          attachments_json,
          ai_metadata_json,
          ai_references_json,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, 'outbound', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      t,
      e.conversationId,
      e.channelAccountId,
      e.senderType,
      e.senderAdminUserId ?? null,
      e.clientMessageId ?? null,
      e.messageType ?? "text",
      e.content,
      Be(e.attachments ?? []),
      Be(e.aiMetadata ?? {}),
      Be(e.aiReferences ?? []),
      e.status,
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created outbound message not found");
    return a;
  }
  async updateRawPayload(e, t) {
    await this.db.prepare("UPDATE messages SET raw_payload_json = ? WHERE id = ?").bind(t, e).run();
  }
  async updateContent(e, t) {
    await this.db.prepare("UPDATE messages SET content = ?, updated_at = ? WHERE id = ?").bind(t, S(), e).run();
  }
  async markSent(e, t) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'sent',
            external_message_id = COALESCE(?, external_message_id),
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t ?? null, S(), e).run();
  }
  async markFailed(e, t) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'failed',
            error_message = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, S(), e).run();
  }
}
class Qr {
  constructor(e, t, n, a, r) {
    this.channels = e, this.conversations = t, this.messages = n, this.realtime = a, this.media = r;
  }
  async listConversationMessages(e, t) {
    if (!await this.conversations.findById(e))
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return await this.conversations.markRead(e), this.messages.listByConversationAfter(e, t);
  }
  async sendAgentMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const i = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (i) return i;
    }
    const n = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(n), r = await this.messages.createOutbound({
      conversationId: t.id,
      channelAccountId: n.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      content: e.content,
      attachments: [],
      status: "sending"
    });
    try {
      const i = await a.sendMessage(n, {
        conversationId: t.id,
        externalThreadId: t.externalThreadId,
        messageId: r.id,
        messageType: "text",
        content: e.content,
        attachments: []
      });
      await this.messages.markSent(r.id, i.externalMessageId), await this.conversations.touchAfterOutbound(t.id, r.id, r.createdAt);
      const o = await this.messages.findById(r.id), c = await this.conversations.findById(t.id);
      return o && c && await this.realtime.notifyMessageCreated({
        conversation: c,
        message: o
      }), o ?? { ...r, status: "sent", externalMessageId: i.externalMessageId ?? null };
    } catch (i) {
      throw await this.messages.markFailed(r.id, i instanceof Error ? i.message : "Message send failed"), i;
    }
  }
  async sendAgentMediaMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const d = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (d) return d;
    }
    const n = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(n), r = W("msg"), i = await this.media.storeUpload({
      conversationId: t.id,
      messageId: r,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), o = ei(e.content), c = await this.messages.createOutbound({
      id: r,
      conversationId: t.id,
      channelAccountId: n.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      messageType: i.messageType,
      content: o,
      attachments: [i.attachment],
      status: "sending"
    });
    try {
      const d = await a.sendMessage(n, {
        conversationId: t.id,
        externalThreadId: t.externalThreadId,
        messageId: c.id,
        messageType: i.messageType,
        content: o,
        attachments: [i.attachment]
      });
      await this.messages.markSent(c.id, d.externalMessageId), await this.conversations.touchAfterOutbound(t.id, c.id, c.createdAt);
      const l = await this.messages.findById(c.id), u = await this.conversations.findById(t.id);
      return l && u && await this.realtime.notifyMessageCreated({
        conversation: u,
        message: l
      }), l ?? { ...c, status: "sent", externalMessageId: d.externalMessageId ?? null };
    } catch (d) {
      throw await this.messages.markFailed(c.id, d instanceof Error ? d.message : "Message send failed"), d;
    }
  }
  markSent(e, t) {
    return this.messages.markSent(e, t);
  }
  markFailed(e, t) {
    return this.messages.markFailed(e, t);
  }
}
function ei(s) {
  const e = s == null ? void 0 : s.trim();
  return e || null;
}
function _e(s, e) {
  return {
    id: s.id,
    conversationId: s.conversationId,
    direction: s.direction,
    senderType: s.senderType,
    messageType: s.messageType,
    content: s.content,
    attachments: Os(s.attachmentsJson),
    status: s.status,
    createdAt: s.createdAt,
    externalMessageId: s.externalMessageId,
    avatarUrl: e ?? null
  };
}
const ti = "admin", dn = "end_user", ys = "https://supportly.internal/__notify";
class si {
  constructor(e) {
    this.env = e;
  }
  async notifyMessageCreated(e) {
    const t = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: _e(e.message)
    }, n = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: e.message
    }, a = {
      type: "conversation.updated",
      conversation: e.conversation
    }, r = await Promise.allSettled([
      this.notifyVisitor(e.conversation.id, t),
      this.notifyAdmin(n),
      this.notifyAdmin(a)
    ]);
    for (const i of r)
      i.status === "rejected" && We.warn("realtime_notify_failed", {
        conversationId: e.conversation.id,
        messageId: e.message.id,
        error: i.reason instanceof Error ? i.reason.message : String(i.reason)
      });
  }
  async notifyVisitor(e, t) {
    const n = this.env.VISITOR_STREAM.idFromName(e), a = this.env.VISITOR_STREAM.get(n);
    await this.notify(a, t);
  }
  async notifyAdmin(e) {
    const t = this.env.ADMIN_STREAM.idFromName(ti), n = this.env.ADMIN_STREAM.get(t);
    await this.notify(n, e);
  }
  async notifyEndUserPresence() {
    try {
      const e = this.env.END_USER_STREAM.idFromName(dn);
      await this.env.END_USER_STREAM.get(e).fetch(ys, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "refresh_presence" })
      });
    } catch {
    }
  }
  async notifyEndUserMessage(e, t) {
    try {
      const n = this.env.END_USER_STREAM.idFromName(dn);
      await this.env.END_USER_STREAM.get(n).fetch(ys, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "message.new", targetUserId: e, payload: t })
      });
    } catch {
    }
  }
  async notify(e, t) {
    const n = await e.fetch(ys, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(t)
    });
    if (!n.ok)
      throw new Error(`Realtime notify failed with status ${n.status}`);
  }
}
function ln(s) {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    passwordHash: s.password_hash,
    role: s.role,
    status: s.status,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class ni {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? ln(t) : null;
  }
  async findByEmail(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE lower(email) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? ln(t) : null;
  }
}
const ai = 60 * 60 * 24 * 7;
class ri {
  constructor(e, t) {
    this.adminUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const n = await this.adminUsers.findByEmail(e), a = n ? await xs(t, n.passwordHash) : !1;
    if (!n || !a)
      throw new f("INVALID_CREDENTIALS", "Invalid email or password", 401);
    const r = Math.floor(Date.now() / 1e3) + ai;
    return {
      token: await this.signToken({
        sub: n.id,
        email: n.email,
        name: n.name,
        role: n.role,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      adminUser: oi(n)
    };
  }
  async requireAdminUser(e) {
    const t = ii(e.authorization);
    if (t) {
      const a = await this.verifyToken(t), r = await this.adminUsers.findById(a.sub);
      if (!r)
        throw new f("UNAUTHORIZED", "Admin user not found", 401);
      return r;
    }
    if (!e.adminUserId)
      throw new f("UNAUTHORIZED", "Missing admin user", 401);
    const n = await this.adminUsers.findById(e.adminUserId);
    if (!n)
      throw new f("UNAUTHORIZED", "Admin user not found", 401);
    return n;
  }
  async tryGetAdminUser(e) {
    try {
      return await this.requireAdminUser({ authorization: e });
    } catch {
      return null;
    }
  }
  async signToken(e) {
    const t = ae(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = ae(JSON.stringify(e)), a = await ze(this.jwtSecret, `${t}.${n}`);
    return `${t}.${n}.${a}`;
  }
  async verifyToken(e) {
    const [t, n, a] = e.split(".");
    if (!t || !n || !a)
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await ze(this.jwtSecret, `${t}.${n}`);
    if (!_t(a, r))
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(ks(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new f("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function ii(s) {
  if (!s) return null;
  const [e, t] = s.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function oi(s) {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    role: s.role
  };
}
function St(s) {
  return {
    id: s.id,
    username: s.username,
    email: s.email,
    passwordHash: s.password_hash,
    displayName: s.display_name,
    status: s.status,
    rawPayloadJson: s.raw_payload_json,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class ci {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? St(t) : null;
  }
  async findByIds(e) {
    if (e.length === 0) return [];
    const t = e.map(() => "?").join(",");
    return (await this.db.prepare(`SELECT * FROM end_users WHERE id IN (${t}) AND status = 'active'`).bind(...e).all()).results.map(St);
  }
  async findByUsername(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? St(t) : null;
  }
  async findByUsernameAny(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) LIMIT 1").bind(e).first();
    return t ? St(t) : null;
  }
  async listAll() {
    return (await this.db.prepare("SELECT * FROM end_users ORDER BY created_at DESC LIMIT 200").all()).results.map(St);
  }
  async approve(e) {
    const t = S();
    return await this.db.prepare("UPDATE end_users SET status = 'active', updated_at = ? WHERE id = ? AND status = 'pending'").bind(t, e).run(), this.findById(e);
  }
  async deactivate(e) {
    const t = S();
    await this.db.prepare("UPDATE end_users SET status = 'pending', updated_at = ? WHERE id = ?").bind(t, e).run();
  }
  async anonymizeConversations(e) {
    const t = S();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 1, contact_name = '匿名访客', updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, e).run();
  }
  async restoreConversations(e, t) {
    const n = S();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 0, contact_name = ?, updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, n, e).run();
  }
  async getConversationCounts() {
    const e = await this.db.prepare("SELECT external_contact_id, COUNT(*) as count FROM conversations GROUP BY external_contact_id").all();
    return new Map(e.results.map((t) => [t.external_contact_id, t.count]));
  }
  async create(e) {
    var i;
    const t = W("eu"), n = await $n(e.password), a = S(), r = ((i = e.displayName) == null ? void 0 : i.trim()) || e.username;
    return await this.db.prepare(
      "INSERT INTO end_users (id, username, email, password_hash, display_name, status, raw_payload_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)"
    ).bind(t, e.username, e.email ?? null, n, r, null, a, a).run(), {
      id: t,
      username: e.username,
      email: e.email ?? null,
      displayName: r,
      passwordHash: n,
      status: "pending",
      rawPayloadJson: null,
      createdAt: a,
      updatedAt: a
    };
  }
  async updateRawPayload(e, t) {
    const n = S();
    await this.db.prepare("UPDATE end_users SET raw_payload_json = ?, updated_at = ? WHERE id = ?").bind(t, n, e).run();
  }
  async updatePassword(e, t) {
    const n = S();
    await this.db.prepare("UPDATE end_users SET password_hash = ?, updated_at = ? WHERE id = ?").bind(t, n, e).run();
  }
  async updateDisplayName(e, t) {
    const n = S();
    await this.db.prepare("UPDATE end_users SET display_name = ?, updated_at = ? WHERE id = ?").bind(t, n, e).run();
  }
}
const di = 60 * 60 * 24 * 7;
class li {
  constructor(e, t) {
    this.endUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const n = await this.endUsers.findByUsername(e), a = n ? await xs(t, n.passwordHash) : !1;
    if (!n || !a)
      throw new f("INVALID_CREDENTIALS", "Invalid username or password", 401);
    const r = Math.floor(Date.now() / 1e3) + di;
    return {
      token: await this.signToken({
        sub: n.id,
        username: n.username,
        displayName: n.displayName,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      user: Ht(n)
    };
  }
  async register(e) {
    if (await this.endUsers.findByUsernameAny(e.username))
      throw new f("USERNAME_TAKEN", "Username is already taken", 409);
    const n = await this.endUsers.create(e);
    return Ht(n);
  }
  async listUsers() {
    const [e, t] = await Promise.all([
      this.endUsers.listAll(),
      this.endUsers.getConversationCounts()
    ]);
    return e.map((n) => ({
      ...Ht(n),
      conversationCount: t.get(n.id) ?? 0
    }));
  }
  async approveUser(e) {
    const t = await this.endUsers.approve(e);
    if (!t)
      throw new f("END_USER_NOT_FOUND", "End user not found or already approved", 404);
    return await this.endUsers.restoreConversations(t.id, t.displayName), Ht(t);
  }
  async deactivateUser(e) {
    await this.endUsers.anonymizeConversations(e), await this.endUsers.deactivate(e);
  }
  async requireEndUser(e) {
    const t = ui(e);
    if (!t)
      throw new f("UNAUTHORIZED", "Missing auth token", 401);
    const n = await this.verifyToken(t), a = await this.endUsers.findById(n.sub);
    if (!a)
      throw new f("UNAUTHORIZED", "End user not found", 401);
    return a;
  }
  async tryGetEndUser(e) {
    try {
      return await this.requireEndUser(e);
    } catch {
      return null;
    }
  }
  async tryGetEndUserById(e) {
    try {
      return await this.endUsers.findById(e);
    } catch {
      return null;
    }
  }
  async getUserProfile(e) {
    const t = await this.endUsers.findById(e);
    if (!t)
      throw new f("END_USER_NOT_FOUND", "End user not found", 404);
    let n = {};
    if (t.rawPayloadJson)
      try {
        n = JSON.parse(t.rawPayloadJson);
      } catch {
      }
    return {
      id: t.id,
      username: t.username,
      displayName: t.displayName,
      email: t.email,
      settings: n.settings || {},
      isMediator: n.is_mediator === !0
    };
  }
  async updateSettings(e, t) {
    const n = await this.endUsers.findById(e);
    if (!n)
      throw new f("END_USER_NOT_FOUND", "End user not found", 404);
    let a = {};
    if (n.rawPayloadJson)
      try {
        a = JSON.parse(n.rawPayloadJson);
      } catch {
      }
    a.settings = { ...a.settings || {}, ...t }, await this.endUsers.updateRawPayload(e, JSON.stringify(a));
  }
  async changePassword(e, t, n) {
    const a = await this.endUsers.findById(e);
    if (!a)
      throw new f("END_USER_NOT_FOUND", "End user not found", 404);
    if (!await xs(t, a.passwordHash))
      throw new f("INVALID_PASSWORD", "Current password is incorrect", 400);
    const i = await $n(n);
    await this.endUsers.updatePassword(e, i);
  }
  async updateDisplayName(e, t) {
    await this.endUsers.updateDisplayName(e, t);
  }
  async signToken(e) {
    const t = ae(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = ae(JSON.stringify(e)), a = await ze(this.jwtSecret, `${t}.${n}`);
    return `${t}.${n}.${a}`;
  }
  async verifyToken(e) {
    const [t, n, a] = e.split(".");
    if (!t || !n || !a)
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await ze(this.jwtSecret, `${t}.${n}`);
    if (!_t(a, r))
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(ks(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new f("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function ui(s) {
  if (!s) return null;
  const [e, t] = s.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function Ht(s) {
  return {
    id: s.id,
    username: s.username,
    displayName: s.displayName,
    email: s.email,
    status: s.status,
    createdAt: s.createdAt
  };
}
const hi = 30 * 24 * 60 * 60;
class fi {
  constructor(e, t, n, a, r, i, o, c) {
    this.channels = e, this.conversations = t, this.messages = n, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.tokenSecret = c;
  }
  async createSession(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertWebChatChannel(t);
    const n = mi(e.visitorId), a = !!(e.endUserId && e.endUserName), r = a ? `${e.endUserId}` : n, i = Math.floor(Date.now() / 1e3) + hi, o = await this.signToken({
      version: 1,
      channelAccountId: t.id,
      visitorId: r,
      contactName: a ? e.endUserName : "匿名访客",
      isAnonymous: !a,
      exp: i
    }), c = await this.conversations.findLatestByExternalContact(t.id, r);
    return {
      conversationId: (c == null ? void 0 : c.id) ?? "",
      channelAccountId: t.id,
      visitorId: r,
      visitorToken: o,
      expiresAt: new Date(i * 1e3).toISOString()
    };
  }
  async sendVisitorMediaMessage(e) {
    const { conversationId: t, claims: n } = await this.ensureConversation(e.token, e.conversationId || void 0), a = await this.channels.getAccount(n.channelAccountId), r = e.clientMessageId ? `widget:${n.visitorId}:${e.clientMessageId}` : W("widget_evt"), i = await this.messages.findByExternalMessageId(a.id, r);
    if (i)
      return {
        conversationId: i.conversationId,
        inboundMessage: _e(i),
        aiMessage: null,
        duplicate: !0
      };
    const o = W("msg"), c = await this.media.storeUpload({
      conversationId: t,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage({
      channelAccount: a,
      inbound: {
        externalMessageId: r,
        externalContactId: n.visitorId,
        externalThreadId: n.visitorId,
        contactName: n.contactName,
        isAnonymous: n.isAnonymous,
        messageType: c.messageType,
        content: pi(e.content),
        attachments: [c.attachment],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: S()
      },
      messageId: o
    }, { createAiReply: !1 });
    return d.duplicate || await this.notifyVisitorMessageResult(d), {
      conversationId: d.conversationId,
      inboundMessage: _e(d.inboundMessage),
      aiMessage: null,
      duplicate: d.duplicate
    };
  }
  async sendVisitorMessage(e, t = {}) {
    const { conversationId: n, claims: a } = await this.ensureConversation(e.token, e.conversationId || void 0), r = await this.channels.getAccount(a.channelAccountId), i = await this.conversationService.receiveInboundMessage({
      channelAccount: r,
      inbound: {
        externalMessageId: e.clientMessageId ? `widget:${a.visitorId}:${e.clientMessageId}` : W("widget_evt"),
        externalContactId: a.visitorId,
        externalThreadId: a.visitorId,
        contactName: a.contactName,
        isAnonymous: a.isAnonymous,
        messageType: "text",
        content: e.content.trim(),
        attachments: [],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: S()
      }
    }, { createAiReply: t.createAiReply });
    return i.aiMessage && await this.messages.markSent(i.aiMessage.id, i.aiMessage.id), t.notifyRealtime !== !1 && await this.notifyVisitorMessageResult(i), {
      conversationId: i.conversationId,
      inboundMessage: _e(i.inboundMessage),
      aiMessage: i.aiMessage ? _e({ ...i.aiMessage, status: "sent" }) : null,
      duplicate: i.duplicate
    };
  }
  async completeVisitorMessage(e) {
    try {
      const t = await this.conversations.findById(e.conversationId), n = await this.messages.findById(e.inboundMessageId);
      if (!t || !n || n.conversationId !== t.id) return;
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: n
      });
      const a = await this.conversationService.createAiReply({
        conversationId: t.id,
        channelAccountId: t.channelAccountId,
        messageContent: n.content,
        handoffStatus: t.handoffStatus
      });
      if (!a) return;
      await this.messages.markSent(a.id, a.id);
      const r = await this.conversations.findById(t.id) ?? t;
      await this.realtime.notifyMessageCreated({
        conversation: r,
        message: { ...a, status: "sent" }
      });
    } catch (t) {
      We.warn("widget_message_background_failed", {
        conversationId: e.conversationId,
        inboundMessageId: e.inboundMessageId,
        error: t instanceof Error ? t.message : String(t)
      });
    }
  }
  async ensureConversation(e, t) {
    const n = await this.verifyToken(e), a = await this.channels.getAccount(n.channelAccountId);
    if (this.assertWebChatChannel(a), !n.isAnonymous && !await this.endUsers.findById(n.visitorId))
      throw new f("END_USER_NOT_FOUND", "End user not found", 401);
    if (t && t !== "_") {
      const i = await this.conversations.findById(t);
      if (!i)
        throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
      if (i.channelAccountId !== n.channelAccountId || i.externalContactId !== n.visitorId)
        throw new f("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
      return { conversationId: t, claims: n };
    }
    return { conversationId: (await this.conversations.findOrCreateByExternalThread({
      channelAccountId: a.id,
      externalContactId: n.visitorId,
      externalThreadId: n.visitorId,
      contactName: n.contactName,
      isAnonymous: n.isAnonymous
    })).id, claims: n };
  }
  async notifyVisitorMessageResult(e) {
    const t = e.duplicate ? null : await this.conversations.findById(e.conversationId);
    t && (await this.realtime.notifyMessageCreated({
      conversation: t,
      message: e.inboundMessage
    }), e.aiMessage && await this.realtime.notifyMessageCreated({
      conversation: t,
      message: { ...e.aiMessage, status: "sent" }
    }));
  }
  async listMessages(e) {
    return await this.verifyConversationAccess(e.conversationId, e.token), (await this.messages.listByConversationAfter(e.conversationId, e.afterMessageId, 100)).map(_e);
  }
  requireConversationAccess(e, t) {
    return this.verifyConversationAccess(e, t);
  }
  assertWebChatChannel(e) {
    if (e.channelType !== "web_chat")
      throw new f("CHANNEL_NOT_WEB_CHAT", "Channel is not a Web Chat channel", 400);
    if (e.status !== "active")
      throw new f("CHANNEL_INACTIVE", "Channel is not active", 400);
  }
  async verifyConversationAccess(e, t) {
    const n = await this.verifyToken(t), a = await this.conversations.findById(e);
    if (!a)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (a.channelAccountId !== n.channelAccountId || a.externalContactId !== n.visitorId || a.externalThreadId !== n.visitorId)
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
    return n;
  }
  async signToken(e) {
    const t = ae(JSON.stringify(e)), n = await ze(this.tokenSecret, t);
    return `${t}.${n}`;
  }
  async verifyToken(e) {
    const [t, n] = e.split(".");
    if (!t || !n)
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const a = await ze(this.tokenSecret, t);
    if (!_t(n, a))
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const r = JSON.parse(ks(t));
    if (!r.version || !r.channelAccountId || !r.visitorId || !r.contactName || r.isAnonymous === void 0 || !r.exp)
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    if (r.exp < Math.floor(Date.now() / 1e3))
      throw new f("VISITOR_TOKEN_EXPIRED", "Visitor token has expired", 401);
    return r;
  }
}
function mi(s) {
  const e = s.trim().slice(0, 128);
  if (!e)
    throw new f("VISITOR_ID_INVALID", "Visitor id cannot be empty", 400);
  return e;
}
function pi(s) {
  return (s == null ? void 0 : s.trim()) ?? "";
}
function I(s) {
  const e = new fr([new pr(), new gr(), new qn(), new br()]), t = new Pr(s.DB), n = new Br(s.DB), a = new Xr(s.DB), r = new qr(s.DB), i = new ni(s.DB), o = s.KB_INSTANCE_NAME ?? "supportly-dev", c = new Tr(s.AI_SEARCH.get(o), o), d = new Mr(s.AI, s), l = new Dr(c, d, a), u = new Lr(t, e), p = new jr(n, a, l), w = new si(s), D = new zr(s.MEDIA_BUCKET, a), j = new Qr(
    u,
    n,
    a,
    w,
    D
  ), U = new Vr(r, c), B = new ri(i, s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"), P = new ci(s.DB), F = new li(
    P,
    s.END_USER_JWT_SECRET ?? "supportly-dev-enduser-secret-change-before-deploy"
  ), Ae = new fi(
    u,
    n,
    a,
    p,
    w,
    D,
    P,
    s.WIDGET_TOKEN_SECRET ?? s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
  ), H = new Fr(
    u,
    n,
    a,
    p,
    w,
    D,
    P,
    F,
    B,
    s.WIDGET_TOKEN_SECRET ?? s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
  );
  return {
    adapters: e,
    channels: u,
    conversations: p,
    messages: j,
    media: D,
    realtime: w,
    knowledge: U,
    auth: B,
    endUserAuth: F,
    widget: Ae,
    forum: H
  };
}
function Ce() {
  return async (s, e) => {
    const t = s.req.header("x-admin-user-id"), n = s.req.header("authorization"), r = await I(s.env).auth.requireAdminUser({ adminUserId: t, authorization: n });
    s.set("adminUserId", r.id), s.set("adminUser", {
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role
    }), await e();
  };
}
function E(s, e) {
  return Response.json({ data: s }, e);
}
function jt(s) {
  return E(s, { status: 201 });
}
function gi() {
  return new Response(null, { status: 204 });
}
const Je = new le();
Je.get("/ws", async (s) => {
  var o, c;
  yi(s.req.raw);
  const e = I(s.env), t = (o = s.req.query("token")) == null ? void 0 : o.trim(), n = await e.auth.requireAdminUser({
    adminUserId: ((c = s.req.query("adminUserId")) == null ? void 0 : c.trim()) || s.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : s.req.header("authorization")
  }), a = s.env.ADMIN_STREAM.idFromName("admin"), r = s.env.ADMIN_STREAM.get(a), i = _i(s.req.raw, {
    "x-supportly-admin-user-id": n.id
  });
  return r.fetch(i);
});
Je.use("*", Ce());
Je.get("/", (s) => E({ ok: !0 }));
Je.get("/end-users", async (s) => {
  const e = I(s.env);
  return E(await e.endUserAuth.listUsers());
});
Je.post("/end-users/:id/approve", async (s) => {
  const e = I(s.env);
  return E(await e.endUserAuth.approveUser(s.req.param("id")));
});
Je.post("/end-users/:id/deactivate", async (s) => (await I(s.env).endUserAuth.deactivateUser(s.req.param("id")), E({ deactivated: !0 })));
function yi(s) {
  var e;
  if (((e = s.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new f("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function _i(s, e) {
  const t = new URL(s.url);
  t.searchParams.delete("token"), t.searchParams.delete("adminUserId");
  const n = new Headers(s.headers);
  n.delete("authorization"), n.delete("x-admin-user-id");
  for (const [a, r] of Object.entries(e))
    n.set(a, r);
  return new Request(t.toString(), {
    method: s.method,
    headers: n
  });
}
const Ie = new le(), vi = O({
  email: g().email(),
  password: g().min(1)
});
Ie.post("/login", async (s) => {
  const e = vi.parse(await s.req.json()), t = I(s.env);
  return E(await t.auth.login(e.email, e.password));
});
Ie.get("/me", Ce(), (s) => E(s.get("adminUser")));
const wi = O({
  username: g().trim().min(2).max(50),
  password: g().min(6).max(128),
  email: g().email().optional(),
  displayName: g().trim().max(100).optional()
}), Ii = O({
  username: g().trim().min(1),
  password: g().min(1)
});
Ie.post("/end-user/register", async (s) => {
  const e = wi.parse(await s.req.json()), t = I(s.env);
  return E(await t.endUserAuth.register(e));
});
Ie.post("/end-user/login", async (s) => {
  const e = Ii.parse(await s.req.json()), t = I(s.env);
  return E(await t.endUserAuth.login(e.username, e.password));
});
Ie.get("/end-user/me", async (s) => {
  const t = await I(s.env).endUserAuth.requireEndUser(s.req.header("authorization"));
  return E({
    id: t.id,
    username: t.username,
    displayName: t.displayName,
    email: t.email,
    rawPayloadJson: t.rawPayloadJson
  });
});
const Ai = O({
  displayName: g().trim().max(100).optional(),
  oldPassword: g().min(1).optional(),
  newPassword: g().min(6).max(128).optional(),
  settings: Ln(Pn()).optional()
});
Ie.patch("/end-user/me", async (s) => {
  const e = Ai.parse(await s.req.json()), t = I(s.env), n = await t.endUserAuth.requireEndUser(s.req.header("authorization"));
  if (e.settings && await t.endUserAuth.updateSettings(n.id, e.settings), e.newPassword) {
    if (!e.oldPassword)
      throw new f("MISSING_OLD_PASSWORD", "Old password is required", 400);
    await t.endUserAuth.changePassword(n.id, e.oldPassword, e.newPassword);
  }
  return e.displayName && await t.endUserAuth.updateDisplayName(n.id, e.displayName), E({ success: !0 });
});
const Wn = "avatars/", Ei = 2 * 1024 * 1024, bi = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
Ie.post("/end-user/avatar", async (s) => {
  const t = await I(s.env).endUserAuth.requireEndUser(s.req.header("authorization")), a = (await s.req.formData()).get("file");
  if (!Ti(a))
    throw new f("NO_FILE", "No file uploaded", 400);
  const r = (a.type || "image/png").toLowerCase();
  if (!bi.has(r))
    throw new f("INVALID_FILE_TYPE", "Only JPEG, PNG, GIF, WebP images are allowed", 400);
  if (a.size > Ei)
    throw new f("FILE_TOO_LARGE", "Avatar image must be under 2MB", 400);
  const i = s.env.MEDIA_BUCKET;
  if (!i)
    throw new f("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const o = `${Wn}${t.id}`;
  await i.put(o, a.stream(), {
    httpMetadata: { contentType: r, cacheControl: "no-cache" }
  });
  const c = `/api/auth/end-user/avatar/${t.id}`;
  return E({ avatarUrl: c });
});
Ie.get("/end-user/avatar/:userId", async (s) => {
  const e = s.env.MEDIA_BUCKET;
  if (!e)
    throw new f("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const t = s.req.param("userId"), n = `${Wn}${t}`, a = await e.get(n);
  if (!a)
    throw new f("AVATAR_NOT_FOUND", "Avatar not found", 404);
  const r = new Headers();
  return a.writeHttpMetadata(r), r.set("cache-control", "no-cache"), r.set("etag", a.httpEtag), new Response(a.body, { headers: r });
});
function Ti(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
const xi = O({
  channelType: yt(["custom_webhook", "telegram", "whatsapp", "wechat", "web_chat", "forum"]),
  displayName: g().min(1),
  externalAccountId: g().optional(),
  credentialCiphertext: g().optional(),
  webhookSecretCiphertext: g().optional(),
  outboundUrl: g().url().optional()
}), Hn = O({
  webhookUrl: g().url().optional(),
  dropPendingUpdates: Y().optional()
}), vt = new le();
vt.use("*", Ce());
vt.get("/", async (s) => {
  const e = I(s.env);
  return E((await e.channels.listAccounts()).map(Zn));
});
vt.post("/", async (s) => {
  const e = xi.parse(await s.req.json()), t = I(s.env);
  return jt(Zn(await t.channels.createAccount(e)));
});
vt.post("/:id/telegram/set-webhook", async (s) => {
  const e = Hn.parse(await s.req.json().catch(() => ({}))), t = I(s.env), n = await t.channels.getAccount(s.req.param("id")), a = zn(t.channels.getAdapter(n));
  return E(
    await a.setWebhook(n, {
      webhookUrl: e.webhookUrl ?? Jn(s.req.url, n.id),
      dropPendingUpdates: e.dropPendingUpdates
    })
  );
});
vt.post("/:id/telegram/test", async (s) => {
  const e = Hn.pick({ webhookUrl: !0 }).parse(await s.req.json().catch(() => ({}))), t = I(s.env), n = await t.channels.getAccount(s.req.param("id")), a = zn(t.channels.getAdapter(n));
  return E(await a.testConnection(n, e.webhookUrl ?? Jn(s.req.url, n.id)));
});
function Zn(s) {
  return {
    ...s,
    credentialCiphertext: null
  };
}
function zn(s) {
  if (s instanceof qn) return s;
  throw new f("CHANNEL_NOT_TELEGRAM", "Channel is not a Telegram channel", 400);
}
function Jn(s, e) {
  return `${new URL(s).origin}/webhooks/${e}`;
}
const Si = O({
  clientMessageId: g().trim().min(1).max(128).optional(),
  content: g().min(1)
}), Ni = O({
  status: yt(["bot", "agent"])
}), ue = new le();
ue.get("/:id/messages/:messageId/attachments/:index", async (s) => {
  var n, a;
  const e = I(s.env), t = (n = s.req.query("token")) == null ? void 0 : n.trim();
  return await e.auth.requireAdminUser({
    adminUserId: ((a = s.req.query("adminUserId")) == null ? void 0 : a.trim()) || s.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : s.req.header("authorization")
  }), e.media.getMessageAttachmentResponse({
    conversationId: s.req.param("id"),
    messageId: s.req.param("messageId"),
    attachmentIndex: ki(s.req.param("index")),
    request: s.req.raw
  });
});
ue.use("*", Ce());
ue.get("/", async (s) => {
  const e = I(s.env);
  return s.req.query("status") === "resolved" ? E(await e.conversations.listResolvedConversations()) : E(await e.conversations.listOpenConversations());
});
ue.get("/:id", async (s) => {
  const e = I(s.env);
  return E(await e.conversations.getConversation(s.req.param("id")));
});
ue.get("/:id/messages", async (s) => {
  const e = I(s.env);
  return E(await e.messages.listConversationMessages(s.req.param("id"), s.req.query("after") || void 0));
});
ue.post("/:id/messages", async (s) => {
  const e = Si.parse(await s.req.json()), t = I(s.env);
  return E(
    await t.messages.sendAgentMessage({
      conversationId: s.req.param("id"),
      adminUserId: s.get("adminUserId"),
      clientMessageId: e.clientMessageId,
      content: e.content
    })
  );
});
ue.post("/:id/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Ri(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const n = I(s.env);
  return E(
    await n.messages.sendAgentMediaMessage({
      conversationId: s.req.param("id"),
      adminUserId: s.get("adminUserId"),
      clientMessageId: Zt(e, "clientMessageId", 128),
      content: Zt(e, "content", 2e3),
      file: t,
      fileName: Zt(e, "fileName", 300),
      mimeType: Zt(e, "mimeType", 100)
    })
  );
});
ue.post("/:id/handoff", async (s) => {
  const e = Ni.parse(await s.req.json()), t = I(s.env);
  return E(await t.conversations.setHandoff(s.req.param("id"), e.status));
});
ue.post("/:id/resolve", async (s) => {
  const e = I(s.env);
  return E(await e.conversations.resolve(s.req.param("id")));
});
function Ri(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function Zt(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new f("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function ki(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new f("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
const Gn = new le();
Gn.get("/", (s) => s.json({ ok: !0 }));
const wt = new le();
wt.use("*", Ce());
function Oi(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "arrayBuffer" in s;
}
wt.get("/documents", async (s) => {
  const e = I(s.env);
  return E(await e.knowledge.listDocuments());
});
wt.post("/documents", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Oi(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const n = e.get("title"), a = I(s.env);
  return jt(
    await a.knowledge.uploadDocument({
      file: t,
      title: typeof n == "string" ? n : void 0,
      createdByAdminUserId: s.get("adminUserId")
    })
  );
});
wt.post("/sync/ai-search", async (s) => {
  const e = I(s.env);
  return E(await e.knowledge.syncFromAiSearch());
});
wt.delete("/documents/:id", async (s) => (await I(s.env).knowledge.deleteDocument(s.req.param("id")), gi()));
const Kn = new le();
Kn.post("/:channelAccountId", async (s) => {
  const e = s.req.query("debug") === "1" || s.req.header("x-debug-response") === "true", t = I(s.env), n = await t.channels.getAccount(s.req.param("channelAccountId")), a = t.channels.getAdapter(n);
  await a.verify(s.req.raw.clone(), n);
  const r = await a.parseInbound(s.req.raw.clone(), n);
  let i = 0, o = 0, c = 0, d = 0;
  const l = [];
  for (const p of r) {
    const w = await t.conversations.receiveInboundMessage({ channelAccount: n, inbound: p });
    let D = !1, j;
    if (w.duplicate ? o += 1 : i += 1, w.aiMessage) {
      c += 1;
      try {
        const U = await a.sendMessage(n, {
          conversationId: w.conversationId,
          externalThreadId: p.externalThreadId,
          messageId: w.aiMessage.id,
          messageType: "text",
          content: w.aiMessage.content ?? ""
        });
        await t.messages.markSent(w.aiMessage.id, U.externalMessageId), D = !0, We.info("ai_reply_sent", {
          requestId: s.get("requestId"),
          conversationId: w.conversationId,
          messageId: w.aiMessage.id,
          externalMessageId: U.externalMessageId
        });
      } catch (U) {
        await t.messages.markFailed(
          w.aiMessage.id,
          U instanceof Error ? U.message : "AI reply send failed"
        ), d += 1, j = U instanceof Error ? U.message : String(U), We.warn("ai_reply_send_failed", {
          requestId: s.get("requestId"),
          conversationId: w.conversationId,
          messageId: w.aiMessage.id,
          error: U instanceof Error ? U.message : String(U)
        });
      }
    }
    e && l.push({
      conversationId: w.conversationId,
      inboundMessageId: w.inboundMessage.id,
      duplicate: w.duplicate,
      aiMessage: w.aiMessage ? {
        id: w.aiMessage.id,
        content: w.aiMessage.content,
        status: D ? "sent" : w.aiMessage.status
      } : null,
      aiReplySent: D,
      aiReplySendError: j
    });
  }
  const u = {
    received: r.length,
    accepted: i,
    duplicates: o,
    aiReplies: c,
    aiReplySendFailures: d
  };
  return E(e ? { ...u, results: l } : u);
});
const Mi = O({
  channelAccountId: g().min(1),
  visitorId: g().min(1).max(128),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional()
}), Ci = O({
  clientMessageId: g().trim().min(1).max(128).optional(),
  content: g().trim().min(1).max(2e3),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional()
}), Ge = new le();
Ge.get("/ws", async (s) => {
  var o;
  Ui(s.req.raw);
  const e = (o = s.req.query("conversationId")) == null ? void 0 : o.trim();
  if (!e)
    throw new f("CONVERSATION_ID_REQUIRED", "Conversation id is required", 400);
  const n = await I(s.env).widget.requireConversationAccess(e, Yn(s.req.raw, s.req.query("token"))), a = s.env.VISITOR_STREAM.idFromName(e), r = s.env.VISITOR_STREAM.get(a), i = Li(s.req.raw, {
    "x-supportly-conversation-id": e,
    "x-supportly-visitor-id": n.visitorId
  });
  return r.fetch(i);
});
Ge.post("/conversations", async (s) => {
  const e = Mi.parse(await s.req.json()), t = I(s.env), n = s.req.header("authorization"), a = n ? await t.endUserAuth.requireEndUser(n) : null;
  return jt(await t.widget.createSession({
    ...e,
    endUserId: a == null ? void 0 : a.id,
    endUserName: a == null ? void 0 : a.displayName
  }));
});
Ge.post("/conversations/:conversationId/messages", async (s) => {
  const e = Ci.parse(await s.req.json()), t = I(s.env), n = await t.widget.sendVisitorMessage(
    {
      conversationId: s.req.param("conversationId"),
      token: os(s.req.raw),
      clientMessageId: e.clientMessageId,
      content: e.content,
      pageUrl: e.pageUrl,
      pageTitle: e.pageTitle
    },
    { createAiReply: !1, notifyRealtime: !1 }
  );
  return n.duplicate || s.executionCtx.waitUntil(
    t.widget.completeVisitorMessage({
      conversationId: n.conversationId,
      inboundMessageId: n.inboundMessage.id
    })
  ), E(n);
});
Ge.post("/conversations/:conversationId/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Di(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const a = await I(s.env).widget.sendVisitorMediaMessage({
    conversationId: s.req.param("conversationId"),
    token: os(s.req.raw),
    clientMessageId: Qe(e, "clientMessageId", 128),
    content: Qe(e, "content", 2e3),
    file: t,
    fileName: Qe(e, "fileName", 300),
    mimeType: Qe(e, "mimeType", 100),
    pageUrl: Qe(e, "pageUrl", 2048),
    pageTitle: Qe(e, "pageTitle", 300)
  });
  return E(a);
});
Ge.get("/conversations/:conversationId/messages", async (s) => {
  const e = I(s.env), t = s.req.param("conversationId");
  return E(!t || t === "_" ? { messages: [] } : {
    messages: await e.widget.listMessages({
      conversationId: t,
      token: os(s.req.raw),
      afterMessageId: s.req.query("after") || void 0
    })
  });
});
Ge.get("/conversations/:conversationId/messages/:messageId/attachments/:index", async (s) => {
  const e = I(s.env), t = s.req.param("conversationId");
  return await e.widget.requireConversationAccess(t, Yn(s.req.raw, s.req.query("token"))), e.media.getMessageAttachmentResponse({
    conversationId: t,
    messageId: s.req.param("messageId"),
    attachmentIndex: Pi(s.req.param("index")),
    request: s.req.raw
  });
});
function os(s) {
  const e = s.headers.get("authorization"), t = "Bearer ";
  if (!(e != null && e.startsWith(t)))
    throw new f("VISITOR_TOKEN_REQUIRED", "Visitor token is required", 401);
  return e.slice(t.length).trim();
}
function Yn(s, e) {
  return e != null && e.trim() ? e.trim() : os(s);
}
function Ui(s) {
  var e;
  if (((e = s.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new f("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function Di(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function Qe(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new f("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function Pi(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new f("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function Li(s, e) {
  const t = new URL(s.url);
  t.searchParams.delete("token");
  const n = new Headers(s.headers);
  n.delete("authorization");
  for (const [a, r] of Object.entries(e))
    n.set(a, r);
  return new Request(t.toString(), {
    method: s.method,
    headers: n
  });
}
const Bi = O({
  channelAccountId: g().min(1),
  visitorId: g().min(1).max(128),
  title: g().trim().min(1).max(200),
  content: g().trim().min(1).max(5e4),
  category: g().max(30).optional(),
  tags: Rs(g().max(30)).max(5).optional(),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional(),
  endUserToken: g().optional(),
  visibility: yt(["public", "login_required"]).optional()
}), ji = O({
  visitorId: g().min(1).max(128),
  content: g().trim().min(1).max(5e4),
  quotedMessageId: g().optional(),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional(),
  endUserToken: g().optional()
}), $i = O({
  visitorId: g().min(1).max(128)
}), Fi = O({
  pin: Y()
}), qi = O({
  feature: Y()
}), L = new le();
L.get("/config", async (s) => {
  const e = s.env.FORUM_CHANNEL_ID;
  if (!e)
    throw new f("FORUM_NOT_FOUND", "FORUM_CHANNEL_ID not configured", 404);
  return E({
    channelId: e,
    title: s.env.FORUM_TITLE || "社区论坛",
    primaryColor: s.env.FORUM_PRIMARY_COLOR || "#2563eb",
    categories: (s.env.FORUM_CATEGORIES || "综合讨论,技术交流,问题反馈,资源分享,公告通知").split(",").map((t) => t.trim()),
    widgetChannelId: s.env.WIDGET_CHANNEL_ID,
    widgetTitle: s.env.WIDGET_TITLE,
    widgetMode: s.env.WIDGET_MODE || "chat"
  });
});
L.get("/admin/check", Ce(), async (s) => E({ isAdmin: !0 }));
const Vi = O({
  account: g().min(1),
  password: g().min(1)
});
L.post("/login", async (s) => {
  const e = Vi.parse(await s.req.json()), t = I(s.env);
  try {
    const n = await t.auth.login(e.account, e.password);
    return E({ ...n, authType: "admin" });
  } catch {
    const n = await t.endUserAuth.login(e.account, e.password);
    return E({ ...n, authType: "end_user" });
  }
});
L.get("/channels/:channelAccountId/topics", async (s) => {
  const e = I(s.env), t = un(s.req.query("limit"), 50), n = un(s.req.query("offset"), 0);
  return E(
    await e.forum.listTopics({
      channelAccountId: s.req.param("channelAccountId"),
      limit: t,
      offset: n,
      search: s.req.query("search") || void 0,
      sortBy: s.req.query("sort") || void 0,
      tag: s.req.query("tag") || void 0,
      category: s.req.query("category") || void 0
    })
  );
});
L.post("/channels/:channelAccountId/topics", async (s) => {
  const e = Bi.parse(await s.req.json()), t = I(s.env);
  return jt(await t.forum.createTopic(e));
});
L.post("/topics/:conversationId/replies", async (s) => {
  const e = ji.parse(await s.req.json()), t = I(s.env);
  return jt(
    await t.forum.sendReply({
      conversationId: s.req.param("conversationId"),
      ...e
    })
  );
});
L.get("/topics/:conversationId/messages", async (s) => {
  const e = I(s.env), t = s.req.param("conversationId");
  return E(!t || t === "_" ? { messages: [] } : await e.forum.listMessages({
    conversationId: t,
    afterMessageId: s.req.query("after") || void 0
  }));
});
L.post("/topics/:conversationId/like", async (s) => {
  const e = $i.parse(await s.req.json()), t = I(s.env);
  return E(
    await t.forum.likeTopic({
      conversationId: s.req.param("conversationId"),
      visitorId: e.visitorId
    })
  );
});
L.post("/topics/:conversationId/pin", Ce(), async (s) => {
  const e = Fi.parse(await s.req.json()), t = I(s.env);
  return E(
    await t.forum.togglePin({
      conversationId: s.req.param("conversationId"),
      pin: e.pin
    })
  );
});
L.post("/topics/:conversationId/feature", Ce(), async (s) => {
  const e = qi.parse(await s.req.json()), t = I(s.env);
  return E(
    await t.forum.toggleFeatured({
      conversationId: s.req.param("conversationId"),
      feature: e.feature
    })
  );
});
const Wi = O({
  userId: g().min(1),
  userRole: yt(["admin", "mediator", "member"])
});
L.delete("/topics/:conversationId", async (s) => {
  const e = Wi.parse(await s.req.json()), t = I(s.env);
  return E(
    await t.forum.deleteTopic({
      conversationId: s.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole
    })
  );
});
const Hi = O({
  userId: g().min(1),
  userRole: yt(["admin", "mediator", "member"]),
  title: g().trim().min(1).max(200).optional(),
  content: g().trim().min(1).max(5e4).optional()
});
L.patch("/topics/:conversationId", async (s) => {
  const e = Hi.parse(await s.req.json()), t = I(s.env);
  return E(
    await t.forum.updateTopic({
      conversationId: s.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole,
      title: e.title,
      content: e.content
    })
  );
});
L.get("/users/:externalContactId/profile", async (s) => {
  const t = await I(s.env).forum.getUserProfile(
    s.req.param("externalContactId")
  );
  return E(t);
});
L.get("/users/:externalContactId/notifications", async (s) => {
  const e = I(s.env);
  return E(
    await e.forum.getUserNotifications(
      s.req.param("externalContactId")
    )
  );
});
const Zi = O({
  channelAccountId: g().min(1),
  targetUserId: g().min(1)
}), zi = O({
  content: g().trim().min(1).max(5e4)
});
L.post("/pm/conversations", async (s) => {
  const e = Zi.parse(await s.req.json()), t = I(s.env), n = await t.endUserAuth.requireEndUser(s.req.header("authorization"));
  return E(
    await t.forum.createPMConversation({
      channelAccountId: e.channelAccountId,
      currentUserId: n.id,
      targetUserId: e.targetUserId
    })
  );
});
L.get("/pm/conversations", async (s) => {
  const e = I(s.env), t = s.req.query("channelAccountId");
  if (!t)
    throw new f("MISSING_PARAM", "channelAccountId is required", 400);
  const n = await e.endUserAuth.requireEndUser(s.req.header("authorization"));
  return E(
    await e.forum.listPMConversations({
      channelAccountId: t,
      currentUserId: n.id
    })
  );
});
L.post("/pm/conversations/:conversationId/messages", async (s) => {
  const e = zi.parse(await s.req.json()), t = I(s.env), n = await t.endUserAuth.requireEndUser(s.req.header("authorization")), a = await t.forum.sendPMMessage({
    conversationId: s.req.param("conversationId"),
    senderUserId: n.id,
    content: e.content
  }), r = getAvatarUrlFromRawPayload(n.rawPayloadJson);
  return E({ message: _e(a.message, r) });
});
L.post("/pm/conversations/:conversationId/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Gi(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const n = I(s.env), a = await n.endUserAuth.requireEndUser(s.req.header("authorization")), r = await n.forum.sendPMMediaMessage({
    conversationId: s.req.param("conversationId"),
    senderUserId: a.id,
    clientMessageId: zt(e, "clientMessageId", 128),
    content: zt(e, "content", 2e3),
    file: t,
    fileName: zt(e, "fileName", 300),
    mimeType: zt(e, "mimeType", 100)
  }), i = getAvatarUrlFromRawPayload(a.rawPayloadJson);
  return E({ message: _e(r.message, i) });
});
L.get("/pm/conversations/:conversationId/messages", async (s) => {
  const e = I(s.env);
  await e.endUserAuth.requireEndUser(s.req.header("authorization"));
  const t = await e.forum.listPMMessages({
    conversationId: s.req.param("conversationId"),
    afterMessageId: s.req.query("after") || void 0
  });
  return E({ messages: t.messages.map(_e) });
});
L.get("/pm/conversations/:conversationId/messages/:messageId/attachments/:index", async (s) => I(s.env).media.getMessageAttachmentResponse({
  conversationId: s.req.param("conversationId"),
  messageId: s.req.param("messageId"),
  attachmentIndex: Ji(s.req.param("index")),
  request: s.req.raw
}));
L.get("/ws", async (s) => {
  var d;
  const e = s.req.query("token");
  if (!e)
    throw new f("MISSING_TOKEN", "token is required", 400);
  const n = await I(s.env).endUserAuth.tryGetEndUser(`Bearer ${e}`);
  if (!n)
    throw new f("UNAUTHORIZED", "Invalid or expired token", 401);
  if (((d = s.req.header("upgrade")) == null ? void 0 : d.toLowerCase()) !== "websocket")
    throw new f("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
  const r = s.env.END_USER_STREAM.idFromName("end_user"), i = s.env.END_USER_STREAM.get(r), o = new URL("https://end-user-stream.internal/"), c = new Request(o, {
    headers: {
      upgrade: "websocket",
      "x-supportly-end-user-id": n.id
    }
  });
  return i.fetch(c);
});
function un(s, e) {
  if (!s) return e;
  const t = parseInt(s, 10);
  return Number.isFinite(t) && t > 0 ? t : e;
}
function Ji(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new f("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function Gi(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function zt(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new f("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
const K = new le();
K.use("*", hr());
K.use(
  "*",
  La({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Authorization",
      "Content-Type",
      "Range",
      "X-Admin-User-Id",
      "X-Debug-Response",
      "X-Request-Id",
      "X-Supportly-Signature",
      "X-Telegram-Bot-Api-Secret-Token"
    ],
    exposeHeaders: ["Accept-Ranges", "Content-Length", "Content-Range", "Content-Type", "X-Request-Id"],
    maxAge: 86400
  })
);
K.use("*", ur());
K.route("/health", Gn);
K.route("/api/auth", Ie);
K.route("/api/admin", Je);
K.route("/api/channels", vt);
K.route("/api/conversations", ue);
K.route("/api/knowledge", wt);
K.route("/api/widget", Ge);
K.route("/api/forum", L);
K.route("/webhooks", Kn);
K.onError((s, e) => Bn(s, e));
K.notFound((s) => s.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, 404));
class Xi {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      et(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        et(e, { type: "pong", serverTime: S() });
        return;
      }
      et(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      et(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-admin-user-id");
    if (!t)
      return new Response("Missing admin identity", { status: 400 });
    const n = new WebSocketPair(), a = n[0], r = n[1], i = {
      kind: "admin",
      adminUserId: t,
      connectedAt: S()
    };
    return r.serializeAttachment(i), this.state.acceptWebSocket(r), et(r, { type: "connected", connectionKind: "admin", serverTime: S() }), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" && t.type !== "conversation.updated" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      et(t, e);
  }
}
function et(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
class Qi {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      tt(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        tt(e, { type: "pong", serverTime: S() });
        return;
      }
      tt(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      tt(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-conversation-id"), n = e.headers.get("x-supportly-visitor-id");
    if (!t || !n)
      return new Response("Missing connection identity", { status: 400 });
    const a = new WebSocketPair(), r = a[0], i = a[1], o = {
      kind: "visitor",
      conversationId: t,
      visitorId: n,
      connectedAt: S()
    };
    return i.serializeAttachment(o), this.state.acceptWebSocket(i), tt(i, { type: "connected", connectionKind: "visitor", serverTime: S() }), new Response(null, { status: 101, webSocket: r });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      tt(t, e);
  }
}
function tt(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
const hn = 3e4, Ki = 6e4;
class eo {
  constructor(e, t) {
    A(this, "onlineUsers", /* @__PURE__ */ new Set());
    A(this, "heartbeatMap", /* @__PURE__ */ new Map());
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  async alarm() {
    const e = Date.now();
    let t = !1;
    for (const [n, a] of this.heartbeatMap)
      e - a > Ki && (this.heartbeatMap.delete(n), this.onlineUsers.delete(n), t = !0);
    t && this.broadcastPresence(), this.heartbeatMap.size > 0 && await this.state.storage.setAlarm(Date.now() + hn);
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      De(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        const a = e.deserializeAttachment();
        a != null && a.userId && this.heartbeatMap.set(a.userId, Date.now()), De(e, { type: "pong", serverTime: S() });
        return;
      }
      De(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      De(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketClose(e, t, n, a) {
    const r = e.deserializeAttachment();
    r != null && r.userId && (this.onlineUsers.delete(r.userId), this.heartbeatMap.delete(r.userId), this.broadcastPresence());
  }
  webSocketError(e) {
    const t = e.deserializeAttachment();
    t != null && t.userId && (this.onlineUsers.delete(t.userId), this.heartbeatMap.delete(t.userId), this.broadcastPresence()), e.close(1011, "WebSocket error");
  }
  async handleWebSocket(e) {
    const t = e.headers.get("x-supportly-end-user-id");
    if (!t)
      return new Response("Missing end user identity", { status: 400 });
    const n = new WebSocketPair(), a = n[0], r = n[1], i = {
      kind: "end_user",
      userId: t,
      connectedAt: S()
    };
    return r.serializeAttachment(i), this.state.acceptWebSocket(r), this.onlineUsers.add(t), this.heartbeatMap.set(t, Date.now()), De(r, { type: "connected", connectionKind: "end_user", serverTime: S() }), this.broadcastPresence(), await this.state.storage.setAlarm(Date.now() + hn), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return t ? (t.type === "message.new" && t.targetUserId && t.payload && this.sendToUser(t.targetUserId, t.payload), this.broadcastPresence(), new Response(null, { status: 204 })) : new Response("Invalid notify event", { status: 400 });
  }
  sendToUser(e, t) {
    for (const n of this.state.getWebSockets()) {
      const a = n.deserializeAttachment();
      (a == null ? void 0 : a.userId) === e && De(n, t);
    }
  }
  broadcastPresence() {
    const e = {
      type: "end_user.presence",
      onlineUserIds: Array.from(this.onlineUsers)
    };
    for (const t of this.state.getWebSockets())
      De(t, e);
  }
}
function De(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
export {
  Xi as AdminStream,
  eo as EndUserStream,
  Qi as VisitorStream,
  K as default
};
