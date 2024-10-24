<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
$o1='';
$o1=html_header1(array('title'=>'convertir un sql en rev' , 'description'=>'convertir un sql en rev'));
print($o1);$o1='';
?>

  <h1>Convertir un sql en rev</h1>
  
  <div>
   <a href="javascript:charger_source_de_test_sql('txtar1')">source de test</a>
   <a href="javascript:transform_sql_de_textarea_en_rev('txtar1' , 'txtar2')"  class="yysucces">convertir</a>
   <a href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar1&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
   <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">👊</a>
   <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">🖐</a>
  </div>
  <textarea class="txtar1" id="txtar1" rows="9" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>

  <div>
   <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
   <a href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar2&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
   <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">👊</a>
   <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">🖐</a>
  </div>
  <textarea class="txtar1" id="txtar2" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  
  <div>
      <a class="yyinfo" href="javascript:transform_rev_de_textarea_en_sql(&quot;txtar2&quot; , &quot;txtar3&quot;);" title="convertir rev en SQL">R2S</a>
      <a href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar3&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
      <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">👊</a>
      <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">🖐</a>
  </div>
  
  <textarea class="txtar1" id="txtar3" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
<?php
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea' , 'parametre' => 'txtar1'
    ),
    array(
     'nomDeLaFonctionAappeler' => '#ne_rien_faire1' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
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
