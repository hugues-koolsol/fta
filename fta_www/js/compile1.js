"use strict";

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
   if(jsonRet.__xst===true){
    fntSiOk({__xst:true,__xva:jsonRet.__xva,nomZone:nomZone,nomFichierSource:nomFichierSource});
    try{
     localStorage.setItem("fta_dernier_fichier_charge", nomFichierSource);
    }catch(e){}
//    console.log('faireApres', faireApres , 'typeof faireApres' , typeof faireApres)
    if(typeof faireApres =='function'){
     faireApres();
    }
    return;
   }else{
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
   if(jsonRet.__xst===true){
//    console.log(tabConcatFichier);
    if(tabConcatFichier.length>0){
     concateneFichiers(tabConcatFichier,file_name,file_extension,file_path)
    }
    // do good stuff
    return;
   }else{
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
 var l01=objMatSrc.__xva.length;
 var position_de_la_balise_source=-1;
 for(var i=1;i<l01;i++){
  if(objMatSrc.__xva[i][3]==0){
   if(objMatSrc.__xva[i][1]=='#'){
   }else if(objMatSrc.__xva[i][1]=='src_javascript' ){
    type_source=objMatSrc.__xva[i][1];
    break;
   }else if(objMatSrc.__xva[i][1]=='src_html'){
    type_source=objMatSrc.__xva[i][1];
    break;
   }else if(objMatSrc.__xva[i][1]=='src_php'){
    type_source=objMatSrc.__xva[i][1];
    break;
   }else if(objMatSrc.__xva[i][1]=='src_sql'){
    type_source=objMatSrc.__xva[i][1];
    break;
   }
  }
 }
 if(type_source==''){
  return logerreur({__xst:false,__xme:'file core , fonction convertSource la fonction racine doit être "src_javascript", "src_html" , "src_sql" ou bien "src_php" '});
 }
 
 
 for(var i=0;i<l01;i++){
  if(objMatSrc.__xva[i][2]=='f' && objMatSrc.__xva[i][3]==1){
   if( objMatSrc.__xva[i][1]==''){ //fonctions de niveau 1 vides
    for(var j=i;j<objMatSrc.__xva.length;j++){
     if(objMatSrc.__xva[j][7]==objMatSrc.__xva[i][0] && objMatSrc.__xva[i][8]>=2 ){ // si id de la fonction de niveau1 vide == idParent et qu'il y a au moins 2 enfants (file_name,nomFichier)
 //       console.log(JSON.stringify(objMatSrc.__xva[j]));
      if(objMatSrc.__xva[j][1]=='file_name' && objMatSrc.__xva[j+1][1]!=''){
       file_name=objMatSrc.__xva[j+1][1];
      }
      if(objMatSrc.__xva[j][1]=='file_extension' && objMatSrc.__xva[j+1][1]!=''){
       file_extension=objMatSrc.__xva[j+1][1];
      }
      if(objMatSrc.__xva[j][1]=='file_path' && objMatSrc.__xva[j+1][1]!=''){
       file_path=objMatSrc.__xva[j+1][1];
      }
     }
    }
   }else if( objMatSrc.__xva[i][1]!=''){ //fonctions de niveau 1 NON vides
    if(objMatSrc.__xva[i][1]=='#'){
    }else if(objMatSrc.__xva[i][1]=='source'){
     position_de_la_balise_source=i;
    }else if(objMatSrc.__xva[i][1]=='concatFichier'){
    }else{
     return logerreur({__xst:false,id:i,__xme:'file core , fonction convertSource : l\'élément ne doit pas se trouver là '+JSON.stringify(objMatSrc.__xva[i])});
    }
   }

  }
  if(objMatSrc.__xva[i][2]=='f' && objMatSrc.__xva[i][3]==1 && objMatSrc.__xva[i][1]=='source'){ // fonction de niveau 1 = source
   if(idJs==-1){
    idJs=i;
   }else{
    idJs=-2;
   }
  }
  if(objMatSrc.__xva[i][2]=='f' && objMatSrc.__xva[i][3]==1 && objMatSrc.__xva[i][1]=='concatFichier' && objMatSrc.__xva[i][8]==1){
   tabConcatFichier.push(objMatSrc.__xva[i+1][1])
  }
 }
 var t='';
 if(file_name!='' && file_path!='' && idJs>0){
  
  if(type_source=='src_php'  && (file_extension=='php')){
   var baliseHtmlOuPhpTrouvee=false;
   for(var i=idJs+1;i<objMatSrc.__xva.length;i++){
    if(objMatSrc.__xva[i][7]==idJs && objMatSrc.__xva[i][1]=='php'){
     baliseHtmlOuPhpTrouvee=true;
     php_contexte_commentaire_html=false;
     retProgrammeSource=parsePhp0(objMatSrc.__xva , i , 0 );
     if(retProgrammeSource.__xst === true){
      t+='<?php'+CRLF+retProgrammeSource.__xva+CRLF+'?>';
     }else{
      return logerreur({__xst:false,id:i,__xme:'file core , fonction convertSource : erreur dans un php'});
     }
    }else if(objMatSrc.__xva[i][7]==idJs && objMatSrc.__xva[i][1]=='html'){
     baliseHtmlOuPhpTrouvee=true;
     php_contexte_commentaire_html=true;
     //                             tab             , id , noHead , niveau
     retProgrammeSource=__module_html1.tabToHtml1( objMatSrc.__xva , i  , true   , 0      );
     if(retProgrammeSource.__xst === true){
      t+='\n'+retProgrammeSource.__xva+'\n';
     }else{
      return logerreur({__xst:false,id:i,__xme:'file core , fonction convertSource : erreur dans un php'});
     }
    }
   }
   if(baliseHtmlOuPhpTrouvee===false && position_de_la_balise_source>0){
    /*
    on a oubblié la balise php ou html, on suppose que c'est du php !
    
    */
    php_contexte_commentaire_html=false;
    retProgrammeSource=parsePhp0(objMatSrc.__xva , position_de_la_balise_source , 0 );
    if(retProgrammeSource.__xst === true){
     t+='<?php'+CRLF+retProgrammeSource.__xva+CRLF+'?>';
    }else{
     return logerreur({__xst:false,id:i,__xme:'file core , fonction convertSource : erreur dans un php'});
    }
    
   }
   t=t.replace(/\/\*\*\//g,'');
   t=t.replace(/\?><\?php/g,'');
   t=t.replace(/<\?php\?>/g,'');
   t=t.replace(/<\?php\r\?>/g,'');
   t=t.replace(/<\?php\n\?>/g,'');
   t=t.replace(/<\?php\r\n\?>/g,'');
   if(t.substr(0,2)==='\r\n'){
    t=t.substr(2);
   }else{
    if(t.substr(0,1)==='\r' || t.substr(0,1)==='\r' ){
     t=t.substr(1);
    }
   }
   
   return logerreur({__xst:true,__xva:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }else if(type_source=='src_javascript'  && (file_extension=='js')){
   retProgrammeSource=parseJavascript0(objMatSrc.__xva ,idJs+1 , 0 );
   if(retProgrammeSource.__xst === true){
    t+=retProgrammeSource.__xva;
   }else{
    return logerreur({__xst:false,id:i,__xme:'file core , fonction convertSource : erreur dans un javascript'});
   }
   return logerreur({__xst:true,__xva:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }else if(type_source=='src_html'  && (file_extension=='html')){
   //                             tab             , id     , noHead , niveau
   retProgrammeSource=__module_html1.tabToHtml1( objMatSrc.__xva , idJs+1 , false  , 0      );
   if(retProgrammeSource.__xst === true){
    t+=retProgrammeSource.__xva;
   }else{
    return logerreur({__xst:false,id:i,__xme:'file core , fonction convertSource : erreur dans un html'});
   }
   return logerreur({__xst:true,__xva:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }else if(type_source=='src_sql'  && (file_extension=='sql')){
   //                             tab             , id    , niveau , format php
   retProgrammeSource=tabToSql1( objMatSrc.__xva , idJs+1 , 0      , false );
   if(retProgrammeSource.__xst === true){
    t+=retProgrammeSource.__xva;
   }else{
    return logerreur({__xst:false,id:i,__xme:'file core , fonction convertSource : erreur dans un sql'});
   }
   return logerreur({__xst:true,__xva:t,file_name:file_name,file_path:file_path,file_extension:file_extension,tabConcatFichier:tabConcatFichier});
  }
//console.log('t=',t);
 }else{
  return logerreur({__xst:false,id:0,__xme:'file_name, file_path and source must be filled'});
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
   if(jsonRet.__xst===true){
    return;
   }else{
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
  contenu_du_fichier        : value     ,
  file_name                 : fileName       ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 return logerreur({__xst:true});  
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
   if(jsonRet.__xst===true){
    if(obj.tabConcatFichier.length>0){
     concateneFichiers(obj.tabConcatFichier,obj.file_name,obj.file_extension,obj.file_path)
    }
    return;
   }else{
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
  contenu_du_fichier        : obj.__xva     ,
  file_name                 : obj.file_name       ,
  file_extension            : obj.file_extension  ,
  file_path                 : obj.file_path       ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 return logerreur({__xst:true});  
}
