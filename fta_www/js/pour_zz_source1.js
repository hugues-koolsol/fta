"use strict";
/*
  =====================================================================================================================
*/
function convertir_rev_en_sql(chp_rev_source,chp_genere_source,id_source,id_cible){
    __gi1.raz_des_messages();
    var a = document.getElementById(chp_rev_source);
    var startMicro = performance.now();
    var tableau1 = iterateCharacters2(a.value);
    global_messages.data.tableau=tableau1;
    var endMicro = performance.now();
    var startMicro = performance.now();
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    global_messages.data.matrice=matriceFonction;
    if(matriceFonction.__xst === true){
        var objSql = tabToSql1(matriceFonction.__xva,0,0,false);
        if(objSql.__xst === true){
            document.getElementById(chp_genere_source).value=objSql.__xva;
        }
        var parametres_sauvegarde={'matrice':matriceFonction.__xva,'chp_provenance_rev':'source','chx_source_rev':id_source,'id_cible':id_cible};
        sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    }
}
/*
  =====================================================================================================================
*/
function convertir_sqlite_en_rev(chp_rev_source,chp_genere_source){
    var source_sqlite = document.getElementById(chp_genere_source).value;
    var obj = convertion_texte_sql_en_rev(source_sqlite);
    if(obj.__xst === true){
        document.getElementById(chp_rev_source).value=obj.__xva;
    }else{
        logerreur({__xst:false,__xme:'Erreur de convertion'});
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
}
/*
  =====================================================================================================================
*/
async function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(id_source,contenuRev,contenuSource,date_de_debut_traitement,matrice){
    var ajax_param={
        'call':{lib:'core',file:'file',funct:'sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant'},
        id_source:id_source,
        rev:contenuRev,
        source:contenuSource,
        date_de_debut_traitement:date_de_debut_traitement,
        matrice:matrice
    };
    async function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant1(url="",ajax_param){
        return(__gi1.recupérer_un_fetch(url,ajax_param));
    }
    sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant1('za_ajax.php?sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant1',ajax_param).then((donnees) => {
        if(donnees.__xst === true){
            var date_de_fin_traitement= new Date();
            date_de_fin_traitement=date_de_fin_traitement.getTime();
            var date_de_debut_traitement=donnees.__entree.date_de_debut_traitement;
            var nombre_de_secondes = (((date_de_fin_traitement - date_de_debut_traitement)) / 1000);
            if(donnees.__entree.parametres_sauvegarde.nom_du_source){
                logerreur({__xst:true,'__xme':'la réécriture de ' + donnees.__entree.parametres_sauvegarde.nom_du_source + ' a été faite en ' + nombre_de_secondes + ' secondes'});
            }else{
                logerreur({__xst:true,'__xme':'la réécriture du fichier a été faite en ' + nombre_de_secondes + ' secondes'});
            }
        }else{
            console.log(donnees);
        }
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
    });
}
/*
  =====================================================================================================================
*/
function traitement_apres_ajax_pour_conversion_fichier_sql(par){
    var objRev = convertion_texte_sql_en_rev(par.contenu_du_fichier);
    if(objRev.__xst === true){
        var tableau1 = iterateCharacters2(objRev.__xva);
        var matriceFonction = functionToArray2(tableau1.out,true,false,'');
        if(matriceFonction.__xst === true){
            var objSql = tabToSql1(matriceFonction.__xva,0,0,false);
            if(objSql.__xst === true){
                var contenu = objSql.__xva.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'');
                sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(par.__entree.id_source,objRev.__xva,contenu,par.__entree.date_de_debut_traitement,matriceFonction.__xva);
            }
        }
    }
}

/*
  =====================================================================================================================
*/
function bouton_dans_zz_source_a1_transform_js_en_rev_avec_acorn(chp_genere_source,chp_rev_source){
    __gi1.raz_des_messages();
    var a = document.getElementById(chp_genere_source);
    var obj = transform_source_js_en_rev_avec_acorn(a.value,{"nom_de_la_text_area_source" : chp_genere_source,"nom_de_la_text_area_rev" : chp_rev_source});
    if(obj.__xst === true){
    }else{
        astjs_logerreur({"__xst" : false,"__xme" : '2446 erreur '});
    }
}


