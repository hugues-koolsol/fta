<?php
define("BNF",basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true);
/* sess,bdd*/

if(!isset($_SESSION[APP_KEY]['cible_courante'])){

    ajouterMessage('info',__LINE__.' : veuillez sélectionner une cible ');
    recharger_la_page('zz_cibles_l1.php');

}

/*
  =====================================================================================================================
*/

function supprimer_repertoire_et_fichiers_inclus($dirPath){


    if(substr($dirPath,strlen($dirPath)-1,1) != '/'){

        $dirPath.='/';

    }

    $files=glob($dirPath.'*',GLOB_MARK);
    foreach($files as $file){

        if(is_dir($file)){

            supprimer_repertoire_et_fichiers_inclus($file);

        }else{

            unlink($file);
        }

    }
    rmdir($dirPath);

}
/*
  =====================================================================================================================
*/

if((isset($_POST)) && (count($_POST) > 0)){


    if((isset($_POST['__action'])) && ($_POST['__action'] === '__gererer_les_fichiers_des_requetes')){

        $time_start=microtime(true);
        sql_inclure_reference(6);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_6.php');
        /*
        SELECT 
        `T0`.`chi_id_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete`
         FROM b1.tbl_requetes T0
        WHERE (`T0`.`chx_cible_requete` = :T0_chx_cible_requete)
         ORDER BY  `T0`.`chi_id_requete`  ASC;

        */
        /*sql_inclure_fin*/
        
        $retour_sql=sql_6(array( 'T0_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $retour_sql , true ) . '</pre>' ; exit(0);*/

        if($retour_sql['statut'] === true){

            $chaine_js='';
            $repertoire_destination=INCLUDE_PATH.DIRECTORY_SEPARATOR.'sql';

            if(is_dir($repertoire_destination)){

                supprimer_repertoire_et_fichiers_inclus($repertoire_destination);

            }


            if(!mkdir($repertoire_destination,511)){

                ajouterMessage('erreur',__LINE__.' erreur création du répertoire inc/sql',BNF);
                recharger_la_page(BNF);

            }

            foreach($retour_sql['valeur'] as $k1 => $v1){
                $nom_fichier=$repertoire_destination.DIRECTORY_SEPARATOR.'sql_'.$v1['T0.chi_id_requete'].'.php';

                if($fd=fopen($nom_fichier,'w')){


                    if(fwrite($fd,'<?'.'php'.PHP_EOL.$v1['T0.cht_php_requete'])){

                        fclose($fd);
                        $chaine_js.=CRLF.'"'.$v1['T0.chi_id_requete'].'":'.json_encode($v1['T0.cht_sql_requete']).',';

                    }else{

                        ajouterMessage('erreur',__LINE__.' erreur ecriture fichier sql_'.$v1['T0.chi_id_requete'].'.php',BNF);
                        recharger_la_page(BNF);
                    }


                }else{

                    ajouterMessage('erreur',__LINE__.' erreur ouverture fichier sql_'.$v1['T0.chi_id_requete'].'.php',BNF);
                    recharger_la_page(BNF);
                }

            }
            $nom_fichier=$repertoire_destination.DIRECTORY_SEPARATOR.'aa_js_sql.js';

            if($fd=fopen($nom_fichier,'w')){

                if(fwrite($fd,'//<![CDATA['.CRLF.'aa_js_sql={'.CRLF.$chaine_js.CRLF.'};'.CRLF.'//]]>')){

                    fclose($fd);

                }else{

                    ajouterMessage('erreur',__LINE__.' erreur ecriture fichier saa_js_sql',BNF);
                    recharger_la_page(BNF);
                }


            }else{

                ajouterMessage('erreur',__LINE__.' erreur ouverture fichier saa_js_sql',BNF);
                recharger_la_page(BNF);
            }

            $zip=new ZipArchive();

            if($zip->open($repertoire_destination.DIRECTORY_SEPARATOR.'sql.zip',ZIPARCHIVE::CREATE) !== TRUE){

                ajouterMessage('erreur',__LINE__.' erreur ouverture fichier zip',BNF);
                recharger_la_page(BNF);

            }

            foreach($retour_sql['valeur'] as $k1 => $v1){
                $chemin_fichier=realpath($repertoire_destination.DIRECTORY_SEPARATOR.'sql_'.$v1['T0.chi_id_requete'].'.php');
                $nom_fichier='sql_'.$v1['T0.chi_id_requete'].'.php';

                if(!$zip->addFile($chemin_fichier,$nom_fichier)){

                    $zip->close();
                    ajouterMessage('erreur',__LINE__.' ajout du fichier "'.$nom_fichier.'" au zip impossible ',BNF);
                    recharger_la_page(BNF);

                }

            }
            $zip->close();
            /*          echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $retour_sql['valeur'] , true ) . '</pre>' ; exit(0);*/

        }else{

            ajouterMessage('erreur',__LINE__.' erreur sql '.$retour_sql['message'],BNF);
            recharger_la_page(BNF);
        }

        $time_end=microtime(true);
        $time=(int)(($time_end-$time_start)*1000*1000)/1000;
        ajouterMessage('succes',__LINE__.' les fichiers sql ont bien été générés ('.$time.' ms)',BNF);

    }


    if((isset($_POST['supprimer_une_requete'])) && (is_numeric($_POST['supprimer_une_requete']))){

        sql_inclure_reference(4);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_4.php');
        /*
        
        DELETE FROM b1.tbl_requetes
        WHERE (`chi_id_requete` = :chi_id_requete
         AND `chx_cible_requete` = :chx_cible_requete) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_4(array( 'chi_id_requete' => $_POST['supprimer_une_requete'], 'chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));

        if($tt['statut'] !== true){

            ajouterMessage('erreur',__LINE__.' '.$tt['message'],BNF);
            recharger_la_page(BNF);

        }

        sql_inclure_reference(5);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_5.php');
        /*
        
        DELETE FROM b1.tbl_revs
        WHERE (`chx_cible_rev` = :chx_cible_rev
         AND `chp_provenance_rev` = :chp_provenance_rev
         AND `chx_source_rev` = :chx_source_rev) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_5(array( 'chx_cible_rev' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'], 'chp_provenance_rev' => 'sql', 'chx_source_rev' => $_POST['supprimer_une_requete']));

        if($tt['statut'] !== true){

            ajouterMessage('erreur',__LINE__.' '.$tt['message'],BNF);
            recharger_la_page(BNF);

        }else{

            ajouterMessage('info',__LINE__.' requête supprimée '.$_POST['supprimer_une_requete'],BNF);
            recharger_la_page(BNF);
        }

        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/

    }


    if((isset($_POST['renuméroter_une_requete'])) && (is_numeric($_POST['renuméroter_une_requete'])) && (isset($_POST['__nouveau_numéro'])) && (is_numeric($_POST['__nouveau_numéro']))){

        /*        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/
        sql_inclure_reference(3);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_3.php');
        /*
        
        UPDATE b1.tbl_requetes SET `chi_id_requete` = :n_chi_id_requete
        WHERE (`chi_id_requete` = :c_chi_id_requete) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_3(array( 
         'c_chi_id_requete' => $_POST['renuméroter_une_requete'], 
         'c_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
         'n_chi_id_requete' => $_POST['__nouveau_numéro']
        ));

        if($tt['statut'] === true){

            ajouterMessage('info',__LINE__.' requête renumérotée dans requetes de '.$_POST['renuméroter_une_requete'].' à '.$_POST['__nouveau_numéro'].'',BNF);

        }else{

            ajouterMessage('erreur',__LINE__.' '.$tt['message'],BNF);
            recharger_la_page(BNF);
        }

        sql_inclure_reference(8);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_8.php');
        /*
        
        UPDATE b1.tbl_revs SET `chx_source_rev` = :n_chx_source_rev
        WHERE (`chx_cible_rev` = :c_chx_cible_rev
         AND `chp_provenance_rev` = :c_chp_provenance_rev
         AND `chx_source_rev` = :c_chx_source_rev) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_8(array(
            'n_chx_source_rev' => $_POST['__nouveau_numéro'],
            'c_chx_cible_rev' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
            'c_chp_provenance_rev' => 'sql',
            'c_chx_source_rev' => $_POST['renuméroter_une_requete']));

        if($tt['statut'] !== true){

            ajouterMessage('erreur',__LINE__.' '.$tt['message'],BNF);
            recharger_la_page(BNF);

        }else{

            ajouterMessage('info',__LINE__.' requête renumérotée dans rev  de '.$_POST['renuméroter_une_requete'].' à '.$_POST['__nouveau_numéro'].'',BNF);
            recharger_la_page(BNF);
        }


    }

    recharger_la_page(BNF);

}

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

if((isset($_GET['__action'])) && ($_GET['__action'] == '__suppression') && (isset($_GET['__id'])) && (is_numeric($_GET['__id']))){

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/
    $o1='<form method="post" style="text-align:center;">';
    $o1.='<button class="yydanger" name="supprimer_une_requete" value="'.$_GET['__id'].'">Je confirme la suppression de la requête '.$_GET['__id'].'</button>';
    /*  $o1.='<input type="hidden" name="__id" value="'.$_GET['__id'].'" />';*/
    $o1.='</form>';
    print($o1);
    $o1='';

}


if((isset($_GET['__action'])) && ($_GET['__action'] == '__renuméroter') && (isset($_GET['__id'])) && (is_numeric($_GET['__id']))){

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/
    $o1='<form method="post" style="text-align:center;">';
    $o1.='<input type="text" name="__nouveau_numéro" value="0" autofocus="autofocus" />';
    $o1.='<button class="yydanger" name="renuméroter_une_requete" value="'.$_GET['__id'].'">Je confirme la renumération de la requête '.$_GET['__id'].'</button>';
    $o1.='</form>';
    print($o1);
    $o1='';

}

$o1='';
$__debut=0;
$__nbEnregs=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
$chi_id_requete=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_requete',BNF);
$cht_rev_requete=recuperer_et_sauvegarder_les_parametres_de_recherche('cht_rev_requete',BNF);
$chp_type_requete=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_type_requete',BNF);
$autofocus='chi_id_requete';

if($cht_rev_requete != ''){

    $autofocus='cht_rev_requete';

}else if($chp_type_requete != ''){

    $autofocus='chp_type_requete';

}else if($chi_id_requete != ''){

    $autofocus='chi_id_requete';

}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_requete">id</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_requete" id="chi_id_requete"   value="'.enti1($chi_id_requete).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_requete')?' autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="cht_rev_requete">rev</label>'.CRLF;
$o1.='    <input  type="text" name="cht_rev_requete" id="cht_rev_requete"   value="'.enti1($cht_rev_requete).'"  size="8" maxlength="64"  '.(($autofocus == 'cht_rev_requete')?' autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_type_requete">type</label>'.CRLF;
$o1.='    <input  type="text" name="chp_type_requete" id="chp_type_requete"   value="'.enti1($chp_type_requete).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_type_requete')?' autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF;
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='</form>'.CRLF;
$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*$__nbMax;
sql_inclure_reference(2);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_2.php');
/*
SELECT 
`T0`.`chi_id_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , 
`T0`.`cht_commentaire_requete`
 FROM b1.tbl_requetes T0
WHERE (/ *  * / `T0`.`chx_cible_requete` = :T0_chx_cible_requete
 AND `T0`.`chi_id_requete` = :T0_chi_id_requete
 AND `T0`.`chp_type_requete` LIKE :T0_chp_type_requete
 AND `T0`.`cht_rev_requete` LIKE :T0_cht_rev_requete)
 ORDER BY  `T0`.`chi_id_requete` DESC
 LIMIT :quantitee OFFSET :debut ;

*/
/*sql_inclure_fin*/

$tt=sql_2(array(
    'T0_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    'T0_chi_id_requete' => $chi_id_requete,
    'T0_cht_rev_requete' => (($cht_rev_requete === NULL)?$cht_rev_requete:(($cht_rev_requete === '')?'':'%'.$cht_rev_requete.'%')),
    'T0_chp_type_requete' => (($chp_type_requete === NULL)?$chp_type_requete:(($chp_type_requete === '')?'':'%'.$chp_type_requete.'%')),
    'quantitee' => $__nbMax,
    'debut' => $__debut,
    'page_courante' => BNF));

if($tt['statut'] === false){

    $o1.='<div>';
    $o1.='<div class="yydanger">Erreur sql</div>';
    $o1.='<pre>'.$tt['sql0'].'</per>';
    $o1.='</div>';
    $js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
    $par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
    $o1.=html_footer1($par);
    print($o1);
    $o1='';
    exit(0);

}

$__nbEnregs=$tt['nombre'];
$consUrlRedir=''.'&amp;chi_id_requete='.rawurlencode($chi_id_requete).'&amp;cht_rev_requete='.rawurlencode($cht_rev_requete).'&amp;chp_type_requete='.rawurlencode($chp_type_requete).'';
$boutons_avant='<a class="yyinfo" href="zz_requetes_a1.php?__action=__creation">Créer une nouvelle requete</a>';
$boutons_avant.=' <button class="yyavertissement" name="__action" value="__gererer_les_fichiers_des_requetes">gererer les fichiers des requetes</button>'.CRLF;
$o1.=construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$boutons_avant);
$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>type</th>';
$lsttbl.='<th>commentaire</th>';
$lsttbl.='<th>rev</th>';
$lsttbl.='<th>sql</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($tt['valeur'] as $k0 => $v0){
    $lsttbl.='<tr>';
    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';
    $lsttbl.=' <a class="yyinfo" href="zz_requetes_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_requete'].'" title="modifier">✎</a>';
    $lsttbl.=' <a class="yydanger" href="zz_requetes_l1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_requete'].'" title="supprimer">x</a>';
    $lsttbl.=' <a class="yysucces" href="zz_requetes_l1.php?__action=__renuméroter&amp;__id='.$v0['T0.chi_id_requete'].'" title="renuméroter">#</a>';
    $lsttbl.='</div>';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:center;">'.$v0['T0.chi_id_requete'].'</td>';
    $lsttbl.='<td style="text-align:left;">'.$v0['T0.chp_type_requete'].'</td>';
    $lsttbl.='<td style="text-align:center;">'.$v0['T0.cht_commentaire_requete'].'</td>';
    $lsttbl.='<td style="text-align:left;">';

    if($v0['T0.cht_rev_requete'] !== null){

        $lsttbl.=enti1(mb_substr($v0['T0.cht_rev_requete'],0,500));

    }

    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:left;">';

    if($v0['T0.cht_sql_requete'] !== null){

        $lsttbl.=enti1(mb_substr($v0['T0.cht_sql_requete'],0,500));

    }

    $lsttbl.='</td>';
    $lsttbl.='</tr>';
}
$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$lsttbl.'</tbody></table></div>'.CRLF;
/* $o1.= __FILE__ . ' ' . __LINE__ . ' $tab0 = <pre>' . var_export( $data0 , true ) . '</pre>' ;*/
/*
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);
$o1='';
exit(0);
?>