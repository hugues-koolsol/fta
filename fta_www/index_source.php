<?php
define('BNF' , basename(__FILE__));
require_once('aa_include.php');
session_start();
start_session_messages();
$o1='';
$a=array('title' => 'index source','description' => 'index source' , 'opt' => array('bodyPaddingTop'=>48));
$o1=html_header1($a);
$o1.='<style>';
$o1.='#arrayed td{max-width:150px;overflow-x:auto;}';
$o1.='</style>';
print($o1);$o1='';

?>
<nav style="position: fixed;top: 24px;left: 0;background: aliceblue;width:100%;">
        <button onclick="enregistrer2()">Enregistrer</button>
        <a href="javascript:insertSource('choix');">Choix</a>
        <a href="javascript:insertSource('boucle');">Boucle</a>
        <a href="javascript:insertSource('appelf');">appelf</a>
        <a href="javascript:insertSource('affecte');">affecte</a>
        <a href="javascript:parentheses();" title="repérer la parenthèse fermante correspondante">(|...)</a>
        <a href="javascript:decaler('droite');">(|&gt;&gt;&gt;</a>
        <a href="javascript:mettreEnCommentaire();">#()</a>
        <input type="text" id="nomDuSource" disabled="true" style="max-width: 150px;" />
        <button id="sauvegarderLeNormalise" onclick="sauvegardeTexteSource()" disabled="true" data-fichiertexte="" >sauvegarder le texte normalise</button>         
</nav>
   <table>
     <tr>
       <td id="zoneRevFiles" style="max-width:100px;overflow-x: hidden;"></td>
       <td>
         <textarea id="zonesource" class="yytextSmall" cols="150" rows="60" spellcheck="false" style="height:75vh;padding:3px 3px 3px 8px;"></textarea>
       </td>
       <td style="vertical-align: text-top;">
         <textarea id="normalise" class="yytextSmall" style="display:none" cols="100" rows="10" spellcheck="false"></textarea>
       </td>
     </tr>
     <tr>
       <td colspan="3">
         <div id="message_erreur"></div>
       </td>
     </tr>
   </table>
   <table id="arrayed"></table>
   <div id="donneesComplementaires"></table>
<script type="text/javascript">


</script>
<?php
$a=array('js' => array('js/compile1.js','js/php.js','js/javascript.js','js/html.js','js/sql.js','js/index_source_script-original.js'));
$o1=concat($o1,html_footer1($a));
print($o1);
$o1='';
