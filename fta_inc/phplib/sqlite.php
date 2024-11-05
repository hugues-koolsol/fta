<?php

function comparer_une_base_physique_et_une_base_virtuelle($id_base,$source_base_virtuelle){

    $tableaux_retournes=array('tableau1' => array() , 'tableau2' => array() );
    
    sql_inclure_reference(26);
    /*sql_inclure_deb*/
    require_once(INCLUDE_PATH.'/sql/sql_26.php');
    /*sql_inclure_fin*/

    $tt=sql_26(array(
        'T0_chi_id_basedd'           => $id_base ,
        'T0_chx_cible_id_basedd'     => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
    ));

    if($tt[__xst] === false || count($tt[__xva])!==1){
        ajouterMessage('erreur' , __LINE__ . ' erreur de récupération de la base ' , BNF  );
        return array(__xst=> false  );
    }  


    $__valeurs=$tt[__xva][0];



    $chemin_bdd='../../'.$__valeurs['T2.chp_dossier_cible'].'/'.$__valeurs['T1.chp_nom_dossier'].'/'.$__valeurs['T0.chp_nom_basedd'];

    if( is_file($chemin_bdd)  && strpos($__valeurs['T0.chp_nom_basedd'],'.db')!==false && strpos( $__valeurs['T1.chp_nom_dossier'] , 'sqlite' ) !==false  ){

        $ret=obtenir_la_structure_de_la_base_sqlite($chemin_bdd,true);
        if($ret[__xst]===true){
            $tableauDesTables=$ret['value'];
            $ret2=produire_un_tableau_de_la_structure_d_une_bdd_grace_a_un_source_de_structure($source_base_virtuelle);
            if($ret2[__xst]===true){

                $tableaux_retournes=array( 'tableau1' => $ret['value'] , 'tableau2' => $ret2['value'] );

            }else{

                ajouterMessage('erreur' , __LINE__ . ' erreur sur la structure de la base 2 de la zone "genere" ' , BNF  );
                return array(__xst=> false  );

            }

         
        }else{

            ajouterMessage('erreur' , ' erreur sur la structure de la base "'.$__valeurs['T0.chp_nom_basedd'].'"' , BNF  );
            return array(__xst=> false  );

        }

    }else{

        ajouterMessage('erreur' , __LINE__ .' fichier de la base de donnée sqlite introuvable ' , BNF );
        return array(__xst=> false  );
        
    }
    
    return array(__xst=> true , __xva => $tableaux_retournes );
}
/*
  ========================================================================================
*/
function ecrire_le_dump_de_la_base_sqlite_sur_disque($chemin_fichier_sqlite,$nom_du_fichier_dump,$structure_tableau_de_la_base){
 
// echo __FILE__ . ' ' . __LINE__ . ' $structure = <pre>' . var_export( $structure , true ) . '</pre>' ; exit(0);
 $nombre_de_values_par_insert=100; 
 
 if($fd=fopen($nom_du_fichier_dump,'w')){
 }else{
  return array(__xst => true , __xme => __LINE__ . ' le fichier '.$nom_du_fichier_dump.' ne peut être ouvert' );
 }
 
 $db0 = new SQLite3($chemin_fichier_sqlite);
 
 
 foreach($structure_tableau_de_la_base as $k0 => $v0){
  if(isset($v0['liste_des_champs'])){
   $listeDesChamps='';
   
   
   $extraire_les_donnees=true;
   
   //echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SESSION[APP_KEY]['cible_courante'] , true ) . '</pre>' ; exit(0);
   
   /*
   Quand on fait une extraction de fta ou bien de ses clones, on ne sélectionne que les données particulières
   */
   $nom_du_champ_reference_cible='';
   
   if( 'fta' === $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible'] ){
        if( 'fta' === $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible'] ){
            /*
            pour fta, on n'extrait pas certaines valeurs 
            */
            if($k0==='tbl_revs' || $k0 ==='tbl_taches'){
                $extraire_les_donnees=false;
               
            }
        }
        
        foreach( $v0['liste_des_champs'] as $k1=>$v1){
          $listeDesChamps.=' `'.$k1.'`,';
          if(strpos($k1,'chx_cible')!==false){
           $nom_du_champ_reference_cible=$k1;
          }
         
        }
        if($k0==='tbl_cibles'){
         $nom_du_champ_reference_cible='chi_id_cible';
        }
        
        
   }
   
   if($listeDesChamps!=='' && $extraire_les_donnees===true ){
    $listeDesChamps=substr($listeDesChamps,0,-1);
    
    $__nbEnregs= $db0->querySingle('SELECT COUNT(*) FROM `'.$k0.'`');
    
//    echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $__nbEnregs . ' pour ' . $k0 , true ) . '</pre>' ; exit(0);
    if($__nbEnregs>0){
     
     fwrite($fd,'/*'.CRLF.CRLF.CRLF.CRLF);
     fwrite($fd,'  ========================================================================='.CRLF);
     fwrite($fd,'  Pour la table '.$k0.' il y a ' . $__nbEnregs . ' enregistrement(s) à insérer '.CRLF);
     fwrite($fd,'  ========================================================================='.CRLF);
     fwrite($fd,'*/'.CRLF);
     
     if(   APP_KEY==='fta' 
        && $_SESSION[APP_KEY]['sess_id_utilisateur']===1 
        && $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']===1 
        && $_SESSION[APP_KEY]['cible_courante']['chp_nom_cible']==='fta'
        && $_SESSION[APP_KEY]['cible_courante']['chp_dossier_cible']==='fta'
        && $_SESSION[APP_KEY][NAV]['zz_bdds_a1.php']['chi_id_basedd']==='1'
     ){
         
         if( $k0==='tbl_bdds' ){
             /*
              pour la base de donnée, principale de fta, on ne sauvegarde le format rev mais pas le rev de travail ni le sql
             */

             $listeDesChamps='`chi_id_basedd`, `chx_dossier_id_basedd`, `chx_cible_id_basedd`, `chp_nom_basedd`, `chp_commentaire_basedd`, `chp_rev_basedd`';
             
         }
     }
     
     /*
      on crée des insert par paquets de $nombre_de_values_par_insert
     */
     $indice_actuel=0;
     $sql='';
     if($nom_du_champ_reference_cible!==''){
      $sql0='SELECT '. $listeDesChamps.' FROM `'.$k0.'` WHERE '.$nom_du_champ_reference_cible.' = '.sq0($_SESSION[APP_KEY]['cible_courante']['chi_id_cible']).'';

     }else{
      $sql0='SELECT '. $listeDesChamps.' FROM `'.$k0.'`';
     }
     $stmt0 = $db0->prepare($sql0);

     if($stmt0!==false){
      
       $res0 = $stmt0->execute();
       
       while($tab0=$res0->fetchArray(SQLITE3_NUM)){
        
        if($indice_actuel!==0 && $indice_actuel%$nombre_de_values_par_insert===0){
         
         $sql=substr($sql,0,-1).';';
         fwrite($fd,CRLF.'INSERT INTO `'.$k0.'`('.$listeDesChamps.') VALUES');
         fwrite($fd,$sql.CRLF);
         $sql='';
         
        }
        $sql.=CRLF.'(';
        foreach($tab0 as $k2 => $v2){
         if($v2===null){
             $sql.='NULL,';
         }else{
             $sql.='\''.str_replace("'","''",$v2).'\',';
         }
        }
        $sql=substr($sql,0,-1);
        $sql.='),';
        $indice_actuel++;
       }
       $stmt0->close();
       if( $sql !== '' ){
         $sql=substr($sql,0,-1).';';
         fwrite($fd,CRLF.'INSERT INTO `'.$k0.'`('.$listeDesChamps.') VALUES');
         fwrite($fd,$sql.CRLF);
         $sql='';
       }


     }else{
      echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
     }
     
     
     
     
    }else{
     fwrite($fd,'/*'.CRLF.CRLF.CRLF.CRLF);
     fwrite($fd,'  ========================================================================='.CRLF);
     fwrite($fd,'  Pour la table '.$k0.' il n\'y a aucune donnée à insérer'.CRLF);
     fwrite($fd,'  ========================================================================='.CRLF);
     fwrite($fd,'*/'.CRLF);
    }
    
   }
  }
 }
 
 fclose($fd);
 
 $zip=new ZipArchive();

 if($zip->open($nom_du_fichier_dump.'.zip',ZIPARCHIVE::CREATE) !== TRUE){

     return array(__xst => true , __xme => __LINE__ . ' le fichier zip de '.$nom_du_fichier_dump.' ne peut être ouvert' );

 }

 $chemin_fichier=realpath($nom_du_fichier_dump);
 $nom_fichier=basename($nom_du_fichier_dump);

 if(!$zip->addFile($chemin_fichier,$nom_fichier)){

     $zip->close();
     return array(__xst => true , __xme => __LINE__ . ' ajout du fichier au zip impossible' );

 }

 $zip->close();
 
 
 return array(__xst => true , 'value' => $nom_du_fichier_dump );
}

