<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true);
require_once('../fta_inc/db/acces_bdd_bases_de_donnees1.php');
require_once('../fta_inc/phplib/sqlite.php');

$__page_liste_de_reference='zz_bdds_l1.php';

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);
if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles_l1.php');
}
$js_a_executer_apres_chargement=array();
/*
  =====================================================================================================================
*/


/*
  ========================================================================================
*/
//========================================================================================================================
function erreur_dans_champs_saisis_basesdd(){
    $uneErreur=false;
    if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']===''){
     /*
     // A=65 , a=97 z=122 , 0=48 , 9=57 _ - .
     // todo ajouter le test
     */
     $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|'; 
     ajouterMessage('erreur' ,  __LINE__ .' : le nom de la base de donnée doit etre indiqué et ne doit pas contenir les caractères espaces ' , BNF );
     $uneErreur=true;
    }
    
    if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'],0,1)===' '){
     
     ajouterMessage('erreur' ,  __LINE__ .' : le nom de la base de donnée ne doit pas commencer par un espace ' , BNF );
     
     $uneErreur=true;
     
    }
    if($_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']==='sqlite'){
     if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']==='' || $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']===false ){
      ajouterMessage('erreur' ,  __LINE__ .' : le dossier doit être indiqué pour une base sqlite' , BNF );
      $uneErreur=true;
     }
    }

    if(!($_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']==='sqlite' || $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']==='mysql'|| $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']==='' )){
        ajouterMessage('erreur' ,  __LINE__ .' : le fournisseur de la bdd doit être "sqlite" ou "mysql" ou bien ne doit pas être renseigné ' , BNF );
        $uneErreur=true;
    }

    if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']===''){
        $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']=NULL;
    }

    if($_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd']===''){
        $_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd']=NULL;
    }
    if($_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']===''){
        $_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']=NULL;
    }

    if($_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']===''){
        $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']=NULL;
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
 $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']          =$_POST['chp_nom_basedd']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']  =$_POST['chp_commentaire_basedd'] ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']  =$_POST['chp_fournisseur_basedd'] ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd']  =$_POST['chp_rev_travail_basedd'] ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']          =$_POST['chp_rev_basedd']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']       =$_POST['chp_genere_basedd']      ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']           =isset($_POST['chi_id_basedd'])?decrypter($_POST['chi_id_basedd']) : '';
 $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']   =isset($_POST['chx_dossier_id_basedd'])?decrypter($_POST['chx_dossier_id_basedd']) : '';
 $_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_basedd']     =$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'];
 


 
 if(isset($_POST['__ecrire_sur_disque'])){
 /*
   ====================================================================================================================
   ============================================= ECRIRE SUR DISQUE ====================================================
   ====================================================================================================================
 */

     $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'],$GLOBALS[BDD][BDD_1][LIEN_BDD]);

     if($__valeurs['T2.chp_dossier_cible']!==null && $__valeurs['T1.chp_nom_dossier']!==null ){
      
      $nomCompletSource='../../'.$__valeurs['T2.chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'_structure.'.$_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'].'.sql';

      if(is_file($nomCompletSource)){
        if(!sauvegarder_et_supprimer_fichier($nomCompletSource)){
          ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer le fichier du disque ' , BNF );
          recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
        }
      }

      if($fd=fopen($nomCompletSource,'w')){
       
       $ret=fwrite($fd,$_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']);
       if($ret!==false){

         fclose($fd);
         ajouterMessage('succes' , __LINE__ .' : Le fichier structure.'.$_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'].'.sql a bien été écrit sur le disque' );
        
       }else{
       
         ajouterMessage('erreur' , __LINE__ .' : il y a eu un problème lors de l\'écriture ' );
       
       }
      }else{
       
         ajouterMessage('erreur' , __LINE__ .' : il y a eu un problème lors de l\'ouverture du fichier ' );
       
      }
      
     }else{
      
         ajouterMessage('erreur' , __LINE__ .' : problème sur le dossier cible ' );
         
     }
     
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);


 }else if(isset($_POST['__importer_le_system_de_fta'])){

   if(APP_KEY === $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] && APP_KEY !== $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] &&  $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']==='ftb' ){    
   
    $nom_de_la_base_source='../../'.APP_KEY.'/fta_inc/db/sqlite/system.db';
    $nom_de_la_base_cible ='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'/fta_inc/db/sqlite/system.db';
    
    if(copy($nom_de_la_base_source , $nom_de_la_base_cible )){

            ajouterMessage('info' , __LINE__ .' la base a bien été importée ' );
    }else{
            ajouterMessage('erreur' , __LINE__ .' la base n\'a pas été importée ' );
    }
   
   }
   

   recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);


 }else if(isset($_POST['__convertir_sql_sqlite_en_rev'])){

 /*
   ====================================================================================================================
   ============================================= CONVERTIR UN SQL EN REV ==============================================
   ====================================================================================================================
 */
  $chemin_base_temporaire='..'.DIRECTORY_SEPARATOR.APP_KEY.'_temp/'.date('Y/m/d');
  $continuer=true;
  if(!is_dir($chemin_base_temporaire)){
   if(!mkdir($chemin_base_temporaire,0777,true)){
     ajouterMessage('erreur' , __LINE__ .' : impossible de créer le répertoire temporaire ' );
     $continuer=false;
   }
  }
  if($continuer===true){
   
      
      if($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']!==''){
       
          $base_temporaire=$chemin_base_temporaire.DIRECTORY_SEPARATOR.sha1(date('Y-m-d-H-i-s').$_SESSION[APP_KEY]['sess_id_utilisateur']).'.db';
          
          $temp_db = new SQLite3($base_temporaire);
          if(is_file($base_temporaire)){
           
           
           $res0= $temp_db->exec($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']);
           if($res0===true){
             $temp_db->close();
             require_once('../fta_inc/phplib/sqlite.php');
             $ret=obtenir_la_structure_de_la_base_sqlite($base_temporaire, true);
             if($ret['status']===true){
              $tableauDesTables=$ret['value'];
              $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$tableauDesTables;
              $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']='__convertir_sql_sqlite_en_rev';

             }else{
               ajouterMessage('erreur' , ' erreur sur la structure de la base ' , BNF  );
              
             }
            

           }
           /* ne pas créer une copie de sauvegarde d'un fichier temporaire */
           sauvegarder_et_supprimer_fichier($base_temporaire,true); 

          }else{
            ajouterMessage('erreur' , __LINE__ .' : impossible de créer fichier temporaire ' );
          }
          
       
      }else{
       
          ajouterMessage('erreur' , __LINE__ .' : il n\'y a rien à convertir ' );
             
      }
  }

  recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

  
 }else if( isset($_POST['___produire_le_dump_des_donnees'])){
  
     $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents( $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] , $GLOBALS[BDD][BDD_1][LIEN_BDD] );
     
     $chemin_fichier='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];
     
     if( is_file($chemin_fichier)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false  ){

         $ret=obtenir_la_structure_de_la_base_sqlite($chemin_fichier,true);
         if($ret['status']===true){
          
          
          $nom_du_fichier_dump   ='../../'.$__valeurs['T2.chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].'_donnees.'.$_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'].'.sql';
          
          
          $retour_ecriture=ecrire_le_dump_de_la_base_sqlite_sur_disque($chemin_fichier,$nom_du_fichier_dump,$ret['value']);
          if($retour_ecriture['status']===true){
             ajouterMessage('info' , __LINE__ .' le fichier dump a bien été produit ' , BNF );
          }else{
             ajouterMessage('erreur' , __LINE__ .' problème pour produire le dump ' , BNF );
          }
          

          
         }else{
           ajouterMessage('erreur' , ' erreur sur la structure de la base "'.$__valeurs['T0.chp_nom_basedd'].'"' , BNF  );
          
         }
       
     }else{

             ajouterMessage('erreur' , __LINE__ .' fichier de la base de donnée sqlite introuvable ' , BNF );

     }
     $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$tableauDesTables;
     $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']='___produire_le_dump_des_donnees';

    
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

  
  
 }else if( isset($_POST['__comparer_les_structures']) ){
  
     require_once(INCLUDE_PATH.'/phplib/sqlite.php');
     
     $obj=comparer_une_base_physique_et_une_base_virtuelle($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] , $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']);
     
     if($obj['status']===true){
         $_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux']=$obj['value']; //array( 'tableau1' => $ret['value'] , 'tableau2' => $ret2['value'] );
//         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux'] , true ) . '</pre>' ; exit(0);
     }else{
         ajouterMessage('erreur' , __LINE__ . ' erreur sur la comparaison des structures' , BNF  );
     }
    
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

  
 }else if( isset($_POST['___produire_le_rev_v2']) ){
     $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents( $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] , $GLOBALS[BDD][BDD_1][LIEN_BDD] );
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre><pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
     
     $chemin_fichier='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];
      
   //   $o1.='&nbsp <span>Ce '.$chemin_fichier.'</span>';  

     if( is_file($chemin_fichier)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false  ){
      
         $ret=obtenir_la_structure_de_la_base_sqlite_v2($chemin_fichier,true);
//         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $ret , true ) . '</pre>' ; exit(0);

         if($ret['status']===true){

          /* 
            on vérifiera plus bas que cette variable de session existe pour produire le rev
          */
//          echo __FILE__ . ' ' . __LINE__ . ' $ret[value] = <pre>' . var_export( $ret['value'] , true ) . '</pre>' ; exit(0);
          $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$ret['value'];
          $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']='___produire_le_rev_v2';

          
         }else{
          
           ajouterMessage('erreur' , ' erreur sur la structure de la base "'.$__valeurs['T0.chp_nom_basedd'].'"' , BNF  );
          
         }

     }else{

             ajouterMessage('erreur' , __LINE__ .' fichier de la base de donnée sqlite introuvable ' , BNF );
     }

     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
      
  


 /*
   ====================================================================================================================
   ============================================= MODIFICATION =========================================================
   ====================================================================================================================
 */
}else if(isset($_POST['__action'])&&$_POST['__action']=='__modification'){
  if(erreur_dans_champs_saisis_basesdd()){
   if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'])&&is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'])){
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);

   }else{
    ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] );
    recharger_la_page($__page_liste_de_reference);
   }
  }
  
  sql_inclure_reference(16);
  /*sql_inclure_deb*/
  require_once(INCLUDE_PATH.'/sql/sql_16.php');
  /*sql_inclure_fin*/
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] , true ) . '</pre>' ; exit(0);

  $tt=sql_16(array(
      'n_chx_dossier_id_basedd'   => $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'],
      'n_chp_nom_basedd'          => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] ,
      'n_chp_rev_basedd'          => $_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd'] ,
      'n_chp_commentaire_basedd'  => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'] ,
      'n_chp_genere_basedd'       => $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd'] ,
      'n_chp_rev_travail_basedd'  => $_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd'] ,
      'n_chp_fournisseur_basedd'  => $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] ,
      'c_chi_id_basedd'           => $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] ,
      'c_chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
      
  ));

  if($tt['statut'] === false){
    error_reporting(E_ALL);
    if($GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode()===19){
     ajouterMessage('erreur' , __LINE__ .' ce nom existe déjà en bdd ' , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']); 
    }else{
     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() , true ) . '</pre>' ; exit(0);
     ajouterMessage('erreur' , __LINE__ .' '. $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']); 
    }
  }else{
   error_reporting(E_ALL);
   if($GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()===1){
    
    ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
    
   }else{
    
    ajouterMessage('erreur' , __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
    
   }
   
  }
  


 }else if(isset($_POST['__action'])&&$_POST['__action']=='__confirme_suppression'){

  /*
    ===================================================================================================================
    ============================================= CONFIRMATION DE LA SUPPRESSION ======================================
    ===================================================================================================================
  */

  $__id= isset($_POST['__id1'])?(is_numeric($_POST['__id1'])?$_POST['__id1']:0):0;

  if($__id!==0){
      $__valeurs=recupere_une_donnees_des_bases_de_donnees($__id,$GLOBALS[BDD][BDD_1][LIEN_BDD]);
  }else{
      ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer cet enregistrement ' , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
  }

  sql_inclure_reference(18);
  /*sql_inclure_deb*/
  require_once(INCLUDE_PATH.'/sql/sql_18.php');
  /*sql_inclure_fin*/
  

  $tt=sql_18(array(
      'chi_id_basedd'           => $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] ,
      
  ));

  if($tt['statut'] === false){
      ajouterMessage('erreur' ,  __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
  }else{
     ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
     recharger_la_page($__page_liste_de_reference);
  }

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__creation'){
  
    /*
      ===================================================================================================================
      ============================================= CREATION ============================================================
      ===================================================================================================================
    */
    
    if(erreur_dans_champs_saisis_basesdd()){
     
        recharger_la_page(BNF.'?__action=__creation');
        
    }
    
  sql_inclure_reference(17);
  /*sql_inclure_deb*/
  require_once(INCLUDE_PATH.'/sql/sql_17.php');
  /*sql_inclure_fin*/
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] , true ) . '</pre>' ; exit(0);

  $tt=sql_17(array(array(
      'chx_dossier_id_basedd'   => $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'],
      'chp_nom_basedd'          => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] ,
      'chp_commentaire_basedd'  => $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'] ,
      'chp_fournisseur_basedd'  => $_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] ,
      'chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
  )));

  if($tt['statut'] === false){
    ajouterMessage('erreur' , __LINE__ .' : ' . $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__creation'); 
   
  }else{
    ajouterMessage('info' , __LINE__ .' : l\'enregistrement ('.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastInsertRowID().') a bien été créé' , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$tt['nouvel_id']); 
  }
   
   

  recharger_la_page($_SERVER['REQUEST_URI']);



 }else if(isset($_POST['__action'])&&$_POST['__action']=='__suppression_du_dossier'){

  /*
    ===================================================================================================================
    ============================================= SUPPRESSION D'UN DOSSIER ============================================
    ===================================================================================================================
  */

   $__id=$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'];
   if(isset($_SESSION[APP_KEY][NAV][BNF])){
    unset($_SESSION[APP_KEY][NAV][BNF]);
   }
   if($__id!==0 && $__id!=='1'  && $__id!==1 ){
       $__valeurs=recupere_une_donnees_des_bases_de_donnees($__id,$GLOBALS[BDD][BDD_1][LIEN_BDD]);
    
   }else{
       ajouterMessage('avertissement' , __LINE__ . ' il y a eu un problème'  , BNF );
   }
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
 recharger_la_page($__page_liste_de_reference);


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
 if($__id===0 || $__id==='0' ){
  ajouterMessage('erreur' , __LINE__ .' on ne peut pas supprimer cette base'  );
  recharger_la_page($__page_liste_de_reference);

 }else{

  $__valeurs=recupere_une_donnees_des_bases_de_donnees($__id,$GLOBALS[BDD][BDD_1][LIEN_BDD]);

 }
}  

