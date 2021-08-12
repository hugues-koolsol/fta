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
a(
  b( 
    ( c , '/' ) , 
    d( e , f ) 
  )
)
```

Après une analyse de la syntaxe de ce source, on obtient une représentation sous forme de table.

Les données sont : id , nomElement, type, idDuParent, constanteQuotée

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
A partir du format tabulaire, on peut reconstituer le source et réciproquement.

Ainsi, les programmes sources deviennent des données :-)
