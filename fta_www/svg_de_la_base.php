<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true); // sess,bdd

if(!isset($_GET['__id_des_bases'])){
  ajouterMessage('erreur' ,  __LINE__ .' : veuillez sélectionner au moins une base '  );
  recharger_la_page('zz_bdds_l1.php');
}

$sql0='SELECT COUNT(*) FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_bdds WHERE chi_id_basedd IN ('.$_GET['__id_des_bases'] . ')'; 
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql0 , true ) . '</pre>' ; exit(0);
$__nbEnregs=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql0);
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__nbEnregs , true ) . '</pre>' ; exit(0);
if($__nbEnregs===false || $__nbEnregs===0){
  ajouterMessage('erreur' ,  __LINE__ .' : veuillez sélectionner une base '  );
  recharger_la_page('zz_bdds_l1.php');
}

$o1='';
$o1=html_header1(array('title'=>'svg de base(s)' , 'description'=>'svg de base(s)'));
print($o1);$o1='';
?>

        <div class="menuScroller">
            <ul>
                <li><a href="javascript:__module_svg1.zoomPlus()"  class="yysucces">Z+</a>&nbsp;</li>
                <li><a href="javascript:__module_svg1.zoomMoins()"  class="yysucces">Z-</a>&nbsp;</li>
            </ul>
        </div>
  <h1>Svg de la base</h1>
  
  
  <div id="div_svg1" style="background: url(&quot;data:image/svg+xml,%3Csvg xmlns=&#92;&quot;http://www.w3.org/2000/svg&#92;&quot; viewBox=&#92;&quot;0 0 10 10&#92;&quot;%3E%3Cpath d=&#92;&quot;M 0 0 l 10 10 l 0 -10 l -10 10 Z&#92;&quot; fill=&#92;&quot;black&#92;&quot; fill-opacity=&#92;&quot;.04&#92;&quot;/%3E%3C/svg%3E&quot;) 208px 261px / 10px;">
   <svg id="refZnDessin" transform="rotate(0 0 0)" viewBox="0 0 200 200" style="border: 0; position: relative; background: transparent; top: 0px; left: 0px; width: 200px; height: 200px;">
    <text id="message_dans_le_svg" x="10" y="20" style="font-size:16px;stroke:black;stroke-width:0.1;fill:black;font-family:Verdana;">Veuillez patienter s'il vous plaît !</text>
   </svg>  
  </div>

  
  
<?php
$o1.='<input type="text" id="donnees_travail" value="'.enti1($_GET['__id_des_bases']).'" />';

$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array(
    'module_a_inclure'=>array('js/module_svg_bdd.js'),
    'js_a_inclure'=>array('js/sql.js' , 'js/convertion_sql_en_rev.js' , 'js/jslib/sqlite_parser_from_demo.js', 'js/pour_svg.js','js/jslib/Sortable.js'),
    'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='';

$o1.=html_footer1($par);
print($o1);$o1='';
