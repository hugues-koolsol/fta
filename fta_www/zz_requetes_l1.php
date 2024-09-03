<?php
define("BNF",basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true); // sess,bdd



/*
  =====================================================================================================================
*/

function obtenir_entete_de_la_page(){

    $o1='';
    $o1=html_header1(array( 'title' => 'Requetes', 'description' => 'Requetes'));
    $o1.='<h1>Liste des Requetes </h1>';
    return(array( 'status' => true, 'value' => $o1));

}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;

$o1=obtenir_entete_de_la_page();
print($o1['value']);
$o1='';
$__debut=0;
$__nbEnregs=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
$chi_id_requete=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_requete',BNF);
$cht_rev_requete=recuperer_et_sauvegarder_les_parametres_de_recherche('cht_rev_requete',BNF);
$chp_type_requete=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_type_requete',BNF);

$autofocus='chi_id_requete';

if(($cht_rev_requete != '')){

    $autofocus='cht_rev_requete';

}else if(($chp_type_requete != '')){

    $autofocus='chp_type_requete';

}else if(($chi_id_requete != '')){

    $autofocus='chi_id_requete';


}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_requete">id</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_requete" id="chi_id_requete"   value="'.enti1($chi_id_requete).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_requete')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="cht_rev_requete">rev</label>'.CRLF;
$o1.='    <input  type="text" name="cht_rev_requete" id="cht_rev_requete"   value="'.enti1($cht_rev_requete).'"  size="8" maxlength="64"  '.(($autofocus == 'cht_rev_requete')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_type_requete">type</label>'.CRLF;
$o1.='    <input  type="text" name="chp_type_requete" id="chp_type_requete"   value="'.enti1($chp_type_requete).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_type_requete')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='</form>'.CRLF;
$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*($__nbMax);
$champs0='
 `chi_id_requete`          , `cht_rev_requete` , T0.chp_type_requete 
';
$sql0='SELECT '.$champs0;
$from0='
 FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_requetes `T0`
 
';
$sql0.=$from0;
$where0='
 WHERE   1=1
';

if(($chi_id_requete != '' )){
    $where0.=CRLF.construction_where_sql_sur_id('`T0`.`chi_id_requete`',$chi_id_requete);
}


if(($cht_rev_requete != '')){
    $where0.=CRLF.'AND `T0`.`cht_rev_requete` LIKE \'%'.sq0($cht_rev_requete).'%\'';
}



if(($chp_type_requete != '')){
    $where0.=CRLF.'AND `T0`.`chp_type_requete` LIKE \'%'.sq0($chp_type_requete).'%\'';
}



$sql0.=$where0;
$order0='
 ORDER BY `T0`.`chi_id_requete` DESC
';
$sql0.=$order0;
$plage0=' LIMIT '.sq0($__nbMax).' OFFSET '.sq0($__debut).';';
$sql0.=$plage0;
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . $sql0  . '</pre>' ; exit(0);
$data0=array();


//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);

$stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);

if(($stmt0 !== false)){

    $res0=$stmt0->execute();
    while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
        $data0[]=array(
            'T0.chi_id_requete' => $tab0[0],
            'T0.cht_rev_requete' => $tab0[1],
            'T0.chp_type_requete' => $tab0[2],
        );
            
    }
    $stmt0->close();
    $__nbEnregs=count($data0);

    if(($__nbEnregs >= $__nbMax || $_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

        $sql1='SELECT COUNT(*) '.$from0.$where0;
        $__nbEnregs=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql1);

    }


}else{

    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),true).'</pre>' ;
    exit(0);
}

$consUrlRedir=''.'&amp;chi_id_requete='.rawurlencode($chi_id_requete).'&amp;cht_rev_requete='.rawurlencode($cht_rev_requete).'&amp;chp_type_requete='.rawurlencode($chp_type_requete).'';
$__bouton_enregs_suiv=' <span class="yybtn yyunset">&raquo;</span>';

if(($__debut+$__nbMax < $__nbEnregs)){

    $__bouton_enregs_suiv=' <a href="'.BNF.'?__xpage='.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).$consUrlRedir.'">&raquo;</a>';

}

$__bouton_enregs_prec=' <span class="yybtn yyunset">&laquo;</span>';

if(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

    $__bouton_enregs_prec=' <a href="'.BNF.'?__xpage='.($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']-1).$consUrlRedir.'">&laquo;</a>';

}

$o1.='<div><form method="post" class="yylistForm1">';
$o1.=' <a class="yyinfo" href="zz_requetes_a1.php?__action=__creation">Créer une nouvelle requete</a>'.CRLF;
$o1.=' '.$__bouton_enregs_prec.' '.$__bouton_enregs_suiv;
$o1.=' <div style="display:inline-block;">';
if(($__nbEnregs > 0)){
    $o1.='page '.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).'/'.ceil($__nbEnregs/($__nbMax)).' ('.$__nbEnregs.' enregistrements )</div>'.CRLF;
}else{
    $o1.='pas d\'enregistrement'.CRLF;
}
$o1.='</div>';
$o1.='</form></div>';
$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>rev</th>';
$lsttbl.='<th>type</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0 => $v0){
    $lsttbl.='<tr>';

    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';

    $lsttbl.=' <a class="yyinfo" href="zz_requetes_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_requete'].'" title="modifier">✎</a>';
    $lsttbl.=' <a class="yydanger" href="zz_requetes_l1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_requete'].'" title="supprimer">x</a>';

    $lsttbl.='</div>';
    $lsttbl.='</td>';

    $lsttbl.='<td style="text-align:center;">'.$v0['T0.chi_id_requete'].'</td>';
    
    $lsttbl.='<td style="text-align:left;">'.enti1(mb_substr($v0['T0.cht_rev_requete'],0,200)).'</td>';
    
    $lsttbl.='<td style="text-align:left;">'.$v0['T0.chp_type_requete'].'</td>';

    $lsttbl.='</tr>';
}
$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;

/* $o1.= __FILE__ . ' ' . __LINE__ . ' $tab0 = <pre>' . var_export( $data0 , true ) . '</pre>' ;*/
/*
  ============================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( '' ), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);
$o1='';
?>