<?php
define('BNF',basename(__FILE__));
require_once 'aa_include.php';
initialiser_les_services(true,true); // sess,bdd



if(!isset($_SESSION[APP_KEY]['cible_courante'])){
   ajouterMessage('info' ,  __LINE__ .' : veuillez sélectionner une cible avant d\'accéder aux dossiers'  );
   recharger_la_page('zz_cibles_l1.php'); 
}

$js_a_executer_apres_chargement=array();
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
        if(sauvegarder_et_supprimer_fichier($fichier_cible)){
          ajouterMessage('succes' , __LINE__ .' : le fichier a bien été supprimé du disque' , BNF );
        }else{
          ajouterMessage('erreur' , __LINE__ .' : la copie du fichier dans le répertoire de sauvegarde a échoué ' , BNF );
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
        if($taille_contenu<=TAILLE_MAXI_SOURCE){
         $contenuFichier=file_get_contents($fichier_cible);
        }
        
        
        sql_inclure_reference(54);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_54.php');
        /*
        INSERT INTO b1.`tbl_sources`(
            `chx_cible_id_source` ,     `chp_nom_source` ,     `chp_commentaire_source` ,     `chx_dossier_id_source` ,     `chp_rev_source` , 
            `chp_genere_source`   ,     `chp_type_source`
        ) VALUES (
            :chx_cible_id_source  ,     :chp_nom_source ,      :chp_commentaire_source  ,     :chx_dossier_id_source  ,     :chp_rev_source , 
            :chp_genere_source    ,     :chp_type_source
        );*/ 
        /*sql_inclure_fin*/

        $a_inserer=array(array(
            'chx_cible_id_source'    => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,     
            'chp_nom_source'         => $nom_complet_source                                  ,      
            'chp_commentaire_source' => 'Importé le '.date('Y-m-d H:i:s')                    ,
            'chx_dossier_id_source'  => $_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']       ,     
            'chp_rev_source'         => ''                                                   , 
            'chp_genere_source'      => $contenuFichier                                      ,     
            'chp_type_source'        => ''                                                   ,
        ));

        $tt=sql_54($a_inserer);
        if($tt[__xst] === false){
              ajouterMessage('erreur' , __LINE__ .' : le fichier n\'a pas été créé en base' , BNF );
        }else{
          ajouterMessage('succes' , __LINE__ .' : le fichier a bien été créé en base' , BNF );
          if($taille_contenu>TAILLE_MAXI_SOURCE){
           ajouterMessage('avertissement' , __LINE__ .' sa taille est supérieure à '.TAILLE_MAXI_SOURCE.' caractère et il n\'a pas été intégré dans le champ "genere" ' , BNF );
          }
        }
        recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 



    }else if(isset($_POST['__supprimer_ce_repertoire_du_disque'])){

        /*
          ====================================================================================================================
          ============================================= SUPPRIMER UN REPERTOIRE DU DISQUE ====================================
          ====================================================================================================================
        */

         
        if(rmdir($_POST['__supprimer_ce_repertoire_du_disque'])){
         
            ajouterMessage('succes' , __LINE__ .' : la suppression du répertoire a réussi' , BNF );
          
        }else{
         
            ajouterMessage('erreur' , __LINE__ .' : la suppression du répertoire a échoué' , BNF );
          
        }

        recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
  
  
    }else if(isset($_POST['__importer_ce_fichier_de_'.'fta'])){
  
        /*
          ====================================================================================================================
          ============================================= IMPORTER UN FICHIER ==================================================
          ====================================================================================================================
        */
        

        $fichier_cible='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'].substr($_POST['__importer_ce_fichier_de_'.'fta'],strrpos($_POST['__importer_ce_fichier_de_'.'fta'],'/'));
        if(copy($_POST['__importer_ce_fichier_de_'.'fta'] , $fichier_cible)){

            ajouterMessage('succes' , __LINE__ .' : l\'import du fichier a réussi' , BNF );
             
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
     
        
        $chemin_relatif='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'];
        
        
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


        if(erreur_dans_champs_saisis_dossiers()){

         if(isset($_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'])&&is_numeric($_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'])){
          recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']);

         }else{
          ajouterMessage('erreur' , __LINE__ .' : POST __id1 = ' . $_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier'] );
          recharger_la_page('zz_dossiers_l1.php');
         }
        }
  
        sql_inclure_reference(55);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_55.php');
        /*
          UPDATE b1.tbl_dossiers SET `chx_cible_dossier` = :n_chx_cible_dossier , `chp_nom_dossier` = :n_chp_nom_dossier
          WHERE (`chi_id_dossier` = :c_chi_id_dossier AND `chx_cible_dossier` = :c_chx_cible_dossier) ;
        */ 
        /*sql_inclure_fin*/

        $a_modifier=array(
            'n_chx_cible_dossier'    => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,     
            'n_chp_nom_dossier'      => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier']      ,      
            'c_chi_id_dossier'       => $_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']       ,
            'c_chx_cible_dossier'    => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,     
        );

        $tt=sql_55($a_modifier);
        if($tt[__xst] === false){
            if($tt['code_erreur']===19){
                ajouterMessage('erreur' , __LINE__ .' ce nom existe déjà en bdd ' , BNF );
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
            }else{

                ajouterMessage('erreur' , __LINE__ .' '. $tt[__xme] , BNF );
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
            }
        }else{
            if($tt['changements']===1){
             
                ajouterMessage('info' , ' les modifications ont été enregistrées à ' . substr($GLOBALS['__date'],11).'.'.substr(microtime(),2,2) , BNF );
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']);
             
            }else{
             
                ajouterMessage('erreur' , __LINE__ .' : ' . $tt[__xme] , BNF );
                recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']);
             
            }
        }
  
        recharger_la_page(BNF.'?__action=__modification&__id='.$_SESSION[APP_KEY][NAV][BNF]['chi_id_dossier']); 
  
  

    }else if(isset($_POST['__action'])&&$_POST['__action']=='__confirme_suppression'){

        /*
          ===================================================================================================================
          ============================================= CONFIRMATION DE LA SUPPRESSION ======================================
          ===================================================================================================================
        */
      //  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_POST , true ) . '</pre>' ; exit(0);

        $__id= isset($_POST['chi_id_dossier'])?decrypter($_POST['chi_id_dossier']):0;

        if($__id!==false){
         
            sql_inclure_reference(50);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_50.php');
            /*
              SELECT 
              `T0`.`chi_id_dossier` , `T0`.`chx_cible_dossier` , `T0`.`chp_nom_dossier` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
              `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible`
               FROM b1.tbl_dossiers T0
               LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_dossier

              WHERE (`T0`.`chi_id_dossier` = :T0_chi_id_dossier AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);
            */ 
            /*sql_inclure_fin*/

            $tt=sql_50(array(
             'T0_chi_id_dossier'    => $__id ,
             'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
            ));
//            echo __FILE__ . ' ' . __LINE__ . ' $tt = <pre>' . var_export( $tt , true ) . '</pre>' ; exit(0);
            if($tt[__xst] === false || count($tt[__xva])!==1 ){
                ajouterMessage('erreur' ,  __LINE__ .' : dossier non trouvé ' , BNF );
                recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
            }
         
            $__valeurs=$tt[__xva][0];

            if($__valeurs['T0.chp_nom_dossier']=='/'){
             

                if($__valeurs['T1.chp_dossier_cible']==='fta' && APP_KEY !== 'fta'){
                }else{
                   ajouterMessage('erreur' ,  __LINE__ .' : on ne peut pas supprimer le dossier racine' , BNF );
                   recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
                }
             
                
            }
            
            
            sql_inclure_reference(56);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_56.php');
            /*
              SELECT        count(*)               FROM b1.tbl_sources T0
              WHERE (`T0`.`chx_cible_id_source` = :T0_chx_cible_id_source AND `T0`.`chx_dossier_id_source` = :T0_chx_dossier_id_source);
            */ 
            /*sql_inclure_fin*/

            $tt=sql_56(array(
                'T0_chx_dossier_id_source' => $__id ,
                'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
            ));

            if($tt[__xst] === false || count($tt[__xva])!==1 ){
                ajouterMessage('erreur' ,  __LINE__ .' : dossier non trouvé ' , BNF );
                recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
            }
            
            $nombre_de_sources=$tt[__xva][0]['0'];

            if($nombre_de_sources>0){

                ajouterMessage('erreur' ,  __LINE__ .' : ce dossier contient encore des sources rattachés <a class="yyinfo" href="zz_sources_l1.php?chi_id_dossier='.$__valeurs['T0.chi_id_dossier'].'">voir les sources du dossier '.$__valeurs['T0.chp_nom_dossier'].'</a>' , BNF );
                recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

            }
             
             
            sql_inclure_reference(57);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_57.php');
            /*
              SELECT  count(*)
               FROM b1.tbl_bdds T0
              WHERE (`T0`.`chx_dossier_id_basedd` = :T0_chx_dossier_id_basedd AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);             
            */ 
            /*sql_inclure_fin*/

            $tt=sql_57(array(
             'T0_chx_dossier_id_basedd' => $__id ,
             'T0_chx_cible_id_basedd'    => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
            ));
            if($tt[__xst] === false || count($tt[__xva])!==1 ){
                ajouterMessage('erreur' ,  __LINE__ .' : bdd non trouvé ' , BNF );
                recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
            }
            
            
            $nombre_de_bases=$tt[__xva][0]['0'];

            if($nombre_de_bases>0){

                ajouterMessage('erreur' ,  __LINE__ .' : ce dossier contient encore des bases rattachés' , BNF );
                recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 

            }
            
            
            sql_inclure_reference(58);
            /*sql_inclure_deb*/
            require_once(INCLUDE_PATH.'/sql/sql_58.php');
            /*

              DELETE FROM b1.tbl_dossiers
              WHERE (`chi_id_dossier` = :chi_id_dossier AND `chx_cible_dossier` = :chx_cible_dossier) ;
            */ 
            /*sql_inclure_fin*/

            $tt=sql_58(array(
             'chi_id_dossier'     => $__id ,
             'chx_cible_dossier'  => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
            ));
            if($tt[__xst] === false ){
                ajouterMessage('erreur' ,  __LINE__ .' : ' . $tt[__xme] , BNF );
                recharger_la_page(BNF.'?__action=__suppression&__id='.$__id); 
            }else{
               ajouterMessage('info' ,  'l\'enregistrement a été supprimé à ' . substr($GLOBALS['__date'],11) );
               recharger_la_page('zz_dossiers_l1.php');
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
        
        
        sql_inclure_reference(37);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_37.php');
        /*
          INSERT INTO b1.`tbl_dossiers`(
              `chx_cible_dossier` ,     `chp_nom_dossier`
          ) VALUES (
              :chx_cible_dossier ,     :chp_nom_dossier
          );
        */ 
        /*sql_inclure_fin*/

        $tt=sql_37(array(array(
         'chp_nom_dossier'    => $_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'] ,
         'chx_cible_dossier'  => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
        )));
        if($tt[__xst] === false ){
            ajouterMessage('erreur' , __LINE__ .' : ' . $tt[__xme] , BNF );
            recharger_la_page(BNF.'?__action=__creation'); 
        }else{
            ajouterMessage('info' , __LINE__ .' : l\'enregistrement ('.$tt['nouvel_id'].') a bien été créé' , BNF );
            recharger_la_page(BNF.'?__action=__modification&__id='.$tt['nouvel_id']); 
        }
        
    }else{
  

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
    recharger_la_page('zz_dossiers_l1.php');

}

/*
 ====================================================================================================================
 ====================================================================================================================
 ============================================= GET ==================================================================
 ====================================================================================================================
 ====================================================================================================================
*/

if((isset($_GET['__action'])) && (($_GET['__action'] == '__modification') || ($_GET['__action'] == '__suppression'))){

    $__id=((isset($_GET['__id']))?((is_numeric($_GET['__id']))?(int)($_GET['__id']):0):0);

    if(($__id === 0)){

        ajouterMessage('erreur',__LINE__.' il y a eu un problème ');
        recharger_la_page('zz_dossiers_l1.php');

    }else{

        sql_inclure_reference(50);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_50.php');
        /*
          SELECT 
           `T0`.`chi_id_dossier` , `T0`.`chx_cible_dossier` , `T0`.`chp_nom_dossier` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
           `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` 
           FROM b1.tbl_dossiers T0 
            LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_dossier 
            WHERE (`T0`.`chi_id_dossier` = :T0_chi_id_dossier AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);
        */
        /*sql_inclure_fin*/
        
        $tt=sql_50(array( 'T0_chi_id_dossier' => $__id, 'T0_chx_cible_dossier' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']));

        if(($tt[__xst] === false) || (count($tt[__xva]) !== 1)){

            ajouterMessage('erreur',__LINE__.' valeurs non trouvées pour cet id');
            recharger_la_page('zz_dossiers_l1.php');

        }

        $__valeurs=$tt[__xva][0];
        
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

$o1.='<h1>gestion de dossier '.bouton_retour_a_la_liste('zz_dossiers_l1.php').'</h1>';



if(isset($_GET['__action'])&&$_GET['__action']=='__suppression'){

  /*
  ============================================================================
  ==== __suppression =========================================================
  ============================================================================
  */


  if($__valeurs['T0.chp_nom_dossier']==='/'){
      if($__valeurs['T1.chp_dossier_cible']==='fta' && APP_KEY !== 'fta'){
        /*
         si on est dans un environnement ftx et que la cible courante est fta,
         on a le droit de supprimer le dossier da la base
        */
      }else{
          recharger_la_page('zz_dossiers_l1.php');
      }
  }


 $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
 $o1.=' <form method="post" class="yyformDelete">'.PHP_EOL;
 $o1.='   veuillez confirmer le suppression de  : '.PHP_EOL;
 $o1.='   <br /><br /><b>'.
       '('.$__valeurs['T0.chi_id_dossier'].')  nom : ' .$__valeurs['T0.chp_nom_dossier'].'    <br /> '.
       '</b><br />'.PHP_EOL;
 $o1.='   <input type="hidden" value="'.encrypter($__id).'" name="chi_id_dossier" id="chi_id_dossier" />'.PHP_EOL;
 $o1.='   <input type="hidden" value="__confirme_suppression" name="__action" id="__action" />'.PHP_EOL;
 $o1.='   <button type="submit" class="yydanger">Je confirme la suppression</button>'.PHP_EOL;
 $o1.=''.PHP_EOL;
 $o1.=' </form>'.PHP_EOL;

}else if(isset($_GET['__action'])&&$_GET['__action']=='__creation'){

  /*
  ============================================================================
  ==== __creation ============================================================
  ============================================================================
  */


  $o1.='<h2>ajouter un dossier</h2>'.PHP_EOL;

  $o1.='<form method="post"  enctype="multipart/form-data" class="form1">'.PHP_EOL;

  $chp_nom_dossier =isset($_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier'] )?$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier']:'';
  $o1.=' <div class="yyfdiv1">'.PHP_EOL;
  $o1.='  <div class="yyflab1"><div style="word-break:break-word;">nom</div></div>'.PHP_EOL;
  $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
  $o1.='   <input type="text" autofocus="autofocus" value="'.enti1($chp_nom_dossier).'" name="chp_nom_dossier" id="chp_nom_dossier" maxlength="64" style="max-width:64em;" />'.PHP_EOL;
  $o1.='  </div></div>'.PHP_EOL;
  $o1.=' </div>'.PHP_EOL;



  $o1.=' <div class="yyfdiv1">'.PHP_EOL;
  $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
  $o1.='   <button type="submit">enregistrer</button>'.PHP_EOL;
  $o1.='   <input type="hidden" value="0" name="__id1" id="__id1" />'.PHP_EOL;
  $o1.='   <input type="hidden" value="__creation" name="__action" id="__action" />'.PHP_EOL;
  $o1.='  </div></div>'.PHP_EOL;
  $o1.=' </div>'.PHP_EOL;

  $o1.='</form>'.PHP_EOL;

}else if(isset($_GET['__action'])&&$_GET['__action']=='__modification'){


  /*
  ============================================================================
  ==== __modification ============================================================
  ============================================================================
  */

//  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY][NAV][BNF] , true ) . '</pre>' ; exit(0);
  $o1.='<h2>modifier un dossier</h2>'.PHP_EOL;

  $_SESSION[APP_KEY][NAV][BNF]['verification']=array($__id);
  $__valeurs['T0.chp_nom_dossier']          =$_SESSION[APP_KEY][NAV][BNF]['chp_nom_dossier']         ??$__valeurs['T0.chp_nom_dossier']        ;
  $__valeurs['T0.chx_cible_dossier']     =$_SESSION[APP_KEY][NAV][BNF]['chx_cible_dossier']    ??$__valeurs['T0.chx_cible_dossier']   ;
  
  
  
  
  $o1.='<form method="post" enctype="multipart/form-data">'.PHP_EOL;

  $o1.=' <input type="hidden" value="__modification" name="__action" id="__action" />'.PHP_EOL;
  $o1.=' <input type="hidden" value="'.encrypter($__id).'" name="chi_id_dossier" id="chi_id_dossier" />'.PHP_EOL;
  

  $o1.=' <div class="yyfdiv1">'.PHP_EOL;
  $o1.='  <div class="yyflab1">'.PHP_EOL;
  $o1.='   <div style="word-break:break-word;">id, nom , type , dossier</div>'.PHP_EOL;
  $o1.='  </div>'.PHP_EOL;
  $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
  $o1.='   <span>'.$__id.'</span>'.PHP_EOL;
  $o1.='   <input  type="text" value="'.enti1($__valeurs['T0.chp_nom_dossier']).'" name="chp_nom_dossier" id="chp_nom_dossier" maxlength="64" style="width:100%;max-width:20em;" />'.PHP_EOL;
  $o1.='  </div></div>'.PHP_EOL;
  $o1.=' </div>'.PHP_EOL;
  


  $o1.='<div class="yyfdiv1">'.PHP_EOL;
  $o1.='  <div class="yyfinp1"><div>'.PHP_EOL;
  $o1.='   <button type="submit" class="">enregistrer les modifications</button>'.PHP_EOL;
  $o1.='  </div></div>'.PHP_EOL;
  $o1.='</div>'.PHP_EOL;




    if($__valeurs['T1.chp_dossier_cible']==='fta' && APP_KEY !== 'fta'){
     
     /*
      si on est dans un environnement ftx et que la cible courante est fta,
      il ne faut pas afficher les éléments de fta
     */
    }else{

         
       //  echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);
         $chemin_relatif='../../'.$_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'].$__valeurs['T0.chp_nom_dossier'];
//         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs['T0.chp_nom_dossier'] , true ) . '</pre>' ; exit(0);
         
//         echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__valeurs['T0.chp_nom_dossier'] , true ) . '</pre>' ; exit(0);
         
         if(is_dir($chemin_relatif)){

       //     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_relatif , true ) . '</pre>' ; exit(0);
            $chemin_reel=realpath($chemin_relatif);
       //     echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $chemin_reel , true ) . '</pre>' ; exit(0);
            
            
            $chemin_du_repertoire=$chemin_reel.'/';
            $monscan=scandir($chemin_du_repertoire);
            
//            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $monscan , true ) . '</pre>' ; exit(0);
            
            if($monscan!==false){
                $glob=array();
                
                foreach( $monscan as $k0 => $v0){
                    if($v0!=='.' && $v0!=='..'){
                      $glob[]=array( 
                       'nom'          => $chemin_du_repertoire.$v0 , 
                       'type_fichier' => @is_file($chemin_du_repertoire.$v0) 
                      );
                    }
                }
                
                $tabl=array();
                $o1.='<div>il y a '.count($glob).' élément(s) dans ce répertoire</div>';
                
                
                if(count($glob)<100){
                 
                 
                    $liste_des_fichiers='';
                    $liste_des_dossiers='';
                    foreach($glob as $k1=>$v1){
                        $nom_court_de_l_element=substr(str_replace($chemin_reel,'',$v1['nom']),1);
                        $tabl[$nom_court_de_l_element]=array(
                         'sur_disque' => true,
                         'en_base' => 0,
                         'type_fichier' => false,
                         'nom_relatif_dossier' => '',
                        );
                        if($v1['type_fichier']===true){
                            $tabl[$nom_court_de_l_element]['type_fichier']=true;
                            $liste_des_fichiers.=',"'.$nom_court_de_l_element.'"';
                        }else{
                            $tabl[$nom_court_de_l_element]['nom_relatif_dossier']=$__valeurs['T0.chp_nom_dossier'].'/'.$nom_court_de_l_element;
                            
                            $liste_des_dossiers.=',"'.$__valeurs['T0.chp_nom_dossier'].'/'.$nom_court_de_l_element.'"';
                        }
                    }
                    if($liste_des_fichiers!=='' ){
                        $liste_des_fichiers=substr($liste_des_fichiers,1);
                        
                        sql_inclure_reference(59);
                        /*sql_inclure_deb*/
                        require_once(INCLUDE_PATH.'/sql/sql_59.php');
                        /*
                          // === sources d'un dossier par liste de nom ===
                          SELECT `T0`.`chp_nom_source` , `T0`.`chi_id_source`
                           FROM b1.tbl_sources T0
                          WHERE (
                               `T0`.`chp_nom_source` IN :T0_chp_nom_source 
                           AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source 
                           AND `T0`.`chx_dossier_id_source` = :T0_chx_dossier_id_source);

                        */
                        /*sql_inclure_fin*/
                        
                        $tt=sql_59(array( 
                           'T0_chp_nom_source'        => $liste_des_fichiers                                  ,
                           'T0_chx_cible_id_source'   => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
                           'T0_chx_dossier_id_source' => $__id                                                ,
                        ));

                        if(($tt[__xst] === false) ){
                            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tt[__xme] , true ) . '</pre>' ; exit(0);
                        }
                        foreach($tt[__xva] as $k1 => $v1){
                            $tabl[$v1['T0.chp_nom_source']]['en_base']=$v1['T0.chi_id_source'];
                        }
                    }
                       
                    if($liste_des_dossiers!=='' ){
                        $liste_des_dossiers=substr($liste_des_dossiers,1);
                        
                        
                        sql_inclure_reference(60);
                        /*sql_inclure_deb*/
                        require_once(INCLUDE_PATH.'/sql/sql_60.php');
                        /*
                          // === dossiers de dossiers liste de nom ===
                          SELECT 
                          `T0`.`chp_nom_dossier` , `T0`.`chi_id_dossier`
                           FROM b1.tbl_dossiers T0
                          WHERE ( `T0`.`chp_nom_dossier` IN (:T0_chp_nom_dossier) AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);

                        */
                        /*sql_inclure_fin*/
                        
                        $tt=sql_60(array( 
                           'T0_chp_nom_dossier'        => $liste_des_dossiers                                  ,
                           'T0_chx_cible_dossier'   => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'] ,
                        ));


                        if( $tt[__xst] === false ){
                            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $tt[__xme] , true ) . '</pre>' ; exit(0);
                        }
                        foreach($tt[__xva] as $k1 => $v1){
                            $cle=substr($v1['T0.chp_nom_dossier'],strlen($__valeurs['T0.chp_nom_dossier'])+1);
                            $tabl[$cle]['en_base']=$v1['T0.chi_id_dossier'];
                        }
                        
                    }
                       
//                    echo __FILE__ . ' ' . __LINE__ . ' $tabl = <pre>' . var_export( $tabl , true ) . '</pre>' ; exit(0);
                    foreach($tabl as $k1 => $v1){
                        $o1.='<div>';
                        $o1.=$k1;
                     
                        if($v1['type_fichier']===true){
                            $o1.=' est un fichier';
                            
                            $nom_absolu_du_fichier=$chemin_du_repertoire.$k1;
                            //echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nom_absolu_du_fichier , true ) . '</pre>' ; exit(0);
                            if(is_file($nom_absolu_du_fichier)){
                               $o1.=' présent sur disque ';
                               
                               if($v1['en_base']>0){
                                  $o1.=' , présent dans la base ';
                                  $o1.=' <a class="yyinfo" href="zz_sources_a1.php?__action=__modification&amp;__id='.$v1['en_base'].'">editer</a>';
                               }else{
                                  $o1.=' absent de la base ';
                                  
                                  $positionDernierPoint=strrpos($k1,'.');
                                  if($positionDernierPoint===null){
                                   $extension='';
                                  }else{
                                   $extension=substr($k1,$positionDernierPoint);
                                  }
                   //               echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $extension , true ) . '</pre>' ; exit(0);
                     
                                   
                                  
                                  // les fichiers sqlite  binaire ne sont pas en base
                                  
                                  if($extension==='.db' || $extension==='.exe'){
                                  }else{
                                      $o1.=' <button name="__creer_le_fichier_en_base" value="'.$k1.'">créer '.$k1.' en base</button>';
                                  }
                                  
                               }
                               $o1.=' <button class="yydanger" name="__effacer_du_disque" value="'.$k1.'">supprimer du disque</button>';
                            }else{
                               $o1.=' <b>absent du disque</b> ';
                               if($v1['en_base']>0){
                                  $o1.=' présent dans la base ';
                               }else{
                                  $o1.=' absent de la base ';
                               }
                            }
                            
                            
                            
                        }else{
                            $o1.=' est un répertoire';
                            $nom_absolu_du_dossier=$chemin_du_repertoire.$k1;
                            //echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nom_absolu_du_fichier , true ) . '</pre>' ; exit(0);
                            if(is_dir($nom_absolu_du_dossier)){
                               $o1.=' présent sur disque ';
                               if($v1['en_base']>0){
                                  $o1.=' , présent dans la base <a class="yysucces" href="zz_dossiers_a1.php?__action=__modification&amp;__id='.$v1['en_base'].'">editer</a>';
                               }else{
                                  $o1.=' absent de la base ';
                               }
                            }
                        }
                     
                        $o1.='</div>';
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

                $chemin_relatif='../../'.'fta'.$__valeurs['T0.chp_nom_dossier'];
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
           $o1.='<a class="yydanger" href="zz_dossiers_a1.php?__action=__suppression&amp;__id='.$__id.'" title="supprimer de la Bdd">supprimer de la base</a>';
           $o1.='</div>';
  
         }

    }
  
  

  $o1.='</form>'.PHP_EOL;

  

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