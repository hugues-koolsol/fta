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
var php_contexte_commentaire_html=true;
//=====================================================================================================================
function parsePhp0(tab,id,niveau){
 var i=0;
 var t='';
 var obj={};
 var retJS=php_tabToPhp1(tab,id+1,false,false,niveau);
 if(retJS.status===true){
  t+=retJS.value;
 }else{
  console.error(retJS);
  return {status:false,value:t};
 }
 return {status:true,value:t};
}
//=====================================================================================================================
function php_tabToPhp1(tab,id,dansFonction,dansInitialisation,niveau){
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
  // console.log(tab[i]);
  
  if(tab[i][1]=='definir' && tab[i][2]=='f' ){  // i18

    t+=espacesn(true,niveau);
    t+='define(';
    t+='\''+tab[i+1][1]+'\'';
    t+=' , ';
    if(tab[i+2][2]=='f' && tab[i+2][1] == 'appelf' ){
     obj=php_traiteAppelFonction(tab,i+2,true,niveau);
     
     if(obj.status==true){
      t+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
     }
    }else if(tab[i+2][2]=='c' ){
     t+='\''+tab[i+1][1]+'\'';
    }else{
     t+='/* TODO 36 php.js */';
    }
    t+=');';
    max=i+1;
    for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
  
  }else if(tab[i][1]=='sortir' && tab[i][2]=='f' ){  // i18
  
  
   if(tab[i][8]==0){
    t+=espacesn(true,niveau);
    t+='exit;'
   }else if(tab[i][8]==1 && tab[i+1][2]=='c' ){
    t+=espacesn(true,niveau);
    t+='exit(';
    t+=(tab[i+1][4]===true?'\''+echappConstante(tab[i+1][1])+'\'' : (tab[i+1][1]=='vrai'?'true':(tab[i+1][1]=='faux'?'false':(tab[i+1][1])))+'');
    t+=');'
    i++;
   }else{
    t+=espacesn(true,niveau);
    t+='// todo 81 php.js sortir return args;';
   }
   
  }else if(tab[i][1]=='revenir' && tab[i][2]=='f' ){  // i18
  
  
   if(tab[i][8]==0){
    t+=espacesn(true,niveau);
    t+='return;'
   }else if(tab[i][8]==1 && tab[i+1][2]=='c' ){
    t+=espacesn(true,niveau);
    t+='return(';
    t+=(tab[i+1][4]===true?'\''+echappConstante(tab[i+1][1])+'\'' : (tab[i+1][1]=='vrai'?'true':(tab[i+1][1]=='faux'?'false':(tab[i+1][1])))+'');
    t+=');'
    i++;
   }else{
    t+=espacesn(true,niveau);
    t+='// todo 54 php.js revenir return args;';
    logerreur({status:false,value:t,id:id,tab:tab,message:'todo 54 php.js revenir return args'});
    
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
      }else if(tab[j][1]=='adresseArgument' && tab[j][3]==tab[positionDeclarationFonction][3]+1){  // i18
       if(tab[j][8]==1){
        argumentsFonction+=',&'+tab[j+1][1];
       }else{
        return {status:false,value:t,id:id,tab:tab,message:'les arguments passés à la fonction doivent être sous la forme  a(xxx) '};
       }
      }
     }
     
     
     if(nomFonction!=''){
      t+='\nfunction '+nomFonction+'('+(argumentsFonction==''?'':argumentsFonction.substr(1))+'){';
      obj=php_tabToPhp1(tab,positionContenu+1,dansFonction,false,1);
      if(obj.status==true){
       t+=obj.value;
       t+='\n}';
       max=Math.max(positionDeclarationFonction,positionContenu);
       for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
        reprise=j;
       }
       i=reprise;
      }else{
       return {status:false,value:t,id:id,tab:tab,message:'problème sur le contenu de la fonction "'+nomFonction+'"'};
      }
     }
    }else{
     return {status:false,value:t,id:id,tab:tab,message:'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'};
    }
    dansFonction=false;
   }
   
  }else if(tab[i][1]=='appelf' && tab[i][2]=='f'){ // i18

   obj=php_traiteAppelFonction(tab,i,dansInitialisation,niveau);
   
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
     if(tab[j][1]=='condition'){
      tabchoix.push([j,tab[j][1],i,[]]);
     }else if(tab[j][1]=='initialisation'){
      tabchoix.push([j,tab[j][1],i,[]]);
     }else if(tab[j][1]=='increment'){
      tabchoix.push([j,tab[j][1],i,[]]);
     }else if(tab[j][1]=='faire'){
      tabchoix.push([j,tab[j][1],i,[]]);
     }else if(tab[j][1]=='#'){
      if(tabchoix.length==0){
       tabchoix.push([j,tab[j][1],i,[]]);
      }else{
       tabchoix[tabchoix.length-1][3].push([j,tab[j][1],i,[]]); // position type 
      }
     }else{
      return logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),incrément(),faire())'});
     }
    }    
   } 
