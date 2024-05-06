<?php
date_default_timezone_set('Europe/Paris');
define("APP_KEY","fta");
define("BACKUP_PATH",'..'.DIRECTORY_SEPARATOR.APP_KEY.'_backup');
define("INCLUDE_PATH",'..'.DIRECTORY_SEPARATOR.APP_KEY.'_inc');
define("NAV","NAV");
define("CRLF","\r\n");
define("OK","OK");
define("MESSAGES","messages");
define("INPUT","input");
define("VALUE","value");
define("STATUS","status");


$GLOBALS['__date']=date('Y-m-d H:i:s');
/*===================================================================================================================*/
function recharger_la_page($a){
    header("HTTP/1.1 303 See Other");
    header('Location: '.$a);
    exit(0);
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

/*
  =====================================================================================================================
*/
function le_dossier_est_vide($dossier){
    if(is_dir($dossier)){
        return (count(scandir($dossier)) == 2);
    }else{
        return true;
    }
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
//========================================================================================================================
function cleanSession1(){
 if(isset($_GET['idMenu'])&&is_numeric($_GET['idMenu'])){
  xcleanSession1( array( 'except' => '' ) );
 }else{
  xcleanSession1( array( 'except' => BNF ) );
 }
}
//========================================================================================================================
function xcleanSession1($par){
 if(isset($_SESSION[APP_KEY][NAV])){
  foreach($_SESSION[APP_KEY][NAV] as $k=>$v){
   if($par['except']!=$k){
    unset($_SESSION[APP_KEY][NAV][$k]);
   }
  }
 }
 if(isset($_SESSION[APP_KEY]['choose'])) unset($_SESSION[APP_KEY]['choose']);
}

//========================================================================================================================
function sauvegarderLesParametresDeRecherche( $k , $bnf){
 $ret='';
 $ret = $_GET[$k]??'';
 if(isset($_GET[$k])){
  $_SESSION[APP_KEY][NAV][$bnf][$k]=$_GET[$k];
  $ret=$_GET[$k];
 }else{
  if(isset($_SESSION[APP_KEY][NAV][$bnf][$k])){
   $ret=$_SESSION[APP_KEY][NAV][$bnf][$k];
  }else{
   $ret='';
  }
 }
 return($ret);
}
//========================================================================================================================
function enti1($s){
 return htmlentities( $s , ENT_COMPAT , 'utf-8' ) ;
}
//========================================================================================================================
function addslashes1($s){
 $s=SQLite3::escapeString($s);
 $ua=array(    'à' => 'à' , 'â' => 'â' ,'ã' => 'ã' , 'á' => 'á' ,
               'é' => 'é' , 'è' => 'è' ,'ê' => 'ê' , 'É' => 'É' , 
               'ï' => 'ï' , 'î' => 'î' ,
               'ñ' => 'ñ' , 'Ñ' => 'Ñ' ,
               'ó' => 'ó' , 'ô' => 'ô' , 'ö' => 'ö' , 
               'ü' => 'ü' , 'Ü' => 'Ü' , 
 ); 
 return strtr( $s, $ua );  
}

/*
  =====================================================================================================================
*/  
function ajouterMessage($type_de_message , $message , $page='' ){
 
 $tableauTypeMessage=array('normal' , 'succes' , 'info' , 'erreur' , 'danger' , 'avertissement');

 if($page===''){
  if(!isset($_SESSION[APP_KEY][NAV])){
   foreach( $tableauTypeMessage as $v1){
    $_SESSION[APP_KEY][NAV][$v1]=array();
   }

  }
  if(in_array($type_de_message , $tableauTypeMessage)){
   $_SESSION[APP_KEY][NAV][$type_de_message][]=$message;
  }else{
   $_SESSION[APP_KEY][NAV]['erreur'][]='MESSAGE AVEC UN MAUVAIS TYPE "'.$type_de_message.'" '.$message;
  }
 }else{
  if(!isset($_SESSION[APP_KEY][NAV][$page])){
   foreach($tableauTypeMessage as $v1){
    $_SESSION[APP_KEY][NAV][$page][$v1]=array();
   }
  }
  if(in_array($type_de_message , $tableauTypeMessage)){
   $_SESSION[APP_KEY][NAV][$page][$type_de_message][]=$message;
  }else{
   $_SESSION[APP_KEY][NAV][$page]['erreur'][]='MESSAGE AVEC UN MAUVAIS TYPE "'.$type_de_message.'" '.$message;
  }
 }
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV] , true ) . '</pre>' ; exit(0);
}
/*
  =====================================================================================================================
*/  
function recupereLesMessagesDeSession($f){
 
 $les_messages_a_afficher='';
 
 $tableauTypeMessage=array('normal' , 'succes' , 'info' , 'erreur' , 'danger' , 'avertissement');
 foreach( $tableauTypeMessage as $v1){
     if(isset($_SESSION[APP_KEY][NAV][$f][$v1])){
      if(count($_SESSION[APP_KEY][NAV][$f][$v1])>0){
       foreach($_SESSION[APP_KEY][NAV][$f][$v1] as $kerr => $verr ){
        $les_messages_a_afficher.='<div class="yymessageBox yy'.$v1.'">' . $verr . '</div>'.CRLF;
       }
      }
      unset($_SESSION[APP_KEY][NAV][$f][$v1]);
     }
     if(isset($_SESSION[APP_KEY][NAV][$v1])){
      if(count($_SESSION[APP_KEY][NAV][$v1])>0){
       foreach($_SESSION[APP_KEY][NAV][$v1] as $kerr => $verr ){
        $les_messages_a_afficher.='<div class="yymessageBox yy'.$v1.'">' . $verr . '</div>'.CRLF;
       }
      }
      unset($_SESSION[APP_KEY][NAV][$v1]);
     }
 }

 if($les_messages_a_afficher!==''){
     $les_messages_a_afficher='<a class="yyavertissement" style="float:inline-end" href="javascript:masquerLesMessage(&quot;zone_global_messages&quot;)">masquer les messages</a>'.$les_messages_a_afficher;
 }
 return $les_messages_a_afficher;
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
    $o1.='  <title>'.($p['title']??'titre de la page à compléter').'</title>'.CRLF;
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
        $o1.='          <li><a class="'.('zz_cibles1.php'===BNF?'yymenusel1':'').'" href="zz_cibles1.php?idMenu='.($idMenu++).'">cibles</a></li>'.CRLF;
        $o1.='          <li><a class="'.('zz_dossiers1.php'===BNF?'yymenusel1':'').'" href="zz_dossiers1.php?idMenu='.($idMenu++).'">dossiers</a></li>'.CRLF;
    }
    $o1.='        </ul>'.CRLF;
    $o1.='      </div>'.CRLF;
    $o1.='    </div>'.CRLF;
    if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){
      $o1.='    <div class="yydivBoutonquit">'.CRLF;
      $o1.='      <a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yydanger">×</a>'.CRLF;
      $o1.='    </div>'.CRLF;
    }else{
      if(BNF!=='aa_login.php'){
       $o1.='    <div class="yydivhomequit"><a id="buttonQuit2" href="aa_login.php?a=logout" alt="" class="yysucces">🔑</a></div>'.CRLF;
      }
    }
    $o1.='  </nav>'.CRLF;
    $o1.='    <main id="contenuPrincipal">'.CRLF;
    
    $o1=$o1.' <div id="zone_global_messages" style="">'.recupereLesMessagesDeSession(BNF).'</div>'.CRLF;
    return($o1);
}
//========================================================================================================================
function supprimerLesParametresDeNavigationEnSession(){
 if(isset($_GET['idMenu'])){
  $sauf='';
  xcleanSession1( array( 'except' => '' ) );
 }else{
  $sauf=BNF;
  xcleanSession1( array( 'except' => BNF ) );
 }
 
 if(isset($_SESSION[APP_KEY][NAV])){
  foreach($_SESSION[APP_KEY][NAV] as $k=>$v){
   if($sauf!=$k){
    unset($_SESSION[APP_KEY][NAV][$k]);
   }
  }
 }
 if(isset($_SESSION[APP_KEY]['valeurPourChoixCroise'])){
  unset($_SESSION[APP_KEY]['valeurPourChoixCroise']);
 }
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
            if($v1!==''){
                $o1=$o1.'  <script type="text/javascript" src="'.$v1.'" defer></script>'.CRLF;
            }
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
    supprimerLesParametresDeNavigationEnSession();
    return($o1);
}
