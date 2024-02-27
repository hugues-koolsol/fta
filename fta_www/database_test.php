<?php

require_once('aa_include.php');
$src_create_database=<<<EOT
/*constantes FOREIGN_KEY_CHECKS, AUTOCOMMIT*/
set FOREIGN_KEY_CHECKS = 0;
set AUTOCOMMIT = 0;
set NAMES  utf8mb4 COLLATE utf8mb4_unicode_ci;
/*TRANSACTION*/
START TRANSACTION;
/*
              // ==========================================================            
              // SET time_zone = "+00:00";
              // CREATE DATABASE IF NOT EXISTS `ftatest` DEFAULT CHARACTER SET utf8mb4
              //       COLLATE utf8mb4_unicode_ci;
              // USE ftatest;
            */
set time_zone = '+00:00';
CREATE DATABASE IF NOT EXISTS ftatest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use ftatest;
/*
              //==================================
              //DROP TABLE IF EXISTS `tbl_user`;
              //==================================
            */
DROP TABLE IF EXISTS tbl_user;
/*
              //=======================================================================
              // CREATE TABLE IF NOT EXISTS `tbl_user` (
              //   `fld_field` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
              // ) AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              //=======================================================================
            */
CREATE TABLE IF NOT EXISTS tbl_user (
 fld_id_user BIGINT UNSIGNED NOT NULL,
 fld_email_user VARCHAR(128) NOT NULL DEFAULT  '' ,
 fld_password_user VARCHAR(256) NOT NULL DEFAULT  '' ,
 fld_comment_user TEXT
)  ENGINE=InnoDB  AUTO_INCREMENT=0  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_unicode_ci;
/*
              // ===================================================================
              // ALTER TABLE `ftatest`.`tbl_user` ADD PRIMARY KEY (`fld_id_user`);
              // ===================================================================
            */
ALTER TABLE tbl_user ADD PRIMARY KEY ( fld_id_user );
/*
              // ===================================================================
              // ALTER TABLE `tbl_user` CHANGE `fld_id_user` `fld_id_user` 
              // BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;
            */
ALTER TABLE tbl_user CHANGE fld_id_user  fld_id_user bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
/*
              // ===================================================================
              // ALTER TABLE `ftatest`.`tbl_user` ADD UNIQUE `idx_name` (`fld_email_user`);
              // ===================================================================
            */
ALTER TABLE tbl_user ADD UNIQUE idx_email ( fld_email_user );
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
  print('OK CREATE<br />');
  mysqli_close($link);
}else{
  die('KO CREATE<br />');
}
/*
  ===================================================================================
  Réouverture de la connexion 
  il faut attendre 100 ms car mysql n'arrive pas à terminer la transaction asynchrone
  ===================================================================================
*/
usleep(100000);
$link=mysqli_connect($serveur,$utilisateur,$mdp);
if( !($link)){
  die(concat(__LINE__,__FILE__));
}
/*
  ===================================================================================
  ne pas oublier de se remettre en utf8
  ===================================================================================
*/
$setnames=<<<EOT
set NAMES  utf8mb4 COLLATE utf8mb4_unicode_ci;
EOT;
$retourSql=mysqli_query($link,$setnames);
$insertSql=<<<EOT
INSERT INTO ftatest.tbl_user ( fld_id_user , fld_email_user , fld_password_user , fld_comment_user ) VALUES 
 ('1' , 'admin@example.com' , 'admin' , 'user with fld_id_user = 1 is "THE" admin' ) ,
 ('2' , 'usér2@example.com' , 'user2' , NULL ) ,
 ('3' , 'usEr4@example.com' , 'user4' , NULL ) ,
 ('4' , 'us€r3@example.com' , 'user3' , NULL ) ,
 ('5' , 'usEr3@example.com' , 'user3' , NULL )  ;
EOT;
$retourSql=mysqli_query($link,$insertSql);
$testAppelSql=mysqli_errno($link);
if($testAppelSql == 0){
  print('OK INSERT<br />');
}else{
  die('KO INSERT<br />');
}
/*
  //=========================================================
  // requete sur admin / admin
*/
$useremail='admin@example.com';
$userpass='admin';
$selectSql='SELECT fld_id_user , fld_email_user , fld_password_user FROM `ftatest`.`tbl_user` `T0` WHERE `T0`.`fld_email_user` LIKE \''.addslashes($useremail).'\'  AND `T0`.`fld_password_user` LIKE \''.addslashes($userpass).'\'  AND \'toto\' = \'toto\'  AND 0 = 0 ';
$retourSql=mysqli_query($link,$selectSql);
$testAppelSql=mysqli_errno($link);
if($testAppelSql == 0){
  print('OK SELECT<br />');
}else{
  die('KO SELECT<br />');
}
for($row=mysqli_fetch_row($retourSql);($row != NULL);$row=mysqli_fetch_row($retourSql)){
  echo(concat('<br />userid=',$row[0],' , useremail=',$row[1],' , userpassword=',$row[2],'<br />'));
}
/*
  //=========================================================
  // requete sur %user% / %user%
*/
$useremail='%user%';
$userpass='%user%';
$selectSql='SELECT fld_id_user , fld_email_user , fld_password_user FROM `ftatest`.`tbl_user` `T0` WHERE `T0`.`fld_email_user` LIKE \''.addslashes($useremail).'\'  AND `T0`.`fld_password_user` LIKE \''.addslashes($userpass).'\'  AND \'toto\' = \'toto\'  AND 0 = 0 ';
$retourSql=mysqli_query($link,$selectSql);
$testAppelSql=mysqli_errno($link);
if($testAppelSql == 0){
  echo(concat('OK SELECT',$selectSql));
}else{
  die('KO SELECT');
}
for($row=mysqli_fetch_row($retourSql);($row != NULL);$row=mysqli_fetch_row($retourSql)){
  echo(concat('<br />userid=',$row[0],' , useremail=',$row[1],' , userpassword=',$row[2],'<br />'));
}
?>