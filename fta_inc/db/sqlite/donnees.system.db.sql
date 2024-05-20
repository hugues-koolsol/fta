/*
  =========================================================================
  Pour la table tbl_groupes il y a 3 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_groupes`( `chi_id_groupe`, `chp_nom_groupe`, `chp_commentaire_groupe`, `chx_id_metier_groupe`) VALUES
('1','racine','','1'),
('2','administrateur','','2'),
('3','utilisateur','','3');
/*
  =========================================================================
  Pour la table tbl_cibles il y a 2 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_cibles`( `chi_id_cible`, `chp_nom_cible`, `chp_commentaire_cible`, `chp_dossier_cible`) VALUES
('1','fta','la racine avec ''t'' "e" \s\ `t` ''è''  ''à'' ''à'' 👍 /ù/','fta'),
('2','fta','un clone de fta avec des sources nettoyés','ftb');
/*
  =========================================================================
  Pour la table tbl_dossiers il y a 15 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chp_nom_dossier`, `chx_cible_dossier`) VALUES
('1','/','1'),
('17','/fta_backup','1'),
('18','/fta_inc','1'),
('19','/fta_inc/ajax','1'),
('20','/fta_inc/ajax/core','1');

INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chp_nom_dossier`, `chx_cible_dossier`) VALUES
('21','/fta_inc/ajax/file','1'),
('22','/fta_inc/ajax/html','1'),
('23','/fta_inc/ajax/php','1'),
('24','/fta_inc/db','1'),
('25','/fta_inc/phplib','1');

INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chp_nom_dossier`, `chx_cible_dossier`) VALUES
('26','/fta_inc/rev','1'),
('27','/fta_www','1'),
('28','/fta_www/fichiers_produits','1'),
('29','/fta_www/js','1'),
('31','/fta_inc/db/sqlite','1');
 /* table tbl_sources aucune données à insérer */
