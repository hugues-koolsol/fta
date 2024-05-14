<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_dossiers1.php');


if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible avant d\'accéder aux dossiers'  );
   recharger_la_page('zz_cibles1.php'); 
}

$js_a_executer_apres_chargement=array();
/*
  ========================================================================================
*/
function boutonRetourALaListe(){
  return '&nbsp;<a href="zz_dossiers1.php" style="font-size:1rem;">retour à la liste</a>';
}
/*
  ========================================================================================
*/
//========================================================================================================================
function erreur_dans_champs_saisis_dossiers(){
 
 $uneErreur=false;
 
 if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier']===''){
  /*
  // A=65 , a=97 z=122 , 0=48 , 9=57
  // todo ajouter le test
  */
  $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|'; 
  ajouterMessage('erreur' ,  __LINE__ .' : le nom dossier doit etre indiqué et ne doit pas contenir les caractères espaces ' , BNF );
  $uneErreur=true;
 }
 
 if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'],0,1)!=='/'){
  
  ajouterMessage('erreur' ,  __LINE__ .' : le nom du dossier doit commencer par un caractère "/" ' , BNF );
  $uneErreur=true;
  
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

 $_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier']         =$_POST['chp_nom_dossier']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chx_cible_dossier']       =$_POST['chx_cible_dossier']    ?? $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'];
 $_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']           =isset($_POST['chi_id_dossier'])?decrypter($_POST['chi_id_dossier']) : '';
 
 
 
 
 if(isset($_POST['__effacer_du_disque'])){
  
  /*
    ====================================================================================================================
    ============================================= SUPPRIMER LE FICHIER DU DISQUE =======================================
    ====================================================================================================================
  */

  $fichier_cible='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'].'/'.$_POST['__effacer_du_disque'];
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $fichier_cible , true ) . '</pre>' ; exit(0);
  
  if(unlink($fichier_cible)){
    ajouterMessage('succes' , __LINE__ .' : le fichier a bien été supprimé du disque' , BNF );
  }else{
    ajouterMessage('erreur' , __LINE__ .' : le fichier n\'a pas été supprimé du disque' , BNF );
  }
  recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 


  
 }else if(isset($_POST['__creer_le_fichier_en_base'])){

  /*
    ====================================================================================================================
    ============================================= CREER LE FICHIER EN BASE =============================================
    ====================================================================================================================
  */

//  echo __LINE__ . '$_POST=<pre>' . var_export($_POST,true) . '</pre>'; exit();
  
  $nom_complet_source=$_POST['__creer_le_fichier_en_base'];
  
  $fichier_cible='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'].'/'.$_POST['__creer_le_fichier_en_base'];
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $fichier_cible , true ) . '</pre>' ; exit(0);

  $taille_contenu=filesize($fichier_cible);
  $contenuFichier='';
  if($taille_contenu<=64000){
   $contenuFichier=file_get_contents($fichier_cible);
  }
  
  $sql='
   INSERT INTO `tbl_sources` (`chp_nom_source` , chx_dossier_id_source , chx_cible_id_source, `chp_commentaire_source`, `chp_rev_source` , chp_genere_source ) VALUES
     (
        \''.addslashes1($nom_complet_source)                                 .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'])      .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_cible_dossier'])   .'\'
      , \''.addslashes1('Importé le '.date('Y-m-d H:i:s').'') .'\'
      , \''.addslashes1('')                                                  .'\'
      , \''.addslashes1($contenuFichier)                                     .'\'      
     )
  ' ;
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( htmlentities($sql) , true ) . '</pre>' ; exit(0);
  if(false === $db->exec($sql)){ // 
   
      ajouterMessage('erreur' , __LINE__ .' : le fichier n\'a pas été créé en base' , BNF );
    
  }else{
   
    ajouterMessage('succes' , __LINE__ .' : le fichier a bien été créé en base' , BNF );
    if($taille_contenu>64000){
     ajouterMessage('avertissement' , __LINE__ .' sa taille est supérieure à 64000 caractère et il n\'a pas été intégré dans le champ "genere" ' , BNF );
    }
   
  }
  recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
  
  
  // chp_nom_source	chp_commentaire_source	chx_cible_id_source	chx_dossier_id_source	chp_rev_source



 }else if(isset($_POST['__supprimer_ce_repertoire_du_disque'])){

  /*
    ====================================================================================================================
    ============================================= SUPPRIMER UN REPERTOIRE DU DISQUE ====================================
    ====================================================================================================================
  */

//     echo __LINE__ . '$_POST=<pre>' . var_export($_POST,true) . '</pre>'; exit();
     
     if(rmdir($_POST['__supprimer_ce_repertoire_du_disque'])){
      
       ajouterMessage('succes' , __LINE__ .' : la suppression du répertoire a réussi' , BNF );
       
     }else{
      
       ajouterMessage('erreur' , __LINE__ .' : la suppression du répertoire a échoué' , BNF );
       
     }

     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
  
  
 }else if(isset($_POST['__importer_ce_fichier_de_'.APP_KEY])){
  
  /*
    ====================================================================================================================
    ============================================= IMPORTER UN FICHIER ==================================================
    ====================================================================================================================
  */
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre><pre>' . var_export($_POST,true) . '</pre>' ; exit(0);
  $fichier_cible='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'].substr($_POST['__importer_ce_fichier_de_'.APP_KEY],strrpos($_POST['__importer_ce_fichier_de_'.APP_KEY],'/'));
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $fichier_cible , true ) . '</pre>' ; exit(0);


  if(copy($_POST['__importer_ce_fichier_de_'.APP_KEY] , $fichier_cible)){

       ajouterMessage('succes' , __LINE__ .' : l\'import du fichier a réussi' , BNF );
       
       /* todo sql */
       
       
  }else{
   
       ajouterMessage('erreur' , __LINE__ .' : l\'import du fichier a échoué' , BNF );
  }
   
  recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
   
  
  
  
 }else if(isset($_POST['__creer_le_repertoire_sur_le_disque'])){
  
  /*
    ====================================================================================================================
    ============================================= CREER LE REPERTOIRE ==================================================
    ====================================================================================================================
  */
  
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);
     
     $chemin_relatif='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'];
     
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_relatif , true ) . '</pre>' ; exit(0);
     
     if(mkdir($chemin_relatif, 0777 , true)){
       ajouterMessage('succes' , __LINE__ .' : la création du répertoire a réussi' , BNF );
     }else{
       ajouterMessage('erreur' , __LINE__ .' : la création du répertoire a échoué' , BNF );
     }
     
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__modification'){

  /*
    ====================================================================================================================
    ============================================= MODIFICATION =========================================================
    ====================================================================================================================
  */

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  if(erreur_dans_champs_saisis_dossiers()){
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
   if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'])&&is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'])){
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']);

   }else{
    ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'] );
    recharger_la_page('zz_dossiers1.php');
   }
  }
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  
  if($_SESSION[APP_KEY][NAV][BNF]['verification'][0]!=$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']){
//   ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'] );
//   recharger_la_page('zz_dossiers1.php');   
  }
  
  $sql='
   UPDATE `tbl_dossiers` SET 
      `chp_nom_dossier`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'])        .'\'
    , `chx_cible_dossier`    = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_cible_dossier'])   .'\'
    
    
    WHERE 
      `chi_id_dossier`          = '.addslashes($_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']).'
  '; // 
