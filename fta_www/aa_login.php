<?php
/*
  ================================================================
  Une page commence toujours par la définition de la page courante
  ================================================================
*/
define('BNF' , basename(__FILE__));
/*
  ================================================================
  Puis l'inclusion des fonctions communes
  ================================================================
*/
require_once('aa_include.php');
session_start();
/*
  =====================
  si on est en post ...
  =====================
*/
if((isset($_POST) && count($_POST) > 0)){
    start_session_messages();
    if((isset($_POST['nom_de_connexion']) && isset($_POST['mot_de_passe']))){
        $db=new SQLite3('../fta_inc/db/system.db');
        $req='
         SELECT chi_id_utilisateur, chp_mot_de_passe_utilisateur , chx_id_groupe_connexion_utilisateur 
         FROM tbl_utilisateurs 
         WHERE chp_nom_de_connexion_utilisateur=\''.addslashes($_POST['nom_de_connexion']).'\'
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
            $_SESSION[APP_KEY][MESSAGES]['errors'][]='ERROR 50 '.$db->lastErrorMsg();
            supprimerLesValeursDeSession();
            rechargerPageCourante(BNF);
        }
        if((count($data) === 3 && password_verify($_POST['mot_de_passe'],$data['chp_mot_de_passe_utilisateur']))){
            /*  =============================*/
            /*  ... soit nom_de_connexion et mot_de_passe sont bons*/
            /*  et on met les données en session*/
            $_SESSION[APP_KEY]['sess_id_utilisateur']=$data['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_utilisateur_init']=$data['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_groupe_utilisateur']=$data['chx_id_groupe_connexion_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_groupe_utilisateur_init']=$data['chx_id_groupe_connexion_utilisateur'];
            rechargerPageCourante('index.php');
        }else{
            supprimerLesValeursDeSession();
            $_SESSION[APP_KEY][MESSAGES]['errors'][]='erreur 47, identifiant ou mot de passe incorrectes';
            sleep(3);
            rechargerPageCourante(BNF.'?raz1');
        }
    }else if((isset($_POST['logout']))){
        supprimerLesValeursDeSession();
    }
    rechargerPageCourante(BNF);
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
        rechargerPageCourante(BNF);
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
$o1=$o1.session_messages();
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
    $o1=htmlDansPhp('
    <form id=\'boite_de_connexion\' method=\'post\'>
        <input type=\'hidden\' name=\'logout\' id=\'logout\' value=\'\' />
        <button type=\'submit\'>cliquez ici pour vous déconnecter</button>
    </form>
');
}else{
    /*
      ======================================================== 
      ... sinon on lui affiche un formulaire de connexion
      ======================================================== 
    */
    $o1=htmlDansPhp('
    <form id=\'boite_de_connexion\' method=\'post\' onsubmit=\'return checkSubmit1()\'>
        <label for=\'nom_de_connexion\'>
            nom de connexion
        </label>
        <input type=\'text\' name=\'nom_de_connexion\' id=\'nom_de_connexion\' value=\'\' />
        <label for=\'mot_de_passe\'>
            mot de passe
        </label>
        <input type=\'password\' name=\'mot_de_passe\' id=\'mot_de_passe\' value=\'\' />
        <button type=\'submit\'>cliquez ici pour vous connecter</button>
    </form>
<script type=\'text/javascript\'>
//<![CDATA[
//<source_javascript_rev>

    /*
      ===========================================
      dans ce javascript, on définit une fonction
      ===========================================
    */
    function checkSubmit1(){
        clearMessages(\'zone_global_messages\');
        var valRet=false;
        var zone_nom_de_connexion = document.getElementById(\'nom_de_connexion\');
        var zone_mot_de_passe = document.getElementById(\'mot_de_passe\');
        try{
            if((zone_mot_de_passe.value == \'\') || (zone_nom_de_connexion.value == \'\')){
                valRet=false;
                global_messages.errors.push(\'Veuillez indiquer votre nom de connexion et votre mot de passe.\');
                displayMessages(\'zone_global_messages\');
            }else{
                valRet=true;
            }
        }catch(e){
            alert(\'Il y a eu un problème :-(\');
        }
        return valRet;
    }
    var myURL=window.location.href;
    if((myURL.indexOf(\'?raz1\') >= 0) || (myURL.indexOf(\'&raz1\') >= 0)){
        setTimeout(function(){
            document.getElementById(\'nom_de_connexion\').value=\'\';
            document.getElementById(\'mot_de_passe\').value=\'\';
            document.getElementById(\'nom_de_connexion\').focus();
        },700);
    }
//</source_javascript_rev>
//]]>
</script>

');
}
/*
  ========================
  on imprime le formulaire
  ========================
*/
$o1=$o1.html_footer1();
print($o1);
/*..., puis on le reinitialise */
$o1=' ';
clear_session_messages();


/*
define('BNF' , basename(__FILE__));


require_once('aa_include.php');
session_start();
if((isset($_POST) && count($_POST) > 0)){
    start_session_messages();
    if((isset($_POST['nom_de_connexion']) && isset($_POST['mot_de_passe']))){
        $db=new SQLite3('../fta_inc/db/system.db');
        $req='
         SELECT chi_id_utilisateur, chp_mot_de_passe_utilisateur , chx_id_groupe_connexion_utilisateur 
         FROM tbl_utilisateurs 
         WHERE chp_nom_de_connexion_utilisateur=\''.addslashes($_POST['nom_de_connexion']).'\'
         LIMIT 1 OFFSET 0
        ';
        $stmt=$db->prepare($req);
        if(($stmt !== false)){
            $result=$stmt->execute();
            $data=array();
            $arr=$result->fetchArray(SQLITE3_ASSOC);
            while(($arr !== false)){
                $data=$arr;
                $arr=$result->fetchArray(SQLITE3_ASSOC);
            }
            $stmt->close();
        }else{
            $_SESSION[APP_KEY][MESSAGES]['errors'][]='ERROR 50 '.$db->lastErrorMsg();
            supprimerLesValeursDeSession();
            rechargerPageCourante(BNF);
        }
        if((count($data) === 3 && password_verify($_POST['mot_de_passe'],$data['chp_mot_de_passe_utilisateur']))){
            $_SESSION[APP_KEY]['sess_id_utilisateur']=$data['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_utilisateur_init']=$data['chi_id_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_groupe_utilisateur']=$data['chx_id_groupe_connexion_utilisateur'];
            $_SESSION[APP_KEY]['sess_id_groupe_utilisateur_init']=$data['chx_id_groupe_connexion_utilisateur'];
            rechargerPageCourante(BNF);
        }else{
            supprimerLesValeursDeSession();
            $_SESSION[APP_KEY][MESSAGES]['errors'][]='erreur 47, identifiant ou mot de passe incorrectes';
            sleep(3);
            rechargerPageCourante(BNF.'?raz1');
        }
    }else if((isset($_POST['logout']))){
        supprimerLesValeursDeSession();
    }
    rechargerPageCourante(BNF);
}


if((isset($_GET) && count($_GET) > 0)){
    if((isset($_GET['a']) && $_GET['a'] == 'logout')){
        supprimerLesValeursDeSession();
        rechargerPageCourante(BNF);
    }
}
$o1='';
$a=array( 'title' => 'login', 'description' => 'login');
$o1=html_header1($a);
$o1=concat($o1,session_messages());
print($o1);
$o1='';
if((isset($_SESSION[APP_KEY]['sess_id_utilisateur']) && 0 != $_SESSION[APP_KEY]['sess_id_utilisateur'])){
    $o1='
    <form id=\'boite_de_connexion\' method=\'post\'>
        <span>logout</span>
        <input type=\'hidden\' name=\'logout\' id=\'logout\' value=\'\' />
        <input type=\'submit\' value=\'envoyer\' />
    </form>
';
}else{
    $o1='
    <form id=\'boite_de_connexion\' method=\'post\' onsubmit=\'return checkSubmit()\'>
        <label for=\'nom_de_connexion\'>
            nom de connexion
        </label>
        <input type=\'text\' name=\'nom_de_connexion\' id=\'nom_de_connexion\' value=\'\' />
        <label for=\'mot_de_passe\'>
            mot de passe
        </label>
        <input type=\'password\' name=\'mot_de_passe\' id=\'mot_de_passe\' value=\'\' />
        <input type=\'submit\' value=\'envoyer\' />
    </form>
    <script type=\'text/javascript\'>
//<![CDATA[
// = = = = <source javascript = = = =
"use strict";

"use strict";
function checkSubmit1(){
    clearMessages();
    var valRet=false;
    var zone_nom_de_connexion = document.getElementById(\'nom_de_connexion\');
    var zone_mot_de_passe = document.getElementById(\'mot_de_passe\');
    try{
        if((zone_mot_de_passe.value == \'\') || (zone_nom_de_connexion.value == \'\')){
            valRet=false;
            global_messages.errors.push(\'Veuillez indiquer votre nom de connexion et votre mot de passe.\');
            displayMessages(\'zone_global_messages\');
        }else{
            valRet=true;
        }
    }catch(e){
        alert(\'Il y a eu un problème :-(\');
    }
    return valRet;
}
var myURL=window.location.href;
if((myURL.indexOf(\'?raz1\') >= 0) || (myURL.indexOf(\'&raz1\') >= 0)){
    setTimeout(function(){
        document.getElementById(\'nom_de_connexion\').value=\'\';
        document.getElementById(\'mot_de_passe\').value=\'\';
        document.getElementById(\'nom_de_connexion\').focus();
    },700);
}
// = = = = source javascript> = = = =
//]]>
</script>
';
}
$o1=concat($o1,html_footer1());
print($o1);

$o1=' ';
clear_session_messages();
/*fin du php*/

