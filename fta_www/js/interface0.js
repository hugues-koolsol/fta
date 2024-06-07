"use strict";

var global_editeur_derniere_valeur_selecStart=-1;
var global_editeur_derniere_valeur_selectEnd=-1;
var global_editeur_debut_texte='';
var global_editeur_fin_texte='';
var global_editeur_debut_texte_tab=[];
var global_editeur_scrolltop=0;
var global_editeur_nomDeLaTextArea='';
var global_editeur_timeout=null;
var global_modale1=null;
var global_modale1_iframe=null;


var global_indice_erreur_originale_traitee=-1;
var global_programme_en_arriere_plan=null;



/*
  =====================================================================================================================
  si il y a des web workers qui ne sont pas terminés, il faut les relancer
  =====================================================================================================================
*/
function recuperer_les_travaux_en_arriere_plan_de_la_session(){
 
    if(NOMBRE_DE_TRAVAUX_EN_ARRIERE_PLAN>0){
        var r = new XMLHttpRequest();
        r.open("POST",'za_ajax.php?recuperer_les_travaux_en_arriere_plan_de_la_session',true);
        r.timeout=6000;
        r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        r.onreadystatechange = function () {
         if(r.readyState != 4 || r.status != 200){
             if(r.status==404){
              console.log('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
             }else if(r.status==500){
                 /*
                   normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                   au niveau du php za_ajax mais sait-on jamais
                 */
                 if(global_messages['e500logged']==false){
                     try{
                      console.log('r=',r);
                     }catch(e){
                     }
                 }
             }
             return;
         }
         try{
             var jsonRet=JSON.parse(r.responseText);
             if(jsonRet.status=='OK'){
                 console.log('il y a des travaux en arrière plan' , jsonRet.valeur );
                 var tableau_des_travaux=[];
                 for(var i in jsonRet.valeur){
                  console.log(jsonRet.valeur[i]);
                  tableau_des_travaux.push(jsonRet.valeur[i]);
                 }
                 
                 if(!window.Worker){
                  return;
                 }
                 if(global_programme_en_arriere_plan===null){
                    global_programme_en_arriere_plan = new Worker("./js/module_travail_en_arriere_plan0.js" );
                 }
                 global_programme_en_arriere_plan.postMessage({'type_de_message' : 'integrer_les_travaux_en_session' , 'tableau_des_travaux' : tableau_des_travaux});
                 
                 
                 return;
             }else{
    //             console.log('pas de travail en arrière plan');
                 /* pas de travail en arrière plan' */
                 return;
             }
         }catch(e){
             console.log('r=',r);
             return;
         }
        };
        r.onerror=function(e){
            console.error('e=',e); /* whatever(); */
            return;
        }
        
        r.ontimeout=function(e){
            console.error('e=',e);
            return;
        }
        var ajax_param={
            call:{
             'lib'                       : 'php'   ,
             'file'                      : 'session'  ,
             'funct'                     : 'recuperer_les_travaux_en_arriere_plan_de_la_session' ,
            },
        }
        try{
            r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
        }catch(e){
            console.error('e=',e); /* whatever(); */
            return {status:false};  
        }
    }
    return {status:true};    
}

/*
  =====================================================================================================================
  déclenchement d'un travail en arrière plan
  =====================================================================================================================
*/
function lancer_un_travail_en_arriere_plan(parametre){
 
 
                 /*
                 c'est interdit en javascript
                 import { Rectangle , Carre } from "module_rectangle_et_carre.js";   
                 */
/*                 
                 var le_carre=new Carre(10);
                 console.log('%c le_carre=','background:yellow;color:red;', 'le_carre=',le_carre, 'le_carre.surface=' , le_carre.surface, 'le_carre.hauteur=' , le_carre.hauteur, 'le_carre.largeur=' , le_carre.largeur , 'le_rectangle.taille=',le_carre.taille);

                 var le_rectangle=new Rectangle(10,20);
                 console.log('%c le_rectangle=','background:yellow;color:red;', le_rectangle, le_rectangle.surface, le_rectangle.hauteur, le_rectangle.largeur );
                 le_rectangle.transforme_en_carre();
                 console.log('%c le_rectangle=','background:yellow;color:red;', le_rectangle, le_rectangle.surface, le_rectangle.hauteur, le_rectangle.largeur );
                 le_rectangle.hauteur=20;
                 console.log('%c le_rectangle=','background:yellow;color:red;', le_rectangle, le_rectangle.surface, le_rectangle.hauteur, le_rectangle.largeur );

                 var le_cercle=new Cercle(10);
                 console.log('%c le_cercle=','background:yellow;color:red;', 'le_cercle=',le_cercle, 'le_cercle.surface=' , le_cercle.surface, 'le_cercle.rayon=' , le_cercle.rayon);
*/
 
//    console.log('par=',parametre);
    var json_param=JSON.parse(parametre);
//    console.log('json_param=' , json_param );
    
    if("replacer_des_chaines1"===json_param.nom_du_travail_en_arriere_plan){

     
     
     
     var remplacer_par = prompt('remplacer "'+json_param.chaine_a_remplacer+'" dans les sources('+json_param.liste_des_id_des_sources+') par :');
     if(remplacer_par!==null){


        json_param.remplacer_par=remplacer_par; //'sq0'; //remplacer_par;
        console.log(json_param);
        if(!window.Worker){
         return;
        }
        if(global_programme_en_arriere_plan===null){
           try{
            global_programme_en_arriere_plan = new Worker("./js/module_travail_en_arriere_plan0.js" ); // , { type: "module" }
           }catch(e){
            console.log('e=',e);
           }
        }
        console.log('on envoie le message');
        try{
         global_programme_en_arriere_plan.postMessage({'type_de_message' : 'déclencher_un_travail' , 'parametres' : json_param});
        }catch(e){
          console.log('e=',e);
        }
        console.log('le message est envoyé sans erreur');
        
        global_programme_en_arriere_plan.onmessage = function (message_recu_du_worker) {         
          console.log("dans le script principal, message_recu_du_worker",message_recu_du_worker);
        };

       
       
     }
     
     
     
    }
    
}

/*
  =====================================================================================================================
  Recherche du bloc dans la parenthèse courante et décale le bloc à droite ou à gauche
  =====================================================================================================================
*/
function decaler(direction){
    parentheses();
    return;
    if(global_editeur_derniere_valeur_selecStart < global_editeur_derniere_valeur_selectEnd){
        console.log(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd);
        var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
        var texteDebut = zoneSource.value.substr(0,global_editeur_derniere_valeur_selecStart);
        console.log('"'+texteDebut+'"');
        var texteFin = zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
        console.log('"'+texteFin+'"');
        var texteSelectionne = zoneSource.value.substr(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd-global_editeur_derniere_valeur_selecStart);
        var tab = texteSelectionne.split('\n');
        var i=0;
        for(i=0;i < tab.length;i=i+1){
            if(tab[i].length > 0){
                tab[i]='  '+tab[i];
            }
        }
        var nouveauTexteDecale = tab.join('\n');
        var nouveauTexte = texteDebut+nouveauTexteDecale+texteFin;
        zoneSource.value=nouveauTexte;
        zoneSource.focus();
        zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
    }
}
/*
  =====================================================================================================================
*/
function parentheses(nomDeLaTextAreaContenantLeSource){
    var i=0;
    if(global_editeur_derniere_valeur_selecStart < 0){
        
        logerreur({'status':false,'message':'veuillez sélectionner une parenthèse dans la zone de texte'});
        displayMessages('zone_global_messages' , nomDeLaTextAreaContenantLeSource);
        return;
    }
    var zoneSource = document.getElementById(nomDeLaTextAreaContenantLeSource);
    var texte=zoneSource.value;
    
    if(global_editeur_derniere_valeur_selectEnd === global_editeur_derniere_valeur_selecStart && texte.substr(global_editeur_derniere_valeur_selecStart-1,1) == '('){
        /*
        on s'est placé juste après une parenthèse ouvrante
        */
        if(texte.substr(global_editeur_derniere_valeur_selecStart,1) == ')'){
         /*
           on est entre 2 parenthèses ouvrante et fermante consécutives,
         */
         
         if(global_editeur_derniere_valeur_selecStart-2>0){
          
          for(i=global_editeur_derniere_valeur_selecStart-2;i>=1;i--){
           if(texte.substr(i,1)==='('){
            texte=texte.substr(i);
            
            var arr = functionToArray(texte,false,false,'(');
            if(arr.status===true){
               zoneSource.focus();
               zoneSource.selectionStart=i+1;
               global_editeur_derniere_valeur_selecStart=i+1;
               zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart+arr.posFerPar-1;
               initialisationEditeur();
               return;
            }
            
           }
          }
          zoneSource.focus();
          
          
         }else{
               zoneSource.focus();
         }
         
        }else{
         
            texte=texte.substr(global_editeur_derniere_valeur_selecStart-1);
            console.log('texte="',texte+'"');
            var arr = functionToArray(texte,false,false,'(');
            if(arr.status===true){
               zoneSource.focus();
               zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
               zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart+arr.posFerPar-1;
               initialisationEditeur();
               return;
            }
        }
    }else if(global_editeur_derniere_valeur_selectEnd === global_editeur_derniere_valeur_selecStart && texte.substr(global_editeur_derniere_valeur_selecStart,1) == ')'){
        /*
        on s'est placé juste avant une parenthèse fermante
        */
        texte=texte.substr(0,global_editeur_derniere_valeur_selecStart+1);
//        console.log('texte="',texte+'"');
        var arr = functionToArray(texte,false,false,')');
        if(arr.status===true){
           zoneSource.focus();
           zoneSource.selectionStart=arr.posOuvPar+1;
           zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart;
           initialisationEditeur();
           return;
        }
        
    
    }else{
     
     if(global_editeur_derniere_valeur_selectEnd === global_editeur_derniere_valeur_selecStart){

      /*
        on est placé quelquepart, on recherche la parenthèse ouvrante précédente
      */
      for(i=global_editeur_derniere_valeur_selecStart-2;i>=1;i--){
       if(texte.substr(i,1)==='('){
        texte=texte.substr(i);
        
        var arr = functionToArray(texte,false,false,'(');
        if(arr.status===true){
           zoneSource.focus();
           zoneSource.selectionStart=i+1;
           global_editeur_derniere_valeur_selecStart=i+1;
           zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart+arr.posFerPar-1;
           initialisationEditeur();
           return;
        }
        
       }
      }
      zoneSource.focus();

      
     }else if(global_editeur_derniere_valeur_selectEnd !== global_editeur_derniere_valeur_selecStart){
       /*
        c'est une sélection de plage entre 2 parenthèses
       */
      if(texte.substr(global_editeur_derniere_valeur_selecStart-1,1) == '(' && texte.substr(global_editeur_derniere_valeur_selectEnd,1) == ')'){
          /*
           la plage est contenue dans 2 parenthèses, on essaie de remonter d'un niveau
           en allant chercher le parenthèse ouvrante précédente
          */
//          console.log('texte=',texte);
          
          var tableau1 = iterateCharacters2(texte);
          var matriceFonction = functionToArray2(tableau1.out,false,true,'');
          if(matriceFonction.status===true){
           var l01=matriceFonction.value.length;
           var fait=false;
           var repereDansTableau=-1;
           
           for(i=0;i<tableau1.out.length;i++){
            if(tableau1.out[i][2]===global_editeur_derniere_valeur_selecStart){
             repereDansTableau=i;
             break;
            }
           }
           if(repereDansTableau>=0){
            for(i=0;i<l01;i++){
             if(matriceFonction.value[i][11]===repereDansTableau-1){
              if(matriceFonction.value[i][7]>0){
               var positionParentheseDuParent=matriceFonction.value[matriceFonction.value[i][7]][11];
               texte=texte.substr(positionParentheseDuParent);
               
               //debugger
               
               var arr = functionToArray(texte,false,false,'(');
               if(arr.status===true){
                  zoneSource.focus();
                  global_editeur_derniere_valeur_selecStart=tableau1.out[positionParentheseDuParent][2]+1;
                  global_editeur_derniere_valeur_selectEnd=positionParentheseDuParent+arr.posFerPar;
                  zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
                  zoneSource.selectionEnd=global_editeur_derniere_valeur_selectEnd;
                  initialisationEditeur();
                  return;
               }
              }
             }
            }
           }
           
           if(fait===false){
             zoneSource.focus();
             return;
           }
          }
      }else{
          /*
            on est placé quelquepart, on recherche la parenthèse ouvrante précédente
          */

          for(i=global_editeur_derniere_valeur_selecStart-2;i>=1;i--){
           if(texte.substr(i,1)==='('){
            texte=texte.substr(i);
            
            var arr = functionToArray(texte,false,false,'(');
            if(arr.status===true){
               zoneSource.focus();
               zoneSource.selectionStart=i+1;
               global_editeur_derniere_valeur_selecStart=i+1;
               zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart+arr.posFerPar-1;
               initialisationEditeur();
               return;
            }
            
           }
          }
       
          zoneSource.focus();
      }
     }
    }
}
/*
  =====================================================================================================================
*/
function createSelection(field,start,end){
    if(field.createTextRange){
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character',start);
        selRange.moveEnd('character',end-start);
        selRange.select();
    }else if(field.setSelectionRange){
        field.setSelectionRange(start,end);
    }else if(field.selectionStart){
        field.selectionStart=start;
        field.selectionEnd=end;
    }
    field.focus();
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
    var i=zoneSource.selectionStart-1;
    for(i=zoneSource.selectionStart-1;i >= 0;i=i-1){
        if(obj.out[i][0] == '\n'){
            debut=(i+1);
            break;
        }
        if(i == 0){
            debut=0;
            break;
        }
    }
    var debutBoucle=zoneSource.selectionEnd;
    if(zoneSource.selectionEnd > 1){
        if(zoneSource.value.substr(zoneSource.selectionEnd-1,1) == '\n'){
            debutBoucle=zoneSource.selectionEnd-1;
        }
    }
    var i=debutBoucle;
    for(i=debutBoucle;i < obj.out.length;i=i+1){
        console.log('i='+i+' , c="'+obj.out[i][0]+'"');
        if(obj.out[i][0] == '\n'){
            fin=i;
            break;
        }else if(i == obj.out.length-1){
            fin=i;
            break;
        }
    }
    console.log('debut='+debut+', fin='+fin);
    var txtDeb = zoneSource.value.substr(0,debut);
    var selectionARemplacer = zoneSource.value.substr(debut,fin-debut);
    var txtFin = zoneSource.value.substr(fin);
    console.log('\n======\ntxtDeb="'+txtDeb+'"\n\n\nselectionARemplacer="'+selectionARemplacer+'"\n\n\ntxtFin="'+txtFin+'"');
    var nouveauCommentaire = '#('+selectionARemplacer+')';
    if(txtFin !== ''){
    }
    var nouveauTexte = txtDeb+nouveauCommentaire+txtFin;
    console.log('nouveauTexte="'+nouveauTexte+'"');
    zoneSource.value=nouveauTexte;
    createSelection(zoneSource,debut,(fin+3));
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
                espaces=global_editeur_debut_texte_tab[global_editeur_debut_texte_tab.length-1][0];
                for(i=0;i < espaces.length;i=i+1){
                    if((espaces.substr(i,1) == ' ') || (espaces.substr(i,1) == '\t')){
                        k=(i+1);
                    }else{
                        j=i;
                    }
                }
            }
            var de1 = ' '.repeat(NBESPACESREV);
            if((j < 0) && (espaces.length == k)){
                if(nomFonction == 'choix'){
                    toAdd='choix(';
                    toAdd+='\n'+espaces+de1+'si(';
                    toAdd+='\n'+espaces+de1+de1+'condition(';
                    toAdd+='\n'+espaces+de1+de1+de1+'non(';
                    toAdd+='\n'+espaces+de1+de1+de1+de1+'( egal(vrai , vrai) ),';
                    toAdd+='\n'+espaces+de1+de1+de1+de1+'et( egal( vrai , vrai ) )';
                    toAdd+='\n'+espaces+de1+de1+de1+')';
                    toAdd+='\n'+espaces+de1+de1+'),';
                    toAdd+='\n'+espaces+de1+de1+'alors(';
                    toAdd+='\n'+espaces+de1+de1+de1+'affecte( a , 1 )';
                    toAdd+='\n'+espaces+de1+de1+')';
                    toAdd+='\n'+espaces+de1+'),';
                    toAdd+='\n'+espaces+de1+'sinonsi(';
                    toAdd+='\n'+espaces+de1+de1+'condition( (true) ),';
                    toAdd+='\n'+espaces+de1+de1+'alors(';
                    toAdd+='\n'+espaces+de1+de1+de1+'affecte(a , 1)';
                    toAdd+='\n'+espaces+de1+de1+')';
                    toAdd+='\n'+espaces+de1+'),';
                    toAdd+='\n'+espaces+de1+'sinon(';
                    toAdd+='\n'+espaces+de1+de1+'alors(';
                    toAdd+='\n'+espaces+de1+de1+de1+'affecte(a , 1)';
                    toAdd+='\n'+espaces+de1+de1+')';
                    toAdd+='\n'+espaces+de1+de1+'#(finsinon)';
                    toAdd+='\n'+espaces+de1+'),';
                    toAdd+='\n'+espaces+'),';
                    toAdd+='\n'+espaces+'#(finchoix suite du source)';
                }else if(nomFonction == 'boucle'){
                    toAdd='boucle(';
                    toAdd+='\n'+espaces+de1+'initialisation(affecte(i , 0)),';
                    toAdd+='\n'+espaces+de1+'condition(inf(i , tab.length)),';
                    toAdd+='\n'+espaces+de1+'increment(affecte(i , i+1)),';
                    toAdd+='\n'+espaces+de1+'faire(';
                    toAdd+='\n'+espaces+de1+de1+'affecte(a , 1)';
                    toAdd+='\n'+espaces+de1+')';
                    toAdd+='\n'+espaces+'),';
                    toAdd+='\n'+espaces+'#(fin boucle, suite du source)';
                }else if(nomFonction == 'appelf'){
                    toAdd='appelf(';
                    toAdd+='\n'+espaces+de1+'r(variableDeRetour),';
                    toAdd+='\n'+espaces+de1+'element(nomElement),';
                    toAdd+='\n'+espaces+de1+'nomf(nomFonction),';
                    toAdd+='\n'+espaces+de1+'p(parametre1),';
                    toAdd+='\n'+espaces+de1+'p(parametre2)';
                    toAdd+='\n'+espaces+'),';
                    toAdd+='\n'+espaces+'#(fin appelf),';
                }else if(nomFonction == 'affecte'){
                    toAdd='affecte(nomVariable , valeurVariable),';
                }
                t=global_editeur_debut_texte+toAdd+global_editeur_fin_texte;
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
    var tabtext=[];
    var toAdd='';
    var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
    global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
//    console.log('ici'+global_editeur_derniere_valeur_selecStart)

    global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
    global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
    tabtext=global_editeur_debut_texte.split('\n');
    global_editeur_debut_texte_tab=[];
    j=0;
    for(i=0;i < tabtext.length;i=i+1){
        global_editeur_debut_texte_tab.push(Array(tabtext[i],j));
        j+=(tabtext[i].length+1);
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
    }
    document.getElementById(nomDeLaTextArea).onclick=function(e){
        initialisationEditeur();
        try{
            document.getElementById('sauvegarderLeNormalise').disabled=true;
        }catch(e){}
        return;
    };
    document.getElementById(nomDeLaTextArea).onkeydown=function(e){
        try{
          document.getElementById('sauvegarderLeNormalise').disabled=true;
        }catch(e){}
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
    var tabtext=[];
    if(e.keyCode == 13){ /* retour chariot */
        var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
        global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
        global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
        global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
        global_editeur_fin_texte=zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
        tabtext=global_editeur_debut_texte.split('\n');
        global_editeur_debut_texte_tab=[];
        j=0;
        for(i=0;i < tabtext.length;i=i+1){
            global_editeur_debut_texte_tab.push(Array(tabtext[i],j));
            j+=(tabtext[i].length+1);
        }
        if(global_editeur_debut_texte_tab.length >= 2){
            var textPrec=global_editeur_debut_texte_tab[global_editeur_debut_texte_tab.length-2][0];
            if(textPrec != ''){
                var pos=0;
                var toAdd='';
                for(i=0;i < textPrec.length;i=i+1){
                    if(textPrec.substr(i,1) != ' '){
                        pos=i;
                        break;
                    }
                    toAdd+=' ';
                }
                if(pos >= 0){
                    var offSetBack=0;
                    if(textPrec.substr(textPrec.length-1,1) == '('){
                        if(global_editeur_fin_texte.substr(0,1) == ')'){
                            offSetBack=(toAdd.length+1);
                            toAdd+=' '.repeat(NBESPACESREV)+'\n'+toAdd;
                        }else{
                            toAdd+=' '.repeat(NBESPACESREV);
                        }
                    }else{
                        if(global_editeur_fin_texte.substr(0,1) == ')'){
                            if(toAdd.length > 2){
                            }
                        }
                    }
                    this.value=global_editeur_debut_texte+toAdd+global_editeur_fin_texte;
                    global_editeur_derniere_valeur_selecStart=global_editeur_derniere_valeur_selecStart+toAdd.length-offSetBack;
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
    }else if((e.keyCode == 86) && (e.ctrlKey == true)){ /* ctrl v */
        var zoneSource = document.getElementById(global_editeur_nomDeLaTextArea);
        global_editeur_timeout=setTimeout(function(){
            zoneSource.scrollTop=global_editeur_scrolltop;
        },1);
    }else if(e.keyCode == 36){ /* home */
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
            var opa = parseInt(elem.style.opacity*(100),10);
            if(opa < 100){
                var newOpa = opa/(100)+0.1;
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
        if((lsta1[i].href) && ( !(lsta1[i].href.indexOf('javascript') >= 0))){
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
    
    var lstb1=document.getElementsByClassName("yyunset_temporaire");
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
    console.log('un click')
    try{
        e.target.classList.add("yyunset_temporaire");
    }catch(e1){
    }
    setTimeout(
     function(){
      var lstb1=document.getElementsByClassName("yyunset_temporaire");
      for(var i=0;i < lstb1.length;i++){
       lstb1[i].classList.remove('yyunset_temporaire');
      }
     },300
    );
      
}


/*
  =====================================================================================================================
  quand on clique sur un lien, on affiche la boite 1.5 secondes plus tard
  =====================================================================================================================
*/
function clickLink1(e){
    try{
        e.target.classList.add("yyunset_temporaire");
    }catch(e1){
    }
    globale_timeout_reference_timer_serveur_lent=setTimeout(affichageBoiteServeurLent,globale_timeout_serveur_lent);
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
    var zone_message_est_vide=true
    if(zon.innerHTML!==''){
     zone_message_est_vide=false;
    }
    var numLignePrecedente=-1;
    var nombre_de_boutons_affiches=0;
    while(global_messages.errors.length>0){
        zon.innerHTML+='<div class="yyerreur">'+global_messages.errors[i]+'</div>';
        global_messages.errors.splice(0,1);
        affichagesPresents=true;
    }
    while(global_messages.warnings.length>0){
        zon.innerHTML+='<div class="yyavertissement">'+global_messages.warnings[i]+'</div>';
        global_messages.warnings.splice(0,1);
        affichagesPresents=true;
    }
    while(global_messages.infos.length>0){
        zon.innerHTML+='<div class="yysucces">'+global_messages.infos[i]+'</div>';
        global_messages.infos.splice(0,1);
        affichagesPresents=true;
    }
    while(global_messages.lines.length>0){
        zon.innerHTML='<a href="javascript:allerAlaLigne('+(global_messages.lines[i]+1)+',\''+nomDeLaTextAreaContenantLeTexteSource+'\')" class="yyerreur" style="border:2px red outset;">sélectionner la ligne '+(global_messages.lines[i]+1)+'</a>&nbsp;'+zon.innerHTML;
        global_messages.lines.splice(0,1);
        affichagesPresents=true;
    }
    if( (global_messages.data.matrice) && (global_messages.data.matrice.value) ){
        for(i=0;i < global_messages.ids.length && nombre_de_boutons_affiches<=3 ;i++){
            var id=global_messages.ids[i];
            if((global_messages.data.matrice) && (id < global_messages.data.matrice.value.length)){
                var ligneMatrice=global_messages.data.matrice.value[id];
                var caractereDebut=ligneMatrice[5];
                var numeroDeLigne=0;
                var j=caractereDebut;
                for(j=caractereDebut;j >= 0;j--){
                    if(global_messages.data.tableau.out[j][0] == '\n'){
                        numeroDeLigne=(numeroDeLigne+1);
                    }
                }
            }
            if(numeroDeLigne >= 0){
                if(numeroDeLigne != numLignePrecedente){
                    zon.innerHTML='<a href="javascript:allerAlaLigne('+(numeroDeLigne+1)+',\''+nomDeLaTextAreaContenantLeTexteSource+'\')" class="yyerreur" style="border:2px red outset;">ligne '+(numeroDeLigne+1)+'</a>&nbsp;'+zon.innerHTML;
                    affichagesPresents=true;
                    numLignePrecedente=numeroDeLigne;
                    nombre_de_boutons_affiches++;
                }
            }
        }
        global_messages.ids=[];
    }
    while(global_messages.ranges.length>0){
        zon.innerHTML='&nbsp;<a href="javascript:selectionnerUnePlage('+global_messages.ranges[0][0]+','+global_messages.ranges[0][1]+',\''+nomDeLaTextAreaContenantLeTexteSource+'\')" class="yyerreur" style="border:2px red outset;">plage '+global_messages.ranges[0][0]+','+global_messages.ranges[0][1]+'</a>'+zon.innerHTML;
        global_messages.ranges.splice(0,1);
        affichagesPresents=true;
    }
    if(affichagesPresents && zone_message_est_vide){
        var ttt='<a class="yyavertissement" style="float:inline-end;position:fixed;right:20px;" href="javascript:masquerLesMessage(&quot;'+nomZone+'&quot;)" title="masquer les messages">🙈</a>';
        zon.innerHTML=ttt+zon.innerHTML;
    }
    if(zon.innerHTML!==''){
        zon.style.visibility='visible';
    }
}

/*
  =====================================================================================================================
function agrandir_ou_reduire_la_text_area(nom_de_la_textarea){
 try{
  if(document.getElementById(nom_de_la_textarea)){
   if(document.getElementById(nom_de_la_textarea).rows<=10){
    document.getElementById(nom_de_la_textarea).rows=100;
    document.getElementById(nom_de_la_textarea).style.height='100em';
    document.getElementById(nom_de_la_textarea).focus();
   }else{
    document.getElementById(nom_de_la_textarea).rows=5;
    document.getElementById(nom_de_la_textarea).style.height='5em';
    document.getElementById(nom_de_la_textarea).focus();
    
   }
  }
 }catch(e){}
}
*/

/*
  =====================================================================================================================
*/
function selectionnerUnePlage(debut,fin,nomDeZoneSource){
    var zoneSource = dogid(nomDeZoneSource);
    zoneSource.select();
    zoneSource.selectionStart=debut;
    zoneSource.selectionEnd=fin;
    var texteDebut = zoneSource.value.substr(0,debut);
    var texteFin = zoneSource.value.substr(debut);
    zoneSource.value=texteDebut;
    zoneSource.scrollTo(0,9999999);
    var nouveauScroll=zoneSource.scrollTop;
    zoneSource.value=texteDebut+texteFin;
    if(nouveauScroll > 50){
        zoneSource.scrollTo(0,(nouveauScroll+50));
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
    if(zon.style.visibility==='hidden' || zon.innerHTML===''){ 
     zon.style.visibility='visible';
     if(zon.innerHTML==''){
      var ttt='<a class="yyavertissement" style="float:inline-end;position:fixed;right:20px;" href="javascript:masquerLesMessage(&quot;'+nomZone+'&quot;)"  title="masquer les messages">🙈</a>';
      zon.innerHTML=ttt+zon.innerHTML;
     } 
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
                global_messages['errors'].push(jsonRet.messages[elem]);
                txt+=''+jsonRet.messages[elem]+'\n';
            }
            txt+='\n';
        }
    }
    console.log('%c'+txt,'color:red;background:orange;');
    console.log('jsonRet=',jsonRet);
}
/*
  =====================================================================================================================
*/
function selectionnerLigneDeTextArea(tarea,lineNum){
    lineNum=((lineNum <= 0)?1:lineNum);
    lineNum=lineNum-1;
    var numeroLigne=0;
    var startPos=0;
    var endPos=0;
    
    for(var i=0;i<tarea.value.length;i++){
     if(tarea.value.substr(i,1)==='\n'){
      numeroLigne++;
      if(numeroLigne===lineNum){
       startPos=i+1;
       break;
      }
     }
    }
    
    var endPos=i;
    for(var i=startPos;i<tarea.value.length;i++){
     if(tarea.value.substr(i,1)==='\n'){
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
        tarea.value=texteDebut+texteFin;
        if(nouveauScroll > 50){
            tarea.scrollTo(0,(nouveauScroll+50));
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
/*
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
//    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
//    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
   if (!navigator.clipboard) {
     fallbackCopyTextToClipboard(text);
     return;
   }
   navigator.clipboard.writeText(text).then(
    function(){}, 
    function(err) {
    console.error('Async: Could not copy text: ', err);
   });
}

  copyBobBtn.addEventListener('click', function(event) {
   copyTextToClipboard(document.getElementById('edit').value);
  });


*/




/*
===================================================================================
*/
function neRienFaire(par){
// console.log('par=',par)
}
/*
===================================================================================
*/
function executerCesActionsPourLaPageLocale(par){
// console.log('par=',par);
 
 for (var i = 0; i < par.length; i++) {
     switch (par[i].nomDeLaFonctionAappeler) {
         case 'neRienFaire'                            : neRienFaire(par[i].parametre);                            break;
         case 'initialiserEditeurPourUneTextArea'      : initialiserEditeurPourUneTextArea(par[i].parametre);      break;
         case 'traite_le_tableau_de_la_base_sqlite'    : traite_le_tableau_de_la_base_sqlite(par[i].parametre);    break;
         case 'comparer_deux_tableaux_de_bases_sqlite' : comparer_deux_tableaux_de_bases_sqlite(par[i].parametre); break;
         default: console.log('fonction non prévue dans interface0.js: '+par[i].nomDeLaFonctionAappeler); break;
     }
 }
             
 
   
   
}
/*
===================================================================================
*/
function afficherModale1(parametres){
// console.log('parametres='+parametres)
 var jsn1=JSON.parse(parametres);
 var paramatresModale={'__champs_texte_a_rapatrier':jsn1['__champs_texte_a_rapatrier'] , '__nom_champ_dans_parent' :jsn1['__nom_champ_dans_parent'] }
// console.log('jsn1=' , jsn1 );

 global_modale1_iframe.src=jsn1['__url']+'?__parametres_choix='+encodeURIComponent(JSON.stringify(paramatresModale));
 global_modale1.showModal();
}
/*
===================================================================================
*/
function fermerModale1(){
 global_modale1.close();
}
/*
===================================================================================
*/
function annuler_champ(parametres){
 var jsn1=JSON.parse(parametres);
 document.getElementById(jsn1['__nom_champ_dans_parent']).value='';
 try{
  if(jsn1.__champs_texte_a_rapatrier){
   for(var i in jsn1.__champs_texte_a_rapatrier){
    window.parent.document.getElementById(i).innerHTML = jsn1.__champs_texte_a_rapatrier[i].__libelle_si_vide;
   }
  }   
  
 }catch(e){
  console.log(e);
 }

}
/*
===================================================================================
*/
function choisir_de_iframe1(parametres){

 var jsn1=JSON.parse(parametres);

 window.parent.document.getElementById(jsn1['__nom_champ_rapatrie']).value=jsn1['__valeur_champ_id_rapatrie'];
 try{
  if(jsn1.__champs_texte_a_rapatrier){
   for(var i in jsn1.__champs_texte_a_rapatrier){
    window.parent.document.getElementById(i).innerHTML = jsn1.__champs_texte_a_rapatrier[i].__libelle_avant+jsn1.__champs_texte_a_rapatrier[i].__valeur+jsn1.__champs_texte_a_rapatrier[i].__libelle_apres;
   }
  }   
  
 }catch(e){
  console.log(e);
 }
 
 window.parent.global_modale1.close();
}
var __gi1=null;
var __module_html1=null;
/*
===================================================================================
*/
window.addEventListener('load', function () {

// console.log("interface js")
// ajouteDeQuoiFaireDisparaitreLesBoutonsEtLesLiens();
 global_modale1=document.getElementById('modale1');
 global_modale1_iframe=document.getElementById('iframe_modale_1');
 global_modale1.addEventListener('click',function(e){
  var dim=global_modale1.getBoundingClientRect();
  if(e.clientX  < dim.left || e.clientX  > dim.right || e.clientY  < dim.top || e.clientY  > dim.bottom ){
   global_modale1.close();
  }
 })
 fonctionDeLaPageAppeleeQuandToutEstCharge();
 setTimeout(function(){recuperer_les_travaux_en_arriere_plan_de_la_session();},1000);

 import('./module_interface1.js').then(
  function(Module){
  __gi1=new Module.interface1('__gi1');
  __gi1.ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens();
  __gi1.deplace_la_zone_de_message();
 });
 var liste_des_scripts=document.getElementsByTagName('script');
 for(var i=0;i<liste_des_scripts.length;i++){
  var element=liste_des_scripts[i];
  if( element.type && element.type==='module'){
//   console.log('element.src=' , element.src );
   if(element.src && element.src.indexOf("js/module_html.js")>=0){
     
     import('./module_html.js').then(function(Module){
       __module_html1=new Module.traitements_sur_html('__module_html1');
//       console.log('__module_html1 initialise')
     });
    
   }
  }
 }
 
})
/*
===================================================================================
*/