/*
  ========================================================================================
*/
function produire_un_tableau_de_la_structure_d_une_bdd_grace_a_un_source_de_structure($source){
 
    $tableauDesTables=array(); 
    
    $chemin_fichier_temporaire=RACINE_FICHIERS_PROVISOIRES.DIRECTORY_SEPARATOR.date('Y/m/d');
    $continuer=true;
    if(!is_dir($chemin_fichier_temporaire)){
        if(!mkdir($chemin_fichier_temporaire,0777,true)){
            return array(__xst => false , __xme => 'impossible de créer le répertoire temporaire' );
            $continuer=false;
        }
    }

    if($continuer===true){
     
        $fichier_temporaire=$chemin_fichier_temporaire.DIRECTORY_SEPARATOR.sha1(date('Y-m-d-H-i-s').$_SESSION[APP_KEY]['sess_id_utilisateur']).'.db';
        
        
        
        
        $dbtemp = new SQLite3($fichier_temporaire);
        if(is_file($fichier_temporaire)){

//            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $source , true ) . '</pre>' ; exit(0);
         
            $res0= $dbtemp->exec($source);
//            echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . $source  . '</pre>' ; exit(0);
            
            /* 
              à faire, si une création de table ne fonctionne pas alors on a une erreur
              => il faut créer table par table
            */
//            if($res0===true){
             
                $dbtemp->close();
                $ret=obtenir_la_structure_de_la_base_sqlite($fichier_temporaire,true);
                
                if($ret[__xst]===true){
                 
                    $tableauDesTables=$ret['value'];
                 
                }else{

                    /* ne pas créer une copie de sauvegarde d'un fichier temporaire */
                    sauvegarder_et_supprimer_fichier($fichier_temporaire,true); 
                    return array(__xst => false , __xme => 'erreur sur la création des tables de la base' );

                }

//            }
            /* ne pas créer une copie de sauvegarde d'un fichier temporaire */
            sauvegarder_et_supprimer_fichier($fichier_temporaire,true); 
         
     
        }else{
         
            return array(__xst => false , __xme => 'erreur sur la création de la base' );
             
        }
        
          
    }
    return array(__xst => true , 'value' => $tableauDesTables );
}

