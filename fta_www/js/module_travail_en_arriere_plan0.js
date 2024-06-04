
import { Rectangle , Carre } from './module_rectangle_et_carre.js'
import { Cercle } from './module_cercle.js'

var liste_des_travaux_en_arriere_plan=[];
var travail_en_cours=false;

/*
==============================================================================================================
*/
function lancer_le_travail(){
 
// console.log('entrée dans lancer_le_travail()');
 setTimeout(
  function(){
    /* 
    ici on fait réellement le travail
    */
    
    
    for(var i in liste_des_travaux_en_arriere_plan){

         if(liste_des_travaux_en_arriere_plan[i].etat_du_travail==='travail_en_arriere_plan_enregistré_en_session'){

             try{
                 console.log('je travaille sur ',liste_des_travaux_en_arriere_plan[i]);    
                 /*
                 et à la fin on le met comme terminé
                 */
                 liste_des_travaux_en_arriere_plan[i].etat_du_travail='travail_en_arriere_plan_terminé';
                 /*
                  et on relance les travaux
                 */
                 console.log('j\'ai terminé le travail')
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

                 
             }catch(e){
              
              console.error('e=',e);
              
             }
             travail_en_cours=false;
             
             
             
             setTimeout(function(){lancer_les_travaux();},16);
             
             break;
         }
    }
     
  },500);
 
 
}
/*
==============================================================================================================
*/
function supprimer_un_travail_en_arriere_plan_en_session(){
 
//    console.log('entrée dans supprimer_un_travail_en_arriere_plan_en_session')
 
    var r = new XMLHttpRequest();
    r.open("POST",'../za_ajax.php?supprimer_un_travail_en_arriere_plan_en_session',true);
    r.timeout=6000;
    r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange = function () {
     if(r.readyState != 4 || r.status != 200){
      if(r.status==404){
       console.error('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
    
      }else if(r.status==500){
       /*
         normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
         au niveau du php za_ajax mais sait-on jamais
       */
       
       if(global_messages['e500logged']==false){
        try{
         console.error('r=',r);
        }catch(e){
        }
       }
      }
      return;
     }
     try{
      var jsonRet=JSON.parse(r.responseText);
      if(jsonRet.status=='OK'){
//          console.log('jsonRet=' , jsonRet );
//          console.log('dans supprimer_un_travail_en_arriere_plan_en_session , liste_des_travaux_en_arriere_plan=',liste_des_travaux_en_arriere_plan);
          for(var i in liste_des_travaux_en_arriere_plan){           
              if(liste_des_travaux_en_arriere_plan[i].etat_du_travail=='travail_en_arriere_plan_terminé'){
             
                 delete(liste_des_travaux_en_arriere_plan[i]);
                 travail_en_cours=false;
                 if(jsonRet.nombre_de_travaux_restants_fin===0){
                  liste_des_travaux_en_arriere_plan=[];
                 }
                 setTimeout(function(){lancer_les_travaux();},16);
                 break
              }
          }
       
          return;
          
      }else{
       console.error('r=',r);
       return;
      }
     }catch(e){
      console.error('r=',r);
      return;
     }
    };
    r.onerror=function(e){
     console.error('e=',e); /* whatever(); */
     return;
    }
    
    r.ontimeout=function(e){
     /*
      il se peut qu'on aie plusieurs clicks
     */
     console.error('e=',e);
     return;
    }
    
    for(var i in liste_des_travaux_en_arriere_plan){
     
     if(liste_des_travaux_en_arriere_plan[i].etat_du_travail=='travail_en_arriere_plan_terminé'){
         
         var ajax_param={
          call:{
           'lib'                       : 'php'   ,
           'file'                      : 'session'  ,
           'funct'                     : 'supprimer_un_travail_en_arriere_plan_en_session' ,
          },
          'travail_en_arriere_plan':liste_des_travaux_en_arriere_plan[i],
         }
         try{
          r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
         }catch(e){
          console.error('e=',e); /* whatever(); */
          return {status:false};  
         }
         
         
         break;
     }
    }     
    
    return {status:true};   
 
}
/*
==============================================================================================================
*/
function enregistrer_un_travail_en_arriere_plan_en_session(){
  
//     console.log('entree dans enregistrer_un_travail_en_arriere_plan_en_session');
     var r = new XMLHttpRequest();
     r.open("POST",'../za_ajax.php?enregistrer_un_travail_en_arriere_plan_en_session',true);
     r.timeout=6000;
     r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
     r.onreadystatechange = function () {
      if(r.readyState != 4 || r.status != 200){
       if(r.status==404){
           console.error('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
        
       }else if(r.status==500){
        /*
          normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
          au niveau du php za_ajax mais sait-on jamais
        */
//        console.log('r=',r)
        if(global_messages['e500logged']==false){
         try{
    //     console.log("r=",r);
    //     console.log("r="+r.response);
//          console.log('r.responseText=',r.responseText);
         }catch(e){
          console.error('e=',e);
         }
        }
       }
       return;
      }
      try{
       var jsonRet=JSON.parse(r.responseText);
       if(jsonRet.status=='OK'){
        
           for(var i in liste_des_travaux_en_arriere_plan){
           
               if(liste_des_travaux_en_arriere_plan[i].etat_du_travail==='travail_en_arriere_plan_reçu'){
                   liste_des_travaux_en_arriere_plan[i].etat_du_travail='travail_en_arriere_plan_enregistré_en_session';
//                   console.log('retour de enregistrer_un_travail_en_arriere_plan_en_session', jsonRet);
                   travail_en_cours=false;
                   break;
               }
               
           }
           setTimeout(function(){lancer_les_travaux();},16);
           return;
       }else{
           console.error('r.responseText=',r.responseText);
           return;
       }
      }catch(e){
          console.error('e=',e);
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
     for(var i in liste_des_travaux_en_arriere_plan){
         if(liste_des_travaux_en_arriere_plan[i].etat_du_travail==='travail_en_arriere_plan_reçu'){
             var ajax_param={
                 call:{
                  'lib'                       : 'php'   ,
                  'file'                      : 'session'  ,
                  'funct'                     : 'enregistrer_un_travail_en_arriere_plan_en_session' ,
                 },
                 'travail_en_arriere_plan':liste_des_travaux_en_arriere_plan[i],
             }
             try{
              
              r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
//              console.log('lancement envoyé  dans enregistrer_un_travail_en_arriere_plan_en_session avec : '+encodeURIComponent(JSON.stringify(ajax_param)));
              
             }catch(e){
              
              console.error('e=',e); /* whatever(); */
              return {status:false};  
              
             }


             break;
         }
     }
     return {status:true};  
}

/*
==============================================================================================================
*/
function lancer_les_travaux(){
//    console.log('%cdans lancer_les_travaux','background:pink;',JSON.stringify(liste_des_travaux_en_arriere_plan , 'travail_en_cours=',travail_en_cours));
    if(travail_en_cours===false){
        if(liste_des_travaux_en_arriere_plan.length>0){
            /*
            En priorité, on enregistre en session les travaux en arrière plan
            */
            var un_morceau_de_travail_fait=false;
            for(var i in liste_des_travaux_en_arriere_plan){
                
                    if(liste_des_travaux_en_arriere_plan[i].etat_du_travail==='travail_en_arriere_plan_reçu'){
//                        console.log('%cdans lancer_les_travaux enregistrement=','background:lime;', JSON.stringify(liste_des_travaux_en_arriere_plan[i]));
                        travail_en_cours=true;
                        un_morceau_de_travail_fait=true;
                        enregistrer_un_travail_en_arriere_plan_en_session();
                        break
                    }
            }
            /*
            puis les fins de travaux
            */
            if(un_morceau_de_travail_fait===false){
                for(var i in liste_des_travaux_en_arriere_plan){
                    
                    if(liste_des_travaux_en_arriere_plan[i].etat_du_travail==='travail_en_arriere_plan_terminé'){
//                        console.log('%cdans lancer_les_travaux etat_du_travail=','background:lightblue;', JSON.stringify(liste_des_travaux_en_arriere_plan[i]));
                        travail_en_cours=true;
                        un_morceau_de_travail_fait=true;
                        supprimer_un_travail_en_arriere_plan_en_session();
                        break;
                    }

                }
            }
            /*
            et enfin les travaux eux même
            */
            if(un_morceau_de_travail_fait===false){
                for(var i in liste_des_travaux_en_arriere_plan){
                    
                    if(liste_des_travaux_en_arriere_plan[i].etat_du_travail==='travail_en_arriere_plan_enregistré_en_session'){
//                        console.log('%cdans lancer_les_travaux etat_du_travail=','background:lightgreen;',JSON.stringify(liste_des_travaux_en_arriere_plan[i]));
                        travail_en_cours=true;
                        lancer_le_travail();
                        break;
                    }
                }
            }
        }
    }
}

/*
==============================================================================================================
*/
onmessage = function(message_recu){

//    console.log("Message reçu depuis le script principal.",message_recu);
    var donnees_recues_du_message=JSON.parse(JSON.stringify(message_recu.data));
//    console.log("données reçues",donnees_recues_du_message);

    if(donnees_recues_du_message.type_de_message==="déclencher_un_travail"){
     
        var maintenant=new Date().getTime();
        var ms=performance.now();
        var cle=maintenant+ms;
//        console.log('maintenant=' , maintenant , ms , cle);
        
     
        liste_des_travaux_en_arriere_plan.push({'clé':cle,'etat_du_travail':'travail_en_arriere_plan_reçu','donnees_recues_du_message':donnees_recues_du_message.parametres});
        
    }else if("integrer_les_travaux_en_session" === donnees_recues_du_message.type_de_message){
     
//        console.log(donnees_recues_du_message.tableau_des_travaux);
        
        for(var i in donnees_recues_du_message.tableau_des_travaux){
             donnees_recues_du_message.tableau_des_travaux[i].etat_du_travail='travail_en_arriere_plan_enregistré_en_session';
            liste_des_travaux_en_arriere_plan.push(donnees_recues_du_message.tableau_des_travaux[i]);
        }   
     
        
    }else{
     
        console.error('type de message non traité : '+donnees_recues_du_message.type_de_message)
         
    }
   
    var message_a_retourner = {
        'donnees_recues_du_message':donnees_recues_du_message,
        'liste_des_travaux_en_arriere_plan':liste_des_travaux_en_arriere_plan,
    };
    
//    console.log("Envoi du message de retour au script principal" , message_a_retourner);
    postMessage(message_a_retourner);
    if(travail_en_cours===false){
      setTimeout(function(){lancer_les_travaux();},16);
    }else{
//      console.log('%cun travail est en cours','color:red;background:yellow;');
    }
  
};