"use strict";
var global_editeur_derniere_valeur_selecStart=-1;
var global_editeur_derniere_valeur_selectEnd=-1;
var global_editeur_debut_texte='';
var global_editeur_fin_texte='';
var global_editeur_debut_texte_tab = [];
var global_editeur_scrolltop=0;
var global_editeur_nomDeLaTextArea='';
var global_editeur_timeout=null;
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
*/
var __gi1=null;
var __module_html1=null;
var __module_svg1=null;
var __module_requete_sql1=null;

document.addEventListener("DOMContentLoaded", function(event) { 
    var maintenant= performance.now()
//    console.log('la page est chargée après ' + (maintenant - __debut_execution) + ' ms ');
    import('./module_interface1.js').then(function(Module){
        
        __gi1= new Module.interface1('__gi1' , 'zone_global_messages');
        console.log('__gi1 est initialisé')
        __gi1.deplace_la_zone_de_message();
        fonctionDeLaPageAppeleeQuandToutEstCharge();
        setTimeout(
         function(){__gi1.ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens();},
         500
        );
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