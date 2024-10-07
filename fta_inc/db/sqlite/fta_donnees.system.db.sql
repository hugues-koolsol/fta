/*



  =========================================================================
  Pour la table tbl_cibles il y a 2 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_cibles`( `chi_id_cible`, `chp_nom_cible`, `chp_dossier_cible`, `chp_commentaire_cible`) VALUES
('1','fta','fta','la racine');
/*



  =========================================================================
  Pour la table tbl_dossiers il y a 4 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chx_cible_dossier`, `chp_nom_dossier`) VALUES
('1','1','/'),
('2','1','/fta_inc/db/sqlite'),
('3','1','/fta_inc/sql');
/*



  =========================================================================
  Pour la table tbl_sources il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_sources`( `chi_id_source`, `chx_cible_id_source`, `chp_nom_source`, `chp_commentaire_source`, `chx_dossier_id_source`, `chp_rev_source`, `chp_genere_source`, `chp_type_source`) VALUES
('1','1','test.html','',NULL,'
   html((''lang'',"fr"),
      head(
         title(''Hello''
         ),
         #( )
      ),
      body((''style'',"color:red;"),''test''
      )
   )','<html lang="fr">
    <head>
        <title>Hello</title>
        <!-- -->
    </head>
    <body style="color:red;">
        test
    </body>
</html>','normal');
/*



  =========================================================================
  Pour la table tbl_utilisateurs il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_utilisateurs`( `chi_id_utilisateur`, `chp_nom_de_connexion_utilisateur`, `chp_mot_de_passe_utilisateur`, `chp_parametres_utilisateur`, `chp_commentaire_utilisateur`) VALUES
('1','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','{"zz_sources_l1.php":{"nombre_de_lignes":20},"zz_taches_l1.php":{"nombre_de_lignes":50},"zz_revs_l1.php":{"nombre_de_lignes":30},"zz_cibles_l1.php":{"nombre_de_lignes":30}}','mdp = admin');
/*



  =========================================================================
  Pour la table tbl_bdds il y a 2 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_bdds`( `chi_id_basedd`, `chx_dossier_id_basedd`, `chx_cible_id_basedd`, `chp_nom_basedd`, `chp_rev_basedd`, `chp_commentaire_basedd`, `chp_genere_basedd`, `chp_rev_travail_basedd`, `chp_fournisseur_basedd`) VALUES
('1','2','1','system.db','#(
  =====================================================================================================================
  table tbl_cibles
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_cibles''),
      (nom_long_de_la_table , ''liste des systèmes cibles''),
      (nom_court_de_la_table , ''une cible''),
      (nom_bref_de_la_table , ''cible''),
      (transform_table_sur_svg , transform(translate(-69 , -131)))
   ),
   nom_de_la_table(''tbl_cibles''),
   fields(
      #(),
      field(nom_du_champ(chi_id_cible) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_cible'') , (nom_long_du_champ , ''identifiant unique de la cible'') , (nom_court_du_champ , ''identifiant cible'') , (nom_bref_du_champ , ''id'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_cible) , type(TEXT) , meta((champ , ''chp_nom_cible'') , (nom_long_du_champ , ''nom de la cible'') , (nom_court_du_champ , ''nom cible'') , (nom_bref_du_champ , ''nom'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_dossier_cible) , type(CHARACTER , 3) , meta((champ , ''chp_dossier_cible'') , (nom_long_du_champ , ''à faire chp_dossier_cible'') , (nom_court_du_champ , ''à faire chp_dossier_cible'') , (nom_bref_du_champ , ''à faire chp_dossier_cible'') , (typologie , ''cho''))),
      field(nom_du_champ(chp_commentaire_cible) , type(TEXT) , meta((champ , ''chp_commentaire_cible'') , (nom_long_du_champ , ''à faire chp_commentaire_cible'') , (nom_court_du_champ , ''à faire chp_commentaire_cible'') , (nom_bref_du_champ , ''à faire chp_commentaire_cible'') , (typologie , ''cht'')))
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
      (nom_long_de_la_table , ''liste des dossiers sur disque''),
      (nom_court_de_la_table , ''un dossier''),
      (nom_bref_de_la_table , ''dossiers''),
      (transform_table_sur_svg , transform(translate(309 , -24)))
   ),
   nom_de_la_table(''tbl_dossiers''),
   fields(
      #(),
      field(nom_du_champ(chi_id_dossier) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_dossier'') , (nom_long_du_champ , ''à faire chi_id_dossier'') , (nom_court_du_champ , ''à faire chi_id_dossier'') , (nom_bref_du_champ , ''à faire chi_id_dossier'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_cible_dossier) , type(INTEGER) , non_nulle() , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_dossier'') , (nom_long_du_champ , ''à faire chx_cible_dossier'') , (nom_court_du_champ , ''à faire chx_cible_dossier'') , (nom_bref_du_champ , ''à faire chx_cible_dossier'') , (typologie , ''chx''))),
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
      (nom_long_de_la_table , ''liste des programmes sources''),
      (nom_court_de_la_table , ''le source''),
      (nom_bref_de_la_table , ''sources''),
      (transform_table_sur_svg , transform(translate(454 , -74)))
   ),
   nom_de_la_table(''tbl_sources''),
   fields(
      #(),
      field(nom_du_champ(chi_id_source) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_source'') , (nom_long_du_champ , ''à faire chi_id_source'') , (nom_court_du_champ , ''à faire chi_id_source'') , (nom_bref_du_champ , ''à faire chi_id_source'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_cible_id_source) , type(INTEGER) , non_nulle() , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_id_source'') , (nom_long_du_champ , ''à faire chx_cible_id_source'') , (nom_court_du_champ , ''à faire chx_cible_id_source'') , (nom_bref_du_champ , ''à faire chx_cible_id_source'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_nom_source) , type(CHARACTER , 256) , non_nulle() , valeur_par_defaut('''') , meta((champ , ''chp_nom_source'') , (nom_long_du_champ , ''à faire chp_nom_source'') , (nom_court_du_champ , ''à faire chp_nom_source'') , (nom_bref_du_champ , ''à faire chp_nom_source'') , (typologie , ''cho''))),
      field(nom_du_champ(chp_commentaire_source) , type(TEXT) , meta((champ , ''chp_commentaire_source'') , (nom_long_du_champ , ''à faire chp_commentaire_source'') , (nom_court_du_champ , ''à faire chp_commentaire_source'') , (nom_bref_du_champ , ''à faire chp_commentaire_source'') , (typologie , ''cht''))),
      field(nom_du_champ(chx_dossier_id_source) , type(INTEGER) , references(''tbl_dossiers'' , ''chi_id_dossier'') , meta((champ , ''chx_dossier_id_source'') , (nom_long_du_champ , ''à faire chx_dossier_id_source'') , (nom_court_du_champ , ''à faire chx_dossier_id_source'') , (nom_bref_du_champ , ''à faire chx_dossier_id_source'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_rev_source) , type(TEXT) , meta((champ , ''chp_rev_source'') , (nom_long_du_champ , ''à faire chp_rev_source'') , (nom_court_du_champ , ''à faire chp_rev_source'') , (nom_bref_du_champ , ''à faire chp_rev_source'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_genere_source) , type(TEXT) , meta((champ , ''chp_genere_source'') , (nom_long_du_champ , ''à faire chp_genere_source'') , (nom_court_du_champ , ''à faire chp_genere_source'') , (nom_bref_du_champ , ''à faire chp_genere_source'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_type_source) , type(TEXT) , non_nulle() , valeur_par_defaut(''normal'') , meta((champ , ''chp_type_source'') , (nom_long_du_champ , ''à faire chp_type_source'') , (nom_court_du_champ , ''à faire chp_type_source'') , (nom_bref_du_champ , ''à faire chp_type_source'') , (typologie , ''cht'')))
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
      (nom_long_de_la_table , ''liste des utilisateurs''),
      (nom_court_de_la_table , ''un utilisateur''),
      (nom_bref_de_la_table , ''utilisateurs''),
      (transform_table_sur_svg , transform(translate(-70 , 248)))
   ),
   nom_de_la_table(''tbl_utilisateurs''),
   fields(
      #(),
      field(nom_du_champ(chi_id_utilisateur) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_utilisateur'') , (nom_long_du_champ , ''à faire chi_id_utilisateur'') , (nom_court_du_champ , ''à faire chi_id_utilisateur'') , (nom_bref_du_champ , ''à faire chi_id_utilisateur'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_de_connexion_utilisateur) , type(TEXT) , meta((champ , ''chp_nom_de_connexion_utilisateur'') , (nom_long_du_champ , ''à faire chp_nom_de_connexion_utilisateur'') , (nom_court_du_champ , ''à faire chp_nom_de_connexion_utilisateur'') , (nom_bref_du_champ , ''à faire chp_nom_de_connexion_utilisateur'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_mot_de_passe_utilisateur) , type(TEXT) , meta((champ , ''chp_mot_de_passe_utilisateur'') , (nom_long_du_champ , ''à faire chp_mot_de_passe_utilisateur'') , (nom_court_du_champ , ''à faire chp_mot_de_passe_utilisateur'') , (nom_bref_du_champ , ''à faire chp_mot_de_passe_utilisateur'') , (typologie , ''cht''))),
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
      (nom_long_de_la_table , ''liste des tâches à réaliser''),
      (nom_court_de_la_table , ''une tâche''),
      (nom_bref_de_la_table , ''taches''),
      (transform_table_sur_svg , transform(translate(201 , 286)))
   ),
   nom_de_la_table(''tbl_taches''),
   fields(
      #(),
      field(nom_du_champ(chi_id_tache) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_tache'') , (nom_long_du_champ , ''à faire chi_id_tache'') , (nom_court_du_champ , ''à faire chi_id_tache'') , (nom_bref_du_champ , ''à faire chi_id_tache'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_utilisateur_tache) , type(INTEGER) , non_nulle() , references(''tbl_utilisateurs'' , ''chi_id_utilisateur'') , meta((champ , ''chx_utilisateur_tache'') , (nom_long_du_champ , ''à faire chx_utilisateur_tache'') , (nom_court_du_champ , ''à faire chx_utilisateur_tache'') , (nom_bref_du_champ , ''à faire chx_utilisateur_tache'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_texte_tache) , type(TEXT) , meta((champ , ''chp_texte_tache'') , (nom_long_du_champ , ''à faire chp_texte_tache'') , (nom_court_du_champ , ''à faire chp_texte_tache'') , (nom_bref_du_champ , ''à faire chp_texte_tache'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_priorite_tache) , type(INTEGER) , meta((champ , ''chp_priorite_tache'') , (nom_long_du_champ , ''à faire chp_priorite_tache'') , (nom_court_du_champ , ''à faire chp_priorite_tache'') , (nom_bref_du_champ , ''à faire chp_priorite_tache'') , (typologie , ''che'')))
   )
),
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
      (transform_table_sur_svg , transform(translate(643 , -132)))
   ),
   nom_de_la_table(''tbl_revs''),
   fields(
      #(),
      field(nom_du_champ(chi_id_rev) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_rev'') , (nom_long_du_champ , ''à faire chi_id_rev'') , (nom_court_du_champ , ''à faire chi_id_rev'') , (nom_bref_du_champ , ''à faire chi_id_rev'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_cible_rev) , type(INTEGER) , non_nulle() , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_rev'') , (nom_long_du_champ , ''à faire chx_cible_rev'') , (nom_court_du_champ , ''à faire chx_cible_rev'') , (nom_bref_du_champ , ''à faire chx_cible_rev'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_provenance_rev) , type(CHARACTER , 32) , meta((champ , ''chp_provenance_rev'') , (nom_long_du_champ , ''à faire chp_provenance_rev'') , (nom_court_du_champ , ''à faire chp_provenance_rev'') , (nom_bref_du_champ , ''à faire chp_provenance_rev'') , (typologie , ''cho''))),
      field(nom_du_champ(chx_source_rev) , type(INTEGER) , meta((champ , ''chx_source_rev'') , (nom_long_du_champ , ''à faire chx_source_rev'') , (nom_court_du_champ , ''à faire chx_source_rev'') , (nom_bref_du_champ , ''à faire chx_source_rev'') , (typologie , ''chx''))),
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
add_index(nom_de_la_table_pour_l_index(''tbl_revs'') , unique() , index_name(''idx_ligne_rev'') , fields(''chx_cible_rev'' , ''chp_provenance_rev'' , ''chx_source_rev'' , ''chp_id_rev'') , meta((index , ''idx_ligne_rev'') , (message , ''à faire idx_ligne_rev''))),
#(
  =====================================================================================================================
  table tbl_bdds
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_bdds''),
      (nom_long_de_la_table , ''liste des bases de données''),
      (nom_court_de_la_table , ''une base''),
      (nom_bref_de_la_table , ''bases''),
      (transform_table_sur_svg , transform(translate(448 , 140)))
   ),
   nom_de_la_table(''tbl_bdds''),
   fields(
      #(),
      field(nom_du_champ(chi_id_basedd) , type(INTEGER) , primary_key() , auto_increment() , meta((champ , ''chi_id_basedd'') , (nom_long_du_champ , ''à faire chi_id_basedd'') , (nom_court_du_champ , ''à faire chi_id_basedd'') , (nom_bref_du_champ , ''à faire chi_id_basedd'') , (typologie , ''chi''))),
      field(nom_du_champ(chx_dossier_id_basedd) , type(INTEGER) , references(''tbl_dossiers'' , ''chi_id_dossier'') , meta((champ , ''chx_dossier_id_basedd'') , (nom_long_du_champ , ''à faire chx_dossier_id_basedd'') , (nom_court_du_champ , ''à faire chx_dossier_id_basedd'') , (nom_bref_du_champ , ''à faire chx_dossier_id_basedd'') , (typologie , ''chx''))),
      field(nom_du_champ(chx_cible_id_basedd) , type(INTEGER) , non_nulle() , references(''tbl_cibles'' , ''chi_id_cible'') , meta((champ , ''chx_cible_id_basedd'') , (nom_long_du_champ , ''à faire chx_cible_id_basedd'') , (nom_court_du_champ , ''à faire chx_cible_id_basedd'') , (nom_bref_du_champ , ''à faire chx_cible_id_basedd'') , (typologie , ''chx''))),
      field(nom_du_champ(chp_nom_basedd) , type(TEXT) , non_nulle() , valeur_par_defaut('''') , meta((champ , ''chp_nom_basedd'') , (nom_long_du_champ , ''à faire chp_nom_basedd'') , (nom_court_du_champ , ''à faire chp_nom_basedd'') , (nom_bref_du_champ , ''à faire chp_nom_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_rev_basedd) , type(TEXT) , meta((champ , ''chp_rev_basedd'') , (nom_long_du_champ , ''à faire chp_rev_basedd'') , (nom_court_du_champ , ''à faire chp_rev_basedd'') , (nom_bref_du_champ , ''à faire chp_rev_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_commentaire_basedd) , type(TEXT) , meta((champ , ''chp_commentaire_basedd'') , (nom_long_du_champ , ''à faire chp_commentaire_basedd'') , (nom_court_du_champ , ''à faire chp_commentaire_basedd'') , (nom_bref_du_champ , ''à faire chp_commentaire_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_genere_basedd) , type(TEXT) , meta((champ , ''chp_genere_basedd'') , (nom_long_du_champ , ''à faire chp_genere_basedd'') , (nom_court_du_champ , ''à faire chp_genere_basedd'') , (nom_bref_du_champ , ''à faire chp_genere_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_rev_travail_basedd) , type(TEXT) , meta((champ , ''chp_rev_travail_basedd'') , (nom_long_du_champ , ''à faire chp_rev_travail_basedd'') , (nom_court_du_champ , ''à faire chp_rev_travail_basedd'') , (nom_bref_du_champ , ''à faire chp_rev_travail_basedd'') , (typologie , ''cht''))),
      field(nom_du_champ(chp_fournisseur_basedd) , type(TEXT) , valeur_par_defaut(''sqlite'') , meta((champ , ''chp_fournisseur_basedd'') , (nom_long_du_champ , ''à faire chp_fournisseur_basedd'') , (nom_court_du_champ , ''à faire chp_fournisseur_basedd'') , (nom_bref_du_champ , ''à faire chp_fournisseur_basedd'') , (typologie , ''cht'')))
   )
),
#(
  =====================================================================================================================
  table tbl_tests
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_tests''),
      (nom_long_de_la_table , ''liste d\''enregistrements \\ de test''),
      (nom_court_de_la_table , ''un test''),
      (nom_bref_de_la_table , ''test''),
      (transform_table_sur_svg , transform(translate(638 , 292)))
   ),
   nom_de_la_table(''tbl_tests''),
   fields(
      #(),
      field(nom_du_champ(chi_id_test) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_test'') , (nom_long_du_champ , ''identifiant unique \'' du \\ test'') , (nom_court_du_champ , ''id du test'') , (nom_bref_du_champ , ''id'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_test) , type(VARCHAR , 64) , non_nulle() , valeur_par_defaut('''') , meta((champ , ''chp_nom_test'') , (nom_long_du_champ , ''nom du test'') , (nom_court_du_champ , ''nom test'') , (nom_bref_du_champ , ''nom'') , (typologie , ''chp''))),
      field(
         nom_du_champ(chx_test_parent_test),
         type(INTEGER),
         non_nulle(),
         valeur_par_defaut(0),
         references(''tbl_tests'' , ''chi_id_test''),
         meta((champ , ''chx_test_parent_test'') , (nom_long_du_champ , ''à faire ...'') , (nom_court_du_champ , ''à faire ...'') , (nom_bref_du_champ , ''à faire ...'') , (typologie , ''chi''))
      ),
      field(nom_du_champ(chp_texte1_test) , type(VARCHAR , 32) , valeur_par_defaut(''hello world'') , meta((champ , ''chp_texte1_test'') , (nom_long_du_champ , ''test'') , (nom_court_du_champ , ''à faire ...'') , (nom_bref_du_champ , ''à faire ...'') , (typologie , ''chp'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_tests'') , unique() , index_name(''idx_test_unique'') , fields(''chp_nom_test'' , ''chx_test_parent_test'') , meta((index , ''idx_test_unique'') , (message , ''ce test existe déjà''))),
#(
  =====================================================================================================================
  table tbl_requetes
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_requetes''),
      (nom_long_de_la_table , ''liste des requêtes''),
      (nom_court_de_la_table , ''une requête''),
      (nom_bref_de_la_table , ''requêtes''),
      (transform_table_sur_svg , transform(translate(114 , 74)))
   ),
   nom_de_la_table(''tbl_requetes''),
   fields(
      #(),
      field(nom_du_champ(chi_id_requete) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_requete'') , (nom_long_du_champ , ''identifiant unique de la requête'') , (nom_court_du_champ , ''id unique'') , (nom_bref_du_champ , ''id'') , (typologie , ''chi''))),
      field(
         nom_du_champ(chx_cible_requete),
         type(INTEGER),
         non_nulle(),
         valeur_par_defaut(1),
         references(''tbl_cibles'' , ''chi_id_cible''),
         meta((champ , ''chx_cible_requete'') , (nom_long_du_champ , ''à faire ...'') , (nom_court_du_champ , ''à faire ...'') , (nom_bref_du_champ , ''à faire ...'') , (typologie , ''chi''))
      ),
      field(nom_du_champ(chp_type_requete) , type(VARCHAR , 64) , valeur_par_defaut(''selectionner'') , meta((champ , ''chp_type_requete'') , (nom_long_du_champ , ''type de la requête sql'') , (nom_court_du_champ , ''type requete'') , (nom_bref_du_champ , ''type'') , (typologie , ''chi''))),
      field(nom_du_champ(cht_rev_requete) , type(TEXT) , meta((champ , ''cht_rev_requete'') , (nom_long_du_champ , ''à faire ...'') , (nom_court_du_champ , ''à faire ...'') , (nom_bref_du_champ , ''à faire ...'') , (typologie , ''cht''))),
      field(nom_du_champ(cht_sql_requete) , type(TEXT) , meta((champ , ''cht_sql_requete'') , (nom_long_du_champ , ''requete au format sql'') , (nom_court_du_champ , ''format sql'') , (nom_bref_du_champ , ''sql'') , (typologie , ''cht''))),
      field(nom_du_champ(cht_php_requete) , type(TEXT) , meta((champ , ''cht_php_requete'') , (nom_long_du_champ , ''requete au format php'') , (nom_court_du_champ , ''format php'') , (nom_bref_du_champ , ''php'') , (typologie , ''cht''))),
      field(nom_du_champ(cht_commentaire_requete) , type(TEXT) , meta((champ , ''cht_commentaire_requete'') , (nom_long_du_champ , ''à faire ...'') , (nom_court_du_champ , ''à faire ...'') , (nom_bref_du_champ , ''à faire ...'') , (typologie , ''cht'')))
   )
)','test de base virtuelle','/*
  =====================================================================================================================
  table tbl_cibles
  =====================================================================================================================
*/



