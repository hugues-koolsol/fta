
/*
  =====================================================================================================================
  table tbl_cibles
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_cibles'),(nom_long_de_la_table,'à faire tbl_cibles'),(nom_court_de_la_table,'à faire tbl_cibles'),(nom_bref_de_la_table,'à faire tbl_cibles'),(transform_table_sur_svg,transform(translate(7,-133)))) */
     tbl_cibles( 

    
            /* meta((champ,'chi_id_cible'),(nom_long_du_champ,'à faire chi_id_cible'),(nom_court_du_champ,'à faire chi_id_cible'),(nom_bref_du_champ,'à faire chi_id_cible'),(typologie,'chi')) */
             chi_id_cible INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chp_nom_cible'),(nom_long_du_champ,'à faire chp_nom_cible'),(nom_court_du_champ,'à faire chp_nom_cible'),(nom_bref_du_champ,'à faire chp_nom_cible'),(typologie,'cht')) */
             chp_nom_cible STRING,
    
            /* meta((champ,'chp_dossier_cible'),(nom_long_du_champ,'à faire chp_dossier_cible'),(nom_court_du_champ,'à faire chp_dossier_cible'),(nom_bref_du_champ,'à faire chp_dossier_cible'),(typologie,'cho')) */
             chp_dossier_cible CHARACTER(3),
    
            /* meta((champ,'chp_commentaire_cible'),(nom_long_du_champ,'à faire chp_commentaire_cible'),(nom_court_du_champ,'à faire chp_commentaire_cible'),(nom_bref_du_champ,'à faire chp_commentaire_cible'),(typologie,'cht')) */
             chp_commentaire_cible STRING
    );
/*==============================*/

CREATE  UNIQUE INDEX  idx_dossier_cible ON `tbl_cibles` 
        /* meta((index,'idx_dossier_cible'),(message,'à faire idx_dossier_cible')) */
         ( `chp_dossier_cible` ) ;
/*
  =====================================================================================================================
  table tbl_dossiers
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_dossiers'),(nom_long_de_la_table,'à faire tbl_dossiers'),(nom_court_de_la_table,'à faire tbl_dossiers'),(nom_bref_de_la_table,'à faire tbl_dossiers'),(transform_table_sur_svg,transform(translate(307,-27)))) */
     tbl_dossiers( 

    
            /* meta((champ,'chi_id_dossier'),(nom_long_du_champ,'à faire chi_id_dossier'),(nom_court_du_champ,'à faire chi_id_dossier'),(nom_bref_du_champ,'à faire chi_id_dossier'),(typologie,'chi')) */
             chi_id_dossier INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chx_cible_dossier'),(nom_long_du_champ,'à faire chx_cible_dossier'),(nom_court_du_champ,'à faire chx_cible_dossier'),(nom_bref_du_champ,'à faire chx_cible_dossier'),(typologie,'chx')) */
             chx_cible_dossier INTEGER NOT NULL REFERENCES 'tbl_cibles'('chi_id_cible') ,
    
            /* meta((champ,'chp_nom_dossier'),(nom_long_du_champ,'à faire chp_nom_dossier'),(nom_court_du_champ,'à faire chp_nom_dossier'),(nom_bref_du_champ,'à faire chp_nom_dossier'),(typologie,'cho')) */
             chp_nom_dossier CHARACTER(256)
    );
/*==============================*/

CREATE  UNIQUE INDEX  idx_cible_et_nom ON `tbl_dossiers` 
        /* meta((index,'idx_cible_et_nom'),(message,'à faire idx_cible_et_nom')) */
         ( `chx_cible_dossier` , `chp_nom_dossier` ) ;
