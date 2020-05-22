/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Licensed under the MIT license.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT License.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */

// jquery.pjax.js
// copyright chris wanstrath
// https://github.com/defunkt/jquery-pjax
// Released under MIT License (Please see the above website)

/*! jQuery v1.7.2 jquery.com | jquery.org/license */ (function(a, b) {
    function cy(a) {
        return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }
    function cu(a) {
        if (!cj[a]) {
            var b = c.body,
                d = f("<" + a + ">").appendTo(b),
                e = d.css("display");
            d.remove();
            if (e === "none" || e === "") {
                ck || (ck = c.createElement("iframe"), ck.frameBorder = ck.width = ck.height = 0), b.appendChild(ck);
                if (!cl || !ck.createElement) cl = (ck.contentWindow || ck.contentDocument).document, cl.write((f.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), cl.close();
                d = cl.createElement(a), cl.body.appendChild(d), e = f.css(d, "display"), b.removeChild(ck)
            }
            cj[a] = e
        }
        return cj[a]
    }
    function ct(a, b) {
        var c = {};
        f.each(cp.concat.apply([], cp.slice(0, b)), function() {
            c[this] = a
        });
        return c
    }
    function cs() {
        cq = b
    }
    function cr() {
        setTimeout(cs, 0);
        return cq = f.now()
    }
    function ci() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }
    function ch() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }
    function cb(a, c) {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var d = a.dataTypes,
            e = {}, g, h, i = d.length,
            j, k = d[0],
            l, m, n, o, p;
        for (g = 1; g < i; g++) {
            if (g === 1) for (h in a.converters) typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]);
            l = k, k = d[g];
            if (k === "*") k = l;
            else if (l !== "*" && l !== k) {
                m = l + " " + k, n = e[m] || e["* " + k];
                if (!n) {
                    p = b;
                    for (o in e) {
                        j = o.split(" ");
                        if (j[0] === l || j[0] === "*") {
                            p = e[j[1] + " " + k];
                            if (p) {
                                o = e[o], o === !0 ? n = p : p === !0 && (n = o);
                                break
                            }
                        }
                    }
                }!n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c)))
            }
        }
        return c
    }
    function ca(a, c, d) {
        var e = a.contents,
            f = a.dataTypes,
            g = a.responseFields,
            h, i, j, k;
        for (i in g) i in d && (c[g[i]] = d[i]);
        while (f[0] === "*") f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
        if (h) for (i in e) if (e[i] && e[i].test(h)) {
            f.unshift(i);
            break
        }
        if (f[0] in d) j = f[0];
        else {
            for (i in d) {
                if (!f[0] || a.converters[i + " " + f[0]]) {
                    j = i;
                    break
                }
                k || (k = i)
            }
            j = j || k
        }
        if (j) {
            j !== f[0] && f.unshift(j);
            return d[j]
        }
    }
    function b_(a, b, c, d) {
        if (f.isArray(b)) f.each(b, function(b, e) {
            c || bD.test(a) ? d(a, e) : b_(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d)
        });
        else if (!c && f.type(b) === "object") for (var e in b) b_(a + "[" + e + "]", b[e], c, d);
        else d(a, b)
    }
    function b$(a, c) {
        var d, e, g = f.ajaxSettings.flatOptions || {};
        for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]);
        e && f.extend(!0, a, e)
    }
    function bZ(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h = a[f],
            i = 0,
            j = h ? h.length : 0,
            k = a === bS,
            l;
        for (; i < j && (k || !l); i++) l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = bZ(a, c, d, e, l, g)));
        (k || !l) && !g["*"] && (l = bZ(a, c, d, e, "*", g));
        return l
    }
    function bY(a) {
        return function(b, c) {
            typeof b != "string" && (c = b, b = "*");
            if (f.isFunction(c)) {
                var d = b.toLowerCase().split(bO),
                    e = 0,
                    g = d.length,
                    h, i, j;
                for (; e < g; e++) h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c)
            }
        }
    }
    function bB(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight,
            e = b === "width" ? 1 : 0,
            g = 4;
        if (d > 0) {
            if (c !== "border") for (; e < g; e += 2) c || (d -= parseFloat(f.css(a, "padding" + bx[e])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + bx[e])) || 0 : d -= parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0;
            return d + "px"
        }
        d = by(a, b);
        if (d < 0 || d == null) d = a.style[b];
        if (bt.test(d)) return d;
        d = parseFloat(d) || 0;
        if (c) for (; e < g; e += 2) d += parseFloat(f.css(a, "padding" + bx[e])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + bx[e])) || 0);
        return d + "px"
    }
    function bo(a) {
        var b = c.createElement("div");
        bh.appendChild(b), b.innerHTML = a.outerHTML;
        return b.firstChild
    }
    function bn(a) {
        var b = (a.nodeName || "").toLowerCase();
        b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm)
    }
    function bm(a) {
        if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked
    }
    function bl(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }
    function bk(a, b) {
        var c;
        b.nodeType === 1 && (b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? b.outerHTML = a.outerHTML : c !== "input" || a.type !== "checkbox" && a.type !== "radio" ? c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text) : (a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value)), b.removeAttribute(f.expando), b.removeAttribute("_submit_attached"), b.removeAttribute("_change_attached"))
    }
    function bj(a, b) {
        if (b.nodeType === 1 && !! f.hasData(a)) {
            var c, d, e, g = f._data(a),
                h = f._data(b, g),
                i = g.events;
            if (i) {
                delete h.handle, h.events = {};
                for (c in i) for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c, i[c][d])
            }
            h.data && (h.data = f.extend({}, h.data))
        }
    }
    function bi(a, b) {
        return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function U(a) {
        var b = V.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement) while (b.length) c.createElement(b.pop());
        return c
    }
    function T(a, b, c) {
        b = b || 0;
        if (f.isFunction(b)) return f.grep(a, function(a, d) {
            var e = !! b.call(a, d, a);
            return e === c
        });
        if (b.nodeType) return f.grep(a, function(a, d) {
            return a === b === c
        });
        if (typeof b == "string") {
            var d = f.grep(a, function(a) {
                return a.nodeType === 1
            });
            if (O.test(b)) return f.filter(b, d, !c);
            b = f.filter(b, d)
        }
        return f.grep(a, function(a, d) {
            return f.inArray(a, b) >= 0 === c
        })
    }
    function S(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11
    }
    function K() {
        return !0
    }
    function J() {
        return !1
    }
    function n(a, b, c) {
        var d = b + "defer",
            e = b + "queue",
            g = b + "mark",
            h = f._data(a, d);
        h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function() {
            !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire())
        }, 0)
    }
    function m(a) {
        for (var b in a) {
            if (b === "data" && f.isEmptyObject(a[b])) continue;
            if (b !== "toJSON") return !1
        }
        return !0
    }
    function l(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(k, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? +d : j.test(d) ? f.parseJSON(d) : d
                } catch (g) {}
                f.data(a, c, d)
            } else d = b
        }
        return d
    }
    function h(a) {
        var b = g[a] = {}, c, d;
        a = a.split(/\s+/);
        for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
        return b
    }
    var c = a.document,
        d = a.navigator,
        e = a.location,
        f = function() {
            function J() {
                if (!e.isReady) {
                    try {
                        c.documentElement.doScroll("left")
                    } catch (a) {
                        setTimeout(J, 1);
                        return
                    }
                    e.ready()
                }
            }
            var e = function(a, b) {
                    return new e.fn.init(a, b, h)
                }, f = a.jQuery,
                g = a.$,
                h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                j = /\S/,
                k = /^\s+/,
                l = /\s+$/,
                m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                n = /^[\],:{}\s]*$/,
                o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                q = /(?:^|:|,)(?:\s*\[)+/g,
                r = /(webkit)[ \/]([\w.]+)/,
                s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                t = /(msie) ([\w.]+)/,
                u = /(mozilla)(?:.*? rv:([\w.]+))?/,
                v = /-([a-z]|[0-9])/ig,
                w = /^-ms-/,
                x = function(a, b) {
                    return (b + "").toUpperCase()
                }, y = d.userAgent,
                z, A, B, C = Object.prototype.toString,
                D = Object.prototype.hasOwnProperty,
                E = Array.prototype.push,
                F = Array.prototype.slice,
                G = String.prototype.trim,
                H = Array.prototype.indexOf,
                I = {};
            e.fn = e.prototype = {
                constructor: e,
                init: function(a, d, f) {
                    var g, h, j, k;
                    if (!a) return this;
                    if (a.nodeType) {
                        this.context = this[0] = a, this.length = 1;
                        return this
                    }
                    if (a === "body" && !d && c.body) {
                        this.context = c, this[0] = c.body, this.selector = a, this.length = 1;
                        return this
                    }
                    if (typeof a == "string") {
                        a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null];
                        if (g && (g[1] || !d)) {
                            if (g[1]) {
                                d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes);
                                return e.merge(this, a)
                            }
                            h = c.getElementById(g[2]);
                            if (h && h.parentNode) {
                                if (h.id !== g[2]) return f.find(a);
                                this.length = 1, this[0] = h
                            }
                            this.context = c, this.selector = a;
                            return this
                        }
                        return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a)
                    }
                    if (e.isFunction(a)) return f.ready(a);
                    a.selector !== b && (this.selector = a.selector, this.context = a.context);
                    return e.makeArray(a, this)
                },
                selector: "",
                jquery: "1.7.2",
                length: 0,
                size: function() {
                    return this.length
                },
                toArray: function() {
                    return F.call(this, 0)
                },
                get: function(a) {
                    return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
                },
                pushStack: function(a, b, c) {
                    var d = this.constructor();
                    e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")");
                    return d
                },
                each: function(a, b) {
                    return e.each(this, a, b)
                },
                ready: function(a) {
                    e.bindReady(), A.add(a);
                    return this
                },
                eq: function(a) {
                    a = +a;
                    return a === -1 ? this.slice(a) : this.slice(a, a + 1)
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                slice: function() {
                    return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(","))
                },
                map: function(a) {
                    return this.pushStack(e.map(this, function(b, c) {
                        return a.call(b, c, b)
                    }))
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: E,
                sort: [].sort,
                splice: [].splice
            }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function() {
                var a, c, d, f, g, h, i = arguments[0] || {}, j = 1,
                    k = arguments.length,
                    l = !1;
                typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j);
                for (; j < k; j++) if ((a = arguments[j]) != null) for (c in a) {
                    d = i[c], f = a[c];
                    if (i === f) continue;
                    l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f)
                }
                return i
            }, e.extend({
                noConflict: function(b) {
                    a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f);
                    return e
                },
                isReady: !1,
                readyWait: 1,
                holdReady: function(a) {
                    a ? e.readyWait++ : e.ready(!0)
                },
                ready: function(a) {
                    if (a === !0 && !--e.readyWait || a !== !0 && !e.isReady) {
                        if (!c.body) return setTimeout(e.ready, 1);
                        e.isReady = !0;
                        if (a !== !0 && --e.readyWait > 0) return;
                        A.fireWith(c, [e]), e.fn.trigger && e(c).trigger("ready").off("ready")
                    }
                },
                bindReady: function() {
                    if (!A) {
                        A = e.Callbacks("once memory");
                        if (c.readyState === "complete") return setTimeout(e.ready, 1);
                        if (c.addEventListener) c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1);
                        else if (c.attachEvent) {
                            c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready);
                            var b = !1;
                            try {
                                b = a.frameElement == null
                            } catch (d) {}
                            c.documentElement.doScroll && b && J()
                        }
                    }
                },
                isFunction: function(a) {
                    return e.type(a) === "function"
                },
                isArray: Array.isArray || function(a) {
                    return e.type(a) === "array"
                },
                isWindow: function(a) {
                    return a != null && a == a.window
                },
                isNumeric: function(a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                },
                type: function(a) {
                    return a == null ? String(a) : I[C.call(a)] || "object"
                },
                isPlainObject: function(a) {
                    if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) return !1;
                    try {
                        if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) return !1
                    } catch (c) {
                        return !1
                    }
                    var d;
                    for (d in a);
                    return d === b || D.call(a, d)
                },
                isEmptyObject: function(a) {
                    for (var b in a) return !1;
                    return !0
                },
                error: function(a) {
                    throw new Error(a)
                },
                parseJSON: function(b) {
                    if (typeof b != "string" || !b) return null;
                    b = e.trim(b);
                    if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                    if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) return (new Function("return " + b))();
                    e.error("Invalid JSON: " + b)
                },
                parseXML: function(c) {
                    if (typeof c != "string" || !c) return null;
                    var d, f;
                    try {
                        a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
                    } catch (g) {
                        d = b
                    }(!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c);
                    return d
                },
                noop: function() {},
                globalEval: function(b) {
                    b && j.test(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    })(b)
                },
                camelCase: function(a) {
                    return a.replace(w, "ms-").replace(v, x)
                },
                nodeName: function(a, b) {
                    return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
                },
                each: function(a, c, d) {
                    var f, g = 0,
                        h = a.length,
                        i = h === b || e.isFunction(a);
                    if (d) {
                        if (i) {
                            for (f in a) if (c.apply(a[f], d) === !1) break
                        } else for (; g < h;) if (c.apply(a[g++], d) === !1) break
                    } else if (i) {
                        for (f in a) if (c.call(a[f], f, a[f]) === !1) break
                    } else for (; g < h;) if (c.call(a[g], g, a[g++]) === !1) break;
                    return a
                },
                trim: G ? function(a) {
                    return a == null ? "" : G.call(a)
                } : function(a) {
                    return a == null ? "" : (a + "").replace(k, "").replace(l, "")
                },
                makeArray: function(a, b) {
                    var c = b || [];
                    if (a != null) {
                        var d = e.type(a);
                        a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a)
                    }
                    return c
                },
                inArray: function(a, b, c) {
                    var d;
                    if (b) {
                        if (H) return H.call(b, a, c);
                        d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                        for (; c < d; c++) if (c in b && b[c] === a) return c
                    }
                    return -1
                },
                merge: function(a, c) {
                    var d = a.length,
                        e = 0;
                    if (typeof c.length == "number") for (var f = c.length; e < f; e++) a[d++] = c[e];
                    else while (c[e] !== b) a[d++] = c[e++];
                    a.length = d;
                    return a
                },
                grep: function(a, b, c) {
                    var d = [],
                        e;
                    c = !! c;
                    for (var f = 0, g = a.length; f < g; f++) e = !! b(a[f], f), c !== e && d.push(a[f]);
                    return d
                },
                map: function(a, c, d) {
                    var f, g, h = [],
                        i = 0,
                        j = a.length,
                        k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a));
                    if (k) for (; i < j; i++) f = c(a[i], i, d), f != null && (h[h.length] = f);
                    else for (g in a) f = c(a[g], g, d), f != null && (h[h.length] = f);
                    return h.concat.apply([], h)
                },
                guid: 1,
                proxy: function(a, c) {
                    if (typeof c == "string") {
                        var d = a[c];
                        c = a, a = d
                    }
                    if (!e.isFunction(a)) return b;
                    var f = F.call(arguments, 2),
                        g = function() {
                            return a.apply(c, f.concat(F.call(arguments)))
                        };
                    g.guid = a.guid = a.guid || g.guid || e.guid++;
                    return g
                },
                access: function(a, c, d, f, g, h, i) {
                    var j, k = d == null,
                        l = 0,
                        m = a.length;
                    if (d && typeof d == "object") {
                        for (l in d) e.access(a, c, l, d[l], 1, h, f);
                        g = 1
                    } else if (f !== b) {
                        j = i === b && e.isFunction(f), k && (j ? (j = c, c = function(a, b, c) {
                            return j.call(e(a), c)
                        }) : (c.call(a, f), c = null));
                        if (c) for (; l < m; l++) c(a[l], d, j ? f.call(a[l], l, c(a[l], d)) : f, i);
                        g = 1
                    }
                    return g ? a : k ? c.call(a) : m ? c(a[0], d) : h
                },
                now: function() {
                    return (new Date).getTime()
                },
                uaMatch: function(a) {
                    a = a.toLowerCase();
                    var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                    return {
                        browser: b[1] || "",
                        version: b[2] || "0"
                    }
                },
                sub: function() {
                    function a(b, c) {
                        return new a.fn.init(b, c)
                    }
                    e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function(d, f) {
                        f && f instanceof e && !(f instanceof a) && (f = a(f));
                        return e.fn.init.call(this, d, f, b)
                    }, a.fn.init.prototype = a.fn;
                    var b = a(c);
                    return a
                },
                browser: {}
            }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
                I["[object " + b + "]"] = b.toLowerCase()
            }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function() {
                c.removeEventListener("DOMContentLoaded", B, !1), e.ready()
            } : c.attachEvent && (B = function() {
                c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready())
            });
            return e
        }(),
        g = {};
    f.Callbacks = function(a) {
        a = a ? g[a] || h(a) : {};
        var c = [],
            d = [],
            e, i, j, k, l, m, n = function(b) {
                var d, e, g, h, i;
                for (d = 0, e = b.length; d < e; d++) g = b[d], h = f.type(g), h === "array" ? n(g) : h === "function" && (!a.unique || !p.has(g)) && c.push(g)
            }, o = function(b, f) {
                f = f || [], e = !a.memory || [b, f], i = !0, j = !0, m = k || 0, k = 0, l = c.length;
                for (; c && m < l; m++) if (c[m].apply(b, f) === !1 && a.stopOnFalse) {
                    e = !0;
                    break
                }
                j = !1, c && (a.once ? e === !0 ? p.disable() : c = [] : d && d.length && (e = d.shift(), p.fireWith(e[0], e[1])))
            }, p = {
                add: function() {
                    if (c) {
                        var a = c.length;
                        n(arguments), j ? l = c.length : e && e !== !0 && (k = a, o(e[0], e[1]))
                    }
                    return this
                },
                remove: function() {
                    if (c) {
                        var b = arguments,
                            d = 0,
                            e = b.length;
                        for (; d < e; d++) for (var f = 0; f < c.length; f++) if (b[d] === c[f]) {
                            j && f <= l && (l--, f <= m && m--), c.splice(f--, 1);
                            if (a.unique) break
                        }
                    }
                    return this
                },
                has: function(a) {
                    if (c) {
                        var b = 0,
                            d = c.length;
                        for (; b < d; b++) if (a === c[b]) return !0
                    }
                    return !1
                },
                empty: function() {
                    c = [];
                    return this
                },
                disable: function() {
                    c = d = e = b;
                    return this
                },
                disabled: function() {
                    return !c
                },
                lock: function() {
                    d = b, (!e || e === !0) && p.disable();
                    return this
                },
                locked: function() {
                    return !d
                },
                fireWith: function(b, c) {
                    d && (j ? a.once || d.push([b, c]) : (!a.once || !e) && o(b, c));
                    return this
                },
                fire: function() {
                    p.fireWith(this, arguments);
                    return this
                },
                fired: function() {
                    return !!i
                }
            };
        return p
    };
    var i = [].slice;
    f.extend({
        Deferred: function(a) {
            var b = f.Callbacks("once memory"),
                c = f.Callbacks("once memory"),
                d = f.Callbacks("memory"),
                e = "pending",
                g = {
                    resolve: b,
                    reject: c,
                    notify: d
                }, h = {
                    done: b.add,
                    fail: c.add,
                    progress: d.add,
                    state: function() {
                        return e
                    },
                    isResolved: b.fired,
                    isRejected: c.fired,
                    then: function(a, b, c) {
                        i.done(a).fail(b).progress(c);
                        return this
                    },
                    always: function() {
                        i.done.apply(i, arguments).fail.apply(i, arguments);
                        return this
                    },
                    pipe: function(a, b, c) {
                        return f.Deferred(function(d) {
                            f.each({
                                done: [a, "resolve"],
                                fail: [b, "reject"],
                                progress: [c, "notify"]
                            }, function(a, b) {
                                var c = b[0],
                                    e = b[1],
                                    g;
                                f.isFunction(c) ? i[a](function() {
                                    g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [g])
                                }) : i[a](d[e])
                            })
                        }).promise()
                    },
                    promise: function(a) {
                        if (a == null) a = h;
                        else for (var b in h) a[b] = h[b];
                        return a
                    }
                }, i = h.promise({}),
                j;
            for (j in g) i[j] = g[j].fire, i[j + "With"] = g[j].fireWith;
            i.done(function() {
                e = "resolved"
            }, c.disable, d.lock).fail(function() {
                e = "rejected"
            }, b.disable, d.lock), a && a.call(i, i);
            return i
        },
        when: function(a) {
            function m(a) {
                return function(b) {
                    e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e)
                }
            }
            function l(a) {
                return function(c) {
                    b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b)
                }
            }
            var b = i.call(arguments, 0),
                c = 0,
                d = b.length,
                e = Array(d),
                g = d,
                h = d,
                j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(),
                k = j.promise();
            if (d > 1) {
                for (; c < d; c++) b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g;
                g || j.resolveWith(j, b)
            } else j !== a && j.resolveWith(j, d ? [a] : []);
            return k
        }
    }), f.support = function() {
        var b, d, e, g, h, i, j, k, l, m, n, o, p = c.createElement("div"),
            q = c.documentElement;
        p.setAttribute("className", "t"), p.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = p.getElementsByTagName("*"), e = p.getElementsByTagName("a")[0];
        if (!d || !d.length || !e) return {};
        g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = p.getElementsByTagName("input")[0], b = {
            leadingWhitespace: p.firstChild.nodeType === 3,
            tbody: !p.getElementsByTagName("tbody").length,
            htmlSerialize: !! p.getElementsByTagName("link").length,
            style: /top/.test(e.getAttribute("style")),
            hrefNormalized: e.getAttribute("href") === "/a",
            opacity: /^0.55/.test(e.style.opacity),
            cssFloat: !! e.style.cssFloat,
            checkOn: i.value === "on",
            optSelected: h.selected,
            getSetAttribute: p.className !== "t",
            enctype: !! c.createElement("form").enctype,
            html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            pixelMargin: !0
        }, f.boxModel = b.boxModel = c.compatMode === "CSS1Compat", i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled;
        try {
            delete p.test
        } catch (r) {
            b.deleteExpando = !1
        }!p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", function() {
            b.noCloneEvent = !1
        }), p.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), i.setAttribute("name", "t"), p.appendChild(i), j = c.createDocumentFragment(), j.appendChild(p.lastChild), b.checkClone = j.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, j.removeChild(i), j.appendChild(p);
        if (p.attachEvent) for (n in {
            submit: 1,
            change: 1,
            focusin: 1
        }) m = "on" + n, o = m in p, o || (p.setAttribute(m, "return;"), o = typeof p[m] == "function"), b[n + "Bubbles"] = o;
        j.removeChild(p), j = g = h = p = i = null, f(function() {
            var d, e, g, h, i, j, l, m, n, q, r, s, t, u = c.getElementsByTagName("body")[0];
            !u || (m = 1, t = "padding:0;margin:0;border:", r = "position:absolute;top:0;left:0;width:1px;height:1px;", s = t + "0;visibility:hidden;", n = "style='" + r + t + "5px solid #000;", q = "<div " + n + "display:block;'><div style='" + t + "0;display:block;overflow:hidden;'></div></div>" + "<table " + n + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", d = c.createElement("div"), d.style.cssText = s + "width:0;height:0;position:static;top:0;margin-top:" + m + "px", u.insertBefore(d, u.firstChild), p = c.createElement("div"), d.appendChild(p), p.innerHTML = "<table><tr><td style='" + t + "0;display:none'></td><td>t</td></tr></table>", k = p.getElementsByTagName("td"), o = k[0].offsetHeight === 0, k[0].style.display = "", k[1].style.display = "none", b.reliableHiddenOffsets = o && k[0].offsetHeight === 0, a.getComputedStyle && (p.innerHTML = "", l = c.createElement("div"), l.style.width = "0", l.style.marginRight = "0", p.style.width = "2px", p.appendChild(l), b.reliableMarginRight = (parseInt((a.getComputedStyle(l, null) || {
                marginRight: 0
            }).marginRight, 10) || 0) === 0), typeof p.style.zoom != "undefined" && (p.innerHTML = "", p.style.width = p.style.padding = "1px", p.style.border = 0, p.style.overflow = "hidden", p.style.display = "inline", p.style.zoom = 1, b.inlineBlockNeedsLayout = p.offsetWidth === 3, p.style.display = "block", p.style.overflow = "visible", p.innerHTML = "<div style='width:5px;'></div>", b.shrinkWrapBlocks = p.offsetWidth !== 3), p.style.cssText = r + s, p.innerHTML = q, e = p.firstChild, g = e.firstChild, i = e.nextSibling.firstChild.firstChild, j = {
                doesNotAddBorder: g.offsetTop !== 5,
                doesAddBorderForTableAndCells: i.offsetTop === 5
            }, g.style.position = "fixed", g.style.top = "20px", j.fixedPosition = g.offsetTop === 20 || g.offsetTop === 15, g.style.position = g.style.top = "", e.style.overflow = "hidden", e.style.position = "relative", j.subtractsBorderForOverflowNotVisible = g.offsetTop === -5, j.doesNotIncludeMarginInBodyOffset = u.offsetTop !== m, a.getComputedStyle && (p.style.marginTop = "1%", b.pixelMargin = (a.getComputedStyle(p, null) || {
                marginTop: 0
            }).marginTop !== "1%"), typeof d.style.zoom != "undefined" && (d.style.zoom = 1), u.removeChild(d), l = p = d = null, f.extend(b, j))
        });
        return b
    }();
    var j = /^(?:\{.*\}|\[.*\])$/,
        k = /([A-Z])/g;
    f.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(a) {
            a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
            return !!a && !m(a)
        },
        data: function(a, c, d, e) {
            if ( !! f.acceptData(a)) {
                var g, h, i, j = f.expando,
                    k = typeof c == "string",
                    l = a.nodeType,
                    m = l ? f.cache : a,
                    n = l ? a[j] : a[j] && j,
                    o = c === "events";
                if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) return;
                n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop));
                if (typeof c == "object" || typeof c == "function") e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c);
                g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d);
                if (o && !h[c]) return g.events;
                k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h;
                return i
            }
        },
        removeData: function(a, b, c) {
            if ( !! f.acceptData(a)) {
                var d, e, g, h = f.expando,
                    i = a.nodeType,
                    j = i ? f.cache : a,
                    k = i ? a[h] : h;
                if (!j[k]) return;
                if (b) {
                    d = c ? j[k] : j[k].data;
                    if (d) {
                        f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                        for (e = 0, g = b.length; e < g; e++) delete d[b[e]];
                        if (!(c ? m : f.isEmptyObject)(d)) return
                    }
                }
                if (!c) {
                    delete j[k].data;
                    if (!m(j[k])) return
                }
                f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null)
            }
        },
        _data: function(a, b, c) {
            return f.data(a, b, c, !0)
        },
        acceptData: function(a) {
            if (a.nodeName) {
                var b = f.noData[a.nodeName.toLowerCase()];
                if (b) return b !== !0 && a.getAttribute("classid") === b
            }
            return !0
        }
    }), f.fn.extend({
        data: function(a, c) {
            var d, e, g, h, i, j = this[0],
                k = 0,
                m = null;
            if (a === b) {
                if (this.length) {
                    m = f.data(j);
                    if (j.nodeType === 1 && !f._data(j, "parsedAttrs")) {
                        g = j.attributes;
                        for (i = g.length; k < i; k++) h = g[k].name, h.indexOf("data-") === 0 && (h = f.camelCase(h.substring(5)), l(j, h, m[h]));
                        f._data(j, "parsedAttrs", !0)
                    }
                }
                return m
            }
            if (typeof a == "object") return this.each(function() {
                f.data(this, a)
            });
            d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!";
            return f.access(this, function(c) {
                if (c === b) {
                    m = this.triggerHandler("getData" + e, [d[0]]), m === b && j && (m = f.data(j, a), m = l(j, a, m));
                    return m === b && d[1] ? this.data(d[0]) : m
                }
                d[1] = c, this.each(function() {
                    var b = f(this);
                    b.triggerHandler("setData" + e, d), f.data(this, a, c), b.triggerHandler("changeData" + e, d)
                })
            }, null, c, arguments.length > 1, null, !1)
        },
        removeData: function(a) {
            return this.each(function() {
                f.removeData(this, a)
            })
        }
    }), f.extend({
        _mark: function(a, b) {
            a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1))
        },
        _unmark: function(a, b, c) {
            a !== !0 && (c = b, b = a, a = !1);
            if (b) {
                c = c || "fx";
                var d = c + "mark",
                    e = a ? 0 : (f._data(b, d) || 1) - 1;
                e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"))
            }
        },
        queue: function(a, b, c) {
            var d;
            if (a) {
                b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c));
                return d || []
            }
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = f.queue(a, b),
                d = c.shift(),
                e = {};
            d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function() {
                f.dequeue(a, b)
            }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"))
        }
    }), f.fn.extend({
        queue: function(a, c) {
            var d = 2;
            typeof a != "string" && (c = a, a = "fx", d--);
            if (arguments.length < d) return f.queue(this[0], a);
            return c === b ? this : this.each(function() {
                var b = f.queue(this, a, c);
                a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                f.dequeue(this, a)
            })
        },
        delay: function(a, b) {
            a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx";
            return this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d)
                }
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, c) {
            function m() {
                --h || d.resolveWith(e, [e])
            }
            typeof a != "string" && (c = a, a = b), a = a || "fx";
            var d = f.Deferred(),
                e = this,
                g = e.length,
                h = 1,
                i = a + "defer",
                j = a + "queue",
                k = a + "mark",
                l;
            while (g--) if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) h++, l.add(m);
            m();
            return d.promise(c)
        }
    });
    var o = /[\n\t\r]/g,
        p = /\s+/,
        q = /\r/g,
        r = /^(?:button|input)$/i,
        s = /^(?:button|input|object|select|textarea)$/i,
        t = /^a(?:rea)?$/i,
        u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        v = f.support.getSetAttribute,
        w, x, y;
    f.fn.extend({
        attr: function(a, b) {
            return f.access(this, f.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                f.removeAttr(this, a)
            })
        },
        prop: function(a, b) {
            return f.access(this, f.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            a = f.propFix[a] || a;
            return this.each(function() {
                try {
                    this[a] = b, delete this[a]
                } catch (c) {}
            })
        },
        addClass: function(a) {
            var b, c, d, e, g, h, i;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).addClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string") {
                b = a.split(p);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1) if (!e.className && b.length === 1) e.className = a;
                    else {
                        g = " " + e.className + " ";
                        for (h = 0, i = b.length; h < i; h++)~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ");
                        e.className = f.trim(g)
                    }
                }
            }
            return this
        },
        removeClass: function(a) {
            var c, d, e, g, h, i, j;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).removeClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string" || a === b) {
                c = (a || "").split(p);
                for (d = 0, e = this.length; d < e; d++) {
                    g = this[d];
                    if (g.nodeType === 1 && g.className) if (a) {
                        h = (" " + g.className + " ").replace(o, " ");
                        for (i = 0, j = c.length; i < j; i++) h = h.replace(" " + c[i] + " ", " ");
                        g.className = f.trim(h)
                    } else g.className = ""
                }
            }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a,
                d = typeof b == "boolean";
            if (f.isFunction(a)) return this.each(function(c) {
                f(this).toggleClass(a.call(this, c, this.className, b), b)
            });
            return this.each(function() {
                if (c === "string") {
                    var e, g = 0,
                        h = f(this),
                        i = b,
                        j = a.split(p);
                    while (e = j[g++]) i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e)
                } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || ""
            })
        },
        hasClass: function(a) {
            var b = " " + a + " ",
                c = 0,
                d = this.length;
            for (; c < d; c++) if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) return !0;
            return !1
        },
        val: function(a) {
            var c, d, e, g = this[0]; {
                if ( !! arguments.length) {
                    e = f.isFunction(a);
                    return this.each(function(d) {
                        var g = f(this),
                            h;
                        if (this.nodeType === 1) {
                            e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function(a) {
                                return a == null ? "" : a + ""
                            })), c = f.valHooks[this.type] || f.valHooks[this.nodeName.toLowerCase()];
                            if (!c || !("set" in c) || c.set(this, h, "value") === b) this.value = h
                        }
                    })
                }
                if (g) {
                    c = f.valHooks[g.type] || f.valHooks[g.nodeName.toLowerCase()];
                    if (c && "get" in c && (d = c.get(g, "value")) !== b) return d;
                    d = g.value;
                    return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d
                }
            }
        }
    }), f.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }
            },
            select: {
                get: function(a) {
                    var b, c, d, e, g = a.selectedIndex,
                        h = [],
                        i = a.options,
                        j = a.type === "select-one";
                    if (g < 0) return null;
                    c = j ? g : 0, d = j ? g + 1 : i.length;
                    for (; c < d; c++) {
                        e = i[c];
                        if (e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) {
                            b = f(e).val();
                            if (j) return b;
                            h.push(b)
                        }
                    }
                    if (j && !h.length && i.length) return f(i[g]).val();
                    return h
                },
                set: function(a, b) {
                    var c = f.makeArray(b);
                    f(a).find("option").each(function() {
                        this.selected = f.inArray(f(this).val(), c) >= 0
                    }), c.length || (a.selectedIndex = -1);
                    return c
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function(a, c, d, e) {
            var g, h, i, j = a.nodeType;
            if ( !! a && j !== 3 && j !== 8 && j !== 2) {
                if (e && c in f.attrFn) return f(a)[c](d);
                if (typeof a.getAttribute == "undefined") return f.prop(a, c, d);
                i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w));
                if (d !== b) {
                    if (d === null) {
                        f.removeAttr(a, c);
                        return
                    }
                    if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) return g;
                    a.setAttribute(c, "" + d);
                    return d
                }
                if (h && "get" in h && i && (g = h.get(a, c)) !== null) return g;
                g = a.getAttribute(c);
                return g === null ? b : g
            }
        },
        removeAttr: function(a, b) {
            var c, d, e, g, h, i = 0;
            if (b && a.nodeType === 1) {
                d = b.toLowerCase().split(p), g = d.length;
                for (; i < g; i++) e = d[i], e && (c = f.propFix[e] || e, h = u.test(e), h || f.attr(a, e, ""), a.removeAttribute(v ? e : c), h && c in a && (a[c] = !1))
            }
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed");
                    else if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) {
                        var c = a.value;
                        a.setAttribute("type", b), c && (a.value = c);
                        return b
                    }
                }
            },
            value: {
                get: function(a, b) {
                    if (w && f.nodeName(a, "button")) return w.get(a, b);
                    return b in a ? a.value : null
                },
                set: function(a, b, c) {
                    if (w && f.nodeName(a, "button")) return w.set(a, b, c);
                    a.value = b
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(a, c, d) {
            var e, g, h, i = a.nodeType;
            if ( !! a && i !== 3 && i !== 8 && i !== 2) {
                h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]);
                return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c]
            }
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b
                }
            }
        }
    }), f.attrHooks.tabindex = f.propHooks.tabIndex, x = {
        get: function(a, c) {
            var d, e = f.prop(a, c);
            return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
        },
        set: function(a, b, c) {
            var d;
            b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase()));
            return c
        }
    }, v || (y = {
        name: !0,
        id: !0,
        coords: !0
    }, w = f.valHooks.button = {
        get: function(a, c) {
            var d;
            d = a.getAttributeNode(c);
            return d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b
        },
        set: function(a, b, d) {
            var e = a.getAttributeNode(d);
            e || (e = c.createAttribute(d), a.setAttributeNode(e));
            return e.nodeValue = b + ""
        }
    }, f.attrHooks.tabindex.set = w.set, f.each(["width", "height"], function(a, b) {
        f.attrHooks[b] = f.extend(f.attrHooks[b], {
            set: function(a, c) {
                if (c === "") {
                    a.setAttribute(b, "auto");
                    return c
                }
            }
        })
    }), f.attrHooks.contenteditable = {
        get: w.get,
        set: function(a, b, c) {
            b === "" && (b = "false"), w.set(a, b, c)
        }
    }), f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function(a, c) {
        f.attrHooks[c] = f.extend(f.attrHooks[c], {
            get: function(a) {
                var d = a.getAttribute(c, 2);
                return d === null ? b : d
            }
        })
    }), f.support.style || (f.attrHooks.style = {
        get: function(a) {
            return a.style.cssText.toLowerCase() || b
        },
        set: function(a, b) {
            return a.style.cssText = "" + b
        }
    }), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {
        get: function(a) {
            var b = a.parentNode;
            b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
            return null
        }
    })), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = {
            get: function(a) {
                return a.getAttribute("value") === null ? "on" : a.value
            }
        }
    }), f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = f.extend(f.valHooks[this], {
            set: function(a, b) {
                if (f.isArray(b)) return a.checked = f.inArray(f(a).val(), b) >= 0
            }
        })
    });
    var z = /^(?:textarea|input|select)$/i,
        A = /^([^\.]*)?(?:\.(.+))?$/,
        B = /(?:^|\s)hover(\.\S+)?\b/,
        C = /^key/,
        D = /^(?:mouse|contextmenu)|click/,
        E = /^(?:focusinfocus|focusoutblur)$/,
        F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        G = function(
            a) {
            var b = F.exec(a);
            b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)"));
            return b
        }, H = function(a, b) {
            var c = a.attributes || {};
            return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value))
        }, I = function(a) {
            return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1")
        };
    f.event = {
        add: function(a, c, d, e, g) {
            var h, i, j, k, l, m, n, o, p, q, r, s;
            if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
                d.handler && (p = d, d = p.handler, g = p.selector), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function(a) {
                    return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b
                }, i.elem = a), c = f.trim(I(c)).split(" ");
                for (k = 0; k < c.length; k++) {
                    l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({
                        type: m,
                        origType: l[1],
                        data: e,
                        handler: d,
                        guid: d.guid,
                        selector: g,
                        quick: g && G(g),
                        namespace: n.join(".")
                    }, p), r = j[m];
                    if (!r) {
                        r = j[m] = [], r.delegateCount = 0;
                        if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i)
                    }
                    s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0
                }
                a = null
            }
        },
        global: {},
        remove: function(a, b, c, d, e) {
            var g = f.hasData(a) && f._data(a),
                h, i, j, k, l, m, n, o, p, q, r, s;
            if ( !! g && !! (o = g.events)) {
                b = f.trim(I(b || "")).split(" ");
                for (h = 0; h < b.length; h++) {
                    i = A.exec(b[h]) || [], j = k = i[1], l = i[2];
                    if (!j) {
                        for (j in o) f.event.remove(a, j + b[h], c, d, !0);
                        continue
                    }
                    p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                    for (n = 0; n < r.length; n++) s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s));
                    r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j])
                }
                f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0))
            }
        },
        customEvent: {
            getData: !0,
            setData: !0,
            changeData: !0
        },
        trigger: function(c, d, e, g) {
            if (!e || e.nodeType !== 3 && e.nodeType !== 8) {
                var h = c.type || c,
                    i = [],
                    j, k, l, m, n, o, p, q, r, s;
                if (E.test(h + f.event.triggered)) return;
                h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
                if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return;
                c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : "";
                if (!e) {
                    j = f.cache;
                    for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0);
                    return
                }
                c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {};
                if (p.trigger && p.trigger.apply(e, d) === !1) return;
                r = [
                    [e, p.bindType || h]
                ];
                if (!g && !p.noBubble && !f.isWindow(e)) {
                    s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null;
                    for (; m; m = m.parentNode) r.push([m, s]), n = m;
                    n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s])
                }
                for (l = 0; l < r.length && !c.isPropagationStopped(); l++) m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault();
                c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n));
                return c.result
            }
        },
        dispatch: function(c) {
            c = f.event.fix(c || a.event);
            var d = (f._data(this, "events") || {})[c.type] || [],
                e = d.delegateCount,
                g = [].slice.call(arguments, 0),
                h = !c.exclusive && !c.namespace,
                i = f.event.special[c.type] || {}, j = [],
                k, l, m, n, o, p, q, r, s, t, u;
            g[0] = c, c.delegateTarget = this;
            if (!i.preDispatch || i.preDispatch.call(this, c) !== !1) {
                if (e && (!c.button || c.type !== "click")) {
                    n = f(this), n.context = this.ownerDocument || this;
                    for (m = c.target; m != this; m = m.parentNode || this) if (m.disabled !== !0) {
                        p = {}, r = [], n[0] = m;
                        for (k = 0; k < e; k++) s = d[k], t = s.selector, p[t] === b && (p[t] = s.quick ? H(m, s.quick) : n.is(t)), p[t] && r.push(s);
                        r.length && j.push({
                            elem: m,
                            matches: r
                        })
                    }
                }
                d.length > e && j.push({
                    elem: this,
                    matches: d.slice(e)
                });
                for (k = 0; k < j.length && !c.isPropagationStopped(); k++) {
                    q = j[k], c.currentTarget = q.elem;
                    for (l = 0; l < q.matches.length && !c.isImmediatePropagationStopped(); l++) {
                        s = q.matches[l];
                        if (h || !c.namespace && !s.namespace || c.namespace_re && c.namespace_re.test(s.namespace)) c.data = s.data, c.handleObj = s, o = ((f.event.special[s.origType] || {}).handle || s.handler).apply(q.elem, g), o !== b && (c.result = o, o === !1 && (c.preventDefault(), c.stopPropagation()))
                    }
                }
                i.postDispatch && i.postDispatch.call(this, c);
                return c.result
            }
        },
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode);
                return a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, d) {
                var e, f, g, h = d.button,
                    i = d.fromElement;
                a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
                return a
            }
        },
        fix: function(a) {
            if (a[f.expando]) return a;
            var d, e, g = a,
                h = f.event.fixHooks[a.type] || {}, i = h.props ? this.props.concat(h.props) : this.props;
            a = f.Event(g);
            for (d = i.length; d;) e = i[--d], a[e] = g[e];
            a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey);
            return h.filter ? h.filter(a, g) : a
        },
        special: {
            ready: {
                setup: f.bindReady
            },
            load: {
                noBubble: !0
            },
            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },
            beforeunload: {
                setup: function(a, b, c) {
                    f.isWindow(this) && (this.onbeforeunload = c)
                },
                teardown: function(a, b) {
                    this.onbeforeunload === b && (this.onbeforeunload = null)
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = f.extend(new f.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
    }, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function(a, b, c) {
        a.detachEvent && a.detachEvent("on" + b, c)
    }, f.Event = function(a, b) {
        if (!(this instanceof f.Event)) return new f.Event(a, b);
        a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0
    }, f.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = K;
            var a = this.originalEvent;
            !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function() {
            this.isPropagationStopped = K;
            var a = this.originalEvent;
            !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = K, this.stopPropagation()
        },
        isDefaultPrevented: J,
        isPropagationStopped: J,
        isImmediatePropagationStopped: J
    }, f.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(a, b) {
        f.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c = this,
                    d = a.relatedTarget,
                    e = a.handleObj,
                    g = e.selector,
                    h;
                if (!d || d !== c && !f.contains(c, d)) a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b;
                return h
            }
        }
    }), f.support.submitBubbles || (f.event.special.submit = {
        setup: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.add(this, "click._submit keypress._submit", function(a) {
                var c = a.target,
                    d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b;
                d && !d._submit_attached && (f.event.add(d, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }), d._submit_attached = !0)
            })
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.remove(this, "._submit")
        }
    }), f.support.changeBubbles || (f.event.special.change = {
        setup: function() {
            if (z.test(this.nodeName)) {
                if (this.type === "checkbox" || this.type === "radio") f.event.add(this, "propertychange._change", function(a) {
                    a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                }), f.event.add(this, "click._change", function(a) {
                    this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0))
                });
                return !1
            }
            f.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function(a) {
                    this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0)
                }), b._change_attached = !0)
            })
        },
        handle: function(a) {
            var b = a.target;
            if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
            f.event.remove(this, "._change");
            return z.test(this.nodeName)
        }
    }), f.support.focusinBubbles || f.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var d = 0,
            e = function(a) {
                f.event.simulate(b, a.target, f.event.fix(a), !0)
            };
        f.event.special[b] = {
            setup: function() {
                d++ === 0 && c.addEventListener(a, e, !0)
            },
            teardown: function() {
                --d === 0 && c.removeEventListener(a, e, !0)
            }
        }
    }), f.fn.extend({
        on: function(a, c, d, e, g) {
            var h, i;
            if (typeof a == "object") {
                typeof c != "string" && (d = d || c, c = b);
                for (i in a) this.on(i, c, d, a[i], g);
                return this
            }
            d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
            if (e === !1) e = J;
            else if (!e) return this;
            g === 1 && (h = e, e = function(a) {
                f().off(a);
                return h.apply(this, arguments)
            }, e.guid = h.guid || (h.guid = f.guid++));
            return this.each(function() {
                f.event.add(this, a, e, d, c)
            })
        },
        one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1)
        },
        off: function(a, c, d) {
            if (a && a.preventDefault && a.handleObj) {
                var e = a.handleObj;
                f(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler);
                return this
            }
            if (typeof a == "object") {
                for (var g in a) this.off(g, c, a[g]);
                return this
            }
            if (c === !1 || typeof c == "function") d = c, c = b;
            d === !1 && (d = J);
            return this.each(function() {
                f.event.remove(this, a, d, c)
            })
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        live: function(a, b, c) {
            f(this.context).on(a, this.selector, b, c);
            return this
        },
        die: function(a, b) {
            f(this.context).off(a, this.selector || "**", b);
            return this
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c)
        },
        trigger: function(a, b) {
            return this.each(function() {
                f.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            if (this[0]) return f.event.trigger(a, b, this[0], !0)
        },
        toggle: function(a) {
            var b = arguments,
                c = a.guid || f.guid++,
                d = 0,
                e = function(c) {
                    var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
                    f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault();
                    return b[e].apply(this, arguments) || !1
                };
            e.guid = c;
            while (d < b.length) b[d++].guid = c;
            return this.click(e)
        },
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }
    }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        f.fn[b] = function(a, c) {
            c == null && (c = a, a = null);
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks)
    }),
        function() {
            function x(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            if (j.nodeType === 1) {
                                g || (j[d] = c, j.sizset = h);
                                if (typeof b != "string") {
                                    if (j === b) {
                                        k = !0;
                                        break
                                    }
                                } else if (m.filter(b, [j]).length > 0) {
                                    k = j;
                                    break
                                }
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }
            function w(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            j.nodeType === 1 && !g && (j[d] = c, j.sizset = h);
                            if (j.nodeName.toLowerCase() === b) {
                                k = j;
                                break
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }
            var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                d = "sizcache" + (Math.random() + "").replace(".", ""),
                e = 0,
                g = Object.prototype.toString,
                h = !1,
                i = !0,
                j = /\\/g,
                k = /\r\n/g,
                l = /\W/;
            [0, 0].sort(function() {
                i = !1;
                return 0
            });
            var m = function(b, d, e, f) {
                e = e || [], d = d || c;
                var h = d;
                if (d.nodeType !== 1 && d.nodeType !== 9) return [];
                if (!b || typeof b != "string") return e;
                var i, j, k, l, n, q, r, t, u = !0,
                    v = m.isXML(d),
                    w = [],
                    x = b;
                do {
                    a.exec(""), i = a.exec(x);
                    if (i) {
                        x = i[3], w.push(i[1]);
                        if (i[2]) {
                            l = i[3];
                            break
                        }
                    }
                } while (i);
                if (w.length > 1 && p.exec(b)) if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f);
                else {
                    j = o.relative[w[0]] ? [d] : m(w.shift(), d);
                    while (w.length) b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f)
                } else {
                    !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]);
                    if (d) {
                        n = f ? {
                            expr: w.pop(),
                            set: s(f)
                        } : m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode : d, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1;
                        while (w.length) q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v)
                    } else k = w = []
                }
                k || (k = j), k || m.error(q || b);
                if (g.call(k) === "[object Array]") if (!u) e.push.apply(e, k);
                else if (d && d.nodeType === 1) for (t = 0; k[t] != null; t++) k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t]);
                else for (t = 0; k[t] != null; t++) k[t] && k[t].nodeType === 1 && e.push(j[t]);
                else s(k, e);
                l && (m(l, h, e, f), m.uniqueSort(e));
                return e
            };
            m.uniqueSort = function(a) {
                if (u) {
                    h = i, a.sort(u);
                    if (h) for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1)
                }
                return a
            }, m.matches = function(a, b) {
                return m(a, null, null, b)
            }, m.matchesSelector = function(a, b) {
                return m(b, null, null, [a]).length > 0
            }, m.find = function(a, b, c) {
                var d, e, f, g, h, i;
                if (!a) return [];
                for (e = 0, f = o.order.length; e < f; e++) {
                    h = o.order[e];
                    if (g = o.leftMatch[h].exec(a)) {
                        i = g[1], g.splice(1, 1);
                        if (i.substr(i.length - 1) !== "\\") {
                            g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c);
                            if (d != null) {
                                a = a.replace(o.match[h], "");
                                break
                            }
                        }
                    }
                }
                d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []);
                return {
                    set: d,
                    expr: a
                }
            }, m.filter = function(a, c, d, e) {
                var f, g, h, i, j, k, l, n, p, q = a,
                    r = [],
                    s = c,
                    t = c && c[0] && m.isXML(c[0]);
                while (a && c.length) {
                    for (h in o.filter) if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                        k = o.filter[h], l = f[1], g = !1, f.splice(1, 1);
                        if (l.substr(l.length - 1) === "\\") continue;
                        s === r && (r = []);
                        if (o.preFilter[h]) {
                            f = o.preFilter[h](f, s, d, r, e, t);
                            if (!f) g = i = !0;
                            else if (f === !0) continue
                        }
                        if (f) for (n = 0;
                                    (j = s[n]) != null; n++) j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0));
                        if (i !== b) {
                            d || (s = r), a = a.replace(o.match[h], "");
                            if (!g) return [];
                            break
                        }
                    }
                    if (a === q) if (g == null) m.error(a);
                    else break;
                    q = a
                }
                return s
            }, m.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            };
            var n = m.getText = function(a) {
                    var b, c, d = a.nodeType,
                        e = "";
                    if (d) {
                        if (d === 1 || d === 9 || d === 11) {
                            if (typeof a.textContent == "string") return a.textContent;
                            if (typeof a.innerText == "string") return a.innerText.replace(k, "");
                            for (a = a.firstChild; a; a = a.nextSibling) e += n(a)
                        } else if (d === 3 || d === 4) return a.nodeValue
                    } else for (b = 0; c = a[b]; b++) c.nodeType !== 8 && (e += n(c));
                    return e
                }, o = m.selectors = {
                    order: ["ID", "NAME", "TAG"],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                    },
                    leftMatch: {},
                    attrMap: {
                        "class": "className",
                        "for": "htmlFor"
                    },
                    attrHandle: {
                        href: function(a) {
                            return a.getAttribute("href")
                        },
                        type: function(a) {
                            return a.getAttribute("type")
                        }
                    },
                    relative: {
                        "+": function(a, b) {
                            var c = typeof b == "string",
                                d = c && !l.test(b),
                                e = c && !d;
                            d && (b = b.toLowerCase());
                            for (var f = 0, g = a.length, h; f < g; f++) if (h = a[f]) {
                                while ((h = h.previousSibling) && h.nodeType !== 1);
                                a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
                            }
                            e && m.filter(b, a, !0)
                        },
                        ">": function(a, b) {
                            var c, d = typeof b == "string",
                                e = 0,
                                f = a.length;
                            if (d && !l.test(b)) {
                                b = b.toLowerCase();
                                for (; e < f; e++) {
                                    c = a[e];
                                    if (c) {
                                        var g = c.parentNode;
                                        a[e] = g.nodeName.toLowerCase() === b ? g : !1
                                    }
                                }
                            } else {
                                for (; e < f; e++) c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b);
                                d && m.filter(b, a, !0)
                            }
                        },
                        "": function(a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c)
                        },
                        "~": function(a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c)
                        }
                    },
                    find: {
                        ID: function(a, b, c) {
                            if (typeof b.getElementById != "undefined" && !c) {
                                var d = b.getElementById(a[1]);
                                return d && d.parentNode ? [d] : []
                            }
                        },
                        NAME: function(a, b) {
                            if (typeof b.getElementsByName != "undefined") {
                                var c = [],
                                    d = b.getElementsByName(a[1]);
                                for (var e = 0, f = d.length; e < f; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]);
                                return c.length === 0 ? null : c
                            }
                        },
                        TAG: function(a, b) {
                            if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1])
                        }
                    },
                    preFilter: {
                        CLASS: function(a, b, c, d, e, f) {
                            a = " " + a[1].replace(j, "") + " ";
                            if (f) return a;
                            for (var g = 0, h;
                                 (h = b[g]) != null; g++) h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                            return !1
                        },
                        ID: function(a) {
                            return a[1].replace(j, "")
                        },
                        TAG: function(a, b) {
                            return a[1].replace(j, "").toLowerCase()
                        },
                        CHILD: function(a) {
                            if (a[1] === "nth") {
                                a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
                                var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                                a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
                            } else a[2] && m.error(a[0]);
                            a[0] = e++;
                            return a
                        },
                        ATTR: function(a, b, c, d, e, f) {
                            var g = a[1] = a[1].replace(j, "");
                            !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " ");
                            return a
                        },
                        PSEUDO: function(b, c, d, e, f) {
                            if (b[1] === "not") if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) b[3] = m(b[3], null, null, c);
                            else {
                                var g = m.filter(b[3], c, d, !0 ^ f);
                                d || e.push.apply(e, g);
                                return !1
                            } else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return !0;
                            return b
                        },
                        POS: function(a) {
                            a.unshift(!0);
                            return a
                        }
                    },
                    filters: {
                        enabled: function(a) {
                            return a.disabled === !1 && a.type !== "hidden"
                        },
                        disabled: function(a) {
                            return a.disabled === !0
                        },
                        checked: function(a) {
                            return a.checked === !0
                        },
                        selected: function(a) {
                            a.parentNode && a.parentNode.selectedIndex;
                            return a.selected === !0
                        },
                        parent: function(a) {
                            return !!a.firstChild
                        },
                        empty: function(a) {
                            return !a.firstChild
                        },
                        has: function(a, b, c) {
                            return !!m(c[3], a).length
                        },
                        header: function(a) {
                            return /h\d/i.test(a.nodeName)
                        },
                        text: function(a) {
                            var b = a.getAttribute("type"),
                                c = a.type;
                            return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null)
                        },
                        radio: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "radio" === a.type
                        },
                        checkbox: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
                        },
                        file: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "file" === a.type
                        },
                        password: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "password" === a.type
                        },
                        submit: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "submit" === a.type
                        },
                        image: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "image" === a.type
                        },
                        reset: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "reset" === a.type
                        },
                        button: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return b === "input" && "button" === a.type || b === "button"
                        },
                        input: function(a) {
                            return /input|select|textarea|button/i.test(a.nodeName)
                        },
                        focus: function(a) {
                            return a === a.ownerDocument.activeElement
                        }
                    },
                    setFilters: {
                        first: function(a, b) {
                            return b === 0
                        },
                        last: function(a, b, c, d) {
                            return b === d.length - 1
                        },
                        even: function(a, b) {
                            return b % 2 === 0
                        },
                        odd: function(a, b) {
                            return b % 2 === 1
                        },
                        lt: function(a, b, c) {
                            return b < c[3] - 0
                        },
                        gt: function(a, b, c) {
                            return b > c[3] - 0
                        },
                        nth: function(a, b, c) {
                            return c[3] - 0 === b
                        },
                        eq: function(a, b, c) {
                            return c[3] - 0 === b
                        }
                    },
                    filter: {
                        PSEUDO: function(a, b, c, d) {
                            var e = b[1],
                                f = o.filters[e];
                            if (f) return f(a, c, b, d);
                            if (e === "contains") return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0;
                            if (e === "not") {
                                var g = b[3];
                                for (var h = 0, i = g.length; h < i; h++) if (g[h] === a) return !1;
                                return !0
                            }
                            m.error(e)
                        },
                        CHILD: function(a, b) {
                            var c, e, f, g, h, i, j, k = b[1],
                                l = a;
                            switch (k) {
                                case "only":
                                case "first":
                                    while (l = l.previousSibling) if (l.nodeType === 1) return !1;
                                    if (k === "first") return !0;
                                    l = a;
                                case "last":
                                    while (l = l.nextSibling) if (l.nodeType === 1) return !1;
                                    return !0;
                                case "nth":
                                    c = b[2], e = b[3];
                                    if (c === 1 && e === 0) return !0;
                                    f = b[0], g = a.parentNode;
                                    if (g && (g[d] !== f || !a.nodeIndex)) {
                                        i = 0;
                                        for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i);
                                        g[d] = f
                                    }
                                    j = a.nodeIndex - e;
                                    return c === 0 ? j === 0 : j % c === 0 && j / c >= 0
                            }
                        },
                        ID: function(a, b) {
                            return a.nodeType === 1 && a.getAttribute("id") === b
                        },
                        TAG: function(a, b) {
                            return b === "*" && a.nodeType === 1 || !! a.nodeName && a.nodeName.toLowerCase() === b
                        },
                        CLASS: function(a, b) {
                            return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                        },
                        ATTR: function(a, b) {
                            var c = b[1],
                                d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c),
                                e = d + "",
                                f = b[2],
                                g = b[4];
                            return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1
                        },
                        POS: function(a, b, c, d) {
                            var e = b[2],
                                f = o.setFilters[e];
                            if (f) return f(a, c, b, d)
                        }
                    }
                }, p = o.match.POS,
                q = function(a, b) {
                    return "\\" + (b - 0 + 1)
                };
            for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q));
            o.match.globalPOS = p;
            var s = function(a, b) {
                a = Array.prototype.slice.call(a, 0);
                if (b) {
                    b.push.apply(b, a);
                    return b
                }
                return a
            };
            try {
                Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType
            } catch (t) {
                s = function(a, b) {
                    var c = 0,
                        d = b || [];
                    if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a);
                    else if (typeof a.length == "number") for (var e = a.length; c < e; c++) d.push(a[c]);
                    else for (; a[c]; c++) d.push(a[c]);
                    return d
                }
            }
            var u, v;
            c.documentElement.compareDocumentPosition ? u = function(a, b) {
                if (a === b) {
                    h = !0;
                    return 0
                }
                if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1;
                return a.compareDocumentPosition(b) & 4 ? -1 : 1
            } : (u = function(a, b) {
                if (a === b) {
                    h = !0;
                    return 0
                }
                if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
                var c, d, e = [],
                    f = [],
                    g = a.parentNode,
                    i = b.parentNode,
                    j = g;
                if (g === i) return v(a, b);
                if (!g) return -1;
                if (!i) return 1;
                while (j) e.unshift(j), j = j.parentNode;
                j = i;
                while (j) f.unshift(j), j = j.parentNode;
                c = e.length, d = f.length;
                for (var k = 0; k < c && k < d; k++) if (e[k] !== f[k]) return v(e[k], f[k]);
                return k === c ? v(a, f[k], -1) : v(e[k], b, 1)
            }, v = function(a, b, c) {
                if (a === b) return c;
                var d = a.nextSibling;
                while (d) {
                    if (d === b) return -1;
                    d = d.nextSibling
                }
                return 1
            }),
                function() {
                    var a = c.createElement("div"),
                        d = "script" + (new Date).getTime(),
                        e = c.documentElement;
                    a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function(a, c, d) {
                        if (typeof c.getElementById != "undefined" && !d) {
                            var e = c.getElementById(a[1]);
                            return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : []
                        }
                    }, o.filter.ID = function(a, b) {
                        var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
                        return a.nodeType === 1 && c && c.nodeValue === b
                    }), e.removeChild(a), e = a = null
                }(),
                function() {
                    var a = c.createElement("div");
                    a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function(a, b) {
                        var c = b.getElementsByTagName(a[1]);
                        if (a[1] === "*") {
                            var d = [];
                            for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]);
                            c = d
                        }
                        return c
                    }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function(a) {
                        return a.getAttribute("href", 2)
                    }), a = null
                }(), c.querySelectorAll && function() {
                var a = m,
                    b = c.createElement("div"),
                    d = "__sizzle__";
                b.innerHTML = "<p class='TEST'></p>";
                if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
                    m = function(b, e, f, g) {
                        e = e || c;
                        if (!g && !m.isXML(e)) {
                            var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                            if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                                if (h[1]) return s(e.getElementsByTagName(b), f);
                                if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f)
                            }
                            if (e.nodeType === 9) {
                                if (b === "body" && e.body) return s([e.body], f);
                                if (h && h[3]) {
                                    var i = e.getElementById(h[3]);
                                    if (!i || !i.parentNode) return s([], f);
                                    if (i.id === h[3]) return s([i], f)
                                }
                                try {
                                    return s(e.querySelectorAll(b), f)
                                } catch (j) {}
                            } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") {
                                var k = e,
                                    l = e.getAttribute("id"),
                                    n = l || d,
                                    p = e.parentNode,
                                    q = /^\s*[+~]/.test(b);
                                l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode);
                                try {
                                    if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f)
                                } catch (r) {} finally {
                                    l || k.removeAttribute("id")
                                }
                            }
                        }
                        return a(b, e, f, g)
                    };
                    for (var e in a) m[e] = a[e];
                    b = null
                }
            }(),
                function() {
                    var a = c.documentElement,
                        b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
                    if (b) {
                        var d = !b.call(c.createElement("div"), "div"),
                            e = !1;
                        try {
                            b.call(c.documentElement, "[test!='']:sizzle")
                        } catch (f) {
                            e = !0
                        }
                        m.matchesSelector = function(a, c) {
                            c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                            if (!m.isXML(a)) try {
                                if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) {
                                    var f = b.call(a, c);
                                    if (f || !d || a.document && a.document.nodeType !== 11) return f
                                }
                            } catch (g) {}
                            return m(c, null, null, [a]).length > 0
                        }
                    }
                }(),
                function() {
                    var a = c.createElement("div");
                    a.innerHTML = "<div class='test e'></div><div class='test'></div>";
                    if ( !! a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
                        a.lastChild.className = "e";
                        if (a.getElementsByClassName("e").length === 1) return;
                        o.order.splice(1, 0, "CLASS"), o.find.CLASS = function(a, b, c) {
                            if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1])
                        }, a = null
                    }
                }(), c.documentElement.contains ? m.contains = function(a, b) {
                return a !== b && (a.contains ? a.contains(b) : !0)
            } : c.documentElement.compareDocumentPosition ? m.contains = function(a, b) {
                return !!(a.compareDocumentPosition(b) & 16)
            } : m.contains = function() {
                return !1
            }, m.isXML = function(a) {
                var b = (a ? a.ownerDocument || a : 0).documentElement;
                return b ? b.nodeName !== "HTML" : !1
            };
            var y = function(a, b, c) {
                var d, e = [],
                    f = "",
                    g = b.nodeType ? [b] : b;
                while (d = o.match.PSEUDO.exec(a)) f += d[0], a = a.replace(o.match.PSEUDO, "");
                a = o.relative[a] ? a + "*" : a;
                for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c);
                return m.filter(f, e)
            };
            m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains
        }();
    var L = /Until$/,
        M = /^(?:parents|prevUntil|prevAll)/,
        N = /,/,
        O = /^.[^:#\[\.,]*$/,
        P = Array.prototype.slice,
        Q = f.expr.match.globalPOS,
        R = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    f.fn.extend({
        find: function(a) {
            var b = this,
                c, d;
            if (typeof a != "string") return f(a).filter(function() {
                for (c = 0, d = b.length; c < d; c++) if (f.contains(b[c], this)) return !0
            });
            var e = this.pushStack("", "find", a),
                g, h, i;
            for (c = 0, d = this.length; c < d; c++) {
                g = e.length, f.find(a, this[c], e);
                if (c > 0) for (h = g; h < e.length; h++) for (i = 0; i < g; i++) if (e[i] === e[h]) {
                    e.splice(h--, 1);
                    break
                }
            }
            return e
        },
        has: function(a) {
            var b = f(a);
            return this.filter(function() {
                for (var a = 0, c = b.length; a < c; a++) if (f.contains(this, b[a])) return !0
            })
        },
        not: function(a) {
            return this.pushStack(T(this, a, !1), "not", a)
        },
        filter: function(a) {
            return this.pushStack(T(this, a, !0), "filter", a)
        },
        is: function(a) {
            return !!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0)
        },
        closest: function(a, b) {
            var c = [],
                d, e, g = this[0];
            if (f.isArray(a)) {
                var h = 1;
                while (g && g.ownerDocument && g !== b) {
                    for (d = 0; d < a.length; d++) f(g).is(a[d]) && c.push({
                        selector: a[d],
                        elem: g,
                        level: h
                    });
                    g = g.parentNode, h++
                }
                return c
            }
            var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
            for (d = 0, e = this.length; d < e; d++) {
                g = this[d];
                while (g) {
                    if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
                        c.push(g);
                        break
                    }
                    g = g.parentNode;
                    if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break
                }
            }
            c = c.length > 1 ? f.unique(c) : c;
            return this.pushStack(c, "closest", a)
        },
        index: function(a) {
            if (!a) return this[0] && this[0].parentNode ? this.prevAll().length : -1;
            if (typeof a == "string") return f.inArray(this[0], f(a));
            return f.inArray(a.jquery ? a[0] : a, this)
        },
        add: function(a, b) {
            var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a),
                d = f.merge(this.get(), c);
            return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        }
    }), f.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null
        },
        parents: function(a) {
            return f.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return f.dir(a, "parentNode", c)
        },
        next: function(a) {
            return f.nth(a, 2, "nextSibling")
        },
        prev: function(a) {
            return f.nth(a, 2, "previousSibling")
        },
        nextAll: function(a) {
            return f.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return f.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return f.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return f.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return f.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return f.sibling(a.firstChild)
        },
        contents: function(a) {
            return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes)
        }
    }, function(a, b) {
        f.fn[a] = function(c, d) {
            var e = f.map(this, b, c);
            L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
            return this.pushStack(e, a, P.call(arguments).join(","))
        }
    }), f.extend({
        filter: function(a, b, c) {
            c && (a = ":not(" + a + ")");
            return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b)
        },
        dir: function(a, c, d) {
            var e = [],
                g = a[c];
            while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g), g = g[c];
            return e
        },
        nth: function(a, b, c, d) {
            b = b || 1;
            var e = 0;
            for (; a; a = a[c]) if (a.nodeType === 1 && ++e === b) break;
            return a
        },
        sibling: function(a, b) {
            var c = [];
            for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
            return c
        }
    });
    var V = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        W = / jQuery\d+="(?:\d+|null)"/g,
        X = /^\s+/,
        Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        Z = /<([\w:]+)/,
        $ = /<tbody/i,
        _ = /<|&#?\w+;/,
        ba = /<(?:script|style)/i,
        bb = /<(?:script|object|embed|option|style)/i,
        bc = new RegExp("<(?:" + V + ")[\\s/>]", "i"),
        bd = /checked\s*(?:[^=]|=\s*.checked.)/i,
        be = /\/(java|ecma)script/i,
        bf = /^\s*<!(?:\[CDATA\[|\-\-)/,
        bg = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        }, bh = U(c);
    bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]), f.fn.extend({
        text: function(a) {
            return f.access(this, function(a) {
                return a === b ? f.text(this) : this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a))
            }, null, a, arguments.length)
        },
        wrapAll: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).wrapInner(a.call(this, b))
            });
            return this.each(function() {
                var b = f(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = f.isFunction(a);
            return this.each(function(c) {
                f(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild)
            })
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this)
            });
            if (arguments.length) {
                var a = f.clean(arguments);
                a.push.apply(a, this.toArray());
                return this.pushStack(a, "before", arguments)
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this.nextSibling)
            });
            if (arguments.length) {
                var a = this.pushStack(this, "after", arguments);
                a.push.apply(a, f.clean(arguments));
                return a
            }
        },
        remove: function(a, b) {
            for (var c = 0, d;
                 (d = this[c]) != null; c++) if (!a || f.filter(a, [d]).length)!b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d);
            return this
        },
        empty: function() {
            for (var a = 0, b;
                 (b = this[a]) != null; a++) {
                b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
                while (b.firstChild) b.removeChild(b.firstChild)
            }
            return this
        },
        clone: function(a, b) {
            a = a == null ? !1 : a, b = b == null ? a : b;
            return this.map(function() {
                return f.clone(this, a, b)
            })
        },
        html: function(a) {
            return f.access(this, function(a) {
                var c = this[0] || {}, d = 0,
                    e = this.length;
                if (a === b) return c.nodeType === 1 ? c.innerHTML.replace(W, "") : null;
                if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(Y, "<$1></$2>");
                    try {
                        for (; d < e; d++) c = this[d] || {}, c.nodeType === 1 && (f.cleanData(c.getElementsByTagName("*")), c.innerHTML = a);
                        c = 0
                    } catch (g) {}
                }
                c && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function(a) {
            if (this[0] && this[0].parentNode) {
                if (f.isFunction(a)) return this.each(function(b) {
                    var c = f(this),
                        d = c.html();
                    c.replaceWith(a.call(this, b, d))
                });
                typeof a != "string" && (a = f(a).detach());
                return this.each(function() {
                    var b = this.nextSibling,
                        c = this.parentNode;
                    f(this).remove(), b ? f(b).before(a) : f(c).append(a)
                })
            }
            return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, c, d) {
            var e, g, h, i, j = a[0],
                k = [];
            if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) return this.each(function() {
                f(this).domManip(a, c, d, !0)
            });
            if (f.isFunction(j)) return this.each(function(e) {
                var g = f(this);
                a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d)
            });
            if (this[0]) {
                i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = {
                    fragment: i
                } : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild;
                if (g) {
                    c = c && f.nodeName(g, "tr");
                    for (var l = 0, m = this.length, n = m - 1; l < m; l++) d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h)
                }
                k.length && f.each(k, function(a, b) {
                    b.src ? f.ajax({
                        type: "GET",
                        global: !1,
                        url: b.src,
                        async: !1,
                        dataType: "script"
                    }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b)
                })
            }
            return this
        }
    }), f.buildFragment = function(a, b, d) {
        var e, g, h, i, j = a[0];
        b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1);
        return {
            fragment: e,
            cacheable: g
        }
    }, f.fragments = {}, f.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        f.fn[a] = function(c) {
            var d = [],
                e = f(c),
                g = this.length === 1 && this[0].parentNode;
            if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) {
                e[b](this[0]);
                return this
            }
            for (var h = 0, i = e.length; h < i; h++) {
                var j = (h > 0 ? this.clone(!0) : this).get();
                f(e[h])[b](j), d = d.concat(j)
            }
            return this.pushStack(d, a, e.selector)
        }
    }), f.extend({
        clone: function(a, b, c) {
            var d, e, g, h = f.support.html5Clone || f.isXMLDoc(a) || !bc.test("<" + a.nodeName + ">") ? a.cloneNode(!0) : bo(a);
            if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
                bk(a, h), d = bl(a), e = bl(h);
                for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g])
            }
            if (b) {
                bj(a, h);
                if (c) {
                    d = bl(a), e = bl(h);
                    for (g = 0; d[g]; ++g) bj(d[g], e[g])
                }
            }
            d = e = null;
            return h
        },
        clean: function(a, b, d, e) {
            var g, h, i, j = [];
            b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
            for (var k = 0, l;
                 (l = a[k]) != null; k++) {
                typeof l == "number" && (l += "");
                if (!l) continue;
                if (typeof l == "string") if (!_.test(l)) l = b.createTextNode(l);
                else {
                    l = l.replace(Y, "<$1></$2>");
                    var m = (Z.exec(l) || ["", ""])[1].toLowerCase(),
                        n = bg[m] || bg._default,
                        o = n[0],
                        p = b.createElement("div"),
                        q = bh.childNodes,
                        r;
                    b === c ? bh.appendChild(p) : U(b).appendChild(p), p.innerHTML = n[1] + l + n[2];
                    while (o--) p = p.lastChild;
                    if (!f.support.tbody) {
                        var s = $.test(l),
                            t = m === "table" && !s ? p.firstChild && p.firstChild.childNodes : n[1] === "<table>" && !s ? p.childNodes : [];
                        for (i = t.length - 1; i >= 0; --i) f.nodeName(t[i], "tbody") && !t[i].childNodes.length && t[i].parentNode.removeChild(t[i])
                    }!f.support.leadingWhitespace && X.test(l) && p.insertBefore(b.createTextNode(X.exec(l)[0]), p.firstChild), l = p.childNodes, p && (p.parentNode.removeChild(p), q.length > 0 && (r = q[q.length - 1], r && r.parentNode && r.parentNode.removeChild(r)))
                }
                var u;
                if (!f.support.appendChecked) if (l[0] && typeof(u = l.length) == "number") for (i = 0; i < u; i++) bn(l[i]);
                else bn(l);
                l.nodeType ? j.push(l) : j = f.merge(j, l)
            }
            if (d) {
                g = function(a) {
                    return !a.type || be.test(a.type)
                };
                for (k = 0; j[k]; k++) {
                    h = j[k];
                    if (e && f.nodeName(h, "script") && (!h.type || be.test(h.type))) e.push(h.parentNode ? h.parentNode.removeChild(h) : h);
                    else {
                        if (h.nodeType === 1) {
                            var v = f.grep(h.getElementsByTagName("script"), g);
                            j.splice.apply(j, [k + 1, 0].concat(v))
                        }
                        d.appendChild(h)
                    }
                }
            }
            return j
        },
        cleanData: function(a) {
            var b, c, d = f.cache,
                e = f.event.special,
                g = f.support.deleteExpando;
            for (var h = 0, i;
                 (i = a[h]) != null; h++) {
                if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue;
                c = i[f.expando];
                if (c) {
                    b = d[c];
                    if (b && b.events) {
                        for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle);
                        b.handle && (b.handle.elem = null)
                    }
                    g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c]
                }
            }
        }
    });
    var bp = /alpha\([^)]*\)/i,
        bq = /opacity=([^)]*)/,
        br = /([A-Z]|^ms)/g,
        bs = /^[\-+]?(?:\d*\.)?\d+$/i,
        bt = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
        bu = /^([\-+])=([\-+.\de]+)/,
        bv = /^margin/,
        bw = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, bx = ["Top", "Right", "Bottom", "Left"],
        by, bz, bA;
    f.fn.css = function(a, c) {
        return f.access(this, function(a, c, d) {
            return d !== b ? f.style(a, c, d) : f.css(a, c)
        }, a, c, arguments.length > 1)
    }, f.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = by(a, "opacity");
                        return c === "" ? "1" : c
                    }
                    return a.style.opacity
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": f.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, c, d, e) {
            if ( !! a && a.nodeType !== 3 && a.nodeType !== 8 && !! a.style) {
                var g, h, i = f.camelCase(c),
                    j = a.style,
                    k = f.cssHooks[i];
                c = f.cssProps[i] || i;
                if (d === b) {
                    if (k && "get" in k && (g = k.get(a, !1, e)) !== b) return g;
                    return j[c]
                }
                h = typeof d, h === "string" && (g = bu.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number");
                if (d == null || h === "number" && isNaN(d)) return;
                h === "number" && !f.cssNumber[i] && (d += "px");
                if (!k || !("set" in k) || (d = k.set(a, d)) !== b) try {
                    j[c] = d
                } catch (l) {}
            }
        },
        css: function(a, c, d) {
            var e, g;
            c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float");
            if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e;
            if (by) return by(a, c)
        },
        swap: function(a, b, c) {
            var d = {}, e, f;
            for (f in b) d[f] = a.style[f], a.style[f] = b[f];
            e = c.call(a);
            for (f in b) a.style[f] = d[f];
            return e
        }
    }), f.curCSS = f.css, c.defaultView && c.defaultView.getComputedStyle && (bz = function(a, b) {
        var c, d, e, g, h = a.style;
        b = b.replace(br, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b))), !f.support.pixelMargin && e && bv.test(b) && bt.test(c) && (g = h.width, h.width = c, c = e.width, h.width = g);
        return c
    }), c.documentElement.currentStyle && (bA = function(a, b) {
        var c, d, e, f = a.currentStyle && a.currentStyle[b],
            g = a.style;
        f == null && g && (e = g[b]) && (f = e), bt.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d));
        return f === "" ? "auto" : f
    }), by = bz || bA, f.each(["height", "width"], function(a, b) {
        f.cssHooks[b] = {
            get: function(a, c, d) {
                if (c) return a.offsetWidth !== 0 ? bB(a, b, d) : f.swap(a, bw, function() {
                    return bB(a, b, d)
                })
            },
            set: function(a, b) {
                return bs.test(b) ? b + "px" : b
            }
        }
    }), f.support.opacity || (f.cssHooks.opacity = {
        get: function(a, b) {
            return bq.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "",
                g = d && d.filter || c.filter || "";
            c.zoom = 1;
            if (b >= 1 && f.trim(g.replace(bp, "")) === "") {
                c.removeAttribute("filter");
                if (d && !d.filter) return
            }
            c.filter = bp.test(g) ? g.replace(bp, e) : g + " " + e
        }
    }), f(function() {
        f.support.reliableMarginRight || (f.cssHooks.marginRight = {
            get: function(a, b) {
                return f.swap(a, {
                    display: "inline-block"
                }, function() {
                    return b ? by(a, "margin-right") : a.style.marginRight
                })
            }
        })
    }), f.expr && f.expr.filters && (f.expr.filters.hidden = function(a) {
        var b = a.offsetWidth,
            c = a.offsetHeight;
        return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none"
    }, f.expr.filters.visible = function(a) {
        return !f.expr.filters.hidden(a)
    }), f.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        f.cssHooks[a + b] = {
            expand: function(c) {
                var d, e = typeof c == "string" ? c.split(" ") : [c],
                    f = {};
                for (d = 0; d < 4; d++) f[a + bx[d] + b] = e[d] || e[d - 2] || e[0];
                return f
            }
        }
    });
    var bC = /%20/g,
        bD = /\[\]$/,
        bE = /\r?\n/g,
        bF = /#.*$/,
        bG = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        bH = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        bI = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        bJ = /^(?:GET|HEAD)$/,
        bK = /^\/\//,
        bL = /\?/,
        bM = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        bN = /^(?:select|textarea)/i,
        bO = /\s+/,
        bP = /([?&])_=[^&]*/,
        bQ = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        bR = f.fn.load,
        bS = {}, bT = {}, bU, bV, bW = ["*/"] + ["*"];
    try {
        bU = e.href
    } catch (bX) {
        bU = c.createElement("a"), bU.href = "", bU = bU.href
    }
    bV = bQ.exec(bU.toLowerCase()) || [], f.fn.extend({
        load: function(a, c, d) {
            if (typeof a != "string" && bR) return bR.apply(this, arguments);
            if (!this.length) return this;
            var e = a.indexOf(" ");
            if (e >= 0) {
                var g = a.slice(e, a.length);
                a = a.slice(0, e)
            }
            var h = "GET";
            c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST"));
            var i = this;
            f.ajax({
                url: a,
                type: h,
                dataType: "html",
                data: c,
                complete: function(a, b, c) {
                    c = a.responseText, a.isResolved() && (a.done(function(a) {
                        c = a
                    }), i.html(g ? f("<div>").append(c.replace(bM, "")).find(g) : c)), d && i.each(d, [c, b, a])
                }
            });
            return this
        },
        serialize: function() {
            return f.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? f.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || bN.test(this.nodeName) || bH.test(this.type))
            }).map(function(a, b) {
                var c = f(this).val();
                return c == null ? null : f.isArray(c) ? f.map(c, function(a, c) {
                    return {
                        name: b.name,
                        value: a.replace(bE, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(bE, "\r\n")
                }
            }).get()
        }
    }), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        f.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), f.each(["get", "post"], function(a, c) {
        f[c] = function(a, d, e, g) {
            f.isFunction(d) && (g = g || e, e = d, d = b);
            return f.ajax({
                type: c,
                url: a,
                data: d,
                success: e,
                dataType: g
            })
        }
    }), f.extend({
        getScript: function(a, c) {
            return f.get(a, b, c, "script")
        },
        getJSON: function(a, b, c) {
            return f.get(a, b, c, "json")
        },
        ajaxSetup: function(a, b) {
            b ? b$(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b$(a, b);
            return a
        },
        ajaxSettings: {
            url: bU,
            isLocal: bI.test(bV[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": bW
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": a.String,
                "text html": !0,
                "text json": f.parseJSON,
                "text xml": f.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: bY(bS),
        ajaxTransport: bY(bT),
        ajax: function(a, c) {
            function w(a, c, l, m) {
                if (s !== 2) {
                    s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0;
                    var o, r, u, w = c,
                        x = l ? ca(d, v, l) : b,
                        y, z;
                    if (a >= 200 && a < 300 || a === 304) {
                        if (d.ifModified) {
                            if (y = v.getResponseHeader("Last-Modified")) f.lastModified[k] = y;
                            if (z = v.getResponseHeader("Etag")) f.etag[k] = z
                        }
                        if (a === 304) w = "notmodified", o = !0;
                        else try {
                            r = cb(d, x), w = "success", o = !0
                        } catch (A) {
                            w = "parsererror", u = A
                        }
                    } else {
                        u = w;
                        if (!w || a) w = "error", a < 0 && (a = 0)
                    }
                    v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [v, d, o ? r : u]), i.fireWith(e, [v, w]), t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop"))
                }
            }
            typeof a == "object" && (c = a, a = b), c = c || {};
            var d = f.ajaxSetup({}, c),
                e = d.context || d,
                g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event,
                h = f.Deferred(),
                i = f.Callbacks("once memory"),
                j = d.statusCode || {}, k, l = {}, m = {}, n, o, p, q, r, s = 0,
                t, u, v = {
                    readyState: 0,
                    setRequestHeader: function(a, b) {
                        if (!s) {
                            var c = a.toLowerCase();
                            a = m[c] = m[c] || a, l[a] = b
                        }
                        return this
                    },
                    getAllResponseHeaders: function() {
                        return s === 2 ? n : null
                    },
                    getResponseHeader: function(a) {
                        var c;
                        if (s === 2) {
                            if (!o) {
                                o = {};
                                while (c = bG.exec(n)) o[c[1].toLowerCase()] = c[2]
                            }
                            c = o[a.toLowerCase()]
                        }
                        return c === b ? null : c
                    },
                    overrideMimeType: function(a) {
                        s || (d.mimeType = a);
                        return this
                    },
                    abort: function(a) {
                        a = a || "abort", p && p.abort(a), w(0, a);
                        return this
                    }
                };
            h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function(a) {
                if (a) {
                    var b;
                    if (s < 2) for (b in a) j[b] = [j[b], a[b]];
                    else b = a[v.status], v.then(b, b)
                }
                return this
            }, d.url = ((a || d.url) + "").replace(bF, "").replace(bK, bV[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bO), d.crossDomain == null && (r = bQ.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bV[1] && r[2] == bV[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bV[3] || (bV[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), bZ(bS, d, c, v);
            if (s === 2) return !1;
            t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bJ.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart");
            if (!d.hasContent) {
                d.data && (d.url += (bL.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url;
                if (d.cache === !1) {
                    var x = f.now(),
                        y = d.url.replace(bP, "$1_=" + x);
                    d.url = y + (y === d.url ? (bL.test(d.url) ? "&" : "?") + "_=" + x : "")
                }
            }(d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bW + "; q=0.01" : "") : d.accepts["*"]);
            for (u in d.headers) v.setRequestHeader(u, d.headers[u]);
            if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
                v.abort();
                return !1
            }
            for (u in {
                success: 1,
                error: 1,
                complete: 1
            }) v[u](d[u]);
            p = bZ(bT, d, c, v);
            if (!p) w(-1, "No Transport");
            else {
                v.readyState = 1, t && g.trigger("ajaxSend", [v, d]), d.async && d.timeout > 0 && (q = setTimeout(function() {
                    v.abort("timeout")
                }, d.timeout));
                try {
                    s = 1, p.send(l, w)
                } catch (z) {
                    if (s < 2) w(-1, z);
                    else throw z
                }
            }
            return v
        },
        param: function(a, c) {
            var d = [],
                e = function(a, b) {
                    b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            c === b && (c = f.ajaxSettings.traditional);
            if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) f.each(a, function() {
                e(this.name, this.value)
            });
            else for (var g in a) b_(g, a[g], c, e);
            return d.join("&").replace(bC, "+")
        }
    }), f.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var cc = f.now(),
        cd = /(\=)\?(&|$)|\?\?/i;
    f.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return f.expando + "_" + cc++
        }
    }), f.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e = typeof b.data == "string" && /^application\/x\-www\-form\-urlencoded/.test(b.contentType);
        if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (cd.test(b.url) || e && cd.test(b.data))) {
            var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
                i = a[h],
                j = b.url,
                k = b.data,
                l = "$1" + h + "$2";
            b.jsonp !== !1 && (j = j.replace(cd, l), b.url === j && (e && (k = k.replace(cd, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function(a) {
                g = [a]
            }, d.always(function() {
                a[h] = i, g && f.isFunction(i) && a[h](g[0])
            }), b.converters["script json"] = function() {
                g || f.error(h + " was not called");
                return g[0]
            }, b.dataTypes[0] = "json";
            return "script"
        }
    }), f.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(a) {
                f.globalEval(a);
                return a
            }
        }
    }), f.ajaxPrefilter("script", function(a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), f.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
            return {
                send: function(f, g) {
                    d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function(a, c) {
                        if (c || !d.readyState || /loaded|complete/.test(d.readyState)) d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success")
                    }, e.insertBefore(d, e.firstChild)
                },
                abort: function() {
                    d && d.onload(0, 1)
                }
            }
        }
    });
    var ce = a.ActiveXObject ? function() {
            for (var a in cg) cg[a](0, 1)
        } : !1,
        cf = 0,
        cg;
    f.ajaxSettings.xhr = a.ActiveXObject ? function() {
        return !this.isLocal && ch() || ci()
    } : ch,
        function(a) {
            f.extend(f.support, {
                ajax: !! a,
                cors: !! a && "withCredentials" in a
            })
        }(f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function(c) {
        if (!c.crossDomain || f.support.cors) {
            var d;
            return {
                send: function(e, g) {
                    var h = c.xhr(),
                        i, j;
                    c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
                    if (c.xhrFields) for (j in c.xhrFields) h[j] = c.xhrFields[j];
                    c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (j in e) h.setRequestHeader(j, e[j])
                    } catch (k) {}
                    h.send(c.hasContent && c.data || null), d = function(a, e) {
                        var j, k, l, m, n;
                        try {
                            if (d && (e || h.readyState === 4)) {
                                d = b, i && (h.onreadystatechange = f.noop, ce && delete cg[i]);
                                if (e) h.readyState !== 4 && h.abort();
                                else {
                                    j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n);
                                    try {
                                        m.text = h.responseText
                                    } catch (a) {}
                                    try {
                                        k = h.statusText
                                    } catch (o) {
                                        k = ""
                                    }!j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204)
                                }
                            }
                        } catch (p) {
                            e || g(-1, p)
                        }
                        m && g(j, k, m, l)
                    }, !c.async || h.readyState === 4 ? d() : (i = ++cf, ce && (cg || (cg = {}, f(a).unload(ce)), cg[i] = d), h.onreadystatechange = d)
                },
                abort: function() {
                    d && d(0, 1)
                }
            }
        }
    });
    var cj = {}, ck, cl, cm = /^(?:toggle|show|hide)$/,
        cn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        co, cp = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        cq;
    f.fn.extend({
        show: function(a, b, c) {
            var d, e;
            if (a || a === 0) return this.animate(ct("show", 3), a, b, c);
            for (var g = 0, h = this.length; g < h; g++) d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), (e === "" && f.css(d, "display") === "none" || !f.contains(d.ownerDocument.documentElement, d)) && f._data(d, "olddisplay", cu(d.nodeName)));
            for (g = 0; g < h; g++) {
                d = this[g];
                if (d.style) {
                    e = d.style.display;
                    if (e === "" || e === "none") d.style.display = f._data(d, "olddisplay") || ""
                }
            }
            return this
        },
        hide: function(a, b, c) {
            if (a || a === 0) return this.animate(ct("hide", 3), a, b, c);
            var d, e, g = 0,
                h = this.length;
            for (; g < h; g++) d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e));
            for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none");
            return this
        },
        _toggle: f.fn.toggle,
        toggle: function(a, b, c) {
            var d = typeof a == "boolean";
            f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function() {
                var b = d ? a : f(this).is(":hidden");
                f(this)[b ? "show" : "hide"]()
            }) : this.animate(ct("toggle", 3), a, b, c);
            return this
        },
        fadeTo: function(a, b, c, d) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            function g() {
                e.queue === !1 && f._mark(this);
                var b = f.extend({}, e),
                    c = this.nodeType === 1,
                    d = c && f(this).is(":hidden"),
                    g, h, i, j, k, l, m, n, o, p, q;
                b.animatedProperties = {};
                for (i in a) {
                    g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]);
                    if ((k = f.cssHooks[g]) && "expand" in k) {
                        l = k.expand(a[g]), delete a[g];
                        for (i in l) i in a || (a[i] = l[i])
                    }
                }
                for (g in a) {
                    h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing";
                    if (h === "hide" && d || h === "show" && !d) return b.complete.call(this);
                    c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cu(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
                }
                b.overflow != null && (this.style.overflow = "hidden");
                for (i in a) j = new f.fx(this, b, i), h = a[i], cm.test(h) ? (q = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), q ? (f._data(this, "toggle" + i, q === "show" ? "hide" : "show"), j[q]()) : j[h]()) : (m = cn.exec(h), n = j.cur(), m ? (o = parseFloat(m[2]), p = m[3] || (f.cssNumber[i] ? "" : "px"), p !== "px" && (f.style(this, i, (o || 1) + p), n = (o || 1) / j.cur() * n, f.style(this, i, n + p)), m[1] && (o = (m[1] === "-=" ? -1 : 1) * o + n), j.custom(n, o, p)) : j.custom(n, h, ""));
                return !0
            }
            var e = f.speed(b, c, d);
            if (f.isEmptyObject(a)) return this.each(e.complete, [!1]);
            a = f.extend({}, a);
            return e.queue === !1 ? this.each(g) : this.queue(e.queue, g)
        },
        stop: function(a, c, d) {
            typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []);
            return this.each(function() {
                function h(a, b, c) {
                    var e = b[c];
                    f.removeData(a, c, !0), e.stop(d)
                }
                var b, c = !1,
                    e = f.timers,
                    g = f._data(this);
                d || f._unmark(!0, this);
                if (a == null) for (b in g) g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b);
                else g[b = a + ".run"] && g[b].stop && h(this, g, b);
                for (b = e.length; b--;) e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1));
                (!d || !c) && f.dequeue(this, a)
            })
        }
    }), f.each({
        slideDown: ct("show", 1),
        slideUp: ct("hide", 1),
        slideToggle: ct("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        f.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), f.extend({
        speed: function(a, b, c) {
            var d = a && typeof a == "object" ? f.extend({}, a) : {
                complete: c || !c && b || f.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !f.isFunction(b) && b
            };
            d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
            if (d.queue == null || d.queue === !0) d.queue = "fx";
            d.old = d.complete, d.complete = function(a) {
                f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this)
            };
            return d
        },
        easing: {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return -Math.cos(a * Math.PI) / 2 + .5
            }
        },
        timers: [],
        fx: function(a, b, c) {
            this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {}
        }
    }), f.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this)
        },
        cur: function() {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop];
            var a, b = f.css(this.elem, this.prop);
            return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
        },
        custom: function(a, c, d) {
            function h(a) {
                return e.step(a)
            }
            var e = this,
                g = f.fx;
            this.startTime = cq || cr(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function() {
                f._data(e.elem, "fxshow" + e.prop) === b && (e.options.hide ? f._data(e.elem, "fxshow" + e.prop, e.start) : e.options.show && f._data(e.elem, "fxshow" + e.prop, e.end))
            }, h() && f.timers.push(h) && !co && (co = setInterval(g.tick, g.interval))
        },
        show: function() {
            var a = f._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },
        step: function(a) {
            var b, c, d, e = cq || cr(),
                g = !0,
                h = this.elem,
                i = this.options;
            if (a || e >= i.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0;
                for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1);
                if (g) {
                    i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function(a, b) {
                        h.style["overflow" + b] = i.overflow[a]
                    }), i.hide && f(h).hide();
                    if (i.hide || i.show) for (b in i.animatedProperties) f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0);
                    d = i.complete, d && (i.complete = !1, d.call(h))
                }
                return !1
            }
            i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update();
            return !0
        }
    }, f.extend(f.fx, {
        tick: function() {
            var a, b = f.timers,
                c = 0;
            for (; c < b.length; c++) a = b[c], !a() && b[c] === a && b.splice(c--, 1);
            b.length || f.fx.stop()
        },
        interval: 13,
        stop: function() {
            clearInterval(co), co = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                f.style(a.elem, "opacity", a.now)
            },
            _default: function(a) {
                a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
            }
        }
    }), f.each(cp.concat.apply([], cp), function(a, b) {
        b.indexOf("margin") && (f.fx.step[b] = function(a) {
            f.style(a.elem, b, Math.max(0, a.now) + a.unit)
        })
    }), f.expr && f.expr.filters && (f.expr.filters.animated = function(a) {
        return f.grep(f.timers, function(b) {
            return a === b.elem
        }).length
    });
    var cv, cw = /^t(?:able|d|h)$/i,
        cx = /^(?:body|html)$/i;
    "getBoundingClientRect" in c.documentElement ? cv = function(a, b, c, d) {
        try {
            d = a.getBoundingClientRect()
        } catch (e) {}
        if (!d || !f.contains(c, a)) return d ? {
            top: d.top,
            left: d.left
        } : {
            top: 0,
            left: 0
        };
        var g = b.body,
            h = cy(b),
            i = c.clientTop || g.clientTop || 0,
            j = c.clientLeft || g.clientLeft || 0,
            k = h.pageYOffset || f.support.boxModel && c.scrollTop || g.scrollTop,
            l = h.pageXOffset || f.support.boxModel && c.scrollLeft || g.scrollLeft,
            m = d.top + k - i,
            n = d.left + l - j;
        return {
            top: m,
            left: n
        }
    } : cv = function(a, b, c) {
        var d, e = a.offsetParent,
            g = a,
            h = b.body,
            i = b.defaultView,
            j = i ? i.getComputedStyle(a, null) : a.currentStyle,
            k = a.offsetTop,
            l = a.offsetLeft;
        while ((a = a.parentNode) && a !== h && a !== c) {
            if (f.support.fixedPosition && j.position === "fixed") break;
            d = i ? i.getComputedStyle(a, null) : a.currentStyle, k -= a.scrollTop, l -= a.scrollLeft, a === e && (k += a.offsetTop, l += a.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(a.nodeName)) && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), g = e, e = a.offsetParent), f.support.subtractsBorderForOverflowNotVisible && d.overflow !== "visible" && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), j = d
        }
        if (j.position === "relative" || j.position === "static") k += h.offsetTop, l += h.offsetLeft;
        f.support.fixedPosition && j.position === "fixed" && (k += Math.max(c.scrollTop, h.scrollTop), l += Math.max(c.scrollLeft, h.scrollLeft));
        return {
            top: k,
            left: l
        }
    }, f.fn.offset = function(a) {
        if (arguments.length) return a === b ? this : this.each(function(b) {
            f.offset.setOffset(this, a, b)
        });
        var c = this[0],
            d = c && c.ownerDocument;
        if (!d) return null;
        if (c === d.body) return f.offset.bodyOffset(c);
        return cv(c, d, d.documentElement)
    }, f.offset = {
        bodyOffset: function(a) {
            var b = a.offsetTop,
                c = a.offsetLeft;
            f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0);
            return {
                top: b,
                left: c
            }
        },
        setOffset: function(a, b, c) {
            var d = f.css(a, "position");
            d === "static" && (a.style.position = "relative");
            var e = f(a),
                g = e.offset(),
                h = f.css(a, "top"),
                i = f.css(a, "left"),
                j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1,
                k = {}, l = {}, m, n;
            j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k)
        }
    }, f.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var a = this[0],
                b = this.offsetParent(),
                c = this.offset(),
                d = cx.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
            c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0;
            return {
                top: c.top - d.top,
                left: c.left - d.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent || c.body;
                while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") a = a.offsetParent;
                return a
            })
        }
    }), f.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, c) {
        var d = /Y/.test(c);
        f.fn[a] = function(e) {
            return f.access(this, function(a, e, g) {
                var h = cy(a);
                if (g === b) return h ? c in h ? h[c] : f.support.boxModel && h.document.documentElement[e] || h.document.body[e] : a[e];
                h ? h.scrollTo(d ? f(h).scrollLeft() : g, d ? g : f(h).scrollTop()) : a[e] = g
            }, a, e, arguments.length, null)
        }
    }), f.each({
        Height: "height",
        Width: "width"
    }, function(a, c) {
        var d = "client" + a,
            e = "scroll" + a,
            g = "offset" + a;
        f.fn["inner" + a] = function() {
            var a = this[0];
            return a ? a.style ? parseFloat(f.css(a, c, "padding")) : this[c]() : null
        }, f.fn["outer" + a] = function(a) {
            var b = this[0];
            return b ? b.style ? parseFloat(f.css(b, c, a ? "margin" : "border")) : this[c]() : null
        }, f.fn[c] = function(a) {
            return f.access(this, function(a, c, h) {
                var i, j, k, l;
                if (f.isWindow(a)) {
                    i = a.document, j = i.documentElement[d];
                    return f.support.boxModel && j || i.body && i.body[d] || j
                }
                if (a.nodeType === 9) {
                    i = a.documentElement;
                    if (i[d] >= i[e]) return i[d];
                    return Math.max(a.body[e], i[e], a.body[g], i[g])
                }
                if (h === b) {
                    k = f.css(a, c), l = parseFloat(k);
                    return f.isNumeric(l) ? l : k
                }
                f(a).css(c, h)
            }, c, a, arguments.length, null)
        }
    }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return f
    })
})(window);
// jquery.pjax.js
// copyright chris wanstrath
// https://github.com/defunkt/jquery-pjax
(function(e) {
    function t(t, r, i) {
        var s = this;
        return this.on("click.pjax", t, function(t) {
            i = d(r, i), i.container || (i.container = e(this).attr("data-pjax") || s), n(t, i)
        })
    }
    function n(t, n, r) {
        r = d(n, r);
        var i = t.currentTarget;
        if (i.tagName.toUpperCase() !== "A") throw "$.fn.pjax or $.pjax.click requires an anchor element";
        if (t.which > 1 || t.metaKey || t.ctrlKey) return;
        if (location.protocol !== i.protocol || location.host !== i.host) return;
        if (i.hash && i.href.replace(i.hash, "") === location.href.replace(location.hash, "")) return;
        if (i.href === location.href + "#") return;
        var o = {
            url: i.href,
            container: e(i).attr("data-pjax"),
            cacheContainer: e(i).attr("data-pjax-cache-container"),
            replace: !! e(i).attr("data-pjax-replace"),
            target: i,
            fragment: null
        };
        o.cacheContainer && (o.scrollTo = !1), s(e.extend({}, o, r)), t.preventDefault()
    }
    function r(t, n, r) {
        r = d(n, r);
        var i = t.currentTarget;
        if (i.tagName.toUpperCase() !== "FORM") throw "$.pjax.submit requires a form element";
        var o = {
            type: i.method,
            url: i.action,
            data: e(i).serializeArray(),
            container: e(i).attr("data-pjax"),
            target: i,
            fragment: null,
            timeout: 0
        };
        s(e.extend({}, o, r)), t.preventDefault()
    }
    function s(t) {
        function a(t, r) {
            var i = e.Event(t, {
                relatedTarget: n
            });
            return o.trigger(i, r), !i.isDefaultPrevented()
        }
        t = e.extend(!0, {}, e.ajaxSettings, s.defaults, t), e.isFunction(t.url) && (t.url = t.url());
        var n = t.target,
            r = p(t.url).hash,
            o = t.context = v(t.container);
        t.data || (t.data = {}), t.data._pjax = o.selector;
        var f;
        t.beforeSend = function(e, n) {
            n.type !== "GET" && (n.timeout = 0), n.timeout > 0 && (f = setTimeout(function() {
                a("pjax:timeout", [e, t]) && e.abort("timeout")
            }, n.timeout), n.timeout = 0), e.setRequestHeader("X-PJAX", "true"), e.setRequestHeader("X-PJAX-Container", o.selector);
            var r;
            if (!a("pjax:beforeSend", [e, n])) return !1;
            t.requestUrl = p(n.url).href
        }, t.complete = function(e, n) {
            f && clearTimeout(f);
            if (t.revert && e.state() === "rejected") {
                s.options = t.previous;
                if (t.push && !t.replace) {
                    x(s.state.id), i = !0, history.back();
                    return
                }
                if (t.id) {
                    i = !0, t.id < s.state.id ? history.forward() : history.back();
                    return
                }
                return
            }
            t.previous = null, a("pjax:complete", [e, n, t]), a("pjax:end", [e, t])
        }, t.error = function(e, n, r) {
            var i = g("", e, t),
                s = a("pjax:error", [e, n, r, t]);
            n !== "abort" && s && u(i.url)
        }, t.success = function(n, i, f) {
            var l = g(n, f, t);
            if (!l.contents) {
                u(l.url);
                return
            }
            s.state = {
                id: t.id || c(),
                url: l.url,
                title: l.title,
                container: t.cacheContainer || o.selector,
                scrollTo: t.scrollTo || 0,
                fragment: t.fragment,
                timeout: t.timeout
            }, (t.push || t.replace) && window.history.replaceState(s.state, l.title, l.url), l.title && (document.title = l.title), o.html(l.contents), typeof t.scrollTo == "number" && e(window).scrollTop(t.scrollTo), (t.replace || t.push) && window._gaq && _gaq.push(["_trackPageview"]);
            if (r !== "") {
                var h = p(l.url);
                h.hash = r, s.state.url = h.href, window.history.replaceState(s.state, l.title, h.href);
                var d = e(h.hash);
                d.length && e(window).scrollTop(d.offset().top)
            }
            a("pjax:success", [n, i, f, t])
        }, s.state || (s.state = {
            id: c(),
            url: window.location.href,
            title: document.title,
            container: o.selector,
            scrollTo: 0,
            fragment: t.fragment,
            timeout: t.timeout
        }, window.history.replaceState(s.state, document.title));
        var l = s.xhr;
        if (l && l.state() === "pending") {
            if (s.options.lockRequest) return e.Deferred().reject();
            l.onreadystatechange = e.noop, l.abort()
        }
        t.previous = s.options || null, s.options = t;
        var l = s.xhr = e.ajax(t);
        return l.readyState > 0 && (t.push && !t.replace && (E(s.state.id, o.contents()), s.state.scrollTo = e(window).scrollTop(), window.history.replaceState(s.state, document.title), window.history.pushState(null, "", h(t.requestUrl))), a("pjax:start", [l, t]), a("pjax:send", [l, t])), s.xhr
    }
    function o(t, n) {
        var r = {
            url: window.location.href,
            push: !1,
            replace: !0,
            scrollTo: !1
        };
        return s(e.extend(r, d(t, n)))
    }
    function u(e) {
        window.history.replaceState(null, "", "#"), window.location.replace(e)
    }
    function f(t) {
        var n = a;
        a = !1;
        if (i) {
            i = !1;
            return
        }
        var r = t.state;
        if (r && r.container) {
            var o = e(r.container);
            if (o.length) {
                var f = y[r.id];
                if (s.state) {
                    var l = s.state.id < r.id ? "forward" : "back";
                    S(l, s.state.id, o.contents())
                } else if (n) {
                    s.state = r;
                    return
                }
                var c = e.Event("pjax:popstate", {
                    state: r,
                    direction: l
                });
                o.trigger(c);
                var h = {
                    id: r.id,
                    url: r.url,
                    container: o,
                    push: !1,
                    fragment: r.fragment,
                    timeout: r.timeout,
                    scrollTo: r.scrollTo
                };
                f ? (o.trigger("pjax:start", [null, h]), r.title && (document.title = r.title), o.html(f), s.state = r, e(window).scrollTop(h.scrollTo), o.trigger("pjax:end", [null, h])) : s(h), o[0].offsetHeight
            } else u(location.href)
        }
    }
    function l(t) {
        var n = e.isFunction(t.url) ? t.url() : t.url,
            r = t.type ? t.type.toUpperCase() : "GET",
            i = e("<form>", {
                method: r === "GET" ? "GET" : "POST",
                action: n,
                style: "display:none"
            });
        r !== "GET" && r !== "POST" && i.append(e("<input>", {
            type: "hidden",
            name: "_method",
            value: r.toLowerCase()
        }));
        var s = t.data;
        if (typeof s == "string") e.each(s.split("&"), function(t, n) {
            var r = n.split("=");
            i.append(e("<input>", {
                type: "hidden",
                name: r[0],
                value: r[1]
            }))
        });
        else if (typeof s == "object") for (key in s) i.append(e("<input>", {
            type: "hidden",
            name: key,
            value: s[key]
        }));
        e(document.body).append(i), i.submit()
    }
    function c() {
        return (new Date).getTime()
    }
    function h(e) {
        return e.replace(/\?_pjax=[^&]+&?/, "?").replace(/_pjax=[^&]+&?/, "").replace(/[\?&]$/, "")
    }
    function p(e) {
        var t = document.createElement("a");
        return t.href = e, t
    }
    function d(t, n) {
        return t && n ? n.container = t : e.isPlainObject(t) ? n = t : n = {
            container: t
        }, n.container && (n.container = v(n.container)), n
    }
    function v(t) {
        t = e(t);
        if (!t.length) throw "no pjax container for " + t.selector;
        if (t.selector !== "" && t.context === document) return t;
        if (t.attr("id")) return e("#" + t.attr("id"));
        throw "cant get selector for pjax container!"
    }
    function m(e, t) {
        return e.filter(t).add(e.find(t))
    }
    function g(t, n, r) {
        var i = {};
        i.url = h(n.getResponseHeader("X-PJAX-URL") || r.requestUrl);
        var s = e(t);
        if (s.length === 0) return i;
        i.title = m(s, "title").last().text();
        if (r.fragment) {
            var o = m(s, r.fragment).first();
            o.length && (i.contents = o.contents(), i.title || (i.title = o.attr("title") || o.data("title")))
        } else /<html/i.test(t) || (i.contents = s);
        return i.contents && (i.contents = i.contents.not("title"), i.contents.find("title").remove()), i.title && (i.title = e.trim(i.title)), i
    }
    function E(e, t) {
        y[e] = t, w.push(e);
        while (b.length) delete y[b.shift()];
        while (w.length > s.defaults.maxCacheLength) delete y[w.shift()]
    }
    function S(e, t, n) {
        var r, i;
        y[t] = n, e === "forward" ? (r = w, i = b) : (r = b, i = w), r.push(t), (t = i.pop()) && delete y[t]
    }
    function x(e) {
        (w[w.length - 1] || 0) === e && delete y[w.pop()]
    }
    function T() {
        while (b.length) delete y[b.pop()];
        while (w.length) delete y[w.pop()]
    }
    function N() {
        e.fn.pjax = t, e.pjax = s, e.pjax.enable = e.noop, e.pjax.disable = C, e.pjax.click = n, e.pjax.submit = r, e.pjax.reload = o, e.pjax.clearCache = T, e.pjax.defaults = {
            timeout: 650,
            push: !0,
            replace: !1,
            type: "GET",
            dataType: "html",
            scrollTo: 0,
            lockRequest: !1,
            maxCacheLength: 20
        }, e(window).bind("popstate.pjax", f)
    }
    function C() {
        e.fn.pjax = function() {
            return this
        }, e.pjax = l, e.pjax.enable = N, e.pjax.disable = e.noop, e.pjax.click = e.noop, e.pjax.submit = e.noop, e.pjax.reload = window.location.reload, e.pjax.clearCache = e.noop, e(window).unbind("popstate.pjax", f)
    }
    var i = !1,
        a = !0,
        y = {}, b = [],
        w = [];
    e.inArray("state", e.event.props) < 0 && e.event.props.push("state"), e.support.pjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/), e.support.pjax ? N() : C()
})(jQuery);
var ga_tracking_id = $(document.documentElement).attr('data-google-analytics-tracking-id');
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', ga_tracking_id, 'auto');
ga('set', 'forceSSL', true);
ga('set', 'anonymizeIp', true);

