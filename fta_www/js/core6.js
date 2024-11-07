
"use strict";
const DEBUTCOMMENTAIRE='#';
const DEBUTBLOC='@';
const CRLF='\r\n';
const CR='\r';
const LF='\n';
const NBESPACESREV=3;
const NBESPACESSOURCEPRODUIT=4;
var globale_LangueCourante='fr';
var global_messages={
    'e500logged':false,
    'errors':[],
    'warnings':[],
    'infos':[],
    'lines':[],
    'tabs':[],
    'ids':[],
    'ranges':[],
    'plages':[],
    'positions_caracteres':[],
    'calls':'',
    'data':{'matrice':[],'tableau':[],'sourceGenere':''}
};
var php_contexte_commentaire_html=false;
/*
  =====================================================================================================================
*/
function raz_messages(zone_message){
    if((zone_message) && (document.getElementById(zone_message))){
        document.getElementById(zone_message).innerHTML='';
    }
    global_messages={
        'e500logged':false,
        'errors':[],
        'warnings':[],
        'infos':[],
        'lines':[],
        'tabs':[],
        'ids':[],
        'ranges':[],
        'plages':[],
        'positions_caracteres':[],
        'calls':'',
        'data':{'matrice':[],'tableau':[],'sourceGenere':''}
    };
}
/*
  =====================================================================================================================
  met les valeurs dans la variable global_messages
  =====================================================================================================================
*/
function logerreur(o){
    if(o.hasOwnProperty(__xst)){
        if(o.__xst === false){
            if(o.hasOwnProperty('__xme')){
                global_messages['errors'].push(o.__xme);
            }
            if(o.hasOwnProperty('message')){
                global_messages['errors'].push(o.message);
            }
            if(o.hasOwnProperty('id')){
                global_messages['ids'].push(o.id);
            }
            if(o.hasOwnProperty('__xms')){
                for(var i in o.__xms){
                    global_messages['errors'].push(o.__xms[i]);
                }
            }
        }else{
            if(o.hasOwnProperty(__xme)){
                if(o.__xme !== ''){
                    global_messages['infos'].push(o.__xme);
                }
            }else if(o.hasOwnProperty('warning')){
                if(o.warning !== ''){
                    global_messages['warnings'].push(o.warning);
                }
            }else{
                /*on ne fait rien */
            }
        }
    }
    if(o.hasOwnProperty('tabs')){
        global_messages['tabs'].push(o.tabs);
    }
    if((o.hasOwnProperty('line')) && (o.line >= 0)){
        global_messages['lines'].push(o.line);
    }
    if(o.hasOwnProperty('position_caractere')){
        global_messages['positions_caracteres'].push(o.tabs);
    }
    if(o.hasOwnProperty('range')){
        global_messages['ranges'].push(o.range);
    }
    if(o.hasOwnProperty('plage')){
        global_messages['plages'].push(o.plage);
    }
    return o;
}
/*
  =====================================================================================================================
*/
function dogid(n){
    return(document.getElementById(n));
}
/*
  =====================================================================================================================
*/
function maConstante(eltTab){
    var t='';
    if(eltTab[4] === 1){
        t='\'' + eltTab[1] + '\'';
    }else if(eltTab[4] === 2){
        /*
          constante avec des apostrophes inversées
        */
        t='`' + eltTab[1] + '`';
        t=t.replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
    }else if(eltTab[4] === 3){
        t='"' + eltTab[1] + '"';
    }else if(eltTab[4] === 4){
        t='/' + eltTab[1] + '/' + eltTab[13];
    }else{
        /*
          constante non quotée, généralement une variable
        */
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
  =====================================================================================================================
*/
function espacesn(optionCRLF,i){
    var t='';
    if(optionCRLF){
        t='\r\n';
    }else{
        t='\n';
    }
    if(i > 0){
        t+=' '.repeat((NBESPACESSOURCEPRODUIT * i));
    }
    return t;
}
/*
  =====================================================================================================================
*/
function concat(){
    var t='';
    var a={};
    for(a in arguments){
        t+=arguments[a];
    }
    return t;
}
/*
  =====================================================================================================================
*/
function isNumeric(str){
    if(typeof str !== 'string'){
        return false;
    }
    var leTest = ( !(isNaN(str))) && ( !(isNaN(parseFloat(str))));
    return leTest;
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
        t+=' '.repeat((NBESPACESREV * i));
    }
    return t;
}
/*
  =====================================================================================================================
  Des fonctions raccourcies
  =====================================================================================================================
*/
function arrayToFunct1(matrice,retourLigne,coloration){
    var t='';
    var obj = a2F1(matrice,0,retourLigne,1,coloration);
    return obj;
}
/*
  =====================================================================================================================
*/
function arrayToFunctNormalize(matrice,bAvecCommentaires){
    var out = arrayToFunct1(matrice,bAvecCommentaires,false);
    return out;
}
/*
  =====================================================================================================================
*/
function arrayToFunctNoComment(matrice){
    var out = arrayToFunct1(matrice,true,false);
    return out;
}
/*
  =====================================================================================================================
*/
function rev_texte_vers_matrice(texte_rev){
    var tableau1 = iterateCharacters2(texte_rev);
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    global_messages.data.matrice=matriceFonction;
    global_messages.data.tableau=tableau1;
    return matriceFonction;
}
/*
  =====================================================================================================================
*/
function functionToArray(src,quitterSiErreurNiveau,autoriserConstanteDansLaRacine,rechercheParentheseCorrespondante){
    var tableau1 = iterateCharacters2(src);
    var matriceFonction = functionToArray2(tableau1.out,quitterSiErreurNiveau,autoriserConstanteDansLaRacine,rechercheParentheseCorrespondante);
    global_messages.data.matrice=matriceFonction;
    global_messages.data.tableau=tableau1;
    return matriceFonction;
}
/*
  =====================================================================================================================
  fonction de remplacement globale
  =====================================================================================================================
*/
function replaceAll(s,chaineAremplacer,chaineQuiRemplace){
    var r1= new RegExp(chaineAremplacer,'g');
    var ret = s.replace(r1,chaineQuiRemplace);
    return ret;
}
/*
  =====================================================================================================================
  fonction de remplacement NON globale
  =====================================================================================================================
*/
function myReplace(s,chaineAremplacer,chaineQuiRemplace){
    var r1= new RegExp(chaineAremplacer,'');
    var ret = s.replace(r1,chaineQuiRemplace);
    return ret;
}
/*
  =====================================================================================================================
  compte le nombre de caractères dans une chaine
  =====================================================================================================================
*/
function nbre_caracteres2(lettre,chaine){
    var tt = chaine.split(lettre);
    return((tt.length - 1));
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
    var l01=tab.length;
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
    for(i=1;i < l01;i++){
        tab[i][0]=i;
        tab[i][8]=0;
    }
    /*
      =============================================================================================================
      parent et nombre d'enfants
      =============================================================================================================
    */
    for(i=l01 - 1;i > 0;i--){
        niveau=tab[i][3];
        for(j=i;j >= 0;j--){
            if(tab[j][3] === (niveau - 1)){
                tab[i][7]=j;
                tab[j][8]=tab[j][8] + 1;
                break;
            }
        }
    }
    /*
      =============================================================================================================
      numéro d'enfant
      =============================================================================================================
    */
    for(i=0;i < l01;i++){
        k=0;
        for(j=i + 1;j < l01;j++){
            if(tab[j][7] === tab[i][0]){
                k++;
                tab[j][9]=k;
            }
        }
    }
    /*
      =============================================================================================================
      profondeur
      =============================================================================================================
    */
    for(i=l01 - 1;i > 0;i--){
        if(tab[i][2] === 'c'){
            tab[i][10]=0;
        }
        if(tab[i][7] > 0){
            k=tab[i][3];
            l=tab[i][7];
            for(j=1;j <= k;j++){
                if(tab[l][10] < j){
                    tab[l][10]=j;
                }
                l=tab[l][7];
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
        var a_supprimer = [];
    }
    if((tab[id][2] === 'c') || ((tab[id][2] === 'f') && (tab[id][8] === 0))){
        /*
          si c'est une constante ou une fonction vide  on l'efface directement
          son parent à un élément en moins
        */
        a_supprimer.push(id);
    }else{
        /* sinon, on efface recursivement tous ses enfants avant de l'effacer */
        for(i=1;i < tab.length;i++){
            if(tab[i][7] === id){
                supprimer_un_element_de_la_matrice(tab,tab[i][0],(niveau + 1),a_supprimer);
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
            return((b - a));
        });
        for(i=0;i < a_supprimer.length;i++){
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
    var i = 0;
    for(i=id + 1;i < tab.length;i++){
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
/*
  =====================================================================================================================
  fonction transforme un commentaire pour un fichier source à générer
*/
function traiteCommentaire2(texte,niveau,ind){
    var s='';
    s=traiteCommentaireSourceEtGenere1(texte,niveau,ind,NBESPACESSOURCEPRODUIT,false);
    return s;
}
/*
  =====================================================================================================================
  fonction transforme un commentaire pour un fichier rev
  =====================================================================================================================
*/
function ttcomm1(texte,niveau,ind){
    var s='';
    s=traiteCommentaireSourceEtGenere1(texte,niveau,ind,NBESPACESREV,true);
    return s;
}
/*
  =====================================================================================================================
  fonction transforme un commentaire 
  =====================================================================================================================
*/
function traiteCommentaireSourceEtGenere1(texte,niveau,ind,nbEspacesSrc1,fichierRev0){
    /*Si c'est un commentaire monoligne, on le retourne sans aucune transformation*/
    i=texte.indexOf('\n');
    if(i < 0){
        return texte;
    }
    /**/
    var i=0;
    var j=0;
    var l01=0;
    var min=0;
    var t='';
    var ligne='';
    var temps='';
    var unBloc='';
    var unBlocPlus1='';
    var newTab = [];
    var tab = [];
    var ne_contient_que_des_egals=false;
    /**/
    unBloc=' '.repeat((nbEspacesSrc1 * niveau));
    tab=texte.split('\n');
    l01=tab.length;
    /**/
    if(texte.length > 1){
        temps=texte.substr(0,1);
        if(temps === '#'){
            /*
              on a un commentaire de type bloc non formaté 
              car le premier caractère = #.
              On supprime les espaces inutiles en début de ligne.
            */
            t='';
            /* minimim d'espaces au début de chaque ligne */
            min=120;
            for(i=1;i < l01;i++){
                ligne=tab[i];
                for(j=0;j < ligne.length;j++){
                    /*
                      on balaye toutes les lignes pour détecter 
                      le nombre d'espaces minimal à gauche
                    */
                    temps=ligne.substr(j,1);
                    if(temps !== ' '){
                        if(j < min){
                            /*on réajuste le minimum d'espaces au début de chaque ligne */
                            min=j;
                        }
                        /* et on passe à la ligne suivante*/
                        break;
                    }
                }
            }
            if(min > 2){
                /*tout décaler à gauche*/
                for(i=1;i < l01;i++){
                    tab[i]=tab[i].substr((min - 2));
                }
            }
            /* si c'est un fichierRev0, on doit avoir la dernière ligne vide*/
            if(fichierRev0){
                ligne=tab[tab.length - 1].replace(/ /g,'');
                if(ligne !== ''){
                    tab.push(unBloc);
                }else{
                    tab[tab.length - 1]=unBloc;
                }
            }
            /**/
            texte=tab.join('\n');
            return texte;
        }
    }
    /*
      si on est ici, c'est qu'on a un commentaire multiligne
      qu'il faut formatter en alignant à gauche les textes 
      d'un nombre d'espaces correspondant au niveau
    */
    unBlocPlus1=' '.repeat(((nbEspacesSrc1 * niveau) + 2));
    var s1='';
    var s2='';
    for(i=0;i < l01;i++){
        t='';
        /* les CR (les zimac) ne sont pas faits pour écrire des vrais programmes !*/
        tab[i]=tab[i].replace(/\r/g,'');
        /*on enlève les espaces au début*/
        for(j=0;j < tab[i].length;j++){
            temps=tab[i].substr(j,1);
            if(temps !== ' '){
                t+=tab[i].substr(j);
                break;
            }
        }
        s1=unBloc + t;
        s2=unBlocPlus1 + t;
        if(i === (l01 - 1)){
            /*la dernière ligne du commentaire de bloc doit être vide*/
            if(t === ''){
                newTab.push(unBloc);
            }else{
                /*on met la ligne et on ajoute une ligne vide*/
                newTab.push(s2);
                newTab.push(unBloc);
            }
        }else if(i === 0){
            /*la première ligne du commentaire de bloc doit être vide*/
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
    for(i=0;i < l01;i++){
        ligne=newTab[i];
        if(ligne.indexOf('====') >= 0){
            ne_contient_que_des_egals=true;
            l02=ligne.length;
            for(j=0;j < l02;j++){
                if( !((ligne.substr(j,1) === '=') || (ligne.substr(j,1) === ' '))){
                    ne_contient_que_des_egals=false;
                    break;
                }
            }
            if(ne_contient_que_des_egals === true){
                calcul=117 - (2 * niveau * nbEspacesSrc1);
                if(calcul > 0){
                    newTab[i]='  ' + ' '.repeat((niveau * nbEspacesSrc1)) + '='.repeat(calcul);
                }
            }
        }
    }
    t=newTab.join(CRLF);
    return t;
}
/*
  =====================================================================================================================
  fonction transforme un texte pour qu'il  soit visible en html, par exemple &nbsp; ou bien <
  =====================================================================================================================
*/
function strToHtml(s){
    return(s.replace(/&/g,'&amp;').replace('<','&lt;').replace('>','&gt;'));
}
/*
  =====================================================================================================================
  fonction qui reconstitue un texte source à partir du tableau représentant la matrice  du  programme
  =====================================================================================================================
*/
function a2F1(arr,parentId,retourLigne,debut,coloration){
    /*
      =============================================================================================================
      Attention : cette fonction est récursive
      =============================================================================================================
    */
    var i=0;
    var j=0;
    var obj={};
    var t='';
    var profondeurLimite=3;
    var nombreEnfantsLimite=5;
    var forcerRetourLigne=false;
    var condition1=false;
    var commentaire='';
    var tmpC='';
    var c1='';
    var cm1='';
    var l01=arr.length;
    var chCR = '¶' + 'CR' + '¶';
    var chLF = '¶' + 'LF' + '¶';
    var chaine='';
    var obj={};
    /*
      =============================================================================================================
      boucle principale qui commence à partir de "debut" passé en paramètre
      =============================================================================================================
    */
    for(i=debut;i < l01;i++){
        /*
          on ne traite que les enfants et les éléments 
          dont le niveau est supérieur au niveau du parent
        */
        if(arr[i][7] === parentId){
            /*On va à la suite du programme*/
        }else if(arr[i][3] <= arr[parentId][3]){
            break;
        }else{
            /*
              on va dans la ligne suivante de la matrice 
              et on ne fait pas le traitement ci dessous 
            */
            continue;
        }
        /*
          On doit forcer le retour de ligne quand la
          profondeur est trop importante ou bien
          qu'il y a trop d'enfants ou bien qu'il
          y a des commentaires
        */
        if((retourLigne === true) && (arr[parentId][10] > profondeurLimite)){
            forcerRetourLigne=true;
        }else if(((retourLigne === true) && (arr[parentId][2] === 'f')) || (arr[parentId][2] === 'INIT')){
            /*le type du parent est une fonction ou bien c'est la racine*/
            /*
              Si c'est la premier enfant d'une fonction, 
              on teste si il existe des enfants de type commentaires
            */
            for(j=debut;(j < l01) && (arr[j][3] > arr[parentId][3]);j++){
                if((arr[j][1] === DEBUTCOMMENTAIRE) && (arr[j][2] === 'f') && (arr[j][3] < (arr[parentId][3] + profondeurLimite))){
                    /*
                      il y a un commentaire
                      c'est une fonction
                      niveau inférieur à celui du parent + profondeur limite
                    */
                    forcerRetourLigne=true;
                    break;
                }
            }
            for(j=debut;(j < l01) && (arr[j][3] > arr[parentId][3]) && (forcerRetourLigne === false);j++){
                if(arr[j][8] > nombreEnfantsLimite){
                    /*
                      si le nombre d'enfants est supérieur à 3
                    */
                    forcerRetourLigne=true;
                    break;
                }
            }
        }
        /*
          ici la variable forcerRetourLigne est éventuellement mise à true 
        */
        if((forcerRetourLigne === false) && (arr[i][2] === 'c') && (arr[i][1].length > 100)){
            forcerRetourLigne=true;
        }
        condition1=((arr[parentId][2] === 'f') && (arr[parentId][8] <= nombreEnfantsLimite)) && (arr[parentId][10] <= profondeurLimite);
        /* si le numéro enfant ets >1, on ajoute une virgule */
        if(arr[i][9] > 1){
            /*!forcerRetourLigne && retourLigne==true && condition1*/
            if(( !(forcerRetourLigne)) && (retourLigne === true) && (condition1)){
                t+=' , ';
            }else{
                t+=',';
            }
        }
        if((forcerRetourLigne) && (arr[parentId][2] !== 'INIT')){
            t+=espacesnrev(true,arr[i][3]);
        }else if(retourLigne){
            if(((arr[parentId][2] === 'INIT') && (arr[i][9] === 1)) || (condition1)){
                /*on ne fait rien*/
            }else{
                t+=espacesnrev(true,arr[i][3]);
            }
        }
        /*
          =====================================================================================================
          ici, forcerRetourLigne est vrai ou pas
          =====================================================================================================
          si  on  doit  traiter  une  constante
          =====================================================================================================
        */
        if(arr[i][2] === 'c'){
            chaine='';
            if(arr[i][4] === 1){
                /* methode3' simple quote */
                chaine=arr[i][1];
                chaine=replaceAll(chaine,chLF,'\n');
                chaine=replaceAll(chaine,chCR,'\r');
                if(coloration){
                    t+='\'' + strToHtml(chaine) + '\'';
                }else{
                    t+='\'' + chaine + '\'';
                }
            }else if(arr[i][4] === 2){
                /* methode3modele ` */
                chaine=arr[i][1];
                chaine=replaceAll(chaine,chLF,'\n');
                chaine=replaceAll(chaine,chCR,'\r');
                if(coloration){
                    t+='`' + strToHtml(chaine) + '`';
                }else{
                    t+='`' + chaine + '`';
                }
            }else if(arr[i][4] === 3){
                /* methode3" double quote */
                chaine=arr[i][1];
                chaine=replaceAll(chaine,chLF,'\n');
                chaine=replaceAll(chaine,chCR,'\r');
                if(coloration){
                    t+='"' + strToHtml(chaine) + '"';
                }else{
                    t+='"' + chaine + '"';
                }
            }else if(arr[i][4] === 4){
                /* methode3regex */
                chaine=arr[i][1];
                if(coloration){
                    t+='/' + strToHtml(chaine) + '/' + arr[i][13];
                }else{
                    t+='/' + chaine + '/' + arr[i][13];
                }
            }else{
                if(coloration){
                    t+=strToHtml(arr[i][1]);
                }else{
                    t+=arr[i][1];
                }
            }
            continue;
        }
        /*
          
          
          =====================================================================================================
          si on doit traiter une fonction de type commentaire
          =====================================================================================================
        */
        if((arr[i][2] === 'f') && (arr[i][1] === DEBUTCOMMENTAIRE)){
            /*
              =============================================================================================
              on est dans un commentaire
              =============================================================================================
            */
            commentaire=ttcomm1(arr[i][13],arr[i][3],i);
            if(coloration){
                /*mise en forme en HTML*/
                commentaire=strToHtml(commentaire);
                if(retourLigne){
                    t+='<span style="color:darkgreen;background-color:lightgrey;">' + DEBUTCOMMENTAIRE + '(' + commentaire + ')</span>';
                }else{
                    t+='<span style="color:darkgreen;background-color:lightgrey;">' + DEBUTCOMMENTAIRE + '()</span>';
                }
            }else{
                /*pas de mise en forme en HTML*/
                if(retourLigne){
                    t+=arr[i][1] + '(' + commentaire + ')';
                }else{
                    t+=arr[i][1] + '()';
                }
            }
            continue;
        }
        /*
          =====================================================================================================
          si on doit traiter une fonction de type bloc
          =====================================================================================================
        */
        if((arr[i][2] === 'f') && (arr[i][1] === DEBUTBLOC)){
            /*
              =============================================================================================
              on est dans un bloc
              =============================================================================================
            */
            commentaire=arr[i][13];
            if(coloration){
                /*mise en forme en HTML*/
                commentaire=strToHtml(commentaire);
                if(retourLigne){
                    t+='<span style="color:navy;background-color:lightgrey;">' + DEBUTBLOC + '(' + commentaire + ')</span>';
                }else{
                    t+='<span style="color:navy;background-color:lightgrey;">' + DEBUTBLOC + '()</span>';
                }
            }else{
                /*pas de mise en forme en HTML*/
                if(retourLigne){
                    t+=arr[i][1] + '(' + commentaire + ')';
                }else{
                    t+=arr[i][1] + '()';
                }
            }
            continue;
        }
        /*
          =====================================================================================================
          pour toutes les autres fonctions, on fait un appel récursif
          =====================================================================================================
        */
        obj=a2F1(arr,i,retourLigne,(i + 1),coloration);
        if(obj.__xst === true){
            /*on ajoute le nom de la fonction et on ouvre la parenthèse*/
            if(coloration){
                t+=strToHtml(arr[i][1]) + '(';
            }else{
                if(obj.forcerRetourLigne === true 
                  && arr[i][9]===1 
                  && i>1
                  && !(t.length>=arr[i][3]*NBESPACESREV && t.substr(t.length-arr[i][3]*NBESPACESREV)===' '.repeat(arr[i][3]*NBESPACESREV)) ){
                    t+=espacesnrev(true,arr[i][3]);
                }
                t+=arr[i][1] + '(';
            }
            /*
              =============================================================================================
              on ajoute le contenu récursif de la fonction
              =============================================================================================
            */
            t+=obj.__xva;
            /*
              on met les retours de ligne
            */
            if((forcerRetourLigne) && (obj.forcerRetourLigne === true)){
                t+=espacesnrev(true,arr[i][3]);
            }else if(retourLigne){
                if( !((arr[i][8] <= nombreEnfantsLimite) && (arr[i][10] <= profondeurLimite))){
                    t+=espacesnrev(true,arr[i][3]);
                }
            }
            /*
              on ferme la parenthèse
            */
            t+=')';
        }else{
            return({__xst:false,__xme:'erreur','id':i});
        }
    }
    return({__xst:true,'__xva':t,'forcerRetourLigne':forcerRetourLigne});
}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  fonction qui transforme un texte en tableau
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function iterateCharacters2(str){
    var out = [];
    var i=0;
    var exceptions=0;
    var numLigne=0;
    var l01=str.length;
    var codeCaractere='';
    var temp=0;
    var indiceTab=0;
    for(i=0;i < l01;i++){
        codeCaractere=str.charCodeAt(i);
        /*
          zero width space , vertical tab
        */
        if( !((codeCaractere === 8203) || (codeCaractere === 11))){
            /*
              0xD800 = 55296 = 1101 1000 0000 0000  , 0xF800 = 63488 = 1111 1000 0000 0000
            */
            temp=(codeCaractere & 0xF800);
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
    return({'out':out,'numLigne':numLigne,'exceptions':exceptions});
}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  reconstruit une chaine à partir du tableau
  c'est utile en cas d'erreur !
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function reconstruitChaine(tab,debut,fin){
    var t='';
    var i=debut;
    for(i=debut;(i <= fin) && (i < tab.length);i++){
        t+=tab[i][0];
    }
    return t;
}
/*
  =====================================================================================================================
  todo, à faire plus tard
  =====================================================================================================================
*/
function formaterErreurRev(obj){
    /*
      exemple de donnée en entrée
      {
      type:'rev',
      __xst:false,
      ind:i,
      __xme : '1839 il ne peut pas y avoir des retours à la ligne dans une chaine de type regex ',
      texte:texte,
      chaineTableau:chaineTableau,
      tabComment:tabCommentaireEtFinParentheses,
      tableauEntree:tableauEntree,
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
    if((obj.hasOwnProperty('erreur_conversion_chaineTableau_en_json')) && (obj.erreur_conversion_chaineTableau_en_json === true)){
        /*
          si il y a un problème avec le JSON.parse:
          
          SyntaxError: Bad control character in string literal in JSON at position 113 (line 1 column 114)
          at JSON.parse (<anonymous>)
          at functionToArray2 (core6.js:1939:13)
          at transformLeRev (pour-index_php0.js:118:24)
          at <anonymous>:1:1      
        */
        if(obj.ejson.message.indexOf('at position ') >= 0){
            position=obj.ejson.message.substr((obj.ejson.message.indexOf('at position ') + 12));
            if(obj.ejson.message.indexOf(' ') >= 0){
                position=parseInt(position.substr(0,obj.ejson.message.indexOf(' ')),10);
                for(i=position;(i >= 0) && (message_ajoute === '');i--){
                    if(obj.chaineTableau.substr(i,1) === '['){
                        for(j=i;(j < obj.chaineTableau.length) && (message_ajoute === '');j++){
                            if(obj.chaineTableau.substr(j,1) === ']'){
                                message_ajoute='près de `' + obj.chaineTableau.substr(i,(((j - i)) + 1)) + '`';
                                break;
                            }
                        }
                    }
                }
            }
        }
        return({__xst:obj.__xst,'__xva':T,'id':obj.ind,__xme:obj.__xme + ' ' + message_ajoute});
    }
    var chaineTableau = '[' + obj.chaineTableau + ']';
    var T = JSON.parse(chaineTableau);
    if(obj.hasOwnProperty('tableauEntree')){
        if(obj.hasOwnProperty('ind')){
            if(obj.ind > 50){
                for(i=obj.ind - 50;(i <= (obj.ind + 50)) && (i < obj.tableauEntree.length);i++){
                    if(i === (obj.ind - 5)){
                        presDe+='<b>';
                    }
                    presDe+=strToHtml(obj.tableauEntree[i][0]);
                    if(i === (obj.ind + 5)){
                        presDe+='</b>';
                        finGrasFait=true;
                    }
                }
                if( !(finGrasFait)){
                    presDe+='</b>';
                }
            }else{
                presDe='<b>';
                for(i=0;(i <= (obj.ind + 50)) && (i < obj.tableauEntree.length);i++){
                    presDe+=strToHtml(obj.tableauEntree[i][0]);
                    if(i === (obj.ind + 5)){
                        presDe+='</b>';
                        finGrasFait=true;
                    }
                }
                if( !(finGrasFait)){
                    presDe+='</b>';
                }
            }
            message_ajoute+=' position caractère=' + obj.ind + '';
            message_ajoute+='<br />près de ----' + presDe + '----<br />';
            line=0;
            for(i=obj.ind;i >= 0;i--){
                if(obj.tableauEntree[i][0] === '\n'){
                    line++;
                }
            }
        }
    }
    return({__xst:obj.__xst,'__xva':T,'id':obj.ind,__xme:(obj.__xme + message_ajoute),'line':line});
}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  tableau retourné par l'analyse syntaxique 
  du texte en entrée de la fonction functionToArray2
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
var global_enteteTableau = [
    ['id','id'],
    ['val','valeur'],
    ['typ','type'],
    ['niv','niveau'],
    ['coQ','constante quotée'],
    ['pre','position du premier caractère'],
    ['der','position du dernier caractère'],
    ['pId','Id du parent'],
    ['nbE','nombre d\'enfants'],
    ['nuE','numéro enfants'],
    ['pro','profondeur'],
    ['pop','position ouverture parenthese'],
    ['pfp','position fermeture parenthese'],
    ['com','commentaire']
];
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  fonction d'analyse syntaxique d'un programme source
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function functionToArray2(tableauEntree,quitterSiErreurNiveau,autoriserCstDansRacine,rechercheParentheseCorrespondante){
    /*
      =============================================================================================================
      les chaines de caractères
      =============================================================================================================
    */
    var texte='';
    var textePrecedent='';
    var commentaire='';
    var c='';
    var c1='';
    var c2='';
    var chaineTableau='';
    var typePrecedent='';
    var drapeauRegex='';
    var chCR = '¶' + 'CR' + '¶';
    var chLF = '¶' + 'LF' + '¶';
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
    var numeroLigne=0;
    var posOuvPar=0;
    var posFerPar=0;
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
    var dsComment=false;
    var dsBloc=false;
    var constanteQuotee=0;
    var constanteQuoteePrecedente=0;
    var drapeauParenthese = ((rechercheParentheseCorrespondante === '')?false:true);
    /*
      =============================================================================================================
      Le tableau en sortie si tout va bien
      =============================================================================================================
    */
    var tabCommentaireEtFinParentheses = [];
    var T = [];
    var temp={};
    var tableauParenthesesCommentaires = [];
    /*
      =============================================================================================================
      initialisation du tableau contenant le source structuré en arborescence
      =============================================================================================================
      0id    1val  2typ  3niv  4coQ
      5pre   6der  7pId  8nbE  9numEnfant  
      10pro 11OPa 12FPa 13comm
    */
    /*
      =============================================================================================================
      Les performances sur chrome sont très mauvaises en utilisant des push
      c'est pourquoi on construit cette variable texte : "chaineTableau" 
      qui sera traitée avec un JSON.parse() plus bas.
      Sur un tableau de 25000 éléments, on multiplie la vitesse d'exécution 
      par un facteur compris entre 30 et 60
      =============================================================================================================
    */
    /*
      l'ancienne version avec push était :
      T.push(Array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
    */
    chaineTableau+='[0,"' + texte + '","INIT",-1,' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
    typePrecedent='INIT';
    niveauPrecedent=niveau;
    var l01=tableauEntree.length;
    /*
      =============================================================================================================
      =============================================================================================================
      boucle principale sur tous les caractères du texte passé en argument,
      on commence par analyser les cas ou on est dans  des commentaires ou des chaines, 
      puis on analyse les caractères
      =============================================================================================================
      =============================================================================================================
    */
    for(i=0;i < l01;i++){
        c=tableauEntree[i][0];
        if(dsComment){
            /*
              
              
              
              =============================================================================================
              Si on est dans un commentaire
              =============================================================================================
            */
            if(c === ')'){
                if((niveau === (niveauDebutCommentaire + 1)) && (niveauDansCommentaire === 0)){
                    posFerPar=i;
                    /*
                      comme on a supprimé les push sur le tableau principal et qu'on remplit les commentaires
                      après avoir rempli la fonction, on met les commentaires dans un tableau et on remplira 
                      le tableau principal "T" à la fin
                    */
                    tabCommentaireEtFinParentheses[indiceTabCommentaire]=[indice,commentaire,posFerPar];
                    indiceTabCommentaire++;
                    posFerPar=0;
                    /*
                      l'ancienne version faisait :
                      T[indice][13]=commentaire;
                      T[indice][12]=posFerPar;
                    */
                    commentaire='';
                    dsComment=false;
                    niveau=niveau - 1;
                    if(drapeauParenthese){
                        if(i === (l01 - 1)){
                            /*
                              =============================================================
                              si on est en recherche de parenthèse correspondante 
                              et que c'est le dernier caractère du tableau en entrée
                              alors c'est une recherche de parenthèse ouvrante correspondante
                              =============================================================
                            */
                            return({__xst:true,'posOuvPar':tableauEntree[tableauParenthesesCommentaires[tableauParenthesesCommentaires.length - 1]][2]});
                        }
                        tableauParenthesesCommentaires.pop();
                    }
                }else{
                    if(drapeauParenthese){
                        if(i === (l01 - 1)){
                            return({__xst:true,'posOuvPar':tableauEntree[tableauParenthesesCommentaires[tableauParenthesesCommentaires.length - 1]][2]});
                        }
                        tableauParenthesesCommentaires.pop();
                    }
                    commentaire+=c;
                    niveauDansCommentaire=niveauDansCommentaire - 1;
                }
            }else if(c === '('){
                commentaire+=c;
                niveauDansCommentaire=niveauDansCommentaire + 1;
                if(drapeauParenthese){
                    tableauParenthesesCommentaires.push(i);
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
                    if(i === (l01 - 1)){
                        /* à faire, noter un cas d'erreur */
                        console.error('core functionToArray2 1164 noter ce cas d\'erreur','background:gold;color:red;');
                        
                        return(logerreur(formaterErreurRev({
                            __xst:false,
                            ind:i,
                            __xme:'1148 la racine ne peut pas contenir des constantes',
                            type:'rev',
                            texte:texte,
                            chaineTableau:chaineTableau,
                            tabComment:tabCommentaireEtFinParentheses,
                            tableauEntree:tableauEntree,
                            quitterSiErreurNiveau:quitterSiErreurNiveau,
                            autoriserCstDansRacine:autoriserCstDansRacine
                        })));
                    }
                }
                if((i + 1) < l01){
                    c1=tableauEntree[i + 1][0];
                    if((c1 === ',')
                     || (c1 === '\t')
                     || (c1 === '\n')
                     || (c1 === '\r')
                     || (c1 === '/')
                     || (c1 === ' ')
                     || (c1 === ')')){
                        dernier=i - 1;
                    }else{
                        /* cas d'erreur = f(""") */
                        return(logerreur(formaterErreurRev({
                            __xst:false,
                            ind:i,
                            __xme:'core 1176 functionToArray2 une constante encadrée par des guillemets est incorrecte ',
                            type:'rev',
                            texte:texte,
                            chaineTableau:chaineTableau,
                            tabComment:tabCommentaireEtFinParentheses,
                            tableauEntree:tableauEntree,
                            quitterSiErreurNiveau:quitterSiErreurNiveau,
                            autoriserCstDansRacine:autoriserCstDansRacine
                        })));
                    }
                }else{
                    if( !(autoriserCstDansRacine === true)){
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,(i - 100),(i + 110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i + 10));
                        }
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1172 la racine ne peut pas contenir des constantes près de ' + presDe};
                        return(logerreur(temp));
                    }
                }
                dansCstDouble=false;
                if(autoriserCstDansRacine !== true){
                    if(niveau === 0){
                        /* cas d'erreur = "" */
                        return(logerreur(formaterErreurRev({
                            __xst:false,
                            ind:i,
                            __xme:'core 1194 functionToArray2 la racine ne peut pas contenir des constantes ',
                            type:'rev',
                            texte:texte,
                            chaineTableau:chaineTableau,
                            tabComment:tabCommentaireEtFinParentheses,
                            tableauEntree:tableauEntree,
                            quitterSiErreurNiveau:quitterSiErreurNiveau,
                            autoriserCstDansRacine:autoriserCstDansRacine
                        })));
                    }
                }
                constanteQuotee=3;
                constanteQuoteePrecedente=3;
                /* methode3" */
                texte=texte.replace(/\\/g,'\\\\');
                texte=texte.replace(/"/g,'\\"');
                texte=replaceAll(texte,'\n',chLF);
                texte=replaceAll(texte,'\r',chCR);
                texte=replaceAll(texte,'\t','\\t');
                indice++;
                chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                */
                typePrecedent='c';
                niveauPrecedent=niveau;
                textePrecedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === (l01 - 1)){
                    return(logerreur({__xst:false,'__xva':T,'id':i,__xme:'un antislash ne doit pas terminer une constante en i=' + i}));
                }
                /**/
                c1=tableauEntree[i + 1][0];
                if((c1 === '\\')
                 || (c1 === '"')
                 || (c1 === 'n')
                 || (c1 === 't')
                 || (c1 === 'r')
                 || (c1 === 'u')
                 || (c1 === 'b')
                 || (c1 === 'f')
                 || (c1 === 'x')
                 || (c1 === 'v')
                 || (c1 === '0')
                 || (c1 === '>')
                 || (c1 === '<')
                 || (c1 === '/')
                 || (c1 === '&')
                 || (c1 === '$')){
                    if(texte === ''){
                        premier=i;
                    }
                    texte+='\\' + c1;
                    i++;
                }else if(c1 === '"'){
                    texte+=texte + '"';
                    i++;
                }else{
                    return(logerreur(formaterErreurRev({
                        __xst:false,
                        ind:i,
                        __xme:'1215 un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u ',
                        type:'rev',
                        texte:texte,
                        chaineTableau:chaineTableau,
                        tabComment:tabCommentaireEtFinParentheses,
                        tableauEntree:tableauEntree,
                        quitterSiErreurNiveau:quitterSiErreurNiveau,
                        autoriserCstDansRacine:autoriserCstDansRacine
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
                    if(i === (l01 - 1)){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1656 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                if((i + 1) < l01){
                    drapeauRegex='';
                    c1=tableauEntree[i + 1][0];
                    if((c1 === ',')
                     || (c1 === '\t')
                     || (c1 === '\n')
                     || (c1 === '\r')
                     || (c1 === '/')
                     || (c1 === ' ')
                     || (c1 === ')')){
                        dernier=i - 1;
                    }else{
                        for(j=i + 1;j < l01;j++){
                            c1=tableauEntree[j][0];
                            if((c1 === ',')
                             || (c1 === '\t')
                             || (c1 === '\n')
                             || (c1 === '\r')
                             || (c1 === '/')
                             || (c1 === ' ')
                             || (c1 === ')')){
                                dernier=j;
                                i=j - 1;
                                break;
                            }else{
                                drapeauRegex+=c1;
                            }
                        }
                    }
                }else{
                    if( !(autoriserCstDansRacine === true)){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1258 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                dansCstRegex=false;
                constanteQuotee=4;
                constanteQuoteePrecedente=4;
                if(autoriserCstDansRacine !== true){
                    if(niveau === 0){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1305 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                /* methode3regex */
                texte=texte.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
                if((texte.indexOf('\n') > 0) || (texte.indexOf('\r') >= 0) || (texte.indexOf('\t') > 0)){
                    return(logerreur(formaterErreurRev({
                        __xst:false,
                        ind:premier,
                        __xme:'1839 il ne peut pas y avoir des retours à la ligne ou des tabulations dans une chaine de type regex ',
                        type:'rev',
                        texte:texte,
                        chaineTableau:chaineTableau,
                        tabComment:tabCommentaireEtFinParentheses,
                        tableauEntree:tableauEntree,
                        quitterSiErreurNiveau:quitterSiErreurNiveau,
                        autoriserCstDansRacine:autoriserCstDansRacine
                    })));
                }
                indice++;
                chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                */
                /*
                  pour une regex, on met les drapeaux ( g,...) dans la zone commentaire [13]
                */
                tabCommentaireEtFinParentheses[indiceTabCommentaire]=[indice,drapeauRegex,0];
                indiceTabCommentaire++;
                typePrecedent='c';
                niveauPrecedent=niveau;
                textePrecedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === (l01 - 1)){
                    temp={__xst:false,'__xva':T,'id':i,__xme:'un antislash ne doit pas terminer une fonction'};
                    return(logerreur(temp));
                }
                /**/
                c1=tableauEntree[i + 1][0];
                if(texte === ''){
                    premier=i;
                }
                texte+='\\' + c1;
                i++;
            }else if((c === '\n') || (c === '\r')){
                return(logerreur(formaterErreurRev({
                    __xst:false,
                    ind:premier,
                    __xme:'1251 il ne peut pas y avoir des retours à la ligne dans une chaine de type regex ',
                    type:'rev',
                    texte:texte,
                    chaineTableau:chaineTableau,
                    tabComment:tabCommentaireEtFinParentheses,
                    tableauEntree:tableauEntree,
                    quitterSiErreurNiveau:quitterSiErreurNiveau,
                    autoriserCstDansRacine:autoriserCstDansRacine
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
                    if(i === (l01 - 1)){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1239 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                if((i + 1) < l01){
                    c1=tableauEntree[i + 1][0];
                    if((c1 === ',')
                     || (c1 === '\t')
                     || (c1 === '\n')
                     || (c1 === '\r')
                     || (c1 === '/')
                     || (c1 === ' ')
                     || (c1 === ')')){
                        dernier=i - 1;
                    }else{
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,(i - 100),(i + 110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i + 10));
                        }
                        temp={__xst:false,'__xva':T,'id':i,__xme:'1394 apres une constante, il doit y avoir un caractère d\'echappement près de ' + presDe};
                        return(logerreur(temp));
                    }
                }else{
                    if( !(autoriserCstDansRacine === true)){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1258 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                dansCstModele=false;
                constanteQuotee=2;
                constanteQuoteePrecedente=2;
                if(autoriserCstDansRacine !== true){
                    if(niveau === 0){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1398 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                /* methode3m */
                texte=texte.replace(/\\/g,'\\\\');
                texte=texte.replace(/"/g,'\\"');
                texte=replaceAll(texte,'\n',chLF);
                texte=replaceAll(texte,'\r',chCR);
                texte=replaceAll(texte,'\t','\\t');
                indice++;
                chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                */
                typePrecedent='c';
                niveauPrecedent=niveau;
                textePrecedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === (l01 - 1)){
                    temp={__xst:false,'__xva':T,'id':i,__xme:'un antislash ne doit pas terminer une fonction'};
                    return(logerreur(temp));
                }
                /**/
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
                    if(i === (l01 - 1)){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1317 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                if((i + 1) < l01){
                    c1=tableauEntree[i + 1][0];
                    if((c1 === ',')
                     || (c1 === '\t')
                     || (c1 === '\n')
                     || (c1 === '\r')
                     || (c1 === '/')
                     || (c1 === ' ')
                     || (c1 === ')')){
                        dernier=i - 1;
                    }else{
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,(i - 100),(i + 110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i + 10));
                        }
                        temp={__xst:false,'__xva':T,'id':i,__xme:'1472 apres une constante, il doit y avoir un caractère d\'echappement,i=' + i + ' c1="' + c1 + '" près de ' + presDe};
                        return(logerreur(temp));
                    }
                }else{
                    if( !(autoriserCstDansRacine === true)){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1336 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                if(autoriserCstDansRacine !== true){
                    if(niveau === 0){
                        temp={__xst:false,'id':i,'__xva':T,__xme:'1345 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                dansCstSimple=false;
                constanteQuotee=1;
                constanteQuoteePrecedente=1;
                /* methode3' */
                texte=texte.replace(/\\/g,'\\\\');
                texte=texte.replace(/"/g,'\\"');
                texte=replaceAll(texte,'\n',chLF);
                texte=replaceAll(texte,'\r',chCR);
                texte=replaceAll(texte,'\t','\\t');
                indice++;
                chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                /*
                  version avec push mais c'est très lent sur chrome                
                  T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                */
                typePrecedent='c';
                niveauPrecedent=niveau;
                textePrecedent=texte;
                texte='';
                constanteQuotee=0;
            }else if(c === '\\'){
                if(i === (l01 - 1)){
                    temp={__xst:false,'__xva':T,'id':i,__xme:'un antislash ne doit pas terminer une fonction'};
                    return(logerreur(temp));
                }
                /**/
                c1=tableauEntree[i + 1][0];
                if(false){
                    if(texte === ''){
                        premier=i;
                    }
                    texte+=c1;
                    i++;
                }else if((c1 === '\\')
                 || (c1 === '\'')
                 || (c1 === '/')
                 || (c1 === 'n')
                 || (c1 === 't')
                 || (c1 === 'r')
                 || (c1 === 'u')
                 || (c1 === 'b')
                 || (c1 === 'f')
                 || (c1 === 'x')
                 || (c1 === 'v')
                 || (c1 === '0')
                 || (c1 === '&')
                 || (c1 === '$')){
                    if(texte === ''){
                        premier=i;
                    }
                    texte+='\\' + c1;
                    i++;
                }else{
                    return(logerreur(formaterErreurRev({
                        __xst:false,
                        ind:i,
                        __xme:'1371 un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u',
                        type:'rev',
                        texte:texte,
                        chaineTableau:chaineTableau,
                        tabComment:tabCommentaireEtFinParentheses,
                        tableauEntree:tableauEntree,
                        quitterSiErreurNiveau:quitterSiErreurNiveau,
                        autoriserCstDansRacine:autoriserCstDansRacine
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
                posOuvPar=i;
                if(texte === DEBUTCOMMENTAIRE){
                    dsComment=true;
                    niveauDebutCommentaire=niveau;
                }
                if(texte === DEBUTBLOC){
                    dsComment=true;
                    niveauDebutCommentaire=niveau;
                }
                if(drapeauParenthese){
                    tableauParenthesesCommentaires.push(i);
                }
                /*
                  le nom d'une fonction peut être vide , par exemple dans le cas html, on écrit a[[href,'exemple']]
                */
                indice++;
                chaineTableau+=',[' + indice + ',"' + texte + '",' + '"f"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                /*
                  T.push(Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                */
                typePrecedent='f';
                niveauPrecedent=niveau;
                niveau=niveau + 1;
                textePrecedent=texte;
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
                posFerPar=i;
                
                if(texte !== ''){
                    if(niveau === 0){
                     
                     
                        return(logerreur(formaterErreurRev({
                            'erreur_conversion_chaineTableau_en_json':true,
                            __xst:false,
                            ind:i,
                            __xme:'1786 une fermeture de parenthése ne doit pas être au niveau 0',
                            type:'rev',
                            chaineTableau:chaineTableau,
                            tabComment:tabCommentaireEtFinParentheses,
                            tableauEntree:tableauEntree,
                            quitterSiErreurNiveau:quitterSiErreurNiveau,
                            autoriserCstDansRacine:autoriserCstDansRacine
                        })));
                     
                    }
                    indice++;
                    chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                    /*
                      T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    */
                    typePrecedent='c';
                    niveauPrecedent=niveau;
                    textePrecedent=texte;
                    texte='';
                }else{
                    /* à faire : parentèse fermante avec un virgule avant : x(a,) */
                    /**
                    if(niveauPrecedent === niveau && textePrecedent===''  && constanteQuoteePrecedente===0 ){
                        return(logerreur(formaterErreurRev({
                            __xst:false,
                            ind:premier,
                            __xme:'1803 une virgule ne doit terminer une fonction ',
                            type:'rev',
                            texte:texte,
                            chaineTableau:chaineTableau,
                            tabComment:tabCommentaireEtFinParentheses,
                            tableauEntree:tableauEntree,
                            quitterSiErreurNiveau:quitterSiErreurNiveau,
                            autoriserCstDansRacine:autoriserCstDansRacine
                        })));
                    }
                    */
                }
                niveau--;
                if(drapeauParenthese){
                    if(i === (l01 - 1)){
                        /*
                          si on est en recherche de parenthèse correspondante et que c'est le dernier caractère du tableau en entrée
                          alors c'est une recherche de parenthèse ouvrante correspondante
                        */
                        chaineTableau='[' + chaineTableau + ']';
                        try{
                            T=JSON.parse(chaineTableau);
                        }catch(ejson){
                            console.log('ejson=',ejson);
                            return(logerreur(formaterErreurRev({
                                'erreur_conversion_chaineTableau_en_json':true,
                                __xst:false,
                                ind:i,
                                __xme:'1555 erreur de conversion de tableau',
                                type:'rev',
                                chaineTableau:chaineTableau,
                                tabComment:tabCommentaireEtFinParentheses,
                                tableauEntree:tableauEntree,
                                quitterSiErreurNiveau:quitterSiErreurNiveau,
                                autoriserCstDansRacine:autoriserCstDansRacine
                            })));
                        }
                        if(rechercheParentheseCorrespondante === '('){
                            return({__xst:true,'posFerPar':tableauEntree[i][2]});
                        }else{
                            for(j=T.length - 1;j >= 0;j--){
                                if(T[j][3] < T[T.length - 1][3]){
                                    return({__xst:true,'posOuvPar':tableauEntree[T[j][11]][2]});
                                    break;
                                }
                            }
                        }
                    }else{
                        if((niveau === 0) && (rechercheParentheseCorrespondante === '(')){
                            /*
                              il faut retourner la position réelle en tenant compte des
                              caractères utf8
                            */
                            return({__xst:true,'posFerPar':tableauEntree[posFerPar][2]});
                        }
                    }
                }
                posFerPar=0;
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
                if( !(dansCstSimple)){
                    temp={__xst:false,'__xva':T,'id':i,__xme:'1474 un antislash doit être dans une constante en i=' + i};
                    return(logerreur(temp));
                }
                if( !(dansCstDouble)){
                    temp={__xst:false,'__xva':T,'id':i,__xme:'1478 un antislash doit être dans une constante en i=' + i};
                    return(logerreur(temp));
                }
                if( !(dansCstModele)){
                    temp={__xst:false,'__xva':T,'id':i,__xme:'1482 un antislash doit être dans une constante en i=' + i};
                    return(logerreur(temp));
                }
                if( !(dansCstRegex)){
                    temp={__xst:false,'__xva':T,'id':i,__xme:'1482 un antislash doit être dans une constante en i=' + i};
                    return(logerreur(temp));
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
                        chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                        /*
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                        */
                        typePrecedent='c';
                        niveauPrecedent=niveau;
                        textePrecedent=texte;
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
                        chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                        /*
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                        */
                        typePrecedent='c';
                        niveauPrecedent=niveau;
                        textePrecedent=texte;
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
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                        */
                        chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                        typePrecedent='c';
                        niveauPrecedent=niveau;
                        textePrecedent=texte;
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
                        chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                        /*
                          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                        */
                        typePrecedent='c';
                        niveauPrecedent=niveau;
                        textePrecedent=texte;
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
                            temp={__xst:false,'__xva':T,'id':i,__xme:'1563 la racine ne peut pas contenir des constantes'};
                            return(logerreur(temp));
                        }
                    }
                    indice++;
                    chaineTableau+=',[' + indice + ',"' + texte + '","c",' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,' + posOuvPar + ',' + posFerPar + ',""]';
                    /*
                      T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    */
                    textePrecedent='';
                    texte='';
                    typePrecedent='c';
                    niveauPrecedent=niveau;
                }else{
                    if(typePrecedent === 'f'){
                        if(niveauPrecedent === niveau){
                            /*
                             cas très spécial : todo
                            */
                            typePrecedent='c';
                            textePrecedent='';
                            constanteQuoteePrecedente=0;
                        }else{
                            if(niveauPrecedent < niveau){
                                return(logerreur(formaterErreurRev({
                                    __xst:false,
                                    ind:premier,
                                    __xme:'2023 une virgule ne doit pas être précédée d\'un vide',
                                    type:'rev',
                                    texte:texte,
                                    chaineTableau:chaineTableau,
                                    tabComment:tabCommentaireEtFinParentheses,
                                    tableauEntree:tableauEntree,
                                    quitterSiErreurNiveau:quitterSiErreurNiveau,
                                    autoriserCstDansRacine:autoriserCstDansRacine
                                })));
                             
                            }
                        }
                    }else{
                        if(niveauPrecedent < niveau ){
                            return(logerreur(formaterErreurRev({
                                __xst:false,
                                ind:premier,
                                __xme:'2041 une virgule ne doit pas être précédée d\'un vide',
                                type:'rev',
                                texte:texte,
                                chaineTableau:chaineTableau,
                                tabComment:tabCommentaireEtFinParentheses,
                                tableauEntree:tableauEntree,
                                quitterSiErreurNiveau:quitterSiErreurNiveau,
                                autoriserCstDansRacine:autoriserCstDansRacine
                            })));
                         

                        }else if(niveauPrecedent === niveau && textePrecedent==='' && constanteQuoteePrecedente===0 ){ // constanteQuoteePrecedente
                            return(logerreur(formaterErreurRev({
                                __xst:false,
                                ind:premier,
                                __xme:'2067 une virgule ne doit pas être précédée d\'un vide ',
                                type:'rev',
                                texte:texte,
                                chaineTableau:chaineTableau,
                                tabComment:tabCommentaireEtFinParentheses,
                                tableauEntree:tableauEntree,
                                quitterSiErreurNiveau:quitterSiErreurNiveau,
                                autoriserCstDansRacine:autoriserCstDansRacine
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
            }else if((c === ' ') || (c === '\t') || (c === '\r') || (c === '\n')){
                /*
                  =====================================================================================
                  caractères séparateurs de mot
                  =====================================================================================
                */
                if(texte !== ''){

                    if(autoriserCstDansRacine !== true){
                        if(niveau === 0){
                            return(logerreur(formaterErreurRev({
                                __xst:false,
                                ind:premier,
                                __xme:'1602 la racine ne peut pas contenir des constantes',
                                type:'rev',
                                texte:texte,
                                chaineTableau:chaineTableau,
                                tabComment:tabCommentaireEtFinParentheses,
                                tableauEntree:tableauEntree,
                                quitterSiErreurNiveau:quitterSiErreurNiveau,
                                autoriserCstDansRacine:autoriserCstDansRacine
                            })));
                        }
                    }
                    indice++;
                    chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,0,0,""]';
                    /*
                      T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    */
                    typePrecedent='c';
                    niveauPrecedent=niveau;
                    textePrecedent=texte;
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
    if((niveau !== 0) && (quitterSiErreurNiveau)){
        return(logerreur(formaterErreurRev({
            __xst:false,
            'ind':(l01 - 1),
            __xme:'💥2401 des parenthèses ne correspondent pas, (' + ((niveau > 0)?'il en manque :':'il y en a trop : ') + 'niveau=' + niveau + ') ',
            type:'rev',
            texte:texte,
            chaineTableau:chaineTableau,
            tabComment:tabCommentaireEtFinParentheses,
            tableauEntree:tableauEntree,
            quitterSiErreurNiveau:quitterSiErreurNiveau,
            autoriserCstDansRacine:autoriserCstDansRacine
        })));
    }
    /*
      Si on autorise les constantes à la racine, il reste peut être du texte à traiter
    */
    if(texte !== ''){
        indice=indice + 1;
        if(autoriserCstDansRacine !== true){
            if(niveau === 0){
                return(logerreur(formaterErreurRev({
                    __xst:false,
                    'ind':(l01 - 1),
                    __xme:'1641 la racine ne peut pas contenir des constantes ',
                    type:'rev',
                    texte:texte,
                    chaineTableau:chaineTableau,
                    tabComment:tabCommentaireEtFinParentheses,
                    tableauEntree:tableauEntree,
                    quitterSiErreurNiveau:quitterSiErreurNiveau,
                    autoriserCstDansRacine:autoriserCstDansRacine
                })));
            }
        }
        /*
          T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
        */
        chaineTableau+=',[' + indice + ',"' + texte + '",' + '"c"' + ',' + niveau + ',' + constanteQuotee + ',' + premier + ',' + dernier + ',0,0,0,0,0,0,""]';
        typePrecedent='c';
        niveauPrecedent=niveau;
    }
    /*
      =============================================================================================================
      On reconstruit chaineTableau ici
      =============================================================================================================
    */
    chaineTableau='[' + chaineTableau + ']';
    try{
        T=JSON.parse(chaineTableau);
    }catch(ejson){
        return(logerreur(formaterErreurRev({
            ejson:ejson,
            'erreur_conversion_chaineTableau_en_json':true,
            __xst:false,
            __xme:'1836 erreur de conversion de tableau',
            type:'rev',
            chaineTableau:chaineTableau,
            tabComment:tabCommentaireEtFinParentheses,
            tableauEntree:tableauEntree,
            quitterSiErreurNiveau:quitterSiErreurNiveau,
            autoriserCstDansRacine:autoriserCstDansRacine
        })));
    }
    if(drapeauParenthese){
        l01=T.length;
        for(i=l01 - 1;i >= 0;i--){
            if(T[i][3] === niveau){
                /*
                  à cause des décallages utf8, il faut prendre la position réelle dans le tableau en entrée
                */
                return({__xst:true,'posOuvPar':tableauEntree[T[i][11]][2]});
            }
        }
        return({__xst:false,__xme:'pas de correspondance trouvée'});
    }
    /*
      Puis on ajoute les commentaires 
      tabCommentaireEtFinParentheses[indiceTabCommentaire]=[indice,commentaire,posFerPar];
      T[indice][13]=commentaire;
      T[indice][12]=posFerPar;
    */
    l01=tabCommentaireEtFinParentheses.length;
    for(i=0;i < l01;i++){
        T[tabCommentaireEtFinParentheses[i][0]][13]=tabCommentaireEtFinParentheses[i][1];
        T[tabCommentaireEtFinParentheses[i][0]][12]=tabCommentaireEtFinParentheses[i][2];
    }
    /*
      
      =============================================================================================================
      mise à jour de l'id du parent[7] et du nombre d'éléments[8]
      =============================================================================================================
    */
    l01=T.length;
    for(i=l01 - 1;i > 0;i--){
        k=T[i][3];
        for(j=i;j >= 0;j--){
            if(T[j][3] === (k - 1)){
                T[i][7]=j;
                T[j][8]++;
                break;
            }
        }
    }
    /*
      
      =============================================================================================================
      numérotation des enfants
      numenfant = k
      =============================================================================================================
    */
    k=0;
    for(i=0;i < l01;i++){
        k=0;
        for(j=i + 1;j < l01;j++){
            if(T[j][7] === T[i][0]){
                k++;
                T[j][9]=k;
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
    for(i=l01 - 1;i > 0;i--){
        if(T[i][2] === 'c'){
            T[i][10]=0;
        }
        if(T[i][7] > 0){
            k=T[i][3];
            l=T[i][7];
            for(j=1;j <= k;j++){
                if(T[l][10] < j){
                    T[l][10]=j;
                }
                l=T[l][7];
            }
        }
    }
    temp={__xst:true,'__xva':T};
    return temp;
}