"use strict";
/*
  =====================================================================================================================
  __m_rev1
*/
class c_rev1{
    #nom_de_la_variable='';
    #NBESPACESSOURCEPRODUIT=4;
    #NBESPACESREV=3;
    /*__m_rev1.globale_messages*/
    globale_messages={
        "erreurs" : [] ,
        "avertissements" : [] ,
        "infos" : [] ,
        "lignes" : [] ,
        "ids" : [] ,
        "plages" : [] ,
    };
    /* function constructor */
    constructor(nom_de_la_variable){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    
    /*
      =====================================================================================================================
      met les valeurs dans la variable globale_messages ( l og erreu r ) logerreur __m_rev1.empiler_erreur
      =====================================================================================================================
    */
    empiler_erreur(o){
        var a_retourner={
            "__xst" : o.hasOwnProperty('__xst') ? ( o.__xst ) : ( false ) ,
            "__xva" : o.hasOwnProperty('__xva') ? ( o.__xva ) : ( null ) ,
            "masquee" : o.hasOwnProperty('masquee') ? ( o.masquee ) : ( false ) ,
            "plage" : o.hasOwnProperty('plage') ? ( o.plage ) : ( null ) ,
            "ligne" : o.hasOwnProperty('ligne') ? ( o.ligne ) : ( null )
        };
        if(o.hasOwnProperty('__xme')){
            a_retourner[__xme]=o.__xme;
        }
        if(o.hasOwnProperty('__xav')){
            a_retourner['__xav']=o.__xav;
        }
        if(o.hasOwnProperty('__xms')){
            for(var i in o.__xms){
                a_retourner.__xme=o.__xms[i];
                this.globale_messages['erreurs'].push(a_retourner);
            }
        }else{
            if(a_retourner.hasOwnProperty('__xav')){
                this.globale_messages['avertissements'].push(a_retourner);
            }
            if(a_retourner.__xst === false){
                this.globale_messages['erreurs'].push(a_retourner);
            }else{
                this.globale_messages['infos'].push(a_retourner);
            }
        }
        return a_retourner;
    }
    
    /*
      =============================================================================================================
      fonction respr (__m_rev1.#respr) PRIVÉE : retour chariot + nouvelle ligne + n espaces dans les rev produits
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
      fonction resps (__m_rev1.resps) : retour chariot + nouvelle ligne + n espaces dans les sources produits
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
      fonction est_num (__m_rev1.est_num) : est numérique ?
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
      fonction entitees_html (__m_rev1.entitees_html)  transforme un texte pour qu'il  soit visible en html, par exemple &nbsp; ou bien <
      =============================================================================================================
    */
    entitees_html(s){
        return(s.replace(/&/g,'&amp;').replace('<','&lt;').replace('>','&gt;'));
    }
    /*
      =====================================================================================================================
      numéro de ligne courant du js (__m_rev1.nl2)( n l 1 )
      =====================================================================================================================
    */
    nl2(e_originale){
        var e=null;
        if(e_originale !== undefined){
            e=e_originale;
        }else{
            e=new Error();
        }
        if(!e.stack){
            try{
                /* IE ?? */
                throw e;
            }catch(e){
                if(!e.stack){
                    /* IE < 10 ? */
                    return 0;
                }
            }
        }
        var nom_fonction='';
        if(e_originale !== undefined){
            var stack=e.stack.toString().split(/\r\n|\n/);
            /* We want our caller's frame. It's index into |stack| depends on the */
            /* browser and browser version, so we need to search for the second frame: */
            var modele_champ_erreur=/:(\d+):(?:\d+)[^\d]*$/;
            var modele_champ_erreur2=/:(\d+):(\d+).*$/;
            var continuer=50;
            do{
                var ligne_erreur=stack.shift();
                if(ligne_erreur.indexOf(' at ')){
                    if(modele_champ_erreur2.exec(ligne_erreur) !== null){
                        continuer=-1;
                    }
                }
                continuer--;
            }while(continuer > 0);
            if(continuer === -2){
                /* at nom_fonction (http://localhost/a/b/c/js/fichier.js:25:15) */
                /* var texte_erreur=stack.shift(); */
                var texte_erreur=ligne_erreur;
                var nom_fichier=texte_erreur.match(/\/([^\/:]+):/)[1];
                nom_fonction='';
                if(texte_erreur.match(/ at ([^\.]+) \(/) === null){
                    if(texte_erreur.match(/ at ([^]+) \(/) === null){
                        if(texte_erreur.match(/([^]+)\/([^]+)/)[2] !== null){
                            nom_fonction='erreur javascript ' + texte_erreur.match(/([^]+)\/([^]+)/)[2];
                        }
                    }else{
                        nom_fonction=texte_erreur.match(/ at ([^]+) \(/)[1];
                    }
                }else{
                    nom_fonction=texte_erreur.match(/ at ([^\.]+) \(/)[1];
                }
                var numero_de_ligne=modele_champ_erreur.exec(texte_erreur)[1];
                return('^G ' + numero_de_ligne + ' ' + nom_fichier + ' ' + nom_fonction + ' ' + ' ');
            }else{
                console.error(e_originale);
                return 'Erreur non traçable';
            }
        }else{
            var stack=e.stack.toString().split(/\r\n|\n/);
            /* We want our caller's frame. It's index into |stack| depends on the */
            /* browser and browser version, so we need to search for the second frame: */
            var modele_champ_erreur=/:(\d+):(?:\d+)[^\d]*$/;
            do{
                var ligne_erreur=stack.shift();
            }while(!modele_champ_erreur.exec(ligne_erreur) && stack.length);
            /* at nom_fonction (http://localhost/a/b/c/js/fichier.js:25:15) */
            var texte_erreur=stack.shift();
            var nom_fichier=texte_erreur.match(/\/([^\/:]+):/)[1];
            if(texte_erreur.match(/ at ([^\.]+) \(/) === null){
                if(texte_erreur.match(/ at ([^]+) \(/) === null){
                    /*
                      dans firefox, il n'y a pas de " at ":
                      #traite_inline@http://www.exemple.fr/toto.js:290:31
                    */
                    if(texte_erreur.match(/([^]+)@/)){
                        nom_fonction=texte_erreur.match(/([^]+)@/)[1];
                    }
                }else{
                    nom_fonction=texte_erreur.match(/ at ([^]+) \(/)[1];
                }
            }else{
                nom_fonction=texte_erreur.match(/ at ([^\.]+) \(/)[1];
            }
            var numero_de_ligne=modele_champ_erreur.exec(texte_erreur)[1];
            return('^G ' + nom_fichier + ' ' + nom_fonction + ' ' + numero_de_ligne + ' ');
        }
    }
    
    /*
      =====================================================================================================================
      fonction transforme un commentaire pour un fichier rev
      =====================================================================================================================
    */
    tr_commentaire_rev1(texte,niveau,ind){
        var s='';
        s=this.#traiteCommentaireSourceEtGenere1(texte,niveau,ind,this.#NBESPACESREV,true);
        return s;
    }
    /*
      =====================================================================================================================
      fonction tr_co_src : (__m_rev1.tr_co_src) transforme un commentaire pour un fichier js/php/sql ... traiteCommentaire2
    */
    tr_co_src(texte,niveau,ind){
        var s='';
        s=this.#traiteCommentaireSourceEtGenere1(texte,niveau,ind,this.#NBESPACESSOURCEPRODUIT,false);
        return s;
    }
    /*
      =====================================================================================================================
      fonction transforme un commentaire 
      =====================================================================================================================
    */
    #traiteCommentaireSourceEtGenere1(texte,niveau,ind,nbEspacesSrc1,fichierRev0){
        /* Si c'est un commentaire monoligne, on le retourne sans aucune transformation */
        i=texte.indexOf('\n');
        if(i < 0){
            return texte;
        }
        /*  */
        var i=0;
        var j=0;
        let l01=0;
        var min=0;
        var t='';
        var ligne='';
        var temps='';
        var unBloc='';
        var unBlocPlus1='';
        var newTab=[];
        var tab=[];
        var ne_contient_que_des_egals=false;
        var double_commentaire=false;
        /*  */
        unBloc=' '.repeat(nbEspacesSrc1 * niveau);
        tab=texte.replace(/\r/g,'').split('\n');
        l01=tab.length;
        /*  */
        if(texte.length > 1 && (texte.substr(0,1) === '#' || texte.substr(0,1) === '*')){
            if(texte.length > 2 && texte.substr(1,1) === '#'){
                /*
                  un commentaire qui commence par ## sera décalé à gauche
                */
                double_commentaire=true;
            }
            /*
              on a un commentaire de type bloc non formaté 
              car le premier caractère = #.
              On supprime les espaces inutiles en début de ligne.
            */
            t='';
            /* minimim d'espaces au début de chaque ligne */
            min=120;
            for( i=1 ; i < l01 ; i++ ){
                ligne=tab[i];
                for( j=0 ; j < ligne.length ; j++ ){
                    /*
                      on balaye toutes les lignes pour détecter 
                      le nombre d'espaces minimal à gauche
                    */
                    temps=ligne.substr(j,1);
                    if(temps !== ' '){
                        if(j < min){
                            /* on réajuste le minimum d'espaces au début de chaque ligne */
                            min=j;
                        }
                        /* et on passe à la ligne suivante */
                        break;
                    }
                }
            }
            if(min > 2){
                /* tout décaler à gauche */
                for( i=1 ; i < l01 ; i++ ){
                    tab[i]=tab[i].substr(min - 2);
                }
            }
            /* si c'est un fichierRev0, on doit avoir la dernière ligne vide */
            if(fichierRev0){
                /*
                  on retire les lignes vierges de la fin 
                */
                for( i=tab.length - 1 ; i >= 1 ; i-- ){
                    if(tab[i].trim() === ''){
                        tab.splice(i,1);
                    }else{
                        break;
                    }
                }
                l01=tab.length;
                if(double_commentaire === false){
                    t=' '.repeat(nbEspacesSrc1 * niveau);
                    for( i=1 ; i < l01 ; i++ ){
                        tab[i]=t + tab[i];
                    }
                }
                texte=tab.join(CRLF) + CRLF + ' '.repeat(niveau * nbEspacesSrc1);
            }else{
                /* on retire les lignes vierges de la fin */
                for( i=tab.length - 1 ; i >= 1 ; i-- ){
                    if(tab[i].trim() === ''){
                        tab.splice(i,1);
                    }else{
                        break;
                    }
                }
                l01=tab.length;
                if(double_commentaire === false){
                    t=' '.repeat(nbEspacesSrc1 * niveau);
                    for( i=1 ; i < l01 ; i++ ){
                        tab[i]=t + tab[i];
                    }
                }
                texte=tab.join(CRLF) + CRLF + ' '.repeat(niveau * nbEspacesSrc1);
            }
            return texte;
        }
        /*
          si on est ici, c'est qu'on a un commentaire multiligne
          qu'il faut formatter en alignant à gauche les textes 
          d'un nombre d'espaces correspondant au niveau
        */
        unBlocPlus1=' '.repeat(nbEspacesSrc1 * niveau + 2);
        var s1='';
        var s2='';
        for( i=0 ; i < l01 ; i++ ){
            t='';
            /* les CR (les zimac) ne sont pas faits pour écrire des vrais programmes ! */
            tab[i]=tab[i].replace(/\r/g,'');
            /* on enlève les espaces au début */
            for( j=0 ; j < tab[i].length ; j++ ){
                temps=tab[i].substr(j,1);
                if(temps !== ' '){
                    t+=tab[i].substr(j);
                    break;
                }
            }
            s1=unBloc + t;
            s2=unBlocPlus1 + t;
            if(i === l01 - 1){
                /* la dernière ligne du commentaire de bloc doit être vide */
                if(t === ''){
                    newTab.push(unBloc);
                }else{
                    /* on met la ligne et on ajoute une ligne vide */
                    newTab.push(s2);
                    newTab.push(unBloc);
                }
            }else if(i === 0){
                /* la première ligne du commentaire de bloc doit être vide */
                if(t === ''){
                    newTab.push(t);
                }else{
                    /*
                      on ajoute une ligne vide en début de tableau
                      on fait un unshift ici mais on aurait pu faire
                      un push car on est à i=0
                    */
                    newTab.unshift('');
                    newTab.push(s2);
                }
            }else{
                newTab.push(s2);
            }
        }
        l01=newTab.length;
        var l02=0;
        var calcul=0;
        for( i=0 ; i < l01 ; i++ ){
            ligne=newTab[i];
            if(ligne.indexOf('====') >= 0){
                ne_contient_que_des_egals=true;
                l02=ligne.length;
                for( j=0 ; j < l02 ; j++ ){
                    if(!(ligne.substr(j,1) === '=' || ligne.substr(j,1) === ' ')){
                        ne_contient_que_des_egals=false;
                        break;
                    }
                }
                if(ne_contient_que_des_egals === true){
                    calcul=117 - 2 * niveau * nbEspacesSrc1;
                    if(calcul > 0){
                        newTab[i]='  ' + ' '.repeat(niveau * nbEspacesSrc1) + '='.repeat(calcul);
                    }
                }
            }
        }
        t=newTab.join(CRLF);
        return t;
    }
    
    /*
      =====================================================================================================================
      construit des espaces pour l'indentation des sources rev
      =====================================================================================================================
    */
    espacesnrev(i){
        var t='\r\n';
        if(i > 0){
            t+=' '.repeat(NBESPACESREV * i);
        }
        return t;
    }
    
    
    /*#
      =====================================================================================================================
      fonction matrice_vers_source_rev1 (__m_rev1.matrice_vers_source_rev1)
      Reconstitue un texte source à partir du tableau représentant la matrice  du  programme
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
            var les_espaces=this.espacesnrev(tab[debut][3]);
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
                }else if(tab[i][2] === 'f' && tab[i][1] === '#'){
                    /*
                      =============================================================================
                      on est dans un commentaire
                      =============================================================================
                    */
                    commentaire=this.tr_commentaire_rev1(tab[i][13],tab[i][3],i);
                    t+=tab[i][1] + '(' + commentaire + ')';
                    count++;
                    if(contient_un_defTab_tbel === true && count% 10 === 0){
                        t+=les_espaces;
                    }
                }else if(tab[i][2] === 'f' && tab[i][1] === '@'){
                    /*
                      =============================================================================
                      on est dans un bloc en dur, par exemple si on a :
                      <script type="xxxx">a=1;</script>
                      le type xxxx n'est pas connu et on ne peut pas être certain que le contenu
                      sera en javascript donc on met le code "en dur" comme ceci :
                      script( ( 'type' , "xxxx" ) , @(a=1;))
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
                                    t+=this.espacesnrev(tab[debut][3]);
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
    /*
      =====================================================================================================================
      fonction qui se base sur la colonne 3[niveau] d'une matrice pour recalculer 
      - le parent[7], 
      - le nombre d'enfants[8], 
      - le numéro d'enfant[9]
      - la profondeur[10]
      __m_rev1.indicer_le_tableau reIndicerLeTableau
      =====================================================================================================================
    */
    indicer_le_tableau(tab){
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
      fonction qui supprime un élément dans la matrice et descend les enfants de cet élément d'un niveau
      concat(concat(a,b),c) => concat(a,b,c) baisserNiveauEtSupprimer __m_rev1.baisser_le_niveau_et_supprimer
      =====================================================================================================================
    */
    baisser_le_niveau_et_supprimer(tab,id,niveau){
        var i=0;
        for( i=id + 1 ; i < tab.length ; i++ ){
            if(tab[i][7] === id){
                tab[i][3]=tab[i][3] - 1;
                if(tab[i][2] === 'f'){
                    /*
                      appel récursif pour baisser le niveau des enfants des enfants des enfants ....
                    */
                    this.baisser_le_niveau_et_supprimer(tab,i,niveau+1);
                }
            }
        }
        if(niveau === 0){
            /*
              à la fin, on supprime l'élément et on recalcul les indices
            */
            tab.splice(id,1);
            tab=this.indicer_le_tableau(tab);
            return tab;
        }
    }
    
    /*
      =====================================================================================================================
      fonction qui supprime un élément et ses enfants dans la matrice
      on supprime c de "a(b,c(d))" => a(b)
      __m_rev1.supprimer_un_element_de_la_matrice
      =====================================================================================================================
    */
    supprimer_un_element_de_la_matrice(tab,id,niveau,a_supprimer){
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
                    this.supprimer_un_element_de_la_matrice(tab,tab[i][0],niveau + 1,a_supprimer);
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
            tab=this.indicer_le_tableau(tab);
            return tab;
        }
    }
    
    /*
      =====================================================================================================================
      Des fonctions raccourcies __m_rev1.rev_tm ( texte au format rev vers matrice sans constante dans la racine ) 
      =====================================================================================================================
    */
    rev_tm(texte_rev){
        var tableau1=this.txt_en_tableau(texte_rev);
        var matrice_fonction=this.tb_vers_matrice( tableau1.__xva , /*niv*/true , /*cst_dlr*/false , /*par*/'');
        return matrice_fonction;
    }
    /*
      =====================================================================================================================
      Des fonctions raccourcies __m_rev1.rev_tcm ( texte au format rev vers matrice avec constante dans la racine ) 
      =====================================================================================================================
    */
    rev_tcm(texte_rev){
        var tableau1=this.txt_en_tableau(texte_rev);
        var matrice_fonction=this.tb_vers_matrice(tableau1.__xva,/*niv*/true,/*cst_dlr*/true,/*par*/'');
        return matrice_fonction;
    }
    /*
      =====================================================================================================================
      Des fonctions raccourcies __m_rev1.rev_parenthe1 ( recherche de parenthèses )
      =====================================================================================================================
    */
    rev_parenthe1(texte_rev,/* ouvrante ou fermante */parenthese){
        var tableau1=this.txt_en_tableau(texte_rev);
        var matrice_fonction=this.tb_vers_matrice(tableau1.__xva,/*niv*/false,/*cst_dlr*/false,parenthese);
        return matrice_fonction;
    }
    
    /*
      =============================================================================================================
      fonction txt_en_tableau (__m_rev1.txt_en_tableau) : transforme un texte en tableau, 
      =============================================================================================================
    */
    txt_en_tableau(str){
        const l01=str.length;
        var tab=[];
        var i=0;
        var exceptions=0;
        var numLigne=0;
        var codeCaractere='';
        var temp=0;
        var indiceTab=0;
        for( i=0 ; i < l01 ; i++ ){
            codeCaractere=str.charCodeAt(i);
            /*
              on ne traite pas les zero width space , vertical tab
              8203 = 0x200B
              11   = 0x0B
            */
            if(!(codeCaractere === 8203 || codeCaractere === 11)){
                /*
                  0xD800 = 55296 = 1101 1000 0000 0000  , 0xF800 = 63488 = 1111 1000 0000 0000
                */
                temp=codeCaractere & 0xF800;
                if(temp === 55296){
                    tab[indiceTab]=[str.substr(i,2),2,i,numLigne];
                    indiceTab++;
                    i++;
                }else{
                    tab[indiceTab]=[str.substr(i,1),1,i,numLigne];
                    indiceTab++;
                    /*10 = x0A = \n */
                    if(codeCaractere === 10){
                        numLigne++;
                    }
                }
            }else{
                exceptions=exceptions + 1;
            }
        }
        
        return({"__xva" : tab ,"numLigne" : numLigne ,"exceptions" : exceptions});
    }
    /*
      =====================================================================================================================
      function formatter_une_erreur_rev __m_rev1 formatter uns erreur dans le rev pour la rendre plus facilement détectable
      =====================================================================================================================
    */
    formatter_une_erreur_rev(obj){
        /*# 
          exemple de donnée en entrée
          {
            type          : 'rev',
            __xst         : false,
            ind           : i,
            __xme         : '1839 il ne peut pas y avoir des retours à la ligne dans une chaine de type regex ',
            texte         : texte,
            chaine_tableau : chaine_tableau,
            chaine_tableau_commentaires:chaine_tableau_commentaires
            tableauEntree : tableauEntree,
            quitterSiErreurNiveau:quitterSiErreurNiveau,
            autoriserCstDansRacine:autoriserCstDansRacine
          }
        */
        var t='';
        var i=0;
        var j=0;
        var finGrasFait=false;
        var presDe='';
        var ligne=0;
        var message_ajoute='';
        var position=0;
        if(obj.hasOwnProperty('erreur_conversion_chaineTableau_en_json') && obj.erreur_conversion_chaineTableau_en_json === true){
            /*
              si il y a un problème avec le JSON.parse:
            */
            if(obj.ejson.message.indexOf('at position ') >= 0){
                position=obj.ejson.message.substr(obj.ejson.message.indexOf('at position ') + 12);
                if(obj.ejson.message.indexOf(' ') >= 0){
                    position=parseInt(position.substr(0,obj.ejson.message.indexOf(' ')),10);
                    for( i=position ; i >= 0 && message_ajoute === '' ; i-- ){
                        if(obj.chaine_tableau.substr(i,1) === '['){
                            for( j=i ; j < obj.chaine_tableau.length && message_ajoute === '' ; j++ ){
                                if(obj.chaine_tableau.substr(j,1) === ']'){
                                    message_ajoute='près de `' + obj.chaine_tableau.substr(i,(j - i) + 1) + '`';
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return({"__xst" : obj.__xst ,"__xva" : '' ,"id" : obj.ind ,"__xme" : obj.__xme + ' ' + message_ajoute});
        }
        var chaine_tableau='[' + obj.chaine_tableau + ']';
        if(obj.hasOwnProperty('tableauEntree')){
            if(obj.hasOwnProperty('ind')){
                if(obj.ind > 50){
                    for( i=obj.ind - 50 ; i <= obj.ind + 50 && i < obj.tableauEntree.length ; i++ ){
                        if(i === obj.ind - 5){
                            presDe+='<b>';
                        }
                        presDe+=this.entitees_html(obj.tableauEntree[i][0]);
                        if(i === obj.ind + 5){
                            presDe+='</b>';
                            finGrasFait=true;
                        }
                    }
                    if(!finGrasFait){
                        presDe+='</b>';
                    }
                }else{
                    presDe='<b>';
                    for( i=0 ; i <= obj.ind + 50 && i < obj.tableauEntree.length ; i++ ){
                        presDe+=this.entitees_html(obj.tableauEntree[i][0]);
                        if(i === obj.ind + 5){
                            presDe+='</b>';
                            finGrasFait=true;
                        }
                    }
                    if(!finGrasFait){
                        presDe+='</b>';
                    }
                }
                message_ajoute+=' position caractère=' + obj.ind + '';
                message_ajoute+='<br />près de ----' + presDe + '----<br />';
                ligne=0;
                for( i=obj.ind ; i >= 0 ; i-- ){
                    if(obj.tableauEntree[i][0] === '\n'){
                        ligne++;
                    }
                }
            }
        }
        var T=JSON.parse(chaine_tableau);
        return({"__xst" : obj.__xst ,"__xva" : T ,"id" : obj.ind ,"__xme" : obj.__xme + message_ajoute ,"ligne" : ligne+1});
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
      le programme source est sous la forme tableau car certains caractères utf-8 sont codés sur 2 mots.
      la fonction txt_en_tableau permet de construire ce tableau
      __m_rev1.tb_vers_matrice (ancien functionToArray2)
      =====================================================================================================================
      =====================================================================================================================
      =====================================================================================================================
    */
    tb_vers_matrice(tableauEntree,quitterSiErreurNiveau,autoriserCstDansRacine,rechercheParentheseCorrespondante){
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
                                return(this.empiler_erreur(this.formatter_une_erreur_rev({ 
                                        "__xst" : false ,
                                        "ind" : i ,
                                        "__xme" : this.nl2()+'les parenthèses ne se finissent pas à la fin du rev' ,
                                        "type" : 'rev' ,
                                        "texte" : texte ,
                                        "chaine_tableau" : chaine_tableau ,
                                        "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                        "tableauEntree" : tableauEntree ,
                                        "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                        "autoriserCstDansRacine" : autoriserCstDansRacine
                                    })));
                            }else{
                                return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                        "__xst" : false ,
                                        "ind" : i ,
                                        "__xme" : this.nl2()+'le niveau ' ,
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2()+'une constante encadrée par des guillemets est incorrecte ' ,
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2()+'la racine ne peut pas contenir des constantess ' ,
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
                        return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : this.nl2()+'la racine ne peut pas contenir des constantes ' ,
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
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash ne doit pas terminer une constante en i=' + i}));
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
                        return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : this.nl2()+'un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u ' ,
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
                            return(this.empiler_erreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : this.nl2()+'la racine ne peut pas contenir des constantes'}));
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
                            return(this.empiler_erreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : this.nl2()+'la racine ne peut pas contenir des constantes'}));
                        }
                    }
                    dansCstRegex=false;
                    constanteQuotee=4;
                    constanteQuoteePrecedente=4;
                    if(autoriserCstDansRacine !== true){
                        if(niveau === 0){
                            return(this.empiler_erreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : this.nl2()+'la racine ne peut pas contenir des constantes'}));
                        }
                    }
                    /* methode3regex */
                    texte=texte.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
                    if(texte.indexOf('\n') > 0 || texte.indexOf('\r') >= 0 || texte.indexOf('\t') > 0){
                        return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : premier ,
                                "__xme" : this.nl2()+'il ne peut pas y avoir des retours à la ligne ou des tabulations dans une chaine de type regex ' ,
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
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash ne doit pas terminer une fonction'}));
                    }
                    /*  */
                    c1=tableauEntree[i + 1][0];
                    if(texte === ''){
                        premier=i;
                    }
                    texte+='\\' + c1;
                    i++;
                }else if(c === '\n' || c === '\r'){
                    return(this.empiler_erreur(this.formatter_une_erreur_rev({
                            "__xst" : false ,
                            "ind" : premier ,
                            "__xme" : this.nl2()+'il ne peut pas y avoir des retours à la ligne dans une chaine de type regex ' ,
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2() + 'la racine ne peut pas contenir des constantes' ,
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2() + 'apres une constante, il doit y avoir un caractère d\'echappement' ,
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
                            return(this.empiler_erreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : this.nl2()+'la racine ne peut pas contenir des constantes'}));
                        }
                    }
                    dansCstModele=false;
                    constanteQuotee=2;
                    constanteQuoteePrecedente=2;
                    if(autoriserCstDansRacine !== true){
                        if(niveau === 0){
                            return(this.empiler_erreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : this.nl2()+'la racine ne peut pas contenir des constantes'}));
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
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash ne doit pas terminer une fonction'}));
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
                            return(this.empiler_erreur({"__xst" : false ,"id" : i ,"__xva" : T ,"__xme" : this.nl2()+'la racine ne peut pas contenir des constantes'}));
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2() + 'il doit y avoir un caractère d\'echappement apres une constante encadrée par des apostrophes' ,
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2() + 'la racine ne peut pas contenir des constantes' ,
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2() + 'la racine ne peut pas contenir des constantes' ,
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
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash ne doit pas terminer une fonction'}));
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
                        return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                "__xst" : false ,
                                "ind" : i ,
                                "__xme" : this.nl2()+'un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u' ,
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
                    if(texte === '#'){
                        dans_commentaire=true;
                        niveauDebutCommentaire=niveau;
                    }
                    if(texte === '@'){
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
                            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                    "__xst" : false ,
                                    "ind" : i ,
                                    "__xme" : this.nl2()+'une fermeture de parenthése ne doit pas être au niveau 0' ,
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
                                return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                        "erreur_conversion_chaine_tableau_en_json" : true ,
                                        "__xst" : false ,
                                        "ind" : i ,
                                        "__xme" : this.nl2()+'erreur de conversion de tableau' ,
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
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash doit être dans une constante en i=' + i}));
                    }
                    if(!dansCstDouble){
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash doit être dans une constante en i=' + i}));
                    }
                    if(!dansCstModele){
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash doit être dans une constante en i=' + i}));
                    }
                    if(!dansCstRegex){
                        return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'un antislash doit être dans une constante en i=' + i}));
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
                                return(this.empiler_erreur({"__xst" : false ,"__xva" : T ,"id" : i ,"__xme" : this.nl2()+'la racine ne peut pas contenir des constantes'}));
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
                                    return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                            "__xst" : false ,
                                            "ind" : premier ,
                                            "__xme" : this.nl2()+'une virgule ne doit pas être précédée d\'un vide' ,
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
                                return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                        "__xst" : false ,
                                        "ind" : premier ,
                                        "__xme" : this.nl2()+'une virgule ne doit pas être précédée d\'un vide' ,
                                        "type" : 'rev' ,
                                        "texte" : texte ,
                                        "chaine_tableau" : chaine_tableau ,
                                        "chaine_tableau_commentaires" : chaine_tableau_commentaires ,
                                        "tableauEntree" : tableauEntree ,
                                        "quitterSiErreurNiveau" : quitterSiErreurNiveau ,
                                        "autoriserCstDansRacine" : autoriserCstDansRacine
                                    })));
                            }else if(niveauPrecedent === niveau && texte_precedent === '' && constanteQuoteePrecedente === 0){
                                return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                        "__xst" : false ,
                                        "ind" : premier ,
                                        "__xme" : this.nl2()+'une virgule ne doit pas être précédée d\'un vide ' ,
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
                                return(this.empiler_erreur(this.formatter_une_erreur_rev({
                                        "__xst" : false ,
                                        "ind" : premier ,
                                        "__xme" : this.nl2()+'la racine ne peut pas contenir des constantes' ,
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
            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                    "__xst" : false ,
                    "ind" : l01 - 1 ,
                    "__xme" : this.nl2()+'💥 des parenthèses ne correspondent pas, (' + (niveau > 0 ? ( 'il en manque :' ) : ( 'il y en a trop : ' )) + 'niveau=' + niveau + ') ' ,
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
                    return(this.empiler_erreur(this.formatter_une_erreur_rev({
                            "__xst" : false ,
                            "ind" : l01 - 1 ,
                            "__xme" : this.nl2()+'la racine ne peut pas contenir des constantes ' ,
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
            return(this.empiler_erreur(this.formatter_une_erreur_rev({
                    "ejson" : ejson ,
                    "erreur_conversion_chaine_tableau_en_json" : true ,
                    "__xst" : false ,
                    "__xme" : this.nl2()+'erreur de conversion de tableau' ,
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
    
    
}
export{c_rev1 as c_rev1};