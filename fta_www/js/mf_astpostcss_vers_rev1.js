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
               && o.element.hasOwnProperty( 'attributes' )
               && o.element.attributes.hasOwnProperty( 'startFilePos' )
               && o.element.attributes.hasOwnProperty( 'endFilePos' )
        ){
            o.plage=[o.element.attributes.startFilePos,o.element.attributes.endFilePos];
        }
        __m_rev1.empiler_erreur( o );
        return o;
    }

    /*
      =============================================================================================================
      point d'entrée
      =============================================================================================================
    */
    traite_ast_postcss( ast_de_css , options_traitement ){
        let t='';
        let obj=null;
        if(options_traitement !== undefined){
            this.#options_traitement=options_traitement;
        }
        debugger
        return({"__xst" : __xsu ,"__xva" :  t });
    }
}
export{c_astpostcss_vers_rev1 as c_astpostcss_vers_rev1};