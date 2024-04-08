"use strict";
/*
 tada
 le r() dans un appelf doit pouvoir contenir un appelf
 
*/
//=====================================================================================================================
function parseJavascript0(tab,id,niveau){
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
 var l01=tab.length;

 for(i=id;i<l01 && tab[i][3]>=tab[id][3] ;i++){
  
  if( ( tab[i][1]=='break'  || tab[i][1]=='debugger' || tab[i][1]=='continue' || 'useStrict' === tab[i][1] || 'debugger' === tab[i][1] ) && tab[i][2]=='f' ){  // i18
   if( 'useStrict' === tab[i][1]){
    t+=espacesn(true,niveau);
    t+='"use strict";';
   }else{
    if(tab[i][8]==0){
      t+=espacesn(true,niveau);
      t+=tab[i][1]+';'
    }else{
     console.trace();
     return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans un '+tab[i][1]+' qui doit être sous le format '+tab[i][1]+'() strictement'});
    }
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
      t+='return '+(tab[i+1][4]===true?'\''+tab[i+1][1]+'\'' : (tab[i+1][1]=='vrai'?'true':(tab[i+1][1]=='faux'?'false':(tab[i+1][1]))))+';';
     }else if(tab[i+1][2]=='f' && tab[i+1][1]=='appelf' ){
      t+=espacesn(true,niveau);
      obj=js_traiteAppelFonction(tab,i+1,true,niveau,false);
      if(obj.status==true){
       t+='return('+obj.value+');';
      }else{
       console.trace();
       return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
      }
     }else if(tab[i+1][2]=='f' && tab[i+1][1]=='obj' ){
      t+=espacesn(true,niveau);
      obj=js_traiteDefinitionObjet(tab,tab[i+1][0],true);
      if(obj.status==true){
       t+='return('+obj.value+');';
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'dans obj de "return" ou "dans" il y a un problème'});
      }
     }else{
      return logerreur({status:false,value:t,id:i,tab:tab,message:'javascript non traité 0083'});
     }
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'javascript non traité 0088'});
    }
    reprise=i+1;
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
   }
   
  }else if(tab[i][1]=='fonction' && tab[i][2]=='f' ){  // i18
   if(dansFonction==true){
    return logerreur({status:false,value:t,id:id,tab:tab,message:'on ne peut pas déclarer une fonction dans une fonction'});
   }else{
    dansFonction=true;
    positionDeclarationFonction=-1;
    for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
     if(tab[j][1]=='definition' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){  // i18
      positionDeclarationFonction=j;
      break;
     }
    }
    positionContenu=-1;
    for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
     if(tab[j][1]=='contenu' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){  // i18
      positionContenu=j;
      break;
     }
    }
    if(positionDeclarationFonction>=0 && positionContenu>=0){
     for(j=positionDeclarationFonction+1;j<l01 && tab[j][3]>tab[positionDeclarationFonction][3];j++){
      if(tab[j][1]=='nom' && tab[j][3]==tab[positionDeclarationFonction][3]+1){  // i18
       if(tab[j][8]==1){
        nomFonction=tab[j+1][1];
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'le nom de la fonction doit être sous la forme  n(xxx) '});
       }
      }
     }
     
     argumentsFonction='';
     for(j=positionDeclarationFonction+1;j<l01 && tab[j][3]>tab[positionDeclarationFonction][3];j++){
      if(tab[j][1]=='argument' && tab[j][3]==tab[positionDeclarationFonction][3]+1){  // i18
       if(tab[j][8]==1){
        argumentsFonction+=','+tab[j+1][1];
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'les arguments passés à la fonction doivent être sous la forme  a(xxx) '});
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
        return logerreur({status:false,value:t,id:id,tab:tab,message:'problème sur le contenu de la fonction "'+nomFonction+'"'});
       }
      }
      max=Math.max(positionDeclarationFonction,positionContenu);
      for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
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
   obj=js_traiteAppelFonction(tab,i,true,niveau,false);
   
   if(obj.status==true){
    t+=espacesn(true,niveau);
    t+=obj.value+';';
   }else{
    return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
   }
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
  }else if(tab[i][1]=='cascade'  && tab[i][2]=='f'){ // i18
   // une cascade d'appel à des fonctions
   // a=b.c('d').e.f( 'g,h', i(j).k ).l ; 
   
   
   // une cascade d'appel à des fonctions
   // a=b.c('d').e.f( 'g,h', i(j).k ).l ; 
   // affecte(a,cascade(   appelf( element(b) , n(c) , p('d') , prop(e)),    appelf(  n(f), p('g,h'),   p(appelf(n(i) , p(j) , prop(k)) )   , prop(l) ) ) ),
    var nbEnfantsCascade=tab[i][5];
    for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
     if(tab[j][7]==tab[i][0]){
      if(tab[j][1]=='appelf'){
       obj=js_traiteAppelFonction(tab,j,true,niveau,false);
       if(obj.status==true){
        if(tab[j][9]>1){
         t+='.';
        }
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'dans flux cascade, erreur dans appelf'});
       }
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'dans flux cascade, il ne peut y avoir que des "appelf"'});
      }
     }
    }
    t+='';
    reprise=i+1;
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   
  
  
  }else if(tab[i][1]=='boucleSurObjet'  && tab[i][2]=='f'){ // i18
   tabchoix=[];
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='pourChaque'){ // i18
      tabchoix.push([j,tab[j][1],i]);
     }else if(tab[j][1]=='faire'){ // i18
      tabchoix.push([j,tab[j][1],i]);
     }else if(tab[j][1]=='#'){
      tabchoix.push([j,tab[j][1],i]);
     }else{
      return logerreur({status:false,value:t,id:i,tab:tab,message:'la syntaxe de boucleSurObjet est boucleSurObjet(pourChaque(dans(a , b)),faire())'});
     }
    }    
   } 
   
   var pourChaque='';
   var faire='';
   for(j=0; j<tabchoix.length;j++){
    
    if(tabchoix[j][1]=='pourChaque'){ // i18
     niveau++;
     obj=js_tabTojavascript1(tab,tabchoix[j][0]+1,dansFonction,true,niveau);
     niveau--;
     if(obj.status==true){
      pourChaque+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur la pour de boucleSurObjet en indice '+tabchoix[j][0] });
     }
     
    }else if(tabchoix[j][1]=='faire'){ // i18
     niveau++;
     obj=js_tabTojavascript1(tab,tabchoix[j][0]+1,dansFonction,false,niveau);
     niveau--;
     if(obj.status==true){
      faire+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors de boucleSurObjet en indice '+tabchoix[j][0] });
     }
     
    }
    
    
   }
   
   t+=espacesn(true,niveau);
   t+='for(';
   t+=pourChaque;
   t+='){';
   t+=faire;
   t+=espacesn(true,niveau);
   t+='}';
   
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
  }else if(tab[i][1]=='boucle'  && tab[i][2]=='f'){ // i18
  
   tabchoix=[];
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
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
      return logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'});
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
      if(initialisation.substr(initialisation.length-1,1)===';'){
       initialisation=initialisation.substr(0,initialisation.length-1);
      }
      
      
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
      if(increment.substr(increment.length-1,1)===';'){
       increment=increment.substr(0,increment.length-1);
      }
      
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  

  
  }else if(tab[i][1]=='essayer'  && tab[i][2]=='f'){ // i18

   var contenu='';
   var sierreur='';
   var nomErreur=''
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='faire' && tab[j][2]=='f'){
      niveau++;
      obj=js_tabTojavascript1(tab,j+1,dansFonction,false,niveau);
      niveau--;
      if(obj.status==true){
       contenu+=obj.value;
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le contenu du "essayer" ' });
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  }else if(tab[i][1]=='choix'  && tab[i][2]=='f'){ // i18
   

   tabchoix=[];
   var aDesSinonSi=false;
   var aUnSinon=false;
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='si'){ // i18
      tabchoix.push([j,tab[j][1],0,tab[j],0]); // position type position du contenu du alors
      for(k=j+1;k<l01;k++){ // chercher la position du alors dans le si
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
      for(k=j+1;k<l01;k++){ // chercher la position du alors dans le sinonsi
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
      for(k=j+1;k<l01;k++){ // chercher la position du alors dans le sinon
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
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
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
     for(var k=i+1;k<l01 && tab[k][3]>tab[i][3];k++){
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
     for(var k=tabchoix[j][0];k<l01 && tab[k][3]>tab[i][3];k++){
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   

  //=====================================================================================
  }else if(tab[i][1]=='affecteFonction'  && tab[i][2]=='f'){ // i18

   if(tab[i+1][2]=='c' && tab[i][8]>=2 ){
   }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'});
   }

   if(tab[i+2][2]=='f'  && tab[i+2][1]=='appelf' && tab[i][8]>=2 ){
   }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'});
   }
   obj=js_traiteAppelFonction(tab,i+2,true,niveau,false);
   if(obj.status==true){
    t+=espacesn(true,niveau);
    t+=''+tab[i+1][1]+'='+obj.value+';';
   }else{
    return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
  
  //=====================================================================================
  }else if( ( tab[i][1]=='affecte' || tab[i][1]=='dans'  || tab[i][1]=='affectop' ) && tab[i][2]=='f'){ // i18

  
   var tabAffecte={};
   var signe='=';
   // repérer les n paramètres
   var numeroPar=0;
   for(var j=i+1;j<l01;j++){
    if(tab[j][3]<=tab[i][3]){
     break;
    }
    if(tab[j][7]===tab[i][0]){
     if(tab[j][1]=='#' && tab[j][2]=='f' ){
     }else{
      if(tab[i][1]=='affectop'){
        if(numeroPar==0){
         signe=tab[j][1];
         numeroPar++;
        }else{
         tabAffecte['par'+(numeroPar-1)]=tab[j];
         numeroPar++;
        }
      }else{
       tabAffecte['par'+numeroPar]=tab[j];
       numeroPar++;
      }
     }
    }
   }
   
   
   if(tab[i][1]=='dans'){
    signe=' in ';
   }else if(tab[i][1]=='affecte'){
    signe='=';
   }
  
   if(!dansInitialisation){
    t+=espacesn(true,niveau);
   }
   
   var objInstructionGauche=js_traiteInstruction1(tab,niveau,tabAffecte['par0'][0]);
   if(objInstructionGauche.status===true){
    var objInstructionDroite=js_traiteInstruction1(tab,niveau,tabAffecte['par1'][0]);
    if(objInstructionDroite.status===true){
     t+=''+objInstructionGauche.value+signe+objInstructionDroite.value;
     if(!dansInitialisation){
      t+=';';
     }
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de "affecte" ou "dans" 0802 '});
    }
   }else{
    return logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de "affecte" ou "dans" 0805 '});
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  
  //=====================================================================================
  }else if(tab[i][1]=='declare'  && tab[i][2]=='f'){ // i18
   t+=espacesn(true,niveau);
   var tabdeclare=[];
   for(j=i+1;j<l01;j++){
    if(tab[j][3]<=tab[i][3]){
     break;
    }
    if(tab[j][7]==tab[i][0]){
     if(tab[j][1]==='#' && tab[j][2]==='f'){
     }else{
      tabdeclare.push(tab[j]);
     }
    }
   }
   
   if(tabdeclare.length==2 ){ // tab[i+1]=tabdeclare[0] tab[i+2]=tabdeclare[1]
    if(tabdeclare[0][2]=='c' && tabdeclare[1][2]=='c' ){
     // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
     if( (tabdeclare[1][1]=='vrai' || tabdeclare[1][1]=='faux' ) && tabdeclare[1][4]===false){
      t+='var '+tabdeclare[0][1]+'='+(tabdeclare[1][1]==='vrai'?'true':'false')+';';
     }else{
      t+='var '+tabdeclare[0][1]+'='+(tabdeclare[1][4]===true?'\''+tabdeclare[1][1]+'\';' : tabdeclare[1][1]+';');
     }
    }else{
     if(tabdeclare[0][2]=='c' && tabdeclare[1][2]=='f' ){
      if(tabdeclare[1][1]=='new' && tabdeclare[1][8]==1 && tab[i+3][1]=='appelf' ){
       t+='var '+tabdeclare[0][1]+'= new ';
       obj=js_traiteAppelFonction(tab,tabdeclare[1][0]+1,true,niveau,false);
       if(obj.status==true){
        t+=obj.value+';';
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration'});
       }
      }else if(tabdeclare[1][1]=='obj'){
       if( tabdeclare[1][8]==0){
        t+='var '+tabdeclare[0][1]+'={};';
       }else{
        obj=js_traiteDefinitionObjet(tab,tabdeclare[1][0],true);
        if(obj.status==true){
         t+='var '+tabdeclare[0][1]+'='+obj.value+';';
        }else{
         return logerreur({status:false,value:t,id:i,tab:tab,message:'dans obj de "declare" ou "dans" il y a un problème'});
        }
       }
      }else if(tabdeclare[1][1]=='appelf' ){
       t+='var '+tabdeclare[0][1]+'= ';
       obj=js_traiteAppelFonction(tab,tabdeclare[1][0],true,niveau,false);
       if(obj.status==true){
        t+=obj.value+';';
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration'});
       }
       
      }else if(tabdeclare[1][1]=='condition' && tabdeclare[1][2]==='f' ){
       t+='var '+tabdeclare[0][1]+'= ';
/*       debugger; */
       obj=js_condition1(tab,tabdeclare[1][0]+1,niveau);
       if(obj.status==true){
        t+=obj.value+';';
       }else{
        return logerreur({status:false,value:t,id:id,message:'erreur dans une condition'});
       }

      }else if(tabdeclare[1][2]==='f' && ( tabdeclare[1][1]=='plus' ||  tabdeclare[1][1]=='moins' ||  tabdeclare[1][1]=='mult' ||  tabdeclare[1][1]=='divi' )  ){
       
       var objOperation=TraiteOperations1(tab,tabdeclare[1][0],niveau);
       if(objOperation.status==true){
        t+=objOperation.value+';';
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1249 sur declaration '});
       }
       
       
      }else if(tabdeclare[1][1]=='tableau' && tabdeclare[1][2]==='f' ){
       t+='var '+tabdeclare[0][1]+'= ';
       var objTableau=js_traiteTableau1(tab,tabdeclare[1][0],true,niveau,false);
       if(objTableau.status==true){
        t+=objTableau.value+';';
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1007 sur declaration '});
       }

      }else if(tabdeclare[1][1]=='testEnLigne' && tabdeclare[1][2]==='f' ){
       t+='var '+tabdeclare[0][1]+'= ';
       var objtestLi=js_traiteInstruction1(tab,niveau,tabdeclare[1][0]); // i
       if(obj.status==true){
        t+=objtestLi.value+';';
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1351'});
       }

       
      }else{
       logerreur({status:false,id:i,message:'javascript.js : cas dans declare non prévu'});
       t+='//todo declare 2 '+tab[i][1]+'';
      }
     }else{
      t+='//todo declare 1 '+tab[i][1]+'';
     }
      
    }    
   }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration 0996, declare  doit avoir 2 paramètres'});
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
  //=====================================================================================
  }else if(tab[i][1]=='#'  && tab[i][2]=='f'){
   if(tab[i][13].substr(0,1)=='#'){
    t+='\n';
   }else{
    t+=espacesn(true,niveau);
   }
   var commt=traiteCommentaire2(tab[i][13],niveau,i);
//   console.log('apres traite commentaite2 tab['+i+'][13]='+tab[i][13],'\ncommt='+commt);
   t+='/*' + commt;
   if(tab[i][13].substr(0,1)=='#'){
    t+='\n';
   }
   t+='*/';
  //=====================================================================================
  }else if(tab[i][1]=='throw'  && tab[i][2]=='f'){

   t+=espacesn(true,niveau);

   if(tab[i+1][1]=='new' && tab[i+1][8]==1 && tab[i+2][1]=='appelf' ){
    obj=js_traiteAppelFonction(tab,i+2,true,niveau,false);
    if(obj.status==true){
     t+='throw new '+obj.value+';';
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration'});
    }
   }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans throw 1067'});
   }

   
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;

   
  //=====================================================================================
  }else{
   t+=espacesn(true,niveau);
   t+='//todo i='+i+', tab[i][1]="'+tab[i][1]+'"';
   logerreur({status:false,value:t,id:i,tab:tab,message:'javascript.js traitement non prévu 1057 '+JSON.stringify(tab[i])});
  }

  
 }
 
 return {status:true,value:t};
 
}

//=====================================================================================================================
function js_traiteTableau1(tab,i,dansConditionOuDansFonction,niveau,recursif){
 var t='';
 var j=0;
 var k=0;
 var obj={};
 var nomTableau='';
 var positionAppelTableau=0;
 var argumentsFonction='';
 var reprise=0;
 var max=0;
 var objTxt='';
 var proprietesFonction='';
 var aDesAppelsRecursifs=false;
 var nbEnfants=0;
 var forcerNvelleLigneEnfant=false;
 var l01=tab.length;
 var contenu='';
 var termineParUnePropriete=false;
 var enfantTermineParUnePropriete=false;

 positionAppelTableau=-1;
 for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
  if(tab[j][1]=='nomt' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){ 
   positionAppelTableau=j;
   if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // nb enfants=1 && constante
    nomTableau=tab[j+1][1];
    if(nomTableau=='Array'){
     nbEnfants=tab[tab[tab[j+1][7]][7]][8]-1;
    }
   }
   break;
  }
 }
 if(positionAppelTableau>0 && nomTableau!='' ){
  for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
   if(tab[j][3]==tab[i][3]){
    break;
   }
   if(tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){
    if(tab[j][1]=='nomt' || tab[j][1]=='p' || tab[j][1]=='#' ){
     continue;
    }else{
     logerreur({status:false,value:t,id:i,tab:tab,message:'1107 les seuls paramètres de tableau sont nomt,p "'+tab[j][1]+'"'});
    }
   }
  }
  argumentsFonction='';
  // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
  for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
   
   if(tab[j][1]=='p' && tab[j][3]==tab[i][3]+1){
    // le paramètre est à un niveau +1 de l'appelf
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    if(tab[j][8]==0 && tab[j+1][2]=='f' ){ // le paramètre est une fonction vide
     argumentsFonction+=',';
    }else if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // le paramètre est une constante
     argumentsFonction+='['+( tab[j+1][4]==true ? '\''+tab[j+1][1]+'\'' : (tab[j+1][1]=='vrai'?'true':(tab[j+1][1]=='faux'?'false':tab[j+1][1])) )+']';
    }else if(tab[j][8]>1 && tab[j+1][2]=='c' ){ // les paramètres sont un cumul de constantes
     var opPrecedente='';
     for(k=j+1;k<l01;k++){
      if(k==j+1){
       argumentsFonction+=',';
      }
      if(tab[k][3]<=tab[j][3]){
       break;
      }else{
       if(nomTableau=='concat'){
        if(tab[k][1]=='+'){
         argumentsFonction+=',';
        }else{
         argumentsFonction+=''+( tab[k][4]==true ? '\''+tab[k][1]+'\'' : (tab[k][1]=='vrai'?'true':(tab[k][1]=='faux'?'false':tab[k][1])) );
        }
       }else{
        debugger; // todo
       }
      }
      
     }
     

    }else{
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][1]=='obj' ){
      obj=js_traiteDefinitionObjet(tab,j+1,true);
      if(obj.status==true){
       argumentsFonction+=','+obj.value+'';
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'dans js_traiteTableau1 Objet il y a un problème'});
      }
     }else if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='p'){ // i18
        obj=js_tabTojavascript1(tab,j+1,false,false,niveau);
        if(obj.status==true){
         argumentsFonction+=',';
         if(nomTableau=='Array' && nbEnfants>=4){
          forcerNvelleLigneEnfant=true;
          argumentsFonction+=espacesn(true,niveau+1);
         }         
         argumentsFonction+=obj.value;
        }else{
         return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
        }
      }else if(tab[j+1][1]=='mult' || tab[j+1][1]=='plus' ){
       var objOperation=TraiteOperations1(tab,j+1,niveau);
       if(objOperation.status==true){
        argumentsFonction+=',';
        argumentsFonction+=objOperation.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1249 sur des opérations '});
       }
       
      }else{
       return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1215 dans un appel de fonction imbriqué 1207 pour la fonction inconnue '+tab[j+1][1]});
      }
     }
    }
   }
  }
  if(!dansConditionOuDansFonction){
   t+=espacesn(true,niveau);
  }
  if(recursif===true && !dansConditionOuDansFonction){
   t+=espacesn(true,niveau+1)+nomTableau;
  }else{
   t+=nomTableau;
  }
  t+=argumentsFonction;
  if((aDesAppelsRecursifs && !dansConditionOuDansFonction )|| forcerNvelleLigneEnfant ){
   t+=espacesn(true,niveau);
  }
  if(!dansConditionOuDansFonction){
   t+=';';
  }
 }else{
  return logerreur({status:false,value:t,id:i,tab:tab,message:' dans js_traiteAppelFonction il faut un nom de fonction à appeler nomf(xxxx)'});
 }
 return {status:true,value:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete};
}


