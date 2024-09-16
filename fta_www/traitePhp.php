<?php
//the function echo the help [?] links to the documentation
function helpLink($name){

    global $lang;
    return("<a href='?help=1' onclick='openHelp(\"".$name."\"); return false;' class='helpq' title='".$lang['help'].": ".$name."' target='_blank'><span>[?]</span></a>");

}

/*
$name='toto';
$b="(?:[^\"]$name+|\"\")$name";
// '(?:[^"]toto+|"")toto'
echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $b , true ) . '</pre>' ; exit(0);
*/
/*
$a='\$';
$b='\\$';
echo __FILE__ . ' ' . __LINE__ . ' $a = <pre>' . var_export( $a , true ) . '</pre>  $b = <pre>' . var_export( $b , true ) . '</pre>' ; exit(0);
*/
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
                <li><a href="javascript:transform_text_area_php_en_rev(&quot;txtar1&quot;)"  class="yysucces">convertir</a>&nbsp;</li>
                
            </ul>
        </div>

  <h1>Convertir un php en rev</h1>
  
  <div>
   <a class="yysucces" href="javascript:__gi1.aller_a_la_position(&quot;txtar1&quot;)">aller à la position</a>
   <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">👊</a>
   <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">🖐</a>
  </div>
  <textarea class="txtar1" id="txtar1" rows="9" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <div id="resultat1"></div>
  <div>
   <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
   <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">👊</a>
   <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">🖐</a>
   <a class="yysucces" href="javascript:__gi1.aller_a_la_position(&quot;txtar2&quot;)">aller à la position</a>
  </div>
  <textarea class="txtar1" id="txtar2" rows="9" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <div>
   <a class="yyinfo" href="javascript:__gi1.convertir_textearea_rev_vers_textarea_php('txtar2','txtar3')">R2P↧</a>
   <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">👊</a>
   <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">🖐</a>
  </div>
  <textarea class="txtar1" id="txtar3" rows="9" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>


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
    'js_a_inclure'=>array('js/html.js','js/compile1.js','js/javascript.js',

     'js/convertit-php-en-rev0.js','js/convertit-html-en-rev1.js','js/convertit-js-en-rev1.js','js/html.js','js/php.js'
    ),
    'module_a_inclure' => array('js/module_interface1.js','js/module_html.js'),
    'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='<script type="text/javascript">
window.addEventListener(\'load\',function(){
  chargerLeDernierSourcePhp();
//  transformPhpEnRev();
 }
);
</script>';
$o1.=html_footer1($par);
print($o1);$o1='';
/*

<?php
//- Chart javascript code
?>
<script type='text/javascript'>
 x.y('string', '<?php echo $a; ?>');
 u.v('number', '<?php echo $b; ?>');
</script>

*/
?>
<script type="text/javascript">
/*

const paragraph = 'The quick <Brown> fox jumps over the lazy dog. It barked.';
const regex = /(<[a-zA-Z]+>)/g;
const found = paragraph.match(regex);

console.log(found);

*/

</script>