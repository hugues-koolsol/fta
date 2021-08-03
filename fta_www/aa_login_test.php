<?php
define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
start_session_messages();
if((isset($_POST)) && count($_POST) > 0){
   if((isset($_POST["login"])) && isset($_POST["password"])){
      if(($_POST["login"] == 'admin') && $_POST["password"] == 'admin'){
         
         // =============================
         // ... soit login et password sont bons
         // et on met les données en session
         
         $_SESSION[APP_KEY]["user"]=1;
         $_SESSION[APP_KEY]["userInit"]=1;
         $_SESSION[APP_KEY]["group"]=1;
         $_SESSION[APP_KEY]["groupInit"]=1;
         $_SESSION[APP_KEY]["job"]=1;
         $_SESSION[APP_KEY]["jobInit"]=1;
      }else{
         
         // =============================
         // ... soit login et password sont KO
         // et on retire les données de la session
         
         unset($_SESSION[APP_KEY]["user"]);
         unset($_SESSION[APP_KEY]["userInit"]);
         unset($_SESSION[APP_KEY]["group"]);
         unset($_SESSION[APP_KEY]["groupInit"]);
         unset($_SESSION[APP_KEY]["job"]);
         unset($_SESSION[APP_KEY]["jobInit"]);
         $_SESSION[APP_KEY][MESSAGES]["errors"][]='ERROR';
      }
   }else if((isset($_POST["logout"]))){
      unset($_SESSION[APP_KEY]["user"]);
      unset($_SESSION[APP_KEY]["userInit"]);
      unset($_SESSION[APP_KEY]["group"]);
      unset($_SESSION[APP_KEY]["groupInit"]);
      unset($_SESSION[APP_KEY]["job"]);
      unset($_SESSION[APP_KEY]["jobInit"]);
   }
   header(concat('Location: ',BNF));
}

//=============================================================
// si on appel cette page en GET avec une (a)action=logout,
// on sort et on redirige sur cette page

if((isset($_GET)) && count($_GET) > 0){
   if((isset($_GET["a"])) && $_GET["a"] == 'logout'){
      unset($_SESSION[APP_KEY]["user"]);
      unset($_SESSION[APP_KEY]["userInit"]);
      unset($_SESSION[APP_KEY]["group"]);
      unset($_SESSION[APP_KEY]["groupInit"]);
      unset($_SESSION[APP_KEY]["job"]);
      unset($_SESSION[APP_KEY]["jobInit"]);
      header(concat('Location: ',BNF));
   }
}

// ======================================================== 
// affichage de l'html 
// ========================================================

$o1='';
$a=array( 'title' => 'login', 'description' => 'login');
$o1=html_header1($a);
$o1=concat($o1,session_messages());

// ========================================================
// on imprime le l'entête ...
print($o1);
$o1='';
// ======================================================== 
// l'utilisateur est-il déjà connecté ? ...
if((isset($_SESSION[APP_KEY]["user"])) && 1 == $_SESSION[APP_KEY]["user"]){
   
   // ======================================================== 
   // ... si oui on lui affiche un formulaire de deconnexion
   
   $o1=<<<EOT
<form id="loginbox" method="post"><span>logout</span>
  <input type="hidden" name="logout" id="logout" value=""></input>
  <input type="submit" value="envoyer"></input>
</form>
EOT;
}else{
   
   // ======================================================== 
   // ... sinon on lui affiche un formulaire de connexion
   
   $o1=<<<EOT
<form id="loginbox" method="post">
  <label for="login">login</label>
  <input type="text" name="login" id="login" value=""></input>
  <label for="password">password</label>
  <input type="password" name="password" id="password" value=""></input>
  <input type="submit" value="envoyer"></input>
</form>
EOT;
}
// ========================
// on imprime le formulaire
$o1=concat($o1,html_footer1());
print($o1);
$o1='';
?>