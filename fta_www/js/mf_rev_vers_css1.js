"use strict";
/*
  =====================================================================================================================
  conversion de rev en css
  point d'entrée = c_rev_vers_css
  =====================================================================================================================
*/
class c_rev_vers_css1{
    #nom_de_la_variable='';
    #tb=[];
    #l02=0;
    /*
      =============================================================================================================
    */
    constructor( nom_de_la_variable ){
        /* console.log('constructor'); */
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /*
      =============================================================================================================
    */
    #rev_css_le( o ){
        if(o.hasOwnProperty( 'id' )){
            try{
                o.plage=[this.#tb[o.id][5],this.#tb[o.id][6]];
                /* o['plage']=[this.#tb[o.id][5],this.#tb[o.id][6]]; */
            }catch(e){}
        }
        __m_rev1.empiler_erreur( o );
        return o;
    }
    /*
      =============================================================================================================
    */
    #rev_css1( id , niveau , {}){
     return({__xst : __xsu , t : '' });
    }
    /*
      =============================================================================================================
    */
    #macst_pour_css( elt ){
        let r=__m_rev1.ma_constante( elt );
        if(elt[4] === 1 || elt[4] === 3){
            const cr1=new RegExp( '¶' + 'CR' + '¶' , "g" );
            const lf1=new RegExp( '¶' + 'LF' + '¶' , "g" );
            r=r.replace( lf1 , '\\n' ).replace( cr1 , '\\r' );
        }
        return r;
    }
    c_rev_vers_css( source_rev , les_options ){
        let t='';
        let obj=null;
        /*
          obj=__m_rev1.txt_en_tableau(source_rev);
          obj=functionToArray2(obj.__xva,true,false,'');
        */
        obj=__m_rev1.rev_tm( source_rev );
        if(obj.__xst === __xsu){
            this.#tb=obj.__xva;
            this.#l02=obj.__xva.length;
            obj=this.#rev_css1( 0 , 0 , {} );
            if(obj.__xst === __xsu){
                if(obj.__xva.length >= 2 && obj.__xva.substr( 0 , 2 ) === '\r\n'){
                    obj.__xva=obj.__xva.substr( 2 );
                }
                if(obj.__xva.length >= 1 && obj.__xva.substr( 0 , 1 ) === '\r'){
                    obj.__xva=obj.__xva.substr( 1 );
                }
                if(obj.__xva.length >= 1 && obj.__xva.substr( 0 , 1 ) === '\n'){
                    obj.__xva=obj.__xva.substr( 1 );
                }
                obj.matriceFonction=this.#tb;
                return obj;
            }else{
                return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur de conversion en css'} ));
            }
        }else{
            return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur dans un rev'} ));
        }
    }
}
export{c_rev_vers_css1 as c_rev_vers_css1};