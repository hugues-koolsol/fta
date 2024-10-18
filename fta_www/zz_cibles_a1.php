<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true); // sess,bdd


function recupere_une_donnees_des_cibles($id){
 
        sql_inclure_reference(34);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_34.php');
        /*
        SELECT `T0`.`chi_id_cible` , `T0`.`chp_nom_cible` , `T0`.`chp_dossier_cible` , `T0`.`chp_commentaire_cible` 
        FROM b1.tbl_cibles T0 
        WHERE `T0`.`chi_id_cible` = :T0_chi_id_cible;

        */
        /*sql_inclure_fin*/
        
        $tt=sql_34(array( 'T0_chi_id_cible' => $id));

        if(($tt['statut'] === false) || (count($tt['valeur']) !== 1)){

            return false;

        }
        $__valeurs=$tt['valeur'][0];
        return $__valeurs;
 
}


/*
  ========================================================================================
*/

 /*debutspécifiquefta*/
 if(isset($_POST['__copier_les_fichiers_de_base_dans_ftb'])){
   
   $time_start = microtime(true);
   
   $tab=array(
      /* doit être en premier pour avoir l'indice 2 dans la base clonée */
      'fta_inc/db/sqlite/fta_structure.system.db.sql' => array(),
      /* doit être en deuxième pour avoir l'indice 3 dans la base clonée */
      'fta_inc/sql/sql_1.php'=>array('copier_tous_les_fichies_de_ce_repertoire'=>true),

      'fta_www/aa_include.php' => array(
         'remplacer' => array( 
           array( 
             'a_remplacer_chaine' => 'define(\'APP_KEY\',\'fta\');' ,
             'par'                => 'define(\'APP_KEY\',\'ftb\');'
           ),
           array( 
             'a_remplacer_chaine' => 'define("PREFIXE_REPERTOIRES","fta");' ,
             'par'                => 'define("PREFIXE_REPERTOIRES","fta");'
           ),
           
         )
      ),
      'fta_inc/.htaccess' => array(),
      'fta_inc/ajax/core/bdd.php' => array(),
      'fta_inc/ajax/core/file.php' => array(),
      'fta_inc/ajax/js/ast.php' => array(),      
      'fta_inc/ajax/php/ast.php' => array(),
      'fta_inc/ajax/php/session.php' => array(),
      'fta_inc/ajax/php/travail_en_arriere_plan1.php' => array(),

      'fta_inc/db/__liste_des_acces_bdd.php' => array(),
      
      'fta_inc/phplib/mesBibliotheques.bat'=>array(),
      'fta_inc/phplib/sqlite.php'=>array(),
      
      'fta_inc/jslib/convertir_un_module.js'=>array(),      
      'fta_inc/jslib/convertir_un_script.js'=>array(),      
      'fta_inc/jslib/mes_bibliotheques.bat'=>array(),      

      'fta_inc/rev/test_factorielle.rev'=>array(),
      
      'fta_www/.htaccess' => array(),
      'fta_www/6.css' => array(),
      'fta_www/aa_login.php' => array(),
      'fta_www/index.php' => array(),
      'fta_www/index_source.php' => array(),
      
      'fta_www/traiteHtml.php' => array(),
      'fta_www/traiteJs.php' => array(),
      'fta_www/traitePhp.php' => array(),
      'fta_www/traiteSql.php' => array(),
      
      'fta_www/za_ajax.php' => array(),
      'fta_www/zz_bdds_l1.php' => array(),
      'fta_www/zz_bdds_a1.php' => array(),
      'fta_www/zz_cibles_l1.php' => array(),
      'fta_www/zz_cibles_a1.php' => array(),
      'fta_www/zz_dossiers_l1.php' => array(),
      'fta_www/zz_dossiers_a1.php' => array(),
      'fta_www/zz_dossiers_c1.php' => array(),
      'fta_www/zz_sources_l1.php' => array(),
      'fta_www/zz_sources_a1.php' => array(),
      'fta_www/zz_revs_l1.php' => array(),
      'fta_www/zz_taches_a1.php' => array(),
      'fta_www/zz_taches_l1.php' => array(),
      'fta_www/zz_requetes_l1.php' => array(),      
      'fta_www/zz_requetes_a1.php' => array(),      
      'fta_www/svg_de_la_base.php' => array(),
      'fta_www/phpliteadmin.config.php' => array(),
      'fta_www/phpliteadmin.php' => array(),      
      
      'fta_www/js/compile1.js' => array(),
      'fta_www/js/convertit-html-en-rev1.js' => array(),
      'fta_www/js/convertit-js-en-rev1.js' => array(),
      'fta_www/js/convertion_sql_en_rev.js' => array(),
      'fta_www/js/convertit-php-en-rev0.js' => array(),
      'fta_www/js/core6.js' => array(),
      'fta_www/js/html.js' => array(),
      'fta_www/js/interface0.js' => array(),
      'fta_www/js/javascript.js' => array(),
      'fta_www/js/php.js' => array(),
      'fta_www/js/pour-index_php0.js' => array(),
      'fta_www/js/pour_zz_bdds_action1.js' => array(),
      'fta_www/js/pour_zz_source1.js' => array(),
      'fta_www/js/pour_svg.js' => array(),
      'fta_www/js/pour_requete_sql.js' => array(),
      
      'fta_www/js/sql.js' => array(),
      'fta_www/js/texte.js' => array(),
      'fta_www/js/module_interface1.js' => array('chp_type_source' => 'module_js'),
      'fta_www/js/module_html.js' => array('chp_type_source' => 'module_js'),
      'fta_www/js/module_svg_bdd.js' => array('chp_type_source' => 'module_js'),
      'fta_www/js/module_requete_sql.js' => array('chp_type_source' => 'module_js'),
      'fta_www/js/module_travail_en_arriere_plan0.js' => array(),
      'fta_www/js/index_source_script-v0.js' => array(),


      /*https://github.com/codeschool/sqlite-parser*/
      'fta_www/js/jslib/sqlite_parser_from_demo.js' => array('chp_type_source' => 'bibliotheque'),
      'fta_www/js/jslib/Sortable.js' => array('chp_type_source' => 'bibliotheque'),
      
   );

   $dossier_racine='../../ftb';
   $indice_du_dossier=2; /* le dossier 1 est celui de la racine */
   $tableau_des_dossiers=array();
   foreach( $tab as $k1 => $v1){
     $dossier_cible=$dossier_racine.'/'.substr($k1,0,strrpos($k1,'/'));
     if(!isset($tableau_des_dossiers[$dossier_cible])){
        $tableau_des_dossiers[$dossier_cible]=$indice_du_dossier;
        $indice_du_dossier++;
     }
     $tab[$k1]['dossier']=$tableau_des_dossiers[$dossier_cible];
    
    
   }
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tableau_des_dossiers , true ) . '</pre>' ; exit(0);
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tab , true ) . '</pre>' ; exit(0);
   foreach( $tab as $k1 => $v1){
       $contenu=file_get_contents('../'.$k1);
       if($contenu===false){
           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
       }
       //echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $contenu , true ) . '</pre>' ; exit(0);
       if(isset($v1['remplacer'])){
           foreach($v1['remplacer'] as $k2 => $v2){
            if(isset($v2['a_remplacer_chaine'])){
//            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $v2 , true ) . '</pre>' ; exit(0);
              $contenu = str_replace($v2['a_remplacer_chaine'] , $v2['par'] , $contenu);
//              echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( enti1($contenu) , true ) . '</pre>' ; exit(0);
            }else if(isset($v2['a_remplacer_preg'])){
/*             
             $contenu=preg_replace($v2['a_remplacer_preg'],$v2['par'], $contenu);
             echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( enti1($contenu) , true ) . '</pre>' ; exit(0);
            /*
            
             $text = '<p style="padding:0px;"><strong style="padding:0;margin:0;">hello</strong></p>';

             echo preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/si",'<$1$2>', $text);

             // <p><strong>hello</strong></p>            
            
            */
            }
            
            
           }
           
           
           
       }

       $contenu=preg_replace('/\\/\\*debut'.'spécifiquefta\\*\\/(.*?)\\/\\*fin'.'spécifiquefta\\*\\//us','/* spécifique fta */', $contenu);
       if($k1==='fta_www/zz_cibles_a1.php'){
//           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( enti1($contenu) , true ) . '</pre>' ; exit(0);
       }

       $dossier_cible=$dossier_racine.'/'.substr($k1,0,strrpos($k1,'/'));

       if(is_dir($dossier_cible)){
           /*
             le dossier existe déjà
           */
       }else{
           if(!mkdir($dossier_cible,0777,true)){
               echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . ' impossible de créer le répertoire "'.$dossier_cible.'" </pre>' ; exit(0);
           }
       }
       $fichier_cible=$dossier_cible.substr($k1,strrpos($k1,'/'));

       if($fd=fopen($fichier_cible,'w')){
           if(fwrite($fd,$contenu)){
               fclose($fd);
           }else{
               echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . ' fwrite a échoué sur '.$k1.'</pre>' ; exit(0);
           }
       }else{
           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . ' fopen a échoué sur '.$k1.'</pre>' ; exit(0);
       }
       if(isset($v1['copier_tous_les_fichies_de_ce_repertoire'])){
           $fichierSource='../'.$k1;
           $repertoire_source=substr($fichierSource,0,strrpos($fichierSource,'/'));
           
           $files=glob($repertoire_source.'/*',GLOB_MARK);
//           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $files , true ) . '</pre>' ; exit(0);
           foreach($files as $file){
               if(!is_dir($file)){
//                   echo __FILE__ . ' ' . __LINE__ . ' $file = <pre>' . var_export( $file , true ) . '</pre>' ; exit(0);
                   $contenu=file_get_contents($file);
                   //echo __FILE__ . ' ' . __LINE__ . ' $contenu = <pre>' . var_export( str_replace('<','&lt;',$contenu) , true ) . '</pre>' ; exit(0);
                   $fichier_cible=$dossier_cible.substr($file,strrpos($file,'/'));
//                   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $fichier_cible , true ) . '</pre>' ; exit(0);
                   if($fd=fopen($fichier_cible,'w')){
                       if(fwrite($fd,$contenu)){
                           fclose($fd);
                       }else{
                           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . ' fwrite a échoué sur '.$k1.'</pre>' ; exit(0);
                       }
                   }else{
                       echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . ' fopen a échoué sur '.$k1.'</pre>' ; exit(0);
                   }
               }
           }
//           echo __FILE__ . ' ' . __LINE__ . ' $dossier_cible = <pre>' .  $dossier_cible  . '</pre><pre>' . $fichier_cible  . '</pre><pre>' . $fichierSource  . '</pre><pre>' . $repertoire_source  . '</pre>' ; exit(0); 
        
       }
       
       
    
   }
   
   $contenu_fichier_structure=file_get_contents('../fta_inc/db/sqlite/fta_structure.system.db.sql');
   
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . enti1( $contenu_fichier_structure ) . '</pre>' ; exit(0);
   
   if($contenu_fichier_structure===false){
    echo __FILE__ . ' ' . __LINE__ . ' fichier structure introuvable = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }

   
   /* on supprime la base systeme ftb */
   $chemin_base_systeme=realpath($dossier_racine.'/fta_inc/db/sqlite/system.db');

   if(is_file($chemin_base_systeme)){

    if(!unlink($chemin_base_systeme)){
     echo __FILE__ . ' ' . __LINE__ . ' unlink base system impossible = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    }
   }else{
     /* la base n'existe pas, on continue */
   }
//   echo __FILE__ . ' ' . __LINE__ . ' $chemin_base_systeme='.$chemin_base_systeme.' = $contenu_fichier_structure=<pre>' . var_export( $contenu_fichier_structure , true ) . '</pre>' ; exit(0);
   
   $base_ftb = new SQLite3($chemin_base_systeme);
   if(false === $base_ftb->exec($contenu_fichier_structure)){
    echo __FILE__ . ' ' . __LINE__ . ' erreur de création de la structure base system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);   
   // donnees.system.db.sql   
   
   /* on récupère le contenu du champ chp_rev_travail_basedd de la base de fta pour le mettre dans la base ftb pour le dessin de la base */
   
   sql_inclure_reference(26);
   /*sql_inclure_deb*/
   require_once(INCLUDE_PATH.'/sql/sql_26.php');
   /* UPDATE b1.tbl_cibles SET `chp_commentaire_cible` = :n_chp_commentaire_cible WHERE `chi_id_cible` = 1 ; */
   /*sql_inclure_fin*/
   $tt=sql_26(array(
       'T0_chi_id_basedd'       => 1,
       'T0_chx_cible_id_basedd' => 1,
   ));
   if($tt['statut']===false || count($tt['valeur']) !== 1 ){
      echo __FILE__ . ' ' . __LINE__ . ' erreur de récupération du rev de la base = <pre>' . $tt['message'] . '</pre>' ; exit(0);
   }
   $chp_rev_travail_basedd=$tt['valeur'][0]['T0.chp_rev_travail_basedd'];
   
   
   $contenu_initialisation="
    INSERT INTO `".cst('tbl_cibles')."`  ( 
      `".cst('chi_id_cible')."`          , 
      `".cst('chp_nom_cible')."`         , 
      `".cst('chp_commentaire_cible')."` , 
      `".cst('chp_dossier_cible')."`
    ) VALUES ('1','fta','la racine','ftb');
    
    INSERT INTO `".cst('tbl_dossiers')."`( 
      `".cst('chi_id_dossier')."`     , 
      `".cst('chp_nom_dossier')."`    , 
      `".cst('chx_cible_dossier')."`
    ) VALUES ('1','/','1');
    
    INSERT INTO `".cst('tbl_bdds')."`    ( 
      `".cst('chi_id_basedd')."`          , 
      `".cst('chp_nom_basedd')."`         ,
      `".cst('chp_rev_basedd')."`         ,
      `".cst('chp_commentaire_basedd')."` ,
      `".cst('chx_dossier_id_basedd')."`  , 
      `".cst('chp_genere_basedd')."`      , 
      `".cst('chx_cible_id_basedd')."`    ,
      `".cst('chp_rev_travail_basedd')."`    
    ) VALUES ('1','system.db','','initialisation','2','','1','".sq0($chp_rev_travail_basedd)."');
    INSERT INTO `".cst('tbl_utilisateurs')."` ( 
      `".cst('chi_id_utilisateur')."`, 
      `".cst('chp_nom_de_connexion_utilisateur')."`, 
      `".cst('chp_mot_de_passe_utilisateur')."`, 
      `".cst('chp_commentaire_utilisateur')."`
    ) VALUES ('1','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','mdp = admin');
   ";

   if(false === $base_ftb->exec($contenu_initialisation)){
    echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);

   $contenu_table_dossiers ='';
   foreach( $tableau_des_dossiers as $k1 => $v1 ){
    $contenu_table_dossiers.=",('".$v1."','".substr($k1,strlen('../../ftb'))."','1')";
    
   }
   if($contenu_table_dossiers!==''){
    
    $contenu_table_dossiers=substr($contenu_table_dossiers,1);
    $contenu_table_dossiers ='INSERT INTO `'.cst('tbl_dossiers').'`( `'.cst('chi_id_dossier').'`, `'.cst('chp_nom_dossier').'`, `'.cst('chx_cible_dossier').'`) VALUES '.$contenu_table_dossiers;
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $contenu_table_dossiers , true ) . '</pre>' ; exit(0);
    
    if(false === $base_ftb->exec($contenu_table_dossiers)){
     echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    }
    
   }else{
        echo __FILE__ . ' ' . __LINE__ . ' problème sur le contenu des dossiers = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }

   $contenu_table_sources ='';
   foreach( $tab as $k1 => $v1 ){
    if(isset($v1['chp_type_source'])){
     $contenu_table_sources.=",('".substr($k1,strrpos( $k1 , '/' )+1) ."','1','".$v1['dossier']."' , '".$v1['chp_type_source']."')\r\n";
    }else{
     $contenu_table_sources.=",('".substr($k1,strrpos( $k1 , '/' )+1) ."','1','".$v1['dossier']."' , 'normal')\r\n";
    }
    
   }
   if($contenu_table_sources!==''){
    
       $contenu_table_sources=substr($contenu_table_sources,1);
       // echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . enti1( $contenu_table_sources ) . '</pre>' ; exit(0);
       
       $contenu_table_sources ='INSERT INTO `'.cst('tbl_sources').'`( `'.cst('chp_nom_source').'` , `'.cst('chx_cible_id_source').'`, `'.cst('chx_dossier_id_source').'` , `'.cst('chp_type_source').'` ) VALUES '.$contenu_table_sources;
       // echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . enti1( $contenu_table_sources ) . '</pre>' ; exit(0);
       if(false === $base_ftb->exec($contenu_table_sources)){
        echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
       }
   }

//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][1]['initialisation'] , true ) . '</pre>' ; exit(0);
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][1]['nom_bdd'] , true ) . '</pre>' ; exit(0);
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD] , true ) . '</pre>' ; exit(0);
   /* 
     on doit prendre les requetes sql de la table requetes de fta pour les mettre dans ftb
     la base $base_ftb pointe par défaut sur la base dans ftb
     il faut une référence sur la base fta
     
   */
   $ret0=$base_ftb->exec($GLOBALS[BDD][1]['initialisation']);
   $sql_insere_requetes='INSERT INTO `'.cst('tbl_requetes').'` SELECT * FROM `'.$GLOBALS[BDD][1]['nom_bdd'].'`.`'.cst('tbl_requetes').'` WHERE `'.cst('chx_cible_requete').'`=1';
   if(false === $base_ftb->exec($sql_insere_requetes)){
    echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }
   
   
   $chemin_fichier_acces_pour_bdd=realpath($dossier_racine.'/fta_inc/db/__liste_des_acces_bdd.php');
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_fichier_acces_pour_bdd , true ) . '</pre>' ; exit(0);
   /*
   */
   $contenu_fichier_acces_pour_bdd='';
   $contenu_fichier_acces_pour_bdd.='<'.'?php'.CRLF;
   $contenu_fichier_acces_pour_bdd.='$GLOBALS[BDD][1]=array('.CRLF;
   $contenu_fichier_acces_pour_bdd.=' \'id\'             => 1,'.CRLF;
   $contenu_fichier_acces_pour_bdd.=' \'nom_bdd\'        => \'system.db\','.CRLF;
   $contenu_fichier_acces_pour_bdd.=' \'fournisseur\'    => \'sqlite\','.CRLF;
   $contenu_fichier_acces_pour_bdd.=' \'initialisation\' => \'attach database "'.str_replace('\\','\\\\',$chemin_base_systeme).'" as "system.db"\','.CRLF;
   $contenu_fichier_acces_pour_bdd.=' \'lien\' => null,'.CRLF;
   $contenu_fichier_acces_pour_bdd.=');'.CRLF;
   