/*
  =========================================================================
  Pour la table tbl_bases_de_donnees il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_bases_de_donnees`( `chi_id_basedd`, `chp_nom_basedd`, `chp_rev_basedd`, `chp_commentaire_basedd`, `chx_dossier_id_basedd`, `chp_genere_basedd`, `chx_cible_id_basedd`, `chp_php_basedd`) VALUES
('1','system.db','sql(
   transaction(
      create_table(
         n(''tbl_groupes''),
         fields(
            #(),
            field(n(chi_id_groupe) , type(INTEGER) , primary_key()),
            field(n(chp_nom_groupe) , type(STRING)),
            field(n(chp_commentaire_groupe) , type(STRING)),
            field(n(chx_id_metier_groupe) , type(INTEGER))
         )
      ),
      add_index(n(''tbl_groupes'') , unique() , index_name(''idxNomGroupe'') , fields(''chp_nom_groupe'')),
      create_table(
         n(''tbl_cibles''),
         fields(
            #(),
            field(n(chi_id_cible) , type(INTEGER) , primary_key()),
            field(n(chp_nom_cible) , type(STRING)),
            field(n(chp_commentaire_cible) , type(STRING)),
            field(n(chp_dossier_cible) , type(CHARACTER , 3) , not_null() , default(''xxx''))
         )
      ),
      add_index(n(''tbl_cibles'') , unique() , index_name(''idx_dossier_cible'') , fields(''chp_dossier_cible'')),
      create_table(
         n(''tbl_dossiers''),
         fields(
            #(),
            field(n(chi_id_dossier) , type(INTEGER) , primary_key()),
            field(n(chp_nom_dossier) , type(CHARACTER , 256) , not_null() , default('''')),
            field(n(chx_cible_dossier) , type(INTEGER) , references(''tbl_cibles'' , ''chi_id_cible''))
         )
      ),
      add_index(n(''tbl_dossiers'') , unique() , index_name(''idx_cible_et_nom'') , fields(''chx_cible_dossier'' , ''chp_nom_dossier'')),
      create_table(
         n(''tbl_sources''),
         fields(
            #(),
            field(n(chi_id_source) , type(INTEGER) , primary_key()),
            field(n(chp_nom_source) , type(CHARACTER , 256) , not_null() , default('''')),
            field(n(chp_commentaire_source) , type(TEXT)),
            field(n(chx_cible_id_source) , type(INTEGER) , references(''tbl_cibles'' , ''chi_id_cible'')),
            field(n(chx_dossier_id_source) , type(INTEGER) , references(''tbl_dossiers'' , ''chi_id_dossier'')),
            field(n(chp_rev_source) , type(TEXT)),
            field(n(chp_genere_source) , type(TEXT))
         )
      ),
      add_index(n(''tbl_sources'') , unique() , index_name(''idx_nom_et_dossier'') , fields(''chx_dossier_id_source'' , ''chp_nom_source'')),
      create_table(
         n(''tbl_bases_de_donnees''),
         fields(
            #(),
            field(n(chi_id_basedd) , type(INTEGER) , primary_key() , auto_increment() , not_null()),
            field(n(chp_nom_basedd) , type(TEXT) , not_null() , default('''')),
            field(n(chp_rev_basedd) , type(TEXT)),
            field(n(chp_commentaire_basedd) , type(TEXT)),
            field(n(chx_dossier_id_basedd) , type(INTEGER) , default(NULL) , references(''tbl_dossiers'' , ''chi_id_dossier'')),
            field(n(chp_genere_basedd) , type(TEXT)),
            field(n(chx_cible_id_basedd) , type(INTEGER) , default(NULL) , references(''tbl_cibles'' , ''chi_id_cible'')),
            field(n(chp_php_basedd) , type(TEXT))
         )
      ),
      add_index(n(''tbl_bases_de_donnees'') , unique() , index_name(''idx_nom_basedd'') , fields(''chp_nom_basedd'')),
      create_table(
         n(''tbl_utilisateurs''),
         fields(
            #(),
            field(n(chi_id_utilisateur) , type(INTEGER) , primary_key()),
            field(n(chp_nom_de_connexion_utilisateur) , type(STRING)),
            field(n(chp_mot_de_passe_utilisateur) , type(STRING)),
            field(n(chp_commentaire_utilisateur) , type(TEXT)),
            field(n(chx_id_groupe_connexion_utilisateur) , type(INTEGER))
         )
      ),
      add_index(n(''tbl_utilisateurs'') , unique() , index_name(''idxNomUtilisateur'') , fields(''chp_nom_de_connexion_utilisateur'')),
      create_table(
         n(''tbl_rev''),
         fields(
            #(),
            field(n(chx_cible_rev) , type(INTEGER) , references(''tbl_cibles'' , ''chi_id_cible'')),
            field(n(chp_provenance_rev) , type(CHARACTER , 32)),
            field(n(chx_id_provanance_rev) , type(INTEGER)),
            field(n(chp_id_rev) , type(INTEGER)),
            field(n(chp_valeur_rev) , type(TEXT)),
            field(n(chp_type_rev) , type(CHARACTER , 4)),
            field(n(chp_niveau_rev) , type(INTEGER)),
            field(n(chp_quotee_rev) , type(INTEGER)),
            field(n(chp_pos_premier_rev) , type(INTEGER)),
            field(n(chp_pos_dernier_rev) , type(INTEGER)),
            field(n(chp_parent_rev) , type(INTEGER)),
            field(n(chp_nbr_enfants_rev) , type(INTEGER)),
            field(n(chp_num_enfant_rev) , type(INTEGER)),
            field(n(chp_profondeur_rev) , type(INTEGER)),
            field(n(chp_pos_ouver_parenthese_rev) , type(INTEGER)),
            field(n(chp_pos_fermer_parenthese_rev) , type(INTEGER)),
            field(n(chp_commentaire_rev) , type(TEXT))
         )
      )
   )
)','bla','31','
BEGIN TRANSACTION;
    
    
    
    CREATE TABLE tbl_groupes (
    
        /**/ chi_id_groupe INTEGER PRIMARY KEY ,
         chp_nom_groupe STRING,
         chp_commentaire_groupe STRING,
         chx_id_metier_groupe INTEGER
    );
    
    CREATE  UNIQUE INDEX  idxNomGroupe ON tbl_groupes( chp_nom_groupe ) ;
    
    
    
    CREATE TABLE tbl_cibles (
    
        /**/ chi_id_cible INTEGER PRIMARY KEY ,
         chp_nom_cible STRING,
         chp_commentaire_cible STRING,
         chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT  ''xxx'' 
    );
    
    CREATE  UNIQUE INDEX  idx_dossier_cible ON tbl_cibles( chp_dossier_cible ) ;
    
    
    
    CREATE TABLE tbl_dossiers (
    
        /**/ chi_id_dossier INTEGER PRIMARY KEY ,
         chp_nom_dossier CHARACTER(256) NOT NULL DEFAULT  '''' ,
         chx_cible_dossier INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') 
    );
    
    CREATE  UNIQUE INDEX  idx_cible_et_nom ON tbl_dossiers( chx_cible_dossier , chp_nom_dossier ) ;
    
    
    
    CREATE TABLE tbl_sources (
    
        /**/ chi_id_source INTEGER PRIMARY KEY ,
         chp_nom_source CHARACTER(256) NOT NULL DEFAULT  '''' ,
         chp_commentaire_source TEXT,
         chx_cible_id_source INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
         chx_dossier_id_source INTEGER REFERENCES ''tbl_dossiers''(''chi_id_dossier'') ,
         chp_rev_source TEXT,
         chp_genere_source TEXT
    );
    
    CREATE  UNIQUE INDEX  idx_nom_et_dossier ON tbl_sources( chx_dossier_id_source , chp_nom_source ) ;
    
    
    
    CREATE TABLE tbl_bases_de_donnees (
    
        /**/ chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL,
         chp_nom_basedd TEXT NOT NULL DEFAULT  '''' ,
         chp_rev_basedd TEXT,
         chp_commentaire_basedd TEXT,
         chx_dossier_id_basedd INTEGER DEFAULT  NULL  REFERENCES ''tbl_dossiers''(''chi_id_dossier'') ,
         chp_genere_basedd TEXT,
         chx_cible_id_basedd INTEGER DEFAULT  NULL  REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
         chp_php_basedd TEXT
    );
    
    CREATE  UNIQUE INDEX  idx_nom_basedd ON tbl_bases_de_donnees( chp_nom_basedd ) ;
    
    
    
    CREATE TABLE tbl_utilisateurs (
    
        /**/ chi_id_utilisateur INTEGER PRIMARY KEY ,
         chp_nom_de_connexion_utilisateur STRING,
         chp_mot_de_passe_utilisateur STRING,
         chp_commentaire_utilisateur TEXT,
         chx_id_groupe_connexion_utilisateur INTEGER
    );
    
    CREATE  UNIQUE INDEX  idxNomUtilisateur ON tbl_utilisateurs( chp_nom_de_connexion_utilisateur ) ;
    
    
    
    CREATE TABLE tbl_rev (
    
        /**/ chx_cible_rev INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
         chp_provenance_rev CHARACTER(32),
         chx_id_provanance_rev INTEGER,
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
COMMIT;','1','$db = new SQLite3(''temporaire_pour_test.db'');
$uneErreur=false;
if((false === $db->exec(''BEGIN TRANSACTION''))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre>'' ;
    $uneErreur=true;
}
$chaineSql=''
BEGIN TRANSACTION;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_groupes (
    
        /**/ chi_id_groupe INTEGER PRIMARY KEY ,
         chp_nom_groupe STRING,
         chp_commentaire_groupe STRING,
         chx_id_metier_groupe INTEGER
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idxNomGroupe ON tbl_groupes( chp_nom_groupe ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_cibles (
    
        /**/ chi_id_cible INTEGER PRIMARY KEY ,
         chp_nom_cible STRING,
         chp_commentaire_cible STRING,
         chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT  \''xxx\'' 
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idx_dossier_cible ON tbl_cibles( chp_dossier_cible ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_dossiers (
    
        /**/ chi_id_dossier INTEGER PRIMARY KEY ,
         chp_nom_dossier CHARACTER(256) NOT NULL DEFAULT  \''\'' ,
         chx_cible_dossier INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') 
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idx_cible_et_nom ON tbl_dossiers( chx_cible_dossier , chp_nom_dossier ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_sources (
    
        /**/ chi_id_source INTEGER PRIMARY KEY ,
         chp_nom_source CHARACTER(256) NOT NULL DEFAULT  \''\'' ,
         chp_commentaire_source TEXT,
         chx_cible_id_source INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
         chx_dossier_id_source INTEGER REFERENCES \''tbl_dossiers\''(\''chi_id_dossier\'') ,
         chp_rev_source TEXT,
         chp_genere_source TEXT
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idx_nom_et_dossier ON tbl_sources( chx_dossier_id_source , chp_nom_source ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_bases_de_donnees (
    
        /**/ chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL,
         chp_nom_basedd TEXT NOT NULL DEFAULT  \''\'' ,
         chp_rev_basedd TEXT,
         chp_commentaire_basedd TEXT,
         chx_dossier_id_basedd INTEGER DEFAULT  NULL  REFERENCES \''tbl_dossiers\''(\''chi_id_dossier\'') ,
         chp_genere_basedd TEXT,
         chx_cible_id_basedd INTEGER DEFAULT  NULL  REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
         chp_php_basedd TEXT
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idx_nom_basedd ON tbl_bases_de_donnees( chp_nom_basedd ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_utilisateurs (
    
        /**/ chi_id_utilisateur INTEGER PRIMARY KEY ,
         chp_nom_de_connexion_utilisateur STRING,
         chp_mot_de_passe_utilisateur STRING,
         chp_commentaire_utilisateur TEXT,
         chx_id_groupe_connexion_utilisateur INTEGER
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idxNomUtilisateur ON tbl_utilisateurs( chp_nom_de_connexion_utilisateur ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_rev (
    
        /**/ chx_cible_rev INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
         chp_provenance_rev CHARACTER(32),
         chx_id_provanance_rev INTEGER,
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
COMMIT;'';
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
$sql=''INSERT INTO `tbl_groupes`(
    `chi_id_groupe`                               ,   `chp_nom_groupe`                              ,   `chp_commentaire_groupe`                      ,   `chx_id_metier_groupe`                        
) VALUES (
 \''''.sq0($tab[0]).''\''                             ,\''''.sq0($tab[1]).''\''                             ,\''''.sq0($tab[2]).''\''                             ,\''''.sq0($tab[3]).''\''                             
)'';

/* ====== */
$sql=''INSERT INTO `tbl_cibles`(
    `chi_id_cible`                                ,   `chp_nom_cible`                               ,   `chp_commentaire_cible`                       ,   `chp_dossier_cible`                           
) VALUES (
 \''''.sq0($tab[0]).''\''                             ,\''''.sq0($tab[1]).''\''                             ,\''''.sq0($tab[2]).''\''                             ,\''''.sq0($tab[3]).''\''                             
)'';

/* ====== */
$sql=''INSERT INTO `tbl_dossiers`(
    `chi_id_dossier`                              ,   `chp_nom_dossier`                             ,   `chx_cible_dossier`                           
) VALUES (
 \''''.sq0($tab[0]).''\''                             ,\''''.sq0($tab[1]).''\''                             ,\''''.sq0($tab[2]).''\''                             
)'';

