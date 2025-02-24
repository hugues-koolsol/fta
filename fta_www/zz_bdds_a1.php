<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ true);
require_once('../fta_inc/phplib/sqlite.php');
$__page_liste_de_reference='zz_bdds_l1.php';

if(!isset($_SESSION[APP_KEY]['cible_courante'])){

    ajouterMessage(__xsu,__LINE__ . ' : veuillez sélectionner une cible ');
    recharger_la_page('zz_cibles_l1.php');

}

$js_a_executer_apres_chargement=array();
/*
  =====================================================================================================================
  =====================================================================================================================
*/
function erreur_dans_champs_saisis_basesdd(){

    $uneErreur=false;
    
    if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] === ''){

        /*
          // A=65 , a=97 z=122 , 0=48 , 9=57 _ - .
          // todo ajouter le test
        */
        $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|';
        ajouterMessage(__xer,__LINE__ . ' : le nom de la base de donnée doit etre indiqué et ne doit pas contenir les caractères espaces ',BNF);
        $uneErreur=true;

    }

    
    if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'],0,1) === ' '){

        ajouterMessage(__xer,__LINE__ . ' : le nom de la base de donnée ne doit pas commencer par un espace ',BNF);
        $uneErreur=true;

    }

    
    if($_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] === 'sqlite'){

        
        if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] === ''
           || $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] === false
        ){

            ajouterMessage(__xer,__LINE__ . ' : le dossier doit être indiqué pour une base sqlite',BNF);
            $uneErreur=true;

        }


    }

    
    if(!($_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] === 'sqlite'
           || $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] === 'mysql'
           || $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] === '')
    ){

        ajouterMessage(__xer,__LINE__ . ' : le fournisseur de la bdd doit être "sqlite" ou "mysql" ou bien ne doit pas être renseigné ',BNF);
        $uneErreur=true;

    }

    
    if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] === ''){

        $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']=null;

    }

    
    if($_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd'] === ''){

        $_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd']=null;

    }

    
    if($_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd'] === ''){

        $_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']=null;

    }

    
    if($_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd'] === ''){

        $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']=null;

    }

    return $uneErreur;

}
/*
  =====================================================================================================================
*/
/*
  =====================================================================================================================
  =====================================================================================================================
  ============================================= POST ==================================================================
  =====================================================================================================================
  =====================================================================================================================
*/

