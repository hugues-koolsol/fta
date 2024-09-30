aa_js_sql={

"1":"SELECT \n`T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`\n FROM b1.tbl_utilisateurs T0\nWHERE `T0`.`chp_nom_de_connexion_utilisateur` = :nom_de_connexion\nLIMIT 1 OFFSET 0 ;",
"2":"\nUPDATE b1.tbl_utilisateurs SET `chp_nom_de_connexion_utilisateur` = :chp_nom_de_connexion_utilisateur , `chp_mot_de_passe_utilisateur` = :chp_mot_de_passe_utilisateur , `chp_parametres_utilisateur` = :chp_parametres_utilisateur , `chp_commentaire_utilisateur` = :chp_commentaire_utilisateur\nWHERE `chi_id_utilisateur` = :chi_id_utilisateur ;",
"3":"\nINSERT INTO b1.`tbl_utilisateurs`(\n    `chp_nom_de_connexion_utilisateur` , \n    `chp_mot_de_passe_utilisateur`\n) VALUES (\n    :chp_nom_de_connexion_utilisateur , \n    :chp_mot_de_passe_utilisateur\n);",
"4":"\nDELETE FROM b1.tbl_utilisateurs\nWHERE `chi_id_utilisateur` = :chi_id_utilisateur ;",
"5":"\nDELETE FROM b1.tbl_revs\nWHERE (`chx_cible_rev` = :chx_cible_rev AND `chp_provenance_rev` = :chp_provenance_rev AND `chx_source_rev` = :chx_source_rev) ;",
"6":"SELECT \n`T0`.`chi_id_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , \n`T0`.`cht_commentaire_requete`\n FROM b1.tbl_requetes T0\nWHERE (\/*  *\/ `T0`.`chx_cible_requete` = :T0_chx_cible_requete AND `T0`.`chi_id_requete` = :T0_chi_id_requete AND `T0`.`chp_type_requete` LIKE :T0_chp_type_requete AND `T0`.`cht_rev_requete` LIKE :T0_cht_rev_requete) ORDER BY  `T0`.`chi_id_requete` DESC LIMIT :quantitee OFFSET :debut ;",
};