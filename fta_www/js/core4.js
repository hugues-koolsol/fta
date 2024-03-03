"use strict";

// (typeof(b),egal('undefined')),et(d,egal(true))
var DEBUTCOMMENTAIRE='#';
var CRLF='\r\n';
var globale_LangueCourante='fr';
var global_messages={
 'e500logged' : false ,
 'errors'     : [] ,
 'warnings'   : [] ,
 'infos'      : [] ,
 'lines'      : [] ,
 'tabs'       : [] ,
 'ids'        : [] ,
 'calls'      : '' ,
 'data':{
  'matrice':[],
  'tableau':[],
  'sourceGenere':'',
  }
};

var motscles_fr={
 vrai_true : 'vrai'
};
var motscles_en={
 vrai_true : 'true'
};

//=====================================================================================================================
function clearMessages(){
 document.getElementById('global_messages').innerHTML='';
 global_messages={
  'errors':[],
  'warnings':[],
  'infos':[],
  'lines':[],
  'tabs':[],
  'ids':[],
  'calls':'',
  'data':{
   'matrice':[],
   'tableau':[],
   'sourceGenere':'',
  }
 }
}
//=====================================================================================================================
function logerreur(o){
 if(o.hasOwnProperty('status')){
  if(o.status===false){
   if(o.hasOwnProperty('message')){
    global_messages.errors.push(o.message)
   }
   if(o.hasOwnProperty('id')){
    global_messages.ids.push(o.id)
   }
  }else{
   if(o.hasOwnProperty('message')){
    if(o.message!=''){
     global_messages.infos.push(o.message)
    }
   }else if(o.hasOwnProperty('warning')){
    if(o.warning!=''){
     global_messages.warnings.push(o.warning)
    }
   }else{
   }
  }
 }
 if(o.hasOwnProperty('tabs')){
  global_messages.tabs.push(o.tabs)
 }
 if(o.line){
  global_messages.lines.push(o.line);
 }
 return o;
}
//=====================================================================================================================
function displayMessages(){
// console.log(global_messages);
 for(var i=0;i<global_messages.errors.length;i++){
  document.getElementById('global_messages').innerHTML+='<div class="yyerror">'+global_messages.errors[i]+'</div>';
 }
 for(var i=0;i<global_messages.warnings.length;i++){
  document.getElementById('global_messages').innerHTML+='<div class="yywarning">'+global_messages.warnings[i]+'</div>';
 }
 for(var i=0;i<global_messages.infos.length;i++){
  document.getElementById('global_messages').innerHTML+='<div class="yyinfo">'+global_messages.infos[i]+'</div>';
 }
 for(var i=0;i<global_messages.lines.length;i++){
  document.getElementById('global_messages').innerHTML+='<a href="javascript:jumpToError('+(global_messages.lines[i]+1)+')" class="yyerror" style="border:2px red outset;">go to line '+global_messages.lines[i]+'</a>&nbsp;';
 }
 var numLignePrecedente=-1;
 for(var i=0;i<global_messages.ids.length;i++){
  var id=global_messages.ids[i];
  if(id<global_messages.data.matrice.value.length){
   var ligneMatrice=global_messages.data.matrice.value[id];
   var caractereDebut=ligneMatrice[5];
   var numeroDeLigne=0;
   for(var j=caractereDebut;j>=0;j--){
    if(global_messages.data.tableau.out[j][0]=='\n'){
     numeroDeLigne++;
    }
   }
  }
  if(numeroDeLigne>0){
   if(numeroDeLigne!=numLignePrecedente){
    document.getElementById('global_messages').innerHTML+='<a href="javascript:jumpToError('+(numeroDeLigne+1)+')" class="yyerror" style="border:2px red outset;">go to line '+numeroDeLigne+'</a>&nbsp;';
    numLignePrecedente=numeroDeLigne;
   }
  }
  
 }
 
}
//=====================================================================================================================
function dogid(n){
 return document.getElementById(n);
}
//=====================================================================================================================
function echappConstante(t){
 return t.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'').replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t').replace(/\\\\r/g,'\\r');
}
//=====================================================================================================================
function concat(){
  var t='';
  var a=null;
  for( var a in arguments){
   t+=String(arguments[a]);
  }
  return t;
}
//=====================================================================================================================
function espaces(i){
 var t='\n';
 if(i>0){
  t+=' '.repeat(i);
 }
 return t;
}
var NBESPACESREV=3;
var NBESPACESSOURCEPRODUIT=4;
//=====================================================================================================================
function espacesnrev(optionCRLF,i){
 var t='';
 if(optionCRLF){
  t='\r\n';
 }else{
  t='\n';
 }
 if(i>0){
  t+=' '.repeat(NBESPACESREV).repeat(i);
 }
 return t;
}
//=====================================================================================================================
function espacesn(optionCRLF,i){
 var t='';
 if(optionCRLF){
  t='\r\n';
 }else{
  t='\n';
 }
 if(i>0){
  t+=' '.repeat(NBESPACESSOURCEPRODUIT).repeat(i);
 }
 return t;
}

