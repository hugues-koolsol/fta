Un test pour transformer des fonctions imbriquées en tableau
de façon à écrire des traitements et des données avec une syntaxe
commune.

La syntaxe et les mots clés sont loin d'être complètement définis et en plus, ils sont en français :-).

Un exemple de fichier produisant du html avec du javascript est là :

https://github.com/hugues-koolsol/fta/blob/master/fta_inc/rev/test_factorielle.rev

Le résultat produit est là:

https://github.com/hugues-koolsol/fta/blob/master/fta_www/test_factorielle.html


Brève description : un source est écrit sous ce format
```
#(ceci est un arbre)
a(
  b( 
    ( c , '/' ) , 
    d( e , f ) 
  )
)
```

Après une analyse de la syntaxe de ce source, on obtient une représentation sous forme tabulaire.

Les données sont : 
id , nom , type, niveau , constante quotée, position du premier caractère,
position du dernier caractère, id du parent, nombre d'éléments dans la fonction,
numéro d'élément dans la fonction , profondeur de la fonction
position ouverture parenthèse, position fermeture parenthèse,
commentaire

Les commentaires sont inclus dans la fonction spéciale "#"




```
[
 [0 , "" , "INIT" , -1 , false , 0  , 0  , 0 , 2 , 0 , 0 , 0  , 0  , ""] , 
 [1 , "#" , "f"   , 0  , false , 0  , 0  , 0 , 0 , 1 , 0 , 1  , 0  , "ceci est un arbre"] , 
 [2 , "a" , "f"   , 0  , false , 21 , 21 , 0 , 1 , 2 , 3 , 22 , 69 , ""] , 
 [3 , "b" , "f"   , 1  , false , 26 , 26 , 2 , 2 , 1 , 2 , 27 , 67 , ""] , 
 [4 , ""  , "f"   , 2  , false , 26 , 26 , 3 , 2 , 1 , 1 , 34 , 44 , ""] , 
 [5 , "c" , "c"   , 3  , false , 36 , 36 , 4 , 0 , 1 , 0 , 34 , 0  , ""] , 
 [6 , "/" , "c"   , 3  , true  , 41 , 41 , 4 , 0 , 2 , 0 , 34 , 0  , ""] , 
 [7 , "d" , "f"   , 2  , false , 53 , 53 , 3 , 2 , 2 , 1 , 54 , 62 , ""] , 
 [8 , "e" , "c"   , 3  , false , 56 , 56 , 7 , 0 , 1 , 0 , 54 , 0  , ""] , 
 [9 , "f" , "c"   , 3  , false , 60 , 60 , 7 , 0 , 2 , 0 , 54 , 0  , ""]
]
```

A partir du format tabulaire, on peut reconstituer le source et réciproquement.

Ainsi, les programmes sources deviennent des données qu'on peut traiter informatiquement en ajoutant, supprimant ou modifiant des éléments.

Les règles d'écriture des programmes sont limitées.

1°) Racine

La racine d'un programme ne peut contenir que des fonctions séparées par des virgules et pas de constantes:
```
a(),
b(
 c()
)
```
est légal mais

```
a(),
CeciEstUneErreur,
c(d())

```
Ne l'est pas à cause de la constante "CeciEstUneErreur" qui est à la racine

1°) les commentaires:

La fonction # est une fonction spéciale dont le contenu est un commentaire

```
#( ceci est un commentaire de type ligne),
a(),
b(
 #(
  ceci est un 
  commentaire de 
  type "bloc" 
  aligné à gauche
 )
 c(
  #(#
   ceci 
    est
     un commentaire de type "bloc non aligné"
  )
 )
)
```
Les commentaires de type "ligne" ne contiennent qu'une seule ligne

Les commentaires de type "bloc" sont sur plusieurs lignes, la première  et la dernière ligne sont vierges et le contenu est automatiquement aligné à gauche

Les commentaires de type "bloc non aligné" commencent par un # suivent les règles de commentaires de type bloc mais ne sont pas alignés à gauche



