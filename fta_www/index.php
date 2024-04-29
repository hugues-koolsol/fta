<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();


$o1='';
$o1=html_header1(array('title'=>'php home' , 'description'=>'php home'));
print($o1);$o1='';


?>
        <div class="menuScroller">
            <ul class="menu2">
                <li style="margin-top:-13px;">
                    <a href="javascript:chargerSourceDeTest()">charger le source de test</a>&nbsp;
                    <a href="javascript:transformLeRev()" class="yysuccess">traiter</a>&nbsp;
                    <a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a>&nbsp;
                </li>
            </ul>
        </div>
        <h1>PHP HOME</h1>
        <textarea class="txtar1" id="txtar1" rows="10"></textarea>
        <div id="resultat1"></div>

<?php
$par=array('js'=>array('js/pour-index_php0.js'));
$o1.=html_footer1($par);
print($o1);$o1='';