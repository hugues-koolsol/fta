"use strict";

// (typeof(b),egal('undefined')),et(d,egal(true))
var DEBUTCOMMENTAIRE='#';
var globale_LangueCourante='fr';
var global_messages={
 'e500logged' : false ,
 'errors'     : [] ,
 'warnings'   : [] ,
 'infos'      : [] ,
 'lines'      : [] ,
 'tabs'       : [] ,
 'calls'      : ''
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
  'calls':''
 }
}
//=====================================================================================================================
function logerreur(o){
 if(o.hasOwnProperty('status')){
  if(o.status===false){
   if(o.hasOwnProperty('message')){
    global_messages.errors.push(o.message)
   }else{
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
 for(var i=0;i<global_messages.lines.length;i++){
  document.getElementById('global_messages').innerHTML+='<a href="javascript:jumpToError('+(global_messages.lines[i]+1)+')" class="yyerror" style="border:2px red outset;">go to line '+global_messages.lines[i]+'</a>&nbsp;';
 }
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
function sousTableau(tab,id){
  var i=0,j=0;
  var nouveauTab=[];
  var sousTab=[];
  var retSource={};
//  var premierIndice=id;
 // console.log('%c\n// sousTableau id='+id + ' ' + JSON.stringify(tab[id]),'color:plum');
  console.log('dans sous tableau "'+tab[id][1]+'"');
  
  nouveauTab.push(tab[0]);
  nouveauTab[0][8]='';
  
  for(i=id+1;i<tab.length && tab[i][3]>tab[id][3];i++){
    sousTab=[];
    for(j=0;j<tab[i].length;j++){
     sousTab.push(tab[i][j]);
    }
    nouveauTab.push(sousTab);
    if(i==id+1){
     nouveauTab[nouveauTab.length-1][7]=0;
    }else{
     nouveauTab[nouveauTab.length-1][7]=nouveauTab[nouveauTab.length-1][7]-id;
    }
  }
  retSource=arrayToFunctWidthComment(nouveauTab);
//  console.log('retSource=',retSource);
  if(retSource.status===true){
    var arr2=functionToArray(retSource.value,true);
    if(arr2.status===true){
      return {status:true,value:arr2.value};
    }else{
      console.error(arr2);
      return logerreur({status:false,value:nouveauTab,message:'impossible d\'extraire le sous-tableau tab[id][1]="'+tab[id][1]+'"',tabs:nouveauTab});
    }
  }else{
    console.error(retSource);
  }

  return logerreur({status:false,value:nouveauTab,message:'impossible d\'extraire le sous-tableau tab[id][1]="'+tab[id][1]+'"',tabs:nouveauTab});
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
 //   arguments.callee.caller.toString();
    return logerreur({status:true,situation:{fichier:'core.js',fonction:'compareSourceEtReconstruit'}});
    console.log('%cLe source original et le source reconstruit sont les mêmes','color:lime');
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
function loadRevFile(nomFichierSource,fntSiOk,nomZone){
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
function convertSource(source,objArr){
 var message='';
 var file_name='';
 var file_extension='';
 var file_path='';
 var type_source='';
 var idJs=-1;
 var tabConcatFichier=[];
 var retProgrammeSource={};
 var obj={};
 var l01=objArr.value.length;
 for(var i=1;i<l01;i++){
  if(objArr.value[i][3]==0){
   if(objArr.value[i][1]=='#'){
   }else if(objArr.value[i][1]=='src_javascript' ){
    type_source=objArr.value[i][1];
    break;
   }else if(objArr.value[i][1]=='src_html'){
    type_source=objArr.value[i][1];
    break;
   }else if(objArr.value[i][1]=='src_php'){
    type_source=objArr.value[i][1];
    break;
   }
  }
 }
 if(type_source==''){
  return logerreur({status:false,message:'file core , fonction convertSource la fonction racine doit être "src_javascript", "src_html" ou bien "src_php" '});
 }
 
 
 for(var i=0;i<l01;i++){
  if(objArr.value[i][2]=='f' && objArr.value[i][3]==1 && objArr.value[i][1]==''){ //fonctions de niveau 1 vides
   for(var j=i;j<objArr.value.length;j++){
    if(objArr.value[j][7]==objArr.value[i][0] && objArr.value[i][8]>=2 ){ // si id de la fonction de niveau1 vide == idParent et qu'il y a au moins 2 enfants (file_name,nomFichier)
//       console.log(JSON.stringify(objArr.value[j]));
     if(objArr.value[j][1]=='file_name' && objArr.value[j+1][1]!=''){
      file_name=objArr.value[j+1][1];
     }
     if(objArr.value[j][1]=='file_extension' && objArr.value[j+1][1]!=''){
      file_extension=objArr.value[j+1][1];
     }
     if(objArr.value[j][1]=='file_path' && objArr.value[j+1][1]!=''){
      file_path=objArr.value[j+1][1];
     }
    }
   }
  }
  if(objArr.value[i][2]=='f' && objArr.value[i][3]==1 && objArr.value[i][1]=='source'){ // fonction de niveau 1 = source
   if(idJs==-1){
    idJs=i;
   }else{
    idJs=-2;
   }
  }
  if(objArr.value[i][2]=='f' && objArr.value[i][3]==1 && objArr.value[i][1]=='concatFichier' && objArr.value[i][8]==1){
   tabConcatFichier.push(objArr.value[i+1][1])
  }
  
 }
 var t='';
 if(file_name!='' && file_path!='' && idJs>0){
  
  if(type_source=='src_php'  && (file_extension=='php')){
   for(var i=idJs+1;i<objArr.value.length;i++){
    if(objArr.value[i][7]==idJs && objArr.value[i][1]=='php'){
     retProgrammeSource=parsePhp0(objArr.value,i,objArr.value[idJs][10]);
     if(retProgrammeSource.status==true){
      t+='<?php\n'+retProgrammeSource.value+'\n?>';
      console.log('t=',t);
     }else{
      return logerreur({status:false,id:i,message:'file core , fonction convertSource : erreur dans un php'});
     }
    }
   }
   return logerreur({status:true,value:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }

  obj=sousTableau(objArr.value,idJs);
  if(obj.status==true){
  }else{
   console.error(obj);
   return;
  }
  
  var retSource=arrayToFunctWidthComment(obj.value);
  
  if(retSource.status===true){
   var arr2=functionToArray(retSource.value,true);
   if(arr2.status===true){
    if(type_source=='src_javascript' && (file_extension=='js') ){
     retProgrammeSource=parseJavascript0(arr2.value,0,objArr.value[idJs][10]);
    }else if(type_source=='src_html'  && (file_extension=='html')){
     retProgrammeSource=tabToHtml1(arr2.value,1,objArr.value[idJs][10]);
    }else if(type_source=='src_php'  && (file_extension=='php')){
//     retProgrammeSource=parsePhp0(arr2.value,1,objArr.value[idJs][10]);
    }else{
     return logerreur({status:false,id:0,message:'file core , fonction convertSource : type de source "'+type_source+'" pour l\'extension "'+file_extension+'" non prévu'});
    }
    
    if(retProgrammeSource.status===true){
     return logerreur({status:true,value:retProgrammeSource.value,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
    }else{
     return logerreur({status:false,message:"",value:retProgrammeSource.value,file_name:file_name,file_path:file_path,file_extension:file_extension});
    }
   }else{
    return logerreur({status:false,id:0,message:'erreur de conversion functionToArray'});
   }
  }else{
   return logerreur({status:false,id:0,message:'erreur de reconstitution'});
  }
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
function writeSourceFile(source,objArr){
 var message='';
 var file_name='';
 var file_extension='';
 var file_path='';
 var type_source='';
 var idJs=-1;
 var tabConcatFichier=[];
 var retProgrammeSource={};
 var obj={};
 obj=convertSource(source,objArr);
 if(obj.status==true){
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
 }else{
  return logerreur({status:false});  
 }
 return;
}



//=====================================================================================================================
function traiteCommentaire2(arr,ind){
 var t='';
 var tab=arr[ind][13].split('\n');
 var numTest=-1;
 if(ind==numTest){
  console.log('"'+arr[ind][13]+'"');
 }
 var l01=tab.length;
 for(var i=1;i<l01;i++){
  t='';
  for(var j=0;j<tab[i].length;j++){
   if(tab[i].substr(j,1)==' '){
   }else{
    t+=tab[i].substr(j);
    break;
   }
  }
  if(i==l01-1){
   t='  '.repeat(arr[ind][3])+t;
  }else{
   if(t!==''){
    t='  '.repeat(arr[ind][3]+1)+t;
   }
  }
  if(ind==numTest){
   console.log('t="'+t+'"');
  }
  tab[i]=t;
 }
 if(ind==numTest){
  console.log('tab=',tab);
 }
 t=tab.join('\n');
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
    t+=espaces2(arr[i][3]); // niveau
   }else if(retourLigne){
    if( 
        (arr[parentId][2]=='INIT' && arr[i][9]==1 ) // première fonction à la racine
     || (arr[parentId][2]=='f' && arr[parentId][8]<=nombreEnfantsLimite && arr[parentId][10]<=profondeurLimite ) // si le parent est une fonction et que son nombre d'enfants est 1 et que sa profondeur est <= 1
    ){ 
    }else{
     t+=espaces2(arr[i][3]); // niveau
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
       t+='<span style="color:darkgreen;background-color:lightgrey;">'+arr[i][1]+'('+traiteCommentaire2(arr,i)+')</span>';
      }else{
       t+='<span style="color:darkgreen;background-color:lightgrey;">'+arr[i][1]+'()</span>';
      }
     }else{
      if(retourLigne){
       t+=''+arr[i][1]+'('+traiteCommentaire2(arr,i)+')';
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
        t+=espaces2(arr[i][3]); // niveau
      }else if(retourLigne){
       if(arr[i][8]<=nombreEnfantsLimite && arr[i][10]<=profondeurLimite){
       }else{
        t+=espaces2(arr[i][3]); // niveau
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
 return matriceFonction;

}
//=====================================================================================================================
function iterateCharacters(str){
// https://stackoverflow.com/questions/63905684/how-can-a-3-byte-wide-utf-8-character-only-use-a-single-utf-16-code-unit
  var out=[];
  let te = new TextEncoder();
  let position=0;
  let position2=0;
  let arr = [...str];
  var numLigne=0;
  var l01=arr.length;
  for(let i=0;i<l01;i++){
    let bytes = te.encode(arr[i]).length;
    let length = arr[i].length;
    out.push([arr[i],bytes,position,position2,numLigne]);
    if(arr[i]=='\n'){numLigne++};
    position+=bytes;
    position2+=(bytes==4?2:1);
  }
  return {'out':out,'position':position,'position2':position2};  
}

//=====================================================================================================================
function calculNumLigne2(t,premier){
 var nu=0;
 if(premier==0){
  nu=0;
 }else{
//  var stxt=txt.substr(0,premier);
  var stxt=lignesTableauEnTexte(t,0,premier);
  if(stxt.match(/\n/g)!==null){
   nu=(stxt.match(/\n/g)).length;
  }else{
   nu=0;
  }
 }
 return nu;
}

//=====================================================================================================================
function lignesTableauEnTexte(t,s,c){
 var out='';
 for(var i=s;i<c+s;i++){
  out+=t[i][0];
 }
 return out;
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
// 7 8 9 out
// 10 11 12 13 14 15 deviennent 
//  7  8  9 10 11 12 
//=====================================================================================================================
function functionToArray2(tableauEntree,exitOnLevelError){
 var t='';
 var T=new Array();

 var i=0,j=0,k=0,l=0;
 var c='',c1='',c2='';
 var indice=0;
 var niveau=0;
 
 var dansCst=false;
 var dansTexte=false;
 
 var dsComment=false;
 var niveauDebutCommentaire=-1;
 var niveauDansCommentaire=0;
 
 
 var texte='';
 var commentaire='';
 var cst='';
 
 var constanteQuotee=false;
 var premier=0;
 var dernier=0;
 
 
 var debutIgnore=0;
 var finIgnore=0;
 var dansIgnore=false;
 var commentaireTexte='';
 var faireCommentaire=true;
 var numeroLigne=0;
 var parentId=0;
 var nombreEnfants=0;
 var numEnfant=0;
 
 var levelError=false;
 var profondeur=0;
 var posOuvPar=0;
 var posFerPar=0;
 
 
 
 //           0id	1val	2typ	3niv	4coQ	          5pre	    6der	  7pId	 8nbE  9numEnfant  10profond  11OuvePar 12FerPar  13comm

 T.push(Array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,0    ,0    ,0          ,profondeur,posOuvPar,posFerPar,''    ));
 
 // o
 var l01=tableauEntree.length;
 for(i=0;i<l01;i++){
  c=tableauEntree[i][0];
//  if(c=='\n') numeroLigne++;
  if(dsComment){
   if(c==')'){
    if( niveau==niveauDebutCommentaire+1 && niveauDansCommentaire==0){
     T[T.length-1][13]=commentaire;
     commentaire='';
     dsComment=false;
     niveau--;
    }else{
     commentaire+=c;
     niveauDansCommentaire--;
    }
   }else if(c=='('){
    commentaire+=c;
    niveauDansCommentaire++;
   }else{
    commentaire+=c;
   }
   
  }else if(dansCst){
   if(c=='\''){
    // si après une constante il n'y a pas de caractère d'échappement ou un commentaire, ce n'est pas bon
    if(i==l01-1){
     // c'est bon
    }else{
     c1=tableauEntree[i+1][0];
     
     if(c1==','||c1=='\t'||c1==' '||c1=='\n'||c1=='\r'||c1=='/'||c1==')'){
      dernier=i-1;
     }else{
      return logerreur({status:false,value:T,message:'apres une constante, il doit y avoir un caractère d\'echappement en i='+i});
     }
    }
    dansCst=false;
    indice++;
    constanteQuotee=true;
    if(dansIgnore===true){
     dansIgnore=false;
    }
    
//    numeroLigne=calculNumLigne2(tableauEntree,premier);
    if(niveau==0){
     return logerreur({status:false,value:T,message:'0 la racine ne peut pas contenir des constantes en i='+i});
    }
    T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar,''));
    texte='';
    constanteQuotee=false;
    
   }else if(c=='\\'){
    if(i==l01-1){
     return logerreur({status:false,value:T,message:'un antislash ne doit pas terminer une fonction'});
    }else{
     c1=tableauEntree[i+1][0]; //o.substr(i+1,1);
     if(c1=='\\' || c1=='\''){
      if(texte==''){
       premier=i;
      }
      texte+=c1;
      i++;
     }else{
      if(c1=='n' || c1=='t' || c1=='r' ){
       if(texte==''){
        premier=i;
       }
       texte+='\\'+c1;
       i++;
       
      }else{
       return logerreur({status:false,value:T,message:'un antislash doit être suivi par un autre antislash ou un apostrophe '});
      }
     }
    }
   }else{
    if(texte==''){
     premier=i;
    }
    texte+=c;
   }
   
  }else{
   if(c=='('){
    posOuvPar=i;
    dansIgnore=false;
    
    indice++;
    if(texte==DEBUTCOMMENTAIRE){
     dsComment=true;
     niveauDebutCommentaire=niveau;
    }
    T.push(Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar,''));
    for(j=T.length-1;j>0;j--){
     l=T[j][3];
     for(k=j;k>=0;k--){
      if(T[k][3]==l-1){
       T[j][7]=k;
       break;
      }
     }
    }
    
    niveau++;
    texte='';
    dansCst=false;
    dansTexte=false;
   }else if(c==')'){
    posFerPar=i;
    
    faireCommentaire=true
    if(texte!=''){
     dansIgnore=false;
     indice++;
     if(niveau==0){
      return logerreur({status:false,value:T,message:'1 la racine ne peut pas contenir des constantes en i='+i});
     }
     T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,0,''));
     texte='';
     faireCommentaire=false;
    }
    if(dansIgnore===true && faireCommentaire===true){
     if(niveau>T[indice][3]){
      dansIgnore=false;
     }else{
      for(k=indice;k>0;k--){
       if(T[k][3]==niveau){
        dansIgnore=false;
        break;
       }
      }
     }
    }
    if(T[indice][2]=='c' && niveau==T[indice][3]){
     // si le dernier argument d'une fonction est une constante, il faut remonter pour chercher le commentaire apres
     if(T[indice][4]==true){ // si constante quotée
      k=T[indice][6]+2; // ne pas prendre en compte la quote
     }else{
      k=T[indice][6]+1;
     }
    }
    niveau--;
    // maj de la position de fermeture de la parenthèse
    for(j=indice;j>=0;j--){
     if(T[j][3]==niveau && T[j][2]=='f' ){
      T[j][12]=posFerPar;
      break;
     }
    }
    posFerPar=0;
    
    
    dansCst=false;
    dansTexte=false;
//    console.log('niveau='+niveau);
   }else if(c=='\\'){
    if(i==l01-1){
     return logerreur({status:false,value:T,message:'un antislash à la fin d\'une fonction n\'est pas autorisé'});
    }else{
     c1=tableauEntree[i+1][0];//o.substr(i+1,1);
     if(dansCst){
      debugger; // vérifier si ce code est utile car dansCst a été traité plus haut
      if(c1=='\'' || c1=='\\'){
       if(texte==''){
        premier=i;
       }
       texte+=c1;
       i++;
      }else{
       return logerreur({status:false,value:T,message:'un antislash dans une constante doit être suivi par un autre antislash ou par un caractère apostrophe'});
      }
     }else{
      return logerreur({status:false,value:T,message:'un antislash doit être dans une constante'});
     }
    }
   }else if(c=='\''){
    premier=i;
    if(dansCst){
     dansCst=false;
    }else{
     dansCst=true;
    }

   }else if(c==','){
    if(texte!=''){
     dansIgnore=false;
     indice++;
     if(niveau==0){
      numeroLigne=calculNumLigne2(tableauEntree,premier);
      return logerreur({status:false,value:T,message:'3 la racine ne peut pas contenir des constantes en i='+i+', numeroLigne='+numeroLigne,tabs:T});
     }
     T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar,''));
    }else{
     dansIgnore=false;
     if(T[indice][2]=='f'){
      // fin d'une fonction a(b),c
     }else{
      if(T[indice][3]>=niveau){
       // fin d'une fonction a(b),c
      }else{
       return logerreur({status:false,value:T,message:'une virgule ne doit pas être précédée d\'un vide'});
      }
     }
    }
    texte='';
    dansCst=false;
    dansTexte=false;
   }else if(c==' '||c=='\t'||c=='\r'||c=='\n'){
    // on ignore les espaces qui ne sont pas dans des constantes
    // mais si on n'est pas dans une constante, il se peut qu'on ai oublié une virgule.
    // dans ce cas, on ajoute une entrée dans le tableau
    
    if(texte!=''){
     indice++;
     if(dansIgnore===true){
      debutIgnore=i;
     }
     if(niveau==0){
//     numeroLigne=calculNumLigne2(tableauEntree,premier);
      return logerreur({status:false,value:T,message:'4 la racine ne peut pas contenir des constantes en i='+i});
     }
     T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar,''));
     texte='';
     dansCst=false;
     dansTexte=false;
     if(dansIgnore===false){
      debutIgnore=i;
     }
     dansIgnore=true;
     
    }else{
     if(dansIgnore===false){
      debutIgnore=i;
     }
     dansIgnore=true;
    }
    
   }else{
    dansTexte=true;
    if(texte==''){
     premier=i;
    }
//    if(!( (c>='A' && c<='Z') || ( c >='a' && c <= 'z' ) || ( c >='0' && c <= '9' ) || c=='.' || c=='_' || c=='-' || c=='$' || c=='&' || c=='[' || c==']' || c=='{' || c=='}' || c=='"' || c==':' || c=='+' || c=='*' || c=='`' )){
    if(!( c.charCodeAt(0)>=33 && c!='('  && c!=')'  && c!='\''   && c!='\\'  && c!='\n'  && c!='\t'  && c!=' ' )){
     if(c.charCodeAt(0)==8203){
      if(exitOnLevelError){
       return logerreur({status:false,value:T,levelError:levelError,message:'charcode 8203 ( x200B ) detecté 1 '});
      }
     }
     //Si ce n'est pas un caractère standard, on a peut être loupé un commentaire
     if(dansIgnore===false){
      debutIgnore=i;
     }
     if(premier>debutIgnore){
      debugger; // alors il y a un problème qu'il reste à étudier mais il ne semble pas que je passe par là
     }
     
     dansIgnore=true;
    }
    if(c.charCodeAt(0)==8203){
     if(exitOnLevelError){
      return logerreur({status:false,value:T,levelError:levelError,message:'charcode 8203 ( x200B ) detecté 2'});
     }else{
      global_messages.lines.push(i);
     }
    }
    texte+=c;
    dernier=i;
   }
  }
 }
 if(niveau!=0){
  levelError=true;
  if(exitOnLevelError){
   return logerreur({status:false,value:T,levelError:levelError,message:'des parenthèses ne correspondent pas'});
  }
 }

 if(texte!=''){
  if(dansIgnore===true){
   debutIgnore=i;
  }
  indice++;
  if(niveau==0){
   numeroLigne=calculNumLigne2(tableauEntree,premier);
   return logerreur({status:false,value:T,message:'5 la racine ne peut pas contenir des constantes en i='+i});
  }
  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar,''));
 }

 if(dansIgnore===true){
  // ce sont les commentaires de fin
  // on recherche la dernière fonction de niveau 0
  for(i=T.length-1;i>0;i--){
   if(T[i][3]==0 && T[i][2]=='f'){
    T[i][8]=lignesTableauEnTexte(tableauEntree,debutIgnore,l01-debutIgnore);//o.substr(debutIgnore,l01-debutIgnore);
    break;
   }
  }
  
 }
 // mise à jour de l'id du parent[7] et du nombre d'éléments[8] 
 for(i=T.length-1;i>0;i--){
  niveau=T[i][3];
  for(j=i;j>=0;j--){
   if(T[j][3]==niveau-1){
    T[i][7]=j;
    T[j][8]++;
    break;
   }
  }
 }
// 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE 12numEnfant 13numLi 14ferPar 15prof
// numérotage des enfants
 var numEnfant=0; 
 for(i=0;i<T.length;i++){
  numEnfant=0;
  for(j=i+1;j<T.length;j++){
   if(T[j][7]==T[i][0]){
    numEnfant++;
    T[j][9]=numEnfant;
   }
  }
 }
// profondeur des fonctions
 var nbNiveauxParentsARemonter=-1;
 for(i=T.length-1;i>0;i--){
  if(T[i][2]=='c'){
   T[i][10]=0;
  }
  if(T[i][7]>0){ // Si id du parent > 0
   var remonterDe=T[i][3];
   var idParent=T[i][7];
   for(var j=1;j<=remonterDe;j++){
    if(T[idParent][10]<j){
     T[idParent][10]=j;
    }
    idParent=T[idParent][7];
   }
  }
 }
 // fin analyse
 
 return {status:true,value:T,levelError:levelError};
 
}