//   echo __FILE__ . ' ' . __LINE__ . ' $contenu_fichier_acces_pour_bdd = <pre>' . enti1($contenu_fichier_acces_pour_bdd)  . '</pre>' ; exit(0);
   if($fd=fopen($chemin_fichier_acces_pour_bdd,'w')){
       if(fwrite($fd,$contenu_fichier_acces_pour_bdd)){
           fclose($fd);
       }else{
           echo __FILE__ . ' ' . __LINE__ . ' erreur ecriture $contenu_fichier_acces_pour_bdd' ; exit(0);
       }
   }else{
       echo __FILE__ . ' ' . __LINE__ . ' erreur ouverture $contenu_fichier_acces_pour_bdd' ; exit(0);
   }
 
 
/*

$chemin_base_systeme
<?php

*/
   
   
   
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);

    $time_end = microtime(true);
    $time = ((int)(($time_end - $time_start)*1000*1000))/1000;
    ajouterMessage('succes' , __LINE__.' 👍 les fichiers ont été copiés ('.$time.' ms)' , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);


 }
  /*finspécifiquefta*/


/*
  ========================================================================================
*/
//========================================================================================================================
function erreur_dans_champs_saisis_cibles(){
 $uneErreur=false;
 if($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']==='1'){
 }else{
  if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']===''){
   /*
   // A=65 , a=97 z=122 , 0=48 , 9=57
   // todo ajouter le test
   */
   $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|'; 
   ajouterMessage('erreur' ,  __LINE__ .' : le nom cible doit etre indiqué et ne doit pas contenir les caractères espaces ' , BNF );
   $uneErreur=true;
  }
  
  if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'],0,1)===' '){
   
   ajouterMessage('erreur' ,  __LINE__ .' : le nom cible ne doit pas commencer par un espace ' , BNF );
   
   $uneErreur=true;
   
  }


  if($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible']===''){
   /*
   // A=65 , a=97 z=122 , 0=48 , 9=57
   // todo ajouter le test
   */
   $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|'; 
   ajouterMessage('erreur' ,  __LINE__ .' : le nom cible doit etre indiqué et ne doit pas contenir les caractères espaces ' , BNF );
   $uneErreur=true;
  }
  
  if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'],0,1)===' '){
   
   ajouterMessage('erreur' ,  __LINE__ .' : le nom cible ne doit pas commencer par un espace ' , BNF );
   
   $uneErreur=true;
   
  }

 }

 return($uneErreur);
}
/*
  ========================================================================================
*/



