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
          `chp_commentaire_cible` = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']).'\'
        WHERE 
          `chi_id_cible`          = \''.addslashes($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']).'\'
      ';
  }else{
      $sql='
       UPDATE `tbl_cibles` SET 
          `chp_nom_cible`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'])        .'\'
        , `chp_dossier_cible`     = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'])    .'\'
        , `chp_commentaire_cible` = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']).'\'
        WHERE 
          `chi_id_cible`          = \''.addslashes($_SESSION[APP_KEY][NAV][BNF]['chi_id_cible']).'\'
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
  
  if(is_dir($dossier)){
    ajouterMessage('erreur' ,  __LINE__ .' le dossier existe , on ne peut pas supprimer cet enregistrement' , BNF );
    recharger_la_page('zz_cibles1.php');
  }

  $sql='DELETE FROM tbl_cibles WHERE `chi_id_cible` = \''.addslashes1($__id).'\' ' ;
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
        \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'])         .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_dossier_cible'])     .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']) .'\'
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
   if(isset($_SESSION[APP_KEY][NAV][BNF])){
    unset($_SESSION[APP_KEY][NAV][BNF]);
   }
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
  ajouterMessage('erreur' , __LINE__ .' on ne peut pas supprimer la cible 1'  );
  recharger_la_page('zz_cibles1.php');

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
  
  

  
  

  $dossier='../../'.$__valeurs['T0.chp_dossier_cible'];
  
  if(is_dir($dossier)){
   $o1.='le dossier existe '.CRLF;
   
   if(le_dossier_est_vide($dossier)){
    
    $o1.='<br />le dossier '.$dossier.' est vide'.CRLF;
    $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;
    $o1.=' <input type="hidden" value="__suppression_du_dossier" name="__action" id="__action" />'.CRLF;
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
     'nomDeLaFonctionAappeler' => 'neRienFaire' , 'parametre' => array( 'c\est pour' , 'l\'exemple' )
    )
);
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';