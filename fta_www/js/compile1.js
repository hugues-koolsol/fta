"use strict";
var NBESPACESSOURCEPRODUIT=4;
/*
  ========================================================================================================================
  fonction transforme un commentaire pour un fichier source à générer
*/
function traiteCommentaire2(texte,niveau,ind){
    var s='';
    s=traiteCommentaireSourceEtGenere1(texte,niveau,ind,NBESPACESSOURCEPRODUIT,false);
    return s;
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
  t+=' '.repeat(NBESPACESSOURCEPRODUIT*i);
 }
 return t;
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
   t=t.replace(/<\?php\?>/g,'');
   
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
