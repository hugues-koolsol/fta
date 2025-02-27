<?php
/*
  =====================================================================================================================
  Une page commence toujours par la définition de la page courante
  =====================================================================================================================
*/
define("BNF",basename(__FILE__));
/*
  =====================================================================================================================
  Puis l'inclusion des fonctions communes et initialisation des session(true) et de la bdd(true)
  =====================================================================================================================
*/
require_once('aa_include.php');
initialiser_les_services( /*session*/ true, /*bdd*/ false);
/*===================================================================================================================*/
function supprimerLesValeursDeSession(){

    unset($_SESSION[APP_KEY]);

}
/*
  =====================================================================================================================
  si on est en post ...
  =====================================================================================================================
*/

if(isset($_POST) && count($_POST) > 0){

    
    if(isset($_POST['nom_de_connexion']) && isset($_POST['mot_de_passe'])){

        initialiser_les_services( /*session*/ true, /*bdd*/ true);
        /*#
          ===========================================================================
          on importe la fonction sql 1 ( sql_inclure_reference(1)) qui recherche 
          l'utilisateur en base grâce à son nom de connexion
          le format rev de la requête est :
          ===========================================================================
          sélectionner(
           valeurs(
             champ(`T0` , `chi_id_utilisateur`) , 
             champ(`T0` , `chp_mot_de_passe_utilisateur`) , 
             champ(`T0` , `chp_parametres_utilisateur`)
           ),
           provenance(
            table_reference(
             source(nom_de_la_table(tbl_utilisateurs , alias(T0) , base(b1)))
            )
           ),
           conditions(egal(champ(`T0` , `chp_nom_de_connexion_utilisateur`) , :nom_de_connexion)),
           complements(limité_à(quantité(1) , début(0)))
          )          
          ===========================================================================
        */
        sql_inclure_reference(1);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_1.php');
        /* === ATTENTION === 
Le fichier des requêtes sql js est à regénérer et/ou à intégrer 
*/
        /*sql_inclure_fin*/
        
        $sql1=sql_1(array( 'nom_de_connexion' => $_POST['nom_de_connexion']));
        
        if($sql1[__xst] !== __xsu){

            /*si il y a une erreur dans la requête*/
            ajouterMessage(__xer,__LINE__ . ' ' . $sql1[__xme],BNF);
            supprimerLesValeursDeSession();
            recharger_la_page(BNF);

        }

        /*la requete a fonctionné */
        $mot_de_passe_en_base=isset($sql1[__xva][0])
           && isset($sql1[__xva][0]['T0.chp_mot_de_passe_utilisateur']) ? $sql1[__xva][0]['T0.chp_mot_de_passe_utilisateur'] : null;
        /* echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $mot_de_passe_en_base , true ) . '</pre>' ; exit(0);*/
        
        if(password_verify($_POST['mot_de_passe'],$mot_de_passe_en_base)){

            /*
              =============================================================================================
              ... soit nom_de_connexion et mot_de_passe sont bons
              et on met les données en session
              
            */
            $_SESSION[APP_KEY]['sess_id_utilisateur']=$sql1[__xva][0]['T0.chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_utilisateur_init']=$sql1[__xva][0]['T0.chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_premiere_cle_chiffrement']=base64_encode(openssl_random_pseudo_bytes(16));
            $_SESSION[APP_KEY]['sess_deuxième_cle_chiffrement']=base64_encode(texte_aleatoire(rand(1,2) * 10 + 20));
            $_SESSION[APP_KEY]['__filtres']=array();
            $_SESSION[APP_KEY]['sess_travaux_en_arriere_plan']=array();
            $_SESSION[APP_KEY]['__parametres_utilisateurs']=$sql1[__xva][0]['T0.chp_parametres_utilisateur'] !== '' ? json_decode($sql1[__xva][0]['T0.chp_parametres_utilisateur'],true) : array();
            ajouterMessage(__xsu,__LINE__ . ' connexion effectuée avec succes :-)');
            recharger_la_page('index.php');

        }else{

            /*
              =============================================================================================
              ... sinon on efface la session et on recharge la page
              
            */
            supprimerLesValeursDeSession();
            ajouterMessage(__xer,__LINE__ . ' la combinaison de l\'identifiant et du mot de passe est inconnue',BNF);
            /*on fait patienter l'utilisateur pendant deux secondes pour qu'il réfléchisse ! */
            sleep(2);
            recharger_la_page(BNF . '?raz1');
        }


    }else if(isset($_POST['logout'])){

        supprimerLesValeursDeSession();
        recharger_la_page(BNF);
    }


}