CREATE TABLE  tbl_cibles(
/* meta((table,''tbl_cibles''),(nom_long_de_la_table,''liste des systèmes cibles''),(nom_court_de_la_table,''une cible''),(nom_bref_de_la_table,''cible''),(transform_table_sur_svg,transform(translate(-69,-131)))) */
    
            /* meta((champ,''chi_id_cible''),(nom_long_du_champ,''identifiant unique de la cible''),(nom_court_du_champ,''identifiant cible''),(nom_bref_du_champ,''id''),(typologie,''chi'')) */
             chi_id_cible INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_cible''),(nom_long_du_champ,''nom de la cible''),(nom_court_du_champ,''nom cible''),(nom_bref_du_champ,''nom''),(typologie,''cht'')) */
             chp_nom_cible TEXT,
    
            /* meta((champ,''chp_dossier_cible''),(nom_long_du_champ,''à faire chp_dossier_cible''),(nom_court_du_champ,''à faire chp_dossier_cible''),(nom_bref_du_champ,''à faire chp_dossier_cible''),(typologie,''cho'')) */
             chp_dossier_cible CHARACTER(3),
    
            /* meta((champ,''chp_commentaire_cible''),(nom_long_du_champ,''à faire chp_commentaire_cible''),(nom_court_du_champ,''à faire chp_commentaire_cible''),(nom_bref_du_champ,''à faire chp_commentaire_cible''),(typologie,''cht'')) */
             chp_commentaire_cible TEXT
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



CREATE TABLE  tbl_dossiers(
/* meta((table,''tbl_dossiers''),(nom_long_de_la_table,''liste des dossiers sur disque''),(nom_court_de_la_table,''un dossier''),(nom_bref_de_la_table,''dossiers''),(transform_table_sur_svg,transform(translate(309,-24)))) */
    
            /* meta((champ,''chi_id_dossier''),(nom_long_du_champ,''à faire chi_id_dossier''),(nom_court_du_champ,''à faire chi_id_dossier''),(nom_bref_du_champ,''à faire chi_id_dossier''),(typologie,''chi'')) */
             chi_id_dossier INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_cible_dossier''),(nom_long_du_champ,''à faire chx_cible_dossier''),(nom_court_du_champ,''à faire chx_cible_dossier''),(nom_bref_du_champ,''à faire chx_cible_dossier''),(typologie,''chx'')) */
             chx_cible_dossier INTEGER NOT NULL REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
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



CREATE TABLE  tbl_sources(
/* meta((table,''tbl_sources''),(nom_long_de_la_table,''liste des programmes sources''),(nom_court_de_la_table,''le source''),(nom_bref_de_la_table,''sources''),(transform_table_sur_svg,transform(translate(454,-74)))) */
    
            /* meta((champ,''chi_id_source''),(nom_long_du_champ,''à faire chi_id_source''),(nom_court_du_champ,''à faire chi_id_source''),(nom_bref_du_champ,''à faire chi_id_source''),(typologie,''chi'')) */
             chi_id_source INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_cible_id_source''),(nom_long_du_champ,''à faire chx_cible_id_source''),(nom_court_du_champ,''à faire chx_cible_id_source''),(nom_bref_du_champ,''à faire chx_cible_id_source''),(typologie,''chx'')) */
             chx_cible_id_source INTEGER NOT NULL REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
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



CREATE TABLE  tbl_utilisateurs(
/* meta((table,''tbl_utilisateurs''),(nom_long_de_la_table,''liste des utilisateurs''),(nom_court_de_la_table,''un utilisateur''),(nom_bref_de_la_table,''utilisateurs''),(transform_table_sur_svg,transform(translate(-70,248)))) */
    
            /* meta((champ,''chi_id_utilisateur''),(nom_long_du_champ,''à faire chi_id_utilisateur''),(nom_court_du_champ,''à faire chi_id_utilisateur''),(nom_bref_du_champ,''à faire chi_id_utilisateur''),(typologie,''chi'')) */
             chi_id_utilisateur INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_de_connexion_utilisateur''),(nom_long_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_court_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_bref_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(typologie,''cht'')) */
             chp_nom_de_connexion_utilisateur TEXT,
    
            /* meta((champ,''chp_mot_de_passe_utilisateur''),(nom_long_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_court_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_bref_du_champ,''à faire chp_mot_de_passe_utilisateur''),(typologie,''cht'')) */
             chp_mot_de_passe_utilisateur TEXT,
    
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



CREATE TABLE  tbl_taches(
/* meta((table,''tbl_taches''),(nom_long_de_la_table,''liste des tâches à réaliser''),(nom_court_de_la_table,''une tâche''),(nom_bref_de_la_table,''taches''),(transform_table_sur_svg,transform(translate(201,286)))) */
    
            /* meta((champ,''chi_id_tache''),(nom_long_du_champ,''à faire chi_id_tache''),(nom_court_du_champ,''à faire chi_id_tache''),(nom_bref_du_champ,''à faire chi_id_tache''),(typologie,''chi'')) */
             chi_id_tache INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_utilisateur_tache''),(nom_long_du_champ,''à faire chx_utilisateur_tache''),(nom_court_du_champ,''à faire chx_utilisateur_tache''),(nom_bref_du_champ,''à faire chx_utilisateur_tache''),(typologie,''chx'')) */
             chx_utilisateur_tache INTEGER NOT NULL REFERENCES ''tbl_utilisateurs''(''chi_id_utilisateur'') ,
    
            /* meta((champ,''chp_texte_tache''),(nom_long_du_champ,''à faire chp_texte_tache''),(nom_court_du_champ,''à faire chp_texte_tache''),(nom_bref_du_champ,''à faire chp_texte_tache''),(typologie,''cht'')) */
             chp_texte_tache TEXT,
    
            /* meta((champ,''chp_priorite_tache''),(nom_long_du_champ,''à faire chp_priorite_tache''),(nom_court_du_champ,''à faire chp_priorite_tache''),(nom_bref_du_champ,''à faire chp_priorite_tache''),(typologie,''che'')) */
             chp_priorite_tache INTEGER
    );
