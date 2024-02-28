<?php
//if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}
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