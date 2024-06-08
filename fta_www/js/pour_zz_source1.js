"use strict";

/*
  =====================================================================================================================
*/
function convertir_rev_en_sql(chp_rev_source,chp_genere_source,id_source,id_cible){
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

    var objSql=tabToSql1(matriceFonction.value,0,0);
    
    if(objSql.status===true){
     
        dogid(chp_genere_source).value=objSql.value;
     
    }
    
    
    var parametres_sauvegarde={
     'matrice': matriceFonction.value,
     'chp_provenance_rev' : 'source',
     'chx_source_rev' : id_source,
     'id_cible' : id_cible
    }
    
    sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    
    
   }
    
}

/*
  =====================================================================================================================
*/
function convertir_sqlite_en_rev(chp_rev_source,chp_genere_source){
 var source_sqlite=dogid(chp_genere_source).value;

 
 var obj=convertion_texte_sql_en_rev(source_sqlite);
 if(obj.status===true){
  dogid(chp_rev_source).value=obj.value;
 }else{
   logerreur({status:false,message:'Erreur de convertion'})
 }
 displayMessages('zone_global_messages');
}

/*
  =====================================================================================================================
*/
function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(id_source , contenuRev , contenuSource , date_de_debut_traitement , matrice){
 
 
    var r = new XMLHttpRequest();
    r.open("POST",'za_ajax.php?sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant',true);
    r.timeout=6000;
    r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        try{
            var jsonRet=JSON.parse(r.responseText);
            if(jsonRet.status=='OK'){
             
                var date_de_fin_traitement = new Date();
                date_de_fin_traitement = date_de_fin_traitement.getTime();
             
                var date_de_debut_traitement=jsonRet.input.date_de_debut_traitement;
                var nombre_de_secondes = (date_de_fin_traitement-date_de_debut_traitement)/1000;

                
                if(jsonRet.input.parametres_sauvegarde.nom_du_source){
                 logerreur({status:true,message:'la réécriture de '+jsonRet.input.parametres_sauvegarde.nom_du_source+' a été faite en '+nombre_de_secondes+' secondes'})
                }else{
                 logerreur({status:true,message:'la réécriture du fichier a été faite en '+nombre_de_secondes+' secondes'})
                }
                displayMessages('zone_global_messages');
                return;
            }else{
                display_ajax_error_in_cons(jsonRet);
                console.log(r);
                displayMessages('zone_global_messages');
                return;
            }
        }catch(e){
         console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
         return;
        }
    };
    r.onerror=function(e){console.error('e=',e); /* a_faire(); */    return;}
    r.ontimeout=function(e){console.error('e=',e); /* a_faire(); */    return;}
    var ajax_param={
        call:{
         lib       : 'core'          ,
         file      : 'file' ,
         funct     : 'sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant' ,
        },
        id_source                : id_source   ,
        rev                      : contenuRev,
        source                   : contenuSource,
        date_de_debut_traitement : date_de_debut_traitement,
        matrice                  : matrice
    }
    r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 
 
}
/*
*/
function traitement_apres_ajax_pour_conversion_fichier_sql(par){
 
    var objRev = convertion_texte_sql_en_rev(par.contenu_du_fichier);
    
    if(objRev.status===true){

       var tableau1 = iterateCharacters2(objRev.value);
       var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
       
       if(matriceFonction.status===true){
        
           var objSql=tabToSql1(matriceFonction.value,0,0);
           if(objSql.status===true){
            
                var contenu=objSql.value.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'');            
//                console.log(objSql.value);
                sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.id_source , objRev.value , contenu , par.input.date_de_debut_traitement , matriceFonction.value);
               
           }

       }

    }

}

