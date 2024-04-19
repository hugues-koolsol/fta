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
/* 
  =======================================================================================
  Construit texte html à partir d'une matrice rev
  l'option retirerHtmlHeadEtBody permet de retirer les html,body et head si ils ne sont 
  pas renseignés
  =======================================================================================  
*/
function traiteJsonDeHtml(jsonDeHtml,niveau,retirerHtmlHeadEtBody){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var dernierEstTexte=false;
 var attributs='';
 var contenu='';
 var obj={dernierEstTexte:false};
 
 
// console.log('jsonDeHtml=',jsonDeHtml);
 if(jsonDeHtml.type || ( jsonDeHtml.type==='' && jsonDeHtml.content && jsonDeHtml.content.length>0 ) ){
  
  if(jsonDeHtml.type!==''){
   t+='\n'+esp0+jsonDeHtml.type.toLowerCase()+'(';
  }
  
  if(jsonDeHtml.attributes){
   for(var i in jsonDeHtml.attributes){
    if(attributs!==''){
     attributs+=','
    }
    attributs+='('+i+',\''+jsonDeHtml.attributes[i].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
   }
  }
  t+=attributs;
  
  if(jsonDeHtml.content && jsonDeHtml.content.length>0){
   var count=0;
   for(var i=0;i<jsonDeHtml.content.length;i++){
    
    count++;
    niveau++;
    obj=traiteJsonDeHtml(jsonDeHtml.content[i],niveau,retirerHtmlHeadEtBody);
    niveau--;
    if(obj.status===true){
     if((attributs!=='' || contenu!=='') && obj.value!==''){
      contenu+=',';
     }
     contenu+=obj.value;
    }else{
     return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0.129 '+jsonDeHtml.type}));
    }
   }
   t+=contenu;
   
   
   if(jsonDeHtml.type!==''){
    if(obj && obj.dernierEstTexte){
     t+=')';
    }else{
     if(contenu===''){
      t+=')';
     }else{
      t+='\n'+esp0+')';
     }
    }
   }
  }else{
   if(jsonDeHtml.type!==''){
    t+=')';
   }
  }
  
  
 }else{
  contenu=jsonDeHtml.replace(/\r/g,'').replace(/\n/g,'').trim();
  if(contenu.indexOf('&')>=0 || contenu.indexOf('>')>=0 || contenu.indexOf('<')>=0 || contenu.indexOf('"')>=0){
   contenu=contenu.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  if(contenu.indexOf('\\')>=0){
   debugger;
  }
  if(contenu!=='' ){
   contenu='\''+contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'';
  }
  t+=contenu;
  if(contenu!=''){
   dernierEstTexte=true;
  }else{
  }
 }
 
 if(retirerHtmlHeadEtBody && niveau===0){
  /*
  le rev retourné inclut toujours une balise html et/ou body et/ou head
  Si ces balises ne contiennent pas d'éléments, on les retire 
  */
  var tableau1 = iterateCharacters2(t);
  var matriceFonction = functionToArray2(tableau1.out,false,true);
  if(matriceFonction.status===true){
//   console.log('matriceFonction.value=',JSON.stringify(matriceFonction.value).replace(/\],/g,'],\n'));
   if(matriceFonction.value[1][1]==='html' && matriceFonction.value[1][8]<=2){
    
    /* 
      l'élément html est en première position
      si il n'a aucune propriété, on peut le supprimer
    */
    var aDesProps=false;
    for(var i=0;i<matriceFonction.value.length && aDesProps===false;i++){
     if(matriceFonction.value[i][7]===1){
      if(matriceFonction.value[i][1]===''){
       aDesProps=true;
       break;
      }
     }
    }
    if(aDesProps===false){
     var nouveauTableau1=baisserNiveauEtSupprimer(matriceFonction.value,1,0);
     
     /*
      si le head n'a aucun enfant
     */
     if(nouveauTableau1[1][1]==='head' && nouveauTableau1[1][8]==0){
      
      var nouveauTableau2=baisserNiveauEtSupprimer(nouveauTableau1,1,0);

      
      if(nouveauTableau2[1][1]==='body'){
       var aDesProps=false;
       for(var i=0;i<nouveauTableau2.length && aDesProps===false;i++){
        if(nouveauTableau2[i][7]===1){
         if(nouveauTableau2[i][1]===''){
          aDesProps=true;
          break;
         }
        }
       }
       if(aDesProps===false){

        /*
         si le body n'a aucune propriété
        */

        var nouveauTableau3=baisserNiveauEtSupprimer(nouveauTableau2,1,0);

        var nouveauJsonDeHtml=mapMatriceVersJsonDeHtml(nouveauTableau3);
        var obj1=traiteJsonDeHtml(nouveauJsonDeHtml,0,false);
        if(obj1.status===true){
         t=obj1.value;
        }else{
         return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
        }

       }else{
        var nouveauJsonDeHtml=mapMatriceVersJsonDeHtml(nouveauTableau2);
        var obj1=traiteJsonDeHtml(nouveauJsonDeHtml,0,false);
        if(obj.status===true){
         t=obj.value;
        }else{
         return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
        }
       }
      }else{
       var nouveauJsonDeHtml=mapMatriceVersJsonDeHtml(nouveauTableau2);
       var obj1=traiteJsonDeHtml(nouveauJsonDeHtml,0,false);
       if(obj1.status===true){
        t=obj1.value;
       }else{
        return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
       }
      }
     }else{
      /*
        la balise head contient des éléments, on reconstruit le source à partir de matriceFonction.value
        avec des retours de lignes et sans coloration
      */
      var nouveauJsonDeHtml=mapMatriceVersJsonDeHtml(nouveauTableau1);
      var obj1=traiteJsonDeHtml(nouveauJsonDeHtml,0,false);
      if(obj1.status===true){
       t=obj1.value;
      }else{
       return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
      }
     }
    }else{
    /*
      on ne change rien car il y a des propriétés dans la balise html
    */
     
    }
    
   }else{
    /*
      on ne change rien
    */
   }
  }else{
   return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0168 '+jsonDeHtml.type}));
  }
 }
 return({status:true,value:t,'dernierEstTexte':dernierEstTexte});
}
/*
  =======================================================================================
  fonction trouvée sur le net ( désolé, j'ai perdu la référence )
  A partir d'un html, on reconstruit un équivalent "ast" ( abstract syntax tree )
  =======================================================================================
*/
function mapDOMOld(element, json) {
    var treeObject = {};
    
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser)
        {
              var parser = new DOMParser();
              var docNode = parser.parseFromString(element,"text/html");
        }
        else // Microsoft strikes again
        {
              docNode = new ActiveXObject("Microsoft.XMLDOM");
              docNode.async = false;
              docNode.loadXML(element); 
        } 
        element = docNode.firstChild;
    }
    
    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object["type"] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object["content"].push(nodeList[i].nodeValue);
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element, treeObject);
    
    return (json) ? JSON.stringify(treeObject) : treeObject;
}
function mapDOM(element){
    var treeObject={};
    if(typeof element === 'string'){
        var parser= new DOMParser();
        var docNode = parser.parseFromString(element,'text/html');
        element=docNode.firstChild;
    }
    function treeHTML(element,object){
        object['type']=element.nodeName;
        var i=0;
        var nodeList=element.childNodes;
        if(nodeList != null){
            if(nodeList.length){
                object['content']=[];
                for(i=0;i < nodeList.length;i=i+1){
                    if(nodeList[i].nodeType == 3){
                        object['content'].push(nodeList[i].nodeValue);
                    }else{
                        object['content'].push({});
                        treeHTML(nodeList[i],object["content"][object["content"].length -1]);
                    }
                }
            }
        }
        if(element.attributes != null){
            if(element.attributes.length){
                object['attributes']={};
                for(i=0;i < element.attributes.length;i=i+1){
                    object['attributes'][element.attributes[i].nodeName]=element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element,treeObject);
    return treeObject;
}


/* 
  =======================================================================================
  construit un ast à partir d'une matrice rev 
  =======================================================================================  
*/
function mapMatriceVersJsonDeHtml(matrice){
 
// console.log('matrice=',JSON.stringify(matrice).replace(/\],/g,'],\n'));
 
 
 
 /* 
  =======================================================================================
  On définit une fonction dans une fonction car elle sera appelée récursivement
  =======================================================================================  
 */
 function reconstruit(tab,parentId){
  var l01=tab.length;
  var type       ='';
  var attributes ={};
  var content    =[];
  /*
  récupération des attributs
  */
  var leJson={};
  if(tab[parentId][8]===0 && parentId>0){
   content.push('');
  }else{
   for(var indice=parentId+1;indice<l01;indice++){
    if(tab[indice][7]===parentId){
     if(tab[indice][1]!==''){
      if(tab[indice][2]==='f' ){
       content.push(reconstruit(tab,indice));
      }else{
       content.push(tab[indice][1]);
      }
     }
    }
   }
  }
  if(parentId===0){
   type='';
  }else{
   type=tab[parentId][1];
  }
  leJson['type']=type;
  leJson['content']=content;

  var aDesAttributs=false;
  for(var indice=parentId+1;indice<l01;indice++){
   if(tab[indice][7]===parentId){
    if(tab[indice][1]==='' && tab[indice][2]==='f' &&  tab[indice][8]===2){
      attributes[tab[indice+1][1]]=tab[indice+2][1];
      aDesAttributs=true;
    }
   }
  }
  if(aDesAttributs){
   leJson['attributes']=attributes;
  }
  return leJson;
 }
 /* 
  =======================================================================================
  L'appel récursif se fait ici
  =======================================================================================
 */
 
 var obj=reconstruit(matrice,0);
 return obj;
 
}

function TransformHtmlEnRev(texteHtml,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var elementsJson={};
    try{
     
     elementsJson=mapDOM(texteHtml,false);
//     console.log('elementsJson=',JSON.stringify(elementsJson).replace(/\{/g,'{\n'))
     
     
     var obj=traiteJsonDeHtml(elementsJson,0,true);
     if(obj.status===true){
      t=obj.value;
     }else{
      t='<-- erreur 0103 -->';
     }
     return({status:true,value:t});
    }catch(e){
     console.log('e=',e);
     return(asthtml_logerreur({status:false,message:'erreur 0098 e='+e.message+'\ne.stack='+e.stack}));
    }
}
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
       
       /* 
       ==============================================================================================================
       Ecriture de la propriété
       ==============================================================================================================
       */
       temp+=' '+tab[i+1][1]+'=\''+tab[i+2][1].replace(/\\\\\\\'/g,'"').replace(/\\\\\\\\/g,'\\').replace(/\"/g,'&quot;').replace(/\\\\/g,'\\')+'\'';
       
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
       /*
        ===========================================================================================
        ecriture de la valeur dans le cas d'une fonction
        ===========================================================================================
       */
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
       t+=espacesn(true,niveau+1);
       /*
        ===========================================================================================
        ecriture de la valeur dans le cas d'une constante
        ===========================================================================================
       */
       t+=tab[i][1].replace(/&amp;gt;/g,'&gt;').replace(/&amp;lt;/g,'&lt;').replace(/&amp;amp;/g,'&amp;').replace(/\\\\/g,'\\');
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
