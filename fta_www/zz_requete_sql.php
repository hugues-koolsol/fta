<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true); // sess,bdd

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles_l1.php'); 
}

$o1='';
$o1=html_header1(array('title'=>'requete sql' , 'description'=>'créer une requete sql'));
print($o1);$o1='';
?>

  <div class="menuScroller">
      <ul>
          <li><a href="javascript:__module_requete_sql1.nouvelle()"  class="yysucces">nouvelle requête</a> </li>
      </ul>
  </div>
  <h1>Requête Sql</h1>
  <div id="div_de_travail"></div>
  
<?php

$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array(
    'module_a_inclure'=>array('js/module_requete_sql.js'),
    'js_a_inclure'=>array('js/sql.js' , 'js/convertion_sql_en_rev.js' , 'js/jslib/sqlite_parser_from_demo.js', 'js/pour_requete_sql.js','js/jslib/Sortable.js'),
    'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.='';

$o1.=html_footer1($par);
print($o1);$o1='';
