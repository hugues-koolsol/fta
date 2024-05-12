"use strict";

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
  
  alert(resultat);
 }
}

function convertir_rev_en_php(nom_zone_source , nom_zone_genere){

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
  
  var objPhp=parsePhp0(matriceFonction.value,0,0);
  
  if(objPhp.status===true){
   
   dogid(nom_zone_genere).value=objPhp.value;
   
  }
  
 }else{
  
 }
 displayMessages('zone_global_messages');
}

//=====================================================================================================================
function traitement_apres_recuperation_ast_dans_zz_source_action(ret){
 
 console.log('ret=',ret.input.opt);
 try{
  var startMicro=performance.now();
  var ast=JSON.parse(ret.value);
//  console.log('ast=',ast);
  var obj=TransformAstPhpEnRev(ast,0,false);
  if(obj.status===true){
   console.log( ret.input.opt.nom_zone_rev )
   document.getElementById(ret.input.opt.nom_zone_rev).value='php('+obj.value+')';
/*   
   var tableau1 = iterateCharacters2(obj.value);
   var obj1=functionToArray2(tableau1.out,false,true,'');
   if(obj1.status===true){
    var endMicro=performance.now();  
    astphp_logerreur({status:true,message:'pas d\'erreur pour le rev '+parseInt(((endMicro-startMicro)*1000),10)/1000+' ms' });
    var tabToPhp=parsePhp0(obj1.value,0,0);
    if(tabToPhp.status===true){
      document.getElementById('txtar3').value=tabToPhp.value;
    }
   }else{
    astphp_logerreur({status:false,message:'erreur pour le rev'});
   }
*/   
  }
 }catch(e){
  astphp_logerreur({status:false,message:'erreur de conversion du ast vers json 0409 ' + e.message + ' ' + JSON.stringify(e.stack).replace(/\\n/g,'\n<br />') })
 }
 
 displayMessages('zone_global_messages');
 rangeErreurSelectionne=false;
 
}



function convertir_php_en_rev(nom_zone_genere, nom_zone_rev){

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

function convertir_html_en_rev(nom_zone_genere, nom_zone_source){

 var a=dogid(nom_zone_genere);
 var startMicro = performance.now();
 var objRev = TransformHtmlEnRev(a.value,0);
 if(objRev.status===true){

   dogid(nom_zone_source).value=objRev.value;

 }

 displayMessages('zone_global_messages');
 
 
}
function convertir_rev_en_html(nom_zone_source , nom_zone_genere){
 
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
  
 }else{
  
 }
 displayMessages('zone_global_messages');

}
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