<?php
//==========================================================================================================
function sauvegarder_format_rev_en_dbb(&$data){

/*
if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}
*/

 
    $db = new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $db->querySingle('PRAGMA foreign_keys=ON');

    
    $sql0='
     DELETE FROM `tbl_revs` 
     WHERE `chx_cible_rev`          = '.addslashes1($data['input']['parametres_sauvegarde']['id_cible']).' 
       AND `chp_provenance_rev`     = \''.addslashes1($data['input']['parametres_sauvegarde']['chp_provenance_rev']).'\' 
       AND `chx_source_rev`         = '.addslashes1($data['input']['parametres_sauvegarde']['chx_source_rev']).' 
    ';
    
    if(false === $db->exec($sql0)){ // 
     
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