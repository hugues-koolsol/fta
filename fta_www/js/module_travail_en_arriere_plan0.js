try{
 importScripts('./core6.js');
}catch(e){
 debugger
}
importScripts('./convertit-php-en-rev0.js');
importScripts('./php.js');
importScripts('./convertit-js-en-rev1.js');
importScripts('./javascript.js');
var liste_des_travaux_en_arriere_plan = [];
var liste_des_taches_en_arriere_plan = [];
var travail_en_cours=false;
var tache_en_cours=false;
/*
  ====================================================================================================================
*/
function enregistrer_les_sources_en_base(params,fonction_apres){
    var r= new XMLHttpRequest();
    r.open("POST",'../za_ajax.php?enregistrer_les_sources_en_base',true);
    r.timeout=120000;
    r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange=function(){
        if((r.readyState != 4) || (r.status != 200)){
            if(r.status == 404){
                console.error('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
            }else if(r.status == 500){
                /*
                  
                  normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                  au niveau du php za_ajax mais sait-on jamais
                */
                if(global_messages['e500logged'] == false){
                    try{
                    }catch(e){
                        console.error('e=',e);
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.status == 'OK'){
                console.log('%cYOUPIIIII jsonRet=','background:yellow;color:red;',jsonRet);
                liste_des_taches_en_arriere_plan[params['id_tache']].etat='terminée';
                tache_en_cours=false;
                setTimeout(function(){
                    fonction_apres(params.arg);
                },16);
                return;
            }else{
                console.error('r.responseText=',r.responseText);
                liste_des_taches_en_arriere_plan[params['id_tache']].etat='en_erreur';
                tache_en_cours=false;
                setTimeout(function(){
                    fonction_apres(params.arg);
                },16);
                return;
            }
        }catch(e){
            console.error('e=',e);
            /* whatever(); */
            liste_des_taches_en_arriere_plan[params['id_tache']].etat='en_erreur';
            tache_en_cours=false;
            setTimeout(function(){
                fonction_apres(params.arg);
            },16);
            return;
        }
    };
    r.onerror=function(e){
        console.error('e=',e);
        /* whatever(); */
        liste_des_taches_en_arriere_plan[params['id_tache']].etat='en_erreur';
        tache_en_cours=false;
        setTimeout(function(){
            fonction_apres(params.arg);
        },16);
        return;
    };
    r.ontimeout=function(e){
        console.error('e=',e);
        /* whatever(); */
        liste_des_taches_en_arriere_plan[params['id_tache']].etat='en_erreur';
        tache_en_cours=false;
        setTimeout(function(){
            fonction_apres(params.arg);
        },16);
        return;
    };
    var ajax_param={'call':{'lib':'php','file':'travail_en_arriere_plan1','funct':'enregistrer_les_sources_en_base'},'params':params};
    try{
        r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
    }catch(e){
        console.error('e=',e);
        /* whatever(); */
        liste_des_taches_en_arriere_plan[params['id_tache']].etat='en_erreur';
        tache_en_cours=false;
        setTimeout(function(){
            fonction_apres(params.arg); // traitement_apres_remplacement_chaine_en_bdd
        },16);
        return({status:false});
    }
    return({status:true});
}

/*
  =======================================================================================================================================
*/
function traite_un_remplacement(id_tache,arg){
    import('./module_html.js').then(function(Module){
        __module_html1= new Module.traitements_sur_html('__module_html1');
        var id_source={};
        for(id_source in arg){
            for(j=0;j < liste_des_taches_en_arriere_plan.length;j++){
                /*
                  
                  attention ci dessous, la clé est une chaine
                */
                if((String(id_source) === String(liste_des_taches_en_arriere_plan[j].id_source)) && (liste_des_taches_en_arriere_plan[j].etat !== 'terminée')){
                    console.log(('liste_des_taches_en_arriere_plan[' + j + ']'),liste_des_taches_en_arriere_plan[j]);
                    var le_source=arg[id_source];
                    if(le_source.nom_source.lastIndexOf('.') >= 0){
                        var extension = le_source.nom_source.substr(le_source.nom_source.lastIndexOf('.'));
                        var n=0;
                        var tab = [];
                        var k={};
                        for(k in le_source['tab']){
                            var e = le_source['tab'][k];
                            tab.push([
                                e[(n + 0)],
                                e[(n + 1)],
                                e[(n + 2)],
                                e[(n + 3)],
                                e[(n + 4)],
                                e[(n + 5)],
                                e[(n + 6)],
                                e[(n + 7)],
                                e[(n + 8)],
                                e[(n + 9)],
                                e[(n + 10)],
                                e[(n + 11)],
                                e[(n + 12)],
                                e[(n + 13)]
                            ]);
                        }
                        if((extension === '.html') || (extension === '.htm') || (extension === '.php')){
                            tache_en_cours=true;
                            if((extension === '.html') || (extension === '.htm')){
                                var objSource = __module_html1.tabToHtml1(tab,0,false,0);
                            }else if(extension === '.php'){
                                var objSource = parsePhp0(tab,0,0);
                            }
                            if(objSource.status === true){
                                var obj = arrayToFunct1(tab,true,false);
                                if(obj.status === true){
                                    arg[id_source].tab=[];
                                    var params={'arg':arg,'id_tache':j,'id_source':id_source,'source_rev':obj.value,'source_genere':objSource.value};
                                    enregistrer_les_sources_en_base(params,traitement_apres_remplacement_chaine_en_bdd);
                                    return;
                                }else{
                                    liste_des_taches_en_arriere_plan[j].etat='en_erreur';
                                    tache_en_cours=false;
                                    setTimeout(function(){
                                        traitement_apres_remplacement_chaine_en_bdd(arg);
                                    },16);
                                    return;
                                }
                            }else{
                                liste_des_taches_en_arriere_plan[j].etat='en_erreur';
                                tache_en_cours=false;
                                setTimeout(function(){
                                    traitement_apres_remplacement_chaine_en_bdd(arg);
                                },16);
                                return;
                            }
                        }else{
                            liste_des_taches_en_arriere_plan[j].etat='a_mettre_en_place';
                            tache_en_cours=false;
                            setTimeout(function(){
                                traitement_apres_remplacement_chaine_en_bdd(arg);
                            },16);
                            return;
                        }
                    }
                    return;
                }
            }
        }
        setTimeout(function(){
            traitement_apres_remplacement_chaine_en_bdd(arg);
        },16);
        return;
    });
    setTimeout(function(){
        traitement_apres_remplacement_chaine_en_bdd(arg);
    },16);
    return;
}
/*
  =======================================================================================================================================
*/
function traite_une_suppression(id_tache,arg){
    import('./module_html.js').then(function(Module){
        __module_html1= new Module.traitements_sur_html('__module_html1');
        var id_source={};
        for(id_source in arg){
            for(j=0;j < liste_des_taches_en_arriere_plan.length;j++){
                /*
                  
                  attention ci dessous, la clé est une chaine
                */
                if((String(id_source) === String(liste_des_taches_en_arriere_plan[j].id_source)) && (liste_des_taches_en_arriere_plan[j].etat !== 'terminée')){
                    console.log(('liste_des_taches_en_arriere_plan[' + j + ']'),liste_des_taches_en_arriere_plan[j]);
                    var le_source=arg[id_source];
                    if(le_source.nom_source.lastIndexOf('.') >= 0){
                        var extension = le_source.nom_source.substr(le_source.nom_source.lastIndexOf('.'));
                        var n=0;
                        var tab = [];
                        var k={};
                        for(k in le_source['tab']){
                            var e = le_source['tab'][k];
                            tab.push([
                                e[(n + 0)],
                                e[(n + 1)],
                                e[(n + 2)],
                                e[(n + 3)],
                                e[(n + 4)],
                                e[(n + 5)],
                                e[(n + 6)],
                                e[(n + 7)],
                                e[(n + 8)],
                                e[(n + 9)],
                                e[(n + 10)],
                                e[(n + 11)],
                                e[(n + 12)],
                                e[(n + 13)]
                            ]);
                        }

                        var tab1 = reIndicerLeTableau(tab);
                        if((extension === '.html') || (extension === '.htm') || (extension === '.php')){
                            tache_en_cours=true;
                            if((extension === '.html') || (extension === '.htm')){
                                var objSource = __module_html1.tabToHtml1(tab1,0,false,0);
                            }else if(extension === '.php'){
                                var objSource = parsePhp0(tab1,0,0);
                            }
                            if(objSource.status === true){
                                var obj = arrayToFunct1(tab1,true,false);
                                if(obj.status === true){
                                    arg[id_source].tab1=[];
                                    var params={'arg':arg,'id_tache':j,'id_source':id_source,'source_rev':obj.value,'source_genere':objSource.value};
                                    enregistrer_les_sources_en_base(params,traitement_apres_suppression_ligne_en_bdd);
                                    return;
                                }else{
                                    liste_des_taches_en_arriere_plan[j].etat='en_erreur';
                                    tache_en_cours=false;
                                    setTimeout(function(){
                                        traitement_apres_suppression_ligne_en_bdd(arg);
                                    },16);
                                    return;
                                }
                            }else{
                                liste_des_taches_en_arriere_plan[j].etat='en_erreur';
                                tache_en_cours=false;
                                setTimeout(function(){
                                    traitement_apres_suppression_ligne_en_bdd(arg);
                                },16);
                                return;
                            }
                        }else{
                            liste_des_taches_en_arriere_plan[j].etat='a_mettre_en_place';
                            tache_en_cours=false;
                            setTimeout(function(){
                                traitement_apres_suppression_ligne_en_bdd(arg);
                            },16);
                            return;
                        }
                    }
                    return;
                }
            }
        }
        setTimeout(function(){
            traitement_apres_suppression_ligne_en_bdd(arg);
        },16);
        return;
    });
    setTimeout(function(){
        traitement_apres_suppression_ligne_en_bdd(arg);
    },16);
    return;
}
/*  
  ====================================================================================================================
*/
function traitement_apres_suppression_ligne_en_bdd(arg){
    console.log('tache_en_cours=',tache_en_cours,'liste_des_taches_en_arriere_plan = ',liste_des_taches_en_arriere_plan);
    if(tache_en_cours === false){
        var i=0;
        for(i=0;i < liste_des_taches_en_arriere_plan.length;i++){
            if(liste_des_taches_en_arriere_plan[i].etat === 'maj_bdd_et_récupération_du_tableau'){
                liste_des_taches_en_arriere_plan[i].etat='en_cours';
                tache_en_cours=true;
                traite_une_suppression(i,arg);
                return;
            }
        }
    }else{
        var une_tache_en_cours=false;
        var i=0;
        for(i=0;i < liste_des_taches_en_arriere_plan.length;i++){
            if(liste_des_taches_en_arriere_plan[i].etat === 'maj_bdd_et_récupération_du_tableau'){
                liste_des_taches_en_arriere_plan[i].etat='en_cours';
                une_tache_en_cours=true;
                traite_une_suppression(i,arg);
                return;
            }
        }
    }
    if(tache_en_cours === false){
        console.log('arg=',arg);
        setTimeout(function(){
            lancer_le_travail();
        },100);
    }
    return;
}
/*  
  ====================================================================================================================
*/
function traitement_apres_remplacement_chaine_en_bdd(arg){
    console.log('tache_en_cours=',tache_en_cours,'liste_des_taches_en_arriere_plan = ',liste_des_taches_en_arriere_plan);
    if(tache_en_cours === false){
        var i=0;
        for(i=0;i < liste_des_taches_en_arriere_plan.length;i++){
            if(liste_des_taches_en_arriere_plan[i].etat === 'maj_bdd_et_récupération_du_tableau'){
                liste_des_taches_en_arriere_plan[i].etat='en_cours';
                tache_en_cours=true;
                traite_un_remplacement(i,arg);
                return;
            }
        }
    }else{
        var une_tache_en_cours=false;
        var i=0;
        for(i=0;i < liste_des_taches_en_arriere_plan.length;i++){
            if(liste_des_taches_en_arriere_plan[i].etat === 'maj_bdd_et_récupération_du_tableau'){
                liste_des_taches_en_arriere_plan[i].etat='en_cours';
                une_tache_en_cours=true;
                traite_un_remplacement(i,arg);
                return;
            }
        }
    }
    if(tache_en_cours === false){
        console.log('arg=',arg);
        setTimeout(function(){
            lancer_le_travail();
        },100);
    }
    return;
}
/*  
  ====================================================================================================================
*/
function supprimer_un_commentaire1(parametre_supprimer_un_commentaire1,la_tache_en_cours,traitement_a_lancer_si_succes){
    var r= new XMLHttpRequest();
    r.open("POST",'../za_ajax.php?supprimer_un_commentaire1',true);
    r.timeout=120000;
    r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange=function(){
        if((r.readyState != 4) || (r.status != 200)){
            if(r.status == 404){
                console.error('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
            }else if(r.status == 500){
                /*
                  
                  normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                  au niveau du php za_ajax mais sait-on jamais
                */
                if(global_messages['e500logged'] == false){
                    try{
                    }catch(e){
                        console.error('e=',e);
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.status == 'OK'){
                console.log('jsonRet=',jsonRet);
                traitement_a_lancer_si_succes(jsonRet.valeurs);
            }else{
                console.error('r.responseText=',r.responseText);
                parametre_supprimer_un_commentaire1.etat_du_travail='travail_en_arriere_plan_en_erreur';
                console.log('j\'ai terminé le travail mais il y a une erreur');
                travail_en_cours=false;
                setTimeout(function(){
                    lancer_les_travaux();
                },100);
                return;
            }
        }catch(e){
            console.error('e=',e);
            parametre_supprimer_un_commentaire1.etat_du_travail='travail_en_arriere_plan_en_erreur';
            console.log('j\'ai terminé le travail mais il y a une erreur');
            travail_en_cours=false;
            setTimeout(function(){
                lancer_les_travaux();
            },100);
            return;
        }
    };
    r.onerror=function(e){
        console.error('e=',e);
        /* whatever(); */
        parametre_supprimer_un_commentaire1.etat_du_travail='travail_en_arriere_plan_en_erreur';
        console.log('j\'ai terminé le travail mais il y a une erreur');
        travail_en_cours=false;
        setTimeout(function(){
            lancer_les_travaux();
        },100);
        return;
    };
    r.ontimeout=function(e){
        console.error('e=',e);
        parametre_supprimer_un_commentaire1.etat_du_travail='travail_en_arriere_plan_en_erreur';
        console.log('j\'ai terminé le travail mais il y a une erreur');
        travail_en_cours=false;
        setTimeout(function(){
            lancer_les_travaux();
        },100);
        return;
    };
    var ajax_param={
        'call':{'lib':'php','file':'travail_en_arriere_plan1','funct':'supprimer_un_commentaire1'},
        'parametre':parametre_supprimer_un_commentaire1,'tache_en_cours':la_tache_en_cours
    };
    try{
        r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
    }catch(e){
        console.error('e=',e);
        /* whatever(); */
        return({status:false});
    }
    return({status:true}); 
}
/*
  
  ==============================================================================================================
*/
function remplacer_des_chaine1(parametre_remplacer_des_chaines1,la_tache_en_cours,traitement_a_lancer_si_succes){
    var r= new XMLHttpRequest();
    r.open("POST",'../za_ajax.php?remplacer_des_chaine1',true);
    r.timeout=120000;
    r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange=function(){
        if((r.readyState != 4) || (r.status != 200)){
            if(r.status == 404){
                console.error('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
            }else if(r.status == 500){
                /*
                  
                  normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                  au niveau du php za_ajax mais sait-on jamais
                */
                if(global_messages['e500logged'] == false){
                    try{
                    }catch(e){
                        console.error('e=',e);
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.status == 'OK'){
                console.log('jsonRet=',jsonRet);
                traitement_a_lancer_si_succes(jsonRet.valeurs);
            }else{
                console.error('r.responseText=',r.responseText);
                parametre_remplacer_des_chaines1.etat_du_travail='travail_en_arriere_plan_en_erreur';
                console.log('j\'ai terminé le travail mais il y a une erreur');
                travail_en_cours=false;
                setTimeout(function(){
                    lancer_les_travaux();
                },100);
                return;
            }
        }catch(e){
            console.error('e=',e);
            parametre_remplacer_des_chaines1.etat_du_travail='travail_en_arriere_plan_en_erreur';
            console.log('j\'ai terminé le travail mais il y a une erreur');
            travail_en_cours=false;
            setTimeout(function(){
                lancer_les_travaux();
            },100);
            return;
        }
    };
    r.onerror=function(e){
        console.error('e=',e);
        /* whatever(); */
        parametre_remplacer_des_chaines1.etat_du_travail='travail_en_arriere_plan_en_erreur';
        console.log('j\'ai terminé le travail mais il y a une erreur');
        travail_en_cours=false;
        setTimeout(function(){
            lancer_les_travaux();
        },100);
        return;
    };
    r.ontimeout=function(e){
        console.error('e=',e);
        parametre_remplacer_des_chaines1.etat_du_travail='travail_en_arriere_plan_en_erreur';
        console.log('j\'ai terminé le travail mais il y a une erreur');
        travail_en_cours=false;
        setTimeout(function(){
            lancer_les_travaux();
        },100);
        return;
    };
    var ajax_param={'call':{'lib':'php','file':'travail_en_arriere_plan1','funct':'remplacer_des_chaine1'},'parametre':parametre_remplacer_des_chaines1,'tache_en_cours':la_tache_en_cours};
    try{
        r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
    }catch(e){
        console.error('e=',e);
        /* whatever(); */
        return({status:false});
    }
    return({status:true});
}
/*
  
  ==============================================================================================================
*/
function lancer_le_travail(){
    var le_timeout=null;
    
    /*
      un travail est constitué de une ou plusieurs tâches
    */
    le_timeout=setTimeout(function(){
        /*
          
          ici on fait réellement le travail
        */
        var i={};
        for(i in liste_des_travaux_en_arriere_plan){
            console.log('%cje traite ','background:lightblue;color:red;',liste_des_travaux_en_arriere_plan[i].etat_du_travail , liste_des_travaux_en_arriere_plan[i]);
            if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_enregistré_en_session'){
                try{
                    if(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.nom_du_travail_en_arriere_plan === 'replacer_des_chaines1'){
                        if(tache_en_cours === true){
                            return;
                        }
                        liste_des_taches_en_arriere_plan=[];
                        var tache={};
                        for(tache in liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches){
//                            console.log('%c liste_des_travaux_en_arriere_plan['+i+'].donnees_recues_du_message' , 'color:red;background:yellow;', liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message)
                            if(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat === 'a_faire'){
                                liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat='maj_bdd_et_récupération_du_tableau';
                                liste_des_taches_en_arriere_plan.push(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache]);
//                                console.log('%cje lance remplacer_des_chaine1 ','background:lightgreen;color:red;');
                                tache_en_cours=true;
                                remplacer_des_chaine1(
                                    liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message,
                                    tache,
                                    traitement_apres_remplacement_chaine_en_bdd
                                );
                                
                                clearTimeout(le_timeout);
                                return;
                            }
                        }
                        /*
                          
                          Si on arrive ici, c'est qu'il n'y a plus de tâche dans le travail
                        */
                        liste_des_travaux_en_arriere_plan[i].etat_du_travail='travail_en_arriere_plan_terminé';
                        travail_en_cours=false;
                    }else if("supprimer_un_commentaire1" === liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.nom_du_travail_en_arriere_plan){
                     
                        /*
                          un travail avec qu'une seule tache
                        */
                        if(tache_en_cours === true){
                            return;
                        }
                        liste_des_taches_en_arriere_plan=[];
                        var tache={};
                        for(tache in liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches){
//                            console.log('%c liste_des_travaux_en_arriere_plan['+i+'].donnees_recues_du_message' , 'color:red;background:yellow;', liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message)
                            if(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat === 'a_faire'){
                                liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat='maj_bdd_et_récupération_du_tableau';
                                liste_des_taches_en_arriere_plan.push(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache]);
//                                console.log('%cje lance remplacer_des_chaine1 ','background:lightgreen;color:red;');
                                tache_en_cours=true;
                                supprimer_un_commentaire1(
                                  liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message,
                                  tache,
                                  traitement_apres_suppression_ligne_en_bdd
                                );
                                
                                clearTimeout(le_timeout);
                                return;
                            }
                        }
                        /*
                          
                          Si on arrive ici, c'est qu'il n'y a plus de tâche dans le travail
                        */
                        liste_des_travaux_en_arriere_plan[i].etat_du_travail='travail_en_arriere_plan_terminé';
                        travail_en_cours=false;
                        
                        
                    }
                }catch(e){
                    console.error('e=',e);
                }
                setTimeout(function(){
                    lancer_les_travaux();
                },100);
                break;
            }
        }
    },500);
}
/*
  
  ==============================================================================================================
*/
function supprimer_un_travail_en_arriere_plan_en_session(){
    var r= new XMLHttpRequest();
    r.open("POST",'../za_ajax.php?supprimer_un_travail_en_arriere_plan_en_session',true);
    r.timeout=6000;
    r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange=function(){
        if((r.readyState != 4) || (r.status != 200)){
            if(r.status == 404){
                console.error('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
            }else if(r.status == 500){
                /*
                  
                  normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                  au niveau du php za_ajax mais sait-on jamais
                */
                if(global_messages['e500logged'] == false){
                    try{
                        console.error('r=',r);
                    }catch(e){
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.status == 'OK'){
                var i={};
                for(i in liste_des_travaux_en_arriere_plan){
                    if(liste_des_travaux_en_arriere_plan[i].etat_du_travail == 'travail_en_arriere_plan_terminé'){
                        delete liste_des_travaux_en_arriere_plan[i];
                        travail_en_cours=false;
                        if(jsonRet.nombre_de_travaux_restants_fin === 0){
                            liste_des_travaux_en_arriere_plan=[];
                        }
                        setTimeout(function(){
                            lancer_les_travaux();
                        },16);
                        break;
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
        console.error('e=',e);
        /* whatever(); */
        return;
    };
    r.ontimeout=function(e){
        /*
          
          il se peut qu'on aie plusieurs clicks
        */
        console.error('e=',e);
        return;
    };
    var i={};
    for(i in liste_des_travaux_en_arriere_plan){
        if(('travail_en_arriere_plan_terminé' === liste_des_travaux_en_arriere_plan[i].etat_du_travail) || ('travail_en_arriere_plan_en_erreur' === liste_des_travaux_en_arriere_plan[i].etat_du_travail)){
            var ajax_param={'call':{'lib':'php','file':'session','funct':'supprimer_un_travail_en_arriere_plan_en_session'},'travail_en_arriere_plan':liste_des_travaux_en_arriere_plan[i]};
            try{
                r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
            }catch(e){
                console.error('e=',e);
                /* whatever(); */
                return({status:false});
            }
            break;
        }
    }
    return({status:true});
}
/*
  
  ==============================================================================================================
*/
function enregistrer_un_travail_en_arriere_plan_en_session(){
    var r= new XMLHttpRequest();
    r.open("POST",'../za_ajax.php?enregistrer_un_travail_en_arriere_plan_en_session',true);
    r.timeout=6000;
    r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange=function(){
        if((r.readyState != 4) || (r.status != 200)){
            if(r.status == 404){
                console.error('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
            }else if(r.status == 500){
                /*
                  
                  normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                  au niveau du php za_ajax mais sait-on jamais
                */
                if(global_messages['e500logged'] == false){
                    try{
                    }catch(e){
                        console.error('e=',e);
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.status == 'OK'){
                var i={};
                for(i in liste_des_travaux_en_arriere_plan){
                    if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_reçu'){
                        liste_des_travaux_en_arriere_plan[i].etat_du_travail='travail_en_arriere_plan_enregistré_en_session';
                        travail_en_cours=false;
                        break;
                    }
                }
                setTimeout(function(){
                    lancer_les_travaux();
                },16);
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
        console.error('e=',e);
        /* whatever(); */
        return;
    };
    r.ontimeout=function(e){
        console.error('e=',e);
        return;
    };
    var i={};
    for(i in liste_des_travaux_en_arriere_plan){
        if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_reçu'){
            var ajax_param={'call':{'lib':'php','file':'session','funct':'enregistrer_un_travail_en_arriere_plan_en_session'},'travail_en_arriere_plan':liste_des_travaux_en_arriere_plan[i]};
            try{
                r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
            }catch(e){
                console.error('e=',e);
                /* whatever(); */
                return({status:false});
            }
            break;
        }
    }
    return({status:true});
}
/*
  
  ==============================================================================================================
*/
function lancer_les_travaux(){
    if(travail_en_cours === false){
        if(liste_des_travaux_en_arriere_plan.length > 0){
            /*
              
              En priorité, on enregistre en session les travaux en arrière plan
            */
            var un_morceau_de_travail_fait=false;
            var i={};
            for(i in liste_des_travaux_en_arriere_plan){
                if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_reçu'){
                    travail_en_cours=true;
                    un_morceau_de_travail_fait=true;
                    enregistrer_un_travail_en_arriere_plan_en_session();
                    break;
                }
            }
            /*
              
              puis les fins de travaux
            */
            if(un_morceau_de_travail_fait === false){
                var i={};
                for(i in liste_des_travaux_en_arriere_plan){
                    if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_terminé'){
                        travail_en_cours=true;
                        un_morceau_de_travail_fait=true;
                        supprimer_un_travail_en_arriere_plan_en_session();
                        break;
                    }
                }
            }
            /*
              
              puis les travaux à réaliser
            */
            if(un_morceau_de_travail_fait === false){
                var i={};
                for(i in liste_des_travaux_en_arriere_plan){
                    if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_enregistré_en_session'){
                        travail_en_cours=true;
                        lancer_le_travail();
                        break;
                    }
                }
            }
            /*
              
              puis les travaux en erreur
            */
            var i={};
            for(i in liste_des_travaux_en_arriere_plan){
                if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_en_erreur'){
                    travail_en_cours=true;
                    un_morceau_de_travail_fait=true;
                    supprimer_un_travail_en_arriere_plan_en_session();
                    delete liste_des_travaux_en_arriere_plan[i];
                    break;
                }
            }
        }
    }
}
/*
  
  ==============================================================================================================
*/
onmessage=function(message_recu){
    var donnees_recues_du_message = JSON.parse(JSON.stringify(message_recu.data));
    if(donnees_recues_du_message.type_de_message === "déclencher_un_travail"){
        var maintenant= new Date().getTime();
        var ms = performance.now();
        var cle = (maintenant + ms);
        liste_des_travaux_en_arriere_plan.push({'clé':cle,'etat_du_travail':'travail_en_arriere_plan_reçu','donnees_recues_du_message':donnees_recues_du_message.parametres});
    }else if("integrer_les_travaux_en_session" === donnees_recues_du_message.type_de_message){
        var i={};
        for(i in donnees_recues_du_message.tableau_des_travaux){
            donnees_recues_du_message.tableau_des_travaux[i].etat_du_travail='travail_en_arriere_plan_enregistré_en_session';
            liste_des_travaux_en_arriere_plan.push(donnees_recues_du_message.tableau_des_travaux[i]);
        }
    }else{
        console.error(('type de message non traité : ' + donnees_recues_du_message.type_de_message));
    }
    var message_a_retourner={'donnees_recues_du_message':donnees_recues_du_message,'liste_des_travaux_en_arriere_plan':liste_des_travaux_en_arriere_plan};
    postMessage(message_a_retourner);
    if(travail_en_cours === false){
        setTimeout(function(){
            lancer_les_travaux();
        },16);
    }else{
    }
};