/*
  =====================================================================================================================
*/
function sauvegarder_html_en_ligne(format_rev,donnees){

    var tableau1 = iterateCharacters2(format_rev);
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    if(matriceFonction.__xst === false){
        logerreur({__xst:false,__xme:'0128 erreur sauvegarder_html_en_ligne'});
        return({__xst:false,__xme:'0129 erreur sauvegarder_html_en_ligne'})
    }
    var obj2=__module_html1.tabToHtml1(matriceFonction.__xva,0,false,0);
    if(obj2.__xst===true){
        sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(
            donnees.__entree.id_source,
            format_rev,
            obj2.__xva,
            donnees.__entree.date_de_debut_traitement,
            matriceFonction.__xva
        );
        return({__xst:true})
    }else{
        logerreur({__xst:false,__xme:'0143 erreur sauvegarder_html_en_ligne'});
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
    }
}

/*
  =====================================================================================================================
*/
function sauvegarder_js_en_ligne(format_rev,donnees){

    var tableau1 = iterateCharacters2(format_rev);
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    if(matriceFonction.__xst === false){
        logerreur({__xst:false,__xme:'0180 erreur sauvegarder_js_en_ligne'});
        return({__xst:false,__xme:'0181 erreur sauvegarder_js_en_ligne'})
    }
    
    var objJs = parseJavascript0(matriceFonction.__xva,1,0);
    if(objJs.__xst === true){
        sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(
            donnees.__entree.id_source,
            format_rev,
            objJs.__xva,
            donnees.__entree.date_de_debut_traitement,
            matriceFonction.__xva
        );
        return({__xst:true})
    }else{
        logerreur({__xst:false,__xme:'0195 erreur sauvegarder_js_en_ligne'});
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
    }
}
/*
  =====================================================================================================================
*/
function sauvegarder_php_en_ligne(format_rev,donnees){
    var tableau1 = iterateCharacters2(format_rev);
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    if(matriceFonction.__xst === false){
        return(logerreur({__xst:false,__xme:'erreur 167 traitement_apres_ajax_pour_conversion_fichier_php'}))
    }
        
    var objPhp = parsePhp0(matriceFonction.__xva,0,0);
    if(objPhp.__xst === true){
     
        sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(
             donnees.__entree.id_source,
             format_rev,
             objPhp.__xva,
             donnees.__entree.date_de_debut_traitement,
             matriceFonction.__xva
        );
        return({__xst:true})
    }else{
        return(logerreur({__xst:false,__xme:'0182 erreur pour_zz_source'}))
    }
 

}




