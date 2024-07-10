/*



  =========================================================================
  Pour la table tbl_cibles il y a 2 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_cibles`( `chi_id_cible`, `chp_nom_cible`, `chp_dossier_cible`, `chp_commentaire_cible`) VALUES
('1','fta','fta','la racine');
/*



  =========================================================================
  Pour la table tbl_dossiers il y a 17 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chx_cible_dossier`, `chp_nom_dossier`) VALUES
('1','1','/'),
('2','1','/fta_inc/db/sqlite');
/*



  =========================================================================
  Pour la table tbl_sources il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/
/*



  =========================================================================
  Pour la table tbl_utilisateurs il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_utilisateurs`( `chi_id_utilisateur`, `chp_nom_de_connexion_utilisateur`, `chp_mot_de_passe_utilisateur`, `chp_parametres_utilisateur`, `chp_commentaire_utilisateur`) VALUES
('1','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','{"zz_sources_l1.php":{"nombre_de_lignes":20},"zz_taches_l1.php":{"nombre_de_lignes":50},"zz_revs_l1.php":{"nombre_de_lignes":30},"zz_cibles_l1.php":{"nombre_de_lignes":30}}','mdp = admin');
/*



  =========================================================================
  Pour la table tbl_bdds il y a 3 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_bdds`( `chi_id_basedd`, `chx_dossier_id_basedd`, `chx_cible_id_basedd`, `chp_nom_basedd`, `chp_rev_basedd`, `chp_commentaire_basedd`, `chp_genere_basedd`, `chp_php_basedd`, `chp_rev_travail_basedd`, `chp_fournisseur_basedd`) VALUES
('1','2','1','system.db','#(
  =====================================================================================================================
  table tbl_cibles
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_cibles''),
      (nom_long_de_la_table , ''à faire tbl_cibles''),
      (nom_court_de_la_table , ''à faire tbl_cibles''),
      (nom_bref_de_la_table , ''à faire tbl_cibles''),
      (transform_table_sur_svg , transform(translate(25 , -13)))
   ),
   nom_de_la_table(''tbl_cibles''),
   fields(
      #(),
      field(nom_du_champ(chi_id_cible) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_cible'') , (nom_long_du_champ , ''à faire chi_id_cible'') , (nom_court_du_champ , ''à faire chi_id_cible'') , (nom_bref_du_champ , ''à faire chi_id_cible'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_cible) , type(STRING) , meta((champ , ''chp_nom_cible'') , (nom_long_du_champ , ''à faire chp_nom_cible'') , (nom_court_du_champ , ''à faire chp_nom_cible'') , (nom_bref_du_champ , ''à faire chp_nom_cible'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_dossier_cible) , type(CHARACTER , 3) , meta((champ , ''chp_dossier_cible'') , (nom_long_du_champ , ''à faire chp_dossier_cible'') , (nom_court_du_champ , ''à faire chp_dossier_cible'') , (nom_bref_du_champ , ''à faire chp_dossier_cible'') , (typologie , ''cho''))),
      field(nom_du_champ(chp_commentaire_cible) , type(STRING) , meta((champ , ''chp_commentaire_cible'') , (nom_long_du_champ , ''à faire chp_commentaire_cible'') , (nom_court_du_champ , ''à faire chp_commentaire_cible'') , (nom_bref_du_champ , ''à faire chp_commentaire_cible'') , (typologie , ''cht'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_cibles'') , unique() , index_name(''idx_dossier_cible'') , fields(''chp_dossier_cible'') , meta((index , ''idx_dossier_cible'') , (message , ''à faire idx_dossier_cible''))),
#(
  =====================================================================================================================
  table tbl_dossiers
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_dossiers''),
      (nom_long_de_la_table , ''à faire tbl_dossiers''),
      (nom_court_de_la_table , ''à faire tbl_dossiers''),
      (nom_bref_de_la_table , ''à faire tbl_dossiers''),
      (transform_table_sur_svg , transform(translate(188 , 220)))
   ),
   nom_de_la_table(''tbl_dossiers''),
   fields(
      #(),
      field(nom_du_champ(chi_id_dossier) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_dossier'') , (nom_long_du_champ , ''à faire chi_id_dossier'') , (nom_court_du_champ , ''à faire chi_id_dossier'') , (nom_bref_du_champ , ''à faire chi_id_dossier'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_cible_dossier) , type(INTEGER) , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_dossier'') , (nom_long_du_champ , ''à faire chx_cible_dossier'') , (nom_court_du_champ , ''à faire chx_cible_dossier'') , (nom_bref_du_champ , ''à faire chx_cible_dossier'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_nom_dossier) , type(CHARACTER , 256) , meta((champ , ''chp_nom_dossier'') , (nom_long_du_champ , ''à faire chp_nom_dossier'') , (nom_court_du_champ , ''à faire chp_nom_dossier'') , (nom_bref_du_champ , ''à faire chp_nom_dossier'') , (typologie , ''cho'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_dossiers'') , unique() , index_name(''idx_cible_et_nom'') , fields(''chx_cible_dossier'' , ''chp_nom_dossier'') , meta((index , ''idx_cible_et_nom'') , (message , ''à faire idx_cible_et_nom''))),
#(
  =====================================================================================================================
  table tbl_sources
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_sources''),
      (nom_long_de_la_table , ''à faire tbl_sources''),
      (nom_court_de_la_table , ''à faire tbl_sources''),
      (nom_bref_de_la_table , ''à faire tbl_sources''),
      (transform_table_sur_svg , transform(translate(456 , 28)))
   ),
   nom_de_la_table(''tbl_sources''),
   fields(
      #(),
      field(nom_du_champ(chi_id_source) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_source'') , (nom_long_du_champ , ''à faire chi_id_source'') , (nom_court_du_champ , ''à faire chi_id_source'') , (nom_bref_du_champ , ''à faire chi_id_source'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_cible_id_source) , type(INTEGER) , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_id_source'') , (nom_long_du_champ , ''à faire chx_cible_id_source'') , (nom_court_du_champ , ''à faire chx_cible_id_source'') , (nom_bref_du_champ , ''à faire chx_cible_id_source'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_nom_source) , type(CHARACTER , 256) , non_nulle() , default('''') , meta((champ , ''chp_nom_source'') , (nom_long_du_champ , ''à faire chp_nom_source'') , (nom_court_du_champ , ''à faire chp_nom_source'') , (nom_bref_du_champ , ''à faire chp_nom_source'') , (typologie , ''cho''))),
      field(nom_du_champ(chp_commentaire_source) , type(TEXT) , meta((champ , ''chp_commentaire_source'') , (nom_long_du_champ , ''à faire chp_commentaire_source'') , (nom_court_du_champ , ''à faire chp_commentaire_source'') , (nom_bref_du_champ , ''à faire chp_commentaire_source'') , (typologie , ''cht''))),
      field(nom_du_champ(chx_dossier_id_source) , type(INTEGER) , references(''tbl_dossiers'' , ''chi_id_dossier'') , meta((champ , ''chx_dossier_id_source'') , (nom_long_du_champ , ''à faire chx_dossier_id_source'') , (nom_court_du_champ , ''à faire chx_dossier_id_source'') , (nom_bref_du_champ , ''à faire chx_dossier_id_source'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_rev_source) , type(TEXT) , meta((champ , ''chp_rev_source'') , (nom_long_du_champ , ''à faire chp_rev_source'') , (nom_court_du_champ , ''à faire chp_rev_source'') , (nom_bref_du_champ , ''à faire chp_rev_source'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_genere_source) , type(TEXT) , meta((champ , ''chp_genere_source'') , (nom_long_du_champ , ''à faire chp_genere_source'') , (nom_court_du_champ , ''à faire chp_genere_source'') , (nom_bref_du_champ , ''à faire chp_genere_source'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_type_source) , type(TEXT) , non_nulle() , default(''normal'') , meta((champ , ''chp_type_source'') , (nom_long_du_champ , ''à faire chp_type_source'') , (nom_court_du_champ , ''à faire chp_type_source'') , (nom_bref_du_champ , ''à faire chp_type_source'') , (typologie , ''cht'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_sources'') , unique() , index_name(''idx_nom_et_dossier'') , fields(''chx_dossier_id_source'' , ''chp_nom_source'') , meta((index , ''idx_nom_et_dossier'') , (message , ''à faire idx_nom_et_dossier''))),
#(
  =====================================================================================================================
  table tbl_utilisateurs
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_utilisateurs''),
      (nom_long_de_la_table , ''à faire tbl_utilisateurs''),
      (nom_court_de_la_table , ''à faire tbl_utilisateurs''),
      (nom_bref_de_la_table , ''à faire tbl_utilisateurs''),
      (transform_table_sur_svg , transform(translate(36 , 324)))
   ),
   nom_de_la_table(''tbl_utilisateurs''),
   fields(
      #(),
      field(nom_du_champ(chi_id_utilisateur) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_utilisateur'') , (nom_long_du_champ , ''à faire chi_id_utilisateur'') , (nom_court_du_champ , ''à faire chi_id_utilisateur'') , (nom_bref_du_champ , ''à faire chi_id_utilisateur'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_de_connexion_utilisateur) , type(STRING) , meta((champ , ''chp_nom_de_connexion_utilisateur'') , (nom_long_du_champ , ''à faire chp_nom_de_connexion_utilisateur'') , (nom_court_du_champ , ''à faire chp_nom_de_connexion_utilisateur'') , (nom_bref_du_champ , ''à faire chp_nom_de_connexion_utilisateur'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_mot_de_passe_utilisateur) , type(STRING) , meta((champ , ''chp_mot_de_passe_utilisateur'') , (nom_long_du_champ , ''à faire chp_mot_de_passe_utilisateur'') , (nom_court_du_champ , ''à faire chp_mot_de_passe_utilisateur'') , (nom_bref_du_champ , ''à faire chp_mot_de_passe_utilisateur'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_parametres_utilisateur) , type(TEXT) , meta((champ , ''chp_parametres_utilisateur'') , (nom_long_du_champ , ''à faire chp_parametres_utilisateur'') , (nom_court_du_champ , ''à faire chp_parametres_utilisateur'') , (nom_bref_du_champ , ''à faire chp_parametres_utilisateur'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_commentaire_utilisateur) , type(TEXT) , meta((champ , ''chp_commentaire_utilisateur'') , (nom_long_du_champ , ''à faire chp_commentaire_utilisateur'') , (nom_court_du_champ , ''à faire chp_commentaire_utilisateur'') , (nom_bref_du_champ , ''à faire chp_commentaire_utilisateur'') , (typologie , ''cht'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_utilisateurs'') , unique() , index_name(''idxNomUtilisateur'') , fields(''chp_nom_de_connexion_utilisateur'') , meta((index , ''idxNomUtilisateur'') , (message , ''à faire idxNomUtilisateur''))),
#(
  =====================================================================================================================
  table tbl_taches
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_taches''),
      (nom_long_de_la_table , ''à faire tbl_taches''),
      (nom_court_de_la_table , ''à faire tbl_taches''),
      (nom_bref_de_la_table , ''à faire tbl_taches''),
      (transform_table_sur_svg , transform(translate(306 , 381)))
   ),
   nom_de_la_table(''tbl_taches''),
   fields(
      #(),
      field(nom_du_champ(chi_id_tache) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_tache'') , (nom_long_du_champ , ''à faire chi_id_tache'') , (nom_court_du_champ , ''à faire chi_id_tache'') , (nom_bref_du_champ , ''à faire chi_id_tache'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_utilisateur_tache) , type(INTEGER) , references(''tbl_utilisateurs'' , ''chi_id_utilisateur'') , meta((champ , ''chx_utilisateur_tache'') , (nom_long_du_champ , ''à faire chx_utilisateur_tache'') , (nom_court_du_champ , ''à faire chx_utilisateur_tache'') , (nom_bref_du_champ , ''à faire chx_utilisateur_tache'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_texte_tache) , type(TEXT) , meta((champ , ''chp_texte_tache'') , (nom_long_du_champ , ''à faire chp_texte_tache'') , (nom_court_du_champ , ''à faire chp_texte_tache'') , (nom_bref_du_champ , ''à faire chp_texte_tache'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_priorite_tache) , type(INTEGER) , meta((champ , ''chp_priorite_tache'') , (nom_long_du_champ , ''à faire chp_priorite_tache'') , (nom_court_du_champ , ''à faire chp_priorite_tache'') , (nom_bref_du_champ , ''à faire chp_priorite_tache'') , (typologie , ''che'')))
   )
),
#(
  =====================================================================================================================
  table tbl_bdds
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_bdds''),
      (nom_long_de_la_table , ''à faire tbl_bdds''),
      (nom_court_de_la_table , ''à faire tbl_bdds''),
      (nom_bref_de_la_table , ''à faire tbl_bdds''),
      (transform_table_sur_svg , transform(translate(489 , 238)))
   ),
   nom_de_la_table(''tbl_bdds''),
   fields(
      #(),
      field(nom_du_champ(chi_id_basedd) , type(INTEGER) , primary_key() , auto_increment() , meta((champ , ''chi_id_basedd'') , (nom_long_du_champ , ''à faire chi_id_basedd'') , (nom_court_du_champ , ''à faire chi_id_basedd'') , (nom_bref_du_champ , ''à faire chi_id_basedd'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_dossier_id_basedd) , type(INTEGER) , references(''tbl_dossiers'' , ''chi_id_dossier'') , meta((champ , ''chx_dossier_id_basedd'') , (nom_long_du_champ , ''à faire chx_dossier_id_basedd'') , (nom_court_du_champ , ''à faire chx_dossier_id_basedd'') , (nom_bref_du_champ , ''à faire chx_dossier_id_basedd'') , (typologie , ''chx''))),
      field(nom_du_champ(chx_cible_id_basedd) , type(INTEGER) , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_id_basedd'') , (nom_long_du_champ , ''à faire chx_cible_id_basedd'') , (nom_court_du_champ , ''à faire chx_cible_id_basedd'') , (nom_bref_du_champ , ''à faire chx_cible_id_basedd'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_nom_basedd) , type(TEXT) , non_nulle() , default('''') , meta((champ , ''chp_nom_basedd'') , (nom_long_du_champ , ''à faire chp_nom_basedd'') , (nom_court_du_champ , ''à faire chp_nom_basedd'') , (nom_bref_du_champ , ''à faire chp_nom_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_rev_basedd) , type(TEXT) , meta((champ , ''chp_rev_basedd'') , (nom_long_du_champ , ''à faire chp_rev_basedd'') , (nom_court_du_champ , ''à faire chp_rev_basedd'') , (nom_bref_du_champ , ''à faire chp_rev_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_commentaire_basedd) , type(TEXT) , meta((champ , ''chp_commentaire_basedd'') , (nom_long_du_champ , ''à faire chp_commentaire_basedd'') , (nom_court_du_champ , ''à faire chp_commentaire_basedd'') , (nom_bref_du_champ , ''à faire chp_commentaire_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_genere_basedd) , type(TEXT) , meta((champ , ''chp_genere_basedd'') , (nom_long_du_champ , ''à faire chp_genere_basedd'') , (nom_court_du_champ , ''à faire chp_genere_basedd'') , (nom_bref_du_champ , ''à faire chp_genere_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_php_basedd) , type(TEXT) , meta((champ , ''chp_php_basedd'') , (nom_long_du_champ , ''à faire chp_php_basedd'') , (nom_court_du_champ , ''à faire chp_php_basedd'') , (nom_bref_du_champ , ''à faire chp_php_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_rev_travail_basedd) , type(TEXT) , meta((champ , ''chp_rev_travail_basedd'') , (nom_long_du_champ , ''à faire chp_rev_travail_basedd'') , (nom_court_du_champ , ''à faire chp_rev_travail_basedd'') , (nom_bref_du_champ , ''à faire chp_rev_travail_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_fournisseur_basedd) , type(TEXT) , non_nulle() , default(''sqlite'') , meta((champ , ''chp_fournisseur_basedd'') , (nom_long_du_champ , ''à faire chp_fournisseur_basedd'') , (nom_court_du_champ , ''à faire chp_fournisseur_basedd'') , (nom_bref_du_champ , ''à faire chp_fournisseur_basedd'') , (typologie , ''cht'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_bdds'') , unique() , index_name(''idx_nom_basedd'') , fields(''chp_nom_basedd'' , ''chx_cible_id_basedd'') , meta((index , ''idx_nom_basedd'') , (message , ''à faire idx_nom_basedd''))),
#(
  =====================================================================================================================
  table tbl_revs
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_revs''),
      (nom_long_de_la_table , ''à faire tbl_revs''),
      (nom_court_de_la_table , ''à faire tbl_revs''),
      (nom_bref_de_la_table , ''à faire tbl_revs''),
      (transform_table_sur_svg , transform(translate(656 , -133)))
   ),
   nom_de_la_table(''tbl_revs''),
   fields(
      #(),
      field(nom_du_champ(chi_id_rev) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_rev'') , (nom_long_du_champ , ''à faire chi_id_rev'') , (nom_court_du_champ , ''à faire chi_id_rev'') , (nom_bref_du_champ , ''à faire chi_id_rev'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_cible_rev) , type(INTEGER) , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_rev'') , (nom_long_du_champ , ''à faire chx_cible_rev'') , (nom_court_du_champ , ''à faire chx_cible_rev'') , (nom_bref_du_champ , ''à faire chx_cible_rev'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_provenance_rev) , type(CHARACTER , 32) , meta((champ , ''chp_provenance_rev'') , (nom_long_du_champ , ''à faire chp_provenance_rev'') , (nom_court_du_champ , ''à faire chp_provenance_rev'') , (nom_bref_du_champ , ''à faire chp_provenance_rev'') , (typologie , ''cho''))),
      field(nom_du_champ(chx_source_rev) , type(INTEGER) , references(''tbl_sources'' , ''chi_id_source'') , meta((champ , ''chx_source_rev'') , (nom_long_du_champ , ''à faire chx_source_rev'') , (nom_court_du_champ , ''à faire chx_source_rev'') , (nom_bref_du_champ , ''à faire chx_source_rev'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_id_rev) , type(INTEGER) , meta((champ , ''chp_id_rev'') , (nom_long_du_champ , ''à faire chp_id_rev'') , (nom_court_du_champ , ''à faire chp_id_rev'') , (nom_bref_du_champ , ''à faire chp_id_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_valeur_rev) , type(TEXT) , meta((champ , ''chp_valeur_rev'') , (nom_long_du_champ , ''à faire chp_valeur_rev'') , (nom_court_du_champ , ''à faire chp_valeur_rev'') , (nom_bref_du_champ , ''à faire chp_valeur_rev'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_type_rev) , type(CHARACTER , 4) , meta((champ , ''chp_type_rev'') , (nom_long_du_champ , ''à faire chp_type_rev'') , (nom_court_du_champ , ''à faire chp_type_rev'') , (nom_bref_du_champ , ''à faire chp_type_rev'') , (typologie , ''cho''))),
      field(nom_du_champ(chp_niveau_rev) , type(INTEGER) , meta((champ , ''chp_niveau_rev'') , (nom_long_du_champ , ''à faire chp_niveau_rev'') , (nom_court_du_champ , ''à faire chp_niveau_rev'') , (nom_bref_du_champ , ''à faire chp_niveau_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_quotee_rev) , type(INTEGER) , meta((champ , ''chp_quotee_rev'') , (nom_long_du_champ , ''à faire chp_quotee_rev'') , (nom_court_du_champ , ''à faire chp_quotee_rev'') , (nom_bref_du_champ , ''à faire chp_quotee_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_pos_premier_rev) , type(INTEGER) , meta((champ , ''chp_pos_premier_rev'') , (nom_long_du_champ , ''à faire chp_pos_premier_rev'') , (nom_court_du_champ , ''à faire chp_pos_premier_rev'') , (nom_bref_du_champ , ''à faire chp_pos_premier_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_pos_dernier_rev) , type(INTEGER) , meta((champ , ''chp_pos_dernier_rev'') , (nom_long_du_champ , ''à faire chp_pos_dernier_rev'') , (nom_court_du_champ , ''à faire chp_pos_dernier_rev'') , (nom_bref_du_champ , ''à faire chp_pos_dernier_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_parent_rev) , type(INTEGER) , meta((champ , ''chp_parent_rev'') , (nom_long_du_champ , ''à faire chp_parent_rev'') , (nom_court_du_champ , ''à faire chp_parent_rev'') , (nom_bref_du_champ , ''à faire chp_parent_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_nbr_enfants_rev) , type(INTEGER) , meta((champ , ''chp_nbr_enfants_rev'') , (nom_long_du_champ , ''à faire chp_nbr_enfants_rev'') , (nom_court_du_champ , ''à faire chp_nbr_enfants_rev'') , (nom_bref_du_champ , ''à faire chp_nbr_enfants_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_num_enfant_rev) , type(INTEGER) , meta((champ , ''chp_num_enfant_rev'') , (nom_long_du_champ , ''à faire chp_num_enfant_rev'') , (nom_court_du_champ , ''à faire chp_num_enfant_rev'') , (nom_bref_du_champ , ''à faire chp_num_enfant_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_profondeur_rev) , type(INTEGER) , meta((champ , ''chp_profondeur_rev'') , (nom_long_du_champ , ''à faire chp_profondeur_rev'') , (nom_court_du_champ , ''à faire chp_profondeur_rev'') , (nom_bref_du_champ , ''à faire chp_profondeur_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_pos_ouver_parenthese_rev) , type(INTEGER) , meta((champ , ''chp_pos_ouver_parenthese_rev'') , (nom_long_du_champ , ''à faire chp_pos_ouver_parenthese_rev'') , (nom_court_du_champ , ''à faire chp_pos_ouver_parenthese_rev'') , (nom_bref_du_champ , ''à faire chp_pos_ouver_parenthese_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_pos_fermer_parenthese_rev) , type(INTEGER) , meta((champ , ''chp_pos_fermer_parenthese_rev'') , (nom_long_du_champ , ''à faire chp_pos_fermer_parenthese_rev'') , (nom_court_du_champ , ''à faire chp_pos_fermer_parenthese_rev'') , (nom_bref_du_champ , ''à faire chp_pos_fermer_parenthese_rev'') , (typologie , ''che''))),
      field(nom_du_champ(chp_commentaire_rev) , type(TEXT) , meta((champ , ''chp_commentaire_rev'') , (nom_long_du_champ , ''à faire chp_commentaire_rev'') , (nom_court_du_champ , ''à faire chp_commentaire_rev'') , (nom_bref_du_champ , ''à faire chp_commentaire_rev'') , (typologie , ''cht'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_revs'') , unique() , index_name(''idx_ligne_rev'') , fields(''chx_cible_rev'' , ''chp_provenance_rev'' , ''chx_source_rev'' , ''chp_id_rev'') , meta((index , ''idx_ligne_rev'') , (message , ''à faire idx_ligne_rev'')))','bla','/*
  =====================================================================================================================
  table tbl_cibles
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_cibles''),(nom_long_de_la_table,''à faire tbl_cibles''),(nom_court_de_la_table,''à faire tbl_cibles''),(nom_bref_de_la_table,''à faire tbl_cibles''),(transform_table_sur_svg,transform(translate(25,-13)))) */
     tbl_cibles( 

            /* meta((champ,''chi_id_cible''),(nom_long_du_champ,''à faire chi_id_cible''),(nom_court_du_champ,''à faire chi_id_cible''),(nom_bref_du_champ,''à faire chi_id_cible''),(typologie,''chi'')) */
             chi_id_cible INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_cible''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')) */
             chp_nom_cible STRING,
    
            /* meta((champ,''chp_dossier_cible''),(nom_long_du_champ,''à faire chp_dossier_cible''),(nom_court_du_champ,''à faire chp_dossier_cible''),(nom_bref_du_champ,''à faire chp_dossier_cible''),(typologie,''cho'')) */
             chp_dossier_cible CHARACTER(3),
    
            /* meta((champ,''chp_commentaire_cible''),(nom_long_du_champ,''à faire chp_commentaire_cible''),(nom_court_du_champ,''à faire chp_commentaire_cible''),(nom_bref_du_champ,''à faire chp_commentaire_cible''),(typologie,''cht'')) */
             chp_commentaire_cible STRING
);
/*==============================*/

