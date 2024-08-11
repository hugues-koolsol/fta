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
  <br />
  exemple
  <pre>
sélectionner(
   valeurs(
      champ(T0.chi_id_dossier),
      champ(chp_nom_dossier),
      champ(chx_cible_dossier),
      champ(t1.chp_dossier_cible),
      tous_les_champs(),
      plus(champ(a) , 2),
      concat('=>',champ(chi_id_dossier),'<='),
      compter(tous_les_champs()),
      5,
   )
   ,provenance(
      table_reference(source(nom_de_la_table(tbl_dossiers,t0))),
      jointure_croisée(
         source(nom_de_la_table(tata,t2)
         )),
      jointure_gauche(
         source(nom_de_la_table(tbl_cibles,t1)
         ),contrainte(egal(champ(t1.chi_id_cible) , champ(t0.chx_cible_dossier)))),
   )
   ,conditions(
      et(egal(champ(T0.chi_id_dossier) , 1) , egal(champ(t2.id) , champ(t0.chi_id_dossier))),
   )
   ,trier_par((champ(chp_nom_dossier),décroissant()),(champ(chx_cible_dossier),croissant()),)
   ,limité_à(quantité(champ(roro)),début(3))
),  
  </pre>
  
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
