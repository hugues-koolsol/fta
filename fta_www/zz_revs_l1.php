<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true);
/* sess,bdd*/
require_once('../fta_inc/db/acces_bdd_revs1.php');

if(!(isset($_SESSION[APP_KEY]['cible_courante']))){

    ajouterMessage('info',__LINE__.' : veuillez sélectionner une cible ');
    recharger_la_page('zz_cibles_l1.php');

}

/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);*/

if((isset($_GET['supprimer_tout'])) && ($_GET['supprimer_tout'] === '1')){

    $ret0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->exec('DELETE FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_revs');

    if($ret0 !== true){

        ajouterMessage('erreur',__LINE__.' problème ',BNF);

    }else{

        ajouterMessage('info',__LINE__.' tout a été supprimé',BNF);
    }

    recharger_la_page(BNF);

}

/*
  
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'revs', 'description' => 'revs'));
print($o1);
$o1='';
$o1.='<h1>Liste des revs de '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'</h1>';
/*
  
  =====================================================================================================================
*/
$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
$chi_id_rev=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_rev',BNF);
$chp_provenance_rev=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_provenance_rev',BNF);
$chp_nom_source=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_source',BNF);
$chp_nom_source2=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_nom_source2',BNF);
$chx_source_rev=recuperer_et_sauvegarder_les_parametres_de_recherche('chx_source_rev',BNF);
$chp_valeur_rev=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_valeur_rev',BNF);
$chp_commentaire_rev=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_commentaire_rev',BNF);
$autofocus='chp_nom_source';

if($chp_nom_source != ''){

    $autofocus='chp_nom_source';

}else if($chp_provenance_rev != ''){

    $autofocus='chp_provenance_rev';

}else if($chp_nom_source2 != ''){

    $autofocus='chp_nom_source2';

}else if($chx_source_rev != ''){

    $autofocus='chx_source_rev';

}else if($chp_valeur_rev != ''){

    $autofocus='chp_valeur_rev';

}else if($chp_commentaire_rev != ''){

    $autofocus='chp_commentaire_rev';

}else if($chi_id_rev != ''){

    $autofocus='chi_id_rev';

}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_source">nom source =</label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_source" id="chp_nom_source"   value="'.enti1($chp_nom_source).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_nom_source')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_provenance_rev">provenance</label>'.CRLF;
$o1.='    <input  type="text" name="chp_provenance_rev" id="chp_provenance_rev"   value="'.enti1($chp_provenance_rev).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_provenance_rev')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_nom_source2">nom source <></label>'.CRLF;
$o1.='    <input  type="text" name="chp_nom_source2" id="chp_nom_source2"   value="'.enti1($chp_nom_source2).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_nom_source2')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_valeur_rev">valeur(1)</label>'.CRLF;
$o1.='    <input  type="text" name="chp_valeur_rev" id="chp_valeur_rev"   value="'.enti1($chp_valeur_rev).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_valeur_rev')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chx_source_rev">id source</label>'.CRLF;
$o1.='    <input  type="text" name="chx_source_rev" id="chx_source_rev"   value="'.enti1($chx_source_rev).'"  size="8" maxlength="64"  '.(($autofocus == 'chx_source_rev')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_commentaire_rev">commentaire(13)</label>'.CRLF;
$o1.='    <input  type="text" name="chp_commentaire_rev" id="chp_commentaire_rev"   value="'.enti1($chp_commentaire_rev).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_commentaire_rev')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_rev">id rev</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_rev" id="chi_id_rev"   value="'.enti1($chi_id_rev).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_rev')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="button_chercher" title="cliquez sur ce bouton pour lancer la recherche">rechercher</label>'.CRLF;
$o1.='    <button id="button_chercher" class="button_chercher"  title="cliquez sur ce bouton pour lancer la recherche">🔎</button>'.CRLF;
/* &#128270;*/
$o1.='    <input type="hidden" name="__xpage" id="__xpage" value="'.$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'].'" />'.CRLF;
$o1.='   </div>'.CRLF;
$o1.='</form>'.CRLF;
$__debut=$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']*$__nbMax;
$champs0='`chi_id_rev`          , `chp_provenance_rev` , T0.chx_source_rev        , T1.chp_nom_source       , T0.chp_valeur_rev ,
          chp_type_rev          , T0.chp_niveau_rev    , T0.chp_pos_premier_rev   , T0.chp_commentaire_rev
';
$sql0='SELECT '.$champs0;
$from0='
 FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_revs` `T0`
 LEFT JOIN `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_sources T1 ON T1.chi_id_source = T0.chx_source_rev
 
';
$sql0.=$from0;
$where0='
 WHERE  "T0"."chx_cible_rev" = '.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].' 
';

if($chp_provenance_rev != ''){

    $where0.=CRLF.'AND `T0`.`chp_provenance_rev` LIKE \'%'.sq0($chp_provenance_rev).'%\'';

}


if($chx_source_rev != ''){

    $where0.=CRLF.construction_where_sql_sur_id('`T0`.`chx_source_rev`',$chx_source_rev);
    $__nbMax=2*$__nbMax;

}


if($chp_nom_source != ''){

    $where0.=CRLF.'AND `T1`.`chp_nom_source` LIKE \'%'.sq0($chp_nom_source).'%\'';

}


if($chp_nom_source2 != ''){

    $where0.=CRLF.'AND `T1`.`chp_nom_source` NOT LIKE \'%'.sq0($chp_nom_source2).'%\'';

}


if($chp_valeur_rev != ''){

    $where0.=CRLF.'AND `T0`.`chp_valeur_rev` LIKE \'%'.sq0($chp_valeur_rev).'%\'';

}


if($chp_commentaire_rev != ''){

    $where0.=CRLF.'AND `T0`.`chp_commentaire_rev` LIKE \'%'.sq0($chp_commentaire_rev).'%\'';

}


if($chi_id_rev != ''){

    $where0.=construction_where_sql_sur_id('`T0`.`chi_id_rev`',$chi_id_rev);

}

$sql0.=$where0;
$order0='
 ORDER BY `T0`.`chp_provenance_rev` ASC , chx_source_rev ASC
';
$sql0.=$order0;
$plage0=' LIMIT '.sq0($__nbMax).' OFFSET '.sq0($__debut).';';
$sql0.=$plage0;
/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = ' . htmlentities( $sql0 ) . '</pre>' ; exit(0);*/
$__nbEnregs=0;
$data0=array();
$stmt=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);

