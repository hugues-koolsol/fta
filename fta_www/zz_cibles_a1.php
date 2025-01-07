<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,true);
/* sess,bdd*/

function recupere_une_donnees_des_cibles($id){

    sql_inclure_reference(34);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_34.php');
    /*
      SELECT `T0`.`chi_id_cible` , `T0`.`chp_nom_cible` , `T0`.`chp_dossier_cible` , `T0`.`chp_commentaire_cible` 
      FROM b1.tbl_cibles T0 
      WHERE `T0`.`chi_id_cible` = :T0_chi_id_cible;
      
    */
    /*sql_inclure_fin*/
    $tt=sql_34(array( 'T0_chi_id_cible' => $id));

    if(($tt[__xst] === false) || (count($tt[__xva]) !== 1)){

        return(false);

    }

    $__valeurs=$tt[__xva][0];
    return($__valeurs);

}
/*
  =====================================================================================================================
*/

if((APP_KEY === 'fta') && (isset($_POST['__copier_les_fichiers_de_base_dans_ftb'])) && ($_POST['__copier_les_fichiers_de_base_dans_ftb'] === 'ftb')){

    include('zz_cibles_i1.php');

}

/*
  =====================================================================================================================
*/

function erreur_dans_champs_saisis_cibles(){

    $uneErreur=false;

    if($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'] === '1'){


    }else{


        if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'] === ''){

            /*
              // A=65 , a=97 z=122 , 0=48 , 9=57
              // todo ajouter le test
            */
            $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|';
            ajouterMessage('erreur',__LINE__.' : le nom cible doit etre indiqué et ne doit pas contenir les caractères espaces ',BNF);
            $uneErreur=true;

        }


        if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'],0,1) === ' '){

            ajouterMessage('erreur',__LINE__.' : le nom cible ne doit pas commencer par un espace ',BNF);
            $uneErreur=true;

        }


        if($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'] === ''){

            /*
              // A=65 , a=97 z=122 , 0=48 , 9=57
              // todo ajouter le test
            */
            $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|';
            ajouterMessage('erreur',__LINE__.' : le nom cible doit etre indiqué et ne doit pas contenir les caractères espaces ',BNF);
            $uneErreur=true;

        }


        if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'],0,1) === ' '){

            ajouterMessage('erreur',__LINE__.' : le nom cible ne doit pas commencer par un espace ',BNF);
            $uneErreur=true;

        }

    }

    return($uneErreur);

}
/*
  =====================================================================================================================
  =====================================================================================================================
  ============================================= POST =================================================================
  =====================================================================================================================
  =====================================================================================================================
*/

