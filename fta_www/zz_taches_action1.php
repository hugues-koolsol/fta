<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_taches1.php');



$js_a_executer_apres_chargement=array();
/*
  ========================================================================================
*/
function boutonRetourALaListe(){
  return '&nbsp;<a href="zz_taches1.php" style="font-size:1rem;">retour à la liste</a>';
}
/*
  ========================================================================================
*/
//========================================================================================================================
function erreur_dans_champs_saisis_taches(){
 
 $uneErreur=false;
 
 if($_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache']===''){
  /*
  // A=65 , a=97 z=122 , 0=48 , 9=57
  // todo ajouter le test
  */
  $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|'; 
  ajouterMessage('erreur' ,  __LINE__ .' : le texte de la tâche ' , BNF );
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

 $_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache']         =$_POST['chp_texte_tache']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache']      =$_POST['chp_priorite_tache']      ?? '';
 
 $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']           =isset($_POST['chi_id_tache'])?decrypter($_POST['chi_id_tache']) : '';
 
 
 
 
 if(isset($_POST['__action'])&&$_POST['__action']=='__modification'){

  /*
    ====================================================================================================================
    ============================================= MODIFICATION =========================================================
    ====================================================================================================================
  */

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  if(erreur_dans_champs_saisis_taches()){
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
   if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_tache'])&&is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_tache'])){
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);

   }else{
    ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache'] );
    recharger_la_page('zz_taches1.php');
   }
  }
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  
  if($_SESSION[APP_KEY][NAV][BNF]['verification'][0]!=$_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']){
//   ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_tache'] );
//   recharger_la_page('zz_taches1.php');   
  }
  
  $sql='
   UPDATE `tbl_taches` SET 
      `chp_texte_tache`         = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache'])        .'\'
    , `chp_priorite_tache`      = \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache'])        .'\'
      
    
    WHERE 
      `chi_id_tache`          = '.sq0($_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']).'
  '; // 
//  echo $sql;

  error_reporting(0);
  if(false === $db->exec($sql)){
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);
    error_reporting(E_ALL);
    if($db->lastErrorCode()===19){
     ajouterMessage('erreur' , __LINE__ .' ce nom existe déjà en bdd ' , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']); 
    }else{
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorCode() , true ) . '</pre>' ; exit(0);
     ajouterMessage('erreur' , __LINE__ .' '. $db->lastErrorMsg() , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']); 
    }
   
  }else{
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
   error_reporting(E_ALL);
   if($db->changes()===1){
    
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
    ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);
    
   }else{
    
    ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_tache']);
    
   }
  }

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__confirme_suppression'){

  /*
    ===================================================================================================================
    ============================================= CONFIRMATION DE LA SUPPRESSION ======================================
    ===================================================================================================================
  */
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);

  $__id= isset($_POST['chi_id_tache'])?decrypter($_POST['chi_id_tache']):0;

  if($__id!==false){
   
     $__valeurs=recupere_une_donnees_des_taches($__id,$db);

     $db->querySingle('PRAGMA foreign_keys=ON');
     $sql='DELETE FROM tbl_taches WHERE `chi_id_tache` = \''.sq0($__id).'\' ' ;
     if(false === $db->exec($sql)){

         ajouterMessage('erreur' ,  __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
         recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

     }else{
      
        ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
        recharger_la_page('zz_taches1.php');

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
  
  if(erreur_dans_champs_saisis_taches()){
   
      recharger_la_page(BNF.'?__action=__creation');
      
  }
  
  $sql='
   INSERT INTO `tbl_taches` (`chp_texte_tache` , chp_priorite_tache , chx_utilisateur_tache  ) VALUES
     (
        \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache'])        .'\'
      , \''.sq0($_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache'])     .'\'
      , \''.sq0($_SESSION[APP_KEY]['sess_id_utilisateur_init'])         .'\'
        
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
 recharger_la_page('zz_taches1.php');


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
  recharger_la_page('zz_taches1.php');
 }else{
  $__valeurs=recupere_une_donnees_des_taches($__id,$db);
  
 }
}  

if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
 if($__id==='0'){
  recharger_la_page('zz_taches1.php');
 }else{
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( is_numeric($__id) , true ) . '</pre>' ; exit(0);
  $__valeurs=recupere_une_donnees_des_taches($__id,$db);
  
  // echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs , true ) . '</pre>' ; exit(0);
  
  
  
  if(!isset($__valeurs['T0.chi_id_tache'])){
   recharger_la_page('zz_taches1.php');
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
$o1=html_header1(array('title'=>'taches' , 'description'=>'taches'));
print($o1);$o1='';

$o1.='<h1>gestion de tache '.boutonRetourALaListe().'</h1>';



if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){

  /*
  ============================================================================
  ==== __suppression =========================================================
  ============================================================================
  */

 $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
 $o1.=' <form method="post" class="yyformDelete">'.CRLF;
 $o1.='   veuillez confirmer le suppression de  : '.CRLF;
 $o1.='   <br /><br /><b>'.
       '('.$__valeurs['T0.chi_id_tache'].')  nom : ' .$__valeurs['T0.chp_texte_tache'].'    <br /> '.
       '</b><br />'.CRLF;
 $o1.='   <input type="hidden" value="'.encrypter($__id).'" name="chi_id_tache" id="chi_id_tache" />'.CRLF;
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


  $o1.='<h2>ajouter une tâche</h2>'.CRLF;

  $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.CRLF;

  $chp_texte_tache =isset($_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea rows="20"  cols="20" autofocus="autofocus" name="chp_texte_tache" id="chp_texte_tache">'.enti1($chp_texte_tache).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;

  $chp_priorite_tache =isset($_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">priorité</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_priorite_tache).'" name="chp_priorite_tache" id="chp_priorite_tache" maxlength="4" style="max-width:4em;" />'.CRLF;
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
  $o1.='<h2>modifier une tâche</h2>'.CRLF;

  $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
  $__valeurs['T0.chp_texte_tache']          =$_SESSION[APP_KEY][NAV][BNF]['chp_texte_tache']         ??$__valeurs['T0.chp_texte_tache']        ;
  $__valeurs['T0.chp_priorite_tache']       =$_SESSION[APP_KEY][NAV][BNF]['chp_priorite_tache']      ??$__valeurs['T0.chp_priorite_tache']     ;
  
  
  
  
  
  $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
  $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_tache" id="chi_id_tache" />'.CRLF;
  

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">id, priorité</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_priorite_tache']).'" name="chp_priorite_tache" id="chp_priorite_tache" maxlength="4" style="width:100%;max-width:4em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">tâche</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='   <textarea rows="20"  cols="20" name="chp_texte_tache" id="chp_texte_tache" style="width:80%;max-width:80%;" >'.enti1($__valeurs['T0.chp_texte_tache']).'</textarea>'.CRLF;
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
$par=array('js_a_inclure'=>array(''),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';