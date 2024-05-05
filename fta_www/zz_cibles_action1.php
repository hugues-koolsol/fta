<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();

/*
  ========================================================================================
*/
function boutonRetourALaListe(){
  return '&nbsp;<a href="zz_cibles.php" style="font-size:1rem;">retour à la liste</a>';
}
/*
  ========================================================================================
*/
function recupere_une_donnees_des_cibles($id,$db){
 
 $data0=array();
 $sql='
  SELECT `chi_id_cible` , `chp_nom_cible` , `chp_commentaire_cible`
  FROM `tbl_cibles` T0
  WHERE `T0`.`chi_id_cible`=\''.addslashes1($id).'\'
 ';


 $stmt = $db->prepare($sql);
 if($stmt!==false){
   $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
   while($arr=$result->fetchArray(SQLITE3_NUM))
   {
    $data0=array(
     'T0_chi_id_cible'          => $arr[0],
     'T0_chp_nom_cible'         => $arr[1],
     'T0_chp_commentaire_cible' => $arr[2],
    );
   }
   $stmt->close(); 
 }else{
  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
 }
 
 return $data0;
}
/*
  ========================================================================================
*/
//========================================================================================================================
function erreur_dans_champs_saisis_cibles(){
 $uneErreur=false;
 if($_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']==='1'){
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
 $_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible']          =$_POST['chp_nom_cible']         ?? '';
 $_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']  =$_POST['chp_commentaire_cible'] ?? '';

 /*
   ====================================================================================================================
   ============================================= MODIFICATION =========================================================
   ====================================================================================================================
 */
 if(isset($_POST['__action'])&&$_POST['__action']=='__modification'){
  if(erreur_dans_champs_saisis_cibles()){
   if(isset($_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible'])&&is_numeric($_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible'])){
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']);

   }else{
    ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible'] );
    recharger_la_page('zz_cibles.php');
   }
  }
  
  if($_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']==='1'){
      $sql='
       UPDATE `tbl_cibles` SET 
          `chp_commentaire_cible` = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']).'\'
        WHERE 
          `chi_id_cible`          = \''.addslashes($_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']).'\'
      ';
  }else{
      $sql='
       UPDATE `tbl_cibles` SET 
          `chp_nom_cible`         = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'])        .'\'
        , `chp_commentaire_cible` = \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_commentaire_cible']).'\'
        WHERE 
          `chi_id_cible`          = \''.addslashes($_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']).'\'
      ';
  }

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $sql , true ) . '</pre>' ; exit(0);

  if(false === $db->exec($sql)){
    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( __LINE__ , true ) . '</pre>' ; exit(0);
    ajouterMessage('erreur' , __LINE__ .' '. $db->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']); 
   
  }else{
   if($db->changes()===1){
    
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->changes() , true ) . '</pre>' ; exit(0);
    ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );

    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']);
    
   }else{
    
    ajouterMessage('erreur' , __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
    recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']);
    
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
  if($__id==='1'){
      ajouterMessage('erreur' ,  __LINE__ .' on ne peut pas supprimer cet enregistrement ' , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
  }
  

  $sql='DELETE FROM tbl_cibles WHERE `chi_id_cible` = \''.addslashes1($__id).'\' ' ;
  if(false === $db->exec($sql)){

      ajouterMessage('erreur' ,  __LINE__ .' : ' . $db->lastErrorMsg() , BNF );
      recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

  }else{
   
     ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
     recharger_la_page('zz_cibles.php');

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
   INSERT INTO `tbl_cibles` (`chp_nom_cible` , `chp_commentaire_cible` ) VALUES
     (
        \''.addslashes1($_SESSION[APP_KEY][NAV][BNF]['chp_nom_cible'])         .'\'
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
 
 }
 /*
 on ne devrait pas arriver là car on a normalement capturé tous les cas
 */

 ajouterMessage('info' , __LINE__ .' cas à étudier ' . substr($GLOBALS['__date'],11) , BNF );
 recharger_la_page('zz_cibles.php');


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
  recharger_la_page('zz_cibles.php');

 }else{
  /*
  http://localhost/functToArray/fta/fta_www/zz_cibles_action1.php?__id=1&__action=__suppression
  */
  $__valeurs=recupere_une_donnees_des_cibles($__id,$db);

  if($__valeurs['T0_chi_id_cible']===1){
   ajouterMessage('erreur' , __LINE__ .' on ne peut pas supprimer la cible 1'  );
   recharger_la_page('zz_cibles.php');
  }
 }
}  

if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){
 $__id= isset($_GET['__id'])?(is_numeric($_GET['__id'])?$_GET['__id']:0):0;
 if($__id==='0'){
  recharger_la_page('zz_cibles.php');
 }else{
  $__valeurs=recupere_une_donnees_des_cibles($__id,$db);
  if(!isset($__valeurs['T0_chi_id_cible'])){
   recharger_la_page('zz_cibles.php');
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
 $o1.='   veuillez confirmer le suppression de  : '.CRLF;
 $o1.='   <br /><br /><b>'.
       '('.$__valeurs['T0_chi_id_cible'].') : ' .$__valeurs['T0_chp_nom_cible'].' <br /> '.
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


  $o1.='<h2>modifier une cible</h2>'.CRLF;

  $_SESSION[APP_KEY][NAV][BNF]['T0_chi_id_cible']=$__id;
  $__valeurs['T0_chp_nom_cible']          =$_SESSION[APP_KEY][NAV][BNF]['T0_chp_nom_cible']??$__valeurs['T0_chp_nom_cible'];
  $__valeurs['T0_chp_commentaire_cible']  =$_SESSION[APP_KEY][NAV][BNF]['T0_chp_commentaire_cible']??$__valeurs['T0_chp_commentaire_cible'];
  
  $o1.='<form method="post" enctype="multipart/form-data">'.CRLF;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.CRLF;
  if($__id!='1'){
   $o1.=' <div class="yyfdiv1">'.CRLF;
   $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.CRLF;
   $o1.='  <div class="yyfinp1"><div>'.CRLF;
   $o1.='   <input  type="text" value="'.enti1($__valeurs['T0_chp_nom_cible']).'" name="chp_nom_cible" id="chp_nom_cible" maxlength="3" style="width:100%;max-width:3em;" />'.CRLF;
   $o1.='  </div></div>'.CRLF;
   $o1.=' </div>'.CRLF;
  }

  $o1.=' <div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">commentaire</div></div>'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <textarea  name="chp_commentaire_cible" id="chp_commentaire_cible"  rows="15" >'.htmlentities($__valeurs['T0_chp_commentaire_cible'],ENT_COMPAT).'</textarea>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.=' </div>'.CRLF;



  $o1.='<div class="yyfdiv1">'.CRLF;
  $o1.='  <div class="yyfinp1"><div>'.CRLF;
  $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.CRLF;
  $o1.='  </div></div>'.CRLF;
  $o1.='</div>'.CRLF;


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