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
     
        $contenu=preg_replace('/\\/\\*sql_'.'inclure_deb\\*\\/(.*?)\\/\\*sql_'.'inclure_fin\\*\\//us','', $data[__entree]['texteSource']);

        $ast=$parser->parse($contenu);
        $data[__xva]=json_encode($ast);
        $data[__xst]=true;
    }catch(Error $error){
        $data[__xms][]=$error->getMessage();
        return;
    }
}