function traitement_apres_ajax_pour_conversion_fichier_html(par){

    var objRev = __module_html1.TransformHtmlEnRev(par.contenu_du_fichier,0);
    if(objRev.status===true){

       var tableau1 = iterateCharacters2(objRev.value);
       var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
       
       if(matriceFonction.status===true){
        
           var objHtml=__module_html1.tabToHtml1(matriceFonction.value,0,false,0);
           
           if(objHtml.status===true){
          
                console.log(objHtml.value);
                sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.id_source , objRev.value , objHtml.value , par.input.date_de_debut_traitement , matriceFonction.value);
               
           }
       }
    }

}

/*
  =====================================================================================================================
*/
function convertir_js_en_rev(chp_genere_source , chp_rev_source , type='script'){
   clearMessages('zone_global_messages');
   var a = document.getElementById(chp_genere_source);
   
   
  var obj1=recupere_ast_de_source_js_en_synchrone(a.value , type);
  if(obj1.status===true){
       tabComment=obj1.commentaires;
       var objRev = TransformAstEnRev(obj1.value.body,0);
       if(objRev.status == true){
         dogid(chp_rev_source).value=objRev.value;
       }else{
         displayMessages('zone_global_messages',chp_genere_source);
       }
  }else{
   displayMessages('zone_global_messages',chp_genere_source);
   rangeErreurSelectionne=false;
  }
   
  return;   
/*   
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
*/   
}


function traitement_apres_ajax_pour_conversion_fichier_js(par,type_source){
  var type='script';
  if(type_source==='module_js'){
   type='module';
  }
  
  var obj1=recupere_ast_de_source_js_en_synchrone(par.contenu_du_fichier , type );
  if(obj1.status===true){
//       console.log('obj1=' , obj1 );
       tabComment=obj1.commentaires;
       
       var objRev = TransformAstEnRev(obj1.value.body,0);
       if(objRev.status == true){
        
        var tableau1 = iterateCharacters2(objRev.value);
        var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
        if(matriceFonction.status===true){
            console.log(matriceFonction);
            
            var objJs=parseJavascript0(matriceFonction.value,1,0);
            
            if(objJs.status===true){           
//              console.log(objJs.value);
              sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.id_source , objRev.value , objJs.value , par.input.date_de_debut_traitement , matriceFonction.value);
             
            }
            
            
        }
        
       }else{
        logerreur({status:false,message:'erreur 0195 traitement_apres_ajax_pour_conversion_fichier_js'});
       }
       
       
       
  }else{
        logerreur({status:false,message:'erreur 0201 traitement_apres_ajax_pour_conversion_fichier_js'});
  }
  return
  
  /*
  ancienne version avec esprima

  try{
       
  debugger
       var ret = esprima.parseScript(par.contenu_du_fichier,{range:true,comment:true});
       tabComment=ret.comments;
       var objRev = TransformAstEnRev(ret.body,0);
       if(objRev.status == true){
        
        var tableau1 = iterateCharacters2(objRev.value);
        var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
        if(matriceFonction.status===true){
            console.log(matriceFonction);
            
            var objJs=parseJavascript0(matriceFonction.value,1,0);
            
            if(objJs.status===true){           
//              console.log(objJs.value);
              sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.id_source , objRev.value , objJs.value , par.input.date_de_debut_traitement , matriceFonction.value);
             
            }
            
            
        }
        
       }else{
       }

   }catch(e){
       console.log('erreur esprima',e);
       if(e.lineNumber){
        logerreur({status:false,message:'il y a une erreur dans le javascript d\'origine en ligne'});
        displayMessages('zone_global_messages');        
       }
       ret=false;
   }
   
*/ 
 
 
}

