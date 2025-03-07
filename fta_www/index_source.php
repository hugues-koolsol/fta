<?php
/*
  =====================================================================================================================
  php générique de la page
  =====================================================================================================================
*/
/* on définit le "base name file"  pour les autorisations*/
define("BNF",basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$a=array( 'title' => 'index source', 'description' => 'index source', 'opt' => array( 'bodyPaddingTop' => 48));
$o1=html_header1($a);
/*
  =====================================================================================================================
  ici commence le php spécifique de la page
  =====================================================================================================================
*/
$o1 .= '<style>';
$o1 .= '#arrayed td{max-width:150px;overflow-x:auto;}';
$o1 .= '</style>';
print($o1);
$o1='';
?>
<div class="menuScroller">
    <button class="yyinfo" onclick="enregistrer2()">Convertir</button>
    <input type="text" id="nomDuSource" disabled="true" style="max-width: 150px;" />
    <button id="sauvegarderLeNormalise" onclick="sauvegardeTexteSource()" disabled="true" data-fichiertexte="">sauvegarder le texte normalise</button>
</div>
<h1>convertir un rev en js,php,html,sql...</h1>
<div class="not menuScroller">
    <a href="javascript:__gi1.inserer_source1(&quot;choix&quot;,&quot;zonesource&quot;);">choix</a>
    <a href="javascript:__gi1.inserer_source1(&quot;boucle&quot;,&quot;zonesource&quot;);">Boucle</a>
    <a href="javascript:__gi1.inserer_source1(&quot;appelf&quot;,&quot;zonesource&quot;);">appelf</a>
    <a href="javascript:__gi1.inserer_source1(&quot;affecte&quot;,&quot;zonesource&quot;);">affecte</a>
    <a href="javascript:__gi1.parentheses1(&quot;zonesource&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>
</div>
<div class="yy_div_limitee">
    <!-- un test pour le défilement horizontal -->abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_
</div>
<table>
    <tbody>
        <tr>
            <td id="zoneRevFiles" style="max-width:100px;overflow-x: hidden;"></td>
            <td>
                <div class="yyconteneur_de_texte1">
                    <textarea id="zonesource" class="yytextSmall" cols="150" rows="60" spellcheck="false" style="height:75vh;"></textarea>
                </div>
            </td>
            <td style="vertical-align: text-top;">
                <textarea id="normalise" class="yytextSmall" style="display:none" cols="100" rows="10" spellcheck="false"></textarea>
            </td>
        </tr>
    </tbody>
</table>
<table id="arrayed"></table>
<div id="donneesComplementaires">
    <a id="bouton_voir_tableau" href="javascript:voirTableau1('zonesource')" style="display: none; padding: 2px; border: 2px solid red; margin: 2px;">Voir tableau</a>
    <a id="bouton_voir_matrice" href="javascript:voirMatrice1('zonesource')" style="display: none; padding: 2px; border: 2px solid red; margin: 2px;">Voir matrice</a>
    <a id="bouton_voir_source" href="javascript:voirSourceGenere(0)" style="display: none; padding: 2px; border: 2px solid red; margin: 2px;">Voir source généré</a>
    <div id="zoneContenantLeTableauCaracteres" style="display: none;overflow-x:scroll;"></div>
    <div id="zoneContenantLaMatrice" class="tableau1" style="display: none;overflow-x:scroll;"></div>
    <textarea rows="30" cols="120" id="zoneContenantLeSourceGenere2" style="display:none;background: lightcyan;"></textarea>
</div>
<?php
/*
  ici finit le php spécifique de la page
*/
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea', 'parametre' => array( 'nom' => 'zonesource', 'mode' => 'rev')),
    array( 'nomDeLaFonctionAappeler' => 'initialisation_page_rev', 'parametre' => array( 'nom' => 'zonesource', 'mode' => 'rev'))
);
$a=array(/* */
    'js_a_inclure' => array(/**/
            'js/index_source_script-v0.js'
        ),
    'module_a_inclure' => array(
            /**/
            'js/module_html.js',
            'js/mf_rev_vers_js1.js',
            'js/mf_rev_vers_php1.js',
            'js/mf_rev_vers_sql1.js',
            'js/mf_rev_vers_html1.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1=concat($o1,html_footer1($a));
print($o1);
$o1='';