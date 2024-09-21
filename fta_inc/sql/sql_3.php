<?php
function sql_3($par){
    $texte_sql_3='
      INSERT INTO `'.$GLOBALS[BDD][BDD_b1]['nom_bdd'].'`.`tbl_utilisateurs`(
         `chp_nom_de_connexion_utilisateur` , 
         `chp_mot_de_passe_utilisateur`
      ) VALUES 
    ';
    $liste_des_valeurs='';
    for($i=0;($i < count($par['groupes']));$i++){
        if($liste_des_valeurs != ''){
            $liste_des_valeurs.=',';
        }
        $liste_des_valeurs.='(';
        $liste_des_valeurs.=CRLF.'      '.sq1($par['groupes'][$i]['chp_nom_de_connexion_utilisateur']).',';
        $liste_des_valeurs.=CRLF.'      '.sq1($par['groupes'][$i]['chp_mot_de_passe_utilisateur']).'';
        $liste_des_valeurs.=')';
    }
    $texte_sql_3.=$liste_des_valeurs;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_3)){
        return(array( 'statut' => false, 'code_erreur' => $GLOBALS[BDD][BDD_b1][LIEN_BDD]->lastErrorCode(), 'message' => 'erreur sql_3()'.' '.$GLOBALS[BDD][BDD_b1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( 'statut' => true, 'changements' => $GLOBALS[BDD][BDD_b1][LIEN_BDD]->changes()));
    }
}