if($stmt !== false){

    $result=$stmt->execute();
    /* SQLITE3_NUM: SQLITE3_ASSOC*/
    while(($arr=$result->fetchArray(SQLITE3_NUM))){
        array_push($data0,array(
            'T0.chi_id_rev' => $arr[0],
            'T0.chp_provenance_rev' => $arr[1],
            'T0.chx_source_rev' => $arr[2],
            'T1.chp_nom_source' => $arr[3],
            'T0.chp_valeur_rev' => $arr[4],
            'T0.chp_type_rev' => $arr[5],
            'T0.chp_niveau_rev' => $arr[6],
            'T0.chp_pos_premier_rev' => $arr[7],
            'T0.chp_commentaire_rev' => $arr[8]));
    }
    $stmt->close();
    $__nbEnregs=count($data0);

    if(($__nbEnregs >= $__nbMax) || ($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'] > 0)){

        $sql1='SELECT COUNT(*) '.$from0.$where0;
        $__nbEnregs=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql1);

    }


}else{

    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),true).'</pre>' ;
    exit(0);
}

$consUrlRedir='';
$consUrlRedir.=(($chi_id_rev !== '')?'&amp;chi_id_rev='.rawurlencode($chi_id_rev):'');
$consUrlRedir.=(($chp_provenance_rev !== '')?'&amp;chp_provenance_rev='.rawurlencode($chp_provenance_rev):'');
$consUrlRedir.=(($chx_source_rev !== '')?'&amp;chx_source_rev='.rawurlencode($chx_source_rev):'');
$consUrlRedir.=(($chp_nom_source !== '')?'&amp;chp_nom_source='.rawurlencode($chp_nom_source):'');
$consUrlRedir.=(($chp_valeur_rev !== '')?'&amp;chp_valeur_rev='.rawurlencode($chp_valeur_rev):'');
$consUrlRedir.=(($chp_commentaire_rev !== '')?'&amp;chp_commentaire_rev='.rawurlencode($chp_commentaire_rev):'');
$boutons_avant='';

if(APP_KEY === 'fta'){

    $boutons_avant='<a class="yydanger" href="'.BNF.'?supprimer_tout=1">supprimer tout</a>';

}

