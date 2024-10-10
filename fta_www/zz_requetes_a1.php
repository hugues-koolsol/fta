<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true); // sess,bdd

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles_l1.php'); 
}

$o1='';
$o1=html_header1(array('title'=>'editeur sql' , 'description'=>'créer ou modifier une requete sql'));
print($o1);$o1='';

$requete_en_cours=array();
if(isset($_GET['__action']) && $_GET['__action']=='__modification' && isset($_GET['__id'])  && is_numeric($_GET['__id']) ){
     $id_requete=(int)$_GET['__id'];

     sql_inclure_reference(32);
     /*sql_inclure_deb */
     require_once(INCLUDE_PATH.'/sql/sql_32.php');
     /*sql_inclure_fin*/
     $tt=sql_32(array( 
         'T0_chi_id_requete' => $id_requete, 
         'T0_chx_cible_requete' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
     ));
     if($tt['statut'] === true){
      $requete_en_cours=$tt['valeur'][0];
     }else{
     }
}
$o1.='<script type="text/javascript">'.CRLF;
$o1.='var globale_requete_en_cours='.json_encode($requete_en_cours,JSON_FORCE_OBJECT).';'.CRLF;
$o1.='</script>'.CRLF;
print($o1);$o1='';


?>

  <div class="menuScroller">
      <ul>
          <li><a href="javascript:__module_requete_sql1.nouvelle(null)"  class="yysucces">nouvelle requête</a> </li>
      </ul>
  </div>
  <h1>Requête Sql</h1>
  <div id="div_de_travail"></div>
  <textarea class="txtar1" id="txtar2" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <br />
  <h4>php</h4>
  <div>
   <a href="javascript:__gi1.reduire_la_text_area(&quot;txtar3&quot;);" title="réduire la zone">👊</a>
   <a href="javascript:__gi1.agrandir_la_text_area(&quot;txtar3&quot;);" title="agrandir la zone">🖐</a>
  <div>
  <textarea class="txtar1" id="txtar3" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  
  <div>
   <b>initialisation</b>
   <a href="javascript:__gi1.reduire_la_text_area(&quot;init&quot;);" title="réduire la zone">👊</a>
   <a href="javascript:__gi1.agrandir_la_text_area(&quot;init&quot;);" title="agrandir la zone">🖐</a>
  <div>
  <textarea class="txtar1" id="init" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  <br />
  <h4>exemple</h4>
  <textarea class="txtar1" rows="5" >
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
  </textarea>
  
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
