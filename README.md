Un test pour transformer des fonctions imbriquées en tableau
de façon à écrire des traitements et des données avec une syntaxe
commune.

La syntaxe et les mots clés sont loin d'être complètement définis et en plus, ils sont en français :-).

Un exemple de fichier produisant du html avec du javascript est là :

https://github.com/hugues-koolsol/fta/blob/master/fta_inc/rev/test_factorielle.rev

Le résultat produit est là:

https://github.com/hugues-koolsol/fta/blob/master/fta_www/test_factorielle.html


**Brève description** : un source est écrit sous ce format
```
#(ceci est un arbre)
a(
  b( 
    ( c , '/' ) , 
    d( e , f ) 
  )
),
#(

  ceci est exemple concret de source 
  qui produit un source javascript
)
fonction(
   definition(
      nom(factorielle) , 
      argument(nombre)
   ),
   contenu(
      declare(a , 0),
      declare(b , 0),
      choix(
         si(
            condition((egal(nombre , 0))),
            alors(affecte(a , 1))
         ),
         sinon(
            alors(
               affecte(
                  b , 
                  appelf(
                     n(factorielle) , 
                     p(nombre-1)
                  )
               ),
               affecte(a , nombre*b)
            )
         )
      ),
      revenir(a)
   )
)
```

Après une analyse de la syntaxe de ce source, on obtient une représentation sous forme tabulaire.

Les colonnes des données sont : 
```
0id                           ,  1nom                          ,  2type        , 3niveau                            ,  4constante quotée                  , 
5position du premier caractère,  6position du dernier caractère,  7id du parent, 8nombre d'éléments dans la fonction,  9numéro d'élément dans la fonction , 
10profondeur de la fonction   , 11position ouverture parenthèse, 12position fermeture parenthèse                    , 13commentaire
```

Les commentaires sont inclus dans la fonction spéciale "#"


