'use strict';
//=====================================================================================================================
function monTrim(s){
 var t='';
 for(var i=0;i<s.length;i++){
  var c=s.substr(i,1);
  if(c==' '){
   t=s.substr(i+1);
  }else{
   t=s.substr(i);
   break;
  }
 }
 s=t;
 for(var i=s.length-1;i>=0;i--){
  var c=s.substr(i,1);
  if(c==' '){
   t=s.substr(0,i);
  }else if(c!=' '){
   break;
  }
 }
 return t; 
}

//=====================================================================================================================
function boucleRecursiveSurCondition1(tab,ind1,niveau1,parentId){
 var t='';
 var dernierI=0;
 for(var i=ind1;i<tab.length;i++){
  if(tab[i][0][2]==parentId){
  
   if(tab[i][3]=='||'){
    t+='ou';
   }else if(tab[i][3]=='&&'){
    t+='et';
   }else{
    t+=tab[i][3];
   }
   
   if(tab[i][0][0]>niveau1){
    t+='('.repeat(tab[i][0][0]-niveau1);
   }
   if(tab[i][5]!==''){
//    t+=' untruc pour i='+i+' ';
    for(var j=0;j<tab[i][6].length;j++){
     var elt=tab[i][6][j];
     if(j>0){
      t+=',';
     }
     if(elt[0]=='||'){
      t+='ou';
     }else if(elt[0]=='&&'){
      t+='et';
     }
     if(elt[2][0]=='' && elt[2][1]=='' && elt[2][2]==''){
       if(tab[i][6][j][1]==''){
       }else if(tab[i][6][j][1].substr(0,1)=='!'){
        t+='(';
        t+='egalstricte('+tab[i][6][j][1].substr(1)+' , faux)';
        t+=')';
       }else{
        t+='(';
        t+='non(egalstricte('+tab[i][6][j][1]+' , faux))';
        t+=')';
       }
     }else{
      t+='(';
      if(elt[2][0]=='<'){
       t+='inf('+elt[2][1]+' , '+elt[2][2]+')';
      }else if(elt[2][0]=='<='){
       t+='infeg('+elt[2][1]+' , '+elt[2][2]+')';
      }else if(elt[2][0]=='>'){
       t+='sup('+elt[2][1]+' , '+elt[2][2]+')';
      }else if(elt[2][0]=='>='){
       t+='supegal('+elt[2][1]+' , '+elt[2][2]+')';
      }else if(elt[2][0]=='!=='){
       t+='diffstricte('+elt[2][1]+' , '+elt[2][2]+')';
      }else if(elt[2][0]=='==='){
       t+='egalstricte('+elt[2][1]+' , '+elt[2][2]+')';
      }else if(elt[2][0]=='!='){
       t+='diff('+elt[2][1]+' , '+elt[2][2]+')';
      }else if( elt[2][0] == '==' ){
       t+='egal('+elt[2][1]+' , '+elt[2][2]+')';
      }else{
       t+='TODO"'+elt[2][0]+'"('+elt[2][1]+' , '+elt[2][2]+')';
      }
      t+=')';
     }
    }
   }
   if(tab[i][4]=='||'){
    t+='ou';
   }else if(tab[i][4]=='&&'){
    t+='et';
   }else{
    t+=tab[i][4];
   }
   if(tab[i][0][3]>0){
    var obj=boucleRecursiveSurCondition1(tab,i+1,tab[i][0][0],tab[i][0][1]);
    if(obj.status==true){
     t+=obj.value;
    }else{
     return logerreur({'status':false,'message':'erreur recursif'});
    }
   }
   
   
   if(tab[i][0][0]>niveau1){
    t+=')'.repeat(tab[i][0][0]-niveau1);
   }

   
  }
 
 }
 return {'status':true,'value':t};
}
//=====================================================================================================================
function decomposeConditionEnTableau1(ch){

 var tab1=[];
 var t='';
 var variable1='';
 var niveau=0;
 var c1='';
 var c2='';
 var dansChaineDouble=false;
 var dansChaineSimple=false;
 var i=0;
 var j=0;
 var l01=ch.length;
 var id=0;
 var parentId=0;
 //           niveau , id  , parentId    nbEnf     1            2   3avant   4apres
 tab1.push([ [niveau , id  , parentId ,  0     ] , variable1 , [] , ''      , ''     , '' , [[ '' , '' , [ '' , '' , '' ] ]] ]);
 
 // phase 1 : séparation des parenthèses
 for(i=0;i<l01;i++){
  var c1=ch.substr(i,1);
  if(dansChaineDouble){
  
   variable1+=c1;
   if(c1=='"'){
    dansChaineDouble=false;
   }else{
   
    for(j=i+1;j<l01;j++){
     c2=ch.substr(j,1);
     if(c2=='"'){
      if(c1=='\\'){
       variable1+=c2;
      }else{
       variable1+=c2;
       dansChaineDouble=false;
       i=j;
       break;
      }
     }else{
      variable1+=c2;
     }
    }
   }
   
  }else if(dansChaineSimple){
  
   variable1+=c1;
   if(c1=='\''){
    dansChaineSimple=false;
   }else{
   
    for(j=i+1;j<l01;j++){
     c2=ch.substr(j,1);
     if(c2=='\''){
      if(c1=='\\'){
       variable1+=c2;
      }else{
       variable1+=c2;
       dansChaineSimple=false;
       i=j;
       break;
      }
     }else{
      variable1+=c2;
     }
    }
   }
   
  
  
  }else if(c1=='('){
   
   var temp=monTrim(variable1);
   var ctemp=temp.substr(temp.length-1,1);
   if(ctemp=='|' || ctemp=='&' || ctemp=='<' ){
    //C'est une parenthèse dans les conditions mais pas une parenthèse sur une fonction
    variable1=variable1.replace(/\n/g,' ')
    variable1=monTrim(variable1);
    
    if(variable1!==''){
     if(variable1.substr(variable1.length-1,1)=='!'){
      variable1=variable1.substr(0,variable1.length-1);
      variable1=monTrim(variable1);
      variable1+='!';
     }
     id++;
     tab1.push([ [niveau,id,parentId,0] , variable1 , [] , '' , '' , '' , [['' , '' , [ '' , '' , '' ] ]] ]);
    }
    niveau++;
    variable1='';
    
   }else{
    variable1+=c1;
    
   }
   
   
  }else if(c1==')'){
   variable1=variable1.replace(/\n/g,' ')
   variable1=monTrim(variable1);
   if(variable1!==''){
    id++;
    tab1.push([ [niveau,id,parentId,0] , variable1 , [] , '' , '' , '' , [['' , '' , [ '' , '' , '' ] ]] ]);
   }
   variable1='';
   niveau--;
  }else if(c1=='\''){
   dansChaineSimple=true;
   variable1+=c1;
  }else if(c1=='"'){
   dansChaineDouble=true;
   variable1+=c1;
  }else{
   variable1+=c1;
  }
 }
 
 
 variable1=variable1.replace(/\n/g,' ')
 variable1=monTrim(variable1);
 if(variable1!==''){
  id++;
  tab1.push([ [niveau,id,parentId,0] , variable1 , [] , '' , '' , '' , [[ '' , '' , [ '' , '' , '' ] ]] ]);
 }
 for(var i=tab1.length-1;i>=1;i--){
  var niv=tab1[i][0][0];
  for(var j=i-1;j>=1;j--){
   if(niv>tab1[j][0][0]){
    tab1[i][0][2]=tab1[j][0][1];
    break;
   }
  }
 }
 
 for(var i=tab1.length-1;i>0;i--){
  var par=tab1[i][0][2];
  tab1[par][0][3]++
 }

 //======================================================================
 // phase 2 : chaque groupe de parenthèse représente une ligne du tableau
 //======================================================================

 
 var niveauprecedent=999;
 var l01=tab1.length;
 // on sépare les && et ||
 
 for(i=1;i<l01;i++){
  c1=tab1[i][1];
  console.log('niveau et c1='+tab1[i][0][0]+'"'+c1+'"');
  //dans chaque ligne , on explose les && et les || 
  if(c1.length>=3){
   if(c1.substr(0,3)=='&&!' || c1.substr(0,3)=='||!'){
    tab1[i][3]=c1.substr(0,3);
    c1=c1.substr(3);
   }else if(c1.substr(0,2)=='&&' || c1.substr(0,2)=='||'){
    tab1[i][3]=c1.substr(0,2);
    c1=c1.substr(2);
   }
  }else if(c1.length>=2){
   if(c1.substr(0,2)=='&&' || c1.substr(0,2)=='||'){
    tab1[i][3]=c1.substr(0,2);
    c1=c1.substr(2);
   }
  }
  if(niveauprecedent<tab1[i][0][0] && c1!='' && tab1[i-1][4]=='' ){
   // si le niveau courant est inférieur au niveau suivant, la ligne doit de terminer par
   // un "&&!" ou un "||!" ou un "&&" ou un "||"
   if(i<l01-1){
    
    if(c1.length>=3){
     if(c1.substr(c1.length-3,3)=='&&!' || c1.substr(c1.length-3,3)=='||!'){
      tab1[i][4]=c1.substr(c1.length-3,3);
      c1=c1.substr(0,c1.length-3)
     }else if(c1.substr(c1.length-2,2)=='&&' || c1.substr(c1.length-2,2)=='||'){
      tab1[i][4]=c1.substr(c1.length-2,2);
      c1=c1.substr(0,c1.length-2)
     }else{
      return logerreur({'status':false,'message':'un || ou un && devrait précéder une "(" dans une condition'});
     }
    }else if(c1.length>=2){
     if(c1.substr(c1.length-2,2)=='&&' || c1.substr(c1.length-2,2)=='||'){
      tab1[i][4]=c1.substr(c1.length-2,2);
      c1=c1.substr(0,c1.length-2)
     }else{
      return logerreur({'status':false,'message':'un || ou un && devrait précéder une "(" dans une condition'});
     }
    }
   }
   
  }
  tab1[i][5]=c1;
  // tab1[i][5] contient des elements de type condition1 && condition2 || condition 3
  // dans tab1[i][6] on explose ces conditions sous la forme [['|et|ou','conditionX'],...]
  dansChaineDouble=false;
  dansChaineSimple=false;
  variable1='';
  var textEtOu='';
  var indiceCondition=0;
  
  for(var j=0;j<tab1[i][5].length-1;j++){
   c1=tab1[i][5].substr(j,1);
   textEtOu=tab1[i][5].substr(j,2);
   if(dansChaineDouble){
   
    variable1+=c1;
    if(c1=='"'){
     dansChaineDouble=false;
    }else{
    
     for(j=i+1;j<l01;j++){
      c2=ch.substr(j,1);
      if(c2=='"'){
       if(c1=='\\'){
        variable1+=c2;
       }else{
        variable1+=c2;
        dansChaineDouble=false;
        i=j;
        break;
       }
      }else{
       variable1+=c2;
      }
     }
    }
    
   }else if(dansChaineSimple){
   
    variable1+=c1;
    if(c1=='\''){
     dansChaineSimple=false;
    }else{
    
     for(j=i+1;j<l01;j++){
      c2=ch.substr(j,1);
      if(c2=='\''){
       if(c1=='\\'){
        variable1+=c2;
       }else{
        variable1+=c2;
        dansChaineSimple=false;
        i=j;
        break;
       }
      }else{
       variable1+=c2;
      }
     }
    }
   }else if(textEtOu=='&&' || textEtOu=='||'){
    tab1[i][6][indiceCondition][1]=monTrim(variable1);
    tab1[i][6].push([textEtOu,'',[ '' , '' , '' ]]);
    indiceCondition++;
    variable1='';
    j++;
   }else{
    variable1+=c1;
   }
  }
  variable1+=tab1[i][5].substr(tab1[i][5].length-1,1)
  if(variable1=='|'||variable1=='&'){
   variable1='';
  }
  tab1[i][6][indiceCondition][1]=monTrim(variable1);
  
   
  dansChaineDouble=false;
  dansChaineSimple=false;
  variable1='';
  var textTest1='';
  var textTest2='';
  var textTest3='';
  var indiceTest=0;
  
  for(var j=0;j<tab1[i][6].length;j++){
  
   var l02=tab1[i][6][j][1].length;
   var str1=tab1[i][6][j][1];
   
   for(var k=0;k<l02;k++){
   
    c1=str1.substr(k,1);
    textTest1=str1.substr(k,1);
    textTest2=str1.substr(k,2);
    textTest3=str1.substr(k,3);
    if(dansChaineDouble){
    
     variable1+=c1;
     if(c1=='"'){
      dansChaineDouble=false;
     }else{
     
      for(var l=k+1;l<l02;l++){
       c2=ch.substr(l,1);
       if(c2=='"'){
        if(c1=='\\'){
         variable1+=c2;
        }else{
         variable1+=c2;
         dansChaineDouble=false;
         k=l;
         break;
        }
       }else{
        variable1+=c2;
       }
      }
     }
     
    }else if(dansChaineSimple){
    
     variable1+=c1;
     if(c1=='\''){
      dansChaineSimple=false;
     }else{
     
      for(var l=k+1;l<l02;l++){
       c2=ch.substr(l,1);
       if(c2=='\''){
        if(c1=='\\'){
         variable1+=c2;
        }else{
         variable1+=c2;
         dansChaineSimple=false;
         k=l;
         break;
        }
       }else{
        variable1+=c2;
       }
      }
     }
    }else if(textTest3=='===' || textTest3=='!=='){
     tab1[i][6][j][2][0]=textTest3;
     tab1[i][6][j][2][1]=monTrim(str1.substr(0,k));
     tab1[i][6][j][2][2]=monTrim(str1.substr(k+3));
     break;
    }else if(textTest2=='==' || textTest2=='!='  || textTest2=='<=' || textTest2=='>='){
     tab1[i][6][j][2][0]=textTest2;
     tab1[i][6][j][2][1]=monTrim(str1.substr(0,k));
     tab1[i][6][j][2][2]=monTrim(str1.substr(k+2));
     break;
    }else if(textTest1=='>' || textTest1=='<'  ){
     tab1[i][6][j][2][0]=textTest1;
     tab1[i][6][j][2][1]=monTrim(str1.substr(0,k));
     tab1[i][6][j][2][2]=monTrim(str1.substr(k+1));
     break;
    }else{
     if(c1=='"'){
      dansChaineDouble=true;
     }else if(c1=='\''){
      dansChaineSimple=true;
     }else{
      variable1+=c1;
     }
    }   
   
   
   
   }
  }  
  niveauprecedent=tab1[i][0][0];
 }
 

// console.log('\n====ch=\n'+ch+'\n==== conditions ===========================\ntab1=',tab1);
 
 
 
 
 return {'status':true,'value':tab1}
 
}