/*
  ====================================================================================================================
  ====================================================================================================================
  ============================================= POST =================================================================
  ====================================================================================================================
  ====================================================================================================================
*/
if(isset($_POST)&&sizeof($_POST)>=1){

 
 
// echo __LINE__ . '$_POST=<pre>' . var_export($_POST,true) . '</pre>'; exit();
 $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']          =$_POST['chp_nom_cible']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible']      =$_POST['chp_dossier_cible']     ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']  =$_POST['chp_commentaire_cible'] ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']           =isset($_POST['chi_id_cible'])?decrypter($_POST['chi_id_cible']) : '';
 
 
 
 

 /*
   ====================================================================================================================
   ============================================= MODIFICATION =========================================================
   ====================================================================================================================
 */
 if(isset($_POST['__action'])&&$_POST['__action']=='__modification'){
     if(erreur_dans_champs_saisis_cibles()){
         if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'])&&is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'])){
          
             recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);

         }else{
             ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'] );
             recharger_la_page('zz_cibles_l1.php');
         }
     }
     
     if($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']==='1'){
      
      
         sql_inclure_reference(47);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_47.php');
         /* UPDATE b1.tbl_cibles SET `chp_commentaire_cible` = :n_chp_commentaire_cible WHERE `chi_id_cible` = 1 ; */
         /*sql_inclure_fin*/
         
         $tt=sql_47(array(
             'n_chp_commentaire_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible'],
         ));
     }else{
         sql_inclure_reference(48);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_48.php');
         /* 
           UPDATE b1.tbl_cibles SET 
            `chp_nom_cible` = :n_chp_nom_cible , 
            `chp_dossier_cible` = :n_chp_dossier_cible , 
           `chp_commentaire_cible` = :n_chp_commentaire_cible
           WHERE (`chi_id_cible` = :c_chi_id_cible) ;
         */
         /*sql_inclure_fin*/
         
         $tt=sql_48(array(
             'n_chp_nom_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'],
             'n_chp_dossier_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'],
             'n_chp_commentaire_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible'],
             'c_chi_id_cible' => $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'],
         ));
     }
     
     if($tt['statut'] === false){
             ajouterMessage('erreur' , __LINE__ .' '. $tt['message'] , BNF );
             recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']); 
     }else{
         if($tt['changements']===1){
             ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

             recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);
         }else{
            ajouterMessage('erreur' , __LINE__ .' erreur de mise à jour' , BNF );
            recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);
         }
     }
 }else if(isset($_POST['__action'])&&$_POST['__action']=='__confirme_suppression'){

     /*
       ===================================================================================================================
       ============================================= CONFIRMATION DE LA SUPPRESSION DE CIBLE =============================
       ===================================================================================================================
     */

     /*
     http://localhost/functToArray/fta/fta_www/zz_cibles_a1.php?__id=2&__action=__suppression
     */
     $__id= isset($_POST['__id1'])?(is_numeric($_POST['__id1'])?$_POST['__id1']:0):0;
   //  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);

     $__valeurs=recupere_une_donnees_des_cibles($__id);
     if($__valeurs===false){
         ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer cet enregistrement ' , BNF );
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     
     
     if($__valeurs['T0.chp_nom_cible']==='fta' && $__valeurs['T0.chp_dossier_cible']==='fta'){
       ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer "fta"');
       recharger_la_page('zz_cibles_l1.php');
     }
     
     
     sql_inclure_reference(38);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_38.php');
     /*
     
       BEGIN TRANSACTION
       
     */
     /*sql_inclure_fin*/
     
     $tt=sql_38(array());
     if($tt['statut'] === false){
         ajouterMessage('erreur' , $tt['message'] , BNF );
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     
     
     /* 
       ==============================================================================================================
     */
     sql_inclure_reference(14);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_14.php');
     /*
     
       DELETE FROM b1.tbl_revs WHERE `chx_cible_rev` = :chx_cible_rev ;
       
     */
     /*sql_inclure_fin*/
     
     $tt=sql_14(array(
         'chx_cible_rev' => $__id,
     ));
     if($tt['statut'] === false){
         ajouterMessage('erreur' , $tt['message'] , BNF );
         
         sql_inclure_reference(40);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_40.php');
         /*
         
           ROLLBACK
           
         */
         /*sql_inclure_fin*/
         
         $tt=sql_40(array());
         
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     ajouterMessage('info' ,  __LINE__ .' : la suppression des rev a fonctionné'  );
     
     
     /* 
       ==============================================================================================================
     */
     sql_inclure_reference(41);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_41.php');
     /*
     
       DELETE FROM b1.tbl_sources WHERE `chx_cible_id_source` = :chx_cible_id_source ;    
     */
     /*sql_inclure_fin*/
     
     $tt=sql_41(array(
         'chx_cible_id_source' => $__id,
     ));
     if($tt['statut'] === false){
         ajouterMessage('erreur' , $tt['message'] , BNF );
         
         sql_inclure_reference(40);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_40.php');
         /*
         
           ROLLBACK
           
         */
         /*sql_inclure_fin*/
         
         $tt=sql_40(array());
         
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     ajouterMessage('info' ,  __LINE__ .' : la suppression des sources a fonctionné'  );



     /* 
       ==============================================================================================================
     */
     sql_inclure_reference(42);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_42.php');
     /*
       DELETE FROM b1.tbl_requetes WHERE (`chx_cible_requete` = :chx_cible_requete) ;    
     */
     /*sql_inclure_fin*/
     
     $tt=sql_42(array(
         'chx_cible_requete' => $__id,
     ));
     if($tt['statut'] === false){
         ajouterMessage('erreur' , $tt['message'] , BNF );
         
         sql_inclure_reference(40);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_40.php');
         /* ROLLBACK */
         /*sql_inclure_fin*/
         
         $tt=sql_40(array());
         
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     ajouterMessage('info' ,  __LINE__ .' : la suppression des requetes a fonctionné'  );

     /* 
       ==============================================================================================================
     */
     sql_inclure_reference(43);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_43.php');
     /*
       DELETE FROM b1.tbl_bdds WHERE (`chx_cible_id_basedd` = :chx_cible_id_basedd) ;
     /*sql_inclure_fin*/
     
     $tt=sql_43(array(
         'chx_cible_id_basedd' => $__id,
     ));
     if($tt['statut'] === false){
         ajouterMessage('erreur' , $tt['message'] , BNF );
         
         sql_inclure_reference(40);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_40.php');
         /* ROLLBACK */
         /*sql_inclure_fin*/
         
         $tt=sql_40(array());
         
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     ajouterMessage('info' ,  __LINE__ .' : la suppression des bases a fonctionné'  );

     /* 
       ==============================================================================================================
     */
     sql_inclure_reference(44);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_44.php');
     /*
       DELETE FROM b1.tbl_dossiers WHERE (`chx_cible_dossier` = :chx_cible_dossier) ;
     /*sql_inclure_fin*/
     
     $tt=sql_44(array(
         'chx_cible_dossier' => $__id,
     ));
     if($tt['statut'] === false){
         ajouterMessage('erreur' , $tt['message'] , BNF );
         
         sql_inclure_reference(40);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_40.php');
         /* ROLLBACK */
         /*sql_inclure_fin*/
         
         $tt=sql_40(array());
         
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     ajouterMessage('info' ,  __LINE__ .' : la suppression des dossiers a fonctionné'  );

     /* 
       ==============================================================================================================
     */


     sql_inclure_reference(45);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_45.php');
     /*
       DELETE FROM b1.tbl_cibles WHERE (`chi_id_cible` = :chi_id_cible) ;
     /*sql_inclure_fin*/
     
     $tt=sql_45(array(
         'chi_id_cible' => $__id,
     ));
     if($tt['statut'] === false){
         ajouterMessage('erreur' , $tt['message'] , BNF );
         
         sql_inclure_reference(40);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_40.php');
         /* ROLLBACK */
         /*sql_inclure_fin*/
         
         $tt=sql_40(array());
         
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
     }
     ajouterMessage('info' ,  __LINE__ .' : la suppression de la cible a fonctionné'  );
     
     /* 
       ==============================================================================================================
     */
     
     sql_inclure_reference(46);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_46.php');
     /* COMMIT */
     /*sql_inclure_fin*/
     
     $tt=sql_46(array());

     recharger_la_page('zz_cibles_l1.php');

     /* 
       ==============================================================================================================
     */

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__creation'){
  
     /*
       ===================================================================================================================
       ============================================= CREATION ============================================================
       ===================================================================================================================
     */
     
     if(erreur_dans_champs_saisis_cibles()){
      
         recharger_la_page(BNF.'?__action=__creation');
         
     }
     
     if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']==='fta' && $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'] ==='fta'){
         ajouterMessage('erreur' , __LINE__ .' : le projet fta est la racine et est déjà créé' , BNF );
         recharger_la_page(BNF.'?__action=__creation');
     }
  
     sql_inclure_reference(36);
     /*sql_inclure_deb*/
     require_once(INCLUDE_PATH.'/sql/sql_36.php');
     /*
     
       INSERT INTO b1.`tbl_cibles`(
           `chp_nom_cible` , 
           `chp_dossier_cible` , 
           `chp_commentaire_cible`
       ) VALUES (
           :chp_nom_cible , 
           :chp_dossier_cible , 
           :chp_commentaire_cible
       );
     */
     /*sql_inclure_fin*/
     
     $tt=sql_36(array( 
         array( 
          'chp_nom_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'] , 
          'chp_dossier_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'] , 
          'chp_commentaire_cible' => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible'] ,
         )
     ));

     if($tt['statut'] === false){

         ajouterMessage('erreur',__LINE__.' : '.$tt['message'],BNF);
         recharger_la_page(BNF.'?__action=__creation');

     }else{

         /* création du dossier racine */    
         
         sql_inclure_reference(37);
         /*sql_inclure_deb*/
         require_once(INCLUDE_PATH.'/sql/sql_37.php');
         /*
           INSERT INTO b1.`tbl_dossiers`(
               `chx_cible_dossier` , 
               `chp_nom_dossier`
           ) VALUES (
               :chx_cible_dossier , 
               :chp_nom_dossier
           );         */
         /*sql_inclure_fin*/
         
         $tt37=sql_37(array( 
             array( 
              'chx_cible_dossier' => $tt['nouvel_id'], 
              'chp_nom_dossier' => '/', 
             )
         ));
         if($tt37['statut'] === false){
             ajouterMessage('erreur' , __LINE__ .' : ' . $tt37['message'] , BNF );
             recharger_la_page(BNF.'?__action=__creation'); 
         }else{
             $nom_du_dossier='../../'.$_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'];
             @mkdir($nom_du_dossier);
             
            
             ajouterMessage('info' , __LINE__ .' : l\'enregistrement ('.$tt['nouvel_id'].') a bien été créé' , BNF );
             recharger_la_page(BNF.'?__action=__modification&__id='.$tt['nouvel_id']); 
         }
     }
 
 }else if(isset($_POST['__action'])&&$_POST['__action']=='__creation_du_dossier'){

  /*
    ===================================================================================================================
    ============================================= CREATION D'UN DOSSIER ===============================================
    ===================================================================================================================
  */

  if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'])){
   
   $__id=$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'];
   if(isset($_SESSION[APP_KEY][NAV][BNF])){
    unset($_SESSION[APP_KEY][NAV][BNF]);
   }
   if($__id!==0){
       $__valeurs=recupere_une_donnees_des_cibles($__id);
       if($__valeurs!==false){
           $__dossier='../../'.$__valeurs['T0.chp_dossier_cible'];
           if(mkdir($__dossier)){
               ajouterMessage('succes' , __LINE__ . ' le dossier "'.$__dossier.'" a été créé avec succès !'  , BNF );
           }else{
               ajouterMessage('erreur' , __LINE__ . ' il y a eu un problème lors de la création du dossier "'.$__dossier.'" '  , BNF );
           }
       }else{
           ajouterMessage('avertissement' , __LINE__ . ' il y a eu un problème'  , BNF );
       }
   }else{
       ajouterMessage('avertissement' , __LINE__ . ' il y a eu un problème'  , BNF );
   }
   
   
  }else{
  
   unset($_SESSION[APP_KEY][NAV][BNF]);
   ajouterMessage('avertissement' , __LINE__ . ' il y a eu un problème'  , BNF );
  }

  recharger_la_page($_SERVER['REQUEST_URI']);



 }else if(isset($_POST['__action'])&&$_POST['__action']=='__suppression_du_dossier'){

  /*
    ===================================================================================================================
    ============================================= SUPPRESSION D'UN DOSSIER ============================================
    ===================================================================================================================
  */
   
   $__id=(int)$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'];
   if($__id!==0 && $__id!==1 ){
       $__valeurs=recupere_une_donnees_des_cibles($__id);
       if($__valeurs!==false){
           $__dossier='../../'.$__valeurs['T0.chp_dossier_cible'];
           if(is_dir($__dossier)){
              if(le_dossier_est_vide($__dossier)){
                  if(rmdir($__dossier)){
                      ajouterMessage('succes' , __LINE__ . ' le dossier "'.$__dossier.'" a été supprimé avec succès !'  , BNF );
                      unset($_SESSION[APP_KEY][NAV][BNF]);
                      
                  }else{
                      ajouterMessage('avertissement' , __LINE__ . ' il y a eu un problème'  , BNF );
                  }
              }else{
                  ajouterMessage('avertissement' , __LINE__ . ' le dossier contient des éléments '  , BNF );
              }
           }else{
             ajouterMessage('avertissement' , __LINE__ . ' le dossier est absent '  , BNF );
           }
       }else{
          ajouterMessage('avertissement' , __LINE__ . ' le dossier est absent '  , BNF );
       }
    
   }else{
       ajouterMessage('avertissement' , __LINE__ . ' il y a eu un problème'  , BNF );
   }
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SERVER['REQUEST_URI'] , true ) . '</pre>' ; exit(0);
   recharger_la_page($_SERVER['REQUEST_URI']);


 }else{
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SERVER['REQUEST_URI'] , true ) . '</pre>' ; exit(0);
  unset($_SESSION[APP_KEY][NAV][BNF]);
  
  $__message=' cas à étudier ' . (isset($_POST['__action'])?' : "'.$_POST['__action'].'" ':' ').substr($GLOBALS['__date'],11);
  ajouterMessage('avertissement' , __LINE__ . $__message  , BNF );
  recharger_la_page($_SERVER['REQUEST_URI']);

 }
 /*
 on ne devrait pas arriver là car on a normalement capturé tous les cas
 */

 if(isset($_SESSION[APP_KEY][NAV][BNF])){
  unset($_SESSION[APP_KEY][NAV][BNF]);
 }
 ajouterMessage('info' , __LINE__ .' cas à étudier ' . substr($GLOBALS['__date'],11)  );
 recharger_la_page('zz_cibles_l1.php');


}

