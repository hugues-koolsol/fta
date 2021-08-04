Un test pour transformer des fonctions imbriquées en tableau
de façon à écrire des traitements et des données avec une syntaxe
commune.

La syntaxe et les mots clés sont loin d'être complètement définis.

un exemple de fichier html contenant aussi du javascript est là :

https://github.com/hugues-koolsol/fta/blob/master/fta_inc/rev/test_factorielle.rev


Un source écrit sous ce format
```
a(
  b( 
    ( c , '/' ) , 
    d( e , f ) 
  )
)
```

Après une analyse de la syntaxe de ce source, on obtient une représentation sous forme de table.

Les .... représentent d'autres données non affichées çi dessous.

```
[
 [0 , ""  ,"INIT" ,-1 ,false ,....],
 [1 , "a" ,"f"    ,0  ,false ,....],
 [2 , "b" ,"f"    ,1  ,false ,....],
 [3 , ""  ,"f"    ,2  ,false ,....],
 [4 , "c" ,"c"    ,3  ,false ,....],
 [5 , "/" ,"c"    ,3  ,true  ,....],
 [6 , "d" ,"f"    ,2  ,false ,....],
 [7 , "e" ,"c"    ,3  ,false ,....],
 [8 , "f" ,"c"    ,3  ,false ,....]
]
```
A partir du format tabulaire, on peut reconstituer le source.

Ainsi, les programmes sources deviennent des données :-)

Dans ces sources , il y a 4 fichiers principaux
* fta_www/js/core.js qui analyse un source et construit un tableau et réciproquement
* fta_www/js/javascript.js qui produit du javascript
* fta_www/js/html.js qui produit du html
* fta_www/js/php.js qui produit du php