<?php
define("BNF",basename(__FILE__));
require_once('aa_include.php');
session_start();
require_once('../fta_inc/db/acces_bdd_sources1.php');

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
$champs0='
 `chi_id_source`          , `chp_nom_source` , T1.chp_nom_dossier , chp_commentaire_source , T0.chx_dossier_id_source , 
  T0.chp_type_source  
';
$sql0='SELECT '.$champs0;
$from0='
 FROM `tbl_sources` `T0`
  LEFT JOIN tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_source  
 
';
$sql0.=$from0;
$where0='
 WHERE  "T0"."chx_cible_id_source" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
';

if(($chi_id_source != '' && is_numeric($chi_id_source))){

    $where0.='
  AND `T0`.`chi_id_source` = \''.sq0($chi_id_source).'\'
 ';

}


if(($chp_nom_source != '')){

    $where0.='
  AND `T0`.`chp_nom_source` LIKE \'%'.sq0($chp_nom_source).'%\'
 ';

}


if(($chp_type_source != '')){

    $where0.='
  AND `T0`.`chp_type_source` LIKE \'%'.sq0($chp_type_source).'%\'
 ';

}

if(($chp_nom_dossier != '')){

    $where0.='
  AND `T1`.`chp_nom_dossier` LIKE \'%'.sq0($chp_nom_dossier).'%\'
 ';

}


if(($chi_id_dossier != '')){

    $where0.='
  AND `T1`.`chi_id_dossier` = \''.sq0($chi_id_dossier).'\'
 ';

}

$sql0.=$where0;
$order0='
 ORDER BY `T0`.`chp_nom_source` ASC
';
$sql0.=$order0;
$plage0=' LIMIT '.sq0($__nbMax).' OFFSET '.sq01($__debut).';';
$sql0.=$plage0;
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . $sql0  . '</pre>' ; exit(0);
$data0=array();
$db=new SQLite3('../fta_inc/db/sqlite/system.db');
$stmt0=$db->prepare($sql0);

if(($stmt0 !== false)){

    $res0=$stmt0->execute();
    while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
        $data0[]=array(
            'T0.chi_id_source' => $tab0[0],
            'T0.chp_nom_source' => $tab0[1],
            'T1.chp_nom_dossier' => $tab0[2],
            'T0.chp_commentaire_source' => $tab0[3],
            'T0.chx_dossier_id_source' => $tab0[4] ,
            'T0.chp_type_source'       => $tab0[5] ,
        );
            
    }
    $stmt0->close();
    $__nbEnregs=count($data0);

    if(($__nbEnregs >= $__nbMax || $_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

        $sql1='SELECT COUNT(*) '.$from0.$where0;
        $__nbEnregs=$db->querySingle($sql1);

    }


}else{

    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
    exit(0);
}

$consUrlRedir=''.'&amp;chi_id_source='.rawurlencode($chi_id_source).'&amp;chp_nom_source='.rawurlencode($chp_nom_source).'&amp;chp_nom_dossier='.rawurlencode($chp_nom_dossier).'';
$__bouton_enregs_suiv=' <a class="yyunset">&raquo;</a>';

if(($__debut+$__nbMax < $__nbEnregs)){

    $__bouton_enregs_suiv=' <a href="'.BNF.'?__xpage='.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).$consUrlRedir.'">&raquo;</a>';

}

$__bouton_enregs_prec=' <a class="yyunset">&laquo;</a>';

if(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

    $__bouton_enregs_prec=' <a href="'.BNF.'?__xpage='.($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']-1).$consUrlRedir.'">&laquo;</a>';

}

$o1.='<div>';
$o1.='<form class="yylistForm1">';
$o1.=' <a class="yyinfo" href="zz_sources_a1.php?__action=__creation">Créer un nouveau source</a>'.CRLF;
$o1.=' '.$__bouton_enregs_prec.' '.$__bouton_enregs_suiv.' <div style="display:inline-block;">';

if(($__nbEnregs > 0)){

    $o1.='page '.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).'/'.ceil($__nbEnregs/($__nbMax)).' ('.$__nbEnregs.' enregistrements )</div>'.CRLF;

}else{

    $o1.='pas d\'enregistrements'.CRLF;
}

$o1.='</form>';
$o1.='</div>';
$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>nom</th>';
$lsttbl.='<th>type</th>';
$lsttbl.='<th>dossier</th>';
$lsttbl.='<th>commentaire</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0 => $v0){
    $lsttbl.='<tr>';
    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';
    $lsttbl.=' <a class="yyinfo yytbnormal" href="zz_sources_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_source'].'" title="modifier">✎</a>';
    
    $lsttbl.=' <a class="yydanger yytbnormal" href="zz_sources_a1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_source'].'" title="supprimer">✕</a>';
    
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
     $lsttbl.=' <a class="yyavertissement yytbnormal" href="javascript:convertir_un_source_sur_disque('.$v0['T0.chi_id_source'].')" title="convertir un source sur disque">😊</a>';
    }else{
     $lsttbl.='<a  class="yytbnormal yyunset"  title="convertir un source">😊</a>';
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
    $lsttbl.='('.$v0['T0.chx_dossier_id_source'].')'.$v0['T1.chp_nom_dossier'].'';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.enti1(mb_substr($v0['T0.chp_commentaire_source'],0,50,'UTF-8')).'';
    $lsttbl.='</td>';
    $lsttbl.='<tr>';
}
$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;
/* $o1.= __FILE__ . ' ' . __LINE__ . ' $tab0 = <pre>' . var_export( $data0 , true ) . '</pre>' ;*/
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
$o1.=html_footer1($par);
print($o1);
$o1='';
?>