CREATE  UNIQUE INDEX  idx_dossier_cible ON `tbl_cibles` 
        /* meta((index,''idx_dossier_cible''),(message,''à faire idx_dossier_cible'')) */
         ( `chp_dossier_cible` ) ;
/*
  =====================================================================================================================
  table tbl_dossiers
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_dossiers''),(nom_long_de_la_table,''à faire tbl_dossiers''),(nom_court_de_la_table,''à faire tbl_dossiers''),(nom_bref_de_la_table,''à faire tbl_dossiers''),(transform_table_sur_svg,transform(translate(188,220)))) */
     tbl_dossiers( 

            /* meta((champ,''chi_id_dossier''),(nom_long_du_champ,''à faire chi_id_dossier''),(nom_court_du_champ,''à faire chi_id_dossier''),(nom_bref_du_champ,''à faire chi_id_dossier''),(typologie,''chi'')) */
             chi_id_dossier INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_cible_dossier''),(nom_long_du_champ,''à faire chx_cible_dossier''),(nom_court_du_champ,''à faire chx_cible_dossier''),(nom_bref_du_champ,''à faire chx_cible_dossier''),(typologie,''chx'')) */
             chx_cible_dossier INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
            /* meta((champ,''chp_nom_dossier''),(nom_long_du_champ,''à faire chp_nom_dossier''),(nom_court_du_champ,''à faire chp_nom_dossier''),(nom_bref_du_champ,''à faire chp_nom_dossier''),(typologie,''cho'')) */
             chp_nom_dossier CHARACTER(256)
);
/*==============================*/

CREATE  UNIQUE INDEX  idx_cible_et_nom ON `tbl_dossiers` 
        /* meta((index,''idx_cible_et_nom''),(message,''à faire idx_cible_et_nom'')) */
         ( `chx_cible_dossier` , `chp_nom_dossier` ) ;
