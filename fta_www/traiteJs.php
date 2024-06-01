<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
$o1='';
$o1=html_header1(array('title'=>'convertir un js en rev' , 'description'=>'convertir un js en rev'));
print($o1);$o1='';
?>

        <div class="menuScroller">
            <ul>
                <li><a href="javascript:chargerSourceDeTestJs()">source de test</a>&nbsp;</li>
                <li><a href="javascript:transformJsDeTextAreaEnRev()"  class="yysucces">convertir js esprima</a>&nbsp;</li>
                <li><a href="javascript:transform_textarea_js_en_rev_avec_acorn( 'txtar1' , 'txtar2', 'script' )"  class="yysucces">convertir script acorn</a>&nbsp;</li>
                <li><a href="javascript:transform_textarea_js_en_rev_avec_acorn( 'txtar1' , 'txtar2', 'module' )"  class="yysucces">convertir module acorn</a>&nbsp;</li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a>&nbsp;</li>
            </ul>
        </div>
  <h1>Convertir un js en rev</h1>
  
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
    'js_a_inclure'=>array('js/javascript.js','js/compile1.js','js/javascript.js','js/jslib/esprima.js','js/convertit-html-en-rev1.js','js/convertit-js-en-rev1.js','js/html.js'),
    'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='<script type="text/javascript">
window.addEventListener(\'load\',function(){
  chargerLeDernierSourceJs();
  transformJsDeTextAreaEnRev();
 }
)
</script>';

$o1.=html_footer1($par);
print($o1);$o1='';
