<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_sources1.php');


define('DONNEES_EN_PLUS',base64_encode('mqlkjemlkiiq'));
$_SESSION[APP_KEY]['sess_complement_id']=base64_encode('sfrhdjgdd');
$_SESSION[APP_KEY]['sess_cle_complementaire']=base64_encode('lmzotmjeqksg,');


function encrypter($data){
 
   $data=DONNEES_EN_PLUS.$data;
   $first_key = base64_decode($_SESSION[APP_KEY]['sess_complement_id']); //FIRSTKEY);
   $second_key = base64_decode($_SESSION[APP_KEY]['sess_cle_complementaire']); // SECONDKEY);    
       
   $method = "aes-256-cbc";    
   $iv_length = openssl_cipher_iv_length($method);
   $iv = openssl_random_pseudo_bytes($iv_length);
           
   $first_encrypted = openssl_encrypt($data,$method,$first_key, OPENSSL_RAW_DATA ,$iv);    
   $second_encrypted = hash_hmac('sha3-512', $first_encrypted, $second_key, TRUE);
               
   $output = base64_encode($iv.$second_encrypted.$first_encrypted);    
   return $output;        
}
function decrypter($input)
{
   $first_key = base64_decode($_SESSION[APP_KEY]['sess_complement_id']); //FIRSTKEY);
   $second_key = base64_decode($_SESSION[APP_KEY]['sess_cle_complementaire']) ; // SECONDKEY);            
   $mix = base64_decode($input);
           
   $method = "aes-256-cbc";    
   $iv_length = openssl_cipher_iv_length($method);
               
   $iv = substr($mix,0,$iv_length);
   $second_encrypted = substr($mix,$iv_length,64);
   $first_encrypted = substr($mix,$iv_length+64);
               
   $data = @openssl_decrypt($first_encrypted,$method,$first_key,OPENSSL_RAW_DATA,$iv);
   $second_encrypted_new = hash_hmac('sha3-512', $first_encrypted, $second_key, TRUE);
       
   if (@hash_equals($second_encrypted,$second_encrypted_new))
   return substr($data,strlen(DONNEES_EN_PLUS));
       
   return false;
}
echo 'DONNEES_EN_PLUS='.DONNEES_EN_PLUS.'<br />';
echo "_SESSION[APP_KEY]['sess_complement_id']=".$_SESSION[APP_KEY]['sess_complement_id'].'<br />';
echo "_SESSION[APP_KEY]['sess_cle_complementaire']=".$_SESSION[APP_KEY]['sess_cle_complementaire'].'<br />';


$encrypte=encrypter('3000000005');
echo '<pre>'.$encrypte.'</pre><br />'; 
$encrypte2='aaaaa0aafaaaaaaaaaba'.substr($encrypte,20);
echo '<pre>'.$encrypte2.'</pre><br />'; 

echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( decrypter($encrypte2) , true ) . ' ' . var_export( decrypter($encrypte) , true ) . '' . var_export( decrypter('2ekqtglkzsre5') , true ) . '</pre>' ; exit(0);

if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible avant d\'accéder aux sources'  );
   recharger_la_page('zz_cibles1.php'); 
}

