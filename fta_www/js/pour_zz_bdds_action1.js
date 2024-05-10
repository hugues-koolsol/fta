'use strict'

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
   
   dogid(nom_zone_genere).value=objSql.value;
   
   var tabPhp=objSql.value.split('/*==========DEBUT DEFINITION===========*/');
//   console.log('tabPhp=',tabPhp);
   debugger;
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
     console.log('leSql="'+leSql+'"')
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
 displayMessages('zone_global_messages');
}


function traite_le_tableau_de_la_base_sqlite(par){
 
 
 var t='\n';
// console.log('par=',par);
 
 for( var nom_table in par['donnees']){
  t+='\n'+'create_table(';
  t+='\n'+' n(\''+nom_table+'\'),';
  t+='\n'+' fields(';
  
  for(var nom_champ in par['donnees'][nom_table]['liste_des_champs']){
     var pc=par['donnees'][nom_table]['liste_des_champs'][nom_champ]
     t+='\n'+'  field(';
     t+='\n'+'   n('+nom_champ+')';
     
     if(pc['type'].indexOf('(')>=0 && pc['type'].lastIndexOf(')')>=pc['type'].indexOf('(')){
      t+='\n'+'   type(' +   pc['type'].substr(0 , pc['type'].indexOf('(') )   +  ' , '   + pc['type'].substr( pc['type'].indexOf('(')+1, pc['type'].lastIndexOf(')')-pc['type'].indexOf('(')-1 ) +')';
      
     }else{
      t+='\n'+'   type('+pc['type']+')';
     }

     if(pc['type']==='INTEGER' && pc['pk']===1 && pc['auto_increment']===true ){
      t+='\n'+'   primary_key()';
      t+='\n'+'   auto_increment()';
     }else{
      if(pc['pk']===1){
       t+='\n'+'   primary_key()';
      }
     }
     if(pc['notnull']===1 ){
       t+='\n'+'   not_null()';
     }
     
     if(pc['dflt_value']){
       t+='\n'+'   default('+pc['dflt_value']+')';
      
     }
     if(pc['cle_etrangere'] && pc['cle_etrangere']['from'] && pc['cle_etrangere']['from']===nom_champ){
       t+='\n'+'   references(\''+pc['cle_etrangere']['table']+'\' , \''+pc['cle_etrangere']['to']+'\' )';
     }
     
     //REFERENCES tbl_dossiers(chi_id_dossier)
     
     t+='\n'+'  ),';
    
   }
  
  t+='\n'+' )';
  t+='\n'+')';
  t+='\n';
  
  /*
   ======================
   ====== les indexes ===
   ======================
  */
  //             add_index(n('`fta1`.`tbl_source`') , unique() , index_name(idx_fullname) , fields(fld_path_source , fld_name_source)),
  for(var nom_index in par['donnees'][nom_table]['liste_des_indexes']){
   var pc=par['donnees'][nom_table]['liste_des_indexes'][nom_index]
   t+=','
   t+='\n'+'add_index(';
   t+='\n'+'   n(\''+nom_table+'\'),';
   if(pc['unique']===1){
    t+='\n'+'   unique(),';
   }
   t+='\n'+'   index_name(\''+nom_index+'\'),';

   var lc=''
   for( var champ_de_l_index in pc['champs']){
    lc+=','+'\''+champ_de_l_index+'\''
   }
   if(lc!==''){
    t+='\n'+'   fields('+lc.substr(1)+')';
   }
   t+='\n'+')'
  }
  
 }

 
 t=t.substr(1);
 dogid(par['zone_rev']).value='sql(\n'+t+'\n\n)';
// console.log('t=',t); 
 
 // CREATE TABLE 'tbl_bases_de_donnees' ('chi_id_basedd' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'chp_nom_basedd' TEXT NOT NULL DEFAULT '', 'chp_rev_basedd' TEXT, 'chp_commentaire_basedd' TEXT, chx_dossier_id_basedd INTEGER DEFAULT NULL REFERENCES tbl_dossiers(chi_id_dossier))
 return {status:true,value:t};
}