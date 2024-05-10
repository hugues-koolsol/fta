<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
session_start();
require_once('../fta_inc/db/acces_bdd_bases_de_donnees1.php');

//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);
if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible '  );
   recharger_la_page('zz_cibles1.php'); 
}
/*
  ========================================================================================
*/
function signaler_erreur($tab){
 
 if(isset($tab['provenance']) && $tab['provenance']!==''){
  ajouterMessage('erreur' ,  $tab['message'] , $tab['provenance']  );
 }else{
  ajouterMessage('erreur' ,  $tab['message']   );
 }

 return $tab;
 
}
/*
  ========================================================================================
*/
function obtenir_tableau_sqlite_de_la_table($nom_de_la_table , $db){
 
    $t='';
    
    $auto_increment=false;
    $sql='SELECT * FROM sqlite_sequence WHERE name = \''.$nom_de_la_table.'\'';
    $stmt = $db->prepare($sql); 
    if($stmt!==false){
        $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
        while($arr=$result->fetchArray(SQLITE3_NUM)){
            $auto_increment=true;
        }
        $stmt->close(); 
    }


    $liste_des_champs=array();
    $sql= 'PRAGMA table_info(\''.$nom_de_la_table.'\'  ) ';
    $stmt = $db->prepare($sql); 
    if($stmt!==false){
        $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
        while($arr=$result->fetchArray(SQLITE3_NUM)){
            $liste_des_champs[$arr[1]]=array( // cid	name	type	notnull	dflt_value	pk
                'cid'             => $arr[0],	
                'name'	           => $arr[1],	
                'type'            => $arr[2],	
                'notnull'  	      => $arr[3],	
                'dflt_value'      => $arr[4],		
                'pk'              => $arr[5],	
                'auto_increment'  => false,	
                'cle_etrangere'   => array(),	
            );
            if($arr[2]==='INTEGER' && $arr[5]===1 && $auto_increment===true){
                $liste_des_champs[$arr[1]]['auto_increment']=true;
            }
        }
        $stmt->close(); 
    }else{
      return signaler_erreur( array('status'=>true,'message'=> __LINE__ . ' erreur sur la liste des champs de la table '.$nom_de_la_table.'  ' ,  'provenance' => BNF) );
    }

    $liste_des_cles_etrangeres=array();

    $sql= 'PRAGMA foreign_key_list(\''.$nom_de_la_table.'\') ';
    $stmt = $db->prepare($sql); 
    if($stmt!==false){
        $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
        while($arr=$result->fetchArray(SQLITE3_NUM)){
            $liste_des_champs[$arr[3]]['cle_etrangere']=array(
                'cid'        => $arr[0],	
                'seq'	       => $arr[1],	
                'table'      => $arr[2],	
                'from'  	    => $arr[3],	
                'to'         => $arr[4],		
                'on_update'  => $arr[5]??null,	
                'on_delete'  => $arr[6]??null,	
                'match'      => $arr[7]??null,	
            );
        }
        $stmt->close(); 
    }else{
      return signaler_erreur( array('status'=>true,'message'=> __LINE__ . ' erreur sur la liste des clés étrangères de la table '.$nom_de_la_table.' ' ,  'provenance' => BNF) );
    }

    
    $liste_des_indexes=array();

    $sql= 'PRAGMA index_list(\''.$nom_de_la_table.'\') ';
    $stmt = $db->prepare($sql); 
    if($stmt!==false){
        $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
        while($arr=$result->fetchArray(SQLITE3_NUM)){
            $liste_des_indexes[$arr[1]]=array( // seq	name	unique	origin	partial	on_update	on_delete	match
                'seq'	       => $arr[0],	
                'name'       => $arr[1],	
                'unique'  	  => $arr[2],	
                'origin'     => $arr[3],		
                'partial'    => $arr[4],	
                'on_update'  => $arr[5]??null,	
                'on_delete'  => $arr[6]??null,	
                'match'      => $arr[7]??null,	
                'champs'     => array(),
            );
            
            $sql1= 'PRAGMA index_info(\''.$arr[1].'\') ';
            $stmt1 = $db->prepare($sql1); 
            if($stmt1!==false){
                $result1 = $stmt1->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
                while($arr1=$result1->fetchArray(SQLITE3_NUM)){
                    $liste_des_indexes[$arr[1]]['champs'][$arr1[2]]=array( // seqno	cid	name	origin	partial	on_update	on_delete	match
                        'seqno'      => $arr1[0],	
                        'cid'        => $arr1[1],	
                        'name'       => $arr1[2],	
                    );
                }
                $stmt1->close(); 
            }else{
              return signaler_erreur( array('status'=>true,'message'=> __LINE__ . ' erreur sur la liste des indexes de la table '.$nom_de_la_table.' ' ,  'provenance' => BNF) );
            }
            
            
            
        }
        $stmt->close(); 
    }else{
      return signaler_erreur( array('status'=>true,'message'=> __LINE__ . ' erreur sur la liste des indexes de la table '.$nom_de_la_table.' ' ,  'provenance' => BNF) );
    }

   
    $tableau=array(
     'liste_des_champs'             => $liste_des_champs             ,
     'liste_des_indexes'            => $liste_des_indexes            ,
    );

    return array('status'=>true,'value'=>$tableau);
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
     $tableauDesTables=array();   

     if( is_file($chemin_fichier)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false  ){

         $db1 = new SQLite3($chemin_fichier);
//         ajouterMessage('info' , ' le fichier sqlite a pu être ouvert' , BNF );
         
         
         $sql='SELECT tbl_name FROM sqlite_master WHERE  name NOT LIKE \'sqlite_%\' AND type == \'table\'';
         $listeDesTables=array();
         $stmt = $db1->prepare($sql);
         
         if($stmt!==false){
           $t='';
           $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
           while($arr=$result->fetchArray(SQLITE3_NUM)){

            
               $obj=obtenir_tableau_sqlite_de_la_table($arr[0] , $db1 );
               if($obj['status']===true){
                $tableauDesTables[$arr[0]]=$obj['value'];
               }else{
                 ajouterMessage('erreur' , ' erreur sur la table "'.$arr[0].'"' , BNF  );
               }
            
           }
           $stmt->close(); 
           
           
         }else{
          
             ajouterMessage('erreur' , __LINE__ .' erreur sql ' , BNF );
          
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