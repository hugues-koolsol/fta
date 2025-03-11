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
            }catch(e){}
        }
        __m_rev1.empiler_erreur( o );
        return o;
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
    /*
      =============================================================================================================
    */
    #rev_definition1( id , niveau , opt ){
        let t='';
        let obj={};
        let prop='';
        let valeur=''
        for( let i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][2] === 'c'){
                return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'constante' ,"id" : i} ));
            }else{
                switch (this.#tb[i][1]){
                    case '#' : t+='/* */';
                        break;
                    case 'p' :
                       prop+=this.#tb[i+1][1].replace(/\\\'/g,'\'');
                       break;
                    case 'v' :
                       valeur+=this.#tb[i+1][1].replace(/\\\'/g,'\'');
                       break;
                    default:
                        return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()+this.#tb[i][1]  ,"id" : i} ));
                }
            }
        }
        t+=prop+':'+valeur;
        return({"__xst" : __xsu ,"__xva" : t});
    }
     
    /*
      =============================================================================================================
    */
    #rev_regle( id , niveau , opt ){
        let t='';
        let obj={};
        
        let definitions='';
        let nom_selecteur='';
        for( var j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            switch (this.#tb[j][1]){
                case 'selecteur' : nom_selecteur=this.#tb[j + 1][1];
                    break;
                case 'd' : 
                    obj=this.#rev_definition1(j,niveau,opt);
                    if(obj.__xst===__xsu){
                        definitions+=obj.__xva+';';
                    }else{
                        return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + this.#tb[j][1] ,"id" : i} ));
                    }
                    break;
                case '#' : definitions+='/* */';
                    break;
                default:
                    return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + this.#tb[j][1] ,"id" : i} ));
            }
        }
        t+=__m_rev1.espaces1(niveau)+nom_selecteur + '{'+definitions+'}';
        
        
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #rev_at( id , niveau , opt ){
        let t='';
        let obj={};
        
        
        let definitions='';
        let nom_regle='';
        let params='';
        for( var j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            switch (this.#tb[j][1]){
                case 'nomr' : nom_regle=this.#tb[j + 1][1].replace(/\\\'/g,'\'');
                    break;
                case 'params' : params=' '+this.#tb[j + 1][1].replace(/\\\'/g,'\'');
                    break;
                case 'd' : 
                    obj=this.#rev_definition1(j,niveau+1,opt);
                    if(obj.__xst===__xsu){
                        definitions+=obj.__xva+';';
                    }else{
                        return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()+this.#tb[j][1] ,"id" : i} ));
                    }
                    break;
                case 'regle' :
                    obj=this.#rev_regle(j,niveau+1,opt);
                    if(obj.__xst===__xsu){
                        definitions+=obj.__xva;
                    }else{
                        return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()+this.#tb[j][1] ,"id" : i} ));
                    }
                    break;
                 case 'at' :
                     obj=this.#rev_at(j,niveau+1,opt);
                     if(obj.__xst===__xsu){
                         definitions+=obj.__xva;
                     }else{
                         return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()+this.#tb[j][1] ,"id" : i} ));
                     }
                     break;
                case '#' : definitions+='/* */';
                    break;
                default:
                    return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + this.#tb[j][1] ,"id" : i} ));
            }
        }
        t+=__m_rev1.espaces1(niveau)+'@' + nom_regle + params+ '{'+definitions+'}';
        
        
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #rev_css1( id , niveau , opt ){
        let t='';
        let obj={};
        let definitions='';
        let nom_regle='';
        let nom_selecteur='';
        for( let i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(t !== ''){
                t+=__m_rev1.espaces1(niveau);
            }
            if(this.#tb[i][2] === 'c'){
                return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'constante' ,"id" : i} ));
            }else{
                switch (this.#tb[i][1]){
                    case '#' : t+='/* */';
                        break;
                    case 'at' :
                        obj=this.#rev_at(i,niveau+1,opt);
                        if(obj.__xst===__xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()+this.#tb[i][1] ,"id" : i} ));
                        }
                        break;
                        
                    case 'regle' :
                        obj=this.#rev_regle(i,niveau+1,opt);
                        if(obj.__xst===__xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()+this.#tb[i][1] ,"id" : i} ));
                        }
                        break;
                    default:
                        return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + this.#tb[i][1] ,"id" : i} ));
                        
                }
            }
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    c_tab_vers_css( matrice , les_options ){
        let t='';
        let obj=null;
        this.#tb=matrice;
        this.#l02=matrice.length;
        debugger
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
            return obj;
        }else{
            return(this.#rev_css_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur de conversion en css'} ));
        }
    }
    /*
      =============================================================================================================
    */
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