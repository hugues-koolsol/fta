
var globale_LangueCourante='fr';
function test(nomFichier,nomZone,fntSiOk){
  // void
}
function chargerFichierSource(nomFichier,nomZone,fntSiOk){
/*#
  #(
     ==============================================================
     Déclaration d'un appel ajax
  ),
  declare(
     r,
     new(appelf(n(XMLHttpRequest)))
  ),
  #(timeout 6 secondes, on considère qu'il y a un problème au delà ),
  affecte(t.timeout , 6000),
  #(on appel cette url en POST et en asynchrone ),
  appelf(
     n(r.open),
     p('POST'),
     p('za_ajax.php?getFileContent'),
     p(vrai)
  ),
  #(
     On ne passe pas du binaire ( multipart/form-data )
     mais des données couple clé valeur
  ),
  appelf(n(r.setRequestHeader) , p('Content-Type') , p('application/x-www-form-urlencoded;charset=utf-8')),
  #(
     ==============================================================
     en cas de retour de données du serveur on applique cette fonction
  ),
  affecteFonction(
     r.onreadystatechange,
     contenu(
        choix(
           si(
              #(
                 ==============================================================
                 si données intermediaires(<>4) ou bien HTTP <> de 200
                 alors on ne fait rien
              ),
              condition(
                 (diff(r.readyState , 4)),
                 ou((diff(r.status , 200)))
              ),
              alors(revenir())
           )
        ),
        #(
           ==============================================================
           si données intermediaires=4 et HTTP=200
        ),
        essayer(
           faire(
              #(
                 ================================
                 le retour du serveur est en JSON
              ),
              appelf(r(jsonRet) , n(JSON.parse) , p(r.responseText)),
              choix(
                 si(
                    condition((egal(jsonRet.status , 'OK'))),
                    alors(
                       declare(ret , obj()),
                       affecte(ret , obj((status , true) , (value , jsonRet.value) , (nomZone , nomZone))),
                       appelf(n(fntSiOk) , p(ret)),
                       revenir()
                    )
                 ),
                 sinon(
                    alors(
                       appelf(n(display_ajax_error_in_cons) , p(jsonRet)),
                       appelf(n(console.log) , p(r)),
                       appelf(n(alert) , p('BAD job !')),
                       revenir()
                    )
                 )
              )
           ),
           sierreur(
              e,
              faire(
                 appelf(
                    n(console.error),
                    p('Go to the network panel and look the preview tab\n\n'),
                    p(e),
                    p('\n\n'),
                    p(r),
                    p('\n\n')
                 ),
                 revenir()
              )
           )
        )
     )
  ),
  #(
     =======================
     en cas d'erreur serveur
     =======================
  ),
  affecteFonction(
     r.onerror,
     contenu(appelf(n(console.error) , p('e=') , p(r)) , revenir())
  ),
  #(
     =================
     en cas de timeout
     =================
  ),
  affecteFonction(
     r.ontimeout,
     contenu(appelf(n(console.error) , p('e=') , p(r)) , revenir())
  ),
  #(
     ==============================================================
     construction des paramètres de l'appel ajax
  ),
  affecte(
     ajax_param,
     obj(
        (call , obj((lib , 'file') , (file , 'file') , (funct , 'getFileContent'))),
        (fileName , nomFichier)
     )
  ),
  #(
     ==============================================================
     encodage des paramètres
  ),
  appelf(
     r(chaineAppelAjax),
     n(concat),
     p('ajax_param='),
     p(
        appelf(
           n(encodeURIComponent),
           p(appelf(n(JSON.stringify) , p(ajax_param)))
        )
     )
  ),
  #(
     ==============================================================
     envoie des données en POST
  ),
  appelf(n(r.send) , p(chaineAppelAjax))
            
*/
}
// fichier testConcat1.js
// fichier testConcat2.js