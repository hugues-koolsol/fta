<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ true);
/*
  =====================================================================================================================
*/

if(isset($_GET['__action']) && '__selectionner_cette_cible' === $_GET['__action']){


    if(isset($_SESSION[APP_KEY]['cible_courante'])){

        unset($_SESSION[APP_KEY]['cible_courante']);

    }

    $__id=isset($_GET['__id']) ? (is_numeric($_GET['__id']) ? (int)($_GET['__id']) : 0) : 0;

    if($__id !== 0){

        sql_inclure_reference(34);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_34.php');
        /*
        SELECT 
        `T0`.`chi_id_cible` , `T0`.`chp_nom_cible` , `T0`.`chp_dossier_cible` , `T0`.`chp_commentaire_cible`
         FROM b1.tbl_cibles T0
        WHERE `T0`.`chi_id_cible` = :T0_chi_id_cible;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_34(array( 'T0_chi_id_cible' => $__id));

        if($tt[__xst] === true && count($tt[__xva]) === 1){

            $_SESSION[APP_KEY]['cible_courante']=array( 'chi_id_cible' => $tt[__xva][0]['T0.chi_id_cible'], 'chp_nom_cible' => $tt[__xva][0]['T0.chp_nom_cible'], 'chp_dossier_cible' => $tt[__xva][0]['T0.chp_dossier_cible']);
            ajouterMessage('info',__LINE__ . ' : une nouvelle cible a été sélectionnée ' . date('H:i:s'),BNF);

        }


    }

    recharger_la_page(BNF);
    /* $_SESSION[APP_KEY]['cible_courante']=array();*/

}

/*
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'Cibles', 'description' => 'Cibles'));
print($o1);
$o1='';
$o1 .= '<h1>Liste des systèmes cibles</h1>';
/*
  =====================================================================================================================
*/
$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);

if(isset($_GET['button_chercher'])){

    $__xpage=0;

}else{

    $__xpage=(int)($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']);
}

$__nbEnregs=0;
$chi_id_cible=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_cible',BNF);
$chp_nom_cible=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_cible',BNF);
$chp_dossier_cible=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_dossier_cible',BNF);
$chp_commentaire_cible=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_commentaire_cible',BNF);
/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chp_nom_cible , true ) . '</pre>' ; exit(0);*/
$autofocus='chi_id_cible';

if($chi_id_cible != ''){

    $autofocus='chi_id_cible';

}else if($chp_nom_cible != ''){

    $autofocus='chp_nom_cible';

}else if($chp_dossier_cible != ''){

    $autofocus='chp_dossier_cible';

}else if($chp_commentaire_cible != ''){

    $autofocus='chp_commentaire_cible';

}

$o1 .= '<form method="get" class="yyfilterForm">' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chi_id_cible">id cible</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chi_id_cible" id="chi_id_cible"   value="' . enti1($chi_id_cible) . '"  size="8" maxlength="32"  ' . ($autofocus == 'chi_id_cible' ? 'autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chp_nom_cible">nom</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chp_nom_cible" id="chp_nom_cible"   value="' . enti1($chp_nom_cible) . '"  size="8" maxlength="64"  ' . ($autofocus == 'chp_nom_cible' ? 'autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chp_dossier_cible">dossier</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chp_dossier_cible" id="chp_dossier_cible"   value="' . enti1($chp_dossier_cible) . '"  size="8" maxlength="64"  ' . ($autofocus == 'chp_dossier_cible' ? 'autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chp_commentaire_cible">commentaire</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chp_commentaire_cible" id="chp_commentaire_cible"   value="' . enti1($chp_commentaire_cible) . '"  size="8" maxlength="64" ' . ($autofocus == 'chp_commentaire_cible' ? 'autofocus="autofocus"' : '') . '  />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . html_du_bouton_rechercher_pour_les_listes() . PHP_EOL . '   </div>' . PHP_EOL;
$o1 .= ' </form>' . PHP_EOL;
$__debut=$__xpage * $__nbMax;
sql_inclure_reference(33);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_33.php');
/*
SELECT 
`T0`.`chi_id_cible` , `T0`.`chp_nom_cible` , `T0`.`chp_dossier_cible` , `T0`.`chp_commentaire_cible`
 FROM b1.tbl_cibles T0
WHERE (`T0`.`chi_id_cible` = :T0_chi_id_cible
  
 AND `T0`.`chp_nom_cible` LIKE :T0_chp_nom_cible
  
 AND `T0`.`chp_dossier_cible` LIKE :T0_chp_dossier_cible
  
 AND `T0`.`chp_commentaire_cible` LIKE :T0_chp_commentaire_cible) 
ORDER BY `T0`.`chi_id_cible` ASC 
LIMIT:quantitee OFFSET :debut ;

*/
/*sql_inclure_fin*/

$tt=sql_33(array(
    'T0_chi_id_cible' => $chi_id_cible,
    'T0_chp_nom_cible' => $chp_nom_cible === null ? $chp_nom_cible : ($chp_nom_cible === '' ? '' : '%' . $chp_nom_cible . '%'),
    'T0_chp_dossier_cible' => $chp_dossier_cible === null ? $chp_dossier_cible : ($chp_dossier_cible === '' ? '' : '%' . $chp_dossier_cible . '%'),
    'T0_chp_commentaire_cible' => $chp_commentaire_cible === null ? $chp_commentaire_cible : ($chp_commentaire_cible === '' ? '' : '%' . $chp_commentaire_cible . '%'),
    'quantitee' => $__nbMax,
    'debut' => $__debut,
    'page_courante' => BNF
));
/* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tt['sql0'] , true ) . '</pre>' ; exit(0);*/

