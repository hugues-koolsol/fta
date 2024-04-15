<?php

/*
  début du test
  =======================================================================================
*/
error_reporting(0);
ini_set('display_errors',0);
set_error_handler('errorHandler');
register_shutdown_function('shutdownHandler');
function errorHandler($error_level,$error_message,$error_file,$error_line,$error_context){
    $typeName='';
    switch ($error_level){
        case E_STRICT:
            $typeName='E_STRICT';
            break;
            
        case E_USER_NOTICE:
            $typeName='E_USER_NOTICE';
            break;
            
        case E_NOTICE:
            $typeName='E_NOTICE';
            break;
            
        case E_USER_WARNING:
            $typeName='E_USER_WARNING';
            break;
            
        case E_WARNING:
            $typeName='E_WARNING';
            break;
            
        case E_ERROR:
            $typeName='E_ERROR';
            break;
            
        case E_CORE_ERROR:
            $typeName='E_CORE_ERROR';
            break;
            
        case E_COMPILE_ERROR:
            $typeName='E_COMPILE_ERROR';
            break;
            
        case E_USER_ERROR:
            $typeName='E_USER_ERROR';
            break;
            
        case E_RECOVERABLE_ERROR:
            $typeName='E_RECOVERABLE_ERROR';
            break;
            
        case E_CORE_WARNING:
            $typeName='E_CORE_WARNING';
            break;
            
        case E_COMPILE_WARNING:
            $typeName='E_COMPILE_WARNING';
            break;
            
        case E_PARSE:
            $typeName='E_PARSE';
            break;
            
    }
    $error=(($typeName == '')?'UNKNOWN_ERROR':$typeName).' | msg:'.$error_message.' | line:'.$error_line.' | file:'.basename($error_file).' ('.$error_file.')';
    if(($typeName != '')){
        mylog($error,'fatal');
    }
}
function shutdownHandler(){
    $lasterror=error_get_last();
    $typeName='';
    if((isset(($lasterror['type'])))){
        switch (tableau){
            case E_STRICT:
                $typeName='E_STRICT';
                break;
                
            case E_USER_NOTICE:
                $typeName='E_USER_NOTICE';
                break;
                
            case E_NOTICE:
                $typeName='E_NOTICE';
                break;
                
            case E_USER_WARNING:
                $typeName='E_USER_WARNING';
                break;
                
            case E_WARNING:
                $typeName='E_WARNING';
                break;
                
            case E_ERROR:
                $typeName='E_ERROR';
                break;
                
            case E_CORE_ERROR:
                $typeName='E_CORE_ERROR';
                break;
                
            case E_COMPILE_ERROR:
                $typeName='E_COMPILE_ERROR';
                break;
                
            case E_USER_ERROR:
                $typeName='E_USER_ERROR';
                break;
                
            case E_RECOVERABLE_ERROR:
                $typeName='E_RECOVERABLE_ERROR';
                break;
                
            case E_CORE_WARNING:
                $typeName='E_CORE_WARNING';
                break;
                
            case E_COMPILE_WARNING:
                $typeName='E_COMPILE_WARNING';
                break;
                
            case E_PARSE:
                $typeName='E_PARSE';
                break;
                
        }
        $toto=dirname(dirname(__FILE__));
        $dernierMessage=str_replace($toto,'',($lasterror['message']));
        $error=(($typeName == '')?'UNKNOWN_ERROR':$typeName).' bug dans le source php | msg:'.'<span style="text-wrap:wrap;color:blue;">'.$dernierMessage.'</span> | line:'.$lasterror['line'].' | aafile:'.basename(($lasterror['file'])).' ('.$lasterror['file'].')';
        if(($typeName != '')){
            mylog($error,'fatal');
        }
    }
}
function mylog($error,$errlvl){
    $ret=array( 'status' => 'KO', 'messages' => array());
    $ret['messages'][]=basename(__FILE__).' '.__LINE__.' '.$error;
    header('Content-Type: application/json; charset=utf-8');
    echo(json_encode($ret,JSON_FORCE_OBJECT));
    http_response_code(200);
    exit(0);
}
require_once('aa_include.php');
if((isset($_POST) && sizeof($_POST) > 0 && isset(($_POST['ajax_param'])))){
    $ret=array( 'status' => 'KO', 'messages' => array());
    $ret['input']=json_decode(($_POST['ajax_param']),true);
    if((isset(($ret['input']['call']['funct'])) && $ret['input']['call']['lib'] != '' && $ret['input']['call']['file'] != '' && $ret['input']['call']['funct'] != '')){
        define('BNF',('/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php'));
        if(( !(is_file((INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php'))))){
            $ret['status']='KO';
            $ret['messages'][]=basename(__FILE__).' '.__LINE__.' '.'Ajax file not founded : "'.INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/ajax_'.$ret['input']['call']['funct'].'.php"';
        }else if((session_status() == PHP_SESSION_NONE)){
            session_start();
        }else if(($ret['input']['call']['funct'] != '')){
            if((true === checkGroupAjaxPages())){
                require_once((INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php'));
                $ret['input']['call']['funct']($ret);
            }
        }else if((true === checkGroupAjaxPages())){
            require_once((INCLUDE_PATH.'/ajax/'.$ret['input']['call']['lib'].'/'.$ret['input']['call']['file'].'.php'));
        }
    }else{
        $ret['status']='KO';
        $ret['messages'][]=basename(__FILE__).' '.__LINE__.' '.'funct or lib is not defined in the input parameters : "'.var_export(($ret['input']),true).'"';
    }
}else{
    $ret['status']='KO';
    $ret['messages'][]=basename(__FILE__).' '.__LINE__.' '.'post ajax_param is not defined : "'.var_export($_POST,true).'"';
}
header('Content-Type: application/json; charset=utf-8');
echo(json_encode($ret,JSON_FORCE_OBJECT));
exit(0);
/*
  =================================================================================
  fin du test
*/
?>