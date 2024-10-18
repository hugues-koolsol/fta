<?php
//if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}

function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(&$data){

    if((isset($data['input']['id_source']))){
        
        sql_inclure_reference(62);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_62.php');
        /*
          SELECT 
          `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
          `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
          `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
           FROM b1.tbl_sources T0
           LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source

           LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source

          WHERE (`T0`.`chi_id_source` = :T0_chi_id_source AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);
        */
        /*sql_inclure_fin*/
        
        $tt=sql_62(array( 
         'T0_chi_id_source'       => $data['input']['id_source'], 
         'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
        ));

        if(($tt['statut'] === false) || (count($tt['valeur']) !== 1)){
                $data['status']='KO';
                $data['messages'][]=__LINE__. ' ' . __FILE__ . ' KO';
                return;
        }
        $__valeurs=$tt['valeur'][0];

        
        
        
        $chemin_fichier='../../'.$__valeurs['T1.chp_dossier_cible'].$__valeurs['T2.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];
        
        
        if($fd=fopen($chemin_fichier,'w')){
            fwrite($fd,$data['input']['source']);
            fclose($fd);
            $data['status']='OK';
            
            $data['input']['parametres_sauvegarde'] = array(
                  'id_cible'                => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
                  'chp_provenance_rev'      => 'source'                                             ,
                  'chx_source_rev'          => $data['input']['id_source']                          ,
                  'matrice'                 => $data['input']['matrice']                            ,
                  'nom_du_source'           => $__valeurs['T0.chp_nom_source']                            ,
                  'dossier_du_source'       => $__valeurs['T2.chp_nom_dossier']                           ,
                  'dossier_cible_du_source' => $__valeurs['T1.chp_dossier_cible']                         ,
            );
            require_once(realpath(INCLUDE_PATH.'/ajax/core/bdd.php'));
            sauvegarder_format_rev_en_dbb($data);
            
        }
    }
}

function charger_un_fichier_source_par_son_identifiant(&$data){

 if((isset($data['input']['id_source']))){


        sql_inclure_reference(62);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_62.php');
        /*
          SELECT 
          `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
          `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
          `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
           FROM b1.tbl_sources T0
           LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source

           LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source

          WHERE (`T0`.`chi_id_source` = :T0_chi_id_source AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);
        */
        /*sql_inclure_fin*/
        
        $tt=sql_62(array( 
         'T0_chi_id_source'       => $data['input']['id_source'], 
         'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
        ));

        if(($tt['statut'] === false) || (count($tt['valeur']) !== 1)){
                $data['status']='KO';
                $data['messages'][]=__LINE__. ' ' . __FILE__ . ' KO';
                return;
        }
        $__valeurs=$tt['valeur'][0];




     $chemin_fichier='../../'.$__valeurs['T1.chp_dossier_cible'].$__valeurs['T2.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];
     if(is_file($chemin_fichier)){
      
          $contenu_du_fichier = file_get_contents($chemin_fichier);
          if($contenu_du_fichier!==false){
              $data['contenu_du_fichier']=$contenu_du_fichier;
              $data['db']=$__valeurs;
              $data['status']='OK';
          }
      
      
      
     }else{
         $data['messages'][]='fichier introuvable '.$chemin_fichier;
     }
  
 }else{
     $data['messages'][]='champ id_source introuvable';
 }


}
//==========================================================================================================
function supprimer_un_fichier_avec_un_nom_encrypte(&$data){
 
 if((isset($data['input']['file_name']))){
  $nomFichierDecripte=decrypter($data['input']['file_name']);
  
  if(sauvegarder_et_supprimer_fichier($nomFichierDecripte)){
    $data['status']='OK';
  }else{
    $data['messages'][]='la copie du fichier dans le répertoire de sauvegarde est impossible';
  }
 }else{
  $data['messages'][]='$data[\'input\'][\'file_name\'] non trouvé';
 }


}

//==========================================================================================================
function charger_un_fichier_avec_un_nom_encrypte(&$data){

 
 if((isset($data['input']['file_name']))){
  
  $nomFichierDecripte=decrypter($data['input']['file_name']);
  $taille_en_octets=filesize($nomFichierDecripte);
  if($taille_en_octets<=TAILLE_MAXI_SOURCE){
   $contenu=file_get_contents($nomFichierDecripte);
   if($contenu===false){
    
       $data['messages'][]='impossible de lire le fichier';   
    
   }else{
     
       $data['value']=$contenu;
       $data['status']='OK';
    
   }
   
  }else{
       $data['messages'][]='le fichier fait plus de '.TAILLE_MAXI_SOURCE.' octets et il ne peut pas être intégré dans une zone de texte';   
  }
 }else{
  $data['messages'][]='$data[\'input\'][\'file_name\'] non trouvé';
 }


}

//==========================================================================================================
function loadRevFile(&$data){
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}
 if(strpos($data['input']['file_name'],'..')!==false){
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot open the file';
  return;
 }
 if($data['input']['file_name']!=''){
  $filefullpath=INCLUDE_PATH.DIRECTORY_SEPARATOR.'rev'.DIRECTORY_SEPARATOR.$data['input']['file_name'];
  $contenu=file_get_contents($filefullpath);
  if($contenu!==false){
   $data['value']=$contenu;
   $data['status']='OK';
  }else{
   $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot read the file';
  }
 }else{
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'file name must be given';
 }
}
//==========================================================================================================
function getRevFiles(&$data){
 $data['files']=array();
 $dir=INCLUDE_PATH.DIRECTORY_SEPARATOR.'rev'.DIRECTORY_SEPARATOR;
 foreach (glob($dir.'*.rev') as $filename) {
  $data['files'][]=basename($filename);
 } 
 $data['status']='OK';
}
//==========================================================================================================
function writeRevFile(&$data){
// sleep(2);
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}
 if(strpos($data['input']['file_name'],'..')){
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot write a file containing ".."';
  return;
 }
 
 if(substr($data['input']['file_name'],-4)!=='.rev'){
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'The file must end with a .rev extension';
  return;
 }
 for($i=0;$i<strlen($data['input']['file_name']);$i++){
  $c=substr($data['input']['file_name'],$i,1);
  if($c=='/' || $c=='\\' || $c==':' || $c=='*' || $c=='?' || $c=='"' || $c=='<' || $c=='>' || $c=='|'){
   $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'The filename cannot contain character "'.$c.'"';
   return;
  }else{
   if(!(ord($c)>=32 && ord($c)<127)){
    $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'The filename cannot contain character "'.$c.'"';
    return;
   }
  }
 }
 $filefullpath=INCLUDE_PATH.DIRECTORY_SEPARATOR.'rev'.DIRECTORY_SEPARATOR.$data['input']['file_name'];
 if(is_file($filefullpath)){   
  $backupName=BACKUP_PATH.'/'.uniqid().'_'.$data['input']['file_name'];
  copy($filefullpath,$backupName);
 }
 if($fd=fopen($filefullpath,'w')){
  if(fwrite($fd,$data['input']['value'])){
   if(fclose($fd)){
    $data['status']='OK';
   }else{
    $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'the file has not been closed';
   }
  }else{
   $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot write to the file';
  }
 }else{
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot open the file';
 }
}
//==========================================================================================================
function writeFile(&$data){
// sleep(2);
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_SESSION[APP_KEY]='.var_export($_SESSION[APP_KEY],true)."\r\n"); fclose($fd);}
 if(
  (strpos($data['input']['file_path'],'..')!==false||strpos($data['input']['file_name'],'..')||strpos($data['input']['file_extension'],'..')!==false )
  && ( 1 !== $_SESSION[APP_KEY]["user"] )
 ){
  $data['messages'][]=__FILE__ . ' ' . __LINE__ . ' ' . '1 cannot open the file';
 }else{
  $filefullpath=$data['input']['file_path'].DIRECTORY_SEPARATOR.$data['input']['file_name'].'.'.$data['input']['file_extension'];
  if(is_file($filefullpath)){   
   $backupName=BACKUP_PATH.'/'.uniqid().'_'.$data['input']['file_name'].'.'.$data['input']['file_extension'];
   copy($filefullpath,$backupName);
  }
  if($fd=fopen($filefullpath,'w')){
   if(fwrite($fd,$data['input']['value'])){
    if(fclose($fd)){
     $data['status']='OK';
    }else{
     $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'the file has not been closed';
    }
   }else{
    $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot write to the file';
   }
  }else{
   $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot open the file';
  }
 }
}
//==========================================================================================================
function concatFile(&$data){
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}
 if(strpos($data['input']['file_path'],'..')!==false||strpos($data['input']['file_name'],'..')||strpos($data['input']['file_extension'],'..')!==false){
  $data['messages'][]='cannot open the file';
 }else{
  $filefullpath=$data['input']['file_path'].DIRECTORY_SEPARATOR.$data['input']['file_name'].'.'.$data['input']['file_extension'];
  if($fd=fopen($filefullpath,'a')){
   $filefullpath2=$data['input']['file_path'].DIRECTORY_SEPARATOR.$data['input']['fichierAConcatener'];
   $contenu=file_get_contents($filefullpath2);
   if($contenu!==false){
    if(fwrite($fd,"\r\n".$contenu)){
     if(fclose($fd)){
      $data['status']='OK';
     }else{
      $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'the file has not been closed';
     }
    }else{
     $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot write to the file';
    }
   }else{
    $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot get content of "'.$filefullpath2.'"';     
   }
  }else{
   $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot open the file';
  }
 }
}