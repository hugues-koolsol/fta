<?php
define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
start_session_messages();
$o1='';
$a=array('title' => 'login','description' => 'login' );
$o1=html_header1($a);
print($o1);$o1='';
?>
   <table>
     <tr>
       <td></td>
       <td colspan="2">
        <a href="javascript:insertSource('choix');">Choix</a>
        <a href="javascript:insertSource('boucle');">Boucle</a>
       </td>
     <tr>
       <td style="max-width:100px;">
         <button onclick="charger('source1.txt')">test.html</button>
         <button onclick="charger('source2.txt')">test.js</button>
         <button onclick="charger('source3.txt')">test.php</button>
         <button onclick="charger('source4.txt')">aa_login_test</button>
         <button onclick="charger('source5.txt')">index_test</button>
         <button onclick="charger('source6.txt')">index_source_test</button>
       </td>
       <td>
         <!-- textarea id="zonesource" class="yytextSmall" cols="100" rows="60" spellcheck="false"></textarea -->
         <div id="zonesource" class="yytextSmall" spellcheck="false" contenteditable style="overflow:scroll;white-space: pre;padding:0 3px;height:600px;width:600px;"></div>
         <div>
          <button onclick="enregistrer()">Enregistrer</button>
         </div>
       </td>
       <td style="vertical-align: text-top;">
         <textarea id="normalise" class="yytextSmall" cols="100" rows="10" spellcheck="false"></textarea>
       </td>
     </tr>
     <tr>
       <td colspan="3">
         <div id="message_erreur"></div>
       </td>
     </tr>
   </table>
<script>
"use strict";

var global_editeur_derniere_valeur_selecStart=0;
var global_editeur_derniere_valeur_selectEnd=0;
var global_editeur_debut_texte='';
var global_editeur_fin_texte='';
var global_editeur_debut_texte_tab=[];
var global_editeur_scrolltop=0;


function selectTextareaLine(tarea,lineNum) {
    lineNum=lineNum<=0?1:lineNum;
    lineNum--; // array starts at 0
    var lines = tarea.innerHTML.split("\n"); // innerHTML

    // calculate start/end
    var startPos = 0, endPos = tarea.innerHTML.length; // innerHTML
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);

    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        var position=getCaretCoordinates(tarea,tarea.selectionStart);
        if(position.hasOwnProperty('top')){
         var vraiTop=position.top-50;
         vraiTop=vraiTop<0?0:vraiTop;
         tarea.scrollTo(0,vraiTop);
        }
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}

function jumpToError(i){
 selectTextareaLine(document.getElementById('zonesource'),i)
}

//=====================================================================================================================
function displayMessages(){
// console.log(global_messages);
 for(var i=0;i<global_messages.errors.length;i++){
  document.getElementById('global_messages').innerHTML+='<div class="yyerror">'+global_messages.errors[i]+'</div>';
 }
 for(var i=0;i<global_messages.lines.length;i++){
  document.getElementById('global_messages').innerHTML+='<a href="javascript:jumpToError('+(global_messages.lines[i]+1)+')" class="yyerror">go to line '+global_messages.lines[i]+'</a>&nbsp;';
 }
}

