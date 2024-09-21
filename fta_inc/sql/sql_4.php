<?php
function sql_4($par){
    $texte_sql_4='
      
      DELETE FROM `'.$GLOBALS[BDD][BDD_b1]['nom_bdd'].'`.tbl_utilisateurs
          WHERE `chi_id_utilisateur` = '.sq1($par['chi_id_utilisateur']).' ;
    ';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_4)){
        return(array( 'statut' => false, 'code_erreur' => $GLOBALS[BDD][BDD_b1][LIEN_BDD]->lastErrorCode() ,'message' => 'erreur sql_4()'.' '.$GLOBALS[BDD][BDD_b1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( 'statut' => true, 'changements' => $GLOBALS[BDD][BDD_b1][LIEN_BDD]->changes()));
    }
}
