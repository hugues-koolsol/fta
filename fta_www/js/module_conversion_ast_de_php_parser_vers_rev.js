"use strict";
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
    #traite_inline(element,niveau){
        let t='';
        t+='#(💥 TODO #traite_inline à développer '+element.kind+')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_unset(element,niveau){
        let t='';
        t+='#(💥 TODO #traite_unset à développer '+element.kind+')';
        return({__xst : true , __xva : t})
    }
    
    /*
      =====================================================================================================================
    */
    #traite_assign(element,niveau){
        let t='';
        t+='#(💥 TODO #traite_assign à développer '+element.kind+')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_call(element,niveau){
        let t='';
        t+='#(💥 TODO #traite_call à développer pour '+element.what.name +')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_define(element,niveau){
        debugger
        let t='';
        t+='#(💥 TODO #traite_define à développer '+element.kind+')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_print(element,niveau){
        let t='';
        t+='#(💥 TODO #traite_print à développer '+element.kind+')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_include(element,niveau){
        let t='';
        t+='#(💥 TODO #traite_include à développer '+element.kind+')';
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_function(element,niveau){
        let t='';
        let obj=null;
        t+='#(💥 TODO #traite_function à développer '+element.kind+')';
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau+1);
            if(obj.__xst===true){
                t+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body'}));
            }
        }
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_if(element,niveau){
        let t='';
        let obj=null;
        t+='#(💥 TODO #traite_if à développer '+element.kind+')';
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau+1);
            if(obj.__xst===true){
                t+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0064 #traite_if body'}));
            }
        }
        
        return({__xst : true , __xva : t})
    }
    /*
      =====================================================================================================================
    */
    #traite_expression(element,niveau){
        let t='';
        let obj=null;
        

        switch(element.kind){
         
            case 'include':
               t+='#(💥 TODO à faire '+element.expression.what.name+')';
            break;
            
            
            case 'expressionstatement':
                switch(element.expression.kind){
                 
                  case 'include' :
                      obj=this.#traite_include(element.expression,niveau);
                      if(obj.__xst===true){
                          t+=obj.__xva;
                      }else{
                          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0080 #traite_expression include'}));
                      }
                      break;
                  
                  case 'print' :
                      obj=this.#traite_print(element.expression,niveau);
                      if(obj.__xst===true){
                          t+=obj.__xva;
                      }else{
                          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0132 #traite_expression print'}));
                      }
                      break;
                  
                  case 'call' :
                      obj=this.#traite_call(element.expression,niveau);
                      if(obj.__xst===true){
                          t+=obj.__xva;
                      }else{
                          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0166 #traite_expression call'}));
                      }
                      break;
                  
                  case 'assign' :
                      obj=this.#traite_assign(element.expression,niveau);
                      if(obj.__xst===true){
                          t+=obj.__xva;
                      }else{
                          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0182 #traite_expression assign'}));
                      }
                      break;
                  
                  default :
                   t+='#(💥💥💥 TODO non prévu #traite_expression pour element.expression.kind = "'+element.expression.kind+'")';
                  break
                  
                }
            break;
            
            default :
               t+='#(💥💥💥 TODO non prévu dans #traite_expression pour kind = '+element.kind+')';
               break;
            
                
       
        }
        return({__xst : true , __xva : t})
    }    
    
    /*
      =====================================================================================================================
    */
    #traite_ast0(element,niveau){
        let t='';
        let obj=null;
        const espaces=CRLF+'   '.repeat(niveau);
     
        switch(element.kind){
            /* ========================== */
            case 'program' :
            case 'body' :
            case 'block' :
            
                for(let i=0;i<element.children.length;i++){
                 
                    switch(element.children[i].kind){
                     
                        case 'expressionstatement' :
                            obj=this.#traite_expression(element.children[i],niveau);
                            if(obj.__xst===true){
                                t+=espaces+obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 expressionstatement'}));
                            }
                            break;
                        
                        case 'if' :
                            obj=this.#traite_if(element.children[i],niveau);
                            if(obj.__xst===true){
                                t+=espaces+obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 if'}));
                            }
                            break;
                        
                        case 'function' :
                            obj=this.#traite_function(element.children[i],niveau);
                            if(obj.__xst===true){
                                t+=espaces+obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 function'}));
                            }
                            break;
                        
                        case 'unset' :
                            obj=this.#traite_unset(element.children[i],niveau);
                            if(obj.__xst===true){
                                t+=espaces+obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 unset'}));
                            }
                            break;
                        
                        case 'inline' :
                            obj=this.#traite_inline(element.children[i],niveau);
                            if(obj.__xst===true){
                                t+=espaces+obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 inline'}));
                            }
                            break;
                        
                        default:
                            console.error('type element non traite "'+element.children[i].kind+'"')
                            t+=espaces+'#(💥💥💥 TODO NON TRAITE DANS #traite_ast0 '+element.children[i].kind+')';
                            break;
                    }
                }
                break;
              
            /* ========================== */
            default:
                  debugger
                  console.error('0185 #traite_ast0 non traite element.kind "'+element.kind+'"');
                  t+=espaces+'#(💥'+element.kind+')';
                  break;
             
        }
        return({__xst : true , __xva : t});
        
    }
    /*
      =====================================================================================================================
    */
    traite_ast(ast_de_php){ 
        let t='';
        if(ast_de_php.kind==='program'){
         let niveau=0;
         var obj=this.#traite_ast0(ast_de_php,niveau);
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