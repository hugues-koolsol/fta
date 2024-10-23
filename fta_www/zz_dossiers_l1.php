<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true);
/* sess,bdd*/


if(!isset($_SESSION[APP_KEY]['cible_courante'])){

    ajouterMessage('info',__LINE__.' : veuillez sélectionner une cible ');
    recharger_la_page('zz_cibles_l1.php');

}

/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);*/
$dossier_racine='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'';
/*
  =====================================================================================================================
*/

if((isset($_GET['__action'])) && ('__recuperer_dossiers' === $_GET['__action'])){

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_GET , true ) . '</pre>' ; exit(0);*/
    $le_dossier_a_recuperer='../../'.$_GET['__racine'];
    $listeDesDossiersSurDisque=listerLesDossiers($le_dossier_a_recuperer);
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $arr[1] , true ) . '</pre>' ; exit(0);*/
    $les_valeurs_sql='';
    $listeDesDossiersactuels=array();
    /*
      sélection des dossiers actuels
    */
    sql_inclure_reference(51);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_51.php');
    /*
    SELECT 
    `T0`.`chi_id_dossier` , `T0`.`chx_cible_dossier` , `T0`.`chp_nom_dossier`
     FROM b1.tbl_dossiers T0
    WHERE (`T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);

    */
    /*sql_inclure_fin*/
    
    $tt=sql_51(array( 'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));

    if($tt['statut'] === false){

        ajouterMessage('erreur',__LINE__.' : erreur de récupération des dossiers actuels '.$tt['message'],BNF);
        recharger_la_page(BNF);

    }

    for($i=0;($i < count($tt['valeur']));$i++){

        if($tt['valeur'][$i]['T0.chp_nom_dossier'] !== '/'){

            $listeDesDossiersactuels[$tt['valeur'][$i]['T0.chp_nom_dossier']]='present';

        }

    }
    /*    echo __FILE__ . ' ' . __LINE__ . ' $listeDesDossiersactuels = <pre>' . var_export( $listeDesDossiersactuels , true ) . ' $listeDesDossiersSurDisque[1] = <pre>' . var_export( $listeDesDossiersSurDisque[1] , true ) . '</pre>' ; exit(0);*/
    $tableau_a_inserer=array();
    foreach($listeDesDossiersSurDisque[1] as $k1 => $v1){
        $nom_du_dossier_a_creer=substr($v1['chemin'],strlen($le_dossier_a_recuperer));

        if(isset($listeDesDossiersactuels[$nom_du_dossier_a_creer])){

            /* dossier déjà existant */

        }else if(((substr($nom_du_dossier_a_creer,0,strlen('/fta_backup')) === '/fta_backup') && (strlen($nom_du_dossier_a_creer) > strlen('/fta_backup'))) || ((substr($nom_du_dossier_a_creer,0,strlen('/fta_temp')) === '/fta_temp') && (strlen($nom_du_dossier_a_creer) > strlen('/fta_temp'))) || (substr($nom_du_dossier_a_creer,0,strlen('/ftb_temp')) === '/ftb_temp')){

            /*
              on ne copie pas les sous dossiers de fta backup et de fta_temp
            */

        }else{

            $tableau_a_inserer[]=array( 'chp_nom_dossier' => $nom_du_dossier_a_creer, 'chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']);
        }

    }

    if(count($tableau_a_inserer) > 0){

        sql_inclure_reference(52);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_52.php');
        /*
        
        INSERT  OR IGNORE INTO b1.`tbl_dossiers`(
            `chx_cible_dossier` , 
            `chp_nom_dossier`
        ) VALUES (
            :chx_cible_dossier , 
            :chp_nom_dossier
        );

        */
        /*sql_inclure_fin*/
        
        $tt=sql_52($tableau_a_inserer);

        if($tt['statut'] === true){

            ajouterMessage('succes',__LINE__.' : les dossiers ont été importés',BNF);

        }else{

            ajouterMessage('erreur',__LINE__.' : erreur d\'importation des dossiers '.$tt['message'],BNF);
        }


    }else{

        ajouterMessage('info',__LINE__.' : les dossiers sont synchronisés',BNF);
    }

    recharger_la_page(BNF);

}

/*
  =====================================================================================================================
*/

