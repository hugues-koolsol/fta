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

function ma_cst_pour_php(elt){
 var r=maConstante(elt);
 if(elt[4]===1 || elt[4]===2 ){ // constante quotée
    r=r.replace(/\\\\d/g,'\\d').replace(/\\\\o/g,'\\o').replace(/\\\\\./g,'\\.').replace(/\\\\\-/g,'\\-').replace(/\\\\\//g,'\\/');
 }else if(elt[4]===3 ){ 
   
   // constante quotée "
    r=r.replace(/\\\\\$/g,'\\$');
 }

 return r;
}

//=====================================================================================================================
function php_logerr(o){
 if(global_indice_erreur_originale_traitee===-1){
  if(o.hasOwnProperty('id')){
   global_indice_erreur_originale_traitee=o.id;
   if(o.hasOwnProperty('tab')){
    o['position_caractere']=o.tab[o.id][5];
    if(o.status===false && o.hasOwnProperty('message')){
     o.message+=', en position '+o.tab[o.id][5]+' du rev';
    }
    
   }else{
    console.log('Attention, le tableau(tab) n\'est pas indiqué pour cette erreur');
   }
  }else{
   global_indice_erreur_originale_traitee=0;
   console.log('Attention, l\'id n\'est pas indiqué pour cette erreur');
  }
 }
 return logerreur(o);
}

//=====================================================================================================================
function parsePhp0(tab,id,niveau){
 var i=0;
 var t='';
 var obj={}; 
 php_contexte_commentaire_html=false;
 var retJS=php_tabToPhp1(tab,id+1,false,false,niveau);
 if(retJS.status===true){
  var contenu=retJS.value;
  t+=contenu.replace(/<\?php\?>/g,'');
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
    var tabchoix=[];
    var l01=tab.length;
    var id_parent=tab[id][7];
    
    for(i=id;i<l01 && tab[i][3]>=tab[id][3] ;i++){
     // console.log(tab[i]);
     
      if(tab[i][7]===id_parent){
     
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
              return php_logerr({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
             }
            }else if(tab[i+2][2]=='c' ){
             t+=ma_cst_pour_php(tab[i+2]);
            }else{
             
             var obj1=php_traiteElement(tab,i+2,niveau,{});
             if(obj1.status===true){
              t+=obj1.value;
             }else{
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans php_tabToPhp1 0114'});
             }
             
             
        //     t+='/* TODO 36 php.js pour define '+ tab[i+1][1] + ' */';
            }
            t+=');';
          
        
        }else if(tab[i][1]==='break' && tab[i][2]==='f' && tab[i][8]===0 ){ 
            t+=espacesn(true,niveau);
            t+='break;'
        
        }else if(tab[i][1]=='continue' && tab[i][2]=='f' ){
            
            if(tab[i][8]==0){
             t+=espacesn(true,niveau);
             t+='continue;'
            }else if(tab[i][8]==1){
             t+=espacesn(true,niveau);
             t+='continue '+ma_cst_pour_php(tab[i+1])+';';
            }else{
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans php_tabToPhp1 0140'});
            }
        
        
        }else if(tab[i][1]=='sortir' && tab[i][2]=='f' ){ 
        
        
            if(tab[i][8]==0){
             t+=espacesn(true,niveau);
             t+='exit;'
            }else if(tab[i][8]==1 && tab[i+1][2]=='c' ){
             t+=espacesn(true,niveau);
             t+='exit('+maConstante(tab[i+1])+');'
             i++;
            }else{
             var obj1=php_traiteElement(tab,i+1,niveau,{});
             if(obj1.status===true){
              t+='exit('+obj1.value+');'
             }else{
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans php_tabToPhp1 0267'});
             }
            }
         
        }else if(tab[i][1]=='revenir' && tab[i][2]=='f' ){ 

            if(tab[i][8]==0){
             t+=espacesn(true,niveau);
             t+='return;'
            }else{
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'0165 dans php_tabToPhp1 revenir ne doit pas avoir de paramètres'});
            }
        
        
        }else if(tab[i][1]=='retourner' && tab[i][2]=='f' ){ 
        
        
            if(tab[i][8]==0){
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'0173 dans php_tabToPhp1 retourner doit avoir un paramètre'});
              t+=espacesn(true,niveau);
              t+='return;'
            }else if(tab[i][8]==1 && tab[i+1][2]=='c' ){
             t+=espacesn(true,niveau);
             t+='return('+ma_cst_pour_php(tab[i+1])+');';
             i++;
            }else{
             t+=espacesn(true,niveau);
             var obj1=php_traiteElement(tab,i+1,niveau,{});
             if(obj1.status===true){
              t+='return('+obj1.value+');'
             }else{
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans php_tabToPhp1 0289'});
             }
             
            }
         
         
        }else if(tab[i][1]=='fonction' && tab[i][2]=='f' ){
        
        
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
                 var obj1=php_traiteElement(tab,k+1,niveau,{});
                 if(obj1.status===true){
                  argumentsFonction+='='+obj1.value;
                 }else{
                  return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans les arguments passés à la fonction 0333'});
                 }
                 
                 
                }else{
                 return php_logerr({status:false,value:t,id:i,tab:tab,message:'0330 les arguments passés à la fonction '});
                }
               }
              }
             }else{
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'0325 les arguments passés à la fonction doivent être sous la forme  a(xxx) '});
             }
            }else if(tab[j][1]=='adresseArgument' && tab[j][3]==tab[positionDeclarationFonction][3]+1){ 
             if(tab[j][8]==1){
              argumentsFonction+=',&'+tab[j+1][1];
             }else{
              return php_logerr({status:false,value:t,id:i,tab:tab,message:'0331 les arguments passés à la fonction doivent être sous la forme  a(xxx) '});
             }
            }
           }
           
           
           if(nomFonction!=''){
            t+=CRLF;
            t+=espacesn(true,niveau);
            t+='function '+nomFonction+'('+(argumentsFonction==''?'':argumentsFonction.substr(1))+'){';
            t+=CRLF;
            obj=php_tabToPhp1(tab,positionContenu+1,dansFonction,false,niveau+1);
            if(obj.status==true){
             t+=obj.value;
             t+=CRLF;
             t+=espacesn(true,niveau);
             t+='}';
            }else{
             return {status:false,value:t,id:i,tab:tab,message:'problème sur le contenu de la fonction "'+nomFonction+'"'};
            }
           }
          }else{
           return {status:false,value:t,id:i,tab:tab,message:'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'};
          }
          dansFonction=false;
         
         
         
        }else if(tab[i][1]=='castfloat' && tab[i][2]=='f'){

            var obj1=php_traiteElement(tab,i+1,niveau,{});
            if(obj1.status===true){
             t+='(float)'+obj1.value;
            }else{
              return php_logerr({status:false,value:t,id:id,tab:tab,message:'dans php_tabToPhp1 0425'});
            }
            debugger; // on ne devrait pas passer par ici


        }else if(tab[i][1]=='castint' && tab[i][2]=='f'){

            var obj1=php_traiteElement(tab,i+1,niveau,{});
            if(obj1.status===true){
             t+='(int)'+obj1.value;
            }else{
              return php_logerr({status:false,value:t,id:id,tab:tab,message:'dans php_tabToPhp1 0441'});
            }
            debugger; // on ne devrait pas passer par ici

        }else if(tab[i][1]=='appelf' && tab[i][2]=='f'){

            obj=php_traiteAppelFonction(tab,i,dansInitialisation,niveau);
            
            if(obj.status==true){
             t+=obj.value;
            }else{
             return php_logerr({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
            }
         
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
                     return php_logerr({status:false,value:t,id:id,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),incrément(),faire())'});
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
                    if(tab[tabchoix[j][0]][8]>0){
                        obj=php_tabToPhp1(tab,tabchoix[j][0]+1,dansFonction,true,niveau);
                        if(obj.status==true){
                            if(obj.value.substr(obj.value.length-1,1)==';'){
                             initialisation+=obj.value.substr(0,obj.value.length-1);
                            }else{
                             initialisation+=obj.value;
                            }
                            initialisation=initialisation.replace(/\n/g,'').replace(/\r/g,'');
                        }else{
                            return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'0371 problème sur le alors du choix en indice '+tabchoix[j][0] });
                        }
                    }
                 
                }else if(tabchoix[j][1]=='condition'){
                 
                    obj=php_condition0(tab,tabchoix[j][0],niveau);
                    if(obj.status===true){
                     condition+=obj.value;
                    }else{
               //      console.log(tab[tabchoix[j][0]],tab);
                     return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'1 problème sur la condition du choix en indice '+tabchoix[j][0] });
                    }
                    condition=condition.replace(/\n/g,'').replace(/\r/g,'');
                 
                }else if(tabchoix[j][1]=='increment'){
                 
                    obj=php_tabToPhp1(tab,tabchoix[j][0]+1,dansFonction,true,niveau);
                    if(obj.status==true){
                     obj.value=obj.value.replace(/\r/g,'').replace(/\n/g,'');
                     if(obj.value.substr(obj.value.length-1,1)==';'){
                      increment+=obj.value.substr(0,obj.value.length-1);
                     }else{
                      increment+=obj.value;
                     }
                     increment=increment.replace(/\n/g,'').replace(/\r/g,'').trim();
                    }else{
                     return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'0396 problème sur le alors du choix en indice '+tabchoix[j][0] });
                    }
                 
                }else if(tabchoix[j][1]=='faire'){
                 
                 
                    obj=php_tabToPhp1(tab,tabchoix[j][0]+1,dansFonction,false,niveau+1);
                    
                    if(obj.status==true){
                     faire+=obj.value;
                    }else{
                     return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'problème sur le faire en indice '+tabchoix[j][0] });
                    }
                 
                }
            }
            t+=espacesn(true,niveau);
            t+='for('+initialisation+';'+condition+';'+increment+'){';
            t+=faire;
            t+=espacesn(true,niveau);
            t+='}';
         
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
                return php_logerr({status:false,value:t,id:i,tab:tab,message:'problème sur le contenu du "essayer" ' });
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
                    return php_logerr({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" du "essayer" ' });
                   }
                  }else if(tab[k][1]=='err' && tab[k][2]=='f' && tab[k][8]==2 && tab[k+1][2]=='c' && tab[k+2][2]=='c' ){
                   nomErreur=tab[k+1][1]+' '+tab[k+2][1];
                  }else{
                   return php_logerr({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" le deuxième argiment doit être "faire"' });
                  }
                 }
                }
               }else{
                return php_logerr({status:false,value:t,id:i,tab:tab,message:'problème  0495 sur le "sierreur" du "essayer" il doit contenir 2 arguments sierreur(err(Error $e),faire())' });
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
            
        }else if(tab[i][1]=='tantQue'  && tab[i][2]=='f'){

            for(j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
             if(tab[j][3]==tab[i][3]+1){
              if(tab[j][1]=='condition'){
               
               obj=php_condition0(tab,j,niveau);
               
               if(obj.status===true){
                t+=espacesn(true,niveau);
                t+='while('+obj.value+'){';
               }else{
                return php_logerr({status:false,value:t,id:i,tab:tab,message:'2 problème sur la condition du choix en indice '+tabchoix[j][0] });
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
                return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'0516 problème sur le alors du choix en indice '+tabchoix[j][0] });
               }
               
              }else if(tab[j][1]=='#'){
               t+=espacesn(true,niveau);
               t+='/*'+traiteCommentaire2(tab[j][13],niveau,j)+'*/';
              }
             }
            }

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
            return php_logerr({status:false,value:t,id:id,tab:tab,message:'la syntaxe de choix est choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'});
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
            return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "'+tab[j][1]+'" '});
           }
          }
         }
      //   console.log('tabTemp='+JSON.stringify(tabTemp));

         for(j=0;j<tabchoix.length;j++){
          if(tabchoix[j][1]=='#'){
           t+=espacesn(true,niveau);
           t+='/*'+traiteCommentaire2(tab[tabchoix[j][0]][13],niveau,tabchoix[j][0])+'*/';
           
          }else if(tabchoix[j][1]=='si'){
           
           t+=CRLF;
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
            return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'2 problème sur la condition du choix en indice '+tabchoix[j][0] });
           }
           t+='){';
           t+=CRLF;
           
           
           
           if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il contient des enfants
            niveau++;
            obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau);
            niveau--;
            if(obj.status==true){
             t+=obj.value;
            }else{
             return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'0643 problème sur le alors du choix en indice '+tabchoix[j][0] });
            }
           }
           
           
           if(aDesSinonSi){
           }else{
            if(aUnSinon){
            }else{
             t+=CRLF;
             t+=espacesn(true,niveau);
             t+='}';
             t+=CRLF;
            }
           }
           
          }else if(tabchoix[j][1]=='sinonsi'){
           
           t+=CRLF;
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
            return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'3 problème sur la condition du choix en indice '+tabchoix[j][0] });
           }
           t+='){';
           t+=CRLF;
           
           
           if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il contient des enfants
            niveau++;
            obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau);
            niveau--;
            if(obj.status==true){
             t+=obj.value;
            }else{
             return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'0690 problème sur le alors du choix en indice '+tabchoix[j][0] });
            }
           }
           
           if(aUnSinon){
           }else{
            if(j==tabchoix.length-1){ // si c'est le dernier sinonsi
             t+=CRLF;
             t+=espacesn(true,niveau);
             t+='}';
             t+=CRLF;
            }
           }
           
          }else{
           t+=CRLF;
           t+=espacesn(true,niveau);
           t+='}else{';
           t+=CRLF;
           if(tabchoix[j][2]>0 && tabchoix[j][4]>0){ // si on a trouve un "alors" et qu'il contient des enfants
            niveau++;
            obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau);
            niveau--;
            if(obj.status==true){
             t+=obj.value;
            }else{
             return php_logerr({status:false,value:t,id:tabchoix[j][0],tab:tab,message:'0716 problème sur le alors du choix en indice '+tabchoix[j][0] });
            }
           }
           t+=espacesn(true,niveau);
           t+='}';
           t+=CRLF;
          }
         }

        }else if(tab[i][1]=='affecteFonction'  && tab[i][2]=='f'){

            if(tab[i+1][2]=='c' && tab[i][8]>=2 ){
            }else{
              return php_logerr({status:false,value:t,id:id,tab:tab,message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,[p(yyy),]contenu())'});
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
                return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans affecteFonction, les parametres doivent être des variables affecteFonction(xxx,[p(yyy),]contenu()) '});
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
             return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans affecteFonction, il faut un contenu() : affecteFonction(xxx,[p(yyy),]contenu())'});
            }
        
        }else if((tab[i][1]=='affecte' || tab[i][1]=='affecte_reference' )  && tab[i][2]=='f'){
        
            if(!dansInitialisation){
             t+=espacesn(true,niveau);
            }
            if(tab[i][8]==2){
              var avantEgal='';
              var apresEgal='';
              for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
               if(tab[j][7]==i){
                
                var elt='';
                var obj1=php_traiteElement(tab,j,niveau,{});
                if(obj1.status===true){
                 elt=obj1.value;
                }else{
                  return php_logerr({status:false,value:t,id:id,tab:tab,message:'dans affecte 0804'});
                }
                 

                
                
                /* enfant 1 ou 2 */
                if(tab[j][9]===1){ 
                 avantEgal=elt;
                }else{
                 apresEgal=elt;
                }
                
               }
              }
              if(apresEgal.substr(0,avantEgal.length)==avantEgal && apresEgal.substr(avantEgal.length,1)==='.'){
               if(tab[i][1]=='affecte_reference'){
                   t+=avantEgal+'.=&'+apresEgal.substr(avantEgal.length+1);
               }else{
                   t+=avantEgal+'.='+apresEgal.substr(avantEgal.length+1);
               }
              }else{
               if(tab[i][1]=='affecte_reference'){
                   t+=avantEgal+'=&'+apresEgal;
               }else{
                   t+=avantEgal+'='+apresEgal;
               }
              }
              if(!dansInitialisation){
               t+=';';
              }
              
               
               
              
            }else{
             return php_logerr({status:false,value:t,id:i,tab:tab,message:'php.js 0946 affecte ne doit contenir que 2 arguments'});
            }

        
        }else if( ( tab[i][1]=='static'   || tab[i][1]=='declare' ) && tab[i][2]=='f'){
         
         
         t+=espacesn(true,niveau);
         if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
          if(tab[i][1]=='static'){
           t+='static '
          }
          t+=ma_cst_pour_php(tab[i+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r')+ ' = '+ ma_cst_pour_php(tab[i+2]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r')+';';
         }else{
          return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur dans un php en 0967'});     
         }
         
        }else if(tab[i][1]=='php'  && tab[i][2]=='f'){

      //   debugger; 
         php_contexte_commentaire_html=false;
         obj=php_tabToPhp1(tab,i+1,false,false,niveau); // tab,id,dansFonction,dansInitialisation,niveau){
         if(obj.status==true){
          t+='<?'+'php'+obj.value+CRLF+'?>';
          php_contexte_commentaire_html=true;
         }else{
          return php_logerr({status:false,value:t,id:i,tab:tab,message:'php.js erreur 621'});     
         }
          
        
        }else if(tab[i][1]=='html'  && tab[i][2]=='f'){
         if(tab[i][8]===0){
          t+='?><?php';
         }else{
          php_contexte_commentaire_html=true;
          obj=__module_html1.tabToHtml1(tab,i,true,0);
          if(obj.status==true){
           if(obj.value.substr(obj.value.length-2,2)==='\r\n'){
            obj.value=obj.value.substr(0,obj.value.length-2)
           }else if(obj.value.substr(obj.value.length-1,1)==='\r' || obj.value.substr(obj.value.length-1,1)==='\n' ){
            obj.value=obj.value.substr(0,obj.value.length-1)
           }
           
           t+='?>'+obj.value+'<?php';
          }else{
           return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur ( php.js ) dans un html en 643'});     
          }
           
         }
         php_contexte_commentaire_html=false;
         
        }else if(tab[i][1]=='bascule'  && tab[i][2]=='f'){
         /*
           equivalent du switch
         */
         
         var valeurQuand='';
         var valeursCase='';
         for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
             if(tab[j][7]==i){
                 if(tab[j][1]==='quand' && tab[j][2]==='f' ){
                     if(tab[j][8]===1 && tab[j+1][2]==='c'){
                         valeurQuand=tab[j+1][1];
                     }else{
                         var obj=php_traiteElement(tab , j+1 , niveau,{})
                         if(obj.status===true){
                          valeurQuand=obj.value;
                         }else{
                          return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php dans bascule 0980'});
                         }
                     }
                 }else if(tab[j][1]==='est'){
                     var valeurCas='';
                     var InstructionsCas='';
                     for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
                         if(tab[k][7]==j){
                             if(tab[k][1]==='valeurNonPrevue' && tab[k][2]==='f' && tab[k][8]===0 ){
                                 valeurCas=null;
                             }else if(tab[k][1]==='valeur' && tab[k][2]==='f' ){
                              
                                 if(tab[k+1][2]=='f'){
                                  var obj=php_traiteElement(tab , k+1 , niveau,{})
                                  if(obj.status===true){
                                   valeurCas=obj.value;
                                  }else{
                                   return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php dans bascule 1069'});
                                  }
                                 }else{         
                                  valeurCas=ma_cst_pour_php(tab[k+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                                 }
                             }else if(tab[k][1]==='faire' && tab[k][2]==='f' ){
                                 if(tab[k][8]>=1){
                                     niveau+=2;
                                     obj=php_tabToPhp1(tab,k+1,false,false,niveau);
                                     niveau-=2;
                                     if(obj.status===true){
                                      InstructionsCas=obj.value;
                                     }else{
                                      return php_logerr({status:false,value:t,id:k,tab:tab,message:'erreur ( php.js ) dans faire  '});     
                                     }
                                 }else{
                                     InstructionsCas='';
                                 }
                             }else{
                                 return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur ( php.js ) dans bascule/est  il ne doit y avoir que "valeur" et "faire" '});     
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
                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur ( php.js ) dans bascule il ne doit y avoir que "quand" et "est" '});     
                 }
             }
         }
         
         
         t+=espacesn(true,niveau);
         t+='switch ('+valeurQuand+'){';
         t+=valeursCase;
         t+=espacesn(true,niveau);
         t+='}';
         
         
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
                 var obj1=php_traiteElement(tab , l , niveau,{});
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
                   return php_logerr({status:false,value:t,id:k,tab:tab,message:'erreur ( php.js ) dans boucleSurTableau 1024 '});     
                  }
                  
                 }else{
                  return php_logerr({status:false,value:t,id:k,tab:tab,message:'erreur ( php.js ) dans boucleSurTableau 1014 '});     
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
           }else if(tab[j][1]==='faire' && tab[j][2]==='f' ){
            if(tab[k][8]>=1){
             niveau+=1;

             obj=php_tabToPhp1(tab,k+1,false,false,niveau);
             niveau-=1;
             if(obj.status===true){
              Instructions=obj.value;
             }else{
              return php_logerr({status:false,value:t,id:k,tab:tab,message:'erreur ( php.js ) dans faire  '});     
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
             
         
        }else if(tab[i][1]=='__halt_compiler'  && tab[i][2]=='f'){
         t+=espacesn(true,niveau);
         if(tab[i][8]===0){
             t+='__halt_compiler()';
         }else{
             /* remaining */
             
             if(tab[i+1][4]===1){
               /* constante quotée avec ' */
               var a=ma_cst_pour_php(tab[i+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
               a=a.substr(1);
               a=a.substr(0,a.length-1);
               t+='__halt_compiler() ?'+'>'+a;
             }else if(tab[i+1][4]===3){
               var a=ma_cst_pour_php(tab[i+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\"/g,'"').replace(/\\\\/g,'\\');
               a=a.substr(1);
               a=a.substr(0,a.length-1);
               t+='__halt_compiler() ?'+'>'+a;
             }else{
                return(php_logerr({status:false,value:t,id:i,tab:tab,message:'php dans php_tabToPhp1 1130'}));
             }
             i++;
         }
         
        }else if(tab[i][1]=='globale'  && tab[i][2]=='f'){
         
            var les_globales='';
            t+=espacesn(true,niveau);
            t+='global ';
            for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                if(tab[j][7]===i){
                    if(tab[j][2]==='c'){
                     les_globales+=','+maConstante(tab[j]);
                    }else if(tab[j][2] === 'f' && tab[j][1]=== '#'){
                    }else{
                        return(php_logerr({status:false,value:t,id:i,tab:tab,message:'php dans php_tabToPhp1 1136'}));
                    }
                }
            }
            if(les_globales!==''){
                les_globales=les_globales.substr(1);
                t+=les_globales+';';
            }else{
                return(php_logerr({status:false,value:t,id:i,tab:tab,message:'php dans php_tabToPhp1 1147'}));
            }
         
        }else if(tab[i][1]=='#'  && tab[i][2]=='f'){
      //   console.log('\n\n\n\n=====commentaire = "'+tab[i][13]+'"\n====\ntab='+JSON.stringify(tab)+'\n=============\n' )
         
          // test pour savoir si ce commentaire est contenu dans un html ( en dehors du tag php )
          // 
          if(php_contexte_commentaire_html==true){
           t+=espacesn(true,niveau)+'<!-- '+traiteCommentaire2(tab[i][13],niveau,i)+' -->';
           php_logerr({status:true,id:i,tab:tab,warning:'Attention, danger, un commentaire est directement dans la racine de source <pre>'+tab[i][13]+'</pre>'});
          }else{
           t+=espacesn(true,niveau)+'/*'+traiteCommentaire2(tab[i][13],niveau,i)+'*/';
          }
          
        }else if(tab[i][1]=='méthode'  && tab[i][2]=='f'){
          var obj=php_traiteElement(tab , i , niveau,{})
          if(obj.status===true){
           t+=espacesn(true,niveau);
           t+=obj.value;
          }else{
           return(php_logerr({status:false,value:t,id:i,tab:tab,message:'php dans php_tabToPhp1 1230'}));
          }
          
        }else if(tab[i][2]==='f' && tab[i][1]==='sql_inclure_reference' ){
            if(tab[i][8]===1 && tab[i+1][2]==='c'){
                t+=espacesn(true,niveau);
                t+='sql_inclure_reference('+tab[i+1][1]+');';
                t+=espacesn(true,niveau);
                t+='/*sql_inclure_deb*/';
                t+=espacesn(true,niveau);
                t+='require_once(INCLUDE_PATH.\'/sql/sql_1.php\');';
                t+=espacesn(true,niveau);
                t+='/*sql_inclure_fin*/';
                t+=espacesn(true,niveau);
                debugger
            }else{
                return php_logerr({status:false,value:t,id:i,tab:tab,message:'php_tabToPhp1 dans sql_inclure_reference 1649'});
            }
          
          
          
        }else{
        

          var obj=php_traiteElement(tab , i , niveau,{})
          if(obj.status===true){
           t+=espacesn(true,niveau);
           t+=obj.value+';';
          }else{
           return(php_logerr({status:false,value:t,id:i,tab:tab,message:'php dans php_tabToPhp1 1230'}));
          }
        }
      }
    }
    return {status:true,value:t};
}


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
                    return(php_logerr({status:false,value:t,id:i,tab:tab,message:'1045 problème dans un tableau de tableau '}));
                }
            }else{

                var obj1=php_traiteElement(tab,j+1,niveau,{});
                if(obj1.status===true){
                 nomTableau=obj1.value;
                }else{
                 return php_logerr({status:false,value:t,id:j,tab:tab,message:'dans php_traiteTableau1 0110'});
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
                    php_logerr({status:false,value:t,id:i,tab:tab,'message':'1107 les seuls paramètres de tableau sont nomt,p,prop "'+tab[j][1]+'"'});
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
                    argumentsFonction+='['+ma_cst_pour_php(tab[j+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r')+']';
                }else if((tab[j][8] > 1) && (tab[j+1][2] == 'c')){
                    return(php_logerr({status:false,value:t,id:i,tab:tab,message:'dans php_traiteTableau1 0083'}));
                }else{
                    var obj1=php_traiteElement(tab,j+1,niveau,{});
                    if(obj1.status===true){
                     argumentsFonction+='['+obj1.value+']';
                    }else{
                     return php_logerr({status:false,value:t,id:j,tab:tab,message:'dans php_traiteTableau1 0110'});
                    }
                }
            }else{
               return(php_logerr({status:false,value:t,id:i,tab:tab,message:'dans php_traiteTableau1 0170'}));
            }
        }
        }
        t+=nomTableau;
        t+=argumentsFonction;
        t+=proprietesTableau;
    }else{
        return(php_logerr({status:false,value:t,id:i,tab:tab,message:' dans php_traiteTableau1 '}));
    }
    return({status:true,value:t});
}