/*
  =====================================================================================================================
  table tbl_revs
  =====================================================================================================================
*/



CREATE TABLE  tbl_revs(
/* meta((table,''tbl_revs''),(nom_long_de_la_table,''à faire tbl_revs''),(nom_court_de_la_table,''à faire tbl_revs''),(nom_bref_de_la_table,''à faire tbl_revs''),(transform_table_sur_svg,transform(translate(643,-132)))) */
    
            /* meta((champ,''chi_id_rev''),(nom_long_du_champ,''à faire chi_id_rev''),(nom_court_du_champ,''à faire chi_id_rev''),(nom_bref_du_champ,''à faire chi_id_rev''),(typologie,''chi'')) */
             chi_id_rev INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_cible_rev''),(nom_long_du_champ,''à faire chx_cible_rev''),(nom_court_du_champ,''à faire chx_cible_rev''),(nom_bref_du_champ,''à faire chx_cible_rev''),(typologie,''chx'')) */
             chx_cible_rev INTEGER NOT NULL REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
            /* meta((champ,''chp_provenance_rev''),(nom_long_du_champ,''à faire chp_provenance_rev''),(nom_court_du_champ,''à faire chp_provenance_rev''),(nom_bref_du_champ,''à faire chp_provenance_rev''),(typologie,''cho'')) */
             chp_provenance_rev CHARACTER(32),
    
            /* meta((champ,''chx_source_rev''),(nom_long_du_champ,''à faire chx_source_rev''),(nom_court_du_champ,''à faire chx_source_rev''),(nom_bref_du_champ,''à faire chx_source_rev''),(typologie,''chx'')) */
             chx_source_rev INTEGER,
    
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
         ( `chx_cible_rev` , `chp_provenance_rev` , `chx_source_rev` , `chp_id_rev` ) ;
/*
  =====================================================================================================================
  table tbl_bdds
  =====================================================================================================================
*/



CREATE TABLE  tbl_bdds(
/* meta((table,''tbl_bdds''),(nom_long_de_la_table,''liste des bases de données''),(nom_court_de_la_table,''une base''),(nom_bref_de_la_table,''bases''),(transform_table_sur_svg,transform(translate(448,140)))) */
    
            /* meta((champ,''chi_id_basedd''),(nom_long_du_champ,''à faire chi_id_basedd''),(nom_court_du_champ,''à faire chi_id_basedd''),(nom_bref_du_champ,''à faire chi_id_basedd''),(typologie,''chi'')) */
             chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT,
    
            /* meta((champ,''chx_dossier_id_basedd''),(nom_long_du_champ,''à faire chx_dossier_id_basedd''),(nom_court_du_champ,''à faire chx_dossier_id_basedd''),(nom_bref_du_champ,''à faire chx_dossier_id_basedd''),(typologie,''chx'')) */
             chx_dossier_id_basedd INTEGER REFERENCES ''tbl_dossiers''(''chi_id_dossier'') ,
    
            /* meta((champ,''chx_cible_id_basedd''),(nom_long_du_champ,''à faire chx_cible_id_basedd''),(nom_court_du_champ,''à faire chx_cible_id_basedd''),(nom_bref_du_champ,''à faire chx_cible_id_basedd''),(typologie,''chx'')) */
             chx_cible_id_basedd INTEGER NOT NULL REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
            /* meta((champ,''chp_nom_basedd''),(nom_long_du_champ,''à faire chp_nom_basedd''),(nom_court_du_champ,''à faire chp_nom_basedd''),(nom_bref_du_champ,''à faire chp_nom_basedd''),(typologie,''cht'')) */
             chp_nom_basedd TEXT NOT NULL DEFAULT  '''' ,
    
            /* meta((champ,''chp_rev_basedd''),(nom_long_du_champ,''à faire chp_rev_basedd''),(nom_court_du_champ,''à faire chp_rev_basedd''),(nom_bref_du_champ,''à faire chp_rev_basedd''),(typologie,''cht'')) */
             chp_rev_basedd TEXT,
    
            /* meta((champ,''chp_commentaire_basedd''),(nom_long_du_champ,''à faire chp_commentaire_basedd''),(nom_court_du_champ,''à faire chp_commentaire_basedd''),(nom_bref_du_champ,''à faire chp_commentaire_basedd''),(typologie,''cht'')) */
             chp_commentaire_basedd TEXT,
    
            /* meta((champ,''chp_genere_basedd''),(nom_long_du_champ,''à faire chp_genere_basedd''),(nom_court_du_champ,''à faire chp_genere_basedd''),(nom_bref_du_champ,''à faire chp_genere_basedd''),(typologie,''cht'')) */
             chp_genere_basedd TEXT,
    
            /* meta((champ,''chp_rev_travail_basedd''),(nom_long_du_champ,''à faire chp_rev_travail_basedd''),(nom_court_du_champ,''à faire chp_rev_travail_basedd''),(nom_bref_du_champ,''à faire chp_rev_travail_basedd''),(typologie,''cht'')) */
             chp_rev_travail_basedd TEXT,
    
            /* meta((champ,''chp_fournisseur_basedd''),(nom_long_du_champ,''à faire chp_fournisseur_basedd''),(nom_court_du_champ,''à faire chp_fournisseur_basedd''),(nom_bref_du_champ,''à faire chp_fournisseur_basedd''),(typologie,''cht'')) */
             chp_fournisseur_basedd TEXT DEFAULT  ''sqlite'' 
    );
/*
  =====================================================================================================================
  table tbl_tests
  =====================================================================================================================
*/



CREATE TABLE  tbl_tests(
/* meta((table,''tbl_tests''),(nom_long_de_la_table,''liste d\''enregistrements \\ de test''),(nom_court_de_la_table,''un test''),(nom_bref_de_la_table,''test''),(transform_table_sur_svg,transform(translate(638,292)))) */
    
            /* meta((champ,''chi_id_test''),(nom_long_du_champ,''identifiant unique \'' du \\ test''),(nom_court_du_champ,''id du test''),(nom_bref_du_champ,''id''),(typologie,''chi'')) */
             chi_id_test INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_test''),(nom_long_du_champ,''nom du test''),(nom_court_du_champ,''nom test''),(nom_bref_du_champ,''nom''),(typologie,''chp'')) */
             chp_nom_test VARCHAR(64) NOT NULL DEFAULT  '''' ,
    
            /* meta((champ,''chx_test_parent_test''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chi'')) */
             chx_test_parent_test INTEGER NOT NULL DEFAULT  0  REFERENCES ''tbl_tests''(''chi_id_test'') ,
    
            /* meta((champ,''chp_texte1_test''),(nom_long_du_champ,''test''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chp'')) */
             chp_texte1_test VARCHAR(32) DEFAULT  ''hello world'' 
    );
/*==============================*/

CREATE  UNIQUE INDEX  idx_test_unique ON `tbl_tests` 
        /* meta((index,''idx_test_unique''),(message,''ce test existe déjà'')) */
         ( `chp_nom_test` , `chx_test_parent_test` ) ;
/*
  =====================================================================================================================
  table tbl_requetes
  =====================================================================================================================
*/



CREATE TABLE  tbl_requetes(
/* meta((table,''tbl_requetes''),(nom_long_de_la_table,''liste des requêtes''),(nom_court_de_la_table,''une requête''),(nom_bref_de_la_table,''requêtes''),(transform_table_sur_svg,transform(translate(114,74)))) */
    
            /* meta((champ,''chi_id_requete''),(nom_long_du_champ,''identifiant unique de la requête''),(nom_court_du_champ,''id unique''),(nom_bref_du_champ,''id''),(typologie,''chi'')) */
             chi_id_requete INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chx_cible_requete''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chi'')) */
             chx_cible_requete INTEGER NOT NULL DEFAULT  1  REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
    
            /* meta((champ,''chp_type_requete''),(nom_long_du_champ,''type de la requête sql''),(nom_court_du_champ,''type requete''),(nom_bref_du_champ,''type''),(typologie,''chi'')) */
             chp_type_requete VARCHAR(64) DEFAULT  ''selectionner'' ,
    
            /* meta((champ,''cht_rev_requete''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''cht'')) */
             cht_rev_requete TEXT,
    
            /* meta((champ,''cht_sql_requete''),(nom_long_du_champ,''requete au format sql''),(nom_court_du_champ,''format sql''),(nom_bref_du_champ,''sql''),(typologie,''cht'')) */
             cht_sql_requete TEXT,
    
            /* meta((champ,''cht_php_requete''),(nom_long_du_champ,''requete au format php''),(nom_court_du_champ,''format php''),(nom_bref_du_champ,''php''),(typologie,''cht'')) */
             cht_php_requete TEXT,
    
            /* meta((champ,''cht_commentaire_requete''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''cht'')) */
             cht_commentaire_requete TEXT
    );','