/*
  =====================================================================================================================
  table tbl_sources
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_sources'),(nom_long_de_la_table,'à faire tbl_sources'),(nom_court_de_la_table,'à faire tbl_sources'),(nom_bref_de_la_table,'à faire tbl_sources'),(transform_table_sur_svg,transform(translate(475,-70)))) */
     tbl_sources( 

    
            /* meta((champ,'chi_id_source'),(nom_long_du_champ,'à faire chi_id_source'),(nom_court_du_champ,'à faire chi_id_source'),(nom_bref_du_champ,'à faire chi_id_source'),(typologie,'chi')) */
             chi_id_source INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chx_cible_id_source'),(nom_long_du_champ,'à faire chx_cible_id_source'),(nom_court_du_champ,'à faire chx_cible_id_source'),(nom_bref_du_champ,'à faire chx_cible_id_source'),(typologie,'chx')) */
             chx_cible_id_source INTEGER NOT NULL REFERENCES 'tbl_cibles'('chi_id_cible') ,
    
            /* meta((champ,'chp_nom_source'),(nom_long_du_champ,'à faire chp_nom_source'),(nom_court_du_champ,'à faire chp_nom_source'),(nom_bref_du_champ,'à faire chp_nom_source'),(typologie,'cho')) */
             chp_nom_source CHARACTER(256) NOT NULL DEFAULT  '' ,
    
            /* meta((champ,'chp_commentaire_source'),(nom_long_du_champ,'à faire chp_commentaire_source'),(nom_court_du_champ,'à faire chp_commentaire_source'),(nom_bref_du_champ,'à faire chp_commentaire_source'),(typologie,'cht')) */
             chp_commentaire_source TEXT,
    
            /* meta((champ,'chx_dossier_id_source'),(nom_long_du_champ,'à faire chx_dossier_id_source'),(nom_court_du_champ,'à faire chx_dossier_id_source'),(nom_bref_du_champ,'à faire chx_dossier_id_source'),(typologie,'chx')) */
             chx_dossier_id_source INTEGER REFERENCES 'tbl_dossiers'('chi_id_dossier') ,
    
            /* meta((champ,'chp_rev_source'),(nom_long_du_champ,'à faire chp_rev_source'),(nom_court_du_champ,'à faire chp_rev_source'),(nom_bref_du_champ,'à faire chp_rev_source'),(typologie,'cht')) */
             chp_rev_source TEXT,
    
            /* meta((champ,'chp_genere_source'),(nom_long_du_champ,'à faire chp_genere_source'),(nom_court_du_champ,'à faire chp_genere_source'),(nom_bref_du_champ,'à faire chp_genere_source'),(typologie,'cht')) */
             chp_genere_source TEXT,
    
            /* meta((champ,'chp_type_source'),(nom_long_du_champ,'à faire chp_type_source'),(nom_court_du_champ,'à faire chp_type_source'),(nom_bref_du_champ,'à faire chp_type_source'),(typologie,'cht')) */
             chp_type_source TEXT NOT NULL DEFAULT  'normal' 
    );
/*==============================*/

CREATE  UNIQUE INDEX  idx_nom_et_dossier ON `tbl_sources` 
        /* meta((index,'idx_nom_et_dossier'),(message,'à faire idx_nom_et_dossier')) */
         ( `chx_dossier_id_source` , `chp_nom_source` ) ;
/*
  =====================================================================================================================
  table tbl_utilisateurs
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_utilisateurs'),(nom_long_de_la_table,'à faire tbl_utilisateurs'),(nom_court_de_la_table,'à faire tbl_utilisateurs'),(nom_bref_de_la_table,'à faire tbl_utilisateurs'),(transform_table_sur_svg,transform(translate(-63,39)))) */
     tbl_utilisateurs( 

    
            /* meta((champ,'chi_id_utilisateur'),(nom_long_du_champ,'à faire chi_id_utilisateur'),(nom_court_du_champ,'à faire chi_id_utilisateur'),(nom_bref_du_champ,'à faire chi_id_utilisateur'),(typologie,'chi')) */
             chi_id_utilisateur INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chp_nom_de_connexion_utilisateur'),(nom_long_du_champ,'à faire chp_nom_de_connexion_utilisateur'),(nom_court_du_champ,'à faire chp_nom_de_connexion_utilisateur'),(nom_bref_du_champ,'à faire chp_nom_de_connexion_utilisateur'),(typologie,'cht')) */
             chp_nom_de_connexion_utilisateur STRING,
    
            /* meta((champ,'chp_mot_de_passe_utilisateur'),(nom_long_du_champ,'à faire chp_mot_de_passe_utilisateur'),(nom_court_du_champ,'à faire chp_mot_de_passe_utilisateur'),(nom_bref_du_champ,'à faire chp_mot_de_passe_utilisateur'),(typologie,'cht')) */
             chp_mot_de_passe_utilisateur STRING,
    
            /* meta((champ,'chp_parametres_utilisateur'),(nom_long_du_champ,'à faire chp_parametres_utilisateur'),(nom_court_du_champ,'à faire chp_parametres_utilisateur'),(nom_bref_du_champ,'à faire chp_parametres_utilisateur'),(typologie,'cht')) */
             chp_parametres_utilisateur TEXT,
    
            /* meta((champ,'chp_commentaire_utilisateur'),(nom_long_du_champ,'à faire chp_commentaire_utilisateur'),(nom_court_du_champ,'à faire chp_commentaire_utilisateur'),(nom_bref_du_champ,'à faire chp_commentaire_utilisateur'),(typologie,'cht')) */
             chp_commentaire_utilisateur TEXT
    );
