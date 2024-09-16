<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true);
/* sess,bdd*/
require_once('../fta_inc/db/acces_bdd_sources1.php');
require_once('../fta_inc/db/acces_bdd_dossiers1.php');

if(!(isset($_SESSION[APP_KEY]['cible_courante']))){

    ajouterMessage('info',__LINE__.' : veuillez sélectionner une cible avant d\'accéder aux sources');
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
        ajouterMessage('erreur',__LINE__.' : le nom source doit etre indiqué et ne doit pas contenir les caractères espaces ',BNF);
        $uneErreur=true;

    }


    if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'],0,1) === ' '){

        ajouterMessage('erreur',__LINE__.' : le nom source ne doit pas commencer par un espace ',BNF);
        $uneErreur=true;

    }

    return($uneErreur);

}
/*
  
  =====================================================================================================================
*/
/*
  
  =====================================================================================================================
  =====================================================================================================================
  ============================================= POST =================================================================
  =====================================================================================================================
  =====================================================================================================================
*/

if((isset($_POST)) && (sizeof($_POST) >= 1)){

    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/
    $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']=((isset($_POST['chi_id_source']))?decrypter($_POST['chi_id_source']):'');
    $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']=$_POST['chp_nom_source']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_type_source']=$_POST['chp_type_source']??'normal';
    $_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']=$_POST['chx_cible_id_source']??$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'];
    $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']=$_POST['chp_commentaire_source']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']=$_POST['chp_rev_source']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']=$_POST['chp_genere_source']??'';
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);
    $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']=((isset($_POST['chx_dossier_id_source']))?($_POST['chx_dossier_id_source']===''?NULL:decrypter($_POST['chx_dossier_id_source'])):'');
    if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']===''){
     $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']=NULL;
    }
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);

    if(isset($_POST['__importer_le_fichier_source_de_fta'])){

        /*
          
          =====================================================================================================
          ============================================= IMPORTER LE SOURCE DE FTA ============================================
          =====================================================================================================
        */

        if(($_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] === 'fta') && ($_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] !== 'fta')){

            $__valeurs=recupere_une_donnees_des_sources_avec_parents($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);
            $nom_complet_du_source_dans_fta='../../fta'.$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];

            if(is_file($nom_complet_du_source_dans_fta)){

                $nomCompletSource='../../'.$__valeurs['T2.chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];

                if(copy($nom_complet_du_source_dans_fta,$nomCompletSource)){

                    ajouterMessage('succes',__LINE__.' : le fichier a bien été importé ');

                }else{

                    ajouterMessage('erreur',__LINE__.' : il y a eu une erreur lors de la copie du fichier ');
                }


            }else{

                ajouterMessage('erreur',__LINE__.' : le fichier n\'existe pas dans fta ');
            }


        }else{

            ajouterMessage('erreur',__LINE__.' : on ne peut pas faire de copie sur cet environnement ');
        }

        recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
        /*   $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']   */

    }else if(isset($_POST['__convertir_sql_sqlite_en_rev'])){

        /*
          
          =====================================================================================================
          ============================================= CONVERTIR UN SQL EN REV ==============================================
          =====================================================================================================
        */

        if($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'] !== ''){

            require_once('../fta_inc/phplib/sqlite.php');
            $ret=produire_un_tableau_de_la_structure_d_une_bdd_grace_a_un_source_de_structure($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']);

            if($ret['status'] === true){

                $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$ret['value'];

            }


        }else{

            ajouterMessage('erreur',__LINE__.' : il n\'y a rien à convertir ');
        }

        recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

    }else if(isset($_POST['__ecrire_sur_disque'])){

        /*
          
          =====================================================================================================
          ============================================= ECRIRE SUR DISQUE ====================================================
          =====================================================================================================
        */
        /*     echo __LINE__ . '$_POST=<pre>' . var_export($_POST,true) . '</pre>'; exit();*/
        $__valeurs=recupere_une_donnees_des_sources_avec_parents($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);
        /*     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);*/

        if(($__valeurs['T2.chp_dossier_cible'] !== null) && ($__valeurs['T1.chp_nom_dossier'] !== null)){

            $nomCompletSource='../../'.$__valeurs['T2.chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'];

            if(is_file($nomCompletSource)){


                if(!(sauvegarder_et_supprimer_fichier($nomCompletSource))){

                    ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer le fichier du disque ',BNF);
                    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

                }


            }

            /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nomCompletSource , true ) . '</pre>' ; exit(0);*/

            if($fd=fopen($nomCompletSource,'w')){

                /*       echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'] , true ) . '</pre>' ; exit(0);*/
                $ret=fwrite($fd,$_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']);

                if($ret !== false){

                    fclose($fd);
                    ajouterMessage('succes',__LINE__.' : Le généré a bien été écrit sur le disque');

                }else{

                    ajouterMessage('erreur',__LINE__.' : il y a eu un problème lors de l\'écriture ');
                }


            }else{

                ajouterMessage('erreur',__LINE__.' : il y a eu un problème lors de l\'ouverture du fichier ');
            }


        }else{

            ajouterMessage('erreur',__LINE__.' : problème sur le dossier cible ');
        }

        recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

    }else if((isset($_POST['__action'])) && ($_POST['__action'] == '__modification')){

        /*
          
          =====================================================================================================
          ============================================= MODIFICATION =========================================================
          =====================================================================================================
        */
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/

        if(erreur_dans_champs_saisis_sources()){

            /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/

            if((isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'])) && (is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_source']))){

                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

            }else{

                ajouterMessage('erreur',__LINE__.' : POST __id1 = '.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
                recharger_la_page('zz_sources_l1.php');
            }


        }

        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/

        if($_SESSION[APP_KEY][NAV][BNF]['verification'][0] != $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']){

            /*   ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'] );*/
            /*   recharger_la_page('zz_sources_l1.php');   */

        }

        $le_fichier_est_renomme=false;
        $__valeurs=recupere_une_donnees_des_sources_avec_parents($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);
        $nom_complet_de_l_ancien_fichier='../../'.$__valeurs['T2.chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);*/

        if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] === NULL){


        }else{

            $nouveau_dossier=recupere_une_donnees_des_dossiers_avec_parents($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);
            /*      echo __FILE__ . ' ' . __LINE__ . ' $nouveau_dossier = <pre>' . var_export( $nouveau_dossier , true ) . '</pre>' ; exit(0);*/
            $nom_complet_du_nouveau_fichier='../../'.$nouveau_dossier['T1.chp_dossier_cible'].$nouveau_dossier['T0.chp_nom_dossier'].'/'.$_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'];
            /*  echo __FILE__ . ' ' . __LINE__ . ' $nom_complet_de_l_ancien_fichier = <pre>' . var_export( $nom_complet_de_l_ancien_fichier , true ) . '</pre>, $nom_complet_du_nouveau_fichier<pre>' . var_export( $nom_complet_du_nouveau_fichier , true ) . '</pre>' ; exit(0);*/

            if($nom_complet_du_nouveau_fichier !== $nom_complet_de_l_ancien_fichier){

                /*
                  
                  si on renomme le fichier, il faut aussi le déplacer sur disque s'il existe
                */

                if(is_file($nom_complet_du_nouveau_fichier)){

                    /* si le fichier existe déjà sur le disque */
                    ajouterMessage('erreur',__LINE__.' :  ce fichier existe déjà sur disque');
                    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

                }

                /*         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);*/
                @rename($nom_complet_de_l_ancien_fichier,$nom_complet_du_nouveau_fichier);
                /*
                  
                  si pour une raison inconnue, on n'arrive pas à rennomer le fichier
                */
                $le_fichier_est_renomme=true;
                /*     echo __FILE__ . ' ' . __LINE__ . ' $nom_complet_de_l_ancien_fichier = <pre>' . var_export( $nom_complet_de_l_ancien_fichier , true ) . '</pre>' ; exit(0);*/

            }

            /*      echo __FILE__ . ' ' . __LINE__ . ' $nom_complet_du_nouveau_fichier = <pre>' . var_export( $nom_complet_du_nouveau_fichier , true ) . '</pre>' ; exit(0);*/
        }

        $sql='
   UPDATE `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_sources` SET 
      `chp_nom_source`         = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']).'\'
    , `chp_type_source`        = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_type_source']).'\'
    , `chx_dossier_id_source`  = '.sq0(($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']===NULL?'NULL':$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'])).'
    , `chx_cible_id_source`    = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']).'\'
    , `chp_commentaire_source` = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']).'\'
    , `chp_rev_source`         = \''.sq1($_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']).'\'  
    , `chp_genere_source`      = \''.sq1($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']).'\'
    
    
    WHERE 
      `chi_id_source`          = '.sq0($_SESSION[APP_KEY][NAV][BNF]['chi_id_source']).'
  ';
//        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($sql) , true ) . '</pre>' ; exit(0);*/
        error_reporting(0);

        if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($sql)){


            if($le_fichier_est_renomme){

                /*
                  
                  si on a précédemment renommé le fichier sur disque,
                  on recrée l'ancien non en espérant qu'un autre utilisateur ne l'a pas renommé entre-temps
                */

                if(!(@rename($nom_complet_du_nouveau_fichier,$nom_complet_de_l_ancien_fichier))){

                    ajouterMessage('erreur',__LINE__.' :  ATTENTION, le nom du fichier original sur disque n\'a pas pu $etre rétablit');

                }


            }

            /*    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);*/
            error_reporting(E_ALL);

            if($GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() === 19){

                ajouterMessage('erreur',__LINE__.' ce nom existe déjà en bdd ',BNF);
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

            }else{

                /*     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() , true ) . '</pre>' ; exit(0);*/
                ajouterMessage('erreur',__LINE__.' '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),BNF);
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
            }


        }else{

            /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes() , true ) . '</pre>' ; exit(0);*/
            error_reporting(E_ALL);

            if($GLOBALS[BDD][BDD_1][LIEN_BDD]->changes() === 1){

                /*    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes() , true ) . '</pre>' ; exit(0);*/
                ajouterMessage('info',' les modifications ont été enregistrées à '.substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2),BNF);
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

            }else{


                if($le_fichier_est_renomme){

                    /*
                      
                      si on a précédemment renommé le fichier sur disque,
                      on recrée l'ancien non en espérant qu'un autre utilisateur ne l'a pas renommé entre-temps
                    */

                    if(!(@rename($nom_complet_du_nouveau_fichier,$nom_complet_de_l_ancien_fichier))){

                        ajouterMessage('erreur',__LINE__.' :  ATTENTION, le nom du fichier original sur disque n\'a pas pu $etre rétablit');

                    }


                }

                ajouterMessage('erreur',__LINE__.' : '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),BNF);
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
            }

        }


    }else if((isset($_POST['__action'])) && ($_POST['__action'] == '__confirme_suppression')){

        /*
          
          =====================================================================================================
          ============================================= CONFIRMATION DE LA SUPPRESSION ======================================
          =====================================================================================================
        */
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'] , true ) . '</pre>' ; exit(0);*/
        /*
          
          http://localhost/functToArray/fta/fta_www/zz_sources_a1.php?__id=2&__action=__suppression
        */
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);*/

        if($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'] !== false){

            $__valeurs=recupere_une_donnees_des_sources_avec_parents($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);

            if((APP_KEY !== 'fta') && ($__valeurs['T2.chp_dossier_cible'] === 'fta')){

                /*
                  
                  si on est dans l'environnement ftx ( APP_KEY !== 'fta' ) 
                  et que le dossier cible est fta ( $__valeurs['T2.chp_dossier_cible'] === 'fta' )
                  on ne doit pas effacer ce fichier car il appartient à fta et il n'y a que fta
                  qui peut gérer les fichiers de fta
                */
                /*             echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);*/

            }else{

                /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);*/
                $nom_complet_de_l_ancien_fichier='../../'.$__valeurs['T2.chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];

                if(is_file($nom_complet_de_l_ancien_fichier)){


                    if(!(sauvegarder_et_supprimer_fichier($nom_complet_de_l_ancien_fichier))){

                        ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer le fichier du disque ',BNF);
                        recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

                    }


                }

            }


        }else{

            ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer cet enregistrement ',BNF);
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);
        }

        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);*/
        /*  $nom_fichier_disque=*/
        $GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle('PRAGMA foreign_keys=ON');
        $sql='DELETE FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_revs WHERE `chx_source_rev` = '.sq0($_SESSION[APP_KEY][NAV][BNF]['chi_id_source']).' ';
        /*  echo __FILE__ . ' ' . __LINE__ . ' $sql = <pre>' .  $sql  . '</pre>' ; exit(0);*/

        if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($sql)){

            ajouterMessage('erreur',__LINE__.' : '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),BNF);
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }else{

            $sql='DELETE FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_sources WHERE `chi_id_source` = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chi_id_source']).'\' ';

            if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($sql)){

                ajouterMessage('erreur',__LINE__.' : '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),BNF);
                recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

            }else{

                ajouterMessage('info','384 l\'enregistrement a été supprimé à '.substr($GLOBALS['__date'],11));
                recharger_la_page('zz_sources_l1.php');
                /* ?chp_nom_dossier='.rawurlencode($__valeurs['T1.chp_nom_dossier'])*/
            }

        }


    }else if((isset($_POST['__action'])) && ($_POST['__action'] == '__creation')){

        /*
          
          =====================================================================================================
          ============================================= CREATION ============================================================
          =====================================================================================================
        */

        if(erreur_dans_champs_saisis_sources()){

            recharger_la_page(BNF.'?__action=__creation');

        }

          
//        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] , true ) . '</pre>' ; exit(0);
        
        $sql='
   INSERT INTO `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.`tbl_sources` (`chp_nom_source` , chx_dossier_id_source , chx_cible_id_source, `chp_commentaire_source`, `chp_rev_source` , chp_genere_source , chp_type_source  ) VALUES
     (
        \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']).'\'
      , '.sq0(($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']===NULL?'NULL':$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'])).'
      , '.sq0($_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']).'
      , \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']).'\'
      , \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']).'\'
      , \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']).'\'      
      , \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_type_source']).'\'
     )
  ';
//        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
        $val_erreur=error_reporting(0);

        if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($sql)){

            /* */
            /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0); */
            ajouterMessage('erreur',__LINE__.' : '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),BNF);
            recharger_la_page(BNF.'?__action=__creation');

        }else{

            /*      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0); */
            ajouterMessage('info',__LINE__.' : l\'enregistrement ('.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastInsertRowID().') a bien été créé',BNF);
            recharger_la_page(BNF.'?__action=__modification&__id='.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastInsertRowID());
        }

        error_reporting($val_erreur);

    }else{

        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SERVER['REQUEST_URI'] , true ) . '</pre>' ; exit(0);*/
        unset($_SESSION[APP_KEY][NAV][BNF]);
        $__message=' cas à étudier '.((isset($_POST['__action']))?' : "'.$_POST['__action'].'" ':' ').substr($GLOBALS['__date'],11);
        ajouterMessage('avertissement',__LINE__.$__message,BNF);
        recharger_la_page($_SERVER['REQUEST_URI']);
    }

    /*
      
      on ne devrait pas arriver là car on a normalement capturé tous les cas
    */

    if(isset($_SESSION[APP_KEY][NAV][BNF])){

        unset($_SESSION[APP_KEY][NAV][BNF]);

    }

    ajouterMessage('info',__LINE__.' cas à étudier '.substr($GLOBALS['__date'],11));
    recharger_la_page('zz_sources_l1.php');

}

/*
  
  =====================================================================================================================
  =====================================================================================================================
  ============================================= GET ==================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
$__id='0';

if((isset($_GET['__action'])) && ($_GET['__action'] == '__suppression')){

    $__id=((isset($_GET['__id']))?((is_numeric($_GET['__id']))?$_GET['__id']:0):0);
    /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);*/

    if(($__id === 0) || ($__id === '0')){

        ajouterMessage('erreur',__LINE__.' il y a eu un problème ');
        recharger_la_page('zz_sources_l1.php');

    }else{

        $__valeurs=recupere_une_donnees_des_sources($__id,$GLOBALS[BDD][BDD_1][LIEN_BDD]);
    }


}


if((isset($_GET['__action'])) && ($_GET['__action'] == '__modification')){

    $__id=((isset($_GET['__id']))?((is_numeric($_GET['__id']))?$_GET['__id']:0):0);

    if($__id === '0'){

        recharger_la_page('zz_sources_l1.php');

    }else{

        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( is_numeric($__id) , true ) . '</pre>' ; exit(0);*/
        $__valeurs=recupere_une_donnees_des_sources_avec_parents($__id,$GLOBALS[BDD][BDD_1][LIEN_BDD]);

        if(!(isset($__valeurs['T0.chi_id_source']))){

            recharger_la_page('zz_sources_l1.php');

        }

    }


}

/*
  
  =====================================================================================================================
  ==== entete de la page =====================================================
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'sources', 'description' => 'sources'));
print($o1);
$o1='';
/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . htmlentities(var_export( $_SESSION , true )) . '</pre>' ; exit(0);*/
$o1.='<h1>gestion de source (dossier '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].')'.bouton_retour_a_la_liste('zz_sources_l1.php').'</h1>';

if((isset($_GET['__action'])) && ($_GET['__action'] == '__suppression')){

    /*
      
      =============================================================================================================
      ==== __suppression =========================================================
      =============================================================================================================
    */
    /*
      
      http://localhost/functToArray/fta/fta_www/zz_sources_a1.php?__id=2&__action=__suppression
    */
    $_SESSION[APP_KEY][NAV][BNF]['verification']=array( $__id);
    $o1.=' <form method="post" class="yyformDelete">'.CRLF;
    $o1.='   veuillez confirmer le suppression de  : '.CRLF;
    $o1.='   <br /><br /><b>'.'('.$__valeurs['T0.chi_id_source'].')  nom : '.$__valeurs['T0.chp_nom_source'].' <br /> '.'</b><br />'.CRLF;
    $o1.='   <input type="hidden" value="'.encrypter($__id).'" name="chi_id_source" id="chi_id_source" />'.CRLF;
    $o1.='   <input type="hidden" value="__confirme_suppression" name="__action" id="__action" />'.CRLF;
    $o1.='   <button type="submit" class="yydanger">Je confirme la suppression</button>'.CRLF;
    $o1.=''.CRLF;
    $o1.=' </form>'.CRLF;

}else if((isset($_GET['__action'])) && ($_GET['__action'] == '__creation')){

    /*
      
      =============================================================================================================
      ==== __creation ============================================================
      =============================================================================================================
    */
    $o1.='<h2>ajouter un source</h2>'.CRLF;
    $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.CRLF;
    $chp_nom_source=((isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']))?$_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']:'');
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_source).'" name="chp_nom_source" id="chp_nom_source" maxlength="64" style="max-width:64em;" />'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $chp_type_source=((isset($_SESSION[APP_KEY][NAV][BNF]['chp_type_source']))?$_SESSION[APP_KEY][NAV][BNF]['chp_type_source']:'normal');
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1"><div style="word-break:break-word;">type</div></div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_type_source).'" name="chp_type_source" id="chp_type_source" maxlength="32" style="max-width:32em;" />'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $chx_dossier_id_source=((isset($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']))?$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']:'');
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <input type="text" value="'.encrypter($chx_dossier_id_source).'" name="chx_dossier_id_source" id="chx_dossier_id_source" style="max-width:9em;" />'.CRLF;
    $__parametres_pour_la_modale=array(
        '__fonction' => 'recupérer_un_element_parent_en_bdd',
        '__url' => 'zz_dossiers_c1.php',
        '__nom_champ_dans_parent' => 'chx_dossier_id_source',
        '__champs_texte_a_rapatrier' => array( 'T0.chp_nom_dossier' => array( '__libelle_avant' => 'rattaché à "<b style="color:red;">', '__libelle_apres' => '</b>"', '__libelle_si_vide' => 'source non rattaché à un dossier')));
    $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
    $paramUrl=str_replace('\\','\\\\',$paramUrl);
    $paramUrl=str_replace('\'','\\\'',$paramUrl);
    $paramUrl=str_replace('"','\\"',$paramUrl);
    $paramUrl=rawurlencode($paramUrl);
    $o1.='   <a href="javascript:afficherModale1(\''.enti1($paramUrl).'\')" title="selectionner">📁</a>'.CRLF;
    $o1.='   <a class="yyavertissement" href="javascript:annuler_champ(\''.enti1($paramUrl).'\')" title="annuler">🚫</a>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    /*
      
      
      $chp_rev_source =isset($_SESSION[APP_KEY][NAV][BNF]['chp_rev_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']:'';
      $o1.=' <div class="yyfdiv1">'.CRLF;
      $o1.='  <div class="yyflab1"><div style="word-break:break-word;">rev</div></div>'.CRLF;
      $o1.='  <div class="yyfinp1"><div>'.CRLF;
      $o1.='   <textarea  name="chp_rev_source" id="chp_rev_source"  rows="15" >'.htmlentities($chp_rev_source,ENT_COMPAT).'</textarea>'.CRLF;
      $o1.='  </div></div>'.CRLF;
      $o1.=' </div>'.CRLF;
      
      
      $chp_genere_source =isset($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']:'';
      $o1.=' <div class="yyfdiv1">'.CRLF;
      $o1.='  <div class="yyflab1"><div style="word-break:break-word;">généré</div></div>'.CRLF;
      $o1.='  <div class="yyfinp1"><div>'.CRLF;
      $o1.='   <textarea  name="chp_genere_source" id="chp_genere_source"  rows="15" >'.htmlentities($chp_genere_source,ENT_COMPAT).'</textarea>'.CRLF;
      $o1.='  </div></div>'.CRLF;
      $o1.=' </div>'.CRLF;
      
    */
    $chp_commentaire_source=((isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']))?$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']:'');
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <textarea  name="chp_commentaire_source" id="chp_commentaire_source"  rows="15" >'.htmlentities($chp_commentaire_source,ENT_COMPAT).'</textarea>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <button type="submit">enregistrer</button>'.CRLF;
    $o1.='   <input type="hidden" value="0" name="__id1" id="__id1" />'.CRLF;
    $o1.='   <input type="hidden" value="__creation" name="__action" id="__action" />'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.='</form>'.CRLF;

}else if((isset($_GET['__action'])) && ($_GET['__action'] == '__modification')){

    /*
      
      =============================================================================================================
      ==== __modification ============================================================
      =============================================================================================================
    */
    /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);*/
    $o1.='<h2>modifier un source</h2>'.CRLF;
    $_SESSION[APP_KEY][NAV][BNF]['verification']=array( $__id);
    $__valeurs['T0.chp_nom_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']??$__valeurs['T0.chp_nom_source'];
    $__valeurs['T0.chp_type_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_type_source']??$__valeurs['T0.chp_type_source'];
    $__valeurs['T0.chx_dossier_id_source']=$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']??$__valeurs['T0.chx_dossier_id_source'];
    $__valeurs['T0.chx_cible_id_source']=$_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']??$__valeurs['T0.chx_cible_id_source'];
    $__valeurs['T0.chp_commentaire_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']??$__valeurs['T0.chp_commentaire_source'];
    $__valeurs['T0.chp_rev_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']??$__valeurs['T0.chp_rev_source'];
    $__valeurs['T0.chp_genere_source']=$_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']??$__valeurs['T0.chp_genere_source'];
    $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;
    $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
    $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_source" id="chi_id_source" />'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1">'.CRLF;
    $o1.='   <div style="word-break:break-word;">id, nom , dossier</div>'.CRLF;
    $o1.='  </div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <span>'.$__id.'</span>'.CRLF;
    $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_nom_source']).'" name="chp_nom_source" id="chp_nom_source" maxlength="64" style="width:100%;max-width:20em;" />'.CRLF;
    $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_type_source']).'" name="chp_type_source" id="chp_type_source" maxlength="64" style="width:100%;max-width:8em;" />'.CRLF;
    $o1.='   <input  type="hidden" value="'.encrypter($__valeurs['T0.chx_dossier_id_source']).'" name="chx_dossier_id_source" id="chx_dossier_id_source" style="max-width:3em;"/>'.CRLF;
    $__parametres_pour_la_modale=array(
        '__fonction' => 'recupérer_un_element_parent_en_bdd',
        '__url' => 'zz_dossiers_c1.php',
        '__nom_champ_dans_parent' => 'chx_dossier_id_source',
        '__champs_texte_a_rapatrier' => array( 'T0.chp_nom_dossier' => array( '__libelle_avant' => 'rattaché à "<b style="color:red;">', '__libelle_apres' => '</b>"', '__libelle_si_vide' => 'source non rattaché à un dossier')));
    $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
    $paramUrl=str_replace('\\','\\\\',$paramUrl);
    $paramUrl=str_replace('\'','\\\'',$paramUrl);
    $paramUrl=str_replace('"','\\"',$paramUrl);
    $paramUrl=rawurlencode($paramUrl);
    $o1.='   <a href="javascript:afficherModale1(\''.enti1($paramUrl).'\')" title="selectionner">📁</a>'.CRLF;
    $o1.='   <a class="yyavertissement" href="javascript:annuler_champ(\''.enti1($paramUrl).'\')" title="annuler">🚫</a>'.CRLF;

    if(($__valeurs['T0.chx_dossier_id_source'] === '') || ($__valeurs['T0.chx_dossier_id_source'] === false)){

        $o1.='<span id="T0.chp_nom_dossier">source non rattaché à un dossier</span> '.CRLF;

    }else{

        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);*/
        $o1.='<span id="T0.chp_nom_dossier">rattaché à "<b style="color:red;">'.$__valeurs['T1.chp_nom_dossier'].'</b>" </span>'.CRLF;
    }

    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1">'.CRLF;
    $o1.='   <div style="word-break:break-word;">outils sur rev</div>'.CRLF;
    $o1.='  </div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <a href="javascript:parentheses(&quot;chp_rev_source&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>'.CRLF;
    $o1.='   <a href="javascript:__gi1.formatter_le_source_rev(&quot;chp_rev_source&quot;);" title="formatter le source rev">(😊)</a>'.CRLF;
    $o1.='   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;chp_rev_source&quot;);" title="formatter le source rev">#()(😊)</a>'.CRLF;
    $o1.='   <a class="yysucces" href="javascript:__gi1.aller_a_la_position(&quot;chp_rev_source&quot;)">aller à la position</a>'.CRLF;
    $o1.='   <a class="yyinfo" href="javascript:__gi1.remplacer_la_selection_par(&quot;chp_rev_source&quot;)">remplacer la sélection</a>'.CRLF;
    $o1.='   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_rev_source&quot;);" title="agrandir la zone">🖐</a>'.CRLF;
    $o1.='   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_rev_source&quot;);" title="réduire la zone">👊</a>'.CRLF;
    
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1">'.CRLF;
    $o1.='   <div style="word-break:break-word;">rev</div>'.CRLF;
    $o1.='  </div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <textarea  name="chp_rev_source" id="chp_rev_source"  rows="15" spellcheck="false" >'.htmlentities($__valeurs['T0.chp_rev_source'],ENT_COMPAT).'</textarea>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1">'.CRLF;
    $o1.='   <div style="word-break:break-word;">outils de convertion</div>'.CRLF;
    $o1.='  </div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   &nbsp; &nbsp; &nbsp;'.CRLF;

    if($__valeurs['T0.chp_type_source'] === 'module_js'){


        if(strpos($__valeurs['T0.chp_nom_source'],'.js') !== false){

            $o1.='   <a class="yyinfo" href="javascript:convertir_rev_en_js(\'chp_rev_source\',\'chp_genere_source\','.$__id.','.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].')">R-&gt;J&#8615;</a>'.CRLF;
            $o1.='   <a class="yyavertissement" href="javascript:convertir_js_en_rev(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;,&quot;module&quot;)">&#8613;J-&gt;R</a>'.CRLF;

        }


    }else if($__valeurs['T0.chp_type_source'] === 'normal'){


        if(strpos($__valeurs['T0.chp_nom_source'],'.js') !== false){

            $o1.='   <a class="yyinfo" href="javascript:convertir_rev_en_js(\'chp_rev_source\',\'chp_genere_source\','.$__id.','.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].')">R-&gt;J&#8615;</a>'.CRLF;
            $o1.='   <a class="yyavertissement" href="javascript:convertir_js_en_rev(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;,&quot;script&quot;)">&#8613;J-&gt;R</a>'.CRLF;

        }else if(strpos($__valeurs['T0.chp_nom_source'],'.htm') !== false){

            $o1.='   <a class="yyinfo" href="javascript:convertir_rev_en_html(\'chp_rev_source\',\'chp_genere_source\','.$__id.','.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].')">R2H&#8615;</a>'.CRLF;
            $o1.='   <a class="yyavertissement" href="javascript:convertir_html_en_rev(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;)">&#8613;H2R</a>'.CRLF;

        }else if(strpos($__valeurs['T0.chp_nom_source'],'.php') !== false){

            $o1.='   <a class="yyinfo" href="javascript:convertir_rev_en_php_et_sauvegarde_rev(\'chp_rev_source\',\'chp_genere_source\','.$__id.','.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].')">R2P&#8615;</a>'.CRLF;
            $o1.='   <a class="yyavertissement" href="javascript:convertir_php_en_rev(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;)">&#8613;P2R</a>'.CRLF;

        }else if(strpos($__valeurs['T0.chp_nom_source'],'.sql') !== false){

            $o1.='   <a class="yyinfo" href="javascript:convertir_rev_en_sql(\'chp_rev_source\',\'chp_genere_source\','.$__id.','.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].')">&#8615; rev =&gt; sql &#8615;</a>'.CRLF;
            $o1.='   <a class="yyavertissement" href="javascript:convertir_sqlite_en_rev(\'chp_rev_source\',\'chp_genere_source\')">&#8613; sql =&gt; rev &#8613;</a>'.CRLF;
            /*       $o1.='   <button class="yyavertissement" name="__convertir_sql_sqlite_en_rev" id="__convertir_sql_sqlite_en_rev" ></button>'.CRLF;*/

        }else{

            $o1.='   <a class="yyinfo" href="javascript:convertir_rev_en_texte(\'chp_rev_source\',\'chp_genere_source\','.$__id.','.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].')">&#8615; rev =&gt; texte &#8615;</a>'.CRLF;
            $o1.='   <a class="yyavertissement" href="javascript:convertir_texte_en_rev(&quot;chp_genere_source&quot;,&quot;chp_rev_source&quot;)">&#8613; texte =&gt; rev &#8613;</a>'.CRLF;
        }


    }
    $o1.='   <a class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;chp_genere_source&quot;)">aller à la ligne n°</a>'.CRLF;
    $o1.='   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_genere_source&quot;);" title="agrandir la zone">🖐</a>'.CRLF;
    $o1.='   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_genere_source&quot;);" title="réduire la zone">👊</a>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1">'.CRLF;
    $o1.='   <div style="word-break:break-word;">genere</div>'.CRLF;
    $o1.='  </div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <textarea  name="chp_genere_source" id="chp_genere_source"  rows="15" spellcheck="false" >'.htmlentities($__valeurs['T0.chp_genere_source'],ENT_COMPAT).'</textarea>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1">'.CRLF;
    $o1.='   <div style="word-break:break-word;">outils de fichiers</div>'.CRLF;
    $o1.='  </div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <button id="__ecrire_sur_disque" name="__ecrire_sur_disque" class="yyinfo">ecrire le généré sur le disque</button>'.CRLF;

    if(($__valeurs['T2.chp_dossier_cible'] !== null) && ($__valeurs['T1.chp_nom_dossier'] !== null)){

        $nomCompletSource='../../'.$__valeurs['T2.chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];
        /*   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nomCompletSource , true ) . '</pre>' ; exit(0);*/

        if(is_file($nomCompletSource)){


            if(($__valeurs['T0.chp_type_source'] === 'normal') || ($__valeurs['T0.chp_type_source'] === 'module_js')){

                $o1.='   <a href="javascript:lire_un_fichier_du_disque(&quot;'.encrypter(enti1($nomCompletSource)).'&quot;)" class="yyavertissement">lire du disque</a>'.CRLF;
                $o1.='   <a class="yydanger" href="javascript:supprimer_un_fichier_du_disque(&quot;'.encrypter(enti1($nomCompletSource)).'&quot;)" class="yyavertissement">supprimer du disque</a>'.CRLF;

            }


        }else{

            $o1.='   <span>le fichier est absent du disque</span>'.CRLF;
        }


        if(($_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] === 'fta') && ($_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] !== 'fta')){

            $nom_complet_du_source_dans_fta='../../fta'.$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_source'];

            if(is_file($nom_complet_du_source_dans_fta)){

                $o1.='   <button name="__importer_le_fichier_source_de_fta" class="yyinfo">importer le fichier source de fta</button>'.CRLF;

            }else{

                $o1.='   ce fichier n\'a pas de correspondant dans fta'.CRLF;
            }


        }


    }

    $o1.='   '.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.=' <div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyflab1">'.CRLF;
    $o1.='   <div style="word-break:break-word;">commentaire</div>'.CRLF;
    $o1.='   <div style="font-weight: normal;">texte libre</div>'.CRLF;
    $o1.='  </div>'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <textarea  name="chp_commentaire_source" id="chp_commentaire_source"  rows="5" >'.htmlentities($__valeurs['T0.chp_commentaire_source'],ENT_COMPAT).'</textarea>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.=' </div>'.CRLF;
    $o1.='<div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.='</div>'.CRLF;
    $o1.='</form>'.CRLF;
    $js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => 'chp_rev_source');

    if((isset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'])) && (count($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']) > 0)){

        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'] , true ) . '</pre>' ; */
        $js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'traite_le_tableau_de_la_base_sqlite_v2', 'parametre' => array( 'donnees' => $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'], 'zone_rev' => 'chp_rev_source'));
        unset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']);

    }


}else{


    if(isset($_GET['__action'])){

        $o1.=$_GET['__action'].'<br />';

    }

    $o1.='pas d\'action prévue';
}

/*
  
  =====================================================================================================================
  =====================================================================================================================
*/
$js_a_executer_apres_chargement[]=array( 'nomDeLaFonctionAappeler' => 'neRienFaire', 'parametre' => array( 'c\'est pour', 'l\'exemple'));
$par=array( 'js_a_inclure' => array(
            'js/javascript',
            'js/html',
            'js/php',
            'js/convertit-php-en-rev0.js',
            'js/pour_zz_source1.js',
            'js/pour_zz_bdds_action1.js',
            'js/sql.js',
            'js/convertit-js-en-rev1.js',
            'js/javascript.js',
            'js/texte.js',
            'js/jslib/sqlite_parser_from_demo.js',
            'js/convertion_sql_en_rev.js'), 'module_a_inclure' => array( 'js/module_html.js'), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);
$o1='';
?>