/*
  =====================================================================================================================
  table tbl_sources
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_sources''),(nom_long_de_la_table,''à faire tbl_sources''),(nom_court_de_la_table,''à faire tbl_sources''),(nom_bref_de_la_table,''à faire tbl_sources''),(transform_table_sur_svg,transform(translate(456,28)))) */
     tbl_sources( 

            /* meta((champ,''chi_id_source''),(nom_long_du_champ,''à faire chi_id_source''),(nom_court_du_champ,''à faire chi_id_source''),(nom_bref_du_champ,''à faire chi_id_source''),(typologie,''chi'')) */
             chi_id_source INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_cible_id_source''),(nom_long_du_champ,''à faire chx_cible_id_source''),(nom_court_du_champ,''à faire chx_cible_id_source''),(nom_bref_du_champ,''à faire chx_cible_id_source''),(typologie,''chx'')) */
             chx_cible_id_source INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
            /* meta((champ,''chp_nom_source''),(nom_long_du_champ,''à faire chp_nom_source''),(nom_court_du_champ,''à faire chp_nom_source''),(nom_bref_du_champ,''à faire chp_nom_source''),(typologie,''cho'')) */
             chp_nom_source CHARACTER(256) NOT NULL DEFAULT  '''' ,
    
            /* meta((champ,''chp_commentaire_source''),(nom_long_du_champ,''à faire chp_commentaire_source''),(nom_court_du_champ,''à faire chp_commentaire_source''),(nom_bref_du_champ,''à faire chp_commentaire_source''),(typologie,''cht'')) */
             chp_commentaire_source TEXT,
    
            /* meta((champ,''chx_dossier_id_source''),(nom_long_du_champ,''à faire chx_dossier_id_source''),(nom_court_du_champ,''à faire chx_dossier_id_source''),(nom_bref_du_champ,''à faire chx_dossier_id_source''),(typologie,''chx'')) */
             chx_dossier_id_source INTEGER REFERENCES ''tbl_dossiers''(''chi_id_dossier'') ,
    
            /* meta((champ,''chp_rev_source''),(nom_long_du_champ,''à faire chp_rev_source''),(nom_court_du_champ,''à faire chp_rev_source''),(nom_bref_du_champ,''à faire chp_rev_source''),(typologie,''cht'')) */
             chp_rev_source TEXT,
    
            /* meta((champ,''chp_genere_source''),(nom_long_du_champ,''à faire chp_genere_source''),(nom_court_du_champ,''à faire chp_genere_source''),(nom_bref_du_champ,''à faire chp_genere_source''),(typologie,''cht'')) */
             chp_genere_source TEXT,
    
            /* meta((champ,''chp_type_source''),(nom_long_du_champ,''à faire chp_type_source''),(nom_court_du_champ,''à faire chp_type_source''),(nom_bref_du_champ,''à faire chp_type_source''),(typologie,''cht'')) */
             chp_type_source TEXT NOT NULL DEFAULT  ''normal'' 
);
/*==============================*/

CREATE  UNIQUE INDEX  idx_nom_et_dossier ON `tbl_sources` 
        /* meta((index,''idx_nom_et_dossier''),(message,''à faire idx_nom_et_dossier'')) */
         ( `chx_dossier_id_source` , `chp_nom_source` ) ;
/*
  =====================================================================================================================
  table tbl_utilisateurs
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_utilisateurs''),(nom_long_de_la_table,''à faire tbl_utilisateurs''),(nom_court_de_la_table,''à faire tbl_utilisateurs''),(nom_bref_de_la_table,''à faire tbl_utilisateurs''),(transform_table_sur_svg,transform(translate(36,324)))) */
     tbl_utilisateurs( 

            /* meta((champ,''chi_id_utilisateur''),(nom_long_du_champ,''à faire chi_id_utilisateur''),(nom_court_du_champ,''à faire chi_id_utilisateur''),(nom_bref_du_champ,''à faire chi_id_utilisateur''),(typologie,''chi'')) */
             chi_id_utilisateur INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_de_connexion_utilisateur''),(nom_long_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_court_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_bref_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(typologie,''cht'')) */
             chp_nom_de_connexion_utilisateur STRING,
    
            /* meta((champ,''chp_mot_de_passe_utilisateur''),(nom_long_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_court_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_bref_du_champ,''à faire chp_mot_de_passe_utilisateur''),(typologie,''cht'')) */
             chp_mot_de_passe_utilisateur STRING,
    
            /* meta((champ,''chp_parametres_utilisateur''),(nom_long_du_champ,''à faire chp_parametres_utilisateur''),(nom_court_du_champ,''à faire chp_parametres_utilisateur''),(nom_bref_du_champ,''à faire chp_parametres_utilisateur''),(typologie,''cht'')) */
             chp_parametres_utilisateur TEXT,
    
            /* meta((champ,''chp_commentaire_utilisateur''),(nom_long_du_champ,''à faire chp_commentaire_utilisateur''),(nom_court_du_champ,''à faire chp_commentaire_utilisateur''),(nom_bref_du_champ,''à faire chp_commentaire_utilisateur''),(typologie,''cht'')) */
             chp_commentaire_utilisateur TEXT
);
/*==============================*/

CREATE  UNIQUE INDEX  idxNomUtilisateur ON `tbl_utilisateurs` 
        /* meta((index,''idxNomUtilisateur''),(message,''à faire idxNomUtilisateur'')) */
         ( `chp_nom_de_connexion_utilisateur` ) ;
/*
  =====================================================================================================================
  table tbl_taches
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_taches''),(nom_long_de_la_table,''à faire tbl_taches''),(nom_court_de_la_table,''à faire tbl_taches''),(nom_bref_de_la_table,''à faire tbl_taches''),(transform_table_sur_svg,transform(translate(306,381)))) */
     tbl_taches( 

            /* meta((champ,''chi_id_tache''),(nom_long_du_champ,''à faire chi_id_tache''),(nom_court_du_champ,''à faire chi_id_tache''),(nom_bref_du_champ,''à faire chi_id_tache''),(typologie,''chi'')) */
             chi_id_tache INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_utilisateur_tache''),(nom_long_du_champ,''à faire chx_utilisateur_tache''),(nom_court_du_champ,''à faire chx_utilisateur_tache''),(nom_bref_du_champ,''à faire chx_utilisateur_tache''),(typologie,''chx'')) */
             chx_utilisateur_tache INTEGER REFERENCES ''tbl_utilisateurs''(''chi_id_utilisateur'') ,
    
            /* meta((champ,''chp_texte_tache''),(nom_long_du_champ,''à faire chp_texte_tache''),(nom_court_du_champ,''à faire chp_texte_tache''),(nom_bref_du_champ,''à faire chp_texte_tache''),(typologie,''cht'')) */
             chp_texte_tache TEXT,
    
            /* meta((champ,''chp_priorite_tache''),(nom_long_du_champ,''à faire chp_priorite_tache''),(nom_court_du_champ,''à faire chp_priorite_tache''),(nom_bref_du_champ,''à faire chp_priorite_tache''),(typologie,''che'')) */
             chp_priorite_tache INTEGER
);
/*
  =====================================================================================================================
  table tbl_bases_de_donnees
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_bases_de_donnees''),(nom_long_de_la_table,''à faire tbl_bases_de_donnees''),(nom_court_de_la_table,''à faire tbl_bases_de_donnees''),(nom_bref_de_la_table,''à faire tbl_bases_de_donnees''),(transform_table_sur_svg,transform(translate(489,238)))) */
     tbl_bases_de_donnees( 

            /* meta((champ,''chi_id_basedd''),(nom_long_du_champ,''à faire chi_id_basedd''),(nom_court_du_champ,''à faire chi_id_basedd''),(nom_bref_du_champ,''à faire chi_id_basedd''),(typologie,''chi'')) */
             chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT,
    
            /* meta((champ,''chx_dossier_id_basedd''),(nom_long_du_champ,''à faire chx_dossier_id_basedd''),(nom_court_du_champ,''à faire chx_dossier_id_basedd''),(nom_bref_du_champ,''à faire chx_dossier_id_basedd''),(typologie,''chx'')) */
             chx_dossier_id_basedd INTEGER REFERENCES ''tbl_dossiers''(''chi_id_dossier'') ,
    
            /* meta((champ,''chx_cible_id_basedd''),(nom_long_du_champ,''à faire chx_cible_id_basedd''),(nom_court_du_champ,''à faire chx_cible_id_basedd''),(nom_bref_du_champ,''à faire chx_cible_id_basedd''),(typologie,''chx'')) */
             chx_cible_id_basedd INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
            /* meta((champ,''chp_nom_basedd''),(nom_long_du_champ,''à faire chp_nom_basedd''),(nom_court_du_champ,''à faire chp_nom_basedd''),(nom_bref_du_champ,''à faire chp_nom_basedd''),(typologie,''cht'')) */
             chp_nom_basedd TEXT NOT NULL DEFAULT  '''' ,
    
            /* meta((champ,''chp_rev_basedd''),(nom_long_du_champ,''à faire chp_rev_basedd''),(nom_court_du_champ,''à faire chp_rev_basedd''),(nom_bref_du_champ,''à faire chp_rev_basedd''),(typologie,''cht'')) */
             chp_rev_basedd TEXT,
    
            /* meta((champ,''chp_commentaire_basedd''),(nom_long_du_champ,''à faire chp_commentaire_basedd''),(nom_court_du_champ,''à faire chp_commentaire_basedd''),(nom_bref_du_champ,''à faire chp_commentaire_basedd''),(typologie,''cht'')) */
             chp_commentaire_basedd TEXT,
    
            /* meta((champ,''chp_genere_basedd''),(nom_long_du_champ,''à faire chp_genere_basedd''),(nom_court_du_champ,''à faire chp_genere_basedd''),(nom_bref_du_champ,''à faire chp_genere_basedd''),(typologie,''cht'')) */
             chp_genere_basedd TEXT,
    
            /* meta((champ,''chp_php_basedd''),(nom_long_du_champ,''à faire chp_php_basedd''),(nom_court_du_champ,''à faire chp_php_basedd''),(nom_bref_du_champ,''à faire chp_php_basedd''),(typologie,''cht'')) */
             chp_php_basedd TEXT,
    
            /* meta((champ,''chp_rev_travail_basedd''),(nom_long_du_champ,''à faire chp_rev_travail_basedd''),(nom_court_du_champ,''à faire chp_rev_travail_basedd''),(nom_bref_du_champ,''à faire chp_rev_travail_basedd''),(typologie,''cht'')) */
             chp_rev_travail_basedd TEXT,
    
            /* meta((champ,''chp_fournisseur_basedd''),(nom_long_du_champ,''à faire chp_fournisseur_basedd''),(nom_court_du_champ,''à faire chp_fournisseur_basedd''),(nom_bref_du_champ,''à faire chp_fournisseur_basedd''),(typologie,''cht'')) */
             chp_fournisseur_basedd TEXT NOT NULL DEFAULT  ''sqlite'' 
);
/*==============================*/

CREATE  UNIQUE INDEX  idx_nom_basedd ON `tbl_bases_de_donnees` 
        /* meta((index,''idx_nom_basedd''),(message,''à faire idx_nom_basedd'')) */
         ( `chp_nom_basedd` , `chx_cible_id_basedd` ) ;
/*
  =====================================================================================================================
  table tbl_revs
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_revs''),(nom_long_de_la_table,''à faire tbl_revs''),(nom_court_de_la_table,''à faire tbl_revs''),(nom_bref_de_la_table,''à faire tbl_revs''),(transform_table_sur_svg,transform(translate(656,-133)))) */
     tbl_revs( 

            /* meta((champ,''chi_id_rev''),(nom_long_du_champ,''à faire chi_id_rev''),(nom_court_du_champ,''à faire chi_id_rev''),(nom_bref_du_champ,''à faire chi_id_rev''),(typologie,''chi'')) */
             chi_id_rev INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_cible_rev''),(nom_long_du_champ,''à faire chx_cible_rev''),(nom_court_du_champ,''à faire chx_cible_rev''),(nom_bref_du_champ,''à faire chx_cible_rev''),(typologie,''chx'')) */
             chx_cible_rev INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
            /* meta((champ,''chp_provenance_rev''),(nom_long_du_champ,''à faire chp_provenance_rev''),(nom_court_du_champ,''à faire chp_provenance_rev''),(nom_bref_du_champ,''à faire chp_provenance_rev''),(typologie,''cho'')) */
             chp_provenance_rev CHARACTER(32),
    
            /* meta((champ,''chx_source_rev''),(nom_long_du_champ,''à faire chx_source_rev''),(nom_court_du_champ,''à faire chx_source_rev''),(nom_bref_du_champ,''à faire chx_source_rev''),(typologie,''chx'')) */
             chx_source_rev INTEGER REFERENCES ''tbl_sources''(''chi_id_source'') ,
    
            /* meta((champ,''chp_id_rev''),(nom_long_du_champ,''à faire chp_id_rev''),(nom_court_du_champ,''à faire chp_id_rev''),(nom_bref_du_champ,''à faire chp_id_rev''),(typologie,''che'')) */
             chp_id_rev INTEGER,
    
            /* meta((champ,''chp_valeur_rev''),(nom_long_du_champ,''à faire chp_valeur_rev''),(nom_court_du_champ,''à faire chp_valeur_rev''),(nom_bref_du_champ,''à faire chp_valeur_rev''),(typologie,''cht'')) */
             chp_valeur_rev TEXT,
    
            /* meta((champ,''chp_type_rev''),(nom_long_du_champ,''à faire chp_type_rev''),(nom_court_du_champ,''à faire chp_type_rev''),(nom_bref_du_champ,''à faire chp_type_rev''),(typologie,''cho'')) */
             chp_type_rev CHARACTER(4),
    
            /* meta((champ,''chp_niveau_rev''),(nom_long_du_champ,''à faire chp_niveau_rev''),(nom_court_du_champ,''à faire chp_niveau_rev''),(nom_bref_du_champ,''à faire chp_niveau_rev''),(typologie,''che'')) */
             chp_niveau_rev INTEGER,
    
            /* meta((champ,''chp_quotee_rev''),(nom_long_du_champ,''à faire chp_quotee_rev''),(nom_court_du_champ,''à faire chp_quotee_rev''),(nom_bref_du_champ,''à faire chp_quotee_rev''),(typologie,''che'')) */
             chp_quotee_rev INTEGER,
    
            /* meta((champ,''chp_pos_premier_rev''),(nom_long_du_champ,''à faire chp_pos_premier_rev''),(nom_court_du_champ,''à faire chp_pos_premier_rev''),(nom_bref_du_champ,''à faire chp_pos_premier_rev''),(typologie,''che'')) */
             chp_pos_premier_rev INTEGER,
    
            /* meta((champ,''chp_pos_dernier_rev''),(nom_long_du_champ,''à faire chp_pos_dernier_rev''),(nom_court_du_champ,''à faire chp_pos_dernier_rev''),(nom_bref_du_champ,''à faire chp_pos_dernier_rev''),(typologie,''che'')) */
             chp_pos_dernier_rev INTEGER,
    
            /* meta((champ,''chp_parent_rev''),(nom_long_du_champ,''à faire chp_parent_rev''),(nom_court_du_champ,''à faire chp_parent_rev''),(nom_bref_du_champ,''à faire chp_parent_rev''),(typologie,''che'')) */
             chp_parent_rev INTEGER,
    
            /* meta((champ,''chp_nbr_enfants_rev''),(nom_long_du_champ,''à faire chp_nbr_enfants_rev''),(nom_court_du_champ,''à faire chp_nbr_enfants_rev''),(nom_bref_du_champ,''à faire chp_nbr_enfants_rev''),(typologie,''che'')) */
             chp_nbr_enfants_rev INTEGER,
    
            /* meta((champ,''chp_num_enfant_rev''),(nom_long_du_champ,''à faire chp_num_enfant_rev''),(nom_court_du_champ,''à faire chp_num_enfant_rev''),(nom_bref_du_champ,''à faire chp_num_enfant_rev''),(typologie,''che'')) */
             chp_num_enfant_rev INTEGER,
    
            /* meta((champ,''chp_profondeur_rev''),(nom_long_du_champ,''à faire chp_profondeur_rev''),(nom_court_du_champ,''à faire chp_profondeur_rev''),(nom_bref_du_champ,''à faire chp_profondeur_rev''),(typologie,''che'')) */
             chp_profondeur_rev INTEGER,
    
            /* meta((champ,''chp_pos_ouver_parenthese_rev''),(nom_long_du_champ,''à faire chp_pos_ouver_parenthese_rev''),(nom_court_du_champ,''à faire chp_pos_ouver_parenthese_rev''),(nom_bref_du_champ,''à faire chp_pos_ouver_parenthese_rev''),(typologie,''che'')) */
             chp_pos_ouver_parenthese_rev INTEGER,
    
            /* meta((champ,''chp_pos_fermer_parenthese_rev''),(nom_long_du_champ,''à faire chp_pos_fermer_parenthese_rev''),(nom_court_du_champ,''à faire chp_pos_fermer_parenthese_rev''),(nom_bref_du_champ,''à faire chp_pos_fermer_parenthese_rev''),(typologie,''che'')) */
             chp_pos_fermer_parenthese_rev INTEGER,
    
            /* meta((champ,''chp_commentaire_rev''),(nom_long_du_champ,''à faire chp_commentaire_rev''),(nom_court_du_champ,''à faire chp_commentaire_rev''),(nom_bref_du_champ,''à faire chp_commentaire_rev''),(typologie,''cht'')) */
             chp_commentaire_rev TEXT
);
/*==============================*/