$js_a_executer_apres_chargement=array();
/*
  ========================================================================================
*/
function boutonRetourALaListe(){
  return '&nbsp;<a href="zz_sources1.php" style="font-size:1rem;">retour à la liste</a>';
}
/*
  ========================================================================================
*/
//========================================================================================================================
function erreur_dans_champs_saisis_sources(){
 
 $uneErreur=false;
 
 if($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']===''){
  /*
  // A=65 , a=97 z=122 , 0=48 , 9=57
  // todo ajouter le test
  */
  $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|'; 
  ajouterMessage('erreur' ,  __LINE__ .' : le nom source doit etre indiqué et ne doit pas contenir les caractères espaces ' , BNF );
  $uneErreur=true;
 }
 
 if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'],0,1)===' '){
  
  ajouterMessage('erreur' ,  __LINE__ .' : le nom source ne doit pas commencer par un espace ' , BNF );
  $uneErreur=true;
  
 }


 if($_SESSION[APP_KEY][NAV][BNF]['chp_type_source']===''){
  /*
  // A=65 , a=97 z=122 , 0=48 , 9=57
  // todo ajouter le test
  */
  $caracteresInterdits='$!&\\:;"\'#%&@()[]{}<>*/+-_=^`|'; 
  ajouterMessage('erreur' ,  __LINE__ .' : le type source doit etre indiqué et ne doit pas contenir les caractères espaces ' , BNF );
  $uneErreur=true;
 }
 
 if(substr($_SESSION[APP_KEY][NAV][BNF]['chp_type_source'],0,1)===' '){
  
  ajouterMessage('erreur' ,  __LINE__ .' : le type source ne doit pas commencer par un espace ' , BNF );
  $uneErreur=true;
  
 }
 
 if($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']===''){
  ajouterMessage('erreur' ,  __LINE__ .' : le dossier doit être indiqué ' , BNF );
  $uneErreur=true;
 }





 return($uneErreur);
}
/*
  ========================================================================================
*/

$db = new SQLite3('../fta_inc/db/system.db');

/*
  ====================================================================================================================
  ====================================================================================================================
  ============================================= POST =================================================================
  ====================================================================================================================
  ====================================================================================================================
*/
if(isset($_POST)&&sizeof($_POST)>=1){

 
 
// echo __LINE__ . '$_POST=<pre>' . var_export($_POST,true) . '</pre>'; exit();
 $_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']          =$_POST['chp_nom_source']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_type_source']         =$_POST['chp_type_source']        ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']   =$_POST['chx_dossier_id_source']  ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']     =$_POST['chx_cible_id_source']    ?? $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'];
 $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']  =$_POST['chp_commentaire_source'] ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']          =$_POST['chp_rev_source']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']       =$_POST['chp_genere_source']      ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chi_id_source']           =$_POST['chi_id_source']          ?? '';
 
 

 /*
   ====================================================================================================================
   ============================================= MODIFICATION =========================================================
   ====================================================================================================================
 */
 if(isset($_POST['__action'])&&$_POST['__action']=='__modification'){
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  if(erreur_dans_champs_saisis_sources()){
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
   if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'])&&is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_source'])){
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);

   }else{
    ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'] );
    recharger_la_page('zz_sources1.php');
   }
  }
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  
  if($_SESSION[APP_KEY][NAV][BNF]['verification'][0]!=$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']){
//   ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_source'] );
//   recharger_la_page('zz_sources1.php');   
  }
  
  $sql='
   UPDATE `tbl_sources` SET 
      `chp_nom_source`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'])        .'\'
    , `chp_type_source`        = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_type_source'])       .'\'
    , `chx_dossier_id_source`  = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']) .'\'
    , `chx_cible_id_source`    = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source'])   .'\'
    , `chp_commentaire_source` = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']).'\'
    , `chp_rev_source`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_rev_source'])        .'\'
    , `chp_genere_source`      = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'])     .'\'
    
    
    WHERE 
      `chi_id_source`          = '.addslashes($_SESSION[APP_KEY][NAV][BNF]['chi_id_source']).'
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
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']); 
    }else{
//     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorCode() , true ) . '</pre>' ; exit(0);
     ajouterMessage('erreur' , __LINE__ .' '. $db->lastErrorMsg() , BNF );
     recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']); 
    }
   
  }else{
//   echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
   error_reporting(E_ALL);
   if($db->changes()===1){
    
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
    ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
    
   }else{
    
    ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_source']);
    
   }
  }

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__confirme_suppression'){

  /*
    ===================================================================================================================
    ============================================= CONFIRMATION DE LA SUPPRESSION ======================================
    ===================================================================================================================
  */

  /*
  http://localhost/functToArray/fta/fta_www/zz_sources_action1.php?__id=2&__action=__suppression
  */
  $__id= isset($_POST['__id1'])?(is_numeric($_POST['__id1'])?$_POST['__id1']:0):0;
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__id , true ) . '</pre>' ; exit(0);

  if($__id!==0){
      $__valeurs=recupere_une_donnees_des_sources($__id,$db);
  }else{
      ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer cet enregistrement ' , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
  }


  $sql='DELETE FROM tbl_sources WHERE `chi_id_source` = \''.addslashes1($__id).'\' ' ;
  if(false === $db->exec($sql)){

      ajouterMessage('erreur' ,  __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

  }else{
   
     ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
     recharger_la_page('zz_sources1.php');

  }

 }else if(isset($_POST['__action'])&&$_POST['__action']=='__creation'){
  
  /*
    ===================================================================================================================
    ============================================= CREATION ============================================================
    ===================================================================================================================
  */
  
  if(erreur_dans_champs_saisis_sources()){
   
      recharger_la_page(BNF.'?__action=__creation');
      
  }
  
  $sql='
   INSERT INTO `tbl_sources` (`chp_nom_source` , `chp_type_source` , chx_dossier_id_source , chx_cible_id_source, `chp_commentaire_source`, `chp_rev_source` , chp_genere_source ) VALUES
     (
        \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'])         .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_type_source'])        .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'])  .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source'])    .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']) .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_rev_source'])         .'\'
      , \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'])      .'\'      
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
 recharger_la_page('zz_sources1.php');


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
  recharger_la_page('zz_sources1.php');
 }else{
  $__valeurs=recupere_une_donnees_des_sources($__id,$db);
  
 }
}  

