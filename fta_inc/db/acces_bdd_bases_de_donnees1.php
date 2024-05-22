<?php
/*
  ========================================================================================
*/
function recupere_une_donnees_des_bases_de_donnees($id,$db){
 
 $data0=array();
 $sql='
  SELECT 
   `chi_id_basedd`      , `chp_nom_basedd`    , chp_rev_basedd, chp_commentaire_basedd , chx_dossier_id_basedd ,
   chp_genere_basedd    , chx_cible_id_basedd , chp_php_basedd
  FROM `tbl_bases_de_donnees` T0
  WHERE `T0`.`chi_id_basedd`=\''.addslashes1($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM)){
    $data0=array(
     'T0.chi_id_basedd'          => $arr[0],
     'T0.chp_nom_basedd'         => $arr[1],
     'T0.chp_rev_basedd'         => $arr[2],
     'T0.chp_commentaire_basedd' => $arr[3],
     'T0.chx_dossier_id_basedd'  => $arr[4],
     'T0.chp_genere_basedd'      => $arr[5],
     'T0.chx_cible_id_basedd'    => $arr[6],
     'T0.chp_php_basedd'         => $arr[7],
    );
   }
   $stmt->close(); 
 }else{
  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
 }
 
 return $data0;
}
/*
  ========================================================================================
*/
function recupere_une_donnees_des_bases_de_donnees_avec_parents($id,$db){
 
 $data0=array();
 $sql='
  SELECT 
   `chi_id_basedd`      , `chp_nom_basedd`      , chp_rev_basedd       , chp_commentaire_basedd , chx_dossier_id_basedd ,
   T1.chp_nom_dossier   , T1.chx_cible_dossier  , T0.chp_genere_basedd , chx_cible_id_basedd    , chp_php_basedd        ,
   chp_dossier_cible
  FROM `tbl_bases_de_donnees` T0
     LEFT JOIN tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd
     LEFT JOIN tbl_cibles   T2 ON T2.chi_id_cible   = T0.chx_cible_id_basedd
  WHERE `T0`.`chi_id_basedd`=\''.addslashes1($id).'\'
 ';

 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM)){
    $data0=array(
     'T0.chi_id_basedd'          => $arr[0],
     'T0.chp_nom_basedd'         => $arr[1],
     'T0.chp_rev_basedd'         => $arr[2],
     'T0.chp_commentaire_basedd' => $arr[3],
     'T0.chx_dossier_id_basedd'  => $arr[4],
     'T1.chp_nom_dossier'        => $arr[5],
     'T1.chx_cible_dossier'      => $arr[6],
     'T0.chp_genere_basedd'      => $arr[7],
     'T0.chx_cible_id_basedd'    => $arr[8],
     'T0.chp_php_basedd'         => $arr[9],
     'T2.chp_dossier_cible'      => $arr[10],
    );
   }
   $stmt->close(); 
 }else{
  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
 }
 
 return $data0;
}