if(isset($_POST) && sizeof($_POST) >= 1){

    /* echo __LINE__ . '$_POST=<pre>' . var_export($_POST,true) . '</pre>'; exit();*/
    $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']=$_POST['chp_nom_basedd']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']=$_POST['chp_commentaire_basedd']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']=$_POST['chp_fournisseur_basedd']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd']=$_POST['chp_rev_travail_basedd']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']=$_POST['chp_rev_basedd']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']=$_POST['chp_genere_basedd']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']=isset($_POST['chi_id_basedd']) ? decrypter($_POST['chi_id_basedd']) : '';
    $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']=isset($_POST['chx_dossier_id_basedd']) ? decrypter($_POST['chx_dossier_id_basedd']) : '';
    $_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_basedd']=$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'];
    verifie_id_envoye('chi_id_basedd',$__page_liste_de_reference,BNF,$_POST);
    
    if(isset($_POST['__ecrire_la_structure_sur_disque'])){

        /*
          =====================================================================================================
          ============================== ECRIRE SUR DISQUE ====================================================
          =====================================================================================================
        */
        sql_inclure_reference(26);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_26.php');
        /*
        SELECT 
        `T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , 
        `T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , 
        `T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , 
        `T2`.`chp_commentaire_cible`
         FROM b1.tbl_bdds T0
         LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd
        
         LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd
        
        WHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd
         AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_26(array( 'T0_chi_id_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'], 'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas écrire la structure sur disque');
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

        }

        $__valeurs=$tt[__xva][0];
        
        if($__valeurs['T2.chp_dossier_cible'] !== null && $__valeurs['T1.chp_nom_dossier'] !== null){

            $nomCompletSource='../../' . $__valeurs['T2.chp_dossier_cible'] . $__valeurs['T1.chp_nom_dossier'] . '/' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . '_structure.' . $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] . '.sql';
            
            if(is_file($nomCompletSource)){

                
                if(!sauvegarder_et_supprimer_fichier($nomCompletSource)){

                    ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer le fichier du disque ',BNF);
                    recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

                }


            }

            
            if($fd=fopen($nomCompletSource,'w')){

                $ret=fwrite($fd,$_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']);
                
                if($ret !== false){

                    fclose($fd);
                    ajouterMessage(__xsu,__LINE__ . ' : Le fichier structure.' . $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] . '.sql a bien été écrit sur le disque');

                }else{

                    ajouterMessage(__xer,__LINE__ . ' : il y a eu un problème lors de l\'écriture ');
                }


            }else{

                ajouterMessage(__xer,__LINE__ . ' : il y a eu un problème lors de l\'ouverture du fichier ');
            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' : problème sur le dossier cible ');
        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

    }else if(isset($_POST['__importer_le_system_de_fta'])){

        
        if(APP_KEY === $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible']
           && APP_KEY !== $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']
           && $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] === 'ftb'
        ){

            $nom_de_la_base_source='../../' . APP_KEY . '/fta_inc/db/sqlite/system.db';
            $nom_de_la_base_cible='../../' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . '/fta_inc/db/sqlite/system.db';
            
            if(copy($nom_de_la_base_source,$nom_de_la_base_cible)){

                ajouterMessage(__xsu,__LINE__ . ' la base a bien été importée ');

            }else{

                ajouterMessage(__xer,__LINE__ . ' la base n\'a pas été importée ');
            }


        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

    }else if(isset($_POST['__convertir_sql_sqlite_en_rev'])){

        /*
          =====================================================================================================
          ============================== CONVERTIR UN SQL EN REV ==============================================
          =====================================================================================================
        */
        $chemin_base_temporaire=RACINE_FICHIERS_PROVISOIRES . DIRECTORY_SEPARATOR . date('Y/m/d');
        $continuer=true;
        
        if(!is_dir($chemin_base_temporaire)){

            
            if(!mkdir($chemin_base_temporaire,0777,true)){

                ajouterMessage(__xer,__LINE__ . ' : impossible de créer le répertoire temporaire ');
                $continuer=false;

            }


        }

        
        if($continuer === true){

            
            if($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'] !== ''){

                $base_temporaire=$chemin_base_temporaire . DIRECTORY_SEPARATOR . sha1(date('Y-m-d-H-i-s') . $_SESSION[APP_KEY]['sess_id_utilisateur']) . '.db';
                $temp_db=new SQLite3($base_temporaire);
                
                if(is_file($base_temporaire)){

                    $res0=$temp_db->exec($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']);
                    
                    if($res0 === true){

                        $temp_db->close();
                        require_once('../fta_inc/phplib/sqlite.php');
                        $ret=obtenir_la_structure_de_la_base_sqlite($base_temporaire,true);
                        
                        if($ret[__xst] === __xsu){

                            $tableauDesTables=$ret['value'];
                            $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$tableauDesTables;
                            $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']='__convertir_sql_sqlite_en_rev';

                        }else{

                            ajouterMessage(__xer,' erreur sur la structure de la base ',BNF);
                        }


                    }

                    /* ne pas créer une copie de sauvegarde d'un fichier temporaire */
                    sauvegarder_et_supprimer_fichier($base_temporaire,true);

                }else{

                    ajouterMessage(__xer,__LINE__ . ' : impossible de créer fichier temporaire ');
                }


            }else{

                ajouterMessage(__xer,__LINE__ . ' : il n\'y a rien à convertir ');
            }


        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

    }else if(isset($_POST['___produire_le_dump_des_donnees'])){

        sql_inclure_reference(26);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_26.php');
        /*
        SELECT 
        `T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , 
        `T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , 
        `T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , 
        `T2`.`chp_commentaire_cible`
         FROM b1.tbl_bdds T0
         LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd
        
         LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd
        
        WHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd
         AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_26(array( 'T0_chi_id_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'], 'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas écrire la structure sur disque');
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

        }

        $__valeurs=$tt[__xva][0];
        $chemin_fichier='../../' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . $__valeurs['T1.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_basedd'];
        
        if(is_file($chemin_fichier)
           && strpos($__valeurs['T0.chp_nom_basedd'],'.db') !== false
           && strpos($__valeurs['T1.chp_nom_dossier'],'sqlite') !== false
        ){

            $ret=obtenir_la_structure_de_la_base_sqlite($chemin_fichier,true);
            
            if($ret[__xst] === __xsu){

                $nom_du_fichier_dump='../../' . $__valeurs['T2.chp_dossier_cible'] . $__valeurs['T1.chp_nom_dossier'] . '/' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . '_donnees.' . $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] . '.sql';
                $retour_ecriture=ecrire_le_dump_de_la_base_sqlite_sur_disque($chemin_fichier,$nom_du_fichier_dump,$ret['value']);
                
                if($retour_ecriture[__xst] === __xsu){

                    ajouterMessage(__xsu,__LINE__ . ' le fichier dump a bien été produit ',BNF);

                }else{

                    ajouterMessage(__xer,__LINE__ . ' problème pour produire le dump ',BNF);
                }


            }else{

                ajouterMessage(__xer,' erreur sur la structure de la base "' . $__valeurs['T0.chp_nom_basedd'] . '"',BNF);
            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' fichier de la base de donnée sqlite introuvable ',BNF);
        }

        $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$tableauDesTables;
        $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']='___produire_le_dump_des_donnees';
        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

    }else if(isset($_POST['__comparer_les_structures'])){

        require_once(INCLUDE_PATH . '/phplib/sqlite.php');
        $obj=comparer_une_base_physique_et_une_base_virtuelle($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'],$_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']);
        
        if($obj[__xst] === __xsu){

            $_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux']=$obj[__xva];
            /* array( 'tableau1' => $ret['value'] , 'tableau2' => $ret2['value'] );*/

        }else{

            ajouterMessage(__xer,__LINE__ . ' erreur sur la comparaison des structures',BNF);
        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

    }else if(isset($_POST['___produire_le_rev_v2'])){

        sql_inclure_reference(26);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_26.php');
        /*
        SELECT 
        `T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , 
        `T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , 
        `T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , 
        `T2`.`chp_commentaire_cible`
         FROM b1.tbl_bdds T0
         LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd
        
         LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd
        
        WHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd
         AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_26(array( 'T0_chi_id_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'], 'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas écrire la structure sur disque');
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

        }

        $__valeurs=$tt[__xva][0];
        $chemin_fichier='../../' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . $__valeurs['T1.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_basedd'];
        
        if(is_file($chemin_fichier)
           && strpos($__valeurs['T0.chp_nom_basedd'],'.db') !== false
           && strpos($__valeurs['T1.chp_nom_dossier'],'sqlite') !== false
        ){

            $ret=obtenir_la_structure_de_la_base_sqlite_v2($chemin_fichier,true);
            
            if($ret[__xst] === __xsu){

                /*
                  on testera plus bas que la variable de session __contexte_tableauDesTables existe pour produire le rev
                */
                $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$ret['value'];
                $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']='___produire_le_rev_v2';

            }else{

                ajouterMessage(__xer,' erreur sur la structure de la base "' . $__valeurs['T0.chp_nom_basedd'] . '"',BNF);
            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' fichier de la base de donnée sqlite introuvable ',BNF);
        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
        /*
          =====================================================================================================
          ============================== MODIFICATION =========================================================
          =====================================================================================================
        */

    }else if(isset($_POST['__action']) && $_POST['__action'] == '__modification'){

        
        if(erreur_dans_champs_saisis_basesdd()){

            
            if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']) && is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'])){

                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

            }else{

                ajouterMessage(__xer,__LINE__ . ' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
                recharger_la_page($__page_liste_de_reference);
            }


        }

        sql_inclure_reference(16);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_16.php');
        /*
        
        UPDATE b1.tbl_bdds SET `chx_dossier_id_basedd` = :n_chx_dossier_id_basedd , `chp_nom_basedd` = :n_chp_nom_basedd , `chp_rev_basedd` = :n_chp_rev_basedd , `chp_commentaire_basedd` = :n_chp_commentaire_basedd , `chp_genere_basedd` = :n_chp_genere_basedd , `chp_rev_travail_basedd` = :n_chp_rev_travail_basedd , `chp_fournisseur_basedd` = :n_chp_fournisseur_basedd
        WHERE (`chi_id_basedd` = :c_chi_id_basedd
         AND `chx_cible_id_basedd` = :c_chx_cible_id_basedd) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_16(array(
            'n_chx_dossier_id_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'],
            'n_chp_nom_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'],
            'n_chp_rev_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd'],
            'n_chp_commentaire_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'],
            'n_chp_genere_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd'],
            'n_chp_rev_travail_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd'],
            'n_chp_fournisseur_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'],
            'c_chi_id_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'],
            'c_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
        ));
        
        if($tt[__xst] === __xer){

            error_reporting(E_ALL);
            
            if($tt['code_erreur'] === 19){

                ajouterMessage(__xer,__LINE__ . ' ce nom existe déjà en bdd ',BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

            }else{

                ajouterMessage(__xer,__LINE__ . ' ' . $tt[__xme],BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
            }


        }else{

            error_reporting(E_ALL);
            
            if($tt['changements'] === 1){

                ajouterMessage(__xsu,' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11) . '.' . substr(microtime(),2,2),BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

            }else{

                ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
            }

        }


    }else if(isset($_POST['__action']) && $_POST['__action'] == '__confirme_suppression'){

        /*
          =====================================================================================================
          =============================== CONFIRMATION DE LA SUPPRESSION ======================================
          =====================================================================================================
        */
        $__id=isset($_POST['__id1']) ? (is_numeric($_POST['__id1']) ? $_POST['__id1'] : 0) : 0;
        sql_inclure_reference(26);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_26.php');
        /*
        SELECT 
        `T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , 
        `T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , 
        `T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , 
        `T2`.`chp_commentaire_cible`
         FROM b1.tbl_bdds T0
         LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd
        
         LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd
        
        WHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd
         AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_26(array( 'T0_chi_id_basedd' => $__id, 'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer cet enregistrement ',BNF);
            recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);

        }

        sql_inclure_reference(18);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_18.php');
        /*
        
        DELETE FROM b1.tbl_bdds
        WHERE (`chi_id_basedd` = :chi_id_basedd
          
         AND `chx_cible_id_basedd` = :chx_cible_id_basedd) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_18(array( 'chi_id_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'], 'chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer){

            ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
            recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);

        }else{

            ajouterMessage(__xsu,'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11));
            recharger_la_page($__page_liste_de_reference);
        }


    }else if(isset($_POST['__action']) && $_POST['__action'] == '__creation'){

        /*
          =====================================================================================================
          =============================== CREATION ============================================================
          =====================================================================================================
        */
        
        if(erreur_dans_champs_saisis_basesdd()){

            recharger_la_page(BNF . '?__action=__creation');

        }

        sql_inclure_reference(17);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_17.php');
        /*
        
        INSERT INTO b1.`tbl_bdds`(
            `chx_dossier_id_basedd` , 
            `chx_cible_id_basedd` , 
            `chp_nom_basedd` , 
            `chp_commentaire_basedd` , 
            `chp_fournisseur_basedd`
        ) VALUES (
            :chx_dossier_id_basedd , 
            :chx_cible_id_basedd , 
            :chp_nom_basedd , 
            :chp_commentaire_basedd , 
            :chp_fournisseur_basedd
        );

        */
        /*sql_inclure_fin*/
        
        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] , true ) . '</pre>' ; exit(0);*/
        $tt=sql_17(array( array(
                    'chx_dossier_id_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'],
                    'chp_nom_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'],
                    'chp_commentaire_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'],
                    'chp_fournisseur_basedd' => $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'],
                    'chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
                )));
        
        if($tt[__xst] === __xer){

            ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
            recharger_la_page(BNF . '?__action=__creation');

        }else{

            ajouterMessage(__xsu,__LINE__ . ' : l\'enregistrement (' . $tt['nouvel_id'] . ') a bien été créé',BNF);
            recharger_la_page(BNF . '?__action=__modification&__id=' . $tt['nouvel_id']);
        }

        recharger_la_page($_SERVER['REQUEST_URI']);

    }else{

        unset($_SESSION[APP_KEY][NAV][BNF]);
        ajouterMessage(__xal,__LINE__ . ' cas à étudier ' . (isset($_POST['__action']) ? ' : "' . $_POST['__action'] . '" ' : ' ') . substr($GLOBALS['__date'],11),BNF);
        recharger_la_page($_SERVER['REQUEST_URI']);
    }

    /*
      on ne devrait pas arriver là car on a normalement capturé tous les cas
    */
    
    if(isset($_SESSION[APP_KEY][NAV][BNF])){

        unset($_SESSION[APP_KEY][NAV][BNF]);

    }

    ajouterMessage(__xsu,__LINE__ . ' cas à étudier ' . substr($GLOBALS['__date'],11));
    recharger_la_page($__page_liste_de_reference);

}

