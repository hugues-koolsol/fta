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
    return(array( __xst => true, 'value' => $o1));

}

/*
  =====================================================================================================================
*/
if(isset($_POST['__ordonner_les_taches'])){
    sql_inclure_reference(64);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_64.php');
    /*        
      SELECT 
      `T0`.`chi_id_tache` , `T0`.`chx_utilisateur_tache` , `T0`.`chp_texte_tache` , `T0`.`chp_priorite_tache`
       FROM b1.tbl_taches T0
      WHERE (`T0`.`chx_utilisateur_tache` = :T0_chx_utilisateur_tache
         AND `T0`.`chp_priorite_tache` < :T0_chp_priorite_tache) 
      ORDER BY `T0`.`chi_id_tache` ASC;
   */          
    /*sql_inclure_fin*/
    
    $tt=sql_64(array( 
      'T0_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
      'T0_chp_priorite_tache' => 50
    ));
    if($tt[__xst] === false){
        ajouterMessage('erreur' , __LINE__ .' : ' . $tt[__xme] );
        recharger_la_page(BNF);
    }
    $nouvelle_priorite=1;
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tt[__xva] , true ) . '</pre>' ; exit(0);
    foreach($tt[__xva] as $k1 => $v1){
        if($nouvelle_priorite<50){
         
            sql_inclure_reference(65);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_65.php');
            /*        
              UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache
              WHERE (`chi_id_tache` = :c_chi_id_tache
                 AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache) ;
            */          
            /*sql_inclure_fin*/
//            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $v1 , true ) . '</pre>' ; exit(0);
            
            $tt2=sql_65(array( 
              'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
              'c_chi_id_tache'          => $v1['T0.chi_id_tache'],
              'n_chp_priorite_tache'    => $nouvelle_priorite
            ));
            if($tt2[__xst] === false){
                ajouterMessage('erreur' , __LINE__ .' : ' . $tt2[__xme] );
                recharger_la_page(BNF);
            }
        }
        $nouvelle_priorite++; 
    }
}

/*
  =====================================================================================================================
*/
if(isset($_POST['__soustraire_1_aux_priorites'])){
 
  
  sql_inclure_reference(23);
  /*sql_inclure_deb*/
  require_once(INCLUDE_PATH.'/sql/sql_23.php');
/*        
UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache WHERE ((chp_priorite_tache IS NULL OR chp_priorite_tache = '') AND chx_utilisateur_tache = :c_chx_utilisateur_tache) ;
*/          
  /*sql_inclure_fin*/
  
  $tt=sql_23(array( 
    'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
    'n_chp_priorite_tache' => 50
  ));

  if($tt[__xst] === false){
    ajouterMessage('erreur' , __LINE__ .' : ' . $tt[__xme] );
    recharger_la_page(BNF);
  }

  sql_inclure_reference(25);
  /*sql_inclure_deb*/
  require_once(INCLUDE_PATH.'/sql/sql_25.php');
  /*
  UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`-1) WHERE (`chx_utilisateur_tache` = :c_chx_utilisateur_tache AND `chp_priorite_tache` < 50) ;
  */
  /*sql_inclure_fin*/
  
  $tt=sql_25(array( 
    'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
  ));

  if($tt[__xst] === false){
      ajouterMessage('erreur' , __LINE__ .' : ' . $tt[__xme] );
      recharger_la_page(BNF);
  }else{
      ajouterMessage('info' , __LINE__ .' : les priorités ont été diminuées' );
  }

  recharger_la_page(BNF);
}

/*
  =====================================================================================================================
*/
if(isset($_POST['__ajouter_1_aux_priorites'])){
 
  
  sql_inclure_reference(23);
  /*sql_inclure_deb*/
  require_once(INCLUDE_PATH.'/sql/sql_23.php');
/*        
UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache WHERE ((chp_priorite_tache IS NULL OR chp_priorite_tache = '') AND chx_utilisateur_tache = :c_chx_utilisateur_tache) ;
*/          
  /*sql_inclure_fin*/
  
  $tt=sql_23(array( 
    'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
    'n_chp_priorite_tache' => 50
  ));

  if($tt[__xst] === false){
    ajouterMessage('erreur' , __LINE__ .' : ' . $tt[__xme] );
    recharger_la_page(BNF);
  }
  
  sql_inclure_reference(24);
  /*sql_inclure_deb*/
  require_once(INCLUDE_PATH.'/sql/sql_24.php');
  /*
  UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`+1) WHERE (`chx_utilisateur_tache` = :c_chx_utilisateur_tache AND `chp_priorite_tache` < 50) ;
  */
  /*sql_inclure_fin*/
  
  $tt=sql_24(array( 
    'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
  ));

  if($tt[__xst] === false){
      ajouterMessage('erreur' , __LINE__ .' : ' . $tt[__xme] );
      recharger_la_page(BNF);
  }else{
      ajouterMessage('info' , __LINE__ .' : les priorités ont été augmentées' );
  }
  
  recharger_la_page(BNF);
}

