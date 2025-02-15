"use strict";
const DEBUTCOMMENTAIRE='#';
const DEBUTBLOC='@';
const CRLF='\r\n';
const CR='\r';
const LF='\n';
const NBESPACESREV=3;
const NBESPACESSOURCEPRODUIT=4;
var global_messages={
    "erreurs" : [] ,
    "avertissements" : [] ,
    "infos" : [] ,
    "lignes" : [] ,
    "ids" : [] ,
    "plages" : [] ,
};
/*
  =====================================================================================================================
  met les valeurs dans la variable global_messages
  =====================================================================================================================
*/
function logerreur(o){
    var retourner={
        "__xst" : o.hasOwnProperty('__xst') ? ( o.__xst ) : ( false ) ,
        "__xva" : o.hasOwnProperty('__xva') ? ( o.__xva ) : ( null ) ,
        "masquee" : o.hasOwnProperty('masquee') ? ( o.masquee ) : ( false ) ,
        "plage" : o.hasOwnProperty('plage') ? ( o.plage ) : ( null ) ,
        "ligne" : o.hasOwnProperty('ligne') ? ( o.ligne ) : ( null )
    };
    if(o.hasOwnProperty('__xme')){
        retourner[__xme]=o.__xme;
    }
    if(o.hasOwnProperty('__xav')){
        retourner['__xav']=o.__xav;
    }
    if(o.hasOwnProperty('__xms')){
        for(var i in o.__xms){
            retourner.__xme=o.__xms[i];
            global_messages['erreurs'].push(retourner);
        }
    }else{
        if(retourner.__xst === false){
            if(retourner.hasOwnProperty('__xav')){
                global_messages['avertissements'].push(retourner);
            }else{
                global_messages['erreurs'].push(retourner);
            }
        }else{
            if(retourner.hasOwnProperty('__xav')){
                global_messages['avertissements'].push(retourner);
            }else{
                global_messages['infos'].push(retourner);
            }
        }
    }
    return retourner;
}
/*
  =====================================================================================================================
  construit des espaces pour l'indentation des sources
  =====================================================================================================================
*/
function espacesnrev(optionCRLF,i){
    var t='';
    if(optionCRLF){
        t='\r\n';
    }else{
        t='\n';
    }
    if(i > 0){
        t+=' '.repeat(NBESPACESREV * i);
    }
    return t;
}
/*
  =====================================================================================================================
  Des fonctions raccourcies
  =====================================================================================================================
*/
function rev_texte_vers_matrice(texte_rev){
    var tableau1=__m_rev1.txt_en_tableau(texte_rev);
    var matriceFonction=functionToArray2(tableau1.out,true,false,'');
    return matriceFonction;
}
/*
  =====================================================================================================================
*/
function functionToArray(src,quitterSiErreurNiveau,autoriserConstanteDansLaRacine,rechercheParentheseCorrespondante){
    var tableau1=__m_rev1.txt_en_tableau(src);
    var matriceFonction=functionToArray2(tableau1.out,quitterSiErreurNiveau,autoriserConstanteDansLaRacine,rechercheParentheseCorrespondante);
    return matriceFonction;
}
/*
  =====================================================================================================================
  fonction qui se base sur la colonne 3[niveau] d'une matrice pour recalculer 
  - le parent[7], 
  - le nombre d'enfants[8], 
  - le numéro d'enfant[9]
  - la profondeur[10]
  =====================================================================================================================
*/
function reIndicerLeTableau(tab){
    const l01=tab.length;
    var i=0;
    var j=0;
    var k=0;
    var l=0;
    var niveau=0;
    /*
      =============================================================================================================
      indice et nombre d'enfants mis à zéro
      =============================================================================================================
    */
    for( i=1 ; i < l01 ; i++ ){
        tab[i][0]=i;
        tab[i][8]=0;
    }
    /*
      =============================================================================================================
      parent et nombre d'enfants
      =============================================================================================================
    */
    for( i=l01 - 1 ; i > 0 ; i-- ){
        niveau=tab[i][3];
        for( j=i ; j >= 0 ; j-- ){
            if(tab[j][3] === niveau - 1){
                tab[i][7]=j;
                tab[j][8]=tab[j][8] + 1;
                break;
            }
        }
    }
    /*
      =============================================================================================================
      numéro d'enfant + bidouille performances car on boucle souvent sur les enfants
      =============================================================================================================
    */
    var indice_enfant_precedent=0;
    for( i=0 ; i < l01 ; i++ ){
        k=0;
        for( j=i + 1 ; j < l01 && tab[j][3] > tab[i][3] ; j++ ){
            if(tab[j][7] === tab[i][0]){
                k++;
                tab[j][9]=k;
                /*
                  pour le dernier, on met l01
                */
                tab[j][12]=l01;
                if(k > 1){
                    tab[indice_enfant_precedent][12]=j;
                }
                indice_enfant_precedent=j;
            }
        }
    }
    /*
      =============================================================================================================
      profondeur
      =============================================================================================================
    */
    var niveau=0;
    var id_parent=0;
    for( i=l01 - 1 ; i > 0 ; i-- ){
        /* si c'est une constante */
        if(tab[i][2] === 'c'){
            tab[i][10]=0;
        }
        if(tab[i][7] > 0){
            /* si l'élément a un parent */
            niveau=tab[i][3];
            id_parent=tab[i][7];
            /* pour chacun des niveaux enfants */
            for( j=1 ; j <= niveau ; j++ ){
                if(tab[id_parent][10] < j){
                    /* on change la profondeur */
                    tab[id_parent][10]=j;
                }
                id_parent=tab[id_parent][7];
            }
        }
    }
    return tab;
}
/*
  =====================================================================================================================
  fonction qui supprime un élément et ses enfants dans la matrice
  =====================================================================================================================
*/
function supprimer_un_element_de_la_matrice(tab,id,niveau,a_supprimer){
    var i=0;
    if(niveau === 0){
        var a_supprimer=[];
    }
    if(tab[id][2] === 'c' || tab[id][2] === 'f' && tab[id][8] === 0){
        /*
          si c'est une constante ou une fonction vide  on l'efface directement
          son parent à un élément en moins
        */
        a_supprimer.push(id);
    }else{
        /*#
          sinon, on efface recursivement tous ses enfants avant de l'effacer 
          bien garder  tab.length  çi dessous
                       VVVVVVVVVV
        */
        for( i=1 ; i < tab.length ; i++ ){
            if(tab[i][7] === id){
                supprimer_un_element_de_la_matrice(tab,tab[i][0],niveau + 1,a_supprimer);
            }
        }
        a_supprimer.push(id);
    }
    if(niveau === 0){
        /*
          à la fin on efface effectivement les lignes en partant du bas 
          et on recalcul les indices
        */
        a_supprimer.sort(function(a,b){
                return(b - a);
            });
        for( i=0 ; i < a_supprimer.length ; i++ ){
            tab.splice(a_supprimer[i],1);
        }
        tab=reIndicerLeTableau(tab);
        return tab;
    }
}
/*
  =====================================================================================================================
  fonction qui supprime un élément dans la matrice et descend les enfants de cet élément d'un niveau
  =====================================================================================================================
*/
function baisserNiveauEtSupprimer(tab,id,niveau){
    var i=0;
    for( i=id + 1 ; i < tab.length ; i++ ){
        if(tab[i][7] === id){
            tab[i][3]=tab[i][3] - 1;
            if(tab[i][2] === 'f'){
                niveau++;
                /*
                  appel récursif pour baisser le niveau des enfants des enfants des enfants ....
                */
                baisserNiveauEtSupprimer(tab,i,niveau);
                niveau--;
            }
        }
    }
    if(niveau === 0){
        /*
          à la fin, on supprime l'élément et on recalcul les indices
        */
        tab.splice(id,1);
        tab=reIndicerLeTableau(tab);
        return tab;
    }
}

