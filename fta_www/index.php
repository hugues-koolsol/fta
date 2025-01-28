<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services(true,false);
$o1='';
$o1=html_header1(array( 'title' => 'Accueil', 'description' => 'Accueil'));
print($o1);
$o1='';
ob_flush();?>
<div class="menuScroller">
    <ul>
        <li>
            <a href="javascript:__gi1.remplir_une_textarea_avex_un_source_de_test_rev(&quot;txtar1&quot;)">charger le source de test</a>
        </li>
        <li>
            <a href="javascript:__gi1.lire_un_rev_et_le_transformer_en_tableau(&quot;txtar1&quot;,false)" class="yysucces">traiter sans cst dans racine</a>
        </li>
        <li>
            <a href="javascript:__gi1.lire_un_rev_et_le_transformer_en_tableau(&quot;txtar1&quot;,true)" class="yysucces">traiter avec cst dans racine</a>
        </li>
        <li>
            <a href="javascript:__gi1.aller_au_caractere_de_la_textarea(&quot;txtar1&quot;)" class="yysucces">aller au caractère</a>
        </li>
    </ul>
</div>
<h1>Page d'accueil</h1>
<p>Vous pouvez insérer un source de programme rev et cliquer sur le bouton vert pour le traiter</p>
<p>Vous pouvez aussi cliquer sur le bouton "charger le source de test" pour voir un exemple</p>
<p>
    <b>Le résultat du traitement</b>
    sera alors affiché plus bas dans la page
</p>
<div class="yyconteneur_de_texte1">
    <a href="javascript:__gi1.parentheses1(&quot;txtar1&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>
    <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar1&quot;);" title="formatter le source rev">(😊)</a>
    <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar1&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
    <a href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar1&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
    <textarea class="txtar1" id="txtar1" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
</div>
<div id="resultat1"></div>
<?php
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar1', 'mode' => 'rev'))
);
$par=array(/* */
    'js_a_inclure' => array(),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1 .= '<script type="text/javascript">
window.addEventListener("load",function(){
        var fta_indexhtml_dernier_fichier_charge=localStorage.getItem("fta_indexhtml_dernier_fichier_charge");
        if(fta_indexhtml_dernier_fichier_charge !== null){
            document.getElementById("txtar1").value=fta_indexhtml_dernier_fichier_charge;
            var lines=fta_indexhtml_dernier_fichier_charge.split(/\r\n|\r|\n/);
            var count=lines.length;
            document.getElementById("txtar1").setAttribute("rows",count + 1);
        }
    }
);
</script>' . PHP_EOL;
$o1 .= html_footer1($par);
print($o1);
$o1='';