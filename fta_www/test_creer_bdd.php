<?php

$db = new SQLite3('../fta_inc/db/sqlite/system.db');

$uneErreur=false;
if((false === $db->exec('BEGIN TRANSACTION'))){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
    $uneErreur=true;
}

if(false===$db->exec(' ALTER TABLE tbl_bases_de_donnees ADD COLUMN chx_cible_id_basedd INTEGER DEFAULT NULL REFERENCES tbl_cibles(chi_id_cible)' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
 $uneErreur=true;
}

if(    $uneErreur===true){
 if((false === $db->exec('ROLLBACK'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
     $uneErreur=true;
 }
}else{
 if((false === $db->exec('COMMIT'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
 }else{
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>Bon travail</pre>' ;
 }
}

exit();
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================

$db = new SQLite3('../fta_inc/db/sqlite/system.db');

$uneErreur=false;
if((false === $db->exec('BEGIN IMMEDIATE TRANSACTION'))){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
    $uneErreur=true;
}




if(false===$db->exec(' ALTER TABLE tbl_bases_de_donnees ADD COLUMN chx_dossier_id_basedd INTEGER DEFAULT NULL REFERENCES tbl_dossiers(chi_id_dossier)' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
 $uneErreur=true;
}


if(    $uneErreur===true){
 if((false === $db->exec('ROLLBACK'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
     $uneErreur=true;
 }
}else{
 if((false === $db->exec('COMMIT'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
 }else{
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>Bon travail</pre>' ;
 }
}



exit();
$db = new SQLite3('../fta_inc/db/sqlite/system.db');

$uneErreur=false;
if((false === $db->exec('BEGIN IMMEDIATE TRANSACTION'))){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
    $uneErreur=true;
}

if((false === $db->exec('
  CREATE TABLE tbl_dossiers (
     chi_id_dossier           INTEGER PRIMARY KEY 
   , chp_nom_dossier          CHARACTER(256) NOT NULL DEFAULT \'\' 
  )
'))){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
}

if(false===$db->exec(' ALTER TABLE tbl_dossiers ADD COLUMN chx_cible_dossier INTEGER REFERENCES tbl_cibles(chi_id_cible) ' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
 $uneErreur=true;
}

if(false===$db->exec(' CREATE UNIQUE INDEX IF NOT EXISTS idx_cible_et_nom ON tbl_dossiers (  chx_cible_dossier , chp_nom_dossier ) ' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
 $uneErreur=true;
}

if(    $uneErreur===true){
 if((false === $db->exec('ROLLBACK'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
     $uneErreur=true;
 }
}else{
 if((false === $db->exec('COMMIT'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
 }else{
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>Bon travail</pre>' ;
 }
}


exit();

//===================================================================================

$db = new SQLite3('../fta_inc/db/sqlite/system.db');


if(false===$db->exec('ALTER TABLE tbl_cibles ADD COLUMN chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT \'xxx\'' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
 $uneErreur=true;
}

exit();

//unlink('../fta_inc/db/sqlite/system.db');
$db = new SQLite3('../fta_inc/db/sqlite/system.db');

$uneErreur=false;
if((false === $db->exec('BEGIN IMMEDIATE TRANSACTION'))){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
    $uneErreur=true;
}

if((false === $db->exec('
  CREATE TABLE tbl_sources (
   chi_id_source                   INTEGER PRIMARY KEY 
   , chp_nom_source                  STRING 
   , chp_chemin_source                  STRING 
   , chp_commentaire_source          STRING 
  )
'))){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
}



if(false===$db->exec(' ALTER TABLE tbl_sources ADD COLUMN chx_cible_id_source INTEGER REFERENCES tbl_cibles(chi_id_cible) ' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
 $uneErreur=true;
}

if(false===$db->exec(' CREATE UNIQUE INDEX IF NOT EXISTS idx_cible_et_nom_source ON tbl_sources (  chx_cible_id_source , chp_nom_source ) ' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
 $uneErreur=true;
}

if(    $uneErreur===true){
 if((false === $db->exec('ROLLBACK'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
     $uneErreur=true;
 }
}else{
 if((false === $db->exec('COMMIT'))){
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
 }else{
     echo __FILE__.' '.__LINE__.' __LINE__ = <pre>Bon travail</pre>' ;
 }
}


/*
========================================================================================================
========================================================================================================
========================================================================================================
*/
exit();
/*
========================================================================================================
========================================================================================================
========================================================================================================
*/

if((false === $db->exec('
  CREATE TABLE tbl_cibles (
   chi_id_cible                   INTEGER PRIMARY KEY 
   , chp_nom_cible                  STRING 
   , chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT \'xxx\'
   , chp_commentaire_cible          STRING 
  )
'))){
    echo __FILE__.' '.__LINE__.' __LINE__ = <pre>'.var_export($db->lastErrorMsg(),true).'</pre>' ;
}
if(false===$db->exec(' CREATE UNIQUE INDEX IF NOT EXISTS idx_nom_cible ON tbl_cibles (  chp_dossier_cible ) ' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}

if(false===$db->exec('
 INSERT INTO tbl_cibles ( chp_nom_cible , chp_dossier_cible , chp_commentaire_cible  ) VALUES '.
 ' ( \'fta\' ,  \'fta\'  , \'la racine\'  )'.
'')
){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}



/*
========================================================================================================
========================================================================================================
========================================================================================================
*/
exit();
/*
========================================================================================================
========================================================================================================
========================================================================================================
*/



if(
 false===$db->exec('
  CREATE TABLE tbl_utilisateurs (
   chi_id_utilisateur                   INTEGER PRIMARY KEY , 
   chp_nom_de_connexion_utilisateur     STRING , 
   chp_mot_de_passe_utilisateur         STRING , 
   chp_commentaire_utilisateur          STRING ,
   chx_id_groupe_connexion_utilisateur  INTEGER 
  )
')
){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}


if(false===$db->exec(' CREATE UNIQUE INDEX IF NOT EXISTS idxNomUtilisateur ON tbl_utilisateurs (  chp_nom_de_connexion_utilisateur ) ' ) ){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}


if(
 false===$db->exec('
  CREATE TABLE tbl_groupes (
   chi_id_groupe                      INTEGER PRIMARY KEY , 
   chp_nom_groupe                     STRING , 
   chp_commentaire_groupe             STRING ,
   chx_id_metier_groupe                  INTEGER 
  )
 '
 )
){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}


if(false===$db->exec('CREATE UNIQUE INDEX IF NOT EXISTS idxNomGroupe ON tbl_groupes (  chp_nom_groupe )')){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}


if(
 false===$db->exec('
  CREATE TABLE tbl_metiers (
   chi_id_metier                      INTEGER PRIMARY KEY , 
   chp_nom_metier                     STRING , 
   chp_commentaire_metier             STRING 
  )
 ')
){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}


if(false===$db->exec('
 CREATE UNIQUE INDEX IF NOT EXISTS idxNomMetier ON tbl_metiers (  chp_nom_metier )
')){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}





error_reporting(0);

if(false===$db->exec('
 INSERT INTO tbl_metiers ( chp_nom_metier , chp_commentaire_metier  ) VALUES '.
 '( \'racine\'          , null  ),'.
 '( \'administrateur\'  , null  ),'.
 '( \'utilisateur\'     , null  )'.
'')
){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}


if(false===$db->exec('
 INSERT INTO tbl_groupes ( chp_nom_groupe , chp_commentaire_groupe , chx_id_metier_groupe  ) VALUES '.
 '( \'racine\'          , null , 1 ),'.
 '( \'administrateur\'  , null , 2 ),'.
 '( \'utilisateur\'     , null , 3 )'.
'')
){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}



if(false===$db->exec('
 INSERT INTO tbl_utilisateurs ( chp_nom_de_connexion_utilisateur , chp_mot_de_passe_utilisateur , chp_commentaire_utilisateur , chx_id_groupe_connexion_utilisateur ) VALUES '.
 '( \'racine\'    , \'$2y$13$dUAUZGDHCX46zSmf7glddOkmFovp2x9om0XcXyTYgBkE8RXHaGXnm\',null , 1 ),'. // '.password_hash("racine"   , PASSWORD_BCRYPT, ["cost" => 13]).'
 '( \'admin\'   , \'$2y$13$511GXb2mv6/lIM8yBiyGte7CNn.rMaTvD0aPNW6BF/GYlmv946RVK\',null , 2 ),'. // '.password_hash("admin"  , PASSWORD_BCRYPT, ["cost" => 13]).'
 '( \'test01\'  , \'$2y$13$//VrAsuroLw4tumXMQR9DueNfmhkZ4Le5W4eY61DaFtZAeEpeYtH2\',null , 3 ),'. // '.password_hash("test01" , PASSWORD_BCRYPT, ["cost" => 13]).'
 '( \'test02\'  , \'$2y$13$.y0AGaqMYuuaaosiQ1jc3epNeXgm8b78ZykGfuc26LXGuF.xgBCzq\',null , 3 ),' . // '.password_hash("test02" , PASSWORD_BCRYPT, ["cost" => 13]).'
 '( \'test03\' , \'\',null , 3 ),' . '( \'test04\' , \'\',null , 3 ),' . '( \'test05\' , \'\',null , 3 ),' . '( \'test06\' , \'\',null , 3 ),' . '( \'test07\' , \'\',null , 3 ),' . '( \'test08\' , \'\',null , 3 ),' . '( \'test09\' , \'\',null , 3 ),' . '( \'test10\' , \'\',null , 3 ),' .
 '( \'test11\' , \'\',null , 3 ),' . '( \'test12\' , \'\',null , 3 ),' . '( \'test13\' , \'\',null , 3 ),' . '( \'test14\' , \'\',null , 3 ),' . '( \'test15\' , \'\',null , 3 ),' . '( \'test16\' , \'\',null , 3 ),' . '( \'test17\' , \'\',null , 3 ),' . '( \'test18\' , \'\',null , 3 ),' . '( \'test19\' , \'\',null , 3 ),' . '( \'test20\' , \'\',null , 3 ),' .
 '( \'test21\' , \'\',null , 3 ),' . '( \'test22\' , \'\',null , 3 ),' . '( \'test23\' , \'\',null , 3 ),' . '( \'test24\' , \'\',null , 3 ),' . '( \'test25\' , \'\',null , 3 ),' . '( \'test26\' , \'\',null , 3 ),' . '( \'test27\' , \'\',null , 3 ),' . '( \'test28\' , \'\',null , 3 ),' . '( \'test29\' , \'\',null , 3 ),' . '( \'test30\' , \'\',null , 3 ),' .
 '( \'test31\' , \'\',null , 3 ),' . '( \'test32\' , \'\',null , 3 ),' . '( \'test33\' , \'\',null , 3 ),' . '( \'test34\' , \'\',null , 3 ),' . '( \'test35\' , \'\',null , 3 ),' . '( \'test36\' , \'\',null , 3 ),' . '( \'test37\' , \'\',null , 3 ),' . '( \'test38\' , \'\',null , 3 ),' . '( \'test39\' , \'\',null , 3 ),' . '( \'test40\' , \'\',null , 3 ),' .
 '( \'test41\' , \'\',null , 3 ),' . '( \'test42\' , \'\',null , 3 ),' . '( \'test43\' , \'\',null , 3 ),' . '( \'test44\' , \'\',null , 3 ),' . '( \'test45\' , \'\',null , 3 ),' . '( \'test46\' , \'\',null , 3 ),' . '( \'test47\' , \'\',null , 3 ),' . '( \'test48\' , \'\',null , 3 ),' . '( \'test49\' , \'\',null , 3 ),' . '( \'test50\' , \'\',null , 3 ),' .
 '( \'test51\' , \'\',null , 3 ),' . '( \'test52\' , \'\',null , 3 ),' . '( \'test53\' , \'\',null , 3 ),' . '( \'test54\' , \'\',null , 3 ),' . '( \'test55\' , \'\',null , 3 ),' . '( \'test56\' , \'\',null , 3 ),' . '( \'test57\' , \'\',null , 3 ),' . '( \'test58\' , \'\',null , 3 ),' . '( \'test59\' , \'\',null , 3 ),' . '( \'test60\' , \'\',null , 3 )' .
'')
){
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; 
}
$queryCount='
 SELECT count(*) as count
 FROM tbl_utilisateurs 
 WHERE chi_id_utilisateur>=0 
';
$countRows=0;
$resultRows = $db->query($queryCount);
while($row = $resultRows->fetchArray(SQLITE3_NUM)) {
    $countRows=$row[0];
}
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $countRows , true ) . '</pre>' ; exit(0);

$stmt = $db->prepare('
 SELECT chi_id_utilisateur, chp_nom_de_connexion_utilisateur , chp_mot_de_passe_utilisateur , chp_commentaire_utilisateur , chx_id_groupe_connexion_utilisateur , chp_nom_groupe , chp_nom_metier
 FROM tbl_utilisateurs T0
    LEFT JOIN tbl_groupes T1 ON T0.chx_id_groupe_connexion_utilisateur = T1.chi_id_groupe 
    LEFT JOIN tbl_metiers T2 ON T1.chx_id_metier_groupe                = T2.chi_id_metier 
 WHERE T0.chi_id_utilisateur>=0 
 LIMIT 4 OFFSET 1;
');

if($stmt!==false){
//  $stmt->bindValue(':id', 0, SQLITE3_INTEGER );
  $result = $stmt->execute();
  $data=array();
  while($arr=$result->fetchArray(SQLITE3_ASSOC))
  {
//   echo __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $arr , true ) . '</pre>' ;
   array_push($data, $arr);
  }
  $stmt->close(); 
  echo __FILE__ . ' ' . __LINE__ . ' $arr = <pre>' . var_export( $data , true ) . '</pre>' ;
}else{
 echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $db->lastErrorMsg() , true ) . '</pre>' ; exit(0);
}

/*
$stmt = $db->prepare('SELECT chp_nom_de_connexion_utilisateur , chp_mot_de_passe_utilisateur FROM tbl_utilisateurs WHERE chi_id_utilisateur>=:id LIMIT 2 OFFSET 0;');
$stmt->bindValue(':id', 0, SQLITE3_INTEGER);
$result = $stmt->execute();
echo var_export($result , true);
*/

/*
$timeTarget = 0.350; // 350 millisecondes

$cost = 10;
do {
    $cost++;
    $start = microtime(true);
    password_hash("test", PASSWORD_BCRYPT, ["cost" => $cost]);
    $end = microtime(true);
} while (($end - $start) < $timeTarget);

echo "Valeur de 'cost' la plus appropriée : " . $cost; // 13 sur ma machine
exit();
*/