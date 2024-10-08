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

INSERT INTO `tbl_bdds`(`chi_id_basedd`, `chx_dossier_id_basedd`, `chx_cible_id_basedd`, `chp_nom_basedd`, `chp_commentaire_basedd`, `chp_rev_basedd`) VALUES
('1','2','1','system.db','test de base virtuelle','#(
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
      field(nom_du_champ(cht_commentaire_requete) , type(TEXT) , meta((champ , ''cht_commentaire_requete'') , (nom_long_du_champ , ''à faire ...'') , (nom_court_du_champ , ''à faire ...'') , (nom_bref_du_champ , ''à faire ...'') , (typologie , ''cht''))),
      field(nom_du_champ(cht_matrice_requete) , type(TEXT) , meta((champ , ''cht_matrice_requete'') , (nom_long_du_champ , ''à faire ...'') , (nom_court_du_champ , ''à faire ...'') , (nom_bref_du_champ , ''à faire ...'') , (typologie , ''cht'')))
   )
)'),
('9','2','1','test.db','test de base virtuelle','#(
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
)');
/*



  =========================================================================
  Pour la table tbl_tests il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_tests`( `chi_id_test`, `chp_nom_test`, `chx_test_parent_test`, `chp_texte1_test`) VALUES
('1','','0','hello '' \ world');
/*



  =========================================================================
  Pour la table tbl_requetes il y a 25 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_requetes`( `chi_id_requete`, `chx_cible_requete`, `chp_type_requete`, `cht_rev_requete`, `cht_sql_requete`, `cht_php_requete`, `cht_commentaire_requete`, `cht_matrice_requete`) VALUES
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
('9','1','update','modifier(
   valeurs(affecte(champ(`chp_type_requete`) , :n_chp_type_requete) , affecte(champ(`cht_rev_requete`) , :n_cht_rev_requete) , affecte(champ(`cht_sql_requete`) , :n_cht_sql_requete) , affecte(champ(`cht_php_requete`) , :n_cht_php_requete) , affecte(champ(`cht_matrice_requete`) , :n_cht_matrice_requete)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_requetes , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chi_id_requete`) , :c_chi_id_requete) , egal(champ(`chx_cible_requete`) , :c_chx_cible_requete))
   )
)','
UPDATE b1.tbl_requetes SET `chp_type_requete` = :n_chp_type_requete , `cht_rev_requete` = :n_cht_rev_requete , `cht_sql_requete` = :n_cht_sql_requete , `cht_php_requete` = :n_cht_php_requete , `cht_matrice_requete` = :n_cht_matrice_requete
WHERE (`chi_id_requete` = :c_chi_id_requete AND `chx_cible_requete` = :c_chx_cible_requete) ;','function sql_9($par){
    $texte_sql_9=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_requetes` SET ''.CRLF;
    if($par[''n_chp_type_requete'']==='''' || $par[''n_chp_type_requete'']===NULL ){
        $texte_sql_9.=''    `chp_type_requete`     = NULL     , ''.CRLF;
    }else{
        $texte_sql_9.=''    `chp_type_requete`     = \''''.sq0($par[''n_chp_type_requete'']).''\'' , ''.CRLF;
    }
    if($par[''n_cht_rev_requete'']==='''' || $par[''n_cht_rev_requete'']===NULL ){
        $texte_sql_9.=''    `cht_rev_requete`      = NULL      , ''.CRLF;
    }else{
        $texte_sql_9.=''    `cht_rev_requete`      = \''''.sq0($par[''n_cht_rev_requete'']).''\'' , ''.CRLF;
    }
    if($par[''n_cht_sql_requete'']==='''' || $par[''n_cht_sql_requete'']===NULL ){
        $texte_sql_9.=''    `cht_sql_requete`      = NULL      , ''.CRLF;
    }else{
        $texte_sql_9.=''    `cht_sql_requete`      = \''''.sq0($par[''n_cht_sql_requete'']).''\'' , ''.CRLF;
    }
    if($par[''n_cht_php_requete'']==='''' || $par[''n_cht_php_requete'']===NULL ){
        $texte_sql_9.=''    `cht_php_requete`      = NULL      , ''.CRLF;
    }else{
        $texte_sql_9.=''    `cht_php_requete`      = \''''.sq0($par[''n_cht_php_requete'']).''\'' , ''.CRLF;
    }
    if($par[''n_cht_matrice_requete'']==='''' || $par[''n_cht_matrice_requete'']===NULL ){
        $texte_sql_9.=''    `cht_matrice_requete`  = NULL  ''.CRLF;
    }else{
        $texte_sql_9.=''    `cht_matrice_requete`  = \''''.sq0($par[''n_cht_matrice_requete'']).''\'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_requete` = ''.sq1($par[''c_chi_id_requete'']).''''.CRLF;
    $where0.='' AND `chx_cible_requete` = ''.sq1($par[''c_chx_cible_requete'']).''''.CRLF;
    $texte_sql_9.=$where0;
    // echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_9 = <pre>'' . $texte_sql_9 . ''</pre>'' ; exit(0);
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_9)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_9()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,'[[0,"","INIT",-1,0,0,0,0,1,0,0,0,0,""],[1,"modifier","f",0,0,0,7,0,3,1,6,8,0,""],[2,"valeurs","f",1,0,13,19,1,5,1,3,20,0,""],[3,"affecte","f",2,0,21,27,2,2,1,2,28,0,""],[4,"champ","f",3,0,29,33,3,1,1,1,34,0,""],[5,"chp_type_requete","c",4,2,36,51,4,0,1,0,34,0,""],[6,":n_chp_type_requete","c",3,0,57,75,3,0,2,0,34,76,""],[7,"affecte","f",2,0,80,86,2,2,2,2,87,0,""],[8,"champ","f",3,0,88,92,7,1,1,1,93,0,""],[9,"cht_rev_requete","c",4,2,95,109,8,0,1,0,93,0,""],[10,":n_cht_rev_requete","c",3,0,115,132,7,0,2,0,93,133,""],[11,"affecte","f",2,0,137,143,2,2,3,2,144,0,""],[12,"champ","f",3,0,145,149,11,1,1,1,150,0,""],[13,"cht_sql_requete","c",4,2,152,166,12,0,1,0,150,0,""],[14,":n_cht_sql_requete","c",3,0,172,189,11,0,2,0,150,190,""],[15,"affecte","f",2,0,194,200,2,2,4,2,201,0,""],[16,"champ","f",3,0,202,206,15,1,1,1,207,0,""],[17,"cht_php_requete","c",4,2,209,223,16,0,1,0,207,0,""],[18,":n_cht_php_requete","c",3,0,229,246,15,0,2,0,207,247,""],[19,"affecte","f",2,0,251,257,2,2,5,2,258,0,""],[20,"champ","f",3,0,259,263,19,1,1,1,264,0,""],[21,"cht_matrice_requete","c",4,2,266,284,20,0,1,0,264,0,""],[22,":n_cht_matrice_requete","c",3,0,290,311,19,0,2,0,264,312,""],[23,"provenance","f",1,0,319,328,1,1,2,5,329,0,""],[24,"table_reference","f",2,0,337,351,23,1,1,4,352,0,""],[25,"source","f",3,0,363,368,24,1,1,3,369,0,""],[26,"nom_de_la_table","f",4,0,370,384,25,2,1,2,385,0,""],[27,"tbl_requetes","c",5,0,386,397,26,0,1,0,0,0,""],[28,"base","f",5,0,401,404,26,1,2,1,405,0,""],[29,"b1","c",6,0,406,407,28,0,1,0,405,408,""],[30,"conditions","f",1,0,429,438,1,1,3,4,439,0,""],[31,"et","f",2,0,447,448,30,2,1,3,449,0,""],[32,"egal","f",3,0,450,453,31,2,1,2,454,0,""],[33,"champ","f",4,0,455,459,32,1,1,1,460,0,""],[34,"chi_id_requete","c",5,2,462,475,33,0,1,0,460,0,""],[35,":c_chi_id_requete","c",4,0,481,497,32,0,2,0,460,498,""],[36,"egal","f",3,0,502,505,31,2,2,2,506,0,""],[37,"champ","f",4,0,507,511,36,1,1,1,512,0,""],[38,"chx_cible_requete","c",5,2,514,530,37,0,1,0,512,0,""],[39,":c_chx_cible_requete","c",4,0,536,555,36,0,2,0,512,556,""]]'),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
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
',NULL,NULL),
('17','1','insert','insérer(
   valeurs(affecte(champ(`chx_dossier_id_basedd`) , :chx_dossier_id_basedd) , affecte(champ(`chx_cible_id_basedd`) , :chx_cible_id_basedd) , affecte(champ(`chp_nom_basedd`) , :chp_nom_basedd) , affecte(champ(`chp_commentaire_basedd`) , :chp_commentaire_basedd) , affecte(champ(`chp_fournisseur_basedd`) , :chp_fournisseur_basedd)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_bdds , base(b1)))
      )
   )
)','
INSERT INTO b1.`tbl_bdds`(
    `chx_dossier_id_basedd` , 
    `chx_cible_id_basedd` , 
    `chp_nom_basedd` , 
    `chp_commentaire_basedd` , 
    `chp_fournisseur_basedd`
) VALUES (
    :chx_dossier_id_basedd , 
    :chx_cible_id_basedd , 
    :chp_nom_basedd , 
    :chp_commentaire_basedd , 
    :chp_fournisseur_basedd
);','function sql_17($par){
    $texte_sql_17=''
      INSERT INTO `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_bdds`(
         `chx_dossier_id_basedd` , 
         `chx_cible_id_basedd` , 
         `chp_nom_basedd` , 
         `chp_commentaire_basedd` , 
         `chp_fournisseur_basedd`
      ) VALUES 
    '';
    $liste_des_valeurs='''';
    for($i=0;($i < count($par));$i++){
        if($liste_des_valeurs != ''''){
            $liste_des_valeurs.='','';
        }
        $liste_des_valeurs.=''('';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chx_dossier_id_basedd'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chx_cible_id_basedd'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_nom_basedd'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_commentaire_basedd'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[$i][''chp_fournisseur_basedd'']).'''';
        $liste_des_valeurs.='')'';
    }
    $texte_sql_17.=$liste_des_valeurs;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_17)){
        return(array(
            ''statut''      => false, 
            ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode(), 
            ''message'' => ''erreur sql_17()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()
        ));
    }else{
        return(array( 
            ''statut''      => true,
            ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes(),
            ''nouvel_id''   => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastInsertRowID(),
        ));
    }
}
',NULL,NULL),
('18','1','delete','supprimer(
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_bdds , base(b1)))
      )
   ),
   conditions(egal(champ(`chi_id_basedd`) , :chi_id_basedd))
)','
DELETE FROM b1.tbl_bdds
WHERE `chi_id_basedd` = :chi_id_basedd ;','function sql_18($par){
    $texte_sql_18=''
      
      DELETE FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_bdds
          WHERE `chi_id_basedd` = ''.sq1($par[''chi_id_basedd'']).'' ;
    '';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_18)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_18()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,NULL),
('19','1','select_liste','sélectionner(
   valeurs(champ(`T0` , `chi_id_tache`) , champ(`T0` , `chp_texte_tache`) , champ(`T0` , `chp_priorite_tache`)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_taches , alias(T0) , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`T0` , `chi_id_tache`) , :T0_chi_id_tache) , egal(champ(`T0` , `chx_utilisateur_tache`) , :T0_chx_utilisateur_tache) , comme(champ(`T0` , `chp_texte_tache`) , :T0_chp_texte_tache) , egal(champ(`T0` , `chp_priorite_tache`) , :T0_chp_priorite_tache))
   ),
   complements(
      trier_par((champ(`T0` , `chp_priorite_tache`) , croissant())),
      limité_à(quantité(:quantitee) , début(:debut))
   )
)','SELECT 
`T0`.`chi_id_tache` , `T0`.`chp_texte_tache` , `T0`.`chp_priorite_tache`
 FROM b1.tbl_taches T0
WHERE (`T0`.`chi_id_tache` = :T0_chi_id_tache AND `T0`.`chx_utilisateur_tache` = :T0_chx_utilisateur_tache AND `T0`.`chp_texte_tache` LIKE :T0_chp_texte_tache AND `T0`.`chp_priorite_tache` = :T0_chp_priorite_tache) ORDER BY  `T0`.`chp_priorite_tache` ASC LIMIT :quantitee OFFSET :debut ;','function sql_19($par){
    $champs0=''
      `T0`.`chi_id_tache` , `T0`.`chp_texte_tache` , `T0`.`chp_priorite_tache`
    '';
    $sql0=''SELECT ''.$champs0;
    $from0=''
      FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_taches T0    '';
    $sql0.=$from0;
    $where0='' WHERE 1=1 ''.CRLF;
    if(($par[''T0_chi_id_tache''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chi_id_tache`'',$par[''T0_chi_id_tache'']);
    }
    if(($par[''T0_chx_utilisateur_tache''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chx_utilisateur_tache`'',$par[''T0_chx_utilisateur_tache'']);
    }
    if(($par[''T0_chp_texte_tache''] !== '''')){
        $where0.='' AND `T0`.`chp_texte_tache` LIKE ''.sq1($par[''T0_chp_texte_tache'']).''''.CRLF;
    }
    if(($par[''T0_chp_priorite_tache''] !== '''')){
        $where0.=CRLF.construction_where_sql_sur_id(''`T0`.`chp_priorite_tache`'',$par[''T0_chp_priorite_tache'']);
    }
    $sql0.=$where0;
    $order0=''
       ORDER BY  `T0`.`chp_priorite_tache` ASC'';
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
                ''T0.chi_id_tache'' => $tab0[0],
                ''T0.chp_texte_tache'' => $tab0[1],
                ''T0.chp_priorite_tache'' => $tab0[2],
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
',NULL,NULL),
('20','1','update','modifier(
   valeurs(
      affecte(champ(`chp_priorite_tache`) , moins(champ(`chp_priorite_tache`) , 1))
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_taches , base(b1)))
      )
   ),
   conditions(
      et(
         #(),
         egal(champ(`chi_id_tache`) , :c_chi_id_tache),
         egal(champ(`chx_utilisateur_tache`) , :c_chx_utilisateur_tache),
         supegal(champ(`chp_priorite_tache`) , 1)
      )
   )
)','
UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`-1)
WHERE (/*  */ `chi_id_tache` = :c_chi_id_tache AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache AND `chp_priorite_tache` >= 1) ;','function sql_20($par){
    $texte_sql_20=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_taches` SET ''.CRLF;
    $texte_sql_20.='' `chp_priorite_tache` = (`chp_priorite_tache`-1) ''.CRLF;
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_tache` = ''.sq1($par[''c_chi_id_tache'']).''''.CRLF;
    $where0.='' AND `chx_utilisateur_tache` = ''.sq1($par[''c_chx_utilisateur_tache'']).''''.CRLF;
    $where0.='' AND `chp_priorite_tache` >= 1''.CRLF;
    $texte_sql_20.=$where0;
    // echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_20 = <pre>'' . $texte_sql_20 . ''</pre>'' ; exit(0);
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_20)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_20()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,NULL),
('21','1','update','modifier(
   valeurs(
      affecte(champ(`chp_priorite_tache`) , plus(champ(`chp_priorite_tache`) , 1))
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_taches , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chi_id_tache`) , :c_chi_id_tache) , egal(champ(`chx_utilisateur_tache`) , :c_chx_utilisateur_tache) , inf(champ(`chp_priorite_tache`) , 50))
   )
)','
UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`+1)
WHERE (`chi_id_tache` = :c_chi_id_tache AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache AND `chp_priorite_tache` < 50) ;','function sql_21($par){
    $texte_sql_21=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_taches` SET ''.CRLF;
    $texte_sql_21.='' `chp_priorite_tache` = (`chp_priorite_tache`+1) ''.CRLF;
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_tache` = ''.sq1($par[''c_chi_id_tache'']).''''.CRLF;
    $where0.='' AND `chx_utilisateur_tache` = ''.sq1($par[''c_chx_utilisateur_tache'']).''''.CRLF;
    $where0.='' AND `chp_priorite_tache` < 50''.CRLF;
    $texte_sql_21.=$where0;
    // echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_21 = <pre>'' . $texte_sql_21 . ''</pre>'' ; exit(0);
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_21)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_21()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,NULL),
('22','1','update','modifier(
   valeurs(affecte(champ(`chp_priorite_tache`) , :n_chp_priorite_tache)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_taches , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chi_id_tache`) , :c_chi_id_tache) , egal(champ(`chx_utilisateur_tache`) , :c_chx_utilisateur_tache))
   )
)','
UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache
WHERE (`chi_id_tache` = :c_chi_id_tache AND `chx_utilisateur_tache` = :c_chx_utilisateur_tache) ;','function sql_22($par){
    $texte_sql_22=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_taches` SET ''.CRLF;
    if($par[''n_chp_priorite_tache'']==='''' || $par[''n_chp_priorite_tache'']===NULL ){
        $texte_sql_22.=''    `chp_priorite_tache`  = NULL  ''.CRLF;
    }else{
        $texte_sql_22.=''    `chp_priorite_tache`  = ''.sq0($par[''n_chp_priorite_tache'']).'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chi_id_tache` = ''.sq1($par[''c_chi_id_tache'']).''''.CRLF;
    $where0.='' AND `chx_utilisateur_tache` = ''.sq1($par[''c_chx_utilisateur_tache'']).''''.CRLF;
    $texte_sql_22.=$where0;
    // echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_22 = <pre>'' . $texte_sql_22 . ''</pre>'' ; exit(0);
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_22)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_22()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,NULL),
('23','1','update','modifier(
   valeurs(affecte(champ(`chp_priorite_tache`) , :n_chp_priorite_tache)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_taches , base(b1)))
      )
   ),
   conditions(
      et(
         ou(est(champ(chp_priorite_tache) , NULL) , egal(champ(chp_priorite_tache) , '''')),
         egal(champ(chx_utilisateur_tache) , :c_chx_utilisateur_tache)
      )
   )
)','
UPDATE b1.tbl_taches SET `chp_priorite_tache` = :n_chp_priorite_tache
WHERE ((chp_priorite_tache IS NULL OR chp_priorite_tache = '''') AND chx_utilisateur_tache = :c_chx_utilisateur_tache) ;','function sql_23($par){
    $texte_sql_23=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_taches` SET ''.CRLF;
    if($par[''n_chp_priorite_tache'']==='''' || $par[''n_chp_priorite_tache'']===NULL ){
        $texte_sql_23.=''    `chp_priorite_tache`  = NULL  ''.CRLF;
    }else{
        $texte_sql_23.=''    `chp_priorite_tache`  = ''.sq0($par[''n_chp_priorite_tache'']).'' ''.CRLF;
    }
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND (chp_priorite_tache IS NULL OR chp_priorite_tache = \''\'')''.CRLF;
    $where0.='' AND chx_utilisateur_tache = ''.sq1($par[''c_chx_utilisateur_tache'']).''''.CRLF;
    $texte_sql_23.=$where0;
    // echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_23 = <pre>'' . $texte_sql_23 . ''</pre>'' ; exit(0);
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_23)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_23()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,NULL),
('24','1','update','modifier(
   valeurs(
      affecte(champ(`chp_priorite_tache`) , plus(champ(`chp_priorite_tache`) , 1))
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_taches , base(b1)))
      )
   ),
   conditions(
      et(egal(champ(`chx_utilisateur_tache`) , :c_chx_utilisateur_tache) , inf(champ(`chp_priorite_tache`) , 50))
   )
)','
UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`+1)
WHERE (`chx_utilisateur_tache` = :c_chx_utilisateur_tache AND `chp_priorite_tache` < 50) ;','function sql_24($par){
    $texte_sql_24=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_taches` SET ''.CRLF;
    $texte_sql_24.='' `chp_priorite_tache` = (`chp_priorite_tache`+1) ''.CRLF;
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chx_utilisateur_tache` = ''.sq1($par[''c_chx_utilisateur_tache'']).''''.CRLF;
    $where0.='' AND `chp_priorite_tache` < 50''.CRLF;
    $texte_sql_24.=$where0;
    // echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_24 = <pre>'' . $texte_sql_24 . ''</pre>'' ; exit(0);
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_24)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_24()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,NULL),
('25','1','update','modifier(
   valeurs(
      affecte(champ(`chp_priorite_tache`) , moins(champ(`chp_priorite_tache`) , 1))
   ),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_taches , base(b1)))
      )
   ),
   conditions(
      et(
         #(),
         egal(champ(`chx_utilisateur_tache`) , :c_chx_utilisateur_tache),
         inf(champ(`chp_priorite_tache`) , 50),
         sup(champ(`chp_priorite_tache`) , 0)
      )
   )
)','
UPDATE b1.tbl_taches SET `chp_priorite_tache` = (`chp_priorite_tache`-1)
WHERE (/*  */ `chx_utilisateur_tache` = :c_chx_utilisateur_tache AND `chp_priorite_tache` < 50 AND `chp_priorite_tache` > 0) ;','function sql_25($par){
    $texte_sql_25=''UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_taches` SET ''.CRLF;
    $texte_sql_25.='' `chp_priorite_tache` = (`chp_priorite_tache`-1) ''.CRLF;
    $where0='' WHERE 1=1 ''.CRLF;
    $where0.='' AND `chx_utilisateur_tache` = ''.sq1($par[''c_chx_utilisateur_tache'']).''''.CRLF;
    $where0.='' AND `chp_priorite_tache` < 50''.CRLF;
    $where0.='' AND `chp_priorite_tache` > 0''.CRLF;
    $texte_sql_25.=$where0;
    // echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_25 = <pre>'' . $texte_sql_25 . ''</pre>'' ; exit(0);
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_25)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_25()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL,NULL);
