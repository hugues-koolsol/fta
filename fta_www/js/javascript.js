"use strict";
/*
var global_enteteTableau=[
 ['id','id'                                 ,''], // 00
 ['val','value'                             ,''],
 ['typ','type'                              ,''],
 ['niv','niveau'                            ,''],
 ['coQ','constante quotee'                  ,''],
 ['pre','position du premier caractère'     ,''], // 05
 ['der','position du dernier caractère'     ,''],
 ['pId','Id du parent'                      ,''], // 10 ->  7
 ['nbE','nombre d\'enfants'                 ,''], // 11 ->  8
 ['nuE','numéro enfants'                    ,''], // 12 ->  9
 ['pro','profondeur'                        ,''], // 15 -> 10
 ['pop','position ouverture parenthese'     ,''], // 22 -> 11
 ['pfp','position fermeture parenthese'     ,''], // 23 -> 12
 ['com','commentaire'                       ,''],  
];

*/
//=====================================================================================================================
function parseJavascript0(tab,id,niveau){
 var i=0;
 var t='';
 var obj={};
 var retJS=js_tabTojavascript1(tab,id,false,false,niveau);
 if(retJS.status===true){
  t+=retJS.value;
//   console.log('%c'+retJS.value,'color:blue');
 }else{
  console.error(retJS);
  return {status:false,value:t};
 }
 return {status:true,value:t};
}
//=====================================================================================================================
function js_condition1(tab,id,niveau){
// console.log('js_condition1' , id , tab);
 // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
 var i=0;
 var j=0;
 var btrouve=false;
 var obj={};
 var l=tab.length;
 var t='';
 var max=0;
 var tabPar=[];
 var premiereCondition=true;

 for(i=id+1;i<l;i++){
  max=i;
  if(tab[i][3]<=tab[id][3]){
   break;
  }
 }
 
 if(max==0){
  i=id;
  if((tab[i][1]=='vrai' || tab[i][1]=='faux') && tab[i][4]==false ){ // i18
   t+=tab[i][1]=='vrai'?'true':'false'; // i18
  }else if(tab[i][4]==true){
   t+='\'';
   t+=echappConstante(tab[i][1]);
   t+='\'';
  }else{
   t+=tab[i][1];
  }  
 }else{
  for(i=id;i<max;i++){
   if((tab[i][1]=='non' || tab[i][1]=='et' || tab[i][1]=='ou' || (premiereCondition==true && tab[i][1]=='' ) ) && tab[i][8]>0 && tab[i][2]=='f'){ //i18
    if(tab[i][1]=='non'){
     t+='!';
    }else if(tab[i][1]=='et'){ // i18
     t+='&&';
    }else if(tab[i][1]=='ou'){ // i18
     t+='||';
    }
    // todo tester si arguments
    obj=js_condition1(tab,i+1,niveau);
    if(obj.status==false){
     return logerreur({status:false,value:t,id:id,message:'erreur dans une condition'});
    }
    if( tab[i][1]=='' || tab[i][1]=='non' ){
     t+='(';
    }
    t+=obj.value;
    btrouve=false;
    for(j=i+2;j<max;j++){
     if(tab[j][3]==tab[i+1][3]){
      obj=js_condition1(tab,j,niveau);
      if(obj.status==false){
       return logerreur({status:false,value:t,id:id,message:'erreur dans une sous condition'});
      }
      t+=obj.value;
      
     }
    }
    if( tab[i][1]=='' || tab[i][1]=='non' ){
     t+=')';
    }
    if(!btrouve){
     i=max-1
    }
    
    
    
   }else if(tab[i][1]=='' && tab[i][8]>0  && tab[i][2]=='f' ){
    obj=js_condition1(tab,i+1,niveau);
    if(obj.status==false){
     return logerreur({status:false,value:t,id:id,message:'erreur dans une condition'});
    }
//    t+='(';
    t+=obj.value;
//    t+=')';
    i=max-1;
   }else if( tab[i][1]=='appelf'  && tab[i][2]=='f' ){ // i18
 
    
    obj=js_traiteAppelFonction(tab,i,true,niveau);
    if(obj.status==true){
     t+=obj.value;
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans une condition'});
    }
    i=max-1;
    
    
    
   }else if( (tab[i][1]=='egal' || tab[i][1]=='diff' || tab[i][1]=='sup' || tab[i][1]=='inf'|| tab[i][1]=='supeg' || tab[i][1]=='infeg' ) && tab[i][2]=='f' ){
    if(tab[i][8]==2){
     // trouver les 2 paramètres de la fonction
     tabPar=[];
     for(j=id+1;j<=max;j++){
      if(tab[j][3]==tab[i][3]+1){
       tabPar.push(j);
      }
     }
     if(tab[tabPar[0]][2]=='c'){
      if(tab[tabPar[0]][4]==true){
       t+='\''+echappConstante(tab[tabPar[0]][1])+'\'';
      }else{
       if(tab[tabPar[0]][1]=='vrai' || tab[tabPar[0]][1]=='faux'){
        t+=(tab[tabPar[0]][1]=='vrai'?'true':'false');
       }else{
        t+=tab[tabPar[0]][1];
       }
      }
     }else{
      if(tab[tabPar[0]][2]=='f' && tab[tabPar[0]][1]=='appelf'){ // i18

       obj=js_traiteAppelFonction(tab,tabPar[0],true,niveau);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
       }

      }else{
       return logerreur({status:false,value:t,id:id,message:'erreur dans une condition pour un test egal, diff...' + tab[tabPar[0]][1]});
      }
     }
     if(tab[i][1]=='egal'){
      t+=' == ';
     }else if(tab[i][1]=='diff'){
      t+=' != ';
     }else if(tab[i][1]=='sup'){
      t+=' > ';
     }else if(tab[i][1]=='inf'){
      t+=' < ';
     }else if(tab[i][1]=='supeg'){
      t+=' >= ';
     }else if(tab[i][1]=='infeg'){
      t+=' <= ';
     }
     if(tab[tabPar[1]][2]=='c'){
      if(tab[tabPar[1]][4]==true){
       t+='\''+echappConstante(tab[tabPar[1]][1])+'\'';
      }else{
       if(tab[tabPar[1]][1]=='vrai' || tab[tabPar[1]][1]=='faux'){
        t+=(tab[tabPar[1]][1]=='vrai'?'true':'false');
       }else{
        t+=tab[tabPar[1]][1];
       }
      }
     }else{
      if(tab[tabPar[1]][2]=='f' && tab[tabPar[1]][1]=='appelf'){ // i18
 
       obj=js_traiteAppelFonction(tab,tabPar[1],true,niveau);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
       }
      }else{
       return logerreur({status:false,value:t,id:id,message:'erreur dans une condition pour un test egal, diff...' + tab[tabPar[0]][1]});
      }
     }
     i=max-1;
    }else{
     return logerreur({status:false,value:t,id:id,message:'erreur dans une condition ' + tab[i][1]});
    }
   }else if(tab[i][1]!='' && tab[i][2]=='c' ){
    if((tab[i][1]=='vrai' || tab[i][1]=='faux') && tab[i][4]==false ){ // i18
     t+=tab[i][1]=='vrai'?'true':'false'; // i18
    }else if(tab[i][4]==true){
     t+='\'';
     t+=echappConstante(tab[i][1]);
     t+='\'';
    }else{
     t+=tab[i][1];
    }
   }else if(tab[i][1]=='#'  ){
    if(tab[i][13].indexOf('\n')>=0){
     t+=espacesn(true,niveau);
    }
    var commt=traiteCommentaire2(tab[i][13],niveau,i);
//    console.log('apres traite commentaite2 tab['+i+'][13]='+tab[i][13],'\ncommt='+commt);
    t+='/*' + commt +'*/';
   }else{
    logerreur({status:false,value:t,id:i,message:'les tests sont pour l\'instant egal,diff,sup,inf,supeg,infeg en non pas "'+tab[i][1]+'"' })
    t+=' /* TODO javascript ligne 213 */ ';
   }
  }
  
 }
 
