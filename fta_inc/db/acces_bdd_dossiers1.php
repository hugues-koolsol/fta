<?php
/*
  ========================================================================================
*/
function recupere_une_donnees_des_dossiers($id,$db){
 
 $data0=array();
 $sql='
  SELECT `chi_id_dossier` , `chp_nom_dossier` , `chx_cible_dossier` 
  FROM `tbl_dossiers` T0
  WHERE `T0`.`chi_id_dossier`=\''.addslashes1($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM))
   {
    $data0=array(
     'T0_chi_id_dossier'           => $arr[0],
     'T0_chp_nom_dossier'          => $arr[1],
     'T0_chx_cible_dossier'        => $arr[2],
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
