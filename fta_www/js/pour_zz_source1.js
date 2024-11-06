"use strict";

/*
  =====================================================================================================================
*/
function convertir_rev_en_sql(chp_rev_source,chp_genere_source,id_source,id_cible){
   __gi1.raz_des_messages();
   var a = document.getElementById(chp_rev_source);
   var startMicro=performance.now();
   
   var tableau1 = iterateCharacters2(a.__xva);
   global_messages.data.tableau=tableau1;
   var endMicro = performance.now();
   var startMicro = performance.now();
   var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
   global_messages.data.matrice=matriceFonction;
   if(matriceFonction.__xst===true){

    var objSql=tabToSql1(matriceFonction.__xva,0,0,false);
    
    if(objSql.__xst===true){
     
        dogid(chp_genere_source).value=objSql.__xva;
     
    }
    
    
    var parametres_sauvegarde={
     'matrice': matriceFonction.__xva,
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
 if(obj.__xst===true){
  dogid(chp_rev_source).value=obj.__xva;
 }else{
   logerreur({__xst:false,__xme:'Erreur de convertion'})
 }
 __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
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
        if (r.readyState !== 4 || r.status !== 200) return;
        try{
            var jsonRet=JSON.parse(r.responseText);
            if(jsonRet.__xst===true){
             
                var date_de_fin_traitement = new Date();
                date_de_fin_traitement = date_de_fin_traitement.getTime();
             
                var date_de_debut_traitement=jsonRet.input.date_de_debut_traitement;
                var nombre_de_secondes = (date_de_fin_traitement-date_de_debut_traitement)/1000;

                
                if(jsonRet.input.parametres_sauvegarde.nom_du_source){
                 logerreur({__xst:true,__xme:'la réécriture de '+jsonRet.input.parametres_sauvegarde.nom_du_source+' a été faite en '+nombre_de_secondes+' secondes'})
                }else{
                 logerreur({__xst:true,__xme:'la réécriture du fichier a été faite en '+nombre_de_secondes+' secondes'})
                }
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
                return;
            }else{
                console.log(r);
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
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
    
    if(objRev.__xst===true){

       var tableau1 = iterateCharacters2(objRev.__xva);
       var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
       
       if(matriceFonction.__xst===true){
        
           var objSql=tabToSql1(matriceFonction.__xva,0,0,false);
           if(objSql.__xst===true){
            
                var contenu=objSql.__xva.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'');            
//                console.log(objSql.__xva);
                sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.id_source , objRev.__xva , contenu , par.input.date_de_debut_traitement , matriceFonction.__xva);
               
           }

       }

    }

}

function traitement_apres_ajax_pour_conversion_fichier_html(par){

    var objRev = __module_html1.TransformHtmlEnRev(par.contenu_du_fichier,0);
    if(objRev.__xst===true){

       var tableau1 = iterateCharacters2(objRev.__xva);
       var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
       
       if(matriceFonction.__xst===true){
        
           var objHtml=__module_html1.tabToHtml1(matriceFonction.__xva,0,false,0);
           
           if(objHtml.__xst===true){
          
                console.log(objHtml.__xva);
                sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.id_source , objRev.__xva , objHtml.__xva , par.input.date_de_debut_traitement , matriceFonction.__xva);
               
           }
       }
    }

}

/*
  =====================================================================================================================
*/
function convertir_js_en_rev(chp_genere_source , chp_rev_source ){
   __gi1.raz_des_messages();
   var a = document.getElementById(chp_genere_source);
   
   
  var obj1=recupere_ast_de_source_js_en_synchrone(a.value);
  if(obj1.__xst===true){
       tabComment=obj1.commentaires;
       var objRev = TransformAstEnRev(obj1.__xva.body,0);
       if(objRev.__xst === true){
         dogid(chp_rev_source).value=objRev.__xva;
       }else{
         __gi1.remplir_et_afficher_les_messages1('zone_global_messages',chp_genere_source);
       }
  }else{
   __gi1.remplir_et_afficher_les_messages1('zone_global_messages',chp_genere_source);
  }
   
}

/*
  =====================================================================================================================
*/

function traitement_apres_ajax_pour_conversion_fichier_js(par,type_source){
  
  var obj1=recupere_ast_de_source_js_en_synchrone(par.contenu_du_fichier  );
  if(obj1.__xst===true){
//       console.log('obj1=' , obj1 );
       tabComment=obj1.commentaires;
       
       var objRev = TransformAstEnRev(obj1.__xva.body,0);
       if(objRev.__xst === true){
        
        var tableau1 = iterateCharacters2(objRev.__xva);
        var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
        if(matriceFonction.__xst===true){
//            console.log(matriceFonction);
            
            var objJs=parseJavascript0(matriceFonction.__xva,1,0);
            
            if(objJs.__xst===true){           
//              console.log(objJs.__xva);
              sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.id_source , objRev.__xva , objJs.__xva , par.input.date_de_debut_traitement , matriceFonction.__xva);
             
            }else{
               logerreur({__xst:false,__xme:'erreur 0223 traitement_apres_ajax_pour_conversion_fichier_js'});
               __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
            }
            
            
        }else{
           logerreur({__xst:false,__xme:'erreur 0223 traitement_apres_ajax_pour_conversion_fichier_js'});
           __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
        }
        
       }else{
        logerreur({__xst:false,__xme:'erreur 0195 traitement_apres_ajax_pour_conversion_fichier_js'});
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
       }
       
       
       
  }else{
        logerreur({__xst:false,__xme:'erreur 0201 traitement_apres_ajax_pour_conversion_fichier_js'});
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
  }
  return
 
}