//=====================================================================================================================
function espaces2(i){
 var t='\n';
 if(i>0){
  t+='  '.repeat(i);
 }
 return t;
}
//=====================================================================================================================
function voirTableau(tableau,nomTableParent){
//  0id	1val	2typ	3niv	4coQ	 5pre	 6der	 7cAv	 8cAp	 9cDe	 10pId	11nbE 12numEnfant 13profond 
// 16CoApeNet 17ComDeNet 18ComAvNet 19TypComApre 20TypComDeda 21ComAvan 22OuvePar 23FerPar
 var c='';
 var k=0;
 var l=0;
/* 
 var global_enteteTableau=[
  ['id','id'                                 ,''], // 00
  ['val','value'                             ,''],
  ['typ','type'                              ,''],
  ['niv','niveau'                            ,''],
  ['coQ','constante quotee'                  ,''],
  ['pre','position du premier caractère'     ,''], // 05
  ['der','position du dernier caractère'     ,''],
  ['cAv','commentaire avant'                 ,''],
  ['cAp','commentaire apres'                 ,''],
  ['cDe','commentaire dedans'                ,''],
  ['pId','Id du parent'                      ,''], // 10
  ['nbE','nombre d\'enfants'                 ,''],
  ['nuE','numéro enfants'                    ,''],
  ['nli','numeroLigne'                       ,''],
  ['lfP','numero ligne fermeture parenthese' ,''],
  ['pro','profondeur'                        ,''], // 15
  ['pop','position ouverture parenthese'     ,''],
  ['pfp','position fermeture parenthese'     ,''],
 ];
*/
//    console.log(tableau,JSON.stringify(tableau));  
 var arrayed=document.getElementById(nomTableParent);
 arrayed.innerHTML='';
 var newTr= document.createElement("tr");
 arrayed.appendChild(newTr);
 for(var j=0;j<global_enteteTableau.length;j++){
  var newTh= document.createElement("th");
  newTh.title=global_enteteTableau[j][1];
  newTh.style.fontSize='0.6em';
  newTr.appendChild(newTh);
  newTh.innerHTML=j+''+global_enteteTableau[j][0];
 }
 for(var k=0;k<tableau.length;k++){
  var newTr= document.createElement("tr");
  arrayed.appendChild(newTr);
  for(var j=0;j<tableau[k].length;j++){
   var newTd= document.createElement("td");
   if(typeof tableau[k][j] == 'string'){
    for(l=0;l<tableau[k][j].length;l++){
     c=tableau[k][j].substr(l,1);
     if(c.charCodeAt(0)==8203){
      newTd.style.backgroundColor='red';
      break;
     }
    }
   }
   newTr.appendChild(newTd);
   newTd.style.fontSize='0.6em';
   if(j>=7){
    newTd.style.verticalAlign='top';
    if(typeof tableau[k][j] == 'string'){
     newTd.innerHTML='<pre>'+tableau[k][j].replace(/\n/g,'&#9166;\n').replace(/ /g,'&#9604;')+'</pre>';
    }else{
     newTd.innerHTML=''+tableau[k][j]+'';
    }
/*    
   if(j>=10){
    newTd.style.verticalAlign='top';
    newTd.innerHTML='<span>'+tableau[k][j]+'</span>';
*/    
   }else if(j==2){
    newTd.style.verticalAlign='top';
    newTd.innerHTML='<pre>'+tableau[k][j].replace(/\n/g,'&#9166;\n')+'</pre>';
   }else{
    newTd.innerHTML='<span style="background:white;">'+tableau[k][j]+'</span>';
   }
  }
 }
}


