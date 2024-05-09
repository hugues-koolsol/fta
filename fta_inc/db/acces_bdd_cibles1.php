<?php
/*
  ========================================================================================
*/
function recupere_une_donnees_des_cibles($id,$db){
 
 $data0=array();
 $sql='
  SELECT `chi_id_cible` , `chp_nom_cible` , `chp_dossier_cible` , `chp_commentaire_cible`
  FROM `tbl_cibles` T0
  WHERE `T0`.`chi_id_cible`=\''.addslashes1($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM))
   {
    $data0=array(
     'T0.chi_id_cible'          => $arr[0],
     'T0.chp_nom_cible'         => $arr[1],
     'T0.chp_dossier_cible'     => $arr[2],
     'T0.chp_commentaire_cible' => $arr[3],
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
