<?php

/*
=========================================================
========= FONCTION recharger la page courante ===========
=========================================================
*/
function rechargerPageCourante(){
    header(concat('Location: ',BNF));
    exit(0);
}
/*
=========================================================
========= FONCTION supprimer les valeurs de session =====
=========================================================
*/
function supprimerLesValeursDeSession(){
    unset($_SESSION[APP_KEY]["user"]);
    unset($_SESSION[APP_KEY]["userInit"]);
    unset($_SESSION[APP_KEY]["group"]);
    unset($_SESSION[APP_KEY]["groupInit"]);
    unset($_SESSION[APP_KEY]["job"]);
    unset($_SESSION[APP_KEY]["jobInit"]);
}
/*
================================================
===== début du source ==========================
================================================
*/
define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
/*
=====================
si on est en post ...
=====================
*/
if((isset($_POST)) && count($_POST) > 0){
    start_session_messages();
    /*
    =================================================
    si les données login et password sont renseignées
    =================================================
    */
    if((isset($_POST["login"])) && isset($_POST["password"])){
        if(('admin' == $_POST["login"]) && $_POST["password"] == 'admin'){
            /*
            ====================================
            ... soit login et password sont bons
            et on met  les  données  en  session
            ====================================
            */
            $_SESSION[APP_KEY]["user"]=1;
            $_SESSION[APP_KEY]["userInit"]=1;
            $_SESSION[APP_KEY]["group"]=1;
            $_SESSION[APP_KEY]["groupInit"]=1;
            $_SESSION[APP_KEY]["job"]=1;
            $_SESSION[APP_KEY]["jobInit"]=1;
            /*Puis on attend une petite seconde pour voir si l'utilisateur est patient*/
            sleep(1);
        }else{
            /*
            ======================================
            ... soit login et password sont KO
            et on retire les données de la session
            ======================================
            */
            supprimerLesValeursDeSession();
            $_SESSION[APP_KEY][MESSAGES]["errors"][]='ERROR : login ou password faux';
        }
    }else if((isset($_POST["logout"]))){
        supprimerLesValeursDeSession();
    }
    /*
    ========================================
    TOUJOURS faire un redirect après un POST
    ========================================
    */
    rechargerPageCourante();
}



/*
//========================================================
// si on appel cette page en GET avec une (a)ction=logout,
// on sort et on redirige sur cette page
//========================================================
*/
if((isset($_GET)) && count($_GET) > 0){
    if((isset($_GET["a"])) && $_GET["a"] == 'logout'){
        /*on supprime et on recharge*/
        supprimerLesValeursDeSession();
        rechargerPageCourante();
    }
}
/*
======================================================== 
affichage de l'html 
========================================================
*/
$o1='';
$a=array( 'title' => 'login', 'description' => 'login');
/*
==============================================================
ou bien 
affecte($a , []),
appelf(n(pushkv) , p($a) , p('title') , p('login')),
appelf(n(pushkv) , p($a) , p('description') , p('login')),
==============================================================
*/
$o1=html_header1($a);
$o1=concat($o1,session_messages());
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
if((isset($_SESSION[APP_KEY]["user"])) && 1 == $_SESSION[APP_KEY]["user"]){
    /*
    ======================================================== 
    ... si oui on lui affiche un formulaire de DEconnexion
    ======================================================== 
    */
    $o1=<<<EOT
    <form id="loginbox" method="post">
        <span>logout</span>
        <input type="hidden" name="logout" id="logout" value="" />
        <input type="submit" value="envoyer" />
    </form>

EOT;
}else{
    /*
    ======================================================== 
    ... sinon on lui affiche un formulaire de connexion
    ======================================================== 
    */
    $o1=<<<EOT
    <form id="loginbox" method="post" onsubmit="return checkSubmit()">
        <label for="login">
            login
        </label>
        <input type="text" name="login" id="login" value="" />
        <label for="password">
            password
        </label>
        <input type="password" name="password" id="password" value="" />
        <input type="submit" value="envoyer" />
    </form>
    <script type="text/javascript" data-lang="fr">
// = = = = <source javascript = = = =
"use strict";

/*
===========================================
dans ce javascript, on définit une fonction
===========================================
*/
function checkSubmit(){
  clearMessages();
  var valRet=false;
  var zoneLogin={};
  var zonePassw={};
  zoneLogin=document.getElementById('login');
  zonePassw=document.getElementById('password');
  try{
    if((zonePassw.value == '')||zoneLogin.value == ''){
      valRet=false;
      global_messages.errors.push('Veuillez indiquer votre login et votre mot de passe.');
      displayMessages();
    }else{
      valRet=true;
    }
  }catch(e){
    global_messages.errors.push('Il y a eu un problème ');
    displayMessages();
  }
  return valRet;
}
// = = = = source javascript> = = = =

    </script>

EOT;
}
/*
========================
on imprime le formulaire
========================
*/
$o1=concat($o1,html_footer1());
print($o1);
/*..., puis on le reinitialise */
$o1=' ';
clear_session_messages();
/*fin du php*/
?>