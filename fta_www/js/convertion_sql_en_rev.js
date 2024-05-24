'use strict';


/*
  =================================================================================== 
*/
function conversion_de_ast_vers_sql(element,niveau,parent,options={}){
 
 
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 element.en_cours_de_traitement=true;
 if(element.traite && element.traite===true){
     return {status:true,value:''};
 }
 element.traite=false;

 if(element.type==='statement' && element.variant==='list'){
  
     for(var i=0;i<element.statement.length;i++){
      
         var obj1=conversion_de_ast_vers_sql(element.statement[i],niveau,element,{});
         if(obj1.status===true){
          
             t+=obj1.value;
             
         }else{
          
             return(logerreur({status:false,message:'0023 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(element.statement[i]))}));
             
         }
         
     }
     element.traite=true;
     element.en_cours_de_traitement=false;
  
  
 }else if(element.type==='statement' && element.variant==='create' && element.format==='index'){
  
     /*
      CREATE index
     */
     t+='\n'+esp0+'create_index(';
     if(element.on && element.on.name){
      t+='on_table(`'+element.on.name+'`)';
     }else{
         return(logerreur({status:false,message:'0048 conversion_de_ast_vers_sql nom de la table de l\'index nn trouvé : '+JSON.stringify(json_partiel(element))}));
     }
     if(element.unique && element.unique===true){
      t+=',unique()';
     }

     if(element.target && element.target.name){
         t+=',index_name(`'+element.target.name+'`)';
     }else{
         return(logerreur({status:false,message:'0048 conversion_de_ast_vers_sql nom de l\'index nn trouvé : '+JSON.stringify(json_partiel(element))}));
     }
     if(element.on && element.on.columns && element.on.columns.length>0){
      t+=',fields(';
      for(var i=0;i<element.on.columns.length;i++){
       if(i>0){
        t+=',';
       }
       t+='`'+element.on.columns[i].name+'`';
      }
      t+=')';
      
     }else{
         return(logerreur({status:false,message:'0061 conversion_de_ast_vers_sql champs de l\'index nn trouvé : '+JSON.stringify(json_partiel(element))}));
     }


     
     t+=')';
  
 }else if(element.type==='statement' && element.variant==='create' && element.format==='table'){
  
     /*
      CREATE TABLE
     */
  
     t+='\n'+esp0+'create_table(';
     if(element.name){
         if(element.name.type==="identifier"){
             t+='\n'+esp0+esp1+'n('+element.name.name+')';
         }else{
            return(logerreur({status:false,message:'0034 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(element))}));
         }
     }else{
         return(logerreur({status:false,message:'0036 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(element))}));
     }
     if( element.definition && element.definition.length > 0 ){
         t+='\n'+esp0+esp1+'fields(';
         for(var i=0;i<element.definition.length;i++){
             t+='\n'+esp0+esp1+esp1+'field(';
             if(element.definition[i].definition){
                 if( element.definition[i].type==='definition' &&  element.definition[i].variant==="column" ){
                     t+='n(`'+element.definition[i].name+'`)';  
                 }else{
                     return(logerreur({status:false,message:'0062 pas définition de champ trouvé dans create_table field : '+JSON.stringify(json_partiel(element.definition[i]))}));
                 }
                  
              
             }else{
                 return(logerreur({status:false,message:'0060 pas définition de champ trouvé dans create_table field : '+JSON.stringify(json_partiel(element.definition[i]))}));
             }
             if(element.definition[i].datatype){
                 t+=' , type('+element.definition[i].datatype.variant;
                 if(element.definition[i].datatype.args){
                  t+='(';
                  for(var j=0;j<element.definition[i].datatype.args.expression.length;j++){
                      if(j>0){
                          t+=',';
                      }
                      if(element.definition[i].datatype.args.expression[j].type==='literal'){
                          t+=element.definition[i].datatype.args.expression[j].value
                      }else{
                          return(logerreur({status:false,message:'0077 problème sur un argument : '+JSON.stringify(json_partiel(element.definition[i]))}));
                      }
                  }
                  t+=')';
                 }
                 t+=')'
             }else{
                 return(logerreur({status:false,message:'0071 pas type de données trouvé field : '+JSON.stringify(json_partiel(element.definition[i]))}));
             }
             if(element.definition[i].definition && element.definition[i].definition.length>=1){
                 for(var j=0;j<element.definition[i].definition.length;j++){
                     if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "primary key"){
                         t+=' , primary_key()'
                     }else if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "not null"){
                         t+=' , not_null()'
                     }else if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "default" && element.definition[i].definition[j].value){
                         if(element.definition[i].definition[j].value.type==='literal'){
                          t+=' , default(\''+element.definition[i].definition[j].value.value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')'
                         }else{
                           return(logerreur({status:false,message:'0099 contrainte non traitée trouvé value : '+JSON.stringify(json_partiel(element.definition[i]))}));
                         }
                         
                     }else if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "foreign key" && element.definition[i].definition[j].references){
                         t+=' , references('
                         if(element.definition[i].definition[j].references.name){
                          t+='`'+element.definition[i].definition[j].references.name+'`,'
                          if(element.definition[i].definition[j].references.columns && element.definition[i].definition[j].references.columns.length===1){
                            t+='`'+element.definition[i].definition[j].references.columns[0].name+'`'
                          }else{
                              return(logerreur({status:false,message:'0109 contrainte non traitée trouvé field : '+JSON.stringify(json_partiel( element.definition[i].definition[j].references))}));
                          }
                         }else{
                         }
                         t+=')'
                     }else{
                         return(logerreur({status:false,message:'0096 contrainte non traitée trouvé field : '+JSON.stringify(json_partiel(element.definition[i]))}));
                     }
                  
                  
                 }
             }
             t+=')';
         }
         t+='\n'+esp0+esp1+')';
      
     }else{
         return(logerreur({status:false,message:'0061 pas de champs trouvés dans create_table : '+JSON.stringify(json_partiel(element))}));
     }
//     debugger;
     t+='\n'+esp0+')'
  
 }else if(element.type==='statement' && element.variant==='transaction' && element.action==='begin'){
  
     /*
     BEGIN TRANSACTION
     pour un début de transaction, on continue jusqu'à un commit ou un rollback
     */
     t+='\ntransaction(';
     if(parent && parent.type==='statement' && parent.variant==='list'){
         element.transaction_en_cours=true;
         for(var i=0;i<parent.statement.length;i++){
             if(parent.statement[i].en_cours_de_traitement && parent.statement[i].en_cours_de_traitement===true){
                 continue;
             }else if(parent.statement[i].traite && parent.statement[i].traite===true){
                 continue;
             }else if(parent.statement[i].type==='statement' && parent.statement[i].variant==='transaction' && parent.statement[i].action==='commit' ){
                 /*
                 fin de transaction par un commit
                 */
                 t+='\n'+esp0+')';
                 t+='\n'+esp0+'commit()';
                 
                 parent.statement[i].en_cours_de_traitement=false;
                 parent.statement[i].traite=true;
                 
                 
                 return({status:true,value:t});
             }else if(parent.statement[i].type==='statement' && parent.statement[i].variant==='transaction' && parent.statement[i].action==='rollback' ){
                 /*
                 fin de transaction par un rollback
                 */
                 t+='\n'+esp0+')';
                 t+='\n'+esp0+'rollback()';
                 
                 parent.statement[i].en_cours_de_traitement=false;
                 parent.statement[i].traite=true;
                 
                 return({status:true,value:t});
             }else{
                 /*
                 autres éléments, on continue
                 */
                 var obj1=conversion_de_ast_vers_sql(parent.statement[i],niveau+1,parent,{});
                 parent.statement[i].en_cours_de_traitement=false;
                 parent.statement[i].traite=true;
                 if(obj1.status===true){
                     t+=obj1.value;
                 }else{
                     return(logerreur({status:false,message:'0070 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(parent.statement[i]))}));
                 }
             }
         }
     }
     t+='\n'+esp0+')';
  
  
  
 }else{
    t+='\n'+esp0+'#( todo '+JSON.stringify(json_partiel(element))+')';
    logerreur({status:false,message:'0081 erreur de conversion de ast vers rev type/variant non prévu : '+JSON.stringify(json_partiel(element))});
 }
 element.en_cours_de_traitement=false;
 element.traite=true;


 return {status:true,value:t};
}


/*
  =================================================================================== 
*/
function json_partiel(json_obj){
 
 var a={};
 for(var i in json_obj){
//  console.log( 'i=' ,  typeof json_obj[i] )
  if(typeof json_obj[i] === 'string'){
      a[i]=json_obj[i];
  }else if(typeof json_obj[i] === 'object'){
   
    if(json_obj[i] instanceof Array){
        a[i]=[];
    }else{
        a[i]={};
    }
  }else{
      a[i]='...';
  }
 }
 return a; 
 
}


/*
  =================================================================================== 
*/

function convertion_texte_sql_en_rev(texte_du_sql){
 var t='';
 /*
 Problème : le l'analyseur syntaxique plante sur un commentaire vide,
 en conséquence il faut retirer ces derniers
 */
 texte_du_sql=texte_du_sql.replace(/\/\*\*\//g,'');
 var sqliteParser = require('sqlite-parser'); 
 var ast=sqliteParser(texte_du_sql);
 console.log('ast=',ast);
 var obj1=conversion_de_ast_vers_sql(ast,0,null,{});
 
 if(obj1.status===true){
    return {status:true,value:obj1.value};
 }else{
    return(logerreur({status:false,message:'0026 erreur de conversion de ast vers rev'}));
 }
 
}


/*
=====================================================================================================================
*/

function charger_source_de_test_sql(nom_de_la_textarea){
 var t=`
BEGIN TRANSACTION;
    
    
    
    CREATE TABLE tbl_cibles (
    
        /**/ chi_id_cible INTEGER PRIMARY KEY ,
         chp_nom_cible STRING,
         chp_commentaire_cible STRING,
         chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT  'xxx' 
    );
    
    CREATE  UNIQUE INDEX  idx_dossier_cible ON tbl_cibles( chp_dossier_cible ) ;
    
    
    
    CREATE TABLE tbl_dossiers (
    
        /**/ chi_id_dossier INTEGER PRIMARY KEY ,
         chp_nom_dossier CHARACTER(256) NOT NULL DEFAULT  '' ,
         chx_cible_dossier INTEGER REFERENCES 'tbl_cibles'('chi_id_cible') 
    );
    
    CREATE  UNIQUE INDEX  idx_cible_et_nom ON tbl_dossiers( chx_cible_dossier , chp_nom_dossier ) ;
COMMIT;
 `;
 dogid(nom_de_la_textarea).value=t;
 
}

/*
=====================================================================================================================
*/
function charger_le_dernier_source_sql(nom_de_la_textarea){
 var fta_traiteSql_dernier_fichier_charge=localStorage.getItem("fta_traiteSql_dernier_fichier_charge");
 if(fta_traiteSql_dernier_fichier_charge!==null){
  dogid(nom_de_la_textarea).value=fta_traiteSql_dernier_fichier_charge;
 }
}
/*
=====================================================================================================================
*/
function transform_sql_de_textarea_en_rev(nom_de_la_textarea_sql , nom_de_la_textarea_rev){
 clearMessages('zone_global_messages');

 var texte=dogid(nom_de_la_textarea_sql).value;
 localStorage.setItem('fta_traiteSql_dernier_fichier_charge',texte);
 var obj=convertion_texte_sql_en_rev(texte);
 if(obj.status===true){
  dogid(nom_de_la_textarea_rev).value=obj.value;
 }else{
    logerreur({status:false,message:'erreur de reconstruction du sql'});
 }
 displayMessages('zone_global_messages');
 
}