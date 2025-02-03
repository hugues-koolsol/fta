<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$o1=html_header1(array( 'title' => 'php ⇒ rev', 'description' => 'convertir un php en rev'));
print($o1);
$o1='';
?>
<div class="menuScroller">
    <ul>
        <li>
            <a href="javascript:__gi1.remplir_une_textarea_avex_un_source_de_test_php(&quot;txtar1&quot;)">source de test</a>
        </li>
        <li>
            <a href="javascript:__gi1.convertir_text_area_php_en_rev_avec_nikic(&quot;txtar1&quot;,&quot;txtar2&quot;,&quot;{}&quot;)" class="yysucces">nicky htm strict</a>
        </li>
        <li>
            <a href="javascript:__gi1.convertir_text_area_php_en_rev_avec_nikic(&quot;txtar1&quot;,&quot;txtar2&quot;,&quot;{'nettoyer_html':true}&quot;)" class="yysucces">nicky htm echo</a>
        </li>
        
        <li>
            <a href="javascript:__gi1.bouton_convertir_text_area_php_en_rev_avec_nikic2(&quot;txtar1&quot;,&quot;txtar2&quot;,&quot;{'nettoyer_html':false}&quot;,true)" class="yysucces">nicky htm strict 2 </a>
        </li>
        <li>
            <a href="javascript:__gi1.bouton_convertir_text_area_php_en_rev_avec_nikic2(&quot;txtar1&quot;,&quot;txtar2&quot;,&quot;{'nettoyer_html':true}&quot;,true)" class="yysucces">nicky htm echo 2</a>
        </li>
        
        
        
        <li>
            <a href="javascript:__gi1.convertir_text_area_php_en_rev_avec_php_parseur_js(&quot;txtar1&quot;,&quot;txtar2&quot;,&quot;{'nettoyer_html':false}&quot;)" class="yyinfo">php conv htm</a>
        </li>
        <li>
            <a href="javascript:__gi1.convertir_text_area_php_en_rev_avec_php_parseur_js(&quot;txtar1&quot;,&quot;txtar2&quot;,&quot;{'nettoyer_html':true}&quot;)" class="yyinfo">php conv htm</a>
        </li>
    </ul>
</div>
<h1>Convertir un php en rev</h1>
<div class="yyconteneur_de_texte1">
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar1&quot;,1)">aller à la ligne n°</a>
    <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar1&quot;)">aller à la position</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar1&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar1&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    <textarea class="txtar1" id="txtar1" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div class="yyconteneur_de_texte1">
    <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar2&quot;);" title="formatter le source rev">(😊)</a>
    <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar2&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar2&quot;,1)">aller à la ligne n°</a>
    <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar2&quot;)">aller à la position</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar2&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar2&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    <a style="float:right;margin-right:15px;" href="javascript:__gi1.raz_la_text_area(&quot;txtar2&quot;);" title="raz de la zone">🚫</a>
    <textarea class="txtar1" id="txtar2" rows="15" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div class="yyconteneur_de_texte1">
    <a class="yyavertissement" href="javascript:__gi1.convertir_textearea_rev_vers_textarea_php2(&quot;txtar2&quot;,&quot;txtar3&quot;,null,null);" title="convertir rev en php">R2P↧</a>
    <a style="float:right;" class="yysucces" href="javascript:__gi1.aller_a_la_ligne(&quot;txtar3&quot;,1)">aller à la ligne n°</a>
    <a style="float:right;" class="yyinfo" href="javascript:__gi1.aller_a_la_position(&quot;txtar3&quot;)">aller à la position</a>
    <a style="float:right;" href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">&nbsp;👊&nbsp;</a>
    <a style="float:right;" href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">&nbsp;🖐&nbsp;</a>
    <a style="float:right;margin-right:15px;" href="javascript:__gi1.raz_la_text_area(&quot;txtar3&quot;);" title="raz de la zone">🚫</a>
    <textarea class="txtar1" id="txtar3" rows="20" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<?php
$js_a_executer_apres_chargement=array(/* fonctions js à éxécuter un fois que tout est chargé */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar1', 'mode' => 'source')),
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar2', 'mode' => 'rev'))
);
$par=array(/* éléments à passer au pied de page : le php peut contenir du html et du js, donc on importe tout */
    'js_a_inclure' => array(/**/
            'js/convertit-php-en-rev0.js',
            'js/jslib/acorn.js',
            'js/jslib/php-parser.js'
        ),
    'module_a_inclure' => array(
            /* */
            'js/module_html.js',
            'js/mf_astphpparseur_vers_rev1.js',
            'js/mf_astjs_vers_rev1.js',
            'js/mf_rev_vers_js1.js',
            'js/mf_rev_vers_php1.js',
            'js/mf_astphpnikic_vers_rev1.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);

if(isset($_SESSION[APP_KEY]['cible_courante']['chi_id_cible'])){

    $nom_bref='aa_js_sql_cible_' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . '.js';
    $nom_complet=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'sql/' . $nom_bref;
    
    if(is_file($nom_complet)){

        $o1 .= '<script type="text/javascript">' . PHP_EOL . file_get_contents($nom_complet) . '</script>';

    }else{

        $o1 .= '<script type="text/javascript">/*fichier non trouve*/</script>';
    }


}else{

    $o1 .= '<script type="text/javascript">/*' . CRLF . '=====================================' . CRLF . 'ATTENTION veuillez sélectionner une cible' . CRLF . '=====================================================' . CRLF . '*/</script>';
}

?>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>
window.addEventListener('load',function(){
        setTimeout(function(){
                var fta_indexhtml_php_dernier_fichier_charge=localStorage.getItem("fta_indexhtml_php_dernier_fichier_charge");
                if(fta_indexhtml_php_dernier_fichier_charge !== null){
                    document.getElementById('txtar1').value=fta_indexhtml_php_dernier_fichier_charge;
                    __gi1.convertir_text_area_php_en_rev_avec_php_parseur_js("txtar1","txtar2","{'nettoyer_html':true}");
                }
            },100);
    });
//</source_javascript_rev>
//]]>
</script>

<?php
$o1 .= html_footer1($par);
print($o1);
$o1='';