if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);
 if($__id==='0'){
  recharger_la_page($__page_liste_de_reference);
 }else{
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( is_numeric($__id) , true ) . '</pre>' ; exit(0);
  $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents($__id,$GLOBALS[BDD][BDD_1][LIEN_BDD]);
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
  
  if(!isset($__valeurs['T0.chi_id_basedd'])){
   recharger_la_page($__page_liste_de_reference);
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
$o1=html_header1(array('title'=>'bases de données' , 'description'=>'bases de données'));
print($o1);$o1='';

$o1.='<h1>gestion de base de donnée ( dossier '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].') '.bouton_retour_a_la_liste($__page_liste_de_reference).'</h1>';



if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){

  /*
  ============================================================================
  ==== __suppression =========================================================
  ============================================================================
  */


 $o1.=' <form method="post" class="yyformDelete">'.CRLF;
 $o1.='   <input type="hidden" value="'.encrypter($__id).'" name="chi_id_basedd" id="chi_id_basedd" />'.CRLF;
 $o1.='   veuillez confirmer le suppression de  : '.CRLF;
 $o1.='   <br /><br /><b>'.
       '('.$__valeurs['T0.chi_id_basedd'].') : nom : ' .$__valeurs['T0.chp_nom_basedd'].' ,  <br /> '.
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


  $o1.='<h2>ajouter une base de donnée</h2>'.CRLF;

  $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.CRLF;

  $chp_nom_basedd =isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_basedd).'" name="chp_nom_basedd" id="chp_nom_basedd" maxlength="64" style="max-width:16em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  
  
  $chp_fournisseur_basedd =isset($_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">fournisseur</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_fournisseur_basedd).'" name="chp_fournisseur_basedd" id="chp_fournisseur_basedd" maxlength="64" style="max-width:16em;" />'.CRLF;
  $o1.='   laisser videe ou biet mettre soit sqlite, soit mysql'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;

  

  $chx_dossier_id_basedd =isset($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] )?$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="hidden" value="'.encrypter($chx_dossier_id_basedd).'" name="chx_dossier_id_basedd" id="chx_dossier_id_basedd" style="max-width:9em;" />'.CRLF;


  $__parametres_pour_la_modale=array(
   '__fonction' => 'recupérer_un_element_parent_en_bdd' ,
   '__url' => 'zz_dossiers_c1.php',
   '__nom_champ_dans_parent' => 'chx_dossier_id_basedd',
   '__champs_texte_a_rapatrier' => array(
    'T0.chp_nom_dossier' => array(
     '__libelle_avant' => 'rattaché à "<b style="color:red;">' , 
     '__libelle_apres' => '</b>"' ,
     '__libelle_si_vide' => 'base non rattaché à un dossier'
    )
   )
  );
  $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
  $paramUrl=str_replace('\\','\\\\',$paramUrl);
  $paramUrl=str_replace('\'','\\\'',$paramUrl);
  $paramUrl=str_replace('"','\\"',$paramUrl);
  $paramUrl=rawurlencode($paramUrl);

  
  $o1.='   <a href="javascript:afficherModale1(\''.enti1($paramUrl).'\')" title="selectionner">📁</a>'.CRLF;
  $o1.='   <a class="yyavertissement" href="javascript:annuler_champ(\''.enti1($paramUrl).'\')" title="annuler">🚫</a>'.CRLF;
  
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs['T0.chx_dossier_id_basedd'] , true ) . '</pre>' ; exit(0);
  
  if($chx_dossier_id_basedd==='' || $chx_dossier_id_basedd===false || $chx_dossier_id_basedd===NULL){
   
   $o1.='<span id="T0.chp_nom_dossier">base non rattaché à un dossier</span> '.CRLF;

  }else{
   require_once('../fta_inc/db/acces_bdd_dossiers1.php');
   $__valeurs=recupere_une_donnees_des_dossiers($chx_dossier_id_basedd,$GLOBALS[BDD][BDD_1][LIEN_BDD]);
   
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
   $o1.='<span id="T0.chp_nom_dossier">rattaché à "<b style="color:red;">'.$__valeurs['T0.chp_nom_dossier'].'</b>" </span>'.CRLF;
   
  }
   



  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;




  $chp_commentaire_basedd =isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_basedd" id="chp_commentaire_basedd"  rows="15" >'.enti1($chp_commentaire_basedd,ENT_COMPAT).'</textarea>'.CRLF;
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
  $o1.='<h2>modifier une base de donnée</h2>'.CRLF;

  $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']=$__id;
  $__valeurs['T0.chp_nom_basedd']          =$_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']         ??$__valeurs['T0.chp_nom_basedd'];
  $__valeurs['T0.chp_commentaire_basedd']  =$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'] ??$__valeurs['T0.chp_commentaire_basedd'];
  $__valeurs['T0.chp_rev_travail_basedd']  =$_SESSION[APP_KEY][NAV][BNF]['chp_rev_travail_basedd'] ??$__valeurs['T0.chp_rev_travail_basedd'];
  $__valeurs['T0.chp_rev_basedd']          =$_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']         ??$__valeurs['T0.chp_rev_basedd'];
  $__valeurs['T0.chp_genere_basedd']       =$_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']      ??$__valeurs['T0.chp_genere_basedd'];
  $__valeurs['T0.chx_dossier_id_basedd']   =$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']  ??$__valeurs['T0.chx_dossier_id_basedd'] ;
  $__valeurs['T0.chp_fournisseur_basedd']  =$_SESSION[APP_KEY][NAV][BNF]['chp_fournisseur_basedd'] ??$__valeurs['T0.chp_fournisseur_basedd'] ;
  
   
  
  $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
  $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_basedd" id="chi_id_basedd" />'.CRLF;
  



  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">id , nom et fournisseur</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_nom_basedd']).'" name="chp_nom_basedd" id="chp_nom_basedd" maxlength="64" style="width:100%;max-width:16em;" />'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_fournisseur_basedd']).'" name="chp_fournisseur_basedd" id="chp_fournisseur_basedd" maxlength="64" style="width:100%;max-width:16em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  
   
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">dossier</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;

  if($__valeurs['T0.chx_dossier_id_basedd']==='' || $__valeurs['T0.chx_dossier_id_basedd']===false || $__valeurs['T0.chx_dossier_id_basedd']===NULL){
   
   $o1.='<span id="T0.chp_nom_dossier">base non rattaché à un dossier</span> '.CRLF;
  }else{
   $o1.='<span id="T0.chp_nom_dossier">rattachée à "<b style="color:red;">'.$__valeurs['T1.chp_nom_dossier'].'</b>" </span>'.CRLF;
  }
  
  $o1.='   <input  type="hidden" value="'.encrypter($__valeurs['T0.chx_dossier_id_basedd']).'" name="chx_dossier_id_basedd" id="chx_dossier_id_basedd" style="max-width:3em;"/>'.CRLF;
  
  
  $__parametres_pour_la_modale=array(
   '__fonction' => 'recupérer_un_element_parent_en_bdd' ,
   '__url' => 'zz_dossiers_c1.php',
   '__nom_champ_dans_parent' => 'chx_dossier_id_basedd',
   '__champs_texte_a_rapatrier' => array(
    'T0.chp_nom_dossier' => array(
     '__libelle_avant' => 'rattachée à "<b style="color:red;">' , 
     '__libelle_apres' => '</b>"' ,
     '__libelle_si_vide' => 'base non rattachée à un dossier'
    )
   )
  );
  $paramUrl=json_encode($__parametres_pour_la_modale,JSON_FORCE_OBJECT);
  $paramUrl=str_replace('\\','\\\\',$paramUrl);
  $paramUrl=str_replace('\'','\\\'',$paramUrl);
  $paramUrl=str_replace('"','\\"',$paramUrl);
  $paramUrl=rawurlencode($paramUrl);

  
  $o1.='   <a href="javascript:afficherModale1(\''.enti1($paramUrl).'\')" title="selectionner">📁</a>'.CRLF;
  $o1.='   <a class="yyavertissement" href="javascript:annuler_champ(\''.enti1($paramUrl).'\')" title="annuler">🚫</a>'.CRLF;
  
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs['T0.chx_dossier_id_basedd'] , true ) . '</pre>' ; exit(0);
  
  if($__valeurs['T0.chx_dossier_id_basedd']==='' || $__valeurs['T0.chx_dossier_id_basedd']===false || $__valeurs['T0.chx_dossier_id_basedd']===NULL){
   

  }else{
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
   
   
   $o1.='<br />';
   $chemin_fichier='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];
   
//   $o1.='&nbsp <span>Ce '.$chemin_fichier.'</span>';    

   if(is_file($chemin_fichier)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false  ){
    
    $o1.='&nbsp <button name="___produire_le_rev_v2" >produire le rev V2</button>';    
    $o1.='&nbsp <button name="___produire_le_dump_des_donnees" >produire le dump des données</button>';    
    
    $o1.='  <br />'.CRLF;
    $chemin_fichier_structure='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/structure.'.$__valeurs['T0.chp_nom_basedd'].'.sql';
    if(is_file($chemin_fichier_structure)){
     $o1.='  un fichier structure.'.$__valeurs['T0.chp_nom_basedd'].'.sql existe '.CRLF;
    }else{
     $o1.='  le fichier structure.'.$__valeurs['T0.chp_nom_basedd'].'.sql est absent'.CRLF;
    }
    
    $o1.='  <br />'.CRLF;
    $chemin_fichier_donnees='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/donnees.'.$__valeurs['T0.chp_nom_basedd'].'.sql';
    if(is_file($chemin_fichier_donnees)){
     $o1.='  un fichier donnees.'.$__valeurs['T0.chp_nom_basedd'].'.sql existe'.CRLF;
    }else{
     $o1.='  le fichier donnees.'.$__valeurs['T0.chp_nom_basedd'].'.sql est absent'.CRLF;
    }
    $o1.='  <br />'.CRLF;
    $o1.='<button name="__comparer_les_structures" class="yyinfo" name="">comparer les structures de la base et du champ "genere"</button>';
    
   }
   
   if(APP_KEY === $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] && APP_KEY !== $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] &&  $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']==='ftb' ){    
    /*
     cas spécial car on développe un clone de fta sur ftb
    */
    $o1.='<br />'.CRLF;
    $o1.='<button name="__importer_le_system_de_fta" >importer la base système de fta</button>';    
   }
   
   
   
   
  }
  
  
  
  if($__valeurs['T0.chx_dossier_id_basedd']!==null){
   
   
  }
  
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  
   


  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">rev</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">format rev</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a href="javascript:parentheses(&quot;chp_rev_basedd&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.formatter_le_source_rev(&quot;chp_rev_basedd&quot;);" title="formatter le source rev">(😊)</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;chp_rev_basedd&quot;);" title="formatter le source rev">#()(😊)</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_rev_basedd&quot;);" title="réduire la zone">👊</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_rev_basedd&quot;);" title="agrandir la zone">🖐</a>'.CRLF;
  $o1.='   <br />'.CRLF;
  $o1.='   <textarea  name="chp_rev_basedd" id="chp_rev_basedd"  rows="5" autocorrect="off" autocapitalize="off" spellcheck="false">'.enti1($__valeurs['T0.chp_rev_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.=' <div class="yyfdiv1">'.CRLF; // pshjc
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">outils</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a class="yyinfo" href="javascript:bdd_convertir_rev_en_sql(\'chp_rev_basedd\',\'chp_genere_basedd\' , ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] . ',' . $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] . ')">R2S&#8615;</a>'.CRLF;
  $o1.='   <button id="__ecrire_sur_disque" name="__ecrire_sur_disque" class="yyinfo">ecrire le structure.'.enti1($__valeurs['T0.chp_nom_basedd']).'.sql sur le disque</button>'.CRLF;
  $o1.='   '.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;


  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">généré</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">format sql</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_genere_basedd&quot;);" title="réduire la zone">👊</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_genere_basedd&quot;);" title="agrandir la zone">🖐</a>'.CRLF;
  $o1.='   <br />'.CRLF;
  $o1.='   <textarea  name="chp_genere_basedd" id="chp_genere_basedd"  rows="5" autocorrect="off" autocapitalize="off" spellcheck="false">'.enti1($__valeurs['T0.chp_genere_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;




  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">rev de travail</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">texte libre</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a href="javascript:parentheses(&quot;chp_rev_travail_basedd&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.formatter_le_source_rev(&quot;chp_rev_travail_basedd&quot;);" title="formatter le source rev">(😊)</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.ajouter_un_commentaire_vide_et_reformater(&quot;chp_rev_travail_basedd&quot;);" title="formatter le source rev">#()(😊)</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.reduire_la_text_area(&quot;chp_rev_travail_basedd&quot;);" title="réduire la zone">👊</a>'.CRLF;
  $o1.='   <a href="javascript:__gi1.agrandir_la_text_area(&quot;chp_rev_travail_basedd&quot;);" title="agrandir la zone">🖐</a>'.CRLF;
  $o1.='   <br />'.CRLF;
  $o1.='   <textarea  name="chp_rev_travail_basedd" id="chp_rev_travail_basedd"  rows="5" autocorrect="off" autocapitalize="off" spellcheck="false">'.enti1($__valeurs['T0.chp_rev_travail_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;


  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">commentaire</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">texte libre</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a href="javascript:__gi1.agrandir_ou_reduire_la_text_area(&quot;chp_commentaire_basedd&quot;);" title="agrandir ou réduire la zone">🖐👊</a>'.CRLF;
  $o1.='   <br />'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_basedd" id="chp_commentaire_basedd"  rows="5" >'.enti1($__valeurs['T0.chp_commentaire_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;






  $o1.='<div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.='</div>'.CRLF;

  $o1.='</form>'.CRLF;
  
  
  $js_a_executer_apres_chargement[]=array(
   'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea' , 'parametre' => 'chp_rev_basedd'
  );

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);

  if((isset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']) && count($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'])>0 ) ){

   

      if($_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables']==='___produire_le_rev_v2'){
          $js_a_executer_apres_chargement[]=array(
            'nomDeLaFonctionAappeler' => 'traite_le_tableau_de_la_base_sqlite_v2' , 'parametre' => array( 'donnees' => $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'] , 'zone_rev' => 'chp_rev_basedd' , 'contexte' => $_SESSION[APP_KEY][NAV][BNF]['__contexte_tableauDesTables'] )
          );
          unset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']);
      }
   
  }

  if(isset($_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux']) && count($_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux'])>0){
//      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
      $js_a_executer_apres_chargement[]=array(
        'nomDeLaFonctionAappeler' => 'comparer_deux_tableaux_de_bases_sqlite' , 'parametre' => array( 'donnees' => $_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux'] , 'zone_resultat' => 'chp_commentaire_basedd'  )
      );
      unset($_SESSION[APP_KEY][NAV][BNF]['comparer_deux_tableaux']);
   
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

$js_a_executer_apres_chargement[]=array(
  'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\'est pour' , 'l\'exemple' )
);

$par=array(
 'module_a_inclure'=>array('js/module_svg_bdd.js'),
 'js_a_inclure'=>array('js/pour_zz_bdds_action1.js','js/sql.js'),
 'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement
);
$o1.=html_footer1($par);
print($o1);$o1='';