/*
  ========================================================================================
*/
function obtenir_tableau_sqlite_de_la_table($nom_de_la_table , $db , $essayer_auto_increment){

    $t='';
    $ret0= $db->query('create table ____temporaire_____ (id integer primary key autoincrement)');
    
    $auto_increment=false;
    $sql='SELECT * FROM sqlite_sequence WHERE name = \''.$nom_de_la_table.'\'';    
    /*
      si il n'y a aucune table avec autoincrement alors la table sqlite_sequence n'existe pas et ça provoque une erreur
    */    
    $stmt = $db->prepare($sql); 
    if($stmt!==false){
        $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
        while($arr=$result->fetchArray(SQLITE3_NUM)){
            $auto_increment=true;
        }
        $stmt->close(); 
    }
    $ret0= $db->query('drop table ____temporaire_____');


    $liste_des_champs=array();
    $sql= 'PRAGMA table_info(\''.$nom_de_la_table.'\'  ) ';
    $stmt = $db->prepare($sql);
    $liste_des_champs_non_null=array();
    if($stmt!==false){
        $a_des_champs_index='';
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
            if($arr[2]==='INTEGER' && $arr[5]===1 ){ // INTEGER PRIMARY KEY
                if($auto_increment===true){
                   $liste_des_champs[$arr[1]]['auto_increment']=true;
                }
                $a_des_champs_index=$arr[1];
            }else{
                if($arr[3]===1){
                    /* 
                    si on tente un insert, il faut renseigner les champs not_null
                    */
                    
                    $liste_des_champs_non_null[]=$arr[1];
                }
            }
            
        }
        $stmt->close();
        if($essayer_auto_increment===true && $auto_increment=== false && $a_des_champs_index!=='' ){
            /*
              si la base sqlite vient d'être crée, les tables sont vides et 
              la table sqlite_sequence qui référence les auto increment n'existe pas
              Donc si cette table est vide, on essaie de créer un enregistrement temporaire
            */
            
            $sql1  ='SELECT COUNT(*) FROM '.$nom_de_la_table;
            $__nbEnregs= $db->querySingle($sql1);
            if($__nbEnregs===0){
                /*
                  si le nombre d'enregistrements est supérieur à zéro 
                  alors on aurait du trouver la caractéristique auto increment plus haut.
                  Ici on a zéro enregistrement donc on fait le test
                */
                
                $db->querySingle('PRAGMA foreign_keys=OFF');
                $sql2 ='INSERT INTO `'.$nom_de_la_table . '`(`'.$a_des_champs_index.'`';
                foreach( $liste_des_champs_non_null as $k1 => $v1){
                    $sql2.=' , `'.$v1.'`' ;
                }
                $sql2.=') VALUES (1';
                foreach( $liste_des_champs_non_null as $k1 => $v1){
                    $sql2.=' , "1"' ;
                }
                $sql2.=')';
                $essai_insert= $db->querySingle($sql2);
                if($essai_insert!==false){
                 
                    $sql='SELECT * FROM sqlite_sequence WHERE name = \''.$nom_de_la_table.'\'';

                    $niveau_erreur_php=error_reporting(0);
                    $stmt = $db->prepare($sql); 
                    if($stmt!==false){
                        $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
                        while($arr=$result->fetchArray(SQLITE3_NUM)){
//                             echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $nom_de_la_table , true ) . '</pre>' ; exit(0);
                            $liste_des_champs[$a_des_champs_index]['auto_increment']=true;
                        }
                        $stmt->close(); 
                    }
                    $db->querySingle('PRAGMA foreign_keys=ON');
                    $sql3  ='DELETE FROM `'.$nom_de_la_table . '` WHERE `'.$a_des_champs_index.'` = 1';
                    $essai_delete = $db->querySingle($sql3);
                    error_reporting($niveau_erreur_php);
                 
                }else{
                    echo __FILE__ . ' ' . __LINE__ . ' $sql2 = <pre>' . var_export( $sql2 , true ) . '</pre>' ; exit(0);
                }
                $db->querySingle('PRAGMA foreign_keys=ON');

             
            }

            
         
        }
        
    }else{
      return signaler_erreur( array(__xst=>true,__xme=> __LINE__ . ' erreur sur la liste des champs de la table '.$nom_de_la_table.'  ' ,  'provenance' => BNF) );
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
      return signaler_erreur( array(__xst=>true,__xme=> __LINE__ . ' erreur sur la liste des clés étrangères de la table '.$nom_de_la_table.' ' ,  'provenance' => BNF) );
    }

    
    $liste_des_indexes=array();

    $sql= 'PRAGMA index_list(\''.$nom_de_la_table.'\') ';
    $stmt = $db->prepare($sql); 
    if($stmt!==false){
        $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
        while($arr=$result->fetchArray(SQLITE3_NUM)){
            if($arr[3]==='c'){
                /*
                on ne prend que origin = 'c' car ce sont les indexes créés par l'utilisateur
                */
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
                  return signaler_erreur( array(__xst=>true,__xme=> __LINE__ . ' erreur sur la liste des indexes de la table '.$nom_de_la_table.' ' ,  'provenance' => BNF) );
                }
            }
        }
        $stmt->close(); 
    }else{
      return signaler_erreur( array(__xst=>true,__xme=> __LINE__ . ' erreur sur la liste des indexes de la table '.$nom_de_la_table.' ' ,  'provenance' => BNF) );
    }

   
    $tableau=array(
     'liste_des_champs'             => $liste_des_champs             ,
     'liste_des_indexes'            => $liste_des_indexes            ,
    );


    return array(__xst=>true,'value'=>$tableau);
}

