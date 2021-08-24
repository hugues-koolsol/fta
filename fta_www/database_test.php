<?php
$src_create_database=<<<EOT
set FOREIGN_KEY_CHECKS = 0;
set AUTOCOMMIT = 0;
START TRANSACTION;
set time_zone = '+00:00';
CREATE DATABASE IF NOT EXISTS `fta` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
use `fta`;
DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE IF NOT EXISTS `tbl_user` (
 `fld_id_user` BIGINT UNSIGNED NOT NULL,
 `fld_name_user` VARCHAR(64) NOT NULL DEFAULT  'TODO' 
);
COMMIT;
EOT;

// connexion
// $link = mysqli_connect($v1['server'],$v1['user'],$v1['password'],$v1['dbname']);

$serveur='localhost:3308';
$utilisateur='admin';
$mdp='admin';
$link=mysqli_connect($serveur,$utilisateur,$mdp);
if( !($link)){
   die(concat(__LINE__,__FILE__));
}
mysqli_set_charset($link,'utf8mb4');
$retourSql=mysqli_multi_query($link,$src_create_database);
?>