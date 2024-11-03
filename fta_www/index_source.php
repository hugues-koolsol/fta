<?php
/*
  ==========================================================================================================
  php générique de la page
  ==========================================================================================================
*/
/* on définit le "base name file"  pour les autorisations*/
define("BNF",basename(__FILE__));
require_once('aa_include.php');
session_start();
$o1='';
$a=array( 'title' => 'index source', 'description' => 'index source', 'opt' => array( 'bodyPaddingTop' => 48));
$o1=html_header1($a);
/*
  ==========================================================================================================
  ici commence le php spécifique de la page
  ==========================================================================================================
*/
$o1=$o1.'<style>';
$o1=$o1.'#arrayed td{max-width:150px;overflow-x:auto;}';
$o1=$o1.'</style>';
print($o1);
$o1='';?>

        <div class="menuScroller">
            <ul>
                
                <li><button class="yyinfo" onclick='enregistrer2()'>Convertir</button></li>

                <li><input type="text" id="nomDuSource" disabled="true" style="max-width: 150px;" /></li>
                <li><button id="sauvegarderLeNormalise" onclick="sauvegardeTexteSource()" disabled="true" data-fichiertexte="">sauvegarder le texte normalise</button></li>
                
            </ul>
        </div>
        <h1>convertir un rev en js,php,html,sql...</h1>
        <div class="not menuScroller">
         <a href="javascript:__gi1.inserer_source1(&quot;choix&quot;,&quot;zonesource&quot;);">choix</a>
         <a href="javascript:__gi1.inserer_source1(&quot;boucle&quot;,&quot;zonesource&quot;);">Boucle</a>
         <a href="javascript:__gi1.inserer_source1(&quot;appelf&quot;,&quot;zonesource&quot;);">appelf</a>
         <a href="javascript:__gi1.inserer_source1(&quot;affecte&quot;,&quot;zonesource&quot;);">affecte</a>
         <a href="javascript:__gi1.parentheses1(&quot;zonesource&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>
        </div>
    <div class="yy_div_limitee">abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_</div>
    <table>
        <tbody>
            <tr>
                <td id="zoneRevFiles" style="max-width:100px;overflow-x: hidden;"></td>
                <td>
                    <textarea id="zonesource" class="yytextSmall" cols="150" rows="60" spellcheck="false" style="height:75vh;"></textarea>
                </td>
                <td style="vertical-align: text-top;">
                    <textarea id="normalise" class="yytextSmall" style="display:none" cols="100" rows="10" spellcheck="false"></textarea>
                </td>
            </tr>
            <tr>
                <td colspan='3'>
                    <div id="message_erreur"></div>
                </td>
            </tr>
        </tbody>
    </table>
    <table id="arrayed"></table>
    <div id="donneesComplementaires"></div>
<?php
/*
  ici finit le php spécifique de la page
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea' , 'parametre' => array( 'nom' => 'zonesource' , 'mode' => 'rev' )
    )
);


$a=array( 
  'js_a_inclure' => array( 'js/compile1.js', 'js/php.js', 'js/javascript.js', 'js/sql.js', 'js/index_source_script-v0.js'),
  'module_a_inclure' => array('js/module_html.js'),
  'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1=concat($o1,html_footer1($a));
print($o1);
$o1='';