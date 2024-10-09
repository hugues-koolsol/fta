<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true);
/* sess,bdd*/

if(!isset($_SESSION[APP_KEY]['cible_courante'])){

    ajouterMessage('info',__LINE__.' : veuillez sélectionner une cible avec le bouton ⇒ ');
    recharger_la_page('zz_cibles_l1.php');

}

/*
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'bdds', 'description' => 'bdds'));
print($o1);
$o1='';
$o1.='<h1>Liste des bases de données</h1>';
/*
  =====================================================================================================================
*/
$__nbMax=20;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
$chi_id_basedd=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_basedd',BNF);
$chp_nom_basedd=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_basedd',BNF);
$autofocus='chi_id_basedd';

if($chi_id_basedd != ''){

    $autofocus='chi_id_basedd';

}else if($chp_nom_basedd != ''){

    $autofocus='chp_nom_basedd';

}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_basedd">id base</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_basedd" id="chi_id_basedd"   value="'.enti1($chi_id_basedd).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_basedd')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_basedd">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_basedd" id="chp_nom_basedd"   value="'.enti1($chp_nom_basedd).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_nom_basedd')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='</form>'.CRLF;
$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*$__nbMax;
sql_inclure_reference(15);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_15.php');
/*
SELECT 
`T0`.`chi_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_commentaire_basedd`
 FROM b1.tbl_bdds T0
WHERE (/ *  * / `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd
 AND `T0`.`chi_id_basedd` = :T0_chi_id_basedd
 AND `T0`.`chp_nom_basedd` LIKE :T0_chp_nom_basedd)
 ORDER BY  `T0`.`chi_id_basedd` ASC
 LIMIT :quantitee OFFSET :debut ;

*/
/*sql_inclure_fin*/

$tt=sql_15(array(
    'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    'T0_chi_id_basedd' => $chi_id_basedd,
    'T0_chp_nom_basedd' => (($chp_nom_basedd === NULL)?$chp_nom_basedd:(($chp_nom_basedd === '')?'':'%'.$chp_nom_basedd.'%')),
    'quantitee' => $__nbMax,
    'debut' => $__debut,
    'page_courante' => BNF));

if($tt['statut'] === false){

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
$consUrlRedir='';
$consUrlRedir.=(($chi_id_basedd !== '')?'&amp;chi_id_basedd='.rawurlencode($chi_id_basedd):'');
$consUrlRedir.=(($chp_nom_basedd !== '')?'&amp;chp_nom_basedd='.rawurlencode($chp_nom_basedd):'');
$o1.=construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,'<a class="yyinfo" href="zz_bdds_a1.php?__action=__creation">Créer une base</a> <a class="yysucces" href="svg_de_la_base.php?__id_des_bases=0">Créer une 🍥</a>');
$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>nom</th>';
$lsttbl.='<th>commentaire</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($tt['valeur'] as $k0 => $v0){
    $lsttbl.='<tr>';
    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';
    $lsttbl.=' <a class="yyinfo" href="zz_bdds_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_basedd'].'" title="modifier">✎</a>';
    $lsttbl.=' <a class="yyinfo"  href="svg_de_la_base.php?__id_des_bases='.$v0['T0.chi_id_basedd'].'" title="svg">🍥</a>';

    if(('fta' === APP_KEY) && ($v0['T0.chi_id_basedd'] == 1)){

        $lsttbl.=' <a class="yyunset"  title="supprimer">🗑</a>';

    }else{

        $lsttbl.=' <a class="yydanger" href="zz_bdds_a1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_basedd'].'" title="supprimer">🗑</a>';
    }

    $lsttbl.='</div>';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:center;">';
    $lsttbl.=''.$v0['T0.chi_id_basedd'].'';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.$v0['T0.chp_nom_basedd'].'';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:left;">';

    if($v0['T0.chp_commentaire_basedd'] !== null){

        $lsttbl.=''.enti1(mb_substr($v0['T0.chp_commentaire_basedd'],0,50,'UTF-8')).'';

    }

    $lsttbl.='</td>';
    $lsttbl.='<tr>';
}
$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;
$o1.=''.CRLF;

/*
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);
$o1='';
?>