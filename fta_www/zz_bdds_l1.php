<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_bases_de_donnees1.php');

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles_l1.php'); 
}

// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);

/*
  =====================================================================================================================
*/


$o1='';
$o1=html_header1(array('title'=>'bdds' , 'description'=>'bdds'));
print($o1);$o1='';

$o1.='<h1>Liste des bases de données</h1>';

/*
  =====================================================================================================================
*/

$__nbMax=20;
$__debut=0;


$__xpage               = recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage'                 , BNF);
$chi_id_basedd          = recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_basedd'          , BNF);
$chp_nom_basedd         = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_basedd'         , BNF);


$autofocus='chi_id_basedd';
     if($chi_id_basedd!=''){          $autofocus='chi_id_basedd';          } 
else if($chp_nom_basedd!=''){         $autofocus='chp_nom_basedd';         }




$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_basedd">id base</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_basedd" id="chi_id_basedd"   value="'.enti1($chi_id_basedd).'"  size="8" maxlength="32"  '.($autofocus=='chi_id_basedd'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_basedd">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_basedd" id="chp_nom_basedd"   value="'.enti1($chp_nom_basedd).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_basedd'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;



$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF; // &#128270;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='</form>'.CRLF;


$db = new SQLite3('../fta_inc/db/sqlite/system.db');


$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*$__nbMax;

$sql='
 SELECT `chi_id_basedd`          , `chp_nom_basedd` ,  chp_commentaire_basedd 
 FROM `tbl_bases_de_donnees` `T0`
 WHERE "T0"."chx_cible_id_basedd" = '.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].' 
';

if($chi_id_basedd!='' && is_numeric($chi_id_basedd)){
 $sql.='
  AND `T0`.`chi_id_basedd` = \''.addslashes1($chi_id_basedd).'\'
 '; 
}

if($chp_nom_basedd!='' ){
 $sql.='
  AND `T0`.`chp_nom_basedd` LIKE \'%'.addslashes1($chp_nom_basedd).'%\'
 '; 
}




$sql.=' LIMIT '.addslashes1($__nbMax).' OFFSET '.addslashes1($__debut).';';

// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . $sql  . '</pre>' ; exit(0);

$data0=array();


$stmt = $db->prepare($sql);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM))
  {
   array_push($data0, array(
    'T0.chi_id_basedd'          => $arr[0],
    'T0.chp_nom_basedd'         => $arr[1],
    'T0.chp_commentaire_basedd' => $arr[2],
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
$lsttbl.='<th>commentaire</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0=>$v0){
 
 $lsttbl.='<tr>';
 $lsttbl.='<td data-label="" style="text-align:left!important;">';
 
 $lsttbl.='<div class="yyflex1">';
 $lsttbl.=' <a class="yyinfo" href="zz_bdds_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_basedd'].'" title="modifier">✎</a>';//✎ #9998
 $lsttbl.='</div>';
 
 $lsttbl.='</td>';

 
 $lsttbl.='<td style="text-align:center;">';
 $lsttbl.=''.$v0['T0.chi_id_basedd'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td style="text-align:left;">';
 $lsttbl.=''.$v0['T0.chp_nom_basedd'].'';
 $lsttbl.='</td>';
 
 
 $lsttbl.='<td style="text-align:left;">';
 $lsttbl.=''.enti1(mb_substr( $v0['T0.chp_commentaire_basedd'], 0 , 50 , 'UTF-8')).'';
 $lsttbl.='</td>';
 
 
 
 $lsttbl.='<tr>';
}

$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;

$o1.='<a class="yyinfo" href="zz_bdds_a1.php?__action=__creation">Créer une nouvelle base</a>'.CRLF;

// $o1.= __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data0 , true ) . '</pre>' ;



/*
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';
