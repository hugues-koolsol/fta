<?php

/*=============== début du php ==========================*/
define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
start_session_messages();
$o1='';
$a=array( 'title' => 'l\'accueil', 'description' => 'description de l\'accueil');
$o1=html_header1($a);
$o1=concat($o1,session_messages());
print($o1);
$o1='';
/*
  L'appel çi dessus permet de faire :
  definir(BNF , appelf(n(basename) , p(__FILE__))),
  appelf( n(require_once) , p('aa_include.php') ),
  appelf( n(session_start) ),
  appelf( n(start_session_messages) ),
  // ======================================================== 
  // affichage de l'entête html 
  affecte( $o1 , '' ),
  affecte( $a , array( ( 'title' , 'accueil' ) , ( 'description' , 'accueil' ) ) ),
  appelf( r($o1) , n(html_header1) , p($a) ),
  appelf( n(concat) , r($o1) , p($o1) , p( appelf( n(session_messages) ) ) ),
  // on imprime le texte ...
  appelf( n(print) , p($o1) ),
  // ... puis on le reinitialise
  affecte( $o1 , '' )
*/
?>

    <h1>
      HOME
    </h1>
    <ul>
      <li>
        <a href="index_php.html">
          index_php.html
        </a>
      </li>
      <li>
        <a href="index.html">
          index.html
        </a>
      </li>
    </ul>

<?php

/*
  //================================================
  // apres avoir affiché le html, on affiche le php
  //================================================
*/
$o1=concat($o1,html_footer1());
print($o1);
/*... puis on le reinitialise*/
$o1='';
/*=============== fin du php ===========================*/
?>