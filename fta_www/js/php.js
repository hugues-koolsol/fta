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

function php_traiteTableau1(tab,i,niveau){
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
    var proprietesTableau='';
    var aDesAppelsRecursifs=false;
    var nbEnfants=0;
    var forcerNvelleLigneEnfant=false;
    var l01=tab.length;
    var contenu='';
    var termineParUnePropriete=false;
    var enfantTermineParUnePropriete=false;
    positionAppelTableau=-1;
    for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
        if((tab[j][1] == 'nomt') && (tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
            positionAppelTableau=j;
            if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                nomTableau=tab[j+1][1];
                if(nomTableau == 'Array'){
                    nbEnfants=tab[tab[tab[j+1][7]][7]][8]-1;
                }
            }else if((tab[j][8] == 1) && (tab[j+1][2] == 'f') && (tab[j+1][1] == 'tableau')){
                var obj = php_traiteTableau1(tab,(j+1),niveau);
                if(obj.status === true){
                    nomTableau=obj.value;
                }else{
                    logerreur({status:false,value:t,id:i,tab:tab,message:'1045 problème dans un tableau de tableau '});
                }
            }
            break;
        }
    }
    if((positionAppelTableau > 0) && (nomTableau != '')){
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
            if(tab[j][3] == tab[i][3]){
                break;
            }
            if((tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
                if((tab[j][1] == 'nomt') || (tab[j][1] == 'p') || (tab[j][1] == '#') || (tab[j][1] == 'prop')){
                    continue;
                }else{
                    logerreur({status:false,value:t,id:i,tab:tab,'message':'1107 les seuls paramètres de tableau sont nomt,p,prop "'+tab[j][1]+'"'});
                }
            }
        }
        argumentsFonction='';
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
           if(tab[j][7]===tab[i][0]){
            if((tab[j][1] == 'nomt') && (tab[j][3] == (tab[i][3]+1))){
             /* déjà traité */
            }else if((tab[j][1] == 'p') && (tab[j][3] == (tab[i][3]+1))){
                if((tab[j][8] == 0) && (tab[j][2] == 'f')){
                    argumentsFonction+='[]';
                }else if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                    argumentsFonction+='['+maConstante(tab[j+1])+']';
                }else if((tab[j][8] > 1) && (tab[j+1][2] == 'c')){
                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans php_traiteTableau1 0083'}));
/*                    
                    var opPrecedente='';
                    for(k=(j+1);k < l01;k=k+1){
                        if(tab[k][3] <= tab[j][3]){
                            break;
                        }else{
                            if(nomTableau == 'concat'){
                                if(tab[k][1] == '+'){
                                    argumentsFonction+=',';
                                }else{
                                    argumentsFonction+=maConstante(tab[k]);
                                }
                            }else{
                                debugger;
                            }
                        }
                    }
*/                    
                }else{
                    var obj1=php_traiteElement(tab,j+1,niveau);
                    if(obj1.status===true){
                     argumentsFonction+='['+obj1.value+']';
                    }else{
                     return logerreur({status:false,value:t,id:j,tab:tab,message:'dans php_traiteTableau1 0110'});
                    }
/*                 
                    if((tab[j][8] == 1) && (tab[j+1][2] == 'f')){
                        if(tab[j+1][1] == 'tableau'){
                            var objTableau = php_traiteTableau1(tab,(j+1),niveau);
                            if(objTableau.status === true){
                                argumentsFonction+='['+objTableau.value+']';
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:j,tab:tab,'message':'erreur 1145 dans un appel de fonction imbriqué pour la fonction inconnue '+(tab[j+1][1])}));
                        }
                    }else{
                        return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans php_traiteTableau1 0115'}));
                    }
*/                    
                 
/*                 
                    if((tab[j][8] == 1) && (tab[j+1][1] == 'obj')){
                        obj=js_traiteDefinitionObjet(tab,(j+1),true);
                        if(obj.status == true){
                            argumentsFonction+='['+obj.value+']';
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans php_traiteTableau1 Objet il y a un problème'}));
                        }
                    }else if((tab[j][8] == 1) && (tab[j+1][2] == 'f')){
                        if(tab[j+1][1] == 'p'){
                            obj=js_tabTojavascript1(tab,(j+1),false,false,niveau);
                            if(obj.status == true){
                                if((nomTableau == 'Array') && (nbEnfants >= 4)){
                                    forcerNvelleLigneEnfant=true;
                                }
                                argumentsFonction+='['+obj.value+']';
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else if((tab[j+1][1] == 'mult') || (tab[j+1][1] == 'plus') || (tab[j+1][1] == 'moins')){
                            var objOperation = TraiteOperations1(tab,(j+1),niveau);
                            if(objOperation.status == true){
                                argumentsFonction+='['+objOperation.value+']';
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1249 sur des opérations '}));
                            }
                        }
                    }
*/                    
                }
/*
            }else if((tab[j][1] == 'prop') && (tab[j][3] == (tab[i][3]+1))){
                termineParUnePropriete=true;
                if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                    proprietesTableau+='.'+maConstante(tab[j+1]);
                }else{
                    if((tab[j][8] == 1) && (tab[j+1][2] == 'f')){
                        if(tab[j+1][1] == 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,(j+1),true,niveau,true);
                            if(obj.status == true){
                                proprietesTableau+='.'+obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:j,tab:tab,'message':'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[j][1]}));
                        }
                    }
                }
              */
            }else{
               return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans php_traiteTableau1 0170'}));
            }
        }
        }
        t+=nomTableau;
        t+=argumentsFonction;
        t+=proprietesTableau;
    }else{
        return(logerreur({status:false,value:t,id:i,tab:tab,message:' dans php_traiteTableau1 il faut un nom de tableau nomt(xxxx)'}));
    }
    return({status:true,value:t});
}

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
 var l01=tab.length;

 for(i=id;i<l01 && tab[i][3]>=tab[id][3] ;i++){
  // console.log(tab[i]);
  
  if(tab[i][1]=='definir' && tab[i][2]=='f' ){ 

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
     t+='"'+tab[i+2][1].replace(/\"/g,'\\"')+'"';
    }else{
     t+='/* TODO 36 php.js */';
    }
    t+=');';
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
  
  }else if(tab[i][1]=='break' && tab[i][2]=='f' ){ 
    t+=espacesn(true,niveau);
    t+='break;'
  
  }else if(tab[i][1]=='sortir' && tab[i][2]=='f' ){ 
  
  
   if(tab[i][8]==0){
    t+=espacesn(true,niveau);
    t+='exit;'
   }else if(tab[i][8]==1 && tab[i+1][2]=='c' ){
    t+=espacesn(true,niveau);
    t+='exit(';
    t+=(tab[i+1][4]===true?'\''+tab[i+1][1]+'\'' : (tab[i+1][1]=='vrai'?'true':(tab[i+1][1]=='faux'?'false':(tab[i+1][1])))+'');
    t+=');'
    i++;
   }else{
    var obj1=php_traiteElement(tab,i+1,niveau);
    if(obj1.status===true){
     t+='exit('+obj1.value+');'
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'dans php_tabToPhp1 0267'});
    }
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   }
   
  }else if(tab[i][1]=='revenir' && tab[i][2]=='f' ){ 
  
  
   if(tab[i][8]==0){
    t+=espacesn(true,niveau);
    t+='return;'
   }else if(tab[i][8]==1 && tab[i+1][2]=='c' ){
    t+=espacesn(true,niveau);
    t+='return(';
    t+=(tab[i+1][4]===true?'\''+(tab[i+1][1])+'\'' : (tab[i+1][1]=='vrai'?'true':(tab[i+1][1]=='faux'?'false':(tab[i+1][1])))+'');
    t+=');'
    i++;
   }else{
    t+=espacesn(true,niveau);
    var obj1=php_traiteElement(tab,i+1,niveau);
    if(obj1.status===true){
     t+='return('+obj1.value+');'
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'dans php_tabToPhp1 0289'});
    }
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   }
   
   
  }else if(tab[i][1]=='fonction' && tab[i][2]=='f' ){
  
  
   if(dansFonction==true){
    return {status:false,value:t,id:i,tab:tab,message:'on ne peut pas déclarer une fonction dans une fonction'};
   }else{
    dansFonction=true;
    positionDeclarationFonction=-1;
    for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
     if(tab[j][1]=='definition' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){ 
      positionDeclarationFonction=j;
      break;
     }
    }
    positionContenu=-1;
    for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
     if(tab[j][1]=='contenu' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){ 
      positionContenu=j;
      break;
     }
    }
    if(positionDeclarationFonction>=0 && positionContenu>=0){
     for(j=positionDeclarationFonction+1;j<l01 && tab[j][3]>tab[positionDeclarationFonction][3];j++){
      if(tab[j][1]=='nom' && tab[j][3]==tab[positionDeclarationFonction][3]+1){ 
       if(tab[j][8]==1){
        nomFonction=tab[j+1][1];
       }else{
        return {status:false,value:t,id:i,tab:tab,message:'le nom de la fonction doit être sous la forme  n(xxx) '};
       }
      }
     }
     
     argumentsFonction='';
     for(j=positionDeclarationFonction+1;j<l01 && tab[j][3]>tab[positionDeclarationFonction][3];j++){
      if(tab[j][1]=='argument' && tab[j][3]==tab[positionDeclarationFonction][3]+1){ 
       if(tab[j][8]==1){
        argumentsFonction+=','+tab[j+1][1];
       }else if(tab[j][8]==2){
        argumentsFonction+=','+tab[j+1][1];
        for(var k=j+2;k<l01 && tab[k][3]>tab[j][3];k++){
         if(tab[k][7]===j){
          if(tab[k][1]==='defaut'){
           var obj1=php_traiteElement(tab,k+1,niveau);
           if(obj1.status===true){
            argumentsFonction+='='+obj1.value;
           }else{
            return logerreur({status:false,value:t,id:i,tab:tab,message:'dans les arguments passés à la fonction 0333'});
           }
           
           
          }else{
           return logerreur({status:false,value:t,id:i,tab:tab,message:'0330 les arguments passés à la fonction '});
          }
         }
        }
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'0325 les arguments passés à la fonction doivent être sous la forme  a(xxx) '});
       }
      }else if(tab[j][1]=='adresseArgument' && tab[j][3]==tab[positionDeclarationFonction][3]+1){ 
       if(tab[j][8]==1){
        argumentsFonction+=',&'+tab[j+1][1];
       }else{
        return logerreur({status:false,value:t,id:i,tab:tab,message:'0331 les arguments passés à la fonction doivent être sous la forme  a(xxx) '});
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
       for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
        reprise=j;
       }
       i=reprise;
      }else{
       return {status:false,value:t,id:i,tab:tab,message:'problème sur le contenu de la fonction "'+nomFonction+'"'};
      }
     }
    }else{
     return {status:false,value:t,id:i,tab:tab,message:'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'};
    }
    dansFonction=false;
   }
   
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
   
   
  }else if(tab[i][1]=='castfloat' && tab[i][2]=='f'){

   var obj1=php_traiteElement(tab,i+1,niveau);
   if(obj1.status===true){
    t+='(float)'+obj1.value;
   }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecte 0804'});
   }
   debugger; // on ne devrait pas passer par ici

   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  }else if(tab[i][1]=='appelf' && tab[i][2]=='f'){

   obj=php_traiteAppelFonction(tab,i,dansInitialisation,niveau);
   
   if(obj.status==true){
    t+=obj.value;
   }else{
    return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
   }
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  }else if(tab[i][1]=='boucle'  && tab[i][2]=='f'){
  
   tabchoix=[];
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
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
     
    }else if(tabchoix[j][1]=='initialisation'){
     
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
     
    }else if(tabchoix[j][1]=='condition'){
     
     obj=php_condition0(tab,tabchoix[j][0],niveau);
     if(obj.status===true){
      condition+=obj.value;
     }else{
//      console.log(tab[tabchoix[j][0]],tab);
      return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'1 problème sur la condition du choix en indice '+tabchoix[j][0] });
     }
     condition=condition.replace(/\n/g,'');
     
    }else if(tabchoix[j][1]=='increment'){
     
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
     
    }else if(tabchoix[j][1]=='faire'){
     
     
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  

  
  }else if(tab[i][1]=='essayer'  && tab[i][2]=='f'){

   var contenu='';
   var sierreur='';
   var nomErreur=''
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='faire' && tab[j][2]=='f'){
      niveau++;
      obj=php_tabToPhp1(tab,j+1,dansFonction,false,niveau);
      niveau--;
      if(obj.status==true){
       contenu+=obj.value;
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le contenu du "essayer" ' });
      }
     }else if(tab[j][1]=='sierreur' && tab[j][2]=='f'){
      if(tab[j][8]==2){
       for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
        if(tab[k][7]===j){
         if(tab[k][1]=='faire' && tab[k][2]=='f'){
          niveau++;
          obj=php_tabToPhp1(tab,k+1,dansFonction,false,niveau);
          niveau--;
          if(obj.status==true){
           sierreur+=obj.value;
          }else{
           return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" du "essayer" ' });
          }
         }else if(tab[k][1]=='err' && tab[k][2]=='f' && tab[k][8]==2 && tab[k+1][2]=='c' && tab[k+2][2]=='c' ){
          nomErreur=tab[k+1][1]+' '+tab[k+2][1];
         }else{
          return logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" le deuxième argiment doit être "faire"' });
         }
        }
       }
      }else{
       return logerreur({status:false,value:t,id:i,tab:tab,message:'problème  0495 sur le "sierreur" du "essayer" il doit contenir 2 arguments sierreur(err(Error $e),faire())' });
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
   
  }else if(tab[i][1]=='tantQue'  && tab[i][2]=='f'){

   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     if(tab[j][1]=='condition'){
      
      obj=php_condition0(tab,j,niveau);
      
      if(obj.status===true){
       t+=espacesn(true,niveau);
       t+='while('+obj.value+'){';
      }else{
       return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'2 problème sur la condition du choix en indice '+tabchoix[j][0] });
      }
      
      
      
     }else if(tab[j][1]=='faire'){
      niveau++;
      obj=php_tabToPhp1(tab,j+1,dansFonction,false,niveau);
      niveau--;
      if(obj.status==true){
       t+=obj.value;
       t+=espacesn(true,niveau);
       t+='}';
      }else{
       return logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le alors du choix en indice '+tabchoix[j][0] });
      }
      
     }else if(tab[j][1]=='#'){
      t+=espacesn(true,niveau);
      t+='/*'+traiteCommentaire2(tab[j][13],niveau,j)+'*/';
     }
    }
   }

   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  }else if(tab[i][1]=='choix'  && tab[i][2]=='f'){
   


   var tabchoix=[];
   var aDesSinonSi=false;
   var aUnSinon=false;
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]==tab[i][3]+1){
     
     if(tab[j][1]=='si'){
      tabchoix.push([j,tab[j][1],0,[],0]); // position type position du contenu du alors
      for(k=j+1;k<l01;k++){ // chercher la position du alors dans le si
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1 ){
        tabchoix[tabchoix.length-1][2]=k+1;
        tabchoix[tabchoix.length-1][4]=tab[k][8]; // nombre d'enfants du alors
        break;
       }
       if(tab[k][3]<tab[j][3]){
        break;
       }
      }
     }else if(tab[j][1]=='sinonsi'){
      aDesSinonSi=true;
      tabchoix.push([j,tab[j][1],0,[],0]);
      for(k=j+1;k<l01;k++){ // chercher la position du alors dans le sinonsi
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1 ){ 
        tabchoix[tabchoix.length-1][2]=k+1;
        tabchoix[tabchoix.length-1][4]=tab[k][8]; // nombre d'enfants du alors
        break;
       }
       if(tab[k][3]<tab[j][3]){
        break;
       }
      }
     }else if(tab[j][1]=='sinon'){ 
      aUnSinon=true;
      tabchoix.push([j,tab[j][1],0,[],0]);
      for(k=j+1;k<l01;k++){ // chercher la position du alors dans le sinon
       if(tab[k][1]=='alors' && tab[k][3]==tab[j][3]+1 ){ 
        tabchoix[tabchoix.length-1][2]=k+1;
        tabchoix[tabchoix.length-1][4]=tab[k][8]; // nombre d'enfants du alors
        break;
       }
       if(tab[k][3]<tab[j][3]){
        break;
       }
      }
     }else if(tab[j][1]=='#'){ 
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
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][3]<=tab[i][3]+2){
     if( (tab[j][1]=='si' || tab[j][1]=='condition' || tab[j][1]=='alors' || tab[j][1]=='sinonsi' || tab[j][1]=='sinon' || tab[j][1]=='#' ) && tab[j][2]=='f' ){
      tabTemp.push(tab[j]);
     }else{
      return logerreur({status:false,value:t,id:i,tab:tab,message:'dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "'+tab[j][1]+'" '});
     }
    }
   }
