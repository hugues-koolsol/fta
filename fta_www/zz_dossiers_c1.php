<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ true);

if(!(isset($_SESSION[APP_KEY]['cible_courante']))){

    ajouterMessage('info',__LINE__.' : veuillez sélectionner une cible avant d\'accéder aux dossiers');
    recharger_la_page('zz_cibles_l1.php');

}

$o1='';
$o1=html_header1(array( 'title' => 'Dossiers', 'description' => 'Dossiers', 'pas_de_menu' => true));
print($o1);
$o1='';
$o1.='<h1>Choisir un dossier de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';
/*
  =====================================================================================================================
*/

if(isset($_GET['__parametres_choix'])){

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_GET['__parametres'] , true ) . '</pre>' ; exit(0);*/
    $__parametres_choix_json=json_decode($_GET['__parametres_choix'],true);
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__parametres_choix_json , true ) . '</pre>' ; exit(0);*/
    /* {"__champs_texte_a_rapatrier":["chp_nom_dossier"],"__nom_champ_dans_parent":"chx_dossier_id_source"}'*/
    $_SESSION[APP_KEY][BNF]['__parametres_choix']=$__parametres_choix_json;

}

$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??10;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);

if(isset($_GET['button_chercher'])){

    $__xpage=0;

}else{

    $__xpage=(int)($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']);
}

$__nbEnregs=0;
$chi_id_dossier=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_dossier',BNF);
$chp_nom_dossier=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_dossier',BNF);
$autofocus='chi_id_dossier';

if($chi_id_dossier != ''){

    $autofocus='chi_id_dossier';

}else if($chp_nom_dossier != ''){

    $autofocus='chp_nom_dossier';

}

$o1.='<form method="get" class="yyfilterForm">'.PHP_EOL;
$o1.='   <div>'.PHP_EOL;
$o1.='    <label for="chi_id_dossier">id dossier</label>'.PHP_EOL;
$o1.='    <input  type="text" name="chi_id_dossier" id="chi_id_dossier"   value="'.enti1($chi_id_dossier).'"  size="8" maxlength="32"  '.($autofocus == 'chi_id_dossier' ? 'autofocus="autofocus"' : '').' />'.PHP_EOL;
$o1.='   </div>'.PHP_EOL;
$o1.='   <div>'.PHP_EOL;
$o1.='    <label for="xsrch_chp_nom_dossier">nom</label>'.PHP_EOL;
$o1.='    <input  type="text" name="chp_nom_dossier" id="chp_nom_dossier"   value="'.enti1($chp_nom_dossier).'"  size="8" maxlength="64"  '.($autofocus == 'chp_nom_dossier' ? 'autofocus="autofocus"' : '').' />'.PHP_EOL;
$o1.='   </div>'.PHP_EOL;
$o1.='   <div>'.html_du_bouton_rechercher_pour_les_listes().PHP_EOL.'   </div>'.PHP_EOL;
$o1.='   <input type="hidden" value="'.enti1($_SESSION[APP_KEY][BNF]['__parametres_choix']['__nom_champ_dans_parent']).'"    name="__nom_champ_dans_parent"    id="__nom_champ_dans_parent" >'.PHP_EOL;
$o1.='   <input type="hidden" value="'.enti1(json_encode($_SESSION[APP_KEY][BNF]['__parametres_choix']['__champs_texte_a_rapatrier'])).'" name="__champs_texte_a_rapatrier" id="__champs_texte_a_rapatrier" >'.PHP_EOL;
$o1.='</form>'.PHP_EOL;
$__debut=$__xpage*$__nbMax;
sql_inclure_reference(53);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_53.php');
/*
  SELECT 
  `T0`.`chi_id_dossier` , `T0`.`chp_nom_dossier`
  FROM b1.tbl_dossiers T0
  WHERE (`T0`.`chi_id_dossier` = :T0_chi_id_dossier 
  AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier 
  AND `T0`.`chp_nom_dossier` LIKE :T0_chp_nom_dossier) 
  ORDER BY  `T0`.`chp_nom_dossier` ASC, `T0`.`chi_id_dossier` DESC LIMIT :quantitee OFFSET :debut ;
*/
/*sql_inclure_fin*/
$tt=sql_53(array(
    'T0_chi_id_dossier' => $chi_id_dossier,
    'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    'T0_chp_nom_dossier' => ($chp_nom_dossier === null ? $chp_nom_dossier : ($chp_nom_dossier === '' ? '' : '%'.$chp_nom_dossier.'%')),
    'quantitee' => $__nbMax,
    'debut' => $__debut,
    'page_courante' => BNF
));

if($tt[__xst] === false){

    $o1.='<div>';
    $o1.='<div class="yydanger">Erreur sql</div>';
    $o1.='<pre>'.$tt['sql0'].'</per>';
    $o1.='</div>';
    $par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => array());
    $o1.=html_footer1($par);
    print($o1);
    $o1='';
    exit(0);

}

