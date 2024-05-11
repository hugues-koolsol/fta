<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_bases_de_donnees1.php');
require_once('../fta_inc/phplib/sqlite.php');

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);
if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles1.php'); 
}

/*
  ========================================================================================
*/
function boutonRetourALaListe(){
  return '&nbsp;<a href="zz_bdds1.php" style="font-size:1rem;">retour à la liste</a>';
}
/*
  ========================================================================================
*/
//========================================================================================================================
function erreur_dans_champs_saisis_basesdd(){
 $uneErreur=false;
 if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']===''){
  /*
  // A=65 , a=97 z=122 , 0=48 , 9=57
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

 if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']==='' || $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']===false ){
  ajouterMessage('erreur' ,  __LINE__ .' : le dossier doit être indiqué ' , BNF );
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
 $_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd']          =$_POST['chp_nom_basedd']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']  =$_POST['chp_commentaire_basedd'] ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']          =$_POST['chp_rev_basedd']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_php_basedd']          =$_POST['chp_php_basedd']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']       =$_POST['chp_genere_basedd']      ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']           =isset($_POST['chi_id_basedd'])?decrypter($_POST['chi_id_basedd']) : '';
 $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']   =isset($_POST['chx_dossier_id_basedd'])?decrypter($_POST['chx_dossier_id_basedd']) : '';
 $_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_basedd']     =$_SESSION[APP_KEY]['cible_courante']['chi_id_cible'];
 



 if( isset($_POST['___produire_le_rev']) ){
  
     $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents( $_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd'] , $db );
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre><pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
     
     $chemin_fichier='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];
      
   //   $o1.='&nbsp <span>Ce '.$chemin_fichier.'</span>';  

     if( is_file($chemin_fichier)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false  ){

         $ret=obtenir_la_structure_de_la_base_sqlite_grace_au_fichier($chemin_fichier);
         if($ret['status']===true){
          $tableauDesTables=$ret['value'];
         }else{
           ajouterMessage('erreur' , ' erreur sur la structure de la base "'.$__valeurs['T0.chp_nom_basedd'].'"' , BNF  );
          
         }
       
     }else{

             ajouterMessage('erreur' , __LINE__ .' fichier de la base de donnée sqlite introuvable ' , BNF );

     }
     $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']=$tableauDesTables;
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'] , true ) . '</pre>' ; exit(0);
    
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
    recharger_la_page('zz_bdds1.php');
   }
  }
  
      $sql='
       UPDATE `tbl_bases_de_donnees` SET 
          `chp_nom_basedd`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'])         .'\'
        , `chp_commentaire_basedd` = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']) .'\'
        , `chp_rev_basedd`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd'])         .'\'
        , `chp_php_basedd`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_php_basedd'])         .'\'
        , `chp_genere_basedd`      = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd'])      .'\'
        , `chx_dossier_id_basedd`  = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'])  .'\'
        , `chx_cible_id_basedd`    = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_basedd'])    .'\'
        WHERE 
          `chi_id_basedd`          = \''.addslashes($_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']).'\'
      ';

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
  error_reporting(0);
  if(false === $db->exec($sql)){
    error_reporting(E_ALL);
    if($db->lastErrorCode()===19){
     ajouterMessage('erreur' , __LINE__ .' ce nom existe déjà en bdd ' , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']); 
    }else{
     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorCode() , true ) . '</pre>' ; exit(0);
     ajouterMessage('erreur' , __LINE__ .' '. $db->lastErrorMsg() , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']); 
    }
   
  }else{
   error_reporting(E_ALL);
   if($db->changes()===1){
    
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
    ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_basedd']);
    
   }else{
    
    ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
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
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);

  if($__id!==0){
      $__valeurs=recupere_une_donnees_des_bases_de_donnees($__id,$db);
  }else{
      ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer cet enregistrement ' , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
  }

  
  $sql='DELETE FROM tbl_bases_de_donnees WHERE `chi_id_basedd` = \''.addslashes1($__id).'\' ' ;
  if(false === $db->exec($sql)){

      ajouterMessage('erreur' ,  __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

  }else{
   
     ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
     recharger_la_page('zz_bdds1.php');

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
    
    $sql='
     INSERT INTO `tbl_bases_de_donnees` (`chp_nom_basedd` , `chp_commentaire_basedd` , chp_rev_basedd , chp_genere_basedd , chx_dossier_id_basedd , chx_cible_id_basedd , chp_php_basedd ) VALUES
       (
          \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_basedd'])         .'\'
        , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']) .'\'
        , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd'])         .'\'
        , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd'])      .'\'
        , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'])  .'\'
        , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_basedd'])    .'\'
        , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_php_basedd'])         .'\'
        
       )
    ' ;
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
    if(false === $db->exec($sql)){ // 
     
        ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
        recharger_la_page(BNF.'?__action=__creation'); 
      
    }else{
     
      ajouterMessage('info' , __LINE__ .' : l\'enregistrement ('.$db->lastInsertRowID().') a bien été créé' , BNF );
      recharger_la_page(BNF.'?__action=__modification&__id='.$db->lastInsertRowID()); 
     
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
       $__valeurs=recupere_une_donnees_des_bases_de_donnees($__id,$db);
    
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
 recharger_la_page('zz_bdds1.php');


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
  recharger_la_page('zz_bdds1.php');

 }else{

  $__valeurs=recupere_une_donnees_des_bases_de_donnees($__id,$db);

 }
}  

if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);
 if($__id==='0'){
  recharger_la_page('zz_bdds1.php');
 }else{
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( is_numeric($__id) , true ) . '</pre>' ; exit(0);
  $__valeurs=recupere_une_donnees_des_bases_de_donnees_avec_parents($__id,$db);
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
  
  if(!isset($__valeurs['T0.chi_id_basedd'])){
   recharger_la_page('zz_bdds1.php');
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

$o1.='<h1>gestion de base de donnée ( dossier '.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].') '.boutonRetourALaListe().'</h1>';



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
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_basedd).'" name="chp_nom_basedd" id="chp_nom_basedd" maxlength="3" style="max-width:3em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;

  $chx_dossier_id_basedd =isset($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd'] )?$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" value="'.encrypter($chx_dossier_id_basedd).'" name="chx_dossier_id_basedd" id="chx_dossier_id_basedd" style="max-width:9em;" />'.CRLF;
  $o1.='   <a href="javascript:afficherModale1(\'zz_dossiers_choix1.php?__nom_champ_dans_parent=chx_dossier_id_basedd\')">selectionner</a>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $chp_commentaire_basedd =isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_basedd']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_basedd" id="chp_commentaire_basedd"  rows="15" >'.htmlentities($chp_commentaire_basedd,ENT_COMPAT).'</textarea>'.CRLF;
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
  $__valeurs['T0.chp_rev_basedd']          =$_SESSION[APP_KEY][NAV][BNF]['chp_rev_basedd']         ??$__valeurs['T0.chp_rev_basedd'];
  $__valeurs['T0.chp_php_basedd']          =$_SESSION[APP_KEY][NAV][BNF]['chp_php_basedd']         ??$__valeurs['T0.chp_php_basedd'];
  $__valeurs['T0.chp_genere_basedd']       =$_SESSION[APP_KEY][NAV][BNF]['chp_genere_basedd']      ??$__valeurs['T0.chp_genere_basedd'];
  $__valeurs['T0.chx_dossier_id_basedd']   =$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_basedd']  ??$__valeurs['T0.chx_dossier_id_basedd'] ;
  
  
  $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
  $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_basedd" id="chi_id_basedd" />'.CRLF;
  



  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">id</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">nom</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_nom_basedd']).'" name="chp_nom_basedd" id="chp_nom_basedd" maxlength="32" style="width:100%;max-width:32em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
   
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">dossier</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='   <input  type="text" value="'.encrypter($__valeurs['T0.chx_dossier_id_basedd']).'" name="chx_dossier_id_basedd" id="chx_dossier_id_basedd" style="max-width:3em;"/>'.CRLF;
  $o1.='   <a href="javascript:afficherModale1(\'zz_dossiers_choix1.php?__nom_champ_dans_parent=chx_dossier_id_basedd\')" title="selectionner">☝</a>'.CRLF;
  
  if($__valeurs['T0.chx_dossier_id_basedd']!==null){
   
   $o1.='&nbsp <span id="chp_nom_dossier">'.$__valeurs['T1.chp_nom_dossier'].'</span>';
   $chemin_fichier='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];
   
//   $o1.='&nbsp <span>Ce '.$chemin_fichier.'</span>';    

   if(is_file($chemin_fichier)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false  ){
    
    $o1.='&nbsp <button name="___produire_le_rev" >produire le rev</button>';    
    
   }
   
  }
  
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  
   

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">outils sur rev</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a href="javascript:parentheses(&quot;chp_rev_basedd&quot;);" title="repérer la parenthèse ouvrante ou fermante correspondante">(|.|)</a>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">rev</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">format rev</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_rev_basedd" id="chp_rev_basedd"  rows="15" >'.htmlentities($__valeurs['T0.chp_rev_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.=' <div class="yyfdiv1">'.CRLF; // pshjc
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">outils</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a class="yyinfo" href="javascript:convertir_rev_en_sql(\'chp_rev_basedd\',\'chp_genere_basedd\' ,  \'chp_php_basedd\')">R2S&#8615;</a>'.CRLF;
  $o1.='   '.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;


  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">généré</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">format sql</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_genere_basedd" id="chp_genere_basedd"  rows="15" >'.htmlentities($__valeurs['T0.chp_genere_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">php</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">format php</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_php_basedd" id="chp_php_basedd"  rows="15" >'.htmlentities($__valeurs['T0.chp_php_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;




  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">commentaire</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">texte libre</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_basedd" id="chp_commentaire_basedd"  rows="5" >'.htmlentities($__valeurs['T0.chp_commentaire_basedd'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;





  $o1.='<div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.='</div>'.CRLF;

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

$js_a_executer_apres_chargement=array(
    array(
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\est pour' , 'l\'exemple' )
    )
);

if(isset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']) && count($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'])>0){
// echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'] , true ) . '</pre>' ; 
 
 $js_a_executer_apres_chargement[]=array(
   'nomDeLaFonctionAappeler' => 'traite_le_tableau_de_la_base_sqlite' , 'parametre' => array( 'donnees' => $_SESSION[APP_KEY][NAV][BNF]['tableauDesTables'] , 'zone_rev' => 'chp_rev_basedd'  )
 
 );
 unset($_SESSION[APP_KEY][NAV][BNF]['tableauDesTables']);
}


$par=array('js_a_inclure'=>array('js/pour_zz_bdds_action1.js','js/sql.js'),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';