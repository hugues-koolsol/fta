<?php
define("BNF",basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ true);

if(!isset($_SESSION[APP_KEY]['cible_courante'])){

    ajouterMessage(__xsu,__LINE__ . ' : veuillez sélectionner une cible ');
    recharger_la_page('zz_cibles_l1.php');

}

/*
  =====================================================================================================================
*/
function supprimer_repertoire_et_fichiers_inclus($dirPath){

    
    if(substr($dirPath,strlen($dirPath) - 1,1) != '/'){

        $dirPath .= '/';

    }

    $files=glob($dirPath . '*',GLOB_MARK);
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
function integrer_la_requete_dans_la_table_rev($id_requete,$matrice_requete){

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
    
    $tt=sql_5(array( 'chx_cible_rev' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'], 'chp_provenance_rev' => 'sql', 'chx_source_rev' => $id_requete));
    $matrice=json_decode($matrice_requete,false);
    /* echo __FILE__ . ' ' . __LINE__ . ' $id_requete =  ' . $id_requete . '<pre> ' . var_export(  $matrice , true ) . '</pre>' ; exit(0);*/
    for( $i=0 ; $i < count($matrice) ; $i++ ){
        
        $tab=$matrice[$i];
        /*
          14 champs pour le rev + id_cible + chp_provenance_rev + chx_source_rev
        */
        $a_sauvegarder[]=array(
            'chx_cible_rev' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
            'chp_provenance_rev' => 'sql',
            'chx_source_rev' => $id_requete,
            'chp_id_rev' => $tab[0],
            'chp_valeur_rev' => $tab[1],
            'chp_type_rev' => $tab[2],
            'chp_niveau_rev' => $tab[3],
            'chp_quotee_rev' => $tab[4],
            'chp_pos_premier_rev' => $tab[5],
            'chp_pos_dernier_rev' => $tab[6],
            'chp_parent_rev' => $tab[7],
            'chp_nbr_enfants_rev' => $tab[8],
            'chp_num_enfant_rev' => $tab[9],
            'chp_profondeur_rev' => $tab[10],
            'chp_pos_ouver_parenthese_rev' => $tab[11],
            'chp_pos_fermer_parenthese_rev' => $tab[12],
            'chp_commentaire_rev' => $tab[13]
        );
    }
    sql_inclure_reference(12);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_12.php');
    /*
    INSERT INTO b1.`tbl_revs`(
        `chx_cible_rev` , 
        `chp_provenance_rev` , 
        `chx_source_rev` , 
        `chp_id_rev` , 
        `chp_valeur_rev` , 
        `chp_type_rev` , 
        `chp_niveau_rev` , 
        `chp_quotee_rev` , 
        `chp_pos_premier_rev` , 
        `chp_pos_dernier_rev` , 
        `chp_parent_rev` , 
        `chp_nbr_enfants_rev` , 
        `chp_num_enfant_rev` , 
        `chp_profondeur_rev` , 
        `chp_pos_ouver_parenthese_rev` , 
        `chp_pos_fermer_parenthese_rev` , 
        `chp_commentaire_rev`
    ) VALUES (
        :chx_cible_rev , 
        :chp_provenance_rev , 
        :chx_source_rev , 
        :chp_id_rev , 
        :chp_valeur_rev , 
        :chp_type_rev , 
        :chp_niveau_rev , 
        :chp_quotee_rev , 
        :chp_pos_premier_rev , 
        :chp_pos_dernier_rev , 
        :chp_parent_rev , 
        :chp_nbr_enfants_rev , 
        :chp_num_enfant_rev , 
        :chp_profondeur_rev , 
        :chp_pos_ouver_parenthese_rev , 
        :chp_pos_fermer_parenthese_rev , 
        :chp_commentaire_rev
    );

    */
    /*sql_inclure_fin*/
    
    /* sql_inclure_deb*/
    require_once(INCLUDE_PATH . '/sql/sql_12.php');
    /* sql_inclure_fin*/
    $tt=sql_12($a_sauvegarder);
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tt , true ) . '</pre>' ; exit(0);*/

}
function gererer_le_fichier_des_requetes($chi_id_cible){

    sql_inclure_reference(6);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_6.php');
    /*
    SELECT 
    `T0`.`chi_id_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , `T0`.`cht_matrice_requete`
     FROM b1.tbl_requetes T0
    WHERE (`T0`.`chx_cible_requete` = :T0_chx_cible_requete) 
   
     ORDER BY `T0`.`chi_id_requete`  ASC;

    */
    /*sql_inclure_fin*/
    
    $retour_sql=sql_6(array( 'T0_chx_cible_requete' => $chi_id_cible));
    /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $retour_sql , true ) . '</pre>' ; exit(0);*/
    
    if($retour_sql[__xst] === __xsu){

        $chaine_js='';
        $chaine_php='';
        $repertoire_destination=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'sql';
        
        if(is_dir($repertoire_destination)){

            supprimer_repertoire_et_fichiers_inclus($repertoire_destination);

        }

        
        if(!mkdir($repertoire_destination,511)){

            return array( __xst => __xer, __xme => __LINE__ . ' erreur création du répertoire inc/sql');

        }

        foreach($retour_sql[__xva] as $k1 => $v1){
            $nom_fichier=$repertoire_destination . DIRECTORY_SEPARATOR . 'sql_' . $v1['T0.chi_id_requete'] . '.php';
            
            if($fd=fopen($nom_fichier,'w')){

                
                if(fwrite($fd,'<?' . 'php' . PHP_EOL . $v1['T0.cht_php_requete'])){

                    fclose($fd);
                    $chaine_js .= PHP_EOL . '"' . $v1['T0.chi_id_requete'] . '":' . json_encode($v1['T0.cht_sql_requete']) . ',';
                    $chaine_php .= PHP_EOL . '"' . $v1['T0.chi_id_requete'] . '"=>' . json_encode($v1['T0.cht_sql_requete']) . ',';

                }else{

                    return array( __xst => __xer, __xme => __LINE__ . ' erreur ecriture fichier sql_' . $v1['T0.chi_id_requete'] . '.php');
                }


            }else{

                return array( __xst => __xer, __xme => __LINE__ . ' erreur ouverture fichier sql_' . $v1['T0.chi_id_requete'] . '.php');
            }

        }
        $nom_bref='aa_js_sql_cible_' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . '.js';
        $nom_fichier=$repertoire_destination . DIRECTORY_SEPARATOR . $nom_bref;
        
        if($fd=fopen($nom_fichier,'w')){

            
            if(fwrite($fd,'//<![CDATA[' . PHP_EOL . '__aa_js_sql={' . PHP_EOL . $chaine_js . PHP_EOL . '};' . PHP_EOL . '//]]>')){

                fclose($fd);

            }else{

                return array( __xst => __xer, __xme => __LINE__ . ' erreur ecriture fichier ' . $nom_bref);
            }


        }else{

            return array( __xst => __xer, __xme => __LINE__ . ' erreur ouverture fichier ' . $nom_bref);
        }

        $nom_bref='aa_php_sql_cible_' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . '.php';
        $nom_fichier=$repertoire_destination . DIRECTORY_SEPARATOR . $nom_bref;
        
        if($fd=fopen($nom_fichier,'w')){

            
            if(fwrite($fd,'<?' . 'php' . PHP_EOL . '$__aa_php_sql=array(' . PHP_EOL . $chaine_php . PHP_EOL . ');' . PHP_EOL . '?>')){

                fclose($fd);

            }else{

                return array( __xst => __xer, __xme => __LINE__ . ' erreur ecriture fichier ' . $nom_bref);
            }


        }else{

            return array( __xst => __xer, __xme => __LINE__ . ' erreur ouverture fichier ' . $nom_bref);
        }

        $zip=new ZipArchive();
        
        if($zip->open($repertoire_destination . DIRECTORY_SEPARATOR . 'sql_cible_' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . '.zip',ZIPARCHIVE::CREATE) !== true
        ){

            return array( __xst => __xer, __xme => __LINE__ . ' erreur ouverture fichier zip');

        }

        foreach($retour_sql[__xva] as $k1 => $v1){
            $chemin_fichier=realpath($repertoire_destination . DIRECTORY_SEPARATOR . 'sql_' . $v1['T0.chi_id_requete'] . '.php');
            $nom_fichier='sql_' . $v1['T0.chi_id_requete'] . '.php';
            
            if(!$zip->addFile($chemin_fichier,$nom_fichier)){

                $zip->close();
                return array( __xst => __xer, __xme => __LINE__ . ' ajout du fichier "' . $nom_fichier . '" au zip impossible ');

            }

        }
        $zip->close();
        /*          echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $retour_sql[__xva] , true ) . '</pre>' ; exit(0);*/

    }else{

        return array( __xst => __xer, __xme => __LINE__ . ' erreur sql ' . $retour_sql[__xme]);
    }

    
    if($retour_sql[__xst] === __xsu){

        foreach($retour_sql[__xva] as $k1 => $v1){
            
            if($v1['T0.cht_matrice_requete'] !== null){

                integrer_la_requete_dans_la_table_rev($v1['T0.chi_id_requete'],$v1['T0.cht_matrice_requete']);

            }

        }

    }

    return array( __xst => __xsu);

}
/*
  =====================================================================================================================
*/

if(isset($_POST) && count($_POST) > 0){

    
    if(isset($_POST['__action']) && $_POST['__action'] === '__gererer_les_fichiers_des_requetes'){

        $time_start=microtime(true);
        $gen=gererer_le_fichier_des_requetes($_SESSION[APP_KEY]['cible_courante']['chi_id_cible']);
        
        if($gen[__xst] === __xsu){

            $time_end=microtime(true);
            $time=((int)((($time_end - $time_start) * 1000) * 1000)) / 1000;
            ajouterMessage(__xsu,__LINE__ . ' les fichiers sql ont bien été générés (' . $time . ' ms)',BNF);
            recharger_la_page(BNF);

        }else{

            ajouterMessage(__xer,__LINE__ . ' ' . $gen[__xme],BNF);
            recharger_la_page(BNF);
        }


    }

    
    if(isset($_POST['supprimer_une_requete']) && is_numeric($_POST['supprimer_une_requete'])){

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
        
        if($tt[__xst] !== __xsu){

            ajouterMessage(__xer,__LINE__ . ' ' . $tt[__xme],BNF);
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
        
        if($tt[__xst] !== __xsu){

            ajouterMessage(__xer,__LINE__ . ' ' . $tt[__xme],BNF);
            recharger_la_page(BNF);

        }else{

            ajouterMessage(__xsu,__LINE__ . ' requête supprimée ' . $_POST['supprimer_une_requete'],BNF);
            recharger_la_page(BNF);
        }

        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/

    }

    
    if(isset($_POST['renuméroter_une_requete'])
       && is_numeric($_POST['renuméroter_une_requete'])
       && isset($_POST['__nouveau_numéro'])
       && is_numeric($_POST['__nouveau_numéro'])
    ){

        /*        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/
        sql_inclure_reference(3);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_3.php');
        /*
        UPDATE b1.tbl_requetes SET `chi_id_requete` = :n_chi_id_requete
        WHERE (`chi_id_requete` = :c_chi_id_requete
          
         AND `chx_cible_requete` = :c_chx_cible_requete) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_3(array( 'c_chi_id_requete' => $_POST['renuméroter_une_requete'], 'c_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'], 'n_chi_id_requete' => $_POST['__nouveau_numéro']));
        
        if($tt[__xst] === __xsu){

            ajouterMessage(__xsu,__LINE__ . ' requête renumérotée dans requetes de ' . $_POST['renuméroter_une_requete'] . ' à ' . $_POST['__nouveau_numéro'] . '',BNF);

        }else{

            ajouterMessage(__xer,__LINE__ . ' ' . $tt[__xme],BNF);
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
        
        $tt=sql_8(array( 'n_chx_source_rev' => $_POST['__nouveau_numéro'], 'c_chx_cible_rev' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'], 'c_chp_provenance_rev' => 'sql', 'c_chx_source_rev' => $_POST['renuméroter_une_requete']));
        
        if($tt[__xst] !== __xsu){

            ajouterMessage(__xer,__LINE__ . ' ' . $tt[__xme],BNF);
            recharger_la_page(BNF);

        }else{

            ajouterMessage(__xsu,__LINE__ . ' requête renumérotée dans rev  de ' . $_POST['renuméroter_une_requete'] . ' à ' . $_POST['__nouveau_numéro'] . '',BNF);
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
    $o1 .= '<h1>Liste des Requetes </h1>';
    return array( __xst => __xsu, 'value' => $o1);

}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
$o1=obtenir_entete_de_la_page();
print($o1['value']);

if(isset($_GET['__action']) && $_GET['__action'] == '__suppression' && isset($_GET['__id']) && is_numeric($_GET['__id'])){

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/
    $o1='<form method="post" style="text-align:center;">';
    $o1 .= '<button class="yydanger" name="supprimer_une_requete" value="' . $_GET['__id'] . '">Je confirme la suppression de la requête ' . $_GET['__id'] . '</button>';
    /*  $o1.='<input type="hidden" name="__id" value="'.$_GET['__id'].'" />';*/
    $o1 .= '</form>';
    print($o1);
    $o1='';

}


if(isset($_GET['__action']) && $_GET['__action'] == '__renuméroter' && isset($_GET['__id']) && is_numeric($_GET['__id'])){

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/
    $o1='<form method="post" style="text-align:center;">';
    $o1 .= '<input type="text" name="__nouveau_numéro" value="0" autofocus="autofocus" />';
    $o1 .= '<button class="yydanger" name="renuméroter_une_requete" value="' . $_GET['__id'] . '">Je confirme la renumération de la requête ' . $_GET['__id'] . '</button>';
    $o1 .= '</form>';
    print($o1);
    $o1='';

}

$o1='';
$__nbMax=$_SESSION[APP_KEY]['__parametres_utilisateurs'][BNF]['nombre_de_lignes']??20;
$__debut=0;
$__xpage=recuperer_et_sauvegarder_les_parametres_de_recherche('__xpage',BNF);

if(isset($_GET['button_chercher'])){

    $__xpage=0;

}else{

    $__xpage=(int)($_SESSION[APP_KEY]['__filtres'][BNF]['champs']['__xpage']);
}

$__nbEnregs=0;
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

$o1 .= '<form method="get" class="yyfilterForm">' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chi_id_requete">id</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chi_id_requete" id="chi_id_requete"   value="' . enti1($chi_id_requete) . '"  size="8" maxlength="32"  ' . ($autofocus == 'chi_id_requete' ? ' autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="cht_rev_requete">rev</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="cht_rev_requete" id="cht_rev_requete"   value="' . enti1($cht_rev_requete) . '"  size="8" maxlength="64"  ' . ($autofocus == 'cht_rev_requete' ? ' autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . PHP_EOL;
$o1 .= '    <label for="chp_type_requete">type</label>' . PHP_EOL;
$o1 .= '    <input  type="text" name="chp_type_requete" id="chp_type_requete"   value="' . enti1($chp_type_requete) . '"  size="8" maxlength="64"  ' . ($autofocus == 'chp_type_requete' ? ' autofocus="autofocus"' : '') . ' />' . PHP_EOL;
$o1 .= '   </div>' . PHP_EOL;
$o1 .= '   <div>' . html_du_bouton_rechercher_pour_les_listes() . PHP_EOL . '   </div>' . PHP_EOL;
$o1 .= '</form>' . PHP_EOL;
$__debut=$__xpage * $__nbMax;
sql_inclure_reference(2);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_2.php');
/*
SELECT 
`T0`.`chi_id_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , 
`T0`.`cht_commentaire_requete`
 FROM b1.tbl_requetes T0
WHERE (`T0`.`chx_cible_requete` = :T0_chx_cible_requete
  
 AND `T0`.`chi_id_requete` = :T0_chi_id_requete
  
 AND `T0`.`chp_type_requete` LIKE :T0_chp_type_requete
  
 AND `T0`.`cht_rev_requete` LIKE :T0_cht_rev_requete) 
ORDER BY `T0`.`chi_id_requete` DESC  
LIMIT :quantitee OFFSET :debut ;

*/
/*sql_inclure_fin*/

$tt=sql_2(array(
    'T0_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    'T0_chi_id_requete' => $chi_id_requete,
    'T0_cht_rev_requete' => $cht_rev_requete === null ? $cht_rev_requete : ($cht_rev_requete === '' ? '' : '%' . $cht_rev_requete . '%'),
    'T0_chp_type_requete' => $chp_type_requete === null ? $chp_type_requete : ($chp_type_requete === '' ? '' : '%' . $chp_type_requete . '%'),
    'quantitee' => $__nbMax,
    'debut' => $__debut,
    'page_courante' => BNF
));

if($tt[__xst] === __xer){

    $o1 .= '<div>';
    $o1 .= '<div class="yydanger">Erreur sql</div>';
    $o1 .= '<pre>' . $tt['sql0'] . '</per>';
    $o1 .= '</div>';
    $js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
    $par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
    $o1 .= html_footer1($par);
    print($o1);
    $o1='';
    exit(0);

}

$__nbEnregs=$tt['nombre'];
$consUrlRedir='';
$consUrlRedir .= $chi_id_requete !== '' ? '&amp;chi_id_requete=' . rawurlencode($chi_id_requete) : '';
$consUrlRedir .= $cht_rev_requete !== '' ? '&amp;cht_rev_requete=' . rawurlencode($cht_rev_requete) : '';
$consUrlRedir .= $chp_type_requete !== '' ? '&amp;chp_type_requete=' . rawurlencode($chp_type_requete) : '';
$boutons_avant='<a class="yyinfo" href="zz_requetes_a1.php?__action=__creation">Créer une nouvelle requete</a>';
$boutons_avant .= ' <button class="yyalarme" name="__action" value="__gererer_les_fichiers_des_requetes">gererer les fichiers des requetes</button>' . PHP_EOL;
$o1 .= construire_navigation_pour_liste($__debut,$__nbMax,$__nbEnregs,$consUrlRedir,$__xpage,$boutons_avant);
$lsttbl='';
$lsttbl .= '<thead><tr>';
$lsttbl .= '<th>action</th>';
$lsttbl .= '<th>id</th>';
$lsttbl .= '<th>type</th>';
$lsttbl .= '<th>commentaire</th>';
$lsttbl .= '<th>rev</th>';
$lsttbl .= '<th>sql</th>';
$lsttbl .= '</tr></thead><tbody>';
foreach($tt[__xva] as $k0 => $v0){
    $lsttbl .= '<tr>';
    $lsttbl .= '<td data-label="" style="text-align:left!important;">';
    $lsttbl .= '<div class="yyflex1">';
    $lsttbl .= ' <a class="yyinfo" href="zz_requetes_a1.php?__action=__modification&amp;__id=' . $v0['T0.chi_id_requete'] . '" title="modifier">✎</a>';
    $lsttbl .= ' <a class="yydanger" href="zz_requetes_l1.php?__action=__suppression&amp;__id=' . $v0['T0.chi_id_requete'] . '" title="supprimer">x</a>';
    $lsttbl .= ' <a class="yysucces" href="zz_requetes_l1.php?__action=__renuméroter&amp;__id=' . $v0['T0.chi_id_requete'] . '" title="renuméroter">#</a>';
    $lsttbl .= '</div>';
    $lsttbl .= '</td>';
    $lsttbl .= '<td style="text-align:center;">' . $v0['T0.chi_id_requete'] . '</td>';
    $lsttbl .= '<td style="text-align:left;">' . $v0['T0.chp_type_requete'] . '</td>';
    $lsttbl .= '<td style="text-align:center;">' . $v0['T0.cht_commentaire_requete'] . '</td>';
    $lsttbl .= '<td style="text-align:left;">';
    
    if($v0['T0.cht_rev_requete'] !== null){

        $lsttbl .= enti1(mb_substr($v0['T0.cht_rev_requete'],0,500));

    }

    $lsttbl .= '</td>';
    $lsttbl .= '<td style="text-align:left;">';
    
    if($v0['T0.cht_sql_requete'] !== null){

        $lsttbl .= enti1(mb_substr($v0['T0.cht_sql_requete'],0,500));

    }

    $lsttbl .= '</td>';
    $lsttbl .= '</tr>';
}
$o1 .= '<div style="overflow-x:scroll;"><table class="yytableResult1">' . PHP_EOL . $lsttbl . '</tbody></table></div>' . PHP_EOL;
/* $o1.= __FILE__ . ' ' . __LINE__ . ' $tab0 = <pre>' . var_export( $data0 , true ) . '</pre>' ;*/
/*
  =====================================================================================================================
*/
$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1 .= html_footer1($par);
print($o1);
$o1='';
exit(0);