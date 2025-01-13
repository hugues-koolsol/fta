<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$o1=html_header1(array( 'title' => 'convertir un js en rev', 'description' => 'convertir un js en rev'));
print($o1);
$o1='';?>
<div class="menuScroller">
    <ul>
        <li>
            <a href="javascript:chargerSourceDeTestJs()">source de test</a>
            &nbsp;
        </li>
        <li>
            <a href="javascript:bouton_dans_traite_js_transform_textarea_js_en_rev_avec_acorn3( 'txtar1' , 'txtar2' )" class="yysucces">convertir module acorn 3</a>
            &nbsp;
        </li>
    </ul>
</div>
<h1>Convertir un js en rev</h1>
<div>
    <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">👊</a>
    <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">🖐</a>
    <a class="yysucces" href="javascript:__gi1.aller_a_la_position(&quot;txtar1&quot;)">aller à la position</a>
</div>
<textarea class="txtar1" id="txtar1" style="" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
<div id="resultat1"></div>
<div>
    <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
    <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
    <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">👊</a>
    <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">🖐</a>
    <a href="javascript:__gi1.raz_la_text_area(&quot;txtar2&quot;);" title="raz de la zone">🚫</a>
</div>
<textarea class="txtar1" id="txtar2" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
<div>
    <a class="yyinfo" href="javascript:__gi1.convertir_textearea_rev_vers_textarea_js(&quot;txtar2&quot; , &quot;txtar3&quot;);" title="convertir rev en JS">R2J</a>
    <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">👊</a>
    <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">🖐</a>
    <a href="javascript:__gi1.raz_la_text_area(&quot;txtar3&quot;);" title="raz de la zone">🚫</a>
</div>
<textarea class="txtar1" id="txtar3" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
<?php
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar1', 'mode' => 'source')),
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar2', 'mode' => 'rev')),
    array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple'))
);
$par=array(/* */
    'js_a_inclure' => array( 'js/javascript.js', 'js/convertit-html-en-rev1.js', 'js/convertit-js-en-rev1.js', 'js/jslib/acorn.js'),
    'module_a_inclure' => array(/**/
            'js/module_interface1.js',
            'js/module_html.js',
            'js/module_conversion_ast_de_js_acorn_vers_rev.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);?>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>
window.addEventListener("load",function(){
        setTimeout(function(){
                chargerLeDernierSourceJs();
                bouton_dans_traite_js_transform_textarea_js_en_rev_avec_acorn3("txtar1","txtar2");
            },100);
    });
//</source_javascript_rev>
//]]>
</script>

<?php
$o1 .= html_footer1($par);
print($o1);
$o1='';