//=====================================================================================================================
function js_traiteInstruction1(tab,niveau,id){
 var t='';
 if(tab[id][2]==='c'){
  
  t+=(tab[id][4]===true?'\''+tab[id][1]+'\'' : (tab[id][1]=='vrai'?'true':(tab[id][1]=='faux'?'false':(tab[id][1]))));
  
 }else if(tab[id][2]=='f' && tab[id][1]=='appelf' ){
  
  var obj=js_traiteAppelFonction(tab,tab[id][0],true,niveau,false);
  if(obj.status==true){
   t+=obj.value;
  }else{
   return logerreur({status:false,value:t,id:id,tab:tab,message:'dans js_traiteInstruction1 1043 '});
  }
  
 }else if(tab[id][1]=='plus' || tab[id][1]=='mult' || tab[id][1]=='moins' ||  tab[id][1]=='etBin'){
  
  var objOperation=TraiteOperations1(tab,tab[id][0]);
  if(objOperation.status==true){
   t+=objOperation.value;
  }else{
   return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur sur js_traiteInstruction1 1050 '});
  }
  
 }else if(tab[id][1]=='obj' ){
    
  var obj=js_traiteDefinitionObjet(tab,tab[id][0],true);
  if(obj.status==true){
   t+=obj.value;
  }else{
   return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur sur js_traiteInstruction1 1064 '});
  }
  
 }else if(tab[id][1]=='tableau' ){
    
  var objTableau=js_traiteTableau1(tab,tab[id][0],true,niveau,false);
  if(objTableau.status==true){
   t+=objTableau.value;
  }else{
   return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '});
  }
  
 }else if(tab[id][1]=='testEnLigne' ){
  var testEnLigne=[];
  for(var j=id+1;j<tab.length && tab[j][3]>tab[id][3];j++){
   if(tab[j][3]==tab[id][3]+1){
    if(tab[j][1]=='condition'){ // i18
     testEnLigne.push([j,tab[j][1],id]);
    }else if(tab[j][1]=='siVrai'){ // i18
     testEnLigne.push([j,tab[j][1],id]);
    }else if(tab[j][1]=='siFaux'){ // i18
     testEnLigne.push([j,tab[j][1],id]);
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'});
    }
   }    
  } 
  if(testEnLigne.length!==3){
    return logerreur({status:false,message:'fonction js_traiteInstruction1 1524 il faut un format testEnLigne(condition() , siVrai(1) , siFaux(2))"'});
  }
  for(var j=0;j< testEnLigne.length;j++){
   
   if(testEnLigne[j][1]==='condition'){
    
    niveau++;
    var objCondition=js_condition0(tab,testEnLigne[j][0],niveau);
    niveau--;
    if(objCondition.status===true){
    }else{
     return logerreur({status:false,value:t,id:testEnLigne[j][0],tab:tab,message:'1 js_traiteInstruction1 sur condition 1533 '+testEnLigne[j][0] });
    }
    
   }else if(testEnLigne[j][1]==='siVrai'){

    niveau++;
    var objSiVrai=js_traiteInstruction1(tab,niveau,testEnLigne[j][0]+1);
    niveau--;
    if(objSiVrai.status===true){
    }else{
     return logerreur({status:false,value:t,id:testEnLigne[j][0],tab:tab,message:'1 js_traiteInstruction1 sur siVrai 1542 '+testEnLigne[j][0] });
    }
    
   }else if(testEnLigne[j][1]==='siFaux'){

    niveau++;
    var objSiFaux=js_traiteInstruction1(tab,niveau,testEnLigne[j][0]+1);
    niveau--;
    if(objSiFaux.status===true){
    }else{
     return logerreur({status:false,value:t,id:testEnLigne[j][0],tab:tab,message:'1 js_traiteInstruction1 sur objSiFaux 1716 '+testEnLigne[j][0] });
    }
    
   }
  }
  
  
  t='('+objCondition.value+'?'+objSiVrai.value+':'+objSiFaux.value+')';
  
 }else if(tab[id][1]==='condition'){
  var objcond=js_condition0(tab,tab[id][0],niveau);
  if(objcond.status==true){
   t+=objcond.value;
  }else{
   return logerreur({status:false,value:t,id:id,tab:tab,message:'js_traiteInstruction1 1313'});
  }
  
  
 }else{
   return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur sur js_traiteInstruction1 1067 pour '+tab[id][1]});
 }
/*    
 
   if(tabAffecte['par0'][2]=='c' && tabAffecte['par1'][2]=='c' ){ // tab[i+1] => tabAffecte['par0'] , tab[i+2]=> tabAffecte['par1']
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    t+=''+tabAffecte['par0'][1]+signe+(tabAffecte['par1'][4]===true?'\''+tabAffecte['par1'][1]+'\'' : (tabAffecte['par1'][1]=='vrai'?'true':(tabAffecte['par1'][1]=='faux'?'false':tabAffecte['par1'][1]) )+'');
    if(!dansInitialisation){
     t+=';';
    }
   
   }else if(tabAffecte['par0'][2]=='c' && tabAffecte['par1'][2]=='f' && tabAffecte['par1'][1]=='appelf' ){
    
    obj=js_traiteAppelFonction(tab,tabAffecte['par1'][0],true,niveau,false);
    if(obj.status==true){
     t+=tabAffecte['par0'][1]+signe+obj.value;
     if(!dansInitialisation){
      t+=';';
     }
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de "affecte" ou "dans" il faut un nom de fonction à appeler n(xxxx)'});
    }

   }else if(tabAffecte['par0'][2]=='f' && tabAffecte['par0'][1]=='appelf' ){
    
    obj=js_traiteAppelFonction(tab,tabAffecte['par0'][0],true,niveau,false);
    if(obj.status==true){
     t+=''+obj.value+signe;
//     // trouver 'x' dans "affecte( appelf(...) , x )"
     if(tabAffecte['par1'][2]=='c'){
      t+=(tabAffecte['par1'][4]===true?'\''+tabAffecte['par1'][1]+'\'' : (tabAffecte['par1'][1]=='vrai'?'true':(tabAffecte['par1'][1]=='faux'?'false':(tabAffecte['par1'][1]))));        
     }else{
      if(tabAffecte['par1'][1]=='appelf'){
       obj=js_traiteAppelFonction(tab,tabAffecte['par1'][0],true,niveau,false);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'dans le deuxième argument de 817 appelf '});
       }
      }else if(tabAffecte['par1'][1]=='plus' || tabAffecte['par1'][1]=='mult'){
       var objOperation=TraiteOperations1(tab,tabAffecte['par1'][0]);
       if(objOperation.status==true){
        t+=objOperation.value;
       }else{
        return logerreur({status:false,value:t,id:tabAffecte['par1'][0],tab:tab,message:'erreur 824 sur des opérations '});
       }
      }else{
       return logerreur({status:false,value:t,id:tabAffecte['par1'][0],tab:tab,message:'dans le deuxième argument de 820 appelf '});
      }
     }
     if(!dansInitialisation){
      t+=';';
     }
       
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'dans appelf de "affecte" ou "dans" il faut un nom de fonction à appeler n(xxxx)'});
    }


   }else if(tabAffecte['par0'][2]=='c' && tabAffecte['par1'][2]=='f' && tabAffecte['par1'][1]=='obj' ){
    
    obj=js_traiteDefinitionObjet(tab,tabAffecte['par1'][0],true);
    if(obj.status==true){
     t+=''+tabAffecte['par0'][1]+signe+obj.value+';';
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'dans obj de "affecte" ou "dans" il y a un problème'});
    }

   }else if(tabAffecte['par0'][2]=='c' && tabAffecte['par1'][2]=='f' && tabAffecte['par1'][1]=='condition' ){
    
    obj=js_condition0(tab,tabAffecte['par1'][0],niveau);
    if(obj.status==true){
     t+=''+tabAffecte['par0'][1]+signe+obj.value;
     t+=';';
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'javascript.js dans appelf condition'});
    }

   }else if(tabAffecte['par0'][2]=='c' && tabAffecte['par1'][2]=='f' && tabAffecte['par1'][1]=='cascade' ){

   // une cascade d'appel à des fonctions
   // a=b.c('d').e.f( 'g,h', i(j).k ).l ; 
   // affecte(a,cascade(   appelf( element(b) , n(c) , p('d') , prop(e)),    appelf(  n(f), p('g,h'),   p(appelf(n(i) , p(j) , prop(k)) )   , prop(l) ) ) ),
    t+=''+tabAffecte['par0'][1]+signe;
    var nbEnfantsCascade=tabAffecte['par1'][5];
    for(j=i+3;j<l01 && tab[j][3]>tabAffecte['par1'][3];j++){
     if(tab[j][7]==tabAffecte['par1'][0]){
      if(tab[j][1]=='appelf'){
       obj=js_traiteAppelFonction(tab,j,true,niveau,false);
       if(obj.status==true){
        if(tab[j][9]>1){
         t+='.';
        }
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'dans appelf cascade, erreur dans appelf'});
       }
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'dans appelf cascade, il ne peut y avoir que des "appelf"'});
      }
     }
    }
    t+=';';


   }else if(tabAffecte['par0'][2]=='c' && tabAffecte['par1'][2]=='f' && tabAffecte['par1'][1]=='@' ){
    
    t+=''+tabAffecte['par0'][1]+'='+tabAffecte['par1'][13]+';';
    
   }else if(tabAffecte['par0'][2]=='c' && tabAffecte['par1'][2]=='f' && ( tabAffecte['par1'][1]=='mult' ||  tabAffecte['par1'][1]=='plus'  ||  tabAffecte['par1'][1]=='moins' ||  tabAffecte['par1'][1]=='etBin' ) ){
    
    var objOperation=TraiteOperations1(tab,tabAffecte['par1'][0]);
    if(objOperation.status==true){
     t+=''+tabAffecte['par0'][1]+signe+objOperation.value+';';
    }else{
     return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1249 sur des opérations '});
    }
    
   }else{
    logerreur({status:false,value:t,id:i,tab:tab,message:'javascript.js dans "affecte" ou "dans" cas non prévu "'+tabAffecte['par1'][1]+'"'});
    t+='//todo dans affecte 886 '+tab[i][1]+'';
   }
 */
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
     if(tab[j+2][2]==='f'){
      if(tab[j+2][1]=='obj'){
       obj=js_traiteDefinitionObjet(tab,j+2,true);
       if(obj.status==true){
 //       textObj+=','+(tab[j+1][4]==true?'\''+tab[j+1][1]+'\'':'\''+tab[j+1][1])+'\''+':'+obj.value+'';
        textObj+=','+ '\'' + tab[j+1][1] + '\'' + ':' + obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'dans js_traiteDefinitionObjet il y a un problème'});
       }
      }else if(tab[j+2][1]=='plus'){
       
       var objOperation=TraiteOperations1(tab,j+2,0);
       if(objOperation.status==true){
        textObj+=','+ '\'' + tab[j+1][1] + '\'' + ':' + objOperation.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur js_traiteDefinitionObjet 1496 sur des opérations '});
       }
       
      }else if(tab[j+2][1]=='appelf'){
       var objfnt1=js_traiteAppelFonction(tab,j+2,true,0,true);
       if(objfnt1.status===true){
        textObj+=','+ '\'' + tab[j+1][1] + '\'' + ':' + objfnt1.value;
       }else{
        logerreur({status:false,value:t,id:j,tab:tab,message:'1069 erreur sur appel de fonction nom "'+tab[j][1]+'"'});
       }
       
       
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans ajs_traiteDefinitionObjet, 1492"'});
      }
     }else{
      textObj+=','+(tab[j+1][4]==true?'\''+tab[j+1][1]+'\'':'\''+tab[j+1][1]+'\'')+':'+(tab[j+2][4]==true?'\''+tab[j+2][1]+'\'':tab[j+2][1])+'';
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
function js_traiteAppelFonction(tab,i,dansConditionOuDansFonction,niveau,recursif){
 var t='';
 var j=0;
 var k=0;
 var obj={};
 var nomFonction='';
 var positionAppelFonction=0;
 var nomRetour='';
 var nomElement='';
 var positionRetour=-1;
 var argumentsFonction='';
 var reprise=0;
 var max=0;
 var objTxt='';
 var proprietesFonction='';
 var aDesAppelsRecursifs=false;
 var nbEnfants=0;
 var forcerNvelleLigneEnfant=false;
 var l01=tab.length;
 var contenu='';
 var termineParUnePropriete=false;
 var enfantTermineParUnePropriete=false;

 positionAppelFonction=-1;
 for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
  if(tab[j][1]=='nomf' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){ 
   positionAppelFonction=j;
   if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // nb enfants=1 && constante
    nomFonction=tab[j+1][1];
    if(nomFonction=='Array'){
     nbEnfants=tab[tab[tab[j+1][7]][7]][8]-1;
    }
   }else if(tab[j][8]==2 && tab[j+1][1]=='new'){
    nomFonction=tab[j+1][1]+' '+tab[j+2][1];
   }else if(tab[j+1][1]=='appelf' && tab[j+1][2]=='f'){
    var obj1=js_traiteAppelFonction(tab,j+1,true,niveau,true);
    if(obj1.status===true){
     nomFonction=obj1.value;
     enfantTermineParUnePropriete=obj1.termineParUnePropriete;
     aDesAppelsRecursifs=true;
    }else{
     logerreur({status:false,value:t,id:i,tab:tab,message:'1069 erreur sur appel de fonction nom "'+tab[j][1]+'"'});
    }
   }
   break;
  }
 }
 if(positionAppelFonction>0 && nomFonction!='' ){
  nomRetour='';
  positionRetour=-1;
  for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
   if(tab[j][1]=='r' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){
    if(tab[j][8]==1){
     nomRetour=tab[j+1][1];
    }
    positionRetour=j;
    break;
   }
  }
  for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
   if(tab[j][1]=='element' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){
    if(tab[j][8]==1){
     if(tab[j+1][2]==='c'){
      if(tab[j+1][4]==true){
       nomElement='\''+tab[j+1][1]+'\'';
      }else{
       nomElement=tab[j+1][1];
      }
     }else if(tab[j+1][2]==='f'){
      var objinst=js_traiteInstruction1(tab,niveau,j+1);
      if(objinst.status===true){
       nomElement=objinst.value;
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'element incorrecte dans appelf 1592 '});
      }
       
     }
    }
    break;
   }
  }
  for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
   if(tab[j][3]==tab[i][3]){
    break;
   }
   if(tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){
    if(tab[j][1]=='element' || tab[j][1]=='nomf' || tab[j][1]=='p' || tab[j][1]=='appelf' || tab[j][1]=='r' || tab[j][1]=='prop' || tab[j][1]=='#'  || tab[j][1]=='contenu' ){
     continue;
    }else{
     logerreur({status:false,value:t,id:i,tab:tab,message:'1107 les seuls paramètres de appelf sont nomf,p,r,element et non pas "'+tab[j][1]+'"'});
    }
   }
  }
  argumentsFonction='';
  // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
  for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
   
   if(tab[j][1]=='obj' && tab[j][3]==tab[i][3]+1){
    
    obj=js_traiteDefinitionObjet(tab,j,true);
    if(obj.status==true){
     argumentsFonction+=','+obj.value+'';
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'dans js_traiteAppelFonction Objet il y a un problème'});
    }
    
    
    
    reprise=i+1;
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   }else if(tab[j][1]=='prop' && tab[j][3]==tab[i][3]+1){
    
    termineParUnePropriete=true;
    // la propriété est à un niveau +1 de l'appelf ( document.getElementById(toto).propriete )
    // todo voir dans quel cas c'est utilisé
    if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // le paramètre est une constante
     proprietesFonction+='.'+( tab[j+1][4]==true ? '\''+tab[j+1][1]+'\'' : (tab[j+1][1]=='vrai'?'true':(tab[j+1][1]=='faux'?'false':tab[j+1][1])) );
    }else{
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='appelf'){ // i18
       aDesAppelsRecursifs=true;
       obj=js_traiteAppelFonction(tab,j+1,true,niveau,true);
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
    
    
    
   }else if(tab[j][1]=='appelf'  && tab[j][3]==tab[i][3]+1){
    
     // cas ou le paramètre d'une fonction est une fonction directe 
     // par exemple on traite la fonction "z" affecte( a,appelf(n(x),p(y),appelf(n(z))))
    aDesAppelsRecursifs=true;
//       dansConditionOuDansFonction=true;
    if(tab[j+1][1]=='cascade'){
//        obj=js_traiteAppelFonction(tab,j+1,true,niveau,true);
     obj=js_tabTojavascript1(tab,j,false,false,niveau);
    }else{
     obj=js_traiteAppelFonction(tab,j,true,niveau,true);
    }
    if(obj.status==true){
     argumentsFonction+=',';
     if(nomFonction=='Array' && nbEnfants>=4){
      forcerNvelleLigneEnfant=true;
      argumentsFonction+=espacesn(true,niveau+1);
     }         
     argumentsFonction+=obj.value;
    }else{
     return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
    }
       
     
    
    
   }else if(tab[j][1]=='contenu' && tab[j][3]==tab[i][3]+1){
    if(nomFonction=='function'){
     contenu='';
     obj=js_tabTojavascript1(tab,j+1,false,false,niveau+1);
     if(obj.status==true){
      contenu+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appelf sur  le contenu d\'une fonction "function" '});
     }
    }else{
     return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appelf, seule une fonction "function" peut avoir un contenu '});
     
    }
   }else if(tab[j][1]=='p' && tab[j][3]==tab[i][3]+1){
    // le paramètre est à un niveau +1 de l'appelf
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    if(tab[j][8]==0 && tab[j+1][2]=='f' ){ // le paramètre est une fonction vide
     argumentsFonction+=',';
    }else if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // le paramètre est une constante
     argumentsFonction+=','+( tab[j+1][4]==true ? '\''+tab[j+1][1]+'\'' : (tab[j+1][1]=='vrai'?'true':(tab[j+1][1]=='faux'?'false':tab[j+1][1])) );
    }else if(tab[j][8]>1 && tab[j+1][2]=='c' ){ // les paramètres sont un cumul de constantes
     var opPrecedente='';
     for(k=j+1;k<l01;k++){
      if(k==j+1){
       argumentsFonction+=',';
      }
      if(tab[k][3]<=tab[j][3]){
       break;
      }else{
       if(nomFonction=='concat'){
        if(tab[k][1]=='+'){
         argumentsFonction+=',';
        }else{
         argumentsFonction+=''+( tab[k][4]==true ? '\''+tab[k][1]+'\'' : (tab[k][1]=='vrai'?'true':(tab[k][1]=='faux'?'false':tab[k][1])) );
        }
       }else{
        debugger; // todo
       }
      }
      
     }
     

    }else{
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][1]=='obj' ){
      obj=js_traiteDefinitionObjet(tab,j+1,true);
      if(obj.status==true){
       argumentsFonction+=','+obj.value+'';
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'dans js_traiteAppelFonction Objet il y a un problème'});
      }
     }else if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='appelf' || tab[j+1][1]=='cascade'){ // i18
       aDesAppelsRecursifs=true;
//       dansConditionOuDansFonction=true;
       if(tab[j+1][1]=='cascade'){
//        obj=js_traiteAppelFonction(tab,j+1,true,niveau,true);
        obj=js_tabTojavascript1(tab,j+1,false,false,niveau);
       }else{
        obj=js_traiteAppelFonction(tab,j+1,true,niveau,true);
       }
       if(obj.status==true){
        argumentsFonction+=',';
        if(nomFonction=='Array' && nbEnfants>=4){
         forcerNvelleLigneEnfant=true;
         argumentsFonction+=espacesn(true,niveau+1);
        }         
        argumentsFonction+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }
      }else if(tab[j+1][1]=='p'){ // i18
          obj=js_tabTojavascript1(tab,j+1,false,false,niveau);
          if(obj.status==true){
           argumentsFonction+=',';
           if(nomFonction=='Array' && nbEnfants>=4){
            forcerNvelleLigneEnfant=true;
            argumentsFonction+=espacesn(true,niveau+1);
           }         
           argumentsFonction+=obj.value;
          }else{
           return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
          }
      }else if(tab[j+1][1]=='@'){ // i18
           argumentsFonction+=',';
           argumentsFonction+=tab[j+1][13];
      }else if(tab[j+1][1]=='mult' || tab[j+1][1]=='plus' ){
       var objOperation=TraiteOperations1(tab,j+1,niveau);
       if(objOperation.status==true){
        argumentsFonction+=',';
        argumentsFonction+=objOperation.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1249 sur des opérations '});
       }
       
      }else if(tab[j+1][1]=='tableau' ){
       var objTableau=js_traiteTableau1(tab,tab[j+1][0],true,niveau,false);
       if(objTableau.status==true){
        argumentsFonction+=',';
        argumentsFonction+=objTableau.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '});
       }
       
      }else{
       return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1215 dans un appel de fonction imbriqué 1784 pour la fonction inconnue '+tab[j+1][1]});
      }
     }
    }
   }
  }
  if(!dansConditionOuDansFonction){
   t+=espacesn(true,niveau);
  }
  t+=nomRetour!=''?nomRetour+'=':'';
  if(recursif===true && nomRetour=='' && !dansConditionOuDansFonction){
   t+=espacesn(true,niveau+1)+(nomElement==''?'':nomElement+'.')+nomFonction;
  }else{
   t+=(nomElement==''?'':nomElement+'.')+nomFonction;
  }
  if(!enfantTermineParUnePropriete){
   t+='('
  }
  t+=(argumentsFonction!==''?argumentsFonction.substr(1):'');
  if((aDesAppelsRecursifs && !dansConditionOuDansFonction && nomRetour=='' && nomElement=='' && enfantTermineParUnePropriete===false )|| forcerNvelleLigneEnfant ){
   t+=espacesn(true,niveau);
  }
  if(!enfantTermineParUnePropriete){
   t+=')';
  }
  if(nomFonction=='function'){
   t+='{'+contenu;
   t+=espacesn(true,niveau);
   t+='}';
  }
  t+=proprietesFonction;
  if(!dansConditionOuDansFonction){
   t+=';';
  }
 }else{
  return logerreur({status:false,value:t,id:i,tab:tab,message:' dans js_traiteAppelFonction il faut un nom de fonction à appeler nomf(xxxx)'});
 }
 return {status:true,value:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete};
}
//=====================================================================================================================
function TraiteOperations1(tab,id,niveau){
 var t='';
 var i=0;
 var j=0;
 /*
  dans le cas d'un "plus" simple on est peut être au milieu d'une concaténation de chaine.
  Si un des deux paramètre est numérique il est plus prudent d'ajouter une parenthèse
  a+='e('+(f+1)+') g '+h+' i';
 */
 
 var condi0=tab[id][8]===2 && tab[id][1]==='plus' && ( (tab[id+1][2]==='c' && isNumeric(tab[id+1][1])) || (tab[id+2][2]==='c' && isNumeric(tab[id+2][1]) ) ) ;
 var l01=tab.length;
 var parentId=tab[id][0];
 var numEnfant=1;
 for(var i=id+1;i<l01;i++){
  if(tab[i][3]<=tab[parentId][3]){
   break;
  }
  if(tab[i][7]==parentId){
   if(tab[i][1]=='#'){
   }else if(tab[i][1]=='' && tab[i][2]=='f'){ // parenthèses
    var objOperation=TraiteOperations1(tab,i+1);
    if(objOperation.status==true){
     if(tab[parentId][1]=='mult'){
      t+='*';
     }else if(tab[parentId][1]=='plus'){
      t+='+';
     }else if(tab[parentId][1]=='moins'){
      t+='-';
     }else if(tab[parentId][1]=='etBin'){
      t+='&';      
     }
     t+='('+objOperation.value+')';
    }else{
     return logerreur({status:false,message:' erreur sur TraiteOperations1 1324'});
    }
   }else{
    if(numEnfant==1){
     numEnfant++;
     if(tab[i][2]=='c'){
      if(tab[i][4]===true){
       t+='\''+tab[i][1]+'\''
      }else{
       if(condi0){
        t+='('+tab[i][1];
       }else{
        t+=tab[i][1];
       }
      }
     }else if(tab[i][2]=='f'){
      if(tab[i][1]=='#'){
      }else if(tab[i][1]=='mult' || tab[i][1]=='plus' || tab[i][1]=='moins'  || tab[i][1]=='mult'  || tab[i][1]=='divi' || tab[i][1]=='etBin' ){
       var objOperation=TraiteOperations1(tab,i);
       if(objOperation.status==true){
        t+=''+objOperation.value+'';
       }else{
        return logerreur({status:false,message:' erreur sur TraiteOperations1 1324'});
       }
      }else if(tab[i][1]=='' ){
       var objOperation=TraiteOperations1(tab,i+1);
       if(objOperation.status==true){
        t+='('+objOperation.value+')';
       }else{
        return logerreur({status:false,message:' erreur sur TraiteOperations1 1324'});
       }
      }else if(tab[i][1]=='appelf' ){
       obj=js_traiteAppelFonction(tab,i,true,niveau,false);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1351'});
       }
       
       
      }else{
       return logerreur({status:false,message:'fonction du premier paramètre non reconnue 1347 "'+tab[i][1]+'"'});
      }
     }else{
      return logerreur({status:false,message:'pour une opération, le premier paramètre doit être une constante'});
     }
    }else{
     // nième paramètre
     if(tab[parentId][1]==''){ // parenthèses
      var objOperation=TraiteOperations1(tab,i+1);
      if(objOperation.status==true){
       t+='('+objOperation.value+')';
      }else{
       return logerreur({status:false,message:' erreur sur TraiteOperations1 1324'});
      }
     }else if(tab[parentId][1]=='mult' || tab[parentId][1]=='divi'){
      t+='*(';
     }else if(tab[parentId][1]=='plus'){
      t+='+';
     }else if(tab[parentId][1]=='moins'){
      t+='-';
     }else if(tab[parentId][1]=='etBin'){
      t+='&';
     }
     if(tab[i][2]==='f'){
      if(tab[i][1]=='mult' || tab[i][1]=='plus' || tab[i][1]=='moins' || tab[i][1]=='etBin' ){
       var objOperation=TraiteOperations1(tab,i);
       if(objOperation.status==true){
        t+=objOperation.value;
        if(tab[parentId][1]=='mult' || tab[parentId][1]=='divi' ){
         t+=')';
        }
       }else{
        return logerreur({status:false,message:' erreur sur TraiteOperations1 1324'});
       }
      }else if(tab[i][1]=='appelf' ){
       var obj=js_traiteAppelFonction(tab,i,true,niveau,false);
       if(obj.status==true){
        t+=obj.value;
        if(tab[parentId][1]=='mult' || tab[parentId][1]=='divi' ){
         t+=')';
        }
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1351'});
       }
      }else if(tab[i][1]=='testEnLigne' ){

       var obj=js_traiteInstruction1(tab,niveau,i);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1351'});
       }
      }else{
       return logerreur({status:false,message:'fonction paramètre non reconnue 1391 "'+tab[i][1]+'"'});
      }
     }else{
      if(tab[i][4]===true){
       t+='\''+tab[i][1]+'\''
       if(tab[parentId][1]=='mult' || tab[parentId][1]=='divi' ){
        t+=')';
       }
      }else{
       if(condi0){
        t+=tab[i][1]+')';
       }else{
        t+=tab[i][1];
       }
       if(tab[parentId][1]=='mult' || tab[parentId][1]=='divi' ){
        t+=')';
       }
      }
     }
    }
   }
  }
 }
