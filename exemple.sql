SELECT 
'exemple de commande sql' , '  Il y a un outil qui génère un fichier rev à partir d''un fichier sql' , '  Il y a un outil qui génère un fichier sql à partir d''un fichier rev' , `client`.`id` , `client`.`nom` , 
`commande`.`id` , `commande`.`produit` , `commande`.`id_client`
 FROM client client
 LEFT JOIN commande commande ON `commande`.`id_client` = `client`.`id`

WHERE `client`.`id_client` = 1;