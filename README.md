Un programme en cours de développement pour transformer des fonctions imbriquées en tableau
de façon à écrire des traitements et des données avec une syntaxe commune.

Les deux types d'éléments de base sont les constantes et les fonctions. 
Ces dernières peuvent contenir des constantes et/ou des fonctions.
Ces dernières peuvent contenir des constantes et/ou des fonctions..
Ces dernières peuvent contenir des constantes et/ou des fonctions... ;-)


La syntaxe et les mots clés sont loin d'être complètement définis et en plus, ils sont en français :-).

Un exemple de fichier produisant du html avec du javascript est là :

https://github.com/hugues-koolsol/fta/blob/master/fta_inc/rev/test_factorielle.rev

Le résultat produit est là:

https://github.com/hugues-koolsol/fta/blob/master/fta_www/test_factorielle.html


**Brève description** : un source est écrit sous ce format
```
#(ceci est un arbre),
a(b((c , '/') , d(e , f))),
#( 
  ceci est exemple concret de source 
  qui produit un source javascript
),
fonction(
   definition(nom(factorielle) , argument(nombre)),
   contenu(
      declare(a , 0),
      declare(b , 0),
      choix(
         si(
            condition((infeg(nombre , 0))),
            alors(affecte(a , 1))
         ),
         sinon(
            alors(
               affecte(
                  b,
                  appelf(n(factorielle) , p(moins(nombre , 1)))
               ),
               affecte(a , mult(nombre , b))
            )
         )
      ),
      revenir(a)
   )
)
```

Après une analyse de la syntaxe de ce source, on obtient une représentation sous forme tabulaire.

Les colonnes des données sont  : 
```
0id                           ,  1nom                          ,  2type        , 3niveau                            ,  4constante quotée                  , 
5position du premier caractère,  6position du dernier caractère,  7id du parent, 8nombre d'éléments dans la fonction,  9numéro d'élément dans la fonction , 
10profondeur de la fonction   , 11position ouverture parenthèse, 12position fermeture parenthèse                    , 13commentaire
```

Les commentaires sont inclus dans la fonction spéciale "#"



