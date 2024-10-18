<?php
define("BNF",basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true); // sess,bdd


if(( !(isset($_SESSION[APP_KEY]['cible_courante'])))){

    ajouterMessage('info',__LINE__.' : veuillez sélectionner une cible avant d\'accéder aux sources');
    recharger_la_page('zz_cibles_l1.php');

}

/*
  =====================================================================================================================
*/

function obtenir_entete_de_la_page(){

    $o1='';
    $o1=html_header1(array( 'title' => 'Sources', 'description' => 'Sources'));
    $o1.='<h1>Liste des sources de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';
    return(array( 'status' => true, 'value' => $o1));

}
/*
  =====================================================================================================================
*/
$o1=obtenir_entete_de_la_page();
print($o1['value']);
$o1='';
$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;
$__debut=0;
$__nbEnregs=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
$chi_id_source=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_source',BNF);
$chp_nom_source=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_source',BNF);
$chp_nom_dossier=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_dossier',BNF);
$chi_id_dossier=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_dossier',BNF);
$chp_type_source=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_type_source',BNF);

$autofocus='chi_id_source';

if(($chp_nom_source != '')){

    $autofocus='chp_nom_source';

}else if(($chp_type_source != '')){

    $autofocus='chp_type_source';

}else if(($chp_nom_dossier != '')){

    $autofocus='chp_nom_dossier';

}else if(($chi_id_source != '')){

    $autofocus='chi_id_source';

}else if(($chi_id_dossier != '')){

    $autofocus='chi_id_dossier';

}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_source">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_source" id="chp_nom_source"   value="'.enti1($chp_nom_source).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_nom_source')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_type_source">type</label>'.CRLF;
$o1.='    <input  type="text" name="chp_type_source" id="chp_type_source"   value="'.enti1($chp_type_source).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_type_source')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_dossier">dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_dossier" id="chp_nom_dossier"   value="'.enti1($chp_nom_dossier).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_nom_dossier')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_source">id</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_source" id="chi_id_source"   value="'.enti1($chi_id_source).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_source')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_dossier">id dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_dossier" id="chi_id_dossier"   value="'.enti1($chi_id_dossier).'"  size="8" maxlength="64"  '.(($autofocus == 'chi_id_dossier')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='</form>'.CRLF;
$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*($__nbMax);
sql_inclure_reference(61);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_61.php');
/*
SELECT 
`T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
`T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
`T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
 FROM b1.tbl_sources T0
 LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source

 LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source

WHERE (`T0`.`chx_cible_id_source` = :T0_chx_cible_id_source 
   AND `T0`.`chi_id_source` = :T0_chi_id_source 
   AND `T0`.`chp_nom_source` LIKE :T0_chp_nom_source 
   AND `T0`.`chp_type_source` LIKE :T0_chp_type_source 
   AND `T2`.`chp_nom_dossier` LIKE :T2_chp_nom_dossier 
   AND `T0`.`chx_dossier_id_source` = :T0_chx_dossier_id_source) 
ORDER BY  `T0`.`chp_nom_source` ASC LIMIT :quantitee OFFSET :debut ;

*/
/*sql_inclure_fin*/

$tt=sql_61(array(
    'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    'T0_chi_id_source'       => $chi_id_source,
    'T0_chp_nom_source' => (($chp_nom_source === NULL)?$chp_nom_source:(($chp_nom_source === '')?'':'%'.$chp_nom_source.'%')),
    'T0_chp_type_source' => (($chp_type_source === NULL)?$chp_type_source:(($chp_type_source === '')?'':'%'.$chp_type_source.'%')),
    'T2_chp_nom_dossier' => (($chp_nom_dossier === NULL)?$chp_nom_dossier:(($chp_nom_dossier === '')?'':'%'.$chp_nom_dossier.'%')),
    'T0_chx_dossier_id_source' => $chi_id_dossier ,
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

$consUrlRedir=''.'&amp;chi_id_source='.rawurlencode($chi_id_source).'&amp;chp_nom_source='.rawurlencode($chp_nom_source).'&amp;chp_nom_dossier='.rawurlencode($chp_nom_dossier).'';
$consUrlRedir='';
$consUrlRedir.=$chi_id_source          !==''?'&amp;chi_id_source='.rawurlencode($chi_id_source):'';
$consUrlRedir.=$chp_nom_source         !==''?'&amp;chp_nom_source='.rawurlencode($chp_nom_source):'';
$consUrlRedir.=$chp_nom_dossier        !==''?'&amp;chp_nom_dossier='.rawurlencode($chp_nom_dossier):'';





$o1.=construire_navigation_pour_liste( $__debut , $__nbMax , $__nbEnregs , $consUrlRedir , '<a class="yyinfo" href="zz_sources_a1.php?__action=__creation">Créer un nouveau source</a>' );


$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>nom</th>';
$lsttbl.='<th>type</th>';
$lsttbl.='<th>dossier</th>';
$lsttbl.='<th>commentaire</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($tt['valeur'] as $k0 => $v0){
    $lsttbl.='<tr>';
    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';
    $lsttbl.=' <a class="yyinfo" href="zz_sources_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_source'].'" title="modifier">✎</a>';
    
    $lsttbl.=' <a class="yydanger" href="zz_sources_a1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_source'].'" title="supprimer">🗑</a>';
    
    if( 
         ( $v0['T0.chp_type_source']==='normal' || $v0['T0.chp_type_source']==='module_js' ) 
      && ( 
              substr($v0['T0.chp_nom_source'],-4)==='.php' 
           || substr($v0['T0.chp_nom_source'],-3)==='.js' 
           || substr($v0['T0.chp_nom_source'],-5)==='.html' 
           || substr($v0['T0.chp_nom_source'],-4)==='.htm' 
           || substr($v0['T0.chp_nom_source'],-4)==='.sql' 
         ) 
    ){
     $lsttbl.=' <a class="yyavertissement" href="javascript:convertir_un_source_sur_disque('.$v0['T0.chi_id_source'].')" title="convertir un source sur disque">😊</a>';
    }else{
     $lsttbl.='<a  class=" yyunset"  title="convertir un source">😊</a>';
    }
    
    $lsttbl.='</div>';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:center;">';
    $lsttbl.=''.$v0['T0.chi_id_source'].'';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.$v0['T0.chp_nom_source'].'';
    $lsttbl.='</td>';
    
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.$v0['T0.chp_type_source'].'';
    $lsttbl.='</td>';
    
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.='('.$v0['T0.chx_dossier_id_source'].')'.$v0['T2.chp_nom_dossier'].'';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:left;">';
    if($v0['T0.chp_commentaire_source']!==null){
        $lsttbl.=''.enti1(mb_substr($v0['T0.chp_commentaire_source'],0,50,'UTF-8')).'';
    }
    $lsttbl.='</td>';
    $lsttbl.='<tr>';
}
$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;
/*
  ============================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 
 'js_a_inclure' => array( 
  'js/pour_zz_source1.js', 
  'js/convertit-php-en-rev0.js', 'js/php.js' , 'js/convertit-html-en-rev1.js',  'js/convertit-js-en-rev1.js' , 'js/javascript.js'  , 

  'js/sql.js' , 'js/convertion_sql_en_rev.js' , 'js/jslib/sqlite_parser_from_demo.js' ), 
 'module_a_inclure' => array('js/module_html.js'), 
 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.='<script type="text/javascript">'.CRLF.file_get_contents(INCLUDE_PATH.DIRECTORY_SEPARATOR.'sql/aa_js_sql.js').'</script>'; 
$o1.=html_footer1($par);
print($o1);
$o1='';
?>