```
  0    1                2       3    4        5     6    7   8   9  10   11    12    13
[
 [0  , ""            , "INIT" , -1, false ,   0 ,   0 ,  0 , 4 , 0 , 0 , 0   , 0   , ""] , 
 [1  , "#"           , "f"    , 0 , false ,   0 ,   0 ,  0 , 0 , 1 , 0 , 1   , 19  , "ceci est un arbre"] , 
 [2  , "a"           , "f"    , 0 , false ,  21 ,  21 ,  0 , 1 , 2 , 3 , 22  , 69  , ""] , 
 [3  , "b"           , "f"    , 1 , false ,  26 ,  26 ,  2 , 2 , 1 , 2 , 27  , 67  , ""] , 
 [4  , ""            , "f"    , 2 , false ,  26 ,  26 ,  3 , 2 , 1 , 1 , 34  , 44  , ""] , 
 [5  , "c"           , "c"    , 3 , false ,  36 ,  36 ,  4 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [6  , "/"           , "c"    , 3 , true  ,  41 ,  41 ,  4 , 0 , 2 , 0 , 34  , 19  , ""] , 
 [7  , "d"           , "f"    , 2 , false ,  53 ,  53 ,  3 , 2 , 2 , 1 , 54  , 62  , ""] , 
 [8  , "e"           , "c"    , 3 , false ,  56 ,  56 ,  7 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [9  , "f"           , "c"    , 3 , false ,  60 ,  60 ,  7 , 0 , 2 , 0 , 0   , 0   , ""] , 
 [10 , "#"           , "f"    , 0 , false ,  72 ,  72 ,  0 , 0 , 3 , 0 , 73  , 149 , "\n\n  ceci est exemple concret de source \n  qui produit un source javascript\n"] , 
 [11 , "fonction"    , "f"    , 0 , false , 151 , 158 ,  0 , 2 , 4 , 8 , 159 , 713 , ""] , 
 [12 , "definition"  , "f"    , 1 , false , 164 , 173 , 11 , 2 , 1 , 2 , 174 , 228 , ""] , 
 [13 , "nom"         , "f"    , 2 , false , 182 , 184 , 12 , 1 , 1 , 1 , 185 , 197 , ""] , 
 [14 , "factorielle" , "c"    , 3 , false , 186 , 196 , 13 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [15 , "argument"    , "f"    , 2 , false , 208 , 215 , 12 , 1 , 2 , 1 , 216 , 223 , ""] , 
 [16 , "nombre"      , "c"    , 3 , false , 217 , 222 , 15 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [17 , "contenu"     , "f"    , 1 , false , 234 , 240 , 11 , 4 , 2 , 7 , 241 , 711 , ""] , 
 [18 , "declare"     , "f"    , 2 , false , 249 , 255 , 17 , 2 , 1 , 1 , 256 , 262 , ""] , 
 [19 , "a"           , "c"    , 3 , false , 257 , 257 , 18 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [20 , "0"           , "c"    , 3 , false , 261 , 261 , 18 , 0 , 2 , 0 , 0   , 0   , ""] , 
 [21 , "declare"     , "f"    , 2 , false , 271 , 277 , 17 , 2 , 2 , 1 , 278 , 284 , ""] , 
 [22 , "b"           , "c"    , 3 , false , 279 , 279 , 21 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [23 , "0"           , "c"    , 3 , false , 283 , 283 , 21 , 0 , 2 , 0 , 0   , 0   , ""] , 
 [24 , "choix"       , "f"    , 2 , false , 293 , 297 , 17 , 2 , 3 , 6 , 298 , 688 , ""] , 
 [25 , "si"          , "f"    , 3 , false , 309 , 310 , 24 , 2 , 1 , 4 , 311 , 399 , ""] , 
 [26 , "condition"   , "f"    , 4 , false , 325 , 333 , 25 , 1 , 1 , 3 , 334 , 353 , ""] , 
 [27 , ""            , "f"    , 5 , false , 325 , 333 , 26 , 1 , 1 , 2 , 335 , 352 , ""] , 
 [28 , "egal"        , "f"    , 6 , false , 336 , 339 , 27 , 2 , 1 , 1 , 340 , 351 , ""] , 
 [29 , "nombre"      , "c"    , 7 , false , 341 , 346 , 28 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [30 , "0"           , "c"    , 7 , false , 350 , 350 , 28 , 0 , 2 , 0 , 0   , 0   , ""] , 
 [31 , "alors"       , "f"    , 4 , false , 368 , 372 , 25 , 1 , 2 , 2 , 373 , 388 , ""] , 
 [32 , "affecte"     , "f"    , 5 , false , 374 , 380 , 31 , 2 , 1 , 1 , 381 , 387 , ""] , 
 [33 , "a"           , "c"    , 6 , false , 382 , 382 , 32 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [34 , "1"           , "c"    , 6 , false , 386 , 386 , 32 , 0 , 2 , 0 , 0   , 0   , ""] , 
 [35 , "sinon"       , "f"    , 3 , false , 411 , 415 , 24 , 1 , 2 , 5 , 416 , 680 , ""] , 
 [36 , "alors"       , "f"    , 4 , false , 430 , 434 , 35 , 2 , 1 , 4 , 435 , 669 , ""] , 
 [37 , "affecte"     , "f"    , 5 , false , 452 , 458 , 36 , 2 , 1 , 3 , 459 , 617 , ""] , 
 [38 , "b"           , "c"    , 6 , false , 479 , 479 , 37 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [39 , "appelf"      , "f"    , 6 , false , 502 , 507 , 37 , 2 , 2 , 2 , 508 , 600 , ""] , 
 [40 , "n"           , "f"    , 7 , false , 531 , 531 , 39 , 1 , 1 , 1 , 532 , 544 , ""] , 
 [41 , "factorielle" , "c"    , 8 , false , 533 , 543 , 40 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [42 , "p"           , "f"    , 7 , false , 570 , 570 , 39 , 1 , 2 , 1 , 571 , 580 , ""] , 
 [43 , "nombre-1"    , "c"    , 8 , false , 572 , 579 , 42 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [44 , "affecte"     , "f"    , 5 , false , 635 , 641 , 36 , 2 , 2 , 1 , 642 , 655 , ""] , 
 [45 , "a"           , "c"    , 6 , false , 643 , 643 , 44 , 0 , 1 , 0 , 0   , 0   , ""] , 
 [46 , "nombre*b"    , "c"    , 6 , false , 647 , 654 , 44 , 0 , 2 , 0 , 0   , 0   , ""] , 
 [47 , "revenir"     , "f"    , 2 , false , 697 , 703 , 17 , 1 , 4 , 1 , 704 , 706 , ""] , 
 [48 , "a"           , "c"    , 3 , false , 705 , 705 , 47 , 0 , 1 , 0 , 0   , 0   , ""]
]

```


A partir du format tabulaire, on peut reconstituer le source et réciproquement.

Ainsi, les programmes sources deviennent des données qu'on peut traiter informatiquement en ajoutant, supprimant ou modifiant des éléments.

**Les règles d'écriture** des programmes sont limitées.

**1°) Racine**

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

**2°) les commentaires:**

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
ils sont de 3 types :

- "ligne" ne contiennent qu'une seule ligne

- "bloc" sont sur plusieurs lignes, la première  et la dernière ligne sont vierges et le contenu est automatiquement aligné à gauche

- "bloc non aligné" commencent par un # suivent les règles de commentaires de type bloc mais ne sont pas alignés à gauche



Si il existe des parenthèses dans un commentaire alors elles doivent être correspondantes :

```
 #( a() , b( c , d() ) )
```
est valide


alors que
```
 #( a() , b( c , d(x ) )
```
ne l'est pas.```



**3°) les sources produits**  sont en :

- php ( peut contenir du html donc du javascript )

- javascript

- html ( peut contenir du javascript )

- sql



