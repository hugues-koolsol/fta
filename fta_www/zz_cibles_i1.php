<?php
/*
  Ce fichier est inclus dans zz_cibles_a1.php quand on veut faire une copie de l'environnement fta dans ftb
*/
$time_start=microtime(true);
$tab=array(
    /*
      l'indice 1 des dossiers est la racine du projet.
      La ligne suivante doit être en premier 
      pour que le répertoire fta_inc/db/sqlite/ ait l'indice 2 dans la base clonée 
    */
    'fta_inc/db/sqlite/fta_structure.system.db.sql' => array(),
    /*
      la ligne suivante doit être en deuxième pour avoir l'indice 3 dans la base clonée
    */
    'fta_inc/sql/sql_1.php' => array(/**/
            'copier_tous_les_fichies_de_ce_repertoire' => true
        ),
    'fta_www/aa_include.php' => array(/**/
            'remplacer' => array(/**/
                    array(/**/
                            'a_remplacer_chaine' => 'define(\'APP_KEY\',\'fta\');',
                            'par' => 'define(\'APP_KEY\',\'ftb\');'
                        ),
                    array(/**/
                            'a_remplacer_chaine' => 'define("PREFIXE_REPERTOIRES","fta");',
                            'par' => 'define("PREFIXE_REPERTOIRES","fta");'
                        )
                )
        ),
    /*
      Quelques fichiers exemples qur la racine
    */
    'tictactoe.html' => array( 'dossier' => 1),
    'index.html' => array( 'dossier' => 1),
    'index.php' => array( 'dossier' => 1),
    'bidon.js' => array( 'dossier' => 1),
    'exemple.sql' => array( 'dossier' => 1),
    /*
      la suite des fichiers
    */
    'fta_inc/.htaccess' => array(),
    'fta_inc/.htaccess' => array(),
    'fta_inc/ajax/core/bdd.php' => array(),
    'fta_inc/ajax/core/file.php' => array(),
    'fta_inc/ajax/php/ast.php' => array(),
    'fta_inc/ajax/php/session.php' => array(),
    'fta_inc/ajax/php/travail_en_arriere_plan1.php' => array(),
    'fta_inc/db/__liste_des_acces_bdd.php' => array(),
    'fta_inc/phplib/mesBibliotheques.bat' => array(),
    'fta_inc/phplib/sqlite.php' => array(),
    'fta_inc/jslib/convertir_un_module.js' => array(),
    'fta_inc/jslib/convertir_un_script.js' => array(),
    'fta_inc/jslib/mes_bibliotheques.bat' => array(),
    'fta_inc/rev/test_factorielle.rev' => array(),
    'fta_inc/phplib/vendor/nikic/php-parser/lib/PhpParser/ParserAbstract.php' => array(),
    'fta_inc/phplib/vendor/nikic/php-parser/lib/PhpParser/Parser/Php8.php' => array(),
    'fta_www/.htaccess' => array(),
    'fta_www/6.css' => array(),
    'fta_www/aa_login.php' => array(),
    'fta_www/index.php' => array(),
    'fta_www/index_source.php' => array(),
    'fta_www/traiteHtml.php' => array(),
    'fta_www/traiteJs.php' => array(),
    'fta_www/traitePhp.php' => array(),
    'fta_www/traiteSql.php' => array(),
    'fta_www/za_ajax.php' => array(),
    'fta_www/zz_bdds_l1.php' => array(),
    'fta_www/zz_bdds_a1.php' => array(),
    'fta_www/zz_cibles_a1.php' => array(),
    'fta_www/zz_cibles_i1.php' => array(),
    'fta_www/zz_cibles_l1.php' => array(),
    'fta_www/zz_dossiers_l1.php' => array(),
    'fta_www/zz_dossiers_a1.php' => array(),
    'fta_www/zz_dossiers_c1.php' => array(),
    'fta_www/zz_sources_l1.php' => array(),
    'fta_www/zz_sources_a1.php' => array(),
    'fta_www/zz_revs_l1.php' => array(),
    'fta_www/zz_taches_a1.php' => array(),
    'fta_www/zz_taches_l1.php' => array(),
    'fta_www/zz_requetes_l1.php' => array(),
    'fta_www/zz_requetes_a1.php' => array(),
    'fta_www/svg_de_la_base.php' => array(),
    'fta_www/phpliteadmin.config.php' => array(),
    'fta_www/phpliteadmin.php' => array(),
//    'fta_www/js/c o n v e r t i t - j s - e n - r e v 1.js' => array(),
    'fta_www/js/convertion_sql_en_rev.js' => array(),
    'fta_www/js/convertit-php-en-rev0.js' => array(),
    'fta_www/js/core6.js' => array(),
    'fta_www/js/javascript.js' => array(),
    'fta_www/js/php.js' => array(),
    'fta_www/js/pour_zz_bdds_action1.js' => array(),
    'fta_www/js/pour_zz_source1.js' => array(),
    'fta_www/js/pour_svg.js' => array(),
    'fta_www/js/pour_requete_sql.js' => array(),
    'fta_www/js/module_conversion_ast_de_php_parser_vers_rev.js' => array(),
    'fta_www/js/module_conversion_ast_de_js_acorn_vers_rev.js' => array(),
    'fta_www/js/sql.js' => array(),
    'fta_www/js/texte.js' => array(),
    'fta_www/js/module_interface1.js' => array(),
    'fta_www/js/module_html.js' => array(),
    'fta_www/js/module_svg_bdd.js' => array(),
    'fta_www/js/module_requete_sql.js' => array(),
    'fta_www/js/module_travail_en_arriere_plan0.js' => array(),
    'fta_www/js/index_source_script-v0.js' => array(),
    /*https://github.com/codeschool/sqlite-parser*/
    'fta_www/js/jslib/sqlite-parser.js' => array(),
    'fta_www/js/jslib/Sortable.js' => array(),
    'fta_www/js/jslib/acorn.js' => array(),
    'fta_www/js/jslib/php-parser.js' => array()
);
$dossier_racine='../../ftb';
$indice_du_dossier=2;
/* le dossier 1 est celui de la racine */
$tableau_des_dossiers=array();
foreach($tab as $k1 => $v1){
    $dossier_cible=$dossier_racine . '/' . substr($k1,0,strrpos($k1,'/'));

    if($dossier_cible === '../../ftb/'){


    }else{


        if(!isset($tableau_des_dossiers[$dossier_cible])){

            $tableau_des_dossiers[$dossier_cible]=$indice_du_dossier;
            $indice_du_dossier++;

        }

        $tab[$k1]['dossier']=$tableau_des_dossiers[$dossier_cible];
    }

}
/* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tab , true ) . '</pre>' ; exit(0);*/
/* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tableau_des_dossiers , true ) . '</pre>' ; exit(0);*/
/* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tab , true ) . '</pre>' ; exit(0);*/
foreach($tab as $k1 => $v1){
    $contenu=file_get_contents('../' . $k1);

    if($contenu === false){

        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export(__LINE__,true) . '</pre>' ;
        exit(0);

    }

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $contenu , true ) . '</pre>' ; exit(0);*/

    if(isset($v1['remplacer'])){

        foreach($v1['remplacer'] as $k2 => $v2){

            if(isset($v2['a_remplacer_chaine'])){

                /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $v2 , true ) . '</pre>' ; exit(0);*/
                $contenu=str_replace($v2['a_remplacer_chaine'],$v2['par'],$contenu);
                /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( enti1($contenu) , true ) . '</pre>' ; exit(0);*/

            }else if(isset($v2['a_remplacer_preg'])){

                /*
                  $contenu=preg_replace($v2['a_remplacer_preg'],$v2['par'], $contenu);
                  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( enti1($contenu) , true ) . '</pre>' ; exit(0);
                  /*
                  
                  $text = '<p style="padding:0px;"><strong style="padding:0;margin:0;">hello</strong></p>';
                  
                  echo preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/si",'<$1$2>', $text);
                  
                  // <p><strong>hello</strong></p>            
                  
                */

            }

        }

    }


    if($k1 === 'fta_www/zz_cibles_a1.php'){

        /*
          la ligne suivante me permettait de supprimer des morceaux de code qui sont spécifiques à fta 
          mais ce n'est plus utilisé. Je la laisse car c'est un exemple utile d'expression régulière
        */
        $contenu=preg_replace('/\/\\*debut' . 'spécifiquefta\\*\/(.*?)\/\\*fin' . 'spécifiquefta\\*\//us','/* spécifique fta */',$contenu);
        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( enti1($contenu) , true ) . '</pre>' ; exit(0);*/

    }

    $dossier_cible=$dossier_racine . '/' . substr($k1,0,strrpos($k1,'/'));

    if(is_dir($dossier_cible)){

        /*
          le dossier existe déjà
        */

    }else{


        if(!mkdir($dossier_cible,0777,true)){

            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export(__LINE__,true) . ' impossible de créer le répertoire "' . $dossier_cible . '" </pre>' ;
            exit(0);

        }

    }

    $fichier_cible=$dossier_cible . substr($k1,strrpos($k1,'/'));

    if($fd=fopen($fichier_cible,'w')){


        if(fwrite($fd,$contenu)){

            fclose($fd);

        }else{

            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export(__LINE__,true) . ' fwrite a échoué sur ' . $k1 . '</pre>' ;
            exit(0);
        }


    }else{

        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export(__LINE__,true) . ' fopen a échoué sur ' . $k1 . '</pre>' ;
        exit(0);
    }


    if(isset($v1['copier_tous_les_fichies_de_ce_repertoire'])){

        $fichierSource='../' . $k1;
        $repertoire_source=substr($fichierSource,0,strrpos($fichierSource,'/'));
        $files=glob($repertoire_source . '/*',GLOB_MARK);
        foreach($files as $file){

            if(!is_dir($file)){

                $contenu=file_get_contents($file);
                $fichier_cible=$dossier_cible . substr($file,strrpos($file,'/'));

                if($fd=fopen($fichier_cible,'w')){


                    if(fwrite($fd,$contenu)){

                        fclose($fd);

                    }else{

                        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export(__LINE__,true) . ' fwrite a échoué sur ' . $k1 . '</pre>' ;
                        exit(0);
                    }


                }else{

                    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export(__LINE__,true) . ' fopen a échoué sur ' . $k1 . '</pre>' ;
                    exit(0);
                }


            }

        }

    }

}
$contenu_fichier_structure=file_get_contents('../fta_inc/db/sqlite/fta_structure.system.db.sql');
/* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . enti1( $contenu_fichier_structure ) . '</pre>' ; exit(0);*/

