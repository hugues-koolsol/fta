/*



  =========================================================================
  Pour la table tbl_cibles il y a 2 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_cibles`( `chi_id_cible`, `chp_nom_cible`, `chp_commentaire_cible`, `chp_dossier_cible`) VALUES
('1','fta','la racine','fta');
/*



  =========================================================================
  Pour la table tbl_dossiers il y a 17 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_dossiers`( `chi_id_dossier`, `chp_nom_dossier`, `chx_cible_dossier`) VALUES
('1','/','1'),
('2','/fta_inc/db/sqlite','1');
/*



  =========================================================================
  Pour la table tbl_sources il y a 55 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_sources`( `chi_id_source`, `chp_nom_source`, `chp_commentaire_source`, `chx_cible_id_source`, `chx_dossier_id_source`, `chp_rev_source`, `chp_genere_source`, `chp_type_source`) VALUES
('1','test.php','    <span>hello</span>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>

    var a=1;
//</source_javascript_rev>
//]]>
</script>

<?php
$a=1;
?>','1','1','php(
   html(span(''hello'') , javascriptdanshtml((type , ''text/javascript'') , declare(a , 1))),
   affecte($a , 1)
)','    <span>hello</span>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>

    var a=1;
//</source_javascript_rev>
//]]>
</script>

<?php
$a=1;
?>','normal'),
('2','test.js','','1','1','
declare(a , 1)','
var a=1;','normal'),
('3','test.html','','1','1','html((lang,''fr''),
   head(),
   body(''hello'')
)','<html lang="fr">
    <head></head>
    <body>
        hello
    </body>
</html>','normal'),
('4','test.sql','','1','1','
sélectionner(
   valeurs(
      champ(chi_id_source),
      champ(chp_nom_source),
      champ(t1.chp_nom_dossier),
      champ(chp_commentaire_source),
      champ(t0.chx_dossier_id_source),
      champ(t0.chp_type_source),
   )
   ,provenance(
      table_reference(source(nom_table(tbl_sources,T0))),
      jointure_gauche(
         source(nom_table(tbl_dossiers,t1)
         ),contrainte(egal(champ(t1.chi_id_dossier) , champ(t0.chx_dossier_id_source)))),
   )
   ,conditions(
      egal(champ(T0.chx_cible_id_source) , ''1''),
   )
   ,trier_par((champ(T0.chp_nom_source),croissant()),)
   ,limité_à(quantité(10),début(0))
),','SELECT 
chi_id_source , chp_nom_source , `t1`.`chp_nom_dossier` , chp_commentaire_source , `t0`.`chx_dossier_id_source` , `t0`.`chp_type_source`

 FROM tbl_sources T0
 LEFT JOIN tbl_dossiers t1 ON `t1`.`chi_id_dossier`=`t0`.`chx_dossier_id_source`

WHERE `t0`.`chx_cible_id_source`=''1''/* inconnu opérateur "conditions" */
ORDER BY  `t0`.`chp_nom_source` ASC
LIMIT 10 OFFSET 0 ;','normal');
/*



  =========================================================================
  Pour la table tbl_bases_de_donnees il y a 2 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_bases_de_donnees`( `chi_id_basedd`, `chp_nom_basedd`, `chp_rev_basedd`, `chp_commentaire_basedd`, `chx_dossier_id_basedd`, `chp_genere_basedd`, `chx_cible_id_basedd`, `chp_php_basedd`) VALUES
('1','system.db','sql(
   transaction(
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
            field(n(chp_genere_source) , type(TEXT)),
            field(n(chp_type_source) , type(TEXT) , not_null() , default(''normal''))
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
      add_index(n(''tbl_bases_de_donnees'') , unique() , index_name(''idx_nom_basedd'') , fields(''chp_nom_basedd'',''chx_cible_id_basedd'')),
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
      ),
      create_table(
         n(''tbl_utilisateurs''),
         fields(
            #(),
            field(n(chi_id_utilisateur) , type(INTEGER) , primary_key()),
            field(n(chp_nom_de_connexion_utilisateur) , type(STRING)),
            field(n(chp_mot_de_passe_utilisateur) , type(STRING)),
            field(n(chp_commentaire_utilisateur) , type(TEXT))
         )
      ),
      add_index(n(''tbl_utilisateurs'') , unique() , index_name(''idxNomUtilisateur'') , fields(''chp_nom_de_connexion_utilisateur'')),
      create_table(
         n(''tbl_taches''),
         fields(
            #(),
            field(n(chi_id_tache) , type(INTEGER) , primary_key() , not_null()),
            field(n(chx_utilisateur_tache) , type(INTEGER) , references(''tbl_utilisateurss'' , ''chi_id_utilisateur'')),
            field(n(chp_priorite_tache) , type(INTEGER)),
            field(n(chp_texte_tache) , type(TEXT))
         )
      )
   ),
   commit()
)','bla','2','
BEGIN TRANSACTION;
    
    
    
    CREATE TABLE tbl_cibles (
     chi_id_cible INTEGER PRIMARY KEY ,
         chp_nom_cible STRING,
         chp_commentaire_cible STRING,
         chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT  ''xxx'' 
    );
    
    CREATE  UNIQUE INDEX  idx_dossier_cible ON `tbl_cibles`( `chp_dossier_cible` ) ;
    
    
    
    CREATE TABLE tbl_dossiers (
     chi_id_dossier INTEGER PRIMARY KEY ,
         chp_nom_dossier CHARACTER(256) NOT NULL DEFAULT  '''' ,
         chx_cible_dossier INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') 
    );
    
    CREATE  UNIQUE INDEX  idx_cible_et_nom ON `tbl_dossiers`( `chx_cible_dossier` , `chp_nom_dossier` ) ;
    
    
    
    CREATE TABLE tbl_sources (
     chi_id_source INTEGER PRIMARY KEY ,
         chp_nom_source CHARACTER(256) NOT NULL DEFAULT  '''' ,
         chp_commentaire_source TEXT,
         chx_cible_id_source INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
         chx_dossier_id_source INTEGER REFERENCES ''tbl_dossiers''(''chi_id_dossier'') ,
         chp_rev_source TEXT,
         chp_genere_source TEXT,
         chp_type_source TEXT NOT NULL DEFAULT  ''normal'' 
    );
    
    CREATE  UNIQUE INDEX  idx_nom_et_dossier ON `tbl_sources`( `chx_dossier_id_source` , `chp_nom_source` ) ;
    
    
    
    CREATE TABLE tbl_bases_de_donnees (
     chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL,
         chp_nom_basedd TEXT NOT NULL DEFAULT  '''' ,
         chp_rev_basedd TEXT,
         chp_commentaire_basedd TEXT,
         chx_dossier_id_basedd INTEGER DEFAULT  NULL  REFERENCES ''tbl_dossiers''(''chi_id_dossier'') ,
         chp_genere_basedd TEXT,
         chx_cible_id_basedd INTEGER DEFAULT  NULL  REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
         chp_php_basedd TEXT
    );
    
    CREATE  UNIQUE INDEX  idx_nom_basedd ON `tbl_bases_de_donnees`( `chp_nom_basedd` , `chx_cible_id_basedd` ) ;
    
    
    
    CREATE TABLE tbl_rev (
     chx_cible_rev INTEGER REFERENCES ''tbl_cibles''(''chi_id_cible'') ,
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
    
    
    
    CREATE TABLE tbl_utilisateurs (
     chi_id_utilisateur INTEGER PRIMARY KEY ,
         chp_nom_de_connexion_utilisateur STRING,
         chp_mot_de_passe_utilisateur STRING,
         chp_commentaire_utilisateur TEXT
    );
    
    CREATE  UNIQUE INDEX  idxNomUtilisateur ON `tbl_utilisateurs`( `chp_nom_de_connexion_utilisateur` ) ;
    
    
    
    CREATE TABLE tbl_taches (
     chi_id_tache INTEGER PRIMARY KEY  NOT NULL,
         chx_utilisateur_tache INTEGER REFERENCES ''tbl_utilisateurss''(''chi_id_utilisateur'') ,
         chp_priorite_tache INTEGER,
         chp_texte_tache TEXT
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
    
    CREATE TABLE tbl_cibles (
     chi_id_cible INTEGER PRIMARY KEY ,
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
    CREATE  UNIQUE INDEX  idx_dossier_cible ON `tbl_cibles`( `chp_dossier_cible` ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_dossiers (
     chi_id_dossier INTEGER PRIMARY KEY ,
         chp_nom_dossier CHARACTER(256) NOT NULL DEFAULT  \''\'' ,
         chx_cible_dossier INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') 
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idx_cible_et_nom ON `tbl_dossiers`( `chx_cible_dossier` , `chp_nom_dossier` ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_sources (
     chi_id_source INTEGER PRIMARY KEY ,
         chp_nom_source CHARACTER(256) NOT NULL DEFAULT  \''\'' ,
         chp_commentaire_source TEXT,
         chx_cible_id_source INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
         chx_dossier_id_source INTEGER REFERENCES \''tbl_dossiers\''(\''chi_id_dossier\'') ,
         chp_rev_source TEXT,
         chp_genere_source TEXT,
         chp_type_source TEXT NOT NULL DEFAULT  \''normal\'' 
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idx_nom_et_dossier ON `tbl_sources`( `chx_dossier_id_source` , `chp_nom_source` ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_bases_de_donnees (
     chi_id_basedd INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL,
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
    CREATE  UNIQUE INDEX  idx_nom_basedd ON `tbl_bases_de_donnees`( `chp_nom_basedd` , `chx_cible_id_basedd` ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_rev (
     chx_cible_rev INTEGER REFERENCES \''tbl_cibles\''(\''chi_id_cible\'') ,
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
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_utilisateurs (
     chi_id_utilisateur INTEGER PRIMARY KEY ,
         chp_nom_de_connexion_utilisateur STRING,
         chp_mot_de_passe_utilisateur STRING,
         chp_commentaire_utilisateur TEXT
    );
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    CREATE  UNIQUE INDEX  idxNomUtilisateur ON `tbl_utilisateurs`( `chp_nom_de_connexion_utilisateur` ) ;
    
    '';
if((false === $db->exec($chaineSql))){
    echo __FILE__.'' ''.__LINE__.'' __LINE__ = <pre>''.var_export($db->lastErrorMsg(),true).''</pre> <pre>''.var_export($chaineSql,true).''</pre> '' ;
    $uneErreur=true;
}
$chaineSql=''
    
    CREATE TABLE tbl_taches (
     chi_id_tache INTEGER PRIMARY KEY  NOT NULL,
         chx_utilisateur_tache INTEGER REFERENCES \''tbl_utilisateurss\''(\''chi_id_utilisateur\'') ,
         chp_priorite_tache INTEGER,
         chp_texte_tache TEXT
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
$sql=''INSERT INTO `tbl_cibles`(
    `chi_id_cible`                             ,   `chp_nom_cible`                            ,   `chp_commentaire_cible`                    ,   `chp_dossier_cible`                        
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          
)'';

/* ====== */
$sql=''INSERT INTO `tbl_dossiers`(
    `chi_id_dossier`                           ,   `chp_nom_dossier`                          ,   `chx_cible_dossier`                        
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          
)'';

