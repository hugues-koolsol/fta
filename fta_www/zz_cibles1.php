<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_cibles1.php');


/*
  =====================================================================================================================
*/
if(isset($_GET['__action']) && '__selectionner_cette_cible'===$_GET['__action']){
 if(isset($_SESSION[APP_KEY]['cible_courante'])){
   unset($_SESSION[APP_KEY]['cible_courante']);
 }
 $__id=isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
 if($__id!==0){
      $db = new SQLite3('../fta_inc/db/sqlite/system.db');
      $__valeurs=recupere_une_donnees_des_cibles($__id,$db);
      $db->close();
      if(isset($__valeurs['T0.chi_id_cible'])){
          $_SESSION[APP_KEY]['cible_courante']=array(
            'chi_id_cible'          => $__valeurs['T0.chi_id_cible'],
            'chp_nom_cible'         => $__valeurs['T0.chp_nom_cible'],
            'chp_dossier_cible'     => $__valeurs['T0.chp_dossier_cible'],
          );
          ajouterMessage('info' ,  __LINE__ .' : une nouvelle cible a été sélectionnée ' , BNF );
      }
      
 }
 recharger_la_page(BNF); 
 

// $_SESSION[APP_KEY]['cible_courante']=array();
}
/*
  =====================================================================================================================
*/


$o1='';
$o1=html_header1(array('title'=>'Cibles' , 'description'=>'Cibles'));
print($o1);$o1='';

$o1.='<h1>Liste des systèmes cibles</h1>';

/*
  =====================================================================================================================
*/

$__nbMax=20;
$__debut=0;

$__xpage               = recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage'               , BNF);
$chi_id_cible          = recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_cible'          , BNF);
$chp_nom_cible         = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_cible'         , BNF);
$chp_dossier_cible     = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_dossier_cible'     , BNF);
$chp_commentaire_cible = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_commentaire_cible' , BNF);
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chp_nom_cible , true ) . '</pre>' ; exit(0);

$autofocus='chi_id_cible';
     if($chi_id_cible!=''){          $autofocus='chi_id_cible';          } 
else if($chp_nom_cible!=''){         $autofocus='chp_nom_cible';         }
else if($chp_dossier_cible!=''){     $autofocus='chp_dossier_cible';     }
else if($chp_commentaire_cible!=''){ $autofocus='chp_commentaire_cible'; }


$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_cible">id cible</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_cible" id="chi_id_cible"   value="'.enti1($chi_id_cible).'"  size="8" maxlength="32"  '.($autofocus=='chi_id_cible'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="xsrch_chp_nom_cible">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_cible" id="chp_nom_cible"   value="'.enti1($chp_nom_cible).'"  size="8" maxlength="64"  '.($autofocus=='chp_nom_cible'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="xsrch_chp_dossier_cible">dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chp_dossier_cible" id="chp_dossier_cible"   value="'.enti1($chp_dossier_cible).'"  size="8" maxlength="64"  '.($autofocus=='chp_dossier_cible'?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_commentaire_cible">commentaire</label>'.CRLF;
$o1.='    <input  type="text" name="chp_commentaire_cible" id="chp_commentaire_cible"   value="'.enti1($chp_commentaire_cible).'"  size="8" maxlength="64" '.($autofocus=='chp_commentaire_cible'?'autofocus="autofocus"':'').'  />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF; // &#128270;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$__xpage.'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.=' </form>'.CRLF;


$db = new SQLite3('../fta_inc/db/sqlite/system.db');

$__debut=$__xpage*$__nbMax;

$sql='
 SELECT `chi_id_cible` , `chp_nom_cible` , chp_dossier_cible ,  `chp_commentaire_cible`
 FROM `tbl_cibles` `T0`
 WHERE "T0"."chi_id_cible">= \'0\' 
';

if($chi_id_cible!='' && is_numeric($chi_id_cible)){
 $sql.='
  AND `T0`.`chi_id_cible` = \''.addslashes1($chi_id_cible).'\'
 '; 
}

if($chp_nom_cible!='' ){
 $sql.='
  AND `T0`.`chp_nom_cible` LIKE \'%'.addslashes1($chp_nom_cible).'%\'
 '; 
}

if($chp_dossier_cible!='' ){
 $sql.='
  AND `T0`.`chp_dossier_cible` LIKE \'%'.addslashes1($chp_dossier_cible).'%\'
 '; 
}


if($chp_commentaire_cible!='' ){
 $sql.='
  AND `T0`.`chp_commentaire_cible` LIKE \'%'.addslashes1($chp_commentaire_cible).'%\'
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
    'T0.chi_id_cible'          => $arr[0],
    'T0.chp_nom_cible'         => $arr[1],
    'T0.chp_dossier_cible'     => $arr[2],
    'T0.chp_commentaire_cible' => $arr[3],
   ));
  }
  $stmt->close(); 
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
}

