<?php
/*
  ================================================================
  Une page commence toujours par la définition de la page courante
  ================================================================
*/
define("BNF",basename(__FILE__));
/*
  ================================================================
  Puis l'inclusion des fonctions communes
  ================================================================
*/
require_once('aa_include.php');
session_start();
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
/*===================================================================================================================*/
/*echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( random_string(rand(1,2)*10+20) , true ) . '</pre>' ; exit(0);*/
/*
  =====================
  si on est en post ...
  =====================
*/

if((isset($_POST) && count($_POST) > 0)){


    if((isset($_POST['nom_de_connexion']) && isset($_POST['mot_de_passe']))){

        $db=new SQLite3('../fta_inc/db/sqlite/system.db');
        $req='
         SELECT chi_id_utilisateur, chp_mot_de_passe_utilisateur  
         FROM tbl_utilisateurs 
         WHERE chp_nom_de_connexion_utilisateur=\''.sq0($_POST['nom_de_connexion']).'\'
         LIMIT 1 OFFSET 0
        ';
        $stmt=$db->prepare($req);

        if(($stmt !== false)){

            $result=$stmt->execute();
            $data=array();
            $arr=$result->fetchArray(SQLITE3_ASSOC);
            while(($arr !== false)){
                /* echo __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export[ $arr , true ] . '</pre>' ;*/
                $data=$arr;
                $arr=$result->fetchArray(SQLITE3_ASSOC);
            }
            $stmt->close();


        }else{

            ajouterMessage('erreur',__LINE__.' '.$db->lastErrorMsg(),BNF);
            supprimerLesValeursDeSession();
            recharger_la_page(BNF);
        }


        if((count($data) === 2 && password_verify($_POST['mot_de_passe'],$data['chp_mot_de_passe_utilisateur']))){

            /*  =============================*/
            /*  ... soit nom_de_connexion et mot_de_passe sont bons*/
            /*  et on met les données en session*/
            $_SESSION[APP_KEY]['sess_id_utilisateur']=$data['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_utilisateur_init']=$data['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_premiere_cle_chiffrement']=base64_encode(openssl_random_pseudo_bytes(16));
            $_SESSION[APP_KEY]['sess_deuxième_cle_chiffrement']=base64_encode(texte_aleatoire(rand(1,2)*(10)+20));
            $_SESSION[APP_KEY]['__filtres']=array();
            $_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']=array();
            
            ajouterMessage('info',__LINE__.' connexion effectuée avec succes :-)');
            recharger_la_page('index.php');

        }else{

            supprimerLesValeursDeSession();
            ajouterMessage('erreur',__LINE__.' identifiant ou mot de passe incorrectes',BNF);
            sleep(2);
            recharger_la_page(BNF.'?raz1');
        }


    }else if((isset($_POST['logout']))){

        supprimerLesValeursDeSession();

    }

    recharger_la_page(BNF);

}

/*
  =======================================================
  si on appel cette page en GET avec une [a]ction=logout,
  on sort et on redirige sur cette page
  =======================================================
*/

if((isset($_GET) && count($_GET) > 0)){


    if((isset($_GET['a']) && $_GET['a'] == 'logout')){

        supprimerLesValeursDeSession();
        recharger_la_page(BNF);

    }


}

/*
  ======================================================== 
  affichage de l'html 
  ========================================================
*/
$o1='';
$a=array( 'title' => 'login', 'description' => 'login');
$o1=html_header1($a);
/*
  ========================================================
  on imprime le l'entête ...
*/
print($o1);
/*
  ... puis on le reinitialise,
*/
$o1='';
/*
  ======================================================== 
  l'utilisateur est-il déjà connecté ? ...
  ======================================================== 
*/

if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){

    /*
      ======================================================== 
      ... si oui on lui affiche un formulaire de DEconnexion
      ======================================================== 
    */
?>
    
    <form id="boite_de_connexion" method="post">
        <input type="hidden" name="logout" id="logout" value="" />
        <button type="submit">cliquez ici pour vous déconnecter</button>
    </form>
<?php

}else{

    /*
      ======================================================== 
      ... sinon on lui affiche un formulaire de connexion
      ======================================================== 
    */?>
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
        <button type="submit">cliquez ici pour vous connecter</button>
    </form>

<script type="text/javascript">
//<![CDATA[
// = = = = <source javascript = = = =
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
// = = = = source javascript> = = = =
//]]>

</script>
<?php
}

/*
  ========================
  on imprime le formulaire
  ========================
*/
$o1.=html_footer1();
print($o1);
/*..., puis on le reinitialise */
$o1=' ';
