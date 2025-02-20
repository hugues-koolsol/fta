<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$o1=html_header1(array( 'title' => 'convertir un js en rev', 'description' => 'convertir un js en rev'));
print($o1);
$o1='';
?>
<div class="menuScroller">
    <a href="javascript:__gi1.remplir_une_textarea_avex_un_source_de_test_js('txtar1')">source de test</a>
    <a href="javascript:__gi1.bouton_transform_textarea_js_en_rev_avec_acorn3( 'txtar1' , 'txtar2' , true )" class="yysucces">convertir module acorn 3</a>
</div>
<h1>Convertir un js en rev</h1>
<div class="yyconteneur_de_texte1">
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">👊</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">🖐</a>
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_position(&quot;txtar1&quot;)">aller à la position</a>
    <textarea class="txtar1" id="txtar1" style="" rows="18" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<!-- div id="resultat1"></div -->
<div class="yyconteneur_de_texte1">
    <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
    <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">👊</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">🖐</a>
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_position(&quot;txtar2&quot;)">aller à la position</a>
    <a style="float:right;margin-right:15px;" href="javascript:__gi1.raz_la_text_area(&quot;txtar2&quot;);" title="raz de la zone">&nbsp;🚫&nbsp;</a>
    <textarea class="txtar1" id="txtar2" rows="18" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div class="yyconteneur_de_texte1">
    <a class="yyinfo" href="javascript:__gi1.convertir_textearea_rev_vers_textarea_js2(&quot;txtar2&quot; , &quot;txtar3&quot;,null,null);" title="convertir rev en JS">R2J</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    <a style="float:right;margin-right:15px;" href="javascript:__gi1.raz_la_text_area(&quot;txtar3&quot;);" title="raz de la zone">&nbsp;🚫&nbsp;</a>
    <textarea class="txtar1" id="txtar3" rows="18" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<?php
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar1', 'mode' => 'source')),
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar2', 'mode' => 'rev'))
);
$par=array(/* */
    'js_a_inclure' => array(/* */
            'js/jslib/acorn.js'
        ),
    'module_a_inclure' => array(/* */
            'js/mf_astjs_vers_rev1.js',
            'js/mf_rev_vers_js1.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
?>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>
window.addEventListener( "load" , function(){
        var fta_indexhtml_javascript_dernier_fichier_charge=localStorage.getItem( 'fta_indexhtml_javascript_dernier_fichier_charge' );
        if(fta_indexhtml_javascript_dernier_fichier_charge !== null){
            document.getElementById( 'txtar1' ).value=fta_indexhtml_javascript_dernier_fichier_charge;
            setTimeout( function(){
                        /* on lance la conversion directement, ça devra être mis en paramètres */
                        __gi1.bouton_transform_textarea_js_en_rev_avec_acorn3('txtar1','txtar2',true);
                } , 16 );
        
        }
    } );
//</source_javascript_rev>
//]]>
</script>

<?php
$o1 .= html_footer1($par);
print($o1);
$o1='';