/*
  ========================================================================================
*/
function obtenir_la_structure_de_la_base_sqlite_v2($chemin_base){
 
   $tableauDesTables=array();
   $db1 = new SQLite3($chemin_base);
   $tableau_des_tables=array();
   $sql='SELECT tbl_name FROM sqlite_master WHERE  name NOT LIKE \'sqlite_%\' AND type == \'table\'';
   $listeDesTables=array();
   $stmt = $db1->prepare($sql);

   if($stmt!==false){
    
     $t='';
     $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
     
     while($arr=$result->fetchArray(SQLITE3_NUM)){

         $tableau_des_tables[]=$arr[0];
      
     }
     
     $stmt->close(); 

     foreach( $tableau_des_tables as $k1 => $v1){
      
         $obj=obtenir_tableau_sqlite_de_la_table($v1 , $db1 , true);

         if($obj[__xst]===true){
          
          $tableauDesTables[$v1]['structure']=$obj['value'];
//          echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $obj['value']['liste_des_indexes'] , true ) . '</pre>' ; exit(0);
          
          
          
          $sql='select sql from sqlite_master where name = \''.$v1.'\'';
          $stmt = $db1->prepare($sql); 
          
          if($stmt!==false){
              
              $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
              while($arr=$result->fetchArray(SQLITE3_NUM)){
               $tableauDesTables[$v1]['create_table']=$arr[0];
              }
              $stmt->close(); 
          }
          $tableauDesTables[$v1]['create_index']=array();
          if(isset($obj['value']['liste_des_indexes']) && count($obj['value']['liste_des_indexes'])>0){
//              echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $obj['value']['liste_des_indexes'] , true ) . '</pre>' ; exit(0);
              foreach( $obj['value']['liste_des_indexes'] as $k2 => $v2){

                  $sql='select sql from sqlite_master where name = \''.$k2.'\'';
                  $stmt = $db1->prepare($sql); 
                  
                  if($stmt!==false){
                      
                      $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
                      while($arr=$result->fetchArray(SQLITE3_NUM)){
                       $tableauDesTables[$v1]['create_index'][$k2]=$arr[0];
                      }
                      $stmt->close(); 
                  }
              }
          }
          
          
          
         }else{

           ajouterMessage('erreur' , ' erreur sur la table "'.$v1.'"' , BNF  );
           
         }
     }
     
     
     
   }else{
    
       ajouterMessage('erreur' , __LINE__ .' erreur sql ' , BNF );
    
   }
//   echo __FILE__ . ' ' . __LINE__ . ' $tableauDesTables = <pre>' . var_export( $tableauDesTables , true ) . '</pre>' ; exit(0);
 
    return array(__xst=>true,'value'=>$tableauDesTables);
 
}