// console.log('\n===================\nt=',t,'\n===================\n'); 
 return {value:t,status:true};
}
//=====================================================================================================================
function js_condition0(tab,id,niveau){
// console.log('js_condition0');
 var t='';
 var i=0;
 var j=0;
 var premiereCondition=true;
 var newTab=[];
 var obj={};
 
 for(i=id+1;i<tab.length && tab[i][3]>tab[id][3];i++){
  if(tab[i][7]==tab[id][0]){
   if(tab[i][1]=='' || tab[i][1]=='non'){
    if(premiereCondition){
     obj=js_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'});
     }
     t+=obj.value;
     premiereCondition=false;
    }else{
     return logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'});
    }
   }else if(tab[i][1]=='et' || tab[i][1]=='ou' ){ // i18
    if(premiereCondition){
     return logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'});
    }else{
     obj=js_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'});
     }
     t+=obj.value;

    }        
   }else if(tab[i][1]=='egal' || tab[i][1]=='diff'  || tab[i][1]=='sup'  || tab[i][1]=='inf' || tab[i][1]=='supeg'  || tab[i][1]=='infeg' ){ // i18
    if(!premiereCondition){
     return {status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est soit "()", soit [egal|sup|inf|diff]'};
    }else{
     obj=js_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'});
     }
     t+=obj.value;
    }        
   }else if(tab[i][1]=='#' ){ // i18
    if(tab[i][13].indexOf('\n')>=0){
     t+=espacesn(true,niveau);
    }
    var commt=traiteCommentaire2(tab[i][13],niveau,i);
//    console.log('apres traite commentaite2 tab['+i+'][13]='+tab[i][13],'\ncommt='+commt);
    t+='/*' + commt +'*/';
    if(tab[i][13].indexOf('\n')>=0){
     t+=espacesn(true,niveau);
    }
    
    
    
   }else{
    return logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou()'});
   }
  }
 }
 
 return {status:true,value:t};
}
//=====================================================================================================================
function js_tabTojavascript1(tab,id,dansFonction,dansInitialisation,niveau){
 var t='';
 var i=0;
 var j=0;
 var k=0;
 var obj={};
 var positionDeclarationFonction=-1;
 var positionContenu=-1;
 var nomFonction='';
 var argumentsFonction='';
 var max=0
 var reprise = 0;
 var tabchoix=[];

 for(i=id;i<tab.length && tab[i][3]>=tab[id][3] ;i++){
  
  if( ( tab[i][1]=='break'  || tab[i][1]=='debugger' ) && tab[i][2]=='f' ){  // i18
   if(tab[i][8]==0){
     t+=espacesn(true,niveau);
     t+=tab[i][1]+';'
   }else{
    console.trace();
    return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans un '+tab[i][1]+' qui doit être sous le format '+tab[i][1]+'() strictement'});
   }
  }else if(tab[i][1]=='revenir' && tab[i][2]=='f' ){  // i18
   if(tab[i][8]==0){
    try{
     t+=espacesn(true,niveau);
     t+='return;'
    }catch(e){
     debugger;
    }
   }else{
    if(tab[i][8]==1){    
     if(tab[i+1][2]=='c'){
      t+=espacesn(true,niveau);
      t+='return '+(tab[i+1][4]===true?'\''+echappConstante(tab[i+1][1])+'\'' : (tab[i+1][1]=='vrai'?'true':(tab[i+1][1]=='faux'?'false':(tab[i+1][1]))))+';';
     }else if(tab[i+1][2]=='f' && tab[i+1][1]=='appelf' ){
       t+=espacesn(true,niveau);
      obj=js_traiteAppelFonction(tab,i+1,true,niveau);
      if(obj.status==true){
       t+='return('+obj.value+');';
      }else{
       console.trace();
       return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
      }
     }else{
       t+=espacesn(true,niveau);
      t+='// todo revenir return args;';
      console.trace();
      return logerreur({status:false,value:t,id:i,tab:tab,message:'javascript non traité'});
     }
    }else{
     t+=espacesn(true,niveau);
     t+='// todo revenir return args;';
     console.trace();
     return logerreur({status:false,value:t,id:i,tab:tab,message:'javascript non traité'});
    }
    reprise=i+1;
    max=i+1;
    for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
   }
   
  }else if(tab[i][1]=='fonction' && tab[i][2]=='f' ){  // i18
   if(dansFonction==true){
    return {status:false,value:t,id:id,tab:tab,message:'on ne peut pas déclarer une fonction dans une fonction'};
   }else{
    dansFonction=true;
    positionDeclarationFonction=-1;
    for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
     if(tab[j][1]=='definition' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){  // i18
      positionDeclarationFonction=j;
      break;
     }
    }
    positionContenu=-1;
    for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
     if(tab[j][1]=='contenu' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){  // i18
      positionContenu=j;
      break;
     }
    }
    if(positionDeclarationFonction>=0 && positionContenu>=0){
     for(j=positionDeclarationFonction+1;j<tab.length && tab[j][3]>tab[positionDeclarationFonction][3];j++){
      if(tab[j][1]=='nom' && tab[j][3]==tab[positionDeclarationFonction][3]+1){  // i18
       if(tab[j][8]==1){
        nomFonction=tab[j+1][1];
       }else{
        return {status:false,value:t,id:id,tab:tab,message:'le nom de la fonction doit être sous la forme  n(xxx) '};
       }
      }
     }
     
     argumentsFonction='';
     for(j=positionDeclarationFonction+1;j<tab.length && tab[j][3]>tab[positionDeclarationFonction][3];j++){
      if(tab[j][1]=='argument' && tab[j][3]==tab[positionDeclarationFonction][3]+1){  // i18
       if(tab[j][8]==1){
        argumentsFonction+=','+tab[j+1][1];
       }else{
        return {status:false,value:t,id:id,tab:tab,message:'les arguments passés à la fonction doivent être sous la forme  a(xxx) '};
       }
      }
     }
     
     
     if(nomFonction!=''){
      
      
      
      t+='\nfunction '+nomFonction+'('+(argumentsFonction==''?'':argumentsFonction.substr(1))+'){';
      if(tab[positionContenu][8]==0){
       t+='\n';
       t+='  // void';
       t+='\n}';
      }else{
       niveau++;
       obj=js_tabTojavascript1(tab,positionContenu+1,dansFonction,false,niveau);
       niveau--;
       if(obj.status==true){
        t+=obj.value;
        t+='\n}';
       }else{
        return {status:false,value:t,id:id,tab:tab,message:'problème sur le contenu de la fonction "'+nomFonction+'"'};
       }
      }
      max=Math.max(positionDeclarationFonction,positionContenu);
      for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
       reprise=j;
      }
      i=reprise;
     }
    }else{
     return {status:false,value:t,id:id,tab:tab,message:'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'};
    }
    dansFonction=false;
   }
   
  }else if(tab[i][1]=='appelf' && tab[i][2]=='f'){ // i18
   obj=js_traiteAppelFonction(tab,i,false,niveau);
   
   if(obj.status==true){
    t+=obj.value;
   }else{
    return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
   }
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
   
  }else if(tab[i][1]=='boucle'  && tab[i][2]=='f'){ // i18
  
   tabchoix=[];
   for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='condition'){ // i18
      tabchoix.push([j,tab[j][1],i]);
     }else if(tab[j][1]=='initialisation'){ // i18
      tabchoix.push([j,tab[j][1],i]);
     }else if(tab[j][1]=='increment'){ // i18
      tabchoix.push([j,tab[j][1],i]);
     }else if(tab[j][1]=='faire'){ // i18
      tabchoix.push([j,tab[j][1],i]);
     }else if(tab[j][1]=='#'){
      tabchoix.push([j,tab[j][1],i]);
     }else{
      return logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),alors())'});
     }
    }    
   } 
