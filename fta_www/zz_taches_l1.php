<?php
define("BNF",basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true); // sess,bdd



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
if(isset($_POST['__soustraire_1_aux_priorites'])){
 
  
  $sql0='UPDATE `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_taches SET chp_priorite_tache=50 WHERE ( chp_priorite_tache IS NULL OR  chp_priorite_tache = \'\' ) AND chx_utilisateur_tache = '.$_SESSION[APP_KEY]['sess_id_utilisateur_init'].'';
  $ret=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql0);
  $sql1='UPDATE `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_taches SET chp_priorite_tache=chp_priorite_tache-1 WHERE chp_priorite_tache<50 AND  chp_priorite_tache>1 AND chx_utilisateur_tache = '.$_SESSION[APP_KEY]['sess_id_utilisateur_init'].'';
  $ret=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql1);
  
  if( $ret===false ){

    ajouterMessage('erreur' , __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() );
   
  }else{
   
    ajouterMessage('info' , __LINE__ .' : les priorités ont été augmentées' );
    
  }   
  recharger_la_page(BNF);
}

/*
  =====================================================================================================================
*/
if(isset($_POST['__ajouter_1_aux_priorites'])){
 
  
  $sql0='UPDATE `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_taches SET chp_priorite_tache=50 WHERE ( chp_priorite_tache IS NULL OR  chp_priorite_tache = \'\' ) AND chx_utilisateur_tache = '.$_SESSION[APP_KEY]['sess_id_utilisateur_init'].'';
  $ret=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql0);
  $sql1='UPDATE `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_taches SET chp_priorite_tache=chp_priorite_tache+1 WHERE chp_priorite_tache<50 AND chx_utilisateur_tache = '.$_SESSION[APP_KEY]['sess_id_utilisateur_init'].'';
  $ret=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql1);
  
  if( $ret===false ){

    ajouterMessage('erreur' , __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() );
   
  }else{
   
    ajouterMessage('info' , __LINE__ .' : les priorités ont été augmentées' );
    
  }   
  recharger_la_page(BNF);
}

/*
  =====================================================================================================================
*/
if(isset($_GET['__action']) && '__mettre_a_99' === $_GET['__action']){
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_GET , true ) . '</pre>' ; exit(0);

 if(isset($_GET['__id']) && is_numeric($_GET['__id'])){

  $sql0='UPDATE `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_taches SET chp_priorite_tache=99 WHERE chi_id_tache = '.sq0($_GET['__id']).' AND chx_utilisateur_tache = '.$_SESSION[APP_KEY]['sess_id_utilisateur_init'].'';
  $ret=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql0);
  if( $ret===false ){

    ajouterMessage('erreur' , __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() );
   
  }else{
   
    ajouterMessage('info' , __LINE__ .' : tâche modifiée' );
    
  }   


 }

 recharger_la_page(BNF);
 
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
 FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_taches `T0`
 
';
$sql0.=$from0;
$where0='
 WHERE  "T0"."chx_utilisateur_tache" = \''.$_SESSION[APP_KEY]['sess_id_utilisateur_init'].'\' 
';

if(($chi_id_tache != '' && is_numeric($chi_id_tache))){

    $where0.='
  AND `T0`.`chi_id_tache` = \''.sq0($chi_id_tache).'\'
 ';

}


if(($chp_texte_tache != '')){

    $where0.='
  AND `T0`.`chp_texte_tache` LIKE \'%'.sq0($chp_texte_tache).'%\'
 ';

}



if(($chp_priorite_tache != '')){

    $where0.='
  AND `T0`.`chp_priorite_tache` LIKE \'%'.sq0($chp_priorite_tache).'%\'
 ';

}



$sql0.=$where0;
$order0='
 ORDER BY `T0`.`chp_priorite_tache` ASC
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
            'T0.chi_id_tache' => $tab0[0],
            'T0.chp_texte_tache' => $tab0[1],
            'T0.chp_priorite_tache' => $tab0[2],
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

$consUrlRedir=''.'&amp;chi_id_tache='.rawurlencode($chi_id_tache).'&amp;chp_texte_tache='.rawurlencode($chp_texte_tache).'&amp;chp_priorite_tache='.rawurlencode($chp_priorite_tache).'';
$__bouton_enregs_suiv=' <span class="yybtn yyunset">&raquo;</span>';

if(($__debut+$__nbMax < $__nbEnregs)){

    $__bouton_enregs_suiv=' <a href="'.BNF.'?__xpage='.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).$consUrlRedir.'">&raquo;</a>';

}

$__bouton_enregs_prec=' <span class="yybtn yyunset">&laquo;</span>';

if(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

    $__bouton_enregs_prec=' <a href="'.BNF.'?__xpage='.($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']-1).$consUrlRedir.'">&laquo;</a>';

}

$o1.='<div><form method="post" class="yylistForm1">';
$o1.=' <a class="yyinfo" href="zz_taches_a1.php?__action=__creation">Créer une nouvelle tâche</a>'.CRLF;
$o1.=' <button name="__ajouter_1_aux_priorites" id="__ajouter_1_aux_priorites" class="yyinfo">+1*</button>'.CRLF;
$o1.=' <button name="__soustraire_1_aux_priorites" id="__soustraire_1_aux_priorites" class="yyinfo">-1*</button>'.CRLF;
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
$lsttbl.='<th>tâche</th>';
$lsttbl.='<th>priorite</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0 => $v0){
    $lsttbl.='<tr>';
    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';
    $lsttbl.=' <a class="yyinfo" href="zz_taches_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_tache'].'" title="modifier">✎</a>';
    
    $lsttbl.=' <a class="yydanger" href="zz_taches_a1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_tache'].'" title="supprimer">x</a>';
    $lsttbl.=' <a class="yyinfo"   href="zz_taches_l1.php?__action=__mettre_a_99&amp;__id='.$v0['T0.chi_id_tache'].'" title="mettre cette priorité à 99">99</a>';

    $lsttbl.='</div>';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:center;">';
    $lsttbl.=''.$v0['T0.chi_id_tache'].'';
    $lsttbl.='</td>';
    
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.enti1(mb_substr($v0['T0.chp_texte_tache'],0,100)).'';
    $lsttbl.='</td>';
    
    $lsttbl.='<td style="text-align:left;">';
    $lsttbl.=''.$v0['T0.chp_priorite_tache'].'';
    $lsttbl.='</td>';

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