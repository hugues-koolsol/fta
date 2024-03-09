
/*constantes FOREIGN_KEY_CHECKS, AUTOCOMMIT*/
set FOREIGN_KEY_CHECKS = 0;
set AUTOCOMMIT = 0;
set NAMES  utf8mb4 COLLATE utf8mb4_unicode_ci;
/*TRANSACTION*/
START TRANSACTION;
    /*
      -- ==========================================================            
      -- SET time_zone = "+00:00";
      -- CREATE DATABASE IF NOT EXISTS `fta1` DEFAULT CHARACTER SET utf8mb4
      --       COLLATE utf8mb4_unicode_ci;
    */
    set time_zone = '+00:00';
    CREATE DATABASE IF NOT EXISTS fta1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    /**/
    /*
      -- ==================================
      -- DROP TABLE IF EXISTS `tbl_user`;
      -- ==================================
    */
    DROP TABLE IF EXISTS fta1.tbl_user;
    /*
      -- =======================================================================
      -- CREATE TABLE IF NOT EXISTS `fta1.tbl_user` (
      --   `fld_field` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      -- ) AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      -- =======================================================================
    */
    CREATE TABLE IF NOT EXISTS fta1.tbl_user (
     fld_id_user BIGINT UNSIGNED NOT NULL,
         fld_email_user VARCHAR(127) NOT NULL DEFAULT  '' ,
         fld_password_user VARCHAR(256) NOT NULL DEFAULT  '' ,
         fld_comment_user TEXT
    )  ENGINE=InnoDB  AUTO_INCREMENT=0  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_unicode_ci;
    /*
      -- ===================================================================
      -- ALTER TABLE `fta1`.`tbl_user` ADD PRIMARY KEY (`fld_id_user`);
      -- ===================================================================
    */
    ALTER TABLE `fta1`.`tbl_user` ADD PRIMARY KEY ( fld_id_user );
    /*
      -- ===================================================================
      -- ALTER TABLE `tbl_user` CHANGE `fld_id_user` `fld_id_user` 
      -- BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;
    */
    ALTER TABLE fta1.tbl_user CHANGE fld_id_user  fld_id_user bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
    /*
      -- ===================================================================
      -- ALTER TABLE `fta1`.`tbl_user` ADD UNIQUE `idx_name` (`fld_email_user`);
      -- ===================================================================
    */
    ALTER TABLE `fta1`.`tbl_user` ADD UNIQUE idx_email ( fld_email_user );
    /**/
    CREATE TABLE IF NOT EXISTS fta1.tbl_source (
     fld_id_source BIGINT UNSIGNED NOT NULL,
         fld_path_source CHAR(185) NOT NULL DEFAULT  '.' ,
         fld_name_source CHAR(64) NOT NULL DEFAULT  '' ,
         fld_text_source LONGTEXT,
         fld_comment_source TEXT
    )  ENGINE=MyIsam  AUTO_INCREMENT=0  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_unicode_ci;
    ALTER TABLE `fta1`.`tbl_source` ADD PRIMARY KEY ( fld_id_source );
    /*
      -- ===================================================================
    */
    ALTER TABLE fta1.tbl_source CHANGE fld_id_source  fld_id_source bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
    /*
      -- ===================================================================
      -- ALTER TABLE `fta1`.`tbl_source` ADD UNIQUE `idx_fullname` (`fld_email_user`);
      -- ===================================================================
    */
    ALTER TABLE `fta1`.`tbl_source` ADD UNIQUE idx_fullname ( fld_path_source , fld_name_source );
    /*A la fin, on remet les clés*/
    set FOREIGN_KEY_CHECKS = 1;
COMMIT;