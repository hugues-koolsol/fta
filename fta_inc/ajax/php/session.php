<?php
/*
  =====================================================================================================================
  met en session un nombre de lignes à afficher par page
*/

function definir_le_nombre_de_lignes_a_afficher_pour_une_liste(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export($data[__entree],true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);} 
      'nom_de_la_page' => 'zz_bdds_l1.php',
      'nombre_de_lignes' => 50,
    */
    $_SESSION[APP_KEY]['__parametres_utilisateurs'][$data[__entree]['nom_de_la_page']]['nombre_de_lignes']=$data[__entree]['nombre_de_lignes'];
    $data[__xst]=__xsu;

}
/*
  =====================================================================================================================
*/

function recuperer_les_travaux_en_arriere_plan_de_la_session(&$data){

    $data[__xst]=__xsu;
    $data[__xva]=array( 'sess_travaux_en_arriere_plan' => array(), '__aa_js_sql' => array());
    $nom_bref='aa_php_sql_cible_' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . '.php';
    $nom_complet=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'sql' . DIRECTORY_SEPARATOR . $nom_bref;

    if(is_file($nom_complet)){

        require_once($nom_complet);
        $data[__xva]['__aa_js_sql']=$__aa_php_sql;

    }


    if(isset($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'])){

        $data[__xva]['sess_travaux_en_arriere_plan']=$_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'];

    }


}
/*
  =====================================================================================================================
*/

function supprimer_un_travail_en_arriere_plan_en_session(&$data){

    $data['nombre_de_travaux_restants_debut']=0;

    if(isset($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'])){

        $data['nombre_de_travaux_restants_debut']=count($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']);

        if(count($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']) > 0){

            foreach($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'] as $k1 => $v1){
                $travail_supprime=$v1;
                unset($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'][$k1]);
                $data['travail_en_arriere_plan_supprime']=$travail_supprime;
                break;
            }

            if(count($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']) === 0){

                unset($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']);

            }


        }


    }

    /* on calme le jeu pendant 100ms */
    usleep(100000);
    $data[__xst]=__xsu;
    $data['nombre_de_travaux_restants_fin']=isset($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']) ? count($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']) : 0;

}
/*
  =====================================================================================================================
*/

function enregistrer_un_travail_en_arriere_plan_en_session(&$data){

    /*
      if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export($data[__entree],true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);} 
    */

    if(!isset($_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'])){

        $_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']=array();

    }

    $_SESSION[APP_KEY]['sess_travaux_en_arriere_plan'][]=$data[__entree]['travail_en_arriere_plan'];
    /* on calme le jeu pendant 100ms */
    usleep(100000);
    $data[__xst]=__xsu;

}
/*
  =====================================================================================================================
*/