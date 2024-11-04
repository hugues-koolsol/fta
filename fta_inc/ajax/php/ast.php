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
     
        $contenu=preg_replace('/\\/\\*sql_'.'inclure_deb\\*\\/(.*?)\\/\\*sql_'.'inclure_fin\\*\\//us','', $data['input']['texteSource']);

        $ast=$parser->parse($contenu);
        $data['value']=json_encode($ast);
        $data[__xst]='OK';
    }catch(Error $error){
        $data['messages'][]=$error->getMessage();
        return;
    }
}