if((isset($_POST)) && (sizeof($_POST) >= 1)){

    $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']=$_POST['chp_nom_cible']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible']=$_POST['chp_dossier_cible']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']=$_POST['chp_commentaire_cible']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']=(isset($_POST['chi_id_cible']) ? decrypter($_POST['chi_id_cible']) : '');
    verifie_id_envoye('chi_id_cible','zz_cibles_l1.php',BNF,$_POST);
    /*
      =============================================================================================================
      ============================================= MODIFICATION ==================================================
      =============================================================================================================
    */

    if((isset($_POST['__action'])) && ($_POST['__action'] == '__modification')){


        if(erreur_dans_champs_saisis_cibles()){


            if((isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'])) && (is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']))){

                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);

            }else{

                ajouterMessage('erreur',__LINE__.' : POST __id1 = '.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);
                recharger_la_page('zz_cibles_l1.php');
            }


        }


        if($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'] === '1'){

            sql_inclure_reference(47);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_47.php');
            /* UPDATE b1.tbl_cibles SET `chp_commentaire_cible` = :n_chp_commentaire_cible WHERE `chi_id_cible` = 1 ; */
            /*sql_inclure_fin*/
            $tt=sql_47(array( 'n_chp_commentaire_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']));

        }else{

            sql_inclure_reference(48);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_48.php');
            /*
              UPDATE b1.tbl_cibles SET 
              `chp_nom_cible` = :n_chp_nom_cible , 
              `chp_dossier_cible` = :n_chp_dossier_cible , 
              `chp_commentaire_cible` = :n_chp_commentaire_cible
              WHERE (`chi_id_cible` = :c_chi_id_cible) ;
            */
            /*sql_inclure_fin*/
            $tt=sql_48(array(
                /**/
                'n_chp_nom_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'],
                'n_chp_dossier_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'],
                'n_chp_commentaire_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible'],
                'c_chi_id_cible' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']
            ));
        }


        if($tt[__xst] === false){

            ajouterMessage('erreur',__LINE__.' '.$tt[__xme],BNF);
            recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);

        }else{


            if($tt['changements'] === 1){

                ajouterMessage('info',' les modifications ont été enregistrées à '.substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2),BNF);
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);

            }else{

                ajouterMessage('erreur',__LINE__.' erreur de mise à jour',BNF);
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);
            }

        }


    }else if((isset($_POST['__action'])) && ($_POST['__action'] == '__confirme_suppression')){

        /*
          =====================================================================================================
          =============================== CONFIRMATION DE LA SUPPRESSION DE CIBLE =============================
          =====================================================================================================
        */
        $__id=(isset($_POST['__id1']) ? (is_numeric($_POST['__id1']) ? $_POST['__id1'] : 0) : 0);
        $__valeurs=recupere_une_donnees_des_cibles($__id);

        if($__valeurs === false){

            ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer cet enregistrement ',BNF);
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }


        if(($__valeurs['T0.chp_nom_cible'] === 'fta') && ($__valeurs['T0.chp_dossier_cible'] === 'fta')){

            ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer "fta"');
            recharger_la_page('zz_cibles_l1.php');

        }

        sql_inclure_reference(38);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_38.php');
        /*
          
          BEGIN TRANSACTION
          
        */
        /*sql_inclure_fin*/
        $tt=sql_38(array());

        if($tt[__xst] === false){

            ajouterMessage('erreur',$tt[__xme],BNF);
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }

        /*
          =====================================================================================================
        */
        sql_inclure_reference(14);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_14.php');
        /*
          
          DELETE FROM b1.tbl_revs WHERE `chx_cible_rev` = :chx_cible_rev ;
          
        */
        /*sql_inclure_fin*/
        $tt=sql_14(array( 'chx_cible_rev' => $__id));

        if($tt[__xst] === false){

            ajouterMessage('erreur',$tt[__xme],BNF);
            sql_inclure_reference(40);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_40.php');
            /*
              
              ROLLBACK
              
            */
            /*sql_inclure_fin*/
            $tt=sql_40(array());
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }

        ajouterMessage('info',__LINE__.' : la suppression des rev a fonctionné');
        /*
          =====================================================================================================
        */
        sql_inclure_reference(41);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_41.php');
        /*
          
          DELETE FROM b1.tbl_sources WHERE `chx_cible_id_source` = :chx_cible_id_source ;    
        */
        /*sql_inclure_fin*/
        $tt=sql_41(array( 'chx_cible_id_source' => $__id));

        if($tt[__xst] === false){

            ajouterMessage('erreur',$tt[__xme],BNF);
            sql_inclure_reference(40);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_40.php');
            /*
              
              ROLLBACK
              
            */
            /*sql_inclure_fin*/
            $tt=sql_40(array());
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }

        ajouterMessage('info',__LINE__.' : la suppression des sources a fonctionné');
        /*
          =====================================================================================================
        */
        sql_inclure_reference(42);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_42.php');
        /*
          DELETE FROM b1.tbl_requetes WHERE (`chx_cible_requete` = :chx_cible_requete) ;    
        */
        /*sql_inclure_fin*/
        $tt=sql_42(array( 'chx_cible_requete' => $__id));

        if($tt[__xst] === false){

            ajouterMessage('erreur',$tt[__xme],BNF);
            sql_inclure_reference(40);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_40.php');
            /* ROLLBACK */
            /*sql_inclure_fin*/
            $tt=sql_40(array());
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }

        ajouterMessage('info',__LINE__.' : la suppression des requetes a fonctionné');
        /*
          =====================================================================================================
        */
        sql_inclure_reference(43);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_43.php');
        /*
          DELETE FROM b1.tbl_bdds WHERE (`chx_cible_id_basedd` = :chx_cible_id_basedd) ;
          /*sql_inclure_fin
        */
        $tt=sql_43(array( 'chx_cible_id_basedd' => $__id));

        if($tt[__xst] === false){

            ajouterMessage('erreur',$tt[__xme],BNF);
            sql_inclure_reference(40);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_40.php');
            /* ROLLBACK */
            /*sql_inclure_fin*/
            $tt=sql_40(array());
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }

        ajouterMessage('info',__LINE__.' : la suppression des bases a fonctionné');
        /*
          =====================================================================================================
        */
        sql_inclure_reference(44);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_44.php');
        /*
          DELETE FROM b1.tbl_dossiers WHERE (`chx_cible_dossier` = :chx_cible_dossier) ;
          /*sql_inclure_fin
        */
        $tt=sql_44(array( 'chx_cible_dossier' => $__id));

        if($tt[__xst] === false){

            ajouterMessage('erreur',$tt[__xme],BNF);
            sql_inclure_reference(40);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_40.php');
            /* ROLLBACK */
            /*sql_inclure_fin*/
            $tt=sql_40(array());
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }

        ajouterMessage('info',__LINE__.' : la suppression des dossiers a fonctionné');
        /*
          =====================================================================================================
        */
        sql_inclure_reference(45);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_45.php');
        /*
          DELETE FROM b1.tbl_cibles WHERE (`chi_id_cible` = :chi_id_cible) ;
          /*sql_inclure_fin
        */
        $tt=sql_45(array( 'chi_id_cible' => $__id));

        if($tt[__xst] === false){

            ajouterMessage('erreur',$tt[__xme],BNF);
            sql_inclure_reference(40);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_40.php');
            /* ROLLBACK */
            /*sql_inclure_fin*/
            $tt=sql_40(array());
            recharger_la_page(BNF.'?__action=__suppression&__id='.$__id);

        }

        ajouterMessage('info',__LINE__.' : la suppression de la cible a fonctionné');
        /*
          =====================================================================================================
        */
        sql_inclure_reference(46);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_46.php');
        /* COMMIT */
        /*sql_inclure_fin*/
        $tt=sql_46(array());
        recharger_la_page('zz_cibles_l1.php');
        /*
          =====================================================================================================
        */

    }else if((isset($_POST['__action'])) && ($_POST['__action'] == '__creation')){

        /*
          =====================================================================================================
          =============================== CREATION ============================================================
          =====================================================================================================
        */

        if(erreur_dans_champs_saisis_cibles()){

            recharger_la_page(BNF.'?__action=__creation');

        }


        if(($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'] === 'fta') && ($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'] === 'fta')){

            ajouterMessage('erreur',__LINE__.' : le projet fta est la racine et est déjà créé',BNF);
            recharger_la_page(BNF.'?__action=__creation');

        }

        sql_inclure_reference(36);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_36.php');
        /*
          
          INSERT INTO b1.`tbl_cibles`(
          `chp_nom_cible` , 
          `chp_dossier_cible` , 
          `chp_commentaire_cible`
          ) VALUES (
          :chp_nom_cible , 
          :chp_dossier_cible , 
          :chp_commentaire_cible
          );
        */
        /*sql_inclure_fin*/
        $tt=sql_36(array( array( 'chp_nom_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'], 'chp_dossier_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'], 'chp_commentaire_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible'])));

        if($tt[__xst] === false){

            ajouterMessage('erreur',__LINE__.' : '.$tt[__xme],BNF);
            recharger_la_page(BNF.'?__action=__creation');

        }else{

            /* création du dossier racine */
            sql_inclure_reference(37);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_37.php');
            /*
              INSERT INTO b1.`tbl_dossiers`(
              `chx_cible_dossier` , 
              `chp_nom_dossier`
              ) VALUES (
              :chx_cible_dossier , 
              :chp_nom_dossier
              );         
            */
            /*sql_inclure_fin*/
            $tt37=sql_37(array( array( 'chx_cible_dossier' => $tt['nouvel_id'], 'chp_nom_dossier' => '/')));

            if($tt37[__xst] === false){

                ajouterMessage('erreur',__LINE__.' : '.$tt37[__xme],BNF);
                recharger_la_page(BNF.'?__action=__creation');

            }else{

                $nom_du_dossier='../../'.$_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'];
                @mkdir($nom_du_dossier);
                ajouterMessage('info',__LINE__.' : l\'enregistrement ('.$tt['nouvel_id'].') a bien été créé',BNF);
                recharger_la_page(BNF.'?__action=__modification&__id='.$tt['nouvel_id']);
            }

        }


    }else if((isset($_POST['__action'])) && ($_POST['__action'] == '__creation_du_dossier')){

        /*
          =====================================================================================================
          =============================== CREATION D'UN DOSSIER ===============================================
          =====================================================================================================
        */

        if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'])){

            $__id=$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'];

            if(isset($_SESSION[APP_KEY][NAV][BNF])){

                unset($_SESSION[APP_KEY][NAV][BNF]);

            }


            if($__id !== 0){

                $__valeurs=recupere_une_donnees_des_cibles($__id);

                if($__valeurs !== false){

                    $__dossier='../../'.$__valeurs['T0.chp_dossier_cible'];

                    if(mkdir($__dossier)){

                        ajouterMessage('succes',__LINE__.' le dossier "'.$__dossier.'" a été créé avec succès !',BNF);

                    }else{

                        ajouterMessage('erreur',__LINE__.' il y a eu un problème lors de la création du dossier "'.$__dossier.'" ',BNF);
                    }


                }else{

                    ajouterMessage('avertissement',__LINE__.' il y a eu un problème',BNF);
                }


            }else{

                ajouterMessage('avertissement',__LINE__.' il y a eu un problème',BNF);
            }


        }else{

            unset($_SESSION[APP_KEY][NAV][BNF]);
            ajouterMessage('avertissement',__LINE__.' il y a eu un problème',BNF);
        }

        recharger_la_page($_SERVER['REQUEST_URI']);

    }else if((isset($_POST['__action'])) && ($_POST['__action'] == '__suppression_du_dossier')){

        /*
          =====================================================================================================
          =============================== SUPPRESSION D'UN DOSSIER ============================================
          =====================================================================================================
        */
        $__id=(int)($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);

        if(($__id !== 0) && ($__id !== 1)){

            $__valeurs=recupere_une_donnees_des_cibles($__id);

            if($__valeurs !== false){

                $__dossier='../../'.$__valeurs['T0.chp_dossier_cible'];

                if(is_dir($__dossier)){


                    if(le_dossier_est_vide($__dossier)){


                        if(rmdir($__dossier)){

                            ajouterMessage('succes',__LINE__.' le dossier "'.$__dossier.'" a été supprimé avec succès !',BNF);
                            unset($_SESSION[APP_KEY][NAV][BNF]);

                        }else{

                            ajouterMessage('avertissement',__LINE__.' il y a eu un problème',BNF);
                        }


                    }else{

                        ajouterMessage('avertissement',__LINE__.' le dossier contient des éléments ',BNF);
                    }


                }else{

                    ajouterMessage('avertissement',__LINE__.' le dossier est absent ',BNF);
                }


            }else{

                ajouterMessage('avertissement',__LINE__.' le dossier est absent ',BNF);
            }


        }else{

            ajouterMessage('avertissement',__LINE__.' il y a eu un problème',BNF);
        }

        recharger_la_page($_SERVER['REQUEST_URI']);

    }else{

        unset($_SESSION[APP_KEY][NAV][BNF]);
        $__message=' cas à étudier '.(isset($_POST['__action']) ? ' : "'.$_POST['__action'].'" ' : ' ').substr($GLOBALS['__date'],11);
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
    recharger_la_page('zz_cibles_l1.php');

}