var Olv = Olv || {};
(function(t, e) {
    e.init || (e.init = t.Deferred(function() {
        t(this.resolve)
    }).promise(), e.Router = function() {
        this.routes = [], this.guard = t.Deferred()
    }, t.extend(e.Router.prototype, {
        connect: function(t, e) {
            t instanceof RegExp || (t = new RegExp(t)), this.routes.push([t, e])
        },
        dispatch: function(e) {
            this.guard.resolve(e), this.guard = t.Deferred();
            for (var n, o = e.pathname, i = 0; n = this.routes[i]; i++) {
                var a = o.match(n[0]);
                a && n[1].call(this, a, e, this.guard.promise())
            }
        }
    }), e.router = new e.Router, t(document).on("pjax:end", function(n, o) {
        t(document).trigger("olv:pagechange", [o]), e.router.dispatch(location)
    }), e.init.done(function() {
        e.router.dispatch(location)
    }), e.init.done(function() {
        var t = wiiuBOSS.isRegisteredDirectMessageTask();
        t && t.isRegistered && e.Utils.callWiiuBOSSFuncWithFallback("registerDirectMessageTaskEx")
    }), e.Locale = {
        Data: {},
        text: function(t) {
            var n = Array.prototype.slice.call(arguments);
            return n.splice(1, 0, -1), e.Locale.textN.apply(this, n)
        },
        textN: function(t, n) {
            if (e.Cookie.get("plain_msgid")) return t;
            n = +n || 0;
            var o = e.Locale.Data[t];
            if (!o) return t;
            var i, a, r = o.quanttype || "o";
            if ("1_o" === r && 1 === n || "01_o" === r && (0 === n || 1 === n) ? (i = o.text_value_1 || o.value_1, a = o.text_args_1 || o.args_1) : (i = o.text_value || o.value, a = o.text_args || o.args), !a) return i;
            var s = Array.prototype.slice.call(arguments, 2),
                l = 0;
            return i.replace(/%s/g, function() {
                return s[a[l++] - 1]
            })
        }
    }, e.loc = e.Locale.text, e.loc_n = e.Locale.textN, e.print = function(t) {
        "undefined" != typeof wiiuDebug ? wiiuDebug.print(t) : "undefined" != typeof console && console.log(t)
    }, e.alert = function(t, n) {
        e.Loading.isLocked() || (arguments.length <= 1 && (n = e.loc("olv.portal.ok")), wiiuDialog.alert(t, n))
    }, e.confirm = function(t, n, o) {
        if (!e.Loading.isLocked()) return arguments.length <= 1 && (n = e.loc("olv.portal.cancel"), o = e.loc("olv.portal.ok")), wiiuDialog.confirm(t, n, o)
    }, e.deferredAlert = function(n, o) {
        var i = arguments,
            a = t.Deferred();
        return setTimeout(function() {
            e.alert.apply(null, i), a.resolve()
        }, 0), a.promise()
    }, e.deferredConfirm = function(n, o, i) {
        var a = arguments,
            r = t.Deferred();
        return setTimeout(function() {
            var t = e.confirm.apply(null, a);
            r.resolve(t)
        }, 0), r.promise()
    }, e.Cookie = {
        set: function(t, e) {
            var n = encodeURIComponent(t) + "=" + encodeURIComponent(e) + "; path=/";
            document.cookie = n
        },
        get: function(t) {
            if (t && document.cookie) for (var e = document.cookie.split("; "), n = 0; n < e.length; n++) {
                var o = e[n].split("=");
                if (t === decodeURIComponent(o[0])) return decodeURIComponent(o[1])
            }
        }
    }, e.Loading = {
        _showCount: 0,
        show: function(e) {
            this._showCount++ || wiiuBrowser.showLoadingIcon(!0), e.always(t.proxy(function() {
                --this._showCount || wiiuBrowser.showLoadingIcon(!1)
            }, this))
        },
        isShown: function() {
            return !!this._showCount
        },
        _lockCount: 0,
        lock: function(e) {
            this._lockCount++ || wiiuBrowser.lockUserOperation(!0), e.always(t.proxy(function() {
                --this._lockCount || wiiuBrowser.lockUserOperation(!1)
            }, this))
        },
        isLocked: function() {
            return !!this._lockCount
        },
        setup: function() {
            wiiuBrowser.showLoadingIcon(!1), wiiuBrowser.lockUserOperation(!1), e.Loading.lock(e.init), t(document).on("pjax:send", function(t, n) {
                e.Loading.lock(n)
            })
        }
    }, e.Loading.setup(), e.ErrorViewer = {
        open: function(t) {
            if (!e.Loading.isLocked()) {
                var n = +((t = t || {}).error_code || t.code || 0),
                    o = t.message || t.msgid && e.loc(t.msgid);
                n || (n = 1219999, o = o || e.loc("olv.portal.error.500")), o ? wiiuErrorViewer.openByCodeAndMessage(n, o) : wiiuErrorViewer.openByCode(n)
            }
        },
        deferredOpen: function(n) {
            var o = t.Deferred();
            return setTimeout(function() {
                e.ErrorViewer.open(n), o.resolve()
            }, 0), o.promise()
        }
    }, e.Net = {
        ajax: function(n) {
            var o = t.ajax(n),
                i = e.Net._pageId,
                a = o.pipe(function(n, o, a) {
                    var r = e.Net._pageId === i,
                        s = [n, o, a, r];
                    return n && "object" == typeof n && !n.success || !r ? t.Deferred().rejectWith(this, s) : t.Deferred().resolveWith(this, s)
                }, function(n, o) {
                    var a = e.Net.getDataFromXHR(n);
                    void 0 === a && (a = n.responseText);
                    var r = e.Net._pageId === i;
                    return t.Deferred().rejectWith(this, [a, o, n, r])
                });
            return n.showLoading && e.Loading.show(a), n.lock && e.Loading.lock(a), n.silent || a.fail(e.Net.errorFeedbackHandler), a.promise(o), o
        },
        _pageId: 1,
        onPageChange: function() {
            e.Net._pageId++
        },
        getDataFromXHR: function(t) {
            var e = t.responseText,
                n = t.getResponseHeader("Content-Type");
            if (e && n && /^application\/json(?:;|$)/.test(n)) try {
                return JSON.parse(e)
            } catch (t) {}
        },
        getErrorFromXHR: function(t) {
            var n = e.Net.getDataFromXHR(t),
                o = n && n.errors && n.errors[0];
            if (o && "object" == typeof o) return o;
            var i = t.status;
            return i ? 503 == i ? {
                error_code: 1211503,
                message: e.loc("olv.portal.error.503.content")
            } : i < 500 ? {
                error_code: 1210902,
                message: e.loc("olv.portal.error.failed_to_connect")
            } : {
                error_code: 1219999,
                message: e.loc("olv.portal.error.500")
            } : {
                error_code: 1219998,
                message: e.loc("olv.portal.error.network_unavailable")
            }
        },
        errorFeedbackHandler: function(n, o, i, a) {
            if ("abort" !== o && a && !e.Loading.isLocked()) {
                var r = e.Net.getErrorFromXHR(i);
                t(document).trigger("olv:net:error", [r, o, i, a]), e.ErrorViewer.open(r)
            }
        },
        get: function(t, n, o, i) {
            return e.Net.ajax({
                type: "GET",
                url: t,
                data: n,
                success: o,
                dataType: i
            })
        },
        post: function(t, n, o, i) {
            return e.Net.ajax({
                type: "POST",
                url: t,
                data: n,
                success: o,
                dataType: i
            })
        }
    }, t(document).on("olv:pagechange", e.Net.onPageChange), e.Browsing = {
        setup: function() {
            t.pjax && (t.pjax.defaults.timeout = 0, t.pjax.defaults.maxCacheLength = 5, t.pjax.defaults.lockRequest = !0, t(document).pjax("a[href][data-pjax]"), t(document).on("click", "[data-href][data-pjax]", this.onDataHrefClick), t(document).on("click", "a[href][data-replace]", this.onReplaceClick), t(window).on("click", "a[href]", this.onLinkClickFinally), t(document).on("pjax:error", this.onPjaxError), t(document).on("olv:pagechange", this.onPageChange))
        },
        guardPage: function() {
            function e() {
                t(window).off("pagehide", e), t(document).off("olv:pagechange", e), n.resolve()
            }
            var n = t.Deferred();
            return t(window).on("pagehide", e), t(document).on("olv:pagechange", e), n.promise()
        },
        lockPage: function() {
            var t = e.Browsing.guardPage();
            return e.Loading.lock(t), t
        },
        replaceWith: function(t) {
            var n = e.Browsing.lockPage();
            return location.replace(t), n
        },
        reload: function() {
            return t.pjax ? t.pjax.reload("#body").promise() : (location.reload(), e.Browsing.guardPage())
        },
        clearCache: function() {
            t.pjax && t.pjax.clearCache()
        },
        onDataHrefClick: function(e) {
            if (!e.isDefaultPrevented() && !t(e.target).closest("a").length) {
                var n = t(this);
                n.hasClass("disabled") || (t.pjax({
                    url: n.attr("data-href"),
                    container: n.attr("data-pjax"),
                    target: n.get(0)
                }), e.preventDefault())
            }
        },
        onReplaceClick: function(n) {
            if (!n.isDefaultPrevented()) {
                n.preventDefault();
                var o = t(this).attr("href");
                setTimeout(function() {
                    e.Browsing.replaceWith(o)
                }, 0)
            }
        },
        onLinkClickFinally: function(t) {
            t.isDefaultPrevented() || this.href.replace(/#.*/, "") === location.href.replace(/#.*/, "") || e.Browsing.lockPage()
        },
        onPjaxError: function(n, o, i, a, r) {
            if ("abort" !== i) if (n.preventDefault(), o.getResponseHeader("X-PJAX-OK")) r.success(o.responseText, i, o);
            else {
                var s = e.Net.getErrorFromXHR(o);
                setTimeout(function() {
                    t(document).trigger("olv:browsing:error", [s, i, o, r]), e.ErrorViewer.open(s)
                }, 0), r.revert = !0
            }
        },
        revision: 1 / 0,
        expires: +new Date + 864e5,
        onPageChange: function(t, n) {
            if (n) {
                var o = e.Browsing,
                    i = +n.getResponseHeader("X-Browsing-Revision");
                (o.revision < i || o.expires < +new Date) && (e.Browsing.lockPage(), location.reload())
            }
        },
        setupAnchorLinkReplacer: function(e) {
            function n(e) {
                if (!e.isDefaultPrevented()) {
                    var n = t(this).attr("href") || "";
                    /^#.+$/.test(n) && (e.preventDefault(), setTimeout(function() {
                        location.replace(n)
                    }, 0))
                }
            }
            t(document).on("click", "a[href]", n), e.done(function() {
                t(document).off("click", "a[href]", n)
            })
        }
    }, e.init.done(function() {
        e.Browsing.setup()
    }), e.Utils = {}, e.Utils.containsNGWords = function(t) {
        return "undefined" != typeof wiiuFilter && wiiuFilter.checkWord(t) < 0
    }, e.Utils.ERROR_CONTAINS_NG_WORDS = {
        error_code: 1215901,
        msgid: "olv.portal.contains.ng_words"
    }, e.Utils.callWiiuBOSSFuncWithFallback = function(t) {
        var e = wiiuBOSS[t];
        return "registerDirectMessageTaskEx" == t ? "function" != typeof e ? wiiuBOSS.registerDirectMessageTask() : e.call(wiiuBOSS, 720, 2) : e.call(wiiuBOSS)
    }, e.Content = {}, e.Content.autopagerize = function(n, o) {
        function i() {
            if (!(u._disabledCount || s.scrollTop() + d + 200 < a.offset().top + a.outerHeight())) {
                var e = t("<div/>").attr("class", "post-list-loading").append(t("<img/>").attr({
                    src: "/img/loading-image-green.gif",
                    alt: ""
                })).appendTo(a);
                l = t.ajax({
                    url: r,
                    headers: {
                        "X-AUTOPAGERIZE": !0
                    }
                }).done(function(o) {
                    var s = t("<div>" + o + "</div>").find(n);
                    (r = s.attr("data-next-page-url") || "") || c.resolve(), a.trigger("olv:autopagerize", [s, r, e]), s.children().each(function() {
                        this.id && t("#" + this.id).length && t(this).detach()
                    }), a.attr("data-next-page-url", r), a.append(s.children()), r && setTimeout(i, 0)
                }).always(function() {
                    e.remove(), l = null
                }), u.disable(l)
            }
        }
        var a = t(n),
            r = a.attr("data-next-page-url");
        if (r) {
            var s = t(window),
                l = null,
                c = t.Deferred(),
                u = e.Content.autopagerize,
                d = s.height();
            s.on("scroll", i), c.done(function() {
                s.off("scroll", i), l && l.abort()
            }), setTimeout(i, 0), o.done(c.resolve)
        }
    }, e.Content.autopagerize._disabledCount = 0, e.Content.autopagerize.disable = function(t) {
        var n = e.Content.autopagerize;
        n._disabledCount++, t.always(function() {
            n._disabledCount--
        })
    }, e.Content.preloadImages = function() {
        for (var t = arguments.length; t--;) document.createElement("img").src = arguments[t]
    }, e.Content.fixFixedPositionElement = function(e) {
        var n = t(e).first(),
            o = n.offset(),
            i = t(window);
        o && (i.width() < o.left || i.height() < o.top) && (n.css("display", "none"), setTimeout(function() {
            n.css("display", "")
        }, 0))
    }, e.Form = {
        toggleDisabled: function(n, o) {
            var i = void 0 === o;
            return n.each(function() {
                var n = t(this),
                    a = i ? !e.Form.hasBeenDisabled(n) : o;
                if (void 0 !== this.form) n.prop("disabled", a);
                else {
                    n.toggleClass("disabled", a);
                    var r = a ? "href" : "data-disabled-href",
                        s = a ? "data-disabled-href" : "href",
                        l = n.attr(r);
                    void 0 !== l && (n.removeAttr(r), n.attr(s, l))
                }
            }), n
        },
        _beingDisabledNodes: [],
        _beingDisabledObjects: [],
        isDisabled: function(t) {
            return e.Form.hasBeenDisabled(t) || e.Form._beingDisabledNodes.indexOf(t[0]) >= 0
        },
        hasBeenDisabled: function(t) {
            return t.length && void 0 !== t[0].form ? t.prop("disabled") : t.hasClass("disabled")
        },
        disable: function(t, n) {
            return e.Form.toggleDisabled(t, !0), n.always(function() {
                e.Form.toggleDisabled(t, !1)
            }), t
        },
        disableSoon: function(t, n) {
            var o = e.Form;
            n.always(function() {
                o.toggleDisabled(t, !1)
            });
            var i = o._beingDisabledNodes,
                a = o._beingDisabledObjects;
            return a.length || setTimeout(function() {
                for (var t, e = 0; t = a[e]; e++) "pending" === t[1].state() && o.toggleDisabled(t[0], !0);
                i.length = a.length = 0
            }, 0), i.push.apply(i, t.get()), a.push([t, n]), t
        },
        setupDisabledMessage: function(n) {
            function o(n) {
                var o = t(this);
                if (e.Form.hasBeenDisabled(o)) {
                    n.preventDefault();
                    var i = o.attr("data-disabled-message");
                    i && e.deferredAlert(i)
                }
            }
            t(document).on("click", "[data-disabled-message]", o), n.done(function() {
                t(document).off("click", "[data-disabled-message]", o)
            })
        },
        submit: function(e, n, o) {
            e.trigger("olv:form:submit", [n || t()]);
            var i = e.serializeArray(),
                a = n && n.is("input, button") && n.prop("name");
            a && i.push({
                name: a,
                value: n.val()
            });
            var r = {
                type: e.prop("method"),
                url: e.attr("action"),
                data: i,
                lock: o
            };
            return this.send(r, n)
        },
        get: function(t, e, n, o) {
            var i = {
                type: "GET",
                url: t,
                data: e,
                lock: o
            };
            return this.send(i, n)
        },
        post: function(t, e, n, o) {
            var i = {
                type: "POST",
                url: t,
                data: e,
                lock: o
            };
            return this.send(i, n)
        },
        send: function(n, o) {
            var i = e.Net.ajax(n);
            return t(document).trigger("olv:form:send", [i, n, o || t()]), o && e.Form.disableSoon(o, i), i
        },
        updateParentClass: function(e) {
            switch (e.type) {
                case "radio":
                    t(e.form ? e.form.elements[e.name] : 'input[name="' + e.name + '"]').each(function() {
                        t(this).parent().toggleClass("checked", this.checked)
                    });
                    break;
                case "checkbox":
                    t(e).parent().toggleClass("checked", e.checked)
            }
        },
        setup: function() {
            t(document).on("click", "input", function(t) {
                t.isDefaultPrevented() || e.Form.updateParentClass(this)
            });
            var n = {
                submit: !0,
                reset: !0,
                button: !0,
                image: !0,
                file: !0
            };
            t(document).on("keypress", "input", function(e) {
                13 !== e.which || e.isDefaultPrevented() || this.type in n || !this.form || t(this.form).attr("data-allow-submission") || e.preventDefault()
            }), t(document).on("submit", function(e) {
                e.isDefaultPrevented() || t(e.target).attr("data-allow-submission") || e.preventDefault()
            }), t(document).on("olv:form:send", function(t, n, o) {
                "POST" === (o.type || "").toUpperCase() && e.Browsing.clearCache()
            })
        },
        setupForPage: function() {
            t("input:checked").each(function() {
                e.Form.updateParentClass(this)
            })
        },
        syncSelectedText: function(t) {
            var e = t.find(":selected");
            t.siblings(".select-button-content").text(e.text())
        }
    }, e.Achievement = {
        requestAchieveWithoutRegard: function(e) {
            var n = t.Deferred();
            return this.requestAchieve(e).always(function() {
                n.resolveWith(this, arguments)
            }), n.promise()
        },
        requestAchieve: function(t) {
            return e.Net.ajax({
                type: "POST",
                url: "/my/achievements.json",
                contentType: "application/json",
                data: JSON.stringify({
                    achievements: t
                }),
                silent: !0,
                lock: !0
            })
        }
    }, e.init.done(e.Form.setup), e.router.connect("", e.Form.setupForPage), e.DecreasingTimer = function(t, e, n) {
        this.callback_ = t, this.initialInterval_ = e || 1e4, this.maxInterval_ = n || 1 / 0, this.interval_ = this.initialInterval_, this.timeouts_ = []
    }, e.DecreasingTimer.prototype.resetInterval = function() {
        this.interval_ = this.initialInterval_, this.clearAllTimeouts(), this.invoke()
    }, e.DecreasingTimer.prototype.clearAllTimeouts = function() {
        t(this.timeouts_).each(t.proxy(function(t, e) {
            this.clearTimeout(e)
        }, this))
    }, e.DecreasingTimer.prototype.clearTimeout = function(t) {
        for (var e = 0, n = this.timeouts_.length; e < n; ++e) if (this.timeouts_[e] == t) {
            clearTimeout(this.timeouts_[e]), this.timeouts_.splice(e, 1);
            break
        }
    }, e.DecreasingTimer.prototype.invoke = function() {
        this.callback_();
        var e;
        e = setTimeout(t.proxy(function() {
            this.invoke(), this.clearTimeout(e)
        }, this), this.interval_), this.timeouts_.push(e), this.interval_ = Math.min(Math.floor(1.5 * this.interval_), this.maxInterval_)
    }, e.UpdateChecker = function(t, n) {
        this._settings = {}, e.DecreasingTimer.call(this, this.callback_, t, n)
    }, e.UpdateChecker.prototype = new e.DecreasingTimer, e.UpdateChecker.getInstance = function() {
        return void 0 == e.UpdateChecker.instance && (e.UpdateChecker.instance = new e.UpdateChecker(1e4, 6e5)), e.UpdateChecker.instance
    }, e.UpdateChecker.prototype.callback_ = function() {
        var n = {};
        t.each(this._settings, t.proxy(function(e) {
            void 0 != this._settings[e].pathname && this._settings[e].pathname != location.pathname ? delete this._settings[e] : t.each(this._settings[e].params, function(t, e) {
                n[t] = JSON.stringify(e)
            })
        }, this)), e.Net.ajax({
            url: "/check_update.json",
            data: n,
            silent: !0
        }).done(t.proxy(function(e) {
            t(this).triggerHandler("update", [e])
        }, this))
    }, e.UpdateChecker.prototype.onUpdate = function(t, e, n, o) {
        this._settings[t] = {
            params: e,
            update: n
        }, o && (this._settings[t].pathname = location.pathname)
    }, e.UpdateChecker.prototype.deleteChecker = function(t) {
        delete this._settings[t]
    }, e.Toggler = function(t, e) {
        this.actions = t, this.index = e || 0, this.loading = null
    }, t.extend(e.Toggler.prototype, {
        toggle: function(n) {
            if (!this.loading && (0 === arguments.length && (n = this.index + 1), (n %= this.actions.length) !== this.index)) return this.loading = e.Form.send({
                type: "POST",
                url: this.actions[n],
                data: this.params(n),
                context: this
            }).done(function() {
                this.index = n, t(this).triggerHandler("toggledone", arguments)
            }).fail(function() {
                t(this).triggerHandler("togglefail", arguments)
            }).always(function() {
                t(this).triggerHandler("toggleend"), this.loading = null
            }), t(this).triggerHandler("togglestart"), this.loading
        },
        params: function(t) {
            return []
        }
    }), e.Storage = function(t, e) {
        this.storage = t, this.prefix = e ? e + "." : ""
    }, t.extend(e.Storage.prototype, {
        get: function(t, e) {
            var n = this.storage.getItem(this.prefix + t),
                o = n && JSON.parse(n);
            return !o || o[1] && o[1] < +new Date ? e : o[0]
        },
        set: function(t, e, n) {
            var o = n ? +new Date + 1e3 * n : 0,
                i = JSON.stringify([e, o]);
            this.storage.setItem(this.prefix + t, i)
        },
        remove: function(t) {
            this.storage.removeItem(this.prefix + t)
        },
        removeAll: function() {
            for (var t = [], e = this.storage.length(), n = 0; n < e; n++) {
                var o = this.storage.key(n);
                o && 0 === o.indexOf(this.prefix) && t.push(o)
            }
            t.forEach(function(t) {
                this.storage.removeItem(t)
            }, this)
        },
        sweep: function() {
            for (var t = [], e = this.storage.length(), n = this.prefix.length, o = {}, i = 0; i < e; i++) {
                var a = this.storage.key(i);
                (a && 0 === a.indexOf(this.prefix) && this.get(a.substring(n), o)) === o && t.push(a)
            }
            t.forEach(function(t) {
                this.storage.removeItem(t)
            }, this)
        },
        save: function() {
            this.sweep(), void 0 !== this.storage.write && this.storage.write()
        },
        getBranch: function(t) {
            return new this.constructor(this.storage, this.prefix + t)
        }
    }), t.extend(e.Storage, {
        _session: null,
        session: function() {
            var t = e.Storage;
            return t._session || (t._session = new t(wiiuSessionStorage, "olv"))
        },
        _local: null,
        local: function() {
            var t = e.Storage;
            return t._local || (t._local = new t(wiiuLocalStorage, "olv"))
        }
    }), e.KEY_LABEL_MAP = {
        13: "A",
        27: "B",
        88: "X",
        89: "Y",
        76: "L",
        82: "R",
        80: "plus",
        77: "minus"
    }, e.KeyLocker = {
        locks: null,
        isLocked: function(t) {
            return !!this.locks[t]
        },
        onKeyDown: function(t) {
            t.which in this.locks && (this.locks[t.which] = !1)
        },
        onKeyPress: function(t) {
            t.which in this.locks && (this.locks[t.which] ? t.preventDefault() : this.locks[t.which] = !0)
        },
        onKeyUp: function(t) {
            t.which in this.locks && (this.locks[t.which] = !1, 32 === t.which && (this.locks[13] = !0))
        },
        setup: function() {
            var n = this,
                o = {
                    32: !1
                };
            t.each(e.KEY_LABEL_MAP, function(t) {
                o[t] = !1
            }), n.locks = o, t(document).on({
                keydown: function(t) {
                    n.onKeyDown(t)
                },
                keypress: function(t) {
                    n.onKeyPress(t)
                },
                keyup: function(t) {
                    n.onKeyUp(t)
                }
            })
        }
    }, e.init.done(function() {
        e.KeyLocker.setup()
    }), e.TriggerHandler = {
        onKeyPress: function(n) {
            13 !== n.which || n.isDefaultPrevented() || e.KeyLocker.isLocked(13) || (n.preventDefault(), t(this).click())
        },
        onMouseUp: function(t) {
            this.blur()
        },
        setup: function() {
            t(document).on({
                keypress: this.onKeyPress,
                mouseup: this.onMouseUp
            }, ".trigger")
        }
    }, e.init.done(function() {
        e.TriggerHandler.setup()
    }), e.AccessKey = {
        triggerByKey: function(n) {
            var o = null;
            if (t(".accesskey-" + n).each(function() {
                var n = t(this);
                return !(!e.Form.isDisabled(n) && !n.closest(".none").length) || (o = n, !1)
            }), !o) return null;
            o.click();
            var i = o.attr("href");
            return i && o.attr("data-is-standard-link") && setTimeout(function() {
                location.href = i
            }, 0), o
        },
        onKeyPress: function(t) {
            if (13 !== t.which && !t.isDefaultPrevented()) {
                var n = e.KEY_LABEL_MAP[t.which];
                n && this.triggerByKey(n) && t.preventDefault()
            }
        },
        bind: function(e, n, o) {
            var i = t("<button/>").attr("type", "button").addClass("accesskey-" + e).on("click", n).hide().appendTo(document.body);
            return o.always(function() {
                i.remove()
            }), i
        },
        setup: function() {
            t(document).on("keypress", t.proxy(this.onKeyPress, this))
        }
    }, e.init.done(function() {
        e.AccessKey.setup()
    }), e.Sound = {
        attentionSelector: "a[href], [data-href], input, textarea, select, button, label, .trigger, [data-sound]",
        isAttentionTarget: function(t) {
            return !!t.closest(this.attentionSelector).length
        },
        playAttentionSound: function(t) {
            e.Form.hasBeenDisabled(t) || wiiuSound.playSoundByName("SE_WAVE_DRC_TOUCH_TRG", 1)
        },
        activationSelector: 'a[href], [data-href], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], button, .trigger, [data-sound]',
        defaultActivationSound: "SE_WAVE_OK",
        setDefaultActivationSoundByPath: function(t) {
            this.defaultActivationSound = /^\/(?:help\/.|guide\/)/.test(t) ? "SE_WAVE_OK_SUB" : "SE_WAVE_OK"
        },
        playActivationSound: function(t) {
            if (!e.Form.hasBeenDisabled(t)) {
                var n = t.attr("data-sound");
                "" !== n && wiiuSound.playSoundByName(n || this.defaultActivationSound, 1)
            }
        },
        playBGM: function(t) {
            wiiuSound.playSoundByName(t, 3)
        },
        playBGMByPath: function(t) {
            var e = /^\/welcome\//.test(t) ? "BGM_OLV_INIT" : /^\/(?:settings(?:\/|$)|help\/|guide\/)/.test(t) ? "BGM_OLV_SETTING" : "BGM_OLV_MAIN";
            this.playBGM(e)
        },
        setup: function() {
            t(document).on("touchstart", this.attentionSelector, function() {
                e.Sound.playAttentionSound(t(this))
            }), t(document).on("click", this.activationSelector, function() {
                e.Sound.playActivationSound(t(this))
            })
        }
    }, e.init.done(function() {
        e.Sound.setup()
    }), e.router.connect(/^/, function(t, n, o) {
        e.Sound.setDefaultActivationSoundByPath(n.pathname), e.Sound.playBGMByPath(n.pathname)
    }), e.Dropdown = function(e) {
        e = t(e), this.container = e.parent(), this.element = this.container.find(".dropdown-menu"), this.triggerElement = e, this.guard = null
    }, t.extend(e.Dropdown.prototype, {
        open: function() {
            function n(n) {
                r.guard && (r.element.attr("data-sticky") && (r.element[0] === n.target || t.contains(r.element[0], n.target)) || (e.Sound.isAttentionTarget(t(n.target)) || e.Sound.playActivationSound(r.triggerElement), r.close()))
            }
            function o() {
                r.guard && (e.Sound.playActivationSound(r.triggerElement), r.close())
            }
            function i() {
                r.triggerElement.attr("data-sound", "SE_WAVE_BALLOON_CLOSE"), t(document).on("click", n), t(window).on("scroll", o)
            }
            function a() {
                r.triggerElement.attr("data-sound", "SE_WAVE_BALLOON_OPEN"), t(document).off("click", n), t(window).off("scroll", o)
            }
            if (!this.guard) {
                e.Dropdown.register(this), this.container.addClass("open"), this.triggerElement.addClass("dropdown-open");
                var r = this,
                    s = this.guard = t.Deferred();
                setTimeout(function() {
                    i(), s.done(a)
                }, 0), this.element.trigger("olv:dropdown", [this, s.promise()])
            }
        },
        close: function() {
            this.guard && (this.guard.resolve(), this.guard = null, e.Dropdown.unregister(this), this.container.removeClass("open"), this.triggerElement.removeClass("dropdown-open"))
        }
    }), t.extend(e.Dropdown, {
        current: null,
        register: function(t) {
            this.current && this.current.close(), this.current = t
        },
        unregister: function(t) {
            if (this.current !== t) throw new Error("Failed to unregister dropdown");
            this.current = null
        },
        setup: function() {
            t(document).on("click", '[data-toggle="dropdown"]', function(n) {
                if (!n.isDefaultPrevented()) {
                    n.preventDefault();
                    var o = t(this);
                    e.Form.isDisabled(o) || o.hasClass("dropdown-open") || new e.Dropdown(o).open()
                }
            })
        }
    }), e.init.done(function() {
        e.Dropdown.setup()
    }), e.ModalWindowManager = {}, e.ModalWindowManager._windows = [], e.ModalWindowManager.currentWindow = null, e.ModalWindowManager.closeAll = function() {
        for (; this.currentWindow;) this.currentWindow.close()
    }, e.ModalWindowManager.closeUntil = function(t) {
        if (t.guard) for (var e;
                          (e = this.currentWindow) && (e.close(), e !== t););
    }, e.ModalWindowManager.register = function(t) {
        this._windows.push(t), this.currentWindow = t
    }, e.ModalWindowManager.unregister = function(t) {
        if (this.currentWindow !== t) throw new Error("Failed to unregister modal window");
        this._windows.pop();
        var e = this._windows.length;
        this.currentWindow = e ? this._windows[e - 1] : null
    }, e.ModalWindowManager.setup = function() {
        t(document).on("click", "[data-modal-open]", function(n) {
            var o = t(this);
            if (!e.Form.isDisabled(o) && !n.isDefaultPrevented()) {
                n.preventDefault();
                var i = t.Event("olv:modalopen");
                o.trigger(i), i.isDefaultPrevented() || e.ModalWindowManager.createNewModal(this).open()
            }
        }), t(document).on("click", ".olv-modal-close-button", function(t) {
            if (!t.isDefaultPrevented()) {
                t.preventDefault();
                var n = e.ModalWindowManager.currentWindow;
                n && n.close()
            }
        }), t(document).on("olv:modal", function(t, n, o) {
            e.Content.autopagerize.disable(o)
        })
    }, e.ModalWindowManager.createNewModal = function(n) {
        var o = t(n),
            i = t(o.attr("data-modal-open"));
        return i.attr("data-is-template") && (i = i.clone().removeAttr("id")), new e.ModalWindow(i, n)
    }, e.ModalWindowManager.setupWindowPage = function(n) {
        if (!this.currentWindow) {
            var o = t(".modal-window-open");
            o.length && new e.ModalWindow(o.first()).triggerOpenHandlers(n)
        }
    }, e.init.done(function() {
        e.ModalWindowManager.setup()
    }), e.router.connect(/^/, function(t, n, o) {
        e.ModalWindowManager.setupWindowPage(o)
    }), t(document).on("olv:pagechange", function() {
        e.ModalWindowManager.closeAll()
    }), e.ModalWindow = function(e, n) {
        this.element = t(e), this.triggerElement = t(n), this.temporary = !this.element.parent().length, this.prevScroll = 0, this.prevContent = t();
        var o = t.trim(this.element.attr("data-modal-types"));
        this.types = o ? o.split(/\s+/) : [], this.guard = null
    }, e.ModalWindow.prototype.open = function() {
        if (!this.guard) return document.activeElement.blur(), e.ModalWindowManager.register(this), this.prevScroll = window.scrollY, this.temporary && this.element.appendTo("#body"), this.element.css({
            position: "absolute",
            left: 0,
            top: 0
        }).addClass("modal-window-open").removeClass("none"), this.prevContent = this.element.parentsUntil(document.body).andSelf().siblings().filter(function() {
            return !t(this).hasClass("none")
        }).addClass("none"), window.scrollTo(0, 0), this.triggerOpenHandlers(t.Deferred()), this
    }, e.ModalWindow.prototype.triggerOpenHandlers = function(t) {
        this.guard = t;
        for (var e, n = [this, t.promise()], o = 0; e = this.types[o]; o++) this.element.trigger("olv:modal:" + e, n);
        this.element.trigger("olv:modal", n)
    }, e.ModalWindow.prototype.close = function() {
        if (this.guard) return this.guard.resolve(), this.guard = null, e.ModalWindowManager.unregister(this), this.element.trigger("olv:modalclose"), this.temporary && this.element.remove(), this.element.addClass("none").removeClass("modal-window-open"), this.prevContent.removeClass("none"), window.scrollTo(0, this.prevScroll), this.prevContent = t(), this.prevScroll = 0, this
    }, e.ConfirmDialog = function(n) {
        var o = t((n = n || {}).template || "#confirm-dialog-template").clone().attr("id", "olvdialog" + (new Date).getTime()).attr("data-modal-types", n.modalTypes || "confirm-dialog");
        e.ModalWindow.call(this, o, n.triggerElement), o.find(".ok-button").on("click", t.proxy(function(e) {
            t(this).triggerHandler("dialogok", e), e.preventDefault()
        }, this)), o.find(".cancel-button").on("click", t.proxy(function(e) {
            t(this).triggerHandler("dialogcancel", e), this.close(), e.preventDefault()
        }, this)), this.title(n.title).body(n.body).setButtonLabels({
            ok: n.okLabel,
            cancel: n.cancelLabel
        })
    }, t.extend(e.ConfirmDialog.prototype, e.ModalWindow.prototype, {
        title: function(t) {
            var e = this.element.find(".window-title");
            return void 0 === t ? e.text() : (e.text(t), this)
        },
        htmlLineBreak: function(t) {
            var e = {
                "<": "&lt;",
                ">": "&gt",
                "&": "&amp;",
                '"': "&quot"
            };
            return t.replace(/[<>&\"]/g, function(t) {
                return e[t]
            }).replace(/\n|\r\n?/g, function(t) {
                return "<br>" + t
            })
        },
        body: function(t) {
            var e = this.element.find(".window-body .message p");
            return void 0 === t ? e.text() : (e.html(this.htmlLineBreak(t)), this)
        },
        setButtonLabels: function(t) {
            return t.ok && this.element.find(".ok-button").text(t.ok), t.cancel && this.element.find(".cancel-button").text(t.cancel), this
        },
        ok: function(e) {
            return t(this).on("dialogok", e), this
        },
        cancel: function(e) {
            return t(this).on("dialogcancel", e), this
        }
    }), e.showConfirm = function(n, o, i) {
        return new e.ConfirmDialog(t.extend({
            title: n,
            body: o
        }, i)).open()
    }, e.MessageDialog = function(n) {
        e.ConfirmDialog.call(this, t.extend(n, {
            template: "#message-dialog-template"
        })), t(this.element).on("click", ".single-button .button", t.proxy(function(t) {
            this.close()
        }, this))
    }, t.extend(e.MessageDialog.prototype, e.ConfirmDialog.prototype), e.showMessage = function(n, o, i) {
        return new e.MessageDialog(t.extend({
            title: n,
            body: o
        }, i)).open()
    }, e.router.connect("", function() {
        t("#global-menu li").removeClass("selected")
    }), t([
        ["^(/my_menu|/settings|/my_communities|/my_blacklist|/welcome/profile)", "#global-menu-mymenu"],
        ["^/$", "#global-menu-feed"],
        ["^/titles(?:/|$)", "#global-menu-community"],
        ["^/communities(?:/|$)", "#global-menu-community"],
        ["^/(?:friend_messages(?:/|$)|admin_messages$)", "#global-menu-message"],
        ["^/news/", "#global-menu-news"]
    ]).each(function(n, o) {
        e.router.connect(o[0], function() {
            t(o[1]).addClass("selected")
        })
    }), e.router.connect("^/users/[0-9a-zA-Z\\-_.]+(?:/posts|/diary|/empathies|/friends|/followers|/following)?$", function() {
        new RegExp("^" + t("body").attr("data-profile-url") + "(?:/posts|/diary|/empathies|/friends|/followers|/following)?$").test(location.pathname) && t("#global-menu-mymenu").addClass("selected")
    }), e.init.done(function(t) {
        function n() {
            var e = t("body").attr("data-profile-url"),
                n = new RegExp("^(?:/|/communities|/friend_messages|/news/.+?|" + e + "|/welcome/profile)$"),
                a = wiiuBrowser.canHistoryBack() && !n.test(location.pathname);
            o.toggleClass("none", a), i.toggleClass("none", !a)
        }
        var o = t("#global-menu-exit"),
            i = t("#global-menu-back");
        o.on("click", function(t) {
            t.preventDefault(), setTimeout(function() {
                wiiuBrowser.closeApplication()
            }, 0)
        }), i.on("click", function(t) {
            t.preventDefault(), history.back()
        }), e.router.connect(/^/, n), n()
    }), e.init.done(function(t) {
        if (t("#global-menu-news").length) {
            t("#global-menu-news").on("click", function(e) {
                t(e.currentTarget).find(".badge").hide()
            });
            var n = e.UpdateChecker.getInstance();
            t(n).on("update", function(e, o) {
                t.each(n._settings, function(e, n) {
                    t.each(n.params, function(t, e) {
                        void 0 === o[t] && (this.success = !1)
                    }), n.update.call(void 0, o, n.params)
                })
            }), n.onUpdate("check_update", {
                news: {},
                admin_message: {},
                mission: {}
            }, function(e, n) {
                var o = t("#global-menu-news"),
                    i = o.find(".badge");
                0 === i.length && (i = t('<span class="badge">')).hide().appendTo(o.find("a"));
                var a = 0;
                t.each(n, function(t, n) {
                    a += Number(e[t].unread_count)
                }), i.text(a), i.toggle(a > 0)
            }), n.onUpdate("message", {
                message: {}
            }, function(e, n) {
                var o = t("#global-menu-message"),
                    i = o.find(".badge");
                0 === i.length && (i = t('<span class="badge">')).hide().appendTo(o.find("a")), i.text(e.message.unread_count), i.toggle(e.message.unread_count > 0)
            }), t("body").on("pjax:complete", function(t) {
                n.resetInterval()
            }), n.invoke()
        }
    }), t(document).on("click", ".tab-button", function(n) {
        var o = t(this);
        e.Form.isDisabled(o) || o.addClass("selected").removeClass("notify").siblings().removeClass("selected")
    }), e.init.done(function(t) {
        var n;
        try {
            n = wiiuPDM.getTitlesFilteredByPlayTime("1").IDs
        } catch (t) {
            try {
                n = wiiuPDM.getTitlesFilteredByPlayTime(1).IDs
            } catch (t) {}
        }
        n || (n = []), e.Net.ajax({
            type: "POST",
            url: "/settings/played_title_ids",
            data: n.map(function(t) {
                return {
                    name: "title_id_hex",
                    value: t
                }
            }),
            silent: !0
        })
    }), e.router.connect("", function(n, o, i) {
        function a(t) {
            var n = c.scrollTop() > f;
            n !== d && (u.stop().fadeToggle(t ? 0 : 300), e.Form.toggleDisabled(u, !n), d = n)
        }
        function r(t) {
            p || a()
        }
        function s(t) {
            e.Form.isDisabled(u) || t.isDefaultPrevented() || (t.preventDefault(), c.scrollTop(0))
        }
        function l(t, e, n) {
            p++, n.done(function() {
                p--
            })
        }
        var c = t(window),
            u = t("#scroll-to-top");
        if (u.length) {
            var d = !1,
                f = 500,
                p = 0;
            a(!0), c.on("scroll", r), u.on("click", s), t(document).on("olv:modal", l), i.done(function() {
                u.stop(!0, !0).hide(), c.off("scroll", r), u.off("click", s), t(document).off("olv:modal", l)
            })
        }
    }), e.router.connect("", function(n, o, i) {
        var a = function(e) {
            var n, o = t("#body .scroll").filter(":visible"),
                i = t(document.activeElement),
                a = i.closest(".scroll").filter(":visible");
            if (a.length > 0) {
                var r = o.index(a),
                    s = e ? r - 1 : r + 1;
                s >= 0 && s < o.length && (n = t(o.get(s)))
            } else {
                var l = t(document).scrollTop();
                l >= document.body.scrollHeight - t(window).height() ? n = e && o.length > 0 ? o.last() : null : o.each(function() {
                    var o = t(this),
                        i = o.offset().top - l;
                    if (e) {
                        if (i >= 0) return !1;
                        n = o
                    } else if (i > 0) return n = o, !1
                })
            }
            var c;
            c = n ? n.offset().top : e ? 0 : document.body.scrollHeight, window.scrollTo(0, c), n ? (("a" === n[0].nodeName.toLowerCase() ? n : n.find(".scroll-focus").first()).focus(), n.trigger("olv:keyhandler:scroll:element")) : (i.blur(), t(document).trigger("olv:keyhandler:scroll:document"))
        };
        e.AccessKey.bind("L", function() {
            a(!0)
        }, i), e.AccessKey.bind("R", function() {
            a(!1)
        }, i)
    }), e.Content.setupReloadKey = function(t) {
        e.AccessKey.bind("Y", function() {
            e.Browsing.reload()
        }, t)
    }, e.Tutorial = {}, e.Tutorial.setupCloseButtons = function(n) {
        function o(n) {
            var o = t(n.target);
            if (o.parent().hide(), o.attr("data-tutorial-name")) t.post("/settings/tutorial_post", {
                tutorial_name: o.attr("data-tutorial-name")
            }).success(function() {});
            else if (o.attr("data-achievement-name")) {
                var i = o.attr("data-achievement-name").split(/\s*,\s*/);
                e.Achievement.requestAchieveWithoutRegard(i)
            }
            return n.preventDefault()
        }
        t(document).on("click", ".tutorial-close-button", o), n.done(function() {
            t(document).off("click", ".tutorial-close-button", o)
        })
    }, e.Tutorial.setupBalloon = function(e, n) {
        function o(n) {
            n.preventDefault();
            var o = t(n.target).closest(e).attr("data-balloon-target");
            if (o) {
                var i = t(o);
                i.length && i.trigger(n.type)
            }
        }
        for (var i = t(e), a = [], r = 0, s = i.length; r < s; r++) {
            var l = i.eq(r);
            if (l.attr("data-balloon-target")) {
                var c = l.attr("data-balloon-target");
                a.push([c, function(t) {
                    return function(e) {
                        t.hide()
                    }
                }(l)])
            }
        }
        for (t(document).on("click", e, o), r = 0, s = a.length; r < s; r++) t(document).on("click", a[r][0], a[r][1]);
        n.done(function() {
            t(document).off("click", e, o);
            for (var n = 0, i = a.length; n < i; n++) t(document).off("click", a[n][0], a[n][1])
        })
    }, e.Community = {}, e.Community.setupInfoTicker = function(n) {
        function o(o) {
            var s = t(this);
            e.Form.isDisabled(s) || o.isDefaultPrevented() || (s.attr("data-pjax") ? n.done(function() {
                i.remove()
            }) : (o.preventDefault(), i.remove()), a.set(r, Math.floor(+new Date / 1e3)), a.save(), i.attr("data-is-of-miiverse") && t.post("/settings/miiverse_info_post"))
        }
        var i = t(".info-ticker");
        if (i.length) {
            var a = e.Storage.local().getBranch("community.info-ticker"),
                r = "last-seen." + i.attr("data-olive-title-id"),
                s = a.get(r) || 0,
                l = +i.attr("data-last-seen") || 0;
            l > s && (s = l, a.set(r, s), a.save()), s < +i.attr("data-last-posted") ? (i.removeClass("none"), i.on("click", "a[href]", o), n.done(function() {
                i.off("click", "a[href]", o)
            })) : i.remove()
        }
    }, e.Community.setupFavoriteButtons = function(n) {
        function o(n) {
            var o = t(this);
            if (!e.Form.isDisabled(o) && !n.isDefaultPrevented()) {
                n.preventDefault();
                var i = o.hasClass("checked");
                o.toggleClass("checked"), t(document.body).attr("data-is-first-favorite") && !i && e.deferredAlert(e.loc("olv.portal.confirm_first_favorite")).done(function() {
                    t(document.body).removeAttr("data-is-first-favorite")
                });
                var a = o.attr(i ? "data-action-unfavorite" : "data-action-favorite");
                e.Form.post(a, null, o).done(function() {
                    i = !i, o.attr("data-sound", i ? "SE_WAVE_CHECKBOX_UNCHECK" : "SE_WAVE_CHECKBOX_CHECK"), o.trigger("olv:community:favorite:toggle", [i])
                }).fail(function() {
                    o.toggleClass("checked", i)
                })
            }
        }
        t(document).on("click", ".favorite-button", o), n.done(function() {
            t(document).off("click", ".favorite-button", o)
        })
    }, e.Community.setupUnfavoriteButtons = function(n) {
        function o(n) {
            var o = t(this);
            e.Form.isDisabled(o) || (e.Form.post(o.attr("data-action"), null, o).done(function() {
                e.deferredAlert(e.loc("olv.portal.unfavorite_succeeded_to")), o.add(o.prev()).remove()
            }), n.preventDefault())
        }
        t(document).on("click", ".unfavorite-button", o), n.done(function() {
            t(document).off("click", ".unfavorite-button", o)
        })
    }, e.Community.setupAppJumpButtons = function(n) {
        function o(n) {
            if (wiiuDevice.existsTitle) {
                for (var o, i = t(this), a = i.attr("data-app-jump-title-ids").split(","), r = 0; r < a.length; r++) if (wiiuDevice.existsTitle(a[r])) {
                    o = a[r];
                    break
                }
                o ? e.deferredConfirm(e.loc("olv.portal.confirm_app_jump")).done(function(t) {
                    if (t) {
                        var e = o,
                            n = +i.attr("data-nex-community-id"),
                            a = i.attr("data-app-data");
                        wiiuBrowser.jumpToApplication(e, 1, n || -1, a || "", "")
                    }
                }) : e.deferredAlert(e.loc("olv.portal.confirm_you_have_no_soft"))
            }
        }
        t(document).on("click", ".app-jump-button", o), n.done(function() {
            t(document).off("click", ".app-jump-button", o)
        })
    }, e.Community.setupShopButtons = function(n) {
        function o(n) {
            var o = t(this);
            e.Form.isDisabled(o) || n.isDefaultPrevented() || (n.preventDefault(), e.deferredConfirm(e.loc("olv.portal.confirm_open_eshop")).done(function(e) {
                if (e) {
                    var n = {
                        version: "1.0.0",
                        scene: "detail",
                        dst_title_id: o.attr("data-dst-title-id"),
                        src_title_id: o.attr("data-src-title-id")
                    };
                    t(document).trigger("olv:jump:eshop", [n]);
                    var i = t.param(n);
                    wiiuBrowser.jumpToEshop(i)
                }
            }))
        }
        t(document).on("click", ".eshop-button", o), n.done(function() {
            t(document).off("click", ".eshop-button", o)
        })
    }, e.Community.setupPostButton = function(e) {
        function n() {
            return "1" === t(".tab-button.selected").attr("data-show-post-button") || "1" === t(".post-headline").attr("data-show-post-button")
        }! function() {
            var e = n();
            t("#header-post-button").toggleClass("none", !e)
        }()
    }, e.Community.setupURLSelector = function(e, n) {
        function o(e) {
            var n = i.val();
            n && t.pjax({
                url: n,
                container: "#body"
            })
        }
        var i = t(e);
        i.on("change", o), n.done(function() {
            i.off("change", o)
        })
    }, e.Community.setupSelectButton = function(n, o) {
        function i(t) {
            e.Form.syncSelectedText(a)
        }
        var a = t(n);
        a.on("change", i), o.done(function() {
            a.off("change", i)
        })
    }, e.Community.setupTopicPostButton = function(n) {
        function o(n) {
            var o = t(this);
            e.Form.isDisabled(o) || n.isDefaultPrevented() || (n.preventDefault(), t(".multi_timeline-topic-filter").addClass("open"))
        }
        t(document).on("click", ".js-topic_post-header-post-button", o), n.done(function() {
            t(document).off("click", ".js-topic_post-header-post-button", o)
        })
    }, e.parentalConfirm = function(n) {
        var o = 0,
            i = new e.ConfirmDialog({
                title: e.loc("olv.portal.parental_confirm.title"),
                body: e.loc("olv.portal.parental_confirm.body", e.loc("olv.portal.parental_control.function." + n)),
                template: "#parental-confirm-dialog-template"
            }),
            a = t(i.element).find("input.parental_code");
        return i.ok(function(t) {
            var n = wiiuSystemSetting.checkParentalPinCode(a.val());
            a.val(""), !0 === n.result ? this.close() : (t.preventDefault(), o++, e.deferredAlert(e.loc("olv.portal.parental_confirm." + (o < 3 ? "fail_message" : "fail_many_times_message"))))
        }).open(), i
    }, e.init.done(function(t) {
        t(document.body).on("click", "[data-parental-confirm]", function(n) {
            if (!n.isDefaultPrevented()) {
                n.preventDefault();
                var o = t(this);
                e.parentalConfirm(t(n.target).attr("data-parental-confirm")).ok(function(t) {
                    t.isDefaultPrevented() || (o.removeAttr("data-parental-confirm"), setTimeout(function() {
                        o.trigger("click")
                    }))
                })
            }
        })
    }), t(document).on("olv:modal:select-settings", function(n, o, i) {
        o.element.on("click.olvSelectSettings", ".post-button", function(n) {
            var i = t(this);
            if (!e.Form.isDisabled(i) && !n.isDefaultPrevented()) if (n.preventDefault(), i.hasClass("selected")) o.close();
            else {
                var a = i.closest(".settings-page"),
                    r = a.attr("data-name"),
                    s = a.attr("data-action");
                if ("notice_opt_in" === r || "luminous_opt_in" === r) {
                    var l = {
                            notice_opt_in: {
                                1: "registerBossTask",
                                0: "unregisterBossTask"
                            },
                            luminous_opt_in: {
                                1: "registerDirectMessageTaskEx",
                                0: "unregisterDirectMessageTask"
                            }
                        }, c = +t(this).val(),
                        u = l[r][c],
                        d = e.Utils.callWiiuBOSSFuncWithFallback(u);
                    return d.error ? void e.ErrorViewer.open(d.error) : (i.addClass("selected"), i.siblings().removeClass("selected"), o.triggerElement.text(i.text()), void o.close())
                }
                var f = {};
                f[r] = i.val(), e.Form.post(s, f, i, !0).done(function(t) {
                    o.triggerElement.text(i.text()), i.addClass("selected"), i.siblings().removeClass("selected")
                }).always(function() {
                    o.close()
                })
            }
        }), i.done(function() {
            o.element.off(".olvSelectSettings")
        })
    }), t(document).on("olv:modal:title-settings", function(n, o, i) {
        var a = o.element.find(".settings-button"),
            r = a.get().map(function(e) {
                return t(e).text()
            }),
            s = o.element.find(".close-button");
        s.on("click", function(n) {
            var i = a.get().some(function(e, n) {
                return t(e).text() !== r[n]
            });
            o.close(), i && e.Browsing.reload()
        }), i.done(function() {
            s.off("click")
        })
    }), t(document).on("olv:modal:preview-body", function(e, n, o) {
        var i = [],
            a = n.element.find('input[name="body"],textarea[name="body"],[data-overlaid-preview]');
        a.each(function() {
            var e, n = t(this);
            n.attr("data-preview-class", function(t, n) {
                return e = n || "textarea-text-preview"
            });
            var o = t("<div/>").addClass(e).insertAfter(n);
            i.push(o)
        });
        var r = function(e) {
            var o = t(e.target),
                i = o.val(),
                a = o.attr("data-preview-class"),
                r = n.element.find("." + a);
            r.text(i || o.attr("placeholder")), r.toggleClass("placeholder", !i)
        };
        a.on("input", r), a.trigger("input"), o.done(function() {
            a.off("input", r), t(i).remove()
        })
    }), t(document).on("olv:modal:require-body", function(e, n, o) {
        function i() {
            var e = /^\s*$/,
                n = s.length ? [s] : [r];
            return t(n).is(function() {
                return !e.test(t(this).val())
            })
        }
        function a() {
            return d.filter(function() {
                return !t(this).val()
            }).length > 0
        }
        var r = n.element.find('input[name="body"],textarea[name="body"]'),
            s = n.element.find(".js-topic-title-input"),
            l = n.element.find('input[name="painting"]'),
            c = n.element.find('input[name="_post_type"]'),
            u = n.element.find('input[name="_post_type"][value="body"]'),
            d = n.element.find("select[data-required]"),
            f = n.element.find(".post-button"),
            p = function() {
                var t = !u.length || u.prop("checked") ? !i() || a() : !l.val();
                f.prop("disabled", t)
            };
        s.on("input", p), r.on("input", p), c.on("click", p), d.on("change", p), p(), o.done(function() {
            r.off("input", p), c.off("click", p)
        })
    }), e.UserSearchButton = function(e, n) {
        this.element = e, e.on("input.userSearch", t.proxy(function(t) {
            "" !== e.val() && (this.search(e.val()), e.val(""), t.preventDefault())
        }, this)), n.done(function() {
            e.off(".userSearch")
        })
    }, t.extend(e.UserSearchButton.prototype, {
        search: function(e) {
            t(document).trigger("olv:usersearch:search"), t.pjax({
                url: "/users?query=" + encodeURIComponent(e),
                container: this.element.attr("data-pjax")
            })
        }
    }), e.TitleSearchButton = function(e, n) {
        this.element = e, e.on("input.titleSearch", t.proxy(function(t) {
            "" !== e.val() && (this.search(e.val()), e.val(""), t.preventDefault())
        }, this)), n.done(function() {
            e.off(".titleSearch")
        })
    }, t.extend(e.TitleSearchButton.prototype, {
        search: function(e) {
            t(document).trigger("olv:titlesearch:search"), t.pjax({
                url: "/titles/search?query=" + encodeURIComponent(e),
                container: this.element.attr("data-pjax")
            })
        }
    }), e.YouTubePlayer = {}, e.YouTubePlayer.isApiLoaded = !1, e.YouTubePlayer.setupQualityButton = function(n) {
        function o() {
            r = new YT.Player("post-video-player", {
                height: "504",
                width: "900",
                videoId: t("#post-video-player").attr("data-video-id"),
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 3
                },
                events: {
                    onStateChange: i
                }
            })
        }
        function i(t) {
            t.data === YT.PlayerState.PLAYING && r.setPlaybackQuality(s.prop("checked") ? "hd720" : "medium")
        }
        function a(n) {
            if (!e.Form.isDisabled(s) && !n.isDefaultPrevented()) {
                var o = s.prop("checked");
                if (t.post("/settings/struct_video_quality", {
                    is_hd: o ? 1 : 0
                }).success(function() {}), r) try {
                    r.setPlaybackQuality(o ? "hd720" : "medium")
                } catch (t) {}
            }
        }
        var r, s = t('#video-hd-button input[name="is_hd"]');
        if (e.YouTubePlayer.isApiLoaded) YT && o();
        else {
            var l = document.createElement("script");
            l.src = "https://www.youtube.com/iframe_api", document.getElementsByTagName("head")[0].appendChild(l), window.onYouTubeIframeAPIReady = o, e.YouTubePlayer.isApiLoaded = !0
        }
        s.on("click", a), n.done(function() {
            s.off("click", a)
        })
    }, e.User = {}, e.User.setupFollowButton = function(n, o) {
        function i(n) {
            var o = t(this);
            e.Form.isDisabled(o) || (e.Form.post(o.attr("data-action"), null, o).done(function(e) {
                if (o.addClass("none").siblings().removeClass("none"), t(o).hasClass("relationship-button")) {
                    var n = Array.prototype.slice.call(arguments);
                    n.unshift(null), t(o).trigger("olv:relationship:change:done", n)
                }
                "following_count" in e && t(o).trigger("olv:visitor:following-count:change", [e.following_count])
            }), n.preventDefault())
        }
        function a(n, i, a, r, s, l) {
            o.noReloadOnFollow && t(n.target).hasClass("follow-button") && !0 === a.can_follow_more || e.Browsing.reload()
        }
        function r(t, n, o, i, a, r) {
            r && a.status && 503 !== a.status && e.Browsing.reload()
        }
        o = t.extend({
            noReloadOnFollow: !1
        }, o), t(document).on("click", ".toggle-button .follow-button", i), t(document).on("olv:relationship:change:done", ".relationship-button", a), t(document).on("olv:relationship:change:fail", ".relationship-button", r), n.done(function() {
            t(document).off("click", ".toggle-button .follow-button", i), t(document).off("olv:relationship:change:done", ".relationship-button", a), t(document).off("olv:relationship:change:fail", ".relationship-button", r)
        })
    }, e.User.setupAchievement = function(n) {
        function o(n) {
            var o = t(n.target),
                i = o.attr("data-achievement-name");
            i && e.Achievement.requestAchieveWithoutRegard([i]).done(function(t) {
                o.trigger("olv:achievement:update:done", [t])
            })
        }
        t(document).on("olv:achievement:update", o), n.done(function() {
            t(document).off("olv:achievement:update", o)
        })
    }, e.UserProfile = {}, e.UserProfile.setupFavoriteGameGenreSelectors = function(n, o) {
        function i(t) {
            return t.map(function(t) {
                return ":not(" + t + ")"
            }).join("")
        }
        function a(e) {
            var n = t(e),
                o = s.find("select[name=" + n.attr("name") + "]"),
                a = o.filter(i(["#" + n.attr("id")])),
                r = a.find("option[value=" + n.val() + "][data-is-configurable]"),
                l = i(o.find(":selected").map(function() {
                    return t(this).val()
                }).get().map(function(t) {
                    return "[value=" + t + "]"
                })),
                c = a.find(l);
            r.prop("disabled", !0), c.prop("disabled", !1)
        }
        function r() {
            var n = t(this),
                o = n.closest("form");
            e.Form.syncSelectedText(n), e.Form.submit(o).done(function() {
                n.trigger("olv:profile:favorite-game-genre:change")
            }), a(this)
        }
        var s = t(n),
            l = s.find("select[name=favorite_game_genre]");
        l.each(function() {
            a(this)
        }), l.on("change", r), o.done(function() {
            l.off("change", r)
        })
    }, e.EntryFormAlbumImageSelector = {}, e.EntryFormAlbumImageSelector.setup = function(e) {
        var n = function(t, e) {
            var n = t.element.find(".js-album-list-pager"),
                o = n.attr("data-max-page-number");
            e > o || e < 1 || (t.element.find(".js-album-selector-page[data-page-number=" + e + "]").toggleClass("none", !1).siblings(".js-album-selector-page").toggleClass("none", !0), n.toggleClass("back-button-disabled", 1 == e), n.toggleClass("next-button-disabled", e == o), n.attr("data-current-page-number", e), n.find(".js-curent-page-number").text(e))
        }, o = function(e, o, i) {
            var a = function(e) {
                e.preventDefault();
                var n = t(e.target);
                n.trigger("olv:albumImageSelector:submit", [n.attr("data-album-image-id"), n.attr("data-album-image-preview-src")]), o.close()
            }, r = o.element.find(".js-album-image-link");
            r.on("click", a);
            var s = o.element.find(".js-album-list-pager");
            if (s.length) {
                var l = function(t) {
                    t.preventDefault(), n(o, parseInt(s.attr("data-current-page-number")) - 1)
                }, c = function(t) {
                    t.preventDefault(), n(o, parseInt(s.attr("data-current-page-number")) + 1)
                }, u = o.element.find(".js-page-back-button");
                u.on("click", l);
                var d = o.element.find(".js-page-next-button");
                d.on("click", c), n(o, 1), i.done(function() {
                    u.off("click", l), d.off("click", c)
                })
            }
            i.done(function() {
                r.off("click", a)
            })
        };
        t(document).on("olv:modal:album-image-selector", o), e.done(function() {
            t(document).off("olv:modal:album-image-selector", o)
        })
    }, e.Entry = {}, e.Entry.setupHiddenContents = function(e) {
        function n(e) {
            if (!e.isDefaultPrevented()) {
                e.preventDefault();
                var n = t(this),
                    o = n.closest(".hidden");
                o.removeClass("hidden"), o.find("[data-href-hidden]").each(function() {
                    var e = t(this);
                    e.attr(e.is("a") ? "href" : "data-href", e.attr("data-href-hidden"))
                }), n.closest(".hidden-content").remove()
            }
        }
        t(document).on("click", ".hidden-content-button", n), e.done(function() {
            t(document).off("click", ".hidden-content-button", n)
        })
    }, e.Entry._loadingEmpathies = [], e.Entry.toggleEmpathy = function(n) {
        var o = e.Entry._loadingEmpathies;
        if (o.some(function(t) {
            return t[0] === n[0]
        })) return t.Deferred().reject(null, "duplicate", null, !0);
        var i = e.Entry.isEmpathyAdded(n),
            a = n.attr("data-action");
        i && (a += ".delete");
        var r = e.Form.post(a, null, n).done(function() {
            i = !i, n.toggleClass("empathy-added", i);
            var t = n.attr("data-feeling") || "normal";
            n.text(e.loc("olv.portal.miitoo." + t + (i ? ".delete" : ""))), n.attr("data-sound", i ? "SE_WAVE_MII_CANCEL" : "SE_WAVE_MII_ADD"), n.trigger("olv:entry:empathy:toggle", [i])
        }).always(function() {
            o.some(function(t, e) {
                return t[0] === n[0] && !! o.splice(e, 1)
            })
        });
        return o.push([n[0], r]), r
    }, e.Entry.abortLoadingEmpathies = function() {
        e.Entry._loadingEmpathies.concat().forEach(function(t) {
            t[1].abort()
        })
    }, t(document).on("olv:pagechange", e.Entry.abortLoadingEmpathies), e.Entry.isEmpathyAdded = function(t) {
        return t.hasClass("empathy-added")
    }, e.Entry.setupEmpathyButtons = function(n, o) {
        function i(o) {
            if (!o.isDefaultPrevented()) {
                o.preventDefault();
                var i = t(this);
                e.Form.isDisabled(i) || e.Entry.toggleEmpathy(i).done(function() {
                    var t = e.Entry.isEmpathyAdded(i),
                        o = i.closest(n).find(".to-permalink-button .feeling");
                    o.text(+o.text() + (t ? 1 : -1))
                })
            }
        }
        t(document).on("click", ".miitoo-button", i), o.done(function() {
            t(document).off("click", ".miitoo-button", i)
        })
    }, e.Entry.setupPostEmpathyButton = function(n, o) {
        function i() {
            var t = e.Entry.isEmpathyAdded(r),
                n = +r.attr("data-other-empathy-count"),
                o = n > 0 ? e.loc_n(t ? "olv.portal.empathy.you_and_n_added" : "olv.portal.empathy.n_added", n, n) : t ? e.loc("olv.portal.empathy.you_added") : "";
            s.text(o), a.toggleClass("no-empathy", !o)
        }
        var a = t(n),
            r = a.find(".miitoo-button"),
            s = a.find(".post-permalink-feeling-text"),
            l = a.find(".post-permalink-feeling-icon-container");
        i(), r.on("click", function(n) {
            if (!n.isDefaultPrevented()) {
                n.preventDefault();
                var o = t(this);
                e.Form.isDisabled(o) || e.Entry.toggleEmpathy(o).done(function() {
                    var t = e.Entry.isEmpathyAdded(o);
                    l.find(".visitor").toggle(t), l.find(".extra").toggle(!t), i()
                })
            }
        }), o.done(function() {
            r.off("click")
        })
    }, e.Entry.setupBodyLanguageSelector = function(e) {
        function n(e) {
            var n = t(o[0].options[o[0].selectedIndex]);
            i.text(n.text());
            var a = o.val();
            t("#body-language-" + a).toggleClass("none", !1).siblings(".multi-language-body").toggleClass("none", !0)
        }
        var o = t("#body-language-selector"),
            i = o.siblings("span.select-button-content");
        o.on("change", n), e.done(function() {
            o.off("change", n)
        })
    }, e.Entry.setupMoreContentButton = function(n) {
        function o(e) {
            e.preventDefault();
            var n = t(e.target);
            n.prev().find(".wrapped").removeClass("none"), n.remove()
        }
        var i = t(".post-subtype-default #post-permalink-body.official-user .post-content-text");
        i && 0 != i.length && (i.each(function() {
            var o = t(this),
                i = o.text().match(/([\s\S]+)(\n+---+\n[\s\S]+)/);
            if (i) {
                o.text(i[1]);
                var a = t('<span class="wrapped none"></span>').text(i[2]);
                o.append(a);
                var r = t('<a href="#" class="more-content-button"></a>');
                r.text(e.loc("olv.portal.read_more_content")), o.after(r), n.done(function() {
                    r.remove()
                })
            }
        }), t(document).on("click", ".more-content-button", o), n.done(function() {
            t(document).off("click", ".more-content-button", o)
        }))
    }, e.Entry.setupAppJumpButton = function(n) {
        function o(n) {
            if (wiiuDevice.existsTitle) {
                var o = t(this),
                    i = o.attr("data-app-jump-title-ids").split(","),
                    a = o.attr("data-title-id");
                a && i.unshift(a);
                for (var r, s = 0; s < i.length; s++) if (wiiuDevice.existsTitle(i[s])) {
                    r = i[s];
                    break
                }
                r ? e.deferredConfirm(e.loc("olv.portal.confirm_app_jump")).done(function(t) {
                    if (t) {
                        var e = r,
                            n = +o.attr("data-nex-community-id"),
                            i = o.attr("data-app-data"),
                            a = o.attr("data-url-id");
                        wiiuBrowser.jumpToApplication(e, 2, n || -1, i || "", a || "")
                    }
                }) : e.deferredAlert(e.loc("olv.portal.confirm_you_have_no_soft"))
            }
        }
        t(document).on("click", ".app-jump-button", o), n.done(function() {
            t(document).off("click", ".app-jump-button", o)
        })
    }, e.Entry.setupMoreRepliesButton = function(n) {
        function o(n) {
            n.preventDefault();
            var o = t(this);
            a || e.Form.isDisabled(o) || (o.addClass("loading"), a = e.Form.get(o.attr("href"), null, o, !0).done(function(e) {
                var n = t(e);
                if (o.hasClass("all-replies-button")) {
                    o.remove();
                    var a = n.filter(".post-permalink-reply").children().filter(function() {
                        return !t("#" + this.id).length
                    });
                    i.find(".post-permalink-reply").prepend(a)
                } else i.empty().append(n);
                o.hasClass("newer-replies-button") ? r.scrollTop(t("#post-permalink-comments").offset().top) : o.hasClass("older-replies-button") && r.scrollTop(t(document).height())
            }).always(function() {
                o.removeClass("loading"), a = null
            }))
        }
        var i = t("#post-permalink-comments"),
            a = null,
            r = t(window);
        t(document).on("click", ".more-button", o), n.done(function() {
            t(document).off("click", ".more-button", o), a && a.abort()
        })
    }, e.Entry.mayIncrementMoreRepliesButtonCount = function(n) {
        var o = t(".oldest-replies-button, .all-replies-button");
        if (0 !== o.length && void 0 != n && 0 != n) {
            var i = +o.attr("data-reply-count");
            i += n, o.text(e.loc_n("olv.portal.post.show_all_n_comments", i, i)), o.attr("data-reply-count", i)
        }
    }, e.Entry.setupFirstPostNotice = function(n, o) {
        function i(n) {
            t(document.body).attr("data-is-first-post") && !e.Form.isDisabled(t(this)) && e.deferredAlert(e.loc("olv.portal.confirm_display_played_mark")).done(function() {
                t(document.body).removeAttr("data-is-first-post"), t.post("/settings/struct_post").fail(function() {
                    t(document.body).attr("data-is-first-post", "1")
                })
            })
        }
        t(document).on("click", n, i), o.done(function() {
            t(document).off("click", n, i)
        })
    }, e.Entry.setupCreateDiaryOrSaveScreenshotWindow = function(n, o) {
        function i(n) {
            var o = !1,
                i = n.find(".js-diary-screenshot-window-image-container");
            if (!i.length) return o;
            var a = i.find(".js-screenshot-capture-button");
            if (a.each(function(e, n) {
                var i = t(n),
                    a = null;
                try {
                    a = wiiuMainApplication.getScreenShot(i.hasClass("js-tv"))
                } catch (t) {}
                a && (i.find("img").prop("src", "data:image/jpeg;base64," + a), i.find('input[type="radio"]').prop("disabled", !1), o = !0)
            }), o) for (var r = 0, s = a.length; r < s; r++) {
                var l = a.eq(r).find("input[type=radio]");
                if (!l.prop("disabled")) {
                    l.prop("checked", !0), e.Form.updateParentClass(l.get(0));
                    break
                }
            }
            return o
        }
        function a() {
            var t = null,
                e = l.find(".js-diary-screenshot-window-image-container").find(".checked").find("img").attr("src");
            return e && (t = e.match(/data:image\/jpeg;base64,(.+)/)[1]), t
        }
        function r(t, n, o) {
            e.EntryForm.setupDiaryPostModal(n, a())
        }
        function s() {
            var n = l.find(".js-save-album"),
                o = n.find(".js-save-album-button");
            e.Form.isDisabled(o) || (n.find("input[name=screenshot]").val(a()), event.preventDefault(), e.Form.submit(n, o, !0).done(function() {
                e.showConfirm(e.loc("olv.portal.album.save_album_image"), e.loc("olv.portal.album.save_album_image.confirm"), {
                    okLabel: e.loc("olv.portal.continue_miiverse"),
                    cancelLabel: e.loc("olv.portal.return_to_game")
                }).ok(function() {
                    t.pjax({
                        url: n.attr("data-redirect-url"),
                        container: n.attr("data-redirect-pjax")
                    })
                }).cancel(function() {
                    setTimeout(function() {
                        wiiuBrowser.closeApplication()
                    }, 0)
                })
            }))
        }
        var l = t(n).eq(0); !! +l.attr("data-can-create") && i(l) && l.toggleClass("no-screenshots", !1), l.toggleClass("none", !1), t(document).on("olv:modal:add-diary-post", r), l.find(".js-save-album-button").on("click", s), o.done(function() {
            t(document).off("olv:modal:add-diary-post", r), l.find(".js-save-album-button").off("click", s)
        })
    }, t(document).on("olv:modal:capture", function(t, e, n) {
        e.element.find(".capture").attr("src", e.triggerElement.attr("data-large-capture-url"))
    }), t(document).on("olv:modal:confirm-app-jump", function(t, e, n) {
        var o = e.element.find(".post-button");
        o.on("click", function(t) {
            var n = e.element.attr("data-app-jump-title"),
                i = +o.attr("data-nex-community-id"),
                a = o.attr("data-app-data"),
                r = o.attr("data-url-id");
            wiiuBrowser.jumpToApplication(n, 2, i || -1, a || "", r || "")
        }), n.done(function() {
            o.off("click")
        })
    }), t(document).on("olv:modal:confirm-url", function(t, e, n) {
        var o = e.element.find(".post-button");
        o.on("click", function(t) {
            var n = e.element.find(".link-url").text();
            wiiuBrowser.jumpToBrowser(n)
        }), n.done(function() {
            o.off("click")
        })
    }), t(document).on("olv:modal:report", function(t, n, o) {
        var i = n.element.find("form"),
            a = i.find(".post-button");
        a.on("click", function(t) {
            e.Form.isDisabled(a) || t.isDefaultPrevented() || (t.preventDefault(), e.Form.submit(i, a, !0).done(function() {
                n.close(), e.Browsing.reload()
            }))
        }), o.done(function() {
            a.off("click")
        })
    }), t(document).on("olv:modal:report-violator olv:modal:reply-admin-message", function(e, n, o) {
        function i() {
            var e = t(r[0].options[r[0].selectedIndex]);
            c.text(e.text());
            var n = !! r.val();
            s.css("display", n ? "" : "none"), l.prop("disabled", !n)
        }
        function a() {
            var e = !! t(r[0].options[r[0].selectedIndex]).attr("data-body-required"),
                n = !! r.val(),
                o = e && /^\s*$/.test(s.val()) || !n;
            l.prop("disabled", o)
        }
        var r = n.element.find('select[name="type"]'),
            s = n.element.find('textarea[name="body"]'),
            l = n.element.find(".post-button"),
            c = n.element.find("span.select-button-content");
        i(), a(), s.on("input", a), r.on("change", i), r.on("change", a), o.done(function() {
            s.off("input", a), r.off("change", i), r.off("change", a)
        })
    }), t(document).on("olv:modal:report-violation", function(n, o, i) {
        function a() {
            var e = t(d[0].options[d[0].selectedIndex]);
            m.text(e.text());
            var n = !! d.val();
            f.css("display", n ? "" : "none")
        }
        function r() {
            var e = !! t(d[0].options[d[0].selectedIndex]).attr("data-body-required"),
                n = !! d.val(),
                o = e && /^\s*$/.test(f.val()) || !n;
            p.prop("disabled", o)
        }
        var s = !! o.triggerElement.attr("data-is-post"),
            l = !! o.triggerElement.attr("data-is-message"),
            c = e.loc(s ? "olv.portal.report.report_violation" : l ? "olv.portal.report.report_violation_message" : "olv.portal.report.report_violation_comment", o.triggerElement.attr("data-screen-name")),
            u = e.loc(s ? "olv.portal.report.report_post_id" : l ? "olv.portal.report.report_message_id" : "olv.portal.report.report_comment_id", o.triggerElement.attr("data-support-text"));
        o.element.find(".window-title").text(c), o.element.find(".post-id").text(u), o.element.find("form").attr("action", o.triggerElement.attr("data-action"));
        var d = "1" === o.triggerElement.attr("data-can-report-spoiler") ? o.element.find("select.can-report-spoiler") : o.element.find("select.cannot-report-spoiler");
        o.element.find('select[name="type"]').hide().prop("disabled", !0), d.show().prop("disabled", !1);
        var f = o.element.find('textarea[name="body"]'),
            p = o.element.find(".post-button"),
            m = o.element.find("span.select-button-content");
        a(), r(), f.on("input", r), d.on("change", a), d.on("change", r), i.done(function() {
            f.off("input", r), d.off("change", a), d.off("change", r)
        })
    }), e.Entry.setupEditButtons = function(n) {
        function o(n) {
            var o = e.Form.post(n.action, {
                format: "html"
            }, n.button, !0).done(function(e) {
                t("#body").html(e)
            });
            return n.modal.element.trigger("olv:entry:post:delete", n), o
        }
        function i(n) {
            return e.Form.post(n.action, null, n.button, !0).done(function() {
                var e = n.modal.triggerElement.closest("#post-permalink-content, #post-permalink-comments");
                n.option.prop("disabled", !0);
                var o = function() {
                    e.find(".spoiler-status").fadeIn(400, function() {
                        t(this).addClass("spoiler")
                    })
                };
                n.modal.guard.done(function() {
                    setTimeout(o, 0)
                })
            })
        }
        function a(t) {
            t.modal.close(), e.showConfirm(e.loc("olv.portal.profile_post"), e.loc("olv.portal.profile_post.confirm_update"), {
                okLabel: e.loc("olv.portal.profile_post.confirm_update.yes"),
                cancelLabel: e.loc("olv.portal.cancel")
            }).ok(function() {
                var n = this;
                n.element.find(".button").prop("disabled", !0), e.Form.post(t.action, null, t.button, !0).done(function() {
                    n.element.trigger("olv:entry:profile-post:set"), n.close(), e.showConfirm(e.loc("olv.portal.profile_post"), e.loc("olv.portal.profile_post.done"), {
                        okLabel: e.loc("olv.portal.user.search.go"),
                        cancelLabel: e.loc("olv.portal.close")
                    }).ok(function() {
                        location.href = "/users/@me"
                    })
                })
            })
        }
        function r(t, n, r) {
            function s() {
                var t = u.find(":selected");
                d.text(t.text());
                var n = t.attr("data-action");
                c.attr("action", n), e.Form.toggleDisabled(f, !n)
            }
            function l(t) {
                if (!e.Form.isDisabled(f) && !t.isDefaultPrevented()) {
                    t.preventDefault();
                    var r, s = {
                        action: c.attr("action"),
                        button: f,
                        modal: n,
                        option: u.find(":selected")
                    }, l = u.val();
                    "delete" == l ? r = o(s) : "spoiler" == l ? r = i(s) : "painting-profile-post" === l || "screenshot-profile-post" === l ? r = a(s) : n.close(), r && r.always(function() {
                        n.close()
                    })
                }
            }
            n.triggerElement;
            var c = n.element.find("form.edit-post-form"),
                u = c.find('select[name="edit-type"]'),
                d = c.find("span.select-button-content"),
                f = c.find(".post-button");
            u.val(""), s(), u.on("change", s), f.on("click", l), r.done(function() {
                u.off("change", s), f.off("click", l)
            })
        }
        t(document).on("olv:modal:edit-post", r), n.done(function() {
            t(document).off("olv:modal:edit-post", r)
        })
    }, t(document).on("olv:modal:album-detail", function(t, n, o) {
        var i = n.element.find("form"),
            a = i.find(".js-album-delete-button");
        a.on("click", function(t) {
            e.Form.isDisabled(a) || t.isDefaultPrevented() || (t.preventDefault(), e.confirm(e.loc("olv.portal.album.delete_confirm")) && e.Form.submit(i, a, !0).done(function() {
                n.close(), e.Browsing.reload()
            }))
        }), o.done(function() {
            a.off("click")
        })
    }), e.Entry.setupCloseTopicPostButton = function(n) {
        var o = t(document).find(".js-close-topic-post-form"),
            i = o.find(".js-close-topic-post-button");
        i.on("click", function(n) {
            e.Form.isDisabled(i) || n.isDefaultPrevented() || (n.preventDefault(), e.showConfirm(e.loc("olv.portal.edit.action.close_topic_post"), e.loc("olv.portal.edit.action.close_topic_post.confirm"), {
                okLabel: e.loc("olv.portal.yes"),
                cancelLabel: e.loc("olv.portal.stop")
            }).ok(function() {
                e.Form.post(o.attr("action"), null, i, !0).done(function() {
                    t(document).find(".js-topic-answer-accepting-status").removeClass("accepting").addClass("not-accepting"), o.remove()
                }), this.close()
            }))
        }), n.done(function() {
            i.off("click")
        })
    }, e.EntryForm = {}, e.EntryForm.setupFeelingSelector = function(t, e) {
        function n() {
            i.attr("src", o.find("input:checked").attr("data-mii-face-url"))
        }
        var o = t.find(".feeling-selector"),
            i = t.find(".icon");
        o.on("click", "input", n), e.done(function() {
            o.off("click", "input", n)
        })
    }, e.EntryForm.setupSpoilerCheck = function(t, e) {
        var n = t.find('input[name="is_spoiler"]');
        n.on("click", function() {
            n.attr("data-sound", n.prop("checked") ? "SE_WAVE_CHECKBOX_CHECK" : "SE_WAVE_CHECKBOX_UNCHECK")
        }), e.done(function() {
            n.off("click")
        })
    }, e.EntryForm.setupTopicCategories = function(t, n) {
        function o() {
            e.Form.syncSelectedText(a)
        }
        var i = t.find(".select-content-topic"),
            a = i.find(".topic-category-selector");
        if (a.length) {
            i.find(".select-button-content");
            o(), a.on("change", o), n.done(function() {
                a.off("change", o)
            })
        }
    }, e.EntryForm.openPaintingDialog = function(e) {
        var n = t.Deferred();
        window.wiiuMemo.open(e);
        var o = setInterval(function() {
            wiiuMemo.isFinish() && (clearInterval(o), n.resolve())
        }, 40);
        return n.promise()
    }, e.EntryForm.setupPostTypeChanger = function(t, n) {
        function o() {
            var t = d.prop("checked");
            u.toggleClass("active-text", t), u.toggleClass("active-memo", !t), p.prop("disabled", !t), m.prop("disabled", t)
        }
        function i() {
            e.EntryForm.openPaintingDialog(h).done(a), h = !1, m.val("painting-started")
        }
        function a() {
            var t = "data:image/bmp;base64," + wiiuMemo.getImage(!1);
            v.css("background-image", "url(" + t + ")")
        }
        function r() {
            if (!m.prop("disabled")) {
                var t = wiiuMemo.getImage(!0);
                m.val(t)
            }
        }
        function s() {
            o(), p.focus()
        }
        function l(t) {
            if (!wiiuDevice.isDrc()) return d.prop("checked", !0), void e.deferredAlert(e.loc("olv.portal.error.memo_needs_drc"));
            o(), i()
        }
        function c(t) {
            f.trigger("click")
        }
        var u = t.find(".textarea-with-menu"),
            d = t.find('input[name="_post_type"][value="body"]'),
            f = t.find('input[name="_post_type"][value="painting"]'),
            p = t.find('input[name="body"],textarea[name="body"]'),
            m = t.find('input[name="painting"]'),
            g = t.find(".textarea-memo"),
            v = t.find(".textarea-memo-preview"),
            h = !0;
        t.on("olv:form:submit", r), d.on("click", s), f.on("click", l), g.on("click", c), o(), n.done(function() {
            t.off("olv:form:submit", r), d.off("click", s), f.off("click", l), g.off("click", c)
        })
    }, e.EntryForm.setupAlbumImageSelector = function(e, n) {
        var o = function(t, n, o) {
            e.find('input[name="album_image_id"]').val(n), e.find("input.js-album-screenshot-type").attr("data-src", o).attr("checked", !0).click()
        }, i = function(n) {
            t(n.target).hasClass("js-album-screenshot-type") || e.find('input[name="album_image_id"]').val("")
        };
        t(document).on("olv:albumImageSelector:submit", o), e.find('input[name="screenshot_type"]').on("click", i), n.done(function() {
            t(document).off("olv:albumImageSelector:submit", o), e.find('input[name="screenshot_type"]').off("click", i)
        })
    }, e.EntryForm.setupImageSelector = function(n, o) {
        function i(t, e) {
            r.prop("disabled", !t).val(t), s.attr("src", e || "data:image/jpeg;base64," + t)
        }
        var a = n.find(".image-selector");
        if (a.length) {
            if (a.hasClass("disabled")) return e.EntryForm.setupForbiddenImageSelector(n, o), void n.find('input[name="screenshot"]').attr("data-is-capture-forbidden", "1");
            var r = a.find('input[name="screenshot"]'),
                s = a.find(".preview-image"),
                l = {
                    drc: function() {
                        return wiiuMainApplication.getScreenShot(!1)
                    },
                    tv: function() {
                        return wiiuMainApplication.getScreenShot(!0)
                    }
                }, c = !1;
            if (t.each(l, function(t, e) {
                var n = a.find('input[name="screenshot_type"][value="' + t + '"]');
                if (n.length) {
                    var o = null;
                    try {
                        o = e()
                    } catch (t) {}
                    if (!o) return n.closest("label").css("pointer-events", "none"), void n.remove();
                    n.attr("data-value", o), n.siblings("img").attr("src", "data:image/jpeg;base64," + o), c = !0
                }
            }), c || (a.find(".js-image-selector-section-capture").addClass("none"), n.find('input[name="screenshot"]').attr("data-is-capture-forbidden", "1")), t(document.body).find("#album-image-selector").length > 0 && (e.EntryForm.setupAlbumImageSelector(n, o), c = !0), c) {
                var u = a.find('input[name="screenshot_type"]');
                u.prop("disabled", !1), u.on("click", function(e) {
                    var n = t(this);
                    i(n.attr("data-value"), n.attr("data-src"))
                }), o.done(function() {
                    u.off("click")
                })
            } else e.EntryForm.setupForbiddenImageSelector(n, o)
        }
    }, e.EntryForm.setupForbiddenImageSelector = function(t, n) {
        function o(t) {
            t.preventDefault(), e.deferredAlert(e.loc("olv.portal.post.screenshot_forbidden"))
        }
        var i = t.find(".image-selector"),
            a = i.find(".dropdown-toggle");
        i.addClass("disabled"), a.removeAttr("data-toggle"), a.removeAttr("data-sound"), a.addClass("forbidden"), a.on("click", o), n.done(function() {
            a.off("click", o)
        })
    }, e.EntryForm.setupSubmission = function(t, n, o, i) {
        var a = n.find(".post-button");
        a.on("click", function(i) {
            if (!e.Form.isDisabled(a) && !i.isDefaultPrevented()) {
                i.preventDefault();
                var r = n.find('input[name="screenshot"]');
                !+r.attr("data-is-required-unless-forbidden") || +r.attr("data-is-capture-forbidden") || !r.attr("disabled") || n.find('input[name="album_image_id"]').val() ? e.Form.submit(n, a, !0).done(function() {
                    var e = [t];
                    e.push.apply(e, arguments), o.apply(this, e)
                }).fail(function() {
                    n.find('input[name="body"], textarea[name="body"]').trigger("input")
                }) : e.deferredAlert(e.loc("olv.portal.post.screenshot_required"))
            }
        }), i.done(function() {
            a.off("click")
        })
    }, e.EntryForm.onAddPostDone = function(e, n) {
        var o = e.element.find("#topic_posts-form");
        if (o.length && !o.attr("data-is-identified")) {
            var i = t(n).attr("data-post-permalink-url");
            t("#add-topic-post-error-page .js-view-existing-post").attr("href", i), t("#header-post-button").attr("data-modal-open", "#add-topic-post-error-page")
        }
        e.close(), t(".js-no-content").remove(), t(n).prependTo(t(".js-post-list")).trigger("olv:entry:add-to-list:done")
    }, e.EntryForm.onAddMessageDone = function(n, o) {
        n.close(), t(".js-no-content").remove(), t(".message-post-list").prepend(o);
        var i = e.UpdateChecker.getInstance();
        i.interval_ = i.initialInterval_
    }, e.EntryForm.onAddReplyDone = function(n, o) {
        e.UpdateChecker.getInstance();
        n.close();
        var i = 0;
        if (o) {
            var a = t(o),
                r = t(".post-permalink-reply li").map(function() {
                    return "#" + t(this).attr("id")
                }).toArray().join(","),
                s = "" == r ? a : a.filter(":not(" + r + ")");
            s.length > 0 && (i += s.length), t(".post-permalink-reply").append(s)
        }
        e.Entry.mayIncrementMoreRepliesButtonCount(i), t(window).scrollTop(t(document).height())
    }, t(document).on("olv:modal:add-entry", function(t, n, o) {
        var i = n.element.find("form");
        e.EntryForm.setupFeelingSelector(i, o), e.EntryForm.setupSpoilerCheck(i, o), e.EntryForm.setupTopicCategories(i, o), e.EntryForm.setupPostTypeChanger(i, o)
    }), t(document).on("olv:modal:open-topic-post-existing-error", function(t, n, o) {
        e.EntryForm.getCheckCanPost(function() {}, function(t) {
            n.close()
        })
    }), t(document).on("olv:modal:add-message", function(t, n, o) {
        var i = n.triggerElement.attr("data-user-id");
        if (i) {
            var a = n.triggerElement.attr("data-screen-name"),
                r = e.loc("olv.portal.friend_message_to", a, i);
            n.element.find(".window-title").text(r), n.element.find('input[name="message_to_user_id"]').val(i)
        }
    }), t(document).on("olv:modal:add-post olv:modal:add-message", function(t, n, o) {
        var i = n.element.find("form"),
            a = "olv:modal:add-post" === t.type;
        a && e.EntryForm.checkCanPost(n, i), e.EntryForm.setupImageSelector(i, o);
        var r = a ? e.EntryForm.onAddPostDone : e.EntryForm.onAddMessageDone;
        e.EntryForm.setupSubmission(n, i, r, o)
    }), t(document).on("olv:modal:add-reply", function(t, n, o) {
        var i = n.element.find("form");
        e.EntryForm.checkCanPost(n, i), e.EntryForm.setupImageSelector(i, o), e.EntryForm.setupSubmission(n, i, e.EntryForm.onAddReplyDone, o)
    }), e.EntryForm.mayOpenModalInitially = function(n, o, i, a) {
        function r(t) {
            window.history.back()
        }
        function s(e) {
            var o = n.href.replace(/#.*/, "");
            t.pjax.state && t.pjax.state.url && (t.pjax.state.url = o), window.history.replaceState(t.pjax.state, "", o), l()
        }
        if (n.hash === o) {
            e.init.done(function() {
                var t = e.ModalWindowManager.createNewModal(i);
                t.open(), t.element.find(".olv-modal-close-button").removeClass("olv-modal-close-button").addClass("js-entryform-back-button")
            });
            var l = function() {
                t(document).off("click", ".js-entryform-back-button", r), t(document).off("olv:modalclose", ".add-post-page", s)
            };
            t(document).on("click", ".js-entryform-back-button", r), t(document).on("olv:modalclose", ".add-post-page", s), a.done(l)
        }
    }, e.EntryForm.checkCanPost = function(t, n) {
        function o(t, e) {
            var n = e.remaining_today_posts;
            t.element.find(".remaining-today-post-count").text(n), t.element.find(".js-post-count-container").removeClass("none")
        }
        e.EntryForm.getCheckCanPost(function(e) {
            o(t, e)
        }, function(e) {
            t.close()
        })
    }, e.EntryForm.getCheckCanPost = function(n, o) {
        e.Net.ajax({
            type: "GET",
            url: "/users/" + t(document.body).attr("data-user-id") + "/check_can_post.json"
        }).done(function(t) {
            n(t)
        }).fail(function(t) {
            o(t)
        })
    }, e.EntryForm.setupDiaryPostModal = function(t, e) {
        var n = t.element.find("form").find(".image-selector"),
            o = n.find(".dropdown-toggle"),
            i = n.find('input[name="screenshot"]'),
            a = n.find(".preview-image");
        e ? (i.prop("disabled", !e).val(e), a.attr("src", "data:image/jpeg;base64," + e), n.addClass("disabled"), o.removeAttr("data-toggle"), o.removeAttr("data-sound")) : (n.addClass("disabled"), o.removeAttr("data-toggle"), o.removeAttr("data-sound"), o.addClass("forbidden"))
    }, e.Relationship = {}, e.Relationship.isFirstFriend = function() {
        return !!t(document.body).attr("data-is-first-friend")
    }, e.Relationship.confirmFirstFriend = function() {
        return e.deferredConfirm(e.loc("olv.portal.friend.first_request_confirm")).done(function(e) {
            e && t(document.body).removeAttr("data-is-first-friend")
        }).promise()
    }, e.Relationship.setupFirstFriendConfirm = function(n) {
        function o(n) {
            e.Relationship.isFirstFriend() && (n.preventDefault(), e.Relationship.confirmFirstFriend().done(function(e) {
                e && t(n.target).trigger("click")
            }))
        }
        var i = '[data-modal-open="#friend-request-post-page"]';
        t(document).on("olv:modalopen", i, o), n.done(function() {
            t(document).off("olv:modalopen", i, o)
        })
    }, e.Relationship.fillInConfirmDialog = function(t) {
        var n = t.triggerElement,
            o = t.element;
        o.find(".screen-name").text(n.attr("data-screen-name")), o.find(".id-name").text(n.attr("data-user-id")), o.find(".icon").attr("src", n.attr("data-mii-face-url")), n.attr("data-is-identified") && o.find(".icon-container").addClass("official-user");
        var i = n.attr("data-body");
        if (void 0 !== i) {
            var a = o.find(".message-inner");
            i || a.addClass("no-message"), a.text(i || e.loc("olv.portal.friend_request.no_message"))
        }
        var r = n.attr("data-timestamp");
        void 0 !== r && o.find(".timestamp").text(r)
    }, e.Relationship.setupForPage = function(t, n, o) {
        e.Relationship.isFirstFriend() && e.Relationship.setupFirstFriendConfirm(o)
    }, e.router.connect(/^/, e.Relationship.setupForPage), t(document).on("olv:modal:confirm-relationship", function(n, o, i) {
        function a(e, n, i) {
            var a = n.length ? {
                    relatedTarget: n[0]
                } : null,
                r = t.Event(e, a),
                s = [o];
            return i && s.push.apply(s, i), l.trigger(r, s), !r.isDefaultPrevented()
        }
        function r(t) {
            if (!e.Form.isDisabled(u) && !t.isDefaultPrevented() && (t.preventDefault(), a("olv:relationship:change", u))) {
                var n = u.attr("data-action") || l.attr("data-action"),
                    i = l.attr("data-pid"),
                    r = i ? {
                        pid: i
                    } : null;
                e.Form.post(n, r, u, !0).done(function() {
                    var t = c.find(".window-title").text(),
                        n = l.attr("data-screen-name"),
                        i = e.loc(u.attr("data-done-msgid"), n),
                        r = arguments;
                    e.showMessage(t, i).ok(function() {
                        a("olv:relationship:change:done", this.element.find(".ok-button"), r) && e.ModalWindowManager.closeUntil(o)
                    })
                }).fail(function() {
                    a("olv:relationship:change:fail", u, arguments) && e.ModalWindowManager.closeUntil(o)
                })
            }
        }
        function s(t) {
            e.Form.isDisabled(d) || t.isDefaultPrevented() || (t.preventDefault(), a("olv:relationship:cancel", d) && e.ModalWindowManager.closeUntil(o))
        }
        e.Relationship.fillInConfirmDialog(o);
        var l = o.triggerElement,
            c = o.element,
            u = c.find(".post-button"),
            d = c.find(".cancel-button");
        u.on("click", r), d.on("click", s), i.done(function() {
            u.off("click", r), d.off("click", s)
        })
    }), t(document).on("olv:modal:confirm-received-request", function(n, o, i) {
        function a(n, o) {
            e.Relationship.isFirstFriend() && (n.preventDefault(), e.Relationship.confirmFirstFriend().done(function(e) {
                e ? t(n.relatedTarget).trigger("click") : o.close()
            }))
        }
        var r = o.triggerElement;
        r.on("olv:relationship:change", a), i.done(function() {
            r.off("olv:relationship:change", a)
        })
    }), t(document).on("olv:modal:post-friend-request", function(t, n, o) {
        function i(t) {
            if (!e.Form.isDisabled(r) && !t.isDefaultPrevented()) {
                t.preventDefault();
                var o = r.closest("form"),
                    i = o.find("input[name=body]").val();
                e.Utils.containsNGWords(i) ? e.ErrorViewer.deferredOpen(e.Utils.ERROR_CONTAINS_NG_WORDS) : e.Form.submit(o, r, !0).done(function() {
                    var t = a.find(".window-title").text(),
                        o = a.find(".screen-name").text(),
                        i = e.loc("olv.portal.friend_request.send_succeeded_to", o);
                    e.showMessage(t, i).ok(function() {
                        e.ModalWindowManager.closeUntil(n), e.Browsing.reload()
                    })
                }).fail(function(t, o, i, a) {
                    if (a) {
                        var r = t && t.errors && t.errors[0] && +t.errors[0].error_code || 0;
                        r >= 1210110 && r <= 1210129 && (e.ModalWindowManager.closeUntil(n), e.Browsing.reload())
                    }
                })
            }
        }
        var a = n.element,
            r = a.find(".post-button");
        r.on("click", i), o.done(function() {
            r.off("click", i)
        })
    }), e.init.done(function() {
        "undefined" != typeof wiiuBrowser && void 0 !== wiiuBrowser.endStartUp && wiiuBrowser.endStartUp()
    }), e.router.connect("^/$", function(n, o, i) {
        function a() {
            e.Form.setupForPage(), e.Content.autopagerize(".js-post-list", i), t("#header-post-button").toggleClass("none", !1);
            var n = t("input.user-search-query");
            new e.UserSearchButton(n, i)
        }
        e.Entry.setupHiddenContents(i), e.Entry.setupEmpathyButtons(".post-meta", i), e.Content.setupReloadKey(i), e.Tutorial.setupCloseButtons(i), e.User.setupFollowButton(i);
        var r, s, l = t(".content-loading-window");
        s = "friend" !== e.Cookie.get("view_activity_filter") ? e.Net.ajax({
            type: "GET",
            url: "/my/latest_following_related_profile_posts",
            silent: !0
        }) : t.Deferred().resolve().promise(), (r = l.length ? e.Net.ajax({
            type: "GET",
            url: o.pathname + o.search,
            silent: !0
        }).done(function(e) {
            var n = t(e);
            n.find("title").remove(), t("#body").html(n)
        }).fail(function() {
            l.remove(), t(".content-load-error-window").removeClass("none")
        }) : t.Deferred().resolve().promise()).then(function() {
            a()
        }), t.when(r, s).done(function(e, n) {
            var o = t(t.trim(n[0])),
                i = [];
            self.$("[data-latest-following-relation-profile-post-placeholder]").each(function(e, n) {
                var a = o.get(e);
                a && (t(n).html(a), i.push(n))
            }), t(i).removeClass("none")
        }).done(function() {
            e.User.setupFollowButton(i)
        }), i.done(function() {
            r.abort && r.abort()
        })
    }), e.router.connect("^/titles/search$", function(n, o, i) {
        var a = t(".body-content input.title-search-query");
        new e.TitleSearchButton(a, i)
    }), e.router.connect("^/communities(?:/favorites|/played)?$", function(n, o, i) {
        e.Tutorial.setupCloseButtons(i), e.Community.setupInfoTicker(i), e.Content.autopagerize("#community-top-content", i);
        var a = t(".body-content input.title-search-query");
        new e.TitleSearchButton(a, i)
    }), e.router.connect("^/communities/categories/[a-z]+$", function(n, o, i) {
        e.Tutorial.setupCloseButtons(i), e.Content.autopagerize("#community-top-content", i);
        var a = t(".category-top-of-more");
        a.length && (window.scrollTo(0, a.offset().top), a.removeClass("category-top-of-more"))
    }), e.router.connect("^/identified_user_posts$", function(t, n, o) {
        e.User.setupFollowButton(o), e.Content.autopagerize(".js-post-list", o), e.Content.setupReloadKey(o)
    }), e.router.connect("^/titles/[0-9]+/[0-9]+(/diary|/artwork(/new|/hot)?|/topic(/new|/open)?|/new|/hot|/in_game|/old)?$", function(n, o, i) {
        function a(t) {
            window.scrollTo(0, 0)
        }
        e.Community.setupInfoTicker(i), e.Community.setupFavoriteButtons(i), e.Community.setupUnfavoriteButtons(i), e.Community.setupAppJumpButtons(i), e.Community.setupShopButtons(i), e.Community.setupPostButton(i), e.Community.setupURLSelector("#post-filter select", i), e.Community.setupSelectButton(".js-select-post-filter", i), e.Community.setupURLSelector(".js-select-post-filter", i), e.Community.setupTopicPostButton(i), e.Tutorial.setupBalloon(".js-tutorial-balloon", i), e.Entry.setupHiddenContents(i), e.Entry.setupEmpathyButtons(".post-meta", i), e.Entry.setupFirstPostNotice("#header-post-button", i), e.Content.autopagerize(".js-post-list", i), e.Content.setupReloadKey(i), t(".toggle-button").length && e.User.setupFollowButton(i), e.EntryForm.mayOpenModalInitially(o, "#js_open_post_modal", "#header-post-button", i), e.EntryForm.mayOpenModalInitially(o, "#js_open_artwork_post_from_album_modal", ".js-open-artwork-post-from-album-modal", i), e.EntryFormAlbumImageSelector.setup(i), t(document).on("olv:entry:add-to-list:done", a), i.done(function() {
            t(document).off("olv:entry:add-to-list:done", a)
        })
    }), e.router.connect(/^\/posts\/([0-9A-Za-z\-_]+)$/, function(n, o, i) {
        e.Entry.setupPostEmpathyButton("#post-permalink-content", i), e.Entry.setupEditButtons(i), e.Entry.setupMoreRepliesButton(i), e.Entry.setupAppJumpButton(i), e.Entry.setupHiddenContents(i), e.Entry.setupFirstPostNotice("#header-reply-button", i), e.Entry.setupEmpathyButtons(".reply-meta", i), e.Entry.setupCloseTopicPostButton(i), e.Content.setupReloadKey(i), e.Form.setupDisabledMessage(i), e.YouTubePlayer.setupQualityButton(i), e.Entry.setupMoreContentButton(i), t("#body-language-selector").length && e.Entry.setupBodyLanguageSelector(i), e.EntryFormAlbumImageSelector.setup(i)
    }), e.router.connect(/^\/replies\/([0-9A-Za-z\-_]+)$/, function(n, o, i) {
        e.Entry.setupPostEmpathyButton("#post-permalink-comments", i), e.Entry.setupEditButtons(i), t("#body-language-selector").length && e.Entry.setupBodyLanguageSelector(i)
    }), e.router.connect("^/users/[0-9a-zA-Z\\-_.]+(/empathies|/posts)$", function(t, n, o) {
        e.Entry.setupHiddenContents(o), e.Entry.setupEmpathyButtons(".post-meta", o), e.Content.autopagerize(".js-post-list", o), e.Content.setupReloadKey(o)
    }), e.router.connect("^/users/[0-9a-zA-Z\\-_.]+(/friends|/following|/followers)$", function(t, n, o) {
        e.Content.autopagerize("#friend-list-content", o), e.Content.setupReloadKey(o)
    }), e.router.connect("^/users/[0-9a-zA-Z\\-_.]+(/friends|/following|/followers|/empathies|/posts)?$", function(n, o, i) {
        function a(e, n) {
            t(".user-page.is-visitor .js-following-count").text(n)
        }
        e.Form.setupDisabledMessage(i), e.User.setupFollowButton(i, {
            noReloadOnFollow: !0
        }), e.Tutorial.setupBalloon(".js-tutorial-balloon", i), t(document).on("olv:visitor:following-count:change", a), i.done(function() {
            t(document).off("olv:visitor:following-count:change", a)
        }), e.Entry.setupHiddenContents(i), e.Entry.setupEmpathyButtons(".post-meta", i)
    }), e.router.connect("^/users/[0-9a-zA-Z\\-_.]+(/diary)$", function(n, o, i) {
        function a(e) {
            var n = t(e.target);
            window.scrollTo(0, n.offset().top - 10), n.attr("data-test-scrolled", "1")
        }
        e.Entry.setupHiddenContents(i), e.Entry.setupEmpathyButtons(".post-meta", i), e.Content.autopagerize(".js-post-list", i), e.Content.setupReloadKey(i), e.Entry.setupCreateDiaryOrSaveScreenshotWindow(".js-diary-screenshot-window", i), e.Form.setupDisabledMessage(i), e.EntryForm.mayOpenModalInitially(o, "#js_open_post_from_album_modal", ".js-open-post-from-album-modal", i), t(document).on("olv:entry:add-to-list:done", a), i.done(function() {
            t(document).off("olv:entry:add-to-list:done", a)
        })
    }), e.router.connect("^/users/[0-9a-zA-Z\\-_.]+/favorites$", function(t, n, o) {
        e.Content.autopagerize("#community-top-content", o)
    }), e.router.connect("^/my_blacklist$", function(e, n, o) {
        function i(e) {
            t(e.target).addClass("none").siblings().removeClass("none")
        }
        t(document).on("olv:relationship:change:done", i), o.done(function() {
            t(document).off("olv:relationship:change:done", i)
        })
    }), e.router.connect("^/users$", function(n, o, i) {
        var a = t(".body-content input.user-search-query");
        new e.UserSearchButton(a, i), e.Content.autopagerize(".user-list", i)
    }), e.router.connect("^/settings/account", function(n, o, i) {
        e.Form.setupDisabledMessage(i);
        var a = wiiuBOSS.isRegisteredBossTask(),
            r = t('div[data-name="notice_opt_in"] button[value=1]'),
            s = t('div[data-name="notice_opt_in"] button[value=0]');
        r.toggleClass("selected", a.isRegistered), s.toggleClass("selected", !a.isRegistered);
        l = t('div[data-name="notice_opt_in"]').find("button.selected").text();
        t('li[data-name="notice_opt_in"] a.settings-button').text(l);
        var a = wiiuBOSS.isRegisteredDirectMessageTask(),
            r = t('div[data-name="luminous_opt_in"] button[value=1]'),
            s = t('div[data-name="luminous_opt_in"] button[value=0]');
        r.toggleClass("selected", a.isRegistered), s.toggleClass("selected", !a.isRegistered);
        var l = t('div[data-name="luminous_opt_in"]').find("button.selected").text();
        t('li[data-name="luminous_opt_in"] a.settings-button').text(l)
    }), e.router.connect("^/settings/profile", function(n, o, i) {
        e.Form.setupDisabledMessage(i), t("#profile-text").on("input.olvMessageForm", function(n) {
            var o = t(this).closest("form");
            e.Form.submit(o)
        }), t("#profile-post").on("click", function(n) {
            n.preventDefault();
            var o = t(this);
            e.showConfirm(e.loc("olv.portal.profile_post"), e.loc("olv.portal.profile_post.confirm_remove"), {
                okLabel: e.loc("olv.portal.button.remove"),
                cancelLabel: e.loc("olv.portal.stop")
            }).ok(function() {
                e.Form.post("/settings/profile_post.unset.json", null, o, !0).done(function() {
                    o.trigger("olv:profile:profile-post:remove"), e.Browsing.reload()
                })
            })
        }), e.UserProfile.setupFavoriteGameGenreSelectors("#favorite-game-genre", i), i.done(function() {
            t("#profile-text").off("input.olvMessageForm"), t("#profile-post").off("click")
        })
    }), e.router.connect("^/friend_messages$", function(t, n, o) {
        e.Tutorial.setupCloseButtons(o)
    }), e.router.connect("^/friend_messages/([0-9a-zA-Z\\-_.]+)$", function(n, o, i) {
        e.Content.autopagerize(".message-post-list", i);
        var a = e.UpdateChecker.getInstance();
        a.onUpdate("message_feed", {
            user_id: n[1],
            view_id: t("input[name=view_id]").val(),
            page_param: JSON.parse(t("input[name=page_param]").val())
        }, function(e) {
            if (e.page_param && (this.page_param = e.page_param), e.html) {
                var n = t(e.html),
                    o = t(".post").map(function() {
                        return "#" + t(this).attr("id")
                    }).toArray().join(","),
                    i = "" == o ? n : n.filter(":not(" + o + ")");
                i.length > 0 && (t(".message-post-list").prepend(i), a.interval_ = a.initialInterval_)
            }
        }, !0)
    }), e.router.connect("^/news/my_news$", function(t, n, o) {
        e.Tutorial.setupCloseButtons(o), e.User.setupFollowButton(o)
    }), e.router.connect("^/news/friend_requests$", function(n, o, i) {
        function a(t, e) {
            t.siblings(".ok-message").text(e).removeClass("none"), t.remove()
        }
        function r(t, n) {
            var o = t.element.find(".cancel-button"),
                i = n.element.find(".ok-button"),
                r = o.attr("data-action"),
                s = {
                    pid: t.triggerElement.attr("data-pid")
                };
            e.Form.post(r, s, i, !0).done(function() {
                var n = t.element.find(".screen-name").text();
                e.showMessage(e.loc("olv.portal.friend_request.delete"), e.loc("olv.portal.friend_request.deleted_from", n)).ok(function() {
                    a(t.triggerElement, e.loc("olv.portal.friend_request.deleted")), e.ModalWindowManager.closeUntil(t)
                })
            }).fail(function(n, o, i, a) {
                e.ModalWindowManager.closeUntil(t), a && i.status && 503 !== i.status && e.Browsing.reload()
            })
        }
        e.Tutorial.setupCloseButtons(i), e.Form.setupDisabledMessage(i);
        var s = {
            "olv:modalopen": function(e) {
                t(e.target).closest("li").find(".notify").removeClass("notify")
            },
            "olv:relationship:change:done": function(t, n) {
                a(n.triggerElement, e.loc("olv.portal.friend_request.successed"))
            },
            "olv:relationship:change:fail": function(t, n, o, i, a, r) {
                r && a.status && 503 !== a.status && e.Browsing.reload()
            },
            "olv:relationship:cancel": function(t, n) {
                t.preventDefault();
                var o = n.element.find(".screen-name").text();
                e.showConfirm(e.loc("olv.portal.friend_request.delete"), e.loc("olv.portal.friend_request.confirm_delete", o), {
                    okLabel: e.loc("olv.portal.erase"),
                    cancelLabel: e.loc("olv.portal.stop"),
                    modalTypes: "delete-friend-request"
                }).ok(function() {
                    r(n, this)
                }).cancel(function() {
                    e.ModalWindowManager.closeUntil(n)
                })
            }
        };
        t(document).on(s, ".received-request-button"), i.done(function() {
            t(document).off(s, ".received-request-button")
        })
    }), e.router.connect("^/welcome/(?:wiiu)?$", function(n, o, i) {
        function a(n) {
            document.activeElement.blur();
            var o = n.closest(".slide-page");
            o.attr("data-scroll", n.attr("data-save-scroll") ? t(window).scrollTop() : null), o.addClass("none");
            var i = t(n.attr("data-slide"));
            t(document.body).attr("id", i.attr("data-body-id") || null);
            var a = i.attr("data-bgm");
            a && e.Sound.playBGM(a), i.removeClass("none"), t(window).scrollTop(+i.attr("data-scroll") || 0), i.trigger("olv:welcome:slide")
        }
        e.Content.preloadImages("/img/welcome/welcome2.png", "/img/welcome/welcome3.png", "/img/welcome/welcome4.png", "/img/welcome/welcome5-1.png", "/img/welcome/welcome5-2.png", "/img/welcome/welcome5-3.png", "/img/welcome/welcome5-4.png", "/img/welcome/welcome5-5.png", "/img/welcome/welcome5-6.png", "/img/welcome/welcome5-7.png", "/img/welcome/welcome6.png", "/img/welcome/welcome6-1.png", "/img/welcome/welcome6-2.png", "/img/welcome/welcome6-3.png", "/img/tutorial/tutorial-activity-feed.png"), t(document).on("click", ".slide-button", function(n) {
            n.preventDefault(), e.Form.isDisabled(t(this)) || a(t(this))
        }), t(".slide-page").on("olv:welcome:slide", function() {
            var n = t(this);
            if ("welcome-finish" === n.attr("id")) {
                var o = n.find(".welcome-finish-button"),
                    i = o.attr("data-activate-url");
                e.Form.post(i, null, o, !0).fail(function() {
                    e.Browsing.reload()
                })
            }
        }), t(".welcome-exit-button").on("click", function(t) {
            t.preventDefault(), setTimeout(function() {
                wiiuBrowser.closeApplication()
            }, 0)
        }), t(".welcome-cancel-button").on("click", function(t) {
            t.preventDefault(), e.deferredConfirm(e.loc("olv.portal.welcome.exit_confirm"), e.loc("olv.portal.back"), e.loc("olv.portal.ok")).done(function(t) {
                t && wiiuBrowser.closeApplication()
            })
        }), t(".welcome-luminous_opt_in-button").on("click", function(n) {
            n.preventDefault();
            t(this);
            t('input[name="luminous_opt_in"]:checked').length ? a(t(this)) : e.deferredAlert(e.loc("olv.portal.welcome.select_luminous_opt_in"))
        }), t('input[name="luminous_opt_in"]').on("click", function(n) {
            var o = void 0;
            if ((o = 1 === +t(this).val() ? e.Utils.callWiiuBOSSFuncWithFallback("registerDirectMessageTaskEx") : e.Utils.callWiiuBOSSFuncWithFallback("unregisterDirectMessageTask")).error) return e.ErrorViewer.open(o.error), t(this).prop("checked", !1), void t(this).parent().removeClass("checked")
        }), t(".guide-exit-button").addClass("slide-button").attr("data-slide", "#welcome-guideline"), setTimeout(function() {
            a(t("<button/>").attr("data-slide", "#welcome-start"))
        }, 0)
    }), e.router.connect("^/welcome/profile$", function(n, o, i) {
        function a(e) {
            document.activeElement.blur();
            var n = e.closest(".js-slide-page"),
                o = t(e.attr("data-slide"));
            n.addClass("none"), o.removeClass("none")
        }
        function r(n) {
            var o = t(this);
            n.isDefaultPrevented() || e.Form.isDisabled(o) || a(o)
        }
        function s(n) {
            n.preventDefault();
            var o = t(this),
                i = t(n.delegateTarget).find("form");
            e.Form.submit(i, null, !0).done(function() {
                o.attr("data-slide") && a(o), o.hasClass("finish-button") && (t(document).one("olv:achievement:update:done", function() {
                    e.Browsing.replaceWith(o.attr("data-href"))
                }), o.trigger("olv:achievement:update"))
            })
        }
        e.User.setupAchievement(i), t(document).on("click", ".js-slide-button", r);
        for (var l = ["#profile-game-skill", "#profile-relationship-visibility", "#profile-favorite-community-visibility", "#profile-profile-comment"], c = 0, u = l.length; c < u; c++) t(l[c]).on("click", ".js-slide-button.next-button", s);
        e.UserProfile.setupFavoriteGameGenreSelectors("#js-favorite-game-genre-form", i), setTimeout(function() {
            a(t("<button/>").attr("data-slide", "#profile-game-skill"))
        }, 0), i.done(function() {
            t(document).off("click", ".js-slide-button", r);
            for (var e = 0, n = l.length; e < n; e++) t(l[e]).off("click", ".js-slide-button.next-button", s)
        })
    }), e.router.connect("^/welcome/favorite_community_visibility$", function(n, o, i) {
        function a(n) {
            n.preventDefault();
            var o = t(this),
                i = t("#js-favorite-community-visibility-form");
            e.Form.submit(i, null, !0).done(function() {
                t(document).one("olv:achievement:update:done", function() {
                    e.Browsing.replaceWith(o.attr("data-href"))
                }), o.trigger("olv:achievement:update")
            })
        }
        e.User.setupAchievement(i), t(document).on("click", ".next-button", a), i.done(function() {
            t(document).off("click", ".next-button", a)
        })
    }), e.router.connect("^/(?:help|guide)/", function(n, o, i) {
        e.Browsing.setupAnchorLinkReplacer(i), e.Content.fixFixedPositionElement(".exit-button");
        var a = t(".exit-button");
        a.on("click", function(t) {
            wiiuBrowser.canHistoryBack() && (t.preventDefault(), e.Browsing.lockPage(), history.back())
        }), i.done(function() {
            a.off("click")
        })
    }), e.router.connect("^/help/$", function(e, n, o) {
        function i(e) {
            var n = t(this);
            n.toggleClass("help-content-body-open"), n.siblings(".help-content-body").toggleClass("none")
        }
        t(document).on("click", ".help-item-button", i), o.done(function() {
            t(document).off("click", ".help-item-button", i)
        })
    }), e.router.connect("^/warning/", function(n, o, i) {
        var a = t('input[type="submit"]');
        a.on("click", function(n) {
            var o = t(this);
            if (!e.Form.isDisabled(o) && !n.isDefaultPrevented()) {
                n.preventDefault();
                var i = t(this.form);
                e.Form.submit(i, o, !0).done(function(t) {
                    var n = e.Browsing.replaceWith(t.location || "/");
                    e.Form.disable(o, n)
                })
            }
        });
        var r = t(".exit-button");
        r.on("click", function(t) {
            t.preventDefault(), setTimeout(function() {
                wiiuBrowser.closeApplication()
            }, 0)
        }), i.done(function() {
            a.off("click"), r.off("click")
        })
    }), e.router.connect("^/special/redesign_announcement/(album|community)$", function(e, n, o) {
        var i = t("#back-button");
        i.on("click", function(t) {
            t.preventDefault(), history.back()
        }), o.done(function() {
            i.off("click")
        })
    }), e.GoogleAnalytics = {}, e.GoogleAnalytics.setCommonVars = function(n) {
        var o = t(document.body),
            i = o.attr("data-hashed-pid"),
            a = t(".body-content").attr("data-region") || o.attr("data-user-region") || "",
            r = o.attr("data-country") || "",
            s = o.attr("data-lang") || "",
            l = o.attr("data-user-region") || "",
            c = o.attr("data-age") || "",
            u = o.attr("data-gender") || "",
            d = o.attr("data-game-skill");
        d = "1" === d ? "beginner" : "2" === d ? "intermediate" : "3" === d ? "advanced" : "";
        var f = o.attr("data-follow-done");
        f = "1" === f ? "yes" : "0" === f ? "no" : "";
        var p = o.attr("data-post-done");
        p = "1" === p ? "yes" : "0" === p ? "no" : "";
        var m = "",
            g = "";
        if (n) {
            var v = n.pathname.match(new RegExp("^/titles/([0-9]+)/([0-9]+)"));
            g = v ? v[1] : "", m = v ? v[2] : ""
        }
        var h = e.Cookie.get("olive_launch_from") || "";
        ga("set", "userId", i), ga("set", "dimension1", r), ga("set", "dimension2", s), ga("set", "dimension3", l), ga("set", "dimension4", c), ga("set", "dimension5", u), ga("set", "dimension6", d), ga("set", "dimension7", a), ga("set", "dimension8", f), ga("set", "dimension9", p), ga("set", "dimension13", "WiiU"), ga("set", "dimension16", m), ga("set", "dimension17", g), ga("set", "dimension21", h || "")
    }, e.GoogleAnalytics.trackPageView = function(t) {
        e.GoogleAnalytics.refleshLocation(t), e.GoogleAnalytics.setCommonVars(t), ga("send", "pageview")
    }, e.GoogleAnalytics.trackError = function(t, n) {
        try {
            e.GoogleAnalytics.refleshLocation(t), e.GoogleAnalytics.setCommonVars(), ga("send", "exception", {
                exDescription: n
            })
        } catch (t) {}
    }, e.GoogleAnalytics.refleshLocation = function(t) {
        ga("set", "location", t.href)
    }, e.router.connect(/^/, function(n, o, i) {
        var a = t(".track-error");
        a.length > 0 ? e.GoogleAnalytics.trackError(o, a.attr("data-track-error")) : e.GoogleAnalytics.trackPageView(o)
    }), t(document).on("olv:browsing:error", function(t, n, o, i, a) {
        i.status && e.GoogleAnalytics.trackError(window.location, n.error_code)
    }), t(document).on("olv:net:error", function(t, n, o, i, a) {
        i.status && e.GoogleAnalytics.trackError(window.location, n.error_code)
    }), window.onerror = function(t, n, o) {
        var i = n + ":" + o + " - " + t;
        e.GoogleAnalytics.trackError(window.location, i)
    }, e.GoogleAnalytics.trackEvent = function(t, e, n, o) {
        ga("send", "event", t, e, n, o)
    }, e.GoogleAnalytics.createEventVars = function(t) {
        return {
            dimension10: t.attr("data-community-id") || "",
            dimension11: t.attr("data-title-id") || "",
            dimension12: t.attr("data-url-id") || "",
            dimension14: t.attr("data-post-with-screenshot") || "",
            dimension15: t.attr("data-post-content-type") || ""
        }
    }, e.init.done(function(t) {
        t(document).on("click", "[data-track-action]", function(n) {
            var o = t(this);
            if (!e.Form.hasBeenDisabled(o)) {
                var i = o.attr("data-track-category"),
                    a = o.attr("data-track-action"),
                    r = o.attr("data-track-label"),
                    s = e.GoogleAnalytics.createEventVars(o);
                e.GoogleAnalytics.trackEvent(i, a, r, s)
            }
        }), t(document).on("olv:modal:report-violation olv:modal:report-violator", function(t, e, n) {
            function o() {
                var t = r.find("option:selected").attr("data-track-action");
                i.attr("data-track-action", t)
            }
            var i = e.element.find(".post-button"),
                a = e.triggerElement.attr("data-can-report-spoiler"),
                r = "1" === a ? e.element.find("select.can-report-spoiler") : "0" === a ? e.element.find("select.cannot-report-spoiler") : e.element.find('select[name="type"]'),
                s = e.triggerElement.attr("data-track-label"),
                l = e.triggerElement.attr("data-url-id") || "";
            i.attr("data-track-label", s), i.attr("data-url-id", l), r.on("change", o), n.done(function() {
                r.off("change", o)
            })
        }), t(document).on("olv:form:send", function(t, n, o) {
            var i = (o.type || "GET").toUpperCase(),
                a = o.url;
            "POST" === i && "/settings/profile" === a ? e.GoogleAnalytics.trackEvent("profile", "changeProfile") : "POST" === i && "/settings/account" === a && e.GoogleAnalytics.trackEvent("setting", "changeSetting")
        }), t(document).on("olv:modal:add-entry", function(t, e, n) {
            function o() {
                r.attr("data-post-content-type", a.prop("checked") ? "text" : "draw")
            }
            var i = e.element.find('input[name="_post_type"]'),
                a = e.element.find('input[name="_post_type"][value="body"]'),
                r = e.element.find(".post-button");
            o(), i.on("click", o), n.done(function() {
                i.off("click", o)
            });
            var s = e.element.find('input[name="screenshot_type"]');
            if (s.length > 0) {
                var l = e.element.find('input[name="screenshot_type"][value="null"]'),
                    c = function() {
                        r.attr("data-post-with-screenshot", l.prop("checked") ? "nodata" : "screenshot")
                    };
                c(), s.on("click", c), n.done(function() {
                    s.off("click", c)
                })
            } else r.attr("data-post-with-screenshot", "nodata")
        }), t(document).on("olv:community:favorite:toggle", function(e, n) {
            t(e.target).attr("data-track-action", n ? "cancelFavorite" : "favorite")
        }), t(document).on("olv:entry:empathy:toggle", function(e, n) {
            t(e.target).attr("data-track-action", n ? "cancelYeah" : "yeah")
        }), t(document).on("olv:modal:confirm-unfollow", function(t, e, n) {
            var o = e.element.find(".post-button");
            o.attr("data-track-category", "follow"), o.attr("data-track-action", "unfollow"), o.attr("data-track-label", "user")
        }), t(document).on("olv:modal:delete-friend-request", function(t, e, n) {
            var o = e.element.find(".post-button");
            o.attr("data-track-category", "firendRequest"), o.attr("data-track-action", "rejectFriendRequest"), o.attr("data-track-label", "user")
        }), t(document).on("olv:entry:profile-post:set", function() {
            e.GoogleAnalytics.trackEvent("profilePost", "setProfilePost")
        }), t(document).on("olv:profile:profile-post:remove", function() {
            e.GoogleAnalytics.trackEvent("profilePost", "unsetProfilePost")
        }), t(document).on("olv:jump:eshop", function(n, o, i) {
            var a = t(n.target.activeElement),
                r = a.attr("data-track-category"),
                s = a.attr("data-track-label"),
                l = e.GoogleAnalytics.createEventVars(a);
            e.GoogleAnalytics.trackEvent(r, "jump", s, l)
        }), t(document).on("olv:entry:post:delete", function(n, o) {
            var i = t(o.option),
                a = i.attr("data-track-category"),
                r = i.attr("data-track-action"),
                s = i.attr("data-track-label"),
                l = e.GoogleAnalytics.createEventVars(i);
            e.GoogleAnalytics.trackEvent(a, r, s, l)
        })
    }))
}).call(this, jQuery, Olv);
Olv.Browsing.revision = 77;

