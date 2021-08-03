"use strict";
//=====================================================================================================================
function tabToHtml1(tab,id,offsetLigne){
 var ob=tabToHtml0(tab,id,false,false,false,offsetLigne);
 return ob;
}
//=====================================================================================================================
function tabToHtml0( tab ,id , dansHead , dansBody , dansJs , offsetLigne ){
 var t='';
 var i=0;
 var j=0;
 var contientEnfantsNonVides=false;
 var contientConstantes=false;
 var ob=null;
 var niveauNouvelleLigne=3;
 var doctype='';
 var temp='';
 
 if(tab[id][1]=='head'){
  dansHead=true;
 }
 if(tab[id][1]=='body'){
  dansBody=true;
 }
 if(tab[id][1]=='script'){
  dansJs=true;
 }

 // on écrit le début du tag ....
 if(dansJs&&tab[id][1]=='source'){ // i18
  // analyse de source javascript
  t+='\n';
  t+='// = = = = <source javascript = = = =\n';
  t+='"use strict";\n';
  ob=parseJavascript0(tab,id,offsetLigne+tab[id][13]);
  if(ob.status===true){
   t+=ob.value;
  }else{
   return logerreur({status:false,value:t,message:'erreur de script dans un html'});
  }
  t+='\n// = = = = source javascript> = = = =\n';
  
  return {status:true,value:t,dansHead:dansHead,dansBody:dansBody,dansJs};

 }else{
  
  // 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE 12numEnfant 13numLi 14ferPar 15prof
  temp='<'+tab[id][1];
  doctype='';
  for(i=id+1;i<tab.length;i++){
   if(tab[i][10]==id){
    if( tab[i][2] == 'f' && tab[i][1]==''){
     if( tab[i][11]<=2){// (lang,fr) : 2 enfants
      if(tab[i][11]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
       temp+=' '+tab[i+1][1]+'="'+tab[i+2][1]+'"';
       if(tab[i+1][1]=='data-lang' && ( tab[i+2][1]=='fr' ||tab[i+2][1]=='en' ) ){
        globale_LangueCourante=tab[i+2][1];
       }
      }else if(tab[i][11]==1 && tab[i+1][2]=='c' ){
       if(tab[i+1][1]=='doctype'){
        doctype='<!DOCTYPE html>';
       }else{
        temp+=' '+tab[i+1][1]+''; // contenteditable , selected
       }
      }else{
       return logerreur({status:false,value:t,message:'1 les propriété d\'un tag html doivent contenir une ou deux constantes en ligne '+(tab[i][13]+offsetLigne),line:tab[i][13]+offsetLigne});  
      }
     }else{
      return logerreur({status:false,value:t,message:'2 les propriété d\'un tag html doivent contenir une ou deux constantes en ligne '+(tab[i][13]+offsetLigne),line:tab[i][13]+offsetLigne});  
     }
    }
    if(tab[i][2] == 'f' && tab[i][1]!=''){// head(...),body(...)
     contientEnfantsNonVides=true;
    }
    if(tab[i][2] == 'c' && tab[i][1]!=''){// head(...),body(...)
     contientConstantes=true;
    }
   }
  }
  if(tab[id][1]=='html' && doctype!='' ){
   if(id>0){
    if(tab[id][15]>=niveauNouvelleLigne){
//     t+=espaces2(tab[id][3]);
    }
    t+=doctype+'\n';
    t+=temp;
   }
  }else{
   if(id>0){
    if(tab[id][15]>=niveauNouvelleLigne){
     t+=espaces2(tab[id][3]);
    }
    t+=temp;
   }
  }
  if(contientEnfantsNonVides||contientConstantes){
   if(id>0){
    t+='>';
   }
   for(i=id+1;i<tab.length;i++){
    if(tab[i][10]==id){ // pour tous les enfants
     if(tab[i][2] == 'f' && tab[i][1]!=''){// head(...),body(...),span(), ...
     
      ob=tabToHtml0(tab,i,dansHead,dansBody,dansJs,offsetLigne); // appel récursif
      
      if(ob.status===true){
       t+=ob.value;
       dansBody=ob.dansBody;
       dansHead=ob.dansHead;
       dansJs=ob.dansJs;
      }else{
       return logerreur({status:false,message:''});  
      }
     }else{
      if(tab[i][2] == 'f' && tab[i][1]==''){// propriétés déjà écrites plus haut
      }else{
       // constante
       if(tab[i][15]>=niveauNouvelleLigne){
        t+=espaces2(tab[i][3]);
       }
       t+=tab[i][1];
      }
     }
    }
   }
   if(tab[id][15]>niveauNouvelleLigne){
    t+=espaces2(tab[id][3]);
   }
   if(id>0){
    t+='</'+tab[id][1]+'>';
   }
   if('script'==tab[id][1]){
    dansJs=false;
   }
  }else{
   if(tab[id][1]=='script'){
    t+='>'+'<'+'/script>';
    dansJs=false;
   }else{
    
    if(id>0){
     if(tab[id][1]=='br' || tab[id][1]=='hr'){
      t+=' />';
     }else{
      t+='></'+tab[id][1]+'>';
     }
    }
   }
  }
  return {status:true,value:t,dansHead:dansHead,dansBody:dansBody,dansJs};  
 }
}
