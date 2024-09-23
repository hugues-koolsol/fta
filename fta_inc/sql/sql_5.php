<?php
function sql_5($par){
    $texte_sql_5='
      
      DELETE FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_revs
          WHERE (`chx_cible_rev` = '.sq1($par['chx_cible_rev']).' AND `chp_provenance_rev` = '.sq1($par['chp_provenance_rev']).' AND `chx_source_rev` = '.sq1($par['chx_source_rev']).') ;
    ';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_5)){
        return(array( 'statut' => false, 'code_erreur' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,'message' => 'erreur sql_5()'.' '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( 'statut' => true, 'changements' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