$__nbEnregs=$tt['nombre'];
$consUrlRedir='&amp;chi_id_dossier='.rawurlencode($chi_id_dossier).'&amp;chp_nom_dossier='.rawurlencode($chp_nom_dossier).'';
$consUrlRedir='';
$consUrlRedir.=($chi_id_dossier !== '' ? '&amp;chi_id_dossier='.rawurlencode($chi_id_dossier) : '');
$consUrlRedir.=($chp_nom_dossier !== '' ? '&amp;chp_nom_dossier='.rawurlencode($chp_nom_dossier) : '');
$o1.=construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$__xpage,'');
$__lsttbl='';
$__lsttbl.='  <thead><tr>';
$__lsttbl.='<th>action</th>';
$__lsttbl.='<th>id</th>';
$__lsttbl.='<th>nom</th>';
$__lsttbl.='</tr></thead>'.PHP_EOL.'  <tbody>'.PHP_EOL;
foreach($tt[__xva] as $k0 => $v0){
    $__lsttbl.='<tr>';
    $__lsttbl.='<td data-label="" style="text-align:left!important;">';
    $__lsttbl.='<div class="yyflex1">';
    $__champs_texte_a_rapatrier=array();
    foreach($_SESSION[APP_KEY][BNF]['__parametres_choix']['__champs_texte_a_rapatrier'] as $__k1 => $__v1){
        $__champs_texte_a_rapatrier[$__k1]['__valeur']=$v0[$__k1];
        $__champs_texte_a_rapatrier[$__k1]['__libelle_avant']=$__v1['__libelle_avant'];
        $__champs_texte_a_rapatrier[$__k1]['__libelle_apres']=$__v1['__libelle_apres'];
    }
    $__json_selection=array( '__valeur_champ_id_rapatrie' => encrypter($v0['T0.chi_id_dossier']), '__nom_champ_rapatrie' => $_SESSION[APP_KEY][BNF]['__parametres_choix']['__nom_champ_dans_parent'], '__champs_texte_a_rapatrier' => $__champs_texte_a_rapatrier);
    $paramUrl=json_encode($__json_selection,JSON_FORCE_OBJECT);
    $paramUrl=str_replace('\\','\\\\',$paramUrl);
    $paramUrl=str_replace('\'','\\\'',$paramUrl);
    $paramUrl=str_replace('"','\\"',$paramUrl);
    $paramUrl=rawurlencode($paramUrl);
    $__lsttbl.=' <a class="yyinfo" href="javascript:__gi1.choisir_de_iframe2(\''.enti1($paramUrl).'\')" title="choisir">✎</a>';
    $__lsttbl.='</div>';
    $__lsttbl.='</td>';
    $__lsttbl.='<td data-label="id" style="text-align:center;">';
    $__lsttbl.=''.$v0['T0.chi_id_dossier'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td data-label="id" style="text-align:left;">';
    $__lsttbl.=''.$v0['T0.chp_nom_dossier'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<tr>';
}
$o1.='<table class="yytableResult1">'.PHP_EOL.$__lsttbl.'</tbody></table>'.PHP_EOL;
/*
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement, 'ne_pas_supprimer_les_valeurs_de_session_sur_un_choix' => true);
$o1.=html_footer1($par);
print($o1);
$o1='';