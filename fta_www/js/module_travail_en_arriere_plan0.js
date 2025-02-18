/*
  Ceci est un "web worker" appelé par l'interface quand on est sur le menu rev
  Il permet de faire des remplacements de chaines dans les rev
*/
try{
    importScripts('./jslib/acorn.js');
}catch(e){
    debugger;
}
/* try{importScripts('./core6.js');}catch(e){debugger;}*/
var liste_des_travaux_en_arriere_plan=[];
var liste_des_taches_en_arriere_plan=[];
var travail_en_cours=false;
var tache_en_cours=false;
var __module_html1=null;
var __module_requete_sql1=null;
var __m_rev_vers_php1=null;
var __m_rev_vers_js1=null;
var __m_rev1=null;
var __aa_js_sql={};
import('./mf_rev1.js').then(function(Module){
        __m_rev1=new Module.c_rev1('__m_rev1');
    });
import('./module_html.js').then(function(Module){
        __module_html1=new Module.traitements_sur_html('__module_html1');
    });
import('./module_requete_sql.js').then(function(Module){
        __module_requete_sql1=new Module.requete_sql('__module_requete_sql1',null);
    });
import('./mf_rev_vers_js1.js').then(function(Module){
        __m_rev_vers_js1=new Module.c_rev_vers_js1('__m_rev_vers_js1',null);
    });
import('./mf_rev_vers_php1.js').then(function(Module){
        __m_rev_vers_php1=new Module.c_rev_vers_php1('__m_rev_vers_php1',null);
    });
import('./mf_rev_vers_sql1.js').then(function(Module){
        __m_rev_vers_sql1=new Module.c_rev_vers_sql1('__m_rev_vers_sql1',null);
    });
