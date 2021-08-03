<?php
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
?><h1>HOME</h1>
<ul>
  <li>
    <a href="index_php.html">index_php.html</a>
  </li>
  <li>
    <a href="index.html">index.html</a>
  </li>
</ul>
//================================================
// apres avoir affiché le html, on affiche le php
//================================================<?php
$o1=concat($o1,html_footer1());
print($o1);
$o1='';
?>