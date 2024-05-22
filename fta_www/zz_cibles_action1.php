<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_cibles1.php');


/*
  ========================================================================================
*/
function boutonRetourALaListe(){
  return '&nbsp;<a href="zz_cibles1.php" style="font-size:1rem;">retour à la liste</a>';
}


 /*debutspécifiquefta*/
 if(isset($_POST['__copier_les_fichiers_de_base_dans_ftb'])){
   
   $tab=array(
      /* doit être en premier pour avoir l'indice 2 pour la base */
      'fta_inc/db/sqlite/structure.system.db.sql' => array(),
      'fta_www/aa_include.php' => array(
         'remplacer' => array( 
           array( 
             'a_remplacer_chaine' => 'define("APP_KEY","fta");' ,
             'par'                => 'define("APP_KEY","ftb");'
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
      'fta_inc/ajax/php/ast.php' => array(),
      'fta_inc/db/acces_bdd_bases_de_donnees1.php' => array(),
      'fta_inc/db/acces_bdd_cibles1.php' => array(),
      'fta_inc/db/acces_bdd_dossiers1.php' => array(),
      'fta_inc/db/acces_bdd_sources1.php' => array(),
      'fta_inc/db/sqlite/structure.system.db.sql' => array(),
      'fta_inc/phplib/mesBibliotheques.bat'=>array(),
      'fta_inc/phplib/sqlite.php'=>array(),      
      'fta_inc/rev/test_factorielle.rev'=>array(),      
      'fta_www/.htaccess' => array(),
      'fta_www/6.css' => array(),
      'fta_www/aa_login.php' => array(),
      'fta_www/index.php' => array(),
      'fta_www/index_source.php' => array(),
      'fta_www/traiteHtml.php' => array(),
      'fta_www/traiteJs.php' => array(),
      'fta_www/traitePhp.php' => array(),
      'fta_www/za_ajax.php' => array(),
      'fta_www/zz_bdds1.php' => array(),
      'fta_www/zz_bdds_action1.php' => array(),
      'fta_www/zz_cibles1.php' => array(),
      'fta_www/zz_cibles_action1.php' => array(),
      'fta_www/zz_dossiers1.php' => array(),
      'fta_www/zz_dossiers_action1.php' => array(),
      'fta_www/zz_dossiers_choix1.php' => array(),
      'fta_www/zz_sources1.php' => array(),
      'fta_www/zz_sources_action1.php' => array(),
      'fta_www/phpliteadmin.config.php' => array(),
      'fta_www/phpliteadmin.php' => array(),      
      'fta_www/js/compile1.js' => array(),
      'fta_www/js/convertit-html-en-rev1.js' => array(),
      'fta_www/js/convertit-js-en-rev1.js' => array(),
      'fta_www/js/convertit-php-en-rev0.js' => array(),
      'fta_www/js/core6.js' => array(),
      'fta_www/js/html.js' => array(),
      'fta_www/js/interface0.js' => array(),
      'fta_www/js/javascript.js' => array(),
      'fta_www/js/php.js' => array(),
      'fta_www/js/pour-index_php0.js' => array(),
      'fta_www/js/pour_zz_bdds_action1.js' => array(),
      'fta_www/js/pour_zz_source1.js' => array(),
      'fta_www/js/sql.js' => array(),
      'fta_www/js/texte.js' => array(),
      'fta_www/js/jslib/esprima.js' => array(),
      
   );
   $indice_du_dossier=2; /* le dossier 1 est celui de la racine */
   $tableau_des_dossiers=array();
   foreach( $tab as $k1 => $v1){
     $dossier_cible='../../ftb/'.substr($k1,0,strrpos($k1,'/'));
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
//              echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( htmlentities($contenu) , true ) . '</pre>' ; exit(0);
            }else if(isset($v2['a_remplacer_preg'])){
/*             
             $contenu=preg_replace($v2['a_remplacer_preg'],$v2['par'], $contenu);
             echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( htmlentities($contenu) , true ) . '</pre>' ; exit(0);
            /*
            
             $text = '<p style="padding:0px;"><strong style="padding:0;margin:0;">hello</strong></p>';

             echo preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/si",'<$1$2>', $text);

             // <p><strong>hello</strong></p>            
            
            */
            }
            
            
           }
           
           
           
       }

       $contenu=preg_replace('/\\/\\*debut'.'spécifiquefta\\*\\/(.*?)\\/\\*fin'.'spécifiquefta\\*\\//us','/* spécifique fta */', $contenu);
       if($k1==='fta_www/zz_cibles_action1.php'){
//           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( htmlentities($contenu) , true ) . '</pre>' ; exit(0);
       }


       
       $dossier_cible='../../ftb/'.substr($k1,0,strrpos($k1,'/'));
//       echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $dossier_cible , true ) . '</pre>' ; exit(0);
       if(is_dir($dossier_cible)){
       }else{
        if(!mkdir($dossier_cible,0777,true)){
         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . ' impossible de créer le répertoire "'.$dossier_cible.'" </pre>' ; exit(0);
        }
       }
       $fichier_cible=$dossier_cible.substr($k1,strrpos($k1,'/'));
//       echo __FILE__ . ' ' . __LINE__ . ' $fichier_cible = <pre>' . var_export( $fichier_cible , true ) . '</pre>' ; exit(0);
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
   
   $contenu_fichier_structure=$contenu=file_get_contents('../'.'fta_inc/db/sqlite/structure.system.db.sql');
   
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . htmlentities( $contenu_fichier_structure ) . '</pre>' ; exit(0);
   
   if($contenu_fichier_structure===false){
    echo __FILE__ . ' ' . __LINE__ . ' fichier structure introuvable = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }

   
   /* on supprime la base systeme ftb */
   $chemin_base_systeme='../../ftb/fta_inc/db/sqlite/system.db';
   if(is_file($chemin_base_systeme)){
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_base_systeme , true ) . '</pre>' ; exit(0);
    if(!unlink($chemin_base_systeme)){
     echo __FILE__ . ' ' . __LINE__ . ' unlink base system impossible = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    }
   }else{
    echo __FILE__ . ' ' . __LINE__ . ' $chemin_base_systeme = <pre>' . var_export( $chemin_base_systeme , true ) . '</pre>' ; exit(0);
   }
   
   $base_ftb = new SQLite3($chemin_base_systeme);
   if(false === $base_ftb->exec($contenu_fichier_structure)){
    echo __FILE__ . ' ' . __LINE__ . ' erreur de création de la structure base system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }
   
   // donnees.system.db.sql   
   $contenu_initialisation="
    INSERT INTO `tbl_cibles`( `chi_id_cible`, `chp_nom_cible`, `chp_commentaire_cible`, `chp_dossier_cible`) VALUES ('1','fta','la racine','ftb');
    INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chp_nom_dossier`, `chx_cible_dossier`) VALUES ('1','/','1');
    INSERT INTO `tbl_bases_de_donnees`( `chi_id_basedd`, `chp_nom_basedd`, `chp_rev_basedd`, `chp_commentaire_basedd`, `chx_dossier_id_basedd`, `chp_genere_basedd`, `chx_cible_id_basedd`, `chp_php_basedd`) VALUES ('1','system.db','','initialisation','2','','1','');
    INSERT INTO `tbl_utilisateurs`( `chi_id_utilisateur`, `chp_nom_de_connexion_utilisateur`, `chp_mot_de_passe_utilisateur`, `chp_commentaire_utilisateur`) VALUES ('1','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','mdp = admin');
   ";

   if(false === $base_ftb->exec($contenu_initialisation)){
    echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }

   $contenu_table_dossiers ='';
   foreach( $tableau_des_dossiers as $k1 => $v1 ){
    $contenu_table_dossiers.=",('".$v1."','".substr($k1,strlen('../../ftb'))."','1')";
    
   }
   if($contenu_table_dossiers!==''){
    
    $contenu_table_dossiers=substr($contenu_table_dossiers,1);
    $contenu_table_dossiers ='INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chp_nom_dossier`, `chx_cible_dossier`) VALUES '.$contenu_table_dossiers;
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $contenu_table_dossiers , true ) . '</pre>' ; exit(0);
    
    if(false === $base_ftb->exec($contenu_table_dossiers)){
     echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    }
    
   }else{
        echo __FILE__ . ' ' . __LINE__ . ' problème sur le contenu des dossiers = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
   }

   $contenu_table_sources ='';
   foreach( $tab as $k1 => $v1 ){
    $contenu_table_sources.=",('".substr($k1,strrpos( $k1 , '/' )+1) ."','1','".$v1['dossier']."')\r\n";
    
   }
   if($contenu_table_sources!==''){
    
    $contenu_table_sources=substr($contenu_table_sources,1);
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . htmlentities( $contenu_table_sources ) . '</pre>' ; exit(0);
    
    $contenu_table_sources ='INSERT INTO `tbl_sources`( `chp_nom_source`, `chx_cible_id_source`, `chx_dossier_id_source`) VALUES '.$contenu_table_sources;
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . htmlentities( $contenu_table_sources ) . '</pre>' ; exit(0);
    if(false === $base_ftb->exec($contenu_table_sources)){
     echo __FILE__ . ' ' . __LINE__ . ' erreur de création des valeurs dans la bdd system = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    }
    
    
   }
   
   
   
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);

    ajouterMessage('info' , ' les fichiers ont été copiés' , BNF );

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

$db = new SQLite3('../fta_inc/db/sqlite/system.db');

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
    recharger_la_page('zz_cibles1.php');
   }
  }
  
  if($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']==='1'){
      $sql='
       UPDATE `tbl_cibles` SET 
          `chp_commentaire_cible` = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']).'\'
        WHERE 
          `chi_id_cible`          = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']).'\'
      ';
  }else{
      $sql='
       UPDATE `tbl_cibles` SET 
          `chp_nom_cible`         = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'])        .'\'
        , `chp_dossier_cible`     = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'])    .'\'
        , `chp_commentaire_cible` = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']).'\'
        WHERE 
          `chi_id_cible`          = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']).'\'
      ';
  }

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
  error_reporting(0);
  if(false === $db->exec($sql)){
    error_reporting(E_ALL);
    if($db->lastErrorCode()===19){
     ajouterMessage('erreur' , __LINE__ .' ce nom existe déjà en bdd ' , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']); 
    }else{
     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorCode() , true ) . '</pre>' ; exit(0);
     ajouterMessage('erreur' , __LINE__ .' '. $db->lastErrorMsg() , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']); 
    }
   
  }else{
   error_reporting(E_ALL);
   if($db->changes()===1){
    
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
    ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);
    
   }else{
    
    ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']);
    
   }
  }

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__confirme_suppression'){

  /*
    ===================================================================================================================
    ============================================= CONFIRMATION DE LA SUPPRESSION ======================================
    ===================================================================================================================
  */

  /*
  http://localhost/functToArray/fta/fta_www/zz_cibles_action1.php?__id=2&__action=__suppression
  */
  $__id= isset($_POST['__id1'])?(is_numeric($_POST['__id1'])?$_POST['__id1']:0):0;
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);

  if($__id!==0){
      $__valeurs=recupere_une_donnees_des_cibles($__id,$db);
  }else{
      ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer cet enregistrement ' , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
  }

  $dossier='../../'.$__valeurs['T0.chp_dossier_cible'];
  
        $dossier='../../'.$__valeurs['T0.chp_dossier_cible'];

        if($__id==='1'){

           if(APP_KEY==='fta'){

                ajouterMessage('avertissement',__LINE__.' on ne peut pas supprimer ce dossier',BNF);
                recharger_la_page('zz_cibles1.php');
           }else{

            if($__valeurs['T0.chp_dossier_cible']==='fta'){

             
                // on peut y aller sans test de dossier
            }else{
             
              if((is_dir($dossier))){

                  ajouterMessage('erreur',__LINE__.' le dossier existe , on ne peut pas supprimer cet enregistrement',BNF);
                  recharger_la_page('zz_cibles1.php');

              }
             
            }
             
           }
        }else{




            if((is_dir($dossier))){

                ajouterMessage('erreur',__LINE__.' le dossier existe , on ne peut pas supprimer cet enregistrement',BNF);
                recharger_la_page('zz_cibles1.php');

            }
        }
  
  
  
  
  $db->querySingle('PRAGMA foreign_keys=ON');
  $sql='DELETE FROM tbl_cibles WHERE `chi_id_cible` = \''.sq0($__id).'\' ' ;
  if(false === $db->exec($sql)){

      ajouterMessage('erreur' ,  __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

  }else{
   
     ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
     recharger_la_page('zz_cibles1.php');

  }

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__creation'){
  
  /*
    ===================================================================================================================
    ============================================= CREATION ============================================================
    ===================================================================================================================
  */
  
  if(erreur_dans_champs_saisis_cibles()){
   
      recharger_la_page(BNF.'?__action=__creation');
      
  }
  
  $sql='
   INSERT INTO `tbl_cibles` (`chp_nom_cible` , `chp_dossier_cible`, `chp_commentaire_cible` ) VALUES
     (
        \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'])         .'\'
      , \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'])     .'\'
      , \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']) .'\'
     )
  ' ;
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
  if(false === $db->exec($sql)){ // 
   
      ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
      recharger_la_page(BNF.'?__action=__creation'); 
    
  }else{
   
    ajouterMessage('info' , __LINE__ .' : l\'enregistrement ('.$db->lastInsertRowID().') a bien été créé' , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$db->lastInsertRowID()); 
   
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
       $__valeurs=recupere_une_donnees_des_cibles($__id,$db);
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

   $__id=$_SESSION[APP_KEY][NAV][BNF]['chi_id_cible'];
   if($__id!==0 && $__id!=='1'  && $__id!==1 ){
       $__valeurs=recupere_une_donnees_des_cibles($__id,$db);
       $__dossier='../../'.$__valeurs['T0.chp_dossier_cible'];
       if(is_dir($__dossier)){
          if(le_dossier_est_vide($__dossier)){
              if(rmdir($__dossier)){
                  ajouterMessage('succes' , __LINE__ . ' le dossier "'.$__dossier.'" a été supprimé avec succès !'  , BNF );
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
       ajouterMessage('avertissement' , __LINE__ . ' il y a eu un problème'  , BNF );
   }
   recharger_la_page($_SERVER['REQUEST_URI']);

/*
  if(is_dir($dossier)){
   $o1.='le dossier existe '.CRLF;
   
   if(le_dossier_est_vide($dossier)){
    
    $o1.='<br />le dossier '.$dossier.' est vide'.CRLF;
    $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;
    $o1.=' <input type="hidden" value="__suppression_du_dossier" name="__action" id="__action" />'.CRLF;
*/

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
 recharger_la_page('zz_cibles1.php');


}

/*
 ====================================================================================================================
 ====================================================================================================================
 ============================================= GET ==================================================================
 ====================================================================================================================
 ====================================================================================================================
*/
$__id='0';
if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);
 if($__id===0 || $__id==='0' || $__id==='1'){
       if($__id === '1'){

        if(APP_KEY === 'fta'){
            ajouterMessage('erreur',__LINE__.' on ne peut pas supprimer la cible 1');
            recharger_la_page('zz_cibles1.php');
        }else{
         /*
          on peut y aller à priori
         */
         
        }
       }

 }else{
  /*
  http://localhost/functToArray/fta/fta_www/zz_cibles_action1.php?__id=1&__action=__suppression
  */
  $__valeurs=recupere_une_donnees_des_cibles($__id,$db);
  

  if($__valeurs['T0.chi_id_cible']===1){
   ajouterMessage('erreur' , __LINE__ .' on ne peut pas supprimer la cible 1'  );
   recharger_la_page('zz_cibles1.php');
  }
  
  $dossier='../../'.$__valeurs['T0.chp_dossier_cible'];
  if(is_dir($dossier)){
   ajouterMessage('erreur' , __LINE__ .' le dossier existe, on ne peut pas supprimer cet enregistrement'  );
   recharger_la_page('zz_cibles1.php');
  }
  
  
 }
}  

if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
 if($__id==='0'){
  recharger_la_page('zz_cibles1.php');
 }else{
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( is_numeric($__id) , true ) . '</pre>' ; exit(0);
  $__valeurs=recupere_une_donnees_des_cibles($__id,$db);
  
  
  if(!isset($__valeurs['T0.chi_id_cible'])){
   recharger_la_page('zz_cibles1.php');
  }else{
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_GET , true ) . '</pre>' ; exit(0);
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

$o1.='<h1>gestion de cible '.boutonRetourALaListe().'</h1>';



if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){

  /*
  ============================================================================
  ==== __suppression =========================================================
  ============================================================================
  */

  /*
  http://localhost/functToArray/fta/fta_www/zz_cibles_action1.php?__id=2&__action=__suppression
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
  $o1.='   <textarea  name="chp_commentaire_cible" id="chp_commentaire_cible"  rows="15" >'.htmlentities($chp_commentaire_cible,ENT_COMPAT).'</textarea>'.CRLF;
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
  $o1.='   <textarea  name="chp_commentaire_cible" id="chp_commentaire_cible"  rows="15" >'.htmlentities($__valeurs['T0.chp_commentaire_cible'],ENT_COMPAT).'</textarea>'.CRLF;
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
  if(APP_KEY==='fta' && basename(dirname(dirname(__FILE__)))==='fta' ){
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