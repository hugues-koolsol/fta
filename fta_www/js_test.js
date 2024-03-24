
var ajax_param={'call':{'lib':'core','file':'file','funct':'loadRevFile'},'file_name':nomFichierSource};
a={'"b\'c':'f"a\'a\\a'};
/*#

declare(a , @(obj(obj('b' , obj(('c' , d),('e' , f),('g' , h),)),('i' , j),)))      
      
*/
/*#
      
      
      
  fonction(
     definition(nom(loadRevFile) , argument(nomFichierSource) , argument(fntSiOk) , argument(nomZone) , argument(faireApres)),
     contenu(
        declare(r , appelf(n(new , XMLHttpRequest))),
        appelf(element(r) , n(open) , p('POST') , p('za_ajax.php?loadRevFile') , p(true)),
        affecte(r.timeout , @(6000)),
        appelf(element(r) , n(setRequestHeader) , p('Content-Type') , p('application/x-www-form-urlencoded;charset=utf-8')),
        affecte(
           r.onreadystatechange,
           appelf(
              n(function),
              contenu(
                 choix(
                    si(
                       condition(
                          ((diff(r.readyState , 4)) , ou(diff(r.status , 200)))
                       ),
                       alors(revenir())
                    )
                 )
              )
           )
        )
     )
  ),
      
*/
/*=============================================================================================================================*/
/*#
      
      
      
      
  declare(a , 0),
  declare(i , 0),
  boucle(
     initialisation(affecte(i , 0)),
     condition((inf(i , 10))),
     increment(affecte(i , i+1)),
     faire(affecte(a , @(1+a*(1+(1+(a+1))))))
  ),
  
  
      
*/
/*=============================================================================================================================*/
/*#
  
  
  
  declare(i , 0),
  boucle(
     initialisation(affecte(i , 0)),
     condition((inf(i , 10))),
     increment(affecte(i , i+1)),
     faire(
        affecte(
           appelf(element(document) , n(getElementById) , p('global_messages') , prop(innerHTML)),
           appelf(
              n(concat),
              p(appelf(element(document) , n(getElementById) , p('global_messages') , prop(innerHTML))),
              p('<div class="yyerror">'),
              p(global_messages.errors[i]),
              p('</div class="toto">'),
              appelf(
                 #(),
                 n(toto),
                 p(a),
                 p('b')
              )
           )
        ),
        appelf(
           n(f),
           p(a),
           p(appelf(n(b)))
        )
     )
  ),
  
      
*/
/*=======================================================================================================*/
/*#
  affecte(
     appelf(element(document) , n(getElementById) , p('global_messages') , prop(innerHTML)),
     appelf(
        n(concat),
        p(appelf(element(document) , n(getElementById) , p('global_messages') , prop(innerHTML))),
        p('<div class="yyerror">'),
        p(global_messages.errors[i]),
        p('</div class="toto">'),
        appelf(n(toto) , p(a) , p('b'))
     )
  ),
      
*/
/*=======================================================================================================*/
/*#
  
  
  
  affecte(
  appelf(element(document) , n(getElementById) , p('global_messages') , prop(innerHTML)),
  appelf(
  n(concat),
  #(),
  p(appelf(element(document) , n(getElementById) , p('global_messages') , prop(innerHTML))),
  p('<div class="yyerror">'),
  p(global_messages.errors[i]),
  p('</div class="toto">'),
  p(appelf(n(toto) , p(a) , p('b')))
  )
  ),
  
  
  
      
*/
/*#
      
      
      
  declare(s , ''),
  affecte(
     s,
     cascade(
        appelf(
           n(traiteCommentaireSourceEtGenere1),
           p(texte),
           p(niveau),
           p(ind),
           p(NBESPACESSOURCEPRODUIT),
           p(false)
        )
     )
  ),
  
  
  
      
*/
/*
  
  a=b.c(x('d').y.z()).e.f( 'g,h', i(j).k ).l 
  
*/
/*#
      
      
  declare(i , 0),
  boucle(
     initialisation(affecte(i , 0)),
     condition((inf(i , 10))),
     increment(affecte(i , i+1)),
     faire(
        affecte(
           a,
           cascade(
              appelf(
                 element(b),
                 n(c),
                 p(
                    cascade(appelf(n(x) , p('d')) , appelf(element(y) , n(z)))
                 )
              ),
              appelf(
                 element(e),
                 n(f),
                 p('g,h'),
                 p(appelf(n(i) , p(j) , prop(k))),
                 prop(l)
              )
           )
        )
     )
  ),
      
*/
/*#
      
cascade(
   appelf(
      element(b),
      n(c),
      p(
         cascade(
            appelf(
               n(x) , 
               p('d')
            ),
            appelf(
               element(y) , 
               n(z)
            )
         ),
      )
   ),
   appelf(
      element(e),
      n(f),
      p('g,h'),
      p(appelf(n(i) , p(j) , prop(k))),
      prop(l)
   )
)      
      
      
*/
/*#
  affecte(
     a,
     cascade(
        appelf(element(b) , n(c) , p('d')),
        appelf(
           element(e),
           n(f),
           p('g,h'),
           p(appelf(n(i) , p(j) , prop(k))),
           prop(l)
        )
     )
  ),
      
*/
/*#
      
a=b.c('d').e.f( 'g,h', i(j).k ) ; 
      
a=document.getElementById('x').value.replace('g,h',maFuncQuiRetourneUnObjet(j).k)
affecte(
   a,
   listef(      
     appelf(
        element(document)
        n(getElementById),
        p('x'),
        prop(value)
     ),
     appelf(
        element(value)
        name(replace)
        p('gh'),
        p(
           appelf(
              n(maFuncQuiRetourneUnObjet),
              p(j)
           )
        )
     )
   )
)



      affecte(
         a,
         cascade(
          appelf(  element(b),  n(c),p('d')),appelf(  n(e.f),p('g,h'),p(appelf(  n(i),p(j),prop(k))),prop(l))         )
      )



      affecte(
         a,
         appelf(
            #(),
            n(b.c),
            p('d'),
            prop(
               appelf(
                  #(),
                  n(e.f),
                  p('g,h'),
                  p(
                     appelf(
                        #(),
                        n(i),
                        p(j),
                        prop(k)
                     )
                  ),
                  prop(l)
               )
            )
         )
      ),

      
*/
/*#      
  declare(cleElement , obj()),
  boucleSurObjet(
     pourChaque(dans(cleElement , arguments)),
     faire(
        #(),
        affecte(a , 1)
     )
  ),
      
*/
/*#      
  affecte(
     variable,
     condition((egal(1 , 1)))
  ),
      
*/
/*#      


  boucle(
     initialisation(affecte(i , 0)),
     condition(
        (inf(i , tab.length)),
        et(sup(a , 0)),
        ou(inf(a , b) , et(inf(a , b))),
        et(
           inf(a2 , b2),
           ou(inf(a3 , b3)),
           ou(inf(a3 , b3)),
           ou(inf(a3 , b3)),
           ou(inf(a3 , b3)),
           ou(inf(a3 , b3))
        )
     ),
     increment(affecte(i , i+1)),
     faire(
        #(dans faire),
        affecte(a , 1)
     )
  ),
  
  
  
      
*/
/*fin boucle, suite du source*/
/*#
  
  
  declare(
     global_enteteTableau,
     appelf(
        n(Array),
        p(appelf(n(Array) , p('id') , p('id'))),
        p(appelf(n(Array) , p('val') , p('value'))),
        p(appelf(n(Array) , p('typ') , p('type'))),
        p(appelf(n(Array) , p('niv') , p('niveau'))),
        p(appelf(n(Array) , p('coQ') , p('constante quotée')))
     )
  ),
  
  
      
*/
/*#
  
  
  declare(obj , obj()),
  affecte(obj , obj(('status' , faux) , ('message' , 'erreur') , ('id' , i))),
  choix(
     si(
        condition((vrai)),
        alors(
           appelf(
              r(t),
              n(concat),
              p(t),
              p(appelf(n(espacesnrev) , p(false) , p(arr[i][3])))
           )
        )
     ),
     sinon(
        alors(
           appelf(
              r(t),
              n(concat),
              p(t),
              p(appelf(n(espacesnrev) , p(false) , p(arr[i][3])))
           )
        )
     )
  ),
  
  
  
      
*/
/*#
  ============================================
  
  
  
  appelf(
     n(push),
     element(out),
     p(
        appelf(
           n(Array),
           p(
              appelf(
                 element(str),
                 n(substr),
                 p(0),
                 p(2)
              )
           ),
           p(2),
           p(i),
           p(numLigne)
        )
     )
  ),
  
  ============================================
      
*/
/*#
  
  
  
  ============================================
  affecte(apresAppelF , 1),
  #(
     ===============
     début de boucle
     ===============
  ),
  boucle(
     #(comm 20 boucle),
     initialisation(affecte(i , 0)),
     condition(inf(i , tab.length)),
     increment(affecte(i , i+1)),
     faire(
        affecte(a , 1),
        #(arrêter le traitement),
        break(),
        appelf(
           n(nomFonction),
           r(variableDeRetour),
           p(parametre1),
           p(parametre2)
        ),
        revenir(appelf(n(logerror) , p(variableDeRetour)))
     )
  ),
  #(
     ===========================
     fin boucle, suite du source
     ===========================
  ),
  #(
     =============
     comm 10 if OK
     =============
  ),
  #(commentaire 11),
  choix(
     #(
        =============
        comm 20 if OK
        =============
     ),
     si(
        #(commentaire 30 OK),
        condition(
           #(
              =============
              comm 40 if OK
              =============
           ),
           non(
              #(commentaire 50 OK),
              (
                 #(commentaire 60 OK),
                 egal(vrai , vrai)
              ),
              #(commentaire 51 OK),
              et(
                 #(commentaire 61 OK),
                 egal(vrai , vrai)
              )
           ),
           #(
              =================
              commentaire 41 OK
              =================
           ),
           ou(egal(faux , vrai))
        ),
        alors(affecte(a , 1))
     ),
     #(
        =================
        commentaire 21 OK
        =================
     ),
     sinonsi(
        #(commentaire 31 OK),
        condition(
           #(commentaire 32 OK),
           egal(true , faux)
        ),
        alors(affecte(a , 1))
     ),
     #(commentaire 22 OK),
     sinon(
        alors(affecte(a , 1)),
        #(finsinon)
     ),
     #(commentaire 23 OK)
  ),
  #(commentaire 12),
  affecte(apresChoix , 1),
  #(commentaire 13),
  affecte(a , 1),
  #(commentaire 14)


  ============================================
      
*/