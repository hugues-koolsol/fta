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
function tabToHtml1(tab,id,noHead,niveau){
 // recherche du premier tag "html"
 var startId=id;
 for(var i=id;i<tab.length;i++){
   if(tab[i][1]=='html'){
    startId=i;
    break;
   }
 }
 
 var ob=tabToHtml0(tab,startId,false,false,false,noHead,false,niveau);
 return ob;
}
//=====================================================================================================================
function tabToHtml0( tab ,id , dansHead , dansBody , dansJs , noHead , dansPhp , niveau){
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
 if(tab[id][1]=='php'){
  dansPhp=true;
 }

 // on écrit le début du tag ....
 if(dansPhp&&tab[id][1]=='source'){ // i18
  // analyse de source javascript
  t+='<?php ';
  ob=parseJavascript0(tab,id,0);
  parsePhp0(tab,id,0);
  if(ob.status===true){
   t+=ob.value;
  }else{
   return logerreur({status:false,value:t,message:'erreur de script dans un html'});
  }
  t+=' ?>';
  
  return {status:true,value:t,dansHead:dansHead,dansBody:dansBody,dansJs:dansJs,dansPhp:dansPhp};

 }else if(dansJs&&tab[id][1]=='source'){ // i18
  // analyse de source javascript
  t+=CRLF;
  t+='// = = = = <source javascript = = = ='+CRLF;
  t+='"use strict";'+CRLF;
//  console.error('todo')
//  bug();
  php_contexte_commentaire_html=false;
  ob=parseJavascript0(tab,id+1,0);
  php_contexte_commentaire_html=true;
  if(ob.status===true){
   t+=ob.value;
  }else{
   return logerreur({status:false,value:t,message:'erreur de script dans un html'});
  }
  t+=CRLF+'// = = = = source javascript> = = = ='+CRLF;
  
  return {status:true,value:t,dansHead:dansHead,dansBody:dansBody,dansJs:dansJs,dansPhp:dansPhp};

 }else{
  temp='';

  if(tab[id][1]=='html'){
  }else{
   t+=espacesn(true,niveau);
  }
  if(tab[id][1]=='#'){
   temp+='<!-- '+traiteCommentaire2(tab[id][13],niveau,id);
  }else if(tab[id][1]=='php'){
   temp+='';
  }else{
   if(noHead && tab[id][1]=='html'){
   }else{
    temp+='<'+tab[id][1];
   }
  }
  doctype='';
  for(i=id+1;i<tab.length;i++){
   if(tab[i][7]==id){
    if( tab[i][2] == 'f' && tab[i][1]==''){
     if( tab[i][8]<=2){// (lang,fr) : 2 enfants
      if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
       temp+=' '+tab[i+1][1]+'="'+tab[i+2][1]+'"';
       if(tab[i+1][1]=='data-lang' && ( tab[i+2][1]=='fr' ||tab[i+2][1]=='en' ) ){
        globale_LangueCourante=tab[i+2][1];
       }
      }else if(tab[i][8]==1 && tab[i+1][2]=='c' ){
       if(tab[i+1][1]=='doctype'){
        
        doctype='<!DOCTYPE html>';
       }else{
        temp+=' '+tab[i+1][1]+''; // contenteditable , selected
       }
      }else{
       return logerreur({status:false,id:i,value:t,message:'1 les propriété d\'un tag html doivent contenir une ou deux constantes'});  
      }
     }else{
      return logerreur({status:false,id:i,value:t,message:'2 les propriété d\'un tag html doivent contenir une ou deux constantes'});  
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
    t+=doctype+CRLF;
    t+=temp;
   }
  }else{
   if(id>0){
    t+=temp;
   }
  }
  if(contientEnfantsNonVides||contientConstantes){
   if(id>0){
    if(noHead && tab[id][1]=='html'){
    }else if(tab[id][1]=='php'){
    }else{
     t+='>';
    }
   }
   var contenuNiveauPlus1='';
   for(i=id+1;i<tab.length;i++){
    if(tab[i][7]==id){ // pour tous les enfants
     if(tab[i][2] == 'f' && tab[i][1]!=''){// head(...),body(...),span(), ...
      niveau++;
      ob=tabToHtml0(tab,i,dansHead,dansBody,dansJs,noHead,dansPhp,niveau); // appel récursif
      niveau--;
      
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
       t+=espacesn(true,niveau+1);
       t+=tab[i][1];
       contenuNiveauPlus1=tab[i][1];
      }
     }
    }
   }
   if(id>0){
    if(noHead && tab[id][1]=='html'){
     t+=CRLF;
    }else{
     t+=espacesn(true,niveau);
     if(tab[id][1]=='php'){
     }else{
      t+='</'+tab[id][1]+'>';
      if((
           tab[id][1]=='td' 
        || tab[id][1]=='a' 
        || tab[id][1]=='span' 
        || tab[id][1]=='button' 
        || tab[id][1]=='title' 
        || tab[id][1]=='h1' 
        || tab[id][1]=='h2' 
        || tab[id][1]=='h3' 
       ) && contenuNiveauPlus1!='' && contenuNiveauPlus1.indexOf('<')<0 ){
       var tag=tab[id][1];
       const re1 = new RegExp("\<"+tag+"(.*)\>\r\n[ \t]+","g");
       const rp1 = '<'+tag+'$1>';
       t=t.replace(re1,rp1);
       const re2 = new RegExp("\r\n[ \t]+\<\/"+tag+"\>","g");
       const rp2 = '</'+tag+'>';
       t=t.replace(re2,rp2);
       if(tab[id][1]=='td'){
//        t=t.replace(/\<td(.*)\>\r\n[ \t]+/g,'<td$1>')
//        t=t.replace(/\r\n[ \t]+\<\/td\>/g,'</td>')
       }else if(tab[id][1]=='a'){
//        t=t.replace(/\<a(.*)\>\r\n[ \t]+/g,'<a$1>')
//        t=t.replace(/\r\n[ \t]+\<\/a\>/g,'</a>')
       }
      }
     }
    }
   }
   if('script'==tab[id][1]){
    dansJs=false;
   }
   if('php'==tab[id][1]){
    dansPhp=false;
   }
  }else{
   if(tab[id][1]=='script'){
    t+='>'+'<'+'/script>';
    dansJs=false;
   }else if(tab[id][1]=='php'){
    t+='????PHP????'; //'>'+'<'+'/script>';
    dansPhp=false;
   }else{
    
    if(id>0){
     if(tab[id][1]=='#'){
      t+=' -->';
     }else if(tab[id][1]=='br' || tab[id][1]=='hr' || tab[id][1]=='meta' || tab[id][1]=='link' || tab[id][1]=='input' ){
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
