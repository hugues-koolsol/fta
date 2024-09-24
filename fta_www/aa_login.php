<?php
/*
  =====================================================================================================================
  Une page commence toujours par la définition de la page courante
  =====================================================================================================================
*/
define("BNF",basename(__FILE__));
/*
  =====================================================================================================================
  Puis l'inclusion des fonctions communes et initialisation des session et de la bdd
  =====================================================================================================================
*/
require_once('aa_include.php');
initialiser_les_services(true,true);
/*===================================================================================================================*/

function supprimerLesValeursDeSession(){

    unset($_SESSION[APP_KEY]);

}
/*===================================================================================================================*/

function texte_aleatoire($length){

    $str=random_bytes($length);
    $str=base64_encode($str);
    $str=str_replace(array( "+", "/", "="),"",$str);
    $str=substr($str,0,$length);
    return($str);

}
/*   importer_fonction_requete(1),*/
/*
  =====================================================================================================================
  recherche en base de l'utilisateur grâce à son nom de connexion
*/
sql_inclure_reference(1);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH.'/sql/sql_1.php');
/*
SELECT 
`T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`
 FROM b1.tbl_utilisateurs T0
WHERE `T0`.`chp_nom_de_connexion_utilisateur` = :nom_de_connexion
LIMIT 1 OFFSET 0 ;
*/
/*sql_inclure_fin*/

/*
  =====================================================================================================================
  si on est en post ...
  =====================================================================================================================
*/

if((isset($_POST)) && (count($_POST) > 0)){


    if((isset($_POST['nom_de_connexion'])) && (isset($_POST['mot_de_passe']))){

        $sql1=sql_1(array( 'nom_de_connexion' => $_POST['nom_de_connexion']));

        if($sql1['statut'] !== true){

            ajouterMessage('erreur',__LINE__.' '.$sql1['message'],BNF);
            supprimerLesValeursDeSession();
            recharger_la_page(BNF);

        }


        if((count($sql1['valeur']) === 1) && (count($sql1['valeur'][0]) === 3) && (password_verify($_POST['mot_de_passe'],$sql1['valeur'][0]['chp_mot_de_passe_utilisateur']))){

            /*
              =============================================================================================
              ... soit nom_de_connexion et mot_de_passe sont bons
              et on met les données en session
              
            */
            $_SESSION[APP_KEY]['sess_id_utilisateur']=$sql1['valeur'][0]['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_utilisateur_init']=$sql1['valeur'][0]['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_premiere_cle_chiffrement']=base64_encode(openssl_random_pseudo_bytes(16));
            $_SESSION[APP_KEY]['sess_deuxième_cle_chiffrement']=base64_encode(texte_aleatoire(rand(1,2)*10+20));
            $_SESSION[APP_KEY]['__filtres']=array();
            $_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']=array();
            $_SESSION[APP_KEY]['__parametres_utilisateurs']=(($sql1['valeur'][0]['chp_parametres_utilisateur'] !== '')?json_decode($sql1['valeur'][0]['chp_parametres_utilisateur'],true):array());
            ajouterMessage('info',__LINE__.' connexion effectuée avec succes :-)');
            recharger_la_page('index.php');

        }else{

            supprimerLesValeursDeSession();
            ajouterMessage('erreur',__LINE__.' identifiant ou mot de passe incorrectes',BNF);
            sleep(2);
            recharger_la_page(BNF.'?raz1');
        }


    }else if(isset($_POST['logout'])){

        supprimerLesValeursDeSession();

    }

    recharger_la_page(BNF);

}

/*
  =====================================================================================================================
  si on appel cette page en GET avec une [a]ction=logout,
  on sort et on redirige sur cette page
  =====================================================================================================================
*/

if((isset($_GET)) && (count($_GET) > 0)){


    if((isset($_GET['a'])) && ($_GET['a'] == 'logout')){

        supprimerLesValeursDeSession();
        recharger_la_page(BNF);

    }


}

/*
  =====================================================================================================================
  affichage de l'html 
  =====================================================================================================================
*/
$o1='';
$a=array( 'title' => 'login', 'description' => 'login');
$o1=html_header1($a);
/*
  =====================================================================================================================
  on imprime le l'entête ...
*/
print($o1);
/*
  ... puis on le reinitialise,
*/
$o1='';
/*
  =====================================================================================================================
  l'utilisateur est-il déjà connecté ? ...
  =====================================================================================================================
*/

if((isset($_SESSION[APP_KEY]['sess_id_utilisateur'])) && (0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){

    /*
      =============================================================================================================
      ... si oui on lui affiche un formulaire de DEconnexion
      =============================================================================================================
    */?>    <!--  formulaire html en dehors du php  -->
    <form id="boite_de_connexion" method="post" style="margin-top:50px;">
        <input type="hidden" name="logout" id="logout" value="" />
        <button type="submit" style="margin:0 auto;">cliquez ici pour vous déconnecter</button>
    </form><?php

}else{

    /*
      =============================================================================================================
      ... sinon on lui affiche un formulaire de connexion
      =============================================================================================================
    */?>    <!--  formulaire html en dehors du php  -->
    <form id="boite_de_connexion" method="post" onsubmit="return checkSubmit1()" style="margin-top:50px;">
        <div>
            Veuillez indiquer votre nom de connexion et votre mot de passe
        </div>
        <hr />
        <label for="nom_de_connexion">
            nom de connexion
        </label>
        <input type="text" name="nom_de_connexion" id="nom_de_connexion" value="" />
        <label for="mot_de_passe">
            mot de passe
        </label>
        <input type="password" name="mot_de_passe" id="mot_de_passe" value="" />
        <button class="yyinfo" type="submit" style="margin:1em auto;">cliquez ici pour vous connecter</button>
        <marquee scrollamount="6">
            Essayez
            <span style="color:red;background:white;">admin/admin</span>
            , si vous ne l'avez pas deviné. C'est encore un environnement de test :-)
        </marquee>
    </form>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>

    "use strict";
    function checkSubmit1(){
        clearMessages('zone_global_messages');
        var valRet=false;
        var zone_nom_de_connexion = document.getElementById('nom_de_connexion');
        var zone_mot_de_passe = document.getElementById('mot_de_passe');
        try{
            if((zone_mot_de_passe.value == '') || (zone_nom_de_connexion.value == '')){
                valRet=false;
                global_messages.errors.push('Veuillez indiquer votre nom de connexion et votre mot de passe.');
                displayMessages('zone_global_messages');
            }else{
                valRet=true;
            }
        }catch(e){
            alert('Il y a eu un problème :-(');
        }
        return valRet;
    }
    var myURL=window.location.href;
    if((myURL.indexOf('?raz1') >= 0) || (myURL.indexOf('&raz1') >= 0)){
        setTimeout(function(){
            document.getElementById('nom_de_connexion').value='';
            document.getElementById('mot_de_passe').value='';
            document.getElementById('nom_de_connexion').focus();
        },700);
    }
//</source_javascript_rev>
//]]>
</script>
<?php
}