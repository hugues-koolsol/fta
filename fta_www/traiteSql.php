<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
$o1='';
$o1=html_header1(array('title'=>'convertir un sql en rev' , 'description'=>'convertir un sql en rev'));
print($o1);$o1='';
?>

        <div class="menuScroller">
            <ul>
                <li><a href="javascript:charger_source_de_test_sql('txtar1')">source de test</a>&nbsp;</li>
                <li><a href="javascript:transform_sql_de_textarea_en_rev('txtar1' , 'txtar2')"  class="yysucces">convertir</a>&nbsp;</li>
                <li><a href="javascript:afficherOuMasquerLesMessages()" title="afficher/masquer les messages">🙈</a>&nbsp;</li>
            </ul>
        </div>
  <h1>Convertir un sql en rev</h1>
  
  <textarea class="txtar1" id="txtar1" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <div id="resultat1"></div>
  <textarea class="txtar1" id="txtar2" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <textarea class="txtar1" id="txtar3" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
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
    'js_a_inclure'=>array('js/sql.js' , 'js/convertion_sql_en_rev.js' , 'js/jslib/sqlite_parser_from_demo.js'),
    'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='<script type="text/javascript">
window.addEventListener(\'load\',function(){
  charger_le_dernier_source_sql("txtar1");
  transform_sql_de_textarea_en_rev("txtar1" , "txtar2");
 }
)
</script>';

$o1.=html_footer1($par);
print($o1);$o1='';
