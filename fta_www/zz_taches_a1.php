<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ true);
$js_a_executer_apres_chargement=array();
/*
  =====================================================================================================================
*/
function erreur_dans_champs_saisis_taches(){

    $uneErreur=false;
    
    if($_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache'] === ''){

        ajouterMessage(__xer,__LINE__ . ' : le texte de la tâche ne doit pas être vide ',BNF);
        $uneErreur=true;

    }

    return $uneErreur;

}
/*
  =====================================================================================================================
  =====================================================================================================================
  ============================================= POST ==================================================================
  =====================================================================================================================
  =====================================================================================================================
*/

if(isset($_POST) && sizeof($_POST) >= 1){

    $_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache']=$_POST['chp_texte_tache']??'';
    $_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache']=$_POST['chp_priorite_tache']??'0';
    $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']=isset($_POST['chi_id_tache']) ? decrypter($_POST['chi_id_tache']) : '';
    verifie_id_envoye('chi_id_tache','zz_taches_l1.php',BNF,$_POST);
    
    if(isset($_POST['__action']) && $_POST['__action'] == '__modification'){

        /*
          =====================================================================================================
          ============================== MODIFICATION =========================================================
          =====================================================================================================
        */
        
        if(erreur_dans_champs_saisis_taches()){

            
            if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']) && is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_tache'])){

                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);

            }else{

                ajouterMessage(__xer,__LINE__ . ' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);
                recharger_la_page('zz_taches_l1.php');
            }


        }

        sql_inclure_reference(29);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_29.php');
        /*
        UPDATE b1.tbl_taches SET `chp_texte_tache` = :n_chp_texte_tache , `chp_priorite_tache` = :n_chp_priorite_tache
        WHERE (`chx_utilisateur_tache` = :c_chx_utilisateur_tache
          
         AND `chi_id_tache` = :c_chi_id_tache) ;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_29(array( 'c_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'], 'c_chi_id_tache' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache'], 'n_chp_texte_tache' => $_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache'], 'n_chp_priorite_tache' => $_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache']));
        
        if($tt[__xst] === __xer){

            ajouterMessage(__xer,__LINE__ . ' ' . $tt[__xme],BNF);
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);

        }else if($tt['changements'] === 1){

            
            if(isset($_POST['__enregistrer_les_modifications_et_retour'])){

                ajouterMessage(__xsu,' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11) . '.' . substr(microtime(),2,2));
                recharger_la_page('zz_taches_l1.php');

            }else{

                ajouterMessage(__xsu,' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11) . '.' . substr(microtime(),2,2),BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);
            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);
        }


    }else if(isset($_POST['__action']) && $_POST['__action'] == '__confirme_suppression'){

        /*
          =====================================================================================================
          =============================== CONFIRMATION DE LA SUPPRESSION ======================================
          =====================================================================================================
        */
        /*  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);*/
        $__id=isset($_POST['chi_id_tache']) ? decrypter($_POST['chi_id_tache']) : 0;
        
        if($__id !== false){

            sql_inclure_reference(31);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_31.php');
            /*
            DELETE FROM b1.tbl_taches
            WHERE (`chi_id_tache` = :chi_id_tache
              
             AND `chx_utilisateur_tache` = :chx_utilisateur_tache) ;

            */
            /*sql_inclure_fin*/
            
            $tt=sql_31(array( 'chi_id_tache' => $__id, 'chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init']));
            
            if($tt[__xst] === __xer){

                ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
                recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);

            }else{

                ajouterMessage(__xsu,'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11));
                recharger_la_page('zz_taches_l1.php');
            }


        }else{

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas supprimer cet enregistrement ',BNF);
            recharger_la_page(BNF . '?__action=__suppression&__id=' . $__id);
        }


    }else if(isset($_POST['__action']) && $_POST['__action'] == '__creation'){

        /*
          =====================================================================================================
          =============================== CREATION ============================================================
          =====================================================================================================
        */
        
        if(erreur_dans_champs_saisis_taches()){

            recharger_la_page(BNF . '?__action=__creation');

        }

        sql_inclure_reference(30);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_30.php');
        /*
        INSERT INTO b1.`tbl_taches`(
            `chx_utilisateur_tache` , 
            `chp_texte_tache` , 
            `chp_priorite_tache`
        ) VALUES (
            :chx_utilisateur_tache , 
            :chp_texte_tache , 
            :chp_priorite_tache
        );

        */
        /*sql_inclure_fin*/
        
        $tt=sql_30(array( array( 'chp_texte_tache' => $_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache'], 'chp_priorite_tache' => $_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache'], 'chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init'])));
        
        if($tt[__xst] === __xer){

            ajouterMessage(__xer,__LINE__ . ' : ' . $tt[__xme],BNF);
            recharger_la_page(BNF . '?__action=__creation');

        }else{

            
            if(isset($_POST['option']) && $_POST['option'] === 'enregistrer_et_revenir_a_la_liste'){

                ajouterMessage(__xsu,__LINE__ . ' : l\'enregistrement (' . $tt['nouvel_id'] . ') a bien été créé');
                recharger_la_page('zz_taches_l1.php');

            }else{

                ajouterMessage(__xsu,__LINE__ . ' : l\'enregistrement (' . $tt['nouvel_id'] . ') a bien été créé',BNF);
                recharger_la_page(BNF . '?__action=__modification&__id=' . $tt['nouvel_id']);
            }

        }

    }

    /*
      on ne devrait pas arriver là car on a normalement capturé tous les cas
    */
    
    if(isset($_SESSION[APP_KEY][NAV][BNF])){

        unset($_SESSION[APP_KEY][NAV][BNF]);

    }

    ajouterMessage(__xsu,__LINE__ . ' cas à étudier ' . substr($GLOBALS['__date'],11));
    recharger_la_page('zz_taches_l1.php');

}

