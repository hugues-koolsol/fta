<?php
function sql_1($par){
    $texte_sql_1='
      SELECT 
      `T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`
       FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_utilisateurs T0
      WHERE `T0`.`chp_nom_de_connexion_utilisateur` = '.sq1($par['nom_de_connexion']).'
      LIMIT 1 OFFSET 0 ;
    ';
    $stmt=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($texte_sql_1);
    /* echo __FILE__ . ' ' . __LINE__ . ' $texte_sql_1 = <pre>' . $texte_sql_1 . '</pre>' ; exit(0); */
    if($stmt !== false){
        $result=$stmt->execute();
        $donnees=array();
        $arr=$result->fetchArray(SQLITE3_ASSOC);
        while(($arr !== false)){
            $donnees[]=$arr;
            $arr=$result->fetchArray(SQLITE3_ASSOC);
        }
        $stmt->close();
        return(array( 'statut' => true, 'valeur' => $donnees));
    }else{
        return(array( 'statut' => false, 'message' => 'erreur sql_1()'.' '.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }
}