//   console.log('tabchoix=',tabchoix);
   var initialisation='';
   var condition='';
   var increment='';
   var faire='';
   for(j=0; j<tabchoix.length;j++){
    if(tabchoix[j][1]=='initialisation'){ // i18
     niveau++;
     obj=js_tabTojavascript1(tab,tabchoix[j][0]+1,dansFonction,true,niveau);
     niveau--;
     if(obj.status==true){
      initialisation+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
     }
     
    }else if(tabchoix[j][1]=='condition'){ // i18
     niveau++;
     obj=js_condition0(tab,tabchoix[j][0],niveau);
     niveau--;
     if(obj.status===true){
      condition+=obj.value;
     }else{
//      console.log(tab[tabchoix[j][0]],tab);
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'1 problème sur la condition du choix en indice '+tabchoix[j][0] });
     }
     
    }else if(tabchoix[j][1]=='increment'){ // i18
     niveau++;
     obj=js_tabTojavascript1(tab,tabchoix[j][0]+1,dansFonction,true,niveau);
     niveau--;
     if(obj.status==true){
      increment+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
     }
     
    }else if(tabchoix[j][1]=='faire'){ // i18
     niveau++;
     obj=js_tabTojavascript1(tab,tabchoix[j][0]+1,dansFonction,false,niveau);
     niveau--;
     if(obj.status==true){
      faire+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
     }
     
    }
    
    
   }
   t+=espacesn(true,niveau);
   t+='for(';
   t+=initialisation;
   t+=';'+condition;
   t+=';'+increment;
   t+='){';
   t+=faire;
   t+=espacesn(true,niveau);
   t+='}';
   
   
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  

  
  }else if(tab[i][1]=='essayer'  && tab[i][2]=='f'){ // i18

   var contenu='';
   var sierreur='';
   var nomErreur=''
   for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='faire' && tab[j][2]=='f'){
      niveau++;
      obj=js_tabTojavascript1(tab,j+1,dansFonction,false,niveau);
      niveau--;
      if(obj.status==true){
       contenu+=obj.value;
      }else{
       return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le contenu du "essayer" ' });
      }
     }else if(tab[j][1]=='sierreur' && tab[j][2]=='f'){
      if(tab[j][8]==2){
       if(tab[j+1][2]=='c'){
        nomErreur=tab[j+1][1];
        if(tab[j+2][1]=='faire' && tab[j+2][2]=='f'){
         if(tab[j+2][8]==0){ // si la fonction faire n'a pas d'enfants 
         }else{
          niveau++;
          obj=js_tabTojavascript1(tab,j+3,dansFonction,false,niveau);
          niveau--;
          if(obj.status==true){
           sierreur+=obj.value;
          }else{
           return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" du "essayer" ' });
          }
         }
        }else{
         return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" le deuxième argiment doit être "faire"' });
        }
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" le premier argiment doit être une variable' });
       }
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" du "essayer" il doit contenir 2 arguments sierreur(e,faire)' });
      }
     }
    }
   }
   t+=espacesn(true,niveau);
   t+='try{';
   t+=contenu;
   t+=espacesn(true,niveau);
   t+='}catch('+nomErreur+'){';
   t+=sierreur;
   t+=espacesn(true,niveau);
   t+='}';
   
  
  
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  }else if(tab[i][1]=='choix'  && tab[i][2]=='f'){ // i18
   

   tabchoix=[];
   var aDesSinonSi=false;
   var aUnSinon=false;
   for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='si'){ // i18
      tabchoix.push([j,tab[j][1],0,tab[j],0]); // position type position du contenu du alors
      for(k=j+1;k<tab.length;k++){ // chercher la position du alors dans le si
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1){ // i18 //  && tab[k][8]>0
        tabchoix[tabchoix.length-1][2]=k+1;
        tabchoix[tabchoix.length-1][4]=tab[k][8]; // nombre d'enfants du alors
        break;
       }
       if(tab[k][3]<tab[j][3]){
        break;
       }
      }
     }else if(tab[j][1]=='sinonsi'){ // i18
      aDesSinonSi=true;
      tabchoix.push([j,tab[j][1],0,tab[j],0]);
      for(k=j+1;k<tab.length;k++){ // chercher la position du alors dans le sinonsi
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1){  // i18  && tab[k][8]>0
        tabchoix[tabchoix.length-1][2]=k+1;
        tabchoix[tabchoix.length-1][4]=tab[k][8]; // nombre d'enfants du alors
        break;
       }
       if(tab[k][3]<tab[j][3]){
        break;
       }
      }
     }else if(tab[j][1]=='sinon'){  // i18
      aUnSinon=true;
      tabchoix.push([j,tab[j][1],0,tab[j],0]);
      for(k=j+1;k<tab.length;k++){ // chercher la position du alors dans le sinon
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1){  // i18  && tab[k][8]>0
        tabchoix[tabchoix.length-1][2]=k+1;
        tabchoix[tabchoix.length-1][4]=tab[k][8]; // nombre d'enfants du alors
        break;
       }
       if(tab[k][3]<tab[j][3]){
        break;
       }
      }
     }else if(tab[j][1]=='#'){
      tabchoix.push([j,tab[j][1],0,tab[j]]);
     }else{
      return logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de choix est choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'});
     }
    }
   }
   
   
   
   // tests divers

   var tabTemp=[];
   for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
    if(tab[i][0]==tab[tab[j][7]][7] || tab[i][0]==tab[j][7]){
     if( (tab[j][1]=='si' || tab[j][1]=='condition' || tab[j][1]=='alors' || tab[j][1]=='sinonsi' || tab[j][1]=='sinon' || tab[j][1]=='#' ) && tab[j][2]=='f' ){
      if(tab[j][1]=='#'){
      }else{
       tabTemp.push(tab[j]);
      }
      
      
     }else{
      return logerreur({status:false,value:t,id:j,tab:tab,message:'file javascript.js : dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "'+JSON.stringify(tab[j])+'" '});
     }
    }
   }
   
   for(j=0;j<tabTemp.length;j++){
    if(j==0){
     if(tabTemp[j][1]=='si' && tabTemp[j+1][1]=='condition' && tabTemp[j+2][1]=='alors'){
      j+=2;
     }else{
      return logerreur({status:false,value:t,id:tabTemp[j][0],tab:tab,message:'un choix doit contenir au moins un "si" , une "condition" et un "alors" en première position [""]'});
     }
    }else{
     if(tabTemp[j][1]=='sinon'){
      if(tabTemp[j+1][1]=='alors' && j+2==tabTemp.length){
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'dans un choix le sinon doit être en derniere position'});
      }
     }
    }
   }

   for(j=0;j<tabchoix.length;j++){
    

    if(tabchoix[j][1]=='#'){
     
     // si le prochain element ayant le même parent est un si alors niveauSi=niveau+1
     // si le prochain element ayant le même parent est un sinon, sinonsi niveauSi=niveau+2
     var niveauSi=niveau+2;
     for(var k=j+1; k<tabchoix.length;k++){
      if(tabchoix[k][1]=='si'){
       niveauSi=niveau+1;
       break;
      }
     }
      
      
     // commentaire 2n
     if(tab[tabchoix[j][0]][13].indexOf('\n')>=0){
      t+=espacesn(true,niveauSi);
     }
     var commt=traiteCommentaire2(tab[tabchoix[j][0]][13],niveauSi,tabchoix[j][0]);
//     console.log('apres traite commentaite2 tab['+tabchoix[j][0]+'][13]='+tab[tabchoix[j][0]][13],'\ncommt='+commt);
     t+='/*' + commt +'*/';
     if(tab[j][13].indexOf('\n')>=0){
      t+=espacesn(true,niveauSi);
     }
     
     
     
    }else if(tabchoix[j][1]=='si'){
     
     
     
     
     var tabComment=[];
     var debutCondition=0;
     for(var k=i+1;k<tab.length && tab[k][3]>tab[i][3];k++){
      if(tab[k][1]=='condition'){
       debutCondition=k;
       break;
      }else if(tab[k][1]=='#' && tab[k][3]==tab[i][3]+2 ){
       tabComment.push(tab[k][13]);
      }
     }
     for(var k=0;k<tabComment.length;k++){

      if(tabComment[k].indexOf('\n')>=0){
       t+=espacesn(true,niveau+1);
      }
      var commt=traiteCommentaire2(tabComment[k],niveau+1,tabchoix[j][0]);
//      console.log('apres traite commentaite2 tabComment[k]='+tabComment[k],'\ncommt='+commt); // commentaire 30
      t+='/*' + commt +'*/';
      if(tabComment[k].indexOf('\n')>=0){
       t+=espacesn(true,niveau+1);
      }
      
     }

     t+=espacesn(true,niveau);
     t+='if(';


     niveau++;
     obj=js_condition0(tab,debutCondition,niveau);
     niveau--;
     if(obj.status===true){
      t+=obj.value;
     }else{
//      console.log(tab[tabchoix[j][0]],tab);
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'2 problème sur la condition du choix en indice '+tabchoix[j][0] });
     }
     t+='){';
     
     
     
     if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il n'est pas vide
      niveau++;
      obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
      niveau--;
      if(obj.status==true){
       t+=obj.value;
      }else{
       return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
      }
     }
     
     
     if(aDesSinonSi){
     }else{
      if(aUnSinon){
      }else{
       t+=espacesn(true,niveau);
       t+='}';
      }
     }
     
    }else if(tabchoix[j][1]=='sinonsi'){
     
     
     var tabComment=[];
     var debutCondition=0;
     for(var k=tabchoix[j][0];k<tab.length && tab[k][3]>tab[i][3];k++){
      if(tab[k][1]=='condition'){
       debutCondition=k;
       break;
      }else if(tab[k][1]=='#'){
       tabComment.push(tab[k][13]);
      }
     }
     for(var k=0;k<tabComment.length;k++){

      if(tabComment[k].indexOf('\n')>=0){
       t+=espacesn(true,niveau+1);
      }
      var commt=traiteCommentaire2(tabComment[k],niveau+1,tabchoix[j][0]);
//      console.log('apres traite commentaite2 tabComment[k]='+tabComment[k],'\ncommt='+commt); // commentaire 30
      t+='/*' + commt +'*/';
      if(tabComment[k].indexOf('\n')>=0){
       t+=espacesn(true,niveau+1);
      }
      
     }

     t+=espacesn(true,niveau);
     t+='}else if(';
     
     niveau++
     obj=js_condition0(tab,debutCondition,niveau);
     niveau--;
     if(obj.status===true){
      t+=obj.value;
     }else{
//      console.log(tab[tabchoix[j][0]],tab);
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'3 problème sur la condition du choix en indice '+tabchoix[j][0] });
     }
     t+='){';
     
     
     if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il n'est pas vide
      niveau++;
      obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
      niveau--;
      if(obj.status==true){
       t+=obj.value;
      }else{
       return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
      }
     }
     
     if(aUnSinon){
     }else{
      if(j==tabchoix.length-1){ // si c'est le dernier sinonsi
       t+=espacesn(true,niveau);
       t+='}';
      }
     }
     
    }else{
     t+=espacesn(true,niveau);
     t+='}else{';
     if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il n'est pas vide
      niveau++;
      obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
      niveau--;
      if(obj.status==true){
       t+=obj.value;
      }else{
       return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
      }
     }
     t+=espacesn(true,niveau);
     t+='}';
     
    }
   }

   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
      

  }else if(tab[i][1]=='affecteFonction'  && tab[i][2]=='f'){ // i18

   if(tab[i+1][2]=='c' && tab[i][8]>=2 ){
   }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,[p(yyy),]contenu())'});
   }

   var tabTemp=[];
   var listeParametres
   var positionContenu=-1;
   argumentsFonction='';
   
   // r.onreadystatechange = function () {
   
   for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
    if( tab[j][1]=='contenu' && tab[j][3]==tab[i][3]+1 && tab[j][2]=='f' ){
     positionContenu=j;
    }else{
     if( tab[j][1]=='p' && tab[j][3]==tab[i][3]+1){
      if( tab[j][8]==1 && tab[j+1][2]=='c' ){
       argumentsFonction+=','+tab[j+1][1];
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'dans affecteFonction, les parametres doivent être des variables affecteFonction(xxx,[p(yyy),]contenu()) '});
      }
     }
    }
   }
   if(positionContenu>0){
    niveau++;
    obj=js_tabTojavascript1(tab,positionContenu+1,dansFonction,false,niveau);
    niveau--;
    if(obj.status==true){
     if(!dansInitialisation){
      t+=espacesn(true,niveau);
     }
     // r.onreadystatechange = function () {}
     t+=''+tab[i+1][1]+'=function('+(argumentsFonction==''?'':argumentsFonction.substr(1))+'){';
     t+=obj.value;
     if(!dansInitialisation){
      t+=espacesn(true,niveau);
     }
     t+='}'
    }else{
    }
   }else{
    return logerreur({status:false,value:t,id:i,tab:tab,message:'dans affecteFonction, il faut un contenu() : affecteFonction(xxx,[p(yyy),]contenu())'});
   }


  
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
  //=====================================================================================
  }else if(tab[i][1]=='affecte'  && tab[i][2]=='f'){ // i18
  
   if(!dansInitialisation){
    t+=espacesn(true,niveau);
   }
   if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    t+=''+tab[i+1][1]+'='+(tab[i+2][4]===true?'\''+echappConstante(tab[i+2][1])+'\'' : (tab[i+2][1]=='vrai'?'true':(tab[i+2][1]=='faux'?'false':tab[i+2][1]) )+'');
    if(!dansInitialisation){
     t+=';';
    }
   
   }else if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='appelf' ){
    
    obj=js_traiteAppelFonction(tab,i+2,true,niveau);
    if(obj.status==true){
     t+=''+tab[i+1][1]+'='+obj.value;
     if(!dansInitialisation){
      t+=';';
     }
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de affecte il faut un nom de fonction à appeler n(xxxx)'});
    }

   }else if(tab[i][8]==2 && tab[i+1][2]=='f' && tab[i+1][1]=='appelf' ){
    
    obj=js_traiteAppelFonction(tab,i+1,true,niveau);
    if(obj.status==true){
     t+=''+obj.value+'=';
     // trouver 'x' dans "affecte( appelf(...) , x )"
     for(j=i+1;j<tab.length;j++){
      if(tab[j][7]==i && tab[j][9]=='2'){
       if(tab[j][2]=='c'){
        t+=(tab[j][4]===true?'\''+echappConstante(tab[j][1])+'\'' : (tab[j][1]=='vrai'?'true':(tab[j][1]=='faux'?'false':(tab[j][1]))));        
       }else{
        if(tab[j][1]=='appelf'){
         obj=js_traiteAppelFonction(tab,j,true,niveau);
         if(obj.status==true){
          t+=obj.value;
         }else{
          return logerreur({status:false,value:t,id:id,tab:tab,message:'dans le deuxième argument de appelf '});
         }
        }else{
         return logerreur({status:false,value:t,id:id,tab:tab,message:'dans le deuxième argument de appelf '});
        }
       }
       if(!dansInitialisation){
        t+=';';
       }
       
       break;
      }
     }
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de affecte il faut un nom de fonction à appeler n(xxxx)'});
    }


   }else if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='obj' ){
    
    obj=js_traiteDefinitionObjet(tab,i+2,true);
    if(obj.status==true){
     t+=''+tab[i+1][1]+'='+obj.value+';';
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans obj de affecte il y a un problème'});
    }

    
   }else{
    t+='//todo dans affecte 829 '+tab[i][1]+'';
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  
  //=====================================================================================
  }else if(tab[i][1]=='declare'  && tab[i][2]=='f'){ // i18
   t+=espacesn(true,niveau);
   if(tab[i][8]==2 ){
    if(tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
     // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
     if( (tab[i+2][1]=='vrai' || tab[i+2][1]=='faux' ) && tab[i+2][4]===false){
      t+='var '+tab[i+1][1]+'='+(tab[i+2][1]==='vrai'?'true':'false')+';';
     }else{
      t+='var '+tab[i+1][1]+'='+(tab[i+2][4]===true?'\''+echappConstante(tab[i+2][1])+'\';' : tab[i+2][1]+';');
     }
    }else{
     if(tab[i+1][2]=='c' && tab[i+2][2]=='f' ){
      if(tab[i+2][1]=='new' && tab[i+2][8]==1 && tab[i+3][1]=='appelf' ){
       t+='var '+tab[i+1][1]+'= new ';
       obj=js_traiteAppelFonction(tab,i+3,true,niveau);
       if(obj.status==true){
        t+=obj.value+';';
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans une déclaration'});
       }
 //      t+='{};//todo declare 3 '+tab[i][1]+'';
      }else if(tab[i+2][1]=='obj' && tab[i+2][8]==0){
       t+='var '+tab[i+1][1]+'={};';
      }else{
       t+='//todo declare 2 '+tab[i][1]+'';
      }
     }else{
      t+='//todo declare 1 '+tab[i][1]+'';
     }
      
    }    
   }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans une déclaration, declare  doit avoir 2 paramètres'});
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
  //=====================================================================================
  }else if(tab[i][1]=='#'  && tab[i][2]=='f'){
   t+=espacesn(true,niveau);
   var commt=traiteCommentaire2(tab[i][13],niveau,i);
//   console.log('apres traite commentaite2 tab['+i+'][13]='+tab[i][13],'\ncommt='+commt);
   t+='/*' + commt +'*/';
  //=====================================================================================
  }else{
   t+=espacesn(true,niveau);
   t+='//todo i='+i+', tab[i][1]="'+tab[i][1]+'"';
   logerreur({status:false,value:t,id:i,tab:tab,message:'javascript.js traitement non prévu '+JSON.stringify(tab[i])});
  }

  
 }
 
 return {status:true,value:t};
 
}
//=====================================================================================================================
function js_traiteDefinitionObjet(tab,id,dansConditionOuDansFonction){ // id = position de 'obj'
 var t='';
 var j=0;
 var obj={};
 var textObj='';
 for(j=id+1;j<tab.length && tab[j][3]>tab[id][3];j++){
  if(tab[j][3]==tab[id][3]+1){
   if(tab[j][1]=='' && tab[j][2]=='f'){
    if(tab[j][8]==2){
     if(tab[j+2][1]=='obj'){
      obj=js_traiteDefinitionObjet(tab,j+2,true);
      if(obj.status==true){
       textObj+=','+(tab[j+1][4]==true?'\''+echappConstante(tab[j+1][1])+'\'':'\''+tab[j+1][1])+'\''+':'+obj.value+'';
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans js_traiteDefinitionObjet il y a un problème'});
      }
     }else{
      textObj+=','+(tab[j+1][4]==true?'\''+echappConstante(tab[j+1][1])+'\'':'\''+tab[j+1][1])+'\''+':'+(tab[j+2][4]==true?'\''+echappConstante(tab[j+2][1])+'\'':tab[j+2][1])+'';
     }
    }
   }
  }
 }
 t+='{';
 if(textObj!=''){
  t+=textObj.substr(1);
 }
 t+='}';
 
 return {status:true,value:t};

}
//=====================================================================================================================
function js_traiteAppelFonction(tab,i,dansConditionOuDansFonction,niveau){
 var t='';
 var j=0;
 var k=0;
 var obj={};
 var nomFonction='';
 var positionAppelFonction=0;
 var nomRetour='';
 var positionRetour=-1;
 var argumentsFonction='';
 var reprise=0;
 var max=0;
 var objTxt='';
 var proprietesFonction='';
 
 positionAppelFonction=-1;
 for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
  if(tab[j][1]=='n' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){
   positionAppelFonction=j;
   if(tab[j][8]==1){
    nomFonction=tab[j+1][1];
   }
   break;
  }
 }
 if(positionAppelFonction>0 && nomFonction!='' ){
  nomRetour='';
  positionRetour=-1;
  for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
   if(tab[j][1]=='r' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){
    if(tab[j][8]==1){
     nomRetour=tab[j+1][1];
    }
    positionRetour=j;
    break;
   }
  }
  argumentsFonction='';
  // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
  
  for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
   if(tab[j][1]=='obj' && tab[j][3]==tab[i][3]+1){
    obj=js_traiteDefinitionObjet(tab,j,true);
    if(obj.status==true){
     argumentsFonction+=','+obj.value+'';
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans js_traiteAppelFonction Objet il y a un problème'});
    }
    
    
    
    reprise=i+1;
    max=i+1;
    for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   }else if(tab[j][1]=='prop' && tab[j][3]==tab[i][3]+1){
    // la propriété est à un niveau +1 de l'appelf ( document.getElementById(toto).propriete )
    
    if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // le paramètre est une constante
     proprietesFonction+='.'+( tab[j+1][4]==true ? '\''+echappConstante(tab[j+1][1])+'\'' : (tab[j+1][1]=='vrai'?'true':(tab[j+1][1]=='faux'?'false':tab[j+1][1])) );
    }else{
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='appelf'){ // i18
       obj=js_traiteAppelFonction(tab,j+1,true,niveau);
       if(obj.status==true){
        proprietesFonction+='.'+obj.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }
      }else{
       return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[j][1]});
      }
     }
    }
    
    
    
   }else if(tab[j][1]=='p' && tab[j][3]==tab[i][3]+1){
    // le paramètre est à un niveau +1 de l'appelf
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    if(tab[j][8]==0 && tab[j+1][2]=='f' ){ // le paramètre est une fonction vide
     argumentsFonction+=',';
    }else if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // le paramètre est une constante
     argumentsFonction+=','+( tab[j+1][4]==true ? '\''+echappConstante(tab[j+1][1])+'\'' : (tab[j+1][1]=='vrai'?'true':(tab[j+1][1]=='faux'?'false':tab[j+1][1])) );
    }else{
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='appelf'){ // i18
       obj=js_traiteAppelFonction(tab,j+1,true,niveau);
       if(obj.status==true){
        argumentsFonction+=','+obj.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }
      }else{
       return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[j][1]});
      }
     }
    }
   }
  }
  if(!dansConditionOuDansFonction){
   t+=espacesn(true,niveau);
  }
  t+=nomRetour!=''?nomRetour+'=':'';
  t+=nomFonction;
  t+='('+(argumentsFonction!==''?argumentsFonction.substr(1):'')+')';
  t+=proprietesFonction;
  if(!dansConditionOuDansFonction){
   t+=';';
  }
 }else{
  return logerreur({status:false,value:t,id:i,tab:tab,message:' dans js_traiteAppelFonction il faut un nom de fonction à appeler n(xxxx)'});
 }
 return {status:true,value:t};
}
//=====================================================================================================================