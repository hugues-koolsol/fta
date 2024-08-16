<?php


function creer_la_base_a_partir_du_shema_sur_disque(&$data){
    require_once(realpath(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php'));

    $ret0=recupere_une_donnees_des_bases_de_donnees_avec_parents($data['input']['id_bdd_de_la_base'] , $GLOBALS[BDD][BDD_1][LIEN_BDD] );

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
  ===========================================================================================================
*/
function reecrire_la_base_a_partir_du_shema_sur_disque(&$data){
 
 
    require_once(realpath(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php'));
    $ret0=recupere_une_donnees_des_bases_de_donnees_avec_parents($data['input']['id_bdd_de_la_base'] , $GLOBALS[BDD][BDD_1][LIEN_BDD] );
    
    $chemin_bdd='..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].DIRECTORY_SEPARATOR.$ret0['T0.chp_nom_basedd'];
    $repertoire=realpath(dirname($chemin_bdd));
    $chemin_bdd=$repertoire.DIRECTORY_SEPARATOR.$ret0['T0.chp_nom_basedd'];
    if(!(is_file($chemin_bdd))){

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
    foreach( $data['input']['liste_des_tables'] as $k1 => $v1){
        $sql3='INSERT INTO \''.sq0($v1).'\' SELECT * FROM source.\''.sq0($v1).'\'';
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
        if((@rename($chemin_bdd_base_temporaire,$chemin_bdd))){
            $data['status']='OK';
        }
    }
    
}
/*
  ===========================================================================================================
*/
function recuperer_les_bases(&$data){
    require_once(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php');
    
    $data['valeurs']=recupere_des_donnees_des_bases_de_donnees_avec_parents( $GLOBALS[BDD][BDD_1][LIEN_BDD] );
    $data['status']='OK';

}

/*
  ===========================================================================================================
*/
function ajouter_le_champ_dans_la_table_tbl_champs(&$data){

    require_once(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php');

    $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents( $data['input']['id_bdd_de_la_base'] , $GLOBALS[BDD][BDD_1][LIEN_BDD] );
    
    $chemin_bdd='../../'.$__valeurs['T2.chp_dossier_cible'].'/'.$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];

    if( !( is_file($chemin_bdd)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false ) ){
        return;
    }
/*
    if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $data['input'] , true) .CRLF.CRLF); fclose($fd);}
*/

/*

chi_id_champ	INTEGER
chx_table_champ	INTEGER
chp_nom_champ	VARCHAR(64)
chp_type_champ	VARCHAR(64)
cht_typologie_champ	CHARACTER(3)
chu_primaire_champ	INTEGER
chu_non_nulle_champ	INTEGER
chu_a_defaut_champ	INTEGER
chp_valeur_defaut_champ	VARCHAR(64)
che_position_champ	INTEGER

*/    


    $sql1='INSERT INTO `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_champs`( 
             chx_table_champ
           , chp_nom_champ
           , chp_type_champ
           , cht_typologie_champ
           , chu_primaire_champ
           , chu_non_nulle_champ
           , chu_a_defaut_champ
           , chp_valeur_defaut_champ
           , che_position_champ
           ) VALUES(
               '.sq0($data['input']['id_bdd_de_la_table'])                               .'
           , \''.sq0($data['input']['nom_du_champ'])                                     .'\'
           , \''.sq0($data['input']['tableau_champ']['type']['nom'])                     .'\'
           , \''.sq0($data['input']['tableau_champ']['tableau_meta']['typologie'])       .'\'
           ,   '.sq0($data['input']['tableau_champ']['cle_primaire']===true?1:0)         .'
           ,   '.sq0($data['input']['tableau_champ']['non_nulle']===true?1:0)            .'
           ,   '.sq0($data['input']['tableau_champ']['defaut']['est_defini']===true?1:0) .'
           ,'.($data['input']['tableau_champ']['defaut']['valeur']===NULL?'NULL':'\''.sq0($data['input']['tableau_champ']['defaut']['valeur']).'\'').'
           ,   '.sq0($data['input']['tableau_champ']['position'])                        .'
    )';
/*    
    if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql1=' . $sql1  .CRLF.CRLF); fclose($fd);}
*/    


    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($sql1)){ // 
     
        ajouterMessage('erreur' , __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() , BNF );
        $data['status']='KO';
        return;
      
    }else{
        $data['status']='OK';
    }
}
/*
  ===========================================================================================================
*/
function ajouter_la_table_dans_la_table_tbl_tables(&$data){
    //recuperer_les_tableaux_des_bases
    
    require_once(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php');
    $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents( $data['input']['id_bdd_de_la_base'] , $GLOBALS[BDD][BDD_1][LIEN_BDD] );
    
    $chemin_bdd='../../'.$__valeurs['T2.chp_dossier_cible'].'/'.$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];

    if( !( is_file($chemin_bdd)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false ) ){
        return;
    }
    
/*
    if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $data['input'] , true) .CRLF.CRLF); fclose($fd);}
*/  

    $id_bdd_de_la_base=$data['input']['id_bdd_de_la_base'];
    
    foreach( $data['input']['tableau_des_tables_et_champs'] as $k1 => $v1){
        $nom_de_la_table=$v1['nom_de_la_table'];
        $sql1='INSERT INTO `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_tables`( 
                 chx_base_table                                    , chp_nom_table                                    ,   chp_nom_long_table                                 , chp_nom_court_table                               , chp_nom_bref_table                                 ) VALUES(
                '.sq0($id_bdd_de_la_base).'                        , \''.sq0($nom_de_la_table).'\'                    ,  \''.sq0($v1['meta']['nom_long_de_la_table']).'\'    , \''.sq0($v1['meta']['nom_court_de_la_table']).'\' , \''.sq0($v1['meta']['nom_bref_de_la_table']).'\'
        )';
/*        
        if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql1='.$sql1 .CRLF.CRLF); fclose($fd);}
*/        
        if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($sql1)){ // 
         
            ajouterMessage('erreur' , __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() , BNF );
            $data['status']='KO';
            return;
          
        }else{
            $data['status']='OK';
        }
    }
}
/*
  ===========================================================================================================
*/
function recuperer_les_tableaux_des_bases(&$data){
/* 
                        source_base_sql        : obj3.status,
                        id_bdd_de_la_base      : id_bdd_de_la_base_en_cours,
*/ 

    require_once(INCLUDE_PATH.'/phplib/sqlite.php');
    $obj=comparer_une_base_physique_et_une_base_virtuelle( $data['input']['id_bdd_de_la_base'] , $data['input']['source_base_sql'] );
    if($obj['status']===true){
        $data['value']=$obj['value'];
        $id_bdd_de_la_base=$data['input']['id_bdd_de_la_base'];
        
        
/*
    if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $data['value'] , true) .CRLF.CRLF); fclose($fd);}
  
$data=array (
  'tableau1' => 
  array (
    'tbl_cibles' => 
    array (
      'liste_des_champs' => 
      array (
        'chi_id_cible' => 
        array (
          'cid' => 0,
          'name' => 'chi_id_cible',
          'type' => 'INTEGER',
          'notnull' => 0,
          'dflt_value' => NULL,
          'pk' => 1,
          'auto_increment' => false,
          'cle_etrangere' => 
          array (
          ),
        ),

*/         
        
        /* recherche des id dans les tables tbl_tables et tbl_champs */
        
        foreach( $data['value']['tableau1'] as $k1 => $v1){
         
            $sql0='SELECT chi_id_table FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_tables` WHERE chp_nom_table=\''.$k1.'\' AND chx_base_table = '.$id_bdd_de_la_base.' ';
         
            $id_bdd_de_la_table=0;
            $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
            $data0=array();

            if($stmt0 !== false){

                $result0=$stmt0->execute();
                /* SQLITE3_NUM: SQLITE3_ASSOC*/
                while(($arr0=$result0->fetchArray(SQLITE3_NUM))){
                    $id_bdd_de_la_table = $arr0[0];
                }
                $stmt0->close();
            }
            $data['value']['tableau1'][$k1]['chi_id_table']=$id_bdd_de_la_table;
            if($id_bdd_de_la_table>0){
                foreach($v1['liste_des_champs'] as $k2 => $v2){
                 
                    $sql1='
                        SELECT chi_id_champ FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_champs` 
                        WHERE chx_table_champ='.$id_bdd_de_la_table.' AND chp_nom_champ=\''.$k2.'\'  
                    ';
                 
                    $id_bdd_du_champ=0;
                    $stmt1=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql1);
                    $data1=array();

                    if($stmt1 !== false){

                        $result1=$stmt1->execute();
                        /* SQLITE3_NUM: SQLITE3_ASSOC*/
                        while(($arr1=$result1->fetchArray(SQLITE3_NUM))){
                            $id_bdd_du_champ = $arr1[0];
                        }
                        $stmt1->close();
                    }
                    $data['value']['tableau1'][$k1]['liste_des_champs'][$k2]['chi_id_champ']=$id_bdd_du_champ;
                }
            }
        }
        $data['status']='OK';
    }else{
        $data['message']='erreur sur recuperer_les_tableaux_des_bases';
    }


}
/*
========================================================
*/
function supprimer_en_bdd_le_champ(&$data){
    operation_sur_base($data , 'supprimer_en_bdd_le_champ');
}
/*
========================================================
*/
function ajouter_en_bdd_le_champ(&$data){
    operation_sur_base($data , 'ajouter_en_bdd_le_champ');
}
/*
  ==========================================================================================================
*/
function supprimer_table_dans_base(&$data){
    operation_sur_base($data , 'supprimer_table_dans_base');
}
/*
  ==========================================================================================================
*/
function operation_sur_base(&$data, $nom_operation){
 
    
/*      
    if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $data['input'] , true) .CRLF.CRLF); fclose($fd);}
*/

    
    require_once(realpath(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php'));
    $ret0=recupere_une_donnees_des_bases_de_donnees_avec_parents($data['input']['id_bdd_de_la_base'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);
    $chemin_bdd='../../'.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].'/'.$ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);
    if(!(is_file($chemin_bdd))){

        $data['messages'][]=__FILE__.' '.__LINE__.' '.$nom_operation.' fichier de bdd non trouvé';
        return;

    }
 
    $db1=new SQLite3($chemin_bdd);
    $ret0=$db1->exec('BEGIN TRANSACTION;');

    if($ret0 !== true){
        $data['messages'][]=__FILE__.' '.__LINE__.' '.$nom_operation.' BEGIN transaction KO';
        return;
    }
    $ret1=$db1->exec($data['input']['source_sql']);
    if($ret1 !== true){
        $data['messages'][]=__FILE__.' '.__LINE__.' '.$nom_operation.' création table temporaire impossible';
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
  ==========================================================================================================
*/
function creer_table_dans_base(&$data){
 
    
/*      
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data=' . $data['input']['source_sql'] . CRLF.CRLF); fclose($fd);}
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export( $GLOBALS[BDD] , true) .CRLF.CRLF); fclose($fd);}
*/

    
    require_once(realpath(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php'));
    $ret0=recupere_une_donnees_des_bases_de_donnees_avec_parents($data['input']['id_bdd_de_la_base'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);
    $chemin_bdd='../../'.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].'/'.$ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);
    if(!(is_file($chemin_bdd))){

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
  ==========================================================================================================
*/
function ordonner_les_champs_de_table(&$data){

    $db0=new SQLite3(INCLUDE_PATH.'/db/sqlite/system.db');
    require_once(realpath(INCLUDE_PATH.'/db/acces_bdd_bases_de_donnees1.php'));
    $ret0=recupere_une_donnees_des_bases_de_donnees_avec_parents($data['input']['id_bdd_de_la_base'],$db0);
    $chemin_bdd='../../'.$ret0['T2.chp_dossier_cible'].$ret0['T1.chp_nom_dossier'].'/'.$ret0['T0.chp_nom_basedd'];
    $chemin_bdd=realpath($chemin_bdd);
    if(!(is_file($chemin_bdd))){

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

    $db=new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $sql0=' UPDATE tbl_bdds set `chp_rev_travail_basedd` = \''.sq0($data['input']['source_rev_de_la_base']).'\' WHERE 	chi_id_basedd = '.sq0($data['input']['id_bdd_de_la_base']).'';
    /*
      
      if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql0='.$sql0.CRLF.CRLF); fclose($fd);}
    */

    if(false === $db->exec($sql0)){

        $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur sur la sauvegarde de la base';

    }else{

        $data['status']='OK';
    }


}
/*
  
  ==========================================================================================================
*/

function recuperer_zone_travail_pour_les_bases(&$data){

    $db=new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $sql=' select chi_id_basedd , chp_rev_travail_basedd , chp_nom_basedd FROM tbl_bdds WHERE 	chi_id_basedd IN ('.sq0($data['input']['les_id_des_bases']).')';
    $stmt=$db->prepare($sql);
    $data0=array();

    if($stmt !== false){

        $result=$stmt->execute();
        /* SQLITE3_NUM: SQLITE3_ASSOC*/
        while(($arr=$result->fetchArray(SQLITE3_NUM))){
            array_push($data0,array( 'T0.chi_id_basedd' => $arr[0], 'T0.chp_rev_travail_basedd' => $arr[1], 'T0.chp_nom_basedd' => $arr[2]));
        }
        $data['status']='OK';
        $data['valeurs']=$data0;
        $stmt->close();

    }else{

        $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur select '.$db->lastErrorMsg();
    }


}
/*
  
  ==========================================================================================================
*/

function sauvegarder_format_rev_en_dbb(&$data){

    
    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}
    */
    $db=new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $db->querySingle('PRAGMA foreign_keys=ON');
    $sql0='
     DELETE FROM `tbl_revs` 
     WHERE `chx_cible_rev`          = '.sq0($data['input']['parametres_sauvegarde']['id_cible']).' 
       AND `chp_provenance_rev`     = \''.sq0($data['input']['parametres_sauvegarde']['chp_provenance_rev']).'\' 
    ';
    if($data['input']['parametres_sauvegarde']['chx_source_rev']===null){
     $sql0.='
       AND `chx_source_rev` IS NULL 
     ';
    }else{
     $sql0.='
       AND `chx_source_rev`         = '.sq0($data['input']['parametres_sauvegarde']['chx_source_rev']).' 
     ';
    }

    if(false === $db->exec($sql0)){

        $data['messages'][]=basename(__FILE__).' '.__LINE__.' Erreur sur la suppression';

    }else{
        /* 
        15 champs
        */
        
        $tab=array();
        $sql1='INSERT INTO `tbl_revs`(
            `chx_cible_rev`                    ,   `chp_provenance_rev`     ,    chx_source_rev
        ,   `chp_id_rev`                       ,   `chp_valeur_rev`                              
        ,   `chp_type_rev`                     ,   `chp_niveau_rev`         ,   `chp_quotee_rev`     ,   `chp_pos_premier_rev`  ,   `chp_pos_dernier_rev`                         
        ,   `chp_parent_rev`                   ,   `chp_nbr_enfants_rev`    ,   `chp_num_enfant_rev` ,   `chp_profondeur_rev`   ,   `chp_pos_ouver_parenthese_rev`                
        ,   `chp_pos_fermer_parenthese_rev`    ,   `chp_commentaire_rev`                         
        ) VALUES '.CRLF;
        $liste_des_valeurs='';
        for($i=0;($i < count($data['input']['parametres_sauvegarde']['matrice']));($i++)){
            $tab=$data['input']['parametres_sauvegarde']['matrice'][$i];
            $liste_des_valeurs.=',(
             \''.sq0($data['input']['parametres_sauvegarde']['id_cible']).'\'   ,   \''.sq0($data['input']['parametres_sauvegarde']['chp_provenance_rev']).'\'       
            ';
            if($data['input']['parametres_sauvegarde']['chx_source_rev']===null){
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


}
?>