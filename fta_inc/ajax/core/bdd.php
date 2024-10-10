<?php



/*
  =====================================================================================================================
*/
function ecrire_le_php_de_la_requete_sur_disque($id_requete,$source_php_requete){
    $repertoire_destination=INCLUDE_PATH.DIRECTORY_SEPARATOR.'sql';

    $nom_fichier=$repertoire_destination.DIRECTORY_SEPARATOR.'sql_'.$id_requete.'.php';


    if($fd=fopen($nom_fichier,'w')){

/*
        if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$nom_fichier='.var_export( $nom_fichier , true ) .CRLF.CRLF); fclose($fdtoto);}
*/
        if(fwrite($fd,'<?'.'php'.PHP_EOL.$source_php_requete)){

            fclose($fd);

        }
    }
 
}
/*
  =====================================================================================================================
*/
function modifier_la_requete_en_base(&$data){

    sql_inclure_reference(9);
    // sql_inclure_deb
    require_once(INCLUDE_PATH.'/sql/sql_9.php');
    // sql_inclure_fin
    $a_modifier=array(
          'c_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
          'c_chi_id_requete' => $data['input']['id_requete'],
          'n_chp_type_requete' => $data['input']['type'],
          'n_cht_rev_requete' => $data['input']['rev'],
          'n_cht_sql_requete' => $data['input']['sql'],
          'n_cht_php_requete' => $data['input']['php'],
          'n_cht_matrice_requete' => json_encode($data['input']['tableau_rev_requete']),
          'n_cht_commentaire_requete' => $data['input']['cht_commentaire_requete'],
    );
    
    $tt=sql_9($a_modifier);
    if($tt['statut']===true){
        $data['status']='OK';
        ecrire_le_php_de_la_requete_sur_disque($data['input']['id_requete'],$data['input']['php']);
            
        
        
    }else{
        $data['messages'][]=__FILE__.' '.__LINE__.' modifier_la_requete_en_base '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg();
        $data['status']='KO';
    }
    
    $data['input']['parametres_sauvegarde']=array(
        'id_cible'           => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
        'chp_provenance_rev' => 'sql'                                  , // 'bdd' , '	source' , 'sql'
        'chx_source_rev'     => $data['input']['id_requete']           , // id de la source
        'matrice'            => $data['input']['tableau_rev_requete']  ,
    );
    
    $ret=sauvegarder_format_rev_en_dbb($data);
    
}