/*
  =====================================================================================================================
  function recupérer_un_fetch
*/
async function recuperer_un_fetch_dans_module_travail_en_ap(url,donnees){
    var delais_admis=donnees.call.opt && donnees.call.opt.delais_admis ? ( donnees.call.opt.delais_admis ) : ( 6000 );
    var en_entree={
        "signal" : AbortSignal.timeout(delais_admis) ,
        "method" : "POST" ,
        "mode" : "cors" ,
        "cache" : "no-cache" ,
        "credentials" : "same-origin" ,
        "headers" : {"Content-Type" : 'application/x-www-form-urlencoded'} ,
        "redirect" : "follow" ,
        "referrerPolicy" : "no-referrer" ,
        "body" : 'ajax_param=' + encodeURIComponent(JSON.stringify(donnees))
    };
    try{
        var response=await fetch(url,en_entree);
        var t=await response.text();
        try{
            var le_json=JSON.parse(t);
            if(le_json.hasOwnProperty('__xms')){
                for(var i in le_json.__xms){
                    console.log(le_json.__xms[i]);
                }
            }
            return le_json;
        }catch(e){
            console.log('erreur sur convertion json, texte non json=' + t);
            console.log('url=' + url);
            console.log(JSON.stringify(en_entree));
            console.log(JSON.stringify(donnees));
            return({"__xst" : false ,"__xme" : 'le retour n\'est pas en json pour ' + JSON.stringify(donnees) + ' , t=' + t});
        }
    }catch(e){
        console.log(e);
        if(e.message === 'signal timed out'){
            console.log('les données n\'ont pas pu être récupérées  en moins de ' + (parseInt((delais_admis / 1000) * 10,10) / 10) + ' secondes ');
        }else{
            console.log(e.message);
        }
        return({"__xst" : false ,"__xme" : e.message});
    }
}
/*
  =====================================================================================================================
*/
function enregistrer_les_sql_en_base(params,fonction_apres){
    var ajax_param={"call" : {"lib" : 'php' ,"file" : 'travail_en_arriere_plan1' ,"funct" : 'enregistrer_les_sql_en_base'} ,"params" : params};
    async function enregistrer_les_sql_en_base1(url="",ajax_param){
        return(recuperer_un_fetch_dans_module_travail_en_ap(url,ajax_param));
    }
    enregistrer_les_sql_en_base1('../za_ajax.php?recuperer_les_travaux_en_arriere_plan_de_la_session',ajax_param).then((donnees) => {
            if(donnees.__xst === true){
                console.log('%cYOUPIIIII sql donnees=','background:yellow;color:red;',donnees);
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
        });
    return({"__xst" : true});
}
/*
  =====================================================================================================================
*/
function enregistrer_les_sources_en_base(params,fonction_apres){
    var ajax_param={"call" : {"lib" : 'php' ,"file" : 'travail_en_arriere_plan1' ,"funct" : 'enregistrer_les_sources_en_base'} ,"params" : params};
    async function enregistrer_les_sources_en_base1(url="",ajax_param){
        return(recuperer_un_fetch_dans_module_travail_en_ap(url,ajax_param));
    }
    enregistrer_les_sources_en_base1('../za_ajax.php?enregistrer_les_sources_en_base',ajax_param).then((donnees) => {
            if(donnees.__xst === true){
                console.log('%cYOUPIIIII donnees=','background:yellow;color:red;',donnees);
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
        });
    return({"__xst" : true});
}
/*
  =====================================================================================================================
*/
function apres_traite_un_remplacement(id_tache,arg,provenance){
    var id_source={};
    for(id_source in arg){
        for( j=0 ; j < liste_des_taches_en_arriere_plan.length ; j++ ){
            /*
              
              attention ci dessous, la clé est une chaine
            */
            if(String(id_source) === String(liste_des_taches_en_arriere_plan[j].id_source)
                   && liste_des_taches_en_arriere_plan[j].etat !== 'terminée'
            ){
                console.log('liste_des_taches_en_arriere_plan[' + j + ']',liste_des_taches_en_arriere_plan[j]);
                var le_source=arg[id_source];
                if(le_source.nom_source.lastIndexOf('.') >= 0){
                    var extension=le_source.nom_source.substr(le_source.nom_source.lastIndexOf('.'));
                    var n=0;
                    var tab=[];
                    var k={};
                    for(k in le_source['tab']){
                        var e=le_source['tab'][k];
                        tab.push([
                                e[n + 0],
                                e[n + 1],
                                e[n + 2],
                                e[n + 3],
                                e[n + 4],
                                e[n + 5],
                                e[n + 6],
                                e[n + 7],
                                e[n + 8],
                                e[n + 9],
                                e[n + 10],
                                e[n + 11],
                                e[n + 12],
                                e[n + 13]
                            ]);
                    }
                    if(provenance === 'source'
                               && (extension === '.html'
                                   || extension === '.htm'
                                   || extension === '.php'
                                   || extension === '.js')
                           || provenance === 'sql'
                    ){
                        tache_en_cours=true;
                        if(provenance === 'sql'){
                            var objSource=__m_rev_vers_sql1.c_tab_vers_js(tab,{});
                            if(objSource.__xst === true){
                                var obj1=__m_rev1.matrice_vers_source_rev1(tab,0,true,1);
                                if(obj1.__xst === true){
                                    var obj2=__module_requete_sql1.transform_source_rev_vers_sql(obj1.__xva,id_source);
                                    if(obj2.__xst === true){
                                        arg[id_source].tab=[];
                                        var params={
                                            "arg" : arg ,
                                            "id_tache" : j ,
                                            "id_source" : id_source ,
                                            "source_rev" : obj1.__xva ,
                                            "source_sql" : obj2.source_sql ,
                                            "source_php" : obj2.source_php
                                        };
                                        enregistrer_les_sql_en_base(params,traitement_apres_remplacement_chaine_en_bdd);
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
                                liste_des_taches_en_arriere_plan[j].etat='en_erreur';
                                tache_en_cours=false;
                                setTimeout(function(){
                                        traitement_apres_remplacement_chaine_en_bdd(arg);
                                    },16);
                                return;
                            }
                        }else if(provenance === 'source'){
                            if(extension === '.html' || extension === '.htm'){
                                var objSource=__module_html1.tabToHtml1(tab,0,false,0);
                            }else if(extension === '.js'){
                                var objSource=__m_rev_vers_js1.c_tab_vers_js(tab,{});
                            }else if(extension === '.php'){
                                var objSource=__m_rev_vers_php1.c_tab_vers_php(tab,{});
                            }
                            if(objSource.__xst === true){
                                var obj=__m_rev1.matrice_vers_source_rev1(tab,0,true,1);
                                if(obj.__xst === true){
                                    arg[id_source].tab=[];
                                    var params={"arg" : arg ,"id_tache" : j ,"id_source" : id_source ,"source_rev" : obj.__xva ,"source_genere" : objSource.__xva};
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
                        }
                    }else{
                        console.log('%c un traitement est à mettre en place = ','color:yellow;background:red;');
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
}
/*
  =====================================================================================================================
*/
function traite_une_suppression(id_tache,arg){
    var id_source={};
    for(id_source in arg){
        for( j=0 ; j < liste_des_taches_en_arriere_plan.length ; j++ ){
            /*
              
              attention ci dessous, la clé est une chaine
            */
            if(String(id_source) === String(liste_des_taches_en_arriere_plan[j].id_source)
                   && liste_des_taches_en_arriere_plan[j].etat !== 'terminée'
            ){
                console.log('liste_des_taches_en_arriere_plan[' + j + ']',liste_des_taches_en_arriere_plan[j]);
                var le_source=arg[id_source];
                if(le_source.nom_source.lastIndexOf('.') >= 0){
                    var extension=le_source.nom_source.substr(le_source.nom_source.lastIndexOf('.'));
                    var n=0;
                    var tab=[];
                    var k={};
                    for(k in le_source['tab']){
                        var e=le_source['tab'][k];
                        tab.push([
                                e[n + 0],
                                e[n + 1],
                                e[n + 2],
                                e[n + 3],
                                e[n + 4],
                                e[n + 5],
                                e[n + 6],
                                e[n + 7],
                                e[n + 8],
                                e[n + 9],
                                e[n + 10],
                                e[n + 11],
                                e[n + 12],
                                e[n + 13]
                            ]);
                    }
                    var tab1=__m_rev1.indicer_le_tableau(tab);
                    if(extension === '.html' || extension === '.htm' || extension === '.php' || extension === '.js'){
                        tache_en_cours=true;
                        if(extension === '.html' || extension === '.htm'){
                            var objSource=__module_html1.tabToHtml1(tab1,0,false,0);
                            console.log('%c on traite un html ','color:red;background:yellow;',objSource.__xst);
                        }else if(extension === '.js'){
                            /* var objSource=parseJavascript0(tab,1,0); */
                            /* avrif */
                            debugger;
                            var objSource=__m_rev_vers_js1.c_tab_vers_js(tab1,{});
                            console.log('%c on traite un js ','color:red;background:yellow;',objSource.__xst);
                        }else if(extension === '.php'){
                            /* avrif */
                            debugger;
                            var objSource=__m_rev_vers_php1.c_tab_vers_php(tab1,{"indice_de_debut" : i});
                            console.log('%c on traite un php ','color:red;background:yellow;',objSource.__xst);
                        }
                        if(objSource.__xst === true){
                            var obj=__m_rev1.matrice_vers_source_rev1(tab1,0,true,1);
                            if(obj.__xst === true){
                                arg[id_source].tab1=[];
                                var params={
                                    "arg" : arg ,
                                    "id_tache" : j ,
                                    "id_source" : id_source ,
                                    "source_rev" : obj.__xva ,
                                    "source_genere" : objSource.__xva ,
                                    "provenance" : null
                                };
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
}
/*
  =====================================================================================================================
*/
function traitement_apres_suppression_ligne_en_bdd(arg){
    console.log('tache_en_cours=',tache_en_cours,'liste_des_taches_en_arriere_plan = ',liste_des_taches_en_arriere_plan);
    if(tache_en_cours === false){
        var i=0;
        for( i=0 ; i < liste_des_taches_en_arriere_plan.length ; i++ ){
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
        for( i=0 ; i < liste_des_taches_en_arriere_plan.length ; i++ ){
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
  =====================================================================================================================
*/
function traitement_apres_remplacement_chaine_en_bdd(arg,jsonRet){
    console.log('tache_en_cours=',tache_en_cours,'liste_des_taches_en_arriere_plan = ',liste_des_taches_en_arriere_plan);
    if(tache_en_cours === false){
        var i=0;
        for( i=0 ; i < liste_des_taches_en_arriere_plan.length ; i++ ){
            if(liste_des_taches_en_arriere_plan[i].etat === 'maj_bdd_et_récupération_du_tableau'){
                liste_des_taches_en_arriere_plan[i].etat='en_cours';
                tache_en_cours=true;
                if(jsonRet
                       && jsonRet.hasOwnProperty(__entree)
                       && jsonRet
                       && jsonRet.__entree.hasOwnProperty('parametre')
                       && jsonRet.__entree.parametre.hasOwnProperty('provenance')
                ){
                    apres_traite_un_remplacement(i,arg,jsonRet.__entree.parametre.provenance);
                }else{
                    apres_traite_un_remplacement(i,arg,null);
                }
                return;
            }
        }
    }else{
        var une_tache_en_cours=false;
        var i=0;
        for( i=0 ; i < liste_des_taches_en_arriere_plan.length ; i++ ){
            if(liste_des_taches_en_arriere_plan[i].etat === 'maj_bdd_et_récupération_du_tableau'){
                liste_des_taches_en_arriere_plan[i].etat='en_cours';
                une_tache_en_cours=true;
                if(jsonRet
                       && jsonRet.hasOwnProperty('__entree')
                       && jsonRet
                       && jsonRet.__entree.hasOwnProperty('parametre')
                       && jsonRet.__entree.parametre.hasOwnProperty('provenance')
                ){
                    apres_traite_un_remplacement(i,arg,jsonRet.__entree.parametre.provenance);
                }else{
                    apres_traite_un_remplacement(i,arg,null);
                }
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
  =====================================================================================================================
*/
function supprimer_un_commentaire1(parametre_supprimer_un_commentaire1,la_tache_en_cours,traitement_a_lancer_si_succes){
    var ajax_param={
        "call" : {"lib" : 'php' ,"file" : 'travail_en_arriere_plan1' ,"funct" : 'supprimer_un_commentaire1'} ,
        "parametre" : parametre_supprimer_un_commentaire1 ,
        "tache_en_cours" : la_tache_en_cours
    };
    async function supprimer_un_commentaire2(url="",ajax_param){
        return(recuperer_un_fetch_dans_module_travail_en_ap(url,ajax_param));
    }
    supprimer_un_commentaire2('../za_ajax.php?supprimer_un_commentaire1',ajax_param).then((donnees) => {
            if(donnees.__xst === true){
                console.log('donnees=',donnees);
                traitement_a_lancer_si_succes(donnees.__xva);
            }else{
                parametre_supprimer_un_commentaire1.etat_du_travail='travail_en_arriere_plan_en_erreur';
                console.log('j\'ai terminé le travail mais il y a une erreur');
                travail_en_cours=false;
                setTimeout(function(){
                        lancer_les_travaux();
                    },100);
                return;
            }
        });
    return({"__xst" : true});
}
/*
  
  =====================================================================================================================
*/
function remplacer_des_chaine1(parametre_remplacer_des_chaines1,la_tache_en_cours,traitement_a_lancer_si_succes){
    var ajax_param={
        "call" : {"lib" : 'php' ,"file" : 'travail_en_arriere_plan1' ,"funct" : 'remplacer_des_chaine1'} ,
        "parametre" : parametre_remplacer_des_chaines1 ,
        "tache_en_cours" : la_tache_en_cours
    };
    async function remplacer_des_chaine2(url="",ajax_param){
        return(recuperer_un_fetch_dans_module_travail_en_ap(url,ajax_param));
    }
    remplacer_des_chaine2('../za_ajax.php?remplacer_des_chaine1',ajax_param).then((donnees) => {
            if(donnees.__xst === true){
                traitement_a_lancer_si_succes(donnees.__xva,donnees);
            }else{
                parametre_remplacer_des_chaines1.etat_du_travail='travail_en_arriere_plan_en_erreur';
                console.log('j\'ai terminé le travail mais il y a une erreur');
                travail_en_cours=false;
                setTimeout(function(){
                        lancer_les_travaux();
                    },100);
                return;
            }
        });
    return({"__xst" : true});
}
/*
  
  =====================================================================================================================
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
            console.log('%cje traite ','background:lightblue;color:red;','etat=',liste_des_travaux_en_arriere_plan[i].etat_du_travail,liste_des_travaux_en_arriere_plan[i]);
            if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_enregistré_en_session'){
                try{
                    if(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.nom_du_travail_en_arriere_plan === 'replacer_des_chaines1'
                    ){
                        if(tache_en_cours === true){
                            return;
                        }
                        liste_des_taches_en_arriere_plan=[];
                        var tache={};
                        for(tache in liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches){
                            if(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat === 'a_faire'){
                                liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat='maj_bdd_et_récupération_du_tableau';
                                liste_des_taches_en_arriere_plan.push(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache]);
                                tache_en_cours=true;
                                remplacer_des_chaine1(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message,tache,traitement_apres_remplacement_chaine_en_bdd);
                                clearTimeout(le_timeout);
                                return;
                            }
                        }
                        /*
                          
                          Si on arrive ici, c'est qu'il n'y a plus de tâche dans le travail
                        */
                        liste_des_travaux_en_arriere_plan[i].etat_du_travail='travail_en_arriere_plan_terminé';
                        travail_en_cours=false;
                    }else if("supprimer_un_commentaire1" === liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.nom_du_travail_en_arriere_plan
                    ){
                        /*
                          un travail avec qu'une seule tache
                        */
                        if(tache_en_cours === true){
                            return;
                        }
                        liste_des_taches_en_arriere_plan=[];
                        var tache={};
                        for(tache in liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches){
                            if(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat === 'a_faire'){
                                liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache].etat='maj_bdd_et_récupération_du_tableau';
                                liste_des_taches_en_arriere_plan.push(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message.liste_des_taches[tache]);
                                tache_en_cours=true;
                                supprimer_un_commentaire1(liste_des_travaux_en_arriere_plan[i].donnees_recues_du_message,tache,traitement_apres_suppression_ligne_en_bdd);
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
  
  =====================================================================================================================
*/
function supprimer_un_travail_en_arriere_plan_en_session(){
    var i={};
    for(i in liste_des_travaux_en_arriere_plan){
        if('travail_en_arriere_plan_terminé' === liste_des_travaux_en_arriere_plan[i].etat_du_travail
               || 'travail_en_arriere_plan_en_erreur' === liste_des_travaux_en_arriere_plan[i].etat_du_travail
        ){
            var ajax_param={
                "call" : {"lib" : 'php' ,"file" : 'session' ,"funct" : 'supprimer_un_travail_en_arriere_plan_en_session'} ,
                "travail_en_arriere_plan" : liste_des_travaux_en_arriere_plan[i]
            };
            async function supprimer_un_travail_en_arriere_plan_en_session1(url="",ajax_param){
                return(recuperer_un_fetch_dans_module_travail_en_ap(url,ajax_param));
            }
            supprimer_un_travail_en_arriere_plan_en_session1('../za_ajax.php?supprimer_un_travail_en_arriere_plan_en_session',ajax_param).then((donnees) => {
                    if(donnees.__xst === true){
                        var i={};
                        for(i in liste_des_travaux_en_arriere_plan){
                            if(liste_des_travaux_en_arriere_plan[i].etat_du_travail == 'travail_en_arriere_plan_terminé'){
                                delete liste_des_travaux_en_arriere_plan[i];
                                travail_en_cours=false;
                                if(donnees.nombre_de_travaux_restants_fin === 0){
                                    liste_des_travaux_en_arriere_plan=[];
                                }
                                setTimeout(function(){
                                        lancer_les_travaux();
                                    },16);
                                break;
                            }
                        }
                    }else{
                        console.error('donnees=',donnees);
                        return;
                    }
                    return;
                });
            break;
        }
    }
    return({"__xst" : true});
}
/*
  
  =====================================================================================================================
*/
function enregistrer_un_travail_en_arriere_plan_en_session(){
    var i={};
    for(i in liste_des_travaux_en_arriere_plan){
        if(liste_des_travaux_en_arriere_plan[i].etat_du_travail === 'travail_en_arriere_plan_reçu'){
            var ajax_param={
                "call" : {"lib" : 'php' ,"file" : 'session' ,"funct" : 'enregistrer_un_travail_en_arriere_plan_en_session'} ,
                "travail_en_arriere_plan" : liste_des_travaux_en_arriere_plan[i]
            };
            async function enregistrer_un_travail_en_arriere_plan_en_session1(url="",ajax_param){
                return(recuperer_un_fetch_dans_module_travail_en_ap(url,ajax_param));
            }
            enregistrer_un_travail_en_arriere_plan_en_session1('../za_ajax.php?enregistrer_un_travail_en_arriere_plan_en_session',ajax_param).then((donnees) => {
                    if(donnees.__xst === true){
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
                        console.error('donnees=',donnees);
                    }
                });
            break;
        }
    }
    return({"__xst" : true});
}
/*
  
  =====================================================================================================================
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
  =====================================================================================================================
*/
function recuperer_les_travaux_en_session(){
    var ajax_param={"call" : {"lib" : 'php' ,"file" : 'session' ,"funct" : 'recuperer_les_travaux_en_arriere_plan_de_la_session'}};
    async function recuperer_les_travaux_en_arriere_plan_de_la_session1(url="",ajax_param){
        return(recuperer_un_fetch_dans_module_travail_en_ap(url,ajax_param));
    }
    recuperer_les_travaux_en_arriere_plan_de_la_session1('../za_ajax.php?recuperer_les_travaux_en_arriere_plan_de_la_session',ajax_param).then((donnees) => {
            if(donnees.__xst === true){
                /* console.log('donnees.__xva=',donnees.__xva); */
                __aa_js_sql=donnees.__xva.__aa_js_sql;
                /* console.log('__aa_js_sql[1]=' , __aa_js_sql[1] ); */
                var tableau_des_travaux=[];
                var i={};
                for(i in donnees.__xva.sess_travaux_en_arriere_plan){
                    console.log(donnees.__xva.sess_travaux_en_arriere_plan[i]);
                    tableau_des_travaux.push(donnees.__xva.sess_travaux_en_arriere_plan[i]);
                }
                console.log('tableau_des_travaux=',tableau_des_travaux);
                var message_a_retourner={"type_de_message" : 'recuperer_les_travaux_en_session' ,"tableau_des_travaux" : tableau_des_travaux};
                postMessage(message_a_retourner);
                return;
            }else{
                /* pas de travail en arrière plan' */
                return;
            }
        });
}
/*
  =====================================================================================================================
*/
onmessage=function(message_recu){
    var donnees_recues_du_message=JSON.parse(JSON.stringify(message_recu.data));
    if(donnees_recues_du_message.type_de_message === "déclencher_un_travail"){
        console.log('dans le worker, message_recu=',message_recu.data);
        var maintenant=new Date().getTime();
        var ms=performance.now();
        var cle=maintenant + ms;
        liste_des_travaux_en_arriere_plan.push({"clé" : cle ,"etat_du_travail" : 'travail_en_arriere_plan_reçu' ,"donnees_recues_du_message" : donnees_recues_du_message.parametres});
    }else if("integrer_les_travaux_en_session" === donnees_recues_du_message.type_de_message){
        console.log('dans le worker, message_recu=',message_recu.data);
        var i={};
        for(i in donnees_recues_du_message.tableau_des_travaux){
            donnees_recues_du_message.tableau_des_travaux[i].etat_du_travail='travail_en_arriere_plan_enregistré_en_session';
            liste_des_travaux_en_arriere_plan.push(donnees_recues_du_message.tableau_des_travaux[i]);
        }
    }else if("recuperer_les_travaux_en_session" === donnees_recues_du_message.type_de_message){
        recuperer_les_travaux_en_session();
    }else{
        console.error('type de message non traité : ' + donnees_recues_du_message.type_de_message);
    }
    var message_a_retourner={"donnees_recues_du_message" : donnees_recues_du_message ,"liste_des_travaux_en_arriere_plan" : liste_des_travaux_en_arriere_plan};
    postMessage(message_a_retourner);
    if(travail_en_cours === false){
        setTimeout(function(){
                lancer_les_travaux();
            },16);
    }else{
    }
};
/*
  =====================================================================================================================
*/