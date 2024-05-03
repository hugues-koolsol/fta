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
    $o1.='<!DOCTYPE html>'.CRLF;
    $o1.='<html lang="fr">'.CRLF;
    $o1.=' <head>'.CRLF;
    $o1.='  <meta charset="utf-8" />'.CRLF;
    $o1.='  <title>'.($p['title']??'title').'</title>'.CRLF;
    $o1.='  <meta name="viewport" content="width=device-width, initial-scale=1" />'.CRLF;
    $o1.='  <link rel="stylesheet" href="6.css" />'.CRLF;
    $o1.=' </head>'.CRLF;
    $o1.=' <body>'.CRLF;
    $o1.='  <nav id="navbar" class="yynavbar">'.CRLF;
    $o1.='    <div class="yydivBoutonhome"><a href="./" id="buttonhome" class="'.('index.php'===BNF?'yymenusel1':'').'" style="font-size:1.5em;line-height:25px;height:40px;">&#127968;</a></div>'.CRLF;
    $o1.='    <div id="menuPrincipal" class="menuScroller">'.CRLF;
    $o1.='      <div>'.CRLF;
    $o1.='        <ul>'.CRLF;
    $idMenu=0;
    if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){
        $o1.='          <li><a class="'.('traiteHtml.php'===BNF?'yymenusel1':'').'" href="traiteHtml.php?idMenu='.($idMenu++).'">HTML</a></li>'.CRLF;
        $o1.='          <li><a class="'.('traiteJs.php'===BNF?'yymenusel1':'').'" href="traiteJs.php?idMenu='.($idMenu++).'">JS</a></li>'.CRLF;
        $o1.='          <li><a class="'.('traitePhp.php'===BNF?'yymenusel1':'').'" href="traitePhp.php?idMenu='.($idMenu++).'">PHP</a></li>'.CRLF;
        $o1.='          <li><a class="'.('index_source.php'===BNF?'yymenusel1':'').'" href="index_source.php?idMenu='.($idMenu++).'">REV</a></li>'.CRLF;
    }
    $o1.='        </ul>'.CRLF;
    $o1.='      </div>'.CRLF;
    $o1.='    </div>'.CRLF;
    if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){
      $o1.='    <div class="yydivBoutonquit">'.CRLF;
      $o1.='      <a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yydanger">×</a>'.CRLF;
      $o1.='    </div>'.CRLF;
    }else{
      $o1.='    <div class="yydivhomequit"><a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yysuccess">🔑</a></div>'.CRLF;
    }
    $o1.='  </nav>'.CRLF;
    $o1.='    <main id="contenuPrincipal">'.CRLF;
    
    $o1=$o1.' <div id="zone_global_messages" style=""></div>'.CRLF;
    return($o1);
}
/*===================================================================================================================*/
function html_footer1($par=array()){
    $o1='';
    $o1.='</main>'.CRLF;
    $o1.='<div id="boutonHautDePage" onclick="decalerLaPage(0,200)">⇑</div>'.CRLF;
    $o1=$o1.'  <script type="text/javascript" src="js/core6.js"></script>'.CRLF;
    $o1=$o1.'  <script type="text/javascript" src="js/interface0.js"></script>'.CRLF;

    if((isset($par['js_a_inclure']))){
        foreach($par['js_a_inclure'] as $k1 => $v1){
            $o1=$o1.'  <script type="text/javascript" src="'.$v1.'" defer></script>'.CRLF;
        }
    }
    $o1.='<script type="text/javascript">'.CRLF;
    if(isset($par['js_a_executer_apres_chargement'])){
     $o1.='function fonctionDeLaPageAppeleeQuandToutEstCharge(){'.CRLF;
     $txt1='';
     foreach($par['js_a_executer_apres_chargement'] as $k1 => $v1){
      if(isset($v1['nomDeLaFonctionAappeler'])){
       if($txt1!='') $txt1.=','.CRLF;
       $txt1.=' '.json_encode($v1,JSON_FORCE_OBJECT).'';
      }
     }
     $o1.=' arrayLocalJs=['.CRLF.$txt1.CRLF.' ];'.CRLF;
     $o1.=' executerCesActionsPourLaPageLocale(arrayLocalJs);'.CRLF;
     $o1.='}'.CRLF;
    }else{
     $o1.='function fonctionDeLaPageAppeleeQuandToutEstCharge(){ /* do nothing */};'.CRLF;
    }
    $o1.='</script>'.CRLF;
    
    
    $o1=$o1.'</body></html>'.CRLF;
    return($o1);
}