$o1.=construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$boutons_avant);
$__lsttbl='';
$__lsttbl.='<thead><tr>';
$__lsttbl.='<th>action</th>';
$__lsttbl.='<th>id</th>';
$__lsttbl.='<th>provenance</th>';
$__lsttbl.='<th>nom source</th>';
$__lsttbl.='<th>id source</th>';
$__lsttbl.='<th>valeur(1)</th>';
$__lsttbl.='<th>type(2)</th>';
$__lsttbl.='<th>niveau(3)</th>';
$__lsttbl.='<th>pos(5)</th>';
$__lsttbl.='<th>comm(13)</th>';
$__lsttbl.='</tr></thead><tbody>';
$tableau_pour_webworker001=array();
foreach($data0 as $k0 => $v0){
    $__lsttbl.='<tr>';
    $__lsttbl.='<td data-label="" style="text-align:left!important;">';
    $__lsttbl.='<div class="yyflex1">';
    $__lsttbl.=' <a class="yyinfo" href="zz_sources_a1.php?__action=__modification&amp;__id='.$v0['T0.chx_source_rev'].'" target="_blank" title="modifier">⇒</a>';
    
    if($v0['T0.chp_valeur_rev']==='#' && $v0['T0.chp_type_rev']==='f'){
        $__lsttbl.=' <a class="yydanger" href="javascript:__gi1.supprimer_ce_commentaire_et_recompiler('.$v0['T0.chx_source_rev'].','.$v0['T0.chi_id_rev'].')"  title="supprimer ce commentaire et recompiler">⚙️</a>';
    }else{
        $__lsttbl.=' <a class="yyunset" title="supprimer">⚙️</a>';
    }
    
    $__lsttbl.='</div>';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:center;">';
    $__lsttbl.=''.$v0['T0.chi_id_rev'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:left;">';
    $__lsttbl.=enti1($v0['T0.chp_provenance_rev']).'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:left;">';
    $__lsttbl.=enti1($v0['T1.chp_nom_source']).'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:left;">';
    $__lsttbl.=$v0['T0.chx_source_rev'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:left;">';
    $a=enti1(mb_substr($v0['T0.chp_valeur_rev'],0,100));
    $__lsttbl.=str_replace('&para;CR&para;','<br />',str_replace('&para;LF&para;','<br />',str_replace('&para;CR&para;&para;LF&para;','<br />',$a)));
    /* */
    $__lsttbl.='</td>';

    if($chp_valeur_rev != ''){


        if(!(isset($tableau_pour_webworker001[$v0['T0.chp_valeur_rev']]))){

            $tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']]=1;

        }else if(!(isset($tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']]))){

            $tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']]=1;

        }else{

            ($tableau_pour_webworker001[$v0['T0.chp_valeur_rev']][$v0['T0.chx_source_rev']]++);
        }


    }

    $__lsttbl.='<td style="text-align:left;">';
    $__lsttbl.=$v0['T0.chp_type_rev'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:left;">';
    $__lsttbl.=$v0['T0.chp_niveau_rev'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="text-align:right;">';
    $__lsttbl.=$v0['T0.chp_pos_premier_rev'].'';
    $__lsttbl.='</td>';
    $__lsttbl.='<td style="max-width: 150px;overflow-wrap: anywhere;">';
    $__lsttbl.=enti1(mb_substr($v0['T0.chp_commentaire_rev'],0,100)).'';
    $__lsttbl.='</td>';
    $__lsttbl.='</tr>';
}
$o1.='<div style="overflow-x:scroll;"><table class="yytableResult1">'.CRLF.$__lsttbl.'</tbody></table></div>'.CRLF;
/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['travaux_en_arriere_plan'] , true ) . '</pre>' ; exit(0);*/
/*$o1.='<pre>' . var_export( $tableau_pour_webworker001 , true).'</pre>';*/

if((count($tableau_pour_webworker001) >= 1) && (($__nbEnregs <= $__nbMax) || ($chp_nom_source !== ''))){

    $liste_des_taches=array();
    foreach($tableau_pour_webworker001 as $k1 => $v1){
        $chaine_a_remplacer=$k1;
        foreach($v1 as $k2 => $v2){
            $liste_des_taches[]=array( 'id_source' => $k2, 'etat' => 'a_faire');
        }

        if($chaine_a_remplacer !== ''){

            /*   $o1.='$chaine_a_remplacer='.$chaine_a_remplacer.', $liste_des_taches=' . $liste_des_taches;*/
            $__parametres_pour_travail_en_arriere_plan=array(
                'nom_du_travail_en_arriere_plan' => 'replacer_des_chaines1',
                'chaine_a_remplacer' => $chaine_a_remplacer,
                'liste_des_taches' => $liste_des_taches,
                'critere_de_recherche' => $where0);
            $paramUrl=json_encode($__parametres_pour_travail_en_arriere_plan,JSON_FORCE_OBJECT);
            $paramUrl=str_replace('\\','\\\\',$paramUrl);
            $paramUrl=str_replace('\'','\\\'',$paramUrl);
            $paramUrl=str_replace('"','\\"',$paramUrl);
            $paramUrl=rawurlencode($paramUrl);
            $o1.='   <a href="javascript:__gi1.lancer_un_travail_en_arriere_plan(\''.enti1($paramUrl).'\')" title="lancer un remplacement en arrière plan">remplacer "'.enti1($chaine_a_remplacer).'" en arriere_plan</a>'.CRLF;

        }

    }

}

/* $o1.= __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data0 , true ) . '</pre>' ;*/
/*
  
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
/*
  
  //$o1.='<script type="module" src="js/module_rectangle_et_carre.js"></script>';
  $o1.='<script type="module">
  import { Rectangle , Carre } from "./js/module_rectangle_et_carre.js";
  window.Rectangle = Rectangle;
  window.Carre = Carre;
  import { Cercle } from "./js/module_cercle.js";
  window.Cercle = Cercle;
  </script>
  ';
*/
print($o1);
$o1='';
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);
$o1='';
?>