if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
 if($__id==='0'){
  recharger_la_page('zz_sources1.php');
 }else{
//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( is_numeric($__id) , true ) . '</pre>' ; exit(0);
  $__valeurs=recupere_une_donnees_des_sources($__id,$db);
  
  
  if(!isset($__valeurs['T0_chi_id_source'])){
   recharger_la_page('zz_sources1.php');
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
$o1=html_header1(array('title'=>'sources' , 'description'=>'sources'));
print($o1);$o1='';

$o1.='<h1>gestion de source '.boutonRetourALaListe().'</h1>';



if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){

  /*
  ============================================================================
  ==== __suppression =========================================================
  ============================================================================
  */

  /*
  http://localhost/functToArray/fta/fta_www/zz_sources_action1.php?__id=2&__action=__suppression
  */
 $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
 $o1.=' <form method="post" class="yyformDelete">'.CRLF;
 $o1.='   veuillez confirmer le suppression de  : '.CRLF;
 $o1.='   <br /><br /><b>'.
       '('.$__valeurs['T0_chi_id_source'].')  nom : ' .$__valeurs['T0_chp_nom_source'].'   type : ' .$__valeurs['T0_chp_type_source'].'  <br /> '.
       '</b><br />'.CRLF;
 $o1.='   <input type="hidden" value="'.$__id.'" name="chi_id_source" id="chi_id_source" />'.CRLF;
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


  $o1.='<h2>ajouter un source</h2>'.CRLF;

  $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.CRLF;

  $chp_nom_source =isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_source).'" name="chp_nom_source" id="chp_nom_source" maxlength="64" style="max-width:64em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;


  $chp_type_source =isset($_SESSION[APP_KEY][NAV][BNF]['chp_type_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_type_source']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">type</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_type_source).'" name="chp_type_source" id="chp_type_source" maxlength="8" style="max-width:8em;" />'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;

  $chx_dossier_id_source =isset($_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">dossier</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <input type="text" value="'.enti1($chx_dossier_id_source).'" name="chx_dossier_id_source" id="chx_dossier_id_source" style="max-width:9em;" />'.CRLF;
  $o1.='   <a href="javascript:afficherModale1(\'zz_dossiers_choix1.php?__nom_champ_dans_parent=chx_dossier_id_source\')">selectionner</a>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $chp_rev_source =isset($_SESSION[APP_KEY][NAV][BNF]['chp_rev_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">rev</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_rev_source" id="chp_rev_source"  rows="15" >'.htmlentities($chp_rev_source,ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;


  $chp_genere_source =isset($_SESSION[APP_KEY][NAV][BNF]['chp_genere_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">généré</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_genere_source" id="chp_genere_source"  rows="15" >'.htmlentities($chp_genere_source,ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;





  $chp_commentaire_source =isset($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source']:'';
  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_source" id="chp_commentaire_source"  rows="15" >'.htmlentities($chp_commentaire_source,ENT_COMPAT).'</textarea>'.CRLF;
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
  $o1.='<h2>modifier un source</h2>'.CRLF;

  $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
  $__valeurs['T0_chp_nom_source']          =$_SESSION[APP_KEY][NAV][BNF]['chp_nom_source']         ??$__valeurs['T0_chp_nom_source']        ;
  $__valeurs['T0_chp_type_source']         =$_SESSION[APP_KEY][NAV][BNF]['chp_type_source']        ??$__valeurs['T0_chp_type_source']       ;
  $__valeurs['T0_chx_dossier_id_source']   =$_SESSION[APP_KEY][NAV][BNF]['chx_dossier_id_source']  ??$__valeurs['T0_chx_dossier_id_source'] ;
  $__valeurs['t0_chx_cible_id_source']     =$_SESSION[APP_KEY][NAV][BNF]['chx_cible_id_source']    ??$__valeurs['T0_chx_cible_id_source']   ;
  $__valeurs['T0_chp_commentaire_source']  =$_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_source'] ??$__valeurs['T0_chp_commentaire_source'];
  $__valeurs['T0_chp_rev_source']          =$_SESSION[APP_KEY][NAV][BNF]['chp_rev_source']         ??$__valeurs['T0_chp_rev_source'];
  $__valeurs['T0_chp_genere_source']       =$_SESSION[APP_KEY][NAV][BNF]['chp_genere_source']      ??$__valeurs['T0_chp_genere_source'];
  
  
  
  
  $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
  $o1.=' <input type="hidden" value="'.$__id.'" name="chi_id_source" id="chi_id_source" />'.CRLF;
  

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">id, nom , type , dossier</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <span>'.$__id.'</span>'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0_chp_nom_source']).'" name="chp_nom_source" id="chp_nom_source" maxlength="64" style="width:100%;max-width:20em;" />'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0_chp_type_source']).'" name="chp_type_source" id="chp_type_source" maxlength="8" style="width:100%;max-width:8em;" />'.CRLF;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0_chx_dossier_id_source']).'" name="chx_dossier_id_source" id="chx_dossier_id_source" style="max-width:8em;"/>'.CRLF;
  $o1.='   <a href="javascript:afficherModale1(\'zz_dossiers_choix1.php?__nom_champ_dans_parent=chx_dossier_id_source\')">selectionner</a>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;
  
   
  
   

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">rev</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_rev_source" id="chp_rev_source"  rows="15" spellcheck="false" >'.htmlentities($__valeurs['T0_chp_rev_source'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;


  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">outils</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <a href="javascript:convertir_rev_en_html(\'chp_rev_source\',\'chp_genere_source\')">rev2HTML</a>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">genere</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_genere_source" id="chp_genere_source"  rows="15" spellcheck="false" >'.htmlentities($__valeurs['T0_chp_genere_source'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;





  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1">'.CRLF;
  $o1.='   <div style="word-break:break-word;">commentaire</div>'.CRLF;
  $o1.='   <div style="font-weight: normal;">texte libre</div>'.CRLF;
  $o1.='  </div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_source" id="chp_commentaire_source"  rows="5" >'.htmlentities($__valeurs['T0_chp_commentaire_source'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.='<div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.='</div>'.CRLF;

  $o1.='</form>'.CRLF;
  
  $js_a_executer_apres_chargement[]=array(
       'nomDeLaFonctionAappeler' => 'initialiserEditeurPourUneTextArea' , 'parametre' => 'chp_rev_source'
  );


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
$par=array('js_a_inclure'=>array('js/javascript','js/html' , 'js/pour_zz_source1.js'),'js_a_executer_apres_chargement'=>$js_a_executer_apres_chargement);
$o1.=html_footer1($par);
print($o1);$o1='';