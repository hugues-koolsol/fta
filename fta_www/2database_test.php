<?php

if( !((true == true) && true == true) && (true == true)){
    $a=1;
}else if((true)){
    $a=1;
}else{
    $a=1;
}
$username='admin';
$userpass='admin';
$selectSql='SELECT fld_id_user , fld_email_user , fld_password_user FROM `ftatest`.`tbl_user` `T0` WHERE `T0`.`fld_email_user` LIKE \''.addslashes($username).'\'  AND `T0`.`fld_password_user` LIKE \''.addslashes($userpass).'\'  AND \'toto\' = \'toto\'  AND 0 = 0 ';
$contenuhtml=<<<EOT
    <div id="toto">
        hello
    </div>

EOT;
/*test2*/
$src_create_database=<<<EOT
START TRANSACTION;
    CREATE TABLE tbl_user (
     fld_id_user BIGINT UNSIGNED NOT NULL
    );
COMMIT;
EOT;
$max=count($tab);
for($i=0;$i < $max;$i=$i+1){
    /*dans la boucle*/
    $a=1;
}
/*fin boucle, suite du source*/
/*finchoix suite du source*/
$apresChoix=1;?>

    <div id="toto">
        hello
    </div>
<?php


$a=1;
?>