if($contenu_fichier_structure === false){

    echo __FILE__ . ' ' . __LINE__ . ' fichier structure introuvable = <pre>' . var_export(__LINE__,true) . '</pre>' ;
    exit(0);

}

/* on supprime la base systeme ftb */
$chemin_base_systeme=realpath($dossier_racine . '/fta_inc/db/sqlite/system.db');

if(is_file($chemin_base_systeme)){


    if(!unlink($chemin_base_systeme)){

        echo __FILE__ . ' ' . __LINE__ . ' unlink base system impossible = <pre>' . var_export(__LINE__,true) . '</pre>' ;
        exit(0);

    }


}else{

    /* la base n'existe pas, on continue */
}

/* echo __FILE__ . ' ' . __LINE__ . ' $chemin_base_systeme='.$chemin_base_systeme.' = $contenu_fichier_structure=<pre>' . var_export( $contenu_fichier_structure , true ) . '</pre>' ; exit(0);*/
$base_ftb=new SQLite3($chemin_base_systeme);

if(false === $base_ftb->exec($contenu_fichier_structure)){

    echo __FILE__ . ' ' . __LINE__ . ' erreur de création de la structure base system = <pre>' . var_export(__LINE__,true) . '</pre>' ;
    exit(0);

}

/* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/
/* donnees.system.db.sql*/
/* on récupère le contenu du champ chp_rev_travail_basedd de la base de fta pour le mettre dans la base ftb pour le dessin de la base */
sql_inclure_reference(26);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_26.php');
/*
SELECT 
`T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , 
`T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , 
`T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , 
`T2`.`chp_commentaire_cible`
 FROM b1.tbl_bdds T0
 LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd

 LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd

WHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd
 AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);

*/
/*sql_inclure_fin*/