/*
  =====================================================================================================================
  =====================================================================================================================
  ============================================== GET ==================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
$__id='0';

if(isset($_GET['__action']) && ($_GET['__action'] == '__suppression' || $_GET['__action'] == '__modification')){

    $__id=isset($_GET['__id']) ? (is_numeric($_GET['__id']) ? (int)($_GET['__id']) : 0) : 0;
    
    if($__id === 0){

        ajouterMessage(__xer,__LINE__ . ' la base 0 ne peut pas être traitée');
        recharger_la_page($__page_liste_de_reference);

    }else{

        sql_inclure_reference(26);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_26.php');
        /*
        SELECT 
        `T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , 
        `T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , 
        `T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , 
        `T2`.`chp_commentaire_cible`
         FROM b1.tbl_bdds T0
         LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd
        
         LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd
        
        WHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd
         AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_26(array( 'T0_chi_id_basedd' => $__id, 'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer cette base');
            recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);

        }

        $__valeurs=$tt[__xva][0];
    }


}

/*
  =====================================================================================================================
  ============================================= entete de la page =====================================================
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'bases de données', 'description' => 'bases de données'));
print($o1);
$o1='';
$o1 .= '<h1>gestion de base de donnée ( dossier ' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . ') ' . bouton_retour_a_la_liste($__page_liste_de_reference) . '</h1>';

if(isset($_GET['__action']) && $_GET['__action'] == '__suppression'){

    /*
      =============================================================================================================
      ===================================== __suppression =========================================================
      =============================================================================================================
    */
    
    if($__valeurs['T0.chi_id_basedd'] === 1 && APP_KEY === 'fta'){

        ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer cette base');
        recharger_la_page($__page_liste_de_reference);

    }

    $o1 .= ' <form method="post" class="yyformDelete">' . PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_basedd']=sha1($__valeur_encriptee);
    $o1 .= '   <input type="hidden" value="' . $__valeur_encriptee . '" name="chi_id_basedd" id="chi_id_basedd" />' . PHP_EOL;
    $o1 .= '   veuillez confirmer le suppression de  : ' . PHP_EOL;
    $o1 .= '   <br /><br /><b>' . '(' . $__valeurs['T0.chi_id_basedd'] . ') : nom : ' . $__valeurs['T0.chp_nom_basedd'] . ' ,  <br /> ' . '</b><br />' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="' . $_GET['__id'] . '" name="__id1" id="__id1" />' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="__confirme_suppression" name="__action" id="__action" />' . PHP_EOL;
    $o1 .= '   <button type="submit" class="yydanger">Je confirme la suppression</button>' . PHP_EOL;
    $o1 .= '' . PHP_EOL;
    $o1 .= ' </form>' . PHP_EOL;

}else if(isset($_GET['__action']) && $_GET['__action'] == '__creation'){

    /*
      =============================================================================================================
      ===================================== __creation ============================================================
      =============================================================================================================
    */
    $o1 .= '<h2>ajouter une base de donnée</h2>' . PHP_EOL;
    $o1 .= '<form method="post"  enctype="multipart/form-data" class="form1">' . PHP_EOL;
    $chp_nom_basedd=isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <input type="text" autofocus="autofocus" value="' . enti1($chp_nom_basedd) . '" name="chp_nom_basedd" id="chp_nom_basedd" maxlength="64" style="max-width:16em;" />' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $chp_fournisseur_basedd=isset($_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">fournisseur</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <input type="text" autofocus="autofocus" value="' . enti1($chp_fournisseur_basedd) . '" name="chp_fournisseur_basedd" id="chp_fournisseur_basedd" maxlength="64" style="max-width:16em;" />' . PHP_EOL;
    $o1 .= '   laisser videe ou biet mettre soit sqlite, soit mysql' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $chx_dossier_id_basedd=isset($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']) ? $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="' . encrypter($chx_dossier_id_basedd) . '" name="chx_dossier_id_basedd" id="chx_dossier_id_basedd" style="max-width:9em;" />' . PHP_EOL;
    $__parametres_pour_la_modale=array( '__fonction' => 'recupérer_un_element_parent_en_bdd', '__url' => 'zz_dossiers_c1.php', '__nom_champ_dans_parent' => 'chx_dossier_id_basedd', '__champs_texte_a_rapatrier' => array( 'T0.chp_nom_dossier' => array( '__libelle_avant' => 'rattaché à "<b style="color:red;">', '__libelle_apres' => '</b>"', '__libelle_si_vide' => 'base non rattaché à un dossier')));
    $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
    $paramUrl=str_replace('\\','\\\\',$paramUrl);
    $paramUrl=str_replace('\'','\\\'',$paramUrl);
    $paramUrl=str_replace('"','\\"',$paramUrl);
    $paramUrl=rawurlencode($paramUrl);
    $o1 .= '   <a href="javascript:__gi1.afficherModale2(\'' . enti1($paramUrl) . '\')" title="selectionner">📁</a>' . PHP_EOL;
    $o1 .= '   <a class="yyalarme" href="javascript:__gi1.annuler_champ_modale(\'' . enti1($paramUrl) . '\')" title="annuler">🚫</a>' . PHP_EOL;
    
    if($chx_dossier_id_basedd === '' || $chx_dossier_id_basedd === false || $chx_dossier_id_basedd === null){

        $o1 .= '<span id="T0.chp_nom_dossier">base non rattaché à un dossier</span> ' . PHP_EOL;

    }else{

        sql_inclure_reference(50);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_50.php');
        /*
        SELECT 
        `T0`.`chi_id_dossier` , `T0`.`chx_cible_dossier` , `T0`.`chp_nom_dossier` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
        `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible`
         FROM b1.tbl_dossiers T0
         LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_dossier
        
        WHERE (`T0`.`chi_id_dossier` = :T0_chi_id_dossier
         AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_50(array( 'T0_chi_id_basedd' => $chx_dossier_id_basedd, 'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        $nom_dossier='';
        
        if($tt[__xst] === __xsu && count($tt[__xva]) === 1){

            $nom_dossier=$tt[__xva][0]['T0.chp_nom_dossier'];

        }else{

            $nom_dossier='<span class="yyerreur">il y a eu une erreur sur la récupération du dossier</span>';
        }

        $o1 .= '<span id="T0.chp_nom_dossier">rattaché à "<b style="color:red;">' . $__valeurs_dossier['T0.chp_nom_dossier'] . '</b>" </span>' . PHP_EOL;
    }

    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $chp_commentaire_basedd=isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1">' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_commentaire_basedd" id="chp_commentaire_basedd"  rows="15" >' . enti1($chp_commentaire_basedd,ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <button type="submit">enregistrer</button>' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="0" name="__id1" id="__id1" />' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="__creation" name="__action" id="__action" />' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= '</form>' . PHP_EOL;

}else if(isset($_GET['__action']) && $_GET['__action'] == '__modification'){

    /*
      =============================================================================================================
      ================================= __modification ============================================================
      =============================================================================================================
    */
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
    $o1 .= '<h2>modifier une base de donnée</h2>' . PHP_EOL;
    $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']=$__id;
    $__valeurs['T0.chp_nom_basedd']=$_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']??$__valeurs['T0.chp_nom_basedd'];
    $__valeurs['T0.chp_commentaire_basedd']=$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']??$__valeurs['T0.chp_commentaire_basedd'];
    $__valeurs['T0.chp_rev_travail_basedd']=$_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd']??$__valeurs['T0.chp_rev_travail_basedd'];
    $__valeurs['T0.chp_rev_basedd']=$_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']??$__valeurs['T0.chp_rev_basedd'];
    $__valeurs['T0.chp_genere_basedd']=$_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']??$__valeurs['T0.chp_genere_basedd'];
    $__valeurs['T0.chx_dossier_id_basedd']=$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']??$__valeurs['T0.chx_dossier_id_basedd'];
    $__valeurs['T0.chp_fournisseur_basedd']=$_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']??$__valeurs['T0.chp_fournisseur_basedd'];
    $o1 .= '<form method="post" enctype="multipart/form-data">' . PHP_EOL;
    $o1 .= ' <input type="hidden" value="__modification" name="__action" id="__action" />' . PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_basedd']=sha1($__valeur_encriptee);
    $o1 .= ' <input type="hidden" value="' . $__valeur_encriptee . '" name="chi_id_basedd" id="chi_id_basedd" />' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">id , nom et fournisseur</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <span>' . $__id . '</span>' . PHP_EOL;
    $o1 .= '   <input  type="text" value="' . enti1($__valeurs['T0.chp_nom_basedd']) . '" name="chp_nom_basedd" id="chp_nom_basedd" maxlength="64" style="width:100%;max-width:16em;" />' . PHP_EOL;
    $o1 .= '   <input  type="text" value="' . enti1($__valeurs['T0.chp_fournisseur_basedd']) . '" name="chp_fournisseur_basedd" id="chp_fournisseur_basedd" maxlength="64" style="width:100%;max-width:16em;" />' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">dossier</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    
    if($__valeurs['T0.chx_dossier_id_basedd'] === ''
       || $__valeurs['T0.chx_dossier_id_basedd'] === false
       || $__valeurs['T0.chx_dossier_id_basedd'] === null
    ){

        $o1 .= '<span id="T0.chp_nom_dossier">base non rattaché à un dossier</span> ' . PHP_EOL;

    }else{

        $o1 .= '<span id="T0.chp_nom_dossier">rattachée à "<b style="color:red;">' . $__valeurs['T1.chp_nom_dossier'] . '</b>" </span>' . PHP_EOL;
    }

    $o1 .= '   <input  type="hidden" value="' . encrypter($__valeurs['T0.chx_dossier_id_basedd']) . '" name="chx_dossier_id_basedd" id="chx_dossier_id_basedd" style="max-width:3em;"/>' . PHP_EOL;
    $__parametres_pour_la_modale=array( '__fonction' => 'recupérer_un_element_parent_en_bdd', '__url' => 'zz_dossiers_c1.php', '__nom_champ_dans_parent' => 'chx_dossier_id_basedd', '__champs_texte_a_rapatrier' => array( 'T0.chp_nom_dossier' => array( '__libelle_avant' => 'rattachée à "<b style="color:red;">', '__libelle_apres' => '</b>"', '__libelle_si_vide' => 'base non rattachée à un dossier')));
    $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
    $paramUrl=str_replace('\\','\\\\',$paramUrl);
    $paramUrl=str_replace('\'','\\\'',$paramUrl);
    $paramUrl=str_replace('"','\\"',$paramUrl);
    $paramUrl=rawurlencode($paramUrl);
    $o1 .= '   <a href="javascript:__gi1.afficherModale2(\'' . enti1($paramUrl) . '\')" title="selectionner">📁</a>' . PHP_EOL;
    $o1 .= '   <a class="yyalarme" href="javascript:__gi1.annuler_champ_modale(\'' . enti1($paramUrl) . '\')" title="annuler">🚫</a>' . PHP_EOL;
    
    if($__valeurs['T0.chx_dossier_id_basedd'] === ''
       || $__valeurs['T0.chx_dossier_id_basedd'] === false
       || $__valeurs['T0.chx_dossier_id_basedd'] === null
    ){


    }else{

        $o1 .= '<br />';
        $chemin_fichier='../../' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . $__valeurs['T1.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_basedd'];
        
        if(is_file($chemin_fichier)
           && strpos($__valeurs['T0.chp_nom_basedd'],'.db') !== false
           && strpos($__valeurs['T1.chp_nom_dossier'],'sqlite') !== false
        ){

            $o1 .= '&nbsp <button name="___produire_le_rev_v2" >produire le rev V2</button>';
            $o1 .= '&nbsp <button name="___produire_le_dump_des_donnees" >produire le dump des données</button>';
            $chemin_fichier_structure='../../' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . $__valeurs['T1.chp_nom_dossier'] . '/' . APP_KEY . '_structure.' . $__valeurs['T0.chp_nom_basedd'] . '.sql';
            
            if(is_file($chemin_fichier_structure)){

                $o1 .= '&nbsp; <span class="yysucces">un fichier structure.' . $__valeurs['T0.chp_nom_basedd'] . '.sql existe </span>' . PHP_EOL;

            }else{

                $o1 .= '&nbsp; <span class="yyalarme">le fichier structure.' . $__valeurs['T0.chp_nom_basedd'] . '.sql est absent</span>' . PHP_EOL;
            }

            $chemin_fichier_donnees='../../' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . $__valeurs['T1.chp_nom_dossier'] . '/' . APP_KEY . '_donnees.' . $__valeurs['T0.chp_nom_basedd'] . '.sql';
            
            if(is_file($chemin_fichier_donnees)){

                $o1 .= '&nbsp; <span class="yysucces">un fichier donnees.' . $__valeurs['T0.chp_nom_basedd'] . '.sql existe</span>' . PHP_EOL;

            }else{

                $o1 .= '&nbsp; <span class="yyalarme">le fichier donnees.' . $__valeurs['T0.chp_nom_basedd'] . '.sql est absent</span>' . PHP_EOL;
            }

            $o1 .= '  <br />' . PHP_EOL;

        }

        
        if(APP_KEY === $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible']
           && APP_KEY !== $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']
           && $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] === 'ftb'
        ){

            /*
              cas spécial car on développe un clone de fta sur ftb
            */
            $o1 .= '<br />' . PHP_EOL;
            $o1 .= '<button name="__importer_le_system_de_fta" >importer la base système de fta</button>';

        }

    }

    
    if($__valeurs['T0.chx_dossier_id_basedd'] !== null){


    }

    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">rev</div>' . PHP_EOL;
    $o1 .= '   <div style="font-weight: normal;">format rev</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1">' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.parentheses1(&quot;chp_rev_basedd&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.formatter_le_source_rev(&quot;chp_rev_basedd&quot;);" title="formatter le source rev">(😊)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;chp_rev_basedd&quot;);" title="formatter le source rev">#()(😊)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_rev_basedd&quot;);" title="réduire la zone">👊</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_rev_basedd&quot;);" title="agrandir la zone">🖐</a>' . PHP_EOL;
    $o1 .= '   <button name="__comparer_les_structures" class="yyinfo" name="">comparer les structures de la base et du champ "genere"</button>';
    $o1 .= '   <br />' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_rev_basedd" id="chp_rev_basedd"  rows="5" autocorrect="off" autocapitalize="off" spellcheck="false">' . enti1($__valeurs['T0.chp_rev_basedd'],ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">généré</div>' . PHP_EOL;
    $o1 .= '   <div style="font-weight: normal;">format sql</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1">' . PHP_EOL;
    $o1 .= '   <a class="yyinfo" href="javascript:bdd_convertir_rev_en_sql(\'chp_rev_basedd\',\'chp_genere_basedd\' , ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] . ',' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . ')">R2S&#8615;</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_genere_basedd&quot;);" title="réduire la zone">👊</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_genere_basedd&quot;);" title="agrandir la zone">🖐</a>' . PHP_EOL;
    $o1 .= '   <button id="__ecrire_la_structure_sur_disque" name="__ecrire_la_structure_sur_disque" class="yyinfo">ecrire le structure.' . enti1($__valeurs['T0.chp_nom_basedd']) . '.sql sur le disque</button>' . PHP_EOL;
    $o1 .= '   <br />' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_genere_basedd" id="chp_genere_basedd"  rows="5" autocorrect="off" autocapitalize="off" spellcheck="false">' . enti1($__valeurs['T0.chp_genere_basedd'],ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">rev de travail</div>' . PHP_EOL;
    $o1 .= '   <div style="font-weight: normal;">texte libre</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1">' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.parentheses1(&quot;chp_rev_travail_basedd&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.formatter_le_source_rev(&quot;chp_rev_travail_basedd&quot;);" title="formatter le source rev">(😊)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;chp_rev_travail_basedd&quot;);" title="formatter le source rev">#()(😊)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_rev_travail_basedd&quot;);" title="réduire la zone">👊</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_rev_travail_basedd&quot;);" title="agrandir la zone">🖐</a>' . PHP_EOL;
    $o1 .= '   <br />' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_rev_travail_basedd" id="chp_rev_travail_basedd"  rows="5" autocorrect="off" autocapitalize="off" spellcheck="false">' . enti1($__valeurs['T0.chp_rev_travail_basedd'],ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">commentaire</div>' . PHP_EOL;
    $o1 .= '   <div style="font-weight: normal;">texte libre</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1">' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;chp_commentaire_basedd&quot;);" title="agrandir ou réduire la zone">🖐👊</a>' . PHP_EOL;
    $o1 .= '   <br />' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_commentaire_basedd" id="chp_commentaire_basedd"  rows="5" >' . enti1($__valeurs['T0.chp_commentaire_basedd'],ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= '<div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <button type="submit" class="">enregistrer les modifications</button>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= '</div>' . PHP_EOL;
    $o1 .= '</form>' . PHP_EOL;
    $js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'chp_rev_basedd', 'mode' => 'rev'));
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
    
    if(isset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']) && count($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']) > 0){

        
        if($_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables'] === '___produire_le_rev_v2'){

            $js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'traite_le_tableau_de_la_base_sqlite_v2', 'parametre' => array( 'donnees' => $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'], 'zone_rev' => 'chp_rev_basedd', 'contexte' => $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']));
            unset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']);

        }


    }

    
    if(isset($_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux'])
       && count($_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux']) > 0
    ){

        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/
        $js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'comparer_deux_tableaux_de_bases_sqlite', 'parametre' => array( 'donnees' => $_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux'], 'zone_resultat' => 'chp_commentaire_basedd'));
        unset($_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux']);

    }


}else{

    
    if(isset($_GET['__action'])){

        $o1 .= $_GET['__action'] . '<br />';

    }

    $o1 .= 'pas d\'action prévue';
}

/*
  =====================================================================================================================
  =====================================================================================================================
*/
$js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple'));
$par=array(/**/
    'module_a_inclure' => array(/**/
            'js/module_svg_bdd.js',
            'js/mf_rev_vers_sql1.js'
        ),
    'js_a_inclure' => array(/**/
            'js/pour_zz_bdds_action1.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1 .= html_footer1($par);
print($o1);
$o1='';