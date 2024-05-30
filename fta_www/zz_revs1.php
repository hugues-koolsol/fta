<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_revs1.php');

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles1.php'); 
}

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);





/*
  =====================================================================================================================
*/


$o1='';
$o1=html_header1(array('title'=>'revs' , 'description'=>'revs'));
print($o1);$o1='';


$o1.='<h1>Liste des revs de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';

/*
  =====================================================================================================================
*/

$__nbMax=10;
$__debut=0;


$__xpage             = recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage'                , BNF);
$chi_id_rev          = recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_rev'             , BNF);
$chp_provenance_rev  = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_provenance_rev'     , BNF);
$chp_nom_source      = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_source'         , BNF);
$chp_nom_source2     = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_source2'        , BNF);
$chx_source_rev      = recuperer_et_sauvegarder_les_parametres_de_recherche('chx_source_rev'         , BNF);
$chp_valeur_rev      = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_valeur_rev'         , BNF);


$autofocus='chi_id_rev';
     if($chi_id_rev!=''){          $autofocus='chi_id_rev';          } 
else if($chp_provenance_rev!=''){         $autofocus='chp_provenance_rev';         }
else if($chp_nom_source!=''){         $autofocus='chp_nom_source';         }
else if($chp_nom_source2!=''){         $autofocus='chp_nom_source2';         }

else if($chx_source_rev!=''){         $autofocus='chx_source_rev';         }
else if($chp_valeur_rev!=''){         $autofocus='chp_valeur_rev';         }




$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_rev">id rev</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_rev" id="chi_id_rev"   value="'.enti1($chi_id_rev).'"  size="8" maxlength="32"  '.($autofocus=='chi_id_rev'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_provenance_rev">provenance</label>'.CRLF;
$o1.='    <input  type="text" name="chp_provenance_rev" id="chp_provenance_rev"   value="'.enti1($chp_provenance_rev).'"  size="8" maxlength="64"  '.($autofocus=='chp_provenance_rev'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;




$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_source">nom source =</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_source" id="chp_nom_source"   value="'.enti1($chp_nom_source).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_source'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;


$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_source2">nom source <></label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_source2" id="chp_nom_source2"   value="'.enti1($chp_nom_source2).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_source2'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;



$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_valeur_rev">valeur(1)</label>'.CRLF;
$o1.='    <input  type="text" name="chp_valeur_rev" id="chp_valeur_rev"   value="'.enti1($chp_valeur_rev).'"  size="8" maxlength="64"  '.($autofocus=='chp_valeur_rev'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;




$o1.='   <div>'.CRLF;
$o1.='    <label for="chx_source_rev">id source</label>'.CRLF;
$o1.='    <input  type="text" name="chx_source_rev" id="chx_source_rev"   value="'.enti1($chx_source_rev).'"  size="8" maxlength="64"  '.($autofocus=='chx_source_rev'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;




$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF; // &#128270;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='</form>'.CRLF;



$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*($__nbMax);
$champs0='`chi_id_rev`          , `chp_provenance_rev` , T0.chx_source_rev , T1.chp_nom_source , T0.chp_valeur_rev
';
$sql0='SELECT '.$champs0;
$from0='
 FROM `tbl_revs` `T0`
 LEFT JOIN tbl_sources T1 ON T1.chi_id_source = T0.chx_source_rev
 
';
$sql0.=$from0;
$where0='
 WHERE  "T0"."chx_cible_rev" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
';



if(($chp_provenance_rev != '')){

    $where0.='
  AND `T0`.`chp_provenance_rev` LIKE \'%'.sq0($chp_provenance_rev).'%\'
 ';

}


if(($chx_source_rev != '')){

    $where0.='
  AND `T0`.`chx_source_rev` = '.sq0($chx_source_rev).'
 ';

}


if(($chp_nom_source != '')){

    $where0.='
  AND `T1`.`chp_nom_source` LIKE \'%'.sq0($chp_nom_source).'%\'
 ';

}

if(($chp_nom_source2 != '')){

    $where0.='
  AND `T1`.`chp_nom_source` NOT LIKE \'%'.sq0($chp_nom_source2).'%\'
 ';

}



if(($chp_valeur_rev != '')){

    $where0.='
  AND `T0`.`chp_valeur_rev` LIKE \'%'.sq0($chp_valeur_rev).'%\'
 ';

}





if(($chi_id_rev != '')){

    $where0.='
  AND `T0`.`chi_id_rev` = \''.sq0($chi_id_rev).'\'
 ';

}

$sql0.=$where0;
$order0='
 ORDER BY `T0`.`chp_provenance_rev` ASC , chx_source_rev ASC
';
$sql0.=$order0;
$plage0=' LIMIT '.sq0($__nbMax).' OFFSET '.sq0($__debut).';';
$sql0.=$plage0;

$__nbEnregs=0;
$data0=array();

$db = new SQLite3('../fta_inc/db/sqlite/system.db');
$stmt = $db->prepare($sql0);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM)){
   array_push($data0, array(
    'T0.chi_id_rev'          => $arr[0],
    'T0.chp_provenance_rev'  => $arr[1],
    'T0.chx_source_rev'      => $arr[2],
    'T1.chp_nom_source'      => $arr[3],
    'T0.chp_valeur_rev'      => $arr[4],
   ));
  }
  $stmt->close(); 
  
    $__nbEnregs=count($data0);

    if(($__nbEnregs >= $__nbMax || $_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

        $sql1='SELECT COUNT(*) '.$from0.$where0;
        $__nbEnregs=$db->querySingle($sql1);

    }
  
  
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
}

$consUrlRedir=''.'&amp;chi_id_rev='.rawurlencode($chi_id_rev).'&amp;chp_provenance_rev='.rawurlencode($chp_provenance_rev).'&amp;chx_source_rev='.rawurlencode($chx_source_rev).'&amp;chp_nom_source='.rawurlencode($chp_nom_source).'&amp;chp_valeur_rev='.rawurlencode($chp_valeur_rev).''; 
$__bouton_enregs_suiv=' <a class="yyunset">&raquo;</a>';

if(($__debut+$__nbMax < $__nbEnregs)){

    $__bouton_enregs_suiv=' <a href="'.BNF.'?__xpage='.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).$consUrlRedir.'">&raquo;</a>';

}