/*==============================*/

CREATE  UNIQUE INDEX  idxNomUtilisateur ON `tbl_utilisateurs` 
        /* meta((index,'idxNomUtilisateur'),(message,'à faire idxNomUtilisateur')) */
         ( `chp_nom_de_connexion_utilisateur` ) ;
/*
  =====================================================================================================================
  table tbl_taches
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_taches'),(nom_long_de_la_table,'à faire tbl_taches'),(nom_court_de_la_table,'à faire tbl_taches'),(nom_bref_de_la_table,'à faire tbl_taches'),(transform_table_sur_svg,transform(translate(187,119)))) */
     tbl_taches( 

    
            /* meta((champ,'chi_id_tache'),(nom_long_du_champ,'à faire chi_id_tache'),(nom_court_du_champ,'à faire chi_id_tache'),(nom_bref_du_champ,'à faire chi_id_tache'),(typologie,'chi')) */
             chi_id_tache INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chx_utilisateur_tache'),(nom_long_du_champ,'à faire chx_utilisateur_tache'),(nom_court_du_champ,'à faire chx_utilisateur_tache'),(nom_bref_du_champ,'à faire chx_utilisateur_tache'),(typologie,'chx')) */
             chx_utilisateur_tache INTEGER NOT NULL REFERENCES 'tbl_utilisateurs'('chi_id_utilisateur') ,
    
            /* meta((champ,'chp_texte_tache'),(nom_long_du_champ,'à faire chp_texte_tache'),(nom_court_du_champ,'à faire chp_texte_tache'),(nom_bref_du_champ,'à faire chp_texte_tache'),(typologie,'cht')) */
             chp_texte_tache TEXT,
    
            /* meta((champ,'chp_priorite_tache'),(nom_long_du_champ,'à faire chp_priorite_tache'),(nom_court_du_champ,'à faire chp_priorite_tache'),(nom_bref_du_champ,'à faire chp_priorite_tache'),(typologie,'che')) */
             chp_priorite_tache INTEGER
    );
