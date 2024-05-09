<?php
/*
  ========================================================================================
*/
function recupere_une_donnees_des_bases_de_donnees($id,$db){
 
 $data0=array();
 $sql='
  SELECT 
   `chi_id_basedd`      , `chp_nom_basedd`  , chp_rev_basedd, chp_commentaire_basedd , chx_dossier_id_basedd
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
    );
   }
   $stmt->close(); 
 }else{
  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
 }
 
 return $data0;
}