```
0       1                2      3     4       5      6       7     8     9    10      11    12    13
[
[0   ,  ""           , "INIT", -1  ,  0  ,    0  ,   0   ,   0  ,  4  ,  0  ,  0  ,    0  ,  0  ,  ""]  ,  
[1   ,  "#"          ,  "f"  ,  0  ,  0  ,    0  ,   0   ,   0  ,  0  ,  1  ,  0  ,    1  , 19  ,  "ceci est un arbre"]  ,  
[2   ,  "a"          ,  "f"  ,  0  ,  0  ,   22  ,   22  ,   0  ,  1  ,  2  ,  3  ,   23  ,  0  ,  ""]  ,  
[3   ,  "b"          ,  "f"  ,  1  ,  0  ,   24  ,   24  ,   2  ,  2  ,  1  ,  2  ,   25  ,  0  ,  ""]  ,  
[4   ,  ""           ,  "f"  ,  2  ,  0  ,   24  ,   24  ,   3  ,  2  ,  1  ,  1  ,   26  ,  0  ,  ""]  ,  
[5   ,  "c"          ,  "c"  ,  3  ,  0  ,   27  ,   27  ,   4  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[6   ,  "/"          ,  "c"  ,  3  ,  1  ,   32  ,   32  ,   4  ,  0  ,  2  ,  0  ,   26  ,  0  ,  ""]  ,  
[7   ,  "d"          ,  "f"  ,  2  ,  0  ,   38  ,   38  ,   3  ,  2  ,  2  ,  1  ,   39  ,  0  ,  ""]  ,  
[8   ,  "e"          ,  "c"  ,  3  ,  0  ,   40  ,   40  ,   7  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[9   ,  "f"          ,  "c"  ,  3  ,  0  ,   44  ,   44  ,   7  ,  0  ,  2  ,  0  ,   39  , 45  ,  ""]  ,  
[10  ,  "#"          ,  "f"  ,  0  ,  0  ,   50  ,   50  ,   0  ,  0  ,  3  ,  0  ,   51  ,129  ,  "\n  ceci est exemple concret de source\n  qui produit un source javascript\n"]  ,  
[11  ,  "fonction"   ,  "f"  ,  0  ,  0  ,  132  ,  139  ,   0  ,  2  ,  4  ,  9  ,  140  ,  0  ,  ""]  ,  
[12  ,  "definition" ,  "f"  ,  1  ,  0  ,  145  ,  154  ,  11  ,  2  ,  1  ,  2  ,  155  ,  0  ,  ""]  ,  
[13  ,  "nom"        ,  "f"  ,  2  ,  0  ,  156  ,  158  ,  12  ,  1  ,  1  ,  1  ,  159  ,  0  ,  ""]  ,  
[14  ,  "factorielle",  "c"  ,  3  ,  0  ,  160  ,  170  ,  13  ,  0  ,  1  ,  0  ,  159  ,171  ,  ""]  ,  
[15  ,  "argument"   ,  "f"  ,  2  ,  0  ,  175  ,  182  ,  12  ,  1  ,  2  ,  1  ,  183  ,  0  ,  ""]  ,  
[16  ,  "nombre"     ,  "c"  ,  3  ,  0  ,  184  ,  189  ,  15  ,  0  ,  1  ,  0  ,  183  ,190  ,  ""]  ,  
[17  ,  "contenu"    ,  "f"  ,  1  ,  0  ,  197  ,  203  ,  11  ,  4  ,  2  ,  8  ,  204  ,  0  ,  ""]  ,  
[18  ,  "declare"    ,  "f"  ,  2  ,  0  ,  212  ,  218  ,  17  ,  2  ,  1  ,  1  ,  219  ,  0  ,  ""]  ,  
[19  ,  "a"          ,  "c"  ,  3  ,  0  ,  220  ,  220  ,  18  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[20  ,  "0"          ,  "c"  ,  3  ,  0  ,  224  ,  224  ,  18  ,  0  ,  2  ,  0  ,  219  ,225  ,  ""]  ,  
[21  ,  "declare"    ,  "f"  ,  2  ,  0  ,  234  ,  240  ,  17  ,  2  ,  2  ,  1  ,  241  ,  0  ,  ""]  ,  
[22  ,  "b"          ,  "c"  ,  3  ,  0  ,  242  ,  242  ,  21  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[23  ,  "0"          ,  "c"  ,  3  ,  0  ,  246  ,  246  ,  21  ,  0  ,  2  ,  0  ,  241  ,247  ,  ""]  ,  
[24  ,  "choix"      ,  "f"  ,  2  ,  0  ,  256  ,  260  ,  17  ,  2  ,  3  ,  7  ,  261  ,  0  ,  ""]  ,  
[25  ,  "si"         ,  "f"  ,  3  ,  0  ,  272  ,  273  ,  24  ,  2  ,  1  ,  4  ,  274  ,  0  ,  ""]  ,  
[26  ,  "condition"  ,  "f"  ,  4  ,  0  ,  288  ,  296  ,  25  ,  1  ,  1  ,  3  ,  297  ,  0  ,  ""]  ,  
[27  ,  ""           ,  "f"  ,  5  ,  0  ,  288  ,  296  ,  26  ,  1  ,  1  ,  2  ,  298  ,  0  ,  ""]  ,  
[28  ,  "infeg"      ,  "f"  ,  6  ,  0  ,  299  ,  303  ,  27  ,  2  ,  1  ,  1  ,  304  ,  0  ,  ""]  ,  
[29  ,  "nombre"     ,  "c"  ,  7  ,  0  ,  305  ,  310  ,  28  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[30  ,  "0"          ,  "c"  ,  7  ,  0  ,  314  ,  314  ,  28  ,  0  ,  2  ,  0  ,  304  ,315  ,  ""]  ,  
[31  ,  "alors"      ,  "f"  ,  4  ,  0  ,  332  ,  336  ,  25  ,  1  ,  2  ,  2  ,  337  ,  0  ,  ""]  ,  
[32  ,  "affecte"    ,  "f"  ,  5  ,  0  ,  338  ,  344  ,  31  ,  2  ,  1  ,  1  ,  345  ,  0  ,  ""]  ,  
[33  ,  "a"          ,  "c"  ,  6  ,  0  ,  346  ,  346  ,  32  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[34  ,  "1"          ,  "c"  ,  6  ,  0  ,  350  ,  350  ,  32  ,  0  ,  2  ,  0  ,  345  ,351  ,  ""]  ,  
[35  ,  "sinon"      ,  "f"  ,  3  ,  0  ,  375  ,  379  ,  24  ,  1  ,  2  ,  6  ,  380  ,  0  ,  ""]  ,  
[36  ,  "alors"      ,  "f"  ,  4  ,  0  ,  394  ,  398  ,  35  ,  2  ,  1  ,  5  ,  399  ,  0  ,  ""]  ,  
[37  ,  "affecte"    ,  "f"  ,  5  ,  0  ,  416  ,  422  ,  36  ,  2  ,  1  ,  4  ,  423  ,  0  ,  ""]  ,  
[38  ,  "b"          ,  "c"  ,  6  ,  0  ,  443  ,  443  ,  37  ,  0  ,  1  ,  0  ,  423  ,  0  ,  ""]  ,  
[39  ,  "appelf"     ,  "f"  ,  6  ,  0  ,  464  ,  469  ,  37  ,  2  ,  2  ,  3  ,  470  ,  0  ,  ""]  ,  
[40  ,  "n"          ,  "f"  ,  7  ,  0  ,  471  ,  471  ,  39  ,  1  ,  1  ,  1  ,  472  ,  0  ,  ""]  ,  
[41  ,  "factorielle",  "c"  ,  8  ,  0  ,  473  ,  483  ,  40  ,  0  ,  1  ,  0  ,  472  ,484  ,  ""]  ,  
[42  ,  "p"          ,  "f"  ,  7  ,  0  ,  488  ,  488  ,  39  ,  1  ,  2  ,  2  ,  489  ,  0  ,  ""]  ,  
[43  ,  "moins"      ,  "f"  ,  8  ,  0  ,  490  ,  494  ,  42  ,  2  ,  1  ,  1  ,  495  ,  0  ,  ""]  ,  
[44  ,  "nombre"     ,  "c"  ,  9  ,  0  ,  496  ,  501  ,  43  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[45  ,  "1"          ,  "c"  ,  9  ,  0  ,  505  ,  505  ,  43  ,  0  ,  2  ,  0  ,  495  ,506  ,  ""]  ,  
[46  ,  "affecte"    ,  "f"  ,  5  ,  0  ,  543  ,  549  ,  36  ,  2  ,  2  ,  2  ,  550  ,  0  ,  ""]  ,  
[47  ,  "a"          ,  "c"  ,  6  ,  0  ,  551  ,  551  ,  46  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[48  ,  "mult"       ,  "f"  ,  6  ,  0  ,  555  ,  558  ,  46  ,  2  ,  2  ,  1  ,  559  ,  0  ,  ""]  ,  
[49  ,  "nombre"     ,  "c"  ,  7  ,  0  ,  560  ,  565  ,  48  ,  0  ,  1  ,  0  ,    0  ,  0  ,  ""]  ,  
[50  ,  "b"          ,  "c"  ,  7  ,  0  ,  569  ,  569  ,  48  ,  0  ,  2  ,  0  ,  559  ,570  ,  ""]  ,  
[51  ,  "revenir"    ,  "f"  ,  2  ,  0  ,  613  ,  619  ,  17  ,  1  ,  4  ,  1  ,  620  ,  0  ,  ""]  ,  
[52  ,  "a"          ,  "c"  ,  3  ,  0  ,  621  ,  621  ,  51  ,  0  ,  1  ,  0  ,  620  ,622  ,  ""]
]

```


A partir du format tabulaire ( c'est en réalité un "arbre syntaxique" ), on peut reconstituer le source et réciproquement.

Ainsi, les programmes sources deviennent des données qu'on peut traiter informatiquement en ajoutant, supprimant ou modifiant des éléments.

**Les règles d'écriture** des programmes sont limitées.

**1°) Racine**

La racine d'un programme ne peut contenir que des fonctions séparées par des virgules et pas de constantes:
Les fonctions peuvent être imbriquées
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

**2°) les constantes:**
elles peuvent être 
entre guillemets,  
entre apostrophes, 
entre apostrophes inversées,
entre signe division (/)
ou bien dans aucun des cas çi-dessus, typiquement pour les variables ou bien les valeurs numériques 


**3°) les commentaires:**

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
ne l'est pas.



**4°) les sources produits**  sont en :

- html ( peut contenir du javascript )

- javascript

- php ( peut contenir du html donc du javascript )

- sql