//   console.log('tabchoix=',tabchoix);
   var initialisation='';
   var condition='';
   var increment='';
   var faire='';
   for(j=0; j<tabchoix.length;j++){
    if(tabchoix[j][1]=='#'){
     t+=espacesn(true,niveau);
    }
   }
   for(j=0; j<tabchoix.length;j++){
    if(tabchoix[j][1]=='#'){
     
    }else if(tabchoix[j][1]=='initialisation'){ // i18
     
     obj=php_tabToPhp1(tab,tabchoix[j][0]+1,dansFonction,true,niveau);
     if(obj.status==true){
      if(obj.value.substr(obj.value.length-1,1)==';'){
       initialisation+=obj.value.substr(0,obj.value.length-1);
      }else{
       initialisation+=obj.value;
      }
      initialisation=initialisation.replace(/\n/g,'');
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
     }
     
    }else if(tabchoix[j][1]=='condition'){ // i18
     
     obj=php_condition0(tab,tabchoix[j][0],niveau);
     if(obj.status===true){
      condition+=obj.value;
     }else{
//      console.log(tab[tabchoix[j][0]],tab);
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'1 problème sur la condition du choix en indice '+tabchoix[j][0] });
     }
     condition=condition.replace(/\n/g,'');
     
    }else if(tabchoix[j][1]=='increment'){ // i18
     
     obj=php_tabToPhp1(tab,tabchoix[j][0]+1,dansFonction,true,niveau);
     if(obj.status==true){
      if(obj.value.substr(obj.value.length-1,1)==';'){
       increment+=obj.value.substr(0,obj.value.length-1);
      }else{
       increment+=obj.value;
      }
      increment=increment.replace(/\n/g,'');
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
     }
     
    }else if(tabchoix[j][1]=='faire'){ // i18
     
     
     obj=php_tabToPhp1(tab,tabchoix[j][0]+1,dansFonction,false,niveau+1);
     
     if(obj.status==true){
      faire+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le faire en indice '+tabchoix[j][0] });
     }
     
    }
    
    
   }
   t+=espacesn(true,niveau);
   t+='for('+initialisation+';'+condition+';'+increment+'){';
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
      obj=php_tabToPhp1(tab,j+1,dansFonction,false,niveau);
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
         obj=php_tabToPhp1(tab,j,dansFonction,false,niveau);
         if(obj.status==true){
          sierreur+=obj.value;
         }else{
          return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" du "essayer" ' });
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
      tabchoix.push([j,tab[j][1],0,[],0]); // position type position du contenu du alors
      for(k=j+1;k<tab.length;k++){ // chercher la position du alors dans le si
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1 ){ // i18
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
      tabchoix.push([j,tab[j][1],0,[],0]);
      for(k=j+1;k<tab.length;k++){ // chercher la position du alors dans le sinonsi
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1 ){  // i18
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
      tabchoix.push([j,tab[j][1],0,[],0]);
      for(k=j+1;k<tab.length;k++){ // chercher la position du alors dans le sinon
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1 ){  // i18
        tabchoix[tabchoix.length-1][2]=k+1;
        tabchoix[tabchoix.length-1][4]=tab[k][8]; // nombre d'enfants du alors
        break;
       }
       if(tab[k][3]<tab[j][3]){
        break;
       }
      }
     }else if(tab[j][1]=='#'){  // i18
      if(tabchoix.length==0){
       tabchoix.push([j,tab[j][1],0,[]]);
      }else{
       tabchoix[tabchoix.length-1][3].push([j,tab[j][1],0,[],0]);
      }
     }else{
      return logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de choix est choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'});
     }
    }
   }
   
   
   
   // tests divers
   var tabTemp=[];
   for(j=i+1;j<tab.length && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]<=tab[i][3]+2){
     if( (tab[j][1]=='si' || tab[j][1]=='condition' || tab[j][1]=='alors' || tab[j][1]=='sinonsi' || tab[j][1]=='sinon' || tab[j][1]=='#' ) && tab[j][2]=='f' ){
      tabTemp.push(tab[j]);
     }else{
      return logerreur({status:false,value:t,id:i,tab:tab,message:'dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "'+tab[j][1]+'" '});
     }
    }
   }
