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
      =============================================================================================================
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
      =============================================================================================================
      fonction transforme un texte pour qu'il  soit visible en html, par exemple &nbsp; ou bien <
      =============================================================================================================
    */
    entitees_html(s){
        return(s.replace(/&/g,'&amp;').replace('<','&lt;').replace('>','&gt;'));
    }
    /*#
      =====================================================================================================================
      fonction qui reconstitue un texte source à partir du tableau représentant la matrice  du  programme
      fu(
         a,
         f0(
            nomf(x0),
            f1( f2( nomf(x1) , p(x2) , p(x3) , p(x4) ))
         ),
         f5()
      )
      - quand un tableau contient un commentaire, chaque élément est sur un nouvelle ligne
      - quand un tableau contient plus de 5 éléments, chaque élément est sur une nouvelle ligne
      - quand un tableau contient un commentaire tbel ( tableau en ligne ) les éléments sont regroupés
           en 10 + 10 sur chaque ligne. Ceci permet de concentrer les gros tableaux de données
      =====================================================================================================================
    */
    matrice_vers_source_rev1(tab,parentId,retourLigne,debut,profondeur_parent=0,tab_retour_ligne=[],contient_un_defTab_tbel=null,ne_prendre_qu_un_element=false){
        /*
          le parent id=0 et début=1
        */
        if(tab.length <= 1){
            return({"__xst" : true ,"__xva" : ''});
        }
        var i=0;
        var j=0;
        var obj={};
        var t='';
        var profondeurLimite=3;
        var nombreEnfantsLimite=5;
        var commentaire='';
        var tmpC='';
        var c1='';
        var cm1='';
        const l01=tab.length;
        var chCR='¶' + 'CR' + '¶';
        var chLF='¶' + 'LF' + '¶';
        var chaine='';
        var obj={};
        var contient_en_commentaire_tbel=false;
        if(tab[debut][3] > 0){
            var les_espaces=espacesnrev(true,tab[debut][3]);
        }else{
            var les_espaces='';
        }
        var avant=contient_un_defTab_tbel;
        var indice_tab=tab_retour_ligne.length;
        tab_retour_ligne.push([retourLigne,retourLigne,false]);
        /*
          if(tab[debut][1]==='f1' || tab[debut][1]==='f2'){
          debugger;
          }
        */
        if(retourLigne === true
               && tab_retour_ligne[indice_tab][2] === false
               && parentId > 0
               && tab[parentId][10] <= profondeurLimite
               && tab[parentId][8] < nombreEnfantsLimite
        ){
            /*
              à priori on supprime le retour de ligne
            */
            tab_retour_ligne[indice_tab][1]=false;
            /*
              on ne veut pas de retour de ligne mais il faut vérifier
              que toute les sous fonctions n'aient pas plus de 5 arguments
            */
            for( i=debut ; i < l01 && tab[i][3] >= tab[debut][3] ; i++ ){
                if(tab[i][8] >= nombreEnfantsLimite){
                    for( var j=i + 1 ; j < l01 && tab[j][3] > tab[i][3] ; j++ ){
                        if(tab[j][7] === i){
                            if(tab[j][1] === '#' && tab[j][2] === 'f' && tab[j][13].indexOf('tbel') >= 0){
                                contient_un_defTab_tbel=true;
                                break;
                            }
                        }
                    }
                    if(contient_un_defTab_tbel){
                        retourLigne=true;
                        tab_retour_ligne[indice_tab][1]=true;
                        break;
                    }else{
                        /* si il y a trop d'enfants, on met les retour de ligne */
                        retourLigne=true;
                        tab_retour_ligne[indice_tab][1]=true;
                        break;
                    }
                }else if(tab[i][1] === '#' && tab[i][2] === 'f'){
                    retourLigne=true;
                    tab_retour_ligne[indice_tab][1]=true;
                    break;
                }
            }
        }
        retourLigne=tab_retour_ligne[indice_tab][1];
        if(avant === true){
            tab_retour_ligne[indice_tab][1]=false;
            retourLigne=tab_retour_ligne[indice_tab][1];
        }
        var count=0;
        for( i=debut ; i < l01 ; i=tab[i][12] ){
            if(tab[i][7] === parentId){
                if(t !== ''){
                    if(retourLigne === false){
                        t+=' , ';
                    }else{
                        t+=',';
                    }
                }else{
                    if(retourLigne === false){
                        t+=' ';
                    }
                }
                if(retourLigne === true){
                    if(tab[i][3] > 0){
                        if(profondeur_parent > 0){
                            t+=les_espaces;
                        }
                    }else{
                        if(count > 0){
                            t+=CRLF;
                        }
                    }
                }
                /*
                  =====================================================================================
                  on insère les données
                  =====================================================================================
                */
                if(tab[i][2] === 'c'){
                    chaine='';
                    switch (tab[i][4]){
                        case 1 :
                            /* simple quote */
                            chaine=tab[i][1].replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                            t+='\'' + chaine + '\'';
                            break;
                            
                        case 2 :
                            /* modele apostrophes inversées ` */
                            chaine=tab[i][1].replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                            t+='`' + chaine + '`';
                            break;
                            
                        case 3 :
                            /* double quote */
                            chaine=tab[i][1].replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                            t+='"' + chaine + '"';
                            break;
                            
                        case 4 :
                            /* regex */
                            chaine=tab[i][1];
                            t+='/' + chaine + '/' + tab[i][13];
                            break;
                            
                        case 0 :
                            /* variable en dur */
                            t+=tab[i][1];
                            break;
                            
                    }
                    count++;
                    if(contient_un_defTab_tbel === true && count% 10 === 0){
                        t+=les_espaces;
                    }
                }else if(tab[i][2] === 'f' && tab[i][1] === DEBUTCOMMENTAIRE){
                    /*
                      =============================================================================
                      on est dans un commentaire
                      =============================================================================
                    */
                    commentaire=ttcomm1(tab[i][13],tab[i][3],i);
                    t+=tab[i][1] + '(' + commentaire + ')';
                    count++;
                    if(contient_un_defTab_tbel === true && count% 10 === 0){
                        t+=les_espaces;
                    }
                }else if(tab[i][2] === 'f' && tab[i][1] === DEBUTBLOC){
                    /*
                      =============================================================================
                      on est dans un bloc en dur
                      =============================================================================
                    */
                    commentaire=tab[i][13];
                    t+=tab[i][1] + '(' + commentaire + ')';
                    count++;
                    if(contient_un_defTab_tbel === true && count% 10 === 0){
                        t+=les_espaces;
                    }
                }else if(tab[i][2] === 'f' && tab[i][8] === 0){
                    /*
                      =============================================================================
                      fonction sans argument
                      =============================================================================
                    */
                    t+=tab[i][1] + '()';
                    count++;
                    if(contient_un_defTab_tbel === true && count% 10 === 0){
                        t+=les_espaces;
                    }
                }else if(tab[i][2] === 'f' && tab[i][8] === 1 && tab[i + 1][2] === 'c' && tab[i + 1][4] === 0){
                    /*
                      =============================================================================
                      fonction avec 1 argument constant ( permet d'éviter un appel car ce cas est très courant );
                      =============================================================================
                    */
                    t+=tab[i][1] + '(' + tab[i + 1][1] + ')';
                    count++;
                    if(contient_un_defTab_tbel === true && count% 10 === 0){
                        t+=les_espaces;
                    }
                }else{
                    /*
                      =============================================================================
                      pour toutes les autres fonctions, on fait un appel récursif
                      =============================================================================
                      
                      #
                      console.log('t='+t, 'on va dans "'+tab[i][1]+'"');
                      if(false && ( tab[i][1]==='f2' || tab[i][1]==='f1' ) ){
                      debugger;
                      }
                    */
                    obj=this.matrice_vers_source_rev1(tab,i,retourLigne,i + 1,tab[i][10],tab_retour_ligne,contient_un_defTab_tbel);
                    if(obj.__xst === true){
                        var retour_ligne_stocke=tab_retour_ligne.pop();
                        /*
                          =====================================================================
                          on ouvre la fonction
                          =====================================================================
                        */
                        t+=tab[i][1] + '(';
                        /*
                          =====================================================================
                          on ajoute le contenu récursif de la fonction
                          =====================================================================
                        */
                        t+=obj.__xva;
                        /*
                          =====================================================================
                          on ferme la fonction
                          =====================================================================
                        */
                        if(retourLigne === true && retour_ligne_stocke[1] === true){
                            if(les_espaces === ''){
                                t+=CRLF;
                            }else{
                                if(tab[i][10] > 1){
                                    /* si la profondeur est supérieure à 1 */
                                    t+=les_espaces;
                                }else if(tab[i][9] < tab[tab[i][7]][8]){
                                    /* si ce n'est pas le dernier enfant */
                                    t+=les_espaces;
                                }else if(tab[i][9] === tab[tab[i][7]][8]){
                                    /* si c'est le dernier enfant */
                                    t+=espacesnrev(true,tab[debut][3]);
                                }
                            }
                        }
                        if(retourLigne === false){
                            t+=' ';
                        }
                        t+=')';
                    }else{
                        return({"__xst" : false ,"__xme" : 'erreur' ,"id" : i});
                    }
                    count++;
                }
                if(ne_prendre_qu_un_element === true){
                    break;
                }
            }
        }
        return({"__xst" : true ,"__xva" : t ,"retour_ligne_parent" : retourLigne});
    }
}
export{c_rev1 as c_rev1};