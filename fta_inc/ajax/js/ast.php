<?php
/*

https://github.com/acornjs/acorn/tree/master
*/

$a=realpath(dirname(dirname(dirname(__FILE__))));
/*
===================================================================================
Fait un appel à acorn.js pour récupérer l'ast d'un javascript ou d'un module
===================================================================================
*/
function recupererAstDeJs(&$data){
 
    $nom_de_repertoire_temporaire=realpath(dirname(dirname(dirname(dirname(__FILE__))))).DIRECTORY_SEPARATOR.PREFIXE_REPERTOIRES.'_temp/'.date('Y/m/d');
    $nom_de_fichier_temporaire1=$nom_de_repertoire_temporaire.DIRECTORY_SEPARATOR.uniqid().'.txt';
    $nom_de_fichier_temporaire2=$nom_de_repertoire_temporaire.DIRECTORY_SEPARATOR.uniqid().'.txt';
    
    if(is_dir($nom_de_repertoire_temporaire)){
    }else{
        if(mkdir($nom_de_repertoire_temporaire,0777,true)){
         
            $data['messages'][]=basename(__FILE__) . __LINE__ .' le répertoire "'.$nom_de_repertoire_temporaire.'" n\'a pas pu être créé';
            return;
            
        }
    }
    
    if($fd=fopen($nom_de_fichier_temporaire1,'w')){
        if(!fwrite($fd,$data['input']['texteSource'])){
               $data['messages'][]=basename(__FILE__) . __LINE__ .' ecriture impossible ';
               fclose($fd);
               return;
        }
        fclose($fd);
    }
    if($data['input']['type_de_source']==='script'){
      $chemin_du_script_node=realpath(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'jslib'.DIRECTORY_SEPARATOR.'convertir_un_script.js');
      $resultat = exec('node '.$chemin_du_script_node.' '.$nom_de_fichier_temporaire1.' '.$nom_de_fichier_temporaire2);
    }else if($data['input']['type_de_source']==='module'){
      $chemin_du_script_node=realpath(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'jslib'.DIRECTORY_SEPARATOR.'convertir_un_module.js');
      $resultat = exec('node '.$chemin_du_script_node.' '.$nom_de_fichier_temporaire1.' '.$nom_de_fichier_temporaire2);
    }else{
        $data['messages'][]=basename(__FILE__) . __LINE__ .' seuls les modules et les scripts peuvent être convertis';
    }
    $data['nom_de_fichier_temporaire1']=$nom_de_fichier_temporaire1;
    $data['nom_de_fichier_temporaire2']=$nom_de_fichier_temporaire2;
    $data['chemin_du_script_node']=$chemin_du_script_node;
    $ast_texte=file_get_contents($nom_de_fichier_temporaire2);
    if($ast_texte===false){
    }else{
      $data['value']=$ast_texte;
      $data['status']='OK';
    }
    sauvegarder_et_supprimer_fichier($nom_de_fichier_temporaire1,true);
    sauvegarder_et_supprimer_fichier($nom_de_fichier_temporaire2,true);
    return;
}