//=====================================================================================================================
function compareNormalise(zoneSource,zoneNormalisee){
 var tab1=document.getElementById(zoneSource).innerHTML.split('\n'); // innerHTML
 var tab2=document.getElementById(zoneNormalisee).value.split('\n');
 if(tab1.length==tab2.length){
  for(var i=0;i<tab1.length;i++){
   if(tab1[i]!=tab2[i]){
    global_messages.lines.push(i);
    document.getElementById('global_messages').innerHTML+='<div class="yywarning">différence dans des sources en ligne '+(i+1)+'</div>';
    document.getElementById('global_messages').innerHTML+='<div class="yywarning">'+tab1[i].replace(/ /g,'░')+'</div>';
    document.getElementById('global_messages').innerHTML+='<div class="yywarning">'+tab2[i].replace(/ /g,'░')+'</div>';
    return;
   }
  }
  document.getElementById('global_messages').innerHTML+='<div class="yyinfo">Le source et le normalisé sont les mêmes</div>';
 }else{
  var goOn=true;
  for(var i=0;goOn && i<tab1.length && i<tab2.length ;i++){
   if(tab1[i]!=tab2[i]){
    global_messages.lines.push(i);
    document.getElementById('global_messages').innerHTML+='<div class="yywarning">ligne : '+(i+1)+'<br />'+tab1[i].replace(/ /g,'░')+'<br />'+tab2[i].replace(/ /g,'░')+'</div>';
    goOn=false;
   }
  }
  document.getElementById('global_messages').innerHTML+='<div class="yywarning">différence dans des sources en ligne </div>';

 }
}
//=====================================================================================================================
function memeHauteur(normalise,source){
  var bou=document.getElementById(source).getBoundingClientRect();
  document.getElementById(normalise).style.height=bou.height+'px';
}
//=====================================================================================================================
function ajusteTailleTextareaContenantSource(normalise){
  try{
   var tab=document.getElementById(normalise).value.split('\n');
   var largeur=0;
   for(var i=0;i<tab.length;i++){
    if(tab[i].length>largeur){
     largeur=tab[i].length;
    }
   }
   largeur+=5;
   if(largeur>100 || largeur<=0){
    largeur=100;
   }
   document.getElementById(normalise).cols=largeur;
  }catch(e){
   //var tab=document.getElementById(normalise).innetHTML.split('\n');
  }
}
//=====================================================================================================================
function enregistrer(){
 clearMessages();
 var source=document.getElementById("zonesource");
 document.getElementById('message_erreur').innerHTML='';
 
 var testSourceReconstruit=compareSourceEtReconstruit(source.innerHTML); // innerHTML
 if(testSourceReconstruit.status==true){
  var arr=functionToArray(source.innerHTML,true); // innerHTML
  if(arr.status===true){
   arr=functionToArray(source.innerHTML,false); // innerHTML
   if(arr.status==true){
    var srcNormalise=arrayToFunctNormalize(arr.value,true);
    if(srcNormalise.status==true){
     document.getElementById("normalise").value=srcNormalise.value;
     ajusteTailleTextareaContenantSource('normalise');
     memeHauteur('normalise','zonesource');
     arr=writeSourceFile(source,arr);
     if(arr.status == false){
      console.log(arr);
     }else{
      compareNormalise('zonesource','normalise');
     }
    }else{
      console.log(arr);
    }
   }
  }else{
   if(arr.levelError && arr.levelError===true){
    document.getElementById('message_erreur').innerHTML+='\n'+arr.message;
   }
   if(arr.message && arr.message!==''){
    document.getElementById('message_erreur').innerHTML+='\n'+arr.message;
   }
  
   var srcNormalise=arrayToFunctNormalize(arr.value,true);
   if(srcNormalise.status==true){
    document.getElementById("normalise").innerHTML=srcNormalise.value; // innerHTML
    ajusteTailleTextareaContenantSource('normalise');
    memeHauteur('normalise','zonesource');
   }
  }
 }else{
  clearMessages();
  var arr=functionToArray(source.innerHTML,false); // innerHTML
  if(arr.status===true){
   var srcNormalise=arrayToFunctNormalize(arr.value,true);
   if(srcNormalise.status==true){
    document.getElementById("normalise").value=srcNormalise.value;
    var obj=convertSource(source,arr);
    ajusteTailleTextareaContenantSource('normalise');
    memeHauteur('normalise','zonesource');
    compareNormalise('zonesource','normalise');
   }else{
    debugger;
   }
  }
 }
 displayMessages()
}
//=====================================================================================================================
function afficherFichierSource(source){
 if(source.status==true){
  var zoneSource=document.getElementById(source.nomZone);
  zoneSource.innerHTML=source.value; // innerHTML
  ajusteTailleTextareaContenantSource(source.nomZone);
  razEditeur()
 }else{
  console.log(source);
 }
}
//=====================================================================================================================
function charger(nomsource){
 clearMessages();
 document.getElementById('normalise').value='';
 chargerFichierSource(nomsource,afficherFichierSource,'zonesource');
}



