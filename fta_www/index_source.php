<?php
define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
start_session_messages();
$o1='';
$a=array('title' => 'index source','description' => 'index source' );
$o1=html_header1($a);
$o1.='<style>';
$o1.='#arrayed td{max-width:150px;overflow-x:auto;}';
$o1.='</style>';
print($o1);$o1='';
?>
   <table>
     <tr>
       <td></td>
       <td colspan="2">
        <button onclick="enregistrer()">Enregistrer</button>
        <a href="javascript:insertSource('choix');">Choix</a>
        <a href="javascript:insertSource('boucle');">Boucle</a>
        <a href="javascript:parentheses();" title="repérer la parenthèse fermante correspondante">(|...)</a>
        <a href="javascript:decaler('droite');">(|&gt;&gt;&gt;</a>
        <input type="text" id="nomDuSource" disabled="true" style="float:right;" />
        <button id="sauvegarderLeNormalise" onclick="sauvegardeTexteSource()" disabled="true" style="float:right;" data-fichiertexte="" >sauvegarder le texte normalise</button>         
       </td>
     <tr>
       <td id="zoneRevFiles" style="max-width:100px;overflow-x: hidden;">
         <button onclick="charger('source1.txt')" title="source1.txt">test.html</button>
         <button onclick="charger('source2.txt')" title="source2.txt">test.js</button>
         <button onclick="charger('source3.txt')" title="source3.txt">test.php</button>
         <button onclick="charger('source4.txt')" title="source4.txt">aa_login_test</button>
         <button onclick="charger('source5.txt')" title="source5.txt">index_test</button>
         <button onclick="charger('source6.txt')" title="source6.txt">index_source_test</button>
         <button onclick="charger('source7.txt')" title="source7.txt">test_factorielle</button>         
         <button onclick="charger('source8.txt')" title="source8.txt">todo</button>         
         
       </td>
       <td>
         <textarea id="zonesource" class="yytextSmall" cols="100" rows="60" spellcheck="false" style="height:85vh;padding:3px;"></textarea>
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
   <table id="arrayed"></table>
<script>
"use strict";

var global_editeur_derniere_valeur_selecStart=0;
var global_editeur_derniere_valeur_selectEnd=0;
var global_editeur_debut_texte='';
var global_editeur_fin_texte='';
var global_editeur_debut_texte_tab=[];
var global_editeur_scrolltop=0;
//=====================================================================================================================
function sauvegardeTexteSource(){
 var i=0;
 var c='';
 var obj={};
 if(document.getElementById('sauvegarderLeNormalise').getAttribute('data-fichiertexte')!=''){
  var nomDuSource=document.getElementById('nomDuSource').value;
  for(i=0;i<nomDuSource.length;i++){
   c=nomDuSource.substr(i,1);
   if(c=='/' || c=='\\' || c==':' || c=='*' || c=='?' || c=='"' || c=='<' || c=='>' || c=='|'){
    alert('Le caractère "'+c+'" n\'est pas autorisé ( tout comme /\\:*?"<>|');
    return;
   }else{
    if(!(c.charCodeAt(0)>=32 && c.charCodeAt(0)<127)){
     alert('Le caractère "'+c+'" n\'est pas autorisé ( tout comme /\\:*?"<>|');
     return;
    }
   }
  }
  obj=writeRevFile(nomDuSource,document.getElementById('normalise').value);
 }
 document.getElementById('sauvegarderLeNormalise').disabled=true;
}
//=====================================================================================================================
function decaler(direction){

 parentheses();
 if(global_editeur_derniere_valeur_selecStart<global_editeur_derniere_valeur_selectEnd){
  console.log(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd);
  var zoneSource=document.getElementById('zonesource');

  var texteDebut=zoneSource.value.substr(0,global_editeur_derniere_valeur_selecStart);
  console.log('"'+texteDebut+'"');
  var texteFin=zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
  console.log('"'+texteFin+'"');
  var texteSelectionne=zoneSource.value.substr(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd-global_editeur_derniere_valeur_selecStart);
//  console.log('"'+texteSelectionne+'"');
  var tab=texteSelectionne.split('\n');
  for(var i=0;i<tab.length;i++){
   if(tab[i].length>0){
    tab[i]='  '+tab[i];
   }
  }
  var nouveauTexteDecale=tab.join('\n');
//  console.log('"'+nouveauTexteDecale+'"');
  var nouveauTexte=texteDebut+nouveauTexteDecale+texteFin;
  zoneSource.value=nouveauTexte;
  zoneSource.select();
  zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
  
 }
 
}
//=====================================================================================================================
function parentheses(){
 if(global_editeur_derniere_valeur_selecStart<0){
  return;
 }
// console.log('global_editeur_derniere_valeur_selecStart='+global_editeur_derniere_valeur_selecStart);
 var zoneSource=document.getElementById('zonesource');
 var texte=zoneSource.value;
 if(texte.substr(global_editeur_derniere_valeur_selecStart-1,1)=='('){
  var arr=functionToArray(texte,false);
//  console.log(global_editeur_derniere_valeur_selecStart);
//  console.log(arr);
  for(var i=0;i<arr.value.length;i++){
   if(global_editeur_derniere_valeur_selecStart-1==arr.value[i][22]){
//    console.log('i='+i+','+JSON.stringify(arr.value[i]))
    zoneSource.select();
    zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
    zoneSource.selectionEnd=arr.value[i][23];
    initialisationEditeur();
    return;
   }
  }

 }

}
//=====================================================================================================================
function selectTextareaLine(tarea,lineNum) {
 lineNum=lineNum<=0?1:lineNum;
 lineNum--; // array starts at 0
 var lines = tarea.value.split("\n");

 // calculate start/end
 var startPos = 0, endPos = tarea.value.length;
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
 if(document.selection && document.selection.createRange){
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
//=====================================================================================================================
function jumpToError(i){
 selectTextareaLine(document.getElementById('zonesource'),i)
}
//=====================================================================================================================
function compareNormalise(zoneSource,zoneNormalisee){
 var tab1=document.getElementById(zoneSource).value.split('\n');
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
  document.getElementById('sauvegarderLeNormalise').disabled=false;
  document.getElementById('nomDuSource').disabled=false;
  
  
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
 document.getElementById('sauvegarderLeNormalise').disabled=true;
 clearMessages();
 var source=document.getElementById("zonesource");
 document.getElementById('message_erreur').innerHTML='';
 
 var testSourceReconstruit=compareSourceEtReconstruit(source.value);
 if(testSourceReconstruit.status==true){
  var arr=functionToArray(source.value,true);
  voirTableau(arr.value,'arrayed');
  if(arr.status===true){
   arr=functionToArray(source.value,false);
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
    document.getElementById("normalise").value=srcNormalise.value;
    ajusteTailleTextareaContenantSource('normalise');
    memeHauteur('normalise','zonesource');
   }
  }
 }else{
  clearMessages();
  var arr=functionToArray(source.value,false);
  if(arr.status===true){
   voirTableau(arr.value,'arrayed');
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
  zoneSource.value=source.value;
  ajusteTailleTextareaContenantSource(source.nomZone);
  razEditeur();
  document.getElementById('sauvegarderLeNormalise').disabled=true;
  document.getElementById('sauvegarderLeNormalise').setAttribute('data-fichiertexte',source.nomFichierSource);
  document.getElementById('nomDuSource').value=source.nomFichierSource;
  
 }else{
  console.log(source);
 }
}
//=====================================================================================================================
function chargerFichierRev(nomFichierSource){
 clearMessages();
 document.getElementById('sauvegarderLeNormalise').disabled=true;
 document.getElementById('normalise').value='';
 document.getElementById('zonesource').value='';
 loadRevFile(nomFichierSource,afficherFichierSource,'zonesource');
}
//=====================================================================================================================
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
    zoneSource.value=t;
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
 global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
 tabtext=global_editeur_debut_texte.split('\n');
 global_editeur_debut_texte_tab=[];
 j=0;
 for(i=0;i<tabtext.length;i++){
  global_editeur_debut_texte_tab.push([tabtext[i],j]);
  j+=tabtext[i].length+1;
 }
 global_editeur_fin_texte=zoneSource.value.substr(zoneSource.selectionStart);
}
//=====================================================================================================================
function razEditeur(){
 var zoneSource=document.getElementById('zonesource');
 global_editeur_derniere_valeur_selecStart=0;
 global_editeur_derniere_valeur_selectEnd=0;
 global_editeur_debut_texte='';
 global_editeur_debut_texte_tab=[];
 global_editeur_fin_texte=zoneSource.value.substr(zoneSource.selectionStart);
 global_editeur_scrolltop=0;
}
//=====================================================================================================================
document.getElementById('zonesource').onkeydown=function(e){
 initialisationEditeur();
 document.getElementById('sauvegarderLeNormalise').disabled=true;
 return;
}
//=====================================================================================================================
document.getElementById('zonesource').onclick=function(e){
 initialisationEditeur();
 document.getElementById('sauvegarderLeNormalise').disabled=true;
 return;
}
//=====================================================================================================================
document.getElementById('zonesource').onkeydown=function(e){
 document.getElementById('sauvegarderLeNormalise').disabled=true;
 global_editeur_scrolltop=this.scrollTop;
 return;
}
//=====================================================================================================================
document.getElementById('normalise').onclick=function(e){
 document.getElementById('sauvegarderLeNormalise').disabled=true;
 return;
}
//=====================================================================================================================
document.getElementById('normalise').onkeydown=function(e){
 document.getElementById('sauvegarderLeNormalise').disabled=true;
 return;
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
//   console.log('zoneSource.selectionStart='+zoneSource.selectionStart)
   global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
   global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
   global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
   global_editeur_fin_texte=zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
   
//   console.log('\n','global_editeur_debut_texte='+global_editeur_debut_texte,'\n');
   
   tabtext=global_editeur_debut_texte.split('\n');
   global_editeur_debut_texte_tab=[];
   j=0;
   for(i=0;i<tabtext.length;i++){
    global_editeur_debut_texte_tab.push([tabtext[i],j]);
    j+=tabtext[i].length+1;
   }

//  console.log('global_editeur_debut_texte_tab.length='+global_editeur_debut_texte_tab.length);
  if(global_editeur_debut_texte_tab.length>=2){
   var textPrec=global_editeur_debut_texte_tab[global_editeur_debut_texte_tab.length-2][0];
//   console.log(textPrec);
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
//     console.log('%cyoupiii','color:lime');
//     this.style.overflow='overlay';
     this.value=global_editeur_debut_texte+toAdd+global_editeur_fin_texte;
     global_editeur_derniere_valeur_selecStart=global_editeur_derniere_valeur_selecStart+toAdd.length-offSetBack;
     this.selectionStart=global_editeur_derniere_valeur_selecStart;
     this.selectionEnd=global_editeur_derniere_valeur_selecStart;
     global_editeur_derniere_valeur_selecStart=this.selectionStart;
     global_editeur_derniere_valeur_selectEnd=this.selectionEnd;
//     console.log('avant initialisation: this.scrollTop='+this.scrollTop+', global_editeur_scrolltop='+global_editeur_scrolltop);
     initialisationEditeur();
//     console.log('apres initialisation: this.scrollTop='+this.scrollTop+', global_editeur_scrolltop='+global_editeur_scrolltop);
     this.scrollTop=global_editeur_scrolltop;
//     this.style.overflow='scroll';
    }
   }
  }else{
//   console.log('%cRaaaah','color:red');
  }
 }else{
  initialisationEditeur();
 }
 return false;
}
//=====================================================================================================================
function chargerLaListeDesSourcesRev(){
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?getRevFiles',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if(r.readyState != 4 || r.status != 200){
   if(r.status==500){
    if(global_messages['e500logged']==false){
     try{
//     console.log("r=",r);
//     console.log("r="+r.response);
      var errors=JSON.parse(r.responseText);
      var t='';
      for(var elem in errors.messages){
       global_messages['errors'].push(errors.messages[elem]);
      }
      global_messages['e500logged']=true;
      displayMessages();
      console.log(global_messages);
     }catch(e){
     }
    }
   }
   return;
  }
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
//    console.log(jsonRet);
    var t='';
    for(var idFile in jsonRet.files){
     t+='<button onclick="chargerFichierRev(\''+jsonRet.files[idFile]+'\')" title="'+jsonRet.files[idFile]+'">'+jsonRet.files[idFile]+'</button>';
    }
    document.getElementById('zoneRevFiles').innerHTML=t;
   }else{
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    alert('BAD job !');
    return;
   }
  }catch(e){
   var errors=JSON.parse(r.responseText);
   var t='';
   for(var elem in errors.messages){
    global_messages['errors'].push(errors.messages[elem]);
   }
   displayMessages();
   console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
   return;
  }
 };
 r.onerror=function(e){
  console.error('e=',e); /* whatever(); */
  return;
 }
 r.ontimeout=function(e){
  console.error('e=',e); /* whatever(); */
  return;
 }
 var ajax_param={
  call:{
   lib                       : 'core'   ,
   file                      : 'file'  ,
   funct                     : 'getRevFiles' ,
  },
 }
 try{
  r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 }catch(e){
  console.error('e=',e); /* whatever(); */
 }
 return logerreur({status:true});  
 
}
//=====================================================================================================================
document.addEventListener("DOMContentLoaded", function () {
  chargerLaListeDesSourcesRev('source1.txt');
  // Your code goes here
});



</script>
<?php
$a=array('js' => array('js/php.js','js/javascript.js','js/html.js','js/sql.js'));
$o1=concat($o1,html_footer1($a));
print($o1);
$o1='';