/*
  ========================================================================================
*/
function obtenir_la_structure_de_la_base_sqlite($chemin_base , $essayer_auto_increment){
 
   $tableauDesTables=array();
   $db1 = new SQLite3($chemin_base);
   $tableau_des_tables=array();
   $sql='SELECT tbl_name FROM sqlite_master WHERE  name NOT LIKE \'sqlite_%\' AND type == \'table\'';
   $listeDesTables=array();
   $stmt = $db1->prepare($sql);

   if($stmt!==false){
    
     $t='';
     $result = $stmt->execute(); // SQLITE3_NUM: SQLITE3_ASSOC
     
     while($arr=$result->fetchArray(SQLITE3_NUM)){

         $tableau_des_tables[]=$arr[0];
      
     }
     
     $stmt->close(); 

     foreach( $tableau_des_tables as $k1 => $v1){
      
         $obj=obtenir_tableau_sqlite_de_la_table($v1 , $db1 , $essayer_auto_increment);

         if($obj[__xst]===true){
          
          $tableauDesTables[$v1]=$obj['value'];
          
         }else{

           ajouterMessage('erreur' , ' erreur sur la table "'.$v1.'"' , BNF  );
           
         }
     }
     
     
     
   }else{
    
       ajouterMessage('erreur' , __LINE__ .' erreur sql ' , BNF );
    
   }
 
    return array(__xst=>true,'value'=>$tableauDesTables);
 
}