CREATE  UNIQUE INDEX  idx_ligne_rev ON `tbl_revs` 
        /* meta((index,''idx_ligne_rev''),(message,''à faire idx_ligne_rev'')) */
         ( `chx_cible_rev` , `chp_provenance_rev` , `chx_source_rev` , `chp_id_rev` ) ;','$db = new SQLite3(''temporaire_pour_test.db'');
$uneErreur=false;
if((false === $db->exec(''BEGIN TRANSACTION''))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre>'' ;
    $uneErreur=true;
}
$chaineSql=''
/*
  =====================================================================================================================
  table tbl_cibles
  =====================================================================================================================
*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE
    /* meta((table,\''tbl_cibles\''),(nom_long_de_la_table,\''à faire tbl_cibles\''),(nom_court_de_la_table,\''à faire tbl_cibles\''),(nom_bref_de_la_table,\''à faire tbl_cibles\''),(transform_table_sur_svg,transform(translate(25,-13)))) */
     tbl_cibles( 
            /* meta((champ,\''chi_id_cible\''),(nom_long_du_champ,\''à faire chi_id_cible\''),(nom_court_du_champ,\''à faire chi_id_cible\''),(nom_bref_du_champ,\''à faire chi_id_cible\''),(typologie,\''chi\'')) */
             chi_id_cible INTEGER PRIMARY KEY ,
    
            /* meta((champ,\''chp_nom_cible\''),(nom_long_du_champ,\''à faire chp_nom_cible\''),(nom_court_du_champ,\''à faire chp_nom_cible\''),(nom_bref_du_champ,\''à faire chp_nom_cible\''),(typologie,\''cht\'')) */
             chp_nom_cible STRING,
    
            /* meta((champ,\''chp_dossier_cible\''),(nom_long_du_champ,\''à faire chp_dossier_cible\''),(nom_court_du_champ,\''à faire chp_dossier_cible\''),(nom_bref_du_champ,\''à faire chp_dossier_cible\''),(typologie,\''cho\'')) */
             chp_dossier_cible CHARACTER(3),
    
            /* meta((champ,\''chp_commentaire_cible\''),(nom_long_du_champ,\''à faire chp_commentaire_cible\''),(nom_court_du_champ,\''à faire chp_commentaire_cible\''),(nom_bref_du_champ,\''à faire chp_commentaire_cible\''),(typologie,\''cht\'')) */
             chp_commentaire_cible STRING
);
/*==============================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE  UNIQUE INDEX  idx_dossier_cible ON `tbl_cibles` 
        /* meta((index,\''idx_dossier_cible\''),(message,\''à faire idx_dossier_cible\'')) */
         ( `chp_dossier_cible` ) ;
/*
  =====================================================================================================================
  table tbl_dossiers
  =====================================================================================================================
*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE
    /* meta((table,\''tbl_dossiers\''),(nom_long_de_la_table,\''à faire tbl_dossiers\''),(nom_court_de_la_table,\''à faire tbl_dossiers\''),(nom_bref_de_la_table,\''à faire tbl_dossiers\''),(transform_table_sur_svg,transform(translate(188,220)))) */
     tbl_dossiers( 
            /* meta((champ,\''chi_id_dossier\''),(nom_long_du_champ,\''à faire chi_id_dossier\''),(nom_court_du_champ,\''à faire chi_id_dossier\''),(nom_bref_du_champ,\''à faire chi_id_dossier\''),(typologie,\''chi\'')) */
             chi_id_dossier INTEGER PRIMARY KEY ,
    
            /* meta((champ,\''chx_cible_dossier\''),(nom_long_du_champ,\''à faire chx_cible_dossier\''),(nom_court_du_champ,\''à faire chx_cible_dossier\''),(nom_bref_du_champ,\''à faire chx_cible_dossier\''),(typologie,\''chx\'')) */
             chx_cible_dossier INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
    
            /* meta((champ,\''chp_nom_dossier\''),(nom_long_du_champ,\''à faire chp_nom_dossier\''),(nom_court_du_champ,\''à faire chp_nom_dossier\''),(nom_bref_du_champ,\''à faire chp_nom_dossier\''),(typologie,\''cho\'')) */
             chp_nom_dossier CHARACTER(256)
);
/*==============================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE  UNIQUE INDEX  idx_cible_et_nom ON `tbl_dossiers` 
        /* meta((index,\''idx_cible_et_nom\''),(message,\''à faire idx_cible_et_nom\'')) */
         ( `chx_cible_dossier` , `chp_nom_dossier` ) ;
/*
  =====================================================================================================================
  table tbl_sources
  =====================================================================================================================
*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE
    /* meta((table,\''tbl_sources\''),(nom_long_de_la_table,\''à faire tbl_sources\''),(nom_court_de_la_table,\''à faire tbl_sources\''),(nom_bref_de_la_table,\''à faire tbl_sources\''),(transform_table_sur_svg,transform(translate(456,28)))) */
     tbl_sources( 
            /* meta((champ,\''chi_id_source\''),(nom_long_du_champ,\''à faire chi_id_source\''),(nom_court_du_champ,\''à faire chi_id_source\''),(nom_bref_du_champ,\''à faire chi_id_source\''),(typologie,\''chi\'')) */
             chi_id_source INTEGER PRIMARY KEY ,
    
            /* meta((champ,\''chx_cible_id_source\''),(nom_long_du_champ,\''à faire chx_cible_id_source\''),(nom_court_du_champ,\''à faire chx_cible_id_source\''),(nom_bref_du_champ,\''à faire chx_cible_id_source\''),(typologie,\''chx\'')) */
             chx_cible_id_source INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
    
            /* meta((champ,\''chp_nom_source\''),(nom_long_du_champ,\''à faire chp_nom_source\''),(nom_court_du_champ,\''à faire chp_nom_source\''),(nom_bref_du_champ,\''à faire chp_nom_source\''),(typologie,\''cho\'')) */
             chp_nom_source CHARACTER(256) NOT NULL DEFAULT  \''\'' ,
    
            /* meta((champ,\''chp_commentaire_source\''),(nom_long_du_champ,\''à faire chp_commentaire_source\''),(nom_court_du_champ,\''à faire chp_commentaire_source\''),(nom_bref_du_champ,\''à faire chp_commentaire_source\''),(typologie,\''cht\'')) */
             chp_commentaire_source TEXT,
    
            /* meta((champ,\''chx_dossier_id_source\''),(nom_long_du_champ,\''à faire chx_dossier_id_source\''),(nom_court_du_champ,\''à faire chx_dossier_id_source\''),(nom_bref_du_champ,\''à faire chx_dossier_id_source\''),(typologie,\''chx\'')) */
             chx_dossier_id_source INTEGER REFERENCES \''tbl_dossiers\''(\''chi_id_dossier\'') ,
    
            /* meta((champ,\''chp_rev_source\''),(nom_long_du_champ,\''à faire chp_rev_source\''),(nom_court_du_champ,\''à faire chp_rev_source\''),(nom_bref_du_champ,\''à faire chp_rev_source\''),(typologie,\''cht\'')) */
             chp_rev_source TEXT,
    
            /* meta((champ,\''chp_genere_source\''),(nom_long_du_champ,\''à faire chp_genere_source\''),(nom_court_du_champ,\''à faire chp_genere_source\''),(nom_bref_du_champ,\''à faire chp_genere_source\''),(typologie,\''cht\'')) */
             chp_genere_source TEXT,
    
            /* meta((champ,\''chp_type_source\''),(nom_long_du_champ,\''à faire chp_type_source\''),(nom_court_du_champ,\''à faire chp_type_source\''),(nom_bref_du_champ,\''à faire chp_type_source\''),(typologie,\''cht\'')) */
             chp_type_source TEXT NOT NULL DEFAULT  \''normal\'' 
);
/*==============================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE  UNIQUE INDEX  idx_nom_et_dossier ON `tbl_sources` 
        /* meta((index,\''idx_nom_et_dossier\''),(message,\''à faire idx_nom_et_dossier\'')) */
         ( `chx_dossier_id_source` , `chp_nom_source` ) ;
/*
  =====================================================================================================================
  table tbl_utilisateurs
  =====================================================================================================================
*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE
    /* meta((table,\''tbl_utilisateurs\''),(nom_long_de_la_table,\''à faire tbl_utilisateurs\''),(nom_court_de_la_table,\''à faire tbl_utilisateurs\''),(nom_bref_de_la_table,\''à faire tbl_utilisateurs\''),(transform_table_sur_svg,transform(translate(36,324)))) */
     tbl_utilisateurs( 
            /* meta((champ,\''chi_id_utilisateur\''),(nom_long_du_champ,\''à faire chi_id_utilisateur\''),(nom_court_du_champ,\''à faire chi_id_utilisateur\''),(nom_bref_du_champ,\''à faire chi_id_utilisateur\''),(typologie,\''chi\'')) */
             chi_id_utilisateur INTEGER PRIMARY KEY ,
    
            /* meta((champ,\''chp_nom_de_connexion_utilisateur\''),(nom_long_du_champ,\''à faire chp_nom_de_connexion_utilisateur\''),(nom_court_du_champ,\''à faire chp_nom_de_connexion_utilisateur\''),(nom_bref_du_champ,\''à faire chp_nom_de_connexion_utilisateur\''),(typologie,\''cht\'')) */
             chp_nom_de_connexion_utilisateur STRING,
    
            /* meta((champ,\''chp_mot_de_passe_utilisateur\''),(nom_long_du_champ,\''à faire chp_mot_de_passe_utilisateur\''),(nom_court_du_champ,\''à faire chp_mot_de_passe_utilisateur\''),(nom_bref_du_champ,\''à faire chp_mot_de_passe_utilisateur\''),(typologie,\''cht\'')) */
             chp_mot_de_passe_utilisateur STRING,
    
            /* meta((champ,\''chp_parametres_utilisateur\''),(nom_long_du_champ,\''à faire chp_parametres_utilisateur\''),(nom_court_du_champ,\''à faire chp_parametres_utilisateur\''),(nom_bref_du_champ,\''à faire chp_parametres_utilisateur\''),(typologie,\''cht\'')) */
             chp_parametres_utilisateur TEXT,
    
            /* meta((champ,\''chp_commentaire_utilisateur\''),(nom_long_du_champ,\''à faire chp_commentaire_utilisateur\''),(nom_court_du_champ,\''à faire chp_commentaire_utilisateur\''),(nom_bref_du_champ,\''à faire chp_commentaire_utilisateur\''),(typologie,\''cht\'')) */
             chp_commentaire_utilisateur TEXT
);
/*==============================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE  UNIQUE INDEX  idxNomUtilisateur ON `tbl_utilisateurs` 
        /* meta((index,\''idxNomUtilisateur\''),(message,\''à faire idxNomUtilisateur\'')) */
         ( `chp_nom_de_connexion_utilisateur` ) ;
