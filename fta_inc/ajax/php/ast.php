<?php
/*
https://github.com/nikic/php-parser
*/
$a=realpath(dirname(dirname(dirname(__FILE__))));
require(($a.'/phplib/vendor/autoload.php'));
use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;
function recupererAstDePhp(&$data){
    $parser=(new ParserFactory())->createForNewestSupportedVersion();
    try{
        $ast=$parser->parse(($data['input']['texteSource']));
        $data['value']=json_encode($ast);
        $data['status']='OK';
    }catch(Error $error){
        $data['messages'][]=$error->getMessage();
        return;
    }
}