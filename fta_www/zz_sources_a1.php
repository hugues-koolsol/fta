<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ true);

if(!isset($_SESSION[APP_KEY]['cible_courante'])){

    ajouterMessage(__xsu,__LINE__ . ' : veuillez sélectionner une cible avant d\'accéder aux sources');
    recharger_la_page('zz_cibles_l1.php');

}

$js_a_executer_apres_chargement=array();
/*
  
  =====================================================================================================================
*/
function erreur_dans_champs_saisis_sources(){

    $uneErreur=false;
    
    if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'] === ''){

        /*
          
          // A=65 , a=97 z=122 , 0=48 , 9=57
          // todo ajouter le test
        */
        $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|';
        ajouterMessage(__xer,__LINE__ . ' : le nom source doit etre indiqué et ne doit pas contenir les caractères espaces ',BNF);
        $uneErreur=true;

    }

    
    if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'],0,1) === ' '){

        ajouterMessage(__xer,__LINE__ . ' : le nom source ne doit pas commencer par un espace ',BNF);
        $uneErreur=true;

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

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/
    $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']=isset($_POST['chi_id_source']) ? decrypter($_POST['chi_id_source']) : '';
    $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']=$_POST['chp_nom_source']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_type_source']=$_POST['chp_type_source']??'normal';
    $_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']=$_POST['chx_cible_id_source']??$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'];
    $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']=$_POST['chp_commentaire_source']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']=$_POST['chp_rev_source']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']=$_POST['chp_genere_source']??'';
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);*/
    $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']=isset($_POST['chx_dossier_id_source']) ? ($_POST['chx_dossier_id_source'] === '' ? null : decrypter($_POST['chx_dossier_id_source'])) : '';
    
    if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] === ''){

        $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']=null;

    }

    verifie_id_envoye('chi_id_source','zz_sources_l1.php',BNF,$_POST);
    
    if(isset($_POST['__importer_le_fichier_source_de_fta'])){

        /*
          =====================================================================================================
          ============================== IMPORTER LE SOURCE DE FTA ============================================
          =====================================================================================================
        */
        
        if($_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] === 'fta'
           && $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] !== 'fta'
        ){

            sql_inclure_reference(62);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_62.php');
            /*
            SELECT 
            `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
            `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
            `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
             FROM b1.tbl_sources T0
             LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source
            
             LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source
            
            WHERE (`T0`.`chi_id_source` = :T0_chi_id_source
             AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);

            */
            /*sql_inclure_fin*/
            
            $tt=sql_62(array( 'T0_chi_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'], 'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
            
            if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

                ajouterMessage(__xer,__LINE__ . ' valeurs non trouvées pour cet id');
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

            }

            $__valeurs=$tt[__xva][0];
            $nom_complet_du_source_dans_fta='../../fta' . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
            
            if(is_file($nom_complet_du_source_dans_fta)){

                $nomCompletSource='../../' . $__valeurs['T1.chp_dossier_cible'] . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
                
                if(copy($nom_complet_du_source_dans_fta,$nomCompletSource)){

                    ajouterMessage(__xsu,__LINE__ . ' : le fichier a bien été importé ');

                }else{

                    ajouterMessage(__xer,__LINE__ . ' : il y a eu une erreur lors de la copie du fichier ');
                }


            }else{

                ajouterMessage(__xer,__LINE__ . ' : le fichier n\'existe pas dans fta ');
            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' : on ne peut pas faire de copie sur cet environnement ');
        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
        /*   $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']   */

    }else if(isset($_POST['__convertir_sql_sqlite_en_rev'])){

        /*
          =====================================================================================================
          ============================== CONVERTIR UN SQL EN REV ==============================================
          =====================================================================================================
        */
        
        if($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'] !== ''){

            require_once('../fta_inc/phplib/sqlite.php');
            $ret=produire_un_tableau_de_la_structure_d_une_bdd_grace_a_un_source_de_structure($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']);
            
            if($ret[__xst] === __xsu){

                $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$ret['value'];

            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' : il n\'y a rien à convertir ');
        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

    }else if(isset($_POST['__ecrire_sur_disque'])){

        /*
          =====================================================================================================
          ============================== ECRIRE SUR DISQUE ====================================================
          =====================================================================================================
        */
        /*     echo __LINE__ . '$_POST=<pre>' . var_export($_POST,true) . '</pre>'; exit();*/
        sql_inclure_reference(62);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_62.php');
        /*
        SELECT 
        `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
        `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
        `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
         FROM b1.tbl_sources T0
         LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source
        
         LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source
        
        WHERE (`T0`.`chi_id_source` = :T0_chi_id_source
         AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_62(array( 'T0_chi_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'], 'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' valeurs non trouvées pour cet id');
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

        }

        $__valeurs=$tt[__xva][0];
        /*     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);*/
        
        if($__valeurs['T1.chp_dossier_cible'] !== null && $__valeurs['T2.chp_nom_dossier'] !== null){

            $nomCompletSource='../../' . $__valeurs['T1.chp_dossier_cible'] . $__valeurs['T2.chp_nom_dossier'] . '/' . $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'];
            
            if(is_file($nomCompletSource)){

                
                if(!sauvegarder_et_supprimer_fichier($nomCompletSource)){

                    ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer le fichier du disque ',BNF);
                    recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

                }


            }

            /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nomCompletSource , true ) . '</pre>' ; exit(0);*/
            
            if($fd=fopen($nomCompletSource,'w')){

                /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export($_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
                $texte_source=$_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'];
                $alea1=texte_aleatoire(10);
                
                if(strpos($texte_source,$alea1) !== false){

                    ajouterMessage(__xer,__LINE__ . ' : il y a eu un léger problème lors de l\'écriture , veuillez réessayer');

                }else{

                    
                    if(strtoupper(substr(PHP_OS,0,3)) === 'WIN'){

                        /*
                          Les zones textarea ne contiennent que des \n pour terminer une ligne
                          mais windows impose \r\n
                        */
                        $CHAINE_CR=$alea1 . 'CR' . $alea1;
                        $CHAINE_LF=$alea1 . 'LF' . $alea1;
                        
                        if(strpos($texte_source,"\n") !== false && strpos($texte_source,"\r") !== false){

                            /*
                              si il y a des \r et de \n
                            */
                            $texte_source=str_replace("\n",$CHAINE_LF,$texte_source);
                            $texte_source=str_replace("\r",'',$texte_source);
                            $texte_source=str_replace($CHAINE_LF,"\r\n",$texte_source);

                        }else if(strpos($texte_source,"\n") === false && strpos($texte_source,"\r") !== false){

                            $texte_source=str_replace("\r","\r\n",$texte_source);

                        }else if(strpos($texte_source,"\n") !== false && strpos($texte_source,"\r") === false){

                            $texte_source=str_replace("\n","\r\n",$texte_source);

                        }else if(strpos($texte_source,"\n") === false && strpos($texte_source,"\r") === false){

                            /* on ne remplace rien */
                        }


                    }

                    $ret=fwrite($fd,$texte_source);
                    
                    if($ret !== false){

                        fclose($fd);
                        ajouterMessage(__xsu,__LINE__ . ' : Le généré a bien été écrit sur le disque');
                        /* si on est dans fta, que l'utilisateur=1 et que le dossier =1, on écrit le source rev aussi */
                        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);*/
                        
                        if(APP_KEY === 'fta'
                           && $_SESSION[APP_KEY]['sess_id_utilisateur_init'] === 1
                           && $__valeurs['T0.chx_dossier_id_source'] === 1
                        ){

                            $nomCompletSource .= '.rev';
                            
                            if($fd=fopen($nomCompletSource,'w')){

                                $ret=fwrite($fd,$_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']);
                                
                                if($ret !== false){

                                    fclose($fd);
                                    ajouterMessage(__xsu,__LINE__ . ' : le rev aussi a été écrit sur disque');

                                }else{

                                    ajouterMessage(__xer,__LINE__ . ' le fichier rev n\'a pas pu être écrit');
                                }


                            }else{

                                ajouterMessage(__xer,__LINE__ . ' le fichier rev n\'a pas pu être ouvert');
                            }


                        }


                    }else{

                        ajouterMessage(__xer,__LINE__ . ' : il y a eu un problème lors de l\'écriture ');
                    }

                }


            }else{

                ajouterMessage(__xer,__LINE__ . ' : il y a eu un problème lors de l\'ouverture du fichier ');
            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' : problème sur le dossier cible ');
        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

    }else if(isset($_POST['__action']) && $_POST['__action'] == '__modification'){

        /*
          =====================================================================================================
          ============================== MODIFICATION =========================================================
          =====================================================================================================
        */
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
        
        if(erreur_dans_champs_saisis_sources()){

            /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
            
            if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_source']) && is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'])){

                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

            }else{

                ajouterMessage(__xer,__LINE__ . ' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
                recharger_la_page('zz_sources_l1.php');
            }


        }

        $le_fichier_est_renomme=false;
        sql_inclure_reference(62);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_62.php');
        /*
        SELECT 
        `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
        `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
        `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
         FROM b1.tbl_sources T0
         LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source
        
         LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source
        
        WHERE (`T0`.`chi_id_source` = :T0_chi_id_source
         AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_62(array( 'T0_chi_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'], 'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' valeurs non trouvées pour cet id');
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

        }

        $__valeurs=$tt[__xva][0];
        $nom_complet_de_l_ancien_fichier='../../' . $__valeurs['T1.chp_dossier_cible'] . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);*/
        
        if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] === null){


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
            
            $tt=sql_50(array( 'T0_chi_id_dossier' => $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'], 'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
            $nom_dossier='';
            
            if($tt[__xst] === __xsu && count($tt[__xva]) === 1){

                $nouveau_dossier=$tt[__xva][0];

            }else{

                ajouterMessage(__xer,__LINE__ . ' :  dossier non trouvé');
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
            }

            /*      echo __FILE__ . ' ' . __LINE__ . ' $nouveau_dossier = <pre>' . var_export( $nouveau_dossier , true ) . '</pre>' ; exit(0);*/
            $nom_complet_du_nouveau_fichier='../../' . $nouveau_dossier['T1.chp_dossier_cible'] . $nouveau_dossier['T0.chp_nom_dossier'] . '/' . $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'];
            /*  echo __FILE__ . ' ' . __LINE__ . ' $nom_complet_de_l_ancien_fichier = <pre>' . var_export( $nom_complet_de_l_ancien_fichier , true ) . '</pre>, $nom_complet_du_nouveau_fichier<pre>' . var_export( $nom_complet_du_nouveau_fichier , true ) . '</pre>' ; exit(0);*/
            $deja_renomme=false;
            
            if($nom_complet_du_nouveau_fichier !== $nom_complet_de_l_ancien_fichier){

                /*
                  
                  si on renomme le fichier, il faut aussi le déplacer sur disque s'il existe
                */
                
                if(is_file($nom_complet_du_nouveau_fichier)){

                    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/
                    
                    if(isset($_POST['option']) && $_POST['option'] === 'remplacer_le_fichier'){


                    }else{

                        /* si le fichier existe déjà sur le disque */
                        ajouterMessage(__xsu,__LINE__ . ' :  Utilisez le bouton "remplacer le fichier ..." pour remplacer ce fichier');
                        ajouterMessage(__xer,__LINE__ . ' :  ce fichier "' . $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'] . '" existe déjà sur disque');
                        $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']=$__valeurs['T0.chp_nom_source'];
                        recharger_la_page(BNF . '?__option=remplacer_le_fichier&__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
                    }


                }

                /*         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);*/
                
                if($nom_complet_de_l_ancien_fichier !== $nom_complet_du_nouveau_fichier){

                    
                    if((@rename($nom_complet_de_l_ancien_fichier,$nom_complet_du_nouveau_fichier))){

                        $deja_renomme=true;

                    }


                }

                /*
                  
                  si pour une raison inconnue, on n'arrive pas à rennomer le fichier
                */
                $le_fichier_est_renomme=true;
                /*     echo __FILE__ . ' ' . __LINE__ . ' $nom_complet_de_l_ancien_fichier = <pre>' . var_export( $nom_complet_de_l_ancien_fichier , true ) . '</pre>' ; exit(0);*/

            }

            /*      echo __FILE__ . ' ' . __LINE__ . ' $nom_complet_du_nouveau_fichier = <pre>' . var_export( $nom_complet_du_nouveau_fichier , true ) . '</pre>' ; exit(0);*/
        }

        sql_inclure_reference(63);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_63.php');
        /*
        
        UPDATE b1.tbl_sources SET `chp_nom_source` = :n_chp_nom_source , `chp_commentaire_source` = :n_chp_commentaire_source , `chx_dossier_id_source` = :n_chx_dossier_id_source , `chp_rev_source` = :n_chp_rev_source , `chp_genere_source` = :n_chp_genere_source , `chp_type_source` = :n_chp_type_source
        WHERE (`chi_id_source` = :c_chi_id_source
         AND `chx_cible_id_source` = :c_chx_cible_id_source) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_63(array(
            'c_chi_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'],
            'c_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
            'n_chp_nom_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'],
            'n_chp_commentaire_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source'] === null ? 'NULL' : $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source'],
            'n_chx_dossier_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] === null ? 'NULL' : $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'],
            'n_chp_rev_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_rev_source'] === null ? 'NULL' : $_SESSION[APP_KEY][NAV][BNF]['chp_rev_source'],
            'n_chp_genere_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'] === null ? 'NULL' : $_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'],
            'n_chp_type_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_type_source']
        ));
        
        if($tt[__xst] === __xsu && $tt['changements'] === 1){

            ajouterMessage(__xsu,' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11) . '.' . substr(microtime(),2,2),BNF);
            /* echo __FILE__ . ' ' . __LINE__ . ' $le_fichier_est_renomme = <pre>' . var_export( $le_fichier_est_renomme , true ) . '</pre>  $nom_complet_du_nouveau_fichier = <pre>' . var_export( $nom_complet_du_nouveau_fichier , true ) . '</pre>  $nom_complet_de_l_ancien_fichier = <pre>' . var_export( $nom_complet_de_l_ancien_fichier , true ) . '</pre>' ; exit(0);*/
            
            if($le_fichier_est_renomme){

                /* si on a précédemment renommé le fichier sur disque,*/
                /* on recrée l'ancien non en espérant qu'un autre utilisateur ne l'a pas renommé entre-temps*/
                
                if($deja_renomme === false && !(@rename($nom_complet_de_l_ancien_fichier,$nom_complet_du_nouveau_fichier))){

                    ajouterMessage(__xer,__LINE__ . ' :  ATTENTION, le nom du fichier original sur disque n\'a pas pu $etre rétabli');

                }


            }

            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

        }else{

            
            if($tt['code_erreur'] === 19){

                ajouterMessage(__xer,__LINE__ . ' ce nom existe déjà en bdd ',BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

            }else{

                ajouterMessage(__xer,__LINE__ . ' ' . $tt[__xme],BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
            }

        }

        recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

    }else if(isset($_POST['__action']) && $_POST['__action'] == '__confirme_suppression'){

        /*
          
          =====================================================================================================
          =============================== CONFIRMATION DE LA SUPPRESSION ======================================
          =====================================================================================================
        */
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'] , true ) . '</pre>' ; exit(0);*/
        /*
          
          http://localhost/functToArray/fta/fta_www/zz_sources_a1.php?__id=2&__action=__suppression
        */
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);*/
        
        if($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'] !== false){

            sql_inclure_reference(62);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_62.php');
            /*
            SELECT 
            `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
            `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
            `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
             FROM b1.tbl_sources T0
             LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source
            
             LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source
            
            WHERE (`T0`.`chi_id_source` = :T0_chi_id_source
             AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);

            */
            /*sql_inclure_fin*/
            
            $tt=sql_62(array( 'T0_chi_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'], 'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
            
            if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

                ajouterMessage(__xer,__LINE__ . ' valeurs non trouvées pour cet id');
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

            }

            $__valeurs=$tt[__xva][0];
            
            if(APP_KEY !== 'fta' && $__valeurs['T1.chp_dossier_cible'] === 'fta'){

                /*
                  
                  si on est dans l'environnement ftx ( APP_KEY !== 'fta' ) 
                  et que le dossier cible est fta ( $__valeurs['T1.chp_dossier_cible'] === 'fta' )
                  on ne doit pas effacer ce fichier car il appartient à fta et il n'y a que fta
                  qui peut gérer les fichiers de fta
                */
                /*             echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/

            }else{

                /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);*/
                $nom_complet_de_l_ancien_fichier='../../' . $__valeurs['T1.chp_dossier_cible'] . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
                
                if(is_file($nom_complet_de_l_ancien_fichier)){

                    
                    if(!sauvegarder_et_supprimer_fichier($nom_complet_de_l_ancien_fichier)){

                        ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer le fichier du disque ',BNF);
                        recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);

                    }


                }

            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer cet enregistrement ',BNF);
            recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);
        }

        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);*/
        /*  $nom_fichier_disque=*/
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
        
        $tt=sql_5(array( 'chx_cible_rev' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'], 'chp_provenance_rev' => 'source', 'chx_source_rev' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']));
        /*  echo __FILE__ . ' ' . __LINE__ . ' $sql = <pre>' .  $sql  . '</pre>' ; exit(0);*/
        
        if(false === $tt[__xst]){

            ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
            recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);

        }else{

            sql_inclure_reference(39);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_39.php');
            /*
            
            DELETE FROM b1.tbl_sources
            WHERE (`chi_id_source` = :chi_id_source
              
             AND `chx_cible_id_source` = :chx_cible_id_source) ;

            */
            /*sql_inclure_fin*/
            
            $tt=sql_39(array( 'chi_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'], 'chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
            
            if($tt[__xst] === __xsu || $tt['changements'] === 1){

                ajouterMessage(__xsu,'384 l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11));
                recharger_la_page('zz_sources_l1.php');

            }else{

                ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
                recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);
            }

        }


    }else if(isset($_POST['__action']) && $_POST['__action'] == '__creation'){

        /*
          
          =====================================================================================================
          =============================== CREATION ============================================================
          =====================================================================================================
        */
        
        if(erreur_dans_champs_saisis_sources()){

            recharger_la_page(BNF . '?__action=__creation');

        }

        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);*/
        sql_inclure_reference(54);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_54.php');
        /*
        
        INSERT INTO b1.`tbl_sources`(
            `chx_cible_id_source` , 
            `chp_nom_source` , 
            `chp_commentaire_source` , 
            `chx_dossier_id_source` , 
            `chp_rev_source` , 
            `chp_genere_source` , 
            `chp_type_source`
        ) VALUES (
            :chx_cible_id_source , 
            :chp_nom_source , 
            :chp_commentaire_source , 
            :chx_dossier_id_source , 
            :chp_rev_source , 
            :chp_genere_source , 
            :chp_type_source
        );

        */
        /*sql_inclure_fin*/
        
        $a_inserer=array( array(
                    'chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
                    'chp_nom_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'],
                    'chp_commentaire_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source'],
                    'chx_dossier_id_source' => $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'],
                    'chp_rev_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_rev_source'],
                    'chp_genere_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'],
                    'chp_type_source' => $_SESSION[APP_KEY][NAV][BNF]['chp_type_source']
                ));
        $tt=sql_54($a_inserer);
        
        if($tt[__xst] === __xer){

            ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
            recharger_la_page(BNF . '?__action=__creation');

        }else{

            ajouterMessage(__xsu,__LINE__ . ' : l\'enregistrement (' . $tt['nouvel_id'] . ') a bien été créé',BNF);
            recharger_la_page(BNF . '?__action=__modification&__id=' . $tt['nouvel_id']);
        }


    }else{

        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SERVER['REQUEST_URI'] , true ) . '</pre>' ; exit(0);*/
        unset($_SESSION[APP_KEY][NAV][BNF]);
        $__message=' cas à étudier ' . (isset($_POST['__action']) ? ' : "' . $_POST['__action'] . '" ' : ' ') . substr($GLOBALS['__date'],11);
        ajouterMessage('avertissement',__LINE__ . $__message,BNF);
        recharger_la_page($_SERVER['REQUEST_URI']);
    }

    /*
      
      on ne devrait pas arriver là car on a normalement capturé tous les cas
    */
    
    if(isset($_SESSION[APP_KEY][NAV][BNF])){

        unset($_SESSION[APP_KEY][NAV][BNF]);

    }

    ajouterMessage(__xsu,__LINE__ . ' cas à étudier ' . substr($GLOBALS['__date'],11));
    recharger_la_page('zz_sources_l1.php');

}