/* ====== */
$sql=''INSERT INTO `tbl_sources`(
    `chi_id_source`                            ,   `chp_nom_source`                           ,   `chp_commentaire_source`                   ,   `chx_cible_id_source`                      ,   `chx_dossier_id_source`                    
,   `chp_rev_source`                           ,   `chp_genere_source`                        ,   `chp_type_source`                          
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          ,\''''.sq0($tab[4]).''\''                          
,\''''.sq0($tab[5]).''\''                          ,\''''.sq0($tab[6]).''\''                          ,\''''.sq0($tab[7]).''\''                          
)'';

/* ====== */
$sql=''INSERT INTO `tbl_bases_de_donnees`(
    `chi_id_basedd`                            ,   `chp_nom_basedd`                           ,   `chp_rev_basedd`                           ,   `chp_commentaire_basedd`                   ,   `chx_dossier_id_basedd`                    
,   `chp_genere_basedd`                        ,   `chx_cible_id_basedd`                      ,   `chp_php_basedd`                           
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          ,\''''.sq0($tab[4]).''\''                          
,\''''.sq0($tab[5]).''\''                          ,\''''.sq0($tab[6]).''\''                          ,\''''.sq0($tab[7]).''\''                          
)'';

/* ====== */
$sql=''INSERT INTO `tbl_rev`(
    `chx_cible_rev`                            ,   `chp_provenance_rev`                       ,   `chx_id_provanance_rev`                    ,   `chp_id_rev`                               ,   `chp_valeur_rev`                           
,   `chp_type_rev`                             ,   `chp_niveau_rev`                           ,   `chp_quotee_rev`                           ,   `chp_pos_premier_rev`                      ,   `chp_pos_dernier_rev`                      
,   `chp_parent_rev`                           ,   `chp_nbr_enfants_rev`                      ,   `chp_num_enfant_rev`                       ,   `chp_profondeur_rev`                       ,   `chp_pos_ouver_parenthese_rev`             
,   `chp_pos_fermer_parenthese_rev`            ,   `chp_commentaire_rev`                      
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          ,\''''.sq0($tab[4]).''\''                          
,\''''.sq0($tab[5]).''\''                          ,\''''.sq0($tab[6]).''\''                          ,\''''.sq0($tab[7]).''\''                          ,\''''.sq0($tab[8]).''\''                          ,\''''.sq0($tab[9]).''\''                          
,\''''.sq0($tab[10]).''\''                         ,\''''.sq0($tab[11]).''\''                         ,\''''.sq0($tab[12]).''\''                         ,\''''.sq0($tab[13]).''\''                         ,\''''.sq0($tab[14]).''\''                         
,\''''.sq0($tab[15]).''\''                         ,\''''.sq0($tab[16]).''\''                         
)'';

/* ====== */
$sql=''INSERT INTO `tbl_utilisateurs`(
    `chi_id_utilisateur`                       ,   `chp_nom_de_connexion_utilisateur`         ,   `chp_mot_de_passe_utilisateur`             ,   `chp_commentaire_utilisateur`              
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          
)'';

/* ====== */
$sql=''INSERT INTO `tbl_taches`(
    `chi_id_tache`                             ,   `chx_utilisateur_tache`                    ,   `chp_priorite_tache`                       ,   `chp_texte_tache`                          
) VALUES (
 \''''.sq0($tab[0]).''\''                          ,\''''.sq0($tab[1]).''\''                          ,\''''.sq0($tab[2]).''\''                          ,\''''.sq0($tab[3]).''\''                          
)'';
');
/*



  =========================================================================
  Pour la table tbl_utilisateurs il y a 1 enregistrement(s) à insérer 
  =========================================================================
*/

INSERT INTO `tbl_utilisateurs`( `chi_id_utilisateur`, `chp_nom_de_connexion_utilisateur`, `chp_mot_de_passe_utilisateur`, `chp_commentaire_utilisateur`) VALUES
('1','admin','$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK','mdp = admin');
