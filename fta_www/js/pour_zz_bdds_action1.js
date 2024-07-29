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
 
 var t='<table>';
 t+='<tr><th>Tables</th><th>dans la base physique</th><th>dans champ genere</th></tr>';
 for( var tbl in tables){
  t+='<tr>';
  t+='<td>'+tbl+'</td>';
  t+='<td>'+(tables[tbl].presente_dans_tableau_1?'<span class="yysucces">oui</span>':'non')+'</td>';
  t+='<td>'+(tables[tbl].presente_dans_tableau_2?'<span class="yysucces">oui</span>':'non')+'</td>';
  t+='</tr>';
 }
 t+='</table>';

 
 /*
   analyse des champs des tables
 */ 
 var differences_entre_les_champs=false;

 var tables_champs={};
 for(var a0 in tables){
  tables_champs[a0]={champs:null};
  if(tables[a0].presente_dans_tableau_1===true && tables[a0].presente_dans_tableau_2===true ){
//   debugger
   var champs={};
   for(var ind_champ in par['donnees']['tableau1'][a0]['liste_des_champs']){
       champs[ind_champ]={'table':a0,'presente_dans_tableau_1' : true , champs1 : par['donnees']['tableau1'][a0]['liste_des_champs'][ind_champ] ,  'presente_dans_tableau_2' : false , champs2 : null};
   } 
   for(var ind_champ in par['donnees']['tableau2'][a0]['liste_des_champs']){
    if(champs.hasOwnProperty(ind_champ)){
        champs[ind_champ].presente_dans_tableau_2=true;
        champs[ind_champ].champs2=par['donnees']['tableau2'][a0]['liste_des_champs'][ind_champ];
        if(
               champs[ind_champ].champs2['type'].toLowerCase() !==  champs[ind_champ].champs1['type'].toLowerCase()
            || champs[ind_champ].champs2['dflt_value']         !==  champs[ind_champ].champs1['dflt_value']
            || champs[ind_champ].champs2['auto_increment']     !==  champs[ind_champ].champs1['auto_increment']
            || champs[ind_champ].champs2['notnull']            !==  champs[ind_champ].champs1['notnull']
            || champs[ind_champ].champs2['pk']                 !==  champs[ind_champ].champs1['pk']
        ){
            par['donnees']['tableau2'][a0]['liste_des_champs'][ind_champ]['different']=true;
            differences_entre_les_champs=true;
        }
    }else{
        champs[ind_champ]={ 'table':a0,'presente_dans_tableau_1' : false ,  'presente_dans_tableau_2' : true  };
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
                logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' est dans la base physique mais pas dans la base du champ généré ' });
            }else{
                logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' est dans la base du champ généré mais pas dans la base physique  ' });
            }
        }
    }
   }else{
   }
   console.log('pour "'+a0+'" champs=',champs);
   tables_champs[a0].champs=JSON.parse(JSON.stringify(champs));
  }
 }
 console.log('differences_entre_les_champs=' , differences_entre_les_champs , 'tables_champs=' , tables_champs );
 t+='<table>';
 t+='<tr>';
 t+='<th>Base physique</th>';
 t+='<th>Base du champ genere</th>';
 t+='</tr>';
 t+='<tr>';
 
 var references=['tableau1','tableau2'];
 for( var ref in references){
   t+='<td style="vertical-align: baseline;">'
   t+='<table>'
   for( var i in par['donnees'][references[ref]]){
       t+='<tr>'
       t+='<th>'+i+'</th>'
       t+='</tr>'
       for( var j in par['donnees'][references[ref]][i].liste_des_champs){
           t+='<tr>';
            var la_class_quoi='';
            if(par['donnees'][references[ref]][i].liste_des_champs[j].hasOwnProperty('different') && par['donnees'][references[ref]][i].liste_des_champs[j].different===true){
             la_class_quoi='yyavertissement';
            }
            t+='<td class="'+la_class_quoi+'">'+par['donnees'][references[ref]][i].liste_des_champs[j].name+'</td>';
            t+='<td class="'+la_class_quoi+'">'+par['donnees'][references[ref]][i].liste_des_champs[j].type+'</td>';
           t+='</tr>';
       }
   }
   t+='</table>'
   t+='</td>';
 }
 
 
 
 t+='</tr></table>'
 
 document.getElementById('__contenu_modale').innerHTML=t;
 global_modale1.showModal();
 
 
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
