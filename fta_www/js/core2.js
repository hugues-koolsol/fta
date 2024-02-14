"use strict";

// (typeof(b),egal('undefined')),et(d,egal(true))
var globale_LangueCourante='fr';
var global_messages={
 'e500logged' : false ,
 'errors'     : [] ,
 'warnings'   : [] ,
 'infos'      : [] ,
 'lines'      : [] ,
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
   }else{
   }
  }
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
 for(var i=0;i<global_messages.lines.length;i++){
  document.getElementById('global_messages').innerHTML+='<a href="javascript:jumpToError('+(global_messages.lines[i]+1)+')" class="yyerror">go to line '+global_messages.lines[i]+'</a>&nbsp;';
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
  
  nouveauTab.push(tab[0]);
  nouveauTab[0][8]='';
  
  for(i=id+1;i<tab.length && tab[i][3]>tab[id][3];i++){
    sousTab=[];
    for(j=0;j<tab[i].length;j++){
     sousTab.push(tab[i][j]);
    }
    nouveauTab.push(sousTab);
    if(i==id+1){
     nouveauTab[nouveauTab.length-1][10]=0;
    }else{
     nouveauTab[nouveauTab.length-1][10]=nouveauTab[nouveauTab.length-1][10]-id;
    }
  }
  retSource=arrayToFunctWidthComment(nouveauTab);
  if(retSource.status===true){
    var arr2=functionToArray(retSource.value,true);
    if(arr2.status===true){
      return {status:true,value:arr2.value};
    }else{
      console.error(arr2);
      return logerreur({status:false,value:nouveauTab,message:'impossible d\'extraire le sous-tableau'});
    }
  }else{
    console.error(retSource);
  }

  return logerreur({status:false,value:nouveauTab,message:'impossible d\'extraire le sous-tableau'});
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
 
 type_source=objArr.value[1][1];
 
 for(var i=0;i<objArr.value.length;i++){
  if(objArr.value[i][2]=='f' && objArr.value[i][3]==1 && objArr.value[i][1]==''){ //fonctions de niveau 1 vides
   for(var j=i;j<objArr.value.length;j++){
    if(objArr.value[j][10]==objArr.value[i][0] && objArr.value[i][11]>=2 ){ // si id de la fonction de niveau1 vide == idParent et qu'il y a au moins 2 enfants (file_name,nomFichier)
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
  if(objArr.value[i][2]=='f' && objArr.value[i][3]==1 && objArr.value[i][1]=='concatFichier' && objArr.value[i][11]==1){
   tabConcatFichier.push(objArr.value[i+1][1])
  }
  
 }

 if(file_name!='' && file_path!='' && idJs>0){
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
     retProgrammeSource=parseJavascript0(arr2.value,0,objArr.value[idJs][13]);
    }else if(type_source=='src_html'  && (file_extension=='html')){
     retProgrammeSource=tabToHtml1(arr2.value,1,objArr.value[idJs][13]);
    }else if(type_source=='src_php'  && (file_extension=='php')){
     retProgrammeSource=parsePhp0(arr2.value,1,objArr.value[idJs][13]);
    }else{
     return logerreur({status:false,id:0,message:'type de source "'+type_source+'" pour l\'extension "'+file_extension+'" non prévu'});
    }
    
    if(retProgrammeSource.status===true){
     return logerreur({status:true,value:retProgrammeSource.value,file_name:file_name,file_path:file_path,file_extension:file_extension});
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
     if(tabConcatFichier.length>0){
      concateneFichiers(tabConcatFichier,file_name,file_extension,file_path)
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
function commentairesComplementaires(arr,i){
 var j=0;
 var lignesDansCommentaireOriginal=[];
 var ret={
  complementCommentairesAvant:'',
  complementCommentairesApres:''
 }
 ret.complementCommentairesAvant='';
 ret.complementCommentairesApres='';
 lignesDansCommentaireOriginal=arr[i][7].split('\n');
 if(lignesDansCommentaireOriginal.length>0){
  if(lignesDansCommentaireOriginal.length!=arr[i][18].length){
   for(j=0;j<lignesDansCommentaireOriginal.length;j++){
    lignesDansCommentaireOriginal[j]=lignesDansCommentaireOriginal[j].replace(/ /g,'');
   }
   for(j=0;j<lignesDansCommentaireOriginal.length;j++){
    if(lignesDansCommentaireOriginal[j]==''){
     ret.complementCommentairesAvant+='\n';
    }else{
     break;
    }
   }
   for(j=lignesDansCommentaireOriginal.length-1;j>=0;j--){
    if(lignesDansCommentaireOriginal[j]==''){
     ret.complementCommentairesApres+='\n';
    }else{
     break;
    }
   }
  }
 }
 if(ret.complementCommentairesAvant!=''){
  ret.complementCommentairesAvant=ret.complementCommentairesAvant.substr(0,ret.complementCommentairesAvant.length-1);
 }
 if(ret.complementCommentairesApres!=''){
  ret.complementCommentairesApres=ret.complementCommentairesApres.substr(0,ret.complementCommentairesApres.length-1);
 }

 return ret; 
}
//=====================================================================================================================
function arrayToFunctNormalize(arr,bAvecCommentaires){
 var t='';
 var niveau=-1;
 var i,j,k,l;
 var prochainNiveauATraiter=-1;
 var le=arr.length;
 var sousTab=[];
 var stxt='';
 var tabComm=[];
 var aRetirer=[];
 var bContientAutreQueEspace=false;
 var sauveDernierCommentaire='';
 var espaceAvantFait=false;
 var dernierNiveauEspace=-1
 var doAbreak=true;
 var obj={};
 
 
 j=arr[0].length; 
// console.log('tailleTableau='+j); // 12
/*
 for(i=0;i<arr.length;i++){
//  var indNbEspaceRefParents       =j+0; // 12
//  arr[i].push(-1); // 12 nombre d'espaces de la référence parent
  var indCommentApresNettoye      =j+0; // 13
  arr[i].push(''); // 13 commentaire apres nettoyé
  var indCommentDedansNettoye     =j+1; // 14
  arr[i].push(''); // 14 commentaire dedans nettoyé
  var indCommentAvantNettoye      =j+2; // 15
  arr[i].push(''); // 15 commentaire avant nettoyé
  var indLigneUniqDsApresNettoye  =j+3; // 16
  arr[i].push(''); // 16 ligne unique dans 13 commentaire apres nettoyé
  var indLigneUniqDsDedansNettoye =j+4; // 17
  arr[i].push(''); // 17 ligne unique dans 14 commentaire dedans nettoyé
  var indLigneUniqDsAvantNettoye  =j+5; // 18
  arr[i].push(''); // 18 ligne unique dans 15 commentaire avant nettoyé
 }
*/

  var indCommentApresNettoye      =16;
  var indCommentDedansNettoye     =17;
  var indCommentAvantNettoye      =18;
  var indLigneUniqDsApresNettoye  =19;
  var indLigneUniqDsDedansNettoye =20;
  var indLigneUniqDsAvantNettoye  =21;



// console.log('indCommentApresNettoye='+indCommentApresNettoye);
 var tabcommentairesAtraiter=[ // 7,8,9 => 14 13 15 ( apres , dedans , avant )
  [ 8 , indCommentApresNettoye  , indLigneUniqDsApresNettoye  ],
  [ 9 , indCommentDedansNettoye , indLigneUniqDsDedansNettoye ],
  [ 7 , indCommentAvantNettoye  , indLigneUniqDsAvantNettoye  ]
 ]; 
// console.log('arr avec commentaires' , arr );
 prochainIndiceCommentaireApres=i-1; 
 for(i=1;i<le;i++){
   
  if(arr[i][3]<=niveau){ // on doit fermer des parenthèses intermédiaires !
  
   prochainIndiceCommentaireApres=i-1; 
  
   if(arr[i-1][2]=='c'){
   }else if(arr[i-1][2]=='f'){
    t+=')';   
    if(bAvecCommentaires){
     t+=CommentairesApresDe(arr,prochainIndiceCommentaireApres,indLigneUniqDsApresNettoye,indCommentApresNettoye);
    }
   }
   if(bAvecCommentaires){
    prochainIndiceCommentaireApres=arr[i-1][10];
   }
   for(j=i-1;j>0&&arr[j][3]>arr[i][3];j--){
    if(j==i-1){
     doAbreak=false;
     
     if(arr[j][8].indexOf('/')>=0 || arr[j][9].indexOf('/')>=0){
      if(t.substr(t.length-1,1)!='\n'){
       doAbreak=true;
      }
     }
     if(doAbreak==false){
      if(t.substr(t.length-1,1)==')' && arr[arr[j][10]][13]!=arr[arr[j][10]][14] ){
       doAbreak=true;
      }
     }
     
    }else{
     doAbreak=false;
     if(arr[prochainIndiceCommentaireApres][13]==arr[prochainIndiceCommentaireApres][14]){
     }else{
      for(k=t.length-1;k>0&&t.substr(k,1)!='\n';k--){
       if(!(t.substr(k,1)==' ' || t.substr(k,1)=='\t')){
        doAbreak=true;
        break;
       }
      }
     }
    }
    if(doAbreak){
     t+=espaces2(arr[j][3]-1);
    }
    if(t.substr(t.length-1,1)==')'){
     t+=' ';
    }else{
      // Si c'est une constante dans une fonction et qu'elle n'est pas l'unique argument et que c'est la dernière
      if( arr[arr[j][10]][11]>1 && arr[j][12]==arr[arr[j][10]][11] && arr[j][2]=='c' ){
//       t+=' ';
      }
    }
    t+=')';
    if(bAvecCommentaires){
     t+=CommentairesApresDe(arr,prochainIndiceCommentaireApres,indLigneUniqDsApresNettoye,indCommentApresNettoye);
     prochainIndiceCommentaireApres=arr[arr[j][10]][10];
    }
    j=arr[j][10]+1;
   }
  }
  // test fin
  
  
  
  if(i>1&&arr[i][3]<=niveau){
   doAbreak=false;
   // on va ecrire une virgule donc on doit repérer si l'élément précédent de même niveau contient un commentaire 
   for(j=i-1;j>0&&arr[j][3]>arr[arr[i][10]][3];j--){
    if(arr[i][3]==arr[j][3]){
     if(arr[j][8].indexOf('/')>=0 ){ // || arr[j][9].indexOf('/')>=0
      if(t.substr(t.length-1,1)!='\n'){
       for(k=t.length-1;k>0&&t.substr(k,1)!='\n';k--){
        if(!(t.substr(k,1)==' ' || t.substr(k,1)=='\t')){
         doAbreak=true;
         break;
        }
       }
//       doAbreak=true;
      }
     }
     break;
    }
   }
  
   if(doAbreak){
    t+=espaces2(arr[j][3]-1);
   }
   
   if(arr[i][13]==arr[i-1][13]){
    if(doAbreak){
     t+=',';
    }else{
     t+=' , ';
    }
   }else{
    t+=',';
   } 
  }
  
  
  if(!bAvecCommentaires){
   if(i>0&&arr[i][13]!=arr[i-1][13]){
    if(t!==''){
     t+=espaces2(arr[i][3]);
     dernierNiveauEspace=arr[i][3];
    }
   }
  }else{
   if(arr[i][indLigneUniqDsAvantNettoye]!=''){
    if(arr[i][indLigneUniqDsAvantNettoye]=='multi sans bloc'){
     obj=commentairesComplementaires(arr,i);
//     t+=obj.complementCommentairesAvant;
     
     
     for(j=0;j<arr[i][indCommentAvantNettoye].length;j++){
      if(arr[i][indCommentAvantNettoye][j]==''){
//       if(j>0){
        t+='\n';
//       }
      }else{
       t+=espaces2(arr[i][3]);
       dernierNiveauEspace=arr[i][3];
       t+=arr[i][indCommentAvantNettoye][j];
      }
     }
     t+=espaces2(arr[i][3]);
     dernierNiveauEspace=arr[i][3];
/*     
     for(j=0;j<arr[i][indCommentAvantNettoye].length;j++){
      if(t!=''){
       t+=espaces2(arr[i][3]);
       dernierNiveauEspace=arr[i][3];
      }
      t+=arr[i][indCommentAvantNettoye][j];
     }
     t+=obj.complementCommentairesApres;
     t+=espaces2(arr[i][3]);
     dernierNiveauEspace=arr[i][3];
*/     
    }else if(arr[i][indLigneUniqDsAvantNettoye]=='multi avec bloc'){
     if(t!=''){
      if(arr[i][indCommentAvantNettoye].substr(0,2)=='/*'){
       t+='\n';
       dernierNiveauEspace=arr[i][3];
      }
     }
     t+=arr[i][indCommentAvantNettoye];
     t+=espaces2(arr[i][3]);
     dernierNiveauEspace=arr[i][3];
    }else{
     if(t!=''){
      if(i>0&&arr[i][10]==arr[i-1][10]){
      }else{
       t+=espaces2(arr[i][3]);
       dernierNiveauEspace=arr[i][3];
      }
     }
     t+=arr[i][indCommentAvantNettoye];
     t+=espaces2(arr[i][3]);
     dernierNiveauEspace=arr[i][3];
    }
   }else{
    
    if(i>0&&arr[i][13]!=arr[i-1][13]){
     if(i>1&&arr[i][3]<=niveau && arr[i][2]=='c'){ // si on a mis une virgule et que l'élément suivant est une constante
      // si cette constante n'est pas au même niveau que l'élément précédent
      
      for(j=i-1;j>0;j--){
       if(arr[j][10]==arr[i][10] && arr[j][13] != arr[i][13] && arr[j][12] == arr[i][12]-1 ){
        doAbreak=true;
        // Mais si la virgule est toute seule sur la ligne

        for(k=t.length-2;k>=0 && t.substr(k,1)!='\n';k--){
         if(t.substr(k,1)!=' '){
          t+=espaces2(arr[i][3]);
          dernierNiveauEspace=arr[i][3];
          break;
         }
        }
        break
       }
      }
      
     }else{
      t+=espaces2(arr[i][3]);
      dernierNiveauEspace=arr[i][3];
     }
    }
    
   }
  }
  if(arr[i][2]=='f'){
   if(t.substr(t.length-1,1)=='('){
    t+=' ';
   }
   t+=arr[i][1]+'(';
   // indCommentDedansNettoye , indLigneUniqDsDedansNettoye ],
   if(bAvecCommentaires){
    if(arr[i][indLigneUniqDsDedansNettoye]!=''){
     if(arr[i][indLigneUniqDsDedansNettoye]=='multi sans bloc'){
      for(j=0;j<arr[i][indCommentDedansNettoye].length;j++){
       t+=arr[i][indCommentDedansNettoye][j];
      }
      t+=espaces2(arr[i][3]);
      dernierNiveauEspace=arr[i][3];
     }else if(arr[i][indLigneUniqDsDedansNettoye]=='multi avec bloc'){
      t+='\n';
      t+=arr[i][indCommentDedansNettoye];
      t+=espaces2(arr[i][3]);
      dernierNiveauEspace=arr[i][3];
     }else{
      t+=arr[i][indCommentDedansNettoye];
      t+=espaces2(arr[i][3]);
      dernierNiveauEspace=arr[i][3];
     }
    }
   }
   
   
   
  }else if(arr[i][2]=='c'){

   // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE 12numEnfant 13numLi 14ferPar
   // Si c'est une constante dans une fonction et qu'elle n'est pas l'unique argument 
   if( arr[arr[i][10]][11]>1 && arr[i][12]==1 && t.substr(t.length-1,1)=='(' ){
    t+=' ';
   }
   
   if(arr[i][4]===true){
    t+='\''+echappConstante(arr[i][1])+'\'';
   }else{
    t+=''+arr[i][1]+'';
   }
   // apres constante indCommentApresNettoye  , indLigneUniqDsApresNettoye  ],
   if(bAvecCommentaires){
    if(arr[i][indLigneUniqDsApresNettoye]!=''){
     if(arr[i][indLigneUniqDsApresNettoye]=='multi sans bloc'){
      for(j=0;j<arr[i][indCommentApresNettoye].length;j++){
       if(arr[i][indCommentApresNettoye][j]==''){
        t+='\n';
       }else{
        t+=espaces2(arr[i][3]);
        dernierNiveauEspace=arr[i][3];
        t+=arr[i][indCommentApresNettoye][j];
       }
/*       
       if(j>0){
        t+=espaces2(arr[i][3]);
       }
       // à voir hugues
       if(true || arr[i][indCommentApresNettoye][j]==''){
        if(j==0){
         t+='\n'+arr[i][indCommentApresNettoye][j];
        }else{
         t+=arr[i][indCommentApresNettoye][j];
        }
       }else{
        t+=(j==0?' ':'')+arr[i][indCommentApresNettoye][j];
       }
*/       
      }
      // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE 12numEnfant 13numLi
      if(arr[arr[i][10]][11]==arr[i][12]){ // si c'est la dernier enfant on ne met pas d'espaces apres
      }else{
       t+=espaces2(arr[i][3]);
       dernierNiveauEspace=arr[i][3];
      }
     }else if(arr[i][indLigneUniqDsApresNettoye]=='multi avec bloc'){
      t+='\n';
      t+=arr[i][indCommentApresNettoye];
      t+=espaces2(arr[i][3]);
      dernierNiveauEspace=arr[i][3];
     }else{
      t+=' '+arr[i][indCommentApresNettoye];
      if(arr[arr[i][10]][11]==arr[i][12]){ // si c'est la dernier enfant on ne met pas d'espaces apres
      }else{
       t+=espaces2(arr[i][3]);
       dernierNiveauEspace=arr[i][3];
      }
     }
    }
   }
      
  }else{
   return logerreur({status:false,message:'type non prévu dans arrayToFunctNoComment'});
  }
  
  
  niveau=arr[i][3];
 }
 
 // en fin de tableau
 // on a déjà écrit la dernière valeur ( fonction vide avec commentaire dedans "a( // xx" ou constante avec commentaire apres "a // xx" )
 var prochainIndiceCommentaireApres=i-1;
 
 if(i>0&&arr[i-1][3]>=0){
  if(arr[i-1][2]=='c'){
  }else if(arr[i-1][2]=='f'){
   t+=')';   
   if(bAvecCommentaires){
    t+=CommentairesApresDe(arr,prochainIndiceCommentaireApres,indLigneUniqDsApresNettoye,indCommentApresNettoye);
   }
  }
  if(bAvecCommentaires){
   prochainIndiceCommentaireApres=arr[i-1][10];
  }
  for(j=i-1;j>0&&arr[j][3]>0;j--){
   if(j==i-1){
    doAbreak=false;
    // si il y a des commentaires dans la ligne précédente

/*
    for(k=i-2;k>0&&arr[i-1][13]!=arr[arr[i-1][10]][13];k--){
     if(arr[k][8].indexOf('/')>=0 || arr[k][9].indexOf('/')>=0){
      if(t.substr(t.length-1,1)!='\n'){
       doAbreak=true;
       break;
      }
     }
    }
*/
/*
    for(k=t.length-1;k>0&&t.substr(k,1)!='\n';k--){
     if(t.substr(k,1)=='/'){
      doAbreak=true;
      break;
     }
    }
*/
    if(arr[j][8].indexOf('/')>=0 || arr[j][9].indexOf('/')>=0){
     if(t.substr(t.length-1,1)!='\n'){
      doAbreak=true;
     }
    }
    
    if(doAbreak==false){
     // si on vient de fermer une fonction null "f()"
     if(t.substr(t.length-1,1)==')' && arr[arr[j][10]][13]!=arr[arr[j][10]][14]){
      doAbreak=true;
     }
     if(doAbreak==false){
     // si on vient de fermer une constante "'a'" et que la ligne de fermeture de la fonction parente est différente de la ligne de cette constante
      if(arr[i-1][2]=='c' && arr[j][13]!=arr[arr[j][10]][14]){
       doAbreak=true;
      }
     }
    }
   }else{
    doAbreak=false;
    if(arr[prochainIndiceCommentaireApres][13]==arr[prochainIndiceCommentaireApres][14]){
    }else{
     for(k=t.length-1;k>0&&t.substr(k,1)!='\n';k--){
      if(!(t.substr(k,1)==' ' || t.substr(k,1)=='\t')){
       doAbreak=true;
       break;
      }
     }
    }
   }
   if(doAbreak){
    t+=espaces2(arr[j][3]-1);
   }
   if(t.substr(t.length-1,1)==')'){
    t+=' ';
   }else{
     // Si c'est une constante dans une fonction et qu'elle n'est pas l'unique argument et que c'est la dernière et qu'on a pas mis un saut avant
     if( arr[arr[j][10]][11]>1 && arr[j][12]==arr[arr[j][10]][11] && arr[j][2]=='c' && doAbreak==false ){
      t+=' ';
     }
   }
   
   t+=')';
   if(bAvecCommentaires){
    t+=CommentairesApresDe(arr,prochainIndiceCommentaireApres,indLigneUniqDsApresNettoye,indCommentApresNettoye);
    prochainIndiceCommentaireApres=arr[arr[j][10]][10];
   }
   j=arr[j][10]+1;
  }
 }


// test fin  

 
 
 
 
 if(bAvecCommentaires){
  if(arr[0][indLigneUniqDsApresNettoye]!==''){
   if(arr[0][indLigneUniqDsApresNettoye]=='mono'){
    t+=arr[0][indCommentApresNettoye]; // apres
    
   }else if(arr[0][indLigneUniqDsApresNettoye]=='multi sans bloc'){
    for(k=0;k<arr[0][indCommentApresNettoye].length;k++){
     for(l=0;l<arr[0][indCommentApresNettoye][k].length;l++){
      if(arr[0][indCommentApresNettoye][k].substr(l,1) !=' '){
       t+=espaces2(arr[0][3]);
       t+=''+arr[0][indCommentApresNettoye][k].substr(l);
       break;
      }
     }
    }
 //       t+=espaces2(arr[j][3]);
   }else if(arr[0][indLigneUniqDsApresNettoye]=='multi avec bloc'){
    if(arr[0][indCommentApresNettoye].substr(0,2)=='/*'){
     t+='\n';
    }
    t+=arr[0][indCommentApresNettoye]; //i 7 ndCommentAvantNettoye
   }else{
    t+='> TODO in arrayToFunctNormalize 801 "'+(arr[0][indLigneUniqDsApresNettoye])+'" <';
    t+=arr[0][indCommentApresNettoye]; //i 7 ndCommentAvantNettoye
   }
  }
 }
 
 
 return {status:true,value:t,tabNormalise:arr};
}

//=====================================================================================================================
function CommentairesApresDe(arr,j,indLigneUniqDsXxxNettoye,indCommentXxxNettoye){
 var t='';
 var k=0;
 if(arr[j][indLigneUniqDsXxxNettoye]!=''){
  if(arr[j][indLigneUniqDsXxxNettoye]=='multi sans bloc'){
   t+=espaces2(arr[j][3]);
   for(k=0;k<arr[j][indCommentXxxNettoye].length;k++){
    t+=arr[j][indCommentXxxNettoye][k];
    if(k==arr[j][indCommentXxxNettoye].length-1){
     t+=espaces2(arr[j][3]-1);
    }else{
     t+=espaces2(arr[j][3]);
    }
   }
  }else if(arr[j][indLigneUniqDsXxxNettoye]=='multi avec bloc'){
   t+='\n';
   t+=arr[j][indCommentXxxNettoye];
  }else{
   t+=arr[j][indCommentXxxNettoye];
  }
 }
 return t;
}
//=====================================================================================================================
function arrayToFunctWidthComment(arr){
 var t='';
 var niveau=-1;
 var delta=0;
 var i,j,k;
 var le=arr.length;
 var prochainNiveauATraiter=0;
 for(i=1;i<le;i++){
  if(arr[i][3]<=niveau){
   if(arr[i-1][2]=='f'){
    prochainNiveauATraiter=arr[i-1][3];
   }else{
    prochainNiveauATraiter=arr[i-1][3]-1;
   }
   try{
    for(j=i-1;j>0 && arr[j][3]>=arr[i][3] ;j--){
     if(arr[j][2]=='f' && prochainNiveauATraiter == arr[j][3] ){
      t+=arr[j][9]; // dedans
      t+=')';
      t+=arr[j][8]; // apres
      prochainNiveauATraiter--;
 /*     
      if(arr[j][3]==arr[i][3]){
       break;
      }
 */     
      j=arr[j][10]+1;
     }
    }
   }catch(e){
    debugger;
   }
  }
  if(i>1&&arr[i][3]<=niveau){
   t+=',';
  }
  if(arr[i][2]=='f'){
   t+=arr[i][7]; // avant
   t+=arr[i][1]+'(';
  }else if(arr[i][2]=='c'){
   if(arr[i][4]===true){ // si c'est quoté
    t+=arr[i][7]; // avant
    t+='\''+echappConstante(arr[i][1])+'\'';
    t+=arr[i][8]; // apres
   }else{
    t+=arr[i][7]; // avant
    t+=''+arr[i][1]+'';
    t+=arr[i][8]; // apres
   }
  }else{
   debugger;
   return logerreur({status:false,message:'type non prévu dans arrayToFunctWidthComment'});
  }
  niveau=arr[i][3];
 }
 
 if(i>0){
  if(arr[i-1][3]>=0){
   if(arr[i-1][2]=='f'){
    prochainNiveauATraiter=arr[i-1][3];
   }else{
    prochainNiveauATraiter=arr[i-1][3]-1;
   }
   for(j=i-1;j>0 && arr[j][3]>=0 ;j--){
    if(arr[j][2]=='f' && prochainNiveauATraiter == arr[j][3] ){
     t+=arr[j][9]; // dedans
     t+=')';
     t+=arr[j][8]; // apres
     prochainNiveauATraiter--;
/*
     if(arr[j][3]==0){
      break;
     }
*/
     j=arr[j][10]+1;
     
    }
   }
  }
 }
 t+=arr[0][8]; // dernier commentaire
 return {status:true,value:t};
}

//=====================================================================================================================
function traiteLignesCommentaireAvant(s,indiceTableau,niveau,premiereFonction){
 var t='';
 var niveauCommentaireBloc=0;
 var testIndice=-1;
 if(indiceTableau===testIndice){
//  console.error('s=',s);
 }
 var a=s.split('\n');
 if(indiceTableau===testIndice){
  console.error('a=',a);
 }
 
 for( var i=0;i<a.length;i++){
  var l=a[i];
  if(l.substr(0,2)=='/*'){
   niveauCommentaireBloc++;
  }
  
  if(niveauCommentaireBloc==0){
   var nl='';
   for(var j=0;j<l.length;j++){
    if(l.substr(j,1)==' ' || l.substr(j,1)=='\n'){
    }else{
     nl=l.substr(j);
     break;
    }
   }
   a[i]=nl;
  }
  if(l.substr(0,2)=='*/'){
   niveauCommentaireBloc--;
  }
  
 }
 if(indiceTableau===testIndice){
  console.error('a=',a);
 }
 // on enlève le premier
 if(a.length>=2 && premiereFonction===false){
  if( a[0].length>=2 && a[0].substr(0,2)=='/*'){
  }else{
   a.splice(0, 1);
  }
 }
 // on enlève le dernier
 if(a.length>=2){
  if(a[a.length-1].length>=2 && a.substr(0,2)=='*/'){
  }else{
   a.pop();
  }
 }
 for( var i=0;i<a.length;i++){
  if(a[i].length>=2 && a[i].substr(0,2)=='/*'){
   niveauCommentaireBloc++;
  }

  if(niveauCommentaireBloc==0){
   if(niveau>0){
    a[i]='  '.repeat(niveau)+a[i];
   }
  }
  if(a[i].length>=2 && a[i].substr(0,2)=='*/'){
   niveauCommentaireBloc--;
  }
 }
 if(indiceTableau===testIndice){
  console.error('a=',a);
 }
 var plusieursLignes=a.length>1?true:false;
 t+=a.join('\n');
 var desSlash=t.indexOf('//')>=0?true:false;
// t+=
 return {'text':t,'plusieursLignes':plusieursLignes,'desSlash':desSlash}
}
//=====================================================================================================================
function a2FWC(arr,parentId,retourLigne){
 var t='';
 for(var i=1;i<arr.length;i++){
  if(arr[i][10]==parentId){ // parent id
   if(arr[i][12]>1){ // numéro enfant
    if( arr[parentId][2]=='f' && arr[parentId][11]<=2 && arr[parentId][13]<=1 ){ // si le parent est une fonction et que son nombre d'enfants est 1 et que sa profondeur est <= 1
     t+=' , ';
    }else{
     t+=',';
    }
   }
   
   var commentaire=traiteLignesCommentaireAvant(arr[i][7],i,arr[i][3],(i==1?true:false));
   if(false && i==3){
    console.log('commentaire=',commentaire);
   }
   if( !(commentaire.desSlash || commentaire.plusieursLignes )
    &&(
           (arr[parentId][2]=='INIT' && arr[i][12]==1 ) // première fonction à la racine
        || (arr[parentId][2]=='f' && arr[parentId][11]<=2 && arr[parentId][13]<=1 ) // si le parent est une fonction et que son nombre d'enfants est 1 et que sa profondeur est <= 1
    )
   ){ 
   }else{
    if(commentaire.desSlash || commentaire.plusieursLignes){
     if(i!=1){
      t+='\n';
     }
     t+=commentaire.text;
    }
    t+=espaces2(arr[i][3]); // niveau
   }
   if(arr[i][2]=='c'){
    if(arr[i][4]===true){ // constante quotée
     t+='\''+echappConstante(arr[i][1])+'\'';
    }else{
     t+=arr[i][1];
    }
    var commentaire=traiteLignesCommentaireAvant(arr[i][8],i,arr[i][3],(i==1?true:false));
    if(false && i==4){
     console.log('commentaire=',commentaire);
    }
    if(commentaire.desSlash || commentaire.plusieursLignes ){
     t+='\n'+commentaire.text;
    }
    
   }else if(arr[i][2]=='f'){
    var obj=a2FWC(arr,i,retourLigne);
    if(obj.status===true){
     t+=arr[i][1]+'(';
     t+=obj.value;
     if(false && i==2){
      console.log('t='+t);
     }

     if(arr[i][13]==0){ // profondeur
     }else{
      if(arr[i][11]==1 && arr[i+1][2]=='c'){ // son nombre d'enfants est 1 et que son enfant est une constante
      }else{
       if(
           !(commentaire.desSlash || commentaire.plusieursLignes)
        && ( arr[i][2]=='f' && arr[i][11]<=2 && arr[i][13]<=1  )
       ){
       }else{
        t+=espaces2(arr[i][3]); // niveau
       }
      }
     }
     
     // commentaire dans la fonction
     var commentaire=traiteLignesCommentaireAvant(arr[i][9],i,arr[i][3]+1,(i==1?true:false));
     if(false && i==3){
      console.log('commentaire=',commentaire);
     }
     if(commentaire.desSlash || commentaire.plusieursLignes ){
      t+='\n'+commentaire.text+espaces2(arr[i][3]);
     }

     t+=')';
     // commentaire après la fonction et 
     var commentaire=traiteLignesCommentaireAvant(arr[i][8],i,arr[i][3],(i==1?true:false));
     if(false && i==5){
      console.log('commentaire=',commentaire);
     }
     if(commentaire.desSlash || commentaire.plusieursLignes ){
      t+='\n'+commentaire.text;
     }
     
     
     
    }else{
     return logerreur({status:false,message:'erreur pour i='+i});
    }
//    console.log('t1='+t);
   }else{
    return logerreur({status:false,message:'type non prévu dans a2FR pour i='+i});
   }
   
  }
 }
// console.log('t=\''+t+'\'');
 return {status:true,value:t};
 
}

//=====================================================================================================================
function arrayToFunctWithComment2(arr,retourLigne){
 var objStr={
  'str':''
 };
 var t='';
 var obj=a2FWC(arr,0,objStr,retourLigne);
 if(obj.status===true){
//  console.log('obj.value='+obj.value);
 }
 return obj;
}

//=====================================================================================================================
function a2FR(arr,parentId,retourLigne){
 var t='';
 for(var i=1;i<arr.length;i++){
  if(arr[i][10]==parentId){ // parent id
   if(arr[i][12]>1){ // numéro enfant
    if( retourLigne==true && arr[parentId][2]=='f' && arr[parentId][11]<=2 && arr[parentId][13]<=1 ){ // si le parent est une fonction et que son nombre d'enfants est 1 et que sa profondeur est <= 1
     t+=' , ';
    }else{
     t+=',';
    }
   }
   if(retourLigne){
    if( 
        (arr[parentId][2]=='INIT' && arr[i][12]==1 ) // première fonction à la racine
     || (arr[parentId][2]=='f' && arr[parentId][11]<=2 && arr[parentId][13]<=1 ) // si le parent est une fonction et que son nombre d'enfants est 1 et que sa profondeur est <= 1
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
    var obj=a2FR(arr,i,retourLigne);
    if(obj.status===true){
     t+=arr[i][1]+'(';
     t+=obj.value;
     
     if(retourLigne){
      if(arr[i][13]==0){ // profondeur
      }else{
       if(arr[i][11]==1 && arr[i+1][2]=='c'){ // son nombre d'enfants est 1 et que son enfant est une constante
       }else{
        if(arr[i][2]=='f' && arr[i][11]<=2 && arr[i][13]<=1){
        }else{
         t+=espaces2(arr[i][3]); // niveau
        }
       }
      }
     }
     t+=')';
    }else{
     return logerreur({status:false,message:'erreur pour i='+i});
    }
//    console.log('t1='+t);
   }else{
    return logerreur({status:false,message:'type non prévu dans a2FR pour i='+i});
   }
   
  }
 }
// console.log('t=\''+t+'\'');
 return {status:true,value:t};
 
}
//=====================================================================================================================
function arrayToFunctNoComment2(arr,retourLigne){
 var t='';
 var obj=a2FR(arr,0,retourLigne);
 if(obj.status===true){
//  console.log('obj.value='+obj.value);
 }
 return obj;
}
//=====================================================================================================================
function arrayToFunctNoComment(arr){
 var t='';
 var niveau=-1;
 var i,j,k;
 var prochainNiveauATraiter=-1;
 var le=arr.length;
 for(i=1;i<le;i++){
 
  if(arr[i][3]<=niveau){ // on doit fermer des parenthèses !
   prochainNiveauATraiter=arr[i-1][3]-1;
   if(arr[i-1][2]=='f'){
    t+=')';
//    prochainNiveauATraiter=arr[i-1][3];
   }
   if(arr[i][3]!=arr[i-1][3]){
    for(j=i-1;j>0 && arr[j][3]>=arr[i][3] ;j--){
     if(arr[j][2]=='f' && prochainNiveauATraiter==arr[j][3]){
      t+=')';
      prochainNiveauATraiter--;
      if(arr[j][3]==arr[i][3]){
       break;
      }
     }
    }
   }
  }
  if(i>1&&arr[i][3]<=niveau){
   t+=',';
  }
  if(arr[i][2]=='f'){
   t+=arr[i][1]+'(';
  }else if(arr[i][2]=='c'){
   if(arr[i][4]===true){
    t+='\''+echappConstante(arr[i][1])+'\'';
   }else{
    t+=''+arr[i][1]+'';
   }
  }else{
   return logerreur({status:false,message:'type non prévu dans arrayToFunctNoComment'});
  }
  niveau=arr[i][3];
 }
 
 if(i>0&&arr[i-1][3]>=0){
  prochainNiveauATraiter=arr[le-1][3]-1;
  if(arr[le-1][2]=='f'){
   t+=')';
//   prochainNiveauATraiter=arr[le-1][3];
  }
  if(arr[le-1][3]>0){
   for(j=le-1;j>0&&arr[j][3]>=0;j--){
    if(arr[j][2]=='f' && prochainNiveauATraiter==arr[j][3] ){
     t+=')';
     prochainNiveauATraiter--;
    }
   }
  }
 }
 return {status:true,value:t};
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
 ['cAv','commentaire avant'                 ,''],
 ['cAp','commentaire apres'                 ,''],
 ['cDe','commentaire dedans'                ,''],
 ['pId','Id du parent'                      ,''], // 10
 ['nbE','nombre d\'enfants'                 ,''],
 ['nuE','numéro enfants'                    ,''],
 ['pro','profondeur'                        ,''],
 ['pop','position ouverture parenthese'     ,''],
 ['pfp','position fermeture parenthese'     ,''], // 15
];
// 13 et 14 out
// 15 16 17 deviennent 13 14 15
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
 var dansCommentaireLigne=false;
 var dansCommentaireBloc=false;
 var niveauBloc=0;
 
 var texte='';
 var commentaire='';
 var cst='';
 
 var constanteQuotee=false;
 var premier=0;
 var dernier=0;
 
 
 var debutIgnore=0;
 var finIgnore=0;
 var dansIgnore=false;
 var commentaireAvant='';
 var commentaireApres='';
 var commentaireDedans='';
 var faireCommentaire=true;
 var numeroLigne=0;
 var parentId=0;
 var nombreEnfants=0;
 var numEnfant=0;
 
 var levelError=false;
 var profondeur=0;
 var posOuvPar=0;
 var posFerPar=0;
 
 
 
 //           0id	1val	2typ	3niv	4coQ	          5pre	    6der	  7cAv	            8cAp	            9cDe	            10pId	11nbE 12numEnfant  13profond  14OuvePar 15FerPar

 T.push(Array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,0    ,0    ,0          ,profondeur,posOuvPar,posFerPar));
 
 // o
 var l01=tableauEntree.length;
 for(i=0;i<l01;i++){
  c=tableauEntree[i][0];
//  if(c=='\n') numeroLigne++;
  if(dansCst){
   if(c=='\''){
    // si après une constante il n'y a pas de caractère d'échappement ou un commentaire, ce n'est pas bon
    if(i==l01-1){
     // c'est bon
    }else{
     c1=tableauEntree[i+1][0];
     
     if(c1==','||c1=='\t'||c1==' '||c1=='\n'||c1=='\r'||c1=='/'||c1==')'){
      dernier=i-1;
      if(c1!=')'){
//       i++;
      }
     // c'est bon
     }else{
      return logerreur({status:false,value:T,message:'apres une constante, il doit y avoir un caractère d\'echappement '});
     }
    }
    dansCst=false;
    indice++;
    constanteQuotee=true;
    if(dansIgnore===true){
     if(texte==''){
      commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore);//o.substr(debutIgnore,premier-debutIgnore);
     }else{
      commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore-1);//o.substr(debutIgnore,premier-debutIgnore-1);
     }
     dansIgnore=false;
    }
    
//    numeroLigne=calculNumLigne2(tableauEntree,premier);
    if(niveau==0){
     return logerreur({status:false,value:T,message:'0 la racine ne peut pas contenir des constantes en i='+i});
    }
    T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar));
    texte='';
    commentaireAvant='';
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
  }else if(dansCommentaireLigne){
   for(j=i;j<l01;j++){
    c1=tableauEntree[j][0];//o.substr(j,1);
//    if(c1=='\n') numeroLigne++;
    if(c1=='\n' || c1=='\r' ){
     dansCommentaireLigne=false;
     i=j;
     break;
    }
   }
  }else if(dansCommentaireBloc){
   for(j=i;j<l01-1;j++){
    c1=tableauEntree[j+0][0];//o.substr(j+0,1);
//    if(c1=='\n') numeroLigne++;

    c2=tableauEntree[j+1][0];//o.substr(j+1,1);
    if(c1=='/' && c2=='*' && ( i==0 || tableauEntree[j-1][0]=='\r' || tableauEntree[j-1][0]=='\n' ) ){
     niveauBloc++;
    }else if(c1=='*' && c2=='/' && ( tableauEntree[j-1][0]=='\r' || tableauEntree[j-1][0]=='\n' )  ){
     niveauBloc--;
    }else if(c1=='*' && c2=='/' && !( tableauEntree[j-1][0]=='\r' || tableauEntree[j-1][0]=='\n' )  ){
     numeroLigne=calculNumLigne2(tableauEntree,i);
     return logerreur({status:false,value:T,message:'un commentaire de bloc doit être fermé en première colonne en ligne '+numeroLigne });
    }
    if(niveauBloc==0){
     dansCommentaireBloc=false;
     i=j+1;
     break;
    }
   }
   
  }else{
   if(c=='('){
    posOuvPar=i;
    if(dansIgnore===true){
     if(texte==''){ // si c'est une fonction nulle, 
      commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,i-debutIgnore);//o.substr(debutIgnore,i-debutIgnore);
     }else{
      commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore);//o.substr(debutIgnore,premier-debutIgnore);
     }
     dansIgnore=false;
    }
    indice++;
    T.push(Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar));
    for(j=T.length-1;j>0;j--){
     l=T[j][3];
     for(k=j;k>=0;k--){
      if(T[k][3]==l-1){
       T[j][10]=k;
       break;
      }
     }
    }
    
    niveau++;
    texte='';
    commentaireAvant='';
    commentaireApres='';
    dansCst=false;
    dansTexte=false;
    dansCommentaireLigne=false;
    dansCommentaireBloc=false;
   }else if(c==')'){
    posFerPar=i;
    faireCommentaire=true
    if(texte!=''){
     if(dansIgnore===true){
      // une constante est le dernier paramètre d'une fonction et ne comporte pa de virgule, ex : a((b c))
      commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore);//o.substr(debutIgnore,premier-debutIgnore);
      dansIgnore=false;
     }
     indice++;
     if(niveau==0){
      return logerreur({status:false,value:T,message:'1 la racine ne peut pas contenir des constantes en i='+i});
     }
     T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,0));
     texte='';
     commentaireAvant='';
     faireCommentaire=false;
    }
    if(dansIgnore===true && faireCommentaire===true){
     if(niveau>T[indice][3]){
      commentaireDedans=lignesTableauEnTexte(tableauEntree,debutIgnore,i-debutIgnore);// o.substr(debutIgnore,i-debutIgnore);
      T[indice][9]=commentaireDedans;
      commentaireDedans='';
      dansIgnore=false;
     }else{
      for(k=indice;k>0;k--){
       if(T[k][3]==niveau){
        commentaireApres=lignesTableauEnTexte(tableauEntree,debutIgnore,i-debutIgnore);//o.substr(debutIgnore,i-debutIgnore);
        T[k][8]=commentaireApres;
        commentaireApres='';
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
     if(k<i){
      commentaireApres=lignesTableauEnTexte(tableauEntree,k,i-k);//o.substr(k,i-k);
      T[indice][8]=commentaireApres;
      commentaireApres='';
     }
    }
    niveau--;
    // maj de la position de fermeture de la parenthèse
    for(j=indice;j>=0;j--){
     if(T[j][3]==niveau && T[j][2]=='f' ){
      T[j][15]=posFerPar;
      break;
     }
    }
    posFerPar=0;
    
    
    dansCst=false;
    dansTexte=false;
    dansCommentaireLigne=false;
    dansCommentaireBloc=false;
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
   }else if(c=='/'){
    if(i==l01-1){
     return logerreur({status:false,value:T,message:'un slash à la fin d\'une fonction n\'est pas autorisé'});
    }else{
     c1=tableauEntree[i+1][0];//o.substr(i+1,1);
     if(c1=='/'){
      if(texte!=''){
       indice++;
       if(dansIgnore===true){
        commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore);//o.substr(debutIgnore,premier-debutIgnore);
        debutIgnore=i;
  //      dansIgnore=false;
       }     
       if(niveau==0){
        numeroLigne=calculNumLigne2(tableauEntree,premier);
        return logerreur({status:false,value:T,message:'2 la racine ne peut pas contenir des constantes en i='+i+' ligne='+numeroLigne});
       }
       T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar));
       texte='';
       commentaireAvant='';
       commentaireApres='';
       dansCst=false;
       dansTexte=false;
       dansCommentaireLigne=false;
       dansCommentaireBloc=false;
      }
      // test pour savoir si le commentaire de ligne // est bien le premier caractère non blanc sur la ligne
      if(i>0){
       for(j=i-1;j>=0;j--){
        if(tableauEntree[j][0]=='\n' || tableauEntree[j][0]=='\r'){
         break;
        }else if(tableauEntree[j][0]==' ' ){
         continue;
        }else{
         numeroLigne=calculNumLigne2(tableauEntree,i);
         return logerreur({status:false,value:T,message:'un commentaire de ligne ne doit pas suivre des instructions en ligne '+numeroLigne});
        }
       }
      }
      
      dansCommentaireLigne=true;
      if(dansIgnore===false){
       debutIgnore=i;
      }
      dansIgnore=true;
     }else if(c1=='*'){
      if(i==0 || tableauEntree[i-1][0]=='\r' || tableauEntree[i-1][0]=='\n'){ // o.substr(i-1,1)=='\r' || o.substr(i-1,1)=='\n'){
       if(dansIgnore===false){
        debutIgnore=i;
       }
       dansIgnore=true;
       dansCommentaireBloc=true;
       i++;
       niveauBloc=1;
      }else{
       return logerreur({status:false,value:T,message:'un commentaire de bloc doit commencer en colonne 1'});
      }
     }else{
      return logerreur({status:false,value:T,message:'un slash doit être suivi d\'un caractère * pour commencer un commentaire'});
     }
    }
    
   }else if(c==','){
    if(texte!=''){
     if(dansIgnore===true){
      commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore);//o.substr(debutIgnore,premier-debutIgnore);
      dansIgnore=false;
     }
     indice++;
     if(niveau==0){
      numeroLigne=calculNumLigne2(tableauEntree,premier);
      return logerreur({status:false,value:T,message:'3 la racine ne peut pas contenir des constantes en i='+i});
     }
     T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar));
    }else{
     if(dansIgnore===true){
      commentaireApres=lignesTableauEnTexte(tableauEntree,debutIgnore,i-debutIgnore); // o.substr(debutIgnore,i-debutIgnore);
      // on a eu une virgule => il faut trouver le niveau équivalent a niveau courant pour mettre à jour le commentaire apres
      if(T[indice][3]==niveau){
       T[indice][8]=commentaireApres;
      }else{
       for(j=indice-1;j>0;j--){
        if(T[j][3]==niveau){
         T[j][8]=commentaireApres;
         break;
        }
       }
      }
      dansIgnore=false;
     }
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
    commentaireAvant='';
    commentaireApres='';
    dansCst=false;
    dansTexte=false;
    dansCommentaireLigne=false;
    dansCommentaireBloc=false;
   }else if(c==' '||c=='\t'||c=='\r'||c=='\n'){
    // on ignore les espaces qui ne sont pas dans des constantes
    // mais si on n'est pas dans une constante, il se peut qu'on ai oublié une virgule.
    // dans ce cas, on ajoute une entrée dans le tableau
    
    if(texte!=''){
     indice++;
     if(dansIgnore===true){
      commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore); //o.substr(debutIgnore,premier-debutIgnore);
      debutIgnore=i;
//      dansIgnore=false;
     }
     if(niveau==0){
//     numeroLigne=calculNumLigne2(tableauEntree,premier);
      return logerreur({status:false,value:T,message:'4 la racine ne peut pas contenir des constantes en i='+i});
     }
     T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar));
     texte='';
     commentaireAvant='';
     commentaireApres='';
     dansCst=false;
     dansTexte=false;
     dansCommentaireLigne=false;
     dansCommentaireBloc=false;
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

 if(dansCommentaireBloc){
  numeroLigne=calculNumLigne2(tableauEntree,i);
  return logerreur({status:false,value:T,message:'un commentaire de bloc doit être fermé en première colonne en ligne '+numeroLigne });
 }else{
  if(texte!=''){
   if(dansIgnore===true){
    commentaireAvant=lignesTableauEnTexte(tableauEntree,debutIgnore,premier-debutIgnore);//o.substr(debutIgnore,premier-debutIgnore);
    debutIgnore=i;
   }
   indice++;
   if(niveau==0){
    numeroLigne=calculNumLigne2(tableauEntree,premier);
    return logerreur({status:false,value:T,message:'5 la racine ne peut pas contenir des constantes en i='+i});
   }
   T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,profondeur,posOuvPar,posFerPar));
  }
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
 for(i=T.length-1;i>0;i--){
  niveau=T[i][3];
  for(j=i;j>=0;j--){
   if(T[j][3]==niveau-1){
    T[i][10]=j;
    T[j][11]++;
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
   if(T[j][10]==T[i][0]){
    numEnfant++;
    T[j][12]=numEnfant;
   }
  }
 }
// profondeur des fonctions
 var nbNiveauxParentsARemonter=-1;
 for(i=T.length-1;i>0;i--){
  if(T[i][2]=='c'){
   T[i][13]=0;
  }
  if(T[i][10]>0){ // Si id du parent > 0
   var remonterDe=T[i][3];
   var idParent=T[i][10];
   for(var j=1;j<=remonterDe;j++){
    if(T[idParent][13]<j){
     T[idParent][13]=j;
    }
    idParent=T[idParent][10];
   }
  }
 }
 // fin analyse
 
 return {status:true,value:T,levelError:levelError};
 
}