/*
  =====================================================================================================================
  table tbl_revs
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_revs'),(nom_long_de_la_table,'à faire tbl_revs'),(nom_court_de_la_table,'à faire tbl_revs'),(nom_bref_de_la_table,'à faire tbl_revs'),(transform_table_sur_svg,transform(translate(693,-127)))) */
     tbl_revs( 

    
            /* meta((champ,'chi_id_rev'),(nom_long_du_champ,'à faire chi_id_rev'),(nom_court_du_champ,'à faire chi_id_rev'),(nom_bref_du_champ,'à faire chi_id_rev'),(typologie,'chi')) */
             chi_id_rev INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chx_cible_rev'),(nom_long_du_champ,'à faire chx_cible_rev'),(nom_court_du_champ,'à faire chx_cible_rev'),(nom_bref_du_champ,'à faire chx_cible_rev'),(typologie,'chx')) */
             chx_cible_rev INTEGER NOT NULL REFERENCES 'tbl_cibles'('chi_id_cible') ,
    
            /* meta((champ,'chp_provenance_rev'),(nom_long_du_champ,'à faire chp_provenance_rev'),(nom_court_du_champ,'à faire chp_provenance_rev'),(nom_bref_du_champ,'à faire chp_provenance_rev'),(typologie,'cho')) */
             chp_provenance_rev CHARACTER(32),
    
            /* meta((champ,'chx_source_rev'),(nom_long_du_champ,'à faire chx_source_rev'),(nom_court_du_champ,'à faire chx_source_rev'),(nom_bref_du_champ,'à faire chx_source_rev'),(typologie,'chx')) */
             chx_source_rev INTEGER REFERENCES 'tbl_sources'('chi_id_source') ,
    
            /* meta((champ,'chp_id_rev'),(nom_long_du_champ,'à faire chp_id_rev'),(nom_court_du_champ,'à faire chp_id_rev'),(nom_bref_du_champ,'à faire chp_id_rev'),(typologie,'che')) */
             chp_id_rev INTEGER,
    
            /* meta((champ,'chp_valeur_rev'),(nom_long_du_champ,'à faire chp_valeur_rev'),(nom_court_du_champ,'à faire chp_valeur_rev'),(nom_bref_du_champ,'à faire chp_valeur_rev'),(typologie,'cht')) */
             chp_valeur_rev TEXT,
    
            /* meta((champ,'chp_type_rev'),(nom_long_du_champ,'à faire chp_type_rev'),(nom_court_du_champ,'à faire chp_type_rev'),(nom_bref_du_champ,'à faire chp_type_rev'),(typologie,'cho')) */
             chp_type_rev CHARACTER(4),
    
            /* meta((champ,'chp_niveau_rev'),(nom_long_du_champ,'à faire chp_niveau_rev'),(nom_court_du_champ,'à faire chp_niveau_rev'),(nom_bref_du_champ,'à faire chp_niveau_rev'),(typologie,'che')) */
             chp_niveau_rev INTEGER,
    
            /* meta((champ,'chp_quotee_rev'),(nom_long_du_champ,'à faire chp_quotee_rev'),(nom_court_du_champ,'à faire chp_quotee_rev'),(nom_bref_du_champ,'à faire chp_quotee_rev'),(typologie,'che')) */
             chp_quotee_rev INTEGER,
    
            /* meta((champ,'chp_pos_premier_rev'),(nom_long_du_champ,'à faire chp_pos_premier_rev'),(nom_court_du_champ,'à faire chp_pos_premier_rev'),(nom_bref_du_champ,'à faire chp_pos_premier_rev'),(typologie,'che')) */
             chp_pos_premier_rev INTEGER,
    
            /* meta((champ,'chp_pos_dernier_rev'),(nom_long_du_champ,'à faire chp_pos_dernier_rev'),(nom_court_du_champ,'à faire chp_pos_dernier_rev'),(nom_bref_du_champ,'à faire chp_pos_dernier_rev'),(typologie,'che')) */
             chp_pos_dernier_rev INTEGER,
    
            /* meta((champ,'chp_parent_rev'),(nom_long_du_champ,'à faire chp_parent_rev'),(nom_court_du_champ,'à faire chp_parent_rev'),(nom_bref_du_champ,'à faire chp_parent_rev'),(typologie,'che')) */
             chp_parent_rev INTEGER,
    
            /* meta((champ,'chp_nbr_enfants_rev'),(nom_long_du_champ,'à faire chp_nbr_enfants_rev'),(nom_court_du_champ,'à faire chp_nbr_enfants_rev'),(nom_bref_du_champ,'à faire chp_nbr_enfants_rev'),(typologie,'che')) */
             chp_nbr_enfants_rev INTEGER,
    
            /* meta((champ,'chp_num_enfant_rev'),(nom_long_du_champ,'à faire chp_num_enfant_rev'),(nom_court_du_champ,'à faire chp_num_enfant_rev'),(nom_bref_du_champ,'à faire chp_num_enfant_rev'),(typologie,'che')) */
             chp_num_enfant_rev INTEGER,
    
            /* meta((champ,'chp_profondeur_rev'),(nom_long_du_champ,'à faire chp_profondeur_rev'),(nom_court_du_champ,'à faire chp_profondeur_rev'),(nom_bref_du_champ,'à faire chp_profondeur_rev'),(typologie,'che')) */
             chp_profondeur_rev INTEGER,
    
            /* meta((champ,'chp_pos_ouver_parenthese_rev'),(nom_long_du_champ,'à faire chp_pos_ouver_parenthese_rev'),(nom_court_du_champ,'à faire chp_pos_ouver_parenthese_rev'),(nom_bref_du_champ,'à faire chp_pos_ouver_parenthese_rev'),(typologie,'che')) */
             chp_pos_ouver_parenthese_rev INTEGER,
    
            /* meta((champ,'chp_pos_fermer_parenthese_rev'),(nom_long_du_champ,'à faire chp_pos_fermer_parenthese_rev'),(nom_court_du_champ,'à faire chp_pos_fermer_parenthese_rev'),(nom_bref_du_champ,'à faire chp_pos_fermer_parenthese_rev'),(typologie,'che')) */
             chp_pos_fermer_parenthese_rev INTEGER,
    
            /* meta((champ,'chp_commentaire_rev'),(nom_long_du_champ,'à faire chp_commentaire_rev'),(nom_court_du_champ,'à faire chp_commentaire_rev'),(nom_bref_du_champ,'à faire chp_commentaire_rev'),(typologie,'cht')) */
             chp_commentaire_rev TEXT
    );