function traitement_apres_ajax_pour_conversion_fichier_php(par){
    console.log('par=',par);

    var ast=JSON.parse(par.value);
   
    var objRev=TransformAstPhpEnRev(ast,0,false);
    if(objRev.status===true){
        /*
        on a obtenu le format rev du php,
        on peut le convertir en php
        */
//        console.log(objRev.value)
        
        var tableau1 = iterateCharacters2('php('+objRev.value+')');
        var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
        if(matriceFonction.status===true){
            var objPhp=parsePhp0(matriceFonction.value,0,0);
            
            if(objPhp.status===true){
                /*
                on a obtenu le php à partir du rev,
                on peut tout enregistrer
                */
//                console.log(objPhp.value)
                
//                console.log(par.input.opt.jsonRet.input.id_source);
                
               sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.opt.jsonRet.input.id_source , objRev.value , objPhp.value , par.input.opt.jsonRet.input.date_de_debut_traitement , matriceFonction.value) ;
                
            }
        }
    }
}
/*
==========================================
*/
function convertir_un_source_sur_disque(id_source){

// console.log(nom_de_fichier_encrypte);
 
 clearMessages('zone_global_messages');
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?charger_un_fichier_source_par_son_identifiant',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    console.log('jsonRet=',jsonRet);
//    dogid('chp_genere_source').value=jsonRet.value;
    var nom_source=jsonRet.db['T0.chp_nom_source'];
    var type_source=jsonRet.db['T0.chp_type_source'];
    if(nom_source.substr(nom_source.length-4)==='.php'){
     var ret=recupereAstDePhp(jsonRet.contenu_du_fichier,{'jsonRet':jsonRet},traitement_apres_ajax_pour_conversion_fichier_php); // ,{'comment':true}
    }else if(nom_source.substr(nom_source.length-3)==='.js'){
     
     traitement_apres_ajax_pour_conversion_fichier_js(jsonRet, type_source);
     
    }else if(nom_source.substr(nom_source.length-5)==='.html' || nom_source.substr(nom_source.length-4)==='.htm'){
     traitement_apres_ajax_pour_conversion_fichier_html(jsonRet);
    }else if(nom_source.substr(nom_source.length-4)==='.sql' ){
     traitement_apres_ajax_pour_conversion_fichier_sql(jsonRet);
    }

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
 var date_de_debut_traitement=new Date();
 date_de_debut_traitement = date_de_debut_traitement.getTime();
 var ajax_param={
  call:{
   lib                       : 'core'          ,
   file                      : 'file' ,
   funct                     : 'charger_un_fichier_source_par_son_identifiant' ,
  },
  id_source                  : id_source   ,
  date_de_debut_traitement   : date_de_debut_traitement
 }
 r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 
  
 
}


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
     'chx_source_rev' : id_source,
     'id_cible' : id_cible
    }
    
    sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    
    
   }
   
   displayMessages('zone_global_messages' , chp_rev_source);
   
   
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
   'chx_source_rev' : id_source,
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
//   console.log( ret.input.opt.nom_zone_rev )
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
 var objRev = __module_html1.TransformHtmlEnRev(a.value,0);
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
  
  var objHtml=__module_html1.tabToHtml1(matriceFonction.value,0,false,0);
  
  if(objHtml.status===true){
   
   dogid(nom_zone_genere).value=objHtml.value
   
  }
  
  var parametres_sauvegarde={
   'matrice': matriceFonction.value,
   'chp_provenance_rev' : 'source',
   'chx_source_rev' : id_source,
   'id_cible' : id_cible
  }
  
  sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
  
 }else{
  
 }
 displayMessages('zone_global_messages');

}
/*
  =====================================================================================================================
  convertir un textarea source rev et mettre le résultat dans un textarea php puis sauvegarder le rev en bdd
  =====================================================================================================================
*/
function convertir_rev_en_php_et_sauvegarde_rev(nom_zone_source_rev , nom_zone_genere_php , id_source , id_cible ){
 var obj=__gi1.convertir_textearea_rev_vers_textarea_php(nom_zone_source_rev , nom_zone_genere_php);
 if(obj.status===true){
  var parametres_sauvegarde={
   'matrice': obj.value,
   'chp_provenance_rev' : 'source',
   'chx_source_rev' : id_source,
   'id_cible' : id_cible
  }
  
  sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
 }else{
  console.error('TODO')
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