$tt=sql_26(array( 'T0_chi_id_basedd' => 1, 'T0_chx_cible_id_basedd' => 1));

if($tt[__xst] === false || count($tt[__xva]) !== 1){

    echo __FILE__ . ' ' . __LINE__ . ' erreur de récupération du rev de la base = <pre>' . $tt[__xme] . '</pre>' ;
    exit(0);

}

$chp_rev_travail_basedd=$tt[__xva][0]['T0.chp_rev_travail_basedd'];
$contenu_initialisation="
    INSERT INTO `" . cst('tbl_cibles') . "`  ( 
      `" . cst('chi_id_cible') . "`          , 
      `" . cst('chp_nom_cible') . "`         , 
      `" . cst('chp_commentaire_cible') . "` , 
      `" . cst('chp_dossier_cible') . "`
    ) VALUES ('1','fta','la racine','ftb');
    
    INSERT INTO `" . cst('tbl_dossiers') . "`( 
      `" . cst('chi_id_dossier') . "`     , 
      `" . cst('chp_nom_dossier') . "`    , 
      `" . cst('chx_cible_dossier') . "`
    ) VALUES ('1','/','1');
    
    INSERT INTO `" . cst('tbl_bdds') . "`    ( 
      `" . cst('chi_id_basedd') . "`          , 
      `" . cst('chp_nom_basedd') . "`         ,
      `" . cst('chp_rev_basedd') . "`         ,
      `" . cst('chp_commentaire_basedd') . "` ,
      `" . cst('chx_dossier_id_basedd') . "`  , 
      `" . cst('chp_genere_basedd') . "`      , 
      `" . cst('chx_cible_id_basedd') . "`    ,
      `" . cst('chp_rev_travail_basedd') . "`    
    ) VALUES ('1','system.db','','initialisation','2','','1','" . sq0($chp_rev_travail_basedd) . "');
    INSERT INTO `" . cst('tbl_utilisateurs') . "` ( 
      `" . cst('chi_id_utilisateur') . "`, 
      `" . cst('chp_nom_de_connexion_utilisateur') . "`, 
      `" . cst('chp_mot_de_passe_utilisateur') . "`, 
      `" . cst('chp_commentaire_utilisateur') . "`
    ) VALUES ('1','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','mdp = admin');
   ";