Olv.Locale.Data = {
    "olv.datetime": {
        "value": "dd/MM/yyyy HH:mm"
    },
    "olv.portal.album.delete_confirm": {
        "value": "Are you sure you want to delete this?"
    },
    "olv.portal.album.save_album_image": {
        "value": "Save Screenshot"
    },
    "olv.portal.album.save_album_image.confirm": {
        "value": "The screenshot has been saved. Continue using Miiverse?"
    },
    "olv.portal.back": {
        "value": "Back"
    },
    "olv.portal.block": {
        "value": "Block"
    },
    "olv.portal.blocklist.add": {
        "value": "Block"
    },
    "olv.portal.blocklist.block_confirm": {
        "value": "Are you sure you want to block this user? You will no longer receive friend requests from them, and you will be less likely to encounter them in games."
    },
    "olv.portal.blocklist.block_successed_to": {
        "args": [1],
        "value": "%s has been blocked."
    },
    "olv.portal.blocklist.block_successed_to %1": {
        "args": [1],
        "value": "%s has been blocked."
    },
    "olv.portal.blocklist.block_successed_to [_1]": {
        "args": [1],
        "value": "%s has been blocked."
    },
    "olv.portal.blocklist.delete": {
        "value": "Unblock"
    },
    "olv.portal.blocklist.unblock_successed_to": {
        "args": [1],
        "value": "%s has been unblocked."
    },
    "olv.portal.blocklist.unblock_successed_to %1": {
        "args": [1],
        "value": "%s has been unblocked."
    },
    "olv.portal.blocklist.unblock_successed_to [_1]": {
        "args": [1],
        "value": "%s has been unblocked."
    },
    "olv.portal.breakup_succeeded_to": {
        "args": [1],
        "value": "%s has been removed from your friend list."
    },
    "olv.portal.breakup_succeeded_to %1": {
        "args": [1],
        "value": "%s has been removed from your friend list."
    },
    "olv.portal.breakup_succeeded_to [_1]": {
        "args": [1],
        "value": "%s has been removed from your friend list."
    },
    "olv.portal.button.remove": {
        "value": "Remove"
    },
    "olv.portal.cancel": {
        "value": "Cancel"
    },
    "olv.portal.cancel_request_succeeded_to": {
        "args": [1],
        "value": "Cancelled your friend request to %s."
    },
    "olv.portal.cancel_request_succeeded_to %1": {
        "args": [1],
        "value": "Cancelled your friend request to %s."
    },
    "olv.portal.cancel_request_succeeded_to [_1]": {
        "args": [1],
        "value": "Cancelled your friend request to %s."
    },
    "olv.portal.close": {
        "value": "Close"
    },
    "olv.portal.confirm.remove_from_blocklist": {
        "value": "Remove this user from your blocked-user list?"
    },
    "olv.portal.confirm_app_jump": {
        "args": [],
        "value": "This will close Miiverse. Are you sure?"
    },
    "olv.portal.confirm_app_jump %1": {
        "args": [],
        "value": "This will close Miiverse. Are you sure?"
    },
    "olv.portal.confirm_app_jump [_1]": {
        "args": [],
        "value": "This will close Miiverse. Are you sure?"
    },
    "olv.portal.confirm_display_played_mark": {
        "value": "If you have played the game you're posting about, your posts and comments will have a mark indicating this."
    },
    "olv.portal.confirm_first_favorite": {
        "value": "You added a community to your favourites!"
    },
    "olv.portal.confirm_open_eshop": {
        "value": "This will close Miiverse. Are you sure?"
    },
    "olv.portal.confirm_url_form.body": {
        "value": "Close Miiverse and go to this web page in the internet browser?"
    },
    "olv.portal.confirm_url_form.title": {
        "value": "Open Link"
    },
    "olv.portal.confirm_you_have_no_soft": {
        "value": "You do not have this software."
    },
    "olv.portal.contains.ng_words": {
        "value": "The text you entered contains\ninappropriate words or phrases."
    },
    "olv.portal.continue_miiverse": {
        "value": "Continue"
    },
    "olv.portal.create_comment.window_title": {
        "args": [1],
        "value": "Comment on %s's Post"
    },
    "olv.portal.create_comment.window_title %1": {
        "args": [1],
        "value": "Comment on %s's Post"
    },
    "olv.portal.create_comment.window_title [_1]": {
        "args": [1],
        "value": "Comment on %s's Post"
    },
    "olv.portal.dialog.apply_settings_done": {
        "value": "Settings saved."
    },
    "olv.portal.edit.action.close_topic_post": {
        "value": "Close for Comments"
    },
    "olv.portal.edit.action.close_topic_post.confirm": {
        "value": "It will no longer be possible to post comments on this discussion. Is that OK? (This action cannot be reversed.)"
    },
    "olv.portal.edit.edit_post": {
        "value": "Edit Post"
    },
    "olv.portal.edit.edit_reply": {
        "value": "Edit Comment"
    },
    "olv.portal.empathy.n_added": {
        "args": [1],
        "args_1": [1],
        "quanttype": "1_o",
        "value": "%s people gave this a Yeah.",
        "value_1": "%s person gave this a Yeah."
    },
    "olv.portal.empathy.n_added %1": {
        "args": [1],
        "args_1": [1],
        "quanttype": "1_o",
        "value": "%s people gave this a Yeah.",
        "value_1": "%s person gave this a Yeah."
    },
    "olv.portal.empathy.n_added [_1]": {
        "args": [1],
        "args_1": [1],
        "quanttype": "1_o",
        "value": "%s people gave this a Yeah.",
        "value_1": "%s person gave this a Yeah."
    },
    "olv.portal.empathy.you_added": {
        "value": "You gave this a Yeah."
    },
    "olv.portal.empathy.you_and_n_added": {
        "args": [1],
        "args_1": [1],
        "quanttype": "1_o",
        "value": "You and %s other people gave this a Yeah.",
        "value_1": "You and %s other person gave this a Yeah."
    },
    "olv.portal.empathy.you_and_n_added %1": {
        "args": [1],
        "args_1": [1],
        "quanttype": "1_o",
        "value": "You and %s other people gave this a Yeah.",
        "value_1": "You and %s other person gave this a Yeah."
    },
    "olv.portal.empathy.you_and_n_added [_1]": {
        "args": [1],
        "args_1": [1],
        "quanttype": "1_o",
        "value": "You and %s other people gave this a Yeah.",
        "value_1": "You and %s other person gave this a Yeah."
    },
    "olv.portal.erase": {
        "value": "Reject"
    },
    "olv.portal.error.500": {
        "value": "An error has occurred.\nPlease try again later.\nIf the problem persists, please contact your local customer support centre, quoting the error code. For contact details, check the Wii U Important Information booklet or visit\nsupport.nintendo.com."
    },
    "olv.portal.error.503.content": {
        "value": "The server is currently\nundergoing maintenance.\n\nPlease try again later."
    },
    "olv.portal.error.album_limit_exceeded": {
        "value": "Unable to save because the maximum number of screenshots that can be saved has been reached. Please delete some saved screenshots, and then try again."
    },
    "olv.portal.error.daily_post_limit_exceeded": {
        "value": "You have already exceeded the number of posts that you can contribute in a single day. Please try again tomorrow."
    },
    "olv.portal.error.failed_to_connect": {
        "value": "An error has occurred."
    },
    "olv.portal.error.memo_needs_drc": {
        "value": "Use the Wii U GamePad to write handwritten posts or messages."
    },
    "olv.portal.error.network_unavailable": {
        "value": "Could not connect to the internet.\nPlease check your network\nconnection and try again."
    },
    "olv.portal.error.post_time_restriction": {
        "args": [],
        "value": "Multiple posts cannot be made in such a short period of time. Please try posting again later."
    },
    "olv.portal.error.post_time_restriction %1": {
        "args": [],
        "value": "Multiple posts cannot be made in such a short period of time. Please try posting again later."
    },
    "olv.portal.error.post_time_restriction [_1]": {
        "args": [],
        "value": "Multiple posts cannot be made in such a short period of time. Please try posting again later."
    },
    "olv.portal.friend.first_request_confirm": {
        "value": "By becoming friends with this user, you will be able to interact in games that support Nintendo Network, exchange messages, have video chat conversations and so on. Is this OK?"
    },
    "olv.portal.friend_message_to": {
        "args": [1, 2],
        "value": "Message to %s (%s)"
    },
    "olv.portal.friend_message_to %1": {
        "args": [1, 2],
        "value": "Message to %s (%s)"
    },
    "olv.portal.friend_message_to [_1]": {
        "args": [1, 2],
        "value": "Message to %s (%s)"
    },
    "olv.portal.friend_request.confirm_breakup": {
        "value": "Remove this user from your friend list? You will be removed from their list as well."
    },
    "olv.portal.friend_request.confirm_cancel_request": {
        "value": "Cancel your friend request to this user?"
    },
    "olv.portal.friend_request.confirm_delete": {
        "args": [1],
        "value": "Reject %s's friend request? They will not be told that the friend request was rejected."
    },
    "olv.portal.friend_request.confirm_delete %1": {
        "args": [1],
        "value": "Reject %s's friend request? They will not be told that the friend request was rejected."
    },
    "olv.portal.friend_request.confirm_delete [_1]": {
        "args": [1],
        "value": "Reject %s's friend request? They will not be told that the friend request was rejected."
    },
    "olv.portal.friend_request.delete": {
        "value": "Reject Friend Request"
    },
    "olv.portal.friend_request.deleted": {
        "value": "You have rejected the friend request."
    },
    "olv.portal.friend_request.deleted_from": {
        "args": [1],
        "value": "You have rejected %s's friend request."
    },
    "olv.portal.friend_request.deleted_from %1": {
        "args": [1],
        "value": "You have rejected %s's friend request."
    },
    "olv.portal.friend_request.deleted_from [_1]": {
        "args": [1],
        "value": "You have rejected %s's friend request."
    },
    "olv.portal.friend_request.no_message": {
        "value": "No message."
    },
    "olv.portal.friend_request.send_succeeded_to": {
        "args": [1],
        "value": "A friend request has been sent to %s.\nYou will become friends once they accept your request."
    },
    "olv.portal.friend_request.send_succeeded_to %1": {
        "args": [1],
        "value": "A friend request has been sent to %s.\nYou will become friends once they accept your request."
    },
    "olv.portal.friend_request.send_succeeded_to [_1]": {
        "args": [1],
        "value": "A friend request has been sent to %s.\nYou will become friends once they accept your request."
    },
    "olv.portal.friend_request.successed": {
        "value": "You're now friends!"
    },
    "olv.portal.friend_request.successed_with": {
        "args": [1],
        "value": "You're now friends with %s!"
    },
    "olv.portal.friend_request.successed_with %1": {
        "args": [1],
        "value": "You're now friends with %s!"
    },
    "olv.portal.friend_request.successed_with [_1]": {
        "args": [1],
        "value": "You're now friends with %s!"
    },
    "olv.portal.manual.index.post": {
        "value": "Posting"
    },
    "olv.portal.miitoo": {
        "value": "Yeah!"
    },
    "olv.portal.miitoo.delete": {
        "value": "Unyeah"
    },
    "olv.portal.miitoo.frustrated": {
        "value": "Yeah..."
    },
    "olv.portal.miitoo.frustrated.delete": {
        "value": "Unyeah"
    },
    "olv.portal.miitoo.happy": {
        "value": "Yeah!"
    },
    "olv.portal.miitoo.happy.delete": {
        "value": "Unyeah"
    },
    "olv.portal.miitoo.like": {
        "value": "Yeah\u2665"
    },
    "olv.portal.miitoo.like.delete": {
        "value": "Unyeah"
    },
    "olv.portal.miitoo.normal": {
        "value": "Yeah!"
    },
    "olv.portal.miitoo.normal.delete": {
        "value": "Unyeah"
    },
    "olv.portal.miitoo.puzzled": {
        "value": "Yeah..."
    },
    "olv.portal.miitoo.puzzled.delete": {
        "value": "Unyeah"
    },
    "olv.portal.miitoo.surprised": {
        "value": "Yeah?!"
    },
    "olv.portal.miitoo.surprised.delete": {
        "value": "Unyeah"
    },
    "olv.portal.my_page": {
        "value": "User Page"
    },
    "olv.portal.ok": {
        "value": "OK"
    },
    "olv.portal.parental_confirm.body": {
        "args": [1],
        "value": "%s is restricted by Parental Controls. Please enter the PIN using the Wii U GamePad."
    },
    "olv.portal.parental_confirm.body %1": {
        "args": [1],
        "value": "%s is restricted by Parental Controls. Please enter the PIN using the Wii U GamePad."
    },
    "olv.portal.parental_confirm.body [_1]": {
        "args": [1],
        "value": "%s is restricted by Parental Controls. Please enter the PIN using the Wii U GamePad."
    },
    "olv.portal.parental_confirm.fail_many_times_message": {
        "value": "You did not enter the correct PIN. If you have forgotten the PIN, please reset it in Parental Controls."
    },
    "olv.portal.parental_confirm.fail_message": {
        "value": "Incorrect PIN. Please try again."
    },
    "olv.portal.parental_confirm.title": {
        "value": "PIN Entry"
    },
    "olv.portal.parental_control.function.friend": {
        "value": "Friend registration"
    },
    "olv.portal.post.confirm_view_post": {
        "value": "View this post?"
    },
    "olv.portal.post.delete_confirm": {
        "value": "Delete this post?"
    },
    "olv.portal.post.screenshot_forbidden": {
        "value": "You cannot attach this screenshot to a post."
    },
    "olv.portal.post.screenshot_required": {
        "value": "Please select a screenshot."
    },
    "olv.portal.post.show_all_n_comments": {
        "args": [1],
        "args_1": [],
        "quanttype": "1_o",
        "value": "Show all comments (%s)",
        "value_1": "Show comment"
    },
    "olv.portal.post.show_all_n_comments %1": {
        "args": [1],
        "args_1": [],
        "quanttype": "1_o",
        "value": "Show all comments (%s)",
        "value_1": "Show comment"
    },
    "olv.portal.post.show_all_n_comments [_1]": {
        "args": [1],
        "args_1": [],
        "quanttype": "1_o",
        "value": "Show all comments (%s)",
        "value_1": "Show comment"
    },
    "olv.portal.post.show_oldest_n_comments": {
        "args": [],
        "args_1": [],
        "quanttype": "1_o",
        "value": "View oldest comments",
        "value_1": "View oldest comments"
    },
    "olv.portal.post.show_oldest_n_comments %1": {
        "args": [],
        "args_1": [],
        "quanttype": "1_o",
        "value": "View oldest comments",
        "value_1": "View oldest comments"
    },
    "olv.portal.post.show_oldest_n_comments [_1]": {
        "args": [],
        "args_1": [],
        "quanttype": "1_o",
        "value": "View oldest comments",
        "value_1": "View oldest comments"
    },
    "olv.portal.profile_post": {
        "value": "Favourite Post"
    },
    "olv.portal.profile_post.confirm_remove": {
        "value": "Remove favourite post from your profile?\nThe original post will not be deleted."
    },
    "olv.portal.profile_post.confirm_update": {
        "value": "Set this as your favourite post?\nIt will replace any post currently set."
    },
    "olv.portal.profile_post.confirm_update.yes": {
        "value": "OK"
    },
    "olv.portal.profile_post.done": {
        "value": "This has been set as your favourite post.\nWould you like to view your profile?"
    },
    "olv.portal.read_more_content": {
        "value": "Read More"
    },
    "olv.portal.reply.confirm_view_reply": {
        "value": "View this comment?"
    },
    "olv.portal.reply.delete_confirm": {
        "value": "Delete this comment?"
    },
    "olv.portal.report.report_comment_id": {
        "args": [1],
        "value": "Comment ID: %s"
    },
    "olv.portal.report.report_comment_id %1": {
        "args": [1],
        "value": "Comment ID: %s"
    },
    "olv.portal.report.report_comment_id [_1]": {
        "args": [1],
        "value": "Comment ID: %s"
    },
    "olv.portal.report.report_message_id": {
        "args": [1],
        "value": "Message ID: %s"
    },
    "olv.portal.report.report_message_id %1": {
        "args": [1],
        "value": "Message ID: %s"
    },
    "olv.portal.report.report_message_id [_1]": {
        "args": [1],
        "value": "Message ID: %s"
    },
    "olv.portal.report.report_post_id": {
        "args": [1],
        "value": "Post ID: %s"
    },
    "olv.portal.report.report_post_id %1": {
        "args": [1],
        "value": "Post ID: %s"
    },
    "olv.portal.report.report_post_id [_1]": {
        "args": [1],
        "value": "Post ID: %s"
    },
    "olv.portal.report.report_spoiler": {
        "args": [],
        "value": "Report Spoilers to Miiverse Administrators"
    },
    "olv.portal.report.report_spoiler %1": {
        "args": [],
        "value": "Report Spoilers to Miiverse Administrators"
    },
    "olv.portal.report.report_spoiler [_1]": {
        "args": [],
        "value": "Report Spoilers to Miiverse Administrators"
    },
    "olv.portal.report.report_spoiler_comment": {
        "args": [],
        "value": "Report Spoilers to Miiverse Administrators"
    },
    "olv.portal.report.report_spoiler_comment %1": {
        "args": [],
        "value": "Report Spoilers to Miiverse Administrators"
    },
    "olv.portal.report.report_spoiler_comment [_1]": {
        "args": [],
        "value": "Report Spoilers to Miiverse Administrators"
    },
    "olv.portal.report.report_violation": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation %1": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation [_1]": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation_comment": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation_comment %1": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation_comment [_1]": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation_message": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation_message %1": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.report.report_violation_message [_1]": {
        "args": [],
        "value": "Report Violation to Miiverse Administrators"
    },
    "olv.portal.return_to_game": {
        "value": "Resume Game"
    },
    "olv.portal.setup": {
        "value": "Set Up"
    },
    "olv.portal.show_more_content": {
        "value": "View Whole Post"
    },
    "olv.portal.stop": {
        "value": "Cancel"
    },
    "olv.portal.unfavorite_succeeded_to": {
        "value": "Removed from favourites."
    },
    "olv.portal.unfollow": {
        "value": "Unfollow"
    },
    "olv.portal.unfollow_succeeded_to": {
        "args": [1],
        "value": "You are no longer following\n%s."
    },
    "olv.portal.unfollow_succeeded_to %1": {
        "args": [1],
        "value": "You are no longer following\n%s."
    },
    "olv.portal.unfollow_succeeded_to [_1]": {
        "args": [1],
        "value": "You are no longer following\n%s."
    },
    "olv.portal.user.search.found_message": {
        "args": [1],
        "value": "Found \"%s\"."
    },
    "olv.portal.user.search.found_message %1": {
        "args": [1],
        "value": "Found \"%s\"."
    },
    "olv.portal.user.search.found_message [_1]": {
        "args": [1],
        "value": "Found \"%s\"."
    },
    "olv.portal.user.search.go": {
        "value": "View Profile"
    },
    "olv.portal.user.search.not_found_message": {
        "args": [1],
        "value": "Could not find \"%s\".\nTry entering the information again."
    },
    "olv.portal.user.search.not_found_message %1": {
        "args": [1],
        "value": "Could not find \"%s\".\nTry entering the information again."
    },
    "olv.portal.user.search.not_found_message [_1]": {
        "args": [1],
        "value": "Could not find \"%s\".\nTry entering the information again."
    },
    "olv.portal.welcome.exit_confirm": {
        "value": "Close Miiverse?"
    },
    "olv.portal.welcome.select_game_skill": {
        "value": "Please choose an option which describes your level of experience with games."
    },
    "olv.portal.welcome.select_luminous_opt_in": {
        "value": "Please choose whether or not you would like to receive notification alerts."
    },
    "olv.portal.welcome.select_notice_opt_in": {
        "value": "Please choose whether or not to receive notifications from Miiverse."
    },
    "olv.portal.yes": {
        "value": "Yes"
    }
};