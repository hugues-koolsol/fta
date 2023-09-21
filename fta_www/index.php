<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();


$o1='';
$o1=html_header1(array('title'=>'home' , 'description'=>'home'));
print($o1);$o1='';
?>
<h1>PHP HOME</h1>
<ul>
 <li><a href="index.html">html home</a></li>
 <li><a href="index.php">php home</a></li>
 <li><a href="index_php.html">index_php.html</a></li>
 <li><a href="index_js.html">index_js.html</a></li>
 <li><a href="indexfu.html">indexfu.html</a></li>
 <li><a href="index_source.html">index_source.html</a></li>
</ul>
<?php
$o1.=html_footer1(array());
print($o1);$o1='';