/*
 ====================================================================================================================
 ====================================================================================================================
 ============================================= GET ==================================================================
 ====================================================================================================================
 ====================================================================================================================
*/
$__id=0;
if(isset($_GET['__action'])&&( $_GET['__action']==='__suppression' || ($_GET['__action'] === '__modification'))){
    $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?(int)$_GET['__id']:0):0;
    
    if($__id === 1 && ($_GET['__action'] === '__suppression') ){
        ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer la cible 1');
        recharger_la_page('zz_cibles_l1.php');
    }

    if($__id===0 ){

        ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer ou modifier la cible 0');
        recharger_la_page('zz_cibles_l1.php');

    }else{
     
        $__valeurs=recupere_une_donnees_des_cibles($__id);
        if($__valeurs === false){

            ajouterMessage('erreur',__LINE__.' cible non trouvée');
            recharger_la_page('zz_cibles_l1.php');

        }
        
    }
}  
/*
============================================================================
==== entete de la page =====================================================
============================================================================
*/

$o1='';
$o1=html_header1(array('title'=>'Cibles' , 'description'=>'Cibles'));
print($o1);$o1='';

$o1.='<h1>gestion de cible '.bouton_retour_a_la_liste('zz_cibles_l1.php').'</h1>';



if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){

  /*
  ============================================================================
  ==== __suppression =========================================================
  ============================================================================
  */

  /*
  http://localhost/functToArray/fta/fta_www/zz_cibles_a1.php?__id=2&__action=__suppression
  */
 $o1.=' <form method="post" class="yyformDelete">'.CRLF;
 $o1.='   <input type="hidden" value="'.encrypter($__id).'" name="chi_id_cible" id="chi_id_cible" />'.CRLF;
 $o1.='   veuillez confirmer le suppression de  : '.CRLF;
 $o1.='   <br /><br /><b>'.
       '('.$__valeurs['T0.chi_id_cible'].') : nom : ' .$__valeurs['T0.chp_nom_cible'].' , dossier : ' .$__valeurs['T0.chp_dossier_cible'].'  <br /> '.
       '</b><br />'.CRLF;
 $o1.='   <input type="hidden" value="'.$_GET['__id'].'" name="__id1" id="__id1" />'.CRLF;
 $o1.='   <input type="hidden" value="__confirme_suppression" name="__action" id="__action" />'.CRLF;
 $o1.='   <button type="submit" class="yydanger">Je confirme la suppression</button>'.CRLF;
 $o1.=''.CRLF;
 $o1.=' </form>'.CRLF;

}else if(isset($_GET['__action'])&&$_GET['__action']=='__creation'){

  /*
  ============================================================================
  ==== __creation ============================================================
  ============================================================================
  */


  $o1.='<h2>ajouter une cible</h2>'.CRLF;

  $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.CRLF;

  $chp_nom_cible =isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_cible).'" name="chp_nom_cible" id="chp_nom_cible" maxlength="3" style="max-width:3em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;

  $chp_dossier_cible =isset($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_dossier_cible).'" name="chp_dossier_cible" id="chp_dossier_cible" maxlength="3" style="max-width:3em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $chp_commentaire_cible =isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_cible" id="chp_commentaire_cible"  rows="15" >'.enti1($chp_commentaire_cible,ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;


  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <button type="submit">enregistrer</button>'.CRLF;
  $o1.='   <input type="hidden" value="0" name="__id1" id="__id1" />'.CRLF;
  $o1.='   <input type="hidden" value="__creation" name="__action" id="__action" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;

  $o1.='</form>'.CRLF;

}else if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){

  /*
  ============================================================================
  ==== __modification ============================================================
  ============================================================================
  */

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  $o1.='<h2>modifier une cible</h2>'.CRLF;

  $_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']=$__id;
  $__valeurs['T0.chp_nom_cible']          =$_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']        ??$__valeurs['T0.chp_nom_cible'];
  $__valeurs['T0.chp_dossier_cible']      =$_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible']    ??$__valeurs['T0.chp_dossier_cible'];
  
  $__valeurs['T0.chp_commentaire_cible']  =$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']??$__valeurs['T0.chp_commentaire_cible'];
  
  $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
  $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_cible" id="chi_id_cible" />'.CRLF;
  

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">id</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  
  if($__id!='1'){
   $o1.=' <div class="yyfdiv1">'.CRLF;
   $o1.='  <div class="yyflab1">'.CRLF;
   $o1.='   <div style="word-break:break-word;">nom</div>'.CRLF;
   $o1.='  </div>'.CRLF;
   $o1.='  <div class="yyfinp1"><div>'.CRLF;
   $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_nom_cible']).'" name="chp_nom_cible" id="chp_nom_cible" maxlength="3" style="width:100%;max-width:3em;" />'.CRLF;
   $o1.='   <span>3 caractères écrits en minuscules</span>'.CRLF;
   $o1.='  </div></div>'.CRLF;
   $o1.=' </div>'.CRLF;
   
   $o1.=' <div class="yyfdiv1">'.CRLF;
   $o1.='  <div class="yyflab1">'.CRLF;
   $o1.='   <div style="word-break:break-word;">dossier</div>'.CRLF;
   $o1.='  </div>'.CRLF;
   $o1.='  <div class="yyfinp1"><div>'.CRLF;
   $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_dossier_cible']).'" name="chp_dossier_cible" id="chp_dossier_cible" maxlength="3" style="width:100%;max-width:3em;" />'.CRLF;
   $o1.='   <span>3 caractères écrits en minuscules</span>'.CRLF;
   $o1.='  </div></div>'.CRLF;
   $o1.=' </div>'.CRLF;
   
   
   
  }

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">commentaire</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">texte libre</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_cible" id="chp_commentaire_cible"  rows="15" >'.enti1($__valeurs['T0.chp_commentaire_cible'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.='<div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.='</div>'.CRLF;

  $o1.='</form>'.CRLF;
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( basename(dirname(dirname(__FILE__))) , true ) . '</pre>' ; exit(0);
  
  /*debutspécifiquefta*/
  if(APP_KEY==='fta' && basename(dirname(__FILE__,2))==='fta' && $__valeurs['T0.chp_nom_cible']==='fta' && $__valeurs['T0.chp_dossier_cible']==='fta' ){
    $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;
    $o1.='   <button name="__copier_les_fichiers_de_base_dans_ftb" class="">copier les fichiers de base dans ftb</button>'.CRLF;
    $o1.='</form>'.CRLF;
  }
  /*finspécifiquefta*/
  

  $dossier='../../'.$__valeurs['T0.chp_dossier_cible'];
  
  if(is_dir($dossier)){
   $o1.='le dossier existe '.CRLF;
   
   if(le_dossier_est_vide($dossier)){
    
    $o1.='<br />le dossier '.$dossier.' est vide'.CRLF;
    $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;
    $o1.=' <input type="hidden" value="__suppression_du_dossier" name="__action" id="__action" />'.CRLF;
    $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_cible" id="chi_id_cible" />'.CRLF;
    $o1.='<div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <button type="submit" class="">supprimer le dossier</button>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.='</div>'.CRLF;
    $o1.='</form>'.CRLF;
   
   
   }else{
    $o1.='<br />le dossier '.$dossier.' contient des fichiers ou des dossiers '.CRLF;
   }
  
   
  }else{
    $o1.='le dossier '.$dossier.' n\'existe pas '.CRLF;
    $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;
    $o1.=' <input type="hidden" value="__creation_du_dossier" name="__action" id="__action" />'.CRLF;
    $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_cible" id="chi_id_cible" />'.CRLF;
    $o1.='<div class="yyfdiv1">'.CRLF;
    $o1.='  <div class="yyfinp1"><div>'.CRLF;
    $o1.='   <button type="submit" class="">créer le dossier</button>'.CRLF;
    $o1.='  </div></div>'.CRLF;
    $o1.='</div>'.CRLF;
    $o1.='</form>'.CRLF;
  }



}else{
 if(isset($_GET['__action'])){
  $o1.=$_GET['__action'].'<br />';
 }
 $o1.='pas d\'action prévue';
}



/*
============================================================================
============================================================================
*/
$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';