function listerLesDossiers($dir,$niveau=0){

    /*    echo __FILE__ . ' ' . __LINE__ . ' $niveau='.$niveau.' , $dir = <pre>' . var_export( $dir , true ) . '</pre>' ; */
    $chaineRev='';
    $ffs=scandir($dir);
    unset($ffs[array_search('.',$ffs,true)]);
    unset($ffs[array_search('..',$ffs,true)]);

    if(count($ffs) < 1){

        return(array( array(), ''));

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

        if($k1 !== 'vendor'){

            /*
              on ne met pas le sous dossier vendor qui contient des bibliothèques importées par composer
            */
            $sousDossiers=listerLesDossiers($v1,($niveau+1));

            if(count($sousDossiers[0]) > 0){

                $temp[$k1]=array( 'chemin' => $v1, 'dossiers' => $sousDossiers[0]);
                /* $temp[$k1]=$sousDossiers[0];*/
                $sousChaineRev=$sousDossiers[1];

            }else{

                $temp[$k1]=array( 'chemin' => $v1);
            }


        }


        if($chaineRev !== ''){

            $chaineRev.=',';

        }

        $chaineRev.=$k1.'(';

        if($sousChaineRev !== ''){

            $chaineRev.=$sousChaineRev;

        }

        $chaineRev.=')';
    }

    if($niveau === 0){


        function linearise($entree,&$sortie,$niveau=0){

            foreach($entree as $k1 => $v1){

                if(isset($v1['chemin'])){

                    $sortie[$k1]=array( 'niveau' => $niveau/2, 'chemin' => $v1['chemin']);
                    /* , 'chemin' => $v1['chemin']*/

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
        linearise($temp,$lineaire);
        return(array( $temp, $lineaire, $chaineRev));

    }else{

        return(array( $temp, $chaineRev));
    }


}
/*
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'Dossiers', 'description' => 'Dossiers'));
print($o1);
$o1='';
$o1.='    <h1>Liste des dossiers de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>'.CRLF;
/*
  =====================================================================================================================
*/
$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
if(isset($_GET['button_chercher'])){
 $__xpage=0;
}else{
 $__xpage=(int)$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'];
}
$__nbEnregs=0;

$chi_id_dossier=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_dossier',BNF);
$chp_nom_dossier=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_dossier',BNF);
$autofocus='chi_id_dossier';

if($chi_id_dossier != ''){

    $autofocus='chi_id_dossier';

}else if($chp_nom_dossier != ''){

    $autofocus='chp_nom_dossier';

}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_dossier">id dossier</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_dossier" id="chi_id_dossier" value="'.enti1($chi_id_dossier).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_dossier')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_dossier">nom</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_dossier" id="chp_nom_dossier"   value="'.enti1($chp_nom_dossier).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_nom_dossier')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.html_du_bouton_rechercher_pour_les_listes().CRLF.'   </div>'.CRLF;

$o1.='</form>'.CRLF;


$__debut=$__xpage*($__nbMax);

sql_inclure_reference(53);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_53.php');
/*
SELECT 
`T0`.`chi_id_dossier` , `T0`.`chp_nom_dossier`
 FROM b1.tbl_dossiers T0
WHERE (`T0`.`chi_id_dossier` = :T0_chi_id_dossier 
 AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier 
 AND `T0`.`chp_nom_dossier` LIKE :T0_chp_nom_dossier) 
 ORDER BY  `T0`.`chp_nom_dossier` ASC, `T0`.`chi_id_dossier` DESC LIMIT :quantitee OFFSET :debut ;
*/ 
/*sql_inclure_fin*/

$tt=sql_53(array(
    'T0_chi_id_dossier' => $chi_id_dossier,
    'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    'T0_chp_nom_dossier' => (($chp_nom_dossier === NULL)?$chp_nom_dossier:(($chp_nom_dossier === '')?'':'%'.$chp_nom_dossier.'%')),
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
$consUrlRedir='&amp;chi_id_dossier='.rawurlencode($chi_id_dossier).'&amp;chp_nom_dossier='.rawurlencode($chp_nom_dossier).'';
$boutons_haut=' <a class="yyinfo" href="zz_dossiers_a1.php?__action=__creation">Créer un nouveau dossier</a>'.CRLF;
$o1.=construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$__xpage,$boutons_haut);

$__lsttbl='';
$__lsttbl.='  <thead><tr>';
$__lsttbl.='<th>action</th>';
$__lsttbl.='<th>id</th>';
$__lsttbl.='<th>nom</th>';
$__lsttbl.='</tr></thead>'.CRLF.'  <tbody>'.CRLF;
foreach($tt['valeur'] as $k0 => $v0){
    $__lsttbl.='<tr>'.CRLF;
    $__lsttbl.='<td data-label="" style="text-align:left!important;">';
    $__lsttbl.='<div class="yyflex1">';

    if($v0['T0.chp_nom_dossier'] !== '/'){

        $__lsttbl.=' <a class="yyinfo" href="zz_dossiers_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_dossier'].'" title="modifier">✎</a>';
        $__lsttbl.=' <a class="yydanger" href="zz_dossiers_a1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_dossier'].'" title="supprimer">🗑</a>';

    }else{
        $__lsttbl.='<a class="yyunset" title="modifier">✎</a>';
        $__lsttbl.='<a class="yyunset" title="supprimer">🗑</a>';
    }

    $__lsttbl.='</div>';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:center;">';
    $__lsttbl.=''.$v0['T0.chi_id_dossier'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:left;">';
    $__lsttbl.='['.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].']'.$v0['T0.chp_nom_dossier'].'';
    $__lsttbl.='</td>';
    $__lsttbl.=CRLF.'</tr>'.CRLF;
}
$o1.='<div style="overflow-x:scroll;">'.CRLF.' <table class="yytableResult1">'.CRLF.$__lsttbl.'  </tbody>'.CRLF.' </table>'.CRLF.'</div>'.CRLF;

if(($_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] === 'fta') && ($_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] !== 'fta')){

    $o1.='<a class="yyinfo" href="zz_dossiers_l1.php?__action=__recuperer_dossiers&amp;__racine='.rawurlencode(APP_KEY).'">recupérer les dossiers de '.APP_KEY.'</a>'.CRLF;

}

/* $o1.= __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data0 , true ) . '</pre>' ;*/
/*
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
print($o1);
$o1='';
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);
$o1='';
?>