if($tt[__xst] === false){

    $o1 .= '<div>';
    $o1 .= '<div class="yydanger">Erreur sql</div>';
    $o1 .= '<pre>' . $tt['sql0'] . '</per>';
    $o1 .= '</div>';
    $par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => array());
    $o1 .= html_footer1($par);
    print($o1);
    $o1='';
    exit(0);

}

$__nbEnregs=$tt['nombre'];
$consUrlRedir='';
$consUrlRedir .= $chi_id_cible !== '' ? '&amp;chi_id_cible=' . rawurlencode($chi_id_cible) : '';
$consUrlRedir .= $chp_nom_cible !== '' ? '&amp;chp_nom_cible=' . rawurlencode($chp_nom_cible) : '';
$consUrlRedir .= $chp_dossier_cible !== '' ? '&amp;chp_dossier_cible=' . rawurlencode($chp_dossier_cible) : '';
$consUrlRedir .= $chp_commentaire_cible !== '' ? '&amp;chp_nom_source=' . rawurlencode($chp_commentaire_cible) : '';
$o1 .= construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$__xpage,'<a class="yyinfo" href="zz_cibles_a1.php?__action=__creation">Créer une nouvelle cible</a>');
$lsttbl='';
$lsttbl .= '<thead><tr>';
$lsttbl .= '<th>action</th>';
$lsttbl .= '<th>etat</th>';
$lsttbl .= '<th>id</th>';
$lsttbl .= '<th>nom</th>';
$lsttbl .= '<th>dossier</th>';
$lsttbl .= '<th>commentaire</th>';
$lsttbl .= '</tr></thead><tbody>';
foreach($tt[__xva] as $k0 => $v0){
    $dossier='../../' . $v0['T0.chp_dossier_cible'];
    $lsttbl .= '<tr>';
    $lsttbl .= '<td data-label="" style="text-align:left!important;">';
    $lsttbl .= '<div class="yyflex1">';
    $lsttbl .= ' <a class="yyinfo" href="zz_cibles_a1.php?__action=__modification&amp;__id=' . $v0['T0.chi_id_cible'] . '" title="modifier">✎</a>';

    if(isset($_SESSION[APP_KEY]['cible_courante'])){

        /* si on est sur fta ou bien que le cible est "1" ou bien qu'on est en train de travailler sur la cible courante, alors on ne peut pas supprimer la cible */

        if($v0['T0.chp_nom_cible'] === 'fta'
               && $v0['T0.chp_dossier_cible'] === 'fta'
           || $v0['T0.chi_id_cible'] === 1
           || $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] === $v0['T0.chi_id_cible']
        ){

            $lsttbl .= '<a class="yyunset" title="supprimer">🗑</a>';

        }else{

            $lsttbl .= ' <a class="yydanger" href="zz_cibles_a1.php?__action=__suppression&amp;__id=' . $v0['T0.chi_id_cible'] . '" title="supprimer">🗑</a>';
        }


    }else{

        $lsttbl .= '<a class="yyunset" title="supprimer">🗑</a>';
    }


    if(isset($_SESSION[APP_KEY]['cible_courante']['chi_id_cible'])
       && $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] === $v0['T0.chi_id_cible']
    ){

        $lsttbl .= '<a class="yyunset"  title="selectionner cette cible">⇒</a>';
        $lsttbl .= ' <a class="yysucces" href="zz_dossiers_l1.php" title="aller aux dossiers">📁</a>';

    }else{

        $lsttbl .= ' <a class="yyinfo" href="zz_cibles_l1.php?__action=__selectionner_cette_cible&amp;__id=' . $v0['T0.chi_id_cible'] . '" title="selectionner cette cible">⇒</a>';
        $lsttbl .= '<a class="yyunset"  title="aller aux dossiers">📁</a>';
    }

    $lsttbl .= '</div>';
    $lsttbl .= '</td>';
    $lsttbl .= '<td data-label="etat" style="text-align:center;">';
    $listeDesEtats='';

    if(!is_dir($dossier)){

        $listeDesEtats .= 'Le dossier n\'existe pas ';

    }else{

        $listeDesEtats .= 'Le dossier existe ';

        if(le_dossier_est_vide($dossier)){

            $listeDesEtats .= '<br />Le dossier est vide';

        }else{

            $listeDesEtats .= '<br />Le dossier contient des éléments';
        }

    }

    $lsttbl .= $listeDesEtats . '</td>';
    $lsttbl .= '<td data-label="id" style="text-align:center;">';
    $lsttbl .= '' . $v0['T0.chi_id_cible'] . '';
    $lsttbl .= '</td>';
    $lsttbl .= '<td data-label="id" style="text-align:left;">';
    $lsttbl .= '' . $v0['T0.chp_nom_cible'] . '';
    $lsttbl .= '</td>';
    $lsttbl .= '<td data-label="id" style="text-align:left;">';
    $lsttbl .= '' . $v0['T0.chp_dossier_cible'] . '';
    $lsttbl .= '</td>';
    $lsttbl .= '<td data-label="id" style="text-align:left;">';
    $lsttbl .= '' . $v0['T0.chp_commentaire_cible'] . '';
    $lsttbl .= '</td>';
    $lsttbl .= '<tr>';
}
$o1 .= '<div style="overflow-x:scroll;"><table class="yytableResult1">' . PHP_EOL . $lsttbl . '</tbody></table></div>' . PHP_EOL;
/*
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
print($o1);
$o1='';
$o1 .= html_footer1($par);
print($o1);
$o1='';