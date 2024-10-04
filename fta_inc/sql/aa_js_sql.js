aa_js_sql={

"1":"SELECT \n`T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`\n FROM b1.tbl_utilisateurs T0\nWHERE `T0`.`chp_nom_de_connexion_utilisateur` = :nom_de_connexion LIMIT 1 OFFSET 0 ;",
"2":"SELECT \n`T0`.`chi_id_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , \n`T0`.`cht_commentaire_requete`\n FROM b1.tbl_requetes T0\nWHERE (\/*  *\/ `T0`.`chx_cible_requete` = :T0_chx_cible_requete AND `T0`.`chi_id_requete` = :T0_chi_id_requete AND `T0`.`chp_type_requete` LIKE :T0_chp_type_requete AND `T0`.`cht_rev_requete` LIKE :T0_cht_rev_requete) ORDER BY  `T0`.`chi_id_requete` DESC LIMIT :quantitee OFFSET :debut ;",
"3":"\nUPDATE b1.tbl_requetes SET `chi_id_requete` = :n_chi_id_requete\nWHERE (`chi_id_requete` = :c_chi_id_requete) ;",
"4":"\nDELETE FROM b1.tbl_requetes\nWHERE (`chi_id_requete` = :chi_id_requete AND `chx_cible_requete` = :chx_cible_requete) ;",
"5":"\nDELETE FROM b1.tbl_revs\nWHERE (`chx_cible_rev` = :chx_cible_rev AND `chp_provenance_rev` = :chp_provenance_rev AND `chx_source_rev` = :chx_source_rev) ;",
"6":"SELECT \n`T0`.`chi_id_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete`\n FROM b1.tbl_requetes T0 ORDER BY  `T0`.`chi_id_requete`  ASC;",
"7":"\nINSERT INTO b1.`tbl_requetes`(\n    `chx_cible_requete` , \n    `chp_type_requete` , \n    `cht_rev_requete` , \n    `cht_sql_requete` , \n    `cht_php_requete`\n) VALUES (\n    :chx_cible_requete , \n    :chp_type_requete , \n    :cht_rev_requete , \n    :cht_sql_requete , \n    :cht_php_requete\n);",
"8":"\nUPDATE b1.tbl_revs SET `chx_source_rev` = :n_chx_source_rev\nWHERE (`chx_cible_rev` = :c_chx_cible_rev AND `chp_provenance_rev` = :c_chp_provenance_rev AND `chx_source_rev` = :c_chx_source_rev) ;",
"9":"\nUPDATE b1.tbl_requetes SET `chp_type_requete` = :n_chp_type_requete , `cht_rev_requete` = :n_cht_rev_requete , `cht_sql_requete` = :n_cht_sql_requete , `cht_php_requete` = :n_cht_php_requete\nWHERE (`chi_id_requete` = :c_chi_id_requete AND `chx_cible_requete` = :c_chx_cible_requete) ;",
};