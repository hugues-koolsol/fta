<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_dossiers1.php');

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible avant d\'accéder aux dossiers'  );
   recharger_la_page('zz_cibles1.php'); 
}

$o1='';
$o1=html_header1(array('title'=>'Dossiers' , 'description'=>'Dossiers' , 'pas_de_menu' => true ));
print($o1);$o1='';

$o1.='<h1>Choisir un dossier de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';

/*
  =====================================================================================================================
*/

$__nbMax=20;
$__debut=0;
$__xpage=0;

if(isset($_GET['__xpage'])&&is_numeric($_GET['__xpage'])){
 $__xpage=$_GET['__xpage'];
}else{
 if(isset($_SESSION[APP_KEY][NAV][BNF]['__xpage'])) $__xpage=$_SESSION[APP_KEY][NAV][BNF]['__xpage'];
}

$chi_id_dossier          = sauvegarderLesParametresDeRecherche('choix_chi_id_dossier'          , BNF);
$chp_nom_dossier         = sauvegarderLesParametresDeRecherche('choix_chp_nom_dossier'         , BNF);

$autofocus='chi_id_dossier';
     if($chi_id_dossier!=''){          $autofocus='chi_id_dossier';          } 
else if($chp_nom_dossier!=''){         $autofocus='chp_nom_dossier';         }


$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_dossier">id dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_dossier" id="chi_id_dossier"   value="'.enti1($chi_id_dossier).'"  size="8" maxlength="32"  '.($autofocus=='chi_id_dossier'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="xsrch_chp_nom_dossier">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_dossier" id="chp_nom_dossier"   value="'.enti1($chp_nom_dossier).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_dossier'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF; // &#128270;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$__xpage.'" />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <input type="text" value="'.$_GET['__nom_champ_dans_parent'].'" name="__nom_champ_dans_parent" id="__nom_champ_dans_parent" >'.CRLF;


$o1.='</form>'.CRLF;





$__debut=$__xpage*$__nbMax;

$sql='
 SELECT `chi_id_dossier` , `chp_nom_dossier` 
 FROM `tbl_dossiers` `T0`
 WHERE "T0"."chx_cible_dossier" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
';

if($chi_id_dossier!='' && is_numeric($chi_id_dossier)){
 $sql.='
  AND `T0`.`chi_id_dossier` = \''.addslashes1($chi_id_dossier).'\'
 '; 
}

if($chp_nom_dossier!='' ){
 $sql.='
  AND `T0`.`chp_nom_dossier` LIKE \'%'.addslashes1($chp_nom_dossier).'%\'
 '; 
}

$sql.=' LIMIT '.addslashes1($__nbMax).' OFFSET '.addslashes1($__debut).';';


$data0=array();


$db = new SQLite3('../fta_inc/db/system.db');
$stmt = $db->prepare($sql);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM))
  {
   array_push($data0, array(
    'T0_chi_id_dossier'          => $arr[0],
    'T0_chp_nom_dossier'         => $arr[1],
   ));
  }
  $stmt->close(); 
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
}

 

$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>nom</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0=>$v0){
 
 $lsttbl.='<tr>';
 $lsttbl.='<td data-label="" style="text-align:left!important;">';
 $lsttbl.='<div class="yyflex1">';
 $lsttbl.=' <a class="yyinfo yytxtSiz1" href="javascript:choisir_de_iframe1(\''.encrypter($v0['T0_chi_id_dossier']).'\',\''.$_GET['__nom_champ_dans_parent'].'\')" title="choisir">✎</a>';
 $lsttbl.='</div>';
 
 $lsttbl.='</td>';
 
 $lsttbl.='<td data-label="id" style="text-align:center;">';
 $lsttbl.=''.$v0['T0_chi_id_dossier'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td data-label="id" style="text-align:left;">';
 $lsttbl.=''.$v0['T0_chp_nom_dossier'].'';
 $lsttbl.='</td>';
 
 
 $lsttbl.='<tr>';
}

$o1.='<table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table>'.CRLF;



/*
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement,'ne_pas_supprimer_les_valeurs_de_session_sur_un_choix'=>true);
$o1.=html_footer1($par);
print($o1);$o1='';
