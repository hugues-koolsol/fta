<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_sources1.php');

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible avant d\'accéder aux sources'  );
   recharger_la_page('zz_cibles1.php'); 
}

/*
  =====================================================================================================================
*/


$o1='';
$o1=html_header1(array('title'=>'Sources' , 'description'=>'Sources'));
print($o1);$o1='';

$o1.='<h1>Liste des sources de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';

/*
  =====================================================================================================================
*/

$__nbMax=20;
$__debut=0;
$__xpage=0;

if(isset($_GET['__xpage'])&&is_numeric($_GET['__xpage'])){
 $__xpage=$_GET['__xpage'];
}else{
 if(isset($_SESSION[APP_KEY][NAV][BNF]['__xpage'])) $__xpage=$_SESSION[APP_KEY][NAV][BNF]['__xpage'];
}

$chi_id_source          = sauvegarderLesParametresDeRecherche('chi_id_source'          , BNF);
$chp_nom_source         = sauvegarderLesParametresDeRecherche('chp_nom_source'         , BNF);
$chp_type_source        = sauvegarderLesParametresDeRecherche('chp_type_source'        , BNF);
$chp_nom_dossier        = sauvegarderLesParametresDeRecherche('chp_nom_dossier'        , BNF);
$chi_id_dossier         = sauvegarderLesParametresDeRecherche('chi_id_dossier'         , BNF);


$autofocus='chi_id_source';
     if($chi_id_source!=''){          $autofocus='chi_id_source';          } 
else if($chp_nom_source!=''){         $autofocus='chp_nom_source';         }
else if($chp_type_source!=''){        $autofocus='chp_type_source';        }
else if($chp_nom_dossier!=''){        $autofocus='chp_nom_dossier';        }
else if($chi_id_dossier!=''){         $autofocus='chi_id_dossier';        }




$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_source">id dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_source" id="chi_id_source"   value="'.enti1($chi_id_source).'"  size="8" maxlength="32"  '.($autofocus=='chi_id_source'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_source">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_source" id="chp_nom_source"   value="'.enti1($chp_nom_source).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_source'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_type_source">type</label>'.CRLF;
$o1.='    <input  type="text" name="chp_type_source" id="chp_type_source"   value="'.enti1($chp_type_source).'"  size="8" maxlength="64"  '.($autofocus=='chp_type_source'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_dossier">dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_dossier" id="chp_nom_dossier"   value="'.enti1($chp_nom_dossier).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_dossier'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_dossier">id dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_dossier" id="chi_id_dossier"   value="'.enti1($chi_id_dossier).'"  size="8" maxlength="64"  '.($autofocus=='chi_id_dossier'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;



$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF; // &#128270;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$__xpage.'" />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='</form>'.CRLF;


$db = new SQLite3('../fta_inc/db/system.db');


$__debut=$__xpage*$__nbMax;

$sql='
 SELECT `chi_id_source`          , `chp_nom_source` , chp_type_source , T1.chp_nom_dossier , chp_commentaire_source , 
        T0.chx_dossier_id_source 
 FROM `tbl_sources` `T0`
  LEFT JOIN tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_source  
 WHERE "T0"."chx_cible_id_source" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
';

if($chi_id_source!='' && is_numeric($chi_id_source)){
 $sql.='
  AND `T0`.`chi_id_source` = \''.addslashes1($chi_id_source).'\'
 '; 
}

if($chp_nom_source!='' ){
 $sql.='
  AND `T0`.`chp_nom_source` LIKE \'%'.addslashes1($chp_nom_source).'%\'
 '; 
}

if($chp_type_source!='' ){
 $sql.='
  AND `T0`.`chp_type_source` LIKE \'%'.addslashes1($chp_type_source).'%\'
 '; 
}
if($chp_nom_dossier!='' ){
 $sql.='
  AND `T1`.`chp_nom_dossier` LIKE \'%'.addslashes1($chp_nom_dossier).'%\'
 '; 
}
if($chi_id_dossier!='' ){
 $sql.='
  AND `T1`.`chi_id_dossier` = \''.addslashes1($chi_id_dossier).'\'
 '; 
}




$sql.=' LIMIT '.addslashes1($__nbMax).' OFFSET '.addslashes1($__debut).';';

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);

$data0=array();


$stmt = $db->prepare($sql);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM))
  {
   array_push($data0, array(
    'T0_chi_id_source'          => $arr[0],
    'T0_chp_nom_source'         => $arr[1],
    'T0_chp_type_source'        => $arr[2],
    'T1_chp_nom_dossier'        => $arr[3],
    'T0_chp_commentaire_source' => $arr[4],
    'T0_chx_dossier_id_source'  => $arr[5],
   ));
  }
  $stmt->close(); 
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
}

 

$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>nom</th>';
$lsttbl.='<th>type</th>';
$lsttbl.='<th>dossier</th>';
$lsttbl.='<th>commentaire</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0=>$v0){
 
 $lsttbl.='<tr>';
 $lsttbl.='<td data-label="" style="text-align:left!important;">';
 $lsttbl.='<div class="yyflex1">';
 $lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_sources_action1.php?__action=__modification&amp;__id='.$v0['T0_chi_id_source'].'" title="modifier">✎</a>';//✎ #9998
/*  
 if($v0['T0_chi_id_source']!==1){
  if(!is_dir($dossier)){
   $lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_dossiers_action1.php?__action=__suppression&amp;__id='.$v0['T0_chi_id_source'].'" title="supprimer">✘</a>';
  }else{
   $lsttbl.='<span class=" yybtn yyunset" title="supprimer">✘</span>';
  }
}else{
 $lsttbl.='<span class=" yybtn yyunset" title="supprimer">✘</span>';
}
*/  
 
 $lsttbl.='</div>';
 
 $lsttbl.='</td>';

/*  
 $lsttbl.='<td data-label="etat" style="text-align:center;">';
 $listeDesEtats='';
 if(!is_dir($dossier)){
  $listeDesEtats.='Le dossier n\'existe pas ';
 }else{
  $listeDesEtats.='Le dossier existe ';
  if(le_dossier_est_vide($dossier)){
   $listeDesEtats.='<br />Le dossier est vide';
  }else{
   $listeDesEtats.='<br />Le dossier contient des éléments';
  }
 }
 $lsttbl.=$listeDesEtats.'</td>';
*/


 
 $lsttbl.='<td style="text-align:center;">';
 $lsttbl.=''.$v0['T0_chi_id_source'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td style="text-align:left;">';
 $lsttbl.=''.$v0['T0_chp_nom_source'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td style="text-align:left;">';
 $lsttbl.=''.$v0['T0_chp_type_source'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td style="text-align:left;">';
 $lsttbl.='('.$v0['T0_chx_dossier_id_source'].')'.$v0['T1_chp_nom_dossier'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td style="text-align:left;">';
 $lsttbl.=''.$v0['T0_chp_commentaire_source'].'';
 $lsttbl.='</td>';
 
 
 
 $lsttbl.='<tr>';
}

$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;

$o1.='<a class="yyinfo" href="zz_sources_action1.php?__action=__creation">Créer un nouveau source</a>'.CRLF;

// $o1.= __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data0 , true ) . '</pre>' ;



/*
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';
