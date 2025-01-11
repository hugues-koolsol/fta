<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ true);

if(!(isset($_SESSION[APP_KEY]['cible_courante']))){

    ajouterMessage('info',__LINE__ . ' : veuillez sélectionner une cible avec le bouton ⇒ ');
    recharger_la_page('zz_cibles_l1.php');

}

/*
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'bdds', 'description' => 'bdds'));
print($o1);
$o1='';
$o1 .= '<h1>Liste des bases de données</h1>';
$o1='';
$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);

if(isset($_GET['button_chercher'])){

    $__xpage=0;

}else{

    $__xpage=(int)($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']);
}

$__nbEnregs=0;
$chi_id_basedd=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_basedd',BNF);
$chp_nom_basedd=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_basedd',BNF);
$autofocus='chi_id_basedd';

if($chi_id_basedd != ''){

    $autofocus='chi_id_basedd';

}else if($chp_nom_basedd != ''){

    $autofocus='chp_nom_basedd';

}

$o1 .= '<form method="get" class="yyfilterForm">' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chi_id_basedd">id base</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chi_id_basedd" id="chi_id_basedd"   value="' . enti1($chi_id_basedd) . '"  size="8" maxlength="32"  ' . ($autofocus == 'chi_id_basedd' ? 'autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chp_nom_basedd">nom</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chp_nom_basedd" id="chp_nom_basedd"   value="' . enti1($chp_nom_basedd) . '"  size="8" maxlength="64"  ' . ($autofocus == 'chp_nom_basedd' ? 'autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . html_du_bouton_rechercher_pour_les_listes() . PHP_EOL . '   </div>' . PHP_EOL;
$o1 .= '</form>' . PHP_EOL;
$__debut=$__xpage * $__nbMax;
sql_inclure_reference(15);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH . '/sql/sql_15.php');
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
    'T0_chp_nom_basedd' => ($chp_nom_basedd === null ? $chp_nom_basedd : ($chp_nom_basedd === '' ? '' : '%' . $chp_nom_basedd . '%')),
    'quantitee' => $__nbMax,
    'debut' => $__debut,
    'page_courante' => BNF
));

if($tt[__xst] === false){

    $o1 .= '<div>';
    $o1 .= '<div class="yydanger">Erreur sql</div>';
    $o1 .= '<pre>' . $tt['sql0'] . '</per>';
    $o1 .= '</div>';
    $par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => array());
    $o1 .= html_footer1($par);
    print($o1);
    $o1='';
    exit(0);

}

$__nbEnregs=$tt['nombre'];
$consUrlRedir='';
$consUrlRedir .= ($chi_id_basedd !== '' ? '&amp;chi_id_basedd=' . rawurlencode($chi_id_basedd) : '');
$consUrlRedir .= ($chp_nom_basedd !== '' ? '&amp;chp_nom_basedd=' . rawurlencode($chp_nom_basedd) : '');
$o1 .= construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$__xpage,'<a class="yyinfo" href="zz_bdds_a1.php?__action=__creation">Créer une base</a>');
$lsttbl='';
$lsttbl .= '<thead><tr>';
$lsttbl .= '<th>action</th>';
$lsttbl .= '<th>id</th>';
$lsttbl .= '<th>nom</th>';
$lsttbl .= '<th>commentaire</th>';
$lsttbl .= '</tr></thead><tbody>';
foreach($tt[__xva] as $k0 => $v0){
    $lsttbl .= '<tr>';
    $lsttbl .= '<td data-label="" style="text-align:left!important;">';
    $lsttbl .= '<div class="yyflex1">';
    $lsttbl .= ' <a class="yyinfo" href="zz_bdds_a1.php?__action=__modification&amp;__id=' . $v0['T0.chi_id_basedd'] . '" title="modifier">✎</a>';
    $lsttbl .= ' <a class="yyinfo"  href="svg_de_la_base.php?__id_des_bases=' . $v0['T0.chi_id_basedd'] . '" title="svg">🍥</a>';

    if(('fta' === APP_KEY) && ($v0['T0.chi_id_basedd'] == 1)){

        $lsttbl .= ' <a class="yyunset"  title="supprimer">🗑</a>';

    }else{

        $lsttbl .= ' <a class="yydanger" href="zz_bdds_a1.php?__action=__suppression&amp;__id=' . $v0['T0.chi_id_basedd'] . '" title="supprimer">🗑</a>';
    }

    $lsttbl .= '</div>';
    $lsttbl .= '</td>';
    $lsttbl .= '<td style="text-align:center;">';
    $lsttbl .= '' . $v0['T0.chi_id_basedd'] . '';
    $lsttbl .= '</td>';
    $lsttbl .= '<td style="text-align:left;">';
    $lsttbl .= '' . $v0['T0.chp_nom_basedd'] . '';
    $lsttbl .= '</td>';
    $lsttbl .= '<td style="text-align:left;">';

    if($v0['T0.chp_commentaire_basedd'] !== null){

        $lsttbl .= '' . enti1(mb_substr($v0['T0.chp_commentaire_basedd'],0,50,'UTF-8')) . '';

    }

    $lsttbl .= '</td>';
    $lsttbl .= '<tr>';
}
$o1 .= '<div style="overflow-x:scroll;"><table class="yytableResult1">' . PHP_EOL . $lsttbl . '</tbody></table></div>' . PHP_EOL;
$o1 .= '' . PHP_EOL;
/*
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1 .= html_footer1($par);
print($o1);
$o1='';