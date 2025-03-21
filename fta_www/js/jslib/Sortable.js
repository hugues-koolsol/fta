/*#!
 * Sortable 1.15.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
*/
(function( global , factory ){
         typeof exports === 'object' &&  typeof module !== 'undefined' ?
          ( 
            module.exports=factory()
          ) : ( 
             typeof define === 'function' && define.amd ? ( define( factory ) ) : ( global=global || self,global.Sortable=factory() )
          );
})( this , function(){
        "use strict";
        function ownKeys( object , enumerableOnly ){
            var keys=Object.keys( object );
            if(Object.getOwnPropertySymbols){
                var symbols=Object.getOwnPropertySymbols( object );
                if(enumerableOnly){
                    symbols=symbols.filter( function( sym ){
                        return(Object.getOwnPropertyDescriptor( object , sym ).enumerable);
                    } );
                }
                keys.push.apply( keys , symbols );
            }
            return keys;
        }
        function _objectSpread2( target ){
            for( var i=1 ; i < arguments.length ; i++ ){
                var source=arguments[i] != null ? ( arguments[i] ) : ( {} );
                if(i% 2){
                    ownKeys( Object( source ) , true ).forEach( function( key ){
                            _defineProperty( target , key , source[key] );
                        } );
                }else if(Object.getOwnPropertyDescriptors){
                    Object.defineProperties( target , Object.getOwnPropertyDescriptors( source ) );
                }else{
                    ownKeys( Object( source ) ).forEach( function( key ){
                            Object.defineProperty( target , key , Object.getOwnPropertyDescriptor( source , key ) );
                        } );
                }
            }
            return target;
        }
        function _typeof( obj ){
            "@babel/helpers - typeof";
            if( typeof Symbol === "function" &&  typeof Symbol.iterator === "symbol"){
                _typeof=function( obj ){
                    return( typeof obj);
                };
            }else{
                _typeof=function( obj ){
                    return(obj &&  typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? ( "symbol" ) : (  typeof obj ));
                };
            }
            return(_typeof( obj ));
        }
        function _defineProperty( obj , key , value ){
            if(key in obj){
                Object.defineProperty( obj , key , {"value" : value ,"enumerable" : true ,"configurable" : true ,"writable" : true} );
            }else{
                obj[key]=value;
            }
            return obj;
        }
        function _extends(){
            _extends=Object.assign || function( target ){
                    for( var i=1 ; i < arguments.length ; i++ ){
                        var source=arguments[i];
                        for(var key in source){
                            if(Object.prototype.hasOwnProperty.call( source , key )){
                                target[key]=source[key];
                            }
                        }
                    }
                    return target;
                };
            return(_extends.apply( this , arguments ));
        }
        function _objectWithoutPropertiesLoose( source , excluded ){
            if(source == null){
                return({});
            }
            var target={};
            var sourceKeys=Object.keys( source );
            var key;
            var i;
            for( i=0 ; i < sourceKeys.length ; i++ ){
                key=sourceKeys[i];
                if(excluded.indexOf( key ) >= 0){
                    continue;
                }
                target[key]=source[key];
            }
            return target;
        }
        function _objectWithoutProperties( source , excluded ){
            if(source == null){
                return({});
            }
            var target=_objectWithoutPropertiesLoose( source , excluded );
            var key;
            var i;
            if(Object.getOwnPropertySymbols){
                var sourceSymbolKeys=Object.getOwnPropertySymbols( source );
                for( i=0 ; i < sourceSymbolKeys.length ; i++ ){
                    key=sourceSymbolKeys[i];
                    if(excluded.indexOf( key ) >= 0){
                        continue;
                    }
                    if(!Object.prototype.propertyIsEnumerable.call( source , key )){
                        continue;
                    }
                    target[key]=source[key];
                }
            }
            return target;
        }
        function _toConsumableArray( arr ){
            return(_arrayWithoutHoles( arr ) || _iterableToArray( arr ) || _unsupportedIterableToArray( arr ) || _nonIterableSpread());
        }
        function _arrayWithoutHoles( arr ){
            if(Array.isArray( arr )){
                return(_arrayLikeToArray( arr ));
            }
        }
        function _iterableToArray( iter ){
            if( typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null){
                return(Array.from( iter ));
            }
        }
        function _unsupportedIterableToArray( o , minLen ){
            if(!o){
                return;
            }
            if( typeof o === "string"){
                return(_arrayLikeToArray( o , minLen ));
            }
            var n=Object.prototype.toString.call( o ).slice( 8 , -1 );
            if(n === "Object" && o.constructor){
                n=o.constructor.name;
            }
            if(n === "Map" || n === "Set"){
                return(Array.from( o ));
            }
            if(n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test( n )){
                return(_arrayLikeToArray( o , minLen ));
            }
        }
        function _arrayLikeToArray( arr , len ){
            if(len == null || len > arr.length){
                len=arr.length;
            }
            for( var i=0,arr2=[len] ; i < len ; i++ ){
                arr2[i]=arr[i];
            }
            return arr2;
        }
        function _nonIterableSpread(){
            throw new TypeError( "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method." );
        }
        var version="1.15.2";
        function userAgent( pattern ){
            if( typeof window !== 'undefined' && window.navigator){
                return(!!navigator.userAgent.match( /* @__PURE__ */ pattern ));
            }
        }
        var IE11OrLess=userAgent( /(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i );
        var Edge=userAgent( /Edge/i );
        var FireFox=userAgent( /firefox/i );
        var Safari=userAgent( /safari/i ) && !userAgent( /chrome/i ) && !userAgent( /android/i );
        var IOS=userAgent( /iP(ad|od|hone)/i );
        var ChromeForAndroid=userAgent( /chrome/i ) && userAgent( /android/i );
        var captureMode={"capture" : false ,"passive" : false};
        function on( el , event , fn ){
            el.addEventListener( event , fn , !IE11OrLess && captureMode );
        }
        function off( el , event , fn ){
            el.removeEventListener( event , fn , !IE11OrLess && captureMode );
        }
        function matches( /* #HTMLElement */ el , /* #String */ selector ){
            if(!selector){
                return;
            }
            selector[0] === '>' && (selector=selector.substring( 1 ));
            if(el){
                try{
                    if(el.matches){
                        return(el.matches( selector ));
                    }else if(el.msMatchesSelector){
                        return(el.msMatchesSelector( selector ));
                    }else if(el.webkitMatchesSelector){
                        return(el.webkitMatchesSelector( selector ));
                    }
                }catch(_){
                    return false;
                }
            }
            return false;
        }
        function getParentOrHost( el ){
            return(el.host && el !== document && el.host.nodeType ? ( el.host ) : ( el.parentNode ));
        }
        function closest( /* #HTMLElement */ el , /* #String */ selector , /* #HTMLElement */ ctx , includeCTX ){
            if(el){
                ctx=ctx || document;
                do{
                    if(selector != null
                               && (selector[0] === '>' ? ( el.parentNode === ctx && matches( el , selector ) ) : ( matches( el , selector ) ))
                           || includeCTX
                               && el === ctx
                    ){
                        return el;
                    }
                    if(el === ctx){
                        break;
                    }
                    /* jshint boss:true */
                }while(el=getParentOrHost( el ));
            }
            return null;
        }
        var R_SPACE=/\s+/g;
        function toggleClass( el , name , state ){
            if(el && name){
                if(el.classList){
                    /*
                      el.classList[state ? 'add' : 'remove'](name);
                    */
                    if(state){
                        el.classList.add( name );
                    }else{
                        el.classList.remove( name );
                    }
                }else{
                    var className=(' ' + el.className + ' ').replace( R_SPACE , ' ' ).replace( ' ' + name + ' ' , ' ' );
                    el.className=(className + (state ? ( ' ' + name ) : ( '' ))).replace( R_SPACE , ' ' );
                }
            }
        }
        function css( el , prop , val ){
            var style=el && el.style;
            if(style){
                if(val === void( 0 )){
                    if(document.defaultView && document.defaultView.getComputedStyle){
                        val=document.defaultView.getComputedStyle( el , '' );
                    }else if(el.currentStyle){
                        val=el.currentStyle;
                    }
                    return(prop === void( 0 ) ? ( val ) : ( val[prop] ));
                }else{
                    if(!(prop in style) && prop.indexOf( 'webkit' ) === -1){
                        prop='-webkit-' + prop;
                    }
                    style[prop]=val + ( typeof val === 'string' ? ( '' ) : ( 'px' ));
                }
            }
        }
        function matrix( el , selfOnly ){
            var appliedTransforms='';
            if( typeof el === 'string'){
                appliedTransforms=el;
            }else{
                do{
                    var transform=css( el , 'transform' );
                    if(transform && transform !== 'none'){
                        appliedTransforms=transform + ' ' + appliedTransforms;
                    }
                    /* jshint boss:true */
                }while(!selfOnly && (el=el.parentNode));
            }
            var matrixFn=window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
            /* jshint -W056 */
            return(matrixFn && (new matrixFn( appliedTransforms )));
        }
        function find( ctx , tagName , iterator ){
            if(ctx){
                var list=ctx.getElementsByTagName( tagName );
                var i=0;
                var n=list.length;
                if(iterator){
                    for(  ; i < n ; i++ ){
                        iterator( list[i] , i );
                    }
                }
                return list;
            }
            return [];
        }
        function getWindowScrollingElement(){
            var scrollingElement=document.scrollingElement;
            if(scrollingElement){
                return scrollingElement;
            }else{
                return document.documentElement;
            }
        }
        /*#
          * Returns the "bounding client rect" of given element
          * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
          * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
          * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
          * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
          * @param  {[HTMLElement]} container              The parent the element will be placed in
          * @return {Object}                               The boundingClientRect of el, with specified adjustments
        */
        function getRect( el , relativeToContainingBlock , relativeToNonStaticParent , undoScale , container ){
            if(!el.getBoundingClientRect && el !== window){
                return;
            }
            var elRect;
            var top;
            var left;
            var bottom;
            var right;
            var height;
            var width;
            if(el !== window && el.parentNode && el !== getWindowScrollingElement()){
                elRect=el.getBoundingClientRect();
                top=elRect.top;
                left=elRect.left;
                bottom=elRect.bottom;
                right=elRect.right;
                height=elRect.height;
                width=elRect.width;
            }else{
                top=0;
                left=0;
                bottom=window.innerHeight;
                right=window.innerWidth;
                height=window.innerHeight;
                width=window.innerWidth;
            }
            if((relativeToContainingBlock || relativeToNonStaticParent) && el !== window){
                container=container || el.parentNode;
                if(!IE11OrLess){
                    do{
                        if(container
                               && container.getBoundingClientRect
                               && (css( container , 'transform' ) !== 'none'
                                   || relativeToNonStaticParent
                                       && css( container , 'position' ) !== 'static')
                        ){
                            var containerRect=container.getBoundingClientRect();
                            top-=containerRect.top + parseInt( css( container , 'border-top-width' ) );
                            left-=containerRect.left + parseInt( css( container , 'border-left-width' ) );
                            bottom=top + elRect.height;
                            right=left + elRect.width;
                            break;
                        }
                        /* jshint boss:true */
                    }while(container=container.parentNode);
                }
            }
            if(undoScale && el !== window){
                var elMatrix=matrix( container || el );
                var scaleX=elMatrix && elMatrix.a;
                var scaleY=elMatrix && elMatrix.d;
                if(elMatrix){
                    top/=scaleY;
                    left/=scaleX;
                    width/=scaleX;
                    height/=scaleY;
                    bottom=top + height;
                    right=left + width;
                }
            }
            return({
                    "top" : top ,
                    "left" : left ,
                    "bottom" : bottom ,
                    "right" : right ,
                    "width" : width ,
                    "height" : height
                });
        }
        /*#
          * Checks if a side of an element is scrolled past a side of its parents
          * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
          * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
          * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
          * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
        */
        function isScrolledPast( el , elSide , parentSide ){
            var parent=getParentAutoScrollElement( el , true );
            var elSideVal=getRect( el )[elSide];
            /* jshint boss:true */
            while(parent){
                var parentSideVal=getRect( parent )[parentSide];
                var visible=void( 0 );
                if(parentSide === 'top' || parentSide === 'left'){
                    visible=elSideVal >= parentSideVal;
                }else{
                    visible=elSideVal <= parentSideVal;
                }
                if(!visible){
                    return parent;
                }
                if(parent === getWindowScrollingElement()){
                    break;
                }
                parent=getParentAutoScrollElement( parent , false );
            }
            return false;
        }
        /*#
          * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
          * and non-draggable elements
          * @param  {HTMLElement} el       The parent element
          * @param  {Number} childNum      The index of the child
          * @param  {Object} options       Parent Sortable's options
          * @return {HTMLElement}          The child at index childNum, or null if not found
        */
        function getChild( el , childNum , options , includeDragEl ){
            var currentChild=0;
            var i=0;
            var children=el.children;
            while(i < children.length){
                if(children[i].style.display !== 'none'
                       && children[i] !== Sortable.ghost
                       && (includeDragEl
                           || children[i] !== Sortable.dragged)
                       && closest( children[i] , options.draggable , el , false )
                ){
                    if(currentChild === childNum){
                        return children[i];
                    }
                    currentChild++;
                }
                i++;
            }
            return null;
        }
        /*#
          * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
          * @param  {HTMLElement} el       Parent element
          * @param  {selector} selector    Any other elements that should be ignored
          * @return {HTMLElement}          The last child, ignoring ghostEl
        */
        function lastChild( el , selector ){
            var last=el.lastElementChild;
            while(last && (last === Sortable.ghost || css( last , 'display' ) === 'none' || selector && !matches( last , selector ))){
                last=last.previousElementSibling;
            }
            return(last || null);
        }
        /*#
          * Returns the index of an element within its parent for a selected set of
          * elements
          * @param  {HTMLElement} el
          * @param  {selector} selector
          * @return {number}
        */
        function index( el , selector ){
            var index=0;
            if(!el || !el.parentNode){
                return -1;
            }
            /* jshint boss:true */
            while(el=el.previousElementSibling){
                if(el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches( el , selector ))){
                    index++;
                }
            }
            return index;
        }
        /*#
          * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
          * The value is returned in real pixels.
          * @param  {HTMLElement} el
          * @return {Array}             Offsets in the format of [left, top]
        */
        function getRelativeScrollOffset( el ){
            var offsetLeft=0;
            var offsetTop=0;
            var winScroller=getWindowScrollingElement();
            if(el){
                do{
                    var elMatrix=matrix( el );
                    var scaleX=elMatrix.a;
                    var scaleY=elMatrix.d;
                    offsetLeft+=el.scrollLeft * scaleX;
                    offsetTop+=el.scrollTop * scaleY;
                }while(el !== winScroller && (el=el.parentNode));
            }
            return([offsetLeft,offsetTop]);
        }
        /*#
          * Returns the index of the object within the given array
          * @param  {Array} arr   Array that may or may not hold the object
          * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
          * @return {Number}      The index of the object in the array, or -1
        */
        function indexOfObject( arr , obj ){
            for(var i in arr){
                if(!arr.hasOwnProperty( i )){
                    continue;
                }
                for(var key in obj){
                    if(obj.hasOwnProperty( key ) && obj[key] === arr[i][key]){
                        return(Number( i ));
                    }
                }
            }
            return -1;
        }
        function getParentAutoScrollElement( el , includeSelf ){
            if(!el || !el.getBoundingClientRect){
                return(getWindowScrollingElement());
            }
            var elem=el;
            var gotSelf=false;
            do{
                if(elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight){
                    var elemCSS=css( elem );
                    if(elem.clientWidth < elem.scrollWidth
                               && (elemCSS.overflowX == 'auto'
                                   || elemCSS.overflowX == 'scroll')
                           || elem.clientHeight < elem.scrollHeight
                               && (elemCSS.overflowY == 'auto'
                                   || elemCSS.overflowY == 'scroll')
                    ){
                        if(!elem.getBoundingClientRect || elem === document.body){
                            return(getWindowScrollingElement());
                        }
                        if(gotSelf || includeSelf){
                            return elem;
                        }
                        gotSelf=true;
                    }
                }
                /* jshint boss:true */
            }while(elem=elem.parentNode);
            return(getWindowScrollingElement());
        }
        function extend( dst , src ){
            if(dst && src){
                for(var key in src){
                    if(src.hasOwnProperty( key )){
                        dst[key]=src[key];
                    }
                }
            }
            return dst;
        }
        function isRectEqual( rect1 , rect2 ){
            return(Math.round( rect1.top ) === Math.round( rect2.top ) && Math.round( rect1.left ) === Math.round( rect2.left ) && Math.round( rect1.height ) === Math.round( rect2.height ) && Math.round( rect1.width ) === Math.round( rect2.width ));
        }
        var _throttleTimeout;
        function throttle( callback , ms ){
            return(function(){
                    if(!_throttleTimeout){
                        var args=arguments;
                        var _this=this;
                        if(args.length === 1){
                            callback.call( _this , args[0] );
                        }else{
                            callback.apply( _this , args );
                        }
                        _throttleTimeout=setTimeout( function(){
                            _throttleTimeout=void( 0 );
                        } , ms );
                    }
                });
        }
        function cancelThrottle(){
            clearTimeout( _throttleTimeout );
            _throttleTimeout=void( 0 );
        }
        function scrollBy( el , x , y ){
            el.scrollLeft+=x;
            el.scrollTop+=y;
        }
        function clone( el ){
            var Polymer=window.Polymer;
            var $=window.jQuery || window.Zepto;
            if(Polymer && Polymer.dom){
                return(Polymer.dom( el ).cloneNode( true ));
            }else if($){
                return($( el ).clone( true )[0]);
            }else{
                return(el.cloneNode( true ));
            }
        }
        function setRect( el , rect ){
            css( el , 'position' , 'absolute' );
            css( el , 'top' , rect.top );
            css( el , 'left' , rect.left );
            css( el , 'width' , rect.width );
            css( el , 'height' , rect.height );
        }
        function unsetRect( el ){
            css( el , 'position' , '' );
            css( el , 'top' , '' );
            css( el , 'left' , '' );
            css( el , 'width' , '' );
            css( el , 'height' , '' );
        }
        function getChildContainingRectFromElement( container , options , ghostEl ){
            var rect={};
            Array.from( container.children ).forEach( function( child ){
                    var _rect$left;
                    var _rect$top;
                    var _rect$right;
                    var _rect$bottom;
                    if(!closest( child , options.draggable , container , false ) || child.animated || child === ghostEl){
                        return;
                    }
                    var childRect=getRect( child );
                    rect.left=Math.min( (_rect$left=rect.left) !== null && _rect$left !== void( 0 ) ? ( _rect$left ) : ( Infinity ) , childRect.left );
                    rect.top=Math.min( (_rect$top=rect.top) !== null && _rect$top !== void( 0 ) ? ( _rect$top ) : ( Infinity ) , childRect.top );
                    rect.right=Math.max( (_rect$right=rect.right) !== null && _rect$right !== void( 0 ) ? ( _rect$right ) : ( -Infinity ) , childRect.right );
                    rect.bottom=Math.max( (_rect$bottom=rect.bottom) !== null && _rect$bottom !== void( 0 ) ? ( _rect$bottom ) : ( -Infinity ) , childRect.bottom );
                } );
            rect.width=rect.right - rect.left;
            rect.height=rect.bottom - rect.top;
            rect.x=rect.left;
            rect.y=rect.top;
            return rect;
        }
        var expando='Sortable' + new Date().getTime();
        function AnimationStateManager(){
            var animationStates=[];
            var animationCallbackId;
            return({
                    "captureAnimationState" : function captureAnimationState(){
                        animationStates=[];
                        if(!this.options.animation){
                            return;
                        }
                        var children=[].slice.call( this.el.children );
                        children.forEach( function( child ){
                                if(css( child , 'display' ) === 'none' || child === Sortable.ghost){
                                    return;
                                }
                                animationStates.push( {"target" : child ,"rect" : getRect( child )} );
                                var fromRect=_objectSpread2( {} , animationStates[animationStates.length - 1].rect );
                                if(child.thisAnimationDuration){
                                    var childMatrix=matrix( child , true );
                                    if(childMatrix){
                                        fromRect.top-=childMatrix.f;
                                        fromRect.left-=childMatrix.e;
                                    }
                                }
                                child.fromRect=fromRect;
                            } );
                    } ,
                    "addAnimationState" : function addAnimationState( state ){
                        animationStates.push( state );
                    } ,
                    "removeAnimationState" : function removeAnimationState( target ){
                        animationStates.splice( indexOfObject( animationStates , {"target" : target} ) , 1 );
                    } ,
                    "animateAll" : function animateAll( callback ){
                        var _this=this;
                        if(!this.options.animation){
                            clearTimeout( animationCallbackId );
                            if( typeof callback === 'function'){
                                callback();
                            }
                            return;
                        }
                        var animating=false;
                        var animationTime=0;
                        animationStates.forEach( function( state ){
                                var time=0;
                                var target=state.target;
                                var fromRect=target.fromRect;
                                var toRect=getRect( target );
                                var prevFromRect=target.prevFromRect;
                                var prevToRect=target.prevToRect;
                                var animatingRect=state.rect;
                                var targetMatrix=matrix( target , true );
                                if(targetMatrix){
                                    toRect.top-=targetMatrix.f;
                                    toRect.left-=targetMatrix.e;
                                }
                                target.toRect=toRect;
                                if(target.thisAnimationDuration){
                                    if(isRectEqual( prevFromRect , toRect )
                                           && !isRectEqual( fromRect , toRect )
                                           && (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)
                                    ){
                                        time=calculateRealTime( animatingRect , prevFromRect , prevToRect , _this.options );
                                    }
                                }
                                if(!isRectEqual( toRect , fromRect )){
                                    target.prevFromRect=fromRect;
                                    target.prevToRect=toRect;
                                    if(!time){
                                        time=_this.options.animation;
                                    }
                                    _this.animate( target , animatingRect , toRect , time );
                                }
                                if(time){
                                    animating=true;
                                    animationTime=Math.max( animationTime , time );
                                    clearTimeout( target.animationResetTimer );
                                    target.animationResetTimer=setTimeout( function(){
                                        target.animationTime=0;
                                        target.prevFromRect=null;
                                        target.fromRect=null;
                                        target.prevToRect=null;
                                        target.thisAnimationDuration=null;
                                    } , time );
                                    target.thisAnimationDuration=time;
                                }
                            } );
                        clearTimeout( animationCallbackId );
                        if(!animating){
                            if( typeof callback === 'function'){
                                callback();
                            }
                        }else{
                            animationCallbackId=setTimeout( function(){
                                if( typeof callback === 'function'){
                                    callback();
                                }
                            } , animationTime );
                        }
                        animationStates=[];
                    } ,
                    "animate" : function animate( target , currentRect , toRect , duration ){
                        if(duration){
                            css( target , 'transition' , '' );
                            css( target , 'transform' , '' );
                            var elMatrix=matrix( this.el );
                            var scaleX=elMatrix && elMatrix.a;
                            var scaleY=elMatrix && elMatrix.d;
                            var translateX=(currentRect.left - toRect.left) / (scaleX || 1);
                            var translateY=(currentRect.top - toRect.top) / (scaleY || 1);
                            target.animatingX=!!translateX;
                            target.animatingY=!!translateY;
                            css( target , 'transform' , 'translate3d(' + translateX + 'px,' + translateY + 'px,0)' );
                            this.forRepaintDummy=repaint( target );
                            css( target , 'transition' , 'transform ' + duration + 'ms' + (this.options.easing ? ( ' ' + this.options.easing ) : ( '' )) );
                            css( target , 'transform' , 'translate3d(0,0,0)' );
                             typeof target.animated === 'number' && clearTimeout( target.animated );
                            target.animated=setTimeout( function(){
                                css( target , 'transition' , '' );
                                css( target , 'transform' , '' );
                                target.animated=false;
                                target.animatingX=false;
                                target.animatingY=false;
                            } , duration );
                        }
                    }
                });
        }
        function repaint( target ){
            return target.offsetWidth;
        }
        function calculateRealTime( animatingRect , fromRect , toRect , options ){
            return((Math.sqrt( Math.pow( fromRect.top - animatingRect.top , 2 ) + Math.pow( fromRect.left - animatingRect.left , 2 ) ) / Math.sqrt( Math.pow( fromRect.top - toRect.top , 2 ) + Math.pow( fromRect.left - toRect.left , 2 ) )) * options.animation);
        }
        var plugins=[];
        var defaults={"initializeByDefault" : true};
        var PluginManager={
            "mount" : function mount( plugin ){
                for(var option in defaults){
                    if(defaults.hasOwnProperty( option ) && !(option in plugin)){
                        plugin[option]=defaults[option];
                    }
                }
                plugins.forEach( function( p ){
                        if(p.pluginName === plugin.pluginName){
                            throw "Sortable: Cannot mount plugin ".concat( plugin.pluginName , " more than once" );
                        }
                    } );
                plugins.push( plugin );
            } ,
            "pluginEvent" : function pluginEvent( eventName , sortable , evt ){
                var _this=this;
                this.eventCanceled=false;
                evt.cancel=function(){
                    _this.eventCanceled=true;
                };
                var eventNameGlobal=eventName + 'Global';
                /* console.log('hugues eventNameGlobal=',eventNameGlobal , 'eventName="' + eventName+'"'); */
                plugins.forEach( function( plugin ){
                        if(!sortable[plugin.pluginName]){
                            return;
                        }
                        if(sortable[plugin.pluginName][eventNameGlobal]){
                            sortable[plugin.pluginName][eventNameGlobal]( _objectSpread2( {"sortable" : sortable} , evt ) );
                        }
                        if(sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]){
                            sortable[plugin.pluginName][eventName]( _objectSpread2( {"sortable" : sortable} , evt ) );
                        }
                    } );
            } ,
            "initializePlugins" : function initializePlugins( sortable , el , defaults , options ){
                plugins.forEach( function( plugin ){
                        var pluginName=plugin.pluginName;
                        if(!sortable.options[pluginName] && !plugin.initializeByDefault){
                            return;
                        }
                        var initialized=new plugin( sortable , el , sortable.options );
                        initialized.sortable=sortable;
                        initialized.options=sortable.options;
                        sortable[pluginName]=initialized;
                        _extends( defaults , initialized.defaults );
                    } );
                for(var option in sortable.options){
                    if(!sortable.options.hasOwnProperty( option )){
                        continue;
                    }
                    var modified=this.modifyOption( sortable , option , sortable.options[option] );
                    if( typeof modified !== 'undefined'){
                        sortable.options[option]=modified;
                    }
                }
            } ,
            "getEventProperties" : function getEventProperties( name , sortable ){
                var eventProperties={};
                plugins.forEach( function( plugin ){
                        if( typeof plugin.eventProperties !== 'function'){
                            return;
                        }
                        _extends( eventProperties , plugin.eventProperties.call( sortable[plugin.pluginName] , name ) );
                    } );
                return eventProperties;
            } ,
            "modifyOption" : function modifyOption( sortable , name , value ){
                var modifiedValue;
                plugins.forEach( function( plugin ){
                        if(!sortable[plugin.pluginName]){
                            return;
                        }
                        if(plugin.optionListeners &&  typeof plugin.optionListeners[name] === 'function'){
                            modifiedValue=plugin.optionListeners[name].call( sortable[plugin.pluginName] , value );
                        }
                    } );
                return modifiedValue;
            }
        };
        function dispatchEvent( _ref ){
            var sortable=_ref.sortable;
            var rootEl=_ref.rootEl;
            var name=_ref.name;
            var targetEl=_ref.targetEl;
            var cloneEl=_ref.cloneEl;
            var toEl=_ref.toEl;
            var fromEl=_ref.fromEl;
            var oldIndex=_ref.oldIndex;
            var newIndex=_ref.newIndex;
            var oldDraggableIndex=_ref.oldDraggableIndex;
            var newDraggableIndex=_ref.newDraggableIndex;
            var originalEvent=_ref.originalEvent;
            var putSortable=_ref.putSortable;
            var extraEventProperties=_ref.extraEventProperties;
            sortable=sortable || rootEl && rootEl[expando];
            if(!sortable){
                return;
            }
            var evt;
            var options=sortable.options;
            var onName='on' + name.charAt( 0 ).toUpperCase() + name.substr( 1 );
            if(window.CustomEvent && !IE11OrLess && !Edge){
                evt=new CustomEvent( name , {"bubbles" : true ,"cancelable" : true} );
            }else{
                evt=document.createEvent( 'Event' );
                evt.initEvent( name , true , true );
            }
            evt.to=toEl || rootEl;
            evt.from=fromEl || rootEl;
            evt.item=targetEl || rootEl;
            evt.clone=cloneEl;
            evt.oldIndex=oldIndex;
            evt.newIndex=newIndex;
            evt.oldDraggableIndex=oldDraggableIndex;
            evt.newDraggableIndex=newDraggableIndex;
            evt.originalEvent=originalEvent;
            evt.pullMode=putSortable ? ( putSortable.lastPutMode ) : ( undefined );
            var allEventProperties=_objectSpread2( _objectSpread2( {} , extraEventProperties ) , PluginManager.getEventProperties( name , sortable ) );
            for(var option in allEventProperties){
                evt[option]=allEventProperties[option];
            }
            if(rootEl){
                rootEl.dispatchEvent( evt );
            }
            if(options[onName]){
                options[onName].call( sortable , evt );
            }
        }
        var _excluded=["evt"];
        var pluginEvent=function pluginEvent( eventName , sortable ){
            var _ref=arguments.length > 2 && arguments[2] !== undefined ? ( arguments[2] ) : ( {} );
            var originalEvent=_ref.evt;
            var data=_objectWithoutProperties( _ref , _excluded );
            PluginManager.pluginEvent.bind( Sortable )( eventName , sortable , _objectSpread2( {
                    "dragEl" : dragEl ,
                    "parentEl" : parentEl ,
                    "ghostEl" : ghostEl ,
                    "rootEl" : rootEl ,
                    "nextEl" : nextEl ,
                    "lastDownEl" : lastDownEl ,
                    "cloneEl" : cloneEl ,
                    "cloneHidden" : cloneHidden ,
                    "dragStarted" : moved ,
                    "putSortable" : putSortable ,
                    "activeSortable" : Sortable.active ,
                    "originalEvent" : originalEvent ,
                    "oldIndex" : oldIndex ,
                    "oldDraggableIndex" : oldDraggableIndex ,
                    "newIndex" : newIndex ,
                    "newDraggableIndex" : newDraggableIndex ,
                    "hideGhostForTarget" : _hideGhostForTarget ,
                    "unhideGhostForTarget" : _unhideGhostForTarget ,
                    "cloneNowHidden" : function cloneNowHidden(){
                        cloneHidden=true;
                    } ,
                    "cloneNowShown" : function cloneNowShown(){
                        cloneHidden=false;
                    } ,
                    "dispatchSortableEvent" : function dispatchSortableEvent( name ){
                        _dispatchEvent( {"sortable" : sortable ,"name" : name ,"originalEvent" : originalEvent} );
                    }
                } , data ) );
        };
        function _dispatchEvent( info ){
            dispatchEvent( _objectSpread2( {
                    "putSortable" : putSortable ,
                    "cloneEl" : cloneEl ,
                    "targetEl" : dragEl ,
                    "rootEl" : rootEl ,
                    "oldIndex" : oldIndex ,
                    "oldDraggableIndex" : oldDraggableIndex ,
                    "newIndex" : newIndex ,
                    "newDraggableIndex" : newDraggableIndex
                } , info ) );
        }
        var dragEl;
        var parentEl;
        var ghostEl;
        var rootEl;
        var nextEl;
        var lastDownEl;
        var cloneEl;
        var cloneHidden;
        var oldIndex;
        var newIndex;
        var oldDraggableIndex;
        var newDraggableIndex;
        var activeGroup;
        var putSortable;
        var awaitingDragStarted=false;
        var ignoreNextClick=false;
        var sortables=[];
        var tapEvt;
        var touchEvt;
        var lastDx;
        var lastDy;
        var tapDistanceLeft;
        var tapDistanceTop;
        var moved;
        var lastTarget;
        var lastDirection;
        var pastFirstInvertThresh=false;
        var isCircumstantialInvert=false;
        var targetMoveDistance;
        var ghostRelativeParent;
        var ghostRelativeParentInitialScroll=[];
        var _silent=false;
        var savedInputChecked=[];
        /* # @const */
        var documentExists= typeof document !== 'undefined';
        var PositionGhostAbsolutely=IOS;
        var CSSFloatProperty=Edge || IE11OrLess ? ( 'cssFloat' ) : ( 'float' );
        var supportDraggable=documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement( 'div' );
        var supportCssPointerEvents=(function(){
            if(!documentExists){
                return;
            }
            if(IE11OrLess){
                return false;
            }
            var el=document.createElement( 'x' );
            el.style.cssText='pointer-events:auto';
            return(el.style.pointerEvents === 'auto');
    })();
        var _detectDirection=function _detectDirection( el , options ){
            var elCSS=css( el );
            var elWidth=parseInt( elCSS.width ) - parseInt( elCSS.paddingLeft ) - parseInt( elCSS.paddingRight ) - parseInt( elCSS.borderLeftWidth ) - parseInt( elCSS.borderRightWidth );
            var child1=getChild( el , 0 , options );
            var child2=getChild( el , 1 , options );
            var firstChildCSS=child1 && css( child1 );
            var secondChildCSS=child2 && css( child2 );
            var firstChildWidth=firstChildCSS && parseInt( firstChildCSS.marginLeft ) + parseInt( firstChildCSS.marginRight ) + getRect( child1 ).width;
            var secondChildWidth=secondChildCSS && parseInt( secondChildCSS.marginLeft ) + parseInt( secondChildCSS.marginRight ) + getRect( child2 ).width;
            if(elCSS.display === 'flex'){
                return(elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? ( 'vertical' ) : ( 'horizontal' ));
            }
            if(elCSS.display === 'grid'){
                return(elCSS.gridTemplateColumns.split( ' ' ).length <= 1 ? ( 'vertical' ) : ( 'horizontal' ));
            }
            if(child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none'){
                var touchingSideChild2=firstChildCSS["float"] === 'left' ? ( 'left' ) : ( 'right' );
                return(child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? ( 'vertical' ) : ( 'horizontal' ));
            }
            return(child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? ( 'vertical' ) : ( 'horizontal' ));
        };
        var _dragElInRowColumn=function _dragElInRowColumn( dragRect , targetRect , vertical ){
            var dragElS1Opp=vertical ? ( dragRect.left ) : ( dragRect.top );
            var dragElS2Opp=vertical ? ( dragRect.right ) : ( dragRect.bottom );
            var dragElOppLength=vertical ? ( dragRect.width ) : ( dragRect.height );
            var targetS1Opp=vertical ? ( targetRect.left ) : ( targetRect.top );
            var targetS2Opp=vertical ? ( targetRect.right ) : ( targetRect.bottom );
            var targetOppLength=vertical ? ( targetRect.width ) : ( targetRect.height );
            return(dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2);
        };
        /*#
          * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
          * @param  {Number} x      X position
          * @param  {Number} y      Y position
          * @return {HTMLElement}   Element of the first found nearest Sortable
        */
        var _detectNearestEmptySortable=function _detectNearestEmptySortable( x , y ){
            var ret;
            sortables.some( function( sortable ){
                    var threshold=sortable[expando].options.emptyInsertThreshold;
                    if(!threshold || lastChild( sortable )){
                        return;
                    }
                    var rect=getRect( sortable );
                    var insideHorizontally=x >= rect.left - threshold && x <= rect.right + threshold;
                    var insideVertically=y >= rect.top - threshold && y <= rect.bottom + threshold;
                    if(insideHorizontally && insideVertically){
                        return(ret=sortable);
                    }
                } );
            return ret;
        };
        var _prepareGroup=function _prepareGroup( options ){
            function toFn( value , pull ){
                return(function( to , from , dragEl , evt ){
                        var sameGroup=to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
                        if(value == null && (pull || sameGroup)){
                            return true;
                        }else if(value == null || value === false){
                            return false;
                        }else if(pull && value === 'clone'){
                            return value;
                        }else if( typeof value === 'function'){
                            return(toFn( value( to , from , dragEl , evt ) , pull )( to , from , dragEl , evt ));
                        }else{
                            var otherGroup=pull ? ( to.options.group.name ) : ( from.options.group.name );
                            return(value === true ||  typeof value === 'string' && value === otherGroup || value.join && value.indexOf( otherGroup ) > -1);
                        }
                    });
            }
            var group={};
            var originalGroup=options.group;
            if(!originalGroup || _typeof( originalGroup ) != 'object'){
                originalGroup={"name" : originalGroup};
            }
            group.name=originalGroup.name;
            group.checkPull=toFn( originalGroup.pull , true );
            group.checkPut=toFn( originalGroup.put );
            group.revertClone=originalGroup.revertClone;
            options.group=group;
        };
        var _hideGhostForTarget=function _hideGhostForTarget(){
            if(!supportCssPointerEvents && ghostEl){
                css( ghostEl , 'display' , 'none' );
            }
        };
        var _unhideGhostForTarget=function _unhideGhostForTarget(){
            if(!supportCssPointerEvents && ghostEl){
                css( ghostEl , 'display' , '' );
            }
        };
        if(documentExists && !ChromeForAndroid){
            document.addEventListener( 'click' , function( evt ){
                    if(ignoreNextClick){
                        evt.preventDefault();
                        evt.stopPropagation && evt.stopPropagation();
                        evt.stopImmediatePropagation && evt.stopImmediatePropagation();
                        ignoreNextClick=false;
                        return false;
                    }
                } , true );
        }
        var nearestEmptyInsertDetectEvent=function nearestEmptyInsertDetectEvent( evt ){
            if(dragEl){
                evt=evt.touches ? ( evt.touches[0] ) : ( evt );
                var nearest=_detectNearestEmptySortable( evt.clientX , evt.clientY );
                if(nearest){
                    var event={};
                    for(var i in evt){
                        if(evt.hasOwnProperty( i )){
                            event[i]=evt[i];
                        }
                    }
                    event.target=event.rootEl=nearest;
                    event.preventDefault=void( 0 );
                    event.stopPropagation=void( 0 );
                    nearest[expando][_onDragOver]( event );
                }
            }
        };
        var _checkOutsideTargetEl=function _checkOutsideTargetEl( evt ){
            if(dragEl){
                try{
                    dragEl.parentNode[expando][_isOutsideThisEl]( evt.target );
                }catch(e){}
                /* un point virgule est-il en trop ? */
            }
        };
        /*#
          * @class  Sortable
          * @param  {HTMLElement}  el
          * @param  {Object}       [options]
        */
        function Sortable( el , options ){
            if(!(el && el.nodeType && el.nodeType === 1)){
                throw "Sortable: `el` must be an HTMLElement, not ".concat( {}.toString.call( el ) );
            }
            this.el=el;
            this.options=options=_extends( {} , options );
            el[expando]=this;
            var defaults={
                "group" : null ,
                "sort" : true ,
                "disabled" : false ,
                "store" : null ,
                "handle" : null ,
                "draggable" : /^[uo]l$/i.test( el.nodeName ) ? ( '>li' ) : ( '>*' ) ,
                "swapThreshold" : 1 ,
                "invertSwap" : false ,
                "invertedSwapThreshold" : null ,
                "removeCloneOnHide" : true ,
                "direction" : function direction(){
                    return(_detectDirection( el , this.options ));
                } ,
                "ghostClass" : 'sortable-ghost' ,
                "chosenClass" : 'sortable-chosen' ,
                "dragClass" : 'sortable-drag' ,
                "ignore" : 'a, img' ,
                "filter" : null ,
                "preventOnFilter" : true ,
                "animation" : 0 ,
                "easing" : null ,
                "setData" : function setData( dataTransfer , dragEl ){
                    dataTransfer.setData( 'Text' , dragEl.textContent );
                } ,
                "dropBubble" : false ,
                "dragoverBubble" : false ,
                "dataIdAttr" : 'data-id' ,
                "delay" : 0 ,
                "delayOnTouchOnly" : false ,
                "touchStartThreshold" : (Number.parseInt ? ( Number.parseInt( window.devicePixelRatio , 10 ) ) : ( window.parseInt( window.devicePixelRatio , 10 ) )) || 1 ,
                "forceFallback" : false ,
                "fallbackClass" : 'sortable-fallback' ,
                "fallbackOnBody" : false ,
                "fallbackTolerance" : 0 ,
                "fallbackOffset" : {"x" : 0 ,"y" : 0} ,
                "supportPointer" : Sortable.supportPointer !== false && 'PointerEvent' in window && !Safari ,
                "emptyInsertThreshold" : 5
            };
            PluginManager.initializePlugins( this , el , defaults );
            for(var name in defaults){
                !(name in options) && (options[name]=defaults[name]);
            }
            _prepareGroup( options );
            for(var fn in this){
                if(fn.charAt( 0 ) === '_' &&  typeof this[fn] === 'function'){
                    this[fn]=this[fn].bind( this );
                }
            }
            this.nativeDraggable=options.forceFallback ? ( false ) : ( supportDraggable );
            if(this.nativeDraggable){
                this.options.touchStartThreshold=1;
            }
            if(options.supportPointer){
                on( el , 'pointerdown' , this._onTapStart );
            }else{
                on( el , 'mousedown' , this._onTapStart );
                on( el , 'touchstart' , this._onTapStart );
            }
            if(this.nativeDraggable){
                on( el , 'dragover' , this );
                on( el , 'dragenter' , this );
            }
            sortables.push( this.el );
            options.store && options.store.get && this.sort( options.store.get( this ) || [] );
            _extends( this , AnimationStateManager() );
        }
        Sortable.prototype={
             /* # @lends Sortable.prototype */
            "constructor" : Sortable ,
            "_isOutsideThisEl" : function _isOutsideThisEl( target ){
                if(!this.el.contains( target ) && target !== this.el){
                    lastTarget=null;
                }
            } ,
            "_getDirection" : function _getDirection( evt , target ){
                return( typeof this.options.direction === 'function' ?
                      ( 
                        this.options.direction.call( this , evt , target , dragEl )
                      ) : ( 
                        this.options.direction
                      ));
            } ,
            "_onTapStart" : function _onTapStart( /* Event|TouchEvent */ evt ){
                if(!evt.cancelable){
                    return;
                }
                var _this=this;
                var el=this.el;
                var options=this.options;
                var preventOnFilter=options.preventOnFilter;
                var type=evt.type;
                var touch=evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt;
                var target=touch.target || evt.target;
                var originalTarget=evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target;
                var filter=options.filter;
                _saveInputCheckedState( el );
                if(dragEl){
                    return;
                }
                if(/mousedown|pointerdown/.test( type ) && evt.button !== 0 || options.disabled){
                    return;
                }
                if(originalTarget.isContentEditable){
                    return;
                }
                if(!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT'){
                    return;
                }
                target=closest( target , options.draggable , el , false );
                if(target && target.animated){
                    return;
                }
                if(lastDownEl === target){
                    return;
                }
                oldIndex=index( target );
                oldDraggableIndex=index( target , options.draggable );
                if( typeof filter === 'function'){
                    if(filter.call( this , evt , target , this )
                    ){
                        _dispatchEvent( {
                                "sortable" : _this ,
                                "rootEl" : originalTarget ,
                                "name" : 'filter' ,
                                "targetEl" : target ,
                                "toEl" : el ,
                                "fromEl" : el
                            } );
                        pluginEvent( 'filter' , _this , {"evt" : evt} );
                        preventOnFilter && evt.cancelable && evt.preventDefault();
                        return;
                    }
                }else if(filter){
                    filter=filter.split( ',' ).some( function( criteria ){
                        criteria=closest( originalTarget , criteria.trim() , el , false );
                        if(criteria){
                            _dispatchEvent( {
                                    "sortable" : _this ,
                                    "rootEl" : criteria ,
                                    "name" : 'filter' ,
                                    "targetEl" : target ,
                                    "fromEl" : el ,
                                    "toEl" : el
                                } );
                            pluginEvent( 'filter' , _this , {"evt" : evt} );
                            return true;
                        }
                    } );
                    if(filter){
                        preventOnFilter && evt.cancelable && evt.preventDefault();
                        return;
                    }
                }
                if(options.handle && !closest( originalTarget , options.handle , el , false )){
                    return;
                }
                this._prepareDragStart( evt , touch , target );
            } ,
            "_prepareDragStart" : function _prepareDragStart( /* Event */ evt ,  /* Touch */ touch ,  /* # HTMLElement */ target ){
                var _this=this;
                var el=_this.el;
                var options=_this.options;
                var ownerDocument=el.ownerDocument;
                var dragStartFn;
                if(target && !dragEl && target.parentNode === el){
                    var dragRect=getRect( target );
                    rootEl=el;
                    dragEl=target;
                    parentEl=dragEl.parentNode;
                    nextEl=dragEl.nextSibling;
                    lastDownEl=target;
                    activeGroup=options.group;
                    Sortable.dragged=dragEl;
                    tapEvt={"target" : dragEl ,"clientX" : touch.clientX || evt.clientX ,"clientY" : touch.clientY || evt.clientY};
                    tapDistanceLeft=tapEvt.clientX - dragRect.left;
                    tapDistanceTop=tapEvt.clientY - dragRect.top;
                    this._lastX=touch.clientX || evt.clientX;
                    this._lastY=touch.clientY || evt.clientY;
                    dragEl.style['will-change']='all';
                    dragStartFn=function dragStartFn(){
                        pluginEvent( 'delayEnded' , _this , {"evt" : evt} );
                        if(Sortable.eventCanceled){
                            _this._onDrop();
                            return;
                        }
                        _this._disableDelayedDragEvents();
                        if(!FireFox && _this.nativeDraggable){
                            dragEl.draggable=true;
                        }
                        _this._triggerDragStart( evt , touch );
                        _dispatchEvent( {"sortable" : _this ,"name" : 'choose' ,"originalEvent" : evt} );
                        toggleClass( dragEl , options.chosenClass , true );
                    };
                    options.ignore.split( ',' ).forEach( function( criteria ){
                            find( dragEl , criteria.trim() , _disableDraggable );
                        } );
                    on( ownerDocument , 'dragover' , nearestEmptyInsertDetectEvent );
                    on( ownerDocument , 'mousemove' , nearestEmptyInsertDetectEvent );
                    on( ownerDocument , 'touchmove' , nearestEmptyInsertDetectEvent );
                    on( ownerDocument , 'mouseup' , _this._onDrop );
                    on( ownerDocument , 'touchend' , _this._onDrop );
                    on( ownerDocument , 'touchcancel' , _this._onDrop );
                    if(FireFox && this.nativeDraggable){
                        this.options.touchStartThreshold=4;
                        dragEl.draggable=true;
                    }
                    pluginEvent( 'delayStart' , this , {"evt" : evt} );
                    if(options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))){
                        if(Sortable.eventCanceled){
                            this._onDrop();
                            return;
                        }
                        on( ownerDocument , 'mouseup' , _this._disableDelayedDrag );
                        on( ownerDocument , 'touchend' , _this._disableDelayedDrag );
                        on( ownerDocument , 'touchcancel' , _this._disableDelayedDrag );
                        on( ownerDocument , 'mousemove' , _this._delayedDragTouchMoveHandler );
                        on( ownerDocument , 'touchmove' , _this._delayedDragTouchMoveHandler );
                        options.supportPointer && on( ownerDocument , 'pointermove' , _this._delayedDragTouchMoveHandler );
                        _this._dragStartTimer=setTimeout( dragStartFn , options.delay );
                    }else{
                        dragStartFn();
                    }
                }
            } ,
            "_delayedDragTouchMoveHandler" : function _delayedDragTouchMoveHandler( /* TouchEvent|PointerEvent */ e ){
                var touch=e.touches ? ( e.touches[0] ) : ( e );
                /* console.log('hugues formule à vérifier') */
                if(Math.max( Math.abs( touch.clientX - this._lastX ) , Math.abs( touch.clientY - this._lastY ) ) >= Math.floor( this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1) )
                ){
                    this._disableDelayedDrag();
                }
            } ,
            "_disableDelayedDrag" : function _disableDelayedDrag(){
                dragEl && _disableDraggable( dragEl );
                clearTimeout( this._dragStartTimer );
                this._disableDelayedDragEvents();
            } ,
            "_disableDelayedDragEvents" : function _disableDelayedDragEvents(){
                var ownerDocument=this.el.ownerDocument;
                off( ownerDocument , 'mouseup' , this._disableDelayedDrag );
                off( ownerDocument , 'touchend' , this._disableDelayedDrag );
                off( ownerDocument , 'touchcancel' , this._disableDelayedDrag );
                off( ownerDocument , 'mousemove' , this._delayedDragTouchMoveHandler );
                off( ownerDocument , 'touchmove' , this._delayedDragTouchMoveHandler );
                off( ownerDocument , 'pointermove' , this._delayedDragTouchMoveHandler );
            } ,
            "_triggerDragStart" : function _triggerDragStart( /* Event */ evt ,  /* Touch */ touch ){
                touch=touch || evt.pointerType == 'touch' && evt;
                if(!this.nativeDraggable || touch){
                    if(this.options.supportPointer){
                        on( document , 'pointermove' , this._onTouchMove );
                    }else if(touch){
                        on( document , 'touchmove' , this._onTouchMove );
                    }else{
                        on( document , 'mousemove' , this._onTouchMove );
                    }
                }else{
                    on( dragEl , 'dragend' , this );
                    on( rootEl , 'dragstart' , this._onDragStart );
                }
                try{
                    if(document.selection){
                        _nextTick( function(){
                                document.selection.empty();
                            } );
                    }else{
                        window.getSelection().removeAllRanges();
                    }
                }catch(err){}
            } ,
            "_dragStarted" : function _dragStarted( fallback , evt ){
                awaitingDragStarted=false;
                if(rootEl && dragEl){
                    pluginEvent( 'dragStarted' , this , {"evt" : evt} );
                    if(this.nativeDraggable){
                        on( document , 'dragover' , _checkOutsideTargetEl );
                    }
                    var options=this.options;
                    !fallback && toggleClass( dragEl , options.dragClass , false );
                    toggleClass( dragEl , options.ghostClass , true );
                    Sortable.active=this;
                    fallback && this._appendGhost();
                    _dispatchEvent( {"sortable" : this ,"name" : 'start' ,"originalEvent" : evt} );
                }else{
                    this._nulling();
                }
            } ,
            "_emulateDragOver" : function _emulateDragOver(){
                if(touchEvt){
                    this._lastX=touchEvt.clientX;
                    this._lastY=touchEvt.clientY;
                    _hideGhostForTarget();
                    var target=document.elementFromPoint( touchEvt.clientX , touchEvt.clientY );
                    var parent=target;
                    while(target && target.shadowRoot){
                        target=target.shadowRoot.elementFromPoint( touchEvt.clientX , touchEvt.clientY );
                        if(target === parent){
                            break;
                        }
                        parent=target;
                    }
                    dragEl.parentNode[expando][_isOutsideThisEl]( target );
                    if(parent){
                        do{
                            if(parent[expando]){
                                var inserted=void( 0 );
                                inserted=parent[expando][_onDragOver]( {"clientX" : touchEvt.clientX ,"clientY" : touchEvt.clientY ,"target" : target ,"rootEl" : parent} );
                                if(inserted && !this.options.dragoverBubble){
                                    break;
                                }
                            }
                            target=parent;
                        }while(parent=parent.parentNode);
                        /* jshint boss:true */
                    }
                    _unhideGhostForTarget();
                }
            } ,
            "_onTouchMove" : function _onTouchMove( /* TouchEvent */ evt ){
                if(tapEvt){
                    var options=this.options;
                    var fallbackTolerance=options.fallbackTolerance;
                    var fallbackOffset=options.fallbackOffset;
                    var touch=evt.touches ? ( evt.touches[0] ) : ( evt );
                    var ghostMatrix=ghostEl && matrix( ghostEl , true );
                    var scaleX=ghostEl && ghostMatrix && ghostMatrix.a;
                    var scaleY=ghostEl && ghostMatrix && ghostMatrix.d;
                    var relativeScrollOffset=PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset( ghostRelativeParent );
                    var dx=((touch.clientX - tapEvt.clientX) + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ?
                              ( 
                                relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0]
                              ) : ( 
                                0
                              )) / (scaleX || 1);
                    var dy=((touch.clientY - tapEvt.clientY) + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ?
                              ( 
                                relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1]
                              ) : ( 
                                0
                              )) / (scaleY || 1);
                    if(!Sortable.active && !awaitingDragStarted){
                        if(fallbackTolerance
                               && Math.max( Math.abs( touch.clientX - this._lastX ) , Math.abs( touch.clientY - this._lastY ) ) < fallbackTolerance
                        ){
                            return;
                        }
                        this._onDragStart( evt , true );
                    }
                    if(ghostEl){
                        if(ghostMatrix){
                            ghostMatrix.e+=dx - (lastDx || 0);
                            ghostMatrix.f+=dy - (lastDy || 0);
                        }else{
                            ghostMatrix={
                                "a" : 1 ,
                                "b" : 0 ,
                                "c" : 0 ,
                                "d" : 1 ,
                                "e" : dx ,
                                "f" : dy
                            };
                        }
                        var cssMatrix="matrix(".concat( ghostMatrix.a , "," ).concat( ghostMatrix.b , "," ).concat( ghostMatrix.c , "," ).concat( ghostMatrix.d , "," ).concat( ghostMatrix.e , "," ).concat( ghostMatrix.f , ")" );
                        css( ghostEl , 'webkitTransform' , cssMatrix );
                        css( ghostEl , 'mozTransform' , cssMatrix );
                        css( ghostEl , 'msTransform' , cssMatrix );
                        css( ghostEl , 'transform' , cssMatrix );
                        lastDx=dx;
                        lastDy=dy;
                        touchEvt=touch;
                    }
                    evt.cancelable && evt.preventDefault();
                }
            } ,
            "_appendGhost" : function _appendGhost(){
                if(!ghostEl){
                    var container=this.options.fallbackOnBody ? ( document.body ) : ( rootEl );
                    var rect=getRect( dragEl , true , PositionGhostAbsolutely , true , container );
                    var options=this.options;
                    if(PositionGhostAbsolutely){
                        ghostRelativeParent=container;
                        while(css( ghostRelativeParent , 'position' ) === 'static'
                               && css( ghostRelativeParent , 'transform' ) === 'none'
                               && ghostRelativeParent !== document
                        ){
                            ghostRelativeParent=ghostRelativeParent.parentNode;
                        }
                        if(ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement){
                            if(ghostRelativeParent === document){
                                ghostRelativeParent=getWindowScrollingElement();
                            }
                            rect.top+=ghostRelativeParent.scrollTop;
                            rect.left+=ghostRelativeParent.scrollLeft;
                        }else{
                            ghostRelativeParent=getWindowScrollingElement();
                        }
                        ghostRelativeParentInitialScroll=getRelativeScrollOffset( ghostRelativeParent );
                    }
                    ghostEl=dragEl.cloneNode( true );
                    toggleClass( ghostEl , options.ghostClass , false );
                    toggleClass( ghostEl , options.fallbackClass , true );
                    toggleClass( ghostEl , options.dragClass , true );
                    css( ghostEl , 'transition' , '' );
                    css( ghostEl , 'transform' , '' );
                    css( ghostEl , 'box-sizing' , 'border-box' );
                    css( ghostEl , 'margin' , 0 );
                    css( ghostEl , 'top' , rect.top );
                    css( ghostEl , 'left' , rect.left );
                    css( ghostEl , 'width' , rect.width );
                    css( ghostEl , 'height' , rect.height );
                    css( ghostEl , 'opacity' , '0.8' );
                    css( ghostEl , 'position' , PositionGhostAbsolutely ? ( 'absolute' ) : ( 'fixed' ) );
                    css( ghostEl , 'zIndex' , '100000' );
                    css( ghostEl , 'pointerEvents' , 'none' );
                    Sortable.ghost=ghostEl;
                    container.appendChild( ghostEl );
                    css( ghostEl , 'transform-origin' , ((tapDistanceLeft / parseInt( ghostEl.style.width )) * 100) + '% ' + ((tapDistanceTop / parseInt( ghostEl.style.height )) * 100) + '%' );
                }
            } ,
            "_onDragStart" : function _onDragStart( /* Event */ evt ,  /* boolean */ fallback ){
                var _this=this;
                var dataTransfer=evt.dataTransfer;
                var options=_this.options;
                pluginEvent( 'dragStart' , this , {"evt" : evt} );
                if(Sortable.eventCanceled){
                    this._onDrop();
                    return;
                }
                pluginEvent( 'setupClone' , this );
                if(!Sortable.eventCanceled){
                    cloneEl=clone( dragEl );
                    cloneEl.removeAttribute( "id" );
                    cloneEl.draggable=false;
                    cloneEl.style['will-change']='';
                    this._hideClone();
                    toggleClass( cloneEl , this.options.chosenClass , false );
                    Sortable.clone=cloneEl;
                }
                _this.cloneId=_nextTick( function(){
                    pluginEvent( 'clone' , _this );
                    if(Sortable.eventCanceled){
                        return;
                    }
                    if(!_this.options.removeCloneOnHide){
                        rootEl.insertBefore( cloneEl , dragEl );
                    }
                    _this._hideClone();
                    _dispatchEvent( {"sortable" : _this ,"name" : 'clone'} );
                } );
                !fallback && toggleClass( dragEl , options.dragClass , true );
                if(fallback){
                    ignoreNextClick=true;
                    _this._loopId=setInterval( _this._emulateDragOver , 50 );
                }else{
                    off( document , 'mouseup' , _this._onDrop );
                    off( document , 'touchend' , _this._onDrop );
                    off( document , 'touchcancel' , _this._onDrop );
                    if(dataTransfer){
                        dataTransfer.effectAllowed='move';
                        options.setData && options.setData.call( _this , dataTransfer , dragEl );
                    }
                    on( document , 'drop' , _this );
                    css( dragEl , 'transform' , 'translateZ(0)' );
                }
                awaitingDragStarted=true;
                _this._dragStartId=_nextTick( _this._dragStarted.bind( _this , fallback , evt ) );
                on( document , 'selectstart' , _this );
                moved=true;
                if(Safari){
                    css( document.body , 'user-select' , 'none' );
                }
            } ,
            "_onDragOver" : function _onDragOver( /* Event */ evt ){
                var el=this.el;
                var target=evt.target;
                var dragRect;
                var targetRect;
                var revert;
                var options=this.options;
                var group=options.group;
                var activeSortable=Sortable.active;
                var isOwner=activeGroup === group;
                var canSort=options.sort;
                var fromSortable=putSortable || activeSortable;
                var vertical;
                var _this=this;
                var completedFired=false;
                if(_silent){
                    return;
                }
                function dragOverEvent( name , extra ){
                    pluginEvent( name , _this , _objectSpread2( {
                            "evt" : evt ,
                            "isOwner" : isOwner ,
                            "axis" : vertical ? ( 'vertical' ) : ( 'horizontal' ) ,
                            "revert" : revert ,
                            "dragRect" : dragRect ,
                            "targetRect" : targetRect ,
                            "canSort" : canSort ,
                            "fromSortable" : fromSortable ,
                            "target" : target ,
                            "completed" : completed ,
                            "onMove" : function onMove( target , after ){
                                return(_onMove( rootEl , el , dragEl , dragRect , target , getRect( target ) , evt , after ));
                            } ,
                            "changed" : changed
                        } , extra ) );
                }
                function capture(){
                    dragOverEvent( 'dragOverAnimationCapture' );
                    _this.captureAnimationState();
                    if(_this !== fromSortable){
                        fromSortable.captureAnimationState();
                    }
                }
                function completed( insertion ){
                    dragOverEvent( 'dragOverCompleted' , {"insertion" : insertion} );
                    if(insertion){
                        if(isOwner){
                            activeSortable._hideClone();
                        }else{
                            activeSortable._showClone( _this );
                        }
                        if(_this !== fromSortable){
                            toggleClass( dragEl , putSortable ? ( putSortable.options.ghostClass ) : ( activeSortable.options.ghostClass ) , false );
                            toggleClass( dragEl , options.ghostClass , true );
                        }
                        if(putSortable !== _this && _this !== Sortable.active){
                            putSortable=_this;
                        }else if(_this === Sortable.active && putSortable){
                            putSortable=null;
                        }
                        if(fromSortable === _this){
                            _this._ignoreWhileAnimating=target;
                        }
                        _this.animateAll( function(){
                                dragOverEvent( 'dragOverAnimationComplete' );
                                _this._ignoreWhileAnimating=null;
                            } );
                        if(_this !== fromSortable){
                            fromSortable.animateAll();
                            fromSortable._ignoreWhileAnimating=null;
                        }
                    }
                    if(target === dragEl && !dragEl.animated || target === el && !target.animated){
                        lastTarget=null;
                    }
                    if(!options.dragoverBubble && !evt.rootEl && target !== document){
                        try{
                            dragEl.parentNode[expando][_isOutsideThisEl]( evt.target );
                        }catch(e){}
                        /* un point virgule est-il en trop ? */
                        !insertion && nearestEmptyInsertDetectEvent( evt );
                    }
                    !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
                    return(completedFired=true);
                }
                function changed(){
                    newIndex=index( dragEl );
                    newDraggableIndex=index( dragEl , options.draggable );
                    _dispatchEvent( {
                            "sortable" : _this ,
                            "name" : 'change' ,
                            "toEl" : el ,
                            "newIndex" : newIndex ,
                            "newDraggableIndex" : newDraggableIndex ,
                            "originalEvent" : evt
                        } );
                }
                if(evt.preventDefault !== void( 0 )){
                    evt.cancelable && evt.preventDefault();
                }
                target=closest( target , options.draggable , el , true );
                dragOverEvent( 'dragOver' );
                if(Sortable.eventCanceled){
                    return completedFired;
                }
                /* console.log('hugues dragEl=',dragEl); */
                if(dragEl.contains( evt.target )
                       || target.animated
                           && target.animatingX
                           && target.animatingY
                       || _this._ignoreWhileAnimating === target
                ){
                    return(completed( false ));
                }
                ignoreNextClick=false;
                if(activeSortable
                       && !options.disabled
                       && (isOwner ?
                          ( 
                            canSort || (revert=parentEl !== rootEl)
                          ) : ( 
                            putSortable === this || (this.lastPutMode=activeGroup.checkPull( this , activeSortable , dragEl , evt )) && group.checkPut( this , activeSortable , dragEl , evt )
                          ))
                ){
                    vertical=this._getDirection( evt , target ) === 'vertical';
                    dragRect=getRect( dragEl );
                    dragOverEvent( 'dragOverValid' );
                    if(Sortable.eventCanceled){
                        return completedFired;
                    }
                    if(revert){
                        parentEl=rootEl;
                        capture();
                        this._hideClone();
                        dragOverEvent( 'revert' );
                        if(!Sortable.eventCanceled){
                            if(nextEl){
                                rootEl.insertBefore( dragEl , nextEl );
                            }else{
                                rootEl.appendChild( dragEl );
                            }
                        }
                        return(completed( true ));
                    }
                    var elLastChild=lastChild( el , options.draggable );
                    if(!elLastChild || _ghostIsLast( evt , vertical , this ) && !elLastChild.animated){
                        if(elLastChild === dragEl){
                            return(completed( false ));
                        }
                        if(elLastChild && el === evt.target){
                            target=elLastChild;
                        }
                        if(target){
                            targetRect=getRect( target );
                        }
                        if(_onMove( rootEl , el , dragEl , dragRect , target , targetRect , evt , !!target ) !== false){
                            capture();
                            if(elLastChild && elLastChild.nextSibling){
                                el.insertBefore( dragEl , elLastChild.nextSibling );
                            }else{
                                el.appendChild( dragEl );
                            }
                            parentEl=el;
                            changed();
                            return(completed( true ));
                        }
                    }else if(elLastChild && _ghostIsFirst( evt , vertical , this )){
                        var firstChild=getChild( el , 0 , options , true );
                        if(firstChild === dragEl){
                            return(completed( false ));
                        }
                        target=firstChild;
                        targetRect=getRect( target );
                        if(_onMove( rootEl , el , dragEl , dragRect , target , targetRect , evt , false ) !== false){
                            capture();
                            el.insertBefore( dragEl , firstChild );
                            parentEl=el;
                            changed();
                            return(completed( true ));
                        }
                    }else if(target.parentNode === el){
                        targetRect=getRect( target );
                        var direction=0;
                        var targetBeforeFirstSwap;
                        var differentLevel=dragEl.parentNode !== el;
                        var differentRowCol=!_dragElInRowColumn( dragEl.animated && dragEl.toRect || dragRect , target.animated && target.toRect || targetRect , vertical );
                        var side1=vertical ? ( 'top' ) : ( 'left' );
                        var scrolledPastTop=isScrolledPast( target , 'top' , 'top' ) || isScrolledPast( dragEl , 'top' , 'top' );
                        var scrollBefore=scrolledPastTop ? ( scrolledPastTop.scrollTop ) : ( void( 0 ) );
                        if(lastTarget !== target){
                            targetBeforeFirstSwap=targetRect[side1];
                            pastFirstInvertThresh=false;
                            isCircumstantialInvert=!differentRowCol && options.invertSwap || differentLevel;
                        }
                        direction=_getSwapDirection( evt , target , targetRect , vertical , differentRowCol ? ( 1 ) : ( options.swapThreshold ) , options.invertedSwapThreshold == null ? ( options.swapThreshold ) : ( options.invertedSwapThreshold ) , isCircumstantialInvert , lastTarget === target );
                        var sibling;
                        if(direction !== 0){
                            var dragIndex=index( dragEl );
                            do{
                                dragIndex-=direction;
                                sibling=parentEl.children[dragIndex];
                            }while(sibling && (css( sibling , 'display' ) === 'none' || sibling === ghostEl));
                        }
                        if(direction === 0 || sibling === target){
                            return(completed( false ));
                        }
                        lastTarget=target;
                        lastDirection=direction;
                        var nextSibling=target.nextElementSibling;
                        var after=false;
                        after=direction === 1;
                        var moveVector=_onMove( rootEl , el , dragEl , dragRect , target , targetRect , evt , after );
                        if(moveVector !== false){
                            if(moveVector === 1 || moveVector === -1){
                                after=moveVector === 1;
                            }
                            _silent=true;
                            setTimeout( _unsilent , 30 );
                            capture();
                            if(after && !nextSibling){
                                el.appendChild( dragEl );
                            }else{
                                target.parentNode.insertBefore( dragEl , after ? ( nextSibling ) : ( target ) );
                            }
                            if(scrolledPastTop){
                                scrollBy( scrolledPastTop , 0 , scrollBefore - scrolledPastTop.scrollTop );
                            }
                            parentEl=dragEl.parentNode;
                            if(targetBeforeFirstSwap !== undefined && !isCircumstantialInvert){
                                targetMoveDistance=Math.abs( targetBeforeFirstSwap - getRect( target )[side1] );
                            }
                            changed();
                            return(completed( true ));
                        }
                    }
                    if(el.contains( dragEl )){
                        return(completed( false ));
                    }
                }
                return false;
            } ,
            "_ignoreWhileAnimating" : null ,
            "_offMoveEvents" : function _offMoveEvents(){
                off( document , 'mousemove' , this._onTouchMove );
                off( document , 'touchmove' , this._onTouchMove );
                off( document , 'pointermove' , this._onTouchMove );
                off( document , 'dragover' , nearestEmptyInsertDetectEvent );
                off( document , 'mousemove' , nearestEmptyInsertDetectEvent );
                off( document , 'touchmove' , nearestEmptyInsertDetectEvent );
            } ,
            "_offUpEvents" : function _offUpEvents(){
                var ownerDocument=this.el.ownerDocument;
                off( ownerDocument , 'mouseup' , this._onDrop );
                off( ownerDocument , 'touchend' , this._onDrop );
                off( ownerDocument , 'pointerup' , this._onDrop );
                off( ownerDocument , 'touchcancel' , this._onDrop );
                off( document , 'selectstart' , this );
            } ,
            "_onDrop" : function _onDrop( /* Event */ evt ){
                var el=this.el;
                var options=this.options;
                newIndex=index( dragEl );
                newDraggableIndex=index( dragEl , options.draggable );
                pluginEvent( 'drop' , this , {"evt" : evt} );
                parentEl=dragEl && dragEl.parentNode;
                newIndex=index( dragEl );
                newDraggableIndex=index( dragEl , options.draggable );
                if(Sortable.eventCanceled){
                    this._nulling();
                    return;
                }
                awaitingDragStarted=false;
                isCircumstantialInvert=false;
                pastFirstInvertThresh=false;
                clearInterval( this._loopId );
                clearTimeout( this._dragStartTimer );
                _cancelNextTick( this.cloneId );
                _cancelNextTick( this._dragStartId );
                if(this.nativeDraggable){
                    off( document , 'drop' , this );
                    off( el , 'dragstart' , this._onDragStart );
                }
                this._offMoveEvents();
                this._offUpEvents();
                if(Safari){
                    css( document.body , 'user-select' , '' );
                }
                css( dragEl , 'transform' , '' );
                if(evt){
                    if(moved){
                        evt.cancelable && evt.preventDefault();
                        !options.dropBubble && evt.stopPropagation();
                    }
                    ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild( ghostEl );
                    if(rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone'){
                        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild( cloneEl );
                    }
                    if(dragEl){
                        if(this.nativeDraggable){
                            off( dragEl , 'dragend' , this );
                        }
                        _disableDraggable( dragEl );
                        dragEl.style['will-change']='';
                        if(moved && !awaitingDragStarted){
                            toggleClass( dragEl , putSortable ? ( putSortable.options.ghostClass ) : ( this.options.ghostClass ) , false );
                        }
                        toggleClass( dragEl , this.options.chosenClass , false );
                        _dispatchEvent( {
                                "sortable" : this ,
                                "name" : 'unchoose' ,
                                "toEl" : parentEl ,
                                "newIndex" : null ,
                                "newDraggableIndex" : null ,
                                "originalEvent" : evt
                            } );
                        if(rootEl !== parentEl){
                            if(newIndex >= 0){
                                _dispatchEvent( {"rootEl" : parentEl ,"name" : 'add' ,"toEl" : parentEl ,"fromEl" : rootEl ,"originalEvent" : evt} );
                                _dispatchEvent( {"sortable" : this ,"name" : 'remove' ,"toEl" : parentEl ,"originalEvent" : evt} );
                                _dispatchEvent( {"rootEl" : parentEl ,"name" : 'sort' ,"toEl" : parentEl ,"fromEl" : rootEl ,"originalEvent" : evt} );
                                _dispatchEvent( {"sortable" : this ,"name" : 'sort' ,"toEl" : parentEl ,"originalEvent" : evt} );
                            }
                            putSortable && putSortable.save();
                        }else{
                            if(newIndex !== oldIndex){
                                if(newIndex >= 0){
                                    _dispatchEvent( {"sortable" : this ,"name" : 'update' ,"toEl" : parentEl ,"originalEvent" : evt} );
                                    _dispatchEvent( {"sortable" : this ,"name" : 'sort' ,"toEl" : parentEl ,"originalEvent" : evt} );
                                }
                            }
                        }
                        if(Sortable.active){
                            /* jshint eqnull:true */
                            if(newIndex == null || newIndex === -1){
                                newIndex=oldIndex;
                                newDraggableIndex=oldDraggableIndex;
                            }
                            _dispatchEvent( {"sortable" : this ,"name" : 'end' ,"toEl" : parentEl ,"originalEvent" : evt} );
                            this.save();
                        }
                    }
                }
                this._nulling();
            } ,
            "_nulling" : function _nulling(){
                pluginEvent( 'nulling' , this );
                rootEl=dragEl=parentEl=ghostEl=nextEl=cloneEl=lastDownEl=cloneHidden=tapEvt=touchEvt=moved=newIndex=newDraggableIndex=oldIndex=oldDraggableIndex=lastTarget=lastDirection=putSortable=activeGroup=Sortable.dragged=Sortable.ghost=Sortable.clone=Sortable.active=null;
                savedInputChecked.forEach( function( el ){
                        el.checked=true;
                    } );
                savedInputChecked.length=lastDx=lastDy=0;
            } ,
            "handleEvent" : function handleEvent( /* Event */ evt ){
                switch (evt.type){
                    case 'drop' : 
                    case 'dragend' : this._onDrop( evt );
                        break;
                    case 'dragenter' : 
                    case 'dragover' :
                        if(dragEl){
                            this._onDragOver( evt );
                            _globalDragOver( evt );
                        }
                        break;
                        
                    case 'selectstart' : evt.preventDefault();
                        break;
                }
            } ,
             /*#
              * Serializes the item into an array of string.
              * @returns {String[]}
             */
            "toArray" : function toArray(){
                var order=[];
                var el;
                var children=this.el.children;
                var i=0;
                var n=children.length;
                var options=this.options;
                for(  ; i < n ; i++ ){
                    el=children[i];
                    if(closest( el , options.draggable , this.el , false )
                    ){
                        order.push( el.getAttribute( options.dataIdAttr ) || _generateId( el ) );
                    }
                }
                return order;
            } ,
             /*#
              * Sorts the elements according to the array.
              * @param  {String[]}  order  order of the items
             */
            "sort" : function sort( order , useAnimation ){
                var items={};
                var rootEl=this.el;
                this.toArray().forEach( function( id , i ){
                        var el=rootEl.children[i];
                        if(closest( el , this.options.draggable , rootEl , false )
                        ){
                            items[id]=el;
                        }
                    } , this );
                useAnimation && this.captureAnimationState();
                order.forEach( function( id ){
                        if(items[id]){
                            rootEl.removeChild( items[id] );
                            rootEl.appendChild( items[id] );
                        }
                    } );
                useAnimation && this.animateAll();
            } ,
             /*#
              * Save the current sorting
             */
            "save" : function save(){
                var store=this.options.store;
                store && store.set && store.set( this );
            } ,
             /*#
              * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
              * @param   {HTMLElement}  el
              * @param   {String}       [selector]  default: `options.draggable`
              * @returns {HTMLElement|null}
             */
            "closest" : function closest$1( el , selector ){
                return(closest( el , selector || this.options.draggable , this.el , false ));
            } ,
             /*#
              * Set/get option
              * @param   {string} name
              * @param   {*}      [value]
              * @returns {*}
             */
            "option" : function option( name , value ){
                var options=this.options;
                if(value === void( 0 )){
                    return options[name];
                }else{
                    var modifiedValue=PluginManager.modifyOption( this , name , value );
                    if( typeof modifiedValue !== 'undefined'){
                        options[name]=modifiedValue;
                    }else{
                        options[name]=value;
                    }
                    if(name === 'group'){
                        _prepareGroup( options );
                    }
                }
            } ,
             /*#
              * Destroy
             */
            "destroy" : function destroy(){
                pluginEvent( 'destroy' , this );
                var el=this.el;
                el[expando]=null;
                off( el , 'mousedown' , this._onTapStart );
                off( el , 'touchstart' , this._onTapStart );
                off( el , 'pointerdown' , this._onTapStart );
                if(this.nativeDraggable){
                    off( el , 'dragover' , this );
                    off( el , 'dragenter' , this );
                }
                Array.prototype.forEach.call( el.querySelectorAll( '[draggable]' ) , function( el ){
                        el.removeAttribute( 'draggable' );
                    } );
                this._onDrop();
                this._disableDelayedDragEvents();
                sortables.splice( sortables.indexOf( this.el ) , 1 );
                this.el=el=null;
            } ,
            "_hideClone" : function _hideClone(){
                if(!cloneHidden){
                    pluginEvent( 'hideClone' , this );
                    if(Sortable.eventCanceled){
                        return;
                    }
                    css( cloneEl , 'display' , 'none' );
                    if(this.options.removeCloneOnHide && cloneEl.parentNode){
                        cloneEl.parentNode.removeChild( cloneEl );
                    }
                    cloneHidden=true;
                }
            } ,
            "_showClone" : function _showClone( putSortable ){
                if(putSortable.lastPutMode !== 'clone'){
                    this._hideClone();
                    return;
                }
                if(cloneHidden){
                    pluginEvent( 'showClone' , this );
                    if(Sortable.eventCanceled){
                        return;
                    }
                    if(dragEl.parentNode == rootEl && !this.options.group.revertClone){
                        rootEl.insertBefore( cloneEl , dragEl );
                    }else if(nextEl){
                        rootEl.insertBefore( cloneEl , nextEl );
                    }else{
                        rootEl.appendChild( cloneEl );
                    }
                    if(this.options.group.revertClone){
                        this.animate( dragEl , cloneEl );
                    }
                    css( cloneEl , 'display' , '' );
                    cloneHidden=false;
                }
            }
        };
        function _globalDragOver( /* #Event */ evt ){
            if(evt.dataTransfer){
                evt.dataTransfer.dropEffect='move';
            }
            evt.cancelable && evt.preventDefault();
        }
        function _onMove( fromEl , toEl , dragEl , dragRect , targetEl , targetRect , originalEvent , willInsertAfter ){
            var evt;
            var sortable=fromEl[expando];
            var onMoveFn=sortable.options.onMove;
            var retVal;
            if(window.CustomEvent && !IE11OrLess && !Edge){
                evt=new CustomEvent( 'move' , {"bubbles" : true ,"cancelable" : true} );
            }else{
                evt=document.createEvent( 'Event' );
                evt.initEvent( 'move' , true , true );
            }
            evt.to=toEl;
            evt.from=fromEl;
            evt.dragged=dragEl;
            evt.draggedRect=dragRect;
            evt.related=targetEl || toEl;
            evt.relatedRect=targetRect || getRect( toEl );
            evt.willInsertAfter=willInsertAfter;
            evt.originalEvent=originalEvent;
            fromEl.dispatchEvent( evt );
            if(onMoveFn){
                retVal=onMoveFn.call( sortable , evt , originalEvent );
            }
            return retVal;
        }
        function _disableDraggable( el ){
            el.draggable=false;
        }
        function _unsilent(){
            _silent=false;
        }
        function _ghostIsFirst( evt , vertical , sortable ){
            var firstElRect=getRect( getChild( sortable.el , 0 , sortable.options , true ) );
            var childContainingRect=getChildContainingRectFromElement( sortable.el , sortable.options , ghostEl );
            var spacer=10;
            return(vertical ?
                  ( 
                    evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right
                  ) : ( 
                    evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left
                  ));
        }
        function _ghostIsLast( evt , vertical , sortable ){
            var lastElRect=getRect( lastChild( sortable.el , sortable.options.draggable ) );
            var childContainingRect=getChildContainingRectFromElement( sortable.el , sortable.options , ghostEl );
            var spacer=10;
            return(vertical ?
                  ( 
                    evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left
                  ) : ( 
                    evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top
                  ));
        }
        function _getSwapDirection( evt , target , targetRect , vertical , swapThreshold , invertedSwapThreshold , invertSwap , isLastTarget ){
            var mouseOnAxis=vertical ? ( evt.clientY ) : ( evt.clientX );
            var targetLength=vertical ? ( targetRect.height ) : ( targetRect.width );
            var targetS1=vertical ? ( targetRect.top ) : ( targetRect.left );
            var targetS2=vertical ? ( targetRect.bottom ) : ( targetRect.right );
            var invert=false;
            if(!invertSwap){
                if(isLastTarget && targetMoveDistance < targetLength * swapThreshold){
                    if(!pastFirstInvertThresh
                           && (lastDirection === 1 ?
                              ( 
                                mouseOnAxis > targetS1 + (targetLength * invertedSwapThreshold) / 2
                              ) : ( 
                                mouseOnAxis < targetS2 - (targetLength * invertedSwapThreshold) / 2
                              ))
                    ){
                        pastFirstInvertThresh=true;
                    }
                    if(!pastFirstInvertThresh){
                        if((lastDirection === 1 ? ( mouseOnAxis < targetS1 + targetMoveDistance ) : ( mouseOnAxis > targetS2 - targetMoveDistance ))
                        ){
                            return(-lastDirection);
                        }
                    }else{
                        invert=true;
                    }
                }else{
                    if(mouseOnAxis > targetS1 + (targetLength * (1 - swapThreshold)) / 2
                           && mouseOnAxis < targetS2 - (targetLength * (1 - swapThreshold)) / 2
                    ){
                        return(_getInsertDirection( target ));
                    }
                }
            }
            invert=invert || invertSwap;
            if(invert){
                if(mouseOnAxis < targetS1 + (targetLength * invertedSwapThreshold) / 2
                       || mouseOnAxis > targetS2 - (targetLength * invertedSwapThreshold) / 2
                ){
                    return(mouseOnAxis > targetS1 + targetLength / 2 ? ( 1 ) : ( -1 ));
                }
            }
            return 0;
        }
        /*#
          * Gets the direction dragEl must be swapped relative to target in order to make it
          * seem that dragEl has been "inserted" into that element's position
          * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
          * @return {Number}                   Direction dragEl must be swapped
        */
        function _getInsertDirection( target ){
            if(index( dragEl ) < index( target )){
                return 1;
            }else{
                return -1;
            }
        }
        /*#
          * Generate id
          * @param   {HTMLElement} el
          * @returns {String}
          * @private
        */
        function _generateId( el ){
            var str=el.tagName + el.className + el.src + el.href + el.textContent;
            var i=str.length;
            var sum=0;
            while(i--){
                sum+=str.charCodeAt( i );
            }
            return(sum.toString( 36 ));
        }
        function _saveInputCheckedState( root ){
            savedInputChecked.length=0;
            var inputs=root.getElementsByTagName( 'input' );
            var idx=inputs.length;
            while(idx--){
                var el=inputs[idx];
                el.checked && savedInputChecked.push( el );
            }
        }
        function _nextTick( fn ){
            return(setTimeout( fn , 0 ));
        }
        function _cancelNextTick( id ){
            return(clearTimeout( id ));
        }
        if(documentExists){
            on( document , 'touchmove' , function( evt ){
                    if((Sortable.active || awaitingDragStarted) && evt.cancelable){
                        evt.preventDefault();
                    }
                } );
        }
        Sortable.utils={
            "on" : on ,
            "off" : off ,
            "css" : css ,
            "find" : find ,
            "is" : function is( el , selector ){
                return(!!closest( el , selector , el , false ));
            } ,
            "extend" : extend ,
            "throttle" : throttle ,
            "closest" : closest ,
            "toggleClass" : toggleClass ,
            "clone" : clone ,
            "index" : index ,
            "nextTick" : _nextTick ,
            "cancelNextTick" : _cancelNextTick ,
            "detectDirection" : _detectDirection ,
            "getChild" : getChild
        };
        /*#
          * Get the Sortable instance of an element
          * @param  {HTMLElement} element The element
          * @return {Sortable|undefined}         The instance of Sortable
        */
        Sortable.get=function( element ){
            return element[expando];
        };
        /*#
          * Mount a plugin to Sortable
          * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
        */
        Sortable.mount=function(){
            for( var _len=arguments.length,plugins=[_len],_key=0 ; _key < _len ; _key++ ){
                plugins[_key]=arguments[_key];
            }
            if(plugins[0].constructor === Array){
                plugins=plugins[0];
            }
            plugins.forEach( function( plugin ){
                    if(!plugin.prototype || !plugin.prototype.constructor){
                        throw "Sortable: Mounted plugin must be a constructor function, not ".concat( {}.toString.call( plugin ) );
                    }
                    if(plugin.utils){
                        Sortable.utils=_objectSpread2( _objectSpread2( {} , Sortable.utils ) , plugin.utils );
                    }
                    PluginManager.mount( plugin );
                } );
        };
        /*#
          * Create sortable instance
          * @param {HTMLElement}  el
          * @param {Object}      [options]
        */
        Sortable.create=function( el , options ){
            return(new Sortable( el , options ));
        };
        Sortable.version=version;
        var autoScrolls=[];
        var scrollEl;
        var scrollRootEl;
        var scrolling=false;
        var lastAutoScrollX;
        var lastAutoScrollY;
        var touchEvt$1;
        var pointerElemChangedInterval;
        function AutoScrollPlugin(){
            function AutoScroll(){
                this.defaults={"scroll" : true ,"forceAutoScrollFallback" : false ,"scrollSensitivity" : 30 ,"scrollSpeed" : 10 ,"bubbleScroll" : true};
                for(var fn in this){
                    if(fn.charAt( 0 ) === '_' &&  typeof this[fn] === 'function'){
                        this[fn]=this[fn].bind( this );
                    }
                }
            }
            AutoScroll.prototype={
                "dragStarted" : function dragStarted( _ref ){
                    var originalEvent=_ref.originalEvent;
                    if(this.sortable.nativeDraggable){
                        on( document , 'dragover' , this._handleAutoScroll );
                    }else{
                        if(this.options.supportPointer){
                            on( document , 'pointermove' , this._handleFallbackAutoScroll );
                        }else if(originalEvent.touches){
                            on( document , 'touchmove' , this._handleFallbackAutoScroll );
                        }else{
                            on( document , 'mousemove' , this._handleFallbackAutoScroll );
                        }
                    }
                } ,
                "dragOverCompleted" : function dragOverCompleted( _ref2 ){
                    var originalEvent=_ref2.originalEvent;
                    if(!this.options.dragOverBubble && !originalEvent.rootEl){
                        this._handleAutoScroll( originalEvent );
                    }
                } ,
                "drop" : function drop(){
                    if(this.sortable.nativeDraggable){
                        off( document , 'dragover' , this._handleAutoScroll );
                    }else{
                        off( document , 'pointermove' , this._handleFallbackAutoScroll );
                        off( document , 'touchmove' , this._handleFallbackAutoScroll );
                        off( document , 'mousemove' , this._handleFallbackAutoScroll );
                    }
                    clearPointerElemChangedInterval();
                    clearAutoScrolls();
                    cancelThrottle();
                } ,
                "nulling" : function nulling(){
                    touchEvt$1=scrollRootEl=scrollEl=scrolling=pointerElemChangedInterval=lastAutoScrollX=lastAutoScrollY=null;
                    autoScrolls.length=0;
                } ,
                "_handleFallbackAutoScroll" : function _handleFallbackAutoScroll( evt ){
                    this._handleAutoScroll( evt , true );
                } ,
                "_handleAutoScroll" : function _handleAutoScroll( evt , fallback ){
                    var _this=this;
                    var x=evt.touches ? ( evt.touches[0].clientX ) : ( evt.clientX );
                    var y=evt.touches ? ( evt.touches[0].clientY ) : ( evt.clientY );
                    var elem=document.elementFromPoint( x , y );
                    touchEvt$1=evt;
                    if(fallback
                           || this.options.forceAutoScrollFallback
                           || Edge
                           || IE11OrLess
                           || Safari
                    ){
                        autoScroll( evt , this.options , elem , fallback );
                        var ogElemScroller=getParentAutoScrollElement( elem , true );
                        if(scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)){
                            pointerElemChangedInterval && clearPointerElemChangedInterval();
                            pointerElemChangedInterval=setInterval( function(){
                                var newElem=getParentAutoScrollElement( document.elementFromPoint( x , y ) , true );
                                if(newElem !== ogElemScroller){
                                    ogElemScroller=newElem;
                                    clearAutoScrolls();
                                }
                                autoScroll( evt , _this.options , newElem , fallback );
                            } , 10 );
                            lastAutoScrollX=x;
                            lastAutoScrollY=y;
                        }
                    }else{
                        if(!this.options.bubbleScroll || getParentAutoScrollElement( elem , true ) === getWindowScrollingElement()){
                            clearAutoScrolls();
                            return;
                        }
                        autoScroll( evt , this.options , getParentAutoScrollElement( elem , false ) , false );
                    }
                }
            };
            return(_extends( AutoScroll , {"pluginName" : 'scroll' ,"initializeByDefault" : true} ));
        }
        function clearAutoScrolls(){
            autoScrolls.forEach( function( autoScroll ){
                    clearInterval( autoScroll.pid );
                } );
            autoScrolls=[];
        }
        function clearPointerElemChangedInterval(){
            clearInterval( pointerElemChangedInterval );
        }
        var autoScroll=throttle( function( evt , options , rootEl , isFallback ){
            if(!options.scroll){
                return;
            }
            var x=evt.touches ? ( evt.touches[0].clientX ) : ( evt.clientX );
            var y=evt.touches ? ( evt.touches[0].clientY ) : ( evt.clientY );
            var sens=options.scrollSensitivity;
            var speed=options.scrollSpeed;
            var winScroller=getWindowScrollingElement();
            var scrollThisInstance=false;
            var scrollCustomFn;
            if(scrollRootEl !== rootEl){
                scrollRootEl=rootEl;
                clearAutoScrolls();
                scrollEl=options.scroll;
                scrollCustomFn=options.scrollFn;
                if(scrollEl === true){
                    scrollEl=getParentAutoScrollElement( rootEl , true );
                }
            }
            var layersOut=0;
            var currentParent=scrollEl;
            do{
                var el=currentParent;
                var rect=getRect( el );
                var top=rect.top;
                var bottom=rect.bottom;
                var left=rect.left;
                var right=rect.right;
                var width=rect.width;
                var height=rect.height;
                var canScrollX=void( 0 );
                var canScrollY=void( 0 );
                var scrollWidth=el.scrollWidth;
                var scrollHeight=el.scrollHeight;
                var elCSS=css( el );
                var scrollPosX=el.scrollLeft;
                var scrollPosY=el.scrollTop;
                if(el === winScroller){
                    canScrollX=width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
                    canScrollY=height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
                }else{
                    canScrollX=width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
                    canScrollY=height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
                }
                var vx=canScrollX && (Math.abs( right - x ) <= sens && scrollPosX + width < scrollWidth) - (Math.abs( left - x ) <= sens && !!scrollPosX);
                var vy=canScrollY && (Math.abs( bottom - y ) <= sens && scrollPosY + height < scrollHeight) - (Math.abs( top - y ) <= sens && !!scrollPosY);
                if(!autoScrolls[layersOut]){
                    for( var i=0 ; i <= layersOut ; i++ ){
                        if(!autoScrolls[i]){
                            autoScrolls[i]={};
                        }
                    }
                }
                if(autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el){
                    autoScrolls[layersOut].el=el;
                    autoScrolls[layersOut].vx=vx;
                    autoScrolls[layersOut].vy=vy;
                    clearInterval( autoScrolls[layersOut].pid );
                    if(vx != 0 || vy != 0){
                        scrollThisInstance=true;
                        /* jshint loopfunc:true */
                        autoScrolls[layersOut].pid=setInterval( function(){
                            if(isFallback && this.layer === 0){
                                Sortable.active._onTouchMove( touchEvt$1 );
                            }
                            var scrollOffsetY=autoScrolls[this.layer].vy ? ( autoScrolls[this.layer].vy * speed ) : ( 0 );
                            var scrollOffsetX=autoScrolls[this.layer].vx ? ( autoScrolls[this.layer].vx * speed ) : ( 0 );
                            if( typeof scrollCustomFn === 'function'){
                                if(scrollCustomFn.call( Sortable.dragged.parentNode[expando] , scrollOffsetX , scrollOffsetY , evt , touchEvt$1 , autoScrolls[this.layer].el ) !== 'continue'
                                ){
                                    return;
                                }
                            }
                            scrollBy( autoScrolls[this.layer].el , scrollOffsetX , scrollOffsetY );
                        }.bind( {"layer" : layersOut} ) , 24 );
                    }
                }
                layersOut++;
            }while(options.bubbleScroll
                   && currentParent !== winScroller
                   && (currentParent=getParentAutoScrollElement( currentParent , false ))
            );
            scrolling=scrollThisInstance;
        } , 30 );
        var drop=function drop( _ref ){
            var originalEvent=_ref.originalEvent;
            var putSortable=_ref.putSortable;
            var dragEl=_ref.dragEl;
            var activeSortable=_ref.activeSortable;
            var dispatchSortableEvent=_ref.dispatchSortableEvent;
            var hideGhostForTarget=_ref.hideGhostForTarget;
            var unhideGhostForTarget=_ref.unhideGhostForTarget;
            if(!originalEvent){
                return;
            }
            var toSortable=putSortable || activeSortable;
            hideGhostForTarget();
            var touch=originalEvent.changedTouches && originalEvent.changedTouches.length ? ( originalEvent.changedTouches[0] ) : ( originalEvent );
            var target=document.elementFromPoint( touch.clientX , touch.clientY );
            unhideGhostForTarget();
            if(toSortable && !toSortable.el.contains( target )){
                dispatchSortableEvent( 'spill' );
                this.onSpill( {"dragEl" : dragEl ,"putSortable" : putSortable} );
            }
        };
        function Revert(){
            /* rien ici */
        }
        Revert.prototype={
            "startIndex" : null ,
            "dragStart" : function dragStart( _ref2 ){
                var oldDraggableIndex=_ref2.oldDraggableIndex;
                this.startIndex=oldDraggableIndex;
            } ,
            "onSpill" : function onSpill( _ref3 ){
                var dragEl=_ref3.dragEl;
                var putSortable=_ref3.putSortable;
                this.sortable.captureAnimationState();
                if(putSortable){
                    putSortable.captureAnimationState();
                }
                var nextSibling=getChild( this.sortable.el , this.startIndex , this.options );
                if(nextSibling){
                    this.sortable.el.insertBefore( dragEl , nextSibling );
                }else{
                    this.sortable.el.appendChild( dragEl );
                }
                this.sortable.animateAll();
                if(putSortable){
                    putSortable.animateAll();
                }
            } ,
            "drop" : drop
        };
        _extends( Revert , {"pluginName" : 'revertOnSpill'} );
        function Remove(){
            /* rien ici */
        }
        Remove.prototype={
            "onSpill" : function onSpill( _ref4 ){
                var dragEl=_ref4.dragEl;
                var putSortable=_ref4.putSortable;
                var parentSortable=putSortable || this.sortable;
                parentSortable.captureAnimationState();
                dragEl.parentNode && dragEl.parentNode.removeChild( dragEl );
                parentSortable.animateAll();
            } ,
            "drop" : drop
        };
        _extends( Remove , {"pluginName" : 'removeOnSpill'} );
        var lastSwapEl;
        function SwapPlugin(){
            function Swap(){
                this.defaults={"swapClass" : 'sortable-swap-highlight'};
            }
            Swap.prototype={
                "dragStart" : function dragStart( _ref ){
                    var dragEl=_ref.dragEl;
                    lastSwapEl=dragEl;
                } ,
                "dragOverValid" : function dragOverValid( _ref2 ){
                    var completed=_ref2.completed;
                    var target=_ref2.target;
                    var onMove=_ref2.onMove;
                    var activeSortable=_ref2.activeSortable;
                    var changed=_ref2.changed;
                    var cancel=_ref2.cancel;
                    if(!activeSortable.options.swap){
                        return;
                    }
                    var el=this.sortable.el;
                    var options=this.options;
                    if(target && target !== el){
                        var prevSwapEl=lastSwapEl;
                        if(onMove( target ) !== false){
                            toggleClass( target , options.swapClass , true );
                            lastSwapEl=target;
                        }else{
                            lastSwapEl=null;
                        }
                        if(prevSwapEl && prevSwapEl !== lastSwapEl){
                            toggleClass( prevSwapEl , options.swapClass , false );
                        }
                    }
                    changed();
                    completed( true );
                    cancel();
                } ,
                "drop" : function drop( _ref3 ){
                    var activeSortable=_ref3.activeSortable;
                    var putSortable=_ref3.putSortable;
                    var dragEl=_ref3.dragEl;
                    var toSortable=putSortable || this.sortable;
                    var options=this.options;
                    lastSwapEl && toggleClass( lastSwapEl , options.swapClass , false );
                    if(lastSwapEl && (options.swap || putSortable && putSortable.options.swap)){
                        if(dragEl !== lastSwapEl){
                            toSortable.captureAnimationState();
                            if(toSortable !== activeSortable){
                                activeSortable.captureAnimationState();
                            }
                            swapNodes( dragEl , lastSwapEl );
                            toSortable.animateAll();
                            if(toSortable !== activeSortable){
                                activeSortable.animateAll();
                            }
                        }
                    }
                } ,
                "nulling" : function nulling(){
                    lastSwapEl=null;
                }
            };
            return(_extends( Swap , {
                    "pluginName" : 'swap' ,
                    "eventProperties" : function eventProperties(){
                        return({"swapItem" : lastSwapEl});
                    }
                } ));
        }
        function swapNodes( n1 , n2 ){
            var p1=n1.parentNode;
            var p2=n2.parentNode;
            var i1;
            var i2;
            if(!p1 || !p2 || p1.isEqualNode( n2 ) || p2.isEqualNode( n1 )){
                return;
            }
            i1=index( n1 );
            i2=index( n2 );
            if(p1.isEqualNode( p2 ) && i1 < i2){
                i2++;
            }
            p1.insertBefore( n2 , p1.children[i1] );
            p2.insertBefore( n1 , p2.children[i2] );
        }
        var multiDragElements=[];
        var multiDragClones=[];
        var lastMultiDragSelect;
        var multiDragSortable;
        var initialFolding=false;
        var folding=false;
        var dragStarted=false;
        var dragEl$1;
        var clonesFromRect;
        var clonesHidden;
        function MultiDragPlugin(){
            function MultiDrag( sortable ){
                for(var fn in this){
                    if(fn.charAt( 0 ) === '_' &&  typeof this[fn] === 'function'){
                        this[fn]=this[fn].bind( this );
                    }
                }
                if(!sortable.options.avoidImplicitDeselect){
                    if(sortable.options.supportPointer){
                        on( document , 'pointerup' , this._deselectMultiDrag );
                    }else{
                        on( document , 'mouseup' , this._deselectMultiDrag );
                        on( document , 'touchend' , this._deselectMultiDrag );
                    }
                }
                on( document , 'keydown' , this._checkKeyDown );
                on( document , 'keyup' , this._checkKeyUp );
                this.defaults={
                    "selectedClass" : 'sortable-selected' ,
                    "multiDragKey" : null ,
                    "avoidImplicitDeselect" : false ,
                    "setData" : function setData( dataTransfer , dragEl ){
                        var data='';
                        if(multiDragElements.length && multiDragSortable === sortable){
                            multiDragElements.forEach( function( multiDragElement , i ){
                                    data+=(!i ? ( '' ) : ( ', ' )) + multiDragElement.textContent;
                                } );
                        }else{
                            data=dragEl.textContent;
                        }
                        dataTransfer.setData( 'Text' , data );
                    }
                };
            }
            MultiDrag.prototype={
                "multiDragKeyDown" : false ,
                "isMultiDrag" : false ,
                "delayStartGlobal" : function delayStartGlobal( _ref ){
                    var dragged=_ref.dragEl;
                    dragEl$1=dragged;
                } ,
                "delayEnded" : function delayEnded(){
                    this.isMultiDrag= ~multiDragElements.indexOf( dragEl$1 );
                } ,
                "setupClone" : function setupClone( _ref2 ){
                    var sortable=_ref2.sortable;
                    var cancel=_ref2.cancel;
                    if(!this.isMultiDrag){
                        return;
                    }
                    for( var i=0 ; i < multiDragElements.length ; i++ ){
                        multiDragClones.push( clone( multiDragElements[i] ) );
                        multiDragClones[i].sortableIndex=multiDragElements[i].sortableIndex;
                        multiDragClones[i].draggable=false;
                        multiDragClones[i].style['will-change']='';
                        toggleClass( multiDragClones[i] , this.options.selectedClass , false );
                        multiDragElements[i] === dragEl$1 && toggleClass( multiDragClones[i] , this.options.chosenClass , false );
                    }
                    sortable._hideClone();
                    cancel();
                } ,
                "clone" : function clone( _ref3 ){
                    var sortable=_ref3.sortable;
                    var rootEl=_ref3.rootEl;
                    var dispatchSortableEvent=_ref3.dispatchSortableEvent;
                    var cancel=_ref3.cancel;
                    if(!this.isMultiDrag){
                        return;
                    }
                    if(!this.options.removeCloneOnHide){
                        if(multiDragElements.length && multiDragSortable === sortable){
                            insertMultiDragClones( true , rootEl );
                            dispatchSortableEvent( 'clone' );
                            cancel();
                        }
                    }
                } ,
                "showClone" : function showClone( _ref4 ){
                    var cloneNowShown=_ref4.cloneNowShown;
                    var rootEl=_ref4.rootEl;
                    var cancel=_ref4.cancel;
                    if(!this.isMultiDrag){
                        return;
                    }
                    insertMultiDragClones( false , rootEl );
                    multiDragClones.forEach( function( clone ){
                            css( clone , 'display' , '' );
                        } );
                    cloneNowShown();
                    clonesHidden=false;
                    cancel();
                } ,
                "hideClone" : function hideClone( _ref5 ){
                    var _this=this;
                    var sortable=_ref5.sortable;
                    var cloneNowHidden=_ref5.cloneNowHidden;
                    var cancel=_ref5.cancel;
                    if(!this.isMultiDrag){
                        return;
                    }
                    multiDragClones.forEach( function( clone ){
                            css( clone , 'display' , 'none' );
                            if(_this.options.removeCloneOnHide && clone.parentNode){
                                clone.parentNode.removeChild( clone );
                            }
                        } );
                    cloneNowHidden();
                    clonesHidden=true;
                    cancel();
                } ,
                "dragStartGlobal" : function dragStartGlobal( _ref6 ){
                    var sortable=_ref6.sortable;
                    if(!this.isMultiDrag && multiDragSortable){
                        multiDragSortable.multiDrag._deselectMultiDrag();
                    }
                    multiDragElements.forEach( function( multiDragElement ){
                            multiDragElement.sortableIndex=index( multiDragElement );
                        } );
                    multiDragElements=multiDragElements.sort( function( a , b ){
                        return(a.sortableIndex - b.sortableIndex);
                    } );
                    dragStarted=true;
                } ,
                "dragStarted" : function dragStarted( _ref7 ){
                    var _this2=this;
                    var sortable=_ref7.sortable;
                    if(!this.isMultiDrag){
                        return;
                    }
                    if(this.options.sort){
                        sortable.captureAnimationState();
                        if(this.options.animation){
                            multiDragElements.forEach( function( multiDragElement ){
                                    if(multiDragElement === dragEl$1){
                                        return;
                                    }
                                    css( multiDragElement , 'position' , 'absolute' );
                                } );
                            var dragRect=getRect( dragEl$1 , false , true , true );
                            multiDragElements.forEach( function( multiDragElement ){
                                    if(multiDragElement === dragEl$1){
                                        return;
                                    }
                                    setRect( multiDragElement , dragRect );
                                } );
                            folding=true;
                            initialFolding=true;
                        }
                    }
                    sortable.animateAll( function(){
                            folding=false;
                            initialFolding=false;
                            if(_this2.options.animation){
                                multiDragElements.forEach( function( multiDragElement ){
                                        unsetRect( multiDragElement );
                                    } );
                            }
                            if(_this2.options.sort){
                                removeMultiDragElements();
                            }
                        } );
                } ,
                "dragOver" : function dragOver( _ref8 ){
                    var target=_ref8.target;
                    var completed=_ref8.completed;
                    var cancel=_ref8.cancel;
                    if(folding &&  ~multiDragElements.indexOf( target )){
                        completed( false );
                        cancel();
                    }
                } ,
                "revert" : function revert( _ref9 ){
                    var fromSortable=_ref9.fromSortable;
                    var rootEl=_ref9.rootEl;
                    var sortable=_ref9.sortable;
                    var dragRect=_ref9.dragRect;
                    if(multiDragElements.length > 1){
                        multiDragElements.forEach( function( multiDragElement ){
                                sortable.addAnimationState( {"target" : multiDragElement ,"rect" : folding ? ( getRect( multiDragElement ) ) : ( dragRect )} );
                                unsetRect( multiDragElement );
                                multiDragElement.fromRect=dragRect;
                                fromSortable.removeAnimationState( multiDragElement );
                            } );
                        folding=false;
                        insertMultiDragElements( !this.options.removeCloneOnHide , rootEl );
                    }
                } ,
                "dragOverCompleted" : function dragOverCompleted( _ref10 ){
                    var sortable=_ref10.sortable;
                    var isOwner=_ref10.isOwner;
                    var insertion=_ref10.insertion;
                    var activeSortable=_ref10.activeSortable;
                    var parentEl=_ref10.parentEl;
                    var putSortable=_ref10.putSortable;
                    var options=this.options;
                    if(insertion){
                        if(isOwner){
                            activeSortable._hideClone();
                        }
                        initialFolding=false;
                        if(options.animation
                               && multiDragElements.length > 1
                               && (folding
                                   || !isOwner
                                       && !activeSortable.options.sort
                                       && !putSortable)
                        ){
                            var dragRectAbsolute=getRect( dragEl$1 , false , true , true );
                            multiDragElements.forEach( function( multiDragElement ){
                                    if(multiDragElement === dragEl$1){
                                        return;
                                    }
                                    setRect( multiDragElement , dragRectAbsolute );
                                    parentEl.appendChild( multiDragElement );
                                } );
                            folding=true;
                        }
                        if(!isOwner){
                            if(!folding){
                                removeMultiDragElements();
                            }
                            if(multiDragElements.length > 1){
                                var clonesHiddenBefore=clonesHidden;
                                activeSortable._showClone( sortable );
                                if(activeSortable.options.animation && !clonesHidden && clonesHiddenBefore){
                                    multiDragClones.forEach( function( clone ){
                                            activeSortable.addAnimationState( {"target" : clone ,"rect" : clonesFromRect} );
                                            clone.fromRect=clonesFromRect;
                                            clone.thisAnimationDuration=null;
                                        } );
                                }
                            }else{
                                activeSortable._showClone( sortable );
                            }
                        }
                    }
                } ,
                "dragOverAnimationCapture" : function dragOverAnimationCapture( _ref11 ){
                    var dragRect=_ref11.dragRect;
                    var isOwner=_ref11.isOwner;
                    var activeSortable=_ref11.activeSortable;
                    multiDragElements.forEach( function( multiDragElement ){
                            multiDragElement.thisAnimationDuration=null;
                        } );
                    if(activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag){
                        clonesFromRect=_extends( {} , dragRect );
                        var dragMatrix=matrix( dragEl$1 , true );
                        clonesFromRect.top-=dragMatrix.f;
                        clonesFromRect.left-=dragMatrix.e;
                    }
                } ,
                "dragOverAnimationComplete" : function dragOverAnimationComplete(){
                    if(folding){
                        folding=false;
                        removeMultiDragElements();
                    }
                } ,
                "drop" : function drop( _ref12 ){
                    var evt=_ref12.originalEvent;
                    var rootEl=_ref12.rootEl;
                    var parentEl=_ref12.parentEl;
                    var sortable=_ref12.sortable;
                    var dispatchSortableEvent=_ref12.dispatchSortableEvent;
                    var oldIndex=_ref12.oldIndex;
                    var putSortable=_ref12.putSortable;
                    var toSortable=putSortable || this.sortable;
                    if(!evt){
                        return;
                    }
                    var options=this.options;
                    var children=parentEl.children;
                    if(!dragStarted){
                        if(options.multiDragKey && !this.multiDragKeyDown){
                            this._deselectMultiDrag();
                        }
                        toggleClass( dragEl$1 , options.selectedClass , !( ~multiDragElements.indexOf( dragEl$1 )) );
                        if(!( ~multiDragElements.indexOf( dragEl$1 ))){
                            multiDragElements.push( dragEl$1 );
                            dispatchEvent( {"sortable" : sortable ,"rootEl" : rootEl ,"name" : 'select' ,"targetEl" : dragEl$1 ,"originalEvent" : evt} );
                            if(evt.shiftKey && lastMultiDragSelect && sortable.el.contains( lastMultiDragSelect )){
                                var lastIndex=index( lastMultiDragSelect );
                                var currentIndex=index( dragEl$1 );
                                if( ~lastIndex &&  ~currentIndex && lastIndex !== currentIndex){
                                    var n;
                                    var i;
                                    if(currentIndex > lastIndex){
                                        i=lastIndex;
                                        n=currentIndex;
                                    }else{
                                        i=currentIndex;
                                        n=lastIndex + 1;
                                    }
                                    for(  ; i < n ; i++ ){
                                        if( ~multiDragElements.indexOf( children[i] )){
                                            continue;
                                        }
                                        toggleClass( children[i] , options.selectedClass , true );
                                        multiDragElements.push( children[i] );
                                        dispatchEvent( {"sortable" : sortable ,"rootEl" : rootEl ,"name" : 'select' ,"targetEl" : children[i] ,"originalEvent" : evt} );
                                    }
                                }
                            }else{
                                lastMultiDragSelect=dragEl$1;
                            }
                            multiDragSortable=toSortable;
                        }else{
                            multiDragElements.splice( multiDragElements.indexOf( dragEl$1 ) , 1 );
                            lastMultiDragSelect=null;
                            dispatchEvent( {"sortable" : sortable ,"rootEl" : rootEl ,"name" : 'deselect' ,"targetEl" : dragEl$1 ,"originalEvent" : evt} );
                        }
                    }
                    if(dragStarted && this.isMultiDrag){
                        folding=false;
                        if((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1){
                            var dragRect=getRect( dragEl$1 );
                            var multiDragIndex=index( dragEl$1 , ':not(.' + this.options.selectedClass + ')' );
                            if(!initialFolding && options.animation){
                                dragEl$1.thisAnimationDuration=null;
                            }
                            toSortable.captureAnimationState();
                            if(!initialFolding){
                                if(options.animation){
                                    dragEl$1.fromRect=dragRect;
                                    multiDragElements.forEach( function( multiDragElement ){
                                            multiDragElement.thisAnimationDuration=null;
                                            if(multiDragElement !== dragEl$1){
                                                var rect=folding ? ( getRect( multiDragElement ) ) : ( dragRect );
                                                multiDragElement.fromRect=rect;
                                                toSortable.addAnimationState( {"target" : multiDragElement ,"rect" : rect} );
                                            }
                                        } );
                                }
                                removeMultiDragElements();
                                multiDragElements.forEach( function( multiDragElement ){
                                        if(children[multiDragIndex]){
                                            parentEl.insertBefore( multiDragElement , children[multiDragIndex] );
                                        }else{
                                            parentEl.appendChild( multiDragElement );
                                        }
                                        multiDragIndex++;
                                    } );
                                if(oldIndex === index( dragEl$1 )){
                                    var update=false;
                                    multiDragElements.forEach( function( multiDragElement ){
                                            if(multiDragElement.sortableIndex !== index( multiDragElement )){
                                                update=true;
                                                return;
                                            }
                                        } );
                                    if(update){
                                        dispatchSortableEvent( 'update' );
                                        dispatchSortableEvent( 'sort' );
                                    }
                                }
                            }
                            multiDragElements.forEach( function( multiDragElement ){
                                    unsetRect( multiDragElement );
                                } );
                            toSortable.animateAll();
                        }
                        multiDragSortable=toSortable;
                    }
                    if(rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone'){
                        multiDragClones.forEach( function( clone ){
                                clone.parentNode && clone.parentNode.removeChild( clone );
                            } );
                    }
                } ,
                "nullingGlobal" : function nullingGlobal(){
                    this.isMultiDrag=dragStarted=false;
                    multiDragClones.length=0;
                } ,
                "destroyGlobal" : function destroyGlobal(){
                    this._deselectMultiDrag();
                    off( document , 'pointerup' , this._deselectMultiDrag );
                    off( document , 'mouseup' , this._deselectMultiDrag );
                    off( document , 'touchend' , this._deselectMultiDrag );
                    off( document , 'keydown' , this._checkKeyDown );
                    off( document , 'keyup' , this._checkKeyUp );
                } ,
                "_deselectMultiDrag" : function _deselectMultiDrag( evt ){
                    if( typeof dragStarted !== "undefined" && dragStarted){
                        return;
                    }
                    if(multiDragSortable !== this.sortable){
                        return;
                    }
                    if(evt && closest( evt.target , this.options.draggable , this.sortable.el , false )){
                        return;
                    }
                    if(evt && evt.button !== 0){
                        return;
                    }
                    while(multiDragElements.length){
                        var el=multiDragElements[0];
                        toggleClass( el , this.options.selectedClass , false );
                        multiDragElements.shift();
                        dispatchEvent( {"sortable" : this.sortable ,"rootEl" : this.sortable.el ,"name" : 'deselect' ,"targetEl" : el ,"originalEvent" : evt} );
                    }
                } ,
                "_checkKeyDown" : function _checkKeyDown( evt ){
                    if(evt.key === this.options.multiDragKey){
                        this.multiDragKeyDown=true;
                    }
                } ,
                "_checkKeyUp" : function _checkKeyUp( evt ){
                    if(evt.key === this.options.multiDragKey){
                        this.multiDragKeyDown=false;
                    }
                }
            };
            return(_extends( MultiDrag , {
                    "pluginName" : 'multiDrag' ,
                    "utils" : {
                         /*#
                          * Selects the provided multi-drag item
                          * @param  {HTMLElement} el    The element to be selected
                         */
                        "select" : function select( el ){
                            var sortable=el.parentNode[expando];
                            if(!sortable || !sortable.options.multiDrag ||  ~multiDragElements.indexOf( el )){
                                return;
                            }
                            if(multiDragSortable && multiDragSortable !== sortable){
                                multiDragSortable.multiDrag._deselectMultiDrag();
                                multiDragSortable=sortable;
                            }
                            toggleClass( el , sortable.options.selectedClass , true );
                            multiDragElements.push( el );
                        } ,
                         /*#
                          * Deselects the provided multi-drag item
                          * @param  {HTMLElement} el    The element to be deselected
                         */
                        "deselect" : function deselect( el ){
                            var sortable=el.parentNode[expando];
                            var index=multiDragElements.indexOf( el );
                            if(!sortable || !sortable.options.multiDrag || !( ~index)){
                                return;
                            }
                            toggleClass( el , sortable.options.selectedClass , false );
                            multiDragElements.splice( index , 1 );
                        }
                    } ,
                    "eventProperties" : function eventProperties(){
                        var _this3=this;
                        var oldIndicies=[];
                        var newIndicies=[];
                        multiDragElements.forEach( function( multiDragElement ){
                                oldIndicies.push( {"multiDragElement" : multiDragElement ,"index" : multiDragElement.sortableIndex} );
                                var newIndex;
                                if(folding && multiDragElement !== dragEl$1){
                                    newIndex=-1;
                                }else if(folding){
                                    newIndex=index( multiDragElement , ':not(.' + _this3.options.selectedClass + ')' );
                                }else{
                                    newIndex=index( multiDragElement );
                                }
                                newIndicies.push( {"multiDragElement" : multiDragElement ,"index" : newIndex} );
                            } );
                        return({
                                "items" : _toConsumableArray( multiDragElements ) ,
                                "clones" : [].concat( multiDragClones ) ,
                                "oldIndicies" : oldIndicies ,
                                "newIndicies" : newIndicies
                            });
                    } ,
                    "optionListeners" : {
                        "multiDragKey" : function multiDragKey( key ){
                            key=key.toLowerCase();
                            if(key === 'ctrl'){
                                key='Control';
                            }else if(key.length > 1){
                                key=key.charAt( 0 ).toUpperCase() + key.substr( 1 );
                            }
                            return key;
                        }
                    }
                } ));
        }
        function insertMultiDragElements( clonesInserted , rootEl ){
            multiDragElements.forEach( function( multiDragElement , i ){
                    var target=rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? ( Number( i ) ) : ( 0 ))];
                    if(target){
                        rootEl.insertBefore( multiDragElement , target );
                    }else{
                        rootEl.appendChild( multiDragElement );
                    }
                } );
        }
        /*#
          * Insert multi-drag clones
          * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
          * @param  {HTMLElement} rootEl
        */
        function insertMultiDragClones( elementsInserted , rootEl ){
            multiDragClones.forEach( function( clone , i ){
                    var target=rootEl.children[clone.sortableIndex + (elementsInserted ? ( Number( i ) ) : ( 0 ))];
                    if(target){
                        rootEl.insertBefore( clone , target );
                    }else{
                        rootEl.appendChild( clone );
                    }
                } );
        }
        function removeMultiDragElements(){
            multiDragElements.forEach( function( multiDragElement ){
                    if(multiDragElement === dragEl$1){
                        return;
                    }
                    multiDragElement.parentNode && multiDragElement.parentNode.removeChild( multiDragElement );
                } );
        }
        Sortable.mount( new AutoScrollPlugin() );
        Sortable.mount( Remove , Revert );
        Sortable.mount( new SwapPlugin() );
        Sortable.mount( new MultiDragPlugin() );
        return Sortable;
    } );