/*
  =====================================================================================================================
  =====================================================================================================================
  ============================================== GET ==================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
$__id=0;

if((isset($_GET['__action'])) && (($_GET['__action'] === '__suppression') || ($_GET['__action'] === '__modification'))){

    $__id=(isset($_GET['__id']) ? (is_numeric($_GET['__id']) ? (int)($_GET['__id']) : 0) : 0);

    if(($__id === 1) && ($_GET['__action'] === '__suppression')){

        ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer la cible 1');
        recharger_la_page('zz_cibles_l1.php');

    }


    if($__id === 0){

        ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer ou modifier la cible 0');
        recharger_la_page('zz_cibles_l1.php');

    }else{

        $__valeurs=recupere_une_donnees_des_cibles($__id);

        if($__valeurs === false){

            ajouterMessage('erreur',__LINE__.' cible non trouvée');
            recharger_la_page('zz_cibles_l1.php');

        }

    }


}

/*
  =====================================================================================================================
  ============================================= entete de la page =====================================================
  =====================================================================================================================
*/
$o1='';
$o1=html_header1(array( 'title' => 'Cibles', 'description' => 'Cibles'));
print($o1);
$o1='';
$o1.='<h1>gestion de cible '.bouton_retour_a_la_liste('zz_cibles_l1.php').'</h1>';

