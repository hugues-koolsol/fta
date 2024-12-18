"use strict";
/*
  =====================================================================================================================
  conversion d'un ast produit par https://github.com/glayzzle/php-parser en rev
  point d'entrée = traite_ast
  =====================================================================================================================
*/
class module_conversion_ast_de_php_parser_vers_rev1{
     #nom_de_la_variable='';
    /*
      =============================================================================================================
      le seul argument est pour l'instant le nom de la variable qui est déclarée
    */
    constructor(nom_de_la_variable,nom_de_la_div_contenant_les_messages){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    
    /*
      =====================================================================================================================
    */
    #astphp_logerreur(o){
        logerreur(o);
/*
        if(global_messages.ranges.length <= 3){
            if(o.element
             && o.element.hasOwnProperty('attributes')
             && o.element.attributes.hasOwnProperty('startTokenPos')
             && o.element.attributes.hasOwnProperty('endTokenPos')
            ){
                global_messages['ranges'].push([o.element.attributes.startFilePos,o.element.attributes.endFilePos]);
            }
        }
        if(o.hasOwnProperty('element')){
            console.log('%cerreur element=','background:yellow;color:hotpink;',o.element);
        }
*/        
        return o;
    }
    /*
      =====================================================================================================================
    */
    #traite_call(element,niveau,parent,tab_comm){
        let t=this.#traite_commentaires_debut(element,niveau,parent,tab_comm);
        var obj=null;
        var nomFonction='';
        var lesArguments='';
        obj=this.#traite_element(element.what,niveau,element,tab_comm);
        if(obj.__xst === true){
            nomFonction+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0051  #traite_call' ,"element" : element.what}));
        }
        
        if(element.arguments && element.arguments.length > 0){
            for( var i=0 ; i < element.arguments.length ; i++ ){
                var obj=this.#traite_element(element.arguments[i],niveau,element,tab_comm);
                if(obj.__xst === true){
                    lesArguments+=',p(' + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_call' ,"element" : element.arguments[i]}));
                }
            }
        }
        t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
        
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_include(element,niveau,parent,tab_comm){
        let t='';
        var obj=null;
        if(element.once && element.require ){
            var obj=this.#traite_element(element.target,niveau,element,tab_comm);
            if(obj.__xst === true){
                t+='appelf(nomf(require_once),p(' + obj.__xva + '))';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_include' ,"element" : element}));
            }
        }else{
            t+='#(💥 TODO #traite_include cas non prévu '+JSON.stringify(element)+')';
        }
        
        return({__xst : true , __xva : t})
    }
    