/*
  =====================================================================================================================
  si on appel cette page en GET avec une [a]ction=logout,
  on sort et on redirige sur cette page
  =====================================================================================================================
*/

if(isset($_GET) && count($_GET) > 0){

    
    if(isset($_GET['a']) && $_GET['a'] == 'logout'){

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

if(isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur']){

    /*
      =============================================================================================================
      ... si oui on lui affiche un formulaire de DEconnexion
      =============================================================================================================
    */
    ?>
    <!--  formulaire html en dehors du php  -->
    <form id="boite_de_connexion" method="post" style="margin-top:50px;">
        <input type="hidden" name="logout" id="logout" value="" />
        <button type="submit" style="margin:0 auto;">cliquez ici pour vous déconnecter</button>
    </form>
<?php

}else{

    /*
      =============================================================================================================
      ... sinon on lui affiche un formulaire de connexion
      =============================================================================================================
    */
    ?>
    <!--  formulaire html en dehors du php  -->
    <form id="boite_de_connexion" method="post" onsubmit="return verifier_formulaire_avant_envoi()" style="margin-top:50px;">
        <div>
            <div style="margin: auto;width: 10%;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="19 4  130 142">
                    <path d=" M 73 80 A 34 35 48 1 1 92 60 l 46 46 l 0 21 l -22 0 l 0 -12 l -11 0 l 0 -11 l -11 0 l 0 -11 l -8 0 l -13 -13 " stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform="" style="stroke:red;fill:gold;stroke-width:4;"></path>
                    <circle cx="51" cy="38" r="8" stroke="rgb(0, 0, 0)" stroke-width="4" fill="transparent" transform="" style="stroke:red;fill:black;stroke-width:4;"></circle>
                </svg>
            </div>Veuillez indiquer votre nom de connexion et votre mot de passe
        </div>
        <hr />
        <label for="nom_de_connexion">nom de connexion</label>
        <input type="text" name="nom_de_connexion" id="nom_de_connexion" value="" />
        <label for="mot_de_passe">mot de passe</label>
        <input type="password" name="mot_de_passe" id="mot_de_passe" value="" />
        <button class="yyinfo" type="submit" style="margin:1em auto;">cliquez ici pour vous connecter</button>
        <marquee scrollamount="6">Essayez
            <span style="color:red;background:white;">admin/admin</span>, si vous ne l'avez pas deviné. C'est encore un environnement de test :-)
        </marquee>
    </form>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>
"use strict";
/*
  normalement j'évite de mettre du js dans du php mais pour l'exemple, je le fais ici
  car le js ci dessous est passe par l'étape rev 
*/
function verifier_formulaire_avant_envoi(){
    __gi1.raz_des_messages();
    var retour=false;
    var zone_nom_de_connexion=document.getElementById( 'nom_de_connexion' );
    var zone_mot_de_passe=document.getElementById( 'mot_de_passe' );
    try{
        if(zone_mot_de_passe.value == '' || zone_nom_de_connexion.value == ''){
            retour=false;
            const d=new Date();
            let minutes=d.getMinutes();
            let secondes=d.getSeconds();
            let heures=d.getHours();
            minutes=heures + ':' + (minutes < 10 ? ( '0' + minutes ) : ( '' + minutes )) + ':' + (secondes < 10 ? ( '0' + secondes ) : ( '' + secondes )) + ' ';
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : minutes + 'Veuillez indiquer votre nom de connexion et votre mot de passe.'} );
            __gi1.remplir_et_afficher_les_messages1( '' );
        }else{
            retour=true;
        }
    }catch(e){
        alert( 'Il y a eu un problème :-(' );
    }
    return retour;
}
var myURL=window.location.href;
if(myURL.indexOf( '?raz1' ) >= 0 || myURL.indexOf( '&raz1' ) >= 0){
    setTimeout( function(){
            document.getElementById( 'nom_de_connexion' ).value='';
            document.getElementById( 'mot_de_passe' ).value='';
            document.getElementById( 'nom_de_connexion' ).focus();
        } , 700 );
}
//</source_javascript_rev>
//]]>
</script>

<?php
}

$js_a_executer_apres_chargement=array( array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array( 'js_a_inclure' => array(), 'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1 .= html_footer1($par);
print($o1);
$o1='';