//   console.log('tabTemp='+JSON.stringify(tabTemp));

   for(j=0;j<tabchoix.length;j++){
    if(tabchoix[j][1]=='#'){
     t+=espacesn(true,niveau);
     t+='/*'+traiteCommentaire2(tab[tabchoix[j][0]][13],niveau,tabchoix[j][0])+'*/';
     
    }else if(tabchoix[j][1]=='si'){
     
     t+=espacesn(true,niveau);
     t+='if(';
     
     var debutCondition=0;
     for(var k=i+1;k<l01 && tab[k][3]>tab[i][3];k++){
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
     for(var k=tabchoix[j][0];k<l01 && tab[k][3]>tab[i][3];k++){
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
   
      

  }else if(tab[i][1]=='affecteFonction'  && tab[i][2]=='f'){

   if(tab[i+1][2]=='c' && tab[i][8]>=2 ){
   }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,[p(yyy),]contenu())'});
   }

   var tabTemp=[];
   var listeParametres
   var positionContenu=-1;
   argumentsFonction='';
   
   // r.onreadystatechange = function () {
   
   for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
  
  }else if(tab[i][1]=='affecte'  && tab[i][2]=='f'){
  
   if(!dansInitialisation){
    t+=espacesn(true,niveau);
   }
   if(tab[i][8]==2){
     var avantEgal='';
     var apresEgal='';
     for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
      if(tab[j][7]==i){
       
       var elt='';
       var obj1=php_traiteElement(tab,j,niveau);
       if(obj1.status===true){
        elt=obj1.value;
       }else{
         return logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecte 0804'});
       }
        

       
       
       /* enfant 1 ou 2 */
       if(tab[j][9]===1){ 
        avantEgal=elt;
       }else{
        apresEgal=elt;
       }
       
      }
     }
     t+=avantEgal+'='+apresEgal;
     if(!dansInitialisation){
      t+=';';
     }
     
      
      
     
   }else{
    return logerreur({status:false,value:t,id:i,message:'php.js 0946 affecte ne doit contenir que 2 arguments'});
   }

   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
  }else if(tab[i][1]=='declare'  && tab[i][2]=='f'){
   
   
   t+=espacesn(true,niveau);
   if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
    if( (tab[i+2][1]=='vrai' || tab[i+2][1]=='faux' ) && tab[i+2][4]===false){
     t+='var '+tab[i+1][1]+'='+(tab[i+2][1]==='vrai'?'true':'false')+';';
    }else{
     t+='var '+tab[i+1][1]+'='+(tab[i+2][4]===true?'\''+(tab[i+2][1])+'\';' : tab[i+2][1]+';');
    }
   }else{
    if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='f' ){
     if(tab[i+2][1]=='nouveau' && tab[i+2][8]==1 && tab[i+3][1]=='appelf' ){
      t+='var '+tab[i+1][1]+'= new ';
      obj=php_traiteAppelFonction(tab,i+3,true,niveau);
      if(obj.status==true){
       t+=obj.value+';';
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans une déclaration'});
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
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
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
  }else if(tab[i][1]=='html'  && tab[i][2]=='f'){
   if(tab[i][8]===0){
    t+='?><?php';
   }else{
    php_contexte_commentaire_html=true;
    obj=tabToHtml1(tab,i,true,0);
    if(obj.status==true){
     t+='?>\n'+obj.value+'<?php';
    }else{
     return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) dans un html en 643'});     
    }
     
    reprise=i+1;
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
   }
   php_contexte_commentaire_html=false;
  
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  
   
  }else if(tab[i][1]=='entete_page_standard'  && tab[i][2]=='f'){
   if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+1][2]=='c' ){
    t+='\n';
    t+='define(\'BNF\' , basename(__FILE__));\n';
    t+='require_once(\'aa_include.php\');\n';
    t+='session_start();\n';
    t+='start_session_messages();\n';
    t+='$o1=\'\';\n';
    t+='$a=array( \'title\' => \''+(tab[i+1][1])+'\', \'description\' => \''+(tab[i+2][1])+'\');\n';
    t+='$o1=html_header1($a);\n';
    t+='$o1=concat($o1,session_messages());\n';
    t+='print($o1);\n';
    t+='$o1=\'\';';
   }else{
    return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) la fonction ente_page_standard doit contenir 2 constantes, le titre et la description'});     
   }
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  }else if(tab[i][1]=='bascule'  && tab[i][2]=='f'){
   
   var valeurQuand='';
   var valeursCase='';
   for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][7]==i){
     if(tab[j][1]==='quand' && tab[j][2]==='f' && tab[j][8]===1 ){
      valeurQuand=tab[j+1][1];
     }else if(tab[j][1]==='est'){
      var valeurCas='';
      var InstructionsCas='';
      for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
       if(tab[k][7]==j){
        if(tab[k][1]==='valeurNonPrevue' && tab[k][2]==='f' && tab[k][8]===0 ){
         valeurCas=null;
        }else if(tab[k][1]==='valeur' && tab[k][2]==='f' ){
         
         var obj=php_traiteElement(tab , k+1 , niveau)
         if(obj.status===true){
          valeurCas=obj.value;
         }else{
          return logerreur({status:false,value:t,id:ind,tab:tab,message:'php dans bascule 1069'});
         }
         
         
         valeurCas=maConstante(tab[k+1]);
        }else if(tab[k][1]==='faire' && tab[k][2]==='f' ){
         if(tab[k][8]>=1){
          niveau+=2;
          obj=php_tabToPhp1(tab,k+1,false,false,niveau);
          niveau-=2;
          if(obj.status===true){
           InstructionsCas=obj.value;
          }else{
           return logerreur({status:false,value:t,id:k,message:'erreur ( php.js ) dans faire  '});     
          }
         }else{
          InstructionsCas='';
         }
        }else{
         return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) dans bascule/est  il ne doit y avoir que "valeur" et "faire" '});     
        }
       }        
      }
      valeursCase+=espacesn(true,niveau+1);
      if(valeurCas===null){
       valeursCase+='default:';
      }else{
       valeursCase+='case '+valeurCas+':';
      }
      valeursCase+=InstructionsCas;
      valeursCase+=espacesn(true,niveau+2);
      
     }else{
      return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) dans bascule il ne doit y avoir que "quand" et "est" '});     
     }
    }
   }
   
   
   t+=espacesn(true,niveau);
   t+='switch ('+valeurQuand+'){';
   t+=valeursCase;
   t+=espacesn(true,niveau);
   t+='}';
   
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
   
  }else if(tab[i][1]=='boucleSurTableau'  && tab[i][2]=='f'){

   // for( $nom as $k1 => $v1)
   var cleEtOuValeur='';
   
   var Instructions='';
   for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
    if(tab[j][7]==i){
     if(tab[j][1]==='pourChaque' && tab[j][2]==='f' && tab[j][8]===1 ){
      for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
       if(tab[k][7]==j){
        if(tab[k][1]==='dans' && tab[k][2]==='f' ){
         
         for(var l=k+1;l<l01 && tab[l][3]>tab[k][3];l++){
          if(tab[l][7]==k){
           var obj1=php_traiteElement(tab , l , niveau);
           if(obj1.status===true){
            if(tab[k][8]===3){
             if(tab[l][9]===1){
              cleEtOuValeur+=obj1.value;
             }else if(tab[l][9]===2){
              cleEtOuValeur+=' => '+obj1.value;
              
             }else if(tab[l][9]===3){
              cleEtOuValeur=obj1.value + ' as '+ cleEtOuValeur;
             }
            }else if(tab[k][8]===2){
             if(tab[l][9]===1){
              cleEtOuValeur+=obj1.value;
             }else if(tab[l][9]===2){
              cleEtOuValeur=obj1.value + ' as '+ cleEtOuValeur;
             }
            }else{
             return logerreur({status:false,value:t,id:k,message:'erreur ( php.js ) dans boucleSurTableau 1024 '});     
            }
            
           }else{
            return logerreur({status:false,value:t,id:k,message:'erreur ( php.js ) dans boucleSurTableau 1014 '});     
           }
          }
         }
         
         
         if(tab[k][8]===3){
         }else if(tab[k][8]===2){
         }else{
         }
        }
       }
      }
     }else if(tab[j][1]==='faire' && tab[j][2]==='f' && tab[j][8]===1 ){
      if(tab[k][8]>=1){
       niveau+=1;
       obj=php_tabToPhp1(tab,k+1,false,false,niveau);
       niveau-=1;
       if(obj.status===true){
        Instructions=obj.value;
       }else{
        return logerreur({status:false,value:t,id:k,message:'erreur ( php.js ) dans faire  '});     
       }
      }else{
       Instructions='';
      }
     }
    }
   }

   t+=espacesn(true,niveau);
   t+='foreach('+cleEtOuValeur+'){';
   t+=Instructions;
   t+=espacesn(true,niveau);
   t+='}';
       

   
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
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
   logerreur({status:false,value:t,id:i,tab:tab,message:'php.js traitement non prévu 1120 '+JSON.stringify(tab[i])});

