<?php
/* if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n"); fclose($fd);}*/
/*
  =====================================================================================================================
*/
function sauvegarder_source_et_ecrire_sur_disque_par_son_identifiant(&$data){

    
    if(isset($data[__entree]['id_source'])){

        sql_inclure_reference(62);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_62.php');
        /*
        SELECT 
        `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
        `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
        `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
         FROM b1.tbl_sources T0
         LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source
        
         LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source
        
        WHERE (`T0`.`chi_id_source` = :T0_chi_id_source
          
         AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_62(array(/**/
            'T0_chi_id_source' => $data[__entree]['id_source'],
            'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
        ));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            $data[__xst]=false;
            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' KO');
            return;

        }

        $__valeurs=$tt[__xva][0];
        $chemin_fichier='../../' . $__valeurs['T1.chp_dossier_cible'] . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
        $texte_source=$data[__entree]['source'];
        $alea1=texte_aleatoire(10);
        
        if(strpos($texte_source,$alea1) !== false){

            $data[__xst]=false;
            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' KO');
            return;

        }else{

            
            if(strtoupper(substr(PHP_OS,0,3)) === 'WIN'){

                /*
                  Les zones textarea ne contiennent que des \n pour terminer une ligne
                  mais windows impose \r\n
                */
                $CHAINE_CR=$alea1 . 'CR' . $alea1;
                $CHAINE_LF=$alea1 . 'LF' . $alea1;
                
                if(strpos($texte_source,"\n") !== false && strpos($texte_source,"\r") !== false){

                    /*
                      si il y a des \r et de \n
                    */
                    $texte_source=str_replace("\n",$CHAINE_LF,$texte_source);
                    $texte_source=str_replace("\r",'',$texte_source);
                    $texte_source=str_replace($CHAINE_LF,"\r\n",$texte_source);

                }else if(strpos($texte_source,"\n") === false && strpos($texte_source,"\r") !== false){

                    $texte_source=str_replace("\r","\r\n",$texte_source);

                }else if(strpos($texte_source,"\n") !== false && strpos($texte_source,"\r") === false){

                    $texte_source=str_replace("\n","\r\n",$texte_source);

                }else if(strpos($texte_source,"\n") === false && strpos($texte_source,"\r") === false){

                    /* on ne remplace rien */
                }


            }

        }

        
        if($fd=fopen($chemin_fichier,'w')){

            fwrite($fd,$texte_source);
            fclose($fd);
            $data[__xst]=__xsu;
            $data[__entree]['parametres_sauvegarde']=array(
                'id_cible' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible'],
                'chp_provenance_rev' => 'source',
                'chx_source_rev' => $data[__entree]['id_source'],
                'matrice' => $data[__entree]['matrice'],
                'nom_du_source' => $__valeurs['T0.chp_nom_source'],
                'dossier_du_source' => $__valeurs['T2.chp_nom_dossier'],
                'dossier_cible_du_source' => $__valeurs['T1.chp_dossier_cible']
            );
            require_once(realpath(INCLUDE_PATH . '/ajax/core/bdd.php'));
            sauvegarder_format_rev_en_dbb($data);

        }


    }


}
/*
  =====================================================================================================================
*/
function charger_un_fichier_source_par_son_identifiant(&$data){

    
    if(isset($data[__entree]['id_source'])){

        sql_inclure_reference(62);
        /*sql_inclure_deb*/
        require_once(INCLUDE_PATH.'/sql/sql_62.php');
        /*
        SELECT 
        `T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , 
        `T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , 
        `T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`
         FROM b1.tbl_sources T0
         LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source
        
         LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source
        
        WHERE (`T0`.`chi_id_source` = :T0_chi_id_source
          
         AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);

        */
        /*sql_inclure_fin*/
        
        $tt=sql_62(array(/**/
            'T0_chi_id_source' => $data[__entree]['id_source'],
            'T0_chx_cible_id_source' => $_SESSION[APP_KEY]['cible_courante']['chi_id_cible']
        ));
        
        if($tt[__xst] === __xer || count($tt[__xva]) !== 1){

            $data[__xst]=false;
            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' KO');
            return;

        }

        $__valeurs=$tt[__xva][0];
        $chemin_fichier='../../' . $__valeurs['T1.chp_dossier_cible'] . $__valeurs['T2.chp_nom_dossier'] . '/' . $__valeurs['T0.chp_nom_source'];
        
        if(is_file($chemin_fichier)){

            $contenu_du_fichier=file_get_contents($chemin_fichier);
            
            if($contenu_du_fichier !== false){

                $data['contenu_du_fichier']=$contenu_du_fichier;
                $data['db']=$__valeurs;
                $data[__xst]=__xsu;

            }


        }else{

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' fichier introuvable ' . $chemin_fichier);
        }


    }else{

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' champ id_source introuvable');
    }


}
/*
  =====================================================================================================================
*/
function supprimer_un_fichier_avec_un_nom_encrypte(&$data){

    
    if(isset($data[__entree]['file_name'])){

        $nomFichierDecripte=decrypter($data[__entree]['file_name']);
        
        if(sauvegarder_et_supprimer_fichier($nomFichierDecripte)){

            $data[__xst]=__xsu;

        }else{

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' la copie du fichier dans le répertoire de sauvegarde est impossible');
        }


    }else{

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' $data[\'input\'][\'file_name\'] non trouvé');
    }


}
/*
  =====================================================================================================================
*/
function charger_un_fichier_avec_un_nom_encrypte(&$data){

    
    if(isset($data[__entree]['file_name'])){

        $nomFichierDecripte=decrypter($data[__entree]['file_name']);
        $taille_en_octets=filesize($nomFichierDecripte);
        
        if($taille_en_octets <= TAILLE_MAXI_SOURCE){

            $contenu=file_get_contents($nomFichierDecripte);
            
            if($contenu === false){

                ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' impossible de lire le fichier');

            }else{

                $data[__xva]=$contenu;
                $data[__xst]=__xsu;
            }


        }else{

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . 'le fichier fait plus de ' . TAILLE_MAXI_SOURCE . ' octets et il ne peut pas être intégré dans une zone de texte');
        }


    }else{

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' $data[\'input\'][\'file_name\'] non trouvé');
    }


}
/*
  =====================================================================================================================
*/
function charger_un_ficher_rev(&$data){

    /* if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}*/
    
    if(strpos($data[__entree]['file_name'],'..') !== false){

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' le fichier n\'a pas pu être ouvert');
        return;

    }

    
    if($data[__entree]['file_name'] != ''){

        $filefullpath=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'rev' . DIRECTORY_SEPARATOR . $data[__entree]['file_name'];
        $contenu=file_get_contents($filefullpath);
        
        if($contenu !== false){

            $data[__xva]=$contenu;
            $data[__xst]=__xsu;

        }else{

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' le fichier n\'a pas pu être lu.');
        }


    }else{

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' nom de fichier manquant');
    }


}
/*
  =====================================================================================================================
*/
function getRevFiles(&$data){

    $data['files']=array();
    $dir=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'rev' . DIRECTORY_SEPARATOR;
    foreach(glob($dir . '*.rev') as $filename){
        $data['files'][]=basename($filename);
    }
    $data[__xst]=__xsu;

}
/*
  =====================================================================================================================
*/
function sauvegarger_un_fichier_rev(&$data){

    /* sleep(2);*/
    /* if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}*/
    
    if(strpos($data[__entree]['file_name'],'..')){

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'chemin avec ".."');
        return;

    }

    
    if(substr($data[__entree]['file_name'],-4) !== '.rev'){

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . ' extension non "rev" ');
        return;

    }

    for( $i=0 ; $i < strlen($data[__entree]['file_name']) ; $i++ ){
        
        $c=substr($data[__entree]['file_name'],$i,1);
        
        if($c == '/' || $c == '\\' || $c == ':' || $c == '*' || $c == '?' || $c == '"' || $c == '<' || $c == '>' || $c == '|'){

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'caractère interdit dans le nom de fichier "' . $c . '"');
            return;

        }else{

            
            if(!(ord($c) >= 32 && ord($c) < 127)){

                ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'caractère interdit dans le nom de fichie "' . $c . '"');
                return;

            }

        }

    }
    $filefullpath=INCLUDE_PATH . DIRECTORY_SEPARATOR . 'rev' . DIRECTORY_SEPARATOR . $data[__entree]['file_name'];
    
    if(is_file($filefullpath)){

        $backupName=BACKUP_PATH . '/' . uniqid() . '_' . $data[__entree]['file_name'];
        copy($filefullpath,$backupName);

    }

    
    if($fd=fopen($filefullpath,'w')){

        
        if(fwrite($fd,$data[__entree]['contenu_du_fichier'])){

            
            if(fclose($fd)){

                ajouterMessage(__xer,BNF . ' ' . __LINE__ . '👍xer fichier sauvegargé sur disque 1 (test)');
                ajouterMessage(__xsu,BNF . ' ' . __LINE__ . '👍xsu fichier sauvegargé sur disque 2 (test)');
                ajouterMessage(__xal,BNF . ' ' . __LINE__ . '👍xal fichier sauvegargé sur disque 3 (test)');
                ajouterMessage(__xif,BNF . ' ' . __LINE__ . '👍xif fichier sauvegargé sur disque 4 (test)');
                $data[__xst]=__xsu;

            }else{

                ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' fichier non fermé');
            }


        }else{

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . '  ecriture impossible du fichier');
        }


    }else{

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ouverture impossible du fichier');
    }


}
/*
  =====================================================================================================================
*/
function ecrire_fichier1(&$data){

    /* sleep(2);*/
    /* if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);} */
    /* if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_SESSION[APP_KEY]='.var_export($_SESSION[APP_KEY],true)."\r\n"); fclose($fd);}*/
    /*#
      if( strpos($data[__entree]['test_pour_provoquer_une_erreur'],'..') !== false){
      }
    */
    
    if((strpos($data[__entree]['file_path'],'..') !== false
           || strpos($data[__entree]['file_name'],'..')
           || strpos($data[__entree]['file_extension'],'..') !== false)
       && 1 !== $_SESSION[APP_KEY]["user"]
    ){

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'ouverture impossible du fichier');

    }else{

        $filefullpath=$data[__entree]['file_path'] . DIRECTORY_SEPARATOR . $data[__entree]['file_name'] . '.' . $data[__entree]['file_extension'];
        
        if(is_file($filefullpath)){

            $backupName=BACKUP_PATH . '/' . uniqid() . '_' . $data[__entree]['file_name'] . '.' . $data[__entree]['file_extension'];
            copy($filefullpath,$backupName);

        }

        
        if($fd=fopen($filefullpath,'w')){

            
            if(fwrite($fd,$data[__entree]['contenu_du_fichier'])){

                
                if(fclose($fd)){

                    $data[__xst]=__xsu;

                }else{

                    ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'fermeture impossible du fichier');
                }


            }else{

                ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'écriture impossible du fichier');
            }


        }else{

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ouverture impossible du fichier');
        }

    }


}
/*
  =====================================================================================================================
*/
function recuperer_un_genere(&$data){

    
    if(strpos($data[__entree]['file_path'],'..') !== false
       || strpos($data[__entree]['file_name'],'..')
       || strpos($data[__entree]['file_extension'],'..') !== false
    ){

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ouverture impossible du fichier');

    }else{

        $filefullpath=$data[__entree]['file_path'] . DIRECTORY_SEPARATOR . $data[__entree]['file_name'] . '.' . $data[__entree]['file_extension'];
        $contenu=@file_get_contents($filefullpath);
        
        if($contenu === false){

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' lecture impossible du fichier');

        }else{

            $data[__xst]=__xsu;
            $data[__xva]=$contenu;
        }

    }


}
/*
  =====================================================================================================================
*/
function concatener_des_fichiers1(&$data){

    /* ancien concatFile */
    /* if($fd=fopen('toto.txt','a')){fwrite($fd,''.date('Y-m-d H:i:s'). ' ' . __LINE__ ."\r\n".'$_FILES='.var_export($_FILES,true)."\r\n".'$_POST='.var_export($_POST,true)."\r\n".'$data='.var_export($data,true)."\r\n"); fclose($fd);}*/
    
    if(strpos($data[__entree]['file_path'],'..') !== false
       || strpos($data[__entree]['file_name'],'..')
       || strpos($data[__entree]['file_extension'],'..') !== false
    ){

        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ouverture impossible du fichier avec ".."');

    }else{

        $filefullpath=$data[__entree]['file_path'] . DIRECTORY_SEPARATOR . $data[__entree]['file_name'] . '.' . $data[__entree]['file_extension'];
        
        if($fd=fopen($filefullpath,'a')){

            $filefullpath2=$data[__entree]['file_path'] . DIRECTORY_SEPARATOR . $data[__entree]['fichierAConcatener'];
            $contenu=file_get_contents($filefullpath2);
            
            if($contenu !== false){

                
                if(fwrite($fd,"\r\n" . $contenu)){

                    
                    if(fclose($fd)){

                        $data[__xst]=__xsu;

                    }else{

                        ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'fermeture impossible du fichier');
                    }


                }else{

                    ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'écriture impossible du fichier');
                }


            }else{

                ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'lecture impossible du fichier');
            }


        }else{

            ajouterMessage(__xer,BNF . ' ' . __LINE__ . ' ' . 'ouverture impossible du fichier');
        }

    }


}