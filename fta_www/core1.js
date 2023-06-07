
var globale_LangueCourante='fr';
function fta1(o,exitOnLevelError){
  // =========================
  // les chaines de caractères
  // =========================
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
  // =========================
  // les entiers
  // =========================
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
  // =========================
  // les booléens
  // =========================
  var dansCst=false;
  var dansTexte=false;
  var dansCommentaireLigne=false;
  var dansCommentaireBloc=false;
  var constanteQuotee=false;
  var faireCommentaire=true;
  var levelError=false;
  var dansIgnore=false;
  // =========================
  // les autres
  // =========================
  var T= new Array();
  // =======================================================================
  // initialisation du tableau contenant le source structuré en arborescence
  // =======================================================================
  T.push(array(0,texte,'INIT',-1,constanteQuotee,premier,dernier,commentaireAvant,commentaireApres,commentaireDedans,0,0,0,0,numLigneFermeturePar,profondeur,typCommApNett,typCommDeNett,typCommAvNett,CommApNett,CommDeNett,CommAvNett,posOuvPar,posFerPar));
  var l01=o.length;
  
  // ====================================================================
  // ====================================================================
  // boucle principale sur tous les caractères du texte passé en argument
  // ====================================================================
  // ====================================================================
  
  for(i=0;i < l01;i=i+1){
    c=o.substr(i,1);
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
    }else if((dansCommentaireLigne == true)){
       for(j=i;j < l01;j=j+1){
         c1=o.substr(j,1);
         if((c1 == '\n')||c1 == '\r'){
            dansCommentaireLigne=false;
            i=j;
            break;
         }
       }
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
       }else if((c == ')')){
          posFerPar=i;
          faireCommentaire=true;
          if((texte != '')){
             if((dansIgnore == true)){
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
          if((T[indice][2] == 'c')&&niveau == T[indice][3]){
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
          for(j=indice;j > 0;j=j-1){
            if((T[j][3] == niveau-1)){
               T[j][14]=numeroLigne;
               break;
            }
          }
          niveau=niveau-1;
       }else if((c == '\\')){
          a=1;
       }else if((c == '\'')){
          a=1;
       }else if((c == '/')){
          a=1;
       }else if((c == ',')){
          a=1;
       }else if((c == ' ')||c == '\t'||c == '\r'||c == '\n'){
          a=1;
       }else{
          a=1;
       }
    }
  }
}