//=================================================================================================
function ExploseBlocEnTableau(tab1,indin,source){
 var tab2=[];
 var niveauAccolade=0;
 var niveauParenthese=0;
 var niveauCrochet=0;
 var niveauParentheseIf=0;
 var niveauParentheseFor=0;
 var typeElement='';
 var i=0;
 var j=0;
 var l01=source.length;
 var dansConstante=false;
 var typeConstante='';
 var dansCommentaireLigne=false;
 var dansCommentaireBloc=false;
 var dansVariable=false;
 var c0='';
 var c0m1=''; // caractère précédent ( moins 1 )
 var c0p1=''; // caractère suivant   ( plus  1 )
 var finConstante=false;
 var debutPrecedent=0;
 var chaine1='';
 var ind=-1;
 
 
 for(i=0;i<l01;i++){
  c0=source.substr(i,1);
  if(i>1){
   c0m1=source.substr(i-1,1);
  }
  c0p1='';
  if(i<l01){
   c0p1=source.substr(i+1,1);
  }
  
  if(dansConstante===true){
   finConstante=false;
   if(      c0=="'" && typeConstante=="'" && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='"' && typeConstante=='"' && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='`' && typeConstante=='`' && c0m1!=='\\' ){
    finConstante=true;
   }
   if(finConstante===true){
    dansConstante=false;
    chaine1+=c0;
    ind++;
    //         0   1              2                3             4 5           6
    tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
    chaine1='';
   }else{
    chaine1+=c0;
   }

  }else if(dansCommentaireLigne===true){
   if(c0=='\r' || c0=='\n'){
    dansCommentaireLigne=false;
   }    
  }else if(dansCommentaireBloc===true){
   
   if(c0m1=='*' && c0=='/' ){
    debutPrecedent=i+1;
    dansCommentaireBloc=false;
   }
  }else if(niveauParentheseIf>0){
   if(c0==')'){
    niveauParentheseIf--;
    if(niveauParentheseIf===0){
     ind++;
     console.log('parenthèse if chaine1="'+chaine1+'"')
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'conditionIf',chaine1]);

/*     

     var temporaireeeeeeeeeeeeeeeeeeeeee=decomposeConditionEnTableau1(chaine1);
     if(temporaireeeeeeeeeeeeeeeeeeeeee.status===true){
      var tab1=temporaireeeeeeeeeeeeeeeeeeeeee.value;
      console.log('tab1='+JSON.stringify(tab1));
      console.log('tab1=',tab1);
      var temporaireeeeeeeeeeeeeeeeeeeeee=boucleRecursiveSurCondition1(tab1 , 1 , 0 , 0);
      if(temporaireeeeeeeeeeeeeeeeeeeeee.status===true){
       console.log('chaine1='+chaine1);
       console.log('apres recur condition, temporaireeeeeeeeeeeeeeeeeeeeee=',temporaireeeeeeeeeeeeeeeeeeeeee);
      }
     }

*/

     chaine1='';
    }else{
     chaine1+=c0;
    }
   }else if(c0=='('){
    niveauParentheseIf++;
    chaine1+=c0;
   }else{
    chaine1+=c0;
   }
   
  }else{
   
   // tous les autres cas
   
   if(c0=="'" || c0=='"' || c0=='`' ){
    chaine1+=c0;
    dansConstante=true;
    typeConstante=c0;

   }else if(c0=='/'){
    if(c0m1=='/'){
     dansCommentaireLigne=true;
    }else{
     chaine1+=c0;;
    }

   }else if(c0=='*'){
    if(c0m1=='/'){
     dansCommentaireBloc=true;
    }

   }else if(c0=='('){
    
    if(chaine1!=''){
     if(ind>=0 && tab2[ind][6]=='function'){
      ind++;
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'definitionFonction',chaine1]);
     }else{
      if(chaine1=='for'){
       ind++;
       tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'for',chaine1]);
       niveauParentheseFor++;
      }else if(chaine1=='if'){
       ind++;
       tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'if',chaine1]);
       niveauParentheseIf=1;
      }else{
       if(niveauParentheseFor>0){
        ind++;
        tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'ParentheseDansConditionIf',chaine1]);
        niveauParentheseFor++;
       }else if(niveauParentheseIf>0){
        ind++;
        tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'ParentheseDansConditionIf',chaine1]);
        niveauParentheseIf++;
       }else{
        ind++;
        tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'debutAppelFonction',chaine1]);
       }
      }
     }
     chaine1='';

    }
    dansVariable=false;
    niveauParenthese++;
   }else if(c0==')'){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauParenthese--;
    
    if(niveauParentheseIf>0){
     niveauParentheseIf--;
    }
    
    if(niveauParentheseFor>0){
     niveauParentheseFor--;
    }
    
    dansVariable=false;

   }else if(c0=='['){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauCrochet++;
   }else if(c0==']'){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauCrochet--;

   }else if(c0=='{'){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }

    chaine1='';
    niveauAccolade++;
    dansVariable=false;

   }else if(c0=='}'){

    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauAccolade--;
    dansVariable=false;
    ind++;
    tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,c0]);
    chaine1='';
    

   }else if(c0=='+' || c0=='-' || c0=='*' || c0=='/'){

    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    ind++;
    tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,c0]);
    chaine1='';
    if(c0m1=='+' || c0m1=='-'){ // ++ --
     debugger;
    }


   }else if(c0=='=' ){

    if(chaine1!=''){
     if(dansVariable===true && tab2[tab2.length-1][6]==',' ){
      ind++;
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'debutVariable',chaine1]);
     }else if(dansVariable===true && tab2[tab2.length-1][6]=='var' ){
      tab2[tab2.length-1][6]=chaine1;
     }else{
      ind++;
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     }
     chaine1='';
    }
    if(c0m1=='+' || c0m1=='-' || c0m1=='*' || c0m1=='/'){ // += -= *= /=
     ind++;
     tab2[tab2.length-1][6]=c0m1+c0; // l'opération précédente est un raccourci
     chaine1='';
    }else{
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,c0]);
     chaine1='';
    }


   }else if(c0==','){
    
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    ind++;
    tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,c0]);
    
   }else if(c0==';'){
    
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    ind++;
    tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,c0]);
    if(dansVariable===true){
     dansVariable=false;
    }
    
   }else if(c0==' ' || c0=='\r'  || c0=='\n'  || c0=='\t' ){
    if(chaine1!=''){
     ind++;
     //         0   1              2                3             4 5
     if(chaine1=='var'){
      dansVariable=true;
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'debutVariable',chaine1]);
     }else{
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     }
     chaine1='';
    }
   }else{
    chaine1+=c0;
   }
  }
 }
 return {'status':true,'value':tab2};
