
  var globale_LangueCourante='fr';
function chargerFichierSource(nomFichier,nomZone,fntSiOk){
    /* 
          ==============================================================
          Déclaration d'un appel ajax
         */
    var r= new XMLHttpRequest();
    /*  timeout 6 secondes, on considère qu'il y a un problème au delà  */
    t.timeout=6000;
    /*  on appel cette url en POST et en asynchrone  */
    r.open('POST','za_ajax.php?getFileContent',true);
    /* 
          On ne passe pas du binaire ( multipart/form-data )
          mais des données couple clé valeur
         */
    r.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=utf-8');
    /* 
          ==============================================================
          en cas de retour de données du serveur on applique cette fonction
         */
    r.onreadystatechange=function(){
      if((r.readyState != 4)||(r.status != 200)){
         return;
      }
      /* 
              ==============================================================
              si données intermediaires=4 et HTTP=200
             */
      try{
        /* 
                  ================================
                  le retour du serveur est en JSON
                 */
        jsonRet=JSON.parse(r.responseText);
        if((jsonRet.status == 'OK')){
              fntSiOk({'status':true,'value':jsonRet.value,'nomZone':nomZone});
           return;
        }else{
           display_ajax_error_in_cons(jsonRet);
           console.log(r);
           alert('BAD job !');
           return;
        }
      }catch(e){
         console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
         return;
      }
    }
    /* 
          =======================
          en cas d'erreur serveur
          =======================
         */
    r.onerror=function(){
      console.error('e=',r);
      return;
    }
    /* 
          =================
          en cas de timeout
          =================
         */
    r.ontimeout=function(){
      console.error('e=',r);
      return;
    }
    /* 
          ==============================================================
          construction des paramètres de l'appel ajax
         */
    ajax_param={'call':{'lib':'file','file':'file','funct':'getFileContent'},'fileName':nomFichier};
    /* 
          ==============================================================
          encodage des paramètres
         */
    chaineAppelAjax=concat('ajax_param=',encodeURIComponent(JSON.stringify(ajax_param)));
    /* 
          ==============================================================
          envoie des données en POST
         */
    r.send(chaineAppelAjax);
}
// fichier testConcat1.js
// fichier testConcat2.js