<?php
/*
  =====================================================================================================================
*/

function ecrire_le_php_de_la_requete_sur_disque($id_requete,$source_php_requete){

    $repertoire_destination=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'sql';
    $nom_fichier=$repertoire_destination . DIRECTORY_SEPARATOR . 'sql_' . $id_requete . '.php';

    if($fd=fopen($nom_fichier,'w')){


        if(fwrite($fd,'<?' . 'php' . PHP_EOL . $source_php_requete)){

            fclose($fd);

        }else{

            return array( __xst => false, __xme => 'erreur ecriture fichier sql_' . $id_requete . '.php');
        }


    }else{

        return array( __xst => false, __xme => 'erreur ouverture fichier sql_' . $id_requete . '.php');
    }

    sql_inclure_reference(6);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_6.php');
    /*
    SELECT 
    `T0`.`chi_id_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , `T0`.`cht_matrice_requete`
     FROM b1.tbl_requetes T0
    WHERE (`T0`.`chx_cible_requete` = :T0_chx_cible_requete)
     ORDER BY  `T0`.`chi_id_requete`  ASC;

    */
    /*sql_inclure_fin*/
    
    $retour_sql=sql_6(array( 'T0_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
    /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $retour_sql , true ) . '</pre>' ; exit(0);*/

    if($retour_sql[__xst] === true){

        $chaine_js='';
        foreach($retour_sql[__xva] as $k1 => $v1){
            $chaine_js .= PHP_EOL . '"' . $v1['T0.chi_id_requete'] . '":' . json_encode($v1['T0.cht_sql_requete']) . ',';
        }
        $nom_bref='aa_js_sql_cible_' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . '.js';
        $nom_fichier=$repertoire_destination . DIRECTORY_SEPARATOR . $nom_bref;

        if($fd=fopen($nom_fichier,'w')){


            if(fwrite($fd,'//<![CDATA[' . PHP_EOL . '__aa_js_sql={' . PHP_EOL . $chaine_js . PHP_EOL . '};' . PHP_EOL . '//]]>')){

                fclose($fd);

            }else{

                @fclose($fd);
                return array( __xst => false, __xme => 'erreur ecriture fichier ' . $nom_bref);
            }


        }else{

            return array( __xst => false, __xme => 'erreur ouverture fichier ' . $nom_bref);
        }


    }else{

        return array( __xst => false, __xme => $retour_sql[__xme]);
    }

    return array( __xst => true);

}
/*
  =====================================================================================================================
*/

function modifier_la_requete_en_base(&$data){

    sql_inclure_reference(9);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_9.php');
    /*
    
    UPDATE b1.tbl_requetes SET `chp_type_requete` = :n_chp_type_requete , `cht_rev_requete` = :n_cht_rev_requete , `cht_sql_requete` = :n_cht_sql_requete , `cht_php_requete` = :n_cht_php_requete , `cht_matrice_requete` = :n_cht_matrice_requete , `cht_commentaire_requete` = :n_cht_commentaire_requete
    WHERE (`chi_id_requete` = :c_chi_id_requete
     AND `chx_cible_requete` = :c_chx_cible_requete) ;

    */
    /*sql_inclure_fin*/
    
    $a_modifier=array(
        'c_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
        'c_chi_id_requete' => $data[__entree]['id_requete'],
        'n_chp_type_requete' => $data[__entree]['type'],
        'n_cht_rev_requete' => $data[__entree]['rev'],
        'n_cht_sql_requete' => $data[__entree]['sql'],
        'n_cht_php_requete' => $data[__entree]['php'],
        'n_cht_matrice_requete' => json_encode($data[__entree]['tableau_rev_requete']),
        'n_cht_commentaire_requete' => $data[__entree]['cht_commentaire_requete']
    );
    $tt=sql_9($a_modifier);

    if($tt[__xst] === true){

        $data[__xst]=true;
        ecrire_le_php_de_la_requete_sur_disque($data[__entree]['id_requete'],$data[__entree]['php']);

    }else{

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' erreur modifier_la_requete_en_base ' . $tt[__xme];
        $data[__xst]=false;
    }

    $data[__entree]['parametres_sauvegarde']=array(
        'id_cible' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
        /* 'bdd' , 'source' , 'sql' */
        'chp_provenance_rev' => 'sql',
        /* id de la source */
        'chx_source_rev' => $data[__entree]['id_requete'],
        'matrice' => $data[__entree]['tableau_rev_requete']
    );
    $ret=sauvegarder_format_rev_en_dbb($data);

}
/*
  =====================================================================================================================
*/

function enregistrer_la_requete_en_base(&$data){

    sql_inclure_reference(7);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_7.php');
    /*
    
    INSERT INTO b1.`tbl_requetes`(
        `chx_cible_requete` , 
        `chp_type_requete` , 
        `cht_rev_requete` , 
        `cht_sql_requete` , 
        `cht_php_requete` , 
        `cht_commentaire_requete`
    ) VALUES (
        :chx_cible_requete , 
        :chp_type_requete , 
        :cht_rev_requete , 
        :cht_sql_requete , 
        :cht_php_requete , 
        :cht_commentaire_requete
    );

    */
    /*sql_inclure_fin*/
    
    $a_inserer=array( array(
                'chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
                'chp_type_requete' => $data[__entree]['type'],
                'cht_rev_requete' => $data[__entree]['rev'],
                'cht_sql_requete' => $data[__entree]['sql'],
                'cht_php_requete' => $data[__entree]['php'],
                'cht_commentaire_requete' => $data[__entree]['cht_commentaire_requete']
            ));
    $tt=sql_7($a_inserer);

    if($tt[__xst] === true){

        $data[__xst]=true;
        $data['nouvel_id']=$tt['nouvel_id'];
        /*
          lors de la création dans l'interface, l'id est égal à 0 ou bien nnn si on part d'une requête existante
        */
        $nouveau_php=str_replace('function sql_' . $data[__entree]['id_courant'] . '(','function sql_' . $data['nouvel_id'] . '(',$data[__entree]['php']);
        sql_inclure_reference(35);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_35.php');
        /*
        
        UPDATE b1.tbl_requetes SET `cht_php_requete` = :n_cht_php_requete
        WHERE (`chi_id_requete` = :c_chi_id_requete
         AND `chx_cible_requete` = :c_chx_cible_requete) ;

        */
        /*sql_inclure_fin*/
        
        $tt35=sql_35(array(/**/
            'c_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
            'c_chi_id_requete' => $data['nouvel_id'],
            'n_cht_php_requete' => $nouveau_php
        ));

        if($tt35[__xst] === true){

            ecrire_le_php_de_la_requete_sur_disque($data['nouvel_id'],$nouveau_php);

        }


    }else{

        $data[__xst]=false;
    }

    $data[__entree]['parametres_sauvegarde']=array(
        'id_cible' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
        /* 'bdd' , 'source' , 'sql' */
        'chp_provenance_rev' => 'sql',
        /* id de la source */
        'chx_source_rev' => $data['nouvel_id'],
        'matrice' => $data[__entree]['tableau_rev_requete']
    );
    $ret=sauvegarder_format_rev_en_dbb($data);

}
/*
  =====================================================================================================================
*/

function creer_la_base_a_partir_du_shema_sur_disque(&$data){

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
    
    $tt=sql_26(array(/**/
        'T0_chi_id_basedd' => $data[__entree]['id_bdd_de_la_base'],
        'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    ));

    if($tt[__xst] === false || count($tt[__xva]) !== 1){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_la_base_a_partir_du_shema_sur_disque bdd non trouvée';
        return;

    }

    $ret0=$tt[__xva][0];
    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$ret0='.var_export( $ret0 , true ) .PHP_EOL.PHP_EOL); fclose($fd);}
    */
    $chemin_bdd='..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . $ret0['T2.chp_dossier_cible'] . $ret0['T1.chp_nom_dossier'] . DIRECTORY_SEPARATOR . $ret0['T0.chp_nom_basedd'];
    $repertoire=realpath(dirname($chemin_bdd));
    $chemin_bdd=$repertoire . DIRECTORY_SEPARATOR . $ret0['T0.chp_nom_basedd'];

    if(is_file($chemin_bdd)){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_la_base_a_partir_du_shema_sur_disque le fichier bdd existe déjà';
        return;

    }

    $db1temp=new SQLite3($chemin_bdd);
    $ret1=$db1temp->exec('BEGIN TRANSACTION;');

    if($ret1 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_la_base_a_partir_du_shema_sur_disque BEGIN transaction KO';
        return;

    }

    $ret1=$db1temp->exec($data[__entree]['source_sql_de_la_base']);

    if($ret1 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_la_base_a_partir_du_shema_sur_disque création base impossible';
        $db1temp->close();
        sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
        return;

    }

    $ret1=$db1temp->exec('COMMIT;');
    $data[__xst]=true;

}
/*
  =====================================================================================================================
*/

function reecrire_la_base_a_partir_du_shema_sur_disque(&$data){

    /*
      if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export($data,true) .PHP_EOL.PHP_EOL); fclose($fdtoto);}
    */
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
    
    $tt=sql_26(array(/**/
        'T0_chi_id_basedd' => $data[__entree]['id_bdd_de_la_base'],
        'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    ));

    if($tt[__xst] === false || count($tt[__xva]) !== 1){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' reecrire_la_base_a_partir_du_shema_sur_disque bdd non trouvée';
        return;

    }

    $ret0=$tt[__xva][0];
    $chemin_bdd='..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . $ret0['T2.chp_dossier_cible'] . $ret0['T1.chp_nom_dossier'] . DIRECTORY_SEPARATOR . $ret0['T0.chp_nom_basedd'];
    $repertoire=realpath(dirname($chemin_bdd));
    $chemin_bdd=$repertoire . DIRECTORY_SEPARATOR . $ret0['T0.chp_nom_basedd'];

    if(!is_file($chemin_bdd)){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' reecrire_la_base_a_partir_du_shema_sur_disque fichier de bdd non trouvé';
        return;

    }

    $chemin_bdd_base_temporaire=$repertoire . DIRECTORY_SEPARATOR . 'temporaire_' . md5(date('Y-m-d-H-i-s')) . '.db_temporaire';
    $db1temp=new SQLite3($chemin_bdd_base_temporaire);
    $ret1=$db1temp->exec('BEGIN TRANSACTION;');

    if($ret1 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' reecrire_la_base_a_partir_du_shema_sur_disque BEGIN transaction KO';
        return;

    }

    $ret1=$db1temp->exec($data[__entree]['source_sql_de_la_base']);

    if($ret1 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' reecrire_la_base_a_partir_du_shema_sur_disque création base temporaire impossible';
        $db1temp->close();
        sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
        return;

    }

    $ret1=$db1temp->exec('COMMIT;');
    $sql2='ATTACH DATABASE \'' . sq0($chemin_bdd) . '\' as \'source\';';
    $ret2=$db1temp->exec($sql2);

    if($ret2 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' reecrire_la_base_a_partir_du_shema_sur_disque attach impossible';
        $db1temp->close();
        sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
        return;

    }

    foreach($data[__entree]['liste_des_tables'] as $k1 => $v1){
        $sql3='INSERT INTO `' . sq0($v1) . '` SELECT * FROM `source`.`' . sq0($v1) . '`';
        /*
          if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql3='.$sql3 .PHP_EOL.PHP_EOL); fclose($fd);}
        */
        $ret3=$db1temp->exec($sql3);

        if($ret3 !== true){

            $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' reecrire_la_base_a_partir_du_shema_sur_disque, les donnees de ' . $v1 . ' ne peuvent être copiées';
            $db1temp->close();
            sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
            return;

        }

    }
    /*
      il faut supprimer les connexions aux bases;
    */
    $db1temp->close();

    if(isset($GLOBALS[BDD][$data[__entree]['id_bdd_de_la_base']])){

        $GLOBALS[BDD][$data[__entree]['id_bdd_de_la_base']][LIEN_BDD]->close();

    }


    if(sauvegarder_et_supprimer_fichier($chemin_bdd,false)){


        if((@rename($chemin_bdd_base_temporaire,$chemin_bdd))){

            $data[__xst]=true;

        }


    }


}
/*
  =====================================================================================================================
*/

function recuperer_les_bases_de_la_cible_en_cours(&$data){

    sql_inclure_reference(27);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_27.php');
    /*
    SELECT 
    `T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , 
    `T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , 
    `T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , 
    `T2`.`chp_commentaire_cible`
     FROM b1.tbl_bdds T0
     LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd
    
     LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd
    
    WHERE `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd;

    */
    /*sql_inclure_fin*/
    
    $tt=sql_27(array(/**/
        'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    ));

    if($tt[__xst] === false){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' recuperer_les_bases bdd non trouvée';
        return;

    }

    $data[__xva]=$tt[__xva];
    $data[__xst]=true;

}
/*
  =====================================================================================================================
*/

function recuperer_les_tableaux_des_bases(&$data){

    /*
      source_base_sql        : obj3.__xst,
      id_bdd_de_la_base      : id_bdd_de_la_base_en_cours,
    */
    require_once(INCLUDE_PATH . '/phplib/sqlite.php');
    $obj=comparer_une_base_physique_et_une_base_virtuelle($data[__entree]['id_bdd_de_la_base'],$data[__entree]['source_base_sql']);

    if($obj[__xst] === true){

        $data[__xva]=$obj[__xva];
        $id_bdd_de_la_base=$data[__entree]['id_bdd_de_la_base'];
        $data[__xst]=true;

    }else{

        $data[__xme]='erreur sur recuperer_les_tableaux_des_bases';
    }


}
/*
  =====================================================================================================================
*/

function supprimer_en_bdd_l_index(&$data){

    operation_sur_base($data,'supprimer_en_bdd_l_index');

}
/*
  =====================================================================================================================
*/

function ajouter_en_bdd_l_index(&$data){

    operation_sur_base($data,'ajouter_en_bdd_l_index');

}
/*
  =====================================================================================================================
*/

function ajouter_en_bdd_le_champ(&$data){

    operation_sur_base($data,'ajouter_en_bdd_le_champ');

}
/*
  =====================================================================================================================
*/

function supprimer_table_dans_base(&$data){

    operation_sur_base($data,'supprimer_table_dans_base');

}
/*
  =====================================================================================================================
*/

function operation_sur_base(&$data,$nom_operation){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $data[__entree] , true) .PHP_EOL.PHP_EOL); fclose($fd);}
    */
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
    
    $tt=sql_26(array(/**/
        'T0_chi_id_basedd' => $data[__entree]['id_bdd_de_la_base'],
        'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    ));

    if($tt[__xst] === false || count($tt[__xva]) !== 1){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' reecrire_la_base_a_partir_du_shema_sur_disque bdd non trouvée';
        return;

    }

    $ret0=$tt[__xva][0];
    $chemin_bdd='../../' . $ret0['T2.chp_dossier_cible'] . $ret0['T1.chp_nom_dossier'] . '/' . $ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);

    if(!is_file($chemin_bdd)){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ' . $nom_operation . ' fichier de bdd non trouvé';
        return;

    }

    $db1=new SQLite3($chemin_bdd);
    $ret0=$db1->exec('BEGIN TRANSACTION;');

    if($ret0 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ' . $nom_operation . ' BEGIN transaction KO';
        return;

    }

    /*error_reporting(0);*/
    /*$db1->enableExceptions(true);*/
    $ret1=$db1->exec($data[__entree]['source_sql']);

    if($ret1 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ' . $nom_operation . ' impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $retfin=$db1->exec('COMMIT;');

    if($retfin !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ' . $nom_operation . ' COMMIT impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $data[__xst]=true;

}
/*
  =====================================================================================================================
*/

function creer_table_dans_base(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data=' . $data[__entree]['source_sql'] . PHP_EOL.PHP_EOL); fclose($fd);}
      if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $GLOBALS[BDD] , true) .PHP_EOL.PHP_EOL); fclose($fd);}
    */
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
    
    $tt=sql_26(array(/**/
        'T0_chi_id_basedd' => $data[__entree]['id_bdd_de_la_base'],
        'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    ));

    if($tt[__xst] === false || count($tt[__xva]) !== 1){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_table_dans_base bdd non trouvée';
        return;

    }

    $ret0=$tt[__xva][0];
    $chemin_bdd='../../' . $ret0['T2.chp_dossier_cible'] . $ret0['T1.chp_nom_dossier'] . '/' . $ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);

    if(!is_file($chemin_bdd)){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_table_dans_base fichier de bdd non trouvé';
        return;

    }

    $db1=new SQLite3($chemin_bdd);
    $ret0=$db1->exec('BEGIN TRANSACTION;');

    if($ret0 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_table_dans_base BEGIN transaction KO';
        return;

    }

    $ret1=$db1->exec($data[__entree]['source_sql']);

    if($ret1 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_table_dans_base création table temporaire impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $retfin=$db1->exec('COMMIT;');

    if($retfin !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' creer_table_dans_base COMMIT impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $data[__xst]=true;

}
/*
  =====================================================================================================================
*/

function ordonner_les_champs_de_table(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input]='.var_export( $data[__entree] , true ) .PHP_EOL.PHP_EOL); fclose($fd);}
    */
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
    
    $tt=sql_26(array(/**/
        'T0_chi_id_basedd' => $data[__entree]['id_bdd_de_la_base'],
        'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    ));

    if($tt[__xst] === false || count($tt[__xva]) !== 1){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table bdd non trouvée';
        return;

    }

    $ret0=$tt[__xva][0];
    $chemin_bdd='../../' . $ret0['T2.chp_dossier_cible'] . $ret0['T1.chp_nom_dossier'] . '/' . $ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);

    if(!is_file($chemin_bdd)){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table fichier de bdd non trouvé';
        return;

    }

    $db1=new SQLite3($chemin_bdd);
    $ret0=$db1->exec('BEGIN TRANSACTION;');

    if($ret0 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table BEGIN transaction KO';
        return;

    }

    $ret1=$db1->exec($data[__entree]['chaine_create_table']);

    if($ret1 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table création table temporaire impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $sql2='INSERT INTO ' . $data[__entree]['nom_table_temporaire'] . '(' . $data[__entree]['ordre_modifie'] . ') SELECT ' . $data[__entree]['ordre_modifie'] . ' FROM ' . $data[__entree]['nom_de_la_table'] . ';';
    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql2='.$sql2.PHP_EOL.PHP_EOL); fclose($fd);}
    */
    $ret2=$db1->exec($sql2);

    if($ret2 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table insertion des données impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $sql3='DROP TABLE ' . $data[__entree]['nom_de_la_table'] . ';';
    $ret3=$db1->exec($sql3);

    if($ret3 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table DROP TABLE impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $sql4='ALTER TABLE  ' . $data[__entree]['nom_table_temporaire'] . ' RENAME TO ' . $data[__entree]['nom_de_la_table'] . ' ;';
    $ret4=$db1->exec($sql4);

    if($ret4 !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table RENAME impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    foreach($data[__entree]['tab_des_index_sql'] as $k1 => $sql5){
        $ret5=$db1->exec($sql5);

        if($ret5 !== true){

            $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table RENAME impossible';
            $ret0=$db1->exec('ROLLBACK;');
            return;

        }

    }
    $retfin=$db1->exec('COMMIT;');

    if($retfin !== true){

        $data[__xms][]=__FILE__ . ' ' . __LINE__ . ' ordonner_les_champs_de_table COMMIT impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $data[__xst]=true;

}
/*
  =====================================================================================================================
*/

function envoyer_le_rev_de_le_base_en_post(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input]='.var_export( $data[__entree] , true ).PHP_EOL.PHP_EOL); fclose($fd);}
    */
    sql_inclure_reference(10);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_10.php');
    /*
    
    UPDATE b1.tbl_bdds SET `chp_rev_travail_basedd` = :n_chp_rev_travail_basedd
    WHERE (`chi_id_basedd` = :c_chi_id_basedd
     AND `chx_cible_id_basedd` = :c_chx_cible_id_basedd) ;

    */
    /*sql_inclure_fin*/
    
    $a_modifier=array(/**/
        'n_chp_rev_travail_basedd' => $data[__entree]['source_rev_de_la_base'],
        'c_chi_id_basedd' => $data[__entree]['id_bdd_de_la_base'],
        'c_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    );
    $tt=sql_10($a_modifier);

    if($tt[__xst] === true){

        $data[__xst]=true;

    }else{

        $data[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' Erreur sur la sauvegarde de la base';
        $data[__xst]=false;
    }


}
/*
  =====================================================================================================================
*/

function recuperer_zone_travail_pour_les_bases(&$data){

    sql_inclure_reference(11);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_11.php');
    /*
    SELECT 
    `T0`.`chi_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_travail_basedd`
     FROM b1.tbl_bdds T0
    WHERE (/ *  * / `T0`.`chi_id_basedd` IN (:les_id_des_bases)
     AND `T0`.`chx_cible_id_basedd` = :chx_cible_id_basedd);

    */
    /*sql_inclure_fin*/
    
    $a_selectionner=array(/**/
        'les_id_des_bases' => $data[__entree]['les_id_des_bases'],
        'chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
    );
    $tt=sql_11($a_selectionner);

    if($tt[__xst] === true){

        /*
          if($fd=fopen('toto.txt','a')){fwrite($fd,PHP_EOL.PHP_EOL.'===================='.PHP_EOL.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$tt[valeur]='.var_export( $tt[__xva] , true ).PHP_EOL.PHP_EOL); fclose($fd);}
        */
        $data[__xva]=$tt[__xva];
        $data[__xst]=true;

    }else{

        $data[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' Erreur select ' . $db->lastErrorMsg();
        $data[__xst]=false;
    }


}
/*
  =====================================================================================================================
*/

function sauvegarder_format_rev_en_dbb(&$data){

    /*
      $data[__entree]['parametres_sauvegarde']=array(
      'id_cible'           => id_cible           ,
      'chp_provenance_rev' => chp_provenance_rev , // 'bdd' , '	source' , 'sql'
      'chx_source_rev'     => chx_source_rev     , // id de la source
      'matrice'            => matrice            ,
      )
      
    */
    /*
      if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input][parametres_sauvegarde]='.var_export($data[__entree]['parametres_sauvegarde'],true).PHP_EOL); fclose($fdtoto);}
    */
    sql_inclure_reference(5);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_5.php');
    /*
    
    DELETE FROM b1.tbl_revs
    WHERE (`chx_cible_rev` = :chx_cible_rev
      
     AND `chp_provenance_rev` = :chp_provenance_rev
      
     AND `chx_source_rev` = :chx_source_rev) ;

    */
    /*sql_inclure_fin*/
    
    $a_supprimer=array(/**/
        'chx_cible_rev' => $data[__entree]['parametres_sauvegarde']['id_cible'],
        'chp_provenance_rev' => $data[__entree]['parametres_sauvegarde']['chp_provenance_rev'],
        'chx_source_rev' => $data[__entree]['parametres_sauvegarde']['chx_source_rev']
    );
    $tt=sql_5($a_supprimer);

    if($tt[__xst] !== true){

        $data[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' Erreur sur suppression dans la table rev ';
        $data[__xst]=false;

    }

    $a_sauvegarder=array();
    for($i=0;$i < count($data[__entree]['parametres_sauvegarde']['matrice']);$i++){
        $tab=$data[__entree]['parametres_sauvegarde']['matrice'][$i];
        /*
          14 champs pour le rev + id_cible + chp_provenance_rev + chx_source_rev
        */
        $a_sauvegarder[]=array(
            'chx_cible_rev' => $data[__entree]['parametres_sauvegarde']['id_cible'],
            'chp_provenance_rev' => $data[__entree]['parametres_sauvegarde']['chp_provenance_rev'],
            'chx_source_rev' => $data[__entree]['parametres_sauvegarde']['chx_source_rev'],
            'chp_id_rev' => $tab[0],
            'chp_valeur_rev' => $tab[1],
            'chp_type_rev' => $tab[2],
            'chp_niveau_rev' => $tab[3],
            'chp_quotee_rev' => $tab[4],
            'chp_pos_premier_rev' => $tab[5],
            'chp_pos_dernier_rev' => $tab[6],
            'chp_parent_rev' => $tab[7],
            'chp_nbr_enfants_rev' => $tab[8],
            'chp_num_enfant_rev' => $tab[9],
            'chp_profondeur_rev' => $tab[10],
            'chp_pos_ouver_parenthese_rev' => $tab[11],
            'chp_pos_fermer_parenthese_rev' => $tab[12],
            'chp_commentaire_rev' => $tab[13]
        );
    }
    sql_inclure_reference(12);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_12.php');
    /*
    
    INSERT INTO b1.`tbl_revs`(
        `chx_cible_rev` , 
        `chp_provenance_rev` , 
        `chx_source_rev` , 
        `chp_id_rev` , 
        `chp_valeur_rev` , 
        `chp_type_rev` , 
        `chp_niveau_rev` , 
        `chp_quotee_rev` , 
        `chp_pos_premier_rev` , 
        `chp_pos_dernier_rev` , 
        `chp_parent_rev` , 
        `chp_nbr_enfants_rev` , 
        `chp_num_enfant_rev` , 
        `chp_profondeur_rev` , 
        `chp_pos_ouver_parenthese_rev` , 
        `chp_pos_fermer_parenthese_rev` , 
        `chp_commentaire_rev`
    ) VALUES (
        :chx_cible_rev , 
        :chp_provenance_rev , 
        :chx_source_rev , 
        :chp_id_rev , 
        :chp_valeur_rev , 
        :chp_type_rev , 
        :chp_niveau_rev , 
        :chp_quotee_rev , 
        :chp_pos_premier_rev , 
        :chp_pos_dernier_rev , 
        :chp_parent_rev , 
        :chp_nbr_enfants_rev , 
        :chp_num_enfant_rev , 
        :chp_profondeur_rev , 
        :chp_pos_ouver_parenthese_rev , 
        :chp_pos_fermer_parenthese_rev , 
        :chp_commentaire_rev
    );

    */
    /*sql_inclure_fin*/
    
    $tt=sql_12($a_sauvegarder);

    if($tt[__xst] !== true){

        $data[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' Erreur sur insertion';

    }else{


        if($GLOBALS[__mode_traque]){

            $data[__xms][]=basename(__FILE__) . ' ' . __LINE__ . ' la matrice est en bdd';

        }

        $data[__xst]=true;
    }


}