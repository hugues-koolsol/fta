
function fta1(tableauEntree,exitOnLevelError){
  /*
    =========================
    les chaines de caractères
    =========================
  */
  var texte='';
  var commentaire='';
  var c='';
  var c1='';
  var c2='';
  /*
    =========================
    les entiers
    =========================
  */
  var i=0;
  var j=0;
  var k=0;
  var l=0;
  var indice=0;
  var niveau=0;
  var premier=0;
  var dernier=0;
  var numeroLigne=0;
  var posOuvPar=0;
  var posFerPar=0;
  var niveauDebutCommentaire=0;
  var niveauDansCommentaire=0;
  /*
    =========================
    les booléens
    =========================
  */
  var dansCst=false;
  var dsComment=false;
  var constanteQuotee=false;
  /*
    ====================================
    Le tableau en sortie si tout va bien
    ====================================
  */
  var T= new Array();
  /*
    =======================================================================
    initialisation du tableau contenant le source structuré en arborescence
    =======================================================================
    0id    1val  2typ  3niv  4coQ
    5pre   6der  7pId  8nbE  9numEnfant  
    10pro 11OPa 12FPa 13comm
  */
  T.push(array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
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
    c=tableauEntree[i][0];
      /*
        
        
        
        ===================
        Dans un commentaire
        ===================
      */
      
    if((dsComment)){
      if((c == ')')){
        if(((niveau == niveauDebutCommentaire+1)&&niveauDansCommentaire == 0)){
          posFerPar=i;
          T[T.length-1][13]=commentaire;
          T[T.length-1][12]=posFerPar;
          commentaire='';
          dsComment=false;
          niveau=niveau-1;
        }else{
          commentaire=concat(commentaire,c);
          niveauDansCommentaire=niveauDansCommentaire-1;
        }
      }else if((c == '(')){
        commentaire=concat(commentaire,c);
        niveauDansCommentaire=niveauDansCommentaire+1;
      }else{
        commentaire=concat(commentaire,c);
      }
      /*
        
        
        
        ==================
        dans une constante
        ==================
      */
      
    }else if((dansCst == true)){
      if((c == '\'')){
        if((i == l01-1)){
          temp={'status':false,'id':i,'value':T,'message':'-1 la racine ne peut pas contenir des constantes'};
          return(logerreur(temp));
        }
        c1=tableauEntree[i+1][0];
        if((c1 == ',')||c1 == '\t'||c1 == '\n'||c1 == '\r'||c1 == '/'||c1 == ' '||c1 == ')'){
          dernier=i-1;
        }else{
          temp={'status':false,'value':T,'id':i,'message':'apres une constante, il doit y avoir un caractère d\'echappement'};
          return(logerreur(temp));
        }
        dansCst=false;
        indice=indice+1;
        constanteQuotee=true;
        if((niveau == 0)){
          temp={'status':false,'id':i,'value':T,'message':'-1 la racine ne peut pas contenir des constantes'};
          return(logerreur(temp));
        }
        T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
        texte='';
        constanteQuotee=false;
      }else if((c == '\\')){
        if((i == l01-1)){
          temp={'status':false,'value':T,'id':i,'message':'un antislash ne doit pas terminer une fonction'};
          return(logerreur(temp));
        }
        /*fin du choix*/
        c1=tableauEntree[i+1][0];
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
            texte=concat(texte,'\\',c1);
            i=i+1;
          }else{
            temp={'status':false,'value':T,'id':i,'message':'un antislash doit être suivi par un autre antislash ou un apostrophe'};
            return(logerreur(temp));
          }
        }
      }else{
        if((texte == '')){
          premier=i;
        }
        texte=concat(texte,c);
      }
    }else{
      /*
        
        
        
        ==================================================
        on n'est pas dans un commentaire ou une constante,  
        donc c'est un nouveau type qu'il faut détecter
        ==================================================
      */
      if((c == '(')){
        /*
          ====================
          Parenthèse ouvrante
          ====================
          
          
        */
        posOuvPar=i;
        indice=indice+1;
        if((texte == DEBUTCOMMENTAIRE)){
          dsComment=true;
          niveauDebutCommentaire=niveau;
        }
        T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,posOuvPar,posFerPar,''));
        niveau=niveau+1;
        texte='';
        dansCst=false;
        /*
          ==========================
          FIN DE Parenthèse ouvrante
          ==========================
          
          
        */
      }else if((c == ')')){
        /*
          
          
          ====================
          Parenthèse fermante
          ====================
        */
        posFerPar=i;
        if((texte != '')){
          if((niveau == 0)){
            temp={'status':false,'value':T,'id':i,'message':'une fermeture de parenthése ne doit pas être au niveau 0'};
            return(logerreur(temp));
          }
          indice=indice+1;
          T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
          texte='';
        }
        niveau=niveau-1;
        /*
          
          maj de la position de fermeture de la parenthèse
          
        */
        for(j=indice;j >= 0;j=j-1){
          a=1;
          if((T[j][3] == niveau)&&T[j][2] == 'f'){
            T[j][12]=posFerPar;
            break;
          }
        }
        posFerPar=0;
        dansCst=false;
        /*
          ==========================
          FIN de Parenthèse fermante
          ==========================
          
          
        */
      }else if((c == '\\')){
        /*
          
          
          ===========
          anti slash 
          ===========
        */
        if(!(dansCst)){
          temp={'status':false,'value':T,'id':i,'message':'un antislash doit être dans une constante'};
          return(logerreur(temp));
        }
        /*
          ===================
          Fin d'un anti slash
          ===================
          
          
        */
      }else if((c == '\'')){
        /*
          
          
          //===========
          // apostrophe
          //===========
        */
        premier=i;
        if((dansCst == true)){
          dansCst=false;
        }else{
          dansCst=true;
        }
        /*
          //===============
          // FIN apostrophe
          //===============
          
          
        */
      }else if((c == ',')){
        /*
          
          
          //========================
          // virgule donc séparateur
          //========================
        */
        if((texte == '')){
          indice=indice+1;
          if((niveau == 0)){
            temp={'status':false,'value':T,'id':i,'message':'la racine ne peut pas contenir des constantes'};
            return(logerreur(temp));
          }
          T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
        }else{
          if((T[indice][2] == 'f')){
            /*ne rien faire*/
          }else{
            if((T[indice][3] >= niveau)){
              /*ne rien faire*/
            }else{
              temp={'status':false,'value':T,'id':i,'message':'une virgule ne doit pas être précédée d\'un vide'};
              return(logerreur(temp));
            }
          }
        }
        texte='';
        dansCst=false;
        /*
          //============================
          // FIN virgule donc séparateur
          //============================
          
          
        */
      }else if((c == ' ')||c == '\t'||c == '\r'||c == '\n'){
        /*
          
          
          =============================
          caractères séparateurs de mot
          =============================
        */
        if((texte != '')){
          indice=indice+1;
          if((niveau == 0)){
            temp={'status':false,'value':T,'id':i,'message':'la racine ne peut pas contenir des constantes'};
            return(logerreur(temp));
          }
          T.push(array(indice,texte,'c',niveau,constanteQuotee,premier,dernier,0,0,0,0,0,0,''));
          texte='';
          dansCst=false;
        }
        /*
          ====================================
          FIN de caractères séparateurs de mot
          ====================================
          
          
        */
      }else{
        a=1;
        if((texte == '')){
          premier=i;
        }
        dernier=i;
        texte=concat(texte,c);
      }
    }
  }
  /*
    ========================================
    on est en dehors de la boucle principale
    ========================================
  */
}