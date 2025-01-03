"use strict";
function recupere_element_de_ast_sql(element,niveau,parent,options){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);

 if(!element){ //.hasOwnProperty('type')){
  debugger
 }
 
 if(element.type && 'literal'===element.type){
     if(element.variant==='decimal'){
         t+=element.value;
      
     }else if(element.variant==='text'){
         t+='\''+element.value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'';
     }else if(element.variant==='null'){
         t+='NULL';
     }else{
         return(logerreur({__xst:false,__xme:'0016 recupere_element_de_ast_sql variant non traite : "'+JSON.stringify(json_partiel(element))+'"'}));
     }
  
 }else if(element.type && 'join'===element.type){
  
     if(element.variant==='cross join'){
         t+='jointure_croisée(';
     }else if(element.variant==='left join'){
         t+='jointure_gauche(';
     }else{
         return(logerreur({__xst:false,__xme:'0031 recupere_element_de_ast_sql variant non traite : "'+JSON.stringify(json_partiel(element))+'"'}));
     }
      

     if(element.source){
      
        var obj1=recupere_element_de_ast_sql(element.source,niveau+1,parent,options);
        if(obj1.__xst===true){
            t+='\n'+esp0+esp1+esp1+esp1+'source('+obj1.__xva;
            t+='\n'+esp0+esp1+esp1+esp1+')';
        }else{
          t+='#(TODO 0034 "'+JSON.stringify(json_partiel(element.source))+'")';
          return(logerreur({__xst:false,__xme:'0034 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.source))+'"'}));
        }
      
      
     }else{
        return(logerreur({__xst:false,__xme:'0030 recupere_element_de_ast_sql variant non traite : "'+JSON.stringify(json_partiel(element.source))+'"'}));
     }
     if(element.constraint){
       if(element.constraint.format && element.constraint.format ==="on" && element.constraint.on){
           var obj1=recupere_element_de_ast_sql( element.constraint.on,niveau,parent,options);
           if(obj1.__xst===true){
               t+=',contrainte('+obj1.__xva+')';
           }else{
               return(logerreur({__xst:false,__xme:'0042 recupere_element_de_ast_sql  : "'+JSON.stringify(json_partiel(element.constraint))+'"'}));
           }
           
        
       }else{
          return(logerreur({__xst:false,__xme:'0025 recupere_element_de_ast_sql variant non traite : "'+JSON.stringify(json_partiel(element.constraint))+'"'}));
       }
     }
     
     t+=')';
      
      
  
 }else if(element.type && 'identifier'===element.type){
  
     if(element.variant==='column'){
         if(element.hasOwnProperty('alias')){
             if(element.name.indexOf('.')>=1){
                 t+='champ(`'+element.name.substr(0,element.name.indexOf('.'))+'`,`'+element.name.substr(element.name.indexOf('.')+1)+'` , alias_champ(`'+element.alias+'`))';
             }else{
                 t+='champ('+element.name+' , alias_champ(`'+element.alias+'`))';
             }
         }else{
             if(element.name.indexOf('.')>=1){
                 t+='champ(`'+element.name.substr(0,element.name.indexOf('.'))+'`,`'+element.name.substr(element.name.indexOf('.')+1)+'`)';
             }else{
                 t+='champ('+element.name+')';
             }
         }
     }else if(element.variant==='function'){
         if(element.name==='count'){
             t+='compter';
         }else{
             t+=element.name;
         }
     }else if(element.variant==='star'){
         t+='tous_les_champs()';
     }else if(element.variant==='table'){

         var nom_de_la_table='';
         var nom_de_la_base='';
         var nom_de_l_alias='';
         if(element.name.indexOf('.')>=1){
             nom_de_la_table=element.name.substr(element.name.indexOf('.')+1);
             nom_de_la_base=element.name.substr(0,element.name.indexOf('.'));
         }else{
             nom_de_la_table=element.name;
         }
         
         if(element.alias){
             nom_de_l_alias=element.alias;
         }
         if(nom_de_la_table===''){
             return(logerreur({__xst:false,__xme:'0105 recupere_element_de_ast_sql table : "'+JSON.stringify(json_partiel(element))+'"'}));
         }
         t+='nom_de_la_table('+nom_de_la_table+''+(nom_de_l_alias!==''?',alias('+nom_de_l_alias+')':'')+''+(nom_de_la_base!==''?',base('+nom_de_la_base+')':'')+')';
         
     }else if(element.variant==='expression'){
         if(element.format && element.format==='table'){
             t+='nom_de_la_table('+element.name+')';
             if(element.columns){
              
                 t+=',champs(';
                 for(var i=0;i<element.columns.length;i++){
                  if(i>0){
                   t+=',';
                  }
                  t+='`'+element.columns[i].name+'`';
                 }
                 t+=')';
              
              
             }else{
                 return(logerreur({__xst:false,__xme:'0092 recupere_element_de_ast_sql pas de columns dans expression table : "'+JSON.stringify(json_partiel(element))+'"'}));
             }
         }else{
           return(logerreur({__xst:false,__xme:'0088 recupere_element_de_ast_sql expression format non traite : "'+JSON.stringify(json_partiel(element))+'"'}));
         }
      
     }else{
         return(logerreur({__xst:false,__xme:'0016 recupere_element_de_ast_sql variant non traite : "'+JSON.stringify(json_partiel(element))+'"'}));
     }
  
 }else if(element.type && 'expression'===element.type && element.variant==='order'){

     var obj1=recupere_element_de_ast_sql(element.expression,niveau,parent,options);
     if(obj1.__xst===true){
        t+='('+obj1.__xva;
        if(element.direction){
         if(element.direction==='desc'){
           t+=',décroissant()';
         }else{
           t+=',croissant()';
         }
        }else{
           t+=',croissant()';
        }
        t+=')';
     }else{
       return(logerreur({__xst:false,__xme:'0042 recupere_element_de_ast_sql  : "'+JSON.stringify(json_partiel(element))+'"'}));
     }


 }else if(element.type && 'expression'===element.type && element.format && element.format==='binary'){

     var obj1=traite_operation_dans_ast_sql(element,niveau,parent,options);
     if(obj1.__xst===true){
        t+=obj1.__xva;
     }else{
       return(logerreur({__xst:false,__xme:'0042 recupere_element_de_ast_sql  : "'+JSON.stringify(json_partiel(element))+'"'}));
     }
  
 }else if(element.type && 'expression'===element.type && 'list'===element.variant ){
     if(element.expression && element.expression.length>0){
         t+='(';
         for(var i=0;i<element.expression.length;i++){
              if(i>0){
                  t+=',';
              }
              var obj1=recupere_element_de_ast_sql(element.expression[i],niveau,parent,options)
              if(obj1.__xst===true){
                  t+=obj1.__xva;
              }else{
                  return(logerreur({__xst:false,__xme:'0142 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element.expression[i]))}));
              }
         }
         t+=')';
     }else{
        return(logerreur({__xst:false,__xme:'0137 recupere_element_de_ast_sql pas de expression : "'+JSON.stringify(json_partiel(element))+'"'}));
     }
 }else if(element.type && 'expression'===element.type && 'operation'===element.variant && element.format === "unary" ){
     if(element.operator === '-' && element.expression.type === 'literal' ){
         t+='moins('+element.expression.value+')';
     }else if(element.operator === '+' && element.expression.type === 'literal' ){
         t+='plus('+element.expression.value+')';
     }else{
         return(logerreur({__xst:false,__xme:'0189 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element))}));
     }

 }else if(element.type && 'function'===element.type ){
     var obj1=traite_fonction_dans_ast_sql(element,niveau,null,options);
     if(obj1.__xst===true){
         t+=obj1.__xva;
     }else{
         return(logerreur({__xst:false,__xme:'0051 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element))}));
     }
  
  
 }else if(element.type && 'assignment'===element.type ){
  var cible='';
  var valeur='';
  if(element.target){
      var obj1=recupere_element_de_ast_sql(element.target,niveau,parent,options)
      if(obj1.__xst===true){
          cible=obj1.__xva;
      }else{
          return(logerreur({__xst:false,__xme:'0165 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element.target))}));
      }
  }else{
      return(logerreur({__xst:false,__xme:'0169 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element.target))}));
  }
  if(element.value){
      var obj1=recupere_element_de_ast_sql(element.value,niveau,parent,options)
      if(obj1.__xst===true){
          valeur=obj1.__xva;
      }else{
          return(logerreur({__xst:false,__xme:'0180 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element.value))}));
      }
  }else{
      return(logerreur({__xst:false,__xme:'0180 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element.value))}));
  }
  t+='affecte('+cible+','+valeur+')'

 }else if(element.type && 'variable'===element.type ){
  if(element.format==='tcl'){
    t+=element.name
  }else if(element.format==='named'){
    t+=element.name
  }else if(element.format==='numbered'){
    t+=element.name

  }else{
     return(logerreur({__xst:false,__xme:'0199 recupere_element_de_ast_sql type non traite : "'+JSON.stringify(json_partiel(element))+'"'}));
  }
 }else if(element.type && 'statement'===element.type ){
  
  var obj=conversion_de_ast_vers_sql(element,niveau,parent,options);
  if(obj.__xst===true){
      t+='sql('+obj.__xva+')';
  }else{
      return(logerreur({__xst:false,__xme:'0237 convertion_sql "'+JSON.stringify(json_partiel(element))+'"'}));
  }
 }else{
     return(logerreur({__xst:false,__xme:'0240 convertion_sql recupere_element_de_ast_sql type non traite : "'+JSON.stringify(json_partiel(element))+'"'}));
 }
 return {__xst:true,__xva:t};

}

/*
  =================================================================================== 
*/
function recupere_operateur_dans_sql_ast(nom_de_l_operateur){
 
 if(nom_de_l_operateur==='+'){
  return 'plus';
 }else if(nom_de_l_operateur==='-'){
  return 'moins';
 }else if(nom_de_l_operateur==='*'){
  return 'mult';
 }else if(nom_de_l_operateur==='/'){
  return 'divi';
 }else if(nom_de_l_operateur==='<>'){
  return 'diff';
 }else if(nom_de_l_operateur==='not like'){
  return 'pas_comme';
 }else if(nom_de_l_operateur==='like'){
  return 'comme';
 }else if(nom_de_l_operateur==='='){
  return 'egal';
 }else if(nom_de_l_operateur==='and'){
  return 'et';
 }else if(nom_de_l_operateur==='or'){
  return 'ou';
 }else if(nom_de_l_operateur==='in'){
  return 'dans';
 }else if(nom_de_l_operateur==='>='){
  return 'supegal';
 }else if(nom_de_l_operateur==='<='){
  return 'infegal';
 }else if(nom_de_l_operateur==='>'){
  return 'sup';
 }else if(nom_de_l_operateur==='<'){
  return 'inf';
 }else if(nom_de_l_operateur==='is'){
  return 'est';
 }else{
     logerreur({__xst:false,__xme:'0210 convertion_sql_en_rev operateur non trouvé : "'+nom_de_l_operateur+'"'});
 }
}

/*
  =================================================================================== 
*/
function traite_fonction_dans_ast_sql(element,niveau,parent,options){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var les_arguments='';
 var nom_de_la_fonction='';


 if(element.name){
     var obj1=recupere_element_de_ast_sql(element.name,niveau,parent,options);
     if(obj1.__xst===true){
        nom_de_la_fonction=obj1.__xva;
     }else{
       return(logerreur({__xst:false,__xme:'0069 traite_fonction_dans_ast_sql nom de fonction : "'+JSON.stringify(json_partiel(element))+'"'}));
     }
  
     
     
     
 }else{
     return(logerreur({__xst:false,__xme:'0060 traite_fonction_dans_ast_sql pas de nom de fonction trouvé : "'+JSON.stringify(json_partiel(element))+'"'}));
 }

 if(element.args){
     if(element.args.type==='expression' && element.args.variant==='list'){
        for(var i=0;i<element.args.expression.length;i++){
          var obj1=recupere_element_de_ast_sql(element.args.expression[i],niveau,parent,options);
          if(obj1.__xst===true){
              les_arguments+=','+obj1.__xva;
          }else{
              return(logerreur({__xst:false,__xme:'0075 traite_fonction_dans_ast_sql type argument non traité : "'+JSON.stringify(json_partiel(element.args))+'"'}));
          }
         
        }
      
     }else if(element.args.type==='function' ){
      
        var obj1=traite_fonction_dans_ast_sql(element.args,niveau,null,options);
        if(obj1.__xst===true){
            les_arguments+=','+obj1.__xva;
        }else{
            return(logerreur({__xst:false,__xme:'0134 convertit_sql_select_de_ast_vers_rev : '+JSON.stringify(json_partiel(element.args))}));
        }
      
     }else if(element.args.type==='identifier' ){
        var obj1=recupere_element_de_ast_sql(element.args,niveau,parent,options);
        if(obj1.__xst===true){
            les_arguments+=','+obj1.__xva;
        }else{
            return(logerreur({__xst:false,__xme:'0109 traite_fonction_dans_ast_sql  : "'+JSON.stringify(json_partiel(element.args))+'"'}));
        }
      
     }else{
         return(logerreur({__xst:false,__xme:'0098 traite_fonction_dans_ast_sql type argument non traité : "'+JSON.stringify(json_partiel(element.args))+'"'}));
     }
     if(les_arguments.length>0){
         les_arguments=les_arguments.substr(1);
     }
 }

  t+=nom_de_la_fonction+'('+les_arguments+')';

 

 return {__xst:true,__xva:t};

}

/*
  =================================================================================== 
*/
function traite_operation_dans_ast_sql(element,niveau,parent,options){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);

 if(element.format && element.format==='binary'){
  
  if(element.operation){
     var operation = recupere_operateur_dans_sql_ast(element.operation);
  }else{
     return(logerreur({__xst:false,__xme:'0017 pas de champ operation : '+JSON.stringify(json_partiel(element))}));
  }
  if(element.left){

     var obj_gauche=recupere_element_de_ast_sql(element.left,niveau,parent,options);
     if(obj_gauche.__xst===true){
       
     }else{
         return(logerreur({__xst:false,__xme:'0034 traite_operation_dans_ast_sql recuperation element left : '+JSON.stringify(json_partiel(element))}));
     }
  }else{
     return(logerreur({__xst:false,__xme:'0032 pas de left trouve : '+JSON.stringify(json_partiel(element))}));
  }
  
  if(element.right){
     var obj_droite=recupere_element_de_ast_sql(element.right,niveau,parent,options);
     if(obj_droite.__xst===true){
       
     }else{
         return(logerreur({__xst:false,__xme:'0034 traite_operation_dans_ast_sql recuperation element right : '+JSON.stringify(json_partiel(element))}));
     }
  }else{
     return(logerreur({__xst:false,__xme:'0032 pas de right trouve : '+JSON.stringify(json_partiel(element))}));
  }
  
  t+=operation+'('+obj_gauche.__xva + ' , '+obj_droite.__xva+')';
  
 }else{
     return(logerreur({__xst:false,__xme:'0043 operation non binaire : '+JSON.stringify(json_partiel(element))}));
 }

 
 return {__xst:true,__xva:t};
 
 
}


/*
  =================================================================================== 
*/
function convertit_sql_update_sqlite_de_ast_vers_rev(element,niveau,parent,options){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 
// console.log('element ast select=' , element );
 
 t+='\n'+esp0+'modifier(';

 if(element.into){
  
    var obj1=recupere_element_de_ast_sql(element.into,niveau,parent,options);
    if(obj1.__xst===true){
        t+='\n'+esp0+esp1+esp1+obj1.__xva+'';
    }else{
      return(logerreur({__xst:false,__xme:'0279 convertit_sql_update_sqlite_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.into))+'"'}));
    }
  
 }else{
     return(logerreur({__xst:false,__xme:'0333 dans convertit_sql_update_sqlite_de_ast_vers_rev pas de into : '+JSON.stringify(json_partiel(element))}));
 }

 if(element.set && element.set.length>0){
  
     t+='\n'+esp0+esp1+esp1+',valeurs(';
     for(var i=0;i<element.set.length;i++){
         if(i>0){
             t+=','
         }
         var obj1=recupere_element_de_ast_sql(element.set[i],niveau,parent,options);
         if(obj1.__xst===true){
             t+='\n'+esp0+esp1+esp1+esp1+obj1.__xva+'';
         }else{
             return(logerreur({__xst:false,__xme:'0347 convertit_sql_update_sqlite_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.set[i]))+'"'}));
         }
      
      
     }
     t+='\n'+esp0+esp1+esp1+')';
  
  
 }else{
     return(logerreur({__xst:false,__xme:'0338 dans convertit_sql_update_sqlite_de_ast_vers_rev pas de set : '+JSON.stringify(json_partiel(element))}));
 }

 if(element.where && element.where.length>0){
     t+='\n'+esp0+esp1+',conditions(';
     for(var i=0;i<element.where.length;i++){
         var obj1=recupere_element_de_ast_sql(element.where[i],niveau,parent,options);
         if(obj1.__xst===true){
             t+='\n'+esp0+esp1+esp1+''+obj1.__xva+',';
         }else{
           return(logerreur({__xst:false,__xme:'0396 convertit_sql_update_sqlite_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.where[i]))+'"'}));
         }
     }
     t+='\n'+esp0+esp1+')';
 }




 t+='\n'+esp0+')';
 
 
 console.log('modifier element=',element);

 
 return {__xst:true,__xva:t};



}

/*
  =================================================================================== 
*/
function convertit_sql_delete_sqlite_de_ast_vers_rev(element,niveau,parent,options){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+='\n'+esp0+'supprimer(';
    
    if(element.from){
     
        if(element.from.type==='identifier'){
        
            if(element.from.variant && element.from.variant==='table'){
                t+=CRLF+'    nom_de_la_table('+element.from.name+')';
            }
        }else{
         
            return(logerreur({__xst:false,__xme:'0483 convertit_sql_insert_sqlite_de_ast_vers_rev element.into.type different de identifier : "'+JSON.stringify(json_partiel(element))+'"'}));
            
        }

     
    }else{
        return(logerreur({__xst:false,__xme:'0472 dans delete pas de from : '+JSON.stringify(json_partiel(element))}));
    }
    if(element.where && element.where.length>0){
        t+='\n'+esp0+esp1+',conditions(';
        for(var i=0;i<element.where.length;i++){
            var obj1=recupere_element_de_ast_sql(element.where[i],niveau,parent,options);
            if(obj1.__xst===true){
                t+='\n'+esp0+esp1+esp1+''+obj1.__xva+',';
            }else{
              return(logerreur({__xst:false,__xme:'0396 convertit_sql_update_sqlite_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.where[i]))+'"'}));
            }
        }
        t+='\n'+esp0+esp1+')';
    }
    
    t+=CRLF+esp0+')';

    return {__xst:true,__xva:t};
}    
/*
  =================================================================================== 
*/
function convertit_sql_insert_sqlite_de_ast_vers_rev(element,niveau,parent,options){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var tableau_des_champs=[];
    
   // console.log('element ast select=' , element );
    t+='\n'+esp0+'insérer(';
    if(element.into){
     
        if(element.into.type==='identifier'){
        
            if(element.into.format && element.into.format==='table'){
                t+='nom_de_la_table('+element.into.name+')';
                if(element.into.columns){
                 
                    for(var i=0;i<element.into.columns.length;i++){
                     tableau_des_champs.push(element.into.columns[i].name);
                    }
                 
                 
                }else{
                    return(logerreur({__xst:false,__xme:'0092 convertit_sql_insert_sqlite_de_ast_vers_rev pas de columns dans expression table : "'+JSON.stringify(json_partiel(element))+'"'}));
                }
            }else if(element.into.variant==='table' && element.into.type==='identifier'){
                t+='nom_de_la_table('+element.into.name+')';
            }else{
                return(logerreur({__xst:false,__xme:'0559 convertit_sql_insert_sqlite_de_ast_vers_rev : "'+JSON.stringify(json_partiel(element))+'"'}));
            }
        }else{
            return(logerreur({__xst:false,__xme:'0483 convertit_sql_insert_sqlite_de_ast_vers_rev element.into.type different de identifier : "'+JSON.stringify(json_partiel(element))+'"'}));
        }

     
    }else{
        return(logerreur({__xst:false,__xme:'0275 dans pas de into : '+JSON.stringify(json_partiel(element))}));
    }

    if(element.or){
        if(element.or==='ignore'){
             t+=',ignorer()';
        }
    }
    if(element.result && element.result.length>0){
        t+='\n'+esp0+esp1+esp1+',valeurs(';
        /*
          on ne prend que la première valeur
        */
        if(element.result[0].type==='expression'  && 'list'===element.result[0].variant ){
         
         
            if(element.result[0].expression && element.result[0].expression.length>0){

                for(var i=0;i<element.result[0].expression.length;i++){
                     if(i>0){
                         t+=',';
                     }
                     var obj1=recupere_element_de_ast_sql(element.result[0].expression[i],niveau,parent,options)
                     if(obj1.__xst===true){
                         t+=CRLF+'        affecte(champ(`'+tableau_des_champs[i]+'`) , '+obj1.__xva+')';
                     }else{
                         return(logerreur({__xst:false,__xme:'0142 recupere_element_de_ast_sql : '+JSON.stringify(json_partiel(element.result[0].expression[i]))}));
                     }
                }

            }else{
               return(logerreur({__xst:false,__xme:'0137 recupere_element_de_ast_sql pas de expression : "'+JSON.stringify(json_partiel(element))+'"'}));
            }
         
         
         
        }else{
            return(logerreur({__xst:false,__xme:'0483 convertit_sql_insert_sqlite_de_ast_vers_rev element.result[0].type different de expression : "'+JSON.stringify(json_partiel(element))+'"'}));
        }
        
        t+='\n'+esp0+esp1+esp1+')';
    }else if(element.result && element.result.type==='statement'){
        if(tableau_des_champs.length>0){
         t+=',valeurs(';
         for(var j=0;j<tableau_des_champs.length;j++){
             t+=CRLF+'        champ(`'+tableau_des_champs[j]+'`)';
         }
         t+=')';
        }
     
        var obj=conversion_de_ast_vers_sql(element.result,niveau,parent,options);
        if(obj.__xst===true){
            t+=',sql('+obj.__xva+')';
        }else{
            return(logerreur({__xst:false,__xme:'0141 convertion_sql "'+JSON.stringify(json_partiel(element))+'"'}));
        }
     
    }

    t+='\n'+esp0+')';
    
    return {__xst:true,__xva:t};
}

/*
  =================================================================================== 
*/
function convertit_sql_select_sqlite_de_ast_vers_rev(element,niveau,parent,options){
 
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 
// console.log('element ast select=' , element );
 
 t+='\n'+esp0+'sélectionner(';
 
 
 if(element.result && element.result.length>0){
     t+='\n'+esp0+esp1+'valeurs(';
     for(var i=0;i<element.result.length ; i++){
//         console.log(element.result[i])
         var obj1=recupere_element_de_ast_sql(element.result[i],niveau,parent,options);
         if(obj1.__xst===true){
             t+='\n'+esp0+esp1+esp1+obj1.__xva+',';
         }else{
           return(logerreur({__xst:false,__xme:'0226 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element))+'"'}));
         }
     }
     t+='\n'+esp0+esp1+')';
 }else{
     return(logerreur({__xst:false,__xme:'0050 dans select il n\'y a pas de result trouvé : '+JSON.stringify(json_partiel(element.result[i]))}));
 }

 if(element.from){
     t+='\n'+esp0+esp1+',provenance(';

     if(element.from.source){
         var obj1=recupere_element_de_ast_sql(element.from.source,niveau,parent,options);
         if(obj1.__xst===true){
             t+='\n'+esp0+esp1+esp1+'table_reference(source('+obj1.__xva+')),';
         }else{
           return(logerreur({__xst:false,__xme:'0669 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.from.source))+'"'}));
         }
       
     }else{
         var obj1=recupere_element_de_ast_sql(element.from,niveau,parent,options);
         if(obj1.__xst===true){
             t+='\n'+esp0+esp1+esp1+'table_reference(source('+obj1.__xva+')),';
         }else{
           return(logerreur({__xst:false,__xme:'0677 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.from.source))+'"'}));
         }
     }
     
     if(element.from.map && element.from.map.length>0){
      for(var i=0;i<element.from.map.length;i++){
         var obj1=recupere_element_de_ast_sql(element.from.map[i],niveau,parent,options);
         if(obj1.__xst===true){
             t+='\n'+esp0+esp1+esp1+''+obj1.__xva+',';
         }else{
           return(logerreur({__xst:false,__xme:'0257 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.from.map[i]))+'"'}));
         }
      }
      
      
     }

     t+='\n'+esp0+esp1+')';
 }
 if(element.where && element.where.length>0){
     t+='\n'+esp0+esp1+',conditions(';
     for(var i=0;i<element.where.length;i++){
         var obj1=recupere_element_de_ast_sql(element.where[i],niveau,parent,options);
         if(obj1.__xst===true){
             t+='\n'+esp0+esp1+esp1+''+obj1.__xva+',';
         }else{
           return(logerreur({__xst:false,__xme:'0325 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.where[i]))+'"'}));
         }
     }
     t+='\n'+esp0+esp1+')';
 }
 if(element.order && element.order.length>0){
     t+='\n'+esp0+esp1+',trier_par(';
     for(var i=0;i<element.order.length;i++){
        var obj1=recupere_element_de_ast_sql(element.order[i],niveau,parent,options);
        if(obj1.__xst===true){
            t+=obj1.__xva+',';
        }else{
          return(logerreur({__xst:false,__xme:'0340 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.order[i]))+'"'}));
        }
     }
     t+=')';
     
 }
 if(element.limit){
     t+='\n'+esp0+esp1+',limité_à(';
     if(element.limit.start){
        var obj1=recupere_element_de_ast_sql(element.limit.start,niveau,parent,options);
        if(obj1.__xst===true){
            t+='quantité('+obj1.__xva+'),';
        }else{
          return(logerreur({__xst:false,__xme:'0340 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.limit.start))+'"'}));
        }
     }
     if(element.limit.offset){
        var obj1=recupere_element_de_ast_sql(element.limit.offset,niveau,parent,options);
        if(obj1.__xst===true){
            t+='début('+obj1.__xva+')';
        }else{
          return(logerreur({__xst:false,__xme:'0349 convertit_sql_select_de_ast_vers_rev  : "'+JSON.stringify(json_partiel(element.limit.offset))+'"'}));
        }
     }
     t+=')';
  
 }
 
 t+='\n'+esp0+'),';


 return {__xst:true,__xva:t};
 
 
}

/*
  =================================================================================== 
*/
function conversion_de_ast_vers_sql(element,niveau,parent,options={}){
 
 
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 element.en_cours_de_traitement=true;
 if(element.traite && element.traite===true){
     return {__xst:true,__xva:''};
 }
 element.traite=false;

 if(element.type==='statement' && element.variant==='list'){
  
     for(var i=0;i<element.statement.length;i++){
      
         var obj1=conversion_de_ast_vers_sql(element.statement[i],niveau,element,{});
         if(obj1.__xst===true){
          
             t+=obj1.__xva;
             
         }else{
          
             return(logerreur({__xst:false,__xme:'0023 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(element.statement[i]))}));
             
         }
         
     }
     element.traite=true;
     element.en_cours_de_traitement=false;
  
  
 }else if(element.type==='statement' && element.variant==='update' ){
  
     /*
     ========================================================================================
      UPDATE
     ========================================================================================
     */
     
     
     var obj=convertit_sql_update_sqlite_de_ast_vers_rev(element,niveau,null,options);
     if(obj.__xst===true){
         t+=obj.__xva;
     }else{
         return(logerreur({__xst:false,__xme:'0516 erreur conversion_de_ast_vers_sql dans un update  : '+JSON.stringify(json_partiel(element))}));
     }
     
     
 }else if(element.type==='statement' && element.variant==='insert' ){
  
     /*
     ========================================================================================
      INSERT
     ========================================================================================
     */
     
     
     var obj=convertit_sql_insert_sqlite_de_ast_vers_rev(element,niveau,null,options);
     if(obj.__xst===true){
         t+=obj.__xva;
     }else{
         return(logerreur({__xst:false,__xme:'0054 erreur conversion_de_ast_vers_sql dans un insert  : '+JSON.stringify(json_partiel(element))}));
     }
     
     
 }else if(element.type==='statement' && element.variant==='delete' ){
  
     /*
     ========================================================================================
      DELETE
     ========================================================================================
     */
     
     
     var obj=convertit_sql_delete_sqlite_de_ast_vers_rev(element,niveau,null,options);
     if(obj.__xst===true){
         t+=obj.__xva;
     }else{
         return(logerreur({__xst:false,__xme:'0054 erreur conversion_de_ast_vers_sql dans un insert  : '+JSON.stringify(json_partiel(element))}));
     }
     
     
 }else if(element.type==='statement' && element.variant==='select' ){
  
     /*
     ========================================================================================
      SELECT
     ========================================================================================
     */
     
     
     var obj=convertit_sql_select_sqlite_de_ast_vers_rev(element,niveau,null,options);
     if(obj.__xst===true){
         t+=obj.__xva;
     }else{
         return(logerreur({__xst:false,__xme:'0054 erreur conversion_de_ast_vers_sql dans un select  : '+JSON.stringify(json_partiel(element))}));
     }
     
     
     
 }else if(element.type==='statement' && element.variant==='create' && element.format==='index'){
  
     /*
     ========================================================================================
      CREATE index
     ========================================================================================
     */
     t+='\n'+esp0+'ajouter_index(';
     if(element.on && element.on.name){
      t+='sur_table(`'+element.on.name+'`)';
     }else{
         return(logerreur({__xst:false,__xme:'0048 conversion_de_ast_vers_sql nom de la table de l\'index nn trouvé : '+JSON.stringify(json_partiel(element))}));
     }
     if(element.unique && element.unique===true){
      t+=',unique()';
     }

     if(element.target && element.target.name){
         t+=',index_name(`'+element.target.name+'`)';
     }else{
         return(logerreur({__xst:false,__xme:'0048 conversion_de_ast_vers_sql nom de l\'index nn trouvé : '+JSON.stringify(json_partiel(element))}));
     }
     if(element.on && element.on.columns && element.on.columns.length>0){
      t+=',champs(';
      for(var i=0;i<element.on.columns.length;i++){
       if(i>0){
        t+=',';
       }
       t+='`'+element.on.columns[i].name+'`';
      }
      t+=')';
      
     }else{
         return(logerreur({__xst:false,__xme:'0061 conversion_de_ast_vers_sql champs de l\'index nn trouvé : '+JSON.stringify(json_partiel(element))}));
     }


     
     t+=')';
  
 }else if(element.type==='statement' && element.variant==='create' && element.format==='table'){
  
     /*
     ========================================================================================
      CREATE TABLE
     ========================================================================================
     */
  
     t+='\n'+esp0+'créer_table(';
     if(element.name){
         if(element.name.type==="identifier"){
             t+='\n'+esp0+esp1+'nom_de_la_table('+element.name.name+')';
         }else{
            return(logerreur({__xst:false,__xme:'0034 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(element))}));
         }
     }else{
         return(logerreur({__xst:false,__xme:'0036 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(element))}));
     }
     if( element.definition && element.definition.length > 0 ){
         t+='\n'+esp0+esp1+'champs(';
         for(var i=0;i<element.definition.length;i++){
             t+='\n'+esp0+esp1+esp1+'field(';
             if(element.definition[i].definition){
                 if( element.definition[i].type==='definition' &&  element.definition[i].variant==="column" ){
                     t+='nom_du_champ(`'+element.definition[i].name+'`)';  
                 }else{
                     return(logerreur({__xst:false,__xme:'0062 pas définition de champ trouvé dans create_table field : '+JSON.stringify(json_partiel(element.definition[i]))}));
                 }
                  
              
             }else{
                 return(logerreur({__xst:false,__xme:'0060 pas définition de champ trouvé dans create_table field : '+JSON.stringify(json_partiel(element.definition[i]))}));
             }
             if(element.definition[i].datatype){
                 t+=' , type('+element.definition[i].datatype.variant;
                 if(element.definition[i].datatype.args){
                  t+=',';
                  for(var j=0;j<element.definition[i].datatype.args.expression.length;j++){
                      if(j>0){
                          t+=',';
                      }
                      if(element.definition[i].datatype.args.expression[j].type==='literal'){
                          t+=element.definition[i].datatype.args.expression[j].value;
                      }else{
                          return(logerreur({__xst:false,__xme:'0077 problème sur un argument : '+JSON.stringify(json_partiel(element.definition[i]))}));
                      }
                  }
                  t+='';
                 }
                 t+=')'
             }else{
                 return(logerreur({__xst:false,__xme:'0071 pas type de données trouvé field : '+JSON.stringify(json_partiel(element.definition[i]))}));
             }
             if(element.definition[i].definition && element.definition[i].definition.length>=1){
                 for(var j=0;j<element.definition[i].definition.length;j++){
                     if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "primary key"){
                         t+=' , primary_key()'
                     }
                     if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].hasOwnProperty('autoIncrement')  && element.definition[i].definition[j].autoIncrement  === true){
                         t+=' , auto_increment()'
                     }
                     if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "not null"){
                         t+=' , not_null()'
                     }
                     if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "default" && element.definition[i].definition[j].value){
                         if(element.definition[i].definition[j].value.type==='literal'){
                          t+=' , default(\''+element.definition[i].definition[j].value.value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')'
                         }else{
                           return(logerreur({__xst:false,__xme:'0099 contrainte non traitée trouvé value : '+JSON.stringify(json_partiel(element.definition[i]))}));
                         }
                         
                     }
                     if(element.definition[i].definition[j].type==="constraint" && element.definition[i].definition[j].variant === "foreign key" && element.definition[i].definition[j].references){
                         t+=' , references('
                         if(element.definition[i].definition[j].references.name){
                          t+='`'+element.definition[i].definition[j].references.name+'`,'
                          if(element.definition[i].definition[j].references.columns && element.definition[i].definition[j].references.columns.length===1){
                            t+='`'+element.definition[i].definition[j].references.columns[0].name+'`'
                          }else{
                              return(logerreur({__xst:false,__xme:'0109 contrainte non traitée trouvé field : '+JSON.stringify(json_partiel( element.definition[i].definition[j].references))}));
                          }
                         }else{
                         }
                         t+=')'
                     }
                  
                  
                 }
             }
             t+=')';
         }
         t+='\n'+esp0+esp1+')';
      
     }else{
         return(logerreur({__xst:false,__xme:'0061 pas de champs trouvés dans create_table : '+JSON.stringify(json_partiel(element))}));
     }
//     debugger;
     t+='\n'+esp0+')'
  
 }else if(element.type==='statement' && element.variant==='transaction' && element.action==='rollback'){
     t+='\nrollback()';
 }else if(element.type==='statement' && element.variant==='transaction' && element.action==='commit'){
     t+='\ncommit()';
 }else if(element.type==='statement' && element.variant==='transaction' && element.action==='begin'){
  
     /*
     ========================================================================================
     BEGIN TRANSACTION
     pour un début de transaction, on continue jusqu'à un commit ou un rollback
     ========================================================================================
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
                 
                 
                 return({__xst:true,__xva:t});
             }else if(parent.statement[i].type==='statement' && parent.statement[i].variant==='transaction' && parent.statement[i].action==='rollback' ){
                 /*
                 fin de transaction par un rollback
                 */
                 t+='\n'+esp0+')';
                 t+='\n'+esp0+'rollback()';
                 
                 parent.statement[i].en_cours_de_traitement=false;
                 parent.statement[i].traite=true;
                 
                 return({__xst:true,__xva:t});
             }else{
                 /*
                 autres éléments, on continue
                 */
                 var obj1=conversion_de_ast_vers_sql(parent.statement[i],niveau+1,parent,{});
                 parent.statement[i].en_cours_de_traitement=false;
                 parent.statement[i].traite=true;
                 if(obj1.__xst===true){
                     t+=obj1.__xva;
                 }else{
                     return(logerreur({__xst:false,__xme:'0070 conversion_de_ast_vers_sql : '+JSON.stringify(json_partiel(parent.statement[i]))}));
                 }
             }
         }
     }
     t+='\n'+esp0+')';
  
  
  
 }else{
    return(logerreur({__xst:false,__xme:'0733 erreur de conversion de ast vers rev type/variant non prévu : '+JSON.stringify(json_partiel(element))}));
 }
 element.en_cours_de_traitement=false;
 element.traite=true;


 return {__xst:true,__xva:t};

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
    }else if(json_obj[i]===true){
        a[i]='true';
    }else if(json_obj[i]===false){
        a[i]='false';
    }else{
        a[i]={};
        
        for(var j in json_obj[i]){
          if(typeof json_obj[i][j] === 'string'){
           a[i][j]=json_obj[i][j];
          }else{
           a[i][j]='...';
          }
        }
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
// var sqliteParser = require('sqlite-parser'); 
 var ast=window.sqliteParser(texte_du_sql);
 console.log('ast=',ast);

 var obj1=conversion_de_ast_vers_sql(ast,0,null,{});
 
 if(obj1.__xst===true){
    return {__xst:true,__xva:obj1.__xva};
 }else{
    return(logerreur({__xst:false,__xme:'0026 erreur de conversion de ast vers rev'}));
 }
 
}


/*
=====================================================================================================================
*/

function charger_source_de_test_sql(nom_de_la_textarea){
 var t=`
    

  delete FROM ma_belle_table where (x = 1 and y=2) or z=3;
    
/*    

UPDATE ma_belle_table SET champ1 = NULL , c2=1 , c3=(3+5) where ((x = 1 and y=2) or z=3);

INSERT INTO ma_belle_table(a,b,c) values( 1 , '2' , null ),(4,5,6),(1+2,3,4);

  


SELECT "T0".\`chi_id_dossier\` , \`chp_nom_dossier\` , \`chx_cible_dossier\` , T1.chp_dossier_cible , * , a+2,
concat( '=>' , \`chi_id_dossier\` , '<=') , count(*) , 5
FROM \`tbl_dossiers\` T0, 
      tata T2
      LEFT JOIN tbl_cibles   T1 ON T1.chi_id_cible  = T0.\`chx_cible_dossier\`
WHERE \`T0\`.\`chi_id_dossier\` = 1 and t2.id=t0.chi_id_dossier
ORDER BY chp_nom_dossier DESC , chx_cible_dossier ASC
LIMIT roro OFFSET 3;



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
*/
  `;
 document.getElementById(nom_de_la_textarea).value=t;
 
}

/*
=====================================================================================================================
*/
function charger_le_dernier_source_sql(nom_de_la_textarea){
    var fta_traiteSql_dernier_fichier_charge=localStorage.getItem("fta_traiteSql_dernier_fichier_charge");
    if(fta_traiteSql_dernier_fichier_charge!==null){
        document.getElementById(nom_de_la_textarea).value=fta_traiteSql_dernier_fichier_charge;
    }
}
/*
=====================================================================================================================
*/
function transform_rev_de_textarea_en_sql( nom_de_la_textarea_rev , nom_de_la_textarea_sql){
    var tableau1 = iterateCharacters2(document.getElementById(nom_de_la_textarea_rev).value);
    var obj1=functionToArray2(tableau1.out,false,true,'');
    if(obj1.__xst===true){
        var obj2=tabToSql1(obj1.__xva,0 , 0 , false);
        if(obj2.__xst===true){
          obj2.__xva=obj2.__xva.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'');
          document.getElementById(nom_de_la_textarea_sql).value=obj2.__xva;
          __gi1.remplir_et_afficher_les_messages1('zone_global_messages',nom_de_la_textarea_sql);
          return;
        }
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages',nom_de_la_textarea_rev);
}
/*
=====================================================================================================================
*/
function transform_sql_de_textarea_en_rev(nom_de_la_textarea_sql , nom_de_la_textarea_rev){
 
    __gi1.raz_des_messages();
    var texte=document.getElementById(nom_de_la_textarea_sql).value;
    localStorage.setItem('fta_traiteSql_dernier_fichier_charge',texte);
    try{
        var obj=convertion_texte_sql_en_rev(texte);
        if(obj.__xst===true){
            document.getElementById(nom_de_la_textarea_rev).value=obj.__xva;
            
            var tableau1 = iterateCharacters2(obj.__xva);
            var obj1=functionToArray2(tableau1.out,false,true,'');
            if(obj1.__xst===true){
                var obj2=tabToSql1(obj1.__xva,0 , 0 , false);
                if(obj2.__xst===true){
                      logerreur({__xst:true,__xme:'sql => rev ok et rev => sql  OK'});
                    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
                    obj2.__xva=obj2.__xva.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'');
                    document.getElementById('txtar3').value=obj2.__xva;
                }else{
                    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
                    return;
                }
            }else{
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages',nom_de_la_textarea_rev);
                return;
            }
         
         
         
        }else{
            logerreur({__xst:false,__xme:'erreur de reconstruction du sql'});
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',nom_de_la_textarea_sql);
            return;
        }
    }catch(e){
       debugger
       console.error('e=',e);
       logerreur({__xst:false,__xme:'erreur dans le sql'});
       if(e.hasOwnProperty('location') && e.location.hasOwnProperty('start') && e.location.start.hasOwnProperty('line') && e.location.start.line>0 ){
           logerreur({__xst:false,line:e.location.start.line});
       }
       __gi1.remplir_et_afficher_les_messages1('zone_global_messages',nom_de_la_textarea_sql);
       return;
    }
 
}