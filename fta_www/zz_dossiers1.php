<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_dossiers1.php');

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles1.php'); 
}

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);

$dossier_racine='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'';



/*
  =====================================================================================================================
*/
if(isset($_GET['__action']) && '__recuperer_dossiers'===$_GET['__action']){
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_GET , true ) . '</pre>' ; exit(0);
 $le_dossier_a_recuperer='../../'.$_GET['__racine'];
 $listeDesDossiersSurDisque=listerLesDossiers($le_dossier_a_recuperer);
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $arr[1] , true ) . '</pre>' ; exit(0);
 $les_valeurs_sql='';
 
 $listeDesDossiersactuels=array();
 
 $db = new SQLite3('../fta_inc/db/sqlite/system.db');

 /*
  sélection des dossiers actuels
 */
 $sql='SELECT chp_nom_dossier FROM tbl_dossiers WHERE chx_cible_dossier=\''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\'';
 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM)){
    
    $listeDesDossiersactuels[$arr[0]]='present';
    
   }
   $stmt->close(); 
   
   foreach($listeDesDossiersSurDisque[1] as $k1 => $v1){
     $nom_du_dossier_a_creer=substr( $v1['chemin'] , strlen($le_dossier_a_recuperer) );
     if(isset($listeDesDossiersactuels[$nom_du_dossier_a_creer])){
      /* dossier déjà existant */
     }else{
      $les_valeurs_sql.='INSERT OR IGNORE INTO tbl_dossiers( chp_nom_dossier , chx_cible_dossier ) VALUES (\''.addslashes1($nom_du_dossier_a_creer).'\' , \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\');'.CRLF;
     }
   }
   
   
 }else{
  ajouterMessage('erreur' ,  __LINE__ .' : erreur de récupération des dossiers actuels ' . $db->lastErrorMsg() . ' ' . $db->lastErrorCode()  , BNF  );
 }
 
 
      
   
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nom_du_dossier_a_creer , true ) . '</pre>' ; exit(0);
  
 
 if($les_valeurs_sql!==''){
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . $les_valeurs_sql  . '</pre>' ; exit(0);
     $resultat=$db->exec($les_valeurs_sql);
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $resultat , true ) . '</pre>' ; exit(0);
     if( true === $resultat){
         ajouterMessage('succes' ,  __LINE__ .' : les dossiers ont été importés' , BNF  );
     }else{
         ajouterMessage('erreur' ,  __LINE__ .' : erreur d\'importation des dossiers ' . $db->lastErrorMsg() . ' ' . $db->lastErrorCode()  , BNF  );
     }

    }else{
     ajouterMessage('info' ,  __LINE__ .' : aucun dossier à importer ' , BNF  );

 }
 recharger_la_page(BNF); 
 
 
 
}
/*
  =====================================================================================================================
*/
if(isset($_GET['__action']) && '__integration_des_dossiers_existants'===$_GET['__action']){
 
 $arr=listerLesDossiers($dossier_racine);
 if(count($arr)>0){
  $db = new SQLite3('../fta_inc/db/sqlite/system.db');

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
    
    $chaineRev='';
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
     $sousChaineRev='';
     if($k1!=='vendor'){
      /*
       on ne met pas le sous dossier vendor qui contient des bibliothèques importées par composer
      */
      $niveau++;
      $sousDossiers=listerLesDossiers($v1, $niveau);
      $niveau--;
      if(count($sousDossiers[0])>0){
       $temp[$k1]=array('chemin' => $v1 , 'dossiers' => $sousDossiers[0] );
//       $temp[$k1]=$sousDossiers[0];
       $sousChaineRev=$sousDossiers[1];
      }else{
       $temp[$k1]=array('chemin' => $v1 );
      }
     }
     if($chaineRev!==''){
      $chaineRev.=',';
     }
     $chaineRev.=$k1.'(';
     if($sousChaineRev!==''){
      $chaineRev.=$sousChaineRev;
     }
     $chaineRev.=')';
     
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
     return(array($temp , $lineaire , $chaineRev));
    }else{
     return(array($temp,$chaineRev));
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

$__xpage                 = recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage'                 , BNF);
$chi_id_dossier          = recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_dossier'          , BNF);
$chp_nom_dossier         = recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_dossier'         , BNF);

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


$db = new SQLite3('../fta_inc/db/sqlite/system.db');

if($_SESSION[APP_KEY]['cible_courante']['chi_id_cible']===APP_KEY){
    /*
    si la cible courante EST la clé de l'application,
    il faut créer le dossier racine en base
    */
    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    $nomDossier='/';
    $sql='INSERT OR IGNORE INTO tbl_dossiers (chp_nom_dossier,chx_cible_dossier	) VALUES ( \''.addslashes1($nomDossier).'\' , \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' ) ';

    if((false === $db->exec($sql))){

        echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;

    }
}


$__debut=$__xpage*($__nbMax);
$champs0='`chi_id_dossier`          , `chp_nom_dossier` 
';
$sql0='SELECT '.$champs0;
$from0='
 FROM `tbl_dossiers` `T0`
 
';
$sql0.=$from0;
$where0='
 WHERE  "T0"."chx_cible_dossier" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
';


if(($chp_nom_dossier != '')){

    $where0.='
  AND `T0`.`chp_nom_dossier` LIKE \'%'.addslashes1($chp_nom_dossier).'%\'
 ';

}


if(($chi_id_dossier != '')){

    $where0.='
  AND `T0`.`chi_id_dossier` = \''.addslashes1($chi_id_dossier).'\'
 ';

}

$sql0.=$where0;
$order0='
 ORDER BY `T0`.`chp_nom_dossier` ASC
';
$sql0.=$order0;
$plage0=' LIMIT '.addslashes1($__nbMax).' OFFSET '.addslashes1($__debut).';';
$sql0.=$plage0;


$data0=array();


$stmt = $db->prepare($sql0);
if($stmt!==false){
  $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
  while($arr=$result->fetchArray(SQLITE3_NUM)){
   array_push($data0, array(
    'T0.chi_id_dossier'          => $arr[0],
    'T0.chp_nom_dossier'         => $arr[1],
   ));
  }
  $stmt->close(); 
  
    $__nbEnregs=count($data0);

    if(($__nbEnregs >= $__nbMax || $__xpage > 0)){

        $sql1='SELECT COUNT(*) '.$from0.$where0;
        $__nbEnregs=$db->querySingle($sql1);

    }
  
  
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
}

$consUrlRedir=''.'&amp;chi_id_dossier='.rawurlencode($chi_id_dossier).'&amp;chp_nom_dossier='.rawurlencode($chp_nom_dossier).'';
$__bouton_enregs_suiv=' <span class="yybtn yyunset">&raquo;</span>';

if(($__debut+$__nbMax < $__nbEnregs)){

    $__bouton_enregs_suiv=' <a href="'.BNF.'?__xpage='.(($__xpage+1)).$consUrlRedir.'">&raquo;</a>';

}

$__bouton_enregs_prec=' <span class="yybtn yyunset">&laquo;</span>';

if(($__xpage > 0)){

    $__bouton_enregs_prec=' <a href="'.BNF.'?__xpage='.($__xpage-1).$consUrlRedir.'">&laquo;</a>';

}


$o1.='<div>';
$o1.='<form class="yylistForm1">';
$o1.=' <a class="yyinfo" href="zz_sources_action1.php?__action=__creation">Créer un nouveau source</a>'.CRLF;
$o1.=' '.$__bouton_enregs_prec.' '.$__bouton_enregs_suiv.' <div style="display:inline-block;">';

if(($__nbEnregs > 0)){

    $o1.='page '.(($__xpage+1)).'/'.ceil($__nbEnregs/($__nbMax)).' ('.$__nbEnregs.' enregistrements )</div>'.CRLF;

}else{

    $o1.='pas d\'enregistrements'.CRLF;
}

$o1.='</form>';
$o1.='</div>';

 

$__lsttbl='';
$__lsttbl.='<thead><tr>';
$__lsttbl.='<th>action</th>';
$__lsttbl.='<th>id</th>';
$__lsttbl.='<th>nom</th>';
$__lsttbl.='</tr></thead><tbody>';
foreach($data0 as $k0=>$v0){
 
 $__lsttbl.='<tr>';
 $__lsttbl.='<td data-label="" style="text-align:left!important;">';
 $__lsttbl.='<div class="yyflex1">';
 if($v0['T0.chp_nom_dossier']!=='/'){
  $__lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_dossiers_action1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_dossier'].'" title="modifier">✎</a>';//✎ #9998
  $__lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_dossiers_action1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_dossier'].'" title="supprimer">✘</a>';
 }else{
  
        $__valeurs=recupere_une_donnees_des_dossiers_avec_parents($v0['T0.chi_id_dossier'],$db);
        
        if($__valeurs['T1.chp_dossier_cible']==='fta' && APP_KEY !== 'fta'){
         
           /*
           si c'est la racine d'un autre environnement, on peut le faire
           */
         
         
           $__lsttbl.=' <a class="yyinfo yytxtSiz1" href="zz_dossiers_action1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_dossier'].'" title="modifier">✎</a>';
           /*✎ #9998*/
           $__lsttbl.=' <a class="yydanger yytxtSiz1" href="zz_dossiers_action1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_dossier'].'" title="supprimer">✘</a>';
        }else{
        
        
        


          $__lsttbl.='<span class=" yybtn yyunset" title="modifier">✎</span>';
          $__lsttbl.='<span class=" yybtn yyunset" title="supprimer">✘</span>';
        }
  
  
 }
 
 $__lsttbl.='</div>';
 
 $__lsttbl.='</td>';


 
 $__lsttbl.='<td style="text-align:center;">';
 $__lsttbl.=''.$v0['T0.chi_id_dossier'].'';
 $__lsttbl.='</td>';
 
 $__lsttbl.='<td style="text-align:left;">';
 $__lsttbl.='['.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].']'.$v0['T0.chp_nom_dossier'].'';
 $__lsttbl.='</td>';
 
 
 $__lsttbl.='<tr>';
}

$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$__lsttbl.'</tbody></table></div>'.CRLF;

$o1.='<a class="yyinfo" href="zz_dossiers_action1.php?__action=__creation">Créer un nouveau dossier</a>'.CRLF;

if(( $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible']==='fta' && $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] !== 'fta' )){
 
  $o1.='<a class="yyinfo" href="zz_dossiers1.php?__action=__recuperer_dossiers&amp;__racine='.rawurlencode(APP_KEY).'">recupérer les dossiers de '.APP_KEY.'</a>'.CRLF;
 
    
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