// console.log('t=',t);
 return {value:t,status:true};
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
  if(tab[i][3]<tab[id][3]){
   break;
  }
 }
 
 if(max==0){
  i=id;
  if((tab[i][1]=='vrai' || tab[i][1]=='faux') && tab[i][4]==false ){ // i18
   t+=tab[i][1]=='vrai'?'true':'false'; // i18
  }else if(tab[i][4]==true){
   t+='\'';
   t+=tab[i][1];
   t+='\'';
  }else{
   t+=tab[i][1];
  }  
 }else{
  for(i=id;i<max;i++){
   if((tab[i][1]=='non' || tab[i][1]=='et' || tab[i][1]=='ou' || (premiereCondition==true && tab[i][1]=='' ) ) && tab[i][8]>0 && tab[i][2]=='f'){ //i18
    if(tab[i][1]=='non'){
     t+=' !';
    }else if(tab[i][1]=='et'){ // i18
     t+=' && ';
     if(tab[i][8]>1){
      //si il y a plusieurs enfants, il vaut mieux ouvrir une parenthèse
      t+=' ( ';
     }
    }else if(tab[i][1]=='ou'){ // i18
     t+=' || ';
     if(tab[i][8]>1){
      //si il y a plusieurs enfants, il vaut mieux ouvrir une parenthèse
      t+=' ( ';
     }
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
    if( tab[i][1]=='' || tab[i][1]=='non' ){
     t+=')';
    }
//    debugger;
    var reprise=i+1;
    for(var j=i+1;j<max;j++){
     if(tab[j][3]<=tab[i][3]){
      break;
     }
     reprise=j;
    }
    i=reprise;
    
    
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
 
    
    obj=js_traiteAppelFonction(tab,i,true,niveau,false);
    if(obj.status==true){
     t+=obj.value;
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans une condition'});
    }
    i=max-1;
    
    
    
   }else if( (tab[i][1]=='egal' || tab[i][1]=='egalstricte' || tab[i][1]=='diff' || tab[i][1]=='diffstricte' || tab[i][1]=='sup' || tab[i][1]=='inf'|| tab[i][1]=='supeg' || tab[i][1]=='infeg'  || tab[i][1]=='Instanceof' ) && tab[i][2]=='f' ){
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
       t+='\''+tab[tabPar[0]][1]+'\'';
      }else{
       if(tab[tabPar[0]][1]=='vrai' || tab[tabPar[0]][1]=='faux'){
        t+=(tab[tabPar[0]][1]=='vrai'?'true':'false');
       }else{
        t+=tab[tabPar[0]][1];
       }
      }
     }else{
      if(tab[tabPar[0]][2]=='f' && tab[tabPar[0]][1]=='appelf'){ // i18

       obj=js_traiteAppelFonction(tab,tabPar[0],true,niveau,false);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
       }

      }else if(tab[tabPar[0]][2]=='f' && tab[tabPar[0]][1]=='Typeof'){ // i18
      
       t+='typeof '+tab[tabPar[0]+1][1]
       
      }else if(tab[tabPar[0]][2]=='f' && (tab[tabPar[0]][1]=='plus' || tab[tabPar[0]][1]=='moins' )){ // i18
      
       var objOperation=TraiteOperations1(tab,tab[tabPar[0]][0]);
       if(objOperation.status==true){
        t+=objOperation.value;
       }else{
        return logerreur({status:false,value:t,id:tabAffecte['par1'][0],tab:tab,message:'erreur 1607 sur des opérations '});
       }
      
      }else if(tab[tabPar[0]][2]=='f' && tab[tabPar[0]][1]=='tableau'){ // i18
       var objTableau=js_traiteTableau1(tab,tab[tabPar[0]][0],true,niveau,false);
       if(objTableau.status==true){
        t+=objTableau.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '});
       }
      
      }else{
       
       return logerreur({status:false,value:t,id:id,message:'erreur 1528 dans une condition pour un test egal, diff...' + tab[tabPar[0]][1]});
      }
     }
     if(tab[i][1]=='egal'){
      t+=' == ';
     }else if(tab[i][1]=='egalstricte'){
      t+=' === ';
     }else if(tab[i][1]=='diff'){
      t+=' != ';
     }else if(tab[i][1]=='diffstricte'){
      t+=' !== ';
     }else if(tab[i][1]=='sup'){
      t+=' > ';
     }else if(tab[i][1]=='inf'){
      t+=' < ';
     }else if(tab[i][1]=='supeg'){
      t+=' >= ';
     }else if(tab[i][1]=='infeg'){
      t+=' <= ';
     }else if(tab[i][1]=='Instanceof'){
      t+=' instanceof ';
     }
     if(tab[tabPar[1]][2]=='c'){
      if(tab[tabPar[1]][4]==true){
       t+='\''+tab[tabPar[1]][1]+'\'';
      }else{
       if(tab[tabPar[1]][1]=='vrai' || tab[tabPar[1]][1]=='faux'){
        t+=(tab[tabPar[1]][1]=='vrai'?'true':'false');
       }else{
        t+=tab[tabPar[1]][1];
       }
      }
     }else{
      if(tab[tabPar[1]][2]=='f' && tab[tabPar[1]][1]=='appelf'){ // i18
 
       obj=js_traiteAppelFonction(tab,tabPar[1],true,niveau,false);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
       }
      }else if(tab[tabPar[1]][2]=='f' && ( tab[tabPar[1]][1]=='moins' || tab[tabPar[1]][1]=='plus'  ) ){ // i18
       var objOperation=TraiteOperations1(tab,tab[tabPar[1]][0]);
       if(objOperation.status==true){
        t+=objOperation.value;
       }else{
        return logerreur({status:false,value:t,id:tabAffecte['par1'][0],tab:tab,message:'erreur 824 sur des opérations '});
       }
      
      }else{
       return logerreur({status:false,value:t,id:id,message:'erreur 1568 dans une condition pour un test egal, diff...' + tab[tabPar[0]][1]});
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
     t+=tab[i][1];
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
    logerreur({status:false,value:t,id:i,message:'les tests sont pour l\'instant egal,egalstricte,diff,diffstricte,sup,inf,supeg,infeg,InstanceOf en non pas "'+tab[i][1]+'"' })
    t+=' /* TODO javascript ligne 213 */ ';
   }
  }
  
 }
 
// console.log('\n===================\nt=',t,'\n===================\n'); 
 return {value:t,status:true,'max':max};
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
   if(tab[i][1]=='' || tab[i][1]=='non'  ){
    if(premiereCondition){
     obj=js_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'});
     }
     t+=obj.value;
     premiereCondition=false;
     i=obj.max;
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
     i=obj.max;

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
     i=obj.max;
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
