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
                    commentaire=this.tr_commentaire_rev1(tab[i][13],tab[i][3],i);
                    t+=tab[i][1] + '(' + commentaire + ')';
                    count++;
                    if(contient_un_defTab_tbel === true && count% 10 === 0){
                        t+=les_espaces;
                    }
                }else if(tab[i][2] === 'f' && tab[i][1] === DEBUTBLOC){
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
    /*
      =============================================================================================================
      fonction txt_en_tableau (__m_rev1.txt_en_tableau) : transforme un texte en tableau, 
      =============================================================================================================
    */
    txt_en_tableau(str){
        const l01=str.length;
        var out=[];
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
                    out[indiceTab]=[str.substr(i,2),2,i,numLigne];
                    indiceTab++;
                    i++;
                }else{
                    out[indiceTab]=[str.substr(i,1),1,i,numLigne];
                    indiceTab++;
                    if(codeCaractere === 10){
                        numLigne++;
                    }
                }
            }else{
                exceptions=exceptions + 1;
            }
        }
        return({"out" : out ,"numLigne" : numLigne ,"exceptions" : exceptions});
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
            chaineTableau : chaineTableau,
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
        var line=0;
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
                        if(obj.chaineTableau.substr(i,1) === '['){
                            for( j=i ; j < obj.chaineTableau.length && message_ajoute === '' ; j++ ){
                                if(obj.chaineTableau.substr(j,1) === ']'){
                                    message_ajoute='près de `' + obj.chaineTableau.substr(i,(j - i) + 1) + '`';
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return({"__xst" : obj.__xst ,"__xva" : '' ,"id" : obj.ind ,"__xme" : obj.__xme + ' ' + message_ajoute});
        }
        var chaineTableau='[' + obj.chaineTableau + ']';
        if(obj.hasOwnProperty('tableauEntree')){
            if(obj.hasOwnProperty('ind')){
                if(obj.ind > 50){
                    for( i=obj.ind - 50 ; i <= obj.ind + 50 && i < obj.tableauEntree.length ; i++ ){
                        if(i === obj.ind - 5){
                            presDe+='<b>';
                        }
                        presDe+=__m_rev1.entitees_html(obj.tableauEntree[i][0]);
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
                        presDe+=__m_rev1.entitees_html(obj.tableauEntree[i][0]);
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
                line=0;
                for( i=obj.ind ; i >= 0 ; i-- ){
                    if(obj.tableauEntree[i][0] === '\n'){
                        line++;
                    }
                }
            }
        }
        var T=JSON.parse(chaineTableau);
        return({"__xst" : obj.__xst ,"__xva" : T ,"id" : obj.ind ,"__xme" : obj.__xme + message_ajoute ,"line" : line});
    }    
    
    
}
export{c_rev1 as c_rev1};