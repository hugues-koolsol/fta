"use strict";

(function(f){
        if(typeof exports === "object" && typeof module !== "undefined"){
            module.exports=f();
        }else if(typeof define === "function" && define.amd){
            define([],f);
        }else{
            var g;
            if(typeof window !== "undefined"){
                g=window;
            }else if(typeof global !== "undefined"){
                g=global;
            }else if(typeof self !== "undefined"){
                g=self;
            }else{
                g=this;
            }
            g.sqliteParser=f();
        }
})(function(){
        var define;
        var module;
        var exports;
        return((function e(t,n,r){
            function s(o,u){
                if(!(n[o])){
                    if(!(t[o])){
                        var a = typeof require == "function" && require;
                        if(!(u) && a){
                            return(a(o,!(0)));
                        }
                        if(i){
                            return(i(o,!(0)));
                        }
                        var f = new Error("Cannot find module '" + o + "'");
                        throw f.code="MODULE_NOT_FOUND" , f;
                    }
                    var l = n[o]={"exports" : {}};
                    t[o][0].call(l.exports,function(e){
                            var n=t[o][1][e];
                            return(s(n ? ( n ) : ( e )));
                        },l,l.exports,e,t,n,r);
                }
                return n[o].exports;
            }
            var i = typeof require == "function" && require;
            for( var o=0 ; o < r.length ; o++ ){
                s(r[o]);
            }
            return s;
    })({
            "./streaming" : [function(require,module,exports){
                        Object.defineProperty(exports,"__esModule",{"value" : true});
                        function _classCallCheck(instance,Constructor){
                            if(!(instance instanceof  Constructor)){
                                throw new TypeError("Cannot call a class as a function");
                            }
                        }
                        var SqliteParserTransform = exports.SqliteParserTransform=function SqliteParserTransform(options){
                            _classCallCheck(this,SqliteParserTransform);
                            throw new Error("SqliteParserTransform is not available in this environment");
                        };
                        var SingleNodeTransform = exports.SingleNodeTransform=function SingleNodeTransform(options){
                            _classCallCheck(this,SingleNodeTransform);
                            throw new Error("SingleNodeTransform is not available in this environment");
                        };
                    },{}] ,
            "1" : [function(require,module,exports){
                        Object.defineProperty(exports,"__esModule",{"value" : true});
                        exports.default=sqliteParser;
                        var _parser = require("./parser");
                        var _tracer = require("./tracer");
                        var _streaming = require("./streaming");
                        function sqliteParser(source,options,callback){
                            var t = (0 , _tracer.Tracer)();
                            if(arguments.length === 2){
                                if(typeof options === "function"){
                                    callback=options;
                                    options={};
                                }
                            }
                            var isAsync = typeof callback === "function";
                            var opts={"tracer" : t ,"startRule" : "start"};
                            if(options && options.streaming){
                                opts["startRule"]="start_streaming";
                            }
                            if(isAsync){
                                setTimeout(function(){
                                        var result = void(0);
                                        var err = void(0);
                                        try{
                                            result=(0 , _parser.parse)(source,opts);
                                        }catch(e){
                                            err=e instanceof  _parser.SyntaxError ? ( t.smartError(e) ) : ( e );
                                        }
                                        callback(err,result);
                                    },0);
                            }else{
                                try{
                                    return((0 , _parser.parse)(source,opts));
                                }catch(e){
                                    throw e instanceof  _parser.SyntaxError ? ( t.smartError(e) ) : ( e );
                                }
                            }
                        }
                        sqliteParser["createParser"]=function(){
                            return(new _streaming.SqliteParserTransform);
                        };
                        sqliteParser["createStitcher"]=function(){
                            return(new _streaming.SingleNodeTransform);
                        };
                        sqliteParser["NAME"]="sqlite-parser";
                        sqliteParser["VERSION"]="1.0.1";
                        module.exports=exports["default"];
                    },{"./parser" : 2 ,"./streaming" : "./streaming" ,"./tracer" : 3}] ,
            "2" : [function(require,module,exports){
                        var _slicedToArray = (function(){
                            function sliceIterator(arr,i){
                                var _arr=[];
                                var _n=true;
                                var _d=false;
                                var _e=undefined;
                                try{
                                    for( var _i = arr[Symbol.iterator](),_s ; !(_n=(_s=_i.next()).done) ; _n=true ){
                                        _arr.push(_s.value);
                                        if(i && _arr.length === i){
                                            break;
                                        }
                                    }
                                }catch(err){
                                    _d=true;
                                    _e=err;
                                }
                                return _arr;
                            }
                            return(function(arr,i){
                                if(Array.isArray(arr)){
                                    return arr;
                                }else if(Symbol.iterator in Object(arr)){
                                    return(sliceIterator(arr,i));
                                }else{
                                    throw new TypeError("Invalid attempt to destructure non-iterable instance");
                                }
                            });
                    })();
                        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? ( function(obj){
                                return(typeof obj);
                            } ) : ( function(obj){
                                return(obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? ( "symbol" ) : ( typeof obj ));
                            } );
                        function peg$subclass(child,parent){
                            function ctor(){
                                this.constructor=child;
                            }
                            ctor.prototype=parent.prototype;
                            child.prototype=new ctor();
                        }
                        function peg$SyntaxError(message,expected,found,location){
                            this.message=message;
                            this.expected=expected;
                            this.found=found;
                            this.location=location;
                            this.name="SyntaxError";
                            if(typeof Error.captureStackTrace === "function"){
                                Error.captureStackTrace(this,peg$SyntaxError);
                            }
                        }
                        peg$subclass(peg$SyntaxError,Error);
                        peg$SyntaxError.buildMessage=function(expected,found){
                            var DESCRIBE_EXPECTATION_FNS={
                                "literal" : function literal(expectation){
                                    return('"' + literalEscape(expectation.text) + '"');
                                
                                } ,
                                "class" : function _class(expectation){
                                    var escapedParts = expectation.parts.map(function(part){
                                        return(Array.isArray(part) ? ( classEscape(part[0]) + "-" + classEscape(part[1]) ) : ( classEscape(part) ));
                                    });
                                    return("[" + (expectation.inverted ? ( "^" ) : ( "" )) + escapedParts + "]");
                                
                                } ,
                                "any" : function any(expectation){
                                    return "any character";
                                
                                } ,
                                "end" : function end(expectation){
                                    return "end of input";
                                
                                } ,
                                "other" : function other(expectation){
                                    return expectation.description;
                                
                                }
                            };
                            function hex(ch){
                                return(ch.charCodeAt(0).toString(16).toUpperCase());
                            }
                            function literalEscape(s){
                                return(s.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(ch){
                                    return("\\x0" + hex(ch));
                                }).replace(/[\x10-\x1F\x7F-\x9F]/g,function(ch){
                                    return("\\x" + hex(ch));
                                }));
                            }
                            function classEscape(s){
                                return(s.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(ch){
                                    return("\\x0" + hex(ch));
                                }).replace(/[\x10-\x1F\x7F-\x9F]/g,function(ch){
                                    return("\\x" + hex(ch));
                                }));
                            }
                            function describeExpectation(expectation){
                                return(DESCRIBE_EXPECTATION_FNS[expectation.type](expectation));
                            }
                            function describeExpected(expected){
                                var descriptions = expected.map(describeExpectation);
                                var i;
                                var j;
                                descriptions.sort();
                                if(descriptions.length > 0){
                                    for( i=1 , j=1 ; i < descriptions.length ; i++ ){
                                        if(descriptions[i-1] !== descriptions[i]){
                                            descriptions[j]=descriptions[i];
                                            j++;
                                        }
                                    }
                                    descriptions.length=j;
                                }
                                switch (descriptions.length){
                                    case 1 : return descriptions[0];
                                    case 2 : return(descriptions[0] + " or " + descriptions[1]);
                                    default:
                                        return(descriptions.slice(0,-1).join(", ") + ", or " + descriptions[descriptions.length-1]);
                                        
                                }
                            }
                            function describeFound(found){
                                return(found ? ( '"' + literalEscape(found) + '"' ) : ( "end of input" ));
                            }
                            return("Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.");
                        };
                        function peg$DefaultTracer(){
                            this.indentLevel=0;
                        }
                        peg$DefaultTracer.prototype.trace=function(event){
                            var that=this;
                            function log(event){
                                function repeat(string,n){
                                    var result="";
                                    var i;
                                    for( i=0 ; i < n ; i++ ){
                                        result+=string;
                                    }
                                    return result;
                                }
                                function pad(string,length){
                                    return(string + repeat(" ",length - string.length));
                                }
                                if((typeof console === "undefined" ? ( "undefined" ) : ( _typeof(console) )) === "object"){
                                    console.log(event.location.start.line + ":" + event.location.start.column + "-" + event.location.end.line + ":" + event.location.end.column + " " + pad(event.type,10) + " " + repeat("  ",that.indentLevel) + event.rule);
                                }
                            }
                            switch (event.type){
                                case "rule.enter" :
                                    log(event);
                                    this.indentLevel++;
                                    break;
                                    
                                case "rule.match" :
                                    this.indentLevel--;
                                    log(event);
                                    break;
                                    
                                case "rule.fail" :
                                    this.indentLevel--;
                                    log(event);
                                    break;
                                    
                                default: throw new Error("Invalid event type: " + event.type + ".");
                            }
                        };
                        function peg$parse(input,options){
                            options=options !== undefined ? ( options ) : ( {} );
                            var peg$FAILED={};
                            var peg$startRuleIndices={"start" : 0 ,"start_streaming" : 1};
                            var peg$startRuleIndex=0;
                            var peg$consts = [
                                function(s){
                                        return s;
                                    },
                                function(f,b){
                                        return({"type" : "statement" ,"variant" : "list" ,"statement" : flattenAll([f,b])});
                                    },
                                function(s){
                                        return s;
                                    },
                                peg$otherExpectation("Type Definition"),
                                function(t,a){
                                        return(Object.assign(t,a));
                                    },
                                function(n){
                                        return({"type" : "datatype" ,"variant" : n[0] ,"affinity" : n[1]});
                                    },
                                peg$otherExpectation("Custom Datatype Name"),
                                function(t,r){
                                        var variant = foldStringKey([t,r]);
                                        var affinity="numeric";
                                        if(/int/i.test(variant)){
                                            affinity="integer";
                                        }else if(/char|clob|text/i.test(variant)){
                                            affinity="text";
                                        }else if(/blob/i.test(variant)){
                                            affinity="blob";
                                        }else if(/real|floa|doub/i.test(variant)){
                                            affinity="real";
                                        }
                                        return({"type" : "datatype" ,"variant" : variant ,"affinity" : affinity});
                                    },
                                /^[\t ]/,
                                peg$classExpectation(["\t"," "],false,false),
                                function(w){
                                        return w;
                                    },
                                peg$otherExpectation("Type Definition Arguments"),
                                function(a1,a2){
                                        return({"args" : {"type" : "expression" ,"variant" : "list" ,"expression" : flattenAll([a1,a2])}});
                                    },
                                function(n){
                                        return n;
                                    },
                                peg$otherExpectation("Null Literal"),
                                function(n){
                                        return({"type" : "literal" ,"variant" : "null" ,"value" : keyNode(n)});
                                    },
                                peg$otherExpectation("Date Literal"),
                                function(d){
                                        return({"type" : "literal" ,"variant" : "date" ,"value" : keyNode(d)});
                                    },
                                peg$otherExpectation("String Literal"),
                                function(n,s){
                                        return({"type" : "literal" ,"variant" : "text" ,"value" : s});
                                    },
                                peg$otherExpectation("Single-quoted String Literal"),
                                function(s){
                                        return(unescape(s,"'"));
                                    },
                                "''",
                                peg$literalExpectation("''",false),
                                /^[^']/,
                                peg$classExpectation(["'"],true,false),
                                peg$otherExpectation("Blob Literal"),
                                /^[x]/i,
                                peg$classExpectation(["x"],false,true),
                                function(b){
                                        return({"type" : "literal" ,"variant" : "blob" ,"value" : b});
                                    },
                                function(n){
                                        return({"type" : "literal" ,"variant" : "text" ,"value" : n});
                                    },
                                peg$otherExpectation("Number Sign"),
                                function(s,n){
                                        if(isOkay(s)){
                                            n["value"]=foldStringWord([s,n["value"]]);
                                        }
                                        return n;
                                    },
                                function(d,e){
                                        return({"type" : "literal" ,"variant" : "decimal" ,"value" : foldStringWord([d,e])});
                                    },
                                peg$otherExpectation("Decimal Literal"),
                                function(f,b){
                                        return(foldStringWord([f,b]));
                                    },
                                function(t,d){
                                        return(foldStringWord([t,d]));
                                    },
                                peg$otherExpectation("Decimal Literal Exponent"),
                                "e",
                                peg$literalExpectation("E",true),
                                /^[+\-]/,
                                peg$classExpectation(["+","-"],false,false),
                                function(e,s,d){
                                        return(foldStringWord([e,s,d]));
                                    },
                                peg$otherExpectation("Hexidecimal Literal"),
                                "0x",
                                peg$literalExpectation("0x",true),
                                function(f,b){
                                        return({"type" : "literal" ,"variant" : "hexidecimal" ,"value" : foldStringWord([f,b])});
                                    },
                                /^[0-9a-f]/i,
                                peg$classExpectation([["0","9"],["a","f"]],false,true),
                                /^[0-9]/,
                                peg$classExpectation([["0","9"]],false,false),
                                peg$otherExpectation("Bind Parameter"),
                                function(b){
                                        return(Object.assign({"type" : "variable"},b));
                                    },
                                peg$otherExpectation("Numbered Bind Parameter"),
                                function(q,id){
                                        return({"format" : "numbered" ,"name" : foldStringWord([q,id])});
                                    },
                                /^[1-9]/,
                                peg$classExpectation([["1","9"]],false,false),
                                function(f,r){
                                        return(foldStringWord([f,r]));
                                    },
                                peg$otherExpectation("Named Bind Parameter"),
                                /^[:@]/,
                                peg$classExpectation([":","@"],false,false),
                                function(s,name){
                                        return({"format" : "named" ,"name" : foldStringWord([s,name])});
                                    },
                                peg$otherExpectation("TCL Bind Parameter"),
                                "$",
                                peg$literalExpectation("$",false),
                                ":",
                                peg$literalExpectation(":",false),
                                function(d,name,s){
                                        return(Object.assign({"format" : "tcl" ,"name" : foldStringWord([d,name])},s));
                                    },
                                function(sfx){
                                        return({"suffix" : sfx});
                                    },
                                peg$otherExpectation("EXISTS Expression"),
                                function(n,e){
                                        if(isOkay(n)){
                                            return({"type" : "expression" ,"format" : "unary" ,"variant" : "exists" ,"expression" : e ,"operator" : keyNode(n)});
                                        }
                                        return e;
                                    },
                                peg$otherExpectation("EXISTS Keyword"),
                                function(n,x){
                                        return(foldStringKey([n,x]));
                                    },
                                peg$otherExpectation("RAISE Expression"),
                                function(s,a){
                                        return(Object.assign({"type" : "expression" ,"format" : "unary" ,"variant" : keyNode(s) ,"expression" : a},a));
                                    },
                                peg$otherExpectation("RAISE Expression Arguments"),
                                function(a){
                                        return(Object.assign({"type" : "error"},a));
                                    },
                                peg$otherExpectation("IGNORE Keyword"),
                                function(f){
                                        return({"action" : keyNode(f)});
                                    },
                                function(f,m){
                                        return({"action" : keyNode(f) ,"message" : m});
                                    },
                                function(n){
                                        return n;
                                    },
                                function(e,c){
                                        return(Object.assign(c,{"expression" : e}));
                                    },
                                function(op,e){
                                        return({"type" : "expression" ,"format" : "unary" ,"variant" : "operation" ,"expression" : e ,"operator" : keyNode(op)});
                                    },
                                peg$otherExpectation("COLLATE Expression"),
                                function(c){
                                        return(Object.assign({"type" : "expression" ,"format" : "unary" ,"variant" : "operation" ,"operator" : "collate"},c));
                                    },
                                function(f,rest){
                                        return(composeBinary(f,rest));
                                    },
                                function(i){
                                        return([null,i,null,{"type" : "literal" ,"variant" : "null" ,"value" : "null"}]);
                                    },
                                "not ",
                                peg$literalExpectation("NOT ",true),
                                "null",
                                peg$literalExpectation("NULL",true),
                                function(){
                                        return "not";
                                    },
                                function(){
                                        return "is";
                                    },
                                peg$otherExpectation("CAST Expression"),
                                function(s,e,a){
                                        return({"type" : "expression" ,"format" : "unary" ,"variant" : keyNode(s) ,"expression" : e ,"as" : a});
                                    },
                                peg$otherExpectation("Type Alias"),
                                function(d){
                                        return d;
                                    },
                                peg$otherExpectation("CASE Expression"),
                                function(t,e,w,s){
                                        return(Object.assign({"type" : "expression" ,"variant" : keyNode(t) ,"expression" : flattenAll([w,s])},e));
                                    },
                                function(e){
                                        return({"discriminant" : e});
                                    },
                                peg$otherExpectation("WHEN Clause"),
                                function(s,w,t){
                                        return({"type" : "condition" ,"variant" : keyNode(s) ,"condition" : w ,"consequent" : t});
                                    },
                                peg$otherExpectation("ELSE Clause"),
                                function(s,e){
                                        return({"type" : "condition" ,"variant" : keyNode(s) ,"consequent" : e});
                                    },
                                function(v,p){
                                        return(Object.assign(p,{"left" : v}));
                                    },
                                peg$otherExpectation("Comparison Expression"),
                                function(n,m,e,x){
                                        return(Object.assign({"type" : "expression" ,"format" : "binary" ,"variant" : "operation" ,"operation" : foldStringKey([n,m]) ,"right" : e},x));
                                    },
                                peg$otherExpectation("ESCAPE Expression"),
                                function(s,e){
                                        return({"escape" : e});
                                    },
                                peg$otherExpectation("BETWEEN Expression"),
                                function(n,b,tail){
                                        return({"type" : "expression" ,"format" : "binary" ,"variant" : "operation" ,"operation" : foldStringKey([n,b]) ,"right" : tail});
                                    },
                                function(f,rest){
                                        return(composeBinary(f,[rest]));
                                    },
                                function(n){
                                        return(keyNode(n));
                                    },
                                peg$otherExpectation("IN Expression"),
                                function(n,i,e){
                                        return({"type" : "expression" ,"format" : "binary" ,"variant" : "operation" ,"operation" : foldStringKey([n,i]) ,"right" : e});
                                    },
                                function(e){
                                        return e;
                                    },
                                peg$otherExpectation("Expression List"),
                                function(l){
                                        return({"type" : "expression" ,"variant" : "list" ,"expression" : isOkay(l) ? ( l ) : ( [] )});
                                    },
                                function(f,rest){
                                        return(flattenAll([f,rest]));
                                    },
                                peg$otherExpectation("Function Call"),
                                function(n,a){
                                        return(Object.assign({"type" : "function" ,"name" : n},a));
                                    },
                                peg$otherExpectation("Function Call Arguments"),
                                function(s){
                                        return({"args" : {"type" : "identifier" ,"variant" : "star" ,"name" : s}});
                                    },
                                function(d,e){
                                        return(!(isOkay(d)) || e["expression"].length > 0);
                                    },
                                function(d,e){
                                        return({"args" : Object.assign(e,d)});
                                    },
                                function(s){
                                        return({"filter" : keyNode(s)});
                                    },
                                peg$otherExpectation("Error Message"),
                                function(m){
                                        return m;
                                    },
                                peg$otherExpectation("Statement"),
                                function(m,s){
                                        return(Object.assign(s,m));
                                    },
                                peg$otherExpectation("QUERY PLAN"),
                                function(e,q){
                                        return({"explain" : isOkay(e)});
                                    },
                                peg$otherExpectation("QUERY PLAN Keyword"),
                                function(q,p){
                                        return(foldStringKey([q,p]));
                                    },
                                peg$otherExpectation("END Transaction Statement"),
                                function(s,t){
                                        return({"type" : "statement" ,"variant" : "transaction" ,"action" : "commit"});
                                    },
                                peg$otherExpectation("BEGIN Transaction Statement"),
                                function(s,m,t,n){
                                        return(Object.assign({"type" : "statement" ,"variant" : "transaction" ,"action" : "begin"},m,n));
                                    },
                                function(t){
                                        return t;
                                    },
                                function(m){
                                        return({"defer" : keyNode(m)});
                                    },
                                peg$otherExpectation("ROLLBACK Statement"),
                                function(s,n){
                                        return(Object.assign({"type" : "statement" ,"variant" : "transaction" ,"action" : "rollback"},n));
                                    },
                                peg$otherExpectation("TO Clause"),
                                function(n){
                                        return({"savepoint" : n});
                                    },
                                function(s){
                                        return(keyNode(s));
                                    },
                                peg$otherExpectation("SAVEPOINT Statement"),
                                function(s,n){
                                        return({"type" : "statement" ,"variant" : s ,"target" : n});
                                    },
                                peg$otherExpectation("RELEASE Statement"),
                                function(s,a,n){
                                        return({"type" : "statement" ,"variant" : keyNode(s) ,"target" : n});
                                    },
                                peg$otherExpectation("ALTER TABLE Statement"),
                                function(s,n,e){
                                        return(Object.assign({"type" : "statement" ,"variant" : keyNode(s) ,"target" : n},e));
                                    },
                                peg$otherExpectation("ALTER TABLE Keyword"),
                                function(a,t){
                                        return(foldStringKey([a,t]));
                                    },
                                peg$otherExpectation("RENAME TO Keyword"),
                                function(s,n){
                                        return({"action" : keyNode(s) ,"name" : n});
                                    },
                                peg$otherExpectation("ADD COLUMN Keyword"),
                                function(s,d){
                                        return({"action" : keyNode(s) ,"definition" : d});
                                    },
                                function(w,s){
                                        return(Object.assign(s,w));
                                    },
                                peg$otherExpectation("WITH Clause"),
                                function(s,v,t){
                                        var recursive={"variant" : isOkay(v) ? ( "recursive" ) : ( "common" )};
                                        if(isArrayOkay(t)){
                                            t=t.map(function(elem){
                                                return(Object.assign(elem,recursive));
                                            });
                                        }
                                        return({"with" : t});
                                    },
                                function(f,r){
                                        return(flattenAll([f,r]));
                                    },
                                peg$otherExpectation("Common Table Expression"),
                                function(t,s){
                                        return(Object.assign({"type" : "expression" ,"format" : "table" ,"variant" : "common" ,"target" : t},s));
                                    },
                                function(s){
                                        return({"expression" : s});
                                    },
                                function(w,s){
                                        return(Object.assign(s,w));
                                    },
                                peg$otherExpectation("ATTACH Statement"),
                                function(a,b,e,n){
                                        return({"type" : "statement" ,"variant" : keyNode(a) ,"target" : n ,"attach" : e});
                                    },
                                peg$otherExpectation("DETACH Statement"),
                                function(d,b,n){
                                        return({"type" : "statement" ,"variant" : keyNode(d) ,"target" : n});
                                    },
                                peg$otherExpectation("VACUUM Statement"),
                                function(v,t){
                                        return(Object.assign({"type" : "statement" ,"variant" : "vacuum"},t));
                                    },
                                function(t){
                                        return({"target" : t});
                                    },
                                peg$otherExpectation("ANALYZE Statement"),
                                function(s,a){
                                        return(Object.assign({"type" : "statement" ,"variant" : keyNode(s)},a));
                                    },
                                function(n){
                                        return({"target" : n["name"]});
                                    },
                                peg$otherExpectation("REINDEX Statement"),
                                function(a){
                                        return({"target" : a["name"]});
                                    },
                                peg$otherExpectation("PRAGMA Statement"),
                                function(s,n,v){
                                        return({"type" : "statement" ,"variant" : keyNode(s) ,"target" : n ,"args" : {"type" : "expression" ,"variant" : "list" ,"expression" : v}});
                                    },
                                function(v){
                                        return v;
                                    },
                                function(v){
                                        return(/^(yes|no|on|off|false|true|0|1)$/i.test(v));
                                    },
                                function(v){
                                        return({"type" : "literal" ,"variant" : "boolean" ,"normalized" : /^(yes|on|true|1)$/i.test(v) ? ( "1" ) : ( "0" ) ,"value" : v});
                                    },
                                function(n){
                                        return(keyNode(n));
                                    },
                                function(n){
                                        return({"type" : "identifier" ,"variant" : "name" ,"name" : n});
                                    },
                                peg$otherExpectation("SELECT Statement"),
                                function(s,o,l){
                                        return(Object.assign(s,o,l));
                                    },
                                peg$otherExpectation("ORDER BY Clause"),
                                function(d){
                                        return({"order" : d["result"]});
                                    },
                                peg$otherExpectation("LIMIT Clause"),
                                function(s,e,d){
                                        return({"limit" : Object.assign({"type" : "expression" ,"variant" : "limit" ,"start" : e},d)});
                                    },
                                peg$otherExpectation("OFFSET Clause"),
                                function(o,e){
                                        return({"offset" : e});
                                    },
                                function(s,u){
                                        if(isArrayOkay(u)){
                                            return({"type" : "statement" ,"variant" : "compound" ,"statement" : s ,"compound" : u});
                                        }else{
                                            return s;
                                        }
                                    },
                                peg$otherExpectation("Union Operation"),
                                function(c,s){
                                        return({"type" : "compound" ,"variant" : c ,"statement" : s});
                                    },
                                function(s,f,w,g){
                                        return(Object.assign({"type" : "statement" ,"variant" : "select"},s,f,w,g));
                                    },
                                peg$otherExpectation("SELECT Results Clause"),
                                function(d,t){
                                        return(Object.assign({"result" : t},d));
                                    },
                                peg$otherExpectation("SELECT Results Modifier"),
                                function(s){
                                        return({"distinct" : true});
                                    },
                                function(s){
                                        return({});
                                    },
                                peg$otherExpectation("FROM Clause"),
                                function(f,s){
                                        return({"from" : s});
                                    },
                                peg$otherExpectation("WHERE Clause"),
                                function(f,e){
                                        return({"where" : makeArray(e)});
                                    },
                                peg$otherExpectation("GROUP BY Clause"),
                                function(f,e,h){
                                        return(Object.assign({"group" : e},h));
                                    },
                                peg$otherExpectation("HAVING Clause"),
                                function(f,e){
                                        return({"having" : e});
                                    },
                                function(q,s){
                                        return({"type" : "identifier" ,"variant" : "star" ,"name" : foldStringWord([q,s])});
                                    },
                                function(n,s){
                                        return(foldStringWord([n,s]));
                                    },
                                function(e,a){
                                        return(Object.assign(e,a));
                                    },
                                function(f,t){
                                        if(isArrayOkay(t)){
                                            return({"type" : "map" ,"variant" : "join" ,"source" : f ,"map" : t});
                                        }
                                        return f;
                                    },
                                function(cl,c){
                                        return(Object.assign(cl,c));
                                    },
                                peg$otherExpectation("CROSS JOIN Operation"),
                                function(n){
                                        return({"type" : "join" ,"variant" : "cross join" ,"source" : n});
                                    },
                                peg$otherExpectation("JOIN Operation"),
                                function(o,n){
                                        return({"type" : "join" ,"variant" : keyNode(o) ,"source" : n});
                                    },
                                function(n,l,a){
                                        return(Object.assign({"type" : "function" ,"variant" : "table" ,"name" : n ,"args" : l},a));
                                    },
                                peg$otherExpectation("Qualified Table"),
                                function(d,i){
                                        return(Object.assign(d,i));
                                    },
                                peg$otherExpectation("Qualified Table Identifier"),
                                function(n,a){
                                        return(Object.assign(n,a));
                                    },
                                peg$otherExpectation("Qualfied Table Index"),
                                function(s,n){
                                        return({"index" : n});
                                    },
                                function(n,i){
                                        return({"index" : foldStringKey([n,i])});
                                    },
                                peg$otherExpectation("SELECT Source"),
                                function(l,a){
                                        return(Object.assign(l,a));
                                    },
                                peg$otherExpectation("Subquery"),
                                function(s,a){
                                        return(Object.assign(s,a));
                                    },
                                peg$otherExpectation("Alias"),
                                function(a,n){
                                        return({"alias" : n});
                                    },
                                peg$otherExpectation("JOIN Operator"),
                                function(n,t,j){
                                        return(foldStringKey([n,t,j]));
                                    },
                                function(t,o){
                                        return(foldStringKey([t,o]));
                                    },
                                function(t){
                                        return(keyNode(t));
                                    },
                                peg$otherExpectation("JOIN Constraint"),
                                function(c){
                                        return({"constraint" : Object.assign({"type" : "constraint" ,"variant" : "join"},c)});
                                    },
                                peg$otherExpectation("Join ON Clause"),
                                function(s,e){
                                        return({"format" : keyNode(s) ,"on" : e});
                                    },
                                peg$otherExpectation("Join USING Clause"),
                                function(s,e){
                                        return({"format" : keyNode(s) ,"using" : e});
                                    },
                                peg$otherExpectation("VALUES Clause"),
                                function(s,l){
                                        return({"type" : "statement" ,"variant" : "select" ,"result" : l});
                                    },
                                function(f,b){
                                        return({"result" : flattenAll([f,b])});
                                    },
                                function(i){
                                        return i;
                                    },
                                peg$otherExpectation("Ordering Expression"),
                                function(e,d){
                                        if(isOkay(d)){
                                            return(Object.assign({"type" : "expression" ,"variant" : "order" ,"expression" : e},d));
                                        }
                                        return e;
                                    },
                                peg$otherExpectation("Star"),
                                peg$otherExpectation("Fallback Type"),
                                peg$otherExpectation("INSERT Statement"),
                                function(k,t){
                                        return(Object.assign({"type" : "statement" ,"variant" : "insert"},k,t));
                                    },
                                peg$otherExpectation("INSERT Keyword"),
                                function(a,m){
                                        return(Object.assign({"action" : keyNode(a)},m));
                                    },
                                peg$otherExpectation("REPLACE Keyword"),
                                function(a){
                                        return({"action" : keyNode(a)});
                                    },
                                peg$otherExpectation("INSERT OR Modifier"),
                                function(s,m){
                                        return({"or" : keyNode(m)});
                                    },
                                function(i,r){
                                        return(Object.assign({"into" : i},r));
                                    },
                                peg$otherExpectation("INTO Clause"),
                                function(s,t){
                                        return t;
                                    },
                                peg$otherExpectation("INTO Keyword"),
                                function(r){
                                        return({"result" : r});
                                    },
                                peg$otherExpectation("Column List"),
                                function(f,b){
                                        return({"columns" : flattenAll([f,b])});
                                    },
                                function(c){
                                        return c;
                                    },
                                peg$otherExpectation("Column Name"),
                                function(n){
                                        return({"type" : "identifier" ,"variant" : "column" ,"name" : n});
                                    },
                                function(s,r){
                                        return r;
                                    },
                                peg$otherExpectation("VALUES Keyword"),
                                function(f,b){
                                        return(flattenAll([f,b]));
                                    },
                                peg$otherExpectation("Wrapped Expression List"),
                                function(e){
                                        return e;
                                    },
                                peg$otherExpectation("DEFAULT VALUES Clause"),
                                function(d,v){
                                        return({"type" : "values" ,"variant" : "default"});
                                    },
                                peg$otherExpectation("Compound Operator"),
                                peg$otherExpectation("UNION Operator"),
                                function(s,a){
                                        return(foldStringKey([s,a]));
                                    },
                                function(a){
                                        return a;
                                    },
                                peg$otherExpectation("UPDATE Statement"),
                                function(s,f,t,u,w,o,l){
                                        return(Object.assign({"type" : "statement" ,"variant" : s ,"into" : t},f,u,w,o,l));
                                    },
                                peg$otherExpectation("UPDATE Keyword"),
                                peg$otherExpectation("UPDATE OR Modifier"),
                                function(t){
                                        return({"or" : keyNode(t)});
                                    },
                                peg$otherExpectation("SET Clause"),
                                function(c){
                                        return({"set" : c});
                                    },
                                peg$otherExpectation("Column Assignment"),
                                function(f,e){
                                        return({"type" : "assignment" ,"target" : f ,"value" : e});
                                    },
                                peg$otherExpectation("DELETE Statement"),
                                function(s,t,w,o,l){
                                        return(Object.assign({"type" : "statement" ,"variant" : s ,"from" : t},w,o,l));
                                    },
                                peg$otherExpectation("DELETE Keyword"),
                                peg$otherExpectation("CREATE Statement"),
                                peg$otherExpectation("CREATE TABLE Statement"),
                                function(s,ne,id,r){
                                        return(Object.assign({"type" : "statement" ,"name" : id},s,r,ne));
                                    },
                                function(s,tmp,t){
                                        return(Object.assign({"variant" : s ,"format" : keyNode(t)},tmp));
                                    },
                                function(t){
                                        return({"temporary" : isOkay(t)});
                                    },
                                peg$otherExpectation("IF NOT EXISTS Modifier"),
                                function(i,n,e){
                                        return({
                                            "condition" : makeArray({"type" : "condition" ,"variant" : keyNode(i) ,"condition" : {"type" : "expression" ,"variant" : keyNode(e) ,"operator" : foldStringKey([n,e])}})
                                        });
                                    },
                                peg$otherExpectation("Table Definition"),
                                function(s,t,r){
                                        return(Object.assign({"definition" : flattenAll([s,t])},r));
                                    },
                                function(r,w){
                                        return({"optimization" : [{"type" : "optimization" ,"value" : foldStringKey([r,w])}]});
                                    },
                                function(f){
                                        return f;
                                    },
                                peg$otherExpectation("Column Definition"),
                                function(n,t,c){
                                        return(Object.assign({"type" : "definition" ,"variant" : "column" ,"name" : n ,"definition" : isOkay(c) ? ( c ) : ( [] )},t));
                                    },
                                peg$otherExpectation("Column Datatype"),
                                function(t){
                                        return({"datatype" : t});
                                    },
                                peg$otherExpectation("Column Constraint"),
                                function(n,c,ln){
                                        return(Object.assign(c,n));
                                    },
                                function(cl){
                                        return cl[cl.length-1];
                                    },
                                peg$otherExpectation("CONSTRAINT Name"),
                                function(n){
                                        return({"name" : n});
                                    },
                                peg$otherExpectation("FOREIGN KEY Column Constraint"),
                                function(f){
                                        return(Object.assign({"variant" : "foreign key"},f));
                                    },
                                peg$otherExpectation("PRIMARY KEY Column Constraint"),
                                function(p,d,c,a){
                                        return(Object.assign(p,c,d,a));
                                    },
                                peg$otherExpectation("PRIMARY KEY Keyword"),
                                function(s,k){
                                        return({"type" : "constraint" ,"variant" : foldStringKey([s,k])});
                                    },
                                peg$otherExpectation("AUTOINCREMENT Keyword"),
                                function(a){
                                        return({"autoIncrement" : true});
                                    },
                                function(s,c){
                                        return(Object.assign({"type" : "constraint" ,"variant" : s},c));
                                    },
                                peg$otherExpectation("UNIQUE Column Constraint"),
                                peg$otherExpectation("NULL Column Constraint"),
                                function(n,l){
                                        return(foldStringKey([n,l]));
                                    },
                                peg$otherExpectation("CHECK Column Constraint"),
                                peg$otherExpectation("DEFAULT Column Constraint"),
                                function(s,v){
                                        return({"type" : "constraint" ,"variant" : keyNode(s) ,"value" : v});
                                    },
                                peg$otherExpectation("COLLATE Column Constraint"),
                                function(c){
                                        return({"type" : "constraint" ,"variant" : "collate" ,"collate" : c});
                                    },
                                peg$otherExpectation("Table Constraint"),
                                function(n,c,nl){
                                        return(Object.assign({"type" : "definition" ,"variant" : "constraint"},c,n));
                                    },
                                peg$otherExpectation("CHECK Table Constraint"),
                                function(c){
                                        return({"definition" : makeArray(c)});
                                    },
                                peg$otherExpectation("PRIMARY KEY Table Constraint"),
                                function(k,c,t){
                                        return({"definition" : makeArray(Object.assign(k,t,c[1])) ,"columns" : c[0]});
                                    },
                                function(s){
                                        return({"type" : "constraint" ,"variant" : keyNode(s)});
                                    },
                                function(p,k){
                                        return(foldStringKey([p,k]));
                                    },
                                peg$otherExpectation("UNIQUE Keyword"),
                                function(u){
                                        return(keyNode(u));
                                    },
                                function(f,b){
                                        return([f].concat(b));
                                    },
                                function(c){
                                        return(c.map(function(_ref){
                                            var _ref2 = _slicedToArray(_ref,1);
                                            var res=_ref2[0];
                                            return res;
                                        }));
                                    },
                                function(c){
                                        var auto = c.find(function(_ref3){
                                            var _ref4 = _slicedToArray(_ref3,2);
                                            var res=_ref4[0];
                                            var a=_ref4[1];
                                            return(isOkay(a));
                                        });
                                        return([c.map(function(_ref5){
                                                    var _ref6 = _slicedToArray(_ref5,2);
                                                    var res=_ref6[0];
                                                    var a=_ref6[1];
                                                    return res;
                                                }),auto ? ( auto[1] ) : ( null )]);
                                    },
                                peg$otherExpectation("Indexed Column"),
                                function(e,d,a){
                                        var res=e;
                                        if(isOkay(d)){
                                            res=Object.assign({"type" : "expression" ,"variant" : "order" ,"expression" : e},d);
                                        }
                                        return([res,a]);
                                    },
                                peg$otherExpectation("Collation"),
                                function(c){
                                        return({"collate" : makeArray(c)});
                                    },
                                peg$otherExpectation("Column Direction"),
                                function(t){
                                        return({"direction" : keyNode(t)});
                                    },
                                function(s,t){
                                        return({"conflict" : keyNode(t)});
                                    },
                                peg$otherExpectation("ON CONFLICT Keyword"),
                                function(o,c){
                                        return(foldStringKey([o,c]));
                                    },
                                function(k,c){
                                        return({"type" : "constraint" ,"variant" : keyNode(k) ,"expression" : c});
                                    },
                                peg$otherExpectation("FOREIGN KEY Table Constraint"),
                                function(k,l,c){
                                        return(Object.assign({"definition" : makeArray(Object.assign(k,c))},l));
                                    },
                                peg$otherExpectation("FOREIGN KEY Keyword"),
                                function(f,k){
                                        return({"type" : "constraint" ,"variant" : foldStringKey([f,k])});
                                    },
                                function(r,a,d){
                                        return(Object.assign({"type" : "constraint"},r,a,d));
                                    },
                                peg$otherExpectation("REFERENCES Clause"),
                                function(s,t){
                                        return({"references" : t});
                                    },
                                function(f,b){
                                        return({"action" : flattenAll([f,b])});
                                    },
                                peg$otherExpectation("FOREIGN KEY Action Clause"),
                                function(m,a,n){
                                        return({"type" : "action" ,"variant" : keyNode(m) ,"action" : keyNode(n)});
                                    },
                                peg$otherExpectation("FOREIGN KEY Action"),
                                function(s,v){
                                        return(foldStringKey([s,v]));
                                    },
                                function(c){
                                        return(keyNode(c));
                                    },
                                function(n,a){
                                        return(foldStringKey([n,a]));
                                    },
                                function(m,n){
                                        return({"type" : "action" ,"variant" : keyNode(m) ,"action" : n});
                                    },
                                peg$otherExpectation("DEFERRABLE Clause"),
                                function(n,d,i){
                                        return({"defer" : foldStringKey([n,d,i])});
                                    },
                                function(i,d){
                                        return(foldStringKey([i,d]));
                                    },
                                function(s){
                                        return({"definition" : makeArray(s)});
                                    },
                                peg$otherExpectation("CREATE INDEX Statement"),
                                function(s,ne,n,o,w){
                                        return(Object.assign({"type" : "statement" ,"target" : n ,"on" : o},s,ne,w));
                                    },
                                function(s,u,i){
                                        return(Object.assign({"variant" : keyNode(s) ,"format" : keyNode(i)},u));
                                    },
                                function(u){
                                        return({"unique" : true});
                                    },
                                peg$otherExpectation("ON Clause"),
                                function(o,t,c){
                                        return({"type" : "identifier" ,"variant" : "expression" ,"format" : "table" ,"name" : t["name"] ,"columns" : c});
                                    },
                                peg$otherExpectation("CREATE TRIGGER Statement"),
                                function(s,ne,n,cd,o,me,wh,a){
                                        return(Object.assign({
                                            "type" : "statement" ,
                                            "target" : n ,
                                            "on" : o ,
                                            "event" : cd ,
                                            "by" : isOkay(me) ? ( me ) : ( "row" ) ,
                                            "action" : makeArray(a)
                                        },s,ne,wh));
                                    },
                                function(s,tmp,t){
                                        return(Object.assign({"variant" : keyNode(s) ,"format" : keyNode(t)},tmp));
                                    },
                                peg$otherExpectation("Conditional Clause"),
                                function(m,d){
                                        return(Object.assign({"type" : "event"},m,d));
                                    },
                                function(m){
                                        return({"occurs" : keyNode(m)});
                                    },
                                function(i,o){
                                        return(foldStringKey([i,o]));
                                    },
                                peg$otherExpectation("Conditional Action"),
                                function(o){
                                        return({"event" : keyNode(o)});
                                    },
                                function(s,f){
                                        return({"event" : keyNode(s) ,"of" : f});
                                    },
                                function(s,c){
                                        return c;
                                    },
                                "statement",
                                peg$literalExpectation("STATEMENT",true),
                                function(f,e,r){
                                        return(keyNode(r));
                                    },
                                function(w,e){
                                        return({"when" : e});
                                    },
                                peg$otherExpectation("Actions Clause"),
                                function(s,a,e){
                                        return a;
                                    },
                                function(l){
                                        return l;
                                    },
                                peg$otherExpectation("CREATE VIEW Statement"),
                                function(s,ne,n,r){
                                        return(Object.assign({"type" : "statement" ,"target" : n ,"result" : r},s,ne));
                                    },
                                function(n,a){
                                        return(Object.assign({"type" : "identifier" ,"variant" : "expression" ,"format" : "view" ,"name" : n["name"] ,"columns" : []},a));
                                    },
                                function(s,tmp,v){
                                        return(Object.assign({"variant" : keyNode(s) ,"format" : keyNode(v)},tmp));
                                    },
                                peg$otherExpectation("CREATE VIRTUAL TABLE Statement"),
                                function(s,ne,n,m){
                                        return(Object.assign({"type" : "statement" ,"target" : n ,"result" : m},s,ne));
                                    },
                                function(s,v,t){
                                        return({"variant" : keyNode(s) ,"format" : keyNode(v)});
                                    },
                                function(m,a){
                                        return(Object.assign({"type" : "module" ,"variant" : "virtual" ,"name" : m},a));
                                    },
                                peg$otherExpectation("Module Arguments"),
                                function(l){
                                        return({"args" : {"type" : "expression" ,"variant" : "list" ,"expression" : isOkay(l) ? ( l ) : ( [] )}});
                                    },
                                function(f,b){
                                        return(flattenAll([f,b]).filter(function(arg){
                                            return(isOkay(arg));
                                        }));
                                    },
                                function(a){
                                        return a;
                                    },
                                peg$otherExpectation("DROP Statement"),
                                function(s,q){
                                        return(Object.assign({"type" : "statement" ,"target" : Object.assign(q,{"variant" : s["format"]})},s));
                                    },
                                peg$otherExpectation("DROP Keyword"),
                                function(s,t,i){
                                        return(Object.assign({"variant" : keyNode(s) ,"format" : t ,"condition" : []},i));
                                    },
                                peg$otherExpectation("DROP Type"),
                                peg$otherExpectation("IF EXISTS Keyword"),
                                function(i,e){
                                        return({"condition" : [{"type" : "condition" ,"variant" : keyNode(i) ,"condition" : {"type" : "expression" ,"variant" : keyNode(e) ,"operator" : keyNode(e)}}]});
                                    },
                                peg$otherExpectation("Or"),
                                peg$otherExpectation("Add"),
                                peg$otherExpectation("Subtract"),
                                peg$otherExpectation("Multiply"),
                                peg$otherExpectation("Divide"),
                                peg$otherExpectation("Modulo"),
                                peg$otherExpectation("Shift Left"),
                                peg$otherExpectation("Shift Right"),
                                peg$otherExpectation("Logical AND"),
                                peg$otherExpectation("Logical OR"),
                                peg$otherExpectation("Less Than"),
                                peg$otherExpectation("Greater Than"),
                                peg$otherExpectation("Less Than Or Equal"),
                                peg$otherExpectation("Greater Than Or Equal"),
                                peg$otherExpectation("Equal"),
                                peg$otherExpectation("Not Equal"),
                                peg$otherExpectation("IS"),
                                function(i,n){
                                        return(foldStringKey([i,n]));
                                    },
                                peg$otherExpectation("Identifier"),
                                peg$otherExpectation("Database Identifier"),
                                function(n){
                                        return({"type" : "identifier" ,"variant" : "database" ,"name" : n});
                                    },
                                peg$otherExpectation("Function Identifier"),
                                function(d,n){
                                        return({"type" : "identifier" ,"variant" : "function" ,"name" : foldStringWord([d,n])});
                                    },
                                peg$otherExpectation("Table Identifier"),
                                function(d,n){
                                        return({"type" : "identifier" ,"variant" : "table" ,"name" : foldStringWord([d,n])});
                                    },
                                function(n,d){
                                        return(foldStringWord([n,d]));
                                    },
                                peg$otherExpectation("Column Identifier"),
                                function(q,n){
                                        return({"type" : "identifier" ,"variant" : "column" ,"name" : foldStringWord([q,n])});
                                    },
                                function(){
                                        return "";
                                    },
                                function(d,t){
                                        return(foldStringWord([d,t]));
                                    },
                                peg$otherExpectation("Collation Identifier"),
                                function(n){
                                        return({"type" : "identifier" ,"variant" : "collation" ,"name" : n});
                                    },
                                peg$otherExpectation("Savepoint Identifier"),
                                function(n){
                                        return({"type" : "identifier" ,"variant" : "savepoint" ,"name" : n});
                                    },
                                peg$otherExpectation("Index Identifier"),
                                function(d,n){
                                        return({"type" : "identifier" ,"variant" : "index" ,"name" : foldStringWord([d,n])});
                                    },
                                peg$otherExpectation("Trigger Identifier"),
                                function(d,n){
                                        return({"type" : "identifier" ,"variant" : "trigger" ,"name" : foldStringWord([d,n])});
                                    },
                                peg$otherExpectation("View Identifier"),
                                function(d,n){
                                        return({"type" : "identifier" ,"variant" : "view" ,"name" : foldStringWord([d,n])});
                                    },
                                peg$otherExpectation("Pragma Identifier"),
                                function(d,n){
                                        return({"type" : "identifier" ,"variant" : "pragma" ,"name" : foldStringWord([d,n])});
                                    },
                                peg$otherExpectation("CTE Identifier"),
                                function(d){
                                        return d;
                                    },
                                function(n,a){
                                        return(Object.assign({"type" : "identifier" ,"variant" : "expression" ,"format" : "table" ,"name" : n["name"] ,"columns" : []},a));
                                    },
                                peg$otherExpectation("Table Constraint Identifier"),
                                function(n){
                                        return({"type" : "identifier" ,"variant" : "constraint" ,"format" : "table" ,"name" : n});
                                    },
                                peg$otherExpectation("Column Constraint Identifier"),
                                function(n){
                                        return({"type" : "identifier" ,"variant" : "constraint" ,"format" : "column" ,"name" : n});
                                    },
                                peg$otherExpectation("Datatype Name"),
                                function(t){
                                        return([t,"text"]);
                                    },
                                function(t){
                                        return([t,"real"]);
                                    },
                                function(t){
                                        return([t,"numeric"]);
                                    },
                                function(t){
                                        return([t,"integer"]);
                                    },
                                function(t){
                                        return([t,"none"]);
                                    },
                                peg$otherExpectation("TEXT Datatype Name"),
                                "n",
                                peg$literalExpectation("N",true),
                                "var",
                                peg$literalExpectation("VAR",true),
                                "char",
                                peg$literalExpectation("CHAR",true),
                                "tiny",
                                peg$literalExpectation("TINY",true),
                                "medium",
                                peg$literalExpectation("MEDIUM",true),
                                "long",
                                peg$literalExpectation("LONG",true),
                                "text",
                                peg$literalExpectation("TEXT",true),
                                "clob",
                                peg$literalExpectation("CLOB",true),
                                peg$otherExpectation("REAL Datatype Name"),
                                "float",
                                peg$literalExpectation("FLOAT",true),
                                "real",
                                peg$literalExpectation("REAL",true),
                                peg$otherExpectation("DOUBLE Datatype Name"),
                                "double",
                                peg$literalExpectation("DOUBLE",true),
                                "precision",
                                peg$literalExpectation("PRECISION",true),
                                function(d,p){
                                        return(foldStringWord([d,p]));
                                    },
                                peg$otherExpectation("NUMERIC Datatype Name"),
                                "numeric",
                                peg$literalExpectation("NUMERIC",true),
                                "decimal",
                                peg$literalExpectation("DECIMAL",true),
                                "boolean",
                                peg$literalExpectation("BOOLEAN",true),
                                "date",
                                peg$literalExpectation("DATE",true),
                                "time",
                                peg$literalExpectation("TIME",true),
                                "stamp",
                                peg$literalExpectation("STAMP",true),
                                "string",
                                peg$literalExpectation("STRING",true),
                                peg$otherExpectation("INTEGER Datatype Name"),
                                "int",
                                peg$literalExpectation("INT",true),
                                "2",
                                peg$literalExpectation("2",false),
                                "4",
                                peg$literalExpectation("4",false),
                                "8",
                                peg$literalExpectation("8",false),
                                "eger",
                                peg$literalExpectation("EGER",true),
                                "big",
                                peg$literalExpectation("BIG",true),
                                "small",
                                peg$literalExpectation("SMALL",true),
                                "floating",
                                peg$literalExpectation("FLOATING",true),
                                "point",
                                peg$literalExpectation("POINT",true),
                                function(f,p){
                                        return(foldStringWord([f,p]));
                                    },
                                peg$otherExpectation("BLOB Datatype Name"),
                                "blob",
                                peg$literalExpectation("BLOB",true),
                                /^[a-z0-9$_]/i,
                                peg$classExpectation([["a","z"],["0","9"],"$","_"],false,true),
                                "\\u",
                                peg$literalExpectation("\\u",false),
                                /^[a-f0-9]/i,
                                peg$classExpectation([["a","f"],["0","9"]],false,true),
                                function(u,s){
                                        return(foldStringWord([u,s]).toLowerCase());
                                    },
                                function(n){
                                        return(keyNode(n));
                                    },
                                peg$anyExpectation(),
                                function(n){
                                        return(textNode(n));
                                    },
                                /^[ \t]/,
                                peg$classExpectation([" ","\t"],false,false),
                                '"',
                                peg$literalExpectation('"',false),
                                '""',
                                peg$literalExpectation('""',false),
                                /^[^"]/,
                                peg$classExpectation(['"'],true,false),
                                function(n){
                                        return(unescape(n,'"'));
                                    },
                                "'",
                                peg$literalExpectation("'",false),
                                function(n){
                                        return(unescape(n,"'"));
                                    },
                                "`",
                                peg$literalExpectation("`",false),
                                "``",
                                peg$literalExpectation("``",false),
                                /^[^`]/,
                                peg$classExpectation(["`"],true,false),
                                function(n){
                                        return(unescape(n,"`"));
                                    },
                                peg$otherExpectation("Open Bracket"),
                                "[",
                                peg$literalExpectation("[",false),
                                peg$otherExpectation("Close Bracket"),
                                "]",
                                peg$literalExpectation("]",false),
                                peg$otherExpectation("Open Parenthesis"),
                                "(",
                                peg$literalExpectation("(",false),
                                peg$otherExpectation("Close Parenthesis"),
                                ")",
                                peg$literalExpectation(")",false),
                                peg$otherExpectation("Comma"),
                                ",",
                                peg$literalExpectation(",",false),
                                peg$otherExpectation("Period"),
                                ".",
                                peg$literalExpectation(".",false),
                                peg$otherExpectation("Asterisk"),
                                "*",
                                peg$literalExpectation("*",false),
                                peg$otherExpectation("Question Mark"),
                                "?",
                                peg$literalExpectation("?",false),
                                peg$otherExpectation("Single Quote"),
                                peg$otherExpectation("Double Quote"),
                                peg$otherExpectation("Backtick"),
                                peg$otherExpectation("Tilde"),
                                "~",
                                peg$literalExpectation("~",false),
                                peg$otherExpectation("Plus"),
                                "+",
                                peg$literalExpectation("+",false),
                                peg$otherExpectation("Minus"),
                                "-",
                                peg$literalExpectation("-",false),
                                "=",
                                peg$literalExpectation("=",false),
                                peg$otherExpectation("Ampersand"),
                                "&",
                                peg$literalExpectation("&",false),
                                peg$otherExpectation("Pipe"),
                                "|",
                                peg$literalExpectation("|",false),
                                "%",
                                peg$literalExpectation("%",false),
                                "<",
                                peg$literalExpectation("<",false),
                                ">",
                                peg$literalExpectation(">",false),
                                peg$otherExpectation("Exclamation"),
                                "!",
                                peg$literalExpectation("!",false),
                                peg$otherExpectation("Semicolon"),
                                ";",
                                peg$literalExpectation(";",false),
                                peg$otherExpectation("Colon"),
                                peg$otherExpectation("Forward Slash"),
                                "/",
                                peg$literalExpectation("/",false),
                                peg$otherExpectation("Backslash"),
                                "\\",
                                peg$literalExpectation("\\",false),
                                "abort",
                                peg$literalExpectation("ABORT",true),
                                "action",
                                peg$literalExpectation("ACTION",true),
                                "add",
                                peg$literalExpectation("ADD",true),
                                "after",
                                peg$literalExpectation("AFTER",true),
                                "all",
                                peg$literalExpectation("ALL",true),
                                "alter",
                                peg$literalExpectation("ALTER",true),
                                "analyze",
                                peg$literalExpectation("ANALYZE",true),
                                "and",
                                peg$literalExpectation("AND",true),
                                "as",
                                peg$literalExpectation("AS",true),
                                "asc",
                                peg$literalExpectation("ASC",true),
                                "attach",
                                peg$literalExpectation("ATTACH",true),
                                "autoincrement",
                                peg$literalExpectation("AUTOINCREMENT",true),
                                "before",
                                peg$literalExpectation("BEFORE",true),
                                "begin",
                                peg$literalExpectation("BEGIN",true),
                                "between",
                                peg$literalExpectation("BETWEEN",true),
                                "by",
                                peg$literalExpectation("BY",true),
                                "cascade",
                                peg$literalExpectation("CASCADE",true),
                                "case",
                                peg$literalExpectation("CASE",true),
                                "cast",
                                peg$literalExpectation("CAST",true),
                                "check",
                                peg$literalExpectation("CHECK",true),
                                "collate",
                                peg$literalExpectation("COLLATE",true),
                                "column",
                                peg$literalExpectation("COLUMN",true),
                                "commit",
                                peg$literalExpectation("COMMIT",true),
                                "conflict",
                                peg$literalExpectation("CONFLICT",true),
                                "constraint",
                                peg$literalExpectation("CONSTRAINT",true),
                                "create",
                                peg$literalExpectation("CREATE",true),
                                "cross",
                                peg$literalExpectation("CROSS",true),
                                "current_date",
                                peg$literalExpectation("CURRENT_DATE",true),
                                "current_time",
                                peg$literalExpectation("CURRENT_TIME",true),
                                "current_timestamp",
                                peg$literalExpectation("CURRENT_TIMESTAMP",true),
                                "database",
                                peg$literalExpectation("DATABASE",true),
                                "default",
                                peg$literalExpectation("DEFAULT",true),
                                "deferrable",
                                peg$literalExpectation("DEFERRABLE",true),
                                "deferred",
                                peg$literalExpectation("DEFERRED",true),
                                "delete",
                                peg$literalExpectation("DELETE",true),
                                "desc",
                                peg$literalExpectation("DESC",true),
                                "detach",
                                peg$literalExpectation("DETACH",true),
                                "distinct",
                                peg$literalExpectation("DISTINCT",true),
                                "drop",
                                peg$literalExpectation("DROP",true),
                                "each",
                                peg$literalExpectation("EACH",true),
                                "else",
                                peg$literalExpectation("ELSE",true),
                                "end",
                                peg$literalExpectation("END",true),
                                "escape",
                                peg$literalExpectation("ESCAPE",true),
                                "except",
                                peg$literalExpectation("EXCEPT",true),
                                "exclusive",
                                peg$literalExpectation("EXCLUSIVE",true),
                                "exists",
                                peg$literalExpectation("EXISTS",true),
                                "explain",
                                peg$literalExpectation("EXPLAIN",true),
                                "fail",
                                peg$literalExpectation("FAIL",true),
                                "for",
                                peg$literalExpectation("FOR",true),
                                "foreign",
                                peg$literalExpectation("FOREIGN",true),
                                "from",
                                peg$literalExpectation("FROM",true),
                                "full",
                                peg$literalExpectation("FULL",true),
                                "glob",
                                peg$literalExpectation("GLOB",true),
                                "group",
                                peg$literalExpectation("GROUP",true),
                                "having",
                                peg$literalExpectation("HAVING",true),
                                "if",
                                peg$literalExpectation("IF",true),
                                "ignore",
                                peg$literalExpectation("IGNORE",true),
                                "immediate",
                                peg$literalExpectation("IMMEDIATE",true),
                                "in",
                                peg$literalExpectation("IN",true),
                                "index",
                                peg$literalExpectation("INDEX",true),
                                "indexed",
                                peg$literalExpectation("INDEXED",true),
                                "initially",
                                peg$literalExpectation("INITIALLY",true),
                                "inner",
                                peg$literalExpectation("INNER",true),
                                "insert",
                                peg$literalExpectation("INSERT",true),
                                "instead",
                                peg$literalExpectation("INSTEAD",true),
                                "intersect",
                                peg$literalExpectation("INTERSECT",true),
                                "into",
                                peg$literalExpectation("INTO",true),
                                "is",
                                peg$literalExpectation("IS",true),
                                "isnull",
                                peg$literalExpectation("ISNULL",true),
                                "join",
                                peg$literalExpectation("JOIN",true),
                                "key",
                                peg$literalExpectation("KEY",true),
                                "left",
                                peg$literalExpectation("LEFT",true),
                                "like",
                                peg$literalExpectation("LIKE",true),
                                "limit",
                                peg$literalExpectation("LIMIT",true),
                                "match",
                                peg$literalExpectation("MATCH",true),
                                "natural",
                                peg$literalExpectation("NATURAL",true),
                                "no",
                                peg$literalExpectation("NO",true),
                                "not",
                                peg$literalExpectation("NOT",true),
                                "notnull",
                                peg$literalExpectation("NOTNULL",true),
                                "of",
                                peg$literalExpectation("OF",true),
                                "offset",
                                peg$literalExpectation("OFFSET",true),
                                "on",
                                peg$literalExpectation("ON",true),
                                "or",
                                peg$literalExpectation("OR",true),
                                "order",
                                peg$literalExpectation("ORDER",true),
                                "outer",
                                peg$literalExpectation("OUTER",true),
                                "plan",
                                peg$literalExpectation("PLAN",true),
                                "pragma",
                                peg$literalExpectation("PRAGMA",true),
                                "primary",
                                peg$literalExpectation("PRIMARY",true),
                                "query",
                                peg$literalExpectation("QUERY",true),
                                "raise",
                                peg$literalExpectation("RAISE",true),
                                "recursive",
                                peg$literalExpectation("RECURSIVE",true),
                                "references",
                                peg$literalExpectation("REFERENCES",true),
                                "regexp",
                                peg$literalExpectation("REGEXP",true),
                                "reindex",
                                peg$literalExpectation("REINDEX",true),
                                "release",
                                peg$literalExpectation("RELEASE",true),
                                "rename",
                                peg$literalExpectation("RENAME",true),
                                "replace",
                                peg$literalExpectation("REPLACE",true),
                                "restrict",
                                peg$literalExpectation("RESTRICT",true),
                                "right",
                                peg$literalExpectation("RIGHT",true),
                                "rollback",
                                peg$literalExpectation("ROLLBACK",true),
                                "row",
                                peg$literalExpectation("ROW",true),
                                "rowid",
                                peg$literalExpectation("ROWID",true),
                                "savepoint",
                                peg$literalExpectation("SAVEPOINT",true),
                                "select",
                                peg$literalExpectation("SELECT",true),
                                "set",
                                peg$literalExpectation("SET",true),
                                "table",
                                peg$literalExpectation("TABLE",true),
                                "temp",
                                peg$literalExpectation("TEMP",true),
                                "temporary",
                                peg$literalExpectation("TEMPORARY",true),
                                "then",
                                peg$literalExpectation("THEN",true),
                                "to",
                                peg$literalExpectation("TO",true),
                                "transaction",
                                peg$literalExpectation("TRANSACTION",true),
                                "trigger",
                                peg$literalExpectation("TRIGGER",true),
                                "union",
                                peg$literalExpectation("UNION",true),
                                "unique",
                                peg$literalExpectation("UNIQUE",true),
                                "update",
                                peg$literalExpectation("UPDATE",true),
                                "using",
                                peg$literalExpectation("USING",true),
                                "vacuum",
                                peg$literalExpectation("VACUUM",true),
                                "values",
                                peg$literalExpectation("VALUES",true),
                                "view",
                                peg$literalExpectation("VIEW",true),
                                "virtual",
                                peg$literalExpectation("VIRTUAL",true),
                                "when",
                                peg$literalExpectation("WHEN",true),
                                "where",
                                peg$literalExpectation("WHERE",true),
                                "with",
                                peg$literalExpectation("WITH",true),
                                "without",
                                peg$literalExpectation("WITHOUT",true),
                                function(r){
                                        return(keyNode(r));
                                    },
                                function(){
                                        return null;
                                    },
                                peg$otherExpectation("Line Comment"),
                                "--",
                                peg$literalExpectation("--",false),
                                /^[\n\v\f\r]/,
                                peg$classExpectation(["\n","\v","\f","\r"],false,false),
                                peg$otherExpectation("Block Comment"),
                                "/*",
                                peg$literalExpectation("/*",false),
                                "*/",
                                peg$literalExpectation("*/",false),
                                /^[\n\v\f\r\t ]/,
                                peg$classExpectation([
                                        "\n",
                                        "\v",
                                        "\f",
                                        "\r",
                                        "\t",
                                        " "
                                    ],false,false),
                                peg$otherExpectation("Whitespace"),
                                "__TODO__",
                                peg$literalExpectation("__TODO__",false)
                            ];
                            var peg$bytecode = [
                                peg$decode("%;\u023f/H#;#/?$;\".\" &\"/1$;#/($8$: $!!)($'#(#'#(\"'#&'#"),
                                peg$decode("%;\u023f/C#;#/:$;x/1$;#/($8$: $!!)($'#(#'#(\"'#&'#"),
                                peg$decode("%;x/B#;\u023f/9$$;%0#*;%&/)$8#:!#\"\" )(#'#(\"'#&'#"),
                                peg$decode("$;\u01b30#*;\u01b3&"),
                                peg$decode("$;\u01b3/&#0#*;\u01b3&&&#"),
                                peg$decode("%;$/:#;x/1$;\u023f/($8#:\"#!!)(#'#(\"'#&'#"),
                                peg$decode('<%;\'.# &;(/@#;\u023f/7$;*." &"/)$8#:$#"" )(#\'#("\'#&\'#=." 7#'),
                                peg$decode("%;\u018b/' 8!:%!! )"),
                                peg$decode('<%;\u0195/9#$;)0#*;)&/)$8":\'""! )("\'#&\'#=." 7&'),
                                peg$decode('%4(""5!7)/1#;\u0197/($8":*"! )("\'#&\'#'),
                                peg$decode("<%;\u01a0/R#;5/I$;\u023f/@$;+.\" &\"/2$;\u01a1/)$8%:,%\"#!)(%'#($'#(#'#(\"'#&'#=.\" 7+"),
                                peg$decode("%;\u01a2/C#;\u023f/:$;5/1$;\u023f/($8$:-$!!)($'#(#'#(\"'#&'#"),
                                peg$decode(";5.; &;6.5 &;2./ &;-.) &;..# &;/"),
                                peg$decode('<%;\u0206/1#;\u023f/($8":/"!!)("\'#&\'#=." 7.'),
                                peg$decode('<%;\u01d2.) &;\u01d4.# &;\u01d3/1#;\u023f/($8":1"!!)("\'#&\'#=." 70'),
                                peg$decode('<%;4." &"/2#;0/)$8":3""! )("\'#&\'#=." 72'),
                                peg$decode("<%;\u01a6/A#$;10#*;1&/1$;\u01a6/($8#:5#!!)(#'#(\"'#&'#=.\" 74"),
                                peg$decode('26""6677.) &48""5!79'),
                                peg$decode('<%4;""5!7</1#;0/($8":="! )("\'#&\'#=." 7:'),
                                peg$decode("%;\u0197.# &;\u019b/' 8!:>!! )"),
                                peg$decode('<%;\u01aa.# &;\u01ab/\' 8!:"!! )=." 7?'),
                                peg$decode('%;4." &"/2#;6/)$8":@""! )("\'#&\'#'),
                                peg$decode(";<.# &;7"),
                                peg$decode('%;8/7#;;." &"/)$8":A""! )("\'#&\'#'),
                                peg$decode('<;9.# &;:=." 7B'),
                                peg$decode('%$;>/&#0#*;>&&&#/7#;:." &"/)$8":C""! )("\'#&\'#'),
                                peg$decode('%;\u01a3/9#$;>0#*;>&/)$8":D""! )("\'#&\'#'),
                                peg$decode('<%3F""5!7G/T#4H""5!7I." &"/@$$;>/&#0#*;>&&&#/*$8#:J##"! )(#\'#("\'#&\'#=." 7E'),
                                peg$decode('<%3L""5"7M/?#$;=/&#0#*;=&&&#/)$8":N""! )("\'#&\'#=." 7K'),
                                peg$decode('4O""5!7P'),
                                peg$decode('4Q""5!7R'),
                                peg$decode("<%;@.) &;B.# &;C/' 8!:T!! )=.\" 7S"),
                                peg$decode('<%;\u01a5/@#;A." &"/2$;\u023f/)$8#:V#""!)(#\'#("\'#&\'#=." 7U'),
                                peg$decode('%4W""5!7X/9#$;>0#*;>&/)$8":Y""! )("\'#&\'#'),
                                peg$decode('<%4[""5!7\\/H#$;\u0193/&#0#*;\u0193&&&#/2$;\u023f/)$8#:]#""!)(#\'#("\'#&\'#=." 7Z'),
                                peg$decode('<%2_""6_7`/o#$;\u0193.) &2a""6a7b/2#0/*;\u0193.) &2a""6a7b&&&#/A$;\u023f/8$;D." &"/*$8$:c$##" )($\'#(#\'#("\'#&\'#=." 7^'),
                                peg$decode('%;\u019b/1#;\u023f/($8":d"!!)("\'#&\'#'),
                                peg$decode('<%;F." &"/;#;\u023f/2$;\u0094/)$8#:f#"" )(#\'#("\'#&\'#=." 7e'),
                                peg$decode('<%;k." &"/;#;\u01e4/2$;\u023f/)$8#:h#""!)(#\'#("\'#&\'#=." 7g'),
                                peg$decode("<%;\u0211/_#;\u023f/V$;\u01a0/M$;\u023f/D$;H/;$;\u023f/2$;\u01a1/)$8':j'\"&\")(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7i"),
                                peg$decode("<%;I.# &;J/' 8!:l!! )=.\" 7k"),
                                peg$decode("<%;\u01ef/' 8!:n!! )=.\" 7m"),
                                peg$decode("%;\u021b.) &;\u01b7.# &;\u01e6/M#;\u023f/D$;\u01a2/;$;\u023f/2$;w/)$8%:o%\"$ )(%'#($'#(#'#(\"'#&'#"),
                                peg$decode(";?./ &;t.) &;,.# &;\u017d"),
                                peg$decode("%;\u01a0/L#;\u023f/C$;p/:$;\u023f/1$;\u01a1/($8%:p%!\")(%'#($'#(#'#(\"'#&'#"),
                                peg$decode(";L.; &;E.5 &;_./ &;a.) &;G.# &;K"),
                                peg$decode("%;M/;#;\u023f/2$;Q/)$8#:q#\"\" )(#'#(\"'#&'#.# &;M"),
                                peg$decode("%;P/A#;\u023f/8$;N.# &;p/)$8#:r#\"\" )(#'#(\"'#&'#.# &;N"),
                                peg$decode(";\u01a9.U &;\u01ab.O &;\u01aa.I &%%;k/8#%<;\u01e4=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
                                peg$decode("<%;\u012d/' 8!:t!! )=.\" 7s"),
                                peg$decode("%;O/\u0083#$%;\u023f/>#;\u0166/5$;\u023f/,$;O/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;\u0166/5$;\u023f/,$;O/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"),
                                peg$decode("%;R/\u0083#$%;\u023f/>#;T/5$;\u023f/,$;R/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;T/5$;\u023f/,$;R/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"),
                                peg$decode(";\u0169.) &;\u016a.# &;\u016b"),
                                peg$decode("%;S/\u0083#$%;\u023f/>#;V/5$;\u023f/,$;S/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;V/5$;\u023f/,$;S/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"),
                                peg$decode(";\u0167.# &;\u0168"),
                                peg$decode("%;U/\u0083#$%;\u023f/>#;X/5$;\u023f/,$;U/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;X/5$;\u023f/,$;U/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"),
                                peg$decode(";\u016c.U &;\u016d.O &;\u016e.I &%%;\u016f/8#%<;\u016f=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
                                peg$decode("%;W/\u0083#$%;\u023f/>#;Z/5$;\u023f/,$;W/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;Z/5$;\u023f/,$;W/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"),
                                peg$decode(";\u0172.{ &;\u0173.u &%%;\u0170/8#%<;X=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).I &%%;\u0171/8#%<;X=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
                                peg$decode('%;Y/9#$;\\0#*;\\&/)$8":u""! )("\'#&\'#'),
                                peg$decode("%;\u023f/1#;]/($8\":v\"! )(\"'#&'#.H &%;\u023f/>#;^/5$;\u023f/,$;Y/#$+$)($'#(#'#(\"'#&'#"),
                                peg$decode('%3w""5$7x/?#;\u023f/6$3y""5$7z/\'$8#:{# )(#\'#("\'#&\'#.? &%;\u01fb/& 8!:|! ).. &%;\u0205/& 8!:{! )'),
                                peg$decode(";\u0177./ &;\u0175.) &;\u0176.# &;\u0174"),
                                peg$decode("<%;\u01c9/i#;\u023f/`$;\u01a0/W$;p/N$;\u023f/E$;`/<$;\u023f/3$;\u01a1/*$8(:~(#'$\")(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7}"),
                                peg$decode("<%;\u01bf/:#;\u023f/1$;&/($8#:\u0080#! )(#'#(\"'#&'#=.\" 7\u007f"),
                                peg$decode("<%;\u01c8/\u0093#;\u023f/\u008a$;b.\" &\"/|$;\u023f/s$$;c/&#0#*;c&&&#/]$;\u023f/T$;d.\" &\"/F$;\u023f/=$;\u01e0/4$;\u023f/+$8*:\u0082*$)'%#)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0081"),
                                peg$decode("%%<;\u0230=.##&&!&'#/1#;p/($8\":\u0083\"! )(\"'#&'#"),
                                peg$decode("<%;\u0230/i#;\u023f/`$;p/W$;\u023f/N$;\u0224/E$;\u023f/<$;p/3$;\u023f/*$8(:\u0085(#'%!)(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0084"),
                                peg$decode("<%;\u01df/D#;\u023f/;$;p/2$;\u023f/)$8$:\u0087$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0086"),
                                peg$decode("%;[/;#;\u023f/2$;f/)$8#:\u0088#\"\" )(#'#(\"'#&'#.# &;["),
                                peg$decode(";l.) &;i.# &;g"),
                                peg$decode('<%;k." &"/o#;\u01ff./ &;\u01eb.) &;\u0214.# &;\u0201/T$;\u023f/K$;p/B$;\u023f/9$;h." &"/+$8&:\u008a&$%$" )(&\'#(%\'#($\'#(#\'#("\'#&\'#=." 7\u0089'),
                                peg$decode("<%;\u01e1/D#;\u023f/;$;p/2$;\u023f/)$8$:\u008c$\"#!)($'#(#'#(\"'#&'#=.\" 7\u008b"),
                                peg$decode('<%;k." &"/E#;\u01c5/<$;\u023f/3$;j/*$8$:\u008e$##" )($\'#(#\'#("\'#&\'#=." 7\u008d'),
                                peg$decode("%;e/W#%;\u023f/>#;\u01be/5$;\u023f/,$;e/#$+$)($'#(#'#(\"'#&'#/)$8\":\u008f\"\"! )(\"'#&'#"),
                                peg$decode('%;\u0204/1#;\u023f/($8":\u0090"!!)("\'#&\'#'),
                                peg$decode('<%;k." &"/E#;\u01f1/<$;\u023f/3$;m/*$8$:\u0092$##" )($\'#(#\'#("\'#&\'#=." 7\u0091'),
                                peg$decode(";n.# &;\u017b"),
                                peg$decode("%;\u01a0/I#;\u0095.# &;q/:$;\u023f/1$;\u01a1/($8$:\u0093$!\")($'#(#'#(\"'#&'#"),
                                peg$decode("%;e/\u0083#$%;\u023f/>#;\u01be/5$;\u023f/,$;e/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;\u01be/5$;\u023f/,$;e/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"),
                                peg$decode("%;o/\u0083#$%;\u023f/>#;\u020a/5$;\u023f/,$;o/#$+$)($'#(#'#(\"'#&'#0H*%;\u023f/>#;\u020a/5$;\u023f/,$;o/#$+$)($'#(#'#(\"'#&'#&/)$8\":u\"\"! )(\"'#&'#"),
                                peg$decode('<%;r." &"/1#;\u023f/($8":\u0095"!!)("\'#&\'#=." 7\u0094'),
                                peg$decode("%;p/B#;\u023f/9$$;s0#*;s&/)$8#:\u0096#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u01a2/:#;p/1$;\u023f/($8#:\u0093#!!)(#'#(\"'#&'#"),
                                peg$decode("<%;\u017a/[#;\u023f/R$;\u01a0/I$;u.\" &\"/;$;\u023f/2$;\u01a1/)$8&:\u0098&\"%\")(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0097"),
                                peg$decode('<%;\u00db/\' 8!:\u009a!! ).V &%;v." &"/G#;q/>$9:\u009b "! -""&!&#/)$8#:\u009c#""!)(#\'#("\'#&\'#=." 7\u0099'),
                                peg$decode('%;\u01dc.# &;\u01bb/1#;\u023f/($8":\u009d"!!)("\'#&\'#'),
                                peg$decode("<%;//' 8!:\u009f!! )=.\" 7\u009e"),
                                peg$decode('<%;y." &"/;#;{/2$;\u023f/)$8#:\u00a1#""!)(#\'#("\'#&\'#=." 7\u00a0'),
                                peg$decode('<%;\u01e5/@#;\u023f/7$;z." &"/)$8#:\u00a3#"" )(#\'#("\'#&\'#=." 7\u00a2'),
                                peg$decode("<%;\u0210/D#;\u023f/;$;\u020d/2$;\u023f/)$8$:\u00a5$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00a4"),
                                peg$decode(";\u008c.S &;\u00fb.M &;\u0162.G &;}.A &;|.; &;\u0086.5 &;\u0080./ &;\u0084.) &;\u0085.# &;\u0096"),
                                peg$decode('<%;\u01cd.# &;\u01e0/@#;\u023f/7$;~." &"/)$8#:\u00a7#"" )(#\'#("\'#&\'#=." 7\u00a6'),
                                peg$decode('<%;\u01c4/^#;\u023f/U$;\u007f." &"/G$;~." &"/9$;\u0082." &"/+$8%:\u00a9%$$"! )(%\'#($\'#(#\'#("\'#&\'#=." 7\u00a8'),
                                peg$decode('%;\u0226/1#;\u023f/($8":\u00aa"!!)("\'#&\'#'),
                                peg$decode('%;\u01d8.) &;\u01f0.# &;\u01e3/1#;\u023f/($8":\u00ab"!!)("\'#&\'#'),
                                peg$decode('<%;\u021b/N#;\u023f/E$;~." &"/7$;\u0081." &"/)$8$:\u00ad$"# )($\'#(#\'#("\'#&\'#=." 7\u00ac'),
                                peg$decode('<%%;\u0225/,#;\u023f/#$+")("\'#&\'#." &"/?#;\u0083." &"/1$;\u0082/($8#:p#! )(#\'#("\'#&\'#=." 7\u00ae'),
                                peg$decode('%;\u0182/1#;\u023f/($8":\u00af"!!)("\'#&\'#'),
                                peg$decode('%;\u021e/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'),
                                peg$decode('<%;\u0083/2#;\u0082/)$8":\u00b2""! )("\'#&\'#=." 7\u00b1'),
                                peg$decode("<%;\u0216/J#;\u023f/A$;\u0083.\" &\"/3$;\u0082/*$8$:\u00b4$##! )($'#(#'#(\"'#&'#=.\" 7\u00b3"),
                                peg$decode("<%;\u0087/N#;\u017b/E$;\u023f/<$;\u0088/3$;\u023f/*$8%:\u00b6%#$#!)(%'#($'#(#'#(\"'#&'#=.\" 7\u00b5"),
                                peg$decode("<%;\u01bc/D#;\u023f/;$;\u0221/2$;\u023f/)$8$:\u00b8$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00b7"),
                                peg$decode(";\u0089.# &;\u008a"),
                                peg$decode("<%;\u0217/M#;\u023f/D$;\u0225/;$;\u023f/2$;\u017b/)$8%:\u00ba%\"$ )(%'#($'#(#'#(\"'#&'#=.\" 7\u00b9"),
                                peg$decode('<%;\u01b9/I#;\u023f/@$;\u008b." &"/2$;\u010c/)$8$:\u00bc$"# )($\'#(#\'#("\'#&\'#=." 7\u00bb'),
                                peg$decode('%;\u01cc/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'),
                                peg$decode('%;\u008d/2#;\u00a7/)$8":\u00bd""! )("\'#&\'#'),
                                peg$decode('<%;\u008e." &"/1#;\u023f/($8":*"!!)("\'#&\'#=." 7\u00be'),
                                peg$decode("%;\u0232/J#;\u023f/A$;\u008f.\" &\"/3$;\u0090/*$8$:\u00bf$##! )($'#(#'#(\"'#&'#"),
                                peg$decode('%;\u0212/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'),
                                peg$decode("%;\u0092/B#;\u023f/9$$;\u00910#*;\u0091&/)$8#:\u00c0#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u01a2/:#;\u0092/1$;\u023f/($8#:\u0093#!!)(#'#(\"'#&'#"),
                                peg$decode('<%;\u0187/2#;\u0093/)$8":\u00c2""! )("\'#&\'#=." 7\u00c1'),
                                peg$decode("%;\u01bf/:#;\u023f/1$;\u0094/($8#:\u00c3#! )(#'#(\"'#&'#"),
                                peg$decode("%;\u01a0/C#;\u0095/:$;\u023f/1$;\u01a1/($8$: $!\")($'#(#'#(\"'#&'#"),
                                peg$decode('%;\u008d/2#;\u00a8/)$8":\u00c4""! )("\'#&\'#'),
                                peg$decode(";\u0097.; &;\u0099.5 &;\u009a./ &;\u009c.) &;\u009e.# &;\u00a0"),
                                peg$decode("<%;\u01c1/\u008b#;\u023f/\u0082$%;\u01d5/,#;\u023f/#$+\")(\"'#&'#.\" &\"/a$;p/X$;\u023f/O$;\u01bf/F$;\u023f/=$;\u0098/4$;\u023f/+$8):\u00c6)$(&%!)()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u00c5"),
                                peg$decode(";\u0179.) &;-.# &;?"),
                                peg$decode("<%;\u01db/f#;\u023f/]$%;\u01d5/,#;\u023f/#$+\")(\"'#&'#.\" &\"/<$;\u0098/3$;\u023f/*$8%:\u00c8%#$\"!)(%'#($'#(#'#(\"'#&'#=.\" 7\u00c7"),
                                peg$decode('<%;\u022c/@#;\u023f/7$;\u009b." &"/)$8#:\u00ca#"" )(#\'#("\'#&\'#=." 7\u00c9'),
                                peg$decode('%;\u0179/1#;\u023f/($8":\u00cb"!!)("\'#&\'#'),
                                peg$decode('<%;\u01bd/@#;\u023f/7$;\u009d." &"/)$8#:\u00cd#"" )(#\'#("\'#&\'#=." 7\u00cc'),
                                peg$decode('%;\u017b.) &;\u0183.# &;\u0179/1#;\u023f/($8":\u00ce"!!)("\'#&\'#'),
                                peg$decode('<%;\u0215/I#;\u023f/@$;\u009f." &"/2$;\u023f/)$8$:\u00cd$"#!)($\'#(#\'#("\'#&\'#=." 7\u00cf'),
                                peg$decode('%;\u017b.) &;\u0183.# &;\u0181/1#;\u023f/($8":\u00d0"!!)("\'#&\'#'),
                                peg$decode("<%;\u020e/S#;\u023f/J$;\u0186/A$;\u023f/8$;\u00a1.\" &\"/*$8%:\u00d2%#$\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u00d1"),
                                peg$decode("%;\u01a0/C#;\u00a2/:$;\u023f/1$;\u01a1/($8$:\u00d3$!\")($'#(#'#(\"'#&'#.D &%;\u01ac/:#;\u00a2/1$;\u023f/($8#:\u00d3#!!)(#'#(\"'#&'#"),
                                peg$decode(";\u00a4.) &;\u00a3.# &;\u00a6"),
                                peg$decode(";5.) &;/.# &;3"),
                                peg$decode('%;\u00a5/<#9:\u00d4 ! -""&!&#/($8":\u00d5"!!)("\'#&\'#'),
                                peg$decode("%$;\u0193/&#0#*;\u0193&&&#/' 8!:\u00d6!! )"),
                                peg$decode("%;\u00a5/' 8!:\u00d7!! )"),
                                peg$decode(";\u00a8./ &;\u00dd.) &;\u00f2.# &;\u00f9"),
                                peg$decode('<%;\u00ae/X#;\u023f/O$;\u00a9." &"/A$;\u023f/8$;\u00aa." &"/*$8%:\u00d9%#$" )(%\'#($\'#(#\'#("\'#&\'#=." 7\u00d8'),
                                peg$decode("<%;\u020b/L#;\u023f/C$;\u01c6/:$;\u023f/1$;\u00d8/($8%:\u00db%! )(%'#($'#(#'#(\"'#&'#=.\" 7\u00da"),
                                peg$decode("<%;\u0200/S#;\u023f/J$;p/A$;\u023f/8$;\u00ab.\" &\"/*$8%:\u00dd%#$\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u00dc"),
                                peg$decode('<%;\u00ac/2#;p/)$8":\u00df""! )("\'#&\'#=." 7\u00de'),
                                peg$decode(";\u00ad.# &;\u01a2"),
                                peg$decode('%;\u0208/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'),
                                peg$decode("%;\u00b0/B#;\u023f/9$$;\u00af0#*;\u00af&/)$8#:\u00e0#\"\" )(#'#(\"'#&'#"),
                                peg$decode("<%;\u00ef/D#;\u023f/;$;\u00b0/2$;\u023f/)$8$:\u00e2$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00e1"),
                                peg$decode(";\u00b1.# &;\u00d7"),
                                peg$decode('%;\u00b2/U#;\u00b8." &"/G$;\u00b9." &"/9$;\u00ba." &"/+$8$:\u00e3$$#"! )($\'#(#\'#("\'#&\'#'),
                                peg$decode('<%;\u021f/R#;\u023f/I$;\u00b3." &"/;$;\u023f/2$;\u00b6/)$8%:\u00e5%"" )(%\'#($\'#(#\'#("\'#&\'#=." 7\u00e4'),
                                peg$decode('<;\u00b4.# &;\u00b5=." 7\u00e6'),
                                peg$decode('%;\u01dc/1#;\u023f/($8":\u00e7"!!)("\'#&\'#'),
                                peg$decode('%;\u01bb/1#;\u023f/($8":\u00e8"!!)("\'#&\'#'),
                                peg$decode("%;\u00bc/B#;\u023f/9$$;\u00b70#*;\u00b7&/)$8#:\u00c0#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u01a2/:#;\u00bc/1$;\u023f/($8#:-#!!)(#'#(\"'#&'#"),
                                peg$decode("<%;\u01e9/D#;\u023f/;$;\u00c0/2$;\u023f/)$8$:\u00ea$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00e9"),
                                peg$decode("<%;\u0231/D#;\u023f/;$;p/2$;\u023f/)$8$:\u00ec$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00eb"),
                                peg$decode("<%;\u01ec/e#;\u023f/\\$;\u01c6/S$;\u023f/J$;q/A$;\u023f/8$;\u00bb.\" &\"/*$8':\u00ee'#&\" )(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u00ed"),
                                peg$decode("<%;\u01ed/D#;\u023f/;$;p/2$;\u023f/)$8$:\u00f0$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00ef"),
                                peg$decode(";\u00bd.# &;\u00bf"),
                                peg$decode('%;\u00be." &"/2#;\u00db/)$8":\u00f1""! )("\'#&\'#'),
                                peg$decode('%;\u0195/2#;\u01a3/)$8":\u00f2""! )("\'#&\'#'),
                                peg$decode('%;p/@#;\u023f/7$;\u00cd." &"/)$8#:\u00f3#"" )(#\'#("\'#&\'#'),
                                peg$decode("%;\u00c4/B#;\u023f/9$$;\u00c10#*;\u00c1&/)$8#:\u00f4#\"\" )(#'#(\"'#&'#"),
                                peg$decode('%;\u00c2.# &;\u00c3/7#;\u00d4." &"/)$8":\u00f5""! )("\'#&\'#'),
                                peg$decode("<%;\u01a2/:#;\u00c4/1$;\u023f/($8#:\u00f7#!!)(#'#(\"'#&'#=.\" 7\u00f6"),
                                peg$decode("<%;\u00ce/D#;\u023f/;$;\u00c4/2$;\u023f/)$8$:\u00f9$\"#!)($'#(#'#(\"'#&'#=.\" 7\u00f8"),
                                peg$decode(";\u00cb.5 &;?./ &;\u00c5.) &;\u00c6.# &;\u00cc"),
                                peg$decode("%;\u017a/S#;\u023f/J$;\u00ed/A$;\u023f/8$;\u00cd.\" &\"/*$8%:\u00fa%#$\" )(%'#($'#(#'#(\"'#&'#"),
                                peg$decode('<%;\u00c7/@#;\u023f/7$;\u00c8." &"/)$8#:\u00fc#"" )(#\'#("\'#&\'#=." 7\u00fb'),
                                peg$decode('<%;\u017b/@#;\u023f/7$;\u00cd." &"/)$8#:\u00fe#"" )(#\'#("\'#&\'#=." 7\u00fd'),
                                peg$decode('<;\u00c9.# &;\u00ca=." 7\u00ff'),
                                peg$decode("%;\u01f3/V#;\u023f/M$;\u01c6/D$;\u023f/;$;\u0183/2$;\u023f/)$8&:\u0100&\"%!)(&'#(%'#($'#(#'#(\"'#&'#"),
                                peg$decode("%;k/;#;\u01f3/2$;\u023f/)$8#:\u0101#\"\"!)(#'#(\"'#&'#"),
                                peg$decode("<%;\u01a0/R#;\u00c0/I$;\u023f/@$;\u01a1/7$;\u00cd.\" &\"/)$8%:\u0103%\"# )(%'#($'#(#'#(\"'#&'#=.\" 7\u0102"),
                                peg$decode('<%;\u0094/7#;\u00cd." &"/)$8":\u0105""! )("\'#&\'#=." 7\u0104'),
                                peg$decode('<%%;\u01bf/Q#%%<;\u0193.# &;\u0236=.##&&!&\'#/,#;\u023f/#$+")("\'#&\'#/#$+")("\'#&\'#." &"/;#;\u0195/2$;\u023f/)$8#:\u0107#""!)(#\'#("\'#&\'#=." 7\u0106'),
                                peg$decode('<%;\u00cf." &"/J#;\u023f/A$;\u00d0." &"/3$;\u01fc/*$8$:\u0109$##! )($\'#(#\'#("\'#&\'#=." 7\u0108'),
                                peg$decode('%;\u0202/1#;\u023f/($8":\u0090"!!)("\'#&\'#'),
                                peg$decode(";\u00d1.# &;\u00d3"),
                                peg$decode('%;\u01fe.) &;\u021a.# &;\u01ea/@#;\u023f/7$;\u00d2." &"/)$8#:\u010a#"" )(#\'#("\'#&\'#'),
                                peg$decode('%;\u020c/1#;\u023f/($8":\u010b"!!)("\'#&\'#'),
                                peg$decode('%;\u01f5.# &;\u01d1/1#;\u023f/($8":\u010b"!!)("\'#&\'#'),
                                peg$decode('<%;\u00d5.# &;\u00d6/1#;\u023f/($8":\u010d"!!)("\'#&\'#=." 7\u010c'),
                                peg$decode('<%;\u0209/;#;\u023f/2$;p/)$8#:\u010f#"" )(#\'#("\'#&\'#=." 7\u010e'),
                                peg$decode('<%;\u022b/;#;\u023f/2$;\u00e6/)$8#:\u0111#"" )(#\'#("\'#&\'#=." 7\u0110'),
                                peg$decode('<%;\u022d/;#;\u023f/2$;\u00eb/)$8#:\u0113#"" )(#\'#("\'#&\'#=." 7\u0112'),
                                peg$decode("%;\u00da/B#;\u023f/9$$;\u00d90#*;\u00d9&/)$8#:\u0114#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u01a2/:#;\u00da/1$;\u023f/($8#:\u0115#!!)(#'#(\"'#&'#"),
                                peg$decode('<%;p/@#;\u023f/7$;\u012f." &"/)$8#:\u0117#"" )(#\'#("\'#&\'#=." 7\u0116'),
                                peg$decode('<;\u01a4=." 7\u0118'),
                                peg$decode('<;\u0218.5 &;\u021b./ &;\u01b7.) &;\u01e6.# &;\u01ef=." 7\u0119'),
                                peg$decode('<%;\u00de/;#;\u023f/2$;\u00e2/)$8#:\u011b#"" )(#\'#("\'#&\'#=." 7\u011a'),
                                peg$decode(";\u00df.# &;\u00e0"),
                                peg$decode('<%;\u01f6/@#;\u023f/7$;\u00e1." &"/)$8#:\u011d#"" )(#\'#("\'#&\'#=." 7\u011c'),
                                peg$decode('<%;\u0218/1#;\u023f/($8":\u011f"!!)("\'#&\'#=." 7\u011e'),
                                peg$decode('<%;\u020a/;#;\u023f/2$;\u00dc/)$8#:\u0121#"" )(#\'#("\'#&\'#=." 7\u0120'),
                                peg$decode('%;\u00e3/2#;\u00e5/)$8":\u0122""! )("\'#&\'#'),
                                peg$decode('<%;\u00e4/2#;\u0187/)$8":\u0124""! )("\'#&\'#=." 7\u0123'),
                                peg$decode('<%;\u01f9/,#;\u023f/#$+")("\'#&\'#=." 7\u0125'),
                                peg$decode('<%;\u00e9.) &;\u0095.# &;\u00ee/1#;\u023f/($8":\u0126"!!)("\'#&\'#=." 7\u0112'),
                                peg$decode("<%;\u01a0/T#;\u00e8/K$;\u023f/B$$;\u00e70#*;\u00e7&/2$;\u01a1/)$8%:\u0128%\"#!)(%'#($'#(#'#(\"'#&'#=.\" 7\u0127"),
                                peg$decode("%;\u01a2/:#;\u00e8/1$;\u023f/($8#:\u0129#!!)(#'#(\"'#&'#"),
                                peg$decode("<%;\u0178/' 8!:\u012b!! )=.\" 7\u012a"),
                                peg$decode('<%;\u00ea/2#;\u00eb/)$8":\u012c""! )("\'#&\'#=." 7\u0112'),
                                peg$decode('<%;\u022d/1#;\u023f/($8":\u00b0"!!)("\'#&\'#=." 7\u012d'),
                                peg$decode("%;\u00ed/B#;\u023f/9$$;\u00ec0#*;\u00ec&/)$8#:\u012e#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u01a2/:#;\u00ed/1$;\u023f/($8#:\u0093#!!)(#'#(\"'#&'#"),
                                peg$decode("<%;\u01a0/C#;q/:$;\u023f/1$;\u01a1/($8$:\u0130$!\")($'#(#'#(\"'#&'#=.\" 7\u012f"),
                                peg$decode('<%;\u01d6/;#;\u023f/2$;\u022d/)$8#:\u0132#"" )(#\'#("\'#&\'#=." 7\u0131'),
                                peg$decode("<%;\u00f0.) &;\u01f8.# &;\u01e2/' 8!:\u00b0!! )=.\" 7\u0133"),
                                peg$decode('<%;\u0228/@#;\u023f/7$;\u00f1." &"/)$8#:\u0135#"" )(#\'#("\'#&\'#=." 7\u0134'),
                                peg$decode('%;\u01bb/1#;\u023f/($8":\u0136"!!)("\'#&\'#'),
                                peg$decode("<%;\u00f3/\u008a#;\u00f4.\" &\"/|$;\u00c6/s$;\u023f/j$;\u00f5/a$;\u00b9.\" &\"/S$;\u00a9.\" &\"/E$;\u023f/<$;\u00aa.\" &\"/.$8):\u0138)'('&$#\" )()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0137"),
                                peg$decode('<%;\u022a/1#;\u023f/($8":\u00b0"!!)("\'#&\'#=." 7\u0139'),
                                peg$decode("<%;\u020a/C#;\u023f/:$;\u00dc/1$;\u023f/($8$:\u013b$!!)($'#(#'#(\"'#&'#=.\" 7\u013a"),
                                peg$decode("<%;\u0220/C#;\u023f/:$;\u00f6/1$;\u023f/($8$:\u013d$!!)($'#(#'#(\"'#&'#=.\" 7\u013c"),
                                peg$decode('%;\u00f8/9#$;\u00f70#*;\u00f7&/)$8":\u012e""! )("\'#&\'#'),
                                peg$decode("%;\u023f/:#;\u01a2/1$;\u00f8/($8#:\u0129#! )(#'#(\"'#&'#"),
                                peg$decode("<%;\u017d/M#;\u023f/D$;\u01ac/;$;p/2$;\u023f/)$8%:\u013f%\"$!)(%'#($'#(#'#(\"'#&'#=.\" 7\u013e"),
                                peg$decode('<%;\u00fa/h#;\u00c6/_$;\u023f/V$;\u00b9." &"/H$;\u00a9." &"/:$;\u00aa." &"/,$8&:\u0141&%%$"! )(&\'#(%\'#($\'#(#\'#("\'#&\'#=." 7\u0140'),
                                peg$decode("<%;\u01d9/C#;\u023f/:$;\u01e9/1$;\u023f/($8$:\u00b0$!#)($'#(#'#(\"'#&'#=.\" 7\u0142"),
                                peg$decode('<;\u00fd.5 &;\u00fe./ &;\u00ff.) &;\u0100.# &;\u0101=." 7\u0143'),
                                peg$decode('%;\u01d0/1#;\u023f/($8":\u00b0"!!)("\'#&\'#'),
                                peg$decode("%%<%;\u00fc/>#;\u01f2./ &;\u0227.) &;\u022e.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0102/($8\":\u0129\"! )(\"'#&'#"),
                                peg$decode("%%<%;\u00fc/>#;\u0221./ &;\u0227.) &;\u022e.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0143/($8\":\u0129\"! )(\"'#&'#"),
                                peg$decode("%%<%;\u00fc/>#;\u0221./ &;\u01f2.) &;\u022e.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0147/($8\":\u0129\"! )(\"'#&'#"),
                                peg$decode("%%<%;\u00fc/>#;\u0221./ &;\u01f2.) &;\u0227.# &;\u022f/#$+\")(\"'#&'#=.##&&!&'#/1#;\u0156/($8\":\u0129\"! )(\"'#&'#"),
                                peg$decode("%%<%;\u00fc/>#;\u0221./ &;\u01f2.) &;\u0227.# &;\u022e/#$+\")(\"'#&'#=.##&&!&'#/1#;\u015a/($8\":\u0129\"! )(\"'#&'#"),
                                peg$decode("<%;\u0103/T#;\u0105.\" &\"/F$;\u017b/=$;\u023f/4$;\u0106/+$8%:\u0145%$$#\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u0144"),
                                peg$decode("%;\u00fc/J#;\u0104.\" &\"/<$;\u0221/3$;\u023f/*$8$:\u0146$##\"!)($'#(#'#(\"'#&'#"),
                                peg$decode('%;\u0223.# &;\u0222/1#;\u023f/($8":\u0147"!!)("\'#&\'#'),
                                peg$decode("<%;\u01ee/N#;\u023f/E$;k/<$;\u01e4/3$;\u023f/*$8%:\u0149%#$\"!)(%'#($'#(#'#(\"'#&'#=.\" 7\u0148"),
                                peg$decode(";\u0107.# &;\u0142"),
                                peg$decode("<%;\u01a0/Z#;\u0109/Q$$;\u010b0#*;\u010b&/A$;\u01a1/8$;\u0108.\" &\"/*$8%:\u014b%##\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u014a"),
                                peg$decode("%;\u0233/D#;\u023f/;$;\u021d/2$;\u023f/)$8$:\u014c$\"#!)($'#(#'#(\"'#&'#"),
                                peg$decode("%;\u010c/B#;\u023f/9$$;\u010a0#*;\u010a&/)$8#:\u012e#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u01a2/:#;\u010c/1$;\u023f/($8#:\u00aa#!!)(#'#(\"'#&'#"),
                                peg$decode('%;\u01a2." &"/1#;\u0120/($8":\u014d"! )("\'#&\'#'),
                                peg$decode('<%;\u010d/O#;\u023f/F$;\u010e." &"/8$;\u010f." &"/*$8$:\u014f$##! )($\'#(#\'#("\'#&\'#=." 7\u014e'),
                                peg$decode("%;\u0195/=#%<;\u023f=/##&'!&&#/($8\":p\"!!)(\"'#&'#.\\ &%%<;\u010e.) &;\u0111.# &;\u0120=.##&&!&'#/:#;\u023f/1$;\u0198/($8#:p#! )(#'#(\"'#&'#"),
                                peg$decode('<%;&/1#;\u023f/($8":\u0151"!!)("\'#&\'#=." 7\u0150'),
                                peg$decode("%;\u0111/B#$;\u01100#*;\u0110&/2$;\u023f/)$8#:\u012e#\"\"!)(#'#(\"'#&'#"),
                                peg$decode('%;\u023f/1#;\u0111/($8":\u0129"! )("\'#&\'#'),
                                peg$decode('<%;\u0112." &"/A#;\u0114/8$;\u0112." &"/*$8#:\u0153##"! )(#\'#("\'#&\'#=." 7\u0152'),
                                peg$decode("%$;\u0113/&#0#*;\u0113&&&#/' 8!:\u0154!! )"),
                                peg$decode("<%;\u01cf/C#;\u023f/:$;\u0195/1$;\u023f/($8$:\u0156$!!)($'#(#'#(\"'#&'#=.\" 7\u0155"),
                                peg$decode(";\u0116.; &;\u0119.5 &;\u011c./ &;\u011d.) &;\u011f.# &;\u0115"),
                                peg$decode("<%;\u0135/' 8!:\u0158!! )=.\" 7\u0157"),
                                peg$decode('<%;\u0117/U#;\u012f." &"/G$;\u0130." &"/9$;\u0118." &"/+$8$:\u015a$$#"! )($\'#(#\'#("\'#&\'#=." 7\u0159'),
                                peg$decode("<%;\u020f.# &;\u020e/D#;\u023f/;$;\u01fd/2$;\u023f/)$8$:\u015c$\"#!)($'#(#'#(\"'#&'#=.\" 7\u015b"),
                                peg$decode('<%;\u01c2/1#;\u023f/($8":\u015e"!!)("\'#&\'#=." 7\u015d'),
                                peg$decode('%;\u011a/@#;\u0130." &"/2$;\u023f/)$8#:\u015f#""!)(#\'#("\'#&\'#'),
                                peg$decode('<%;\u011b.# &;\u0229/1#;\u023f/($8":\u010b"!!)("\'#&\'#=." 7\u0160'),
                                peg$decode('<%;k." &"/2#;\u0206/)$8":\u0162""! )("\'#&\'#=." 7\u0161'),
                                peg$decode('<;\u0132=." 7\u0163'),
                                peg$decode("<%;\u01d6/D#;\u023f/;$;\u011e/2$;\u023f/)$8$:\u0165$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0164"),
                                peg$decode(";L./ &;5.) &;,.# &;3"),
                                peg$decode("<%;\u012d/' 8!:\u0167!! )=.\" 7\u0166"),
                                peg$decode('<%;\u0112." &"/J#;\u0121/A$;\u023f/8$;\u0112." &"/*$8$:\u0169$##" )($\'#(#\'#("\'#&\'#=." 7\u0168'),
                                peg$decode(";\u0133.) &;\u0123.# &;\u0122"),
                                peg$decode("<%;\u0132/' 8!:\u016b!! )=.\" 7\u016a"),
                                peg$decode("<%;\u0124/J#;\u023f/A$;\u0129/8$;\u0130.\" &\"/*$8$:\u016d$##! )($'#(#'#(\"'#&'#=.\" 7\u016c"),
                                peg$decode('%;\u0125.# &;\u0126/1#;\u023f/($8":\u016e"!!)("\'#&\'#'),
                                peg$decode('<%;\u020f/;#;\u023f/2$;\u01fd/)$8#:\u016f#"" )(#\'#("\'#&\'#=." 7\u015b'),
                                peg$decode("<%;\u0229/' 8!:\u0171!! )=.\" 7\u0170"),
                                peg$decode("%;\u01a0/T#;\u012b/K$;\u023f/B$$;\u012a0#*;\u012a&/2$;\u01a1/)$8%:\u0172%\"#!)(%'#($'#(#'#(\"'#&'#"),
                                peg$decode("%;\u0127/' 8!:\u0173!! )"),
                                peg$decode("%;\u0127/' 8!:\u0174!! )"),
                                peg$decode("%;\u01a2/:#;\u012b/1$;\u023f/($8#:\u0129#!!)(#'#(\"'#&'#"),
                                peg$decode('<%;\u012c/O#;\u023f/F$;\u012f." &"/8$;\u0118." &"/*$8$:\u0176$##! )($\'#(#\'#("\'#&\'#=." 7\u0175'),
                                peg$decode("%;\u00e8/\\#%<%;\u023f/8#;\u01b3.) &;\u01a1.# &;\u012f/#$+\")(\"'#&'#=/##&'!&&#/($8\":p\"!!)(\"'#&'#.# &;p"),
                                peg$decode("<%$;\u012e/&#0#*;\u012e&&&#/' 8!:\u0178!! )=.\" 7\u0177"),
                                peg$decode("%;\u01cb/C#;\u023f/:$;\u0181/1$;\u023f/($8$:p$!!)($'#(#'#(\"'#&'#"),
                                peg$decode('<%;\u01c0.# &;\u01da/1#;\u023f/($8":\u017a"!!)("\'#&\'#=." 7\u0179'),
                                peg$decode("%;\u0131/;#;\u00dc/2$;\u023f/)$8#:\u017b#\"\"!)(#'#(\"'#&'#"),
                                peg$decode("<%;\u0209/D#;\u023f/;$;\u01ce/2$;\u023f/)$8$:\u017d$\"#!)($'#(#'#(\"'#&'#=.\" 7\u017c"),
                                peg$decode("%;\u01ca/;#;\u023f/2$;L/)$8#:\u017e#\"\" )(#'#(\"'#&'#"),
                                peg$decode("<%;\u0134/E#;\u00e6/<$;\u0135/3$;\u023f/*$8$:\u0180$##\"!)($'#(#'#(\"'#&'#=.\" 7\u017f"),
                                peg$decode("<%;\u01e8/D#;\u023f/;$;\u01fd/2$;\u023f/)$8$:\u0182$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0181"),
                                peg$decode('%;\u0136/F#;\u0137." &"/8$;\u0140." &"/*$8#:\u0183##"! )(#\'#("\'#&\'#'),
                                peg$decode("<%;\u0213/D#;\u023f/;$;\u0187/2$;\u023f/)$8$:\u0185$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0184"),
                                peg$decode("%;\u0139/B#;\u023f/9$$;\u01380#*;\u0138&/)$8#:\u0186#\"\" )(#'#(\"'#&'#"),
                                peg$decode('%;\u0139/1#;\u023f/($8":\u0136"!!)("\'#&\'#'),
                                peg$decode('<;\u013a.# &;\u013f=." 7\u0187'),
                                peg$decode("%;\u0209/T#;\u023f/K$;\u01d9.# &;\u022a/<$;\u023f/3$;\u013b/*$8%:\u0188%#$\" )(%'#($'#(#'#(\"'#&'#"),
                                peg$decode('<;\u013c.) &;\u013d.# &;\u013e=." 7\u0189'),
                                peg$decode("%;\u0220/J#;\u023f/A$;\u0206.# &;\u01d6/2$;\u023f/)$8$:\u018a$\"#!)($'#(#'#(\"'#&'#"),
                                peg$decode('%;\u01c7.# &;\u0219/1#;\u023f/($8":\u018b"!!)("\'#&\'#'),
                                peg$decode("%;\u0203/D#;\u023f/;$;\u01b8/2$;\u023f/)$8$:\u018c$\"#!)($'#(#'#(\"'#&'#"),
                                peg$decode("%;\u0201/D#;\u023f/;$;\u0195/2$;\u023f/)$8$:\u018d$\"#!)($'#(#'#(\"'#&'#"),
                                peg$decode('<%;k." &"/J#;\u01d7/A$;\u023f/8$;\u0141." &"/*$8$:\u018f$##" )($\'#(#\'#("\'#&\'#=." 7\u018e'),
                                peg$decode("%;\u01f4/J#;\u023f/A$;\u01d8.# &;\u01f0/2$;\u023f/)$8$:\u0190$\"#!)($'#(#'#(\"'#&'#"),
                                peg$decode("%;\u0159/' 8!:\u0191!! )"),
                                peg$decode("<%;\u0144/c#;\u0105.\" &\"/U$;\u0183/L$;\u023f/C$;\u0146/:$;\u00b9.\" &\"/,$8&:\u0193&%%$#! )(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0192"),
                                peg$decode("%;\u00fc/J#;\u0145.\" &\"/<$;\u01f2/3$;\u023f/*$8$:\u0194$##\"!)($'#(#'#(\"'#&'#"),
                                peg$decode('%;\u0229/1#;\u023f/($8":\u0195"!!)("\'#&\'#'),
                                peg$decode("<%;\u0209/N#;\u023f/E$;\u017b/<$;\u023f/3$;\u0128/*$8%:\u0197%#$\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u0196"),
                                peg$decode("<%;\u0148/\u00a6#;\u0105.\" &\"/\u0098$;\u0184.\" &\"/\u008a$;\u023f/\u0081$;\u0149/x$;\u0209/o$;\u023f/f$;\u017b/]$;\u023f/T$;\u0151.\" &\"/F$;\u0152.\" &\"/8$;\u0153//$8,:\u0199,(+*)'$\"! )(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u0198"),
                                peg$decode("%;\u00fc/J#;\u0104.\" &\"/<$;\u0227/3$;\u023f/*$8$:\u019a$##\"!)($'#(#'#(\"'#&'#"),
                                peg$decode('<%;\u014a." &"/2#;\u014c/)$8":\u019c""! )("\'#&\'#=." 7\u019b'),
                                peg$decode('%;\u01c3.) &;\u01ba.# &;\u014b/1#;\u023f/($8":\u019d"!!)("\'#&\'#'),
                                peg$decode("%;\u01f7/;#;\u023f/2$;\u0207/)$8#:\u019e#\"\" )(#'#(\"'#&'#"),
                                peg$decode('<;\u014d.# &;\u014e=." 7\u019f'),
                                peg$decode('%;\u01d9.# &;\u01f6/1#;\u023f/($8":\u01a0"!!)("\'#&\'#'),
                                peg$decode('%;\u022a/@#;\u023f/7$;\u014f." &"/)$8#:\u01a1#"" )(#\'#("\'#&\'#'),
                                peg$decode("%;\u0207/;#;\u023f/2$;\u0150/)$8#:\u01a2#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u00e8/B#;\u023f/9$$;\u00e70#*;\u00e7&/)$8#:\u012e#\"\" )(#'#(\"'#&'#"),
                                peg$decode("%;\u01e7/c#;\u023f/Z$;\u01de/Q$;\u023f/H$;\u021c.) &3\u01a3\"\"5)7\u01a4/3$;\u023f/*$8&:\u01a5&#%#!)(&'#(%'#($'#(#'#(\"'#&'#"),
                                peg$decode("<%;\u0230/D#;\u023f/;$;p/2$;\u023f/)$8$:\u01a6$\"#!)($'#(#'#(\"'#&'#=.\" 7\u0084"),
                                peg$decode("<%;\u01c4/W#;\u023f/N$;\u0154/E$;\u023f/<$;\u01e0/3$;\u023f/*$8&:\u01a8&#%#!)(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u01a7"),
                                peg$decode("%$;\u0155/&#0#*;\u0155&&&#/' 8!:\u01a9!! )"),
                                peg$decode("%;\u008c/:#;\u023f/1$;$/($8#:\"#!\")(#'#(\"'#&'#"),
                                peg$decode("<%;\u0158/T#;\u0105.\" &\"/F$;\u0157/=$;\u023f/4$;\u0159/+$8%:\u01ab%$$#\" )(%'#($'#(#'#(\"'#&'#=.\" 7\u01aa"),
                                peg$decode("%;\u0185/;#;\u023f/2$;\u00e6/)$8#:\u01ac#\"\" )(#'#(\"'#&'#.# &;\u0185"),
                                peg$decode("%;\u00fc/J#;\u0104.\" &\"/<$;\u022e/3$;\u023f/*$8$:\u01ad$##\"!)($'#(#'#(\"'#&'#"),
                                peg$decode("%;\u01bf/D#;\u023f/;$;\u00a8/2$;\u023f/)$8$:\u012c$\"#!)($'#(#'#(\"'#&'#"),
                                peg$decode("<%;\u015b/f#;\u0105.\" &\"/X$;\u017b/O$;\u023f/F$;\u022b/=$;\u023f/4$;\u015c/+$8':\u01af'$&%$ )(''#(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u01ae"),
                                peg$decode("%;\u00fc/N#;\u022f/E$;\u023f/<$;\u0221/3$;\u023f/*$8%:\u01b0%#$#!)(%'#($'#(#'#(\"'#&'#"),
                                peg$decode('%;\u0197/@#;\u023f/7$;\u015d." &"/)$8#:\u01b1#"" )(#\'#("\'#&\'#'),
                                peg$decode("<%;\u01a0/Z#;\u023f/Q$;\u015e.\" &\"/C$;\u023f/:$;\u01a1/1$;\u023f/($8&:\u01b3&!#)(&'#(%'#($'#(#'#(\"'#&'#=.\" 7\u01b2"),
                                peg$decode('%;\u0160/9#$;\u015f0#*;\u015f&/)$8":\u01b4""! )("\'#&\'#'),
                                peg$decode("%;\u023f/H#;\u01a2/?$;\u023f/6$;\u0160.\" &\"/($8$:\u01b5$! )($'#(#'#(\"'#&'#"),
                                peg$decode("%%<%;\u0195/;#;\u023f/2$;&.# &;\u0111/#$+#)(#'#(\"'#&'#=.##&&!&'#/:#;p/1$;\u023f/($8#:\u0130#!!)(#'#(\"'#&'#.x &%;\u0161/n#%%<;\u0193=.##&&!&'#/,#;\u023f/#$+\")(\"'#&'#/F$;\u010e.\" &\"/8$;\u010f.\" &\"/*$8$:\u014f$##! )($'#(#'#(\"'#&'#"),
                                peg$decode(";\u0195.# &;\u0198"),
                                peg$decode('<%;\u0163/;#;\u017b/2$;\u023f/)$8#:\u01b7#""!)(#\'#("\'#&\'#=." 7\u01b6'),
                                peg$decode("<%;\u01dd/J#;\u023f/A$;\u0164/8$;\u0165.\" &\"/*$8$:\u01b9$##! )($'#(#'#(\"'#&'#=.\" 7\u01b8"),
                                peg$decode('<%;\u0221./ &;\u01f2.) &;\u0227.# &;\u022e/1#;\u023f/($8":\u010b"!!)("\'#&\'#=." 7\u01ba'),
                                peg$decode("<%;\u01ee/D#;\u023f/;$;\u01e4/2$;\u023f/)$8$:\u01bc$\"#!)($'#(#'#(\"'#&'#=.\" 7\u01bb"),
                                peg$decode('<%;\u01ae/,#;\u01ae/#$+")("\'#&\'#=." 7\u01bd'),
                                peg$decode('<;\u01aa=." 7\u01be'),
                                peg$decode('<;\u01ab=." 7\u01bf'),
                                peg$decode('<;\u01a4=." 7\u01c0'),
                                peg$decode('<;\u01b5=." 7\u01c1'),
                                peg$decode('<;\u01af=." 7\u01c2'),
                                peg$decode('<%;\u01b0/,#;\u01b0/#$+")("\'#&\'#=." 7\u01c3'),
                                peg$decode('<%;\u01b1/,#;\u01b1/#$+")("\'#&\'#=." 7\u01c4'),
                                peg$decode('<;\u01ad=." 7\u01c5'),
                                peg$decode('<;\u01ae=." 7\u01c6'),
                                peg$decode('<;\u01b0=." 7\u01c7'),
                                peg$decode('<;\u01b1=." 7\u01c8'),
                                peg$decode('<%;\u01b0/,#;\u01ac/#$+")("\'#&\'#=." 7\u01c9'),
                                peg$decode('<%;\u01b1/,#;\u01ac/#$+")("\'#&\'#=." 7\u01ca'),
                                peg$decode('<%;\u01ac/1#;\u01ac." &"/#$+")("\'#&\'#=." 7\u01cb'),
                                peg$decode('<%;\u01b2/,#;\u01ac/#$+")("\'#&\'#=." 7\u01cc'),
                                peg$decode('<%;\u01b0/,#;\u01b1/#$+")("\'#&\'#=." 7\u01cc'),
                                peg$decode('<%;\u01fa/@#;\u023f/7$;k." &"/)$8#:\u01ce#"" )(#\'#("\'#&\'#=." 7\u01cd'),
                                peg$decode('<;\u0195.# &;\u0198=." 7\u01cf'),
                                peg$decode("<%;\u0178/' 8!:\u01d1!! )=.\" 7\u01d0"),
                                peg$decode('<%;\u017c." &"/2#;\u0178/)$8":\u01d3""! )("\'#&\'#=." 7\u01d2'),
                                peg$decode('<%;\u017c." &"/2#;\u0178/)$8":\u01d5""! )("\'#&\'#=." 7\u01d4'),
                                peg$decode('%;\u0178/2#;\u01a3/)$8":\u01d6""! )("\'#&\'#'),
                                peg$decode('<%;\u017f.) &;\u0180.# &;\u017e/2#;\u0178/)$8":\u01d8""! )("\'#&\'#=." 7\u01d7'),
                                peg$decode("%;\u023f/& 8!:\u01d9! )"),
                                peg$decode('%;\u017c/2#;\u0180/)$8":\u01da""! )("\'#&\'#'),
                                peg$decode('%;\u0178/2#;\u01a3/)$8":D""! )("\'#&\'#'),
                                peg$decode("<%;\u0178/' 8!:\u01dc!! )=.\" 7\u01db"),
                                peg$decode("<%;\u0178/' 8!:\u01de!! )=.\" 7\u01dd"),
                                peg$decode('<%;\u017c." &"/2#;\u0178/)$8":\u01e0""! )("\'#&\'#=." 7\u01df'),
                                peg$decode('<%;\u017c." &"/2#;\u0178/)$8":\u01e2""! )("\'#&\'#=." 7\u01e1'),
                                peg$decode('<%;\u017c." &"/2#;\u0178/)$8":\u01e4""! )("\'#&\'#=." 7\u01e3'),
                                peg$decode('<%;\u017c." &"/2#;\u0178/)$8":\u01e6""! )("\'#&\'#=." 7\u01e5'),
                                peg$decode('<%;\u0188.# &;\u017b/1#;\u023f/($8":\u01e8"!!)("\'#&\'#=." 7\u01e7'),
                                peg$decode("%;\u017b/;#;\u023f/2$;\u00e6/)$8#:\u01e9#\"\" )(#'#(\"'#&'#"),
                                peg$decode("<%;\u0178/' 8!:\u01eb!! )=.\" 7\u01ea"),
                                peg$decode("<%;\u0178/' 8!:\u01ed!! )=.\" 7\u01ec"),
                                peg$decode('<%;\u018c/=#%<;\u0193=.##&&!&\'#/($8":\u01ef"!!)("\'#&\'#.\u00c5 &%;\u018d/=#%<;\u0193=.##&&!&\'#/($8":\u01f0"!!)("\'#&\'#.\u009b &%;\u018f/=#%<;\u0193=.##&&!&\'#/($8":\u01f1"!!)("\'#&\'#.q &%;\u0190/=#%<;\u0193=.##&&!&\'#/($8":\u01f2"!!)("\'#&\'#.G &%;\u0192/=#%<;\u0193=.##&&!&\'#/($8":\u01f3"!!)("\'#&\'#=." 7\u01ee'),
                                peg$decode('<%%3\u01f5""5!7\u01f6." &"/F#3\u01f7""5#7\u01f8." &"/2$3\u01f9""5$7\u01fa/#$+#)(#\'#("\'#&\'#.k &%3\u01fb""5$7\u01fc.5 &3\u01fd""5&7\u01fe.) &3\u01ff""5$7\u0200." &"/2#3\u0201""5$7\u0202/#$+")("\'#&\'#.) &3\u0203""5$7\u0204/\' 8!:\u010b!! )=." 7\u01f4'),
                                peg$decode('<%;\u018e.5 &3\u0206""5%7\u0207.) &3\u0208""5$7\u0209/\' 8!:\u010b!! )=." 7\u0205'),
                                peg$decode('<%3\u020b""5&7\u020c/i#%$4(""5!7)/,#0)*4(""5!7)&&&#/2#3\u020d""5)7\u020e/#$+")("\'#&\'#." &"/)$8":\u020f""! )("\'#&\'#=." 7\u020a'),
                                peg$decode('<%3\u0211""5\'7\u0212.\u0095 &3\u0213""5\'7\u0214.\u0089 &3\u0215""5\'7\u0216.} &%3\u0217""5$7\u0218/7#3\u0219""5$7\u021a." &"/#$+")("\'#&\'#.S &%3\u0219""5$7\u021a/7#3\u021b""5%7\u021c." &"/#$+")("\'#&\'#.) &3\u021d""5&7\u021e/\' 8!:\u010b!! )=." 7\u0210'),
                                peg$decode('<%%3\u0220""5#7\u0221/V#2\u0222""6\u02227\u0223.A &2\u0224""6\u02247\u0225.5 &2\u0226""6\u02267\u0227.) &3\u0228""5$7\u0229/#$+")("\'#&\'#.q &%3\u022a""5#7\u022b.A &3\u01fd""5&7\u01fe.5 &3\u022c""5%7\u022d.) &3\u01fb""5$7\u01fc." &"/2#3\u0220""5#7\u0221/#$+")("\'#&\'#.# &;\u0191/\' 8!:\u010b!! )=." 7\u021f'),
                                peg$decode('%3\u022e""5(7\u022f/d#%$4(""5!7)/,#0)*4(""5!7)&&&#/2#3\u0230""5%7\u0231/#$+")("\'#&\'#/)$8":\u0232""! )("\'#&\'#'),
                                peg$decode('<%3\u0234""5$7\u0235/\' 8!:\u010b!! )=." 7\u0233'),
                                peg$decode('4\u0236""5!7\u0237'),
                                peg$decode('%2\u0238""6\u02387\u0239/K#$4\u023a""5!7\u023b/,#0)*4\u023a""5!7\u023b&&&#/)$8":\u023c""! )("\'#&\'#'),
                                peg$decode(";\u0196.# &;\u0197"),
                                peg$decode(";\u0199./ &;\u019d.) &;\u019b.# &;\u019c"),
                                peg$decode("%%<;\u0234.# &;>=.##&&!&'#/J#$;\u0194.# &;\u0193/,#0)*;\u0194.# &;\u0193&&&#/($8\":\u00d6\"! )(\"'#&'#"),
                                peg$decode("%%<;\u0236.# &;>=.##&&!&'#/J#$;\u0194.# &;\u0193/,#0)*;\u0194.# &;\u0193&&&#/($8\":\u023d\"! )(\"'#&'#"),
                                peg$decode("%;\u019e/\u0099#;\u023f/\u0090$%$%%<;\u019a=.##&&!&'#/1#1\"\"5!7\u023e/#$+\")(\"'#&'#0G*%%<;\u019a=.##&&!&'#/1#1\"\"5!7\u023e/#$+\")(\"'#&'#&/\"!&,)/1$;\u019a/($8$:\u023f$!!)($'#(#'#(\"'#&'#"),
                                peg$decode('%$4\u0240""5!7\u02410)*4\u0240""5!7\u0241&/5#;\u019f/,$;\u023f/#$+#)(#\'#("\'#&\'#'),
                                peg$decode('%2\u0242""6\u02427\u0243/k#$2\u0244""6\u02447\u0245.) &4\u0246""5!7\u024705*2\u0244""6\u02447\u0245.) &4\u0246""5!7\u0247&/7$2\u0242""6\u02427\u0243/($8#:\u0248#!!)(#\'#("\'#&\'#'),
                                peg$decode('%2\u0249""6\u02497\u024a/k#$26""6677.) &48""5!7905*26""6677.) &48""5!79&/7$2\u0249""6\u02497\u024a/($8#:\u024b#!!)(#\'#("\'#&\'#'),
                                peg$decode('%2\u024c""6\u024c7\u024d/k#$2\u024e""6\u024e7\u024f.) &4\u0250""5!7\u025105*2\u024e""6\u024e7\u024f.) &4\u0250""5!7\u0251&/7$2\u024c""6\u024c7\u024d/($8#:\u0252#!!)(#\'#("\'#&\'#'),
                                peg$decode('<%2\u0254""6\u02547\u0255/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0253'),
                                peg$decode('<%2\u0257""6\u02577\u0258/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0256'),
                                peg$decode('<%2\u025a""6\u025a7\u025b/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0259'),
                                peg$decode('<%2\u025d""6\u025d7\u025e/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u025c'),
                                peg$decode('<%2\u0260""6\u02607\u0261/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u025f'),
                                peg$decode('<%2\u0263""6\u02637\u0264/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0262'),
                                peg$decode('<%2\u0266""6\u02667\u0267/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0265'),
                                peg$decode('<%2\u0269""6\u02697\u026a/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0268'),
                                peg$decode('<%2\u0249""6\u02497\u024a/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026b'),
                                peg$decode('<%2\u0242""6\u02427\u0243/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026c'),
                                peg$decode('<%2\u024c""6\u024c7\u024d/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026d'),
                                peg$decode('<%2\u026f""6\u026f7\u0270/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u026e'),
                                peg$decode('<%2\u0272""6\u02727\u0273/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0271'),
                                peg$decode('<%2\u0275""6\u02757\u0276/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0274'),
                                peg$decode('<%2\u0277""6\u02777\u0278/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01cb'),
                                peg$decode('<%2\u027a""6\u027a7\u027b/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0279'),
                                peg$decode('<%2\u027d""6\u027d7\u027e/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u027c'),
                                peg$decode('<%2\u027f""6\u027f7\u0280/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01c2'),
                                peg$decode('<%2\u0281""6\u02817\u0282/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01c7'),
                                peg$decode('<%2\u0283""6\u02837\u0284/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u01c8'),
                                peg$decode('<%2\u0286""6\u02867\u0287/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0285'),
                                peg$decode('<%2\u0289""6\u02897\u028a/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u0288'),
                                peg$decode('<%2a""6a7b/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u028b'),
                                peg$decode('<%2\u028d""6\u028d7\u028e/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u028c'),
                                peg$decode('<%2\u0290""6\u02907\u0291/1#;\u023f/($8":""!!)("\'#&\'#=." 7\u028f'),
                                peg$decode('%3\u0292""5%7\u0293/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0294""5&7\u0295/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0296""5#7\u0297/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0298""5%7\u0299/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u029a""5#7\u029b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u029c""5%7\u029d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u029e\"\"5'7\u029f/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u02a0""5#7\u02a1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02a2""5"7\u02a3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02a4""5#7\u02a5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02a6""5&7\u02a7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02a8""5-7\u02a9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02aa""5&7\u02ab/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02ac""5%7\u02ad/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u02ae\"\"5'7\u02af/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u02b0""5"7\u02b1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u02b2\"\"5'7\u02b3/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u02b4""5$7\u02b5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02b6""5$7\u02b7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02b8""5%7\u02b9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u02ba\"\"5'7\u02bb/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u02bc""5&7\u02bd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02be""5&7\u02bf/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02c0""5(7\u02c1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02c2""5*7\u02c3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02c4""5&7\u02c5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02c6""5%7\u02c7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02c8""5,7\u02c9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02ca""5,7\u02cb/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02cc""517\u02cd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02ce""5(7\u02cf/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u02d0\"\"5'7\u02d1/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u02d2""5*7\u02d3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02d4""5(7\u02d5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02d6""5&7\u02d7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02d8""5$7\u02d9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02da""5&7\u02db/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02dc""5(7\u02dd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02de""5$7\u02df/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02e0""5$7\u02e1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02e2""5$7\u02e3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02e4""5#7\u02e5/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02e6""5&7\u02e7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02e8""5&7\u02e9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02ea""5)7\u02eb/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02ec""5&7\u02ed/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u02ee\"\"5'7\u02ef/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u02f0""5$7\u02f1/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02f2""5#7\u02f3/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u02f4\"\"5'7\u02f5/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u02f6""5$7\u02f7/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02f8""5$7\u02f9/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02fa""5$7\u02fb/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02fc""5%7\u02fd/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u02fe""5&7\u02ff/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0300""5"7\u0301/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0302""5&7\u0303/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0304""5)7\u0305/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0306""5"7\u0307/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0308""5%7\u0309/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u030a\"\"5'7\u030b/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u030c""5)7\u030d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u030e""5%7\u030f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0310""5&7\u0311/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u0312\"\"5'7\u0313/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u0314""5)7\u0315/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0316""5$7\u0317/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0318""5"7\u0319/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u031a""5&7\u031b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u031c""5$7\u031d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u031e""5#7\u031f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0320""5$7\u0321/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0322""5$7\u0323/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0324""5%7\u0325/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0326""5%7\u0327/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u0328\"\"5'7\u0329/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u032a""5"7\u032b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u032c""5#7\u032d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u032e\"\"5'7\u032f/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3y""5$7z/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0330""5"7\u0331/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0332""5&7\u0333/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0334""5"7\u0335/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0336""5"7\u0337/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0338""5%7\u0339/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u033a""5%7\u033b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u033c""5$7\u033d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u033e""5&7\u033f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u0340\"\"5'7\u0341/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u0342""5%7\u0343/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0344""5%7\u0345/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0346""5)7\u0347/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0348""5*7\u0349/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u034a""5&7\u034b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u034c\"\"5'7\u034d/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode("%3\u034e\"\"5'7\u034f/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u0350""5&7\u0351/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u0352\"\"5'7\u0353/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u0354""5(7\u0355/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0356""5%7\u0357/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0358""5(7\u0359/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u035a""5#7\u035b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u035c""5%7\u035d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u035e""5)7\u035f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0360""5&7\u0361/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0362""5#7\u0363/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0364""5%7\u0365/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0366""5$7\u0367/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0368""5)7\u0369/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u036a""5$7\u036b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u036c""5"7\u036d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u036e""5+7\u036f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u0370\"\"5'7\u0371/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u0372""5%7\u0373/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0374""5&7\u0375/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0376""5&7\u0377/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0378""5%7\u0379/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u037a""5&7\u037b/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u037c""5&7\u037d/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u037e""5$7\u037f/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u0380\"\"5'7\u0381/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode('%3\u0382""5$7\u0383/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0384""5%7\u0385/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode('%3\u0386""5$7\u0387/8#%<;\u0193=.##&&!&\'#/#$+")("\'#&\'#'),
                                peg$decode("%3\u0388\"\"5'7\u0389/8#%<;\u0193=.##&&!&'#/#$+\")(\"'#&'#"),
                                peg$decode("%;\u0235/' 8!:\u038a!! )"),
                                peg$decode(";\u01b7.\u02f9 &;\u01b8.\u02f3 &;\u01b9.\u02ed &;\u01ba.\u02e7 &;\u01bb.\u02e1 &;\u01bc.\u02db &;\u01bd.\u02d5 &;\u01be.\u02cf &;\u01bf.\u02c9 &;\u01c0.\u02c3 &;\u01c1.\u02bd &;\u01c2.\u02b7 &;\u01c3.\u02b1 &;\u01c4.\u02ab &;\u01c5.\u02a5 &;\u01c6.\u029f &;\u01c7.\u0299 &;\u01c8.\u0293 &;\u01c9.\u028d &;\u01ca.\u0287 &;\u01cb.\u0281 &;\u01cc.\u027b &;\u01cd.\u0275 &;\u01ce.\u026f &;\u01cf.\u0269 &;\u01d0.\u0263 &;\u01d1.\u025d &;\u01d2.\u0257 &;\u01d3.\u0251 &;\u01d4.\u024b &;\u01d5.\u0245 &;\u01d6.\u023f &;\u01d7.\u0239 &;\u01d8.\u0233 &;\u01d9.\u022d &;\u01da.\u0227 &;\u01db.\u0221 &;\u01dc.\u021b &;\u01dd.\u0215 &;\u01de.\u020f &;\u01df.\u0209 &;\u01e0.\u0203 &;\u01e1.\u01fd &;\u01e2.\u01f7 &;\u01e3.\u01f1 &;\u01e4.\u01eb &;\u01e5.\u01e5 &;\u01e6.\u01df &;\u01e7.\u01d9 &;\u01e8.\u01d3 &;\u01e9.\u01cd &;\u01ea.\u01c7 &;\u01eb.\u01c1 &;\u01ec.\u01bb &;\u01ed.\u01b5 &;\u01ee.\u01af &;\u01ef.\u01a9 &;\u01f0.\u01a3 &;\u01f1.\u019d &;\u01f2.\u0197 &;\u01f3.\u0191 &;\u01f4.\u018b &;\u01f5.\u0185 &;\u01f6.\u017f &;\u01f7.\u0179 &;\u01f8.\u0173 &;\u01f9.\u016d &;\u01fa.\u0167 &;\u01fb.\u0161 &;\u01fc.\u015b &;\u01fd.\u0155 &;\u01fe.\u014f &;\u01ff.\u0149 &;\u0200.\u0143 &;\u0201.\u013d &;\u0202.\u0137 &;\u0203.\u0131 &;\u0204.\u012b &;\u0205.\u0125 &;\u0206.\u011f &;\u0207.\u0119 &;\u0208.\u0113 &;\u0209.\u010d &;\u020a.\u0107 &;\u020b.\u0101 &;\u020c.\u00fb &;\u020d.\u00f5 &;\u020e.\u00ef &;\u020f.\u00e9 &;\u0210.\u00e3 &;\u0211.\u00dd &;\u0212.\u00d7 &;\u0213.\u00d1 &;\u0214.\u00cb &;\u0215.\u00c5 &;\u0216.\u00bf &;\u0217.\u00b9 &;\u0218.\u00b3 &;\u0219.\u00ad &;\u021a.\u00a7 &;\u021b.\u00a1 &;\u021c.\u009b &;\u021e.\u0095 &;\u021f.\u008f &;\u0220.\u0089 &;\u0221.\u0083 &;\u0223.} &;\u0224.w &;\u0225.q &;\u0226.k &;\u0227.e &;\u0228._ &;\u0229.Y &;\u022a.S &;\u022b.M &;\u022c.G &;\u022d.A &;\u022e.; &;\u022f.5 &;\u0230./ &;\u0231.) &;\u0232.# &;\u0233"),
                                peg$decode(";\u01b9.\u0167 &;\u01bb.\u0161 &;\u01bc.\u015b &;\u01be.\u0155 &;\u01bf.\u014f &;\u01c2.\u0149 &;\u01c5.\u0143 &;\u01c8.\u013d &;\u01ca.\u0137 &;\u01cb.\u0131 &;\u01cd.\u012b &;\u01cf.\u0125 &;\u01d0.\u011f &;\u01d6.\u0119 &;\u01d7.\u0113 &;\u01d9.\u010d &;\u01dc.\u0107 &;\u01dd.\u0101 &;\u01df.\u00fb &;\u01e1.\u00f5 &;\u01e2.\u00ef &;\u01e4.\u00e9 &;\u01e8.\u00e3 &;\u01e9.\u00dd &;\u01ec.\u00d7 &;\u01ed.\u00d1 &;\u01f1.\u00cb &;\u01f2.\u00c5 &;\u01f6.\u00bf &;\u01f8.\u00b9 &;\u01f9.\u00b3 &;\u01fa.\u00ad &;\u01fb.\u00a7 &;\u01fc.\u00a1 &;\u0200.\u009b &;\u0204.\u0095 &;\u0205.\u008f &;\u0206.\u0089 &;\u0209.\u0083 &;\u020a.} &;\u020b.w &;\u020f.q &;\u0213.k &;\u021f.e &;\u0220._ &;\u0221.Y &;\u0224.S &;\u0225.M &;\u0226.G &;\u0228.A &;\u0229.; &;\u022a.5 &;\u022b./ &;\u022d.) &;\u0230.# &;\u0231"),
                                peg$decode(";\u0238.. &%;\u0239/& 8!:\u038b! )"),
                                peg$decode('<%2\u038d""6\u038d7\u038e/\u0087#$%%<4\u038f""5!7\u0390=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#0M*%%<4\u038f""5!7\u0390=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#&/#$+")("\'#&\'#=." 7\u038c'),
                                peg$decode("<%;\u023a/5#;\u023e/,$;\u023b/#$+#)(#'#(\"'#&'#=.\" 7\u0391"),
                                peg$decode('2\u0392""6\u03927\u0393'),
                                peg$decode('2\u0394""6\u03947\u0395'),
                                peg$decode('$%%<;\u023b.# &;\u023a=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#/P#0M*%%<;\u023b.# &;\u023a=.##&&!&\'#/1#1""5!7\u023e/#$+")("\'#&\'#&&&#'),
                                peg$decode(";\u023c.# &;\u0239"),
                                peg$decode('%;\u023d/K#$4\u0396""5!7\u0397.# &;\u023d0/*4\u0396""5!7\u0397.# &;\u023d&/#$+")("\'#&\'#'),
                                peg$decode('<%$4\u0396""5!7\u0397.# &;\u02370/*4\u0396""5!7\u0397.# &;\u0237&/\' 8!:-!! )=." 7\u0398'),
                                peg$decode('2\u0399""6\u03997\u039a')
                            ];
                            var peg$currPos=0;
                            var peg$savedPos=0;
                            var peg$posDetailsCache = [{"line" : 1 ,"column" : 1}];
                            var peg$maxFailPos=0;
                            var peg$maxFailExpected=[];
                            var peg$silentFails=0;
                            var peg$resultsCache={};
                            var peg$ruleNames = [
                                /* tbel */"start","start_streaming","stmt_list","semi_optional","semi_required","stmt_list_tail","type_definition","type_definition_types","datatype_custom"                ,"datatype_word_tail","type_definition_args","definition_args_loop","literal_value","literal_null","literal_date","literal_string","literal_string_single","literal_string_schar","literal_blob"
                                ,"literal_text","number_sign","literal_number_signed","literal_number","literal_number_decimal","number_decimal_node","number_decimal_full","number_decimal_fraction","number_decimal_exponent","literal_number_hex"                ,"number_hex","number_digit","bind_parameter","bind_parameter_numbered","bind_number_id","bind_parameter_named","bind_parameter_tcl","tcl_suffix","expression_exists","expression_exists_ne"
                                ,"expression_raise","expression_raise_args","raise_args_ignore","raise_args_message","expression_root","expression_wrapped","expression_recur","expression_unary_collate","expression_unary","expression_unary_op"                ,"expression_collate","expression_concat","expression_multiply","expression_multiply_op","expression_add","expression_add_op","expression_shift","expression_shift_op","expression_compare","expression_compare_op"
                                ,"expression_equiv","expression_equiv_tails","expression_equiv_null_op","expression_equiv_op","expression_cast","type_alias","expression_case","case_expression","expression_case_when","expression_case_else"                ,"expression_postfix","expression_postfix_tail","expression_like","expression_escape","expression_between","expression_between_tail","expression_is_not","expression_in","expression_in_target","expression_list_or_select"
                                ,"expression_and","expression","expression_list","expression_list_loop","expression_list_rest","function_call","function_call_args","args_list_distinct","error_message","stmt"                ,"stmt_modifier","modifier_query","stmt_nodes","stmt_commit","stmt_begin","commit_transaction","stmt_begin_modifier","stmt_rollback","rollback_savepoint","savepoint_name"
                                ,"savepoint_alt","stmt_savepoint","stmt_release","stmt_alter","alter_start","alter_action","alter_action_rename","alter_action_add","action_add_modifier","stmt_crud"                ,"stmt_core_with","clause_with","clause_with_recursive","clause_with_tables","clause_with_loop","expression_cte","select_alias","select_wrapped","stmt_select_full","stmt_sqlite"
                                ,"stmt_attach","attach_arg","stmt_detach","stmt_vacuum","vacuum_target","stmt_analyze","analyze_arg","stmt_reindex","reindex_arg","stmt_pragma"                ,"pragma_expression","pragma_value","pragma_value_literal","pragma_value_bool","pragma_bool_id","pragma_value_name","stmt_crud_types","stmt_select","stmt_core_order","stmt_core_limit"
                                ,"stmt_core_limit_offset","limit_offset_variant","limit_offset_variant_name","select_loop","select_loop_union","select_parts","select_parts_core","select_core_select","select_modifier","select_modifier_distinct"                ,"select_modifier_all","select_target","select_target_loop","select_core_from","stmt_core_where","select_core_group","select_core_having","select_node","select_node_star","select_node_star_qualified"
                                ,"select_node_aliased","select_source","source_loop_tail","select_cross_clause","select_join_clause","table_or_sub","table_or_sub_func","table_qualified","table_qualified_id","table_or_sub_index_node"                ,"index_node_indexed","index_node_none","table_or_sub_sub","table_or_sub_select","alias","join_operator","join_operator_natural","join_operator_types","operator_types_hand","types_hand_outer"
                                ,"operator_types_misc","join_condition","join_condition_on","join_condition_using","select_parts_values","stmt_core_order_list","stmt_core_order_list_loop","stmt_core_order_list_item","select_star","stmt_fallback_types"                ,"stmt_insert","insert_keyword","insert_keyword_ins","insert_keyword_repl","insert_keyword_mod","insert_target","insert_into","insert_into_start","insert_results","loop_columns"
                                ,"loop_column_tail","loop_name","insert_value","insert_value_start","insert_values_list","insert_values_loop","expression_list_wrapped","insert_default","operator_compound","compound_union"                ,"compound_union_all","stmt_update","update_start","update_fallback","update_set","update_columns","update_columns_tail","update_column","stmt_delete","delete_start"
                                ,"stmt_create","create_start","create_table_only","create_index_only","create_trigger_only","create_view_only","create_virtual_only","create_table","create_table_start","create_core_tmp"                ,"create_core_ine","create_table_source","table_source_def","source_def_rowid","source_def_loop","source_def_tail","source_tbl_loop","source_def_column","source_def_name","column_type"
                                ,"column_constraints","column_constraint_tail","column_constraint","constraint_name","constraint_name_loop","column_constraint_types","column_constraint_foreign","column_constraint_primary","col_primary_start","col_primary_auto"                ,"column_constraint_null","constraint_null_types","constraint_null_value","column_constraint_check","column_constraint_default","column_default_values","column_constraint_collate","table_constraint","table_constraint_types","table_constraint_check"
                                ,"table_constraint_primary","primary_start","primary_start_normal","primary_start_unique","primary_columns","primary_columns_index","primary_columns_table","primary_column_tail","primary_column","primary_column_types"                ,"column_collate","column_collate_loop","primary_column_dir","primary_conflict","primary_conflict_start","constraint_check","table_constraint_foreign","foreign_start","foreign_clause","foreign_references"
                                ,"foreign_actions","foreign_actions_tail","foreign_action","foreign_action_on","action_on_action","on_action_set","on_action_cascade","on_action_none","foreign_action_match","foreign_deferrable"                ,"deferrable_initially","table_source_select","create_index","create_index_start","index_unique","index_on","create_trigger","create_trigger_start","trigger_conditions","trigger_apply_mods"
                                ,"trigger_apply_instead","trigger_do","trigger_do_on","trigger_do_update","do_update_of","do_update_columns","trigger_foreach","trigger_when","trigger_action","action_loop"                ,"action_loop_stmt","create_view","id_view_expression","create_view_start","create_as_select","create_virtual","create_virtual_start","virtual_module","virtual_args","virtual_args_loop"
                                ,"virtual_args_tail","virtual_arg_types","virtual_column_name","stmt_drop","drop_start","drop_types","drop_ie","binary_concat","binary_plus","binary_minus"                ,"binary_multiply","binary_divide","binary_mod","binary_left","binary_right","binary_and","binary_or","binary_lt","binary_gt","binary_lte"
                                ,"binary_gte","binary_equal","binary_notequal_a","binary_notequal_b","binary_lang_isnt","id_name","id_database","id_function","id_table","id_table_qualified"                ,"id_column","column_unqualified","column_qualifiers","id_column_qualified","id_collation","id_savepoint","id_index","id_trigger","id_view","id_pragma"
                                ,"id_cte","id_table_expression","id_constraint_table","id_constraint_column","datatype_types","datatype_text","datatype_real","datatype_real_double","datatype_numeric","datatype_integer"                ,"datatype_integer_fp","datatype_none","name_char","unicode_char","name","name_quoted","name_unquoted","name_reserved","name_bracketed","bracket_terminator"
                                ,"name_dblquoted","name_sglquoted","name_backticked","sym_bopen","sym_bclose","sym_popen","sym_pclose","sym_comma","sym_dot","sym_star"                ,"sym_quest","sym_sglquote","sym_dblquote","sym_backtick","sym_tilde","sym_plus","sym_minus","sym_equal","sym_amp","sym_pipe"
                                ,"sym_mod","sym_lt","sym_gt","sym_excl","sym_semi","sym_colon","sym_fslash","sym_bslash","ABORT","ACTION"                ,"ADD","AFTER","ALL","ALTER","ANALYZE","AND","AS","ASC","ATTACH","AUTOINCREMENT"
                                ,"BEFORE","BEGIN","BETWEEN","BY","CASCADE","CASE","CAST","CHECK","COLLATE","COLUMN"                ,"COMMIT","CONFLICT","CONSTRAINT","CREATE","CROSS","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","DATABASE","DEFAULT"
                                ,"DEFERRABLE","DEFERRED","DELETE","DESC","DETACH","DISTINCT","DROP","EACH","ELSE","END"                ,"ESCAPE","EXCEPT","EXCLUSIVE","EXISTS","EXPLAIN","FAIL","FOR","FOREIGN","FROM","FULL"
                                ,"GLOB","GROUP","HAVING","IF","IGNORE","IMMEDIATE","IN","INDEX","INDEXED","INITIALLY"                ,"INNER","INSERT","INSTEAD","INTERSECT","INTO","IS","ISNULL","JOIN","KEY","LEFT"
                                ,"LIKE","LIMIT","MATCH","NATURAL","NO","NOT","NOTNULL","NULL","OF","OFFSET"                ,"ON","OR","ORDER","OUTER","PLAN","PRAGMA","PRIMARY","QUERY","RAISE","RECURSIVE"
                                ,"REFERENCES","REGEXP","REINDEX","RELEASE","RENAME","REPLACE","RESTRICT","RIGHT","ROLLBACK","ROW"                ,"ROWID","SAVEPOINT","SELECT","SET","TABLE","TEMP","TEMPORARY","THEN","TO","TRANSACTION"
                                ,"TRIGGER","UNION","UNIQUE","UPDATE","USING","VACUUM","VALUES","VIEW","VIRTUAL","WHEN"                ,"WHERE","WITH","WITHOUT","reserved_words","reserved_word_list","reserved_critical_list","comment","comment_line","comment_block","comment_block_start"
                                ,"comment_block_end","comment_block_body","block_body_nodes","comment_block_feed","o","_TODO_"];
                            var peg$descNames = [
                                /* tbel */null,null,null,null,null,null,"Type Definition",null,"Custom Datatype Name"                ,null,"Type Definition Arguments",null,null,"Null Literal","Date Literal","String Literal","Single-quoted String Literal",null,"Blob Literal"
                                ,null,"Number Sign",null,null,null,"Decimal Literal",null,null,"Decimal Literal Exponent","Hexidecimal Literal"                ,null,null,"Bind Parameter","Numbered Bind Parameter",null,"Named Bind Parameter","TCL Bind Parameter",null,"EXISTS Expression","EXISTS Keyword"
                                ,"RAISE Expression","RAISE Expression Arguments","IGNORE Keyword",null,null,null,null,null,null,null                ,"COLLATE Expression",null,null,null,null,null,null,null,null,null
                                ,null,null,null,null,"CAST Expression","Type Alias","CASE Expression",null,"WHEN Clause","ELSE Clause"                ,null,null,"Comparison Expression","ESCAPE Expression","BETWEEN Expression",null,null,"IN Expression",null,null
                                ,null,null,"Expression List",null,null,"Function Call","Function Call Arguments",null,"Error Message","Statement"                ,"QUERY PLAN","QUERY PLAN Keyword",null,"END Transaction Statement","BEGIN Transaction Statement",null,null,"ROLLBACK Statement","TO Clause",null
                                ,null,"SAVEPOINT Statement","RELEASE Statement","ALTER TABLE Statement","ALTER TABLE Keyword",null,"RENAME TO Keyword","ADD COLUMN Keyword",null,null                ,"WITH Clause",null,null,null,null,"Common Table Expression",null,null,null,null
                                ,"ATTACH Statement",null,"DETACH Statement","VACUUM Statement",null,"ANALYZE Statement",null,"REINDEX Statement",null,"PRAGMA Statement"                ,null,null,null,null,null,null,null,"SELECT Statement","ORDER BY Clause","LIMIT Clause"
                                ,"OFFSET Clause",null,null,null,"Union Operation",null,null,"SELECT Results Clause","SELECT Results Modifier",null                ,null,null,null,"FROM Clause","WHERE Clause","GROUP BY Clause","HAVING Clause",null,null,null
                                ,null,null,null,"CROSS JOIN Operation","JOIN Operation",null,null,"Qualified Table","Qualified Table Identifier","Qualfied Table Index"                ,null,null,"SELECT Source","Subquery","Alias","JOIN Operator",null,null,null,null
                                ,null,"JOIN Constraint","Join ON Clause","Join USING Clause","VALUES Clause",null,null,"Ordering Expression","Star","Fallback Type"                ,"INSERT Statement",null,"INSERT Keyword","REPLACE Keyword","INSERT OR Modifier",null,"INTO Clause","INTO Keyword","VALUES Clause","Column List"
                                ,null,"Column Name","VALUES Clause","VALUES Keyword",null,null,"Wrapped Expression List","DEFAULT VALUES Clause","Compound Operator","UNION Operator"                ,null,"UPDATE Statement","UPDATE Keyword","UPDATE OR Modifier","SET Clause",null,null,"Column Assignment","DELETE Statement","DELETE Keyword"
                                ,"CREATE Statement",null,null,null,null,null,null,"CREATE TABLE Statement",null,null                ,"IF NOT EXISTS Modifier",null,"Table Definition",null,null,null,null,"Column Definition",null,"Column Datatype"
                                ,null,null,"Column Constraint",null,"CONSTRAINT Name",null,"FOREIGN KEY Column Constraint","PRIMARY KEY Column Constraint","PRIMARY KEY Keyword","AUTOINCREMENT Keyword"                ,null,"UNIQUE Column Constraint","NULL Column Constraint","CHECK Column Constraint","DEFAULT Column Constraint",null,"COLLATE Column Constraint","Table Constraint",null,"CHECK Table Constraint"
                                ,"PRIMARY KEY Table Constraint",null,"PRIMARY KEY Keyword","UNIQUE Keyword",null,null,null,null,"Indexed Column",null                ,"Collation",null,"Column Direction",null,"ON CONFLICT Keyword",null,"FOREIGN KEY Table Constraint","FOREIGN KEY Keyword",null,"REFERENCES Clause"
                                ,null,null,"FOREIGN KEY Action Clause",null,"FOREIGN KEY Action",null,null,null,null,"DEFERRABLE Clause"                ,null,null,"CREATE INDEX Statement",null,null,"ON Clause","CREATE TRIGGER Statement",null,"Conditional Clause",null
                                ,null,"Conditional Action",null,null,null,null,null,"WHEN Clause","Actions Clause",null                ,null,"CREATE VIEW Statement",null,null,null,"CREATE VIRTUAL TABLE Statement",null,null,"Module Arguments",null
                                ,null,null,null,"DROP Statement","DROP Keyword","DROP Type","IF EXISTS Keyword","Or","Add","Subtract"                ,"Multiply","Divide","Modulo","Shift Left","Shift Right","Logical AND","Logical OR","Less Than","Greater Than","Less Than Or Equal"
                                ,"Greater Than Or Equal","Equal","Not Equal","Not Equal","IS","Identifier","Database Identifier","Function Identifier","Table Identifier",null                ,"Column Identifier",null,null,null,"Collation Identifier","Savepoint Identifier","Index Identifier","Trigger Identifier","View Identifier","Pragma Identifier"
                                ,"CTE Identifier",null,"Table Constraint Identifier","Column Constraint Identifier","Datatype Name","TEXT Datatype Name","REAL Datatype Name","DOUBLE Datatype Name","NUMERIC Datatype Name","INTEGER Datatype Name"                ,null,"BLOB Datatype Name",null,null,null,null,null,null,null,null
                                ,null,null,null,"Open Bracket","Close Bracket","Open Parenthesis","Close Parenthesis","Comma","Period","Asterisk"                ,"Question Mark","Single Quote","Double Quote","Backtick","Tilde","Plus","Minus","Equal","Ampersand","Pipe"
                                ,"Modulo","Less Than","Greater Than","Exclamation","Semicolon","Colon","Forward Slash","Backslash",null,null                ,null,null,null,null,null,null,null,null,null,null
                                ,null,null,null,null,null,null,null,null,null,null                ,null,null,null,null,null,null,null,null,null,null
                                ,null,null,null,null,null,null,null,null,null,null                ,null,null,null,null,null,null,null,null,null,null
                                ,null,null,null,null,null,null,null,null,null,null                ,null,null,null,null,null,null,null,null,null,null
                                ,null,null,null,null,null,null,null,null,null,null                ,null,null,null,null,null,null,null,null,null,null
                                ,null,null,null,null,null,null,null,null,null,null                ,null,null,null,null,null,null,null,null,null,null
                                ,null,null,null,null,null,null,null,null,null,null                ,null,null,null,null,null,null,null,"Line Comment","Block Comment",null
                                ,null,null,null,null,"Whitespace",null];
                            var peg$tracer = "tracer" in options ? ( options.tracer ) : ( new peg$DefaultTracer() );
                            var peg$result;
                            if("startRule" in options){
                                if(!(options.startRule in peg$startRuleIndices)){
                                    throw new Error("Can't start parsing from rule \"" + options.startRule + '".');
                                }
                                peg$startRuleIndex=peg$startRuleIndices[options.startRule];
                            }
                            function text(){
                                return(input.substring(peg$savedPos,peg$currPos));
                            }
                            function location(){
                                return(peg$computeLocation(peg$savedPos,peg$currPos));
                            }
                            function expected(description,location){
                                location=location !== undefined ? ( location ) : ( peg$computeLocation(peg$savedPos,peg$currPos) );
                                throw peg$buildStructuredError([peg$otherExpectation(description)],input.substring(peg$savedPos,peg$currPos),location);
                            }
                            function error(message,location){
                                location=location !== undefined ? ( location ) : ( peg$computeLocation(peg$savedPos,peg$currPos) );
                                throw peg$buildSimpleError(message,location);
                            }
                            function peg$literalExpectation(text,ignoreCase){
                                return({"type" : "literal" ,"text" : text ,"ignoreCase" : ignoreCase});
                            }
                            function peg$classExpectation(parts,inverted,ignoreCase){
                                return({"type" : "class" ,"parts" : parts ,"inverted" : inverted ,"ignoreCase" : ignoreCase});
                            }
                            function peg$anyExpectation(){
                                return({"type" : "any"});
                            }
                            function peg$endExpectation(){
                                return({"type" : "end"});
                            }
                            function peg$otherExpectation(description){
                                return({"type" : "other" ,"description" : description});
                            }
                            function peg$computePosDetails(pos){
                                var details=peg$posDetailsCache[pos];
                                var p;
                                if(details){
                                    return details;
                                }else{
                                    p=pos - 1;
                                    while(!(peg$posDetailsCache[p])){
                                        p--;
                                    }
                                    details=peg$posDetailsCache[p];
                                    details={"line" : details.line ,"column" : details.column};
                                    while(p < pos){
                                        if(input.charCodeAt(p) === 10){
                                            details.line++;
                                            details.column=1;
                                        }else{
                                            details.column++;
                                        }
                                        p++;
                                    }
                                    peg$posDetailsCache[pos]=details;
                                    return details;
                                }
                            }
                            function peg$computeLocation(startPos,endPos){
                                var startPosDetails = peg$computePosDetails(startPos);
                                var endPosDetails = peg$computePosDetails(endPos);
                                return({
                                    "start" : {"offset" : startPos ,"line" : startPosDetails.line ,"column" : startPosDetails.column} ,
                                    "end" : {"offset" : endPos ,"line" : endPosDetails.line ,"column" : endPosDetails.column}
                                });
                            }
                            function peg$fail(expected){
                                if(peg$currPos < peg$maxFailPos){
                                    return;
                                }
                                if(peg$currPos > peg$maxFailPos){
                                    peg$maxFailPos=peg$currPos;
                                    peg$maxFailExpected=[];
                                }
                                peg$maxFailExpected.push(expected);
                            }
                            function peg$buildSimpleError(message,location){
                                return(new peg$SyntaxError(message,null,null,location));
                            }
                            function peg$buildStructuredError(expected,found,location){
                                return(new peg$SyntaxError(peg$SyntaxError.buildMessage(expected,found),expected,found,location));
                            }
                            function peg$decode(s){
                                return(s.split("").map(function(ch){
                                    return(ch.charCodeAt(0) - 32);
                                }));
                            }
                            function peg$parseRule(index){
                                var bc=peg$bytecode[index];
                                var ip=0;
                                var ips=[];
                                var end=bc.length;
                                var ends=[];
                                var stack=[];
                                var startPos=peg$currPos;
                                var params;
                                peg$tracer.trace({"type" : "rule.enter" ,"rule" : peg$ruleNames[index] ,"description" : peg$descNames[index] ,"location" : peg$computeLocation(startPos,startPos)});
                                var key = peg$currPos * 545 + index;
                                var cached=peg$resultsCache[key];
                                if(cached){
                                    peg$currPos=cached.nextPos;
                                    if(cached.result !== peg$FAILED){
                                        peg$tracer.trace({"type" : "rule.match" ,"rule" : peg$ruleNames[index] ,"description" : peg$descNames[index] ,"result" : cached.result ,"location" : peg$computeLocation(startPos,peg$currPos)});
                                    }else{
                                        peg$tracer.trace({"type" : "rule.fail" ,"rule" : peg$ruleNames[index] ,"description" : peg$descNames[index] ,"location" : peg$computeLocation(startPos,startPos)});
                                    }
                                    return cached.result;
                                }
                                while(true){
                                    while(ip < end){
                                        switch (bc[ip]){
                                            case 0 :
                                                stack.push(peg$consts[bc[ip+1]]);
                                                ip+=2;
                                                break;
                                                
                                            case 1 :
                                                stack.push(undefined);
                                                ip++;
                                                break;
                                                
                                            case 2 :
                                                stack.push(null);
                                                ip++;
                                                break;
                                                
                                            case 3 :
                                                stack.push(peg$FAILED);
                                                ip++;
                                                break;
                                                
                                            case 4 :
                                                stack.push([]);
                                                ip++;
                                                break;
                                                
                                            case 5 :
                                                stack.push(peg$currPos);
                                                ip++;
                                                break;
                                                
                                            case 6 :
                                                stack.pop();
                                                ip++;
                                                break;
                                                
                                            case 7 :
                                                peg$currPos=stack.pop();
                                                ip++;
                                                break;
                                                
                                            case 8 :
                                                stack.length-=bc[ip+1];
                                                ip+=2;
                                                break;
                                                
                                            case 9 :
                                                stack.splice(-2,1);
                                                ip++;
                                                break;
                                                
                                            case 10 :
                                                stack[stack.length-2].push(stack.pop());
                                                ip++;
                                                break;
                                                
                                            case 11 :
                                                stack.push(stack.splice(stack.length - bc[ip+1],bc[ip+1]));
                                                ip+=2;
                                                break;
                                                
                                            case 12 :
                                                stack.push(input.substring(stack.pop(),peg$currPos));
                                                ip++;
                                                break;
                                                
                                            case 13 :
                                                ends.push(end);
                                                ips.push(ip + 3 + bc[ip+1] + bc[ip+2]);
                                                if(stack[stack.length-1]){
                                                    end=ip + 3 + bc[ip+1];
                                                    ip+=3;
                                                }else{
                                                    end=ip + 3 + bc[ip+1] + bc[ip+2];
                                                    ip+=3 + bc[ip+1];
                                                }
                                                break;
                                                
                                            case 14 :
                                                ends.push(end);
                                                ips.push(ip + 3 + bc[ip+1] + bc[ip+2]);
                                                if(stack[stack.length-1] === peg$FAILED){
                                                    end=ip + 3 + bc[ip+1];
                                                    ip+=3;
                                                }else{
                                                    end=ip + 3 + bc[ip+1] + bc[ip+2];
                                                    ip+=3 + bc[ip+1];
                                                }
                                                break;
                                                
                                            case 15 :
                                                ends.push(end);
                                                ips.push(ip + 3 + bc[ip+1] + bc[ip+2]);
                                                if(stack[stack.length-1] !== peg$FAILED){
                                                    end=ip + 3 + bc[ip+1];
                                                    ip+=3;
                                                }else{
                                                    end=ip + 3 + bc[ip+1] + bc[ip+2];
                                                    ip+=3 + bc[ip+1];
                                                }
                                                break;
                                                
                                            case 16 :
                                                if(stack[stack.length-1] !== peg$FAILED){
                                                    ends.push(end);
                                                    ips.push(ip);
                                                    end=ip + 2 + bc[ip+1];
                                                    ip+=2;
                                                }else{
                                                    ip+=2 + bc[ip+1];
                                                }
                                                break;
                                                
                                            case 17 :
                                                ends.push(end);
                                                ips.push(ip + 3 + bc[ip+1] + bc[ip+2]);
                                                if(input.length > peg$currPos){
                                                    end=ip + 3 + bc[ip+1];
                                                    ip+=3;
                                                }else{
                                                    end=ip + 3 + bc[ip+1] + bc[ip+2];
                                                    ip+=3 + bc[ip+1];
                                                }
                                                break;
                                                
                                            case 18 :
                                                ends.push(end);
                                                ips.push(ip + 4 + bc[ip+2] + bc[ip+3]);
                                                if(input.substr(peg$currPos,peg$consts[bc[ip+1]].length) === peg$consts[bc[ip+1]]){
                                                    end=ip + 4 + bc[ip+2];
                                                    ip+=4;
                                                }else{
                                                    end=ip + 4 + bc[ip+2] + bc[ip+3];
                                                    ip+=4 + bc[ip+2];
                                                }
                                                break;
                                                
                                            case 19 :
                                                ends.push(end);
                                                ips.push(ip + 4 + bc[ip+2] + bc[ip+3]);
                                                if(input.substr(peg$currPos,peg$consts[bc[ip+1]].length).toLowerCase() === peg$consts[bc[ip+1]]){
                                                    end=ip + 4 + bc[ip+2];
                                                    ip+=4;
                                                }else{
                                                    end=ip + 4 + bc[ip+2] + bc[ip+3];
                                                    ip+=4 + bc[ip+2];
                                                }
                                                break;
                                                
                                            case 20 :
                                                ends.push(end);
                                                ips.push(ip + 4 + bc[ip+2] + bc[ip+3]);
                                                if(peg$consts[bc[ip+1]].test(input.charAt(peg$currPos))){
                                                    end=ip + 4 + bc[ip+2];
                                                    ip+=4;
                                                }else{
                                                    end=ip + 4 + bc[ip+2] + bc[ip+3];
                                                    ip+=4 + bc[ip+2];
                                                }
                                                break;
                                                
                                            case 21 :
                                                stack.push(input.substr(peg$currPos,bc[ip+1]));
                                                peg$currPos+=bc[ip+1];
                                                ip+=2;
                                                break;
                                                
                                            case 22 :
                                                stack.push(peg$consts[bc[ip+1]]);
                                                peg$currPos+=peg$consts[bc[ip+1]].length;
                                                ip+=2;
                                                break;
                                                
                                            case 23 :
                                                stack.push(peg$FAILED);
                                                if(peg$silentFails === 0){
                                                    peg$fail(peg$consts[bc[ip+1]]);
                                                }
                                                ip+=2;
                                                break;
                                                
                                            case 24 :
                                                peg$savedPos=stack[stack.length - 1 - bc[ip+1]];
                                                ip+=2;
                                                break;
                                                
                                            case 25 :
                                                peg$savedPos=peg$currPos;
                                                ip++;
                                                break;
                                                
                                            case 26 :
                                                params=bc.slice(ip + 4,ip + 4 + bc[ip+3]).map(function(p){
                                                    return(stack[stack.length - 1 - p]);
                                                });
                                                stack.splice(stack.length - bc[ip+2],bc[ip+2],peg$consts[bc[ip+1]].apply(null,params));
                                                ip+=4 + bc[ip+3];
                                                break;
                                                
                                            case 27 :
                                                stack.push(peg$parseRule(bc[ip+1]));
                                                ip+=2;
                                                break;
                                                
                                            case 28 :
                                                peg$silentFails++;
                                                ip++;
                                                break;
                                                
                                            case 29 :
                                                peg$silentFails--;
                                                ip++;
                                                break;
                                                
                                            default: throw new Error("Invalid opcode: " + bc[ip] + ".");
                                        }
                                    }
                                    if(ends.length > 0){
                                        end=ends.pop();
                                        ip=ips.pop();
                                    }else{
                                        break;
                                    }
                                }
                                peg$resultsCache[key]={"nextPos" : peg$currPos ,"result" : stack[0]};
                                if(stack[0] !== peg$FAILED){
                                    peg$tracer.trace({"type" : "rule.match" ,"rule" : peg$ruleNames[index] ,"description" : peg$descNames[index] ,"result" : stack[0] ,"location" : peg$computeLocation(startPos,peg$currPos)});
                                }else{
                                    peg$tracer.trace({"type" : "rule.fail" ,"rule" : peg$ruleNames[index] ,"description" : peg$descNames[index] ,"location" : peg$computeLocation(startPos,startPos)});
                                }
                                return stack[0];
                            }
                            function makeArray(arr){
                                if(!(isOkay(arr))){
                                    return [];
                                }
                                return(!(Array.isArray(arr)) ? ( [arr] ) : ( arr ));
                            }
                            function isOkay(obj){
                                return(obj != null);
                            }
                            function foldString(parts){
                                var glue = arguments.length > 1 && arguments[1] !== undefined ? ( arguments[1] ) : ( " " );
                                var folded = parts.filter(function(part){
                                    return(isOkay(part));
                                }).reduce(function(prev,cur){
                                    return("" + prev + nodeToString(cur) + glue);
                                },"");
                                return(folded.trim());
                            }
                            function foldStringWord(parts){
                                return(foldString(parts,""));
                            }
                            function foldStringKey(parts){
                                return(foldString(parts).toLowerCase());
                            }
                            function flattenAll(arr){
                                return(arr.filter(function(part){
                                    return(isOkay(part));
                                }).reduce(function(prev,cur){
                                    return(prev.concat(cur));
                                },[]));
                            }
                            function unescape(str){
                                var quoteChar = arguments.length > 1 && arguments[1] !== undefined ? ( arguments[1] ) : ( "'" );
                                var re = new RegExp(quoteChar + "{2}","g");
                                return(nodeToString(str).replace(re,quoteChar));
                            }
                            function nodeToString(){
                                var node = arguments.length > 0 && arguments[0] !== undefined ? ( arguments[0] ) : ( [] );
                                return(makeArray(node).join(""));
                            }
                            function textNode(node){
                                return(nodeToString(node).trim());
                            }
                            function keyNode(node){
                                return(textNode(node).toLowerCase());
                            }
                            function isArrayOkay(arr){
                                return(Array.isArray(arr) && arr.length > 0 && isOkay(arr[0]));
                            }
                            function composeBinary(first,rest){
                                return(rest.reduce(function(left,_ref7){
                                    var _ref8 = _slicedToArray(_ref7,4);
                                    var x=_ref8[0];
                                    var operation=_ref8[1];
                                    var y=_ref8[2];
                                    var right=_ref8[3];
                                    return({
                                        "type" : "expression" ,
                                        "format" : "binary" ,
                                        "variant" : "operation" ,
                                        "operation" : keyNode(operation) ,
                                        "left" : left ,
                                        "right" : right
                                    });
                                },first));
                            }
                            peg$result=peg$parseRule(peg$startRuleIndex);
                            if(peg$result !== peg$FAILED && peg$currPos === input.length){
                                return peg$result;
                            }else{
                                if(peg$result !== peg$FAILED && peg$currPos < input.length){
                                    peg$fail(peg$endExpectation());
                                }
                                throw peg$buildStructuredError(peg$maxFailExpected,peg$maxFailPos < input.length ? ( input.charAt(peg$maxFailPos) ) : ( null ),peg$maxFailPos < input.length ? ( peg$computeLocation(peg$maxFailPos,peg$maxFailPos + 1) ) : ( peg$computeLocation(peg$maxFailPos,peg$maxFailPos) ));
                            }
                        }
                        module.exports={"SyntaxError" : peg$SyntaxError ,"DefaultTracer" : peg$DefaultTracer ,"parse" : peg$parse};
                    },{}] ,
            "3" : [function(require,module,exports){
                        Object.defineProperty(exports,"__esModule",{"value" : true});
                        function findLastIndex(arr,func){
                            for( var i = arr.length - 1 ; i >= 0 ; i-=1 ){
                                if(func(arr[i])){
                                    return i;
                                }
                            }
                            return -1;
                        }
                        function takeWhile(arr,func){
                            var len=arr.length;
                            var i=0;
                            for(  ; i < len ; i+=1 ){
                                if(!(func(arr[i]))){
                                    return(arr.slice(0,i));
                                }
                            }
                            return arr;
                        }
                        var Tracer = exports.Tracer=(function(){
                            function Tracer(){
                                if(!(this instanceof  Tracer)){
                                    return(new Tracer());
                                }
                                this.events=[];
                                this.indentation=0;
                                this.whitespaceRule=/(^whitespace)|(char$)|(^[oe]$)|(^sym_)/i;
                                this.statementRule=/Statement$/i;
                                this.firstNodeRule=/(Statement|Clause)$/i;
                            }
                            Tracer.prototype.trace=function trace(event){
                                var that=this;
                                var lastIndex;
                                var lastWsIndex;
                                event.indentation=this.indentation;
                                switch (event.type){
                                    case "rule.enter" :
                                        this.events.push(event);
                                        this.indentation+=1;
                                        break;
                                        
                                    case "rule.match" : this.indentation-=1;
                                        break;
                                    case "rule.fail" :
                                        lastIndex=findLastIndex(this.events,function(_ref){
                                            var rule=_ref.rule;
                                            return(rule === event.rule);
                                        });
                                        lastWsIndex=findLastIndex(this.events,function(e){
                                            return(!(that.whitespaceRule.test(e.rule)));
                                        });
                                        if(that.whitespaceRule.test(event.rule) || lastIndex === lastWsIndex){
                                            this.events.splice(lastIndex,1);
                                        }
                                        this.indentation-=1;
                                        break;
                                        
                                }
                            };
                            Tracer.prototype.smartError=function smartError(err){
                                var that=this;
                                var message;
                                var location;
                                var chain;
                                var chainDetail;
                                var firstNode;
                                var bestNode={"indentation" : -1};
                                var deep=false;
                                var stmts=0;
                                var namedEvents = this.events.filter(function(e){
                                    return(e.description != null && !(that.whitespaceRule.test(e.rule)));
                                }).reverse();
                                chain=takeWhile(namedEvents,function(elem){
                                    if(/^(sym_semi)$/i.test(elem.rule)){
                                        stmts+=1;
                                    }
                                    if(stmts > 1){
                                        return false;
                                    }
                                    if(!(deep)){
                                        if(elem.indentation > bestNode.indentation){
                                            bestNode=elem;
                                        }else{
                                            deep=true;
                                        }
                                    }else if(/^(stmt)$/i.test(elem.rule)){
                                        deep=true;
                                        return true;
                                    }
                                    return true;
                                });
                                if(chain.length){
                                    location=bestNode.location;
                                    firstNode=chain.find(function(elem){
                                        return(that.firstNodeRule.test(elem.description) && elem.description !== bestNode.description && elem.indentation !== bestNode.indentation);
                                    });
                                    if(firstNode != null){
                                        if(this.statementRule.test(bestNode.description) && this.statementRule.test(firstNode.description)){
                                            chainDetail=firstNode.description;
                                        }else{
                                            chainDetail=bestNode.description + " (" + firstNode.description + ")";
                                        }
                                    }else{
                                        chainDetail=bestNode.description;
                                    }
                                    message="Syntax error found near " + chainDetail;
                                    Object.assign(err,{"message" : message ,"location" : location});
                                }
                                return err;
                            };
                            return Tracer;
                    })();
                    },{}]
        },{},[1])(1));
    });