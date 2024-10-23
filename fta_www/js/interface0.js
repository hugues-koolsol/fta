"use strict";
var global_editeur_derniere_valeur_selecStart=-1;
var global_editeur_derniere_valeur_selectEnd=-1;
var global_editeur_debut_texte='';
var global_editeur_fin_texte='';
var global_editeur_debut_texte_tab = [];
var global_editeur_scrolltop=0;
var global_editeur_nomDeLaTextArea='';
var global_editeur_timeout=null;
var global_indice_erreur_originale_traitee=-1;
var global_programme_en_arriere_plan=null;
/*
  
  =====================================================================================================================
  si il y a des web workers qui ne sont pas terminés, il faut les relancer
  =====================================================================================================================
*/
function recuperer_les_travaux_en_arriere_plan_de_la_session(){
    if(NOMBRE_DE_TRAVAUX_EN_ARRIERE_PLAN > 0){
        var r= new XMLHttpRequest();
        r.open("POST",'za_ajax.php?recuperer_les_travaux_en_arriere_plan_de_la_session',true);
        r.timeout=6000;
        r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        r.onreadystatechange=function(){
            if((r.readyState != 4) || (r.status != 200)){
                if(r.status == 404){
                    console.log('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
                }else if(r.status == 500){
                    /*
                      
                      normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                      au niveau du php za_ajax mais sait-on jamais
                    */
                    if(global_messages['e500logged'] == false){
                        try{
                            console.log('r=',r);
                        }catch(e){
                        }
                    }
                }
                return;
            }
            try{
                var jsonRet = JSON.parse(r.responseText);
                if(jsonRet.status == 'OK'){
                    console.log('il y a des travaux en arrière plan',jsonRet.valeur);
                    var tableau_des_travaux = [];
                    var i={};
                    for(i in jsonRet.valeur){
                        console.log(jsonRet.valeur[i]);
                        tableau_des_travaux.push(jsonRet.valeur[i]);
                    }
                    if( !(window.Worker)){
                        return;
                    }
                    if(global_programme_en_arriere_plan === null){
                        global_programme_en_arriere_plan= new Worker("./js/module_travail_en_arriere_plan0.js");
                    }
                    global_programme_en_arriere_plan.postMessage({'type_de_message':'integrer_les_travaux_en_session','tableau_des_travaux':tableau_des_travaux});
                    return;
                }else{
                    /* pas de travail en arrière plan' */
                    return;
                }
            }catch(e){
                console.log('r=',r);
                return;
            }
        };
        r.onerror=function(e){
            console.error('e=',e);
            /* whatever(); */
            return;
        };
        r.ontimeout=function(e){
            console.error('e=',e);
            return;
        };
        var ajax_param={'call':{'lib':'php','file':'session','funct':'recuperer_les_travaux_en_arriere_plan_de_la_session'}};
        try{
            r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
        }catch(e){
            console.error('e=',e);
            /* whatever(); */
            return({status:false});
        }
    }
    return({status:true});
}
/*
  
  =====================================================================================================================
  Recherche du bloc dans la parenthèse courante et décale le bloc à droite ou à gauche
  =====================================================================================================================
*/
function decaler(direction){
    return;
    /* parentheses(); */
    /*#
    en pause pour l'instant
    if(global_editeur_derniere_valeur_selecStart < global_editeur_derniere_valeur_selectEnd){
        console.log(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd);
        var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
        var texteDebut = zoneSource.value.substr(0,global_editeur_derniere_valeur_selecStart);
        console.log(('"' + texteDebut + '"'));
        var texteFin = zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
        console.log(('"' + texteFin + '"'));
        var texteSelectionne = zoneSource.value.substr(global_editeur_derniere_valeur_selecStart,(global_editeur_derniere_valeur_selectEnd - global_editeur_derniere_valeur_selecStart));
        var tab = texteSelectionne.split('\n');
        var i=0;
        for(i=0;i < tab.length;i=(i + 1)){
            if(tab[i].length > 0){
                tab[i]=('  ' + tab[i]);
            }
        }
        var nouveauTexteDecale = tab.join('\n');
        var nouveauTexte = (texteDebut + nouveauTexteDecale + texteFin);
        zoneSource.value=nouveauTexte;
        zoneSource.focus();
        zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
    }
    */
}

/*
  
  =====================================================================================================================
*/
function createSelection(ref_element,start,end){
    if(ref_element.createTextRange){
        var selRange = ref_element.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character',start);
        selRange.moveEnd('character',(end - start));
        selRange.select();
    }else if(ref_element.setSelectionRange){
        ref_element.setSelectionRange(start,end);
    }else if(ref_element.selectionStart){
        ref_element.selectionStart=start;
        ref_element.selectionEnd=end;
    }
    ref_element.focus();
}
/*
  
  =====================================================================================================================
*/
function mettreEnCommentaire(){
    var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
    console.log(zoneSource.selectionStart,zoneSource.selectionEnd);
    var debut=0;
    var fin=zoneSource.value.length;
    var obj = iterateCharacters2(zoneSource.value);
    console.log('obj=',obj);
    var i = (zoneSource.selectionStart - 1);
    for(i=(zoneSource.selectionStart - 1);i >= 0;i=(i - 1)){
        if(obj.out[i][0] == '\n'){
            debut=(i + 1);
            break;
        }
        if(i == 0){
            debut=0;
            break;
        }
    }
    var debutBoucle=zoneSource.selectionEnd;
    if(zoneSource.selectionEnd > 1){
        if(zoneSource.value.substr((zoneSource.selectionEnd - 1),1) == '\n'){
            debutBoucle=(zoneSource.selectionEnd - 1);
        }
    }
    var i=debutBoucle;
    for(i=debutBoucle;i < obj.out.length;i=(i + 1)){
        console.log(('i=' + i + ' , c="' + obj.out[i][0] + '"'));
        if(obj.out[i][0] == '\n'){
            fin=i;
            break;
        }else if(i == (obj.out.length - 1)){
            fin=i;
            break;
        }
    }
    console.log(('debut=' + debut + ', fin=' + fin));
    var txtDeb = zoneSource.value.substr(0,debut);
    var selectionARemplacer = zoneSource.value.substr(debut,(fin - debut));
    var txtFin = zoneSource.value.substr(fin);
    console.log(('\n======\ntxtDeb="' + txtDeb + '"\n\n\nselectionARemplacer="' + selectionARemplacer + '"\n\n\ntxtFin="' + txtFin + '"'));
    var nouveauCommentaire = ('#(' + selectionARemplacer + ')');
    if(txtFin !== ''){
    }
    var nouveauTexte = (txtDeb + nouveauCommentaire + txtFin);
    console.log(('nouveauTexte="' + nouveauTexte + '"'));
    zoneSource.value=nouveauTexte;
    createSelection(zoneSource,debut,(fin + 3));
}
/*
  
  =====================================================================================================================
*/
function insertSource(nomFonction){
    var i=0;
    var j=0;
    var k=0;
    var t='';
    var toAdd='';
    var espaces='';
    var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
    if((nomFonction == 'choix') || (nomFonction == 'boucle') || (nomFonction == 'appelf') || (nomFonction == 'affecte')){
        if(global_editeur_derniere_valeur_selecStart == global_editeur_derniere_valeur_selectEnd){
            j=-1;
            if(global_editeur_debut_texte_tab.length > 0){
                espaces=global_editeur_debut_texte_tab[(global_editeur_debut_texte_tab.length - 1)][0];
                for(i=0;i < espaces.length;i=(i + 1)){
                    if((espaces.substr(i,1) == ' ') || (espaces.substr(i,1) == '\t')){
                        k=(i + 1);
                    }else{
                        j=i;
                    }
                }
            }
            var de1 = ' '.repeat(NBESPACESREV);
            if((j < 0) && (espaces.length == k)){
                if(nomFonction == 'choix'){
                    toAdd='choix(';
                    toAdd+=('\n' + espaces + de1 + 'si(');
                    toAdd+=('\n' + espaces + de1 + de1 + 'condition(');
                    toAdd+=('\n' + espaces + de1 + de1 + de1 + 'non(');
                    toAdd+=('\n' + espaces + de1 + de1 + de1 + de1 + '( egal(vrai , vrai) ),');
                    toAdd+=('\n' + espaces + de1 + de1 + de1 + de1 + 'et( egal( vrai , vrai ) )');
                    toAdd+=('\n' + espaces + de1 + de1 + de1 + ')');
                    toAdd+=('\n' + espaces + de1 + de1 + '),');
                    toAdd+=('\n' + espaces + de1 + de1 + 'alors(');
                    toAdd+=('\n' + espaces + de1 + de1 + de1 + 'affecte( a , 1 )');
                    toAdd+=('\n' + espaces + de1 + de1 + ')');
                    toAdd+=('\n' + espaces + de1 + '),');
                    toAdd+=('\n' + espaces + de1 + 'sinonsi(');
                    toAdd+=('\n' + espaces + de1 + de1 + 'condition( (true) ),');
                    toAdd+=('\n' + espaces + de1 + de1 + 'alors(');
                    toAdd+=('\n' + espaces + de1 + de1 + de1 + 'affecte(a , 1)');
                    toAdd+=('\n' + espaces + de1 + de1 + ')');
                    toAdd+=('\n' + espaces + de1 + '),');
                    toAdd+=('\n' + espaces + de1 + 'sinon(');
                    toAdd+=('\n' + espaces + de1 + de1 + 'alors(');
                    toAdd+=('\n' + espaces + de1 + de1 + de1 + 'affecte(a , 1)');
                    toAdd+=('\n' + espaces + de1 + de1 + ')');
                    toAdd+=('\n' + espaces + de1 + de1 + '#(finsinon)');
                    toAdd+=('\n' + espaces + de1 + '),');
                    toAdd+=('\n' + espaces + '),');
                    toAdd+=('\n' + espaces + '#(finchoix suite du source)');
                }else if(nomFonction == 'boucle'){
                    toAdd='boucle(';
                    toAdd+=('\n' + espaces + de1 + 'initialisation(affecte(i , 0)),');
                    toAdd+=('\n' + espaces + de1 + 'condition(inf(i , tab.length)),');
                    toAdd+=('\n' + espaces + de1 + 'increment(affecte(i , i+1)),');
                    toAdd+=('\n' + espaces + de1 + 'faire(');
                    toAdd+=('\n' + espaces + de1 + de1 + 'affecte(a , 1)');
                    toAdd+=('\n' + espaces + de1 + ')');
                    toAdd+=('\n' + espaces + '),');
                    toAdd+=('\n' + espaces + '#(fin boucle, suite du source)');
                }else if(nomFonction == 'appelf'){
                    toAdd='appelf(';
                    toAdd+=('\n' + espaces + de1 + 'r(variableDeRetour),');
                    toAdd+=('\n' + espaces + de1 + 'element(nomElement),');
                    toAdd+=('\n' + espaces + de1 + 'nomf(nomFonction),');
                    toAdd+=('\n' + espaces + de1 + 'p(parametre1),');
                    toAdd+=('\n' + espaces + de1 + 'p(parametre2)');
                    toAdd+=('\n' + espaces + '),');
                    toAdd+=('\n' + espaces + '#(fin appelf),');
                }else if(nomFonction == 'affecte'){
                    toAdd='affecte(nomVariable , valeurVariable),';
                }
                t=(global_editeur_debut_texte + toAdd + global_editeur_fin_texte);
                zoneSource.value=t;
                zoneSource.select();
                zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
                zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart;
                initialisationEditeur();
                return;
            }
        }
    }
}
/*
  
  =====================================================================================================================
*/
function initialisationEditeur(){
    var i=0;
    var j=0;
    var tabtext = [];
    var toAdd='';
    var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
    global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
    global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
    global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
    tabtext=global_editeur_debut_texte.split('\n');
    global_editeur_debut_texte_tab=[];
    j=0;
    for(i=0;i < tabtext.length;i=(i + 1)){
        global_editeur_debut_texte_tab.push([tabtext[i],j]);
        j+=(tabtext[i].length + 1);
    }
    global_editeur_fin_texte=zoneSource.value.substr(zoneSource.selectionStart);
}
/*
  
  =====================================================================================================================
*/
function razEditeur(){
    var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
    global_editeur_derniere_valeur_selecStart=-1;
    global_editeur_derniere_valeur_selectEnd=-1;
    global_editeur_debut_texte='';
    global_editeur_debut_texte_tab=[];
    global_editeur_fin_texte=zoneSource.value.substr(zoneSource.selectionStart);
    global_editeur_scrolltop=0;
}
/*
  
  =====================================================================================================================
*/
function initialiserEditeurPourUneTextArea(nomDeLaTextArea){
    global_editeur_nomDeLaTextArea=nomDeLaTextArea;
    document.getElementById(nomDeLaTextArea).onmouseup=function(e){
        /*
          
          dans chrome, si on click sur une zone sélectionnée,
          la valeur de selectionStart n'est pas mise à jour
          mais en exécutant ce petit hack, ça fonctionne...parfois
        */
        setTimeout(initialisationEditeur,16);
    };
    document.getElementById(nomDeLaTextArea).onclick=function(e){
        initialisationEditeur();
        try{
            document.getElementById('sauvegarderLeNormalise').disabled=true;
        }catch(e){
        }
        return;
    };
    document.getElementById(nomDeLaTextArea).onkeydown=function(e){
        try{
            document.getElementById('sauvegarderLeNormalise').disabled=true;
        }catch(e){
        }
        initialisationEditeur();
        global_editeur_scrolltop=this.scrollTop;
        return;
    };
    document.getElementById(nomDeLaTextArea).onkeyup=analyseKeyUp;
}
/*
  
  =====================================================================================================================
*/
function analyseKeyUp(e){
    clearTimeout(global_editeur_timeout);
    var i=0;
    var j=0;
    var tabtext = [];
    if(e.keyCode == 13){
        /* retour chariot */
        var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
        global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
        global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
        global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
        global_editeur_fin_texte=zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
        tabtext=global_editeur_debut_texte.split('\n');
        global_editeur_debut_texte_tab=[];
        j=0;
        for(i=0;i < tabtext.length;i=(i + 1)){
            global_editeur_debut_texte_tab.push([tabtext[i],j]);
            j+=(tabtext[i].length + 1);
        }
        if(global_editeur_debut_texte_tab.length >= 2){
            var textPrec = global_editeur_debut_texte_tab[(global_editeur_debut_texte_tab.length - 2)][0];
            if(textPrec != ''){
                var pos=0;
                var toAdd='';
                for(i=0;i < textPrec.length;i=(i + 1)){
                    if(textPrec.substr(i,1) != ' '){
                        pos=i;
                        break;
                    }
                    toAdd+=' ';
                }
                if(pos >= 0){
                    var offSetBack=0;
                    if(textPrec.substr((textPrec.length - 1),1) == '('){
                        if(global_editeur_fin_texte.substr(0,1) == ')'){
                            offSetBack=(toAdd.length + 1);
                            toAdd+=(' '.repeat(NBESPACESREV) + '\n' + toAdd);
                        }else{
                            toAdd+=' '.repeat(NBESPACESREV);
                        }
                    }else{
                        if(global_editeur_fin_texte.substr(0,1) == ')'){
                            if(toAdd.length > 2){
                            }
                        }
                    }
                    this.value=(global_editeur_debut_texte + toAdd + global_editeur_fin_texte);
                    global_editeur_derniere_valeur_selecStart=(((global_editeur_derniere_valeur_selecStart + toAdd.length)) - offSetBack);
                    this.selectionStart=global_editeur_derniere_valeur_selecStart;
                    this.selectionEnd=global_editeur_derniere_valeur_selecStart;
                    global_editeur_derniere_valeur_selecStart=this.selectionStart;
                    global_editeur_derniere_valeur_selectEnd=this.selectionEnd;
                    initialisationEditeur();
                    this.scrollTop=global_editeur_scrolltop;
                }
            }
        }else{
        }
        zoneSource.scrollTo({left:0});
        window.scrollTo({left:0});
    }else if((e.keyCode == 86) && (e.ctrlKey == true)){
        /* ctrl v */
        var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
        global_editeur_timeout=setTimeout(function(){
            zoneSource.scrollTop=global_editeur_scrolltop;
        },1);
    }else if(e.keyCode == 36){
        /* home */
        var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
        zoneSource.scrollTo({left:0});
        window.scrollTo({left:0});
    }else{
        initialisationEditeur();
    }
    return false;
}
/*
  
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  Quand on clique sur un lien ou sur un bouton, on ne sait pas combien de temps va prendre le traitement.
  1°] On désactive les boutons et les liens quand l'utilisateur clique
  2°] Au bout de 1.5 secondes, on affiche une boite pour prévenir qu'il se passe quelque chose
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
var globale_timeout_serveur_lent=1500;
var globale_timeout_reference_timer_serveur_lent=null;
function miseAjourAffichageServeurLent(){
    try{
        var elem = document.getElementById('sloserver1');
        if(elem){
            var opa = parseInt((elem.style.opacity * 100),10);
            if(opa < 100){
                var newOpa = ((opa / 100) + 0.1);
                if(newOpa > 1){
                    newOpa=1;
                }
                document.getElementById('sloserver1').style.opacity=newOpa;
                setTimeout(miseAjourAffichageServeurLent,50);
            }
        }else{
        }
    }catch(e){
    }
}
/*
  
  =====================================================================================================================
*/
function affichageBoiteServeurLent(){
    var divId = document.createElement('div');
    divId.id='sloserver1';
    divId.style.top='55px';
    divId.style.left='0px';
    divId.style.position='fixed';
    divId.style.padding='8px';
    divId.style.zIndex=10000;
    divId.style.textAlign='center';
    divId.style.fontSize='1.5em';
    divId.style.width='99.99%';
    divId.style.borderRadius='3px';
    divId.className='yyerreur';
    divId.style.opacity=0.0;
    divId.innerHTML='désolé, le serveur et/ou la connexion sont lents<br /> veuillez patienter';
    document.getElementsByTagName('body')[0].appendChild(divId);
    setTimeout(miseAjourAffichageServeurLent,0);
}
/*
  
  =====================================================================================================================
*/
function reactiverLesBoutons(){
    var i=0;
    var refBody = document.getElementsByTagName('body')[0];
    clearTimeout(globale_timeout_reference_timer_serveur_lent);
    var lstb1 = refBody.getElementsByTagName('button');
    for(i=0;i < lstb1.length;i++){
        if( !(lstb1[i].onclick)){
            if((lstb1[i].className) && (lstb1[i].className.indexOf('noHide') >= 0)){
            }else{
                lstb1[i].style.visibility="";
            }
        }
    }
    var lstb1 = refBody.getElementsByTagName('input');
    for(i=0;i < lstb1.length;i++){
        if( !(lstb1[i].onclick)){
            if((lstb1[i].className) && (lstb1[i].className.indexOf('noHide') >= 0)){
            }else{
                if(lstb1[i].type === 'submit'){
                    lstb1[i].style.visibility="";
                }
            }
        }
    }
    var lsta1 = refBody.getElementsByTagName('a');
    for(i=0;i < lsta1.length;i++){
        if((lsta1[i].href) && (typeof lsta1[i].href === 'string') && ( !(lsta1[i].href.indexOf('javascript') >= 0))){
            if((lsta1[i].className) && (lsta1[i].className.indexOf('noHide') >= 0)){
            }else{
                lsta1[i].addEventListener("click",clickLink1,false);
                lsta1[i].classList.remove("yyunset");
            }
        }
    }
    try{
        var elem = document.getElementById('sloserver1');
        elem.remove();
    }catch(e){
    }
    var lstb1 = document.getElementsByClassName("yyunset_temporaire");
    for(i=0;i < lstb1.length;i++){
        lstb1[i].classList.remove('yyunset_temporaire');
    }
}
/*
  =====================================================================================================================
  quand on clique sur un lien javascript, on affiche la boite 1.5 secondes plus tard
  =====================================================================================================================
*/
function clickLinkJs1(e){
    console.log('un click');
    try{
        e.target.classList.add("yyunset_temporaire");
    }catch(e1){
    }
    setTimeout(function(){
        var lstb1 = document.getElementsByClassName("yyunset_temporaire");
        var i=0;
        for(i=0;i < lstb1.length;i++){
            lstb1[i].classList.remove('yyunset_temporaire');
        }
    },300);
}
/*
  =====================================================================================================================
  quand on clique sur un lien, on affiche la boite 1.5 secondes plus tard
  =====================================================================================================================
*/
function clickLink1(e){
    if((e.target.target) && (e.target.target.toLowerCase() === '_blank')){
    }else{
        try{
            e.target.classList.add("yyunset_temporaire");
        }catch(e1){
        }
        globale_timeout_reference_timer_serveur_lent=setTimeout(affichageBoiteServeurLent,globale_timeout_serveur_lent);
    }
}
/*
  =====================================================================================================================
  quand on clique sur un bouton, on affiche la boite 1.5 secondes plus tard
  =====================================================================================================================
*/
function clickButton1(e){
    try{
        e.target.style.visibility="hidden";
    }catch(e1){
    }
    globale_timeout_reference_timer_serveur_lent=setTimeout(affichageBoiteServeurLent,globale_timeout_serveur_lent);
}
/*
  =====================================================================================================================
  supprime les messages de la zone global_messages et efface la zone de texte qui contient les message
  =====================================================================================================================
*/
function clearMessages(nomZone){
    global_indice_erreur_originale_traitee=-1;
    try{
        document.getElementById(nomZone).innerHTML='';
        /* display a pu être mis à "none" ailleurs */
        document.getElementById(nomZone).style.visibility='hidden';
    }catch(e){
    }
    global_messages={'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'ranges':[],'positions_caracteres':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
    try{
      rangeErreurSelectionne=false;
    }catch(e){}
}
/*
  =====================================================================================================================
  affiche les messages contenus dans la variable global_messages
  =====================================================================================================================
*/
function displayMessages(nomZone,nomDeLaTextAreaContenantLeTexteSource){
    reactiverLesBoutons();
    var i=0;
    var affichagesPresents=false;
    var zon = document.getElementById(nomZone);
    var zone_message_est_vide=true;
    var numero_message=0;
    if(zon.innerHTML !== ''){
        zone_message_est_vide=false;
    }
    var numLignePrecedente=-1;
    var nombre_de_boutons_affiches=0;
    while(global_messages.errors.length > 0){
        if((zone_message_est_vide) && (numero_message === 0)){
            zon.innerHTML+=('<div class="yyerreur">' + global_messages.errors[i] + '</div>');
            numero_message++;
        }else{
            zon.innerHTML+=('<div class="yyerreur">' + global_messages.errors[i] + '</div>');
        }
        global_messages.errors.splice(0,1);
        affichagesPresents=true;
    }
    while(global_messages.warnings.length > 0){
        if((zone_message_est_vide) && (numero_message === 0)){
            zon.innerHTML+=('<div class="yyavertissement">' + global_messages.warnings[i] + '</div>');
            numero_message++;
        }else{
            zon.innerHTML+=('<div class="yyavertissement">' + global_messages.warnings[i] + '</div>');
        }
        global_messages.warnings.splice(0,1);
        affichagesPresents=true;
    }
    while(global_messages.infos.length > 0){
        if((zone_message_est_vide) && (numero_message === 0)){
            zon.innerHTML+=('<div class="yysucces">' + global_messages.infos[i] + '</div>');
            numero_message++;
        }else{
            zon.innerHTML+=('<div class="yysucces">' + global_messages.infos[i] + '</div>');
        }
        global_messages.infos.splice(0,1);
        affichagesPresents=true;
    }
    while(global_messages.lines.length > 0){
        zon.innerHTML=('<a href="javascript:allerAlaLigne(' + ((global_messages.lines[i] + 1)) + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" class="yyerreur" style="border:2px red outset;">sélectionner la ligne ' + ((global_messages.lines[i] + 1)) + '</a>&nbsp;' + zon.innerHTML);
        global_messages.lines.splice(0,1);
        affichagesPresents=true;
    }
    if((global_messages.data.matrice) && (global_messages.data.matrice.value)){
        for(i=0;(i < global_messages.ids.length) && (nombre_de_boutons_affiches <= 3);i++){
            var id=global_messages.ids[i];
            if((global_messages.data.matrice) && (id < global_messages.data.matrice.value.length)){
                var ligneMatrice=global_messages.data.matrice.value[id];
                var caractereDebut=ligneMatrice[5];
                var numeroDeLigne=0;
                var j=caractereDebut;
                for(j=caractereDebut;j >= 0;j--){
                    if(global_messages.data.tableau.out[j][0] == '\n'){
                        numeroDeLigne=(numeroDeLigne + 1);
                    }
                }
            }
            if(numeroDeLigne >= 0){
                if(numeroDeLigne != numLignePrecedente){
                    zon.innerHTML=('<a href="javascript:allerAlaLigne(' + ((numeroDeLigne + 1)) + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" class="yyerreur" style="border:2px red outset;">ligne ' + ((numeroDeLigne + 1)) + '</a>&nbsp;' + zon.innerHTML);
                    affichagesPresents=true;
                    numLignePrecedente=numeroDeLigne;
                    nombre_de_boutons_affiches++;
                }
            }
        }
        global_messages.ids=[];
    }
    while(global_messages.ranges.length>0){
        zon.innerHTML=('&nbsp;<a href="javascript:selectionnerUnePlage(' + global_messages.ranges[0][0] + ',' + global_messages.ranges[0][1] + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" class="yyerreur" style="border:2px red outset;">plage ' + global_messages.ranges[0][0] + ',' + global_messages.ranges[0][1] + '</a>' + zon.innerHTML);
        global_messages.ranges.splice(0,1);
        affichagesPresents=true;
    }
    if(zon.innerHTML !== ''){
        zon.style.visibility='visible';
    }
}
/*
  
  =====================================================================================================================
*/
function selectionnerUnePlage(debut,fin,nomDeZoneSource){
    masquerLesMessage('zone_global_messages');
    var zoneSource = dogid(nomDeZoneSource);
    zoneSource.focus();
//    zoneSource.select();
    zoneSource.selectionStart=debut;
    zoneSource.selectionEnd=fin;
    var texteDebut = zoneSource.value.substr(0,debut);
    var texteFin = zoneSource.value.substr(debut);
    zoneSource.value=texteDebut;
    zoneSource.scrollTo(0,9999999);
    var nouveauScroll=zoneSource.scrollTop;
    zoneSource.value=(texteDebut + texteFin);
    if(nouveauScroll > 50){
        zoneSource.scrollTo(0,(nouveauScroll + 50));
    }else{
        zoneSource.scrollTo(0,0);
    }
    zoneSource.selectionStart=debut;
    zoneSource.selectionEnd=fin;
}
/*
  
  =====================================================================================================================
*/
function masquerLesMessage(nomZone){
    var zon = document.getElementById(nomZone);
    zon.style.visibility='hidden';
}
/*
  
  =====================================================================================================================
*/
function afficherOuMasquerLesMessages(){
    var nomZone='zone_global_messages';
    var zon = document.getElementById(nomZone);
    if((zon.style.visibility === 'hidden')){
        zon.style.visibility='visible';
    }else{
        zon.style.visibility='hidden';
    }
}
/*
  
  =====================================================================================================================
  Pour les appels ajax qui ne fonctionnent pas, on affiche qqch
  todo, à revoir
  =====================================================================================================================
*/
function display_ajax_error_in_cons(jsonRet){
    var txt='';
    if(jsonRet.hasOwnProperty('status')){
        txt+=('status:' + jsonRet.status + '\n');
    }
    if(jsonRet.hasOwnProperty('messages')){
        if((typeof jsonRet.messages === 'string') || (jsonRet.messages instanceof String)){
            txt+='Please, put messages in an array in the server !!!!\n';
            txt+=('messages=' + jsonRet.messages);
            txt+='\n';
        }else{
            txt+='messages[]=\n';
            var elem={};
            for(elem in jsonRet.messages){
                global_messages['errors'].push(jsonRet.messages[elem]);
                txt+=('' + jsonRet.messages[elem] + '\n');
            }
            txt+='\n';
        }
    }
    console.log(('%c' + txt),'color:red;background:orange;');
    console.log('jsonRet=',jsonRet);
}
/*
  
  =====================================================================================================================
*/
function selectionnerLigneDeTextArea(tarea,lineNum){
    lineNum=((lineNum <= 0)?1:lineNum);
    lineNum=(lineNum - 1);
    var numeroLigne=0;
    var startPos=0;
    var endPos=0;
    var i=0;
    for(i=0;i < tarea.value.length;i++){
        if(tarea.value.substr(i,1) === '\n'){
            numeroLigne++;
            if(numeroLigne === lineNum){
                startPos=(i + 1);
                break;
            }
        }
    }
    var endPos=i;
    var i=startPos;
    for(i=startPos;i < tarea.value.length;i++){
        if(tarea.value.substr(i,1) === '\n'){
            endPos=i;
            break;
        }
    }
    if(typeof tarea.selectionStart != 'undefined'){
        tarea.focus();
        tarea.selectionStart=startPos;
        tarea.selectionEnd=endPos;
        var debut=startPos;
        var fin=endPos;
        tarea.select();
        tarea.selectionStart=debut;
        tarea.selectionEnd=fin;
        var texteDebut = tarea.value.substr(0,debut);
        var texteFin = tarea.value.substr(debut);
        tarea.value=texteDebut;
        tarea.scrollTo(0,9999999);
        var nouveauScroll=tarea.scrollTop;
        tarea.value=(texteDebut + texteFin);
        if(nouveauScroll > 50){
            tarea.scrollTo(0,(nouveauScroll + 50));
        }else{
            tarea.scrollTo(0,0);
        }
        tarea.selectionStart=debut;
        tarea.selectionEnd=fin;
        return true;
    }
    if((document.selection) && (document.selection.createRange)){
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd('character',endPos);
        range.moveStart('character',startPos);
        range.select();
        return true;
    }
    return false;
}
/*
  
  =====================================================================================================================
*/
function allerAlaLigne(i,nomTextAreaSource){
    selectionnerLigneDeTextArea(document.getElementById(nomTextAreaSource),i);
}
/*
  =====================================================================================================================
*/
function neRienFaire(par){
  // rien ici
//  console.log('par=',par);
}
/*
  =====================================================================================================================
*/
var __gi1=null;
var __module_html1=null;
var __module_svg1=null;
var __module_requete_sql1=null;

document.addEventListener("DOMContentLoaded", function(event) { 
    var maintenant= performance.now()
    console.log('la page est chargée après ' + (maintenant - __debut_execution) + ' ms ');
    import('./module_interface1.js').then(function(Module){
        __gi1= new Module.interface1('__gi1');
        __gi1.ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens();
        __gi1.deplace_la_zone_de_message();
        fonctionDeLaPageAppeleeQuandToutEstCharge();
    });
    
});

/*
  =====================================================================================================================
*/
window.addEventListener('load',function(){
    var maintenant= performance.now()
    console.log('tout les documents sont chargés après ' + (maintenant - __debut_execution) + ' ms ');
    
    
    setTimeout(function(){
        recuperer_les_travaux_en_arriere_plan_de_la_session();
    },1000);
    var liste_des_scripts = document.getElementsByTagName('script');
    var i=0;
    for(i=0;i < liste_des_scripts.length;i++){
        var element=liste_des_scripts[i];
        if((element.type) && (element.type === 'module')){
            if((element.src) && (element.src.indexOf("js/module_html.js") >= 0)){
                import('./module_html.js').then(function(Module){
                    __module_html1= new Module.traitements_sur_html('__module_html1');
                });
            }
        }
    }
});