/*#
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  fonction d'analyse syntaxique d'un programme source, retourne un tableau
  entête[
      ['id','id'],                             //  0
      ['val','valeur'],                        //  1
      ['typ','type'],                          //  2
      ['niv','niveau'],                        //  3
      ['coQ','constante quotée'],              //  4
      ['pre','position du premier caractère'], //  5
      ['der','position du dernier caractère'], //  6
      ['pId','Id du parent'],                  //  7
      ['nbE','nombre d\'enfants'],             //  8
      ['nuE','numéro enfants'],                //  9
      ['pro','profondeur'],                    // 10
      ['pop','position ouverture parenthese'], // 11
      ['ies','indice enfant suivant'],         // 12
      ['com','commentaire']                    // 13
  ];
  
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function functionToArray2(tableauEntree,quitterSiErreurNiveau,autoriserCstDansRacine,rechercheParentheseCorrespondante){
    /*
      // pour la mesure des performances, voir à la fin de cette fonction pour l'utilisation
      var startMicro = performance.now();
      
      
      =============================================================================================================
      les chaines de caractères
      =============================================================================================================
    */
    var texte='';
    var texte_precedent='';
    var commentaire='';
    var c='';
    var c1='';
    var c2='';
    /*
      je mets les éléments dans une chaine car chrome est particulièrement lent sur les tableau.push()
      à la fin de la boucle, on fait un json.parse sur chaine_tableau
    */
    var chaine_tableau='';
    var type_precedent='';
    var drapeau_regex='';
    var chCR='¶' + 'CR' + '¶';
    var chLF='¶' + 'LF' + '¶';
    /*
      =============================================================================================================
      les entiers
      =============================================================================================================
    */
    var i=0;
    var j=0;
    var k=0;
    var l=0;
    var indice=0;
    var niveau=0;
    var premier=0;
    var dernier=0;
    var pos_ouv_par=0;
    var pos_fer_par=0;
    var niveauDebutCommentaire=0;
    var niveauDansCommentaire=0;
    var indiceTabCommentaire=0;
    var niveauPrecedent=0;
    /*
      =============================================================================================================
      les booléens
      =============================================================================================================
    */
    var dansCstSimple=false;
    var dansCstDouble=false;
    var dansCstModele=false;
    var dansCstRegex=false;
    var dans_commentaire=false;
    var dsBloc=false;
    var constanteQuotee=0;
    var constanteQuoteePrecedente=0;
    var drapeauParenthese=rechercheParentheseCorrespondante === '' ? ( false ) : ( true );
    /* quand on fait une recherche de parenthèses correspondantes, on se sert de ce tableau */
    var tab_pour_recherche_parentheses=[];
    /*
      =============================================================================================================
      Le tableau en sortie si tout va bien
      =============================================================================================================
    */
    var tabCommentaireEtFinParentheses=[];
    var chaine_tableau_commentaires='';
    var T=[];
    /*
      =============================================================================================================
      initialisation du tableau contenant le source structuré en arborescence
      =============================================================================================================
      0id    1val  2typ  3niv  4coQ
      5pre   6der  7pId  8nbE  9numEnfant  
      10pro 11OPa 12FPa 13comm
      
      
      =============================================================================================================
      Les performances sur chrome sont très mauvaises en utilisant des push
      c'est pourquoi on construit cette variable texte : "chaine_tableau" 
      qui sera traitée avec un JSON.parse() plus bas.
      Sur un tableau de 25000 éléments, on multiplie la vitesse d'exécution 
      par un facteur compris entre 30 et 60
      =============================================================================================================
      
      
      la première version avec push était :
      T.push(Array(0,texte,'__I',-1,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,pos_fer_par,''));
    */
    chaine_tableau+='[0,"' + texte + '","__I",-1,' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
    type_precedent='__I';
    niveauPrecedent=niveau;
    var l01=tableauEntree.length;
    /*
      =============================================================================================================
      =============================================================================================================
      boucle principale sur tous les caractères du tableau passé en argument,
      on commence par analyser les cas ou on est dans  des commentaires ou des chaines, 
      puis on analyse les caractères
      =============================================================================================================
      =============================================================================================================
    */
    for( i=0 ; i < l01 ; i++ ){
        c=tableauEntree[i][0];
        if(dans_commentaire === true){
            /*
              
              
              
              =============================================================================================
              Si on est dans un commentaire
              =============================================================================================
            */
            if(c === ')'){
                if(niveau === niveauDebutCommentaire + 1 && niveauDansCommentaire === 0){
                    pos_fer_par=i;
                    /*
                      comme on a supprimé les push sur le tableau principal et qu'on remplit les commentaires
                      après avoir rempli la fonction, on met les commentaires dans un tableau et on remplira 
                      le tableau principal "T" à la fin
                    */
                    chaine_tableau_commentaires+=',[' + indice + ',"' + commentaire.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,chLF).replace(/\r/g,chCR).replace(/\t/g,'\\t') + '"]';
                    indiceTabCommentaire++;
                    pos_fer_par=0;
                    /*
                      la première version version faisait :
                      T[indice][13]=commentaire;
                    */
                    commentaire='';
                    dans_commentaire=false;
                    niveau=niveau - 1;
                    if(drapeauParenthese){
                        if(i === l01 - 1){
                            /*
                              =============================================================
                              si on est en recherche de parenthèse correspondante 
                              et que c'est le dernier caractère du tableau en entrée
                              alors c'est une recherche de parenthèse ouvrante correspondante
                              =============================================================
                            */
                            return({"__xst" : true ,"pos_ouv_par" : tableauEntree[tab_pour_recherche_parentheses[tab_pour_recherche_parentheses.length - 1]][2]});
                        }
                        tab_pour_recherche_parentheses.pop();
                    }
                }else{
                    if(drapeauParenthese){
                        if(i === l01 - 1){
                            return({"__xst" : true ,"pos_ouv_par" : tableauEntree[tab_pour_recherche_parentheses[tab_pour_recherche_parentheses.length - 1]][2]});
                        }
                        tab_pour_recherche_parentheses.pop();
                    }
                    commentaire+=c;
                    niveauDansCommentaire=niveauDansCommentaire - 1;
                }
            }else if(c === '('){
                commentaire+=c;
                niveauDansCommentaire=niveauDansCommentaire + 1;
                if(drapeauParenthese){
                    tab_pour_recherche_parentheses.push(i);
                }
            }else{
                commentaire+=c;
            }
            /*
              =============================================================================================
              FIN de Si on est dans un commentaire
              =============================================================================================
              
              
              
            */
        }else if(dansCstDouble === true){
            /*
              
              
              
              =============================================================================================
              Si on est dans une constante double
              =============================================================================================
            */
            if(c === '"'){
                if(autoriserCstDansRacine !== true){
                    if(i === l01 - 1){
                        /*
                          cas : directive["use strict"
                        */
                        if(niveau > 0){
                            return(logerreur(__m_rev1.formatter_une_erreur_rev({ 
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : __m_rev1.nl2()+'les parenthèses ne se finissent pas à la fin du rev' ,
                                    "type" : 'rev' ,
                                    "texte" : texte ,
                                    "chaine_tableau" : chaine_tableau ,
                                    "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                    "tableauEntree" : tableauEntree ,
                                    "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                    "autoriserCstDansRacine" : autoriserCstDansRacine
                                })));
                        }else{
                            console.error('%ccore functionToArray2 1164 noter ce cas d\'erreur','background:gold;color:red;');
                            return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : __m_rev1.nl2()+'le niveau ' ,
                                    "type" : 'rev' ,
                                    "texte" : texte ,
                                    "chaine_tableau" : chaine_tableau ,
                                    "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                    "tableauEntree" : tableauEntree ,
                                    "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                    "autoriserCstDansRacine" : autoriserCstDansRacine
                                })));
                        }
                    }
                }
                if(i + 1 < l01){
                    c1=tableauEntree[i + 1][0];
                    if(c1 === ','
                           || c1 === '\t'
                           || c1 === '\n'
                           || c1 === '\r'
                           || c1 === '/'
                           || c1 === ' '
                           || c1 === ')'
                    ){
                        dernier=i - 1;
                    }else{
                        /* cas d'erreur = f(""") */
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2()+'une constante encadrée par des guillemets est incorrecte ' ,
                                "type" : 'rev' ,
                                "texte" : texte ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                }else{
                    if(autoriserCstDansRacine === false){
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantess ' ,
                                "type" : 'rev' ,
                                "texte" : texte ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                }
                dansCstDouble=false;
                if(autoriserCstDansRacine === false && niveau === 0){
                    /* cas d'erreur = "" */
                    return(logerreur(__m_rev1.formatter_une_erreur_rev({
                            "__xst" : false ,
                            "ind" : i ,
                            "__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes ' ,
                            "type" : 'rev' ,
                            "texte" : texte ,
                            "chaine_tableau" : chaine_tableau ,
                            "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                            "tableauEntree" : tableauEntree ,
                            "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                            "autoriserCstDansRacine" : autoriserCstDansRacine
                        })));
                }
                constanteQuotee=3;
                constanteQuoteePrecedente=3;
                /* methode3" */
                texte=texte.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
                texte=texte.replace(/\n/g,chLF).replace(/\r/g,chCR).replace(/\t/g,'\\t');
                indice++;
                chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                */
                type_precedent='c';
                niveauPrecedent=niveau;
                texte_precedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === l01 - 1){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash ne doit pas terminer une constante en i=' + i}));
                }
                /*  */
                c1=tableauEntree[i + 1][0];
                if(c1 === '\\'
                       || c1 === '"'
                       || c1 === 'n'
                       || c1 === 't'
                       || c1 === 'r'
                       || c1 === 'u'
                       || c1 === 'b'
                       || c1 === 'f'
                       || c1 === 'x'
                       || c1 === 'v'
                       || c1 === '0'
                       || c1 === '>'
                       || c1 === '<'
                       || c1 === '/'
                       || c1 === '&'
                       || c1 === '$'
                ){
                    if(texte === ''){
                        premier=i;
                    }
                    texte+='\\' + c1;
                    i++;
                }else if(c1 === '"'){
                    texte+=texte + '"';
                    i++;
                }else{
                    return(logerreur(__m_rev1.formatter_une_erreur_rev({
                            "__xst" : false ,
                            "ind" : i ,
                            "__xme" : __m_rev1.nl2()+'un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u ' ,
                            "type" : 'rev' ,
                            "texte" : texte ,
                            "chaine_tableau" : chaine_tableau ,
                            "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                            "tableauEntree" : tableauEntree ,
                            "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                            "autoriserCstDansRacine" : autoriserCstDansRacine
                        })));
                }
            }else{
                if(texte === ''){
                    premier=i;
                }
                texte+=c;
            }
            /*
              =============================================================================================
              Fin de Si on est dans une constante double
              =============================================================================================
            */
        }else if(dansCstRegex === true){
            /*
              =============================================================================================
              Si on est dans une regex
              =============================================================================================
            */
            if(c === '/'){
                if(autoriserCstDansRacine !== true){
                    if(i === l01 - 1){
                        return(logerreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes'}));
                    }
                }
                if(i + 1 < l01){
                    c1=tableauEntree[i + 1][0];
                    if(c1 === '+' || c1 === '*'){
                        /*
                          cas des caractères gloutons , ça ne correspond pas à un drapeau de regex
                          voir https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet
                        */
                        texte+='/' + c1;
                        i++;
                        continue;
                    }
                    drapeau_regex='';
                    if(c1 === ','
                           || c1 === '\t'
                           || c1 === '\n'
                           || c1 === '\r'
                           || c1 === '/'
                           || c1 === ' '
                           || c1 === ')'
                    ){
                        dernier=i - 1;
                    }else{
                        for( j=i + 1 ; j < l01 ; j++ ){
                            c1=tableauEntree[j][0];
                            if(c1 === ','
                                   || c1 === '\t'
                                   || c1 === '\n'
                                   || c1 === '\r'
                                   || c1 === '/'
                                   || c1 === ' '
                                   || c1 === ')'
                            ){
                                dernier=j;
                                i=j - 1;
                                break;
                            }else{
                                drapeau_regex+=c1;
                                if(j === l01 - 1){
                                    i=j;
                                }
                            }
                        }
                    }
                }else{
                    if(!(autoriserCstDansRacine === true)){
                        return(logerreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes'}));
                    }
                }
                dansCstRegex=false;
                constanteQuotee=4;
                constanteQuoteePrecedente=4;
                if(autoriserCstDansRacine !== true){
                    if(niveau === 0){
                        return(logerreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes'}));
                    }
                }
                /* methode3regex */
                texte=texte.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
                if(texte.indexOf('\n') > 0 || texte.indexOf('\r') >= 0 || texte.indexOf('\t') > 0){
                    return(logerreur(__m_rev1.formatter_une_erreur_rev({
                            "__xst" : false ,
                            "ind" : premier ,
                            "__xme" : __m_rev1.nl2()+'il ne peut pas y avoir des retours à la ligne ou des tabulations dans une chaine de type regex ' ,
                            "type" : 'rev' ,
                            "texte" : texte ,
                            "chaine_tableau" : chaine_tableau ,
                            "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                            "tableauEntree" : tableauEntree ,
                            "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                            "autoriserCstDansRacine" : autoriserCstDansRacine
                        })));
                }
                indice++;
                chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                  
                  
                  pour une regex, on met les drapeaux ( g,...) dans la zone commentaire [13]
                */
                chaine_tableau_commentaires+=',[' + indice + ',"' + drapeau_regex.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,chLF).replace(/\r/g,chCR).replace(/\t/g,'\\t') + '"]';
                indiceTabCommentaire++;
                type_precedent='c';
                niveauPrecedent=niveau;
                texte_precedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === l01 - 1){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash ne doit pas terminer une fonction'}));
                }
                /*  */
                c1=tableauEntree[i + 1][0];
                if(texte === ''){
                    premier=i;
                }
                texte+='\\' + c1;
                i++;
            }else if(c === '\n' || c === '\r'){
                return(logerreur(__m_rev1.formatter_une_erreur_rev({
                        "__xst" : false ,
                        "ind" : premier ,
                        "__xme" : __m_rev1.nl2()+'il ne peut pas y avoir des retours à la ligne dans une chaine de type regex ' ,
                        "type" : 'rev' ,
                        "texte" : texte ,
                        "chaine_tableau" : chaine_tableau ,
                        "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                        "tableauEntree" : tableauEntree ,
                        "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                        "autoriserCstDansRacine" : autoriserCstDansRacine
                    })));
            }else{
                if(texte === ''){
                    premier=i;
                }
                texte+=c;
            }
            /*
              =============================================================================================
              Fin de Si on est dans une regex
              =============================================================================================
              
              
              
              
            */
        }else if(dansCstModele === true){
            /*
              
              
              
              =============================================================================================
              Si on est dans une constante modèle
              =============================================================================================
            */
            if(c === '`'){
                if(autoriserCstDansRacine !== true){
                    if(i === l01 - 1){
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2() + 'la racine ne peut pas contenir des constantes' ,
                                "type" : 'rev' ,
                                "texte" : texte ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                }
                if(i + 1 < l01){
                    c1=tableauEntree[i + 1][0];
                    if(c1 === ','
                           || c1 === '\t'
                           || c1 === '\n'
                           || c1 === '\r'
                           || c1 === '/'
                           || c1 === ' '
                           || c1 === ')'
                    ){
                        dernier=i - 1;
                    }else{
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2() + 'apres une constante, il doit y avoir un caractère d\'echappement' ,
                                "type" : 'rev' ,
                                "texte" : texte ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                }else{
                    if(!(autoriserCstDansRacine === true)){
                        return(logerreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes'}));
                    }
                }
                dansCstModele=false;
                constanteQuotee=2;
                constanteQuoteePrecedente=2;
                if(autoriserCstDansRacine !== true){
                    if(niveau === 0){
                        return(logerreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes'}));
                    }
                }
                /* methode3m */
                texte=texte.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,chLF).replace(/\r/g,chCR).replace(/\t/g,'\\t');
                indice++;
                chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                */
                type_precedent='c';
                niveauPrecedent=niveau;
                texte_precedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === l01 - 1){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash ne doit pas terminer une fonction'}));
                }
                /*  */
                c1=tableauEntree[i + 1][0];
                if(texte === ''){
                    premier=i;
                }
                texte+='\\' + c1;
                i++;
            }else{
                if(texte === ''){
                    premier=i;
                }
                texte+=c;
            }
            /*
              =============================================================================================
              Fin de Si on est dans une constante modèle
              =============================================================================================
              
              
              
            */
        }else if(dansCstSimple === true){
            /*
              
              
              
              =============================================================================================
              Si on est dans une constante simple
              =============================================================================================
            */
            if(c === '\''){
                if(autoriserCstDansRacine !== true){
                    if(i === l01 - 1){
                        return(logerreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes'}));
                    }
                }
                if(i + 1 < l01){
                    c1=tableauEntree[i + 1][0];
                    if(c1 === ','
                           || c1 === '\t'
                           || c1 === '\n'
                           || c1 === '\r'
                           || c1 === '/'
                           || c1 === ' '
                           || c1 === ')'
                    ){
                        dernier=i - 1;
                    }else{
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2() + 'il doit y avoir un caractère d\'echappement apres une constante encadrée par des apostrophes' ,
                                "type" : 'rev' ,
                                "texte" : texte ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                }else{
                    if(!(autoriserCstDansRacine === true)){
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2() + 'la racine ne peut pas contenir des constantes' ,
                                "type" : 'rev' ,
                                "texte" : texte ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                }
                if(autoriserCstDansRacine !== true){
                    if(niveau === 0){
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2() + 'la racine ne peut pas contenir des constantes' ,
                                "type" : 'rev' ,
                                "texte" : texte ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                }
                dansCstSimple=false;
                constanteQuotee=1;
                constanteQuoteePrecedente=1;
                /* methode3' */
                texte=texte.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,chLF).replace(/\r/g,chCR).replace(/\t/g,'\\t');
                indice++;
                chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                */
                type_precedent='c';
                niveauPrecedent=niveau;
                texte_precedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === l01 - 1){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash ne doit pas terminer une fonction'}));
                }
                /*  */
                c1=tableauEntree[i + 1][0];
                if(false){
                    if(texte === ''){
                        premier=i;
                    }
                    texte+=c1;
                    i++;
                }else if(c1 === '\\'
                       || c1 === '\''
                       || c1 === '/'
                       || c1 === 'n'
                       || c1 === 't'
                       || c1 === 'r'
                       || c1 === 'u'
                       || c1 === 'b'
                       || c1 === 'f'
                       || c1 === 'x'
                       || c1 === 'v'
                       || c1 === '0'
                       || c1 === '&'
                       || c1 === '$'
                ){
                    if(texte === ''){
                        premier=i;
                    }
                    texte+='\\' + c1;
                    i++;
                }else{
                    return(logerreur(__m_rev1.formatter_une_erreur_rev({
                            "__xst" : false ,
                            "ind" : i ,
                            "__xme" : __m_rev1.nl2()+'un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u' ,
                            "type" : 'rev' ,
                            "texte" : texte ,
                            "chaine_tableau" : chaine_tableau ,
                            "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                            "tableauEntree" : tableauEntree ,
                            "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                            "autoriserCstDansRacine" : autoriserCstDansRacine
                        })));
                }
            }else{
                if(texte === ''){
                    premier=i;
                }
                texte+=c;
            }
            /*
              =============================================================================================
              Fin de Si on est dans une constante simple
              =============================================================================================
              
              
              
            */
        }else{
            /*
              
              
              
              =============================================================================================
              on n'est pas dans un commentaire ou une constante,  
              donc c'est un nouveau type qu'il faut détecter
              =============================================================================================
            */
            if(c === '('){
                /*
                  =====================================================================================
                  Parenthèse ouvrante
                  =====================================================================================
                  
                  
                */
                pos_ouv_par=tableauEntree[i][2];
                if(texte === DEBUTCOMMENTAIRE){
                    dans_commentaire=true;
                    niveauDebutCommentaire=niveau;
                }
                if(texte === DEBUTBLOC){
                    dans_commentaire=true;
                    niveauDebutCommentaire=niveau;
                }
                if(drapeauParenthese){
                    tab_pour_recherche_parentheses.push(i);
                }
                /*
                  le nom d'une fonction peut être vide , par exemple dans le cas html, on écrit a[[href,'exemple']]
                */
                indice++;
                chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"f"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                /*
                  T.push(Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                */
                type_precedent='f';
                niveauPrecedent=niveau;
                niveau=niveau + 1;
                texte_precedent=texte;
                texte='';
                dansCstSimple=false;
                dansCstDouble=false;
                dansCstModele=false;
                dansCstRegex=false;
                /*
                  =====================================================================================
                  FIN DE Parenthèse ouvrante
                  =====================================================================================
                  
                  
                */
            }else if(c === ')'){
                /*
                  
                  
                  =====================================================================================
                  Parenthèse fermante
                  =====================================================================================
                */
                pos_fer_par=i;
                if(texte !== ''){
                    if(niveau === 0){
                        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : __m_rev1.nl2()+'une fermeture de parenthése ne doit pas être au niveau 0' ,
                                "type" : 'rev' ,
                                "chaine_tableau" : chaine_tableau ,
                                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                "tableauEntree" : tableauEntree ,
                                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                "autoriserCstDansRacine" : autoriserCstDansRacine
                            })));
                    }
                    indice++;
                    chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                    /*
                      T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    */
                    type_precedent='c';
                    niveauPrecedent=niveau;
                    texte_precedent=texte;
                    texte='';
                }else{
                    /*
                      à faire éventuellement, : parenthèse fermante avec un virgule avant : x(a,) 
                      ce n'est pas réellement à traiter car la virgule sera supprimée silencieusement
                      mais on peut éventuellement le signaler ... à voir
                    */
                }
                niveau--;
                if(drapeauParenthese){
                    if(i === l01 - 1){
                        /*
                          si on est en recherche de parenthèse correspondante et que c'est le dernier caractère du tableau en entrée
                          alors c'est une recherche de parenthèse ouvrante correspondante
                        */
                        chaine_tableau='[' + chaine_tableau + ']';
                        try{
                            T=JSON.parse(chaine_tableau);
                        }catch(ejson){
                            console.log('ejson=',ejson);
                            return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                    "erreur_conversion_chaine_tableau_en_json" : true ,
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : __m_rev1.nl2()+'erreur de conversion de tableau' ,
                                    "type" : 'rev' ,
                                    "chaine_tableau" : chaine_tableau ,
                                    "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                    "tableauEntree" : tableauEntree ,
                                    "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                    "autoriserCstDansRacine" : autoriserCstDansRacine
                                })));
                        }
                        if(rechercheParentheseCorrespondante === '('){
                            return({"__xst" : true ,"pos_fer_par" : tableauEntree[i][2]});
                        }else{
                            for( j=T.length - 1 ; j >= 0 ; j-- ){
                                if(T[j][3] < T[T.length - 1][3]){
                                    return({"__xst" : true ,"pos_ouv_par" : tableauEntree[T[j][11]][2]});
                                    break;
                                }
                            }
                        }
                    }else{
                        if(niveau === 0 && rechercheParentheseCorrespondante === '('){
                            /*
                              il faut retourner la position réelle en tenant compte des
                              caractères utf8
                            */
                            return({"__xst" : true ,"pos_fer_par" : tableauEntree[pos_fer_par][2]});
                        }
                    }
                }
                pos_fer_par=0;
                dansCstSimple=false;
                dansCstDouble=false;
                dansCstModele=false;
                dansCstRegex=false;
                /*
                  =====================================================================================
                  FIN de Parenthèse fermante
                  =====================================================================================
                  
                  
                */
            }else if(c === '\\'){
                /*
                  
                  
                  =====================================================================================
                  anti slash 
                  =====================================================================================
                */
                if(!dansCstSimple){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash doit être dans une constante en i=' + i}));
                }
                if(!dansCstDouble){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash doit être dans une constante en i=' + i}));
                }
                if(!dansCstModele){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash doit être dans une constante en i=' + i}));
                }
                if(!dansCstRegex){
                    return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'un antislash doit être dans une constante en i=' + i}));
                }
                /*
                  =====================================================================================
                  Fin d'un anti slash
                  =====================================================================================
                  
                  
                */
            }else if(c === '\''){
                /*
                  
                  
                  =====================================================================================
                  apostrophe '
                  =====================================================================================
                */
                premier=i;
                if(dansCstSimple === true){
                    dansCstSimple=false;
                }else{
                    if(texte !== ''){
                        indice++;
                        chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                        /*
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                        */
                        type_precedent='c';
                        niveauPrecedent=niveau;
                        texte_precedent=texte;
                        texte='';
                    }
                    dansCstSimple=true;
                }
                /*
                  =====================================================================================
                  FIN apostrophe
                  =====================================================================================
                  
                  
                */
            }else if(c === '/'){
                /*
                  =====================================================================================
                  regex /
                  =====================================================================================
                */
                premier=i;
                if(dansCstRegex === true){
                    dansCstRegex=false;
                }else{
                    if(texte !== ''){
                        indice++;
                        chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                        /*
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                        */
                        type_precedent='c';
                        niveauPrecedent=niveau;
                        texte_precedent=texte;
                        texte='';
                    }
                    dansCstRegex=true;
                }
                /*
                  =====================================================================================
                  FIN regex /
                  =====================================================================================
                */
            }else if(c === '`'){
                /*
                  
                  
                  =====================================================================================
                  modele `
                  =====================================================================================
                */
                premier=i;
                if(dansCstModele === true){
                    dansCstModele=false;
                }else{
                    if(texte !== ''){
                        indice++;
                        /*
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                        */
                        chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                        type_precedent='c';
                        niveauPrecedent=niveau;
                        texte_precedent=texte;
                        texte='';
                    }
                    dansCstModele=true;
                }
                /*
                  =====================================================================================
                  FIN modele `
                  =====================================================================================
                  
                  
                */
            }else if(c === '"'){
                /*
                  
                  
                  =====================================================================================
                  double quote "
                  =====================================================================================
                */
                premier=i;
                if(dansCstDouble === true){
                    dansCstDouble=false;
                }else{
                    if(texte !== ''){
                        indice++;
                        chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                        /*
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,pos_ouv_par,0,''));
                        */
                        type_precedent='c';
                        niveauPrecedent=niveau;
                        texte_precedent=texte;
                        texte='';
                    }
                    dansCstDouble=true;
                }
                /*
                  =====================================================================================
                  FIN double quote "
                  =====================================================================================
                  
                  
                */
            }else if(c === ','){
                /*
                  
                  
                  
                  =====================================================================================
                  virgule donc séparateur
                  =====================================================================================
                */
                if(texte !== ''){
                    if(autoriserCstDansRacine !== true){
                        if(niveau === 0){
                            return(logerreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes'}));
                        }
                    }
                    indice++;
                    chaine_tableau+=',[' + indice + ',"' + texte + '","c",' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + pos_ouv_par + ',0,""]';
                    /*
                      T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    */
                    texte_precedent='';
                    texte='';
                    type_precedent='c';
                    niveauPrecedent=niveau;
                }else{
                    if(type_precedent === 'f'){
                        if(niveauPrecedent === niveau){
                            /*
                              cas très spécial : todo
                            */
                            type_precedent='c';
                            texte_precedent='';
                            constanteQuoteePrecedente=0;
                        }else{
                            if(niveauPrecedent < niveau){
                                return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                        "__xst" : false ,
                                        "ind" : premier ,
                                        "__xme" : __m_rev1.nl2()+'une virgule ne doit pas être précédée d\'un vide' ,
                                        "type" : 'rev' ,
                                        "texte" : texte ,
                                        "chaine_tableau" : chaine_tableau ,
                                        "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                        "tableauEntree" : tableauEntree ,
                                        "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                        "autoriserCstDansRacine" : autoriserCstDansRacine
                                    })));
                            }
                        }
                    }else{
                        if(niveauPrecedent < niveau){
                            return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : premier ,
                                    "__xme" : __m_rev1.nl2()+'une virgule ne doit pas être précédée d\'un vide' ,
                                    "type" : 'rev' ,
                                    "texte" : texte ,
                                    "chaine_tableau" : chaine_tableau ,
                                    "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                    "tableauEntree" : tableauEntree ,
                                    "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                    "autoriserCstDansRacine" : autoriserCstDansRacine
                                })));
                        }else if(niveauPrecedent === niveau && texte_precedent === '' && constanteQuoteePrecedente === 0){
                            return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : premier ,
                                    "__xme" : __m_rev1.nl2()+'une virgule ne doit pas être précédée d\'un vide ' ,
                                    "type" : 'rev' ,
                                    "texte" : texte ,
                                    "chaine_tableau" : chaine_tableau ,
                                    "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                    "tableauEntree" : tableauEntree ,
                                    "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                    "autoriserCstDansRacine" : autoriserCstDansRacine
                                })));
                        }
                    }
                }
                dansCstSimple=false;
                dansCstDouble=false;
                dansCstModele=false;
                dansCstRegex=false;
                /*
                  =====================================================================================
                  FIN virgule donc séparateur
                  =====================================================================================
                  
                  
                  
                */
            }else if(c === ' ' || c === '\t' || c === '\r' || c === '\n'){
                /*
                  
                  
                  
                  =====================================================================================
                  caractères séparateurs de mot
                  =====================================================================================
                */
                if(texte !== ''){
                    if(autoriserCstDansRacine !== true){
                        if(niveau === 0){
                            return(logerreur(__m_rev1.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : premier ,
                                    "__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes' ,
                                    "type" : 'rev' ,
                                    "texte" : texte ,
                                    "chaine_tableau" : chaine_tableau ,
                                    "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                    "tableauEntree" : tableauEntree ,
                                    "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                    "autoriserCstDansRacine" : autoriserCstDansRacine
                                })));
                        }
                    }
                    indice++;
                    chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,0,0,""]';
                    /*
                      T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    */
                    type_precedent='c';
                    niveauPrecedent=niveau;
                    texte_precedent=texte;
                    texte='';
                    dansCstSimple=false;
                    dansCstDouble=false;
                    dansCstModele=false;
                    dansCstRegex=false;
                }
                /*
                  =====================================================================================
                  FIN de caractères séparateurs de mot
                  =====================================================================================
                  
                  
                */
            }else{
                if(texte === ''){
                    premier=i;
                }
                dernier=i;
                texte+=c;
            }
        }
    }
    /*
      =============================================================================================================
      on est en dehors de la boucle principale
      =============================================================================================================
    */
    if(niveau !== 0 && quitterSiErreurNiveau){
        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                "__xst" : false ,
                "ind" : l01 - 1 ,
                "__xme" : __m_rev1.nl2()+'💥 des parenthèses ne correspondent pas, (' + (niveau > 0 ? ( 'il en manque :' ) : ( 'il y en a trop : ' )) + 'niveau=' + niveau + ') ' ,
                "type" : 'rev' ,
                "texte" : texte ,
                "chaine_tableau" : chaine_tableau ,
                "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                "tableauEntree" : tableauEntree ,
                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                "autoriserCstDansRacine" : autoriserCstDansRacine
            })));
    }
    /*
      Si on autorise les constantes à la racine, il reste peut être du texte à traiter
    */
    if(texte !== ''){
        indice=indice + 1;
        if(autoriserCstDansRacine !== true){
            if(niveau === 0){
                return(logerreur(__m_rev1.formatter_une_erreur_rev({
                        "__xst" : false ,
                        "ind" : l01 - 1 ,
                        "__xme" : __m_rev1.nl2()+'la racine ne peut pas contenir des constantes ' ,
                        "type" : 'rev' ,
                        "texte" : texte ,
                        "chaine_tableau" : chaine_tableau ,
                        "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                        "tableauEntree" : tableauEntree ,
                        "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                        "autoriserCstDansRacine" : autoriserCstDansRacine
                    })));
            }
        }
        /*
          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
        */
        chaine_tableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,0,0,""]';
        type_precedent='c';
        niveauPrecedent=niveau;
    }
    /*
      =============================================================================================================
      On reconstruit chaine_tableau ici
      =============================================================================================================
    */
    chaine_tableau='[' + chaine_tableau + ']';
    try{
        T=JSON.parse(chaine_tableau);
    }catch(ejson){
        return(logerreur(__m_rev1.formatter_une_erreur_rev({
                "ejson" : ejson ,
                "erreur_conversion_chaine_tableau_en_json" : true ,
                "__xst" : false ,
                "__xme" : __m_rev1.nl2()+'erreur de conversion de tableau' ,
                "type" : 'rev' ,
                "chaine_tableau" : chaine_tableau ,
                "tableauEntree" : tableauEntree ,
                "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                "autoriserCstDansRacine" : autoriserCstDansRacine
            })));
    }
    if(drapeauParenthese){
        l01=T.length;
        for( i=l01 - 1 ; i >= 0 ; i-- ){
            if(T[i][3] === niveau){
                /*
                  à cause des décallages utf8, il faut prendre la position réelle dans le tableau en entrée
                */
                return({"__xst" : true ,"pos_ouv_par" : tableauEntree[T[i][11]][2]});
            }
        }
        return({"__xst" : false ,"__xme" : 'pas de correspondance trouvée'});
    }
    if(chaine_tableau_commentaires !== ''){
        chaine_tableau_commentaires='[' + chaine_tableau_commentaires.substr(1) + ']';
        try{
            tabCommentaireEtFinParentheses=JSON.parse(chaine_tableau_commentaires);
        }catch(e){
            debugger;
        }
        /*
          Puis on ajoute les commentaires 
          tabCommentaireEtFinParentheses[indiceTabCommentaire]=[indice,commentaire];
          T[indice][13]=commentaire;
        */
        var rgx1=new RegExp(chLF,"g");
        var rgx2=new RegExp(chCR,"g");
        l01=tabCommentaireEtFinParentheses.length;
        for( i=0 ; i < l01 ; i++ ){
            T[tabCommentaireEtFinParentheses[i][0]][13]=tabCommentaireEtFinParentheses[i][1].replace(rgx1,'\n').replace(rgx2,'\r');
        }
    }
    /*
      =============================================================================================================
      mise à jour de l'id du parent[7] et du nombre d'enfants[8]
      =============================================================================================================
    */
    l01=T.length;
    for( i=l01 - 1 ; i > 0 ; i-- ){
        k=T[i][3];
        for( j=i - 1 ; j >= 0 ; j-- ){
            if(T[j][3] === k - 1){
                T[i][7]=j;
                T[j][8]++;
                break;
            }
        }
    }
    /*
      =============================================================================================================
      numéro d'enfant + bidouille performances car on boucle souvent sur les enfants
      numenfant = k
      en position 12, on met l'indice de l'enfant suivant ou l01 
      =============================================================================================================
    */
    var indice_enfant_precedent=0;
    for( i=0 ; i < l01 ; i++ ){
        k=0;
        for( j=i + 1 ; j < l01 && T[j][3] > T[i][3] ; j++ ){
            if(T[j][7] === T[i][0]){
                k++;
                T[j][9]=k;
                /*
                  pour le dernier, on met l01 à priori 
                  et on mettra la vraie valeur à la prochaine boucle
                */
                T[j][12]=l01;
                if(k > 1){
                    T[indice_enfant_precedent][12]=j;
                }
                indice_enfant_precedent=j;
            }
        }
    }
    /*
      =============================================================================================================
      profondeur des fonctions
      k=remonterAuNiveau
      l=idParent
      =============================================================================================================
    */
    var niveau=0;
    var id_parent=0;
    for( i=l01 - 1 ; i > 0 ; i-- ){
        /* si c'est une constante */
        if(T[i][2] === 'c'){
            T[i][10]=0;
        }
        if(T[i][7] > 0){
            /* si l'élément a un parent */
            niveau=T[i][3];
            id_parent=T[i][7];
            /* pour chacun des niveaux enfants */
            for( j=1 ; j <= niveau ; j++ ){
                if(T[id_parent][10] < j){
                    /* on change la profondeur */
                    T[id_parent][10]=j;
                }
                id_parent=T[id_parent][7];
            }
        }
    }
    /*
      //pour la mesure des performances
      var endMicro = performance.now();
      var temps=parseInt((endMicro - startMicro) * 1000,10) / 1000;
      if(temps >=0.2){
      console.log(' temps = '+temps +' pour T.length='+T.length);
      if(false && T.length<=5){
      console.log('T=',T);
      }
      }
    */
    return({"__xst" : true ,"__xva" : T});
}