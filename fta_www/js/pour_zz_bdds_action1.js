'use strict'

function comparer_deux_tableaux_de_bases_sqlite(par){
 
 console.log('dans comparer_deux_tableaux_de_bases_sqlite')
 __gi1.raz_des_messages();
 
 import('./module_svg_bdd.js').then(Module =>{
        /* 
        on utilise ce module pour afficher une comparaison des tableaux tables/champs
        */
        __module_svg1=new Module.module_svg_bdd('__module_svg1', null);
        __module_svg1.afficher_resultat_comparaison_base_physique_et_base_virtuelle(par);
    }
);

 

 
 
// console.log(tables);
 __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
 
}

function bdd_convertir_rev_en_sql(nom_zone_source , nom_zone_genere , id_bdd  , id_cible ){
 
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

        var objSql=tabToSql1(matriceFonction.__xva,0,0,false);
        if(objSql.__xst===true){
            var contenu=objSql.__xva.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'')
            dogid(nom_zone_genere).value=contenu;
        }
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
        
        var parametres_sauvegarde={
            'matrice'            : matriceFonction.__xva ,
            'chp_provenance_rev' : 'bdd'                 ,
            'id_cible'           : id_cible              ,
            'chx_source_rev'     : id_bdd                ,
        }
        
        sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
        
        
    }else{
       __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
    }
}

function sauvegarder_format_rev_en_dbb(parametres_sauvegarde){
 /*
 Exemple :
  var parametres_sauvegarde={
   'matrice': matriceFonction.__xva,
   'chp_provenance_rev' : 'bdd',
   'id_cible' : id_cible
  }
 
 */
 console.log('parametres_sauvegarde=',parametres_sauvegarde)
 
 
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?sauvegarder_format_rev_en_dbb',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if(r.readyState != 4 || r.status != 200){
   if(r.status==500){
    /*
      normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
      au niveau du php za_ajax mais sait-on jamais
    */
    
    if(global_messages['e500logged']==false){
     try{
//     console.log("r=",r);
//     console.log("r="+r.response);
      var errors=JSON.parse(r.responseText);
      var t='';
      for(var elem in errors.messages){
       global_messages['errors'].push(errors.messages[elem]);
      }
      global_messages['e500logged']=true;
      __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
      console.log(global_messages);
     }catch(e){
     }
    }
   }
   return;
  }
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.__xst===true){
    console.log('jsonRet=',jsonRet);
    for(var elem in jsonRet.messages){
     logerreur( {__xst:true,__xme:'<pre>'+jsonRet.messages[elem].replace(/&/g,'&lt;')+'</pre>'});
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');

   }else{
    for(var elem in jsonRet.messages){
     logerreur( {__xst:false,__xme:'<pre>'+jsonRet.messages[elem].replace(/&/g,'&lt;')+'</pre>'});
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
    console.log(r);
    return;
   }
  }catch(e){
   var errors=JSON.parse(r.responseText);
   var t='';
   for(var elem in errors.messages){
    global_messages['errors'].push(errors.messages[elem]);
   }
   __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
   console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
   return;
  }
 };
 r.onerror=function(e){
  console.error('e=',e); /* whatever(); */
  return;
 }
 
 r.ontimeout=function(e){
  console.error('e=',e);
  return;
 }
 var ajax_param={
  call:{
   'lib'                       : 'core'   ,
   'file'                      : 'bdd'  ,
   'funct'                     : 'sauvegarder_format_rev_en_dbb' ,
  },
  'parametres_sauvegarde':parametres_sauvegarde,
 }
 try{
  r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 }catch(e){
  console.error('e=',e); /* whatever(); */
  return {__xst:false};  
 }
 return {__xst:true};  
 
 
 
 
}