/*
  
  =====================================================================================================================
  =====================================================================================================================
  ============================================= GET ==================================================================
  =====================================================================================================================
  =====================================================================================================================
*/

if(isset($_GET['__action']) && ($_GET['__action'] == '__modification' || $_GET['__action'] == '__suppression')){

    $__id=isset($_GET['__id']) ? (is_numeric($_GET['__id']) ? (int)($_GET['__id']) : 0) : 0;
    
    if($__id === 0){

        ajouterMessage(__xer,__LINE__ . ' il y a eu un problème ');
        recharger_la_page('zz_sources_l1.php');

    }

    sql_inclure_reference(62);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_62.php');
    /*
    SELECT 
    `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
    `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
    `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
     FROM b1.tbl_sources T0
     LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source
    
     LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source
    
    WHERE (`T0`.`chi_id_source` = :T0_chi_id_source
     AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);

    */
    /*sql_inclure_fin*/
    
    $tt=sql_62(array( 'T0_chi_id_source' => $__id, 'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
    
    if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

        ajouterMessage(__xer,__LINE__ . ' valeurs non trouvées pour cet id');
        recharger_la_page(BNF . '?__action=__modification&__id=' . $__id);

    }

    $__valeurs=$tt[__xva][0];

}

/*
  
  =====================================================================================================================
  ============================================= entete de la page =====================================================
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'sources', 'description' => 'sources'));
print($o1);
$o1='';
/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . enti1(var_export( $_SESSION , true )) . '</pre>' ; exit(0);*/
$o1 .= '<h1>gestion de source (dossier ' . $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] . ')' . bouton_retour_a_la_liste('zz_sources_l1.php') . '</h1>';

