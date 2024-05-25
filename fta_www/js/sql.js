"use strict";
/*
sur sqlite
selection des tables
SELECT * FROM sqlite_master WHERE  name NOT LIKE 'sqlite_%'
PRAGMA table_info('tbl_cibles')
PRAGMA foreign_key_list('tbl_dossiers');

var global_enteteTableau=[
 ['id','id'                                 ,''], // 00
 ['val','value'                             ,''],
 ['typ','type'                              ,''],
 ['niv','niveau'                            ,''],
 ['coQ','constante quotee'                  ,''],
 ['pre','position du premier caractère'     ,''], // 05
 ['der','position du dernier caractère'     ,''],
 ['pId','Id du parent'                      ,''], // 10 ->  7
 ['nbE','nombre d\'enfants'                 ,''], // 11 ->  8
 ['nuE','numéro enfants'                    ,''], // 12 ->  9
 ['pro','profondeur'                        ,''], // 15 -> 10
 ['pop','position ouverture parenthese'     ,''], // 22 -> 11
 ['pfp','position fermeture parenthese'     ,''], // 23 -> 12
 ['com','commentaire'                       ,''],  
 
];

*/
/*
=====================================================================================================================
*/
function tabToSql1(tab,id , niveau){
 var options={
   'dans_definition_de_champ':false,
   'longueur_maximum_des_champs':0,
   'nom_du_champ_max':'',
   'tableau_tables_champs':[],
 };
 var ob=tabToSql0(tab,id, niveau, options );
 ob.longueur_maximum_des_champs=options.longueur_maximum_des_champs;
 ob.nom_du_champ_max=options.nom_du_champ_max;
 ob.tableau_tables_champs=options.tableau_tables_champs;
 return ob;
}

/*
=====================================================================================================================
*/
function recuperer_operateur_sqlite(op){
 var t='';
 if(op==='plus'){
  t='+';
 }else if(op==='egal'){
  t='=';
 }else if(op==='et'){
  t=' AND ';
 }else if(op==='ou'){
  t=' OR ';
 }else if(op==='champ'){
  t='';
 }else{
  t='/* 0048 récupérer opérateur "'+op+'" */';
 }
 return t;
}

