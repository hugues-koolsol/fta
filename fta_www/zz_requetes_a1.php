<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true); // sess,bdd

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles_l1.php'); 
}

$o1='';
$o1=html_header1(array('title'=>'requete sql' , 'description'=>'créer ou modifier une requete sql'));
print($o1);$o1='';

$id_requete=0;
$rev_requete='';
$type_requete='';
if(isset($_GET['__action']) && $_GET['__action']=='__modification' && isset($_GET['__id'])  && is_numeric($_GET['__id']) ){
     $id_requete=$_GET['__id'];
     $sql0='
      SELECT `cht_rev_requete` , T0.chp_type_requete 
      FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_requetes `T0`
      WHERE   `chi_id_requete`='.$id_requete.'
     ';
     $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);

     if(($stmt0 !== false)){

         $res0=$stmt0->execute();
         while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
             $rev_requete=$tab0[0];
             $type_requete=$tab0[1];
                 
         }
         $stmt0->close();
     }
}
$o1.='<script type="text/javascript">'.CRLF;
$o1.='var globale_id_requete='.$id_requete.';'.CRLF;
$o1.='var globale_rev_requete=\''.str_replace('\'','\\\'',str_replace("\r",'\\r',str_replace("\n",'\\n',$rev_requete))).'\';'.CRLF;
$o1.='var globale_type_requete=\''.$type_requete.'\';'.CRLF;
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
