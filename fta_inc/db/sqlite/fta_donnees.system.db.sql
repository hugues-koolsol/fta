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
('1','1','test.html','','1','
   html((''lang'',"fr"),
      head(
         title(''Hello''
         ),
         #( test )
      ),
      body((''style'',"color:red;"),''test''
      )
   )','<html lang="fr">
    <head>
        <title>Hello</title>
        <!--  test  -->
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
      (transform_table_sur_svg , transform(translate(-56 , -131)))
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
      field(nom_du_champ(chp_nom_basedd) , type(TEXT) , valeur_par_defaut('''') , meta((champ , ''chp_nom_basedd'') , (nom_long_du_champ , ''à faire chp_nom_basedd'') , (nom_court_du_champ , ''à faire chp_nom_basedd'') , (nom_bref_du_champ , ''à faire chp_nom_basedd'') , (typologie , ''cht''))),
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
      (transform_table_sur_svg , transform(translate(117 , 76)))
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
)','bla','
/*
  =====================================================================================================================
  table tbl_cibles
  =====================================================================================================================
*/



CREATE TABLE  tbl_cibles(
/* meta((table,''tbl_cibles''),(nom_long_de_la_table,''liste des systèmes cibles''),(nom_court_de_la_table,''une cible''),(nom_bref_de_la_table,''cible''),(transform_table_sur_svg,transform(translate(-56,-131)))) */
    
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
             chp_nom_basedd TEXT DEFAULT  '''' ,
    
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
/* meta((table,''tbl_requetes''),(nom_long_de_la_table,''liste des requêtes''),(nom_court_de_la_table,''une requête''),(nom_bref_de_la_table,''requêtes''),(transform_table_sur_svg,transform(translate(117,76)))) */
    
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
    );','meta((transform_base_sur_svg,transform(translate(84.5,149.5)))
),
#(
  ================
  liste des tables
  ================
),
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_cibles''),
meta((table,tbl_cibles),(nom_long_de_la_table,''liste des systèmes cibles''),(nom_court_de_la_table,''une cible''),(nom_bref_de_la_table,''cible''),(transform_table_sur_svg,transform(translate(-56,-131)))
),
 fields(
  field(nom_du_champ(''chi_id_cible''),type(''INTEGER''),primary_key(),meta((champ,''chi_id_cible''),(nom_long_du_champ,''identifiant unique de la cible''),(nom_court_du_champ,''identifiant cible''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_cible''),type(''TEXT''),meta((champ,''chp_nom_cible''),(nom_long_du_champ,''nom de la cible''),(nom_court_du_champ,''nom cible''),(nom_bref_du_champ,''nom''),(typologie,''cht'')))
  field(nom_du_champ(chp_dossier_cible),type(CHARACTER,3),meta((champ,''chp_dossier_cible''),(nom_long_du_champ,''à faire chp_dossier_cible''),(nom_court_du_champ,''à faire chp_dossier_cible''),(nom_bref_du_champ,''à faire chp_dossier_cible''),(typologie,''cho'')))
  field(nom_du_champ(''chp_commentaire_cible''),type(''TEXT''),meta((champ,''chp_commentaire_cible''),(nom_long_du_champ,''à faire chp_commentaire_cible''),(nom_court_du_champ,''à faire chp_commentaire_cible''),(nom_bref_du_champ,''à faire chp_commentaire_cible''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_cibles''),unique(),index_name(''idx_dossier_cible''),fields(''chp_dossier_cible''),meta((index,''idx_dossier_cible''),(message,''à faire idx_dossier_cible'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_dossiers''),
meta((table,tbl_dossiers),(nom_long_de_la_table,''liste des dossiers sur disque''),(nom_court_de_la_table,''un dossier''),(nom_bref_de_la_table,''dossiers''),(transform_table_sur_svg,transform(translate(309,-24)))
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
meta((table,tbl_sources),(nom_long_de_la_table,''liste des programmes sources''),(nom_court_de_la_table,''le source''),(nom_bref_de_la_table,''sources''),(transform_table_sur_svg,transform(translate(454,-74)))
),
 fields(
  field(nom_du_champ(chi_id_source),type(INTEGER),primary_key(),meta((champ,''chi_id_source''),(nom_long_du_champ,''à faire chi_id_source''),(nom_court_du_champ,''à faire chi_id_source''),(nom_bref_du_champ,''à faire chi_id_source''),(typologie,''chi'')))
  field(nom_du_champ(''chx_cible_id_source''),type(''INTEGER''),references(tbl_cibles,chi_id_cible),non_nulle(),meta((champ,''chx_cible_id_source''),(nom_long_du_champ,''à faire chx_cible_id_source''),(nom_court_du_champ,''à faire chx_cible_id_source''),(nom_bref_du_champ,''à faire chx_cible_id_source''),(typologie,''chx'')))
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
meta((table,tbl_utilisateurs),(nom_long_de_la_table,''liste des utilisateurs''),(nom_court_de_la_table,''un utilisateur''),(nom_bref_de_la_table,''utilisateurs''),(transform_table_sur_svg,transform(translate(-70,248)))
),
 fields(
  field(nom_du_champ(chi_id_utilisateur),type(INTEGER),primary_key(),meta((champ,''chi_id_utilisateur''),(nom_long_du_champ,''à faire chi_id_utilisateur''),(nom_court_du_champ,''à faire chi_id_utilisateur''),(nom_bref_du_champ,''à faire chi_id_utilisateur''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_de_connexion_utilisateur''),type(''TEXT''),meta((champ,''chp_nom_de_connexion_utilisateur''),(nom_long_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_court_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(nom_bref_du_champ,''à faire chp_nom_de_connexion_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(''chp_mot_de_passe_utilisateur''),type(''TEXT''),meta((champ,''chp_mot_de_passe_utilisateur''),(nom_long_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_court_du_champ,''à faire chp_mot_de_passe_utilisateur''),(nom_bref_du_champ,''à faire chp_mot_de_passe_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_parametres_utilisateur),type(TEXT),meta((champ,''chp_parametres_utilisateur''),(nom_long_du_champ,''à faire chp_parametres_utilisateur''),(nom_court_du_champ,''à faire chp_parametres_utilisateur''),(nom_bref_du_champ,''à faire chp_parametres_utilisateur''),(typologie,''cht'')))
  field(nom_du_champ(chp_commentaire_utilisateur),type(TEXT),meta((champ,''chp_commentaire_utilisateur''),(nom_long_du_champ,''à faire chp_commentaire_utilisateur''),(nom_court_du_champ,''à faire chp_commentaire_utilisateur''),(nom_bref_du_champ,''à faire chp_commentaire_utilisateur''),(typologie,''cht'')))
 ),
)
add_index(nom_de_la_table_pour_l_index(''tbl_utilisateurs''),unique(),index_name(''idxNomUtilisateur''),fields(''chp_nom_de_connexion_utilisateur''),meta((index,''idxNomUtilisateur''),(message,''à faire idxNomUtilisateur'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_taches''),
meta((table,tbl_taches),(nom_long_de_la_table,''liste des tâches à réaliser''),(nom_court_de_la_table,''une tâche''),(nom_bref_de_la_table,''taches''),(transform_table_sur_svg,transform(translate(201,286)))
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
meta((table,''tbl_revs''),(nom_long_de_la_table,''à faire tbl_revs''),(nom_court_de_la_table,''à faire tbl_revs''),(nom_bref_de_la_table,''à faire tbl_revs''),(transform_table_sur_svg,transform(translate(643,-132)))
),
 fields(
  field(nom_du_champ(chi_id_rev),type(INTEGER),primary_key(),meta((champ,''chi_id_rev''),(nom_long_du_champ,''à faire chi_id_rev''),(nom_court_du_champ,''à faire chi_id_rev''),(nom_bref_du_champ,''à faire chi_id_rev''),(typologie,''chi'')))
  field(nom_du_champ(''chx_cible_rev''),type(''INTEGER''),references(tbl_cibles,chi_id_cible),non_nulle(),meta((champ,''chx_cible_rev''),(nom_long_du_champ,''à faire chx_cible_rev''),(nom_court_du_champ,''à faire chx_cible_rev''),(nom_bref_du_champ,''à faire chx_cible_rev''),(typologie,''chx'')))
  field(nom_du_champ(chp_provenance_rev),type(CHARACTER,32),meta((champ,''chp_provenance_rev''),(nom_long_du_champ,''à faire chp_provenance_rev''),(nom_court_du_champ,''à faire chp_provenance_rev''),(nom_bref_du_champ,''à faire chp_provenance_rev''),(typologie,''cho'')))
  field(nom_du_champ(''chx_source_rev''),type(''INTEGER''),meta((champ , ''chx_source_rev''),(nom_long_du_champ,''à faire chx_source_rev''),(nom_court_du_champ,''à faire chx_source_rev''),(nom_bref_du_champ,''à faire chx_source_rev''),(typologie,''chx'')))
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
meta((table,tbl_bdds),(nom_long_de_la_table,''liste des bases de données''),(nom_court_de_la_table,''une base''),(nom_bref_de_la_table,''bases''),(transform_table_sur_svg,transform(translate(448,140)))
),
 fields(
  field(nom_du_champ(chi_id_basedd),type(INTEGER),primary_key(),auto_increment(),meta((champ,''chi_id_basedd''),(nom_long_du_champ,''à faire chi_id_basedd''),(nom_court_du_champ,''à faire chi_id_basedd''),(nom_bref_du_champ,''à faire chi_id_basedd''),(typologie,''chi'')))
  field(nom_du_champ(chx_dossier_id_basedd),type(INTEGER),references(''tbl_dossiers'',''chi_id_dossier''),meta((champ,''chx_dossier_id_basedd''),(nom_long_du_champ,''à faire chx_dossier_id_basedd''),(nom_court_du_champ,''à faire chx_dossier_id_basedd''),(nom_bref_du_champ,''à faire chx_dossier_id_basedd''),(typologie,''chx'')))
  field(nom_du_champ(chx_cible_id_basedd),type(INTEGER),non_nulle(),references(''tbl_cibles'',''chi_id_cible''),meta((champ,''chx_cible_id_basedd''),(nom_long_du_champ,''à faire chx_cible_id_basedd''),(nom_court_du_champ,''à faire chx_cible_id_basedd''),(nom_bref_du_champ,''à faire chx_cible_id_basedd''),(typologie,''chx'')))
  field(nom_du_champ(chp_nom_basedd),type(TEXT),valeur_par_defaut(''''),meta((champ,''chp_nom_basedd''),(nom_long_du_champ,''à faire chp_nom_basedd''),(nom_court_du_champ,''à faire chp_nom_basedd''),(nom_bref_du_champ,''à faire chp_nom_basedd''),(typologie,''cht'')))
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
meta((table,tbl_tests),(nom_long_de_la_table,''liste d\''enregistrements \\ de test''),(nom_court_de_la_table,''un test''),(nom_bref_de_la_table,''test''),(transform_table_sur_svg,transform(translate(638,292)))
),
 fields(
  field(nom_du_champ(''chi_id_test''),type(''INTEGER''),primary_key(),meta((champ,''chi_id_test''),(nom_long_du_champ,''identifiant unique \'' du \\ test''),(nom_court_du_champ,''id du test''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(''chp_nom_test''),type(VARCHAR(64)),non_nulle(),valeur_par_defaut(''''),meta((''champ'',''chp_nom_test''),typologie(chp),non_nulle(),(''nom_long_du_champ'',''nom du test''),(''nom_court_du_champ'',''nom test''),(''nom_bref_du_champ'',''nom'')))
  field(nom_du_champ(''chx_test_parent_test''),type(''INTEGER''),references(tbl_tests,chi_id_test),non_nulle(),valeur_par_defaut(0),meta((champ,''chx_test_parent_test''),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chi'')))
  field(nom_du_champ(''chp_texte1_test''),type(''VARCHAR(32)''),valeur_par_defaut(''hello world''),meta((champ,''chp_texte1_test''),(a_une_valeur_par_defaut,1),(la_valeur_par_defaut_est_caractere,1),(valeur_par_defaut,''hello world''),(nom_long_du_champ,''test''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chp'')))
 ),
)
add_index(index_name(''idx_test_unique''),nom_de_la_table_pour_l_index(''tbl_tests''),fields(chp_nom_test,chx_test_parent_test),unique(),meta((index,''idx_test_unique''),(message,''ce test existe déjà'')))
#(=================================================================)
create_table(
 nom_de_la_table(''tbl_requetes''),
meta((table,tbl_requetes),(nom_long_de_la_table,''liste des requêtes''),(nom_court_de_la_table,''une requête''),(nom_bref_de_la_table,''requêtes''),(transform_table_sur_svg,transform(translate(117,76)))
),
 fields(
  field(nom_du_champ(''chi_id_requete''),type(''INTEGER''),primary_key(),meta((champ,''chi_id_requete''),(nom_long_du_champ,''identifiant unique de la requête''),(nom_court_du_champ,''id unique''),(nom_bref_du_champ,''id''),(typologie,''chi'')))
  field(nom_du_champ(''chx_cible_requete''),type(''INTEGER''),references(tbl_cibles,chi_id_cible),non_nulle(),valeur_par_defaut(1),meta((champ,''chx_cible_requete''),(a_une_valeur_par_defaut,1),(la_valeur_par_defaut_est_caractere,0),(valeur_par_defaut,1),(nom_long_du_champ,''à faire ...''),(nom_court_du_champ,''à faire ...''),(nom_bref_du_champ,''à faire ...''),(typologie,''chi'')))
  field(nom_du_champ(''chp_type_requete''),type(''VARCHAR(64)''),valeur_par_defaut(''selectionner''),meta((champ,''chp_type_requete''),(nom_long_du_champ,''type de la requête sql''),(nom_court_du_champ,''type requete''),(nom_bref_du_champ,''type''),(typologie,''chi'')))
  field(nom_du_champ(''cht_rev_requete''),type(TEXT),meta((''champ'',''cht_rev_requete''),typologie(cht),(''nom_long_du_champ'',''à faire ...''),(''nom_court_du_champ'',''à faire ...''),(''nom_bref_du_champ'',''à faire ...'')))
  field(nom_du_champ(''cht_sql_requete''),type(TEXT),meta((''champ'',''cht_sql_requete''),typologie(cht),(''nom_long_du_champ'',''requete au format sql''),(''nom_court_du_champ'',''format sql''),(''nom_bref_du_champ'',''sql'')))
  field(nom_du_champ(''cht_php_requete''),type(TEXT),meta((''champ'',''cht_php_requete''),typologie(cht),(''nom_long_du_champ'',''requete au format php''),(''nom_court_du_champ'',''format php''),(''nom_bref_du_champ'',''php'')))
  field(nom_du_champ(''cht_commentaire_requete''),type(TEXT),meta((''champ'',''cht_commentaire_requete''),typologie(cht),(''nom_long_du_champ'',''à faire ...''),(''nom_court_du_champ'',''à faire ...''),(''nom_bref_du_champ'',''à faire ...'')))
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
      (nom_long_de_la_table , ''à faire tbl_a''),
      (nom_court_de_la_table , ''à faire tbl_a''),
      (nom_bref_de_la_table , ''à faire tbl_a''),
      (transform_table_sur_svg , transform(translate(-52 , -188)))
   ),
   nom_de_la_table(''tbl_a''),
   fields(
      #(),
      field(nom_du_champ(chi_id_a) , type(INTEGER , 20) , primary_key() , meta((champ , ''chi_id_a'') , (nom_long_du_champ , ''à faire chi_id_a'') , (nom_court_du_champ , ''à faire chi_id_a'') , (nom_bref_du_champ , ''à faire chi_id_a'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_a) , type(STRING) , meta((champ , ''chp_nom_a'') , (nom_long_du_champ , ''à faire chp_nom_a'') , (nom_court_du_champ , ''à faire chp_nom_a'') , (nom_bref_du_champ , ''à faire chp_nom_a'') , (typologie , ''cht''))),
      field(nom_du_champ(chx_a_a) , type(INTEGER) , non_nulle() , references(''tbl_a'' , ''chi_id_a'') , meta((champ , ''chx_a_a'') , (nom_long_du_champ , ''à faire chx_a_a'') , (nom_court_du_champ , ''à faire chx_a_a'') , (nom_bref_du_champ , ''à faire chx_a_a'') , (typologie , ''chx''))),
      field(nom_du_champ(chx_a2_a) , type(INTEGER) , non_nulle() , references(''tbl_a'' , ''chx_a_a'') , meta((champ , ''chx_a2_a'') , (nom_long_du_champ , ''à faire chx_a2_a'') , (nom_court_du_champ , ''à faire chx_a2_a'') , (nom_bref_du_champ , ''à faire chx_a2_a'') , (typologie , ''chx'')))
   )
),
#(==============================),
add_index(nom_de_la_table_pour_l_index(''tbl_a'') , unique() , index_name(''idx_nom_a'') , fields(''chp_nom_a'' , ''chx_a_a'') , meta((index , ''idx_nom_a'') , (message , ''à faire idx_nom_a''))),
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
      field(nom_du_champ(chi_id_b) , type(INTEGER) , primary_key() , meta((champ , ''chi_id_b'') , (nom_long_du_champ , ''à faire chi_id_b'') , (nom_court_du_champ , ''à faire chi_id_b'') , (nom_bref_du_champ , ''à faire chi_id_b'') , (typologie , ''chi''))),
      field(nom_du_champ(chp_nom_b) , type(STRING) , valeur_par_defaut(''toto'') , meta((champ , ''chp_nom_b'') , (nom_long_du_champ , ''à faire chp_nom_b'') , (nom_court_du_champ , ''à faire chp_nom_b'') , (nom_bref_du_champ , ''à faire chp_nom_b'') , (typologie , ''cht''))),
      field(nom_du_champ(chx_a_b) , type(INTEGER) , non_nulle() , references(''tbl_a'' , ''chi_id_a'') , meta((champ , ''chx_a_b'') , (nom_long_du_champ , ''à faire chx_a_b'') , (nom_court_du_champ , ''à faire chx_a_b'') , (nom_bref_du_champ , ''à faire chx_a_b'') , (typologie , ''chx''))),
      field(nom_du_champ(cht_t_b) , type(CHARACTER) , meta((champ , ''cht_t_b'') , (nom_long_du_champ , ''à faire cht_t_b'') , (nom_court_du_champ , ''à faire cht_t_b'') , (nom_bref_du_champ , ''à faire cht_t_b'') , (typologie , ''cho'')))
   )
)','test de base virtuelle','
/*
  =====================================================================================================================
  table tbl_a
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_a''),(nom_long_de_la_table,''à faire tbl_a''),(nom_court_de_la_table,''à faire tbl_a''),(nom_bref_de_la_table,''à faire tbl_a''),(transform_table_sur_svg,transform(translate(-52,-188)))) */
     tbl_a( 

    
            /* meta((champ,''chi_id_a''),(nom_long_du_champ,''à faire chi_id_a''),(nom_court_du_champ,''à faire chi_id_a''),(nom_bref_du_champ,''à faire chi_id_a''),(typologie,''chi'')) */
             chi_id_a INTEGER(20) PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_a''),(nom_long_du_champ,''à faire chp_nom_a''),(nom_court_du_champ,''à faire chp_nom_a''),(nom_bref_du_champ,''à faire chp_nom_a''),(typologie,''cht'')) */
             chp_nom_a STRING,
    
            /* meta((champ,''chx_a_a''),(nom_long_du_champ,''à faire chx_a_a''),(nom_court_du_champ,''à faire chx_a_a''),(nom_bref_du_champ,''à faire chx_a_a''),(typologie,''chx'')) */
             chx_a_a INTEGER NOT NULL REFERENCES ''tbl_a''(''chi_id_a'') ,
    
            /* meta((champ,''chx_a2_a''),(nom_long_du_champ,''à faire chx_a2_a''),(nom_court_du_champ,''à faire chx_a2_a''),(nom_bref_du_champ,''à faire chx_a2_a''),(typologie,''chx'')) */
             chx_a2_a INTEGER NOT NULL REFERENCES ''tbl_a''(''chx_a_a'') 
    );
/*==============================*/

CREATE  UNIQUE INDEX  idx_nom_a ON `tbl_a` 
        /* meta((index,''idx_nom_a''),(message,''à faire idx_nom_a'')) */
         ( `chp_nom_a` , `chx_a_a` ) ;
/*
  =====================================================================================================================
  table tbl_b
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,''tbl_b''),(nom_long_de_la_table,''à faire tbl_b''),(nom_court_de_la_table,''à faire tbl_b''),(nom_bref_de_la_table,''à faire tbl_b''),(transform_table_sur_svg,transform(translate(0,0)))) */
     tbl_b( 

    
            /* meta((champ,''chi_id_b''),(nom_long_du_champ,''à faire chi_id_b''),(nom_court_du_champ,''à faire chi_id_b''),(nom_bref_du_champ,''à faire chi_id_b''),(typologie,''chi'')) */
             chi_id_b INTEGER PRIMARY KEY ,
    
            /* meta((champ,''chp_nom_b''),(nom_long_du_champ,''à faire chp_nom_b''),(nom_court_du_champ,''à faire chp_nom_b''),(nom_bref_du_champ,''à faire chp_nom_b''),(typologie,''cht'')) */
             chp_nom_b STRING DEFAULT  ''toto'' ,
    
            /* meta((champ,''chx_a_b''),(nom_long_du_champ,''à faire chx_a_b''),(nom_court_du_champ,''à faire chx_a_b''),(nom_bref_du_champ,''à faire chx_a_b''),(typologie,''chx'')) */
             chx_a_b INTEGER NOT NULL REFERENCES ''tbl_a''(''chi_id_a'') ,
    
            /* meta((champ,''cht_t_b''),(nom_long_du_champ,''à faire cht_t_b''),(nom_court_du_champ,''à faire cht_t_b''),(nom_bref_du_champ,''à faire cht_t_b''),(typologie,''cho'')) */
             cht_t_b CHARACTER
    );','
meta((default_charset,''utf8mb4''),(collate,''utf8mb4_unicode_ci''),(transform_base_sur_svg,transform(translate(72.5,197.5)))
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
add_index(index_name(''idx_nom_a''),nom_de_la_table_pour_l_index(''tbl_a''),fields(chp_nom_a,chx_a_a),unique(),meta((index , ''idx_nom_a'')))
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
)','');
/*



  =========================================================================
  Pour la table tbl_tests il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_tests`( `chi_id_test`, `chp_nom_test`, `chx_test_parent_test`, `chp_texte1_test`) VALUES
('1','','0','hello '' \ world');
/*



  =========================================================================
  Pour la table tbl_requetes il y a 5 enregistrement(s) à insérer 
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
WHERE `T0`.`chp_nom_de_connexion_utilisateur` = :nom_de_connexion
LIMIT 1 OFFSET 0 ;','function sql_1($par){
    $texte_sql_1=''
      SELECT 
      `T0`.`chi_id_utilisateur` , `T0`.`chp_mot_de_passe_utilisateur` , `T0`.`chp_parametres_utilisateur`
       FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_utilisateurs T0
      WHERE `T0`.`chp_nom_de_connexion_utilisateur` = ''.sq1($par[''nom_de_connexion'']).''
      LIMIT 1 OFFSET 0 ;
    '';
    $stmt=$GLOBALS[BDD][BDD_1][LIEN_BDD]->prepare($texte_sql_1);
    /* echo __FILE__ . '' '' . __LINE__ . '' $texte_sql_1 = <pre>'' . $texte_sql_1 . ''</pre>'' ; exit(0); */
    if($stmt !== false){
        $result=$stmt->execute();
        $donnees=array();
        $arr=$result->fetchArray(SQLITE3_ASSOC);
        while(($arr !== false)){
            $donnees[]=$arr;
            $arr=$result->fetchArray(SQLITE3_ASSOC);
        }
        $stmt->close();
        return(array( ''statut'' => true, ''valeur'' => $donnees));
    }else{
        return(array( ''statut'' => false, ''message'' => ''erreur sql_1()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }
}
',NULL),
('2','1','update','modifier(
   valeurs(affecte(champ(`chp_nom_de_connexion_utilisateur`) , :chp_nom_de_connexion_utilisateur) , affecte(champ(`chp_mot_de_passe_utilisateur`) , :chp_mot_de_passe_utilisateur) , affecte(champ(`chp_parametres_utilisateur`) , :chp_parametres_utilisateur) , affecte(champ(`chp_commentaire_utilisateur`) , :chp_commentaire_utilisateur)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_utilisateurs , base(b1)))
      )
   ),
   conditions(egal(champ(`chi_id_utilisateur`) , :chi_id_utilisateur))
)','
UPDATE b1.tbl_utilisateurs SET `chp_nom_de_connexion_utilisateur` = :chp_nom_de_connexion_utilisateur , `chp_mot_de_passe_utilisateur` = :chp_mot_de_passe_utilisateur , `chp_parametres_utilisateur` = :chp_parametres_utilisateur , `chp_commentaire_utilisateur` = :chp_commentaire_utilisateur
WHERE `chi_id_utilisateur` = :chi_id_utilisateur ;','function sql_2($par){
    $texte_sql_2=''
      
      UPDATE `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_utilisateurs SET 
            `chp_nom_de_connexion_utilisateur` = ''.sq1($par[''chp_nom_de_connexion_utilisateur'']).'' , 
            `chp_mot_de_passe_utilisateur` = ''.sq1($par[''chp_mot_de_passe_utilisateur'']).'' , 
            `chp_parametres_utilisateur` = ''.sq1($par[''chp_parametres_utilisateur'']).'' , 
            `chp_commentaire_utilisateur` = ''.sq1($par[''chp_commentaire_utilisateur'']).''
          WHERE `chi_id_utilisateur` = ''.sq1($par[''chi_id_utilisateur'']).'' ;
    '';
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_2)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode() ,''message'' => ''erreur sql_2()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('3','1','insert','insérer(
   valeurs(affecte(champ(`chp_nom_de_connexion_utilisateur`) , :chp_nom_de_connexion_utilisateur) , affecte(champ(`chp_mot_de_passe_utilisateur`) , :chp_mot_de_passe_utilisateur)),
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_utilisateurs , base(b1)))
      )
   )
)','
INSERT INTO b1.`tbl_utilisateurs`(
    `chp_nom_de_connexion_utilisateur` , 
    `chp_mot_de_passe_utilisateur`
) VALUES (
    :chp_nom_de_connexion_utilisateur , 
    :chp_mot_de_passe_utilisateur
);','function sql_3($par){
    $texte_sql_3=''
      INSERT INTO `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.`tbl_utilisateurs`(
         `chp_nom_de_connexion_utilisateur` , 
         `chp_mot_de_passe_utilisateur`
      ) VALUES 
    '';
    $liste_des_valeurs='''';
    for($i=0;($i < count($par[''groupes'']));$i++){
        if($liste_des_valeurs != ''''){
            $liste_des_valeurs.='','';
        }
        $liste_des_valeurs.=''('';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[''groupes''][$i][''chp_nom_de_connexion_utilisateur'']).'','';
        $liste_des_valeurs.=CRLF.''      ''.sq1($par[''groupes''][$i][''chp_mot_de_passe_utilisateur'']).'''';
        $liste_des_valeurs.='')'';
    }
    $texte_sql_3.=$liste_des_valeurs;
    if(false === $GLOBALS[BDD][BDD_1][LIEN_BDD]->exec($texte_sql_3)){
        return(array( ''statut'' => false, ''code_erreur'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorCode(), ''message'' => ''erreur sql_3()''.'' ''.$GLOBALS[BDD][BDD_1][LIEN_BDD]->lastErrorMsg()));
    }else{
        return(array( ''statut'' => true, ''changements'' => $GLOBALS[BDD][BDD_1][LIEN_BDD]->changes()));
    }
}
',NULL),
('4','1','delete','supprimer(
   provenance(
      table_reference(
         source(nom_de_la_table(tbl_utilisateurs , base(b1)))
      )
   ),
   conditions(egal(champ(`chi_id_utilisateur`) , :chi_id_utilisateur))
)','
DELETE FROM b1.tbl_utilisateurs
WHERE `chi_id_utilisateur` = :chi_id_utilisateur ;','function sql_4($par){
    $texte_sql_4=''
      
      DELETE FROM `''.$GLOBALS[BDD][BDD_1][''nom_bdd''].''`.tbl_utilisateurs
          WHERE `chi_id_utilisateur` = ''.sq1($par[''chi_id_utilisateur'']).'' ;
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
',NULL);