/*
  =====================================================================================================================
*/
function zz_l1_convertir_un_source_sur_disque(id_source){
    __gi1.raz_des_messages();
    var date_de_debut_traitement= new Date();
    date_de_debut_traitement=date_de_debut_traitement.getTime();
    var ajax_param={'call':{lib:'core',file:'file',funct:'charger_un_fichier_source_par_son_identifiant'},id_source:id_source,date_de_debut_traitement:date_de_debut_traitement};
    async function charger_un_fichier_source_par_son_identifiant1(url="",ajax_param){
        return(__gi1.recupérer_un_fetch(url,ajax_param));
    }
    charger_un_fichier_source_par_son_identifiant1('za_ajax.php?charger_un_fichier_source_par_son_identifiant',ajax_param).then((donnees) => {
        if(donnees.__xst === true){
            var nom_source = donnees.db['T0.chp_nom_source'];
            var type_source = donnees.db['T0.chp_type_source'];
            if(nom_source.substr((nom_source.length - 4)) === '.php'){
                var ret = recupereAstDePhp2(donnees.contenu_du_fichier,{'donnees':donnees,'en_ligne':true},null);
            }else if(nom_source.substr((nom_source.length - 3)) === '.js'){
                var obj = transform_source_js_en_rev_avec_acorn(donnees.contenu_du_fichier,{'donnees':donnees,'en_ligne':true});
                
            }else if((nom_source.substr((nom_source.length - 5)) === '.html') || (nom_source.substr((nom_source.length - 4)) === '.htm')){
                
                //traitement_apres_ajax_pour_conversion_fichier_html(donnees);
                var obj=__module_html1.TransformHtmlEnRev(donnees.contenu_du_fichier,0,{"en_ligne":true,"donnees":donnees});
                
                
            }else if(nom_source.substr((nom_source.length - 4)) === '.sql'){
                traitement_apres_ajax_pour_conversion_fichier_sql(donnees);
            }
        }else{
            console.log(donnees);
        }
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
    });
}
/*
  =====================================================================================================================
*/
function convertir_rev_en_js(chp_rev_source,chp_genere_source,id_source,id_cible){
    __gi1.raz_des_messages();
    var a = document.getElementById(chp_rev_source);
    var startMicro = performance.now();
    var tableau1 = iterateCharacters2(a.value);
    global_messages.data.tableau=tableau1;
    var endMicro = performance.now();
    var startMicro = performance.now();
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    global_messages.data.matrice=matriceFonction;
    if(matriceFonction.__xst === true){
        var objJs = parseJavascript0(matriceFonction.__xva,1,0);
        if(objJs.__xst === true){
            document.getElementById(chp_genere_source).value=objJs.__xva;
        }
        var parametres_sauvegarde={'matrice':matriceFonction.__xva,'chp_provenance_rev':'source','chx_source_rev':id_source,'id_cible':id_cible};
        sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages',chp_rev_source);
}
/*
  =====================================================================================================================
*/
function convertir_texte_en_rev(nom_zone_genere,nom_zone_source){
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_zone_genere);
    var startMicro = performance.now();
    var obj_texte = js_texte_convertit_texte_en_rev_racine(a.value,0);
    if(obj_texte.__xst === true){
        document.getElementById(nom_zone_source).value=obj_texte.__xva;
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
}
/*
  =====================================================================================================================
*/
function convertir_rev_en_texte(nom_zone_source,nom_zone_genere,id_source,id_cible){
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_zone_source);
    var startMicro = performance.now();
    var tableau1 = iterateCharacters2(a.value);
    global_messages.data.tableau=tableau1;
    var endMicro = performance.now();
    var startMicro = performance.now();
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    console.log('\n\n=============\nmise en tableau endMicro=',(parseInt((((endMicro - startMicro)) * 1000),10) / 1000) + ' ms');
    if(matriceFonction.__xst === true){
        var objTexte = convertir_tableau_rev_vers_texte_racine(matriceFonction.__xva,0,0);
        if(objTexte.__xst === true){
            document.getElementById(nom_zone_genere).value=objTexte.__xva;
        }else{
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',nom_zone_source);
        }
        var parametres_sauvegarde={'matrice':matriceFonction.__xva,'chp_provenance_rev':'source','chx_source_rev':id_source,'id_cible':id_cible};
        sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    }
}
/*
  =====================================================================================================================
*/
function traitement_apres_recuperation_ast_dans_zz_source_action(ret){
    __gi1.raz_des_messages();
    console.log('ret=',ret.__entree.opt);
    try{
        var startMicro = performance.now();
        var ast = JSON.parse(ret.__xva);
        var obj = TransformAstPhpEnRev(ast,0,false);
        if(obj.__xst === true){
         
         
            var tableau1 = iterateCharacters2('php(' + obj.__xva + ')');
            var matriceFonction = functionToArray2(tableau1.out,true,false,'');
            if(matriceFonction.__xst === true){
                var obj2 = arrayToFunct1(matriceFonction.__xva,true,false);
                if(obj2.__xst === true){
                    document.getElementById(ret.__entree.opt.nom_zone_rev).value=obj2.__xva;
                }else{
                    document.getElementById(ret.__entree.opt.nom_zone_rev).value='php(' + obj.__xva + ')';
                }
            }else{
                document.getElementById(ret.__entree.opt.nom_zone_rev).value='php(' + obj.__xva + ')';
            }
        }else{
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',ret.__entree.opt.nom_zone_genere);
        }
    }catch(e){
        astphp_logerreur({__xst:false,'__xme':'erreur de conversion du ast vers json 0409 ' + e.message + ' ' + JSON.stringify(e.stack).replace(/\\n/g,'\n<br />')});
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages',ret.__entree.opt.nom_zone_genere);
}
/*
  =====================================================================================================================
*/
function convertir_php_en_rev(zone_php,zone_rev){
    __gi1.raz_des_messages();
    var a = document.getElementById(zone_php);
    var startMicro = performance.now();
    try{
        var ret=recupereAstDePhp2(a.value,{'zone_php':zone_php,'zone_rev':zone_rev},traitement_apres_recuperation_ast_de_php2);
        console.log(ret);
/*     
        var ret = recupereAstDePhp(a.value,{'nom_zone_genere':nom_zone_genere,'nom_zone_rev':nom_zone_rev},traitement_apres_recuperation_ast_dans_zz_source_action);
        if(ret.__xst === true){
        }else{
            astphp_logerreur({__xst:false,__xme:'il y a une erreur d\'envoie du source php à convertir'});
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
            ret=false;
        }
*/        
    }catch(e){
        console.log('erreur transform 0178',e);
    }
}
/*
  =====================================================================================================================
*/
function convertir_html_en_rev(nom_zone_genere,nom_zone_source){
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_zone_genere);
    var startMicro = performance.now();
    var objRev = __module_html1.TransformHtmlEnRev(a.value,0);
    if(objRev.__xst === true){
     
        var tableau1 = iterateCharacters2(objRev.__xva);
        var matriceFonction = functionToArray2(tableau1.out,true,false,'');
        if(matriceFonction.__xst === true){
            var obj2 = arrayToFunct1(matriceFonction.__xva,true,false);
            if(obj2.__xst === true){
                document.getElementById(nom_zone_source).value=obj2.__xva;
            }else{
                document.getElementById(nom_zone_source).value=objRev.__xva;
            }
        }else{
            document.getElementById(nom_zone_source).value=objRev.__xva;
        }
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages',nom_zone_genere);
}
/*
  =====================================================================================================================
*/
function convertir_rev_en_html(nom_zone_source,nom_zone_genere,id_source,id_cible){
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_zone_source);
    var startMicro = performance.now();
    var tableau1 = iterateCharacters2(a.value);
    global_messages.data.tableau=tableau1;
    var endMicro = performance.now();
    console.log('\n\n=============\nmise en tableau endMicro=',(parseInt((((endMicro - startMicro)) * 1000),10) / 1000) + ' ms');
    var startMicro = performance.now();
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    if(matriceFonction.__xst === true){
        var objHtml = __module_html1.tabToHtml1(matriceFonction.__xva,0,false,0);
        if(objHtml.__xst === true){
            document.getElementById(nom_zone_genere).value=objHtml.__xva;
        }
        var parametres_sauvegarde={'matrice':matriceFonction.__xva,'chp_provenance_rev':'source','chx_source_rev':id_source,'id_cible':id_cible};
        sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    }else{
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
}
/*
  =====================================================================================================================
  convertir un textarea source rev et mettre le résultat dans un textarea php puis sauvegarder le rev en bdd
  =====================================================================================================================
*/
function convertir_rev_en_php_et_sauvegarde_rev(nom_zone_source_rev,nom_zone_genere_php,id_source,id_cible){
    var obj = __gi1.convertir_textearea_rev_vers_textarea_php(nom_zone_source_rev,nom_zone_genere_php);
    if(obj.__xst === true){
        var parametres_sauvegarde={'matrice':obj.__xva,'chp_provenance_rev':'source','chx_source_rev':id_source,'id_cible':id_cible};
        sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    }else{
        console.error('TODO');
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
}
/*
  =====================================================================================================================
*/
function supprimer_un_fichier_du_disque(nom_de_fichier_encrypte){
    __gi1.raz_des_messages();
    var ajax_param={'call':{lib:'core',file:'file',funct:'supprimer_un_fichier_avec_un_nom_encrypte'},file_name:nom_de_fichier_encrypte};
    async function supprimer_un_fichier_avec_un_nom_encrypte1(url="",ajax_param){
        return(__gi1.recupérer_un_fetch(url,ajax_param));
    }
    supprimer_un_fichier_avec_un_nom_encrypte1('za_ajax.php?supprimer_un_fichier_avec_un_nom_encrypte',ajax_param).then((donnees) => {
        if(donnees.__xst === true){
            document.location=String(document.location);
            return;
        }else{
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
        }
    });
}
/*
  =====================================================================================================================
*/
function lire_un_fichier_du_disque(nom_de_fichier_encrypte){
    __gi1.raz_des_messages();
    var ajax_param={'call':{lib:'core',file:'file',funct:'charger_un_fichier_avec_un_nom_encrypte'},file_name:nom_de_fichier_encrypte};
    async function charger_un_fichier_avec_un_nom_encrypte1(url="",ajax_param){
        return(__gi1.recupérer_un_fetch(url,ajax_param));
    }
    charger_un_fichier_avec_un_nom_encrypte1('za_ajax.php?charger_un_fichier_avec_un_nom_encrypte',ajax_param).then((donnees) => {
        if(donnees.__xst === true){
            document.getElementById('chp_genere_source').value=donnees.__xva;
        }else{
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
        }
    });
}