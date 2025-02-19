<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$o1=html_header1(array( 'title' => 'convertir un sql en rev', 'description' => 'convertir un sql en rev'));
print($o1);
$o1='';
?>
<div class="menuScroller">
    <a href="javascript:__gi1.charger_source_de_test_sql('txtar1')">source de test</a>
    <a href="javascript:__gi1.transform_sql_de_textarea_en_rev2('txtar1' , 'txtar2')" class="yysucces">convertir2</a>
</div>
<h1>Convertir un sql en rev</h1>
<div class="yyconteneur_de_texte1">
    <a style="float:right;" href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar1&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">👊</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">🖐</a>
    <textarea class="txtar1" id="txtar1" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div class="yyconteneur_de_texte1">
    <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
    <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar2&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">👊</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">🖐</a>
    <a style="float:right;margin-right:15px;" href="javascript:__gi1.raz_la_text_area(&quot;txtar2&quot;);" title="raz de la zone">🚫</a>
    <textarea class="txtar1" id="txtar2" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div class="yyconteneur_de_texte1">
    <a class="yysucces" href="javascript:__gi1.transform_rev_de_textarea_en_sql2(&quot;txtar2&quot; , &quot;txtar3&quot;);" title="convertir rev en SQL">R2S2</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar3&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">👊</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">🖐</a>
    <a style="float:right;margin-right:15px;" href="javascript:__gi1.raz_la_text_area(&quot;txtar3&quot;);" title="raz de la zone">🚫</a>
    <textarea class="txtar1" id="txtar3" rows="12" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<?php
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar1', 'mode' => 'source')),
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar2', 'mode' => 'rev')),
    array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple'))
);
$par=array(/* */
    'js_a_inclure' => array(/*  */
            'js/jslib/sqlite-parser.js'
        ),
    'module_a_inclure' => array(/* */
            'js/mf_rev_vers_sql1.js',
            'js/mf_astsqliteparseur_vers_rev1.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1 .= '<script type="text/javascript">
</script>';
?>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>
window.addEventListener( 'load' , function(){
        setTimeout( function(){
                var fta_traiteSql_dernier_fichier_charge=localStorage.getItem( "fta_traiteSql_dernier_fichier_charge" );
                if(fta_traiteSql_dernier_fichier_charge !== null){
                    document.getElementById( "txtar1" ).value=fta_traiteSql_dernier_fichier_charge;
                    __gi1.transform_sql_de_textarea_en_rev2( "txtar1" , "txtar2" );
                }
            } , 100 );
    } );
//</source_javascript_rev>
//]]>
</script>

<?php
$o1 .= html_footer1($par);
print($o1);
$o1='';