if((isset($_GET['__action'])) && ($_GET['__action'] == '__suppression')){

    /*
      =============================================================================================================
      ===================================== __suppression =========================================================
      =============================================================================================================
    */
    /*
      http://localhost/functToArray/fta/fta_www/zz_cibles_a1.php?__id=2&__action=__suppression
    */
    $o1.=' <form method="post" class="yyformDelete">'.PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_cible']=sha1($__valeur_encriptee);
    $o1.='   <input type="hidden" value="'.$__valeur_encriptee.'" name="chi_id_cible" id="chi_id_cible" />'.PHP_EOL;
    $o1.='   veuillez confirmer le suppression de  : '.PHP_EOL;
    $o1.='   <br /><br /><b>'.'('.$__valeurs['T0.chi_id_cible'].') : nom : '.$__valeurs['T0.chp_nom_cible'].' , dossier : '.$__valeurs['T0.chp_dossier_cible'].'  <br /> '.'</b><br />'.PHP_EOL;
    $o1.='   <input type="hidden" value="'.$_GET['__id'].'" name="__id1" id="__id1" />'.PHP_EOL;
    $o1.='   <input type="hidden" value="__confirme_suppression" name="__action" id="__action" />'.PHP_EOL;
    $o1.='   <button type="submit" class="yydanger">Je confirme la suppression</button>'.PHP_EOL;
    $o1.=''.PHP_EOL;
    $o1.=' </form>'.PHP_EOL;

}else if((isset($_GET['__action'])) && ($_GET['__action'] == '__creation')){

    /*
      =============================================================================================================
      ===================================== __creation ============================================================
      =============================================================================================================
    */
    $o1.='<h2>ajouter une cible</h2>'.PHP_EOL;
    $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.PHP_EOL;
    $chp_nom_cible=(isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'] : '');
    $o1.=' <div class="yyfdiv1">'.PHP_EOL;
    $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.PHP_EOL;
    $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
    $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_cible).'" name="chp_nom_cible" id="chp_nom_cible" maxlength="3" style="max-width:3em;" />'.PHP_EOL;
    $o1.='  </div></div>'.PHP_EOL;
    $o1.=' </div>'.PHP_EOL;
    $chp_dossier_cible=(isset($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'] : '');
    $o1.=' <div class="yyfdiv1">'.PHP_EOL;
    $o1.='  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>'.PHP_EOL;
    $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
    $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_dossier_cible).'" name="chp_dossier_cible" id="chp_dossier_cible" maxlength="3" style="max-width:3em;" />'.PHP_EOL;
    $o1.='  </div></div>'.PHP_EOL;
    $o1.=' </div>'.PHP_EOL;
    $chp_commentaire_cible=(isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible'] : '');
    $o1.=' <div class="yyfdiv1">'.PHP_EOL;
    $o1.='  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>'.PHP_EOL;
    $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
    $o1.='   <textarea  name="chp_commentaire_cible" id="chp_commentaire_cible"  rows="15" >'.enti1($chp_commentaire_cible,ENT_COMPAT).'</textarea>'.PHP_EOL;
    $o1.='  </div></div>'.PHP_EOL;
    $o1.=' </div>'.PHP_EOL;
    $o1.=' <div class="yyfdiv1">'.PHP_EOL;
    $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
    $o1.='   <button type="submit">enregistrer</button>'.PHP_EOL;
    $o1.='   <input type="hidden" value="0" name="__id1" id="__id1" />'.PHP_EOL;
    $o1.='   <input type="hidden" value="__creation" name="__action" id="__action" />'.PHP_EOL;
    $o1.='  </div></div>'.PHP_EOL;
    $o1.=' </div>'.PHP_EOL;
    $o1.='</form>'.PHP_EOL;

}else if((isset($_GET['__action'])) && ($_GET['__action'] == '__modification')){

    /*
      =============================================================================================================
      ================================= __modification ============================================================
      =============================================================================================================
    */
    $o1.='<h2>modifier une cible</h2>'.PHP_EOL;
    $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']=$__id;
    $__valeurs['T0.chp_nom_cible']=$_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']??$__valeurs['T0.chp_nom_cible'];
    $__valeurs['T0.chp_dossier_cible']=$_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible']??$__valeurs['T0.chp_dossier_cible'];
    $__valeurs['T0.chp_commentaire_cible']=$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']??$__valeurs['T0.chp_commentaire_cible'];
    $o1.='<form method="post" enctype="multipart/form-data">'.PHP_EOL;
    $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_cible']=sha1($__valeur_encriptee);
    $o1.=' <input type="hidden" value="'.$__valeur_encriptee.'" name="chi_id_cible" id="chi_id_cible" />'.PHP_EOL;
    $o1.=' <div class="yyfdiv1">'.PHP_EOL;
    $o1.='  <div class="yyflab1">'.PHP_EOL;
    $o1.='   <div style="word-break:break-word;">id</div>'.PHP_EOL;
    $o1.='  </div>'.PHP_EOL;
    $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
    $o1.='   <span>'.$__id.'</span>'.PHP_EOL;
    $o1.='  </div></div>'.PHP_EOL;
    $o1.=' </div>'.PHP_EOL;

    if($__id != '1'){

        $o1.=' <div class="yyfdiv1">'.PHP_EOL;
        $o1.='  <div class="yyflab1">'.PHP_EOL;
        $o1.='   <div style="word-break:break-word;">nom</div>'.PHP_EOL;
        $o1.='  </div>'.PHP_EOL;
        $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
        $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_nom_cible']).'" name="chp_nom_cible" id="chp_nom_cible" maxlength="3" style="width:100%;max-width:3em;" />'.PHP_EOL;
        $o1.='   <span>3 caractères écrits en minuscules</span>'.PHP_EOL;
        $o1.='  </div></div>'.PHP_EOL;
        $o1.=' </div>'.PHP_EOL;
        $o1.=' <div class="yyfdiv1">'.PHP_EOL;
        $o1.='  <div class="yyflab1">'.PHP_EOL;
        $o1.='   <div style="word-break:break-word;">dossier</div>'.PHP_EOL;
        $o1.='  </div>'.PHP_EOL;
        $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
        $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_dossier_cible']).'" name="chp_dossier_cible" id="chp_dossier_cible" maxlength="3" style="width:100%;max-width:3em;" />'.PHP_EOL;
        $o1.='   <span>3 caractères écrits en minuscules</span>'.PHP_EOL;
        $o1.='  </div></div>'.PHP_EOL;
        $o1.=' </div>'.PHP_EOL;

    }

    $o1.=' <div class="yyfdiv1">'.PHP_EOL;
    $o1.='  <div class="yyflab1">'.PHP_EOL;
    $o1.='   <div style="word-break:break-word;">commentaire</div>'.PHP_EOL;
    $o1.='   <div style="font-weight: normal;">texte libre</div>'.PHP_EOL;
    $o1.='  </div>'.PHP_EOL;
    $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
    $o1.='   <textarea  name="chp_commentaire_cible" id="chp_commentaire_cible"  rows="15" >'.enti1($__valeurs['T0.chp_commentaire_cible'],ENT_COMPAT).'</textarea>'.PHP_EOL;
    $o1.='  </div></div>'.PHP_EOL;
    $o1.=' </div>'.PHP_EOL;
    $o1.='<div class="yyfdiv1">'.PHP_EOL;
    $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
    $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.PHP_EOL;
    $o1.='  </div></div>'.PHP_EOL;
    $o1.='</div>'.PHP_EOL;
    $o1.='</form>'.PHP_EOL;

    if((APP_KEY === 'fta') && (basename(dirname(__FILE__,2)) === 'fta') && ($__valeurs['T0.chp_nom_cible'] === 'fta') && ($__valeurs['T0.chp_dossier_cible'] === 'fta')){

        $o1.='<form method="post" enctype="multipart/form-data">'.PHP_EOL;
        $o1.='   <button name="__copier_les_fichiers_de_base_dans_ftb" value="ftb" class="">copier les fichiers de base dans ftb</button>'.PHP_EOL;
        $o1.='</form>'.PHP_EOL;

    }

    $dossier='../../'.$__valeurs['T0.chp_dossier_cible'];

    if(is_dir($dossier)){

        $o1.='le dossier existe '.PHP_EOL;

        if(le_dossier_est_vide($dossier)){

            $o1.='<br />le dossier '.$dossier.' est vide'.PHP_EOL;
            $o1.='<form method="post" enctype="multipart/form-data">'.PHP_EOL;
            $o1.=' <input type="hidden" value="__suppression_du_dossier" name="__action" id="__action" />'.PHP_EOL;
            $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_cible" id="chi_id_cible" />'.PHP_EOL;
            $o1.='<div class="yyfdiv1">'.PHP_EOL;
            $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
            $o1.='   <button type="submit" class="">supprimer le dossier</button>'.PHP_EOL;
            $o1.='  </div></div>'.PHP_EOL;
            $o1.='</div>'.PHP_EOL;
            $o1.='</form>'.PHP_EOL;

        }else{

            $o1.='<br />le dossier '.$dossier.' contient des fichiers ou des dossiers '.PHP_EOL;
        }


    }else{

        $o1.='le dossier '.$dossier.' n\'existe pas '.PHP_EOL;
        $o1.='<form method="post" enctype="multipart/form-data">'.PHP_EOL;
        $o1.=' <input type="hidden" value="__creation_du_dossier" name="__action" id="__action" />'.PHP_EOL;
        $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_cible" id="chi_id_cible" />'.PHP_EOL;
        $o1.='<div class="yyfdiv1">'.PHP_EOL;
        $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
        $o1.='   <button type="submit" class="">créer le dossier</button>'.PHP_EOL;
        $o1.='  </div></div>'.PHP_EOL;
        $o1.='</div>'.PHP_EOL;
        $o1.='</form>'.PHP_EOL;
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
$js_a_executer_apres_chargement=array(/**/
    array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple'))
);
$par=array(/**/
    'js_a_inclure' => array( ''),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1.=html_footer1($par);
print($o1);
$o1='';