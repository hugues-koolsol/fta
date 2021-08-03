<?php //PLEASE, keep this comment with the EURO sign, this source MUST be in utf-8 ---- € déjà
//if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}
error_reporting(0);
ini_set('display_errors', 0);
set_error_handler("errorHandler");
register_shutdown_function("shutdownHandler");

function errorHandler($error_level, $error_message, $error_file, $error_line, $error_context){
 $typeName='';
 switch ($error_level){
     case E_STRICT:            $typeName='E_STRICT'; break;
     case E_USER_NOTICE:       $typeName='E_USER_NOTICE'; break;
     case E_NOTICE:            $typeName='E_NOTICE'; break;
     case E_USER_WARNING:      $typeName='E_USER_WARNING'; break;
     case E_WARNING:           $typeName='E_WARNING'; break;
     case E_ERROR:             $typeName='E_ERROR'; break;
     case E_CORE_ERROR:        $typeName='E_CORE_ERROR';break;
     case E_COMPILE_ERROR:     $typeName='E_COMPILE_ERROR';break;
     case E_USER_ERROR:        $typeName='E_USER_ERROR';break;
     case E_RECOVERABLE_ERROR: $typeName='E_RECOVERABLE_ERROR';break;
     case E_CORE_WARNING:      $typeName='E_CORE_WARNING';break;
     case E_COMPILE_WARNING:   $typeName='E_COMPILE_WARNING';break;
     case E_PARSE:             $typeName='E_PARSE';break;
 }
 $error = ($typeName==''?'UNKNOWN_ERROR':$typeName)." | msg:" . $error_message . " | line:" . $error_line . " | file:" . basename($error_file) . " (" . $error_file . ")"; // , error_context:".str_replace("\r",'',str_replace("\n",'',var_export($error_context,true)));
 if($typeName!=''){
  mylog($error, "fatal");
 }
}

function shutdownHandler(){ //will be called when php script ends.
 $lasterror = error_get_last();
 $typeName='';
 if(isset($lasterror['type'])){
  switch ($lasterror['type']){
      case E_STRICT:            $typeName='E_STRICT'; break;
      case E_USER_NOTICE:       $typeName='E_USER_NOTICE'; break;
      case E_NOTICE:            $typeName='E_NOTICE'; break;
      case E_USER_WARNING:      $typeName='E_USER_WARNING'; break;
      case E_WARNING:           $typeName='E_WARNING'; break;
      case E_ERROR:             $typeName='E_ERROR'; break;
      case E_CORE_ERROR:        $typeName='E_CORE_ERROR';break;
      case E_COMPILE_ERROR:     $typeName='E_COMPILE_ERROR';break;
      case E_USER_ERROR:        $typeName='E_USER_ERROR';break;
      case E_RECOVERABLE_ERROR: $typeName='E_RECOVERABLE_ERROR';break;
      case E_CORE_WARNING:      $typeName='E_CORE_WARNING';break;
      case E_COMPILE_WARNING:   $typeName='E_COMPILE_WARNING';break;
      case E_PARSE:             $typeName='E_PARSE';break;
  }
  $error = ($typeName==''?'UNKNOWN_ERROR':$typeName)." | msg:" . $lasterror['message'] . " | line:" . $lasterror['line'] . " | file:" . basename($lasterror['file']) . " (" . $lasterror['file'] . ")";
  if($typeName!=''){
   mylog($error, "fatal");
  }
 }
}
function mylog($error, $errlvl){
 $ret=array('status' => 'KO','messages' => array() ); // messages must be in array
 $ret['messages'][]=$error; 
 header('Content-Type: application/json; charset=utf-8');
 echo json_encode($ret,JSON_FORCE_OBJECT);
 exit(0);
}
require_once('aa_include.php');
if(isset($_POST)&&sizeof($_POST)>0&&isset($_POST['ajax_param'])){
 $ret=array('status' => 'KO','messages' => array() ); // messages must be in array
 $ret['input']=json_decode($_POST['ajax_param'],true);
 if(isset($ret['input']['call']['funct'])&&$ret['input']['call']['lib']!=''&&$ret['input']['call']['file']!=''&&$ret['input']['call']['funct']!=''){
  define('BNF' , '/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php' );
  if(!is_file(INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php')){
   $ret['status']='KO';
   $ret['messages'][]='Ajax file not founded : "'.INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/ajax_'.$ret['input']['call']['funct'].'.php"';
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
  $ret['messages'][]='funct or lib is not defined in the input parameters : "'.var_export($ret['input'],true).'"';
 }
}else{
 $ret['status']='KO';
 $ret['messages'][]='post ajax_param is not defined : "'.var_export($_POST,true).'"'; 
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($ret,JSON_FORCE_OBJECT);
exit(0);