//   return logerreur({status:false,value:t,id:i,message:'erreur ( php.js ) la fonction "'+tab[i][1]+'" n\'est pas définie'});     
   t+=espacesn(true,niveau);
   
   t+='//todo php.js 861 i='+i+', tab[i][1]='+tab[i][1]+'\n';
   reprise=i+1;
   max=i+1;
   for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
    reprise=j;
   }
   i=reprise;
  }
 }


 return {status:true,value:t};
}
//=====================================================================================================================
function isNotSet(tab , id , niveau){
 var t='';
 var valeur='';
 var defaut='';
 for(var i=id+1;i<tab.length && tab[i][3]>tab[id][3];i++){
  if(tab[i][7]===id){
   if(tab[i][9]==1){
    
    var obj=php_traiteElement(tab,i,niveau);
    if(obj.status===true){
     valeur=obj.value;
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans isNotSet 1143'});
    }
     

   }else if(tab[i][9]==2){
    
    var obj=php_traiteElement(tab,i,niveau);
    if(obj.status===true){
     defaut=obj.value;
     break;
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'dans isNotSet 1154'});
    }
     
   }
  }
 }
 t+=valeur+'??'+defaut; 
 return {status:true,value:t};
}
//=====================================================================================================================
function php_traiteNew(tab,ind,niveau){
 var t='';
 
 t+='new '; 
 
 var obj=php_traiteElement(tab , ind+1 , niveau);
 if(obj.status==true){
  t+=obj.value;
 }else{
  return logerreur({status:false,value:t,id:ind,tab:tab,message:'dans appelf de php_traiteElement 1179'});
 }
 
 return {status:true,value:t};
}