/*
  =====================================================================================================================
  table tbl_taches
  =====================================================================================================================
*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE
    /* meta((table,\''tbl_taches\''),(nom_long_de_la_table,\''à faire tbl_taches\''),(nom_court_de_la_table,\''à faire tbl_taches\''),(nom_bref_de_la_table,\''à faire tbl_taches\''),(transform_table_sur_svg,transform(translate(306,381)))) */
     tbl_taches( 
            /* meta((champ,\''chi_id_tache\''),(nom_long_du_champ,\''à faire chi_id_tache\''),(nom_court_du_champ,\''à faire chi_id_tache\''),(nom_bref_du_champ,\''à faire chi_id_tache\''),(typologie,\''chi\'')) */
             chi_id_tache INTEGER PRIMARY KEY ,
    
            /* meta((champ,\''chx_utilisateur_tache\''),(nom_long_du_champ,\''à faire chx_utilisateur_tache\''),(nom_court_du_champ,\''à faire chx_utilisateur_tache\''),(nom_bref_du_champ,\''à faire chx_utilisateur_tache\''),(typologie,\''chx\'')) */
             chx_utilisateur_tache INTEGER REFERENCES \''tbl_utilisateurs\''(\''chi_id_utilisateur\'') ,
    
            /* meta((champ,\''chp_texte_tache\''),(nom_long_du_champ,\''à faire chp_texte_tache\''),(nom_court_du_champ,\''à faire chp_texte_tache\''),(nom_bref_du_champ,\''à faire chp_texte_tache\''),(typologie,\''cht\'')) */
             chp_texte_tache TEXT,
    
            /* meta((champ,\''chp_priorite_tache\''),(nom_long_du_champ,\''à faire chp_priorite_tache\''),(nom_court_du_champ,\''à faire chp_priorite_tache\''),(nom_bref_du_champ,\''à faire chp_priorite_tache\''),(typologie,\''che\'')) */
             chp_priorite_tache INTEGER
);
/*
  =====================================================================================================================
  table tbl_bases_de_donnees
  =====================================================================================================================
*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE
    /* meta((table,\''tbl_bases_de_donnees\''),(nom_long_de_la_table,\''à faire tbl_bases_de_donnees\''),(nom_court_de_la_table,\''à faire tbl_bases_de_donnees\''),(nom_bref_de_la_table,\''à faire tbl_bases_de_donnees\''),(transform_table_sur_svg,transform(translate(489,238)))) */
     tbl_bases_de_donnees( 
            /* meta((champ,\''chi_id_basedd\''),(nom_long_du_champ,\''à faire chi_id_basedd\''),(nom_court_du_champ,\''à faire chi_id_basedd\''),(nom_bref_du_champ,\''à faire chi_id_basedd\''),(typologie,\''chi\'')) */
             chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT,
    
            /* meta((champ,\''chx_dossier_id_basedd\''),(nom_long_du_champ,\''à faire chx_dossier_id_basedd\''),(nom_court_du_champ,\''à faire chx_dossier_id_basedd\''),(nom_bref_du_champ,\''à faire chx_dossier_id_basedd\''),(typologie,\''chx\'')) */
             chx_dossier_id_basedd INTEGER REFERENCES \''tbl_dossiers\''(\''chi_id_dossier\'') ,
    
            /* meta((champ,\''chx_cible_id_basedd\''),(nom_long_du_champ,\''à faire chx_cible_id_basedd\''),(nom_court_du_champ,\''à faire chx_cible_id_basedd\''),(nom_bref_du_champ,\''à faire chx_cible_id_basedd\''),(typologie,\''chx\'')) */
             chx_cible_id_basedd INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
    
            /* meta((champ,\''chp_nom_basedd\''),(nom_long_du_champ,\''à faire chp_nom_basedd\''),(nom_court_du_champ,\''à faire chp_nom_basedd\''),(nom_bref_du_champ,\''à faire chp_nom_basedd\''),(typologie,\''cht\'')) */
             chp_nom_basedd TEXT NOT NULL DEFAULT  \''\'' ,
    
            /* meta((champ,\''chp_rev_basedd\''),(nom_long_du_champ,\''à faire chp_rev_basedd\''),(nom_court_du_champ,\''à faire chp_rev_basedd\''),(nom_bref_du_champ,\''à faire chp_rev_basedd\''),(typologie,\''cht\'')) */
             chp_rev_basedd TEXT,
    
            /* meta((champ,\''chp_commentaire_basedd\''),(nom_long_du_champ,\''à faire chp_commentaire_basedd\''),(nom_court_du_champ,\''à faire chp_commentaire_basedd\''),(nom_bref_du_champ,\''à faire chp_commentaire_basedd\''),(typologie,\''cht\'')) */
             chp_commentaire_basedd TEXT,
    
            /* meta((champ,\''chp_genere_basedd\''),(nom_long_du_champ,\''à faire chp_genere_basedd\''),(nom_court_du_champ,\''à faire chp_genere_basedd\''),(nom_bref_du_champ,\''à faire chp_genere_basedd\''),(typologie,\''cht\'')) */
             chp_genere_basedd TEXT,
    
            /* meta((champ,\''chp_php_basedd\''),(nom_long_du_champ,\''à faire chp_php_basedd\''),(nom_court_du_champ,\''à faire chp_php_basedd\''),(nom_bref_du_champ,\''à faire chp_php_basedd\''),(typologie,\''cht\'')) */
             chp_php_basedd TEXT,
    
            /* meta((champ,\''chp_rev_travail_basedd\''),(nom_long_du_champ,\''à faire chp_rev_travail_basedd\''),(nom_court_du_champ,\''à faire chp_rev_travail_basedd\''),(nom_bref_du_champ,\''à faire chp_rev_travail_basedd\''),(typologie,\''cht\'')) */
             chp_rev_travail_basedd TEXT,
    
            /* meta((champ,\''chp_fournisseur_basedd\''),(nom_long_du_champ,\''à faire chp_fournisseur_basedd\''),(nom_court_du_champ,\''à faire chp_fournisseur_basedd\''),(nom_bref_du_champ,\''à faire chp_fournisseur_basedd\''),(typologie,\''cht\'')) */
             chp_fournisseur_basedd TEXT NOT NULL DEFAULT  \''sqlite\'' 
);
/*==============================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE  UNIQUE INDEX  idx_nom_basedd ON `tbl_bases_de_donnees` 
        /* meta((index,\''idx_nom_basedd\''),(message,\''à faire idx_nom_basedd\'')) */
         ( `chp_nom_basedd` , `chx_cible_id_basedd` ) ;
/*
  =====================================================================================================================
  table tbl_revs
  =====================================================================================================================
*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE
    /* meta((table,\''tbl_revs\''),(nom_long_de_la_table,\''à faire tbl_revs\''),(nom_court_de_la_table,\''à faire tbl_revs\''),(nom_bref_de_la_table,\''à faire tbl_revs\''),(transform_table_sur_svg,transform(translate(656,-133)))) */
     tbl_revs( 
            /* meta((champ,\''chi_id_rev\''),(nom_long_du_champ,\''à faire chi_id_rev\''),(nom_court_du_champ,\''à faire chi_id_rev\''),(nom_bref_du_champ,\''à faire chi_id_rev\''),(typologie,\''chi\'')) */
             chi_id_rev INTEGER PRIMARY KEY ,
    
            /* meta((champ,\''chx_cible_rev\''),(nom_long_du_champ,\''à faire chx_cible_rev\''),(nom_court_du_champ,\''à faire chx_cible_rev\''),(nom_bref_du_champ,\''à faire chx_cible_rev\''),(typologie,\''chx\'')) */
             chx_cible_rev INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
    
            /* meta((champ,\''chp_provenance_rev\''),(nom_long_du_champ,\''à faire chp_provenance_rev\''),(nom_court_du_champ,\''à faire chp_provenance_rev\''),(nom_bref_du_champ,\''à faire chp_provenance_rev\''),(typologie,\''cho\'')) */
             chp_provenance_rev CHARACTER(32),
    
            /* meta((champ,\''chx_source_rev\''),(nom_long_du_champ,\''à faire chx_source_rev\''),(nom_court_du_champ,\''à faire chx_source_rev\''),(nom_bref_du_champ,\''à faire chx_source_rev\''),(typologie,\''chx\'')) */
             chx_source_rev INTEGER REFERENCES \''tbl_sources\''(\''chi_id_source\'') ,
    
            /* meta((champ,\''chp_id_rev\''),(nom_long_du_champ,\''à faire chp_id_rev\''),(nom_court_du_champ,\''à faire chp_id_rev\''),(nom_bref_du_champ,\''à faire chp_id_rev\''),(typologie,\''che\'')) */
             chp_id_rev INTEGER,
    
            /* meta((champ,\''chp_valeur_rev\''),(nom_long_du_champ,\''à faire chp_valeur_rev\''),(nom_court_du_champ,\''à faire chp_valeur_rev\''),(nom_bref_du_champ,\''à faire chp_valeur_rev\''),(typologie,\''cht\'')) */
             chp_valeur_rev TEXT,
    
            /* meta((champ,\''chp_type_rev\''),(nom_long_du_champ,\''à faire chp_type_rev\''),(nom_court_du_champ,\''à faire chp_type_rev\''),(nom_bref_du_champ,\''à faire chp_type_rev\''),(typologie,\''cho\'')) */
             chp_type_rev CHARACTER(4),
    
            /* meta((champ,\''chp_niveau_rev\''),(nom_long_du_champ,\''à faire chp_niveau_rev\''),(nom_court_du_champ,\''à faire chp_niveau_rev\''),(nom_bref_du_champ,\''à faire chp_niveau_rev\''),(typologie,\''che\'')) */
             chp_niveau_rev INTEGER,
    
            /* meta((champ,\''chp_quotee_rev\''),(nom_long_du_champ,\''à faire chp_quotee_rev\''),(nom_court_du_champ,\''à faire chp_quotee_rev\''),(nom_bref_du_champ,\''à faire chp_quotee_rev\''),(typologie,\''che\'')) */
             chp_quotee_rev INTEGER,
    
            /* meta((champ,\''chp_pos_premier_rev\''),(nom_long_du_champ,\''à faire chp_pos_premier_rev\''),(nom_court_du_champ,\''à faire chp_pos_premier_rev\''),(nom_bref_du_champ,\''à faire chp_pos_premier_rev\''),(typologie,\''che\'')) */
             chp_pos_premier_rev INTEGER,
    
            /* meta((champ,\''chp_pos_dernier_rev\''),(nom_long_du_champ,\''à faire chp_pos_dernier_rev\''),(nom_court_du_champ,\''à faire chp_pos_dernier_rev\''),(nom_bref_du_champ,\''à faire chp_pos_dernier_rev\''),(typologie,\''che\'')) */
             chp_pos_dernier_rev INTEGER,
    
            /* meta((champ,\''chp_parent_rev\''),(nom_long_du_champ,\''à faire chp_parent_rev\''),(nom_court_du_champ,\''à faire chp_parent_rev\''),(nom_bref_du_champ,\''à faire chp_parent_rev\''),(typologie,\''che\'')) */
             chp_parent_rev INTEGER,
    
            /* meta((champ,\''chp_nbr_enfants_rev\''),(nom_long_du_champ,\''à faire chp_nbr_enfants_rev\''),(nom_court_du_champ,\''à faire chp_nbr_enfants_rev\''),(nom_bref_du_champ,\''à faire chp_nbr_enfants_rev\''),(typologie,\''che\'')) */
             chp_nbr_enfants_rev INTEGER,
    
            /* meta((champ,\''chp_num_enfant_rev\''),(nom_long_du_champ,\''à faire chp_num_enfant_rev\''),(nom_court_du_champ,\''à faire chp_num_enfant_rev\''),(nom_bref_du_champ,\''à faire chp_num_enfant_rev\''),(typologie,\''che\'')) */
             chp_num_enfant_rev INTEGER,
    
            /* meta((champ,\''chp_profondeur_rev\''),(nom_long_du_champ,\''à faire chp_profondeur_rev\''),(nom_court_du_champ,\''à faire chp_profondeur_rev\''),(nom_bref_du_champ,\''à faire chp_profondeur_rev\''),(typologie,\''che\'')) */
             chp_profondeur_rev INTEGER,
    
            /* meta((champ,\''chp_pos_ouver_parenthese_rev\''),(nom_long_du_champ,\''à faire chp_pos_ouver_parenthese_rev\''),(nom_court_du_champ,\''à faire chp_pos_ouver_parenthese_rev\''),(nom_bref_du_champ,\''à faire chp_pos_ouver_parenthese_rev\''),(typologie,\''che\'')) */
             chp_pos_ouver_parenthese_rev INTEGER,
    
            /* meta((champ,\''chp_pos_fermer_parenthese_rev\''),(nom_long_du_champ,\''à faire chp_pos_fermer_parenthese_rev\''),(nom_court_du_champ,\''à faire chp_pos_fermer_parenthese_rev\''),(nom_bref_du_champ,\''à faire chp_pos_fermer_parenthese_rev\''),(typologie,\''che\'')) */
             chp_pos_fermer_parenthese_rev INTEGER,
    
            /* meta((champ,\''chp_commentaire_rev\''),(nom_long_du_champ,\''à faire chp_commentaire_rev\''),(nom_court_du_champ,\''à faire chp_commentaire_rev\''),(nom_bref_du_champ,\''à faire chp_commentaire_rev\''),(typologie,\''cht\'')) */
             chp_commentaire_rev TEXT
);
/*==============================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE  UNIQUE INDEX  idx_ligne_rev ON `tbl_revs` 
        /* meta((index,\''idx_ligne_rev\''),(message,\''à faire idx_ligne_rev\'')) */
         ( `chx_cible_rev` , `chp_provenance_rev` , `chx_source_rev` , `chp_id_rev` ) ;'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
if(    $uneErreur===true){
 if((false === $db->exec(''ROLLBACK''))){
     echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre>'' ;
     $uneErreur=true;
 }
}else{
 if((false === $db->exec(''COMMIT''))){
     echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre>'' ;
 }else{
     echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>Bon travail</pre>'' ;
 }
}
/*============================================*/
/*============================================*/
/*============================================*/

/* ====== */
$sql=''INSERT INTO `tbl_cibles`(
    `chi_id_cible`                             ,   `chp_nom_cible`                            ,   `chp_dossier_cible`                        ,   `chp_commentaire_cible`                    
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_cible''                     => $arr[0],
     ''T0.chp_nom_cible''                    => $arr[1],
     ''T0.chp_dossier_cible''                => $arr[2],
     ''T0.chp_commentaire_cible''            => $arr[3],
    );


/* ====== */
$sql=''INSERT INTO `tbl_dossiers`(
    `chi_id_dossier`                           ,   `chx_cible_dossier`                        ,   `chp_nom_dossier`                          
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_dossier''                   => $arr[0],
     ''T0.chx_cible_dossier''                => $arr[1],
     ''T0.chp_nom_dossier''                  => $arr[2],
    );


/* ====== */
$sql=''INSERT INTO `tbl_sources`(
    `chi_id_source`                            ,   `chx_cible_id_source`                      ,   `chp_nom_source`                           ,   `chp_commentaire_source`                   ,   `chx_dossier_id_source`                    
,   `chp_rev_source`                           ,   `chp_genere_source`                        ,   `chp_type_source`                          
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          ,\''''.sq0($tab[4]).''\''                          
,\''''.sq0($tab[5]).''\''                          ,\''''.sq0($tab[6]).''\''                          ,\''''.sq0($tab[7]).''\''                          
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_source''                    => $arr[0],
     ''T0.chx_cible_id_source''              => $arr[1],
     ''T0.chp_nom_source''                   => $arr[2],
     ''T0.chp_commentaire_source''           => $arr[3],
     ''T0.chx_dossier_id_source''            => $arr[4],
     ''T0.chp_rev_source''                   => $arr[5],
     ''T0.chp_genere_source''                => $arr[6],
     ''T0.chp_type_source''                  => $arr[7],
    );


