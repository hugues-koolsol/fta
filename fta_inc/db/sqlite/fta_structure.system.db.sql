
BEGIN TRANSACTION;
    
    
    
    CREATE TABLE tbl_cibles (
     chi_id_cible INTEGER PRIMARY KEY ,
         chp_nom_cible STRING,
         chp_commentaire_cible STRING,
         chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT  'xxx' 
    );
    
    CREATE  UNIQUE INDEX  idx_dossier_cible ON `tbl_cibles`( `chp_dossier_cible` ) ;
    
    
    
    CREATE TABLE tbl_dossiers (
     chi_id_dossier INTEGER PRIMARY KEY ,
         chp_nom_dossier CHARACTER(256) NOT NULL DEFAULT  '' ,
         chx_cible_dossier INTEGER REFERENCES 'tbl_cibles'('chi_id_cible') 
    );
    
    CREATE  UNIQUE INDEX  idx_cible_et_nom ON `tbl_dossiers`( `chx_cible_dossier` , `chp_nom_dossier` ) ;
    
    
    
    CREATE TABLE tbl_sources (
     chi_id_source INTEGER PRIMARY KEY ,
         chp_nom_source CHARACTER(256) NOT NULL DEFAULT  '' ,
         chp_commentaire_source TEXT,
         chx_cible_id_source INTEGER REFERENCES 'tbl_cibles'('chi_id_cible') ,
         chx_dossier_id_source INTEGER REFERENCES 'tbl_dossiers'('chi_id_dossier') ,
         chp_rev_source TEXT,
         chp_genere_source TEXT,
         chp_type_source TEXT NOT NULL DEFAULT  'normal' 
    );
    
    CREATE  UNIQUE INDEX  idx_nom_et_dossier ON `tbl_sources`( `chx_dossier_id_source` , `chp_nom_source` ) ;
    
    
    
    CREATE TABLE tbl_bases_de_donnees (
     chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL,
         chp_nom_basedd TEXT NOT NULL DEFAULT  '' ,
         chp_rev_basedd TEXT,
         chp_commentaire_basedd TEXT,
         chx_dossier_id_basedd INTEGER DEFAULT  NULL  REFERENCES 'tbl_dossiers'('chi_id_dossier') ,
         chp_genere_basedd TEXT,
         chx_cible_id_basedd INTEGER DEFAULT  NULL  REFERENCES 'tbl_cibles'('chi_id_cible') ,
         chp_php_basedd TEXT
    );
    
    CREATE  UNIQUE INDEX  idx_nom_basedd ON `tbl_bases_de_donnees`( `chp_nom_basedd` , `chx_cible_id_basedd` ) ;
    
    
    
    CREATE TABLE tbl_revs (
     chx_cible_rev INTEGER REFERENCES 'tbl_cibles'('chi_id_cible') ,
         chp_provenance_rev CHARACTER(32),
         chx_source_rev INTEGER,
         chp_id_rev INTEGER,
         chp_valeur_rev TEXT,
         chp_type_rev CHARACTER(4),
         chp_niveau_rev INTEGER,
         chp_quotee_rev INTEGER,
         chp_pos_premier_rev INTEGER,
         chp_pos_dernier_rev INTEGER,
         chp_parent_rev INTEGER,
         chp_nbr_enfants_rev INTEGER,
         chp_num_enfant_rev INTEGER,
         chp_profondeur_rev INTEGER,
         chp_pos_ouver_parenthese_rev INTEGER,
         chp_pos_fermer_parenthese_rev INTEGER,
         chp_commentaire_rev TEXT
    );
    
    
    
    CREATE TABLE tbl_utilisateurs (
     chi_id_utilisateur INTEGER PRIMARY KEY ,
         chp_nom_de_connexion_utilisateur STRING,
         chp_mot_de_passe_utilisateur STRING,
         chp_commentaire_utilisateur TEXT
    );
    
    CREATE  UNIQUE INDEX  idxNomUtilisateur ON `tbl_utilisateurs`( `chp_nom_de_connexion_utilisateur` ) ;
    
    
    
    CREATE TABLE tbl_taches (
     chi_id_tache INTEGER PRIMARY KEY  NOT NULL,
         chx_utilisateur_tache INTEGER REFERENCES 'tbl_utilisateurss'('chi_id_utilisateur') ,
         chp_priorite_tache INTEGER,
         chp_texte_tache TEXT
    );

COMMIT;