<?php
define('BNF',basename(__FILE__));
require_once('aa_include.php');
initialiser_les_services( /*sess*/ true, /*bdd*/ true);

if(!(isset($_GET['__id_des_bases']))){

    ajouterMessage('erreur',__LINE__ . ' : veuillez sélectionner au moins une base ');
    recharger_la_page('zz_bdds_l1.php');

}

sql_inclure_reference(49);
/*sql_inclure_deb*/
require_once(INCLUDE_PATH . '/sql/sql_49.php');
/*sql_inclure_fin*/
$tt=sql_49(array( 'T0_chi_id_basedd' => $_GET['__id_des_bases'], 'T0_chx_cible_id_basedd' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));
$tableau_en_entree=explode(',',$_GET['__id_des_bases']);
$__nbEnregs=0;

if($tt[__xst] === true){

    $__nbEnregs=$tt[__xva][0][0];

}


if($__nbEnregs === 0){

    ajouterMessage('erreur',__LINE__ . ' : veuillez sélectionner une base qui existe ');
    recharger_la_page('zz_bdds_l1.php');

}


if($__nbEnregs !== count($tableau_en_entree)){

    ajouterMessage('erreur',__LINE__ . ' : veuillez sélectionner des bases qui existent ');
    recharger_la_page('zz_bdds_l1.php');

}

$o1='';
$o1=html_header1(array( 'title' => 'svg de base(s)', 'description' => 'svg de base(s)'));
print($o1);
$o1='';?>
<div class="menuScroller">
    <ul>
        <li>
            <a href="javascript:__module_svg1.zoomPlus()" class="yysucces">Z+</a>
            &nbsp;
        </li>
        <li>
            <a href="javascript:__module_svg1.zoomMoins()" class="yysucces">Z-</a>
            &nbsp;
        </li>
    </ul>
</div>
<h1>Svg de la base</h1>
<div id="div_svg1" style="background: url(&quot;data:image/svg+xml,%3Csvg xmlns=\&quot;http://www.w3.org/2000/svg\&quot; viewBox=\&quot;0 0 10 10\&quot;%3E%3Cpath d=\&quot;M 0 0 l 10 10 l 0 -10 l -10 10 Z\&quot; fill=\&quot;black\&quot; fill-opacity=\&quot;.04\&quot;/%3E%3C/svg%3E&quot;) 208px 261px / 10px;">
    <svg id="refZnDessin" transform="rotate(0 0 0)" viewBox="0 0 200 200" style="border: 0; position: relative; background: transparent; top: 0px; left: 0px; width: 200px; height: 200px;">
        <text id="message_dans_le_svg" x="10" y="20" style="font-size:16px;stroke:black;stroke-width:0.1;fill:black;font-family:Verdana;">
            Veuillez patienter s'il vous plaît !
        </text>
    </svg>
</div>
<?php
$o1 .= '<input type="hidden" id="donnees_travail" value="' . enti1($_GET['__id_des_bases']) . '" />';
$js_a_executer_apres_chargement=array(/* */
    array( 'nomDeLaFonctionAappeler' => '#ne_rien_faire1', 'parametre' => array( 'c\'est pour', 'l\'exemple'))
);
$par=array(/* */
    'module_a_inclure' => array( 'js/module_svg_bdd.js'),
    'js_a_inclure' => array(
            'js/sql.js',
            'js/convertion_sql_en_rev.js',
            'js/jslib/sqlite_parser_from_demo.js',
            'js/pour_svg.js',
            'js/jslib/Sortable.js'
        ),
    'js_a_executer_apres_chargement' => $js_a_executer_apres_chargement
);
$o1 .= '';
$o1 .= html_footer1($par);
print($o1);
$o1='';