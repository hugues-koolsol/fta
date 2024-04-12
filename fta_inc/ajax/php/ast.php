<?php
$a=realpath(dirname(dirname(dirname(__FILE__))));
require($a.'/phplib/vendor/autoload.php');
use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;


function recupererAstDePhp(&$data){
// $data['messages'][]=var_export( $data['input']['texteSource'] , true )  ;
 $parser = (new ParserFactory())->createForNewestSupportedVersion();
 try {
     $ast = $parser->parse($data['input']['texteSource']);
     $data['value']=json_encode($ast);
     $data['status']='OK';
 } catch (Error $error) {
    $data['messages'][]="Parse error: {$error->getMessage()}\n";
    return;
 }
}