//   console.log('tabTemp='+JSON.stringify(tabTemp));
/*
[
 [9  ,"#","f",3,false,106,106,8,0,1,0,107,0,"on interdit un \"..\" dans le chemin de fichier en lecture",3],
 [10 ,"#","f",3,false,175,175,8,0,2,0,176,0,"sauf si c'est le super utilisateur",3],
 [11 ,"si","f",3,false,222,223,8,2,3,6,224,541,"",4],
 [12 ,"condition","f",4,false,236,244,11,2,1,5,245,447,"",5],
 [27 ,"alors","f",4,false,460,464,11,1,2,2,465,531,"",5],
 [31 ,"sinon","f",3,false,552,556,8,1,4,10,557,1342,"",4],
 [32 ,"alors","f",4,false,569,573,31,1,1,9,574,1332,"",5]
]
*/
   
/*   
   for(j=0;j<tabTemp.length;j++){
    if(tabTemp[j][1]=='#'){
     continue;
    }else if(tabTemp[j][1]=='si'){
     positionSi=j;
    }else if(tabTemp[j][1]=='condition'){
     if(j>positionSi && j){
      return logerreur({status:false,value:t,id:i,tab:tab,message:'la condition doit être sous un si ou un sinonsi'});
     };
    }     
    if(j==0){
     if(tabTemp[j][1]=='si' && tabTemp[j+1][1]=='condition' && tabTemp[j+2][1]=='alors'){
      j+=2;
     }else{
      return logerreur({status:false,value:t,id:i,tab:tab,message:'un choix doit contenir au moins un "si" , une "condition" et un "alors" en première position'});
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
*/
   for(j=0;j<tabchoix.length;j++){
    if(tabchoix[j][1]=='#'){
     t+=espacesn(true,niveau);
     t+='/*'+traiteCommentaire2(tab[tabchoix[j][0]][13],niveau,tabchoix[j][0])+'*/';
     
    }else if(tabchoix[j][1]=='si'){
     
     t+=espacesn(true,niveau);
     t+='if(';
     
     var debutCondition=0;
     for(var k=i+1;k<tab.length && tab[k][3]>tab[i][3];k++){
      if(tab[k][1]=='condition'){
       debutCondition=k;
       break;
      }
     }
     obj=php_condition0(tab,debutCondition,niveau);
     if(obj.status===true){
      t+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'2 problème sur la condition du choix en indice '+tabchoix[j][0] });
     }
     t+='){';
     
     
     
     if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il contient des enfants
      niveau++;
      obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau);
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
     
     t+=espacesn(true,niveau); // espaces
     t+='}else if(';
     
     var debutCondition=0;
     for(var k=tabchoix[j][0];k<tab.length && tab[k][3]>tab[i][3];k++){
      if(tab[k][1]=='condition'){
       debutCondition=k;
       break;
      }
     }
     obj=php_condition0(tab,debutCondition,niveau);
     if(obj.status===true){
      t+=obj.value;
     }else{
//      console.log(tab[tabchoix[j][0]],tab);
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'3 problème sur la condition du choix en indice '+tabchoix[j][0] });
     }
     t+='){';
     
     
     if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il contient des enfants
      niveau++;
      obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau);
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
     if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il contient des enfants
      niveau++;
      obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau);
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
    obj=php_tabToPhp1(tab,positionContenu+1,dansFonction,false,niveau);
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
  
  
  }else if(tab[i][1]=='affecte'  && tab[i][2]=='f'){ // i18
  
   if(!dansInitialisation){
    t+=espacesn(true,niveau);
   }
   if(tab[i][8]==2){
     if(tab[i+1][2]=='c' && tab[i+2][2]=='c' ){

      t+=''+tab[i+1][1]+'='+(tab[i+2][4]===true?'\''+echappConstante(tab[i+2][1])+'\'' : (tab[i+2][1]=='vrai'?'true':(tab[i+2][1]=='faux'?'false':(tab[i+2][1])))+'');
      if(!dansInitialisation){
       t+=';';
      }
     
     }else if(tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='appelf' ){
      t+=''+tab[i+1][1]+'=';
      obj=php_traiteAppelFonction(tab,i+2,true,niveau);
      if(obj.status==true){
       t+=obj.value;
       if(!dansInitialisation){
        t+=';';
       }
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de affecte il faut un nom de fonction à appeler n(xxxx)'});
      }


     }else if(tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='array' ){
      
      obj=php_traiteDefinitionTableau(tab,i+2,true);
      if(obj.status==true){
       t+=''+tab[i+1][1]+'='+obj.value+';';
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans obj de affecte il y a un problème'});
      }

      
     }else if(tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='html' ){

       php_contexte_commentaire_html=false;
       obj=tabToHtml1(tab,i+2,true,0);
       if(obj.status===true){
        t+=''+tab[i+1][1]+'='+'<<<EOT'+obj.value+'\nEOT;';
       }else{
        return logerreur({status:false,value:t,id:i,message:'erreur dans un html définit dans un php'});
       }
       php_contexte_commentaire_html=false;

      
     }else if(tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='sql' ){

       obj=tabToSql1(tab,i+2,niveau);
       if(obj.status===true){
        t+=''+tab[i+1][1]+'='+'<<<EOT'+obj.value+'\nEOT;';
       }else{
        return logerreur({status:false,value:t,id:i,message:'erreur dans un html définit dans un php'});
       }
      
      
     }else if(tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='sqlref' ){
      var numSql=0;
      var strSql='';
      var tabPar=[];
      
      for(j=i+3;j<tab.length && tab[j][3]>tab[i+2][3];j++){
       if(tab[j][1]=='num'){
        var numSql=tab[j+1][1];
        if(numSql=='1'){
         strSql='SELECT fld_id_user , fld_email_user , fld_password_user ';
         strSql+='FROM `ftatest`.`tbl_user` `T0` ';
         strSql+='WHERE `T0`.`fld_email_user` LIKE \\\'%%PAR0%%\\\' ';
         strSql+=' AND `T0`.`fld_password_user` LIKE \\\'%%PAR1%%\\\' ';
         strSql+=' AND \\\'toto\\\' = %%PAR2%% ';
         strSql+=' AND 0 = %%PAR3%% ';
        }else{
         strSql='SELECT 1 -- bidon ';
        }
       }else{
        if(tab[j][7]==tab[i+2][0]){
         if(tab[j][1]=='p'){
          tabPar.push([tab[j+1][1], tab[j+1][4] , isNaN(tab[j+1][1]) ])
         }else{
          return logerreur({status:false,value:t,id:i,message:'erreur sur la fonction sqlref '});
         }
        }
       }
      }

      if(numSql>0){
       if(tabPar.length>0){
        var toReplace='';
        for(j=0;j<tabPar.length;j++){
         if(tabPar[j][2]==false){ // isNaN
          toReplace=new RegExp('%%PAR'+j+'%%');
          strSql=strSql.replace(toReplace,tabPar[j][0]);
         }else{
          if(tabPar[j][1]==true){ // constante quotée
           toReplace=new RegExp('%%PAR'+j+'%%');
           strSql=strSql.replace(toReplace,'\\\''+tabPar[j][0]+'\\\'');
          }else{
           if(tabPar[j][0].substr(0,1)=='$'){ // variable php
            toReplace=new RegExp('%%PAR'+j+'%%');
            strSql=strSql.replace(toReplace,'\'.addslashes('+tabPar[j][0]+').\'');
           }else{
            return logerreur({status:false,value:t,id:i,message:'erreur dans un html sqlref dans un php'});
           }
          }
         }
        }
       }
  //     console.log(tabPar);
       t+=tab[i+1][1]+'=\''+strSql+'\';';
      }else{
       return logerreur({status:false,value:t,id:i,message:'erreur dans un sqlref , le paramètre num doit exister'});
      }
     }else{
      return logerreur({status:false,value:t,id:i,message:'php.js cas non prévu dans affecte "'+tab[i+2][1]+'"'});
     }    
   }else{
    return logerreur({status:false,value:t,id:i,message:'php.js affecte ne doit contenir que 2 arguments'});
   }

   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
  }else if(tab[i][1]=='declare'  && tab[i][2]=='f'){ // i18
   t+=espacesn(true,niveau);
   if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
    if( (tab[i+2][1]=='vrai' || tab[i+2][1]=='faux' ) && tab[i+2][4]===false){
     t+='var '+tab[i+1][1]+'='+(tab[i+2][1]==='vrai'?'true':'false')+';';
    }else{
     t+='var '+tab[i+1][1]+'='+(tab[i+2][4]===true?'\''+echappConstante(tab[i+2][1])+'\';' : tab[i+2][1]+';');
    }
   }else{
    if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='f' ){
     if(tab[i+2][1]=='new' && tab[i+2][8]==1 && tab[i+3][1]=='appelf' ){
      t+='var '+tab[i+1][1]+'= new ';
      obj=php_traiteAppelFonction(tab,i+3,true,niveau);
      if(obj.status==true){
       t+=obj.value+';';
      }else{
       return logerreut({status:false,value:t,id:id,tab:tab,message:'erreur dans une déclaration'});
      }
//      t+='{};//todo declare 3 '+tab[i][1]+'';
     }else{
      t+='//todo php.js 599 declare 2 '+tab[i][1]+'';
     }
    }else{
     t+='//todo php.js 602 declare 1 '+tab[i][1]+'';
    }
     
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
  }else if(tab[i][1]=='php'  && tab[i][2]=='f'){

   debugger; // on ne devrait pas passer par là
   php_contexte_commentaire_html=false;
   obj=php_tabToPhp1(obj.value,i,false,false,niveau);
   if(obj.status==true){
    t+='<?'+'php'+obj.value+'\n?>';
    php_contexte_commentaire_html=true;
   }else{
    return logerreur({status:false,value:t,id:i,message:'erreur dans un php en 621'});     
   }
    
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
  }else if(tab[i][1]=='html'  && tab[i][2]=='f'){
   php_contexte_commentaire_html=true;
   obj=tabToHtml1(tab,i,true,0);
   if(obj.status==true){
    t+='?>\n'+obj.value+'<?php';
   }else{
    return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) dans un html en 643'});     
   }
    
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   php_contexte_commentaire_html=false;
  
   
  }else if(tab[i][1]=='entete_page_standard'  && tab[i][2]=='f'){
   if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+1][2]=='c' ){
    t+='\n';
    t+='define(\'BNF\' , basename(__FILE__));\n';
    t+='require_once(\'aa_include.php\');\n';
    t+='session_start();\n';
    t+='start_session_messages();\n';
    t+='$o1=\'\';\n';
    t+='$a=array( \'title\' => \''+echappConstante(tab[i+1][1])+'\', \'description\' => \''+echappConstante(tab[i+2][1])+'\');\n';
    t+='$o1=html_header1($a);\n';
    t+='$o1=concat($o1,session_messages());\n';
    t+='print($o1);\n';
    t+='$o1=\'\';';
   }else{
    return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) la fonction ente_page_standard doit contenir 2 constantes, le titre et la description'});     
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  }else if(tab[i][1]=='#'  && tab[i][2]=='f'){
//   console.log('\n\n\n\n=====commentaire = "'+tab[i][13]+'"\n====\ntab='+JSON.stringify(tab)+'\n=============\n' )
   
    // test pour savoir si ce commentaire est contenu dans un html ( en dehors du tag php )
    // 
    if(php_contexte_commentaire_html==true){
     t+=espacesn(true,niveau)+'<!-- '+traiteCommentaire2(tab[i][13],niveau,i)+' -->';
     logerreur({status:true,warning:'Attention, danger, un commentaire est directement dans la racine de source <pre>'+tab[i][13]+'</pre>'});
    }else{
     t+=espacesn(true,niveau)+'/*'+traiteCommentaire2(tab[i][13],niveau,i)+'*/';
    }
  }else{
   logerreur({status:false,value:t,id:i,tab:tab,message:'php.js traitement non prévu '+JSON.stringify(tab[i])});

//   return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) la fonction "'+tab[i][1]+'" n\'est pas définie'});     
   t+=espacesn(true,niveau);
   
   t+='//todo php.js 861 i='+i+', tab[i][1]='+tab[i][1]+'\n';
   reprise=i+1;
   max=i+1;
   for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  }
 }


