<?php
function sql_1($par){
    $champs0='
      `T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`
    ';
    $sql0='SELECT '.$champs0;
    $from0='
      FROM `'.$GLOBALS[BDD][BDD_1]['nom_bdd'].'`.tbl_utilisateurs T0    ';
    $sql0.=$from0;
    $where0=' WHERE 1=1 '.CRLF;
    $where0.=' AND `T0`.`chp_nom_de_connexion_utilisateur` = '.sq1($par['nom_de_connexion']).''.CRLF;
    $sql0.=$where0;
    $order0='';
    $sql0.=$order0;
    $plage0='
       LIMIT 1 OFFSET 0 ';
    $sql0.=$plage0;
    $donnees0=array();
    //echo __FILE__ . ' ' . __LINE__ . ' $sql0 = <pre>' . var_export( $sql0 , true ) . '</pre>' ; exit(0);
    $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
    if(($stmt0 !== false)){
        $res0=$stmt0->execute();
        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
            $donnees0[]=array(
                'T0.chi_id_utilisateur' => $tab0[0],
                'T0.chp_mot_de_passe_utilisateur' => $tab0[1],
                'T0.chp_parametres_utilisateur' => $tab0[2],
            );
        }
        return array(
           'statut'  => true       ,
           'valeur' => $donnees0   ,
           'sql' => $sql0          ,
           'where0' => $where0     ,
        );
    }else{
        return array(
           'statut'  => false ,
           'message' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),
           'sql' => $sql0,
           'where0' => $where0     ,
        );
    }
}
