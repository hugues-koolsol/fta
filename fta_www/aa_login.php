<?php
define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
start_session_messages();
if((isset($_POST)) && count($_POST) > 0){
   if((isset($_POST["login"])) && isset($_POST["password"])){
      if(($_POST["login"] == 'admin') && $_POST["password"] == 'admin'){
         $_SESSION[APP_KEY]["user"]=1;
         $_SESSION[APP_KEY]["userInit"]=1;
      }else{
         unset($_SESSION[APP_KEY]["user"]);
         unset($_SESSION[APP_KEY]["userInit"]);
         $_SESSION[APP_KEY][MESSAGES]["errors"][]='ERROR';
      }
   }else if((isset($_POST["logout"]))){
      unset($_SESSION[APP_KEY]["user"]);
      unset($_SESSION[APP_KEY]["userInit"]);
   }
   header(concat('Location: ',BNF));
}
if((isset($_GET)) && count($_GET) > 0){
 if(isset($_GET['a']) && $_GET['a']=='logout'){
  unset($_SESSION[APP_KEY]["user"]);
  unset($_SESSION[APP_KEY]["userInit"]);
  header(concat('Location: ',BNF));
 }
}

$o1='';
$a=array('title' => 'login','description' => 'login');
$o1=html_header1($a);
$o1=concat($o1,session_messages());
print($o1);
$o1='';
if((isset($_SESSION[APP_KEY]["user"])) && 1 == $_SESSION[APP_KEY]["user"]){
   $o1=<<<EOT
<form id="loginbox" method="post">
 <span>logout</span>
 <input type="hidden" name="logout" id="logout" value="" />
 <input type="submit" value="envoyer" />

</form>
EOT;
}else{
   $o1=<<<EOT
<form id="loginbox" method="post">
 <label for="login">login</label>
 <input type="text" name="login" id="login" value="" />
 <label for="password">password</label>
 <input type="password" name="password" id="password" value="" />
 <input type="submit" value="envoyer" />

</form>
EOT;
}
$o1=concat($o1,html_footer1());
print($o1);
$o1='';
?>