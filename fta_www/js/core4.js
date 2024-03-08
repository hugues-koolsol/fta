"use strict";
//var test=' '.repeat(0);
console.log('test=','"'+(typeof test)+'"');
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
// return t.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'').replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t').replace(/\\\\r/g,'\\r');
// return t.replace(/\\/g,'\\\\').replace(/\'/g,'\\\''); //.replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t').replace(/\\\\r/g,'\\r');
 return t;
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
 var tableau1=iterateCharacters2(src);
 var matriceFonction=functionToArray2(tableau1.out,exitOnLevelError);
 global_messages.data.matrice=matriceFonction;
 global_messages.data.tableau=tableau1;
 return matriceFonction;
}
/*
var NBESPACESREV=3;
*/
//=====================================================================================================================
function ttcomm1Old(texte,niveau,ind){
 var t='';
 var multiLigne=false;
 var i=0;
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
 for(i=0;i<l01;i++){
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
function traiteCommentaire2(texte,niveau,ind){
 return traiteCommentaireSourceEtGenere1(texte,niveau,ind,NBESPACESSOURCEPRODUIT,false);
}

//=====================================================================================================================
function ttcomm1(texte,niveau,ind){
 return traiteCommentaireSourceEtGenere1(texte,niveau,ind,NBESPACESREV,true);
}
/*
var NBESPACESSOURCEPRODUIT=4;
*/
//=====================================================================================================================
function traiteCommentaireSourceEtGenere1(texte,niveau,ind,nbEspacesSrc1,fichierRev0){
 var t='';
 var i=0;
 var j=0;
 //var numTest=-1;
 if(texte.indexOf('\n')<0){
  return(texte);
 }
 var tab=texte.split('\n');
 var l01=tab.length;
 if(texte.length>=1 && texte.substr(0,1)=='#'){
  if(fichierRev0){
   return texte;
  }
  // trouver le premier non blanc
  var t='';
  var min=99999;
  for(i=1;i<l01;i++){
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
  // tout décaler à gauche
  if(min>0){
   for(var i=1;i<l01;i++){
    tab[i]=tab[i].substr(min);
   }
   texte=tab.join('\n');
  }
//  console.log( texte , min)
  
  
  return texte;
 }
 var newTab=[];
 for(i=0;i<l01;i++){
    t='';
    // on envève les espaces au début
    for(j=0;j<tab[i].length;j++){
     if(tab[i].substr(j,1)==' '){
     }else{
      t+=tab[i].substr(j);
      break;
     }
    }
    if(i==l01-1){
     if(t!=''){
      newTab.push(' '.repeat(nbEspacesSrc1*(niveau+1))+t);
      newTab.push(' '.repeat(nbEspacesSrc1*niveau));
     }else{
      newTab.push(' '.repeat(nbEspacesSrc1*niveau));
     }
    }else if(i==0){
     if(t!==''){
      t=' '.repeat(nbEspacesSrc1*(niveau+1))+t;
      newTab.unshift('');
      newTab.push(t);
     }else{
      newTab.push(t);
     }
    }else{
     if(fichierRev0){
      t=' '.repeat(nbEspacesSrc1*(niveau+1))+t;
     }else{
      t=' '.repeat(nbEspacesSrc1*niveau)+t;
     }
     newTab.push(t);
    }
    
 }
 t=newTab.join('\n');
 return t;
}



/*
==================================================================================
==================================================================================
==================================================================================
fonction transforme un texte pour qu'il soit visible en html
par exemple &nbsp; ou bien <
==================================================================================
==================================================================================
==================================================================================
*/
function strToHtml(s){
    var r1= new RegExp('&','g');
    var r2= new RegExp('<','g');
    var r3= new RegExp('>','g');
    s=s.replace(r1,'&amp;');
    s=s.replace(r2,'&lt;');
    s=s.replace(r3,'&gt;');
    return s;
}
/*
==================================================================================
==================================================================================
==================================================================================
fonction qui reconstitue un texte source à partir du tableau 
représentant la matrice du programme
==================================================================================
==================================================================================
==================================================================================
*/
function a2F1(arr,parentId,retourLigne,debut,coloration){
    /*
    ========================================
    Attention : cette fonction est récursive
    ========================================
    */
    var i=0;
    var j=0;
    var obj={};
    var t='';
    var profondeurLimite=3;
    var nombreEnfantsLimite=5;
    var forcerRetourLigne=false;
    var condition1=false;
    var commentaire='';
    var l01=0;
    l01=arr.length;
    /*
    =====================================================================
    boucle principale qui commence à partir de "debut" passé en paramètre
    =====================================================================
    */
    for(i=debut;i < l01;i=i+1){
        /*
        on ne traite que les enfants et les éléments 
        dont le niveau est supérieur au niveau du parent
        */
        if((arr[i][7] == parentId)){
            /*On va à la suite du programme*/
        }else if((arr[i][3] <= arr[parentId][3])){
            break;
        }else{
            /*
            on va dans la ligne suivante de la matrice 
            et on ne fait pas le traitement ci dessous 
            */
            continue;
        }
        /*
        On doit forcer le retour de ligne quand la
        profondeur est trop importante ou bien
        qu'il y a trop d'enfants ou bien qu'il
        y a des commentaires
        */
        if((retourLigne == true)&&arr[parentId][10] > profondeurLimite){
            forcerRetourLigne=true;
        }else if((retourLigne == true)&&/*le type du parent est une fonction ou bien c'est la racine*/(arr[parentId][2] == 'f')||arr[parentId][2] == 'INIT'){
            /*
            Si c'est la premier enfant d'une fonction, 
            on teste si il existe des enfants de type commentaires
            */
            for(j=debut;(j < l01)&&arr[j][3] > arr[parentId][3];j=j+1){
                if((arr[j][1] == DEBUTCOMMENTAIRE)&&arr[j][2] == 'f'&&arr[j][3] < arr[parentId][3]+profondeurLimite){
                    /*
                    il y a un commentaire
                    c'est une fonction
                    niveau inférieur à celui du parent + profondeur limite
                    */
                    forcerRetourLigne=true;
                    break;
                }
            }
            for(j=debut;(j < l01)&&arr[j][3] > arr[parentId][3];j=j+1){
                if((arr[j][8] > nombreEnfantsLimite)){
                    /*
                    si le nombre d'enfants est supérieur à 3
                    */
                    forcerRetourLigne=true;
                    break;
                }
            }
        }
        /*
        ici la variable forcerRetourLigne est éventuellement mise à true 
        var condition1=arr[parentId][2]=='f' 
        && arr[parentId][8]<=nombreEnfantsLimite 
        && arr[parentId][10]<=profondeurLimite;
        */
        condition1=(arr[parentId][2] == 'f') && arr[parentId][8] <= nombreEnfantsLimite && arr[parentId][10] <= profondeurLimite;
        if((arr[i][9] > 1)){
            /*!forcerRetourLigne && retourLigne==true && condition1*/
            if(!(forcerRetourLigne)&&retourLigne == true&&condition1){
                t=concat(t,' , ');
            }else{
                t=concat(t,',');
            }
        }
        if((((forcerRetourLigne)) && arr[parentId][2] != 'INIT')){
            t=concat(t,espacesnrev(false,arr[i][3]));
        }else if((retourLigne)){
            if(((arr[parentId][2] == 'INIT') && arr[i][9] == 1) || condition1){
                /*on ne fait rien*/
            }else{
                t=concat(t,espacesnrev(false,arr[i][3]));
            }
        }
        /*
        
        
        ================================
        si on doit traiter une constante
        ================================
        */
        
        if((arr[i][2] == 'c')){
            if(((coloration))){
                if((arr[i][4] == true)){
                    t=concat(t,'\'',strToHtml(arr[i][1]),'\'');
                }else{
                    t=concat(t,strToHtml(arr[i][1]));
                }
            }else{
                if((arr[i][4] == true)){
                    t=concat(t,'\'',arr[i][1],'\'');
                }else{
                    t=concat(t,arr[i][1]);
                }
            }
            continue;
        }
        /*
        
        
        ===================================================
        si on doit traiter une fonction de type commentaire
        ===================================================            
        */
        
        
        if((arr[i][2] == 'f') && arr[i][1] == DEBUTCOMMENTAIRE){
            /*
            ==========================
            on est dans un commentaire
            ==========================
            */
            commentaire=ttcomm1(arr[i][13],arr[i][3],i);
            if(((coloration))){
                /*mise en forme en HTML*/
                commentaire=strToHtml(commentaire);
                if(((retourLigne))){
                    t=concat(t,'<span ','style="','color:darkgreen;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',commentaire,')','</span>');
                }else{
                    t=concat(t,'<span ','style="','color:darkgreen;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',')','</span>');
                }
            }else{
                /*pas de mise en forme en HTML*/
                if(((retourLigne))){
                    t=concat(t,arr[i][1],'(',commentaire,')');
                }else{
                    t=concat(t,arr[i][1],'()');
                }
            }
            continue;
        }
        /*
        
        
        ===========================================================
        pour toutes les autres fonctions, on fait un appel récursif
        ===========================================================    
        */
        
        var obj={};
        obj=a2F1(arr,i,retourLigne,i+1,coloration);
        if(((obj.status === true))){
            /*on ajoute le nom de la fonction et on ouvre la parenthèse*/
            if(((coloration))){
                t=concat(t,strToHtml(arr[i][1]),'(');
            }else{
                t=concat(t,arr[i][1],'(');
            }
            /*
            ============================================
            on ajoute le contenu récursif de la fonction
            ============================================
            */
            t=concat(t,obj.value);
            /*
            on met les retours de ligne
            */
            if(((forcerRetourLigne) && obj.forcerRetourLigne == true)){
                t=concat(t,espacesnrev(false,arr[i][3]));
            }else if((retourLigne)){
                if(!((arr[i][8] <= nombreEnfantsLimite) && arr[i][10] <= profondeurLimite)){
                    t=concat(t,espacesnrev(false,arr[i][3]));
                }
            }
            /*
            on ferme la parenthèse
            */
            t=concat(t,')');
        }else{
            obj={'status':faux,'message':'erreur','id':i};
            return obj;
        }
    }
    obj={'status':true,'value':t,'forcerRetourLigne':forcerRetourLigne};
    return obj;
}

/*
==========================================
==========================================
==========================================
fonction qui produit un tableau html de la
des caractères du source du programme
==========================================
==========================================
==========================================
*/
function ConstruitHtmlTableauCaracteres(t2,texteSource,objTableau){
    var numeroLigne=0;
    var debut=0;
    var i=0;
    var j=0;
    var l01=0;
    var tmps='';
    var out= Array();
    t2.setAttribute('class','tableau2');
    if((objTableau === null)){
        /*On construit le tableau à partir du texte source*/
        var outo={};
        outo=iterateCharacters2(texteSource);
        out=outo.out;
    }else{
        out=objTableau.out;
    }
    /*
    première case du tableau = numéro de ligne
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.innerHTML=numeroLigne;
    tr1.appendChild(td1);
    /*boucle principale*/
    l01=out.length;
    for(i=0;i < l01;i=i+1){
        var td1={};
        td1=document.createElement('td');
        td1.innerHTML=out[i][0].replace('\n','\\n');
        tmps=out[i][0].codePointAt(0);
        td1.title=concat('&amp;#',tmps,'; (',out[i][1],')');
        tr1.appendChild(td1);
        /*
        ============================================
        Si on a un retour chariot, on écrit les 
        cases contenant les positions des caractères
        ============================================
        */
        if((out[i][0] == '\n')){
            t2.appendChild(tr1);
            /*
            
            out.push(Array(str.substr(i,2),2,i,numLigne));

            =================================================
            indice dans tableau = première ligne des chiffres
            =================================================
            */
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;j < i;j=j+1){
                var td1={};
                td1=document.createElement('td');
                if((out[j][1] == 1)){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=j;
                tr1.appendChild(td1);
            }
            /*
            
            =====================
            position du backslash
            =====================
            */
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=j;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            /*
            
            ========================================================
            position dans la chaine = deuxième ligne des chiffres
            car certains caractères utf8 sont codées sur 2 positions
            ========================================================
            */
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;j < i;j=j+1){
                var td1={};
                td1=document.createElement('td');
                if((out[j][1] == 1)){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=out[j][2];
                tr1.appendChild(td1);
            }
            /*
            
            =====================
            position du backslash
            =====================
            */
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=out[j][2];
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            /*
            
            
            ======================================
            fin des lignes contenant les positions
            ======================================
            */
            debut=i+1;
            numeroLigne=numeroLigne+1;
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.innerHTML=numeroLigne;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            /*
            ============================================
            FIN Si on a un retour chariot, on écrit les 
            cases contenant les positions des caractères
            ============================================
            */
        }
        /*dernière ligne de faire boucle*/
    }
    /*
    dernière ligne des positions des caractères
    */
    t2.appendChild(tr1);
    /*
    
    
    =================================================
    indice dans tableau = première ligne des chiffres
    =================================================
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;j < i;j=j+1){
        var td1={};
        td1=document.createElement('td');
        if((out[j][1] == 1)){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=j;
        tr1.appendChild(td1);
        /*finchoix suite du source*/
    }
    t2.appendChild(tr1);
    /*
    =====================
    pas de position du backslash
    =====================
    */
    /*
    =====================================================
    position dans la chaine = deuxième ligne des chiffres
    =====================================================
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;j < i;j=j+1){
        var td1={};
        td1=document.createElement('td');
        if((out[j][1] == 1)){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=out[j][2];
        tr1.appendChild(td1);
        /*finchoix suite du source*/
    }
    /*et enfin, on ajoute la dernière ligne*/
    t2.appendChild(tr1);
}
/*
==========================================
==========================================
==========================================
fonction qui produit un tableau html de la
forme matricielle du programme
==========================================
==========================================
==========================================
*/
function ConstruitHtmlMatrice(t1,matriceFonction){
    /**/
    var i=0;
    var j=0;
    var l01=0;
    var temp='';
    var tr1={};
    var td1={};
    var r1= new RegExp(' ','g');
    var r2= new RegExp('\n','g');
    tr1=document.createElement('tr');
    /*
    =================
    entête du tableau
    =================
    */
    l01=global_enteteTableau.length;
    for(i=0;i < l01;i=i+1){
        var td1={};
        td1=document.createElement('td');
        td1.innerHTML=concat(i,global_enteteTableau[i][0]);
        /*#                  td1.setAttribute('title',global_enteteTableau[i][1] + '(' + i + ')');*/
        td1.setAttribute('title',
            concat(global_enteteTableau[i][1],'(',i,')')
        );
        tr1.appendChild(td1);
    }
    t1.appendChild(tr1);
    /*
    
    
    ===================
    éléments du tableau
    ===================
    */
    l01=matriceFonction.value.length;
    for(i=0;i < l01;i=i+1){
        var tr1={};
        tr1=document.createElement('tr');
        for(j=0;j < matriceFonction.value[i].length;j=j+1){
            var td1={};
            td1=document.createElement('td');
            if((j == 1)||j == 13){
                /*Pour la valeur ou les commentaires*/
                temp=String(matriceFonction.value[i][j]);
                temp=temp.replace(r1,'░');
                temp=temp.replace(r2,'¶');
                td1.innerHTML=temp;
                td1.style.whiteSpace='pre-wrap';
                td1.style.verticalAlign='baseline';
            }else if((j == 4)){
                /*si la Constante est quotée*/
                if((matriceFonction.value[i][j] == true)){
                    td1.innerHTML='1';
                }else{
                    td1.innerHTML='';
                }
            }else{
                td1.innerHTML=String(matriceFonction.value[i][j]);
            }
            temp=concat(global_enteteTableau[j][1],'(',j,')');
            td1.setAttribute('title',temp);
            tr1.appendChild(td1);
        }
        t1.appendChild(tr1);
    }
}

/*
===========================================
===========================================
===========================================
fonction qui transforme un texte en tableau
===========================================
===========================================
===========================================
*/
function iterateCharacters2(str){
 
    var out= Array();
    var i=0;
    var numLigne=0;
    var exceptions=0;
    var l01=str.length;
    var codeCaractere='';
    var retour={};
    var temp=0;
    for(i=0;i < l01;i=i+1){
        codeCaractere=str.charCodeAt(i);
        if(!(codeCaractere === 8203 || codeCaractere === 11)){
            /*
            0xD800 =55296
            */
            temp=codeCaractere&0xF800;
            if(((temp === 55296))){
                out.push(Array(str.substr(i,2),2,i,numLigne));
                i=i+1;
            }else{
                out.push(Array(str.substr(i,1),1,i,numLigne));
                if((codeCaractere === 10)){
                    numLigne=numLigne+1;
                }
            }
        }else{
         exceptions=exceptions+1;
        }
    }
    retour={'out':out,'numLigne':numLigne,'exceptions':exceptions};
    return retour;
}
/*
==================================================
==================================================
==================================================
tableau retourné par l'analyse syntaxique 
du texte en entrée de la fonction functionToArray2
==================================================
==================================================
==================================================
*/
var global_enteteTableau= Array(
    Array('id','id'),
    Array('val','value'),
    Array('typ','type'),
    Array('niv','niveau'),
    Array('coQ','constante quotée'),
    Array('pre','position du premier caractère'),
    Array('der','position du dernier caractère'),
    Array('pId','Id du parent'),
    Array('nbE','nombre d\'enfants'),
    Array('nuE','numéro enfants'),
    Array('pro','profondeur'),
    Array('pop','position ouverture parenthese'),
    Array('pfp','position fermeture parenthese'),
    Array('com','commentaire')
);
/*
===================================================
===================================================
===================================================
fonction d'analyse syntaxique d'un programme source
===================================================
===================================================
===================================================
*/
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
    var T=[]; //Array();
    var temp={};
    /*
    =======================================================================
    initialisation du tableau contenant le source structuré en arborescence
    =======================================================================
    0id    1val  2typ  3niv  4coQ
    5pre   6der  7pId  8nbE  9numEnfant  
    10pro 11OPa 12FPa 13comm
    */
    T.push(
        Array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,'')
    );
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
        if((dsComment)){
            /*
            
            
            
            =============================
            Si on est dans un commentaire
            =============================
            */
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
            =============================
            FIN de Si on est dans un commentaire
            =============================
            
            
            
            */
        }else if((dansCst == true)){
            /*
            
            
            
            ============================
            Si on est dans une constante
            ============================
            */
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
                T.push(
                    Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,'')
                );
                texte='';
                constanteQuotee=false;
            }else if((c == '\\')){
                if((i == l01-1)){
                    temp={'status':false,'value':T,'id':i,'message':'un antislash ne doit pas terminer une fonction'};
                    return(logerreur(temp));
                }
                /**/
                c1=tableauEntree[i+1][0];
                if((c1 == '\\')||c1 == '\''||c1 == 'n'||c1 == 't'||c1 == 'r'){
                    if((texte == '')){
                        premier=i;
                    }
                    texte=concat(texte,'\\',c1);
                    i=i+1;
                }else{
                    temp={'status':false,'value':T,'id':i,'message':'un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r'};
                    return(logerreur(temp));
                }
            }else{
                if((texte == '')){
                    premier=i;
                }
                texte=concat(texte,c);
            }
            /*
            ===================================
            Fin de Si on est dans une constante
            ===================================
            
            
            
            */
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
                T.push(
                    Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,'')
                );
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
                    T.push(
                        Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
                    );
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
                    T.push(
                        Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
                    );
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
                    T.push(
                        Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
                    );
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
        /**/
        T.push(
            Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,'')
        );
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