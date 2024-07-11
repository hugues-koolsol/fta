<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true); // sess,bdd

require_once('../fta_inc/db/acces_bdd_dossiers1.php');

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible avant d\'accéder aux dossiers'  );
   recharger_la_page('zz_cibles_l1.php'); 
}

$o1='';
$o1=html_header1(array('title'=>'Dossiers' , 'description'=>'Dossiers' , 'pas_de_menu' => true ));
print($o1);$o1='';

$o1.='<h1>Choisir un dossier de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';

/*
  =====================================================================================================================
*/
if(isset($_GET['__parametres_choix'])){
 
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_GET['__parametres'] , true ) . '</pre>' ; exit(0);
 $__parametres_choix_json=json_decode($_GET['__parametres_choix'],true);
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__parametres_choix_json , true ) . '</pre>' ; exit(0);
 
// {"__champs_texte_a_rapatrier":["chp_nom_dossier"],"__nom_champ_dans_parent":"chx_dossier_id_source"}'
 $_SESSION[APP_KEY][BNF]['__parametres_choix']=$__parametres_choix_json;
 
}

$__nbMax=20;
$__debut=0;
$__xpage=0;

$__xpage                 = recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage'           , BNF);
$chi_id_dossier          = recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_dossier'   , BNF);
$chp_nom_dossier         = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_dossier'   , BNF);

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
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <input type="hidden" value="'.enti1($_SESSION[APP_KEY][BNF]['__parametres_choix']['__nom_champ_dans_parent']).'"    name="__nom_champ_dans_parent"    id="__nom_champ_dans_parent" >'.CRLF;
$o1.='   <input type="hidden" value="'.enti1(json_encode($_SESSION[APP_KEY][BNF]['__parametres_choix']['__champs_texte_a_rapatrier'])).'" name="__champs_texte_a_rapatrier" id="__champs_texte_a_rapatrier" >'.CRLF;


$o1.='</form>'.CRLF;





$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*$__nbMax;

$sql='
 SELECT `chi_id_dossier` , `chp_nom_dossier` 
 FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_dossiers` `T0`
 WHERE "T0"."chx_cible_dossier" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
';

if($chi_id_dossier!='' && is_numeric($chi_id_dossier)){
 $sql.='
  AND `T0`.`chi_id_dossier` = \''.sq0($chi_id_dossier).'\'
 '; 
}

if($chp_nom_dossier!='' ){
 $sql.='
  AND `T0`.`chp_nom_dossier` LIKE \'%'.sq0($chp_nom_dossier).'%\'
 '; 
}

$sql.=' LIMIT '.sq0($__nbMax).' OFFSET '.sq0($__debut).';';

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);

$data0=array();



$stmt = $GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM))
  {
   array_push($data0, array(
    'T0.chi_id_dossier'          => $arr[0],
    'T0.chp_nom_dossier'         => $arr[1],
   ));
  }
  $stmt->close(); 
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() , true ) . '</pre>' ; exit(0);
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
 
 $__champs_texte_a_rapatrier=array();
 foreach( $_SESSION[APP_KEY][BNF]['__parametres_choix']['__champs_texte_a_rapatrier'] as $__k1 => $__v1){
  $__champs_texte_a_rapatrier[$__k1]['__valeur']=$v0[$__k1];
  $__champs_texte_a_rapatrier[$__k1]['__libelle_avant']=$__v1['__libelle_avant'];
  $__champs_texte_a_rapatrier[$__k1]['__libelle_apres']=$__v1['__libelle_apres'];
 }
 
 
 $__json_selection=array(
  '__valeur_champ_id_rapatrie' => encrypter($v0['T0.chi_id_dossier']),
  '__nom_champ_rapatrie' => $_SESSION[APP_KEY][BNF]['__parametres_choix']['__nom_champ_dans_parent'],
  '__champs_texte_a_rapatrier' => $__champs_texte_a_rapatrier,
 );

  $paramUrl=json_encode($__json_selection,JSON_FORCE_OBJECT);
  $paramUrl=str_replace('\\','\\\\',$paramUrl);
  $paramUrl=str_replace('\'','\\\'',$paramUrl);
  $paramUrl=str_replace('"','\\"',$paramUrl);
  $paramUrl=rawurlencode($paramUrl);


 
 $lsttbl.=' <a class="yyinfo" href="javascript:choisir_de_iframe1(\''.enti1($paramUrl).'\')" title="choisir">✎</a>';
 $lsttbl.='</div>';
 
 $lsttbl.='</td>';
 
 $lsttbl.='<td data-label="id" style="text-align:center;">';
 $lsttbl.=''.$v0['T0.chi_id_dossier'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td data-label="id" style="text-align:left;">';
 $lsttbl.=''.$v0['T0.chp_nom_dossier'].'';
 $lsttbl.='</td>';
 
 
 $lsttbl.='<tr>';
}

$o1.='<table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table>'.CRLF;



/*
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement,'ne_pas_supprimer_les_valeurs_de_session_sur_un_choix'=>true);
$o1.=html_footer1($par);
print($o1);$o1='';