function traitement_apres_ajax_pour_conversion_fichier_php(par){
//    console.log('par=',par);

    var ast=JSON.parse(par.__xva);
   
    var objRev=TransformAstPhpEnRev(ast,0,false);
    if(objRev.__xst===true){
        /*
        on a obtenu le format rev du php,
        on peut le convertir en php
        */
//        console.log(objRev.__xva)
        
        var tableau1 = iterateCharacters2('php('+objRev.__xva+')');
        var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
        if(matriceFonction.__xst===true){
            var objPhp=parsePhp0(matriceFonction.__xva,0,0);
            
            if(objPhp.__xst===true){
                /*
                on a obtenu le php à partir du rev,
                on peut tout enregistrer
                */
//                console.log(objPhp.__xva)
                
//                console.log(par.input.opt.jsonRet.input.id_source);
                
               sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.input.opt.jsonRet.input.id_source , objRev.__xva , objPhp.__xva , par.input.opt.jsonRet.input.date_de_debut_traitement , matriceFonction.__xva) ;
                
            }
        }
    }
}
/*
==========================================
*/
function convertir_un_source_sur_disque(id_source){

// console.log(nom_de_fichier_encrypte);
 
 __gi1.raz_des_messages();
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?charger_un_fichier_source_par_son_identifiant',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState !== 4 || r.status !== 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.__xst===true){
//    console.log('jsonRet=',jsonRet);
//    dogid('chp_genere_source').value=jsonRet.__xva;
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
    console.log(r);
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
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
function convertir_rev_en_js(chp_rev_source,chp_genere_source,id_source,id_cible){
   __gi1.raz_des_messages();
   var a = document.getElementById(chp_rev_source);
   var startMicro=performance.now();
   
   var tableau1 = iterateCharacters2(a.value);
   global_messages.data.tableau=tableau1;
   var endMicro = performance.now();
   var startMicro = performance.now();
   var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
   global_messages.data.matrice=matriceFonction;
   if(matriceFonction.__xst===true){
    
    var objJs=parseJavascript0(matriceFonction.__xva,1,0);
    
    if(objJs.__xst===true){
     
     dogid(chp_genere_source).value=objJs.__xva;
     
    }
    
    
    var parametres_sauvegarde={
     'matrice': matriceFonction.__xva,
     'chp_provenance_rev' : 'source',
     'chx_source_rev' : id_source,
     'id_cible' : id_cible
    }
    
    sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    
    
   }
   
   __gi1.remplir_et_afficher_les_messages1('zone_global_messages' , chp_rev_source);
   
   
}
/*
  =====================================================================================================================
*/

function convertir_texte_en_rev(nom_zone_genere, nom_zone_source){

 __gi1.raz_des_messages();
 var a=dogid(nom_zone_genere);
 var startMicro = performance.now();
 
 var obj_texte=js_texte_convertit_texte_en_rev_racine(a.value,0);
 if(obj_texte.__xst===true){

   dogid(nom_zone_source).value=obj_texte.__xva;

 }

 __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
 
 
}
/*
  =====================================================================================================================
*/
function convertir_rev_en_texte(nom_zone_source , nom_zone_genere , id_source , id_cible){
 __gi1.raz_des_messages();
 var a=dogid(nom_zone_source);
 var startMicro = performance.now();
 var tableau1 = iterateCharacters2(a.value);
 global_messages.data.tableau=tableau1;
 var endMicro = performance.now();
 var startMicro = performance.now();
 var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
 
 console.log('\n\n=============\nmise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
 
 if(matriceFonction.__xst===true){
  
  var objTexte=convertir_tableau_rev_vers_texte_racine(matriceFonction.__xva,0,0);
  
  if(objTexte.__xst===true){
   
   dogid(nom_zone_genere).value=objTexte.__xva;
   
  }else{
   
   __gi1.remplir_et_afficher_les_messages1('zone_global_messages' , nom_zone_source);
   
  }
  
  var parametres_sauvegarde={
   'matrice': matriceFonction.__xva,
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
 
 __gi1.raz_des_messages();
 console.log('ret=',ret.input.opt);
 try{
  var startMicro=performance.now();
  var ast=JSON.parse(ret.__xva);
//  console.log('ast=',ast);
  var obj=TransformAstPhpEnRev(ast,0,false);
  if(obj.__xst===true){
//   console.log( ret.input.opt.nom_zone_rev )
   document.getElementById(ret.input.opt.nom_zone_rev).value='php('+obj.__xva+')';
  }else{
    
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages' , ret.input.opt.nom_zone_genere);
  }
 }catch(e){
  astphp_logerreur({__xst:false,__xme:'erreur de conversion du ast vers json 0409 ' + e.message + ' ' + JSON.stringify(e.stack).replace(/\\n/g,'\n<br />') })
 }
 
 __gi1.remplir_et_afficher_les_messages1('zone_global_messages' , ret.input.opt.nom_zone_genere);
 
}


/*
  =====================================================================================================================
*/

function convertir_php_en_rev(nom_zone_genere, nom_zone_rev){

 __gi1.raz_des_messages();
 var a=dogid(nom_zone_genere);
 var startMicro = performance.now();
 
  try{
   var ret=recupereAstDePhp(a.value,{'nom_zone_genere':nom_zone_genere,'nom_zone_rev':nom_zone_rev},traitement_apres_recuperation_ast_dans_zz_source_action); // ,{'comment':true}
   if(ret.__xst===true){
//    console.log('ret=',ret)
   }else{
    astphp_logerreur({__xst:false,__xme:'il y a une erreur d\'envoie du source php à convertir'})
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
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

 __gi1.raz_des_messages();
 var a=dogid(nom_zone_genere);
 var startMicro = performance.now();
 var objRev = __module_html1.TransformHtmlEnRev(a.value,0);
 if(objRev.__xst===true){

   dogid(nom_zone_source).value=objRev.__xva;

 }

 __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
 
 
}
/*
  =====================================================================================================================
*/

function convertir_rev_en_html(nom_zone_source , nom_zone_genere, id_source , id_cible){
 
 __gi1.raz_des_messages();
 var a=dogid(nom_zone_source);
 var startMicro = performance.now();
 var tableau1 = iterateCharacters2(a.value);
 global_messages.data.tableau=tableau1;
 var endMicro = performance.now();
 console.log('\n\n=============\nmise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
 var startMicro = performance.now();
 var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
 
 if(matriceFonction.__xst===true){
  
  var objHtml=__module_html1.tabToHtml1(matriceFonction.__xva,0,false,0);
  
  if(objHtml.__xst===true){
   
   dogid(nom_zone_genere).value=objHtml.__xva;
   
  }
  
  var parametres_sauvegarde={
   'matrice': matriceFonction.__xva,
   'chp_provenance_rev' : 'source',
   'chx_source_rev' : id_source,
   'id_cible' : id_cible
  }
  
  sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
  
 }else{
  
 }
 __gi1.remplir_et_afficher_les_messages1('zone_global_messages');

}
/*
  =====================================================================================================================
  convertir un textarea source rev et mettre le résultat dans un textarea php puis sauvegarder le rev en bdd
  =====================================================================================================================
*/
function convertir_rev_en_php_et_sauvegarde_rev(nom_zone_source_rev , nom_zone_genere_php , id_source , id_cible ){
 var obj=__gi1.convertir_textearea_rev_vers_textarea_php(nom_zone_source_rev , nom_zone_genere_php);
 if(obj.__xst===true){
  var parametres_sauvegarde={
   'matrice': obj.__xva,
   'chp_provenance_rev' : 'source',
   'chx_source_rev' : id_source,
   'id_cible' : id_cible
  }
  
  sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
 }else{
  console.error('TODO')
 }
 __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
}


/*
  =====================================================================================================================
*/

function supprimer_un_fichier_du_disque(nom_de_fichier_encrypte){
// console.log(nom_de_fichier_encrypte);
 
 __gi1.raz_des_messages();
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?supprimer_un_fichier_avec_un_nom_encrypte',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState !== 4 || r.status !== 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.__xst===true){
    console.log('jsonRet=',jsonRet);
    document.location=String(document.location);
    return;
   }else{
    console.log(r);
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
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
 
 __gi1.raz_des_messages();
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?charger_un_fichier_avec_un_nom_encrypte',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if (r.readyState !== 4 || r.status !== 200) return;
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.__xst===true){
    console.log('jsonRet=',jsonRet);
    dogid('chp_genere_source').value=jsonRet.__xva;
    return;
   }else{
    console.log(r);
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
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