/*==============================*/

CREATE  UNIQUE INDEX  idx_ligne_rev ON `tbl_revs` 
        /* meta((index,'idx_ligne_rev'),(message,'à faire idx_ligne_rev')) */
         ( `chx_cible_rev` , `chp_provenance_rev` , `chx_source_rev` , `chp_id_rev` ) ;
/*
  =====================================================================================================================
  table tbl_bdds
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_bdds'),(nom_long_de_la_table,'à faire tbl_bdds'),(nom_court_de_la_table,'à faire tbl_bdds'),(nom_bref_de_la_table,'à faire tbl_bdds'),(transform_table_sur_svg,transform(translate(429,147)))) */
     tbl_bdds( 

    
            /* meta((champ,'chi_id_basedd'),(nom_long_du_champ,'à faire chi_id_basedd'),(nom_court_du_champ,'à faire chi_id_basedd'),(nom_bref_du_champ,'à faire chi_id_basedd'),(typologie,'chi')) */
             chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT,
    
            /* meta((champ,'chx_dossier_id_basedd'),(nom_long_du_champ,'à faire chx_dossier_id_basedd'),(nom_court_du_champ,'à faire chx_dossier_id_basedd'),(nom_bref_du_champ,'à faire chx_dossier_id_basedd'),(typologie,'chx')) */
             chx_dossier_id_basedd INTEGER REFERENCES 'tbl_dossiers'('chi_id_dossier') ,
    
            /* meta((champ,'chx_cible_id_basedd'),(nom_long_du_champ,'à faire chx_cible_id_basedd'),(nom_court_du_champ,'à faire chx_cible_id_basedd'),(nom_bref_du_champ,'à faire chx_cible_id_basedd'),(typologie,'chx')) */
             chx_cible_id_basedd INTEGER NOT NULL REFERENCES 'tbl_cibles'('chi_id_cible') ,
    
            /* meta((champ,'chp_nom_basedd'),(nom_long_du_champ,'à faire chp_nom_basedd'),(nom_court_du_champ,'à faire chp_nom_basedd'),(nom_bref_du_champ,'à faire chp_nom_basedd'),(typologie,'cht')) */
             chp_nom_basedd TEXT DEFAULT  '' ,
    
            /* meta((champ,'chp_rev_basedd'),(nom_long_du_champ,'à faire chp_rev_basedd'),(nom_court_du_champ,'à faire chp_rev_basedd'),(nom_bref_du_champ,'à faire chp_rev_basedd'),(typologie,'cht')) */
             chp_rev_basedd TEXT,
    
            /* meta((champ,'chp_commentaire_basedd'),(nom_long_du_champ,'à faire chp_commentaire_basedd'),(nom_court_du_champ,'à faire chp_commentaire_basedd'),(nom_bref_du_champ,'à faire chp_commentaire_basedd'),(typologie,'cht')) */
             chp_commentaire_basedd TEXT,
    
            /* meta((champ,'chp_genere_basedd'),(nom_long_du_champ,'à faire chp_genere_basedd'),(nom_court_du_champ,'à faire chp_genere_basedd'),(nom_bref_du_champ,'à faire chp_genere_basedd'),(typologie,'cht')) */
             chp_genere_basedd TEXT,
    
            /* meta((champ,'chp_rev_travail_basedd'),(nom_long_du_champ,'à faire chp_rev_travail_basedd'),(nom_court_du_champ,'à faire chp_rev_travail_basedd'),(nom_bref_du_champ,'à faire chp_rev_travail_basedd'),(typologie,'cht')) */
             chp_rev_travail_basedd TEXT,
    
            /* meta((champ,'chp_fournisseur_basedd'),(nom_long_du_champ,'à faire chp_fournisseur_basedd'),(nom_court_du_champ,'à faire chp_fournisseur_basedd'),(nom_bref_du_champ,'à faire chp_fournisseur_basedd'),(typologie,'cht')) */
             chp_fournisseur_basedd TEXT DEFAULT  'sqlite' 
    );
