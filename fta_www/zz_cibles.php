<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();


$o1='';
$o1=html_header1(array('title'=>'Cibles' , 'description'=>'Cibles'));
print($o1);$o1='';

$o1.='<h1>Liste des systèmes cibles</h1>';

$__nbMax=20;
$__debut=0;
$__count=0;
$__xpage=0;

if(isset($_GET['__xpage'])&&is_numeric($_GET['__xpage'])){
 $__xpage=$_GET['__xpage'];
}else{
 if(isset($_SESSION[APP_KEY][NAV][BNF]['__xpage'])) $__xpage=$_SESSION[APP_KEY][NAV][BNF]['__xpage'];
}

$xsrch_chi_id_cible  =saveSessionSearch1('xsrch_chi_id_cible',BNF);
$xsrch_chp_nom_cible =saveSessionSearch1('xsrch_chp_nom_cible',BNF);
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $xsrch_chp_nom_cible , true ) . '</pre>' ; exit(0);

$autofocus='xsrch_chi_id_cible';
if($xsrch_chi_id_cible!=''){      $autofocus='xsrch_chi_id_cible'; } // fld_priority_todos
else if($xsrch_chp_nom_cible!=''){ $autofocus='xsrch_chp_nom_cible'; } // fld_title_todos

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="xsrch_chi_id_cible">id cible</label>'.CRLF;
$o1.='    <input  type="text" name="xsrch_chi_id_cible" id="xsrch_chi_id_cible"   value="'.enti1($xsrch_chi_id_cible).'"  size="8" maxlength="32"  '.($autofocus=='xsrch_chi_id_cible'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="xsrch_chp_nom_cibl">nom</label>'.CRLF;
$o1.='    <input  type="text" name="xsrch_chp_nom_cible" id="xsrch_chp_nom_cible"   value="'.enti1($xsrch_chp_nom_cible).'"  size="8" maxlength="64"  '.($autofocus=='xsrch_chp_nom_cible'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="xsrch_chp_commentaire_cible">commentaire</label>'.CRLF;
$o1.='    <input  type="text" name="xsrch_chp_commentaire_cible" id="xsrch_chp_commentaire_cible"   value=""  size="8" maxlength="64"   />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF; // &#128270;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$__xpage.'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.=' </form>'.CRLF;


$db = new SQLite3('../fta_inc/db/system.db');

$__debut=$__xpage*$__nbMax;

$sql='
 SELECT chi_id_cible, chp_nom_cible ,  chp_commentaire_cible
 FROM tbl_cibles T0
 WHERE T0.chi_id_cible>=0 
';

if($xsrch_chi_id_cible!='' && is_numeric($xsrch_chi_id_cible)){
 $sql.='
  AND T0.`chi_id_cible` = '.addslashes1($xsrch_chi_id_cible).'
 '; 
}

if($xsrch_chp_nom_cible!='' ){
 $sql.='
  AND T0.`chp_nom_cible` LIKE \'%'.addslashes1($xsrch_chp_nom_cible).'%\'
 '; 
}



$sql.=' LIMIT '.$__nbMax.' OFFSET '.$__debut.';';

$o1.=$sql;

$data0=array();


$stmt = $db->prepare($sql);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM))
  {
   array_push($data0, array(
    'T0.chi_id_cible'          => $arr[0],
    'T0.chp_nom_cible'         => $arr[1],
    'T0.chp_commentaire_cible' => $arr[2],
   ));
  }
  $stmt->close(); 
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
}

if(count($data0)===0){
 $lst='';
 $lst.='<p class="yywarning">'.CRLF;
 $lst.='aucun enregistrement trouvé avec les critères indiqués'.CRLF;
 $lst.='<a class="yysuccess" href="cibles_action1.php?a=c">Créer une nouvelle cible</a>'.CRLF;
 $lst.='</p>'.CRLF;
 $o1.=''.$lst.''.CRLF;  
 
 
}else{
 $lsttbl='';
 $lsttbl.='<thead><tr>';
 $lsttbl.='<th>action</th>';
 $lsttbl.='<th>id</th>';
 $lsttbl.='<th>nom</th>';
 $lsttbl.='<th>commentaire</th>';
 $lsttbl.='</tr></thead><tbody>';
 foreach($data0 as $k0=>$v0){
  $lsttbl.='<tr>';
  $lsttbl.='<td data-label="" style="text-align:left!important;">';
  $lsttbl.='<div class="yyflex1">';
  $lsttbl.='</div>';
  $lsttbl.='</td>';
  
  $lsttbl.='<td data-label="id" style="text-align:center;">';
  $lsttbl.=''.$v0['T0.chi_id_cible'].'';
  $lsttbl.='</td>';
  
  $lsttbl.='<td data-label="id" style="text-align:left;">';
  $lsttbl.=''.$v0['T0.chp_nom_cible'].'';
  $lsttbl.='</td>';
  
  $lsttbl.='<td data-label="id" style="text-align:left;">';
  $lsttbl.=''.$v0['T0.chp_commentaire_cible'].'';
  $lsttbl.='</td>';
  
  $lsttbl.='<tr>';
 }

 $o1.='<table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table>'.CRLF;
 
 $o1.= __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data0 , true ) . '</pre>' ;
}


/*
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';
cleanSession1();