//=====================================================================================================================
function isNotSet(tab , id , niveau){
 var t='';
 var valeur='';
 var defaut='';
 for(var i=id+1;i<tab.length && tab[i][3]>tab[id][3];i++){
  if(tab[i][7]===id){
   if(tab[i][9]==1){
    
    var obj=php_traiteElement(tab,i,niveau,{});
    if(obj.status===true){
     valeur=obj.value;
    }else{
     return php_logerr({status:false,value:t,id:id,tab:tab,message:'dans isNotSet 1143'});
    }
     

   }else if(tab[i][9]==2){
    
    var obj=php_traiteElement(tab,i,niveau,{});
    if(obj.status===true){
     defaut=obj.value;
     break;
    }else{
     return php_logerr({status:false,value:t,id:id,tab:tab,message:'dans isNotSet 1154'});
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
 
 var obj=php_traiteElement(tab , ind+1 , niveau,{});
 if(obj.status==true){
  t+=obj.value;
 }else{
  return php_logerr({status:false,value:t,id:ind,tab:tab,message:'dans appelf de php_traiteElement 1179'});
 }
 
 return {status:true,value:t};
}

//=====================================================================================================================
// hugues
function php_traiteElement(tab , ind , niveau,options={}){
 var t='';
 var obj={};
 var l01=tab.length;
 
 if(tab[ind][2]==='c' ){ 
  
  t=ma_cst_pour_php(tab[ind]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
  
 }else if(tab[ind][2]==='f' && tab[ind][1]==='nouveau' ){
  
  obj=php_traiteNew(tab,ind,niveau);
  if(obj.status==true){
   t=obj.value;
  }else{
   return php_logerr({status:false,value:t,id:ind,tab:tab,message:'dans appelf de php_traiteElement 1179'});
  }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='definition_de_classe' ){
  
  obj=php_traiteAppelDefinition_de_classe(tab,ind,false,niveau);
  if(obj.status==true){
   t=obj.value;
  }else{
   return php_logerr({status:false,value:t,id:ind,tab:tab,message:'1324 dans php_traiteElement'});
  }
  
  
 }else if(tab[ind][1]==='casttableau' && tab[ind][2]==='f'){

   var obj1=php_traiteElement(tab,ind+1,niveau,{});
   if(obj1.status===true){
    t+='(array)'+obj1.value;
   }else{
     return php_logerr({status:false,value:t,id:id,tab:tab,message:'dans affecte 0425'});
   }
  

 }else if(tab[ind][2]==='f' && ( tab[ind][1]==='variable_protégée' || tab[ind][1]==='variable_privée' || tab[ind][1]==='variable_publique' || tab[ind][1]==='variable_publique_statique' || tab[ind][1]==='variable_privée_statique' ) ){
    var declaration='';
    for( var i=ind+1;i<l01 && tab[i][3]>tab[ind][3];i++){
        if(tab[i][7]===ind){
            if(tab[i][1]==='defaut'){
                var obj1=php_traiteElement(tab,i+1,niveau,{});
                if(obj1.status===true){
                   if(declaration===''){
                       return php_logerr({status:false,value:t,id:i,tab:tab,message:'1410 php_traiteElement'});
                   }else{
                       declaration+='='+obj1.value;
                   }
                }else{
                    return php_logerr({status:false,value:t,id:i,tab:tab,message:'1410 php_traiteElement'});
                }
            }else{
                var obj1=php_traiteElement(tab,i,niveau,{});
                if(obj1.status===true){
                   if(declaration===''){
                       declaration=obj1.value;
                   }else{
                       return php_logerr({status:false,value:t,id:i,tab:tab,message:'1410 php_traiteElement'});
                   }
                }else{
                    return php_logerr({status:false,value:t,id:i,tab:tab,message:'1410 php_traiteElement'});
                }
            }
        }
    }
    if(tab[ind][1]==='variable_protégée' ){
        t+='protected '+declaration;
    }else if( tab[ind][1]==='variable_privée' ){
        t+='private '+declaration;
    }else if( tab[ind][1]==='variable_publique' ){
        t+='public '+declaration;
    }else if( tab[ind][1]==='variable_publique_statique' ){
        t+='public static '+declaration;
    }else if( tab[ind][1]==='variable_privée_statique' ){
        t+='private static '+declaration;
    }
    
  
 }else if(tab[ind][2]==='f' && tab[ind][1]==='méthode' ){
  
     var nom_methode=''; // nomm
     var statique=' ';
     var privee_publique='public ';
     var les_arguments='';
     var les_commentaires_methode='';
     var contenu='';
     for( var i=ind+1;i<l01 && tab[i][3]>tab[ind][3];i++){
         if(tab[i][7]===ind){
             if(tab[i][1]==='definition' && tab[i][2]==='f'){
                 for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
                     if(tab[j][7]===i){
                         if(tab[j][1]==='nomm' && tab[j][2]==='f' && tab[j][8]===1 && tab[j+1][2]==='c'){
                             nom_methode=tab[j+1][1];
                         }else if(tab[j][1]==='privée' && tab[j][2]==='f' && tab[j][8]===0 ){
                             privee_publique='private ';
                         }else if(tab[j][1]==='publique' && tab[j][2]==='f' && tab[j][8]===0 ){
                             privee_publique='public ';
                         }else if(tab[j][1]==='statique' && tab[j][2]==='f' && tab[j][8]===0 ){
                             statique='static ';
                         }else if(tab[j][1]==='argument' && tab[j][2]==='f' && tab[j][8]===1 && tab[j+1][2]==='c'){
                             les_arguments+=','+tab[j+1][1];
                         }else if(tab[j][1]==='argument' && tab[j][2]==='f' && tab[j][8]>1){
                          
                             for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
                              if(tab[k][7]===j){
                                    if(tab[k][1]==='defaut'){
                                      var obj1=php_traiteElement(tab,k+1,niveau,{});
                                    }else{
                                      var obj1=php_traiteElement(tab,k,niveau,{});
                                    }
                                    if(obj1.status===true){
                                     if(tab[k][1]==='defaut'){

                                       les_arguments+='='+obj1.value;
                                     }else{
                                      les_arguments+=','+obj1.value;
                                     }
                                    }else{
                                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans les arguments passés à la fonction 0333'});
                                    }
                                
                                
                              }
                             }
                          
                         }else if(tab[j][1]==='#' && tab[j][2]==='f' ){
                         }else{
                             return( php_logerr({status:false,value:t,id:ind,tab:tab,message:'1358 dans php_traiteElement'}));
                         }
                     }
                 }
                 if(nom_methode===''){
                     return(php_logerr({status:false,value:t,id:ind,tab:tab,message:'1353 dans php_traiteElement'}));
                 }
                 if(les_arguments!==''){
                     les_arguments=les_arguments.substr(1);
                 }
             }else if(tab[i][1]==='contenu' && tab[i][2]==='f' ){
                 if(tab[i][8]>=1){
                     var obj1=php_tabToPhp1(tab,i+1,true,false,niveau+1);
                     if(obj1.status===true){
                         contenu=obj1.value;
                     }else{
                         return(php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement 1375'}));
                     }
                 }
             }else if(tab[i][1]==='#'  && tab[i][2]==='f'){
                 les_commentaires_methode+=espacesn(true,niveau);
                 les_commentaires_methode+='/*'+traiteCommentaire2(tab[i][13],niveau,i)+'*/';
             }else{
                 return(php_logerr({status:false,value:t,id:ind,tab:tab,message:'1344 dans php_traiteElement'}));
             }
         }
     }
     t+=privee_publique+statique+'function '+nom_methode+'('+les_arguments+'){';
     t+=les_commentaires_methode;
     t+=contenu;
     t+=espacesn(true,niveau);
     t+='}';
  
  
 }else if(tab[ind][2]==='f' && tab[ind][1]==='appelf' ){
  
     obj=php_traiteAppelFonction(tab,ind,true,niveau);
     if(obj.status==true){
      t=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'dans appelf de php_traiteElement 0835'});
     }


 }else if(tab[ind][2]==='f' && ( tab[ind][1]==='non'  || tab[ind][1]==='et'  || tab[ind][1]==='ou'  ) ){
  
    
     obj=php_condition1(tab,ind,niveau,tab[ind][7]);
     if(obj.status==true){
      t=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'dans php_traiteElement 1434'});
     }


 }else if(tab[ind][2]==='f' && ( tab[ind][1]==='concat' ||  tab[ind][1]==='plus' || tab[ind][1]==='moins' || tab[ind][1]==='mult' || tab[ind][1]==='divi' || tab[ind][1]==='infeg' || tab[ind][1]==='egal' || tab[ind][1]==='modulo'  || tab[ind][1]==='div' || 'ou_binaire' === tab[ind][1] || 'xou_binaire' ===  tab[ind][1] ) ){
     
     obj=php_traiteOperation(tab,ind,niveau);
     if(obj.status==true){
         t=obj.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'dans php_traiteElement/php_traiteOperation "'+tab[ind][1]+'" 1166'});
     }

  
 }else if(tab[ind][2]==='f' && tab[ind][1]==='tableau' ){
  
     var objTableau = php_traiteTableau1(tab,ind,niveau);
     if(objTableau.status === true){
      t=objTableau.value;
     }else{
      return(php_logerr({status:false,value:t,id:ind,tab:tab,message:'erreur 1176 sur php_traiteElement '}));
     }
  
 }else if(tab[ind][2]==='f' && ( tab[ind][1]==='array' ||  tab[ind][1]==='defTab') ){
  
     obj=php_traiteDefinitionTableau(tab,ind,niveau,{'retour_ligne':true});
     if(obj.status==true){
      t=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'dans array de php_traiteElement 1373 il y a un problème'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='html' ){

     php_contexte_commentaire_html=true;
     
     obj=__module_html1.tabToHtml1(tab,ind,true,0);
     if(obj.status===true){
      t='htmlDansPhp(\''+obj.value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'erreur php_traiteElement dans un html 1195 définit dans un php'});
     }
     php_contexte_commentaire_html=false;

 }else if(tab[ind][2]==='f' && tab[ind][1]==='sql' ){

     obj=tabToSql1(tab,ind,niveau,false);
     if(obj.status===true){
      t=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'erreur php_traiteElement dans un sql 1205 définit dans un php'});
     }
  
 }else if(tab[ind][2]==='f' && tab[ind][1]==='??' ){

     obj=isNotSet(tab,ind,niveau);
     if(obj.status===true){
      t=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'erreur php_traiteElement dans un sql 1214 définit dans un php'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='supprimeErreur' ){
  
     var obj=php_traiteElement(tab , ind+1 , niveau,{})
     if(obj.status===true){
      t+='@'+obj.value;
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement dans php_traiteElement 1322'});
     }
  
 }else if(tab[ind][2]==='f' && tab[ind][1]==='liste' ){
  
     var objListe = php_traiteListe1(tab,ind,true,niveau,false);
     if(objListe.status == true){
         t+=objListe.value;
     }else{
         return(php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement erreur 1330 sur php_traiteOperation '}));
     }


 }else if(tab[ind][2]==='f' && tab[ind][1]==='caststring' ){

     var obj1=php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+='(string)'+obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement 1551'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='castfloat' ){

     var obj1=php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+='(float)'+obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement 1551'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='postinc' ){

     var obj1=php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+=obj1.value+'++';
     }else{
        return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement 1437'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='preinc' ){
  
     var obj1=php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+='++'+obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement 1447'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='postdec' ){
  
     var obj1=php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+=''+obj1.value+'--';
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement 1456'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='predec' ){
  
     var obj1=php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+='--'+obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement 1465'});
     }

 }else if(tab[ind][2]==='f' && tab[ind][1]==='castint' ){
  
     var obj1=php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+='(int)'+obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement dans castint 1436'});
     }

 }else if(tab[ind][2]==='f' && ( tab[ind][1]==='affecte' ) ){
  
     var obj1=php_tabToPhp1(tab,ind,false,true,niveau);
     if(obj1.status===true){
         t+=obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement  1553'});
     }


 }else if(tab[ind][2]==='f' && ( tab[ind][1]==='affecte_reference' ) ){
     debugger  
     var obj1=php_tabToPhp1(tab,ind,false,true,niveau);
     if(obj1.status===true){
         t+=obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement  1553'});
     }


 }else if(tab[ind][2]==='f' && tab[ind][1]==='propriete' ){
     if(tab[ind][8]===2){

         var obj1=php_traiteElement(tab,ind+1,niveau,{});
         if(obj1.status===true){
             t+=obj1.value;
         }else{
            return(php_logerr({status:false,value:t,ind:ind,tab:tab,message:'1626 php_traiteElement propriété '}));
         }
         var obj1=php_traiteElement(tab,ind+2,niveau,{});
         if(obj1.status===true){
             t+='->'+obj1.value;
         }else{
            return(php_logerr({status:false,value:t,ind:ind,tab:tab,message:'1634 php_traiteElement propriété '}));
         }
      
      
     }else{
         return(php_logerr({status:false,value:t,ind:ind,tab:tab,message:'1622 php_traiteElement propriété '}));
     }

  
 }else if(tab[ind][2]==='f' && tab[ind][1]==='testEnLigne' ){
  
     var testEnLigne=[];
     var j = (ind+1);
     for(j=(ind+1);(j < tab.length) && (tab[j][3] > tab[ind][3]);j=j+1){
         if(tab[j][3] === (tab[ind][3]+1)){
             if(tab[j][1] === 'condition'){
                 testEnLigne.push(Array(j,tab[j][1],ind));
             }else if(tab[j][1] === 'siVrai'){
                 testEnLigne.push(Array(j,tab[j][1],ind));
             }else if(tab[j][1] === 'siFaux'){
                 testEnLigne.push(Array(j,tab[j][1],ind));
             }else{
                 return(php_logerr({status:false,value:t,ind:ind,tab:tab,message:'1639 php.js testEnLigne'}));
             }
         }
     }
     if(testEnLigne.length !== 3){
         return(php_logerr({status:false,id,ind,tab:tab,message:'php_traiteElement 1428 il faut un format testEnLigne(condition() , siVrai(1) , siFaux(2))"'}));
     }
     var j=0;
     for(j=0;j < testEnLigne.length;j=j+1){
         if(testEnLigne[j][1] === 'condition'){
             niveau=niveau+1;
             var objCondition=php_condition0(tab,testEnLigne[j][0],niveau);
             niveau=niveau-1;
             if(objCondition.status === true){
             }else{
                 return(php_logerr({status:false,value:t,ind:testEnLigne[j][0],tab:tab,'message':'1 php_traiteElement sur condition 1438 '+testEnLigne[j][0]}));
             }
         }else if(testEnLigne[j][1] === 'siVrai'){
             niveau=niveau+1;
             var objSiVrai = php_traiteElement(tab,(testEnLigne[j][0]+1),niveau,{});
             niveau=niveau-1;
             if(objSiVrai.status === true){
             }else{
                 return(php_logerr({status:false,value:t,ind:testEnLigne[j][0],tab:tab,'message':'1 php_traiteElement sur siVrai 1446 '+testEnLigne[j][0]}));
             }
         }else if(testEnLigne[j][1] === 'siFaux'){
             niveau=niveau+1;
             var objSiFaux = php_traiteElement(tab,(testEnLigne[j][0]+1),niveau,{});
             niveau=niveau-1;
             if(objSiFaux.status === true){
             }else{
                 return(php_logerr({status:false,value:t,ind:testEnLigne[j][0],tab:tab,'message':'1 php_traiteElement sur objSiFaux 1454 '+testEnLigne[j][0]}));
             }
         }
     }
     t='('+objCondition.value+'?'+objSiVrai.value+':'+objSiFaux.value+')';

 }else if(tab[ind][2]==='f' && tab[ind][1]==='sql_inclure_source' ){
     if(tab[ind][8]===1 && tab[ind+1][2]==='c'){
         t+='sql_inclure_source('+tab[ind+1][1]+')';
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement dans sql_inclure_source 1643'});
     }
 }else if(tab[ind][2]==='f' && tab[ind][1]==='sql_inclure_reference' ){
     if(tab[ind][8]===1 && tab[ind+1][2]==='c'){
         t+='sql_inclure_reference('+tab[ind+1][1]+')';
         t+=espacesn(true,niveau);
         t+='/*sql_inclure_deb*/';
         t+=espacesn(true,niveau);
         t+='require_once(INCLUDE_PATH.\'/sql/sql_1.php\');';
         t+=espacesn(true,niveau);
         t+='/*sql_inclure_fin*/';
         t+=espacesn(true,niveau);
         debugger
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement dans sql_inclure_reference 1649'});
     }
  
 }else{
      
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php.js 1506 php_traiteElement "'+tab[ind][1]+'" non traité '});
     /*
      dernier espoir coupé pour l'instant car boucle infinie
     */

     var obj1=php_tabToPhp1(tab,ind,true,true,niveau); // tab,id,dansFonction,dansInitialisation,niveau)php_traiteElement(tab,ind+1,niveau,{});
     if(obj1.status===true){
         t+=obj1.value;
     }else{
         return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php_traiteElement dans castint 1436'});
     }
  
  
  
  
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
     var obj=php_traiteElement(tab , i+1 , niveau,{})
     if(obj.status===true){
      lesParams+=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:ind,tab:tab,message:'php dans php_traiteListe1 1423'});
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
                    }else if(tab[parentId][1] === 'modulo'){
                        t+='%';
                    }else if(tab[parentId][1] === 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] === 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] === 'etBin'){
                        t+='&';
                    }else if(tab[parentId][1] === 'concat'){
                        t+='.';
                    }else if(tab[parentId][1] === '??'){
                        t+='??';
                    }else{
                     return(php_logerr({status:false,id:i,tab:tab,message:' erreur sur php_traiteOperation 1633 pour op= '+tab[parentId][1] }));
                    }
                    t+='('+objOperation.value+')';
                }else{
                    return(php_logerr({status:false,id:i,tab:tab,message:' erreur sur php_traiteOperation 1612'}));
                }
            }else{
                if(numEnfant == 1){
                    numEnfant=numEnfant+1;
                    if(tab[i][2] == 'c'){

                        if(condi0){
                            t+='(';
                        }
                        t+=ma_cst_pour_php(tab[i]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
/*                        
                        if((tab[i][4] === 1) || (tab[i][4] === 2)){
                            t+=ma_cst_pour_php(tab[i]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                        }else{
                            if(condi0){
                                t+='('+tab[i][1];
                            }else{
                                t+=tab[i][1];
                            }
                        }
*/                        
                    }else if(tab[i][2] === 'f'){
                        if(tab[i][1] == '#'){
                        }else if((tab[i][1] === 'mult') || (tab[i][1] === 'plus') || (tab[i][1] === 'modulo') || (tab[i][1] === 'moins') || (tab[i][1] === 'mult') || (tab[i][1] === 'divi') || (tab[i][1] === 'etBin') || (tab[i][1] === 'concat' )  || (tab[i][1] === '??' )){
                            var objOperation = php_traiteOperation(tab,i,niveau);
                            if(objOperation.status === true){
                                t+=''+objOperation.value+'';
                            }else{
                                return(php_logerr({status:false,id:i,tab:tab,message:' erreur sur php_traiteOperation 1634'}));
                            }
                        }else if(tab[i][1] == ''){
                            var objOperation = php_traiteOperation(tab,(i+1),niveau);
                            if(objOperation.status == true){
                                t+='('+objOperation.value+')';
                            }else{
                                return(php_logerr({status:false,id:i,tab:tab,message:' erreur sur php_traiteOperation 1641'}));
                            }
                        }else if(tab[i][1] === 'appelf'){
                         
                            var obj=php_traiteAppelFonction(tab,i,true,niveau);
                            if(obj.status == true){
                                t+=obj.value;
                            }else{
                                return(php_logerr({status:false,value:t,id:id,tab:tab,message:'erreur php_traiteOperation 1351'}));
                            }
                         
                        }else if(tab[i][1] === 'tableau'){

                            var obj1=php_traiteTableau1(tab,i,niveau);
                            if(obj1.status==true){
                             t=obj1.value;
                            }else{
                             return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur dans php_traiteOperation 1643'});
                            }

                        }else if(tab[i][1] === 'testEnLigne' || tab[i][1] === 'castfloat' || tab[i][1] === 'castint' || tab[i][1] === 'propriete' ){
                            var obj1=php_traiteElement(tab , i , niveau,{});
                            if(obj1.status===true){
                              t+=obj1.value;
                            }else{
                              return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur 1649 dans php_traiteOperation '});
                            }
                         
                        }else{
                            return(php_logerr({status:false,id:i,tab:tab,'message':'fonction du premier paramètre non reconnue php_traiteOperation 1347 "'+tab[i][1]+'"'}));
                        }
                    }else{
                        return(php_logerr({status:false,id:i,tab:tab,message:'php_traiteOperation pour une opération, le premier paramètre doit être une constante'}));
                    }
                }else{
                    if(tab[parentId][1] == ''){
                        var objOperation = php_traiteOperation(tab,(i+1),niveau);
                        if(objOperation.status == true){
                            t+='('+objOperation.value+')';
                        }else{
                            return(php_logerr({status:false,id:i,tab:tab,message:' erreur sur php_traiteOperation 1695'}));
                        }
                    }else if((tab[parentId][1] === 'mult')){
                        if(tab[i][2]==='c'){
                            t+='*';
                        }else{
                            t+='*(';
                        }
                    }else if( (tab[parentId][1] === 'divi') ){
                        if(tab[i][2]==='c'){
                            t+='/';
                        }else{
                            t+='/(';
                        }
                    }else if(tab[parentId][1] === 'non'){
                        t+='!';
                    }else if(tab[parentId][1] === 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] === 'modulo'){
                        t+='%';
                    }else if(tab[parentId][1] === 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] === 'etBin'){
                        t+='&';
                    }else if(tab[parentId][1] === 'concat'){
                        t+='.';
                    }else if(tab[parentId][1] === '??'){
                        t+='??';
                    }else if(tab[parentId][1] === 'egal'){
                        t+='==';
                    }else if(tab[parentId][1] === 'infeg'){
                        t+='<=';
                    }else if(tab[parentId][1] === 'ou_binaire'){
                        t+='|';
                    }else if(tab[parentId][1] === 'xou_binaire'){
                        t+='^';
                    }else{
                       return(php_logerr({status:false,value:t,id:id,tab:tab,message:'erreur php_traiteOperation 1735 pour op='+tab[parentId][1] }));
                    }
                    if(tab[i][2] === 'f'){
                        if((tab[i][1] === 'mult') || (tab[i][1] === 'plus') || (tab[i][1] === 'moins') || (tab[i][1] === 'etBin')  || (tab[i][1] === 'ou_binaire')  || (tab[i][1] === 'xou_binaire')  || (tab[i][1] == '??') || (tab[i][1] == 'modulo') ){
                            var objOperation = php_traiteOperation(tab,i,niveau);
                            if(objOperation.status == true){
                                if(tab[parentId][1]==='concat'){
                                   t+='('+objOperation.value+')';
                                }else{
                                   t+=objOperation.value;
                                }
                                if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi')){
                                    t+=')';
                                }
                            }else{
                                return(php_logerr({status:false,id:i,tab:tab,message:' erreur sur php_traiteOperation 1741'}));
                            }
                        }else if(tab[i][1] == 'appelf'){
                            var obj=php_traiteAppelFonction(tab,i,true,niveau);
                            if(obj.status == true){
                                t+=obj.value;
                                if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi')){
                                    t+=')';
                                }
                            }else{
                                return(php_logerr({status:false,value:t,id:id,tab:tab,message:'erreur php_traiteOperation 1351'}));
                            }

                        }else if(tab[i][1] === 'testEnLigne' || tab[i][1] === 'castfloat' || tab[i][1] === 'castint' || tab[i][1] === 'postinc' || tab[i][1] === 'propriete' ){
                            var obj1=php_traiteElement(tab , i , niveau,{});
                            if(obj1.status===true){
                              t+=obj1.value;
                              if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi')){
                                  t+=')';
                              }
                            }else{
                              return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur 1714 dans php_traiteOperation '});
                            }
                        }else if(tab[i][1] == 'tableau'){

                            var obj1=php_traiteTableau1(tab,i,niveau);
                            if(obj1.status==true){
                             t+=obj1.value;
                             if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi')){
                                 t+=')';
                             }
                            }else{
                             return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur dans php_traiteOperation 1723'});
                            }

                        }else{
                            return(php_logerr({status:false,id:i,tab:tab,'message':'fonction paramètre non reconnu 1391 "'+tab[i][1]+'"'}));
                        }
                    }else{
                        /*
                        c'est une constante
                        */
                        if((tab[i][4]>0)){
                            t+=ma_cst_pour_php(tab[i]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
//                            if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
//                                t+=')';
//                            }
                        }else{
                            if(condi0){
                                t+=tab[i][1]+')';
                            }else{
/*                             
                                if((tab[i][1].indexOf('+') >= 0) || (tab[i][1].indexOf('-') >= 0) || (tab[i][1].indexOf('*') >= 0) || (tab[i][1].indexOf('/') >= 0) || (tab[i][1].indexOf('%') >= 0)){
                                    //
                                    //  dans le cas ou l'élément de l'opération est lui même une opération, il vaut mieux ajouter une parenthèse
                                    //  Par exemple : plus['par' , numeroPar-1]
                                    //
                                    t+='('+tab[i][1]+')';
                                }else{
*/                                 
                                     t+=tab[i][1];
/*                                     
                                }
*/                                
                            }
//                            if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
//                                t+=')';
//                            }
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

function php_traiteAppelDefinition_de_classe(tab,ind,dansConditionOuDansFonction,niveau){
 var t='';
 
 var nom_de_classe='';
 var contenu='';
 var l01=tab.length;
 for(var i=ind+1;i<l01 && tab[i][3]>tab[ind][3];i++){
     if( tab[i][7]===ind && tab[i][2]==='f' ){
         if( tab[i][1] === "nom_classe" && tab[i][8]===1 && tab[i+1][2]==='c'){
             nom_de_classe=maConstante(tab[i+1]);
         }else if( tab[i][1] === "contenu" && tab[i][2]==='f' && tab[i][8]>0){
             var obj=php_tabToPhp1(tab,i+1,false,false,niveau+1);
             
             if(obj.status===true){
                 contenu=obj.value;
             }else{
                 return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur dans php_traiteAppelDefinition_de_classe 1856'});
             }
         }
     }
 }
 if(nom_de_classe===''){
    return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur dans php_traiteAppelDefinition_de_classe 1862'});
 }
 t+='class '+nom_de_classe+'{'+contenu;
 t+=espacesn(true,niveau);
 t+='}';
 
 
 
 return {status:true,value:t};
}

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
  if(tab[j][1]==='nomf' && tab[j][2]==='f' && tab[j][3]===tab[i][3]+1){
   positionAppelFonction=j;
   if(tab[j][8]===1){
    if(tab[j+1][2]==='c'){
     nomFonction=tab[j+1][1];
    }else if(tab[j+1][2]==='f' && tab[j+1][1]==='tableau'){
     var obj1=php_traiteTableau1(tab,j+1,niveau);
     if(obj1.status===true){
      nomFonction=obj1.value;
     }else{
      return php_logerr({status:false,value:t,id:i,tab:tab,message:'erreur dans php_traiteAppelFonction 1364'});
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
   if(tab[j][1]==='r' && tab[j][2]==='f' && tab[j][3]===tab[i][3]+1){
    if(tab[j][8]===1){
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
   if(tab[j][1]==='defTab' && tab[j][3]===tab[i][3]+1){
    obj=php_traiteDefinitionTableau(tab,j,niveau,{});
    if(obj.status==true){
     argumentsFonction+=','+obj.value+'';
    }else{
     return php_logerr({status:false,value:t,id:i,tab:tab,message:'dans traiteAppelFonction Objet il y a un problème'});
    }
    
    
    
    reprise=i+1;
    max=i+1;
    for(j=max;j<l01 && tab[j][3]>tab[i][3];j++){
     reprise=j;
    }
    i=reprise;
    
   }else if(tab[j][1]==='element' && tab[j][3]===tab[i][3]+1){
    if(tab[j+1][1]==='nouveau'){
     dansNew=true;
     var indice=j+1;
    }else{
     var indice=j;
    }
    if(tab[indice+1][2]==='c' ){
     if(tab[indice+1][1].length>=2 && tab[indice+1][1].substr(tab[indice+1][1].length-2,2)==='::'){
      /*
      appel à une fonction statique de php, pas de flèche
      */
      elementFonction=ma_cst_pour_php(tab[indice+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r')+'';
     }else{
      elementFonction=ma_cst_pour_php(tab[indice+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r')+'->';
     }
    }else if(tab[indice+1][2]==='f' ){
     if(tab[indice+1][1]==='appelf'){
      
         var obindice=php_traiteAppelFonction(tab,indice+1,true,niveau);
         
         if(obindice.status===true){
             if(dansNew===true){
                 elementFonction='(new '+obindice.value+')->';
             }else{
                 elementFonction=obindice.value+'->';
             }
         }else{
             return php_logerr({status:false,value:t,id:indice,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
         }

     }else if(tab[indice+1][1]=='tableau'){
      
         var obindice=php_traiteTableau1(tab,indice+1,niveau);
         if(obindice.status===true){
             elementFonction=''+obindice.value+'->';
         }else{
             return php_logerr({status:false,value:t,id:indice,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
         }
         
     }else{

         var obje=php_traiteElement(tab , indice+1 , niveau,{});
         if(obje.status===true){
             elementFonction=obje.value+'->';
         }else{
             return php_logerr({status:false,value:t,id:indice,tab:tab,message:'1614 erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[indice+1][1]});
         }
      
      
     }
    }else{
      return php_logerr({status:false,value:t,id:indice,tab:tab,message:'erreur dans un appel de fonction 1193 element '});
    }
    
    
    
    
    
   }else if(tab[j][1]==='p' && tab[j][3]===tab[i][3]+1){
    
    // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE

    if(tab[j][8]===1 && tab[j+1][2]==='c' ){ // le paramètre est une constante
     argumentsFonction+=','+ma_cst_pour_php(tab[j+1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
    }else{
     var obj1=php_traiteElement(tab , j+1 , niveau,{});
     if(obj1.status===true){
       argumentsFonction+=','+obj1.value;
     }else{
       return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur 1858 dans php_traiteAppelFonction '});
     }
/*     
     // cas ou le paramètre d'une fonction est une fonction
     if(tab[j][8]==1 && tab[j+1][2]=='f' ){
      if(tab[j+1][1]=='appelf'){
       obj=php_traiteAppelFonction(tab,j+1,true,niveau);
       if(obj.status==true){
        argumentsFonction+=','+obj.value;
       }else{
        return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }
      }else if(tab[j+1][1]=='concat'){
       obj=php_traiteConcat(tab,j+1,niveau);
       if(obj.status==true){
        argumentsFonction+=','+obj.value+'';
       }else{
        return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }

      }else if(tab[j+1][1]=='tableau'){
       
       obj=php_traiteTableau1(tab,j+1,niveau);
       if(obj.status==true){
        argumentsFonction+=','+obj.value+'';
       }else{
        return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'});
       }
      
      }else{
       return php_logerr({status:false,value:t,id:j,tab:tab,message:' 1668 erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[j+1][1]});
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
  return php_logerr({status:false,value:t,id:i,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'});
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
   
   if(tab[j][2]==='c'){
    t+=ma_cst_pour_php(tab[j]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
   }else if(tab[j][2]==='f'){ // c'est un appel f ou un concat

    if(tab[j][1]==='appelf'){

     obj=php_traiteAppelFonction(tab,j,true,niveau);
     if(obj.status===true){
      t+=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1025'});
     }

    }else if(tab[j][1]==='concat'){

     obj=php_traiteConcat(tab,j,niveau);
     if(obj.status===true){
      t+=obj.value;
     }else{
      return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1033'});
     }

    }else if(tab[j][1]==='tableau'){

     var obj = php_traiteTableau1(tab,j,niveau);
     if(obj.status === true){
      t+=obj.value;
     }else{
      php_logerr({status:false,value:t,id:j,tab:tab,message:'1541 problème dans un tableau php_traiteConcat '});
     }
     
    }else{

     return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1036'});

    }

   }else{

    return php_logerr({status:false,value:t,id:j,tab:tab,message:'erreur dans un php_traiteConcat 1028'});

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
function php_traiteDefinitionTableau(tab,id,niveau,options={}){ // id = position de 'obj'
 var t='';
 var j=0;
 var obje={};
 var textObj='';
 var l01=tab.length;
 
 var nombre_elements_dans_tableau=0;
 
 for(j=id+1;j<l01 && tab[j][3]>tab[id][3];j++){
  if(tab[j][3]===tab[id][3]+1){ // si on est au niveau +1
   if(tab[j][1]==='' && tab[j][2]=='f'){
    nombre_elements_dans_tableau++;
   }
  }
 }
 
 for(j=id+1;j<tab.length && tab[j][3]>tab[id][3];j++){
  if(tab[j][3]===tab[id][3]+1){ // si on est au niveau +1
   if(tab[j][1]==='' && tab[j][2]==='f'){
    if(tab[j][8]===2){
     
     /* format clé => valeur */
     var cle='';
     var valeur='';
     for(var k=j+1;k<l01 && tab[k][3]>tab[j][3];k++){
         if(tab[k][7]===j){
             niveau+=2;
             obje=php_traiteElement(tab , k , niveau,options);
             niveau-=2;
             if(obje.status===true){
                 if(tab[k][9]===1){
                    cle=obje.value;
                 }else{
                    valeur=obje.value;
                 }
             }else{
                return php_logerr({status:false,value:t,id:id,tab:tab,message:'2357 php_traiteDefinitionTableau il y a un problème'});
             }
         }
     }
     textObj+=',';
     if(nombre_elements_dans_tableau>3){
      textObj+=espacesn(true,niveau+1);
     }else{
      textObj+= ' ';
     }
     textObj+=cle+' => '+valeur+'';

     
    }else if(tab[j][8]===1){

     /* en php, i peut n'y avoir qu'une dimention sans cle => valeur array['a','b']  */
     
     niveau+=2;
     obje=php_traiteElement(tab , j+1 , niveau,options);
     niveau-=2;
     if(obje.status==true){
      textObj+=',';
      if(nombre_elements_dans_tableau>3){
       textObj+=espacesn(true,niveau+1);
      }else{
       textObj+= ' ';
      }
       textObj+=obje.value+'';
     }else{
      return php_logerr({status:false,value:t,id:id,tab:tab,message:'2378 php_traiteDefinitionTableau il y a un problème'});
     }
     
     
    }
   }
  }
 }
 t+='array(';
 if(textObj!==''){
  t+=textObj.substr(1);
 }
 t+=')';
 
 return {status:true,value:t};

}



//=====================================================================================================================
function php_condition1(tab,id,niveau,id_parent){
 var t='';
 var i=0;
 var j=0;
 var premiereCondition=true;
 var newTab=[];
 var obj={};
 var l01=tab.length;
 var cumul='';
 var premiere=true;
 
 
 for(i=id;i<l01 && tab[i][3] > tab[id_parent][3];i++){
     if(tab[i][7]===id_parent){
         
         if(tab[i][2]==='f'){
          
             if(tab[i][1]==='condition'){
                 var obj=php_condition1(tab,i+1,niveau,i);
                 if(obj.status===true){
                     t+=obj.value;
                 return({status:true,value:t})
                 }else{
                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'2351 erreur dans une condition'});
                 }
             }else if(tab[i][1]==='non'){
              
                 
                 var obj=php_condition1(tab,i+1,niveau,i);
                 if(obj.status===true){
                     t+='!'+obj.value+'';
                     return {status:true, value:t};
                 }else{
                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'2351 erreur dans une condition'});
                 }
              
             }else if(tab[i][1]==''){
              
                 var obj=php_condition1(tab,i+1,niveau,i);
                 if(obj.status===true){
                     t+='('+obj.value+')';
                 }else{
                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'2359 erreur dans une condition'});
                 }

             }else if(tab[i][1]==='et' || tab[i][1]==='ou'){
              
                 cumul='';
                 premiere=true;

                 for(j=i+1;j<l01 && tab[j][3]>tab[i][3] ; j++ ){
                  
                     if(tab[j][7] === i){
                         if(tab[j][2]==='f'){
                          
                             var obj=php_condition1(tab,j,niveau,i);
                             if(obj.status===true){
                               if(premiere===true){
                                premiere=false;
                               }else{
                                   if(tab[i][1]==='et'){
                                       cumul+=' && ';
                                   }else{
                                       cumul+=' || ';
                                   }
                               }
                               if(tab[j][1]==='non'){
                                   cumul+=obj.value;
                               }else{
                                   cumul+='('+obj.value+')';
                               }
                              
                             }else{
                                return php_logerr({status:false,value:t,id:i,tab:tab,message:'2372 erreur dans une condition'});
                             }
                          
                          
                         }else{
                            if(premiere===true){
                                premiere=false;
                             
                            }else{
                               if(tab[i][1]==='et'){
                                  cumul+=' && ';
                               }else{
                                  cumul+=' || ';
                               }
                            }
                            cumul+=ma_cst_pour_php(tab[j]);
                         }
                     }
                        
                  
                 }

                 if(cumul!==''){
                     return {value:cumul,status:true};
                     t+=cumul;
                 }else{
                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'2372 erreur dans une condition'});
                 }
              
              
             }else if(tab[i][1]==='egal' || tab[i][1]==='egalstricte' || tab[i][1]==='diff' || tab[i][1]==='diffstricte' || tab[i][1]==='sup' || tab[i][1]==='inf'|| tab[i][1]==='supeg' || tab[i][1]==='infeg' ){
              
                 var nombre_d_operandes=0;
                 var operateur='';
                 cumul='';
                 
                 
                 if(tab[i][1]==='egal'){                operateur=' == ';
                 }else if(tab[i][1]==='egalstricte'){   operateur=' === ';
                 }else if(tab[i][1]==='diffstricte'){   operateur=' !== ';
                 }else if(tab[i][1]==='diff'){          operateur=' != ';
                 }else if(tab[i][1]==='sup'){           operateur=' > ';
                 }else if(tab[i][1]==='inf'){           operateur=' < ';
                 }else if(tab[i][1]==='supeg'){         operateur=' >= ';
                 }else if(tab[i][1]==='infeg'){         operateur=' <= ';
                 }else{
                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'2408 erreur dans une condition opérateur inconnu "'+tab[i][1]+'"'});
                 }

                 for(j=i+1;j<l01 && tab[j][3]>tab[i][3] ; j++ ){
                  
                     if(tab[j][7] === i){
                        if(tab[j][2]==='f'){
                           if(tab[j][1]==='#'){
                           }else{
                               var obj=php_traiteElement(tab,j,niveau);
                               if(obj.status===true){
                                   nombre_d_operandes++
                                   cumul+=operateur;
                                   cumul+=obj.value;
                                
                               }else{
                                   return php_logerr({status:false,value:t,id:i,tab:tab,message:'2372 erreur dans une condition'});
                               }
                           }
                      
                      
                        }else{
                            nombre_d_operandes++;
                            cumul+=operateur;
                            cumul+=ma_cst_pour_php(tab[j]);
                        }
                     }
                 }
                 if(nombre_d_operandes===2){
                     if(cumul!==''){
                      t+=cumul.substr(operateur.length);
                      return {value:t,status:true};
                      
                     }else{
                        return php_logerr({status:false,value:t,id:i,tab:tab,message:'2372 erreur dans une condition'});
                     }
                  
                 }else{
                     return php_logerr({status:false,value:t,id:i,tab:tab,message:'2456 erreur dans une condition il doit y avoir 2 opérandes dans une comparaison'});
                 }
             }else{
                 
                 var obj1=php_traiteElement(tab , i , niveau,{});
                 if(obj1.status===true){
                     t+=obj1.value;
                     return {value:t,status:true};
                 }else{
                     return php_logerr({status:false,value:t,id:id,tab:tab,message:'erreur 1858'});
                 }
             }
         }else{
             t+=ma_cst_pour_php(tab[i]);
         }
      
     }
 }
 return {value:t,status:true};
 
}
 

/*
=====================================================================================================================
on arrive dans un condition()
*/
function php_condition0(tab,id,niveau){
// console.log('php_condition0');
 var t='';
 var i=0;
 var j=0;
 var premiereCondition=true;
 var newTab=[];
 var obj={};
 var l01=tab.length;

 if(tab[id][8]===0){
     return php_logerr({status:false,value:t,id:id,tab:tab,message:'2313 une condition doit être remplie'});
 }else{
     obj=php_condition1(tab,id+1,niveau,id);
    
     if(obj.status==true){
     
         t+=obj.value;
        
     }else{
     
        return php_logerr({status:false,value:t,id:id,tab:tab,message:'1835 erreur dans une condition racine'});
        
     }
 }
 
 return {status:true,value:t};
}
