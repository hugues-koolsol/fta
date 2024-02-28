<?php
//if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}
function getFileContent(&$data){
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}
 if(strpos($data['input']['fileName'],'..')!==false){
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot open a file with ".." in the path';
 }else{
  if($data['input']['fileName']!=''){
   $filefullpath=$data['input']['fileName'];
   $contenu=file_get_contents($filefullpath);
   if($contenu!==false){
      $data['value']=$contenu;
      $data['status']='OK';
   }else{
    $data['messages'][]='cannot read the file';
   }
  }else{
   $data['messages'][]='file name must be given';
  }
 }
}
//==========================================================================================================
//if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}
function writeHtmlFile(&$data){
 $extension=array('html','htm');
 writeFile($data,$extension);
}
//==========================================================================================================
function writeJsFile(&$data){
 $extension=array('js');
 writeFile($data,$extension);
}
//==========================================================================================================
function writeFile(&$data,&$extension){
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}
 if(strpos($data['input']['file_path'],'..')!==false||strpos($data['input']['file_name'],'..')||strpos($data['input']['file_extension'],'..')!==false){
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot open the file';
 }else{
  if(in_array($data['input']['file_extension'],$extension)){
   $filefullpath=$data['input']['file_path'].DIRECTORY_SEPARATOR.$data['input']['file_name'].'.'.$data['input']['file_extension'];
   if($fd=fopen($filefullpath,'w')){
    if(fwrite($fd,$data['input']['value'])){
     if(fclose($fd)){
      $data['status']='OK';
     }else{
      $data['messages'][]='the file has not been closed';
     }
    }else{
     $data['messages'][]='cannot write to the file';
    }
   }else{
    $data['messages'][]='cannot open the file';
   }
  }else{
   $data['messages'][]='the file_extension must be in '.var_export( $extension ) ;
  }
 }
}
//==========================================================================================================
function concatJsFile(&$data){
// if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}
 if(strpos($data['input']['file_path'],'..')!==false||strpos($data['input']['file_name'],'..')||strpos($data['input']['file_extension'],'..')!==false){
  $data['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'cannot open the file';
 }else{
  if($data['input']['file_extension']=='js'){
   $filefullpath=$data['input']['file_path'].DIRECTORY_SEPARATOR.$data['input']['file_name'].'.'.$data['input']['file_extension'];
   if($fd=fopen($filefullpath,'a')){
    $filefullpath2=$data['input']['file_path'].DIRECTORY_SEPARATOR.$data['input']['fichierAConcatener'];
    $contenu=file_get_contents($filefullpath2);
    if($contenu!==false){
     if(fwrite($fd,"\r\n".$contenu)){
      if(fclose($fd)){
       $data['status']='OK';
      }else{
       $data['messages'][]='the file has not been closed';
      }
     }else{
      $data['messages'][]='cannot write to the file';
     }
    }else{
     $data['messages'][]='cannot get content of "'.$filefullpath2.'"';     
    }
   }else{
    $data['messages'][]='cannot open the file';
   }
  }else{
   $data['messages'][]='the file_extension must be "js"';
  }
 }
}