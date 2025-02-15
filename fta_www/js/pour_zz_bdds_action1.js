'use strict';
function comparer_deux_tableaux_de_bases_sqlite(par){
    console.log('dans comparer_deux_tableaux_de_bases_sqlite');
    __gi1.raz_des_messages();
    import('./module_svg_bdd.js').then((Module) => {
            /*
              on utilise ce module pour afficher une comparaison des tableaux tables/champs
            */
            __module_svg1=new Module.module_svg_bdd('__module_svg1',null);
            __module_svg1.afficher_resultat_comparaison_base_physique_et_base_virtuelle(par);
        });
    /* ✍ console.log(tables); */
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
}
function bdd_convertir_rev_en_sql(nom_zone_source,nom_zone_genere,id_bdd,id_cible){
    __gi1.raz_des_messages();
    var a=document.getElementById(nom_zone_source);
    var startMicro=performance.now();
    var tableau1=__m_rev1.txt_en_tableau(a.value);
    var endMicro=performance.now();
    console.log('\n\n=============\nmise en tableau endMicro=',(parseInt((endMicro - startMicro) * 1000,10) / 1000) + ' ms');
    var startMicro=performance.now();
    var matriceFonction=functionToArray2(tableau1.out,true,false,'');
    if(matriceFonction.__xst === true){
        var objSql=__m_rev_vers_sql1.c_tab_vers_js(matriceFonction.__xva,{});
        if(objSql.__xst === true){
            var contenu=objSql.__xva.replace(/\/\* ==========DEBUT DEFINITION=========== \*\//g,'');
            document.getElementById(nom_zone_genere).value=contenu;
        }
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
        var parametres_sauvegarde={"matrice" : matriceFonction.__xva ,"chp_provenance_rev" : 'bdd' ,"id_cible" : id_cible ,"chx_source_rev" : id_bdd};
        sauvegarder_format_rev_en_dbb(parametres_sauvegarde);
    }else{
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
    }
}
/*
  =====================================================================================================================
*/
function sauvegarder_format_rev_en_dbb(parametres_sauvegarde){
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'bdd' ,"funct" : 'sauvegarder_format_rev_en_dbb'} ,
        "parametres_sauvegarde" : parametres_sauvegarde
    };
    async function sauvegarder_format_rev_en_dbb1(url="",ajax_param){
        return(__gi1.recupérer_un_fetch(url,ajax_param));
    }
    sauvegarder_format_rev_en_dbb1('za_ajax.php?sauvegarder_format_rev_en_dbb1',ajax_param).then((donnees) => {
            if(donnees.__xst === true){
                logerreur({"__xst" : true ,"__xme" : 'le format rev a été sauvegardé'});
            }else{
                logerreur({"__xst" : false ,"__xme" : 'erreur dans la sauvegarde du format rev'});
                console.log('donnees=',donnees);
            }
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
        });
    return({"__xst" : true});
}