//  echo $sql;

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->exec($sql) , true ) . '</pre>' ; exit(0);
  error_reporting(0);
  if(false === $db->exec($sql)){
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
    error_reporting(E_ALL);
    if($db->lastErrorCode()===19){
     ajouterMessage('erreur' , __LINE__ .' ce nom existe déjà en bdd ' , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
    }else{
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorCode() , true ) . '</pre>' ; exit(0);
     ajouterMessage('erreur' , __LINE__ .' '. $db->lastErrorMsg() , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
    }
   
  }else{
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
   error_reporting(E_ALL);
   if($db->changes()===1){
    
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
    ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']);
    
   }else{
    
    ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']);
    
   }
  }

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__confirme_suppression'){

  /*
    ===================================================================================================================
    ============================================= CONFIRMATION DE LA SUPPRESSION ======================================
    ===================================================================================================================
  */
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);

  $__id= isset($_POST['chi_id_dossier'])?decrypter($_POST['chi_id_dossier']):0;

  if($__id!==false){
   
     $__valeurs=recupere_une_donnees_des_dossiers($__id,$db);

     if($__valeurs['T0.chp_nom_dossier']=='/'){
      
         ajouterMessage('erreur' ,  __LINE__ .' : on ne peut pas supprimer le dossier racine' , BNF );
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
         
     }
     $nombre_de_sources=recupere_le_nombre_de_sources_de_dossier($__id,$db);

     if($nombre_de_sources>0){

         ajouterMessage('erreur' ,  __LINE__ .' : ce dossier contient encore des sources rattachés <a class="yyinfo" href="zz_sources1.php?chi_id_dossier='.$__valeurs['T0.chi_id_dossier'].'">voir les sources du dossier '.$__valeurs['T0.chp_nom_dossier'].'</a>' , BNF );
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

     }else{

         $sql='DELETE FROM tbl_dossiers WHERE `chi_id_dossier` = \''.addslashes1($__id).'\' ' ;
         if(false === $db->exec($sql)){

             ajouterMessage('erreur' ,  __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
             recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

         }else{
          
            ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
            recharger_la_page('zz_dossiers1.php');

         }
     }

  }else{
   
      ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer cet enregistrement ' , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
      
  }



 }else if(isset($_POST['__action'])&&$_POST['__action']=='__creation'){
  
  /*
    ===================================================================================================================
    ============================================= CREATION ============================================================
    ===================================================================================================================
  */
  
  if(erreur_dans_champs_saisis_dossiers()){
   
      recharger_la_page(BNF.'?__action=__creation');
      
  }
  
  $sql='
   INSERT INTO `tbl_dossiers` (`chp_nom_dossier`  , chx_cible_dossier  ) VALUES
     (
        \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'])        .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_cible_dossier'])    .'\'
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
 recharger_la_page('zz_dossiers1.php');


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
  ajouterMessage('erreur' , __LINE__ .' il y a eu un problème '  );
  recharger_la_page('zz_dossiers1.php');
 }else{
  $__valeurs=recupere_une_donnees_des_dossiers($__id,$db);
  if($__valeurs['T0.chp_nom_dossier']==='/'){
    recharger_la_page('zz_dossiers1.php');
  }
  
 }
}  

