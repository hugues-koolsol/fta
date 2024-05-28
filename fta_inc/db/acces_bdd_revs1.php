<?php
/*
  ========================================================================================
*/
function recupere_une_donnees_des_revs($id,$db){
 
 $data0=array();
 $sql='
  SELECT 
    `chi_id_rev`                               ,   `chx_cible_rev`                            ,   `chp_provenance_rev`                       ,   `chx_source_rev`                           ,   `chp_id_rev`                               
,   `chp_valeur_rev`                           ,   `chp_type_rev`                             ,   `chp_niveau_rev`                           ,   `chp_quotee_rev`                           ,   `chp_pos_premier_rev`                      
,   `chp_pos_dernier_rev`                      ,   `chp_parent_rev`                           ,   `chp_nbr_enfants_rev`                      ,   `chp_num_enfant_rev`                       ,   `chp_profondeur_rev`                       
,   `chp_pos_ouver_parenthese_rev`             ,   `chp_pos_fermer_parenthese_rev`            ,   `chp_commentaire_rev`                      
  
  FROM `tbl_dossiers` T0
  WHERE `T0`.`chi_id_dossier`=\''.addslashes1($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM))
   {

    $data0=array(
     'T0.chi_id_rev'                       => $arr[0],
     'T0.chx_cible_rev'                    => $arr[1],
     'T0.chp_provenance_rev'               => $arr[2],
     'T0.chx_source_rev'                   => $arr[3],
     'T0.chp_id_rev'                       => $arr[4],
     'T0.chp_valeur_rev'                   => $arr[5],
     'T0.chp_type_rev'                     => $arr[6],
     'T0.chp_niveau_rev'                   => $arr[7],
     'T0.chp_quotee_rev'                   => $arr[8],
     'T0.chp_pos_premier_rev'              => $arr[9],
     'T0.chp_pos_dernier_rev'              => $arr[10],
     'T0.chp_parent_rev'                   => $arr[11],
     'T0.chp_nbr_enfants_rev'              => $arr[12],
     'T0.chp_num_enfant_rev'               => $arr[13],
     'T0.chp_profondeur_rev'               => $arr[14],
     'T0.chp_pos_ouver_parenthese_rev'     => $arr[15],
     'T0.chp_pos_fermer_parenthese_rev'    => $arr[16],
     'T0.chp_commentaire_rev'              => $arr[17],
    );

   }
   $stmt->close(); 
 }else{
  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
 }
 
 return $data0;
}
