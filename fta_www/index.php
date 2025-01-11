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
            <a href="javascript:chargerSourceDeTest()">charger le source de test</a>
        </li>
        <li>
            <a href="javascript:transformLeRev(false)" class="yysucces">traiter sans cst dans racine</a>
        </li>
        <li>
            <a href="javascript:transformLeRev(true)" class="yysucces">traiter avec cst dans racine</a>
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
<div>
    <a href="javascript:__gi1.parentheses1(&quot;txtar1&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>
    <a href="javascript:__gi1.formatter_le_source_rev(&quot;txtar1&quot;);" title="formatter le source rev">(😊)</a>
    <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;txtar1&quot;);" title="ajouter un commentaire et formatter">#()(😊)</a>
    <a href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;txtar1&quot;);" title="agrandir ou réduire la zone">🖐👊</a>
</div>
<textarea class="txtar1" id="txtar1" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
<div id="resultat1"></div>
<?php
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'txtar1', 'mode' => 'rev')),
    array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple'))
);
$par=array(/* */
    'js_a_inclure' => array( 'js/pour-index_php0.js'),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1 .= html_footer1($par);
print($o1);
$o1='';