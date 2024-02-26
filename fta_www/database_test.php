<?php

require_once('aa_include.php');
$src_create_database=<<<EOT
/*
            // ==========================
            // SET FOREIGN_KEY_CHECKS=0;
            // SET AUTOCOMMIT = 0;
            // START TRANSACTION;
          */
set FOREIGN_KEY_CHECKS = 0;
set AUTOCOMMIT = 0;
START TRANSACTION;
/*
              // ==========================================================            
              // SET time_zone = "+00:00";
              // CREATE DATABASE IF NOT EXISTS `ftatest` DEFAULT CHARACTER SET utf8 
              //       COLLATE utf8_general_ci;
              // USE ftatest;
            */
set time_zone = '+00:00';
CREATE DATABASE IF NOT EXISTS ftatest CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
use ftatest;
/*
              //==================================
              //DROP TABLE IF EXISTS `tbl_user`;
            */
DROP TABLE IF EXISTS tbl_user;
/*
              //=======================================================================
              // CREATE TABLE IF NOT EXISTS `test` (
              //   `fld_field` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
              // ) AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            */
CREATE TABLE IF NOT EXISTS tbl_user (
 fld_id_user BIGINT UNSIGNED NOT NULL,
 fld_name_user VARCHAR(64) NOT NULL DEFAULT  'admin' ,
 fld_password_user VARCHAR(256) NOT NULL DEFAULT  'admin' 
)  ENGINE=InnoDB  AUTO_INCREMENT=0  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_general_ci;
/*
              // ===================================================================
              // ALTER TABLE `ftatest`.`tbl_user` ADD PRIMARY KEY (`fld_id_user`);
            */
ALTER TABLE tbl_user ADD PRIMARY KEY ( fld_id_user );
/*
              // ===================================================================
              // ALTER TABLE `tbl_user` CHANGE `fld_id_user` `fld_id_user` 
              // BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;
            */
ALTER TABLE die CHANGE fld_id_user  fld_id_user bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
/*
              // ===================================================================
              // ALTER TABLE `ftatest`.`tbl_user` ADD UNIQUE `idx_name` (`fld_name_user`);
            */
ALTER TABLE die ADD UNIQUE idx_name ( fld_name_user );
set FOREIGN_KEY_CHECKS = 1;
COMMIT;
EOT;
/*
  // =========
  // connexion
*/
$serveur='localhost:3308';
$utilisateur='admin';
$mdp='admin';
$link=mysqli_connect($serveur,$utilisateur,$mdp);
if( !($link)){
  die(concat(__LINE__,__FILE__));
}
mysqli_set_charset($link,'utf8mb4');
/*
  // =========================================
  // execution de la requête et test de retour
*/
$retourSql=mysqli_multi_query($link,$src_create_database);
$testAppelSql=mysqli_errno($link);
if($testAppelSql == 0){
  print('OK CREATE');
  mysqli_close($link);
}else{
  die('KO CREATE');
}
/*
  ============================================
  Réouverture de la connexion 
  il faut attendre 100 ms car mysql n'arrive pas à terminer la transaction asynchrone
*/
usleep(100000);
$link=mysqli_connect($serveur,$utilisateur,$mdp);
if( !($link)){
  die(concat(__LINE__,__FILE__));
}
$insertSql=<<<EOT
INSERT INTO echo ( fld_id_user , fld_name_user , fld_password_user ) VALUES  ('1' , 'admin' , 'admin' ) , ('2' , 'user2' , 'user2' ) , ('4' , 'user4' , 'user4' ) , ('3' , 'user3' , 'user3' )  ;
EOT;
$retourSql=mysqli_query($link,$insertSql);
$testAppelSql=mysqli_errno($link);
if($testAppelSql == 0){
  print('OK INSERT');
}else{
  die('KO INSERT');
}
/*
  //=========================================================
  // requete sur admin / admin
*/
$username='admin';
$userpass='admin';
$selectSql='SELECT fld_id_user FROM `fta`.`tbl_user` `T0` WHERE `T0`.`fld_name_user` LIKE \''.addslashes($username).'\'  AND `T0`.`fld_password_user` LIKE \''.addslashes($userpass).'\'  AND \'toto\' = \'toto\'  AND 0 = 0 ';
$retourSql=mysqli_query($link,$selectSql);
$testAppelSql=mysqli_errno($link);
if($testAppelSql == 0){
  print('OK SELECT');
}else{
  die('KO SELECT');
}
for($row=mysqli_fetch_row($retourSql);($row != NULL);$row=mysqli_fetch_row($retourSql)){
echo(concat('<br />userid=',$row[0],'<br />'));
}
/*
  //=========================================================
  // requete sur %user% / %user%
*/
$username='%user%';
$userpass='%user%';
$selectSql='SELECT fld_id_user FROM `fta`.`tbl_user` `T0` WHERE `T0`.`fld_name_user` LIKE \''.addslashes($username).'\'  AND `T0`.`fld_password_user` LIKE \''.addslashes($userpass).'\'  AND \'toto\' = \'toto\'  AND 0 = 0 ';
$retourSql=mysqli_query($link,$selectSql);
$testAppelSql=mysqli_errno($link);
if($testAppelSql == 0){
  print('OK SELECT');
}else{
  die('KO SELECT');
}
for($row=mysqli_fetch_row($retourSql);($row != NULL);$row=mysqli_fetch_row($retourSql)){
echo(concat('<br />userid=',$row[0],'<br />'));
}
?>