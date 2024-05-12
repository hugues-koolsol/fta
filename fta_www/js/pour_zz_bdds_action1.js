'use strict'

function comparer_deux_tableaux_de_bases_sqlite(par){
 clearMessages('zone_global_messages');

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
   logerreur({status:false,message:' la table'  + a2 + ' est absente du tableau2 '});
   
  }
 }
 for(var a0 in tables){
  if(tables[a0].presente_dans_tableau_1===false){
   logerreur({status:false,message:' la table '  + a0 + ' est absente du tableau1'});
  }
  if(tables[a0].presente_dans_tableau_2===false){
   logerreur({status:false,message:' la table '  + a0 + ' est absente du tableau2'});
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


