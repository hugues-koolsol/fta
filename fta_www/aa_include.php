<?php
date_default_timezone_set('Europe/Paris');
define("APP_KEY","fta");
define("BACKUP_PATH",'..'.DIRECTORY_SEPARATOR.APP_KEY.'_backup');
define("INCLUDE_PATH",'..'.DIRECTORY_SEPARATOR.APP_KEY.'_inc');
define("CRLF","\r\n");
define("OK","OK");
define("MESSAGES","messages");
define("INPUT","input");
define("VALUE","value");
define("STATUS","status");
/*===================================================================================================================*/
function rechargerPageCourante($a){
    header("HTTP/1.1 303 See Other");
    header(concat('Location: ',$a));
    exit(0);
}
/*===================================================================================================================*/
function supprimerLesValeursDeSession(){
    unset($_SESSION[APP_KEY]['sess_id_utilisateur']);
    unset($_SESSION[APP_KEY]['sess_id_utilisateur_init']);
    unset($_SESSION[APP_KEY]['sess_id_groupe_utilisateur']);
    unset($_SESSION[APP_KEY]['sess_id_groupe_utilisateur_init']);
}
/*
  =====================================================================================================================
  Utilitaire pour repérer les chaines de caractères qui contiennent du html quand on fait du rev
  =====================================================================================================================
*/
function htmlDansPhp($s){
    return $s;
}
/*===================================================================================================================*/
function checkGroupAjaxPages(){
    return(true);
}
/*===================================================================================================================*/
function start_session_messages(){
    $_SESSION[APP_KEY][MESSAGES]['errors']=array();
    $_SESSION[APP_KEY][MESSAGES]['warnings']=array();
    $_SESSION[APP_KEY][MESSAGES]['comments']=array();
}
/*===================================================================================================================*/
function clear_session_messages(){
    unset($_SESSION[APP_KEY][MESSAGES]);
}
/*===================================================================================================================*/
function session_messages(){
    $t='';
    $u='';
    if((isset($_SESSION[APP_KEY][MESSAGES]))){
        $u='';
        if((isset($_SESSION[APP_KEY][MESSAGES]['errors']))){
            foreach($_SESSION[APP_KEY][MESSAGES]['errors'] as $k1 => $v1){
                if(($v1 != '')){
                    $u=$u.'<div>'.htmlentities($v1).'</div>';
                }
            }
        }
        if(($u != '')){
            $t=$t.'<div class="yyerror">'.$u.'</div>';
        }
    }
    return($t);
}
/*===================================================================================================================*/
function pushkv(&$a,$k,$v){
    $a[$k]=$v;
}
/*===================================================================================================================*/
function concat(...$ps){
    $t='';
    foreach($ps as $p){
        $t=$t.$p;
    }
    return($t);
}
/*===================================================================================================================*/
function html_header1($p){
    if(!ob_start("ob_gzhandler")){
     ob_start();
    }
    $o1='';
    $o1=$o1.'<!DOCTYPE html>'.CRLF;
    $o1=$o1.'<html lang="fr">'.CRLF;
    $o1=$o1.' <head>'.CRLF;
    $o1=$o1.'  <meta charset="utf-8" />'.CRLF;
    $o1=$o1.'  <title>'.($p['title']??'title').'</title>'.CRLF;
    $o1=$o1.'  <meta name="viewport" content="width=device-width, initial-scale=1" />'.CRLF;
    $o1=$o1.'  <link rel="stylesheet" href="6.css" />'.CRLF;
    $o1=$o1.' </head>'.CRLF;
    $o1=$o1.' <body>'.CRLF;
    $o1.='  <nav id="navbar" class="yynavbar">'.CRLF;
    $o1.='    <div class="yydivBoutonhome"><a href="index.php" id="buttonhome" class="'.('index.php'===BNF?'yymenusel1':'').'" style="font-size:1.5em;line-height:25px;height:40px;">&#127968;</a></div>'.CRLF;
    $o1.='    <div id="menuScroller" class="menuScroller">'.CRLF;
    $o1.='      <div>'.CRLF;
    $o1.='        <ul>'.CRLF;
    $o1.='          <li></li>'.CRLF;
    $o1.='          <li><a class="" href="traiteJs4.html">traiteJs4</a></li>'.CRLF;
    $o1.='          <li><a class="" href="traitePhp0.html">traitePhp0</a></li>'.CRLF;
    $o1.='          <li><a class="" href="traiteJs4.html">traiteJs4</a></li>'.CRLF;
    if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){
        $o1=$o1.'   <li><a class="" href="index_source.php">index_source</a></li>'.CRLF;
        $o1=$o1.'   <li><a class="" href="aa_login.php?a=logout">logout</a></li>'.CRLF;
    }else{
        $o1=$o1.'   <li><a class="" href="aa_login.php">login</a></li>'.CRLF;
    }
    $o1.='        </ul>'.CRLF;
    $o1.='      </div>'.CRLF;
    $o1.='    </div>'.CRLF;
    if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){
      $o1.='    <div class="yydivBoutonquit">'.CRLF;
      $o1.='      <a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yydanger">×</a>'.CRLF;
      $o1.='      <a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yydanger">×</a>'.CRLF;
      $o1.='    </div>'.CRLF;
    }else{
      $o1.='    <div class="yydivhomequit"><a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yysuccess">e</a></div>'.CRLF;
    }
    $o1.='  </nav>'.CRLF;
    $o1.='    <main id="contenuPrincipal">'.CRLF;
    
    $o1=$o1.' <div id="zone_global_messages" style=""></div>'.CRLF;
    return($o1);
}
/*===================================================================================================================*/
function html_footer1($p=array()){
    $o1='';
    $o1.='</main>'.CRLF;
    $o1=$o1.'  <script type="text/javascript" src="js/core6.js"></script>'.CRLF;
    $o1=$o1.'  <script type="text/javascript" src="js/interface0.js"></script>'.CRLF;

    if((isset($p['js']))){
        foreach($p['js'] as $k1 => $v1){
            $o1=$o1.'  <script type="text/javascript" src="'.$v1.'" defer></script>'.CRLF;
        }
    }
    $o1=$o1.'</body></html>'.CRLF;
    return($o1);
}
/*
date_default_timezone_set('Europe/Paris'); // todo put here your default timezone (https://raw.githubusercontent.com/leon-do/Timezones/main/timezone.json)

define('APP_KEY','fta');
define('BACKUP_PATH' ,'..'.DIRECTORY_SEPARATOR.APP_KEY.'_backup');
define('INCLUDE_PATH','..'.DIRECTORY_SEPARATOR.APP_KEY.'_inc');

define('CRLF',"\r\n");  // todo
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
function clear_session_messages(){
 unset($_SESSION[APP_KEY][MESSAGES]); // todo
}
//==================================================================================================
function session_messages(){
 $t='';
 $u='';
 if(isset($_SESSION[APP_KEY][MESSAGES])){
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][MESSAGES] , true ) . '</pre>' ; exit(0);
  $u='';
  if(isset($_SESSION[APP_KEY][MESSAGES]["errors"])){
   foreach($_SESSION[APP_KEY][MESSAGES]["errors"] as $k1 => $v1){
    if($v1!=''){
     $u.='<div>'.htmlentities($v1).'</div>';
    }
   }
  }
  
  if($u!=''){
   $t.='<div class="yyerror">'.$u.'</div>';
  }
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . htmlentities( var_export( $t , true ) ) . '</pre>' ; exit(0);
//  
 }
 return $t;
}
//==================================================================================================
function pushkv(&$a,$k,$v){
 $a[$k]=$v;
}
//==================================================================================================
function concat(...$ps){ // todo
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
 if(isset($p['opt']['bodyPaddingTop'])){
  $t.=' <body style="padding-top:'.$p['opt']['bodyPaddingTop'].'px;">'.CRLF;
 }else{
  $t.=' <body style="padding-top:24px;">'.CRLF;
 }
 $t.=' <nav style="position: fixed;top: 0;left: 0;width:100%;">'.CRLF;
 $t.='   <a href="index.html">html home</a>'.CRLF;
 $t.='   <a href="index.php">php home</a>'.CRLF;
 $t.='   <a href="todo.html">todo</a>'.CRLF;
 $t.='   <a href="traiteJs4.html">traiteJs4</a>'.CRLF; 
 $t.='   <a href="traitePhp0.html">traitePhp0</a>'.CRLF; 
 if(isset($_SESSION[APP_KEY]["user"]) && 1 === $_SESSION[APP_KEY]["user"]){
  $t.='   <a href="index_source.php">index_source</a>'.CRLF;
  $t.='   <a href="aa_login.php?a=logout">logout</a>'.CRLF;
 }else{
  $t.='   <a href="aa_login.php">login</a>'.CRLF;
 }
 $t.=' </nav>'.CRLF;
 $t.=' <div id="zone_global_messages"></div>'.CRLF;
 return $t;
}
//==================================================================================================
function html_footer1($p=array()){
 $t='';
 $t.='  <script type="text/javascript" src="js/core6.js"></script>'.CRLF;
 if(isset($p['js'])){
  foreach($p['js'] as $k1=>$v1){
   $t.='  <script type="text/javascript" src="'.$v1.'" defer></script>'.CRLF;
  }
 }
 $t.='</body></html>'.CRLF;
 return $t;
}
*/