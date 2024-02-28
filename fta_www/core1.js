
var globale_LangueCourante='fr';
function fta1(o,exitOnLevelError){
  /*
    // =========================
    // les chaines de caractères
    // =========================
  */
  var t='';
  var texte='';
  var commentaire='';
  var c='';
  var c1='';
  var c2='';
  var cst='';
  var commentaireAvant='';
  var commentaireApres='';
  var commentaireDedans='';
  var typCommApNett='';
  var typCommDeNett='';
  var typCommAvNett='';
  var CommApNett='';
  var CommDeNett='';
  var CommAvNett='';
  /*
    // =========================
    // les entiers
    // =========================
  */
  var i=0;
  var j=0;
  var k=0;
  var l=0;
  var indice=0;
  var niveau=0;
  var niveauBloc=0;
  var premier=0;
  var dernier=0;
  var debutIgnore=0;
  var finIgnore=0;
  var numeroLigne=0;
  var parentId=0;
  var nombreEnfants=0;
  var numEnfant=0;
  var profondeur=0;
  var posOuvPar=0;
  var posFerPar=0;
  var numLigneFermeturePar=0;
  /*
    // =========================
    // les booléens
    // =========================
  */
  var dansCst=false;
  var dansTexte=false;
  var dansCommentaireLigne=false;
  var dansCommentaireBloc=false;
  var constanteQuotee=false;
  var faireCommentaire=true;
  var levelError=false;
  var dansIgnore=false;
  /*
    // =========================
    // les autres
    // =========================
  */
  var T= new Array();
  /*
    // =======================================================================
    // initialisation du tableau contenant le source structuré en arborescence
    // =======================================================================
  */
  T.push(array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,0,0,0,0,numLigneFermeturePar,profondeur,typCommApNett,typCommDeNett,typCommAvNett,CommApNett,CommDeNett,CommAvNett,posOuvPar,posFerPar));
  var l01=o.length;
  /*
    // ====================================================================
    // ====================================================================
    // boucle principale sur tous les caractères du texte passé en argument
    // on commence par analyser les cas ou on est dans des chaines, puis on
    // analyse les caractères
    // ====================================================================
    // ====================================================================
  */
  for(i=0;i < l01;i=i+1){
    c=o.substr(i,1);
      /*
        // ==================
        // dans une constante
        // ==================
      */
      
    if((dansCst == true)){
      if((c == '\'')){
        if((i != l01-1)){
          c1=o.substr(i+1,1);
          if((c1 == ',')||c1 == '\t'||c1 == '\n'||c1 == '\r'||c1 == '/'||c1 == ' '||c1 == ')'){
            dernier=i-1;
          }else{
            temp={'status':false,'value':T,'message':'apres une constante, il doit y avoir un caractère d\'echappement'};
            return(logerreur(temp));
          }
        }
        dansCst=false;
        indice=indice+1;
        constanteQuotee=true;
        if((dansIgnore == true)){
          if((texte == '')){
            commentaireAvant=o.substr(debutIgnore,premier-debutIgnore);
          }else{
            commentaireAvant=o.substr(debutIgnore,premier-debutIgnore-1);
          }
          dansIgnore=false;
        }
        numeroLigne=calculNumLigne(o,premier);
        T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,numeroLigne,numLigneFermeturePar,profondeur,typCommApNett,typCommDeNett,typCommAvNett,CommApNett,CommDeNett,CommAvNett,posOuvPar,posFerPar));
        texte='';
        commentaireAvant='';
        constanteQuotee=false;
      }else if((c == '\\')){
        if((i == l01-1)){
          temp={'status':false,'value':T,'message':'un antislash ne doit pas terminer une fonction'};
          return(logerreur(temp));
        }else{
          c1=o.substr(i+1,1);
          if((c1 == '\\')||c1 == '\''){
            if((texte == '')){
              premier=i;
            }
            texte=concat(texte,c1);
            i=i+1;
          }else{
            if((c1 == 'n')||c1 == 't'||c1 == 'r'){
              if((texte == '')){
                premier=i;
              }
              texte=concat('\\',c1);
              i=i+1;
            }else{
              temp={'status':false,'value':T,'message':'un antislash doit être suivi par un autre antislash ou un apostrophe'};
              return(logerreur(temp));
            }
          }
        }
      }else{
        if((texte == '')){
          premier=i;
        }
        texte=concat(texte,c);
      }
      /*
        // ========================================
        // dans un commentaire de type ligne ( // )
        // ========================================
      */
      
    }else if((dansCommentaireLigne == true)){
      for(j=i;j < l01;j=j+1){
        c1=o.substr(j,1);
        if((c1 == '\n')||c1 == '\r'){
          dansCommentaireLigne=false;
          i=j;
          break;
        }
      }
      /*
        // =======================================
        // dans un commentaire de type bloc ( /* )
        // =======================================
      */
      
    }else if((dansCommentaireBloc == true)){
      for(j=i;j < l01-1;j=j+1){
        c1=o.substr(j,1);
        c2=o.substr(j+1,1);
        if((c1 == '/')&&c1 == '*'&&(i == 0)||o.substr(j-1,1) == '\r'||o.substr(j-1,1) == '\n'){
          niveauBloc=niveauBloc+1;
        }else if((c1 == '*')&&c1 == '/'&&(o.substr(j-1,1) == '\r')||o.substr(j-1,1) == '\n'){
          niveauBloc=niveauBloc-1;
        }
        if((niveauBloc == 0)){
          dansCommentaireBloc=false;
          i=j+1;
          break;
        }
      }
    }else{
      /*
        // ==================================================
        // on n'est pas dans un commentaire ou une constante,  
        // donc c'est un nouveau type qu'il faut détecter
        // ==================================================
      */
        /*
          //====================
          // Parenthèse ouvrante
          //====================
        */
        
      if((c == '(')){
        posOuvPar=i;
        if((dansIgnore == true)){
          if((texte == '')){
            commentaireAvant=o.substr(debutIgnore,i-debutIgnore);
          }else{
            commentaireAvant=o.substr(debutIgnore,premier-debutIgnore);
          }
          dansIgnore=false;
        }
        indice=indice+1;
        if(!(texte == '')){
          numeroLigne=calculNumLigne(o,i);
        }else{
          numeroLigne=calculNumLigne(o,premier);
        }
        T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,numeroLigne,numLigneFermeturePar,profondeur,typCommApNett,typCommDeNett,typCommAvNett,CommApNett,CommDeNett,CommAvNett,posOuvPar,posFerPar));
        for(i=T.length-1;j > 0;j=j-1){
          l=T[j][3];
          for(k=j;k >= 0;k=k-1){
            T[j][10]=k;
            break;
          }
        }
        niveau=niveau+1;
        texte='';
        commentaireAvant='';
        commentaireApres='';
        dansCst=false;
        dansTexte=false;
        dansCommentaireLigne=false;
        dansCommentaireBloc=false;
        /*
          //====================
          // Parenthèse fermante
          //====================
        */
        
      }else if((c == ')')){
        posFerPar=i;
        faireCommentaire=true;
        if((texte != '')){
          if(
            /*
              une constante est le dernier paramètre d'une fonction 
              et ne comporte pa de virgule, ex : a((b c))
              ( egal( dansIgnore , true ) )
            */
            ){
            commentaireAvant=o.substr(debutIgnore,premier-debutIgnore);
          }
          indice=indice+1;
          numeroLigne=calculNumLigne(o,premier);
          T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,numeroLigne,numLigneFermeturePar,profondeur,typCommApNett,typCommDeNett,typCommAvNett,CommApNett,CommDeNett,CommAvNett,posOuvPar,posFerPar));
          texte='';
          commentaireAvant='';
          faireCommentaire=false;
        }
        if((dansIgnore == true)&&faireCommentaire == true){
          a=1;
          if((niveau > T[indice][3])){
            commentaireDedans=o.substr(debutIgnore,i-debutIgnore);
            T[indice][9]=commentaireDedans;
            commentaireDedans='';
            dansIgnore=false;
          }else{
            for(k=indice;k > 0;k=k-1){
              if((T[k][3] == niveau)){
                commentaireApres=o.substr(debutIgnore,i-debutIgnore);
                T[k][8]=commentaireApres;
                commentaireApres='';
                dansIgnore=false;
                break;
              }
            }
          }
        }
        if(
          /*
            si le dernier argument d'une fonction est une constante, 
            il faut remonter pour chercher le commentaire apres
          */
          (T[indice][2] == 'c')&&niveau == T[indice][3]){
          if((T[indice][4] == true)){
            k=T[indice][6]+2;
          }else{
            k=T[indice][6]+1;
          }
          if((k < i)){
            commentaireApres=o.substr(k,i-k);
          }
        }
        a=1;
        numeroLigne=calculNumLigne(o,i);
        /*// recherche du numLiParent*/
        for(j=indice;j > 0;j=j-1){
          if((T[j][3] == niveau-1)){
            T[j][14]=numeroLigne;
            break;
          }
        }
        niveau=niveau-1;
        /*
          //
          // maj de la position de fermeture de la parenthèse
          //
        */
        for(j=indice;j >= 0;j=j-1){
          a=1;
          if((T[j][3] == niveau)&&T[j][2] == ''){
            T[j][23]=posFerPar;
            break;
          }
        }
        posFerPar=0;
        dansCst=false;
        dansTexte=false;
        dansCommentaireLigne=false;
        dansCommentaireBloc=false;
        /*
          //==========
          // antislash
          // TODO a revoir
          //==========
        */
        
      }else if((c == '\\')){
        temp={'status':false,'value':T,'message':'un antislash doit être dans une constante'};
        return(logerreur(temp));
        /*
          //===========
          // apostrophe
          //===========
        */
        
      }else if((c == '\'')){
        premier=i;
        if((dansCst == true)){
          dansCst=false;
        }else{
          dansCst=true;
        }
      }else if((c == '/')){
        /*
          //================================
          // slash donc début de commentaire
          //================================
        */
        if((i == l01-1)){
          temp={'status':false,'value':T,'message':'un slash à la fin d\'une fonction n\'est pas autorisé'};
          return(logerreur(temp));
        }
        c1=o.substr(i+1,1);
        if((c1 == '/')){
          if((texte != '')){
            indice=indice+1;
            if((dansIgnore == true)){
              commentaireAvant=o.substr(debutIgnore,premier-debutIgnore);
              debutIgnore=i;
            }
            numeroLigne=calculNumLigne(o,premier);
            T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,numeroLigne,numLigneFermeturePar,profondeur,typCommApNett,typCommDeNett,typCommAvNett,CommApNett,CommDeNett,CommAvNett,posOuvPar,posFerPar));
            texte='';
            commentaireAvant='';
            commentaireApres='';
            dansCst=false;
            dansTexte=false;
            dansCommentaireLigne=false;
            dansCommentaireBloc=false;
          }
          dansCommentaireLigne=true;
          if((dansIgnore == false)){
            debutIgnore=i;
          }
          dansIgnore=true;
        }else if(('*' == c1)){
          c1=o.substr(i-1,1);
          if((i == 0)||'\r' == c1||'\n' == c1){
            if((dansIgnore == false)){
              debutIgnore=i;
            }
            dansIgnore=true;
            dansCommentaireBloc=true;
            i=i+1;
            niveauBloc=1;
          }else{
            temp={'status':false,'value':T,'message':'un commentaire de bloc doit commencer en colonne 1'};
            return(logerreur(temp));
          }
        }else{
          temp={'status':false,'value':T,'message':'un slash doit être suivi d\'un caractère * pour commencer un commentaire'};
          return(logerreur(temp));
        }
      }else if((c == ',')){
        /*
          //========================
          // virgule donc séparateur
          //========================
        */
        if((texte == '')){
          if((dansIgnore == true)){
            commentaireAvant=o.substr(debutIgnore,premier-debutIgnore);
            dansIgnore=false;
          }
          indice=indice+1;
          numeroLigne=calculNumLigne(o,premier);
        }else{
          if((dansIgnore == true)){
            commentaireApres=o.substr(debutIgnore,i-debutIgnore);
            if((T[indice][3] == niveau)){
              T[indice][8]=commentaireApres;
            }else{
              for(j=indice-1;j > 0;j=j-1){
                if((T[j][3] == niveau)){
                  T[j][8]=commentaireApres;
                  break;
                }
              }
            }
            dansIgnore=false;
          }
        }
        texte='';
        commentaireAvant='';
        commentaireApres='';
        dansCst=false;
        dansTexte=false;
        dansCommentaireLigne=false;
        dansCommentaireBloc=false;
      }else if((c == ' ')||c == '\t'||c == '\r'||c == '\n'){
        if((texte == '')){
          indice=indice+1;
          if((dansIgnore == true)){
            commentaireAvant=o.substr(debutIgnore,premier-debutIgnore);
            debutIgnore=i;
          }
          numeroLigne=calculNumLigne(o,premier);
          T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,parentId,nombreEnfants,numEnfant,numeroLigne,numLigneFermeturePar,profondeur,typCommApNett,typCommDeNett,typCommAvNett,CommApNett,CommDeNett,CommAvNett,posOuvPar,posFerPar));
          texte='';
          commentaireAvant='';
          commentaireApres='';
          dansCst=false;
          dansTexte=false;
          dansCommentaireLigne=false;
          dansCommentaireBloc=false;
          if((dansIgnore == false)){
            debutIgnore=i;
          }
          dansIgnore=true;
        }else{
          a=1;
        }
        apresChoix=1;
        a=1;
      }else{
        a=1;
      }
    }
  }
  /*#
affecteFonction(
 r.onreadystatechange,
 contenu(
  essayer(
   faire(
    // instructions
   ),
   sierreur(
    e,
    faire(
     // instructions
    )
   )
  )
 )
)
// dernière ligne de commentaire
*/
}