    /*
      =====================================================================================================================
    */
    #traite_inline(element,niveau,parent,tab_comm){
        let t='';
        t+='html_dans_php(\'<!-- TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO -->\')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_isset(element,niveau,parent,tab_comm){
        let t=''
        let les_variables='';
        let obj=null;
        for(let i=0;i<element.variables.length;i++){
            les_variables+=',';
            obj=this.#traite_element(element.variables[i],niveau,element,tab_comm);
            if(obj.__xst === true){
                les_variables+='p(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_include' ,"element" : element}));
            }
        }
        t+='appelf(nomf(isset)' + les_variables + ')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_unset(element,niveau,parent,tab_comm){
        let t=''
        let les_variables='';
        let obj=null;
        for(let i=0;i<element.variables.length;i++){
            les_variables+=',';
            obj=this.#traite_element(element.variables[i],niveau,element,tab_comm);
            if(obj.__xst === true){
                les_variables+='p(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0053  #traite_include' ,"element" : element}));
            }
        }
        t+='appelf(nomf(unset)' + les_variables + ')';
        return({__xst : true , __xva : t})
    }
    
    /*
      =====================================================================================================================
    */
    #traite_print(element,niveau,parent,tab_comm){
        let t='';
        t+='#(💥 TODO #traite_print à développer '+element.kind+')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_if(element,niveau,parent,tab_comm,est_alternate){
        let t='';
        let obj=null;
        let condition='';
        let c_est_un_sinon=false;
        let contenu='';
        let suite='';
        
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau+1,element,tab_comm);
            if(obj.__xst===true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body'}));
            }
        }else if(element.kind==='block'){
            obj=this.#traite_ast0(element,niveau+1,element,tab_comm);
            if(obj.__xst===true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body'}));
            }
        }

        if(element.alternate){
           obj=this.#traite_if(element.alternate,niveau,element,tab_comm,true);
           if(obj.__xst === true){
               suite+=obj.__xva;
           }else{
               return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0148  #traite_if' ,"element" : element}));
           }
        }        
        if(element.test){
           /* c'est un if ou un else if */
           obj=this.#traite_element(element.test,niveau,element,tab_comm);
           if(obj.__xst === true){
               condition+=obj.__xva;
           }else{
               return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0157  #traite_if' ,"element" : element}));
           }
        }else{
           c_est_un_sinon=true;
          /* c'est un else */
        }
        
        if(est_alternate){
          /* sinon si ou sinon */
          if(c_est_un_sinon){
            t+='  sinon(';
            t+='    alors('+contenu+')';
            t+='  )';
          }else{
            t+='  sinonsi(';
            t+='    condition('+condition+')';
            t+='    alors('+contenu+')';
            t+='  )';
            t+=suite;
          }
        }else{
            t+='choix(';
            t+='  si(';
            t+='    condition('+condition+')';
            t+='    alors('+contenu+')';
            t+='  )';
            t+=suite;
            t+=')';
        }
        
        
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #simplifie_tableau(nom_variable,parametres){
        var t='';
        var obj_nom_tableau = functionToArray(nom_variable,true,true,'');
        if(obj_nom_tableau.__xst === true){
            if(obj_nom_tableau.__xva.length === 2
             && obj_nom_tableau.__xva[1][2] === 'c'
             && obj_nom_tableau.__xva[1][4] === 0
             && obj_nom_tableau.__xva[1][1].substr(0,1) === '$'
            ){
                /*
                  cas $xxx
                */
                if(parametres.substr(0,1) === ','){
                    parametres=parametres.substr(1);
                }
                var obj_indice_tableau = functionToArray(parametres,true,true,'');
                if(obj_indice_tableau.__xst === true
                 && obj_indice_tableau.__xva.length === 3
                 && obj_indice_tableau.__xva[1][1] === 'p'
                 && obj_indice_tableau.__xva[1][2] === 'f'
                 && obj_indice_tableau.__xva[1][8] === 1
                 && obj_indice_tableau.__xva[2][2] === 'c'
                 && obj_indice_tableau.__xva[2][4] === 0
                ){
                    t=obj_nom_tableau.__xva[1][1] + '[' + obj_indice_tableau.__xva[2][1] + ']';
                }else{
                    t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                }
            }else if(obj_nom_tableau.__xva.length === 3
             && obj_nom_tableau.__xva[2][2] === 'c'
             && obj_nom_tableau.__xva[1][8] === 1
             && obj_nom_tableau.__xva[1][1] === 'nomt'
            ){
                /*
                  cas nomt($xxx)
                */
                if(parametres.substr(0,1) === ','){
                    parametres=parametres.substr(1);
                }
                var obj_indice_tableau = functionToArray(parametres,true,true,'');
                if(obj_indice_tableau.__xst === true
                 && obj_indice_tableau.__xva.length === 3
                 && obj_indice_tableau.__xva[1][1] === 'p'
                 && obj_indice_tableau.__xva[1][2] === 'f'
                 && obj_indice_tableau.__xva[1][8] === 1
                 && obj_indice_tableau.__xva[2][2] === 'c'
                 && obj_indice_tableau.__xva[2][4] === 0
                ){
                    t=obj_nom_tableau.__xva[2][1] + '[' + obj_indice_tableau.__xva[2][1] + ']';
                }else{
                    t='tableau(' + nom_variable + '' + parametres + ')';
                }
            }else{
                /* si */
                if(nom_variable.substr(0,4) === 'nomt'){
                    var ne_contient_que_des_nomt_et_p=true;
                    for( var i=1 ; i < obj_nom_tableau.__xva.length ; i++ ){
                        if(obj_nom_tableau.__xva[i][7] === 0){
                            if(obj_nom_tableau.__xva[i][2] === 'f' && (obj_nom_tableau.__xva[i][1] === 'nomt' || obj_nom_tableau.__xva[i][1] === 'p')){
                            }else{
                                ne_contient_que_des_nomt_et_p=false;
                            }
                        }
                    }
                    if(ne_contient_que_des_nomt_et_p === true){
                        t='tableau(' + nom_variable + '' + parametres + ')';
                    }else{
                        t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                    }
                }else{
                    t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                }
            }
        }else{
            t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
        }
        return t;
    }
    /*
      =====================================================================================================================
    */
    #traite_deftab(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let obj1=null;
        let les_elements='';
        for(let i=0;i<element.items.length;i++){
            les_elements+=',';
            if(element.items[i].kind==='entry'){
                obj=this.#traite_element(element.items[i].value,niveau,element,tab_comm);
                if(obj.__xst===true){
                 
                    if(element.items[i].key){
                        obj1=this.#traite_element(element.items[i].key,niveau,element,tab_comm);
                        if(obj1.__xst===true){
                            les_elements+='('+obj1.__xva+','+obj.__xva+')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0317 #traite_deftab '}));
                        }
                    }else{
                        les_elements+='('+obj.__xva+')';
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0312 #traite_deftab '}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0315 #traite_deftab '}));
            }

        }
        if(les_elements.length>1){
         les_elements=les_elements.substr(1);
        }
        t+='defTab('+les_elements+')'
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_tableau(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let quoi='';
        let offset='';
        debugger
        obj=this.#traite_element(element.what,niveau,parent,tab_comm);
        if(obj.__xst===true){
            quoi+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_tableau quoi'}));
        }


        obj=this.#traite_element(element.offset,niveau,parent,tab_comm);
        if(obj.__xst===true){
            offset+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_tableau offset'}));
        }
        
        t=this.#simplifie_tableau( 'nomt('+quoi+')' , 'p('+offset+')' )
        
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_assign(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';

        if(element.left && element.right){
         
            obj=this.#traite_element(element.left,niveau,element,tab_comm);
            if(obj.__xst===true){
                gauche+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0341 #traite_assign gauche'}));
            }
            obj=this.#traite_element(element.right,niveau,element,tab_comm);
            if(obj.__xst===true){
                droite+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0347 #traite_assign droite'}));
            }
            if(element.operator==='='){
             t+='affecte('+gauche+','+droite+')';
            }else if(element.operator==='+='){
             t+='affecte('+gauche+',plus('+gauche+','+droite+'))';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0334 #traite_assign opérateur non traité : "'+element.operator+'"'}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0334 #traite_assign il manque un gauche ou un droite : "'+element.type+'"'}));
        }
        
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_bin(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';

        if(element.left){
            obj=this.#traite_element(element.left,niveau,element,tab_comm);
            if(obj.__xst===true){
                gauche+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0329 #traite_bin gauche'}));
            }
        }
        if(element.right){
            obj=this.#traite_element(element.right,niveau,element,tab_comm);
            if(obj.__xst===true){
                droite+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0335 #traite_bin droite'}));
            }
        }        
        if(element.type==='&&'){
            t+='et('+gauche+','+droite+')';
        }else if(element.type==='||'){
            t+='ou('+gauche+','+droite+')';
        }else if(element.type==='>'){
            t+='sup('+gauche+','+droite+')';
        }else if(element.type==='+'){
            t+='plus('+gauche+','+droite+')';
        }else if(element.type==='*'){
            t+='mult('+gauche+','+droite+')';
        }else if(element.type==='.'){
            t+='concat('+gauche+','+droite+')';
        }else if(element.type==='!=='){
            t+='diffstricte('+gauche+','+droite+')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0346 #traite_bin non traité : "'+element.type+'"'}));
        }
        
        
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_element(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        
        if(parent.kind==='if'){
            t+=this.#traite_commentaires_dans_bloc(parent,niveau,parent,tab_comm);
        }else{
            t+=this.#traite_commentaires_debut(element,niveau,parent,tab_comm);
        }
        
        switch(element.kind){
         
            case 'magic' :
                t+=element.raw;
                break;
                
            case 'boolean' :
                t+=element.raw;
                break;
                
            case 'number':
                t+=element.value;
                break;
                
            case 'name':
                t+=element.name;
                break;
            
            case 'identifier':
                /* par exemple un nom de fonction à appeler */

                t+=element.name;
                break;
            
            case 'variable':
                t+='$'+element.name;
                break;
            
            case 'offsetlookup':
                obj=this.#traite_tableau(element,niveau,parent,tab_comm)
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_element include'}));
                }
                break;
            
            case 'string':
                if( element.isDoubleQuote===true && element.raw.substr(0,1) === '"' ){
                    /* guillemets */
                    t+=element.raw; 
                }else if( element.isDoubleQuote===false &&  element.raw.substr(0,1) === '\'' ){
                    /* apostrophes */
                    t+=element.raw; 
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0168 #traite_element string type non prévu "'+JSON.stringify(element)+'"'}));
                }
                break;
            
            
            case 'call':
                obj=this.#traite_call(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0178 #traite_element call'}));
                }
                break;

            case 'include' :
                obj=this.#traite_include(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_element include'}));
                }
                break;
                
            case 'print' :
                obj=this.#traite_print(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0132 #traite_element print'}));
                }
                break;
                
            case 'call' :
                obj=this.#traite_call(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0166 #traite_element call'}));
                }
                break;
            
            case 'assign' :
                obj=this.#traite_assign(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0182 #traite_element assign'}));
                }
                break;
                
            case 'function' :
                obj=this.#traite_function(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 function'}));
                }
                break;
            
            case 'unset' :
                obj=this.#traite_unset(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 unset'}));
                }
                break;
            
            case 'isset' :
                obj=this.#traite_isset(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0484 #traite_ast0 isset'}));
                }
                break;
            
            case 'inline' :
                obj=this.#traite_inline(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 inline'}));
                }
                break;
                
            case 'bin' :
                obj=this.#traite_bin(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 bin'}));
                }
                break;
                
            case 'array' :
                obj=this.#traite_deftab(element,niveau,parent,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 bin'}));
                }
                break;
                

            default :
               t+='#(266 💥💥💥 TODO non prévu dans #traite_element pour kind = '+element.kind+')';
               break;
        }
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_expression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        

        switch(element.kind){
            
            
            case 'expressionstatement':
            
            
                obj=this.#traite_element(element.expression,niveau,element,tab_comm);
                if(obj.__xst===true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_expression include'}));
                }
                break;
            
            
            default :
               t+='#(0245 💥💥💥 TODO non prévu dans #traite_expression pour kind = '+element.kind+')';
               break;
            
                
       
        }
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_function(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let contenu='';
        let nom_fonction='';
        let lesArguments='';

        obj=this.#traite_element(element.name,niveau,element,tab_comm);
        
        if(obj.__xst===true){
            nom_fonction+=obj.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0135 #traite_function nom'}));
        }
        
        for(let i=0;i<element.arguments.length;i++){
            lesArguments+=','
            debugger
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau+1,element,tab_comm);
            if(obj.__xst===true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body'}));
            }
        }
        if(lesArguments!==''){
            lesArguments=lesArguments.substr(1);
        }
        t+='fonction(';
        t+=   'definition(';
        t+=      'nom(' + nom_fonction + ')';
        t+=      lesArguments;
        t+=   '),';
        t+=   'contenu(\n';
        t+=      contenu;
        t+=  ')';
        t+=')';
        
        
        
        return({__xst : true , __xva : t})
    }
    
    /*
      =====================================================================================================================
    */
    #traite_commentaires_fin(element,niveau,parent,tab_comm){
        var t='';
        var position_de_fin=element.loc.end.offset;
        var commentaires_a_retirer=[];
        for(var i=0;i<tab_comm.length;i++){
            if(tab_comm[i].loc.end.offset<=position_de_fin){
                commentaires_a_retirer.push(i);
                if(tab_comm[i].kind==='commentline'){
                    t+='#( '+tab_comm[i].value.trim().substr(2).trim()+' )';
                }else{
                    t+='#('+tab_comm[i].value.substr(2,tab_comm[i].value.length-4)+')';
                }
            }
        }
        for(var i=commentaires_a_retirer.length-1;i>=0;i--){
         tab_comm.splice(commentaires_a_retirer[i],1);
        }
        return t;
    }
    
    /*
      =====================================================================================================================
    */
    #traite_commentaires_debut(element,niveau,parent,tab_comm){
        var t='';
        var position_de_debut=element.loc.start.offset;
        var commentaires_a_retirer=[];
        for(var i=0;i<tab_comm.length;i++){
            if(tab_comm[i].loc.end.offset<=position_de_debut){
                commentaires_a_retirer.push(i);
                if(tab_comm[i].kind==='commentline'){
                    t+='#( '+tab_comm[i].value.trim().substr(2).trim()+' )';
                }else{
                    t+='#('+tab_comm[i].value.substr(2,tab_comm[i].value.length-4)+')';
                }
            }
        }
        for(var i=commentaires_a_retirer.length-1;i>=0;i--){
         tab_comm.splice(commentaires_a_retirer[i],1);
        }
        return t;
    }
    /*
      =====================================================================================================================
    */
    #traite_commentaires_dans_bloc(element,niveau,parent,tab_comm){
        var t='';
        var position_de_debut_bloc=parent.loc.start.offset;
        var position_de_fin_bloc=parent.loc.end.offset;
        var position_de_debut_elem=element.loc.start.offset;
        var commentaires_a_retirer=[];
        for(var i=0;i<tab_comm.length;i++){
            if(tab_comm[i].loc.start.offset>=position_de_debut_bloc && tab_comm[i].loc.end.offset<=position_de_fin_bloc && tab_comm[i].loc.end.offset<position_de_debut_elem){
                commentaires_a_retirer.push(i);
                if(tab_comm[i].kind==='commentline'){
                    t+='#( '+tab_comm[i].value.trim().substr(2).trim()+' )';
                }else{
                    t+='#('+tab_comm[i].value.substr(2,tab_comm[i].value.length-4)+')';
                }
            }
        }
        for(var i=commentaires_a_retirer.length-1;i>=0;i--){
         tab_comm.splice(commentaires_a_retirer[i],1);
        }
        return t;
    }
    /*
      =====================================================================================================================
    */
    #traite_ast0(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        const espaces=CRLF+'   '.repeat(niveau);
     
        switch(element.kind){
            /* ========================== */
            case 'program' :
            case 'body' :
            case 'block' :
            
                for(let i=0;i<element.children.length;i++){

                    if(element.kind==='block' || element.kind==='body'){
                        t+=this.#traite_commentaires_dans_bloc(element.children[i],niveau,parent,tab_comm);
                    }else{
                        t+=this.#traite_commentaires_debut(element.children[i],niveau,parent,tab_comm);
                    }
                    switch(element.children[i].kind){
                     
                        case 'expressionstatement' :
                            obj=this.#traite_expression(element.children[i],niveau,element,tab_comm);
                            if(obj.__xst===true){
                                t+=espaces+obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 expressionstatement'}));
                            }
                            break;
                        
                        case 'if' :
                            obj=this.#traite_if(element.children[i],niveau,element,tab_comm,false);
                            if(obj.__xst===true){
                                t+=espaces+obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 if'}));
                            }
                            break;
                        
                        case 'noop' :

                            t+='';
                            break;
                        
                        
                        default:
                           obj=this.#traite_element(element.children[i],niveau,element,tab_comm);
                           if(obj.__xst===true){
                               t+=obj.__xva;
                           }else{
                               return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0342 #traite_ast0 default'}));
                           }
                           break;
                       
                    }
                }
                break;
              
            /* ========================== */
            default:
                  t+=espaces+'#(0703 💥💥💥 TODO '+element.kind+')';
                  break;
             
        }
        t+=this.#traite_commentaires_fin(element,niveau,parent,tab_comm);

        return({__xst : true , __xva : t});
        
    }
    /*
      =====================================================================================================================
    */
    traite_ast(ast_de_php){ 
        let t='';
        if(ast_de_php.kind==='program'){
         let niveau=0;
         var obj=this.#traite_ast0(ast_de_php,niveau,null,ast_de_php.comments);
         if(obj.__xst===true){
             t+=obj.__xva;
         }else{
             return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 expressionstatement'}));
         }
         
         
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0040 traite_ast ce n\'est pa un programme'}));
        }
        return({__xst : true , __xva : t});
    }
    

    /*
      =====================================================================================================================
    */
}
export{module_conversion_ast_de_php_parser_vers_rev1};