/* ====== */
$sql=''INSERT INTO `tbl_utilisateurs`(
    `chi_id_utilisateur`                       ,   `chp_nom_de_connexion_utilisateur`         ,   `chp_mot_de_passe_utilisateur`             ,   `chp_parametres_utilisateur`               ,   `chp_commentaire_utilisateur`              
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          ,\''''.sq0($tab[4]).''\''                          
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_utilisateur''               => $arr[0],
     ''T0.chp_nom_de_connexion_utilisateur'' => $arr[1],
     ''T0.chp_mot_de_passe_utilisateur''     => $arr[2],
     ''T0.chp_parametres_utilisateur''       => $arr[3],
     ''T0.chp_commentaire_utilisateur''      => $arr[4],
    );


/* ====== */
$sql=''INSERT INTO `tbl_taches`(
    `chi_id_tache`                             ,   `chx_utilisateur_tache`                    ,   `chp_texte_tache`                          ,   `chp_priorite_tache`                       
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_tache''                     => $arr[0],
     ''T0.chx_utilisateur_tache''            => $arr[1],
     ''T0.chp_texte_tache''                  => $arr[2],
     ''T0.chp_priorite_tache''               => $arr[3],
    );


/* ====== */
$sql=''INSERT INTO `tbl_bases_de_donnees`(
    `chi_id_basedd`                            ,   `chx_dossier_id_basedd`                    ,   `chx_cible_id_basedd`                      ,   `chp_nom_basedd`                           ,   `chp_rev_basedd`                           
,   `chp_commentaire_basedd`                   ,   `chp_genere_basedd`                        ,   `chp_php_basedd`                           ,   `chp_rev_travail_basedd`                   ,   `chp_fournisseur_basedd`                   
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          ,\''''.sq0($tab[4]).''\''                          
,\''''.sq0($tab[5]).''\''                          ,\''''.sq0($tab[6]).''\''                          ,\''''.sq0($tab[7]).''\''                          ,\''''.sq0($tab[8]).''\''                          ,\''''.sq0($tab[9]).''\''                          
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_basedd''                    => $arr[0],
     ''T0.chx_dossier_id_basedd''            => $arr[1],
     ''T0.chx_cible_id_basedd''              => $arr[2],
     ''T0.chp_nom_basedd''                   => $arr[3],
     ''T0.chp_rev_basedd''                   => $arr[4],
     ''T0.chp_commentaire_basedd''           => $arr[5],
     ''T0.chp_genere_basedd''                => $arr[6],
     ''T0.chp_php_basedd''                   => $arr[7],
     ''T0.chp_rev_travail_basedd''           => $arr[8],
     ''T0.chp_fournisseur_basedd''           => $arr[9],
    );


/* ====== */
$sql=''INSERT INTO `tbl_revs`(
    `chi_id_rev`                               ,   `chx_cible_rev`                            ,   `chp_provenance_rev`                       ,   `chx_source_rev`                           ,   `chp_id_rev`                               
,   `chp_valeur_rev`                           ,   `chp_type_rev`                             ,   `chp_niveau_rev`                           ,   `chp_quotee_rev`                           ,   `chp_pos_premier_rev`                      
,   `chp_pos_dernier_rev`                      ,   `chp_parent_rev`                           ,   `chp_nbr_enfants_rev`                      ,   `chp_num_enfant_rev`                       ,   `chp_profondeur_rev`                       
,   `chp_pos_ouver_parenthese_rev`             ,   `chp_pos_fermer_parenthese_rev`            ,   `chp_commentaire_rev`                      
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          ,\''''.sq0($tab[4]).''\''                          
,\''''.sq0($tab[5]).''\''                          ,\''''.sq0($tab[6]).''\''                          ,\''''.sq0($tab[7]).''\''                          ,\''''.sq0($tab[8]).''\''                          ,\''''.sq0($tab[9]).''\''                          
,\''''.sq0($tab[10]).''\''                         ,\''''.sq0($tab[11]).''\''                         ,\''''.sq0($tab[12]).''\''                         ,\''''.sq0($tab[13]).''\''                         ,\''''.sq0($tab[14]).''\''                         
,\''''.sq0($tab[15]).''\''                         ,\''''.sq0($tab[16]).''\''                         ,\''''.sq0($tab[17]).''\''                         
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_rev''                       => $arr[0],
     ''T0.chx_cible_rev''                    => $arr[1],
     ''T0.chp_provenance_rev''               => $arr[2],
     ''T0.chx_source_rev''                   => $arr[3],
     ''T0.chp_id_rev''                       => $arr[4],
     ''T0.chp_valeur_rev''                   => $arr[5],
     ''T0.chp_type_rev''                     => $arr[6],
     ''T0.chp_niveau_rev''                   => $arr[7],
     ''T0.chp_quotee_rev''                   => $arr[8],
     ''T0.chp_pos_premier_rev''              => $arr[9],
     ''T0.chp_pos_dernier_rev''              => $arr[10],
     ''T0.chp_parent_rev''                   => $arr[11],
     ''T0.chp_nbr_enfants_rev''              => $arr[12],
     ''T0.chp_num_enfant_rev''               => $arr[13],
     ''T0.chp_profondeur_rev''               => $arr[14],
     ''T0.chp_pos_ouver_parenthese_rev''     => $arr[15],
     ''T0.chp_pos_fermer_parenthese_rev''    => $arr[16],
     ''T0.chp_commentaire_rev''              => $arr[17],
    );

','
meta((default_charset,''utf8mb4''),(collate,''utf8mb4_unicode_ci''),(transform_base_sur_svg,transform(translate(7.5,125.5)))
),
#(
  ================
  liste des tables
  ================
),
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_cibles''),
meta((table,''tbl_cibles''),(nom_long_de_la_table,''à faire tbl_cibles''),(nom_court_de_la_table,''à faire tbl_cibles''),(nom_bref_de_la_table,''à faire tbl_cibles''),(transform_table_sur_svg,transform(translate(21,-122)))
),
 fields(
  field(nom_du_champ(chi_id_cible),type(INTEGER),primary_key(),meta((champ,''chi_id_cible''),(nom_long_du_champ,''à faire chi_id_cible''),(nom_court_du_champ,''à faire chi_id_cible''),(nom_bref_du_champ,''à faire chi_id_cible''),(typologie,''chi'')))
  field(nom_du_champ(chp_nom_cible),type(STRING),meta((champ,''chp_nom_cible''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')))
  field(nom_du_champ(chp_dossier_cible),type(CHARACTER,3),meta((champ,''chp_dossier_cible''),(nom_long_du_champ,''à faire chp_dossier_cible''),(nom_court_du_champ,''à faire chp_dossier_cible''),(nom_bref_du_champ,''à faire chp_dossier_cible''),(typologie,''cho'')))
  field(nom_du_champ(chp_commentaire_cible),type(STRING),meta((champ,''chp_commentaire_cible''),(nom_long_du_champ,''à faire chp_commentaire_cible''),(nom_court_du_champ,''à faire chp_commentaire_cible''),(nom_bref_du_champ,''à faire chp_commentaire_cible''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_cibles''),unique(),index_name(''idx_dossier_cible''),fields(''chp_dossier_cible''),meta((index,''idx_dossier_cible''),(message,''à faire idx_dossier_cible'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_dossiers''),
meta((table,''tbl_dossiers''),(nom_long_de_la_table,''à faire tbl_dossiers''),(nom_court_de_la_table,''à faire tbl_dossiers''),(nom_bref_de_la_table,''à faire tbl_dossiers''),(transform_table_sur_svg,transform(translate(321,-10)))
),
 fields(
  field(nom_du_champ(chi_id_dossier),type(INTEGER),primary_key(),meta((champ,''chi_id_dossier''),(nom_long_du_champ,''à faire chi_id_dossier''),(nom_court_du_champ,''à faire chi_id_dossier''),(nom_bref_du_champ,''à faire chi_id_dossier''),(typologie,''chi'')))
  field(nom_du_champ(''chx_cible_dossier''),type(''INTEGER''),references(tbl_cibles,chi_id_cible),non_nulle(),meta((champ,''chx_cible_dossier''),(nom_long_du_champ,''à faire chx_cible_dossier''),(nom_court_du_champ,''à faire chx_cible_dossier''),(nom_bref_du_champ,''à faire chx_cible_dossier''),(typologie,''chx'')))
  field(nom_du_champ(chp_nom_dossier),type(CHARACTER,256),meta((champ,''chp_nom_dossier''),(nom_long_du_champ,''à faire chp_nom_dossier''),(nom_court_du_champ,''à faire chp_nom_dossier''),(nom_bref_du_champ,''à faire chp_nom_dossier''),(typologie,''cho'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_dossiers''),unique(),index_name(''idx_cible_et_nom''),fields(''chx_cible_dossier'',''chp_nom_dossier''),meta((index,''idx_cible_et_nom''),(message,''à faire idx_cible_et_nom'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_sources''),
meta((table,''tbl_sources''),(nom_long_de_la_table,''à faire tbl_sources''),(nom_court_de_la_table,''à faire tbl_sources''),(nom_bref_de_la_table,''à faire tbl_sources''),(transform_table_sur_svg,transform(translate(465,-62)))
),
 fields(
  field(nom_du_champ(chi_id_source),type(INTEGER),primary_key(),meta((champ,''chi_id_source''),(nom_long_du_champ,''à faire chi_id_source''),(nom_court_du_champ,''à faire chi_id_source''),(nom_bref_du_champ,''à faire chi_id_source''),(typologie,''chi'')))
  field(nom_du_champ(''chx_cible_id_source''),type(''INTEGER''),references(tbl_cibles,chi_id_cible),non_nulle(),meta((champ,''chx_cible_id_source''),(nom_long_du_champ,''à faire chx_cible_id_source''),(nom_court_du_champ,''à faire chx_cible_id_source''),(nom_bref_du_champ,''à faire chx_cible_id_source''),(typologie,''chx'')))
  field(nom_du_champ(chp_nom_source),type(CHARACTER,256),not_null(),default(''''),meta((champ,''chp_nom_source''),(nom_long_du_champ,''à faire chp_nom_source''),(nom_court_du_champ,''à faire chp_nom_source''),(nom_bref_du_champ,''à faire chp_nom_source''),(typologie,''cho'')))
  field(nom_du_champ(chp_commentaire_source),type(TEXT),meta((champ,''chp_commentaire_source''),(nom_long_du_champ,''à faire chp_commentaire_source''),(nom_court_du_champ,''à faire chp_commentaire_source''),(nom_bref_du_champ,''à faire chp_commentaire_source''),(typologie,''cht'')))
  field(nom_du_champ(chx_dossier_id_source),type(INTEGER),references(''tbl_dossiers'',''chi_id_dossier''),meta((champ,''chx_dossier_id_source''),(nom_long_du_champ,''à faire chx_dossier_id_source''),(nom_court_du_champ,''à faire chx_dossier_id_source''),(nom_bref_du_champ,''à faire chx_dossier_id_source''),(typologie,''chx'')))
  field(nom_du_champ(chp_rev_source),type(TEXT),meta((champ,''chp_rev_source''),(nom_long_du_champ,''à faire chp_rev_source''),(nom_court_du_champ,''à faire chp_rev_source''),(nom_bref_du_champ,''à faire chp_rev_source''),(typologie,''cht'')))
  field(nom_du_champ(chp_genere_source),type(TEXT),meta((champ,''chp_genere_source''),(nom_long_du_champ,''à faire chp_genere_source''),(nom_court_du_champ,''à faire chp_genere_source''),(nom_bref_du_champ,''à faire chp_genere_source''),(typologie,''cht'')))
  field(nom_du_champ(chp_type_source),type(TEXT),not_null(),default(''normal''),meta((champ,''chp_type_source''),(nom_long_du_champ,''à faire chp_type_source''),(nom_court_du_champ,''à faire chp_type_source''),(nom_bref_du_champ,''à faire chp_type_source''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_sources''),unique(),index_name(''idx_nom_et_dossier''),fields(''chx_dossier_id_source'',''chp_nom_source''),meta((index,''idx_nom_et_dossier''),(message,''à faire idx_nom_et_dossier'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_utilisateurs''),
meta((table,''tbl_utilisateurs''),(nom_long_de_la_table,''à faire tbl_utilisateurs''),(nom_court_de_la_table,''à faire tbl_utilisateurs''),(nom_bref_de_la_table,''à faire tbl_utilisateurs''),(transform_table_sur_svg,transform(translate(5,100)))
),
 fields(
  field(nom_du_champ(chi_id_utilisateur),type(INTEGER),primary_key(),meta((champ,''chi_id_utilisateur''),(nom_long_du_champ,''à faire chi_id_utilisateur''),(nom_court_du_champ,''à faire chi_id_utilisateur''),(nom_bref_du_champ,''à faire chi_id_utilisateur''),(typologie,''chi'')))
  field(nom_du_champ(chp_nom_de_connexion_utilisateur),type(STRING),meta((champ,''chp_nom_de_connexion_utilisateur''),(nom_long_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_court_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_bref_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_mot_de_passe_utilisateur),type(STRING),meta((champ,''chp_mot_de_passe_utilisateur''),(nom_long_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_court_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_bref_du_champ,''à faire chp_mot_de_passe_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_parametres_utilisateur),type(TEXT),meta((champ,''chp_parametres_utilisateur''),(nom_long_du_champ,''à faire chp_parametres_utilisateur''),(nom_court_du_champ,''à faire chp_parametres_utilisateur''),(nom_bref_du_champ,''à faire chp_parametres_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_commentaire_utilisateur),type(TEXT),meta((champ,''chp_commentaire_utilisateur''),(nom_long_du_champ,''à faire chp_commentaire_utilisateur''),(nom_court_du_champ,''à faire chp_commentaire_utilisateur''),(nom_bref_du_champ,''à faire chp_commentaire_utilisateur''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_utilisateurs''),unique(),index_name(''idxNomUtilisateur''),fields(''chp_nom_de_connexion_utilisateur''),meta((index,''idxNomUtilisateur''),(message,''à faire idxNomUtilisateur'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_taches''),
meta((table,''tbl_taches''),(nom_long_de_la_table,''à faire tbl_taches''),(nom_court_de_la_table,''à faire tbl_taches''),(nom_bref_de_la_table,''à faire tbl_taches''),(transform_table_sur_svg,transform(translate(255,228)))
),
 fields(
  field(nom_du_champ(chi_id_tache),type(INTEGER),primary_key(),meta((champ,''chi_id_tache''),(nom_long_du_champ,''à faire chi_id_tache''),(nom_court_du_champ,''à faire chi_id_tache''),(nom_bref_du_champ,''à faire chi_id_tache''),(typologie,''chi'')))
  field(nom_du_champ(''chx_utilisateur_tache''),type(''INTEGER''),references(tbl_utilisateurs,chi_id_utilisateur),non_nulle(),meta((champ,''chx_utilisateur_tache''),(nom_long_du_champ,''à faire chx_utilisateur_tache''),(nom_court_du_champ,''à faire chx_utilisateur_tache''),(nom_bref_du_champ,''à faire chx_utilisateur_tache''),(typologie,''chx'')))
  field(nom_du_champ(chp_texte_tache),type(TEXT),meta((champ,''chp_texte_tache''),(nom_long_du_champ,''à faire chp_texte_tache''),(nom_court_du_champ,''à faire chp_texte_tache''),(nom_bref_du_champ,''à faire chp_texte_tache''),(typologie,''cht'')))
  field(nom_du_champ(chp_priorite_tache),type(INTEGER),meta((champ,''chp_priorite_tache''),(nom_long_du_champ,''à faire chp_priorite_tache''),(nom_court_du_champ,''à faire chp_priorite_tache''),(nom_bref_du_champ,''à faire chp_priorite_tache''),(typologie,''che'')))
 ),
)
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_revs''),
meta((table,''tbl_revs''),(nom_long_de_la_table,''à faire tbl_revs''),(nom_court_de_la_table,''à faire tbl_revs''),(nom_bref_de_la_table,''à faire tbl_revs''),(transform_table_sur_svg,transform(translate(655,-117)))
),
 fields(
  field(nom_du_champ(chi_id_rev),type(INTEGER),primary_key(),meta((champ,''chi_id_rev''),(nom_long_du_champ,''à faire chi_id_rev''),(nom_court_du_champ,''à faire chi_id_rev''),(nom_bref_du_champ,''à faire chi_id_rev''),(typologie,''chi'')))
  field(nom_du_champ(''chx_cible_rev''),type(''INTEGER''),references(tbl_cibles,chi_id_cible),non_nulle(),meta((champ,''chx_cible_rev''),(nom_long_du_champ,''à faire chx_cible_rev''),(nom_court_du_champ,''à faire chx_cible_rev''),(nom_bref_du_champ,''à faire chx_cible_rev''),(typologie,''chx'')))
  field(nom_du_champ(chp_provenance_rev),type(CHARACTER,32),meta((champ,''chp_provenance_rev''),(nom_long_du_champ,''à faire chp_provenance_rev''),(nom_court_du_champ,''à faire chp_provenance_rev''),(nom_bref_du_champ,''à faire chp_provenance_rev''),(typologie,''cho'')))
  field(nom_du_champ(''chx_source_rev''),type(''INTEGER''),references(tbl_sources,chi_id_source),non_nulle(),meta((champ,''chx_source_rev''),(nom_long_du_champ,''à faire chx_source_rev''),(nom_court_du_champ,''à faire chx_source_rev''),(nom_bref_du_champ,''à faire chx_source_rev''),(typologie,''chx'')))
  field(nom_du_champ(chp_id_rev),type(INTEGER),meta((champ,''chp_id_rev''),(nom_long_du_champ,''à faire chp_id_rev''),(nom_court_du_champ,''à faire chp_id_rev''),(nom_bref_du_champ,''à faire chp_id_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_valeur_rev),type(TEXT),meta((champ,''chp_valeur_rev''),(nom_long_du_champ,''à faire chp_valeur_rev''),(nom_court_du_champ,''à faire chp_valeur_rev''),(nom_bref_du_champ,''à faire chp_valeur_rev''),(typologie,''cht'')))
  field(nom_du_champ(chp_type_rev),type(CHARACTER,4),meta((champ,''chp_type_rev''),(nom_long_du_champ,''à faire chp_type_rev''),(nom_court_du_champ,''à faire chp_type_rev''),(nom_bref_du_champ,''à faire chp_type_rev''),(typologie,''cho'')))
  field(nom_du_champ(chp_niveau_rev),type(INTEGER),meta((champ,''chp_niveau_rev''),(nom_long_du_champ,''à faire chp_niveau_rev''),(nom_court_du_champ,''à faire chp_niveau_rev''),(nom_bref_du_champ,''à faire chp_niveau_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_quotee_rev),type(INTEGER),meta((champ,''chp_quotee_rev''),(nom_long_du_champ,''à faire chp_quotee_rev''),(nom_court_du_champ,''à faire chp_quotee_rev''),(nom_bref_du_champ,''à faire chp_quotee_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_pos_premier_rev),type(INTEGER),meta((champ,''chp_pos_premier_rev''),(nom_long_du_champ,''à faire chp_pos_premier_rev''),(nom_court_du_champ,''à faire chp_pos_premier_rev''),(nom_bref_du_champ,''à faire chp_pos_premier_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_pos_dernier_rev),type(INTEGER),meta((champ,''chp_pos_dernier_rev''),(nom_long_du_champ,''à faire chp_pos_dernier_rev''),(nom_court_du_champ,''à faire chp_pos_dernier_rev''),(nom_bref_du_champ,''à faire chp_pos_dernier_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_parent_rev),type(INTEGER),meta((champ,''chp_parent_rev''),(nom_long_du_champ,''à faire chp_parent_rev''),(nom_court_du_champ,''à faire chp_parent_rev''),(nom_bref_du_champ,''à faire chp_parent_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_nbr_enfants_rev),type(INTEGER),meta((champ,''chp_nbr_enfants_rev''),(nom_long_du_champ,''à faire chp_nbr_enfants_rev''),(nom_court_du_champ,''à faire chp_nbr_enfants_rev''),(nom_bref_du_champ,''à faire chp_nbr_enfants_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_num_enfant_rev),type(INTEGER),meta((champ,''chp_num_enfant_rev''),(nom_long_du_champ,''à faire chp_num_enfant_rev''),(nom_court_du_champ,''à faire chp_num_enfant_rev''),(nom_bref_du_champ,''à faire chp_num_enfant_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_profondeur_rev),type(INTEGER),meta((champ,''chp_profondeur_rev''),(nom_long_du_champ,''à faire chp_profondeur_rev''),(nom_court_du_champ,''à faire chp_profondeur_rev''),(nom_bref_du_champ,''à faire chp_profondeur_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_pos_ouver_parenthese_rev),type(INTEGER),meta((champ,''chp_pos_ouver_parenthese_rev''),(nom_long_du_champ,''à faire chp_pos_ouver_parenthese_rev''),(nom_court_du_champ,''à faire chp_pos_ouver_parenthese_rev''),(nom_bref_du_champ,''à faire chp_pos_ouver_parenthese_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_pos_fermer_parenthese_rev),type(INTEGER),meta((champ,''chp_pos_fermer_parenthese_rev''),(nom_long_du_champ,''à faire chp_pos_fermer_parenthese_rev''),(nom_court_du_champ,''à faire chp_pos_fermer_parenthese_rev''),(nom_bref_du_champ,''à faire chp_pos_fermer_parenthese_rev''),(typologie,''che'')))
  field(nom_du_champ(chp_commentaire_rev),type(TEXT),meta((champ,''chp_commentaire_rev''),(nom_long_du_champ,''à faire chp_commentaire_rev''),(nom_court_du_champ,''à faire chp_commentaire_rev''),(nom_bref_du_champ,''à faire chp_commentaire_rev''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_revs''),unique(),index_name(''idx_ligne_rev''),fields(''chx_cible_rev'',''chp_provenance_rev'',''chx_source_rev'',''chp_id_rev''),meta((index,''idx_ligne_rev''),(message,''à faire idx_ligne_rev'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_bdds''),
meta((table,''tbl_bdds''),(nom_long_de_la_table,''à faire tbl_bases_de_donnees''),(nom_court_de_la_table,''à faire tbl_bases_de_donnees''),(nom_bref_de_la_table,''à faire tbl_bases_de_donnees''),(transform_table_sur_svg,transform(translate(457,207)))
),
 fields(
  field(nom_du_champ(chi_id_basedd),type(INTEGER),primary_key(),auto_increment(),meta((champ,''chi_id_basedd''),(nom_long_du_champ,''à faire chi_id_basedd''),(nom_court_du_champ,''à faire chi_id_basedd''),(nom_bref_du_champ,''à faire chi_id_basedd''),(typologie,''chi'')))
  field(nom_du_champ(''chx_dossier_id_basedd''),type(''INTEGER''),references(tbl_dossiers,chi_id_dossier),meta((champ,''chx_dossier_id_basedd''),(nom_long_du_champ,''à faire chx_dossier_id_basedd''),(nom_court_du_champ,''à faire chx_dossier_id_basedd''),(nom_bref_du_champ,''à faire chx_dossier_id_basedd''),(typologie,''chx'')))
  field(nom_du_champ(''chx_cible_id_basedd''),type(''INTEGER''),references(tbl_cibles,chi_id_cible),non_nulle(),meta((champ,''chx_cible_id_basedd''),(nom_long_du_champ,''à faire chx_cible_id_basedd''),(nom_court_du_champ,''à faire chx_cible_id_basedd''),(nom_bref_du_champ,''à faire chx_cible_id_basedd''),(typologie,''chx'')))
  field(nom_du_champ(chp_nom_basedd),type(TEXT),not_null(),default(''''),meta((champ,''chp_nom_basedd''),(nom_long_du_champ,''à faire chp_nom_basedd''),(nom_court_du_champ,''à faire chp_nom_basedd''),(nom_bref_du_champ,''à faire chp_nom_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_rev_basedd),type(TEXT),meta((champ,''chp_rev_basedd''),(nom_long_du_champ,''à faire chp_rev_basedd''),(nom_court_du_champ,''à faire chp_rev_basedd''),(nom_bref_du_champ,''à faire chp_rev_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_commentaire_basedd),type(TEXT),meta((champ,''chp_commentaire_basedd''),(nom_long_du_champ,''à faire chp_commentaire_basedd''),(nom_court_du_champ,''à faire chp_commentaire_basedd''),(nom_bref_du_champ,''à faire chp_commentaire_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_genere_basedd),type(TEXT),meta((champ,''chp_genere_basedd''),(nom_long_du_champ,''à faire chp_genere_basedd''),(nom_court_du_champ,''à faire chp_genere_basedd''),(nom_bref_du_champ,''à faire chp_genere_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_php_basedd),type(TEXT),meta((champ,''chp_php_basedd''),(nom_long_du_champ,''à faire chp_php_basedd''),(nom_court_du_champ,''à faire chp_php_basedd''),(nom_bref_du_champ,''à faire chp_php_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_rev_travail_basedd),type(TEXT),meta((champ,''chp_rev_travail_basedd''),(nom_long_du_champ,''à faire chp_rev_travail_basedd''),(nom_court_du_champ,''à faire chp_rev_travail_basedd''),(nom_bref_du_champ,''à faire chp_rev_travail_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_fournisseur_basedd),type(TEXT),not_null(),default(''sqlite''),meta((champ,''chp_fournisseur_basedd''),(nom_long_du_champ,''à faire chp_fournisseur_basedd''),(nom_court_du_champ,''à faire chp_fournisseur_basedd''),(nom_bref_du_champ,''à faire chp_fournisseur_basedd''),(typologie,''cht'')))
 ),
)
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_services''),
meta((table,tbl_services),(nom_long_de_la_table,''liste des services''),(nom_court_de_la_table,''un service''),(nom_bref_de_la_table,''services''),(transform_table_sur_svg,transform(translate(116,321)))
),
 fields(
  field(nom_du_champ(''chi_id_service''),type(''INTEGER''),primary_key(),meta((champ,''chi_id_service''),(nom_long_du_champ,''à faire chi_id_service''),(nom_court_du_champ,''à faire chi_id_service''),(nom_bref_du_champ,''à faire chi_id_service''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_service''),type(''VARCHAR(32)''),non_nulle(),meta((champ , ''chp_nom_service''),(nom_long_du_champ,''à faire chp_nom_service''),(nom_court_du_champ,''à faire chp_nom_service''),(nom_bref_du_champ,''à faire chp_nom_service''),(typologie,''chi'')))
 ),
)','sqlite'),
('9','2','1','test.db','meta(
   (transform_base_sur_svg , transform(translate(91.5 , 84.5))),
   (default_charset , ''utf8mb4''),
   (collate , ''utf8mb4_unicode_ci'')
),
#(
  =====================================================================================================================
  liste des tables
  =====================================================================================================================
),
#(=================================================================),
create_table(
   nom_de_la_table(''tbl_a''),
   meta(
      (table , tbl_a),
      (nom_long_de_la_table , ''long table a''),
      (nom_court_de_la_table , ''court tbl_a''),
      (nom_bref_de_la_table , ''bref tbl_a''),
      (transform_table_sur_svg , transform(translate(8 , -26)))
   ),
   fields(
      field(nom_du_champ(''chi_id_a'') , type(''INTEGER(20)'') , primary_key() , meta((champ , ''chi_id_a'') , (nom_long_du_champ , ''identifiant unique'') , (nom_court_du_champ , ''id aaa'') , (nom_bref_du_champ , ''id'') , (typologie , ''chi''))),
      field(nom_du_champ(''chp_nom_a'') , type(''STRING'') , meta((champ , ''chp_nom_a'') , (nom_long_du_champ , ''à faire chp_nom_cible'') , (nom_court_du_champ , ''à faire chp_nom_cible'') , (nom_bref_du_champ , ''à faire chp_nom_cible'') , (typologie , ''cht''))),
      field(nom_du_champ(''chx_a_a'') , type(''INTEGER'') , references(tbl_a , chi_id_a) , meta((champ , ''chx_a_a'') , (nom_long_du_champ , ''à faire chx_a_a'') , (nom_court_du_champ , ''à faire chx_a_a'') , (nom_bref_du_champ , ''à faire chx_a_a'') , (typologie , ''chx''))),
      field(nom_du_champ(''chx_a2_a'') , type(''INTEGER'') , references(tbl_a , chx_a_a) , meta((champ , ''chx_a2_a'') , (nom_long_du_champ , ''à faire chx_a2_a'') , (nom_court_du_champ , ''à faire chx_a2_a'') , (nom_bref_du_champ , ''à faire chx_a2_a'') , (typologie , ''chx'')))
   )
),
add_index(
   #(),
   index_name(''idx_nom_a''),
   nom_de_la_table_pour_l_index(''tbl_a''),
   fields(chp_nom_a , chx_a_a),
   unique(),
   meta(
      #(),
      (index , ''idx_nom_a''),
      (message , ''le nom est unique'')
   )
),
#(=================================================================),
create_table(
   nom_de_la_table(''tbl_b''),
   meta(
      (nom_long_de_la_table , ''à faire tbl_b''),
      (nom_court_de_la_table , ''à faire tbl_b''),
      (nom_bref_de_la_table , ''à faire tbl_b''),
      (transform_table_sur_svg , transform(translate(170 , -61)))
   ),
   fields(
      field(nom_du_champ(''chi_id_b'') , type(''INTEGER'') , primary_key() , meta((champ , ''chi_id_b'') , (nom_long_du_champ , ''identifiant unique'') , (nom_court_du_champ , ''id bbb'') , (nom_bref_du_champ , ''id'') , (typologie , ''chi''))),
      field(nom_du_champ(''chp_nom_b'') , type(''STRING'') , meta((champ , ''chp_nom_b'') , (nom_long_du_champ , ''à faire chp_nom_cible'') , (nom_court_du_champ , ''à faire chp_nom_cible'') , (nom_bref_du_champ , ''à faire chp_nom_cible'') , (typologie , ''cht''))),
      field(nom_du_champ(''chx_a_b'') , type(''INTEGER'') , references(tbl_a , chi_id_a) , meta((champ , ''chx_a_b'') , (nom_long_du_champ , ''à faire'') , (nom_court_du_champ , ''à faire'') , (nom_bref_du_champ , ''id'') , (typologie , ''chx''))),
      field(nom_du_champ(''cht_t_b'') , type(''CHARACTER'') , meta((champ , ''cht_t_b'') , (nom_long_du_champ , ''à faire cht_t_b'') , (nom_court_du_champ , ''à faire cht_t_b'') , (nom_bref_du_champ , ''à faire cht_t_b'') , (typologie , ''cht'')))
   )
)','test de base virtuelle','/* meta((transform_base_sur_svg,transform(translate(91.5,84.5))),(default_charset,''utf8mb4''),(collate,''utf8mb4_unicode_ci'')) */

/*
  =====================================================================================================================
  liste des tables
  =====================================================================================================================
*/
/*=================================================================*/



CREATE TABLE tbl_a
    /* meta((table,tbl_a),(nom_long_de_la_table,''long table a''),(nom_court_de_la_table,''court tbl_a''),(nom_bref_de_la_table,''bref tbl_a''),(transform_table_sur_svg,transform(translate(8,-26)))) */
     (
 chi_id_a INTEGER(20) PRIMARY KEY 
            /* meta((champ,''chi_id_a''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id aaa''),(nom_bref_du_champ,''id''),(typologie,''chi'')) */
            ,
     chp_nom_a STRING
            /* meta((champ,''chp_nom_a''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')) */
            ,
     chx_a_a INTEGER REFERENCES tbl_a(chi_id_a) 
            /* meta((champ,''chx_a_a''),(nom_long_du_champ,''à faire chx_a_a''),(nom_court_du_champ,''à faire chx_a_a''),(nom_bref_du_champ,''à faire chx_a_a''),(typologie,''chx'')) */
            ,
     chx_a2_a INTEGER REFERENCES tbl_a(chx_a_a) 
            /* meta((champ,''chx_a2_a''),(nom_long_du_champ,''à faire chx_a2_a''),(nom_court_du_champ,''à faire chx_a2_a''),(nom_bref_du_champ,''à faire chx_a2_a''),(typologie,''chx'')) */
            
);

CREATE  UNIQUE INDEX  idx_nom_a ON `tbl_a` 
        /* meta(#(),(index,''idx_nom_a''),(message,''le nom est unique'')) */
         ( `chp_nom_a` , `chx_a_a` ) ;
/*=================================================================*/



CREATE TABLE tbl_b
    /* meta((nom_long_de_la_table,''à faire tbl_b''),(nom_court_de_la_table,''à faire tbl_b''),(nom_bref_de_la_table,''à faire tbl_b''),(transform_table_sur_svg,transform(translate(170,-61)))) */
     (
 chi_id_b INTEGER PRIMARY KEY 
            /* meta((champ,''chi_id_b''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id bbb''),(nom_bref_du_champ,''id''),(typologie,''chi'')) */
            ,
     chp_nom_b STRING
            /* meta((champ,''chp_nom_b''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')) */
            ,
     chx_a_b INTEGER REFERENCES tbl_a(chi_id_a) 
            /* meta((champ,''chx_a_b''),(nom_long_du_champ,''à faire''),(nom_court_du_champ,''à faire''),(nom_bref_du_champ,''id''),(typologie,''chx'')) */
            ,
     cht_t_b CHARACTER
            /* meta((champ,''cht_t_b''),(nom_long_du_champ,''à faire cht_t_b''),(nom_court_du_champ,''à faire cht_t_b''),(nom_bref_du_champ,''à faire cht_t_b''),(typologie,''cht'')) */
            
);','$db = new SQLite3(''temporaire_pour_test.db'');
$uneErreur=false;
if((false === $db->exec(''BEGIN TRANSACTION''))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre>'' ;
    $uneErreur=true;
}
$chaineSql=''
/* meta((transform_base_sur_svg,transform(translate(91.5,84.5))),(default_charset,\''utf8mb4\''),(collate,\''utf8mb4_unicode_ci\'')) */
/*
  =====================================================================================================================
  liste des tables
  =====================================================================================================================
*/
/*=================================================================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE tbl_a
    /* meta((table,tbl_a),(nom_long_de_la_table,\''long table a\''),(nom_court_de_la_table,\''court tbl_a\''),(nom_bref_de_la_table,\''bref tbl_a\''),(transform_table_sur_svg,transform(translate(8,-26)))) */
     (
 chi_id_a INTEGER(20) PRIMARY KEY 
            /* meta((champ,\''chi_id_a\''),(nom_long_du_champ,\''identifiant unique\''),(nom_court_du_champ,\''id aaa\''),(nom_bref_du_champ,\''id\''),(typologie,\''chi\'')) */
            ,
     chp_nom_a STRING
            /* meta((champ,\''chp_nom_a\''),(nom_long_du_champ,\''à faire chp_nom_cible\''),(nom_court_du_champ,\''à faire chp_nom_cible\''),(nom_bref_du_champ,\''à faire chp_nom_cible\''),(typologie,\''cht\'')) */
            ,
     chx_a_a INTEGER REFERENCES tbl_a(chi_id_a) 
            /* meta((champ,\''chx_a_a\''),(nom_long_du_champ,\''à faire chx_a_a\''),(nom_court_du_champ,\''à faire chx_a_a\''),(nom_bref_du_champ,\''à faire chx_a_a\''),(typologie,\''chx\'')) */
            ,
     chx_a2_a INTEGER REFERENCES tbl_a(chx_a_a) 
            /* meta((champ,\''chx_a2_a\''),(nom_long_du_champ,\''à faire chx_a2_a\''),(nom_court_du_champ,\''à faire chx_a2_a\''),(nom_bref_du_champ,\''à faire chx_a2_a\''),(typologie,\''chx\'')) */
            
);
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE  UNIQUE INDEX  idx_nom_a ON `tbl_a` 
        /* meta(#(),(index,\''idx_nom_a\''),(message,\''le nom est unique\'')) */
         ( `chp_nom_a` , `chx_a_a` ) ;
/*=================================================================*/
'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
CREATE TABLE tbl_b
    /* meta((nom_long_de_la_table,\''à faire tbl_b\''),(nom_court_de_la_table,\''à faire tbl_b\''),(nom_bref_de_la_table,\''à faire tbl_b\''),(transform_table_sur_svg,transform(translate(170,-61)))) */
     (
 chi_id_b INTEGER PRIMARY KEY 
            /* meta((champ,\''chi_id_b\''),(nom_long_du_champ,\''identifiant unique\''),(nom_court_du_champ,\''id bbb\''),(nom_bref_du_champ,\''id\''),(typologie,\''chi\'')) */
            ,
     chp_nom_b STRING
            /* meta((champ,\''chp_nom_b\''),(nom_long_du_champ,\''à faire chp_nom_cible\''),(nom_court_du_champ,\''à faire chp_nom_cible\''),(nom_bref_du_champ,\''à faire chp_nom_cible\''),(typologie,\''cht\'')) */
            ,
     chx_a_b INTEGER REFERENCES tbl_a(chi_id_a) 
            /* meta((champ,\''chx_a_b\''),(nom_long_du_champ,\''à faire\''),(nom_court_du_champ,\''à faire\''),(nom_bref_du_champ,\''id\''),(typologie,\''chx\'')) */
            ,
     cht_t_b CHARACTER
            /* meta((champ,\''cht_t_b\''),(nom_long_du_champ,\''à faire cht_t_b\''),(nom_court_du_champ,\''à faire cht_t_b\''),(nom_bref_du_champ,\''à faire cht_t_b\''),(typologie,\''cht\'')) */
            
);'';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
if(    $uneErreur===true){
 if((false === $db->exec(''ROLLBACK''))){
     echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre>'' ;
     $uneErreur=true;
 }
}else{
 if((false === $db->exec(''COMMIT''))){
     echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre>'' ;
 }else{
     echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>Bon travail</pre>'' ;
 }
}
/*============================================*/
/*============================================*/
/*============================================*/

/* ====== */
$sql=''INSERT INTO `tbl_a`(
    `chi_id_a`          ,   `chp_nom_a`         ,   `chx_a_a`           ,   `chx_a2_a`          
) VALUES (
 \''''.sq0($tab[0]).''\''   ,\''''.sq0($tab[1]).''\''   ,\''''.sq0($tab[2]).''\''   ,\''''.sq0($tab[3]).''\''   
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_a''  => $arr[0],
     ''T0.chp_nom_a'' => $arr[1],
     ''T0.chx_a_a''   => $arr[2],
     ''T0.chx_a2_a''  => $arr[3],
    );


/* ====== */
$sql=''INSERT INTO `tbl_b`(
    `chi_id_b`          ,   `chp_nom_b`         ,   `chx_a_b`           ,   `cht_t_b`           
) VALUES (
 \''''.sq0($tab[0]).''\''   ,\''''.sq0($tab[1]).''\''   ,\''''.sq0($tab[2]).''\''   ,\''''.sq0($tab[3]).''\''   
)'';


/* ============ */
    $data0=array(

     ''T0.chi_id_b''  => $arr[0],
     ''T0.chp_nom_b'' => $arr[1],
     ''T0.chx_a_b''   => $arr[2],
     ''T0.cht_t_b''   => $arr[3],
    );

','
meta((default_charset,''utf8mb4''),(collate,''utf8mb4_unicode_ci''),(transform_base_sur_svg , transform(translate(1.5,5.5)) )
),
#(
  ================
  liste des tables
  ================
),
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_a''),
meta((table,tbl_a),(nom_long_de_la_table,''long table a''),(nom_court_de_la_table,''court tbl_a''),(nom_bref_de_la_table,''bref tbl_a''),(transform_table_sur_svg,transform(translate(5,18)))
),
 fields(
  field(nom_du_champ(''chi_id_a''),type(''INTEGER(20)''),primary_key(),meta((champ,''chi_id_a''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id aaa''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_a''),type(''STRING''),meta((champ,''chp_nom_a''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')))
  field(nom_du_champ(''chx_a_a''),type(''INTEGER''),references(tbl_a,chi_id_a),non_nulle(),meta((champ,''chx_a_a''),(nom_long_du_champ,''à faire chx_a_a''),(nom_court_du_champ,''à faire chx_a_a''),(nom_bref_du_champ,''à faire chx_a_a''),(typologie,''chx'')))
  field(nom_du_champ(''chx_a2_a''),type(''INTEGER''),references(tbl_a,chx_a_a),non_nulle(),meta((champ,''chx_a2_a''),(nom_long_du_champ,''à faire chx_a2_a''),(nom_court_du_champ,''à faire chx_a2_a''),(nom_bref_du_champ,''à faire chx_a2_a''),(typologie,''chx'')))
 ),
)
add_index(index_name(''idx_nom_a''),nom_de_la_table_pour_l_index(''tbl_a''),fields(chp_nom_a,chx_a_a),unique(),meta((index,''idx_nom_a''),(message,''bla'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_b''),
meta((nom_long_de_la_table,''à faire tbl_b''),(nom_court_de_la_table,''à faire tbl_b''),(nom_bref_de_la_table,''à faire tbl_b''),(transform_table_sur_svg,transform(translate(168,-4)))
),
 fields(
  field(nom_du_champ(''chi_id_b''),type(''INTEGER''),primary_key(),meta((champ,''chi_id_b''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id bbb''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_b''),type(''STRING''),meta((champ,''chp_nom_b''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')))
  field(nom_du_champ(''chx_a_b''),type(''INTEGER''),references(tbl_a,chi_id_a),non_nulle(),meta((champ,''chx_a_b''),(nom_long_du_champ,''à faire''),(nom_court_du_champ,''à faire''),(nom_bref_du_champ,''id''),(typologie,''chx'')))
  field(nom_du_champ(''cht_t_b''),type(''CHARACTER''),meta((champ,''cht_t_b''),(nom_long_du_champ,''à faire cht_t_b''),(nom_court_du_champ,''à faire cht_t_b''),(nom_bref_du_champ,''à faire cht_t_b''),(typologie,''cht'')))
 ),
)
add_index(index_name(''idx_''),nom_de_la_table_pour_l_index(''tbl_b''),fields(chp_nom_b),unique(),meta((index,''idx_''),(message,''blb'')))','');
