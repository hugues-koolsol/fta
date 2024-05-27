<?php
define("BNF",basename(__FILE__));
require_once('aa_include.php');
session_start();


/*
  =====================================================================================================================
*/

function obtenir_entete_de_la_page(){

    $o1='';
    $o1=html_header1(array( 'title' => 'Taches', 'description' => 'Taches'));
    $o1.='<h1>Liste des tâches </h1>';
    return(array( 'status' => true, 'value' => $o1));

}
/*
  =====================================================================================================================
*/
$o1=obtenir_entete_de_la_page();
print($o1['value']);
$o1='';
$__nbMax=10;
$__debut=0;
$__nbEnregs=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
$chi_id_tache=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_tache',BNF);
$chp_texte_tache=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_texte_tache',BNF);
$chp_priorite_tache=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_priorite_tache',BNF);

$autofocus='chi_id_tache';

if(($chp_texte_tache != '')){

    $autofocus='chp_texte_tache';

}else if(($chp_priorite_tache != '')){

    $autofocus='chp_priorite_tache';

}else if(($chi_id_tache != '')){

    $autofocus='chi_id_tache';


}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_texte_tache">texte</label>'.CRLF;
$o1.='    <input  type="text" name="chp_texte_tache" id="chp_texte_tache"   value="'.enti1($chp_texte_tache).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_texte_tache')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_priorite_tache">priorité</label>'.CRLF;
$o1.='    <input  type="text" name="chp_priorite_tache" id="chp_priorite_tache"   value="'.enti1($chp_priorite_tache).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_priorite_tache')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_tache">id</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_tache" id="chi_id_tache"   value="'.enti1($chi_id_tache).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_tache')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='</form>'.CRLF;
$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*($__nbMax);
$champs0='
 `chi_id_tache`          , `chp_texte_tache` , T0.chp_priorite_tache 
';
$sql0='SELECT '.$champs0;
$from0='
 FROM `tbl_taches` `T0`
 
';
$sql0.=$from0;
$where0='
 WHERE  "T0"."chx_utilisateur_tache" = \''.$_SESSION[APP_KEY]['sess_id_utilisateur_init'].'\' 
';

if(($chi_id_tache != '' && is_numeric($chi_id_tache))){

    $where0.='
  AND `T0`.`chi_id_tache` = \''.addslashes1($chi_id_tache).'\'
 ';

}


if(($chp_texte_tache != '')){

    $where0.='
  AND `T0`.`chp_texte_tache` LIKE \'%'.addslashes1($chp_texte_tache).'%\'
 ';

}



if(($chp_priorite_tache != '')){

    $where0.='
  AND `T0`.`chp_priorite_tache` LIKE \'%'.addslashes1($chp_priorite_tache).'%\'
 ';

}



$sql0.=$where0;
$order0='
 ORDER BY `T0`.`chp_priorite_tache` ASC
';
$sql0.=$order0;
$plage0=' LIMIT '.addslashes1($__nbMax).' OFFSET '.addslashes1($__debut).';';
$sql0.=$plage0;
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . $sql0  . '</pre>' ; exit(0);
$data0=array();
$db=new SQLite3('../fta_inc/db/sqlite/system.db');
$stmt0=$db->prepare($sql0);

if(($stmt0 !== false)){

    $res0=$stmt0->execute();
    while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
        $data0[]=array(
            'T0.chi_id_tache' => $tab0[0],
            'T0.chp_texte_tache' => $tab0[1],
            'T0.chp_priorite_tache' => $tab0[2],
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

$consUrlRedir=''.'&amp;chi_id_tache='.rawurlencode($chi_id_tache).'&amp;chp_texte_tache='.rawurlencode($chp_texte_tache).'&amp;chp_priorite_tache='.rawurlencode($chp_priorite_tache).'';
$__bouton_enregs_suiv=' <span class="yybtn yyunset">&raquo;</span>';

if(($__debut+$__nbMax < $__nbEnregs)){

    $__bouton_enregs_suiv=' <a href="'.BNF.'?__xpage='.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).$consUrlRedir.'">&raquo;</a>';

}

$__bouton_enregs_prec=' <span class="yybtn yyunset">&laquo;</span>';

if(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

    $__bouton_enregs_prec=' <a href="'.BNF.'?__xpage='.($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']-1).$consUrlRedir.'">&laquo;</a>';

}

$o1.='<div>';
$o1.='<form class="yylistForm1">';
$o1.=' <a class="yyinfo" href="zz_taches_action1.php?__action=__creation">Créer une nouvelle tâche</a>'.CRLF;
$o1.=' '.$__bouton_enregs_prec.' '.$__bouton_enregs_suiv.' <div style="display:inline-block;">';

if(($__nbEnregs > 0)){

    $o1.='page '.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).'/'.ceil($__nbEnregs/($__nbMax)).' ('.$__nbEnregs.' enregistrements )</div>'.CRLF;

}else{

    $o1.='pas d\'enregistrement'.CRLF;
}

$o1.='</form>';
$o1.='</div>';
$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>tâche</th>';
$lsttbl.='<th>priorite</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0 => $v0){
    $lsttbl.='<tr>';
    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';
    $lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_taches_action1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_tache'].'" title="modifier">✎</a>';
    
    $lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_taches_action1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_tache'].'" title="supprimer">x</a>';
    
    $lsttbl.='</div>';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:center;">';
    $lsttbl.=''.$v0['T0.chi_id_tache'].'';
    $lsttbl.='</td>';
    
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.mb_substr($v0['T0.chp_texte_tache'],0,100).'';
    $lsttbl.='</td>';
    
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.$v0['T0.chp_priorite_tache'].'';
    $lsttbl.='</td>';

    $lsttbl.='<tr>';
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