/*
  =====================================================================================================================
  =====================================================================================================================
  ============================================== GET ==================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
$__id=0;

if(isset($_GET['__action']) && ($_GET['__action'] == '__modification' || $_GET['__action'] == '__suppression')){

    $__id=isset($_GET['__id']) ? (is_numeric($_GET['__id']) ? (int)($_GET['__id']) : 0) : 0;
    
    if($__id === 0){

        ajouterMessage(__xer,__LINE__ . ' il y a eu un problème ');
        recharger_la_page('zz_taches_l1.php');

    }else{

        sql_inclure_reference(28);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_28.php');
        /*
        SELECT 
        `T0`.`chi_id_tache` , `T0`.`chx_utilisateur_tache` , `T0`.`chp_texte_tache` , `T0`.`chp_priorite_tache`
         FROM b1.tbl_taches T0
        WHERE (`T0`.`chi_id_tache` = :T0_chi_id_tache
          
         AND `T0`.`chx_utilisateur_tache` = :T0_chx_utilisateur_tache);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_28(array( 'T0_chi_id_tache' => $__id, 'T0_chx_utilisateur_tache' => $_SESSION[APP_KEY]['sess_id_utilisateur_init']));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            ajouterMessage(__xer,__LINE__ . ' on ne peut pas écrire la structure sur disque');
            recharger_la_page(BNF . '?__action=__modification&__id=' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

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
$o1=html_header1(array( 'title' => 'taches', 'description' => 'taches'));
print($o1);
$o1='';
$o1 .= '<h1>gestion de tache ' . bouton_retour_a_la_liste('zz_taches_l1.php') . '</h1>';

if(isset($_GET['__action']) && $_GET['__action'] == '__suppression'){

    /*
      =============================================================================================================
      ===================================== __suppression =========================================================
      =============================================================================================================
    */
    $o1 .= ' <form method="post" class="yyformDelete">' . PHP_EOL;
    $o1 .= '   veuillez confirmer le suppression de  : ' . PHP_EOL;
    $o1 .= '   <br /><br /><b>' . '(' . $__valeurs['T0.chi_id_tache'] . ')  nom : ' . enti1($__valeurs['T0.chp_texte_tache']) . '    <br /> ' . '</b><br />' . PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_tache']=sha1($__valeur_encriptee);
    $o1 .= '   <input type="hidden" value="' . $__valeur_encriptee . '" name="chi_id_tache" id="chi_id_tache" />' . PHP_EOL;
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
    $o1 .= '<h2>ajouter une tâche</h2>' . PHP_EOL;
    $o1 .= '<form method="post"  enctype="multipart/form-data" class="form1">' . PHP_EOL;
    $chp_texte_tache=isset($_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache'] : '';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <textarea rows="20"  cols="20" autofocus="autofocus" name="chp_texte_tache" id="chp_texte_tache" autocorrect="off" autocapitalize="off" spellcheck="false">' . enti1($chp_texte_tache) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $chp_priorite_tache=isset($_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache']) ? $_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache'] : '0';
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1"><div style="word-break:break-word;">priorité</div></div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <input type="text" value="' . enti1($chp_priorite_tache) . '" name="chp_priorite_tache" id="chp_priorite_tache" maxlength="4" style="max-width:4em;" />' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <button type="submit">enregistrer</button>' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="0" name="__id1" id="__id1" />' . PHP_EOL;
    $o1 .= '   <input type="hidden" value="__creation" name="__action" id="__action" />' . PHP_EOL;
    $o1 .= '   <button type="submit" name="option" value="enregistrer_et_revenir_a_la_liste">enregistrer et revenir à la liste</button>' . PHP_EOL;
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
    $o1 .= '<h2>modifier une tâche</h2>' . PHP_EOL;
    $__valeurs['T0.chp_texte_tache']=$_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache']??$__valeurs['T0.chp_texte_tache'];
    $__valeurs['T0.chp_priorite_tache']=$_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache']??$__valeurs['T0.chp_priorite_tache'];
    $o1 .= '<form method="post" enctype="multipart/form-data">' . PHP_EOL;
    $o1 .= ' <input type="hidden" value="__modification" name="__action" id="__action" />' . PHP_EOL;
    $__valeur_encriptee=encrypter($__id);
    $_SESSION[APP_KEY][NAV][BNF]['sha1']['chi_id_tache']=sha1($__valeur_encriptee);
    $o1 .= ' <input type="hidden" value="' . $__valeur_encriptee . '" name="chi_id_tache" id="chi_id_tache" />' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">id, priorité</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <span>' . $__id . '</span>' . PHP_EOL;
    $o1 .= '   <input  type="text" value="' . enti1($__valeurs['T0.chp_priorite_tache']) . '" name="chp_priorite_tache" id="chp_priorite_tache" maxlength="4" style="width:100%;max-width:4em;" />' . PHP_EOL;
    $o1 .= '   <a href="javascript:document.getElementById(\'chp_priorite_tache\').value=99;">99</a>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= ' <div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyflab1">' . PHP_EOL;
    $o1 .= '   <div style="word-break:break-word;">tâche</div>' . PHP_EOL;
    $o1 .= '  </div>' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <span>' . $__id . '</span>' . PHP_EOL;
    $o1 .= '   <textarea rows="20"  cols="20" name="chp_texte_tache" id="chp_texte_tache" style="width:80%;max-width:80%;" autocorrect="off" autocapitalize="off" spellcheck="false">' . enti1($__valeurs['T0.chp_texte_tache']) . '</textarea>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= ' </div>' . PHP_EOL;
    $o1 .= '<div class="yyfdiv1">' . PHP_EOL;
    $o1 .= '  <div class="yyfinp1"><div>' . PHP_EOL;
    $o1 .= '   <button class="yyinfo" type="submit" name="__enregistrer_les_modifications" class="">enregistrer les modifications</button>' . PHP_EOL;
    $o1 .= '   <button class="yyinfo" type="submit" name="__enregistrer_les_modifications_et_retour" class="">enregistrer les modifications et retour</button>' . PHP_EOL;
    $o1 .= '   <a class="yydanger" href="?__action=__suppression&__id=' . $__id . '">supprimer</a>' . PHP_EOL;
    $o1 .= '  </div></div>' . PHP_EOL;
    $o1 .= '</div>' . PHP_EOL;
    $o1 .= '</form>' . PHP_EOL;

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
$par=array( 'js_a_inclure' => array( ''), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1 .= html_footer1($par);
print($o1);
$o1='';