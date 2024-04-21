"use strict";
var DEBUTCOMMENTAIRE='#';
var DEBUTBLOC='@';
var CRLF='\r\n';
var NBESPACESREV=3;
var globale_LangueCourante='fr';
var global_messages={'e500logged':false,'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'ranges':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
var globale_timeout_serveur_lent = 1500; // after 1.5 seconds of waiting response a message appears.
var globale_timeout_reference=null;

//=====================================================================================================================
function displaySlowServer() {
    try{
        var elem=document.getElementById('sloserver1');
        if(elem){
            var opa = parseInt(elem.style.opacity * 100, 10);
            if (opa < 100) {
                var newOpa = opa / 100 + 0.1;
                if (newOpa > 1) newOpa = 1;
                document.getElementById('sloserver1').style.opacity = newOpa;
                setTimeout(displaySlowServer, 30);
            }
        }else{
        }
    }catch(e){
    }
}

//=====================================================================================================================
function slowServer1() {
    var divId = document.createElement('div');
    divId.id = 'sloserver1';
    divId.style.top = '55px';
    divId.style.left = '0px';
    divId.style.position = 'fixed';
    divId.style.padding = '8px';
    divId.style.zIndex = 10000;
    divId.style.textAlign = 'center';
    divId.style.fontSize = '2em';
    divId.style.width = '99.99%';
    divId.style.borderRadius = '3px';
    divId.className = 'yyerror';
    divId.style.opacity = 0.0;
    divId.innerHTML = 'désolé, le serveur est lent, veuillez patienter';
    document.getElementsByTagName('body')[0].appendChild(divId);
    setTimeout(displaySlowServer, 0);
}
//=====================================================================================================================
function reactiverLesBoutons(){
 
    clearTimeout(globale_timeout_reference);
    var lstb1 = document.getElementsByTagName('body')[0].getElementsByTagName('button');
    for (var i = 0; i < lstb1.length; i++) {
        if (!(lstb1[i].onclick)) {
            if (lstb1[i].className && lstb1[i].className.indexOf('noHide') >= 0) {
             
            } else {
                lstb1[i].style.visibility = "";
            }
        }
    }
    var lstb1 = document.getElementsByTagName('body')[0].getElementsByTagName('input');
    for (var i = 0; i < lstb1.length; i++) {
        if (!(lstb1[i].onclick)) {
            if (lstb1[i].className && lstb1[i].className.indexOf('noHide') >= 0) {
             
            } else {
                 if(lstb1[i].type==='submit'){
                     lstb1[i].style.visibility = "";
                 }
            }
        }
    }
    var lsta1 = document.getElementsByTagName('body')[0].getElementsByTagName('a');
    for (var i = 0; i < lsta1.length; i++) {
        if (lsta1[i].href && !(lsta1[i].href.indexOf('javascript') >= 0)) {
            if (lsta1[i].className && lsta1[i].className.indexOf('noHide') >= 0) {} else {
                lsta1[i].addEventListener("click", clickLink1, false);
                lsta1[i].classList.remove("yyunset");
            }
        }
    }
    try{
       var elem=document.getElementById('sloserver1');
       elem.remove();
    }catch(e){}

 
}
//=====================================================================================================================
function clickLink1(e) {
    try {
        e.target.className = "yyunset";
    } catch (e1) {}
    globale_timeout_reference=setTimeout(slowServer1, globale_timeout_serveur_lent);
}
//=====================================================================================================================
function clickButton1(e) {
    try {
        e.target.style.visibility = "hidden";
    } catch (e1) {}
    globale_timeout_reference=setTimeout(slowServer1, globale_timeout_serveur_lent);
}
//=====================================================================================================================
window.onload = function() {
 /*
        fixMenu1();
*/        
        var lstb1 = document.getElementsByTagName('body')[0].getElementsByTagName('button');
        for (var i = 0; i < lstb1.length; i++) {
            if (!(lstb1[i].onclick)) {
                if (lstb1[i].className && lstb1[i].className.indexOf('noHide') >= 0) {
                 
                } else {
                    lstb1[i].addEventListener("click", clickButton1, false);
                }
            }
        }
        var lstb1 = document.getElementsByTagName('body')[0].getElementsByTagName('input');
        for (var i = 0; i < lstb1.length; i++) {
            if (!(lstb1[i].onclick)) {
                if (lstb1[i].className && lstb1[i].className.indexOf('noHide') >= 0) {
                 
                } else {
                     if(lstb1[i].type==='submit'){
                         lstb1[i].addEventListener("click", clickButton1, false);
                     }
                }
            }
        }
        var lsta1 = document.getElementsByTagName('body')[0].getElementsByTagName('a');
        for (var i = 0; i < lsta1.length; i++) {
            if (lsta1[i].href && !(lsta1[i].href.indexOf('javascript') >= 0)) {
                if (lsta1[i].className && lsta1[i].className.indexOf('noHide') >= 0) {} else {
                    lsta1[i].addEventListener("click", clickLink1, false);
                }
            }
        }
/*        
        if (globalCssSettings1.other.autocompleteInput == 0) {
            // ajouter des autocomplete
            var lstb1 = document.getElementsByTagName('body')[0].getElementsByTagName('input');
            for (var i = 0; i < lstb1.length; i++) {
                if (lstb1[i].type && lstb1[i].type.toLowerCase() == 'text') {
                    lstb1[i].setAttribute('autocomplete', 'off');
                }
            }
            var lstb1 = document.getElementsByTagName('body')[0].getElementsByTagName('textarea');
            for (var i = 0; i < lstb1.length; i++) {
                if (lstb1[i].type && lstb1[i].type.toLowerCase() == 'text') {
                    lstb1[i].setAttribute('autocomplete', 'off');
                }
            }
        }
*/
        
/*        getScrollWidth();
//        getPageSize();
//        pageFunction(); // this function calls finally a void function or doLocalPage ( see za_inc.php/function htmlFoot0 to see the implementation )
*/
}

/*
  =====================================================================================================================
  supprime les messages de la zone global_messages et efface la zone de texte qui contient les message
  =====================================================================================================================
*/
function clearMessages(nomZone){
    try{
        document.getElementById(nomZone).innerHTML='';
    }catch(e){
    }
    global_messages={'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'ranges':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
}
/*
  =====================================================================================================================
  affiche les messages contenus dans la variable global_messages
  =====================================================================================================================
*/
function displayMessages(nomZone){
    var i=0;
    for(i=0;i < global_messages.errors.length;i=(i+1)){
        document.getElementById(nomZone).innerHTML+='<div class="yyerror">'+global_messages.errors[i]+'</div>';
    }
    for(i=0;i < global_messages.warnings.length;i=(i+1)){
        document.getElementById(nomZone).innerHTML+='<div class="yywarning">'+global_messages.warnings[i]+'</div>';
    }
    for(i=0;i < global_messages.infos.length;i=(i+1)){
        document.getElementById(nomZone).innerHTML+='<div class="yyinfo">'+global_messages.infos[i]+'</div>';
    }
    for(i=0;i < global_messages.lines.length;i=(i+1)){
        document.getElementById(nomZone).innerHTML+='<a href="javascript:jumpToError('+global_messages.lines[i]+1+')" class="yyerror" style="border:2px red outset;">go to line '+global_messages.lines[i]+'</a>&nbsp;';
    }
    if((global_messages.data.matrice) && (global_messages.data.matrice.value)){
        var numLignePrecedente=-1;
        for(i=0;i < global_messages.ids.length;i=(i+1)){
            var id = global_messages.ids[i];
            if((global_messages.data.matrice) && (id < global_messages.data.matrice.value.length)){
                var ligneMatrice = global_messages.data.matrice.value[id];
                var caractereDebut = ligneMatrice[5];
                var numeroDeLigne=0;
                var j=caractereDebut;
                for(j=caractereDebut;j >= 0;j=j-1){
                    if(global_messages.data.tableau.out[j][0] == '\n'){
                        numeroDeLigne=(numeroDeLigne+1);
                    }
                }
            }
            if(numeroDeLigne > 0){
                if(numeroDeLigne != numLignePrecedente){
                    document.getElementById(nomZone).innerHTML+='<a href="javascript:jumpToError('+(numeroDeLigne+1)+')" class="yyerror" style="border:2px red outset;">go to line '+numeroDeLigne+'</a>&nbsp;';
                    numLignePrecedente=numeroDeLigne;
                }
            }
        }
    }
    for(i=0;i < global_messages.ranges.length;i=(i+1)){
        document.getElementById(nomZone).innerHTML+='<a href="javascript:jumpToRange('+global_messages.ranges[i][0]+','+global_messages.ranges[i][1]+')" class="yyerror" style="border:2px red outset;">go to range '+global_messages.ranges[i][0]+','+global_messages.ranges[i][1]+'</a>&nbsp;';
    }
}
/*
  =====================================================================================================================
  met les valeurs dans la variable global_messages
  =====================================================================================================================
*/
function logerreur(o){
    if(o.hasOwnProperty('status')){
        if(o.status === false){
            if(o.hasOwnProperty('message')){
                global_messages['errors'].push(o.message);
            }
            if(o.hasOwnProperty('id')){
                global_messages['ids'].push(o.id);
            }
        }else{
            if(o.hasOwnProperty('message')){
                if(o.message != ''){
                    global_messages['infos'].push(o.message);
                }
            }else if(o.hasOwnProperty('warning')){
                if(o.warning != ''){
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
    if(o.line){
        global_messages['lines'].push(o.line);
    }
    return o;
}
/*
  =====================================================================================================================
  Mes petites fonctions utilitaires dont le désormais fameux dogid ! ... fameux pour moi uniquement 
  mais je l'aime tellement!
  =====================================================================================================================
*/
/*
  =====================================================================================================================
*/
function dogid(n){
    return(document.getElementById(n));
}
/*
  =====================================================================================================================
*/
function maConstante(tab){
    var t='';
    if(tab[4] === 1){
        t='\''+tab[1]+'\'';
    }else if(tab[4] === 2){
        t='`'+tab[1]+'`';
    }else{
        if(tab[1] === 'vrai'){
            t='true';
        }else if(tab[1] === 'faux'){
            t='false';
        }else{
            t=tab[1];
        }
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
        t+=String(arguments[a]);
    }
    return t;
}
/*
  =====================================================================================================================
*/
function isNumeric(str){
    if(typeof str != 'string'){
        return false;
    }
    var leTest =  !(isNaN(str)) &&  !(isNaN(parseFloat(str)));
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
        t+=' '.repeat(NBESPACESREV*(i));
    }
    return t;
}
/*
  =====================================================================================================================
  Pour les appels ajax qui ne fonctionnent pas, on 
  =====================================================================================================================
*/
function display_ajax_error_in_cons(jsonRet){
    var txt='';
    if(jsonRet.hasOwnProperty('status')){
        txt+='status:'+jsonRet.status+'\n';
    }
    if(jsonRet.hasOwnProperty('messages')){
        if((typeof jsonRet.messages === 'string') || (jsonRet.messages instanceof String)){
            txt+='Please, put messages in an array in the server !!!!\n';
            txt+='messages='+jsonRet.messages;
            txt+='\n';
        }else{
            txt+='messages[]=\n';
            var elem={};
            for(elem in jsonRet.messages){
                global_messages[errors].push(jsonRet.messages[elem]);
                txt+=''+jsonRet.messages[elem]+'\n';
            }
            txt+='\n';
        }
    }
    displayMessages();
    console.log('%c'+txt,'color:red;background:orange;');
    console.log('jsonRet=',jsonRet);
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
function functionToArray(src,quitterSiErreurNiveau){
    var tableau1 = iterateCharacters2(src);
    var matriceFonction = functionToArray2(tableau1.out,quitterSiErreurNiveau,false);
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
  fonction split avec regex, par exemple : var lines = a.value.split(/\r|\r\n|\n/);
  =====================================================================================================================
*/
function mySplit(s,t){
    var r1= new RegExp(t,'');
    var ret = s.split(r1);
    return ret;
}

/*
  =====================================================================================================================
  fonction qui se base sur la colonne [3] : niveau pour recalculer 
  - le parent[7], 
  - le nombre d'enfants[8], 
  - le numéro d'enfant[9]
  - la profondeur[10]
  =====================================================================================================================
*/
function reIndicerLeTableau(tab){
    var l01=tab.length;
    var k=0;
    var j=0;
    var i=0;
    var niveau=0;
    
    
    /*
      =================================================================================================================
      indice et nombre d'enfants
      =================================================================================================================
    */
    for(i=1;i<l01;i++){
        tab[i][0]=i;
        tab[i][8]=0;
    }
    
    /*
      =================================================================================================================
      parent et nombre d'enfants
      =================================================================================================================
    */
    for(i=l01-1;i > 0;i=i-1){
        niveau=tab[i][3];
        for(j=i;j >= 0;j=j-1){
            if(tab[j][3] == niveau-1){
                tab[i][7]=j;
                tab[j][8]=(tab[j][8]+1);
                break;
            }
        }
    }
    /*
      =================================================================================================================
      numéro d'enfant
      =================================================================================================================
    */
    for(i=0;i < l01;i=(i+1)){
        k=0;
        for(j=(i+1);j < l01;j=(j+1)){
            if(tab[j][7] == tab[i][0]){
                k=(k+1);
                tab[j][9]=k;
            }
        }
    }
    /*
      =================================================================================================================
      profondeur
      =================================================================================================================
    */
    var l=0;
    for(i=l01-1;i > 0;i=i-1){
        if(tab[i][2] == 'c'){
            tab[i][10]=0;
        }
        if(tab[i][7] > 0){
            k=tab[i][3];
            l=tab[i][7];
            for(j=1;j <= k;j=(j+1)){
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
  fonction qui supprime un élément dans la matrice et descend les enfants de cet élément d'un niveau
  =====================================================================================================================
*/
function baisserNiveauEtSupprimer(tab,id,niveau){
    var i = (id+1);
    for(i=(id+1);i < tab.length;i=i+1){
        if(tab[i][7] === id){
            tab[i][3]=tab[i][3]-1;
            if(tab[i][2] === 'f'){
                niveau=niveau+1;
                /*
                  appel récursif pour baisser les enfants des enfants
                */
                baisserNiveauEtSupprimer(tab,i,niveau);
                niveau=niveau-1;
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
    var i=0;
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
    var newTab = Array();
    var tab = Array();
    /**/
    unBloc=' '.repeat(nbEspacesSrc1*(niveau));
    tab=texte.split('\n');
    l01=tab.length;
    /**/
    if(texte.length > 1){
        temps=texte.substr(0,1);
        if(temps == '#'){
            /*
              on a un commentaire de type bloc non formaté 
              car le premier caractère = #.
              On supprime les espaces inutiles en début de ligne.
            */
            t='';
            min=99999;
            for(i=1;i < l01;i=(i+1)){
                ligne=tab[i];
                for(j=0;j < ligne.length;j=(j+1)){
                    /*
                      on balaye toutes les lignes pour détecter 
                      le nombre d'espaces minimal à gauche
                    */
                    temps=ligne.substr(j,1);
                    if(temps != ' '){
                        if(j < min){
                            /*on réajuste le minimum*/
                            min=j;
                        }
                        /* et on passe à la ligne suivante*/
                        break;
                    }
                }
            }
            if(min > 2){
                /*tout décaler à gauche*/
                for(i=1;i < l01;i=(i+1)){
                    tab[i]=tab[i].substr(min-2);
                }
            }
            /* si c'est un fichierRev0, on doit avoir la dernière ligne vide*/
            if(fichierRev0){
                ligne=tab[tab.length-1];
                ligne=replaceAll(ligne,' ','');
                if(ligne != ''){
                    tab.push(unBloc);
                }else{
                    tab[tab.length-1]=unBloc;
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
    unBlocPlus1=' '.repeat(nbEspacesSrc1*(niveau)+2);
    var s1='';
    var s2='';
    for(i=0;i < l01;i=(i+1)){
        t='';
        /*on enlève les espaces au début*/
        for(j=0;j < tab[i].length;j=(j+1)){
            temps=tab[i].substr(j,1);
            if(temps != ' '){
                temps=tab[i].substr(j);
                t=concat(t,temps);
                break;
            }
        }
        s1=concat(unBloc,t);
        s2=concat(unBlocPlus1,t);
        if(i == l01-1){
            /*la dernière ligne du commentaire de bloc doit être vide*/
            if(t == ''){
                newTab.push(unBloc);
            }else{
                /*on met la ligne et on ajoute une ligne vide*/
                newTab.push(s2);
                newTab.push(unBloc);
            }
        }else if(i == 0){
            /*la première ligne du commentaire de bloc doit être vide*/
            if(t == ''){
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
    t=newTab.join('\n');
    return t;
}
/*
  =============================================
  =============================================
  =============================================
  fonction transforme un texte pour qu'il  soit 
  visible en html, par exemple &nbsp; ou bien <
  =============================================
  =============================================
  =============================================
*/
function strToHtml(s){
    var r1= new RegExp('&','g');
    var r2= new RegExp('<','g');
    var r3= new RegExp('>','g');
    s=s.replace(r1,'&amp;');
    s=s.replace(r2,'&lt;');
    s=s.replace(r3,'&gt;');
    return s;
}
/*
  =================================================
  =================================================
  =================================================
  fonction qui reconstitue un texte source à partir  
  du tableau représentant la matrice  du  programme
  =================================================
  =================================================
  =================================================
*/
function a2F1(arr,parentId,retourLigne,debut,coloration){
    /*
      ========================================
      Attention : cette fonction est récursive
      ========================================
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
    var l01=0;
    l01=arr.length;
    /*
      =====================================================================
      boucle principale qui commence à partir de "debut" passé en paramètre
      =====================================================================
    */
    for(i=debut;i < l01;i=(i+1)){
        /*
          on ne traite que les enfants et les éléments 
          dont le niveau est supérieur au niveau du parent
        */
        if(arr[i][7] == parentId){
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
        if((retourLigne == true) && (arr[parentId][10] > profondeurLimite)){
            forcerRetourLigne=true;
        }else if(((retourLigne == true) && (arr[parentId][2] == 'f')) || (arr[parentId][2] == 'INIT')){
            /*le type du parent est une fonction ou bien c'est la racine*/
            /*
              Si c'est la premier enfant d'une fonction, 
              on teste si il existe des enfants de type commentaires
            */
            for(j=debut;(j < l01) && (arr[j][3] > arr[parentId][3]);j=(j+1)){
                if((arr[j][1] == DEBUTCOMMENTAIRE) && (arr[j][2] == 'f') && (arr[j][3] < arr[parentId][3]+profondeurLimite)){
                    /*
                      il y a un commentaire
                      c'est une fonction
                      niveau inférieur à celui du parent + profondeur limite
                    */
                    forcerRetourLigne=true;
                    break;
                }
            }
            for(j=debut;(j < l01) && (arr[j][3] > arr[parentId][3]);j=(j+1)){
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
        condition1=((arr[parentId][2] == 'f') && (arr[parentId][8] <= nombreEnfantsLimite)) && (arr[parentId][10] <= profondeurLimite);
        if(arr[i][9] > 1){
            /*!forcerRetourLigne && retourLigne==true && condition1*/
            if(( !(forcerRetourLigne) && (retourLigne == true)) && (condition1)){
                t=concat(t,' , ');
            }else{
                t=concat(t,',');
            }
        }
        if((forcerRetourLigne) && (arr[parentId][2] != 'INIT')){
            t=concat(t,espacesnrev(false,arr[i][3]));
        }else if(retourLigne){
            if(((arr[parentId][2] == 'INIT') && (arr[i][9] == 1)) || (condition1)){
                /*on ne fait rien*/
            }else{
                t=concat(t,espacesnrev(false,arr[i][3]));
            }
        }
        /*
          ======================================
          ici, forcerRetourLigne est vrai ou pas
          ======================================
          si  on  doit  traiter  une  constante
          ======================================
        */
        if(arr[i][2] == 'c'){
            if(coloration){
                if(arr[i][4] == 1){
                    t=concat(t,'\'',strToHtml(arr[i][1]),'\'');
                }else if(arr[i][4] == 2){
                    t=concat(t,'`',strToHtml(arr[i][1]),'`');
                }else{
                    t=concat(t,strToHtml(arr[i][1]));
                }
            }else{
                if(arr[i][4] == 1){
                    t=concat(t,'\'',arr[i][1],'\'');
                }else if(arr[i][4] == 2){
                    t=concat(t,'`',arr[i][1],'`');
                }else{
                    t=concat(t,arr[i][1]);
                }
            }
            continue;
        }
        /*
          
          
          ===================================================
          si on doit traiter une fonction de type commentaire
          ===================================================            
        */
        if((arr[i][2] == 'f') && (arr[i][1] == DEBUTCOMMENTAIRE)){
            /*
              ==========================
              on est dans un commentaire
              ==========================
            */
            commentaire=ttcomm1(arr[i][13],arr[i][3],i);
            if(coloration){
                /*mise en forme en HTML*/
                commentaire=strToHtml(commentaire);
                if(retourLigne){
                    t=concat(t,'<span ','style="','color:darkgreen;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',commentaire,')','</span>');
                }else{
                    t=concat(t,'<span ','style="','color:darkgreen;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',')','</span>');
                }
            }else{
                /*pas de mise en forme en HTML*/
                if(retourLigne){
                    t=concat(t,arr[i][1],'(',commentaire,')');
                }else{
                    t=concat(t,arr[i][1],'()');
                }
            }
            continue;
        }
        /*
          ===================================================
          si on doit traiter une fonction de type bloc
          ===================================================            
        */
        if((arr[i][2] == 'f') && (arr[i][1] == DEBUTBLOC)){
            /*
              ==========================
              on est dans un bloc
              ==========================
            */
            commentaire=arr[i][13];
            if(coloration){
                /*mise en forme en HTML*/
                commentaire=strToHtml(commentaire);
                if(retourLigne){
                    t=concat(t,'<span ','style="','color:navy;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',commentaire,')','</span>');
                }else{
                    t=concat(t,'<span ','style="','color:navy;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',')','</span>');
                }
            }else{
                /*pas de mise en forme en HTML*/
                if(retourLigne){
                    t=concat(t,arr[i][1],'(',commentaire,')');
                }else{
                    t=concat(t,arr[i][1],'()');
                }
            }
            continue;
        }
        /*
          
          
          ===========================================================
          pour toutes les autres fonctions, on fait un appel récursif
          ===========================================================    
        */
        var obj={};
        obj=a2F1(arr,i,retourLigne,(i+1),coloration);
        if(obj.status === true){
            /*on ajoute le nom de la fonction et on ouvre la parenthèse*/
            if(coloration){
                t=concat(t,strToHtml(arr[i][1]),'(');
            }else{
                t=concat(t,arr[i][1],'(');
            }
            /*
              ============================================
              on ajoute le contenu récursif de la fonction
              ============================================
            */
            t=concat(t,obj.value);
            /*
              on met les retours de ligne
            */
            if((forcerRetourLigne) && (obj.forcerRetourLigne == true)){
                t=concat(t,espacesnrev(false,arr[i][3]));
            }else if(retourLigne){
                if( !((arr[i][8] <= nombreEnfantsLimite) && (arr[i][10] <= profondeurLimite))){
                    t=concat(t,espacesnrev(false,arr[i][3]));
                }
            }
            /*
              on ferme la parenthèse
            */
            t=concat(t,')');
        }else{
            obj={'status':false,'message':'erreur','id':i};
            return obj;
        }
    }
    obj={'status':true,'value':t,'forcerRetourLigne':forcerRetourLigne};
    return obj;
}
/*
  
  
  
  
  ===========================================
  ===========================================
  ===========================================
  fonction qui produit un tableau html de  la
  liste des caractères du source du programme
  ===========================================
  ===========================================
  ===========================================
*/
function ConstruitHtmlTableauCaracteres(t2,texteSource,objTableau){
    var numeroLigne=0;
    var debut=0;
    var i=0;
    var j=0;
    var l01=0;
    var tmps='';
    var out = Array();
    t2.setAttribute('class','tableau2');
    if(objTableau === null){
        /*On construit le tableau à partir du texte source*/
        var outo={};
        outo=iterateCharacters2(texteSource);
        out=outo.out;
    }else{
        out=objTableau.out;
    }
    /*
      première case du tableau = numéro de ligne
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.innerHTML=numeroLigne;
    tr1.appendChild(td1);
    /*boucle principale*/
    l01=out.length;
    for(i=0;i < l01;i=(i+1)){
        var td1={};
        td1=document.createElement('td');
        td1.innerHTML=out[i][0].replace('\n','\\n');
        tmps=out[i][0].codePointAt(0);
        td1.title=concat('&amp;#',tmps,'; (',out[i][1],')');
        tr1.appendChild(td1);
        /*
          ============================================
          Si on a un retour chariot, on écrit les 
          cases contenant les positions des caractères
          ============================================
        */
        if(out[i][0] == '\n'){
            t2.appendChild(tr1);
            /*
              
              
              =================================================
              indice dans tableau = première ligne des chiffres
              =================================================
            */
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;j < i;j=(j+1)){
                var td1={};
                td1=document.createElement('td');
                if(out[j][1] == 1){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=j;
                tr1.appendChild(td1);
            }
            /*
              
              =====================
              position du backslash
              =====================
            */
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=j;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            /*
              
              ========================================================
              position dans la chaine = deuxième ligne des chiffres
              car certains caractères utf8 sont codées sur 2 positions
              ========================================================
            */
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;j < i;j=(j+1)){
                var td1={};
                td1=document.createElement('td');
                if(out[j][1] == 1){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=out[j][2];
                tr1.appendChild(td1);
            }
            /*
              
              =====================
              position du backslash
              =====================
            */
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=out[j][2];
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            /*
              
              
              ======================================
              fin des lignes contenant les positions
              ======================================
            */
            debut=(i+1);
            numeroLigne=(numeroLigne+1);
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.innerHTML=numeroLigne;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
        }
    }
    /*
      ============================================
      FIN Si on a un retour chariot, on écrit les 
      cases contenant les positions des caractères
      ============================================
    */
    /*dernière ligne de faire boucle*/
    /*
      dernière ligne des positions des caractères
    */
    t2.appendChild(tr1);
    /*
      
      
      =================================================
      indice dans tableau = première ligne des chiffres
      =================================================
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;j < i;j=(j+1)){
        var td1={};
        td1=document.createElement('td');
        if(out[j][1] == 1){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=j;
        tr1.appendChild(td1);
    }
    /*finchoix suite du source*/
    t2.appendChild(tr1);
    /*
      =====================
      pas de position du backslash
      =====================
    */
    /*
      =====================================================
      position dans la chaine = deuxième ligne des chiffres
      =====================================================
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;j < i;j=(j+1)){
        var td1={};
        td1=document.createElement('td');
        if(out[j][1] == 1){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=out[j][2];
        tr1.appendChild(td1);
    }
    /*finchoix suite du source*/
    /*et enfin, on ajoute la dernière ligne*/
    t2.appendChild(tr1);
}
/*
  ==========================================
  ==========================================
  ==========================================
  fonction qui produit un tableau html de la
  forme matricielle du programme
  ==========================================
  ==========================================
  ==========================================
*/
function ConstruitHtmlMatrice(t1,matriceFonction){
    /**/
    var i=0;
    var j=0;
    var l01=0;
    var temp='';
    var tr1={};
    var td1={};
    var r1= new RegExp(' ','g');
    var r2= new RegExp('\n','g');
    var r3= new RegExp('&','g');
    var r4= new RegExp('<','g');
    var r5= new RegExp('>','g');
    var largeurTable1EnPx='1000';
    var largeurColonne1EnPx='400';
    t1.className='yytableauMatrice1';
    tr1=document.createElement('tr');
    /*
      =================
      entête du tableau
      =================
    */
    l01=global_enteteTableau.length;
    for(i=0;i < l01;i=(i+1)){
        var td1={};
        td1=document.createElement('th');
        td1.innerHTML=concat(i,global_enteteTableau[i][0]);
        /**/
        td1.setAttribute('title',concat(global_enteteTableau[i][1],'(',i,')'));
        tr1.appendChild(td1);
    }
    t1.appendChild(tr1);
    /*
      
      
      ===================
      éléments du tableau
      ===================
    */
    l01=matriceFonction.value.length;
    for(i=0;i < l01;i=(i+1)){
        var tr1={};
        tr1=document.createElement('tr');
        for(j=0;j < matriceFonction.value[i].length;j=(j+1)){
            var td1={};
            td1=document.createElement('td');
            if((j == 1) || (j == 13)){
                /*Pour la valeur ou les commentaires*/
                temp=String(matriceFonction.value[i][j]);
                temp=temp.replace(r1,'░');
                temp=temp.replace(r2,'¶');
                temp=temp.replace(r3,'&amp;');
                temp=temp.replace(r4,'&lt;');
                temp=temp.replace(r5,'&gt;');
                td1.innerHTML=temp;
                td1.style.whiteSpace='pre-wrap';
                td1.style.verticalAlign='baseline';
                td1.style.maxWidth=largeurColonne1EnPx+'px';
                td1.style.overflowWrap='break-word';
            }else if(j == 4){
                td1.innerHTML=matriceFonction.value[i][j];
                if(matriceFonction.value[i][j] === 1){
                }else if(matriceFonction.value[i][j] === 2){
                    td1.style.background='lightgrey';
                }
            }else{
                td1.innerHTML=String(matriceFonction.value[i][j]);
            }
            temp=concat(global_enteteTableau[j][1],'(',j,')');
            td1.setAttribute('title',temp);
            tr1.appendChild(td1);
        }
        t1.appendChild(tr1);
    }
}
/*
  ===========================================
  ===========================================
  ===========================================
  fonction qui transforme un texte en tableau
  ===========================================
  ===========================================
  ===========================================
*/
function iterateCharacters2(str){
    var out = Array();
    var i=0;
    var exceptions=0;
    var numLigne=0;
    var l01=str.length;
    var codeCaractere='';
    var retour={};
    var temp=0;
    for(i=0;i < l01;i=(i+1)){
        codeCaractere=str.charCodeAt(i);
        /*
          zero width space , vertical tab
        */
        if( !((codeCaractere === 8203) || (codeCaractere === 11))){
            /*
              0xD800 =55296
            */
            temp=codeCaractere&0xF800;
            if(temp === 55296){
                out.push(Array(
                    str.substr(i,2),2,i,numLigne
                ));
                i=(i+1);
            }else{
                out.push(Array(
                    str.substr(i,1),1,i,numLigne
                ));
                if(codeCaractere === 10){
                    numLigne=(numLigne+1);
                }
            }
        }else{
            exceptions=(exceptions+1);
        }
    }
    retour={'out':out,'numLigne':numLigne,'exceptions':exceptions};
    return retour;
}
/*
  ==================================================
  ==================================================
  ==================================================
  reconstruit une chaine à partir du tableau
  c'est utile en cas d'erreur !
  ==================================================
  ==================================================
  ==================================================
*/
function reconstruitChaine(tab,debut,fin){
    var t='';
    var i=debut;
    for(i=debut;(i <= fin) && (i < tab.length);i=(i+1)){
        t+=tab[i][0];
    }
    return t;
}
/*
  ==================================================
  ==================================================
  ==================================================
  tableau retourné par l'analyse syntaxique 
  du texte en entrée de la fonction functionToArray2
  ==================================================
  ==================================================
  ==================================================
*/
var global_enteteTableau = Array(
    Array('id','id'),
    Array('val','value'),
    Array('typ','type'),
    Array('niv','niveau'),
    Array('coQ','constante quotée'),
    Array('pre','position du premier caractère'),
    Array('der','position du dernier caractère'),
    Array('pId','Id du parent'),
    Array('nbE','nombre d\'enfants'),
    Array('nuE','numéro enfants'),
    Array('pro','profondeur'),
    Array('pop','position ouverture parenthese'),
    Array('pfp','position fermeture parenthese'),
    Array('com','commentaire')
);
/*
  ===================================================
  ===================================================
  ===================================================
  fonction d'analyse syntaxique d'un programme source
  ===================================================
  ===================================================
  ===================================================
*/
function functionToArray2(tableauEntree,quitterSiErreurNiveau,autoriserCstDansRacine){
    /*
      =========================
      les chaines de caractères
      =========================
    */
    var texte='';
    var commentaire='';
    var c='';
    var c1='';
    var c2='';
    /*
      =========================
      les entiers
      =========================
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
    /*
      =========================
      les booléens
      =========================
    */
    var dansCstSimple=false;
    var dansCstDouble=false;
    var dansCstModele=false;
    var dsComment=false;
    var dsBloc=false;
    var constanteQuotee=0;
    /*
      ====================================
      Le tableau en sortie si tout va bien
      ====================================
    */
    var T= new Array();
    var temp={};
    /*
      =======================================================================
      initialisation du tableau contenant le source structuré en arborescence
      =======================================================================
      0id    1val  2typ  3niv  4coQ
      5pre   6der  7pId  8nbE  9numEnfant  
      10pro 11OPa 12FPa 13comm
    */
    T.push(Array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
    var l01=tableauEntree.length;
    /*
      // ====================================================================
      // ====================================================================
      // boucle principale sur tous les caractères du texte passé en argument
      // on commence par analyser les cas ou on est dans des chaines, puis on
      // analyse les caractères
      // ====================================================================
      // ====================================================================
    */
    for(i=0;i < l01;i=(i+1)){
        c=tableauEntree[i][0];
        if(dsComment){
            /*
              
              
              
              =============================
              Si on est dans un commentaire
              =============================
            */
            if(c == ')'){
                if((niveau == (niveauDebutCommentaire+1)) && (niveauDansCommentaire == 0)){
                    posFerPar=i;
                    T[T.length-1][13]=commentaire;
                    T[T.length-1][12]=posFerPar;
                    commentaire='';
                    dsComment=false;
                    niveau=niveau-1;
                }else{
                    commentaire=concat(commentaire,c);
                    niveauDansCommentaire=niveauDansCommentaire-1;
                }
            }else if(c == '('){
                commentaire=concat(commentaire,c);
                niveauDansCommentaire=(niveauDansCommentaire+1);
            }else{
                commentaire=concat(commentaire,c);
            }
            /*
              =============================
              FIN de Si on est dans un commentaire
              =============================
              
              
              
            */
        }else if(dansCstDouble == true){
            /*
              
              
              
              ===================================
              Si on est dans une constante double
              ===================================
            */
            if(c == '"'){
                if(autoriserCstDansRacine !== true){
                    if(i == l01-1){
                        temp={'status':false,'id':i,'value':T,'message':'1148 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                if((i+1) < l01){
                    c1=tableauEntree[i+1][0];
                    if((c1 == ',') || (c1 == '\t') || (c1 == '\n') || (c1 == '\r') || (c1 == '/') || (c1 == ' ') || (c1 == ')')){
                        dernier=i-1;
                    }else{
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                        }
                        temp={'status':false,'value':T,'id':i,'message':'0 apres une constante, il doit y avoir un caractère d\'echappement près de '+presDe};
                        return(logerreur(temp));
                    }
                }else{
                    if( !(autoriserCstDansRacine === true)){
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                        }
                        temp={'status':false,'id':i,'value':T,'message':'1172 la racine ne peut pas contenir des constantes près de '+presDe};
                        return(logerreur(temp));
                    }
                }
                dansCstDouble=false;
                indice=(indice+1);
                constanteQuotee=1;
                if(autoriserCstDansRacine !== true){
                    if(niveau == 0){
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                        }
                        temp={'status':false,'id':i,'value':T,'message':'1186 la racine ne peut pas contenir des constantes près de '+presDe};
                        return(logerreur(temp));
                    }
                }
                T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                texte='';
                constanteQuotee=0;
            }else if(c == '\\'){
                if(i == l01-1){
                    temp={'status':false,'value':T,'id':i,'message':'un antislash ne doit pas terminer une fonction en i='+i};
                    return(logerreur(temp));
                }
                /**/
                c1=tableauEntree[i+1][0];
                if((c1 == '\\') || (c1 == '"') || (c1 == 'n') || (c1 == 't') || (c1 == 'r') || (c1 == 'u')){
                    if(texte == ''){
                        premier=i;
                    }
                    texte=concat(texte,'\\',c1);
                    i=(i+1);
                }else if(c1 == '"'){
                    texte=concat(texte,'"');
                    i=(i+1);
                }else{
                    temp={'status':false,'value':T,'id':i,'message':'1215 un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u en i='+i};
                    return(logerreur(temp));
                }
            }else if(c == '\''){
                texte=concat(texte,'\\\'');
            }else{
                if(texte == ''){
                    premier=i;
                }
                texte=concat(texte,c);
            }
            /*
              ==========================================
              Fin de Si on est dans une constante double
              ==========================================
            */
        }else if(dansCstModele == true){
            /*
              
              
              
              ===================================
              Si on est dans une constante modèle
              ===================================
            */
            if(c == '`'){
                if(autoriserCstDansRacine !== true){
                    if(i == l01-1){
                        temp={'status':false,'id':i,'value':T,'message':'1239 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                if((i+1) < l01){
                    c1=tableauEntree[i+1][0];
                    if((c1 == ',') || (c1 == '\t') || (c1 == '\n') || (c1 == '\r') || (c1 == '/') || (c1 == ' ') || (c1 == ')')){
                        dernier=i-1;
                    }else{
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                        }
                        temp={'status':false,'value':T,'id':i,'message':'1394 apres une constante, il doit y avoir un caractère d\'echappement près de '+presDe};
                        return(logerreur(temp));
                    }
                }else{
                    if( !(autoriserCstDansRacine === true)){
                        temp={'status':false,'id':i,'value':T,'message':'1258 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                dansCstModele=false;
                indice=(indice+1);
                constanteQuotee=2;
                if(autoriserCstDansRacine !== true){
                    if(niveau == 0){
                        temp={'status':false,'id':i,'value':T,'message':'1267 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                texte='';
                constanteQuotee=0;
            }else if(c == '\\'){
                if(i == l01-1){
                    temp={'status':false,'value':T,'id':i,'message':'un antislash ne doit pas terminer une fonction'};
                    return(logerreur(temp));
                }
                /**/
                c1=tableauEntree[i+1][0];
                if((c1 == '\\') || (c1 == '`') || (c1 == 'n') || (c1 == 't') || (c1 == 'r') || (c1 == 'u')){
                    if(texte == ''){
                        premier=i;
                    }
                    texte=concat(texte,'\\',c1);
                    i=(i+1);
                }else{
                    temp={'status':false,'value':T,'id':i,'message':'1293 un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u'};
                    return(logerreur(temp));
                }
            }else{
                if(texte == ''){
                    premier=i;
                }
                texte=concat(texte,c);
            }
            /*
              ==========================================
              Fin de Si on est dans une constante modèle
              ==========================================
              
              
              
            */
        }else if(dansCstSimple == true){
            /*
              
              
              
              ===================================
              Si on est dans une constante simple
              ===================================
            */
            if(c == '\''){
                if(autoriserCstDansRacine !== true){
                    if(i == l01-1){
                        temp={'status':false,'id':i,'value':T,'message':'1317 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                
                if((i+1) < l01){
                    c1=tableauEntree[i+1][0];
                    if((c1 == ',') || (c1 == '\t') || (c1 == '\n') || (c1 == '\r') || (c1 == '/') || (c1 == ' ') || (c1 == ')')){
                        dernier=i-1;
                    }else{
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                        }
                        temp={'status':false,'value':T,'id':i,'message':'1472 apres une constante, il doit y avoir un caractère d\'echappement,i='+i+' c1="'+c1+'" près de '+presDe};
                        return(logerreur(temp));
                    }
                }else{
                    if( !(autoriserCstDansRacine === true)){
                        temp={'status':false,'id':i,'value':T,'message':'1336 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                if(autoriserCstDansRacine !== true){
                    if(niveau == 0){
                        temp={'status':false,'id':i,'value':T,'message':'1345 la racine ne peut pas contenir des constantes'};
                        return(logerreur(temp));
                    }
                }
                dansCstSimple=false;
                indice=(indice+1);
                constanteQuotee=1;
                T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                texte='';
                constanteQuotee=0;
            }else if(c == '\\'){
                if(i == l01-1){
                    temp={'status':false,'value':T,'id':i,'message':'un antislash ne doit pas terminer une fonction'};
                    return(logerreur(temp));
                }
                /**/
                c1=tableauEntree[i+1][0];
                if( false ){
                    if(texte == ''){
                        premier=i;
                    }
                    texte=concat(texte,c1);
                    i=(i+1);
                }else if( (c1 == '\\') || (c1 == '\'') || (c1 == 'n') || (c1 == 't') || (c1 == 'r') || (c1 == 'u')){
                    if(texte == ''){
                        premier=i;
                    }
                    texte=concat(texte,'\\',c1);
                    i=(i+1);
                }else{
                    if(i > 100){
                        var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                    }else{
                        var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                    }
                    temp={'status':false,'value':T,'id':i,'message':'1371 un antislash doit être suivi par un autre antislash ou un apostrophe ou n,t,r,u près de '+presDe};
                    return(logerreur(temp));
                }
            }else{
                if(texte == ''){
                    premier=i;
                }
                texte=concat(texte,c);
            }
            /*
              ==========================================
              Fin de Si on est dans une constante simple
              ==========================================
              
              
              
            */
        }else{
            /*
              
              
              
              ==================================================
              on n'est pas dans un commentaire ou une constante,  
              donc c'est un nouveau type qu'il faut détecter
              ==================================================
            */
            if(c == '('){
                /*
                  ====================
                  Parenthèse ouvrante
                  ====================
                  
                  
                */
                posOuvPar=i;
                indice=(indice+1);
                if(texte == DEBUTCOMMENTAIRE){
                    dsComment=true;
                    niveauDebutCommentaire=niveau;
                }
                if(texte == DEBUTBLOC){
                    dsComment=true;
                    niveauDebutCommentaire=niveau;
                }
                T.push(Array(indice,texte,'f',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                niveau=(niveau+1);
                texte='';
                dansCstSimple=false;
                dansCstDouble=false;
                dansCstModele=false;
                /*
                  ==========================
                  FIN DE Parenthèse ouvrante
                  ==========================
                  
                  
                */
            }else if(c == ')'){
                /*
                  
                  
                  ====================
                  Parenthèse fermante
                  ====================
                */
                posFerPar=i;
                if(texte != ''){
                    if(niveau == 0){
                        if(i > 100){
                            var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                        }else{
                            var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                        }
                     
                        temp={'status':false,'value':T,'id':i,'message':'une fermeture de parenthése ne doit pas être au niveau 0 près de '+presDe};
                        return(logerreur(temp));
                    }
                    indice=(indice+1);
                    T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    texte='';
                }
                niveau=niveau-1;
                /*
                  
                  maj de la position de fermeture de la parenthèse
                  
                */
                for(j=indice;j >= 0;j=j-1){
                    if((T[j][3] == niveau) && (T[j][2] == 'f')){
                        T[j][12]=posFerPar;
                        break;
                    }
                }
                posFerPar=0;
                dansCstSimple=false;
                dansCstDouble=false;
                dansCstModele=false;
                /*
                  ==========================
                  FIN de Parenthèse fermante
                  ==========================
                  
                  
                */
            }else if(c == '\\'){
                /*
                  
                  
                  ===========
                  anti slash 
                  ===========
                */
                if( !(dansCstSimple)){
                    temp={'status':false,'value':T,'id':i,'message':'1474 un antislash doit être dans une constante en i='+i};
                    return(logerreur(temp));
                }
                if( !(dansCstDouble)){
                    temp={'status':false,'value':T,'id':i,'message':'1478 un antislash doit être dans une constante en i='+i};
                    return(logerreur(temp));
                }
                if( !(dansCstModele)){
                    temp={'status':false,'value':T,'id':i,'message':'1482 un antislash doit être dans une constante en i='+i};
                    return(logerreur(temp));
                }
                /*
                  ===================
                  Fin d'un anti slash
                  ===================
                  
                  
                */
            }else if(c == '\''){
                /*
                  
                  
                  //===========
                  // apostrophe
                  //===========
                */
                premier=i;
                if(dansCstSimple == true){
                    dansCstSimple=false;
                }else{
                    if(texte!==''){
                        indice=(indice+1);
                        T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                        texte='';
                    }
                    dansCstSimple=true;
                }
                /*
                  //===============
                  // FIN apostrophe
                  //===============
                  
                  
                */
            }else if(c == '`'){
                /*
                  
                  
                  //===========
                  // modele `
                  //===========
                */
                premier=i;
                if(dansCstModele == true){
                    dansCstModele=false;
                }else{
                    if(texte!==''){
                        indice=(indice+1);
                        T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                        texte='';
                    }
                    dansCstModele=true;
                }
                /*
                  //===============
                  // FIN modele `
                  //===============
                  
                  
                */
            }else if(c == '"'){
                /*
                  
                  
                  //=============
                  // double quote
                  //=============
                */
                premier=i;
                if(dansCstDouble == true){
                    dansCstDouble=false;
                }else{
                    if(texte!==''){
                        indice=(indice+1);
                        T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
                        texte='';
                    }
                    dansCstDouble=true;
                }
                /*
                  //=================
                  // FIN double quote
                  //=================
                  
                  
                */
            }else if(c == ','){
                /*
                  
                  
                  //========================
                  // virgule donc séparateur
                  //========================
                */
                if(texte != ''){
                    indice=(indice+1);
                    if(autoriserCstDansRacine !== true){
                        if(niveau == 0){
                            temp={'status':false,'value':T,'id':i,'message':'1563 la racine ne peut pas contenir des constantes'};
                            return(logerreur(temp));
                        }
                    }
                    T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                }else{
                    if(T[indice][2] == 'f'){
                        /*ne rien faire*/
                    }else{
                        if(T[indice][3] >= niveau){
                            /*ne rien faire*/
                        }else{
                            temp={'status':false,'value':T,'id':i,'message':'une virgule ne doit pas être précédée d\'un vide'};
                            return(logerreur(temp));
                        }
                    }
                }
                texte='';
                dansCstSimple=false;
                dansCstDouble=false;
                dansCstModele=false;
                /*
                  //============================
                  // FIN virgule donc séparateur
                  //============================
                  
                  
                */
            }else if((c == ' ') || (c == '\t') || (c == '\r') || (c == '\n')){
                /*
                  
                  
                  =============================
                  caractères séparateurs de mot
                  =============================
                */
                if(texte != ''){
                    indice=(indice+1);
                    if(autoriserCstDansRacine !== true){
                        if(niveau == 0){
                            temp={'status':false,'value':T,'id':i,'message':'1602 la racine ne peut pas contenir des constantes'};
                            return(logerreur(temp));
                        }
                    }
                    T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
                    texte='';
                    dansCstSimple=false;
                    dansCstDouble=false;
                    dansCstModele=false;
                }
                /*
                  ====================================
                  FIN de caractères séparateurs de mot
                  ====================================
                  
                  
                */
            }else{
                if(texte == ''){
                    premier=i;
                }
                dernier=i;
                texte=concat(texte,c);
            }
        }
    }
    /*
      ========================================
      on est en dehors de la boucle principale
      ========================================
    */
    if((niveau != 0) && (quitterSiErreurNiveau)){
        temp={'status':false,'value':T,'message':'des parenthèses ne correspondent pas'};
        return(logerreur(temp));
    }
    /**/
    if(texte != ''){
        indice=(indice+1);
        if(autoriserCstDansRacine !== true){
            if(niveau == 0){
                if(i > 100){
                    var presDe = reconstruitChaine(tableauEntree,i-100,(i+110));
                }else{
                    var presDe = reconstruitChaine(tableauEntree,0,(i+10));
                }
             
                temp={'status':false,'value':T,'message':'1641 la racine ne peut pas contenir des constantes près de'+presDe};
                return(logerreur(temp));
            }
        }
        /**/
        T.push(Array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
    }
    /*
      
      ==============================================================
      // mise à jour de l'id du parent[7] et du nombre d'éléments[8]
      ============================================================== 
    */
    l01=T.length;
    for(i=l01-1;i > 0;i=i-1){
        niveau=T[i][3];
        for(j=i;j >= 0;j=j-1){
            if(T[j][3] == niveau-1){
                T[i][7]=j;
                T[j][8]=T[j][8]+1;
                break;
            }
        }
    }
    /*
      
      ============================== 
      numérotation des enfants
      numenfant = k
      ==============================
    */
    k=0;
    for(i=0;i < l01;i=(i+1)){
        k=0;
        for(j=(i+1);j < l01;j=(j+1)){
            if(T[j][7] == T[i][0]){
                k=(k+1);
                T[j][9]=k;
            }
        }
    }
    /*
      =======================================
      profondeur des fonctions
      k=remonterAuNiveau
      l=idParent
      =======================================
    */
    for(i=l01-1;i > 0;i=i-1){
        if(T[i][2] == 'c'){
            T[i][10]=0;
        }
        if(T[i][7] > 0){
            k=T[i][3];
            l=T[i][7];
            for(j=1;j <= k;j=(j+1)){
                if(T[l][10] < j){
                    T[l][10]=j;
                }
                l=T[l][7];
            }
        }
    }
    temp={'status':true,'value':T};
    return temp;
}