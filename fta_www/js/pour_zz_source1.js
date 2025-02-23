"use strict";
/*
  =====================================================================================================================
*/
function convertir_rev_en_sql( chp_rev_source , chp_genere_source , id_source , id_cible ){
    __gi1.raz_des_messages();
    var a=document.getElementById( chp_rev_source );
    /*
      var tableau1=__m_rev1.txt_en_tableau(a.value);
      var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
    */
    var matriceFonction=__m_rev1.rev_tm( a.value );
    if(matriceFonction.__xst === __xsu){
        var objSql=__m_rev_vers_sql1.c_tab_vers_js( matriceFonction.__xva , {} );
        if(objSql.__xst === __xsu){
            document.getElementById( chp_genere_source ).value=objSql.__xva;
        }
        var parametres_sauvegarde={"matrice" : matriceFonction.__xva ,"chp_provenance_rev" : 'source' ,"chx_source_rev" : id_source ,"id_cible" : id_cible};
        sauvegarder_format_rev_en_dbb( parametres_sauvegarde );
    }
}
/*
  =====================================================================================================================
*/
function convertir_sqlite_en_rev( chp_rev_source , chp_genere_source ){
    var source_sqlite=document.getElementById( chp_genere_source ).value;
    /* var obj=convertion_texte_sql_en_rev(source_sqlite); */
    source_sqlite=source_sqlite.replace( /\/\*\*\//g , '' );
    var ast=window.sqliteParser( source_sqlite , {} );
    var obj=__m_astsqliteparseur_vers_rev1.traite_ast_de_sqliteparseur( ast );
    if(obj.__xst === __xsu){
        document.getElementById( chp_rev_source ).value=obj.__xva;
    }else{
        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'Erreur de convertion'} );
    }
    __gi1.remplir_et_afficher_les_messages1( '' );
}
/*
  =====================================================================================================================
*/
async function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant( id_source , contenuRev , contenuSource , date_de_debut_traitement , matrice ){
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant'} ,
        "id_source" : id_source ,
        "rev" : contenuRev ,
        "source" : contenuSource ,
        "date_de_debut_traitement" : date_de_debut_traitement ,
        "matrice" : matrice
    };
    async function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant1( 'za_ajax.php?sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant1' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                var date_de_fin_traitement=new Date();
                date_de_fin_traitement=date_de_fin_traitement.getTime();
                var date_de_debut_traitement=donnees.__entree.date_de_debut_traitement;
                var nombre_de_secondes=(date_de_fin_traitement - date_de_debut_traitement) / 1000;
                if(donnees.__entree.parametres_sauvegarde.nom_du_source){
                    __m_rev1.empiler_erreur( {
                            "__xst" : __xsu ,
                            "__xme" : 'la réécriture de ' + donnees.__entree.parametres_sauvegarde.nom_du_source + ' a été faite en ' + nombre_de_secondes + ' secondes'
                        } );
                }else{
                    __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : 'la réécriture du fichier a été faite en ' + nombre_de_secondes + ' secondes'} );
                }
            }else{
                console.log( donnees );
            }
            __gi1.remplir_et_afficher_les_messages1( '' );
        } );
}
/*
  =====================================================================================================================
*/
function traitement_apres_ajax_pour_conversion_fichier_sql( par ){
    /* var objRev=convertion_texte_sql_en_rev(par.contenu_du_fichier); */
    var source_sqlite=par.contenu_du_fichier.replace( /\/\*\*\//g , '' );
    var ast=window.sqliteParser( source_sqlite , {} );
    var objRev=__m_astsqliteparseur_vers_rev1.traite_ast_de_sqliteparseur( ast );
    if(objRev.__xst === __xsu){
        /*
          var tableau1=__m_rev1.txt_en_tableau(objRev.__xva);
          var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
        */
        var matriceFonction=__m_rev1.rev_tm( objRev.__xva );
        if(matriceFonction.__xst === __xsu){
            var objSql=__m_rev_vers_sql1.c_tab_vers_js( matriceFonction.__xva , {} );
            if(objSql.__xst === __xsu){
                var contenu=objSql.__xva.replace( /\/\* ==========DEBUT DEFINITION=========== \*\//g , '' );
                sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant( par.__entree.id_source , objRev.__xva , contenu , par.__entree.date_de_debut_traitement , matriceFonction.__xva );
            }
        }
    }
}
/*
  =====================================================================================================================
*/
function bouton_dans_zz_source_a1_transform_js_en_rev_avec_acorn3( chp_genere_source , chp_rev_source ){
    __gi1.raz_des_messages();
    var a=document.getElementById( chp_genere_source );
    var parseur_javascript=window.acorn.Parser;
    try{
        tabComment=[];
        /* on transforme le javascript en ast */
        var obj=parseur_javascript.parse( a.value , {"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : false ,"onComment" : tabComment} );
        /* on transforme le ast en rev */
        var obj=__m_astjs_vers_rev1.traite_ast( obj.body , tabComment , {} );
        if(obj.__xst === __xsu){
            document.getElementById( chp_rev_source ).value=obj.__xva;
            /*
              var tableau1=__m_rev1.txt_en_tableau(obj.__xva);
              var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
            */
            var matriceFonction=__m_rev1.rev_tm( obj.__xva );
            if(matriceFonction.__xst === __xsu){
                var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
                if(obj2.__xst === __xsu){
                    document.getElementById( chp_rev_source ).value=obj2.__xva;
                }
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur rev'} );
            }
        }else{
            __gi1.remplir_et_afficher_les_messages1( 'txtar1' );
        }
    }catch(e){
        /* console.error('e=',e); */
        if(e.pos){
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '0115 erreur dans un source javascript' ,"plage" : [e.pos,e.pos]} );
        }else{
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '0117 erreur dans un source javascript'} );
        }
        __gi1.remplir_et_afficher_les_messages1( 'chp_genere_source' );
    }
}
/*
  =====================================================================================================================
*/
function sauvegarder_html_en_ligne( format_rev , donnees ){
    /*
      var tableau1=__m_rev1.txt_en_tableau(format_rev);
      var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
    */
    var matriceFonction=__m_rev1.rev_tm( format_rev );
    if(matriceFonction.__xst === __xer){
        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '0128 erreur sauvegarder_html_en_ligne'} );
        return({"__xst" : __xer ,"__xme" : '0129 erreur sauvegarder_html_en_ligne'});
    }
    var obj2=__module_html1.tabToHtml1( matriceFonction.__xva , 0 , false , 0 );
    if(obj2.__xst === __xsu){
        sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant( donnees.__entree.id_source , format_rev , obj2.__xva , donnees.__entree.date_de_debut_traitement , matriceFonction.__xva );
        return({"__xst" : __xsu});
    }else{
        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '0143 erreur sauvegarder_html_en_ligne'} );
        __gi1.remplir_et_afficher_les_messages1( '' );
    }
}
/*
  =====================================================================================================================
*/
function sauvegarder_js_en_ligne2( format_rev , donnees ){
    var objJs=__m_rev_vers_js1.c_rev_vers_js( format_rev , {} );
    if(objJs.__xst === __xsu){
        sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant( donnees.__entree.id_source , format_rev , objJs.__xva , donnees.__entree.date_de_debut_traitement , objJs.matriceFonction );
        return({"__xst" : __xsu});
    }else{
        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '0195 erreur sauvegarder_js_en_ligne'} );
        __gi1.remplir_et_afficher_les_messages1( '' );
    }
}
/*
  =====================================================================================================================
*/
function sauvegarder_php_en_ligne2( format_rev , donnees ){
    var objPhp=__m_rev_vers_php1.c_rev_vers_php( format_rev , {} );
    if(objPhp.__xst === __xsu){
        sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant( donnees.__entree.id_source , format_rev , objPhp.__xva , donnees.__entree.date_de_debut_traitement , objPhp.matriceFonction );
        return({"__xst" : __xsu});
    }else{
        return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '0182 erreur pour_zz_source'} ));
    }
}
/*
  =====================================================================================================================
*/
function zz_l1_convertir_un_source_js_sur_disque3( id_source ){
    __gi1.raz_des_messages();
    var date_de_debut_traitement=new Date();
    date_de_debut_traitement=date_de_debut_traitement.getTime();
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'charger_un_fichier_source_par_son_identifiant'} ,
        "id_source" : id_source ,
        "date_de_debut_traitement" : date_de_debut_traitement
    };
    async function charger_un_fichier_source_par_son_identifiant1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    charger_un_fichier_source_par_son_identifiant1( 'za_ajax.php?charger_un_fichier_source_par_son_identifiant' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                var nom_source=donnees.db['T0.chp_nom_source'];
                var type_source=donnees.db['T0.chp_type_source'];
                if(nom_source.substr( nom_source.length - 3 ) === '.js'){
                    var parseur_javascript=window.acorn.Parser;
                    try{
                        var tabComment=[];
                        /* on transforme le javascript en ast */
                        var obj=parseur_javascript.parse( donnees.contenu_du_fichier , {"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : false ,"onComment" : tabComment} );
                        /* on transforme le ast en rev */
                        var obj=__m_astjs_vers_rev1.traite_ast( obj.body , tabComment , {} );
                        if(obj.__xst === __xsu){
                            var parametres={"__entree" : {"id_source" : donnees.db['T0.chi_id_source'] ,"date_de_debut_traitement" : date_de_debut_traitement}};
                            var obj2=sauvegarder_js_en_ligne2( obj.__xva , parametres );
                        }else{
                            __gi1.remplir_et_afficher_les_messages1( 'txtar1' );
                        }
                    }catch(e){
                        /* console.error('e=',e); */
                        if(e.pos){
                            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : nl1( e ) + 'erreur convertit_source_javascript_en_rev 3441' ,"plage" : [e.pos,e.pos]} );
                        }else{
                            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : nl1( e ) + ' ' + e.message} );
                        }
                    }
                }
            }else{
                console.log( donnees );
            }
            __gi1.remplir_et_afficher_les_messages1( '' );
        } );
}
/*
  =====================================================================================================================
  convertir un php avec php_parser
*/
function zz_l1_convertir_un_source_php_sur_disque3( id_source ){
    __gi1.raz_des_messages();
    var date_de_debut_traitement=new Date();
    date_de_debut_traitement=date_de_debut_traitement.getTime();
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'charger_un_fichier_source_par_son_identifiant'} ,
        "id_source" : id_source ,
        "date_de_debut_traitement" : date_de_debut_traitement
    };
    async function charger_un_fichier_source_par_son_identifiant1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    charger_un_fichier_source_par_son_identifiant1( 'za_ajax.php?charger_un_fichier_source_par_son_identifiant' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                var nom_source=donnees.db['T0.chp_nom_source'];
                var type_source=donnees.db['T0.chp_type_source'];
                if(nom_source.substr( nom_source.length - 4 ) === '.php'){
                    var parseur=window.PhpParser.Engine( {"parser" : {"extractDoc" : true} ,"ast" : {"withPositions" : true}} );
                    try{
                        let regex=/\/\*sql_inclure_deb[\s\S]*?sql_inclure_fin\*\//g;
                        let php_moins_commentaires_sql=donnees.contenu_du_fichier.replace( regex , '' );
                        var ast_de_php=parseur.parseCode( php_moins_commentaires_sql );
                        var obj=__m_astphpparseur_vers_rev1.traite_ast( ast_de_php , {"en_ligne" : true} );
                        if(obj.__xst === __xsu){
                            var parametres={"__entree" : {"id_source" : donnees.db['T0.chi_id_source'] ,"date_de_debut_traitement" : date_de_debut_traitement}};
                            var obj2=sauvegarder_php_en_ligne2( obj.__xva , parametres );
                        }else{
                            __gi1.remplir_et_afficher_les_messages1( 'txtar1' );
                        }
                    }catch(e){
                        if(e.hasOwnProperty( 'lineNumber' )){
                            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'Il y a une erreur dans le source php "" ' ,"ligne" : e.lineNumber} );
                        }else{
                            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'Il y a une erreur dans le source php '} );
                        }
                    }
                }
            }else{
                console.log( donnees );
            }
            __gi1.remplir_et_afficher_les_messages1( '' );
        } );
}
/*
  =====================================================================================================================
*/
function zz_l1_convertir_un_source_sur_disque( id_source ){
    __gi1.raz_des_messages();
    var date_de_debut_traitement=new Date();
    date_de_debut_traitement=date_de_debut_traitement.getTime();
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'charger_un_fichier_source_par_son_identifiant'} ,
        "id_source" : id_source ,
        "date_de_debut_traitement" : date_de_debut_traitement
    };
    async function charger_un_fichier_source_par_son_identifiant1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    charger_un_fichier_source_par_son_identifiant1( 'za_ajax.php?charger_un_fichier_source_par_son_identifiant' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                var nom_source=donnees.db['T0.chp_nom_source'];
                var type_source=donnees.db['T0.chp_type_source'];
                /* traitement des html ou des sql */
                if(nom_source.substr( nom_source.length - 5 ) === '.html' || nom_source.substr( nom_source.length - 4 ) === '.htm'){
                    /* ✍traitement_apres_ajax_pour_conversion_fichier_html(donnees); */
                    var obj=__module_html1.TransformHtmlEnRev( donnees.contenu_du_fichier , 0 , {"en_ligne" : true ,"donnees" : donnees} );
                }else if(nom_source.substr( nom_source.length - 4 ) === '.sql'){
                    traitement_apres_ajax_pour_conversion_fichier_sql( donnees );
                }
            }else{
                console.log( donnees );
            }
            __gi1.remplir_et_afficher_les_messages1( '' );
        } );
}
/*
  =====================================================================================================================
*/
function convertir_texte_en_rev( nom_zone_genere , nom_zone_source ){
    __gi1.raz_des_messages();
    var a=document.getElementById( nom_zone_genere );
    var startMicro=performance.now();
    var obj_texte=js_texte_convertit_texte_en_rev_racine( a.value , 0 );
    if(obj_texte.__xst === __xsu){
        document.getElementById( nom_zone_source ).value=obj_texte.__xva;
    }
    __gi1.remplir_et_afficher_les_messages1( '' );
}
/*
  =====================================================================================================================
*/
function convertir_rev_en_texte( nom_zone_source , nom_zone_genere , id_source , id_cible ){
    __gi1.raz_des_messages();
    var a=document.getElementById( nom_zone_source );
    /*
      var tableau1=__m_rev1.txt_en_tableau(a.value);
      var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
    */
    var matriceFonction=__m_rev1.rev_tm( a.value );
    if(matriceFonction.__xst === __xsu){
        var objTexte=convertir_tableau_rev_vers_texte_racine( matriceFonction.__xva , 0 , 0 );
        if(objTexte.__xst === __xsu){
            document.getElementById( nom_zone_genere ).value=objTexte.__xva;
        }else{
            __gi1.remplir_et_afficher_les_messages1( nom_zone_source );
        }
        var parametres_sauvegarde={"matrice" : matriceFonction.__xva ,"chp_provenance_rev" : 'source' ,"chx_source_rev" : id_source ,"id_cible" : id_cible};
        sauvegarder_format_rev_en_dbb( parametres_sauvegarde );
    }
}
/*
  =====================================================================================================================
*/
function traitement_apres_recuperation_ast_dans_zz_source_action( ret ){
    __gi1.raz_des_messages();
    console.log( 'ret=' , ret.__entree.opt );
    try{
        var startMicro=performance.now();
        var ast=JSON.parse( ret.__xva );
        var obj=TransformAstPhpEnRev( ast , 0 , null , false );
        if(obj.__xst === __xsu){
            /*
              var tableau1=__m_rev1.txt_en_tableau('php(' + obj.__xva + ')');
              var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
            */
            var matriceFonction=__m_rev1.rev_tm( 'php(' + obj.__xva + ')' );
            debugger;
            if(matriceFonction.__xst === __xsu){
                var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
                if(obj2.__xst === __xsu){
                    document.getElementById( ret.__entree.opt.nom_zone_rev ).value=obj2.__xva;
                }else{
                    document.getElementById( ret.__entree.opt.nom_zone_rev ).value='php(' + obj.__xva + ')';
                }
            }else{
                document.getElementById( ret.__entree.opt.nom_zone_rev ).value='php(' + obj.__xva + ')';
            }
        }else{
            __gi1.remplir_et_afficher_les_messages1( ret.__entree.opt.nom_zone_genere );
        }
    }catch(e){
        __m_rev1.empiler_erreur( {
                "__xst" : __xer ,
                "__xme" : 'erreur de conversion du ast vers json 0409 ' + e.message + ' ' + JSON.stringify( e.stack ).replace( /\\n/g , '\n<br />' )
            } );
    }
    __gi1.remplir_et_afficher_les_messages1( ret.__entree.opt.nom_zone_genere );
}
/*
  =====================================================================================================================
*/
function convertir_html_en_rev( nom_zone_genere , nom_zone_source ){
    __gi1.raz_des_messages();
    var a=document.getElementById( nom_zone_genere );
    var startMicro=performance.now();
    var objRev=__module_html1.TransformHtmlEnRev( a.value , 0 );
    if(objRev.__xst === __xsu){
        /*
          var tableau1=__m_rev1.txt_en_tableau(objRev.__xva);
          var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
        */
        var matriceFonction=__m_rev1.rev_tm( objRev.__xva );
        if(matriceFonction.__xst === __xsu){
            var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
            if(obj2.__xst === __xsu){
                document.getElementById( nom_zone_source ).value=obj2.__xva;
            }else{
                document.getElementById( nom_zone_source ).value=objRev.__xva;
            }
        }else{
            document.getElementById( nom_zone_source ).value=objRev.__xva;
        }
    }
    __gi1.remplir_et_afficher_les_messages1( nom_zone_genere );
}
/*
  =====================================================================================================================
*/
function convertir_rev_en_html( nom_zone_source , nom_zone_genere , id_source , id_cible ){
    __gi1.raz_des_messages();
    var a=document.getElementById( nom_zone_source );
    /*
      var tableau1=__m_rev1.txt_en_tableau(a.value);
      var matriceFonction=functionToArray2(tableau1.__xva,true,false,'');
    */
    var matriceFonction=__m_rev1.rev_tm( a.value );
    if(matriceFonction.__xst === __xsu){
        var objHtml=__module_html1.tabToHtml1( matriceFonction.__xva , 0 , false , 0 );
        if(objHtml.__xst === __xsu){
            document.getElementById( nom_zone_genere ).value=objHtml.__xva;
        }
        var parametres_sauvegarde={"matrice" : matriceFonction.__xva ,"chp_provenance_rev" : 'source' ,"chx_source_rev" : id_source ,"id_cible" : id_cible};
        sauvegarder_format_rev_en_dbb( parametres_sauvegarde );
    }else{
    }
    __gi1.remplir_et_afficher_les_messages1( '' );
}
/*
  =====================================================================================================================
*/
function supprimer_un_fichier_du_disque( nom_de_fichier_encrypte ){
    __gi1.raz_des_messages();
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'supprimer_un_fichier_avec_un_nom_encrypte'} ,
        "file_name" : nom_de_fichier_encrypte
    };
    async function supprimer_un_fichier_avec_un_nom_encrypte1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    supprimer_un_fichier_avec_un_nom_encrypte1( 'za_ajax.php?supprimer_un_fichier_avec_un_nom_encrypte' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                document.location=String( document.location );
                return;
            }else{
                __gi1.remplir_et_afficher_les_messages1( '' );
            }
        } );
}
/*
  =====================================================================================================================
*/
function lire_un_fichier_du_disque( nom_de_fichier_encrypte ){
    __gi1.raz_des_messages();
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'charger_un_fichier_avec_un_nom_encrypte'} ,
        "file_name" : nom_de_fichier_encrypte
    };
    async function charger_un_fichier_avec_un_nom_encrypte1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    charger_un_fichier_avec_un_nom_encrypte1( 'za_ajax.php?charger_un_fichier_avec_un_nom_encrypte' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                document.getElementById( 'chp_genere_source' ).value=donnees.__xva;
            }else{
                __gi1.remplir_et_afficher_les_messages1( '' );
            }
        } );
}