<?php

/*
  ==========================================================================================================
*/  
function envoyer_le_rev_de_le_base_en_post(&$data){

    $db = new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $sql0=' UPDATE tbl_bases_de_donnees set `chp_rev_travail_basedd` = \''.sq0($data['input']['source_rev_de_la_base']).'\' WHERE 	chi_id_basedd = '.sq0($data['input']['id_bdd_de_la_base']).'';
    /*
    if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.CRLF.'===================='.CRLF.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql0='.$sql0.CRLF.CRLF); fclose($fd);}
    */
    if(false === $db->exec($sql0)){
        $data['messages'][]=basename(__FILE__). ' ' . __LINE__ . ' Erreur sur la sauvegarde de la base';      
    }else{
        $data['status']='OK';
    }
}

/*
  ==========================================================================================================
*/  
function recuperer_zone_travail_pour_les_bases(&$data){
 
  $db = new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
  $sql=' select chi_id_basedd , chp_rev_travail_basedd , chp_nom_basedd FROM tbl_bases_de_donnees WHERE 	chi_id_basedd IN ('.sq0($data['input']['les_id_des_bases']).')';
  $stmt = $db->prepare($sql);
  $data0=array();
  if($stmt!==false){
    $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
    while($arr=$result->fetchArray(SQLITE3_NUM)){
     array_push($data0, array(
      'T0.chi_id_basedd'          => $arr[0],
      'T0.chp_rev_travail_basedd' => $arr[1],
      'T0.chp_nom_basedd'         => $arr[2],
     ));
    }
    $data['status']='OK';
    $data['valeurs']=$data0;
    $stmt->close(); 
  }else{
    $data['messages'][]=basename(__FILE__). ' ' . __LINE__ . ' Erreur select '.$db->lastErrorMsg();
  }
  
  
 
}

/*
  ==========================================================================================================
*/  
function sauvegarder_format_rev_en_dbb(&$data){

/*
if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}
*/

 
    $db = new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $db->querySingle('PRAGMA foreign_keys=ON');

    
    $sql0='
     DELETE FROM `tbl_revs` 
     WHERE `chx_cible_rev`          = '.sq0($data['input']['parametres_sauvegarde']['id_cible']).' 
       AND `chp_provenance_rev`     = \''.sq0($data['input']['parametres_sauvegarde']['chp_provenance_rev']).'\' 
       AND `chx_source_rev`         = '.sq0($data['input']['parametres_sauvegarde']['chx_source_rev']).' 
    ';
    
    if(false === $db->exec($sql0)){
     
        $data['messages'][]=basename(__FILE__). ' ' . __LINE__ . ' Erreur sur la suppression';
      
    }else{

        $tab=array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        $sql1='INSERT INTO `tbl_revs`(
            `chx_cible_rev`                                                    ,   `chp_provenance_rev`                                                       ,   `chx_source_rev`                       
        ,   `chp_id_rev`                                  ,   `chp_valeur_rev`                              
        ,   `chp_type_rev`                                ,   `chp_niveau_rev`                              ,   `chp_quotee_rev`                              ,   `chp_pos_premier_rev`                         ,   `chp_pos_dernier_rev`                         
        ,   `chp_parent_rev`                              ,   `chp_nbr_enfants_rev`                         ,   `chp_num_enfant_rev`                          ,   `chp_profondeur_rev`                          ,   `chp_pos_ouver_parenthese_rev`                
        ,   `chp_pos_fermer_parenthese_rev`               ,   `chp_commentaire_rev`                         
        ) VALUES ';
        $liste_des_valeurs='';
        for($i=0;$i<count($data['input']['parametres_sauvegarde']['matrice']);$i++){
            
            $tab=$data['input']['parametres_sauvegarde']['matrice'][$i];
        
            $liste_des_valeurs.=',(
             \''.sq0($data['input']['parametres_sauvegarde']['id_cible']).'\'   ,   \''.sq0($data['input']['parametres_sauvegarde']['chp_provenance_rev']).'\' ,  \''.sq0($data['input']['parametres_sauvegarde']['chx_source_rev']).'\'      
            ,\''.sq0($tab[3-3]).'\'  ,\''.sq0($tab[4-3]).'\'  
            ,\''.sq0($tab[5-3]).'\'  ,\''.sq0($tab[6-3]).'\'  ,\''.sq0($tab[7-3]).'\'   ,\''.sq0($tab[8-3]).'\'  ,\''.sq0($tab[9-3]).'\'                             
            ,\''.sq0($tab[10-3]).'\' ,\''.sq0($tab[11-3]).'\' ,\''.sq0($tab[12-3]).'\'  ,\''.sq0($tab[13-3]).'\' ,\''.sq0($tab[14-3]).'\'                            
            ,\''.sq0($tab[15-3]).'\' ,\''.sq0($tab[16-3]).'\' 
            )';

        }
        $liste_des_valeurs=substr($liste_des_valeurs,1);
        $sql1.=$liste_des_valeurs;
        
        if(false === $db->exec($sql1)){ // 
         
            $data['messages'][]=basename(__FILE__). ' ' . __LINE__ . ' Erreur sur insertion';
          
        }else{
        
        
           $data['messages'][]=basename(__FILE__). ' ' . __LINE__ . ' la matrice est en bdd';
           $data['status']='OK';
        }
     
    }
    
    

}