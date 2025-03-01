//<![CDATA[
__aa_js_sql={

"1":"SELECT \n`T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`\n FROM b1.tbl_utilisateurs T0\nWHERE `T0`.`chp_nom_de_connexion_utilisateur` = :nom_de_connexion  \nLIMIT 1 OFFSET 0 ;",
"2":"SELECT \n`T0`.`chi_id_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , \n`T0`.`cht_commentaire_requete`\n FROM b1.tbl_requetes T0\nWHERE (`T0`.`chx_cible_requete` = :T0_chx_cible_requete\n   AND `T0`.`chi_id_requete` = :T0_chi_id_requete\n   AND `T0`.`chp_type_requete` LIKE :T0_chp_type_requete\n   AND `T0`.`cht_rev_requete` LIKE :T0_cht_rev_requete) \nORDER BY `T0`.`chi_id_requete` DESC  \nLIMIT :quantitee OFFSET :debut ;",
"3":"UPDATE b1.tbl_requetes SET `chi_id_requete` = :n_chi_id_requete\nWHERE (`chi_id_requete` = :c_chi_id_requete\n   AND `chx_cible_requete` = :c_chx_cible_requete) ;",
"4":"DELETE FROM b1.tbl_requetes\nWHERE (`chi_id_requete` = :chi_id_requete\n   AND `chx_cible_requete` = :chx_cible_requete) ;",
"5":"DELETE FROM b1.tbl_revs\nWHERE (`chx_cible_rev` = :chx_cible_rev\n   AND `chp_provenance_rev` = :chp_provenance_rev\n   AND `chx_source_rev` = :chx_source_rev) ;",
"6":"SELECT \n`T0`.`chi_id_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , `T0`.`cht_matrice_requete`\n FROM b1.tbl_requetes T0\nWHERE (`T0`.`chx_cible_requete` = :T0_chx_cible_requete) \nORDER BY `T0`.`chi_id_requete` ASC;",
"7":"INSERT INTO b1.`tbl_requetes`(\n    `chx_cible_requete` , \n    `chp_type_requete` , \n    `cht_rev_requete` , \n    `cht_sql_requete` , \n    `cht_php_requete` , \n    `cht_commentaire_requete`\n) VALUES (\n    :chx_cible_requete , \n    :chp_type_requete , \n    :cht_rev_requete , \n    :cht_sql_requete , \n    :cht_php_requete , \n    :cht_commentaire_requete\n);",
"8":"UPDATE b1.tbl_revs SET `chx_source_rev` = :n_chx_source_rev\nWHERE (`chx_cible_rev` = :c_chx_cible_rev\n   AND `chp_provenance_rev` = :c_chp_provenance_rev\n   AND `chx_source_rev` = :c_chx_source_rev) ;",
"9":"UPDATE b1.tbl_requetes SET `chp_type_requete` = :n_chp_type_requete , `cht_rev_requete` = :n_cht_rev_requete , `cht_sql_requete` = :n_cht_sql_requete , `cht_php_requete` = :n_cht_php_requete , `cht_matrice_requete` = :n_cht_matrice_requete , `cht_commentaire_requete` = :n_cht_commentaire_requete\nWHERE (`chi_id_requete` = :c_chi_id_requete\n   AND `chx_cible_requete` = :c_chx_cible_requete) ;",
"10":"UPDATE b1.tbl_bdds SET `chp_rev_travail_basedd` = :n_chp_rev_travail_basedd\nWHERE (`chi_id_basedd` = :c_chi_id_basedd\n   AND `chx_cible_id_basedd` = :c_chx_cible_id_basedd) ;",
"11":"SELECT \n`T0`.`chi_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_travail_basedd`\n FROM b1.tbl_bdds T0\nWHERE ( \/* *\/ `T0`.`chi_id_basedd` IN (:les_id_des_bases)\n   AND `T0`.`chx_cible_id_basedd` = :chx_cible_id_basedd);",
"12":"INSERT INTO b1.`tbl_revs`(\n    `chx_cible_rev` , \n    `chp_provenance_rev` , \n    `chx_source_rev` , \n    `chp_id_rev` , \n    `chp_valeur_rev` , \n    `chp_type_rev` , \n    `chp_niveau_rev` , \n    `chp_quotee_rev` , \n    `chp_pos_premier_rev` , \n    `chp_pos_dernier_rev` , \n    `chp_parent_rev` , \n    `chp_nbr_enfants_rev` , \n    `chp_num_enfant_rev` , \n    `chp_profondeur_rev` , \n    `chp_pos_ouver_parenthese_rev` , \n    `chp_pos_fermer_parenthese_rev` , \n    `chp_commentaire_rev`\n) VALUES (\n    :chx_cible_rev , \n    :chp_provenance_rev , \n    :chx_source_rev , \n    :chp_id_rev , \n    :chp_valeur_rev , \n    :chp_type_rev , \n    :chp_niveau_rev , \n    :chp_quotee_rev , \n    :chp_pos_premier_rev , \n    :chp_pos_dernier_rev , \n    :chp_parent_rev , \n    :chp_nbr_enfants_rev , \n    :chp_num_enfant_rev , \n    :chp_profondeur_rev , \n    :chp_pos_ouver_parenthese_rev , \n    :chp_pos_fermer_parenthese_rev , \n    :chp_commentaire_rev\n);",
"13":"SELECT \n`T0`.`chi_id_rev` , `T0`.`chp_provenance_rev` , `T0`.`chx_source_rev` , `T1`.`chp_nom_source` , `T0`.`chp_valeur_rev` , \n`T0`.`chp_type_rev` , `T0`.`chp_niveau_rev` , `T0`.`chp_pos_premier_rev` , `T0`.`chp_commentaire_rev` , `T2`.`chp_type_requete`\n FROM b1.tbl_revs T0\n LEFT JOIN b1.tbl_sources T1 ON T1.chi_id_source = T0.chx_source_rev\n\n LEFT JOIN b1.tbl_requetes T2 ON T2.chi_id_requete = T0.chx_source_rev\n\nWHERE (`T0`.`chx_cible_rev` = :T0_chx_cible_rev\n   AND `T0`.`chp_provenance_rev` LIKE :T0_chp_provenance_rev\n   AND `T0`.`chx_source_rev` = :T0_chx_source_rev\n   AND `T1`.`chp_nom_source` LIKE :T1_chp_nom_source1\n   AND `T1`.`chp_nom_source` NOT LIKE :T1_chp_nom_source2\n   AND `T0`.`chp_valeur_rev` LIKE :T0_chp_valeur_rev\n   AND `T0`.`chp_commentaire_rev` LIKE :T0_chp_commentaire_rev\n   AND `T0`.`chi_id_rev` = :T0_chi_id_rev) \nORDER BY `T0`.`chp_provenance_rev` ASC, `T0`.`chx_source_rev` ASC  \nLIMIT :quantitee OFFSET :debut ;",
"14":"DELETE FROM b1.tbl_revs\nWHERE `chx_cible_rev` = :chx_cible_rev ;",
"15":"SELECT \n`T0`.`chi_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_commentaire_basedd`\n FROM b1.tbl_bdds T0\nWHERE ( \/* *\/ `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd\n   AND `T0`.`chi_id_basedd` = :T0_chi_id_basedd\n   AND `T0`.`chp_nom_basedd` LIKE :T0_chp_nom_basedd) \nORDER BY `T0`.`chi_id_basedd` ASC  \nLIMIT :quantitee OFFSET :debut ;",
"16":"UPDATE b1.tbl_bdds SET `chx_dossier_id_basedd` = :n_chx_dossier_id_basedd , `chp_nom_basedd` = :n_chp_nom_basedd , `chp_rev_basedd` = :n_chp_rev_basedd , `chp_commentaire_basedd` = :n_chp_commentaire_basedd , `chp_genere_basedd` = :n_chp_genere_basedd , `chp_rev_travail_basedd` = :n_chp_rev_travail_basedd , `chp_fournisseur_basedd` = :n_chp_fournisseur_basedd\nWHERE (`chi_id_basedd` = :c_chi_id_basedd\n   AND `chx_cible_id_basedd` = :c_chx_cible_id_basedd) ;",
"17":"INSERT INTO b1.`tbl_bdds`(\n    `chx_dossier_id_basedd` , \n    `chx_cible_id_basedd` , \n    `chp_nom_basedd` , \n    `chp_commentaire_basedd` , \n    `chp_fournisseur_basedd`\n) VALUES (\n    :chx_dossier_id_basedd , \n    :chx_cible_id_basedd , \n    :chp_nom_basedd , \n    :chp_commentaire_basedd , \n    :chp_fournisseur_basedd\n);",
"18":"DELETE FROM b1.tbl_bdds\nWHERE (`chi_id_basedd` = :chi_id_basedd\n   AND `chx_cible_id_basedd` = :chx_cible_id_basedd) ;",
"19":"SELECT \n`T0`.`chi_id_tache` , `T0`.`chp_texte_tache` , `T0`.`chp_priorite_tache`\n FROM b1.tbl_taches T0\nWHERE ( \/* *\/ `T0`.`chx_utilisateur_tache` = :T0_chx_utilisateur_tache\n   AND `T0`.`chi_id_tache` = :T0_chi_id_tache\n   AND `T0`.`chp_texte_tache` LIKE :T0_chp_texte_tache\n   AND `T0`.`chp_priorite_tache` = :T0_chp_priorite_tache\n   AND `T0`.`chp_priorite_tache` < :T0_chp_priorite_tache2) \nORDER BY `T0`.`chp_priorite_tache` ASC  \nLIMIT :quantitee OFFSET :debut ;",
"20":"UPDATE b1.tbl_taches SET `chp_priorite_tache` = (chp_priorite_tache-1)\nWHERE (`chi_id_tache` = :c_chi_id_tache\n   AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache\n   AND `chp_priorite_tache` >= 1) ;",
"21":"UPDATE b1.tbl_taches SET `chp_priorite_tache` = (chp_priorite_tache+1)\nWHERE (`chi_id_tache` = :c_chi_id_tache\n   AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache\n   AND `chp_priorite_tache` < 50) ;",
"22":"UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache\nWHERE (`chi_id_tache` = :c_chi_id_tache\n   AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache) ;",
"23":"UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache\nWHERE ((chp_priorite_tache IS NULL OR chp_priorite_tache = '')\n   AND chx_utilisateur_tache = :c_chx_utilisateur_tache) ;",
"24":"UPDATE b1.tbl_taches SET `chp_priorite_tache` = (chp_priorite_tache+1)\nWHERE (`chx_utilisateur_tache` = :c_chx_utilisateur_tache\n   AND `chp_priorite_tache` < 50) ;",
"25":"UPDATE b1.tbl_taches SET `chp_priorite_tache` = (chp_priorite_tache-1)\nWHERE (`chx_utilisateur_tache` = :c_chx_utilisateur_tache\n   AND `chp_priorite_tache` < 50\n   AND `chp_priorite_tache` > 0) ;",
"26":"SELECT \n`T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , \n`T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , \n`T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , \n`T2`.`chp_commentaire_cible`\n FROM b1.tbl_bdds T0\n LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd\n\n LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd\n\nWHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd\n   AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);",
"27":"SELECT \n`T0`.`chi_id_basedd` , `T0`.`chx_dossier_id_basedd` , `T0`.`chx_cible_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_rev_basedd` , \n`T0`.`chp_commentaire_basedd` , `T0`.`chp_genere_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_fournisseur_basedd` , `T1`.`chi_id_dossier` , \n`T1`.`chx_cible_dossier` , `T1`.`chp_nom_dossier` , `T2`.`chi_id_cible` , `T2`.`chp_nom_cible` , `T2`.`chp_dossier_cible` , \n`T2`.`chp_commentaire_cible`\n FROM b1.tbl_bdds T0\n LEFT JOIN b1.tbl_dossiers T1 ON T1.chi_id_dossier = T0.chx_dossier_id_basedd\n\n LEFT JOIN b1.tbl_cibles T2 ON T2.chi_id_cible = T0.chx_cible_id_basedd\n\nWHERE `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd;",
"28":"SELECT \n`T0`.`chi_id_tache` , `T0`.`chx_utilisateur_tache` , `T0`.`chp_texte_tache` , `T0`.`chp_priorite_tache`\n FROM b1.tbl_taches T0\nWHERE (`T0`.`chi_id_tache` = :T0_chi_id_tache\n   AND `T0`.`chx_utilisateur_tache` = :T0_chx_utilisateur_tache);",
"29":"UPDATE b1.tbl_taches SET `chp_texte_tache` = :n_chp_texte_tache , `chp_priorite_tache` = :n_chp_priorite_tache\nWHERE (`chx_utilisateur_tache` = :c_chx_utilisateur_tache\n   AND `chi_id_tache` = :c_chi_id_tache) ;",
"30":"INSERT INTO b1.`tbl_taches`(\n    `chx_utilisateur_tache` , \n    `chp_texte_tache` , \n    `chp_priorite_tache`\n) VALUES (\n    :chx_utilisateur_tache , \n    :chp_texte_tache , \n    :chp_priorite_tache\n);",
"31":"DELETE FROM b1.tbl_taches\nWHERE (`chi_id_tache` = :chi_id_tache\n   AND `chx_utilisateur_tache` = :chx_utilisateur_tache) ;",
"32":"SELECT \n`T0`.`chi_id_requete` , `T0`.`chx_cible_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , \n`T0`.`cht_php_requete` , `T0`.`cht_commentaire_requete` , `T0`.`cht_matrice_requete`\n FROM b1.tbl_requetes T0\nWHERE (`T0`.`chi_id_requete` = :T0_chi_id_requete\n   AND `T0`.`chx_cible_requete` = :T0_chx_cible_requete);",
"33":"SELECT \n`T0`.`chi_id_cible` , `T0`.`chp_nom_cible` , `T0`.`chp_dossier_cible` , `T0`.`chp_commentaire_cible`\n FROM b1.tbl_cibles T0\nWHERE (`T0`.`chi_id_cible` = :T0_chi_id_cible\n   AND `T0`.`chp_nom_cible` LIKE :T0_chp_nom_cible\n   AND `T0`.`chp_dossier_cible` LIKE :T0_chp_dossier_cible\n   AND `T0`.`chp_commentaire_cible` LIKE :T0_chp_commentaire_cible) \nORDER BY `T0`.`chi_id_cible` ASC  \nLIMIT :quantitee OFFSET :debut ;",
"34":"SELECT \n`T0`.`chi_id_cible` , `T0`.`chp_nom_cible` , `T0`.`chp_dossier_cible` , `T0`.`chp_commentaire_cible`\n FROM b1.tbl_cibles T0\nWHERE `T0`.`chi_id_cible` = :T0_chi_id_cible;",
"35":"UPDATE b1.tbl_requetes SET `cht_php_requete` = :n_cht_php_requete\nWHERE (`chi_id_requete` = :c_chi_id_requete\n   AND `chx_cible_requete` = :c_chx_cible_requete) ;",
"36":"INSERT INTO b1.`tbl_cibles`(\n    `chp_nom_cible` , \n    `chp_dossier_cible` , \n    `chp_commentaire_cible`\n) VALUES (\n    :chp_nom_cible , \n    :chp_dossier_cible , \n    :chp_commentaire_cible\n);",
"37":"INSERT INTO b1.`tbl_dossiers`(\n    `chx_cible_dossier` , \n    `chp_nom_dossier`\n) VALUES (\n    :chx_cible_dossier , \n    :chp_nom_dossier\n);",
"38":"    BEGIN TRANSACTION;\n    ",
"39":"DELETE FROM b1.tbl_sources\nWHERE (`chi_id_source` = :chi_id_source\n   AND `chx_cible_id_source` = :chx_cible_id_source) ;",
"40":"    ROLLBACK;",
"41":"DELETE FROM b1.tbl_sources\nWHERE `chx_cible_id_source` = :chx_cible_id_source ;",
"42":"DELETE FROM b1.tbl_requetes\nWHERE (`chx_cible_requete` = :chx_cible_requete) ;",
"43":"DELETE FROM b1.tbl_bdds\nWHERE (`chx_cible_id_basedd` = :chx_cible_id_basedd) ;",
"44":"DELETE FROM b1.tbl_dossiers\nWHERE (`chx_cible_dossier` = :chx_cible_dossier) ;",
"45":"DELETE FROM b1.tbl_cibles\nWHERE (`chi_id_cible` = :chi_id_cible) ;",
"46":"    COMMIT;",
"47":"UPDATE b1.tbl_cibles SET `chp_commentaire_cible` = :n_chp_commentaire_cible\nWHERE `chi_id_cible` = 1 ;",
"48":"UPDATE b1.tbl_cibles SET `chp_nom_cible` = :n_chp_nom_cible , `chp_dossier_cible` = :n_chp_dossier_cible , `chp_commentaire_cible` = :n_chp_commentaire_cible\nWHERE (`chi_id_cible` = :c_chi_id_cible) ;",
"49":"SELECT \ncount( * )\n FROM b1.tbl_bdds T0\nWHERE (`T0`.`chi_id_basedd` = :T0_chi_id_basedd\n   AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);",
"50":"SELECT \n`T0`.`chi_id_dossier` , `T0`.`chx_cible_dossier` , `T0`.`chp_nom_dossier` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , \n`T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible`\n FROM b1.tbl_dossiers T0\n LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_dossier\n\nWHERE (`T0`.`chi_id_dossier` = :T0_chi_id_dossier\n   AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);",
"51":"SELECT \n`T0`.`chi_id_dossier` , `T0`.`chx_cible_dossier` , `T0`.`chp_nom_dossier`\n FROM b1.tbl_dossiers T0\nWHERE (`T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);",
"52":"INSERT  OR IGNORE INTO b1.`tbl_dossiers`(\n    `chx_cible_dossier` , \n    `chp_nom_dossier`\n) VALUES (\n    :chx_cible_dossier , \n    :chp_nom_dossier\n);",
"53":"SELECT \n`T0`.`chi_id_dossier` , `T0`.`chp_nom_dossier`\n FROM b1.tbl_dossiers T0\nWHERE (`T0`.`chi_id_dossier` = :T0_chi_id_dossier\n   AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier\n   AND `T0`.`chp_nom_dossier` LIKE :T0_chp_nom_dossier) \nORDER BY `T0`.`chp_nom_dossier` ASC, `T0`.`chi_id_dossier` DESC  \nLIMIT :quantitee OFFSET :debut ;",
"54":"INSERT INTO b1.`tbl_sources`(\n    `chx_cible_id_source` , \n    `chp_nom_source` , \n    `chp_commentaire_source` , \n    `chx_dossier_id_source` , \n    `chp_rev_source` , \n    `chp_genere_source` , \n    `chp_type_source`\n) VALUES (\n    :chx_cible_id_source , \n    :chp_nom_source , \n    :chp_commentaire_source , \n    :chx_dossier_id_source , \n    :chp_rev_source , \n    :chp_genere_source , \n    :chp_type_source\n);",
"55":"UPDATE b1.tbl_dossiers SET `chx_cible_dossier` = :n_chx_cible_dossier , `chp_nom_dossier` = :n_chp_nom_dossier\nWHERE (`chi_id_dossier` = :c_chi_id_dossier\n   AND `chx_cible_dossier` = :c_chx_cible_dossier) ;",
"56":"SELECT \ncount( * )\n FROM b1.tbl_sources T0\nWHERE (`T0`.`chx_cible_id_source` = :T0_chx_cible_id_source\n   AND `T0`.`chx_dossier_id_source` = :T0_chx_dossier_id_source);",
"57":"SELECT \ncount( * )\n FROM b1.tbl_bdds T0\nWHERE (`T0`.`chx_dossier_id_basedd` = :T0_chx_dossier_id_basedd\n   AND `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd);",
"58":"DELETE FROM b1.tbl_dossiers\nWHERE (`chi_id_dossier` = :chi_id_dossier\n   AND `chx_cible_dossier` = :chx_cible_dossier) ;",
"59":"SELECT \n`T0`.`chp_nom_source` , `T0`.`chi_id_source`\n FROM b1.tbl_sources T0\nWHERE ( \/* *\/ `T0`.`chp_nom_source` IN (:T0_chp_nom_source)\n   AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source\n   AND `T0`.`chx_dossier_id_source` = :T0_chx_dossier_id_source);",
"60":"SELECT \n`T0`.`chp_nom_dossier` , `T0`.`chi_id_dossier`\n FROM b1.tbl_dossiers T0\nWHERE ( \/* *\/ `T0`.`chp_nom_dossier` IN (:T0_chp_nom_dossier)\n   AND `T0`.`chx_cible_dossier` = :T0_chx_cible_dossier);",
"61":"SELECT \n`T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , \n`T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , \n`T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`\n FROM b1.tbl_sources T0\n LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source\n\n LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source\n\nWHERE (`T0`.`chx_cible_id_source` = :T0_chx_cible_id_source\n   AND `T0`.`chi_id_source` = :T0_chi_id_source\n   AND `T0`.`chp_nom_source` LIKE :T0_chp_nom_source\n   AND `T0`.`chp_type_source` LIKE :T0_chp_type_source\n   AND `T2`.`chp_nom_dossier` LIKE :T2_chp_nom_dossier\n   AND `T0`.`chx_dossier_id_source` = :T0_chx_dossier_id_source) \nORDER BY `T0`.`chp_nom_source` ASC  \nLIMIT :quantitee OFFSET :debut ;",
"62":"SELECT \n`T0`.`chi_id_source` , `T0`.`chx_cible_id_source` , `T0`.`chp_nom_source` , `T0`.`chp_commentaire_source` , `T0`.`chx_dossier_id_source` , \n`T0`.`chp_rev_source` , `T0`.`chp_genere_source` , `T0`.`chp_type_source` , `T1`.`chi_id_cible` , `T1`.`chp_nom_cible` , \n`T1`.`chp_dossier_cible` , `T1`.`chp_commentaire_cible` , `T2`.`chi_id_dossier` , `T2`.`chx_cible_dossier` , `T2`.`chp_nom_dossier`\n FROM b1.tbl_sources T0\n LEFT JOIN b1.tbl_cibles T1 ON T1.chi_id_cible = T0.chx_cible_id_source\n\n LEFT JOIN b1.tbl_dossiers T2 ON T2.chi_id_dossier = T0.chx_dossier_id_source\n\nWHERE (`T0`.`chi_id_source` = :T0_chi_id_source\n   AND `T0`.`chx_cible_id_source` = :T0_chx_cible_id_source);",
"63":"UPDATE b1.tbl_sources SET `chp_nom_source` = :n_chp_nom_source , `chp_commentaire_source` = :n_chp_commentaire_source , `chx_dossier_id_source` = :n_chx_dossier_id_source , `chp_rev_source` = :n_chp_rev_source , `chp_genere_source` = :n_chp_genere_source , `chp_type_source` = :n_chp_type_source\nWHERE (`chi_id_source` = :c_chi_id_source\n   AND `chx_cible_id_source` = :c_chx_cible_id_source) ;",
"64":"SELECT \n`T0`.`chi_id_tache` , `T0`.`chx_utilisateur_tache` , `T0`.`chp_texte_tache` , `T0`.`chp_priorite_tache`\n FROM b1.tbl_taches T0\nWHERE (`T0`.`chx_utilisateur_tache` = :T0_chx_utilisateur_tache\n   AND `T0`.`chp_priorite_tache` < :T0_chp_priorite_tache) \nORDER BY `T0`.`chp_priorite_tache` ASC;",
"65":"UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache\nWHERE (`chi_id_tache` = :c_chi_id_tache\n   AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache) ;",
"66":"UPDATE b1.tbl_requetes SET `cht_rev_requete` = :n_cht_rev_requete , `cht_sql_requete` = :n_cht_sql_requete , `cht_php_requete` = :n_cht_php_requete\nWHERE (`chi_id_requete` = :c_chi_id_requete\n   AND `chx_cible_requete` = :c_chx_cible_requete) ;",
"67":"UPDATE b1.tbl_tests SET `chx_test_parent_test` = :n_chx_test_parent_test , `chp_texte1_test` = :n_chp_texte1_test , `chp_nom_test` = :n_chp_nom_test , `chi_id_test` = :n_chi_id_test\nWHERE (`T0`.`chi_id_test` = :T0_chi_id_test) ;",
};
//]]>