meta((transform_base_sur_svg , transform(translate(109.5,246.5)) )
),
#(
  ================
  liste des tables
  ================
),
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_cibles''),
meta((table,''tbl_cibles''),(nom_long_de_la_table,''liste des systèmes cibles''),(nom_court_de_la_table,''une cible''),(nom_bref_de_la_table,''cible''),(transform_table_sur_svg,transform(translate(-69,-131)))
),
 fields(
  field(nom_du_champ(chi_id_cible),type(INTEGER),primary_key(),meta((champ,''chi_id_cible''),(nom_long_du_champ,''identifiant unique de la cible''),(nom_court_du_champ,''identifiant cible''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(chp_nom_cible),type(TEXT),meta((champ,''chp_nom_cible''),(nom_long_du_champ,''nom de la cible''),(nom_court_du_champ,''nom cible''),(nom_bref_du_champ,''nom''),(typologie,''cht'')))
  field(nom_du_champ(chp_dossier_cible),type(CHARACTER,3),meta((champ,''chp_dossier_cible''),(nom_long_du_champ,''à faire chp_dossier_cible''),(nom_court_du_champ,''à faire chp_dossier_cible''),(nom_bref_du_champ,''à faire chp_dossier_cible''),(typologie,''cho'')))
  field(nom_du_champ(chp_commentaire_cible),type(TEXT),meta((champ,''chp_commentaire_cible''),(nom_long_du_champ,''à faire chp_commentaire_cible''),(nom_court_du_champ,''à faire chp_commentaire_cible''),(nom_bref_du_champ,''à faire chp_commentaire_cible''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_cibles''),unique(),index_name(''idx_dossier_cible''),fields(''chp_dossier_cible''),meta((index,''idx_dossier_cible''),(message,''à faire idx_dossier_cible'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_dossiers''),
meta((table,''tbl_dossiers''),(nom_long_de_la_table,''liste des dossiers sur disque''),(nom_court_de_la_table,''un dossier''),(nom_bref_de_la_table,''dossiers''),(transform_table_sur_svg,transform(translate(309,-24)))
),
 fields(
  field(nom_du_champ(chi_id_dossier),type(INTEGER),primary_key(),meta((champ,''chi_id_dossier''),(nom_long_du_champ,''à faire chi_id_dossier''),(nom_court_du_champ,''à faire chi_id_dossier''),(nom_bref_du_champ,''à faire chi_id_dossier''),(typologie,''chi'')))
  field(nom_du_champ(chx_cible_dossier),type(INTEGER),non_nulle(),references(''tbl_cibles'',''chi_id_cible''),meta((champ,''chx_cible_dossier''),(nom_long_du_champ,''à faire chx_cible_dossier''),(nom_court_du_champ,''à faire chx_cible_dossier''),(nom_bref_du_champ,''à faire chx_cible_dossier''),(typologie,''chx'')))
  field(nom_du_champ(chp_nom_dossier),type(CHARACTER,256),meta((champ,''chp_nom_dossier''),(nom_long_du_champ,''à faire chp_nom_dossier''),(nom_court_du_champ,''à faire chp_nom_dossier''),(nom_bref_du_champ,''à faire chp_nom_dossier''),(typologie,''cho'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_dossiers''),unique(),index_name(''idx_cible_et_nom''),fields(''chx_cible_dossier'',''chp_nom_dossier''),meta((index,''idx_cible_et_nom''),(message,''à faire idx_cible_et_nom'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_sources''),
meta((table,''tbl_sources''),(nom_long_de_la_table,''liste des programmes sources''),(nom_court_de_la_table,''le source''),(nom_bref_de_la_table,''sources''),(transform_table_sur_svg,transform(translate(454,-74)))
),
 fields(
  field(nom_du_champ(chi_id_source),type(INTEGER),primary_key(),meta((champ,''chi_id_source''),(nom_long_du_champ,''à faire chi_id_source''),(nom_court_du_champ,''à faire chi_id_source''),(nom_bref_du_champ,''à faire chi_id_source''),(typologie,''chi'')))
  field(nom_du_champ(chx_cible_id_source),type(INTEGER),non_nulle(),references(''tbl_cibles'',''chi_id_cible''),meta((champ,''chx_cible_id_source''),(nom_long_du_champ,''à faire chx_cible_id_source''),(nom_court_du_champ,''à faire chx_cible_id_source''),(nom_bref_du_champ,''à faire chx_cible_id_source''),(typologie,''chx'')))
  field(nom_du_champ(chp_nom_source),type(CHARACTER,256),non_nulle(),valeur_par_defaut(''''),meta((champ,''chp_nom_source''),(nom_long_du_champ,''à faire chp_nom_source''),(nom_court_du_champ,''à faire chp_nom_source''),(nom_bref_du_champ,''à faire chp_nom_source''),(typologie,''cho'')))
  field(nom_du_champ(chp_commentaire_source),type(TEXT),meta((champ,''chp_commentaire_source''),(nom_long_du_champ,''à faire chp_commentaire_source''),(nom_court_du_champ,''à faire chp_commentaire_source''),(nom_bref_du_champ,''à faire chp_commentaire_source''),(typologie,''cht'')))
  field(nom_du_champ(chx_dossier_id_source),type(INTEGER),references(''tbl_dossiers'',''chi_id_dossier''),meta((champ,''chx_dossier_id_source''),(nom_long_du_champ,''à faire chx_dossier_id_source''),(nom_court_du_champ,''à faire chx_dossier_id_source''),(nom_bref_du_champ,''à faire chx_dossier_id_source''),(typologie,''chx'')))
  field(nom_du_champ(chp_rev_source),type(TEXT),meta((champ,''chp_rev_source''),(nom_long_du_champ,''à faire chp_rev_source''),(nom_court_du_champ,''à faire chp_rev_source''),(nom_bref_du_champ,''à faire chp_rev_source''),(typologie,''cht'')))
  field(nom_du_champ(chp_genere_source),type(TEXT),meta((champ,''chp_genere_source''),(nom_long_du_champ,''à faire chp_genere_source''),(nom_court_du_champ,''à faire chp_genere_source''),(nom_bref_du_champ,''à faire chp_genere_source''),(typologie,''cht'')))
  field(nom_du_champ(chp_type_source),type(TEXT),non_nulle(),valeur_par_defaut(''normal''),meta((champ,''chp_type_source''),(nom_long_du_champ,''à faire chp_type_source''),(nom_court_du_champ,''à faire chp_type_source''),(nom_bref_du_champ,''à faire chp_type_source''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_sources''),unique(),index_name(''idx_nom_et_dossier''),fields(''chx_dossier_id_source'',''chp_nom_source''),meta((index,''idx_nom_et_dossier''),(message,''à faire idx_nom_et_dossier'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_utilisateurs''),
meta((table,''tbl_utilisateurs''),(nom_long_de_la_table,''liste des utilisateurs''),(nom_court_de_la_table,''un utilisateur''),(nom_bref_de_la_table,''utilisateurs''),(transform_table_sur_svg,transform(translate(-70,248)))
),
 fields(
  field(nom_du_champ(chi_id_utilisateur),type(INTEGER),primary_key(),meta((champ,''chi_id_utilisateur''),(nom_long_du_champ,''à faire chi_id_utilisateur''),(nom_court_du_champ,''à faire chi_id_utilisateur''),(nom_bref_du_champ,''à faire chi_id_utilisateur''),(typologie,''chi'')))
  field(nom_du_champ(chp_nom_de_connexion_utilisateur),type(TEXT),meta((champ,''chp_nom_de_connexion_utilisateur''),(nom_long_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_court_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_bref_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_mot_de_passe_utilisateur),type(TEXT),meta((champ,''chp_mot_de_passe_utilisateur''),(nom_long_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_court_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_bref_du_champ,''à faire chp_mot_de_passe_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_parametres_utilisateur),type(TEXT),meta((champ,''chp_parametres_utilisateur''),(nom_long_du_champ,''à faire chp_parametres_utilisateur''),(nom_court_du_champ,''à faire chp_parametres_utilisateur''),(nom_bref_du_champ,''à faire chp_parametres_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_commentaire_utilisateur),type(TEXT),meta((champ,''chp_commentaire_utilisateur''),(nom_long_du_champ,''à faire chp_commentaire_utilisateur''),(nom_court_du_champ,''à faire chp_commentaire_utilisateur''),(nom_bref_du_champ,''à faire chp_commentaire_utilisateur''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_utilisateurs''),unique(),index_name(''idxNomUtilisateur''),fields(''chp_nom_de_connexion_utilisateur''),meta((index,''idxNomUtilisateur''),(message,''à faire idxNomUtilisateur'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_taches''),
meta((table,''tbl_taches''),(nom_long_de_la_table,''liste des tâches à réaliser''),(nom_court_de_la_table,''une tâche''),(nom_bref_de_la_table,''taches''),(transform_table_sur_svg,transform(translate(201,286)))
),
 fields(
  field(nom_du_champ(chi_id_tache),type(INTEGER),primary_key(),meta((champ,''chi_id_tache''),(nom_long_du_champ,''à faire chi_id_tache''),(nom_court_du_champ,''à faire chi_id_tache''),(nom_bref_du_champ,''à faire chi_id_tache''),(typologie,''chi'')))
  field(nom_du_champ(chx_utilisateur_tache),type(INTEGER),non_nulle(),references(''tbl_utilisateurs'',''chi_id_utilisateur''),meta((champ,''chx_utilisateur_tache''),(nom_long_du_champ,''à faire chx_utilisateur_tache''),(nom_court_du_champ,''à faire chx_utilisateur_tache''),(nom_bref_du_champ,''à faire chx_utilisateur_tache''),(typologie,''chx'')))
  field(nom_du_champ(chp_texte_tache),type(TEXT),meta((champ,''chp_texte_tache''),(nom_long_du_champ,''à faire chp_texte_tache''),(nom_court_du_champ,''à faire chp_texte_tache''),(nom_bref_du_champ,''à faire chp_texte_tache''),(typologie,''cht'')))
  field(nom_du_champ(chp_priorite_tache),type(INTEGER),meta((champ,''chp_priorite_tache''),(nom_long_du_champ,''à faire chp_priorite_tache''),(nom_court_du_champ,''à faire chp_priorite_tache''),(nom_bref_du_champ,''à faire chp_priorite_tache''),(typologie,''che'')))
 ),
)
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_revs''),
meta((table,''tbl_revs''),(nom_long_de_la_table,''à faire tbl_revs''),(nom_court_de_la_table,''à faire tbl_revs''),(nom_bref_de_la_table,''à faire tbl_revs''),(transform_table_sur_svg,transform(translate(643,-132)))
),
 fields(
  field(nom_du_champ(chi_id_rev),type(INTEGER),primary_key(),meta((champ,''chi_id_rev''),(nom_long_du_champ,''à faire chi_id_rev''),(nom_court_du_champ,''à faire chi_id_rev''),(nom_bref_du_champ,''à faire chi_id_rev''),(typologie,''chi'')))
  field(nom_du_champ(chx_cible_rev),type(INTEGER),non_nulle(),references(''tbl_cibles'',''chi_id_cible''),meta((champ,''chx_cible_rev''),(nom_long_du_champ,''à faire chx_cible_rev''),(nom_court_du_champ,''à faire chx_cible_rev''),(nom_bref_du_champ,''à faire chx_cible_rev''),(typologie,''chx'')))
  field(nom_du_champ(chp_provenance_rev),type(CHARACTER,32),meta((champ,''chp_provenance_rev''),(nom_long_du_champ,''à faire chp_provenance_rev''),(nom_court_du_champ,''à faire chp_provenance_rev''),(nom_bref_du_champ,''à faire chp_provenance_rev''),(typologie,''cho'')))
  field(nom_du_champ(chx_source_rev),type(INTEGER),meta((champ,''chx_source_rev''),(nom_long_du_champ,''à faire chx_source_rev''),(nom_court_du_champ,''à faire chx_source_rev''),(nom_bref_du_champ,''à faire chx_source_rev''),(typologie,''chx'')))
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
meta((table,''tbl_bdds''),(nom_long_de_la_table,''liste des bases de données''),(nom_court_de_la_table,''une base''),(nom_bref_de_la_table,''bases''),(transform_table_sur_svg,transform(translate(448,140)))
),
 fields(
  field(nom_du_champ(chi_id_basedd),type(INTEGER),primary_key(),auto_increment(),meta((champ,''chi_id_basedd''),(nom_long_du_champ,''à faire chi_id_basedd''),(nom_court_du_champ,''à faire chi_id_basedd''),(nom_bref_du_champ,''à faire chi_id_basedd''),(typologie,''chi'')))
  field(nom_du_champ(chx_dossier_id_basedd),type(INTEGER),references(''tbl_dossiers'',''chi_id_dossier''),meta((champ,''chx_dossier_id_basedd''),(nom_long_du_champ,''à faire chx_dossier_id_basedd''),(nom_court_du_champ,''à faire chx_dossier_id_basedd''),(nom_bref_du_champ,''à faire chx_dossier_id_basedd''),(typologie,''chx'')))
  field(nom_du_champ(chx_cible_id_basedd),type(INTEGER),non_nulle(),references(''tbl_cibles'',''chi_id_cible''),meta((champ,''chx_cible_id_basedd''),(nom_long_du_champ,''à faire chx_cible_id_basedd''),(nom_court_du_champ,''à faire chx_cible_id_basedd''),(nom_bref_du_champ,''à faire chx_cible_id_basedd''),(typologie,''chx'')))
  field(nom_du_champ(chp_nom_basedd),type(TEXT),non_nulle(),valeur_par_defaut(''''),meta((champ,''chp_nom_basedd''),(nom_long_du_champ,''à faire chp_nom_basedd''),(nom_court_du_champ,''à faire chp_nom_basedd''),(nom_bref_du_champ,''à faire chp_nom_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_rev_basedd),type(TEXT),meta((champ,''chp_rev_basedd''),(nom_long_du_champ,''à faire chp_rev_basedd''),(nom_court_du_champ,''à faire chp_rev_basedd''),(nom_bref_du_champ,''à faire chp_rev_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_commentaire_basedd),type(TEXT),meta((champ,''chp_commentaire_basedd''),(nom_long_du_champ,''à faire chp_commentaire_basedd''),(nom_court_du_champ,''à faire chp_commentaire_basedd''),(nom_bref_du_champ,''à faire chp_commentaire_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_genere_basedd),type(TEXT),meta((champ,''chp_genere_basedd''),(nom_long_du_champ,''à faire chp_genere_basedd''),(nom_court_du_champ,''à faire chp_genere_basedd''),(nom_bref_du_champ,''à faire chp_genere_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_rev_travail_basedd),type(TEXT),meta((champ,''chp_rev_travail_basedd''),(nom_long_du_champ,''à faire chp_rev_travail_basedd''),(nom_court_du_champ,''à faire chp_rev_travail_basedd''),(nom_bref_du_champ,''à faire chp_rev_travail_basedd''),(typologie,''cht'')))
  field(nom_du_champ(chp_fournisseur_basedd),type(TEXT),valeur_par_defaut(''sqlite''),meta((champ,''chp_fournisseur_basedd''),(nom_long_du_champ,''à faire chp_fournisseur_basedd''),(nom_court_du_champ,''à faire chp_fournisseur_basedd''),(nom_bref_du_champ,''à faire chp_fournisseur_basedd''),(typologie,''cht'')))
 ),
)
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_tests''),
meta((table,''tbl_tests''),(nom_long_de_la_table,''liste d\''enregistrements \\ de test''),(nom_court_de_la_table,''un test''),(nom_bref_de_la_table,''test''),(transform_table_sur_svg,transform(translate(638,292)))
),
 fields(
  field(nom_du_champ(chi_id_test),type(INTEGER),primary_key(),meta((champ,''chi_id_test''),(nom_long_du_champ,''identifiant unique \'' du \\ test''),(nom_court_du_champ,''id du test''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(chp_nom_test),type(VARCHAR,64),non_nulle(),valeur_par_defaut(''''),meta((champ,''chp_nom_test''),(nom_long_du_champ,''nom du test''),(nom_court_du_champ,''nom test''),(nom_bref_du_champ,''nom''),(typologie,''chp'')))
  field(nom_du_champ(chx_test_parent_test),type(INTEGER),non_nulle(),valeur_par_defaut(0),references(''tbl_tests'',''chi_id_test''),meta((champ,''chx_test_parent_test''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chi'')))
  field(nom_du_champ(chp_texte1_test),type(VARCHAR,32),valeur_par_defaut(''hello world''),meta((champ,''chp_texte1_test''),(nom_long_du_champ,''test''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chp'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_tests''),unique(),index_name(''idx_test_unique''),fields(''chp_nom_test'',''chx_test_parent_test''),meta((index,''idx_test_unique''),(message,''ce test existe déjà'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_requetes''),
meta((table,''tbl_requetes''),(nom_long_de_la_table,''liste des requêtes''),(nom_court_de_la_table,''une requête''),(nom_bref_de_la_table,''requêtes''),(transform_table_sur_svg,transform(translate(114,74)))
),
 fields(
  field(nom_du_champ(chi_id_requete),type(INTEGER),primary_key(),meta((champ,''chi_id_requete''),(nom_long_du_champ,''identifiant unique de la requête''),(nom_court_du_champ,''id unique''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(chx_cible_requete),type(INTEGER),non_nulle(),valeur_par_defaut(1),references(''tbl_cibles'',''chi_id_cible''),meta((champ,''chx_cible_requete''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chi'')))
  field(nom_du_champ(chp_type_requete),type(VARCHAR,64),valeur_par_defaut(''selectionner''),meta((champ,''chp_type_requete''),(nom_long_du_champ,''type de la requête sql''),(nom_court_du_champ,''type requete''),(nom_bref_du_champ,''type''),(typologie,''chi'')))
  field(nom_du_champ(cht_rev_requete),type(TEXT),meta((champ,''cht_rev_requete''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''cht'')))
  field(nom_du_champ(cht_sql_requete),type(TEXT),meta((champ,''cht_sql_requete''),(nom_long_du_champ,''requete au format sql''),(nom_court_du_champ,''format sql''),(nom_bref_du_champ,''sql''),(typologie,''cht'')))
  field(nom_du_champ(cht_php_requete),type(TEXT),meta((champ,''cht_php_requete''),(nom_long_du_champ,''requete au format php''),(nom_court_du_champ,''format php''),(nom_bref_du_champ,''php''),(typologie,''cht'')))
  field(nom_du_champ(cht_commentaire_requete),type(TEXT),meta((champ,''cht_commentaire_requete''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''cht'')))
 ),
)','sqlite'),
('9','2','1','test.db','#(
  =====================================================================================================================
  table tbl_a
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_a''),
      (nom_long_de_la_table , ''long table a''),
      (nom_court_de_la_table , ''court tbl_a''),
      (nom_bref_de_la_table , ''bref tbl_a''),
      (transform_table_sur_svg , transform(translate(-52 , -188)))
   ),
   nom_de_la_table(''tbl_a''),
   fields(
      #(),
      field(nom_du_champ(chi_id_a) , type(INTEGER , 20) , primary_key() , meta((champ , ''chi_id_a'') , (nom_long_du_champ , ''identifiant unique'') , (nom_court_du_champ , ''id aaa'') , (nom_bref_du_champ , ''id'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_a) , type(STRING) , meta((champ , ''chp_nom_a'') , (nom_long_du_champ , ''à faire chp_nom_cible'') , (nom_court_du_champ , ''à faire chp_nom_cible'') , (nom_bref_du_champ , ''à faire chp_nom_cible'') , (typologie , ''cht''))),
      field(nom_du_champ(chx_a_a) , type(INTEGER) , non_nulle() , references(''tbl_a'' , ''chi_id_a'') , meta((champ , ''chx_a_a'') , (nom_long_du_champ , ''à faire chx_a_a'') , (nom_court_du_champ , ''à faire chx_a_a'') , (nom_bref_du_champ , ''à faire chx_a_a'') , (typologie , ''chx''))),
      field(nom_du_champ(chx_a2_a) , type(INTEGER) , non_nulle() , references(''tbl_a'' , ''chx_a_a'') , meta((champ , ''chx_a2_a'') , (nom_long_du_champ , ''à faire chx_a2_a'') , (nom_court_du_champ , ''à faire chx_a2_a'') , (nom_bref_du_champ , ''à faire chx_a2_a'') , (typologie , ''chx'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_a'') , unique() , index_name(''idx_nom_a'') , fields(''chp_nom_a'' , ''chx_a_a'') , meta((index , ''idx_nom_a'') , (message , ''bla''))),
#(
  =====================================================================================================================
  table tbl_b
  =====================================================================================================================
),
create_table(
   meta(
      (table , ''tbl_b''),
      (nom_long_de_la_table , ''à faire tbl_b''),
      (nom_court_de_la_table , ''à faire tbl_b''),
      (nom_bref_de_la_table , ''à faire tbl_b''),
      (transform_table_sur_svg , transform(translate(0 , 0)))
   ),
   nom_de_la_table(''tbl_b''),
   fields(
      #(),
      field(nom_du_champ(chi_id_b) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_b'') , (nom_long_du_champ , ''identifiant unique'') , (nom_court_du_champ , ''id bbb'') , (nom_bref_du_champ , ''id'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_b) , type(STRING) , valeur_par_defaut(''toto'') , meta((champ , ''chp_nom_b'') , (nom_long_du_champ , ''à faire chp_nom_b'') , (nom_court_du_champ , ''à faire chp_nom_b'') , (nom_bref_du_champ , ''à faire chp_nom_b'') , (typologie , ''cht''))),
      field(nom_du_champ(chx_a_b) , type(INTEGER) , non_nulle() , references(''tbl_a'' , ''chi_id_a'') , meta((champ , ''chx_a_b'') , (nom_long_du_champ , ''à faire'') , (nom_court_du_champ , ''à faire'') , (nom_bref_du_champ , ''id'') , (typologie , ''chx''))),
      field(nom_du_champ(cht_t_b) , type(CHARACTER) , meta((champ , ''cht_t_b'') , (nom_long_du_champ , ''à faire cht_t_b'') , (nom_court_du_champ , ''à faire cht_t_b'') , (nom_bref_du_champ , ''à faire cht_t_b'') , (typologie , ''cht'')))
   )
)','test de base virtuelle','/*
  =====================================================================================================================
  table tbl_a
  =====================================================================================================================
*/



CREATE TABLE  tbl_a(
/* meta((table,''tbl_a''),(nom_long_de_la_table,''long table a''),(nom_court_de_la_table,''court tbl_a''),(nom_bref_de_la_table,''bref tbl_a''),(transform_table_sur_svg,transform(translate(-52,-188)))) */
    
            /* meta((champ,''chi_id_a''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id aaa''),(nom_bref_du_champ,''id''),(typologie,''chi'')) */
             chi_id_a INTEGER(20) PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_a''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')) */
             chp_nom_a STRING,
    
            /* meta((champ,''chx_a_a''),(nom_long_du_champ,''à faire chx_a_a''),(nom_court_du_champ,''à faire chx_a_a''),(nom_bref_du_champ,''à faire chx_a_a''),(typologie,''chx'')) */
             chx_a_a INTEGER NOT NULL REFERENCES ''tbl_a''(''chi_id_a'') ,
    
            /* meta((champ,''chx_a2_a''),(nom_long_du_champ,''à faire chx_a2_a''),(nom_court_du_champ,''à faire chx_a2_a''),(nom_bref_du_champ,''à faire chx_a2_a''),(typologie,''chx'')) */
             chx_a2_a INTEGER NOT NULL REFERENCES ''tbl_a''(''chx_a_a'') 
    );
/*==============================*/

CREATE  UNIQUE INDEX  idx_nom_a ON `tbl_a` 
        /* meta((index,''idx_nom_a''),(message,''bla'')) */
         ( `chp_nom_a` , `chx_a_a` ) ;
/*
  =====================================================================================================================
  table tbl_b
  =====================================================================================================================
*/



CREATE TABLE  tbl_b(
/* meta((table,''tbl_b''),(nom_long_de_la_table,''à faire tbl_b''),(nom_court_de_la_table,''à faire tbl_b''),(nom_bref_de_la_table,''à faire tbl_b''),(transform_table_sur_svg,transform(translate(0,0)))) */
    
            /* meta((champ,''chi_id_b''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id bbb''),(nom_bref_du_champ,''id''),(typologie,''chi'')) */
             chi_id_b INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_b''),(nom_long_du_champ,''à faire chp_nom_b''),(nom_court_du_champ,''à faire chp_nom_b''),(nom_bref_du_champ,''à faire chp_nom_b''),(typologie,''cht'')) */
             chp_nom_b STRING DEFAULT  ''toto'' ,
    
            /* meta((champ,''chx_a_b''),(nom_long_du_champ,''à faire''),(nom_court_du_champ,''à faire''),(nom_bref_du_champ,''id''),(typologie,''chx'')) */
             chx_a_b INTEGER NOT NULL REFERENCES ''tbl_a''(''chi_id_a'') ,
    
            /* meta((champ,''cht_t_b''),(nom_long_du_champ,''à faire cht_t_b''),(nom_court_du_champ,''à faire cht_t_b''),(nom_bref_du_champ,''à faire cht_t_b''),(typologie,''cht'')) */
             cht_t_b CHARACTER
    );','meta((default_charset,''utf8mb4''),(collate,''utf8mb4_unicode_ci''),(transform_base_sur_svg , transform(translate(508.5,686.5)) )
),
#(
  ================
  liste des tables
  ================
),
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_a''),
meta((table,tbl_a),(nom_long_de_la_table,''long table a''),(nom_court_de_la_table,''court tbl_a''),(nom_bref_de_la_table,''bref tbl_a''),(transform_table_sur_svg,transform(translate(-52,-188)))
),
 fields(
  field(nom_du_champ(''chi_id_a''),type(''INTEGER(20)''),primary_key(),meta((champ,''chi_id_a''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id aaa''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_a''),type(''STRING''),meta((champ,''chp_nom_a''),(nom_long_du_champ,''à faire chp_nom_cible''),(nom_court_du_champ,''à faire chp_nom_cible''),(nom_bref_du_champ,''à faire chp_nom_cible''),(typologie,''cht'')))
  field(nom_du_champ(''chx_a_a''),type(''INTEGER''),references(tbl_a,chi_id_a),non_nulle(),meta((champ,''chx_a_a''),(nom_long_du_champ,''à faire chx_a_a''),(nom_court_du_champ,''à faire chx_a_a''),(nom_bref_du_champ,''à faire chx_a_a''),(typologie,''chx'')))
  field(nom_du_champ(''chx_a2_a''),type(''INTEGER''),references(tbl_a,chx_a_a),non_nulle(),meta((champ,''chx_a2_a''),(nom_long_du_champ,''à faire chx_a2_a''),(nom_court_du_champ,''à faire chx_a2_a''),(nom_bref_du_champ,''à faire chx_a2_a''),(typologie,''chx'')))
 ),
)
add_index(index_name(''idx_nom_a''),nom_de_la_table_pour_l_index(''tbl_a''),fields(chp_nom_a,chx_a_a),unique(),meta((index,''idx_nom_a'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_b''),
meta((nom_long_de_la_table,''à faire tbl_b''),(nom_court_de_la_table,''à faire tbl_b''),(nom_bref_de_la_table,''à faire tbl_b''),(transform_table_sur_svg,transform(translate(314,16)))
),
 fields(
  field(nom_du_champ(''chi_id_b''),type(''INTEGER''),primary_key(),meta((champ,''chi_id_b''),(nom_long_du_champ,''identifiant unique''),(nom_court_du_champ,''id bbb''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_b''),type(''STRING''),valeur_par_defaut(''toto''),meta((champ,''chp_nom_b'')))
  field(nom_du_champ(''chx_a_b''),type(''INTEGER''),references(tbl_a,chi_id_a),non_nulle(),meta((champ,''chx_a_b''),(nom_long_du_champ,''à faire''),(nom_court_du_champ,''à faire''),(nom_bref_du_champ,''id''),(typologie,''chx'')))
  field(nom_du_champ(''cht_t_b''),type(''CHARACTER''),meta((champ,''cht_t_b''),(nom_long_du_champ,''à faire cht_t_b''),(nom_court_du_champ,''à faire cht_t_b''),(nom_bref_du_champ,''à faire cht_t_b''),(typologie,''cht'')))
 ),
)','sqlite');
/*



  =========================================================================
  Pour la table tbl_tests il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_tests`( `chi_id_test`, `chp_nom_test`, `chx_test_parent_test`, `chp_texte1_test`) VALUES
('1','','0','hello '' \ world');
/*



  =========================================================================
  Pour la table tbl_requetes il y a 16 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_requetes`( `chi_id_requete`, `chx_cible_requete`, `chp_type_requete`, `cht_rev_requete`, `cht_sql_requete`, `cht_php_requete`, `cht_commentaire_requete`) VALUES
('1','1','select','sélectionner(
   valeurs(champ(`T0` , `chi_id_utilisateur`) , champ(`T0` , `chp_mot_de_passe_utilisateur`) , champ(`T0` , `chp_parametres_utilisateur`)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_utilisateurs , alias(T0) , base(b1)))
      )
   ),
   conditions(egal(champ(`T0` , `chp_nom_de_connexion_utilisateur`) , :nom_de_connexion)),
   complements(limité_à(quantité(1) , début(0)))
)','SELECT 
`T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`
 FROM b1.tbl_utilisateurs T0
WHERE `T0`.`chp_nom_de_connexion_utilisateur` = :nom_de_connexion LIMIT 1 OFFSET 0 ;','function sql_1($par){
    $champs0=''
      `T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`
    '';
    $sql0=''SELECT ''.$champs0;
    $from0=''
      FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_utilisateurs T0    '';
    $sql0.=$from0;
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `T0`.`chp_nom_de_connexion_utilisateur` = ''.sq1($par[''nom_de_connexion'']).''''.CRLF;
    $sql0.=$where0;
    $order0='''';
    $sql0.=$order0;
    $plage0=''
       LIMIT 1 OFFSET 0 '';
    $sql0.=$plage0;
    $donnees0=array();
    //echo __FILE__ . '' '' . __LINE__ . '' $sql0 = <pre>'' . var_export( $sql0 , true ) . ''</pre>'' ; exit(0);
    $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
    if(($stmt0 !== false)){
        $res0=$stmt0->execute();
        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
            $donnees0[]=array(
                ''T0.chi_id_utilisateur'' => $tab0[0],
                ''T0.chp_mot_de_passe_utilisateur'' => $tab0[1],
                ''T0.chp_parametres_utilisateur'' => $tab0[2],
            );
        }
        return array(
           ''statut''  => true       ,
           ''valeur'' => $donnees0   ,
           ''sql'' => $sql0          ,
           ''where0'' => $where0     ,
        );
    }else{
        return array(
           ''statut''  => false ,
           ''message'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),
           ''sql'' => $sql0,
           ''where0'' => $where0     ,
        );
    }
}
',NULL),
('2','1','select_liste','sélectionner(
   valeurs(
      champ(`T0` , `chi_id_requete`),
      champ(`T0` , `chp_type_requete`),
      champ(`T0` , `cht_rev_requete`),
      champ(`T0` , `cht_sql_requete`),
      champ(`T0` , `cht_php_requete`),
      champ(`T0` , `cht_commentaire_requete`)
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_requetes , alias(T0) , base(b1)))
      )
   ),
   conditions(
      et(
         #(),
         egal(champ(`T0` , `chx_cible_requete`) , :T0_chx_cible_requete),
         egal(champ(`T0` , `chi_id_requete`) , :T0_chi_id_requete),
         comme(champ(`T0` , `chp_type_requete`) , :T0_chp_type_requete),
         comme(champ(`T0` , `cht_rev_requete`) , :T0_cht_rev_requete)
      )
   ),
   complements(
      trier_par((champ(`T0` , `chi_id_requete`) , décroissant())),
      limité_à(quantité(:quantitee) , début(:debut))
   )
)','SELECT 
`T0`.`chi_id_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , 
`T0`.`cht_commentaire_requete`
 FROM b1.tbl_requetes T0
WHERE (/*  */ `T0`.`chx_cible_requete` = :T0_chx_cible_requete AND `T0`.`chi_id_requete` = :T0_chi_id_requete AND `T0`.`chp_type_requete` LIKE :T0_chp_type_requete AND `T0`.`cht_rev_requete` LIKE :T0_cht_rev_requete) ORDER BY  `T0`.`chi_id_requete` DESC LIMIT :quantitee OFFSET :debut ;','function sql_2($par){
    $champs0=''
      `T0`.`chi_id_requete` , `T0`.`chp_type_requete` , `T0`.`cht_rev_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete` , 
      `T0`.`cht_commentaire_requete`
    '';
    $sql0=''SELECT ''.$champs0;
    $from0=''
      FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_requetes T0    '';
    $sql0.=$from0;
    $where0='' WHERE 1=1 ''.CRLF;
    if(($par[''T0_chx_cible_requete''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chx_cible_requete`'',$par[''T0_chx_cible_requete'']);
    }
    if(($par[''T0_chi_id_requete''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chi_id_requete`'',$par[''T0_chi_id_requete'']);
    }
    if(($par[''T0_chp_type_requete''] !== '''')){
        $where0.='' AND `T0`.`chp_type_requete` LIKE ''.sq1($par[''T0_chp_type_requete'']).''''.CRLF;
    }
    if(($par[''T0_cht_rev_requete''] !== '''')){
        $where0.='' AND `T0`.`cht_rev_requete` LIKE ''.sq1($par[''T0_cht_rev_requete'']).''''.CRLF;
    }
    $sql0.=$where0;
    $order0=''
       ORDER BY  `T0`.`chi_id_requete` DESC'';
    $sql0.=$order0;
    $plage0=''
       LIMIT ''.sq1($par[''quantitee'']).'' OFFSET ''.sq1($par[''debut'']).'' '';
    $sql0.=$plage0;
    $donnees0=array();
    //echo __FILE__ . '' '' . __LINE__ . '' $sql0 = <pre>'' . var_export( $sql0 , true ) . ''</pre>'' ; exit(0);
    $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
    if(($stmt0 !== false)){
        $res0=$stmt0->execute();
        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
            $donnees0[]=array(
                ''T0.chi_id_requete'' => $tab0[0],
                ''T0.chp_type_requete'' => $tab0[1],
                ''T0.cht_rev_requete'' => $tab0[2],
                ''T0.cht_sql_requete'' => $tab0[3],
                ''T0.cht_php_requete'' => $tab0[4],
                ''T0.cht_commentaire_requete'' => $tab0[5],
            );
        }
        $stmt0->close();
        $__nbEnregs=count($donnees0);
        if(($__nbEnregs >= $par[''quantitee''] || $_SESSION[APP_KEY][''__filtres''][$par[''page_courante'']][''champs''][''__xpage''] > 0)){
            $sql1=''SELECT COUNT(*) ''.$from0.$where0;
            $__nbEnregs=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql1);
        }
        return array(
           ''statut''  => true       ,
           ''valeur'' => $donnees0   ,
           ''nombre'' => $__nbEnregs ,
           ''sql'' => $sql0          ,
           ''where0'' => $where0     ,
        );
    }else{
        return array(
         ''statut''  => false ,
         ''message'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),
         ''sql'' => $sql0,
         ''where0'' => $where0     ,
        );
    }
}
',NULL),
('3','1','update','modifier(
   valeurs(affecte(champ(`chi_id_requete`) , :n_chi_id_requete)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_requetes , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chi_id_requete`) , :c_chi_id_requete))
   )
)','
UPDATE b1.tbl_requetes SET `chi_id_requete` = :n_chi_id_requete
WHERE (`chi_id_requete` = :c_chi_id_requete) ;','function sql_3($par){
    $texte_sql_3=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_requetes` SET ''.CRLF;
    if($par[''n_chi_id_requete'']==='''' || $par[''n_chi_id_requete'']===NULL ){
        $texte_sql_3.=''    `chi_id_requete`  = NULL  ''.CRLF;
    }else{
        $texte_sql_3.=''    `chi_id_requete`  = ''.sq0($par[''n_chi_id_requete'']).'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_requete` = ''.sq1($par[''c_chi_id_requete'']).''''.CRLF;
    $texte_sql_3.=$where0;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_3)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_3()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('4','1','delete','supprimer(
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_requetes , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chi_id_requete`) , :chi_id_requete) , egal(champ(`chx_cible_requete`) , :chx_cible_requete))
   )
)','
DELETE FROM b1.tbl_requetes
WHERE (`chi_id_requete` = :chi_id_requete AND `chx_cible_requete` = :chx_cible_requete) ;','function sql_4($par){
    $texte_sql_4=''
      
      DELETE FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_requetes
          WHERE (`chi_id_requete` = ''.sq1($par[''chi_id_requete'']).'' AND `chx_cible_requete` = ''.sq1($par[''chx_cible_requete'']).'') ;
    '';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_4)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_4()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('5','1','delete','supprimer(
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_revs , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chx_cible_rev`) , :chx_cible_rev) , egal(champ(`chp_provenance_rev`) , :chp_provenance_rev) , egal(champ(`chx_source_rev`) , :chx_source_rev))
   )
)','
DELETE FROM b1.tbl_revs
WHERE (`chx_cible_rev` = :chx_cible_rev AND `chp_provenance_rev` = :chp_provenance_rev AND `chx_source_rev` = :chx_source_rev) ;','function sql_5($par){
    $texte_sql_5=''
      
      DELETE FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_revs
          WHERE (`chx_cible_rev` = ''.sq1($par[''chx_cible_rev'']).'' AND `chp_provenance_rev` = ''.sq1($par[''chp_provenance_rev'']).'' AND `chx_source_rev` = ''.sq1($par[''chx_source_rev'']).'') ;
    '';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_5)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_5()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('6','1','select','sélectionner(
   valeurs(champ(`T0` , `chi_id_requete`) , champ(`T0` , `cht_sql_requete`) , champ(`T0` , `cht_php_requete`)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_requetes , alias(T0) , base(b1)))
      )
   ),
   complements(trier_par(champ(`T0` , `chi_id_requete`) , croissant()))
)','SELECT 
`T0`.`chi_id_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete`
 FROM b1.tbl_requetes T0 ORDER BY  `T0`.`chi_id_requete`  ASC;','function sql_6($par){
    $champs0=''
      `T0`.`chi_id_requete` , `T0`.`cht_sql_requete` , `T0`.`cht_php_requete`
    '';
    $sql0=''SELECT ''.$champs0;
    $from0=''
      FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_requetes T0    '';
    $sql0.=$from0;
    /* ATTENTION : pas de condition dans cette liste */
    $where0='' WHERE 1 '';
    $sql0.=$where0;
    $order0=''
       ORDER BY  `T0`.`chi_id_requete`  ASC'';
    $sql0.=$order0;
    /* ATTENTION : pas de limites */
    $plage0='''';
    $sql0.=$plage0;
    $donnees0=array();
    //echo __FILE__ . '' '' . __LINE__ . '' $sql0 = <pre>'' . var_export( $sql0 , true ) . ''</pre>'' ; exit(0);
    $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
    if(($stmt0 !== false)){
        $res0=$stmt0->execute();
        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
            $donnees0[]=array(
                ''T0.chi_id_requete'' => $tab0[0],
                ''T0.cht_sql_requete'' => $tab0[1],
                ''T0.cht_php_requete'' => $tab0[2],
            );
        }
        return array(
           ''statut''  => true       ,
           ''valeur'' => $donnees0   ,
           ''sql'' => $sql0          ,
           ''where0'' => $where0     ,
        );
    }else{
        return array(
           ''statut''  => false ,
           ''message'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),
           ''sql'' => $sql0,
           ''where0'' => $where0     ,
        );
    }
}
',NULL),
('7','1','insert','insérer(
   valeurs(affecte(champ(`chx_cible_requete`) , :chx_cible_requete) , affecte(champ(`chp_type_requete`) , :chp_type_requete) , affecte(champ(`cht_rev_requete`) , :cht_rev_requete) , affecte(champ(`cht_sql_requete`) , :cht_sql_requete) , affecte(champ(`cht_php_requete`) , :cht_php_requete)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_requetes , base(b1)))
      )
   )
)','
INSERT INTO b1.`tbl_requetes`(
    `chx_cible_requete` , 
    `chp_type_requete` , 
    `cht_rev_requete` , 
    `cht_sql_requete` , 
    `cht_php_requete`
) VALUES (
    :chx_cible_requete , 
    :chp_type_requete , 
    :cht_rev_requete , 
    :cht_sql_requete , 
    :cht_php_requete
);','function sql_7($par){
    $texte_sql_7=''
      INSERT INTO `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_requetes`(
         `chx_cible_requete` , 
         `chp_type_requete` , 
         `cht_rev_requete` , 
         `cht_sql_requete` , 
         `cht_php_requete`
      ) VALUES 
    '';
    $liste_des_valeurs='''';
    for($i=0;($i < count($par));$i++){
        if($liste_des_valeurs != ''''){
            $liste_des_valeurs.='','';
        }
        $liste_des_valeurs.=''('';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chx_cible_requete'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_type_requete'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''cht_rev_requete'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''cht_sql_requete'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''cht_php_requete'']).'''';
        $liste_des_valeurs.='')'';
    }
    $texte_sql_7.=$liste_des_valeurs;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_7)){
        return(array(
            ''statut''      => false, 
            ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode(), 
            ''message'' => ''erreur sql_7()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()
        ));
    }else{
        return(array( 
            ''statut''      => true,
            ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes(),
            ''nouvel_id''   => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastInsertRowID(),
        ));
    }
}
',NULL),
('8','1','update','modifier(
   valeurs(affecte(champ(`chx_source_rev`) , :n_chx_source_rev)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_revs , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chx_cible_rev`) , :c_chx_cible_rev) , egal(champ(`chp_provenance_rev`) , :c_chp_provenance_rev) , egal(champ(`chx_source_rev`) , :c_chx_source_rev))
   )
)','
UPDATE b1.tbl_revs SET `chx_source_rev` = :n_chx_source_rev
WHERE (`chx_cible_rev` = :c_chx_cible_rev AND `chp_provenance_rev` = :c_chp_provenance_rev AND `chx_source_rev` = :c_chx_source_rev) ;','function sql_8($par){
    $texte_sql_8=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_revs` SET ''.CRLF;
    if($par[''n_chx_source_rev'']==='''' || $par[''n_chx_source_rev'']===NULL ){
        $texte_sql_8.=''    `chx_source_rev`  = NULL  ''.CRLF;
    }else{
        $texte_sql_8.=''    `chx_source_rev`  = ''.sq0($par[''n_chx_source_rev'']).'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chx_cible_rev` = ''.sq1($par[''c_chx_cible_rev'']).''''.CRLF;
    $where0.='' AND `chp_provenance_rev` = ''.sq1($par[''c_chp_provenance_rev'']).''''.CRLF;
    $where0.='' AND `chx_source_rev` = ''.sq1($par[''c_chx_source_rev'']).''''.CRLF;
    $texte_sql_8.=$where0;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_8)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_8()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('9','1','update','modifier(
   valeurs(affecte(champ(`chp_type_requete`) , :n_chp_type_requete) , affecte(champ(`cht_rev_requete`) , :n_cht_rev_requete) , affecte(champ(`cht_sql_requete`) , :n_cht_sql_requete) , affecte(champ(`cht_php_requete`) , :n_cht_php_requete)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_requetes , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chi_id_requete`) , :c_chi_id_requete) , egal(champ(`chx_cible_requete`) , :c_chx_cible_requete))
   )
)','
UPDATE b1.tbl_requetes SET `chp_type_requete` = :n_chp_type_requete , `cht_rev_requete` = :n_cht_rev_requete , `cht_sql_requete` = :n_cht_sql_requete , `cht_php_requete` = :n_cht_php_requete
WHERE (`chi_id_requete` = :c_chi_id_requete AND `chx_cible_requete` = :c_chx_cible_requete) ;','function sql_9($par){
    $texte_sql_9=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_requetes` SET ''.CRLF;
    if($par[''n_chp_type_requete'']==='''' || $par[''n_chp_type_requete'']===NULL ){
        $texte_sql_9.=''    `chp_type_requete`  = NULL  , ''.CRLF;
    }else{
        $texte_sql_9.=''    `chp_type_requete`  = \''''.sq0($par[''n_chp_type_requete'']).''\'' , ''.CRLF;
    }
    if($par[''n_cht_rev_requete'']==='''' || $par[''n_cht_rev_requete'']===NULL ){
        $texte_sql_9.=''    `cht_rev_requete`   = NULL   , ''.CRLF;
    }else{
        $texte_sql_9.=''    `cht_rev_requete`   = \''''.sq0($par[''n_cht_rev_requete'']).''\'' , ''.CRLF;
    }
    if($par[''n_cht_sql_requete'']==='''' || $par[''n_cht_sql_requete'']===NULL ){
        $texte_sql_9.=''    `cht_sql_requete`   = NULL   , ''.CRLF;
    }else{
        $texte_sql_9.=''    `cht_sql_requete`   = \''''.sq0($par[''n_cht_sql_requete'']).''\'' , ''.CRLF;
    }
    if($par[''n_cht_php_requete'']==='''' || $par[''n_cht_php_requete'']===NULL ){
        $texte_sql_9.=''    `cht_php_requete`   = NULL   ''.CRLF;
    }else{
        $texte_sql_9.=''    `cht_php_requete`   = \''''.sq0($par[''n_cht_php_requete'']).''\'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_requete` = ''.sq1($par[''c_chi_id_requete'']).''''.CRLF;
    $where0.='' AND `chx_cible_requete` = ''.sq1($par[''c_chx_cible_requete'']).''''.CRLF;
    $texte_sql_9.=$where0;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_9)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_9()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('10','1','update','modifier(
   valeurs(affecte(champ(`chp_rev_travail_basedd`) , :n_chp_rev_travail_basedd)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_bdds , base(b1)))
      )
   ),
   conditions(egal(champ(`chi_id_basedd`) , :c_chi_id_basedd))
)','
UPDATE b1.tbl_bdds SET `chp_rev_travail_basedd` = :n_chp_rev_travail_basedd
WHERE `chi_id_basedd` = :c_chi_id_basedd ;','function sql_10($par){
    $texte_sql_10=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_bdds` SET ''.CRLF;
    if($par[''n_chp_rev_travail_basedd'']==='''' || $par[''n_chp_rev_travail_basedd'']===NULL ){
        $texte_sql_10.=''    `chp_rev_travail_basedd`  = NULL  ''.CRLF;
    }else{
        $texte_sql_10.=''    `chp_rev_travail_basedd`  = \''''.sq0($par[''n_chp_rev_travail_basedd'']).''\'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_basedd` = ''.sq1($par[''c_chi_id_basedd'']).''''.CRLF;
    $texte_sql_10.=$where0;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_10)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_10()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('11','1','select','sélectionner(
   valeurs(champ(`T0` , `chi_id_basedd`) , champ(`T0` , `chp_rev_travail_basedd`) , champ(`T0` , `chp_nom_basedd`)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_bdds , alias(T0) , base(b1)))
      )
   ),
   conditions(dans(champ(`T0` , `chi_id_basedd`) , (:les_id_des_bases)))
)','SELECT 
`T0`.`chi_id_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_nom_basedd`
 FROM b1.tbl_bdds T0
WHERE `T0`.`chi_id_basedd` IN (:les_id_des_bases);','function sql_11($par){
    $champs0=''
      `T0`.`chi_id_basedd` , `T0`.`chp_rev_travail_basedd` , `T0`.`chp_nom_basedd`
    '';
    $sql0=''SELECT ''.$champs0;
    $from0=''
      FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_bdds T0    '';
    $sql0.=$from0;
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chi_id_basedd`'',$par[''les_id_des_bases'']);
    $sql0.=$where0;
    $donnees0=array();
    //echo __FILE__ . '' '' . __LINE__ . '' $sql0 = <pre>'' . var_export( $sql0 , true ) . ''</pre>'' ; exit(0);
    $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
    if(($stmt0 !== false)){
        $res0=$stmt0->execute();
        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
            $donnees0[]=array(
                ''T0.chi_id_basedd'' => $tab0[0],
                ''T0.chp_rev_travail_basedd'' => $tab0[1],
                ''T0.chp_nom_basedd'' => $tab0[2],
            );
        }
        return array(
           ''statut''  => true       ,
           ''valeur'' => $donnees0   ,
           ''sql'' => $sql0          ,
           ''where0'' => $where0     ,
        );
    }else{
        return array(
           ''statut''  => false ,
           ''message'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),
           ''sql'' => $sql0,
           ''where0'' => $where0     ,
        );
    }
}
',NULL),
('12','1','insert','insérer(
   valeurs(
      affecte(champ(`chx_cible_rev`) , :chx_cible_rev),
      affecte(champ(`chp_provenance_rev`) , :chp_provenance_rev),
      affecte(champ(`chx_source_rev`) , :chx_source_rev),
      affecte(champ(`chp_id_rev`) , :chp_id_rev),
      affecte(champ(`chp_valeur_rev`) , :chp_valeur_rev),
      affecte(champ(`chp_type_rev`) , :chp_type_rev),
      affecte(champ(`chp_niveau_rev`) , :chp_niveau_rev),
      affecte(champ(`chp_quotee_rev`) , :chp_quotee_rev),
      affecte(champ(`chp_pos_premier_rev`) , :chp_pos_premier_rev),
      affecte(champ(`chp_pos_dernier_rev`) , :chp_pos_dernier_rev),
      affecte(champ(`chp_parent_rev`) , :chp_parent_rev),
      affecte(champ(`chp_nbr_enfants_rev`) , :chp_nbr_enfants_rev),
      affecte(champ(`chp_num_enfant_rev`) , :chp_num_enfant_rev),
      affecte(champ(`chp_profondeur_rev`) , :chp_profondeur_rev),
      affecte(champ(`chp_pos_ouver_parenthese_rev`) , :chp_pos_ouver_parenthese_rev),
      affecte(champ(`chp_pos_fermer_parenthese_rev`) , :chp_pos_fermer_parenthese_rev),
      affecte(champ(`chp_commentaire_rev`) , :chp_commentaire_rev)
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_revs , base(b1)))
      )
   )
)','
INSERT INTO b1.`tbl_revs`(
    `chx_cible_rev` , 
    `chp_provenance_rev` , 
    `chx_source_rev` , 
    `chp_id_rev` , 
    `chp_valeur_rev` , 
    `chp_type_rev` , 
    `chp_niveau_rev` , 
    `chp_quotee_rev` , 
    `chp_pos_premier_rev` , 
    `chp_pos_dernier_rev` , 
    `chp_parent_rev` , 
    `chp_nbr_enfants_rev` , 
    `chp_num_enfant_rev` , 
    `chp_profondeur_rev` , 
    `chp_pos_ouver_parenthese_rev` , 
    `chp_pos_fermer_parenthese_rev` , 
    `chp_commentaire_rev`
) VALUES (
    :chx_cible_rev , 
    :chp_provenance_rev , 
    :chx_source_rev , 
    :chp_id_rev , 
    :chp_valeur_rev , 
    :chp_type_rev , 
    :chp_niveau_rev , 
    :chp_quotee_rev , 
    :chp_pos_premier_rev , 
    :chp_pos_dernier_rev , 
    :chp_parent_rev , 
    :chp_nbr_enfants_rev , 
    :chp_num_enfant_rev , 
    :chp_profondeur_rev , 
    :chp_pos_ouver_parenthese_rev , 
    :chp_pos_fermer_parenthese_rev , 
    :chp_commentaire_rev
);','function sql_12($par){
    $texte_sql_12=''
      INSERT INTO `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_revs`(
         `chx_cible_rev` , 
         `chp_provenance_rev` , 
         `chx_source_rev` , 
         `chp_id_rev` , 
         `chp_valeur_rev` , 
         `chp_type_rev` , 
         `chp_niveau_rev` , 
         `chp_quotee_rev` , 
         `chp_pos_premier_rev` , 
         `chp_pos_dernier_rev` , 
         `chp_parent_rev` , 
         `chp_nbr_enfants_rev` , 
         `chp_num_enfant_rev` , 
         `chp_profondeur_rev` , 
         `chp_pos_ouver_parenthese_rev` , 
         `chp_pos_fermer_parenthese_rev` , 
         `chp_commentaire_rev`
      ) VALUES 
    '';
    $liste_des_valeurs='''';
    for($i=0;($i < count($par));$i++){
        if($liste_des_valeurs != ''''){
            $liste_des_valeurs.='','';
        }
        $liste_des_valeurs.=''('';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chx_cible_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_provenance_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chx_source_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_id_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_valeur_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_type_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_niveau_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_quotee_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_pos_premier_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_pos_dernier_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_parent_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_nbr_enfants_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_num_enfant_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_profondeur_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_pos_ouver_parenthese_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_pos_fermer_parenthese_rev'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_commentaire_rev'']).'''';
        $liste_des_valeurs.='')'';
    }
    $texte_sql_12.=$liste_des_valeurs;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_12)){
        return(array(
            ''statut''      => false, 
            ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode(), 
            ''message'' => ''erreur sql_12()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()
        ));
    }else{
        return(array( 
            ''statut''      => true,
            ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes(),
            ''nouvel_id''   => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastInsertRowID(),
        ));
    }
}
',NULL),
('13','1','select_liste','sélectionner(
   valeurs(
      champ(`T0` , `chi_id_rev`),
      champ(`T0` , `chp_provenance_rev`),
      champ(`T0` , `chx_source_rev`),
      champ(`T1` , `chp_nom_source`),
      champ(`T0` , `chp_valeur_rev`),
      champ(`T0` , `chp_type_rev`),
      champ(`T0` , `chp_niveau_rev`),
      champ(`T0` , `chp_pos_premier_rev`),
      champ(`T0` , `chp_commentaire_rev`)
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_revs , alias(T0) , base(b1)))
      ),
      jointure_gauche(
         source(nom_de_la_table(tbl_sources , alias(T1) , base(b1))),
         contrainte(egal(champ(T1 , chi_id_source) , champ(T0 , chx_source_rev)))
      )
   ),
   conditions(
      et(
         egal(champ(`T0` , `chx_cible_rev`) , :T0_chx_cible_rev),
         comme(champ(`T0` , `chp_provenance_rev`) , :T0_chp_provenance_rev),
         egal(champ(`T0` , `chx_source_rev`) , :T0_chx_source_rev),
         comme(champ(`T1` , `chp_nom_source`) , :T1_chp_nom_source1),
         pas_comme(champ(`T1` , `chp_nom_source`) , :T1_chp_nom_source2),
         comme(champ(`T0` , `chp_valeur_rev`) , :T0_chp_valeur_rev),
         comme(champ(`T0` , `chp_commentaire_rev`) , :T0_chp_commentaire_rev),
         egal(champ(`T0` , `chi_id_rev`) , :T0_chi_id_rev)
      )
   ),
   complements(
      trier_par((champ(`T0` , `chp_provenance_rev`) , croissant()) , (champ(`T0` , `chx_source_rev`) , croissant())),
      limité_à(quantité(:quantitee) , début(:debut))
   )
)','SELECT 
`T0`.`chi_id_rev` , `T0`.`chp_provenance_rev` , `T0`.`chx_source_rev` , `T1`.`chp_nom_source` , `T0`.`chp_valeur_rev` , 
`T0`.`chp_type_rev` , `T0`.`chp_niveau_rev` , `T0`.`chp_pos_premier_rev` , `T0`.`chp_commentaire_rev`
 FROM b1.tbl_revs T0
 LEFT JOIN b1.tbl_sources T1 ON T1.chi_id_source = T0.chx_source_rev

WHERE (`T0`.`chx_cible_rev` = :T0_chx_cible_rev AND `T0`.`chp_provenance_rev` LIKE :T0_chp_provenance_rev AND `T0`.`chx_source_rev` = :T0_chx_source_rev AND `T1`.`chp_nom_source` LIKE :T1_chp_nom_source1 AND `T1`.`chp_nom_source` NOT LIKE :T1_chp_nom_source2 AND `T0`.`chp_valeur_rev` LIKE :T0_chp_valeur_rev AND `T0`.`chp_commentaire_rev` LIKE :T0_chp_commentaire_rev AND `T0`.`chi_id_rev` = :T0_chi_id_rev) ORDER BY  `T0`.`chp_provenance_rev` ASC, `T0`.`chx_source_rev` ASC LIMIT :quantitee OFFSET :debut ;','function sql_13($par){
    $champs0=''
      `T0`.`chi_id_rev` , `T0`.`chp_provenance_rev` , `T0`.`chx_source_rev` , `T1`.`chp_nom_source` , `T0`.`chp_valeur_rev` , 
      `T0`.`chp_type_rev` , `T0`.`chp_niveau_rev` , `T0`.`chp_pos_premier_rev` , `T0`.`chp_commentaire_rev`
    '';
    $sql0=''SELECT ''.$champs0;
    $from0=''
      FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_revs T0
       LEFT JOIN `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_sources T1 ON T1.chi_id_source = T0.chx_source_rev
    '';
    $sql0.=$from0;
    $where0='' WHERE 1=1 ''.CRLF;
    if(($par[''T0_chx_cible_rev''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chx_cible_rev`'',$par[''T0_chx_cible_rev'']);
    }
    if(($par[''T0_chp_provenance_rev''] !== '''')){
        $where0.='' AND `T0`.`chp_provenance_rev` LIKE ''.sq1($par[''T0_chp_provenance_rev'']).''''.CRLF;
    }
    if(($par[''T0_chx_source_rev''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chx_source_rev`'',$par[''T0_chx_source_rev'']);
    }
    if(($par[''T1_chp_nom_source1''] !== '''')){
        $where0.='' AND `T1`.`chp_nom_source` LIKE ''.sq1($par[''T1_chp_nom_source1'']).''''.CRLF;
    }
    if(($par[''T1_chp_nom_source2''] !== '''')){
        $where0.='' AND `T1`.`chp_nom_source` NOT LIKE ''.sq1($par[''T1_chp_nom_source2'']).''''.CRLF;
    }
    if(($par[''T0_chp_valeur_rev''] !== '''')){
        $where0.='' AND `T0`.`chp_valeur_rev` LIKE ''.sq1($par[''T0_chp_valeur_rev'']).''''.CRLF;
    }
    if(($par[''T0_chp_commentaire_rev''] !== '''')){
        $where0.='' AND `T0`.`chp_commentaire_rev` LIKE ''.sq1($par[''T0_chp_commentaire_rev'']).''''.CRLF;
    }
    if(($par[''T0_chi_id_rev''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chi_id_rev`'',$par[''T0_chi_id_rev'']);
    }
    $sql0.=$where0;
    $order0=''
       ORDER BY  `T0`.`chp_provenance_rev` ASC, `T0`.`chx_source_rev` ASC'';
    $sql0.=$order0;
    $plage0=''
       LIMIT ''.sq1($par[''quantitee'']).'' OFFSET ''.sq1($par[''debut'']).'' '';
    $sql0.=$plage0;
    $donnees0=array();
    //echo __FILE__ . '' '' . __LINE__ . '' $sql0 = <pre>'' . var_export( $sql0 , true ) . ''</pre>'' ; exit(0);
    $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
    if(($stmt0 !== false)){
        $res0=$stmt0->execute();
        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
            $donnees0[]=array(
                ''T0.chi_id_rev'' => $tab0[0],
                ''T0.chp_provenance_rev'' => $tab0[1],
                ''T0.chx_source_rev'' => $tab0[2],
                ''T1.chp_nom_source'' => $tab0[3],
                ''T0.chp_valeur_rev'' => $tab0[4],
                ''T0.chp_type_rev'' => $tab0[5],
                ''T0.chp_niveau_rev'' => $tab0[6],
                ''T0.chp_pos_premier_rev'' => $tab0[7],
                ''T0.chp_commentaire_rev'' => $tab0[8],
            );
        }
        $stmt0->close();
        $__nbEnregs=count($donnees0);
        if(($__nbEnregs >= $par[''quantitee''] || $_SESSION[APP_KEY][''__filtres''][$par[''page_courante'']][''champs''][''__xpage''] > 0)){
            $sql1=''SELECT COUNT(*) ''.$from0.$where0;
            $__nbEnregs=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql1);
        }
        return array(
           ''statut''  => true       ,
           ''valeur'' => $donnees0   ,
           ''nombre'' => $__nbEnregs ,
           ''sql'' => $sql0          ,
           ''where0'' => $where0     ,
        );
    }else{
        return array(
         ''statut''  => false ,
         ''message'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),
         ''sql'' => $sql0,
         ''where0'' => $where0     ,
        );
    }
}
',NULL),
('14','1','delete','supprimer(
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_revs , base(b1)))
      )
   ),
   conditions(egal(champ(`chx_cible_rev`) , :chx_cible_rev))
)','
DELETE FROM b1.tbl_revs
WHERE `chx_cible_rev` = :chx_cible_rev ;','function sql_14($par){
    $texte_sql_14=''
      
      DELETE FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_revs
          WHERE `chx_cible_rev` = ''.sq1($par[''chx_cible_rev'']).'' ;
    '';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_14)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_14()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('15','1','select_liste','sélectionner(
   valeurs(champ(`T0` , `chi_id_basedd`) , champ(`T0` , `chp_nom_basedd`) , champ(`T0` , `chp_commentaire_basedd`)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_bdds , alias(T0) , base(b1)))
      )
   ),
   conditions(
      et(
         #(),
         egal(champ(`T0` , `chx_cible_id_basedd`) , :T0_chx_cible_id_basedd),
         egal(champ(`T0` , `chi_id_basedd`) , :T0_chi_id_basedd),
         comme(champ(`T0` , `chp_nom_basedd`) , :T0_chp_nom_basedd)
      )
   ),
   complements(
      trier_par((champ(`T0` , `chi_id_basedd`) , croissant())),
      limité_à(quantité(:quantitee) , début(:debut))
   )
)','SELECT 
`T0`.`chi_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_commentaire_basedd`
 FROM b1.tbl_bdds T0
WHERE (/*  */ `T0`.`chx_cible_id_basedd` = :T0_chx_cible_id_basedd AND `T0`.`chi_id_basedd` = :T0_chi_id_basedd AND `T0`.`chp_nom_basedd` LIKE :T0_chp_nom_basedd) ORDER BY  `T0`.`chi_id_basedd` ASC LIMIT :quantitee OFFSET :debut ;','function sql_15($par){
    $champs0=''
      `T0`.`chi_id_basedd` , `T0`.`chp_nom_basedd` , `T0`.`chp_commentaire_basedd`
    '';
    $sql0=''SELECT ''.$champs0;
    $from0=''
      FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_bdds T0    '';
    $sql0.=$from0;
    $where0='' WHERE 1=1 ''.CRLF;
    if(($par[''T0_chx_cible_id_basedd''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chx_cible_id_basedd`'',$par[''T0_chx_cible_id_basedd'']);
    }
    if(($par[''T0_chi_id_basedd''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chi_id_basedd`'',$par[''T0_chi_id_basedd'']);
    }
    if(($par[''T0_chp_nom_basedd''] !== '''')){
        $where0.='' AND `T0`.`chp_nom_basedd` LIKE ''.sq1($par[''T0_chp_nom_basedd'']).''''.CRLF;
    }
    $sql0.=$where0;
    $order0=''
       ORDER BY  `T0`.`chi_id_basedd` ASC'';
    $sql0.=$order0;
    $plage0=''
       LIMIT ''.sq1($par[''quantitee'']).'' OFFSET ''.sq1($par[''debut'']).'' '';
    $sql0.=$plage0;
    $donnees0=array();
    //echo __FILE__ . '' '' . __LINE__ . '' $sql0 = <pre>'' . var_export( $sql0 , true ) . ''</pre>'' ; exit(0);
    $errr=error_reporting(0);
    $stmt0=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($sql0);
    error_reporting($errr);
    if(($stmt0 !== false)){
        $res0=$stmt0->execute();
        while(($tab0=$res0->fetchArray(SQLITE3_NUM))){
            $donnees0[]=array(
                ''T0.chi_id_basedd'' => $tab0[0],
                ''T0.chp_nom_basedd'' => $tab0[1],
                ''T0.chp_commentaire_basedd'' => $tab0[2],
            );
        }
        $stmt0->close();
        $__nbEnregs=count($donnees0);
        if(($__nbEnregs >= $par[''quantitee''] || $_SESSION[APP_KEY][''__filtres''][$par[''page_courante'']][''champs''][''__xpage''] > 0)){
            $sql1=''SELECT COUNT(*) ''.$from0.$where0;
            $__nbEnregs=$GLOBALS[BDD][BDD_1][LIEN_BDD]->querySingle($sql1);
        }
        return array(
           ''statut''  => true       ,
           ''valeur''  => $donnees0   ,
           ''nombre''  => $__nbEnregs ,
           ''sql0''    => $sql0          ,
           ''where0''  => $where0     ,
        );
    }else{
        return array(
         ''statut''  => false ,
         ''message'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg(),
         ''sql0''    => $sql0,
         ''where0''  => $where0     ,
        );
    }
}
',NULL),
('16','1','update','modifier(
   valeurs(
      affecte(champ(`chx_dossier_id_basedd`) , :n_chx_dossier_id_basedd),
      affecte(champ(`chp_nom_basedd`) , :n_chp_nom_basedd),
      affecte(champ(`chp_rev_basedd`) , :n_chp_rev_basedd),
      affecte(champ(`chp_commentaire_basedd`) , :n_chp_commentaire_basedd),
      affecte(champ(`chp_genere_basedd`) , :n_chp_genere_basedd),
      affecte(champ(`chp_rev_travail_basedd`) , :n_chp_rev_travail_basedd),
      affecte(champ(`chp_fournisseur_basedd`) , :n_chp_fournisseur_basedd)
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_bdds , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chi_id_basedd`) , :c_chi_id_basedd) , egal(champ(`chx_cible_id_basedd`) , :c_chx_cible_id_basedd))
   )
)','
UPDATE b1.tbl_bdds SET `chx_dossier_id_basedd` = :n_chx_dossier_id_basedd , `chp_nom_basedd` = :n_chp_nom_basedd , `chp_rev_basedd` = :n_chp_rev_basedd , `chp_commentaire_basedd` = :n_chp_commentaire_basedd , `chp_genere_basedd` = :n_chp_genere_basedd , `chp_rev_travail_basedd` = :n_chp_rev_travail_basedd , `chp_fournisseur_basedd` = :n_chp_fournisseur_basedd
WHERE (`chi_id_basedd` = :c_chi_id_basedd AND `chx_cible_id_basedd` = :c_chx_cible_id_basedd) ;','function sql_16($par){
    $texte_sql_16=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_bdds` SET ''.CRLF;
    if($par[''n_chx_dossier_id_basedd'']==='''' || $par[''n_chx_dossier_id_basedd'']===NULL ){
        $texte_sql_16.=''    `chx_dossier_id_basedd`   = NULL   , ''.CRLF;
    }else{
        $texte_sql_16.=''    `chx_dossier_id_basedd`   = ''.sq0($par[''n_chx_dossier_id_basedd'']).'' , ''.CRLF;
    }
    $texte_sql_16.=''    `chp_nom_basedd`          = \''''.sq0($par[''n_chp_nom_basedd'']).''\''          , ''.CRLF;
    if($par[''n_chp_rev_basedd'']==='''' || $par[''n_chp_rev_basedd'']===NULL ){
        $texte_sql_16.=''    `chp_rev_basedd`          = NULL          , ''.CRLF;
    }else{
        $texte_sql_16.=''    `chp_rev_basedd`          = \''''.sq0($par[''n_chp_rev_basedd'']).''\'' , ''.CRLF;
    }
    if($par[''n_chp_commentaire_basedd'']==='''' || $par[''n_chp_commentaire_basedd'']===NULL ){
        $texte_sql_16.=''    `chp_commentaire_basedd`  = NULL  , ''.CRLF;
    }else{
        $texte_sql_16.=''    `chp_commentaire_basedd`  = \''''.sq0($par[''n_chp_commentaire_basedd'']).''\'' , ''.CRLF;
    }
    if($par[''n_chp_genere_basedd'']==='''' || $par[''n_chp_genere_basedd'']===NULL ){
        $texte_sql_16.=''    `chp_genere_basedd`       = NULL       , ''.CRLF;
    }else{
        $texte_sql_16.=''    `chp_genere_basedd`       = \''''.sq0($par[''n_chp_genere_basedd'']).''\'' , ''.CRLF;
    }
    if($par[''n_chp_rev_travail_basedd'']==='''' || $par[''n_chp_rev_travail_basedd'']===NULL ){
        $texte_sql_16.=''    `chp_rev_travail_basedd`  = NULL  , ''.CRLF;
    }else{
        $texte_sql_16.=''    `chp_rev_travail_basedd`  = \''''.sq0($par[''n_chp_rev_travail_basedd'']).''\'' , ''.CRLF;
    }
    if($par[''n_chp_fournisseur_basedd'']==='''' || $par[''n_chp_fournisseur_basedd'']===NULL ){
        $texte_sql_16.=''    `chp_fournisseur_basedd`  = NULL  ''.CRLF;
    }else{
        $texte_sql_16.=''    `chp_fournisseur_basedd`  = \''''.sq0($par[''n_chp_fournisseur_basedd'']).''\'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_basedd` = ''.sq1($par[''c_chi_id_basedd'']).''''.CRLF;
    $where0.='' AND `chx_cible_id_basedd` = ''.sq1($par[''c_chx_cible_id_basedd'']).''''.CRLF;
    $texte_sql_16.=$where0;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_16)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_16()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL);
