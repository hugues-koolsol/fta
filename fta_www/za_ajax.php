<?php
/*
 PLEASE, keep this comment with the EURO sign, this source MUST be in utf-8 ---- € déjà
*/
error_reporting(0);
ini_set('display_errors', 0);
set_error_handler("errorHandler");
register_shutdown_function("shutdownHandler");
/*
=====================================================================================================================
Fonction retourne le nom du type d'erreur
=====================================================================================================================
*/
function recupTypeErreur($ty){
 $er='UNKNOWN_ERROR';
 $listeDesTypes=array(
     E_STRICT=>'E_STRICT',
     E_USER_NOTICE=>'E_USER_NOTICE',
     E_NOTICE=>'E_NOTICE',
     E_USER_WARNING=>'E_USER_WARNING',
     E_WARNING=>'E_WARNING',
     E_ERROR=>'E_ERROR',
     E_CORE_ERROR=>'E_CORE_ERROR',
     E_COMPILE_ERROR=>'E_COMPILE_ERROR',
     E_USER_ERROR=>'E_USER_ERROR',
     E_RECOVERABLE_ERROR=>'E_RECOVERABLE_ERROR',
     E_CORE_WARNING=>'E_CORE_WARNING',
     E_COMPILE_WARNING=>'E_COMPILE_WARNING',
     E_PARSE=>'E_PARSE'
 );
 if(isset($listeDesTypes[$ty])){
  $er=$listeDesTypes[$ty];
 }
 return($er);
}
/*
=====================================================================================================================
Fonction appelée quand il y a un bug de traitement, par exemple une division par zéro
=====================================================================================================================
*/
function errorHandler($error_level, $error_message, $error_file, $error_line, $error_context){
 $error = 'error : '.recupTypeErreur($error_level)." | msg:" . $error_message . " | line:" . $error_line . " | file:" . basename($error_file) . " (" . $error_file . ")"; // , error_context:".str_replace("\r",'',str_replace("\n",'',var_export($error_context,true)));
 mylog($error);
}
/*
=====================================================================================================================
Fonction appelée quand il y a un bug dans le source php, par exemple un appel à une fonction que n'existe pas
ou bien une erreur dans l'écriture du programme
=====================================================================================================================
*/

function shutdownHandler(){
 $lasterror = error_get_last();
 $nomErreur='UNKNOWN_ERROR';
 if(isset($lasterror['type'])){
  $aRetirer=dirname(dirname(__FILE__));
  $dernierMessage=str_replace($aRetirer,'',$lasterror['message']);
  $error = 'shutdown : '.recupTypeErreur($lasterror['type'])." bug dans le source php | msg:" . '<span style="text-wrap:wrap;color:blue;">'.$dernierMessage . "</span> | line:" . $lasterror['line'] . " | aafile:" . basename($lasterror['file']) . " (" . $lasterror['file'] . ")";
  mylog($error);
 }
}
//================================================================================================
function mylog($error){
 $ret=array('status' => 'KO','messages'=>array());
 $ret['messages'][]=$error; 
 header('Content-Type: application/json; charset=utf-8');
 echo json_encode($ret,JSON_FORCE_OBJECT);
 /* on a capturé une erreur de type 500, on force la réponse en 200 */
 http_response_code(200);
 exit(0);
}
//================================================================================================
require_once('aa_include.php');
initialiser_les_services(false,true);
/*
if($fd=fopen('toto.txt','a')){fwrite($fd,CRLF.'========================'.CRLF.date('Y-m-d H:i:s'). ' ' . __LINE__ .CRLF.'$_POST='.var_export($_POST,true).CRLF.'$_FILES='.var_export($_FILES,true)."\r\n"); fclose($fd);}
*/
if(isset($_POST)&&sizeof($_POST)>0&&isset($_POST['ajax_param'])){
 $ret=array('status' => 'KO','messages' => array() ); // messages must be in array
 $ret['input']=json_decode($_POST['ajax_param'],true);
 if(isset($ret['input']['call']['funct'])&&$ret['input']['call']['lib']!=''&&$ret['input']['call']['file']!=''&&$ret['input']['call']['funct']!=''){
  define('BNF' , '/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php' );
  if(!is_file(INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php')){
   $ret['status']='KO';
   $ret['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'Ajax file not founded : "'.INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/ajax_'.$ret['input']['call']['funct'].'.php"';
  }else{
   if(session_status()==PHP_SESSION_NONE){
    session_start();
   }
   if($ret['input']['call']['funct']!=''){
    if(true===checkGroupAjaxPages()){
     require_once INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php';
     $ret['input']['call']['funct']($ret);
    }
   }else{
    if(true===checkGroupAjaxPages()){
     require_once INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php';
    }
   }
  }
 }else{
  $ret['status']='KO';
  $ret['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'funct or lib is not defined in the input parameters : "'.var_export($ret['input'],true).'"';
 }
}else{
 $ret['status']='KO';
 $ret['messages'][]=basename(__FILE__) . ' ' . __LINE__ . ' ' . 'post ajax_param is not defined : "'.var_export($_POST,true).'"'; 
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($ret,JSON_FORCE_OBJECT);
exit(0);