rem Dans ce dossier il y a les bibliothèques composer que j'utilise en php
rem Ce fichier est un .bat pour windows mais pn poeu faire un .sh pour linux en recopiant les lignes çi dessous
rem Voir aussi https://getcomposer.org/
rem ===================================================
rem ==== permet de récupérer l'AST d'un source PHP ====
rem https://github.com/nikic/php-parser
rem ===================================================
composer require nikic/php-parser
rem =========================================================
rem ==== permet de récupérer l'AST d'un source SQL mysql ====
rem https://github.com/phpmyadmin/sql-parser
rem =========================================================
composer require phpmyadmin/sql-parser