//=====================================================================================================================
function compareSourceEtReconstruit(source){
  var nbCar=200; // doit être pair
  var i=0;
  var k=0;
  var arr=functionToArray(source,true);
  if(arr.status==true){
   
   var txt1=arrayToFunctNoComment(arr.value);
//   console.log('txt1.value=' , txt1.value , 'source=' , source );
   
   var sourceReconstruitAvecCommentaires=arrayToFunctWidthComment(arr.value);
//   console.log(' sourceReconstruitAvecCommentaires=' , sourceReconstruitAvecCommentaires );
   if(sourceReconstruitAvecCommentaires.value==source){
    return logerreur({status:true,situation:{fichier:'core.js',fonction:'compareSourceEtReconstruit'}});
   }else{
    
    
    
    for(var j=0;j<source.length;j++){
     if(source.substr(j,1)!=sourceReconstruitAvecCommentaires.value.substr(j,1)){
      console.log('caractère"'+source.substr(j,1)+'" en position='+j);
      k=j-nbCar/2; 
      if(k<0){
       k=0;
      }
      console.log('près de "'+source.substr(k,nbCar).replace(/\n/g,'⏎').replace(/\r/g,'⏎')+'" dans originale'); // &#9166;
      console.log('près de "'+sourceReconstruitAvecCommentaires.value.substr(k,nbCar).replace(/\n/g,'⏎').replace(/\r/g,'⏎')+'" dans reconstruit'); // &#9166;
      return logerreur({status:false,message:'le source et le source reconstruits ne sont pas les mêmes',situation:{fichier:'core.js',fonction:'compareSourceEtReconstruit'}});
      break;
     }
    }
    return logerreur({status:false,message:'le source et le source reconstruits ne sont pas les mêmes',situation:{fichier:'core.js',fonction:'compareSourceEtReconstruit'}});
   }
  }else{
   var arr2=functionToArray(source,false);
   if(arr2.status==true){
    var sourceReconstruitAvecCommentaires=arrayToFunctWidthComment(arr2.value);
    if(sourceReconstruitAvecCommentaires.status==true){
     document.getElementById('normalise').value=sourceReconstruitAvecCommentaires.value;
     var tab1=sourceReconstruitAvecCommentaires.value.split('\n');
     var tab0=source.split('\n');
     for(i=0;i<tab1.length && i<tab0.length;i++){
      if(tab1[i]!=tab0[i]){
       global_messages.lines.push(i);
       break;
      }
     }
    }
   }
   return logerreur({status:false,message:'le source et le source reconstruits ne sont pas les mêmes',situation:{fichier:'core.js',fonction:'compareSourceEtReconstruit'}});
  }
}
//=====================================================================================================================
function display_ajax_error_in_cons(jsonRet) {
 var txt = '';
 if(jsonRet.hasOwnProperty('status')){
  txt+='status:'+jsonRet.status+'\n';
 }
 if(jsonRet.hasOwnProperty('messages')){
  if (typeof jsonRet.messages === 'string' || jsonRet.messages instanceof String){
   // sometimes message in php are not put in arrays
   txt+='Please, put messages in an array in the server !!!!\n';
   txt+='messages='+jsonRet.messages;
   txt+='\n';
  }else{
   txt+='messages[]=\n';
   for(var elem in jsonRet.messages){
    global_messages.errors.push(jsonRet.messages[elem]);
    txt+=''+jsonRet.messages[elem]+'\n';
   }
   txt+='\n';
  }
 }
 displayMessages();
 console.log('%c'+txt,'color:red');
 console.log('jsonRet=', jsonRet);
 
}
//=====================================================================================================================
function loadRevFile(nomFichierSource,fntSiOk,nomZone,faireApres){
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?loadRevFile',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    fntSiOk({status:true,value:jsonRet.value,nomZone:nomZone,nomFichierSource:nomFichierSource});
    try{
     localStorage.setItem("fta_dernier_fichier_charge", nomFichierSource);
    }catch(e){}
//    console.log('faireApres', faireApres , 'typeof faireApres' , typeof faireApres)
    if(typeof faireApres =='function'){
     faireApres();
    }
    return;
   }else{
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    alert('BAD job !');
    return;
   }
  }catch(e){
   console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
   return;
  }
 };
 r.onerror=function(e){console.error('e=',e); /* whatever(); */    return;}
 r.ontimeout=function(e){console.error('e=',e); /* whatever(); */    return;}
 var ajax_param={
  call:{
   lib                       : 'core'          ,
   file                      : 'file' ,
   funct                     : 'loadRevFile' ,
  },
  file_name                  : nomFichierSource   ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
}
//=====================================================================================================================
function concateneFichiers(tabConcatFichier,file_name,file_extension,file_path){
 var fichierAConcatener=tabConcatFichier.shift();
// console.log(fichierAConcatener);
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?concatFile',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
//    console.log(tabConcatFichier);
    if(tabConcatFichier.length>0){
     concateneFichiers(tabConcatFichier,file_name,file_extension,file_path)
    }
    // do good stuff
    return;
   }else{
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    alert('BAD job !');
    return;
   }
  }catch(e){
   console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
   return;
  }
 };
 r.onerror=function(e){console.error('e=',e); /* whatever(); */    return;}
 r.ontimeout=function(e){console.error('e=',e); /* whatever(); */    return;}
 var ajax_param={
  call:{
   lib                       : 'core'          ,
   file                      : 'file' ,
   funct                     : 'concatFile' ,
  },
  file_name                 : file_name          ,
  file_extension            : file_extension     ,
  file_path                 : file_path          ,
  fichierAConcatener        : fichierAConcatener ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));   
 
}
//=====================================================================================================================
function convertSource(objMatSrc){
 var message='';
 var file_name='';
 var file_extension='';
 var file_path='';
 var type_source='';
 var idJs=-1;
 var tabConcatFichier=[];
 var retProgrammeSource={};
 var obj={};
 var l01=objMatSrc.value.length;
 for(var i=1;i<l01;i++){
  if(objMatSrc.value[i][3]==0){
   if(objMatSrc.value[i][1]=='#'){
   }else if(objMatSrc.value[i][1]=='src_javascript' ){
    type_source=objMatSrc.value[i][1];
    break;
   }else if(objMatSrc.value[i][1]=='src_html'){
    type_source=objMatSrc.value[i][1];
    break;
   }else if(objMatSrc.value[i][1]=='src_php'){
    type_source=objMatSrc.value[i][1];
    break;
   }else if(objMatSrc.value[i][1]=='src_sql'){
    type_source=objMatSrc.value[i][1];
    break;
   }
  }
 }
 if(type_source==''){
  return logerreur({status:false,message:'file core , fonction convertSource la fonction racine doit être "src_javascript", "src_html" , "src_sql" ou bien "src_php" '});
 }
 
 
 for(var i=0;i<l01;i++){
  if(objMatSrc.value[i][2]=='f' && objMatSrc.value[i][3]==1){
   if( objMatSrc.value[i][1]==''){ //fonctions de niveau 1 vides
    for(var j=i;j<objMatSrc.value.length;j++){
     if(objMatSrc.value[j][7]==objMatSrc.value[i][0] && objMatSrc.value[i][8]>=2 ){ // si id de la fonction de niveau1 vide == idParent et qu'il y a au moins 2 enfants (file_name,nomFichier)
 //       console.log(JSON.stringify(objMatSrc.value[j]));
      if(objMatSrc.value[j][1]=='file_name' && objMatSrc.value[j+1][1]!=''){
       file_name=objMatSrc.value[j+1][1];
      }
      if(objMatSrc.value[j][1]=='file_extension' && objMatSrc.value[j+1][1]!=''){
       file_extension=objMatSrc.value[j+1][1];
      }
      if(objMatSrc.value[j][1]=='file_path' && objMatSrc.value[j+1][1]!=''){
       file_path=objMatSrc.value[j+1][1];
      }
     }
    }
   }else if( objMatSrc.value[i][1]!=''){ //fonctions de niveau 1 NON vides
    if(objMatSrc.value[i][1]=='#'){
    }else if(objMatSrc.value[i][1]=='source'){
    }else if(objMatSrc.value[i][1]=='concatFichier'){
    }else{
     return logerreur({status:false,id:i,message:'file core , fonction convertSource : l\'élément ne doit pas se trouver là '+JSON.stringify(objMatSrc.value[i])});
    }
   }

  }
  if(objMatSrc.value[i][2]=='f' && objMatSrc.value[i][3]==1 && objMatSrc.value[i][1]=='source'){ // fonction de niveau 1 = source
   if(idJs==-1){
    idJs=i;
   }else{
    idJs=-2;
   }
  }
  if(objMatSrc.value[i][2]=='f' && objMatSrc.value[i][3]==1 && objMatSrc.value[i][1]=='concatFichier' && objMatSrc.value[i][8]==1){
   tabConcatFichier.push(objMatSrc.value[i+1][1])
  }
 }
 var t='';
 if(file_name!='' && file_path!='' && idJs>0){
  
  if(type_source=='src_php'  && (file_extension=='php')){
   for(var i=idJs+1;i<objMatSrc.value.length;i++){
    if(objMatSrc.value[i][7]==idJs && objMatSrc.value[i][1]=='php'){
     php_contexte_commentaire_html=false;
     retProgrammeSource=parsePhp0(objMatSrc.value , i , 0 );
     if(retProgrammeSource.status==true){
      t+='<?php\n'+retProgrammeSource.value+'\n?>';
     }else{
      return logerreur({status:false,id:i,message:'file core , fonction convertSource : erreur dans un php'});
     }
    }else if(objMatSrc.value[i][7]==idJs && objMatSrc.value[i][1]=='html'){
     php_contexte_commentaire_html=true;
     //                             tab             , id , noHead , niveau
     retProgrammeSource=tabToHtml1( objMatSrc.value , i  , true   , 0      );
     if(retProgrammeSource.status==true){
      t+='\n'+retProgrammeSource.value+'\n';
     }else{
      return logerreur({status:false,id:i,message:'file core , fonction convertSource : erreur dans un php'});
     }
    }
   }
   t=t.replace(/\/\*\*\//g,'');
   t=t.replace(/\?><\?php/g,'');
   return logerreur({status:true,value:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }else if(type_source=='src_javascript'  && (file_extension=='js')){
   retProgrammeSource=parseJavascript0(objMatSrc.value ,idJs+1 , 0 );
   if(retProgrammeSource.status==true){
    t+=retProgrammeSource.value;
   }else{
    return logerreur({status:false,id:i,message:'file core , fonction convertSource : erreur dans un javascript'});
   }
   return logerreur({status:true,value:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }else if(type_source=='src_html'  && (file_extension=='html')){
   //                             tab             , id     , noHead , niveau
   retProgrammeSource=tabToHtml1( objMatSrc.value , idJs+1 , false  , 0      );
   if(retProgrammeSource.status==true){
    t+=retProgrammeSource.value;
   }else{
    return logerreur({status:false,id:i,message:'file core , fonction convertSource : erreur dans un html'});
   }
   return logerreur({status:true,value:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }else if(type_source=='src_sql'  && (file_extension=='sql')){
   //                             tab             , id    , niveau
   retProgrammeSource=tabToSql1( objMatSrc.value , idJs+1 , 0      );
   if(retProgrammeSource.status==true){
    t+=retProgrammeSource.value;
   }else{
    return logerreur({status:false,id:i,message:'file core , fonction convertSource : erreur dans un sql'});
   }
   return logerreur({status:true,value:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }
//console.log('t=',t);
 }else{
  return logerreur({status:false,id:0,message:'file_name, file_path and source must be filled'});
 }
 
}
//=====================================================================================================================
function writeRevFile(fileName, value){
 var file_name='';
 var file_extension='';
 var file_path='';
 var type_source='';
 var idJs=-1;
 var tabConcatFichier=[];
 var retProgrammeSource={};
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?writeRevFile='+encodeURIComponent(fileName),true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    return;
   }else{
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    alert('BAD job !');
    return;
   }
  }catch(e){
   console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
   return;
  }
 };
 r.onerror=function(e){console.error('e=',e); /* whatever(); */    return;}
 r.ontimeout=function(e){console.error('e=',e); /* whatever(); */    return;}
 var ajax_param={
  call:{
   lib                       : 'core'   ,
   file                      : 'file'  ,
   funct                     : 'writeRevFile' ,
  },
  value                     : value     ,
  file_name                 : fileName       ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 return logerreur({status:true});  
}
//=====================================================================================================================
function writeSourceFile(obj){
 var message='';
 var type_source='';
 var idJs=-1;
// var tabConcatFichier=[];
// var obj={};

 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?'+type_source,true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    if(obj.tabConcatFichier.length>0){
     concateneFichiers(obj.tabConcatFichier,obj.file_name,obj.file_extension,obj.file_path)
    }
    return;
   }else{
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    alert('BAD job !');
    return;
   }
  }catch(e){
   console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
   return;
  }
 };
 r.onerror=function(e){console.error('e=',e); /* whatever(); */    return;}
 r.ontimeout=function(e){console.error('e=',e); /* whatever(); */    return;}
 var ajax_param={
  call:{
   lib                       : 'core'   ,
   file                      : 'file'  ,
   funct                     : 'writeFile' ,
  },
  value                     : obj.value     ,
  file_name                 : obj.file_name       ,
  file_extension            : obj.file_extension  ,
  file_path                 : obj.file_path       ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 return logerreur({status:true});  
}
//=====================================================================================================================
function traiteCommentaire2(texte,niveau,ind){
 var t='';
 var multiLigne=false;
 var ajouterUneLigneViergeALaFin=false;
 var ajouterUneLigneViergeAuDebut=false;
 var numTest=-1;
 if(texte.indexOf('\n')>=0){
  multiLigne=true;
 }
 var tab=texte.split('\n');
 var l01=tab.length;
 if(multiLigne && texte.length>=1 && texte.substr(0,1)=='#'){
  // trouver le premier non blanc
  var t='';
  var min=99999;
  for(var i=1;i<l01;i++){
   var ligne=tab[i];
   for(j=0;j<ligne.length;j++){
    if(ligne.substr(j,1)==' '){
    }else{
     if(j<min){
      min=j
     }
     break;
    }
   }
   
  }
  if(min>0){
   for(var i=1;i<l01;i++){
    tab[i]=tab[i].substr(min);
   }
   texte=tab.join('\n');
  }
//  console.log( texte , min)
  
  
  return texte;
 }
 if(ind==numTest){
  console.log('"'+texte+'"');
 }
 var newTab=[];
 for(var i=0;i<l01;i++){
    t='';
    // on envève les espaces au début
    for(var j=0;j<tab[i].length;j++){
     if(tab[i].substr(j,1)==' '){
     }else{
      t+=tab[i].substr(j);
      break;
     }
    }
    if(i==l01-1){
     if(t!=''){
      if(multiLigne){
       newTab.push(' '.repeat(NBESPACESSOURCEPRODUIT).repeat(niveau+1)+t);
       newTab.push((niveau>=0?'  '.repeat(niveau):''));
      }else{
       newTab.push(t);
      }       
     }else{
      if(multiLigne){
       newTab.push((niveau>=0?' '.repeat(NBESPACESSOURCEPRODUIT).repeat(niveau):''));
      }else{
       newTab.push(t);
      }
     }
    }else if(i==0){
     if(t!==''){
      if(multiLigne){
       t=' '.repeat(NBESPACESSOURCEPRODUIT).repeat(niveau+1)+t;
       newTab.unshift('');
       newTab.push(t);
      }else{
       newTab.push(t);
      }
     }else{
      newTab.push(t);
     }
    }else{
     if(niveau>0){
      t=' '.repeat(NBESPACESSOURCEPRODUIT).repeat(niveau)+t;
     }
     newTab.push(t);
    }
    if(ind==numTest){
     console.log('t="'+t+'"');
    }
    
 }
 if(ind==numTest){
  console.log('tab=',tab);
 }
 t=newTab.join('\n');
 return t;
}
/*
var NBESPACESREV=3;
var NBESPACESSOURCEPRODUIT=4;
*/
//=====================================================================================================================
function ttcomm1(texte,niveau,ind){
 var t='';
 var multiLigne=false;
 var ajouterUneLigneViergeALaFin=false;
 var ajouterUneLigneViergeAuDebut=false;
 var numTest=-1;
 if(texte.indexOf('\n')>=0){
  multiLigne=true;
 }
 var tab=texte.split('\n');
 var l01=tab.length;
 if(multiLigne && texte.length>=1 && texte.substr(0,1)=='#'){
  return texte;
 }
 if(ind==numTest){
  console.log('"'+texte+'"');
 }
 var newTab=[];
 for(var i=0;i<l01;i++){
    t='';
    // on envève les espaces au début
    for(var j=0;j<tab[i].length;j++){
     if(tab[i].substr(j,1)==' '){
     }else{
      t+=tab[i].substr(j);
      break;
     }
    }
    if(i==l01-1){
     if(t!=''){
      if(multiLigne){
       newTab.push(' '.repeat(NBESPACESREV).repeat(niveau+1)+t);
       newTab.push((niveau>=0?'  '.repeat(niveau):''));
      }else{
       newTab.push(t);
      }       
     }else{
      if(multiLigne){
       newTab.push((niveau>=0?' '.repeat(NBESPACESREV).repeat(niveau):''));
      }else{
       newTab.push(t);
      }
     }
    }else if(i==0){
     if(t!==''){
      if(multiLigne){
       t=' '.repeat(NBESPACESREV).repeat(niveau+1)+t;
       newTab.unshift('');
       newTab.push(t);
      }else{
       newTab.push(t);
      }
     }else{
      newTab.push(t);
     }
    }else{
     t=' '.repeat(NBESPACESREV).repeat(niveau+1)+t;
     newTab.push(t);
    }
    if(ind==numTest){
     console.log('t="'+t+'"');
    }
    
 }
 if(ind==numTest){
  console.log('tab=',tab);
 }
 t=newTab.join('\n');
 return t;
}

//=====================================================================================================================
function a2F1(arr,parentId,retourLigne,debut,coloration){
 var t='';
 var profondeurLimite=3;
 var nombreEnfantsLimite=3;
 var forcerRetourLigne=false;
 var l01=arr.length;
 for(var i=debut;i<l01;i++){
  if(arr[i][7]==parentId){ // parent id

   if(retourLigne==true && arr[parentId][10]>profondeurLimite){
    forcerRetourLigne=true;
//   }else if(retourLigne==true && ( arr[parentId][2]=='f' || arr[parentId][2]=='INIT' ) && arr[parentId][8]<=nombreEnfantsLimite && arr[parentId][10]<=profondeurLimite ){ // && arr[i][9]==1
   }else if(retourLigne==true && ( arr[parentId][2]=='f' || arr[parentId][2]=='INIT' )  ){ // && arr[i][9]==1
    // si c'est la premier enfant d'une fonction, on teste si il existe des enfants de type commentaires
    for(var j=debut;j<l01;j++){
     if(arr[j][3]>arr[parentId][3]){ // si le niveau est supérieur au niveau du parent
      if(arr[j][3]<=arr[parentId][3]+profondeurLimite && arr[j][1]==DEBUTCOMMENTAIRE && arr[j][2]=='f' ){
       forcerRetourLigne=true;
       break;
      }
     }else{
      break;
     }
    }
    for(var j=debut;j<l01;j++){
     if(arr[j][3]>arr[parentId][3]){ // si le niveau est supérieur au niveau du parent
      if(arr[j][8]>nombreEnfantsLimite){
       forcerRetourLigne=true;
       break;
      }
     }else{
      break;
     }
    }
    
   }
   if(arr[i][9]>1){ // numéro enfant
    if( !forcerRetourLigne && retourLigne==true && arr[parentId][2]=='f' && arr[parentId][8]<=nombreEnfantsLimite && arr[parentId][10]<=profondeurLimite ){ // si le parent est une fonction et que son nombre d'enfants est 1 et que sa profondeur est <= 1
     t+=' , ';
    }else{
     t+=',';
    }
   }
   if(forcerRetourLigne && arr[parentId][2]!='INIT' ){
    t+=espacesnrev(false,arr[i][3]); // niveau
   }else if(retourLigne){
    if( 
        (arr[parentId][2]=='INIT' && arr[i][9]==1 ) // première fonction à la racine
     || (arr[parentId][2]=='f' && arr[parentId][8]<=nombreEnfantsLimite && arr[parentId][10]<=profondeurLimite ) // si le parent est une fonction et que son nombre d'enfants est 1 et que sa profondeur est <= 1
    ){ 
    }else{
     t+=espacesnrev(false,arr[i][3]); // niveau
    }
   }
   if(arr[i][2]=='c'){
    if(arr[i][4]===true){ // constante quotée
     t+='\''+echappConstante(arr[i][1])+'\'';
    }else{
     t+=arr[i][1];
    }
   }else if(arr[i][2]=='f'){
    if(arr[i][1]==DEBUTCOMMENTAIRE){
     if(coloration){
      if(retourLigne){
       t+='<span style="color:darkgreen;background-color:lightgrey;">'+arr[i][1]+'('+ttcomm1(arr[i][13],arr[i][3],i)+')</span>';
      }else{
       t+='<span style="color:darkgreen;background-color:lightgrey;">'+arr[i][1]+'()</span>';
      }
     }else{
      if(retourLigne){
       t+=''+arr[i][1]+'('+ttcomm1(arr[i][13],arr[i][3],i)+')';
      }else{
       t+=''+arr[i][1]+'()';
      }
     }
    }else{
     var obj=a2F1(arr,i,retourLigne,i+1,coloration);
     if(obj.status===true){
      t+=arr[i][1]+'(';
      t+=obj.value;
      
      if(forcerRetourLigne && obj.forcerRetourLigne==true){
        t+=espacesnrev(false,arr[i][3]); // niveau
      }else if(retourLigne){
       if(arr[i][8]<=nombreEnfantsLimite && arr[i][10]<=profondeurLimite){
       }else{
        t+=espacesnrev(false,arr[i][3]); // niveau
       }
      }
      t+=')';
     }else{
      return logerreur({status:false,message:'erreur pour i='+i});
     }
    }
//    console.log('t1='+t);
   }else{
    return logerreur({status:false,message:'type non prévu dans a2FR pour i='+i});
   }
   
  }
 }
/* 
 if(retourLigne==true){
  console.log('sans commentaires t=\''+t+'\'');
 }
*/ 
 return {status:true,value:t,forcerRetourLigne:forcerRetourLigne};
 
}
//=====================================================================================================================
function arrayToFunct1(matrice,retourLigne,coloration){
 var t='';
 var obj=a2F1(matrice,0,retourLigne,1,coloration);
 if(obj.status===true){
//  console.log('obj.value='+obj.value);
 }
 return obj;
}
//=====================================================================================================================
function arrayToFunctNormalize(matrice,bAvecCommentaires){
 var out=arrayToFunct1(matrice,bAvecCommentaires,false);
 return out;  
}

//=====================================================================================================================
function arrayToFunctWidthComment(matrice){
 var out=arrayToFunct1(matrice,true,false);
 return out; 
}

//=====================================================================================================================
function arrayToFunctNoComment(matrice){
 var out=arrayToFunct1(matrice,true,false);
 return out;
}

//=====================================================================================================================
function functionToArray(src,exitOnLevelError){
 var tableau1=iterateCharacters(src);
 var matriceFonction=functionToArray2(tableau1.out,exitOnLevelError);
 global_messages.data.matrice=matriceFonction;
 global_messages.data.tableau=tableau1;
 return matriceFonction;
}

//===============================================================================================================
function ConstruitHtmlTableauCaracteres(t2,texteSource,objTableau){

 t2.setAttribute('class','tableau2');
 var tr1=document.createElement('tr');
 var td1=document.createElement('td');
 var numeroLigne=0;
 td1.innerHTML=numeroLigne;
 tr1.appendChild(td1);
 var out=[];
 var debut=0;
//    console.log(texteSource); // a
 
 if(objTableau===null){
  console.log('texteSource.length=',texteSource.length);
  var outo=iterateCharacters(texteSource);
  out=outo.out;
 }else{
  out=objTableau.out; 
 }
//    console.log(out);
 for(var i=0;i<out.length;i++){
   var td1=document.createElement('td');
   if(false && out[i][0]==='\n'){
    td1.innerHTML=out[i][0].replace('\n','\\n'); //+''+out[i][4];
   }else{
    td1.innerHTML=out[i][0].replace('\n','\\n');
   }
   td1.title='&#'+out[i][0].codePointAt(0)+'; ('+out[i][1]+')';
   tr1.appendChild(td1);
   
   
   if(out[i][0]==='\n'){
    t2.appendChild(tr1);
    
    // indice dans tableau = première ligne des chiffres
    var tr1=document.createElement('tr');
    var td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    
    for(var j=debut;j<i;j++){
      var td1=document.createElement('td');
      if(out[j][1]==1){
       td1.setAttribute('class','td2');
      }else if(out[j][1]==3  ){
       td1.setAttribute('class','td5');
      }else if( out[j][1]==4 ){
       td1.setAttribute('class','td4');
      }else{
       td1.setAttribute('class','td3');
      }
      td1.innerHTML=j;
      tr1.appendChild(td1);
    }
    // position du backslash n
    var td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML=j+'';
    tr1.appendChild(td1);
    
    t2.appendChild(tr1);
    


    
    // position dans la chaine = deuxième ligne des chiffres

    var tr1=document.createElement('tr');
    var td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    
    for(var j=debut;j<i;j++){
      var td1=document.createElement('td');
      if(out[j][1]==1){
       td1.setAttribute('class','td2');
      }else if(out[j][1]==3  ){
       td1.setAttribute('class','td5');
      }else if( out[j][1]==4 ){
       td1.setAttribute('class','td4');
      }else{
       td1.setAttribute('class','td3');
      }
      td1.innerHTML=out[j][3]+'';
      tr1.appendChild(td1);
    }
    // position du backslash n
    var td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML=out[j][3]+'';
    tr1.appendChild(td1);
    
    t2.appendChild(tr1);
    
    

    // fin des lignes 
    
    
    debut=i+1;

    
    
    var tr1=document.createElement('tr');
    numeroLigne++;
    var td1=document.createElement('td');
    td1.innerHTML=numeroLigne;
    tr1.appendChild(td1);
    t2.appendChild(tr1);
    
   }
   
 }

 t2.appendChild(tr1);


 
 var tr1=document.createElement('tr');
 var td1=document.createElement('td');
 td1.setAttribute('class','td2');
 td1.innerHTML='&nbsp;';
 tr1.appendChild(td1);
 
 for(var j=debut;j<i;j++){
   var td1=document.createElement('td');
   if(out[j][1]==1){
    td1.setAttribute('class','td2');
   }else if(out[j][1]==3  ){
    td1.setAttribute('class','td5');
   }else if( out[j][1]==4 ){
    td1.setAttribute('class','td4');
   }else{
    td1.setAttribute('class','td3');
   }
   td1.innerHTML=j;
   tr1.appendChild(td1);
 }
 
 t2.appendChild(tr1);
 
 

 
 var tr1=document.createElement('tr');
 var td1=document.createElement('td');
 td1.setAttribute('class','td2');
 td1.innerHTML='&nbsp;';
 tr1.appendChild(td1);
 
 for(var j=debut;j<i;j++){
   var td1=document.createElement('td');
   if(out[j][1]==1){
    td1.setAttribute('class','td2');
   }else if(out[j][1]==3  ){
    td1.setAttribute('class','td5');
   }else if( out[j][1]==4 ){
    td1.setAttribute('class','td4');
   }else{
    td1.setAttribute('class','td3');
   }
   td1.innerHTML=out[j][3];
   tr1.appendChild(td1);
 }
 
 t2.appendChild(tr1);

}
//=====================================================================================================================
function ConstruitHtmlMatrice(t1,matriceFonction){
 // entete de tableau de l'arbre
 var tr1=document.createElement('tr');
 for(var i=0;i<global_enteteTableau.length;i++){
   var td1=document.createElement('td');
   td1.innerHTML=i+global_enteteTableau[i][0];
   td1.setAttribute('title',global_enteteTableau[i][1] + '(' + i + ')');
   tr1.appendChild(td1);
 }
 t1.appendChild(tr1);
 
 // arbre
 for(var i=0;i<matriceFonction.value.length;i++){
   var tr1=document.createElement('tr');
   for(var j=0;j<matriceFonction.value[i].length;j++){
     var td1=document.createElement('td');
     if(j==1 || ( j>=10  ) ){ // pour les valeurs et les commentaires
      td1.innerHTML=String(matriceFonction.value[i][j]).replace(/ /g,'░').replace(/\n/g,'¶');
      td1.style.whiteSpace='pre-wrap';
      td1.style.verticalAlign='baseline';
     }else if(j==4){ // constante quotée
      td1.innerHTML=matriceFonction.value[i][j]===true?'1':'';;
     }else{
      td1.innerHTML=String(matriceFonction.value[i][j]).replace(/ /g,'░');
     }
     td1.setAttribute('title',global_enteteTableau[j][1] + '(' + j + ')');
     tr1.appendChild(td1);
   }
   t1.appendChild(tr1);
 }
}
//=====================================================================================================================
function iterateCharacters(str){
// https://stackoverflow.com/questions/63905684/how-can-a-3-byte-wide-utf-8-character-only-use-a-single-utf-16-code-unit
  var out=[];
  let te = new TextEncoder();
  var numLigne=0;
  let position=0;
  let position2=0;
//  str=str.replace(/\u200B/g,''); // I do not like regex, they seem slower : dec 8203 = hex 200B = oct 20013 = bin 0010 0000 0000 1011
  let arr = [...str];
  var l01=arr.length;
  for(let i=0;i<l01;i++){
   if(arr[i].charCodeAt(0)!=8203){  // I do not like regex, they seem slower : dec 8203 = hex 200B = oct 20013 = bin 0010 0000 0000 1011
    let bytes = te.encode(arr[i]).length;
    let length = arr[i].length;
    out.push([arr[i],bytes,position,position2,numLigne]);
    if(arr[i]=='\n'){numLigne++};
    position+=bytes;
    position2+=(bytes==4?2:1);
   }
  }
  return {'out':out,'position':position,'position2':position2,'numLigne':numLigne};  
}


//=====================================================================================================================
//=====================================================================================================================
var global_enteteTableau=[
 ['id','id'                                 ,''], // 00
 ['val','value'                             ,''],
 ['typ','type'                              ,''],
 ['niv','niveau'                            ,''],
 ['coQ','constante quotee'                  ,''],
 ['pre','position du premier caractère'     ,''], // 05
 ['der','position du dernier caractère'     ,''],
 ['pId','Id du parent'                      ,''], 
 ['nbE','nombre d\'enfants'                 ,''],
 ['nuE','numéro enfants'                    ,''],
 ['pro','profondeur'                        ,''], // 10
 ['pop','position ouverture parenthese'     ,''],
 ['pfp','position fermeture parenthese'     ,''], 
 ['com','commentaire'                       ,''],  
];

function functionToArray2(tableauEntree,exitOnLevelError){
  /*
    =========================
    les chaines de caractères
    =========================
  */
  var texte='';
  var commentaire='';
  var c='';
  var c1='';
  var c2='';
  /*
    =========================
    les entiers
    =========================
  */
  var i=0;
  var j=0;
  var k=0;
  var l=0;
  var indice=0;
  var niveau=0;
  var premier=0;
  var dernier=0;
  var numeroLigne=0;
  var posOuvPar=0;
  var posFerPar=0;
  var niveauDebutCommentaire=0;
  var niveauDansCommentaire=0;
  /*
    =========================
    les booléens
    =========================
  */
  var dansCst=false;
  var dsComment=false;
  var constanteQuotee=false;
  /*
    ====================================
    Le tableau en sortie si tout va bien
    ====================================
  */
  var T= new Array();
  var temp={};
  /*
    =======================================================================
    initialisation du tableau contenant le source structuré en arborescence
    =======================================================================
    0id    1val  2typ  3niv  4coQ
    5pre   6der  7pId  8nbE  9numEnfant  
    10pro 11OPa 12FPa 13comm
  */
  T.push(Array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
  var l01=tableauEntree.length;
  /*
    // ====================================================================
    // ====================================================================
    // boucle principale sur tous les caractères du texte passé en argument
    // on commence par analyser les cas ou on est dans des chaines, puis on
    // analyse les caractères
    // ====================================================================
    // ====================================================================
  */
  for(i=0;i < l01;i=i+1){
    c=tableauEntree[i][0];
      /*
        
        
        
        ===================
        Dans un commentaire
        ===================
      */
      
    if((dsComment)){
      if((c == ')')){
        if(((niveau == niveauDebutCommentaire+1)&&niveauDansCommentaire == 0)){
          posFerPar=i;
          T[T.length-1][13]=commentaire;
          T[T.length-1][12]=posFerPar;
          commentaire='';
          dsComment=false;
          niveau=niveau-1;
        }else{
          commentaire=concat(commentaire,c);
          niveauDansCommentaire=niveauDansCommentaire-1;
        }
      }else if((c == '(')){
        commentaire=concat(commentaire,c);
        niveauDansCommentaire=niveauDansCommentaire+1;
      }else{
        commentaire=concat(commentaire,c);
      }
      /*
        
        
        
        ==================
        dans une constante
        ==================
      */
      
    }else if((dansCst == true)){
      if((c == '\'')){
        if((i == l01-1)){
          temp={'status':false,'id':i,'value':T,'message':'-1 la racine ne peut pas contenir des constantes'};
          return(logerreur(temp));
        }
        c1=tableauEntree[i+1][0];
        if((c1 == ',')||c1 == '\t'||c1 == '\n'||c1 == '\r'||c1 == '/'||c1 == ' '||c1 == ')'){
          dernier=i-1;
        }else{
          temp={'status':false,'value':T,'id':i,'message':'apres une constante, il doit y avoir un caractère d\'echappement'};
          return(logerreur(temp));
        }
        dansCst=false;
        indice=indice+1;
        constanteQuotee=true;
        if((niveau == 0)){
          temp={'status':false,'id':i,'value':T,'message':'-1 la racine ne peut pas contenir des constantes'};
          return(logerreur(temp));
        }
        T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
        texte='';
        constanteQuotee=false;
      }else if((c == '\\')){
        if((i == l01-1)){
          temp={'status':false,'value':T,'id':i,'message':'un antislash ne doit pas terminer une fonction'};
          return(logerreur(temp));
        }
        /*fin du choix*/
        c1=tableauEntree[i+1][0];
        if((c1 == '\\')||c1 == '\''){
          if((texte == '')){
            premier=i;
          }
          texte=concat(texte,c1);
          i=i+1;
        }else{
          if((c1 == 'n')||c1 == 't'||c1 == 'r'){
            if((texte == '')){
              premier=i;
            }
            texte=concat(texte,'\\',c1);
            i=i+1;
          }else{
            temp={'status':false,'value':T,'id':i,'message':'un antislash doit être suivi par un autre antislash ou un apostrophe'};
            return(logerreur(temp));
          }
        }
      }else{
        if((texte == '')){
          premier=i;
        }
        texte=concat(texte,c);
      }
    }else{
      /*
        
        
        
        ==================================================
        on n'est pas dans un commentaire ou une constante,  
        donc c'est un nouveau type qu'il faut détecter
        ==================================================
      */
      if((c == '(')){
        /*
          ====================
          Parenthèse ouvrante
          ====================
          
          
        */
        posOuvPar=i;
        indice=indice+1;
        if((texte == DEBUTCOMMENTAIRE)){
          dsComment=true;
          niveauDebutCommentaire=niveau;
        }
        T.push(Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
        niveau=niveau+1;
        texte='';
        dansCst=false;
        /*
          ==========================
          FIN DE Parenthèse ouvrante
          ==========================
          
          
        */
      }else if((c == ')')){
        /*
          
          
          ====================
          Parenthèse fermante
          ====================
        */
        posFerPar=i;
        if((texte != '')){
          if((niveau == 0)){
            temp={'status':false,'value':T,'id':i,'message':'une fermeture de parenthése ne doit pas être au niveau 0'};
            return(logerreur(temp));
          }
          indice=indice+1;
          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
          texte='';
        }
        niveau=niveau-1;
        /*
          
          maj de la position de fermeture de la parenthèse
          
        */
        for(j=indice;j >= 0;j=j-1){
          if((T[j][3] == niveau)&&T[j][2] == 'f'){
            T[j][12]=posFerPar;
            break;
          }
        }
        posFerPar=0;
        dansCst=false;
        /*
          ==========================
          FIN de Parenthèse fermante
          ==========================
          
          
        */
      }else if((c == '\\')){
        /*
          
          
          ===========
          anti slash 
          ===========
        */
        if(!(dansCst)){
          temp={'status':false,'value':T,'id':i,'message':'un antislash doit être dans une constante'};
          return(logerreur(temp));
        }
        /*
          ===================
          Fin d'un anti slash
          ===================
          
          
        */
      }else if((c == '\'')){
        /*
          
          
          //===========
          // apostrophe
          //===========
        */
        premier=i;
        if((dansCst == true)){
          dansCst=false;
        }else{
          dansCst=true;
        }
        /*
          //===============
          // FIN apostrophe
          //===============
          
          
        */
      }else if((c == ',')){
        /*
          
          
          //========================
          // virgule donc séparateur
          //========================
        */
        if((texte != '')){
          indice=indice+1;
          if((niveau == 0)){
            temp={'status':false,'value':T,'id':i,'message':'la racine ne peut pas contenir des constantes'};
            return(logerreur(temp));
          }
          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
        }else{
          if((T[indice][2] == 'f')){
            /*ne rien faire*/
          }else{
            if((T[indice][3] >= niveau)){
              /*ne rien faire*/
            }else{
              temp={'status':false,'value':T,'id':i,'message':'une virgule ne doit pas être précédée d\'un vide'};
              return(logerreur(temp));
            }
          }
        }
        texte='';
        dansCst=false;
        /*
          //============================
          // FIN virgule donc séparateur
          //============================
          
          
        */
      }else if((c == ' ')||c == '\t'||c == '\r'||c == '\n'){
        /*
          
          
          =============================
          caractères séparateurs de mot
          =============================
        */
        if((texte != '')){
          indice=indice+1;
          if((niveau == 0)){
            temp={'status':false,'value':T,'id':i,'message':'la racine ne peut pas contenir des constantes'};
            return(logerreur(temp));
          }
          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
          texte='';
          dansCst=false;
        }
        /*
          ====================================
          FIN de caractères séparateurs de mot
          ====================================
          
          
        */
      }else{
        if((texte == '')){
          premier=i;
        }
        dernier=i;
        texte=concat(texte,c);
      }
    }
  }
  /*
    ========================================
    on est en dehors de la boucle principale
    ========================================
  */
  if((niveau != 0)&&exitOnLevelError){
    temp={'status':false,'value':T,'message':'des parenthèses ne correspondent pas'};
    return(logerreur(temp));
  }
  /**/
  if((texte != '')){
    indice=indice+1;
    if((niveau == 0)){
      temp={'status':false,'value':T,'message':'la racine ne peut pas contenir des constantes'};
      return(logerreur(temp));
    }
    /*finchoix suite du source*/
    T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
  }
  /*
    
    ==============================================================
    // mise à jour de l'id du parent[7] et du nombre d'éléments[8]
    ============================================================== 
  */
  l01=T.length;
  for(i=l01-1;i > 0;i=i-1){
    niveau=T[i][3];
    for(j=i;j >= 0;j=j-1){
      if((T[j][3] == niveau-1)){
        T[i][7]=j;
        T[j][8]=T[j][8]+1;
        break;
      }
    }
  }
  /*
    
    ============================== 
    numérotation des enfants
    numenfant = k
    ==============================
  */
  k=0;
  for(i=0;i < l01;i=i+1){
    k=0;
    for(j=i+1;j < l01;j=j+1){
      if((T[j][7] == T[i][0])){
        k=k+1;
        T[j][9]=k;
      }
    }
  }
  /*
    =======================================
    profondeur des fonctions
    k=remonterAuNiveau
    l=idParent
    =======================================
  */
  for(i=l01-1;i > 0;i=i-1){
    if((T[i][2] == 'c')){
      T[i][10]=0;
    }
    if((T[i][7] > 0)){
      k=T[i][3];
      l=T[i][7];
      for(j=1;j <= k;j=j+1){
        if((T[l][10] < j)){
          T[l][10]=j;
        }
        l=T[l][7];
      }
    }
  }
  temp={'status':true,'value':T};
  return temp;
}