/* ====== */
$sql=''INSERT INTO `tbl_sources`(
    `chi_id_source`                               ,   `chp_nom_source`                              ,   `chp_commentaire_source`                      ,   `chx_cible_id_source`                         ,   `chx_dossier_id_source`                       
,   `chp_rev_source`                              ,   `chp_genere_source`                           
) VALUES (
 \''''.sq0($tab[0]).''\''                             ,\''''.sq0($tab[1]).''\''                             ,\''''.sq0($tab[2]).''\''                             ,\''''.sq0($tab[3]).''\''                             ,\''''.sq0($tab[4]).''\''                             
,\''''.sq0($tab[5]).''\''                             ,\''''.sq0($tab[6]).''\''                             
)'';

/* ====== */
$sql=''INSERT INTO `tbl_bases_de_donnees`(
    `chi_id_basedd`                               ,   `chp_nom_basedd`                              ,   `chp_rev_basedd`                              ,   `chp_commentaire_basedd`                      ,   `chx_dossier_id_basedd`                       
,   `chp_genere_basedd`                           ,   `chx_cible_id_basedd`                         ,   `chp_php_basedd`                              
) VALUES (
 \''''.sq0($tab[0]).''\''                             ,\''''.sq0($tab[1]).''\''                             ,\''''.sq0($tab[2]).''\''                             ,\''''.sq0($tab[3]).''\''                             ,\''''.sq0($tab[4]).''\''                             
,\''''.sq0($tab[5]).''\''                             ,\''''.sq0($tab[6]).''\''                             ,\''''.sq0($tab[7]).''\''                             
)'';

/* ====== */
$sql=''INSERT INTO `tbl_utilisateurs`(
    `chi_id_utilisateur`                          ,   `chp_nom_de_connexion_utilisateur`            ,   `chp_mot_de_passe_utilisateur`                ,   `chp_commentaire_utilisateur`                 ,   `chx_id_groupe_connexion_utilisateur`         
) VALUES (
 \''''.sq0($tab[0]).''\''                             ,\''''.sq0($tab[1]).''\''                             ,\''''.sq0($tab[2]).''\''                             ,\''''.sq0($tab[3]).''\''                             ,\''''.sq0($tab[4]).''\''                             
)'';