$__bouton_enregs_prec=' <a class="yyunset">&laquo;</a>';

if(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

    $__bouton_enregs_prec=' <a href="'.BNF.'?__xpage='.($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']-1).$consUrlRedir.'">&laquo;</a>';

}


$o1.='<div class="yylistForm1">';
//$o1.='<form class="yylistForm1">';
//$o1.=' <a class="yyinfo" href="zz_revs_action1.php?__action=__creation">Créer un nouveau rev</a>'.CRLF;

$o1.=' '.$__bouton_enregs_prec.' '.$__bouton_enregs_suiv.' <div style="display:inline-block;">';

if(($__nbEnregs > 0)){

    $o1.='page '.(($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']+1)).'/'.ceil($__nbEnregs/($__nbMax)).' ('.$__nbEnregs.' enregistrements )</div>'.CRLF;

}else{

    $o1.='pas d\'enregistrements'.CRLF;
}

//$o1.='</form>';
$o1.='</div>';

 

$__lsttbl='';
$__lsttbl.='<thead><tr>';

$__lsttbl.='<th>action</th>';
$__lsttbl.='<th>id</th>';
$__lsttbl.='<th>provenance</th>';
$__lsttbl.='<th>nom source</th>';
$__lsttbl.='<th>valeur(1)</th>';
$__lsttbl.='<th>id source</th>';

$__lsttbl.='</tr></thead><tbody>';
$tableau_pour_webworker001=array();
foreach($data0 as $k0=>$v0){
 
 $__lsttbl.='<tr>';
 $__lsttbl.='<td data-label="" style="text-align:left!important;">';
 $__lsttbl.='<div class="yyflex1">';
 $__lsttbl.=' <a class="yyinfo yytbnormal" href="zz_revs_action1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_rev'].'" title="modifier">✎</a>';//✎ #9998
 
 $__lsttbl.='</div>';
 
 $__lsttbl.='</td>';


 
 $__lsttbl.='<td style="text-align:center;">';
 $__lsttbl.=''.$v0['T0.chi_id_rev'].'';
 $__lsttbl.='</td>';
 
 $__lsttbl.='<td style="text-align:left;">';
 $__lsttbl.=$v0['T0.chp_provenance_rev'].'';
 $__lsttbl.='</td>';
 
 $__lsttbl.='<td style="text-align:left;">';
 $__lsttbl.=$v0['T1.chp_nom_source'].'';
 $__lsttbl.='</td>';
 
 $__lsttbl.='<td style="text-align:left;">';
 $__lsttbl.=mb_substr( $v0['T0.chp_valeur_rev'] , 0 , 100).'';
 $__lsttbl.='</td>';
 
 if(!isset($tableau_pour_webworker001[$v0['T0.chp_valeur_rev']])){
  $tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']]=1;
 }else{
  if(!isset($tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']])){
   $tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']]=1;
  }else{
   $tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']]++;
  }
 }

 
 
 $__lsttbl.='<td style="text-align:left;">';
 $__lsttbl.=$v0['T0.chx_source_rev'].'';
 $__lsttbl.='</td>';
 
 
 
 $__lsttbl.='</tr>';
}

$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$__lsttbl.'</tbody></table></div>'.CRLF;

$o1.='<pre>' . var_export( $tableau_pour_webworker001 , true).'</pre>';
if(count($tableau_pour_webworker001)===1 && $__nbEnregs<= $__nbMax ){
 $liste_des_id_des_sources='';
 foreach($tableau_pour_webworker001 as $k1=>$v1){
  $chaine_a_remplacer=$k1;
  foreach($v1 as $k2=>$v2){
   $liste_des_id_des_sources.=','.$k2;
  }
  if($liste_des_id_des_sources!=''){
   $liste_des_id_des_sources=substr($liste_des_id_des_sources,1);
  }
  if($chaine_a_remplacer!==''){
   $o1.='$chaine_a_remplacer='.$chaine_a_remplacer.', $liste_des_id_des_sources=' . $liste_des_id_des_sources;
  }
 }
}


// $o1.= __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data0 , true ) . '</pre>' ;



/*
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
print($o1); $o1='';
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';
