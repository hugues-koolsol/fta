/*
  =========================================================================
  Pour la table tbl_cibles il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_cibles`( `chi_id_cible`, `chp_nom_cible`, `chp_commentaire_cible`, `chp_dossier_cible`) VALUES
('1','fta','la racine','fta');
/*
  =========================================================================
  Pour la table tbl_dossiers il y a 2 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chp_nom_dossier`, `chx_cible_dossier`) VALUES
('1','/','1'),
('2','/fta_inc/db/sqlite','1');
 /* table tbl_sources aucune données à insérer */
/*
  =========================================================================
  Pour la table tbl_bases_de_donnees il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_bases_de_donnees`( `chi_id_basedd`, `chp_nom_basedd`, `chp_rev_basedd`, `chp_commentaire_basedd`, `chx_dossier_id_basedd`, `chp_genere_basedd`, `chx_cible_id_basedd`, `chp_php_basedd`) VALUES
('1','system.db','','bla','2','','1','');
 /* table tbl_rev aucune données à insérer */
/*
  =========================================================================
  Pour la table tbl_utilisateurs il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_utilisateurs`( `chi_id_utilisateur`, `chp_nom_de_connexion_utilisateur`, `chp_mot_de_passe_utilisateur`, `chp_commentaire_utilisateur`) VALUES
('1','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','mdp = admin');
