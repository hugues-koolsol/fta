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

function convertir_rev_en_sql(nom_zone_source , nom_zone_genere , nom_zone_php ){
 
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
   

   var contenu=objSql.value.replace(/\/\*==========DEBUT DEFINITION===========\*\//g,'')
   dogid(nom_zone_genere).value=contenu;
   
   if(nom_zone_php && nom_zone_php!==''){
    
     var tabPhp=objSql.value.split('/*==========DEBUT DEFINITION===========*/');
  //   console.log('tabPhp=',tabPhp);

     var lePhp='\$db = new SQLite3(\'temporaire_pour_test.db\');'+CRLF;
     lePhp+='\$uneErreur=false;'+CRLF;
     lePhp+='if((false === $db->exec(\'BEGIN TRANSACTION\'))){'+CRLF;
     lePhp+='    echo __FILE__.\' \'.__LINE__.\' __LINE__ = <pre>\'.var_export($db->lastErrorMsg(),true).\'</pre>\' ;'+CRLF;
     lePhp+='    $uneErreur=true;'+CRLF;
     lePhp+='}'+CRLF;
     
     
     for(var i=0;i<tabPhp.length;i++){
      var leSql=tabPhp[i];
      leSql=leSql.replace(/\r\n\r\n/g,'\r\n');
      if(leSql!=='' && leSql!=='\r\n'){
//       console.log('leSql="'+leSql+'"')
  //     php+=

         lePhp+='$chaineSql=\''+leSql.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\';'+CRLF;
         lePhp+='if((false === $db->exec($chaineSql))){'+CRLF;
         lePhp+='    echo __FILE__.\' \'.__LINE__.\' __LINE__ = <pre>\'.var_export($db->lastErrorMsg(),true).\'</pre> <pre>\'.var_export($chaineSql,true).\'</pre> \' ;'+CRLF;
         lePhp+='    $uneErreur=true;'+CRLF;
         lePhp+='}'+CRLF;

       
      }
     }
     lePhp+='if(    $uneErreur===true){'+CRLF;
     lePhp+=' if((false === $db->exec(\'ROLLBACK\'))){'+CRLF;
     lePhp+='     echo __FILE__.\' \'.__LINE__.\' __LINE__ = <pre>\'.var_export($db->lastErrorMsg(),true).\'</pre>\' ;'+CRLF;
     lePhp+='     $uneErreur=true;'+CRLF;
     lePhp+=' }'+CRLF;
     lePhp+='}else{'+CRLF;
     lePhp+=' if((false === $db->exec(\'COMMIT\'))){'+CRLF;
     lePhp+='     echo __FILE__.\' \'.__LINE__.\' __LINE__ = <pre>\'.var_export($db->lastErrorMsg(),true).\'</pre>\' ;'+CRLF;
     lePhp+=' }else{'+CRLF;
     lePhp+='     echo __FILE__.\' \'.__LINE__.\' __LINE__ = <pre>Bon travail</pre>\' ;'+CRLF;
     lePhp+=' }'+CRLF;
     lePhp+='}'+CRLF;
     
     dogid(nom_zone_php).value=lePhp;
    

   }
   
   
  }
  
  
 }
 displayMessages('zone_global_messages');
}