/* ====== */
$sql=''INSERT INTO `tbl_rev`(
    `chx_cible_rev`                               ,   `chp_provenance_rev`                          ,   `chx_id_provanance_rev`                       ,   `chp_id_rev`                                  ,   `chp_valeur_rev`                              
,   `chp_type_rev`                                ,   `chp_niveau_rev`                              ,   `chp_quotee_rev`                              ,   `chp_pos_premier_rev`                         ,   `chp_pos_dernier_rev`                         
,   `chp_parent_rev`                              ,   `chp_nbr_enfants_rev`                         ,   `chp_num_enfant_rev`                          ,   `chp_profondeur_rev`                          ,   `chp_pos_ouver_parenthese_rev`                
,   `chp_pos_fermer_parenthese_rev`               ,   `chp_commentaire_rev`                         
) VALUES (
 \''''.sq0($tab[0]).''\''                             ,\''''.sq0($tab[1]).''\''                             ,\''''.sq0($tab[2]).''\''                             ,\''''.sq0($tab[3]).''\''                             ,\''''.sq0($tab[4]).''\''                             
,\''''.sq0($tab[5]).''\''                             ,\''''.sq0($tab[6]).''\''                             ,\''''.sq0($tab[7]).''\''                             ,\''''.sq0($tab[8]).''\''                             ,\''''.sq0($tab[9]).''\''                             
,\''''.sq0($tab[10]).''\''                            ,\''''.sq0($tab[11]).''\''                            ,\''''.sq0($tab[12]).''\''                            ,\''''.sq0($tab[13]).''\''                            ,\''''.sq0($tab[14]).''\''                            
,\''''.sq0($tab[15]).''\''                            ,\''''.sq0($tab[16]).''\''                            
)'';
');
/*
  =========================================================================
  Pour la table tbl_utilisateurs il y a 4 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_utilisateurs`( `chi_id_utilisateur`, `chp_nom_de_connexion_utilisateur`, `chp_mot_de_passe_utilisateur`, `chp_commentaire_utilisateur`, `chx_id_groupe_connexion_utilisateur`) VALUES
('1','racine','$2y$13$IcFbZ8w6Ansiqb.JWGKMFummgdQ6SPee4gEfyVSpeCCpBarpUJKQa','','1'),
('2','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','','2'),
('3','test01','$2y$13$//VrAsuroLw4tumXMQR9DueNfmhkZ4Le5W4eY61DaFtZAeEpeYtH2','','3'),
('25','25','$2y$13$IcFbZ8w6Ansiqb.JWGKMFummgdQ6SPee4gEfyVSpeCCpBarpUJKQa',' 
bla bla '' 
blublu
','1');
/*
  =========================================================================
  Pour la table tbl_rev il y a 375 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','0','','INIT','-1','0','0','0','0','1','0','0','0','0',''),
('1','bdd','1','1','sql','f','0','0','0','2','0','1','1','6','3','0',''),
('1','bdd','1','2','transaction','f','1','0','8','18','1','13','1','5','19','0',''),
('1','bdd','1','3','create_table','f','2','0','27','38','2','2','1','4','39','0',''),
('1','bdd','1','4','n','f','3','0','50','50','3','1','1','1','51','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','5','tbl_groupes','c','4','1','53','63','4','0','1','0','51','0',''),
('1','bdd','1','6','fields','f','3','0','77','82','3','5','2','3','83','0',''),
('1','bdd','1','7','#','f','4','0','97','97','6','0','1','0','98','99',''),
('1','bdd','1','8','field','f','4','0','114','118','6','3','2','2','119','0',''),
('1','bdd','1','9','n','f','5','0','120','120','8','1','1','1','121','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','10','chi_id_groupe','c','6','0','122','134','9','0','1','0','121','135',''),
('1','bdd','1','11','type','f','5','0','139','142','8','1','2','1','143','0',''),
('1','bdd','1','12','INTEGER','c','6','0','144','150','11','0','1','0','143','151',''),
('1','bdd','1','13','primary_key','f','5','0','155','165','8','0','3','0','166','0',''),
('1','bdd','1','14','field','f','4','0','183','187','6','2','3','2','188','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','15','n','f','5','0','189','189','14','1','1','1','190','0',''),
('1','bdd','1','16','chp_nom_groupe','c','6','0','191','204','15','0','1','0','190','205',''),
('1','bdd','1','17','type','f','5','0','209','212','14','1','2','1','213','0',''),
('1','bdd','1','18','STRING','c','6','0','214','219','17','0','1','0','213','220',''),
('1','bdd','1','19','field','f','4','0','236','240','6','2','4','2','241','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','20','n','f','5','0','242','242','19','1','1','1','243','0',''),
('1','bdd','1','21','chp_commentaire_groupe','c','6','0','244','265','20','0','1','0','243','266',''),
('1','bdd','1','22','type','f','5','0','270','273','19','1','2','1','274','0',''),
('1','bdd','1','23','STRING','c','6','0','275','280','22','0','1','0','274','281',''),
('1','bdd','1','24','field','f','4','0','297','301','6','2','5','2','302','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','25','n','f','5','0','303','303','24','1','1','1','304','0',''),
('1','bdd','1','26','chx_id_metier_groupe','c','6','0','305','324','25','0','1','0','304','325',''),
('1','bdd','1','27','type','f','5','0','329','332','24','1','2','1','333','0',''),
('1','bdd','1','28','INTEGER','c','6','0','334','340','27','0','1','0','333','341',''),
('1','bdd','1','29','add_index','f','2','0','370','378','2','4','2','2','379','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','30','n','f','3','0','380','380','29','1','1','1','381','0',''),
('1','bdd','1','31','tbl_groupes','c','4','1','383','393','30','0','1','0','381','0',''),
('1','bdd','1','32','unique','f','3','0','399','404','29','0','2','0','405','0',''),
('1','bdd','1','33','index_name','f','3','0','410','419','29','1','3','1','420','0',''),
('1','bdd','1','34','idxNomGroupe','c','4','1','422','433','33','0','1','0','420','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','35','fields','f','3','0','439','444','29','1','4','1','445','0',''),
('1','bdd','1','36','chp_nom_groupe','c','4','1','447','460','35','0','1','0','445','0',''),
('1','bdd','1','37','create_table','f','2','0','472','483','2','2','3','4','484','0',''),
('1','bdd','1','38','n','f','3','0','495','495','37','1','1','1','496','0',''),
('1','bdd','1','39','tbl_cibles','c','4','1','498','507','38','0','1','0','496','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','40','fields','f','3','0','521','526','37','5','2','3','527','0',''),
('1','bdd','1','41','#','f','4','0','541','541','40','0','1','0','542','543',''),
('1','bdd','1','42','field','f','4','0','558','562','40','3','2','2','563','0',''),
('1','bdd','1','43','n','f','5','0','564','564','42','1','1','1','565','0',''),
('1','bdd','1','44','chi_id_cible','c','6','0','566','577','43','0','1','0','565','578','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','45','type','f','5','0','582','585','42','1','2','1','586','0',''),
('1','bdd','1','46','INTEGER','c','6','0','587','593','45','0','1','0','586','594',''),
('1','bdd','1','47','primary_key','f','5','0','598','608','42','0','3','0','609','0',''),
('1','bdd','1','48','field','f','4','0','626','630','40','2','3','2','631','0',''),
('1','bdd','1','49','n','f','5','0','632','632','48','1','1','1','633','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','50','chp_nom_cible','c','6','0','634','646','49','0','1','0','633','647',''),
('1','bdd','1','51','type','f','5','0','651','654','48','1','2','1','655','0',''),
('1','bdd','1','52','STRING','c','6','0','656','661','51','0','1','0','655','662',''),
('1','bdd','1','53','field','f','4','0','678','682','40','2','4','2','683','0',''),
('1','bdd','1','54','n','f','5','0','684','684','53','1','1','1','685','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','55','chp_commentaire_cible','c','6','0','686','706','54','0','1','0','685','707',''),
('1','bdd','1','56','type','f','5','0','711','714','53','1','2','1','715','0',''),
('1','bdd','1','57','STRING','c','6','0','716','721','56','0','1','0','715','722',''),
('1','bdd','1','58','field','f','4','0','738','742','40','4','5','2','743','0',''),
('1','bdd','1','59','n','f','5','0','744','744','58','1','1','1','745','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','60','chp_dossier_cible','c','6','0','746','762','59','0','1','0','745','763',''),
('1','bdd','1','61','type','f','5','0','767','770','58','2','2','1','771','0',''),
('1','bdd','1','62','CHARACTER','c','6','0','772','780','61','0','1','0','0','0',''),
('1','bdd','1','63','3','c','6','0','784','784','61','0','2','0','771','785',''),
('1','bdd','1','64','not_null','f','5','0','789','796','58','0','3','0','797','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','65','default','f','5','0','802','808','58','1','4','1','809','0',''),
('1','bdd','1','66','xxx','c','6','1','811','813','65','0','1','0','809','0',''),
('1','bdd','1','67','add_index','f','2','0','844','852','2','4','4','2','853','0',''),
('1','bdd','1','68','n','f','3','0','854','854','67','1','1','1','855','0',''),
('1','bdd','1','69','tbl_cibles','c','4','1','857','866','68','0','1','0','855','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','70','unique','f','3','0','872','877','67','0','2','0','878','0',''),
('1','bdd','1','71','index_name','f','3','0','883','892','67','1','3','1','893','0',''),
('1','bdd','1','72','idx_dossier_cible','c','4','1','895','911','71','0','1','0','893','0',''),
('1','bdd','1','73','fields','f','3','0','917','922','67','1','4','1','923','0',''),
('1','bdd','1','74','chp_dossier_cible','c','4','1','925','941','73','0','1','0','923','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','75','create_table','f','2','0','953','964','2','2','5','4','965','0',''),
('1','bdd','1','76','n','f','3','0','976','976','75','1','1','1','977','0',''),
('1','bdd','1','77','tbl_dossiers','c','4','1','979','990','76','0','1','0','977','0',''),
('1','bdd','1','78','fields','f','3','0','1004','1009','75','4','2','3','1010','0',''),
('1','bdd','1','79','#','f','4','0','1024','1024','78','0','1','0','1025','1026','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','80','field','f','4','0','1041','1045','78','3','2','2','1046','0',''),
('1','bdd','1','81','n','f','5','0','1047','1047','80','1','1','1','1048','0',''),
('1','bdd','1','82','chi_id_dossier','c','6','0','1049','1062','81','0','1','0','1048','1063',''),
('1','bdd','1','83','type','f','5','0','1067','1070','80','1','2','1','1071','0',''),
('1','bdd','1','84','INTEGER','c','6','0','1072','1078','83','0','1','0','1071','1079','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','85','primary_key','f','5','0','1083','1093','80','0','3','0','1094','0',''),
('1','bdd','1','86','field','f','4','0','1111','1115','78','4','3','2','1116','0',''),
('1','bdd','1','87','n','f','5','0','1117','1117','86','1','1','1','1118','0',''),
('1','bdd','1','88','chp_nom_dossier','c','6','0','1119','1133','87','0','1','0','1118','1134',''),
('1','bdd','1','89','type','f','5','0','1138','1141','86','2','2','1','1142','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','90','CHARACTER','c','6','0','1143','1151','89','0','1','0','0','0',''),
('1','bdd','1','91','256','c','6','0','1155','1157','89','0','2','0','1142','1158',''),
('1','bdd','1','92','not_null','f','5','0','1162','1169','86','0','3','0','1170','0',''),
('1','bdd','1','93','default','f','5','0','1175','1181','86','1','4','1','1182','0',''),
('1','bdd','1','94','','c','6','1','1183','1183','93','0','1','0','1182','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','95','field','f','4','0','1201','1205','78','3','4','2','1206','0',''),
('1','bdd','1','96','n','f','5','0','1207','1207','95','1','1','1','1208','0',''),
('1','bdd','1','97','chx_cible_dossier','c','6','0','1209','1225','96','0','1','0','1208','1226',''),
('1','bdd','1','98','type','f','5','0','1230','1233','95','1','2','1','1234','0',''),
('1','bdd','1','99','INTEGER','c','6','0','1235','1241','98','0','1','0','1234','1242','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','100','references','f','5','0','1246','1255','95','2','3','1','1256','0',''),
('1','bdd','1','101','tbl_cibles','c','6','1','1258','1267','100','0','1','0','1256','0',''),
('1','bdd','1','102','chi_id_cible','c','6','1','1273','1284','100','0','2','0','1256','0',''),
('1','bdd','1','103','add_index','f','2','0','1315','1323','2','4','6','2','1324','0',''),
('1','bdd','1','104','n','f','3','0','1325','1325','103','1','1','1','1326','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','105','tbl_dossiers','c','4','1','1328','1339','104','0','1','0','1326','0',''),
('1','bdd','1','106','unique','f','3','0','1345','1350','103','0','2','0','1351','0',''),
('1','bdd','1','107','index_name','f','3','0','1356','1365','103','1','3','1','1366','0',''),
('1','bdd','1','108','idx_cible_et_nom','c','4','1','1368','1383','107','0','1','0','1366','0',''),
('1','bdd','1','109','fields','f','3','0','1389','1394','103','2','4','1','1395','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','110','chx_cible_dossier','c','4','1','1397','1413','109','0','1','0','1395','0',''),
('1','bdd','1','111','chp_nom_dossier','c','4','1','1419','1433','109','0','2','0','1395','0',''),
('1','bdd','1','112','create_table','f','2','0','1445','1456','2','2','7','4','1457','0',''),
('1','bdd','1','113','n','f','3','0','1468','1468','112','1','1','1','1469','0',''),
('1','bdd','1','114','tbl_sources','c','4','1','1471','1481','113','0','1','0','1469','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','115','fields','f','3','0','1495','1500','112','8','2','3','1501','0',''),
('1','bdd','1','116','#','f','4','0','1515','1515','115','0','1','0','1516','1517',''),
('1','bdd','1','117','field','f','4','0','1532','1536','115','3','2','2','1537','0',''),
('1','bdd','1','118','n','f','5','0','1538','1538','117','1','1','1','1539','0',''),
('1','bdd','1','119','chi_id_source','c','6','0','1540','1552','118','0','1','0','1539','1553','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','120','type','f','5','0','1557','1560','117','1','2','1','1561','0',''),
('1','bdd','1','121','INTEGER','c','6','0','1562','1568','120','0','1','0','1561','1569',''),
('1','bdd','1','122','primary_key','f','5','0','1573','1583','117','0','3','0','1584','0',''),
('1','bdd','1','123','field','f','4','0','1601','1605','115','4','3','2','1606','0',''),
('1','bdd','1','124','n','f','5','0','1607','1607','123','1','1','1','1608','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','125','chp_nom_source','c','6','0','1609','1622','124','0','1','0','1608','1623',''),
('1','bdd','1','126','type','f','5','0','1627','1630','123','2','2','1','1631','0',''),
('1','bdd','1','127','CHARACTER','c','6','0','1632','1640','126','0','1','0','0','0',''),
('1','bdd','1','128','256','c','6','0','1644','1646','126','0','2','0','1631','1647',''),
('1','bdd','1','129','not_null','f','5','0','1651','1658','123','0','3','0','1659','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','130','default','f','5','0','1664','1670','123','1','4','1','1671','0',''),
('1','bdd','1','131','','c','6','1','1672','1672','130','0','1','0','1671','0',''),
('1','bdd','1','132','field','f','4','0','1690','1694','115','2','4','2','1695','0',''),
('1','bdd','1','133','n','f','5','0','1696','1696','132','1','1','1','1697','0',''),
('1','bdd','1','134','chp_commentaire_source','c','6','0','1698','1719','133','0','1','0','1697','1720','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','135','type','f','5','0','1724','1727','132','1','2','1','1728','0',''),
('1','bdd','1','136','TEXT','c','6','0','1729','1732','135','0','1','0','1728','1733',''),
('1','bdd','1','137','field','f','4','0','1749','1753','115','3','5','2','1754','0',''),
('1','bdd','1','138','n','f','5','0','1755','1755','137','1','1','1','1756','0',''),
('1','bdd','1','139','chx_cible_id_source','c','6','0','1757','1775','138','0','1','0','1756','1776','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','140','type','f','5','0','1780','1783','137','1','2','1','1784','0',''),
('1','bdd','1','141','INTEGER','c','6','0','1785','1791','140','0','1','0','1784','1792',''),
('1','bdd','1','142','references','f','5','0','1796','1805','137','2','3','1','1806','0',''),
('1','bdd','1','143','tbl_cibles','c','6','1','1808','1817','142','0','1','0','1806','0',''),
('1','bdd','1','144','chi_id_cible','c','6','1','1823','1834','142','0','2','0','1806','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','145','field','f','4','0','1852','1856','115','3','6','2','1857','0',''),
('1','bdd','1','146','n','f','5','0','1858','1858','145','1','1','1','1859','0',''),
('1','bdd','1','147','chx_dossier_id_source','c','6','0','1860','1880','146','0','1','0','1859','1881',''),
('1','bdd','1','148','type','f','5','0','1885','1888','145','1','2','1','1889','0',''),
('1','bdd','1','149','INTEGER','c','6','0','1890','1896','148','0','1','0','1889','1897','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','150','references','f','5','0','1901','1910','145','2','3','1','1911','0',''),
('1','bdd','1','151','tbl_dossiers','c','6','1','1913','1924','150','0','1','0','1911','0',''),
('1','bdd','1','152','chi_id_dossier','c','6','1','1930','1943','150','0','2','0','1911','0',''),
('1','bdd','1','153','field','f','4','0','1961','1965','115','2','7','2','1966','0',''),
('1','bdd','1','154','n','f','5','0','1967','1967','153','1','1','1','1968','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','155','chp_rev_source','c','6','0','1969','1982','154','0','1','0','1968','1983',''),
('1','bdd','1','156','type','f','5','0','1987','1990','153','1','2','1','1991','0',''),
('1','bdd','1','157','TEXT','c','6','0','1992','1995','156','0','1','0','1991','1996',''),
('1','bdd','1','158','field','f','4','0','2012','2016','115','2','8','2','2017','0',''),
('1','bdd','1','159','n','f','5','0','2018','2018','158','1','1','1','2019','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','160','chp_genere_source','c','6','0','2020','2036','159','0','1','0','2019','2037',''),
('1','bdd','1','161','type','f','5','0','2041','2044','158','1','2','1','2045','0',''),
('1','bdd','1','162','TEXT','c','6','0','2046','2049','161','0','1','0','2045','2050',''),
('1','bdd','1','163','add_index','f','2','0','2079','2087','2','4','8','2','2088','0',''),
('1','bdd','1','164','n','f','3','0','2089','2089','163','1','1','1','2090','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','165','tbl_sources','c','4','1','2092','2102','164','0','1','0','2090','0',''),
('1','bdd','1','166','unique','f','3','0','2108','2113','163','0','2','0','2114','0',''),
('1','bdd','1','167','index_name','f','3','0','2119','2128','163','1','3','1','2129','0',''),
('1','bdd','1','168','idx_nom_et_dossier','c','4','1','2131','2148','167','0','1','0','2129','0',''),
('1','bdd','1','169','fields','f','3','0','2154','2159','163','2','4','1','2160','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','170','chx_dossier_id_source','c','4','1','2162','2182','169','0','1','0','2160','0',''),
('1','bdd','1','171','chp_nom_source','c','4','1','2188','2201','169','0','2','0','2160','0',''),
('1','bdd','1','172','create_table','f','2','0','2213','2224','2','2','9','4','2225','0',''),
('1','bdd','1','173','n','f','3','0','2236','2236','172','1','1','1','2237','0',''),
('1','bdd','1','174','tbl_bases_de_donnees','c','4','1','2239','2258','173','0','1','0','2237','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','175','fields','f','3','0','2272','2277','172','9','2','3','2278','0',''),
('1','bdd','1','176','#','f','4','0','2292','2292','175','0','1','0','2293','2294',''),
('1','bdd','1','177','field','f','4','0','2309','2313','175','5','2','2','2314','0',''),
('1','bdd','1','178','n','f','5','0','2315','2315','177','1','1','1','2316','0',''),
('1','bdd','1','179','chi_id_basedd','c','6','0','2317','2329','178','0','1','0','2316','2330','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','180','type','f','5','0','2334','2337','177','1','2','1','2338','0',''),
('1','bdd','1','181','INTEGER','c','6','0','2339','2345','180','0','1','0','2338','2346',''),
('1','bdd','1','182','primary_key','f','5','0','2350','2360','177','0','3','0','2361','0',''),
('1','bdd','1','183','auto_increment','f','5','0','2366','2379','177','0','4','0','2380','0',''),
('1','bdd','1','184','not_null','f','5','0','2385','2392','177','0','5','0','2393','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','185','field','f','4','0','2410','2414','175','4','3','2','2415','0',''),
('1','bdd','1','186','n','f','5','0','2416','2416','185','1','1','1','2417','0',''),
('1','bdd','1','187','chp_nom_basedd','c','6','0','2418','2431','186','0','1','0','2417','2432',''),
('1','bdd','1','188','type','f','5','0','2436','2439','185','1','2','1','2440','0',''),
('1','bdd','1','189','TEXT','c','6','0','2441','2444','188','0','1','0','2440','2445','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','190','not_null','f','5','0','2449','2456','185','0','3','0','2457','0',''),
('1','bdd','1','191','default','f','5','0','2462','2468','185','1','4','1','2469','0',''),
('1','bdd','1','192','','c','6','1','2470','2470','191','0','1','0','2469','0',''),
('1','bdd','1','193','field','f','4','0','2488','2492','175','2','4','2','2493','0',''),
('1','bdd','1','194','n','f','5','0','2494','2494','193','1','1','1','2495','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','195','chp_rev_basedd','c','6','0','2496','2509','194','0','1','0','2495','2510',''),
('1','bdd','1','196','type','f','5','0','2514','2517','193','1','2','1','2518','0',''),
('1','bdd','1','197','TEXT','c','6','0','2519','2522','196','0','1','0','2518','2523',''),
('1','bdd','1','198','field','f','4','0','2539','2543','175','2','5','2','2544','0',''),
('1','bdd','1','199','n','f','5','0','2545','2545','198','1','1','1','2546','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','200','chp_commentaire_basedd','c','6','0','2547','2568','199','0','1','0','2546','2569',''),
('1','bdd','1','201','type','f','5','0','2573','2576','198','1','2','1','2577','0',''),
('1','bdd','1','202','TEXT','c','6','0','2578','2581','201','0','1','0','2577','2582',''),
('1','bdd','1','203','field','f','4','0','2598','2602','175','4','6','2','2603','0',''),
('1','bdd','1','204','n','f','5','0','2604','2604','203','1','1','1','2605','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','205','chx_dossier_id_basedd','c','6','0','2606','2626','204','0','1','0','2605','2627',''),
('1','bdd','1','206','type','f','5','0','2631','2634','203','1','2','1','2635','0',''),
('1','bdd','1','207','INTEGER','c','6','0','2636','2642','206','0','1','0','2635','2643',''),
('1','bdd','1','208','default','f','5','0','2647','2653','203','1','3','1','2654','0',''),
('1','bdd','1','209','NULL','c','6','0','2655','2658','208','0','1','0','2654','2659','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','210','references','f','5','0','2663','2672','203','2','4','1','2673','0',''),
('1','bdd','1','211','tbl_dossiers','c','6','1','2675','2686','210','0','1','0','2673','0',''),
('1','bdd','1','212','chi_id_dossier','c','6','1','2692','2705','210','0','2','0','2673','0',''),
('1','bdd','1','213','field','f','4','0','2723','2727','175','2','7','2','2728','0',''),
('1','bdd','1','214','n','f','5','0','2729','2729','213','1','1','1','2730','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','215','chp_genere_basedd','c','6','0','2731','2747','214','0','1','0','2730','2748',''),
('1','bdd','1','216','type','f','5','0','2752','2755','213','1','2','1','2756','0',''),
('1','bdd','1','217','TEXT','c','6','0','2757','2760','216','0','1','0','2756','2761',''),
('1','bdd','1','218','field','f','4','0','2777','2781','175','4','8','2','2782','0',''),
('1','bdd','1','219','n','f','5','0','2783','2783','218','1','1','1','2784','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','220','chx_cible_id_basedd','c','6','0','2785','2803','219','0','1','0','2784','2804',''),
('1','bdd','1','221','type','f','5','0','2808','2811','218','1','2','1','2812','0',''),
('1','bdd','1','222','INTEGER','c','6','0','2813','2819','221','0','1','0','2812','2820',''),
('1','bdd','1','223','default','f','5','0','2824','2830','218','1','3','1','2831','0',''),
('1','bdd','1','224','NULL','c','6','0','2832','2835','223','0','1','0','2831','2836','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','225','references','f','5','0','2840','2849','218','2','4','1','2850','0',''),
('1','bdd','1','226','tbl_cibles','c','6','1','2852','2861','225','0','1','0','2850','0',''),
('1','bdd','1','227','chi_id_cible','c','6','1','2867','2878','225','0','2','0','2850','0',''),
('1','bdd','1','228','field','f','4','0','2896','2900','175','2','9','2','2901','0',''),
('1','bdd','1','229','n','f','5','0','2902','2902','228','1','1','1','2903','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','230','chp_php_basedd','c','6','0','2904','2917','229','0','1','0','2903','2918',''),
('1','bdd','1','231','type','f','5','0','2922','2925','228','1','2','1','2926','0',''),
('1','bdd','1','232','TEXT','c','6','0','2927','2930','231','0','1','0','2926','2931',''),
('1','bdd','1','233','add_index','f','2','0','2960','2968','2','4','10','2','2969','0',''),
('1','bdd','1','234','n','f','3','0','2970','2970','233','1','1','1','2971','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','235','tbl_bases_de_donnees','c','4','1','2973','2992','234','0','1','0','2971','0',''),
('1','bdd','1','236','unique','f','3','0','2998','3003','233','0','2','0','3004','0',''),
('1','bdd','1','237','index_name','f','3','0','3009','3018','233','1','3','1','3019','0',''),
('1','bdd','1','238','idx_nom_basedd','c','4','1','3021','3034','237','0','1','0','3019','0',''),
('1','bdd','1','239','fields','f','3','0','3040','3045','233','1','4','1','3046','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','240','chp_nom_basedd','c','4','1','3048','3061','239','0','1','0','3046','0',''),
('1','bdd','1','241','create_table','f','2','0','3073','3084','2','2','11','4','3085','0',''),
('1','bdd','1','242','n','f','3','0','3096','3096','241','1','1','1','3097','0',''),
('1','bdd','1','243','tbl_utilisateurs','c','4','1','3099','3114','242','0','1','0','3097','0',''),
('1','bdd','1','244','fields','f','3','0','3128','3133','241','6','2','3','3134','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','245','#','f','4','0','3148','3148','244','0','1','0','3149','3150',''),
('1','bdd','1','246','field','f','4','0','3165','3169','244','3','2','2','3170','0',''),
('1','bdd','1','247','n','f','5','0','3171','3171','246','1','1','1','3172','0',''),
('1','bdd','1','248','chi_id_utilisateur','c','6','0','3173','3190','247','0','1','0','3172','3191',''),
('1','bdd','1','249','type','f','5','0','3195','3198','246','1','2','1','3199','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','250','INTEGER','c','6','0','3200','3206','249','0','1','0','3199','3207',''),
('1','bdd','1','251','primary_key','f','5','0','3211','3221','246','0','3','0','3222','0',''),
('1','bdd','1','252','field','f','4','0','3239','3243','244','2','3','2','3244','0',''),
('1','bdd','1','253','n','f','5','0','3245','3245','252','1','1','1','3246','0',''),
('1','bdd','1','254','chp_nom_de_connexion_utilisateur','c','6','0','3247','3278','253','0','1','0','3246','3279','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','255','type','f','5','0','3283','3286','252','1','2','1','3287','0',''),
('1','bdd','1','256','STRING','c','6','0','3288','3293','255','0','1','0','3287','3294',''),
('1','bdd','1','257','field','f','4','0','3310','3314','244','2','4','2','3315','0',''),
('1','bdd','1','258','n','f','5','0','3316','3316','257','1','1','1','3317','0',''),
('1','bdd','1','259','chp_mot_de_passe_utilisateur','c','6','0','3318','3345','258','0','1','0','3317','3346','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','260','type','f','5','0','3350','3353','257','1','2','1','3354','0',''),
('1','bdd','1','261','STRING','c','6','0','3355','3360','260','0','1','0','3354','3361',''),
('1','bdd','1','262','field','f','4','0','3377','3381','244','2','5','2','3382','0',''),
('1','bdd','1','263','n','f','5','0','3383','3383','262','1','1','1','3384','0',''),
('1','bdd','1','264','chp_commentaire_utilisateur','c','6','0','3385','3411','263','0','1','0','3384','3412','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','265','type','f','5','0','3416','3419','262','1','2','1','3420','0',''),
('1','bdd','1','266','TEXT','c','6','0','3421','3424','265','0','1','0','3420','3425',''),
('1','bdd','1','267','field','f','4','0','3441','3445','244','2','6','2','3446','0',''),
('1','bdd','1','268','n','f','5','0','3447','3447','267','1','1','1','3448','0',''),
('1','bdd','1','269','chx_id_groupe_connexion_utilisateur','c','6','0','3449','3483','268','0','1','0','3448','3484','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','270','type','f','5','0','3488','3491','267','1','2','1','3492','0',''),
('1','bdd','1','271','INTEGER','c','6','0','3493','3499','270','0','1','0','3492','3500',''),
('1','bdd','1','272','add_index','f','2','0','3529','3537','2','4','12','2','3538','0',''),
('1','bdd','1','273','n','f','3','0','3539','3539','272','1','1','1','3540','0',''),
('1','bdd','1','274','tbl_utilisateurs','c','4','1','3542','3557','273','0','1','0','3540','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','275','unique','f','3','0','3563','3568','272','0','2','0','3569','0',''),
('1','bdd','1','276','index_name','f','3','0','3574','3583','272','1','3','1','3584','0',''),
('1','bdd','1','277','idxNomUtilisateur','c','4','1','3586','3602','276','0','1','0','3584','0',''),
('1','bdd','1','278','fields','f','3','0','3608','3613','272','1','4','1','3614','0',''),
('1','bdd','1','279','chp_nom_de_connexion_utilisateur','c','4','1','3616','3647','278','0','1','0','3614','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','280','create_table','f','2','0','3659','3670','2','2','13','4','3671','0',''),
('1','bdd','1','281','n','f','3','0','3682','3682','280','1','1','1','3683','0',''),
('1','bdd','1','282','tbl_rev','c','4','1','3685','3691','281','0','1','0','3683','0',''),
('1','bdd','1','283','fields','f','3','0','3705','3710','280','18','2','3','3711','0',''),
('1','bdd','1','284','#','f','4','0','3725','3725','283','0','1','0','3726','3727','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','285','field','f','4','0','3742','3746','283','3','2','2','3747','0',''),
('1','bdd','1','286','n','f','5','0','3748','3748','285','1','1','1','3749','0',''),
('1','bdd','1','287','chx_cible_rev','c','6','0','3750','3762','286','0','1','0','3749','3763',''),
('1','bdd','1','288','type','f','5','0','3767','3770','285','1','2','1','3771','0',''),
('1','bdd','1','289','INTEGER','c','6','0','3772','3778','288','0','1','0','3771','3779','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','290','references','f','5','0','3783','3792','285','2','3','1','3793','0',''),
('1','bdd','1','291','tbl_cibles','c','6','1','3795','3804','290','0','1','0','3793','0',''),
('1','bdd','1','292','chi_id_cible','c','6','1','3810','3821','290','0','2','0','3793','0',''),
('1','bdd','1','293','field','f','4','0','3839','3843','283','2','3','2','3844','0',''),
('1','bdd','1','294','n','f','5','0','3845','3845','293','1','1','1','3846','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','295','chp_provenance_rev','c','6','0','3847','3864','294','0','1','0','3846','3865',''),
('1','bdd','1','296','type','f','5','0','3869','3872','293','2','2','1','3873','0',''),
('1','bdd','1','297','CHARACTER','c','6','0','3874','3882','296','0','1','0','0','0',''),
('1','bdd','1','298','32','c','6','0','3886','3887','296','0','2','0','3873','3888',''),
('1','bdd','1','299','field','f','4','0','3904','3908','283','2','4','2','3909','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','300','n','f','5','0','3910','3910','299','1','1','1','3911','0',''),
('1','bdd','1','301','chx_id_provanance_rev','c','6','0','3912','3932','300','0','1','0','3911','3933',''),
('1','bdd','1','302','type','f','5','0','3937','3940','299','1','2','1','3941','0',''),
('1','bdd','1','303','INTEGER','c','6','0','3942','3948','302','0','1','0','3941','3949',''),
('1','bdd','1','304','field','f','4','0','3965','3969','283','2','5','2','3970','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','305','n','f','5','0','3971','3971','304','1','1','1','3972','0',''),
('1','bdd','1','306','chp_id_rev','c','6','0','3973','3982','305','0','1','0','3972','3983',''),
('1','bdd','1','307','type','f','5','0','3987','3990','304','1','2','1','3991','0',''),
('1','bdd','1','308','INTEGER','c','6','0','3992','3998','307','0','1','0','3991','3999',''),
('1','bdd','1','309','field','f','4','0','4015','4019','283','2','6','2','4020','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','310','n','f','5','0','4021','4021','309','1','1','1','4022','0',''),
('1','bdd','1','311','chp_valeur_rev','c','6','0','4023','4036','310','0','1','0','4022','4037',''),
('1','bdd','1','312','type','f','5','0','4041','4044','309','1','2','1','4045','0',''),
('1','bdd','1','313','TEXT','c','6','0','4046','4049','312','0','1','0','4045','4050',''),
('1','bdd','1','314','field','f','4','0','4066','4070','283','2','7','2','4071','0','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','315','n','f','5','0','4072','4072','314','1','1','1','4073','0',''),
('1','bdd','1','316','chp_type_rev','c','6','0','4074','4085','315','0','1','0','4073','4086',''),
('1','bdd','1','317','type','f','5','0','4090','4093','314','2','2','1','4094','0',''),
('1','bdd','1','318','CHARACTER','c','6','0','4095','4103','317','0','1','0','0','0',''),
('1','bdd','1','319','4','c','6','0','4107','4107','317','0','2','0','4094','4108','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','320','field','f','4','0','4124','4128','283','2','8','2','4129','0',''),
('1','bdd','1','321','n','f','5','0','4130','4130','320','1','1','1','4131','0',''),
('1','bdd','1','322','chp_niveau_rev','c','6','0','4132','4145','321','0','1','0','4131','4146',''),
('1','bdd','1','323','type','f','5','0','4150','4153','320','1','2','1','4154','0',''),
('1','bdd','1','324','INTEGER','c','6','0','4155','4161','323','0','1','0','4154','4162','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','325','field','f','4','0','4178','4182','283','2','9','2','4183','0',''),
('1','bdd','1','326','n','f','5','0','4184','4184','325','1','1','1','4185','0',''),
('1','bdd','1','327','chp_quotee_rev','c','6','0','4186','4199','326','0','1','0','4185','4200',''),
('1','bdd','1','328','type','f','5','0','4204','4207','325','1','2','1','4208','0',''),
('1','bdd','1','329','INTEGER','c','6','0','4209','4215','328','0','1','0','4208','4216','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','330','field','f','4','0','4232','4236','283','2','10','2','4237','0',''),
('1','bdd','1','331','n','f','5','0','4238','4238','330','1','1','1','4239','0',''),
('1','bdd','1','332','chp_pos_premier_rev','c','6','0','4240','4258','331','0','1','0','4239','4259',''),
('1','bdd','1','333','type','f','5','0','4263','4266','330','1','2','1','4267','0',''),
('1','bdd','1','334','INTEGER','c','6','0','4268','4274','333','0','1','0','4267','4275','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','335','field','f','4','0','4291','4295','283','2','11','2','4296','0',''),
('1','bdd','1','336','n','f','5','0','4297','4297','335','1','1','1','4298','0',''),
('1','bdd','1','337','chp_pos_dernier_rev','c','6','0','4299','4317','336','0','1','0','4298','4318',''),
('1','bdd','1','338','type','f','5','0','4322','4325','335','1','2','1','4326','0',''),
('1','bdd','1','339','INTEGER','c','6','0','4327','4333','338','0','1','0','4326','4334','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','340','field','f','4','0','4350','4354','283','2','12','2','4355','0',''),
('1','bdd','1','341','n','f','5','0','4356','4356','340','1','1','1','4357','0',''),
('1','bdd','1','342','chp_parent_rev','c','6','0','4358','4371','341','0','1','0','4357','4372',''),
('1','bdd','1','343','type','f','5','0','4376','4379','340','1','2','1','4380','0',''),
('1','bdd','1','344','INTEGER','c','6','0','4381','4387','343','0','1','0','4380','4388','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','345','field','f','4','0','4404','4408','283','2','13','2','4409','0',''),
('1','bdd','1','346','n','f','5','0','4410','4410','345','1','1','1','4411','0',''),
('1','bdd','1','347','chp_nbr_enfants_rev','c','6','0','4412','4430','346','0','1','0','4411','4431',''),
('1','bdd','1','348','type','f','5','0','4435','4438','345','1','2','1','4439','0',''),
('1','bdd','1','349','INTEGER','c','6','0','4440','4446','348','0','1','0','4439','4447','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','350','field','f','4','0','4463','4467','283','2','14','2','4468','0',''),
('1','bdd','1','351','n','f','5','0','4469','4469','350','1','1','1','4470','0',''),
('1','bdd','1','352','chp_num_enfant_rev','c','6','0','4471','4488','351','0','1','0','4470','4489',''),
('1','bdd','1','353','type','f','5','0','4493','4496','350','1','2','1','4497','0',''),
('1','bdd','1','354','INTEGER','c','6','0','4498','4504','353','0','1','0','4497','4505','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','355','field','f','4','0','4521','4525','283','2','15','2','4526','0',''),
('1','bdd','1','356','n','f','5','0','4527','4527','355','1','1','1','4528','0',''),
('1','bdd','1','357','chp_profondeur_rev','c','6','0','4529','4546','356','0','1','0','4528','4547',''),
('1','bdd','1','358','type','f','5','0','4551','4554','355','1','2','1','4555','0',''),
('1','bdd','1','359','INTEGER','c','6','0','4556','4562','358','0','1','0','4555','4563','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','360','field','f','4','0','4579','4583','283','2','16','2','4584','0',''),
('1','bdd','1','361','n','f','5','0','4585','4585','360','1','1','1','4586','0',''),
('1','bdd','1','362','chp_pos_ouver_parenthese_rev','c','6','0','4587','4614','361','0','1','0','4586','4615',''),
('1','bdd','1','363','type','f','5','0','4619','4622','360','1','2','1','4623','0',''),
('1','bdd','1','364','INTEGER','c','6','0','4624','4630','363','0','1','0','4623','4631','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','365','field','f','4','0','4647','4651','283','2','17','2','4652','0',''),
('1','bdd','1','366','n','f','5','0','4653','4653','365','1','1','1','4654','0',''),
('1','bdd','1','367','chp_pos_fermer_parenthese_rev','c','6','0','4655','4683','366','0','1','0','4654','4684',''),
('1','bdd','1','368','type','f','5','0','4688','4691','365','1','2','1','4692','0',''),
('1','bdd','1','369','INTEGER','c','6','0','4693','4699','368','0','1','0','4692','4700','');

INSERT INTO `tbl_rev`( `chx_cible_rev`, `chp_provenance_rev`, `chx_id_provanance_rev`, `chp_id_rev`, `chp_valeur_rev`, `chp_type_rev`, `chp_niveau_rev`, `chp_quotee_rev`, `chp_pos_premier_rev`, `chp_pos_dernier_rev`, `chp_parent_rev`, `chp_nbr_enfants_rev`, `chp_num_enfant_rev`, `chp_profondeur_rev`, `chp_pos_ouver_parenthese_rev`, `chp_pos_fermer_parenthese_rev`, `chp_commentaire_rev`) VALUES
('1','bdd','1','370','field','f','4','0','4716','4720','283','2','18','2','4721','0',''),
('1','bdd','1','371','n','f','5','0','4722','4722','370','1','1','1','4723','0',''),
('1','bdd','1','372','chp_commentaire_rev','c','6','0','4724','4742','371','0','1','0','4723','4743',''),
('1','bdd','1','373','type','f','5','0','4747','4750','370','1','2','1','4751','0',''),
('1','bdd','1','374','TEXT','c','6','0','4752','4755','373','0','1','0','4751','4756','');
