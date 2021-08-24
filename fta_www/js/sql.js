//  0id	1val	2typ	3niv	4coQ	 5pre	 6der	 7cAv	 8cAp	 9cDe	 10pId	11nbE 12numEnfant 13numLi 14numlifer 15profond 
// 16CoApeNet 17ComDeNet 18ComAvNet 19TypComApre 20TypComDeda 21ComAvan 22OuvePar 23FerPar
// (typeof(b),egal('undefined')),et(d,egal(true))
"use strict";
//=====================================================================================================================
function tabToSql1(tab,id,offsetLigne){
 
 var ob=tabToSql0(tab,id,offsetLigne,false);
 return ob;
}
//=====================================================================================================================
function tabToSql0( tab ,id , offsetLigne , inFieldDef ){
 var t='';
 var i=0;
 var j=0;
 var k=0;
 var c='';
 var obj=null;
 for(i=id+1;i<tab.length;i++){
  
  if(tab[i][10]==id){
   
   
   
   if(tab[i][1]=='use'){
    
    
    if(tab[i][11]==1 && tab[i+1][2] == 'c'  ){
     t+='\n';
     t+='use `'+tab[i+1][1]+'`;';
     j++;
    }else{
        return logerreur({status:false,value:t,id:i,message:'erreur dans un sql(use) définit dans un php'});
    }
    
   }else if(tab[i][1]=='set'){
//    t+=espaces2(tab[i][3]);
    if(tab[i][11]==2 && tab[i+1][2] == 'c' &&  tab[i+2][2] == 'c' ){
     
     t+='\n';
     t+='set ';
     t+=(tab[i+1][4]===true?'\''+echappConstante(tab[i+1][1])+'\'' : tab[i+1][1]);
     t+=' = ';
     t+=(tab[i+2][4]===true?'\''+echappConstante(tab[i+2][1])+'\'' : tab[i+2][1]);
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
       if(tab[j][1]=='n' && tab[j][11]==1 && tab[j+1][2]=='c'){
        t+=' `'+tab[j+1][1]+'`';
        j++;
       }else if(tab[j][1]=='unsigned' && tab[j][11]==0){
        t+=' UNSIGNED';
       }else if(tab[j][1]=='notnull' && tab[j][11]==0){
        t+=' NOT NULL';
       }else if(tab[j][1]=='default' && tab[j][11]==1){
        t+=' DEFAULT ';
        t+=' \'TODO\' ';
        j++;
       }else if(tab[j][1]=='type' && (tab[j][11]==1 || tab[j][11]==2) && tab[j+1][2]=='c'){
        if(tab[j][11]==1){
         t+=' '+tab[j+1][1]+'';
         j++;
        }else if(tab[j][11]==2){
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

    t+='\n';
    t+='CREATE TABLE';
    for(j=i+1;j<tab.length;j++){
     if(tab[j][3]>tab[i][3]){
      if(tab[j][3]==tab[i][3]+1){
       if(tab[j][1]=='ifexists' && tab[j][11]==0){
        t+=' IF EXISTS';
       }else if(tab[j][1]=='ifnotexists' && tab[j][11]==0){
        t+=' IF NOT EXISTS';
       }else if(tab[j][1]=='n' && tab[j][11]==1 && tab[j+1][2]=='c'){
        t+=' `'+tab[j+1][1]+'`';
        j++;
       }else if(tab[j][1]=='fields' && tab[j][11]>0  ){
        t+=' (';
        
        obj=sousTableau(tab,j);
        if(obj.status===true){
         inFieldDef=true;
         obj=tabToSql0(obj.value,0,offsetLigne , inFieldDef);
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
        }else{
          return logerreur({status:false,value:t,id:i,message:'erreur dans un sql définit dans un php'});
        }
        
        
        
//        t+=tab[j][1];
        t+=')';
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
       if(tab[j][1]=='ifexists' && tab[j][11]==0){
        t+=' IF EXISTS';
       }else if(tab[j][1]=='ifnotexists' && tab[j][11]==0){
        t+=' IF NOT EXISTS';
       }else if(tab[j][1]=='n' && tab[j][11]==1 && tab[j+1][2]=='c'){
        t+=' `'+tab[j+1][1]+'`';
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
       if(tab[j][1]=='ifnotexists' && tab[j][11]==0){
        t+=' IF NOT EXISTS';
       }else if(tab[j][1]=='ifexists' && tab[j][11]==0){
        t+=' IF EXISTS';
       }else if(tab[j][1]=='n' && tab[j][11]==1 && tab[j+1][2]=='c'){
        t+=' `'+tab[j+1][1]+'`';
        j++;
       }else if(tab[j][1]=='charset' && tab[j][11]==1 && tab[j+1][2]=='c'){
        t+=' CHARACTER SET '+tab[j+1][1]+'';
        j++;
       }else if(tab[j][1]=='collate' && tab[j][11]==1 && tab[j+1][2]=='c'){
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

    obj=sousTableau(tab,i);
    if(obj.status===true){
     obj=tabToSql0(obj.value,0,offsetLigne , inFieldDef);
     if(obj.status===true){
      t+='\n';
      t+='START TRANSACTION;';
      t+=obj.value;
      t+='\nCOMMIT;';
     }else{
      return logerreur({status:false,value:t,id:i,message:'erreur dans un sql définit dans un php'});
     }
    }else{
      return logerreur({status:false,value:t,id:i,message:'erreur dans un sql définit dans un php'});
    }
   }else{
    t+=espaces2(tab[i][3]);
    t+='-- todo repere 104 temp '+tab[i][1];
   }
  }
 }
 return {status:true,value:t};  
}
