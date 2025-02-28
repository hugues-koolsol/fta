<?php
/*
  https://github.com/nikic/php-parser
*/
$a=realpath(dirname(dirname(dirname(__FILE__))));
require($a . '/phplib/vendor/autoload.php');
use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;
function recuperer_ast_de_php2(&$data){

    $parser=(new ParserFactory())->createForNewestSupportedVersion();
    try{
        $contenu=preg_replace('/\/\\*sql_' . 'inclure_deb\\*\/(.*?)\/\\*sql_' . 'inclure_fin\\*\//us','',$data[__entree]['source_php']);
        $ast=$parser->parse($contenu);
        /*
          sans le JSON_INVALID_UTF8_IGNORE, le source
          $a = "\x80" ;
          retourne false
        */
        ajouterMessage(__xsu,BNF . ' ' . __LINE__ . ' conversion nikic OK');
        $data[__xva]=json_encode($ast,JSON_INVALID_UTF8_IGNORE);
        $data[__xst]=__xsu;
    }catch(Error $error){
        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . $error->getMessage());
        return;
    }

}