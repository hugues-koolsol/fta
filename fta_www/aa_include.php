<?php
date_default_timezone_set('Europe/Paris'); // todo put here your default timezone

define('APP_KEY','fta');
define('BACKUP_PATH' ,'..'.DIRECTORY_SEPARATOR.APP_KEY.'_backup');
define('INCLUDE_PATH','..'.DIRECTORY_SEPARATOR.APP_KEY.'_inc');

define('CRLF',"\r\n");
define('OK','OK');

define('MESSAGES'    ,'messages');
define('INPUT'       ,'input');
define('VALUE'       ,'value');
define('STATUS'      ,'status');

//======================================================================================================================
function checkGroupAjaxPages(){
 return true;
}
//==================================================================================================
function start_session_messages(){
 $_SESSION[APP_KEY][MESSAGES]["errors"]=array();
 $_SESSION[APP_KEY][MESSAGES]["warnings"]=array();
 $_SESSION[APP_KEY][MESSAGES]["comments"]=array();
}
//==================================================================================================
function session_messages(){
 $t='';
 $u='';
 if(isset($_SESSION[APP_KEY][MESSAGES])){
  $u='';
  if(isset($_SESSION[APP_KEY][MESSAGES]["errors"])){
   foreach($_SESSION[APP_KEY][MESSAGES]["errors"] as $k1 => $v1){
    if($v1!=''){
     $u.='<div>'.htmlentities($v1).'</div>';
    }
   }
  }
  if($u!=''){
   $t.='<div class="yymessageError">'.$u.'</div>';
  }
  unset($_SESSION[APP_KEY][MESSAGES]);
 }
 return $t;
}
//==================================================================================================
function pushkv(&$a,$k,$v){
 $a[$k]=$v;
}
//==================================================================================================
function concat(...$ps){
 $t='';
 foreach($ps as $p) {
  $t.=$p;
 }
 return $t; 
}
//==================================================================================================
function html_header1($p=array()){
 $t='';
 $t.='<!DOCTYPE html>'.CRLF;
 $t.='<html lang="fr">'.CRLF;
 $t.=' <head>'.CRLF;
 $t.='  <meta charset="utf-8" />'.CRLF;
 $t.='  <title>'.($p['title']??'title').'</title>'.CRLF;
 $t.='  <meta name="viewport" content="width=device-width, initial-scale=1" />'.CRLF;
 $t.='  <link rel="stylesheet" href="index.css" />'.CRLF;
 $t.=' </head>'.CRLF;
 $t.=' <body>'.CRLF;
 $t.=' <nav>'.CRLF;
 $t.='   <a href="index.php">home</a>'.CRLF;
 $t.='   <a href="todo.html">todo</a>'.CRLF;
 $t.='   <a href="funcToArray6.html">funcToArray6</a>'.CRLF; 
 if(isset($_SESSION[APP_KEY]["user"]) && 1 === $_SESSION[APP_KEY]["user"]){
  $t.='   <a href="index_source.php">index_source</a>'.CRLF;
  $t.='   <a href="aa_login.php?a=logout">logout</a>'.CRLF;
 }else{
  $t.='   <a href="aa_login.php">login</a>'.CRLF;
 }
 $t.=' </nav>'.CRLF;
 $t.=' <div id="global_messages"></div>'.CRLF;
 return $t;
}
//==================================================================================================
function html_footer1($p=array()){
 $t='';
 $t.='  <script type="text/javascript" src="js/core.js"></script>'.CRLF;
 if(isset($p['js'])){
  foreach($p['js'] as $k1=>$v1){
   $t.='  <script type="text/javascript" src="'.$v1.'" defer></script>'.CRLF;
  }
 }
 $t.='</body></html>'.CRLF;
 return $t;
}