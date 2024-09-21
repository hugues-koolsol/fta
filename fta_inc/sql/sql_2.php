<?php
function sql_2($par){
    $texte_sql_2='
      
      UPDATE `'.$GLOBALS[BDD][BDD_b1]['nom_bdd'].'`.tbl_utilisateurs SET 
            `chp_nom_de_connexion_utilisateur` = '.sq1($par['chp_nom_de_connexion_utilisateur']).' , 
            `chp_mot_de_passe_utilisateur` = '.sq1($par['chp_mot_de_passe_utilisateur']).' , 
            `chp_parametres_utilisateur` = '.sq1($par['chp_parametres_utilisateur']).' , 
            `chp_commentaire_utilisateur` = '.sq1($par['chp_commentaire_utilisateur']).'
          WHERE `chi_id_utilisateur` = '.sq1($par['chi_id_utilisateur']).' ;
    ';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_2)){
        return(array( 'statut' => false, 'code_erreur' => $GLOBALS[BDD][BDD_b1][LIEN_BDD]->lastErrorCode() ,'message' => 'erreur sql_2()'.' '.$GLOBALS[BDD][BDD_b1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( 'statut' => true, 'changements' => $GLOBALS[BDD][BDD_b1][LIEN_BDD]->changes()));
    }
}