if(isset($_GET['__action']) && $_GET['__action'] == '__suppression'){

    /*
      
      =============================================================================================================
      ===================================== __suppression =========================================================
      =============================================================================================================
    */
    /*
      
      http://localhost/functToArray/fta/fta_www/zz_sources_a1.php?__id=2&__action=__suppression
    */
    $o1 .= ' <form method="post" class="yyformDelete">' . PHP_EOL;
    $o1 .= '   veuillez confirmer le suppression de  : ' . PHP_EOL;
    $o1 .= '   <br /><br /><b>' . '(' . $__valeurs['T0.chi_id_source'] . ')  nom : ' . $__valeurs['T0.chp_nom_source'] . ' <br /> ' . '</b><br />' . PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_source']=sha1($__valeur_encriptee);
    $o1 .= '   <input type="hidden" value="' . $__valeur_encriptee . '" name="chi_id_source" id="chi_id_source" />' . PHP_EOL;
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
    $o1 .= '<h2>ajouter un source</h2>' . PHP_EOL;
    $o1 .= '<form method="post"  enctype="multipart/form-data" class="form1">' . PHP_EOL;
    $chp_nom_source=isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <input type="text" autofocus="autofocus" value="' . enti1($chp_nom_source) . '" name="chp_nom_source" id="chp_nom_source" maxlength="64" style="max-width:64em;" />' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $chp_type_source=isset($_SESSION[APP_KEY][NAV][BNF]['chp_type_source']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_type_source'] : 'normal';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">type</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <input type="text" autofocus="autofocus" value="' . enti1($chp_type_source) . '" name="chp_type_source" id="chp_type_source" maxlength="32" style="max-width:32em;" />' . PHP_EOL;
    $o1 .= '   <button onclick="document.getElementById(\'chp_type_source\').value=&quot;bibliotheque&quot;;return false;">bibliotheque</button>' . PHP_EOL;
    $o1 .= '   <button onclick="document.getElementById(\'chp_type_source\').value=&quot;normal&quot;;return false;">normal</button>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $chx_dossier_id_source=isset($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']) ? $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="' . encrypter($chx_dossier_id_source) . '" name="chx_dossier_id_source" id="chx_dossier_id_source" style="max-width:9em;" />' . PHP_EOL;
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chx_dossier_id_source , true ) . '</pre>' ; exit(0);*/
    $__parametres_pour_la_modale=array( '__fonction' => 'recupérer_un_element_parent_en_bdd', '__url' => 'zz_dossiers_c1.php', '__nom_champ_dans_parent' => 'chx_dossier_id_source', '__champs_texte_a_rapatrier' => array( 'T0.chp_nom_dossier' => array( '__libelle_avant' => 'rattaché à "<b style="color:red;">', '__libelle_apres' => '</b>"', '__libelle_si_vide' => 'source non rattaché à un dossier')));
    $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
    $paramUrl=str_replace('\\','\\\\',$paramUrl);
    $paramUrl=str_replace('\'','\\\'',$paramUrl);
    $paramUrl=str_replace('"','\\"',$paramUrl);
    $paramUrl=rawurlencode($paramUrl);
    $o1 .= '   <a href="javascript:__gi1.afficherModale2(\'' . enti1($paramUrl) . '\')" title="selectionner">📁</a>' . PHP_EOL;
    $o1 .= '   <a class="yyalarme" href="javascript:__gi1.annuler_champ_modale(\'' . enti1($paramUrl) . '\')" title="annuler">🚫</a>' . PHP_EOL;
    
    if($chx_dossier_id_source === '' || $chx_dossier_id_source === false){

        $o1 .= '<span id="T0.chp_nom_dossier">source non rattaché à un dossier</span> ' . PHP_EOL;

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
        
        $tt50=sql_50(array( 'T0_chi_id_dossier' => $chx_dossier_id_source, 'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
        /* echo __FILE__ . ' ' . __LINE__ . ' $tt50 = <pre>' . var_export( $tt50 , true ) . '</pre>' ; exit(0);*/
        
        if($tt50[__xst] === __xer || count($tt50[__xva]) !== 1){

            $o1 .= '<span class="yydanger">Problème sur récupération du dossier</span>' . PHP_EOL;

        }else{

            $o1 .= '<span id="T0.chp_nom_dossier">rattaché à "<b style="color:red;">' . $tt50[__xva][0]['T0.chp_nom_dossier'] . '</b>" </span>' . PHP_EOL;
        }

    }

    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $chp_commentaire_source=isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_commentaire_source" id="chp_commentaire_source"  rows="15" >' . enti1($chp_commentaire_source,ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
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
    /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
    $o1 .= '<h2>modifier un source</h2>' . PHP_EOL;
    $__valeurs['T0.chp_nom_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']??$__valeurs['T0.chp_nom_source'];
    $__valeurs['T0.chp_type_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_type_source']??$__valeurs['T0.chp_type_source'];
    $__valeurs['T0.chx_dossier_id_source']=$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']??$__valeurs['T0.chx_dossier_id_source'];
    $__valeurs['T0.chx_cible_id_source']=$_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']??$__valeurs['T0.chx_cible_id_source'];
    $__valeurs['T0.chp_commentaire_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']??$__valeurs['T0.chp_commentaire_source'];
    $__valeurs['T0.chp_rev_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']??$__valeurs['T0.chp_rev_source'];
    $__valeurs['T0.chp_genere_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']??$__valeurs['T0.chp_genere_source'];
    $o1 .= '<form method="post" enctype="multipart/form-data">' . PHP_EOL;
    $o1 .= ' <input type="hidden" value="__modification" name="__action" id="__action" />' . PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_source']=sha1($__valeur_encriptee);
    $o1 .= ' <input type="hidden" value="' . $__valeur_encriptee . '" name="chi_id_source" id="chi_id_source" />' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">id, nom , dossier</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <span>' . $__id . '</span>' . PHP_EOL;
    $o1 .= '   <input  type="text" value="' . enti1($__valeurs['T0.chp_nom_source']) . '" name="chp_nom_source" id="chp_nom_source" maxlength="64" style="width:100%;max-width:20em;" />' . PHP_EOL;
    $o1 .= '   <input  type="text" value="' . enti1($__valeurs['T0.chp_type_source']) . '" name="chp_type_source" id="chp_type_source" maxlength="64" style="width:100%;max-width:8em;" />' . PHP_EOL;
    $__valeur_encriptee=encrypter($__valeurs['T0.chx_dossier_id_source']);
    $o1 .= '   <input  type="hidden" value="' . $__valeur_encriptee . '" name="chx_dossier_id_source" id="chx_dossier_id_source" style="max-width:3em;"/>' . PHP_EOL;
    $__parametres_pour_la_modale=array( '__fonction' => 'recupérer_un_element_parent_en_bdd', '__url' => 'zz_dossiers_c1.php', '__nom_champ_dans_parent' => 'chx_dossier_id_source', '__champs_texte_a_rapatrier' => array( 'T0.chp_nom_dossier' => array( '__libelle_avant' => 'rattaché à "<b style="color:red;">', '__libelle_apres' => '</b>"', '__libelle_si_vide' => 'source non rattaché à un dossier')));
    $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
    $paramUrl=str_replace('\\','\\\\',$paramUrl);
    $paramUrl=str_replace('\'','\\\'',$paramUrl);
    $paramUrl=str_replace('"','\\"',$paramUrl);
    $paramUrl=rawurlencode($paramUrl);
    $o1 .= '   <a href="javascript:__gi1.afficherModale2(\'' . enti1($paramUrl) . '\')" title="selectionner">📁</a>' . PHP_EOL;
    $o1 .= '   <a class="yyalarme" href="javascript:__gi1.annuler_champ_modale(\'' . enti1($paramUrl) . '\')" title="annuler">🚫</a>' . PHP_EOL;
    
    if($__valeurs['T0.chx_dossier_id_source'] === null || $__valeurs['T0.chx_dossier_id_source'] === false){

        $o1 .= '<span id="T0.chp_nom_dossier">source non rattaché à un dossier</span> ' . PHP_EOL;

    }else{

        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);*/
        $o1 .= '<span id="T0.chp_nom_dossier">rattaché à "<b style="color:red;">' . $__valeurs['T2.chp_nom_dossier'] . '</b>" </span>' . PHP_EOL;
    }

    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    /*
      champ rev
    */
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">rev</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1">' . PHP_EOL;
    $o1 .= '  <div>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.parentheses1(&quot;chp_rev_source&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.formatter_le_source_rev(&quot;chp_rev_source&quot;);" title="formatter le source rev">(😊)</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;chp_rev_source&quot;);" title="formatter le source rev">#()(😊)</a>' . PHP_EOL;
    $o1 .= '   <a class="yysucces" href="javascript:__gi1.aller_a_la_position(&quot;chp_rev_source&quot;)">aller à la position</a>' . PHP_EOL;
    $o1 .= '   <a class="yyinfo" href="javascript:__gi1.remplacer_la_selection_par(&quot;chp_rev_source&quot;)">remplacer la sélection</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_rev_source&quot;);" title="agrandir la zone">🖐</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_rev_source&quot;);" title="réduire la zone">👊</a>' . PHP_EOL;
    $o1 .= '   <a href="javascript:__gi1.raz_la_text_area(&quot;chp_rev_source&quot;);" title="raz de la zone">🚫</a>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_rev_source" id="chp_rev_source"  rows="15" spellcheck="false" >' . enti1($__valeurs['T0.chp_rev_source'],ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    /*
      champ genere
    */
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">genere</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1">' . PHP_EOL;
    $o1 .= '  <div>' . PHP_EOL;
    
    if($__valeurs['T0.chp_type_source'] === 'normal'){

        
        if(strpos($__valeurs['T0.chp_nom_source'],'.js') !== false){

            $o1 .= '   <a class="yyinfo" href="javascript:__gi1.convertir_textearea_rev_vers_textarea_js2(\'chp_rev_source\',\'chp_genere_source\',' . $__id . ',' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . ')">R-&gt;J&#8615;</a>' . PHP_EOL;
            $o1 .= '   <a class="yyrose" href="javascript:__gi1.bouton_transform_textarea_js_en_rev_avec_acorn3(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;,false)">&#8613;J-&gt;R</a>' . PHP_EOL;

        }else if(strpos($__valeurs['T0.chp_nom_source'],'.htm') !== false){

            $o1 .= '   <a class="yyinfo" href="javascript:convertir_rev_en_html(\'chp_rev_source\',\'chp_genere_source\',' . $__id . ',' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . ')">R2H&#8615;</a>' . PHP_EOL;
            $o1 .= '   <a class="yyalarme" href="javascript:__gi1.convertir_text_area_html_en_rev(&quot;chp_genere_source&quot;,&quot;{\'zone_html_rev\':\'chp_rev_source\'}&quot;)" class="yysucces">&#8613;H2R</a>' . PHP_EOL;

        }else if(strpos($__valeurs['T0.chp_nom_source'],'.php') !== false){

            $o1 .= '   <a class="yysucces" href="javascript:__gi1.convertir_textearea_rev_vers_textarea_php2(\'chp_rev_source\',\'chp_genere_source\',' . $__id . ',' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . ')">R2P&#8615;</a>' . PHP_EOL;
            $o1 .= '   <a class="yyalarme" href="javascript:__gi1.bouton_convertir_text_area_php_en_rev_avec_nikic2(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;,&quot;{\'nettoyer_html\':false}&quot;,true)">nicky htm strict 2 </a>' . PHP_EOL;
            $o1 .= '   <a class="yyalarme" href="javascript:__gi1.bouton_convertir_text_area_php_en_rev_avec_nikic2(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;,&quot;{\'nettoyer_html\':true}&quot;,true)">nicky htm echo 2</a>' . PHP_EOL;
            $o1 .= '   <a class="yyinfo" href="javascript:__gi1.convertir_text_area_php_en_rev_avec_php_parseur_js(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;,&quot;{\'nettoyer_html\':false}&quot;,false)">phpp htm strict</a>';
            $o1 .= '   <a class="yyinfo" href="javascript:__gi1.convertir_text_area_php_en_rev_avec_php_parseur_js(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;,&quot;{\'nettoyer_html\':true}&quot;,false)">phpp htm echo</a>';

        }else if(strpos($__valeurs['T0.chp_nom_source'],'.sql') !== false){

            $o1 .= '   <a class="yyinfo" href="javascript:convertir_rev_en_sql(\'chp_rev_source\',\'chp_genere_source\',' . $__id . ',' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . ')">&#8615; rev =&gt; sql &#8615;</a>' . PHP_EOL;
            $o1 .= '   <a class="yyalarme" href="javascript:convertir_sqlite_en_rev(\'chp_rev_source\',\'chp_genere_source\')">&#8613; sql =&gt; rev &#8613;</a>' . PHP_EOL;

        }else{

            $o1 .= '   <a class="yyinfo" href="javascript:convertir_rev_en_texte(\'chp_rev_source\',\'chp_genere_source\',' . $__id . ',' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . ')">&#8615; rev =&gt; texte &#8615;</a>' . PHP_EOL;
            $o1 .= '   <a class="yyalarme" href="javascript:convertir_texte_en_rev(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;)">&#8613; texte =&gt; rev &#8613;</a>' . PHP_EOL;
        }


    }

    $o1 .= '   <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;chp_genere_source&quot;)">aller à la ligne n°</a>' . PHP_EOL;
    $o1 .= '   <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;chp_genere_source&quot;);" title="agrandir la zone">🖐</a>' . PHP_EOL;
    $o1 .= '   <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;chp_genere_source&quot;);" title="réduire la zone">👊</a>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_genere_source" id="chp_genere_source"  rows="15" spellcheck="false" >' . enti1($__valeurs['T0.chp_genere_source'],ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '   <div>' . PHP_EOL;
    
    if($__valeurs['T2.chp_nom_dossier'] !== null){

        $o1 .= '   <button id="__ecrire_sur_disque" name="__ecrire_sur_disque" class="yyinfo">ecrire le généré sur le disque</button>' . PHP_EOL;

    }

    
    if($__valeurs['T1.chp_dossier_cible'] !== null && $__valeurs['T2.chp_nom_dossier'] !== null){

        $nomCompletSource='../../' . $__valeurs['T1.chp_dossier_cible'] . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nomCompletSource , true ) . '</pre>' ; exit(0);*/
        
        if(is_file($nomCompletSource)){

            
            if($__valeurs['T0.chp_type_source'] === 'normal'){

                $o1 .= '   <a href="javascript:lire_un_fichier_du_disque(&quot;' . encrypter(enti1($nomCompletSource)) . '&quot;)" class="yyalarme">lire du disque</a>' . PHP_EOL;
                $o1 .= '   <a class="yydanger" href="javascript:supprimer_un_fichier_du_disque(&quot;' . encrypter(enti1($nomCompletSource)) . '&quot;)" class="yyalarme">supprimer du disque</a>' . PHP_EOL;

            }


        }else{

            $o1 .= '   <span>le fichier est absent du disque</span>' . PHP_EOL;
        }

        
        if($_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] === 'fta'
           && $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] !== 'fta'
        ){

            $nom_complet_du_source_dans_fta='../../fta' . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
            
            if(is_file($nom_complet_du_source_dans_fta)){

                $o1 .= '   <button name="__importer_le_fichier_source_de_fta" class="yyinfo">importer le fichier source de fta</button>' . PHP_EOL;

            }else{

                $o1 .= '   ce fichier n\'a pas de correspondant dans fta' . PHP_EOL;
            }


        }


    }

    $o1 .= '   </div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">commentaire</div>' . PHP_EOL;
    $o1 .= '   <div style="font-weight: normal;">texte libre</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1 yyconteneur_de_texte1"><div>' . PHP_EOL;
    $o1 .= '   <textarea  name="chp_commentaire_source" id="chp_commentaire_source"  rows="5" >' . enti1($__valeurs['T0.chp_commentaire_source'],ENT_COMPAT) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= '<div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <button type="submit" class="">enregistrer les modifications</button>' . PHP_EOL;
    
    if(isset($_GET['__option']) && $_GET['__option'] === 'remplacer_le_fichier'){

        $o1 .= '   <button class="yyalarme" type="submit" name="option" value="remplacer_le_fichier" class="">remplacer le fichier et enregistrer les modifications</button>' . PHP_EOL;

    }

    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= '</div>' . PHP_EOL;
    $o1 .= '</form>' . PHP_EOL;
    $js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'chp_rev_source', 'mode' => 'rev'));
    
    if(isset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']) && count($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']) > 0){

        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'] , true ) . '</pre>' ; */
        $js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'traite_le_tableau_de_la_base_sqlite_v2', 'parametre' => array( 'donnees' => $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'], 'zone_rev' => 'chp_rev_source'));
        unset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']);

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
    'js_a_inclure' => array(
            /**/
            'js/pour_zz_source1.js',
            'js/pour_zz_bdds_action1.js',
            'js/texte.js',
            'js/jslib/sqlite-parser.js',
            /* 'js/convertion_sql_en_rev.js', */
            'js/jslib/acorn.js',
            'js/jslib/php-parser.js'
        ),
    'module_a_inclure' => array(
            /**/
            'js/module_html.js',
            'js/mf_astjs_vers_rev1.js',
            'js/mf_astphpparseur_vers_rev1.js',
            'js/mf_rev_vers_js1.js',
            'js/mf_rev_vers_php1.js',
            'js/mf_rev_vers_sql1.js',
            'js/mf_astphpnikic_vers_rev1.js',
            'js/mf_astsqliteparseur_vers_rev1.js',
            'js/mf_rev_vers_html1.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$nom_bref='aa_js_sql_cible_' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . '.js';
$nom_complet=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'sql/' . $nom_bref;

if(is_file($nom_complet)){

    $o1 .= '<script type="text/javascript">' . PHP_EOL . file_get_contents($nom_complet) . '</script>';

}

$o1 .= html_footer1($par);
print($o1);
$o1='';