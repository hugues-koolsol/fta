/*
 sqlite-parser-demo - v1.0.0
 @copyright 2015-2017 Code School (http://codeschool.com)
 @author Nick Wronski <nick@javascript.com>
*/
require = function a$jscomp$0(qa, Ca, va) {
  function W(y, A) {
    if (!Ca[y]) {
      if (!qa[y]) {
        var r = "function" == typeof require && require;
        if (!A && r) {
          return r(y, !0);
        }
        if (R) {
          return R(y, !0);
        }
        A = Error("Cannot find module '" + y + "'");
        throw A.code = "MODULE_NOT_FOUND", A;
      }
      A = Ca[y] = {exports:{}};
      qa[y][0].call(A.exports, function(E) {
        var u = qa[y][1][E];
        return W(u ? u : E);
      }, A, A.exports, a$jscomp$0, qa, Ca, va);
    }
    return Ca[y].exports;
  }
  for (var R = "function" == typeof require && require, G = 0; G < va.length; G++) {
    W(va[G]);
  }
  return W;
}({"./streaming":[function(qa, Ca, va) {
  function x(W, R) {
    if (!(W instanceof R)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  Object.defineProperty(va, "__esModule", {value:!0});
  va.SqliteParserTransform = function G(R) {
    throw x(this, G), Error("SqliteParserTransform is not available in this environment");
  };
  va.SingleNodeTransform = function y(G) {
    throw x(this, y), Error("SingleNodeTransform is not available in this environment");
  };
}, {}], 1:[function(qa, Ca, va) {
  function x(y, A, r, E) {
    this.message = y;
    this.expected = A;
    this.found = r;
    this.location = E;
    this.name = "SyntaxError";
    "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, x);
  }
  function W() {
    this.indentLevel = 0;
  }
  var R = function() {
    return function(y, A) {
      if (Array.isArray(y)) {
        return y;
      }
      if (Symbol.iterator in Object(y)) {
        var r = [], E = !0, u = !1, T = void 0;
        try {
          for (var S, C = y[Symbol.iterator](); !(E = (S = C.next()).done) && (r.push(S.value), !A || r.length !== A); E = !0) {
          }
        } catch (f) {
          u = !0, T = f;
        } finally {
          try {
            !E && C.return && C.return();
          } finally {
            if (u) {
              throw T;
            }
          }
        }
        return r;
      }
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
  }(), G = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(y) {
    return typeof y;
  } : function(y) {
    return y && "function" == typeof Symbol && y.constructor === Symbol && y !== Symbol.prototype ? "symbol" : typeof y;
  };
  (function(y, A) {
    function r() {
      this.constructor = y;
    }
    r.prototype = A.prototype;
    y.prototype = new r();
  })(x, Error);
  x.buildMessage = function(y, A) {
    function r(C) {
      return C.charCodeAt(0).toString(16).toUpperCase();
    }
    function E(C) {
      return C.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(f) {
        return "\\x0" + r(f);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(f) {
        return "\\x" + r(f);
      });
    }
    function u(C) {
      return C.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(f) {
        return "\\x0" + r(f);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(f) {
        return "\\x" + r(f);
      });
    }
    function T(C) {
      return S[C.type](C);
    }
    var S = {literal:function(C) {
      return '"' + E(C.text) + '"';
    }, class:function(C) {
      var f = C.parts.map(function(L) {
        return Array.isArray(L) ? u(L[0]) + "-" + u(L[1]) : u(L);
      });
      return "[" + (C.inverted ? "^" : "") + f + "]";
    }, any:function(C) {
      return "any character";
    }, end:function(C) {
      return "end of input";
    }, other:function(C) {
      return C.description;
    }};
    return "Expected " + function(C) {
      var f, L = C.map(T);
      if (L.sort(), 0 < L.length) {
        for (f = C = 1; C < L.length; C++) {
          L[C - 1] !== L[C] && (L[f] = L[C], f++);
        }
        L.length = f;
      }
      switch(L.length) {
        case 1:
          return L[0];
        case 2:
          return L[0] + " or " + L[1];
        default:
          return L.slice(0, -1).join(", ") + ", or " + L[L.length - 1];
      }
    }(y) + " but " + (A ? '"' + E(A) + '"' : "end of input") + " found.";
  };
  W.prototype.trace = function(y) {
    function A(E) {
      function u(S, C) {
        var f, L = "";
        for (f = 0; f < C; f++) {
          L += S;
        }
        return L;
      }
      function T(S, C) {
        return S + u(" ", C - S.length);
      }
      "object" === ("undefined" == typeof console ? "undefined" : G(console)) && console.log(E.location.start.line + ":" + E.location.start.column + "-" + E.location.end.line + ":" + E.location.end.column + " " + T(E.type, 10) + " " + u("  ", r.indentLevel) + E.rule);
    }
    var r = this;
    switch(y.type) {
      case "rule.enter":
        A(y);
        this.indentLevel++;
        break;
      case "rule.match":
        this.indentLevel--;
        A(y);
        break;
      case "rule.fail":
        this.indentLevel--;
        A(y);
        break;
      default:
        throw Error("Invalid event type: " + y.type + ".");
    }
  };
  Ca.exports = {SyntaxError:x, DefaultTracer:W, parse:function(y, A) {
    function r(k, n) {
      return {type:"literal", text:k, ignoreCase:n};
    }
    function E(k, n, w) {
      return {type:"class", parts:k, inverted:n, ignoreCase:w};
    }
    function u(k) {
      return {type:"other", description:k};
    }
    function T(k) {
      var n, w = lb[k];
      if (w) {
        return w;
      }
      for (n = k - 1; !lb[n];) {
        n--;
      }
      w = lb[n];
      for (w = {line:w.line, column:w.column}; n < k;) {
        10 === y.charCodeAt(n) ? (w.line++, w.column = 1) : w.column++, n++;
      }
      return lb[k] = w, w;
    }
    function S(k, n) {
      var w = T(k), B = T(n);
      return {start:{offset:k, line:w.line, column:w.column}, end:{offset:n, line:B.line, column:B.column}};
    }
    function C(k) {
      Aa < Xa || (Aa > Xa && (Xa = Aa, Lb = []), Lb.push(k));
    }
    function f(k) {
      return k.split("").map(function(n) {
        return n.charCodeAt(0) - 32;
      });
    }
    function L(k) {
      var n, w = Mb[k], B = 0, ma = [], na = w.length, wa = [], ia = [], Ya = Aa;
      Db.trace({type:"rule.enter", rule:mb[k], description:hb[k], location:S(Ya, Ya)});
      var Nb = 545 * Aa + k;
      if (n = Yb[Nb]) {
        return Aa = n.nextPos, n.result !== Va ? Db.trace({type:"rule.match", rule:mb[k], description:hb[k], result:n.result, location:S(Ya, Aa)}) : Db.trace({type:"rule.fail", rule:mb[k], description:hb[k], location:S(Ya, Ya)}), n.result;
      }
      for (;;) {
        for (; B < na;) {
          switch(w[B]) {
            case 0:
              ia.push(Ja[w[B + 1]]);
              B += 2;
              break;
            case 1:
              ia.push(void 0);
              B++;
              break;
            case 2:
              ia.push(null);
              B++;
              break;
            case 3:
              ia.push(Va);
              B++;
              break;
            case 4:
              ia.push([]);
              B++;
              break;
            case 5:
              ia.push(Aa);
              B++;
              break;
            case 6:
              ia.pop();
              B++;
              break;
            case 7:
              Aa = ia.pop();
              B++;
              break;
            case 8:
              ia.length -= w[B + 1];
              B += 2;
              break;
            case 9:
              ia.splice(-2, 1);
              B++;
              break;
            case 10:
              ia[ia.length - 2].push(ia.pop());
              B++;
              break;
            case 11:
              ia.push(ia.splice(ia.length - w[B + 1], w[B + 1]));
              B += 2;
              break;
            case 12:
              ia.push(y.substring(ia.pop(), Aa));
              B++;
              break;
            case 13:
              wa.push(na);
              ma.push(B + 3 + w[B + 1] + w[B + 2]);
              ia[ia.length - 1] ? (na = B + 3 + w[B + 1], B += 3) : (na = B + 3 + w[B + 1] + w[B + 2], B += 3 + w[B + 1]);
              break;
            case 14:
              wa.push(na);
              ma.push(B + 3 + w[B + 1] + w[B + 2]);
              ia[ia.length - 1] === Va ? (na = B + 3 + w[B + 1], B += 3) : (na = B + 3 + w[B + 1] + w[B + 2], B += 3 + w[B + 1]);
              break;
            case 15:
              wa.push(na);
              ma.push(B + 3 + w[B + 1] + w[B + 2]);
              ia[ia.length - 1] !== Va ? (na = B + 3 + w[B + 1], B += 3) : (na = B + 3 + w[B + 1] + w[B + 2], B += 3 + w[B + 1]);
              break;
            case 16:
              ia[ia.length - 1] !== Va ? (wa.push(na), ma.push(B), na = B + 2 + w[B + 1], B += 2) : B += 2 + w[B + 1];
              break;
            case 17:
              wa.push(na);
              ma.push(B + 3 + w[B + 1] + w[B + 2]);
              y.length > Aa ? (na = B + 3 + w[B + 1], B += 3) : (na = B + 3 + w[B + 1] + w[B + 2], B += 3 + w[B + 1]);
              break;
            case 18:
              wa.push(na);
              ma.push(B + 4 + w[B + 2] + w[B + 3]);
              y.substr(Aa, Ja[w[B + 1]].length) === Ja[w[B + 1]] ? (na = B + 4 + w[B + 2], B += 4) : (na = B + 4 + w[B + 2] + w[B + 3], B += 4 + w[B + 2]);
              break;
            case 19:
              wa.push(na);
              ma.push(B + 4 + w[B + 2] + w[B + 3]);
              y.substr(Aa, Ja[w[B + 1]].length).toLowerCase() === Ja[w[B + 1]] ? (na = B + 4 + w[B + 2], B += 4) : (na = B + 4 + w[B + 2] + w[B + 3], B += 4 + w[B + 2]);
              break;
            case 20:
              wa.push(na);
              ma.push(B + 4 + w[B + 2] + w[B + 3]);
              Ja[w[B + 1]].test(y.charAt(Aa)) ? (na = B + 4 + w[B + 2], B += 4) : (na = B + 4 + w[B + 2] + w[B + 3], B += 4 + w[B + 2]);
              break;
            case 21:
              ia.push(y.substr(Aa, w[B + 1]));
              Aa += w[B + 1];
              B += 2;
              break;
            case 22:
              ia.push(Ja[w[B + 1]]);
              Aa += Ja[w[B + 1]].length;
              B += 2;
              break;
            case 23:
              ia.push(Va);
              0 === nb && C(Ja[w[B + 1]]);
              B += 2;
              break;
            case 24:
              B += 2;
              break;
            case 25:
              B++;
              break;
            case 26:
              n = w.slice(B + 4, B + 4 + w[B + 3]).map(function(Ob) {
                return ia[ia.length - 1 - Ob];
              });
              ia.splice(ia.length - w[B + 2], w[B + 2], Ja[w[B + 1]].apply(null, n));
              B += 4 + w[B + 3];
              break;
            case 27:
              ia.push(L(w[B + 1]));
              B += 2;
              break;
            case 28:
              nb++;
              B++;
              break;
            case 29:
              nb--;
              B++;
              break;
            default:
              throw Error("Invalid opcode: " + w[B] + ".");
          }
        }
        if (!(0 < wa.length)) {
          break;
        }
        na = wa.pop();
        B = ma.pop();
      }
      return Yb[Nb] = {nextPos:Aa, result:ia[0]}, ia[0] !== Va ? Db.trace({type:"rule.match", rule:mb[k], description:hb[k], result:ia[0], location:S(Ya, Aa)}) : Db.trace({type:"rule.fail", rule:mb[k], description:hb[k], location:S(Ya, Ya)}), ia[0];
    }
    function Q(k) {
      return null != k ? Array.isArray(k) ? k : [k] : [];
    }
    function N(k) {
      var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : " ";
      return k.filter(function(w) {
        return null != w;
      }).reduce(function(w, B) {
        return "" + w + ha(B) + n;
      }, "").trim();
    }
    function H(k) {
      return N(k, "");
    }
    function J(k) {
      return N(k).toLowerCase();
    }
    function V(k) {
      return k.filter(function(n) {
        return null != n;
      }).reduce(function(n, w) {
        return n.concat(w);
      }, []);
    }
    function ra(k) {
      var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "'", w = new RegExp(n + "{2}", "g");
      return ha(k).replace(w, n);
    }
    function ha() {
      return Q(0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : []).join("");
    }
    function P(k) {
      return ha(k).trim().toLowerCase();
    }
    function ob(k) {
      return Array.isArray(k) && 0 < k.length && null != k[0];
    }
    function Eb(k, n) {
      return n.reduce(function(w, B) {
        var ma = R(B, 4);
        B = (ma[0], ma[1]);
        ma = (ma[2], ma[3]);
        return {type:"expression", format:"binary", variant:"operation", operation:P(B), left:w, right:ma};
      }, k);
    }
    A = void 0 !== A ? A : {};
    var cb, Va = {}, ib = {start:0, start_streaming:1}, jb = 0, Ja = [function(k) {
      return k;
    }, function(k, n) {
      return {type:"statement", variant:"list", statement:V([k, n])};
    }, function(k) {
      return k;
    }, u("Type Definition"), function(k, n) {
      return Object.assign(k, n);
    }, function(k) {
      return {type:"datatype", variant:k[0], affinity:k[1]};
    }, u("Custom Datatype Name"), function(k, n) {
      k = J([k, n]);
      n = "numeric";
      return /int/i.test(k) ? n = "integer" : /char|clob|text/i.test(k) ? n = "text" : /blob/i.test(k) ? n = "blob" : /real|floa|doub/i.test(k) && (n = "real"), {type:"datatype", variant:k, affinity:n};
    }, /^[\t ]/, E(["\t", " "], !1, !1), function(k) {
      return k;
    }, u("Type Definition Arguments"), function(k, n) {
      return {args:{type:"expression", variant:"list", expression:V([k, n])}};
    }, function(k) {
      return k;
    }, u("Null Literal"), function(k) {
      return {type:"literal", variant:"null", value:P(k)};
    }, u("Date Literal"), function(k) {
      return {type:"literal", variant:"date", value:P(k)};
    }, u("String Literal"), function(k, n) {
      return {type:"literal", variant:"text", value:n};
    }, u("Single-quoted String Literal"), function(k) {
      return ra(k, "'");
    }, "''", r("''", !1), /^[^']/, E(["'"], !0, !1), u("Blob Literal"), /^[x]/i, E(["x"], !1, !0), function(k) {
      return {type:"literal", variant:"blob", value:k};
    }, function(k) {
      return {type:"literal", variant:"text", value:k};
    }, u("Number Sign"), function(k, n) {
      return null != k && (n.value = H([k, n.value])), n;
    }, function(k, n) {
      return {type:"literal", variant:"decimal", value:H([k, n])};
    }, u("Decimal Literal"), function(k, n) {
      return H([k, n]);
    }, function(k, n) {
      return H([k, n]);
    }, u("Decimal Literal Exponent"), "e", r("E", !0), /^[+\-]/, E(["+", "-"], !1, !1), function(k, n, w) {
      return H([k, n, w]);
    }, u("Hexidecimal Literal"), "0x", r("0x", !0), function(k, n) {
      return {type:"literal", variant:"hexidecimal", value:H([k, n])};
    }, /^[0-9a-f]/i, E([["0", "9"], ["a", "f"]], !1, !0), /^[0-9]/, E([["0", "9"]], !1, !1), u("Bind Parameter"), function(k) {
      return Object.assign({type:"variable"}, k);
    }, u("Numbered Bind Parameter"), function(k, n) {
      return {format:"numbered", name:H([k, n])};
    }, /^[1-9]/, E([["1", "9"]], !1, !1), function(k, n) {
      return H([k, n]);
    }, u("Named Bind Parameter"), /^[:@]/, E([":", "@"], !1, !1), function(k, n) {
      return {format:"named", name:H([k, n])};
    }, u("TCL Bind Parameter"), "$", r("$", !1), ":", r(":", !1), function(k, n, w) {
      return Object.assign({format:"tcl", name:H([k, n])}, w);
    }, function(k) {
      return {suffix:k};
    }, u("EXISTS Expression"), function(k, n) {
      return null != k ? {type:"expression", format:"unary", variant:"exists", expression:n, operator:P(k)} : n;
    }, u("EXISTS Keyword"), function(k, n) {
      return J([k, n]);
    }, u("RAISE Expression"), function(k, n) {
      return Object.assign({type:"expression", format:"unary", variant:P(k), expression:n}, n);
    }, u("RAISE Expression Arguments"), function(k) {
      return Object.assign({type:"error"}, k);
    }, u("IGNORE Keyword"), function(k) {
      return {action:P(k)};
    }, function(k, n) {
      return {action:P(k), message:n};
    }, function(k) {
      return k;
    }, function(k, n) {
      return Object.assign(n, {expression:k});
    }, function(k, n) {
      return {type:"expression", format:"unary", variant:"operation", expression:n, operator:P(k)};
    }, u("COLLATE Expression"), function(k) {
      return Object.assign({type:"expression", format:"unary", variant:"operation", operator:"collate"}, k);
    }, function(k, n) {
      return Eb(k, n);
    }, function(k) {
      return [null, k, null, {type:"literal", variant:"null", value:"null"}];
    }, "not ", r("NOT ", !0), "null", r("NULL", !0), function() {
      return "not";
    }, function() {
      return "is";
    }, u("CAST Expression"), function(k, n, w) {
      return {type:"expression", format:"unary", variant:P(k), expression:n, as:w};
    }, u("Type Alias"), function(k) {
      return k;
    }, u("CASE Expression"), function(k, n, w, B) {
      return Object.assign({type:"expression", variant:P(k), expression:V([w, B])}, n);
    }, function(k) {
      return {discriminant:k};
    }, u("WHEN Clause"), function(k, n, w) {
      return {type:"condition", variant:P(k), condition:n, consequent:w};
    }, u("ELSE Clause"), function(k, n) {
      return {type:"condition", variant:P(k), consequent:n};
    }, function(k, n) {
      return Object.assign(n, {left:k});
    }, u("Comparison Expression"), function(k, n, w, B) {
      return Object.assign({type:"expression", format:"binary", variant:"operation", operation:J([k, n]), right:w}, B);
    }, u("ESCAPE Expression"), function(k, n) {
      return {escape:n};
    }, u("BETWEEN Expression"), function(k, n, w) {
      return {type:"expression", format:"binary", variant:"operation", operation:J([k, n]), right:w};
    }, function(k, n) {
      return Eb(k, [n]);
    }, function(k) {
      return P(k);
    }, u("IN Expression"), function(k, n, w) {
      return {type:"expression", format:"binary", variant:"operation", operation:J([k, n]), right:w};
    }, function(k) {
      return k;
    }, u("Expression List"), function(k) {
      return {type:"expression", variant:"list", expression:null != k ? k : []};
    }, function(k, n) {
      return V([k, n]);
    }, u("Function Call"), function(k, n) {
      return Object.assign({type:"function", name:k}, n);
    }, u("Function Call Arguments"), function(k) {
      return {args:{type:"identifier", variant:"star", name:k}};
    }, function(k, n) {
      return null == k || 0 < n.expression.length;
    }, function(k, n) {
      return {args:Object.assign(n, k)};
    }, function(k) {
      return {filter:P(k)};
    }, u("Error Message"), function(k) {
      return k;
    }, u("Statement"), function(k, n) {
      return Object.assign(n, k);
    }, u("QUERY PLAN"), function(k, n) {
      return {explain:null != k};
    }, u("QUERY PLAN Keyword"), function(k, n) {
      return J([k, n]);
    }, u("END Transaction Statement"), function(k, n) {
      return {type:"statement", variant:"transaction", action:"commit"};
    }, u("BEGIN Transaction Statement"), function(k, n, w, B) {
      return Object.assign({type:"statement", variant:"transaction", action:"begin"}, n, B);
    }, function(k) {
      return k;
    }, function(k) {
      return {defer:P(k)};
    }, u("ROLLBACK Statement"), function(k, n) {
      return Object.assign({type:"statement", variant:"transaction", action:"rollback"}, n);
    }, u("TO Clause"), function(k) {
      return {savepoint:k};
    }, function(k) {
      return P(k);
    }, u("SAVEPOINT Statement"), function(k, n) {
      return {type:"statement", variant:k, target:n};
    }, u("RELEASE Statement"), function(k, n, w) {
      return {type:"statement", variant:P(k), target:w};
    }, u("ALTER TABLE Statement"), function(k, n, w) {
      return Object.assign({type:"statement", variant:P(k), target:n}, w);
    }, u("ALTER TABLE Keyword"), function(k, n) {
      return J([k, n]);
    }, u("RENAME TO Keyword"), function(k, n) {
      return {action:P(k), name:n};
    }, u("ADD COLUMN Keyword"), function(k, n) {
      return {action:P(k), definition:n};
    }, function(k, n) {
      return Object.assign(n, k);
    }, u("WITH Clause"), function(k, n, w) {
      var B = {variant:null != n ? "recursive" : "common"};
      return ob(w) && (w = w.map(function(ma) {
        return Object.assign(ma, B);
      })), {with:w};
    }, function(k, n) {
      return V([k, n]);
    }, u("Common Table Expression"), function(k, n) {
      return Object.assign({type:"expression", format:"table", variant:"common", target:k}, n);
    }, function(k) {
      return {expression:k};
    }, function(k, n) {
      return Object.assign(n, k);
    }, u("ATTACH Statement"), function(k, n, w, B) {
      return {type:"statement", variant:P(k), target:B, attach:w};
    }, u("DETACH Statement"), function(k, n, w) {
      return {type:"statement", variant:P(k), target:w};
    }, u("VACUUM Statement"), function(k, n) {
      return Object.assign({type:"statement", variant:"vacuum"}, n);
    }, function(k) {
      return {target:k};
    }, u("ANALYZE Statement"), function(k, n) {
      return Object.assign({type:"statement", variant:P(k)}, n);
    }, function(k) {
      return {target:k.name};
    }, u("REINDEX Statement"), function(k) {
      return {target:k.name};
    }, u("PRAGMA Statement"), function(k, n, w) {
      return {type:"statement", variant:P(k), target:n, args:{type:"expression", variant:"list", expression:w}};
    }, function(k) {
      return k;
    }, function(k) {
      return /^(yes|no|on|off|false|true|0|1)$/i.test(k);
    }, function(k) {
      return {type:"literal", variant:"boolean", normalized:/^(yes|on|true|1)$/i.test(k) ? "1" : "0", value:k};
    }, function(k) {
      return P(k);
    }, function(k) {
      return {type:"identifier", variant:"name", name:k};
    }, u("SELECT Statement"), function(k, n, w) {
      return Object.assign(k, n, w);
    }, u("ORDER BY Clause"), function(k) {
      return {order:k.result};
    }, u("LIMIT Clause"), function(k, n, w) {
      return {limit:Object.assign({type:"expression", variant:"limit", start:n}, w)};
    }, u("OFFSET Clause"), function(k, n) {
      return {offset:n};
    }, function(k, n) {
      return ob(n) ? {type:"statement", variant:"compound", statement:k, compound:n} : k;
    }, u("Union Operation"), function(k, n) {
      return {type:"compound", variant:k, statement:n};
    }, function(k, n, w, B) {
      return Object.assign({type:"statement", variant:"select"}, k, n, w, B);
    }, u("SELECT Results Clause"), function(k, n) {
      return Object.assign({result:n}, k);
    }, u("SELECT Results Modifier"), function(k) {
      return {distinct:!0};
    }, function(k) {
      return {};
    }, u("FROM Clause"), function(k, n) {
      return {from:n};
    }, u("WHERE Clause"), function(k, n) {
      return {where:Q(n)};
    }, u("GROUP BY Clause"), function(k, n, w) {
      return Object.assign({group:n}, w);
    }, u("HAVING Clause"), function(k, n) {
      return {having:n};
    }, function(k, n) {
      return {type:"identifier", variant:"star", name:H([k, n])};
    }, function(k, n) {
      return H([k, n]);
    }, function(k, n) {
      return Object.assign(k, n);
    }, function(k, n) {
      return ob(n) ? {type:"map", variant:"join", source:k, map:n} : k;
    }, function(k, n) {
      return Object.assign(k, n);
    }, u("CROSS JOIN Operation"), function(k) {
      return {type:"join", variant:"cross join", source:k};
    }, u("JOIN Operation"), function(k, n) {
      return {type:"join", variant:P(k), source:n};
    }, function(k, n, w) {
      return Object.assign({type:"function", variant:"table", name:k, args:n}, w);
    }, u("Qualified Table"), function(k, n) {
      return Object.assign(k, n);
    }, u("Qualified Table Identifier"), function(k, n) {
      return Object.assign(k, n);
    }, u("Qualfied Table Index"), function(k, n) {
      return {index:n};
    }, function(k, n) {
      return {index:J([k, n])};
    }, u("SELECT Source"), function(k, n) {
      return Object.assign(k, n);
    }, u("Subquery"), function(k, n) {
      return Object.assign(k, n);
    }, u("Alias"), function(k, n) {
      return {alias:n};
    }, u("JOIN Operator"), function(k, n, w) {
      return J([k, n, w]);
    }, function(k, n) {
      return J([k, n]);
    }, function(k) {
      return P(k);
    }, u("JOIN Constraint"), function(k) {
      return {constraint:Object.assign({type:"constraint", variant:"join"}, k)};
    }, u("Join ON Clause"), function(k, n) {
      return {format:P(k), on:n};
    }, u("Join USING Clause"), function(k, n) {
      return {format:P(k), using:n};
    }, u("VALUES Clause"), function(k, n) {
      return {type:"statement", variant:"select", result:n};
    }, function(k, n) {
      return {result:V([k, n])};
    }, function(k) {
      return k;
    }, u("Ordering Expression"), function(k, n) {
      return null != n ? Object.assign({type:"expression", variant:"order", expression:k}, n) : k;
    }, u("Star"), u("Fallback Type"), u("INSERT Statement"), function(k, n) {
      return Object.assign({type:"statement", variant:"insert"}, k, n);
    }, u("INSERT Keyword"), function(k, n) {
      return Object.assign({action:P(k)}, n);
    }, u("REPLACE Keyword"), function(k) {
      return {action:P(k)};
    }, u("INSERT OR Modifier"), function(k, n) {
      return {or:P(n)};
    }, function(k, n) {
      return Object.assign({into:k}, n);
    }, u("INTO Clause"), function(k, n) {
      return n;
    }, u("INTO Keyword"), function(k) {
      return {result:k};
    }, u("Column List"), function(k, n) {
      return {columns:V([k, n])};
    }, function(k) {
      return k;
    }, u("Column Name"), function(k) {
      return {type:"identifier", variant:"column", name:k};
    }, function(k, n) {
      return n;
    }, u("VALUES Keyword"), function(k, n) {
      return V([k, n]);
    }, u("Wrapped Expression List"), function(k) {
      return k;
    }, u("DEFAULT VALUES Clause"), function(k, n) {
      return {type:"values", variant:"default"};
    }, u("Compound Operator"), u("UNION Operator"), function(k, n) {
      return J([k, n]);
    }, function(k) {
      return k;
    }, u("UPDATE Statement"), function(k, n, w, B, ma, na, wa) {
      return Object.assign({type:"statement", variant:k, into:w}, n, B, ma, na, wa);
    }, u("UPDATE Keyword"), u("UPDATE OR Modifier"), function(k) {
      return {or:P(k)};
    }, u("SET Clause"), function(k) {
      return {set:k};
    }, u("Column Assignment"), function(k, n) {
      return {type:"assignment", target:k, value:n};
    }, u("DELETE Statement"), function(k, n, w, B, ma) {
      return Object.assign({type:"statement", variant:k, from:n}, w, B, ma);
    }, u("DELETE Keyword"), u("CREATE Statement"), u("CREATE TABLE Statement"), function(k, n, w, B) {
      return Object.assign({type:"statement", name:w}, k, B, n);
    }, function(k, n, w) {
      return Object.assign({variant:k, format:P(w)}, n);
    }, function(k) {
      return {temporary:null != k};
    }, u("IF NOT EXISTS Modifier"), function(k, n, w) {
      return {condition:Q({type:"condition", variant:P(k), condition:{type:"expression", variant:P(w), operator:J([n, w])}})};
    }, u("Table Definition"), function(k, n, w) {
      return Object.assign({definition:V([k, n])}, w);
    }, function(k, n) {
      return {optimization:[{type:"optimization", value:J([k, n])}]};
    }, function(k) {
      return k;
    }, u("Column Definition"), function(k, n, w) {
      return Object.assign({type:"definition", variant:"column", name:k, definition:null != w ? w : []}, n);
    }, u("Column Datatype"), function(k) {
      return {datatype:k};
    }, u("Column Constraint"), function(k, n, w) {
      return Object.assign(n, k);
    }, function(k) {
      return k[k.length - 1];
    }, u("CONSTRAINT Name"), function(k) {
      return {name:k};
    }, u("FOREIGN KEY Column Constraint"), function(k) {
      return Object.assign({variant:"foreign key"}, k);
    }, u("PRIMARY KEY Column Constraint"), function(k, n, w, B) {
      return Object.assign(k, w, n, B);
    }, u("PRIMARY KEY Keyword"), function(k, n) {
      return {type:"constraint", variant:J([k, n])};
    }, u("AUTOINCREMENT Keyword"), function(k) {
      return {autoIncrement:!0};
    }, function(k, n) {
      return Object.assign({type:"constraint", variant:k}, n);
    }, u("UNIQUE Column Constraint"), u("NULL Column Constraint"), function(k, n) {
      return J([k, n]);
    }, u("CHECK Column Constraint"), u("DEFAULT Column Constraint"), function(k, n) {
      return {type:"constraint", variant:P(k), value:n};
    }, u("COLLATE Column Constraint"), function(k) {
      return {type:"constraint", variant:"collate", collate:k};
    }, u("Table Constraint"), function(k, n, w) {
      return Object.assign({type:"definition", variant:"constraint"}, n, k);
    }, u("CHECK Table Constraint"), function(k) {
      return {definition:Q(k)};
    }, u("PRIMARY KEY Table Constraint"), function(k, n, w) {
      return {definition:Q(Object.assign(k, w, n[1])), columns:n[0]};
    }, function(k) {
      return {type:"constraint", variant:P(k)};
    }, function(k, n) {
      return J([k, n]);
    }, u("UNIQUE Keyword"), function(k) {
      return P(k);
    }, function(k, n) {
      return [k].concat(n);
    }, function(k) {
      return k.map(function(n) {
        return R(n, 1)[0];
      });
    }, function(k) {
      var n = k.find(function(w) {
        w = R(w, 2);
        return null != (w[0], w[1]);
      });
      return [k.map(function(w) {
        w = R(w, 2);
        var B = w[0];
        w[1];
        return B;
      }), n ? n[1] : null];
    }, u("Indexed Column"), function(k, n, w) {
      var B = k;
      return null != n && (B = Object.assign({type:"expression", variant:"order", expression:k}, n)), [B, w];
    }, u("Collation"), function(k) {
      return {collate:Q(k)};
    }, u("Column Direction"), function(k) {
      return {direction:P(k)};
    }, function(k, n) {
      return {conflict:P(n)};
    }, u("ON CONFLICT Keyword"), function(k, n) {
      return J([k, n]);
    }, function(k, n) {
      return {type:"constraint", variant:P(k), expression:n};
    }, u("FOREIGN KEY Table Constraint"), function(k, n, w) {
      return Object.assign({definition:Q(Object.assign(k, w))}, n);
    }, u("FOREIGN KEY Keyword"), function(k, n) {
      return {type:"constraint", variant:J([k, n])};
    }, function(k, n, w) {
      return Object.assign({type:"constraint"}, k, n, w);
    }, u("REFERENCES Clause"), function(k, n) {
      return {references:n};
    }, function(k, n) {
      return {action:V([k, n])};
    }, u("FOREIGN KEY Action Clause"), function(k, n, w) {
      return {type:"action", variant:P(k), action:P(w)};
    }, u("FOREIGN KEY Action"), function(k, n) {
      return J([k, n]);
    }, function(k) {
      return P(k);
    }, function(k, n) {
      return J([k, n]);
    }, function(k, n) {
      return {type:"action", variant:P(k), action:n};
    }, u("DEFERRABLE Clause"), function(k, n, w) {
      return {defer:J([k, n, w])};
    }, function(k, n) {
      return J([k, n]);
    }, function(k) {
      return {definition:Q(k)};
    }, u("CREATE INDEX Statement"), function(k, n, w, B, ma) {
      return Object.assign({type:"statement", target:w, on:B}, k, n, ma);
    }, function(k, n, w) {
      return Object.assign({variant:P(k), format:P(w)}, n);
    }, function(k) {
      return {unique:!0};
    }, u("ON Clause"), function(k, n, w) {
      return {type:"identifier", variant:"expression", format:"table", name:n.name, columns:w};
    }, u("CREATE TRIGGER Statement"), function(k, n, w, B, ma, na, wa, ia) {
      return Object.assign({type:"statement", target:w, on:ma, event:B, by:null != na ? na : "row", action:Q(ia)}, k, n, wa);
    }, function(k, n, w) {
      return Object.assign({variant:P(k), format:P(w)}, n);
    }, u("Conditional Clause"), function(k, n) {
      return Object.assign({type:"event"}, k, n);
    }, function(k) {
      return {occurs:P(k)};
    }, function(k, n) {
      return J([k, n]);
    }, u("Conditional Action"), function(k) {
      return {event:P(k)};
    }, function(k, n) {
      return {event:P(k), of:n};
    }, function(k, n) {
      return n;
    }, "statement", r("STATEMENT", !0), function(k, n, w) {
      return P(w);
    }, function(k, n) {
      return {when:n};
    }, u("Actions Clause"), function(k, n, w) {
      return n;
    }, function(k) {
      return k;
    }, u("CREATE VIEW Statement"), function(k, n, w, B) {
      return Object.assign({type:"statement", target:w, result:B}, k, n);
    }, function(k, n) {
      return Object.assign({type:"identifier", variant:"expression", format:"view", name:k.name, columns:[]}, n);
    }, function(k, n, w) {
      return Object.assign({variant:P(k), format:P(w)}, n);
    }, u("CREATE VIRTUAL TABLE Statement"), function(k, n, w, B) {
      return Object.assign({type:"statement", target:w, result:B}, k, n);
    }, function(k, n, w) {
      return {variant:P(k), format:P(n)};
    }, function(k, n) {
      return Object.assign({type:"module", variant:"virtual", name:k}, n);
    }, u("Module Arguments"), function(k) {
      return {args:{type:"expression", variant:"list", expression:null != k ? k : []}};
    }, function(k, n) {
      return V([k, n]).filter(function(w) {
        return null != w;
      });
    }, function(k) {
      return k;
    }, u("DROP Statement"), function(k, n) {
      return Object.assign({type:"statement", target:Object.assign(n, {variant:k.format})}, k);
    }, u("DROP Keyword"), function(k, n, w) {
      return Object.assign({variant:P(k), format:n, condition:[]}, w);
    }, u("DROP Type"), u("IF EXISTS Keyword"), function(k, n) {
      return {condition:[{type:"condition", variant:P(k), condition:{type:"expression", variant:P(n), operator:P(n)}}]};
    }, u("Or"), u("Add"), u("Subtract"), u("Multiply"), u("Divide"), u("Modulo"), u("Shift Left"), u("Shift Right"), u("Logical AND"), u("Logical OR"), u("Less Than"), u("Greater Than"), u("Less Than Or Equal"), u("Greater Than Or Equal"), u("Equal"), u("Not Equal"), u("IS"), function(k, n) {
      return J([k, n]);
    }, u("Identifier"), u("Database Identifier"), function(k) {
      return {type:"identifier", variant:"database", name:k};
    }, u("Function Identifier"), function(k, n) {
      return {type:"identifier", variant:"function", name:H([k, n])};
    }, u("Table Identifier"), function(k, n) {
      return {type:"identifier", variant:"table", name:H([k, n])};
    }, function(k, n) {
      return H([k, n]);
    }, u("Column Identifier"), function(k, n) {
      return {type:"identifier", variant:"column", name:H([k, n])};
    }, function() {
      return "";
    }, function(k, n) {
      return H([k, n]);
    }, u("Collation Identifier"), function(k) {
      return {type:"identifier", variant:"collation", name:k};
    }, u("Savepoint Identifier"), function(k) {
      return {type:"identifier", variant:"savepoint", name:k};
    }, u("Index Identifier"), function(k, n) {
      return {type:"identifier", variant:"index", name:H([k, n])};
    }, u("Trigger Identifier"), function(k, n) {
      return {type:"identifier", variant:"trigger", name:H([k, n])};
    }, u("View Identifier"), function(k, n) {
      return {type:"identifier", variant:"view", name:H([k, n])};
    }, u("Pragma Identifier"), function(k, n) {
      return {type:"identifier", variant:"pragma", name:H([k, n])};
    }, u("CTE Identifier"), function(k) {
      return k;
    }, function(k, n) {
      return Object.assign({type:"identifier", variant:"expression", format:"table", name:k.name, columns:[]}, n);
    }, u("Table Constraint Identifier"), function(k) {
      return {type:"identifier", variant:"constraint", format:"table", name:k};
    }, u("Column Constraint Identifier"), function(k) {
      return {type:"identifier", variant:"constraint", format:"column", name:k};
    }, u("Datatype Name"), function(k) {
      return [k, "text"];
    }, function(k) {
      return [k, "real"];
    }, function(k) {
      return [k, "numeric"];
    }, function(k) {
      return [k, "integer"];
    }, function(k) {
      return [k, "none"];
    }, u("TEXT Datatype Name"), "n", r("N", !0), "var", r("VAR", !0), "char", r("CHAR", !0), "tiny", r("TINY", !0), "medium", r("MEDIUM", !0), "long", r("LONG", !0), "text", r("TEXT", !0), "clob", r("CLOB", !0), u("REAL Datatype Name"), "float", r("FLOAT", !0), "real", r("REAL", !0), u("DOUBLE Datatype Name"), "double", r("DOUBLE", !0), "precision", r("PRECISION", !0), function(k, n) {
      return H([k, n]);
    }, u("NUMERIC Datatype Name"), "numeric", r("NUMERIC", !0), "decimal", r("DECIMAL", !0), "boolean", r("BOOLEAN", !0), "date", r("DATE", !0), "time", r("TIME", !0), "stamp", r("STAMP", !0), "string", r("STRING", !0), u("INTEGER Datatype Name"), "int", r("INT", !0), "2", r("2", !1), "4", r("4", !1), "8", r("8", !1), "eger", r("EGER", !0), "big", r("BIG", !0), "small", r("SMALL", !0), "floating", r("FLOATING", !0), "point", r("POINT", !0), function(k, n) {
      return H([k, n]);
    }, u("BLOB Datatype Name"), "blob", r("BLOB", !0), /^[a-z0-9$_]/i, E([["a", "z"], ["0", "9"], "$", "_"], !1, !0), "\\u", r("\\u", !1), /^[a-f0-9]/i, E([["a", "f"], ["0", "9"]], !1, !0), function(k, n) {
      return H([k, n]).toLowerCase();
    }, function(k) {
      return P(k);
    }, {type:"any"}, function(k) {
      return ha(k).trim();
    }, /^[ \t]/, E([" ", "\t"], !1, !1), '"', r('"', !1), '""', r('""', !1), /^[^"]/, E(['"'], !0, !1), function(k) {
      return ra(k, '"');
    }, "'", r("'", !1), function(k) {
      return ra(k, "'");
    }, "`", r("`", !1), "``", r("``", !1), /^[^`]/, E(["`"], !0, !1), function(k) {
      return ra(k, "`");
    }, u("Open Bracket"), "[", r("[", !1), u("Close Bracket"), "]", r("]", !1), u("Open Parenthesis"), "(", r("(", !1), u("Close Parenthesis"), ")", r(")", !1), u("Comma"), ",", r(",", !1), u("Period"), ".", r(".", !1), u("Asterisk"), "*", r("*", !1), u("Question Mark"), "?", r("?", !1), u("Single Quote"), u("Double Quote"), u("Backtick"), u("Tilde"), "~", r("~", !1), u("Plus"), "+", r("+", !1), u("Minus"), "-", r("-", !1), "=", r("=", !1), u("Ampersand"), "&", r("&", !1), u("Pipe"), "|", r("|", 
    !1), "%", r("%", !1), "<", r("<", !1), ">", r(">", !1), u("Exclamation"), "!", r("!", !1), u("Semicolon"), ";", r(";", !1), u("Colon"), u("Forward Slash"), "/", r("/", !1), u("Backslash"), "\\", r("\\", !1), "abort", r("ABORT", !0), "action", r("ACTION", !0), "add", r("ADD", !0), "after", r("AFTER", !0), "all", r("ALL", !0), "alter", r("ALTER", !0), "analyze", r("ANALYZE", !0), "and", r("AND", !0), "as", r("AS", !0), "asc", r("ASC", !0), "attach", r("ATTACH", !0), "autoincrement", r("AUTOINCREMENT", 
    !0), "before", r("BEFORE", !0), "begin", r("BEGIN", !0), "between", r("BETWEEN", !0), "by", r("BY", !0), "cascade", r("CASCADE", !0), "case", r("CASE", !0), "cast", r("CAST", !0), "check", r("CHECK", !0), "collate", r("COLLATE", !0), "column", r("COLUMN", !0), "commit", r("COMMIT", !0), "conflict", r("CONFLICT", !0), "constraint", r("CONSTRAINT", !0), "create", r("CREATE", !0), "cross", r("CROSS", !0), "current_date", r("CURRENT_DATE", !0), "current_time", r("CURRENT_TIME", !0), "current_timestamp", 
    r("CURRENT_TIMESTAMP", !0), "database", r("DATABASE", !0), "default", r("DEFAULT", !0), "deferrable", r("DEFERRABLE", !0), "deferred", r("DEFERRED", !0), "delete", r("DELETE", !0), "desc", r("DESC", !0), "detach", r("DETACH", !0), "distinct", r("DISTINCT", !0), "drop", r("DROP", !0), "each", r("EACH", !0), "else", r("ELSE", !0), "end", r("END", !0), "escape", r("ESCAPE", !0), "except", r("EXCEPT", !0), "exclusive", r("EXCLUSIVE", !0), "exists", r("EXISTS", !0), "explain", r("EXPLAIN", !0), "fail", 
    r("FAIL", !0), "for", r("FOR", !0), "foreign", r("FOREIGN", !0), "from", r("FROM", !0), "full", r("FULL", !0), "glob", r("GLOB", !0), "group", r("GROUP", !0), "having", r("HAVING", !0), "if", r("IF", !0), "ignore", r("IGNORE", !0), "immediate", r("IMMEDIATE", !0), "in", r("IN", !0), "index", r("INDEX", !0), "indexed", r("INDEXED", !0), "initially", r("INITIALLY", !0), "inner", r("INNER", !0), "insert", r("INSERT", !0), "instead", r("INSTEAD", !0), "intersect", r("INTERSECT", !0), "into", r("INTO", 
    !0), "is", r("IS", !0), "isnull", r("ISNULL", !0), "join", r("JOIN", !0), "key", r("KEY", !0), "left", r("LEFT", !0), "like", r("LIKE", !0), "limit", r("LIMIT", !0), "match", r("MATCH", !0), "natural", r("NATURAL", !0), "no", r("NO", !0), "not", r("NOT", !0), "notnull", r("NOTNULL", !0), "of", r("OF", !0), "offset", r("OFFSET", !0), "on", r("ON", !0), "or", r("OR", !0), "order", r("ORDER", !0), "outer", r("OUTER", !0), "plan", r("PLAN", !0), "pragma", r("PRAGMA", !0), "primary", r("PRIMARY", 
    !0), "query", r("QUERY", !0), "raise", r("RAISE", !0), "recursive", r("RECURSIVE", !0), "references", r("REFERENCES", !0), "regexp", r("REGEXP", !0), "reindex", r("REINDEX", !0), "release", r("RELEASE", !0), "rename", r("RENAME", !0), "replace", r("REPLACE", !0), "restrict", r("RESTRICT", !0), "right", r("RIGHT", !0), "rollback", r("ROLLBACK", !0), "row", r("ROW", !0), "rowid", r("ROWID", !0), "savepoint", r("SAVEPOINT", !0), "select", r("SELECT", !0), "set", r("SET", !0), "table", r("TABLE", 
    !0), "temp", r("TEMP", !0), "temporary", r("TEMPORARY", !0), "then", r("THEN", !0), "to", r("TO", !0), "transaction", r("TRANSACTION", !0), "trigger", r("TRIGGER", !0), "union", r("UNION", !0), "unique", r("UNIQUE", !0), "update", r("UPDATE", !0), "using", r("USING", !0), "vacuum", r("VACUUM", !0), "values", r("VALUES", !0), "view", r("VIEW", !0), "virtual", r("VIRTUAL", !0), "when", r("WHEN", !0), "where", r("WHERE", !0), "with", r("WITH", !0), "without", r("WITHOUT", !0), function(k) {
      return P(k);
    }, function() {
      return null;
    }, u("Line Comment"), "--", r("--", !1), /^[\n\v\f\r]/, E(["\n", "\v", "\f", "\r"], !1, !1), u("Block Comment"), "/*", r("/*", !1), "*/", r("*/", !1), /^[\n\v\f\r\t ]/, E("\n\v\f\r\t ".split(""), !1, !1), u("Whitespace"), "__TODO__", r("__TODO__", !1)], Mb = [f("%;\u023f/H#;#/?$;\".\" &\"/1$;#/($8$: $!!)($'#(#'#(\"'#&'#"), f("%;\u023f/C#;#/:$;x/1$;#/($8$: $!!)($'#(#'#(\"'#&'#"), f("%;x/B#;\u023f/9$$;%0#*;%&/)$8#:!#\"\" )(#'#(\"'#&'#"), f("$;\u01b30#*;\u01b3&"), f("$;\u01b3/&#0#*;\u01b3&&&#"), 
    f("%;$/:#;x/1$;\u023f/($8#:\"#!!)(#'#(\"'#&'#"), f('<%;\'.# &;(/@#;\u023f/7$;*." &"/)$8#:$#"" )(#\'#("\'#&\'#=." 7#'), f("%;\u018b/' 8!:%!! )"), f('<%;\u0195/9#$;)0#*;)&/)$8":\'""! )("\'#&\'#=." 7&'), f('%4(""5!7)/1#;\u0197/($8":*"! )("\'#&\'#'), f("<%;\u01a0/R#;5/I$;\u023f/@$;+.\" &\"/2$;\u01a1/)$8%:,%\"#!)(%'#($'#(#'#(\"'#&'#=.\" 7+"), f("%;\u01a2/C#;\u023f/:$;5/1$;\u023f/($8$:-$!!)($'#(#'#(\"'#&'#"), f(";5.; &;6.5 &;2./ &;-.) &;..# &;/"), f('<%;\u0206/1#;\u023f/($8":/"!!)("\'#&\'#=." 7.'), 
    f('<%;\u01d2.) &;\u01d4.# &;\u01d3/1#;\u023f/($8":1"!!)("\'#&\'#=." 70'), f('<%;4." &"/2#;0/)$8":3""! )("\'#&\'#=." 72'), f("<%;\u01a6/A#$;10#*;1&/1$;\u01a6/($8#:5#!!)(#'#(\"'#&'#=.\" 74"), f('26""6677.) &48""5!79'), f('<%4;""5!7</1#;0/($8":="! )("\'#&\'#=." 7:'), f("%;\u0197.# &;\u019b/' 8!:>!! )"), f('<%;\u01aa.# &;\u01ab/\' 8!:"!! )=." 7?'), f('%;4." &"/2#;6/)$8":@""! )("\'#&\'#'), f(";<.# &;7"), f('%;8/7#;;." &"/)$8":A""! )("\'#&\'#'), f('<;9.# &;:=." 7B'), f('%$;>/&#0#*;>&&&#/7#;:." &"/)$8":C""! )("\'#&\'#'), 
    f('%;\u01a3/9#$;>0#*;>&/)$8":D""! )("\'#&\'#'), f('<%3F""5!7G/T#4H""5!7I." &"/@$$;>/&#0#*;>&&&#/*$8#:J##"! )(#\'#("\'#&\'#=." 7E'), f('<%3L""5"7M/?#$;=/&#0#*;=&&&#/)$8":N""! )("\'#&\'#=." 7K'), f('4O""5!7P'), f('4Q""5!7R'), f("<%;@.) &;B.# &;C/' 8!:T!! )=.\" 7S"), f('<%;\u01a5/@#;A." &"/2$;\u023f/)$8#:V#""!)(#\'#("\'#&\'#=." 7U'), f('%4W""5!7X/9#$;>0#*;>&/)$8":Y""! )("\'#&\'#'), f('<%4[""5!7\\/H#$;\u0193/&#0#*;\u0193&&&#/2$;\u023f/)$8#:]#""!)(#\'#("\'#&\'#=." 7Z'), f('<%2_""6_7`/o#$;\u0193.) &2a""6a7b/2#0/*;\u0193.) &2a""6a7b&&&#/A$;\u023f/8$;D." &"/*$8$:c$##" )($\'#(#\'#("\'#&\'#=." 7^'), 
    f('%;\u019b/1#;\u023f/($8":d"!!)("\'#&\'#'), f('<%;F." &"/;#;\u023f/2$;\u0094/)$8#:f#"" )(#\'#("\'#&\'#=." 7e'), f('<%;k." &"/;#;\u01e4/2$;\u023f/)$8#:h#""!)(#\'#("\'#&\'#=." 7g'), f("<%;\u0211/_#;\u023f/V$;\u01a0/M$;\u023f/D$;H/;$;\u023f/2$;\u01a1/)$8':j'\"&\")(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7i"), f("<%;I.# &;J/' 8!:l!! )=.\" 7k"), f("<%;\u01ef/' 8!:n!! )=.\" 7m"), f("%;\u021b.) &;\u01b7.# &;\u01e6/M#;\u023f/D$;\u01a2/;$;\u023f/2$;w/)$8%:o%\"$ )(%'#($'#(#'#(\"'#&'#"), f(";?./ &;t.) &;,.# &;\u017d"), 
    f("%;\u01a0/L#;\u023f/C$;o/:$;\u023f/1$;\u01a1/($8%:p%!\")(%'#($'#(#'#(\"'#&'#"), f(";L.; &;E.5 &;_./ &;a.) &;G.# &;K"), f("%;M/;#;\u023f/2$;Q/)$8#:q#\"\" )(#'#(\"'#&'#.# &;M"), f("%;P/A#;\u023f/8$;N.# &;o/)$8#:r#\"\" )(#'#(\"'#&'#.# &;N"), f(";\u01a9.U &;\u01ab.O &;\u01aa.I &%%;k/8#%<;\u01e4=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"), f("<%;\u012d/' 8!:t!! )=.\" 7s"), f("%;O/\u0083#$%;\u023f/>#;\u0166/5$;\u023f/,$;O/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;\u0166/5$;\u023f/,$;O/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"), 
    f("%;R/\u0083#$%;\u023f/>#;T/5$;\u023f/,$;R/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;T/5$;\u023f/,$;R/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"), f(";\u0169.) &;\u016a.# &;\u016b"), f("%;S/\u0083#$%;\u023f/>#;V/5$;\u023f/,$;S/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;V/5$;\u023f/,$;S/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"), f(";\u0167.# &;\u0168"), f("%;U/\u0083#$%;\u023f/>#;X/5$;\u023f/,$;U/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;X/5$;\u023f/,$;U/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"), 
    f(";\u016c.U &;\u016d.O &;\u016e.I &%%;\u016f/8#%<;\u016f=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"), f("%;W/\u0083#$%;\u023f/>#;Z/5$;\u023f/,$;W/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;Z/5$;\u023f/,$;W/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"), f(";\u0172.{ &;\u0173.u &%%;\u0170/8#%<;X=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).I &%%;\u0171/8#%<;X=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"), f('%;Y/9#$;\\0#*;\\&/)$8":u""! )("\'#&\'#'), f("%;\u023f/1#;]/($8\":v\"! )(\"'#&'#.H &%;\u023f/>#;^/5$;\u023f/,$;Y/#$+$)($'#(#'#(\"'#&'#"), 
    f('%3w""5$7x/?#;\u023f/6$3y""5$7z/\'$8#:{# )(#\'#("\'#&\'#.? &%;\u01fb/& 8!:|! ).. &%;\u0205/& 8!:{! )'), f(";\u0177./ &;\u0175.) &;\u0176.# &;\u0174"), f("<%;\u01c9/i#;\u023f/`$;\u01a0/W$;o/N$;\u023f/E$;`/<$;\u023f/3$;\u01a1/*$8(:~(#'$\")(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7}"), f("<%;\u01bf/:#;\u023f/1$;&/($8#:\u0080#! )(#'#(\"'#&'#=.\" 7\u007f"), f("<%;\u01c8/\u0093#;\u023f/\u008a$;b.\" &\"/|$;\u023f/s$$;c/&#0#*;c&&&#/]$;\u023f/T$;d.\" &\"/F$;\u023f/=$;\u01e0/4$;\u023f/+$8*:\u0082*$)'%#)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0081"), 
    f("%%<;\u0230=.##&&!&'#/1#;o/($8\":\u0083\"! )(\"'#&'#"), f("<%;\u0230/i#;\u023f/`$;o/W$;\u023f/N$;\u0224/E$;\u023f/<$;o/3$;\u023f/*$8(:\u0085(#'%!)(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0084"), f("<%;\u01df/D#;\u023f/;$;o/2$;\u023f/)$8$:\u0087$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0086"), f("%;[/;#;\u023f/2$;f/)$8#:\u0088#\"\" )(#'#(\"'#&'#.# &;["), f(";l.) &;i.# &;g"), f('<%;k." &"/o#;\u01ff./ &;\u01eb.) &;\u0214.# &;\u0201/T$;\u023f/K$;o/B$;\u023f/9$;h." &"/+$8&:\u008a&$%$" )(&\'#(%\'#($\'#(#\'#("\'#&\'#=." 7\u0089'), 
    f("<%;\u01e1/D#;\u023f/;$;o/2$;\u023f/)$8$:\u008c$\"#!)($'#(#'#(\"'#&'#=.\" 7\u008b"), f('<%;k." &"/E#;\u01c5/<$;\u023f/3$;j/*$8$:\u008e$##" )($\'#(#\'#("\'#&\'#=." 7\u008d'), f("%;e/W#%;\u023f/>#;\u01be/5$;\u023f/,$;e/#$+$)($'#(#'#(\"'#&'#/)$8\":\u008f\"\"! )(\"'#&'#"), f('%;\u0204/1#;\u023f/($8":\u0090"!!)("\'#&\'#'), f('<%;k." &"/E#;\u01f1/<$;\u023f/3$;m/*$8$:\u0092$##" )($\'#(#\'#("\'#&\'#=." 7\u0091'), f(";n.# &;\u017b"), f("%;\u01a0/I#;\u0095.# &;q/:$;\u023f/1$;\u01a1/($8$:\u0093$!\")($'#(#'#(\"'#&'#"), 
    f("%;e/\u0083#$%;\u023f/>#;p/5$;\u023f/,$;e/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;p/5$;\u023f/,$;e/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"), f(";\u01be.# &;\u020a"), f('<%;r." &"/1#;\u023f/($8":\u0095"!!)("\'#&\'#=." 7\u0094'), f("%;o/B#;\u023f/9$$;s0#*;s&/)$8#:\u0096#\"\" )(#'#(\"'#&'#"), f("%;\u01a2/:#;o/1$;\u023f/($8#:\u0093#!!)(#'#(\"'#&'#"), f("<%;\u017a/[#;\u023f/R$;\u01a0/I$;u.\" &\"/;$;\u023f/2$;\u01a1/)$8&:\u0098&\"%\")(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0097"), f('<%;\u00db/\' 8!:\u009a!! ).V &%;v." &"/G#;q/>$9:\u009b "! -""&!&#/)$8#:\u009c#""!)(#\'#("\'#&\'#=." 7\u0099'), 
    f('%;\u01dc.# &;\u01bb/1#;\u023f/($8":\u009d"!!)("\'#&\'#'), f("<%;//' 8!:\u009f!! )=.\" 7\u009e"), f('<%;y." &"/;#;{/2$;\u023f/)$8#:\u00a1#""!)(#\'#("\'#&\'#=." 7\u00a0'), f('<%;\u01e5/@#;\u023f/7$;z." &"/)$8#:\u00a3#"" )(#\'#("\'#&\'#=." 7\u00a2'), f("<%;\u0210/D#;\u023f/;$;\u020d/2$;\u023f/)$8$:\u00a5$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00a4"), f(";\u008c.S &;\u00fb.M &;\u0162.G &;}.A &;|.; &;\u0086.5 &;\u0080./ &;\u0084.) &;\u0085.# &;\u0096"), f('<%;\u01cd.# &;\u01e0/@#;\u023f/7$;~." &"/)$8#:\u00a7#"" )(#\'#("\'#&\'#=." 7\u00a6'), 
    f('<%;\u01c4/^#;\u023f/U$;\u007f." &"/G$;~." &"/9$;\u0082." &"/+$8%:\u00a9%$$"! )(%\'#($\'#(#\'#("\'#&\'#=." 7\u00a8'), f('%;\u0226/1#;\u023f/($8":\u00aa"!!)("\'#&\'#'), f('%;\u01d8.) &;\u01f0.# &;\u01e3/1#;\u023f/($8":\u00ab"!!)("\'#&\'#'), f('<%;\u021b/N#;\u023f/E$;~." &"/7$;\u0081." &"/)$8$:\u00ad$"# )($\'#(#\'#("\'#&\'#=." 7\u00ac'), f('<%%;\u0225/,#;\u023f/#$+")("\'#&\'#." &"/?#;\u0083." &"/1$;\u0082/($8#:p#! )(#\'#("\'#&\'#=." 7\u00ae'), f('%;\u0182/1#;\u023f/($8":\u00af"!!)("\'#&\'#'), 
    f('%;\u021e/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'), f('<%;\u0083/2#;\u0082/)$8":\u00b2""! )("\'#&\'#=." 7\u00b1'), f("<%;\u0216/J#;\u023f/A$;\u0083.\" &\"/3$;\u0082/*$8$:\u00b4$##! )($'#(#'#(\"'#&'#=.\" 7\u00b3"), f("<%;\u0087/N#;\u017b/E$;\u023f/<$;\u0088/3$;\u023f/*$8%:\u00b6%#$#!)(%'#($'#(#'#(\"'#&'#=.\" 7\u00b5"), f("<%;\u01bc/D#;\u023f/;$;\u0221/2$;\u023f/)$8$:\u00b8$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00b7"), f(";\u0089.# &;\u008a"), f("<%;\u0217/M#;\u023f/D$;\u0225/;$;\u023f/2$;\u017b/)$8%:\u00ba%\"$ )(%'#($'#(#'#(\"'#&'#=.\" 7\u00b9"), 
    f('<%;\u01b9/I#;\u023f/@$;\u008b." &"/2$;\u010c/)$8$:\u00bc$"# )($\'#(#\'#("\'#&\'#=." 7\u00bb'), f('%;\u01cc/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'), f('%;\u008d/2#;\u00a7/)$8":\u00bd""! )("\'#&\'#'), f('<%;\u008e." &"/1#;\u023f/($8":*"!!)("\'#&\'#=." 7\u00be'), f("%;\u0232/J#;\u023f/A$;\u008f.\" &\"/3$;\u0090/*$8$:\u00bf$##! )($'#(#'#(\"'#&'#"), f('%;\u0212/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'), f("%;\u0092/B#;\u023f/9$$;\u00910#*;\u0091&/)$8#:\u00c0#\"\" )(#'#(\"'#&'#"), f("%;\u01a2/:#;\u0092/1$;\u023f/($8#:\u0093#!!)(#'#(\"'#&'#"), 
    f('<%;\u0187/2#;\u0093/)$8":\u00c2""! )("\'#&\'#=." 7\u00c1'), f("%;\u01bf/:#;\u023f/1$;\u0094/($8#:\u00c3#! )(#'#(\"'#&'#"), f("%;\u01a0/C#;\u0095/:$;\u023f/1$;\u01a1/($8$: $!\")($'#(#'#(\"'#&'#"), f('%;\u008d/2#;\u00a8/)$8":\u00c4""! )("\'#&\'#'), f(";\u0097.; &;\u0099.5 &;\u009a./ &;\u009c.) &;\u009e.# &;\u00a0"), f("<%;\u01c1/\u008b#;\u023f/\u0082$%;\u01d5/,#;\u023f/#$+\")(\"'#&'#.\" &\"/a$;o/X$;\u023f/O$;\u01bf/F$;\u023f/=$;\u0098/4$;\u023f/+$8):\u00c6)$(&%!)()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u00c5"), 
    f(";\u0179.) &;-.# &;?"), f("<%;\u01db/f#;\u023f/]$%;\u01d5/,#;\u023f/#$+\")(\"'#&'#.\" &\"/<$;\u0098/3$;\u023f/*$8%:\u00c8%#$\"!)(%'#($'#(#'#(\"'#&'#=.\" 7\u00c7"), f('<%;\u022c/@#;\u023f/7$;\u009b." &"/)$8#:\u00ca#"" )(#\'#("\'#&\'#=." 7\u00c9'), f('%;\u0179/1#;\u023f/($8":\u00cb"!!)("\'#&\'#'), f('<%;\u01bd/@#;\u023f/7$;\u009d." &"/)$8#:\u00cd#"" )(#\'#("\'#&\'#=." 7\u00cc'), f('%;\u017b.) &;\u0183.# &;\u0179/1#;\u023f/($8":\u00ce"!!)("\'#&\'#'), f('<%;\u0215/I#;\u023f/@$;\u009f." &"/2$;\u023f/)$8$:\u00cd$"#!)($\'#(#\'#("\'#&\'#=." 7\u00cf'), 
    f('%;\u017b.) &;\u0183.# &;\u0181/1#;\u023f/($8":\u00d0"!!)("\'#&\'#'), f("<%;\u020e/S#;\u023f/J$;\u0186/A$;\u023f/8$;\u00a1.\" &\"/*$8%:\u00d2%#$\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u00d1"), f("%;\u01a0/C#;\u00a2/:$;\u023f/1$;\u01a1/($8$:\u00d3$!\")($'#(#'#(\"'#&'#.D &%;\u01ac/:#;\u00a2/1$;\u023f/($8#:\u00d3#!!)(#'#(\"'#&'#"), f(";\u00a4.) &;\u00a3.# &;\u00a6"), f(";5.) &;/.# &;3"), f('%;\u00a5/<#9:\u00d4 ! -""&!&#/($8":\u00d5"!!)("\'#&\'#'), f("%$;\u0193/&#0#*;\u0193&&&#/' 8!:\u00d6!! )"), f("%;\u00a5/' 8!:\u00d7!! )"), 
    f(";\u00a8./ &;\u00dd.) &;\u00f2.# &;\u00f9"), f('<%;\u00ae/X#;\u023f/O$;\u00a9." &"/A$;\u023f/8$;\u00aa." &"/*$8%:\u00d9%#$" )(%\'#($\'#(#\'#("\'#&\'#=." 7\u00d8'), f("<%;\u020b/L#;\u023f/C$;\u01c6/:$;\u023f/1$;\u00d8/($8%:\u00db%! )(%'#($'#(#'#(\"'#&'#=.\" 7\u00da"), f("<%;\u0200/S#;\u023f/J$;o/A$;\u023f/8$;\u00ab.\" &\"/*$8%:\u00dd%#$\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u00dc"), f('<%;\u00ac/2#;o/)$8":\u00df""! )("\'#&\'#=." 7\u00de'), f(";\u00ad.# &;\u01a2"), f('%;\u0208/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'), 
    f("%;\u00b0/B#;\u023f/9$$;\u00af0#*;\u00af&/)$8#:\u00e0#\"\" )(#'#(\"'#&'#"), f("<%;\u00ef/D#;\u023f/;$;\u00b0/2$;\u023f/)$8$:\u00e2$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00e1"), f(";\u00b1.# &;\u00d7"), f('%;\u00b2/U#;\u00b8." &"/G$;\u00b9." &"/9$;\u00ba." &"/+$8$:\u00e3$$#"! )($\'#(#\'#("\'#&\'#'), f('<%;\u021f/R#;\u023f/I$;\u00b3." &"/;$;\u023f/2$;\u00b6/)$8%:\u00e5%"" )(%\'#($\'#(#\'#("\'#&\'#=." 7\u00e4'), f('<;\u00b4.# &;\u00b5=." 7\u00e6'), f('%;\u01dc/1#;\u023f/($8":\u00e7"!!)("\'#&\'#'), f('%;\u01bb/1#;\u023f/($8":\u00e8"!!)("\'#&\'#'), 
    f("%;\u00bc/B#;\u023f/9$$;\u00b70#*;\u00b7&/)$8#:\u00c0#\"\" )(#'#(\"'#&'#"), f("%;\u01a2/:#;\u00bc/1$;\u023f/($8#:-#!!)(#'#(\"'#&'#"), f("<%;\u01e9/D#;\u023f/;$;\u00c0/2$;\u023f/)$8$:\u00ea$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00e9"), f("<%;\u0231/D#;\u023f/;$;o/2$;\u023f/)$8$:\u00ec$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00eb"), f("<%;\u01ec/e#;\u023f/\\$;\u01c6/S$;\u023f/J$;q/A$;\u023f/8$;\u00bb.\" &\"/*$8':\u00ee'#&\" )(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u00ed"), f("<%;\u01ed/D#;\u023f/;$;o/2$;\u023f/)$8$:\u00f0$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00ef"), 
    f(";\u00bd.# &;\u00bf"), f('%;\u00be." &"/2#;\u00db/)$8":\u00f1""! )("\'#&\'#'), f('%;\u0195/2#;\u01a3/)$8":\u00f2""! )("\'#&\'#'), f('%;o/@#;\u023f/7$;\u00cd." &"/)$8#:\u00f3#"" )(#\'#("\'#&\'#'), f("%;\u00c4/B#;\u023f/9$$;\u00c10#*;\u00c1&/)$8#:\u00f4#\"\" )(#'#(\"'#&'#"), f('%;\u00c2.# &;\u00c3/7#;\u00d4." &"/)$8":\u00f5""! )("\'#&\'#'), f("<%;\u01a2/:#;\u00c4/1$;\u023f/($8#:\u00f7#!!)(#'#(\"'#&'#=.\" 7\u00f6"), f("<%;\u00ce/D#;\u023f/;$;\u00c4/2$;\u023f/)$8$:\u00f9$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00f8"), 
    f(";\u00cb.5 &;?./ &;\u00c5.) &;\u00c6.# &;\u00cc"), f("%;\u017a/S#;\u023f/J$;\u00ed/A$;\u023f/8$;\u00cd.\" &\"/*$8%:\u00fa%#$\" )(%'#($'#(#'#(\"'#&'#"), f('<%;\u00c7/@#;\u023f/7$;\u00c8." &"/)$8#:\u00fc#"" )(#\'#("\'#&\'#=." 7\u00fb'), f('<%;\u017b/@#;\u023f/7$;\u00cd." &"/)$8#:\u00fe#"" )(#\'#("\'#&\'#=." 7\u00fd'), f('<;\u00c9.# &;\u00ca=." 7\u00ff'), f("%;\u01f3/V#;\u023f/M$;\u01c6/D$;\u023f/;$;\u0183/2$;\u023f/)$8&:\u0100&\"%!)(&'#(%'#($'#(#'#(\"'#&'#"), f("%;k/;#;\u01f3/2$;\u023f/)$8#:\u0101#\"\"!)(#'#(\"'#&'#"), 
    f("<%;\u01a0/R#;\u00c0/I$;\u023f/@$;\u01a1/7$;\u00cd.\" &\"/)$8%:\u0103%\"# )(%'#($'#(#'#(\"'#&'#=.\" 7\u0102"), f('<%;\u0094/7#;\u00cd." &"/)$8":\u0105""! )("\'#&\'#=." 7\u0104'), f('<%%;\u01bf/Q#%%<;\u0193.# &;\u0236=.##&&!&\'#/,#;\u023f/#$+")("\'#&\'#/#$+")("\'#&\'#." &"/;#;\u0195/2$;\u023f/)$8#:\u0107#""!)(#\'#("\'#&\'#=." 7\u0106'), f('<%;\u00cf." &"/J#;\u023f/A$;\u00d0." &"/3$;\u01fc/*$8$:\u0109$##! )($\'#(#\'#("\'#&\'#=." 7\u0108'), f('%;\u0202/1#;\u023f/($8":\u0090"!!)("\'#&\'#'), f(";\u00d1.# &;\u00d3"), 
    f('%;\u01fe.) &;\u021a.# &;\u01ea/@#;\u023f/7$;\u00d2." &"/)$8#:\u010a#"" )(#\'#("\'#&\'#'), f('%;\u020c/1#;\u023f/($8":\u010b"!!)("\'#&\'#'), f('%;\u01f5.# &;\u01d1/1#;\u023f/($8":\u010b"!!)("\'#&\'#'), f('<%;\u00d5.# &;\u00d6/1#;\u023f/($8":\u010d"!!)("\'#&\'#=." 7\u010c'), f('<%;\u0209/;#;\u023f/2$;o/)$8#:\u010f#"" )(#\'#("\'#&\'#=." 7\u010e'), f('<%;\u022b/;#;\u023f/2$;\u00e6/)$8#:\u0111#"" )(#\'#("\'#&\'#=." 7\u0110'), f('<%;\u022d/;#;\u023f/2$;\u00eb/)$8#:\u0113#"" )(#\'#("\'#&\'#=." 7\u0112'), 
    f("%;\u00da/B#;\u023f/9$$;\u00d90#*;\u00d9&/)$8#:\u0114#\"\" )(#'#(\"'#&'#"), f("%;\u01a2/:#;\u00da/1$;\u023f/($8#:\u0115#!!)(#'#(\"'#&'#"), f('<%;o/@#;\u023f/7$;\u012f." &"/)$8#:\u0117#"" )(#\'#("\'#&\'#=." 7\u0116'), f('<;\u01a4=." 7\u0118'), f('<;\u0218.5 &;\u021b./ &;\u01b7.) &;\u01e6.# &;\u01ef=." 7\u0119'), f('<%;\u00de/;#;\u023f/2$;\u00e2/)$8#:\u011b#"" )(#\'#("\'#&\'#=." 7\u011a'), f(";\u00df.# &;\u00e0"), f('<%;\u01f6/@#;\u023f/7$;\u00e1." &"/)$8#:\u011d#"" )(#\'#("\'#&\'#=." 7\u011c'), 
    f('<%;\u0218/1#;\u023f/($8":\u011f"!!)("\'#&\'#=." 7\u011e'), f('<%;\u020a/;#;\u023f/2$;\u00dc/)$8#:\u0121#"" )(#\'#("\'#&\'#=." 7\u0120'), f('%;\u00e3/2#;\u00e5/)$8":\u0122""! )("\'#&\'#'), f('<%;\u00e4/2#;\u0187/)$8":\u0124""! )("\'#&\'#=." 7\u0123'), f('<%;\u01f9/,#;\u023f/#$+")("\'#&\'#=." 7\u0125'), f('<%;\u00e9.) &;\u0095.# &;\u00ee/1#;\u023f/($8":\u0126"!!)("\'#&\'#=." 7\u0112'), f("<%;\u01a0/T#;\u00e8/K$;\u023f/B$$;\u00e70#*;\u00e7&/2$;\u01a1/)$8%:\u0128%\"#!)(%'#($'#(#'#(\"'#&'#=.\" 7\u0127"), 
    f("%;\u01a2/:#;\u00e8/1$;\u023f/($8#:\u0129#!!)(#'#(\"'#&'#"), f("<%;\u0178/' 8!:\u012b!! )=.\" 7\u012a"), f('<%;\u00ea/2#;\u00eb/)$8":\u012c""! )("\'#&\'#=." 7\u0112'), f('<%;\u022d/1#;\u023f/($8":\u00b0"!!)("\'#&\'#=." 7\u012d'), f("%;\u00ed/B#;\u023f/9$$;\u00ec0#*;\u00ec&/)$8#:\u012e#\"\" )(#'#(\"'#&'#"), f("%;\u01a2/:#;\u00ed/1$;\u023f/($8#:\u0093#!!)(#'#(\"'#&'#"), f("<%;\u01a0/C#;q/:$;\u023f/1$;\u01a1/($8$:\u0130$!\")($'#(#'#(\"'#&'#=.\" 7\u012f"), f('<%;\u01d6/;#;\u023f/2$;\u022d/)$8#:\u0132#"" )(#\'#("\'#&\'#=." 7\u0131'), 
    f("<%;\u00f0.) &;\u01f8.# &;\u01e2/' 8!:\u00b0!! )=.\" 7\u0133"), f('<%;\u0228/@#;\u023f/7$;\u00f1." &"/)$8#:\u0135#"" )(#\'#("\'#&\'#=." 7\u0134'), f('%;\u01bb/1#;\u023f/($8":\u0136"!!)("\'#&\'#'), f("<%;\u00f3/\u008a#;\u00f4.\" &\"/|$;\u00c6/s$;\u023f/j$;\u00f5/a$;\u00b9.\" &\"/S$;\u00a9.\" &\"/E$;\u023f/<$;\u00aa.\" &\"/.$8):\u0138)'('&$#\" )()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0137"), f('<%;\u022a/1#;\u023f/($8":\u00b0"!!)("\'#&\'#=." 7\u0139'), f("<%;\u020a/C#;\u023f/:$;\u00dc/1$;\u023f/($8$:\u013b$!!)($'#(#'#(\"'#&'#=.\" 7\u013a"), 
    f("<%;\u0220/C#;\u023f/:$;\u00f6/1$;\u023f/($8$:\u013d$!!)($'#(#'#(\"'#&'#=.\" 7\u013c"), f('%;\u00f8/9#$;\u00f70#*;\u00f7&/)$8":\u012e""! )("\'#&\'#'), f("%;\u023f/:#;\u01a2/1$;\u00f8/($8#:\u0129#! )(#'#(\"'#&'#"), f("<%;\u017d/M#;\u023f/D$;\u01ac/;$;o/2$;\u023f/)$8%:\u013f%\"$!)(%'#($'#(#'#(\"'#&'#=.\" 7\u013e"), f('<%;\u00fa/h#;\u00c6/_$;\u023f/V$;\u00b9." &"/H$;\u00a9." &"/:$;\u00aa." &"/,$8&:\u0141&%%$"! )(&\'#(%\'#($\'#(#\'#("\'#&\'#=." 7\u0140'), f("<%;\u01d9/C#;\u023f/:$;\u01e9/1$;\u023f/($8$:\u00b0$!#)($'#(#'#(\"'#&'#=.\" 7\u0142"), 
    f('<;\u00fd.5 &;\u00fe./ &;\u00ff.) &;\u0100.# &;\u0101=." 7\u0143'), f('%;\u01d0/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'), f("%%<%;\u00fc/>#;\u01f2./ &;\u0227.) &;\u022e.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0102/($8\":\u0129\"! )(\"'#&'#"), f("%%<%;\u00fc/>#;\u0221./ &;\u0227.) &;\u022e.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0143/($8\":\u0129\"! )(\"'#&'#"), f("%%<%;\u00fc/>#;\u0221./ &;\u01f2.) &;\u022e.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0147/($8\":\u0129\"! )(\"'#&'#"), f("%%<%;\u00fc/>#;\u0221./ &;\u01f2.) &;\u0227.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0156/($8\":\u0129\"! )(\"'#&'#"), 
    f("%%<%;\u00fc/>#;\u0221./ &;\u01f2.) &;\u0227.# &;\u022e/#$+\")(\"'#&'#=.##&&!&'#/1#;\u015a/($8\":\u0129\"! )(\"'#&'#"), f("<%;\u0103/T#;\u0105.\" &\"/F$;\u017b/=$;\u023f/4$;\u0106/+$8%:\u0145%$$#\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u0144"), f("%;\u00fc/J#;\u0104.\" &\"/<$;\u0221/3$;\u023f/*$8$:\u0146$##\"!)($'#(#'#(\"'#&'#"), f('%;\u0223.# &;\u0222/1#;\u023f/($8":\u0147"!!)("\'#&\'#'), f("<%;\u01ee/N#;\u023f/E$;k/<$;\u01e4/3$;\u023f/*$8%:\u0149%#$\"!)(%'#($'#(#'#(\"'#&'#=.\" 7\u0148"), f(";\u0107.# &;\u0142"), 
    f("<%;\u01a0/Z#;\u0109/Q$$;\u010b0#*;\u010b&/A$;\u01a1/8$;\u0108.\" &\"/*$8%:\u014b%##\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u014a"), f("%;\u0233/D#;\u023f/;$;\u021d/2$;\u023f/)$8$:\u014c$\"#!)($'#(#'#(\"'#&'#"), f("%;\u010c/B#;\u023f/9$$;\u010a0#*;\u010a&/)$8#:\u012e#\"\" )(#'#(\"'#&'#"), f("%;\u01a2/:#;\u010c/1$;\u023f/($8#:\u00aa#!!)(#'#(\"'#&'#"), f('%;\u01a2." &"/1#;\u0120/($8":\u014d"! )("\'#&\'#'), f('<%;\u010d/O#;\u023f/F$;\u010e." &"/8$;\u010f." &"/*$8$:\u014f$##! )($\'#(#\'#("\'#&\'#=." 7\u014e'), 
    f("%;\u0195/=#%<;\u023f=/##&'!&&#/($8\":p\"!!)(\"'#&'#.\\ &%%<;\u010e.) &;\u0111.# &;\u0120=.##&&!&'#/:#;\u023f/1$;\u0198/($8#:p#! )(#'#(\"'#&'#"), f('<%;&/1#;\u023f/($8":\u0151"!!)("\'#&\'#=." 7\u0150'), f("%;\u0111/B#$;\u01100#*;\u0110&/2$;\u023f/)$8#:\u012e#\"\"!)(#'#(\"'#&'#"), f('%;\u023f/1#;\u0111/($8":\u0129"! )("\'#&\'#'), f('<%;\u0112." &"/A#;\u0114/8$;\u0112." &"/*$8#:\u0153##"! )(#\'#("\'#&\'#=." 7\u0152'), f("%$;\u0113/&#0#*;\u0113&&&#/' 8!:\u0154!! )"), f("<%;\u01cf/C#;\u023f/:$;\u0195/1$;\u023f/($8$:\u0156$!!)($'#(#'#(\"'#&'#=.\" 7\u0155"), 
    f(";\u0116.; &;\u0119.5 &;\u011c./ &;\u011d.) &;\u011f.# &;\u0115"), f("<%;\u0135/' 8!:\u0158!! )=.\" 7\u0157"), f('<%;\u0117/U#;\u012f." &"/G$;\u0130." &"/9$;\u0118." &"/+$8$:\u015a$$#"! )($\'#(#\'#("\'#&\'#=." 7\u0159'), f("<%;\u020f.# &;\u020e/D#;\u023f/;$;\u01fd/2$;\u023f/)$8$:\u015c$\"#!)($'#(#'#(\"'#&'#=.\" 7\u015b"), f('<%;\u01c2/1#;\u023f/($8":\u015e"!!)("\'#&\'#=." 7\u015d'), f('%;\u011a/@#;\u0130." &"/2$;\u023f/)$8#:\u015f#""!)(#\'#("\'#&\'#'), f('<%;\u011b.# &;\u0229/1#;\u023f/($8":\u010b"!!)("\'#&\'#=." 7\u0160'), 
    f('<%;k." &"/2#;\u0206/)$8":\u0162""! )("\'#&\'#=." 7\u0161'), f('<;\u0132=." 7\u0163'), f("<%;\u01d6/D#;\u023f/;$;\u011e/2$;\u023f/)$8$:\u0165$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0164"), f(";L./ &;5.) &;,.# &;3"), f("<%;\u012d/' 8!:\u0167!! )=.\" 7\u0166"), f('<%;\u0112." &"/J#;\u0121/A$;\u023f/8$;\u0112." &"/*$8$:\u0169$##" )($\'#(#\'#("\'#&\'#=." 7\u0168'), f(";\u0133.) &;\u0123.# &;\u0122"), f("<%;\u0132/' 8!:\u016b!! )=.\" 7\u016a"), f("<%;\u0124/J#;\u023f/A$;\u0129/8$;\u0130.\" &\"/*$8$:\u016d$##! )($'#(#'#(\"'#&'#=.\" 7\u016c"), 
    f('%;\u0125.# &;\u0126/1#;\u023f/($8":\u016e"!!)("\'#&\'#'), f('<%;\u020f/;#;\u023f/2$;\u01fd/)$8#:\u016f#"" )(#\'#("\'#&\'#=." 7\u015b'), f("<%;\u0229/' 8!:\u0171!! )=.\" 7\u0170"), f("%;\u01a0/T#;\u012b/K$;\u023f/B$$;\u012a0#*;\u012a&/2$;\u01a1/)$8%:\u0172%\"#!)(%'#($'#(#'#(\"'#&'#"), f("%;\u0127/' 8!:\u0173!! )"), f("%;\u0127/' 8!:\u0174!! )"), f("%;\u01a2/:#;\u012b/1$;\u023f/($8#:\u0129#!!)(#'#(\"'#&'#"), f('<%;\u012c/O#;\u023f/F$;\u012f." &"/8$;\u0118." &"/*$8$:\u0176$##! )($\'#(#\'#("\'#&\'#=." 7\u0175'), 
    f("%;\u00e8/\\#%<%;\u023f/8#;\u01b3.) &;\u01a1.# &;\u012f/#$+\")(\"'#&'#=/##&'!&&#/($8\":p\"!!)(\"'#&'#.# &;o"), f("<%$;\u012e/&#0#*;\u012e&&&#/' 8!:\u0178!! )=.\" 7\u0177"), f("%;\u01cb/C#;\u023f/:$;\u0181/1$;\u023f/($8$:p$!!)($'#(#'#(\"'#&'#"), f('<%;\u01c0.# &;\u01da/1#;\u023f/($8":\u017a"!!)("\'#&\'#=." 7\u0179'), f("%;\u0131/;#;\u00dc/2$;\u023f/)$8#:\u017b#\"\"!)(#'#(\"'#&'#"), f("<%;\u0209/D#;\u023f/;$;\u01ce/2$;\u023f/)$8$:\u017d$\"#!)($'#(#'#(\"'#&'#=.\" 7\u017c"), f("%;\u01ca/;#;\u023f/2$;L/)$8#:\u017e#\"\" )(#'#(\"'#&'#"), 
    f("<%;\u0134/E#;\u00e6/<$;\u0135/3$;\u023f/*$8$:\u0180$##\"!)($'#(#'#(\"'#&'#=.\" 7\u017f"), f("<%;\u01e8/D#;\u023f/;$;\u01fd/2$;\u023f/)$8$:\u0182$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0181"), f('%;\u0136/F#;\u0137." &"/8$;\u0140." &"/*$8#:\u0183##"! )(#\'#("\'#&\'#'), f("<%;\u0213/D#;\u023f/;$;\u0187/2$;\u023f/)$8$:\u0185$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0184"), f("%;\u0139/B#;\u023f/9$$;\u01380#*;\u0138&/)$8#:\u0186#\"\" )(#'#(\"'#&'#"), f('%;\u0139/1#;\u023f/($8":\u0136"!!)("\'#&\'#'), f('<;\u013a.# &;\u013f=." 7\u0187'), 
    f("%;\u0209/T#;\u023f/K$;\u01d9.# &;\u022a/<$;\u023f/3$;\u013b/*$8%:\u0188%#$\" )(%'#($'#(#'#(\"'#&'#"), f('<;\u013c.) &;\u013d.# &;\u013e=." 7\u0189'), f("%;\u0220/J#;\u023f/A$;\u0206.# &;\u01d6/2$;\u023f/)$8$:\u018a$\"#!)($'#(#'#(\"'#&'#"), f('%;\u01c7.# &;\u0219/1#;\u023f/($8":\u018b"!!)("\'#&\'#'), f("%;\u0203/D#;\u023f/;$;\u01b8/2$;\u023f/)$8$:\u018c$\"#!)($'#(#'#(\"'#&'#"), f("%;\u0201/D#;\u023f/;$;\u0195/2$;\u023f/)$8$:\u018d$\"#!)($'#(#'#(\"'#&'#"), f('<%;k." &"/J#;\u01d7/A$;\u023f/8$;\u0141." &"/*$8$:\u018f$##" )($\'#(#\'#("\'#&\'#=." 7\u018e'), 
    f("%;\u01f4/J#;\u023f/A$;\u01d8.# &;\u01f0/2$;\u023f/)$8$:\u0190$\"#!)($'#(#'#(\"'#&'#"), f("%;\u0159/' 8!:\u0191!! )"), f("<%;\u0144/c#;\u0105.\" &\"/U$;\u0183/L$;\u023f/C$;\u0146/:$;\u00b9.\" &\"/,$8&:\u0193&%%$#! )(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0192"), f("%;\u00fc/J#;\u0145.\" &\"/<$;\u01f2/3$;\u023f/*$8$:\u0194$##\"!)($'#(#'#(\"'#&'#"), f('%;\u0229/1#;\u023f/($8":\u0195"!!)("\'#&\'#'), f("<%;\u0209/N#;\u023f/E$;\u017b/<$;\u023f/3$;\u0128/*$8%:\u0197%#$\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u0196"), 
    f("<%;\u0148/\u00a6#;\u0105.\" &\"/\u0098$;\u0184.\" &\"/\u008a$;\u023f/\u0081$;\u0149/x$;\u0209/o$;\u023f/f$;\u017b/]$;\u023f/T$;\u0151.\" &\"/F$;\u0152.\" &\"/8$;\u0153//$8,:\u0199,(+*)'$\"! )(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0198"), f("%;\u00fc/J#;\u0104.\" &\"/<$;\u0227/3$;\u023f/*$8$:\u019a$##\"!)($'#(#'#(\"'#&'#"), f('<%;\u014a." &"/2#;\u014c/)$8":\u019c""! )("\'#&\'#=." 7\u019b'), f('%;\u01c3.) &;\u01ba.# &;\u014b/1#;\u023f/($8":\u019d"!!)("\'#&\'#'), f("%;\u01f7/;#;\u023f/2$;\u0207/)$8#:\u019e#\"\" )(#'#(\"'#&'#"), 
    f('<;\u014d.# &;\u014e=." 7\u019f'), f('%;\u01d9.# &;\u01f6/1#;\u023f/($8":\u01a0"!!)("\'#&\'#'), f('%;\u022a/@#;\u023f/7$;\u014f." &"/)$8#:\u01a1#"" )(#\'#("\'#&\'#'), f("%;\u0207/;#;\u023f/2$;\u0150/)$8#:\u01a2#\"\" )(#'#(\"'#&'#"), f("%;\u00e8/B#;\u023f/9$$;\u00e70#*;\u00e7&/)$8#:\u012e#\"\" )(#'#(\"'#&'#"), f("%;\u01e7/c#;\u023f/Z$;\u01de/Q$;\u023f/H$;\u021c.) &3\u01a3\"\"5)7\u01a4/3$;\u023f/*$8&:\u01a5&#%#!)(&'#(%'#($'#(#'#(\"'#&'#"), f("<%;\u0230/D#;\u023f/;$;o/2$;\u023f/)$8$:\u01a6$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0084"), 
    f("<%;\u01c4/W#;\u023f/N$;\u0154/E$;\u023f/<$;\u01e0/3$;\u023f/*$8&:\u01a8&#%#!)(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u01a7"), f("%$;\u0155/&#0#*;\u0155&&&#/' 8!:\u01a9!! )"), f("%;\u008c/:#;\u023f/1$;$/($8#:\"#!\")(#'#(\"'#&'#"), f("<%;\u0158/T#;\u0105.\" &\"/F$;\u0157/=$;\u023f/4$;\u0159/+$8%:\u01ab%$$#\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u01aa"), f("%;\u0185/;#;\u023f/2$;\u00e6/)$8#:\u01ac#\"\" )(#'#(\"'#&'#.# &;\u0185"), f("%;\u00fc/J#;\u0104.\" &\"/<$;\u022e/3$;\u023f/*$8$:\u01ad$##\"!)($'#(#'#(\"'#&'#"), 
    f("%;\u01bf/D#;\u023f/;$;\u00a8/2$;\u023f/)$8$:\u012c$\"#!)($'#(#'#(\"'#&'#"), f("<%;\u015b/f#;\u0105.\" &\"/X$;\u017b/O$;\u023f/F$;\u022b/=$;\u023f/4$;\u015c/+$8':\u01af'$&%$ )(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u01ae"), f("%;\u00fc/N#;\u022f/E$;\u023f/<$;\u0221/3$;\u023f/*$8%:\u01b0%#$#!)(%'#($'#(#'#(\"'#&'#"), f('%;\u0197/@#;\u023f/7$;\u015d." &"/)$8#:\u01b1#"" )(#\'#("\'#&\'#'), f("<%;\u01a0/Z#;\u023f/Q$;\u015e.\" &\"/C$;\u023f/:$;\u01a1/1$;\u023f/($8&:\u01b3&!#)(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u01b2"), 
    f('%;\u0160/9#$;\u015f0#*;\u015f&/)$8":\u01b4""! )("\'#&\'#'), f("%;\u023f/H#;\u01a2/?$;\u023f/6$;\u0160.\" &\"/($8$:\u01b5$! )($'#(#'#(\"'#&'#"), f("%%<%;\u0195/;#;\u023f/2$;&.# &;\u0111/#$+#)(#'#(\"'#&'#=.##&&!&'#/:#;o/1$;\u023f/($8#:\u0130#!!)(#'#(\"'#&'#.x &%;\u0161/n#%%<;\u0193=.##&&!&'#/,#;\u023f/#$+\")(\"'#&'#/F$;\u010e.\" &\"/8$;\u010f.\" &\"/*$8$:\u014f$##! )($'#(#'#(\"'#&'#"), f(";\u0195.# &;\u0198"), f('<%;\u0163/;#;\u017b/2$;\u023f/)$8#:\u01b7#""!)(#\'#("\'#&\'#=." 7\u01b6'), f("<%;\u01dd/J#;\u023f/A$;\u0164/8$;\u0165.\" &\"/*$8$:\u01b9$##! )($'#(#'#(\"'#&'#=.\" 7\u01b8"), 
    f('<%;\u0221./ &;\u01f2.) &;\u0227.# &;\u022e/1#;\u023f/($8":\u010b"!!)("\'#&\'#=." 7\u01ba'), f("<%;\u01ee/D#;\u023f/;$;\u01e4/2$;\u023f/)$8$:\u01bc$\"#!)($'#(#'#(\"'#&'#=.\" 7\u01bb"), f('<%;\u01ae/,#;\u01ae/#$+")("\'#&\'#=." 7\u01bd'), f('<;\u01aa=." 7\u01be'), f('<;\u01ab=." 7\u01bf'), f('<;\u01a4=." 7\u01c0'), f('<;\u01b5=." 7\u01c1'), f('<;\u01af=." 7\u01c2'), f('<%;\u01b0/,#;\u01b0/#$+")("\'#&\'#=." 7\u01c3'), f('<%;\u01b1/,#;\u01b1/#$+")("\'#&\'#=." 7\u01c4'), f('<;\u01ad=." 7\u01c5'), 
    f('<;\u01ae=." 7\u01c6'), f('<;\u01b0=." 7\u01c7'), f('<;\u01b1=." 7\u01c8'), f('<%;\u01b0/,#;\u01ac/#$+")("\'#&\'#=." 7\u01c9'), f('<%;\u01b1/,#;\u01ac/#$+")("\'#&\'#=." 7\u01ca'), f('<%;\u01ac/1#;\u01ac." &"/#$+")("\'#&\'#=." 7\u01cb'), f('<%;\u01b2/,#;\u01ac/#$+")("\'#&\'#=." 7\u01cc'), f('<%;\u01b0/,#;\u01b1/#$+")("\'#&\'#=." 7\u01cc'), f('<%;\u01fa/@#;\u023f/7$;k." &"/)$8#:\u01ce#"" )(#\'#("\'#&\'#=." 7\u01cd'), f('<;\u0195.# &;\u0198=." 7\u01cf'), f("<%;\u0178/' 8!:\u01d1!! )=.\" 7\u01d0"), 
    f('<%;\u017c." &"/2#;\u0178/)$8":\u01d3""! )("\'#&\'#=." 7\u01d2'), f('<%;\u017c." &"/2#;\u0178/)$8":\u01d5""! )("\'#&\'#=." 7\u01d4'), f('%;\u0178/2#;\u01a3/)$8":\u01d6""! )("\'#&\'#'), f('<%;\u017f.) &;\u0180.# &;\u017e/2#;\u0178/)$8":\u01d8""! )("\'#&\'#=." 7\u01d7'), f("%;\u023f/& 8!:\u01d9! )"), f('%;\u017c/2#;\u0180/)$8":\u01da""! )("\'#&\'#'), f('%;\u0178/2#;\u01a3/)$8":D""! )("\'#&\'#'), f("<%;\u0178/' 8!:\u01dc!! )=.\" 7\u01db"), f("<%;\u0178/' 8!:\u01de!! )=.\" 7\u01dd"), f('<%;\u017c." &"/2#;\u0178/)$8":\u01e0""! )("\'#&\'#=." 7\u01df'), 
    f('<%;\u017c." &"/2#;\u0178/)$8":\u01e2""! )("\'#&\'#=." 7\u01e1'), f('<%;\u017c." &"/2#;\u0178/)$8":\u01e4""! )("\'#&\'#=." 7\u01e3'), f('<%;\u017c." &"/2#;\u0178/)$8":\u01e6""! )("\'#&\'#=." 7\u01e5'), f('<%;\u0188.# &;\u017b/1#;\u023f/($8":\u01e8"!!)("\'#&\'#=." 7\u01e7'), f("%;\u017b/;#;\u023f/2$;\u00e6/)$8#:\u01e9#\"\" )(#'#(\"'#&'#"), f("<%;\u0178/' 8!:\u01eb!! )=.\" 7\u01ea"), f("<%;\u0178/' 8!:\u01ed!! )=.\" 7\u01ec"), f('<%;\u018c/=#%<;\u0193=.##&&!&\'#/($8":\u01ef"!!)("\'#&\'#.\u00c5 &%;\u018d/=#%<;\u0193=.##&&!&\'#/($8":\u01f0"!!)("\'#&\'#.\u009b &%;\u018f/=#%<;\u0193=.##&&!&\'#/($8":\u01f1"!!)("\'#&\'#.q &%;\u0190/=#%<;\u0193=.##&&!&\'#/($8":\u01f2"!!)("\'#&\'#.G &%;\u0192/=#%<;\u0193=.##&&!&\'#/($8":\u01f3"!!)("\'#&\'#=." 7\u01ee'), 
    f('<%%3\u01f5""5!7\u01f6." &"/F#3\u01f7""5#7\u01f8." &"/2$3\u01f9""5$7\u01fa/#$+#)(#\'#("\'#&\'#.k &%3\u01fb""5$7\u01fc.5 &3\u01fd""5&7\u01fe.) &3\u01ff""5$7\u0200." &"/2#3\u0201""5$7\u0202/#$+")("\'#&\'#.) &3\u0203""5$7\u0204/\' 8!:\u010b!! )=." 7\u01f4'), f('<%;\u018e.5 &3\u0206""5%7\u0207.) &3\u0208""5$7\u0209/\' 8!:\u010b!! )=." 7\u0205'), f('<%3\u020b""5&7\u020c/i#%$4(""5!7)/,#0)*4(""5!7)&&&#/2#3\u020d""5)7\u020e/#$+")("\'#&\'#." &"/)$8":\u020f""! )("\'#&\'#=." 7\u020a'), f('<%3\u0211""5\'7\u0212.\u0095 &3\u0213""5\'7\u0214.\u0089 &3\u0215""5\'7\u0216.} &%3\u0217""5$7\u0218/7#3\u0219""5$7\u021a." &"/#$+")("\'#&\'#.S &%3\u0219""5$7\u021a/7#3\u021b""5%7\u021c." &"/#$+")("\'#&\'#.) &3\u021d""5&7\u021e/\' 8!:\u010b!! )=." 7\u0210'), 
    f('<%%3\u0220""5#7\u0221/V#2\u0222""6\u02227\u0223.A &2\u0224""6\u02247\u0225.5 &2\u0226""6\u02267\u0227.) &3\u0228""5$7\u0229/#$+")("\'#&\'#.q &%3\u022a""5#7\u022b.A &3\u01fd""5&7\u01fe.5 &3\u022c""5%7\u022d.) &3\u01fb""5$7\u01fc." &"/2#3\u0220""5#7\u0221/#$+")("\'#&\'#.# &;\u0191/\' 8!:\u010b!! )=." 7\u021f'), f('%3\u022e""5(7\u022f/d#%$4(""5!7)/,#0)*4(""5!7)&&&#/2#3\u0230""5%7\u0231/#$+")("\'#&\'#/)$8":\u0232""! )("\'#&\'#'), f('<%3\u0234""5$7\u0235/\' 8!:\u010b!! )=." 7\u0233'), f('4\u0236""5!7\u0237'), 
    f('%2\u0238""6\u02387\u0239/K#$4\u023a""5!7\u023b/,#0)*4\u023a""5!7\u023b&&&#/)$8":\u023c""! )("\'#&\'#'), f(";\u0196.# &;\u0197"), f(";\u0199./ &;\u019d.) &;\u019b.# &;\u019c"), f("%%<;\u0234.# &;>=.##&&!&'#/J#$;\u0194.# &;\u0193/,#0)*;\u0194.# &;\u0193&&&#/($8\":\u00d6\"! )(\"'#&'#"), f("%%<;\u0236.# &;>=.##&&!&'#/J#$;\u0194.# &;\u0193/,#0)*;\u0194.# &;\u0193&&&#/($8\":\u023d\"! )(\"'#&'#"), f("%;\u019e/\u0099#;\u023f/\u0090$%$%%<;\u019a=.##&&!&'#/1#1\"\"5!7\u023e/#$+\")(\"'#&'#0G*%%<;\u019a=.##&&!&'#/1#1\"\"5!7\u023e/#$+\")(\"'#&'#&/\"!&,)/1$;\u019a/($8$:\u023f$!!)($'#(#'#(\"'#&'#"), 
    f('%$4\u0240""5!7\u02410)*4\u0240""5!7\u0241&/5#;\u019f/,$;\u023f/#$+#)(#\'#("\'#&\'#'), f('%2\u0242""6\u02427\u0243/k#$2\u0244""6\u02447\u0245.) &4\u0246""5!7\u024705*2\u0244""6\u02447\u0245.) &4\u0246""5!7\u0247&/7$2\u0242""6\u02427\u0243/($8#:\u0248#!!)(#\'#("\'#&\'#'), f('%2\u0249""6\u02497\u024a/k#$26""6677.) &48""5!7905*26""6677.) &48""5!79&/7$2\u0249""6\u02497\u024a/($8#:\u024b#!!)(#\'#("\'#&\'#'), f('%2\u024c""6\u024c7\u024d/k#$2\u024e""6\u024e7\u024f.) &4\u0250""5!7\u025105*2\u024e""6\u024e7\u024f.) &4\u0250""5!7\u0251&/7$2\u024c""6\u024c7\u024d/($8#:\u0252#!!)(#\'#("\'#&\'#'), 
    f('<%2\u0254""6\u02547\u0255/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0253'), f('<%2\u0257""6\u02577\u0258/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0256'), f('<%2\u025a""6\u025a7\u025b/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0259'), f('<%2\u025d""6\u025d7\u025e/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u025c'), f('<%2\u0260""6\u02607\u0261/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u025f'), f('<%2\u0263""6\u02637\u0264/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0262'), f('<%2\u0266""6\u02667\u0267/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0265'), 
    f('<%2\u0269""6\u02697\u026a/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0268'), f('<%2\u0249""6\u02497\u024a/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026b'), f('<%2\u0242""6\u02427\u0243/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026c'), f('<%2\u024c""6\u024c7\u024d/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026d'), f('<%2\u026f""6\u026f7\u0270/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026e'), f('<%2\u0272""6\u02727\u0273/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0271'), f('<%2\u0275""6\u02757\u0276/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0274'), 
    f('<%2\u0277""6\u02777\u0278/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01cb'), f('<%2\u027a""6\u027a7\u027b/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0279'), f('<%2\u027d""6\u027d7\u027e/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u027c'), f('<%2\u027f""6\u027f7\u0280/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01c2'), f('<%2\u0281""6\u02817\u0282/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01c7'), f('<%2\u0283""6\u02837\u0284/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01c8'), f('<%2\u0286""6\u02867\u0287/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0285'), 
    f('<%2\u0289""6\u02897\u028a/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0288'), f('<%2a""6a7b/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u028b'), f('<%2\u028d""6\u028d7\u028e/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u028c'), f('<%2\u0290""6\u02907\u0291/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u028f'), f('%3\u0292""5%7\u0293/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0294""5&7\u0295/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0296""5#7\u0297/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0298""5%7\u0299/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u029a""5#7\u029b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u029c""5%7\u029d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u029e\"\"5'7\u029f/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u02a0""5#7\u02a1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02a2""5"7\u02a3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02a4""5#7\u02a5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02a6""5&7\u02a7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02a8""5-7\u02a9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u02aa""5&7\u02ab/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02ac""5%7\u02ad/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u02ae\"\"5'7\u02af/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u02b0""5"7\u02b1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u02b2\"\"5'7\u02b3/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u02b4""5$7\u02b5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02b6""5$7\u02b7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02b8""5%7\u02b9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f("%3\u02ba\"\"5'7\u02bb/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u02bc""5&7\u02bd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02be""5&7\u02bf/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02c0""5(7\u02c1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02c2""5*7\u02c3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02c4""5&7\u02c5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02c6""5%7\u02c7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02c8""5,7\u02c9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u02ca""5,7\u02cb/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02cc""517\u02cd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02ce""5(7\u02cf/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u02d0\"\"5'7\u02d1/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u02d2""5*7\u02d3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02d4""5(7\u02d5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02d6""5&7\u02d7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02d8""5$7\u02d9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u02da""5&7\u02db/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02dc""5(7\u02dd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02de""5$7\u02df/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02e0""5$7\u02e1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02e2""5$7\u02e3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02e4""5#7\u02e5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02e6""5&7\u02e7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02e8""5&7\u02e9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u02ea""5)7\u02eb/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02ec""5&7\u02ed/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u02ee\"\"5'7\u02ef/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u02f0""5$7\u02f1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02f2""5#7\u02f3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u02f4\"\"5'7\u02f5/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u02f6""5$7\u02f7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02f8""5$7\u02f9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u02fa""5$7\u02fb/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02fc""5%7\u02fd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u02fe""5&7\u02ff/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0300""5"7\u0301/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0302""5&7\u0303/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0304""5)7\u0305/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0306""5"7\u0307/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0308""5%7\u0309/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f("%3\u030a\"\"5'7\u030b/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u030c""5)7\u030d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u030e""5%7\u030f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0310""5&7\u0311/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u0312\"\"5'7\u0313/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u0314""5)7\u0315/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0316""5$7\u0317/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0318""5"7\u0319/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u031a""5&7\u031b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u031c""5$7\u031d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u031e""5#7\u031f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0320""5$7\u0321/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0322""5$7\u0323/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0324""5%7\u0325/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0326""5%7\u0327/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u0328\"\"5'7\u0329/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), 
    f('%3\u032a""5"7\u032b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u032c""5#7\u032d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u032e\"\"5'7\u032f/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3y""5$7z/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0330""5"7\u0331/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0332""5&7\u0333/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0334""5"7\u0335/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0336""5"7\u0337/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u0338""5%7\u0339/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u033a""5%7\u033b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u033c""5$7\u033d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u033e""5&7\u033f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u0340\"\"5'7\u0341/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u0342""5%7\u0343/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0344""5%7\u0345/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0346""5)7\u0347/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u0348""5*7\u0349/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u034a""5&7\u034b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u034c\"\"5'7\u034d/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f("%3\u034e\"\"5'7\u034f/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u0350""5&7\u0351/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u0352\"\"5'7\u0353/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u0354""5(7\u0355/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0356""5%7\u0357/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u0358""5(7\u0359/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u035a""5#7\u035b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u035c""5%7\u035d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u035e""5)7\u035f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0360""5&7\u0361/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0362""5#7\u0363/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0364""5%7\u0365/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0366""5$7\u0367/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u0368""5)7\u0369/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u036a""5$7\u036b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u036c""5"7\u036d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u036e""5+7\u036f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u0370\"\"5'7\u0371/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u0372""5%7\u0373/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0374""5&7\u0375/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0376""5&7\u0377/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f('%3\u0378""5%7\u0379/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u037a""5&7\u037b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u037c""5&7\u037d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u037e""5$7\u037f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f("%3\u0380\"\"5'7\u0381/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f('%3\u0382""5$7\u0383/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0384""5%7\u0385/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), f('%3\u0386""5$7\u0387/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'), 
    f("%3\u0388\"\"5'7\u0389/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"), f("%;\u0235/' 8!:\u038a!! )"), f(";\u01b7.\u02f9 &;\u01b8.\u02f3 &;\u01b9.\u02ed &;\u01ba.\u02e7 &;\u01bb.\u02e1 &;\u01bc.\u02db &;\u01bd.\u02d5 &;\u01be.\u02cf &;\u01bf.\u02c9 &;\u01c0.\u02c3 &;\u01c1.\u02bd &;\u01c2.\u02b7 &;\u01c3.\u02b1 &;\u01c4.\u02ab &;\u01c5.\u02a5 &;\u01c6.\u029f &;\u01c7.\u0299 &;\u01c8.\u0293 &;\u01c9.\u028d &;\u01ca.\u0287 &;\u01cb.\u0281 &;\u01cc.\u027b &;\u01cd.\u0275 &;\u01ce.\u026f &;\u01cf.\u0269 &;\u01d0.\u0263 &;\u01d1.\u025d &;\u01d2.\u0257 &;\u01d3.\u0251 &;\u01d4.\u024b &;\u01d5.\u0245 &;\u01d6.\u023f &;\u01d7.\u0239 &;\u01d8.\u0233 &;\u01d9.\u022d &;\u01da.\u0227 &;\u01db.\u0221 &;\u01dc.\u021b &;\u01dd.\u0215 &;\u01de.\u020f &;\u01df.\u0209 &;\u01e0.\u0203 &;\u01e1.\u01fd &;\u01e2.\u01f7 &;\u01e3.\u01f1 &;\u01e4.\u01eb &;\u01e5.\u01e5 &;\u01e6.\u01df &;\u01e7.\u01d9 &;\u01e8.\u01d3 &;\u01e9.\u01cd &;\u01ea.\u01c7 &;\u01eb.\u01c1 &;\u01ec.\u01bb &;\u01ed.\u01b5 &;\u01ee.\u01af &;\u01ef.\u01a9 &;\u01f0.\u01a3 &;\u01f1.\u019d &;\u01f2.\u0197 &;\u01f3.\u0191 &;\u01f4.\u018b &;\u01f5.\u0185 &;\u01f6.\u017f &;\u01f7.\u0179 &;\u01f8.\u0173 &;\u01f9.\u016d &;\u01fa.\u0167 &;\u01fb.\u0161 &;\u01fc.\u015b &;\u01fd.\u0155 &;\u01fe.\u014f &;\u01ff.\u0149 &;\u0200.\u0143 &;\u0201.\u013d &;\u0202.\u0137 &;\u0203.\u0131 &;\u0204.\u012b &;\u0205.\u0125 &;\u0206.\u011f &;\u0207.\u0119 &;\u0208.\u0113 &;\u0209.\u010d &;\u020a.\u0107 &;\u020b.\u0101 &;\u020c.\u00fb &;\u020d.\u00f5 &;\u020e.\u00ef &;\u020f.\u00e9 &;\u0210.\u00e3 &;\u0211.\u00dd &;\u0212.\u00d7 &;\u0213.\u00d1 &;\u0214.\u00cb &;\u0215.\u00c5 &;\u0216.\u00bf &;\u0217.\u00b9 &;\u0218.\u00b3 &;\u0219.\u00ad &;\u021a.\u00a7 &;\u021b.\u00a1 &;\u021c.\u009b &;\u021e.\u0095 &;\u021f.\u008f &;\u0220.\u0089 &;\u0221.\u0083 &;\u0223.} &;\u0224.w &;\u0225.q &;\u0226.k &;\u0227.e &;\u0228._ &;\u0229.Y &;\u022a.S &;\u022b.M &;\u022c.G &;\u022d.A &;\u022e.; &;\u022f.5 &;\u0230./ &;\u0231.) &;\u0232.# &;\u0233"), 
    f(";\u01b9.\u0167 &;\u01bb.\u0161 &;\u01bc.\u015b &;\u01be.\u0155 &;\u01bf.\u014f &;\u01c2.\u0149 &;\u01c5.\u0143 &;\u01c8.\u013d &;\u01ca.\u0137 &;\u01cb.\u0131 &;\u01cd.\u012b &;\u01cf.\u0125 &;\u01d0.\u011f &;\u01d6.\u0119 &;\u01d7.\u0113 &;\u01d9.\u010d &;\u01dc.\u0107 &;\u01dd.\u0101 &;\u01df.\u00fb &;\u01e1.\u00f5 &;\u01e2.\u00ef &;\u01e4.\u00e9 &;\u01e8.\u00e3 &;\u01e9.\u00dd &;\u01ec.\u00d7 &;\u01ed.\u00d1 &;\u01f1.\u00cb &;\u01f2.\u00c5 &;\u01f6.\u00bf &;\u01f8.\u00b9 &;\u01f9.\u00b3 &;\u01fa.\u00ad &;\u01fb.\u00a7 &;\u01fc.\u00a1 &;\u0200.\u009b &;\u0204.\u0095 &;\u0205.\u008f &;\u0206.\u0089 &;\u0209.\u0083 &;\u020a.} &;\u020b.w &;\u020f.q &;\u0213.k &;\u021f.e &;\u0220._ &;\u0221.Y &;\u0224.S &;\u0225.M &;\u0226.G &;\u0228.A &;\u0229.; &;\u022a.5 &;\u022b./ &;\u022d.) &;\u0230.# &;\u0231"), 
    f(";\u0238.. &%;\u0239/& 8!:\u038b! )"), f('<%2\u038d""6\u038d7\u038e/\u0087#$%%<4\u038f""5!7\u0390=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#0M*%%<4\u038f""5!7\u0390=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#&/#$+")("\'#&\'#=." 7\u038c'), f("<%;\u023a/5#;\u023e/,$;\u023b/#$+#)(#'#(\"'#&'#=.\" 7\u0391"), f('2\u0392""6\u03927\u0393'), f('2\u0394""6\u03947\u0395'), f('$%%<;\u023b.# &;\u023a=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#/P#0M*%%<;\u023b.# &;\u023a=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#&&&#'), 
    f(";\u023c.# &;\u0239"), f('%;\u023d/K#$4\u0396""5!7\u0397.# &;\u023d0/*4\u0396""5!7\u0397.# &;\u023d&/#$+")("\'#&\'#'), f('<%$4\u0396""5!7\u0397.# &;\u02370/*4\u0396""5!7\u0397.# &;\u0237&/\' 8!:-!! )=." 7\u0398'), f('2\u0399""6\u03997\u039a')], Aa = 0, lb = [{line:1, column:1}], Xa = 0, Lb = [], nb = 0, Yb = {}, mb = "start start_streaming stmt_list semi_optional semi_required stmt_list_tail type_definition type_definition_types datatype_custom datatype_word_tail type_definition_args definition_args_loop literal_value literal_null literal_date literal_string literal_string_single literal_string_schar literal_blob literal_text number_sign literal_number_signed literal_number literal_number_decimal number_decimal_node number_decimal_full number_decimal_fraction number_decimal_exponent literal_number_hex number_hex number_digit bind_parameter bind_parameter_numbered bind_number_id bind_parameter_named bind_parameter_tcl tcl_suffix expression_exists expression_exists_ne expression_raise expression_raise_args raise_args_ignore raise_args_message expression_root expression_wrapped expression_recur expression_unary_collate expression_unary expression_unary_op expression_collate expression_concat expression_multiply expression_multiply_op expression_add expression_add_op expression_shift expression_shift_op expression_compare expression_compare_op expression_equiv expression_equiv_tails expression_equiv_null_op expression_equiv_op expression_cast type_alias expression_case case_expression expression_case_when expression_case_else expression_postfix expression_postfix_tail expression_like expression_escape expression_between expression_between_tail expression_is_not expression_in expression_in_target expression_list_or_select expression expression_and_op expression_list expression_list_loop expression_list_rest function_call function_call_args args_list_distinct error_message stmt stmt_modifier modifier_query stmt_nodes stmt_commit stmt_begin commit_transaction stmt_begin_modifier stmt_rollback rollback_savepoint savepoint_name savepoint_alt stmt_savepoint stmt_release stmt_alter alter_start alter_action alter_action_rename alter_action_add action_add_modifier stmt_crud stmt_core_with clause_with clause_with_recursive clause_with_tables clause_with_loop expression_cte select_alias select_wrapped stmt_select_full stmt_sqlite stmt_attach attach_arg stmt_detach stmt_vacuum vacuum_target stmt_analyze analyze_arg stmt_reindex reindex_arg stmt_pragma pragma_expression pragma_value pragma_value_literal pragma_value_bool pragma_bool_id pragma_value_name stmt_crud_types stmt_select stmt_core_order stmt_core_limit stmt_core_limit_offset limit_offset_variant limit_offset_variant_name select_loop select_loop_union select_parts select_parts_core select_core_select select_modifier select_modifier_distinct select_modifier_all select_target select_target_loop select_core_from stmt_core_where select_core_group select_core_having select_node select_node_star select_node_star_qualified select_node_aliased select_source source_loop_tail select_cross_clause select_join_clause table_or_sub table_or_sub_func table_qualified table_qualified_id table_or_sub_index_node index_node_indexed index_node_none table_or_sub_sub table_or_sub_select alias join_operator join_operator_natural join_operator_types operator_types_hand types_hand_outer operator_types_misc join_condition join_condition_on join_condition_using select_parts_values stmt_core_order_list stmt_core_order_list_loop stmt_core_order_list_item select_star stmt_fallback_types stmt_insert insert_keyword insert_keyword_ins insert_keyword_repl insert_keyword_mod insert_target insert_into insert_into_start insert_results loop_columns loop_column_tail loop_name insert_value insert_value_start insert_values_list insert_values_loop expression_list_wrapped insert_default operator_compound compound_union compound_union_all stmt_update update_start update_fallback update_set update_columns update_columns_tail update_column stmt_delete delete_start stmt_create create_start create_table_only create_index_only create_trigger_only create_view_only create_virtual_only create_table create_table_start create_core_tmp create_core_ine create_table_source table_source_def source_def_rowid source_def_loop source_def_tail source_tbl_loop source_def_column source_def_name column_type column_constraints column_constraint_tail column_constraint constraint_name constraint_name_loop column_constraint_types column_constraint_foreign column_constraint_primary col_primary_start col_primary_auto column_constraint_null constraint_null_types constraint_null_value column_constraint_check column_constraint_default column_default_values column_constraint_collate table_constraint table_constraint_types table_constraint_check table_constraint_primary primary_start primary_start_normal primary_start_unique primary_columns primary_columns_index primary_columns_table primary_column_tail primary_column primary_column_types column_collate column_collate_loop primary_column_dir primary_conflict primary_conflict_start constraint_check table_constraint_foreign foreign_start foreign_clause foreign_references foreign_actions foreign_actions_tail foreign_action foreign_action_on action_on_action on_action_set on_action_cascade on_action_none foreign_action_match foreign_deferrable deferrable_initially table_source_select create_index create_index_start index_unique index_on create_trigger create_trigger_start trigger_conditions trigger_apply_mods trigger_apply_instead trigger_do trigger_do_on trigger_do_update do_update_of do_update_columns trigger_foreach trigger_when trigger_action action_loop action_loop_stmt create_view id_view_expression create_view_start create_as_select create_virtual create_virtual_start virtual_module virtual_args virtual_args_loop virtual_args_tail virtual_arg_types virtual_column_name stmt_drop drop_start drop_types drop_ie binary_concat binary_plus binary_minus binary_multiply binary_divide binary_mod binary_left binary_right binary_and binary_or binary_lt binary_gt binary_lte binary_gte binary_equal binary_notequal_a binary_notequal_b binary_lang_isnt id_name id_database id_function id_table id_table_qualified id_column column_unqualified column_qualifiers id_column_qualified id_collation id_savepoint id_index id_trigger id_view id_pragma id_cte id_table_expression id_constraint_table id_constraint_column datatype_types datatype_text datatype_real datatype_real_double datatype_numeric datatype_integer datatype_integer_fp datatype_none name_char unicode_char name name_quoted name_unquoted name_reserved name_bracketed bracket_terminator name_dblquoted name_sglquoted name_backticked sym_bopen sym_bclose sym_popen sym_pclose sym_comma sym_dot sym_star sym_quest sym_sglquote sym_dblquote sym_backtick sym_tilde sym_plus sym_minus sym_equal sym_amp sym_pipe sym_mod sym_lt sym_gt sym_excl sym_semi sym_colon sym_fslash sym_bslash ABORT ACTION ADD AFTER ALL ALTER ANALYZE AND AS ASC ATTACH AUTOINCREMENT BEFORE BEGIN BETWEEN BY CASCADE CASE CAST CHECK COLLATE COLUMN COMMIT CONFLICT CONSTRAINT CREATE CROSS CURRENT_DATE CURRENT_TIME CURRENT_TIMESTAMP DATABASE DEFAULT DEFERRABLE DEFERRED DELETE DESC DETACH DISTINCT DROP EACH ELSE END ESCAPE EXCEPT EXCLUSIVE EXISTS EXPLAIN FAIL FOR FOREIGN FROM FULL GLOB GROUP HAVING IF IGNORE IMMEDIATE IN INDEX INDEXED INITIALLY INNER INSERT INSTEAD INTERSECT INTO IS ISNULL JOIN KEY LEFT LIKE LIMIT MATCH NATURAL NO NOT NOTNULL NULL OF OFFSET ON OR ORDER OUTER PLAN PRAGMA PRIMARY QUERY RAISE RECURSIVE REFERENCES REGEXP REINDEX RELEASE RENAME REPLACE RESTRICT RIGHT ROLLBACK ROW ROWID SAVEPOINT SELECT SET TABLE TEMP TEMPORARY THEN TO TRANSACTION TRIGGER UNION UNIQUE UPDATE USING VACUUM VALUES VIEW VIRTUAL WHEN WHERE WITH WITHOUT reserved_words reserved_word_list reserved_critical_list comment comment_line comment_block comment_block_start comment_block_end comment_block_body block_body_nodes comment_block_feed o _TODO_".split(" "), 
    hb = [null, null, null, null, null, null, "Type Definition", null, "Custom Datatype Name", null, "Type Definition Arguments", null, null, "Null Literal", "Date Literal", "String Literal", "Single-quoted String Literal", null, "Blob Literal", null, "Number Sign", null, null, null, "Decimal Literal", null, null, "Decimal Literal Exponent", "Hexidecimal Literal", null, null, "Bind Parameter", "Numbered Bind Parameter", null, "Named Bind Parameter", "TCL Bind Parameter", null, "EXISTS Expression", 
    "EXISTS Keyword", "RAISE Expression", "RAISE Expression Arguments", "IGNORE Keyword", null, null, null, null, null, null, null, "COLLATE Expression", null, null, null, null, null, null, null, null, null, null, null, null, null, "CAST Expression", "Type Alias", "CASE Expression", null, "WHEN Clause", "ELSE Clause", null, null, "Comparison Expression", "ESCAPE Expression", "BETWEEN Expression", null, null, "IN Expression", null, null, null, null, "Expression List", null, null, "Function Call", 
    "Function Call Arguments", null, "Error Message", "Statement", "QUERY PLAN", "QUERY PLAN Keyword", null, "END Transaction Statement", "BEGIN Transaction Statement", null, null, "ROLLBACK Statement", "TO Clause", null, null, "SAVEPOINT Statement", "RELEASE Statement", "ALTER TABLE Statement", "ALTER TABLE Keyword", null, "RENAME TO Keyword", "ADD COLUMN Keyword", null, null, "WITH Clause", null, null, null, null, "Common Table Expression", null, null, null, null, "ATTACH Statement", null, "DETACH Statement", 
    "VACUUM Statement", null, "ANALYZE Statement", null, "REINDEX Statement", null, "PRAGMA Statement", null, null, null, null, null, null, null, "SELECT Statement", "ORDER BY Clause", "LIMIT Clause", "OFFSET Clause", null, null, null, "Union Operation", null, null, "SELECT Results Clause", "SELECT Results Modifier", null, null, null, null, "FROM Clause", "WHERE Clause", "GROUP BY Clause", "HAVING Clause", null, null, null, null, null, null, "CROSS JOIN Operation", "JOIN Operation", null, null, "Qualified Table", 
    "Qualified Table Identifier", "Qualfied Table Index", null, null, "SELECT Source", "Subquery", "Alias", "JOIN Operator", null, null, null, null, null, "JOIN Constraint", "Join ON Clause", "Join USING Clause", "VALUES Clause", null, null, "Ordering Expression", "Star", "Fallback Type", "INSERT Statement", null, "INSERT Keyword", "REPLACE Keyword", "INSERT OR Modifier", null, "INTO Clause", "INTO Keyword", "VALUES Clause", "Column List", null, "Column Name", "VALUES Clause", "VALUES Keyword", null, 
    null, "Wrapped Expression List", "DEFAULT VALUES Clause", "Compound Operator", "UNION Operator", null, "UPDATE Statement", "UPDATE Keyword", "UPDATE OR Modifier", "SET Clause", null, null, "Column Assignment", "DELETE Statement", "DELETE Keyword", "CREATE Statement", null, null, null, null, null, null, "CREATE TABLE Statement", null, null, "IF NOT EXISTS Modifier", null, "Table Definition", null, null, null, null, "Column Definition", null, "Column Datatype", null, null, "Column Constraint", 
    null, "CONSTRAINT Name", null, "FOREIGN KEY Column Constraint", "PRIMARY KEY Column Constraint", "PRIMARY KEY Keyword", "AUTOINCREMENT Keyword", null, "UNIQUE Column Constraint", "NULL Column Constraint", "CHECK Column Constraint", "DEFAULT Column Constraint", null, "COLLATE Column Constraint", "Table Constraint", null, "CHECK Table Constraint", "PRIMARY KEY Table Constraint", null, "PRIMARY KEY Keyword", "UNIQUE Keyword", null, null, null, null, "Indexed Column", null, "Collation", null, "Column Direction", 
    null, "ON CONFLICT Keyword", null, "FOREIGN KEY Table Constraint", "FOREIGN KEY Keyword", null, "REFERENCES Clause", null, null, "FOREIGN KEY Action Clause", null, "FOREIGN KEY Action", null, null, null, null, "DEFERRABLE Clause", null, null, "CREATE INDEX Statement", null, null, "ON Clause", "CREATE TRIGGER Statement", null, "Conditional Clause", null, null, "Conditional Action", null, null, null, null, null, "WHEN Clause", "Actions Clause", null, null, "CREATE VIEW Statement", null, null, null, 
    "CREATE VIRTUAL TABLE Statement", null, null, "Module Arguments", null, null, null, null, "DROP Statement", "DROP Keyword", "DROP Type", "IF EXISTS Keyword", "Or", "Add", "Subtract", "Multiply", "Divide", "Modulo", "Shift Left", "Shift Right", "Logical AND", "Logical OR", "Less Than", "Greater Than", "Less Than Or Equal", "Greater Than Or Equal", "Equal", "Not Equal", "Not Equal", "IS", "Identifier", "Database Identifier", "Function Identifier", "Table Identifier", null, "Column Identifier", 
    null, null, null, "Collation Identifier", "Savepoint Identifier", "Index Identifier", "Trigger Identifier", "View Identifier", "Pragma Identifier", "CTE Identifier", null, "Table Constraint Identifier", "Column Constraint Identifier", "Datatype Name", "TEXT Datatype Name", "REAL Datatype Name", "DOUBLE Datatype Name", "NUMERIC Datatype Name", "INTEGER Datatype Name", null, "BLOB Datatype Name", null, null, null, null, null, null, null, null, null, null, null, "Open Bracket", "Close Bracket", 
    "Open Parenthesis", "Close Parenthesis", "Comma", "Period", "Asterisk", "Question Mark", "Single Quote", "Double Quote", "Backtick", "Tilde", "Plus", "Minus", "Equal", "Ampersand", "Pipe", "Modulo", "Less Than", "Greater Than", "Exclamation", "Semicolon", "Colon", "Forward Slash", "Backslash", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, null, null, "Line Comment", "Block Comment", null, null, null, null, null, "Whitespace", null], Db = "tracer" in A ? A.tracer : new W();
    if ("startRule" in A) {
      if (!(A.startRule in ib)) {
        throw Error("Can't start parsing from rule \"" + A.startRule + '".');
      }
      jb = ib[A.startRule];
    }
    if (cb = L(jb), cb !== Va && Aa === y.length) {
      return cb;
    }
    throw cb !== Va && Aa < y.length && C({type:"end"}), function(k, n, w) {
      return new x(x.buildMessage(k, n), k, n, w);
    }(Lb, Xa < y.length ? y.charAt(Xa) : null, Xa < y.length ? S(Xa, Xa + 1) : S(Xa, Xa));
  }};
}, {}], 2:[function(qa, Ca, va) {
  function x(R, G) {
    for (var y = R.length - 1; 0 <= y; --y) {
      if (G(R[y])) {
        return y;
      }
    }
    return -1;
  }
  function W(R, G) {
    for (var y = R.length, A = 0; A < y; A += 1) {
      if (!G(R[A])) {
        return R.slice(0, A);
      }
    }
    return R;
  }
  Object.defineProperty(va, "__esModule", {value:!0});
  va.Tracer = function() {
    function R() {
      return this instanceof R ? (this.events = [], this.indentation = 0, this.whitespaceRule = /(^whitespace)|(char$)|(^[oe]$)|(^sym_)/i, this.statementRule = /Statement$/i, void(this.firstNodeRule = /(Statement|Clause)$/i)) : new R();
    }
    return R.prototype.trace = function(G) {
      var y = this;
      switch(G.indentation = this.indentation, G.type) {
        case "rule.enter":
          this.events.push(G);
          this.indentation += 1;
          break;
        case "rule.match":
          --this.indentation;
          break;
        case "rule.fail":
          var A = x(this.events, function(E) {
            return E.rule === G.rule;
          });
          var r = x(this.events, function(E) {
            return !y.whitespaceRule.test(E.rule);
          });
          (y.whitespaceRule.test(G.rule) || A === r) && this.events.splice(A, 1);
          --this.indentation;
      }
    }, R.prototype.smartError = function(G) {
      var y, A, r, E, u, T = this, S = {indentation:-1}, C = !1, f = 0, L = this.events.filter(function(Q) {
        return null != Q.description && !T.whitespaceRule.test(Q.rule);
      }).reverse();
      return r = W(L, function(Q) {
        if (/^(sym_semi)$/i.test(Q.rule) && (f += 1), 1 < f) {
          return !1;
        }
        if (C) {
          if (/^(stmt)$/i.test(Q.rule)) {
            return C = !0, !0;
          }
        } else {
          Q.indentation > S.indentation ? S = Q : C = !0;
        }
        return !0;
      }), r.length && (A = S.location, u = r.find(function(Q) {
        return T.firstNodeRule.test(Q.description) && Q.description !== S.description && Q.indentation !== S.indentation;
      }), E = null != u ? this.statementRule.test(S.description) && this.statementRule.test(u.description) ? u.description : S.description + " (" + u.description + ")" : S.description, y = "Syntax error found near " + E, Object.assign(G, {message:y, location:A})), G;
    }, R;
  }();
}, {}], 3:[function(qa, Ca, va) {
  function x(S, C, f) {
    var L;
    return function() {
      var Q = this, N = arguments, H = f && !L;
      clearTimeout(L);
      L = setTimeout(function() {
        L = null;
        f || S.apply(Q, N);
      }, C);
      H && S.apply(Q, N);
    };
  }
  function W(S) {
    return function(C) {
      E.textContent = "Syntax Tree";
      r.className = "right";
      S.setValue(JSON.stringify(C, null, "\t"));
      S.execCommand("selectAll");
      S.execCommand("indentAuto");
      S.setCursor({line:0, ch:0});
    };
  }
  function R(S, C) {
    var f = W(C);
    return function() {
      A(S.getValue(), function(L, Q) {
        L ? (L = (null != L.location ? "[" + L.location.start.line + ", " + L.location.start.column + "] " : "") + L.message, r.className = "alert right", E.textContent = L) : f(Q);
      });
    };
  }
  function G(S) {
    if (window.localStorage) {
      try {
        var C = JSON.parse(window.localStorage.getItem("sqlite-parser-demo"));
        C && null != C.sql && S.setValue(C.sql);
      } catch (f) {
      }
    }
  }
  var y = qa("codemirror"), A = qa("sqlite-parser");
  qa("foldgutter");
  qa("brace-fold");
  qa("panel");
  qa("mode-javascript");
  qa("mode-sql");
  const r = document.getElementById("ast"), E = document.getElementById("ast-header"), u = document.getElementById("sql-text"), T = document.getElementById("ast-text");
  document.addEventListener("DOMContentLoaded", function() {
    /*
    document.getElementById("container").className = "";
    var S = {lineNumbers:!0, theme:"monokai", lineWrapping:!0, tabSize:4, gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]}, C = y.fromTextArea(u, Object.assign({mode:"text/x-plsql"}, S));
    S = y.fromTextArea(T, Object.assign({mode:"application/ld+json", foldGutter:!0, readOnly:!0}, S));
    S = x(R(C, S), 250);
    C.on("change", S);
    G(C);
    S();
    window.onbeforeunload = function() {
      var f = C.getValue();
      "" !== f.trim() && window.localStorage && window.localStorage.setItem("sqlite-parser-demo", JSON.stringify({sql:f}));
    };
    */
  }
  );
}, {"brace-fold":"brace-fold", codemirror:"codemirror", foldgutter:"foldgutter", "mode-javascript":"mode-javascript", "mode-sql":"mode-sql", panel:"panel", "sqlite-parser":"sqlite-parser"}], "brace-fold":[function(qa, Ca, va) {
  !function(x) {
    "object" == typeof va && "object" == typeof Ca ? x(qa("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], x) : x(CodeMirror);
  }(function(x) {
    x.registerHelper("fold", "brace", function(W, R) {
      function G(ra) {
        for (var ha = R.ch, P = 0;;) {
          if (ha = 0 >= ha ? -1 : r.lastIndexOf(ra, ha - 1), -1 != ha) {
            if (1 == P && ha < R.ch) {
              break;
            }
            if (y = W.getTokenTypeAt(x.Pos(A, ha + 1)), !/^(comment|string)/.test(y)) {
              return ha + 1;
            }
            --ha;
          } else {
            if (1 == P) {
              break;
            }
            P = 1;
            ha = r.length;
          }
        }
      }
      var y, A = R.line, r = W.getLine(A), E = "{", u = "}", T = G("{");
      if (null == T && (E = "[", u = "]", T = G("[")), null != T) {
        var S = 1, C = W.lastLine(), f = A;
        a: for (; f <= C; ++f) {
          for (var L = W.getLine(f), Q = f == A ? T : 0;;) {
            var N = L.indexOf(E, Q), H = L.indexOf(u, Q);
            if (0 > N && (N = L.length), 0 > H && (H = L.length), Q = Math.min(N, H), Q == L.length) {
              break;
            }
            if (W.getTokenTypeAt(x.Pos(f, Q + 1)) == y) {
              if (Q == N) {
                ++S;
              } else if (!--S) {
                var J = f;
                var V = Q;
                break a;
              }
            }
            ++Q;
          }
        }
        if (null != J && (A != J || V != T)) {
          return {from:x.Pos(A, T), to:x.Pos(J, V)};
        }
      }
    });
    x.registerHelper("fold", "import", function(W, R) {
      function G(E) {
        if (E < W.firstLine() || E > W.lastLine()) {
          return null;
        }
        var u = W.getTokenAt(x.Pos(E, 1));
        if (/\S/.test(u.string) || (u = W.getTokenAt(x.Pos(E, u.end + 1))), "keyword" != u.type || "import" != u.string) {
          return null;
        }
        var T = E;
        for (E = Math.min(W.lastLine(), E + 10); T <= E; ++T) {
          var S = W.getLine(T).indexOf(";");
          if (-1 != S) {
            return {startCh:u.end, end:x.Pos(T, S)};
          }
        }
      }
      var y;
      R = R.line;
      var A = G(R);
      if (!A || G(R - 1) || (y = G(R - 2)) && y.end.line == R - 1) {
        return null;
      }
      for (y = A.end;;) {
        var r = G(y.line + 1);
        if (null == r) {
          break;
        }
        y = r.end;
      }
      return {from:W.clipPos(x.Pos(R, A.startCh + 1)), to:y};
    });
    x.registerHelper("fold", "include", function(W, R) {
      function G(r) {
        if (r < W.firstLine() || r > W.lastLine()) {
          return null;
        }
        var E = W.getTokenAt(x.Pos(r, 1));
        return /\S/.test(E.string) || (E = W.getTokenAt(x.Pos(r, E.end + 1))), "meta" == E.type && "#include" == E.string.slice(0, 8) ? E.start + 8 : void 0;
      }
      R = R.line;
      var y = G(R);
      if (null == y || null != G(R - 1)) {
        return null;
      }
      for (var A = R; null != G(A + 1);) {
        ++A;
      }
      return {from:x.Pos(R, y + 1), to:W.clipPos(x.Pos(A))};
    });
  });
}, {"../../lib/codemirror":"codemirror"}], codemirror:[function(qa, Ca, va) {
  !function(x) {
    if ("object" == typeof va && "object" == typeof Ca) {
      Ca.exports = x();
    } else {
      if ("function" == typeof define && define.amd) {
        return define([], x);
      }
      (this || window).CodeMirror = x();
    }
  }(function() {
    function x(a, b) {
      if (!(this instanceof x)) {
        return new x(a, b);
      }
      this.options = b = b ? pb(b) : {};
      pb(Yf, b, !1);
      f(b);
      var c = b.value;
      "string" == typeof c && (c = new Za(c, b.mode, null, b.lineSeparator));
      this.doc = c;
      var d = new x.inputStyles[b.inputStyle](this);
      a = this.display = new W(a, c, d);
      a.wrapper.CodeMirror = this;
      u(this);
      r(this);
      b.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap");
      b.autofocus && !Mc && a.input.focus();
      H(this);
      this.state = {keyMaps:[], overlays:[], modeGen:0, overwrite:!1, delayingBlurEvent:!1, focused:!1, suppressEdits:!1, pasteIncoming:!1, cutIncoming:!1, selectingText:!1, draggingText:!1, highlight:new Zb(), keySeq:null, specialChars:null};
      var e = this;
      oa && 11 > Ba && setTimeout(function() {
        e.display.input.reset(!0);
      }, 20);
      Zf(this);
      Ge || ($f(), Ge = !0);
      rc(this);
      this.curOp.forceUpdate = !0;
      He(this, c);
      b.autofocus && !Mc || e.hasFocus() ? setTimeout(Zd($d, this), 20) : Nc(this);
      for (var g in sc) {
        sc.hasOwnProperty(g) && sc[g](this, b[g], Ie);
      }
      P(this);
      b.finishInit && b.finishInit(this);
      for (c = 0; c < ae.length; ++c) {
        ae[c](this);
      }
      tc(this);
      Na && b.lineWrapping && "optimizelegibility" == getComputedStyle(a.lineDiv).textRendering && (a.lineDiv.style.textRendering = "auto");
    }
    function W(a, b, c) {
      this.input = c;
      this.scrollbarFiller = X("div", null, "CodeMirror-scrollbar-filler");
      this.scrollbarFiller.setAttribute("cm-not-content", "true");
      this.gutterFiller = X("div", null, "CodeMirror-gutter-filler");
      this.gutterFiller.setAttribute("cm-not-content", "true");
      this.lineDiv = X("div", null, "CodeMirror-code");
      this.selectionDiv = X("div", null, null, "position: relative; z-index: 1");
      this.cursorDiv = X("div", null, "CodeMirror-cursors");
      this.measure = X("div", null, "CodeMirror-measure");
      this.lineMeasure = X("div", null, "CodeMirror-measure");
      this.lineSpace = X("div", [this.measure, this.lineMeasure, this.selectionDiv, this.cursorDiv, this.lineDiv], null, "position: relative; outline: none");
      this.mover = X("div", [X("div", [this.lineSpace], "CodeMirror-lines")], null, "position: relative");
      this.sizer = X("div", [this.mover], "CodeMirror-sizer");
      this.sizerWidth = null;
      this.heightForcer = X("div", null, null, "position: absolute; height: " + Je + "px; width: 1px;");
      this.gutters = X("div", null, "CodeMirror-gutters");
      this.lineGutter = null;
      this.scroller = X("div", [this.sizer, this.heightForcer, this.gutters], "CodeMirror-scroll");
      this.scroller.setAttribute("tabIndex", "-1");
      this.wrapper = X("div", [this.scrollbarFiller, this.gutterFiller, this.scroller], "CodeMirror");
      oa && 8 > Ba && (this.gutters.style.zIndex = -1, this.scroller.style.paddingRight = 0);
      Na || Pb && Mc || (this.scroller.draggable = !0);
      a && (a.appendChild ? a.appendChild(this.wrapper) : a(this.wrapper));
      this.reportedViewFrom = this.reportedViewTo = this.viewFrom = this.viewTo = b.first;
      this.view = [];
      this.externalMeasured = this.renderedView = null;
      this.lastWrapHeight = this.lastWrapWidth = this.viewOffset = 0;
      this.updateLineNumbers = null;
      this.nativeBarWidth = this.barHeight = this.barWidth = 0;
      this.scrollbarsClipped = !1;
      this.lineNumWidth = this.lineNumInnerWidth = this.lineNumChars = null;
      this.alignWidgets = !1;
      this.maxLine = this.cachedCharWidth = this.cachedTextHeight = this.cachedPaddingH = null;
      this.maxLineLength = 0;
      this.maxLineChanged = !1;
      this.wheelDX = this.wheelDY = this.wheelStartX = this.wheelStartY = null;
      this.shift = !1;
      this.activeTouch = this.selForContextMenu = null;
      c.init(this);
    }
    function R(a) {
      a.doc.mode = x.getMode(a.options, a.doc.modeOption);
      G(a);
    }
    function G(a) {
      a.doc.iter(function(b) {
        b.stateAfter && (b.stateAfter = null);
        b.styles && (b.styles = null);
      });
      a.doc.frontier = a.doc.first;
      $b(a, 100);
      a.state.modeGen++;
      a.curOp && Qa(a);
    }
    function y(a) {
      var b = ac(a.display), c = a.options.lineWrapping, d = c && Math.max(5, a.display.scroller.clientWidth / Oc(a.display) - 3);
      return function(e) {
        if (bc(a.doc, e)) {
          return 0;
        }
        var g = 0;
        if (e.widgets) {
          for (var h = 0; h < e.widgets.length; h++) {
            e.widgets[h].height && (g += e.widgets[h].height);
          }
        }
        return c ? g + (Math.ceil(e.text.length / d) || 1) * b : g + b;
      };
    }
    function A(a) {
      var b = a.doc, c = y(a);
      b.iter(function(d) {
        var e = c(d);
        e != d.height && xb(d, e);
      });
    }
    function r(a) {
      a.display.wrapper.className = a.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + a.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
      Pc(a);
    }
    function E(a) {
      u(a);
      Qa(a);
      setTimeout(function() {
        ha(a);
      }, 20);
    }
    function u(a) {
      var b = a.display.gutters, c = a.options.gutters;
      Qb(b);
      for (var d = 0; d < c.length; ++d) {
        var e = c[d], g = b.appendChild(X("div", null, "CodeMirror-gutter " + e));
        "CodeMirror-linenumbers" == e && (a.display.lineGutter = g, g.style.width = (a.display.lineNumWidth || 1) + "px");
      }
      b.style.display = d ? "" : "none";
      T(a);
    }
    function T(a) {
      a.display.sizer.style.marginLeft = a.display.gutters.offsetWidth + "px";
    }
    function S(a) {
      if (0 == a.height) {
        return 0;
      }
      for (var b, c = a.text.length, d = a; b = cc(d, !0);) {
        b = b.find(0, !0), d = b.from.line, c += b.from.ch - b.to.ch;
      }
      for (d = a; b = cc(d, !1);) {
        b = b.find(0, !0), c -= d.text.length - b.from.ch, d = b.to.line, c += d.text.length - b.to.ch;
      }
      return c;
    }
    function C(a) {
      var b = a.display;
      a = a.doc;
      b.maxLine = Z(a, a.first);
      b.maxLineLength = S(b.maxLine);
      b.maxLineChanged = !0;
      a.iter(function(c) {
        var d = S(c);
        d > b.maxLineLength && (b.maxLineLength = d, b.maxLine = c);
      });
    }
    function f(a) {
      var b = Oa(a.gutters, "CodeMirror-linenumbers");
      -1 == b && a.lineNumbers ? a.gutters = a.gutters.concat(["CodeMirror-linenumbers"]) : -1 < b && !a.lineNumbers && (a.gutters = a.gutters.slice(0), a.gutters.splice(b, 1));
    }
    function L(a) {
      var b = a.display, c = b.gutters.offsetWidth, d = Math.round(a.doc.height + q(a.display));
      return {clientHeight:b.scroller.clientHeight, viewHeight:b.wrapper.clientHeight, scrollWidth:b.scroller.scrollWidth, clientWidth:b.scroller.clientWidth, viewWidth:b.wrapper.clientWidth, barLeft:a.options.fixedGutter ? c : 0, docHeight:d, scrollHeight:d + F(a) + b.barHeight, nativeBarWidth:b.nativeBarWidth, gutterWidth:c};
    }
    function Q(a, b, c) {
      this.cm = c;
      var d = this.vert = X("div", [X("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"), e = this.horiz = X("div", [X("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
      a(d);
      a(e);
      ca(d, "scroll", function() {
        d.clientHeight && b(d.scrollTop, "vertical");
      });
      ca(e, "scroll", function() {
        e.clientWidth && b(e.scrollLeft, "horizontal");
      });
      this.checkedZeroWidth = !1;
      oa && 8 > Ba && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px");
    }
    function N() {
    }
    function H(a) {
      a.display.scrollbars && (a.display.scrollbars.clear(), a.display.scrollbars.addClass && Qc(a.display.wrapper, a.display.scrollbars.addClass));
      a.display.scrollbars = new x.scrollbarModel[a.options.scrollbarStyle](function(b) {
        a.display.wrapper.insertBefore(b, a.display.scrollbarFiller);
        ca(b, "mousedown", function() {
          a.state.focused && setTimeout(function() {
            a.display.input.focus();
          }, 0);
        });
        b.setAttribute("cm-not-content", "true");
      }, function(b, c) {
        "horizontal" == c ? uc(a, b) : Rc(a, b);
      }, a);
      a.display.scrollbars.addClass && Sc(a.display.wrapper, a.display.scrollbars.addClass);
    }
    function J(a, b) {
      b ||= L(a);
      var c = a.display.barWidth, d = a.display.barHeight;
      V(a, b);
      for (b = 0; 4 > b && c != a.display.barWidth || d != a.display.barHeight; b++) {
        c != a.display.barWidth && a.options.lineWrapping && Mb(a), V(a, L(a)), c = a.display.barWidth, d = a.display.barHeight;
      }
    }
    function V(a, b) {
      var c = a.display, d = c.scrollbars.update(b);
      c.sizer.style.paddingRight = (c.barWidth = d.right) + "px";
      c.sizer.style.paddingBottom = (c.barHeight = d.bottom) + "px";
      c.heightForcer.style.borderBottom = d.bottom + "px solid transparent";
      d.right && d.bottom ? (c.scrollbarFiller.style.display = "block", c.scrollbarFiller.style.height = d.bottom + "px", c.scrollbarFiller.style.width = d.right + "px") : c.scrollbarFiller.style.display = "";
      d.bottom && a.options.coverGutterNextToScrollbar && a.options.fixedGutter ? (c.gutterFiller.style.display = "block", c.gutterFiller.style.height = d.bottom + "px", c.gutterFiller.style.width = b.gutterWidth + "px") : c.gutterFiller.style.display = "";
    }
    function ra(a, b, c) {
      var d = c && null != c.top ? Math.max(0, c.top) : a.scroller.scrollTop;
      d = Math.floor(d - a.lineSpace.offsetTop);
      var e = c && null != c.bottom ? c.bottom : d + a.wrapper.clientHeight;
      d = dc(b, d);
      e = dc(b, e);
      if (c && c.ensure) {
        var g = c.ensure.from.line;
        c = c.ensure.to.line;
        g < d ? (d = g, e = dc(b, yb(Z(b, g)) + a.wrapper.clientHeight)) : Math.min(c, b.lastLine()) >= e && (d = dc(b, yb(Z(b, c)) - a.wrapper.clientHeight), e = c);
      }
      return {from:d, to:Math.max(e, d + 1)};
    }
    function ha(a) {
      var b = a.display, c = b.view;
      if (b.alignWidgets || b.gutters.firstChild && a.options.fixedGutter) {
        for (var d = Eb(b) - b.scroller.scrollLeft + a.doc.scrollLeft, e = b.gutters.offsetWidth, g = d + "px", h = 0; h < c.length; h++) {
          if (!c[h].hidden) {
            a.options.fixedGutter && (c[h].gutter && (c[h].gutter.style.left = g), c[h].gutterBackground && (c[h].gutterBackground.style.left = g));
            var l = c[h].alignable;
            if (l) {
              for (var m = 0; m < l.length; m++) {
                l[m].style.left = g;
              }
            }
          }
        }
        a.options.fixedGutter && (b.gutters.style.left = d + e + "px");
      }
    }
    function P(a) {
      if (!a.options.lineNumbers) {
        return !1;
      }
      var b = a.doc;
      b = ob(a.options, b.first + b.size - 1);
      var c = a.display;
      if (b.length != c.lineNumChars) {
        var d = c.measure.appendChild(X("div", [X("div", b)], "CodeMirror-linenumber CodeMirror-gutter-elt")), e = d.firstChild.offsetWidth;
        d = d.offsetWidth - e;
        return c.lineGutter.style.width = "", c.lineNumInnerWidth = Math.max(e, c.lineGutter.offsetWidth - d) + 1, c.lineNumWidth = c.lineNumInnerWidth + d, c.lineNumChars = c.lineNumInnerWidth ? b.length : -1, c.lineGutter.style.width = c.lineNumWidth + "px", T(a), !0;
      }
      return !1;
    }
    function ob(a, b) {
      return String(a.lineNumberFormatter(b + a.firstLineNumber));
    }
    function Eb(a) {
      return a.scroller.getBoundingClientRect().left - a.sizer.getBoundingClientRect().left;
    }
    function cb(a, b, c) {
      var d = a.display;
      this.viewport = b;
      this.visible = ra(d, a.doc, b);
      this.editorIsHidden = !d.wrapper.offsetWidth;
      this.wrapperHeight = d.wrapper.clientHeight;
      this.wrapperWidth = d.wrapper.clientWidth;
      this.oldDisplayWidth = M(a);
      this.force = c;
      this.dims = lb(a);
      this.events = [];
    }
    function Va(a, b) {
      var c = a.display, d = a.doc;
      if (b.editorIsHidden) {
        return Rb(a), !1;
      }
      if (!b.force && b.visible.from >= c.viewFrom && b.visible.to <= c.viewTo && (null == c.updateLineNumbers || c.updateLineNumbers >= c.viewTo) && c.renderedView == c.view && 0 == Ke(a)) {
        return !1;
      }
      P(a) && (Rb(a), b.dims = lb(a));
      var e = d.first + d.size, g = Math.max(b.visible.from - a.options.viewportMargin, d.first), h = Math.min(e, b.visible.to + a.options.viewportMargin);
      c.viewFrom < g && 20 > g - c.viewFrom && (g = Math.max(d.first, c.viewFrom));
      c.viewTo > h && 20 > c.viewTo - h && (h = Math.min(e, c.viewTo));
      Sb && (g = be(a.doc, g), h = Le(a.doc, h));
      d = g != c.viewFrom || h != c.viewTo || c.lastWrapHeight != b.wrapperHeight || c.lastWrapWidth != b.wrapperWidth;
      e = a.display;
      0 == e.view.length || g >= e.viewTo || h <= e.viewFrom ? (e.view = rd(a, g, h), e.viewFrom = g) : (e.viewFrom > g ? e.view = rd(a, g, e.viewFrom).concat(e.view) : e.viewFrom < g && (e.view = e.view.slice(ec(a, g))), e.viewFrom = g, e.viewTo < h ? e.view = e.view.concat(rd(a, e.viewTo, h)) : e.viewTo > h && (e.view = e.view.slice(0, ec(a, h))));
      e.viewTo = h;
      c.viewOffset = yb(Z(a.doc, c.viewFrom));
      a.display.mover.style.top = c.viewOffset + "px";
      h = Ke(a);
      if (!d && 0 == h && !b.force && c.renderedView == c.view && (null == c.updateLineNumbers || c.updateLineNumbers >= c.viewTo)) {
        return !1;
      }
      g = zb();
      return 4 < h && (c.lineDiv.style.display = "none"), Xa(a, c.updateLineNumbers, b.dims), 4 < h && (c.lineDiv.style.display = ""), c.renderedView = c.view, g && zb() != g && g.offsetHeight && g.focus(), Qb(c.cursorDiv), Qb(c.selectionDiv), c.gutters.style.height = c.sizer.style.minHeight = 0, d && (c.lastWrapHeight = b.wrapperHeight, c.lastWrapWidth = b.wrapperWidth, $b(a, 400)), c.updateLineNumbers = null, !0;
    }
    function ib(a, b) {
      for (var c = b.viewport, d = !0; (d && a.options.lineWrapping && b.oldDisplayWidth != M(a) || (c && null != c.top && (c = {top:Math.min(a.doc.height + q(a.display) - Y(a), c.top)}), b.visible = ra(a.display, a.doc, c), !(b.visible.from >= a.display.viewFrom && b.visible.to <= a.display.viewTo))) && Va(a, b); d = !1) {
        Mb(a), d = L(a), qb(a), J(a, d), Ja(a, d);
      }
      b.signal(a, "update", a);
      a.display.viewFrom == a.display.reportedViewFrom && a.display.viewTo == a.display.reportedViewTo || (b.signal(a, "viewportChange", a, a.display.viewFrom, a.display.viewTo), a.display.reportedViewFrom = a.display.viewFrom, a.display.reportedViewTo = a.display.viewTo);
    }
    function jb(a, b) {
      b = new cb(a, b);
      if (Va(a, b)) {
        Mb(a);
        ib(a, b);
        var c = L(a);
        qb(a);
        J(a, c);
        Ja(a, c);
        b.finish();
      }
    }
    function Ja(a, b) {
      a.display.sizer.style.minHeight = b.docHeight + "px";
      a.display.heightForcer.style.top = b.docHeight + "px";
      a.display.gutters.style.height = b.docHeight + a.display.barHeight + F(a) + "px";
    }
    function Mb(a) {
      a = a.display;
      for (var b = a.lineDiv.offsetTop, c = 0; c < a.view.length; c++) {
        var d = a.view[c];
        if (!d.hidden) {
          if (oa && 8 > Ba) {
            var e = d.node.offsetTop + d.node.offsetHeight;
            var g = e - b;
            b = e;
          } else {
            g = d.node.getBoundingClientRect(), g = g.bottom - g.top;
          }
          e = d.line.height - g;
          if (2 > g && (g = ac(a)), (.001 < e || -.001 > e) && (xb(d.line, g), Aa(d.line), d.rest)) {
            for (g = 0; g < d.rest.length; g++) {
              Aa(d.rest[g]);
            }
          }
        }
      }
    }
    function Aa(a) {
      if (a.widgets) {
        for (var b = 0; b < a.widgets.length; ++b) {
          a.widgets[b].height = a.widgets[b].node.parentNode.offsetHeight;
        }
      }
    }
    function lb(a) {
      for (var b = a.display, c = {}, d = {}, e = b.gutters.clientLeft, g = b.gutters.firstChild, h = 0; g; g = g.nextSibling, ++h) {
        c[a.options.gutters[h]] = g.offsetLeft + g.clientLeft + e, d[a.options.gutters[h]] = g.clientWidth;
      }
      return {fixedPos:Eb(b), gutterTotalWidth:b.gutters.offsetWidth, gutterLeft:c, gutterWidth:d, wrapperWidth:b.wrapper.clientWidth};
    }
    function Xa(a, b, c) {
      function d(z) {
        var I = z.nextSibling;
        return Na && rb && a.display.currentWheelTarget == z ? z.style.display = "none" : z.parentNode.removeChild(z), I;
      }
      var e = a.display, g = a.options.lineNumbers, h = e.lineDiv, l = h.firstChild, m = e.view;
      e = e.viewFrom;
      for (var p = 0; p < m.length; p++) {
        var t = m[p];
        if (!t.hidden) {
          if (t.node && t.node.parentNode == h) {
            for (; l != t.node;) {
              l = d(l);
            }
            l = g && null != b && b <= e && t.lineNumber;
            t.changes && (-1 < Oa(t.changes, "gutter") && (l = !1), Lb(a, t, e, c));
            l && (Qb(t.lineNumber), t.lineNumber.appendChild(document.createTextNode(ob(a.options, e))));
            l = t.node.nextSibling;
          } else {
            var v = Db(a, t, e, c);
            h.insertBefore(v, l);
          }
        }
        e += t.size;
      }
      for (; l;) {
        l = d(l);
      }
    }
    function Lb(a, b, c, d) {
      for (var e = 0; e < b.changes.length; e++) {
        var g = b.changes[e];
        if ("text" == g) {
          g = b;
          var h = g.text.className, l = Yb(a, g);
          g.text == g.node && (g.node = l.pre);
          g.text.parentNode.replaceChild(l.pre, g.text);
          g.text = l.pre;
          l.bgClass != g.bgClass || l.textClass != g.textClass ? (g.bgClass = l.bgClass, g.textClass = l.textClass, mb(g)) : h && (g.text.className = h);
        } else {
          if ("gutter" == g) {
            hb(a, b, c, d);
          } else {
            if ("class" == g) {
              mb(b);
            } else {
              if ("widget" == g) {
                h = a;
                l = b;
                var m = d;
                l.alignable && (l.alignable = null);
                for (var p = l.node.firstChild; p; p = g) {
                  g = p.nextSibling, "CodeMirror-linewidget" == p.className && l.node.removeChild(p);
                }
                k(h, l, m);
              }
            }
          }
        }
      }
      b.changes = null;
    }
    function nb(a) {
      return a.node == a.text && (a.node = X("div", null, null, "position: relative"), a.text.parentNode && a.text.parentNode.replaceChild(a.node, a.text), a.node.appendChild(a.text), oa && 8 > Ba && (a.node.style.zIndex = 2)), a.node;
    }
    function Yb(a, b) {
      var c = a.display.externalMeasured;
      return c && c.line == b.line ? (a.display.externalMeasured = null, b.measure = c.measure, c.built) : Me(a, b);
    }
    function mb(a) {
      var b = a.bgClass ? a.bgClass + " " + (a.line.bgClass || "") : a.line.bgClass;
      if (b && (b += " CodeMirror-linebackground"), a.background) {
        b ? a.background.className = b : (a.background.parentNode.removeChild(a.background), a.background = null);
      } else if (b) {
        var c = nb(a);
        a.background = c.insertBefore(X("div", null, b), c.firstChild);
      }
      a.line.wrapClass ? nb(a).className = a.line.wrapClass : a.node != a.text && (a.node.className = "");
      a.text.className = (a.textClass ? a.textClass + " " + (a.line.textClass || "") : a.line.textClass) || "";
    }
    function hb(a, b, c, d) {
      if (b.gutter && (b.node.removeChild(b.gutter), b.gutter = null), b.gutterBackground && (b.node.removeChild(b.gutterBackground), b.gutterBackground = null), b.line.gutterClass) {
        var e = nb(b);
        b.gutterBackground = X("div", null, "CodeMirror-gutter-background " + b.line.gutterClass, "left: " + (a.options.fixedGutter ? d.fixedPos : -d.gutterTotalWidth) + "px; width: " + d.gutterTotalWidth + "px");
        e.insertBefore(b.gutterBackground, b.text);
      }
      var g = b.line.gutterMarkers;
      if (a.options.lineNumbers || g) {
        e = nb(b);
        var h = b.gutter = X("div", null, "CodeMirror-gutter-wrapper", "left: " + (a.options.fixedGutter ? d.fixedPos : -d.gutterTotalWidth) + "px");
        if (a.display.input.setUneditable(h), e.insertBefore(h, b.text), b.line.gutterClass && (h.className += " " + b.line.gutterClass), !a.options.lineNumbers || g && g["CodeMirror-linenumbers"] || (b.lineNumber = h.appendChild(X("div", ob(a.options, c), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + d.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + a.display.lineNumInnerWidth + "px"))), g) {
          for (b = 0; b < a.options.gutters.length; ++b) {
            c = a.options.gutters[b], (e = g.hasOwnProperty(c) && g[c]) && h.appendChild(X("div", [e], "CodeMirror-gutter-elt", "left: " + d.gutterLeft[c] + "px; width: " + d.gutterWidth[c] + "px"));
          }
        }
      }
    }
    function Db(a, b, c, d) {
      var e = Yb(a, b);
      return b.text = b.node = e.pre, e.bgClass && (b.bgClass = e.bgClass), e.textClass && (b.textClass = e.textClass), mb(b), hb(a, b, c, d), k(a, b, d), b.node;
    }
    function k(a, b, c) {
      if (n(a, b.line, b, c, !0), b.rest) {
        for (var d = 0; d < b.rest.length; d++) {
          n(a, b.rest[d], b, c, !1);
        }
      }
    }
    function n(a, b, c, d, e) {
      if (b.widgets) {
        var g = nb(c), h = 0;
        for (b = b.widgets; h < b.length; ++h) {
          var l = b[h], m = X("div", [l.node], "CodeMirror-linewidget");
          l.handleMouseEvents || m.setAttribute("cm-ignore-events", "true");
          var p = l, t = m, v = d;
          if (p.noHScroll) {
            (c.alignable || (c.alignable = [])).push(t);
            var z = v.wrapperWidth;
            t.style.left = v.fixedPos + "px";
            p.coverGutter || (z -= v.gutterTotalWidth, t.style.paddingLeft = v.gutterTotalWidth + "px");
            t.style.width = z + "px";
          }
          p.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", p.noHScroll || (t.style.marginLeft = -v.gutterTotalWidth + "px"));
          a.display.input.setUneditable(m);
          e && l.above ? g.insertBefore(m, c.gutter || c.text) : g.appendChild(m);
          $a(l, "redraw");
        }
      }
    }
    function w(a) {
      return K(a.line, a.ch);
    }
    function B(a, b) {
      return 0 > fa(a, b) ? b : a;
    }
    function ma(a, b) {
      return 0 > fa(a, b) ? a : b;
    }
    function na(a) {
      a.state.focused || (a.display.input.focus(), $d(a));
    }
    function wa(a, b, c, d, e) {
      var g = a.doc;
      a.display.shift = !1;
      d ||= g.sel;
      var h = a.state.pasteIncoming || "paste" == e, l = g.splitLines(b), m = null;
      if (h && 1 < d.ranges.length) {
        if (Wa && Wa.text.join("\n") == b) {
          if (0 == d.ranges.length % Wa.text.length) {
            m = [];
            for (var p = 0; p < Wa.text.length; p++) {
              m.push(g.splitLines(Wa.text[p]));
            }
          }
        } else {
          l.length == d.ranges.length && (m = sd(l, function(I) {
            return [I];
          }));
        }
      }
      for (p = d.ranges.length - 1; 0 <= p; p--) {
        var t = d.ranges[p], v = t.from(), z = t.to();
        t.empty() && (c && 0 < c ? v = K(v.line, v.ch - c) : a.state.overwrite && !h ? z = K(z.line, Math.min(Z(g, z.line).text.length, z.ch + ta(l).length)) : Wa && Wa.lineWise && Wa.text.join("\n") == b && (v = z = K(v.line, 0)));
        t = a.curOp.updateInput;
        v = {from:v, to:z, text:m ? m[p % m.length] : l, origin:e || (h ? "paste" : a.state.cutIncoming ? "cut" : "+input")};
        vc(a.doc, v);
        $a(a, "inputRead", a, v);
      }
      b && !h && Ya(a, b);
      wc(a);
      a.curOp.updateInput = t;
      a.curOp.typing = !0;
      a.state.pasteIncoming = a.state.cutIncoming = !1;
    }
    function ia(a, b) {
      var c = a.clipboardData && a.clipboardData.getData("Text");
      if (c) {
        return a.preventDefault(), b.isReadOnly() || b.options.disableInput || db(b, function() {
          wa(b, c, 0, null, "paste");
        }), !0;
      }
    }
    function Ya(a, b) {
      if (a.options.electricChars && a.options.smartIndent) {
        for (var c = a.doc.sel, d = c.ranges.length - 1; 0 <= d; d--) {
          var e = c.ranges[d];
          if (!(100 < e.head.ch || d && c.ranges[d - 1].head.line == e.head.line)) {
            var g = a.getModeAt(e.head), h = !1;
            if (g.electricChars) {
              for (var l = 0; l < g.electricChars.length; l++) {
                if (-1 < b.indexOf(g.electricChars.charAt(l))) {
                  h = Tc(a, e.head.line, "smart");
                  break;
                }
              }
            } else {
              g.electricInput && g.electricInput.test(Z(a.doc, e.head.line).text.slice(0, e.head.ch)) && (h = Tc(a, e.head.line, "smart"));
            }
            h && $a(a, "electricInput", a, e.head.line);
          }
        }
      }
    }
    function Nb(a) {
      for (var b = [], c = [], d = 0; d < a.doc.sel.ranges.length; d++) {
        var e = a.doc.sel.ranges[d].head.line;
        e = {anchor:K(e, 0), head:K(e + 1, 0)};
        c.push(e);
        b.push(a.getRange(e.anchor, e.head));
      }
      return {text:b, ranges:c};
    }
    function Ob(a, b) {
      a.setAttribute("autocorrect", "off");
      a.setAttribute("autocapitalize", "off");
      a.setAttribute("spellcheck", !!b);
    }
    function fc(a) {
      this.cm = a;
      this.prevInput = "";
      this.pollingFast = !1;
      this.polling = new Zb();
      this.hasSelection = this.inaccurateSelection = !1;
      this.composing = null;
    }
    function eb() {
      var a = X("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"), b = X("div", [a], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
      return Na ? a.style.width = "1000px" : a.setAttribute("wrap", "off"), Uc && (a.style.border = "1px solid black"), Ob(a), b;
    }
    function Vc(a) {
      this.cm = a;
      this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
      this.polling = new Zb();
      this.gracePeriod = !1;
    }
    function xc(a, b) {
      var c = Ra(a, b.line);
      if (!c || c.hidden) {
        return null;
      }
      a = Z(a.doc, b.line);
      c = ja(c, a, b.line);
      a = sb(a);
      var d = "left";
      a && (d = td(a, b.ch) % 2 ? "right" : "left");
      b = Ne(c.map, b.ch, d);
      return b.offset = "right" == b.collapse ? b.end : b.start, b;
    }
    function Tb(a, b) {
      return b && (a.bad = !0), a;
    }
    function gc(a, b, c) {
      var d;
      if (b == a.display.lineDiv) {
        if (d = a.display.lineDiv.childNodes[c], !d) {
          return Tb(a.clipPos(K(a.display.viewTo - 1)), !0);
        }
        b = null;
        c = 0;
      } else {
        for (d = b;; d = d.parentNode) {
          if (!d || d == a.display.lineDiv) {
            return null;
          }
          if (d.parentNode && d.parentNode == a.display.lineDiv) {
            break;
          }
        }
      }
      for (var e = 0; e < a.display.view.length; e++) {
        var g = a.display.view[e];
        if (g.node == d) {
          return ce(g, b, c);
        }
      }
    }
    function ce(a, b, c) {
      function d(t, v, z) {
        for (var I = -1; I < (p ? p.length : 0); I++) {
          for (var O = 0 > I ? m.map : p[I], aa = 0; aa < O.length; aa += 3) {
            var xa = O[aa + 2];
            if (xa == t || xa == v) {
              return v = ya(0 > I ? a.line : a.rest[I]), I = O[aa] + z, (0 > z || xa != t) && (I = O[aa + (z ? 1 : 0)]), K(v, I);
            }
          }
        }
      }
      var e = a.text.firstChild, g = !1;
      if (!b || !de(e, b)) {
        return Tb(K(ya(a.line), 0), !0);
      }
      if (b == e && (g = !0, b = e.childNodes[c], c = 0, !b)) {
        return c = a.rest ? ta(a.rest) : a.line, Tb(K(ya(c), c.text.length), g);
      }
      var h = 3 == b.nodeType ? b : null, l = b;
      for (h || 1 != b.childNodes.length || 3 != b.firstChild.nodeType || (h = b.firstChild, c &&= h.nodeValue.length); l.parentNode != e;) {
        l = l.parentNode;
      }
      var m = a.measure, p = m.maps;
      if (b = d(h, l, c)) {
        return Tb(b, g);
      }
      e = l.nextSibling;
      for (h = h ? h.nodeValue.length - c : 0; e; e = e.nextSibling) {
        if (b = d(e, e.firstChild, 0)) {
          return Tb(K(b.line, b.ch - h), g);
        }
        h += e.textContent.length;
      }
      l = l.previousSibling;
      for (h = c; l; l = l.previousSibling) {
        if (b = d(l, l.firstChild, -1)) {
          return Tb(K(b.line, b.ch + h), g);
        }
        h += l.textContent.length;
      }
    }
    function ee(a, b, c, d, e) {
      function g(t) {
        return function(v) {
          return v.id == t;
        };
      }
      function h(t) {
        if (1 == t.nodeType) {
          var v = t.getAttribute("cm-text");
          if (null != v) {
            return "" == v && (v = t.textContent.replace(/\u200b/g, "")), void(l += v);
          }
          var z;
          if (v = t.getAttribute("cm-marker")) {
            return t = a.findMarks(K(d, 0), K(e + 1, 0), g(+v)), void(t.length && (z = t[0].find()) && (l += hc(a.doc, z.from, z.to).join(p)));
          }
          if ("false" != t.getAttribute("contenteditable")) {
            for (z = 0; z < t.childNodes.length; z++) {
              h(t.childNodes[z]);
            }
            /^(pre|div|p)$/i.test(t.nodeName) && (m = !0);
          }
        } else {
          3 == t.nodeType && (t = t.nodeValue) && (m && (l += p, m = !1), l += t);
        }
      }
      for (var l = "", m = !1, p = a.doc.lineSeparator(); h(b), b != c;) {
        b = b.nextSibling;
      }
      return l;
    }
    function tb(a, b) {
      this.ranges = a;
      this.primIndex = b;
    }
    function sa(a, b) {
      this.anchor = a;
      this.head = b;
    }
    function ab(a, b) {
      b = a[b];
      a.sort(function(l, m) {
        return fa(l.from(), m.from());
      });
      b = Oa(a, b);
      for (var c = 1; c < a.length; c++) {
        var d = a[c], e = a[c - 1];
        if (0 <= fa(e.to(), d.from())) {
          var g = ma(e.from(), d.from()), h = B(e.to(), d.to());
          d = e.empty() ? d.from() == d.head : e.from() == e.head;
          c <= b && --b;
          a.splice(--c, 2, new sa(d ? h : g, d ? g : h));
        }
      }
      return new tb(a, b);
    }
    function Ka(a, b) {
      return new tb([new sa(a, b || a)], 0);
    }
    function ba(a, b) {
      if (b.line < a.first) {
        return K(a.first, 0);
      }
      var c = a.first + a.size - 1;
      b.line > c ? b = K(c, Z(a, c).text.length) : (a = Z(a, b.line).text.length, c = b.ch, b = null == c || c > a ? K(b.line, a) : 0 > c ? K(b.line, 0) : b);
      return b;
    }
    function ic(a, b) {
      return b >= a.first && b < a.first + a.size;
    }
    function Wc(a, b) {
      for (var c = [], d = 0; d < b.length; d++) {
        c[d] = ba(a, b[d]);
      }
      return c;
    }
    function ub(a, b, c, d) {
      return a.cm && a.cm.display.shift || a.extend ? (a = b.anchor, d && (b = 0 > fa(c, a), b != 0 > fa(d, a) ? (a = c, c = d) : b != 0 > fa(c, d) && (c = d)), new sa(a, c)) : new sa(d || c, c);
    }
    function yc(a, b, c, d) {
      Ga(a, new tb([ub(a, a.sel.primary(), b, c)], 0), d);
    }
    function ud(a, b, c) {
      for (var d = [], e = 0; e < a.sel.ranges.length; e++) {
        d[e] = ub(a, a.sel.ranges[e], b[e], null);
      }
      b = ab(d, a.sel.primIndex);
      Ga(a, b, c);
    }
    function Xc(a, b, c, d) {
      var e = a.sel.ranges.slice(0);
      e[b] = c;
      Ga(a, ab(e, a.sel.primIndex), d);
    }
    function Yc(a, b, c) {
      c = {ranges:b.ranges, update:function(d) {
        this.ranges = [];
        for (var e = 0; e < d.length; e++) {
          this.ranges[e] = new sa(ba(a, d[e].anchor), ba(a, d[e].head));
        }
      }, origin:c && c.origin};
      return La(a, "beforeSelectionChange", a, c), a.cm && La(a.cm, "beforeSelectionChange", a.cm, c), c.ranges != b.ranges ? ab(c.ranges, c.ranges.length - 1) : b;
    }
    function vd(a, b, c) {
      var d = a.history.done, e = ta(d);
      e && e.ranges ? (d[d.length - 1] = b, zc(a, b, c)) : Ga(a, b, c);
    }
    function Ga(a, b, c) {
      zc(a, b, c);
      b = a.sel;
      var d = a.cm ? a.cm.curOp.id : NaN, e = a.history, g = c && c.origin, h;
      if (!(h = d == e.lastSelOp) && (h = g && e.lastSelOrigin == g) && !(h = e.lastModTime == e.lastSelTime && e.lastOrigin == g)) {
        h = ta(e.done);
        var l = g.charAt(0);
        h = "*" == l || "+" == l && h.ranges.length == b.ranges.length && h.somethingSelected() == b.somethingSelected() && new Date() - a.history.lastSelTime <= (a.cm ? a.cm.options.historyEventDelay : 500);
      }
      h ? e.done[e.done.length - 1] = b : wd(b, e.done);
      e.lastSelTime = +new Date();
      e.lastSelOrigin = g;
      e.lastSelOp = d;
      c && !1 !== c.clearRedo && Oe(e.undone);
    }
    function zc(a, b, c) {
      (kb(a, "beforeSelectionChange") || a.cm && kb(a.cm, "beforeSelectionChange")) && (b = Yc(a, b, c));
      var d = c && c.bias || (0 > fa(b.primary().head, a.sel.primary().head) ? -1 : 1);
      Ub(a, Fb(a, b, d, !0));
      c && !1 === c.scroll || !a.cm || wc(a.cm);
    }
    function Ub(a, b) {
      b.equals(a.sel) || (a.sel = b, a.cm && (a.cm.curOp.updateInput = a.cm.curOp.selectionChanged = !0, Pe(a.cm)), $a(a, "cursorActivity", a));
    }
    function jc(a) {
      Ub(a, Fb(a, a.sel, null, !1), Ab);
    }
    function Fb(a, b, c, d) {
      for (var e, g = 0; g < b.ranges.length; g++) {
        var h = b.ranges[g], l = b.ranges.length == a.sel.ranges.length && a.sel.ranges[g], m = Vb(a, h.anchor, l && l.anchor, c, d);
        l = Vb(a, h.head, l && l.head, c, d);
        (e || m != h.anchor || l != h.head) && (e ||= b.ranges.slice(0, g), e[g] = new sa(m, l));
      }
      return e ? ab(e, b.primIndex) : b;
    }
    function Gb(a, b, c, d, e) {
      var g = Z(a, b.line);
      if (g.markedSpans) {
        for (var h = 0; h < g.markedSpans.length; ++h) {
          var l = g.markedSpans[h], m = l.marker;
          if ((null == l.from || (m.inclusiveLeft ? l.from <= b.ch : l.from < b.ch)) && (null == l.to || (m.inclusiveRight ? l.to >= b.ch : l.to > b.ch))) {
            if (e && (La(m, "beforeCursorEnter"), m.explicitlyCleared)) {
              if (g.markedSpans) {
                --h;
                continue;
              }
              break;
            }
            if (m.atomic) {
              if (c) {
                var p;
                h = m.find(0 > d ? 1 : -1);
                if ((0 > d ? m.inclusiveRight : m.inclusiveLeft) && (h = Hb(a, h, -d, h && h.line == b.line ? g : null)), h && h.line == b.line && (p = fa(h, c)) && (0 > d ? 0 > p : 0 < p)) {
                  return Gb(a, h, b, d, e);
                }
              }
              c = m.find(0 > d ? -1 : 1);
              return (0 > d ? m.inclusiveLeft : m.inclusiveRight) && (c = Hb(a, c, d, c.line == b.line ? g : null)), c ? Gb(a, c, b, d, e) : null;
            }
          }
        }
      }
      return b;
    }
    function Vb(a, b, c, d, e) {
      d = d || 1;
      return (b = Gb(a, b, c, d, e) || !e && Gb(a, b, c, d, !0) || Gb(a, b, c, -d, e) || !e && Gb(a, b, c, -d, !0)) ? b : (a.cantEdit = !0, K(a.first, 0));
    }
    function Hb(a, b, c, d) {
      return 0 > c && 0 == b.ch ? b.line > a.first ? ba(a, K(b.line - 1)) : null : 0 < c && b.ch == (d || Z(a, b.line)).text.length ? b.line < a.first + a.size - 1 ? K(b.line + 1, 0) : null : new K(b.line, b.ch + c);
    }
    function qb(a) {
      a.display.input.showSelection(a.display.input.prepareSelection());
    }
    function Ac(a, b) {
      for (var c = a.doc, d = {}, e = d.cursors = document.createDocumentFragment(), g = d.selection = document.createDocumentFragment(), h = 0; h < c.sel.ranges.length; h++) {
        if (!1 !== b || h != c.sel.primIndex) {
          var l = c.sel.ranges[h];
          if (!(l.from().line >= a.display.viewTo || l.to().line < a.display.viewFrom)) {
            var m = l.empty();
            (m || a.options.showCursorWhenSelecting) && Zc(a, l.head, e);
            m || Bc(a, l, g);
          }
        }
      }
      return d;
    }
    function Zc(a, b, c) {
      b = Ib(a, b, "div", null, null, !a.options.singleCursorHeightPerLine);
      var d = c.appendChild(X("div", "\u00a0", "CodeMirror-cursor"));
      if (d.style.left = b.left + "px", d.style.top = b.top + "px", d.style.height = Math.max(0, b.bottom - b.top) * a.options.cursorHeight + "px", b.other) {
        a = c.appendChild(X("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor")), a.style.display = "", a.style.left = b.other.left + "px", a.style.top = b.other.top + "px", a.style.height = .85 * (b.other.bottom - b.other.top) + "px";
      }
    }
    function Bc(a, b, c) {
      function d(z, I, O, aa) {
        0 > I && (I = 0);
        I = Math.round(I);
        aa = Math.round(aa);
        l.appendChild(X("div", null, "CodeMirror-selected", "position: absolute; left: " + z + "px; top: " + I + "px; width: " + (null == O ? t - z : O) + "px; height: " + (aa - I) + "px"));
      }
      function e(z, I, O) {
        var aa, xa, Da = Z(h, z), Sa = Da.text.length;
        return ag(sb(Da), I || 0, null == O ? Sa : O, function(pa, da, ka) {
          var ua, za = xd(a, K(z, pa), "div", Da, "left");
          if (pa == da) {
            var la = za;
            ka = ua = za.left;
          } else {
            if (la = xd(a, K(z, da - 1), "div", Da, "right"), "rtl" == ka) {
              ka = za, za = la, la = ka;
            }
            ka = za.left;
            ua = la.right;
          }
          null == I && 0 == pa && (ka = p);
          3 < la.top - za.top && (d(ka, za.top, null, za.bottom), ka = p, za.bottom < la.top && d(ka, za.bottom, null, la.top));
          null == O && da == Sa && (ua = t);
          (!aa || za.top < aa.top || za.top == aa.top && za.left < aa.left) && (aa = za);
          (!xa || la.bottom > xa.bottom || la.bottom == xa.bottom && la.right > xa.right) && (xa = la);
          ka < p + 1 && (ka = p);
          d(ka, la.top, ua - ka, la.bottom);
        }), {start:aa, end:xa};
      }
      var g = a.display, h = a.doc, l = document.createDocumentFragment(), m = D(a.display), p = m.left, t = Math.max(g.sizerWidth, M(a) - g.sizer.offsetLeft) - m.right;
      g = b.from();
      b = b.to();
      if (g.line == b.line) {
        e(g.line, g.ch, b.ch);
      } else {
        var v = Z(h, g.line);
        m = Z(h, b.line);
        m = Bb(v) == Bb(m);
        g = e(g.line, g.ch, m ? v.text.length + 1 : null).end;
        b = e(b.line, m ? 0 : null, b.ch).start;
        m && (g.top < b.top - 2 ? (d(g.right, g.top, null, g.bottom), d(p, b.top, b.left, b.bottom)) : d(g.right, g.top, b.left - g.right, g.bottom));
        g.bottom < b.top && d(p, g.bottom, null, b.top);
      }
      c.appendChild(l);
    }
    function $c(a) {
      if (a.state.focused) {
        var b = a.display;
        clearInterval(b.blinker);
        var c = !0;
        b.cursorDiv.style.visibility = "";
        0 < a.options.cursorBlinkRate ? b.blinker = setInterval(function() {
          b.cursorDiv.style.visibility = (c = !c) ? "" : "hidden";
        }, a.options.cursorBlinkRate) : 0 > a.options.cursorBlinkRate && (b.cursorDiv.style.visibility = "hidden");
      }
    }
    function $b(a, b) {
      a.doc.mode.startState && a.doc.frontier < a.display.viewTo && a.state.highlight.set(b, Zd(fe, a));
    }
    function fe(a) {
      var b = a.doc;
      if (b.frontier < b.first && (b.frontier = b.first), !(b.frontier >= a.display.viewTo)) {
        var c = +new Date() + a.options.workTime, d = Wb(b.mode, kc(a, b.frontier)), e = [];
        b.iter(b.frontier, Math.min(b.first + b.size, a.display.viewTo + 500), function(g) {
          if (b.frontier >= a.display.viewFrom) {
            var h = g.styles, l = g.text.length > a.options.maxHighlightLength, m = Qe(a, g, l ? Wb(b.mode, d) : d, !0);
            g.styles = m.styles;
            var p = g.styleClasses;
            (m = m.classes) ? g.styleClasses = m : p && (g.styleClasses = null);
            p = !h || h.length != g.styles.length || p != m && (!p || !m || p.bgClass != m.bgClass || p.textClass != m.textClass);
            for (m = 0; !p && m < h.length; ++m) {
              p = h[m] != g.styles[m];
            }
            p && e.push(b.frontier);
            g.stateAfter = l ? d : Wb(b.mode, d);
          } else {
            g.text.length <= a.options.maxHighlightLength && ge(a, g.text, d), g.stateAfter = 0 == b.frontier % 5 ? Wb(b.mode, d) : null;
          }
          if (++b.frontier, +new Date() > c) {
            return $b(a, a.options.workDelay), !0;
          }
        });
        e.length && db(a, function() {
          for (var g = 0; g < e.length; g++) {
            Jb(a, e[g], "text");
          }
        });
      }
    }
    function U(a, b, c) {
      for (var d, e, g = a.doc, h = c ? -1 : b - (a.doc.mode.innerMode ? 1E3 : 100); b > h; --b) {
        if (b <= g.first) {
          return g.first;
        }
        var l = Z(g, b - 1);
        if (l.stateAfter && (!c || b <= g.frontier)) {
          return b;
        }
        l = vb(l.text, null, a.options.tabSize);
        (null == e || d > l) && (e = b - 1, d = l);
      }
      return e;
    }
    function kc(a, b, c) {
      var d = a.doc, e = a.display;
      if (!d.mode.startState) {
        return !0;
      }
      var g = U(a, b, c), h = g > d.first && Z(d, g - 1).stateAfter;
      return h = h ? Wb(d.mode, h) : bg(d.mode), d.iter(g, b, function(l) {
        ge(a, l.text, h);
        l.stateAfter = g == b - 1 || 0 == g % 5 || g >= e.viewFrom && g < e.viewTo ? Wb(d.mode, h) : null;
        ++g;
      }), c && (d.frontier = g), h;
    }
    function q(a) {
      return a.mover.offsetHeight - a.lineSpace.offsetHeight;
    }
    function D(a) {
      if (a.cachedPaddingH) {
        return a.cachedPaddingH;
      }
      var b = fb(a.measure, X("pre", "x"));
      b = window.getComputedStyle ? window.getComputedStyle(b) : b.currentStyle;
      b = {left:parseInt(b.paddingLeft), right:parseInt(b.paddingRight)};
      return isNaN(b.left) || isNaN(b.right) || (a.cachedPaddingH = b), b;
    }
    function F(a) {
      return Je - a.display.nativeBarWidth;
    }
    function M(a) {
      return a.display.scroller.clientWidth - F(a) - a.display.barWidth;
    }
    function Y(a) {
      return a.display.scroller.clientHeight - F(a) - a.display.barHeight;
    }
    function ja(a, b, c) {
      if (a.line == b) {
        return {map:a.measure.map, cache:a.measure.cache};
      }
      for (var d = 0; d < a.rest.length; d++) {
        if (a.rest[d] == b) {
          return {map:a.measure.maps[d], cache:a.measure.caches[d]};
        }
      }
      for (d = 0; d < a.rest.length; d++) {
        if (ya(a.rest[d]) > c) {
          return {map:a.measure.maps[d], cache:a.measure.caches[d], before:!0};
        }
      }
    }
    function Ra(a, b) {
      return b >= a.display.viewFrom && b < a.display.viewTo ? a.display.view[ec(a, b)] : (a = a.display.externalMeasured) && b >= a.lineN && b < a.lineN + a.size ? a : void 0;
    }
    function Cc(a, b) {
      var c = ya(b), d = Ra(a, c);
      d && !d.text ? d = null : d && d.changes && (Lb(a, d, c, lb(a)), a.curOp.forceUpdate = !0);
      if (!d) {
        var e = Bb(b);
        d = ya(e);
        e = a.display.externalMeasured = new Re(a.doc, e, d);
        e.lineN = d;
        d = e.built = Me(a, e);
        d = (e.text = d.pre, fb(a.display.lineMeasure, d.pre), e);
      }
      a = ja(d, b, c);
      return {line:b, view:d, rect:null, map:a.map, cache:a.cache, before:a.before, hasHeights:!1};
    }
    function yd(a, b, c, d, e) {
      b.before && (c = -1);
      var g = c + (d || "");
      if (b.cache.hasOwnProperty(g)) {
        a = b.cache[g];
      } else {
        b.rect || (b.rect = b.view.text.getBoundingClientRect());
        if (!b.hasHeights) {
          var h = b.view, l = b.rect, m = a.options.lineWrapping, p = m && M(a);
          if (!h.measure.heights || m && h.measure.width != p) {
            var t = h.measure.heights = [];
            if (m) {
              for (h.measure.width = p, h = h.text.firstChild.getClientRects(), m = 0; m < h.length - 1; m++) {
                p = h[m];
                var v = h[m + 1];
                2 < Math.abs(p.bottom - v.bottom) && t.push((p.bottom + v.top) / 2 - l.top);
              }
            }
            t.push(l.bottom - l.top);
          }
          b.hasHeights = !0;
        }
        t = d;
        var z;
        h = Ne(b.map, c, t);
        d = h.node;
        l = h.start;
        m = h.end;
        c = h.collapse;
        if (3 == d.nodeType) {
          for (var I = 0; 4 > I; I++) {
            for (; l && ad(b.line.text.charAt(h.coverStart + l));) {
              --l;
            }
            for (; h.coverStart + m < h.coverEnd && ad(b.line.text.charAt(h.coverStart + m));) {
              ++m;
            }
            if (oa && 9 > Ba && 0 == l && m == h.coverEnd - h.coverStart) {
              m = d.parentNode.getBoundingClientRect();
            } else {
              m = bd(d, l, m).getClientRects();
              p = Se;
              if ("left" == t) {
                for (v = 0; v < m.length && (p = m[v]).left == p.right; v++) {
                }
              } else {
                for (v = m.length - 1; 0 <= v && (p = m[v]).left == p.right; v--) {
                }
              }
              m = p;
            }
            if (z = m, z.left || z.right || 0 == l) {
              break;
            }
            m = l;
            --l;
            c = "right";
          }
          oa && 11 > Ba && ((I = !window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI) || (null != he ? I = he : (t = fb(a.display.measure, X("span", "x")), I = t.getBoundingClientRect(), t = bd(t, 0, 1).getBoundingClientRect(), I = he = 1 < Math.abs(I.left - t.left)), I = !I), I || (I = screen.logicalXDPI / screen.deviceXDPI, t = screen.logicalYDPI / screen.deviceYDPI, z = {left:z.left * I, right:z.right * I, top:z.top * t, bottom:z.bottom * t}));
        } else {
          0 < l && (c = t = "right"), z = a.options.lineWrapping && 1 < (I = d.getClientRects()).length ? I["right" == t ? I.length - 1 : 0] : d.getBoundingClientRect();
        }
        !(oa && 9 > Ba) || l || z && (z.left || z.right) || (z = (z = d.parentNode.getClientRects()[0]) ? {left:z.left, right:z.left + Oc(a.display), top:z.top, bottom:z.bottom} : Se);
        d = z.top - b.rect.top;
        l = z.bottom - b.rect.top;
        t = (d + l) / 2;
        h = b.view.measure.heights;
        for (I = 0; I < h.length - 1 && !(t < h[I]); I++) {
        }
        c = {left:("right" == c ? z.right : z.left) - b.rect.left, right:("left" == c ? z.left : z.right) - b.rect.left, top:I ? h[I - 1] : 0, bottom:h[I]};
        a = (z.left || z.right || (c.bogus = !0), a.options.singleCursorHeightPerLine || (c.rtop = d, c.rbottom = l), c);
        a.bogus || (b.cache[g] = a);
      }
      return {left:a.left, right:a.right, top:e ? a.rtop : a.top, bottom:e ? a.rbottom : a.bottom};
    }
    function Ne(a, b, c) {
      for (var d, e, g, h, l = 0; l < a.length; l += 3) {
        var m = a[l], p = a[l + 1];
        if (b < m ? (e = 0, g = 1, h = "left") : b < p ? (e = b - m, g = e + 1) : (l == a.length - 3 || b == p && a[l + 3] > b) && (g = p - m, e = g - 1, b >= p && (h = "right")), null != e) {
          if (d = a[l + 2], m == p && c == (d.insertLeft ? "left" : "right") && (h = c), "left" == c && 0 == e) {
            for (; l && a[l - 2] == a[l - 3] && a[l - 1].insertLeft;) {
              d = a[(l -= 3) + 2], h = "left";
            }
          }
          if ("right" == c && e == p - m) {
            for (; l < a.length - 3 && a[l + 3] == a[l + 4] && !a[l + 5].insertLeft;) {
              d = a[(l += 3) + 2], h = "right";
            }
          }
          break;
        }
      }
      return {node:d, start:e, end:g, collapse:h, coverStart:m, coverEnd:p};
    }
    function Te(a) {
      if (a.measure && (a.measure.cache = {}, a.measure.heights = null, a.rest)) {
        for (var b = 0; b < a.rest.length; b++) {
          a.measure.caches[b] = {};
        }
      }
    }
    function Ue(a) {
      a.display.externalMeasure = null;
      Qb(a.display.lineMeasure);
      for (var b = 0; b < a.display.view.length; b++) {
        Te(a.display.view[b]);
      }
    }
    function Pc(a) {
      Ue(a);
      a.display.cachedCharWidth = a.display.cachedTextHeight = a.display.cachedPaddingH = null;
      a.options.lineWrapping || (a.display.maxLineChanged = !0);
      a.display.lineNumChars = null;
    }
    function ie(a, b, c, d) {
      if (b.widgets) {
        for (var e = 0; e < b.widgets.length; ++e) {
          if (b.widgets[e].above) {
            var g = cd(b.widgets[e]);
            c.top += g;
            c.bottom += g;
          }
        }
      }
      if ("line" == d) {
        return c;
      }
      d ||= "local";
      b = yb(b);
      if ("local" == d ? b += a.display.lineSpace.offsetTop : b -= a.display.viewOffset, "page" == d || "window" == d) {
        a = a.display.lineSpace.getBoundingClientRect(), b += a.top + ("window" == d ? 0 : window.pageYOffset || (document.documentElement || document.body).scrollTop), d = a.left + ("window" == d ? 0 : window.pageXOffset || (document.documentElement || document.body).scrollLeft), c.left += d, c.right += d;
      }
      return c.top += b, c.bottom += b, c;
    }
    function Ve(a, b, c) {
      if ("div" == c) {
        return b;
      }
      var d = b.left;
      b = b.top;
      "page" == c ? (d -= window.pageXOffset || (document.documentElement || document.body).scrollLeft, b -= window.pageYOffset || (document.documentElement || document.body).scrollTop) : "local" != c && c || (c = a.display.sizer.getBoundingClientRect(), d += c.left, b += c.top);
      a = a.display.lineSpace.getBoundingClientRect();
      return {left:d - a.left, top:b - a.top};
    }
    function xd(a, b, c, d, e) {
      d ||= Z(a.doc, b.line);
      var g = d;
      b = b.ch;
      d = yd(a, Cc(a, d), b, e);
      return ie(a, g, d, c);
    }
    function Ib(a, b, c, d, e, g) {
      function h(t, v) {
        t = yd(a, e, t, v ? "right" : "left", g);
        return v ? t.left = t.right : t.right = t.left, ie(a, d, t, c);
      }
      function l(t, v) {
        var z = m[v], I = z.level % 2;
        return t == je(z) && v && z.level < m[v - 1].level ? (z = m[--v], t = ke(z) - (z.level % 2 ? 0 : 1), I = !0) : t == ke(z) && v < m.length - 1 && z.level < m[v + 1].level && (z = m[++v], t = je(z) - z.level % 2, I = !1), I && t == z.to && t > z.from ? h(t - 1) : h(t, I);
      }
      d = d || Z(a.doc, b.line);
      e ||= Cc(a, d);
      var m = sb(d);
      b = b.ch;
      if (!m) {
        return h(b);
      }
      var p = td(m, b);
      p = l(b, p);
      return null != dd && (p.other = l(b, dd)), p;
    }
    function We(a, b) {
      var c = 0;
      b = ba(a.doc, b);
      a.options.lineWrapping || (c = Oc(a.display) * b.ch);
      b = Z(a.doc, b.line);
      a = yb(b) + a.display.lineSpace.offsetTop;
      return {left:c, right:c, top:a, bottom:a + b.height};
    }
    function zd(a, b, c, d) {
      a = K(a, b);
      return a.xRel = d, c && (a.outside = !0), a;
    }
    function le(a, b, c) {
      var d = a.doc;
      if (c += a.display.viewOffset, 0 > c) {
        return zd(d.first, 0, !0, -1);
      }
      var e = dc(d, c), g = d.first + d.size - 1;
      if (e > g) {
        return zd(d.first + d.size - 1, Z(d, g).text.length, !0, 1);
      }
      0 > b && (b = 0);
      for (d = Z(d, e);;) {
        e = cg(a, d, e, b, c);
        g = (d = cc(d, !1)) && d.find(0, !0);
        if (!d || !(e.ch > g.from.ch || e.ch == g.from.ch && 0 < e.xRel)) {
          return e;
        }
        e = ya(d = g.to.line);
      }
    }
    function cg(a, b, c, d, e) {
      function g(da) {
        da = Ib(a, K(c, da), "line", b, p);
        return l = !0, h > da.bottom ? da.left - m : h < da.top ? da.left + m : (l = !1, da.left);
      }
      var h = e - yb(b), l = !1, m = 2 * a.display.wrapper.clientWidth, p = Cc(a, b);
      e = sb(b);
      var t = b.text.length, v = Ad(b), z = Bd(b), I = g(v), O = l, aa = g(z), xa = l;
      if (d > aa) {
        return zd(c, z, xa, 1);
      }
      for (;;) {
        if (e ? z == v || z == me(b, v, 1) : 1 >= z - v) {
          t = d < I || d - I <= aa - d ? v : z;
          O = t == v ? O : xa;
          v = d - (t == v ? I : aa);
          xa && !e && !/\s/.test(b.text.charAt(t)) && 0 < v && t < b.text.length && 1 < p.view.measure.heights.length && (e = yd(a, p, t, "right"), h <= e.bottom && h >= e.top && Math.abs(d - e.right) < v && (O = !1, t++, v = d - e.right));
          for (; ad(b.text.charAt(t));) {
            ++t;
          }
          return zd(c, t, O, -1 > v ? -1 : 1 < v ? 1 : 0);
        }
        var Da = Math.ceil(t / 2), Sa = v + Da;
        if (e) {
          Sa = v;
          for (var pa = 0; pa < Da; ++pa) {
            Sa = me(b, Sa, 1);
          }
        }
        pa = g(Sa);
        pa > d ? (z = Sa, aa = pa, (xa = l) && (aa += 1E3), t = Da) : (v = Sa, I = pa, O = l, t -= Da);
      }
    }
    function ac(a) {
      if (null != a.cachedTextHeight) {
        return a.cachedTextHeight;
      }
      if (null == lc) {
        lc = X("pre");
        for (var b = 0; 49 > b; ++b) {
          lc.appendChild(document.createTextNode("x")), lc.appendChild(X("br"));
        }
        lc.appendChild(document.createTextNode("x"));
      }
      fb(a.measure, lc);
      b = lc.offsetHeight / 50;
      return 3 < b && (a.cachedTextHeight = b), Qb(a.measure), b || 1;
    }
    function Oc(a) {
      if (null != a.cachedCharWidth) {
        return a.cachedCharWidth;
      }
      var b = X("span", "xxxxxxxxxx"), c = X("pre", [b]);
      fb(a.measure, c);
      b = b.getBoundingClientRect();
      b = (b.right - b.left) / 10;
      return 2 < b && (a.cachedCharWidth = b), b || 10;
    }
    function rc(a) {
      a.curOp = {cm:a, viewChanged:!1, startHeight:a.doc.height, forceUpdate:!1, updateInput:null, typing:!1, changeObjs:null, cursorActivityHandlers:null, cursorActivityCalled:0, selectionChanged:!1, updateMaxLine:!1, scrollLeft:null, scrollTop:null, scrollToPos:null, focus:!1, id:++dg};
      Dc ? Dc.ops.push(a.curOp) : a.curOp.ownsGroup = Dc = {ops:[a.curOp], delayedCallbacks:[]};
    }
    function tc(a) {
      if (a = a.curOp.ownsGroup) {
        try {
          var b = a.delayedCallbacks, c = 0;
          do {
            for (; c < b.length; c++) {
              b[c].call(null);
            }
            for (var d = 0; d < a.ops.length; d++) {
              var e = a.ops[d];
              if (e.cursorActivityHandlers) {
                for (; e.cursorActivityCalled < e.cursorActivityHandlers.length;) {
                  e.cursorActivityHandlers[e.cursorActivityCalled++].call(null, e.cm);
                }
              }
            }
          } while (c < b.length);
        } finally {
          Dc = null;
          for (b = 0; b < a.ops.length; b++) {
            a.ops[b].cm.curOp = null;
          }
          a = a.ops;
          for (b = 0; b < a.length; b++) {
            e = a[b];
            c = e.cm;
            var g = d = c.display;
            !g.scrollbarsClipped && g.scroller.offsetWidth && (g.nativeBarWidth = g.scroller.offsetWidth - g.scroller.clientWidth, g.heightForcer.style.height = F(c) + "px", g.sizer.style.marginBottom = -g.nativeBarWidth + "px", g.sizer.style.borderRightWidth = F(c) + "px", g.scrollbarsClipped = !0);
            e.updateMaxLine && C(c);
            e.mustUpdate = e.viewChanged || e.forceUpdate || null != e.scrollTop || e.scrollToPos && (e.scrollToPos.from.line < d.viewFrom || e.scrollToPos.to.line >= d.viewTo) || d.maxLineChanged && c.options.lineWrapping;
            e.update = e.mustUpdate && new cb(c, e.mustUpdate && {top:e.scrollTop, ensure:e.scrollToPos}, e.forceUpdate);
          }
          for (b = 0; b < a.length; b++) {
            e = a[b], e.updatedDisplay = e.mustUpdate && Va(e.cm, e.update);
          }
          for (b = 0; b < a.length; b++) {
            e = a[b], c = e.cm, d = c.display, e.updatedDisplay && Mb(c), e.barMeasure = L(c), d.maxLineChanged && !c.options.lineWrapping && (g = d.maxLine.text.length, g = yd(c, Cc(c, d.maxLine), g, void 0), e.adjustWidthTo = g.left + 3, c.display.sizerWidth = e.adjustWidthTo, e.barMeasure.scrollWidth = Math.max(d.scroller.clientWidth, d.sizer.offsetLeft + e.adjustWidthTo + F(c) + c.display.barWidth), e.maxScrollLeft = Math.max(0, d.sizer.offsetLeft + e.adjustWidthTo - M(c))), (e.updatedDisplay || 
            e.selectionChanged) && (e.preparedSelection = d.input.prepareSelection(e.focus));
          }
          for (b = 0; b < a.length; b++) {
            e = a[b], c = e.cm, null != e.adjustWidthTo && (c.display.sizer.style.minWidth = e.adjustWidthTo + "px", e.maxScrollLeft < c.doc.scrollLeft && uc(c, Math.min(c.display.scroller.scrollLeft, e.maxScrollLeft), !0), c.display.maxLineChanged = !1), d = e.focus && e.focus == zb() && (!document.hasFocus || document.hasFocus()), e.preparedSelection && c.display.input.showSelection(e.preparedSelection, d), (e.updatedDisplay || e.startHeight != c.doc.height) && J(c, e.barMeasure), e.updatedDisplay && 
            Ja(c, e.barMeasure), e.selectionChanged && $c(c), c.state.focused && e.updateInput && c.display.input.reset(e.typing), d && na(e.cm);
          }
          for (b = 0; b < a.length; b++) {
            e = a[b];
            c = e.cm;
            d = c.display;
            g = c.doc;
            if (e.updatedDisplay && ib(c, e.update), null == d.wheelStartX || null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos || (d.wheelStartX = d.wheelStartY = null), null == e.scrollTop || d.scroller.scrollTop == e.scrollTop && !e.forceScroll || (g.scrollTop = Math.max(0, Math.min(d.scroller.scrollHeight - d.scroller.clientHeight, e.scrollTop)), d.scrollbars.setScrollTop(g.scrollTop), d.scroller.scrollTop = g.scrollTop), null == e.scrollLeft || d.scroller.scrollLeft == e.scrollLeft && 
            !e.forceScroll || (g.scrollLeft = Math.max(0, Math.min(d.scroller.scrollWidth - d.scroller.clientWidth, e.scrollLeft)), d.scrollbars.setScrollLeft(g.scrollLeft), d.scroller.scrollLeft = g.scrollLeft, ha(c)), e.scrollToPos) {
              var h = ba(g, e.scrollToPos.from);
              var l = ba(g, e.scrollToPos.to);
              var m = e.scrollToPos.margin;
              null == m && (m = 0);
              for (var p = 0; 5 > p; p++) {
                var t = !1, v = Ib(c, h), z = l && l != h ? Ib(c, l) : v;
                z = Cd(c, Math.min(v.left, z.left), Math.min(v.top, z.top) - m, Math.max(v.left, z.left), Math.max(v.bottom, z.bottom) + m);
                var I = c.doc.scrollTop, O = c.doc.scrollLeft;
                if (null != z.scrollTop && (Rc(c, z.scrollTop), 1 < Math.abs(c.doc.scrollTop - I) && (t = !0)), null != z.scrollLeft && (uc(c, z.scrollLeft), 1 < Math.abs(c.doc.scrollLeft - O) && (t = !0)), !t) {
                  break;
                }
              }
              l = v;
              e.scrollToPos.isCursor && c.state.focused && !Ma(c, "scrollCursorIntoView") && (m = c.display, p = m.sizer.getBoundingClientRect(), h = null, (0 > l.top + p.top ? h = !0 : l.bottom + p.top > (window.innerHeight || document.documentElement.clientHeight) && (h = !1), null == h || eg) || (l = X("div", "\u200b", null, "position: absolute; top: " + (l.top - m.viewOffset - c.display.lineSpace.offsetTop) + "px; height: " + (l.bottom - l.top + F(c) + m.barHeight) + "px; left: " + l.left + "px; width: 2px;"), 
              c.display.lineSpace.appendChild(l), l.scrollIntoView(h), c.display.lineSpace.removeChild(l)));
            }
            h = e.maybeHiddenMarkers;
            l = e.maybeUnhiddenMarkers;
            if (h) {
              for (m = 0; m < h.length; ++m) {
                h[m].lines.length || La(h[m], "hide");
              }
            }
            if (l) {
              for (m = 0; m < l.length; ++m) {
                l[m].lines.length && La(l[m], "unhide");
              }
            }
            d.wrapper.offsetHeight && (g.scrollTop = c.display.scroller.scrollTop);
            e.changeObjs && La(c, "changes", c, e.changeObjs);
            e.update && e.update.finish();
          }
        }
      }
    }
    function db(a, b) {
      if (a.curOp) {
        return b();
      }
      rc(a);
      try {
        return b();
      } finally {
        tc(a);
      }
    }
    function Ha(a, b) {
      return function() {
        if (a.curOp) {
          return b.apply(a, arguments);
        }
        rc(a);
        try {
          return b.apply(a, arguments);
        } finally {
          tc(a);
        }
      };
    }
    function Pa(a) {
      return function() {
        if (this.curOp) {
          return a.apply(this, arguments);
        }
        rc(this);
        try {
          return a.apply(this, arguments);
        } finally {
          tc(this);
        }
      };
    }
    function Ta(a) {
      return function() {
        var b = this.cm;
        if (!b || b.curOp) {
          return a.apply(this, arguments);
        }
        rc(b);
        try {
          return a.apply(this, arguments);
        } finally {
          tc(b);
        }
      };
    }
    function Re(a, b, c) {
      for (var d = this.line = b, e; d = cc(d, !1);) {
        d = d.find(1, !0).line, (e ||= []).push(d);
      }
      this.size = (this.rest = e) ? ya(ta(this.rest)) - c + 1 : 1;
      this.node = this.text = null;
      this.hidden = bc(a, b);
    }
    function rd(a, b, c) {
      var d, e = [];
      for (d = b; d < c;) {
        b = new Re(a.doc, Z(a.doc, d), d), d += b.size, e.push(b);
      }
      return e;
    }
    function Qa(a, b, c, d) {
      null == b && (b = a.doc.first);
      null == c && (c = a.doc.first + a.doc.size);
      d ||= 0;
      var e = a.display;
      if (d && c < e.viewTo && (null == e.updateLineNumbers || e.updateLineNumbers > b) && (e.updateLineNumbers = b), a.curOp.viewChanged = !0, b >= e.viewTo) {
        Sb && be(a.doc, b) < e.viewTo && Rb(a);
      } else if (c <= e.viewFrom) {
        Sb && Le(a.doc, c + d) > e.viewFrom ? Rb(a) : (e.viewFrom += d, e.viewTo += d);
      } else if (b <= e.viewFrom && c >= e.viewTo) {
        Rb(a);
      } else if (b <= e.viewFrom) {
        var g = Dd(a, c, c + d, 1);
        g ? (e.view = e.view.slice(g.index), e.viewFrom = g.lineN, e.viewTo += d) : Rb(a);
      } else if (c >= e.viewTo) {
        (g = Dd(a, b, b, -1)) ? (e.view = e.view.slice(0, g.index), e.viewTo = g.lineN) : Rb(a);
      } else {
        g = Dd(a, b, b, -1);
        var h = Dd(a, c, c + d, 1);
        g && h ? (e.view = e.view.slice(0, g.index).concat(rd(a, g.lineN, h.lineN)).concat(e.view.slice(h.index)), e.viewTo += d) : Rb(a);
      }
      (a = e.externalMeasured) && (c < a.lineN ? a.lineN += d : b < a.lineN + a.size && (e.externalMeasured = null));
    }
    function Jb(a, b, c) {
      a.curOp.viewChanged = !0;
      var d = a.display, e = a.display.externalMeasured;
      (e && b >= e.lineN && b < e.lineN + e.size && (d.externalMeasured = null), b < d.viewFrom || b >= d.viewTo) || (a = d.view[ec(a, b)], null != a.node && (a = a.changes || (a.changes = []), -1 == Oa(a, c) && a.push(c)));
    }
    function Rb(a) {
      a.display.viewFrom = a.display.viewTo = a.doc.first;
      a.display.view = [];
      a.display.viewOffset = 0;
    }
    function ec(a, b) {
      if (b >= a.display.viewTo || (b -= a.display.viewFrom, 0 > b)) {
        return null;
      }
      a = a.display.view;
      for (var c = 0; c < a.length; c++) {
        if (b -= a[c].size, 0 > b) {
          return c;
        }
      }
    }
    function Dd(a, b, c, d) {
      var e = ec(a, b), g = a.display.view;
      if (!Sb || c == a.doc.first + a.doc.size) {
        return {index:e, lineN:c};
      }
      for (var h = 0, l = a.display.viewFrom; h < e; h++) {
        l += g[h].size;
      }
      if (l != b) {
        if (0 < d) {
          if (e == g.length - 1) {
            return null;
          }
          b = l + g[e].size - b;
          e++;
        } else {
          b = l - b;
        }
        c += b;
      }
      for (; be(a.doc, c) != c;) {
        if (e == (0 > d ? 0 : g.length - 1)) {
          return null;
        }
        c += d * g[e - (0 > d ? 1 : 0)].size;
        e += d;
      }
      return {index:e, lineN:c};
    }
    function Ke(a) {
      a = a.display.view;
      for (var b = 0, c = 0; c < a.length; c++) {
        var d = a[c];
        d.hidden || d.node && !d.changes || ++b;
      }
      return b;
    }
    function Zf(a) {
      function b() {
        d.activeTouch && (e = setTimeout(function() {
          d.activeTouch = null;
        }, 1e3), g = d.activeTouch, g.end = +new Date());
      }
      function c(l, m) {
        if (null == m.left) {
          return !0;
        }
        var p = m.left - l.left;
        l = m.top - l.top;
        return 400 < p * p + l * l;
      }
      var d = a.display;
      ca(d.scroller, "mousedown", Ha(a, fg));
      oa && 11 > Ba ? ca(d.scroller, "dblclick", Ha(a, function(l) {
        if (!Ma(a, l)) {
          var m = mc(a, l);
          !m || ne(a, l, "gutterClick", !0) || Kb(a.display, l) || (Ua(l), l = a.findWordAt(m), yc(a.doc, l.anchor, l.head));
        }
      })) : ca(d.scroller, "dblclick", function(l) {
        Ma(a, l) || Ua(l);
      });
      oe || ca(d.scroller, "contextmenu", function(l) {
        Xe(a, l);
      });
      var e, g = {end:0};
      ca(d.scroller, "touchstart", function(l) {
        var m;
        if (m = !Ma(a, l)) {
          1 != l.touches.length ? m = !1 : (m = l.touches[0], m = 1 >= m.radiusX && 1 >= m.radiusY), m = !m;
        }
        m && (clearTimeout(e), m = +new Date(), d.activeTouch = {start:m, moved:!1, prev:300 >= m - g.end ? g : null}, 1 == l.touches.length && (d.activeTouch.left = l.touches[0].pageX, d.activeTouch.top = l.touches[0].pageY));
      });
      ca(d.scroller, "touchmove", function() {
        d.activeTouch && (d.activeTouch.moved = !0);
      });
      ca(d.scroller, "touchend", function(l) {
        var m = d.activeTouch;
        if (m && !Kb(d, l) && null != m.left && !m.moved && 300 > new Date() - m.start) {
          var p = a.coordsChar(d.activeTouch, "page");
          m = !m.prev || c(m, m.prev) ? new sa(p, p) : !m.prev.prev || c(m, m.prev.prev) ? a.findWordAt(p) : new sa(K(p.line, 0), ba(a.doc, K(p.line + 1, 0)));
          a.setSelection(m.anchor, m.head);
          a.focus();
          Ua(l);
        }
        b();
      });
      ca(d.scroller, "touchcancel", b);
      ca(d.scroller, "scroll", function() {
        d.scroller.clientHeight && (Rc(a, d.scroller.scrollTop), uc(a, d.scroller.scrollLeft, !0), La(a, "scroll", a));
      });
      ca(d.scroller, "mousewheel", function(l) {
        Ye(a, l);
      });
      ca(d.scroller, "DOMMouseScroll", function(l) {
        Ye(a, l);
      });
      ca(d.wrapper, "scroll", function() {
        d.wrapper.scrollTop = d.wrapper.scrollLeft = 0;
      });
      d.dragFunctions = {enter:function(l) {
        Ma(a, l) || Ed(l);
      }, over:function(l) {
        if (!Ma(a, l)) {
          var m = mc(a, l);
          if (m) {
            var p = document.createDocumentFragment();
            Zc(a, m, p);
            a.display.dragCursor || (a.display.dragCursor = X("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), a.display.lineSpace.insertBefore(a.display.dragCursor, a.display.cursorDiv));
            fb(a.display.dragCursor, p);
          }
          Ed(l);
        }
      }, start:function(l) {
        if (oa && (!a.state.draggingText || 100 > +new Date() - Ze)) {
          Ed(l);
        } else {
          if (!Ma(a, l) && !Kb(a.display, l) && (l.dataTransfer.setData("Text", a.getSelection()), l.dataTransfer.effectAllowed = "copyMove", l.dataTransfer.setDragImage && !$e)) {
            var m = X("img", null, null, "position: fixed; left: 0; top: 0;");
            m.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            wb && (m.width = m.height = 1, a.display.wrapper.appendChild(m), m._top = m.offsetTop);
            l.dataTransfer.setDragImage(m, 0, 0);
            wb && m.parentNode.removeChild(m);
          }
        }
      }, drop:Ha(a, gg), leave:function(l) {
        Ma(a, l) || af(a);
      }};
      var h = d.input.getField();
      ca(h, "keyup", function(l) {
        bf.call(a, l);
      });
      ca(h, "keydown", Ha(a, cf));
      ca(h, "keypress", Ha(a, df));
      ca(h, "focus", function(l) {
        $d(a, l);
      });
      ca(h, "blur", function(l) {
        Nc(a, l);
      });
    }
    function hg(a) {
      var b = a.display;
      b.lastWrapHeight == b.wrapper.clientHeight && b.lastWrapWidth == b.wrapper.clientWidth || (b.cachedCharWidth = b.cachedTextHeight = b.cachedPaddingH = null, b.scrollbarsClipped = !1, a.setSize());
    }
    function Kb(a, b) {
      for (b = b.target || b.srcElement; b != a.wrapper; b = b.parentNode) {
        if (!b || 1 == b.nodeType && "true" == b.getAttribute("cm-ignore-events") || b.parentNode == a.sizer && b != a.mover) {
          return !0;
        }
      }
    }
    function mc(a, b, c, d) {
      var e = a.display;
      if (!c && "true" == (b.target || b.srcElement).getAttribute("cm-not-content")) {
        return null;
      }
      c = e.lineSpace.getBoundingClientRect();
      try {
        var g = b.clientX - c.left;
        var h = b.clientY - c.top;
      } catch (m) {
        return null;
      }
      var l;
      b = le(a, g, h);
      d && 1 == b.xRel && (l = Z(a.doc, b.line).text).length == b.ch && (d = vb(l, l.length, a.options.tabSize) - l.length, b = K(b.line, Math.max(0, Math.round((g - D(a.display).left) / Oc(a.display)) - d)));
      return b;
    }
    function fg(a) {
      var b = this.display;
      if (!(Ma(this, a) || b.activeTouch && b.input.supportsTouch())) {
        if (b.shift = a.shiftKey, Kb(b, a)) {
          return void(Na || (b.scroller.draggable = !1, setTimeout(function() {
            b.scroller.draggable = !0;
          }, 100)));
        }
        if (!ne(this, a, "gutterClick", !0)) {
          var c = mc(this, a);
          switch(window.focus(), ef(a)) {
            case 1:
              this.state.selectingText ? this.state.selectingText(a) : c ? ig(this, a, c) : (a.target || a.srcElement) == b.scroller && Ua(a);
              break;
            case 2:
              Na && (this.state.lastMiddleDown = +new Date());
              c && yc(this.doc, c);
              setTimeout(function() {
                b.input.focus();
              }, 20);
              Ua(a);
              break;
            case 3:
              oe ? Xe(this, a) : jg(this);
          }
        }
      }
    }
    function ig(a, b, c) {
      oa ? setTimeout(Zd(na, a), 0) : a.curOp.focus = zb();
      var d, e = +new Date();
      Fd && Fd.time > e - 400 && 0 == fa(Fd.pos, c) ? d = "triple" : Gd && Gd.time > e - 400 && 0 == fa(Gd.pos, c) ? (d = "double", Fd = {time:e, pos:c}) : (d = "single", Gd = {time:e, pos:c});
      var g;
      e = a.doc.sel;
      var h = rb ? b.metaKey : b.ctrlKey;
      a.options.dragDrop && kg && !a.isReadOnly() && "single" == d && -1 < (g = e.contains(c)) && (0 > fa((g = e.ranges[g]).from(), c) || 0 < c.xRel) && (0 < fa(g.to(), c) || 0 > c.xRel) ? lg(a, b, c, h) : mg(a, b, c, d, h);
    }
    function lg(a, b, c, d) {
      var e = a.display, g = +new Date(), h = Ha(a, function(l) {
        Na && (e.scroller.draggable = !1);
        a.state.draggingText = !1;
        Cb(document, "mouseup", h);
        Cb(e.scroller, "drop", h);
        10 > Math.abs(b.clientX - l.clientX) + Math.abs(b.clientY - l.clientY) && (Ua(l), !d && +new Date() - 200 < g && yc(a.doc, c), Na || oa && 9 == Ba ? setTimeout(function() {
          document.body.focus();
          e.input.focus();
        }, 20) : e.input.focus());
      });
      Na && (e.scroller.draggable = !0);
      a.state.draggingText = h;
      h.copy = rb ? b.altKey : b.ctrlKey;
      e.scroller.dragDrop && e.scroller.dragDrop();
      ca(document, "mouseup", h);
      ca(e.scroller, "drop", h);
    }
    function mg(a, b, c, d, e) {
      function g(da) {
        if (0 != fa(aa, da)) {
          if (aa = da, "rect" == d) {
            var ka = [], ua = a.options.tabSize, za = vb(Z(p, c.line).text, c.ch, ua), la = vb(Z(p, da.line).text, da.ch, ua), Ea = Math.min(za, la);
            za = Math.max(za, la);
            la = Math.min(c.line, da.line);
            for (var Fa = Math.min(a.lastLine(), Math.max(c.line, da.line)); la <= Fa; la++) {
              var Ia = Z(p, la).text, Hd = ff(Ia, Ea, ua);
              Ea == za ? ka.push(new sa(K(la, Hd), K(la, Hd))) : Ia.length > Hd && ka.push(new sa(K(la, Hd), K(la, ff(Ia, za, ua))));
            }
            ka.length || ka.push(new sa(c, c));
            Ga(p, ab(z.ranges.slice(0, v).concat(ka), v), {origin:"*mouse", scroll:!1});
            a.scrollIntoView(da);
          } else {
            ka = t, ua = ka.anchor, Ea = da, "single" != d && (da = "double" == d ? a.findWordAt(da) : new sa(K(da.line, 0), ba(p, K(da.line + 1, 0))), 0 < fa(da.anchor, ua) ? (Ea = da.head, ua = ma(ka.from(), da.anchor)) : (Ea = da.anchor, ua = B(ka.to(), da.head))), ka = z.ranges.slice(0), ka[v] = new sa(ba(p, ua), Ea), Ga(p, ab(ka, v), pe);
          }
        }
      }
      function h(da) {
        var ka = ++Da, ua = mc(a, da, !0, "rect" == d);
        if (ua) {
          if (0 != fa(ua, aa)) {
            a.curOp.focus = zb();
            g(ua);
            var za = ra(m, p);
            (ua.line >= za.to || ua.line < za.from) && setTimeout(Ha(a, function() {
              Da == ka && h(da);
            }), 150);
          } else {
            var la = da.clientY < xa.top ? -20 : da.clientY > xa.bottom ? 20 : 0;
            la && setTimeout(Ha(a, function() {
              Da == ka && (m.scroller.scrollTop += la, h(da));
            }), 50);
          }
        }
      }
      function l(da) {
        a.state.selectingText = !1;
        Da = 1 / 0;
        Ua(da);
        m.input.focus();
        Cb(document, "mousemove", Sa);
        Cb(document, "mouseup", pa);
        p.history.lastSelOrigin = null;
      }
      var m = a.display, p = a.doc;
      Ua(b);
      var t, v, z = p.sel, I = z.ranges;
      if (e && !b.shiftKey ? (v = p.sel.contains(c), t = -1 < v ? I[v] : new sa(c, c)) : (t = p.sel.primary(), v = p.sel.primIndex), ng ? b.shiftKey && b.metaKey : b.altKey) {
        d = "rect", e || (t = new sa(c, c)), c = mc(a, b, !0, !0), v = -1;
      } else if ("double" == d) {
        var O = a.findWordAt(c);
        t = a.display.shift || p.extend ? ub(p, t, O.anchor, O.head) : O;
      } else {
        "triple" == d ? (O = new sa(K(c.line, 0), ba(p, K(c.line + 1, 0))), t = a.display.shift || p.extend ? ub(p, t, O.anchor, O.head) : O) : t = ub(p, t, c);
      }
      e ? -1 == v ? (v = I.length, Ga(p, ab(I.concat([t]), v), {scroll:!1, origin:"*mouse"})) : 1 < I.length && I[v].empty() && "single" == d && !b.shiftKey ? (Ga(p, ab(I.slice(0, v).concat(I.slice(v + 1)), 0), {scroll:!1, origin:"*mouse"}), z = p.sel) : Xc(p, v, t, pe) : (v = 0, Ga(p, new tb([t], 0), pe), z = p.sel);
      var aa = c, xa = m.wrapper.getBoundingClientRect(), Da = 0, Sa = Ha(a, function(da) {
        ef(da) ? h(da) : l(da);
      }), pa = Ha(a, l);
      a.state.selectingText = pa;
      ca(document, "mousemove", Sa);
      ca(document, "mouseup", pa);
    }
    function ne(a, b, c, d) {
      try {
        var e = b.clientX, g = b.clientY;
      } catch (m) {
        return !1;
      }
      if (e >= Math.floor(a.display.gutters.getBoundingClientRect().right)) {
        return !1;
      }
      d && Ua(b);
      d = a.display;
      var h = d.lineDiv.getBoundingClientRect();
      if (g > h.bottom || !kb(a, c)) {
        return qe(b);
      }
      g -= h.top - d.viewOffset;
      for (h = 0; h < a.options.gutters.length; ++h) {
        var l = d.gutters.childNodes[h];
        if (l && l.getBoundingClientRect().right >= e) {
          return e = dc(a.doc, g), La(a, c, a, e, a.options.gutters[h], b), qe(b);
        }
      }
    }
    function gg(a) {
      var b = this;
      if (af(b), !Ma(b, a) && !Kb(b.display, a)) {
        Ua(a);
        oa && (Ze = +new Date());
        var c = mc(b, a, !0), d = a.dataTransfer.files;
        if (c && !b.isReadOnly()) {
          if (d && d.length && window.FileReader && window.File) {
            var e = d.length, g = Array(e), h = 0;
            a = function(p, t) {
              if (!b.options.allowDropFileTypes || -1 != Oa(b.options.allowDropFileTypes, p.type)) {
                var v = new FileReader();
                v.onload = Ha(b, function() {
                  var z = v.result;
                  if (/[\x00-\x08\x0e-\x1f]{2}/.test(z) && (z = ""), g[t] = z, ++h == e) {
                    c = ba(b.doc, c), z = {from:c, to:c, text:b.doc.splitLines(g.join(b.doc.lineSeparator())), origin:"paste"}, vc(b.doc, z), vd(b.doc, Ka(c, nc(z)));
                  }
                });
                v.readAsText(p);
              }
            };
            for (var l = 0; l < e; ++l) {
              a(d[l], l);
            }
          } else {
            if (b.state.draggingText && -1 < b.doc.sel.contains(c)) {
              return b.state.draggingText(a), void setTimeout(function() {
                b.display.input.focus();
              }, 20);
            }
            try {
              if (g = a.dataTransfer.getData("Text")) {
                if (b.state.draggingText && !b.state.draggingText.copy) {
                  var m = b.listSelections();
                }
                if (zc(b.doc, Ka(c, c)), m) {
                  for (l = 0; l < m.length; ++l) {
                    Ec(b.doc, "", m[l].anchor, m[l].head, "drag");
                  }
                }
                b.replaceSelection(g, "around", "paste");
                b.display.input.focus();
              }
            } catch (p) {
            }
          }
        }
      }
    }
    function af(a) {
      a.display.dragCursor && (a.display.lineSpace.removeChild(a.display.dragCursor), a.display.dragCursor = null);
    }
    function Rc(a, b) {
      2 > Math.abs(a.doc.scrollTop - b) || (a.doc.scrollTop = b, Pb || jb(a, {top:b}), a.display.scroller.scrollTop != b && (a.display.scroller.scrollTop = b), a.display.scrollbars.setScrollTop(b), Pb && jb(a), $b(a, 100));
    }
    function uc(a, b, c) {
      (c ? b == a.doc.scrollLeft : 2 > Math.abs(a.doc.scrollLeft - b)) || (b = Math.min(b, a.display.scroller.scrollWidth - a.display.scroller.clientWidth), a.doc.scrollLeft = b, ha(a), a.display.scroller.scrollLeft != b && (a.display.scroller.scrollLeft = b), a.display.scrollbars.setScrollLeft(b));
    }
    function Ye(a, b) {
      var c = gf(b), d = c.x;
      c = c.y;
      var e = a.display, g = e.scroller, h = g.scrollWidth > g.clientWidth, l = g.scrollHeight > g.clientHeight;
      if (d && h || c && l) {
        if (c && rb && Na) {
          h = b.target;
          var m = e.view;
          a: for (; h != g; h = h.parentNode) {
            for (var p = 0; p < m.length; p++) {
              if (m[p].node == h) {
                a.display.currentWheelTarget = h;
                break a;
              }
            }
          }
        }
        if (d && !Pb && !wb && null != gb) {
          return c && l && Rc(a, Math.max(0, Math.min(g.scrollTop + c * gb, g.scrollHeight - g.clientHeight))), uc(a, Math.max(0, Math.min(g.scrollLeft + d * gb, g.scrollWidth - g.clientWidth))), (!c || c && l) && Ua(b), void(e.wheelStartX = null);
        }
        c && null != gb && (b = c * gb, l = a.doc.scrollTop, h = l + e.wrapper.clientHeight, 0 > b ? l = Math.max(0, l + b - 50) : h = Math.min(a.doc.height, h + b + 50), jb(a, {top:l, bottom:h}));
        20 > Id && (null == e.wheelStartX ? (e.wheelStartX = g.scrollLeft, e.wheelStartY = g.scrollTop, e.wheelDX = d, e.wheelDY = c, setTimeout(function() {
          if (null != e.wheelStartX) {
            var t = g.scrollLeft - e.wheelStartX, v = g.scrollTop - e.wheelStartY;
            t = v && e.wheelDY && v / e.wheelDY || t && e.wheelDX && t / e.wheelDX;
            e.wheelStartX = e.wheelStartY = null;
            t && (gb = (gb * Id + t) / (Id + 1), ++Id);
          }
        }, 200)) : (e.wheelDX += d, e.wheelDY += c));
      }
    }
    function Jd(a, b, c) {
      if ("string" == typeof b && (b = Kd[b], !b)) {
        return !1;
      }
      a.display.input.ensurePolled();
      var d = a.display.shift, e = !1;
      try {
        a.isReadOnly() && (a.state.suppressEdits = !0), c && (a.display.shift = !1), e = b(a) != hf;
      } finally {
        a.display.shift = d, a.state.suppressEdits = !1;
      }
      return e;
    }
    function og(a, b, c) {
      for (var d = 0; d < a.state.keyMaps.length; d++) {
        var e = ed(b, a.state.keyMaps[d], c, a);
        if (e) {
          return e;
        }
      }
      return a.options.extraKeys && ed(b, a.options.extraKeys, c, a) || ed(b, a.options.keyMap, c, a);
    }
    function Ld(a, b, c, d) {
      var e = a.state.keySeq;
      if (e) {
        if (pg(b)) {
          return "handled";
        }
        qg.set(50, function() {
          a.state.keySeq == e && (a.state.keySeq = null, a.display.input.reset());
        });
        b = e + " " + b;
      }
      d = og(a, b, d);
      return "multi" == d && (a.state.keySeq = b), "handled" == d && $a(a, "keyHandled", a, b, c), "handled" != d && "multi" != d || (Ua(c), $c(a)), e && !d && /'$/.test(b) ? (Ua(c), !0) : !!d;
    }
    function jf(a, b) {
      var c = rg(b, !0);
      return !!c && (b.shiftKey && !a.state.keySeq ? Ld(a, "Shift-" + c, b, function(d) {
        return Jd(a, d, !0);
      }) || Ld(a, c, b, function(d) {
        if ("string" == typeof d ? /^go[A-Z]/.test(d) : d.motion) {
          return Jd(a, d);
        }
      }) : Ld(a, c, b, function(d) {
        return Jd(a, d);
      }));
    }
    function sg(a, b, c) {
      return Ld(a, "'" + c + "'", b, function(d) {
        return Jd(a, d, !0);
      });
    }
    function cf(a) {
      if (this.curOp.focus = zb(), !Ma(this, a)) {
        oa && 11 > Ba && 27 == a.keyCode && (a.returnValue = !1);
        var b = a.keyCode;
        this.display.shift = 16 == b || a.shiftKey;
        var c = jf(this, a);
        wb && (re = c ? b : null, !c && 88 == b && !kf && (rb ? a.metaKey : a.ctrlKey) && this.replaceSelection("", null, "cut"));
        18 != b || /\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className) || tg(this);
      }
    }
    function tg(a) {
      function b(d) {
        18 != d.keyCode && d.altKey || (Qc(c, "CodeMirror-crosshair"), Cb(document, "keyup", b), Cb(document, "mouseover", b));
      }
      var c = a.display.lineDiv;
      Sc(c, "CodeMirror-crosshair");
      ca(document, "keyup", b);
      ca(document, "mouseover", b);
    }
    function bf(a) {
      16 == a.keyCode && (this.doc.sel.shift = !1);
      Ma(this, a);
    }
    function df(a) {
      if (!(Kb(this.display, a) || Ma(this, a) || a.ctrlKey && !a.altKey || rb && a.metaKey)) {
        var b = a.keyCode, c = a.charCode;
        if (wb && b == re) {
          return re = null, void Ua(a);
        }
        wb && (!a.which || 10 > a.which) && jf(this, a) || (b = String.fromCharCode(null == c ? b : c), sg(this, a, b) || this.display.input.onKeyPress(a));
      }
    }
    function jg(a) {
      a.state.delayingBlurEvent = !0;
      setTimeout(function() {
        a.state.delayingBlurEvent && (a.state.delayingBlurEvent = !1, Nc(a));
      }, 100);
    }
    function $d(a, b) {
      a.state.delayingBlurEvent && (a.state.delayingBlurEvent = !1);
      "nocursor" != a.options.readOnly && (a.state.focused || (La(a, "focus", a, b), a.state.focused = !0, Sc(a.display.wrapper, "CodeMirror-focused"), a.curOp || a.display.selForContextMenu == a.doc.sel || (a.display.input.reset(), Na && setTimeout(function() {
        a.display.input.reset(!0);
      }, 20)), a.display.input.receivedFocus()), $c(a));
    }
    function Nc(a, b) {
      a.state.delayingBlurEvent || (a.state.focused && (La(a, "blur", a, b), a.state.focused = !1, Qc(a.display.wrapper, "CodeMirror-focused")), clearInterval(a.display.blinker), setTimeout(function() {
        a.state.focused || (a.display.shift = !1);
      }, 150));
    }
    function Xe(a, b) {
      var c;
      (c = Kb(a.display, b)) || (c = !!kb(a, "gutterContextMenu") && ne(a, b, "gutterContextMenu", !1));
      c || Ma(a, b, "contextmenu") || a.display.input.onContextMenu(b);
    }
    function lf(a, b) {
      if (0 > fa(a, b.from)) {
        return a;
      }
      if (0 >= fa(a, b.to)) {
        return nc(b);
      }
      var c = a.line + b.text.length - (b.to.line - b.from.line) - 1, d = a.ch;
      return a.line == b.to.line && (d += nc(b).ch - b.to.ch), K(c, d);
    }
    function se(a, b) {
      for (var c = [], d = 0; d < a.sel.ranges.length; d++) {
        var e = a.sel.ranges[d];
        c.push(new sa(lf(e.anchor, b), lf(e.head, b)));
      }
      return ab(c, a.sel.primIndex);
    }
    function mf(a, b, c) {
      return a.line == b.line ? K(c.line, a.ch - b.ch + c.ch) : K(c.line + (a.line - b.line), a.ch);
    }
    function nf(a, b, c) {
      b = {canceled:!1, from:b.from, to:b.to, text:b.text, origin:b.origin, cancel:function() {
        this.canceled = !0;
      }};
      return c && (b.update = function(d, e, g, h) {
        d && (this.from = ba(a, d));
        e && (this.to = ba(a, e));
        g && (this.text = g);
        void 0 !== h && (this.origin = h);
      }), La(a, "beforeChange", a, b), a.cm && La(a.cm, "beforeChange", a.cm, b), b.canceled ? null : {from:b.from, to:b.to, text:b.text, origin:b.origin};
    }
    function vc(a, b, c) {
      if (a.cm) {
        if (!a.cm.curOp) {
          return Ha(a.cm, vc)(a, b, c);
        }
        if (a.cm.state.suppressEdits) {
          return;
        }
      }
      if (!(kb(a, "beforeChange") || a.cm && kb(a.cm, "beforeChange")) || (b = nf(a, b, !0))) {
        if (c = of && !c && ug(a, b.from, b.to)) {
          for (var d = c.length - 1; 0 <= d; --d) {
            pf(a, {from:c[d].from, to:c[d].to, text:d ? [""] : b.text});
          }
        } else {
          pf(a, b);
        }
      }
    }
    function pf(a, b) {
      if (1 != b.text.length || "" != b.text[0] || 0 != fa(b.from, b.to)) {
        var c = se(a, b);
        qf(a, b, c, a.cm ? a.cm.curOp.id : NaN);
        fd(a, b, c, te(a, b));
        var d = [];
        oc(a, function(e, g) {
          g || -1 != Oa(d, e.history) || (rf(e.history, b), d.push(e.history));
          fd(e, b, null, te(e, b));
        });
      }
    }
    function Md(a, b, c) {
      if (!a.cm || !a.cm.state.suppressEdits || c) {
        for (var d, e = a.history, g = a.sel, h = "undo" == b ? e.done : e.undone, l = "undo" == b ? e.undone : e.done, m = 0; m < h.length && (d = h[m], c ? !d.ranges || d.equals(a.sel) : d.ranges); m++) {
        }
        if (m != h.length) {
          for (e.lastOrigin = e.lastSelOrigin = null; d = h.pop(), d.ranges;) {
            if (wd(d, l), c && !d.equals(a.sel)) {
              return void Ga(a, d, {clearRedo:!1});
            }
            g = d;
          }
          c = [];
          wd(g, l);
          l.push({changes:c, generation:e.generation});
          e.generation = d.generation || ++e.maxGeneration;
          e = kb(a, "beforeChange") || a.cm && kb(a.cm, "beforeChange");
          for (m = d.changes.length - 1; 0 <= m; --m) {
            var p = d.changes[m];
            if (p.origin = b, e && !nf(a, p, !1)) {
              return void(h.length = 0);
            }
            c.push(ue(a, p));
            g = m ? se(a, p) : ta(h);
            fd(a, p, g, sf(a, p));
            !m && a.cm && a.cm.scrollIntoView({from:p.from, to:nc(p)});
            var t = [];
            oc(a, function(v, z) {
              z || -1 != Oa(t, v.history) || (rf(v.history, p), t.push(v.history));
              fd(v, p, null, sf(v, p));
            });
          }
        }
      }
    }
    function tf(a, b) {
      if (0 != b && (a.first += b, a.sel = new tb(sd(a.sel.ranges, function(e) {
        return new sa(K(e.anchor.line + b, e.anchor.ch), K(e.head.line + b, e.head.ch));
      }), a.sel.primIndex), a.cm)) {
        Qa(a.cm, a.first, a.first - b, b);
        for (var c = a.cm.display, d = c.viewFrom; d < c.viewTo; d++) {
          Jb(a.cm, d, "gutter");
        }
      }
    }
    function fd(a, b, c, d) {
      if (a.cm && !a.cm.curOp) {
        return Ha(a.cm, fd)(a, b, c, d);
      }
      if (b.to.line < a.first) {
        return void tf(a, b.text.length - 1 - (b.to.line - b.from.line));
      }
      if (!(b.from.line > a.lastLine())) {
        if (b.from.line < a.first) {
          var e = b.text.length - 1 - (a.first - b.from.line);
          tf(a, e);
          b = {from:K(a.first, 0), to:K(b.to.line + e, b.to.ch), text:[ta(b.text)], origin:b.origin};
        }
        e = a.lastLine();
        b.to.line > e && (b = {from:b.from, to:K(e, Z(a, e).text.length), text:[b.text[0]], origin:b.origin});
        b.removed = hc(a, b.from, b.to);
        c ||= se(a, b);
        a.cm ? vg(a.cm, b, d) : ve(a, b, d);
        zc(a, c, Ab);
      }
    }
    function vg(a, b, c) {
      var d = a.doc, e = a.display, g = b.from, h = b.to, l = !1, m = g.line;
      a.options.lineWrapping || (m = ya(Bb(Z(d, g.line))), d.iter(m, h.line + 1, function(p) {
        if (p == e.maxLine) {
          return l = !0, !0;
        }
      }));
      -1 < d.sel.contains(b.from, b.to) && Pe(a);
      ve(d, b, c, y(a));
      a.options.lineWrapping || (d.iter(m, g.line + b.text.length, function(p) {
        var t = S(p);
        t > e.maxLineLength && (e.maxLine = p, e.maxLineLength = t, e.maxLineChanged = !0, l = !1);
      }), l && (a.curOp.updateMaxLine = !0));
      d.frontier = Math.min(d.frontier, g.line);
      $b(a, 400);
      c = b.text.length - (h.line - g.line) - 1;
      b.full ? Qa(a) : g.line != h.line || 1 != b.text.length || uf(a.doc, b) ? Qa(a, g.line, h.line + 1, c) : Jb(a, g.line, "text");
      c = kb(a, "changes");
      if ((d = kb(a, "change")) || c) {
        b = {from:g, to:h, text:b.text, removed:b.removed, origin:b.origin}, d && $a(a, "change", a, b), c && (a.curOp.changeObjs || (a.curOp.changeObjs = [])).push(b);
      }
      a.display.selForContextMenu = null;
    }
    function Ec(a, b, c, d, e) {
      if (d ||= c, 0 > fa(d, c)) {
        var g = d;
        d = c;
        c = g;
      }
      "string" == typeof b && (b = a.splitLines(b));
      vc(a, {from:c, to:d, text:b, origin:e});
    }
    function Cd(a, b, c, d, e) {
      var g = a.display, h = ac(a.display);
      0 > c && (c = 0);
      var l = a.curOp && null != a.curOp.scrollTop ? a.curOp.scrollTop : g.scroller.scrollTop, m = Y(a), p = {};
      e - c > m && (e = c + m);
      var t = a.doc.height + q(g), v = c < h;
      h = e > t - h;
      c < l ? p.scrollTop = v ? 0 : c : e > l + m && (c = Math.min(c, (h ? t : e) - m), c != l && (p.scrollTop = c));
      l = a.curOp && null != a.curOp.scrollLeft ? a.curOp.scrollLeft : g.scroller.scrollLeft;
      a = M(a) - (a.options.fixedGutter ? g.gutters.offsetWidth : 0);
      g = d - b > a;
      return g && (d = b + a), 10 > b ? p.scrollLeft = 0 : b < l ? p.scrollLeft = Math.max(0, b - (g ? 0 : 10)) : d > a + l - 3 && (p.scrollLeft = d + (g ? 0 : 10) - a), p;
    }
    function Nd(a, b, c) {
      null == b && null == c || Od(a);
      null != b && (a.curOp.scrollLeft = (null == a.curOp.scrollLeft ? a.doc.scrollLeft : a.curOp.scrollLeft) + b);
      null != c && (a.curOp.scrollTop = (null == a.curOp.scrollTop ? a.doc.scrollTop : a.curOp.scrollTop) + c);
    }
    function wc(a) {
      Od(a);
      var b = a.getCursor(), c = b, d = b;
      a.options.lineWrapping || (c = b.ch ? K(b.line, b.ch - 1) : b, d = K(b.line, b.ch + 1));
      a.curOp.scrollToPos = {from:c, to:d, margin:a.options.cursorScrollMargin, isCursor:!0};
    }
    function Od(a) {
      var b = a.curOp.scrollToPos;
      if (b) {
        a.curOp.scrollToPos = null;
        var c = We(a, b.from), d = We(a, b.to);
        b = Cd(a, Math.min(c.left, d.left), Math.min(c.top, d.top) - b.margin, Math.max(c.right, d.right), Math.max(c.bottom, d.bottom) + b.margin);
        a.scrollTo(b.scrollLeft, b.scrollTop);
      }
    }
    function Tc(a, b, c, d) {
      var e, g = a.doc;
      null == c && (c = "add");
      "smart" == c && (g.mode.indent ? e = kc(a, b) : c = "prev");
      var h = a.options.tabSize, l = Z(g, b), m = vb(l.text, null, h);
      l.stateAfter && (l.stateAfter = null);
      var p, t = l.text.match(/^\s*/)[0];
      if (d || /\S/.test(l.text)) {
        if ("smart" == c && (p = g.mode.indent(e, l.text.slice(t.length), l.text), p == hf || 150 < p)) {
          if (!d) {
            return;
          }
          c = "prev";
        }
      } else {
        p = 0, c = "not";
      }
      "prev" == c ? p = b > g.first ? vb(Z(g, b - 1).text, null, h) : 0 : "add" == c ? p = m + a.options.indentUnit : "subtract" == c ? p = m - a.options.indentUnit : "number" == typeof c && (p = m + c);
      p = Math.max(0, p);
      c = "";
      d = 0;
      if (a.options.indentWithTabs) {
        for (a = Math.floor(p / h); a; --a) {
          d += h, c += "\t";
        }
      }
      if (d < p && (c += we(p - d)), c != t) {
        return Ec(g, c, K(b, 0), K(b, t.length), "+input"), l.stateAfter = null, !0;
      }
      for (a = 0; a < g.sel.ranges.length; a++) {
        if (h = g.sel.ranges[a], h.head.line == b && h.head.ch < t.length) {
          d = K(b, t.length);
          Xc(g, a, new sa(d, d));
          break;
        }
      }
    }
    function Pd(a, b, c, d) {
      var e = b, g = b;
      return "number" == typeof b ? g = Z(a, Math.max(a.first, Math.min(b, a.first + a.size - 1))) : e = ya(b), null == e ? null : (d(g, e) && a.cm && Jb(a.cm, e, c), g);
    }
    function Fc(a, b) {
      for (var c = a.doc.sel.ranges, d = [], e = 0; e < c.length; e++) {
        for (var g = b(c[e]); d.length && 0 >= fa(g.from, ta(d).to);) {
          var h = d.pop();
          if (0 > fa(h.from, g.from)) {
            g.from = h.from;
            break;
          }
        }
        d.push(g);
      }
      db(a, function() {
        for (var l = d.length - 1; 0 <= l; l--) {
          Ec(a.doc, "", d[l].from, d[l].to, "+delete");
        }
        wc(a);
      });
    }
    function xe(a, b, c, d, e) {
      function g(O) {
        var aa = (e ? me : vf)(p, l, c, !0);
        if (null == aa) {
          O || (O = h + c, O = !(!(O < a.first || O >= a.first + a.size) && (h = O, p = Z(a, O))));
          if (O) {
            return !1;
          }
          l = e ? (0 > c ? Bd : Ad)(p) : 0 > c ? p.text.length : 0;
        } else {
          l = aa;
        }
        return !0;
      }
      var h = b.line, l = b.ch, m = c, p = Z(a, h);
      if ("char" == d) {
        g();
      } else if ("column" == d) {
        g(!0);
      } else if ("word" == d || "group" == d) {
        var t = null;
        d = "group" == d;
        for (var v = a.cm && a.cm.getHelper(b, "wordChars"), z = !0; !(0 > c) || g(!z); z = !1) {
          var I = p.text.charAt(l) || "\n";
          I = Qd(I, v) ? "w" : d && "\n" == I ? "n" : !d || /\s/.test(I) ? null : "p";
          if (!d || z || I || (I = "s"), t && t != I) {
            0 > c && (c = 1, g());
            break;
          }
          if (I && (t = I), 0 < c && !g(!z)) {
            break;
          }
        }
      }
      m = Vb(a, K(h, l), b, m, !0);
      return fa(b, m) || (m.hitSide = !0), m;
    }
    function wf(a, b, c, d) {
      var e = a.doc, g = b.left;
      if ("page" == d) {
        var h = Math.max(Math.min(a.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight) - .5 * ac(a.display), 3);
        h = (0 < c ? b.bottom : b.top) + c * h;
      } else {
        "line" == d && (h = 0 < c ? b.bottom + 3 : b.top - 3);
      }
      for (;;) {
        b = le(a, g, h);
        if (!b.outside) {
          break;
        }
        if (0 > c ? 0 >= h : h >= e.height) {
          b.hitSide = !0;
          break;
        }
        h += 5 * c;
      }
      return b;
    }
    function ea(a, b, c, d) {
      x.defaults[a] = b;
      c && (sc[a] = d ? function(e, g, h) {
        h != Ie && c(e, g, h);
      } : c);
    }
    function wg(a) {
      var b = a.split(/-(?!$)/);
      a = b[b.length - 1];
      for (var c = 0; c < b.length - 1; c++) {
        var d = b[c];
        if (/^(cmd|meta|m)$/i.test(d)) {
          var e = !0;
        } else if (/^a(lt)?$/i.test(d)) {
          var g = !0;
        } else if (/^(c|ctrl|control)$/i.test(d)) {
          var h = !0;
        } else {
          if (!/^s(hift)$/i.test(d)) {
            throw Error("Unrecognized modifier name: " + d);
          }
          var l = !0;
        }
      }
      return g && (a = "Alt-" + a), h && (a = "Ctrl-" + a), e && (a = "Cmd-" + a), l && (a = "Shift-" + a), a;
    }
    function Rd(a) {
      return "string" == typeof a ? Xb[a] : a;
    }
    function Gc(a, b, c, d, e) {
      if (d && d.shared) {
        return xg(a, b, c, d, e);
      }
      if (a.cm && !a.cm.curOp) {
        return Ha(a.cm, Gc)(a, b, c, d, e);
      }
      var g = new pc(a, e);
      e = fa(b, c);
      if (d && pb(d, g, !1), 0 < e || 0 == e && !1 !== g.clearWhenEmpty) {
        return g;
      }
      if (g.replacedWith && (g.collapsed = !0, g.widgetNode = X("span", [g.replacedWith], "CodeMirror-widget"), d.handleMouseEvents || g.widgetNode.setAttribute("cm-ignore-events", "true"), d.insertLeft && (g.widgetNode.insertLeft = !0)), g.collapsed) {
        if (xf(a, b.line, b, c, g) || b.line != c.line && xf(a, c.line, b, c, g)) {
          throw Error("Inserting collapsed marker partially overlapping an existing one");
        }
        Sb = !0;
      }
      g.addToHistory && qf(a, {from:b, to:c, origin:"markText"}, a.sel, NaN);
      var h, l = b.line, m = a.cm;
      if (a.iter(l, c.line + 1, function(p) {
        m && g.collapsed && !m.options.lineWrapping && Bb(p) == m.display.maxLine && (h = !0);
        g.collapsed && l != b.line && xb(p, 0);
        var t = new Sd(g, l == b.line ? b.ch : null, l == c.line ? c.ch : null);
        p.markedSpans = p.markedSpans ? p.markedSpans.concat([t]) : [t];
        t.marker.attachLine(p);
        ++l;
      }), g.collapsed && a.iter(b.line, c.line + 1, function(p) {
        bc(a, p) && xb(p, 0);
      }), g.clearOnEnter && ca(g, "beforeCursorEnter", function() {
        g.clear();
      }), g.readOnly && (of = !0, (a.history.done.length || a.history.undone.length) && a.clearHistory()), g.collapsed && (g.id = ++ye, g.atomic = !0), m) {
        if (h && (m.curOp.updateMaxLine = !0), g.collapsed) {
          Qa(m, b.line, c.line + 1);
        } else if (g.className || g.title || g.startStyle || g.endStyle || g.css) {
          for (d = b.line; d <= c.line; d++) {
            Jb(m, d, "text");
          }
        }
        g.atomic && jc(m.doc);
        $a(m, "markerAdded", m, g);
      }
      return g;
    }
    function xg(a, b, c, d, e) {
      d = pb(d);
      d.shared = !1;
      var g = [Gc(a, b, c, d, e)], h = g[0], l = d.widgetNode;
      return oc(a, function(m) {
        l && (d.widgetNode = l.cloneNode(!0));
        g.push(Gc(m, ba(m, b), ba(m, c), d, e));
        for (var p = 0; p < m.linked.length; ++p) {
          if (m.linked[p].isParent) {
            return;
          }
        }
        h = ta(g);
      }), new Td(g, h);
    }
    function yf(a) {
      return a.findMarks(K(a.first, 0), a.clipPos(K(a.lastLine())), function(b) {
        return b.parent;
      });
    }
    function yg(a) {
      for (var b = 0; b < a.length; b++) {
        var c = a[b], d = [c.primary.doc];
        oc(c.primary.doc, function(h) {
          d.push(h);
        });
        for (var e = 0; e < c.markers.length; e++) {
          var g = c.markers[e];
          -1 == Oa(d, g.doc) && (g.parent = null, c.markers.splice(e--, 1));
        }
      }
    }
    function Sd(a, b, c) {
      this.marker = a;
      this.from = b;
      this.to = c;
    }
    function gd(a, b) {
      if (a) {
        for (var c = 0; c < a.length; ++c) {
          var d = a[c];
          if (d.marker == b) {
            return d;
          }
        }
      }
    }
    function te(a, b) {
      if (b.full) {
        return null;
      }
      var c = ic(a, b.from.line) && Z(a, b.from.line).markedSpans, d = ic(a, b.to.line) && Z(a, b.to.line).markedSpans;
      if (!c && !d) {
        return null;
      }
      a = b.from.ch;
      var e = b.to.ch, g = 0 == fa(b.from, b.to);
      if (c) {
        for (var h, l = 0; l < c.length; ++l) {
          var m = c[l], p = m.marker;
          if (null == m.from || (p.inclusiveLeft ? m.from <= a : m.from < a) || !(m.from != a || "bookmark" != p.type || g && m.marker.insertLeft)) {
            var t = null == m.to || (p.inclusiveRight ? m.to >= a : m.to > a);
            (h ||= []).push(new Sd(p, m.from, t ? null : m.to));
          }
        }
      }
      c = h;
      var v;
      if (d) {
        for (h = 0; h < d.length; ++h) {
          if (l = d[h], m = l.marker, null == l.to || (m.inclusiveRight ? l.to >= e : l.to > e) || l.from == e && "bookmark" == m.type && (!g || l.marker.insertLeft)) {
            p = null == l.from || (m.inclusiveLeft ? l.from <= e : l.from < e), (v ||= []).push(new Sd(m, p ? null : l.from - e, null == l.to ? null : l.to - e));
          }
        }
      }
      e = 1 == b.text.length;
      g = ta(b.text).length + (e ? a : 0);
      if (c) {
        for (d = 0; d < c.length; ++d) {
          h = c[d], null == h.to && ((l = gd(v, h.marker)) ? e && (h.to = null == l.to ? null : l.to + g) : h.to = a);
        }
      }
      if (v) {
        for (d = 0; d < v.length; ++d) {
          h = v[d], (null != h.to && (h.to += g), null == h.from) ? (l = gd(c, h.marker)) || (h.from = g, e && (c ||= []).push(h)) : (h.from += g, e && (c ||= []).push(h));
        }
      }
      c &&= zf(c);
      v && v != c && (v = zf(v));
      a = [c];
      if (!e) {
        var z;
        b = b.text.length - 2;
        if (0 < b && c) {
          for (d = 0; d < c.length; ++d) {
            null == c[d].to && (z ||= []).push(new Sd(c[d].marker, null, null));
          }
        }
        for (d = 0; d < b; ++d) {
          a.push(z);
        }
        a.push(v);
      }
      return a;
    }
    function zf(a) {
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        null != c.from && c.from == c.to && !1 !== c.marker.clearWhenEmpty && a.splice(b--, 1);
      }
      return a.length ? a : null;
    }
    function sf(a, b) {
      var c;
      if (c = b["spans_" + a.id]) {
        for (var d = 0, e = []; d < b.text.length; ++d) {
          var g = e, h = g.push;
          var l = void 0;
          var m = c[d];
          if (m) {
            for (var p = 0; p < m.length; ++p) {
              m[p].marker.explicitlyCleared ? l ||= m.slice(0, p) : l && l.push(m[p]);
            }
            l = l ? l.length ? l : null : m;
          } else {
            l = null;
          }
          h.call(g, l);
        }
        c = e;
      } else {
        c = null;
      }
      a = te(a, b);
      if (!c) {
        return a;
      }
      if (!a) {
        return c;
      }
      for (b = 0; b < c.length; ++b) {
        if (d = c[b], e = a[b], d && e) {
          a: for (g = 0; g < e.length; ++g) {
            h = e[g];
            for (l = 0; l < d.length; ++l) {
              if (d[l].marker == h.marker) {
                continue a;
              }
            }
            d.push(h);
          }
        } else {
          e && (c[b] = e);
        }
      }
      return c;
    }
    function ug(a, b, c) {
      var d = null;
      if (a.iter(b.line, c.line + 1, function(t) {
        if (t.markedSpans) {
          for (var v = 0; v < t.markedSpans.length; ++v) {
            var z = t.markedSpans[v].marker;
            !z.readOnly || d && -1 != Oa(d, z) || (d ||= []).push(z);
          }
        }
      }), !d) {
        return null;
      }
      a = [{from:b, to:c}];
      for (b = 0; b < d.length; ++b) {
        c = d[b];
        for (var e = c.find(0), g = 0; g < a.length; ++g) {
          var h = a[g];
          if (!(0 > fa(h.to, e.from) || 0 < fa(h.from, e.to))) {
            var l = [g, 1], m = fa(h.from, e.from), p = fa(h.to, e.to);
            (0 > m || !c.inclusiveLeft && !m) && l.push({from:h.from, to:e.from});
            (0 < p || !c.inclusiveRight && !p) && l.push({from:e.to, to:h.to});
            a.splice.apply(a, l);
            g += l.length - 1;
          }
        }
      }
      return a;
    }
    function Af(a) {
      var b = a.markedSpans;
      if (b) {
        for (var c = 0; c < b.length; ++c) {
          b[c].marker.detachLine(a);
        }
        a.markedSpans = null;
      }
    }
    function Bf(a, b) {
      if (b) {
        for (var c = 0; c < b.length; ++c) {
          b[c].marker.attachLine(a);
        }
        a.markedSpans = b;
      }
    }
    function Cf(a, b) {
      var c = a.lines.length - b.lines.length;
      if (0 != c) {
        return c;
      }
      c = a.find();
      var d = b.find(), e = fa(c.from, d.from) || (a.inclusiveLeft ? -1 : 0) - (b.inclusiveLeft ? -1 : 0);
      return e ? -e : (c = fa(c.to, d.to) || (a.inclusiveRight ? 1 : 0) - (b.inclusiveRight ? 1 : 0)) ? c : b.id - a.id;
    }
    function cc(a, b) {
      var c;
      if (a = Sb && a.markedSpans) {
        for (var d, e = 0; e < a.length; ++e) {
          d = a[e], d.marker.collapsed && null == (b ? d.from : d.to) && (!c || 0 > Cf(c, d.marker)) && (c = d.marker);
        }
      }
      return c;
    }
    function xf(a, b, c, d, e) {
      a = Z(a, b);
      if (a = Sb && a.markedSpans) {
        for (b = 0; b < a.length; ++b) {
          var g = a[b];
          if (g.marker.collapsed) {
            var h = g.marker.find(0), l = fa(h.from, c) || (g.marker.inclusiveLeft ? -1 : 0) - (e.inclusiveLeft ? -1 : 0), m = fa(h.to, d) || (g.marker.inclusiveRight ? 1 : 0) - (e.inclusiveRight ? 1 : 0);
            if (!(0 <= l && 0 >= m || 0 >= l && 0 <= m) && (0 >= l && (g.marker.inclusiveRight && e.inclusiveLeft ? 0 <= fa(h.to, c) : 0 < fa(h.to, c)) || 0 <= l && (g.marker.inclusiveRight && e.inclusiveLeft ? 0 >= fa(h.from, d) : 0 > fa(h.from, d)))) {
              return !0;
            }
          }
        }
      }
    }
    function Bb(a) {
      for (var b; b = cc(a, !0);) {
        a = b.find(-1, !0).line;
      }
      return a;
    }
    function be(a, b) {
      a = Z(a, b);
      var c = Bb(a);
      return a == c ? b : ya(c);
    }
    function Le(a, b) {
      if (b > a.lastLine()) {
        return b;
      }
      var c = Z(a, b);
      if (!bc(a, c)) {
        return b;
      }
      for (; a = cc(c, !1);) {
        c = a.find(1, !0).line;
      }
      return ya(c) + 1;
    }
    function bc(a, b) {
      var c = Sb && b.markedSpans;
      if (c) {
        for (var d, e = 0; e < c.length; ++e) {
          if (d = c[e], d.marker.collapsed) {
            if (null == d.from || !d.marker.widgetNode && 0 == d.from && d.marker.inclusiveLeft && ze(a, b, d)) {
              return !0;
            }
          }
        }
      }
    }
    function ze(a, b, c) {
      if (null == c.to) {
        return b = c.marker.find(1, !0), ze(a, b.line, gd(b.line.markedSpans, c.marker));
      }
      if (c.marker.inclusiveRight && c.to == b.text.length) {
        return !0;
      }
      for (var d, e = 0; e < b.markedSpans.length; ++e) {
        if (d = b.markedSpans[e], d.marker.collapsed && !d.marker.widgetNode && d.from == c.to && (null == d.to || d.to != c.from) && (d.marker.inclusiveLeft || c.marker.inclusiveRight) && ze(a, b, d)) {
          return !0;
        }
      }
    }
    function cd(a) {
      if (null != a.height) {
        return a.height;
      }
      var b = a.doc.cm;
      if (!b) {
        return 0;
      }
      if (!de(document.body, a.node)) {
        var c = "position: relative;";
        a.coverGutter && (c += "margin-left: -" + b.display.gutters.offsetWidth + "px;");
        a.noHScroll && (c += "width: " + b.display.wrapper.clientWidth + "px;");
        fb(b.display.measure, X("div", [a.node], null, c));
      }
      return a.height = a.node.parentNode.offsetHeight;
    }
    function zg(a, b, c, d) {
      var e = new Ud(a, c, d), g = a.cm;
      return g && e.noHScroll && (g.display.alignWidgets = !0), Pd(a, b, "widget", function(h) {
        var l = h.widgets || (h.widgets = []);
        if (null == e.insertAt ? l.push(e) : l.splice(Math.min(l.length - 1, Math.max(0, e.insertAt)), 0, e), e.line = h, g && !bc(a, h)) {
          l = yb(h) < a.scrollTop, xb(h, h.height + cd(e)), l && Nd(g, null, e.height), g.curOp.forceUpdate = !0;
        }
        return !0;
      }), e;
    }
    function Df(a, b) {
      if (a) {
        for (;;) {
          var c = a.match(/(?:^|\s+)line-(background-)?(\S+)/);
          if (!c) {
            break;
          }
          a = a.slice(0, c.index) + a.slice(c.index + c[0].length);
          var d = c[1] ? "bgClass" : "textClass";
          null == b[d] ? b[d] = c[2] : (new RegExp("(?:^|s)" + c[2] + "(?:$|s)")).test(b[d]) || (b[d] += " " + c[2]);
        }
      }
      return a;
    }
    function Ef(a, b) {
      if (a.blankLine) {
        return a.blankLine(b);
      }
      if (a.innerMode) {
        return a = x.innerMode(a, b), a.mode.blankLine ? a.mode.blankLine(a.state) : void 0;
      }
    }
    function Ae(a, b, c, d) {
      for (var e = 0; 10 > e; e++) {
        d && (d[0] = x.innerMode(a, c).mode);
        var g = a.token(b, c);
        if (b.pos > b.start) {
          return g;
        }
      }
      throw Error("Mode " + a.name + " failed to advance stream.");
    }
    function Ff(a, b, c, d) {
      function e(z) {
        return {start:t.start, end:t.pos, string:t.current(), type:v || null, state:z ? Wb(g.mode, p) : p};
      }
      var g = a.doc, h = g.mode;
      b = ba(g, b);
      var l, m = Z(g, b.line), p = kc(a, b.line, c), t = new Vd(m.text, a.options.tabSize);
      for (d && (l = []); (d || t.pos < b.ch) && !t.eol();) {
        t.start = t.pos;
        var v = Ae(h, t, p);
        d && l.push(e(!0));
      }
      return d ? l : e();
    }
    function Gf(a, b, c, d, e, g, h) {
      var l = c.flattenSpans;
      null == l && (l = a.options.flattenSpans);
      var m, p = 0, t = null, v = new Vd(b, a.options.tabSize), z = a.options.addModeClass && [null];
      for ("" == b && Df(Ef(c, d), g); !v.eol();) {
        if (v.pos > a.options.maxHighlightLength ? (l = !1, h && ge(a, b, d, v.pos), v.pos = b.length, m = null) : m = Df(Ae(c, v, d, z), g), z) {
          var I = z[0].name;
          I && (m = "m-" + (m ? I + " " + m : I));
        }
        if (!l || t != m) {
          for (; p < v.start;) {
            p = Math.min(v.start, p + 5e3), e(p, t);
          }
          t = m;
        }
        v.start = v.pos;
      }
      for (; p < v.pos;) {
        a = Math.min(v.pos, p + 5e3), e(a, t), p = a;
      }
    }
    function Qe(a, b, c, d) {
      var e = [a.state.modeGen], g = {};
      Gf(a, b.text, a.doc.mode, c, function(p, t) {
        e.push(p, t);
      }, g, d);
      for (c = 0; c < a.state.overlays.length; ++c) {
        var h = a.state.overlays[c], l = 1, m = 0;
        Gf(a, b.text, h.mode, !0, function(p, t) {
          for (var v = l; m < p;) {
            var z = e[l];
            z > p && e.splice(l, 1, p, e[l + 1], z);
            l += 2;
            m = Math.min(p, z);
          }
          if (t) {
            if (h.opaque) {
              e.splice(v, l - v, p, "cm-overlay " + t), l = v + 2;
            } else {
              for (; v < l; v += 2) {
                p = e[v + 1], e[v + 1] = (p ? p + " " : "") + "cm-overlay " + t;
              }
            }
          }
        }, g);
      }
      return {styles:e, classes:g.bgClass || g.textClass ? g : null};
    }
    function Hf(a, b, c) {
      if (!b.styles || b.styles[0] != a.state.modeGen) {
        var d = kc(a, ya(b)), e = Qe(a, b, b.text.length > a.options.maxHighlightLength ? Wb(a.doc.mode, d) : d);
        b.stateAfter = d;
        b.styles = e.styles;
        e.classes ? b.styleClasses = e.classes : b.styleClasses && (b.styleClasses = null);
        c === a.doc.frontier && a.doc.frontier++;
      }
      return b.styles;
    }
    function ge(a, b, c, d) {
      var e = a.doc.mode;
      a = new Vd(b, a.options.tabSize);
      a.start = a.pos = d || 0;
      for ("" == b && Ef(e, c); !a.eol();) {
        Ae(e, a, c), a.start = a.pos;
      }
    }
    function If(a, b) {
      if (!a || /^\s*$/.test(a)) {
        return null;
      }
      b = b.addModeClass ? Ag : Bg;
      return b[a] || (b[a] = a.replace(/\S+/g, "cm-$&"));
    }
    function Me(a, b) {
      var c = X("span", null, null, Na ? "padding-right: .1px" : null);
      c = {pre:X("pre", [c], "CodeMirror-line"), content:c, col:0, pos:0, cm:a, trailingSpace:!1, splitSpaces:(oa || Na) && a.getOption("lineWrapping")};
      b.measure = {};
      for (var d = 0; d <= (b.rest ? b.rest.length : 0); d++) {
        var e, g = d ? b.rest[d - 1] : b.line;
        c.pos = 0;
        c.addToken = Cg;
        var h = a.display.measure;
        if (null != Be) {
          h = Be;
        } else {
          var l = fb(h, document.createTextNode("A\u062eA")), m = bd(l, 0, 1).getBoundingClientRect();
          l = bd(l, 1, 2).getBoundingClientRect();
          h = (Qb(h), !(!m || m.left == m.right) && (Be = 3 > l.right - m.right));
        }
        h && (e = sb(g)) && (c.addToken = Dg(c.addToken, e));
        c.map = [];
        var p = b != a.display.externalMeasured && ya(g);
        a: {
          var t = l = m = h = void 0, v = void 0, z = void 0, I = void 0, O = c;
          p = Hf(a, g, p);
          var aa = g.markedSpans, xa = g.text, Da = 0;
          if (aa) {
            for (var Sa = xa.length, pa = 0, da = 1, ka = "", ua = 0;;) {
              if (ua == pa) {
                v = t = l = m = z = "";
                h = null;
                ua = 1 / 0;
                for (var za, la = [], Ea = 0; Ea < aa.length; ++Ea) {
                  var Fa = aa[Ea], Ia = Fa.marker;
                  "bookmark" == Ia.type && Fa.from == pa && Ia.widgetNode ? la.push(Ia) : Fa.from <= pa && (null == Fa.to || Fa.to > pa || Ia.collapsed && Fa.to == pa && Fa.from == pa) ? (null != Fa.to && Fa.to != pa && ua > Fa.to && (ua = Fa.to, t = ""), Ia.className && (v += " " + Ia.className), Ia.css && (z = (z ? z + ";" : "") + Ia.css), Ia.startStyle && Fa.from == pa && (l += " " + Ia.startStyle), Ia.endStyle && Fa.to == ua && (za ||= []).push(Ia.endStyle, Fa.to), Ia.title && !m && (m = Ia.title), 
                  Ia.collapsed && (!h || 0 > Cf(h.marker, Ia)) && (h = Fa)) : Fa.from > pa && ua > Fa.from && (ua = Fa.from);
                }
                if (za) {
                  for (Ea = 0; Ea < za.length; Ea += 2) {
                    za[Ea + 1] == ua && (t += " " + za[Ea]);
                  }
                }
                if (!h || h.from == pa) {
                  for (Ea = 0; Ea < la.length; ++Ea) {
                    Jf(O, 0, la[Ea]);
                  }
                }
                if (h && (h.from || 0) == pa) {
                  if (Jf(O, (null == h.to ? Sa + 1 : h.to) - pa, h.marker, null == h.from), null == h.to) {
                    break a;
                  }
                  h.to == pa && (h = !1);
                }
              }
              if (pa >= Sa) {
                break;
              }
              for (la = Math.min(Sa, ua);;) {
                if (ka) {
                  Ea = pa + ka.length;
                  h || (Fa = Ea > la ? ka.slice(0, la - pa) : ka, O.addToken(O, Fa, I ? I + v : v, l, pa + Fa.length == ua ? t : "", m, z));
                  if (Ea >= la) {
                    ka = ka.slice(la - pa);
                    pa = la;
                    break;
                  }
                  pa = Ea;
                  l = "";
                }
                ka = xa.slice(Da, Da = p[da++]);
                I = If(p[da++], O.cm.options);
              }
            }
          } else {
            for (da = 1; da < p.length; da += 2) {
              O.addToken(O, xa.slice(Da, Da = p[da]), If(p[da + 1], O.cm.options));
            }
          }
        }
        g.styleClasses && (g.styleClasses.bgClass && (c.bgClass = Ce(g.styleClasses.bgClass, c.bgClass || "")), g.styleClasses.textClass && (c.textClass = Ce(g.styleClasses.textClass, c.textClass || "")));
        0 == c.map.length && (g = c.map, h = g.push, m = c.content, l = m.appendChild, t = a.display.measure, null == De && (v = X("span", "\u200b"), fb(t, X("span", [v, document.createTextNode("x")])), 0 != t.firstChild.offsetHeight && (De = 1 >= v.offsetWidth && 2 < v.offsetHeight && !(oa && 8 > Ba))), t = De ? X("span", "\u200b") : X("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px"), t = (t.setAttribute("cm-text", ""), t), h.call(g, 0, 0, l.call(m, t)));
        0 == d ? (b.measure.map = c.map, b.measure.cache = {}) : ((b.measure.maps || (b.measure.maps = [])).push(c.map), (b.measure.caches || (b.measure.caches = [])).push({}));
      }
      Na && (e = c.content.lastChild, (/\bcm-tab\b/.test(e.className) || e.querySelector && e.querySelector(".cm-tab")) && (c.content.className = "cm-tab-wrap-hack"));
      return La(a, "renderLine", a, b.line, c.pre), c.pre.className && (c.textClass = Ce(c.pre.className, c.textClass || "")), c;
    }
    function Cg(a, b, c, d, e, g, h) {
      if (b) {
        if (a.splitSpaces) {
          var l = a.trailingSpace;
          if (1 < b.length && !/  /.test(b)) {
            l = b;
          } else {
            for (var m = "", p = 0; p < b.length; p++) {
              var t = b.charAt(p);
              " " != t || !l || p != b.length - 1 && 32 != b.charCodeAt(p + 1) || (t = "\u00a0");
              m += t;
              l = " " == t;
            }
            l = m;
          }
        } else {
          l = b;
        }
        m = l;
        p = a.cm.state.specialChars;
        t = !1;
        if (p.test(b)) {
          l = document.createDocumentFragment();
          for (var v = 0;;) {
            p.lastIndex = v;
            var z = p.exec(b), I = z ? z.index - v : b.length - v;
            if (I) {
              var O = document.createTextNode(m.slice(v, v + I));
              oa && 9 > Ba ? l.appendChild(X("span", [O])) : l.appendChild(O);
              a.map.push(a.pos, a.pos + I, O);
              a.col += I;
              a.pos += I;
            }
            if (!z) {
              break;
            }
            (v += I + 1, "\t" == z[0]) ? (O = a.cm.options.tabSize, z = O - a.col % O, O = l.appendChild(X("span", we(z), "cm-tab")), O.setAttribute("role", "presentation"), O.setAttribute("cm-text", "\t"), a.col += z) : ("\r" == z[0] || "\n" == z[0] ? (O = l.appendChild(X("span", "\r" == z[0] ? "\u240d" : "\u2424", "cm-invalidchar")), O.setAttribute("cm-text", z[0])) : (O = a.cm.options.specialCharPlaceholder(z[0]), O.setAttribute("cm-text", z[0]), oa && 9 > Ba ? l.appendChild(X("span", [O])) : 
            l.appendChild(O)), a.col += 1);
            a.map.push(a.pos, a.pos + 1, O);
            a.pos++;
          }
        } else {
          a.col += b.length, l = document.createTextNode(m), a.map.push(a.pos, a.pos + b.length, l), oa && 9 > Ba && (t = !0), a.pos += b.length;
        }
        if (a.trailingSpace = 32 == m.charCodeAt(b.length - 1), c || d || e || t || h) {
          return b = c || "", d && (b += d), e && (b += e), d = X("span", [l], b, h), g && (d.title = g), a.content.appendChild(d);
        }
        a.content.appendChild(l);
      }
    }
    function Dg(a, b) {
      return function(c, d, e, g, h, l, m) {
        e = e ? e + " cm-force-border" : "cm-force-border";
        for (var p = c.pos, t = p + d.length;;) {
          for (var v = 0; v < b.length; v++) {
            var z = b[v];
            if (z.to > p && z.from <= p) {
              break;
            }
          }
          if (z.to >= t) {
            return a(c, d, e, g, h, l, m);
          }
          a(c, d.slice(0, z.to - p), e, g, null, l, m);
          g = null;
          d = d.slice(z.to - p);
          p = z.to;
        }
      };
    }
    function Jf(a, b, c, d) {
      var e = !d && c.widgetNode;
      e && a.map.push(a.pos, a.pos + b, e);
      !d && a.cm.display.input.needsContentAttribute && (e ||= a.content.appendChild(document.createElement("span")), e.setAttribute("cm-marker", c.id));
      e && (a.cm.display.input.setUneditable(e), a.content.appendChild(e));
      a.pos += b;
      a.trailingSpace = !1;
    }
    function uf(a, b) {
      return 0 == b.from.ch && 0 == b.to.ch && "" == ta(b.text) && (!a.cm || a.cm.options.wholeLineUpdateBefore);
    }
    function ve(a, b, c, d) {
      function e(aa, xa, Da) {
        aa.text = xa;
        aa.stateAfter && (aa.stateAfter = null);
        aa.styles && (aa.styles = null);
        null != aa.order && (aa.order = null);
        Af(aa);
        Bf(aa, Da);
        xa = d ? d(aa) : 1;
        xa != aa.height && xb(aa, xa);
        $a(aa, "change", aa, b);
      }
      function g(aa, xa) {
        for (var Da = []; aa < xa; ++aa) {
          Da.push(new hd(m[aa], c ? c[aa] : null, d));
        }
        return Da;
      }
      var h = b.from, l = b.to, m = b.text, p = Z(a, h.line), t = Z(a, l.line), v = ta(m), z = c ? c[m.length - 1] : null, I = l.line - h.line;
      if (b.full) {
        a.insert(0, g(0, m.length)), a.remove(m.length, a.size - m.length);
      } else if (uf(a, b)) {
        var O = g(0, m.length - 1);
        e(t, t.text, z);
        I && a.remove(h.line, I);
        O.length && a.insert(h.line, O);
      } else {
        p == t ? 1 == m.length ? e(p, p.text.slice(0, h.ch) + v + p.text.slice(l.ch), z) : (O = g(1, m.length - 1), O.push(new hd(v + p.text.slice(l.ch), z, d)), e(p, p.text.slice(0, h.ch) + m[0], c ? c[0] : null), a.insert(h.line + 1, O)) : 1 == m.length ? (e(p, p.text.slice(0, h.ch) + m[0] + t.text.slice(l.ch), c ? c[0] : null), a.remove(h.line + 1, I)) : (e(p, p.text.slice(0, h.ch) + m[0], c ? c[0] : null), e(t, v + t.text.slice(l.ch), z), O = g(1, m.length - 1), 1 < I && a.remove(h.line + 1, 
        I - 1), a.insert(h.line + 1, O));
      }
      $a(a, "change", a, b);
    }
    function id(a) {
      this.lines = a;
      this.parent = null;
      for (var b = 0, c = 0; b < a.length; ++b) {
        a[b].parent = this, c += a[b].height;
      }
      this.height = c;
    }
    function jd(a) {
      this.children = a;
      for (var b = 0, c = 0, d = 0; d < a.length; ++d) {
        var e = a[d];
        b += e.chunkSize();
        c += e.height;
        e.parent = this;
      }
      this.size = b;
      this.height = c;
      this.parent = null;
    }
    function oc(a, b, c) {
      function d(e, g, h) {
        if (e.linked) {
          for (var l = 0; l < e.linked.length; ++l) {
            var m = e.linked[l];
            if (m.doc != g) {
              var p = h && m.sharedHist;
              c && !p || (b(m.doc, p), d(m.doc, e, p));
            }
          }
        }
      }
      d(a, null, !0);
    }
    function He(a, b) {
      if (b.cm) {
        throw Error("This document is already in use.");
      }
      a.doc = b;
      b.cm = a;
      A(a);
      R(a);
      a.options.lineWrapping || C(a);
      a.options.mode = b.modeOption;
      Qa(a);
    }
    function Z(a, b) {
      if (b -= a.first, 0 > b || b >= a.size) {
        throw Error("There is no line " + (b + a.first) + " in the document.");
      }
      for (; !a.lines;) {
        for (var c = 0;; ++c) {
          var d = a.children[c], e = d.chunkSize();
          if (b < e) {
            a = d;
            break;
          }
          b -= e;
        }
      }
      return a.lines[b];
    }
    function hc(a, b, c) {
      var d = [], e = b.line;
      return a.iter(b.line, c.line + 1, function(g) {
        g = g.text;
        e == c.line && (g = g.slice(0, c.ch));
        e == b.line && (g = g.slice(b.ch));
        d.push(g);
        ++e;
      }), d;
    }
    function Ee(a, b, c) {
      var d = [];
      return a.iter(b, c, function(e) {
        d.push(e.text);
      }), d;
    }
    function xb(a, b) {
      if (b -= a.height) {
        for (; a; a = a.parent) {
          a.height += b;
        }
      }
    }
    function ya(a) {
      if (null == a.parent) {
        return null;
      }
      var b = a.parent;
      a = Oa(b.lines, a);
      for (var c = b.parent; c; b = c, c = c.parent) {
        for (var d = 0; c.children[d] != b; ++d) {
          a += c.children[d].chunkSize();
        }
      }
      return a + b.first;
    }
    function dc(a, b) {
      var c = a.first;
      a: do {
        for (var d = 0; d < a.children.length; ++d) {
          var e = a.children[d], g = e.height;
          if (b < g) {
            a = e;
            continue a;
          }
          b -= g;
          c += e.chunkSize();
        }
        return c;
      } while (!a.lines);
      for (d = 0; d < a.lines.length; ++d) {
        e = a.lines[d].height;
        if (b < e) {
          break;
        }
        b -= e;
      }
      return c + d;
    }
    function yb(a) {
      a = Bb(a);
      for (var b = 0, c = a.parent, d = 0; d < c.lines.length; ++d) {
        var e = c.lines[d];
        if (e == a) {
          break;
        }
        b += e.height;
      }
      for (a = c.parent; a; c = a, a = c.parent) {
        for (d = 0; d < a.children.length; ++d) {
          e = a.children[d];
          if (e == c) {
            break;
          }
          b += e.height;
        }
      }
      return b;
    }
    function sb(a) {
      var b = a.order;
      return null == b && (b = a.order = Eg(a.text)), b;
    }
    function Wd(a) {
      this.done = [];
      this.undone = [];
      this.undoDepth = 1 / 0;
      this.lastModTime = this.lastSelTime = 0;
      this.lastOrigin = this.lastSelOrigin = this.lastOp = this.lastSelOp = null;
      this.generation = this.maxGeneration = a || 1;
    }
    function ue(a, b) {
      var c = {from:w(b.from), to:nc(b), text:hc(a, b.from, b.to)};
      return Kf(a, c, b.from.line, b.to.line + 1), oc(a, function(d) {
        Kf(d, c, b.from.line, b.to.line + 1);
      }, !0), c;
    }
    function Oe(a) {
      for (; a.length && ta(a).ranges;) {
        a.pop();
      }
    }
    function qf(a, b, c, d) {
      var e = a.history;
      e.undone.length = 0;
      var g, h = +new Date(), l;
      if (l = e.lastOp == d || e.lastOrigin == b.origin && b.origin && ("+" == b.origin.charAt(0) && a.cm && e.lastModTime > h - a.cm.options.historyEventDelay || "*" == b.origin.charAt(0))) {
        l = g = e.lastOp == d ? (Oe(e.done), ta(e.done)) : e.done.length && !ta(e.done).ranges ? ta(e.done) : 1 < e.done.length && !e.done[e.done.length - 2].ranges ? (e.done.pop(), ta(e.done)) : void 0;
      }
      if (l) {
        var m = ta(g.changes);
        0 == fa(b.from, b.to) && 0 == fa(b.from, m.to) ? m.to = nc(b) : g.changes.push(ue(a, b));
      } else {
        for ((g = ta(e.done)) && g.ranges || wd(a.sel, e.done), g = {changes:[ue(a, b)], generation:e.generation}, e.done.push(g); e.done.length > e.undoDepth;) {
          e.done.shift(), e.done[0].ranges || e.done.shift();
        }
      }
      e.done.push(c);
      e.generation = ++e.maxGeneration;
      e.lastModTime = e.lastSelTime = h;
      e.lastOp = e.lastSelOp = d;
      e.lastOrigin = e.lastSelOrigin = b.origin;
      m || La(a, "historyAdded");
    }
    function wd(a, b) {
      var c = ta(b);
      c && c.ranges && c.equals(a) || b.push(a);
    }
    function Kf(a, b, c, d) {
      var e = b["spans_" + a.id], g = 0;
      a.iter(Math.max(a.first, c), Math.min(a.first + a.size, d), function(h) {
        h.markedSpans && ((e ||= b["spans_" + a.id] = {})[g] = h.markedSpans);
        ++g;
      });
    }
    function Hc(a, b, c) {
      for (var d = 0, e = []; d < a.length; ++d) {
        var g = a[d];
        if (g.ranges) {
          e.push(c ? tb.prototype.deepCopy.call(g) : g);
        } else {
          g = g.changes;
          var h = [];
          e.push({changes:h});
          for (var l = 0; l < g.length; ++l) {
            var m, p = g[l];
            if (h.push({from:p.from, to:p.to, text:p.text}), b) {
              for (var t in p) {
                (m = t.match(/^spans_(\d+)$/)) && -1 < Oa(b, Number(m[1])) && (ta(h)[t] = p[t], delete p[t]);
              }
            }
          }
        }
      }
      return e;
    }
    function Lf(a, b, c, d) {
      for (var e = 0; e < a.length; ++e) {
        var g = a[e], h = !0;
        if (g.ranges) {
          g.copied || (g = a[e] = g.deepCopy(), g.copied = !0);
          for (var l = 0; l < g.ranges.length; l++) {
            h = g.ranges[l].anchor;
            var m = b;
            c < h.line ? h.line += d : m < h.line && (h.line = m, h.ch = 0);
            h = g.ranges[l].head;
            m = b;
            c < h.line ? h.line += d : m < h.line && (h.line = m, h.ch = 0);
          }
        } else {
          for (l = 0; l < g.changes.length; ++l) {
            if (m = g.changes[l], c < m.from.line) {
              m.from = K(m.from.line + d, m.from.ch), m.to = K(m.to.line + d, m.to.ch);
            } else if (b <= m.to.line) {
              h = !1;
              break;
            }
          }
          h || (a.splice(0, e + 1), e = 0);
        }
      }
    }
    function rf(a, b) {
      var c = b.from.line, d = b.to.line;
      b = b.text.length - (d - c) - 1;
      Lf(a.done, c, d, b);
      Lf(a.undone, c, d, b);
    }
    function qe(a) {
      return null != a.defaultPrevented ? a.defaultPrevented : 0 == a.returnValue;
    }
    function ef(a) {
      var b = a.which;
      return null == b && (1 & a.button ? b = 1 : 2 & a.button ? b = 3 : 4 & a.button && (b = 2)), rb && a.ctrlKey && 1 == b && (b = 3), b;
    }
    function Xd(a, b, c) {
      a = a._handlers && a._handlers[b];
      return c ? a && 0 < a.length ? a.slice() : Mf : a || Mf;
    }
    function $a(a, b) {
      function c(l) {
        return function() {
          l.apply(null, g);
        };
      }
      var d = Xd(a, b, !1);
      if (d.length) {
        var e, g = Array.prototype.slice.call(arguments, 2);
        Dc ? e = Dc.delayedCallbacks : kd ? e = kd : (e = kd = [], setTimeout(Fg, 0));
        for (var h = 0; h < d.length; ++h) {
          e.push(c(d[h]));
        }
      }
    }
    function Fg() {
      var a = kd;
      kd = null;
      for (var b = 0; b < a.length; ++b) {
        a[b]();
      }
    }
    function Ma(a, b, c) {
      return "string" == typeof b && (b = {type:b, preventDefault:function() {
        this.defaultPrevented = !0;
      }}), La(a, c || b.type, a, b), qe(b) || b.codemirrorIgnore;
    }
    function Pe(a) {
      var b = a._handlers && a._handlers.cursorActivity;
      if (b) {
        a = a.curOp.cursorActivityHandlers || (a.curOp.cursorActivityHandlers = []);
        for (var c = 0; c < b.length; ++c) {
          -1 == Oa(a, b[c]) && a.push(b[c]);
        }
      }
    }
    function kb(a, b) {
      return 0 < Xd(a, b).length;
    }
    function Ic(a) {
      a.prototype.on = function(b, c) {
        ca(this, b, c);
      };
      a.prototype.off = function(b, c) {
        Cb(this, b, c);
      };
    }
    function Zb() {
      this.id = null;
    }
    function we(a) {
      for (; Yd.length <= a;) {
        Yd.push(ta(Yd) + " ");
      }
      return Yd[a];
    }
    function ta(a) {
      return a[a.length - 1];
    }
    function Oa(a, b) {
      for (var c = 0; c < a.length; ++c) {
        if (a[c] == b) {
          return c;
        }
      }
      return -1;
    }
    function sd(a, b) {
      for (var c = [], d = 0; d < a.length; d++) {
        c[d] = b(a[d], d);
      }
      return c;
    }
    function Gg(a, b, c) {
      for (var d = 0, e = c(b); d < a.length && c(a[d]) <= e;) {
        d++;
      }
      a.splice(d, 0, b);
    }
    function ld() {
    }
    function Nf(a, b) {
      var c;
      return Object.create ? c = Object.create(a) : (ld.prototype = a, c = new ld()), b && pb(b, c), c;
    }
    function pb(a, b, c) {
      b ||= {};
      for (var d in a) {
        !a.hasOwnProperty(d) || !1 === c && b.hasOwnProperty(d) || (b[d] = a[d]);
      }
      return b;
    }
    function Zd(a) {
      var b = Array.prototype.slice.call(arguments, 1);
      return function() {
        return a.apply(null, b);
      };
    }
    function Qd(a, b) {
      return b ? !!(-1 < b.source.indexOf("\\w") && Of(a)) || b.test(a) : Of(a);
    }
    function Pf(a) {
      for (var b in a) {
        if (a.hasOwnProperty(b) && a[b]) {
          return !1;
        }
      }
      return !0;
    }
    function ad(a) {
      return 768 <= a.charCodeAt(0) && Hg.test(a);
    }
    function X(a, b, c, d) {
      a = document.createElement(a);
      if (c && (a.className = c), d && (a.style.cssText = d), "string" == typeof b) {
        a.appendChild(document.createTextNode(b));
      } else if (b) {
        for (c = 0; c < b.length; ++c) {
          a.appendChild(b[c]);
        }
      }
      return a;
    }
    function Qb(a) {
      for (var b = a.childNodes.length; 0 < b; --b) {
        a.removeChild(a.firstChild);
      }
      return a;
    }
    function fb(a, b) {
      return Qb(a).appendChild(b);
    }
    function zb() {
      for (var a = document.activeElement; a && a.root && a.root.activeElement;) {
        a = a.root.activeElement;
      }
      return a;
    }
    function md(a) {
      return new RegExp("(^|\\s)" + a + "(?:$|\\s)\\s*");
    }
    function Ce(a, b) {
      a = a.split(" ");
      for (var c = 0; c < a.length; c++) {
        a[c] && !md(a[c]).test(b) && (b += " " + a[c]);
      }
      return b;
    }
    function Qf(a) {
      if (document.body.getElementsByClassName) {
        for (var b = document.body.getElementsByClassName("CodeMirror"), c = 0; c < b.length; c++) {
          var d = b[c].CodeMirror;
          d && a(d);
        }
      }
    }
    function $f() {
      var a;
      ca(window, "resize", function() {
        null == a && (a = setTimeout(function() {
          a = null;
          Qf(hg);
        }, 100));
      });
      ca(window, "blur", function() {
        Qf(Nc);
      });
    }
    function ag(a, b, c, d) {
      if (!a) {
        return d(b, c, "ltr");
      }
      for (var e = !1, g = 0; g < a.length; ++g) {
        var h = a[g];
        (h.from < c && h.to > b || b == c && h.to == b) && (d(Math.max(h.from, b), Math.min(h.to, c), 1 == h.level ? "rtl" : "ltr"), e = !0);
      }
      e || d(b, c, "ltr");
    }
    function je(a) {
      return a.level % 2 ? a.to : a.from;
    }
    function ke(a) {
      return a.level % 2 ? a.from : a.to;
    }
    function Ad(a) {
      return (a = sb(a)) ? je(a[0]) : 0;
    }
    function Bd(a) {
      var b = sb(a);
      return b ? ke(ta(b)) : a.text.length;
    }
    function Rf(a, b) {
      var c = Z(a.doc, b);
      a = Bb(c);
      a != c && (b = ya(a));
      a = (c = sb(a)) ? c[0].level % 2 ? Bd(a) : Ad(a) : 0;
      return K(b, a);
    }
    function Sf(a, b) {
      var c = Rf(a, b.line);
      a = Z(a.doc, c.line);
      var d = sb(a);
      return d && 0 != d[0].level ? c : (a = Math.max(0, a.text.search(/\S/)), K(c.line, b.line == c.line && b.ch <= a && b.ch ? 0 : a));
    }
    function td(a, b) {
      dd = null;
      for (var c, d = 0; d < a.length; ++d) {
        var e = a[d];
        if (e.from < b && e.to > b) {
          return d;
        }
        if (e.from == b || e.to == b) {
          if (null != c) {
            b = e.level;
            var g = a[c].level;
            a = a[0].level;
            return b == a || g != a && b < g ? (e.from != e.to && (dd = c), d) : (e.from != e.to && (dd = d), c);
          }
          c = d;
        }
      }
      return c;
    }
    function Fe(a, b, c, d) {
      if (!d) {
        return b + c;
      }
      do {
        b += c;
      } while (0 < b && ad(a.text.charAt(b)));
      return b;
    }
    function me(a, b, c, d) {
      var e = sb(a);
      if (!e) {
        return vf(a, b, c, d);
      }
      var g = td(e, b), h = e[g];
      for (b = Fe(a, b, h.level % 2 ? -c : c, d);;) {
        if (b > h.from && b < h.to) {
          return b;
        }
        if (b == h.from || b == h.to) {
          return td(e, b) == g ? b : (h = e[g + c], 0 < c == h.level % 2 ? h.to : h.from);
        }
        if (h = e[g += c], !h) {
          return null;
        }
        b = 0 < c == h.level % 2 ? Fe(a, h.to, -1, d) : Fe(a, h.from, 1, d);
      }
    }
    function vf(a, b, c, d) {
      b += c;
      if (d) {
        for (; 0 < b && ad(a.text.charAt(b));) {
          b += c;
        }
      }
      return 0 > b || b > a.text.length ? null : b;
    }
    var bb = navigator.userAgent, Tf = navigator.platform, Pb = /gecko\/\d/i.test(bb), Uf = /MSIE \d/.test(bb), Vf = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(bb), oa = Uf || Vf, Ba = oa && (Uf ? document.documentMode || 6 : Vf[1]), Na = /WebKit\//.test(bb), Ig = Na && /Qt\/\d+\.\d+/.test(bb), Jg = /Chrome\//.test(bb), wb = /Opera\//.test(bb), $e = /Apple Computer/.test(navigator.vendor), Kg = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(bb), eg = /PhantomJS/.test(bb), Uc = /AppleWebKit/.test(bb) && /Mobile\/\w+/.test(bb), 
    Mc = Uc || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(bb), rb = Uc || /Mac/.test(Tf), ng = /\bCrOS\b/.test(bb), Lg = /win/i.test(Tf), Jc = wb && bb.match(/Version\/(\d*\.\d*)/);
    Jc &&= Number(Jc[1]);
    Jc && 15 <= Jc && (wb = !1, Na = !0);
    var Wf = rb && (Ig || wb && (null == Jc || 12.11 > Jc)), oe = Pb || oa && 9 <= Ba, of = !1, Sb = !1;
    Q.prototype = pb({update:function(a) {
      var b = a.scrollWidth > a.clientWidth + 1, c = a.scrollHeight > a.clientHeight + 1, d = a.nativeBarWidth;
      c ? (this.vert.style.display = "block", this.vert.style.bottom = b ? d + "px" : "0", this.vert.firstChild.style.height = Math.max(0, a.scrollHeight - a.clientHeight + (a.viewHeight - (b ? d : 0))) + "px") : (this.vert.style.display = "", this.vert.firstChild.style.height = "0");
      b ? (this.horiz.style.display = "block", this.horiz.style.right = c ? d + "px" : "0", this.horiz.style.left = a.barLeft + "px", this.horiz.firstChild.style.width = a.scrollWidth - a.clientWidth + (a.viewWidth - a.barLeft - (c ? d : 0)) + "px") : (this.horiz.style.display = "", this.horiz.firstChild.style.width = "0");
      return !this.checkedZeroWidth && 0 < a.clientHeight && (0 == d && this.zeroWidthHack(), this.checkedZeroWidth = !0), {right:c ? d : 0, bottom:b ? d : 0};
    }, setScrollLeft:function(a) {
      this.horiz.scrollLeft != a && (this.horiz.scrollLeft = a);
      this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz);
    }, setScrollTop:function(a) {
      this.vert.scrollTop != a && (this.vert.scrollTop = a);
      this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert);
    }, zeroWidthHack:function() {
      this.horiz.style.height = this.vert.style.width = rb && !Kg ? "12px" : "18px";
      this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
      this.disableHoriz = new Zb();
      this.disableVert = new Zb();
    }, enableZeroWidthBar:function(a, b) {
      function c() {
        var d = a.getBoundingClientRect();
        document.elementFromPoint(d.left + 1, d.bottom - 1) != a ? a.style.pointerEvents = "none" : b.set(1E3, c);
      }
      a.style.pointerEvents = "auto";
      b.set(1E3, c);
    }, clear:function() {
      var a = this.horiz.parentNode;
      a.removeChild(this.horiz);
      a.removeChild(this.vert);
    }}, Q.prototype);
    N.prototype = pb({update:function() {
      return {bottom:0, right:0};
    }, setScrollLeft:function() {
    }, setScrollTop:function() {
    }, clear:function() {
    }}, N.prototype);
    x.scrollbarModel = {native:Q, null:N};
    cb.prototype.signal = function(a, b) {
      kb(a, b) && this.events.push(arguments);
    };
    cb.prototype.finish = function() {
      for (var a = 0; a < this.events.length; a++) {
        La.apply(null, this.events[a]);
      }
    };
    var K = x.Pos = function(a, b) {
      return this instanceof K ? (this.line = a, void(this.ch = b)) : new K(a, b);
    }, fa = x.cmpPos = function(a, b) {
      return a.line - b.line || a.ch - b.ch;
    }, Wa = null;
    fc.prototype = pb({init:function(a) {
      function b(h) {
        if (!Ma(d, h)) {
          if (d.somethingSelected()) {
            Wa = {lineWise:!1, text:d.getSelections()}, c.inaccurateSelection && (c.prevInput = "", c.inaccurateSelection = !1, g.value = Wa.text.join("\n"), Kc(g));
          } else {
            if (!d.options.lineWiseCopyCut) {
              return;
            }
            var l = Nb(d);
            Wa = {lineWise:!0, text:l.text};
            "cut" == h.type ? d.setSelections(l.ranges, null, Ab) : (c.prevInput = "", g.value = l.text.join("\n"), Kc(g));
          }
          "cut" == h.type && (d.state.cutIncoming = !0);
        }
      }
      var c = this, d = this.cm, e = this.wrapper = eb(), g = this.textarea = e.firstChild;
      a.wrapper.insertBefore(e, a.wrapper.firstChild);
      Uc && (g.style.width = "0px");
      ca(g, "input", function() {
        oa && 9 <= Ba && c.hasSelection && (c.hasSelection = null);
        c.poll();
      });
      ca(g, "paste", function(h) {
        Ma(d, h) || ia(h, d) || (d.state.pasteIncoming = !0, c.fastPoll());
      });
      ca(g, "cut", b);
      ca(g, "copy", b);
      ca(a.scroller, "paste", function(h) {
        Kb(a, h) || Ma(d, h) || (d.state.pasteIncoming = !0, c.focus());
      });
      ca(a.lineSpace, "selectstart", function(h) {
        Kb(a, h) || Ua(h);
      });
      ca(g, "compositionstart", function() {
        var h = d.getCursor("from");
        c.composing && c.composing.range.clear();
        c.composing = {start:h, range:d.markText(h, d.getCursor("to"), {className:"CodeMirror-composing"})};
      });
      ca(g, "compositionend", function() {
        c.composing && (c.poll(), c.composing.range.clear(), c.composing = null);
      });
    }, prepareSelection:function() {
      var a = this.cm, b = a.display, c = a.doc, d = Ac(a);
      if (a.options.moveInputWithCursor) {
        a = Ib(a, c.sel.primary().head, "div");
        c = b.wrapper.getBoundingClientRect();
        var e = b.lineDiv.getBoundingClientRect();
        d.teTop = Math.max(0, Math.min(b.wrapper.clientHeight - 10, a.top + e.top - c.top));
        d.teLeft = Math.max(0, Math.min(b.wrapper.clientWidth - 10, a.left + e.left - c.left));
      }
      return d;
    }, showSelection:function(a) {
      var b = this.cm.display;
      fb(b.cursorDiv, a.cursors);
      fb(b.selectionDiv, a.selection);
      null != a.teTop && (this.wrapper.style.top = a.teTop + "px", this.wrapper.style.left = a.teLeft + "px");
    }, reset:function(a) {
      if (!this.contextMenuPending) {
        var b = this.cm, c = b.doc;
        if (b.somethingSelected()) {
          this.prevInput = "";
          var d = c.sel.primary();
          var e = (d = kf && (100 < d.to().line - d.from().line || 1E3 < (e = b.getSelection()).length)) ? "-" : e || b.getSelection();
          this.textarea.value = e;
          b.state.focused && Kc(this.textarea);
          oa && 9 <= Ba && (this.hasSelection = e);
        } else {
          a || (this.prevInput = this.textarea.value = "", oa && 9 <= Ba && (this.hasSelection = null));
        }
        this.inaccurateSelection = d;
      }
    }, getField:function() {
      return this.textarea;
    }, supportsTouch:function() {
      return !1;
    }, focus:function() {
      if ("nocursor" != this.cm.options.readOnly && (!Mc || zb() != this.textarea)) {
        try {
          this.textarea.focus();
        } catch (a) {
        }
      }
    }, blur:function() {
      this.textarea.blur();
    }, resetPosition:function() {
      this.wrapper.style.top = this.wrapper.style.left = 0;
    }, receivedFocus:function() {
      this.slowPoll();
    }, slowPoll:function() {
      var a = this;
      a.pollingFast || a.polling.set(this.cm.options.pollInterval, function() {
        a.poll();
        a.cm.state.focused && a.slowPoll();
      });
    }, fastPoll:function() {
      function a() {
        c.poll() || b ? (c.pollingFast = !1, c.slowPoll()) : (b = !0, c.polling.set(60, a));
      }
      var b = !1, c = this;
      c.pollingFast = !0;
      c.polling.set(20, a);
    }, poll:function() {
      var a = this.cm, b = this.textarea, c = this.prevInput;
      if (this.contextMenuPending || !a.state.focused || Mg(b) && !c && !this.composing || a.isReadOnly() || a.options.disableInput || a.state.keySeq) {
        return !1;
      }
      var d = b.value;
      if (d == c && !a.somethingSelected()) {
        return !1;
      }
      if (oa && 9 <= Ba && this.hasSelection === d || rb && /[\uf700-\uf7ff]/.test(d)) {
        return a.display.input.reset(), !1;
      }
      if (a.doc.sel == a.display.selForContextMenu) {
        var e = d.charCodeAt(0);
        if (8203 != e || c || (c = "\u200b"), 8666 == e) {
          return this.reset(), this.cm.execCommand("undo");
        }
      }
      var g = 0;
      for (e = Math.min(c.length, d.length); g < e && c.charCodeAt(g) == d.charCodeAt(g);) {
        ++g;
      }
      var h = this;
      return db(a, function() {
        wa(a, d.slice(g), c.length - g, null, h.composing ? "*compose" : null);
        1E3 < d.length || -1 < d.indexOf("\n") ? b.value = h.prevInput = "" : h.prevInput = d;
        h.composing && (h.composing.range.clear(), h.composing.range = a.markText(h.composing.start, a.getCursor("to"), {className:"CodeMirror-composing"}));
      }), !0;
    }, ensurePolled:function() {
      this.pollingFast && this.poll() && (this.pollingFast = !1);
    }, onKeyPress:function() {
      oa && 9 <= Ba && (this.hasSelection = null);
      this.fastPoll();
    }, onContextMenu:function(a) {
      function b() {
        if (null != h.selectionStart) {
          var I = e.somethingSelected(), O = "\u200b" + (I ? h.value : "");
          h.value = "\u21da";
          h.value = O;
          d.prevInput = I ? "" : "\u200b";
          h.selectionStart = 1;
          h.selectionEnd = O.length;
          g.selForContextMenu = e.doc.sel;
        }
      }
      function c() {
        if (d.contextMenuPending = !1, d.wrapper.style.cssText = t, h.style.cssText = p, oa && 9 > Ba && g.scrollbars.setScrollTop(g.scroller.scrollTop = m), null != h.selectionStart) {
          (!oa || oa && 9 > Ba) && b();
          var I = 0, O = function() {
            g.selForContextMenu == e.doc.sel && 0 == h.selectionStart && 0 < h.selectionEnd && "\u200b" == d.prevInput ? Ha(e, Kd.selectAll)(e) : 10 > I++ ? g.detectingSelectAll = setTimeout(O, 500) : g.input.reset();
          };
          g.detectingSelectAll = setTimeout(O, 200);
        }
      }
      var d = this, e = d.cm, g = e.display, h = d.textarea, l = mc(e, a), m = g.scroller.scrollTop;
      if (l && !wb) {
        e.options.resetSelectionOnContextMenu && -1 == e.doc.sel.contains(l) && Ha(e, Ga)(e.doc, Ka(l), Ab);
        var p = h.style.cssText, t = d.wrapper.style.cssText;
        d.wrapper.style.cssText = "position: absolute";
        l = d.wrapper.getBoundingClientRect();
        if (h.style.cssText = "position: absolute; width: 30px; height: 30px; top: " + (a.clientY - l.top - 5) + "px; left: " + (a.clientX - l.left - 5) + "px; z-index: 1000; background: " + (oa ? "rgba(255, 255, 255, .05)" : "transparent") + "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", Na) {
          var v = window.scrollY;
        }
        if (g.input.focus(), Na && window.scrollTo(null, v), g.input.reset(), e.somethingSelected() || (h.value = d.prevInput = " "), d.contextMenuPending = !0, g.selForContextMenu = e.doc.sel, clearTimeout(g.detectingSelectAll), oa && 9 <= Ba && b(), oe) {
          Ed(a);
          var z = function() {
            Cb(window, "mouseup", z);
            setTimeout(c, 20);
          };
          ca(window, "mouseup", z);
        } else {
          setTimeout(c, 50);
        }
      }
    }, readOnlyChanged:function(a) {
      a || this.reset();
    }, setUneditable:ld, needsContentAttribute:!1}, fc.prototype);
    Vc.prototype = pb({init:function(a) {
      function b(g) {
        if (!Ma(d, g)) {
          if (d.somethingSelected()) {
            Wa = {lineWise:!1, text:d.getSelections()}, "cut" == g.type && d.replaceSelection("", null, "cut");
          } else {
            if (!d.options.lineWiseCopyCut) {
              return;
            }
            var h = Nb(d);
            Wa = {lineWise:!0, text:h.text};
            "cut" == g.type && d.operation(function() {
              d.setSelections(h.ranges, 0, Ab);
              d.replaceSelection("", null, "cut");
            });
          }
          if (g.clipboardData) {
            g.clipboardData.clearData();
            var l = Wa.text.join("\n");
            if (g.clipboardData.setData("Text", l), g.clipboardData.getData("Text") == l) {
              return void g.preventDefault();
            }
          }
          var m = eb();
          g = m.firstChild;
          d.display.lineSpace.insertBefore(m, d.display.lineSpace.firstChild);
          g.value = Wa.text.join("\n");
          var p = document.activeElement;
          Kc(g);
          setTimeout(function() {
            d.display.lineSpace.removeChild(m);
            p.focus();
            p == e && c.showPrimarySelection();
          }, 50);
        }
      }
      var c = this, d = c.cm, e = c.div = a.lineDiv;
      Ob(e, d.options.spellcheck);
      ca(e, "paste", function(g) {
        Ma(d, g) || ia(g, d) || 11 >= Ba && setTimeout(Ha(d, function() {
          c.pollContent() || Qa(d);
        }), 20);
      });
      ca(e, "compositionstart", function(g) {
        g = g.data;
        if (c.composing = {sel:d.doc.sel, data:g, startData:g}, g) {
          var h = d.doc.sel.primary(), l = d.getLine(h.head.line).indexOf(g, Math.max(0, h.head.ch - g.length));
          -1 < l && l <= h.head.ch && (c.composing.sel = Ka(K(h.head.line, l), K(h.head.line, l + g.length)));
        }
      });
      ca(e, "compositionupdate", function(g) {
        c.composing.data = g.data;
      });
      ca(e, "compositionend", function(g) {
        var h = c.composing;
        h && (g.data == h.startData || /\u200b/.test(g.data) || (h.data = g.data), setTimeout(function() {
          h.handled || c.applyComposition(h);
          c.composing == h && (c.composing = null);
        }, 50));
      });
      ca(e, "touchstart", function() {
        c.forceCompositionEnd();
      });
      ca(e, "input", function() {
        c.composing || !d.isReadOnly() && c.pollContent() || db(c.cm, function() {
          Qa(d);
        });
      });
      ca(e, "copy", b);
      ca(e, "cut", b);
    }, prepareSelection:function() {
      var a = Ac(this.cm, !1);
      return a.focus = this.cm.state.focused, a;
    }, showSelection:function(a, b) {
      a && this.cm.display.view.length && ((a.focus || b) && this.showPrimarySelection(), this.showMultipleSelections(a));
    }, showPrimarySelection:function() {
      var a = window.getSelection(), b = this.cm.doc.sel.primary(), c = gc(this.cm, a.anchorNode, a.anchorOffset), d = gc(this.cm, a.focusNode, a.focusOffset);
      if (!c || c.bad || !d || d.bad || 0 != fa(ma(c, d), b.from()) || 0 != fa(B(c, d), b.to())) {
        if (c = xc(this.cm, b.from()), d = xc(this.cm, b.to()), c || d) {
          var e = this.cm.display.view;
          b = a.rangeCount && a.getRangeAt(0);
          c ? d || (d = e[e.length - 1].measure, d = d.maps ? d.maps[d.maps.length - 1] : d.map, d = {node:d[d.length - 1], offset:d[d.length - 2] - d[d.length - 3]}) : c = {node:e[0].measure.map[2], offset:0};
          try {
            var g = bd(c.node, c.offset, d.offset, d.node);
          } catch (h) {
          }
          g && (!Pb && this.cm.state.focused ? (a.collapse(c.node, c.offset), g.collapsed || a.addRange(g)) : (a.removeAllRanges(), a.addRange(g)), b && null == a.anchorNode ? a.addRange(b) : Pb && this.startGracePeriod());
          this.rememberSelection();
        }
      }
    }, startGracePeriod:function() {
      var a = this;
      clearTimeout(this.gracePeriod);
      this.gracePeriod = setTimeout(function() {
        a.gracePeriod = !1;
        a.selectionChanged() && a.cm.operation(function() {
          a.cm.curOp.selectionChanged = !0;
        });
      }, 20);
    }, showMultipleSelections:function(a) {
      fb(this.cm.display.cursorDiv, a.cursors);
      fb(this.cm.display.selectionDiv, a.selection);
    }, rememberSelection:function() {
      var a = window.getSelection();
      this.lastAnchorNode = a.anchorNode;
      this.lastAnchorOffset = a.anchorOffset;
      this.lastFocusNode = a.focusNode;
      this.lastFocusOffset = a.focusOffset;
    }, selectionInEditor:function() {
      var a = window.getSelection();
      if (!a.rangeCount) {
        return !1;
      }
      a = a.getRangeAt(0).commonAncestorContainer;
      return de(this.div, a);
    }, focus:function() {
      "nocursor" != this.cm.options.readOnly && this.div.focus();
    }, blur:function() {
      this.div.blur();
    }, getField:function() {
      return this.div;
    }, supportsTouch:function() {
      return !0;
    }, receivedFocus:function() {
      function a() {
        b.cm.state.focused && (b.pollSelection(), b.polling.set(b.cm.options.pollInterval, a));
      }
      var b = this;
      this.selectionInEditor() ? this.pollSelection() : db(this.cm, function() {
        b.cm.curOp.selectionChanged = !0;
      });
      this.polling.set(this.cm.options.pollInterval, a);
    }, selectionChanged:function() {
      var a = window.getSelection();
      return a.anchorNode != this.lastAnchorNode || a.anchorOffset != this.lastAnchorOffset || a.focusNode != this.lastFocusNode || a.focusOffset != this.lastFocusOffset;
    }, pollSelection:function() {
      if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
        var a = window.getSelection(), b = this.cm;
        this.rememberSelection();
        var c = gc(b, a.anchorNode, a.anchorOffset), d = gc(b, a.focusNode, a.focusOffset);
        c && d && db(b, function() {
          Ga(b.doc, Ka(c, d), Ab);
          (c.bad || d.bad) && (b.curOp.selectionChanged = !0);
        });
      }
    }, pollContent:function() {
      var a = this.cm, b = a.display, c = a.doc.sel.primary(), d = c.from();
      c = c.to();
      if (d.line < b.viewFrom || c.line > b.viewTo - 1) {
        return !1;
      }
      var e;
      d.line == b.viewFrom || 0 == (e = ec(a, d.line)) ? (d = ya(b.view[0].line), e = b.view[0].node) : (d = ya(b.view[e].line), e = b.view[e - 1].node.nextSibling);
      var g = ec(a, c.line);
      g == b.view.length - 1 ? (c = b.viewTo - 1, b = b.lineDiv.lastChild) : (c = ya(b.view[g + 1].line) - 1, b = b.view[g + 1].node.previousSibling);
      b = a.doc.splitLines(ee(a, e, b, d, c));
      for (e = hc(a.doc, K(d, 0), K(c, Z(a.doc, c).text.length)); 1 < b.length && 1 < e.length;) {
        if (ta(b) == ta(e)) {
          b.pop(), e.pop(), c--;
        } else {
          if (b[0] != e[0]) {
            break;
          }
          b.shift();
          e.shift();
          d++;
        }
      }
      var h = 0;
      g = 0;
      for (var l = b[0], m = e[0], p = Math.min(l.length, m.length); h < p && l.charCodeAt(h) == m.charCodeAt(h);) {
        ++h;
      }
      l = ta(b);
      m = ta(e);
      for (p = Math.min(l.length - (1 == b.length ? h : 0), m.length - (1 == e.length ? h : 0)); g < p && l.charCodeAt(l.length - g - 1) == m.charCodeAt(m.length - g - 1);) {
        ++g;
      }
      b[b.length - 1] = l.slice(0, l.length - g);
      b[0] = b[0].slice(h);
      d = K(d, h);
      c = K(c, e.length ? ta(e).length - g : 0);
      return 1 < b.length || b[0] || fa(d, c) ? (Ec(a.doc, b, d, c, "+input"), !0) : void 0;
    }, ensurePolled:function() {
      this.forceCompositionEnd();
    }, reset:function() {
      this.forceCompositionEnd();
    }, forceCompositionEnd:function() {
      this.composing && !this.composing.handled && (this.applyComposition(this.composing), this.composing.handled = !0, this.div.blur(), this.div.focus());
    }, applyComposition:function(a) {
      this.cm.isReadOnly() ? Ha(this.cm, Qa)(this.cm) : a.data && a.data != a.startData && Ha(this.cm, wa)(this.cm, a.data, 0, a.sel);
    }, setUneditable:function(a) {
      a.contentEditable = "false";
    }, onKeyPress:function(a) {
      a.preventDefault();
      this.cm.isReadOnly() || Ha(this.cm, wa)(this.cm, String.fromCharCode(null == a.charCode ? a.keyCode : a.charCode), 0);
    }, readOnlyChanged:function(a) {
      this.div.contentEditable = String("nocursor" != a);
    }, onContextMenu:ld, resetPosition:ld, needsContentAttribute:!0}, Vc.prototype);
    x.inputStyles = {textarea:fc, contenteditable:Vc};
    tb.prototype = {primary:function() {
      return this.ranges[this.primIndex];
    }, equals:function(a) {
      if (a == this) {
        return !0;
      }
      if (a.primIndex != this.primIndex || a.ranges.length != this.ranges.length) {
        return !1;
      }
      for (var b = 0; b < this.ranges.length; b++) {
        var c = this.ranges[b], d = a.ranges[b];
        if (0 != fa(c.anchor, d.anchor) || 0 != fa(c.head, d.head)) {
          return !1;
        }
      }
      return !0;
    }, deepCopy:function() {
      for (var a = [], b = 0; b < this.ranges.length; b++) {
        a[b] = new sa(w(this.ranges[b].anchor), w(this.ranges[b].head));
      }
      return new tb(a, this.primIndex);
    }, somethingSelected:function() {
      for (var a = 0; a < this.ranges.length; a++) {
        if (!this.ranges[a].empty()) {
          return !0;
        }
      }
      return !1;
    }, contains:function(a, b) {
      b ||= a;
      for (var c = 0; c < this.ranges.length; c++) {
        var d = this.ranges[c];
        if (0 <= fa(b, d.from()) && 0 >= fa(a, d.to())) {
          return c;
        }
      }
      return -1;
    }};
    sa.prototype = {from:function() {
      return ma(this.anchor, this.head);
    }, to:function() {
      return B(this.anchor, this.head);
    }, empty:function() {
      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
    }};
    var lc, Gd, Fd, Se = {left:0, right:0, top:0, bottom:0}, Dc = null, dg = 0, Ze = 0, Id = 0, gb = null;
    oa ? gb = -.53 : Pb ? gb = 15 : Jg ? gb = -.7 : $e && (gb = -1 / 3);
    var gf = function(a) {
      var b = a.wheelDeltaX, c = a.wheelDeltaY;
      return null == b && a.detail && a.axis == a.HORIZONTAL_AXIS && (b = a.detail), null == c && a.detail && a.axis == a.VERTICAL_AXIS ? c = a.detail : null == c && (c = a.wheelDelta), {x:b, y:c};
    };
    x.wheelEventPixels = function(a) {
      a = gf(a);
      return a.x *= gb, a.y *= gb, a;
    };
    var qg = new Zb(), re = null, nc = x.changeEnd = function(a) {
      return a.text ? K(a.from.line + a.text.length - 1, ta(a.text).length + (1 == a.text.length ? a.from.ch : 0)) : a.to;
    };
    x.prototype = {constructor:x, focus:function() {
      window.focus();
      this.display.input.focus();
    }, setOption:function(a, b) {
      var c = this.options, d = c[a];
      c[a] == b && "mode" != a || (c[a] = b, sc.hasOwnProperty(a) && Ha(this, sc[a])(this, b, d));
    }, getOption:function(a) {
      return this.options[a];
    }, getDoc:function() {
      return this.doc;
    }, addKeyMap:function(a, b) {
      this.state.keyMaps[b ? "push" : "unshift"](Rd(a));
    }, removeKeyMap:function(a) {
      for (var b = this.state.keyMaps, c = 0; c < b.length; ++c) {
        if (b[c] == a || b[c].name == a) {
          return b.splice(c, 1), !0;
        }
      }
    }, addOverlay:Pa(function(a, b) {
      var c = a.token ? a : x.getMode(this.options, a);
      if (c.startState) {
        throw Error("Overlays may not be stateful.");
      }
      Gg(this.state.overlays, {mode:c, modeSpec:a, opaque:b && b.opaque, priority:b && b.priority || 0}, function(d) {
        return d.priority;
      });
      this.state.modeGen++;
      Qa(this);
    }), removeOverlay:Pa(function(a) {
      for (var b = this.state.overlays, c = 0; c < b.length; ++c) {
        var d = b[c].modeSpec;
        if (d == a || "string" == typeof a && d.name == a) {
          return b.splice(c, 1), this.state.modeGen++, void Qa(this);
        }
      }
    }), indentLine:Pa(function(a, b, c) {
      "string" != typeof b && "number" != typeof b && (b = null == b ? this.options.smartIndent ? "smart" : "prev" : b ? "add" : "subtract");
      ic(this.doc, a) && Tc(this, a, b, c);
    }), indentSelection:Pa(function(a) {
      for (var b = this.doc.sel.ranges, c = -1, d = 0; d < b.length; d++) {
        var e = b[d];
        if (e.empty()) {
          e.head.line > c && (Tc(this, e.head.line, a, !0), c = e.head.line, d == this.doc.sel.primIndex && wc(this));
        } else {
          var g = e.from();
          e = e.to();
          var h = Math.max(c, g.line);
          c = Math.min(this.lastLine(), e.line - (e.ch ? 0 : 1)) + 1;
          for (e = h; e < c; ++e) {
            Tc(this, e, a);
          }
          e = this.doc.sel.ranges;
          0 == g.ch && b.length == e.length && 0 < e[d].from().ch && Xc(this.doc, d, new sa(g, e[d].to()), Ab);
        }
      }
    }), getTokenAt:function(a, b) {
      return Ff(this, a, b);
    }, getLineTokens:function(a, b) {
      return Ff(this, K(a), b, !0);
    }, getTokenTypeAt:function(a) {
      a = ba(this.doc, a);
      var b = Hf(this, Z(this.doc, a.line));
      var c = 0, d = (b.length - 1) / 2;
      a = a.ch;
      if (0 == a) {
        b = b[2];
      } else {
        for (;;) {
          var e = c + d >> 1;
          if ((e ? b[2 * e - 1] : 0) >= a) {
            d = e;
          } else {
            if (!(b[2 * e + 1] < a)) {
              b = b[2 * e + 2];
              break;
            }
            c = e + 1;
          }
        }
      }
      c = b ? b.indexOf("cm-overlay ") : -1;
      return 0 > c ? b : 0 == c ? null : b.slice(0, c - 1);
    }, getModeAt:function(a) {
      var b = this.doc.mode;
      return b.innerMode ? x.innerMode(b, this.getTokenAt(a).state).mode : b;
    }, getHelper:function(a, b) {
      return this.getHelpers(a, b)[0];
    }, getHelpers:function(a, b) {
      var c = [];
      if (!Lc.hasOwnProperty(b)) {
        return c;
      }
      var d = Lc[b];
      a = this.getModeAt(a);
      if ("string" == typeof a[b]) {
        d[a[b]] && c.push(d[a[b]]);
      } else if (a[b]) {
        for (var e = 0; e < a[b].length; e++) {
          var g = d[a[b][e]];
          g && c.push(g);
        }
      } else {
        a.helperType && d[a.helperType] ? c.push(d[a.helperType]) : d[a.name] && c.push(d[a.name]);
      }
      for (e = 0; e < d._global.length; e++) {
        b = d._global[e], b.pred(a, this) && -1 == Oa(c, b.val) && c.push(b.val);
      }
      return c;
    }, getStateAfter:function(a, b) {
      var c = this.doc;
      return a = Math.max(c.first, Math.min(null == a ? c.first + c.size - 1 : a, c.first + c.size - 1)), kc(this, a + 1, b);
    }, cursorCoords:function(a, b) {
      var c, d = this.doc.sel.primary();
      return c = null == a ? d.head : "object" == typeof a ? ba(this.doc, a) : a ? d.from() : d.to(), Ib(this, c, b || "page");
    }, charCoords:function(a, b) {
      return xd(this, ba(this.doc, a), b || "page");
    }, coordsChar:function(a, b) {
      return a = Ve(this, a, b || "page"), le(this, a.left, a.top);
    }, lineAtHeight:function(a, b) {
      return a = Ve(this, {top:a, left:0}, b || "page").top, dc(this.doc, a + this.display.viewOffset);
    }, heightAtLine:function(a, b) {
      var c = !1;
      if ("number" == typeof a) {
        var d = this.doc.first + this.doc.size - 1;
        a < this.doc.first ? a = this.doc.first : a > d && (a = d, c = !0);
        a = Z(this.doc, a);
      }
      return ie(this, a, {top:0, left:0}, b || "page").top + (c ? this.doc.height - yb(a) : 0);
    }, defaultTextHeight:function() {
      return ac(this.display);
    }, defaultCharWidth:function() {
      return Oc(this.display);
    }, setGutterMarker:Pa(function(a, b, c) {
      return Pd(this.doc, a, "gutter", function(d) {
        var e = d.gutterMarkers || (d.gutterMarkers = {});
        return e[b] = c, !c && Pf(e) && (d.gutterMarkers = null), !0;
      });
    }), clearGutter:Pa(function(a) {
      var b = this, c = b.doc, d = c.first;
      c.iter(function(e) {
        e.gutterMarkers && e.gutterMarkers[a] && (e.gutterMarkers[a] = null, Jb(b, d, "gutter"), Pf(e.gutterMarkers) && (e.gutterMarkers = null));
        ++d;
      });
    }), lineInfo:function(a) {
      if ("number" == typeof a) {
        if (!ic(this.doc, a)) {
          return null;
        }
        var b = a;
        if (a = Z(this.doc, a), !a) {
          return null;
        }
      } else {
        if (b = ya(a), null == b) {
          return null;
        }
      }
      return {line:b, handle:a, text:a.text, gutterMarkers:a.gutterMarkers, textClass:a.textClass, bgClass:a.bgClass, wrapClass:a.wrapClass, widgets:a.widgets};
    }, getViewport:function() {
      return {from:this.display.viewFrom, to:this.display.viewTo};
    }, addWidget:function(a, b, c, d, e) {
      var g = this.display;
      a = Ib(this, ba(this.doc, a));
      var h = a.bottom, l = a.left;
      if (b.style.position = "absolute", b.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(b), g.sizer.appendChild(b), "over" == d) {
        h = a.top;
      } else if ("above" == d || "near" == d) {
        var m = Math.max(g.wrapper.clientHeight, this.doc.height), p = Math.max(g.sizer.clientWidth, g.lineSpace.clientWidth);
        ("above" == d || a.bottom + b.offsetHeight > m) && a.top > b.offsetHeight ? h = a.top - b.offsetHeight : a.bottom + b.offsetHeight <= m && (h = a.bottom);
        l + b.offsetWidth > p && (l = p - b.offsetWidth);
      }
      b.style.top = h + "px";
      b.style.left = b.style.right = "";
      "right" == e ? (l = g.sizer.clientWidth - b.offsetWidth, b.style.right = "0px") : ("left" == e ? l = 0 : "middle" == e && (l = (g.sizer.clientWidth - b.offsetWidth) / 2), b.style.left = l + "px");
      c && (a = Cd(this, l, h, l + b.offsetWidth, h + b.offsetHeight), null != a.scrollTop && Rc(this, a.scrollTop), null != a.scrollLeft && uc(this, a.scrollLeft));
    }, triggerOnKeyDown:Pa(cf), triggerOnKeyPress:Pa(df), triggerOnKeyUp:bf, execCommand:function(a) {
      if (Kd.hasOwnProperty(a)) {
        return Kd[a].call(null, this);
      }
    }, triggerElectric:Pa(function(a) {
      Ya(this, a);
    }), findPosH:function(a, b, c, d) {
      var e = 1;
      0 > b && (e = -1, b = -b);
      var g = 0;
      for (a = ba(this.doc, a); g < b && (a = xe(this.doc, a, e, c, d), !a.hitSide); ++g) {
      }
      return a;
    }, moveH:Pa(function(a, b) {
      var c = this;
      c.extendSelectionsBy(function(d) {
        return c.display.shift || c.doc.extend || d.empty() ? xe(c.doc, d.head, a, b, c.options.rtlMoveVisually) : 0 > a ? d.from() : d.to();
      }, nd);
    }), deleteH:Pa(function(a, b) {
      var c = this.doc;
      this.doc.sel.somethingSelected() ? c.replaceSelection("", null, "+delete") : Fc(this, function(d) {
        var e = xe(c, d.head, a, b, !1);
        return 0 > a ? {from:e, to:d.head} : {from:d.head, to:e};
      });
    }), findPosV:function(a, b, c, d) {
      var e = 1;
      0 > b && (e = -1, b = -b);
      var g = 0;
      for (a = ba(this.doc, a); g < b; ++g) {
        var h = Ib(this, a, "div");
        if (null == d ? d = h.left : h.left = d, a = wf(this, h, e, c), a.hitSide) {
          break;
        }
      }
      return a;
    }, moveV:Pa(function(a, b) {
      var c = this, d = this.doc, e = [], g = !c.display.shift && !d.extend && d.sel.somethingSelected();
      if (d.extendSelectionsBy(function(l) {
        if (g) {
          return 0 > a ? l.from() : l.to();
        }
        var m = Ib(c, l.head, "div");
        null != l.goalColumn && (m.left = l.goalColumn);
        e.push(m.left);
        var p = wf(c, m, a, b);
        return "page" == b && l == d.sel.primary() && Nd(c, null, xd(c, p, "div").top - m.top), p;
      }, nd), e.length) {
        for (var h = 0; h < d.sel.ranges.length; h++) {
          d.sel.ranges[h].goalColumn = e[h];
        }
      }
    }), findWordAt:function(a) {
      var b = Z(this.doc, a.line).text, c = a.ch, d = a.ch;
      if (b) {
        var e = this.getHelper(a, "wordChars");
        (0 > a.xRel || d == b.length) && c ? --c : ++d;
        var g = b.charAt(c);
        for (g = Qd(g, e) ? function(h) {
          return Qd(h, e);
        } : /\s/.test(g) ? function(h) {
          return /\s/.test(h);
        } : function(h) {
          return !/\s/.test(h) && !Qd(h);
        }; 0 < c && g(b.charAt(c - 1));) {
          --c;
        }
        for (; d < b.length && g(b.charAt(d));) {
          ++d;
        }
      }
      return new sa(K(a.line, c), K(a.line, d));
    }, toggleOverwrite:function(a) {
      null != a && a == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? Sc(this.display.cursorDiv, "CodeMirror-overwrite") : Qc(this.display.cursorDiv, "CodeMirror-overwrite"), La(this, "overwriteToggle", this, this.state.overwrite));
    }, hasFocus:function() {
      return this.display.input.getField() == zb();
    }, isReadOnly:function() {
      return !(!this.options.readOnly && !this.doc.cantEdit);
    }, scrollTo:Pa(function(a, b) {
      null == a && null == b || Od(this);
      null != a && (this.curOp.scrollLeft = a);
      null != b && (this.curOp.scrollTop = b);
    }), getScrollInfo:function() {
      var a = this.display.scroller;
      return {left:a.scrollLeft, top:a.scrollTop, height:a.scrollHeight - F(this) - this.display.barHeight, width:a.scrollWidth - F(this) - this.display.barWidth, clientHeight:Y(this), clientWidth:M(this)};
    }, scrollIntoView:Pa(function(a, b) {
      (null == a ? (a = {from:this.doc.sel.primary().head, to:null}, null == b && (b = this.options.cursorScrollMargin)) : "number" == typeof a ? a = {from:K(a, 0), to:null} : null == a.from && (a = {from:a, to:null}), a.to || (a.to = a.from), a.margin = b || 0, null != a.from.line) ? (Od(this), this.curOp.scrollToPos = a) : (a = Cd(this, Math.min(a.from.left, a.to.left), Math.min(a.from.top, a.to.top) - a.margin, Math.max(a.from.right, a.to.right), Math.max(a.from.bottom, a.to.bottom) + a.margin), 
      this.scrollTo(a.scrollLeft, a.scrollTop));
    }), setSize:Pa(function(a, b) {
      function c(g) {
        return "number" == typeof g || /^\d+$/.test(String(g)) ? g + "px" : g;
      }
      var d = this;
      null != a && (d.display.wrapper.style.width = c(a));
      null != b && (d.display.wrapper.style.height = c(b));
      d.options.lineWrapping && Ue(this);
      var e = d.display.viewFrom;
      d.doc.iter(e, d.display.viewTo, function(g) {
        if (g.widgets) {
          for (var h = 0; h < g.widgets.length; h++) {
            if (g.widgets[h].noHScroll) {
              Jb(d, e, "widget");
              break;
            }
          }
        }
        ++e;
      });
      d.curOp.forceUpdate = !0;
      La(d, "refresh", this);
    }), operation:function(a) {
      return db(this, a);
    }, refresh:Pa(function() {
      var a = this.display.cachedTextHeight;
      Qa(this);
      this.curOp.forceUpdate = !0;
      Pc(this);
      this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop);
      T(this);
      (null == a || .5 < Math.abs(a - ac(this.display))) && A(this);
      La(this, "refresh", this);
    }), swapDoc:Pa(function(a) {
      var b = this.doc;
      return b.cm = null, He(this, a), Pc(this), this.display.input.reset(), this.scrollTo(a.scrollLeft, a.scrollTop), this.curOp.forceScroll = !0, $a(this, "swapDoc", this, b), b;
    }), getInputField:function() {
      return this.display.input.getField();
    }, getWrapperElement:function() {
      return this.display.wrapper;
    }, getScrollerElement:function() {
      return this.display.scroller;
    }, getGutterElement:function() {
      return this.display.gutters;
    }};
    Ic(x);
    var Yf = x.defaults = {}, sc = x.optionHandlers = {}, Ie = x.Init = {toString:function() {
      return "CodeMirror.Init";
    }};
    ea("value", "", function(a, b) {
      a.setValue(b);
    }, !0);
    ea("mode", null, function(a, b) {
      a.doc.modeOption = b;
      R(a);
    }, !0);
    ea("indentUnit", 2, R, !0);
    ea("indentWithTabs", !1);
    ea("smartIndent", !0);
    ea("tabSize", 4, function(a) {
      G(a);
      Pc(a);
      Qa(a);
    }, !0);
    ea("lineSeparator", null, function(a, b) {
      if (a.doc.lineSep = b, b) {
        var c = [], d = a.doc.first;
        a.doc.iter(function(g) {
          for (var h = 0;;) {
            var l = g.text.indexOf(b, h);
            if (-1 == l) {
              break;
            }
            h = l + b.length;
            c.push(K(d, l));
          }
          d++;
        });
        for (var e = c.length - 1; 0 <= e; e--) {
          Ec(a.doc, b, c[e], K(c[e].line, c[e].ch + b.length));
        }
      }
    });
    ea("specialChars", /[\u0000-\u001f\u007f\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(a, b, c) {
      a.state.specialChars = new RegExp(b.source + (b.test("\t") ? "" : "|\t"), "g");
      c != x.Init && a.refresh();
    });
    ea("specialCharPlaceholder", function(a) {
      var b = X("span", "\u2022", "cm-invalidchar");
      return b.title = "\\u" + a.charCodeAt(0).toString(16), b.setAttribute("aria-label", b.title), b;
    }, function(a) {
      a.refresh();
    }, !0);
    ea("electricChars", !0);
    ea("inputStyle", Mc ? "contenteditable" : "textarea", function() {
      throw Error("inputStyle can not (yet) be changed in a running editor");
    }, !0);
    ea("spellcheck", !1, function(a, b) {
      a.getInputField().spellcheck = b;
    }, !0);
    ea("rtlMoveVisually", !Lg);
    ea("wholeLineUpdateBefore", !0);
    ea("theme", "default", function(a) {
      r(a);
      E(a);
    }, !0);
    ea("keyMap", "default", function(a, b, c) {
      b = Rd(b);
      (c = c != x.Init && Rd(c)) && c.detach && c.detach(a, b);
      b.attach && b.attach(a, c || null);
    });
    ea("extraKeys", null);
    ea("lineWrapping", !1, function(a) {
      a.options.lineWrapping ? (Sc(a.display.wrapper, "CodeMirror-wrap"), a.display.sizer.style.minWidth = "", a.display.sizerWidth = null) : (Qc(a.display.wrapper, "CodeMirror-wrap"), C(a));
      A(a);
      Qa(a);
      Pc(a);
      setTimeout(function() {
        J(a);
      }, 100);
    }, !0);
    ea("gutters", [], function(a) {
      f(a.options);
      E(a);
    }, !0);
    ea("fixedGutter", !0, function(a, b) {
      a.display.gutters.style.left = b ? Eb(a.display) + "px" : "0";
      a.refresh();
    }, !0);
    ea("coverGutterNextToScrollbar", !1, function(a) {
      J(a);
    }, !0);
    ea("scrollbarStyle", "native", function(a) {
      H(a);
      J(a);
      a.display.scrollbars.setScrollTop(a.doc.scrollTop);
      a.display.scrollbars.setScrollLeft(a.doc.scrollLeft);
    }, !0);
    ea("lineNumbers", !1, function(a) {
      f(a.options);
      E(a);
    }, !0);
    ea("firstLineNumber", 1, E, !0);
    ea("lineNumberFormatter", function(a) {
      return a;
    }, E, !0);
    ea("showCursorWhenSelecting", !1, qb, !0);
    ea("resetSelectionOnContextMenu", !0);
    ea("lineWiseCopyCut", !0);
    ea("readOnly", !1, function(a, b) {
      "nocursor" == b ? (Nc(a), a.display.input.blur(), a.display.disabled = !0) : a.display.disabled = !1;
      a.display.input.readOnlyChanged(b);
    });
    ea("disableInput", !1, function(a, b) {
      b || a.display.input.reset();
    }, !0);
    ea("dragDrop", !0, function(a, b, c) {
      !b != !(c && c != x.Init) && (c = a.display.dragFunctions, b = b ? ca : Cb, b(a.display.scroller, "dragstart", c.start), b(a.display.scroller, "dragenter", c.enter), b(a.display.scroller, "dragover", c.over), b(a.display.scroller, "dragleave", c.leave), b(a.display.scroller, "drop", c.drop));
    });
    ea("allowDropFileTypes", null);
    ea("cursorBlinkRate", 530);
    ea("cursorScrollMargin", 0);
    ea("cursorHeight", 1, qb, !0);
    ea("singleCursorHeightPerLine", !0, qb, !0);
    ea("workTime", 100);
    ea("workDelay", 100);
    ea("flattenSpans", !0, G, !0);
    ea("addModeClass", !1, G, !0);
    ea("pollInterval", 100);
    ea("undoDepth", 200, function(a, b) {
      a.doc.history.undoDepth = b;
    });
    ea("historyEventDelay", 1250);
    ea("viewportMargin", 10, function(a) {
      a.refresh();
    }, !0);
    ea("maxHighlightLength", 1E4, G, !0);
    ea("moveInputWithCursor", !0, function(a, b) {
      b || a.display.input.resetPosition();
    });
    ea("tabindex", null, function(a, b) {
      a.display.input.getField().tabIndex = b || "";
    });
    ea("autofocus", null);
    var Xf = x.modes = {}, od = x.mimeModes = {};
    x.defineMode = function(a, b) {
      x.defaults.mode || "null" == a || (x.defaults.mode = a);
      2 < arguments.length && (b.dependencies = Array.prototype.slice.call(arguments, 2));
      Xf[a] = b;
    };
    x.defineMIME = function(a, b) {
      od[a] = b;
    };
    x.resolveMode = function(a) {
      if ("string" == typeof a && od.hasOwnProperty(a)) {
        a = od[a];
      } else if (a && "string" == typeof a.name && od.hasOwnProperty(a.name)) {
        var b = od[a.name];
        "string" == typeof b && (b = {name:b});
        a = Nf(b, a);
        a.name = b.name;
      } else {
        if ("string" == typeof a && /^[\w\-]+\/[\w\-]+\+xml$/.test(a)) {
          return x.resolveMode("application/xml");
        }
        if ("string" == typeof a && /^[\w\-]+\/[\w\-]+\+json$/.test(a)) {
          return x.resolveMode("application/json");
        }
      }
      return "string" == typeof a ? {name:a} : a || {name:"null"};
    };
    x.getMode = function(a, b) {
      b = x.resolveMode(b);
      var c = Xf[b.name];
      if (!c) {
        return x.getMode(a, "text/plain");
      }
      a = c(a, b);
      if (pd.hasOwnProperty(b.name)) {
        c = pd[b.name];
        for (var d in c) {
          c.hasOwnProperty(d) && (a.hasOwnProperty(d) && (a["_" + d] = a[d]), a[d] = c[d]);
        }
      }
      if (a.name = b.name, b.helperType && (a.helperType = b.helperType), b.modeProps) {
        for (d in b.modeProps) {
          a[d] = b.modeProps[d];
        }
      }
      return a;
    };
    x.defineMode("null", function() {
      return {token:function(a) {
        a.skipToEnd();
      }};
    });
    x.defineMIME("text/plain", "null");
    var pd = x.modeExtensions = {};
    x.extendMode = function(a, b) {
      a = pd.hasOwnProperty(a) ? pd[a] : pd[a] = {};
      pb(b, a);
    };
    x.defineExtension = function(a, b) {
      x.prototype[a] = b;
    };
    x.defineDocExtension = function(a, b) {
      Za.prototype[a] = b;
    };
    x.defineOption = ea;
    var ae = [];
    x.defineInitHook = function(a) {
      ae.push(a);
    };
    var Lc = x.helpers = {};
    x.registerHelper = function(a, b, c) {
      Lc.hasOwnProperty(a) || (Lc[a] = x[a] = {_global:[]});
      Lc[a][b] = c;
    };
    x.registerGlobalHelper = function(a, b, c, d) {
      x.registerHelper(a, b, d);
      Lc[a]._global.push({pred:c, val:d});
    };
    var Wb = x.copyState = function(a, b) {
      if (!0 === b) {
        return b;
      }
      if (a.copyState) {
        return a.copyState(b);
      }
      a = {};
      for (var c in b) {
        var d = b[c];
        d instanceof Array && (d = d.concat([]));
        a[c] = d;
      }
      return a;
    }, bg = x.startState = function(a, b, c) {
      return !a.startState || a.startState(b, c);
    };
    x.innerMode = function(a, b) {
      for (; a.innerMode;) {
        var c = a.innerMode(b);
        if (!c || c.mode == a) {
          break;
        }
        b = c.state;
        a = c.mode;
      }
      return c || {mode:a, state:b};
    };
    var Kd = x.commands = {selectAll:function(a) {
      a.setSelection(K(a.firstLine(), 0), K(a.lastLine()), Ab);
    }, singleSelection:function(a) {
      a.setSelection(a.getCursor("anchor"), a.getCursor("head"), Ab);
    }, killLine:function(a) {
      Fc(a, function(b) {
        if (b.empty()) {
          var c = Z(a.doc, b.head.line).text.length;
          return b.head.ch == c && b.head.line < a.lastLine() ? {from:b.head, to:K(b.head.line + 1, 0)} : {from:b.head, to:K(b.head.line, c)};
        }
        return {from:b.from(), to:b.to()};
      });
    }, deleteLine:function(a) {
      Fc(a, function(b) {
        return {from:K(b.from().line, 0), to:ba(a.doc, K(b.to().line + 1, 0))};
      });
    }, delLineLeft:function(a) {
      Fc(a, function(b) {
        return {from:K(b.from().line, 0), to:b.from()};
      });
    }, delWrappedLineLeft:function(a) {
      Fc(a, function(b) {
        var c = a.charCoords(b.head, "div").top + 5;
        return {from:a.coordsChar({left:0, top:c}, "div"), to:b.from()};
      });
    }, delWrappedLineRight:function(a) {
      Fc(a, function(b) {
        var c = a.charCoords(b.head, "div").top + 5;
        c = a.coordsChar({left:a.display.lineDiv.offsetWidth + 100, top:c}, "div");
        return {from:b.from(), to:c};
      });
    }, undo:function(a) {
      a.undo();
    }, redo:function(a) {
      a.redo();
    }, undoSelection:function(a) {
      a.undoSelection();
    }, redoSelection:function(a) {
      a.redoSelection();
    }, goDocStart:function(a) {
      a.extendSelection(K(a.firstLine(), 0));
    }, goDocEnd:function(a) {
      a.extendSelection(K(a.lastLine()));
    }, goLineStart:function(a) {
      a.extendSelectionsBy(function(b) {
        return Rf(a, b.head.line);
      }, {origin:"+move", bias:1});
    }, goLineStartSmart:function(a) {
      a.extendSelectionsBy(function(b) {
        return Sf(a, b.head);
      }, {origin:"+move", bias:1});
    }, goLineEnd:function(a) {
      a.extendSelectionsBy(function(b) {
        b = b.head.line;
        for (var c, d = Z(a.doc, b); c = cc(d, !1);) {
          d = c.find(1, !0).line, b = null;
        }
        c = (c = sb(d)) ? c[0].level % 2 ? Ad(d) : Bd(d) : d.text.length;
        return K(null == b ? ya(d) : b, c);
      }, {origin:"+move", bias:-1});
    }, goLineRight:function(a) {
      a.extendSelectionsBy(function(b) {
        b = a.charCoords(b.head, "div").top + 5;
        return a.coordsChar({left:a.display.lineDiv.offsetWidth + 100, top:b}, "div");
      }, nd);
    }, goLineLeft:function(a) {
      a.extendSelectionsBy(function(b) {
        b = a.charCoords(b.head, "div").top + 5;
        return a.coordsChar({left:0, top:b}, "div");
      }, nd);
    }, goLineLeftSmart:function(a) {
      a.extendSelectionsBy(function(b) {
        var c = a.charCoords(b.head, "div").top + 5;
        c = a.coordsChar({left:0, top:c}, "div");
        return c.ch < a.getLine(c.line).search(/\S/) ? Sf(a, b.head) : c;
      }, nd);
    }, goLineUp:function(a) {
      a.moveV(-1, "line");
    }, goLineDown:function(a) {
      a.moveV(1, "line");
    }, goPageUp:function(a) {
      a.moveV(-1, "page");
    }, goPageDown:function(a) {
      a.moveV(1, "page");
    }, goCharLeft:function(a) {
      a.moveH(-1, "char");
    }, goCharRight:function(a) {
      a.moveH(1, "char");
    }, goColumnLeft:function(a) {
      a.moveH(-1, "column");
    }, goColumnRight:function(a) {
      a.moveH(1, "column");
    }, goWordLeft:function(a) {
      a.moveH(-1, "word");
    }, goGroupRight:function(a) {
      a.moveH(1, "group");
    }, goGroupLeft:function(a) {
      a.moveH(-1, "group");
    }, goWordRight:function(a) {
      a.moveH(1, "word");
    }, delCharBefore:function(a) {
      a.deleteH(-1, "char");
    }, delCharAfter:function(a) {
      a.deleteH(1, "char");
    }, delWordBefore:function(a) {
      a.deleteH(-1, "word");
    }, delWordAfter:function(a) {
      a.deleteH(1, "word");
    }, delGroupBefore:function(a) {
      a.deleteH(-1, "group");
    }, delGroupAfter:function(a) {
      a.deleteH(1, "group");
    }, indentAuto:function(a) {
      a.indentSelection("smart");
    }, indentMore:function(a) {
      a.indentSelection("add");
    }, indentLess:function(a) {
      a.indentSelection("subtract");
    }, insertTab:function(a) {
      a.replaceSelection("\t");
    }, insertSoftTab:function(a) {
      for (var b = [], c = a.listSelections(), d = a.options.tabSize, e = 0; e < c.length; e++) {
        var g = c[e].from();
        g = vb(a.getLine(g.line), g.ch, d);
        b.push(we(d - g % d));
      }
      a.replaceSelections(b);
    }, defaultTab:function(a) {
      a.somethingSelected() ? a.indentSelection("add") : a.execCommand("insertTab");
    }, transposeChars:function(a) {
      db(a, function() {
        for (var b = a.listSelections(), c = [], d = 0; d < b.length; d++) {
          var e = b[d].head, g = Z(a.doc, e.line).text;
          if (g) {
            if (e.ch == g.length && (e = new K(e.line, e.ch - 1)), 0 < e.ch) {
              e = new K(e.line, e.ch + 1), a.replaceRange(g.charAt(e.ch - 1) + g.charAt(e.ch - 2), K(e.line, e.ch - 2), e, "+transpose");
            } else if (e.line > a.doc.first) {
              var h = Z(a.doc, e.line - 1).text;
              h && a.replaceRange(g.charAt(0) + a.doc.lineSeparator() + h.charAt(h.length - 1), K(e.line - 1, h.length - 1), K(e.line, 1), "+transpose");
            }
          }
          c.push(new sa(e, e));
        }
        a.setSelections(c);
      });
    }, newlineAndIndent:function(a) {
      db(a, function() {
        for (var b = a.listSelections().length, c = 0; c < b; c++) {
          var d = a.listSelections()[c];
          a.replaceRange(a.doc.lineSeparator(), d.anchor, d.head, "+input");
          a.indentLine(d.from().line + 1, null, !0);
        }
        wc(a);
      });
    }, openLine:function(a) {
      a.replaceSelection("\n", "start");
    }, toggleOverwrite:function(a) {
      a.toggleOverwrite();
    }}, Xb = x.keyMap = {};
    Xb.basic = {Left:"goCharLeft", Right:"goCharRight", Up:"goLineUp", Down:"goLineDown", End:"goLineEnd", Home:"goLineStartSmart", PageUp:"goPageUp", PageDown:"goPageDown", Delete:"delCharAfter", Backspace:"delCharBefore", "Shift-Backspace":"delCharBefore", Tab:"defaultTab", "Shift-Tab":"indentAuto", Enter:"newlineAndIndent", Insert:"toggleOverwrite", Esc:"singleSelection"};
    Xb.pcDefault = {"Ctrl-A":"selectAll", "Ctrl-D":"deleteLine", "Ctrl-Z":"undo", "Shift-Ctrl-Z":"redo", "Ctrl-Y":"redo", "Ctrl-Home":"goDocStart", "Ctrl-End":"goDocEnd", "Ctrl-Up":"goLineUp", "Ctrl-Down":"goLineDown", "Ctrl-Left":"goGroupLeft", "Ctrl-Right":"goGroupRight", "Alt-Left":"goLineStart", "Alt-Right":"goLineEnd", "Ctrl-Backspace":"delGroupBefore", "Ctrl-Delete":"delGroupAfter", "Ctrl-S":"save", "Ctrl-F":"find", "Ctrl-G":"findNext", "Shift-Ctrl-G":"findPrev", "Shift-Ctrl-F":"replace", "Shift-Ctrl-R":"replaceAll", 
    "Ctrl-[":"indentLess", "Ctrl-]":"indentMore", "Ctrl-U":"undoSelection", "Shift-Ctrl-U":"redoSelection", "Alt-U":"redoSelection", fallthrough:"basic"};
    Xb.emacsy = {"Ctrl-F":"goCharRight", "Ctrl-B":"goCharLeft", "Ctrl-P":"goLineUp", "Ctrl-N":"goLineDown", "Alt-F":"goWordRight", "Alt-B":"goWordLeft", "Ctrl-A":"goLineStart", "Ctrl-E":"goLineEnd", "Ctrl-V":"goPageDown", "Shift-Ctrl-V":"goPageUp", "Ctrl-D":"delCharAfter", "Ctrl-H":"delCharBefore", "Alt-D":"delWordAfter", "Alt-Backspace":"delWordBefore", "Ctrl-K":"killLine", "Ctrl-T":"transposeChars", "Ctrl-O":"openLine"};
    Xb.macDefault = {"Cmd-A":"selectAll", "Cmd-D":"deleteLine", "Cmd-Z":"undo", "Shift-Cmd-Z":"redo", "Cmd-Y":"redo", "Cmd-Home":"goDocStart", "Cmd-Up":"goDocStart", "Cmd-End":"goDocEnd", "Cmd-Down":"goDocEnd", "Alt-Left":"goGroupLeft", "Alt-Right":"goGroupRight", "Cmd-Left":"goLineLeft", "Cmd-Right":"goLineRight", "Alt-Backspace":"delGroupBefore", "Ctrl-Alt-Backspace":"delGroupAfter", "Alt-Delete":"delGroupAfter", "Cmd-S":"save", "Cmd-F":"find", "Cmd-G":"findNext", "Shift-Cmd-G":"findPrev", "Cmd-Alt-F":"replace", 
    "Shift-Cmd-Alt-F":"replaceAll", "Cmd-[":"indentLess", "Cmd-]":"indentMore", "Cmd-Backspace":"delWrappedLineLeft", "Cmd-Delete":"delWrappedLineRight", "Cmd-U":"undoSelection", "Shift-Cmd-U":"redoSelection", "Ctrl-Up":"goDocStart", "Ctrl-Down":"goDocEnd", fallthrough:["basic", "emacsy"]};
    Xb.default = rb ? Xb.macDefault : Xb.pcDefault;
    x.normalizeKeyMap = function(a) {
      var b = {}, c;
      for (c in a) {
        if (a.hasOwnProperty(c)) {
          var d = a[c];
          if (!/^(name|fallthrough|(de|at)tach)$/.test(c)) {
            if ("..." != d) {
              for (var e = sd(c.split(" "), wg), g = 0; g < e.length; g++) {
                var h, l;
                g == e.length - 1 ? (l = e.join(" "), h = d) : (l = e.slice(0, g + 1).join(" "), h = "...");
                var m = b[l];
                if (m) {
                  if (m != h) {
                    throw Error("Inconsistent bindings for " + l);
                  }
                } else {
                  b[l] = h;
                }
              }
            }
            delete a[c];
          }
        }
      }
      for (var p in b) {
        a[p] = b[p];
      }
      return a;
    };
    var ed = x.lookupKey = function(a, b, c, d) {
      b = Rd(b);
      var e = b.call ? b.call(a, d) : b[a];
      if (!1 === e) {
        return "nothing";
      }
      if ("..." === e) {
        return "multi";
      }
      if (null != e && c(e)) {
        return "handled";
      }
      if (b.fallthrough) {
        if ("[object Array]" != Object.prototype.toString.call(b.fallthrough)) {
          return ed(a, b.fallthrough, c, d);
        }
        for (e = 0; e < b.fallthrough.length; e++) {
          var g = ed(a, b.fallthrough[e], c, d);
          if (g) {
            return g;
          }
        }
      }
    }, pg = x.isModifierKey = function(a) {
      a = "string" == typeof a ? a : qc[a.keyCode];
      return "Ctrl" == a || "Alt" == a || "Shift" == a || "Mod" == a;
    }, rg = x.keyName = function(a, b) {
      if (wb && 34 == a.keyCode && a.char) {
        return !1;
      }
      var c = qc[a.keyCode], d = c;
      return null != d && !a.altGraphKey && (a.altKey && "Alt" != c && (d = "Alt-" + d), (Wf ? a.metaKey : a.ctrlKey) && "Ctrl" != c && (d = "Ctrl-" + d), (Wf ? a.ctrlKey : a.metaKey) && "Cmd" != c && (d = "Cmd-" + d), !b && a.shiftKey && "Shift" != c && (d = "Shift-" + d), d);
    };
    x.fromTextArea = function(a, b) {
      function c() {
        a.value = l.getValue();
      }
      if (b = b ? pb(b) : {}, b.value = a.value, !b.tabindex && a.tabIndex && (b.tabindex = a.tabIndex), !b.placeholder && a.placeholder && (b.placeholder = a.placeholder), null == b.autofocus) {
        var d = zb();
        b.autofocus = d == a || null != a.getAttribute("autofocus") && d == document.body;
      }
      if (a.form && (ca(a.form, "submit", c), !b.leaveSubmitMethodAlone)) {
        var e = a.form, g = e.submit;
        try {
          var h = e.submit = function() {
            c();
            e.submit = g;
            e.submit();
            e.submit = h;
          };
        } catch (m) {
        }
      }
      b.finishInit = function(m) {
        m.save = c;
        m.getTextArea = function() {
          return a;
        };
        m.toTextArea = function() {
          m.toTextArea = isNaN;
          c();
          a.parentNode.removeChild(m.getWrapperElement());
          a.style.display = "";
          a.form && (Cb(a.form, "submit", c), "function" == typeof a.form.submit && (a.form.submit = g));
        };
      };
      a.style.display = "none";
      var l = x(function(m) {
        a.parentNode.insertBefore(m, a.nextSibling);
      }, b);
      return l;
    };
    var Vd = x.StringStream = function(a, b) {
      this.pos = this.start = 0;
      this.string = a;
      this.tabSize = b || 8;
      this.lineStart = this.lastColumnPos = this.lastColumnValue = 0;
    };
    Vd.prototype = {eol:function() {
      return this.pos >= this.string.length;
    }, sol:function() {
      return this.pos == this.lineStart;
    }, peek:function() {
      return this.string.charAt(this.pos) || void 0;
    }, next:function() {
      if (this.pos < this.string.length) {
        return this.string.charAt(this.pos++);
      }
    }, eat:function(a) {
      var b = this.string.charAt(this.pos);
      if ("string" == typeof a ? b == a : b && (a.test ? a.test(b) : a(b))) {
        return ++this.pos, b;
      }
    }, eatWhile:function(a) {
      for (var b = this.pos; this.eat(a);) {
      }
      return this.pos > b;
    }, eatSpace:function() {
      for (var a = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));) {
        ++this.pos;
      }
      return this.pos > a;
    }, skipToEnd:function() {
      this.pos = this.string.length;
    }, skipTo:function(a) {
      a = this.string.indexOf(a, this.pos);
      if (-1 < a) {
        return this.pos = a, !0;
      }
    }, backUp:function(a) {
      this.pos -= a;
    }, column:function() {
      return this.lastColumnPos < this.start && (this.lastColumnValue = vb(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? vb(this.string, this.lineStart, this.tabSize) : 0);
    }, indentation:function() {
      return vb(this.string, null, this.tabSize) - (this.lineStart ? vb(this.string, this.lineStart, this.tabSize) : 0);
    }, match:function(a, b, c) {
      if ("string" != typeof a) {
        return (a = this.string.slice(this.pos).match(a)) && 0 < a.index ? null : (a && !1 !== b && (this.pos += a[0].length), a);
      }
      var d = function(g) {
        return c ? g.toLowerCase() : g;
      }, e = this.string.substr(this.pos, a.length);
      if (d(e) == d(a)) {
        return !1 !== b && (this.pos += a.length), !0;
      }
    }, current:function() {
      return this.string.slice(this.start, this.pos);
    }, hideFirstChars:function(a, b) {
      this.lineStart += a;
      try {
        return b();
      } finally {
        this.lineStart -= a;
      }
    }};
    var ye = 0, pc = x.TextMarker = function(a, b) {
      this.lines = [];
      this.type = b;
      this.doc = a;
      this.id = ++ye;
    };
    Ic(pc);
    pc.prototype.clear = function() {
      if (!this.explicitlyCleared) {
        var a = this.doc.cm, b = a && !a.curOp;
        if (b && rc(a), kb(this, "clear")) {
          var c = this.find();
          c && $a(this, "clear", c.from, c.to);
        }
        for (var d = c = null, e = 0; e < this.lines.length; ++e) {
          var g = this.lines[e], h = gd(g.markedSpans, this);
          a && !this.collapsed ? Jb(a, ya(g), "text") : a && (null != h.to && (d = ya(g)), null != h.from && (c = ya(g)));
          for (var l = g, m = void 0, p = g.markedSpans, t = h, v = 0; v < p.length; ++v) {
            p[v] != t && (m ||= []).push(p[v]);
          }
          l.markedSpans = m;
          null == h.from && this.collapsed && !bc(this.doc, g) && a && xb(g, ac(a.display));
        }
        if (a && this.collapsed && !a.options.lineWrapping) {
          for (e = 0; e < this.lines.length; ++e) {
            g = Bb(this.lines[e]), h = S(g), h > a.display.maxLineLength && (a.display.maxLine = g, a.display.maxLineLength = h, a.display.maxLineChanged = !0);
          }
        }
        null != c && a && this.collapsed && Qa(a, c, d + 1);
        this.lines.length = 0;
        this.explicitlyCleared = !0;
        this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, a && jc(a.doc));
        a && $a(a, "markerCleared", a, this);
        b && tc(a);
        this.parent && this.parent.clear();
      }
    };
    pc.prototype.find = function(a, b) {
      null == a && "bookmark" == this.type && (a = 1);
      for (var c, d, e = 0; e < this.lines.length; ++e) {
        var g = this.lines[e], h = gd(g.markedSpans, this);
        if (null != h.from && (c = K(b ? g : ya(g), h.from), -1 == a)) {
          return c;
        }
        if (null != h.to && (d = K(b ? g : ya(g), h.to), 1 == a)) {
          return d;
        }
      }
      return c && {from:c, to:d};
    };
    pc.prototype.changed = function() {
      var a = this.find(-1, !0), b = this, c = this.doc.cm;
      a && c && db(c, function() {
        var d = a.line, e = ya(a.line);
        e = Ra(c, e);
        (e && (Te(e), c.curOp.selectionChanged = c.curOp.forceUpdate = !0), c.curOp.updateMaxLine = !0, bc(b.doc, d) || null == b.height) || (e = b.height, b.height = null, (e = cd(b) - e) && xb(d, d.height + e));
      });
    };
    pc.prototype.attachLine = function(a) {
      if (!this.lines.length && this.doc.cm) {
        var b = this.doc.cm.curOp;
        b.maybeHiddenMarkers && -1 != Oa(b.maybeHiddenMarkers, this) || (b.maybeUnhiddenMarkers || (b.maybeUnhiddenMarkers = [])).push(this);
      }
      this.lines.push(a);
    };
    pc.prototype.detachLine = function(a) {
      if (this.lines.splice(Oa(this.lines, a), 1), !this.lines.length && this.doc.cm) {
        a = this.doc.cm.curOp, (a.maybeHiddenMarkers || (a.maybeHiddenMarkers = [])).push(this);
      }
    };
    ye = 0;
    var Td = x.SharedTextMarker = function(a, b) {
      this.markers = a;
      this.primary = b;
      for (b = 0; b < a.length; ++b) {
        a[b].parent = this;
      }
    };
    Ic(Td);
    Td.prototype.clear = function() {
      if (!this.explicitlyCleared) {
        this.explicitlyCleared = !0;
        for (var a = 0; a < this.markers.length; ++a) {
          this.markers[a].clear();
        }
        $a(this, "clear");
      }
    };
    Td.prototype.find = function(a, b) {
      return this.primary.find(a, b);
    };
    var Ud = x.LineWidget = function(a, b, c) {
      if (c) {
        for (var d in c) {
          c.hasOwnProperty(d) && (this[d] = c[d]);
        }
      }
      this.doc = a;
      this.node = b;
    };
    Ic(Ud);
    Ud.prototype.clear = function() {
      var a = this.doc.cm, b = this.line.widgets, c = this.line, d = ya(c);
      if (null != d && b) {
        for (var e = 0; e < b.length; ++e) {
          b[e] == this && b.splice(e--, 1);
        }
        b.length || (c.widgets = null);
        var g = cd(this);
        xb(c, Math.max(0, c.height - g));
        a && db(a, function() {
          var h = -g;
          yb(c) < (a.curOp && a.curOp.scrollTop || a.doc.scrollTop) && Nd(a, null, h);
          Jb(a, d, "widget");
        });
      }
    };
    Ud.prototype.changed = function() {
      var a = this.height, b = this.doc.cm, c = this.line;
      this.height = null;
      var d = cd(this) - a;
      d && (xb(c, c.height + d), b && db(b, function() {
        b.curOp.forceUpdate = !0;
        yb(c) < (b.curOp && b.curOp.scrollTop || b.doc.scrollTop) && Nd(b, null, d);
      }));
    };
    var hd = x.Line = function(a, b, c) {
      this.text = a;
      Bf(this, b);
      this.height = c ? c(this) : 1;
    };
    Ic(hd);
    hd.prototype.lineNo = function() {
      return ya(this);
    };
    var Bg = {}, Ag = {};
    id.prototype = {chunkSize:function() {
      return this.lines.length;
    }, removeInner:function(a, b) {
      for (var c = a, d = a + b; c < d; ++c) {
        var e = this.lines[c];
        this.height -= e.height;
        var g = e;
        g.parent = null;
        Af(g);
        $a(e, "delete");
      }
      this.lines.splice(a, b);
    }, collapse:function(a) {
      a.push.apply(a, this.lines);
    }, insertInner:function(a, b, c) {
      this.height += c;
      this.lines = this.lines.slice(0, a).concat(b).concat(this.lines.slice(a));
      for (a = 0; a < b.length; ++a) {
        b[a].parent = this;
      }
    }, iterN:function(a, b, c) {
      for (b = a + b; a < b; ++a) {
        if (c(this.lines[a])) {
          return !0;
        }
      }
    }};
    jd.prototype = {chunkSize:function() {
      return this.size;
    }, removeInner:function(a, b) {
      this.size -= b;
      for (var c = 0; c < this.children.length; ++c) {
        var d = this.children[c], e = d.chunkSize();
        if (a < e) {
          var g = Math.min(b, e - a), h = d.height;
          if (d.removeInner(a, g), this.height -= h - d.height, e == g && (this.children.splice(c--, 1), d.parent = null), 0 == (b -= g)) {
            break;
          }
          a = 0;
        } else {
          a -= e;
        }
      }
      25 > this.size - b && (1 < this.children.length || !(this.children[0] instanceof id)) && (a = [], this.collapse(a), this.children = [new id(a)], this.children[0].parent = this);
    }, collapse:function(a) {
      for (var b = 0; b < this.children.length; ++b) {
        this.children[b].collapse(a);
      }
    }, insertInner:function(a, b, c) {
      this.size += b.length;
      this.height += c;
      for (var d = 0; d < this.children.length; ++d) {
        var e = this.children[d], g = e.chunkSize();
        if (a <= g) {
          if (e.insertInner(a, b, c), e.lines && 50 < e.lines.length) {
            for (b = a = e.lines.length % 25 + 25; b < e.lines.length;) {
              c = new id(e.lines.slice(b, b += 25)), e.height -= c.height, this.children.splice(++d, 0, c), c.parent = this;
            }
            e.lines = e.lines.slice(0, a);
            this.maybeSpill();
          }
          break;
        }
        a -= g;
      }
    }, maybeSpill:function() {
      if (!(10 >= this.children.length)) {
        var a = this;
        do {
          var b = a.children.splice(a.children.length - 5, 5);
          b = new jd(b);
          if (a.parent) {
            a.size -= b.size;
            a.height -= b.height;
            var c = Oa(a.parent.children, a);
            a.parent.children.splice(c + 1, 0, b);
          } else {
            c = new jd(a.children), c.parent = a, a.children = [c, b], a = c;
          }
          b.parent = a.parent;
        } while (10 < a.children.length);
        a.parent.maybeSpill();
      }
    }, iterN:function(a, b, c) {
      for (var d = 0; d < this.children.length; ++d) {
        var e = this.children[d], g = e.chunkSize();
        if (a < g) {
          g = Math.min(b, g - a);
          if (e.iterN(a, g, c)) {
            return !0;
          }
          if (0 == (b -= g)) {
            break;
          }
          a = 0;
        } else {
          a -= g;
        }
      }
    }};
    var Ng = 0, Za = x.Doc = function(a, b, c, d) {
      if (!(this instanceof Za)) {
        return new Za(a, b, c, d);
      }
      null == c && (c = 0);
      jd.call(this, [new id([new hd("", null)])]);
      this.first = c;
      this.scrollTop = this.scrollLeft = 0;
      this.cantEdit = !1;
      this.cleanGeneration = 1;
      this.frontier = c;
      c = K(c, 0);
      this.sel = Ka(c);
      this.history = new Wd(null);
      this.id = ++Ng;
      this.modeOption = b;
      this.lineSep = d;
      this.extend = !1;
      "string" == typeof a && (a = this.splitLines(a));
      ve(this, {from:c, to:c, text:a});
      Ga(this, Ka(c), Ab);
    };
    Za.prototype = Nf(jd.prototype, {constructor:Za, iter:function(a, b, c) {
      c ? this.iterN(a - this.first, b - a, c) : this.iterN(this.first, this.first + this.size, a);
    }, insert:function(a, b) {
      for (var c = 0, d = 0; d < b.length; ++d) {
        c += b[d].height;
      }
      this.insertInner(a - this.first, b, c);
    }, remove:function(a, b) {
      this.removeInner(a - this.first, b);
    }, getValue:function(a) {
      var b = Ee(this, this.first, this.first + this.size);
      return !1 === a ? b : b.join(a || this.lineSeparator());
    }, setValue:Ta(function(a) {
      var b = K(this.first, 0), c = this.first + this.size - 1;
      vc(this, {from:b, to:K(c, Z(this, c).text.length), text:this.splitLines(a), origin:"setValue", full:!0}, !0);
      Ga(this, Ka(b));
    }), replaceRange:function(a, b, c, d) {
      b = ba(this, b);
      c = c ? ba(this, c) : b;
      Ec(this, a, b, c, d);
    }, getRange:function(a, b, c) {
      a = hc(this, ba(this, a), ba(this, b));
      return !1 === c ? a : a.join(c || this.lineSeparator());
    }, getLine:function(a) {
      return (a = this.getLineHandle(a)) && a.text;
    }, getLineHandle:function(a) {
      if (ic(this, a)) {
        return Z(this, a);
      }
    }, getLineNumber:function(a) {
      return ya(a);
    }, getLineHandleVisualStart:function(a) {
      return "number" == typeof a && (a = Z(this, a)), Bb(a);
    }, lineCount:function() {
      return this.size;
    }, firstLine:function() {
      return this.first;
    }, lastLine:function() {
      return this.first + this.size - 1;
    }, clipPos:function(a) {
      return ba(this, a);
    }, getCursor:function(a) {
      var b = this.sel.primary();
      return null == a || "head" == a ? b.head : "anchor" == a ? b.anchor : "end" == a || "to" == a || !1 === a ? b.to() : b.from();
    }, listSelections:function() {
      return this.sel.ranges;
    }, somethingSelected:function() {
      return this.sel.somethingSelected();
    }, setCursor:Ta(function(a, b, c) {
      a = ba(this, "number" == typeof a ? K(a, b || 0) : a);
      Ga(this, Ka(a, null), c);
    }), setSelection:Ta(function(a, b, c) {
      var d = ba(this, a);
      a = ba(this, b || a);
      Ga(this, Ka(d, a), c);
    }), extendSelection:Ta(function(a, b, c) {
      yc(this, ba(this, a), b && ba(this, b), c);
    }), extendSelections:Ta(function(a, b) {
      ud(this, Wc(this, a), b);
    }), extendSelectionsBy:Ta(function(a, b) {
      a = sd(this.sel.ranges, a);
      ud(this, Wc(this, a), b);
    }), setSelections:Ta(function(a, b, c) {
      if (a.length) {
        for (var d = 0, e = []; d < a.length; d++) {
          e[d] = new sa(ba(this, a[d].anchor), ba(this, a[d].head));
        }
        null == b && (b = Math.min(a.length - 1, this.sel.primIndex));
        Ga(this, ab(e, b), c);
      }
    }), addSelection:Ta(function(a, b, c) {
      var d = this.sel.ranges.slice(0);
      d.push(new sa(ba(this, a), ba(this, b || a)));
      Ga(this, ab(d, d.length - 1), c);
    }), getSelection:function(a) {
      for (var b, c = this.sel.ranges, d = 0; d < c.length; d++) {
        var e = hc(this, c[d].from(), c[d].to());
        b = b ? b.concat(e) : e;
      }
      return !1 === a ? b : b.join(a || this.lineSeparator());
    }, getSelections:function(a) {
      for (var b = [], c = this.sel.ranges, d = 0; d < c.length; d++) {
        var e = hc(this, c[d].from(), c[d].to());
        !1 !== a && (e = e.join(a || this.lineSeparator()));
        b[d] = e;
      }
      return b;
    }, replaceSelection:function(a, b, c) {
      for (var d = [], e = 0; e < this.sel.ranges.length; e++) {
        d[e] = a;
      }
      this.replaceSelections(d, b, c || "+input");
    }, replaceSelections:Ta(function(a, b, c) {
      for (var d = [], e = this.sel, g = 0; g < e.ranges.length; g++) {
        var h = e.ranges[g];
        d[g] = {from:h.from(), to:h.to(), text:this.splitLines(a[g]), origin:c};
      }
      if (g = b && "end" != b) {
        g = [];
        c = a = K(this.first, 0);
        for (e = 0; e < d.length; e++) {
          var l = d[e];
          h = mf(l.from, a, c);
          var m = mf(nc(l), a, c);
          (a = l.to, c = m, "around" == b) ? (l = this.sel.ranges[e], l = 0 > fa(l.head, l.anchor), g[e] = new sa(l ? m : h, l ? h : m)) : g[e] = new sa(h, h);
        }
        g = new tb(g, this.sel.primIndex);
      }
      b = g;
      for (g = d.length - 1; 0 <= g; g--) {
        vc(this, d[g]);
      }
      b ? vd(this, b) : this.cm && wc(this.cm);
    }), undo:Ta(function() {
      Md(this, "undo");
    }), redo:Ta(function() {
      Md(this, "redo");
    }), undoSelection:Ta(function() {
      Md(this, "undo", !0);
    }), redoSelection:Ta(function() {
      Md(this, "redo", !0);
    }), setExtending:function(a) {
      this.extend = a;
    }, getExtending:function() {
      return this.extend;
    }, historySize:function() {
      for (var a = this.history, b = 0, c = 0, d = 0; d < a.done.length; d++) {
        a.done[d].ranges || ++b;
      }
      for (d = 0; d < a.undone.length; d++) {
        a.undone[d].ranges || ++c;
      }
      return {undo:b, redo:c};
    }, clearHistory:function() {
      this.history = new Wd(this.history.maxGeneration);
    }, markClean:function() {
      this.cleanGeneration = this.changeGeneration(!0);
    }, changeGeneration:function(a) {
      return a && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation;
    }, isClean:function(a) {
      return this.history.generation == (a || this.cleanGeneration);
    }, getHistory:function() {
      return {done:Hc(this.history.done), undone:Hc(this.history.undone)};
    }, setHistory:function(a) {
      var b = this.history = new Wd(this.history.maxGeneration);
      b.done = Hc(a.done.slice(0), null, !0);
      b.undone = Hc(a.undone.slice(0), null, !0);
    }, addLineClass:Ta(function(a, b, c) {
      return Pd(this, a, "gutter" == b ? "gutter" : "class", function(d) {
        var e = "text" == b ? "textClass" : "background" == b ? "bgClass" : "gutter" == b ? "gutterClass" : "wrapClass";
        if (d[e]) {
          if (md(c).test(d[e])) {
            return !1;
          }
          d[e] += " " + c;
        } else {
          d[e] = c;
        }
        return !0;
      });
    }), removeLineClass:Ta(function(a, b, c) {
      return Pd(this, a, "gutter" == b ? "gutter" : "class", function(d) {
        var e = "text" == b ? "textClass" : "background" == b ? "bgClass" : "gutter" == b ? "gutterClass" : "wrapClass", g = d[e];
        if (!g) {
          return !1;
        }
        if (null == c) {
          d[e] = null;
        } else {
          var h = g.match(md(c));
          if (!h) {
            return !1;
          }
          var l = h.index + h[0].length;
          d[e] = g.slice(0, h.index) + (h.index && l != g.length ? " " : "") + g.slice(l) || null;
        }
        return !0;
      });
    }), addLineWidget:Ta(function(a, b, c) {
      return zg(this, a, b, c);
    }), removeLineWidget:function(a) {
      a.clear();
    }, markText:function(a, b, c) {
      return Gc(this, ba(this, a), ba(this, b), c, c && c.type || "range");
    }, setBookmark:function(a, b) {
      b = {replacedWith:b && (null == b.nodeType ? b.widget : b), insertLeft:b && b.insertLeft, clearWhenEmpty:!1, shared:b && b.shared, handleMouseEvents:b && b.handleMouseEvents};
      return a = ba(this, a), Gc(this, a, a, b, "bookmark");
    }, findMarksAt:function(a) {
      a = ba(this, a);
      var b = [], c = Z(this, a.line).markedSpans;
      if (c) {
        for (var d = 0; d < c.length; ++d) {
          var e = c[d];
          (null == e.from || e.from <= a.ch) && (null == e.to || e.to >= a.ch) && b.push(e.marker.parent || e.marker);
        }
      }
      return b;
    }, findMarks:function(a, b, c) {
      a = ba(this, a);
      b = ba(this, b);
      var d = [], e = a.line;
      return this.iter(a.line, b.line + 1, function(g) {
        if (g = g.markedSpans) {
          for (var h = 0; h < g.length; h++) {
            var l = g[h];
            null != l.to && e == a.line && a.ch >= l.to || null == l.from && e != a.line || null != l.from && e == b.line && l.from >= b.ch || c && !c(l.marker) || d.push(l.marker.parent || l.marker);
          }
        }
        ++e;
      }), d;
    }, getAllMarks:function() {
      var a = [];
      return this.iter(function(b) {
        if (b = b.markedSpans) {
          for (var c = 0; c < b.length; ++c) {
            null != b[c].from && a.push(b[c].marker);
          }
        }
      }), a;
    }, posFromIndex:function(a) {
      var b, c = this.first, d = this.lineSeparator().length;
      return this.iter(function(e) {
        e = e.text.length + d;
        return e > a ? (b = a, !0) : (a -= e, void++c);
      }), ba(this, K(c, b));
    }, indexFromPos:function(a) {
      a = ba(this, a);
      var b = a.ch;
      if (a.line < this.first || 0 > a.ch) {
        return 0;
      }
      var c = this.lineSeparator().length;
      return this.iter(this.first, a.line, function(d) {
        b += d.text.length + c;
      }), b;
    }, copy:function(a) {
      var b = new Za(Ee(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep);
      return b.scrollTop = this.scrollTop, b.scrollLeft = this.scrollLeft, b.sel = this.sel, b.extend = !1, a && (b.history.undoDepth = this.history.undoDepth, b.setHistory(this.getHistory())), b;
    }, linkedDoc:function(a) {
      a ||= {};
      var b = this.first, c = this.first + this.size;
      null != a.from && a.from > b && (b = a.from);
      null != a.to && a.to < c && (c = a.to);
      b = new Za(Ee(this, b, c), a.mode || this.modeOption, b, this.lineSep);
      a.sharedHist && (b.history = this.history);
      (this.linked || (this.linked = [])).push({doc:b, sharedHist:a.sharedHist});
      b.linked = [{doc:this, isParent:!0, sharedHist:a.sharedHist}];
      a = yf(this);
      for (c = 0; c < a.length; c++) {
        var d = a[c], e = d.find(), g = b.clipPos(e.from);
        e = b.clipPos(e.to);
        fa(g, e) && (g = Gc(b, g, e, d.primary, d.primary.type), d.markers.push(g), g.parent = d);
      }
      return b;
    }, unlinkDoc:function(a) {
      if (a instanceof x && (a = a.doc), this.linked) {
        for (var b = 0; b < this.linked.length; ++b) {
          if (this.linked[b].doc == a) {
            this.linked.splice(b, 1);
            a.unlinkDoc(this);
            yg(yf(this));
            break;
          }
        }
      }
      if (a.history == this.history) {
        var c = [a.id];
        oc(a, function(d) {
          c.push(d.id);
        }, !0);
        a.history = new Wd(null);
        a.history.done = Hc(this.history.done, c);
        a.history.undone = Hc(this.history.undone, c);
      }
    }, iterLinkedDocs:function(a) {
      oc(this, a);
    }, getMode:function() {
      return this.mode;
    }, getEditor:function() {
      return this.cm;
    }, splitLines:function(a) {
      return this.lineSep ? a.split(this.lineSep) : Og(a);
    }, lineSeparator:function() {
      return this.lineSep || "\n";
    }});
    Za.prototype.eachLine = Za.prototype.iter;
    var Pg = "iter insert remove copy getEditor constructor".split(" "), qd;
    for (qd in Za.prototype) {
      Za.prototype.hasOwnProperty(qd) && 0 > Oa(Pg, qd) && (x.prototype[qd] = function(a) {
        return function() {
          return a.apply(this.doc, arguments);
        };
      }(Za.prototype[qd]));
    }
    Ic(Za);
    var Ua = x.e_preventDefault = function(a) {
      a.preventDefault ? a.preventDefault() : a.returnValue = !1;
    }, Qg = x.e_stopPropagation = function(a) {
      a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0;
    }, Ed = x.e_stop = function(a) {
      Ua(a);
      Qg(a);
    }, ca = x.on = function(a, b, c) {
      a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : (a = a._handlers || (a._handlers = {}), (a[b] || (a[b] = [])).push(c));
    }, Mf = [], Cb = x.off = function(a, b, c) {
      if (a.removeEventListener) {
        a.removeEventListener(b, c, !1);
      } else if (a.detachEvent) {
        a.detachEvent("on" + b, c);
      } else {
        for (a = Xd(a, b, !1), b = 0; b < a.length; ++b) {
          if (a[b] == c) {
            a.splice(b, 1);
            break;
          }
        }
      }
    }, La = x.signal = function(a, b) {
      var c = Xd(a, b, !0);
      if (c.length) {
        for (var d = Array.prototype.slice.call(arguments, 2), e = 0; e < c.length; ++e) {
          c[e].apply(null, d);
        }
      }
    }, kd = null, Je = 30, hf = x.Pass = {toString:function() {
      return "CodeMirror.Pass";
    }}, Ab = {scroll:!1}, pe = {origin:"*mouse"}, nd = {origin:"+move"};
    Zb.prototype.set = function(a, b) {
      clearTimeout(this.id);
      this.id = setTimeout(b, a);
    };
    var vb = x.countColumn = function(a, b, c, d, e) {
      null == b && (b = a.search(/[^\s\u00a0]/), -1 == b && (b = a.length));
      d = d || 0;
      for (e = e || 0;;) {
        var g = a.indexOf("\t", d);
        if (0 > g || g >= b) {
          return e + (b - d);
        }
        e += g - d;
        e += c - e % c;
        d = g + 1;
      }
    }, ff = x.findColumn = function(a, b, c) {
      for (var d = 0, e = 0;;) {
        var g = a.indexOf("\t", d);
        -1 == g && (g = a.length);
        var h = g - d;
        if (g == a.length || e + h >= b) {
          return d + Math.min(h, b - e);
        }
        if (e += g - d, e += c - e % c, d = g + 1, e >= b) {
          return d;
        }
      }
    }, Yd = [""], Kc = function(a) {
      a.select();
    };
    Uc ? Kc = function(a) {
      a.selectionStart = 0;
      a.selectionEnd = a.value.length;
    } : oa && (Kc = function(a) {
      try {
        a.select();
      } catch (b) {
      }
    });
    var Rg = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/, Of = x.isWordChar = function(a) {
      return /\w/.test(a) || "\u0080" < a && (a.toUpperCase() != a.toLowerCase() || Rg.test(a));
    }, Hg = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    var bd = document.createRange ? function(a, b, c, d) {
      var e = document.createRange();
      return e.setEnd(d || a, c), e.setStart(a, b), e;
    } : function(a, b, c) {
      var d = document.body.createTextRange();
      try {
        d.moveToElementText(a.parentNode);
      } catch (e) {
        return d;
      }
      return d.collapse(!0), d.moveEnd("character", c), d.moveStart("character", b), d;
    };
    var de = x.contains = function(a, b) {
      if (3 == b.nodeType && (b = b.parentNode), a.contains) {
        return a.contains(b);
      }
      do {
        if (11 == b.nodeType && (b = b.host), b == a) {
          return !0;
        }
      } while (b = b.parentNode);
    };
    oa && 11 > Ba && (zb = function() {
      try {
        return document.activeElement;
      } catch (a) {
        return document.body;
      }
    });
    var De, Be, Qc = x.rmClass = function(a, b) {
      var c = a.className;
      if (b = md(b).exec(c)) {
        var d = c.slice(b.index + b[0].length);
        a.className = c.slice(0, b.index) + (d ? b[1] + d : "");
      }
    }, Sc = x.addClass = function(a, b) {
      var c = a.className;
      md(b).test(c) || (a.className += (c ? " " : "") + b);
    }, Ge = !1, kg = function() {
      if (oa && 9 > Ba) {
        return !1;
      }
      var a = X("div");
      return "draggable" in a || "dragDrop" in a;
    }(), Og = x.splitLines = 3 != "\n\nb".split(/\n/).length ? function(a) {
      for (var b = 0, c = [], d = a.length; b <= d;) {
        var e = a.indexOf("\n", b);
        -1 == e && (e = a.length);
        var g = a.slice(b, "\r" == a.charAt(e - 1) ? e - 1 : e), h = g.indexOf("\r");
        -1 != h ? (c.push(g.slice(0, h)), b += h + 1) : (c.push(g), b = e + 1);
      }
      return c;
    } : function(a) {
      return a.split(/\r\n?|\n/);
    }, Mg = window.getSelection ? function(a) {
      try {
        return a.selectionStart != a.selectionEnd;
      } catch (b) {
        return !1;
      }
    } : function(a) {
      try {
        var b = a.ownerDocument.selection.createRange();
      } catch (c) {
      }
      return !(!b || b.parentElement() != a) && 0 != b.compareEndPoints("StartToEnd", b);
    }, kf = function() {
      var a = X("div");
      return "oncopy" in a || (a.setAttribute("oncopy", "return;"), "function" == typeof a.oncopy);
    }(), he = null, qc = x.keyNames = {3:"Enter", 8:"Backspace", 9:"Tab", 13:"Enter", 16:"Shift", 17:"Ctrl", 18:"Alt", 19:"Pause", 20:"CapsLock", 27:"Esc", 32:"Space", 33:"PageUp", 34:"PageDown", 35:"End", 36:"Home", 37:"Left", 38:"Up", 39:"Right", 40:"Down", 44:"PrintScrn", 45:"Insert", 46:"Delete", 59:";", 61:"=", 91:"Mod", 92:"Mod", 93:"Mod", 106:"*", 107:"=", 109:"-", 110:".", 111:"/", 127:"Delete", 173:"-", 186:";", 187:"=", 188:",", 189:"-", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 
    222:"'", 63232:"Up", 63233:"Down", 63234:"Left", 63235:"Right", 63272:"Delete", 63273:"Home", 63275:"End", 63276:"PageUp", 63277:"PageDown", 63302:"Insert"};
    !function() {
      for (var a = 0; 10 > a; a++) {
        qc[a + 48] = qc[a + 96] = String(a);
      }
      for (a = 65; 90 >= a; a++) {
        qc[a] = String.fromCharCode(a);
      }
      for (a = 1; 12 >= a; a++) {
        qc[a + 111] = qc[a + 63235] = "F" + a;
      }
    }();
    var dd, Eg = function() {
      function a(h, l, m) {
        this.level = h;
        this.from = l;
        this.to = m;
      }
      var b = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, c = /[stwN]/, d = /[LRr]/, e = /[Lb1n]/, g = /[1n]/;
      return function(h) {
        if (!b.test(h)) {
          return !1;
        }
        for (var l, m = h.length, p = [], t = 0; t < m; ++t) {
          l = p;
          var v = l.push;
          var z = h.charCodeAt(t);
          z = 247 >= z ? "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(z) : 1424 <= z && 1524 >= z ? "R" : 1536 <= z && 1773 >= z ? "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm".charAt(z - 
          1536) : 1774 <= z && 2220 >= z ? "r" : 8192 <= z && 8203 >= z ? "w" : 8204 == z ? "b" : "L";
          v.call(l, z);
        }
        t = 0;
        for (v = "L"; t < m; ++t) {
          l = p[t], "m" == l ? p[t] = v : v = l;
        }
        t = 0;
        for (v = "L"; t < m; ++t) {
          l = p[t], "1" == l && "r" == v ? p[t] = "n" : d.test(l) && (v = l, "r" == l && (p[t] = "R"));
        }
        t = 1;
        for (v = p[0]; t < m - 1; ++t) {
          l = p[t], "+" == l && "1" == v && "1" == p[t + 1] ? p[t] = "1" : "," != l || v != p[t + 1] || "1" != v && "n" != v || (p[t] = v), v = l;
        }
        for (t = 0; t < m; ++t) {
          if (l = p[t], "," == l) {
            p[t] = "N";
          } else if ("%" == l) {
            for (v = t + 1; v < m && "%" == p[v]; ++v) {
            }
            z = t && "!" == p[t - 1] || v < m && "1" == p[v] ? "1" : "N";
            for (l = t; l < v; ++l) {
              p[l] = z;
            }
            t = v - 1;
          }
        }
        t = 0;
        for (v = "L"; t < m; ++t) {
          l = p[t], "L" == v && "1" == l ? p[t] = "L" : d.test(l) && (v = l);
        }
        for (t = 0; t < m; ++t) {
          if (c.test(p[t])) {
            for (v = t + 1; v < m && c.test(p[v]); ++v) {
            }
            l = "L" == (v < m ? p[v] : "L");
            z = "L" == (t ? p[t - 1] : "L") || l ? "L" : "R";
            for (l = t; l < v; ++l) {
              p[l] = z;
            }
            t = v - 1;
          }
        }
        var I;
        v = [];
        for (t = 0; t < m;) {
          if (e.test(p[t])) {
            l = t;
            for (++t; t < m && e.test(p[t]); ++t) {
            }
            v.push(new a(0, l, t));
          } else {
            var O = t;
            z = v.length;
            for (++t; t < m && "L" != p[t]; ++t) {
            }
            for (l = O; l < t;) {
              if (g.test(p[l])) {
                O < l && v.splice(z, 0, new a(1, O, l));
                O = l;
                for (++l; l < t && g.test(p[l]); ++l) {
                }
                v.splice(z, 0, new a(2, O, l));
                O = l;
              } else {
                ++l;
              }
            }
            O < t && v.splice(z, 0, new a(1, O, t));
          }
        }
        return 1 == v[0].level && (I = h.match(/^\s+/)) && (v[0].from = I[0].length, v.unshift(new a(0, 0, I[0].length))), 1 == ta(v).level && (I = h.match(/\s+$/)) && (ta(v).to -= I[0].length, v.push(new a(0, m - I[0].length, m))), 2 == v[0].level && v.unshift(new a(1, v[0].to, v[0].to)), v[0].level != ta(v).level && v.push(new a(v[0].level, m, m)), v;
      };
    }();
    return x.version = "5.19.0", x;
  });
}, {}], foldcode:[function(qa, Ca, va) {
  !function(x) {
    "object" == typeof va && "object" == typeof Ca ? x(qa("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], x) : x(CodeMirror);
  }(function(x) {
    function W(A, r, E, u) {
      function T(N) {
        var H = S(A, r);
        if (!H || H.to.line - H.from.line < C) {
          return null;
        }
        for (var J = A.findMarksAt(H.from), V = 0; V < J.length; ++V) {
          if (J[V].__isFold && "fold" !== u) {
            if (!N) {
              return null;
            }
            H.cleared = !0;
            J[V].clear();
          }
        }
        return H;
      }
      if (E && E.call) {
        var S = E;
        E = null;
      } else {
        S = G(A, E, "rangeFinder");
      }
      "number" == typeof r && (r = x.Pos(r, 0));
      var C = G(A, E, "minFoldSize"), f = T(!0);
      if (G(A, E, "scanUp")) {
        for (; !f && r.line > A.firstLine();) {
          r = x.Pos(r.line - 1, 0), f = T(!1);
        }
      }
      if (f && !f.cleared && "unfold" !== u) {
        var L = R(A, E);
        x.on(L, "mousedown", function(N) {
          Q.clear();
          x.e_preventDefault(N);
        });
        var Q = A.markText(f.from, f.to, {replacedWith:L, clearOnEnter:G(A, E, "clearOnEnter"), __isFold:!0});
        Q.on("clear", function(N, H) {
          x.signal(A, "unfold", A, N, H);
        });
        x.signal(A, "fold", A, f.from, f.to);
      }
    }
    function R(A, r) {
      A = G(A, r, "widget");
      "string" == typeof A && (r = document.createTextNode(A), A = document.createElement("span"), A.appendChild(r), A.className = "CodeMirror-foldmarker");
      return A;
    }
    function G(A, r, E) {
      return r && void 0 !== r[E] ? r[E] : (A = A.options.foldOptions) && void 0 !== A[E] ? A[E] : y[E];
    }
    x.newFoldFunction = function(A, r) {
      return function(E, u) {
        W(E, u, {rangeFinder:A, widget:r});
      };
    };
    x.defineExtension("foldCode", function(A, r, E) {
      W(this, A, r, E);
    });
    x.defineExtension("isFolded", function(A) {
      A = this.findMarksAt(A);
      for (var r = 0; r < A.length; ++r) {
        if (A[r].__isFold) {
          return !0;
        }
      }
    });
    x.commands.toggleFold = function(A) {
      A.foldCode(A.getCursor());
    };
    x.commands.fold = function(A) {
      A.foldCode(A.getCursor(), null, "fold");
    };
    x.commands.unfold = function(A) {
      A.foldCode(A.getCursor(), null, "unfold");
    };
    x.commands.foldAll = function(A) {
      A.operation(function() {
        for (var r = A.firstLine(), E = A.lastLine(); r <= E; r++) {
          A.foldCode(x.Pos(r, 0), null, "fold");
        }
      });
    };
    x.commands.unfoldAll = function(A) {
      A.operation(function() {
        for (var r = A.firstLine(), E = A.lastLine(); r <= E; r++) {
          A.foldCode(x.Pos(r, 0), null, "unfold");
        }
      });
    };
    x.registerHelper("fold", "combine", function() {
      var A = Array.prototype.slice.call(arguments, 0);
      return function(r, E) {
        for (var u = 0; u < A.length; ++u) {
          var T = A[u](r, E);
          if (T) {
            return T;
          }
        }
      };
    });
    x.registerHelper("fold", "auto", function(A, r) {
      for (var E = A.getHelpers(r, "fold"), u = 0; u < E.length; u++) {
        var T = E[u](A, r);
        if (T) {
          return T;
        }
      }
    });
    var y = {rangeFinder:x.fold.auto, widget:"\u2194", minFoldSize:0, scanUp:!1, clearOnEnter:!0};
    x.defineOption("foldOptions", null);
    x.defineExtension("foldOption", function(A, r) {
      return G(this, A, r);
    });
  });
}, {"../../lib/codemirror":"codemirror"}], foldgutter:[function(qa, Ca, va) {
  !function(x) {
    "object" == typeof va && "object" == typeof Ca ? x(qa("../../lib/codemirror"), qa("./foldcode")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "./foldcode"], x) : x(CodeMirror);
  }(function(x) {
    function W(C) {
      this.options = C;
      this.from = this.to = 0;
    }
    function R(C, f) {
      C = C.findMarks(S(f, 0), S(f + 1, 0));
      for (var L = 0; L < C.length; ++L) {
        if (C[L].__isFold && C[L].find().from.line == f) {
          return C[L];
        }
      }
    }
    function G(C) {
      if ("string" == typeof C) {
        var f = document.createElement("div");
        return f.className = C + " CodeMirror-guttermarker-subtle", f;
      }
      return C.cloneNode(!0);
    }
    function y(C, f, L) {
      var Q = C.state.foldGutter.options, N = f, H = C.foldOption(Q, "minFoldSize"), J = C.foldOption(Q, "rangeFinder");
      C.eachLine(f, L, function(V) {
        var ra = null;
        if (R(C, N)) {
          ra = G(Q.indicatorFolded);
        } else {
          var ha = S(N, 0);
          (ha = J && J(C, ha)) && ha.to.line - ha.from.line >= H && (ra = G(Q.indicatorOpen));
        }
        C.setGutterMarker(V, Q.gutter, ra);
        ++N;
      });
    }
    function A(C) {
      var f = C.getViewport(), L = C.state.foldGutter;
      L && (C.operation(function() {
        y(C, f.from, f.to);
      }), L.from = f.from, L.to = f.to);
    }
    function r(C, f, L) {
      var Q = C.state.foldGutter;
      Q && (Q = Q.options, L == Q.gutter && ((L = R(C, f)) ? L.clear() : C.foldCode(S(f, 0), Q.rangeFinder)));
    }
    function E(C) {
      var f = C.state.foldGutter;
      if (f) {
        var L = f.options;
        f.from = f.to = 0;
        clearTimeout(f.changeUpdate);
        f.changeUpdate = setTimeout(function() {
          A(C);
        }, L.foldOnChangeTimeSpan || 600);
      }
    }
    function u(C) {
      var f = C.state.foldGutter;
      if (f) {
        var L = f.options;
        clearTimeout(f.changeUpdate);
        f.changeUpdate = setTimeout(function() {
          var Q = C.getViewport();
          f.from == f.to || 20 < Q.from - f.to || 20 < f.from - Q.to ? A(C) : C.operation(function() {
            Q.from < f.from && (y(C, Q.from, f.from), f.from = Q.from);
            Q.to > f.to && (y(C, f.to, Q.to), f.to = Q.to);
          });
        }, L.updateViewportTimeSpan || 400);
      }
    }
    function T(C, f) {
      var L = C.state.foldGutter;
      L && (f = f.line, f >= L.from && f < L.to && y(C, f, f + 1));
    }
    x.defineOption("foldGutter", !1, function(C, f, L) {
      L && L != x.Init && (C.clearGutter(C.state.foldGutter.options.gutter), C.state.foldGutter = null, C.off("gutterClick", r), C.off("change", E), C.off("viewportChange", u), C.off("fold", T), C.off("unfold", T), C.off("swapDoc", E));
      if (f) {
        L = C.state;
        var Q = f;
        f = (!0 === Q && (Q = {}), null == Q.gutter && (Q.gutter = "CodeMirror-foldgutter"), null == Q.indicatorOpen && (Q.indicatorOpen = "CodeMirror-foldgutter-open"), null == Q.indicatorFolded && (Q.indicatorFolded = "CodeMirror-foldgutter-folded"), Q);
        L.foldGutter = new W(f);
        A(C);
        C.on("gutterClick", r);
        C.on("change", E);
        C.on("viewportChange", u);
        C.on("fold", T);
        C.on("unfold", T);
        C.on("swapDoc", E);
      }
    });
    var S = x.Pos;
  });
}, {"../../lib/codemirror":"codemirror", "./foldcode":"foldcode"}], "mode-javascript":[function(qa, Ca, va) {
  !function(x) {
    "object" == typeof va && "object" == typeof Ca ? x(qa("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], x) : x(CodeMirror);
  }(function(x) {
    function W(R, G, y) {
      return /^(?:operator|sof|keyword c|case|new|[\[{}\(,;:]|=>)$/.test(G.lastType) || "quasi" == G.lastType && /\{\s*$/.test(R.string.slice(0, R.pos - (y || 0)));
    }
    x.defineMode("javascript", function(R, G) {
      function y(q, D, F) {
        return Ub = q, jc = F, D;
      }
      function A(q, D) {
        var F = q.next();
        if ('"' == F || "'" == F) {
          return D.tokenize = r(F), D.tokenize(q, D);
        }
        if ("." == F && q.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
          return y("number", "number");
        }
        if ("." == F && q.match("..")) {
          return y("spread", "meta");
        }
        if (/[\[\]{}\(\),;:\.]/.test(F)) {
          return y(F);
        }
        if ("=" == F && q.eat(">")) {
          return y("=>", "operator");
        }
        if ("0" == F && q.eat(/x/i)) {
          return q.eatWhile(/[\da-f]/i), y("number", "number");
        }
        if ("0" == F && q.eat(/o/i)) {
          return q.eatWhile(/[0-7]/i), y("number", "number");
        }
        if ("0" == F && q.eat(/b/i)) {
          return q.eatWhile(/[01]/i), y("number", "number");
        }
        if (/\d/.test(F)) {
          return q.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/), y("number", "number");
        }
        if ("/" == F) {
          if (q.eat("*")) {
            q = (D.tokenize = E, E(q, D));
          } else {
            if (q.eat("/")) {
              q = (q.skipToEnd(), y("comment", "comment"));
            } else {
              if (W(q, D, 1)) {
                a: {
                  for (var M = F = !1; null != (D = q.next());) {
                    if (!F) {
                      if ("/" == D && !M) {
                        break a;
                      }
                      "[" == D ? M = !0 : M && "]" == D && (M = !1);
                    }
                    F = !F && "\\" == D;
                  }
                }
                q = (q.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/), y("regexp", "string-2"));
              } else {
                q = (q.eatWhile(Bc), y("operator", "operator", q.current()));
              }
            }
          }
          return q;
        }
        if ("`" == F) {
          return D.tokenize = u, u(q, D);
        }
        if ("#" == F) {
          return q.skipToEnd(), y("error", "error");
        }
        if (Bc.test(F)) {
          return q.eatWhile(Bc), y("operator", "operator", q.current());
        }
        if (Ac.test(F)) {
          return q.eatWhile(Ac), q = q.current(), (F = Zc.propertyIsEnumerable(q) && Zc[q]) && "." != D.lastType ? y(F.type, F.style, q) : y("variable", "variable", q);
        }
      }
      function r(q) {
        return function(D, F) {
          var M, Y = !1;
          if (Vb && "@" == D.peek() && D.match($c)) {
            return F.tokenize = A, y("jsonld-keyword", "meta");
          }
          for (; null != (M = D.next()) && (M != q || Y);) {
            Y = !Y && "\\" == M;
          }
          return Y || (F.tokenize = A), y("string", "string");
        };
      }
      function E(q, D) {
        for (var F, M = !1; F = q.next();) {
          if ("/" == F && M) {
            D.tokenize = A;
            break;
          }
          M = "*" == F;
        }
        return y("comment", "comment");
      }
      function u(q, D) {
        for (var F, M = !1; null != (F = q.next());) {
          if (!M && ("`" == F || "$" == F && q.eat("{"))) {
            D.tokenize = A;
            break;
          }
          M = !M && "\\" == F;
        }
        return y("quasi", "string-2", q.current());
      }
      function T(q, D) {
        D.fatArrowAt && (D.fatArrowAt = null);
        var F = q.string.indexOf("=>", q.start);
        if (!(0 > F)) {
          var M = 0, Y = !1;
          for (--F; 0 <= F; --F) {
            var ja = q.string.charAt(F), Ra = $b.indexOf(ja);
            if (0 <= Ra && 3 > Ra) {
              if (!M) {
                ++F;
                break;
              }
              if (0 == --M) {
                "(" == ja && (Y = !0);
                break;
              }
            } else if (3 <= Ra && 6 > Ra) {
              ++M;
            } else if (Ac.test(ja)) {
              Y = !0;
            } else {
              if (/["'\/]/.test(ja)) {
                return;
              }
              if (Y && !M) {
                ++F;
                break;
              }
            }
          }
          Y && !M && (D.fatArrowAt = F);
        }
      }
      function S(q, D, F, M, Y, ja) {
        this.indented = q;
        this.column = D;
        this.type = F;
        this.prev = Y;
        this.info = ja;
        null != M && (this.align = M);
      }
      function C() {
        for (var q = arguments.length - 1; 0 <= q; q--) {
          U.cc.push(arguments[q]);
        }
      }
      function f() {
        return C.apply(null, arguments), !0;
      }
      function L(q) {
        function D(M) {
          for (; M; M = M.next) {
            if (M.name == q) {
              return !0;
            }
          }
          return !1;
        }
        var F = U.state;
        (U.marked = "def", F.context) ? D(F.localVars) || (F.localVars = {name:q, next:F.localVars}) : D(F.globalVars) || G.globalVars && (F.globalVars = {name:q, next:F.globalVars});
      }
      function Q() {
        U.state.context = {prev:U.state.context, vars:U.state.localVars};
        U.state.localVars = kc;
      }
      function N() {
        U.state.localVars = U.state.context.vars;
        U.state.context = U.state.context.prev;
      }
      function H(q, D) {
        var F = function() {
          var M = U.state, Y = M.indented;
          if ("stat" == M.lexical.type) {
            Y = M.lexical.indented;
          } else {
            for (var ja = M.lexical; ja && ")" == ja.type && ja.align; ja = ja.prev) {
              Y = ja.indented;
            }
          }
          M.lexical = new S(Y, U.stream.column(), q, null, M.lexical, D);
        };
        return F.lex = !0, F;
      }
      function J() {
        var q = U.state;
        q.lexical.prev && (")" == q.lexical.type && (q.indented = q.lexical.indented), q.lexical = q.lexical.prev);
      }
      function V(q) {
        function D(F) {
          return F == q ? f() : ";" == q ? C() : f(D);
        }
        return D;
      }
      function ra(q, D) {
        return "var" == q ? f(H("vardef", D.length), fc, V(";"), J) : "keyword a" == q ? f(H("form"), ob, ra, J) : "keyword b" == q ? f(H("form"), ra, J) : "{" == q ? f(H("}"), B, J) : ";" == q ? f() : "if" == q ? ("else" == U.state.lexical.info && U.state.cc[U.state.cc.length - 1] == J && U.state.cc.pop()(), f(H("form"), ob, ra, J, gc)) : "function" == q ? f(Ka) : "for" == q ? f(H("form"), ce, ra, J) : "variable" == q ? f(H("stat"), Yb) : "switch" == q ? f(H("form"), ob, H("}", "switch"), V("{"), 
        B, J, J) : "case" == q ? f(ha, V(":")) : "default" == q ? f(V(":")) : "catch" == q ? f(H("form"), Q, V("("), ba, V(")"), ra, J, N) : "class" == q ? f(H("form"), ic, J) : "export" == q ? f(H("stat"), ud, J) : "import" == q ? f(H("stat"), Xc, J) : "module" == q ? f(H("form"), eb, H("}"), V("{"), B, J, J) : "type" == q ? f(wa, V("operator"), wa, V(";")) : "async" == q ? f(ra) : C(H("stat"), ha, V(";"), J);
      }
      function ha(q) {
        return Eb(q, !1);
      }
      function P(q) {
        return Eb(q, !0);
      }
      function ob(q) {
        return "(" != q ? C() : f(H(")"), ha, V(")"), J);
      }
      function Eb(q, D) {
        if (U.state.fatArrowAt == U.stream.start) {
          var F = D ? lb : Aa;
          if ("(" == q) {
            return f(Q, H(")"), n(eb, ")"), J, V("=>"), F, N);
          }
          if ("variable" == q) {
            return C(Q, eb, V("=>"), F, N);
          }
        }
        F = D ? jb : ib;
        return fe.hasOwnProperty(q) ? f(F) : "function" == q ? f(Ka, F) : "keyword c" == q || "async" == q ? f(D ? Va : cb) : "(" == q ? f(H(")"), cb, V(")"), J, F) : "operator" == q || "spread" == q ? f(D ? P : ha) : "[" == q ? f(H("]"), zc, J, F) : "{" == q ? w(hb, "}", null, F) : "quasi" == q ? C(Ja, F) : "new" == q ? f(Xa(D)) : f();
      }
      function cb(q) {
        return q.match(/[;\}\)\],]/) ? C() : C(ha);
      }
      function Va(q) {
        return q.match(/[;\}\)\],]/) ? C() : C(P);
      }
      function ib(q, D) {
        return "," == q ? f(ha) : jb(q, D, !1);
      }
      function jb(q, D, F) {
        var M = 0 == F ? ib : jb, Y = 0 == F ? ha : P;
        return "=>" == q ? f(Q, F ? lb : Aa, N) : "operator" == q ? /\+\+|--/.test(D) ? f(M) : "?" == D ? f(ha, V(":"), Y) : f(Y) : "quasi" == q ? C(Ja, M) : ";" != q ? "(" == q ? w(P, ")", "call", M) : "." == q ? f(mb, M) : "[" == q ? f(H("]"), cb, V("]"), J, M) : void 0 : void 0;
      }
      function Ja(q, D) {
        return "quasi" != q ? C() : "${" != D.slice(D.length - 2) ? f(Ja) : f(ha, Mb);
      }
      function Mb(q) {
        if ("}" == q) {
          return U.marked = "string-2", U.state.tokenize = u, f(Ja);
        }
      }
      function Aa(q) {
        return T(U.stream, U.state), C("{" == q ? ra : ha);
      }
      function lb(q) {
        return T(U.stream, U.state), C("{" == q ? ra : P);
      }
      function Xa(q) {
        return function(D) {
          return "." == D ? f(q ? nb : Lb) : C(q ? P : ha);
        };
      }
      function Lb(q, D) {
        if ("target" == D) {
          return U.marked = "keyword", f(ib);
        }
      }
      function nb(q, D) {
        if ("target" == D) {
          return U.marked = "keyword", f(jb);
        }
      }
      function Yb(q) {
        return ":" == q ? f(J, ra) : C(ib, V(";"), J);
      }
      function mb(q) {
        if ("variable" == q) {
          return U.marked = "property", f();
        }
      }
      function hb(q, D) {
        return "async" == q ? (U.marked = "property", f(hb)) : "variable" == q || "keyword" == U.style ? (U.marked = "property", f("get" == D || "set" == D ? Db : k)) : "number" == q || "string" == q ? (U.marked = Vb ? "property" : U.style + " property", f(k)) : "jsonld-keyword" == q ? f(k) : "modifier" == q ? f(hb) : "[" == q ? f(ha, V("]"), k) : "spread" == q ? f(ha) : ":" == q ? C(k) : void 0;
      }
      function Db(q) {
        return "variable" != q ? C(k) : (U.marked = "property", f(Ka));
      }
      function k(q) {
        return ":" == q ? f(P) : "(" == q ? C(Ka) : void 0;
      }
      function n(q, D) {
        function F(M, Y) {
          return "," == M ? (M = U.state.lexical, "call" == M.info && (M.pos = (M.pos || 0) + 1), f(function(ja, Ra) {
            return ja == D || Ra == D ? C() : C(q);
          }, F)) : M == D || Y == D ? f() : f(V(D));
        }
        return function(M, Y) {
          return M == D || Y == D ? f() : C(q, F);
        };
      }
      function w(q, D, F) {
        for (var M = 3; M < arguments.length; M++) {
          U.cc.push(arguments[M]);
        }
        return f(H(D, F), n(q, D), J);
      }
      function B(q) {
        return "}" == q ? f() : C(ra, B);
      }
      function ma(q, D) {
        if (qb) {
          if (":" == q) {
            return f(wa);
          }
          if ("?" == D) {
            return f(ma);
          }
        }
      }
      function na(q, D) {
        if ("=" == D) {
          return f(P);
        }
      }
      function wa(q) {
        return "variable" == q ? (U.marked = "variable-3", f(Ob)) : "{" == q ? f(n(Ya, "}")) : "(" == q ? f(n(Nb, ")"), ia) : void 0;
      }
      function ia(q) {
        if ("=>" == q) {
          return f(wa);
        }
      }
      function Ya(q) {
        return "variable" == q || "keyword" == U.style ? (U.marked = "property", f(Ya)) : ":" == q ? f(wa) : void 0;
      }
      function Nb(q) {
        return "variable" == q ? f(Nb) : ":" == q ? f(wa) : void 0;
      }
      function Ob(q, D) {
        return "<" == D ? f(n(wa, ">"), Ob) : "[" == q ? f(V("]"), Ob) : void 0;
      }
      function fc() {
        return C(eb, ma, xc, Tb);
      }
      function eb(q, D) {
        return "modifier" == q ? f(eb) : "variable" == q ? (L(D), f()) : "spread" == q ? f(eb) : "[" == q ? w(eb, "]") : "{" == q ? w(Vc, "}") : void 0;
      }
      function Vc(q, D) {
        return "variable" != q || U.stream.match(/^\s*:/, !1) ? ("variable" == q && (U.marked = "property"), "spread" == q ? f(eb) : "}" == q ? C() : f(V(":"), eb, xc)) : (L(D), f(xc));
      }
      function xc(q, D) {
        if ("=" == D) {
          return f(P);
        }
      }
      function Tb(q) {
        if ("," == q) {
          return f(fc);
        }
      }
      function gc(q, D) {
        if ("keyword b" == q && "else" == D) {
          return f(H("form", "else"), ra, J);
        }
      }
      function ce(q) {
        if ("(" == q) {
          return f(H(")"), ee, V(")"), J);
        }
      }
      function ee(q) {
        return "var" == q ? f(fc, V(";"), sa) : ";" == q ? f(sa) : "variable" == q ? f(tb) : C(ha, V(";"), sa);
      }
      function tb(q, D) {
        return "in" == D || "of" == D ? (U.marked = "keyword", f(ha)) : f(ib, sa);
      }
      function sa(q, D) {
        return ";" == q ? f(ab) : "in" == D || "of" == D ? (U.marked = "keyword", f(ha)) : C(ha, V(";"), ab);
      }
      function ab(q) {
        ")" != q && f(ha);
      }
      function Ka(q, D) {
        return "*" == D ? (U.marked = "keyword", f(Ka)) : "variable" == q ? (L(D), f(Ka)) : "(" == q ? f(Q, H(")"), n(ba, ")"), J, ma, ra, N) : void 0;
      }
      function ba(q) {
        return "spread" == q ? f(ba) : C(eb, ma, na);
      }
      function ic(q, D) {
        if ("variable" == q) {
          return L(D), f(Wc);
        }
      }
      function Wc(q, D) {
        return "extends" == D ? f(qb ? wa : ha, Wc) : "{" == q ? f(H("}"), ub, J) : void 0;
      }
      function ub(q, D) {
        return "variable" == q || "keyword" == U.style ? ("static" == D || "get" == D || "set" == D || qb && ("public" == D || "private" == D || "protected" == D)) && U.stream.match(/^\s+[\w$\xa1-\uffff]/, !1) ? (U.marked = "keyword", f(ub)) : (U.marked = "property", f(qb ? yc : Ka, ub)) : "*" == D ? (U.marked = "keyword", f(ub)) : ";" == q ? f(ub) : "}" == q ? f() : void 0;
      }
      function yc(q) {
        return ":" == q ? f(wa) : C(Ka);
      }
      function ud(q, D) {
        return "*" == D ? (U.marked = "keyword", f(Ga, V(";"))) : "default" == D ? (U.marked = "keyword", f(ha, V(";"))) : C(ra);
      }
      function Xc(q) {
        return "string" == q ? f() : C(Yc, Ga);
      }
      function Yc(q, D) {
        return "{" == q ? w(Yc, "}") : ("variable" == q && L(D), "*" == D && (U.marked = "keyword"), f(vd));
      }
      function vd(q, D) {
        if ("as" == D) {
          return U.marked = "keyword", f(Yc);
        }
      }
      function Ga(q, D) {
        if ("from" == D) {
          return U.marked = "keyword", f(ha);
        }
      }
      function zc(q) {
        return "]" == q ? f() : C(n(P, "]"));
      }
      var Ub, jc, Fb = R.indentUnit, Gb = G.statementIndent, Vb = G.jsonld, Hb = G.json || Vb, qb = G.typescript, Ac = G.wordCharacters || /[\w$\xa1-\uffff]/, Zc = function() {
        function q(Cc) {
          return {type:Cc, style:"keyword"};
        }
        var D = q("keyword a"), F = q("keyword b"), M = q("keyword c"), Y = q("operator"), ja = {type:"atom", style:"atom"};
        D = {if:q("if"), while:D, with:D, else:F, do:F, try:F, finally:F, return:M, break:M, continue:M, new:q("new"), delete:M, throw:M, debugger:M, var:q("var"), const:q("var"), let:q("var"), function:q("function"), catch:q("catch"), for:q("for"), switch:q("switch"), case:q("case"), default:q("default"), in:Y, typeof:Y, instanceof:Y, true:ja, false:ja, null:ja, undefined:ja, NaN:ja, Infinity:ja, this:q("this"), class:q("class"), super:q("atom"), yield:M, export:q("export"), import:q("import"), 
        extends:M, await:M, async:q("async")};
        if (qb) {
          F = {type:"variable", style:"variable-3"};
          M = {interface:q("class"), implements:M, namespace:M, module:q("module"), enum:q("module"), type:q("type"), public:q("modifier"), private:q("modifier"), protected:q("modifier"), abstract:q("modifier"), as:Y, string:F, number:F, boolean:F, any:F};
          for (var Ra in M) {
            D[Ra] = M[Ra];
          }
        }
        return D;
      }(), Bc = /[+\-*&%=<>!?|~^]/, $c = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/, $b = "([{}])", fe = {atom:!0, number:!0, variable:!0, string:!0, regexp:!0, this:!0, "jsonld-keyword":!0}, U = {state:null, column:null, marked:null, cc:null}, kc = {name:"this", next:{name:"arguments"}};
      return J.lex = !0, {startState:function(q) {
        q = {tokenize:A, lastType:"sof", cc:[], lexical:new S((q || 0) - Fb, 0, "block", !1), localVars:G.localVars, context:G.localVars && {vars:G.localVars}, indented:q || 0};
        return G.globalVars && "object" == typeof G.globalVars && (q.globalVars = G.globalVars), q;
      }, token:function(q, D) {
        if (q.sol() && (D.lexical.hasOwnProperty("align") || (D.lexical.align = !1), D.indented = q.indentation(), T(q, D)), D.tokenize != E && q.eatSpace()) {
          return null;
        }
        var F = D.tokenize(q, D);
        if ("comment" != Ub) {
          D.lastType = "operator" != Ub || "++" != jc && "--" != jc ? Ub : "incdec";
          a: {
            var M = Ub, Y = jc, ja = D.cc;
            U.state = D;
            U.stream = q;
            U.marked = null;
            U.cc = ja;
            U.style = F;
            for (D.lexical.hasOwnProperty("align") || (D.lexical.align = !0);;) {
              if ((ja.length ? ja.pop() : Hb ? ha : ra)(M, Y)) {
                for (; ja.length && ja[ja.length - 1].lex;) {
                  ja.pop()();
                }
                if (U.marked) {
                  F = U.marked;
                } else {
                  if (q = "variable" == M) {
                    b: {
                      for (q = D.localVars; q; q = q.next) {
                        if (q.name == Y) {
                          q = !0;
                          break b;
                        }
                      }
                      for (D = D.context; D; D = D.prev) {
                        for (q = D.vars; q; q = q.next) {
                          if (q.name == Y) {
                            q = !0;
                            break b;
                          }
                        }
                      }
                      q = void 0;
                    }
                  }
                  F = q ? "variable-2" : F;
                }
                break a;
              }
            }
          }
        }
        return F;
      }, indent:function(q, D) {
        if (q.tokenize == E) {
          return x.Pass;
        }
        if (q.tokenize != A) {
          return 0;
        }
        var F, M = D && D.charAt(0), Y = q.lexical;
        if (!/^\s*else\b/.test(D)) {
          for (var ja = q.cc.length - 1; 0 <= ja; --ja) {
            var Ra = q.cc[ja];
            if (Ra == J) {
              Y = Y.prev;
            } else if (Ra != gc) {
              break;
            }
          }
        }
        for (; !("stat" != Y.type && "form" != Y.type || "}" != M && (!(F = q.cc[q.cc.length - 1]) || F != ib && F != jb || /^[,\.=+\-*:?[\(]/.test(D)));) {
          Y = Y.prev;
        }
        Gb && ")" == Y.type && "stat" == Y.prev.type && (Y = Y.prev);
        F = Y.type;
        ja = M == F;
        "vardef" == F ? q = Y.indented + ("operator" == q.lastType || "," == q.lastType ? Y.info + 1 : 0) : "form" == F && "{" == M ? q = Y.indented : "form" == F ? q = Y.indented + Fb : "stat" == F ? (M = Y.indented, q = "operator" == q.lastType || "," == q.lastType || Bc.test(D.charAt(0)) || /[,.]/.test(D.charAt(0)), q = M + (q ? Gb || Fb : 0)) : q = "switch" != Y.info || ja || 0 == G.doubleIndentSwitch ? Y.align ? Y.column + (ja ? 0 : 1) : Y.indented + (ja ? 0 : Fb) : Y.indented + (/^(?:case|default)\b/.test(D) ? 
        Fb : 2 * Fb);
        return q;
      }, electricInput:/^\s*(?:case .*?:|default:|\{|\})$/, blockCommentStart:Hb ? null : "/*", blockCommentEnd:Hb ? null : "*/", lineComment:Hb ? null : "//", fold:"brace", closeBrackets:"()[]{}''\"\"``", helperType:Hb ? "json" : "javascript", jsonldMode:Vb, jsonMode:Hb, expressionAllowed:W, skipExpression:function(q) {
        var D = q.cc[q.cc.length - 1];
        D != ha && D != P || q.cc.pop();
      }};
    });
    x.registerHelper("wordChars", "javascript", /[\w$]/);
    x.defineMIME("text/javascript", "javascript");
    x.defineMIME("text/ecmascript", "javascript");
    x.defineMIME("application/javascript", "javascript");
    x.defineMIME("application/x-javascript", "javascript");
    x.defineMIME("application/ecmascript", "javascript");
    x.defineMIME("application/json", {name:"javascript", json:!0});
    x.defineMIME("application/x-json", {name:"javascript", json:!0});
    x.defineMIME("application/ld+json", {name:"javascript", jsonld:!0});
    x.defineMIME("text/typescript", {name:"javascript", typescript:!0});
    x.defineMIME("application/typescript", {name:"javascript", typescript:!0});
  });
}, {"../../lib/codemirror":"codemirror"}], "mode-sql":[function(qa, Ca, va) {
  !function(x) {
    "object" == typeof va && "object" == typeof Ca ? x(qa("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], x) : x(CodeMirror);
  }(function(x) {
    x.defineMode("sql", function(W, R) {
      function G(N, H) {
        var J = N.next();
        if (L[J]) {
          var V = L[J](N, H);
          if (!1 !== V) {
            return V;
          }
        }
        if (1 == f.hexNumber && ("0" == J && N.match(/^[xX][0-9a-fA-F]+/) || ("x" == J || "X" == J) && N.match(/^'[0-9a-fA-F]+'/)) || 1 == f.binaryNumber && (("b" == J || "B" == J) && N.match(/^'[01]+'/) || "0" == J && N.match(/^b[01]+/))) {
          return "number";
        }
        if (47 < J.charCodeAt(0) && 58 > J.charCodeAt(0)) {
          return N.match(/^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/), 1 == f.decimallessFloat && N.eat("."), "number";
        }
        if ("?" == J && (N.eatSpace() || N.eol() || N.eat(";"))) {
          return "variable-3";
        }
        if ("'" == J || '"' == J && f.doubleQuote) {
          return H.tokenize = y(J), H.tokenize(N, H);
        }
        if ((1 == f.nCharCast && ("n" == J || "N" == J) || 1 == f.charsetCast && "_" == J && N.match(/[a-z][a-z0-9]*/i)) && ("'" == N.peek() || '"' == N.peek())) {
          return "keyword";
        }
        if (/^[\(\),;\[\]]/.test(J)) {
          return null;
        }
        if (f.commentSlashSlash && "/" == J && N.eat("/") || f.commentHash && "#" == J || "-" == J && N.eat("-") && (!f.commentSpaceRequired || N.eat(" "))) {
          return N.skipToEnd(), "comment";
        }
        if ("/" == J && N.eat("*")) {
          return H.tokenize = A, H.tokenize(N, H);
        }
        if ("." != J) {
          if (C.test(J)) {
            return N.eatWhile(C), null;
          }
          if ("{" == J && (N.match(/^( )*(d|D|t|T|ts|TS)( )*'[^']*'( )*}/) || N.match(/^( )*(d|D|t|T|ts|TS)( )*"[^"]*"( )*}/))) {
            return "number";
          }
          N.eatWhile(/^[_\w\d]/);
          H = N.current().toLowerCase();
          return Q.hasOwnProperty(H) && (N.match(/^( )+'[^']*'/) || N.match(/^( )+"[^"]*"/)) ? "number" : u.hasOwnProperty(H) ? "atom" : T.hasOwnProperty(H) ? "builtin" : S.hasOwnProperty(H) ? "keyword" : E.hasOwnProperty(H) ? "string-2" : null;
        }
        return 1 == f.zerolessFloat && N.match(/^(?:\d+(?:e[+-]?\d+)?)/i) ? "number" : 1 == f.ODBCdotTable && N.match(/^[a-zA-Z_]+/) ? "variable-2" : void 0;
      }
      function y(N) {
        return function(H, J) {
          for (var V, ra = !1; null != (V = H.next());) {
            if (V == N && !ra) {
              J.tokenize = G;
              break;
            }
            ra = !ra && "\\" == V;
          }
          return "string";
        };
      }
      function A(N, H) {
        for (;;) {
          if (!N.skipTo("*")) {
            N.skipToEnd();
            break;
          }
          if (N.next(), N.eat("/")) {
            H.tokenize = G;
            break;
          }
        }
        return "comment";
      }
      function r(N, H, J) {
        H.context = {prev:H.context, indent:N.indentation(), col:N.column(), type:J};
      }
      var E = R.client || {}, u = R.atoms || {false:!0, true:!0, null:!0}, T = R.builtin || {}, S = R.keywords || {}, C = R.operatorChars || /^[*+\-%<>!=&|~^]/, f = R.support || {}, L = R.hooks || {}, Q = R.dateSQL || {date:!0, time:!0, timestamp:!0};
      return {startState:function() {
        return {tokenize:G, context:null};
      }, token:function(N, H) {
        if (N.sol() && H.context && null == H.context.align && (H.context.align = !1), N.eatSpace()) {
          return null;
        }
        var J = H.tokenize(N, H);
        if ("comment" == J) {
          return J;
        }
        H.context && null == H.context.align && (H.context.align = !0);
        var V = N.current();
        "(" == V ? r(N, H, ")") : "[" == V ? r(N, H, "]") : H.context && H.context.type == V && (H.indent = H.context.indent, H.context = H.context.prev);
        return J;
      }, indent:function(N, H) {
        N = N.context;
        if (!N) {
          return x.Pass;
        }
        H = H.charAt(0) == N.type;
        return N.align ? N.col + (H ? 0 : 1) : N.indent + (H ? 0 : W.indentUnit);
      }, blockCommentStart:"/*", blockCommentEnd:"*/", lineComment:f.commentSlashSlash ? "//" : f.commentHash ? "#" : null};
    });
    (function() {
      function W(A) {
        for (var r; null != (r = A.next());) {
          if ("`" == r && !A.eat("`")) {
            return "variable-2";
          }
        }
        return A.backUp(A.current().length - 1), A.eatWhile(/\w/) ? "variable-2" : null;
      }
      function R(A) {
        return A.eat("@") && (A.match(/^session\./), A.match(/^local\./), A.match(/^global\./)), A.eat("'") ? (A.match(/^.*'/), "variable-2") : A.eat('"') ? (A.match(/^.*"/), "variable-2") : A.eat("`") ? (A.match(/^.*`/), "variable-2") : A.match(/^[0-9a-zA-Z$\._]+/) ? "variable-2" : null;
      }
      function G(A) {
        return A.eat("N") ? "atom" : A.match(/^[a-zA-Z.#!?]/) ? "variable-2" : null;
      }
      function y(A) {
        var r = {};
        A = A.split(" ");
        for (var E = 0; E < A.length; ++E) {
          r[A[E]] = !0;
        }
        return r;
      }
      x.defineMIME("text/x-sql", {name:"sql", keywords:y("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit begin"), builtin:y("bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric"), 
      atoms:y("false true null unknown"), operatorChars:/^[*+\-%<>!=]/, dateSQL:y("date time timestamp"), support:y("ODBCdotTable doubleQuote binaryNumber hexNumber")});
      x.defineMIME("text/x-mssql", {name:"sql", client:y("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"), keywords:y("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit begin trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare"), builtin:y("bigint numeric bit smallint decimal smallmoney int tinyint money float real char varchar text nchar nvarchar ntext binary varbinary image cursor timestamp hierarchyid uniqueidentifier sql_variant xml table "), 
      atoms:y("false true null unknown"), operatorChars:/^[*+\-%<>!=]/, dateSQL:y("date datetimeoffset datetime2 smalldatetime datetime time"), hooks:{"@":R}});
      x.defineMIME("text/x-mysql", {name:"sql", client:y("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"), keywords:y("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit accessible action add after algorithm all analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general get global grant grants group group_concat handler hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show signal slave slow smallint snapshot soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"), 
      builtin:y("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"), atoms:y("false true null unknown"), operatorChars:/^[*+\-%<>!=&|^]/, dateSQL:y("date time timestamp"), support:y("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"), 
      hooks:{"@":R, "`":W, "\\":G}});
      x.defineMIME("text/x-mariadb", {name:"sql", client:y("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"), keywords:y("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit accessible action add after algorithm all always analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general generated get global grant grants group groupby_concat handler hard hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password persistent phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show shutdown signal slave slow smallint snapshot soft soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views virtual warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"), 
      builtin:y("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"), atoms:y("false true null unknown"), operatorChars:/^[*+\-%<>!=&|^]/, dateSQL:y("date time timestamp"), support:y("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"), 
      hooks:{"@":R, "`":W, "\\":G}});
      x.defineMIME("text/x-cassandra", {name:"sql", client:{}, keywords:y("add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime"), 
      builtin:y("ascii bigint blob boolean counter decimal double float frozen inet int list map static text timestamp timeuuid tuple uuid varchar varint"), atoms:y("false true infinity NaN"), operatorChars:/^[<>=]/, dateSQL:{}, support:y("commentSlashSlash decimallessFloat"), hooks:{}});
      x.defineMIME("text/x-plsql", {name:"sql", client:y("appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define describe echo editfile embedded escape exec execute feedback flagger flush heading headsep instance linesize lno loboffset logsource long longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar release repfooter repheader serveroutput shiftinout show showmode size spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout time timing trimout trimspool ttitle underline verify version wrap"), 
      keywords:y("abort accept access add all alter and any array arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body boolean by case cast char char_base check close cluster clusters colauth column comment commit compress connect connected constant constraint crash create current currval cursor data_base database date dba deallocate debugoff debugon decimal declare default definition delay delete desc digits dispose distinct do drop else elseif elsif enable end entry escape exception exception_init exchange exclusive exists exit external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging long loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base object of off offline on online only open option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw read rebuild record ref references refresh release rename replace resource restrict return returning returns reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate session set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work"), 
      builtin:y("abs acos add_months ascii asin atan atan2 average bfile bfilename bigserial bit blob ceil character chartorowid chr clob concat convert cos cosh count dec decode deref dual dump dup_val_on_index empty error exp false float floor found glb greatest hextoraw initcap instr instrb int integer isopen last_day least length lengthb ln lower lpad ltrim lub make_ref max min mlslabel mod months_between natural naturaln nchar nclob new_time next_day nextval nls_charset_decl_len nls_charset_id nls_charset_name nls_initcap nls_lower nls_sort nls_upper nlssort no_data_found notfound null number numeric nvarchar2 nvl others power rawtohex real reftohex round rowcount rowidtochar rowtype rpad rtrim serial sign signtype sin sinh smallint soundex sqlcode sqlerrm sqrt stddev string substr substrb sum sysdate tan tanh to_char text to_date to_label to_multi_byte to_number to_single_byte translate true trunc uid unlogged upper user userenv varchar varchar2 variance varying vsize xml"), 
      operatorChars:/^[*+\-%<>!=~]/, dateSQL:y("date time timestamp"), support:y("doubleQuote nCharCast zerolessFloat binaryNumber hexNumber")});
      x.defineMIME("text/x-hive", {name:"sql", keywords:y("select alter $elem$ $key$ $value$ add after all analyze and archive as asc before between binary both bucket buckets by cascade case cast change cluster clustered clusterstatus collection column columns comment compute concatenate continue create cross cursor data database databases dbproperties deferred delete delimited desc describe directory disable distinct distribute drop else enable end escaped exclusive exists explain export extended external false fetch fields fileformat first format formatted from full function functions grant group having hold_ddltime idxproperties if import in index indexes inpath inputdriver inputformat insert intersect into is items join keys lateral left like limit lines load local location lock locks mapjoin materialized minus msck no_drop nocompress not of offline on option or order out outer outputdriver outputformat overwrite partition partitioned partitions percent plus preserve procedure purge range rcfile read readonly reads rebuild recordreader recordwriter recover reduce regexp rename repair replace restrict revoke right rlike row schema schemas semi sequencefile serde serdeproperties set shared show show_database sort sorted ssl statistics stored streamtable table tables tablesample tblproperties temporary terminated textfile then tmp to touch transform trigger true unarchive undo union uniquejoin unlock update use using utc utc_tmestamp view when where while with"), 
      builtin:y("bool boolean long timestamp tinyint smallint bigint int float double date datetime unsigned string array struct map uniontype"), atoms:y("false true null unknown"), operatorChars:/^[*+\-%<>!=]/, dateSQL:y("date timestamp"), support:y("ODBCdotTable doubleQuote binaryNumber hexNumber")});
      x.defineMIME("text/x-pgsql", {name:"sql", client:y("source"), keywords:y("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit a abort abs absent absolute access according action ada add admin after aggregate all allocate also always analyse analyze any are array array_agg array_max_cardinality asensitive assertion assignment asymmetric at atomic attribute attributes authorization avg backward base64 before begin begin_frame begin_partition bernoulli binary bit_length blob blocked bom both breadth c cache call called cardinality cascade cascaded case cast catalog catalog_name ceil ceiling chain characteristics characters character_length character_set_catalog character_set_name character_set_schema char_length check checkpoint class class_origin clob close cluster coalesce cobol collate collation collation_catalog collation_name collation_schema collect column columns column_name command_function command_function_code comment comments commit committed concurrently condition condition_number configuration conflict connect connection connection_name constraint constraints constraint_catalog constraint_name constraint_schema constructor contains content continue control conversion convert copy corr corresponding cost covar_pop covar_samp cross csv cube cume_dist current current_catalog current_date current_default_transform_group current_path current_role current_row current_schema current_time current_timestamp current_transform_group_for_type current_user cursor cursor_name cycle data database datalink datetime_interval_code datetime_interval_precision day db deallocate dec declare default defaults deferrable deferred defined definer degree delimiter delimiters dense_rank depth deref derived describe descriptor deterministic diagnostics dictionary disable discard disconnect dispatch dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue do document domain dynamic dynamic_function dynamic_function_code each element else empty enable encoding encrypted end end-exec end_frame end_partition enforced enum equals escape event every except exception exclude excluding exclusive exec execute exists exp explain expression extension external extract false family fetch file filter final first first_value flag float floor following for force foreign fortran forward found frame_row free freeze fs full function functions fusion g general generated get global go goto grant granted greatest grouping groups handler header hex hierarchy hold hour id identity if ignore ilike immediate immediately immutable implementation implicit import including increment indent index indexes indicator inherit inherits initially inline inner inout input insensitive instance instantiable instead integrity intersect intersection invoker isnull isolation k key key_member key_type label lag language large last last_value lateral lead leading leakproof least left length level library like_regex link listen ln load local localtime localtimestamp location locator lock locked logged lower m map mapping match matched materialized max maxvalue max_cardinality member merge message_length message_octet_length message_text method min minute minvalue mod mode modifies module month more move multiset mumps name names namespace national natural nchar nclob nesting new next nfc nfd nfkc nfkd nil no none normalize normalized nothing notify notnull nowait nth_value ntile null nullable nullif nulls number object occurrences_regex octets octet_length of off offset oids old only open operator option options ordering ordinality others out outer output over overlaps overlay overriding owned owner p pad parameter parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partial partition pascal passing passthrough password percent percentile_cont percentile_disc percent_rank period permission placing plans pli policy portion position position_regex power precedes preceding prepare prepared preserve primary prior privileges procedural procedure program public quote range rank read reads reassign recheck recovery recursive ref references referencing refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex relative release rename repeatable replace replica requiring reset respect restart restore restrict result return returned_cardinality returned_length returned_octet_length returned_sqlstate returning returns revoke right role rollback rollup routine routine_catalog routine_name routine_schema row rows row_count row_number rule savepoint scale schema schema_name scope scope_catalog scope_name scope_schema scroll search second section security selective self sensitive sequence sequences serializable server server_name session session_user setof sets share show similar simple size skip snapshot some source space specific specifictype specific_name sql sqlcode sqlerror sqlexception sqlstate sqlwarning sqrt stable standalone start state statement static statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset substring substring_regex succeeds sum symmetric sysid system system_time system_user t tables tablesample tablespace table_name temp template temporary then ties timezone_hour timezone_minute to token top_level_count trailing transaction transactions_committed transactions_rolled_back transaction_active transform transforms translate translate_regex translation treat trigger trigger_catalog trigger_name trigger_schema trim trim_array true truncate trusted type types uescape unbounded uncommitted under unencrypted unique unknown unlink unlisten unlogged unnamed unnest until untyped upper uri usage user user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema using vacuum valid validate validator value value_of varbinary variadic var_pop var_samp verbose version versioning view views volatile when whenever whitespace width_bucket window within work wrapper write xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate year yes loop repeat"), 
      builtin:y("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float8 inet integer int int4 interval json jsonb line lseg macaddr money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"), atoms:y("false true null unknown"), operatorChars:/^[*+\-%<>!=&|^\/#@?~]/, dateSQL:y("date time timestamp"), 
      support:y("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast")});
      x.defineMIME("text/x-gql", {name:"sql", keywords:y("ancestor and asc by contains desc descendant distinct from group has in is limit offset on order select superset where"), atoms:y("false true"), builtin:y("blob datetime first key __key__ string integer double boolean null"), operatorChars:/^[*+\-%<>!=]/});
    })();
  });
}, {"../../lib/codemirror":"codemirror"}], panel:[function(qa, Ca, va) {
  !function(x) {
    "object" == typeof va && "object" == typeof Ca ? x(qa("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], x) : x(CodeMirror);
  }(function(x) {
    function W(G, y, A, r) {
      this.cm = G;
      this.node = y;
      this.options = A;
      this.height = r;
      this.cleared = !1;
    }
    function R(G) {
      var y = G.getWrapperElement(), A = window.getComputedStyle ? window.getComputedStyle(y) : y.currentStyle, r = parseInt(A.height), E = G.state.panels = {setHeight:y.style.height, heightLeft:r, panels:0, wrapper:document.createElement("div")};
      y.parentNode.insertBefore(E.wrapper, y);
      A = G.hasFocus();
      E.wrapper.appendChild(y);
      A && G.focus();
      G._setSize = G.setSize;
      null != r && (G.setSize = function(u, T) {
        if (null == T) {
          return this._setSize(u, T);
        }
        if (E.setHeight = T, "number" != typeof T) {
          var S = /^(\d+\.?\d*)px$/.exec(T);
          S ? T = Number(S[1]) : (E.wrapper.style.height = T, T = E.wrapper.offsetHeight, E.wrapper.style.height = "");
        }
        G._setSize(u, E.heightLeft += T - r);
        r = T;
      });
    }
    x.defineExtension("addPanel", function(G, y) {
      y = y || {};
      this.state.panels || R(this);
      var A = this.state.panels, r = A.wrapper, E = this.getWrapperElement();
      y.after instanceof W && !y.after.cleared ? r.insertBefore(G, y.before.node.nextSibling) : y.before instanceof W && !y.before.cleared ? r.insertBefore(G, y.before.node) : y.replace instanceof W && !y.replace.cleared ? (r.insertBefore(G, y.replace.node), y.replace.clear()) : "bottom" == y.position ? r.appendChild(G) : "before-bottom" == y.position ? r.insertBefore(G, E.nextSibling) : "after-top" == y.position ? r.insertBefore(G, E) : r.insertBefore(G, r.firstChild);
      r = y && y.height || G.offsetHeight;
      return this._setSize(null, A.heightLeft -= r), A.panels++, new W(this, G, y, r);
    });
    W.prototype.clear = function() {
      if (!this.cleared) {
        this.cleared = !0;
        var G = this.cm.state.panels;
        this.cm._setSize(null, G.heightLeft += this.height);
        G.wrapper.removeChild(this.node);
        if (0 == --G.panels) {
          G = this.cm;
          var y = G.state.panels;
          G.state.panels = null;
          var A = G.getWrapperElement();
          y.wrapper.parentNode.replaceChild(A, y.wrapper);
          A.style.height = y.setHeight;
          G.setSize = G._setSize;
          G.setSize();
        }
      }
    };
    W.prototype.changed = function(G) {
      G = null == G ? this.node.offsetHeight : G;
      this.cm._setSize(null, this.cm.state.panels.height += G - this.height);
      this.height = G;
    };
  });
}, {"../../lib/codemirror":"codemirror"}], "sqlite-parser":[function(qa, Ca, va) {
  function x(y, A, r) {
    var E = (0,R.Tracer)();
    2 === arguments.length && "function" == typeof A && (r = A, A = {});
    var u = {tracer:E, startRule:"start"};
    if (A && A.streaming && (u.startRule = "start_streaming"), "function" == typeof r) {
      setTimeout(function() {
        var T = void 0, S = void 0;
        try {
          T = (0,W.parse)(y, u);
        } catch (C) {
          S = C instanceof W.SyntaxError ? E.smartError(C) : C;
        }
        r(S, T);
      }, 0);
    } else {
      try {
        return (0,W.parse)(y, u);
      } catch (T) {
        throw T instanceof W.SyntaxError ? E.smartError(T) : T;
      }
    }
  }
  Object.defineProperty(va, "__esModule", {value:!0});
  va.default = x;
  var W = qa("./parser"), R = qa("./tracer"), G = qa("./streaming");
  x.createParser = function() {
    return new G.SqliteParserTransform();
  };
  x.createStitcher = function() {
    return new G.SingleNodeTransform();
  };
  x.NAME = "sqlite-parser";
  x.VERSION = "1.0.0";
  Ca.exports = va.default;
}, {"./parser":1, "./streaming":"./streaming", "./tracer":2}]}, {}, [3]);

