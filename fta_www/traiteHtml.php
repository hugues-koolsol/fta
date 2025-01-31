<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$o1=html_header1(array( 'title' => 'convertir un html en rev', 'description' => 'convertir un html en rev'));
print($o1);
$o1='';?>
<!-- html dans php -->
<div class="menuScroller">
    <ul>
        <li>
            <a href="javascript:__gi1.remplir_une_textarea_avec_un_source_de_test_html('txtar1')">source de test</a>
        </li>
        <li>
            <a href="javascript:__gi1.convertir_text_area_html_en_rev(&quot;txtar1&quot;,&quot;{'zone_html_rev':'txtar2','zone_html_resultat':'txtar3'}&quot;)" class="yysucces">html-&gt;rev</a>
        </li>
    </ul>
</div>
<h1>Convertir un html en rev</h1>
<div class="yyconteneur_de_texte1">
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar1&quot;)">aller à la ligne n°</a>
    <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar1&quot;)">aller à la position</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    <textarea class="txtar1" id="txtar1" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div class="yyconteneur_de_texte1">
    <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
    <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar2&quot;,1)">aller à la ligne n°</a>
    <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar2&quot;)">aller à la position</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    <textarea class="txtar1" id="txtar2" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div class="yyconteneur_de_texte1">
    <a href="javascript:__gi1.convertir_textearea_rev_vers_textarea_html( 'txtar2' , 'txtar3' )" class="yyinfo">rev-&gt;html</a>
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar3&quot;,1)">aller à la ligne n°</a>
    <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar3&quot;)">aller à la position</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">👊</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">🖐</a>
    <a style="float:right;margin-right:15px;" href="javascript:__gi1.raz_la_text_area(&quot;txtar3&quot;);" title="raz de la zone">🚫</a>
    <textarea class="txtar1" id="txtar3" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<?php
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar1', 'mode' => 'source')),
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar2', 'mode' => 'rev'))
);
$par=array(/* */
    'js_a_inclure' => array(/*il peut y avoir du javascript dans le html*/
            'js/jslib/acorn.js'
        ),
    'module_a_inclure' => array(/**/
            'js/module_html.js',
            'js/module_conversion_ast_de_js_acorn_vers_rev.js',
            'js/m_rev_vers_js1.js'
            
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1 .= '<script type="text/javascript">
window.addEventListener(\'load\',function(){
    var fta_traitehtml_dernier_fichier_charge=localStorage.getItem(\'fta_traitehtml_dernier_fichier_charge\');
    if(fta_traitehtml_dernier_fichier_charge !== null){
        document.getElementById(\'txtar1\').value=fta_traitehtml_dernier_fichier_charge;
    }

 }
)
</script>';
$o1 .= html_footer1($par);
print($o1);
$o1='';