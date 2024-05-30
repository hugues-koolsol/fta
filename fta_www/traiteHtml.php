<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();


$o1='';
$o1=html_header1(array('title'=>'convertir un html en rev' , 'description'=>'convertir un html en rev'));
print($o1);$o1='';
?>
        <div class="menuScroller">
            <ul>
                
                <li><a href="javascript:chargerSourceDeTestHtml()">source de test</a>&nbsp;</li>
                <li><a href="javascript:transformHtmlEnRev()"  class="yysucces">convertir</a>&nbsp;</li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a>&nbsp;</li>
                
            </ul>
        </div>

  <h1>Convertir un html en rev</h1>
  <textarea class="txtar1" id="txtar1" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <div id="resultat1"></div>
  <textarea class="txtar1" id="txtar2" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <textarea class="txtar1" id="txtar3" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
<?php
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea' , 'parametre' => 'txtar1'
    ),
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array(
    'js_a_inclure'=>array('js/html.js','js/compile1.js','js/javascript.js','js/jslib/esprima.js','js/convertit-html-en-rev1.js','js/convertit-js-en-rev1.js','js/html.js'),
     'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='<script type="text/javascript">
window.addEventListener(\'load\',function(){
  chargerLeDernierSourceHTML();
  transformHtmlEnRev();
 }
)
</script>';
$o1.=html_footer1($par);
print($o1);$o1='';