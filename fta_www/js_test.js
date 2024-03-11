
for(i=0;(i < tab.length) && a > 0 ||  ( a < b && a < b )  &&  ( a2 < b2 || a3 < b3 || a3 < b3 || a3 < b3 || a3 < b3 || a3 < b3 ) ;i=i+1){
    /*dans faire*/
    a=1;
}
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
variable=(1 == 1);
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