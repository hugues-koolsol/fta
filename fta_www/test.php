<?php

function getFileContent(&$data){
    /*on interdit un ".." dans le chemin de fichier en lecture*/
  if((false !== strpos($data[INPUT]["fileName"],'..')) || 1 !== $_SESSION[APP_KEY]["userLoginId"]){
    $data[MESSAGES][]='cannot read a file containing ".."';
  }else{
    if(($data[INPUT]["fileName"] != '')){
      $filefullpath=$data[INPUT]["fileName"];
      $contenu=file_get_contents($filefullpath);
      if((false !== $contenu)){
        $data[VALUE]=$contenu;
        $data[STATUS]='OK';
      }else{
        $data[MESSAGES][]='cannot read the file';
      }
    }else{
      $data[MESSAGES][]='file name must be given';
    }
  }
}
?>
// fichier testConcat1.js
// fichier testConcat2.js