//                 0   1              2                3             4 5           6
//      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);

 
}

//=================================================================================================
function analyseDeclaration1(tab3,indDebut){
 var i=0;
 var j=0;
 var t='';
 var niveau=tab3[indDebut][1];
 var esp0=' '.repeat(NBESPACESREV*niveau);
 var esp1=' '.repeat(NBESPACESREV);
 var l01=tab3.length;

 
 var dernier=indDebut;
 for(j=indDebut+1;j<l01;j++){
  if(tab3[j][6]==';' || tab3[j][6]==','){
   dernier=j
   break;
  }
 }
 t+=esp0+'declare(';
 t+=' '+tab3[indDebut][6];
 t+=' '+',';
 if(dernier==indDebut+1){
  t+=' '+'null';
 }else if(dernier==indDebut+3){
  t+=' '+tab3[dernier-1][6];
 }else{
  debugger;
 }
 t+=')';
 
 return {'status':true,'value':t,'dernier':dernier};
 
}
//=================================================================================================
function analyseFonction1(tab3,indDebut , indFin ){
 var t='';
 
 var niveau=tab3[indDebut][1];
 var esp0=' '.repeat(NBESPACESREV*niveau);
 var esp1=' '.repeat(NBESPACESREV);
 var lesArguments='';
 var dernier=indFin;
 t+=esp0+'fonction(';
 t+='\n'+esp0+esp1+'definition(';
 t+='\n'+esp0+esp1+esp1+'nom('+tab3[indDebut][6]+'),';
 for(var i=0;i<indFin;i++){
  if(tab3[indDebut][1]==tab3[i][1] && tab3[indDebut][2]+1==tab3[i][2] ){
   for(var j=i;j<indFin;j++){
    if(tab3[indDebut][1]==tab3[j][1] && tab3[indDebut][2]+1==tab3[j][2] ){
     if(tab3[j][6]!=','){
      if(lesArguments!=''){
       lesArguments+=',';
      }
      lesArguments+='\n'+esp0+esp1+esp1+'argument('+tab3[j][6]+')';
     }
    }
   }
   break;
  }
 }
 if(lesArguments!=''){
  t+=lesArguments;
 }
 t+='\n'+esp0+esp1+'),';
 t+='\n'+esp0+esp1+'contenu(';
 t+='\n'+esp0+esp1+'';
 var indiceDebut=indDebut+1;
 for(var j=indiceDebut;j<indFin;j++){
  if(tab3[j][1]>tab3[indDebut][1] || tab3[j][2]>tab3[indDebut][2] ){ // niveau accolade et niveauParenthese
   indiceDebut=j;
   break;
  }
 }
 
 var obj1=analyseUnePartieDuTableauDeCode(tab3,indiceDebut,indFin);
 if(obj1.status===true){
  t+=obj1.value;
 }
 t+='\n'+esp0+esp1+')';
 t+='\n'+esp0+')';
 
 return {'status':true,'value':t,'dernier':dernier};
 
}

