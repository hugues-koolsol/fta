<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();

$o1='';
$o1=html_header1(array('title'=>'convertir un php en rev' , 'description'=>'convertir un php en rev'));
print($o1);$o1='';
?>

        <div class="menuScroller">
            <ul>
                <li><a href="javascript:chargerSourceDeTestPhp()">source de test</a>&nbsp;</li>
                <li><a href="javascript:transformPhpEnRev()"  class="yysucces">convertir</a>&nbsp;</li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" >afficher/masquer les messages</a>&nbsp;</li>
                
            </ul>
        </div>

  <h1>Convertir un php en rev</h1>
  
  <textarea class="txtar1" id="txtar1" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <div id="resultat1"></div>
  <div>
   <a href="javascript:formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
   <a href="javascript:ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
  </div>
  <textarea class="txtar1" id="txtar2" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <br />
  <a class="yyinfo" href="javascript:convertir_rev_en_php('txtar2','txtar3')">R2P↧</a>
  <br />
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
    'js_a_inclure'=>array('js/html.js','js/compile1.js','js/javascript.js','js/jslib/esprima.js','js/convertit-php-en-rev0.js','js/convertit-html-en-rev1.js','js/convertit-js-en-rev1.js','js/html.js','js/php.js'),
     'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='<script type="text/javascript">
setTimeout(
 function(){
  chargerLeDernierSourcePhp();
  transformPhpEnRev();
 },500
)
</script>';
$o1.=html_footer1($par);
print($o1);$o1='';