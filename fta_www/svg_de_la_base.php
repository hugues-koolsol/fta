<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();

if(!isset($_GET['__id_des_bases'])){
  ajouterMessage('erreur' ,  __LINE__ .' : veuillez sélectionner au moins une base '  );
  recharger_la_page('zz_bdds_l1.php');
}



$db = new SQLite3('../fta_inc/db/sqlite/system.db');

$sql0='select count(*) from tbl_bases_de_donnees where chi_id_basedd in ('.$_GET['__id_des_bases'] . ')'; 
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql0 , true ) . '</pre>' ; exit(0);
$__nbEnregs=$db->querySingle($sql0);
if($__nbEnregs===false){
  ajouterMessage('erreur' ,  __LINE__ .' : pas de base trouvée '  );
  recharger_la_page('zz_bdds_l1.php');
}

$o1='';
$o1=html_header1(array('title'=>'svg de base(s)' , 'description'=>'svg de base(s)'));
print($o1);$o1='';
?>

        <div class="menuScroller">
            <ul>
                <li><a href="javascript:alert('todo')"  class="yysucces">todo</a>&nbsp;</li>
            </ul>
        </div>
  <h1>Svg de la base</h1>
  
  <div id="divc" style="touch-action: none;border: 1px solid red;background: url(&quot;data:image/svg+xml,%3Csvg xmlns=\&quot;http://www.w3.org/2000/svg\&quot; viewBox=\&quot;0 0 10 10\&quot;%3E%3Cpath d=\&quot;M 0 0 l 10 10 l 0 -10 l -10 10 Z\&quot; fill=\&quot;black\&quot; fill-opacity=\&quot;.04\&quot;/%3E%3C/svg%3E&quot;) 208px 261px / 20px;">
   <svg id="refZnDessin" transform="rotate(0 0 0)" viewBox="0 0 200 200" style="border: 0px solid blue; position: relative; background: transparent; top: 0px; left: 0px; width: 200px; height: 200px;">
   <text id="message_dans_le_svg" x="10" y="20" style="font-size:16;stroke:black;stroke-width:0.1;fill:black;font-family:Verdana;">Veuillez patienter s'il vous plaît !</text>
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
    'js_a_inclure'=>array('js/sql.js' , 'js/convertion_sql_en_rev.js' , 'js/jslib/sqlite_parser_from_demo.js', 'js/pour_svg.js'),
    'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='<script type="text/javascript">
window.addEventListener(\'load\',function(){
//  charger_le_dernier_source_sql("txtar1");
//  transform_sql_de_textarea_en_rev("txtar1" , "txtar2");
 }
)
</script>';

$o1.=html_footer1($par);
print($o1);$o1='';