if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
 if($__id==='0'){
  recharger_la_page('zz_dossiers1.php');
 }else{
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( is_numeric($__id) , true ) . '</pre>' ; exit(0);
  $__valeurs=recupere_une_donnees_des_dossiers($__id,$db);
  
  // echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
  
  if($__valeurs['T0.chp_nom_dossier']==='/'){
    recharger_la_page('zz_dossiers1.php');
  }
  
  
  if(!isset($__valeurs['T0.chi_id_dossier'])){
   recharger_la_page('zz_dossiers1.php');
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
$o1=html_header1(array('title'=>'dossiers' , 'description'=>'dossiers'));
print($o1);$o1='';

$o1.='<h1>gestion de dossier '.boutonRetourALaListe().'</h1>';



if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){

  /*
  ============================================================================
  ==== __suppression =========================================================
  ============================================================================
  */

  /*
  http://localhost/functToArray/fta/fta_www/zz_dossiers_action1.php?__id=2&__action=__suppression
  */
 $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
 $o1.=' <form method="post" class="yyformDelete">'.CRLF;
 $o1.='   veuillez confirmer le suppression de  : '.CRLF;
 $o1.='   <br /><br /><b>'.
       '('.$__valeurs['T0.chi_id_dossier'].')  nom : ' .$__valeurs['T0.chp_nom_dossier'].'    <br /> '.
       '</b><br />'.CRLF;
 $o1.='   <input type="hidden" value="'.encrypter($__id).'" name="chi_id_dossier" id="chi_id_dossier" />'.CRLF;
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


  $o1.='<h2>ajouter un dossier</h2>'.CRLF;

  $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.CRLF;

  $chp_nom_dossier =isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_dossier).'" name="chp_nom_dossier" id="chp_nom_dossier" maxlength="64" style="max-width:64em;" />'.CRLF;
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
  $o1.='<h2>modifier un dossier</h2>'.CRLF;

  $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
  $__valeurs['T0.chp_nom_dossier']          =$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier']         ??$__valeurs['T0.chp_nom_dossier']        ;
  $__valeurs['T0.chx_cible_dossier']     =$_SESSION[APP_KEY][NAV][BNF]['chx_cible_dossier']    ??$__valeurs['T0.chx_cible_dossier']   ;
  
  
  
  
  $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
  $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_dossier" id="chi_id_dossier" />'.CRLF;
  

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">id, nom , type , dossier</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_nom_dossier']).'" name="chp_nom_dossier" id="chp_nom_dossier" maxlength="64" style="width:100%;max-width:20em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  


  $o1.='<div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.='</div>'.CRLF;
  
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);
  $chemin_relatif='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T0.chp_nom_dossier'];
  
  if(is_dir($chemin_relatif)){

//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_relatif , true ) . '</pre>' ; exit(0);
     $chemin_reel=realpath($chemin_relatif);
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_reel , true ) . '</pre>' ; exit(0);
     
     
     $chemin_du_repertoire=$chemin_reel.'/';
     $monscan=scandir($chemin_du_repertoire);
     if($monscan!==false){
         $glob=array();
         foreach( $monscan as $k0 => $v0){
          if($v0!=='.' && $v0!=='..'){
          $glob[]=$chemin_du_repertoire.$v0;
          }
         }
         $tabl=array();
         
         $o1.='<div>il y a '.count($glob).' élément(s) dans ce répertoire</div>';
         if(count($glob)<100){
          $liste_des_fichiers='';
          foreach($glob as $k1=>$v1){
           $nom_court_du_fichier=substr(str_replace($chemin_reel,'',$v1),1);
           $tabl[$nom_court_du_fichier]=array(
            'sur_disque' => true,
            'en_base' => 0
           );
           $liste_des_fichiers.=',\''.$nom_court_du_fichier.'\'';
          }
          if($liste_des_fichiers!==''){
           $liste_des_fichiers=substr($liste_des_fichiers,1);
           $sql='
            SELECT `chp_nom_source`  , chi_id_source
            FROM `tbl_sources` `T0`
            WHERE "T0"."chx_cible_id_source" = \''.$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'].'\' 
            AND `chp_nom_source` IN ('.$liste_des_fichiers.')
            AND `chx_dossier_id_source` = '.$__id.'
           ';
//           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' .  $sql  . '</pre>' ; exit(0);
//           echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tabl , true ) . '</pre>' ; exit(0);
           
           $stmt = $db->prepare($sql);
           if($stmt!==false){
             $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
             while($arr=$result->fetchArray(SQLITE3_NUM)){

              $tabl[$arr[0]]['en_base']=$arr[1];
             }
             $stmt->close(); 
             foreach($tabl as $k1 => $v1){
              if($v1['en_base']===0){
               $o1.='<div>';
               $o1.=$k1.' n\'existe pas en base';
               $positionDernierPoint=strrpos($k1,'.');
               if($positionDernierPoint===null){
                $extension='';
               }else{
                $extension=substr($k1,$positionDernierPoint);
               }
//               echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $extension , true ) . '</pre>' ; exit(0);
  
               /*
                les fichiers sqlite  binaire ne sont pas en base
               */
               if($extension==='.db' || $extension==='.exe'){
               }else{
                 $o1.=' <button name="__creer_le_fichier_en_base" value="'.$k1.'">créer '.$k1.' en base</button>';
               }
               $o1.=' <button class="yydanger" name="__effacer_du_disque" value="'.$k1.'">supprimer '.$k1.' ce fichier du disque</button>';
               $o1.='</div>';
              }else{
               $o1.='<div>'.$k1.' existe en base <a class="yyinfo" href="zz_sources_action1.php?__action=__modification&amp;__id='.$v1['en_base'].'">editer</a></div>';
              }
              
             }
           }else{
            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
           }
           
           
           
           
          }
          
         }else{
          if(count($glob)===0){
              $o1.='<div><button name="__supprimer_ce_repertoire_du_disque" value="'.$chemin_relatif.'" >supprimer ce répertoire du disque</button></div>';
          }else{
          }
         }         
         
     }
     
     
     
     if($_SESSION[APP_KEY]['cible_courante']['chp_nom_cible']==='fta' && $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']!=='fta'){

         $o1.='<hr /><div>Liste des éléments de '.'fta'.'</div>';

         $chemin_relatif='../../'.APP_KEY.$__valeurs['T0.chp_nom_dossier'];
//         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_relatif , true ) . '</pre>' ; exit(0);
         
         if(is_dir($chemin_relatif)){

//            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_relatif , true ) . '</pre>' ; exit(0);
            $chemin_reel=realpath($chemin_relatif);
       //     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_reel , true ) . '</pre>' ; exit(0);
            
            
            $glob=array(); /* la fonction glob ne prend pas en compte le fichier .htaccess */
            $chemin_du_repertoire=$chemin_reel.'/';
            $monscan=scandir($chemin_du_repertoire);
            if($monscan!==false){
                foreach( $monscan as $k0 => $v0){
                 if($v0!=='.' && $v0!=='..'){
                 $glob[]=$chemin_du_repertoire.$v0;
                 }
                }
             
                $o1.='<div>il y a '.count($glob).' élément(s) dans le répertoire correspondant de '.'fta'.'</div>';
                if(count($glob)<100){
//                    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $glob , true ) . '</pre>' ; exit(0);
                    foreach($glob as $k1=>$v1){
//                        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $v1 , true ) . '</pre>' ;
                        $nom_fichier=substr(str_replace( $chemin_reel,'',$v1),1);
//                        echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tabl , true ) . '</pre>' ; exit(0);
                        if(isset($tabl[$nom_fichier])){
                         $o1.='<div class="yysucces">le fichier '.$nom_fichier.' a été importé sur disque</div>';
                        }else{
                          $positionDernierPoint=strrpos($nom_fichier,'.');
                          if($positionDernierPoint===null){
                           $extension='';
                          }else{
                           $extension=substr($nom_fichier,$positionDernierPoint);
                          }
                          if(   $extension==='.php' || $extension==='.js' || $extension==='.html' || $extension==='.htm'  || $extension==='.htm'
                             || $extension==='.json' || $extension==='.bat' || $extension==='.rev'  || $extension==='.css'  || $extension==='.sql'  
                             || $extension==='.txt' || $extension==='.db' || $extension==='.htaccess' ){
                            $o1.='<div><button name="__importer_ce_fichier_de_'.'fta'.'" value="'.$chemin_relatif.str_replace( $chemin_reel,'',$v1).'" >importer le fichier '.$nom_fichier.'</button></div>';
                          }else{
                            $o1.='<div class="yyavertissement">'.__LINE__.' le fichier '.$nom_fichier.' ne comporte pas une extension connue</div>';
                          }
                        }
                    }
                }             
            }

         }
         
         
      
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);
      
     }
     
   
  }else{

           $o1.='<div class="yyavertissement">';
           $o1.='ce répertoire n\'existe pas sur le disque';
           $o1.='<button id="__creer_le_repertoire_sur_le_disque" name="__creer_le_repertoire_sur_le_disque" >Créer le répertoire</button>';
           $o1.='<a class="yydanger" href="zz_dossiers_action1.php?__action=__suppression&amp;__id='.$__id.'" title="supprimer de la Bdd">supprimer de la base</a>';
           $o1.='</div>';
  
  }

  
  
  

  $o1.='</form>'.CRLF;

  

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
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';