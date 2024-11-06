<?php
/*
https://github.com/acornjs/acorn/tree/master
*/

/*
===================================================================================
Fait un appel à acorn.js pour récupérer l'ast d'un javascript ou d'un module
===================================================================================
*/
function recupererAstDeJs(&$data){

/*
    if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,PHP_EOL.'========================'.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ .PHP_EOL.'$data='.var_export($data,true).PHP_EOL);  fclose($fdtoto); }
*/
 
    $nom_de_repertoire_temporaire=realpath(RACINE_FICHIERS_PROVISOIRES.DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.date('Y/m/d');
    $nom_de_repertoire_temporaire=str_replace('/',DIRECTORY_SEPARATOR,$nom_de_repertoire_temporaire);
    $nom_de_fichier_contenant_le_source=$nom_de_repertoire_temporaire.DIRECTORY_SEPARATOR.uniqid().'.txt';
    $nom_de_fichier_contenant_l_ast=$nom_de_repertoire_temporaire.DIRECTORY_SEPARATOR.uniqid().'.txt';
    $nom_de_fichier_console=$nom_de_repertoire_temporaire.DIRECTORY_SEPARATOR.uniqid().'.txt';
    $nom_de_fichier_commentaires=$nom_de_repertoire_temporaire.DIRECTORY_SEPARATOR.uniqid().'.txt';
    
    
    
    if(is_dir($nom_de_repertoire_temporaire)){
    }else{
        if(!mkdir($nom_de_repertoire_temporaire,0777,true)){
         
            $data[__xms][]=basename(__FILE__) . __LINE__ .' le répertoire "'.$nom_de_repertoire_temporaire.'" n\'a pas pu être créé';
            return;
            
        }
    }
    
    if($fd=fopen($nom_de_fichier_contenant_le_source,'w')){
        if(!fwrite($fd,$data['input']['texteSource'])){
               $data[__xms][]=basename(__FILE__) . __LINE__ .' ecriture impossible ';
               fclose($fd);
               return;
        }
        fclose($fd);
    }else{
        $data[__xms][]=basename(__FILE__) . __LINE__ .' ouverture du fichier impossible ';
        fclose($fd);
        return;
    }
    /**
    if(false && $data['input']['type_de_source']==='script'){
        $chemin_du_script_node=realpath(dirname(__FILE__,3).DIRECTORY_SEPARATOR.'jslib'.DIRECTORY_SEPARATOR.'convertir_un_script.js');
    }else if(true || $data['input']['type_de_source']==='module'){
        $chemin_du_script_node=realpath(dirname(__FILE__,3).DIRECTORY_SEPARATOR.'jslib'.DIRECTORY_SEPARATOR.'convertir_un_module.js');
    }else{
        sauvegarder_et_supprimer_fichier($nom_de_fichier_contenant_le_source,true);
        $data[__xms][]=basename(__FILE__) . __LINE__ .' seuls les modules et les scripts peuvent être convertis';
        return;
    }
    Code ci dessus supprimé car on n'utilise qu'un seul programme qui convertit aussi bien les modules que les javascript
    */
    $chemin_du_script_node=realpath(dirname(__FILE__,3).DIRECTORY_SEPARATOR.'jslib'.DIRECTORY_SEPARATOR.'convertir_un_module.js');
    $commande_a_passer='node '.$chemin_du_script_node.' '.$nom_de_fichier_contenant_le_source.' '.$nom_de_fichier_contenant_l_ast . ' ' . $nom_de_fichier_commentaires . ' 2>'.$nom_de_fichier_console;
    $resultat = exec($commande_a_passer);
    $data['chemin_du_script_node']=$chemin_du_script_node;
    if(!is_file($nom_de_fichier_contenant_l_ast)){
        if(is_file($nom_de_fichier_console)){
            $data['fichier_erreur']=@file_get_contents($nom_de_fichier_console);;     
            $data[__xms][]=basename(__FILE__) . __LINE__ .' erreur de conversion, $commande_a_passer='.$commande_a_passer;     
        }else{
            $data[__xms][]=basename(__FILE__) . __LINE__ .' erreur de conversion, $commande_a_passer='.$commande_a_passer;     
        }
    }else{
        $ast_texte=@file_get_contents($nom_de_fichier_contenant_l_ast);
        if($ast_texte===false){
            $data[__xms][]=basename(__FILE__) . __LINE__ .' erreur sur file_get_contents';     
        }else{
            $data['commentaires']=@file_get_contents($nom_de_fichier_commentaires);
            $data[__xva]=$ast_texte;
            $data[__xst]=true;
        }
    }
    sauvegarder_et_supprimer_fichier($nom_de_fichier_contenant_le_source,true);
    sauvegarder_et_supprimer_fichier($nom_de_fichier_contenant_l_ast,true);
    sauvegarder_et_supprimer_fichier($nom_de_fichier_console,true);
    sauvegarder_et_supprimer_fichier($nom_de_fichier_commentaires,true);
    return;
}