/*
  =====================================================================================================================
*/
function enregistrer_la_requete_en_base(&$data){



    sql_inclure_reference(7);
    // sql_inclure_deb
    require_once(INCLUDE_PATH.'/sql/sql_7.php');
    // sql_inclure_fin
    $a_inserer=array(
         array(
          'chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
          'chp_type_requete' => $data['input']['type'],
          'cht_rev_requete' => $data['input']['rev'],
          'cht_sql_requete' => $data['input']['sql'],
          'cht_php_requete' => $data['input']['php'],
          'cht_commentaire_requete' => $data['input']['cht_commentaire_requete'],
         )
    );
    $tt=sql_7($a_inserer);
    if($tt['statut']===true){
        $data['status']='OK';
        $data['nouvel_id']=$tt['nouvel_id'];
        /*
         lors de la création dans l'interface, l'id est égal à 0 ou bien nnn si on part d'une requête existante
        */
        $nouveau_php=str_replace( 'function sql_'.$data['input']['id_courant'].'(' , 'function sql_'.$data['nouvel_id'].'(' , $data['input']['php'] );
        sql_inclure_reference(35);
        // sql_inclure_deb
        require_once(INCLUDE_PATH.'/sql/sql_35.php');
        // sql_inclure_fin
        $tt35=sql_35(array(
              'c_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
              'c_chi_id_requete' => $data['nouvel_id'],
              'n_cht_php_requete' => $nouveau_php,
        ));
        if($tt35['statut']===true){
         
            ecrire_le_php_de_la_requete_sur_disque($data['nouvel_id'],$nouveau_php);
         
        }
    }else{
     $data['status']='KO';
    }

    $data['input']['parametres_sauvegarde']=array(
        'id_cible'           => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
        'chp_provenance_rev' => 'sql'                                  , // 'bdd' , '	source' , 'sql'
        'chx_source_rev'     => $data['nouvel_id']                     , // id de la source
        'matrice'            => $data['input']['tableau_rev_requete']  ,
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
    /*sql_inclure_fin*/

    $tt=sql_26(array(
        'T0_chi_id_basedd'           => $data['input']['id_bdd_de_la_base'] ,
        'T0_chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    ));

    if($tt['statut'] === false || count($tt['valeur'])!==1){
        $data['messages'][]=__FILE__.' '.__LINE__.' creer_la_base_a_partir_du_shema_sur_disque bdd non trouvée';
        return;
     
    }  


    $ret0=$tt['valeur'][0];
    
    
    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$ret0='.var_export( $ret0 , true ) .CRLF.CRLF); fclose($fd);}
    */
    $chemin_bdd='..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].DIRECTORY_SEPARATOR.$ret0['T0.chp_nom_basedd'];
    $repertoire=realpath(dirname($chemin_bdd));
    $chemin_bdd=$repertoire.DIRECTORY_SEPARATOR.$ret0['T0.chp_nom_basedd'];

    if(is_file($chemin_bdd)){

        $data['messages'][]=__FILE__.' '.__LINE__.' creer_la_base_a_partir_du_shema_sur_disque le fichier bdd existe déjà';
        return;

    }

    $db1temp=new SQLite3($chemin_bdd);
    $ret1=$db1temp->exec('BEGIN TRANSACTION;');

    if($ret1 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' creer_la_base_a_partir_du_shema_sur_disque BEGIN transaction KO';
        return;

    }

    $ret1=$db1temp->exec($data['input']['source_sql_de_la_base']);

    if($ret1 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' creer_la_base_a_partir_du_shema_sur_disque création base impossible';
        $db1temp->close();
        sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
        return;

    }

    $ret1=$db1temp->exec('COMMIT;');
    $data['status']='OK';

}
/*
  =====================================================================================================================
*/

function reecrire_la_base_a_partir_du_shema_sur_disque(&$data){

    sql_inclure_reference(26);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_26.php');
    /*sql_inclure_fin*/

    $tt=sql_26(array(
        'T0_chi_id_basedd'           => $data['input']['id_bdd_de_la_base'] ,
        'T0_chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    ));

    if($tt['statut'] === false || count($tt['valeur'])!==1){
        $data['messages'][]=__FILE__.' '.__LINE__.' reecrire_la_base_a_partir_du_shema_sur_disque bdd non trouvée';
        return;
     
    }  


    $ret0=$tt['valeur'][0];



    
    $chemin_bdd='..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].DIRECTORY_SEPARATOR.$ret0['T0.chp_nom_basedd'];
    $repertoire=realpath(dirname($chemin_bdd));
    $chemin_bdd=$repertoire.DIRECTORY_SEPARATOR.$ret0['T0.chp_nom_basedd'];

    if(!is_file($chemin_bdd)){

        $data['messages'][]=__FILE__.' '.__LINE__.' reecrire_la_base_a_partir_du_shema_sur_disque fichier de bdd non trouvé';
        return;

    }

    $chemin_bdd_base_temporaire=$repertoire.DIRECTORY_SEPARATOR.'temporaire_'.md5(date('Y-m-d-H-i-s')).'.db_temporaire';
    $db1temp=new SQLite3($chemin_bdd_base_temporaire);
    $ret1=$db1temp->exec('BEGIN TRANSACTION;');

    if($ret1 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' reecrire_la_base_a_partir_du_shema_sur_disque BEGIN transaction KO';
        return;

    }

    $ret1=$db1temp->exec($data['input']['source_sql_de_la_base']);

    if($ret1 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' reecrire_la_base_a_partir_du_shema_sur_disque création base temporaire impossible';
        $db1temp->close();
        sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
        return;

    }

    $ret1=$db1temp->exec('COMMIT;');
    $sql2='ATTACH DATABASE \''.sq0($chemin_bdd).'\' as \'source\';';
    $ret2=$db1temp->exec($sql2);

    if($ret2 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' reecrire_la_base_a_partir_du_shema_sur_disque attach impossible';
        $db1temp->close();
        sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
        return;

    }

    foreach($data['input']['liste_des_tables'] as $k1 => $v1){
        $sql3='INSERT INTO `'.sq0($v1).'` SELECT * FROM `source`.`'.sq0($v1).'`';
/*        
          if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql3='.$sql3 .CRLF.CRLF); fclose($fd);}
*/        
        $ret3=$db1temp->exec($sql3);

        if($ret3 !== true){

            $data['messages'][]=__FILE__.' '.__LINE__.' reecrire_la_base_a_partir_du_shema_sur_disque, les donnees de '.$v1.' ne peuvent être copiées';
            $db1temp->close();
            sauvegarder_et_supprimer_fichier($chemin_bdd_base_temporaire,true);
            return;

        }

    }
    $GLOBALS[BDD][BDD_1][LIEN_BDD]->close();
    $db1temp->close();
    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$chemin_bdd='.$chemin_bdd .CRLF.CRLF); fclose($fd);}
    */

    if(sauvegarder_et_supprimer_fichier($chemin_bdd,false)){


        if(@rename($chemin_bdd_base_temporaire,$chemin_bdd)){

            $data['status']='OK';

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
    /*sql_inclure_fin*/

    $tt=sql_27(array(
        'T0_chx_cible_id_basedd'   => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
    ));

    if($tt['statut'] === false){
        $data['messages'][]=__FILE__.' '.__LINE__.' recuperer_les_bases bdd non trouvée';
        return;
     
    }  


    $data['valeurs']=$tt['valeur'];
    
    
    
    $data['status']='OK';

}
/*
  =====================================================================================================================
*/

function recuperer_les_tableaux_des_bases(&$data){

    /*
      source_base_sql        : obj3.status,
      id_bdd_de_la_base      : id_bdd_de_la_base_en_cours,
    */
    require_once(INCLUDE_PATH.'/phplib/sqlite.php');
    $obj=comparer_une_base_physique_et_une_base_virtuelle($data['input']['id_bdd_de_la_base'],$data['input']['source_base_sql']);

    if($obj['status'] === true){

        $data['value']=$obj['value'];
        $id_bdd_de_la_base=$data['input']['id_bdd_de_la_base'];
        $data['status']='OK';

    }else{

        $data['message']='erreur sur recuperer_les_tableaux_des_bases';
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
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $data['input'] , true) .CRLF.CRLF); fclose($fd);}
    */    
    sql_inclure_reference(26);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_26.php');
    /*sql_inclure_fin*/

    $tt=sql_26(array(
        'T0_chi_id_basedd'           => $data['input']['id_bdd_de_la_base'] ,
        'T0_chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    ));

    if($tt['statut'] === false || count($tt['valeur'])!==1){
        $data['messages'][]=__FILE__.' '.__LINE__.' reecrire_la_base_a_partir_du_shema_sur_disque bdd non trouvée';
        return;
     
    }  


    $ret0=$tt['valeur'][0];
    
    
    $chemin_bdd='../../'.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].'/'.$ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);

    if(!is_file($chemin_bdd)){

        $data['messages'][]=__FILE__.' '.__LINE__.' '.$nom_operation.' fichier de bdd non trouvé';
        return;

    }

    $db1=new SQLite3($chemin_bdd);
    $ret0=$db1->exec('BEGIN TRANSACTION;');

    if($ret0 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' '.$nom_operation.' BEGIN transaction KO';
        return;

    }
    //error_reporting(0);
    //$db1->enableExceptions(true);

    $ret1=$db1->exec($data['input']['source_sql']);

    if($ret1 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' '.$nom_operation.' impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $retfin=$db1->exec('COMMIT;');

    if($retfin !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' '.$nom_operation.' COMMIT impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $data['status']='OK';

}
/*
  =====================================================================================================================
*/

function creer_table_dans_base(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data=' . $data['input']['source_sql'] . CRLF.CRLF); fclose($fd);}
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $GLOBALS[BDD] , true) .CRLF.CRLF); fclose($fd);}
    */
    
    sql_inclure_reference(26);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_26.php');
    /*sql_inclure_fin*/

    $tt=sql_26(array(
        'T0_chi_id_basedd'           => $data['input']['id_bdd_de_la_base'] ,
        'T0_chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    ));

    if($tt['statut'] === false || count($tt['valeur'])!==1){
        $data['messages'][]=__FILE__.' '.__LINE__.' creer_table_dans_base bdd non trouvée';
        return;
     
    }  


    $ret0=$tt['valeur'][0];

    
    
    $chemin_bdd='../../'.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].'/'.$ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);

    if(!is_file($chemin_bdd)){

        $data['messages'][]=__FILE__.' '.__LINE__.' creer_table_dans_base fichier de bdd non trouvé';
        return;

    }

    $db1=new SQLite3($chemin_bdd);
    $ret0=$db1->exec('BEGIN TRANSACTION;');

    if($ret0 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' creer_table_dans_base BEGIN transaction KO';
        return;

    }

    $ret1=$db1->exec($data['input']['source_sql']);

    if($ret1 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' creer_table_dans_base création table temporaire impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $retfin=$db1->exec('COMMIT;');

    if($retfin !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' creer_table_dans_base COMMIT impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $data['status']='OK';

}
/*
  =====================================================================================================================
*/

function ordonner_les_champs_de_table(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input]='.var_export( $data['input'] , true ) .CRLF.CRLF); fclose($fd);}
    */
    $db0=new SQLite3(INCLUDE_PATH.'/db/sqlite/system.db');

    sql_inclure_reference(26);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_26.php');
    /*sql_inclure_fin*/

    $tt=sql_26(array(
        'T0_chi_id_basedd'           => $data['input']['id_bdd_de_la_base'] ,
        'T0_chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    ));

    if($tt['statut'] === false || count($tt['valeur'])!==1){
        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table bdd non trouvée';
        return;
     
    }  


    $ret0=$tt['valeur'][0];

    
    
    
    $chemin_bdd='../../'.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].'/'.$ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);

    if(!is_file($chemin_bdd)){

        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table fichier de bdd non trouvé';
        return;

    }

    $db1=new SQLite3($chemin_bdd);
    $ret0=$db1->exec('BEGIN TRANSACTION;');

    if($ret0 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table BEGIN transaction KO';
        return;

    }

    $ret1=$db1->exec($data['input']['chaine_create_table']);

    if($ret1 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table création table temporaire impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $sql2='INSERT INTO '.$data['input']['nom_table_temporaire'].'('.$data['input']['ordre_modifie'].') SELECT '.$data['input']['ordre_modifie'].' FROM '.$data['input']['nom_de_la_table'].';';
    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql2='.$sql2.CRLF.CRLF); fclose($fd);}
    */
    $ret2=$db1->exec($sql2);

    if($ret2 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table insertion des données impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $sql3='DROP TABLE '.$data['input']['nom_de_la_table'].';';
    $ret3=$db1->exec($sql3);

    if($ret3 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table DROP TABLE impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $sql4='ALTER TABLE  '.$data['input']['nom_table_temporaire'].' RENAME TO '.$data['input']['nom_de_la_table'].' ;';
    $ret4=$db1->exec($sql4);

    if($ret4 !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table RENAME impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    foreach($data['input']['tab_des_index_sql'] as $k1 => $sql5){
        $ret5=$db1->exec($sql5);

        if($ret5 !== true){

            $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table RENAME impossible';
            $ret0=$db1->exec('ROLLBACK;');
            return;

        }

    }
    $retfin=$db1->exec('COMMIT;');

    if($retfin !== true){

        $data['messages'][]=__FILE__.' '.__LINE__.' ordonner_les_champs_de_table COMMIT impossible';
        $ret0=$db1->exec('ROLLBACK;');
        return;

    }

    $data['status']='OK';

}
/*
  ==========================================================================================================
*/

function envoyer_le_rev_de_le_base_en_post(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input]='.var_export( $data['input'] , true ).CRLF.CRLF); fclose($fd);}
    */
    sql_inclure_reference(10);
    // sql_inclure_deb
    require_once(INCLUDE_PATH.'/sql/sql_10.php');
    // sql_inclure_fin
    $a_modifier=array(
          'n_chp_rev_travail_basedd' => $data['input']['source_rev_de_la_base'],
          'c_chi_id_basedd'          => $data['input']['id_bdd_de_la_base'],
          'c_chx_cible_id_basedd'    => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    );
    
    $tt=sql_10($a_modifier);
    if($tt['statut']===true){
        $data['status']='OK';
    }else{
        $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur sur la sauvegarde de la base';
        $data['status']='KO';
    }
}
/*
  ==========================================================================================================
*/

function recuperer_zone_travail_pour_les_bases(&$data){


    sql_inclure_reference(11);
    // sql_inclure_deb
    require_once(INCLUDE_PATH.'/sql/sql_11.php');
    // sql_inclure_fin
    $a_selectionner=array(
          'les_id_des_bases'     => $data['input']['les_id_des_bases'],
          'chx_cible_id_basedd'  => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    );
    
    $tt=sql_11($a_selectionner);
    if($tt['statut']===true){
/*
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$tt[valeur]='.var_export( $tt['valeur'] , true ).CRLF.CRLF); fclose($fd);}
*/
     
        $data['valeurs']=$tt['valeur'];
        $data['status']='OK';
    }else{
        $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur select '.$db->lastErrorMsg();
        $data['status']='KO';
    }

}
/*
  ==========================================================================================================
*/

function sauvegarder_format_rev_en_dbb(&$data){
 
 /*
 $data['input']['parametres_sauvegarde']=array(
  'id_cible'           => id_cible           ,
  'chp_provenance_rev' => chp_provenance_rev , // 'bdd' , '	source' , 'sql'
  'chx_source_rev'     => chx_source_rev     , // id de la source
  'matrice'            => matrice            ,
 )
 
 */

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input][parametres_sauvegarde]='.var_export($data['input']['parametres_sauvegarde'],true).CRLF); fclose($fd);}
    */
    $db=new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $db->querySingle('PRAGMA foreign_keys=ON');
/*
    $sql0='
     DELETE FROM `tbl_revs` 
     WHERE `chx_cible_rev`          = '.sq0($data['input']['parametres_sauvegarde']['id_cible']).' 
       AND `chp_provenance_rev`     = \''.sq0($data['input']['parametres_sauvegarde']['chp_provenance_rev']).'\' 
    ';

    if($data['input']['parametres_sauvegarde']['chx_source_rev'] === null){

        $sql0.='
       AND `chx_source_rev` IS NULL 
     ';

    }else{

        $sql0.='
       AND `chx_source_rev`         = '.sq0($data['input']['parametres_sauvegarde']['chx_source_rev']).' 
     ';
    }
*/
    sql_inclure_reference(5);
    // sql_inclure_deb
    require_once(INCLUDE_PATH.'/sql/sql_5.php');
    // sql_inclure_fin
    $a_supprimer=array(
          'chx_cible_rev'      => $data['input']['parametres_sauvegarde']['id_cible'],
          'chp_provenance_rev' => $data['input']['parametres_sauvegarde']['chp_provenance_rev'],
          'chx_source_rev'     => $data['input']['parametres_sauvegarde']['chx_source_rev'],
    );
    
    $tt=sql_5($a_supprimer);
    if($tt['statut']!==true){
       $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur sur suppression dans la table rev ';
       $data['status']='KO';
    }
    
    
    $a_sauvegarder=array();
    for($i=0;($i < count($data['input']['parametres_sauvegarde']['matrice']));$i++){
        $tab=$data['input']['parametres_sauvegarde']['matrice'][$i];
        /*
          14 champs pour le rev + id_cible + chp_provenance_rev + chx_source_rev
        */
        $a_sauvegarder[]=array(
         'chx_cible_rev'                 => $data['input']['parametres_sauvegarde']['id_cible'],
         'chp_provenance_rev'            => $data['input']['parametres_sauvegarde']['chp_provenance_rev'],
         'chx_source_rev'                => $data['input']['parametres_sauvegarde']['chx_source_rev'],
         'chp_id_rev'                    => $tab[0],
         'chp_valeur_rev'                => $tab[1],
         'chp_type_rev'                  => $tab[2],
         'chp_niveau_rev'                => $tab[3],
         'chp_quotee_rev'                => $tab[4],
         'chp_pos_premier_rev'           => $tab[5],
         'chp_pos_dernier_rev'           => $tab[6],
         'chp_parent_rev'                => $tab[7],
         'chp_nbr_enfants_rev'           => $tab[8],
         'chp_num_enfant_rev'            => $tab[9],
         'chp_profondeur_rev'            => $tab[10],
         'chp_pos_ouver_parenthese_rev'  => $tab[11],
         'chp_pos_fermer_parenthese_rev' => $tab[12],
         'chp_commentaire_rev'           => $tab[13],
                  
        );
    }
    sql_inclure_reference(12);
    // sql_inclure_deb
    require_once(INCLUDE_PATH.'/sql/sql_12.php');
    // sql_inclure_fin
    
    $tt=sql_12($a_sauvegarder);
    if($tt['statut']!==true){
       $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur sur insertion';
    }else{
        $data['messages'][]=basename(__FILE__).' '.__LINE__.' la matrice est en bdd';
        $data['status']='OK';
    }
    return;
    

    $tab=array();
    $sql1='INSERT INTO `tbl_revs`(
        `chx_cible_rev`                    ,   `chp_provenance_rev`     ,    chx_source_rev
    ,   `chp_id_rev`                       ,   `chp_valeur_rev`                              
    ,   `chp_type_rev`                     ,   `chp_niveau_rev`         ,   `chp_quotee_rev`     ,   `chp_pos_premier_rev`  ,   `chp_pos_dernier_rev`                         
    ,   `chp_parent_rev`                   ,   `chp_nbr_enfants_rev`    ,   `chp_num_enfant_rev` ,   `chp_profondeur_rev`   ,   `chp_pos_ouver_parenthese_rev`                
    ,   `chp_pos_fermer_parenthese_rev`    ,   `chp_commentaire_rev`                         
    ) VALUES '.CRLF;
    $liste_des_valeurs='';
    for($i=0;($i < count($data['input']['parametres_sauvegarde']['matrice']));$i++){
        $tab=$data['input']['parametres_sauvegarde']['matrice'][$i];
        $liste_des_valeurs.=',(
         \''.sq0($data['input']['parametres_sauvegarde']['id_cible']).'\'   ,   \''.sq0($data['input']['parametres_sauvegarde']['chp_provenance_rev']).'\'       
        ';

        if($data['input']['parametres_sauvegarde']['chx_source_rev'] === null){

            $liste_des_valeurs.=', NULL';

        }else{

            $liste_des_valeurs.=', '.$data['input']['parametres_sauvegarde']['chx_source_rev'].' ';
        }

        $liste_des_valeurs.='
        ,  '.sq0($tab[3-3]).'    ,\''.sq0($tab[4-3]).'\'  
        ,\''.sq0($tab[5-3]).'\'  ,\''.sq0($tab[6-3]).'\'  ,\''.sq0($tab[7-3]).'\'   ,\''.sq0($tab[8-3]).'\'  ,\''.sq0($tab[9-3]).'\'                             
        ,\''.sq0($tab[10-3]).'\' ,\''.sq0($tab[11-3]).'\' ,\''.sq0($tab[12-3]).'\'  ,\''.sq0($tab[13-3]).'\' ,\''.sq0($tab[14-3]).'\'                            
        ,\''.sq0($tab[15-3]).'\' ,\''.sq0($tab[16-3]).'\' 
        )'.CRLF;
    }
    $liste_des_valeurs=substr($liste_des_valeurs,1);
    $sql1.=$liste_des_valeurs;
    /*
      
      if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql1='.$sql1."\r\n"); fclose($fd);}
    */

    if(false === $db->exec($sql1)){

        /* */
        $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur sur insertion';

    }else{

        $data['messages'][]=basename(__FILE__).' '.__LINE__.' la matrice est en bdd';
        $data['status']='OK';
    }
    
}
?>