function getCaretCoordinates(element, position){ //, options) {
  var isBrowser = (typeof window !== 'undefined');
  var isFirefox = (isBrowser && window.mozInnerScreenX != null);

  if (!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }


  // The mirror div will replicate the textarea's style
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9

  // Default textarea styles
  style.whiteSpace = 'pre-wrap';
  style.wordWrap = 'break-word';  // only for textarea-s

  // Position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  style.visibility = 'hidden';  // not 'display: none' because we want rendering
  var properties = [
    'direction',  // RTL support
    'boxSizing',
    'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY',  // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',  // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing',

    'tabSize',
    'MozTabSize'

  ];


  // Transfer the element's properties to the div
  properties.forEach(function (prop) {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  document.body.removeChild(div);

  return coordinates;
}
//=====================================================================================================================
function insertSource(nomFonction){
 var i=0;
 var j=0;
 var k=0;
 var t='';
 var toAdd='';
 var espaces='';
 var zoneSource=document.getElementById('zonesource');
 if(nomFonction=='choix' || nomFonction=='boucle' ){
  if(global_editeur_derniere_valeur_selecStart==global_editeur_derniere_valeur_selectEnd){
   j=-1; 
   if(global_editeur_debut_texte_tab.length>0){
    espaces=global_editeur_debut_texte_tab[global_editeur_debut_texte_tab.length-1][0];
    for(i=0;i<espaces.length;i++){
     if( espaces.substr(i,1)==' ' || espaces.substr(i,1)=='\t' ){
      k=i+1;
     }else{
      j=i;
     }
    }
   }    
   if(j<0 && espaces.length==k){
    if(nomFonction=='choix'){
     
     toAdd =             'choix(';
     toAdd+='\n'+espaces+'  si(';
     toAdd+='\n'+espaces+'    condition(';
     toAdd+='\n'+espaces+'      non(';
     toAdd+='\n'+espaces+'        ( egal( vrai , vrai ) ),';
     toAdd+='\n'+espaces+'        et( egal( vrai , vrai ) )';
     toAdd+='\n'+espaces+'      )';
     toAdd+='\n'+espaces+'    ),';
     toAdd+='\n'+espaces+'    alors(';
     toAdd+='\n'+espaces+'      affecte( a , 1 )';
     toAdd+='\n'+espaces+'    )';
     toAdd+='\n'+espaces+'  ),';
     toAdd+='\n'+espaces+'  sinonsi(';
     toAdd+='\n'+espaces+'    condition( (true) ),';
     toAdd+='\n'+espaces+'    alors( affecte( a , 1 ) )';
     toAdd+='\n'+espaces+'  ),';
     toAdd+='\n'+espaces+'  sinon(';
     toAdd+='\n'+espaces+'    alors( affecte( a , 1 ) )';
     toAdd+='\n'+espaces+'  )';
     toAdd+='\n'+espaces+'),';
     
    }else if(nomFonction=='boucle'){

     toAdd =             'boucle(';
     toAdd+='\n'+espaces+'  initialisation( affecte( i , 0 ) ),';
     toAdd+='\n'+espaces+'  condition( inf( i , tab.length ) ),';
     toAdd+='\n'+espaces+'  increment( affecte( i , i+1 ) ),';
     toAdd+='\n'+espaces+'  faire(';
     toAdd+='\n'+espaces+'    affecte( a , 1 )';
     toAdd+='\n'+espaces+'  )';
     toAdd+='\n'+espaces+'),';

    }
    t=global_editeur_debut_texte+toAdd+global_editeur_fin_texte;
    zoneSource.innerHTML=t; // innerHTML
    zoneSource.select();
    zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
    zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart;
    initialisationEditeur();
    return;
//    alert(1);
   }
  }
  
 }
}
//=====================================================================================================================
function initialisationEditeur(){
 var i=0;
 var j=0;
 var tabtext=[];
 var toAdd='';
 var zoneSource=document.getElementById('zonesource');
 global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
 global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
 global_editeur_debut_texte=zoneSource.innerHTML.substr(0,zoneSource.selectionStart); // innerHTML
 tabtext=global_editeur_debut_texte.split('\n');
 global_editeur_debut_texte_tab=[];
 j=0;
 for(i=0;i<tabtext.length;i++){
  global_editeur_debut_texte_tab.push([tabtext[i],j]);
  j+=tabtext[i].length+1;
 }
 global_editeur_fin_texte=zoneSource.innerHTML.substr(zoneSource.selectionStart); // innerHTML
}
//=====================================================================================================================
function razEditeur(){
 var zoneSource=document.getElementById('zonesource');
 global_editeur_derniere_valeur_selecStart=0;
 global_editeur_derniere_valeur_selectEnd=0;
 global_editeur_debut_texte='';
 global_editeur_debut_texte_tab=[];
 global_editeur_fin_texte=zoneSource.innerHTML.substr(zoneSource.selectionStart); // innerHTML
 global_editeur_scrolltop=0;
}
//=====================================================================================================================
document.getElementById('zonesource').onkeydown=function(e){
 initialisationEditeur();
 return;
}
//=====================================================================================================================
document.getElementById('zonesource').onclick=function(e){
 initialisationEditeur();
 return;
}
//=====================================================================================================================
/*
document.getElementById('zonesource').onscroll=recupereScroll;
function recupereScroll(e){
 global_editeur_scrolltop=this.scrollTop;
 console.log('top récuperé = '+global_editeur_scrolltop);
 return;
};
*/
//=====================================================================================================================
document.getElementById('zonesource').onkeydown=function(e){
// global_editeur_scrolltop=document.getElementById('zonesource').scrollTop;
 global_editeur_scrolltop=this.scrollTop;
 
 console.log('dans onkeydown global_editeur_scrolltop='+global_editeur_scrolltop);
 
}
//=====================================================================================================================
document.getElementById('zonesource').onkeyup=analyseKeyUp;
function analyseKeyUp(e){
// console.log('avant tout: this.scrollTop='+this.scrollTop+', global_editeur_scrolltop='+global_editeur_scrolltop+','+document.getElementById('zonesource').scrollTop);
// console.log('e.keyCode='+e.keyCode);
// initialisationEditeur();
 var i=0;
 var j=0;
 var tabtext=[];
 if(e.keyCode==13){
   var zoneSource=document.getElementById('zonesource');
   console.log('zoneSource.selectionStart='+zoneSource.selectionStart)
   global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
   global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
   global_editeur_debut_texte=zoneSource.innerHTML.substr(0,zoneSource.selectionStart); // innerHTML
   
   console.log('\n','global_editeur_debut_texte='+global_editeur_debut_texte,'\n');
   
   tabtext=global_editeur_debut_texte.split('\n');
   global_editeur_debut_texte_tab=[];
   j=0;
   for(i=0;i<tabtext.length;i++){
    global_editeur_debut_texte_tab.push([tabtext[i],j]);
    j+=tabtext[i].length+1;
   }

  console.log('global_editeur_debut_texte_tab.length='+global_editeur_debut_texte_tab.length);
  if(global_editeur_debut_texte_tab.length>=2){
   var textPrec=global_editeur_debut_texte_tab[global_editeur_debut_texte_tab.length-2][0];
   console.log(textPrec);
   if(textPrec!=''){
    var pos=0;
    var toAdd='';
    for(i=0;i<textPrec.length;i++){
     if(textPrec.substr(i,1)!=' '){
      pos=i;
      break;
     }
     toAdd+=' ';
    }
    if(pos>=0){
     var offSetBack=0;
     if(textPrec.substr(textPrec.length-1,1)=='(' ){
      if(global_editeur_fin_texte.substr(0,1)==')'){
       offSetBack=toAdd.length+1;
       toAdd+='  \n'+toAdd;
      }else{
       toAdd+='  ';
      }
     }else{
      if(global_editeur_fin_texte.substr(0,1)==')'){
        if(toAdd.length>2){
//         toAdd=toAdd.substr(0,toAdd.length-2);
        }
      }
     }
     console.log('%cyoupiii','color:lime');
//     this.style.overflow='overlay';
     this.innerHTML=global_editeur_debut_texte+toAdd+global_editeur_fin_texte; // innerHTML
     global_editeur_derniere_valeur_selecStart=global_editeur_derniere_valeur_selecStart+toAdd.length-offSetBack;
     this.selectionStart=global_editeur_derniere_valeur_selecStart;
     this.selectionEnd=global_editeur_derniere_valeur_selecStart;
     global_editeur_derniere_valeur_selecStart=this.selectionStart;
     global_editeur_derniere_valeur_selectEnd=this.selectionEnd;
     console.log('avant initialisation: this.scrollTop='+this.scrollTop+', global_editeur_scrolltop='+global_editeur_scrolltop);
     initialisationEditeur();
     console.log('apres initialisation: this.scrollTop='+this.scrollTop+', global_editeur_scrolltop='+global_editeur_scrolltop);
//     this.scrollTop=global_editeur_scrolltop;
//     this.style.overflow='scroll';
    }
   }
  }else{
   console.log('%cRaaaah','color:red');
  }
 }else{
  initialisationEditeur();
 }
 return false;
}

document.addEventListener("DOMContentLoaded", function () {
  charger('source1.txt');
  // Your code goes here
});



</script>
<?php
$a=array('js' => array('js/php.js','js/javascript.js','js/html.js'));
$o1=concat($o1,html_footer1($a));
print($o1);
$o1='';