if(false === $base_ftb->exec($contenu_initialisation)){

    echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export(__LINE__,true) . '</pre>' ;
    exit(0);

}

/* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/
$contenu_table_dossiers='';
foreach($tableau_des_dossiers as $k1 => $v1){
    /* le dossier racine est déjà créé */

    if(substr($k1,strlen('../../ftb')) !== '/'){

        $contenu_table_dossiers .= ",('" . $v1 . "','" . substr($k1,strlen('../../ftb')) . "','1')";

    }

}

if($contenu_table_dossiers !== ''){

    $contenu_table_dossiers=substr($contenu_table_dossiers,1);
    $contenu_table_dossiers='INSERT INTO `' . cst('tbl_dossiers') . '`( `' . cst('chi_id_dossier') . '`, `' . cst('chp_nom_dossier') . '`, `' . cst('chx_cible_dossier') . '`) VALUES ' . $contenu_table_dossiers;
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $contenu_table_dossiers , true ) . '</pre>' ; exit(0);*/

    if(false === $base_ftb->exec($contenu_table_dossiers)){

        echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export(__LINE__,true) . '</pre>' ;
        exit(0);

    }


}else{

    echo __FILE__ . ' ' . __LINE__ . ' problème sur le contenu des dossiers = <pre>' . var_export(__LINE__,true) . '</pre>' ;
    exit(0);
}

$contenu_table_sources='';
foreach($tab as $k1 => $v1){

    if($v1['dossier'] === 1){


        if(isset($v1['chp_type_source'])){

            $contenu_table_sources .= ",('" . $k1 . "','1','" . $v1['dossier'] . "' , '" . $v1['chp_type_source'] . "')\r\n";

        }else{

            $contenu_table_sources .= ",('" . $k1 . "','1','" . $v1['dossier'] . "' , 'normal')\r\n";
        }


    }else{


        if(isset($v1['chp_type_source'])){

            $contenu_table_sources .= ",('" . substr($k1,strrpos($k1,'/') + 1) . "','1','" . $v1['dossier'] . "' , '" . $v1['chp_type_source'] . "')\r\n";

        }else{

            $contenu_table_sources .= ",('" . substr($k1,strrpos($k1,'/') + 1) . "','1','" . $v1['dossier'] . "' , 'normal')\r\n";
        }

    }

}
/* echo __FILE__ . ' ' . __LINE__ . ' $contenu_table_sources = <pre>' . var_export( $contenu_table_sources , true ) . '</pre>' ; exit(0);*/

