<?php
/*
https://github.com/acornjs/acorn/tree/master
*/

/*
===================================================================================
Fait un appel à acorn.js pour récupérer l'ast d'un javascript ou d'un module
===================================================================================
*/
function traiter_des_morceaux_de_js_dans_un_rev1(&$data){
/*
    if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,PHP_EOL.'========================'.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ .PHP_EOL.'$data='.var_export($data,true).PHP_EOL);  fclose($fdtoto); }

$data=array (
  '__xst' => false,'__xms' => array (),
  '__entree' => array (
    'call' => array ('lib' => 'js','file' => 'rev_html_avec_js1','funct' => 'traiter_des_morceaux_de_js_dans_un_rev1', ),
    'options' => array ( 'zone_html_rev' => 'txtar2', 'zone_html_resultat' => 'txtar3',  'zone_source' => 'txtar1' ),
    'format_rev' => 
      'html((doctype)
         head(
            link((\'rel\',"stylesheet"),(\'as\',"style"),(\'type\',"text/css"),(\'href\',"fta_www/6.css"))
         ),
         body(
            #( redirection vers la page d\'accueil ),
            h1(\'racine de l\\\'application\'
            ),
            javascriptDansHtml(
            #(cle_javascript_a_remplacer,_AhpmgSM3jd)
      declare(a , 1))
         )
      )',
    'tableau_de_javascripts_a_convertir' => 
    array (
              0 => 
              array (
                'type' => 'javascriptdanshtml',
                '__xva' => '
        //<source_javascript_rev>
        var a=1;
        //</source_javascript_rev>
        //',
                'cas' => 'js1',
                'cle' => '_AhpmgSM3jd',
              ),
    ),
  ),
)



*/    
    $data[__xst]=true;
    
    foreach($data[__entree]['tableau_de_javascripts_a_convertir'] as $k1=>$v1){
      $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xms]=array();
/*     
      if($fdtoto=fopen('toto.txt','a')){fwrite($fdtoto,PHP_EOL.'========================'.PHP_EOL.date('Y-m-d H:i:s'). ' ' . __LINE__ .PHP_EOL.'$v1='.var_export($v1,true).PHP_EOL);  fclose($fdtoto); }
      $v1=array (
        'type' => 'javascriptdanshtml',
        '__xva' => '
                     //<source_javascript_rev>
                     var a=1;
                     //</source_javascript_rev>
                     //'
                     ,
        'cas' => 'js1',
        'cle' => '_4TXF8yGZya',
      )
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
             
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xms][]=basename(__FILE__) . __LINE__ .' le répertoire "'.$nom_de_repertoire_temporaire.'" n\'a pas pu être créé';
                return;
                
            }
        }
        
        if($fd=fopen($nom_de_fichier_contenant_le_source,'w')){
            if(!fwrite($fd,$v1[__xva])){
                   $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xms][]=basename(__FILE__) . __LINE__ .' ecriture impossible ';
                   fclose($fd);
                   return;
            }
            fclose($fd);
        }else{
            $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xms][]=basename(__FILE__) . __LINE__ .' ouverture du fichier impossible ';
            fclose($fd);
            return;
        }
        $chemin_du_script_node=realpath(dirname(__FILE__,3).DIRECTORY_SEPARATOR.'jslib'.DIRECTORY_SEPARATOR.'convertir_un_module.js');
        $commande_a_passer='node '.$chemin_du_script_node.' '.$nom_de_fichier_contenant_le_source.' '.$nom_de_fichier_contenant_l_ast . ' ' . $nom_de_fichier_commentaires . ' 2>'.$nom_de_fichier_console;
        $resultat = exec($commande_a_passer);

        if(!is_file($nom_de_fichier_contenant_l_ast)){
            if(is_file($nom_de_fichier_console)){
//                $data['fichier_erreur']=@file_get_contents($nom_de_fichier_console);     
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1]['fichier_erreur']=@file_get_contents($nom_de_fichier_console);
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xms][]=basename(__FILE__) . __LINE__ .' erreur de conversion, $commande_a_passer='.$commande_a_passer;     
            }else{
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xms][]=basename(__FILE__) . __LINE__ .' erreur de conversion, $commande_a_passer='.$commande_a_passer;     
            }
        }else{
            $ast_texte=@file_get_contents($nom_de_fichier_contenant_l_ast);
            if($ast_texte===false){
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xms][]=basename(__FILE__) . __LINE__ .' erreur sur file_get_contents';     
            }else{
                /*
                $data['commentaires']=@file_get_contents($nom_de_fichier_commentaires);
                $data[__xva]=$ast_texte;
                */
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1]['commentaires']=@file_get_contents($nom_de_fichier_commentaires);
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1]['ast']=$ast_texte;
                $data[__entree]['tableau_de_javascripts_a_convertir'][$k1][__xst]=true;
            }
        }

        sauvegarder_et_supprimer_fichier($nom_de_fichier_contenant_le_source,true);
        sauvegarder_et_supprimer_fichier($nom_de_fichier_contenant_l_ast,true);
        sauvegarder_et_supprimer_fichier($nom_de_fichier_console,true);
        sauvegarder_et_supprimer_fichier($nom_de_fichier_commentaires,true);

        $resultat=null;



      
    }
/*    
*/    
    return;
}
