<?php

function enregistrer_les_sources_en_base(&$data){

// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input]='.var_export($data['input'],true).CRLF.CRLF.'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);} 

 $sql0='update tbl_sources SET 	
      chp_rev_source = \''.sq0($data['input']['params']['source_rev']).'\' 
    , chp_genere_source=\''.sq0($data['input']['params']['source_genere']).'\' 
    WHERE chi_id_source = '.sq0($data['input']['params']['id_source']).'
 ';

// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$sql0='.var_export($sql0,true).CRLF.CRLF); fclose($fd);} 
 $db = new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
 $retour_sql=$db->querySingle($sql0);
 
 $chemin_include=dirname(__FILE__,3).DIRECTORY_SEPARATOR.'db'.DIRECTORY_SEPARATOR.'acces_bdd_sources1.php';
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$chemin_include='.var_export($chemin_include,true).CRLF.CRLF); fclose($fd);} 
 
 require_once($chemin_include);
 $valeurs=recupere_une_donnees_des_sources_avec_parents($data['input']['params']['id_source'],$db);
 
 $chemin_fichier=realpath(dirname(__FILE__,5).DIRECTORY_SEPARATOR.$valeurs['T2.chp_dossier_cible'].DIRECTORY_SEPARATOR.$valeurs['T1.chp_nom_dossier'].DIRECTORY_SEPARATOR.$valeurs['T0.chp_nom_source']);
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$chemin_fichier='.var_export($chemin_fichier,true).CRLF.CRLF); fclose($fd);} 

 if($fd=fopen( $chemin_fichier , 'w')){
  if(fwrite($fd,$data['input']['params']['source_genere'])){
   fclose($fd);
   $data['status']='OK';     
  }
 }
 

 
 
 
 
}
/*
=======================================================================================================================
*/
function remplacer_des_chaine1(&$data){
/*
    if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data[input]='.var_export($data['input'],true).CRLF.CRLF.'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);} 
*/    
/*




*/    
   $data['valeurs']=array();     

   $liste_des_id_des_sources='';
   foreach( $data['input']['parametre']['liste_des_id_des_sources'] as $k1 => $v1 ){ // ['donnees_recues_du_message']
       if($v1['etat'] === "maj_bdd_et_récupération_du_tableau" ){
        $liste_des_id_des_sources.=','.$v1['id_source'];
       }
   }
   if($liste_des_id_des_sources!==''){
       $liste_des_id_des_sources = substr( $liste_des_id_des_sources , 1 );
   }

   /* todo, ajouter la cible en cours */
   $sql0='update tbl_revs 
    SET `chp_valeur_rev` = \''.sq0($data['input']['parametre']['remplacer_par']).'\' '.
    ' WHERE  `chp_valeur_rev` = \''.sq0($data['input']['parametre']['chaine_a_remplacer']).'\'' .
    ' AND `chx_source_rev` IN ('.sq0($liste_des_id_des_sources).') ';

/*
    if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ .CRLF.'$sql0='.CRLF.$sql0.CRLF.'$data[input][parametre]='.var_export($data['input']['parametre'],true).CRLF); fclose($fd);} 
*/

    $db = new SQLite3(INCLUDE_PATH.DIRECTORY_SEPARATOR.'db/sqlite/system.db');
    $retour_sql=$db->querySingle($sql0);
    if($retour_sql===null){


        $sql1='SELECT 
         T1.chp_nom_source                     ,  `chx_source_rev`                          ,   `chp_id_rev`                               ,   `chp_valeur_rev`                           ,   `chp_type_rev` 
    ,   `chp_niveau_rev`                       ,  `chp_quotee_rev`                          ,   `chp_pos_premier_rev`                      ,   `chp_pos_dernier_rev`                      ,   `chp_parent_rev`
    ,   `chp_nbr_enfants_rev`                  ,  `chp_num_enfant_rev`                      ,   `chp_profondeur_rev`                       ,   `chp_pos_ouver_parenthese_rev`             ,   `chp_pos_fermer_parenthese_rev`
    ,   `chp_commentaire_rev`  
        FROM tbl_revs   
        LEFT JOIN tbl_sources T1 ON T1.chi_id_source = chx_source_rev
        WHERE  `chx_source_rev` IN ('.sq0($liste_des_id_des_sources).')
        ';
     
//        if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ .CRLF.'$sql1='.CRLF.var_export($sql1,true).CRLF.CRLF); fclose($fd);} 
        $stmt = $db->prepare($sql1);
        if($stmt!==false){
            $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
            $data0=array();
            while($arr=$result->fetchArray(SQLITE3_NUM)){
                $n=2;
                $data0[$arr[1]]['tab'][]=array($arr[$n+0],$arr[$n+1],$arr[$n+2],$arr[$n+3],$arr[$n+4],$arr[$n+5],$arr[$n+6],$arr[$n+7],$arr[$n+8],$arr[$n+9],$arr[$n+10],$arr[$n+11],$arr[$n+12],$arr[$n+13]);
                $data0[$arr[1]]['nom_source']=$arr[0];
            }
            $stmt->close(); 
            $data['status']='OK';     
            $data['valeurs']=$data0;     
        }else{
     
        }
     
     
     
    }else{
        $data['status']='OK';     
    }

//    if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ .CRLF.'$retour_sql='.CRLF.var_export($retour_sql,true).CRLF.CRLF); fclose($fd);} 

    
}
