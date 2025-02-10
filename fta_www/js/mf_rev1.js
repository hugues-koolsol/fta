"use strict";
/*
  =====================================================================================================================
  __m_rev1
*/
class c_rev1{
    #nom_de_la_variable='';
    #NBESPACESSOURCEPRODUIT=4;
    #NBESPACESREV=3;
    
    #global_messages={
        "erreurs" : [] ,
        "avertissements" : [] ,
        "infos" : [] ,
        "lignes" : [] ,
        "ids" : [] ,
        "plages" : [] ,
        "data" : {"matrice" : [] ,"tableau" : [] ,"sourceGenere" : ''}
    };

    
    /* function constructor */
    constructor(nom_de_la_variable){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /*
      =============================================================================================================
      fonction respr PRIVÉE : retour chariot + nouvelle ligne + n espaces dans les rev produits
      =============================================================================================================
    */
    #respr(n){
        var t='\r\n';
        if(n > 0){
            t+=' '.repeat(this.#NBESPACESREV * n);
        }
        return t;
    }
    /*
      =====================================================================================================================
    */
    ma_constante(eltTab){
        var t='';
        switch (eltTab[4]){
            case 1 : /* entre simples apostrophes */
                t='\'' + eltTab[1] + '\'';
                break;
            case 2 :
                /* apostrophes inversées / accent grave */
                t='`' + eltTab[1] + '`';
                t=t.replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                break;
                
            case 3 : /* guillemets */
                t='"' + eltTab[1] + '"';
                break;
            case 4 : /* regex */
                t='/' + eltTab[1] + '/' + eltTab[13];
                break;
            default:
                /* constante non quotée, généralement une variable ou une valeur numérique ou une constante */
                if(eltTab[1] === 'vrai'){
                    t='true';
                }else if(eltTab[1] === 'faux'){
                    t='false';
                }else{
                    t=eltTab[1];
                }
                
        }
        return t;
    }
    /*
      =============================================================================================================
      fonction resps : retour chariot + nouvelle ligne + n espaces dans les sources produits
      =============================================================================================================
    */
    resps(n){
        var t='\r\n';
        if(n > 0){
            t+=' '.repeat(this.#NBESPACESSOURCEPRODUIT * n);
        }
        return t;
    }
    /*
      =============================================================================================================
      fonction est_num : est numérique ?
      =============================================================================================================
    */
    est_num(mot){
        if( typeof mot !== 'string'){
            return false;
        }
        var le_test=!isNaN(mot) && !isNaN(parseFloat(mot));
        return le_test;
    }
    /*
      =====================================================================================================================
      fonction transforme un texte pour qu'il  soit visible en html, par exemple &nbsp; ou bien <
      =====================================================================================================================
    */
    entitees_html(s){
        return(s.replace(/&/g,'&amp;').replace('<','&lt;').replace('>','&gt;'));
    }
    
}
export{c_rev1 as c_rev1};