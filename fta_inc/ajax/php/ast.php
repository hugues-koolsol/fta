<?php
/*
  https://github.com/nikic/php-parser
*/
$a=realpath(dirname(dirname(dirname(__FILE__))));
require($a . '/phplib/vendor/autoload.php');
use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;

function recupererAstDePhp(&$data){

    $parser=(new ParserFactory())->createForNewestSupportedVersion();
    try{
        $contenu=preg_replace('/\/\\*sql_' . 'inclure_deb\\*\/(.*?)\/\\*sql_' . 'inclure_fin\\*\//us','',$data[__entree]['texteSource']);
        $ast=$parser->parse($contenu);
        /*
          sans le JSON_INVALID_UTF8_IGNORE, le source
          $a = "\x80" ;
          retourne false
        */
        $data[__xva]=json_encode($ast,JSON_INVALID_UTF8_IGNORE);
        $data[__xst]=true;
    }catch(Error $error){
        $data[__xms][]=$error->getMessage();
        return;
    }

}
function recupererAstDePhp2(&$data){

    $parser=(new ParserFactory())->createForNewestSupportedVersion();
    try{
        $contenu=preg_replace('/\/\\*sql_' . 'inclure_deb\\*\/(.*?)\/\\*sql_' . 'inclure_fin\\*\//us','',$data[__entree]['source_php']);
        $ast=$parser->parse($contenu);
        /*
          sans le JSON_INVALID_UTF8_IGNORE, le source
          $a = "\x80" ;
          retourne false
        */
        $data[__xva]=json_encode($ast,JSON_INVALID_UTF8_IGNORE);
        $data[__xst]=true;
    }catch(Error $error){
        $data[__xms][]=$error->getMessage();
        return;
    }

}