/*
  =====================================================================================================================
*/
if(isset($_GET['__action']) && '__mettre_a_99' === $_GET['__action']){

 if(isset($_GET['__id']) && is_numeric($_GET['__id'])){


        sql_inclure_reference(22);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_22.php');
        /*sql_inclure_fin*/
        
        $tt=sql_22(array( 
          'c_chi_id_tache' => $_GET['__id'], 
          'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
          'n_chp_priorite_tache' => 99
        ));

        if($tt[__xst] === false){

            ajouterMessage('erreur',__LINE__.' : '.$tt[__xme]);

        }else{

            ajouterMessage('info',__LINE__.' : tâche modifiée');
        }

 }

 recharger_la_page(BNF);
 
}

/*
  =====================================================================================================================
*/
if(isset($_GET['__action']) && '__mettre_a_0' === $_GET['__action']){

 if(isset($_GET['__id']) && is_numeric($_GET['__id'])){

        sql_inclure_reference(22);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_22.php');
        /*sql_inclure_fin*/
        
        $tt=sql_22(array( 
          'c_chi_id_tache' => $_GET['__id'], 
          'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
          'n_chp_priorite_tache' => 0
        ));

        if($tt[__xst] === false){

            ajouterMessage('erreur',__LINE__.' : '.$tt[__xme]);

        }else{

            ajouterMessage('info',__LINE__.' : tâche modifiée');
        }


 }

 recharger_la_page(BNF);
 
}

/*
  =====================================================================================================================
*/

