<?php
$GLOBALS[BDD][1]=array(
 'id' => 1,
 'nom_bdd' => 'system.db',
 'fournisseur' => 'sqlite',
 'initialisation' => 'attach database "'.INCLUDE_PATH.DIRECTORY_SEPARATOR.'db'.DIRECTORY_SEPARATOR.'sqlite'.DIRECTORY_SEPARATOR.'system.db" as `system.db`;pragma journal_mode=WAL;pragma foreign_keys=ON;',
 'lien' => null,
);
/*
$GLOBALS[BDD][9]=array(
 'id' => 9,
 'nom_bdd' => 'test.db',
 'fournisseur' => 'sqlite',
 'initialisation' => 'attach database "C:\\wamp64\\www\\functToArray\\fta\\fta_inc\db\\sqlite\\test.db" as `test.db`;',
 'lien' => null,
);
*/