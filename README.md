
**Introduction**

L'idée est de mettre en place une structure qui permet de considérer que **les programmes sont des données**.

le programme en cours de développement transforme des fonctions imbriquées en tableau
de façon à écrire des traitements ( c'est à dire les programmes ) et des données avec **une syntaxe commune appelée "rev"**.



Il faut que cette structure soit écrite avec elle même.

Comme il n'existe pas encore de compilateur, on s'appuie sur les langages html, css, javascript, sql et php.

Les programmes écrits dans ces ces langages sont traduits en rev et puis retraduits dans leur langage.



**Principe général du format rev**

Il n'y a que deux types d'éléments de base :   
- les constantes   
- les fonctions avec ou sans arguments.   
Les arguments peuvent être des constantes et/ou des fonctions.  
   

Les constantes sont sous deux formats :
- sans délimiteurs : typiquement les noms de variables, les constantes des langages...   
- avec délimiteurs : ' (apostrophe) , " (guillemet) , / (divisé pour les regex ) , ` ( apostrophe inversé ) 

Les éléments sont séparés par des virgules.

La syntaxe et les mots clés sont loin d'être complètement définis et en plus, ils sont en français.

Un exemple de fichier produisant du html contenant du javascript à partir d'un fichier rev est là :  
[Format rev source]((https://github.com/hugues-koolsol/fta/blob/master/fta_inc/rev/test_factorielle.rev)  
[Format html produit]https://github.com/hugues-koolsol/fta/blob/master/fta_www/test_factorielle.html)



Un exemple de fichier produisant du php contenant du html et du javascript à partir d'un fichier rev est là :  
[Format rev source](https://github.com/hugues-koolsol/fta/blob/master/fta_www/aa_login.rev)  
[Format php produit](https://github.com/hugues-koolsol/fta/blob/master/fta_www/aa_login.php)




**Brève description** : un source est écrit sous ce format "rev" ( comme réversible ;-)
```
#(😊ceci est un arbre),
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
#(
  =====================================================================================================================
  exemple déclaration de variable x contenant la fonction de remplacement de a par b
  dans la chaine "a a" à la sauce javascript : var x= /* */ "a a".replace(/a/g,'b')
),
declare(
   x,
   #(  ),
   appelf( element( "a a" ) , nomf(replace) , p( /a/g ) , p( 'b' ))
)
```

Après une analyse de la syntaxe de ce source, on obtient une représentation sous forme tabulaire.

Les colonnes des données sont  : 
```
 0 id                            ,  1 nom                          ,  2 type         , 3 niveau                             ,  4 constante quotée                  , 
 5 position du premier caractère ,  6 position du dernier caractère,  7 id du parent , 8 nombre d'éléments dans la fonction ,  9 numéro d'élément dans la fonction , 
10 profondeur de la fonction     , 11 position ouverture parenthèse, 12 indice du prochain enfant ou indice max  , 13 commentaire ou drapeau de regex
```

Les commentaires sont inclus dans la fonction spéciale "#"

```
0       1                2      3   4     5      6     7   8   9  10     11   12  13
[
 [ 0 , ""            , "__I" , -1, 0 ,    0 ,    0 ,  0 , 6 , 0 , 0 ,    0 ,  0 , ""] , 
 [ 1 , "#"           ,  "f"   , 0 , 0 ,    0 ,    0 ,  0 , 0 , 1 , 0 ,    1 ,  2 , "😊ceci est un arbre"] , 
 [ 2 , "a"           ,  "f"   , 0 , 0 ,   23 ,   23 ,  0 , 1 , 2 , 3 ,   25 , 10 , ""] , 
 [ 3 , "b"           ,  "f"   , 1 , 0 ,   25 ,   25 ,  2 , 2 , 1 , 2 ,   27 , 66 , ""] , 
 [ 4 , ""            ,  "f"   , 2 , 0 ,   25 ,   25 ,  3 , 2 , 1 , 1 ,   28 ,  7 , ""] , 
 [ 5 , "c"           ,  "c"   , 3 , 0 ,   28 ,   28 ,  4 , 0 , 1 , 0 ,    0 ,  6 , ""] , 
 [ 6 , "/"           ,  "c"   , 3 , 1 ,   33 ,   33 ,  4 , 0 , 2 , 0 ,   28 , 66 , ""] , 
 [ 7 , "d"           ,  "f"   , 2 , 0 ,   39 ,   39 ,  3 , 2 , 2 , 1 ,   41 , 66 , ""] , 
 [ 8 , "e"           ,  "c"   , 3 , 0 ,   41 ,   41 ,  7 , 0 , 1 , 0 ,    0 ,  9 , ""] , 
 [ 9 , "f"           ,  "c"   , 3 , 0 ,   45 ,   45 ,  7 , 0 , 2 , 0 ,   41 , 66 , ""] , 
 [10 , "#"           ,  "f"   , 0 , 0 ,   51 ,   51 ,  0 , 0 , 3 , 0 ,   53 , 11 , "\n  ceci est exemple concret de source\n  qui produit un source javascript\n"] , 
 [11 , "fonction"    ,  "f"   , 0 , 0 ,  129 ,  136 ,  0 , 2 , 4 , 9 ,  138 , 53 , ""] , 
 [12 , "definition"  ,  "f"   , 1 , 0 ,  142 ,  151 , 11 , 2 , 1 , 2 ,  153 , 17 , ""] , 
 [13 , "nom"         ,  "f"   , 2 , 0 ,  153 ,  155 , 12 , 1 , 1 , 1 ,  157 , 15 , ""] , 
 [14 , "factorielle" ,  "c"   , 3 , 0 ,  157 ,  167 , 13 , 0 , 1 , 0 ,  157 , 66 , ""] , 
 [15 , "argument"    ,  "f"   , 2 , 0 ,  172 ,  179 , 12 , 1 , 2 , 1 ,  181 , 66 , ""] , 
 [16 , "nombre"      ,  "c"   , 3 , 0 ,  181 ,  186 , 15 , 0 , 1 , 0 ,  181 , 66 , ""] , 
 [17 , "contenu"     ,  "f"   , 1 , 0 ,  194 ,  200 , 11 , 4 , 2 , 8 ,  202 , 66 , ""] , 
 [18 , "declare"     ,  "f"   , 2 , 0 ,  209 ,  215 , 17 , 2 , 1 , 1 ,  217 , 21 , ""] , 
 [19 , "a"           ,  "c"   , 3 , 0 ,  217 ,  217 , 18 , 0 , 1 , 0 ,    0 , 20 , ""] , 
 [20 , "0"           ,  "c"   , 3 , 0 ,  221 ,  221 , 18 , 0 , 2 , 0 ,  217 , 66 , ""] , 
 [21 , "declare"     ,  "f"   , 2 , 0 ,  231 ,  237 , 17 , 2 , 2 , 1 ,  239 , 24 , ""] , 
 [22 , "b"           ,  "c"   , 3 , 0 ,  239 ,  239 , 21 , 0 , 1 , 0 ,    0 , 23 , ""] , 
 [23 , "0"           ,  "c"   , 3 , 0 ,  243 ,  243 , 21 , 0 , 2 , 0 ,  239 , 66 , ""] , 
 [24 , "choix"       ,  "f"   , 2 , 0 ,  253 ,  257 , 17 , 2 , 3 , 7 ,  259 , 51 , ""] , 
 [25 , "si"          ,  "f"   , 3 , 0 ,  269 ,  270 , 24 , 2 , 1 , 4 ,  272 , 35 , ""] , 
 [26 , "condition"   ,  "f"   , 4 , 0 ,  285 ,  293 , 25 , 1 , 1 , 3 ,  295 , 31 , ""] , 
 [27 , ""            ,  "f"   , 5 , 0 ,  285 ,  293 , 26 , 1 , 1 , 2 ,  296 , 66 , ""] , 
 [28 , "infeg"       ,  "f"   , 6 , 0 ,  296 ,  300 , 27 , 2 , 1 , 1 ,  302 , 66 , ""] , 
 [29 , "nombre"      ,  "c"   , 7 , 0 ,  302 ,  307 , 28 , 0 , 1 , 0 ,    0 , 30 , ""] , 
 [30 , "0"           ,  "c"   , 7 , 0 ,  311 ,  311 , 28 , 0 , 2 , 0 ,  302 , 66 , ""] , 
 [31 , "alors"       ,  "f"   , 4 , 0 ,  329 ,  333 , 25 , 1 , 2 , 2 ,  335 , 66 , ""] , 
 [32 , "affecte"     ,  "f"   , 5 , 0 ,  335 ,  341 , 31 , 2 , 1 , 1 ,  343 , 66 , ""] , 
 [33 , "a"           ,  "c"   , 6 , 0 ,  343 ,  343 , 32 , 0 , 1 , 0 ,    0 , 34 , ""] , 
 [34 , "1"           ,  "c"   , 6 , 0 ,  347 ,  347 , 32 , 0 , 2 , 0 ,  343 , 66 , ""] , 
 [35 , "sinon"       ,  "f"   , 3 , 0 ,  372 ,  376 , 24 , 1 , 2 , 6 ,  378 , 66 , ""] , 
 [36 , "alors"       ,  "f"   , 4 , 0 ,  391 ,  395 , 35 , 2 , 1 , 5 ,  397 , 66 , ""] , 
 [37 , "affecte"     ,  "f"   , 5 , 0 ,  413 ,  419 , 36 , 2 , 1 , 4 ,  421 , 46 , ""] , 
 [38 , "b"           ,  "c"   , 6 , 0 ,  440 ,  440 , 37 , 0 , 1 , 0 ,  421 , 39 , ""] , 
 [39 , "appelf"      ,  "f"   , 6 , 0 ,  461 ,  466 , 37 , 2 , 2 , 3 ,  468 , 66 , ""] , 
 [40 , "n"           ,  "f"   , 7 , 0 ,  468 ,  468 , 39 , 1 , 1 , 1 ,  470 , 42 , ""] , 
 [41 , "factorielle" ,  "c"   , 8 , 0 ,  470 ,  480 , 40 , 0 , 1 , 0 ,  470 , 66 , ""] , 
 [42 , "p"           ,  "f"   , 7 , 0 ,  485 ,  485 , 39 , 1 , 2 , 2 ,  487 , 66 , ""] , 
 [43 , "moins"       ,  "f"   , 8 , 0 ,  487 ,  491 , 42 , 2 , 1 , 1 ,  493 , 66 , ""] , 
 [44 , "nombre"      ,  "c"   , 9 , 0 ,  493 ,  498 , 43 , 0 , 1 , 0 ,    0 , 45 , ""] , 
 [45 , "1"           ,  "c"   , 9 , 0 ,  502 ,  502 , 43 , 0 , 2 , 0 ,  493 , 66 , ""] , 
 [46 , "affecte"     ,  "f"   , 5 , 0 ,  540 ,  546 , 36 , 2 , 2 , 2 ,  548 , 66 , ""] , 
 [47 , "a"           ,  "c"   , 6 , 0 ,  548 ,  548 , 46 , 0 , 1 , 0 ,    0 , 48 , ""] , 
 [48 , "mult"        ,  "f"   , 6 , 0 ,  552 ,  555 , 46 , 2 , 2 , 1 ,  557 , 66 , ""] , 
 [49 , "nombre"      ,  "c"   , 7 , 0 ,  557 ,  562 , 48 , 0 , 1 , 0 ,    0 , 50 , ""] , 
 [50 , "b"           ,  "c"   , 7 , 0 ,  566 ,  566 , 48 , 0 , 2 , 0 ,  557 , 66 , ""] , 
 [51 , "revenir"     ,  "f"   , 2 , 0 ,  610 ,  616 , 17 , 1 , 4 , 1 ,  618 , 66 , ""] , 
 [52 , "a"           ,  "c"   , 3 , 0 ,  618 ,  618 , 51 , 0 , 1 , 0 ,  618 , 66 , ""] , 
 [53 , "#"           ,  "f"   , 0 , 0 ,  628 ,  628 ,  0 , 0 , 5 , 0 ,  630 , 54 , "\n  =====================================================================================================================\n  exemple déclaration de variable x contenant la fonction de remplacement de a par b\n  dans la chaine \"a a\" à la sauce javascript : var x= /* */ \"a a\".replace(/a/g , 'b')\n"] , 
 [54 , "declare"     ,  "f"   , 0 , 0 ,  923 ,  929 ,  0 , 3 , 6 , 3 ,  931 , 66 , ""] , 
 [55 , "x"           ,  "c"   , 1 , 0 ,  935 ,  935 , 54 , 0 , 1 , 0 ,  931 , 56 , ""] , 
 [56 , "#"           ,  "f"   , 1 , 0 ,  941 ,  941 , 54 , 0 , 2 , 0 ,  943 , 57 , "  "] , 
 [57 , "appelf"      ,  "f"   , 1 , 0 ,  951 ,  956 , 54 , 4 , 3 , 2 ,  958 , 66 , ""] , 
 [58 , "element"     ,  "f"   , 2 , 0 ,  959 ,  965 , 57 , 1 , 1 , 1 ,  967 , 60 , ""] , 
 [59 , "a a"         ,  "c"   , 3 , 3 ,  969 ,  971 , 58 , 0 , 1 , 0 ,  967 , 66 , ""] , 
 [60 , "nomf"        ,  "f"   , 2 , 0 ,  978 ,  981 , 57 , 1 , 2 , 1 ,  983 , 62 , ""] , 
 [61 , "replace"     ,  "c"   , 3 , 0 ,  983 ,  989 , 60 , 0 , 1 , 0 ,  983 , 66 , ""] , 
 [62 , "p"           ,  "f"   , 2 , 0 ,  994 ,  994 , 57 , 1 , 3 , 1 ,  996 , 64 , ""] , 
 [63 , "a"           ,  "c"   , 3 , 4 ,  998 , 1001 , 62 , 0 , 1 , 0 ,  996 , 66 , "g"] , 
 [64 , "p"           ,  "f"   , 2 , 0 , 1006 , 1006 , 57 , 1 , 4 , 1 , 1008 , 66 , ""] , 
 [65 , "b"           ,  "c"   , 3 , 1 , 1010 , 1010 , 64 , 0 , 1 , 0 , 1008 , 66 , ""]
]
```


A partir du format tabulaire ( c'est en réalité un "arbre syntaxique" ), on peut reconstituer le source et réciproquement.

Ainsi, les programmes sources deviennent des données qu'on peut traiter informatiquement en ajoutant, supprimant ou modifiant des éléments.

**Les règles d'écriture** des programmes rev sont limitées.

**2°) Les constantes:**
Elles peuvent être  , entre guillemets,  entre apostrophes,  entre apostrophes inversées, entre signe division (/) dans le cas des regex  
ou bien dans aucun des cas çi-dessus, typiquement pour les variables, des constantes ( null , vrai , faux ) ou bien les valeurs numériques  
Dans le cas des regex, les éventuels indicateurs, par exemple i ou g sont placés dans la colonne des commentaires ( indice 13 )  

On pourra avoir par exemple :  
a,  
'a',  
"a",  
\`a\`,  
/a/gi  

et on obtiendra le tableau suivant  
```
0id 1val 2typ 3niv 4coQ 5pre 6der 7pId 8nbE 9nuE 10pro 11pop 12efs 13com
0        __I  -1     0     0    0    0    5    0    0    0     0 
1   a      c   0     0     0    0    0    0    1    0    0     2 
2   a      c   0     1     6    6    0    0    2    0    0     3 
3   a      c   0     3    13   13    0    0    3    0    0     4 
4   a      c   0     2    20   20    0    0    4    0    0     5 
5   a      c   0     4    27   31    0    0    5    0    0     6     gi
```

Cela dit, on évitera d'écrire des constantes à la racine car ça ne sert généralement pas à grand chose et ce n'est pas autorisé par défaut.   
Le programme qui traite ces sources rev peut accepter des constantes à la racine quand on veut 
par exemple vérifier une suite d'arguments d'une fonction mais cela doit être indiqué en paramètre.


Pour les cas spéciaux des les langages : 

Javascript autorise un "use strict";  il est tranformé en 
useStrict() 
directive( "use strict"), 


Php autorise un : declare(strict_types=1); il est tranformé en 

directive( texte( 'strict_types=1' )) 


**1°) Les Fonctions**

Elle peuvent contenir 0 ou n arguments, ces arguments peuvent être des fonctions ou des constantes

On pourra avoir par exemple :  

```
a(),  
a( a , 'a'),  
a( "a" , a( \`a\` , /a/gi ) )  

```

et on obtiendra le tableau suivant  

```
0id 1val 2typ 3niv 4coQ 5pre 6der 7pId 8nbE 9nuE 10pro 11pop 12efs 13com
0        __I   -1    0     0    0    0   3    0    0     0     0 
1   a      f    0    0     0    0    0   0    1    0     1     2 
2   a      f    0    0     5    5    0   2    2    1     6     5 
3   a      c    1    0     8    8    2   0    1    0     0     4 
4   a      c    1    1    13   13    2   0    2    0     6    10 
5   a      f    0    0    18   18    0   2    3    2    19    10 
6   a      c    1    3    22   22    5   0    1    0    19     7 
7   a      f    1    0    27   27    5   2    2    1    28    10 
8   a      c    2    2    31   31    7   0    1    0    28     9 
9   a      c    2    4    37   41    7   0    2    0    28    10      gi
```


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
 #( a() , b( c , d(x) ) )
```
est valide


alors que
```
 #( a() , b( c , d(x  ) )
```
ne l'est pas.



**4°) les programmes produits** qui ont un source rev sont en :

- html ( peut contenir du javascript )

- javascript

- php ( peut contenir du html donc du javascript )

- sql

- css ( à un niveau basique )

Je prévois d'intégrer d'autres langages  au fur et à mesure de l'avancée des développements mais pour l'instant  
ça me suffit pour valider toute la chaîne de traitement .

**5°) les programmes existants**  sont convertis.

Le système permet de convertir les sources javascript, php, html, sql dans le format "rev" pour pouvoir reprendre l'existant.  
A partir du format rev, le programme permet de produire un format tabulaire qui est inséré en base de donnée.  
A partir du format tabulaire on peut regénérer le source original  
La très grande majorité des sources présents dans ce git sont générés à partir du format rev.


Les bibliothèques externes qui sont utilisées pour convertir les sources des programmes en AST ( abstract syntax tree ).
Ces "AST" sont ensuites traités pour produire les "rev".   

Ces bibliothèques sont aussi converties en format "rev".
Pour php, seuls 2 programmes de la bibliothèque nikic/php-parser sont convertis en rev pour l'instant ce qui permet de valider le principe.
la bibliothèque https://php-parser.glayzzle.com/readme en javascript est utilisée de manière courante ( bien que celle de nikic soit mise en place )

L'objectif est de n'avoir que des sources au format rev


**6°) un exemple :**

ce source php: 

```
<?php
/* ceci est un commentaire dans php */
print('<html><body>');
$mon_nombre=4/2;
echo "salut php" .", ceci est ".($mon_nombre-1)." exemple de programme" /**/;
?>
<a href="https://github.com/hugues-koolsol/fta"><!-- ceci est un commentaire dans html -->allez voir github.com/hugues-koolsol/fta</a>
<script type="text/javascript">
/* ceci est un commentaire dans javascript */
let zz=6-4;
console.log('salut javascript,'+' ceci est '+(zz-1)+' exemple');
</script>
<?php
print('</body></html>');
```

est transformé en format rev qui est :  
```
php(
   #( ceci est un commentaire dans php ),
   appelf( nomf(print) , p( '<html><body>' )),
   affecte( $mon_nombre , divi( 4 , 2 )),
   appelf(
      nomf(echo),
      p( concat( "salut php" , ", ceci est " , moins( $mon_nombre , 1 ) , " exemple de programme" ))
   ),
   #(),
   html_dans_php(
      a(
         ( 'href' , "https://github.com/hugues-koolsol/fta"),
         #( ceci est un commentaire dans html ),
         'allez voir github.com/hugues-koolsol/fta'
      ),
      javascriptDansHtml(
         ( 'type' , "text/javascript"),
         #( ceci est un commentaire dans javascript ),
         declare_variable( zz , moins( 6 , 4 )),
         appelf(
            element(console),
            nomf(log),
            p( concat( 'salut javascript,' , ' ceci est ' , moins( zz , 1 ) , ' exemple' ))
         )
      )
   ),
   appelf( nomf(print) , p( '</body></html>' ))
)
```

et à partir du format rev on obtiendra :  

```
<?php
/* ceci est un commentaire dans php */
print('<html><body>');
$mon_nombre=4 / 2;
echo "salut php" . ", ceci est " . ($mon_nombre - 1) . " exemple de programme" ;
/**/?>
<a href="https://github.com/hugues-koolsol/fta"><!-- ceci est un commentaire dans html -->
    allez voir github.com/hugues-koolsol/fta
</a>
<script type="text/javascript">
//<![CDATA[
//<source_javascript_rev>
/* ceci est un commentaire dans javascript */
let zz=6 - 4;
console.log('salut javascript,' + ' ceci est ' + (zz - 1) + ' exemple');
//</source_javascript_rev>
//]]>
</script>

<?php
print('</body></html>');
```

Les sources javascript, php, html, sql contenus dans ce github sont quasiment tous passés par le format rev.

Vous trouverez à la racine de ce projet des exemples simples de sources en format rev en en format natif.