/*
=====================================================================================================================
*/
function traite_sqlite_fonction_de_champ(tab,id,niveau,options){
 var t='';
 var operateur=recuperer_operateur_sqlite(tab[id][1]);
 var premierChamp=true;

 for(var i=id+1;i<tab.length && tab[i][3]>tab[id][3];i++){
  if(tab[i][7]===id){
   if(premierChamp===false){
    t+=operateur;
   }else{
    if(tab[id][1]==='champ'){
     t+='';
    }else{
//     t+='(';
    }
   }
   if(tab[i][2]==='c'){
    if(tab[i][1].toLowerCase()==='null'){
     t+='NULL';
    }else{
     if(tab[i][4]===0){
      t+=tab[i][1];
     }else{
      t+='\''+tab[i][1].replace(/\'/g,"''")+'\'';
     }
    }
   }else{
    var obj=traite_sqlite_fonction_de_champ(tab,i,niveau,options);
    if(obj.status===true){
       if(tab[i][1]==='champ'){
           t+=obj.value;
       }else{
           t+=obj.value;
       }
    }else{
       return logerreur({status:false,message:'0078 traite_sqlite_fonction_de_champ "'+tab[i][1]+'"'});
    }
   }
   if(premierChamp===true){
    premierChamp=false;
   }else{
    if(tab[id][1]==='champ'){
     t+='';
    }else{
//     t+=')';
    }
   }    
   
  }
 }
 if(operateur==='+' || operateur==='-' || operateur==='*' || operateur==='/' || operateur===' AND ' || operateur===' OR '){
  t='('+t+')';
 }
 
 return {status:true,value:t};
}
/*
=====================================================================================================================
*/
function tabToSql0( tab ,id ,  niveau , options){
 var t='';
 var i=0;
 var j=0;
 var k=0;
 var l=0;
 var m=0;
 var n=0;
 var o=0;
 var c='';
 var nam='';
 var oldnam='';
 var list='';
 var conditions='';
 var def='';
 var uniq='';
 var value='';
 var values='';
 var obj=null;
 
 
 for(i=id+1;i<tab.length;i++){
  
  if(tab[i][7]==id){
   
   
   
   if(tab[i][1]=='sql'){
    
    var obj=tabToSql0( tab ,i , false , niveau , options);
    if(obj.status===true){
     t+=obj.value;
    }else{
      return logerreur({status:false,message:'erreur 0062'});
    }
    
   }else if(tab[i][1]=='sélectionner' ){
    
     /*
       ==========================
       SELECT
       ==========================
     */
     nam='';
     list='';
     conditions='';
     value='';
     var nom_du_champ='';
     var valeur_du_champ='';
     
     t+=espacesn(true,niveau);
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     t+='SELECT 1;';
     t+=espacesn(true,niveau);
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     t+='/* TODO TODO TODO */'
     t+=espacesn(true,niveau);
     

   }else if(tab[i][1]=='modifier' ){
    
     /*
       ==========================
       UPDATE
       ==========================
     */
     nam='';
     list='';
     conditions='';
     value='';
     var nom_du_champ='';
     var valeur_du_champ='';
     for(j=i+1;j<tab.length;j++){
      if(tab[j][7]==tab[i][0]){
       if(( tab[j][1]=='nom_table' )  && tab[j][8]==1){
        nam=tab[j+1][1];
       }
       
       if( (tab[j][1]=='valeurs') && tab[j][8]>=1){
          values='';
          for(l=j+1;l<tab.length && tab[l][3]>tab[j][3];l++){
           if(tab[l][7]==j){
              if(value!=''){
               value+=' , ';
              }
              if(tab[l][1]==='affecte'){
                for(m=l+1;m<tab.length && tab[m][3]>tab[l][3];m++){
                 if(tab[m][7]==tab[l][0]){
                  if(tab[m][2]==='f' && tab[m][1]==='champ'){
                   nom_du_champ=tab[m+1][1];
                  }else{
                   if(tab[m][2]==='f'){
                       var obj=traite_sqlite_fonction_de_champ(tab,m);
                       if(obj.status===true){
                           valeur_du_champ=obj.value
                       }else{
                           return logerreur({status:false,message:'0198 erreur sur fonction dans update conditions "'+tab[l][1]+'"'});
                       }
                   }else{
                    if(tab[m][1].toLowerCase()==='null'){
                     valeur_du_champ='NULL';
                    }else{
                     valeur_du_champ='\''+tab[m][1].replace(/\'/g,"''")+'\'';
                    }
                   }
                  }
                 }
                }
              }
              value += ''+nom_du_champ+' = '+valeur_du_champ+''
           }
          }
          if(value!=''){
           values+=espacesn(true,niveau)+' (';
           values+=value+' ) ,';
          }
         
        
       }       
       if( (tab[j][1]=='conditions' ) && tab[j][8]>=1){
          conditions='';
          for(l=j+1;l<tab.length && tab[l][3]>tab[j][3];l++){
              if(tab[l][7]==j){
                 if(conditions!=''){
                  conditions+=' , ';
                 }
                 if(tab[l][2]==='f'){
                   var obj=traite_sqlite_fonction_de_champ(tab,l);
                   if(obj.status===true){
                       conditions+=obj.value
                   }else{
                       return logerreur({status:false,message:'0198 erreur sur fonction dans update conditions "'+tab[l][1]+'"'});
                   }
                 }
              }
          }
       }
       
       
      }
     }

     if(nam!='' && value!=''){
      t+=espacesn(true,niveau);
      t+='UPDATE '+nam+' SET '+value+'';
      if(conditions.length>0){
        t+=' WHERE '+conditions+' ;';
      }
     }
     

   }else if(tab[i][1]=='insert_into' || tab[i][1]=='insérer'){
    
     /*
       ==========================
       INSERT INTO
       ==========================
     */
     nam='';
     list='';
     for(j=i+1;j<tab.length;j++){
      if(tab[j][7]==tab[i][0]){
       if(( tab[j][1]=='n' || tab[j][1]=='nom_table' )  && tab[j][8]==1){
        nam=tab[j+1][1];
       }
       if(( tab[j][1]=='fields' || tab[j][1]=='champs' ) && tab[j][8]>=1){
        for(k=j+1;k<tab.length;k++){
         if(tab[k][3]==tab[j][3]+1 && tab[k][7] == tab[j][0]  ){
          list+=' '+tab[k][1]+' ,';
         }
        }
       }
       if( (tab[j][1]=='values' || tab[j][1]=='valeurs') && tab[j][8]>=1){
        values='';
        for(k=j+1;k<tab.length;k++){
         if(tab[k][3]==tab[j][3]+1 && tab[k][7] == tab[j][0] && tab[k][1]==''  ){
          
          value='';
          for(l=k+1;l<tab.length && tab[l][3]>tab[k][3];l++){
           if(tab[l][7]==tab[k][0]){
            if(value!=''){
             value+=' , ';
            }
            if(tab[l][2]==='c'){
              if(tab[l][1]=='NULL'){
               value+=''+(tab[l][1])+'';
              }else{
               value+='\''+(tab[l][1])+'\'';
              }
            }else{
             var obj=traite_sqlite_fonction_de_champ(tab,l);
             if(obj.status===true){
                value+=obj.value
             }else{
                return logerreur({status:false,message:'0121 erreur sur fonction dans insert "'+tab[l][1]+'"'});
             }
            }
           }
          }
          if(value!=''){
           values+=espacesn(true,niveau)+' (';
           values+=value+' ) ,';
          }
         }
        }
       }
      }
     }
     if(nam!='' && list!=''){
      t+=espacesn(true,niveau);
      t+='INSERT INTO '+nam+' ('+list.substr(0,list.length-1)+') VALUES '+values.substr(values,values.length-1)+' ;';
     }
   }else if(tab[i][1]=='add_index' || 'ajouter_index' === tab[i][1]){
     nam='';
     list='';
     uniq=' INDEX ';
     def='';
     for(j=i+1;j<tab.length;j++){
      if(tab[j][7]==tab[i][0]){
       if((tab[j][1]=='n' || tab[j][1]=='on_table' || 'sur_table' === tab[j][1] ) && tab[j][8]==1){
        nam=tab[j+1][1];
       }
       if(tab[j][1]=='index_name' && tab[j][8]==1){
        def=tab[j+1][1];
       }
       if(tab[j][1]=='unique' && tab[j][8]==0){
        uniq=' UNIQUE INDEX ';
       }
       if( ( tab[j][1]=='fields' || tab[j][1]=='champs' ) && tab[j][8]>=1){
        for(k=j+1;k<tab.length;k++){
         if(tab[k][3]==tab[j][3]+1 && tab[k][7] == tab[j][0]  ){
          list+=' `'+tab[k][1]+'` ,';
         }
        }
       }
      }
     }
     if(nam!='' && list!='' && def!=''){
      t+=espacesn(true,niveau);
      t+='/* ==========DEBUT DEFINITION=========== */';
      t+=espacesn(true,niveau);
//      t+='ALTER TABLE '+nam+' ADD'+uniq+' '+def+' ('+list.substr(0,list.length-1)+');'; // mySql / liteSql
      t+='CREATE '+uniq+' '+def+' ON `'+nam+'`('+list.substr(0,list.length-1)+') ;'; // mySql / liteSql
     }
   }else if(tab[i][1]=='change_field'){
     nam='';
     oldnam='';
     def='';
     for(j=i+1;j<tab.length;j++){
      if(tab[j][7]==tab[i][0]){
       if(tab[j][1]=='n' && tab[j][8]==1){
        nam=tab[j+1][1];
       }
       if(tab[j][1]=='old_name' && tab[j][8]==1){
        oldnam=tab[j+1][1];
       }
       
       if(tab[j][1]=='new_def' ){
        dans_definition_de_champ=true;
        options.dans_definition_de_champ=true;
        obj=tabToSql0(tab,j, niveau,options);
        options.dans_definition_de_champ=false;
        if(obj.status===true){
         
         for(k=obj.value.length-1;k>=0;k--){
          c=obj.value.substr(k,1);
          if(c==','){
           def=obj.value.substr(0,k);
           break;
          }
         }
         
        }else{
         return logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql définit dans un php'});
        }
       }
       
      }
     }
     if(nam!='' && oldnam!=''){
      t+=espacesn(true,niveau);
      t+='ALTER TABLE '+nam+' CHANGE '+oldnam+' '+def+';';
     }
    
    
   }else if(tab[i][1]=='add_primary_key'){
     // ALTER TABLE `fta`.`tbl_user` ADD PRIMARY KEY (`fld_id_user`);
     nam='';
     list='';
     for(j=i+1;j<tab.length;j++){
      if(tab[j][7]==tab[i][0]){
       if(tab[j][1]=='n' && tab[j][8]==1){
        nam=tab[j+1][1];
       }
       if(tab[j][1]=='fields' && tab[j][8]>=1){
        for(k=j+1;k<tab.length;k++){
         if(tab[k][3]==tab[j][3]+1 && tab[k][7] == tab[j][0]  ){
          list+=' '+tab[k][1]+' ,';
         }
        }
        break;
       }
      }
     }
     if(nam!='' && list!=''){
      t+=espacesn(true,niveau);
      t+='ALTER TABLE '+nam+' ADD PRIMARY KEY ('+list.substr(0,list.length-1)+');';
     }
    
   }else if(tab[i][1]=='use'){
    
    
    if(tab[i][8]==1 && tab[i+1][2] == 'c'  ){
     t+=espacesn(true,niveau);
     t+='use '+tab[i+1][1]+';';
     j++;
    }else{
        return logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql(use) définit dans un php'});
    }
    
   }else if(tab[i][1]=='set'){
//    t+=espacesn(true,tab[i][3]);
    if(tab[i][8]==2 && tab[i+1][2] == 'c' &&  tab[i+2][2] == 'c' ){
     
     t+=espacesn(true,niveau);
     
     t+='set ';
     if(tab[i+1][1]=='NAMES'){
      t+=tab[i+1][1];
      t+='  ';
      t+=tab[i+2][1];
     }else{
      t+=(tab[i+1][4]===true?'\''+(tab[i+1][1])+'\'' : tab[i+1][1]);
      t+=' = ';
      t+=(tab[i+2][4]===true?'\''+(tab[i+2][1])+'\'' : tab[i+2][1]);
     }
     t+=';';
    }else{
     logerreur({status:false,value:t,id:i,message:'sql.js cas non prévu dans un SET()'});
     t+=espacesn(true,niveau);
     t+='-- todo ligne 35 temp '+tab[i][1];
    }
    
   }else if(tab[i][1]=='field' && options.hasOwnProperty('dans_definition_de_champ') && options.dans_definition_de_champ==true){
    
/*
                field(
                  n(fld_id_user),
                  type(bigint),
                  unsigned(),
                  notnull()
                  default(0)
                  comment(0)
  `fld_id_css` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fld_name_css` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '{"showDeleteField":true}',

*/    
//    console.log(tab);
    var variables_pour_tableau_tables={
     'nom_du_champ'   : '',
     'autoincrement'  : false,
     'is_not_null'    : false,
     'defaut'         : {'est_defini':false,'valeur':null},
     'cle_primaire'   : false,
     'reference'      : {'est_defini':false,'table':'','champ':''},
     'type'           : {'nom':false,'longueur':false},
    };
    // options.tableau_tables_champs
    for(j=i+1;j<tab.length;j++){
     if(tab[j][3]>tab[i][3]){
      if(tab[j][3]==tab[i][3]+1){
       if(tab[j][1]=='n' && tab[j][8]==1 && tab[j+1][2]=='c'){
        if(options.longueur_maximum_des_champs<tab[j+1][1].length+1){
         options.longueur_maximum_des_champs=tab[j+1][1].length+1;
         options.nom_du_champ_max=tab[j+1][1];
        }
        t+=' '+tab[j+1][1]+'';
        variables_pour_tableau_tables.nom_du_champ=tab[j+1][1];
        j++;
       }else if(tab[j][1]=='#'){
        t+='/*'+tab[j][13].replace(/\/\*/g,'/ *').replace(/\*\//g,'* /')+'*/';
        t+=espacesn(true,niveau);
       }else if(tab[j][1]=='auto_increment' && tab[j][8]==0){
//        t+=' AUTO_INCREMENT';
        t+=' AUTOINCREMENT'; // mySql / liteSql
        variables_pour_tableau_tables.autoincrement=true;
       }else if(tab[j][1]=='unsigned' && tab[j][8]==0){
        t+=' UNSIGNED';
       }else if( ( tab[j][1]=='notnull' || tab[j][1]=='not_null' ) && tab[j][8]==0){
        t+=' NOT NULL';
        variables_pour_tableau_tables.is_not_null=true;
       }else if(tab[j][1]=='default' && tab[j][8]==1){
        t+=' DEFAULT ';
        if(false && tab[j+1][1]==='NULL'){
         t+=' NULL ';
        }else{
         t+=' '+maConstante(tab[j+1])+' ';
         variables_pour_tableau_tables.defaut.est_defini=true;
         variables_pour_tableau_tables.defaut.valeur=maConstante(tab[j+1]);
        }
        j++;
       }else if(tab[j][1]=='primary_key' && tab[j][8]==0){
        t+=' PRIMARY KEY ';
        variables_pour_tableau_tables.cle_primaire=true;
       }else if(tab[j][1]=='references' && ( tab[j][8]==2) && tab[j+1][2]=='c'){
        t+=' REFERENCES '+maConstante(tab[j+1])+'('+maConstante(tab[j+2])+') ';
        variables_pour_tableau_tables.reference.est_defini=true;
        variables_pour_tableau_tables.reference.table=+maConstante(tab[j+1]);
        variables_pour_tableau_tables.reference.champ=+maConstante(tab[j+2]);
        j+=2;
        
       }else if(tab[j][1]=='type' && (tab[j][8]==1 || tab[j][8]==2) && tab[j+1][2]=='c'){
        if(tab[j][8]==1){
         t+=' '+tab[j+1][1]+'';
         variables_pour_tableau_tables.type.nom=tab[j+1][1];
         j++;
        }else if(tab[j][8]==2){
         t+=' '+tab[j+1][1]+'('+tab[j+2][1]+')';
         variables_pour_tableau_tables.type.nom=tab[j+1][1];
         variables_pour_tableau_tables.type.longueur=tab[j+2][1];
         j+=2;
        }else{
         logerreur({status:false,id:i,message:'0271 sql.js erreur dans un field'});
         t+=' /* todo sql.js repere 0334 '+tab[j][1] + ' */';
        }
       }else{
        logerreur({status:false,id:i,message:'0275 sql.js erreur dans un field pour '+tab[j][1]});
        t+='/* todo sql.js repere 0338 '+tab[j][1] + ' */';
       }
      }
     }else{
      break;
     }
    }
//    console.log('variables_pour_tableau_tables=',variables_pour_tableau_tables);
    if(options.dans_definition_de_champ===true){
       options.tableau_tables_champs[options.tableau_tables_champs.length-1].champs.push(variables_pour_tableau_tables);
    }
    
    t+=',';
    t+=espacesn(true,niveau);
    
    
    
   }else if(tab[i][1]=='create_table' || tab[i][1]=='créer_table'){

    var engine='';
    var auto_increment=0;
    var charset=0;
    var collate=0;
    t+=espacesn(true,niveau);
    t+=espacesn(true,niveau);
    t+='/* ==========DEBUT DEFINITION=========== */';
    t+=espacesn(true,niveau);
    t+=espacesn(true,niveau);
    var nom_table_en_cours='';
    t+='CREATE TABLE';
    for(j=i+1;j<tab.length;j++){
     if(tab[j][3]>tab[i][3]){
      if(tab[j][3]==tab[i][3]+1){
       if(tab[j][1]=='ifexists' && tab[j][8]==0){
        t+=' IF EXISTS';
       }else if(tab[j][1]=='ifnotexists' && tab[j][8]==0){
        t+=' IF NOT EXISTS';
       }else if(tab[j][1]=='engine' && tab[j][8]==1){
        engine=' ENGINE='+tab[j+1][1]+'';
       }else if(tab[j][1]=='auto_increment' && tab[j][8]==1){
        auto_increment=' AUTO_INCREMENT='+tab[j+1][1]+'';
       }else if(tab[j][1]=='charset' && tab[j][8]==1){
        charset=' DEFAULT CHARSET='+tab[j+1][1]+'';
       }else if(tab[j][1]=='collate' && tab[j][8]==1){
        collate=' COLLATE='+tab[j+1][1]+'';
       }else if((tab[j][1]=='n' || tab[j][1]=='table_name'  || tab[j][1]=='nom_table' ) && tab[j][8]==1 && tab[j+1][2]=='c'){
        t+=' '+tab[j+1][1]+'';
        nom_table_en_cours=tab[j+1][1];
        j++;
       }else if( ( tab[j][1]=='fields' || tab[j][1]=='champs' ) && tab[j][8]>0  ){
        t+=' (';
//        console.log('nom_table_en_cours=',nom_table_en_cours);
        
        options.dans_definition_de_champ=true;
        options.tableau_tables_champs.push({'nom_de_la_table' : nom_table_en_cours, 'champs' : []})
        niveau++;
        obj=tabToSql0(tab,j, niveau,options);
        niveau--;
        options.dans_definition_de_champ=false;
        
//        console.log('options.tableau_tables_champs=',options.tableau_tables_champs);
        
        if(obj.status===true){
         t+=espacesn(true,niveau);
         for(k=obj.value.length-1;k>=0;k--){
          c=obj.value.substr(k,1);
          if(c==','){
           t+=obj.value.substr(0,k);
           t+=espacesn(true,niveau);
           break;
          }
         }
         
        }else{
         return logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql définit dans un php'});
        }
        
        
        
//        t+=tab[j][1];
        t+=')'+(engine==''?'':' ' + engine)+(auto_increment==''?'':' ' + auto_increment)+(charset==''?'':' ' + charset)+(collate==''?'':' ' + collate);
        for(k=j+1;k<tab.length;k++){
         if(tab[k][3]>tab[j][3]){
         }else{
          j=k-1;
          break;
         }
        }
        nom_table_en_cours='';
       }else if(tab[j][1].substr(0,5)=='meta_' && tab[j][8]>0  ){
        t+=CRLF+' /*'+tab[j][1]+'*/ ';
       }else{
        t+=' todo sql.js repere 0350 '+tab[j][1];
       }
      }
     }else{
      break;
     }
    }
    
    t+=';';
    
   }else if(tab[i][1]=='drop_table'){

    t+=espacesn(true,niveau);
    t+='DROP TABLE';
    for(j=i+1;j<tab.length;j++){
     if(tab[j][3]>tab[i][3]){
      if(tab[j][3]==tab[i][3]+1){
       if(tab[j][1]=='ifexists' && tab[j][8]==0){
        t+=' IF EXISTS';
       }else if(tab[j][1]=='ifnotexists' && tab[j][8]==0){
        t+=' IF NOT EXISTS';
       }else if(tab[j][1]=='n' && tab[j][8]==1 && tab[j+1][2]=='c'){
        t+=' '+tab[j+1][1]+'';
        j++;
       }else{
        t+=' todo sql.js repere 0375 '+tab[j][1];
       }
      }
     }else{
      break;
     }
    }
    t+=';';
    
   }else if(tab[i][1]=='create_database'){

    t+=espacesn(true,niveau);
    t+='CREATE DATABASE';
    for(j=i+1;j<tab.length;j++){
     if(tab[j][3]>tab[i][3]){
      if(tab[j][3]==tab[i][3]+1){
       if(tab[j][1]=='ifnotexists' && tab[j][8]==0){
        t+=' IF NOT EXISTS';
       }else if(tab[j][1]=='ifexists' && tab[j][8]==0){
        t+=' IF EXISTS';
       }else if(tab[j][1]=='n' && tab[j][8]==1 && tab[j+1][2]=='c'){
        t+=' '+tab[j+1][1]+'';
        j++;
       }else if(tab[j][1]=='charset' && tab[j][8]==1 && tab[j+1][2]=='c'){
        t+=' CHARACTER SET '+tab[j+1][1]+'';
        j++;
       }else if(tab[j][1]=='collate' && tab[j][8]==1 && tab[j+1][2]=='c'){
        t+=' COLLATE '+tab[j+1][1]+'';
        j++;
       }else{
        t+=' todo sql.js repere 76 '+tab[j][1];
       }
      }
     }else{
      break;
     }
    }
    t+=';';
    
    
   }else if(tab[i][1]=='commit'){
     t+=espacesn(true,niveau);
     t+='COMMIT;';
   }else if(tab[i][1]=='transaction'){
    niveau++;
    obj=tabToSql0(tab,i, niveau, options);
    niveau--;
    if(obj.status===true){
     t+=espacesn(true,niveau);
//     t+='START TRANSACTION;';  // mySql / liteSql
     t+='BEGIN TRANSACTION;';  // mySql / liteSql
     t+=obj.value;
     t+=espacesn(true,niveau);
    }else{
     return logerreur({status:false,value:t,id:i,message:'sql.js erreur dans un sql définit dans un php'});
    }
    
   }else if(tab[i][1]=='#'){
    
    t+=espacesn(true,niveau);
    t+='/*';
    t+=traiteCommentaire2(tab[i][13],niveau,i);
    t+='*/';

   }else if(tab[i][1].substr(0,5)=='meta_' ){
    t+=CRLF+' /*'+tab[i][1]+'*/ '+CRLF + '    ';
    
   }else{
    t+=espacesn(true,niveau);
    t+='-- todo repere 0524 fonction sql non prevue  "'+tab[i][1]+'"';
   }
  }
 }
 return {status:true,value:t};  
}
/*
=====================================================================================================================
*/
function traite_le_tableau_de_la_base_sqlite(par){
 
 
 var t='\n';
// console.log('par=',par);
 
 for( var nom_table in par['donnees']){
  t+='\n'+'create_table(';
  t+='\n'+' n(\''+nom_table+'\'),';
  t+='\n'+' fields(#(),';
  
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
 if(par['zone_rev']){
  dogid(par['zone_rev']).value='sql(transaction(\n'+t+'\n\n))';
  formatter_le_source_rev(par['zone_rev']);
 }
// console.log('t=',t); 
 
 // CREATE TABLE 'tbl_bases_de_donnees' ('chi_id_basedd' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'chp_nom_basedd' TEXT NOT NULL DEFAULT '', 'chp_rev_basedd' TEXT, 'chp_commentaire_basedd' TEXT, chx_dossier_id_basedd INTEGER DEFAULT NULL REFERENCES tbl_dossiers(chi_id_dossier))
 return {status:true,value:t};
}