//=====================================================================================================================
// hugues
function php_traiteElement(tab , ind , niveau){
 var t='';
 var obj={};
 
 if(tab[ind][2]=='c' ){ 
  
  t=maConstante(tab[ind]);
  
 }else if(tab[ind][2]=='f' && tab[ind][1]=='nouveau' ){
  
  obj=php_traiteNew(tab,ind,niveau);
  if(obj.status==true){
   t=obj.value;
  }else{
   return logerreur({status:false,value:t,id:ind,tab:tab,message:'dans appelf de php_traiteElement 1179'});
  }

 }else if(tab[ind][2]=='f' && tab[ind][1]=='appelf' ){
  
  obj=php_traiteAppelFonction(tab,ind,true,niveau);
  if(obj.status==true){
   t=obj.value;
  }else{
   return logerreur({status:false,value:t,id:ind,tab:tab,message:'dans appelf de php_traiteElement 0835'});
  }

 }else if(tab[ind][2]=='f' && ( tab[ind][1]=='concat' ||  tab[ind][1]=='plus' || tab[ind][1]=='moins' || tab[ind][1]=='mult' || tab[ind][1]=='divi' ) ){

  obj=php_traiteOperation(tab,ind,niveau);
  if(obj.status==true){
   t=obj.value;
  }else{
   return logerreur({status:false,value:t,id:ind,tab:tab,message:'dans php_traiteElement 1166'});
  }

  
 }else if(tab[ind][2]=='f' && tab[ind][1]=='tableau' ){
  
  var objTableau = php_traiteTableau1(tab,ind,niveau);
  if(objTableau.status === true){
   t=objTableau.value;
  }else{
   return(logerreur({status:false,value:t,id:ind,tab:tab,message:'erreur 1176 sur declaration '}));
  }
  
 }else if(tab[ind][2]=='f' && ( tab[ind][1]=='array' ||  tab[ind][1]=='defTab') ){
  
  obj=php_traiteDefinitionTableau(tab,ind,true);
  if(obj.status==true){
   t=obj.value;
  }else{
   return logerreur({status:false,value:t,id:ind,tab:tab,message:'dans array de affecte 1185 il y a un problème'});
  }

 }else if(tab[ind][2]=='f' && tab[ind][1]=='html' ){

  php_contexte_commentaire_html=true;
  
  obj=tabToHtml1(tab,ind,true,0);
  if(obj.status===true){
   t='htmlDansPhp(\''+obj.value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
  }else{
   return logerreur({status:false,value:t,id:ind,message:'erreur dans un html 1195 définit dans un php'});
  }
  php_contexte_commentaire_html=false;

 }else if(tab[ind][2]=='f' && tab[ind][1]=='sql' ){

  obj=tabToSql1(tab,ind,niveau);
  if(obj.status===true){
   t=obj.value;
  }else{
   return logerreur({status:false,value:t,id:ind,message:'erreur dans un sql 1205 définit dans un php'});
  }
  
 }else if(tab[ind][2]=='f' && tab[ind][1]=='??' ){

  obj=isNotSet(tab,ind,niveau);
  if(obj.status===true){
   t=obj.value;
  }else{
   return logerreur({status:false,value:t,id:ind,message:'erreur dans un sql 1214 définit dans un php'});
  }

 }else if(tab[ind][2]=='f' && tab[ind][1]=='supprimeErreur' ){
  var obj=php_traiteElement(tab , ind+1 , niveau)
  if(obj.status===true){
   t+='@'+obj.value;
  }else{
   return logerreur({status:false,value:t,id:ind,tab:tab,message:'php dans php_traiteElement 1322'});
  }
  
 }else if(tab[ind][2]=='f' && tab[ind][1]=='liste' ){
  var objListe = php_traiteListe1(tab,ind,true,niveau,false);
  if(objListe.status == true){
   t+=objListe.value;
  }else{
   return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1330 sur php_traiteOperation '}));
  }


 }else if(tab[ind][2]=='f' && tab[ind][1]=='castfloat' ){
  var obj1=php_traiteElement(tab,ind+1,niveau);
  if(obj1.status===true){
   t+='(float)'+obj1.value;
  }else{
    return logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecte 0804'});
  }

 }else if(tab[ind][2]=='f' && tab[ind][1]=='testEnLigne' ){
/*
  var objtestLi = js_traiteInstruction1(tab,niveau,ind);
  if(objtestLi.status == true){
      t+=objtestLi.value;
  }else{
      return(logerreur({status:false,value:t,id:ind,tab:tab,message:'erreur php_traiteElement 1408'}));
  }
*/  
  debugger
        var testEnLigne=[];
        var j = (ind+1);
        for(j=(ind+1);(j < tab.length) && (tab[j][3] > tab[ind][3]);j=j+1){
            if(tab[j][3] == (tab[ind][3]+1)){
                if(tab[j][1] == 'condition'){
                    testEnLigne.push(Array(j,tab[j][1],ind));
                }else if(tab[j][1] == 'siVrai'){
                    testEnLigne.push(Array(j,tab[j][1],ind));
                }else if(tab[j][1] == 'siFaux'){
                    testEnLigne.push(Array(j,tab[j][1],ind));
                }else{
                    return(logerreur({status:false,value:t,ind:ind,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'}));
                }
            }
        }
        if(testEnLigne.length !== 3){
            return(logerreur({status:false,message:'fonction php_traiteElement 1428 il faut un format testEnLigne(condition() , siVrai(1) , siFaux(2))"'}));
        }
        var j=0;
        for(j=0;j < testEnLigne.length;j=j+1){
            if(testEnLigne[j][1] === 'condition'){
                niveau=niveau+1;
                var objCondition=php_condition0(tab,testEnLigne[j][0],niveau);
                niveau=niveau-1;
                if(objCondition.status === true){
                }else{
                    return(logerreur({status:false,value:t,ind:testEnLigne[j][0],tab:tab,'message':'1 php_traiteElement sur condition 1438 '+testEnLigne[j][0]}));
                }
            }else if(testEnLigne[j][1] === 'siVrai'){
                niveau=niveau+1;
                var objSiVrai = php_traiteElement(tab,niveau,(testEnLigne[j][0]+1));
                niveau=niveau-1;
                if(objSiVrai.status === true){
                }else{
                    return(logerreur({status:false,value:t,ind:testEnLigne[j][0],tab:tab,'message':'1 php_traiteElement sur siVrai 1446 '+testEnLigne[j][0]}));
                }
            }else if(testEnLigne[j][1] === 'siFaux'){
                niveau=niveau+1;
                var objSiFaux = php_traiteElement(tab,niveau,(testEnLigne[j][0]+1));
                niveau=niveau-1;
                if(objSiFaux.status === true){
                }else{
                    return(logerreur({status:false,value:t,ind:testEnLigne[j][0],tab:tab,'message':'1 php_traiteElement sur objSiFaux 1454 '+testEnLigne[j][0]}));
                }
            }
        }
        t='('+objCondition.value+'?'+objSiVrai.value+':'+objSiFaux.value+')';
  
  
  
  
  
  
/*        
 }else if(tab[i+1][2]=='c' && tab[i+2][2]=='f' && tab[i+2][1]=='sqlref' ){
   return logerreur({status:false,value:t,id:ind,message:'erreur dans un sql 1135 définit dans un php'});
  var numSql=0;
  var strSql='';
  var tabPar=[];
  
  for(j=i+3;j<l01 && tab[ind][3]>tab[i+2][3];j++){
   if(tab[ind][1]=='num'){
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
    if(tab[ind][7]==tab[i+2][0]){
     if(tab[ind][1]=='p'){
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
     if(tabPar[ind][2]==false){ // isNaN
      toReplace=new RegExp('%%PAR'+j+'%%');
      strSql=strSql.replace(toReplace,tabPar[ind][0]);
     }else{
      if(tabPar[ind][1]==true){ // constante quotée
       toReplace=new RegExp('%%PAR'+j+'%%');
       strSql=strSql.replace(toReplace,'\\\''+tabPar[ind][0]+'\\\'');
      }else{
       if(tabPar[ind][0].substr(0,1)=='$'){ // variable php
        toReplace=new RegExp('%%PAR'+j+'%%');
        strSql=strSql.replace(toReplace,'\'.addslashes('+tabPar[ind][0]+').\'');
       }else{
        return logerreur({status:false,value:t,id:i,message:'erreur dans un html sqlref dans un php'});
       }
      }
     }
    }
   }
//     console.log(tabPar);
   t=tab[i+1][1]+'=\''+strSql+'\';';
  }else{
   return logerreur({status:false,value:t,id:i,message:'erreur dans un sqlref , le paramètre num doit exister'});
  }        
*/        

 }else{
  return logerreur({status:false,value:t,id:ind,message:'php.js 1237 cas non prévu dans php_traiteElement "'+tab[ind][1]+'"'});
 } 
 
 
 return {status:true,value:t};
 
}
//=====================================================================================================================
function php_traiteListe1(tab,ind,niveau){
 var t='';
 var l01=tab.length;
 var lesParams=''; 
 for(var i=ind+1;i<l01 && tab[i][3]>tab[ind][3];i++){
  if(tab[i][7]===ind){
   if(tab[i][1]==='p' && tab[i][2]==='f'){
    if(lesParams!==''){
     lesParams+=' , ';
    }
    if(tab[i][8]===0){
     /*
     dans les list() de php, il peut y avoir un paramètre vide
     */
     lesParams+=' /* vide intentionnel */';
    }else{
     var obj=php_traiteElement(tab , i+1 , niveau)
     if(obj.status===true){
      lesParams+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:ind,tab:tab,message:'php dans php_traiteListe1 1423'});
     }
    }    
   }
  }
 }
 t+='list('+lesParams+')';
 
 return {status:true,value:t};
}
//=====================================================================================================================
function php_traiteOperation(tab,id,niveau){
 
 
    var t='';
    var i=0;
    var j=0;
    /*
      dans le cas d'un "plus" simple on est peut être au milieu d'une concaténation de chaine.
      Si un des deux paramètre est numérique il est plus prudent d'ajouter une parenthèse
      a+='e['+[f+1]+'] g '+h+' i';
    */
    var condi0 = ((tab[id][8] === 2) && (tab[id][1] === 'plus')) && (((tab[id+1][2] === 'c') && (isNumeric(tab[id+1][1]))) || ((tab[id+2][2] === 'c') && (isNumeric(tab[id+2][1]))));
    var l01=tab.length;
    var parentId=tab[id][0];
    var numEnfant=1;
    var i = (id+1);
    for(i=(id+1);i < l01;i=i+1){
        if(tab[i][3] <= tab[parentId][3]){
            break;
        }
        if(tab[i][7] == parentId){
            if(tab[i][1] == '#'){
            }else if((tab[i][1] == '') && (tab[i][2] == 'f')){
                var objOperation = php_traiteOperation(tab,(i+1),niveau);
                if(objOperation.status == true){
                    if(tab[parentId][1] == 'mult'){
                        t+='*';
                    }else if(tab[parentId][1] == 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] == 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] == 'etBin'){
                        t+='&';
                    }else if(tab[parentId][1] == 'concat'){
                        t+='.';
                    }else if(tab[parentId][1] == '??'){
                        t+='??';
                    }
                    t+='('+objOperation.value+')';
                }else{
                    return(logerreur({status:false,message:' erreur sur php_traiteOperation 1324'}));
                }
            }else{
                if(numEnfant == 1){
                    numEnfant=numEnfant+1;
                    if(tab[i][2] == 'c'){
                        if((tab[i][4] === 1) || (tab[i][4] === 2)){
                            t+=maConstante(tab[i]);
                        }else{
                            if(condi0){
                                t+='('+tab[i][1];
                            }else{
                                t+=tab[i][1];
                            }
                        }
                    }else if(tab[i][2] == 'f'){
                        if(tab[i][1] == '#'){
                        }else if((tab[i][1] == 'mult') || (tab[i][1] == 'plus') || (tab[i][1] == 'moins') || (tab[i][1] == 'mult') || (tab[i][1] == 'divi') || (tab[i][1] == 'etBin') || (tab[i][1] == 'concat' )  || (tab[i][1] == '??' )){
                            var objOperation = php_traiteOperation(tab,i,niveau);
                            if(objOperation.status == true){
                                t+=''+objOperation.value+'';
                            }else{
                                return(logerreur({status:false,message:' erreur sur php_traiteOperation 1324'}));
                            }
                        }else if(tab[i][1] == ''){
                            var objOperation = php_traiteOperation(tab,(i+1),niveau);
                            if(objOperation.status == true){
                                t+='('+objOperation.value+')';
                            }else{
                                return(logerreur({status:false,message:' erreur sur php_traiteOperation 1324'}));
                            }
                        }else if(tab[i][1] == 'appelf'){
                         
                            var obj=php_traiteAppelFonction(tab,i,true,niveau);
                            if(obj.status == true){
                                t+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur php_traiteOperation 1351'}));
                            }
                         
                        }else if(tab[i][1] == 'tableau'){
                            var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                            if(objTableau.status == true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1472 sur php_traiteOperation '}));
                            }
                        }else if(tab[i][1] == 'testEnLigne'){
                            var objtestLi = js_traiteInstruction1(tab,niveau,i);
                            if(objtestLi.status == true){
                                t+=objtestLi.value;
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur php_traiteOperation 1808'}));
                            }
                        }else if(tab[i][1] == 'castfloat'){
                            var objtestLi = js_traiteInstruction1(tab,niveau,i+1);
                            if(objtestLi.status == true){
                                t+='(float)'+objtestLi.value;
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur php_traiteOperation 1565'}));
                            }
                        }else{
                            return(logerreur({status:false,'message':'fonction du premier paramètre non reconnue php_traiteOperation 1347 "'+tab[i][1]+'"'}));
                        }
                    }else{
                        return(logerreur({status:false,message:'php_traiteOperation pour une opération, le premier paramètre doit être une constante'}));
                    }
                }else{
                    if(tab[parentId][1] == ''){
                        var objOperation = php_traiteOperation(tab,(i+1),niveau);
                        if(objOperation.status == true){
                            t+='('+objOperation.value+')';
                        }else{
                            return(logerreur({status:false,message:' erreur sur php_traiteOperation 1324'}));
                        }
                    }else if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                        t+='*(';
                    }else if(tab[parentId][1] == 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] == 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] == 'etBin'){
                        t+='&';
                    }else if(tab[parentId][1] == 'concat'){
                        t+='.';
                    }else if(tab[parentId][1] == '??'){
                        t+='??';
                    }
                    if(tab[i][2] === 'f'){
                        if((tab[i][1] == 'mult') || (tab[i][1] == 'plus') || (tab[i][1] == 'moins') || (tab[i][1] == 'etBin')  || (tab[i][1] == '??')){
                            var objOperation = php_traiteOperation(tab,i,niveau);
                            if(objOperation.status == true){
                                t+=objOperation.value;
                                if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                                    t+=')';
                                }
                            }else{
                                return(logerreur({status:false,message:' erreur sur php_traiteOperation 1324'}));
                            }
                        }else if(tab[i][1] == 'appelf'){
                            var obj=php_traiteAppelFonction(tab,i,true,niveau);
                            if(obj.status == true){
                                t+=obj.value;
                                if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                                    t+=')';
                                }
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur php_traiteOperation 1351'}));
                            }

                        }else if(tab[i][1] == 'testEnLigne'){
                            var obj = js_traiteInstruction1(tab,niveau,i);
                            if(obj.status == true){
                                t+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur php_traiteOperation 1862'}));
                            }
                        }else if(tab[i][1] == 'tableau'){
                            var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                            if(objTableau.status == true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1542 sur php_traiteOperation '}));
                            }
                        }else if(tab[i][1] == 'castfloat'){
                            var objtestLi = js_traiteInstruction1(tab,niveau,i+1);
                            if(objtestLi.status == true){
                                t+='(float)'+objtestLi.value;
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur php_traiteOperation 1565'}));
                            }
                        }else{
                            return(logerreur({status:false,'message':'fonction paramètre non reconnu 1391 "'+tab[i][1]+'"'}));
                        }
                    }else{
                        if((tab[i][4] === 1) || (tab[i][4] === 2)){
                            t+=maConstante(tab[i]);
                            if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                                t+=')';
                            }
                        }else{
                            if(condi0){
                                t+=tab[i][1]+')';
                            }else{
                                if((tab[i][1].indexOf('+') >= 0) || (tab[i][1].indexOf('-') >= 0) || (tab[i][1].indexOf('*') >= 0) || (tab[i][1].indexOf('/') >= 0)){
                                    /*
                                      dans le cas ou l'élément de l'opération est lui même une opération, il vaut mieux ajouter une parenthèse
                                      Par exemple : plus['par' , numeroPar-1]
                                    */
                                    t+='('+tab[i][1]+')';
                                }else{
                                    t+=tab[i][1];
                                }
                            }
                            if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                                t+=')';
                            }
                        }
                    }
                }
            }
        }
    }
    if(tab[parentId][1]==='??'){
     t='('+t+')';
    }
    return({value:t,status:true});


 
}
//=====================================================================================================================
//=====================================================================================================================
function php_traiteAppelFonction(tab,i,dansConditionOuDansFonction,niveau){
 var t='';
 var j=0;
 var k=0;
 var obj={};
 var nomFonction='';
 var elementFonction='';
 var positionAppelFonction=0;
 var nomRetour='';
 var positionRetour=-1;
 var argumentsFonction='';
 var reprise=0;
 var max=0;
 var objTxt='';
 var l01=tab.length;
 
 positionAppelFonction=-1;
 for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
  if(tab[j][1]=='nomf' && tab[j][2]=='f' && tab[j][3]==tab[i][3]+1){
   positionAppelFonction=j;
   if(tab[j][8]==1){
    if(tab[j+1][2]==='c'){
     nomFonction=tab[j+1][1];
    }else if(tab[j+1][2]==='f' && tab[j+1][1]==='tableau'){
     var obj1=php_traiteTableau1(tab,j+1,niveau);
     if(obj1.status==true){
      nomFonction=obj1.value;
     }else{
      return logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans php_traiteAppelFonction 1364'});
     }
    }else{
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
  argumentsFonction='';
  var dansNew=false;
  // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE
  
  for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
   if(tab[j][1]=='defTab' && tab[j][3]==tab[i][3]+1){
    obj=php_traiteDefinitionTableau(tab,j,true);
    if(obj.status==true){
     argumentsFonction+=','+obj.value+'';
    }else{
     return logerreur({status:false,value:t,id:i,tab:tab,message:'dans traiteAppelFonction Objet il y a un problème'});
    }
    
    
    
    reprise=i+1;
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   }else if(tab[j][1]=='element' && tab[j][3]==tab[i][3]+1){
    if(tab[j+1][1]==='nouveau'){
     dansNew=true;
     var indice=j+1;
    }else{
     var indice=j;
    }
    if(tab[indice+1][2]=='c' ){
     elementFonction=maConstante(tab[indice+1])+'->';
    }else if(tab[indice+1][2]=='f' ){
     if(tab[indice+1][1]=='appelf'){
      var obindice=php_traiteAppelFonction(tab,indice+1,true,niveau);
      if(obindice.status==true){
       if(dansNew===true){
        elementFonction='(new '+obindice.value+')->';
       }else{
        elementFonction=obindice.value+'->';
       }
      }else{
       return logerreur({status:false,value:t,id:indice,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
      }

     }else if(tab[indice+1][1]=='tableau'){
      
      var obindice=php_traiteTableau1(tab,indice+1,niveau);
      if(obindice.status==true){
       elementFonction=''+obindice.value+'->';
      }else{
       return logerreur({status:false,value:t,id:indice,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
      }
     
     }else{
      return logerreur({status:false,value:t,id:indice,tab:tab,message:'1614 erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[indice+1][1]});
     }
    }else{
      return logerreur({status:false,value:t,id:indice,tab:tab,message:'erreur dans un appel de fonction 1193 element '});
    }
    
    
    
    
    
   }else if(tab[j][1]=='p' && tab[j][3]==tab[i][3]+1){
    
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    if(tab[j][8]==1 && tab[j+1][2]=='c' ){ // le paramètre est une constante
     if(nomFonction==='define'){
      /* dans un define, \r\n doit être entre double quotes !!! */
      var temp=maConstante(tab[j+1]);
      temp=temp.substr(1,temp.length-2);
      temp=temp.replace(/\\\'/g,'\'');
      temp=temp.replace(/"/g,'\\"');
      temp='"'+temp+'"';
//      console.log('temp=',temp);
      argumentsFonction+=','+temp;
     }else{
      argumentsFonction+=','+maConstante(tab[j+1]);
     }
    }else{
     var obj1=php_traiteElement(tab , j+1 , niveau);
     if(obj1.status===true){
       argumentsFonction+=','+obj1.value;
     }else{
       return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1858 dans php_traiteAppelFonction '});
     }
/*     
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='appelf'){
       obj=php_traiteAppelFonction(tab,j+1,true,niveau);
       if(obj.status==true){
        argumentsFonction+=','+obj.value;
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }
      }else if(tab[j+1][1]=='concat'){
       obj=php_traiteConcat(tab,j+1,niveau);
       if(obj.status==true){
        argumentsFonction+=','+obj.value+'';
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }

      }else if(tab[j+1][1]=='tableau'){
       
       obj=php_traiteTableau1(tab,j+1,niveau);
       if(obj.status==true){
        argumentsFonction+=','+obj.value+'';
       }else{
        return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }
      
      }else{
       return logerreur({status:false,value:t,id:j,tab:tab,message:' 1668 erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[j+1][1]});
      }
     }
*/     
    }
   }
  }
  if(argumentsFonction!==''){
   argumentsFonction=argumentsFonction.substr(1);
  }
  
  if(!dansConditionOuDansFonction){
   t+=espacesn(true,niveau);
  }
  t+=nomRetour!=''?nomRetour+'=':'';
  
  if(nomFonction==='use'){
   
   argumentsFonction=argumentsFonction.replace(/\\\\/g,'\\');
   argumentsFonction=argumentsFonction.substr(1,argumentsFonction.length-2);
   t+=nomFonction+' '+argumentsFonction+'';
   
  }else if(nomFonction==='echo'){
   t+=elementFonction+nomFonction+' '+argumentsFonction+' ';
   
  }else{
   t+=elementFonction+nomFonction+'('+argumentsFonction+')';
   
  }
  
  if(!dansConditionOuDansFonction){
   
   t+=';';
   
  }
 }else{
  return logerreur({status:false,value:t,id:i,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
 }
 return {status:true,value:t};
}
//=====================================================================================================================
function php_traiteConcat(tab,id,niveau){
 var t='';
 for(var j=id+1;j<tab.length && tab[j][3]>tab[id][3];j++){
  if(tab[j][3]==tab[id][3]+1){ // si on est au niveau +1
  
   /*
    on ajoute systématiquement un "."
   */
   t+='.';
   
   if(tab[j][2]=='c'){
    t+=maConstante(tab[j]);
   }else if(tab[j][2]=='f'){ // c'est un appel f ou un concat

    if(tab[j][1]==='appelf'){

     obj=php_traiteAppelFonction(tab,j,true,niveau);
     if(obj.status==true){
      t+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1025'});
     }

    }else if(tab[j][1]==='concat'){

     obj=php_traiteConcat(tab,j,niveau);
     if(obj.status==true){
      t+=obj.value;
     }else{
      return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1033'});
     }

    }else if(tab[j][1]==='tableau'){

     var obj = php_traiteTableau1(tab,j,niveau);
     if(obj.status === true){
      t+=obj.value;
     }else{
      logerreur({status:false,value:t,id:j,tab:tab,message:'1541 problème dans un tableau php_traiteConcat '});
     }
     
    }else{

     return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1036'});

    }

   }else{

    return logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1028'});

   }
  }
 }
 if(t!==''){
   /*
    on supprime le premier  "."
   */
  t=t.substr(1);
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
     if(tab[j+2][1]=='defTab'){
      obj=php_traiteDefinitionTableau(tab,j+2,true);
      if(obj.status==true){
       textObj+=', '+(tab[j+1][4]==true?'\''+(tab[j+1][1])+'\'':tab[j+1][1])+' => '+obj.value+'';
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans php_traiteDefinitionTableau il y a un problème'});
      }
     }else{
      textObj+=', '+(tab[j+1][4]==true?'\''+(tab[j+1][1])+'\'':tab[j+1][1])+' => '+(tab[j+2][4]==true?'\''+(tab[j+2][1])+'\'':tab[j+2][1])+'';
     }
    }else if(tab[j][8]==1){
     if(tab[j+1][1]=='defTab' && tab[j+1][2]=='f' ){
      obj=php_traiteDefinitionTableau(tab,j+1,true);
      if(obj.status==true){
       textObj+=', '+obj.value+'';
      }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'dans php_traiteDefinitionTableau il y a un problème'});
      }
     }else{
      textObj+=', '+(tab[j+1][4]==true?'\''+(tab[j+1][1])+'\'':tab[j+1][1])+'';
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
  if((tab[i][1]=='vrai' || tab[i][1]=='faux') && tab[i][4]==false ){
   t+=tab[i][1]=='vrai'?'true':'false';
  }else if(tab[i][4]==true){
   t+='\'';
   t+=(tab[i][1]);
   t+='\'';
  }else{
   t+=''+tab[i][1];
  }  
 }else{
  for(i=id;i<max;i++){
   if((tab[i][1]=='non' || tab[i][1]=='et' || tab[i][1]=='ou' || (premiereCondition==true && tab[i][1]=='' ) ) && tab[i][8]>0 && tab[i][2]=='f'){ //i18
    if(tab[i][1]=='non'){
     t+=' !';
    }else if(tab[i][1]=='et'){
     t+=' && ';
    }else if(tab[i][1]=='ou'){
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
   }else if( tab[i][1]=='appelf'  && tab[i][2]=='f' ){
 
    niveau++;
    obj=php_traiteAppelFonction(tab,i,true,niveau);
    niveau--;
    if(obj.status==true){
     t+=obj.value;
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans une condition'});
    }
    i=max-1;
    
    
   }else if( tab[i][1]=='affecte'  && tab[i][2]=='f' ){
    /*
    affecte dans une condition, je n'aime vraiment pas ça
    */
    
    obj=php_tabToPhp1(tab,i,true,true,niveau);
    if(obj.status==true){
     t+=obj.value;
    }else{
     return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur dans une condition'});
    }
    i=max-1;
    
    
    
   }else if( (tab[i][1]=='egal' || tab[i][1]=='egalstricte' || tab[i][1]=='diff' || tab[i][1]=='diffstricte' || tab[i][1]=='sup' || tab[i][1]=='inf'|| tab[i][1]=='supeg' || tab[i][1]=='infeg' ) && tab[i][2]=='f' ){
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
       t+='\''+(tab[tabPar[0]][1])+'\'';
      }else{
       if(tab[tabPar[0]][1]=='vrai' || tab[tabPar[0]][1]=='faux'){
        t+=(tab[tabPar[0]][1]=='vrai'?'true':'false');
       }else{
        t+=tab[tabPar[0]][1];
       }
      }
     }else{
      if(tab[tabPar[0]][2]=='f' && tab[tabPar[0]][1]=='appelf'){

       obj=php_traiteAppelFonction(tab,tabPar[0],true,niveau);
       if(obj.status==true){
        t+=obj.value;
       }else{
        return logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
       }

      }else if(tab[tabPar[0]][2]=='f' && tab[tabPar[0]][1]=='tableau'){

       var obj = php_traiteTableau1(tab,tab[tabPar[0]][0],niveau);
       if(obj.status === true){
        t+=obj.value;
       }else{
        logerreur({status:false,value:t,id:tabPar[0][0],tab:tab,message:'1726 problème dans un tableau de tableau '});
       }


      }else{
       return logerreur({status:false,value:t,id:id,message:'1750 erreur dans une condition pour un test egal, diff...' + tab[tabPar[0]][1]});
      }
     }
     if(tab[i][1]=='egal'){
      t+=' == ';
     }else if(tab[i][1]=='egalstricte'){
      t+=' === ';
     }else if(tab[i][1]=='diffstricte'){
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
     var obj1=php_traiteElement(tab , tabPar[1] , niveau);
     if(obj1.status===true){
       t+=obj1.value;
     }else{
       return logerreur({status:false,value:t,id:id,tab:tab,message:'erreur 1858'});
     }
     i=max-1;
    }else{
     return logerreur({status:false,value:t,id:id,message:'1795 erreur dans une condition ' + tab[i][1]});
    }
   }else if(tab[i][1]!='' && tab[i][2]=='c' ){
    if((tab[i][1]=='vrai' || tab[i][1]=='faux') && tab[i][4]==false ){
     t+=tab[i][1]=='vrai'?'true':'false';
    }else if(tab[i][4]==true){
     t+='\'';
     t+=(tab[i][1]);
     t+='\'';
    }else{
     t+=''+tab[i][1];
    }
   }else{
    logerreur({status:false,id:i,message:'1808 erreur dans une condition ' + JSON.stringify(tab[i])});
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
      return logerreur({status:false,value:t,id:id,message:'1835 erreur dans une condition racine'});
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
    
   }else if(tab[i][1]=='et' || tab[i][1]=='ou' ){
   
    if(premiereCondition){
     return logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'});
    }else{
     obj=php_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'1857 erreur dans une condition racine'});
     }
     t+=obj.value;
     var reprise=i+1;
     var max=i+1;
     for(j=max;j<tab.length && tab[j][3]>tab[i][3];j++){
      reprise=j;
     }
     i=reprise;

    }        
    
   }else if(tab[i][1]=='egal' || tab[i][1]=='egalstricte' || tab[i][1]=='diff' || tab[i][1]=='diffstricte'  || tab[i][1]=='sup'  || tab[i][1]=='inf' || tab[i][1]=='supeq'  || tab[i][1]=='infeg' ){
   
    if(!premiereCondition){
     return {status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est soit "()", soit [egal|sup|inf|diff]'};
    }else{
     obj=php_condition1(tab,i,niveau);
     if(obj.status==false){
      return logerreur({status:false,value:t,id:id,message:'1876 erreur dans une condition racine'});
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
