<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$o1=html_header1(array( 'title' => 'php ⇒ rev', 'description' => 'convertir un php en rev'));
print($o1);
$o1='';?>
    <h1>Convertir un php en rev</h1>
    <div style="width:90%;">
        <a href="javascript:chargerSourceDeTestPhp()">source de test</a>
        <a href="javascript:transform_text_area_php_en_rev(&quot;txtar1&quot;)" class="yysucces">convertir</a>
        <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar1&quot;,1)">aller à la ligne n°</a>
        <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar1&quot;)">aller à la position</a>
        <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
        <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    </div>
    <textarea class="txtar1" id="txtar1" rows="9" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
    <div style="width:90%;">
        <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
        <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
        <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar2&quot;,1)">aller à la ligne n°</a>
        <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar2&quot;)">aller à la position</a>
        <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
        <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    </div>
    <textarea class="txtar1" id="txtar2" rows="9" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
    <div style="width:90%;">
        <a class="yyinfo" href="javascript:__gi1.convertir_textearea_rev_vers_textarea_php(&quot;txtar2&quot;,&quot;txtar3&quot;,true)">R2P↧</a>
        <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar3&quot;,1)">aller à la ligne n°</a>
        <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar3&quot;)">aller à la position</a>
        <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
        <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    </div>
    <textarea class="txtar1" id="txtar3" rows="9" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea><?php
$js_a_executer_apres_chargement=array(
    /* fonctions js à éxécuter un fois que tout est chargé */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => 'txtar1'),
    array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple')));
$par=array(
    /* éléments à passer au pied de page */
    'js_a_inclure' => array(
            'js/html.js',
            'js/compile1.js',
            'js/javascript.js',
            'js/convertit-php-en-rev0.js',
            'js/convertit-html-en-rev1.js',
            'js/convertit-js-en-rev1.js',
            'js/html.js',
            'js/php.js' ,
            'js/sql.js' , 
            'js/convertion_sql_en_rev.js' ,
            'js/jslib/sqlite_parser_from_demo.js'),
    'module_a_inclure' => array( 'js/module_interface1.js', 'js/module_html.js'),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement);
$o1.='<script type="text/javascript">
window.addEventListener(\'load\',function(){
  chargerLeDernierSourcePhp();
//  transformPhpEnRev();
 }
);
</script>'.CRLF;
$o1.='<script type="text/javascript">'.CRLF.file_get_contents(INCLUDE_PATH.DIRECTORY_SEPARATOR.'sql/aa_js_sql.js').'</script>';
$o1.=html_footer1($par);
print($o1);
$o1='';
?>