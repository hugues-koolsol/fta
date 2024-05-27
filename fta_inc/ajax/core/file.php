<?php
//if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}

function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(&$data){

    if((isset($data['input']['id_source']))){
        $db=new SQLite3(INCLUDE_PATH.'/db/sqlite/system.db');
        require_once(realpath(INCLUDE_PATH.'/db/acces_bdd_sources1.php'));
        $ret=recupere_une_donnees_des_sources_avec_parents($data['input']['id_source'],$db);
        
        
        $chemin_fichier='../../'.$ret['T2.chp_dossier_cible'].$ret['T1.chp_nom_dossier'].'/'.$ret['T0.chp_nom_source'];
        
        
        if($fd=fopen($chemin_fichier,'w')){
            fwrite($fd,$data['input']['source']);
            fclose($fd);
            $data['status']='OK';
            
            $data['input']['parametres_sauvegarde'] = array(
                  'id_cible'               => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
                  'chp_provenance_rev'     => 'source'                                             ,
                  'chx_id_provanance_rev'  => $data['input']['id_source']                          ,
                  'matrice'                => $data['input']['matrice']
            );
            require_once(realpath(INCLUDE_PATH.'/ajax/core/bdd.php'));
            sauvegarder_format_rev_en_dbb($data);
            
        }
    }
}

function charger_un_fichier_source_par_son_identifiant(&$data){

 if((isset($data['input']['id_source']))){
     $db=new SQLite3(INCLUDE_PATH.'/db/sqlite/system.db');
     require_once(realpath(INCLUDE_PATH.'/db/acces_bdd_sources1.php'));
     $ret=recupere_une_donnees_des_sources_avec_parents($data['input']['id_source'],$db);

     $chemin_fichier='../../'.$ret['T2.chp_dossier_cible'].$ret['T1.chp_nom_dossier'].'/'.$ret['T0.chp_nom_source'];
     if(is_file($chemin_fichier)){
      
          $contenu_du_fichier = file_get_contents($chemin_fichier);
          if($contenu_du_fichier!==false){
              $data['contenu_du_fichier']=$contenu_du_fichier;
              $data['db']=$ret;
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