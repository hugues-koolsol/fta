<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_dossiers1.php');

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible avant d\'accéder aux dossiers'  );
   recharger_la_page('zz_cibles1.php'); 
}

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);

$dossier_racine='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'';

/*
  =====================================================================================================================
*/
if(isset($_GET['__action']) && '__integration_des_dossiers_existants'===$_GET['__action']){
 
 $arr=listerLesDossiers($dossier_racine);
 if(count($arr)>0){
  $db = new SQLite3('../fta_inc/db/system.db');

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $arr[1] , true ) . '</pre>' ; exit(0);
  foreach( $arr[1] as $k1 => $v1){
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $v1['chemin'] , true ) . '</pre>' ; 
   $nomDossier=substr( $v1['chemin'] , strlen($dossier_racine ) );
   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nomDossier , true ) . '</pre>' ; 
   
   $sql='INSERT OR IGNORE INTO tbl_dossiers (chp_nom_dossier,chx_cible_dossier	) VALUES ( \''.addslashes1($nomDossier).'\' , \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' ) ';


   if( false === $db->exec($sql) ){
       echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
   }

   
  }


  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
 } 
 
 recharger_la_page(BNF); 
 

}
/*
  =====================================================================================================================
*/

function listerLesDossiers($dir,$niveau=0){
    
    $str='';
    $ffs = scandir($dir);

    unset($ffs[array_search('.', $ffs, true)]);
    unset($ffs[array_search('..', $ffs, true)]);

    if(count($ffs) < 1){
        return array();
    }
    
    $temp=array();

    foreach($ffs as $ff){
        $chemin=$dir.'/'.$ff;
        if(is_dir($chemin)){
            $temp[$ff]=$chemin;
        }
    }
    foreach($temp as $k1 => $v1){
     $sousChaine='';
     if($k1!=='vendor'){
      $niveau++;
      $sousDossiers=listerLesDossiers($v1, $niveau);
      $niveau--;
      if(count($sousDossiers[0])>0){
       $temp[$k1]=array('chemin' => $v1 , 'dossiers' => $sousDossiers[0] );
//       $temp[$k1]=$sousDossiers[0];
       $sousChaine=$sousDossiers[1];
      }else{
       $temp[$k1]=array('chemin' => $v1 );
      }
     }else{
       $temp[$k1]=array('chemin' => $v1 );
     }
     if($str!==''){
      $str.=',';
     }
     $str.=$k1.'(';
     if($sousChaine!==''){
      $str.=$sousChaine;
     }
     $str.=')';
     
    }     

    if($niveau===0){
     
     function linearise($entree,&$sortie,$niveau=0){
      
      foreach($entree as $k1=>$v1){
//       echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $v1 , true ) . '</pre>' ;
       if(isset($v1['chemin'])){
        $sortie[$k1]=array('niveau' => $niveau/2 , 'chemin' => $v1['chemin']  ); // , 'chemin' => $v1['chemin']
       }
       if(is_array($v1)){
        $niveau++;
        linearise($v1,$sortie,$niveau);
        $niveau--;
       }else{
       }
      }
     }
     
     $lineaire=array();
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $temp , true ) . '</pre>' ; exit(0);
     linearise($temp,$lineaire);
     return(array($temp , $lineaire , $str));
    }else{
     return(array($temp,$str));
    }
    
}

/*
  =====================================================================================================================
*/


$o1='';
$o1=html_header1(array('title'=>'Dossiers' , 'description'=>'Dossiers'));
print($o1);$o1='';

$o1.='<h1>Liste des dossiers de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';

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

$chi_id_dossier          = sauvegarderLesParametresDeRecherche('chi_id_dossier'          , BNF);
$chp_nom_dossier         = sauvegarderLesParametresDeRecherche('chp_nom_dossier'         , BNF);

$autofocus='chi_id_dossier';
     if($chi_id_dossier!=''){          $autofocus='chi_id_dossier';          } 
else if($chp_nom_dossier!=''){         $autofocus='chp_nom_dossier';         }


$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_dossier">id dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_dossier" id="chi_id_dossier"   value="'.enti1($chi_id_dossier).'"  size="8" maxlength="32"  '.($autofocus=='chi_id_dossier'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="xsrch_chp_nom_dossier">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_dossier" id="chp_nom_dossier"   value="'.enti1($chp_nom_dossier).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_dossier'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF; // &#128270;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$__xpage.'" />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='</form>'.CRLF;


$db = new SQLite3('../fta_inc/db/system.db');

$nomDossier='/';
$sql='INSERT OR IGNORE INTO tbl_dossiers (chp_nom_dossier,chx_cible_dossier	) VALUES ( \''.addslashes1($nomDossier).'\' , \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' ) ';
if( false === $db->exec($sql) ){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
}




$__debut=$__xpage*$__nbMax;

$sql='
 SELECT `chi_id_dossier` , `chp_nom_dossier` 
 FROM `tbl_dossiers` `T0`
 WHERE "T0"."chx_cible_dossier" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
';

if($chi_id_dossier!='' && is_numeric($chi_id_dossier)){
 $sql.='
  AND `T0`.`chi_id_dossier` = \''.addslashes1($chi_id_dossier).'\'
 '; 
}

if($chp_nom_dossier!='' ){
 $sql.='
  AND `T0`.`chp_nom_dossier` LIKE \'%'.addslashes1($chp_nom_dossier).'%\'
 '; 
}






$sql.=' LIMIT '.addslashes1($__nbMax).' OFFSET '.addslashes1($__debut).';';


$data0=array();


$stmt = $db->prepare($sql);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM))
  {
   array_push($data0, array(
    'T0_chi_id_dossier'          => $arr[0],
    'T0_chp_nom_dossier'         => $arr[1],
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
$lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0=>$v0){
 
 $lsttbl.='<tr>';
 $lsttbl.='<td data-label="" style="text-align:left!important;">';
 $lsttbl.='<div class="yyflex1">';
/*  
 $lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_dossiers_action1.php?__action=__modification&amp;__id='.$v0['T0_chi_id_dossier'].'" title="modifier">✎</a>';//✎ #9998
 if($v0['T0_chi_id_dossier']!==1){
  if(!is_dir($dossier)){
   $lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_dossiers_action1.php?__action=__suppression&amp;__id='.$v0['T0_chi_id_dossier'].'" title="supprimer">✘</a>';
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


 
 $lsttbl.='<td data-label="id" style="text-align:center;">';
 $lsttbl.=''.$v0['T0_chi_id_dossier'].'';
 $lsttbl.='</td>';
 
 $lsttbl.='<td data-label="id" style="text-align:left;">';
 $lsttbl.=''.$v0['T0_chp_nom_dossier'].'';
 $lsttbl.='</td>';
 
 
 $lsttbl.='<tr>';
}

$o1.='<table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table>'.CRLF;

$o1.='<a class="yyinfo" href="zz_dossiers_action1.php?__action=__creation">Créer un nouveau dossier</a>'.CRLF;

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