if($contenu_table_sources !== ''){

    $contenu_table_sources=substr($contenu_table_sources,1);
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . enti1( $contenu_table_sources ) . '</pre>' ; exit(0);*/
    $contenu_table_sources='INSERT INTO `' . cst('tbl_sources') . '`( `' . cst('chp_nom_source') . '` , `' . cst('chx_cible_id_source') . '`, `' . cst('chx_dossier_id_source') . '` , `' . cst('chp_type_source') . '` ) VALUES ' . $contenu_table_sources;
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . enti1( $contenu_table_sources ) . '</pre>' ; exit(0);*/

    if(false === $base_ftb->exec($contenu_table_sources)){

        echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export(__LINE__,true) . '</pre>' ;
        exit(0);

    }


}

/*
  on doit prendre les requetes sql de la table requetes de fta pour les mettre dans ftb
  la base $base_ftb pointe par défaut sur la base dans ftb
  il faut une référence sur la base fta
  
*/
$ret0=$base_ftb->exec($GLOBALS[BDD][1]['initialisation']);
$sql_insere_requetes='INSERT INTO `' . cst('tbl_requetes') . '` SELECT * FROM `' . $GLOBALS[BDD][1]['nom_bdd'] . '`.`' . cst('tbl_requetes') . '` WHERE `' . cst('chx_cible_requete') . '`=1';

if(false === $base_ftb->exec($sql_insere_requetes)){

    echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export(__LINE__,true) . '</pre>' ;
    exit(0);

}

$chemin_fichier_acces_pour_bdd=realpath($dossier_racine . '/fta_inc/db/__liste_des_acces_bdd.php');
$texte_chemin_base='INCLUDE_PATH.DIRECTORY_SEPARATOR.\'db\'.DIRECTORY_SEPARATOR.\'sqlite\'.DIRECTORY_SEPARATOR.\'system.db';
$contenu_fichier_acces_pour_bdd='';
$contenu_fichier_acces_pour_bdd .= '<' . '?php' . PHP_EOL;
$contenu_fichier_acces_pour_bdd .= '$GLOBALS[BDD][1]=array(' . PHP_EOL;
$contenu_fichier_acces_pour_bdd .= ' \'id\'             => 1,' . PHP_EOL;
$contenu_fichier_acces_pour_bdd .= ' \'nom_bdd\'        => \'system.db\',' . PHP_EOL;
$contenu_fichier_acces_pour_bdd .= ' \'fournisseur\'    => \'sqlite\',' . PHP_EOL;
$contenu_fichier_acces_pour_bdd .= ' \'initialisation\' => \'attach database "\'.' . $texte_chemin_base . '" as `system.db`;pragma journal_mode=WAL;pragma foreign_keys=ON;\',' . PHP_EOL;
$contenu_fichier_acces_pour_bdd .= ' \'lien\' => null,' . PHP_EOL;
$contenu_fichier_acces_pour_bdd .= ');' . PHP_EOL;

if($fd=fopen($chemin_fichier_acces_pour_bdd,'w')){


    if(fwrite($fd,$contenu_fichier_acces_pour_bdd)){

        fclose($fd);

    }else{

        echo __FILE__ . ' ' . __LINE__ . ' erreur ecriture $contenu_fichier_acces_pour_bdd' ;
        exit(0);
    }


}else{

    echo __FILE__ . ' ' . __LINE__ . ' erreur ouverture $contenu_fichier_acces_pour_bdd' ;
    exit(0);
}

$time_end=microtime(true);
$time=((int)((($time_end - $time_start) * 1000) * 1000)) / 1000;
ajouterMessage('succes',__LINE__ . ' 👍 les fichiers ont été copiés (' . $time . ' ms)',BNF);
recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);