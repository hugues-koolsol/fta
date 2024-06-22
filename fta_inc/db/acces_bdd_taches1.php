<?php
/*
  ========================================================================================
*/
function recupere_une_donnees_des_taches($id,$db){
 
 $data0=array();
 $sql='
  SELECT `chi_id_tache` , `chp_texte_tache` , `chp_priorite_tache` 
  FROM `tbl_taches` T0
  WHERE `T0`.`chi_id_tache`=\''.sq0($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM))
   {
    $data0=array(
     'T0.chi_id_tache'           => $arr[0],
     'T0.chp_texte_tache'          => $arr[1],
     'T0.chp_priorite_tache'        => $arr[2],
    );
   }
   $stmt->close(); 
 }else{
  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
 }
 
 return $data0;
}