if(count($data0)===0){
 $lst='';
 $lst.='<p class="yyinfo">'.CRLF;
 $lst.='aucun enregistrement trouvé avec les critères indiqués'.CRLF;
 $lst.='<a class="yysucces" href="zz_cibles_action1.php?__action=__creation">Créer une nouvelle cible</a>'.CRLF;
 $lst.='</p>'.CRLF;
 $o1.=''.$lst.''.CRLF;  
 
 
}else{
 $lsttbl='';
 $lsttbl.='<thead><tr>';
 $lsttbl.='<th>action</th>';
 $lsttbl.='<th>etat</th>';
 $lsttbl.='<th>id</th>';
 $lsttbl.='<th>nom</th>';
 $lsttbl.='<th>dossier</th>';
 $lsttbl.='<th>commentaire</th>';
 $lsttbl.='</tr></thead><tbody>';
 foreach($data0 as $k0=>$v0){
  
  $dossier='../../'.$v0['T0.chp_dossier_cible'];
  
  
  $lsttbl.='<tr>';
  $lsttbl.='<td data-label="" style="text-align:left!important;">';
  $lsttbl.='<div class="yyflex1">';
  
  $lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_cibles_action1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_cible'].'" title="modifier">✎</a>';//✎ #9998
  

        if(isset($_SESSION[APP_KEY]['cible_courante'])){
     
                 if(APP_KEY===$v0['T0.chp_nom_cible']){
                     $lsttbl.='a<span class=" yybtn yyunset" title="supprimer">✘</span>';
                 }else{
                    if($_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']===$v0['T0.chp_dossier_cible']){
                        $lsttbl.='b<span class=" yybtn yyunset" title="supprimer">✘</span>';
                    }else{
                      if($v0['T0.chp_dossier_cible'] === $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']  && $v0['T0.chp_nom_cible'] === $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible']){
                          $lsttbl.='<cspan class=" yybtn yyunset" title="supprimer">✘</span>';
                      }else{
                          if( APP_KEY === $v0['T0.chp_dossier_cible'] ){
                            $lsttbl.='d<span class=" yybtn yyunset" title="supprimer">✘</span>';
                          }else{
                            if($v0['T0.chp_dossier_cible']==='fta' && APP_KEY !== 'fta' ){
                                  $lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_cibles_action1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_cible'].'" title="supprimer">✘</a>';
                            }else{
                              if(( !(is_dir($dossier)))){
                                  $lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_cibles_action1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_cible'].'" title="supprimer">✘</a>';
                              }else{
                                  $lsttbl.='e<span class=" yybtn yyunset" title="supprimer">✘</span>';
                              }
                            }
                          }
                      }
                    }
                 }
                 
                 
        }else{
                 $lsttbl.='<span class=" yybtn yyunset" title="supprimer">✘</span>';
        }
/*  
  
  
  if($v0['T0.chi_id_cible']!==1){
   if(!is_dir($dossier)){
    $lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_cibles_action1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_cible'].'" title="supprimer">✘</a>';
   }else{
    $lsttbl.='<span class=" yybtn yyunset" title="supprimer">✘</span>';
   }
  }else{
   $lsttbl.='<span class=" yybtn yyunset" title="supprimer">✘</span>';
  }
  
*/  
  if(isset( $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ) && $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']===$v0['T0.chi_id_cible']){
   $lsttbl.='<span class=" yybtn yyunset"  title="selectionner cette cible">⇒</span>';
   $lsttbl.=' <a class="yysucces yytxtSiz1" href="zz_dossiers1.php" title="aller aux dossiers">📁</a>';
  }else{
   $lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_cibles1.php?__action=__selectionner_cette_cible&amp;__id='.$v0['T0.chi_id_cible'].'" title="selectionner cette cible">⇒</a>';
   $lsttbl.='<span class=" yybtn yyunset"  title="aller aux dossiers">⇒</span>';
  }
  
  
  
  $lsttbl.='</div>';
  
  $lsttbl.='</td>';

  $lsttbl.='<td data-label="etat" style="text-align:center;">';
  
  $listeDesEtats='';
  
  if(!is_dir($dossier)){
   $listeDesEtats.='Le dossier n\'existe pas ';
//   $lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_cibles1.php?__action=__creation_dossier&amp;__id='.$v0['T0.chi_id_cible'].'" title="créer le dossier">📁</a>';
  }else{
   $listeDesEtats.='Le dossier existe ';
   if(le_dossier_est_vide($dossier)){
    $listeDesEtats.='<br />Le dossier est vide';
   }else{
    $listeDesEtats.='<br />Le dossier contient des éléments';
   }
  }
  $lsttbl.=$listeDesEtats.'</td>';



  
  $lsttbl.='<td data-label="id" style="text-align:center;">';
  $lsttbl.=''.$v0['T0.chi_id_cible'].'';
  $lsttbl.='</td>';
  
  $lsttbl.='<td data-label="id" style="text-align:left;">';
  $lsttbl.=''.$v0['T0.chp_nom_cible'].'';
  $lsttbl.='</td>';
  
  $lsttbl.='<td data-label="id" style="text-align:left;">';
  $lsttbl.=''.$v0['T0.chp_dossier_cible'].'';
  $lsttbl.='</td>';
  
  $lsttbl.='<td data-label="id" style="text-align:left;">';
  $lsttbl.=''.$v0['T0.chp_commentaire_cible'].'';
  $lsttbl.='</td>';
  
  $lsttbl.='<tr>';
 }

 $o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;
 
 $o1.='<a class="yyinfo" href="zz_cibles_action1.php?__action=__creation">Créer une nouvelle cible</a>'.CRLF;
 
// $o1.= __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data0 , true ) . '</pre>' ;
}


/*
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
print($o1); $o1='';
$o1.=html_footer1($par);
print($o1);$o1='';
