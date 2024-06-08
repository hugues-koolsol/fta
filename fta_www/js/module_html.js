

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
class traitements_sur_html{
    #nom_de_la_variable='';
    constructor(nom_de_la_variable){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    get nom_de_la_variable(){
        return this.#nom_de_la_variable
    }
    //=====================================================================================================================
    tabToHtml1(tab,id,noHead,niveau){
         // recherche du premier tag "html"
         var startId=id;
         for(var i=id;i<tab.length;i++){
           if(tab[i][1]=='html'){
            startId=i;
            break;
           }
         }
         
         var ob=this.tabToHtml0(tab,startId,false,false,false,noHead,false,niveau);
         if(ob.status===true){
          if(ob.value.substr(0,2)===CRLF){
           ob.value=ob.value.substr(2);
          }
         }
         return ob;
    }



    /* 
      =======================================================================================
      Construit texte html à partir d'un AST html
      l'option retirerHtmlHeadEtBody permet de retirer les html,body et head si ils ne sont 
      pas renseignés
      =======================================================================================  
    */
    traiteAstDeHtml(jsonDeHtml,niveau,retirerHtmlHeadEtBody,typeParent){
     var t='';
     var esp0 = ' '.repeat(NBESPACESREV*(niveau));
     var esp1 = ' '.repeat(NBESPACESREV);
     var dernierEstTexte=false;
     var attributs='';
     var contenu='';
     var obj={dernierEstTexte:false};
     var type='';
     var typeScriptNonTraite=false;
     
     
    // console.log('jsonDeHtml=',jsonDeHtml);
     if(jsonDeHtml.type || ( jsonDeHtml.type==='' && jsonDeHtml.content && jsonDeHtml.content.length>0 ) ){
      type=jsonDeHtml.type.toLowerCase();
      if(jsonDeHtml.type!==''){
       if(type==='script'){ // , text/javascript
        if(jsonDeHtml.attributes && jsonDeHtml.attributes.type){
          if(jsonDeHtml.attributes.type.toLowerCase()==='application/ld+json'){
           t+='\n'+esp0+'ldPlusJsonDansHtml(';
           type='ldPlusJsonDansHtml'
          }else if(jsonDeHtml.attributes.type.toLowerCase()==='text/javascript'){
           t+='\n'+esp0+'javascriptDansHtml(';
           type='javascriptDansHtml'
          }else{
           typeScriptNonTraite=true;
           type='script';
           t+='\n'+esp0+'script(';
           logerreur({status:false,'message':'html.js traiteJsonDeHtml 0073 attention, il existe un type de script non traité  "'+jsonDeHtml.attributes.type+'"'})
          }
        }else{
         /*
          sans aucun type renseigné, c'est un javascript
         */
         t+='\n'+esp0+'javascriptDansHtml(';
         type='javascriptDansHtml'
        }
       }else{
        if("#comment"===type){
         t+='\n'+esp0+'#(';
        }else{
         t+='\n'+esp0+type+'(';
        }
       }
      }
      
      if(jsonDeHtml.attributes){
       for(var i in jsonDeHtml.attributes){
        if(attributs!==''){
         attributs+=','
        }
        attributs+='('+i+',\''+jsonDeHtml.attributes[i].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
       }
      }
      
      /*
       ajout des attributs
      */
      t+=attributs;
      
      if(typeScriptNonTraite && jsonDeHtml.content && jsonDeHtml.content.length>0 ){
       

        contenu=jsonDeHtml.content[0];
        contenu=contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'');
        if(attributs!==''){
         t+=',';
        }
        t+='@('+contenu+')';
        t+=')';

       
       
      }else if(type.toLowerCase()==='ldplusjsondanshtml' && jsonDeHtml.content && jsonDeHtml.content.length>0){
       
       
       
       var chaineJsEquivalente='var a='+jsonDeHtml.content[0].replace(/&quot;/g,'"').replace(/\\\//g,'/')+';' // 
       var obj=convertit_source_javascript_en_rev(chaineJsEquivalente);
       if(obj.status===true){
        t+=''+obj.value+'';
       }else{
        t+='#(Erreur de conversion du javascript 0066 )';
       }
       t+='\n'+esp0+')';
       
      }else if(type.toLowerCase()==='javascriptdanshtml' && jsonDeHtml.content && jsonDeHtml.content.length>0){

       var obj=convertit_source_javascript_en_rev(jsonDeHtml.content[0]);
       if(obj.status===true){
        t+=''+obj.value+'';
       }else{
        t+='#(Erreur de conversion du javascript 0066 )';
       }
       t+='\n'+esp0+')';
      }else if(jsonDeHtml.content && jsonDeHtml.content.length>0){
       var count=0;
       for(var i=0;i<jsonDeHtml.content.length;i++){
        
        /*
          =======================
          entree dans le récursif
          =======================
        */
        count++;
        niveau++;
        
        obj=this.traiteAstDeHtml(jsonDeHtml.content[i],niveau,retirerHtmlHeadEtBody,type);
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
      if(typeParent==='#comment'){
       debugger
        if(jsonDeHtml.length>=2 && jsonDeHtml.substr(0,1)===' ' && jsonDeHtml.substr(jsonDeHtml.length-1,1)===' '){
         contenu=jsonDeHtml.substr(1,jsonDeHtml.length-2);
         t+=contenu;
        }else{
         if(jsonDeHtml.length==1 && jsonDeHtml.substr(0,1)===' '){
          /*
          c'est un commentaire vide
          */
         }else{
          contenu=jsonDeHtml;
          t+=contenu;
         }
        }
        dernierEstTexte=true;
      }else if(typeParent==='@'){
        contenu=jsonDeHtml;
    //    debugger
        t+=contenu;
      }else if(typeParent==='script'){
       var obj=convertit_source_javascript_en_rev(jsonDeHtml);
       if(obj.status===true){
        t+=''+obj.value+'';
       }else{
        t+='#(Erreur de conversion du javascript 0113 )';
       }

      }else{
       try{
        contenu=jsonDeHtml.replace(/\r/g,' ').replace(/\n/g,' ').trim();
       }catch(e){
        /*
        dans le cas où le jsonDeHtml n'existe pas
        */

        contenu='';
       }
       if(contenu.indexOf('&')>=0 || contenu.indexOf('>')>=0 || contenu.indexOf('<')>=0 || contenu.indexOf('"')>=0){
        contenu=contenu.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
     }
     
     if(retirerHtmlHeadEtBody && niveau===0){
      /*
      le rev retourné inclut toujours une balise html et/ou body et/ou head
      Si ces balises ne contiennent pas d'éléments, on les retire 
      */
      var tableau1 = iterateCharacters2(t);
      var matriceFonction = functionToArray2(tableau1.out,false,true,'');
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
         if(nouveauTableau1.length>=2 && nouveauTableau1[1][1]==='head' && nouveauTableau1[1][8]==0){
          
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

            var nouveauJsonDeHtml=this.mapMatriceVersJsonDeHtml(nouveauTableau3);
            var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml,0,false,'');
            if(obj1.status===true){
             t=obj1.value;
            }else{
             return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
            }

           }else{
            var nouveauJsonDeHtml=this.mapMatriceVersJsonDeHtml(nouveauTableau2);
            var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml,0,false,'');
            if(obj.status===true){
             t=obj.value;
            }else{
             return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
            }
           }
          }else{
           var nouveauJsonDeHtml=this.mapMatriceVersJsonDeHtml(nouveauTableau2);
           var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml,0,false,'');
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
          var nouveauJsonDeHtml=this.mapMatriceVersJsonDeHtml(nouveauTableau1);
          var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml,0,false,'');
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
    mapDOM(element){
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
            if(nodeList !== null){
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
                }else{
                    if(element.nodeValue){
                        object['content']=[];
                        object['content'].push(element.nodeValue);
                    }
                }
            }
            if(element.attributes != null){
                if(element.attributes.length){
                    object['attributes']={};
                    for(i=0;i < element.attributes.length;i=i+1){
                        if(element.attributes[i].nodeName==='"'){
                         /*
                           =========================================
                           vraiment bizarre un attribut = '"'
                           =========================================
                         */
                         console.log('element.attributes[i].nodeName=<'+element.attributes[i].nodeName+'>')
                        }else{
                         object['attributes'][element.attributes[i].nodeName]=element.attributes[i].nodeValue;
                        }
                         
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
    mapMatriceVersJsonDeHtml(matrice){
     
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
      
      
      
      
      if(tab[parentId][1].toLowerCase()==='ldplusjsondanshtml'){

        var debut=parentId+1;
        for( var j=parentId+1;j<l01;j++){
         if(tab[j][7]===parentId){
          if(tab[j][1]==='' && tab[j][2]==='f'){
          }else{
           debut=j;
           break;
          }
         }
        }


        var objContenuJs=parseJavascript0(tab,debut,0);
        if(objContenuJs.status===true){
         var contenu=objContenuJs.value.substr(objContenuJs.value.indexOf('=')+1);
         if(contenu.substr(contenu.length-1,1)===';'){
          contenu=contenu.substr(0,contenu.length-1);
         }
         content.push(contenu);
        }else{
         content.push('<!-- erreur html.js 0428 -->');
        }
        console.log('objContenuJs=',objContenuJs);


      }else if(tab[parentId][1].toLowerCase()==='javascriptdanshtml'){


        var debut=parentId+1;
        for( var j=parentId+1;j<l01;j++){
         if(tab[j][7]===parentId){
          if(tab[j][1]==='' && tab[j][2]==='f'){
          }else{
           debut=j;
           break;
          }
         }
        }


        var objContenuJs=parseJavascript0(tab,debut,0);

        if(objContenuJs.status===true){
         
         
         content.push(objContenuJs.value);
        }else{
         content.push('<!-- erreur html.js 377 -->');
        }
        console.log('objContenuJs=',objContenuJs);
        
      }else if(tab[parentId][1]==='@'){
       
    //   debugger
       
      }else if(tab[parentId][8]===0 && parentId>0){
       
       content.push('');
       
      }else{
       for(var indice=parentId+1;indice<l01;indice++){
        if(tab[indice][7]===parentId){
         if(tab[indice][1]!==''){
          if(tab[indice][2]==='f' ){
           
           if('@'===tab[indice][1]){
            
             content.push(tab[indice][13].replace(/\\\'/g,'\'').replace(/\\\\/g,'\\')); // transformation inverse
             var max=l01-1;
             for( var j=indice+1;j<l01;j++){
              if(tab[j][3]<=tab[indice][3]){
               max=j-1;
               break;
              }
             }
             indice=max;


           }else if('ldplusjsondanshtml'===tab[indice][1].toLowerCase()){

                content.push(reconstruit(tab,indice));
                var max=l01-1;
                for( var j=indice+1;j<l01;j++){
                 if(tab[j][3]<=tab[indice][3]){
                  max=j-1;
                  break;
                 }
                }
                indice=max;

           }else if('javascriptdanshtml'===tab[indice][1].toLowerCase()){

                content.push(reconstruit(tab,indice));
                var max=l01-1;
                for( var j=indice+1;j<l01;j++){
                 if(tab[j][3]<=tab[indice][3]){
                  max=j-1;
                  break;
                 }
                }
                indice=max;
    /*            
    */            
           }else{
            content.push(reconstruit(tab,indice));
           }
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
       if(tab[parentId][1]==='@'){
        type='';
       }else{
        type=tab[parentId][1];
       }
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
    /* 
     ======================================================================================================================
    */

    TransformHtmlEnRev(texteHtml,niveau){
        var t='';
        var esp0 = ' '.repeat(NBESPACESREV*(niveau));
        var esp1 = ' '.repeat(NBESPACESREV);
        var elementsJson={};

        try{
         
         elementsJson=this.mapDOM(texteHtml,false);
    //     console.log('elementsJson=',JSON.stringify(elementsJson).replace(/\{/g,'{\n'))
         
         
         var obj=this.traiteAstDeHtml(elementsJson,0,true,'');
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
    tabToHtml0( tab ,id , dansHead , dansBody , dansJs , noHead , dansPhp , niveau){
     var t='';
     var i=0;
     var j=0;
     var contientEnfantsNonVides=false;
     var contientConstantes=false;
     var ob=null;
     var niveauNouvelleLigne=3;
     var doctype='';
     var temp='';
     var l01=tab.length;
     
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
    //  console.error('todo')
    //  bug();
      php_contexte_commentaire_html=false;
      ob=parseJavascript0(tab,id+1,0);
      php_contexte_commentaire_html=true;
      if(ob.status===true){
       t+=CRLF;
       t+='//<![CDATA['+CRLF;
       t+='// = = = = <source javascript = = = ='+CRLF;
       if(ob.value.indexOf('use strict')>=0){
       }else{
           t+='"use strict";'+CRLF;
       }
       t+=ob.value;
       t+=CRLF+'// = = = = source javascript> = = = ='+CRLF;
       t+='//]]>'+CRLF;
      }else{
       return logerreur({status:false,value:t,message:'erreur de script dans un html'});
      }
      
      return {status:true,value:t,dansHead:dansHead,dansBody:dansBody,dansJs:dansJs,dansPhp:dansPhp};

     }else{
      temp='';

      if(tab[id][1]=='html'){
      }else{
       t+=espacesn(true,niveau);
      }
      if(tab[id][1]=='#'){
       if(tab[id][13]===''){
        temp+='';
       }else{
        temp+='<!-- '+traiteCommentaire2(tab[id][13],niveau,id);
       }
      }else if(tab[id][1]=='php'){
       temp+='';
      }else{
       if(noHead && tab[id][1]=='html'){
       }else{
        temp+='<'+tab[id][1];
       }
      }
      doctype='';
      for(i=id+1;i<l01;i++){
       if(tab[i][7]==id){
        if( tab[i][2] == 'f' && tab[i][1]==''){
         if( tab[i][8]<=2){// (lang,fr) : 2 enfants
          if(tab[i][8]==2 && tab[i+1][2]=='c' && tab[i+2][2]=='c' ){
           
           /* 
           ==============================================================================================================
           Ecriture de la propriété
           ==============================================================================================================
           */
           temp+=' '+tab[i+1][1]+'="'+tab[i+2][1].replace(/\"/g,'&quot;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\')+'"'; // .replace(/\\/g,'&#92;')
           
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
           return logerreur({status:false,id:i,value:t,message:'1 les propriété d\'un tag html doivent contenir une ou deux constantes 0596'});  
          }
         }else{
          return logerreur({status:false,id:i,value:t,message:'2 les propriété d\'un tag html doivent contenir une ou deux constantes 0599'});  
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
       for(i=id+1;i<l01;i++){
        if(tab[i][7]==id){ // pour tous les enfants
         if(tab[i][2] == 'f' && tab[i][1]!=''){// head(...),body(...),span(), ...

          if(tab[i][1].toLowerCase()==='@'){


             t+=tab[i][13];
           
           
           
           
          }else if(tab[i][1].toLowerCase()==='ldplusjsondanshtml'){
    //       debugger
           
           /*
           dans ce cas, c'est un tag <script avec des propriétés 
           */
           var lesProprietes='';
           var indiceDebutJs=-1;
           for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
            if(tab[j][7]===i){
             if(tab[j][2]==='f'){
              if(tab[j][1]==='' ){
               lesProprietes+=' '+tab[j+1][1]+'="'+tab[j+2][1].replace(/\"/g,'&quot;').replace(/\\/g,'&#92;')+'"';
              }else{
               if(indiceDebutJs===-1){
                indiceDebutJs=j;
               }
              }
             }else{
              if(indiceDebutJs===-1){
               indiceDebutJs=j;
              }
             }
            }
           }


           if(indiceDebutJs===-1){
            /*
             c'est une balise <script src=""></script>
            */

             t+=CRLF;
             t+='<script'+lesProprietes+'></script>'+CRLF;
            
           }else{

            /*
             c'est un script dans un html
            */
            
            niveau++;
            ob=parseJavascript0(tab,indiceDebutJs,niveau);
            niveau--;
            
            if(ob.status===true){
             /*
              ===========================================================================================
              ecriture de la valeur dans le cas d'un tag ldplusjsondanshtml
              ===========================================================================================
             */
             t+=CRLF;
             t+='<script'+lesProprietes+'>'
    //         debugger
             var contenu=ob.value.substr(ob.value.indexOf('=')+1);
             if(contenu.substr(contenu.length-1,1)===';'){
              contenu=contenu.substr(0,contenu.length-1);
             }
             t+=contenu+'</script>'+CRLF;
             
             
            }else{
             return logerreur({status:false,message:'erreur dans un javascript contenu dans un html par la fonction ldplusjsondanshtml 0783'});  
            }
            
           }

           var max=l01-1;
           for(var j=i+1;j<l01;j++){
            if(tab[j][3]<=tab[i][3]){
             max=j-1;
             break;
            }
           }
           i=max;
           
           
           
           
          }else if(tab[i][1].toLowerCase()==='javascriptdanshtml'){
           /*
           dans ce cas, c'est un tag <script avec des propriétés 
           */
           var lesProprietes='';
           var indiceDebutJs=-1;
           for(var j=i+1;j<l01 && tab[j][3]>tab[i][3];j++){
            if(tab[j][7]===i){
             if(tab[j][2]==='f'){
              if(tab[j][1]==='' ){
               lesProprietes+=' '+tab[j+1][1]+'="'+tab[j+2][1].replace(/\"/g,'&quot;').replace(/\\/g,'&#92;')+'"';
              }else{
               if(indiceDebutJs===-1){
                indiceDebutJs=j;
               }
              }
             }else{
              if(indiceDebutJs===-1){
               indiceDebutJs=j;
              }
             }
            }
           }
           

           if(indiceDebutJs===-1){
            /*
             c'est une balise <script src=""></script>
            */

             t+=CRLF;
             t+='<script'+lesProprietes+'></script>'+CRLF;
            
           }else{

            /*
             c'est un script dans un html
            */
            
            niveau++;
            ob=parseJavascript0(tab,indiceDebutJs,niveau);
            niveau--;
            
            if(ob.status===true){
             /*
              ===========================================================================================
              ecriture de la valeur dans le cas d'un tag javascriptdanshtml
              ===========================================================================================
             */
             t+=CRLF;
             t+='<script'+lesProprietes+'>'+CRLF;
             t+='//<![CDATA['+CRLF;
             t+='//<source_javascript_rev>'+CRLF;
             t+=ob.value+CRLF;
             t+='//</source_javascript_rev>'+CRLF;
             t+='//]]>'+CRLF
             t+='</script>'+CRLF;
             
             
            }else{
             return logerreur({status:false,message:'erreur dans un javascript contenu dans un html par la fonction javascriptdanshtml 0653'});  
            }
            
           }

           var max=l01-1;
           for(var j=i+1;j<l01;j++){
            if(tab[j][3]<=tab[i][3]){
             max=j-1;
             break;
            }
           }
           i=max;
           
           
          }else{
           /*
             ===========================================================================================
             entrée dans le récursif
             ===========================================================================================
           */
           if(tab[i][1]==='script'){
            /*
              dans le cas du script, on le met à la racine
            */
            ob=this.tabToHtml0(tab,i,dansHead,dansBody,dansJs,noHead,dansPhp,0);
            
            
           }else{
            niveau++;
            ob=this.tabToHtml0(tab,i,dansHead,dansBody,dansJs,noHead,dansPhp,niveau); // appel récursif
            niveau--;
           }
           
           if(ob.status===true){
            /*
             ===========================================================================================
             ecriture de la valeur dans le cas d'un tag html normal
             ===========================================================================================
            */
            t+=ob.value;
            dansBody=ob.dansBody;
            dansHead=ob.dansHead;
            dansJs=ob.dansJs;
           }else{
            return logerreur({status:false,message:'erreur dans un html 0659'});  
           }
           
           
           
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
           t+=tab[i][1].replace(/&amp;gt;/g,'&gt;').replace(/&amp;lt;/g,'&lt;').replace(/&amp;amp;/g,'&amp;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
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
          if(tab[id][13]===''){
           t+=CRLF;
          }else{
           t+=' -->';
          }
          
          
          
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
}
export {traitements_sur_html};