// t+='\n//hugues todo in php_tabToPhp1';
 return {status:true,value:t};
}

//=====================================================================================================================
//=====================================================================================================================
function php_traiteAppelFonction(tab,i,dansConditionOuDansFonction,niveau){
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
   if(tab[j][1]=='array' && tab[j][3]==tab[i][3]+1){
    obj=php_traiteDefinitionTableau(tab,j,true);
    if(obj.status==true){
     argumentsFonction+=','+obj.value+'';
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans traiteAppelFonction Objet il y a un problème'});
    }
    
    
    
    reprise=i+1;
    max=i+1;
    for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   }else if(tab[j][1]=='p' && tab[j][3]==tab[i][3]+1){
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // le paramètre est une constante
     argumentsFonction+=','+( tab[j+1][4]==true ? '\''+echappConstante(tab[j+1][1])+'\'' : (tab[j+1][1]=='vrai'?'true':(tab[j+1][1]=='faux'?'faux':tab[j+1][1])) );
    }else{
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='appelf'){ // i18
       obj=php_traiteAppelFonction(tab,j+1,true,niveau);
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
  t+=nomFonction+'('+(argumentsFonction!==''?argumentsFonction.substr(1):'')+')';
  if(!dansConditionOuDansFonction){
   t+=';';
  }
 }else{
  return logerreur({status:false,value:t,id:i,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
 }
 return {status:true,value:t};
}
//=====================================================================================================================
function php_traiteDefinitionTableau(tab,id,dansConditionOuDansFonction){ // id = position de 'obj'
 var t='';
 var j=0;
 var obj={};
 var textObj='';
 for(j=id+1;j<tab.length && tab[j][3]>tab[id][3];j++){
  if(tab[j][3]==tab[id][3]+1){ // si on est au niveau +1
   if(tab[j][1]=='' && tab[j][2]=='f'){
    if(tab[j][8]==2){
     if(tab[j+2][1]=='array'){
      obj=php_traiteDefinitionTableau(tab,j+2,true);
      if(obj.status==true){
       textObj+=', '+(tab[j+1][4]==true?'\''+echappConstante(tab[j+1][1])+'\'':tab[j+1][1])+' => '+obj.value+'';
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans php_traiteDefinitionTableau il y a un problème'});
      }
     }else{
      textObj+=', '+(tab[j+1][4]==true?'\''+echappConstante(tab[j+1][1])+'\'':tab[j+1][1])+' => '+(tab[j+2][4]==true?'\''+echappConstante(tab[j+2][1])+'\'':tab[j+2][1])+'';
     }
    }else if(tab[j][8]==1){
     if(tab[j+1][1]=='array' && tab[j+1][2]=='f' ){
      obj=php_traiteDefinitionTableau(tab,j+1,true);
      if(obj.status==true){
       textObj+=', '+obj.value+'';
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans php_traiteDefinitionTableau il y a un problème'});
      }
     }else{
      textObj+=', '+(tab[j+1][4]==true?'\''+echappConstante(tab[j+1][1])+'\'':tab[j+1][1])+'';
     }
     // en php, i peut n'y avoir qu'une dimention sans cle => valeur ( array('a','b') )
    }
   }
  }
 }
 t+='array(';
 if(textObj!=''){
  t+=textObj.substr(1);
 }
 t+=')';
 
 return {status:true,value:t};

}
//=====================================================================================================================
function php_condition1(tab,id,niveau){
// console.log('php_condition1' , id , tab);
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
   t+=''+tab[i][1];
  }  
 }else{
  for(i=id;i<max;i++){
   if((tab[i][1]=='non' || tab[i][1]=='et' || tab[i][1]=='ou' || (premiereCondition==true && tab[i][1]=='' ) ) && tab[i][8]>0 && tab[i][2]=='f'){ //i18
    if(tab[i][1]=='non'){
     t+=' !';
    }else if(tab[i][1]=='et'){ // i18
     t+=' && ';
    }else if(tab[i][1]=='ou'){ // i18
     t+=' || ';
    }
    // todo tester si arguments
    obj=php_condition1(tab,i+1,niveau);
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
      obj=php_condition1(tab,j,niveau);
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
    obj=php_condition1(tab,i+1,niveau);
    if(obj.status==false){
     return logerreur({status:false,value:t,id:id,message:'erreur dans une condition'});
    }
//    t+='(';
    t+=obj.value;
//    t+=')';
    i=max-1;
   }else if( tab[i][1]=='appelf'  && tab[i][2]=='f' ){ // i18
 
    niveau++;
    obj=php_traiteAppelFonction(tab,i,true,niveau);
    niveau--;
    if(obj.status==true){
     t+=obj.value;
    }else{
     return logerreut({status:false,value:t,id:id,tab:tab,message:'erreur dans une condition'});
    }
    i=max-1;
    
    
    
   }else if( (tab[i][1]=='egal' || tab[i][1]=='egal_stricte' || tab[i][1]=='diff' || tab[i][1]=='diff_stricte' || tab[i][1]=='sup' || tab[i][1]=='inf'|| tab[i][1]=='supeg' || tab[i][1]=='infeg' ) && tab[i][2]=='f' ){
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

       obj=php_traiteAppelFonction(tab,tabPar[0],true,niveau);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreut({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
       }

      }else{
       return logerreur({status:false,value:t,id:id,message:'erreur dans une condition pour un test egal, diff...' + tab[tabPar[0]][1]});
      }
     }
     if(tab[i][1]=='egal'){
      t+=' == ';
     }else if(tab[i][1]=='egal_stricte'){
      t+=' === ';
     }else if(tab[i][1]=='diff_stricte'){
      t+=' !== ';
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
 
       obj=php_traiteAppelFonction(tab,tabPar[1],true,niveau);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreut({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
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
     t+=''+tab[i][1];
    }
   }else{
    logerreur({status:false,id:i,message:'erreur dans une condition ' + JSON.stringify(tab[i])});
    t+=' [ TODO in php_condition1 ]';
   }
  }
  
 }
 
// console.log('\n===================\nt=',t,'\n===================\n'); 
 return {value:t,status:true};
}
//=====================================================================================================================
function php_condition0(tab,id,niveau){
// console.log('php_condition0');
 var t='';
 var i=0;
 var j=0;
 var premiereCondition=true;
 var newTab=[];
 var obj={};
 
 for(i=id+1;i<tab.length && tab[i][3]>tab[id][3];i++){
  
   if(tab[i][1]=='' || tab[i][1]=='non'){
    
    if(premiereCondition){
     obj=php_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'});
     }
     t+=obj.value;
     premiereCondition=false;
     var reprise=i+1;
     var max=i+1;
     for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
      reprise=j;
     }
     i=reprise;
     
    }else{
     return logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'});
    }
    
   }else if(tab[i][1]=='et' || tab[i][1]=='ou' ){ // i18
   
    if(premiereCondition){
     return logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'});
    }else{
     obj=php_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'});
     }
     t+=obj.value;
     var reprise=i+1;
     var max=i+1;
     for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
      reprise=j;
     }
     i=reprise;

    }        
    
   }else if(tab[i][1]=='egal' || tab[i][1]=='egal_stricte' || tab[i][1]=='diff' || tab[i][1]=='diff_stricte'  || tab[i][1]=='sup'  || tab[i][1]=='inf' || tab[i][1]=='supeq'  || tab[i][1]=='infeg' ){ // i18
   
    if(!premiereCondition){
     return {status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est soit "()", soit [egal|sup|inf|diff]'};
    }else{
     obj=php_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'});
     }
     t+=obj.value;
     
     var reprise=i+1;
     var max=i+1;
     for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
      reprise=j;
     }
     i=reprise;
     
     
    }        
   }else if(tab[i][1]=='#'){
   }else{
    return logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou()'});
   }
 }
 
 return {status:true,value:t};
}
