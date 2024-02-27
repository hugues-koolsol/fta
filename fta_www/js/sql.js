"use strict";
/*
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
//=====================================================================================================================
function tabToSql1(tab,id){
 
 var ob=tabToSql0(tab,id,false);
 return ob;
}
//=====================================================================================================================
function tabToSql0( tab ,id , inFieldDef ){
 var t='';
 var i=0;
 var j=0;
 var k=0;
 var l=0;
 var c='';
 var nam='';
 var oldnam='';
 var list='';
 var def='';
 var uniq='';
 var value='';
 var values='';
 var obj=null;
 for(i=id+1;i<tab.length;i++){
  
  if(tab[i][7]==id){
   
   
   
   if(tab[i][1]=='insert_into'){
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
       }
       if(tab[j][1]=='values' && tab[j][8]>=1){
        values='';
        for(k=j+1;k<tab.length;k++){
         if(tab[k][3]==tab[j][3]+1 && tab[k][7] == tab[j][0] && tab[k][1]==''  ){
          
          value='';
          for(l=k+1;l<tab.length && tab[l][7]==tab[k][0];l++){
           if(value!=''){
            value+=' , ';
           }
           if(tab[l][1]=='NULL'){
            value+=''+echappConstante(tab[l][1])+'';
           }else{
            value+='\''+echappConstante(tab[l][1])+'\'';
           }
          }
          if(value!=''){
           values+='\n (';
           values+=value+' ) ,';
          }
         }
        }
       }
      }
     }
     if(nam!='' && list!=''){
      t+='\n';
      t+='INSERT INTO '+nam+' ('+list.substr(0,list.length-1)+') VALUES '+values.substr(values,values.length-1)+' ;';
     }
   }else if(tab[i][1]=='add_index'){
     nam='';
     list='';
     uniq='';
     def='';
     for(j=i+1;j<tab.length;j++){
      if(tab[j][7]==tab[i][0]){
       if(tab[j][1]=='n' && tab[j][8]==1){
        nam=tab[j+1][1];
       }
       if(tab[j][1]=='index_name' && tab[j][8]==1){
        def=tab[j+1][1];
       }
       if(tab[j][1]=='unique' && tab[j][8]==0){
        uniq=' UNIQUE';
       }
       if(tab[j][1]=='fields' && tab[j][8]>=1){
        for(k=j+1;k<tab.length;k++){
         if(tab[k][3]==tab[j][3]+1 && tab[k][7] == tab[j][0]  ){
          list+=' '+tab[k][1]+' ,';
         }
        }
       }
      }
     }
     if(nam!='' && list!='' && def!=''){
      t+='\n';
      t+='ALTER TABLE '+nam+' ADD'+uniq+' '+def+' ('+list.substr(0,list.length-1)+');';
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
        inFieldDef=true;
        obj=tabToSql0(tab,j, inFieldDef);
        inFieldDef=false;
        if(obj.status===true){
         
         for(k=obj.value.length-1;k>=0;k--){
          c=obj.value.substr(k,1);
          if(c==','){
           def=obj.value.substr(0,k);
           break;
          }
         }
         
        }else{
         return logerreur({status:false,value:t,id:i,message:'erreur dans un sql définit dans un php'});
        }
       }
       
      }
     }
     if(nam!='' && oldnam!=''){
      t+='\n';
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
      t+='\n';
      t+='ALTER TABLE '+nam+' ADD PRIMARY KEY ('+list.substr(0,list.length-1)+');';
     }
    
   }else if(tab[i][1]=='use'){
    
    
    if(tab[i][8]==1 && tab[i+1][2] == 'c'  ){
     t+='\n';
     t+='use '+tab[i+1][1]+';';
     j++;
    }else{
        return logerreur({status:false,value:t,id:i,message:'erreur dans un sql(use) définit dans un php'});
    }
    
   }else if(tab[i][1]=='set'){
//    t+=espaces2(tab[i][3]);
    if(tab[i][8]==2 && tab[i+1][2] == 'c' &&  tab[i+2][2] == 'c' ){
     
     t+='\n';
     
     t+='set ';
     if(tab[i+1][1]=='NAMES'){
      t+=tab[i+1][1];
      t+='  ';
      t+=tab[i+2][1];
     }else{
      t+=(tab[i+1][4]===true?'\''+echappConstante(tab[i+1][1])+'\'' : tab[i+1][1]);
      t+=' = ';
      t+=(tab[i+2][4]===true?'\''+echappConstante(tab[i+2][1])+'\'' : tab[i+2][1]);
     }
     t+=';';
    }else{
     t+='\n';
//     t+=espaces2(tab[i][3]);
     t+='-- todo ligne 35 temp '+tab[i][1];
    }
    
   }else if(tab[i][1]=='field' && inFieldDef==true){
    
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
    
    for(j=i+1;j<tab.length;j++){
     if(tab[j][3]>tab[i][3]){
      if(tab[j][3]==tab[i][3]+1){
       if(tab[j][1]=='n' && tab[j][8]==1 && tab[j+1][2]=='c'){
        t+=' '+tab[j+1][1]+'';
        j++;
       }else if(tab[j][1]=='auto_increment' && tab[j][8]==0){
        t+=' AUTO_INCREMENT';
       }else if(tab[j][1]=='unsigned' && tab[j][8]==0){
        t+=' UNSIGNED';
       }else if(tab[j][1]=='notnull' && tab[j][8]==0){
        t+=' NOT NULL';
       }else if(tab[j][1]=='default' && tab[j][8]==1){
        t+=' DEFAULT ';
        t+=' \''+echappConstante(tab[j+1][1])+'\' ';
        j++;
       }else if(tab[j][1]=='type' && (tab[j][8]==1 || tab[j][8]==2) && tab[j+1][2]=='c'){
        if(tab[j][8]==1){
         t+=' '+tab[j+1][1]+'';
         j++;
        }else if(tab[j][8]==2){
         t+=' '+tab[j+1][1]+'('+tab[j+2][1]+')';
         j+=2;
        }else{
         t+=' todo sql.js repere 66 '+tab[j][1];
        }
       }else{
        t+=' todo sql.js repere 69 '+tab[j][1];
       }
      }
     }else{
      break;
     }
    }
    
    t+=',\n';
    
    
    
   }else if(tab[i][1]=='create_table'){

    var engine='';
    var auto_increment=0;
    var charset=0;
    var collate=0;
    t+='\n';
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
       }else if(tab[j][1]=='n' && tab[j][8]==1 && tab[j+1][2]=='c'){
        t+=' '+tab[j+1][1]+'';
        j++;
       }else if(tab[j][1]=='fields' && tab[j][8]>0  ){
        t+=' (';
        
        inFieldDef=true;
        obj=tabToSql0(tab,j, inFieldDef);
        inFieldDef=false;
        if(obj.status===true){
         t+='\n';
         for(k=obj.value.length-1;k>=0;k--){
          c=obj.value.substr(k,1);
          if(c==','){
           t+=obj.value.substr(0,k)+'\n';
           break;
          }
         }
         
        }else{
         return logerreur({status:false,value:t,id:i,message:'erreur dans un sql définit dans un php'});
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
       }else{
        t+=' todo sql.js repere 49 '+tab[j][1];
       }
      }
     }else{
      break;
     }
    }
    
    t+=';';
    
   }else if(tab[i][1]=='drop_table'){

    t+='\n';
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
        t+=' todo sql.js repere 49 '+tab[j][1];
       }
      }
     }else{
      break;
     }
    }
    t+=';';
    
   }else if(tab[i][1]=='create_database'){

    t+='\n';
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
    
    
   }else if(tab[i][1]=='transaction'){
    
    obj=tabToSql0(tab,i, inFieldDef);
    if(obj.status===true){
     t+='\n';
     t+='START TRANSACTION;';
     t+=obj.value;
     t+='\nCOMMIT;';
    }else{
     return logerreur({status:false,value:t,id:i,message:'erreur dans un sql définit dans un php'});
    }
    
   }else if(tab[i][1]=='#'){
    
    t+='\n/*'+tab[i][13]+'*/';
    
   }else{
    t+=espaces2(tab[i][3]);
    t+='-- todo repere fonction sql non prevue  "'+tab[i][1]+'"';
   }
  }
 }
 return {status:true,value:t};  
}