//=================================================================================================
function analyseUnePartieDuTableauDeCode(tab4,indDebut,indFin){
 
 var t='';
 var i=0;
 
 for(i=indDebut;i<indFin;i++){
  
  if(tab4[i][5]=="debutVariable"){
   
   var obj2=analyseDeclaration1(tab4,i)
   if(obj2.status===true){
    if(t!==''){
     t+=',\n';
     t+=' '.repeat(NBESPACESREV*tab4[i][1]);
    }     
    t+=obj2.value;
    i=obj2.dernier;
   }else{
    return {'status':false,'value':t};
   }
   
  }else if(tab4[i][5] == "definitionFonction" ){
   
   var indiceDeFin=indFin;
   for(var j=i+1;j<indFin;j++){
    if(tab4[j][1]==tab4[i][1] && tab4[j][2]==tab4[i][2] ){ // niveau accolade et niveauParenthese
     indiceDeFin=j-1;
     break;
    }
   }
   
   var obj2=analyseFonction1(tab4,i , indiceDeFin )
   if(obj2.status===true){
    if(t!==''){
     t+=',\n';
     t+=' '.repeat(NBESPACESREV*tab4[i][1]);
    }     
    t+=obj2.value;
    i=obj2.dernier;
   }else{
    return {'status':false,'value':t};
   }
   
  }
  
  
  
 }
 
 return {'status':true,'value':t};
 
}
//=================================================================================================
function analyseBlocDeCode(tab1,indin){
 
 var t='';
 var i=0;
 var j=0;
 
 var source=tab1[indin][1];
 var obj1=ExploseBlocEnTableau(tab1,indin,source);
 if(obj1.status===true){
  console.log(' 0   1              2                3             4 5    6');
  console.log('[ind,niveauAccolade,niveauParenthese,niveauCrochet,0,type,chaine1]');
  console.log(obj1.value);
  var obj2=analyseUnePartieDuTableauDeCode(obj1.value,0,obj1.value.length);
  if(obj2.status==true){
   if(t!==''){
    t+=',\n';
    t+=' '.repeat(NBESPACESREV*tab1[i][1]);
   }     
   t+=obj2.value;
  }else{
   return {'status':false,'message':'Erreur dans analyseUnePartieDuTableauDeCode '};
  }
 }else{
  return {'status':false,'message':'Erreur dans ExploseBlocEnTableau '};
 }
 return {'status':true,'value':t};
}