/*
  =====================================================================================================================
  table tbl_requetes
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_requetes'),(nom_long_de_la_table,'à faire tbl_requetes'),(nom_court_de_la_table,'à faire tbl_requetes'),(nom_bref_de_la_table,'à faire tbl_requetes'),(transform_table_sur_svg,transform(translate(0,0)))) */
     tbl_requetes( 

    
            /* meta((champ,'chi_id_requete'),(nom_long_du_champ,'à faire chi_id_requete'),(nom_court_du_champ,'à faire chi_id_requete'),(nom_bref_du_champ,'à faire chi_id_requete'),(typologie,'chi')) */
             chi_id_requete INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chp_type_requete'),(nom_long_du_champ,'à faire chp_type_requete'),(nom_court_du_champ,'à faire chp_type_requete'),(nom_bref_du_champ,'à faire chp_type_requete'),(typologie,'chp')) */
             chp_type_requete VARCHAR(64) DEFAULT  'selectionner' ,
    
            /* meta((champ,'cht_rev_requete'),(nom_long_du_champ,'à faire cht_rev_requete'),(nom_court_du_champ,'à faire cht_rev_requete'),(nom_bref_du_champ,'à faire cht_rev_requete'),(typologie,'cht')) */
             cht_rev_requete TEXT,
    
            /* meta((champ,'cht_commentaire_requete'),(nom_long_du_champ,'à faire cht_commentaire_requete'),(nom_court_du_champ,'à faire cht_commentaire_requete'),(nom_bref_du_champ,'à faire cht_commentaire_requete'),(typologie,'cht')) */
             cht_commentaire_requete TEXT
    );
/*
  =====================================================================================================================
  table tbl_tests
  =====================================================================================================================
*/



CREATE TABLE
    /* meta((table,'tbl_tests'),(nom_long_de_la_table,'à faire tbl_tests'),(nom_court_de_la_table,'à faire tbl_tests'),(nom_bref_de_la_table,'à faire tbl_tests'),(transform_table_sur_svg,transform(translate(649,267)))) */
     tbl_tests( 

    
            /* meta((champ,'chi_id_test'),(nom_long_du_champ,'à faire chi_id_test'),(nom_court_du_champ,'à faire chi_id_test'),(nom_bref_du_champ,'à faire chi_id_test'),(typologie,'chi')) */
             chi_id_test INTEGER PRIMARY KEY ,
    
            /* meta((champ,'chp_nom_test'),(nom_long_du_champ,'à faire chp_nom_test'),(nom_court_du_champ,'à faire chp_nom_test'),(nom_bref_du_champ,'à faire chp_nom_test'),(typologie,'chp')) */
             chp_nom_test VARCHAR(64) NOT NULL DEFAULT  '' 
    );