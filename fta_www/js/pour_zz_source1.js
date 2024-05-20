"use strict";




/*
  =====================================================================================================================
*/
function aller_a_la_position(nom_textarea){
 var resultat = window.prompt('aller à la position', 1);
 if(resultat && isNumeric(resultat)){
  var a=dogid(nom_textarea);
  a.rows="100";
  a.focus();
  a.selectionStart=0;
  a.selectionEnd=resultat;
 }  
}
/*
  =====================================================================================================================
*/
function aller_a_la_ligne(nom_textarea){
 var resultat = window.prompt('aller à la ligne n°?', 1);
 if(resultat && isNumeric(resultat)){
  var a=dogid(nom_textarea);
  var lignes=a.value.split('\n');
  if(lignes.length>=resultat){
   lignes.splice(resultat, lignes.length-resultat);
   var position=0;
   console.log(lignes.length);
   
   for(var i=lignes.length-1;i>=0;i--){
    
    position+=lignes[i].length+1;
   
   }
   a.focus();
   a.selectionStart=0;
   a.selectionEnd=position;
   
  }
 }
}

/*
  =====================================================================================================================
*/
function convertir_rev_en_js(chp_rev_source,chp_genere_source,id_source,id_cible){
   clearMessages('zone_global_messages');
   var a = document.getElementById(chp_rev_source);
   var startMicro=performance.now();
   
   var tableau1 = iterateCharacters2(a.value);
   global_messages.data.tableau=tableau1;
   var endMicro = performance.now();
   var startMicro = performance.now();
   var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
   global_messages.data.matrice=matriceFonction;
   if(matriceFonction.status===true){
    
    var objJs=parseJavascript0(matriceFonction.value,1,0);
    
    if(objJs.status===true){
     
     dogid(chp_genere_source).value=objJs.value;
     
    }
    
    
    var parametres_sauvegarde={
     'matrice': matriceFonction.value,
     'chp_provenance_rev' : 'source',
     'chx_id_provanance_rev' : id_source,
     'id_cible' : id_cible
    }
    
    sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    
    
   }
   
   displayMessages('zone_global_messages' , chp_rev_source);
   
   
}
/*
  =====================================================================================================================
*/
function convertir_js_en_rev(chp_genere_source , chp_rev_source){
   clearMessages('zone_global_messages');
   var a = document.getElementById(chp_genere_source);
   var startMicro=performance.now();
   try{
       
       var ret = esprima.parseScript(a.value,{range:true,comment:true});
       tabComment=ret.comments;
       var objRev = TransformAstEnRev(ret.body,0);
       var endMicro=performance.now();  console.log('mise en tableau endMicro=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');       
       if(objRev.status == true){
         dogid(chp_rev_source).value=objRev.value;
       }else{
         displayMessages('zone_global_messages',chp_genere_source);
       }

   }catch(e){
       console.log('erreur esprima',e);
       if(e.lineNumber){
        astjs_logerreur({status:false,message:'il y a une erreur dans le javascript d\'origine en ligne '+e.lineNumber,line:e.lineNumber});
       }
       ret=false;
   }
   
   
   
   displayMessages('zone_global_messages',chp_genere_source);
   rangeErreurSelectionne=false;
}
/*
  =====================================================================================================================
*/