if((isset($_GET['__action'])) && ('__mettre_a_plus_1' === $_GET['__action'])){


    if((isset($_GET['__id'])) && (is_numeric($_GET['__id']))){

        sql_inclure_reference(21);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_21.php');
        /*
        
        UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`+1)
        WHERE (`chi_id_tache` = :c_chi_id_tache
         AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache
         AND `chp_priorite_tache` < 50) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_21(array( 'c_chi_id_tache' => $_GET['__id'], 'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init']));

        if($tt[__xst] === false){

            ajouterMessage('erreur',__LINE__.' : '.$tt[__xme]);

        }else{

            ajouterMessage('info',__LINE__.' : tâche modifiée');
        }


    }

    recharger_la_page(BNF);

}

/*
  =====================================================================================================================
*/

if((isset($_GET['__action'])) && ('__mettre_a_moins_1' === $_GET['__action'])){


    if((isset($_GET['__id'])) && (is_numeric($_GET['__id']))){

        sql_inclure_reference(20);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_20.php');
        /*
        
        UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`-1)
        WHERE (/ *  * / `chi_id_tache` = :c_chi_id_tache
         AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache
         AND `chp_priorite_tache` >= 1) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_20(array( 'c_chi_id_tache' => $_GET['__id'], 'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init']));

        if($tt[__xst] === false){

            ajouterMessage('erreur',__LINE__.' : '.$tt[__xme]);

        }else{

            ajouterMessage('info',__LINE__.' : tâche modifiée');
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

$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);
if(isset($_GET['button_chercher'])){
 $__xpage=0;
}else{
 $__xpage=(int)$_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage'];
}
$__nbEnregs=0;

$chi_id_tache=recuperer_et_sauvegarder_les_parametres_de_recherche('chi_id_tache',BNF);
$chp_texte_tache=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_texte_tache',BNF);
$chp_priorite_tache=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_priorite_tache',BNF);
$chp_priorite_tache2=recuperer_et_sauvegarder_les_parametres_de_recherche('chp_priorite_tache2',BNF);

$autofocus='chp_priorite_tache';

if(($chp_texte_tache != '')){

    $autofocus='chp_texte_tache';

}else if(($chp_priorite_tache != '')){

    $autofocus='chp_priorite_tache';

}else if(($chp_priorite_tache2 != '')){

    $autofocus='chp_priorite_tache2';

}else if(($chi_id_tache != '')){

    $autofocus='chi_id_tache';


}

$o1.='<form method="get" class="yyfilterForm">'.CRLF;
$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_texte_tache">texte</label>'.CRLF;
$o1.='    <input  type="text" name="chp_texte_tache" id="chp_texte_tache"   value="'.enti1($chp_texte_tache).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_texte_tache')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_priorite_tache">priorité =</label>'.CRLF;
$o1.='    <input  type="text" name="chp_priorite_tache" id="chp_priorite_tache"   value="'.enti1($chp_priorite_tache).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_priorite_tache')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chp_priorite_tache">priorité <</label>'.CRLF;
$o1.='    <input  type="text" name="chp_priorite_tache2" id="chp_priorite_tache2"   value="'.enti1($chp_priorite_tache2).'"  size="8" maxlength="64"  '.(($autofocus == 'chp_priorite_tache2')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.CRLF;
$o1.='    <label for="chi_id_tache">id</label>'.CRLF;
$o1.='    <input  type="text" name="chi_id_tache" id="chi_id_tache"   value="'.enti1($chi_id_tache).'"  size="8" maxlength="32"  '.(($autofocus == 'chi_id_tache')?'autofocus="autofocus"':'').' />'.CRLF;
$o1.='   </div>'.CRLF;

$o1.='   <div>'.html_du_bouton_rechercher_pour_les_listes().CRLF.'   </div>'.CRLF;

$o1.='</form>'.CRLF;

$__debut=$__xpage*($__nbMax);

sql_inclure_reference(19);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_19.php');
/*sql_inclure_fin*/

$tt=sql_19(array(
    'T0_chi_id_tache' => $chi_id_tache,
    'T0_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'],
    'T0_chp_texte_tache' => (($chp_texte_tache === NULL)?$chp_texte_tache:(($chp_texte_tache === '')?'':'%'.$chp_texte_tache.'%')),
    'T0_chp_priorite_tache' => $chp_priorite_tache ,
    'T0_chp_priorite_tache2' => $chp_priorite_tache2 ,
    'quantitee' => $__nbMax,
    'debut' => $__debut,
    'page_courante' => BNF));

if($tt[__xst] === false){

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
$consUrlRedir=''.'&amp;chi_id_tache='.rawurlencode($chi_id_tache).'&amp;chp_texte_tache='.rawurlencode($chp_texte_tache).'&amp;chp_priorite_tache='.rawurlencode($chp_priorite_tache).'';

$consUrlRedir='';
$consUrlRedir.=(($chi_id_tache !== '')?'&amp;chi_id_tache='.rawurlencode($chi_id_tache):'');
$consUrlRedir.=(($chp_texte_tache !== '')?'&amp;chp_texte_tache='.rawurlencode($chp_texte_tache):'');
$consUrlRedir.=(($chp_priorite_tache !== '')?'&amp;chp_priorite_tache='.rawurlencode($chp_priorite_tache):'');
$consUrlRedir.=(($chp_priorite_tache2 !== '')?'&amp;chp_priorite_tache2='.rawurlencode($chp_priorite_tache2):'');

$boutons_haut=' <a class="yyinfo" href="zz_taches_a1.php?__action=__creation">Créer une nouvelle tâche</a>'.CRLF;
$boutons_haut.=' <button type="submit" name="__ajouter_1_aux_priorites" id="__ajouter_1_aux_priorites" class="yyinfo">+1*</button>'.CRLF;
$boutons_haut.=' <button type="submit" name="__soustraire_1_aux_priorites" id="__soustraire_1_aux_priorites" class="yyinfo">-1*</button>'.CRLF;
$boutons_haut.=' <button type="submit" name="__ordonner_les_taches" id="__ordonner_les_taches" class="yyinfo" title="réordonner les tâches" >#</button>'.CRLF;

$o1.=construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$__xpage,$boutons_haut);


$o1.='</form></div>';
$lsttbl='';
$lsttbl.='<thead><tr>';
$lsttbl.='<th>action</th>';
$lsttbl.='<th>id</th>';
$lsttbl.='<th>tâche</th>';
$lsttbl.='<th>priorite</th>';
$lsttbl.='</tr></thead><tbody>';
foreach($tt[__xva] as $k0 => $v0){
    $lsttbl.='<tr>';
    $lsttbl.='<td data-label="" style="text-align:left!important;">';
    $lsttbl.='<div class="yyflex1">';
    $lsttbl.=' <a class="yyinfo" href="zz_taches_a1.php?__action=__modification&amp;__id='.$v0['T0.chi_id_tache'].'" title="modifier">✎</a>';
    
    $lsttbl.=' <a class="yydanger" href="zz_taches_a1.php?__action=__suppression&amp;__id='.$v0['T0.chi_id_tache'].'" title="supprimer">x</a>';
    $lsttbl.=' <a class="yyinfo"   href="zz_taches_l1.php?__action=__mettre_a_99&amp;__id='.$v0['T0.chi_id_tache'].'" title="mettre cette priorité à 99">99</a>';
    $lsttbl.=' <a class="yyinfo"   href="zz_taches_l1.php?__action=__mettre_a_0&amp;__id='.$v0['T0.chi_id_tache'].'" title="mettre cette priorité 0">00</a>';
    $lsttbl.=' <a class="yyinfo"   href="zz_taches_l1.php?__action=__mettre_a_plus_1&amp;__id='.$v0['T0.chi_id_tache'].'" title="ajouter 1 à cette priorité">+1</a>';
    $lsttbl.=' <a class="yyinfo"   href="zz_taches_l1.php?__action=__mettre_a_moins_1&amp;__id='.$v0['T0.chi_id_tache'].'" title="soustraire 1 à cette priorité">-1</a>';

    $lsttbl.='</div>';
    $lsttbl.='</td>';
    $lsttbl.='<td style="text-align:center;">';
    $lsttbl.=''.$v0['T0.chi_id_tache'].'';
    $lsttbl.='</td>';
    
    $lsttbl.='<td style="text-align:left;">';
    if($v0['T0.chp_texte_tache']!==null){
        $lsttbl.=''.enti1(mb_substr($v0['T0.chp_texte_tache'],0,100)).'';
    }
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
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( '' ), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);
$o1='';
?>