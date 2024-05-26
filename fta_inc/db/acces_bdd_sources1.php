<?php
/*
  ========================================================================================
*/
function recupere_une_donnees_des_sources($id,$db){
 
 $data0=array();
 $sql='
  SELECT 
   `chi_id_source`      , `chp_nom_source`       , chp_commentaire_source , chp_rev_source ,  chp_genere_source   , 
    chx_cible_id_source ,  chx_dossier_id_source , chp_type_source
  FROM `tbl_sources` T0
  WHERE `T0`.`chi_id_source`=\''.addslashes1($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM))
   {
    $data0=array(
     'T0.chi_id_source'          => $arr[0],
     'T0.chp_nom_source'         => $arr[1],
     'T0.chp_commentaire_source' => $arr[2],
     'T0.chp_rev_source'         => $arr[3],
     'T0.chp_genere_source'      => $arr[4],
     'T0.chx_cible_id_source'    => $arr[5],
     'T0.chx_dossier_id_source'  => $arr[6],
     'T0.chp_type_source'        => $arr[7],
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
function recupere_une_donnees_des_sources_avec_parents($id,$db){
 
 $data0=array();
 $sql='
  SELECT 
   `chi_id_source`       , `chp_nom_source`       ,  chp_commentaire_source , chp_rev_source    , chp_genere_source   , 
    chx_cible_id_source  ,  chx_dossier_id_source , `chi_id_dossier`        , `chp_nom_dossier` , chx_cible_dossier   , 
    chp_dossier_cible    , chp_type_source
  FROM `tbl_sources` T0
     LEFT JOIN tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_source
     LEFT JOIN tbl_cibles   T2 ON T2.chi_id_cible  = T0.chx_cible_id_source
  WHERE `T0`.`chi_id_source`=\''.addslashes1($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM))
   {
    $data0=array(
     'T0.chi_id_source'          => $arr[0],
     'T0.chp_nom_source'         => $arr[1],
     'T0.chp_commentaire_source' => $arr[2],
     'T0.chp_rev_source'         => $arr[3],
     'T0.chp_genere_source'      => $arr[4],
     'T0.chx_cible_id_source'    => $arr[5],
     'T0.chx_dossier_id_source'  => $arr[6],
     'T1.chi_id_dossier'         => $arr[7],
     'T1.chp_nom_dossier'        => $arr[8],
     'T1.chx_cible_dossier'      => $arr[9],
     'T2.chp_dossier_cible'      => $arr[10],
     'T0.chp_type_source'        => $arr[11],
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