function convertir_texte_en_rev(nom_zone_genere, nom_zone_source){

 clearMessages('zone_global_messages');
 var a=dogid(nom_zone_genere);
 var startMicro = performance.now();
 
 var obj_texte=js_texte_convertit_texte_en_rev_racine(a.value,0);
 if(obj_texte.status===true){

   dogid(nom_zone_source).value=obj_texte.value;

 }

 displayMessages('zone_global_messages');
 
 
}
/*
  =====================================================================================================================
*/
function convertir_rev_en_texte(nom_zone_source , nom_zone_genere , id_source , id_cible){
 clearMessages('zone_global_messages');
 var a=dogid(nom_zone_source);
 var startMicro = performance.now();
 var tableau1 = iterateCharacters2(a.value);
 global_messages.data.tableau=tableau1;
 var endMicro = performance.now();
 var startMicro = performance.now();
 var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
 
 console.log('\n\n=============\nmise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
 
 if(matriceFonction.status===true){
  
  var objTexte=convertir_tableau_rev_vers_texte_racine(matriceFonction.value,0,0);
  
  if(objTexte.status===true){
   
   dogid(nom_zone_genere).value=objTexte.value;
   
  }else{
   
   displayMessages('zone_global_messages' , nom_zone_source);
   
  }
  
  var parametres_sauvegarde={
   'matrice': matriceFonction.value,
   'chp_provenance_rev' : 'source',
   'chx_id_provanance_rev' : id_source,
   'id_cible' : id_cible
  }
  
  sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
  
  
 }
 
}

/*
  =====================================================================================================================
*/
function traitement_apres_recuperation_ast_dans_zz_source_action(ret){
 
 clearMessages('zone_global_messages');
 console.log('ret=',ret.input.opt);
 try{
  var startMicro=performance.now();
  var ast=JSON.parse(ret.value);
//  console.log('ast=',ast);
  var obj=TransformAstPhpEnRev(ast,0,false);
  if(obj.status===true){
   console.log( ret.input.opt.nom_zone_rev )
   document.getElementById(ret.input.opt.nom_zone_rev).value='php('+obj.value+')';
  }else{
    
    displayMessages('zone_global_messages' , ret.input.opt.nom_zone_genere);
  }
 }catch(e){
  astphp_logerreur({status:false,message:'erreur de conversion du ast vers json 0409 ' + e.message + ' ' + JSON.stringify(e.stack).replace(/\\n/g,'\n<br />') })
 }
 
 displayMessages('zone_global_messages' , ret.input.opt.nom_zone_genere);
 rangeErreurSelectionne=false;
 
}


/*
  =====================================================================================================================
*/

function convertir_php_en_rev(nom_zone_genere, nom_zone_rev){

 clearMessages('zone_global_messages');
 var a=dogid(nom_zone_genere);
 var startMicro = performance.now();
 
  try{
   var ret=recupereAstDePhp(a.value,{'nom_zone_genere':nom_zone_genere,'nom_zone_rev':nom_zone_rev},traitement_apres_recuperation_ast_dans_zz_source_action); // ,{'comment':true}
   if(ret.status===true){
//    console.log('ret=',ret)
   }else{
    astphp_logerreur({status:false,message:'il y a une erreur d\'envoie du source php à convertir'})
    displayMessages('zone_global_messages');
    rangeErreurSelectionne=false;
    ret=false;
   }
  }catch(e){
   console.log('erreur transform 0178',e);
   ret=false;
  }


}
/*
  =====================================================================================================================
*/

function convertir_html_en_rev(nom_zone_genere, nom_zone_source){

 clearMessages('zone_global_messages');
 var a=dogid(nom_zone_genere);
 var startMicro = performance.now();
 var objRev = TransformHtmlEnRev(a.value,0);
 if(objRev.status===true){

   dogid(nom_zone_source).value=objRev.value;

 }

 displayMessages('zone_global_messages');
 
 
}
/*
  =====================================================================================================================
*/

function convertir_rev_en_html(nom_zone_source , nom_zone_genere, id_source , id_cible){
 
 clearMessages('zone_global_messages');
 var a=dogid(nom_zone_source);
 var startMicro = performance.now();
 var tableau1 = iterateCharacters2(a.value);
 global_messages.data.tableau=tableau1;
 var endMicro = performance.now();
 console.log('\n\n=============\nmise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
 var startMicro = performance.now();
 var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
 
 if(matriceFonction.status===true){
  
  var objHtml=tabToHtml1(matriceFonction.value,0,false,0);
  
  if(objHtml.status===true){
   
   dogid(nom_zone_genere).value=objHtml.value
   
  }
  
  var parametres_sauvegarde={
   'matrice': matriceFonction.value,
   'chp_provenance_rev' : 'source',
   'chx_id_provanance_rev' : id_source,
   'id_cible' : id_cible
  }
  
  sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
  
 }else{
  
 }
 displayMessages('zone_global_messages');

}
/*
  =====================================================================================================================
*/

function supprimer_un_fichier_du_disque(nom_de_fichier_encrypte){
// console.log(nom_de_fichier_encrypte);
 
 clearMessages('zone_global_messages');
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?supprimer_un_fichier_avec_un_nom_encrypte',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    console.log('jsonRet=',jsonRet);
    document.location=String(document.location);
    return;
   }else{
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    displayMessages('zone_global_messages');
//    alert('Problème XMLHttpRequest, voir la console javascript !');
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
   funct                     : 'supprimer_un_fichier_avec_un_nom_encrypte' ,
  },
  file_name                  : nom_de_fichier_encrypte   ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 
 
}/*
  =====================================================================================================================
*/

function lire_un_fichier_du_disque(nom_de_fichier_encrypte){
// console.log(nom_de_fichier_encrypte);
 
 clearMessages('zone_global_messages');
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?charger_un_fichier_avec_un_nom_encrypte',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    console.log('jsonRet=',jsonRet);
    dogid('chp_genere_source').value=jsonRet.value;
    return;
   }else{
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    displayMessages('zone_global_messages');
//    alert('Problème XMLHttpRequest, voir la console javascript !');
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
   funct                     : 'charger_un_fichier_avec_un_nom_encrypte' ,
  },
  file_name                  : nom_de_fichier_encrypte   ,
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 
 
}