"use strict";
/*
  =====================================================================================================================
  conversion d'un AST produit par https://github.com/postcss/postcss
  point d'entrée = traite_ast_postcss
  =====================================================================================================================
*/
class c_astpostcss_vers_rev1{
    #nom_de_la_variable='';
    #options_traitement={};
    /*
      =============================================================================================================
      le seul argument est pour l'instant le nom de la variable qui est déclarée
    */
    constructor( nom_de_la_variable ){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /*
      =============================================================================================================
    */
    #astcss_le( o ){
        if(o.hasOwnProperty( 'element' )
               && o.element
               && o.element.hasOwnProperty( 'source' )
               && o.element.source.hasOwnProperty( 'start' )
        ){
            o.plage=[o.element.source.start.offset,o.element.source.end.offset];
        }
        __m_rev1.empiler_erreur( o );
        return o;
    }
    /*
      =============================================================================================================
    */
    #traite_regle1( nodes ){
        let t='';
        let obj=null;
        for(var i in nodes){
            if(t !== ''){
                t+=',';
            }
            var la_declaration=nodes[i];
            switch (la_declaration.type){
                case 'decl' :
                    if(la_declaration.prop && la_declaration.value){
                        t+='d(p(\'' + la_declaration.prop.replace( /\'/g , '\\\'' ) + '\'),v(\'' + la_declaration.value.replace( /\'/g , '\\\'' ) + '\')' + (la_declaration.important === true ? ( ',important()' ) : ( '' )) + ')';
                    }else{
                        return(this.#astcss_le( {"__xstr" : __xer ,"__xme" : __m_rev1.nl2() + la_declaration.type ,"element" : la_declaration} ));
                    }
                    break;
                    
                case 'comment' :
                    t+='#(' + la_declaration.text.replace( /\(/g , '[' ).replace( /\)/g , ']' ) + ')';
                    break;
                    
                case 'atrule' :
                    t+='at(nomr(\'' + la_declaration.name.replace( /\'/g , '\\\'' ) + '\')';
                    if(la_declaration.nodes && la_declaration.nodes.length > 0){
                        obj=this.#traite_regle1( la_declaration.nodes );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            debugger;
                            return(this.#astcss_le( {"__xstr" : __xer ,"__xme" : __m_rev1.nl2() ,"element" : la_declaration} ));
                        }
                    }
                    t+=')';
                    break;
                    
                case 'rule' :
                    t+='regle(selecteur(\'' + la_declaration.selector.replace( /\'/g , '\\\'' ) + '\')';
                    if(la_declaration.nodes && la_declaration.nodes.length > 0){
                        obj=this.#traite_regle1( la_declaration.nodes );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            debugger;
                            return(this.#astcss_le( {"__xstr" : __xer ,"__xme" : __m_rev1.nl2() ,"element" : la_declaration} ));
                        }
                    }
                    t+=')';
                    break;
                    
                default:
                    return(this.#astcss_le( {"__xstr" : __xer ,"__xme" : __m_rev1.nl2() + ' type non traité : "<b>' + la_declaration.type + '</b>"' ,"element" : la_declaration} ));
                    break;
                    
            }
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
      point d'entrée
      =============================================================================================================
    */
    traite_ast_postcss( ast_de_postcss , options_traitement ){
        let t='';
        let obj=null;
        if(options_traitement !== undefined){
            this.#options_traitement=options_traitement;
        }
        for(var i in ast_de_postcss.nodes){
            var node=ast_de_postcss.nodes[i];
            if(t !== ''){
                t+=',';
            }
            switch (node.type){
                case 'atrule' :
                    t+='at(nomr(\'' + node.name.replace( /\'/g , '\\\'' ) + '\')';
                    if(node.params &&  typeof node.params === 'string'){
                        t+=',params(\'' + node.params.replace( /\'/g , '\\\'' ) + '\')';
                    }
                    if(node.nodes && node.nodes.length > 0){
                        obj=this.#traite_regle1( node.nodes );
                        if(obj.__xst === __xsu){
                            t+=',' + obj.__xva;
                        }else{
                            debugger;
                            return(this.#astcss_le( {"__xstr" : __xer ,"__xme" : __m_rev1.nl2() ,"element" : node} ));
                        }
                    }
                    t+=')';
                    break;
                    
                case 'rule' :
                    t+='regle(selecteur(\'' + node.selector.replace( /\'/g , '\\\'' ) + '\')';
                    if(node.nodes && node.nodes.length > 0){
                        obj=this.#traite_regle1( node.nodes );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            debugger;
                            return(this.#astcss_le( {"__xstr" : __xer ,"__xme" : __m_rev1.nl2() ,"element" : node} ));
                        }
                    }
                    t+=')';
                    break;
                    
                case 'comment' :
                    t+='#(' + node.text.replace( /\(/g , '[' ).replace( /\)/g , ']' ) + ')';
                    break;
                    
                default: t+='#(TODO node.type=' + node.type + ')';
                    break;
            }
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
}
export{c_astpostcss_vers_rev1 as c_astpostcss_vers_rev1};