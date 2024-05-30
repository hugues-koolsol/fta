<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();


$o1='';
$o1=html_header1(array('title'=>'Accueil' , 'description'=>'Accueil'));
print($o1);$o1='';


?>
        <div class="menuScroller">
            <ul>
                <li><a href="javascript:chargerSourceDeTest()">charger le source de test</a></li>
                <li><a href="javascript:transformLeRev()" class="yysucces">traiter</a></li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a></li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a></li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a></li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a></li>
            </ul>
        </div>
        <h1>PHP HOME</h1>

        <div class="not menuScroller">
         <a href='javascript:parentheses(&quot;txtar1&quot;);' title='repérer la parenthèse ouvrante ou fermante correspondante'>(|.|)</a>
        </div>
        
        <textarea class="txtar1" id="txtar1" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
        <div id="resultat1"></div>

<?php
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea' , 'parametre' => 'txtar1'
    ),
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array('js/pour-index_php0.js'),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';