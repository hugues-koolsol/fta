'use strict'

function comparer_deux_tableaux_de_bases_sqlite(par){
 clearMessages('zone_global_messages');
 var differences_entre_les_tables=false;

 console.log(par['donnees']);
 var tables={}; 
 for(var a1 in par['donnees']['tableau1']){
  tables[a1]={ 'presente_dans_tableau_1' : true ,  'presente_dans_tableau_2' : false  };
 }
 
 for(var a2 in par['donnees']['tableau2']){
  if(tables.hasOwnProperty(a2)){
   tables[a2].presente_dans_tableau_2=true;
  }else{
   tables[a2]={ 'presente_dans_tableau_1' : false ,  'presente_dans_tableau_2' : true  };
   logerreur({status:false,message:' la table '  + a2 + ' est absente du tableau1 '});
   differences_entre_les_tables=true;
   
  }
 }
 for(var a0 in tables){
  if(tables[a0].presente_dans_tableau_2===false){
   logerreur({status:false,message:' la table '  + a0 + ' est absente du tableau2'});
   differences_entre_les_tables=true;
  }
 }
 if(differences_entre_les_tables===true){
   logerreur({status:false,message:' des tables ne sont pas les mêmes'});
 }else{
   logerreur({status:true,message:' il y a les mêmes tables dans les deux tableaux'});
 }
 console.log('tables=',tables)
 /*
   analyse des champs des tables
 */ 
 for(var a0 in tables){
  var differences_entre_les_champs=false;
  if(tables[a0].presente_dans_tableau_1===true && tables[a0].presente_dans_tableau_2===true ){
//   debugger
   var champs={};
   for(var champ1 in par['donnees']['tableau1'][a0]['liste_des_champs']){
    champs[champ1]={'presente_dans_tableau_1' : true , champs1 : par['donnees']['tableau1'][a0]['liste_des_champs'][champ1] ,  'presente_dans_tableau_2' : false , champs2 : null};
    differences_entre_les_champs=true;
   } 
   for(var champ2 in par['donnees']['tableau2'][a0]['liste_des_champs']){
    if(champs.hasOwnProperty(champ2)){
     champs[champ2].presente_dans_tableau_2=true;
     champs[champ2].champs2=par['donnees']['tableau2'][a0]['liste_des_champs'][champ2];
    }else{
     champs[champ2]={ 'presente_dans_tableau_1' : false ,  'presente_dans_tableau_2' : true  };
     differences_entre_les_champs=true;
    }
   }
   if(differences_entre_les_champs===true){
    for( var champ in champs){
     if(champs[champ].presente_dans_tableau_1===true && champs[champ].presente_dans_tableau_2===true ){
      for( var typechamp in champs[champ]['champs1'] ){
       if(typeof champs[champ].champs1[typechamp]==='object'){
       }else{
        if(champs[champ].champs1[typechamp]===champs[champ].champs2[typechamp]){
        }else{
         if('cid'===typechamp){
         }else if(typechamp==='auto_increment'){
             logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' , le type '+typechamp +' on a une différence mais ce n\'est peut-être pas une erreur ! ' });
         }else{
             logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' , le type '+typechamp +' on a une différence' });
         }
        }
       }
      }
      /*
      auto_increment: false
      cid: 0
      cle_etrangere: {}
      dflt_value: null
      name: "chi_id_groupe"
      notnull: 0
      pk: 1
      type: "INTEGER"
      */
      
     }else{
         if(champs[champ].presente_dans_tableau_1===true && champs[champ].presente_dans_tableau_2===false){
             logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' est dans le tableau 1 mais pas dans le tableau 2 ' });
         }else{
             logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' est dans le tableau 2 mais pas dans le tableau 1 ' });
         }
     }
    }
   }else{
   }
   console.log('pour "'+a0+'" champs=',champs);
  }
 }

 
 
 console.log(tables);
 displayMessages('zone_global_messages');
 
}

function bdd_convertir_rev_en_sql(nom_zone_source , nom_zone_genere , id_bdd  , id_cible ){
 
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

  var objSql=tabToSql1(matriceFonction.value,0,0);
  if(objSql.status===true){
   var contenu=objSql.value.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'')
   dogid(nom_zone_genere).value=contenu;
  }
  displayMessages('zone_global_messages');
  
  var parametres_sauvegarde={
   'matrice': matriceFonction.value,
   'chp_provenance_rev' : 'bdd',
   'chx_source_rev' : id_bdd,
   'id_cible' : id_cible
  }
  
  sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
  
  
 }else{
 displayMessages('zone_global_messages');
 }
}

function sauvegarder_format_rev_en_dbb(parametres_sauvegarde){
 /*
 Exemple :
  var parametres_sauvegarde={
   'matrice': matriceFonction.value,
   'chp_provenance_rev' : 'bdd',
   'chx_source_rev' : id_bdd,
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
      displayMessages('zone_global_messages');
      console.log(global_messages);
     }catch(e){
     }
    }
   }
   return;
  }
  try{
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    console.log('jsonRet=',jsonRet);
    for(var elem in jsonRet.messages){
     logerreur( {'status':true,'message':'<pre>'+jsonRet.messages[elem].replace(/&/g,'&lt;')+'</pre>'});
    }
    displayMessages('zone_global_messages');

   }else{
    for(var elem in jsonRet.messages){
     logerreur( {'status':false,'message':'<pre>'+jsonRet.messages[elem].replace(/&/g,'&lt;')+'</pre>'});
    }
    displayMessages('zone_global_messages');
//    display_ajax_error_in_cons(jsonRet);
    console.log(r);
//    alert('BAD job !');
    return;
   }
  }catch(e){
   var errors=JSON.parse(r.responseText);
   var t='';
   for(var elem in errors.messages){
    global_messages['errors'].push(errors.messages[elem]);
   }
   displayMessages('zone_global_messages');
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
  return {status:false};  
 }
 return {status:true};  
 
 
 
 
}