//=================================================================================================
function analyseRacine(source){
 // analyse un source à partir de la facine pour le séparer en blocs de fonctions
 var tab1=[];
 var niveau=0;
 var i=0;
 var j=0;
 var l01=source.length;
 var dansConstante=false;
 var typeConstante='';
 var dansCommentaireLigne=false;
 var dansCommentaireBloc=false;
 var c0='';
 var c0m1=''; // caractère précédent
 var finConstante=false;
 var debutPrecedent=0;
 var chaine1='';
 var chaineTotale='';

 
 tab1.push(['racine','',0,0]);

 
 for(i=0;i<l01;i++){
  c0=source.substr(i,1);
  if(i>1){
   c0m1=source.substr(i-1,1);
  }
  
  if(dansConstante===true){
   finConstante=false;
   if(      c0=="'" && typeConstante=="'" && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='"' && typeConstante=='"' && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='`' && typeConstante=='`' && c0m1!=='\\' ){
    finConstante=true;
   }
   if(finConstante===true){
    dansConstante=false;
   }
   chaine1+=c0;
   chaineTotale+=c0;

  }else if(dansCommentaireLigne===true){
   
   if(c0=='\r' || c0=='\n'){
    dansCommentaireLigne=false;
   }    
   chaineTotale+=c0;
   
  }else if(dansCommentaireBloc===true){
   
   chaineTotale+=c0;
   
   if(niveau==0 && c0m1=='*' && c0=='/' ){
    tab1[tab1.length-1][1]=source.substr(debutPrecedent,i-debutPrecedent+1);
    tab1[tab1.length-1][2]=debutPrecedent;
    tab1[tab1.length-1][2]=i-debutPrecedent+1;
    chaine1='';
    chaineTotale='';
    debutPrecedent=i+1;
    dansCommentaireBloc=false;
   }
   
  }else{
   
   // autres que constantes et commentaires 
   
   if(c0=="'" || c0=='"' || c0=='`' ){
    
    chaineTotale+=c0;
    chaine1+=c0;
    dansConstante=true;
    typeConstante=c0;

   }else if(c0=='/'){

    chaine1+=c0;
    if(c0m1=='/'){ // //
     dansCommentaireLigne=true;
    }
    chaineTotale+=c0;

   }else if(c0=='*'){
    chaineTotale+=c0;
    if(c0m1=='/'){
     dansCommentaireBloc=true;
     if(niveau==0){
      if(chaine1!=''){
       if(chaine1.length>1){
        chaine1=chaine1.substr(0,chaine1.length-1); // on retire le "/" ajouté précédemment à chaine 1
       }
       tab1.push(['racine',chaine1,0,0]);
       chaine1='/'; // puis on l'ajoute ici
      }
      tab1.push(['commentaireBlocRacine','',0,0]);
      debutPrecedent=i-1;
     }
    }
    chaine1+=c0;

   }else if(c0=='{'){

    chaineTotale+=c0;
    chaine1+=c0;
    niveau++;

   }else if(c0=='}'){

    chaineTotale+=c0;
    chaine1+=c0;
    niveau--;
    if(niveau==0 && tab1[tab1.length-1][0]=='fonctionRacine'){
     tab1[tab1.length-1][1]=source.substr(debutPrecedent,i-debutPrecedent+1)+';';
     tab1[tab1.length-1][2]=debutPrecedent;
     tab1[tab1.length-1][2]=i-debutPrecedent+1;
     debutPrecedent=i;
     chaineTotale='';
     chaine1='';
     
    }

   }else if(c0==' ' || c0=='\r'  || c0=='\n'  || c0=='\t'  || c0=='('  || c0==')'  || c0=='['  || c0==']'  || c0==';' ){
    
    //tout ce qui peut précéder une définition de fonction au niveau de la racine
    if(niveau==0 && chaine1.substr(chaine1.length-8,8)=='function'){
     tab1[tab1.length-1][1]=source.substr(debutPrecedent,i-8);
     tab1[tab1.length-1][2]=debutPrecedent;
     tab1[tab1.length-1][2]=i-8;
     chaineTotale='';
     debutPrecedent=i-8;
     
     tab1.push(['fonctionRacine','',0,0]);
     chaine1='function';
    }
    chaineTotale+=c0;
    chaine1+=c0;
   }else{
    chaine1+=c0;
   }
  }
 }
 if(chaineTotale!==''){
   tab1[tab1.length-1][1]=source.substr(debutPrecedent);;
   tab1[tab1.length-1][2]=debutPrecedent;
   tab1[tab1.length-1][2]=source.length-debutPrecedent;
 }

 return{'status':true,'value':tab1};

}
//=================================================================================================
//=================================================================================================
//=================================================================================================
function monParse(source){
 var t='';
 var i=0;
 // 1°) séparation entre racine et fonctions à la racine
 var objTableauProgramme=analyseRacine(source);
 if(objTableauProgramme.status==true){
  console.log(objTableauProgramme.value);
 }else{
  return(logerreur({'status':false,'message':'erreur dans monParse '}));
 }
 for(var i=0;i<objTableauProgramme.value.length;i++){
  if(objTableauProgramme.value[i][0]!=='commentaireBlocRacine'){
   var temp=objTableauProgramme.value[i][1];
   temp=temp.replace(/\r/g,  '' ).replace(/\n/g,  '' );
   if(temp!==''){
    var objBloc1=analyseBlocDeCode(objTableauProgramme.value , i , );
    if(objBloc1.status===true){
     if(t!==''){
      t+=',\n';
     }     
     t+=objBloc1.value;
    }
   } 
  }
 }
 
 
 
 return{'status':true,'value':t};
 
}
//=================================================================================================